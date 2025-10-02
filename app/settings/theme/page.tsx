'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Sun,
  Moon,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Home,
  Settings,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

// Preset themes
const PRESET_THEMES = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Professional blue theme with high contrast',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#f8fafc',
      cardBackground: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
      hoverBackground: '#2563eb',
      hoverText: '#ffffff'
    }
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Sophisticated purple theme',
    colors: {
      primary: '#9333ea',
      secondary: '#64748b',
      background: '#faf5ff',
      cardBackground: '#ffffff',
      textPrimary: '#1e1b4b',
      textSecondary: '#4c1d95',
      border: '#e9d5ff',
      hoverBackground: '#9333ea',
      hoverText: '#ffffff'
    }
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    description: 'Natural green theme',
    colors: {
      primary: '#16a34a',
      secondary: '#64748b',
      background: '#f0fdf4',
      cardBackground: '#ffffff',
      textPrimary: '#14532d',
      textSecondary: '#166534',
      border: '#bbf7d0',
      hoverBackground: '#16a34a',
      hoverText: '#ffffff'
    }
  }
];

// Page sections that can be customized
const PAGE_SECTIONS = [
  { id: 'dashboard', name: 'Dashboard', sections: ['KPI Cards', 'Charts', 'Recent Alerts', 'Quick Actions'] },
  { id: 'inventory', name: 'Inventory', sections: ['Product List', 'Stock Levels', 'Alerts', 'Categories'] },
  { id: 'production', name: 'Production', sections: ['Batches', 'Quality Control', 'Progress', 'Reports'] },
  { id: 'sales', name: 'Sales/POS', sections: ['Product Grid', 'Cart', 'Payment', 'Receipt'] },
  { id: 'crm', name: 'CRM', sections: ['Customer List', 'Loyalty', 'Communications', 'Analytics'] },
  { id: 'finance', name: 'Finance', sections: ['Transactions', 'Reports', 'Bank Accounts', 'Charts'] },
  { id: 'settings', name: 'Settings', sections: ['General', 'Appearance', 'Permissions', 'System'] }
];

