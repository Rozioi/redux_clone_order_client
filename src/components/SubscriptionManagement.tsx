import React, { useState, useEffect } from 'react';
import { ISubscription, ISubscriptionFormData } from '../interfaces/subscription.interface';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Select, message, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from '../assets/SubscriptionManagement.module.scss';
import ApiService from '../services/api.service';
import { ICategory } from '../interface/category.interface';

const { Option } = Select;

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<ISubscription | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<ICategory[]>([]);
  
  useEffect(() => {
    fetchCategories();
    fetchSubscriptions();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await ApiService.getCategories(); 
      setCategories(response);
    } catch (error) {
      message.error('Ошибка при загрузке категорий');
    }
  };


  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await ApiService.getSubscriptions();
      setSubscriptions(response);
    } catch (error) {
      message.error('Ошибка при загрузке подписок');
    }
  };

  const handleAddEdit = (subscription?: ISubscription) => {
    if (subscription) {
      setEditingSubscription(subscription);
      form.setFieldsValue(subscription);
    } else {
      setEditingSubscription(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' });
      message.success('Подписка удалена');
      fetchSubscriptions();
    } catch (error) {
      message.error('Ошибка при удалении подписки');
    }
  };

  const handleSubmit = async (values: ISubscriptionFormData) => {
    try {
      if (editingSubscription) {
        // Обновляем существующую подписку
        await ApiService.updateSubscription(editingSubscription._id, {
          ...values,
          isActive: values.isActive ?? editingSubscription.isActive
        });
        message.success('Подписка обновлена');
      } else {
        // Создаем новую подписку
        await ApiService.createSubscription(values);
        message.success('Подписка создана');
      }
      
      setIsModalVisible(false);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
      message.error('Ошибка при сохранении подписки');
    }
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price} ₽`,
    },
    {
      title: 'Длительность (дней)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Разрешенные категории',
      dataIndex: 'allowedCategories',
      key: 'allowedCategories',
      render: (ids: string[]) => {
        const names = ids.map(id => {
          const category = categories.find(c => c._id === id);
          return category?.name || id;
        });
        return names.join(', ');
      },
    },

    {
      title: 'Активна',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => isActive ? 'Да' : 'Нет',
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        switch (level) {
          case 'basic': return 'Базовый';
          case 'medium': return 'Средний';
          case 'premium': return 'Премиум';
          default: return level;
        }
      },
    },
    {
      title: 'Логотип',
      dataIndex: 'logo',
      key: 'logo',
      render: (url: string) => <img src={url} alt="logo" style={{ height: 32 }} />,
    },
    {
      title: 'Особенности',
      dataIndex: 'features',
      key: 'features',
      render: (features: string[]) => Array.isArray(features) ? features.join(', ') : '',

    },

    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: ISubscription) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleAddEdit(record)}
            style={{ marginRight: 8 }}
            className={styles.actionButton}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
            className={styles.actionButton}
          />
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleAddEdit()}
        className={styles.addButton}
      >
        Добавить подписку
      </Button>

      <Table
        columns={columns}
        dataSource={subscriptions}
        rowKey="_id"
        className={styles.table}
      />

      <Modal
        title={editingSubscription ? 'Редактировать подписку' : 'Новая подписка'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className={styles.modal}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: 'Введите цену' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Длительность (дней)"
            rules={[{ required: true, message: 'Введите длительность' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="level"
            label="Уровень"
            rules={[{ required: true, message: 'Выберите уровень' }]}
          >
            <Select placeholder="Выберите уровень">
              <Option value="basic">Базовый</Option>
              <Option value="medium">Средний</Option>
              <Option value="premium">Премиум</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="logo"
            label="URL логотипа"
            rules={[{ required: true, message: 'Введите URL логотипа' }]}
          >
            <Input placeholder="https://example.com/logo.png" />
          </Form.Item>
          
          <Form.Item
            name="features"
            label="Особенности"
          >
            <Select mode="tags" placeholder="Введите особенности">
              {/* Можно заранее не заполнять — `tags` позволяет вводить свободный текст */}
            </Select>
          </Form.Item>

          <Form.Item
            name="allowedCategories"
            label="Разрешенные категории"
            rules={[{ required: true, message: 'Выберите категории' }]}
          >
            <Select mode="multiple" placeholder="Выберите категории">
              {categories.map(category => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Активна"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submitButton}>
              {editingSubscription ? 'Сохранить' : 'Создать'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement; 