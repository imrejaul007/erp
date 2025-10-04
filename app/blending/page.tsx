'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BlendingDashboard from '@/components/blending/blending-dashboard';

export default function BlendingPage() {
  const router = useRouter();
  return (
    <div>
      <div className="container mx-auto px-6 pt-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <BlendingDashboard />
    </div>
  );
}
