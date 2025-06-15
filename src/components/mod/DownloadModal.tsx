import React, { useState, useEffect } from 'react';
import styles from '../../assets/ModDetail.module.scss';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => Promise<void>;
  modName: string;
  downloadSpeed: number;
  isPremium: boolean;
  quota: {
    basic: number;
    medium: number;
    premium: number;
    free: number;
  };
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  modName,
  downloadSpeed,
  isPremium,
  quota
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [isDownloading, setIsDownloading] = useState(false);

  const getSpeedColor = (speed: number) => {
    if (speed >= quota.premium) return '#ff4444';
    if (speed >= quota.medium) return '#ff6b6b';
    if (speed >= quota.basic) return '#6cffa7';
    return '#ffa726';
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && !user) {
      setCountdown(15);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isOpen, user]);

  const handleDownload = async () => {
    if (!user) {
      if (countdown === 0) {
        setIsDownloading(true);
        try {
          await onDownload();
        } finally {
          setIsDownloading(false);
          onClose();
        }
      }
      return;
    }

    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
      onClose();
    }
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Скачать {modName}</h2>
          <button onClick={onClose} className={styles.closeButton}>✖</button>
        </div>
        
        <div className={styles.downloadInfo}>
          <div className={styles.speedInfo}>
            <p>
              Скорость загрузки: 
              <span style={{ color: getSpeedColor(downloadSpeed) }}>
                {downloadSpeed} МБ/с
              </span>
            </p>
            {isPremium && <span className={styles.premiumBadge}>Премиум</span>}
          </div>
          
          {!user && (
            <div className={styles.countdown}>
              <p>Скачивание будет доступно через: <span>{countdown} сек</span></p>
              <button onClick={handleLogin} className={styles.loginButton}>
                Войти для мгновенного скачивания
              </button>
            </div>
          )}
        </div>

        <div className={styles.downloadActions}>
          <button
            onClick={handleDownload}
            disabled={(!user && countdown > 0) || isDownloading}
            className={styles.downloadButton}
          >
            {isDownloading ? 'Скачивание...' : 'Скачать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal; 