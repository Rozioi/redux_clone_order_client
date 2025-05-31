import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMod, IModUpdate } from '../../interface/mod.interface';
import ApiService from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import styles from '../../assets/EditMod.module.scss';

const EditMod: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user,isAdmin } = useAuth();
  const [mod, setMod] = useState<IMod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IModUpdate>({
    modName: '',
    description: '',
    discord: '',
    isVisibleDiscord: true
  });

  useEffect(() => {
    fetchMod();
  }, [id]);

  const fetchMod = async () => {
    try {
      const mods = await ApiService.getMods();
      const foundMod = mods.find(m => m._id === id);
      if (foundMod) {
        setMod(foundMod);
        setFormData({
          modName: foundMod.modName,
          description: foundMod.description,
          discord: foundMod.discord,
          isVisibleDiscord: foundMod.isVisibleDiscord
        });
      } else {
        setError('Мод не найден');
      }
    } catch (err) {
      setError('Ошибка при загрузке мода');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      await ApiService.updateMod(id, formData);
      navigate(`/mods/${id}`);
    } catch (err) {
      setError('Ошибка при обновлении мода');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!mod) {
    return <div className={styles.error}>Мод не найден</div>;
  }

  if (!isAuthenticated || (user?._id !== mod.userId && !isAdmin)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Ошибка</p>
          <p>У вас нет прав для редактирования этого мода</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Редактирование мода</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="modName">Название мода</label>
          <input
            type="text"
            id="modName"
            value={formData.modName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, modName: e.target.value }))
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="discord">Discord</label>
          <input
            type="text"
            id="discord"
            value={formData.discord}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, discord: e.target.value }))
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={formData.isVisibleDiscord}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isVisibleDiscord: e.target.checked,
                }))
              }
            />
            Показывать Discord
          </label>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default EditMod; 