import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Home, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Properties', href: '/properties' },
    { name: 'Dalaals', href: '/dalaals' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '/about' },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-lg border-b border-zinc-200 dark:border-zinc-800 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:shadow-primary/20">
              {mounted && (
                <>
                  <Image
                    src="/AppIcon/Dalaal-Light-icon.png"
                    alt="Dalaal Icon"
                    fill
                    sizes="40px"
                    className="object-contain dark:hidden"
                  />
                  <Image
                    src="/AppIcon/Dalaal-Dark-icon.png"
                    alt="Dalaal Icon"
                    fill
                    sizes="40px"
                    className="object-contain hidden dark:block"
                  />
                </>
              )}
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-white'
            }`}>
              Dalaal<span className="text-primary">Connect</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden lg:flex flex-[2] justify-center">
          <div className="flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-900/50 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 hover:text-primary hover:bg-white dark:hover:bg-zinc-800 shadow-sm shadow-transparent hover:shadow-zinc-200/50 dark:hover:shadow-black/50 ${
                  scrolled 
                    ? 'text-zinc-900 dark:text-zinc-100' 
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={`rounded-full transition-all duration-300 ${
              scrolled 
                ? 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className={`font-bold transition-all duration-300 ${
                  scrolled 
                    ? 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`lg:hidden transition-colors ${
                  scrolled ? 'text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-white'
                }`}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col gap-8 mt-12">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="px-4 py-3 text-lg font-semibold text-zinc-900 dark:text-white hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl transition-all"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <div className="flex flex-col gap-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full font-bold h-12 rounded-2xl border-zinc-200 dark:border-zinc-800">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20">Get Started</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
