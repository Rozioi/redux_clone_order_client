import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../assets/Header.module.scss";
import {
  FaYoutube,
  FaTelegram,
  FaDiscord,
  FaUser,
  FaCrown,
} from "react-icons/fa";
import LoginButton from "../components/auth/LoginButton";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const {  isAuthenticated,user ,isAdmin} = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={styles.header}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" className={styles.logo}>
          <img src="/assets/reduxhub7.svg" alt="Logo" />
        </Link>

        <div className={styles.socialIcons}>
          <a
            href="https://t.me/your_telegram"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <FaTelegram />
          </a>
          <a
            href="https://youtube.com/your_youtube"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <FaYoutube />
          </a>
          <a
            href="https://discord.gg/your_discord"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <FaDiscord />
          </a>
        </div>
      </div>

      <div className={styles.rightSection}>
        <LoginButton />
        <div 
          className={`${styles.profileIcon} ${user ? styles.active : ''}`}
          onClick={handleProfileClick}
          title={user ? "Профиль" : "Войти"}
        >
          {isAuthenticated ? <img src={`${window.location.origin}/avatar.jpeg`}/> : <FaUser />}
        </div>
        {isAdmin && (
          <Link to="/admin" className={styles.crownIcon} title="Админ панель">
            <FaCrown />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
