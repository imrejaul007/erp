# API Documentation

## Overview

The Oud & Perfume ERP API is a RESTful API that provides programmatic access to all system features.

**Base URL**: `https://your-domain.com/api`

**Authentication**: All API endpoints require authentication via JWT tokens.

## Authentication

### Login

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "MANAGER",
    "tenantId": "tenant_123"
  }
}
```

## Common Headers

All authenticated requests must include:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Response Format

All API responses follow this format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per user
- **Headers**: Rate limit info is returned in response headers:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Core Endpoints

### Products

#### List Products

```http
GET /api/products?page=1&limit=20&category=perfumes
```

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `category` (string): Filter by category
- `type` (string): Filter by type (RAW_MATERIAL, SEMI_FINISHED, FINISHED_GOOD)
- `search` (string): Search by name or SKU

**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Royal Oud Perfume",
        "sku": "PERF-ROYAL-50ML",
        "price": 250.00,
        "quantity": 50,
        "category": "Perfumes",
        "type": "FINISHED_GOOD"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### Get Product

```http
GET /api/products/:id
```

#### Create Product

```http
POST /api/products
Content-Type: application/json

{
  "name": "Premium Oud Chips",
  "sku": "OUD-PREM-100G",
  "category": "Raw Materials",
  "type": "RAW_MATERIAL",
  "price": 150.00,
  "cost": 80.00,
  "quantity": 100,
  "unit": "g",
  "minStock": 20,
  "description": "Premium quality oud chips"
}
```

#### Update Product

```http
PATCH /api/products/:id
Content-Type: application/json

{
  "price": 160.00,
  "quantity": 120
}
```

#### Delete Product

```http
DELETE /api/products/:id
```

### Customers

#### List Customers

```http
GET /api/customers?page=1&limit=20&type=VIP
```

**Query Parameters**:
- `page`, `limit`: Pagination
- `type`: Filter by customer type (VIP, REGULAR, TOURIST, CORPORATE)
- `search`: Search by name, email, or phone

#### Create Customer

```http
POST /api/customers
Content-Type: application/json

{
  "name": "Ahmed Al Mansoori",
  "email": "ahmed@example.com",
  "phone": "+971501234567",
  "type": "VIP",
  "address": "Dubai Marina",
  "city": "Dubai",
  "country": "UAE"
}
```

### Orders

#### List Orders

```http
GET /api/orders?page=1&limit=20&status=COMPLETED
```

**Query Parameters**:
- `page`, `limit`: Pagination
- `status`: Filter by status (PENDING, PROCESSING, COMPLETED, CANCELLED)
- `customerId`: Filter by customer
- `startDate`, `endDate`: Filter by date range

#### Create Order

```http
POST /api/orders
Content-Type: application/json

{
  "customerId": "cust_123",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "price": 250.00,
      "discount": 10
    }
  ],
  "paymentMethod": "CARD",
  "discount": 20.00,
  "notes": "Gift wrapping requested"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-2024-001",
    "customerId": "cust_123",
    "subtotal": 500.00,
    "discount": 70.00,
    "tax": 21.50,
    "total": 451.50,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Inventory

#### Stock Movement

```http
POST /api/inventory/movement
Content-Type: application/json

{
  "productId": "prod_123",
  "quantity": 50,
  "type": "ADJUSTMENT",
  "reason": "Stock count correction",
  "notes": "Annual inventory audit"
}
```

#### Transfer Stock

```http
POST /api/inventory/transfer
Content-Type: application/json

{
  "productId": "prod_123",
  "fromLocation": "warehouse-a",
  "toLocation": "store-1",
  "quantity": 20,
  "notes": "Restock for store"
}
```

### Reports

#### Sales Report

```http
GET /api/reports/sales?startDate=2024-01-01&endDate=2024-01-31
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalSales": 125000.00,
    "totalOrders": 450,
    "averageOrderValue": 277.78,
    "topProducts": [
      {
        "productId": "prod_123",
        "name": "Royal Oud Perfume",
        "quantity": 150,
        "revenue": 37500.00
      }
    ]
  }
}
```

#### Inventory Report

```http
GET /api/reports/inventory?type=low-stock
```

#### Financial Report

```http
GET /api/reports/financial?period=monthly&year=2024&month=1
```

### Search

#### Global Search

```http
GET /api/search?q=royal&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_123",
      "type": "product",
      "title": "Royal Oud Perfume",
      "subtitle": "PERF-ROYAL-50ML",
      "description": "Perfumes - AED 250.00 - Stock: 50",
      "url": "/inventory?product=prod_123"
    }
  ],
  "count": 1
}
```

### Export

#### Export to CSV

```http
POST /api/export/csv
Content-Type: application/json

{
  "type": "products",
  "filters": {
    "category": "Perfumes"
  }
}
```

## Webhooks

Subscribe to real-time events:

### Available Events

- `order.created`
- `order.completed`
- `inventory.low_stock`
- `customer.created`
- `payment.received`

### Webhook Payload

```json
{
  "event": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "orderId": "order_123",
    "customerId": "cust_123",
    "total": 451.50
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 422 | Validation Error - Input validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## SDKs and Libraries

### JavaScript/TypeScript

```typescript
import { OudERPClient } from '@oud-erp/client';

const client = new OudERPClient({
  apiKey: 'your_api_key',
  baseURL: 'https://your-domain.com/api'
});

// List products
const products = await client.products.list({
  page: 1,
  limit: 20
});

// Create order
const order = await client.orders.create({
  customerId: 'cust_123',
  items: [{ productId: 'prod_123', quantity: 2 }]
});
```

## Changelog

### Version 1.0.0 (2024-01-15)
- Initial API release
- Core CRUD operations for products, customers, orders
- Search functionality
- Basic reporting

## Support

For API support, please contact:
- Email: api-support@oud-erp.com
- Documentation: https://docs.oud-erp.com
- Status Page: https://status.oud-erp.com
