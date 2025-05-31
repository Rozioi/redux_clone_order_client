import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api.service';
import { IModCreate } from '../../interface/mod.interface';
import { ICategory } from '../../interface/category.interface';
import styles from '../../assets/CreateMod.module.scss';
import { useAuth } from '../../context/AuthContext';

const CreateMod: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategories, setParentCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!user?._id){
    navigate('/login');
  }
  const [formData, setFormData] = useState<IModCreate>({
    modName: '',
    description: '',
    categoryIds: [],
    discord: '' ,
    isVisibleDiscord: true,
    previewLink: '',
    youtubeLink: '',
    userId: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiService.getCategories();
        setCategories(data);
        setParentCategories(data.filter(cat => !cat.parentId));
      } catch (err) {
        setError('Ошибка при загрузке категорий');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setSubCategories(selectedParentId 
      ? categories.filter(cat => cat.parentId === selectedParentId) 
      : []);
  }, [selectedParentId, categories]);

  const getYoutubeThumbnail = (url: string): string => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) 
        ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` 
        : '';
    } catch {
      return '';
    }
  };

  const handlePreviewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isYoutubeLink = value.includes('youtube.com') || value.includes('youtu.be');
    
    setFormData(prev => {
      if (isYoutubeLink) {
        const thumbnail = getYoutubeThumbnail(value);
        return {
          ...prev,
          youtubeLink: value,
          previewLink: thumbnail || value // fallback на саму ссылку если thumbnail не получен
        };
      } else {
        return {
          ...prev,
          previewLink: value,
          youtubeLink: '' 
        };
      }
    });
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedParentId(value);
    setFormData(prev => ({ ...prev, categoryIds: [value] }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: [selectedParentId, e.target.value]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.userId = user?._id || '';
    formData.discord = user?.username || formData.discord;
    
    // if ( !formData.youtubeLink) {
    //   setError('Некорректная YouTube ссылка');
    //   return;
    // }
    
    if (!formData.previewLink) {
      setError('Укажите YouTube ссылку или изображение для превью');
      return;
    }
    if (!formData.userId){
      setError('Войдите в свою учётную запись');
      return;
    }
    try {
      setLoading(true);
      await ApiService.createMod(formData);
      navigate('/');
    } catch (err) {
      setError('Ошибка при создании мода');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <h1>Создание мода</h1>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Название мода</label>
          <input
            name="modName"
            value={formData.modName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Категория</label>
          <div className={styles.categorySelect}>
            <select
              value={selectedParentId}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Выберите категорию</option>
              {parentCategories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            {subCategories.length > 0 && (
              <select
                value={formData.categoryIds[1] || ''}
                onChange={handleSubCategoryChange}
                required
              >
                <option value="">Выберите подкатегорию</option>
                {subCategories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Discord</label>
          <input
            name="discord"
            value={formData.discord}
            onChange={handleInputChange}
            placeholder='Если оставите пустым то поставится юзернейм'
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={formData.isVisibleDiscord}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                isVisibleDiscord: e.target.checked
              }))}
            />
            Показывать Discord
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>Ссылка на превью (изображение или YouTube)</label>
          <input
            value={formData.previewLink || formData.youtubeLink}
            onChange={handlePreviewInputChange}
            placeholder="https://example.com/image.jpg или https://youtube.com/watch?v=..."
          />
          
          {formData.youtubeLink ? (
            <div className={styles.videoPreview}>
              <iframe
                width="300"
                height="169"
                src={`https://www.youtube.com/embed/${formData.youtubeLink.split('v=')[1]}`}
                frameBorder="0"
                allowFullScreen
              />
              {formData.previewLink && (
                <img 
                  src={formData.previewLink} 
                  alt="YouTube preview" 
                  className={styles.previewImg}
                />
              )}
            </div>
          ) : formData.previewLink ? (
            <img 
              src={formData.previewLink} 
              alt="Mod preview" 
              className={styles.previewImg}
            />
          ) : null}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Создание...' : 'Создать мод'}
        </button>
      </form>
    </div>
  );
};

export default CreateMod;