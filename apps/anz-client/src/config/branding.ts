/**
 * Branding Configuration
 *
 * This file defines company-specific branding for the white-label customer verification SPA.
 * Each company can have different logos, colors, and typography.
 *
 * The NEXT_PUBLIC_BRAND_ID environment variable determines which brand configuration is used.
 */

export interface BrandConfig {
  companyId: string;
  companyName: string;
  logo: string;
  colors: {
    primary: string;      // Primary brand color (hex)
    secondary: string;    // Secondary brand color (hex)
    accent: string;       // Accent color (hex)
  };
  fonts?: {
    sans?: string;        // Custom sans font family
    mono?: string;        // Custom monospace font family
  };
}

/**
 * Brand configurations for all supported companies
 */
const brands: Record<string, BrandConfig> = {
  anz: {
    companyId: 'anz',
    companyName: 'ANZ',
    logo: '/brands/anz/logo.svg',
    colors: {
      primary: 'rgb(0, 65, 101)',      // ANZ dark blue
      secondary: 'rgb(0, 125, 186)',   // Gradient start
      accent: 'rgb(46, 86, 128)',      // Gradient end
    },
    fonts: {
      sans: 'myriad-pro, "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
  },

  default: {
    companyId: 'anz',
    companyName: 'ANZ',
    logo: '/brands/anz/logo.svg',
    colors: {
      primary: 'rgb(0, 65, 101)',
      secondary: 'rgb(0, 125, 186)',
      accent: 'rgb(46, 86, 128)',
    },
    fonts: {
      sans: 'myriad-pro, "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'anz' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'anz';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.anz;

/**
 * CSS variables that will be injected into the theme
 * These are used in globals.css to customize Tailwind colors
 */
export const brandCSSVariables = {
  '--color-primary': currentBrand.colors.primary,
  '--color-secondary': currentBrand.colors.secondary,
  '--color-accent': currentBrand.colors.accent,
} as const;

export default currentBrand;
