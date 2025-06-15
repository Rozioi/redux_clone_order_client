import React from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/ModList.module.scss';
import ApiService from '../services/api.service';

interface AdvertisementProps {
    advertisements: Array<{
        _id: string;
        title: string;
        imageUrl: string;
        link: string;
    }>;
}

export const Advertisement: React.FC<AdvertisementProps> = ({ advertisements }) => {
    const navigate = useNavigate();

    const handleClick = async (adId: string, link: string) => {
        // Сначала открываем ссылку
        window.open(link, '_blank');
        
        // Затем отправляем запрос на сервер
        try {
            await ApiService.incrementClicks(adId);
        } catch (error) {
            console.error('Error tracking advertisement click:', error);
        }
    };

    return (
        <div className={styles.advertisementWrapper}>
            <Carousel autoplay>
                {advertisements.map((ad) => (
                    <div key={ad._id} className={styles.advertisementSlide}>
                        <img 
                            src={ad.imageUrl} 
                            alt={ad.title}
                            onClick={() => handleClick(ad._id, ad.link)}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
}; 