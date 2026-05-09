import React from 'react';
import { motion } from 'framer-motion';
import { Search, BadgeCheck, MessageCircle, Shield } from 'lucide-react';

const steps = [
  { 
    number: "01",
    title: "Search Property", 
    desc: "Browse through thousands of verified listings to find exactly what you're looking for.",
    icon: Search,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  },
  { 
    number: "02",
    title: "Verify Details", 
    desc: "Every listing is backed by a verified Dalaal with detailed property documentation.",
    icon: BadgeCheck,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
  },
  { 
    number: "03",
    title: "Direct Chat", 
    desc: "Connect instantly with the property broker via our secure in-app messaging system.",
    icon: MessageCircle,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
  },
  { 
    number: "04",
    title: "Close Securely", 
    desc: "Finalize your deal with confidence using our platform's safety guarantees.",
    icon: Shield,
    color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
          >
            Our Process
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
          >
            Simple & Transparent Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
          >
            Four simple steps to find your perfect property.
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
              {/* Connector Line (Desktop) - Subtler */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent -z-10" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <div className={`w-20 h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-1`}>
                    <step.icon className="h-8 w-8 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl flex items-center justify-center font-black text-xs shadow-lg border-4 border-white dark:border-zinc-950 group-hover:bg-accent group-hover:text-white transition-colors">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2.5 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm px-4">
                  {step.desc}
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
