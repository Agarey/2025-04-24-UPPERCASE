import { useEffect, useState, useContext } from 'react';
import { ThemeCtx } from '@/utils/theme';
import styles from '../styles/components/ScrollTopButton.module.css';

const scrollTop = () =>
  typeof window !== 'undefined' &&
  window.scrollTo({ top: 0, behavior: 'smooth' });

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  const { theme } = useContext(ThemeCtx);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      className={styles.scroll_btn}
      onClick={scrollTop}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
