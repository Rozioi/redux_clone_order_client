import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, message, Typography, Tag } from 'antd';
import { ISubscription } from '../../services/api.service';
import ApiService from '../../services/api.service';
import styles from '../../assets/SubscriptionSelection.module.scss';
import { ICategory } from '../../interface/category.interface';
import { useAuth } from '../../context/AuthContext';
import { FaCrown, FaCheck, FaRocket, FaStar, FaBolt } from 'react-icons/fa';

const { Title, Text } = Typography;

const SubscriptionSelection: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<ISubscription | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubscriptions();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await ApiService.getCategories();
      setCategories(data);
    } catch (error) {
      message.error('Не удалось загрузить категории');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const data = await ApiService.getSubscriptions();
      setSubscriptions(data as ISubscription[]);
    } catch (error) {
      message.error('Не удалось загрузить подписки');
    }
  };

  const handleBuy = (subscription: ISubscription) => {
    setSelectedSubscription(subscription);
    setIsModalVisible(true);
  };

  const confirmPurchase = async () => {
    if (!selectedSubscription || !user?._id) {
      message.error('Ошибка: не выбрана подписка или не авторизован пользователь');
      return;
    }

    try {
      const res = await ApiService.createPayment(
        `${selectedSubscription.price}`,
        user._id,
        selectedSubscription._id
      );
      message.success(`Вы выбрали подписку: ${selectedSubscription.name}`);
      setIsModalVisible(false);
      if (res?.payment.confirmation.confirmation_url) {
        window.location.href = res.payment.confirmation.confirmation_url;
      }
    } catch (error) {
      console.error(error);
      message.error('Не удалось начать оплату');
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'premium':
        return <FaCrown className={styles.levelIcon} />;
      case 'medium':
        return <FaRocket className={styles.levelIcon} />;
      default:
        return <FaStar className={styles.levelIcon} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={1} className={styles.title}>
            Выберите подписку
          </Title>
          <Text className={styles.subtitle}>
            Получите доступ к эксклюзивному контенту и расширенным возможностям
          </Text>
        </div>

        <Row gutter={[32, 32]} className={styles.subscriptionsGrid}>
          {subscriptions.map((sub) => (
            <Col xs={24} sm={12} lg={8} key={sub._id}>
              <Card
                className={`${styles.card} ${sub.level === 'premium' ? styles.premium : ''}`}
                bordered={false}
              >
                {sub.level === 'premium' && (
                  <div className={styles.premiumBadge}>
                    <FaCrown />
                    <span>Премиум</span>
                  </div>
                )}

                <div className={styles.cardHeader}>
                  <div className={styles.levelIndicator}>
                    {getLevelIcon(sub.level)}
                    <span className={styles.levelText}>{sub.level}</span>
                  </div>
                  <img src={sub.logo} alt={sub.name} className={styles.logo} />
                  <Title level={3} className={styles.subscriptionName}>
                    {sub.name}
                  </Title>
                </div>

                <div className={styles.price}>
                  <span className={styles.amount}>{sub.price} ₽</span>
                  <span className={styles.duration}>/ {sub.duration} дней</span>
                </div>

                <div className={styles.features}>
                  {sub.features?.map((feature, index) => (
                    <div key={index} className={styles.feature}>
                      <FaCheck className={styles.checkIcon} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.categories}>
                  <Text strong className={styles.categoriesTitle}>
                    Доступные категории:
                  </Text>
                  <div className={styles.categoryTags}>
                    {sub.allowedCategories?.map((catId, i) => {
                      const cat = categories.find(c => c._id === catId);
                      return cat ? (
                        <Tag key={i} className={styles.categoryTag}>
                          {cat.name}
                        </Tag>
                      ) : null;
                    })}
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className={styles.buyButton}
                  onClick={() => handleBuy(sub)}
                  icon={<FaBolt />}
                >
                  Оформить подписку
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={confirmPurchase}
          okText="Подтвердить"
          cancelText="Отмена"
          centered
          className={styles.modal}
          footer={(_, { OkBtn, CancelBtn }) => (
            <div className={styles.modalFooter}>
              <CancelBtn />
              <OkBtn />
            </div>
          )}
        >
          {selectedSubscription && (
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <img src={selectedSubscription.logo} alt={selectedSubscription.name} />
                <Title level={2}>{selectedSubscription.name}</Title>
              </div>

              <div className={styles.modalDetails}>
                <div className={styles.detail}>
                  <Text className={styles.label}>Цена:</Text>
                  <Text className={styles.value}>{selectedSubscription.price} ₽</Text>
                </div>
                <div className={styles.detail}>
                  <Text className={styles.label}>Длительность:</Text>
                  <Text className={styles.value}>{selectedSubscription.duration} дней</Text>
                </div>
              </div>

              <div className={styles.modalFeatures}>
                <Title level={4}>Включено в подписку:</Title>
                {selectedSubscription.features?.map((feature, i) => (
                  <div key={i} className={styles.feature}>
                    <FaCheck className={styles.checkIcon} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Text className={styles.confirmText}>
                Вы уверены, что хотите оформить эту подписку?
              </Text>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SubscriptionSelection;
 