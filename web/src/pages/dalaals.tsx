'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';

const DalaalsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-transparent">
      <PageBackground />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              {t.nav.dalaals || 'Dalaals'}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with verified brokers and property professionals
            </p>
          </div>

          {/* Placeholder Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="group rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 shadow-lg dark:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-blue-500/10"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900 rounded-full mb-4 mx-auto animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DalaalsPage;
