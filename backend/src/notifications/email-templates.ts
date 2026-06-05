export type VerificationEmailKind = 'login' | 'password-reset' | 'email-verification';

const BRAND_BLUE = '#2563eb';
const BRAND_BLUE_DARK = '#1d4ed8';
const BRAND_BLUE_SOFT = '#eff6ff';
const BRAND_BLUE_WAVE = '#dbeafe';
const CODE_DIGIT = '#4f46e5';
const TEXT_MAIN = '#0f172a';
const TEXT_BODY = '#64748b';
const TEXT_MUTED = '#94a3b8';
const BORDER = '#e2e8f0';
const PAGE_BG = '#f1f5f9';
const CODE_TRACK = '#f8fafc';
const FOOTER_BG = '#f8fafc';

const FONT =
  "'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

/** Graduation-cap app logo (matches mockup) */
const LOGO_IMG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
  <rect width="36" height="36" rx="10" fill="${BRAND_BLUE}"/>
  <path d="M18 8 L28 13 L18 18 L8 13 Z" fill="#ffffff"/>
  <path d="M24 15 V21 C24 23.5 21.5 25.5 18 26.5 C14.5 25.5 12 23.5 12 21 V15" stroke="#ffffff" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <circle cx="28" cy="13" r="2" fill="#ffffff"/>
</svg>`);

/** Shield + lock — login & email verification */
const HERO_LOGIN_IMG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="140" viewBox="0 0 160 140">
  <defs>
    <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="${BRAND_BLUE}"/>
    </linearGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#2563eb" flood-opacity="0.25"/>
    </filter>
  </defs>
  <ellipse cx="80" cy="118" rx="52" ry="10" fill="#dbeafe" opacity="0.8"/>
  <path filter="url(#sh)" d="M80 24 L118 40 V68 C118 92 102 108 80 116 C58 108 42 92 42 68 V40 Z" fill="url(#sg)"/>
  <path d="M80 30 L110 43 V68 C110 88 97 100 80 106 C63 100 50 88 50 68 V43 Z" fill="${BRAND_BLUE_DARK}" opacity="0.35"/>
  <rect x="70" y="62" width="20" height="18" rx="4" fill="#ffffff"/>
  <path d="M74 62 V57 C74 53 77 50 80 50 C83 50 86 53 86 57 V62" stroke="#ffffff" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="118" cy="38" r="16" fill="#22c55e"/>
  <path d="M111 38 L116 43 L125 34" stroke="#ffffff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

/** Envelope + lock — password reset */
const HERO_RESET_IMG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="140" viewBox="0 0 160 140">
  <defs>
    <linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#93c5fd"/>
      <stop offset="100%" stop-color="${BRAND_BLUE}"/>
    </linearGradient>
    <filter id="eh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#2563eb" flood-opacity="0.22"/>
    </filter>
  </defs>
  <ellipse cx="80" cy="118" rx="52" ry="10" fill="#dbeafe" opacity="0.8"/>
  <rect filter="url(#eh)" x="38" y="44" width="84" height="58" rx="10" fill="url(#eg)"/>
  <path d="M38 50 L80 78 L122 50" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
  <rect x="58" y="58" width="44" height="32" rx="6" fill="#ffffff"/>
  <rect x="68" y="68" width="24" height="14" rx="3" fill="${BRAND_BLUE_SOFT}"/>
  <path d="M72 68 V64 C72 61.5 74 60 76 60 C78 60 80 61.5 80 64 V68" stroke="${BRAND_BLUE}" stroke-width="2.5" fill="none"/>
  <circle cx="118" cy="42" r="16" fill="${BRAND_BLUE}"/>
  <path d="M118 34 A8 8 0 1 1 110 42" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M110 38 L110 34 L114 34" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

const WAVE_BG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120" preserveAspectRatio="none">
  <path d="M0,60 Q150,0 300,50 T600,40 L600,0 L0,0 Z" fill="${BRAND_BLUE_WAVE}" opacity="0.55"/>
  <path d="M0,80 Q200,30 400,70 T600,55 L600,0 L0,0 Z" fill="${BRAND_BLUE_SOFT}" opacity="0.45"/>
</svg>`);

function svgDataUri(svg: string): string {
  const compact = svg.replace(/\s+/g, ' ').trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(compact)}`;
}

function buildCodeBoxes(code: string): string {
  const digits = code.replace(/\D/g, '').padStart(6, '0').slice(0, 6).split('');
  const cells = digits
    .map(
      (digit) => `
        <td style="padding:5px;">
          <div style="width:46px;height:54px;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;
            text-align:center;line-height:54px;font-size:30px;font-weight:700;color:${CODE_DIGIT};
            font-family:${FONT};box-shadow:0 1px 3px rgba(15,23,42,0.06);">
            ${digit}
          </div>
        </td>`,
    )
    .join('');

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="margin:20px 0 24px;">
      <tr>
        <td align="center" style="background:${CODE_TRACK};border:1px solid ${BORDER};border-radius:16px;padding:16px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>${cells}</tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function brandHeader(appName: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="${LOGO_IMG}" width="36" height="36" alt="${appName}" style="display:block;border:0;" />
              </td>
              <td style="padding-left:10px;font-size:17px;font-weight:700;color:${TEXT_MAIN};font-family:${FONT};vertical-align:middle;">
                ${appName}
              </td>
            </tr>
          </table>
        </td>
        <td align="right" style="font-size:11px;color:${TEXT_MUTED};font-family:${FONT};vertical-align:middle;white-space:nowrap;">
          Secure &#8226; Trusted &#8226; Reliable
        </td>
      </tr>
    </table>`;
}

