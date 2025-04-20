import React, { useState } from "react"
import styles from "../assets/LeftSidebar.module.scss";
type MenuItem = {
    label: string;
    children?: MenuItem[];
  };
  
  const menuItems: MenuItem[] = [
    { label: 'ваши моды' },
    { label: 'отзывы' },
    {
      label: 'redux',
      children: [
        { label: 'action creators' },
        { label: 'reducers' },
        { label: 'store config' },
      ],
    },
    {
      label: 'Privat',
      children: [
        { label: 'UI Packs' },
        { label: 'Scripts' },
      ],
    },
    { label: 'FreePrivat' },
    { label: 'gunpack' },
    { label: 'clothes' },
    { label: 'world' },
    { label: 'packs' },
    { label: 'guides' },
    { label: 'other' },
  ];
  
  const Leftidebar: React.FC = () => {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  
    const toggleItem = (label: string) => {
      const newSet = new Set(openItems);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      setOpenItems(newSet);
    };
  
    const renderMenu = (items: MenuItem[], level = 0) => {
      return items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openItems.has(item.label);
  
        return (
          <div key={item.label} className={styles.menuGroup} style={{ paddingLeft: `${level * 10}px` }}>
            <button
              className={styles.menuItem}
              onClick={() => hasChildren ? toggleItem(item.label) : null}
            >
              {item.label}
              {hasChildren && <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>}
            </button>
            {hasChildren && isOpen && (
              <div className={styles.subMenu}>
                {renderMenu(item.children!, level + 1)}
              </div>
            )}
          </div>
        );
      });
    };
  
    return <aside className={styles.sidebar}>{renderMenu(menuItems)}</aside>;
  };
  
  export default Leftidebar;
  