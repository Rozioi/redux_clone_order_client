import React from "react";
import styles from "../assets/Header.module.scss";
import {
  FaYoutube,
  FaTelegram,
  FaDiscord,
  FaUser,
  FaCrown,
} from "react-icons/fa";
import LoginButton from "./LoginButton";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a href="/" className={styles.logo}>
          <img src="/assets/reduxhub7.svg" alt="Logo" />
        </a>

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
        <div className={styles.profileIcon}>
          <FaUser />
        </div>
        <div className={styles.crownIcon}>
          <FaCrown />
        </div>
      </div>
    </header>
  );
};

export default Header;
