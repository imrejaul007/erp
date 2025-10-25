import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function seedGCCVATConfig() {
  try {
    console.log('🌍 SEEDING GCC VAT CONFIGURATIONS\n');
    console.log('='.repeat(80));

    // Check if already seeded
    const existing = await prisma.gcc_vat_config.count();
    if (existing > 0) {
      console.log(`\n⚠️  ${existing} VAT configurations already exist.`);
      console.log('   Skipping to avoid duplicates.');
      console.log('\n='.repeat(80));
      return;
    }

    const configs = [
      {
        id: 'gcc-vat-uae',
        country: 'UAE',
        countryName: 'United Arab Emirates',
        taxAuthority: 'Federal Tax Authority (FTA)',
        standardRate: 5,
        reducedRates: { tourism: 0, healthcare: 0, education: 0 },
        filingFrequency: 'Quarterly',
        returnFormat: 'VAT 201',
        apiEndpoint: 'https://eservices.tax.gov.ae',
        isActive: true,
        effectiveFrom: new Date('2018-01-01'),
        notes: 'UAE introduced VAT on January 1, 2018 at 5%. Quarterly filing for most businesses.',
        updatedAt: new Date()
      },
      {
        id: 'gcc-vat-saudi',
        country: 'SAUDI_ARABIA',
        countryName: 'Saudi Arabia',
        taxAuthority: 'Zakat, Tax and Customs Authority (ZATCA)',
        standardRate: 15,
        reducedRates: { residential: 0, healthcare: 0, education: 0 },
        filingFrequency: 'Monthly',
        returnFormat: 'VAT Return',
        apiEndpoint: 'https://zatca.gov.sa',
        isActive: true,
        effectiveFrom: new Date('2020-07-01'),
        notes: 'Saudi Arabia increased VAT from 5% to 15% on July 1, 2020. Monthly filing required.',
        updatedAt: new Date()
      },
      {
        id: 'gcc-vat-bahrain',
        country: 'BAHRAIN',
        countryName: 'Bahrain',
        taxAuthority: 'National Bureau for Revenue (NBR)',
        standardRate: 10,
        reducedRates: { healthcare: 0, education: 0, transportation: 0 },
        filingFrequency: 'Quarterly',
        returnFormat: 'VAT Return',
        apiEndpoint: 'https://www.nbr.gov.bh',
        isActive: true,
        effectiveFrom: new Date('2019-01-01'),
        notes: 'Bahrain implemented VAT on January 1, 2019 at 5%, increased to 10% on January 1, 2022.',
        updatedAt: new Date()
      },
      {
        id: 'gcc-vat-oman',
        country: 'OMAN',
        countryName: 'Oman',
        taxAuthority: 'Tax Authority (TA)',
        standardRate: 5,
        reducedRates: { healthcare: 0, education: 0, basic_food: 0 },
        filingFrequency: 'Quarterly',
        returnFormat: 'VAT Return',
        apiEndpoint: 'https://tms.taxoman.gov.om',
        isActive: true,
        effectiveFrom: new Date('2021-04-16'),
        notes: 'Oman introduced VAT on April 16, 2021 at 5%. Quarterly filing for most businesses.',
        updatedAt: new Date()
      },
      {
        id: 'gcc-vat-qatar',
        country: 'QATAR',
        countryName: 'Qatar',
        taxAuthority: 'General Tax Authority (GTA)',
        standardRate: 0,
        reducedRates: {},
        filingFrequency: 'Not Applicable',
        returnFormat: 'Not Implemented',
        apiEndpoint: null,
        isActive: false,
        effectiveFrom: new Date('2025-01-01'),
        notes: 'Qatar has not yet implemented VAT. Expected implementation date TBD.',
        updatedAt: new Date()
      },
      {
        id: 'gcc-vat-kuwait',
        country: 'KUWAIT',
        countryName: 'Kuwait',
        taxAuthority: 'Ministry of Finance',
        standardRate: 0,
        reducedRates: {},
        filingFrequency: 'Not Applicable',
        returnFormat: 'Not Implemented',
        apiEndpoint: null,
        isActive: false,
        effectiveFrom: new Date('2025-01-01'),
        notes: 'Kuwait has not yet implemented VAT. Expected implementation date TBD.',
        updatedAt: new Date()
      }
    ];

    console.log(`\n🔄 Creating ${configs.length} GCC VAT configurations...\n`);

    for (const config of configs) {
      await prisma.gcc_vat_config.create({ data: config });

      const status = config.isActive ? '✅ ACTIVE' : '⚠️  PENDING';
      console.log(`${status} ${config.countryName}`);
      console.log(`   Authority: ${config.taxAuthority}`);
      console.log(`   Standard Rate: ${config.standardRate}%`);
      console.log(`   Filing: ${config.filingFrequency}`);
      console.log(`   Format: ${config.returnFormat}`);
      console.log(`   Effective From: ${config.effectiveFrom.toLocaleDateString()}`);
      console.log('');
    }

    const finalCount = await prisma.gcc_vat_config.count();

    console.log('='.repeat(80));
    console.log(`\n✅ SUCCESS! Created ${finalCount} GCC VAT configurations\n`);

    console.log('📊 VAT STATUS BY COUNTRY:\n');
    console.log('✅ UAE          - 5%  VAT (Active since 2018)');
    console.log('✅ Saudi Arabia - 15% VAT (Active since 2020)');
    console.log('✅ Bahrain      - 10% VAT (Active since 2022)');
    console.log('✅ Oman         - 5%  VAT (Active since 2021)');
    console.log('⚠️  Qatar        - 0%  VAT (Not yet implemented)');
    console.log('⚠️  Kuwait       - 0%  VAT (Not yet implemented)');

    console.log('\n💡 WHAT YOU CAN DO NOW:\n');
    console.log('✅ Generate VAT returns for UAE (quarterly)');
    console.log('✅ Generate VAT returns for Saudi Arabia (monthly)');
    console.log('✅ Generate VAT returns for Bahrain (quarterly)');
    console.log('✅ Generate VAT returns for Oman (quarterly)');
    console.log('✅ Track standard-rated, zero-rated, exempt sales');
    console.log('✅ Track imports, exports, reverse charge');
    console.log('✅ Calculate net VAT (Output VAT - Input VAT)');
    console.log('✅ Submit to tax authorities');

    console.log('\n📋 VAT RETURN FEATURES:\n');
    console.log('• Country-specific VAT rates');
    console.log('• Standard-rated sales/purchases');
    console.log('• Zero-rated transactions (exports)');
    console.log('• Exempt transactions');
    console.log('• Imports subject to VAT');
    console.log('• Reverse charge mechanism');
    console.log('• Corrections and adjustments');
    console.log('• Bad debt relief');
    console.log('• Line-by-line breakdown');
    console.log('• Submission tracking');

    console.log('\n='.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

seedGCCVATConfig();
