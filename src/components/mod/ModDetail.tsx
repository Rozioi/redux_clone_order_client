import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api.service';
import { IMod } from '../../interface/mod.interface';
import styles from '../../assets/ModDetail.module.scss';
import { copyClipboard, copyUrl } from "../../utils/clipboard";
import { Notification } from "../Notification";
import clsx from 'clsx';
import { FaDownload, FaShare } from 'react-icons/fa';
import { TbHeart, TbHeartBroken } from 'react-icons/tb';
import MarkdownReact from './MarkdownReact';
import Modal from '../Modal';
import DownloadModal from './DownloadModal';

const ModDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mod, setMod] = useState<IMod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(1); // МБ/с
  const [canAccessCategory, setCanAccessCategory] = useState(true);
  const [quota, setQuota] = useState({
    basic: 1,
    medium: 5,
    premium: 10,
    free: 0.5
  });

  const handleDownload = async () => {
    try {
      if (!mod?.localFilePath) {
        throw new Error('Файл недоступен для скачивания');
      }

      // Обновляем счетчик загрузок
      await ApiService.updateRatingMod(mod._id, 'rating.downloads', 'add');
      
      // Получаем имя файла из пути
      const fileName = mod.localFilePath.split('/').pop();
      if (!fileName) {
        throw new Error('Неверный формат пути к файлу');
      }

      console.log('Скачивание файла:', fileName, 'со скоростью:', downloadSpeed, 'МБ/с');

      // Скачиваем файл с ограничением скорости
      const blob = await ApiService.downloadMod(fileName, downloadSpeed);
      const url = window.URL.createObjectURL(blob);
      
      // Создаем временную ссылку для скачивания
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mod.modName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Обновляем локальное состояние
      setMod(prev => prev ? {
        ...prev,
        rating: {
          ...prev.rating,
          downloads: (prev.rating.downloads || 0) + 1
        }
      } : null);

      setIsDownloadModalOpen(false);
    } catch (err) {
      console.error('Ошибка при скачивании:', err);
      setNotificationMessage('Ошибка при скачивании мода');
      setShowNotification(true);
      setIsDownloadModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchMod = async () => {
      try {
        setLoading(true);
        const fetchedMod = await ApiService.getModById(id!);
        setMod(fetchedMod);
        
        // Проверяем сохраненный голос после загрузки мода
        const savedVote = localStorage.getItem(`vote-${fetchedMod._id}`);
        if (savedVote) setUserVote(savedVote as 'like' | 'dislike');
      } catch (err) {
        setError('Ошибка при загрузке мода');
        console.error('Error fetching mod:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMod();
  }, [id]);

  useEffect(() => {
    const fetchCategoryNames = async () => {
      if (!mod?.categories) return;
      
      const newCategoryNames: Record<string, string> = {};
      
      try {
        const categoriesData = await Promise.all(
          mod.categories.map(category => 
            ApiService.getCategoryById(category)
          )
        );
        
        categoriesData.forEach(category => {
          if (category && category._id) {
            newCategoryNames[category._id] = category.name;
          }
        });
        
        setCategoryNames(newCategoryNames);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (mod) fetchCategoryNames();
  }, [mod]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !mod) return;

      try {
        // Получаем подписки пользователя
        const subscriptions = await ApiService.getUserSubscriptions(user._id);
        const activeSubscription = subscriptions.find(sub => sub.isActive);

        // Проверяем доступ к категории
        if (mod.categories && mod.categories.length > 0) {
          const hasAccess = activeSubscription?.subscription.allowedCategories.some(
            categoryId => mod.categories?.includes(categoryId)
          );
          setCanAccessCategory(hasAccess || false);
        }

        // Устанавливаем скорость загрузки в зависимости от подписки
        if (activeSubscription) {
          switch (activeSubscription.subscription.level) {
            case 'premium':
              setDownloadSpeed(10);
              break;
            case 'medium':
              setDownloadSpeed(5);
              break;
            default:
              setDownloadSpeed(1);
          }
        }
      } catch (err) {
        console.error('Error checking access:', err);
      }
    };

    checkAccess();
  }, [user, mod]);

  useEffect(() => {
    const fetchQuotaSettings = async () => {
      try {
        const settings = await ApiService.getSubscriptionSettings();
        if (settings?.downloadQuota) {
          setQuota(settings.downloadQuota);
          // Обновляем скорость загрузки при получении новых квот
          if (user) {
            const subscriptions = await ApiService.getUserSubscriptions(user._id);
            const activeSubscription = subscriptions.find(sub => sub.isActive);
            
            if (activeSubscription) {
              switch (activeSubscription.subscription.level) {
                case 'premium':
                  setDownloadSpeed(settings.downloadQuota.premium);
                  break;
                case 'medium':
                  setDownloadSpeed(settings.downloadQuota.medium);
                  break;
                default:
                  setDownloadSpeed(settings.downloadQuota.basic);
              }
            } else {
              setDownloadSpeed(settings.downloadQuota.free);
            }
          } else {
            setDownloadSpeed(settings.downloadQuota.free);
          }
        }
      } catch (err) {
        console.error('Error fetching quota settings:', err);
      }
    };

    fetchQuotaSettings();
  }, [user]);

  const handleUpdateRating = async (voteType: 'like' | 'dislike') => {
    if (!mod) return;

    const prevVote = userVote;
    const isSameVote = prevVote === voteType;
    const newVote = isSameVote ? null : voteType;

    // Оптимистичное обновление
    setUserVote(newVote);
    const updatedMod = { ...mod };

    // Убираем предыдущий голос если был
    if (prevVote) {
      updatedMod.rating[prevVote] = Math.max(0, updatedMod.rating[prevVote] - 1);
    }

    // Добавляем новый голос если это не снятие голоса
    if (!isSameVote) {
      updatedMod.rating[voteType] = (updatedMod.rating[voteType] || 0) + 1;
    }

    setMod(updatedMod);

    try {
      // Сначала убираем предыдущий голос если был
      if (prevVote) {
        await ApiService.updateRatingMod(mod._id, `rating.${prevVote}`, 'remove');
      }

      // Затем добавляем новый если нужно
      if (!isSameVote) {
        await ApiService.updateRatingMod(mod._id, `rating.${voteType}`, 'add');
      }

      // Обновляем localStorage
      if (newVote) {
        localStorage.setItem(`vote-${mod._id}`, newVote);
      } else {
        localStorage.removeItem(`vote-${mod._id}`);
      }
    } catch (error) {
      // Откатываем изменения при ошибке
      setUserVote(prevVote);
      setMod(mod);
      console.error('Ошибка обновления рейтинга:', error);
      setNotificationMessage('Ошибка при голосовании');
      setShowNotification(true);
    }
  };

  const formateDate = (data: Date | string | undefined): string => {
    if (!data) return "N/A";
    const date = new Date(data);
    return date.toLocaleDateString("ru-RU", {});
  };

  const handleShare = () => {
    if (mod?._id) {
      copyUrl(mod._id, "/mod/");
      setNotificationMessage("Ссылка скопирована!");
      setShowNotification(true);
    }
  };

  const handleDownloadClick = async () => {
    if (!user) {
      setIsDownloadModalOpen(true);
      return;
    }

    try {
      // Получаем подписки пользователя
      const subscriptions = await ApiService.getUserSubscriptions(user._id);
      const activeSubscription = subscriptions.find(sub => sub.isActive);

      // Проверяем доступ к категории
      if (mod?.categories && mod.categories.length > 0) {
        const hasAccess = activeSubscription?.subscription.allowedCategories.some(
          categoryId => mod.categories?.includes(categoryId)
        );
        setCanAccessCategory(hasAccess || false);
      }

      // Устанавливаем скорость загрузки на основе текущих квот
      if (activeSubscription) {
        switch (activeSubscription.subscription.level) {
          case 'premium':
            setDownloadSpeed(quota.premium);
            break;
          case 'medium':
            setDownloadSpeed(quota.medium);
            break;
          default:
            setDownloadSpeed(quota.basic);
        }
      } else {
        setDownloadSpeed(quota.free);
      }

      if (!canAccessCategory) {
        setNotificationMessage('Для доступа к этому моду требуется подписка');
        setShowNotification(true);
        return;
      }

      setIsDownloadModalOpen(true);
    } catch (err) {
      console.error('Error checking access:', err);
      setNotificationMessage('Ошибка при проверке доступа');
      setShowNotification(true);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h2 className={styles.notFoundTitle}>Мод не найден</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modDetail}>
      <div className={styles.videoFrame}>
        {mod.youtubeLink ? (
          <iframe
            src={`https://www.youtube.com/embed/${mod.youtubeLink.split('v=')[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            src={mod.previewLink}
            alt={mod.modName}
            fetchPriority="high"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-preview.jpg';
            }}
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.promoImage}>
            <img src="https://steamuserimages-a.akamaihd.net/ugc/867370346063551919/1012069FD95DF8865BF63B779497C65D08120678/" alt="Promo" />
            <div className={styles.backButton} onClick={() => setIsOpen(true)}>
              Описание
            </div>
          </div>
          <div className={styles.infoBlock}>
            <h1 className={styles.title}>{mod.modName}</h1>
            <div className={styles.categories}>
              {mod.categories?.map((category) => (
                <div key={category} className={styles.category}>
                  {categoryNames[category]}
                </div>
              ))}
            </div>
            <div className={styles.topActions}>
              <div className={styles.backButton} onClick={() => navigate(-1)}>
                Назад
              </div>
              <div className={styles.verified}>
                <span>Verifed</span>
                <span className={styles.verifiedIcon}>✓</span>
              </div>
              <button 
                className={styles.downloadButton}
                onClick={handleDownloadClick}
              >
                <FaDownload /> Скачать
              </button>
            </div>
            <div className={styles.metaInfo}>
              <span
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                  const target = e.currentTarget;
                  const textToCopy = mod.isVisibleDiscord
                    ? mod.discord
                    : "скрыто";

                  if (textToCopy) {
                    copyClipboard(`${window.location.origin}/user/${mod.discord}`);
                    const originalText = target.textContent;
                    target.textContent = "Скопировано!";
                    setTimeout(() => {
                      target.textContent = originalText;
                    }, 1500);
                  }
                }}
                className={styles.discord}
              >
                {mod.isVisibleDiscord ? `${mod.discord}` : `скрыто`}
              </span>
              <span className={styles.size}>{mod.size}</span>
              <span className={styles.date}>
                {formateDate(mod.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.bottomActions}>
          <div className={styles.actionEstimateButton}>
            <div onClick={() => handleUpdateRating('like')}>
              <TbHeart 
                className={clsx(
                  styles.likeIcon,
                  userVote === 'like' && styles.activeLike
                )}
              />
              {mod.rating.like}
            </div>
            
            <div onClick={() => handleUpdateRating('dislike')}>
              <TbHeartBroken 
                className={clsx(
                  userVote === 'dislike' && styles.activeDislike
                )}
              />
              {mod.rating.dislike}
            </div>
          </div>
          <button
            className={styles.shareButton}
            onClick={handleShare}
          >
            По приказу
            <FaShare />
          </button>
          {mod.archivePassword && (
            <div 
              onClick={() => {
                copyClipboard(mod.archivePassword || '');
                setNotificationMessage("Пароль скопирован!");
                setShowNotification(true);
              }} 
              className={styles.password}
            > 
              <p>Пароль от архива: <span>{mod.archivePassword}</span></p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen}>
        
        <div className={styles['modal-content']}>
          <div className={styles["modal-header"]}>
            <h2>Описание</h2>
            <button
              className={styles["closeButtonStyles"]}
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
           <MarkdownReact content={mod.description} />
        </div>
      </Modal>
      
      <Notification 
        message={notificationMessage}
        show={showNotification} 
        onHide={() => setShowNotification(false)} 
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
        modName={mod?.modName || ''}
        downloadSpeed={downloadSpeed}
        isPremium={downloadSpeed > quota.medium}
        quota={quota}
      />
    </div>
  );
};

export default ModDetail;