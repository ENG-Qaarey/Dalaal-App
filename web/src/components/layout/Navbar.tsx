'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun, Menu, ChevronDown, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';
import styles from '@/styles/Navbar.module.css';

const Navbar = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'EN' as const, label: 'English', flag: '🇬🇧' },
    { code: 'SO' as const, label: 'Soomaali', flag: '🇸🇴' },
    { code: 'AR' as const, label: 'العربية', flag: '🇸🇦' },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t.nav.properties, href: '/properties' },
    { name: t.nav.dalaals, href: '/dalaals' },
    { name: t.nav.howItWorks, href: '#how-it-works' },
    { name: t.nav.about, href: '/about' },
  ];

  if (!mounted) return null;

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : styles.navTransparent}`}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              {mounted && (
                <>
                  <Image
                    src="/AppIcon/Dalaal-Light-icon.png"
                    alt="Dalaal Icon"
                    fill
                    sizes="40px"
                    className={`${styles.logoImage} ${styles.logoImageLight}`}
                  />
                  <Image
                    src="/AppIcon/Dalaal-Dark-icon.png"
                    alt="Dalaal Icon"
                    fill
                    sizes="40px"
                    className={`${styles.logoImage} ${styles.logoImageDark}`}
                  />
                </>
              )}
            </div>
            <span className={`${styles.logoText} ${styles.logoTextLight}`}>
              Dalaal<span className={styles.logoAccent}>Connect</span>
            </span>
          </Link>
        </div>

        <div className={styles.center}>
          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${styles.navLink} ${styles.navLinkLight}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={`${styles.themeBtn} ${styles.themeBtnLight}`}
          >
            <Sun className={styles.themeIcon} />
            <Moon className={styles.themeIcon} />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`${styles.langBtn} ${styles.langBtnLight}`}
            >
              <Globe className={styles.langIcon} />
              <span>{lang}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className={styles.langDropdown}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    className={`${styles.langOption} ${styles.langOptionLight} ${lang === l.code ? styles.langOptionActive : ''}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.desktopButtons}>
            <Link href="/login">
              <Button variant="ghost" className={`${styles.signInBtn} ${styles.signInBtnLight}`}>
                {t.nav.signIn}
              </Button>
            </Link>
            <Link href="/register">
              <Button className={`${styles.getStartedBtn} ${styles.getStartedBtnLight}`}>
                {t.nav.getStarted}
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={`${styles.mobileMenuBtn} ${styles.mobileMenuBtnLight}`}>
                <Menu className={styles.mobileMenuBtnIcon} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={styles.mobileMenu}>
              <div className={styles.mobileMenuContent}>
                <div className={styles.mobileMenuLinks}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={styles.mobileMenuLink}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <hr className={styles.mobileMenuDivider} />
                <div className={styles.mobileMenuButtons}>
                  <Link href="/login">
                    <Button variant="outline" className={`w-full font-bold h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 hover:border-primary hover:text-primary hover:bg-primary/5 ${styles.mobileMenuBtnItem}`}>
                      {t.nav.signIn}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className={`w-full font-bold h-12 rounded-2xl shadow-lg ${styles.mobileMenuBtnItem} ${styles.mobileMenuBtnFilled} ${styles.mobileMenuBtnFilledLight}`}>
                      {t.nav.getStarted}
                    </Button>
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