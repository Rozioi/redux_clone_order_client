import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IMod } from '../../interface/mod.interface';
import ApiService from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import styles from '../../assets/ModList.module.scss';
import ModCard from './ModCard';
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { ICategory } from '../../interface/category.interface';
import { AdvertisementCarousel } from '../AdvertisementCarousel';

const ModList: React.FC = () => {
  const [mods, setMods] = useState<IMod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { category: categorySlug, subcategory: subcategorySlug } = useParams<{
      category?: string;
      subcategory?: string;
    }>();

  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'downloads'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    const fetchMods = async () => {
      try {
        setLoading(true);
        setError(null);
        const [modsData, categoriesData] = await Promise.all([
               ApiService.getModsForUser(),
               ApiService.getCategories()
             ]);
             
             setMods(modsData);
             setCategories(categoriesData);
      } catch (err) {
        setError('Ошибка при загрузке модов');
        console.error('Error fetching mods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMods();
  }, []);
  const filteredAndSortedMods = useMemo(() => {
    if (!mods) return [];
    
    let filtered = [...mods];
    if (categorySlug) {
      const category = categories.find(c => 
        c.name.toLowerCase() === categorySlug.toLowerCase() && !c.parentId
      );
      
      if (category) {
        filtered = filtered.filter(mod => 
          mod.categories?.includes(category._id || '')
        );
  
        if (subcategorySlug) {
          const subcategory = categories.find(c => 
            c.name.toLowerCase() === subcategorySlug.toLowerCase() && 
            c.parentId === category._id
          );
          
          if (subcategory) {
            filtered = filtered.filter(mod =>
              mod.categories?.includes(subcategory._id || '')
            );
          }
        }
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(mod =>
        mod.modName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return sortOrder === 'asc'
          ? (a.rating?.downloads || 0) - (b.rating?.downloads || 0)
          : (b.rating?.downloads || 0) - (a.rating?.downloads || 0);
      }
    });
  }, [mods, categories, categorySlug, subcategorySlug, searchQuery, sortBy, sortOrder]);

  

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Ошибка</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modList}>
      <div className={styles.controls}>
        <div className={styles.controlsGroup}>
          <div className={styles.sortContainer}>
            <label className={styles.sortLabel}>Сортировать по:</label>
            <div className={styles.sortGroup}>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => {
                  const value = e.target.value as 'date' | 'downloads';
                  setSortBy(value);
                }}
              >
                <option value="date">Дате</option>
                <option value="downloads">Загрузкам</option>
              </select>
              <button
                className={styles.sortDirection}
                onClick={() =>
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
              >
                {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>

          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск модов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div
            className={`${styles.previewType} ${showVideo ? styles.videoActive : ''}`}
          >
            <button
              onClick={() => setShowVideo(false)}
              className={`${styles.previewButton} ${
                !showVideo ? styles.active : ''
              }`}
            >
              Картинка
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className={`${styles.previewButton} ${
                showVideo ? styles.active : ''
              }`}
            >
              Видео
            </button>
          </div>
        </div>
      </div>

      <div className={styles.modsGrid}>
        {filteredAndSortedMods.length > 0 ? (
          <>
            {filteredAndSortedMods.map((mod, index) => (
              <React.Fragment key={mod._id}>
                <ModCard 
                  mod={mod} 
                  showVideo={showVideo} 
                  allCategories={categories}
                />
                {index % 3 === 2 && <AdvertisementCarousel />}
              </React.Fragment>
            ))}
          </>
        ) : (
          <div className={styles.noResults}>
            {categorySlug ? 'Нет модов в этой категории' : 'Моды не найдены'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModList;
