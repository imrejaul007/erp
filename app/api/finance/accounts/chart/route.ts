import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Chart of Accounts schema
const accountSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(255),
  nameAr: z.string().optional(),
  type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']),
  parentId: z.string().optional(),
  currency: z.string().default('AED'),
  description: z.string().optional(),
  isControlAccount: z.boolean().default(false),
  allowPosting: z.boolean().default(true),
});

// Get Chart of Accounts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const parentId = searchParams.get('parentId');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const hierarchical = searchParams.get('hierarchical') === 'true';

    const whereClause: any = {};

    if (type) {
      whereClause.type = type;
    }

    if (parentId) {
      whereClause.parentId = parentId;
    } else if (hierarchical) {
      whereClause.parentId = null; // Get root accounts for hierarchical view
    }

    if (!includeInactive) {
      whereClause.isActive = true;
    }

    let accounts;

    if (hierarchical) {
      // Get accounts with their children in hierarchical structure
      accounts = await getAccountsHierarchy(whereClause);
    } else {
      // Get flat list of accounts
      accounts = await prisma.account.findMany({
        where: whereClause,
        include: {
          parent: true,
          children: true,
        },
        orderBy: [
          { type: 'asc' },
          { code: 'asc' },
        ],
      });
    }

    // Calculate balances for each account
    const accountsWithBalances = await Promise.all(
      accounts.map(async (account) => {
        const balance = await calculateAccountBalance(account.id);
        return {
          ...account,
          balance,
          level: await getAccountLevel(account.id),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: accountsWithBalances,
    });
  } catch (error) {
    console.error('Chart of Accounts GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chart of accounts' },
      { status: 500 }
    );
  }
}

// Create new account
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = accountSchema.parse(body);

    // Check if account code already exists
    const existingAccount = await prisma.account.findUnique({
      where: { code: validatedData.code },
    });

    if (existingAccount) {
      return NextResponse.json(
        { success: false, error: 'Account code already exists' },
        { status: 400 }
      );
    }

    // Validate parent account exists if provided
    if (validatedData.parentId) {
      const parentAccount = await prisma.account.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentAccount) {
        return NextResponse.json(
          { success: false, error: 'Parent account not found' },
          { status: 400 }
        );
      }

      // Validate account type consistency with parent
      if (parentAccount.type !== validatedData.type) {
        return NextResponse.json(
          { success: false, error: 'Account type must match parent account type' },
          { status: 400 }
        );
      }
    }

    // Create the account
    const newAccount = await prisma.account.create({
      data: {
        ...validatedData,
        balance: 0,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newAccount,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Chart of Accounts POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

// Update account
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Validate the account exists
    const existingAccount = await prisma.account.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Check if account has transactions before allowing type change
    if (updateData.type && updateData.type !== existingAccount.type) {
      const hasTransactions = await prisma.transaction.count({
        where: { accountId: id },
      });

      if (hasTransactions > 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot change account type - account has transactions' },
          { status: 400 }
        );
      }
    }

    // Validate updated data
    const validatedData = accountSchema.partial().parse(updateData);

    // Update the account
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: validatedData,
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedAccount,
      message: 'Account updated successfully',
    });
  } catch (error) {
    console.error('Chart of Accounts PUT error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getAccountsHierarchy(whereClause: any) {
  const rootAccounts = await prisma.account.findMany({
    where: {
      ...whereClause,
      parentId: null,
    },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: true, // Support up to 4 levels deep
            },
          },
        },
      },
    },
    orderBy: [
      { type: 'asc' },
      { code: 'asc' },
    ],
  });

  return rootAccounts;
}

async function calculateAccountBalance(accountId: string): Promise<number> {
  const transactions = await prisma.transaction.findMany({
    where: {
      accountId,
      status: 'COMPLETED',
    },
  });

  let balance = 0;
  transactions.forEach(transaction => {
    if (transaction.type === 'DEBIT') {
      balance += Number(transaction.amount);
    } else {
      balance -= Number(transaction.amount);
    }
  });

  return balance;
}

