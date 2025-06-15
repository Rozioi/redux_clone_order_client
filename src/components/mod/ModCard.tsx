import React, { useEffect, useState } from "react";
import styles from "../../assets/ModCard.module.scss";
import { FaInfo, FaShare, FaDownload, FaRegComments } from "react-icons/fa";
import clsx from 'clsx';
import { IModCard } from "../../interfaces/mod.interface";
import { TbHeart, TbHeartBroken } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { copyClipboard, copyUrl } from "../../utils/clipboard";
import ApiService from '../../services/api.service';
import { Notification } from "../Notification";
import { ICategory } from "../../interface/category.interface";
import { useAuth } from "../../context/AuthContext";
import { IUser } from "../../interface/user.interface";
import DownloadModal from './DownloadModal';

interface ModCardProps {
  mod: IModCard;
  showVideo?: boolean;
  allCategories?: ICategory[]; 
}

export interface IComments {
  _id: string;
  modId: string;
  userId: string;
  content: string;
  createAt: Date;
}

const ModCard: React.FC<ModCardProps> = ({ mod, showVideo, allCategories = []}) => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [comments, setComments] = useState<IComments[]>([]);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [modState, setModState] = useState<IModCard>(mod);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(1);
  const [canAccessCategory, setCanAccessCategory] = useState(true);
  const [quota, setQuota] = useState({
    basic: 1,
    medium: 5,
    premium: 10,
    free: 0.0001
  });

  useEffect(() => {
    const savedVote = localStorage.getItem(`vote-${mod._id}`);
    if (savedVote) setUserVote(savedVote as 'like' | 'dislike');
  }, []);

  const fetchComments = async () => {
    const result = await ApiService.GetCommentsByModId(modState._id);
    setComments(result);
  }

  useEffect(() => {
    fetchComments();
  },[])

  useEffect(() => {
    const fetchQuotaSettings = async () => {
      try {
        const settings = await ApiService.getSubscriptionSettings();
        if (settings?.downloadQuota) {
          setQuota(settings.downloadQuota);
        }
      } catch (err) {
        console.error('Error fetching quota settings:', err);
      }
    };

    fetchQuotaSettings();
  }, []);

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
      if (modState.categories && modState.categories.length > 0) {
        const hasAccess = activeSubscription?.subscription.allowedCategories.some(
          categoryId => modState.categories?.includes(categoryId)
        );
        setCanAccessCategory(hasAccess || false);
      }

      // Устанавливаем скорость загрузки
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
    }
  };

  const handleDownload = async () => {
    try {
      if (!modState.localFilePath) {
        throw new Error('Файл недоступен для скачивания');
      }

      // Обновляем счетчик загрузок
      await ApiService.updateRatingMod(modState._id, 'rating.downloads', 'add');
      
      // Создаем временную ссылку для скачивания
      const link = document.createElement('a');
      link.href = modState.localFilePath;
      link.download = `${modState.modName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloadModalOpen(false);
    } catch (err) {
      setNotificationMessage('Ошибка при скачивании мода');
      setShowNotification(true);
      setIsDownloadModalOpen(false);
    }
  };

  const handleShare = () => {
    copyUrl(modState._id, "/mod/");
    setNotificationMessage("Ссылка скопирована!");
    setShowNotification(true);
  };

  const getUserName = async (userId: string): Promise<string> => {
    try {
      const user = await ApiService.getUserById(userId);
      return user.username || 'User';
    } catch (error) {
      console.error('Error fetching user:', error);
      return 'User';
    }
  };

  const [userNames, setUserNames] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const names: {[key: string]: string} = {};
      for (const comment of comments) {
        if (!names[comment.userId]) {
          names[comment.userId] = await getUserName(comment.userId);
        }
      }
      setUserNames(names);
    };

    if (comments.length > 0) {
      fetchUserNames();
    }
  }, [comments]);

  useEffect(() => {
    if (userVote) {
      localStorage.setItem(`vote-${mod._id}`, userVote);
    } else {
      localStorage.removeItem(`vote-${mod._id}`);
    }
  }, [userVote]);

  const formateDate = (data: Date | string | undefined): string => {
    console.log(data);
    if (!data) return "N/A";
    const date = new Date(data);
    const formDate = date.toLocaleDateString("ru-RU", {});
    return formDate;
  };

  const handleUpdateRating = async (
    newVote: 'like' | 'dislike' | null, 
    modId: string
  ) => {
    const prevVote = userVote;
    
    try {
      const operation: 'add' | 'remove' = newVote === prevVote ? 'remove' : 'add';
      const finalVote = operation === 'add' ? newVote : null;
      setUserVote(finalVote);
      const updatedMod = { ...mod };
  
      if (operation === 'add' && newVote) {
        updatedMod.rating[newVote] += 1;
        if (prevVote) {
          await ApiService.updateRatingMod(
            modId,
            `rating.${prevVote}`, 
            'remove'
          );
          updatedMod.rating[prevVote] -= 1;
        }
      } else if (operation === 'remove' && prevVote) {
        updatedMod.rating[prevVote] -= 1;
      }
  
      setModState(updatedMod);
  
      const result = await ApiService.updateRatingMod(
        modId,
        `rating.${newVote || prevVote}`, 
        operation
      );
  
      if (!result) throw new Error('Update failed');
    } catch (error) {
      setUserVote(prevVote);
      setModState({ ...mod });
      console.error('Ошибка обновления рейтинга:', error);
    }
  };
  
  const HandleSubmitComment = async () => {
    if (!comment.trim() || !user?._id) return;
  
    try {
      // Создаем временный комментарий для мгновенного отображения
      const tempComment = {
        _id: `temp-${Date.now()}`,
        modId: modState._id,
        userId: user._id,
        content: comment,
        createAt: new Date()
      };
  
      // Локальное обновление
      setComments(prev => [tempComment, ...prev]);
      setUserNames(prev => ({
        ...prev,
        [user._id]: user.username || 'User'
      }));
      setComment('');
  
      // Отправка на сервер
      await ApiService.CreateComment({
        modId: modState._id,
        userId: user._id,
        content: comment
      });
  
      // Обновляем список комментариев с сервера
      fetchComments();
      
    } catch (error) {
      console.error('Ошибка при отправке комментария:', error);
      // Можно добавить уведомление об ошибке
    }
  };

  return (
    <div className={styles.modCard}>
      <div className={styles.modImage}>
        {showVideo && modState.youtubeLink ? (
          <div className={styles.iframeWrapper}>
            <iframe
            src={`https://www.youtube.com/embed/${modState.youtubeLink.split('v=')[1]}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            <img
              src={modState.previewLink}
              alt={modState.modName}
              fetchPriority="high"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-preview.jpg';
              }}
            />
            <div className={`${styles.placeholder} ${styles.hidden}`}>
              <span>Изображение недоступно</span>
            </div>
          </>
        )}
      </div>

      <div className={styles.modInfo}>
        <h3 className={styles.modName}>{mod.modName}</h3>

        <div className={styles.categoriesAndComments}>
          <div className={styles.categories}>
            {modState.categories?.map((categoryId) => {
                      const category = allCategories.find((c) => c._id === categoryId);
                      return (
                        <span key={categoryId} onClick={() => {
                          navigate(`/${category?.name}`)
                        }} className={styles.category}>
                          {category?.name || 'Unknown'}
                        </span>
                      );
                    })}
          </div>

          <button
            className={styles.commentsButton}
            onClick={() => setIsOpen(true)}
          >
            comments
            <FaRegComments />
          </button>
        </div>

        <div className={styles.actions}>
          <div className={styles.actionEstimateButton}>
            <div onClick={() => handleUpdateRating('like', modState._id)}>
              <TbHeart 
                className={clsx(
                  styles.likeIcon,
                  userVote === 'like' && styles.activeLike
                )}
              />
              {modState.rating.like}
            </div>
            
            <div onClick={() => handleUpdateRating('dislike', modState._id)}>
              <TbHeartBroken 
                className={clsx(
                  userVote === 'dislike' && styles.activeDislike
                )}
              />
              {modState.rating.dislike}
            </div>
          </div>
          <button
            className={styles.actionButton}
            onClick={handleShare}
          >
            По приказу
            <FaShare />
          </button>
        </div>

        <div className={styles.details}>
          <div
            title="Описание и т.д"
            onClick={() => navigate(`/mod/${modState._id}`)}
            className={styles.detailsButton}
          >
            <span>Details</span>
            <FaInfo />
          </div>
          <div className={styles.verified}>
            <span>Verifed</span>
            <span className={styles.verifiedIcon}>✓</span>
          </div>
          <button 
            className={styles.downloadButton} 
            onClick={handleDownloadClick}
            disabled={!modState.localFilePath}
          >
            <span>{modState.rating.downloads?.toLocaleString() ?? 0}</span>
            <FaDownload />
          </button>
        </div>

        <div className={styles.metaInfo}>
          <span
            onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              const target = e.currentTarget;
              const textToCopy = modState.isVisibleDiscord
                ? modState.discord
                : "скрыто";

              if (textToCopy) {
                copyClipboard(`${window.location.origin}/user/${modState.discord}`);
                const originalText = target.textContent;
                target.textContent = "Скопировано!";
                setTimeout(() => {
                  target.textContent = originalText;
                }, 1500);
              }
            }}
            className={styles.discord}
          >
            {modState.isVisibleDiscord ? `${modState.discord}` : `скрыто`}
          </span>
          <span className={styles.size}>{modState.size}</span>
          <span className={styles.date}>{formateDate(modState.createdAt)}</span>
        </div>
      </div>
      <Modal isOpen={isOpen}>
        <div className={styles["modal-content"]}>
          <div className={styles["modal-header"]}>
            <h2>{comments.length ? 'Комментарии' : 'Будь первым!'}</h2>
            <button
              className={styles["closeButtonStyles"]}
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          {comments.length > 0 && (
              <div className={styles["comments-list"]}>
                {comments.map(comment => {
                  
                  return (
                    <div key={comment._id} className={styles.comment}>
                      <strong>{userNames[comment.userId] || 'User'}:</strong>
                      <p>{comment.content}</p>
                      <span>{formateDate(comment.createAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          <div className={styles["comment-input-container"]}>
            <textarea
              className={styles["comment-input"]}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Написать комментарий..."
              rows={3}
            />
            <button onClick={HandleSubmitComment}  className={styles["submit-button"]}>Отправить</button>
          </div>
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
        modName={mod.modName}
        downloadSpeed={downloadSpeed}
        isPremium={downloadSpeed > quota.medium}
        quota={quota}
      />
    </div>
  );
};

export default ModCard;
