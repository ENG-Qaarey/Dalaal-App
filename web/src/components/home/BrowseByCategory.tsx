'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, TreePine, Car, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

const categoryIcons: Record<string, typeof Home> = {
  houses: Home,
  apartments: Building2,
  land: TreePine,
  cars: Car,
  business: Briefcase,
};

const categories = [
  { key: 'houses', count: '2,400+' },
  { key: 'apartments', count: '1,200+' },
  { key: 'land', count: '800+' },
  { key: 'cars', count: '1,500+' },
  { key: 'business', count: '400+' },
];

const BrowseByCategory = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
          >
            {t.browse.explore}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
          >
            {t.browse.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
          >
            {t.browse.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-5">
          {categories.map((cat, index) => {
            const Icon = categoryIcons[cat.key];
            const name = t.categories[cat.key as keyof typeof t.categories];
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={`/properties?category=${cat.key}`}
                  className="group block bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl p-7 rounded-2xl shadow-lg dark:shadow-2xl hover:shadow-xl dark:hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300 border border-white/20 dark:border-white/10 hover:border-blue-400/50 text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-transparent to-cyan-400/0 dark:from-blue-500/10 dark:to-emerald-500/5 group-hover:from-blue-400/20 group-hover:to-cyan-400/10 transition-all duration-300" />

                  <div className={`relative z-10 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-5 group-hover:from-blue-200 group-hover:to-cyan-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-cyan-800/50 transition-all duration-300 shadow-md dark:shadow-blue-500/10`}>
                    <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="relative z-10 text-lg font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{name}</h3>
                  <span className="relative z-10 text-[10px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors uppercase tracking-[0.15em]">{cat.count}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseByCategory;