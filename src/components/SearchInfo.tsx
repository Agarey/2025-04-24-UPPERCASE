import React from 'react';
import ResultsCount from './ResultsCount';
import styles from '../styles/components/SearchInfo.module.css';

interface Props {
  searchTerm: string;
  totalResults: number;
}

const SearchInfo: React.FC<Props> = ({ searchTerm, totalResults }) => (
  <div className={styles.search_info}>
    <h2 className={styles.title}>
      You searched for:&nbsp;
      <span className={styles.term}>{searchTerm}</span>
    </h2>
    <ResultsCount totalResults={totalResults} />
  </div>
);

export default SearchInfo;
