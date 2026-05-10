'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Send, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

const NewsletterContact = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-6 bg-transparent relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-blue-500/10 overflow-hidden flex flex-col md:flex-row items-stretch border border-white/20 dark:border-white/10"
        >
          <div className="flex-1 p-6 md:p-8 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/15 rounded-full blur-[40px] -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/15 rounded-full blur-[30px] -ml-12 -mb-12" />
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100/70 to-cyan-100/70 dark:from-blue-900/40 dark:to-cyan-900/40 mb-4 border border-blue-200/50 dark:border-blue-800/30">
                <Sparkles className="h-3.5 w-3.5 text-blue-700 dark:text-blue-300" />
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">{t.newsletter.tag}</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 leading-tight tracking-tight">
                {t.newsletter.title}
              </h3>
              
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-400 mb-6 leading-relaxed max-w-md">
                {t.newsletter.subtitle}
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-1 relative">
                  <Input 
                    placeholder={t.newsletter.emailPlaceholder}
                    className="h-10 rounded-xl bg-white/70 dark:bg-zinc-900/70 border-blue-200/50 dark:border-blue-800/30 px-4 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <Button className="h-10 px-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t.newsletter.subscribe}
                </Button>
              </form>
              
              <div className="flex items-center gap-2 mt-4 text-gray-600 dark:text-gray-500 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{t.newsletter.noSpam}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-[320px] lg:w-[360px] bg-gradient-to-br from-white/60 via-blue-50/50 to-cyan-50/60 dark:from-blue-950/40 dark:via-zinc-950/60 dark:to-emerald-950/30 backdrop-blur-xl p-6 md:p-8 text-gray-900 dark:text-white flex flex-col justify-center relative overflow-hidden shrink-0 border-l border-white/20 dark:border-white/5">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-400/20 rounded-full blur-[40px] -mr-14 -mt-14" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-400/20 rounded-full blur-[30px] -ml-10 -mb-10" />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-black tracking-tight">{t.newsletter.helpTitle}</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <Link href="tel:+252611111111" className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/70 dark:bg-blue-900/40 flex items-center justify-center group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:scale-110 transition-all">
                    <Phone className="h-4 w-4 text-blue-700 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{t.newsletter.callUs}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">+252 61 XXX XXXX</div>
                  </div>
                </Link>

                <Link href="mailto:hello@dalaalconnect.so" className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100/70 dark:bg-cyan-900/40 flex items-center justify-center group-hover:from-cyan-500 group-hover:to-emerald-500 group-hover:scale-110 transition-all">
                    <Mail className="h-4 w-4 text-cyan-700 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{t.newsletter.emailUs}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">hello@dalaalconnect.so</div>
                  </div>
                </Link>
              </div>

              <div className="pt-5 border-t border-white/20 dark:border-white/5">
                <p className="text-gray-700 dark:text-gray-400 text-xs italic leading-relaxed">
                  "{t.newsletter.quote}"
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
                    DC
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-gray-900 dark:text-white">DalaalConnect</div>
                    <div className="text-gray-600 dark:text-gray-500 text-[10px]">Property Experts</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterContact;