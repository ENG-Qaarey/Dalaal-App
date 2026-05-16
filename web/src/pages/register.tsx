import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, Lock, User, MapPin, Briefcase, ShieldCheck, CheckCircle2, Eye, EyeOff, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PageBackground from '@/components/shared/PageBackground';
import { useAuth, UserRole } from '@/context/AuthContext';
import { toast } from 'sonner';
import styles from '@/styles/register.module.css';

const features = [
  {
    title: 'Verified Listings',
    desc: 'Every property and broker is vetted for your security and peace of mind.',
    Icon: ShieldCheck,
    iconClass: styles.featureIconSky,
  },
  {
    title: 'Market Insights',
    desc: 'Get real-time data on property trends, prices, and investment opportunities.',
    Icon: CheckCircle2,
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

function getPasswordStrength(pw: string): { score: number; label: string; cls: string } {
  if (!pw) return { score: 0, label: '', cls: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: 'Weak', cls: styles.strengthTextWeak };
  if (score <= 2) return { score: 2, label: 'Fair', cls: styles.strengthTextFair };
  if (score <= 3) return { score: 3, label: 'Good', cls: styles.strengthTextGood };
  return { score: 4, label: 'Strong', cls: styles.strengthTextStrong };
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Property Seeker');
  const [location, setLocation] = useState('Mogadishu');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('dalaal_theme');
    if (saved === 'dark') setIsDark(true);
    else if (saved === 'light') setIsDark(false);
    else setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const strength = getPasswordStrength(password);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields', {
        style: { background: '#dc2626', border: 'none', color: 'white' },
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        style: { background: '#dc2626', border: 'none', color: 'white' },
      });
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters', {
        style: { background: '#dc2626', border: 'none', color: 'white' },
      });
      return;
    }
    if (!termsChecked) {
      toast.error('Please agree to the Terms of Service', {
        style: { background: '#dc2626', border: 'none', color: 'white' },
      });
      return;
    }
    const roleMap: Record<string, UserRole> = {
      'Property Seeker': 'seeker',
      'Broker': 'broker',
      'Property Owner': 'seeker',
    };
    setLoading(true);
    const result = await register({ email, password, firstName, lastName, role: roleMap[role] || 'seeker' });
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Redirecting...', {
        style: { background: '#059669', border: 'none', color: 'white' },
      });
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Registration failed', {
        style: { background: '#dc2626', border: 'none', color: 'white' },
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className={`${styles.container} ${isDark ? styles.containerDark : styles.containerLight}`}>
      <Head><title>Join DalaalPrime | Premium Real Estate</title></Head>
      <PageBackground />

      <div className={styles.wrapper}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`${styles.branding} ${isDark ? 'brandingDark' : ''}`}
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
              className={`${styles.badge} ${isDark ? styles.badgeDark : styles.badgeLight}`}
            >
              <Building2 className="w-3 h-3 mr-1.5" />
              <span className={`${styles.badgeText} ${isDark ? styles.badgeTextDark : styles.badgeTextLight}`}>
                Somalia's Premium Network
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className={`${styles.title} ${isDark ? styles.titleDark : styles.titleLight}`}>
              Start your <br />
              <span className={styles.accent}>real estate journey</span>
            </motion.h1>

            <motion.p variants={itemVariants} className={styles.desc}>
              Join the most trusted property marketplace. Connect with verified brokers and discover premium listings across the country.
            </motion.p>

            <div className={styles.features}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`${styles.featureItem} ${isDark ? styles.featureItemDark : styles.featureItemLight}`}
                >
                  <div className={`${styles.featureIcon} ${f.iconClass}`}>
                    <f.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`${styles.featureTitle} ${isDark ? styles.featureTitleDark : styles.featureTitleLight}`}>{f.title}</h3>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.footer}>
            <p className={styles.footerText}>&copy; 2026 DalaalPrime Inc.</p>
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
                className={`${styles.formCard} ${isDark ? styles.formCardDark : styles.formCardLight}`}
              >
                <div className={styles.formHeader}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto mb-3">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`${styles.formTitle} ${isDark ? styles.formTitleDark : styles.formTitleLight}`}>Create Account</h2>
                  <p className={styles.formSubtitle}>Join DalaalPrime — takes less than a minute.</p>
                </div>

                <div className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.floatingGroup}>
                      <User className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                      <input
                        type="text"
                        id="firstName"
                        placeholder=" "
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className={`${styles.floatingInput} ${isDark ? styles.floatingInputDark : styles.floatingInputLight}`}
                      />
                      <label htmlFor="firstName" className={`${styles.floatingLabel} ${isDark ? styles.floatingLabelDark : styles.floatingLabelLight}`}>
                        First Name
                      </label>
                    </div>
                    <div className={styles.floatingGroup}>
                      <User className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                      <input
                        type="text"
                        id="lastName"
                        placeholder=" "
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className={`${styles.floatingInput} ${isDark ? styles.floatingInputDark : styles.floatingInputLight}`}
                      />
                      <label htmlFor="lastName" className={`${styles.floatingLabel} ${isDark ? styles.floatingLabelDark : styles.floatingLabelLight}`}>
                        Last Name
                      </label>
                    </div>
                  </div>

                  <div className={styles.floatingGroup}>
                    <Mail className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                    <input
                      type="email"
                      id="email"
                      placeholder=" "
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`${styles.floatingInput} ${isDark ? styles.floatingInputDark : styles.floatingInputLight}`}
                    />
                    <label htmlFor="email" className={`${styles.floatingLabel} ${isDark ? styles.floatingLabelDark : styles.floatingLabelLight}`}>
                      Email Address
                    </label>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.selectWrapper}>
                      <Briefcase className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                      <select
                        id="role"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className={`${styles.floatingSelect} ${isDark ? styles.floatingSelectDark : styles.floatingSelectLight}`}
                      >
                        <option value="Property Seeker">Property Seeker</option>
                        <option value="Broker">Broker</option>
                        <option value="Property Owner">Property Owner</option>
                      </select>
                      <div className={styles.selectArrow}>
                        <svg className={styles.selectArrowSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.selectWrapper}>
                      <MapPin className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                      <select
                        id="location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className={`${styles.floatingSelect} ${isDark ? styles.floatingSelectDark : styles.floatingSelectLight}`}
                      >
                        <option value="Mogadishu">Mogadishu</option>
                        <option value="Hargeisa">Hargeisa</option>
                        <option value="Garowe">Garowe</option>
                        <option value="Kismayo">Kismayo</option>
                      </select>
                      <div className={styles.selectArrow}>
                        <svg className={styles.selectArrowSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className={styles.floatingGroup}>
                    <Lock className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder=" "
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={`${styles.floatingInput} ${isDark ? styles.floatingInputDark : styles.floatingInputLight}`}
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <label htmlFor="password" className={`${styles.floatingLabel} ${isDark ? styles.floatingLabelDark : styles.floatingLabelLight}`}>
                      Password
                    </label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle}>
                      {showPassword ? <EyeOff className={styles.passwordIconSize} /> : <Eye className={styles.passwordIconSize} />}
                    </button>
                  </div>

                  {password && (
                    <div>
                      <div className={styles.passwordStrength}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`${styles.strengthBar} ${
                            strength.score >= 1 && i <= strength.score
                              ? (strength.score === 1 ? styles.strengthBarWeak : strength.score === 2 ? styles.strengthBarFair : strength.score === 3 ? styles.strengthBarGood : styles.strengthBarStrong)
                              : ''
                          }`} />
                        ))}
                      </div>
                      <p className={`${styles.strengthText} ${strength.cls}`}>{strength.label}</p>
                    </div>
                  )}

                  <div className={styles.floatingGroup}>
                    <Lock className={styles.inputIconWrapper} style={{ width: '1.125rem', height: '1.125rem' }} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder=" "
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={`${styles.floatingInput} ${isDark ? styles.floatingInputDark : styles.floatingInputLight}`}
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <label htmlFor="confirmPassword" className={`${styles.floatingLabel} ${isDark ? styles.floatingLabelDark : styles.floatingLabelLight}`}>
                      Confirm Password
                    </label>
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={styles.passwordToggle}>
                      {showConfirm ? <EyeOff className={styles.passwordIconSize} /> : <Eye className={styles.passwordIconSize} />}
                    </button>
                  </div>

                  <div className={styles.checkboxRow}>
                    <input type="checkbox" id="terms" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} className={styles.checkbox} />
                    <label htmlFor="terms" className={styles.checkboxLabel}>
                      I agree to the <span className={styles.termsLink}>Terms of Service</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className={`${styles.submitBtn} ${isDark ? styles.submitBtnDark : styles.submitBtnLight}`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div className={styles.divider}>
                    <div className={`${styles.dividerLine} ${isDark ? styles.dividerLineDark : styles.dividerLineLight}`} />
                    <span className={styles.dividerText}>OR</span>
                    <div className={`${styles.dividerLine} ${isDark ? styles.dividerLineDark : styles.dividerLineLight}`} />
                  </div>

                  <button type="button" className={`${styles.googleBtn} ${isDark ? styles.googleBtnDark : styles.googleBtnLight}`}>
                    <svg className={styles.googleIcon} viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <p className={styles.signinLink}>
                  Already have an account?{' '}
                  <Link href="/login" className={styles.signinLinkBtn}>Sign In</Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}