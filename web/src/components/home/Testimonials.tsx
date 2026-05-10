'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const testimonials = [
  {
    name: "Asha Mohamed",
    role: "Renter",
    content: "After evacuation, I needed a new home urgently. DalaalConnect helped me find a verified house in just 2 days.",
    rating: 5
  },
  {
    name: "Dr. Ibrahim Ali",
    role: "Diaspora Investor",
    content: "I live in London and wanted to buy land in Mogadishu. Through DalaalConnect, I found a trusted broker and completed the purchase safely.",
    rating: 5
  },
  {
    name: "Hassan Dalaal",
    role: "Verified Broker",
    content: "Since joining DalaalConnect, my client base has tripled. The verification badge gives customers confidence.",
    rating: 5
  }
];

const Testimonials = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 relative overflow-hidden bg-transparent">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider"
          >
            {t.testimonials.tag}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 leading-tight tracking-tight"
          >
            {t.testimonials.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed"
          >
            {t.testimonials.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-2xl flex flex-col gap-6 hover:shadow-xl dark:hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 shadow-lg dark:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-transparent to-cyan-400/0 dark:from-blue-500/10 dark:to-emerald-500/5 group-hover:from-blue-400/20 group-hover:to-cyan-400/10 transition-all duration-300 rounded-2xl" />
              
              <div className="relative z-10 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>

              <div className="relative z-10">
                <Quote className="absolute -top-4 -left-4 h-8 w-8 text-gray-200 dark:text-gray-800 -rotate-12 group-hover:rotate-0 transition-transform duration-500 opacity-30" />
                <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-relaxed relative z-10 italic">
                  "{t.content}"
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3 mt-auto pt-5 border-t border-white/10 dark:border-white/5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-black text-lg border border-blue-200/50 dark:border-blue-800/30 shadow-md">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-bold text-sm">{t.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;