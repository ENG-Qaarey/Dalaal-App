'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, MessageCircle, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const WhyChooseUs = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Shield },
    { icon: Clock },
    { icon: MessageCircle },
    { icon: TrendingUp },
    { icon: Users },
    { icon: CheckCircle2 },
  ];

  return (
    <section className="py-16 relative overflow-hidden bg-transparent">
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
          >
            {t.whyChooseUs.tag}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
          >
            {t.whyChooseUs.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
          >
            {t.whyChooseUs.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {features.map((f, index) => {
            const Icon = f.icon;
            const feature = t.whyChooseUs.features[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl hover:shadow-xl dark:hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 shadow-lg dark:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-transparent to-cyan-400/0 dark:from-blue-500/10 dark:to-emerald-500/5 group-hover:from-blue-400/20 group-hover:to-cyan-400/10 transition-all duration-300" />
                
                <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-cyan-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-cyan-800/50 transition-all duration-300 shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="relative z-10 text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2.5 group-hover:opacity-80 transition-opacity">
                  {feature.title}
                </h3>
                
                <p className="relative z-10 text-gray-600 dark:text-gray-400 leading-relaxed text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;