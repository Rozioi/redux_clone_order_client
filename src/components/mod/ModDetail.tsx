import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api.service';
import { IMod, IReview, IReviewCreate } from '../../interface/mod.interface';
import styles from '../../assets/ModDetail.module.scss';
import { copyClipboard, copyUrl } from "../../utils/clipboard";
import { Notification } from "../Notification";

import { FaDownload, FaShare } from 'react-icons/fa';
import { TbHeart, TbHeartBroken } from 'react-icons/tb';

const ModDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [mod, setMod] = useState<IMod | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const formateDate = (data: Date | string | undefined): string => {
      if (!data) return "N/A";
      const date = new Date(data);
      const formDate = date.toLocaleDateString("ru-RU", {});
      return formDate;
    };
  
    const handleShare = () => {
      if (mod){
        setNotificationMessage("Ссылка скопирована!");
        if (mod._id) {
          copyUrl(mod._id, "/mod/");
          setShowNotification(true);
        }
      }
    };
  useEffect(() => {
    const fetchMod = async () => {
      try {
        setLoading(true);
        const fetchedMod = await ApiService.getModById(id!);
        console.log('fdsada',fetchedMod);
        setMod(fetchedMod);
      } catch (err) {
        setError('Ошибка при загрузке мода');
        console.error('Error fetching mod:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMod();
  }, [id]);

  // const handleReviewSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!id || !newReview.text.trim()) return;

  //   try {
  //     const review = await ApiService.createReview(id, newReview);
  //     setMod(prev => prev ? {
  //       ...prev,
  //       reviews: [...prev.reviews, review]
  //     } : null);
  //     setNewReview({ rating: 5, text: '' });
  //   } catch (err) {
  //     setError('Ошибка при отправке отзыва');
  //     console.error('Error submitting review:', err);
  //   }
  // };

  const handleDeleteMod = async () => {
    if (!id) return;

    try {
      await ApiService.deleteMod(id);
      navigate('/mods');
    } catch (err) {
      setError('Ошибка при удалении мода');
      console.error('Error deleting mod:', err);
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
          <iframe
            src={`https://www.youtube.com/embed/${mod.youtubeLink}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
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
                  <div key={category._id} className={styles.category}>
                    {category.name}
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
                      copyClipboard(textToCopy);
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
              <div className={styles.actionButton}>
                <TbHeart />
                {mod.rating.like}
              </div>
              <div className={styles.actionButton}>
                <TbHeartBroken />
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
            {mod.archivePassword && <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              setNotificationMessage("Пароль скопирован!");
              if (mod.archivePassword){
                copyClipboard(mod.archivePassword);
                setShowNotification(true);
              }
              
            }} className={styles.password}> 
              <p>Пароль от архива:</p>
              <p>{mod.archivePassword}</p>
            </div>}
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