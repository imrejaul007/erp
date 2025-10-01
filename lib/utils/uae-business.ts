// UAE Business Utilities and Constants

import { UAEEmirate } from '@/types/store';

// UAE Business Hours and Regulations
export const UAE_BUSINESS_HOURS = {
  STANDARD: {
    weekdays: { open: '09:00', close: '22:00' },
    friday: { open: '14:00', close: '22:00' }, // After Friday prayers
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '22:00' }
  },
  MALL: {
    weekdays: { open: '10:00', close: '22:00' },
    friday: { open: '14:00', close: '22:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '22:00' }
  },
  SOUK: {
    weekdays: { open: '09:00', close: '21:00' },
    friday: { open: '15:00', close: '21:00' },
    saturday: { open: '09:00', close: '22:00' },
    sunday: { open: '09:00', close: '21:00' }
  }
};

// UAE Public Holidays affecting business operations
export const UAE_PUBLIC_HOLIDAYS_2024 = [
  { name: 'New Year\'s Day', date: '2024-01-01', type: 'fixed' },
  { name: 'Eid Al Fitr', date: '2024-04-10', type: 'lunar', duration: 3 },
  { name: 'Arafat Day', date: '2024-06-15', type: 'lunar' },
  { name: 'Eid Al Adha', date: '2024-06-16', type: 'lunar', duration: 3 },
  { name: 'Islamic New Year', date: '2024-07-07', type: 'lunar' },
  { name: 'Prophet Muhammad\'s Birthday', date: '2024-09-15', type: 'lunar' },
  { name: 'UAE National Day', date: '2024-12-02', type: 'fixed', duration: 2 },
  { name: 'UAE National Day', date: '2024-12-03', type: 'fixed', duration: 2 }
];

