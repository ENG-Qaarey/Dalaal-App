'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { Search, Users, Shield, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const CTABanner = () => {
  const { t } = useLanguage();

return (
  <section className="py-16 px-6 overflow-hidden relative bg-transparent">
      
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-[#090f1c] dark:via-[#0b1220] dark:to-[#061019] rounded-[3.5rem] p-12 md:p-16 lg:p-20 text-center overflow-hidden shadow-2xl border border-blue-200/40 dark:border-white/10 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-cyan-400/5 to-emerald-400/10 dark:from-blue-500/10 dark:via-transparent dark:to-emerald-500/10" />
          <div className="hidden dark:block absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/25 dark:bg-blue-500/25 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-400/20 dark:bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-20 w-40 h-40 bg-emerald-400/15 dark:bg-cyan-500/20 rounded-full blur-[70px]" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/85 dark:bg-white/10 backdrop-blur-xl border border-blue-200/60 dark:border-white/10 shadow-sm dark:shadow-none mb-8"
            >
              <Sparkles className="h-4 w-4 text-blue-700 dark:text-cyan-200" />
              <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.18em] flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-blue-700 dark:text-cyan-200" />
                {t.cta.verifiedBrokers}
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-[1.02] tracking-tight"
            >
              {t.cta.title}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 dark:from-blue-300 dark:via-cyan-200 dark:to-emerald-300">Connecting Dreams</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-14 leading-relaxed"
            >
              {t.cta.subtitle}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-8 mb-16"
            >
              <Link href="/properties" className="group">
                <Button className="h-16 px-10 md:px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-400 dark:hover:to-cyan-400 text-white text-lg font-bold shadow-2xl shadow-blue-500/30 dark:shadow-cyan-500/20 hover:shadow-blue-500/50 dark:hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                  <Search className="h-6 w-6 mr-3" />
                  {t.cta.browse}
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/register?role=dalaal" className="group">
                <Button 
                  variant="outline" 
                  className="h-16 px-10 md:px-12 rounded-2xl border-2 border-blue-600 dark:border-white text-blue-700 dark:text-white bg-white/70 dark:bg-transparent hover:bg-blue-50 dark:hover:bg-white hover:text-blue-900 dark:hover:text-zinc-900 text-lg font-bold transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
                >
                  <Users className="h-6 w-6 mr-3" />
                  {t.cta.join}
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
            >
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 dark:bg-cyan-300 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">✓</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-gray-900 dark:text-white font-bold text-lg">{t.cta.freeForSeekers}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">No hidden fees • Completely free</div>
                </div>
              </div>
              
              <div className="w-px h-16 bg-gray-300 dark:bg-white/15" />
              
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-amber-400 dark:to-orange-500 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 dark:bg-emerald-300 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">✓</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-gray-900 dark:text-white font-bold text-lg">{t.cta.verifiedBrokers}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">100% verified • Trusted professionals</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;