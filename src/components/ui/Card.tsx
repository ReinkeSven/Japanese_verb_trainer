import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export default function Card({ elevated = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`${styles.card} ${elevated ? styles.elevated : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
