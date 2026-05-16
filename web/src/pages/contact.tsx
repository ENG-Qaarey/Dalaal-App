'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from '@/styles/contact.module.css';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={styles.container}>
      <PageBackground />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={`${styles.title} ${styles.titleLight}`}>
              {t.footer.contactInfo || 'Contact Us'}
            </h1>
            <p className={`${styles.subtitle} ${styles.subtitleDark}`}>
              Get in touch with our team
            </p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <Mail className={styles.contactIcon} />
              <h3 className={`${styles.contactTitle} ${styles.contactTitleLight}`}>Email</h3>
              <a href="mailto:muscabqaarey@gmail.com" className={`${styles.contactLink} ${styles.contactLinkDark}`}>
                muscabqaarey@gmail.com
              </a>
            </div>

            <div className={styles.contactCard}>
              <Phone className={styles.contactIcon} />
              <h3 className={`${styles.contactTitle} ${styles.contactTitleLight}`}>Phone</h3>
              <a href="tel:614463895" className={`${styles.contactLink} ${styles.contactLinkDark}`}>
                614463895
              </a>
            </div>

            <div className={styles.contactCard}>
              <MapPin className={styles.contactIcon} />
              <h3 className={`${styles.contactTitle} ${styles.contactTitleLight}`}>Location</h3>
              <p className={`${styles.contactText} ${styles.contactTextDark}`}>Mogadishu, Somalia</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.formCard}>
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.formLabelLight}`}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Your name"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.formLabelLight}`}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.formLabelLight}`}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={styles.formTextarea}
                placeholder="Your message..."
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Send Message
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;