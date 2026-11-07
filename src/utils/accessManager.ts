export type AccessRole = 'admin' | 'vip' | 'customer';

export type SubscriptionPlanId =
  | 'plan_kundli_explorer'
  | 'plan_kundli_report'
  | 'plan_astrodost_vip'
  | '1_month'
  | '3_months'
  | '6_months'
  | 'lifetime';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  nameHi: string;
  nameEn: string;
  durationDays: number; // 30, 90, 180, 0 (0 = lifetime)
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeHi?: string;
  taglineHi: string;
  taglineEn: string;
  isPopular?: boolean;
  allocatedMinutes?: number; // 15, 35, 120
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanId, SubscriptionPlan> = {
  plan_kundli_explorer: {
    id: 'plan_kundli_explorer',
    nameHi: 'AI ज्योतिषी त्वरित परामर्श (15 मिनट)',
    nameEn: 'AI Jyotish Consultation (15 Min)',
    durationDays: 0,
    price: 299,
    originalPrice: 499,
    badge: 'STARTER • 15 MIN ⏱️',
    badgeHi: 'शुरुआती पैक • 15 मिनट परामर्श',
    taglineHi: '15 मिनट लाइव AI ज्योतिषी परामर्श (चैट/वॉइस) + D1 जन्मकुंडली व महादशा सारांश',
    taglineEn: '15 Min live AI consultation (chat/voice) + D1 birth chart & dasha overview',
    allocatedMinutes: 15,
  },
  plan_kundli_report: {
    id: 'plan_kundli_report',
    nameHi: 'जगन्नाथ होरा सम्पूर्ण २५-पेज महा-कुंडली (35 मिनट)',
    nameEn: 'Jagannatha Hora & 25-Page Kundali (35 Min)',
    durationDays: 0,
    price: 499,
    originalPrice: 999,
    badge: '⭐ सर्वाधिक लोकप्रिय • BEST SELLER (HERO)',
    badgeHi: '⭐ सर्वाधिक लोकप्रिय • 50% छूट',
    taglineHi: '२५-पृष्ठों की सम्पूर्ण मास्टर PDF कुंडली रिपोर्ट + जगन्नाथ होरा (D1-D60) + 35 मिनट AI परामर्श',
    taglineEn: '1 Full 25-page PDF Kundli report + Swiss Ephemeris Jagannatha Hora + 35 min AI consultation',
    isPopular: true,
    allocatedMinutes: 35,
  },
  plan_astrodost_vip: {
    id: 'plan_astrodost_vip',
    nameHi: 'एस्ट्रोदोस्त VIP ऑल-इन-वन (120 मिनट / 2 घंटे)',
    nameEn: 'AstroDost VIP All-In-One (120 Min / 2 Hours)',
    durationDays: 30,
    price: 999,
    originalPrice: 1999,
    badge: '👑 VIP ALL-ACCESS • 120 MIN',
    badgeHi: '120 मिनट (2 घंटे) 👑 50% महाबचत',
    taglineHi: '120 मिनट (2 घंटे) वीआईपी AI परामर्श + 2 सम्पूर्ण 25-पेज PDF रिपोर्ट्स + लो शू व अंक ज्योतिष',
    taglineEn: '120 Min VIP AI consultation + 2 Full 25-Page PDF reports + all modules unlocked',
    allocatedMinutes: 120,
  },
  '1_month': {
    id: '1_month',
    nameHi: '1 माह योजना (1 Month Access)',
    nameEn: '1 Month All-Access Plan',
    durationDays: 30,
    price: 999,
    originalPrice: 1499,
    badge: 'STARTER',
    badgeHi: 'शुरुआती प्लान',
    taglineHi: '30 दिन के लिए तीनों सर्विसेज (स्विस एफिमेरिस, लो शू ग्रिड, अंक ज्योतिष) का संपूर्ण एक्सेस',
    taglineEn: '30 Days complete access to all 3 premium services',
  },
  '3_months': {
    id: '3_months',
    nameHi: '3 माह योजना (3 Months Access)',
    nameEn: '3 Months All-Access Plan',
    durationDays: 90,
    price: 1999,
    originalPrice: 2999,
    badge: 'POPULAR ⭐',
    badgeHi: 'सर्वाधिक लोकप्रिय',
    taglineHi: '90 दिन की निरंतर ज्योतिषीय गणना, गोचर, लो शू महायोग व उपाय',
    taglineEn: '90 Days full access with continuous planetary updates & remedies',
    isPopular: true,
  },
  '6_months': {
    id: '6_months',
    nameHi: '6 माह योजना (6 Months Access)',
    nameEn: '6 Months All-Access Plan',
    durationDays: 180,
    price: 3999,
    originalPrice: 5999,
    badge: 'BEST VALUE 💎',
    badgeHi: 'सर्वश्रेष्ठ बचत',
    taglineHi: '180 दिन का अर्धवार्षिक संपूर्ण कुंडली, लो शू ग्रिड व अंक ज्योतिष पैकेज',
    taglineEn: '180 Days semi-annual complete predictive & remedial suite',
  },
  'lifetime': {
    id: 'lifetime',
    nameHi: 'लाइफटाइम एक्सेस (Lifetime Access)',
    nameEn: 'Lifetime VIP All-Access',
    durationDays: 0, // 0 = permanent
    price: 9999,
    originalPrice: 19999,
    badge: 'LIFETIME VIP 👑',
    badgeHi: 'आजीवन असीमित',
    taglineHi: 'आजीवन असीमित एक्सेस — कभी कोई नवीनीकरण या अतिरिक्त शुल्क नहीं',
    taglineEn: 'Permanent unlimited VIP access — Never pay again',
  },
};

