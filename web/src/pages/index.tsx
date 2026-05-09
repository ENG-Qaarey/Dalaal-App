import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import StatsBar from '@/components/home/StatsBar';
import BrowseByCategory from '@/components/home/BrowseByCategory';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import HowItWorks from '@/components/home/HowItWorks';
import TopDalaals from '@/components/home/TopDalaals';
import Testimonials from '@/components/home/Testimonials';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CTABanner from '@/components/home/CTABanner';
import NewsletterContact from '@/components/home/NewsletterContact';

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-hidden font-inter">
      <Head>
        <title>DalaalConnect - Somalia's Most Trusted Property Marketplace</title>
        <meta name="description" content="Connecting verified real estate brokers with property seekers in Somalia and the diaspora." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main>
        <Hero />
        <StatsBar />
        <BrowseByCategory />
        <FeaturedProperties />
        <HowItWorks />
        <TopDalaals />
        <Testimonials />
        <WhyChooseUs />
        <CTABanner />
        <NewsletterContact />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
