import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, InputNumber, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IAdvertisement } from '../../interfaces/advertisement';
import ApiService from '../../services/api.service';

export const AdvertisementManager: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<IAdvertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAd, setEditingAd] = useState<IAdvertisement | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAdvertisementsForAdmin();  
      setAdvertisements(data);
    } catch (error) {
      message.error('Ошибка при загрузке рекламы');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad: IAdvertisement) => {
    setEditingAd(ad);
    form.setFieldsValue(ad);
    setModalVisible(true);
  };

  const handleDelete = async (adId: string) => {
    try {
      await ApiService.deleteAdvertisement(adId);
      fetchAdvertisements();
      message.success('Реклама удалена');
    } catch (error) {
      message.error('Ошибка при удалении рекламы');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAd) {
        await ApiService.updateAdvertisement(editingAd._id, values);
        message.success('Реклама обновлена');
      } else {
        await ApiService.createAdvertisement(values);
        message.success('Реклама создана');
      }
      setModalVisible(false);
      fetchAdvertisements();
    } catch (error) {
      message.error('Ошибка при сохранении рекламы');
    }
  };

  const handleToggleActive = async (ad: IAdvertisement) => {
    try {
      await ApiService.updateAdvertisement(ad._id, {
        ...ad,
        isActive: !ad.isActive
      });
      fetchAdvertisements();
      message.success('Статус рекламы обновлен');
    } catch (error) {
      message.error('Ошибка при обновлении статуса рекламы');
    }
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Позиция',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: "Переходов",
      dataIndex: "clicks",
      key: "clicks"
    },
    {
      title: 'Активна',
      key: 'isActive',
      render: (_: unknown, record: IAdvertisement) => (
        <Switch
          checked={record.isActive}
          onChange={() => handleToggleActive(record)}
        />
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: IAdvertisement) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
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
          setEditingAd(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Добавить рекламу
      </Button>

      <Table
        columns={columns}
        dataSource={advertisements}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingAd ? 'Редактировать рекламу' : 'Новая реклама'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
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
            name="imageUrl"
            label="URL изображения"
            rules={[{ required: true, message: 'Введите URL изображения' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Ссылка"
            rules={[{ required: true, message: 'Введите ссылку' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="buttonText"
            label="Текст кнопки"
            rules={[{ required: true, message: 'Введите текст кнопки' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Позиция"
            rules={[{ required: true, message: 'Введите позицию' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAd ? 'Сохранить' : 'Создать'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};