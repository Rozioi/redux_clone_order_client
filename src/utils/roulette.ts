import { ROULETTE_CONFIG } from '../constants/roulette';

export const calculateRoulettePosition = (
  index: number,
  containerWidth: number
): number => {
  const { ITEM_WIDTH } = ROULETTE_CONFIG.ANIMATION;
  return -(index * ITEM_WIDTH) - (containerWidth / 2) + (ITEM_WIDTH / 2);
};

export const getRandomModIndex = (modsCount: number): number => {
  return Math.floor(Math.random() * modsCount);
};

export const calculateInitialPosition = (modsCount: number): number => {
  const { INITIAL_SPINS, ITEM_WIDTH } = ROULETTE_CONFIG.ANIMATION;
  return -(INITIAL_SPINS * modsCount * ITEM_WIDTH);
};

export const getAnimationStyle = (isSpinning: boolean): React.CSSProperties => {
  const { DURATION } = ROULETTE_CONFIG.ANIMATION;
  return {
    transition: isSpinning
      ? `transform ${DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
      : 'none',
  };
}; 