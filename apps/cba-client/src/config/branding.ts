/**
 * Branding Configuration for Commonwealth Bank (CBA)
 *
 * This file defines company-specific branding for the white-label customer verification SPA.
 * Pixel-perfect match to the live CommBank NetBank design.
 */

export interface BrandConfig {
  companyId: string;
  companyName: string;
  logo: string;
  colors: {
    primary: string;      // Primary brand color
    secondary: string;    // Secondary brand color
    accent: string;       // Accent color
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
  cba: {
    companyId: 'cba',
    companyName: 'Commonwealth Bank',
    logo: '/brands/cba/logo.svg',
    colors: {
      primary: '#FFCC00',      // CommBank yellow
      secondary: '#7A7A7A',    // Gray header
      accent: '#000000',       // Black text/links
    },
    fonts: {
      sans: 'CBABeaconSans, Arial, Helvetica, sans-serif',
    },
  },

  default: {
    companyId: 'cba',
    companyName: 'Commonwealth Bank',
    logo: '/brands/cba/logo.svg',
    colors: {
      primary: '#FFCC00',
      secondary: '#7A7A7A',
      accent: '#000000',
    },
    fonts: {
      sans: 'CBABeaconSans, Arial, Helvetica, sans-serif',
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'cba' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'cba';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.cba;

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
