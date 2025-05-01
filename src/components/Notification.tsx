import { useEffect } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

import styles from "../assets/Notification.module.scss";
interface INotificationProps {
  message: string;
  show: boolean;
  onHide: () => void;
}

export const Notification = ({ message, show, onHide }: INotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onHide(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);
  if (!show) return null;

  return <div className={styles.notification}><FaRegCheckCircle /> {message}</div>;
};
