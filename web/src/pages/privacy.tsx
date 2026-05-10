'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';

const PrivacyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-transparent">
      <PageBackground />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              {t.footer.privacy || 'Privacy Policy'}
            </h1>
          </div>

          <div className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-lg dark:shadow-2xl">
            <div className="space-y-8 text-gray-800 dark:text-gray-200">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                <p>DalaalConnect ("we" or "us" or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information Collection and Use</h2>
                <p>We collect several different types of information for various purposes to provide and improve our website to you.</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Types of Data Collected:</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Personal Information: Name, email address, phone number, postal address</li>
                      <li>Usage Data: Browser type, pages visited, time spent on pages</li>
                      <li>Device Information: IP address, browser type, device type</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Use of Data</h2>
                <p>DalaalConnect uses the collected data for various purposes:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>To provide and maintain our website</li>
                  <li>To notify you about changes to our website</li>
                  <li>To allow you to participate in interactive features of our website</li>
                  <li>To gather analysis or valuable information to improve our website</li>
                  <li>To monitor the usage of our website</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Security of Data</h2>
                <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Changes to This Privacy Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className="mt-3 text-gray-700 dark:text-gray-300">
                  <p>Email: <a href="mailto:muscabqaarey@gmail.com" className="text-primary hover:underline">muscabqaarey@gmail.com</a></p>
                  <p>Phone: <a href="tel:614463895" className="text-primary hover:underline">614463895</a></p>
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
