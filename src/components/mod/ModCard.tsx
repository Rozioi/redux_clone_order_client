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
interface ModCardProps {
  mod: IModCard;
  showVideo?: boolean;
  allCategories?: ICategory[]; 
}

const ModCard: React.FC<ModCardProps> = ({ mod, showVideo, allCategories = []}) => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const handleShare = () => {
    if (modState?._id) {
      copyUrl(modState._id, "/mod/");
      setShowNotification(true);
    }
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const [modState, setModState] = useState<IModCard>(mod);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  useEffect(() => {
    const savedVote = localStorage.getItem(`vote-${mod._id}`);
    if (savedVote) setUserVote(savedVote as 'like' | 'dislike');
  }, []);
  
  useEffect(() => {
    const fetchCategoryNames = async () => {
      
      if (!modState.categories) return;
      
      const newCategoryNames: {[key: string]: string} = {};
      
      try {
        const categoriesData = await Promise.all(
          modState.categories.map(category => 
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
    fetchCategoryNames();
  }, []);

  
  useEffect(() => {
    if (userVote) {
      localStorage.setItem(`vote-${mod._id}`, userVote);
    } else {
      localStorage.removeItem(`vote-${mod._id}`);
    }
  }, [userVote]);
  const formateDate = (data: Date | string | undefined): string => {
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
                        <span key={categoryId} className={styles.category}>
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
          <button className={styles.downloadButton}>
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
            <h2>Комментариев пока нет. Будь первым!</h2>
            <button
              className={styles["closeButtonStyles"]}
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          <div className={styles["comment-input-container"]}>
            <textarea
              className={styles["comment-input"]}
              placeholder="Написать комментарий..."
              rows={3}
            />
            <button className={styles["submit-button"]}>Отправить</button>
          </div>
        </div>
      </Modal>
      <Notification
        message="Ссылка скопирована!"
        show={showNotification}
        onHide={() => setShowNotification(false)}
      />
    </div>
  );
};

export default ModCard;
