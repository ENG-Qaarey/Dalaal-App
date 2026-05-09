import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CTABanner = () => {
  return (
    <section className="py-16 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[130%] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="rounded-[2.5rem] bg-zinc-900 dark:bg-white p-10 md:p-16 text-center relative overflow-hidden shadow-xl border border-white/10 dark:border-zinc-200">
          {/* Internal Accents */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent/20 rounded-full blur-[80px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white dark:text-zinc-900 mb-6 leading-tight tracking-tight">
              Find Your Perfect <br className="hidden md:block" /> Property Today
            </h2>
            <p className="text-zinc-400 dark:text-zinc-500 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of satisfied customers on Somalia's most trusted property platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/properties">
                <Button className="h-13 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-base font-black shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.05] active:scale-95">
                  Browse Listings
                </Button>
              </Link>
              <Link href="/register?role=dalaal">
                <Button variant="outline" className="h-13 px-10 rounded-full border-2 border-zinc-700 dark:border-zinc-200 text-white dark:text-zinc-900 hover:bg-white/10 dark:hover:bg-zinc-100 text-base font-black transition-all transform hover:scale-[1.05] active:scale-95">
                  Join as Dalaal
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Free for seekers
              </div>
              <div className="w-px h-3 bg-zinc-800 dark:bg-zinc-200" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                Verified brokers
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
