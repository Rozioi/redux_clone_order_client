import React from "react";
import styles from "../assets/Modal.module.scss";
import ReactDOM from "react-dom";
interface IModalProps {
  isOpen: boolean;
  // onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        {/* <button className={styles['closeButtonStyles']} onClick={onClose}>
          ✖
        </button> */}
        {children}
      </div>
    </div>,
      document.getElementById("modal-root")!
  );
};

export default Modal;
