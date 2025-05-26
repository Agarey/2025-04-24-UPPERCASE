import React, { useContext } from 'react';
import { ThemeCtx } from '@/utils/theme';
import styles from '../styles/components/EmptyState.module.css';

const EmptyState: React.FC = () => {
  const { theme } = useContext(ThemeCtx);
  const iconSrc =
    theme === 'dark' ? '/svg/empty_dark.svg' : '/svg/empty_light.svg';

  return (
    <div className={styles.empty_state}>
      <img src={iconSrc} alt="Nothing found" className={styles.icon} />
      <p className={styles.text}>Ничего не найдено</p>
    </div>
  );
};

export default EmptyState;
