# Branding & Customization System

A comprehensive branding management system that allows you to customize your Oud ERP's appearance from the frontend.

## 📋 Features

### 🏢 Company Information
- Company name (English & Arabic)
- Tagline/slogan (bilingual)
- Contact details (email, phone, WhatsApp)
- Business registration numbers (VAT, Trade License)
- Physical address

### 🎨 Visual Customization
- **Logos**: Main logo, white logo, favicon, login background
- **Colors**: Primary, accent, status colors (success, warning, error)
- **Typography**: Font family, size, heading fonts
- **Layout**: Sidebar style, header style, border radius

### 📄 Invoice Customization
- Custom prefixes (INV, RCP, ORD)
- Invoice footer (English & Arabic)
- Invoice notes and terms
- Company info display toggles

### ⚙️ System Settings
- Date & time formats
- Currency settings (symbol, position, decimals)
- Feature toggles (WhatsApp, social media, VAT display)
- Custom CSS for advanced styling

### 🌐 Social Media
- Facebook, Instagram, Twitter/X, LinkedIn links
- Display toggles for social icons

---

## 🚀 Getting Started

### 1. Database Setup

First, push the updated schema to your database:

```bash
npm run db:push
# or
npx prisma db push
```

### 2. Access the Branding Page

Navigate to: `/settings/branding`

Or add a link in your settings menu:

```tsx
<Link href="/settings/branding">
  <Button>
    <Palette className="mr-2 h-4 w-4" />
    Branding
  </Button>
</Link>
```

### 3. Configure Your Branding

1. **Company Tab**: Enter your company details
2. **Colors Tab**: Customize your color scheme
3. **Logos Tab**: Upload and set logo URLs
4. **Invoice Tab**: Configure invoice templates
5. **System Tab**: Set date/time formats and preferences
6. **Social Tab**: Add social media links

Click **"Save Changes"** to apply.

---

## 💻 Usage in Components

### Using the Branding Hook

```tsx
'use client';

import { useBranding } from '@/components/providers/branding-provider';

export function MyComponent() {
  const { branding, loading } = useBranding();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{branding?.companyName}</h1>
      <img src={branding?.logoUrl} alt="Logo" />
      <p style={{ color: branding?.primaryColor }}>
        Welcome to our store!
      </p>
    </div>
  );
}
```

### Using CSS Variables

The branding system automatically applies CSS variables:

```css
/* Available CSS variables */
--primary-color
--primary-hover
--accent-color
--bg-light
--bg-dark
--text-primary
--text-secondary
--success-color
--warning-color
--error-color
--info-color
--font-family
--font-size-base
--border-radius
```

Use them in your styles:

```tsx
<div style={{
  backgroundColor: 'var(--primary-color)',
  borderRadius: 'var(--border-radius)'
}}>
  Content
</div>
```

Or in Tailwind:

```tsx
// In your tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'var(--primary-color)',
      accent: 'var(--accent-color)',
    }
  }
}
```

---

## 📡 API Endpoints

