# Inventory & Raw Material Management Module

A comprehensive inventory management system designed specifically for Perfume & Oud ERP applications, featuring advanced batch tracking, unit conversions, and real-time stock monitoring.

## 🌟 Features

### Core Functionality
- ✅ **Raw Material Management** - Complete CRUD operations with multi-unit support
- ✅ **Batch Tracking** - Detailed batch management with origin, quality, and expiry tracking
- ✅ **Unit Conversions** - Auto-conversion between grams ↔ tola ↔ ml (1 tola = 11.66 grams)
- ✅ **Real-time Stock Updates** - Live inventory tracking with automatic calculations
- ✅ **Stock Alerts** - Low stock, out-of-stock, and expiry warnings
- ✅ **Inventory Analytics** - Aging analysis, cost tracking, and consumption trends

### Advanced Features
- 🔄 **Multi-unit Support** - Handle different measurement units seamlessly
- 📊 **Interactive Dashboard** - Comprehensive overview with charts and KPIs
- 🏷️ **Grade & Quality Tracking** - Premium, Standard, Economy classifications
- 📍 **Location Management** - Track storage locations and conditions
- 🔔 **Smart Alerts** - Automated notifications for critical inventory events
- 📈 **Reporting System** - Generate detailed inventory reports

## 🏗️ Architecture

### Database Schema
```
Material (Raw Materials)
├── Basic Info (name, sku, description)
├── Units & Pricing (costPerUnit, currency, density)
├── Stock Levels (current, available, reserved, reorder points)
├── Quality (grade, origin, supplier info)
└── Relations (batches, alerts, movements)

MaterialBatch (Batch Tracking)
├── Batch Details (number, quantity, cost)
├── Quality Info (grade, origin, quality notes)
├── Dates (received, expiry, manufacturing)
├── Location (storage location, conditions)
└── Stock Status (current stock, expired flag)

StockMovement (Transaction History)
├── Movement Details (type, quantity, reason)
├── References (material, batch, user)
└── Audit Trail (timestamps, performed by)

StockAlert (Notifications)
├── Alert Info (type, severity, message)
├── Thresholds (current vs threshold levels)
└── Status (read, resolved, timestamps)
```

### Component Structure
```
inventory/
├── components/
│   ├── RawMaterialList - Material listing with search/filter
│   ├── AddRawMaterial - Comprehensive material form
│   ├── BatchTracking - Batch management interface
│   ├── InventoryDashboard - Analytics & overview
│   ├── StockAlerts - Alert management system
│   └── utils/
│       └── UnitConverter - Unit conversion utility
├── store/
│   └── inventory-store.ts - Zustand state management
├── types/
│   └── inventory.ts - TypeScript definitions
└── api/
    ├── raw-materials/ - Material CRUD endpoints
    ├── batches/ - Batch management APIs
    ├── conversions/ - Unit conversion service
    ├── stock-movements/ - Movement tracking
    └── reports/ - Analytics & reporting
```

## 📋 Components Overview

### 1. RawMaterialList
**Purpose:** Display and manage raw materials with advanced filtering
**Features:**
- Search by name, SKU, supplier
- Filter by category, grade, stock status
- Sortable columns with pagination
- Bulk operations (update, delete, export)
- Real-time stock status indicators

### 2. AddRawMaterial
**Purpose:** Create/edit raw materials with comprehensive form
**Features:**
- Multi-tab interface (Basic, Units, Inventory, Supplier)
- SKU auto-generation
- Multi-unit configuration
- Real-time unit converter integration
- Validation with Zod schemas

### 3. BatchTracking
**Purpose:** Track and manage material batches
**Features:**
- Batch lifecycle management
- Expiry date tracking and alerts
- Stock utilization visualization
- Quality grade management
- Location and storage condition tracking

### 4. InventoryDashboard
**Purpose:** Provide comprehensive inventory overview
**Features:**
- Key performance indicators (KPIs)
- Interactive charts and graphs
- Stock level distribution analysis
- Category-wise breakdowns
- Trend analysis with date range selection

### 5. StockAlerts
**Purpose:** Monitor and manage inventory alerts
**Features:**
- Categorized alert system (Low Stock, Expiry, Quality)
- Severity levels (Low, Medium, High, Critical)
- Bulk alert management
- Smart filtering and search
- Alert resolution tracking

### 6. UnitConverter
**Purpose:** Convert between different units of measurement
**Features:**
- Perfume/Oud specific conversions
- Material density-based calculations
- Conversion history tracking
- Quick reference tables
- Real-time conversion feedback

## 🔌 API Endpoints

### Raw Materials
```
GET    /api/inventory/raw-materials        # List with pagination/filtering
POST   /api/inventory/raw-materials        # Create new material
GET    /api/inventory/raw-materials/[id]   # Get specific material
PUT    /api/inventory/raw-materials/[id]   # Update material
DELETE /api/inventory/raw-materials/[id]   # Delete material
PUT    /api/inventory/raw-materials        # Bulk operations
```

### Batch Management
```
GET    /api/inventory/batches              # List batches
POST   /api/inventory/batches              # Create batch
PUT    /api/inventory/batches              # Bulk update
```

