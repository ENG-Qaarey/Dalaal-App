'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, BadgeCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/LanguageContext';

const dalaals = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    rating: 4.9,
    reviews: 245,
    specialties: ["Luxury Villas", "Apartments"],
    deals: 156,
    isVerified: true
  },
  {
    id: 2,
    name: "Fatima Ali",
    rating: 4.8,
    reviews: 189,
    specialties: ["Commercial Land", "Business"],
    deals: 94,
    isVerified: true
  },
  {
    id: 3,
    name: "Mustafa Noor",
    rating: 4.9,
    reviews: 312,
    specialties: ["Residential Plots", "Homes"],
    deals: 243,
    isVerified: true
  },
  {
    id: 4,
    name: "Sahra Farah",
    rating: 4.7,
    reviews: 124,
    specialties: ["Vehicle Rentals", "Sales"],
    deals: 78,
    isVerified: true
  },
];

const TopDalaals = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 relative overflow-hidden px-6 bg-transparent">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
            >
              {t.topDalaals.tag}
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
            >
              {t.topDalaals.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
            >
              {t.topDalaals.subtitle}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pb-1"
          >
            <Link href="/dalaals">
              <Button className="h-12 px-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold gap-2 text-base transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-blue-500/20 border border-blue-500/30">
                {t.topDalaals.viewAll}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {dalaals.map((dalaal, index) => (
            <motion.div
              key={dalaal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl p-8 rounded-2xl text-center border border-white/20 dark:border-white/10 shadow-lg dark:shadow-2xl hover:shadow-xl dark:hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-transparent to-cyan-400/0 dark:from-blue-500/10 dark:to-emerald-500/5 group-hover:from-blue-400/20 group-hover:to-cyan-400/10 transition-all duration-300" />

              <div className="relative z-10 w-24 h-24 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent shadow-md dark:shadow-blue-500/10 border border-blue-200/50 dark:border-blue-800/30">
                  {dalaal.name[0]}
                </div>
                {dalaal.isVerified && (
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 text-white rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg transition-all">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                )}
              </div>

              <h3 className="relative z-10 text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 group-hover:opacity-80 transition-opacity">{dalaal.name}</h3>
              
              <div className="relative z-10 flex items-center justify-center gap-1.5 mb-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(dalaal.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-white ml-0.5">{dalaal.rating}</span>
                <span className="text-[10px] font-bold text-gray-500">{`(${dalaal.reviews})`}</span>
              </div>

              <div className="relative z-10 flex flex-wrap justify-center gap-1.5 mb-6">
                {dalaal.specialties.slice(0, 2).map((spec) => (
                  <Badge key={spec} className="bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30 font-bold px-3 py-1 rounded-lg text-[9px]">
                    {spec}
                  </Badge>
                ))}
              </div>

              <div className="relative z-10 text-sm text-gray-600 dark:text-gray-400 mb-8 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-md shadow-blue-500/30" />
                <span className="font-black text-gray-900 dark:text-white">{dalaal.deals}</span> {t.topDalaals.deals}
              </div>

              <Button className="relative z-10 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold h-11 text-sm transition-all duration-300 shadow-lg hover:shadow-blue-500/20 border border-blue-500/30">
                {t.topDalaals.profile}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDalaals;