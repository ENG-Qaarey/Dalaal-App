'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageBackground from '@/components/shared/PageBackground';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      <PageBackground />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              {t.footer.contactInfo || 'Contact Us'}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Get in touch with our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Contact Info Cards */}
            <div className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-lg dark:shadow-2xl">
              <Mail className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email</h3>
              <a href="mailto:muscabqaarey@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                muscabqaarey@gmail.com
              </a>
            </div>

            <div className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-lg dark:shadow-2xl">
              <Phone className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Phone</h3>
              <a href="tel:614463895" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                614463895
              </a>
            </div>

            <div className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 shadow-lg dark:shadow-2xl">
              <MapPin className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Location</h3>
              <p className="text-gray-700 dark:text-gray-300">Mogadishu, Somalia</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-lg dark:shadow-2xl">
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Your message..."
              />
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl">
              Send Message
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
