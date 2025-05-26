import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useHeaderSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(typeof router.query.term === 'string' ? router.query.term : '');
  }, [router.query.term]);

  useEffect(() => {
    const wipe = (url: string) => {
      const hasTerm = url.includes('term=');
      if (!hasTerm) setQuery('');
    };
    router.events.on('routeChangeStart', wipe);
    return () => router.events.off('routeChangeStart', wipe);
  }, [router.events]);

  const runSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push({ pathname: '/', query: { term: trimmed } });
  }, [router, query]);

  return { query, setQuery, runSearch };
};
