import { useContext } from 'react';
import Link from 'next/link';

import SearchInput from './SearchInput';
import UserProfile from './UserProfile';

import { ThemeCtx } from '@/utils/theme';
import styles from '../styles/components/Header.module.css';

interface Props {
  value: string;
  onValueChange: (v: string) => void;
  onSearch: () => void;
  user: { name: string; avatarUrl: string } | null;
}

export default function Header({
  value,
  onValueChange,
  onSearch,
  user,
}: Props) {
  const { theme } = useContext(ThemeCtx);

  const logoSrc =
    theme === 'dark' ? '/svg/logo_light.svg' : '/svg/logo_dark.svg';

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <img src={logoSrc} alt="Logo" className={styles.logoImg} />
      </Link>

      <SearchInput
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onEnter={onSearch}
      />

      <UserProfile user={user} />
    </header>
  );
}
