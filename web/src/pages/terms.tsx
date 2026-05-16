'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/styles/privacy.module.css';

const TermsPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <PageBackground />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={`${styles.title} ${styles.titleLight}`}>
              {t.footer.terms || 'Terms of Service'}
            </h1>
          </div>

          <div className={styles.card}>
            <div className={styles.sections}>
              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>1. Acceptance of Terms</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  By accessing and using DalaalPrime, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>2. Use License</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  Permission is granted to temporarily download one copy of the materials (information or software) on DalaalPrime for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className={styles.list}>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>Modify or copy the materials</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>Use the materials for any commercial purpose or for any public display</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>Attempt to decompile or reverse engineer any software contained on DalaalPrime</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>Remove any copyright or other proprietary notations from the materials</li>
                  <li className={`${styles.listItem} ${styles.listItemLight}`}>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>3. Disclaimer</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  The materials on DalaalPrime are provided on an 'as is' basis. DalaalPrime makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>4. Limitations</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  In no event shall DalaalPrime or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DalaalPrime, even if DalaalPrime or a DalaalPrime authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>5. Accuracy of Materials</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  The materials appearing on DalaalPrime could include technical, typographical, or photographic errors. DalaalPrime does not warrant that any of the materials on DalaalPrime are accurate, complete, or current. DalaalPrime may make changes to the materials contained on its website at any time without notice.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>6. Links</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  DalaalPrime has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by DalaalPrime of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>7. Modifications</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  DalaalPrime may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>8. Governing Law</h2>
                <p className={`${styles.sectionText} ${styles.sectionTextLight}`}>
                  These terms and conditions are governed by and construed in accordance with the laws of Somalia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;