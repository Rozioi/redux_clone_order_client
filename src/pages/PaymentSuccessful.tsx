import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api.service';
import styles from '../assets/PaymentSuccessful.module.scss';

const PaymentSuccessful: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPayment = async () => {
      try {
        setLoading(true);     
        if (!user?._id) {
          throw new Error('Отсутствуют необходимые параметры');
        }

        const result = await ApiService.checkAndUpdatePayment(user._id);
        
        if (result.success) {
          setTimeout(() => {
            navigate('/my-subscriptions');
          }, 1000);
        } else {
          setError('Ошибка при проверке платежа');
        }
      } catch (err) {
        setError('Произошла ошибка при проверке платежа');
        console.error('Payment check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [searchParams, user, navigate]);

  if (loading) {
    return (
      <div className={`${styles.container} page-without-sidebar`}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Проверка платежа...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} page-without-sidebar`}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/my-subscriptions')}>
            Вернуться к подпискам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} page-without-sidebar`}>
      <div className={styles.success}>
        <h2>Платеж успешно обработан</h2>
        <p>Перенаправление на страницу подписок...</p>
      </div>
    </div>
  );
};

export default PaymentSuccessful; 