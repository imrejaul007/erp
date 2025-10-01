// CRM Type Definitions for Perfume & Oud ERP

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE'
}

export enum CustomerSegment {
  VIP = 'VIP',
  REGULAR = 'REGULAR',
  WHOLESALE = 'WHOLESALE',
  EXPORT = 'EXPORT'
}

export enum LoyaltyTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND'
}

export enum CommunicationType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  PHONE_CALL = 'PHONE_CALL',
  IN_PERSON = 'IN_PERSON'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// UAE Emirates
export const UAE_EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah'
] as const;

export type UAEEmirate = typeof UAE_EMIRATES[number];

// Customer Types
export interface CustomerProfile {
  id: string;
  code: string;
  customerType: CustomerType;
  segment: CustomerSegment;

  // Basic Info
  name: string;
  nameArabic?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;

  // UAE-specific address
  address?: string;
  addressArabic?: string;
  city?: string;
  emirate?: UAEEmirate;
  area?: string;
  postalCode?: string;
  country: string;

  // Business Info
  companyName?: string;
  tradeLicense?: string;
  taxId?: string;
  vatNumber?: string;

  // Demographics
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  language: 'en' | 'ar';

  // Financial
  creditLimit?: number;
  currentBalance: number;
  totalLifetimeValue: number;

  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  isActive: boolean;

  // Meta
  createdAt: Date;
  updatedAt: Date;
  lastInteraction?: Date;
}

