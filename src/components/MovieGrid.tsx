import MovieCard, { Movie } from './MovieCard';
import styles from '../styles/components/MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className={styles.movie_grid}>
      {movies.map(m => (
        <MovieCard key={m.imdbID} movie={m} />
      ))}
    </div>
  );
}
