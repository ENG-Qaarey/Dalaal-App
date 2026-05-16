import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import styles from '@/styles/404.module.css';

export default function Custom404() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Home className={styles.icon} />
        </div>
        <p className={styles.badge}>Page not found</p>
        <h1 className={`${styles.title} ${styles.titleLight}`}>404</h1>
        <p className={`${styles.description} ${styles.descriptionLight}`}>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link href="/" className={styles.link}>
          <ArrowLeft className={styles.linkIcon} />
          Go back home
        </Link>
      </div>
    </main>
  );
}