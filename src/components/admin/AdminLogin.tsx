import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/LoginPage.module.scss';
import { API_URL } from '../../config';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'verification_required') {
        setShowVerification(true);
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка при подключении к серверу');
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Сохраняем токен и данные пользователя
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('admin', JSON.stringify(data.admin));
        
        // Проверяем, что токен действительно сохранился
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
          setError('Ошибка сохранения токена');
          return;
        }

        // Делаем тестовый запрос с токеном
        const testResponse = await fetch(`${API_URL}/categories`, {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        });

        if (testResponse.ok) {
          navigate('/admin');
        } else {
          setError('Ошибка авторизации');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        setError(data.error || 'Ошибка верификации');
      }
    } catch (err) {
      setError('Ошибка при подключении к серверу');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h2>Вход в админ-панель</h2>
          <div className={styles.decorativeLine}></div>
        </div>

        {!showVerification ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
                className={styles.input}
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={`${styles.authButton} ${styles.primary}`}>
              Войти
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Код подтверждения"
                required
                className={styles.input}
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={`${styles.authButton} ${styles.primary}`}>
              Подтвердить
            </button>
            <button
              type="button"
              onClick={() => setShowVerification(false)}
              className={`${styles.authButton} ${styles.secondary}`}
            >
              Назад
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin; 