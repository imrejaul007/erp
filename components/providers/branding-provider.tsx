'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BrandingData {
  companyName: string;
  companyNameAr?: string;
  logoUrl?: string;
  logoWhiteUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  textPrimary: string;
  textSecondary: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  fontFamily: string;
  fontSize: string;
  sidebarStyle: string;
  headerStyle: string;
  borderRadius: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  timeFormat: string;
  customCss?: string;
}

interface BrandingContextType {
  branding: BrandingData | null;
  loading: boolean;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType>({
  branding: null,
  loading: true,
  refreshBranding: async () => {},
});

export const useBranding = () => useContext(BrandingContext);

interface BrandingProviderProps {
  children: ReactNode;
}

const DEFAULT_BRANDING: BrandingData = {
  companyName: 'Oud & Perfume ERP',
  companyNameAr: 'نظام إدارة العود والعطور',
  primaryColor: '#d97706',
  primaryHover: '#b45309',
  accentColor: '#92400e',
  bgLight: '#fffbeb',
  bgDark: '#1f2937',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
  infoColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'medium',
  sidebarStyle: 'light',
  headerStyle: 'light',
  borderRadius: 'medium',
  currency: 'AED',
  currencySymbol: 'AED',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [branding, setBranding] = useState<BrandingData | null>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      const response = await fetch('/api/branding');
      const result = await response.json();

      if (result.success && result.data) {
        setBranding(result.data);
        applyBranding(result.data);
      } else {
        // Use default branding if fetch fails
        setBranding(DEFAULT_BRANDING);
        applyBranding(DEFAULT_BRANDING);
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
      // Use default branding on error
      setBranding(DEFAULT_BRANDING);
      applyBranding(DEFAULT_BRANDING);
    } finally {
      setLoading(false);
    }
  };

  const applyBranding = (data: BrandingData) => {
    // Apply CSS variables
    const root = document.documentElement;

    root.style.setProperty('--primary-color', data.primaryColor);
    root.style.setProperty('--primary-hover', data.primaryHover);
    root.style.setProperty('--accent-color', data.accentColor);
    root.style.setProperty('--bg-light', data.bgLight);
    root.style.setProperty('--bg-dark', data.bgDark);
    root.style.setProperty('--text-primary', data.textPrimary);
    root.style.setProperty('--text-secondary', data.textSecondary);
    root.style.setProperty('--success-color', data.successColor);
    root.style.setProperty('--warning-color', data.warningColor);
    root.style.setProperty('--error-color', data.errorColor);
    root.style.setProperty('--info-color', data.infoColor);

    // Apply font family
    if (data.fontFamily) {
      root.style.setProperty('--font-family', data.fontFamily);
    }

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('--font-size-base', fontSizeMap[data.fontSize as keyof typeof fontSizeMap] || '16px');

    // Apply border radius
    const borderRadiusMap = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '12px',
    };
    root.style.setProperty('--border-radius', borderRadiusMap[data.borderRadius as keyof typeof borderRadiusMap] || '8px');

    // Update favicon
    if (data.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = data.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    // Update page title
    if (data.companyName) {
      document.title = data.companyName;
    }

    // Apply custom CSS
    if (data.customCss) {
      let customStyleTag = document.getElementById('custom-branding-css') as HTMLStyleElement;
      if (!customStyleTag) {
        customStyleTag = document.createElement('style');
        customStyleTag.id = 'custom-branding-css';
        document.head.appendChild(customStyleTag);
      }
      customStyleTag.textContent = data.customCss;
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  const refreshBranding = async () => {
    setLoading(true);
    await fetchBranding();
  };

  return (
    <BrandingContext.Provider value={{ branding, loading, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}
