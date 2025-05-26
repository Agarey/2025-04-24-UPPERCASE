import { useMemo, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from './Skeleton';
import { Film, Tv, Gamepad } from 'lucide-react';

import { useFavorite } from '@/hooks/useFavorite';
import { ThemeCtx } from '@/utils/theme';

import styles from '../styles/components/MovieCard.module.css';

const PLACEHOLDER = process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE!;

export interface RawMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'game';
  Poster: string;
}

export type MovieDetails = RawMovie & {
  Plot: string;
  imdbRating: string;
};

export type Movie = RawMovie & MovieDetails;

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const router = useRouter();
  const { fav, toggle } = useFavorite(movie.imdbID);
  const { theme } = useContext(ThemeCtx);

  const posterSrc = useMemo(
    () => (movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER),
    [movie.Poster],
  );
  const [imgSrc, setImgSrc] = useState(posterSrc);

  const plotContent = (() => {
    if (movie.Plot === '') return <Skeleton lines={2} />;
    if (movie.Plot === 'N/A') return '—';
    return movie.Plot.length > 40 ? `${movie.Plot.slice(0, 40)}…` : movie.Plot;
  })();

  const ratingContent = (() => {
    if (movie.imdbRating === '') return <Skeleton width={40} />;
    return movie.imdbRating === 'N/A' ? '—' : movie.imdbRating;
  })();

  const TypeIcon = movie.Type === 'movie' ? Film : movie.Type === 'series' ? Tv : Gamepad;

  return (
    <Link
      href={{ pathname: '/movie/[id]', query: { id: movie.imdbID, ...router.query } }}
      className={styles.card_link}
    >
      <article className={styles.movie_card} data-theme={theme}>
        <Image
          src={imgSrc}
          alt={movie.Title}
          width={245}
          height={270}
          className={styles.movie_card__image}
          sizes="(max-width: 768px) 45vw, 245px"
          onError={() => {
            if (imgSrc !== PLACEHOLDER) setImgSrc(PLACEHOLDER);
          }}
        />

        <div className={styles.movie_card__info}>
          <div className={styles.typeBadge}>
            <TypeIcon size={12} className={styles.typeIcon} />
            <span className={styles.typeText}>{movie.Type}</span>
          </div>

          <h3 className={styles.title}>{movie.Title}</h3>
          <span className={styles.year}>{movie.Year}</span>

          <span className={styles.rating}>IMDb:&nbsp;{ratingContent}</span>

          <p className={styles.plot}>{plotContent}</p>
        </div>

        <button
          type="button"
          className={`${styles.movie_card__fav} ${fav ? styles['movie_card__fav--active'] : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          ★
        </button>

        {movie.Plot && movie.Plot !== 'N/A' && (
          <div className={styles.overlay}>
            <button
              type="button"
              className={`${styles.movie_card__fav} ${
                fav ? styles['movie_card__fav--active'] : ''
              } ${styles.overlayFav}`}
              onClick={(e) => {
                e.preventDefault();
                toggle();
              }}
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              ★
            </button>
            <p className={styles.overlayText}>{movie.Plot}</p>
          </div>
        )}
      </article>
    </Link>
  );
}
