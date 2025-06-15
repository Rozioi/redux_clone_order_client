import React, { useState } from 'react';
import ApiService from '../services/api.service';
import styles from '../assets/AdminBadgeManager.module.scss';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface IUserBadgeRequest {
  userID: string;
  badge: string;
  badgeType: "role" | "status" | "custom";
  cssClass?: string;
}

export const AdminBadgeManager: React.FC = () => {
  const [formData, setFormData] = useState<IUserBadgeRequest>({
    userID: '',
    badge: '',
    badgeType: "custom",
    cssClass: ''
  });
  const [message, setMessage] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate('/404');
    return null; // Ранний возврат для предотвращения рендеринга
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'badgeType' ? value as "role" | "status" | "custom" : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.giveBadge({
        ...formData,
        cssClass: formData.cssClass || undefined
      });
      
      setMessage('Бейдж успешно выдан!');
      setFormData({
        userID: '',
        badge: '',
        badgeType: "custom",
        cssClass: ''
      });
    } catch (error) {
      setMessage('Ошибка при выдаче бейджа');
      console.error('Error giving badge:', error);
    }
  };

  return (
    <div className={styles.badgeManager}>
      <h2>Выдача бейджей пользователям</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="userID">ID пользователя:</label>
          <input
            type="text"
            id="userID"
            value={formData.userID}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="badge">Название бейджа:</label>
          <input
            type="text"
            id="badge"
            value={formData.badge}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="badgeType">Тип бейджа:</label>
          <select
            id="badgeType"
            value={formData.badgeType}
            onChange={handleChange}
            required
          >
            <option value="role">Роль</option>
            <option value="status">Статус</option>
            <option value="custom">Пользовательский</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cssClass">CSS класс (опционально):</label>
          <input
            type="text"
            id="cssClass"
            value={formData.cssClass}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Выдать бейдж
        </button>
      </form>

      {message && (
        <div className={`${styles.message} ${
          message.includes('Ошибка') ? styles.error : styles.success
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};