export function getEffectiveSubscriptionPlans(): Record<SubscriptionPlanId, SubscriptionPlan> {
  const settings = getAdminSettings();
  return {
    'plan_kundli_explorer': {
      ...SUBSCRIPTION_PLANS['plan_kundli_explorer'],
      price: (settings as any).planKundliExplorerPrice || 299,
    },
    'plan_kundli_report': {
      ...SUBSCRIPTION_PLANS['plan_kundli_report'],
      price: (settings as any).planKundliReportPrice || 499,
    },
    'plan_astrodost_vip': {
      ...SUBSCRIPTION_PLANS['plan_astrodost_vip'],
      price: settings.plan1MonthPrice || 999,
    },
    '1_month': {
      ...SUBSCRIPTION_PLANS['1_month'],
      price: settings.plan1MonthPrice || 999,
    },
    '3_months': {
      ...SUBSCRIPTION_PLANS['3_months'],
      price: settings.plan3MonthsPrice || 1999,
    },
    '6_months': {
      ...SUBSCRIPTION_PLANS['6_months'],
      price: settings.plan6MonthsPrice || 3999,
    },
    'lifetime': {
      ...SUBSCRIPTION_PLANS['lifetime'],
      price: settings.planLifetimePrice || 9999,
    },
  };
}

export interface AdminSettings {
  upiId: string;
  upiName: string;
  secondaryUpiId: string;
  secondaryUpiName: string;
  plan1MonthPrice: number;
  plan3MonthsPrice: number;
  plan6MonthsPrice: number;
  planLifetimePrice: number;
  singleModulePrice: number;
  bundlePrice: number;
  adminPin: string;
  whatsappNumber: string;
  contactEmail: string;
  razorpayKeyId: string;
  razorpayKeySecret?: string;
  openRouterApiKey?: string;
}

export interface VipPass {
  id: string;
  clientName: string;
  token: string;
  code: string;
  modules: string[]; // ['all'] or ['jagannatha', 'loshu', 'numerology']
  createdAt: string;
  expiryDays: number;
  shareableLink: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  moduleIds: string[];
  moduleTitle: string;
  utrNumber: string;
  paymentMethod: 'upi_qr' | 'gpay' | 'phonepe' | 'paytm' | 'card' | 'vip_code' | 'razorpay';
  clientName: string;
  status: 'confirmed' | 'pending';
}

