import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Link2, MessageSquare } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-20 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-white">
              Dalaal<span className="text-primary">Connect</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed">
            Somalia's most trusted property platform. Connecting verified brokers with seekers worldwide. Built for local users and the diaspora.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-primary transition-colors text-white">
              <Link2 className="h-5 w-5" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-primary transition-colors text-white">
              <Globe className="h-5 w-5" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-primary transition-colors text-white">
              <MessageSquare className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h3 className="text-white font-semibold text-lg">Quick Links</h3>
          <div className="flex flex-col gap-4">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-6">
          <h3 className="text-white font-semibold text-lg">Categories</h3>
          <div className="flex flex-col gap-4">
            <Link href="/properties?category=houses" className="hover:text-primary transition-colors">Houses</Link>
            <Link href="/properties?category=land" className="hover:text-primary transition-colors">Land</Link>
            <Link href="/properties?category=cars" className="hover:text-primary transition-colors">Cars</Link>
            <Link href="/properties?category=business" className="hover:text-primary transition-colors">Business</Link>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-6">
          <h3 className="text-white font-semibold text-lg">Contact Info</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <span>+252 61 XXX XXXX</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <span>hello@dalaalconnect.so</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <span>Mogadishu, Somalia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          © {currentYear} DalaalConnect. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm">
          <span>Available 24/7 for urgent property needs</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
