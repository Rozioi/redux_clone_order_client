import React, { useState } from 'react';
import styles from '../assets/LeftSidebar.module.scss';
import { FaHome, FaComment } from 'react-icons/fa';

const LeftSidebar: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const toggleCategory = (category: string) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    return (
        <div className={styles.sidebar}>
            <nav className={styles.nav}>
                <a href="/your-mods" style={{backgroundColor: '#1f1f1f'}} className={styles.navItem}>
                    <span>ваши моды</span>
                </a>
                <a href="/reviews" style={{backgroundColor: '#1f1f1f'}} className={styles.navItem}>
                    <span>отзывы</span>
                </a>

                <div className={styles.navItem} onClick={() => toggleCategory('redux')}>
                    <span>redux</span>
                </div>
                {activeCategory === 'redux' && (
                    <div className={styles.category}>
                        <a href="/redux/all" className={styles.subCategory}>All</a>
                        <a href="/redux/privat" className={styles.subCategory}>Privat</a>
                        <a href="/redux/freeprivat" className={styles.subCategory}>FreePrivat</a>
                    </div>
                )}

                <div className={styles.navItem} onClick={() => toggleCategory('gunpack')}>
                    <span>gunpack</span>
                </div>
                {activeCategory === 'gunpack' && (
                    <div className={styles.category}>
                        <a href="/gunpack/all" className={styles.subCategory}>All</a>
                        <a href="/gunpack/privat" className={styles.subCategory}>Privat</a>
                        <a href="/gunpack/freeprivat" className={styles.subCategory}>FreePrivat</a>
                        <a href="/gunpack/revolver" className={styles.subCategory}>Revolver</a>
                        <a href="/gunpack/carbine" className={styles.subCategory}>Carbine</a>
                        <a href="/gunpack/sounds" className={styles.subCategory}>Sounds</a>
                    </div>
                )}

                <div className={styles.navItem} onClick={() => toggleCategory('clothes')}>
                    <span>clothes</span>
                </div>
                {activeCategory === 'clothes' && (
                    <div className={styles.category}>
                        <a href="/clothes/all" className={styles.subCategory}>All</a>
                        <a href="/clothes/tattoo" className={styles.subCategory}>Тату</a>
                        <a href="/clothes/gloves" className={styles.subCategory}>Перчатки</a>
                        <a href="/clothes/top" className={styles.subCategory}>Верх</a>
                        <a href="/clothes/bottom" className={styles.subCategory}>Низ</a>
                        <a href="/clothes/backpacks" className={styles.subCategory}>Рюкзаки</a>
                    </div>
                )}

                <div className={styles.navItem} onClick={() => toggleCategory('world')}>
                    <span>world</span>
                </div>
                {activeCategory === 'world' && (
                    <div className={styles.category}>
                        <a href="/world/all" className={styles.subCategory}>All</a>
                        <a href="/world/roads" className={styles.subCategory}>Дороги</a>
                        <a href="/world/grass" className={styles.subCategory}>Трава</a>
                    </div>
                )}

                <div className={styles.navItem} onClick={() => toggleCategory('packs')}>
                    <span>packs</span>
                </div>
                {activeCategory === 'packs' && (
                    <div className={styles.category}>
                        <a href="/packs/all" className={styles.subCategory}>All</a>
                    </div>
                )}

                <div className={styles.navItem} onClick={() => toggleCategory('guides')}>
                    <span>guides</span>
                </div>
                {activeCategory === 'guides' && (
                    <div className={styles.category}>
                        <a href="/guides/all" className={styles.subCategory}>All</a>
                    </div>
                )}

                <div className={styles.navItem} onClick={() => toggleCategory('other')}>
                    <span>other</span>
                </div>
                {activeCategory === 'other' && (
                    <div className={styles.category}>
                        <a href="/other/all" className={styles.subCategory}>All</a>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default LeftSidebar; 