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

  const featureCards = [
    {
      title: 'Verified brokers',
      copy: 'No guesswork, no random listings, no dead ends.',
      icon: Shield,
      accent: 'from-blue-500/20 to-cyan-500/10',
      iconTone: 'text-blue-500 dark:text-blue-400',
    },
    {
      title: 'Fast chat handoff',
      copy: 'Move from browsing to real conversation in one step.',
      icon: CheckCircle2,
      accent: 'from-emerald-500/20 to-lime-500/10',
      iconTone: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      title: 'Market pulse',
      copy: 'See what is active now instead of chasing stale posts.',
      icon: TrendingUp,
      accent: 'from-amber-500/20 to-orange-500/10',
      iconTone: 'text-amber-500 dark:text-amber-400',
    },
  ];

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden px-4 pt-28 pb-16 md:px-6 bg-transparent">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            variants={fadeInUp}
            className="relative overflow-hidden rounded-[2rem] border border-zinc-900/10 bg-white/75 p-6 shadow-[0_32px_120px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70 md:p-10"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-400" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-emerald-400/12 blur-3xl" />

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-zinc-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white shadow-lg shadow-black/10 dark:border-white/10 dark:bg-white dark:text-zinc-950">
                <Sparkles className="h-3.5 w-3.5" />
                Anti-design market
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
                Somalia / diaspora / live inventory
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400">
                {t.hero.badge}
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.06em] text-zinc-950 dark:text-white md:text-7xl lg:text-[5.8rem]">
                <span className="block">{t.hero.headline}</span>
                <span className="mt-2 inline-block -rotate-1 rounded-[1.2rem] bg-zinc-950 px-4 py-1 text-white dark:bg-white dark:text-zinc-950">
                  {t.hero.headlineAccent}
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500">
                  {t.hero.headlineSuffix}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 md:text-lg">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/properties">
                <Button className="h-12 rounded-full bg-zinc-950 px-6 text-sm font-black text-white shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100">
                  {t.nav.getStarted}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dalaals">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-zinc-300 bg-white/70 px-6 text-sm font-black text-zinc-800 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  Meet brokers
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-[1.1fr_1fr_1.2fr]">
              <div className="rounded-[1.4rem] border border-zinc-900/10 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/70">
                <div className="mb-2 flex items-center gap-2 text-blue-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    {t.hero.location}
                  </span>
                </div>
                <Select defaultValue="mogadishu">
                  <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-left text-sm font-semibold text-zinc-950 shadow-none focus:ring-0 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="mogadishu">{t.locations.mogadishu}</SelectItem>
                    <SelectItem value="hargeisa">{t.locations.hargeisa}</SelectItem>
                    <SelectItem value="garowe">{t.locations.garowe}</SelectItem>
                    <SelectItem value="kismayo">{t.locations.kismayo}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-[1.4rem] border border-zinc-900/10 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/70">
                <div className="mb-2 flex items-center gap-2 text-emerald-500">
                  <Home className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    {t.hero.category}
                  </span>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-left text-sm font-semibold text-zinc-950 shadow-none focus:ring-0 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">{t.categories.all}</SelectItem>
                    <SelectItem value="houses">{t.categories.houses}</SelectItem>
                    <SelectItem value="land">{t.categories.land}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-[1.4rem] border border-zinc-900/10 bg-zinc-950 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-white">
                <div className="mb-2 flex items-center gap-2 text-white dark:text-zinc-950">
                  <Search className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70 dark:text-zinc-600">
                    {t.hero.search}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder={t.hero.searchPlaceholder}
                    className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-white placeholder:text-white/45 shadow-none focus:ring-0 dark:text-zinc-950 dark:placeholder:text-zinc-500"
                  />
                  <Button className="h-10 rounded-full bg-white px-4 text-sm font-black text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800">
                    Go
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: t.hero.forRent, tone: 'border-blue-500/25 text-blue-600 dark:text-blue-400' },
                { label: t.hero.forSale, tone: 'border-emerald-500/25 text-emerald-600 dark:text-emerald-400' },
                { label: t.hero.verified, tone: 'border-amber-500/25 text-amber-600 dark:text-amber-400' },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className={`rounded-full border bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] shadow-sm dark:bg-zinc-900/70 ${tag.tone}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-6">
            <motion.div
              variants={fadeInUp}
              className="relative overflow-hidden rounded-[2rem] border border-zinc-900/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-6 text-white shadow-[0_32px_110px_rgba(0,0,0,0.24)] dark:border-white/10"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-blue-400/20 blur-2xl" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                    Live market board
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] md:text-3xl">
                    Hot listings, no dead weight.
                  </h2>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                  24/7
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { label: 'Mogadishu / Villa', value: '3 beds · Verified broker · 12m ago' },
                  { label: 'Hargeisa / Commercial', value: 'High visibility · Quick response · New' },
                  { label: 'Garowe / Land plot', value: 'Best for long-term holds · Ready now' },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-start justify-between gap-4 rounded-[1.35rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm ${
                      index === 1 ? 'translate-x-3 rotate-[-1deg]' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        {item.value}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/70" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid gap-4 sm:grid-cols-2">
              {featureCards.map((card, index) => (
                <div
                  key={card.title}
                  className={`group relative overflow-hidden rounded-[1.6rem] border border-zinc-900/10 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 ${
                    index === 0 ? '-rotate-2' : index === 1 ? 'rotate-2 translate-y-2' : '-translate-y-1'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                  <div className="absolute inset-0 bg-white/35 dark:bg-zinc-950/35" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 ${card.iconTone}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-950 dark:text-white">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {card.copy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div variants={fadeInUp} className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              kicker: '01',
              title: 'Browse like a sketchbook',
              copy: 'The layout is intentionally rougher, so the listings stand out instead of blending into a template wall.',
            },
            {
              kicker: '02',
              title: 'Talk to the source faster',
              copy: 'Every route pushes the user toward verified brokers and quick contact instead of endless clicking.',
            },
            {
              kicker: '03',
              title: 'Signal over decoration',
              copy: 'Bold blocks, tilted cards, and contrast-first hierarchy keep the page memorable while staying usable.',
            },
          ].map((item, index) => (
            <div
              key={item.kicker}
              className={`rounded-[1.4rem] border border-zinc-900/10 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 ${
                index === 1 ? 'md:-translate-y-2' : ''
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                {item.kicker}
              </p>
              <h3 className="mt-3 text-lg font-black tracking-[-0.03em] text-zinc-950 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {item.copy}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
          {t.hero.discoverMore}
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/50 bg-white/60 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/60"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;