import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { buildQuery, UrlQuery } from '@/utils/query';
import { scrollTopSmooth } from '@/utils/scroll';
import { FilterType, SortField, SortOrder } from '@/components/Filters';
import { RawMovie, Movie } from '@/components/MovieCard';

export interface MovieDetails extends RawMovie {
  Plot: string;
  imdbRating: string;
}

const PAGE_SIZE = 10;

export interface UseMoviesProps extends UrlQuery {
  initialItems: RawMovie[];
}

export const useMovies = ({
  term: initialTerm,
  filter: initialFilter,
  sField: initialSF,
  sOrder: initialSO,
  page: initialPage,
}: UseMoviesProps) => {
  const router = useRouter();

  const [sortField, setSortField] = useState<SortField>(initialSF);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSO);
  const [filterType, setFilterType] = useState<FilterType>(initialFilter);
  const [page, setPage] = useState(initialPage);
  const [term, setTerm] = useState(initialTerm);

  const {
    data: allItems = [],
    isFetching: loading,
    error,
    refetch,
  } = useQuery<RawMovie[], Error>({
    queryKey: ['search', term],
    queryFn: async () => {
      const res = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error('Server error');
      const json = await res.json();
      return (json.items ?? []) as RawMovie[];
    },
    placeholderData: (prev) => prev,
  });

  const filteredSorted = useMemo<RawMovie[]>(() => {
    let list =
      filterType === 'all'
        ? allItems
        : allItems.filter((m: RawMovie) => m.Type === filterType);

    if (sortField !== 'default') {
      list = [...list].sort((a: RawMovie, b: RawMovie) => {
        const cmp =
          sortField === 'title'
            ? a.Title.localeCompare(b.Title)
            : Number(a.Year) - Number(b.Year);
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [allItems, filterType, sortField, sortOrder]);

  const totalResults = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  const pageSlice = useMemo<RawMovie[]>(
    () => filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredSorted, page],
  );

  const pageIds = pageSlice.map((m) => m.imdbID).join(',');

  const { data: details = {} } = useQuery<Record<string, MovieDetails>, Error>({
    queryKey: ['details', pageIds],
    queryFn: async () => {
      if (!pageIds) return {};
      const res = await fetch(`/api/details?ids=${pageIds}`);
      if (!res.ok) throw new Error('Details error');
      const { details } = await res.json();
      return details as Record<string, MovieDetails>;
    },
    enabled: Boolean(pageIds),
    staleTime: 3_600_000,
    placeholderData: (prev) => prev ?? {},
  });

  const movies: Movie[] = useMemo<Movie[]>(
    () =>
      pageSlice.map((m) => ({
        ...m,
        Plot: details[m.imdbID]?.Plot ?? '',
        imdbRating: details[m.imdbID]?.imdbRating ?? '',
      })),
    [pageSlice, details],
  );

  const pushState = useCallback(
    (over?: Partial<UrlQuery>) => {
      const q: UrlQuery = {
        term,
        filter: filterType,
        sField: sortField,
        sOrder: sortOrder,
        page,
        ...over,
      };
      router.replace(`/?${buildQuery(q)}`, undefined, { shallow: true });
    },
    [router, term, filterType, sortField, sortOrder, page],
  );

  const changeFilters = (
    patch: Partial<{
      sortField: SortField;
      sortOrder: SortOrder;
      filterType: FilterType;
    }>,
  ) => {
    const newSF = patch.sortField ?? sortField;
    const newSO = patch.sortOrder ?? sortOrder;
    const newFT = patch.filterType ?? filterType;

    setSortField(newSF);
    setSortOrder(newSO);
    setFilterType(newFT);
    setPage(1);
    pushState({ sField: newSF, sOrder: newSO, filter: newFT, page: 1 });
    scrollTopSmooth();
  };

  const resetFilters = () => {
    setSortField('default');
    setSortOrder('asc');
    setFilterType('all');
    setPage(1);
    pushState({ sField: 'default', sOrder: 'asc', filter: 'all', page: 1 });
    scrollTopSmooth();
    refetch();
  };

  const goToPage = (p: number) => {
    setPage(p);
    pushState({ page: p });
    scrollTopSmooth();
  };

  return {
    movies,
    totalResults,
    totalPages,
    loading,
    error: error?.message ?? '',
    term,
    sortField,
    sortOrder,
    filterType,
    page,
    changeFilters,
    resetFilters,
    goToPage,
  };
};
