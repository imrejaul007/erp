import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant, apiResponse, apiError } from '@/lib/apiMiddleware';

// GET /api/hr/employees - List all employees with their details
export const GET = withTenant(async (req, { tenantId, user }) => {
  try {
    const url = new URL(req.url);
    const department = url.searchParams.get('department');
    const isActive = url.searchParams.get('isActive');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build where clause with tenantId
    const whereClause: any = { tenantId };

    // Filter by department
    if (department) {
      whereClause.department = department;
    }

    // Filter by active status
    if (isActive !== null && isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    // Search by employee code or user details
    if (search) {
      whereClause.OR = [
        { employeeCode: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch employees with user relations and attendance data
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause,
        include: {
          attendances: {
            select: {
              id: true,
              status: true,
              date: true,
              hoursWorked: true
            },
            orderBy: {
              date: 'desc'
            },
            take: 30 // Last 30 days for attendance calculation
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.employee.count({ where: whereClause })
    ]);

    // Fetch user details separately for each employee
    const employeesWithDetails = await Promise.all(
      employees.map(async (employee) => {
        // Fetch user details
        const userDetails = await prisma.users.findUnique({
          where: { id: employee.userId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        });

        // Calculate total salary
        const basicSalary = Number(employee.basicSalary) || 0;
        const allowances = Number(employee.allowances) || 0;
        const deductions = Number(employee.deductions) || 0;
        const totalSalary = basicSalary + allowances - deductions;

        // Calculate attendance rate
        const totalDays = employee.attendances.length;
        const presentDays = employee.attendances.filter(
          (att) => att.status === 'PRESENT' || att.status === 'LATE'
        ).length;
        const attendanceRate = totalDays > 0
          ? Math.round((presentDays / totalDays) * 100 * 10) / 10
          : 0;

        // Mock performance score (4.0-5.0 range)
        const performanceScore = Math.round((4.0 + Math.random() * 1.0) * 10) / 10;

        return {
          id: employee.id,
          employeeCode: employee.employeeCode,
          name: userDetails?.name || 'Unknown',
          email: userDetails?.email || '',
          phone: userDetails?.phone || '',
          image: userDetails?.image || null,
          position: employee.position,
          department: employee.department,
          basicSalary: basicSalary,
          allowances: allowances,
          deductions: deductions,
          totalSalary: totalSalary,
          hireDate: employee.hireDate,
          isActive: employee.isActive,
          performanceScore: performanceScore,
          attendanceRate: attendanceRate,
          attendanceStats: {
            totalDays: totalDays,
            presentDays: presentDays,
            absentDays: employee.attendances.filter((att) => att.status === 'ABSENT').length,
            lateDays: employee.attendances.filter((att) => att.status === 'LATE').length,
            onLeaveDays: employee.attendances.filter((att) => att.status === 'ON_LEAVE').length
          },
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt
        };
      })
    );

    return apiResponse({
      employees: employeesWithDetails,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return apiError(error.message || 'Failed to fetch employees', 500);
  }
});