export interface AccessState {
  role: AccessRole;
  isAdminUnlocked: boolean;
  isVipUnlocked: boolean;
  vipClientName: string;
  vipPassCode?: string;
  unlockedModules: string[]; // ['jagannatha', 'loshu', 'numerology'] or ['*']
  activatedAt?: string;
  planId?: SubscriptionPlanId;
  expiresAt?: string | null;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  upiId: 'darksecrets0unveiled@okhdfcbank',
  upiName: 'AstroDost AI Acharya Manish Ji',
  secondaryUpiId: 'pari.sharma2342@okaxis',
  secondaryUpiName: 'Meenakshi Sharma',
  plan1MonthPrice: 999,
  plan3MonthsPrice: 1999,
  plan6MonthsPrice: 3999,
  planLifetimePrice: 9999,
  singleModulePrice: 499,
  bundlePrice: 999,
  adminPin: 'manishastrodostai@111',
  whatsappNumber: '+91 98886 00000',
  contactEmail: 'manish98886@gmail.com',
  razorpayKeyId: '',
  razorpayKeySecret: '',
  openRouterApiKey: '',
};

export type BannerAnimationStyle =
  | 'gold_aura'
  | 'pulse_glow'
  | 'neon_border'
  | 'marquee_flow'
  | 'cosmic_sparkle'
  | 'floating_wave'
  | 'luxury_static';

export interface AdminPromotionalBanner {
  id: string;
  isActive: boolean;
  title: string;
  subtitle: string;
  badgeText: string;
  imageUrl: string;
  displayMode?: 'separate_promo' | 'hero_overlay' | 'full_image' | 'split_card';
  animationStyle: BannerAnimationStyle;
  actionText: string;
  actionType: 'tab' | 'url' | 'whatsapp' | 'pro_modal';
  actionTarget: string;
  placement: 'top_hero' | 'announcement_bar' | 'floating_badge';
  updatedAt: string;
}

export type AnnouncementCategory =
  | 'general'
  | 'festival'
  | 'astrology_tip'
  | 'special_offer'
  | 'transit_alert'
  | 'guru_message';

export interface AdminAnnouncementInfo {
  id: string;
  isActive: boolean;
  title: string;
  category: AnnouncementCategory;
  categoryLabelHi: string;
  categoryLabelEn: string;
  message: string;
  badgeColor: 'amber' | 'emerald' | 'rose' | 'indigo' | 'sky';
  linkUrl?: string;
  actionTab?: string;
  actionText?: string;
  createdAt: string;
  isPinned?: boolean;
}

export const DEFAULT_PROMOTIONAL_BANNER: AdminPromotionalBanner = {
  id: 'banner_default_01',
  isActive: true,
  title: '✨ विशेष वैदिक AI ज्योतिषी परामर्श एवं राजयोग मुहूर्त',
  subtitle: 'आज ही अपनी विस्तृत जन्मकुंडली, करियर, विवाह व जीवन समस्याओं का सटीक समाधान पाएं।',
  badgeText: 'SPECIAL PROMO 🌟',
  imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop',
  displayMode: 'separate_promo',
  animationStyle: 'gold_aura',
  actionText: 'AI ज्योतिषी से पूछें ➔',
  actionType: 'tab',
  actionTarget: 'chat',
  placement: 'top_hero',
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_ANNOUNCEMENTS: AdminAnnouncementInfo[] = [
  {
    id: 'info_01',
    isActive: true,
    title: 'सर्वार्थ सिद्धि योग विशेष मुहूर्त प्रारंभ',
    category: 'festival',
    categoryLabelHi: 'मुहूर्त व पर्व 🪔',
    categoryLabelEn: 'Auspicious Muhurat',
    message: 'आज का दिन नए कार्य, वाहन क्रय एवं व्यापार शुभारंभ हेतु अत्यंत शुभ है। पंचांग में शुभ चौघड़िया समय देखें।',
    badgeColor: 'amber',
    createdAt: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 'info_02',
    isActive: true,
    title: '24/7 वैदिक AI ज्योतिषी सेवा उपलब्ध',
    category: 'astrology_tip',
    categoryLabelHi: 'AI गुरु 🌟',
    categoryLabelEn: 'AI Guidance',
    message: 'अपने करियर, नौकरी, विवाह या स्वास्थ्य से जुड़ा कोई भी प्रश्न सीधे AI ज्योतिषी से पूछें और तुरंत वैदिक समाधान पाएं।',
    badgeColor: 'emerald',
    createdAt: new Date().toISOString(),
    actionTab: 'chat',
    actionText: 'परामर्श लें',
    isPinned: false,
  },
];

export function getStoredPromotionalBanner(): AdminPromotionalBanner {
  try {
    const raw = localStorage.getItem('astrodost_promotional_banner');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_PROMOTIONAL_BANNER,
          ...parsed,
          isActive: true, // Always visible as requested by user
          imageUrl: (parsed.imageUrl && typeof parsed.imageUrl === 'string' && parsed.imageUrl.trim() !== '')
            ? parsed.imageUrl
            : DEFAULT_PROMOTIONAL_BANNER.imageUrl,
          displayMode: (parsed.displayMode === 'full_image' || parsed.displayMode === 'hero_overlay')
            ? parsed.displayMode
            : 'separate_promo',
        };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_PROMOTIONAL_BANNER;
}

export function savePromotionalBanner(banner: AdminPromotionalBanner): AdminPromotionalBanner {
  try {
    localStorage.setItem('astrodost_promotional_banner', JSON.stringify(banner));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('astrodost_banner_updated', { detail: banner }));
    }
  } catch {
    // ignore
  }
  return banner;
}

