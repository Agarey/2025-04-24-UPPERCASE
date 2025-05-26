import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown } from 'lucide-react';

import { ThemeCtx } from '@/utils/theme';
import styles from '../styles/components/UserProfile.module.css';

interface Props {
  user: { name: string; avatarUrl: string } | null;
}

export default function UserProfile({ user }: Props) {
  const router = useRouter();
  const { theme, toggle } = useContext(ThemeCtx);

  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const onRoute = () => setOpen(false);
    router.events.on('routeChangeStart', onRoute);
    return () => router.events.off('routeChangeStart', onRoute);
  }, [router.events]);

  if (!user) return null;

  return (
    <div
      ref={boxRef}
      className={styles.header__user}
      onClick={() => setOpen((o) => !o)}
    >
      <img
        src={user.avatarUrl || '/svg/user.svg'}
        alt="User avatar"
        className={styles.avatar}
      />
      <span className={styles.username}>{user.name}</span>

      <ChevronDown
        size={16}
        className={styles.arrow}
        style={{
          marginLeft: 4,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
        aria-hidden
      />

      {open && (
        <ul className={styles.menu}>
          <li
            className={styles.menuItem}
            onClick={() => router.push('/favorites')}
          >
            ⭐ Favorites
          </li>
          <li className={styles.menuItem} onClick={toggle}>
            {theme === 'dark' ? '🌞 Light mode' : '🌙 Dark mode'}
          </li>
        </ul>
      )}
    </div>
  );
}