function heroBlock(kind: VerificationEmailKind): string {
  const isReset = kind === 'password-reset';
  const img = isReset ? HERO_RESET_IMG : HERO_LOGIN_IMG;
  const alt = isReset ? 'Password reset' : 'Login verification';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:8px 0 4px;">
          <img src="${img}" width="160" height="140" alt="${alt}" style="display:block;border:0;max-width:160px;height:auto;" />
        </td>
      </tr>
    </table>`;
}

function socialIcons(): string {
  const icon = (label: string) => `
    <td style="padding-left:8px;">
      <div style="width:28px;height:28px;background:#e2e8f0;border-radius:50%;text-align:center;
        line-height:28px;font-size:12px;font-weight:700;color:${TEXT_BODY};font-family:${FONT};">
        ${label}
      </div>
    </td>`;

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right">
      <tr>
        ${icon('f')}
        ${icon('t')}
        ${icon('in')}
      </tr>
    </table>`;
}

function footerBlock(appName: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:${FOOTER_BG};border-top:1px solid ${BORDER};">
      <tr>
        <td style="padding:18px 28px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${LOGO_IMG}" width="28" height="28" alt="" style="display:block;border:0;" />
                    </td>
                    <td style="padding-left:8px;vertical-align:middle;">
                      <div style="font-size:14px;font-weight:700;color:${TEXT_MAIN};font-family:${FONT};">${appName}</div>
                      <div style="margin-top:2px;font-size:11px;color:${TEXT_MUTED};font-family:${FONT};">
                        Connecting people to trusted properties
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right" style="vertical-align:middle;">
                ${socialIcons()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function expiryBlock(minutes: number, secondary: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="background:${BRAND_BLUE_SOFT};border:1px solid #bfdbfe;border-radius:14px;padding:16px 18px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="32" style="vertical-align:top;padding-right:10px;">
                <div style="width:28px;height:28px;background:#ffffff;border-radius:50%;text-align:center;
                  line-height:28px;font-size:16px;color:${BRAND_BLUE};">&#128337;</div>
              </td>
              <td style="font-size:14px;line-height:1.6;color:${TEXT_MAIN};font-family:${FONT};">
                <strong>This code will expire in ${minutes} minutes.</strong> ${secondary}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

const COPY: Record<
  VerificationEmailKind,
  {
    title: string;
    intro: string;
    expiryMinutes: number;
    expirySecondary: string;
    footerNote: string | null;
  }
> = {
  login: {
    title: 'Login Verification',
    intro: 'Your 6-digit verification code is:',
    expiryMinutes: 10,
    expirySecondary: 'For your security, please do not share this code with anyone.',
    footerNote: "If you didn't try to login, you can safely ignore this email.",
  },
  'password-reset': {
    title: 'Password Reset',
    intro: 'You requested a password reset. Your 6-digit verification code is:',
    expiryMinutes: 15,
    expirySecondary: 'If you did not request a password reset, you can safely ignore this email.',
    footerNote: null,
  },
  'email-verification': {
    title: 'Verify Your Email',
    intro: 'Welcome! Your 6-digit verification code is:',
    expiryMinutes: 10,
    expirySecondary: 'For your security, please do not share this code with anyone.',
    footerNote: "If you didn't create an account, you can safely ignore this email.",
  },
};

export function getVerificationEmailSubject(kind: VerificationEmailKind, appName: string): string {
  return `${COPY[kind].title} - ${appName}`;
}

export function buildVerificationEmailHtml(params: {
  kind: VerificationEmailKind;
  code: string;
  appName?: string;
}): string {
  const appName = params.appName || 'Dalaal-App';
  const copy = COPY[params.kind];
  const codeBoxes = buildCodeBoxes(params.code);
  const footerNoteHtml = copy.footerNote
    ? `<p style="margin:0 0 24px;font-size:13px;color:${TEXT_MUTED};text-align:center;line-height:1.55;font-family:${FONT};">${copy.footerNote}</p>`
    : '<div style="height:8px;"></div>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${copy.title}</title>
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAGE_BG};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:520px;background:#ffffff;border-radius:18px;border:1px solid ${BORDER};
            box-shadow:0 8px 30px rgba(15,23,42,0.08);overflow:hidden;">
          <tr>
            <td style="padding:0;background:#ffffff;">
              <img src="${WAVE_BG}" width="520" height="90" alt="" style="display:block;width:100%;max-width:520px;height:90px;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 0;margin-top:-12px;">
              ${brandHeader(appName)}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 0;">
              ${heroBlock(params.kind)}
              <h1 style="margin:0;font-size:34px;font-weight:800;color:${TEXT_MAIN};text-align:center;letter-spacing:-0.02em;
                font-family:${FONT};line-height:1.15;">
                ${copy.title}
              </h1>
              <p style="margin:22px 0 6px;font-size:16px;font-weight:600;color:${BRAND_BLUE};text-align:center;font-family:${FONT};">
                Hi there,
              </p>
              <p style="margin:0;font-size:15px;color:${TEXT_BODY};text-align:center;line-height:1.55;font-family:${FONT};">
                ${copy.intro}
              </p>
              ${codeBoxes}
              ${expiryBlock(copy.expiryMinutes, copy.expirySecondary)}
              ${footerNoteHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0;">
              ${footerBlock(appName)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Generate preview HTML files (run: npm run email:preview) */
export function buildAllEmailPreviews(appName = 'Dalaal-App'): Record<string, string> {
  return {
    'login-verification.html': buildVerificationEmailHtml({
      kind: 'login',
      code: '183337',
      appName,
    }),
    'password-reset.html': buildVerificationEmailHtml({
      kind: 'password-reset',
      code: '319052',
      appName,
    }),
    'email-verification.html': buildVerificationEmailHtml({
      kind: 'email-verification',
      code: '482916',
      appName,
    }),
  };
}