export function getStoredAnnouncements(): AdminAnnouncementInfo[] {
  try {
    const raw = localStorage.getItem('astrodost_announcement_infos');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_ANNOUNCEMENTS;
}

export function saveAnnouncements(list: AdminAnnouncementInfo[]): AdminAnnouncementInfo[] {
  try {
    localStorage.setItem('astrodost_announcement_infos', JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('astrodost_announcements_updated', { detail: list }));
    }
  } catch {
    // ignore
  }
  return list;
}

export function addAnnouncement(item: Omit<AdminAnnouncementInfo, 'id' | 'createdAt'>): AdminAnnouncementInfo[] {
  const current = getStoredAnnouncements();
  const newItem: AdminAnnouncementInfo = {
    ...item,
    id: 'info_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  return saveAnnouncements(updated);
}

export function deleteAnnouncement(id: string): AdminAnnouncementInfo[] {
  const current = getStoredAnnouncements();
  const updated = current.filter((item) => item.id !== id);
  return saveAnnouncements(updated);
}

export function toggleAnnouncementStatus(id: string): AdminAnnouncementInfo[] {
  const current = getStoredAnnouncements();
  const updated = current.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item));
  return saveAnnouncements(updated);
}

const DEFAULT_VIP_CODES = [
  'FREEVIP',
  'GURUGIFT',
  'ASTRO100',
  'ADMINVIP',
  'FREE2026',
  'OMSHANTI',
  'JYOTISHGIFT',
  'ASTRODOSTVIP',
  'VIPFREE',
  'MANISH',
  '111',
  'MANISH98886',
  '98886',
  'ADMIN',
  '1234',
  'VIP',
];

const PAID_MODULE_KEYS = ['jagannatha', 'loshu', 'numerology'];

export function getAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem('astrodost_admin_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.adminPin === '1234' || !parsed.adminPin) {
        parsed.adminPin = 'manishastrodostai@111';
      }
      return { ...DEFAULT_ADMIN_SETTINGS, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_ADMIN_SETTINGS;
}

