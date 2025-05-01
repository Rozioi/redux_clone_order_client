import React, { useState } from "react";
import styles from "../assets/LoginButton.module.scss";
import { FaSignInAlt, FaDiscord, FaTelegram } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import Modal from "./Modal";

const LoginButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.loginButton} onClick={() => setIsOpen(true)}>
        <IoLogIn />
        Войти
      </button>

      <Modal isOpen={isOpen} >
        <div className={styles["modal-content"]}>
          <div className={styles["modal-header"]}>
            <h2>Войти в аккаунт</h2>
            <button
              className={styles["closeButtonStyles"]}
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          <div className={styles["auth-providers"]}>
            <button className={styles["auth-button"]}>
              <FaSignInAlt /> Войти по логину
            </button>
            <button className={styles["auth-button"]}>
              <FaDiscord /> Discord
            </button>
            <button className={styles["auth-button"]}>
              <FaTelegram /> Telegram
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginButton;
