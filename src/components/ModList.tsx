import React, { useState } from 'react';
import styles from '../assets/ModList.module.scss';
import { FaSortAmountDown, FaSortAmountUp, FaSearch, FaImage, FaVideo } from 'react-icons/fa';
import { testMods } from '../mocks/testMods';
import { IModCard } from '../interfaces/mod.interface';
import ModCard from './ModCard';

interface ModListProps {
    mods?: IModCard[];
}

const ModList: React.FC<ModListProps> = ({ mods = testMods }) => {
    const [sortBy, setSortBy] = useState<'downloads' | 'name'>('downloads');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showVideo, setShowVideo] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const sortedMods = [...mods]
        .filter(mod => mod.mod.modName.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'downloads') {
                const downloadsA = a.mod.downloads ?? 0;
                const downloadsB = b.mod.downloads ?? 0;
                return sortOrder === 'asc' ? downloadsA - downloadsB : downloadsB - downloadsA;
            } else {
                return sortOrder === 'asc' 
                    ? a.mod.modName.localeCompare(b.mod.modName)
                    : b.mod.modName.localeCompare(a.mod.modName);
            }
        });

    return (
        <div className={styles.modList}>
            <div className={styles.controls}>
                <div className={styles.controlsGroup}>
                    <div className={styles.sortControls}>
                        <button
                            onClick={() => setSortBy('downloads')}
                            className={`${styles.sortButton} ${sortBy === 'downloads' ? styles.active : ''}`}
                        >
                            По загрузкам
                        </button>
                        <button
                            onClick={() => setSortBy('name')}
                            className={`${styles.sortButton} ${sortBy === 'name' ? styles.active : ''}`}
                        >
                            По имени
                        </button>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className={styles.sortOrderButton}
                        >
                            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                        </button>
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
                </div>
                <div className={styles.previewType}>
                    <button
                        onClick={() => setShowVideo(false)}
                        className={`${styles.previewButton} ${!showVideo ? styles.active : ''}`}
                    >
                        <span>Картинка</span>
                    </button>
                    <button
                        onClick={() => setShowVideo(true)}
                        className={`${styles.previewButton} ${showVideo ? styles.active : ''}`}
                    >
                        <span>Видео</span>
                    </button>
                </div>
            </div>
            <div className={styles.modsGrid}>
                {sortedMods.map(mod => (
                    <ModCard key={mod.mod._id} mod={mod} sortOptions={showVideo} />
                ))}
            </div>
        </div>
    );
};

export default ModList; 