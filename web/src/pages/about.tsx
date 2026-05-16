'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';
import { CheckCircle } from 'lucide-react';
import styles from '@/styles/about.module.css';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <PageBackground />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={`${styles.title} ${styles.titleLight}`}>
              About DalaalPrime
            </h1>
            <p className={styles.subtitle}>
              Transforming Somalia's real estate marketplace with trust and transparency
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>Our Mission</h2>
            <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
              DalaalPrime is Somalia's most trusted property platform, connecting verified brokers with seekers worldwide. We're built for local users and the diaspora, providing a secure, transparent, and efficient marketplace for real estate transactions.
            </p>
          </div>

          <div>
            <h2 className={`${styles.sectionHeader} ${styles.sectionTitleLight}`}>Why Choose DalaalPrime</h2>
            <div className={styles.featuresGrid}>
              {[
                { title: 'Verified Brokers', desc: '100% verified and trusted property professionals' },
                { title: 'Secure Transactions', desc: 'Safe and transparent deals with escrow support' },
                { title: 'Free for Seekers', desc: 'No hidden fees - completely free to browse and buy' },
                { title: 'Local Expertise', desc: "Deep knowledge of Somalia's real estate market" },
                { title: '24/7 Support', desc: 'Always available to help with your queries' },
                { title: 'Multi-Language', desc: 'Support for English, Somali, and Arabic' },
              ].map((feature, idx) => (
                <div key={idx} className={styles.featureCard}>
                  <CheckCircle className={styles.featureIcon} />
                  <h3 className={`${styles.featureTitle} ${styles.featureTitleLight}`}>{feature.title}</h3>
                  <p className={`${styles.featureDesc} ${styles.featureDescLight}`}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section} style={{ marginTop: '3rem' }}>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>Our Team</h2>
            <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
              Our dedicated team is composed of real estate experts, software engineers, and market specialists committed to revolutionizing Somalia's property market. We work tirelessly to ensure every transaction on DalaalPrime is safe, transparent, and beneficial for all parties involved.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;