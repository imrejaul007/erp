'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Languages,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Type,
  Smartphone,
  Monitor,
  Download,
  Upload,
  FileText,
  Settings,
  Save,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Flag,
  Users,
  MessageSquare
} from 'lucide-react';

const LanguageSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Language Settings
  const [languageSettings, setLanguageSettings] = useState({
    primaryLanguage: 'en',
    secondaryLanguage: 'ar',
    defaultDirection: 'ltr',
    enableRTL: true,
    autoDetectLanguage: false,
    fallbackLanguage: 'en',
    showLanguageSwitcher: true,
    languageSwitcherPosition: 'header'
  });

  // Regional Settings
  const [regionalSettings, setRegionalSettings] = useState({
    country: 'AE',
    region: 'Dubai',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    numberFormat: '1,234.56',
    currencyDisplay: 'symbol',
    firstDayOfWeek: 'sunday'
  });

  // Available Languages
  const [availableLanguages, setAvailableLanguages] = useState([
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      region: 'United States',
      flag: '🇺🇸',
      translationProgress: 100,
      isActive: true,
      isDefault: true,
      lastUpdated: '2024-03-15'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      direction: 'rtl',
      region: 'United Arab Emirates',
      flag: '🇦🇪',
      translationProgress: 98,
      isActive: true,
      isDefault: false,
      lastUpdated: '2024-03-14'
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      direction: 'ltr',
      region: 'France',
      flag: '🇫🇷',
      translationProgress: 85,
      isActive: false,
      isDefault: false,
      lastUpdated: '2024-03-10'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      direction: 'ltr',
      region: 'India',
      flag: '🇮🇳',
      translationProgress: 65,
      isActive: false,
      isDefault: false,
      lastUpdated: '2024-03-08'
    },
    {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      direction: 'rtl',
      region: 'Pakistan',
      flag: '🇵🇰',
      translationProgress: 45,
      isActive: false,
      isDefault: false,
      lastUpdated: '2024-03-05'
    }
  ]);

  // Translation Modules
  const [translationModules, setTranslationModules] = useState([
    {
      id: 'pos',
      name: 'Point of Sale',
      description: 'POS interface, receipts, and transaction messages',
      keyCount: 486,
      translated: {
        en: 486,
        ar: 480,
        fr: 412,
        hi: 315,
        ur: 218
      },
      priority: 'high',
      lastUpdated: '2024-03-15'
    },
    {
      id: 'inventory',
      name: 'Inventory Management',
      description: 'Product catalogs, stock management, and reports',
      keyCount: 324,
      translated: {
        en: 324,
        ar: 318,
        fr: 276,
        hi: 210,
        ur: 146
      },
      priority: 'high',
      lastUpdated: '2024-03-14'
    },
    {
      id: 'customers',
      name: 'Customer Management',
      description: 'Customer profiles, loyalty, and communication',
      keyCount: 256,
      translated: {
        en: 256,
        ar: 251,
        fr: 218,
        hi: 166,
        ur: 115
      },
      priority: 'medium',
      lastUpdated: '2024-03-13'
    },
    {
      id: 'reports',
      name: 'Reports & Analytics',
      description: 'Financial reports, charts, and analytics',
      keyCount: 198,
      translated: {
        en: 198,
        ar: 194,
        fr: 168,
        hi: 129,
        ur: 89
      },
      priority: 'medium',
      lastUpdated: '2024-03-12'
    },
    {
      id: 'admin',
      name: 'Administration',
      description: 'System settings, user management, and configuration',
      keyCount: 342,
      translated: {
        en: 342,
        ar: 335,
        fr: 291,
        hi: 222,
        ur: 154
      },
      priority: 'low',
      lastUpdated: '2024-03-11'
    }
  ]);

  // Date and Time Formats
  const dateFormats = [
    { value: 'DD/MM/YYYY', label: '15/03/2024 (DD/MM/YYYY)' },
    { value: 'MM/DD/YYYY', label: '03/15/2024 (MM/DD/YYYY)' },
    { value: 'YYYY-MM-DD', label: '2024-03-15 (YYYY-MM-DD)' },
    { value: 'DD MMM YYYY', label: '15 Mar 2024 (DD MMM YYYY)' },
    { value: 'MMM DD, YYYY', label: 'Mar 15, 2024 (MMM DD, YYYY)' }
  ];

  const timeFormats = [
    { value: '12', label: '3:30 PM (12-hour)' },
    { value: '24', label: '15:30 (24-hour)' }
  ];

  const numberFormats = [
    { value: '1,234.56', label: '1,234.56 (Comma thousands, dot decimal)' },
    { value: '1.234,56', label: '1.234,56 (Dot thousands, comma decimal)' },
    { value: '1 234.56', label: '1 234.56 (Space thousands, dot decimal)' },
    { value: '1٬234.56', label: '1٬234.56 (Arabic thousands separator)' }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 95) return 'bg-green-500';
    if (progress >= 80) return 'bg-blue-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTranslationProgress = (module, langCode) => {
    const translated = module.translated[langCode] || 0;
    return Math.round((translated / module.keyCount) * 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Language & Localization</h1>
            <p className="text-gray-600">Configure languages, regional settings, and translations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Translations
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Language Status Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Multi-Language Support Active</p>
              <p className="text-sm text-blue-700">
                System supports {availableLanguages.filter(l => l.isActive).length} active languages with RTL support for Arabic
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Languages
          </TabsTrigger>
          <TabsTrigger value="regional" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Regional
          </TabsTrigger>
          <TabsTrigger value="translations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Translations
          </TabsTrigger>
        </TabsList>

        {/* General Language Settings */}
        <TabsContent value="general" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language Configuration</CardTitle>
              <CardDescription>Configure primary language settings and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryLanguage">Primary Language</Label>
                  <Select
                    value={languageSettings.primaryLanguage}
                    onValueChange={(value) =>
                      setLanguageSettings(prev => ({...prev, primaryLanguage: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.filter(l => l.isActive).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name} ({lang.nativeName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="secondaryLanguage">Secondary Language</Label>
                  <Select
                    value={languageSettings.secondaryLanguage}
                    onValueChange={(value) =>
                      setLanguageSettings(prev => ({...prev, secondaryLanguage: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {availableLanguages.filter(l => l.isActive && l.code !== languageSettings.primaryLanguage).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name} ({lang.nativeName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fallbackLanguage">Fallback Language</Label>
                  <Select
                    value={languageSettings.fallbackLanguage}
                    onValueChange={(value) =>
                      setLanguageSettings(prev => ({...prev, fallbackLanguage: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.filter(l => l.isActive).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="languageSwitcherPosition">Language Switcher Position</Label>
                  <Select
                    value={languageSettings.languageSwitcherPosition}
                    onValueChange={(value) =>
                      setLanguageSettings(prev => ({...prev, languageSwitcherPosition: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="floating">Floating Button</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Options</CardTitle>
              <CardDescription>Configure how languages are displayed and behave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableRTL">Enable RTL Support</Label>
                    <p className="text-sm text-gray-600">Support right-to-left languages like Arabic</p>
                  </div>
                  <Switch
                    id="enableRTL"
                    checked={languageSettings.enableRTL}
                    onCheckedChange={(checked) =>
                      setLanguageSettings(prev => ({...prev, enableRTL: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showLanguageSwitcher">Show Language Switcher</Label>
                    <p className="text-sm text-gray-600">Display language selection option to users</p>
                  </div>
                  <Switch
                    id="showLanguageSwitcher"
                    checked={languageSettings.showLanguageSwitcher}
                    onCheckedChange={(checked) =>
                      setLanguageSettings(prev => ({...prev, showLanguageSwitcher: checked}))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoDetectLanguage">Auto-Detect Browser Language</Label>
                    <p className="text-sm text-gray-600">Automatically set language based on browser settings</p>
                  </div>
                  <Switch
                    id="autoDetectLanguage"
                    checked={languageSettings.autoDetectLanguage}
                    onCheckedChange={(checked) =>
                      setLanguageSettings(prev => ({...prev, autoDetectLanguage: checked}))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Languages */}
        <TabsContent value="languages" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Supported Languages</CardTitle>
                  <CardDescription>Manage languages available in the system</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableLanguages.map((language) => (
                  <div key={language.code} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{language.flag}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{language.name}</h3>
                            <span className="text-gray-500">({language.nativeName})</span>
                            {language.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                            {language.isActive && (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Region: {language.region}</span>
                            <span>Direction: {language.direction.toUpperCase()}</span>
                            <span>Updated: {language.lastUpdated}</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">Translation Progress:</span>
                              <span className="text-sm">{language.translationProgress}%</span>
                            </div>
                            <Progress
                              value={language.translationProgress}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={language.isActive}
                          onCheckedChange={(checked) => {
                            // Update language active status
                            console.log(`Setting ${language.code} active: ${checked}`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Settings */}
        <TabsContent value="regional" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Configuration</CardTitle>
              <CardDescription>Configure regional settings for UAE operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={regionalSettings.country}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, country: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AE">🇦🇪 United Arab Emirates</SelectItem>
                      <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                      <SelectItem value="KW">🇰🇼 Kuwait</SelectItem>
                      <SelectItem value="QA">🇶🇦 Qatar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">Region/Emirate</Label>
                  <Select
                    value={regionalSettings.region}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, region: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Ajman">Ajman</SelectItem>
                      <SelectItem value="Fujairah">Fujairah</SelectItem>
                      <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                      <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={regionalSettings.timezone}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, timezone: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (UAE Standard Time)</SelectItem>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh (Arabia Standard Time)</SelectItem>
                      <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="firstDayOfWeek">First Day of Week</Label>
                  <Select
                    value={regionalSettings.firstDayOfWeek}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, firstDayOfWeek: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Format Settings</CardTitle>
              <CardDescription>Configure date, time, and number formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={regionalSettings.dateFormat}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, dateFormat: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={regionalSettings.timeFormat}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, timeFormat: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numberFormat">Number Format</Label>
                  <Select
                    value={regionalSettings.numberFormat}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, numberFormat: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {numberFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currencyDisplay">Currency Display</Label>
                  <Select
                    value={regionalSettings.currencyDisplay}
                    onValueChange={(value) =>
                      setRegionalSettings(prev => ({...prev, currencyDisplay: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="symbol">AED 100.00 (Symbol)</SelectItem>
                      <SelectItem value="code">100.00 AED (Code)</SelectItem>
                      <SelectItem value="name">100.00 Dirham (Name)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Translation Management */}
        <TabsContent value="translations" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Translation Modules</CardTitle>
                  <CardDescription>Manage translations for different system modules</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All
                  </Button>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {translationModules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{module.name}</h3>
                          <Badge className={getPriorityColor(module.priority)}>
                            {module.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                        <div className="text-sm text-gray-500 mb-3">
                          {module.keyCount} translation keys • Last updated: {module.lastUpdated}
                        </div>

                        {/* Translation Progress for Each Language */}
                        <div className="space-y-2">
                          {availableLanguages.filter(l => l.isActive).map((lang) => {
                            const progress = getTranslationProgress(module, lang.code);
                            return (
                              <div key={lang.code} className="flex items-center gap-3">
                                <div className="w-24 text-sm">{lang.flag} {lang.name}</div>
                                <div className="flex-1">
                                  <Progress
                                    value={progress}
                                    className="h-2"
                                  />
                                </div>
                                <div className="w-16 text-sm text-right">
                                  {module.translated[lang.code] || 0}/{module.keyCount}
                                </div>
                                <div className="w-12 text-sm text-right font-medium">
                                  {progress}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Translation Tools</CardTitle>
              <CardDescription>Tools for managing translations and localization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Translation Editor</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Edit translations directly in the system</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Open Editor
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Export Translations</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Export translations to CSV or JSON</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Export All
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="h-5 w-5 text-orange-600" />
                    <h4 className="font-medium">Import Translations</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Import translations from external files</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Import Files
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Auto-Translate</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Automatically translate missing keys</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Start Translation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageSettingsPage;