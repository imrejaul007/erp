'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CountriesDashboard from '@/components/countries/countries-dashboard';

export default function CountriesPage() {
  const router = useRouter();
  return (
    <div>
      <div className="container mx-auto px-6 pt-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <CountriesDashboard />
    </div>
  );
}
