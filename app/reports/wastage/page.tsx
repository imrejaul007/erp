'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle,
  ArrowLeft} from 'lucide-react';

export default function WastageReportsPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            Wastage Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Comprehensive wastage tracking and reporting system for production and inventory.
          </p>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              This page is being optimized. Full wastage reporting functionality coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
