import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.notFoundPage}>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/" className={styles.backLink}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFoundPage; 