export default function ThemeSettingsPage() {
  const router = useRouter();
  const { themeSettings, updateTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(themeSettings.isDarkMode);
  const [selectedPreset, setSelectedPreset] = useState(themeSettings.selectedPreset || 'modern-blue');
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [selectedSection, setSelectedSection] = useState('KPI Cards');
  const [isSaved, setIsSaved] = useState(false);

  // Custom color state for selected section
  const [customColors, setCustomColors] = useState({
    textColor: '#0f172a',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    hoverBackground: '#2563eb',
    hoverText: '#ffffff'
  });

  // Global theme colors
  const [globalTheme, setGlobalTheme] = useState(themeSettings.globalTheme);

  // Sync local state with context
  useEffect(() => {
    setIsDarkMode(themeSettings.isDarkMode);
    setGlobalTheme(themeSettings.globalTheme);
    setSelectedPreset(themeSettings.selectedPreset || 'modern-blue');
  }, [themeSettings]);

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESET_THEMES.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setGlobalTheme({
        primary: preset.colors.primary,
        secondary: preset.colors.secondary,
        background: preset.colors.background,
        textPrimary: preset.colors.textPrimary,
        textSecondary: preset.colors.textSecondary
      });
      setCustomColors({
        textColor: preset.colors.textPrimary,
        backgroundColor: preset.colors.cardBackground,
        borderColor: preset.colors.border,
        hoverBackground: preset.colors.hoverBackground,
        hoverText: preset.colors.hoverText
      });
    }
  };

  const handleSave = () => {
    // Update theme using context
    updateTheme({
      isDarkMode,
      globalTheme,
      customColors: themeSettings.customColors,
      selectedPreset
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setSelectedPreset('modern-blue');
    handlePresetSelect('modern-blue');
    setIsDarkMode(false);
  };

  const handleExport = () => {
    const themeSettings = {
      isDarkMode,
      globalTheme,
      customColors,
      selectedPreset
    };

    const blob = new Blob([JSON.stringify(themeSettings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-settings.json';
    a.click();
  };

  const currentPageSections = PAGE_SECTIONS.find(p => p.id === selectedPage)?.sections || [];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/settings" className="hover:text-blue-600 flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium flex items-center gap-1">
          <Palette className="h-4 w-4" />
          Theme Customization
        </span>
      </div>

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.push('/settings')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Settings
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theme Customization</h1>
          <p className="text-gray-600 mt-1">Customize colors and appearance for each page and section</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {isSaved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Panel - Theme Controls */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Dark/Light Mode Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Display Mode
              </CardTitle>
              <CardDescription className="text-gray-600">Switch between light and dark mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Light Mode</span>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Dark Mode</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preset Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Sparkles className="h-5 w-5" />
                Preset Themes
              </CardTitle>
              <CardDescription className="text-gray-600">Choose from pre-designed color themes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRESET_THEMES.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedPreset === preset.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePresetSelect(preset.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{preset.name}</h3>
                        <p className="text-xs text-gray-600">{preset.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: preset.colors.background }}
                      />
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Global Theme Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Global Theme Colors</CardTitle>
              <CardDescription className="text-gray-600">Set colors applied across the entire application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900">Primary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={globalTheme.primary}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, primary: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={globalTheme.primary}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, primary: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900">Secondary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={globalTheme.secondary}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, secondary: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={globalTheme.secondary}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, secondary: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900">Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={globalTheme.background}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, background: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={globalTheme.background}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, background: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900">Primary Text Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={globalTheme.textPrimary}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, textPrimary: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={globalTheme.textPrimary}
                      onChange={(e) => setGlobalTheme({ ...globalTheme, textPrimary: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Page & Section Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Page & Section Colors</CardTitle>
              <CardDescription className="text-gray-600">Customize individual pages and sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Page Selector */}
              <div>
                <Label className="text-gray-900">Select Page</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SECTIONS.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Section Selector */}
              <div>
                <Label className="text-gray-900">Select Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentPageSections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Section Color Customization */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900">Text Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={customColors.textColor}
                      onChange={(e) => setCustomColors({ ...customColors, textColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={customColors.textColor}
                      onChange={(e) => setCustomColors({ ...customColors, textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900">Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={customColors.backgroundColor}
                      onChange={(e) => setCustomColors({ ...customColors, backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={customColors.backgroundColor}
                      onChange={(e) => setCustomColors({ ...customColors, backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900">Border Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={customColors.borderColor}
                      onChange={(e) => setCustomColors({ ...customColors, borderColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={customColors.borderColor}
                      onChange={(e) => setCustomColors({ ...customColors, borderColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900">Hover Background</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={customColors.hoverBackground}
                      onChange={(e) => setCustomColors({ ...customColors, hoverBackground: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={customColors.hoverBackground}
                      onChange={(e) => setCustomColors({ ...customColors, hoverBackground: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900">Hover Text Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={customColors.hoverText}
                      onChange={(e) => setCustomColors({ ...customColors, hoverText: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={customColors.hoverText}
                      onChange={(e) => setCustomColors({ ...customColors, hoverText: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription className="text-gray-600">See how your theme looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Card */}
              <div
                className="p-4 sm:p-6 rounded-lg border-2 transition-all"
                style={{
                  backgroundColor: customColors.backgroundColor,
                  borderColor: customColors.borderColor,
                  color: customColors.textColor
                }}
              >
                <h3 className="text-xl font-bold mb-2">Sample Card</h3>
                <p className="text-sm mb-4">This is how your content will look</p>
                <div className="flex gap-2">
                  <div
                    className="px-4 py-2 rounded-lg cursor-pointer"
                    style={{
                      backgroundColor: globalTheme.primary,
                      color: '#ffffff'
                    }}
                  >
                    Primary Button
                  </div>
                </div>
              </div>

              {/* Hover Preview */}
              <div>
                <Label className="text-gray-900 mb-2 block">Hover State</Label>
                <div
                  className="p-4 sm:p-6 rounded-lg border-2 transition-all cursor-pointer"
                  style={{
                    backgroundColor: customColors.hoverBackground,
                    borderColor: customColors.borderColor,
                    color: customColors.hoverText
                  }}
                >
                  <h3 className="text-xl font-bold mb-2">Hovered Card</h3>
                  <p className="text-sm">This is how hover state looks</p>
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <Label className="text-gray-900 mb-2 block">Current Palette</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div
                      className="w-full h-12 rounded border mb-1"
                      style={{ backgroundColor: globalTheme.primary }}
                    />
                    <span className="text-xs text-gray-600">Primary</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-full h-12 rounded border mb-1"
                      style={{ backgroundColor: globalTheme.secondary }}
                    />
                    <span className="text-xs text-gray-600">Secondary</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-full h-12 rounded border mb-1"
                      style={{ backgroundColor: globalTheme.background }}
                    />
                    <span className="text-xs text-gray-600">Background</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