### GET `/api/branding`
Fetch current branding settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "companyName": "My Perfume Store",
    "primaryColor": "#d97706",
    "logoUrl": "https://...",
    ...
  }
}
```

### PUT `/api/branding`
Update branding settings.

**Request Body:**
```json
{
  "companyName": "My Perfume Store",
  "primaryColor": "#d97706",
  "email": "info@example.com",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Branding updated successfully"
}
```

---

## 🎨 Custom CSS

For advanced customization, use the Custom CSS field:

```css
/* Example custom styles */
.sidebar {
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Override button styles */
.btn-primary {
  background: var(--primary-color);
  border: 2px solid var(--accent-color);
}
```

---

## 🖼️ Logo Upload Guide

Since the ERP doesn't include built-in file upload yet, use an external CDN:

### Option 1: Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Upload your logo
3. Copy the URL
4. Paste into Branding settings

### Option 2: AWS S3
1. Upload to S3 bucket
2. Make file public
3. Copy the public URL

### Option 3: ImgBB
1. Upload at [imgbb.com](https://imgbb.com)
2. Get direct link
3. Paste URL

---

## 📱 Responsive Design

All branding settings automatically apply across:
- Desktop
- Tablet
- Mobile devices

The system uses CSS variables that respect your Tailwind responsive breakpoints.

---

## 🌍 Multilingual Support

### Company Name & Tagline
Set both English and Arabic versions:

```tsx
{branding?.companyName} {/* English */}
{branding?.companyNameAr} {/* Arabic */}
```

### Invoice Footer
Automatically switches based on customer language preference:

```tsx
const footer = customer.language === 'ar'
  ? branding?.invoiceFooterAr
  : branding?.invoiceFooter;
```

---

## 🔄 Real-time Updates

Changes are applied immediately after saving:

```tsx
const { refreshBranding } = useBranding();

// After updating branding
await fetch('/api/branding', { method: 'PUT', ... });
await refreshBranding(); // Reload branding
```

The page automatically reloads to apply color/CSS changes.

---

## 🛡️ Security

### Permissions
Restrict access to branding settings:

```tsx
// middleware.ts or page component
if (!user.role.includes('ADMIN')) {
  return redirect('/dashboard');
}
```

### Database
Only one active branding record is used:

```prisma
model Branding {
  isActive Boolean @default(true)
}
```

---

## 📊 Database Schema

```prisma
model Branding {
  id                String   @id @default(cuid())

  // Company Info
  companyName       String
  companyNameAr     String?
  email             String?
  phone             String?

  // Visual
  logoUrl           String?
  primaryColor      String   @default("#d97706")

  // Invoice
  invoicePrefix     String   @default("INV")
  invoiceFooter     String?

  // System
  currency          String   @default("AED")
  dateFormat        String   @default("DD/MM/YYYY")

  // Metadata
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

## 🎯 Use Cases

### 1. Multi-Brand Management
Run multiple stores with different branding:

```tsx
// Create separate branding records per store
const branding = await prisma.branding.findFirst({
  where: { storeId: currentStore.id }
});
```

### 2. White-Label Solution
Customize for each client:

```tsx
// Client A: Gold theme
{ primaryColor: '#FFD700', companyName: 'Luxury Oud' }

// Client B: Purple theme
{ primaryColor: '#9333EA', companyName: 'Royal Fragrances' }
```

### 3. Seasonal Themes
Change colors for events:

```tsx
// Ramadan theme
{ primaryColor: '#059669', accentColor: '#065F46' }

// Christmas theme
{ primaryColor: '#DC2626', accentColor: '#16A34A' }
```

---

## 🐛 Troubleshooting

### Colors not applying?
1. Clear browser cache
2. Check if CSS variables are set: `console.log(getComputedStyle(document.documentElement).getPropertyValue('--primary-color'))`
3. Ensure BrandingProvider is in the component tree

### Logo not showing?
1. Verify URL is publicly accessible
2. Check browser console for CORS errors
3. Ensure HTTPS for production URLs

### Custom CSS not working?
1. Check for syntax errors in Custom CSS field
2. Use browser DevTools to inspect applied styles
3. Ensure specificity is high enough to override defaults

---

## 🚀 Future Enhancements

- [ ] Built-in image uploader
- [ ] Theme presets (light/dark/colorful)
- [ ] Import/Export branding configs
- [ ] Version history for branding changes
- [ ] Live preview before saving
- [ ] A/B testing for different themes

---

## 📞 Support

For issues or questions about the branding system:
1. Check this documentation
2. Review the code in `/app/settings/branding`
3. Inspect browser console for errors
4. Check database for branding records

---

**Created for:** Oud & Perfume ERP
**Version:** 1.0.0
**Last Updated:** 2025-10-01
