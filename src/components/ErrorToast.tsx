import React, { useEffect, useState } from 'react';
import styles from '../styles/components/ErrorToast.module.css';

interface Props {
  message: string;
  onClose: () => void;
}

const ErrorToast: React.FC<Props> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  if (!message || !visible) return null;

  return (
    <div className={styles.toast}>
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeBtn}
        onClick={handleClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorToast;
