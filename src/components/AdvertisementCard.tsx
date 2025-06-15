import React from 'react';
import { Card, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import styles from '../assets/ModCard.module.scss';
import ApiService from '../services/api.service';

const { Title, Paragraph } = Typography;

interface AdvertisementCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
}

export const AdvertisementCard: React.FC<AdvertisementCardProps> = ({
  _id,
  title,
  description,
  imageUrl,
  link,
  buttonText
}) => {
  const handleClick = async () => {
    // Сначала открываем ссылку
    window.open(link, '_blank');
    
    // Затем отправляем запрос на сервер
    try {
      await ApiService.incrementClicks(_id);
    } catch (error) {
      console.error('Error tracking advertisement click:', error);
    }
  };

  return (
    <div className={styles.modCard}>
      <div className={styles.modImage}>
        <img
          src={imageUrl}
          alt={title}
          fetchPriority="high"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-preview.jpg';
          }}
        />
        <div className={styles.advertisementLabel}>
          <span>Реклама</span>
        </div>
      </div>

      <div className={styles.modInfo}>
        <h3 className={styles.modName}>{title}</h3>
        <p className={styles.advertisementDescription}>{description}</p>
        <button className={styles.downloadButton} onClick={handleClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}; 