'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe, Link2, MessageSquare, ArrowUpRight } from 'lucide-react';
import styles from '@/styles/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandSection}>
            <Link href="/" className={styles.brandLink}>
              <div className={`${styles.brandInner} ${styles.brandInnerLight}`}>
                <div className={styles.brandIcon}>
                  <Image src="/AppIcon/Dalaal-Light-icon.png" alt="DalaalPrime" width={40} height={40} className={styles.brandImage} />
                  <Image src="/AppIcon/Dalaal-Dark-icon.png" alt="DalaalPrime" width={40} height={40} className={`${styles.brandImage} ${styles.brandImageDark}`} />
                </div>
                <span className={`${styles.brandName} ${styles.brandNameLight}`}>DalaalPrime</span>
              </div>
            </Link>
            <p className={styles.brandDesc}>
              Somalia's most trusted property platform. Connecting verified brokers with seekers worldwide. Built for local users and the diaspora.
            </p>
            <div className={styles.socialLinks}>
              <Link href="#" className={`${styles.socialLink} ${styles.socialLinkLight}`}>
                <Link2 className={styles.socialIcon} />
              </Link>
              <Link href="#" className={`${styles.socialLink} ${styles.socialLinkLight}`}>
                <Globe className={styles.socialIcon} />
              </Link>
              <Link href="#" className={`${styles.socialLink} ${styles.socialLinkLight}`}>
                <MessageSquare className={styles.socialIcon} />
              </Link>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>Quick Links</h3>
            <div className={styles.links}>
              <Link href="/about" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>About Us</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
              <Link href="/contact" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>Contact Us</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
              <Link href="/terms" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>Terms of Service</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
              <Link href="/privacy" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>Privacy Policy</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>Categories</h3>
            <div className={styles.links}>
              <Link href="/properties?category=houses" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>Houses</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
              <Link href="/properties?category=land" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>Land</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
              <Link href="/properties?category=cars" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>Cars</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
              <Link href="/properties?category=business" className={`${styles.linkItem} ${styles.linkItemLight}`}>
                <span className={styles.linkText}>Business</span>
                <ArrowUpRight className={styles.linkArrow} />
              </Link>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>Contact Info</h3>
            <div className={styles.contactInfo}>
              <div className={`${styles.contactItem} ${styles.contactItemLight}`}>
                <Phone className={`${styles.contactIcon} ${styles.contactIconColor}`} />
                <a href="tel:614463895" className={styles.contactLink}>614463895</a>
              </div>
              <div className={`${styles.contactItem} ${styles.contactItemLight}`}>
                <Mail className={`${styles.contactIcon} ${styles.contactIconColor}`} />
                <a href="mailto:muscabqaarey@gmail.com" className={styles.contactLink}>muscabqaarey@gmail.com</a>
              </div>
              <div className={`${styles.contactItem} ${styles.contactItemLight}`}>
                <MapPin className={`${styles.contactIcon} ${styles.contactIconColor}`} />
                <span>Mogadishu, Somalia</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.bottomBar} ${styles.bottomBarLight}`}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} DalaalPrime. All rights reserved.</p>
          </div>
          <div className={`${styles.statusBadge} ${styles.statusBadgeLight}`}>
            <span className={styles.statusDot} />
            <span>Available 24/7 for urgent property needs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;