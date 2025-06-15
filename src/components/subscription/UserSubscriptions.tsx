import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api.service';
import { IUserSubscription } from '../../interfaces/subscription.interface';
import { ICategory } from '../../interface/category.interface';
import styles from '../../assets/UserSubscriptions.module.scss';
import { FaCrown, FaCheck, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const UserSubscriptions: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<IUserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getCategories();
        const categoriesMap = categoriesData.reduce((acc: {[key: string]: string}, category: ICategory) => {
          if (category._id) {
            acc[category._id] = category.name;
          }
          return acc;
        }, {} as {[key: string]: string});
        setCategories(categoriesMap);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        if (authLoading) {
          return;
        }
        
        if (!user || !user._id) {
          navigate('/login');
          return;
        }
        
        const data = await ApiService.getUserSubscriptions(user._id);
        setSubscriptions(data);
      } catch (err) {
        setError('Ошибка при загрузке подписок');
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user, navigate, authLoading]);

  const handleDeactivate = (subscriptionId: string) => {
    navigate(`/deactivate-subscription/${subscriptionId}`);
  };

  if (authLoading || loading) {
    return (
      <div className={`${styles.loadingContainer} page-without-sidebar`}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${styles.errorContainer} page-without-sidebar`}>
        <h2>Требуется авторизация</h2>
        <p>Пожалуйста, войдите в систему для просмотра подписок</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.errorContainer} page-without-sidebar`}>
        <h2>Ошибка</h2>
        <p>{error}</p>
      </div>
    );
  }

  const hasActiveSubscription = subscriptions.some(sub => sub.isActive);

  return (
    <div className={`${styles.container} page-without-sidebar`}>
      <div className={styles.header}>
        <h1>Мои подписки</h1>
        <Button 
          type="primary"
          icon={<FaPlus />}
          onClick={() => navigate('/subscriptions')}
          disabled={hasActiveSubscription}
        >
          {hasActiveSubscription ? 'У вас уже есть активная подписка' : 'Оформить подписку'}
        </Button>
      </div>
      
      <div className={styles.subscriptionsGrid}>
        {subscriptions.map((userSubscription) => (
          <div 
            key={userSubscription._id} 
            className={`${styles.subscriptionCard} ${userSubscription.isActive ? styles.active : ''}`}
          >
            <div className={styles.subscriptionHeader}>
              <div className={styles.logo}>
                <img src={userSubscription.subscription.logo} alt={userSubscription.subscription.name} />
              </div>
              <h2>{userSubscription.subscription.name}</h2>
              <span className={styles.level}>{userSubscription.subscription.level}</span>
            </div>

            <div className={styles.price}>
              <span className={styles.amount}>{userSubscription.subscription.price} ₽</span>
              <span className={styles.period}>/ {userSubscription.subscription.duration} дней</span>
            </div>

            <div className={styles.description}>
              <p>{userSubscription.subscription.description}</p>
            </div>

            <div className={styles.status}>
              <span className={userSubscription.isActive ? styles.active : styles.inactive}>
                {userSubscription.isActive ? 'Активна' : 'Неактивна'}
              </span>
            </div>

            <div className={styles.dates}>
              <p>Начало: {new Date(userSubscription.startDate).toLocaleDateString()}</p>
              {userSubscription.endDate && new Date(userSubscription.endDate).getTime() > 0 && (
                <p>Окончание: {new Date(userSubscription.endDate).toLocaleDateString()}</p>
              )}
            </div>

            {userSubscription.subscription.allowedCategories && (
              <div className={styles.categories}>
                <h3>Доступные категории:</h3>
                <ul>
                  {userSubscription.subscription.allowedCategories.map((categoryId, index) => (
                    <li key={index}>
                      <FaCheck className={styles.checkIcon} />
                      {categories[categoryId] || `Категория ${index + 1}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            
              <div className={styles.actions}>
                <Button 
                  danger
                  onClick={() => handleDeactivate(userSubscription._id)}
                >
                  Удалить подписку
                </Button>
              </div>
            
          </div>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <div className={styles.noSubscriptions}>
          <FaCrown className={styles.crownIcon} />
          <h2>У вас пока нет активных подписок</h2>
          <p>Приобретите подписку, чтобы получить доступ к эксклюзивному контенту</p>
          <Button 
            type="primary"
            icon={<FaPlus />}
            onClick={() => navigate('/subscriptions')}
            size="large"
          >
            Оформить подписку
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserSubscriptions; 