// Emirate-specific business information
export const EMIRATE_BUSINESS_INFO = {
  [UAEEmirate.DUBAI]: {
    name: 'Dubai',
    nameAr: 'دبي',
    economicFreeZones: ['DIFC', 'DMCC', 'DAFZA', 'JAFZA', 'Dubai Airport Free Zone'],
    keyIndustries: ['Trade', 'Tourism', 'Real Estate', 'Financial Services', 'Logistics'],
    businessLicenseAuthority: 'Dubai Economy',
    timezone: 'Asia/Dubai',
    population: 3500000,
    gdpContribution: 0.31, // 31% of UAE GDP
    averageRent: {
      retail: { min: 100, max: 500, currency: 'AED', unit: 'sqft/year' },
      office: { min: 80, max: 300, currency: 'AED', unit: 'sqft/year' }
    },
    businessCosts: {
      tradeLicense: { min: 10000, max: 50000, currency: 'AED' },
      visaFees: 3000,
      officeRental: { min: 20000, max: 200000, currency: 'AED', unit: 'year' }
    }
  },
  [UAEEmirate.ABU_DHABI]: {
    name: 'Abu Dhabi',
    nameAr: 'أبوظبي',
    economicFreeZones: ['ADGM', 'KEZAD', 'ICAD', 'Masdar City'],
    keyIndustries: ['Oil & Gas', 'Government', 'Finance', 'Manufacturing', 'Tourism'],
    businessLicenseAuthority: 'Abu Dhabi Department of Economic Development',
    timezone: 'Asia/Dubai',
    population: 1500000,
    gdpContribution: 0.56, // 56% of UAE GDP
    averageRent: {
      retail: { min: 80, max: 400, currency: 'AED', unit: 'sqft/year' },
      office: { min: 70, max: 250, currency: 'AED', unit: 'sqft/year' }
    },
    businessCosts: {
      tradeLicense: { min: 8000, max: 40000, currency: 'AED' },
      visaFees: 2800,
      officeRental: { min: 18000, max: 150000, currency: 'AED', unit: 'year' }
    }
  },
  [UAEEmirate.SHARJAH]: {
    name: 'Sharjah',
    nameAr: 'الشارقة',
    economicFreeZones: ['SAIF', 'Hamriyah Free Zone', 'Sharjah Media City'],
    keyIndustries: ['Manufacturing', 'Education', 'Culture', 'Trade', 'Logistics'],
    businessLicenseAuthority: 'Sharjah Economic Development Department',
    timezone: 'Asia/Dubai',
    population: 1400000,
    gdpContribution: 0.08, // 8% of UAE GDP
    averageRent: {
      retail: { min: 50, max: 200, currency: 'AED', unit: 'sqft/year' },
      office: { min: 40, max: 150, currency: 'AED', unit: 'sqft/year' }
    },
    businessCosts: {
      tradeLicense: { min: 5000, max: 25000, currency: 'AED' },
      visaFees: 2500,
      officeRental: { min: 12000, max: 80000, currency: 'AED', unit: 'year' }
    }
  },
  [UAEEmirate.AJMAN]: {
    name: 'Ajman',
    nameAr: 'عجمان',
    economicFreeZones: ['Ajman Free Zone'],
    keyIndustries: ['Manufacturing', 'Trade', 'Real Estate', 'Tourism'],
    businessLicenseAuthority: 'Ajman Department of Economic Development',
    timezone: 'Asia/Dubai',
    population: 500000,
    gdpContribution: 0.02, // 2% of UAE GDP
    averageRent: {
      retail: { min: 30, max: 150, currency: 'AED', unit: 'sqft/year' },
      office: { min: 25, max: 100, currency: 'AED', unit: 'sqft/year' }
    },
    businessCosts: {
      tradeLicense: { min: 3000, max: 15000, currency: 'AED' },
      visaFees: 2200,
      officeRental: { min: 8000, max: 50000, currency: 'AED', unit: 'year' }
    }
  },
  [UAEEmirate.RAS_AL_KHAIMAH]: {
    name: 'Ras Al Khaimah',
    nameAr: 'رأس الخيمة',
    economicFreeZones: ['RAK Free Trade Zone', 'RAK Maritime City'],
    keyIndustries: ['Manufacturing', 'Tourism', 'Trade', 'Ceramics', 'Pharmaceuticals'],
    businessLicenseAuthority: 'RAK Economic Zone',
    timezone: 'Asia/Dubai',
    population: 400000,
    gdpContribution: 0.02, // 2% of UAE GDP
    averageRent: {
      retail: { min: 25, max: 120, currency: 'AED', unit: 'sqft/year' },
      office: { min: 20, max: 80, currency: 'AED', unit: 'sqft/year' }
    },
    businessCosts: {
      tradeLicense: { min: 3000, max: 12000, currency: 'AED' },
      visaFees: 2000,
      officeRental: { min: 6000, max: 40000, currency: 'AED', unit: 'year' }
    }
  },
  [UAEEmirate.FUJAIRAH]: {
    name: 'Fujairah',
    nameAr: 'الفجيرة',
    economicFreeZones: ['Fujairah Free Zone', 'Creative City'],
    keyIndustries: ['Trade', 'Tourism', 'Agriculture', 'Mining'],
    businessLicenseAuthority: 'Fujairah Free Zone Authority',
    timezone: 'Asia/Dubai',
    population: 250000,
    gdpContribution: 0.01, // 1% of UAE GDP
    averageRent: {
      retail: { min: 20, max: 100, currency: 'AED', unit: 'sqft/year' },
      office: { min: 18, max: 70, currency: 'AED', unit: 'sqft/year' }
    },
    businessCosts: {
      tradeLicense: { min: 2500, max: 10000, currency: 'AED' },
      visaFees: 1800,
      officeRental: { min: 5000, max: 30000, currency: 'AED', unit: 'year' }
    }
  },
  [UAEEmirate.UMM_AL_QUWAIN]: {
    name: 'Umm Al Quwain',
    nameAr: 'أم القيوين',
    economicFreeZones: ['UAQ Free Trade Zone'],
    keyIndustries: ['Manufacturing', 'Agriculture', 'Fishing', 'Tourism'],
    businessLicenseAuthority: 'UAQ Free Trade Zone',
    timezone: 'Asia/Dubai',
    population: 80000,
    gdpContribution: 0.005, // 0.5% of UAE GDP
    averageRent: {
      retail: { min: 15, max: 80, currency: 'AED', unit: 'sqft/year' },
      office: { min: 12, max: 50, currency: 'AED', unit: 'sqft/year' }
    },
    businessCosts: {
      tradeLicense: { min: 2000, max: 8000, currency: 'AED' },
      visaFees: 1500,
      officeRental: { min: 4000, max: 25000, currency: 'AED', unit: 'year' }
    }
  }
};

// Cultural and business considerations
export const UAE_BUSINESS_CULTURE = {
  workWeek: {
    start: 'Sunday',
    end: 'Thursday',
    weekend: ['Friday', 'Saturday']
  },
  prayerTimes: {
    fajr: '05:30',
    dhuhr: '12:15',
    asr: '15:45',
    maghrib: '18:00',
    isha: '19:30'
  },
  ramadanConsiderations: {
    reducedHours: true,
    businessAdjustment: 'Many businesses operate reduced hours during Ramadan',
    iftarTiming: '18:00-20:00', // Approximate
    specialOffers: 'Common to have Ramadan and Eid special offers'
  },
  businessEtiquette: {
    greetings: ['As-salaam alaikum', 'Marhaba', 'Ahlan wa sahlan'],
    businessCards: 'Use both hands when exchanging business cards',
    dress: 'Conservative business attire recommended',
    meetings: 'Punctuality is important, but flexibility is understood'
  }
};

