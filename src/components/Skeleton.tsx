import React from 'react';
import styles from '../styles/components/Skeleton.module.css';

interface Props {
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<Props> = ({
  width = '100%',
  height = '1em',
  lines = 1,
}) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <>
      {Array.from({ length: lines }).map((_, i) => (
        <span
          key={i}
          className={styles.skeleton}
          style={
            i === 0
              ? style
              : { ...style, marginTop: '0.25em', display: 'block' }
          }
        />
      ))}
    </>
  );
};

export default Skeleton;
