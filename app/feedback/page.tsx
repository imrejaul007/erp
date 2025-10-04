'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FeedbackDashboard from '@/components/feedback/feedback-dashboard';

export default function FeedbackPage() {
  const router = useRouter();
  return (
    <div>
      <div className="container mx-auto px-6 pt-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <FeedbackDashboard />
    </div>
  );
}