async function getAccountLevel(accountId: string): Promise<number> {
  let level = 0;
  let currentAccountId = accountId;

  while (currentAccountId) {
    const account = await prisma.account.findUnique({
      where: { id: currentAccountId },
      select: { parentId: true },
    });

    if (!account?.parentId) {
      break;
    }

    level++;
    currentAccountId = account.parentId;
  }

  return level;
}

// Initialize UAE Standard Chart of Accounts
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if chart of accounts already exists
    const existingAccounts = await prisma.account.count();
    if (existingAccounts > 0) {
      return NextResponse.json(
        { success: false, error: 'Chart of accounts already exists' },
        { status: 400 }
      );
    }

    // UAE Standard Chart of Accounts
    const uaeStandardAccounts = [
      // ASSETS
      { code: '1000', name: 'ASSETS', nameAr: 'الأصول', type: 'ASSET', isControlAccount: true, allowPosting: false },
      { code: '1100', name: 'Current Assets', nameAr: 'الأصول المتداولة', type: 'ASSET', parentCode: '1000', isControlAccount: true, allowPosting: false },
      { code: '1110', name: 'Cash in Hand', nameAr: 'النقد في الصندوق', type: 'ASSET', parentCode: '1100' },
      { code: '1120', name: 'Bank Accounts', nameAr: 'الحسابات البنكية', type: 'ASSET', parentCode: '1100' },
      { code: '1130', name: 'Accounts Receivable', nameAr: 'الذمم المدينة', type: 'ASSET', parentCode: '1100' },
      { code: '1140', name: 'Inventory - Raw Materials', nameAr: 'المخزون - المواد الخام', type: 'ASSET', parentCode: '1100' },
      { code: '1150', name: 'Inventory - Finished Goods', nameAr: 'المخزون - البضائع الجاهزة', type: 'ASSET', parentCode: '1100' },
      { code: '1160', name: 'Prepaid Expenses', nameAr: 'المصروفات المدفوعة مقدماً', type: 'ASSET', parentCode: '1100' },
      { code: '1170', name: 'VAT Recoverable', nameAr: 'ضريبة القيمة المضافة القابلة للاسترداد', type: 'ASSET', parentCode: '1100' },

      { code: '1200', name: 'Fixed Assets', nameAr: 'الأصول الثابتة', type: 'ASSET', parentCode: '1000', isControlAccount: true, allowPosting: false },
      { code: '1210', name: 'Property, Plant & Equipment', nameAr: 'الممتلكات والمصانع والمعدات', type: 'ASSET', parentCode: '1200' },
      { code: '1220', name: 'Accumulated Depreciation', nameAr: 'مجمع الإهلاك', type: 'ASSET', parentCode: '1200' },

      // LIABILITIES
      { code: '2000', name: 'LIABILITIES', nameAr: 'الخصوم', type: 'LIABILITY', isControlAccount: true, allowPosting: false },
      { code: '2100', name: 'Current Liabilities', nameAr: 'الخصوم المتداولة', type: 'LIABILITY', parentCode: '2000', isControlAccount: true, allowPosting: false },
      { code: '2110', name: 'Accounts Payable', nameAr: 'الذمم الدائنة', type: 'LIABILITY', parentCode: '2100' },
      { code: '2120', name: 'VAT Payable', nameAr: 'ضريبة القيمة المضافة المستحقة', type: 'LIABILITY', parentCode: '2100' },
      { code: '2130', name: 'Accrued Expenses', nameAr: 'المصروفات المستحقة', type: 'LIABILITY', parentCode: '2100' },
      { code: '2140', name: 'Short-term Loans', nameAr: 'القروض قصيرة الأجل', type: 'LIABILITY', parentCode: '2100' },

      { code: '2200', name: 'Long-term Liabilities', nameAr: 'الخصوم طويلة الأجل', type: 'LIABILITY', parentCode: '2000', isControlAccount: true, allowPosting: false },
      { code: '2210', name: 'Long-term Loans', nameAr: 'القروض طويلة الأجل', type: 'LIABILITY', parentCode: '2200' },

      // EQUITY
      { code: '3000', name: 'EQUITY', nameAr: 'حقوق الملكية', type: 'EQUITY', isControlAccount: true, allowPosting: false },
      { code: '3100', name: 'Share Capital', nameAr: 'رأس المال', type: 'EQUITY', parentCode: '3000' },
      { code: '3200', name: 'Retained Earnings', nameAr: 'الأرباح المحتجزة', type: 'EQUITY', parentCode: '3000' },
      { code: '3300', name: 'Current Year Profit/Loss', nameAr: 'ربح/خسارة العام الحالي', type: 'EQUITY', parentCode: '3000' },

      // REVENUE
      { code: '4000', name: 'REVENUE', nameAr: 'الإيرادات', type: 'REVENUE', isControlAccount: true, allowPosting: false },
      { code: '4100', name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', type: 'REVENUE', parentCode: '4000' },
      { code: '4110', name: 'Perfume Sales', nameAr: 'مبيعات العطور', type: 'REVENUE', parentCode: '4100' },
      { code: '4120', name: 'Oud Sales', nameAr: 'مبيعات العود', type: 'REVENUE', parentCode: '4100' },
      { code: '4200', name: 'Other Income', nameAr: 'إيرادات أخرى', type: 'REVENUE', parentCode: '4000' },

      // EXPENSES
      { code: '5000', name: 'COST OF GOODS SOLD', nameAr: 'تكلفة البضائع المباعة', type: 'EXPENSE', isControlAccount: true, allowPosting: false },
      { code: '5100', name: 'Raw Material Costs', nameAr: 'تكاليف المواد الخام', type: 'EXPENSE', parentCode: '5000' },
      { code: '5200', name: 'Direct Labor', nameAr: 'العمالة المباشرة', type: 'EXPENSE', parentCode: '5000' },
      { code: '5300', name: 'Manufacturing Overhead', nameAr: 'تكاليف التصنيع العامة', type: 'EXPENSE', parentCode: '5000' },

      { code: '6000', name: 'OPERATING EXPENSES', nameAr: 'المصروفات التشغيلية', type: 'EXPENSE', isControlAccount: true, allowPosting: false },
      { code: '6100', name: 'Selling Expenses', nameAr: 'مصروفات البيع', type: 'EXPENSE', parentCode: '6000' },
      { code: '6200', name: 'Administrative Expenses', nameAr: 'المصروفات الإدارية', type: 'EXPENSE', parentCode: '6000' },
      { code: '6300', name: 'Rent Expense', nameAr: 'مصروف الإيجار', type: 'EXPENSE', parentCode: '6200' },
      { code: '6400', name: 'Utilities', nameAr: 'المرافق', type: 'EXPENSE', parentCode: '6200' },
      { code: '6500', name: 'Depreciation Expense', nameAr: 'مصروف الإهلاك', type: 'EXPENSE', parentCode: '6200' },
    ];

    // Create accounts with proper parent relationships
    const createdAccounts: Record<string, string> = {};

    // First pass: Create accounts without parents
    for (const accountData of uaeStandardAccounts) {
      if (!accountData.parentCode) {
        const account = await prisma.account.create({
          data: {
            code: accountData.code,
            name: accountData.name,
            nameAr: accountData.nameAr,
            type: accountData.type as any,
            currency: 'AED',
            balance: 0,
            isActive: true,
            allowPosting: accountData.allowPosting !== false,
          } as any,
        });
        createdAccounts[accountData.code] = account.id;
      }
    }

    // Second pass: Create accounts with parents
    for (const accountData of uaeStandardAccounts) {
      if (accountData.parentCode) {
        const parentId = createdAccounts[accountData.parentCode];
        if (parentId) {
          const account = await prisma.account.create({
            data: {
              code: accountData.code,
              name: accountData.name,
              nameAr: accountData.nameAr,
              type: accountData.type as any,
              parentId,
              currency: 'AED',
              balance: 0,
              isActive: true,
              allowPosting: accountData.allowPosting !== false,
            } as any,
          });
          createdAccounts[accountData.code] = account.id;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'UAE Standard Chart of Accounts initialized successfully',
      data: {
        accountsCreated: Object.keys(createdAccounts).length,
      },
    });
  } catch (error) {
    console.error('Initialize Chart of Accounts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize chart of accounts' },
      { status: 500 }
    );
  }
}