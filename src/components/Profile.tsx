import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiService, { IUserBadge } from '../services/api.service';
import { IUserProfile, IUserStats } from '../interface/user.interface';
import { IMod } from '../interface/mod.interface';
import styles from '../assets/Profile.module.scss';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();
  
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMods, setUserMods] = useState<IMod[]>([]);
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [badges, setBadges] = useState<IUserBadge[]>([]);

  const fetchUserData = useCallback(async () => {
    if (!username) {
      setError('Требуется имя пользователя');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userData = await ApiService.getUserByUsernameOrId(username);
      
      if (!userData) {
        setError('Пользователь не найден');
        setLoading(false);
        return;
      }

      const [stats, mods, userBadges] = await Promise.all([
        ApiService.getUserStatsById(userData._id),
        ApiService.getModsByUserId(userData._id),
        ApiService.getBadgeByUserId(userData._id)
      ]);

      setProfile({
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        name: userData.username,
        createdAt: userData.createdAt,
        updatedAt: new Date(),
        modsCount: stats?.totalMods || 0,
        reviewsCount: stats?.rating || 0,
        avatarUrl: 'avatar.jpeg'
      });

      setUserStats(stats);
      setUserMods(mods || []);
      setBadges(Array.isArray(userBadges) ? userBadges : []);
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Профиль не найден</h2>
        <p>Запрошенный профиль не существует</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Профиль пользователя</h1>
        {user?.username === username && (
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        )}
      </div>
    
      <div className={styles.mainContent}>
        {/* Боковая панель с информацией о пользователе */}
        <div className={styles.sidebar}>
          <div className={styles.avatarWrapper}>
            <img 
              src={`${window.location.origin}/${profile.avatarUrl}`}
              alt="Аватар пользователя"
              className={styles.avatar}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'avatar.jpeg';
              }}
            />
          </div>
          
          <div className={styles.userInfo}>
            <h2 className={styles.username}>{profile.username}</h2>
            <p className={styles.joinDate}>
              Участник с: {new Date(profile.createdAt).toLocaleDateString()}
            </p>
            
            <div className={styles.badgesList}>
              {badges.map((badge) => (
                <div 
                  key={badge._id} 
                  className={`${styles.badge} ${badge.cssClass ? styles[badge.cssClass] : ''}`}
                  title={badge.badgeType}
                >
                  {badge.badge}
                </div>
              ))}
            </div>
          </div>
          
          {user?.username === username && (
            <div className={styles.subscriptionStatus}>
              <h3>Подписка</h3>
              <div className={styles.subscriptionBadge}>
                <span className={styles.badgePro}>PRO</span>
                <span>Действительна до: 12.09.2024</span>
              </div>
              <ul className={styles.subscriptionBenefits}>
                <li>Доступ к премиум модам</li>
                <li>Эксклюзивный контент</li>
                <li>Приоритетная поддержка</li>
              </ul>
            </div>
          )}
        </div>
    
        {/* Основная область контента */}
        <div className={styles.mainInfo}>
          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userStats?.totalMods || 0}</span>
              <span className={styles.statLabel}>Всего модов</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userStats?.approvedMods || 0}</span>
              <span className={styles.statLabel}>Одобрено</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userStats?.rating || 0}</span>
              <span className={styles.statLabel}>Рейтинг</span>
            </div>
          </div>
    
          <div className={styles.modsSection}>
            <h2>Последние моды</h2>
            
            {userMods.length > 0 ? (
              <div className={styles.compactModsList}>
                {userMods.map(mod => (
                  <div key={mod._id} className={styles.compactModCard}>
                    <img 
                      src={mod.previewLink || '/assets/default-mod.jpg'}
                      alt={mod.modName}
                      className={styles.modThumbnail}
                    />
                    <div className={styles.modInfo}>
                      <h3>{mod.modName}</h3>
                      <div className={styles.metaInfo}>
                        <span className={styles.downloads}>
                          {mod.rating?.downloads || 0} загрузок
                        </span>
                        <span className={`${styles.status} ${styles[mod.status]}`}>
                          {mod.status}
                        </span>
                      </div>
                    </div>
                    <a 
                      href={mod.fileLink} 
                      className={styles.downloadLink}
                      download
                    >
                      Скачать
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noMods}>Моды отсутствуют</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;