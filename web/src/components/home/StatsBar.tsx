import React from 'react';
import { motion } from 'framer-motion';
import { Home, BadgeCheck, Users, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Home, value: "5,400+", label: "Verified Listings" },
  { icon: BadgeCheck, value: "89", label: "Trusted Dalaals" },
  { icon: Users, value: "12,000+", label: "Happy Customers" },
  { icon: TrendingUp, value: "3,200+", label: "Successful Deals" },
];

const StatsBar = () => {
  return (
    <section className="bg-white dark:bg-zinc-950 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-md group-hover:shadow-primary/20 group-hover:-translate-y-1 border border-zinc-100 dark:border-zinc-800">
                <stat.icon className="h-6 w-6 text-primary transition-colors duration-500 group-hover:text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-1.5 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
