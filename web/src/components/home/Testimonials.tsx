import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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
  return (
    <section className="py-16 bg-zinc-900 dark:bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-wider"
          >
            Testimonials
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-white dark:text-zinc-900 mb-4 leading-tight tracking-tight"
          >
            Community Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 dark:text-zinc-500 text-base md:text-lg leading-relaxed"
          >
            Real feedback from our satisfied property community.
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
              className="bg-zinc-800/50 dark:bg-zinc-50 backdrop-blur-sm border border-white/5 dark:border-zinc-200 p-8 rounded-[2rem] flex flex-col gap-6 group hover:bg-zinc-800 dark:hover:bg-white hover:-translate-y-1 transition-all duration-500 shadow-xl"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-accent text-accent' : 'text-zinc-600 dark:text-zinc-300'}`} />
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-4 -left-4 h-8 w-8 text-white/5 dark:text-zinc-200 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                <p className="text-zinc-200 dark:text-zinc-700 text-lg font-medium leading-relaxed relative z-10 italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/10 dark:border-zinc-200">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg border-2 border-white/10 dark:border-white shadow-md">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-white dark:text-zinc-900 font-bold text-base">{t.name}</div>
                  <div className="text-zinc-500 dark:text-zinc-400 font-medium text-xs uppercase tracking-wider">{t.role}</div>
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
