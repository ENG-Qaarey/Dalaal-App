'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize, Heart, BadgeCheck, Star, ArrowRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

const properties = [
  {
    id: 1,
    title: "Luxury Modern Villa",
    location: "Karaan, Mogadishu",
    price: "$250,000",
    type: "Sale",
    isNew: true,
    isFeatured: true,
    beds: 4,
    baths: 3,
    area: "350",
    dalaal: { name: "Ahmed Ali", rating: 4.9, reviews: 124, isVerified: true }
  },
  {
    id: 2,
    title: "Oceanfront Apartment",
    location: "Lido Beach, Mogadishu",
    price: "$1,200",
    period: "/month",
    type: "Rent",
    isNew: false,
    isFeatured: true,
    beds: 2,
    baths: 2,
    area: "120",
    dalaal: { name: "Sahra Omar", rating: 4.8, reviews: 89, isVerified: true }
  },
  {
    id: 3,
    title: "Commercial Land Plot",
    location: "Hodab, Mogadishu",
    price: "$45,000",
    type: "Sale",
    isNew: true,
    isFeatured: false,
    area: "600",
    dalaal: { name: "Ibrahim Noor", rating: 4.7, reviews: 56, isVerified: true }
  },
];

const FeaturedProperties = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <section className="py-16 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
            >
              {t.featured.tag}
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight"
            >
              {t.featured.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
            >
              {t.featured.subtitle}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pb-1"
          >
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
              <TabsList className="bg-transparent border-none gap-0.5">
                <TabsTrigger value="all" className="rounded-xl px-5 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-lg text-xs font-bold transition-all">{t.categories.all}</TabsTrigger>
                <TabsTrigger value="rent" className="rounded-xl px-5 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-lg text-xs font-bold transition-all">{t.categories.houses}</TabsTrigger>
                <TabsTrigger value="sale" className="rounded-xl px-5 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-lg text-xs font-bold transition-all">{t.categories.land}</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-lg dark:shadow-2xl hover:shadow-xl dark:hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 relative"
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent z-10" />
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5">
                  {property.isNew && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[9px] font-black rounded-full uppercase tracking-wider shadow-lg">New</span>
                  )}
                  {property.isFeatured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider shadow-lg">Featured</span>
                  )}
                </div>

                <button className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center transition-all group-hover:scale-110 border border-white/30 hover:shadow-lg">
                  <Heart className="h-4.5 w-4.5 text-white" />
                </button>

                <div className="absolute bottom-6 left-6 z-20">
                  <div className="text-2xl font-black text-white tracking-tighter drop-shadow-lg">
                    {property.price}
                    {property.period && <span className="text-xs font-bold text-white/80 ml-1">{property.period}</span>}
                  </div>
                </div>
              </div>

              <div className="p-7">
                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 line-clamp-1 group-hover:opacity-80 transition-opacity cursor-pointer leading-tight">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 mb-6">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium">{property.location}</span>
                </div>

                <div className="flex items-center justify-between mb-6 py-4 border-y border-white/10 dark:border-white/5">
                  {property.beds && (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                        <Bed className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-black">{property.beds}</span>
                      </div>
                      <span className="text-[8px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">{t.featured.beds}</span>
                    </div>
                  )}
                  {property.baths && (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                        <Bath className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-black">{property.baths}</span>
                      </div>
                      <span className="text-[8px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">{t.featured.baths}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                        <Maximize className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-black">{property.area}</span>
                      </div>
                      <span className="text-[8px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">m²</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-black text-base shadow-md border border-blue-200/50 dark:border-blue-800/30">
                      {property.dalaal.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        {property.dalaal.name}
                        {property.dalaal.isVerified && <BadgeCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-black text-gray-900 dark:text-white">{property.dalaal.rating}</span>
                        <span className="text-[9px] font-bold text-gray-500 ml-0.5 uppercase">({property.dalaal.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 hover:text-blue-900 dark:hover:text-blue-100 transition-all shadow-md">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/properties">
            <Button className="h-12 px-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black gap-2 text-base transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-blue-500/20 border border-blue-500/30">
              {t.featured.viewAll}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;