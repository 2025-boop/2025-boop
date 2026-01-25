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
  usaa: {
    companyId: 'usaa',
    companyName: 'USAA',
    logo: '/brands/usaa/usaa_logo.png',
    colors: {
      primary: '#0e2e49',
      secondary: '#0b2237',
      accent: '#54732d',
    },
  },

  default: {
    companyId: 'default',
    companyName: 'Verification Platform',
    logo: '/brands/usaa/usaa_logo.png',
    colors: {
      primary: '#0e2e49',    // USAA Primary
      secondary: '#0b2237',  // USAA Secondary
      accent: '#54732d',     // USAA Button
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'default' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'default';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.default;

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
