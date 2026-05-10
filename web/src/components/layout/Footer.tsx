'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe, Link2, MessageSquare, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-transparent text-gray-700 dark:text-gray-300 py-24 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="hidden" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Link href="/" className="group inline-block">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-zinc-900/40 hover:bg-blue-100 dark:hover:bg-zinc-900/60 transition-all duration-300 w-fit border border-blue-200 dark:border-zinc-800">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src="/AppIcon/Dalaal-Light-icon.png" alt="DalaalConnect" width={40} height={40} className="block dark:hidden object-contain" />
                  <Image src="/AppIcon/Dalaal-Dark-icon.png" alt="DalaalConnect" width={40} height={40} className="hidden dark:block object-contain" />
                </div>
                <span className="text-lg font-bold tracking-tight text-blue-900 dark:text-white">DalaalConnect</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-xs">
              Somalia's most trusted property platform. Connecting verified brokers with seekers worldwide. Built for local users and the diaspora.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="p-2.5 rounded-2xl bg-blue-100 dark:bg-zinc-800 hover:bg-blue-200 dark:hover:bg-zinc-700 transition-all duration-300 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200">
                <Link2 className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2.5 rounded-2xl bg-blue-100 dark:bg-zinc-800 hover:bg-blue-200 dark:hover:bg-zinc-700 transition-all duration-300 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2.5 rounded-2xl bg-blue-100 dark:bg-zinc-800 hover:bg-blue-200 dark:hover:bg-zinc-700 transition-all duration-300 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-extrabold uppercase tracking-[0.12em] text-gray-900 dark:text-white">Quick Links</h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/about" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">About Us</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
              <Link href="/contact" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Contact Us</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
              <Link href="/terms" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Terms of Service</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
              <Link href="/privacy" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Privacy Policy</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-extrabold uppercase tracking-[0.12em] text-gray-900 dark:text-white">Categories</h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/properties?category=houses" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Houses</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
              <Link href="/properties?category=land" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Land</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
              <Link href="/properties?category=cars" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Cars</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
              <Link href="/properties?category=business" className="group inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Business</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500 dark:text-blue-400" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-extrabold uppercase tracking-[0.12em] text-gray-900 dark:text-white">Contact Info</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <a href="tel:614463895" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors break-all">614463895</a>
              </div>
              <div className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <a href="mailto:hello@dalaalconnect.so" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors break-all">hello@dalaalconnect.so</a>
              </div>
              <div className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-900/40 transition-all duration-300">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">Mogadishu, Somalia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>© {currentYear} DalaalConnect. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available 24/7 for urgent property needs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;