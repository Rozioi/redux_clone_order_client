import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button, Space } from 'antd';
import { CheckCircleFilled, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api.service';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  
  useEffect(() => {
    
    const data = ApiService.checkAndUpdatePayment(user?._id || '');
  },[])
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <Result
        status="success"
        icon={<CheckCircleFilled style={{ fontSize: '72px', color: '#52c41a' }} />}
        title={<span style={{ color: '#fff', fontSize: '24px' }}>Оплата успешно завершена!</span>}
        subTitle={<span style={{ color: '#d9d9d9' }}>Спасибо за вашу покупку! Ваша подписка успешно активирована и готова к использованию.</span>}
        extra={[
          <Space key="buttons" size="middle">
            <Button 
              type="primary" 
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Вернуться на главную
            </Button>
            <Button 
              type="default"
              size="large"
              icon={<AppstoreOutlined />}
              onClick={() => navigate('/your-mods')}
            >
              Перейти к моим модам
            </Button>
          </Space>
        ]}
      />
    </div>
  );
}; 