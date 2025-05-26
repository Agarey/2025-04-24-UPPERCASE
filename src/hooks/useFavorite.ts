import { useCallback, useEffect, useState } from 'react';
import { isFav, toggleFav } from '@/utils/favorites';

const getGuestId = (): string => {
  if (typeof window === 'undefined') return 'guest';
  const LS_KEY = 'guest_uuid';
  let uid = localStorage.getItem(LS_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(LS_KEY, uid);
  }
  return uid;
};

export const useFavorite = (movieId: string) => {
  const username =
    typeof window !== 'undefined'
      ? localStorage.getItem('user') || getGuestId()
      : 'guest';

  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setFav(isFav(username, movieId));
  }, [username, movieId]);

  const toggle = useCallback(() => {
    toggleFav(username, movieId);
    setFav((f) => !f);
  }, [username, movieId]);

  return { fav, toggle };
};