export interface CustomerContact {
  id: string;
  customerId: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerHistory {
  id: string;
  customerId: string;
  eventType: string;
  description: string;
  amount?: number;
  referenceId?: string;
  createdAt: Date;
  createdById: string;
}

export interface CustomerPreference {
  id: string;
  customerId: string;
  fragranceTypes: string[];
  preferredBrands: string[];
  priceRangeMin?: number;
  priceRangeMax?: number;
  occasions: string[];
  seasons: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Loyalty Program Types
export interface LoyaltyAccount {
  id: string;
  customerId: string;
  points: number;
  tier: LoyaltyTier;
  totalEarned: number;
  totalRedeemed: number;
  tierProgress: number;
  nextTierPoints: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTransaction {
  id: string;
  accountId: string;
  type: 'EARN' | 'REDEEM' | 'EXPIRE' | 'BONUS';
  points: number;
  description: string;
  referenceId?: string;
  orderId?: string;
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  descriptionArabic?: string;
  type: 'DISCOUNT' | 'FREE_PRODUCT' | 'EXCLUSIVE_ACCESS';
  pointsCost: number;
  discountPercent?: number;
  freeProductId?: string;
  minTier: LoyaltyTier;
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
  usageLimit?: number;
  timesUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardClaim {
  id: string;
  accountId: string;
  rewardId: string;
  pointsUsed: number;
  orderId?: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  claimedAt: Date;
  usedAt?: Date;
  expiresAt?: Date;
}

// Communication Types
export interface Communication {
  id: string;
  customerId: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  contentArabic?: string;
  channel?: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failureReason?: string;
  createdAt: Date;
  createdById: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  contentArabic?: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Customer Service Types
export interface SupportTicket {
  id: string;
  customerId: string;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category?: string;
  assignedToId?: string;
  resolutionTime?: number;
  satisfaction?: number;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  createdById: string;
}

export interface CustomerFeedback {
  id: string;
  customerId: string;
  orderId?: string;
  type: 'PRODUCT' | 'SERVICE' | 'GENERAL';
  rating: number;
  comment?: string;
  isPublic: boolean;
  createdAt: Date;
}

// VIP Management Types
export interface VIPBenefit {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  descriptionArabic?: string;
  type: 'DISCOUNT' | 'FREE_SHIPPING' | 'EARLY_ACCESS';
  value?: string;
  minTier: LoyaltyTier;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalShopper {
  id: string;
  userId: string;
  name: string;
  nameArabic?: string;
  email: string;
  phone: string;
  languages: string[];
  specialties: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalShopperAssignment {
  id: string;
  shopperId: string;
  customerId: string;
  assignedAt: Date;
  isActive: boolean;
}

// Analytics Types
export interface CustomerLifetimeValue {
  customerId: string;
  totalValue: number;
  averageOrderValue: number;
  orderFrequency: number;
  lastOrderDate: Date;
  predictedValue: number;
  riskScore: number;
}

export interface PurchaseBehaviorAnalysis {
  customerId: string;
  preferredCategories: string[];
  averageOrderSize: number;
  preferredPriceRange: {
    min: number;
    max: number;
  };
  seasonalPatterns: {
    season: string;
    purchaseFrequency: number;
  }[];
  brandLoyalty: {
    brandId: string;
    purchaseCount: number;
    percentage: number;
  }[];
}

export interface SeasonalBuyingPattern {
  season: string;
  month: number;
  totalSales: number;
  orderCount: number;
  topProducts: {
    productId: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface ProductRecommendation {
  customerId: string;
  productId: string;
  score: number;
  reason: string;
  confidence: number;
}

export interface ChurnPrediction {
  customerId: string;
  churnProbability: number;
  riskFactors: string[];
  retentionStrategy: string;
  lastInteractionDays: number;
}

// API Request/Response Types
export interface CreateCustomerRequest {
  customerType: CustomerType;
  segment: CustomerSegment;
  name: string;
  nameArabic?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  addressArabic?: string;
  city?: string;
  emirate?: UAEEmirate;
  area?: string;
  postalCode?: string;
  companyName?: string;
  tradeLicense?: string;
  taxId?: string;
  vatNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  language?: 'en' | 'ar';
  creditLimit?: number;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string;
}

export interface CreateLoyaltyAccountRequest {
  customerId: string;
  initialPoints?: number;
}

export interface AddLoyaltyPointsRequest {
  accountId: string;
  points: number;
  description: string;
  referenceId?: string;
  orderId?: string;
}

export interface RedeemRewardRequest {
  accountId: string;
  rewardId: string;
  orderId?: string;
}

export interface SendCommunicationRequest {
  customerId: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  contentArabic?: string;
  scheduledAt?: Date;
}

export interface CreateTicketRequest {
  customerId: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  category?: string;
}

export interface TicketResponseRequest {
  ticketId: string;
  content: string;
  isInternal?: boolean;
}

// Dashboard Types
export interface CRMDashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  vipCustomers: number;
  totalLoyaltyPoints: number;
  averageLifetimeValue: number;
  customerSatisfactionScore: number;
  openTickets: number;
}

export interface LoyaltyDashboardStats {
  totalMembers: number;
  activeMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  tierDistribution: {
    tier: LoyaltyTier;
    count: number;
    percentage: number;
  }[];
  topRewards: {
    rewardId: string;
    name: string;
    claimCount: number;
  }[];
}

// Search and Filter Types
export interface CustomerSearchFilters {
  search?: string;
  segment?: CustomerSegment;
  customerType?: CustomerType;
  tier?: LoyaltyTier;
  emirate?: UAEEmirate;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  dateFrom?: Date;
  dateTo?: Date;
  minLifetimeValue?: number;
  maxLifetimeValue?: number;
}

export interface TicketSearchFilters {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assignedToId?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Integration Types
export interface WhatsAppBusinessConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
  businessAccountId: string;
}

export interface SMSGatewayConfig {
  provider: 'TWILIO' | 'AWS_SNS' | 'VONAGE';
  apiKey: string;
  apiSecret: string;
  senderId: string;
}

export interface EmailServiceConfig {
  provider: 'SENDGRID' | 'MAILGUN' | 'AWS_SES';
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

// Notification Types
export interface NotificationPreferences {
  customerId: string;
  emailMarketing: boolean;
  smsMarketing: boolean;
  whatsappMarketing: boolean;
  birthdayOffers: boolean;
  restockAlerts: boolean;
  orderUpdates: boolean;
  loyaltyUpdates: boolean;
}

export interface AutomatedNotification {
  id: string;
  type: 'BIRTHDAY' | 'RESTOCK' | 'LOYALTY_TIER_UPGRADE' | 'ABANDONED_CART';
  customerId: string;
  templateId: string;
  scheduledAt: Date;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: Date;
}