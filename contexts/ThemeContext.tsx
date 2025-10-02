'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  hoverBackground: string;
  hoverText: string;
}

interface CustomColors {
  [pageId: string]: {
    [sectionId: string]: {
      background: string;
      text: string;
    };
  };
}

interface ThemeSettings {
  isDarkMode: boolean;
  globalTheme: ThemeColors;
  customColors: CustomColors;
  selectedPreset: string | null;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  getSectionColors: (pageId: string, sectionId: string) => { background: string; text: string } | null;
}

const defaultTheme: ThemeColors = {
  primary: '#2563eb',
  secondary: '#64748b',
  background: '#f8fafc',
  cardBackground: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  border: '#e2e8f0',
  hoverBackground: '#2563eb',
  hoverText: '#ffffff'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    isDarkMode: false,
    globalTheme: defaultTheme,
    customColors: {},
    selectedPreset: 'modern-blue'
  });

  // Load theme settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appThemeSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setThemeSettings({
          isDarkMode: parsed.isDarkMode || false,
          globalTheme: parsed.globalTheme || defaultTheme,
          customColors: parsed.customColors || {},
          selectedPreset: parsed.selectedPreset || 'modern-blue'
        });
      } catch (e) {
        console.error('Failed to load theme settings:', e);
      }
    }
  }, []);

  // Apply theme to CSS variables whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    const theme = themeSettings.globalTheme;

    // Convert hex to HSL for CSS variables
    const hexToHSL = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return '0 0% 0%';

      const r = parseInt(result[1], 16) / 255;
      const g = parseInt(result[2], 16) / 255;
      const b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      return `${h} ${s}% ${l}%`;
    };

    // Update CSS variables
    root.style.setProperty('--primary', hexToHSL(theme.primary));
    root.style.setProperty('--background', hexToHSL(theme.background));
    root.style.setProperty('--card', hexToHSL(theme.cardBackground));
    root.style.setProperty('--foreground', hexToHSL(theme.textPrimary));
    root.style.setProperty('--muted-foreground', hexToHSL(theme.textSecondary));
    root.style.setProperty('--border', hexToHSL(theme.border));

    // Apply dark mode class
    if (themeSettings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeSettings]);

  const updateTheme = (settings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => {
      const updated = { ...prev, ...settings };
      // Save to localStorage
      localStorage.setItem('appThemeSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const getSectionColors = (pageId: string, sectionId: string) => {
    return themeSettings.customColors[pageId]?.[sectionId] || null;
  };

  return (
    <ThemeContext.Provider value={{ themeSettings, updateTheme, getSectionColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
