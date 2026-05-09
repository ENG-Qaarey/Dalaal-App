import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

const NewsletterContact = () => {
  return (
    <section className="py-16 bg-white dark:bg-zinc-950 px-6">
      <div className="max-w-5xl mx-auto bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-zinc-100 dark:border-zinc-800">
        {/* Newsletter Form */}
        <div className="flex-[1.2] p-10 md:p-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
              Newsletter
            </div>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 leading-tight tracking-tight">
              Stay Ahead of <br /> the Market
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-base mb-8 leading-relaxed max-w-sm">
              Get the latest listings and exclusive deals delivered to your inbox weekly.
            </p>

            <form className="flex flex-col gap-3 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <Input 
                placeholder="Enter your email" 
                className="h-12 rounded-xl bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 px-5 text-base focus:ring-primary shadow-inner"
              />
              <Button className="h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-base shadow-lg shadow-primary/20 transition-all">
                Subscribe
              </Button>
              <div className="flex items-center gap-2 mt-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                <div className="w-1 h-1 rounded-full bg-secondary" />
                No spam. Unsubscribe anytime.
              </div>
            </form>
          </motion.div>
        </div>

        {/* Contact Info */}
        <div className="flex-1 bg-zinc-900 dark:bg-zinc-800 p-10 md:p-14 text-white flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-[40px] -ml-16 -mb-16" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h3 className="text-2xl font-black mb-8 tracking-tight">How can we help?</h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all shadow-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Call Us</div>
                  <div className="text-base font-black group-hover:text-primary transition-colors">+252 61 XXX XXXX</div>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all shadow-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Email Us</div>
                  <div className="text-base font-black group-hover:text-primary transition-colors">hello@dalaalconnect.so</div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-zinc-500 text-sm italic leading-relaxed">
                "We're here to make your property journey seamless."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterContact;
