import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/study',    label: 'Study' },
  { to: '/progress', label: 'Progress' },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoKanji}>動詞</span>
        <span className={styles.logoText}>Verb Trainer</span>
      </Link>
      <nav className={styles.nav}>
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`${styles.navLink} ${pathname === to ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
