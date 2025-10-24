import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://oud_erp_user:EnHp1devLl2Kx4RP5eSXUe09n0GGZoFu@dpg-d3f4j7mmcj7s73e2j9og-a.oregon-postgres.render.com/oud_perfume_erp"
    }
  }
});

async function addSuppliers() {
  try {
    console.log('🏭 ADDING SAMPLE SUPPLIERS\n');
    console.log('='.repeat(80));

    // Get tenant ID
    const tenant = await prisma.$queryRaw`SELECT id FROM tenants LIMIT 1`;
    if (tenant.length === 0) {
      console.log('❌ No tenant found!');
      return;
    }
    const tenantId = tenant[0].id;

    // Check existing suppliers
    const existingCount = await prisma.suppliers.count({ where: { tenantId } });
    console.log(`\nℹ️  Current suppliers: ${existingCount}`);

    if (existingCount > 0) {
      console.log('⚠️  Suppliers already exist. Skipping to avoid duplicates.');
      return;
    }

    const timestamp = Date.now();

    // Sample suppliers for perfume/oud business
    const suppliers = [
      {
        id: `supplier-${timestamp}-1`,
        code: 'SUP-001',
        name: 'Arabian Oud Suppliers LLC',
        nameAr: 'شركة موردي العود العربي',
        type: 'MANUFACTURER',
        category: 'Oud & Agarwood',
        contactPerson: 'Mohammed Al Rashid',
        email: 'contact@arabianoudsuppliers.ae',
        phone: '+971-4-3334444',
        whatsapp: '+971-50-1234567',
        website: 'https://arabianoudsuppliers.ae',
        address: 'Dubai Perfume Souk',
        city: 'Dubai',
        state: 'Dubai',
        country: 'UAE',
        postalCode: '00000',
        vatNumber: 'VAT-123456789',
        tradeNumber: 'TRN-001',
        leadTime: 7,
        minOrderValue: 5000,
        creditLimit: 50000,
        currency: 'AED',
        paymentTerms: 'Net 30',
        isPreferred: true,
        isActive: true,
        tags: ['Oud', 'Premium', 'Local'],
        notes: 'Primary supplier for high-grade Oud and Agarwood products',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: `supplier-${timestamp}-2`,
        code: 'SUP-002',
        name: 'Fragrance Essence International',
        type: 'DISTRIBUTOR',
        category: 'Essential Oils & Fragrances',
        contactPerson: 'Sarah Johnson',
        email: 'info@fragranceessence.com',
        phone: '+971-4-5556666',
        whatsapp: '+971-50-7654321',
        address: 'Jebel Ali Free Zone',
        city: 'Dubai',
        state: 'Dubai',
        country: 'UAE',
        postalCode: '00000',
        leadTime: 14,
        minOrderValue: 3000,
        creditLimit: 30000,
        currency: 'AED',
        paymentTerms: 'Net 45',
        isPreferred: true,
        isActive: true,
        tags: ['Oils', 'International', 'Wholesale'],
        notes: 'International supplier for essential oils and fragrance compounds',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: `supplier-${timestamp}-3`,
        code: 'SUP-003',
        name: 'Luxury Packaging Solutions',
        type: 'MANUFACTURER',
        category: 'Packaging & Bottles',
        contactPerson: 'Ahmed Hassan',
        email: 'sales@luxurypackaging.ae',
        phone: '+971-4-7778888',
        address: 'Sharjah Industrial Area',
        city: 'Sharjah',
        state: 'Sharjah',
        country: 'UAE',
        leadTime: 10,
        minOrderValue: 2000,
        creditLimit: 20000,
        currency: 'AED',
        paymentTerms: 'Net 30',
        isPreferred: false,
        isActive: true,
        tags: ['Packaging', 'Bottles', 'Boxes'],
        notes: 'Supplier for premium perfume bottles and luxury packaging',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: `supplier-${timestamp}-4`,
        code: 'SUP-004',
        name: 'Emirates Trading Company',
        type: 'DISTRIBUTOR',
        category: 'General Supplies',
        contactPerson: 'Ali Al Mansoori',
        email: 'info@emiratestrading.ae',
        phone: '+971-4-9990000',
        address: 'Al Quoz Industrial Area',
        city: 'Dubai',
        state: 'Dubai',
        country: 'UAE',
        leadTime: 5,
        minOrderValue: 1000,
        creditLimit: 15000,
        currency: 'AED',
        paymentTerms: 'Net 15',
        isPreferred: false,
        isActive: true,
        tags: ['Supplies', 'Fast Delivery', 'Local'],
        notes: 'General supplies and quick delivery for urgent orders',
        tenantId,
        updatedAt: new Date()
      },
      {
        id: `supplier-${timestamp}-5`,
        code: 'SUP-005',
        name: 'Asian Perfume Imports',
        type: 'INTERNATIONAL',
        category: 'Asian Fragrances',
        contactPerson: 'Li Wei',
        email: 'export@asianperfume.com',
        phone: '+86-21-12345678',
        website: 'https://asianperfume.com',
        address: 'Shanghai Trade Center',
        city: 'Shanghai',
        country: 'China',
        leadTime: 30,
        minOrderValue: 10000,
        creditLimit: 100000,
        currency: 'USD',
        paymentTerms: 'LC at Sight',
        isPreferred: false,
        isActive: true,
        tags: ['Asian', 'Import', 'Bulk'],
        notes: 'International supplier for Asian fragrances and bulk orders',
        tenantId,
        updatedAt: new Date()
      }
    ];

    console.log(`\n🔄 Creating ${suppliers.length} suppliers...\n`);

    for (const supplier of suppliers) {
      await prisma.suppliers.create({ data: supplier });
      console.log(`✅ ${supplier.name} (${supplier.code})`);
      console.log(`   Type: ${supplier.type}`);
      console.log(`   Category: ${supplier.category}`);
      console.log(`   Contact: ${supplier.contactPerson}`);
      console.log(`   Lead Time: ${supplier.leadTime} days`);
      console.log('');
    }

    // Verify count
    const finalCount = await prisma.suppliers.count({ where: { tenantId } });

    console.log('='.repeat(80));
    console.log(`\n✅ SUCCESS! Added ${finalCount} suppliers\n`);
    console.log('Supplier Summary:');
    console.log(`   • ${suppliers.filter(s => s.type === 'MANUFACTURER').length} Manufacturers`);
    console.log(`   • ${suppliers.filter(s => s.type === 'DISTRIBUTOR').length} Distributors`);
    console.log(`   • ${suppliers.filter(s => s.type === 'INTERNATIONAL').length} International`);
    console.log(`   • ${suppliers.filter(s => s.isPreferred).length} Preferred Suppliers`);

    console.log('\n📋 You can now:');
    console.log('   ✅ Create purchase orders');
    console.log('   ✅ Track supplier performance');
    console.log('   ✅ Manage procurement');
    console.log('   ✅ Place orders with vendors');

    console.log('\n='.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

addSuppliers();
