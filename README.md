# Oud & Perfume ERP System

A comprehensive Enterprise Resource Planning (ERP) system specifically designed for managing perfume and oud business operations. Built with Next.js 14, TypeScript, Tailwind CSS, and modern web technologies.

## Features

### Core Modules
- **Dashboard** - Business overview with key metrics and insights
- **Inventory Management** - Product catalog, stock tracking, and batch management
- **Order Management** - Sales orders, order processing, and fulfillment
- **Customer Management** - Customer profiles, purchase history, and relationship management
- **Supplier Management** - Vendor management and procurement
- **Analytics & Reports** - Business intelligence and performance metrics
- **User Management** - Role-based access control and user administration

### Key Capabilities
- Real-time inventory tracking with low-stock alerts
- Customer purchase history and analytics
- Order processing workflow
- Supplier and procurement management
- Quality control and batch tracking
- Mobile-responsive design
- Secure authentication with NextAuth.js
- Role-based permissions (Admin, Manager, Sales, Inventory, User)

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom luxury theme
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Radix UI
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oud-perfume-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/oud_perfume_erp"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push database schema
   npm run db:push

   # (Optional) Seed the database
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── providers.tsx      # Context providers
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts        # Authentication hooks
│   ├── use-data.ts        # Data fetching hooks
│   └── use-ui.ts          # UI state hooks
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── database/          # Database utilities
│   ├── utils.ts           # General utilities
│   └── validations/       # Zod schemas
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # Prisma schema
├── services/              # API services
│   └── api/               # API client services
├── store/                 # Zustand state stores
├── types/                 # TypeScript type definitions
├── middleware.ts          # Next.js middleware
├── tailwind.config.ts     # Tailwind configuration
└── components.json        # shadcn/ui configuration
```

## Features Overview

### Authentication & Authorization
- Secure authentication with NextAuth.js
- Support for email/password, Google, and GitHub OAuth
- Role-based access control (RBAC)
- Protected routes with middleware

### Luxury Design Theme
- Custom Tailwind CSS theme with oud and amber color palette
- Gradient backgrounds and luxury styling
- Responsive design for all devices
- Professional typography with custom fonts

### Database Schema
- Comprehensive ERP data models
- Product catalog with categories and brands
- Customer and supplier management
- Order processing and inventory tracking
- User roles and permissions

### State Management
- Zustand for global state management
- Separate stores for auth, inventory, and UI state
- Persistent storage for user preferences

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript checks
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

See `.env.example` for all available environment variables. Key variables include:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `NEXTAUTH_URL` - Application URL
- OAuth provider credentials (optional)
- Email configuration (optional)
- File upload service configuration (optional)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.