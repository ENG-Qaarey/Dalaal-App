'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Moon, Sun } from 'lucide-react';
import styles from '@/styles/MainNavbar.module.css';

interface MainNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activePage?: 'home' | 'login' | 'register';
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ isDarkMode, toggleDarkMode, activePage }) => {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <div className={`${styles.logoIcon} ${isDarkMode ? styles.logoIconDark : styles.logoIconLight}`}>
          <GraduationCap className={styles.logoIconInner} />
        </div>
        <span className={`${styles.logoText} ${isDarkMode ? styles.logoTextDark : styles.logoTextLight}`}>DalaalPrime</span>
      </Link>

      <div className={styles.actions}>
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
          className={`${styles.themeBtn} ${isDarkMode ? styles.themeBtnDark : styles.themeBtnLight}`}
        >
          {isDarkMode ? <Sun className={styles.themeIcon} /> : <Moon className={styles.themeIcon} />}
        </button>

        <Link
          href="/login"
          className={`${styles.signInLink} ${isDarkMode ? styles.signInLinkDark : styles.signInLinkLight} ${activePage === 'login' ? styles.signInLinkActive : ''}`}
        >
          Sign In
        </Link>

        <Link
          href="/register"
          className={`${styles.getStartedLink} ${isDarkMode ? styles.getStartedLinkDark : styles.getStartedLinkLight} ${activePage === 'register' ? styles.getStartedLinkActive : ''}`}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};