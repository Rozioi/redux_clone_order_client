import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/ModUpload.module.scss';
import ApiService from '../../services/api.service';
import { ICategory } from '../../interface/category.interface';
import { Notification } from '../Notification';
import { useAuth } from '../../context/AuthContext';

const ModUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modName, setModName] = useState('');
  const [description, setDescription] = useState('');
  const [discord, setDiscord] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // if (!user) {
    //   navigate('/login');
    //   return;
    // }
    fetchCategories();
  }, [navigate, user]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await ApiService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError('Ошибка при загрузке категорий');
      setShowNotification(true);
      setNotificationMessage('Ошибка при загрузке категорий');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedCategory || !modName || !description || !discord || !googleDriveLink) {
      setError('Пожалуйста, заполните все обязательные поля');
      setShowNotification(true);
      setNotificationMessage('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Создаем запрос на мод
      await ApiService.createModRequest({
        userId: user._id,
        categoryId: selectedCategory,
        modName,
        description,
        fileUrl: googleDriveLink,
        discord,
        youtubeLink: youtubeLink || undefined,
        previewLink: previewLink || undefined
      });

      setShowNotification(true);
      setNotificationMessage('Мод успешно загружен!');
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке мода';
      setError(errorMessage);
      setShowNotification(true);
      setNotificationMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.modUpload}>
      <h1>Загрузка мода</h1>
      
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="category">Категория:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Название мода:</label>
          <input
            type="text"
            id="name"
            value={modName}
            onChange={(e) => setModName(e.target.value)}
            required
            maxLength={100}
            placeholder="Введите название мода"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={1000}
            placeholder="Опишите ваш мод"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="discord">Discord:</label>
          <input
            type="text"
            id="discord"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            required
            placeholder="Ваш Discord username"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="youtube">Ссылка на YouTube:</label>
          <input
            type="url"
            id="youtube"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <small className={styles.helpText}>
            Вставьте ссылку на видео с YouTube
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="preview">Ссылка на превью:</label>
          <input
            type="url"
            id="preview"
            value={previewLink}
            onChange={(e) => setPreviewLink(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <small className={styles.helpText}>
            Вставьте прямую ссылку на изображение
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="googleDrive">Ссылка на Google Drive:</label>
          <input
            type="url"
            id="googleDrive"
            value={googleDriveLink}
            onChange={(e) => setGoogleDriveLink(e.target.value)}
            required
            placeholder="https://drive.google.com/file/d/..."
          />
          <small className={styles.helpText}>
            Убедитесь, что ссылка доступна для просмотра всем
          </small>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Загрузить мод'}
        </button>
      </form>

      <Notification
        message={notificationMessage}
        show={showNotification}
        onHide={() => setShowNotification(false)}
      />
    </div>
  );
};

export default ModUpload; 