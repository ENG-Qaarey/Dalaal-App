import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, MapPin, Home, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Hero = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary-900/30 dark:via-primary-800/10 dark:to-primary-700/5" />
      
      {/* Animated Gradient Orbs - Smaller & Subtler */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 dark:bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
      
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center"
      >
        {/* Trust Badge - More Compact */}
        <motion.div variants={fadeInUp} className="mb-6 px-3 py-1 rounded-full bg-primary/5 dark:bg-white/5 backdrop-blur-md border border-primary/10 dark:border-white/10 flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-primary dark:text-accent" />
          <span className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider">
            Somalia's Most Trusted Property Platform
          </span>
        </motion.div>

        {/* Headline - Smaller */}
        <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-5 leading-[1.1]">
          Find Your Perfect <br />
          <span className="text-primary dark:text-accent italic">Home</span> with Verified Brokers
        </motion.h1>

        {/* Subtitle - Smaller */}
        <motion.p variants={fadeInUp} className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mb-10 leading-relaxed">
          Connect with trusted Dalaals for houses, land, cars, and businesses. Safe, fast, and transparent — whether you're local or abroad.
        </motion.p>

        {/* Search Box - More Compact */}
        <motion.div variants={fadeInUp} className="w-full bg-white dark:bg-zinc-900 p-3 md:p-5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center gap-4 border border-zinc-100 dark:border-white/10 relative overflow-hidden">
          <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Location Select */}
            <div className="w-full md:w-44 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-zinc-400 ml-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Location</span>
              </div>
              <Select defaultValue="mogadishu">
                <SelectTrigger className="w-full bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200/50 dark:border-zinc-700/50 h-11 rounded-xl focus:ring-primary text-sm font-bold">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="mogadishu">Mogadishu</SelectItem>
                  <SelectItem value="hargeisa">Hargeisa</SelectItem>
                  <SelectItem value="garowe">Garowe</SelectItem>
                  <SelectItem value="kismayo">Kismayo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:block w-px h-10 bg-zinc-200/50 dark:bg-zinc-800/50" />

            {/* Category Select */}
            <div className="w-full md:w-44 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-zinc-400 ml-2">
                <Home className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Category</span>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200/50 dark:border-zinc-700/50 h-11 rounded-xl focus:ring-primary text-sm font-bold">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="houses">Houses</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:block w-px h-10 bg-zinc-200/50 dark:bg-zinc-800/50" />

            {/* Search Input */}
            <div className="flex-1 w-full flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-zinc-400 ml-2">
                <Search className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Search</span>
              </div>
              <Input 
                placeholder="Search..." 
                className="w-full bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200/50 dark:border-zinc-700/50 h-11 rounded-xl focus:ring-primary text-sm font-medium px-4"
              />
            </div>
          </div>

          <Button className="w-full md:w-auto h-12 md:h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl md:rounded-2xl text-base font-black flex items-center gap-2 transition-all shadow-lg shadow-primary/20 relative z-10">
            <Search className="h-5 w-5" />
            Search
          </Button>
        </motion.div>

        {/* Quick Filters - More Compact */}
        <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {['For Rent', 'For Sale', 'Verified'].map((tag) => (
            <button
              key={tag}
              className="px-6 py-2 rounded-full border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white text-xs font-bold hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all backdrop-blur-sm"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Bottom Trust Badges - Smaller */}
        <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-14">
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 group">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-md border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Verified</div>
              <div className="text-[9px] font-medium opacity-60">Brokers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 group">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-md border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Secure</div>
              <div className="text-[9px] font-medium opacity-60">Payments</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-400 dark:text-white flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">Discover More</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
