import React from 'react';
import styles from '../styles/components/Filters.module.css';

export type SortField = 'default' | 'title' | 'year';
export type SortOrder = 'asc' | 'desc';
export type FilterType = 'all' | 'movie' | 'series' | 'game';

interface Props {
  sortField: SortField;
  sortOrder: SortOrder;
  filterType: FilterType;
  onChange: (
    patch: Partial<{
      sortField: SortField;
      sortOrder: SortOrder;
      filterType: FilterType;
    }>
  ) => void;
  onReset: () => void;
}

const Filters: React.FC<Props> = ({
  sortField,
  sortOrder,
  filterType,
  onChange,
  onReset,
}) => {
  const showReset =
    sortField !== 'default' ||
    sortOrder !== 'asc' ||
    filterType !== 'all';

  return (
    <div className={styles.filters}>
      <div className={styles.control}>
        <label htmlFor="filterType">Type</label>
        <select
          id="filterType"
          value={filterType}
          onChange={e =>
            onChange({ filterType: e.target.value as FilterType })
          }
        >
          <option value="all">All</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="game">Game</option>
        </select>
      </div>

      <div className={styles.control}>
        <label htmlFor="sortField">Sort</label>
        <select
          id="sortField"
          value={sortField}
          onChange={e =>
            onChange({ sortField: e.target.value as SortField })
          }
        >
          <option value="default">Default</option>
          <option value="title">Title</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div className={styles.order_controls}>
        <button
          type="button"
          className={`${styles.order_btn} ${
            sortField !== 'default' && sortOrder === 'asc'
              ? styles['order_btn--active']
              : ''
          }`}
          onClick={() => onChange({ sortOrder: 'asc' })}
          disabled={sortField === 'default'}
          aria-label="Ascending"
        >
          ↑
        </button>
        <button
          type="button"
          className={`${styles.order_btn} ${
            sortField !== 'default' && sortOrder === 'desc'
              ? styles['order_btn--active']
              : ''
          }`}
          onClick={() => onChange({ sortOrder: 'desc' })}
          disabled={sortField === 'default'}
          aria-label="Descending"
        >
          ↓
        </button>
      </div>

      {showReset && (
        <button
          type="button"
          className={styles.reset_btn}
          onClick={onReset}
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default Filters;
