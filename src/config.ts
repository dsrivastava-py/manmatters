// Single source of truth for brand constants and external links.
// Do not hard-code these values anywhere else.

export const BRAND_NAME = 'Man Matters';
export const APP_NAME = 'Kab Tak?';

// Hair assessment and doctor consult entry point (verified reachable at planning time).
export const CONSULT_URL = 'https://manmatters.com/pages/hair-form-assessment';

// NOTE: manmatters.com has no dedicated consent page. The terms and conditions
// page is the closest public document, so it is used as the consent link.
// India's single emergency number.
export const EMERGENCY_NUMBER = '112';

export const CONSENT_URL = 'https://manmatters.com/terms-and-conditions';

export const PRIVACY_URL = 'https://manmatters.com/privacy-policy';
export const SITE_URL = 'https://manmatters.com';

export const STORAGE_KEY = 'kabtak.v1';
export const STORAGE_VERSION = 1;
// Theme preference lives in its own key so index.html can read it before first paint.
// Keep in sync with the inline script in index.html.
export const THEME_KEY = 'kabtak.theme';
export const THEME_COLORS = { light: '#143461', dark: '#0B1B33' } as const;

// Builder credit (Mosaic Wellness Fellowship Builder Challenge).
export const BUILDER = {
  name: 'Devansh Srivastava',
  college: 'Kirori Mal College, University of Delhi',
  collegeShort: 'Kirori Mal College, DU',
  email: 'devanshsrivastava.reads@gmail.com',
  phone: '+918736956764',
  phoneDisplay: '+91 8736956764',
} as const;

// Official Man Matters wordmark, unmodified copy of
// https://i.mscwlns.co/media/misc/others/Manmatters%20Logo_egs4fo.png (800x217).
// Always size by height with width auto to keep its proportions.
export const LOGO = 'brand/logo.png';

// Official typeface MiSansLatin is self-hosted in public/fonts/MiSansLatin (see tokens.css).
export const BRAND_FONT = 'MiSansLatin';
