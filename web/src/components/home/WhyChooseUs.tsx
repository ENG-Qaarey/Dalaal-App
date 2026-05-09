import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, MessageCircle, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Verified & Safe",
    desc: "Every Dalaal undergoes ID verification, license checks, and reference validation."
  },
  {
    icon: Clock,
    title: "Save Time",
    desc: "Find properties in minutes instead of weeks. Smart filters and recommendations."
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    desc: "Chat directly with brokers through our secure in-app messaging system."
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    desc: "Access pricing trends, neighborhood data, and market analytics."
  },
  {
    icon: Users,
    title: "Diaspora Friendly",
    desc: "Built for Somalis abroad. Manage properties remotely with trusted local Dalaals."
  },
  {
    icon: CheckCircle2,
    title: "Quality Guarantee",
    desc: "Dispute resolution, escrow payments, and satisfaction guarantees."
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
          >
            Why Choose Us
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
          >
            Building Trust in Somalia
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
          >
            We're building transparency and efficiency into every property transaction.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {features.map((f, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 hover:border-primary/30 dark:hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all duration-500 group-hover:scale-150" />
              
              <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                <f.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2.5 group-hover:text-primary transition-colors duration-300">
                {f.title}
              </h3>
              
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
