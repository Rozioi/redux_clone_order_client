import React, { useEffect, useState } from 'react';
import { List, Typography, Badge, Empty, Spin } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { IMessage } from '../interfaces/message';
import { api } from '../services/api';

const { Text } = Typography;

export const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await api.put(`/messages/${messageId}/read`);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (messages.length === 0) {
    return <Empty description="Нет сообщений" />;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(message) => (
        <List.Item
          actions={[
            <Badge 
              dot={!message.isRead} 
              color="blue"
            >
              <MessageOutlined />
            </Badge>
          ]}
          onClick={() => markAsRead(message.id)}
          style={{ 
            cursor: 'pointer',
            backgroundColor: message.isRead ? 'transparent' : '#f0f0f0'
          }}
        >
          <List.Item.Meta
            title={
              <Text strong={!message.isRead}>
                {message.type === 'rejection' ? 'Отказ в публикации' : 'Одобрение публикации'}
              </Text>
            }
            description={
              <>
                <Text>{message.content}</Text>
                <br />
                <Text type="secondary">
                  {new Date(message.createdAt).toLocaleDateString()}
                </Text>
              </>
            }
          />
        </List.Item>
      )}
    />
  );
}; 