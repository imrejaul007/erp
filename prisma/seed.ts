import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create default branding
  console.log('📝 Creating default branding...');
  const branding = await prisma.branding.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'Oud & Perfume ERP',
      companyNameAr: 'نظام إدارة العود والعطور',
      tagline: 'Luxury Fragrance Management System',
      taglineAr: 'نظام إدارة العطور الفاخرة',
      primaryColor: '#d97706',
      primaryHover: '#b45309',
      accentColor: '#92400e',
      bgLight: '#fffbeb',
      bgDark: '#1f2937',
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      textLight: '#ffffff',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: 'medium',
      sidebarStyle: 'light',
      headerStyle: 'light',
      borderRadius: 'medium',
      email: 'info@oudperfume.ae',
      phone: '+971 4 123 4567',
      whatsapp: '+971 50 123 4567',
      country: 'UAE',
      currency: 'AED',
      currencySymbol: 'AED',
      currencyPosition: 'before',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      invoicePrefix: 'INV',
      receiptPrefix: 'RCP',
      orderPrefix: 'ORD',
      invoiceFooter: 'Thank you for your business!',
      invoiceFooterAr: 'شكرا لك على عملك!',
      decimalPlaces: 2,
      showWhatsapp: true,
      showSocial: true,
      showVatNumber: true,
      showCompanyInfo: true,
    },
  });
  console.log('✅ Branding created');

  // 2. Create Permissions
  console.log('📝 Creating permissions...');
  const permissions = await Promise.all([
    // Inventory permissions
    prisma.permission.upsert({
      where: { name: 'inventory:create' },
      update: {},
      create: { name: 'inventory:create', description: 'Create inventory items', module: 'inventory', action: 'create' },
    }),
    prisma.permission.upsert({
      where: { name: 'inventory:read' },
      update: {},
      create: { name: 'inventory:read', description: 'View inventory', module: 'inventory', action: 'read' },
    }),
    prisma.permission.upsert({
      where: { name: 'inventory:update' },
      update: {},
      create: { name: 'inventory:update', description: 'Update inventory', module: 'inventory', action: 'update' },
    }),
    prisma.permission.upsert({
      where: { name: 'inventory:delete' },
      update: {},
      create: { name: 'inventory:delete', description: 'Delete inventory', module: 'inventory', action: 'delete' },
    }),
    // Sales permissions
    prisma.permission.upsert({
      where: { name: 'sales:create' },
      update: {},
      create: { name: 'sales:create', description: 'Create sales', module: 'sales', action: 'create' },
    }),
    prisma.permission.upsert({
      where: { name: 'sales:read' },
      update: {},
      create: { name: 'sales:read', description: 'View sales', module: 'sales', action: 'read' },
    }),
    // Finance permissions
    prisma.permission.upsert({
      where: { name: 'finance:read' },
      update: {},
      create: { name: 'finance:read', description: 'View finance', module: 'finance', action: 'read' },
    }),
    prisma.permission.upsert({
      where: { name: 'finance:manage' },
      update: {},
      create: { name: 'finance:manage', description: 'Manage finance', module: 'finance', action: 'manage' },
    }),
    // Production permissions
    prisma.permission.upsert({
      where: { name: 'production:create' },
      update: {},
      create: { name: 'production:create', description: 'Create production batches', module: 'production', action: 'create' },
    }),
    prisma.permission.upsert({
      where: { name: 'production:read' },
      update: {},
      create: { name: 'production:read', description: 'View production', module: 'production', action: 'read' },
    }),
  ]);
  console.log(`✅ Created ${permissions.length} permissions`);

  // 3. Create Roles
  console.log('📝 Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full system access',
      isActive: true,
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'Store manager access',
      isActive: true,
    },
  });

  const salesRole = await prisma.role.upsert({
    where: { name: 'Sales' },
    update: {},
    create: {
      name: 'Sales',
      description: 'Sales staff access',
      isActive: true,
    },
  });

  const inventoryRole = await prisma.role.upsert({
    where: { name: 'Inventory' },
    update: {},
    create: {
      name: 'Inventory',
      description: 'Inventory management access',
      isActive: true,
    },
  });
  console.log('✅ Created 4 roles');

  // 4. Assign permissions to roles
  console.log('📝 Assigning permissions to roles...');
  // Admin gets all permissions
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log('✅ Permissions assigned');

  // 5. Create default admin user
  console.log('📝 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@oudperfume.ae' },
    update: {},
    create: {
      email: 'admin@oudperfume.ae',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+971501234567',
      isActive: true,
      language: 'en',
      timezone: 'Asia/Dubai',
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });
  console.log('✅ Admin user created (email: admin@oudperfume.ae, password: admin123)');

  // 6. Create default store
  console.log('📝 Creating default store...');
  const mainStore = await prisma.store.upsert({
    where: { code: 'MAIN-001' },
    update: {},
    create: {
      code: 'MAIN-001',
      name: 'Main Store - Dubai',
      nameAr: 'المتجر الرئيسي - دبي',
      address: 'Sheikh Zayed Road',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'UAE',
      phone: '+971 4 123 4567',
      email: 'dubai@oudperfume.ae',
      isActive: true,
      isWarehouse: false,
    },
  });

  const warehouse = await prisma.store.upsert({
    where: { code: 'WH-001' },
    update: {},
    create: {
      code: 'WH-001',
      name: 'Main Warehouse',
      nameAr: 'المستودع الرئيسي',
      address: 'Dubai Industrial Area',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'UAE',
      phone: '+971 4 123 4568',
      email: 'warehouse@oudperfume.ae',
      isActive: true,
      isWarehouse: true,
    },
  });
  console.log('✅ Created 2 stores');

  // 7. Assign user to store
  await prisma.userStore.upsert({
    where: {
      userId_storeId: {
        userId: adminUser.id,
        storeId: mainStore.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      storeId: mainStore.id,
      isDefault: true,
    },
  });

  // 8. Create sample raw materials
  console.log('📝 Creating sample raw materials...');
  const oudOil = await prisma.rawMaterial.create({
    data: {
      code: 'RM-OUD-001',
      name: 'Oud Oil - Premium',
      nameAr: 'زيت العود - ممتاز',
      description: 'Premium grade oud oil from Cambodia',
      category: 'Essential Oils',
      subcategory: 'Oud',
      baseUnit: 'grams',
      costPrice: 5000,
      currency: 'AED',
      minStockLevel: 100,
      maxStockLevel: 1000,
      isActive: true,
    },
  });

  const roseOil = await prisma.rawMaterial.create({
    data: {
      code: 'RM-ROSE-001',
      name: 'Rose Oil - Bulgarian',
      nameAr: 'زيت الورد - بلغاري',
      description: 'Bulgarian rose essential oil',
      category: 'Essential Oils',
      subcategory: 'Floral',
      baseUnit: 'ml',
      costPrice: 1200,
      currency: 'AED',
      minStockLevel: 200,
      maxStockLevel: 2000,
      isActive: true,
    },
  });

  const alcohol = await prisma.rawMaterial.create({
    data: {
      code: 'RM-ALC-001',
      name: 'Perfumer Alcohol 95%',
      nameAr: 'كحول العطور 95٪',
      description: 'High grade perfumer alcohol',
      category: 'Base Materials',
      subcategory: 'Alcohol',
      baseUnit: 'ml',
      costPrice: 50,
      currency: 'AED',
      minStockLevel: 5000,
      maxStockLevel: 20000,
      isActive: true,
    },
  });
  console.log('✅ Created 3 raw materials');

  // 9. Create sample products
  console.log('📝 Creating sample products...');
  const luxuryOud = await prisma.product.create({
    data: {
      code: 'PRD-OUD-001',
      name: 'Luxury Oud Perfume 100ml',
      nameAr: 'عطر عود فاخر 100 مل',
      description: 'Premium oud perfume with rose notes',
      category: 'Perfumes',
      subcategory: 'Oud',
      baseUnit: 'pieces',
      costPrice: 250,
      sellingPrice: 499,
      currency: 'AED',
      vatRate: 5,
      minStockLevel: 10,
      maxStockLevel: 100,
      barcode: '6291234567890',
      sku: 'OUD-LUX-100',
      isActive: true,
    },
  });

  const roseAttar = await prisma.product.create({
    data: {
      code: 'PRD-RSE-001',
      name: 'Rose Attar 12ml',
      nameAr: 'عطر الورد 12 مل',
      description: 'Traditional rose attar oil',
      category: 'Attar',
      subcategory: 'Rose',
      baseUnit: 'pieces',
      costPrice: 80,
      sellingPrice: 149,
      currency: 'AED',
      vatRate: 5,
      minStockLevel: 20,
      maxStockLevel: 200,
      barcode: '6291234567891',
      sku: 'ATR-RSE-12',
      isActive: true,
    },
  });
  console.log('✅ Created 2 products');

  // 10. Create initial inventory
  console.log('📝 Creating initial inventory...');
  await prisma.storeInventory.create({
    data: {
      storeId: warehouse.id,
      rawMaterialId: oudOil.id,
      quantity: 500,
      unit: 'grams',
    },
  });

  await prisma.storeInventory.create({
    data: {
      storeId: warehouse.id,
      rawMaterialId: roseOil.id,
      quantity: 1000,
      unit: 'ml',
    },
  });

  await prisma.storeInventory.create({
    data: {
      storeId: mainStore.id,
      productId: luxuryOud.id,
      quantity: 25,
      unit: 'pieces',
    },
  });

  await prisma.storeInventory.create({
    data: {
      storeId: mainStore.id,
      productId: roseAttar.id,
      quantity: 50,
      unit: 'pieces',
    },
  });
  console.log('✅ Created initial inventory');

  // 11. Create sample customer
  console.log('📝 Creating sample customer...');
  const customer = await prisma.customer.create({
    data: {
      customerNo: 'CUST-001',
      type: 'INDIVIDUAL',
      firstName: 'Ahmed',
      lastName: 'Al Maktoum',
      email: 'ahmed@example.ae',
      phone: '+971501234567',
      whatsapp: '+971501234567',
      gender: 'MALE',
      nationality: 'UAE',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'UAE',
      isActive: true,
      language: 'ar',
    },
  });
  console.log('✅ Created sample customer');

  // 12. Create sample supplier
  console.log('📝 Creating sample supplier...');
  const supplier = await prisma.supplier.create({
    data: {
      code: 'SUP-001',
      name: 'Cambodia Oud Suppliers Co.',
      nameAr: 'شركة موردي العود الكمبودية',
      type: 'INTERNATIONAL',
      category: 'Raw Materials',
      contactPerson: 'John Smith',
      email: 'info@cambodiaoud.com',
      phone: '+855123456789',
      country: 'Cambodia',
      city: 'Phnom Penh',
      currency: 'AED',
      paymentTerms: 'Net 30',
      leadTime: 15,
      isActive: true,
    },
  });
  console.log('✅ Created sample supplier');

  // 13. Create chart of accounts
  console.log('📝 Creating chart of accounts...');
  const assetAccount = await prisma.account.create({
    data: {
      code: '1000',
      name: 'Cash',
      nameAr: 'النقد',
      type: 'ASSET',
      currency: 'AED',
      balance: 100000,
      isActive: true,
    },
  });

  const revenueAccount = await prisma.account.create({
    data: {
      code: '4000',
      name: 'Sales Revenue',
      nameAr: 'إيرادات المبيعات',
      type: 'REVENUE',
      currency: 'AED',
      balance: 0,
      isActive: true,
    },
  });
  console.log('✅ Created 2 accounts');

  // 14. Create loyalty program
  console.log('📝 Creating loyalty program...');
  const loyaltyProgram = await prisma.loyaltyProgram.create({
    data: {
      name: 'Gold Rewards',
      nameAr: 'مكافآت الذهب',
      description: 'Earn 1 point per AED spent',
      pointsPerAED: 1,
      redemptionRate: 0.1,
      minSpendAmount: 100,
      isActive: true,
      startDate: new Date(),
    },
  });
  console.log('✅ Created loyalty program');

  console.log('✨ Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('- ✅ Default branding configured');
  console.log('- ✅ 4 roles created (Admin, Manager, Sales, Inventory)');
  console.log('- ✅ 10 permissions created');
  console.log('- ✅ Admin user: admin@oudperfume.ae / admin123');
  console.log('- ✅ 2 stores created (Main Store, Warehouse)');
  console.log('- ✅ 3 raw materials created');
  console.log('- ✅ 2 products created');
  console.log('- ✅ Initial inventory stocked');
  console.log('- ✅ Sample customer and supplier');
  console.log('- ✅ Chart of accounts initialized');
  console.log('- ✅ Loyalty program created');
  console.log('');
  console.log('🚀 You can now log in with: admin@oudperfume.ae / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
