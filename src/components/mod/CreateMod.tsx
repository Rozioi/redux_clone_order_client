import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api.service';
import { IModCreate } from '../../interface/mod.interface';
import { ICategory } from '../../interface/category.interface';
import styles from '../../assets/CreateMod.module.scss';
import { useAuth } from '../../context/AuthContext';

const CreateMod: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategories, setParentCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IModCreate>({
    modName: '',
    description: '',
    version: '',
    categoryIds: [],
    tags: [],
    discord: '',
    isVisibleDiscord: true
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedParentId) {
      const subs = categories.filter(cat => cat.parentId === selectedParentId);
      setSubCategories(subs);
    } else {
      setSubCategories([]);
    }
  }, [selectedParentId, categories]);

  const fetchCategories = async () => {
    try {
      const data = await ApiService.getCategories();
      setCategories(data);
      // Фильтруем родительские категории (без parentId)
      const parents = data.filter(cat => !cat.parentId);
      setParentCategories(parents);
    } catch (err) {
      setError('Ошибка при загрузке категорий');
    }
  };

  const handleParentCategoryChange = (parentId: string) => {
    setSelectedParentId(parentId);
    setFormData(prev => ({
      ...prev,
      categoryIds: [parentId]
    }));
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: [selectedParentId, subCategoryId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await ApiService.createMod(formData);
      navigate('/mods');
    } catch (err) {
      setError('Ошибка при создании мода');
    } finally {
      setLoading(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Создание мода</h1>
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
          <label htmlFor="version">Версия</label>
          <input
            type="text"
            id="version"
            value={formData.version}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, version: e.target.value }))
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Категория</label>
          <div className={styles.categorySelect}>
            <select
              value={selectedParentId}
              onChange={(e) => handleParentCategoryChange(e.target.value)}
              required
            >
              <option value="">Выберите основную категорию</option>
              {parentCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {subCategories.length > 0 && (
              <select
                value={formData.categoryIds[1] || ''}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
                required
              >
                <option value="">Выберите подкатегорию</option>
                {subCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tags">Теги (через запятую)</label>
          <input
            type="text"
            id="tags"
            value={formData.tags.join(', ')}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(',').map((tag) => tag.trim()),
              }))
            }
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
          {loading ? 'Создание...' : 'Создать мод'}
        </button>
      </form>
    </div>
  );
};

export default CreateMod; 