// Market intelligence and demographics
export const UAE_MARKET_INTELLIGENCE = {
  perfumeMarketSize: {
    value: 2.3, // Billion USD
    growth: 8.5, // Annual growth rate %
    keySegments: ['Arabic/Oud', 'Western fragrances', 'Niche brands', 'Celebrity fragrances']
  },
  consumerBehavior: {
    averageSpending: {
      luxury: { min: 1000, max: 5000, currency: 'AED', period: 'month' },
      premium: { min: 500, max: 1500, currency: 'AED', period: 'month' },
      massMarket: { min: 100, max: 500, currency: 'AED', period: 'month' }
    },
    peakSeasons: [
      { name: 'Ramadan & Eid', months: [3, 4, 5], boost: 40 },
      { name: 'National Day', months: [12], boost: 25 },
      { name: 'Wedding Season', months: [10, 11, 12, 1, 2], boost: 30 }
    ],
    preferredChannels: ['Malls', 'Online', 'Traditional souks', 'Specialty stores']
  },
  demographics: {
    population: {
      total: 10200000,
      expats: 0.89, // 89% expatriates
      nationals: 0.11 // 11% Emiratis
    },
    ageGroups: {
      '18-34': 0.45, // 45% millennials/Gen Z
      '35-54': 0.35, // 35% Gen X
      '55+': 0.20 // 20% Baby Boomers+
    },
    incomeDistribution: {
      high: { percentage: 0.30, threshold: 20000 }, // AED monthly
      middle: { percentage: 0.50, threshold: 8000 },
      lower: { percentage: 0.20, threshold: 3000 }
    }
  }
};

// Utility functions for UAE business operations
export const UAEBusinessUtils = {
  // Convert Gregorian to Hijri (approximate)
  getHijriDate: (gregorianDate: Date): string => {
    const hijriYear = gregorianDate.getFullYear() - 579;
    const hijriMonth = gregorianDate.getMonth() + 1;
    const hijriDay = gregorianDate.getDate();
    return `${hijriDay}/${hijriMonth}/${hijriYear} H`;
  },

  // Check if date is a public holiday
  isPublicHoliday: (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return UAE_PUBLIC_HOLIDAYS_2024.some(holiday => holiday.date === dateStr);
  },

  // Get next prayer time
  getNextPrayerTime: (): { name: string; time: string } => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const prayers = [
      { name: 'Fajr', time: UAE_BUSINESS_CULTURE.prayerTimes.fajr },
      { name: 'Dhuhr', time: UAE_BUSINESS_CULTURE.prayerTimes.dhuhr },
      { name: 'Asr', time: UAE_BUSINESS_CULTURE.prayerTimes.asr },
      { name: 'Maghrib', time: UAE_BUSINESS_CULTURE.prayerTimes.maghrib },
      { name: 'Isha', time: UAE_BUSINESS_CULTURE.prayerTimes.isha }
    ];

    for (const prayer of prayers) {
      if (currentTime < prayer.time) {
        return prayer;
      }
    }

    // If past Isha, next prayer is tomorrow's Fajr
    return prayers[0];
  },

  // Calculate business costs for emirate
  getBusinessCosts: (emirate: UAEEmirate, businessType: 'retail' | 'office' = 'retail') => {
    const emirateInfo = EMIRATE_BUSINESS_INFO[emirate];
    return {
      ...emirateInfo.businessCosts,
      averageRent: emirateInfo.averageRent[businessType]
    };
  },

  // Get optimal business hours for location type
  getOptimalHours: (locationType: 'STANDARD' | 'MALL' | 'SOUK' = 'STANDARD') => {
    return UAE_BUSINESS_HOURS[locationType];
  },

  // Check if Ramadan period (approximate)
  isRamadanPeriod: (date: Date): boolean => {
    // This is approximate - in real implementation, use proper Islamic calendar
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Ramadan 2024 approximate dates (March 11 - April 9)
    if (year === 2024) {
      return (month === 3 && date.getDate() >= 11) || (month === 4 && date.getDate() <= 9);
    }

    return false;
  },

  // Get market intelligence for product category
  getMarketIntelligence: (category: 'luxury' | 'premium' | 'massMarket' = 'premium') => {
    return {
      ...UAE_MARKET_INTELLIGENCE.consumerBehavior.averageSpending[category],
      peakSeasons: UAE_MARKET_INTELLIGENCE.consumerBehavior.peakSeasons,
      marketSize: UAE_MARKET_INTELLIGENCE.perfumeMarketSize
    };
  },

  // Format currency in UAE format
  formatUAECurrency: (amount: number, includeDecimals: boolean = true): string => {
    const formatted = new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0
    }).format(amount);

    return formatted;
  },

  // Get business license requirements
  getLicenseRequirements: (emirate: UAEEmirate, businessType: 'trading' | 'service' | 'manufacturing' = 'trading') => {
    const emirateInfo = EMIRATE_BUSINESS_INFO[emirate];

    return {
      authority: emirateInfo.businessLicenseAuthority,
      estimatedCost: emirateInfo.businessCosts.tradeLicense,
      requiredDocuments: [
        'Passport copies of shareholders',
        'UAE residence visa',
        'No objection certificate (if employed)',
        'Memorandum of Association',
        'Office lease agreement',
        'Initial approval certificate'
      ],
      processingTime: '7-14 working days',
      freeZones: emirateInfo.economicFreeZones
    };
  }
};