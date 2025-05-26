import React from 'react';
import {
  getPageNumbers,
  handleNext,
  handlePrevious,
} from '@/utils/pagination';
import styles from '../styles/components/Pagination.module.css';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.pagination__button} ${styles.pagination__arrow}`}
        onClick={() => handlePrevious(currentPage, onPageChange)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <img src="/svg/arrow_left.svg" alt="Prev" />
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <button
            key={`e${i}`}
            className={`${styles.pagination__button} ${styles.pagination__ellipsis}`}
            disabled
          >
            &hellip;
          </button>
        ) : (
          <button
            key={p}
            className={`${styles.pagination__button} ${
              p === currentPage ? styles['pagination__button--active'] : ''
            }`}
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={`${styles.pagination__button} ${styles.pagination__arrow}`}
        onClick={() => handleNext(currentPage, totalPages, onPageChange)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <img src="/svg/arrow_right.svg" alt="Next" />
      </button>
    </div>
  );
}
