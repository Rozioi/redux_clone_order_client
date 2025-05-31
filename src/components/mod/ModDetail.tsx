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
      
      const newCategoryNames: {[key: string]: string} = {};
      
      try {
        const categoriesData = await Promise.all(
          mod.categories.map(category => 
            ApiService.getCategoryById(category)
          )
        );
        
        categoriesData.forEach(category => {
          if (category) {
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
            <img src="https://reduxhub.ru/assets/img/promo2.webp" alt="Promo" />
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
              <button className={styles.downloadButton}>
                <span>{mod.rating.downloads?.toLocaleString() ?? 0}</span>
                <FaDownload />
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
                setNotificationMessage("Пароль скопирован!");
                if (mod.archivePassword) { copyClipboard(mod.archivePassword);  setShowNotification(true);}; 
               
              }} 
              className={styles.password}
            > 
              <p>Пароль от архива:</p>
              <p>{mod.archivePassword}</p>
            </div>
          )}
        </div>
      </div>
      
      <Notification 
        message={notificationMessage}
        show={showNotification} 
        onHide={() => setShowNotification(false)} 
      />
    </div>
  );
};

export default ModDetail;