import React from "react";
import styles from "../assets/LoginButton.module.scss";
import { IoLogIn } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const redirectUsers = () => {
    navigate("/login");
  };

  return (
    <>
      <button className={styles.loginButton} onClick={() => redirectUsers()}>
        <IoLogIn />
        Войти
      </button>
    </>
  );
};

export default LoginButton;
