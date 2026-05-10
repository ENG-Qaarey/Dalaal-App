'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, BadgeCheck, MessageCircle, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { number: "01", icon: Search, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { number: "02", icon: BadgeCheck, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { number: "03", icon: MessageCircle, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
    { number: "04", icon: Shield, color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" },
  ];

  return (
    <section id="how-it-works" className="py-16 relative overflow-hidden bg-transparent">
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
          >
            {t.howItWorks.tag}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
          >
            {t.howItWorks.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
          >
            {t.howItWorks.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-blue-400/30 via-cyan-400/20 to-transparent dark:from-blue-500/20 dark:via-emerald-500/10 dark:to-transparent -z-10" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center group/inner">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-400/30 to-cyan-400/20 dark:from-blue-500/20 dark:to-emerald-500/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-20 h-20 rounded-2xl bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/30 dark:border-white/10 flex items-center justify-center group-hover:from-blue-500/40 group-hover:to-cyan-500/30 transition-all duration-500 shadow-lg dark:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-2 group-hover/inner:border-blue-400/50">
                    <step.icon className="h-8 w-8 text-gradient bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg border-4 border-white dark:border-zinc-900 group-hover:shadow-lg transition-all">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2.5 group-hover:opacity-80 transition-opacity">{t.howItWorks.steps[index].title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm px-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {t.howItWorks.steps[index].desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;