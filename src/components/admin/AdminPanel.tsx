import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../assets/AdminPanel.module.scss';
import ConfirmModal from '../ConfirmModal';
import ApiService, { IUserBadge, ISubscription } from '../../services/api.service';
import { IUserWithPermissions, UserRole } from '../../interface/user.interface';
import { ICategory, ICategoryCreate } from '../../interface/category.interface';
import { IMod } from '../../interface/mod.interface';
import { ROLES, MOD_STATUS } from '../../config';
import { FiAward, FiStar, FiUser, FiTrash2, FiImage } from 'react-icons/fi';
import Modal from "../Modal";
import SubscriptionManagement from '../SubscriptionManagement';
import { AdvertisementManager } from './AdvertisementManager';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'mods' | 'categories' | 'badge' | 'modsAll' | 'subscriptions' | 'advertisements'>('users');
  const [users, setUsers] = useState<IUserWithPermissions[]>([]);
  const [pendingMods, setPendingMods] = useState<IMod[]>([]);
  const [allMods, setAllMods] = useState<IMod[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [badges, setBadges] = useState<IUserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<ICategoryCreate>({ name: '', parentId: '', order: 0, isActive: false });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    modId: '',
    reason: ''
  });

  const adminStr = localStorage.getItem('admin');
  const admin = adminStr ? JSON.parse(adminStr) : null;
  const permissions: string[] = admin?.permissions || [];

  const hasPermission = (perm: string) => permissions.includes(perm);

  useEffect(() => {
    if (!admin || !permissions.length) {
      navigate('/');
      return;
    }

    if (!hasPermission('users:manage') && !hasPermission('mods:approve') && !hasPermission('categories:manage') && !hasPermission('users:assign_badge')) {
      navigate('/');
    }
  }, [admin, navigate, permissions]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'users':
          if (hasPermission('users:manage')) {
            const usersData = await ApiService.getAllUsers();
            setUsers(usersData || []);
          }
          break;
        case 'mods':
          if (hasPermission('mods:approve')) {
            try {
              const [pendingModsData, allModsData] = await Promise.all([
                ApiService.getModsByStatus(MOD_STATUS.PENDING),
                ApiService.getAllMods()
              ]);
              setPendingMods(pendingModsData || []);
              setAllMods(allModsData || []);
            } catch (err) {
              console.error('Error fetching mods:', err);
              setPendingMods([]);
              setAllMods([]);
            }
          }
          break;
        case 'categories':
          if (hasPermission('categories:manage')) {
            const categoriesData = await ApiService.getCategories();
            setCategories(categoriesData || []);
          }
          break;
        case 'badge':
          if (hasPermission('users:assign_badge')) {
            const badgesData = await ApiService.getBadges();
            setBadges(badgesData || []);
          }
          break;
      }
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error in fetchData:', err);
      // Инициализируем пустые массивы в случае ошибки
      setUsers([]);
      setPendingMods([]);
      setAllMods([]);
      setCategories([]);
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const showConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const handleUserRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await ApiService.updateUserRole(userId, newRole);
      // setUsers(users.map(user =>
      //   user._id === userId
      //     ? { ...user, role: newRole }
      //     : user
      // ));
    } catch (err) {
      setError('Ошибка при обновлении роли пользователя');
    }
  };

  const handleUserStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      await ApiService.updateUserStatus(userId, isActive);
      setUsers(users.map(user =>
        user._id === userId
          ? { ...user, isActive }
          : user
      ));
    } catch (err) {
      setError('Ошибка при обновлении статуса пользователя');
    }
  };

  const handleModApprove = async (modId: string) => {
    try {
      await ApiService.approveMod(modId);
      setPendingMods(pendingMods.filter(mod => mod._id !== modId));
    } catch (err) {
      setError('Ошибка при одобрении мода');
    }
  };

  const handleModReject = (modId: string) => {
    setRejectModal({
      isOpen: true,
      modId,
      reason: ''
    });
  };

  const handleCategoryCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const category = await ApiService.createCategory(newCategory);
      setCategories([...categories, category]);
      setNewCategory({ name: '', parentId: '',order: 0, isActive: false });
    } catch (err) {
      setError('Ошибка при создании категории');
    }
  };

  const handleRemoveBadge = async (userId:string,badgeId: string) => {
    showConfirmModal(
      'Удаление бейджа',
      'Вы уверены, что хотите удалить этот бейдж?',
      async () => {
        try {
          await ApiService.removeBadge(userId);
          setBadges(badges.filter(badge => badge._id !== badgeId));
        } catch (err) {
          setError('Ошибка при удалении бейджа');
        }
      }
    );
  }; 

  const renderCategoriesTree = (categories: ICategory[], parentId: string | null = null, level = 0) => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => (
        <div key={category._id}>
          <div className={`${styles.categoryNode} ${level > 0 ? styles.child : ''}`} 
              style={{ marginLeft: `${level * 20}px` }}>
            <span>
              {category.name} 
              {!category.isActive && <span className={styles.inactiveBadge}> (неактивна)</span>}
            </span>
            <div className={styles.categoryActions}>
              <button 
                className={styles.edit}
                onClick={() => handleEditCategory(category)}
              >
                Редактировать
              </button>
              <button 
                className={styles.delete}
                onClick={() => handleCategoryDelete(category._id!)}
              >
                Удалить
              </button>
            </div>
          </div>
          {renderCategoriesTree(categories, category._id!, level + 1)}
        </div>
      ));
  };
  const confirmRejectWithReason = async () => {
    try {
      // await ApiService.rejectMod(rejectModal.modId, rejectModal.reason);
      setPendingMods(pendingMods.filter(mod => mod._id !== rejectModal.modId));
      setRejectModal({ isOpen: false, modId: '', reason: '' });
    } catch (err) {
      setError('Ошибка при отклонении мода');
    }
  };
  const handleEditCategory = (category: ICategory) => {
    setNewCategory({
      name: category.name,
      parentId: category.parentId || '',
      order: category.order,
      isActive: category.isActive
    });
  };

  const handleCategoryDelete = async (categoryId: string) => {
    showConfirmModal(
      'Удаление категории',
      'Вы уверены, что хотите удалить эту категорию?',
      async () => {
        try {
          await ApiService.deleteCategory(categoryId);
          setCategories(categories.filter(category => category._id !== categoryId));
        } catch (err) {
          setError('Ошибка при удалении категории');
        }
      }
    );
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={fetchData}>Повторить</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Административная панель</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
      </div>

      <div className={styles.tabs}>
        {hasPermission('users:manage') && (
          <button className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>Пользователи</button>
        )}
        {hasPermission('mods:approve') && (
          <button className={`${styles.tabButton} ${activeTab === 'mods' ? styles.active : ''}`} onClick={() => setActiveTab('mods')}>Моды на модерации</button>
        )}
        {hasPermission('mods:approve') && (
          <button className={`${styles.tabButton} ${activeTab === 'modsAll' ? styles.active : ''}`} onClick={() => setActiveTab('modsAll')}>Все моды</button>
        )}
        {hasPermission('categories:manage') && (
          <button className={`${styles.tabButton} ${activeTab === 'categories' ? styles.active : ''}`} onClick={() => setActiveTab('categories')}>Категории</button>
        )}
        {hasPermission('users:assign_badge') && (
          <button className={`${styles.tabButton} ${activeTab === 'badge' ? styles.active : ''}`} 
            onClick={() => setActiveTab('badge')}>
            Бейджи пользователей
          </button>
        )}
        {hasPermission('subscriptions:manage') && (
          <button className={`${styles.tabButton} ${activeTab === 'subscriptions' ? styles.active : ''}`} 
            onClick={() => setActiveTab('subscriptions')}>
            Подписки
          </button>
        )}
        {hasPermission('advertisements:manage') && (
          <button className={`${styles.tabButton} ${activeTab === 'advertisements' ? styles.active : ''}`} 
            onClick={() => setActiveTab('advertisements')}>
            Реклама
          </button>
        )}
      </div>
  
      <div className={styles.content}>
        {activeTab === 'users' && hasPermission('users:manage') && (
          <div className={styles.section}>
            <h2>Управление пользователями</h2>
            <table className={styles.usersTable}>
              <thead>
                <tr><th>Имя</th><th>Email</th><th>Роль</th><th>Статус</th></tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select value={user.role} onChange={(e) => handleUserRoleChange(user._id, e.target.value as UserRole)}>
                        <option value="user">Пользователь</option>
                        <option value="moderator">Модератор</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleUserStatusToggle(user._id, !user.isActive)}>
                        {user.isActive ? 'Активен' : 'Заблокирован'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'mods' && hasPermission('mods:approve') && (
          <div className={styles.section}>
            <h2>Моды на модерации</h2>
            {pendingMods.length === 0 ? (
              <p>Нет модов в ожидании</p>
            ) : (
              <div className={styles.modsGrid}>
                {pendingMods.map(mod => (
                  <div key={mod._id} className={styles.modCard}>
                    <h3>{mod.modName}</h3>
                    <p>Автор: {mod.discord}</p>
                    <p>{mod.description?.slice(0, 100)}...</p>
                    <div className={styles.modActions}>
                      <button onClick={() => navigate(`/admin/mods/${mod._id}`)}>Просмотр</button>
                      <button onClick={() => handleModApprove(mod._id)}>Одобрить</button>
                      <button onClick={() => handleModReject(mod._id)}>Отклонить</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'modsAll' && hasPermission('mods:approve') && (
          <div className={styles.section}>
            <h2>Моды</h2>
            {allMods.length === 0 ? (
              <p>Нет модов</p>
            ) : (
              <div className={styles.modsGrid}>
                {allMods.map(mod => (
                  <div key={mod._id} className={styles.modCard}>
                    <h3>{mod.modName}</h3>
                    <span className={`${styles.status} ${styles[mod.status]}`}>
                      {mod.status}
                    </span>
                    <p>Автор: {mod.discord}</p>
                    <p>{mod.description?.slice(0, 100)}...</p>
                    <div className={styles.modActions}>
                      <button onClick={() => navigate(`/admin/mods/${mod._id}`)}>Просмотр</button>
                      {mod.status === MOD_STATUS.PENDING && (
                        <>
                          <button onClick={() => handleModApprove(mod._id)}>Одобрить</button>
                          <button onClick={() => handleModReject(mod._id)}>Отклонить</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'categories' && hasPermission('categories:manage') && (
          <div className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>Управление категориями</h2>
            
            <div className={styles.categoryCreator}>
              <h3>Создать новую категорию</h3>
              <form onSubmit={handleCategoryCreate} className={styles.categoryForm}>
                <div className={styles.formGroup}>
                  <label>Название категории</label>
                  <input
                    type="text"
                    placeholder="Введите название"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                  />
                </div>
        
                <div className={styles.formGroup}>
                  <label>Родительская категория</label>
                  <select
                    value={newCategory.parentId}
                    onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value })}
                  >
                    <option value="">Без родителя (основная категория)</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
        
                <div className={styles.formGroup}>
                  <label>Порядок отображения</label>
                  <input
                    type="number"
                    min="0"
                    value={newCategory.order || 0}
                    onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
        
                <div className={styles.formCheckbox}>
                  <label>
                    <input
                      type="checkbox"
                      checked={newCategory.isActive || false}
                      onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                    />
                    Активна
                  </label>
                </div>
        
                <button type="submit" className={styles.submitButton}>
                  Создать категорию
                </button>
              </form>
            </div>
        
            <div className={styles.categoriesTree}>
              <h3>Список категорий</h3>
              <div className={styles.treeContainer}>
                {renderCategoriesTree(categories)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badge' && hasPermission('users:assign_badge') && (
          <div className={styles.badgesSection}>
            <h2>Управление бейджами пользователей</h2>
            
            <div className={styles.badgesGrid}>
              {badges.map(badge => (
                <div key={badge._id} className={styles.badgeCard}>
                  <div className={styles.badgeHeader}>
                    <div className={`${styles.badgePreview} ${badge.badgeType}`}>
                      {badge.badgeType === 'role' && <FiAward />}
                      {badge.badgeType === 'status' && <FiStar />}
                      {badge.badgeType === 'custom' && <FiUser />}
                    </div>
                    <div className={styles.badgeInfo}>
                      <h4>{badge.badge}</h4>
                      <p>{badge.badgeType}</p>
                    </div>
                  </div>
                  <div className={styles.badgeDetails}>
                    <p>Пользователь: {badge.userID}</p>
                    <p>Назначен: {new Date(badge.assignedAt).toLocaleDateString()}</p>
                    {badge.cssClass && <p>Класс: {badge.cssClass}</p>}
                  </div>
                  <div className={styles.badgeActions}>
                    <button onClick={() => navigate(`/user/${badge.userID}`)}>
                      <FiUser /> Профиль
                    </button>
                    <button onClick={() => handleRemoveBadge(badge.userID,badge._id)}>
                      <FiTrash2 /> Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && hasPermission('subscriptions:manage') && (
          <div className={styles.subscriptionsSection}>
            <h2>Управление подписками</h2>
            <SubscriptionManagement />
          </div>
        )}

        {activeTab === 'advertisements' && hasPermission('advertisements:manage') && (
          <div className={styles.section}>
            <h2>Реклама</h2>
            <AdvertisementManager />
          </div>
        )}
      </div>
        
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal({ ...confirmModal, isOpen: false });
        }}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
      <Modal
        isOpen={rejectModal.isOpen}
      >
        <div className={styles['modal-content']}>
          <button
            className={styles["closeButtonStyles"]}
            onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
          >
            ✖
          </button>
          <textarea
            className={styles.rejectReasonInput}
            placeholder="Опишите причину отклонения мода..."
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
            rows={4}
          />
          <div className={styles.rejectModalActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
            >
              Отмена
            </button>
            <button 
              className={styles.confirmButton}
              onClick={confirmRejectWithReason}
              disabled={!rejectModal.reason.trim()}
            >
              Подтвердить отклонение
            </button>
          </div>
        </div>
      </Modal>
    </div>
  
    
  );
};

export default AdminPanel;