import React from 'react';
import styles from '../assets/LoginButton.module.scss';
import {
    FaDiscord
  } from "react-icons/fa";
const LoginButton: React.FC = () => {
    return (
        <button className={styles.loginButton}>
            <FaDiscord />
            Войти
        </button>
    );
};

export default LoginButton; 