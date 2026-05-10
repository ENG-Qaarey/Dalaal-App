'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { useLanguage } from '@/lib/LanguageContext';
import { CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-transparent">
      <PageBackground />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              About DalaalConnect
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Transforming Somalia's real estate marketplace with trust and transparency
            </p>
          </div>

          {/* Mission Section */}
          <div className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-lg dark:shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              DalaalConnect is Somalia's most trusted property platform, connecting verified brokers with seekers worldwide. We're built for local users and the diaspora, providing a secure, transparent, and efficient marketplace for real estate transactions.
            </p>
          </div>

          {/* Why Choose Us Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Choose DalaalConnect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Verified Brokers', desc: '100% verified and trusted property professionals' },
                { title: 'Secure Transactions', desc: 'Safe and transparent deals with escrow support' },
                { title: 'Free for Seekers', desc: 'No hidden fees - completely free to browse and buy' },
                { title: 'Local Expertise', desc: 'Deep knowledge of Somalia\'s real estate market' },
                { title: '24/7 Support', desc: 'Always available to help with your queries' },
                { title: 'Multi-Language', desc: 'Support for English, Somali, and Arabic' },
              ].map((feature, idx) => (
                <div key={idx} className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 shadow-lg dark:shadow-2xl">
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-lg dark:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Team</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our dedicated team is composed of real estate experts, software engineers, and market specialists committed to revolutionizing Somalia's property market. We work tirelessly to ensure every transaction on DalaalConnect is safe, transparent, and beneficial for all parties involved.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
