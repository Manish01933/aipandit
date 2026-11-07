export type DiscountType = 'percentage' | 'fixed_amount' | 'free_access';

export type CouponEligibility = 'all' | 'specific_plans' | 'specific_modules';

export type CouponDurationOption =
  | 'default'
  | '7_days'
  | '30_days'
  | '90_days'
  | '365_days'
  | 'custom'
  | 'lifetime';

export type CouponUserRestrictionMode = 'anyone' | 'selected_users';

export interface CouponRule {
  id: string;
  code: string;                      // e.g. 'FREEVIP', 'ASTROFREE100', 'SAVE50'
  titleHi: string;
  titleEn: string;
  descriptionHi?: string;
  descriptionEn?: string;
  discountType: DiscountType;        // 'percentage' | 'fixed_amount' | 'free_access'
  discountValue: number;             // percentage (e.g. 50 = 50%) or INR (e.g. 200 = ₹200) or 100 for free
  isActive: boolean;
  isConfigured: boolean;             // false if unconfigured code needing admin attention
  isMasterCode?: boolean;            // true for standard system codes
  requiresAdminRole?: boolean;       // restricted to authenticated admin
  eligiblePlans: string[];           // plan IDs or ['*'] for all
  eligibleModules: string[];         // module IDs or ['*']
  minPurchaseAmount: number;         // in INR (0 for no min)
  maxDiscountAmount?: number;        // in INR cap for percentage discounts
  startDate: string;                 // ISO date
  expiryDate: string | null;         // null = no expiry
  maxTotalUses: number;              // 0 = unlimited
  currentTotalUses: number;
  maxUsesPerUser: number;            // default 1
  canCombine: boolean;               // false by default
  // Enhanced duration and restriction options
  durationOption?: CouponDurationOption;
  overrideDurationDays?: number | null; // null = plan default, 0 = lifetime, >0 = specific days
  allowLifetime?: boolean;
  userRestrictionMode?: CouponUserRestrictionMode; // 'anyone' | 'selected_users'
  allowedUsers?: string[];           // emails, phone numbers, or userIds
  targetCustomerEmail?: string | null;
  targetCustomerName?: string | null;
  createdAt: string;
  updatedAt: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
  revokeReason?: string | null;
}

export interface CouponRedemptionRecord {
  id: string;
  couponId: string;
  couponCode: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  planId: string;
  planName?: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  isFreeAccess: boolean;
  grantedDurationDays: number;       // 0 = lifetime, or N days
  expiresAt: string | null;
  entitlementId: string;
  status: 'active' | 'revoked';
  redeemedAt: string;
  transactionId?: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
  revokeReason?: string | null;
}

export interface AdminAuditEvent {
  id: string;
  action:
    | 'create_coupon'
    | 'update_coupon'
    | 'deactivate_coupon'
    | 'activate_coupon'
    | 'revoke_coupon'
    | 'revoke_redemption'
    | 'activate_admin_vip'
    | 'grant_access'
    | 'create_backup'
    | 'restore_backup';
  performedBy: string;
  targetId: string;
  targetType: 'coupon' | 'redemption' | 'entitlement' | 'user' | 'system';
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_access';
  discountValue: number;
  discountAmount: number;
  finalPrice: number;
  originalPrice: number;
  isFreeAccess: boolean;
  grantedDurationDays?: number;      // 0 = lifetime, >0 = days
  expiresAt?: string | null;
  message: string;
  couponRule?: CouponRule;
}

export type PlanBillingType = 'one_time' | 'recurring';

export type PlanCategory = 'profile_specific' | 'account_vip' | 'general';

export interface PlanCatalogItem {
  id: string;
  nameHi: string;
  nameEn: string;
  descriptionHi: string;
  descriptionEn: string;
  price: number;                     // in INR
  originalPrice?: number;
  billingType: PlanBillingType;      // 'one_time' | 'recurring'
  durationDays: number;              // 0 = lifetime / permanent, 30 = monthly, 90 = quarterly, etc.
  includedModules: string[];         // ['jagannatha', 'loshu', 'numerology'] or ['*']
  featuresHi: string[];
  featuresEn: string[];
  reportLimits?: number;             // e.g. 0 = unlimited
  planCategory?: PlanCategory;       // 'profile_specific' for Plan A/B, 'account_vip' for Plan C
  defaultQuestionCredits?: number;   // 5 for Explorer/Report, -1 for VIP (unlimited)
  defaultPdfCredits?: number;        // 0 for Explorer, 1 for Report, 2 for VIP
  allocatedMinutes?: number;         // 15 for Explorer (₹299), 35 for Report (₹499), 120 for VIP (₹999)
  couponEligible: boolean;
  isActive: boolean;
  isPopular?: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PresetQuestion {
  id: string;
  questionHi: string;
  questionEn: string;
  category: 'career' | 'marriage' | 'wealth' | 'remedies' | 'dosha' | 'future' | 'timeline' | 'general';
  isActive: boolean;
  order: number;
}

export interface VerifiedEntitlement {
  id: string;
  userId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  planId: string;
  planName: string;
  billingType: PlanBillingType;
  unlockedModules: string[];
  grantedAt: string;
  expiresAt: string | null;          // null = lifetime / permanent
  paymentId?: string;
  orderId?: string;
  couponCodeUsed?: string;
  isActive: boolean;
  // Per-profile and credit entitlements (3-tier plans)
  profileId?: string;                // Specific birth profile ID for Plan A/B
  profileName?: string;
  questionCreditsRemaining?: number;// 5 initially for Plan A/B, -1 for VIP
  pdfCreditsRemaining?: number;     // 0 for Explorer, 1 for Report, 2 for VIP/billing cycle
  downloadedReportProfileIds?: string[]; // Profiles where PDF was generated (free re-downloads)
  canFreeTextChat?: boolean;         // false for Plan A/B, true for Plan C VIP
  questionsAskedLog?: Array<{ question: string; askedAt: string }>;
  autoRenew?: boolean;
  cancellationPending?: boolean;
  cancelledAt?: string;
  billingCycleNumber?: number;
}

export interface TransactionRecord {
  id: string;
  orderId?: string;
  paymentId?: string;
  signature?: string;
  userId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  planId: string;
  planTitle: string;
  amount: number;                    // Final amount paid in INR
  originalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: 'razorpay' | 'upi_qr' | 'free_coupon' | 'vip_pass';
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  isVerified: boolean;
  notes?: Record<string, string>;
  createdAt: string;
  verifiedAt?: string;
}

export interface GrantedUserRecord {
  id: string;
  recipientName: string;
  recipientEmailOrPhone: string;
  planId: string;
  planName: string;
  durationDays: number;              // 0 = lifetime, 30 = 30 days, 365 = 1 year
  grantedAt: string;
  expiresAt: string | null;
  passCode: string;
  token: string;
  shareableLink: string;
  status: 'active' | 'revoked';
  notes?: string;
  grantedBy: string;
}

