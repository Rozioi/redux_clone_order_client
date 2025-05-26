import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api.service';
import { IUserProfile } from '../interface/user.interface';
import styles from '../assets/Profile.module.scss';
interface IMod {
  _id: string;
  title: string;
  description: string;
  status: string;
  downloadsCount: number;
  previewImage: string;
  videoUrl?: string;
  modUrl: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMods, setUserMods] = useState<IMod[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Тестовые данные
        const testProfile: IUserProfile = {
          _id: '1',
          username: 'TestUser',
          email: 'test@example.com',
          name: 'Тестовый Пользователь',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-03-01T12:00:00.000Z',
          modsCount: 5,
          reviewsCount: 12,
          avatarUrl: 'avatar.jpeg'
        };

        await new Promise(resolve => setTimeout(resolve, 500));
        setProfile(testProfile);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    const fetchMods = async () => {
      try {
        // Тестовые моды
        const testMods: IMod[] = [
          {
            _id: '1',
            title: 'Супер машины',
            description: 'Добавляет новые крутые автомобили в игру',
            status: 'Опубликован',
            downloadsCount: 1500,
            previewImage: 'avatar.jpeg',
            modUrl: 'https://example.com/mod1.zip',
            createdAt: '2024-02-01T00:00:00.000Z'
          }
        ];
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setUserMods(testMods);
      } catch (err) {
        console.error('Ошибка загрузки модов:', err);
      }
    };

    fetchProfile();
    fetchMods();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!profile) {
    return <div className={styles.error}>Профиль не найден</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Профиль</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Выйти
        </button>
      </div>
    
      <div className={styles.mainContent}>
        {/* Блок с аватаром и подпиской */}
        <div className={styles.sidebar}>
          <div className={styles.avatarWrapper}>
            <img 
              src={profile.avatarUrl} 
              alt="Аватар"
              className={styles.avatar}
            />
          </div>
          
          <div className={styles.subscriptionStatus}>
            <h3>Подписка</h3>
            <div className={styles.subscriptionBadge}>
              <span className={styles.badgePro}>PRO</span>
              <span>Действует до: 12.09.2024</span>
            </div>
            <ul className={styles.subscriptionBenefits}>
              <li>Премиум-доступ к модам</li>
              <li>Эксклюзивный контент</li>
              <li>Приоритетная поддержка</li>
            </ul>
          </div>
        </div>
    
        {/* Основная информация и моды */}
        <div className={styles.mainInfo}>
          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{profile.modsCount}</span>
              <span className={styles.statLabel}>Модов</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{profile.reviewsCount}</span>
              <span className={styles.statLabel}>Отзывов</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>4.8</span>
              <span className={styles.statLabel}>Рейтинг</span>
            </div>
          </div>
    
          <div className={styles.modsSection}>
            <div className={styles.sectionHeader}>
              <h2>Последние моды</h2>
              <button className={styles.createButton}>
                + Новый мод
              </button>
            </div>
    
            <div className={styles.compactModsList}>
              {userMods.map(mod => (
                <div key={mod._id} className={styles.compactModCard}>
                  <img 
                    src={mod.previewImage} 
                    alt={mod.title}
                    className={styles.modThumbnail}
                  />
                  <div className={styles.modInfo}>
                    <h3>{mod.title}</h3>
                    <div className={styles.metaInfo}>
                      <span className={styles.downloads}>{mod.downloadsCount} скачиваний</span>
                      <span className={styles.status}>{mod.status}</span>
                    </div>
                  </div>
                  <a href={mod.modUrl} className={styles.downloadLink}>
                    ⬇
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;