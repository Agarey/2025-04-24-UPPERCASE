import { FilterType, SortField, SortOrder } from '@/components/Filters';

export interface UrlQuery {
  term: string;
  filter: FilterType;
  sField: SortField;
  sOrder: SortOrder;
  page: number;
}

export const buildQuery = ({
  term,
  filter,
  sField,
  sOrder,
  page,
}: UrlQuery) =>
  `term=${encodeURIComponent(term)}&filter=${filter}&sf=${sField}&so=${sOrder}&p=${page}`;
