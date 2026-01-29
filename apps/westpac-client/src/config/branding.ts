/**
 * Westpac Branding Configuration
 *
 * This file defines company-specific branding for the white-label customer verification SPA.
 * Westpac New Zealand - "Westpac One" online banking
 */

export interface BrandConfig {
  companyId: string;
  companyName: string;
  logo: string;
  colors: {
    primary: string;      // Primary brand color (Westpac red)
    secondary: string;    // Button color (Plum)
    accent: string;       // Button hover (Darker plum)
  };
  fonts?: {
    body?: string;        // Body font family
    heading?: string;     // Heading font family
  };
}

/**
 * Brand configurations for Westpac
 */
const brands: Record<string, BrandConfig> = {
  westpac: {
    companyId: 'westpac',
    companyName: 'Westpac New Zealand',
    logo: '/brands/westpac/logo.svg',
    colors: {
      primary: '#D5002B',      // Westpac red
      secondary: '#541e4b',    // Button plum
      accent: '#3d1637',       // Button hover plum
    },
    fonts: {
      body: '"National 2", system-ui, sans-serif',
      heading: '"Tiempos Text", "Times New Roman", serif',
    },
  },

  default: {
    companyId: 'westpac',
    companyName: 'Westpac New Zealand',
    logo: '/brands/westpac/logo.svg',
    colors: {
      primary: '#D5002B',
      secondary: '#541e4b',
      accent: '#3d1637',
    },
    fonts: {
      body: '"National 2", system-ui, sans-serif',
      heading: '"Tiempos Text", "Times New Roman", serif',
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'westpac' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'westpac';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.westpac;

/**
 * CSS variables that will be injected into the theme
 */
export const brandCSSVariables = {
  '--color-primary': currentBrand.colors.primary,
  '--color-secondary': currentBrand.colors.secondary,
  '--color-accent': currentBrand.colors.accent,
} as const;

export default currentBrand;
