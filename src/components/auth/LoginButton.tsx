import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../assets/LoginButton.module.scss';

const LoginButton: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <button 
      className={`${styles.loginButton} ${isAuthenticated ? styles.loggedIn : ''}`}
      onClick={handleClick}
    >
      {isAuthenticated ? 'Выйти' : 'Войти'}
    </button>
  );
};

export default LoginButton;
