import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, TreePine, Car, Briefcase } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: "Houses", icon: Home, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", count: "2,400+" },
  { name: "Apartments", icon: Building2, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", count: "1,200+" },
  { name: "Land", icon: TreePine, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", count: "800+" },
  { name: "Cars", icon: Car, color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400", count: "1,500+" },
  { name: "Business", icon: Briefcase, color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400", count: "400+" },
];

const BrowseByCategory = () => {
  return (
    <section className="py-16 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
          >
            Explore
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
          >
            Find exactly what you need — homes, land, vehicles, or business spaces.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/properties?category=${cat.name.toLowerCase()}`}
                className="group block bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 border border-zinc-200/50 dark:border-zinc-800/50 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150" />

                <div className={`w-16 h-16 mx-auto rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner`}>
                  <cat.icon className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1.5 group-hover:text-primary transition-colors">{cat.name}</h3>
                <span className="text-[10px] font-black text-zinc-400 group-hover:text-zinc-500 transition-colors uppercase tracking-[0.2em]">{cat.count}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByCategory;
