import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard - Oud Perfume ERP',
  description: 'Comprehensive business intelligence and analytics dashboard for Perfume & Oud ERP system',
  keywords: ['analytics', 'dashboard', 'business intelligence', 'perfume', 'oud', 'ERP'],
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="analytics-layout">
      {children}
    </div>
  );
}