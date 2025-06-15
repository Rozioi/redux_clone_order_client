import React, { useEffect, useState } from 'react';
import { Table, Switch, Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ICategory } from '../../interfaces/category';
import { api } from '../../services/api';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      message.error('Ошибка при загрузке категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePremium = async (category: ICategory) => {
    try {
      await api.put(`/categories/${category.id}`, {
        ...category,
        isPremium: !category.isPremium
      });
      fetchCategories();
      message.success('Статус категории обновлен');
    } catch (error) {
      message.error('Ошибка при обновлении категории');
    }
  };

  const handleToggleFree = async (category: ICategory) => {
    try {
      await api.put(`/categories/${category.id}`, {
        ...category,
        allowedForFree: !category.allowedForFree
      });
      fetchCategories();
      message.success('Статус категории обновлен');
    } catch (error) {
      message.error('Ошибка при обновлении категории');
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      fetchCategories();
      message.success('Категория удалена');
    } catch (error) {
      message.error('Ошибка при удалении категории');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, values);
        message.success('Категория обновлена');
      } else {
        await api.post('/categories', values);
        message.success('Категория создана');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Ошибка при сохранении категории');
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
      title: 'Премиум',
      key: 'isPremium',
      render: (_: unknown, record: ICategory) => (
        <Switch
          checked={record.isPremium}
          onChange={() => handleTogglePremium(record)}
        />
      ),
    },
    {
      title: 'Доступно бесплатно',
      key: 'allowedForFree',
      render: (_: unknown, record: ICategory) => (
        <Switch
          checked={record.allowedForFree}
          onChange={() => handleToggleFree(record)}
        />
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: ICategory) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditingCategory(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Добавить категорию
      </Button>

      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingCategory ? 'Редактировать категорию' : 'Новая категория'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название категории' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание категории' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? 'Сохранить' : 'Создать'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 