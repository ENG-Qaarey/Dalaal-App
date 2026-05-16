import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, Lock, ShieldCheck, CheckCircle2, Eye, EyeOff, Building2, TrendingUp } from 'lucide-react';
import PageBackground from '@/components/shared/PageBackground';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import styles from '@/styles/login.module.css';

const features = [
  {
    title: 'Real-time Updates',
    desc: 'Never miss a lead with instant notifications and live property alerts.',
    Icon: CheckCircle2,
    iconClass: styles.featureIconSky,
  },
  {
    title: 'Secure Access',
    desc: 'Your data is protected with enterprise-grade encryption and security.',
    Icon: ShieldCheck,
    iconClass: styles.featureIconIndigo,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem('dalaal_theme');
    if (stored === 'dark') setIsDarkMode(true);
    else if (stored === 'light') setIsDarkMode(false);
    else setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back! Redirecting to dashboard...', {
        style: { background: '#059669', border: 'none', color: 'white' },
      });
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Login failed', {
        style: { background: '#dc2626', border: 'none', color: 'white' },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (!mounted) return null;

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.containerDark : styles.containerLight}`}>
      <Head><title>Sign In | DalaalPrime</title></Head>
      <PageBackground />

      <div className={styles.wrapper}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`${styles.branding} ${isDarkMode ? 'brandingDark' : ''}`}
        >
          <div className={styles.floatingOrbs}>
            <div className={`${styles.orb} ${styles.orb1}`} />
            <div className={`${styles.orb} ${styles.orb2}`} />
            <div className={`${styles.orb} ${styles.orb3}`} />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.brandingContent}
          >
            <motion.div
              variants={itemVariants}
              className={`${styles.badge} ${isDarkMode ? styles.badgeDark : styles.badgeLight}`}
            >
              <Building2 className="w-3 h-3 mr-1.5" />
              <span className={`${styles.badgeText} ${isDarkMode ? styles.badgeTextDark : styles.badgeTextLight}`}>
                Welcome Back To Dalaal
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className={`${styles.title} ${isDarkMode ? styles.titleDark : styles.titleLight}`}>
              Access your <br />
              <span className={styles.accent}>premium portal</span>
            </motion.h1>

            <motion.p variants={itemVariants} className={styles.desc}>
              Manage your properties, connect with clients, and stay ahead in Somalia's most dynamic real estate market.
            </motion.p>

            <div className={styles.features}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`${styles.featureItem} ${isDarkMode ? styles.featureItemDark : styles.featureItemLight}`}
                >
                  <div className={`${styles.featureIcon} ${f.iconClass}`}>
                    <f.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`${styles.featureTitle} ${isDarkMode ? styles.featureTitleDark : styles.featureTitleLight}`}>{f.title}</h3>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.footer}>
            <p className={styles.footerText}>&copy; 2026 DalaalPrime — Premium Real Estate Network</p>
          </motion.div>

          <div className={styles.decoration}>
            <div className={styles.decorationGradient} />
          </div>
        </motion.div>

        <motion.div
          className={styles.formPanel}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <div className={styles.formScroll}>
            <div className={styles.formContainer}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className={`${styles.formCard} ${isDarkMode ? styles.formCardDark : styles.formCardLight}`}
              >
                <div className={styles.formHeader}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 mx-auto mb-3">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`${styles.formTitle} ${isDarkMode ? styles.formTitleDark : styles.formTitleLight}`}>Sign In</h2>
                  <p className={styles.formSubtitle}>Welcome back! Enter your credentials.</p>
                </div>

                <div className={styles.form}>
                  <div className={styles.floatingGroup}>
                    <Mail className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                    <input
                      type="email"
                      id="email"
                      placeholder=" "
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      onKeyDown={handleKeyDown}
                      className={`${styles.floatingInput} ${isDarkMode ? styles.floatingInputDark : styles.floatingInputLight}`}
                    />
                    <label
                      htmlFor="email"
                      className={`${styles.floatingLabel} ${isDarkMode ? styles.floatingLabelDark : styles.floatingLabelLight}`}
                      style={{ left: emailFocused || email ? '2.75rem' : '2.75rem', top: emailFocused || email ? '0.625rem' : '50%', fontSize: emailFocused || email ? '0.625rem' : '0.875rem', letterSpacing: emailFocused || email ? '0.05em' : 'normal', textTransform: emailFocused || email ? 'uppercase' : 'none', fontWeight: emailFocused || email ? '700' : '500', transform: emailFocused || email ? 'none' : 'translateY(-50%)' }}
                    >
                      Email Address
                    </label>
                  </div>

                  <div className={styles.floatingGroup}>
                    <Lock className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder=" "
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      onKeyDown={handleKeyDown}
                      className={`${styles.floatingInput} ${isDarkMode ? styles.floatingInputDark : styles.floatingInputLight}`}
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <label
                      htmlFor="password"
                      className={`${styles.floatingLabel} ${isDarkMode ? styles.floatingLabelDark : styles.floatingLabelLight}`}
                      style={{ left: passwordFocused || password ? '2.75rem' : '2.75rem', top: passwordFocused || password ? '0.625rem' : '50%', fontSize: passwordFocused || password ? '0.625rem' : '0.875rem', letterSpacing: passwordFocused || password ? '0.05em' : 'normal', textTransform: passwordFocused || password ? 'uppercase' : 'none', fontWeight: passwordFocused || password ? '700' : '500', transform: passwordFocused || password ? 'none' : 'translateY(-50%)' }}
                    >
                      Password
                    </label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle}>
                      {showPassword ? <EyeOff className={styles.passwordIconSize} /> : <Eye className={styles.passwordIconSize} />}
                    </button>
                  </div>

                  <div className={styles.forgotRow}>
                    <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    className={`${styles.submitBtn} ${isDarkMode ? styles.submitBtnDark : styles.submitBtnLight}`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      'Sign In to DalaalPrime'
                    )}
                  </button>

                  <div className={styles.divider}>
                    <div className={`${styles.dividerLine} ${isDarkMode ? styles.dividerLineDark : styles.dividerLineLight}`} />
                    <span className={styles.dividerText}>OR</span>
                    <div className={`${styles.dividerLine} ${isDarkMode ? styles.dividerLineDark : styles.dividerLineLight}`} />
                  </div>

                  <button type="button" className={`${styles.googleBtn} ${isDarkMode ? styles.googleBtnDark : styles.googleBtnLight}`}>
                    <svg className={styles.googleIcon} viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <p className={styles.signupLink}>
                  Don't have an account? <Link href="/register" className={styles.signupLinkBtn}>Create one</Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}