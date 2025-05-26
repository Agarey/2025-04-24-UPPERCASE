import { useEffect, useState } from 'react';
import Head from 'next/head';
import MovieGrid from '@/components/MovieGrid';
import Loader from '@/components/Loader';
import { getFavIds } from '@/utils/favorites';

export default function Favorites() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uname = localStorage.getItem('user') || 'guest';
    const ids = getFavIds(uname);

    if (!ids.length) {
      setMovies([]);
      setLoading(false);
      return;
    }

    (async () => {
      const res = await fetch(`/api/details?ids=${ids.join(',')}`);
      const { details } = await res.json();
      const arr = ids.map((id) => ({
        imdbID: id,
        Title: details[id].Title,
        Year: details[id].Year,
        Type: details[id].Type,
        Poster: details[id].Poster,
        Plot: details[id].Plot,
        imdbRating: details[id].imdbRating,
      }));
      setMovies(arr);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Favorites – Movie catalog</title>
      </Head>
      {loading ? <Loader /> : <MovieGrid movies={movies} />}
    </>
  );
}
