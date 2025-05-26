import React from 'react';
import styles from '../styles/components/ResultsCount.module.css';

interface ResultsCountProps {
  totalResults: number;
}

const ResultsCount: React.FC<ResultsCountProps> = ({ totalResults }) => (
  <div className={styles.results_count}>
    {totalResults} results
  </div>
);

export default ResultsCount;
