import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../../config';
import styles from '../../assets/AdminPanel.module.scss';
import ConfirmModal from '../ConfirmModal';
import ApiService from '../../services/api.service';
import { IUserWithPermissions, UserRole } from '../../interface/user.interface';
import { ICategory, ICategoryCreate } from '../../interface/category.interface';
import { IMod, IModUpdate } from '../../interface/mod.interface';
import { ROLES, MOD_STATUS } from '../../config';
import { SubscriptionType } from '../../interface/category.interface';
import { useAuth } from '../../context/AuthContext';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  is_active: boolean;
}

interface ModRequest {
  _id: string;
  userId: string;
  categoryId: string;
  modName: string;
  description: string;
  fileUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const AdminPanel: React.FC = () => {
  // const navigate = useNavigate();
  // const { user } = useAuth();
  // const [activeTab, setActiveTab] = useState<'users' | 'mods' | 'categories'>('users');
  // const [users, setUsers] = useState<IUserWithPermissions[]>([]);
  // const [pendingMods, setPendingMods] = useState<IMod[]>([]);
  // const [categories, setCategories] = useState<ICategory[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [newCategory, setNewCategory] = useState<ICategoryCreate>({ name: '', description: '' });
  // const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
  //   isOpen: false,
  //   title: '',
  //   message: '',
  //   onConfirm: () => {}
  // });

  // useEffect(() => {
  //   const checkAdminAccess = async () => {
  //     if (!user || user.permissions?.role !== ROLES.ADMIN) {
  //       navigate('/');
  //       return;
  //     }
  //     await fetchData();
  //   };

  //   checkAdminAccess();
  // }, [user, navigate]);

  // useEffect(() => {
  //   fetchData();
  // }, [activeTab]);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     switch (activeTab) {
  //       case 'users':
  //         const usersData = await ApiService.getProfile();
  //         setUsers([usersData]);
  //         break;
  //       case 'mods':
  //         const modsData = await ApiService.getMods({ status: MOD_STATUS.PENDING });
  //         setPendingMods(modsData);
  //         break;
  //       case 'categories':
  //         const categoriesData = await ApiService.getCategories();
  //         setCategories(categoriesData);
  //         break;
  //     }
  //   } catch (err) {
  //     setError('Ошибка при загрузке данных');
  //     console.error('Error fetching data:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   navigate('/admin-login');
  // };

  // const showConfirmModal = (title: string, message: string, onConfirm: () => void) => {
  //   setConfirmModal({
  //     isOpen: true,
  //     title,
  //     message,
  //     onConfirm
  //   });
  // };

  // const handleUserRoleChange = async (userId: string, newRole: UserRole) => {
  //   try {
  //     const userToUpdate = users.find(u => u._id === userId);
  //     if (!userToUpdate) return;
  //     const updatedPermissions = {
  //       ...userToUpdate.permissions,
  //       role: newRole,
  //     };
  //     await ApiService.updateProfile({ permissions: updatedPermissions });
  //     setUsers(users.map(user => 
  //       user._id === userId 
  //         ? { ...user, permissions: updatedPermissions }
  //         : user
  //     ));
  //   } catch (err) {
  //     setError('Ошибка при обновлении роли пользователя');
  //     console.error('Error updating user role:', err);
  //   }
  // };

  // const handleUserStatusToggle = async (userId: string, isActive: boolean) => {
  //   try {
  //     const userToUpdate = users.find(u => u._id === userId);
  //     if (!userToUpdate) return;
  //     const updatedPermissions = {
  //       ...userToUpdate.permissions,
  //       isActive,
  //     };
  //     await ApiService.updateProfile({ permissions: updatedPermissions });
  //     setUsers(users.map(user => 
  //       user._id === userId 
  //         ? { ...user, permissions: updatedPermissions }
  //         : user
  //     ));
  //   } catch (err) {
  //     setError('Ошибка при обновлении статуса пользователя');
  //     console.error('Error updating user status:', err);
  //   }
  // };

  // const handleModApprove = async (modId: string) => {
  //   try {
  //     const modUpdate: Partial<IMod> = {
  //       status: MOD_STATUS.APPROVED,
  //     };
  //     await ApiService.updateMod(modId, modUpdate);
  //     setPendingMods(pendingMods.filter(mod => mod._id !== modId));
  //   } catch (err) {
  //     setError('Ошибка при одобрении мода');
  //     console.error('Error approving mod:', err);
  //   }
  // };

  // const handleModReject = async (modId: string) => {
  //   try {
  //     const modUpdate: Partial<IMod> = {
  //       status: MOD_STATUS.REJECTED,
  //     };
  //     await ApiService.updateMod(modId, modUpdate);
  //     setPendingMods(pendingMods.filter(mod => mod._id !== modId));
  //   } catch (err) {
  //     setError('Ошибка при отклонении мода');
  //     console.error('Error rejecting mod:', err);
  //   }
  // };

  // const handleCategoryCreate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const category = await ApiService.createCategory(newCategory);
  //     setCategories([...categories, category]);
  //     setNewCategory({ name: '', description: '' });
  //   } catch (err) {
  //     setError('Ошибка при создании категории');
  //     console.error('Error creating category:', err);
  //   }
  // };

  // const handleCategoryDelete = async (categoryId: string) => {
  //   try {
  //     await ApiService.deleteCategory(categoryId);
  //     setCategories(categories.filter(category => category._id !== categoryId));
  //   } catch (err) {
  //     setError('Ошибка при удалении категории');
  //     console.error('Error deleting category:', err);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div className={styles.loadingContainer}>
  //       <div className={styles.spinner}></div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className={styles.errorContainer}>
  //       <div className={styles.errorContent}>
  //         <h2 className={styles.errorTitle}>Ошибка</h2>
  //         <p>{error}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.container}>
      {/* <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'mods' ? styles.active : ''}`}
          onClick={() => setActiveTab('mods')}
        >
          Моды
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'categories' ? styles.active : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Категории
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'users' && (
          <div className={styles.usersSection}>
            <h2 className={styles.sectionTitle}>Управление пользователями</h2>
            <div className={styles.usersList}>
              {users.map((user) => (
                <div key={user._id} className={styles.userCard}>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{user.username}</h3>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                  <div className={styles.userActions}>
                    <select
                      value={user.permissions?.role || ROLES.USER}
                      onChange={(e) => handleUserRoleChange(user._id, e.target.value as UserRole)}
                      className={styles.select}
                    >
                      <option value={ROLES.USER}>Пользователь</option>
                      <option value={ROLES.MODERATOR}>Модератор</option>
                      <option value={ROLES.ADMIN}>Администратор</option>
                    </select>
                    <button
                      onClick={() => handleUserStatusToggle(user._id, !user.permissions?.isActive)}
                      className={`${styles.statusButton} ${
                        user.permissions?.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {user.permissions?.isActive ? 'Активен' : 'Заблокирован'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mods' && (
          <div className={styles.modsSection}>
            <h2 className={styles.sectionTitle}>Ожидающие моды</h2>
            <div className={styles.modsList}>
              {pendingMods.map((mod) => (
                <div key={mod._id} className={styles.modCard}>
                  <div className={styles.modInfo}>
                    <h3 className={styles.modName}>{mod.modName}</h3>
                    <p className={styles.modAuthor}>Автор: {mod.author.username}</p>
                  </div>
                  <div className={styles.modActions}>
                    <button
                      onClick={() => handleModApprove(mod._id)}
                      className={styles.approveButton}
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleModReject(mod._id)}
                      className={styles.rejectButton}
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>Управление категориями</h2>
            <form onSubmit={handleCategoryCreate} className={styles.categoryForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Название категории
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Описание
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className={styles.textarea}
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Создать категорию
              </button>
            </form>

            <div className={styles.categoriesList}>
              {categories.map((category) => (
                <div key={category._id} className={styles.categoryCard}>
                  <div className={styles.categoryInfo}>
                    <h3 className={styles.categoryName}>{category.name}</h3>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                  <button
                    onClick={() => handleCategoryDelete(category._id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
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
      /> */}
    </div>
  );
};

export default AdminPanel; 