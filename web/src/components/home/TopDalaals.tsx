import React from 'react';
import { motion } from 'framer-motion';
import { Star, BadgeCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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
  return (
    <section className="py-16 bg-zinc-50/50 dark:bg-zinc-950/50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
            >
              Expert Partners
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
            >
              Top Verified Dalaals
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
            >
              Our highest-rated brokers with proven track records.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pb-1"
          >
            <Link href="/dalaals">
              <Button variant="outline" className="h-12 px-6 rounded-full border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 font-bold gap-2 text-base transition-all duration-300 shadow-md">
                View All Dalaals
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
              className="group bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] text-center border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />

              <div className="relative w-24 h-24 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-4xl font-black text-primary shadow-inner border border-zinc-100 dark:border-zinc-700">
                  {dalaal.name[0]}
                </div>
                {dalaal.isVerified && (
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{dalaal.name}</h3>
              
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(dalaal.rating) ? 'fill-accent text-accent' : 'text-zinc-200 dark:text-zinc-700'}`} />
                  ))}
                </div>
                <span className="text-sm font-black text-zinc-900 dark:text-white ml-0.5">{dalaal.rating}</span>
                <span className="text-[10px] font-bold text-zinc-400">({dalaal.reviews})</span>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {dalaal.specialties.slice(0, 2).map((spec) => (
                  <Badge key={spec} variant="secondary" className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700/50 font-bold px-3 py-1 rounded-lg text-[9px]">
                    {spec}
                  </Badge>
                ))}
              </div>

              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-md shadow-secondary/30" />
                <span className="font-black text-zinc-900 dark:text-white">{dalaal.deals}</span> deals
              </div>

              <Button variant="outline" className="w-full rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold h-11 text-sm transition-all duration-300 shadow-sm hover:shadow-primary/20">
                Profile
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDalaals;
