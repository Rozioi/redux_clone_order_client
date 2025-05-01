import React from 'react';
import styles from '../assets/LoadingSpinner.module.scss';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Загрузка...</p>
    </div>
  );
};

export default LoadingSpinner; 