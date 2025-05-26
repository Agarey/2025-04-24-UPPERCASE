import React from 'react';
import styles from '../styles/components/SearchInput.module.css';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter: () => void;
}

const SearchInput: React.FC<Props> = ({ value, onChange, onEnter }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onEnter();
  };

  return (
    <div className={styles.search_input}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Movie"
      />
      <img
        src="/svg/search.svg"
        alt="Search"
        className={styles.search_icon}
        onClick={onEnter}
      />
    </div>
  );
};

export default SearchInput;
