import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './LeftSidebar.module.scss';
import { FaHome, FaGamepad, FaCog, FaQuestionCircle, FaRandom } from 'react-icons/fa';

const LeftSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <Link 
          to="/" 
          className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}
        >
          <FaHome />
          <span>Главная</span>
        </Link>
        <Link 
          to="/mods" 
          className={`${styles.navItem} ${location.pathname === '/mods' ? styles.active : ''}`}
        >
          <FaGamepad />
          <span>Моды</span>
        </Link>
        <Link 
          to="/roulette" 
          className={`${styles.navItem} ${location.pathname === '/roulette' ? styles.active : ''}`}
        >
          <FaRandom />
          <span>Рулетка</span>
        </Link>
        <Link 
          to="/settings" 
          className={`${styles.navItem} ${location.pathname === '/settings' ? styles.active : ''}`}
        >
          <FaCog />
          <span>Настройки</span>
        </Link>
        <Link 
          to="/help" 
          className={`${styles.navItem} ${location.pathname === '/help' ? styles.active : ''}`}
        >
          <FaQuestionCircle />
          <span>Помощь</span>
        </Link>
      </nav>
    </div>
  );
};

export default LeftSidebar; 