import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMod } from '../../interface/mod.interface';
import { ROULETTE_CONFIG } from '../../constants/roulette';
import {
  calculateRoulettePosition,
  getRandomModIndex,
  calculateInitialPosition,
  getAnimationStyle,
} from '../../utils/roulette';
import styles from './Roulette.module.scss';

interface RouletteProps {
  mods: IMod[];
}

const Roulette: React.FC<RouletteProps> = ({ mods }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMod, setSelectedMod] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleNavigation = useCallback(() => {
    if (selectedMod !== null && !isSpinning && mods[selectedMod]) {
      navigate(`/mod/${mods[selectedMod]._id}`);
    }
  }, [selectedMod, isSpinning, mods, navigate]);

  useEffect(() => {
    if (selectedMod !== null && !isSpinning) {
      const timer = setTimeout(
        handleNavigation,
        ROULETTE_CONFIG.ANIMATION.NAVIGATION_DELAY
      );
      return () => clearTimeout(timer);
    }
  }, [selectedMod, isSpinning, handleNavigation]);

  const spinRoulette = useCallback(() => {
    if (isSpinning || !mods.length) return;
    
    setIsSpinning(true);
    setSelectedMod(null);
    
    const initialPosition = calculateInitialPosition(mods.length);
    setPosition(initialPosition);
    
    setTimeout(() => {
      const randomIndex = getRandomModIndex(mods.length);
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const targetPosition = calculateRoulettePosition(randomIndex, containerWidth);
      
      setPosition(targetPosition);
      setSelectedMod(randomIndex);
      
      setTimeout(() => {
        setIsSpinning(false);
      }, ROULETTE_CONFIG.ANIMATION.DURATION);
    }, ROULETTE_CONFIG.ANIMATION.SPIN_DELAY);
  }, [isSpinning, mods.length]);

  const renderModCard = useCallback((mod: IMod, index: number) => (
    <div 
      key={mod._id} 
      className={`${styles.modCard} ${selectedMod === index ? styles.selected : ''}`}
    >
      <img src={mod.previewLink} alt={mod.modName} />
      <h3>{mod.modName}</h3>
    </div>
  ), [selectedMod]);

  return (
    <div className={styles.rouletteContainer}>
      <div className={styles.rouletteWrapper}>
        <div 
          ref={containerRef}
          className={styles.rouletteTrack}
          style={{ 
            transform: `translateX(${position}px)`,
            ...getAnimationStyle(isSpinning)
          }}
        >
          {mods.map(renderModCard)}
        </div>
      </div>
      <div className={styles.controls}>
        <button 
          onClick={spinRoulette} 
          disabled={isSpinning}
          className={styles.spinButton}
        >
          {isSpinning ? 'Крутится...' : 'Крутить рулетку'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(Roulette); 