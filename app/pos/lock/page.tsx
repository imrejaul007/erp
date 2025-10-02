'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Key, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function LockRegisterPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');

  const currentUser = {
    name: 'POS User',
    role: 'Cashier',
    shiftStart: '09:00 AM',
    terminal: 'POS-MAIN'
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { // Mock PIN validation
      toast.success('Register unlocked successfully');
      router.push('/pos');
    } else {
      toast.error('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Register Locked</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Enter your PIN to unlock the register</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{currentUser.name}</span>
              <span className="text-gray-600">({currentUser.role})</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Shift started at {currentUser.shiftStart}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Key className="h-4 w-4 text-gray-400" />
              <span>Terminal: {currentUser.terminal}</span>
            </div>
          </div>

          <form onSubmit={handleUnlock}>
            {/* PIN Display */}
            <div className="mb-6">
              <Label className="text-center block mb-2">Enter PIN</Label>
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center ${
                      i < pin.length ? 'bg-amber-100 border-amber-600' : 'border-gray-300'
                    }`}
                  >
                    {i < pin.length ? (
                      <div className="w-3 h-3 bg-amber-600 rounded-full" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => handleNumberClick(num.toString())}
                  className="h-16 text-xl font-semibold hover:bg-amber-50"
                >
                  {num}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleClear}
                className="h-16 text-sm hover:bg-red-50 hover:text-red-600"
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleNumberClick('0')}
                className="h-16 text-xl font-semibold hover:bg-amber-50"
              >
                0
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBackspace}
                className="h-16 text-sm hover:bg-amber-50"
              >
                ⌫
              </Button>
            </div>

            {/* Unlock Button */}
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              size="lg"
              disabled={pin.length === 0}
            >
              <Key className="h-4 w-4 mr-2" />
              Unlock Register
            </Button>
          </form>

          {/* Additional Actions */}
          <div className="space-y-2 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                toast.info('Contact your manager for assistance');
              }}
            >
              Forgot PIN?
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-600"
              onClick={() => {
                router.push('/');
              }}
            >
              Switch User
            </Button>
          </div>

          {/* Demo Hint */}
          <div className="text-center text-xs text-gray-500 pt-2">
            Demo PIN: 1234
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
