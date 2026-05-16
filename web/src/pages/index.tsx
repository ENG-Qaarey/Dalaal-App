import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ArrowRight, Users, CheckCircle2, ShieldCheck, Star, Building2, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageBackground from '@/components/shared/PageBackground';
import { MainNavbar } from '@/components/layout/MainNavbar';
import styles from '@/styles/index.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const stats = [
  { label: 'Properties', value: '2,500+', color: 'text-sky-500' },
  { label: 'Verified Brokers', value: '450+', color: 'text-indigo-500' },
  { label: 'Daily Viewings', value: '1,200+', color: 'text-purple-500' },
];

const features = [
  {
    title: 'Verified Brokers',
    desc: 'We manually vet every broker on our platform so you can transact with absolute confidence.',
    Icon: ShieldCheck,
    cls: styles.iconSky,
  },
  {
    title: 'Live Inventory',
    desc: 'Browse real-time listings with up-to-the-minute availability and direct contact paths.',
    Icon: Building2,
    cls: styles.iconIndigo,
  },
  {
    title: 'Global Reach',
    desc: 'Connecting property seekers from Somalia and the diaspora to premium opportunities.',
    Icon: Globe,
    cls: styles.iconPurple,
  },
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem('dalaal_theme');
    let initialDark = false;

    if (stored === 'dark') {
      initialDark = true;
    } else if (stored === 'light') {
      initialDark = false;
    } else {
      initialDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      window.localStorage.setItem('dalaal_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.containerDark : styles.containerLight}`}>
      <Head>
        <title>DalaalPrime | The Future of Real Estate in Somalia</title>
        <meta name="description" content="Discover premium properties with Somalia's most trusted real estate network. Connecting verified brokers with property seekers globally." />
      </Head>

      <PageBackground />

      <div className={styles.floatingOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <MainNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} activePage="home" />

      <main className={styles.main}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.content}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className={`${styles.badge} ${isDarkMode ? styles.badgeDark : styles.badgeLight}`}
          >
            <Star className="w-3.5 h-3.5 mr-2 fill-current" />
            <span className={styles.badgeText}>Somalia's Premium Property Network</span>
          </motion.div>

          {/* Hero Section */}
          <motion.h1 
            variants={itemVariants}
            className={`${styles.heading} ${isDarkMode ? styles.headingDark : styles.headingLight}`}
          >
            Find your place in <br />
            <span className={styles.accent}>Somalia's future</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className={`${styles.description} ${isDarkMode ? styles.descriptionDark : styles.descriptionLight}`}
          >
            DalaalPrime is the most trusted property marketplace in the country. We connect verified brokers with property seekers—faster, safer, and with live inventory.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className={styles.buttons}>
            <Link
              href="/register"
              className={`${styles.primaryBtn} ${isDarkMode ? styles.primaryBtnDark : styles.primaryBtnLight}`}
            >
              Start Exploring <ArrowRight className={styles.btnIcon} />
            </Link>
            <Link
              href="/login"
              className={`${styles.secondaryBtn} ${isDarkMode ? styles.secondaryBtnDark : styles.secondaryBtnLight}`}
            >
              Broker Portal
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className={styles.stats}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <span className={`${styles.statValue} ${stat.color}`}>{stat.value}</span>
                <span className={`${styles.statLabel} ${isDarkMode ? styles.statLabelDark : styles.statLabelLight}`}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <div className={styles.features}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className={`${styles.featureCard} ${isDarkMode ? styles.featureCardDark : styles.featureCardLight}`}
              >
                <div className={`${styles.featureIcon} ${feature.cls}`}>
                  <feature.Icon className="w-6 h-6" />
                </div>
                <h3 className={`${styles.featureTitle} ${isDarkMode ? styles.featureTitleDark : styles.featureTitleLight}`}>
                  {feature.title}
                </h3>
                <p className={`${styles.featureDesc} ${isDarkMode ? styles.featureDescDark : styles.featureDescLight}`}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerDivider} />
          <span className={`${styles.footerBrand} ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>DalaalPrime</span>
          <p className={`${styles.footerText} ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            &copy; {new Date().getFullYear()} DalaalPrime Inc. All rights reserved. <br />
            Connecting the world to trusted Somali real estate.
          </p>
        </div>
      </footer>
    </div>
  );
}