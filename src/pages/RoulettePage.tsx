import React, { useEffect, useState } from 'react';
import Roulette from '../components/Roulette/Roulette';
import { IMod } from '../interface/mod.interface';
import ApiService from '../services/api.service';
import styles from './RoulettePage.module.scss';

const RoulettePage: React.FC = () => {
  const [mods, setMods] = useState<IMod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMods = async () => {
      try {
        const response = await ApiService.getModsForUser();
        setMods(response);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить моды');
        setLoading(false);
      }
    };

    fetchMods();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.roulettePage}>
      <h1>Рулетка модов</h1>
      <p>Крутите рулетку и получите случайный мод!</p>
      <Roulette mods={mods} />
    </div>
  );
};

export default RoulettePage; 