### Unit Conversions
```
GET    /api/inventory/conversions          # Perform conversion
POST   /api/inventory/conversions          # Create conversion rule
PUT    /api/inventory/conversions          # Get conversion rules
```

### Stock Movements
```
GET    /api/inventory/stock-movements      # Movement history
POST   /api/inventory/stock-movements      # Record movement
PUT    /api/inventory/stock-movements/adjust # Stock adjustment
```

### Reporting
```
GET    /api/inventory/reports              # List saved reports
POST   /api/inventory/reports              # Generate new report
```

## 🚀 Unit Conversion System

### Supported Conversions
- **Weight:** grams ↔ kilograms ↔ tola
- **Volume:** milliliters ↔ liters
- **Volume to Weight:** Using material density (g/ml)
- **Perfume Specific:** Tola to ml conversions for oils

### Conversion Rules
```typescript
// Standard conversions
1 tola = 11.66 grams
1 kg = 1000 grams
1 liter = 1000 ml

// Density-based conversions
grams = ml × density (g/ml)
ml = grams ÷ density (g/ml)

// Common perfume densities
Alcohol-based: 0.8 g/ml
Oil-based: 0.9 g/ml
Pure Oud: 0.85 g/ml
```

## 📊 State Management

### Zustand Store Features
- **Materials State:** CRUD operations, filtering, pagination
- **Batch Management:** Batch tracking, expiry monitoring
- **Alert System:** Real-time notifications, bulk operations
- **UI State:** Sidebar, tabs, selections, search
- **Real-time Updates:** Automatic data refresh, optimistic updates

### Key Store Actions
```typescript
// Material operations
setMaterials, addMaterial, updateMaterial, deleteMaterial

// Batch operations
setBatches, addBatch, updateBatch, deleteBatch

// Alert management
setStockAlerts, markAlertAsRead, resolveAlert

// Utility functions
convertUnit, getMaterialBysku, getLowStockMaterials
```

## 🎯 Usage Examples

### Basic Implementation
```tsx
import { InventoryDashboard } from '@/components/inventory/inventory-dashboard'
import { RawMaterialList } from '@/components/inventory/raw-material-list'
import { useInventoryStore } from '@/store/inventory-store'

function InventoryPage() {
  const { materials, setActiveTab } = useInventoryStore()

  return (
    <div>
      <InventoryDashboard onViewAlerts={() => setActiveTab('alerts')} />
      <RawMaterialList
        showActions
        selectable
        onAddMaterial={handleAdd}
      />
    </div>
  )
}
```

### Unit Conversion
```tsx
import { UnitConverter } from '@/components/inventory/utils/unit-converter'

function ConversionTool() {
  return (
    <UnitConverter
      materialName="Cambodian Oud Oil"
      density={0.85}
      showMaterialSpecific
      onConversionChange={(result) => {
        console.log(`${result.originalValue} ${result.fromUnit} = ${result.convertedValue} ${result.toUnit}`)
      }}
    />
  )
}
```

## 📁 File Structure

```
/Users/rejaulkarim/Documents/Oud PMS/
├── prisma/
│   └── schema.prisma                    # Database schema with inventory models
├── types/
│   └── inventory.ts                     # TypeScript type definitions
├── store/
│   └── inventory-store.ts              # Zustand state management
├── components/inventory/
│   ├── raw-material-list.tsx           # Material listing component
│   ├── add-raw-material.tsx            # Material form component
│   ├── batch-tracking.tsx              # Batch management component
│   ├── inventory-dashboard.tsx         # Dashboard & analytics
│   ├── stock-alerts.tsx                # Alert management system
│   └── utils/
│       └── unit-converter.tsx          # Unit conversion utility
├── app/api/inventory/
│   ├── raw-materials/
│   │   ├── route.ts                    # Material CRUD endpoints
│   │   └── [id]/route.ts               # Individual material operations
│   ├── batches/route.ts                # Batch management APIs
│   ├── conversions/route.ts            # Unit conversion service
│   ├── stock-movements/route.ts        # Movement tracking
│   └── reports/route.ts                # Analytics & reporting
├── lib/
│   ├── prisma.ts                       # Database client
│   └── actions/inventory-actions.ts    # Server actions
└── app/inventory/
    └── page.tsx                        # Main inventory page
```

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install @prisma/client prisma zustand @radix-ui/react-* recharts zod react-hook-form
   ```

2. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Environment Variables**
   ```env
   DATABASE_URL="your-database-connection-string"
   ```

4. **Import Components**
   ```tsx
   import { InventoryDashboard } from '@/components/inventory/inventory-dashboard'
   // Import other components as needed
   ```

## 🎉 Key Benefits

- **Perfume Industry Focused:** Designed specifically for perfume & oud businesses
- **Multi-unit Support:** Handle traditional units (tola) alongside metric units
- **Real-time Tracking:** Live updates with automatic calculations
- **Comprehensive Analytics:** Deep insights into inventory performance
- **Scalable Architecture:** Built with Next.js 14 and modern best practices
- **Type Safety:** Full TypeScript support throughout
- **Responsive Design:** Works on desktop and mobile devices

## 📞 Support

This inventory module is designed to be a complete solution for perfume and oud businesses. All components are fully functional and ready for integration into your ERP system.

For customization or additional features, the modular architecture allows easy extension and modification of individual components while maintaining system integrity.