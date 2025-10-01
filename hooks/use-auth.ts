import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { UserRole } from '@prisma/client';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const { user, setUser, logout, isAuthenticated, hasRole, hasAnyRole, isAdmin, isManager } = useAuthStore();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email!,
        image: session.user.image,
        role: session.user.role,
        isActive: session.user.isActive,
      });
    } else if (status === 'unauthenticated') {
      logout();
    }
  }, [session, status, setUser, logout]);

  const handleSignOut = async () => {
    logout();
    await signOut({ callbackUrl: '/' });
  };

  return {
    user,
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: isAuthenticated(),
    hasRole,
    hasAnyRole,
    isAdmin: isAdmin(),
    isManager: isManager(),
    signOut: handleSignOut,

    // Role checking helpers
    canAccessAdmin: () => hasRole('ADMIN'),
    canAccessManager: () => hasAnyRole(['ADMIN', 'MANAGER']),
    canAccessInventory: () => hasAnyRole(['ADMIN', 'MANAGER', 'INVENTORY']),
    canAccessSales: () => hasAnyRole(['ADMIN', 'MANAGER', 'SALES']),
  };
};