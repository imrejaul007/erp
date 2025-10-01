import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { CommunicationType } from '@/types/crm';

const sendCommunicationSchema = z.object({
  customerId: z.string().cuid('Invalid customer ID'),
  type: z.nativeEnum(CommunicationType),
  subject: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  contentArabic: z.string().optional(),
  channel: z.string().optional(),
  scheduledAt: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  templateId: z.string().cuid().optional(),
  templateVariables: z.record(z.string()).optional(),
});

const bulkCommunicationSchema = z.object({
  customerIds: z.array(z.string().cuid()).min(1, 'At least one customer is required'),
  type: z.nativeEnum(CommunicationType),
  subject: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  contentArabic: z.string().optional(),
  channel: z.string().optional(),
  scheduledAt: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  templateId: z.string().cuid().optional(),
});

const searchSchema = z.object({
  customerId: z.string().cuid().optional(),
  type: z.nativeEnum(CommunicationType).optional(),
  status: z.enum(['SENT', 'DELIVERED', 'READ', 'FAILED']).optional(),
  dateFrom: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  dateTo: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// GET - List communications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = searchSchema.parse({
      customerId: searchParams.get('customerId'),
      type: searchParams.get('type'),
      status: searchParams.get('status'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    });

    // Build where clause
    const where: any = {};

    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const skip = (filters.page - 1) * filters.limit;

    // Get communications with customer info
    const [communications, total] = await Promise.all([
      prisma.communication.findMany({
        where,
        skip,
        take: filters.limit,
        include: {
          customer: {
            select: {
              id: true,
              code: true,
              name: true,
              nameArabic: true,
              email: true,
              phone: true,
              language: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communication.count({ where }),
    ]);

    return NextResponse.json({
      communications,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching communications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communications' },
      { status: 500 }
    );
  }
}

// POST - Send communication
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action || 'send';

    if (action === 'send') {
      const validatedData = sendCommunicationSchema.parse(body);

      // Get customer
      const customer = await prisma.customer.findUnique({
        where: { id: validatedData.customerId },
        select: {
          id: true,
          name: true,
          nameArabic: true,
          email: true,
          phone: true,
          language: true,
        },
      });

      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      // Validate contact method
      if (validatedData.type === 'EMAIL' && !customer.email) {
        return NextResponse.json(
          { error: 'Customer does not have an email address' },
          { status: 400 }
        );
      }

      if (['SMS', 'WHATSAPP'].includes(validatedData.type) && !customer.phone) {
        return NextResponse.json(
          { error: 'Customer does not have a phone number' },
          { status: 400 }
        );
      }

      let finalContent = validatedData.content;
      let finalContentArabic = validatedData.contentArabic;

      // Apply template if provided
      if (validatedData.templateId) {
        const template = await prisma.messageTemplate.findUnique({
          where: { id: validatedData.templateId },
        });

        if (template) {
          finalContent = applyTemplateVariables(
            template.content,
            validatedData.templateVariables || {},
            customer
          );

          if (template.contentArabic) {
            finalContentArabic = applyTemplateVariables(
              template.contentArabic,
              validatedData.templateVariables || {},
              customer
            );
          }
        }
      }

      // Create communication record
      const communication = await prisma.communication.create({
        data: {
          customerId: validatedData.customerId,
          type: validatedData.type,
          subject: validatedData.subject,
          content: finalContent,
          contentArabic: finalContentArabic,
          channel: validatedData.channel,
          status: 'SENT',
          scheduledAt: validatedData.scheduledAt,
          sentAt: validatedData.scheduledAt ? undefined : new Date(),
          createdById: session.user.id,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      // Add to customer history
      await prisma.customerHistory.create({
        data: {
          customerId: validatedData.customerId,
          eventType: 'COMMUNICATION_SENT',
          description: `${validatedData.type} sent: ${validatedData.subject || finalContent.substring(0, 50)}...`,
          referenceId: communication.id,
          createdById: session.user.id,
        },
      });

      // TODO: Integrate with actual communication providers
      // This is where you would integrate with:
      // - WhatsApp Business API
      // - SMS Gateway (Twilio, AWS SNS, etc.)
      // - Email Service (SendGrid, Mailgun, etc.)

      return NextResponse.json({
        success: true,
        communication,
        message: 'Communication sent successfully',
      });
    }

    if (action === 'bulk-send') {
      const validatedData = bulkCommunicationSchema.parse(body);

      // Get customers
      const customers = await prisma.customer.findMany({
        where: {
          id: { in: validatedData.customerIds },
        },
        select: {
          id: true,
          name: true,
          nameArabic: true,
          email: true,
          phone: true,
          language: true,
        },
      });

      if (customers.length === 0) {
        return NextResponse.json({ error: 'No valid customers found' }, { status: 404 });
      }

      // Validate all customers have required contact method
      const invalidCustomers = customers.filter((customer) => {
        if (validatedData.type === 'EMAIL') return !customer.email;
        if (['SMS', 'WHATSAPP'].includes(validatedData.type)) return !customer.phone;
        return false;
      });

      if (invalidCustomers.length > 0) {
        return NextResponse.json({
          error: `${invalidCustomers.length} customers don't have the required contact information`,
          invalidCustomers: invalidCustomers.map((c) => ({
            id: c.id,
            name: c.name,
            missing: validatedData.type === 'EMAIL' ? 'email' : 'phone',
          })),
        }, { status: 400 });
      }

      // Create communications
      const communications = await Promise.all(
        customers.map(async (customer) => {
          let finalContent = validatedData.content;
          let finalContentArabic = validatedData.contentArabic;

          // Apply template if provided
          if (validatedData.templateId) {
            const template = await prisma.messageTemplate.findUnique({
              where: { id: validatedData.templateId },
            });

            if (template) {
              finalContent = applyTemplateVariables(template.content, {}, customer);
              if (template.contentArabic) {
                finalContentArabic = applyTemplateVariables(template.contentArabic, {}, customer);
              }
            }
          }

          const communication = await prisma.communication.create({
            data: {
              customerId: customer.id,
              type: validatedData.type,
              subject: validatedData.subject,
              content: finalContent,
              contentArabic: finalContentArabic,
              channel: validatedData.channel,
              status: 'SENT',
              scheduledAt: validatedData.scheduledAt,
              sentAt: validatedData.scheduledAt ? undefined : new Date(),
              createdById: session.user.id,
            },
          });

          // Add to customer history
          await prisma.customerHistory.create({
            data: {
              customerId: customer.id,
              eventType: 'COMMUNICATION_SENT',
              description: `Bulk ${validatedData.type} sent: ${validatedData.subject || finalContent.substring(0, 50)}...`,
              referenceId: communication.id,
              createdById: session.user.id,
            },
          });

          return communication;
        })
      );

      return NextResponse.json({
        success: true,
        communicationsSent: communications.length,
        communications,
        message: `Bulk communication sent to ${communications.length} customers`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error sending communication:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to send communication' },
      { status: 500 }
    );
  }
}

// Helper function to apply template variables
function applyTemplateVariables(
  content: string,
  variables: Record<string, string>,
  customer: any
): string {
  let result = content;

  // Default customer variables
  const defaultVariables = {
    name: customer.name || '',
    nameArabic: customer.nameArabic || '',
    email: customer.email || '',
    phone: customer.phone || '',
  };

  // Replace all variables
  const allVariables = { ...defaultVariables, ...variables };

  Object.entries(allVariables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  });

  return result;
}