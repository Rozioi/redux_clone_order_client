import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button, Space } from 'antd';
import { CloseCircleFilled, HomeOutlined, ReloadOutlined } from '@ant-design/icons';

export const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <Result
        status="error"
        icon={<CloseCircleFilled style={{ fontSize: '72px', color: '#ff4d4f' }} />}
        title={<span style={{ color: '#fff', fontSize: '24px' }}>Ошибка при оплате</span>}
        subTitle={<span style={{ color: '#d9d9d9' }}>К сожалению, произошла ошибка при обработке платежа. Пожалуйста, проверьте данные карты и попробуйте еще раз.</span>}
        extra={[
          <Space key="buttons" size="middle">
            <Button 
              type="primary" 
              danger
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => navigate('/subscriptions')}
            >
              Попробовать снова
            </Button>
            <Button 
              type="default"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Вернуться на главную
            </Button>
          </Space>
        ]}
      />
    </div>
  );
}; 