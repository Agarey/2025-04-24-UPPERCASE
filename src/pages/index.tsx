import Head from 'next/head';
import type { GetServerSideProps } from 'next';

import SearchInfo from '@/components/SearchInfo';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import ErrorToast from '@/components/ErrorToast';
import ScrollTopButton from '@/components/ScrollTopButton';
import Filters, {
  FilterType,
  SortField,
  SortOrder,
} from '@/components/Filters';

import { useMovies } from '@/hooks/useMovies';
import { getRandomSearchTerm } from '@/utils/randomTerms';

import styles from '../styles/pages/Home.module.css';

interface PropsFromServer {
  initialData: {
    term: string;
    filter: FilterType;
    sField: SortField;
    sOrder: SortOrder;
    page: number;
  };
}

export default function Home({ initialData }: PropsFromServer) {
  const {
    movies,
    totalResults,
    totalPages,
    loading,
    error,
    term,
    sortField,
    sortOrder,
    filterType,
    page,
    changeFilters,
    resetFilters,
    goToPage,
  } = useMovies({ ...initialData, initialItems: [] });

  return (
    <>
      <Head>
        <title>{term ? `${term} – Movie catalog` : 'Movie catalog'}</title>
        <meta
          name="description"
          content="Single-page каталог фильмов с поиском по OMDb API"
        />
      </Head>

      <div className={styles.container}>
        <Filters
          sortField={sortField}
          sortOrder={sortOrder}
          filterType={filterType}
          onChange={changeFilters}
          onReset={resetFilters}
        />

        {term && <SearchInfo searchTerm={term} totalResults={totalResults} />}

        {loading ? (
          <Loader />
        ) : totalResults === 0 ? (
          <EmptyState />
        ) : (
          <MovieGrid movies={movies} />
        )}

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}

        <ErrorToast message={error} onClose={() => {/* no-op */}} />

        <ScrollTopButton />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PropsFromServer> = async ({
  query,
}) => {
  const q = {
    term: typeof query.term === 'string' ? query.term : null,
    filter: (query.filter as FilterType) ?? 'all',
    sField: (query.sf as SortField) ?? 'default',
    sOrder: (query.so as SortOrder) ?? 'asc',
    page: parseInt((query.p as string) ?? '1', 10) || 1,
  };

  const term = q.term ?? getRandomSearchTerm();

  return {
    props: {
      initialData: {
        term,
        filter: q.filter,
        sField: q.sField,
        sOrder: q.sOrder,
        page: q.page,
      },
    },
  };
};