export function saveAdminSettings(settings: Partial<AdminSettings>): AdminSettings {
  const current = getAdminSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem('astrodost_admin_settings', JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function getStoredAccessState(): AccessState {
  try {
    const raw = localStorage.getItem('astrodost_access_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        // If user already authenticated as admin token in localStorage, ensure admin unlocked
        const savedToken = localStorage.getItem('astrodost_admin_token');
        if (savedToken && !parsed.isAdminUnlocked) {
          parsed.isAdminUnlocked = true;
          parsed.isVipUnlocked = true;
          parsed.role = 'admin';
          parsed.unlockedModules = ['*'];
        }
        return parsed;
      }
    }
    const savedToken = localStorage.getItem('astrodost_admin_token');
    if (savedToken) {
      return {
        role: 'admin',
        isAdminUnlocked: true,
        isVipUnlocked: true,
        vipClientName: 'Acharya Manish (Master Admin)',
        unlockedModules: ['*'],
        activatedAt: new Date().toISOString(),
      };
    }
  } catch {
    // ignore
  }
  return {
    role: 'customer',
    isAdminUnlocked: false,
    isVipUnlocked: false,
    vipClientName: '',
    unlockedModules: [],
  };
}

export function saveAccessState(state: AccessState): void {
  try {
    localStorage.setItem('astrodost_access_state', JSON.stringify(state));
    if (state.isAdminUnlocked) {
      localStorage.setItem('astrodost_admin_token', 'manishastrodostai@111');
    }
  } catch {
    // ignore
  }
}

/**
 * Parses query params from current URL to detect Admin or VIP free links.
 */
export function initAccessFromUrl(): { state: AccessState; newlyActivated: boolean; message?: string } {
  const currentState = getStoredAccessState();
  if (typeof window === 'undefined') {
    return { state: currentState, newlyActivated: false };
  }

  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get('mode')?.toLowerCase();
  const roleParam = params.get('role')?.toLowerCase();
  const vipParam = params.get('vip')?.toLowerCase();
  const accessParam = params.get('access')?.toLowerCase();
  const keyParam = params.get('key')?.toLowerCase();
  const tokenParam = params.get('token');
  const codeParam = params.get('code');
  const clientParam = params.get('client');
  const adminParam = params.get('admin');
  const hash = window.location.hash?.toLowerCase() || '';

  // Check 1: Explicit Admin Mode in Link (?mode=admin, ?admin=1, ?key=1, ?key=admin, #admin, #key)
  const isAdminRequest =
    modeParam === 'admin' ||
    roleParam === 'admin' ||
    adminParam === '1' ||
    adminParam === 'true' ||
    keyParam === '1' ||
    keyParam === 'admin' ||
    keyParam === 'master' ||
    hash === '#admin' ||
    hash === '#key';

  if (isAdminRequest) {
    const adminState: AccessState = {
      ...currentState,
      role: 'admin',
      isAdminUnlocked: true,
      isVipUnlocked: true,
      vipClientName: 'Acharya Manish (Master Admin)',
      unlockedModules: ['*'],
      activatedAt: new Date().toISOString(),
    };
    saveAccessState(adminState);
    try {
      localStorage.setItem('astrodost_admin_token', 'manishastrodostai@111');
    } catch {}
    return {
      state: adminState,
      newlyActivated: true,
      message: '👑 Master Admin & VIP All-Access Unlocked (Acharya Manish)',
    };
  }

  // Check 2: Customer Forced Link (?mode=customer)
  if (modeParam === 'customer' || roleParam === 'customer') {
    if (!currentState.isVipUnlocked && !currentState.isAdminUnlocked) {
      const customerState: AccessState = {
        role: 'customer',
        isAdminUnlocked: false,
        isVipUnlocked: false,
        vipClientName: '',
        unlockedModules: currentState.unlockedModules || [],
      };
      saveAccessState(customerState);
      return { state: customerState, newlyActivated: false };
    }
  }

  // Check 3: Free Pass / VIP Link (?vip=free / ?free_pass=1 / ?plan=... / ?token=VIP-...)
  const isVipUrl =
    vipParam === 'free' ||
    vipParam === '1' ||
    vipParam === 'true' ||
    accessParam === 'vip_unlocked' ||
    accessParam === 'free' ||
    (tokenParam && tokenParam.toUpperCase().startsWith('VIP-')) ||
    (codeParam && isCodeValid(codeParam));

  const planParam = params.get('plan')?.toLowerCase();
  const freePassParam = params.get('free_pass')?.toLowerCase();

  if (isVipUrl || freePassParam === '1' || freePassParam === 'true') {
    const clientName = clientParam ? decodeURIComponent(clientParam) : 'VIP Member';
    const effectiveToken = tokenParam || codeParam || 'FREE-PASS-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    let targetPlan: SubscriptionPlanId = 'plan_astrodost_vip';
    let unlockedModules = ['*'];
    let planTitle = 'AstroDost VIP All-Access';

    if (planParam === 'plan_kundli_explorer' || planParam === 'explorer') {
      targetPlan = 'plan_kundli_explorer';
      unlockedModules = ['jagannatha'];
      planTitle = 'Kundli Explorer';
    } else if (planParam === 'plan_kundli_report' || planParam === 'report') {
      targetPlan = 'plan_kundli_report';
      unlockedModules = ['jagannatha'];
      planTitle = 'Kundli Report';
    }

    const isVipFull = targetPlan === 'plan_astrodost_vip';
    const vipState: AccessState = {
      role: isVipFull ? 'vip' : 'customer',
      isAdminUnlocked: currentState.isAdminUnlocked,
      isVipUnlocked: isVipFull,
      vipClientName: clientName,
      vipPassCode: codeParam || tokenParam || 'FREE-GIFT-PASS',
      unlockedModules,
      planId: targetPlan,
      activatedAt: new Date().toISOString(),
    };
    saveAccessState(vipState);

    // Sync with backend server in background
    try {
      const storedUser = localStorage.getItem('astrodost_user');
      const userId = storedUser ? JSON.parse(storedUser).id || 'default_user' : 'default_user';
      fetch('/api/entitlements/sync-free-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: effectiveToken,
          planId: targetPlan,
          clientName,
          targetUserId: userId,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    return {
      state: vipState,
      newlyActivated: true,
      message: `🎉 100% मुफ़्त एक्सेस सक्रिय! ${clientName} के लिए ${planTitle} अनलॉक हो गया है।`,
    };
  }

  return { state: currentState, newlyActivated: false };
}

export function isCodeValid(code: string): boolean {
  if (!code) return false;
  const normalized = code.trim().toUpperCase();
  if (DEFAULT_VIP_CODES.includes(normalized)) return true;

  // Check stored custom passes
  const customPasses = getStoredVipPasses();
  return customPasses.some((p) => p.code.toUpperCase() === normalized || p.token.toUpperCase() === normalized);
}

export function verifyAndUnlockWithVipCode(
  inputCode: string,
  clientName?: string
): { success: boolean; message: string; clientName: string } {
  if (!inputCode) {
    return { success: false, message: 'कृपया वैध VIP कोड दर्ज करें।', clientName: '' };
  }

  const normalized = inputCode.trim().toUpperCase();
  const isValid = isCodeValid(normalized);

  if (!isValid) {
    return {
      success: false,
      message: 'अमान्य VIP कोड। कृपया सही कोड दर्ज करें या एडमिन से संपर्क करें।',
      clientName: '',
    };
  }

  const effectiveClient = clientName?.trim() || 'VIP Client';
  const currentState = getStoredAccessState();
  const updatedState: AccessState = {
    ...currentState,
    role: currentState.isAdminUnlocked ? 'admin' : 'vip',
    isVipUnlocked: true,
    vipClientName: effectiveClient,
    vipPassCode: normalized,
    unlockedModules: ['*'],
    activatedAt: new Date().toISOString(),
  };

  saveAccessState(updatedState);
  recordPayment({
    id: 'VIP-' + Date.now().toString(36),
    date: new Date().toLocaleDateString('hi-IN'),
    amount: 0,
    moduleIds: ['*'],
    moduleTitle: 'All-Access VIP Pass (Admin Gift Code)',
    utrNumber: `CODE: ${normalized}`,
    paymentMethod: 'vip_code',
    clientName: effectiveClient,
    status: 'confirmed',
  });

  return {
    success: true,
    message: `🎉 VIP कोड स्वीकृत! आपके लिए सभी प्रीमियम मॉड्यूल 100% मुफ्त अनलॉक कर दिए गए हैं।`,
    clientName: effectiveClient,
  };
}

export function isSubscriptionActive(state?: AccessState): {
  isActive: boolean;
  isLifetime: boolean;
  daysRemaining: number;
  expiresAtFormatted?: string;
  planId?: SubscriptionPlanId;
} {
  const current = state || getStoredAccessState();
  if (current.isAdminUnlocked || current.isVipUnlocked) {
    return { isActive: true, isLifetime: true, daysRemaining: 9999, planId: 'lifetime' };
  }
  if (!current.unlockedModules || current.unlockedModules.length === 0) {
    return { isActive: false, isLifetime: false, daysRemaining: 0 };
  }
  // If user has unlocked modules but no expiresAt, treat as lifetime
  if (!current.expiresAt) {
    return { isActive: true, isLifetime: true, daysRemaining: 9999, planId: current.planId || 'lifetime' };
  }

  const expiryTime = new Date(current.expiresAt).getTime();
  const now = Date.now();
  if (now > expiryTime) {
    return { isActive: false, isLifetime: false, daysRemaining: 0, planId: current.planId };
  }
  const diffDays = Math.max(1, Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24)));
  return {
    isActive: true,
    isLifetime: false,
    daysRemaining: diffDays,
    expiresAtFormatted: new Date(current.expiresAt).toLocaleDateString('hi-IN'),
    planId: current.planId,
  };
}

export function isModuleUnlocked(moduleId: string, state?: AccessState): boolean {
  const current = state || getStoredAccessState();

  // If Admin or VIP, everything is unlocked
  if (current.isAdminUnlocked || current.isVipUnlocked) {
    return true;
  }

  // Free modules are always unlocked
  if (!PAID_MODULE_KEYS.includes(moduleId)) {
    return true;
  }

  // Check if subscription has expired
  const subStatus = isSubscriptionActive(current);
  if (!subStatus.isActive) {
    return false;
  }

  // Check specific module unlocks
  if (current.unlockedModules.includes('*') || current.unlockedModules.includes(moduleId)) {
    return true;
  }

  return false;
}

export function unlockModuleWithPayment(
  moduleIds: string[],
  moduleTitle: string,
  amount: number,
  utrNumber: string,
  method: 'upi_qr' | 'gpay' | 'phonepe' | 'paytm' | 'card' | 'razorpay',
  clientName: string,
  planId: SubscriptionPlanId = '1_month'
): AccessState {
  const current = getStoredAccessState();
  const currentUnlocked = new Set(current.unlockedModules);

  moduleIds.forEach((id) => currentUnlocked.add(id));

  // Compute expiry
  const plan = SUBSCRIPTION_PLANS[planId];
  let expiresAt: string | null = null;
  if (plan && plan.durationDays > 0) {
    const exp = new Date();
    exp.setDate(exp.getDate() + plan.durationDays);
    expiresAt = exp.toISOString();
  }

  const updated: AccessState = {
    ...current,
    unlockedModules: Array.from(currentUnlocked),
    planId,
    activatedAt: new Date().toISOString(),
    expiresAt,
  };

  saveAccessState(updated);

  recordPayment({
    id: 'PAY-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('hi-IN'),
    amount,
    moduleIds,
    moduleTitle: `${moduleTitle} [${plan ? plan.nameEn : planId}]`,
    utrNumber: utrNumber.trim() || 'VERIFIED-' + Math.floor(100000 + Math.random() * 900000),
    paymentMethod: method,
    clientName: clientName.trim() || 'Customer',
    status: 'confirmed',
  });

  return updated;
}

export function getStoredVipPasses(): VipPass[] {
  try {
    const raw = localStorage.getItem('astrodost_vip_passes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveVipPass(pass: VipPass): void {
  const current = getStoredVipPasses();
  const updated = [pass, ...current.filter((p) => p && p.id !== pass.id)];
  try {
    localStorage.setItem('astrodost_vip_passes', JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function deleteVipPass(id: string): void {
  const current = getStoredVipPasses();
  const updated = current.filter((p) => p && p.id !== id);
  try {
    localStorage.setItem('astrodost_vip_passes', JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getPaymentHistory(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem('astrodost_payment_history');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export function recordPayment(rec: PaymentRecord): void {
  const current = getPaymentHistory();
  const updated = [rec, ...current];
  try {
    localStorage.setItem('astrodost_payment_history', JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getBaseAppUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin + window.location.pathname;
  }
  return 'https://astrodost.ai';
}

/**
 * Creates a customized 100% Free VIP Link that can be shared with clients
 */
export function generateVipLink(clientName: string, expiryDays: number = 365): { pass: VipPass; fullUrl: string } {
  const token = 'VIP-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  const code = 'GIFT-' + Math.floor(1000 + Math.random() * 9000);
  const baseUrl = getBaseAppUrl();
  const clientParam = encodeURIComponent(clientName.trim() || 'Valued Client');
  const fullUrl = `${baseUrl}?vip=free&client=${clientParam}&token=${token}&code=${code}`;

  const pass: VipPass = {
    id: 'VP-' + Date.now().toString(36),
    clientName: clientName.trim() || 'Valued Client',
    token,
    code,
    modules: ['*'],
    createdAt: new Date().toLocaleDateString('hi-IN'),
    expiryDays,
    shareableLink: fullUrl,
  };

  saveVipPass(pass);
  return { pass, fullUrl };
}

/**
 * Creates standard Customer Link where paid modules require payment
 */
export function generateCustomerLink(): string {
  const baseUrl = getBaseAppUrl();
  return `${baseUrl}?mode=customer`;
}

/**
 * Creates Admin link to open the portal directly
 */
export function generateAdminLink(pin?: string): string {
  const baseUrl = getBaseAppUrl();
  return `${baseUrl}?mode=admin${pin ? `&pin=${pin}` : ''}`;
}

export interface GrantedUserRecord {
  id: string;
  recipientName: string;
  recipientEmailOrPhone: string;
  planId: string;
  planName: string;
  durationDays: number;
  grantedAt: string;
  expiresAt: string | null;
  passCode: string;
  token: string;
  shareableLink: string;
  status: 'active' | 'revoked';
  notes?: string;
  grantedBy: string;
}

export function getAdminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('astrodost_admin_token') || 'manishastrodostai@111';
  return {
    'x-admin-key': token,
    'x-admin-token': token,
  };
}

export async function verifyAdminPasswordApi(pin: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('astrodost_admin_token', data.token);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Authentication request failed' };
  }
}

export async function fetchGrantedUsersApi(): Promise<GrantedUserRecord[]> {
  try {
    const res = await fetch('/api/admin/granted-users', {
      headers: getAdminAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        return data.users;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch granted users from server:', err);
  }
  return [];
}

export async function grantUserAccessApi(params: {
  recipientName: string;
  recipientEmailOrPhone?: string;
  planId: string;
  durationDays?: number;
  notes?: string;
}): Promise<{
  success: boolean;
  grantedUser?: GrantedUserRecord;
  shareableLink?: string;
  whatsappMessage?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/grant-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network request failed' };
  }
}

export async function revokeGrantedUserApi(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/admin/granted-users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to revoke access' };
  }
}

export async function activateAdminSelfVipApi(userId: string = 'admin_master'): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const res = await fetch('/api/admin/activate-admin-vip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to activate Admin VIP' };
  }
}

export async function fetchAdminCouponsApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/admin/coupons', {
      headers: getAdminAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return data.coupons || [];
    }
  } catch (err) {
    console.warn('Failed to fetch coupons:', err);
  }
  return [];
}

export async function saveAdminCouponApi(coupon: any): Promise<{ success: boolean; coupons?: any[]; error?: string }> {
  try {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
      body: JSON.stringify({ coupon }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save coupon' };
  }
}

export async function revokeAdminCouponApi(couponId: string, reason: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/coupons/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
      body: JSON.stringify({ couponId, reason }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to revoke coupon' };
  }
}

export async function fetchAdminRedemptionsApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/admin/redemptions', {
      headers: getAdminAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return data.redemptions || [];
    }
  } catch (err) {
    console.warn('Failed to fetch redemptions:', err);
  }
  return [];
}

export async function revokeAdminRedemptionApi(redemptionId: string, reason: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/redemptions/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
      body: JSON.stringify({ redemptionId, reason }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to revoke redemption' };
  }
}

export async function fetchAdminAuditLogsApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/admin/audit-logs', {
      headers: getAdminAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return data.logs || [];
    }
  } catch (err) {
    console.warn('Failed to fetch audit logs:', err);
  }
  return [];
}

