'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, Sparkles, Shield, TrendingUp, Home, CheckCircle2, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-6 overflow-hidden bg-transparent">

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} className="mb-8 px-5 py-2.5 rounded-full bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-blue-500/20 dark:border-white/10 flex items-center gap-3 shadow-lg shadow-blue-500/10">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {t.hero.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
          {t.hero.headline} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-emerald-400 to-cyan-400">{t.hero.headlineAccent}</span> {t.hero.headlineSuffix}
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          {t.hero.subtitle}
        </motion.p>

        {/* Search Bar */}
        <motion.div variants={fadeInUp} className="w-full max-w-4xl mx-auto">
          <div className="bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl p-3 md:p-4 rounded-2xl shadow-2xl shadow-black/10 border border-zinc-200/50 dark:border-white/10">
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              {/* Location */}
              <div className="flex-1 flex flex-col gap-1.5 p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/30 dark:border-white/5">
                <div className="flex items-center gap-2 text-blue-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{t.hero.location}</span>
                </div>
                <Select defaultValue="mogadishu">
                  <SelectTrigger className="bg-transparent border-0 p-0 h-auto text-sm font-semibold text-foreground focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="mogadishu">{t.locations.mogadishu}</SelectItem>
                    <SelectItem value="hargeisa">{t.locations.hargeisa}</SelectItem>
                    <SelectItem value="garowe">{t.locations.garowe}</SelectItem>
                    <SelectItem value="kismayo">{t.locations.kismayo}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:block w-px bg-zinc-200/50 dark:bg-zinc-800/50" />

              {/* Category */}
              <div className="flex-1 flex flex-col gap-1.5 p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/30 dark:border-white/5">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Home className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{t.hero.category}</span>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-transparent border-0 p-0 h-auto text-sm font-semibold text-foreground focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">{t.categories.all}</SelectItem>
                    <SelectItem value="houses">{t.categories.houses}</SelectItem>
                    <SelectItem value="land">{t.categories.land}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:block w-px bg-zinc-200/50 dark:bg-zinc-800/50" />

              {/* Search Input */}
              <div className="flex-[1.5] flex flex-col gap-1.5 p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/30 dark:border-white/5">
                <div className="flex items-center gap-2 text-blue-500">
                  <Search className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{t.hero.search}</span>
                </div>
                <Input 
                  placeholder={t.hero.searchPlaceholder}
                  className="bg-transparent border-0 p-0 h-auto text-sm font-medium focus:ring-0 shadow-none"
                />
              </div>

              {/* Search Button */}
              <Link href="/properties" className="md:w-auto">
                <Button className="w-full md:w-auto h-full min-h-[52px] px-6 md:px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Tags */}
        <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { label: t.hero.forRent, color: 'blue' },
            { label: t.hero.forSale, color: 'emerald' },
            { label: t.hero.verified, color: 'amber' }
          ].map((tag, index) => (
            <button
              key={tag.label}
              className={`px-5 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm cursor-pointer
                ${tag.color === 'blue' ? 'border-blue-500/30 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-white/10 dark:text-blue-400' : ''}
                ${tag.color === 'emerald' ? 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white dark:border-white/10 dark:text-emerald-400' : ''}
                ${tag.color === 'amber' ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white dark:border-white/10 dark:text-amber-400' : ''}
              `}
            >
              {tag.label}
            </button>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div variants={fadeInUp} className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {[
            { icon: Shield, color: 'blue', title: t.hero.verified, subtitle: 'Verified Brokers' },
            { icon: CheckCircle2, color: 'emerald', title: t.cta.freeForSeekers, subtitle: 'No Hidden Fees' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border
                ${item.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-500' : ''}
                ${item.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:border-emerald-500' : ''}
              `}>
                <item.icon className={`h-6 w-6 transition-colors duration-300
                  ${item.color === 'blue' ? 'text-blue-500 group-hover:text-white' : ''}
                  ${item.color === 'emerald' ? 'text-emerald-500 group-hover:text-white' : ''}
                `} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-foreground">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">{t.hero.discoverMore}</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10 flex items-center justify-center"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;