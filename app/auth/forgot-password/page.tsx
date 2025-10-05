'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Mail, MessageSquare, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          method,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Success',
          description: data.message || `Reset code sent to your ${method === 'email' ? 'email' : 'phone'}`,
        });

        // Redirect to reset password page
        router.push(`/auth/reset-password?identifier=${encodeURIComponent(identifier)}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.message || 'Failed to send reset code',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-oud-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-luxury">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-oud-500 to-oud-600 rounded-lg flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif luxury-text-gradient">
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your email or phone number to receive a password reset code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="identifier" className="text-oud-700">
                Email or Phone Number
              </Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@oudperfume.ae or +971 XX XXX XXXX"
                required
                className="input-luxury"
              />
            </div>

            <div>
              <Label htmlFor="method" className="text-oud-700">
                Receive Code Via
              </Label>
              <Select value={method} onValueChange={(value: 'email' | 'sms') => setMethod(value)}>
                <SelectTrigger className="input-luxury">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>SMS</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="luxury"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              href="/auth/signin"
              className="flex items-center gap-1 text-oud-600 hover:text-oud-500"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
            <Link href="/auth/signup" className="text-oud-600 hover:text-oud-500">
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
