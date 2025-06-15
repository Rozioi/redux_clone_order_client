import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api.service';
import styles from '../assets/DeactivateSubscription.module.scss';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeactivateSubscription: React.FC = () => {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeactivate = async () => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить подписку?',
      icon: <ExclamationCircleOutlined />,
      content: 'Внимание! Это действие необратимо. Средства за неиспользованный период не возвращаются.',
      okText: 'Да, удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          setLoading(true);
          if (!user?._id || !subscriptionId) {
            throw new Error('Отсутствуют необходимые параметры');
          }

          const result = await ApiService.deactivateSubscription(user._id, subscriptionId);
          
          if (result.success) {
            navigate('/my-subscriptions', { 
              state: { message: 'Подписка успешно удалена' }
            });
          } else {
            setError('Ошибка при удалении подписки');
          }
        } catch (err) {
          setError('Произошла ошибка при удалении подписки');
          console.error('Deactivation error:', err);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className={`${styles.container} page-without-sidebar`}>
      <div className={styles.content}>
        <h1>Удаление подписки</h1>
        
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.warning}>
          <h2>Внимание!</h2>
          <p>После удаления подписки:</p>
          <ul>
            <li>Подписка будет полностью удалена из вашего аккаунта</li>
            <li>Средства за неиспользованный период не возвращаются</li>
            <li>Вы сможете оформить новую подписку в любое время</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.deactivateButton}
            onClick={handleDeactivate}
            disabled={loading}
          >
            {loading ? 'Удаление...' : 'Удалить подписку'}
          </button>
          
          <button 
            className={styles.cancelButton}
            onClick={() => navigate('/my-subscriptions')}
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateSubscription; 