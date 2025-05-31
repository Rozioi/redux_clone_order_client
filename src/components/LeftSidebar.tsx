import React, { useState, useEffect } from 'react';
import styles from '../assets/LeftSidebar.module.scss';
import ApiService from '../services/api.service';

interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
  requiresSubscription?: boolean;
  subscriptionId?: string;
}

const LeftSidebar: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await ApiService.getCategories();
                setCategories(response as ICategory[]);
            } catch (err) {
                console.error('Error:', err);
                setCategories([
                    { _id: '1', name: 'ваши моды', parentId: null, order: 1, isActive: true },
                    { _id: '2', name: 'отзывы', parentId: null, order: 2, isActive: true }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div className={styles.sidebar}>Загрузка...</div>;

    
    const specialItems = [
        { _id: '1', name: 'ваши моды',url:'your-mods', parentId: null },
        { _id: '2', name: 'отзывы',url: 'reviews', parentId: null }
    ];

    
    const mainCategories = categories.filter(cat => 
        cat.parentId === null && !specialItems.some(item => item._id === cat._id)
    );

    return (
        <div className={styles.sidebar}>
            <nav className={styles.nav}>
                {specialItems.map(item => (
                    <a 
                        key={item._id}
                        href={`/${item.url.toLowerCase()}`}
                        className={styles.navItem}
                        style={{backgroundColor: '#1f1f1f'}}
                    >
                        {item.name}
                    </a>
                ))}

                {mainCategories.map(category => {
                    const children = categories.filter(c => c.parentId === category._id);
                    
                    return (
                        <div key={category._id}>
                            <div 
                                className={styles.navItem} 
                                onClick={() => setActiveCategory(
                                    activeCategory === category._id ? null : category._id
                                )}
                            >
                                {category.name}
                            </div>
                            
                            {activeCategory === category._id && children.length > 0 && (
                                <div className={styles.category}>
                                    {children.map(child => (
                                        <a 
                                            key={child._id}
                                            href={`/${category.name.toLowerCase()}/${child.name.toLowerCase()}`}
                                            className={styles.subCategory}
                                        >
                                            {child.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default LeftSidebar;