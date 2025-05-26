import React from "react";
import { FaSignInAlt, FaDiscord, FaTelegram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TelegramUser } from "../../@types/telegram";
import styles from "../../assets/LoginPage.module.scss";
import TelegramLoginWidget from "../TelegramLoginWidget";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.loginContainer}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h2>Войти в аккаунт</h2>
          <div className={styles.decorativeLine}></div>
        </div>

        <div className={styles.authProviders}>
          <button
            className={`${styles.authButton} ${styles.primary}`}
            aria-label="Войти по логину"
            onClick={() => navigate('/login')}
          >
            <FaSignInAlt className={styles.authIcon} />
            <span>Войти по логину</span>
            <div className={styles.buttonHoverEffect}></div>
          </button>

          <button
            className={`${styles.authButton} ${styles.discord}`}
            aria-label="Войти через Discord"
          >
            <FaDiscord className={styles.authIcon} />
            <span>Discord</span>
            <div className={styles.buttonHoverEffect}></div>
          </button>

          <button
            className={`${styles.authButton} ${styles.telegram}`}
            aria-label="Войти через Telegram"
          >
            <FaTelegram className={styles.authIcon} />
            <span>Telegram</span>
            <div className={styles.buttonHoverEffect}></div>
          </button>
        </div>

        <div className={styles.footer}>
          <p className={styles.helpText}>
            Нет аккаунта?{" "}
            <a href="/register" className={styles.link}>
              Зарегистрироваться
            </a>
          </p>
        </div>
      </div>
      <TelegramLoginWidget botId="clone_reduxhub_bot" onAuth={(user:TelegramUser) => alert(`logiin ${user.first_name}`)}/>
    </div>
  );
};

export default LoginPage;
