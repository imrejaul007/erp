import { NextResponse } from 'next/server';

/**
 * API Documentation helpers
 * Simple inline documentation for API endpoints
 */

export interface ApiEndpointDoc {
  method: string;
  path: string;
  description: string;
  authentication: 'required' | 'optional' | 'none';
  rateLimit?: string;
  requestBody?: {
    contentType: string;
    schema: Record<string, any>;
  };
  responses: {
    [statusCode: number]: {
      description: string;
      schema?: Record<string, any>;
    };
  };
  examples?: {
    request?: any;
    response?: any;
  };
}

/**
 * Generate API documentation endpoint
 */
export function createApiDocsEndpoint(endpoints: ApiEndpointDoc[]) {
  return function GET() {
    const documentation = {
      openapi: '3.0.0',
      info: {
        title: 'Oud Perfume ERP API',
        version: '1.0.0',
        description: 'Enterprise Resource Planning system for perfume business management',
      },
      servers: [
        {
          url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
          description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
        },
      ],
      paths: endpoints.reduce((acc, endpoint) => {
        const path = endpoint.path;
        if (!acc[path]) acc[path] = {};
        
        acc[path][endpoint.method.toLowerCase()] = {
          summary: endpoint.description,
          security: endpoint.authentication === 'required' ? [{ BearerAuth: [] }] : [],
          requestBody: endpoint.requestBody ? {
            required: true,
            content: {
              [endpoint.requestBody.contentType]: {
                schema: endpoint.requestBody.schema,
              },
            },
          } : undefined,
          responses: endpoint.responses,
        };
        
        return acc;
      }, {} as Record<string, any>),
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    };

    return NextResponse.json(documentation);
  };
}

/**
 * Simple API documentation decorator
 */
export function apiDoc(doc: Omit<ApiEndpointDoc, 'method' | 'path'>) {
  return function <T extends Function>(target: T): T {
    // Attach documentation metadata to function
    (target as any).__apiDoc = doc;
    return target;
  };
}

/**
 * Get all documented endpoints
 */
export function getDocumentedEndpoints(): ApiEndpointDoc[] {
  // This would scan all route files and extract documentation
  // For now, return empty array - to be implemented with file scanning
  return [];
}

/**
 * Format example curl command for endpoint
 */
export function formatCurlExample(endpoint: ApiEndpointDoc, baseUrl: string = 'http://localhost:3000'): string {
  const methodUpper = endpoint.method.toUpperCase();
  const authHeader = endpoint.authentication === 'required' ? ' \\\n  -H "Authorization: Bearer YOUR_TOKEN"' : '';
  const contentType = endpoint.requestBody ? ` \\\n  -H "Content-Type: ${endpoint.requestBody.contentType}"` : '';
  const requestData = endpoint.requestBody && endpoint.examples?.request ? ` \\\n  -d '${JSON.stringify(endpoint.examples.request, null, 2)}'` : '';
  
  return `curl -X ${methodUpper} "${baseUrl}${endpoint.path}"${authHeader}${contentType}${requestData}`;
}
