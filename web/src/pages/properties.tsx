'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/styles/listings.module.css';

const PropertiesPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <PageBackground />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={`${styles.title} ${styles.titleLight}`}>
              {t.nav.properties || 'Properties'}
            </h1>
            <p className={`${styles.subtitle} ${styles.subtitleDark}`}>
              Discover verified properties from trusted brokers across Somalia
            </p>
          </div>

          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className={styles.card}>
                <div className={`${styles.imagePlaceholder} ${styles.skeleton}`} />
                <div className={`${styles.skeletonLine} ${styles.skeleton}`} />
                <div className={`${styles.skeletonLineSmall} ${styles.skeleton}`} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertiesPage;