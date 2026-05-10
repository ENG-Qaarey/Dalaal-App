'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, BadgeCheck, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const stats = [
  { icon: Home, key: 'verifiedListings' },
  { icon: BadgeCheck, key: 'trustedDalaals' },
  { icon: Users, key: 'happyCustomers' },
  { icon: TrendingUp, key: 'successfulDeals' },
];

const StatsBar = () => {
  const { t } = useLanguage();

return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center group relative"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 dark:from-blue-500/10 dark:to-emerald-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-blue-400/30 group-hover:to-cyan-400/20 dark:group-hover:from-blue-500/40 dark:group-hover:to-emerald-500/30 transition-all duration-500 shadow-lg dark:shadow-2xl group-hover:shadow-xl dark:group-hover:shadow-blue-500/20 group-hover:-translate-y-2 border border-white/30 dark:border-white/10">
                <stat.icon className="h-7 w-7 text-gradient bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 tracking-tighter">
                {t.stats[stat.key as keyof typeof t.stats].split(' ')[0]}
              </div>
              <div className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-[0.15em]">
                {t.stats[stat.key as keyof typeof t.stats]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;