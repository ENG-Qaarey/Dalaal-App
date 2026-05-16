'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/styles/privacy.module.css';

const PrivacyPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <PageBackground />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={`${styles.title} ${styles.titleLight}`}>
              {t.footer.privacy || 'Privacy Policy'}
            </h1>
          </div>

          <div className={styles.card}>
            <div className={styles.sections}>
              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>1. Introduction</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  DalaalPrime ("we" or "us" or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>2. Information Collection and Use</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  We collect several different types of information for various purposes to provide and improve our website to you.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <div>
                    <h3 className={`${styles.subTitle} ${styles.subTitleLight}`}>Types of Data Collected:</h3>
                    <ul className={styles.list}>
                      <li className={`${styles.listItem} ${styles.listItemLight}`}>Personal Information: Name, email address, phone number, postal address</li>
                      <li className={`${styles.listItem} ${styles.listItemLight}`}>Usage Data: Browser type, pages visited, time spent on pages</li>
                      <li className={`${styles.listItem} ${styles.listItemLight}`}>Device Information: IP address, browser type, device type</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>3. Use of Data</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  DalaalPrime uses the collected data for various purposes:
                </p>
                <ul className={styles.list}>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>To provide and maintain our website</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>To notify you about changes to our website</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>To allow you to participate in interactive features of our website</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>To gather analysis or valuable information to improve our website</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>To monitor the usage of our website</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>To detect, prevent and address technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>4. Security of Data</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>5. Changes to This Privacy Policy</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>6. Contact Us</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className={styles.contactInfo}>
                  <p className={`${styles.contactInfoText} ${styles.contactInfoTextLight}`}>
                    Email: <a href="mailto:muscabqaarey@gmail.com" className={styles.link}>muscabqaarey@gmail.com</a>
                  </p>
                  <p className={`${styles.contactInfoText} ${styles.contactInfoTextLight}`}>
                    Phone: <a href="tel:614463895" className={styles.link}>614463895</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;