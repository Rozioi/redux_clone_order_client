import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { AdvertisementCard } from './AdvertisementCard';
import { IAdvertisement } from '../interfaces/advertisement';
import ApiService from '../services/api.service';
import styles from '../assets/ModList.module.scss';

export const AdvertisementCarousel: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<IAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const data = await ApiService.getAdvertisements();
      setAdvertisements(data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || advertisements.length === 0) {
    return null;
  }

  return (
    <div className={styles.advertisementWrapper}>
      <Carousel autoplay>
        {advertisements.map((ad) => (
          <div key={ad._id} className={styles.advertisementSlide}>
            <AdvertisementCard
              _id={ad._id}
              title={ad.title}
              description={ad.description}
              imageUrl={ad.imageUrl}
              link={ad.link}
              buttonText={ad.buttonText}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}; 