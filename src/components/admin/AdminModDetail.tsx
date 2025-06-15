import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarkdownReact from "../mod/MarkdownReact";
import styles from "../../assets/AdminModDetail.module.scss";
import ApiService from "../../services/api.service";
import { IMod } from "../../interface/mod.interface";
import Modal from "../Modal";



const AdminModDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mod, setMod] = useState<IMod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMod = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const fetchedMod = await ApiService.getModById(id);
        setMod(fetchedMod);
      } catch (err) {
        setError('Ошибка при загрузке мода');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMod();
  }, [id]);
  useEffect(() => {
     const fetchCategoryNames = async () => {
       if (!mod?.categories) return;
       
       const newCategoryNames: Record<string, string> = {};
       
       try {
         const categoriesData = await Promise.all(
           mod.categories.map(category => 
             ApiService.getCategoryById(category)
           )
         );
         
         categoriesData.forEach(category => {
           if (category && category._id) {
             newCategoryNames[category._id] = category.name;
           }
         });
         
         setCategoryNames(newCategoryNames);
       } catch (error) {
         console.error('Error fetching categories:', error);
       }
     };
 
     if (mod) fetchCategoryNames();
   }, [mod]);
  if (loading) {
    return <div className={styles.loading}>Загрузка мода...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!mod) {
    return <div className={styles.error}>Мод не найден</div>;
  }

  return (
    <div className={styles.modDetail}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Назад
        </button>
        <h1>{mod.modName}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Основная информация</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>ID:</span>
              <span className={styles.value}>{mod._id}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Название:</span>
              <span className={styles.value}>{mod.modName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Описание:</span>
              <span className={styles.value} onClick={() => setIsOpen(true)}>Смотреть</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Статус:</span>
              <span className={`${styles.value} ${styles.status} ${styles[mod.status]}`}>
                {mod.status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Дата создания:</span>
              <span className={styles.value}>
                {new Date(mod.createdAt || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Файлы и ссылки</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Ссылка на превью:</span>
              <a href={mod.previewLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {mod.previewLink}
              </a>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Ссылка на файл:</span>
              <a href={mod.fileLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {mod.fileLink}
              </a>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>YouTube видео:</span>
              {mod.youtubeLink ? (
                <a href={mod.youtubeLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {mod.youtubeLink}
                </a>
              ) : (
                <span className={styles.value}>Не указано</span>
              )}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Размер файла:</span>
              <span className={styles.value}>{mod.size}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Пароль архива:</span>
              <span className={styles.value}>{mod.archivePassword || 'Не указан'}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Категории</h2>
          <div className={styles.categories}>
            {mod.categories?.map((category: string) => (
              <div key={category} className={styles.category}>
                {categoryNames[category]}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Статистика</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Лайки:</span>
              <span className={styles.value}>{mod.rating.like}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Дизлайки:</span>
              <span className={styles.value}>{mod.rating.dislike}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Загрузки:</span>
              <span className={styles.value}>{mod.rating.downloads}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Информация о пользователе</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Username:</span>
              <span className={styles.value}>{mod.discord}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Видимость Username:</span>
              <span className={styles.value}>
                {mod.isVisibleDiscord ? 'Видимый' : 'Скрытый'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => navigate(`/admin/mods/${mod._id}/edit`)}
            className={styles.editButton}
          >
            Редактировать
          </button>
          <button
            onClick={() => navigate(`/admin/mods/${mod._id}/delete`)}
            className={styles.deleteButton}
          >
            Удалить
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen}>
        
        <div className={styles['modal-content']}>
          <div className={styles["modal-header"]}>
            <h2>Описание</h2>
            <button
              className={styles["closeButtonStyles"]}
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
           <MarkdownReact content={mod.description} />
        </div>
      </Modal>
    </div>
  );
};

export default AdminModDetail;