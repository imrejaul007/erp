import {
  UserRole,
  PermissionAction,
  PermissionResource,
  TwoFactorMethod,
  LoginAttemptResult,
  AuditAction
} from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      roles: string[];
      permissions: Permission[];
      stores: string[];
      currentStore?: string;
      isActive: boolean;
      isVerified: boolean;
      twoFactorEnabled: boolean;
      language: string;
      timezone: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: UserRole;
    isActive: boolean;
    isVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    roles: string[];
    permissions: Permission[];
    stores: string[];
    currentStore?: string;
    isActive: boolean;
    isVerified: boolean;
    twoFactorEnabled: boolean;
    language: string;
    timezone: string;
  }
}

// Enhanced Auth Types
export interface AuthUser {
  id: string;
  name: string | null;
  nameArabic?: string | null;
  email: string;
  phone?: string | null;
  username?: string | null;
  image: string | null;
  role: UserRole;
  roles: UserRoleInfo[];
  permissions: Permission[];
  stores: UserStore[];
  currentStore?: UserStore;
  isActive: boolean;
  isVerified: boolean;
  isLocked: boolean;
  twoFactorEnabled: boolean;
  language: string;
  timezone: string;
  country: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface UserRoleInfo {
  id: string;
  name: string;
  displayName: string;
  displayNameArabic?: string;
  color?: string;
  isActive: boolean;
}

export interface Permission {
  id: string;
  action: PermissionAction;
  resource: PermissionResource;
  conditions?: Record<string, any>;
}

export interface UserStore {
  id: string;
  storeId: string;
  storeName: string;
  storeCode: string;
  isDefault: boolean;
  canAccess: boolean;
}

// Authentication Requests/Responses
export interface SignInCredentials {
  identifier: string; // email, phone, or username
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  nameArabic?: string;
  email: string;
  phone?: string;
  username?: string;
  password: string;
  confirmPassword: string;
  language?: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  messageArabic?: string;
  user?: AuthUser;
  requires2FA?: boolean;
  tempToken?: string;
  redirectTo?: string;
}

export interface TwoFactorSetupData {
  method: TwoFactorMethod;
  phone?: string;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
}

export interface PasswordResetRequest {
  identifier: string; // email or phone
  method: 'email' | 'sms';
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Role & Permission Management
export interface RoleData {
  name: string;
  displayName: string;
  displayNameArabic?: string;
  description?: string;
  descriptionArabic?: string;
  color?: string;
  permissions: string[]; // Permission IDs
  stores?: string[]; // Store IDs
}

export interface PermissionData {
  action: PermissionAction;
  resource: PermissionResource;
  description?: string;
  descriptionArabic?: string;
  conditions?: Record<string, any>;
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedBy?: string;
  isActive: boolean;
}

// Security & Audit
export interface LoginAttemptData {
  identifier: string;
  ipAddress: string;
  userAgent?: string;
  result: LoginAttemptResult;
  failureReason?: string;
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface SecuritySettings {
  enableTwoFactor: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  allowedIpRanges: string[];
  restrictToIpRanges: boolean;
  enableLocationTracking: boolean;
  enableDeviceTracking: boolean;
  enableAuditLogging: boolean;
  dataRetentionDays: number;
}

export interface AuditLogData {
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  severity?: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
}

export interface PasswordPolicyData {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number;
  maxAge: number;
  lockoutAttempts: number;
  lockoutDuration: number;
  sessionTimeout: number;
}

// API Security
export interface ApiKeyData {
  name: string;
  permissions: Permission[];
  expiresAt?: Date;
  rateLimit?: number;
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  key: string; // Only returned on creation
  keyPreview: string; // Masked key for display
  permissions: Permission[];
  expiresAt?: Date;
  rateLimit: number;
  lastUsed?: Date;
  isActive: boolean;
  createdAt: Date;
}

// User Management
export interface UserManagementData {
  name: string;
  nameArabic?: string;
  email: string;
  phone?: string;
  username?: string;
  roles: string[];
  stores: string[];
  isActive: boolean;
  language: string;
  timezone: string;
  sendInvitation?: boolean;
}

export interface UserPreferencesData {
  language: string;
  theme: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  emailNotifications: Record<string, boolean>;
  uiPreferences: Record<string, any>;
}

// Store Management
export interface StoreData {
  code: string;
  name: string;
  nameArabic?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  email?: string;
  manager?: string;
  timezone: string;
  currency: string;
}

// Multi-language Support
export interface MultiLangText {
  en: string;
  ar?: string;
}

// Validation Schemas (for use with Zod)
export interface ValidationErrors {
  [key: string]: string | string[];
}

// UI Component Props
export interface PermissionGuardProps {
  children: React.ReactNode;
  action: PermissionAction;
  resource: PermissionResource;
  fallback?: React.ReactNode;
  conditions?: Record<string, any>;
}

export interface RoleBasedComponentProps {
  children: React.ReactNode;
  roles: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

// Hook Types
export interface UsePermissionsReturn {
  hasPermission: (action: PermissionAction, resource: PermissionResource, conditions?: Record<string, any>) => boolean;
  hasRole: (role: UserRole | string) => boolean;
  hasAnyRole: (roles: (UserRole | string)[]) => boolean;
  hasAllRoles: (roles: (UserRole | string)[]) => boolean;
  canAccessStore: (storeId: string) => boolean;
  getCurrentStore: () => UserStore | undefined;
  switchStore: (storeId: string) => Promise<void>;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: SignInCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (data: SignUpData) => Promise<AuthResponse>;
  resetPassword: (data: PasswordResetRequest) => Promise<AuthResponse>;
  changePassword: (data: ChangePasswordData) => Promise<AuthResponse>;
  setup2FA: (data: TwoFactorSetupData) => Promise<AuthResponse>;
  verify2FA: (code: string) => Promise<AuthResponse>;
  refreshUser: () => Promise<void>;
}