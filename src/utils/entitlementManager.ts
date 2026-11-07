import { PresetQuestion, VerifiedEntitlement } from '../types/commerce';

const STORAGE_ENTITLEMENTS_KEY = 'astrodost_client_entitlements_v2';
const USER_ID_KEY = 'astrodost_user_guid';

export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'user_server';
  let uid = localStorage.getItem(USER_ID_KEY);
  if (!uid) {
    uid = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    localStorage.setItem(USER_ID_KEY, uid);
  }
  return uid;
}

export interface ProfileStatusResult {
  isVip: boolean;
  hasProfilePlan: boolean;
  planId?: string;
  planName?: string;
  canFreeTextChat: boolean;
  questionCreditsRemaining: number;
  pdfCreditsRemaining: number;
  canDownloadPdf: boolean;
  isRepeatFreePdf: boolean;
  pdfReason?: string;
  expiresAt?: string | null;
}

export const DEFAULT_PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: 'pq_career',
    questionHi: 'मेरी कुंडली के अनुसार करियर, नौकरी या व्यापार में उन्नति और सफलता का सबसे उत्तम समय कब है?',
    questionEn: 'According to my birth chart, when is the best planetary period for career promotion, job or business success?',
    category: 'career',
    isActive: true,
    order: 1,
  },
  {
    id: 'pq_marriage',
    questionHi: 'मेरे विवाह, जीवनसाथी के लक्षण, स्वभाव और वैवाहिक सुख के विषय में कुंडली क्या संकेत देती है?',
    questionEn: 'What does my Kundli reveal about the auspicious timing of marriage, spouse traits and marital harmony?',
    category: 'marriage',
    isActive: true,
    order: 2,
  },
  {
    id: 'pq_wealth',
    questionHi: 'मेरी कुंडली में धन संचय, वित्तीय स्थिरता, कर्ज मुक्ति और आर्थिक समृद्धि के क्या योग हैं?',
    questionEn: 'What are the planetary combinations in my chart for wealth accumulation, financial stability and prosperity?',
    category: 'wealth',
    isActive: true,
    order: 3,
  },
  {
    id: 'pq_future_5years',
    questionHi: 'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा? (करियर, वित्त, स्वास्थ्य और पारिवारिक जीवन का वर्ष-वार फलादेश)',
    questionEn: 'How will your life & future unfold over the next 5 years? (Year-by-year Vedic forecast for Career, Wealth, Health & Family)',
    category: 'future',
    isActive: true,
    order: 4,
  },
  {
    id: 'pq_past_present_future',
    questionHi: 'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण (विगत वर्षों की प्रमुख घटनाएं, वर्तमान स्थिति और आगामी समय का सटीक फलादेश)',
    questionEn: 'Deep Past, Present & Future Astrological Timeline Analysis (Past milestone years, current situation, and upcoming turning points)',
    category: 'timeline',
    isActive: true,
    order: 5,
  },
  {
    id: 'pq_remedies',
    questionHi: 'मेरी कुंडली में कौन से ग्रह कमजोर या पीड़ित हैं और उनके लिए सबसे सरल, सात्विक व अचूक वैदिक उपाय क्या हैं?',
    questionEn: 'Which planets are weak or afflicted in my chart, and what are the most effective Vedic remedies and mantras?',
    category: 'remedies',
    isActive: true,
    order: 6,
  },
  {
    id: 'pq_dosha',
    questionHi: 'क्या मेरी कुंडली में मांगलिक, कालसर्प, पितृ दोष या शनि साढ़ेसाती का प्रभाव है और इसका निवारण कैसे करें?',
    questionEn: 'Does my Kundli have Manglik, Kaal Sarp, Pitra Dosha or Saturn Sade Sati influences, and how to mitigate them?',
    category: 'dosha',
    isActive: true,
    order: 7,
  },
];

// Fetch preset questions with fallback
export async function getPresetQuestions(): Promise<PresetQuestion[]> {
  try {
    const res = await fetch('/api/preset-questions');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions.filter((q: PresetQuestion) => q.isActive);
      }
    }
  } catch (e) {
    console.warn('Using default preset questions:', e);
  }
  return DEFAULT_PRESET_QUESTIONS;
}

// Fetch entitlement and credit status for the active profile
export async function getClientProfileStatus(profileId?: string): Promise<ProfileStatusResult> {
  const userId = getOrCreateUserId();
  const token = typeof window !== 'undefined' ? localStorage.getItem('astrodost_admin_token') : null;
  const accessRaw = typeof window !== 'undefined' ? localStorage.getItem('astrodost_access_state') : null;
  let isAdmin = token === 'manishastrodostai@111' || (typeof token === 'string' && token.startsWith('adm_tok_'));
  if (accessRaw) {
    try {
      const parsed = JSON.parse(accessRaw);
      if (parsed.isAdminUnlocked || parsed.role === 'admin' || parsed.isVipUnlocked) {
        isAdmin = true;
      }
    } catch {}
  }

  if (isAdmin) {
    return {
      isVip: true,
      hasProfilePlan: true,
      planId: 'plan_astrodost_vip',
      planName: 'AstroDost VIP (Master Admin Lifetime)',
      canFreeTextChat: true,
      questionCreditsRemaining: 99999,
      pdfCreditsRemaining: 9999,
      canDownloadPdf: true,
      isRepeatFreePdf: true,
      expiresAt: null,
    };
  }

  const defaultRes: ProfileStatusResult = {
    isVip: false,
    hasProfilePlan: true,
    canFreeTextChat: true,
    questionCreditsRemaining: 5,
    pdfCreditsRemaining: 0,
    canDownloadPdf: false,
    isRepeatFreePdf: false,
  };

  try {
    const url = `/api/entitlements/profile-status?userId=${encodeURIComponent(userId)}&profileId=${encodeURIComponent(profileId || '')}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch server profile status, falling back to local storage:', err);
  }

  // Local storage fallback
  try {
    const local = localStorage.getItem(STORAGE_ENTITLEMENTS_KEY);
    if (local) {
      const list: VerifiedEntitlement[] = JSON.parse(local);
      const now = Date.now();
      const vip = list.find((e) => (e.planId === 'plan_astrodost_vip' || e.planId === '1_month' || e.planId === 'lifetime') && (!e.expiresAt || new Date(e.expiresAt).getTime() > now));
      if (vip) {
        return {
          isVip: true,
          hasProfilePlan: true,
          planId: vip.planId,
          planName: vip.planName,
          canFreeTextChat: true,
          questionCreditsRemaining: 9999,
          pdfCreditsRemaining: vip.pdfCreditsRemaining ?? 2,
          canDownloadPdf: true,
          isRepeatFreePdf: Boolean(profileId && vip.downloadedReportProfileIds?.includes(profileId)),
          expiresAt: vip.expiresAt,
        };
      }

      if (profileId) {
        const profileEnt = list.find((e) => e.profileId === profileId);
        if (profileEnt) {
          const isRepeat = Boolean(profileEnt.downloadedReportProfileIds?.includes(profileId));
          return {
            isVip: false,
            hasProfilePlan: true,
            planId: profileEnt.planId,
            planName: profileEnt.planName,
            canFreeTextChat: false,
            questionCreditsRemaining: profileEnt.questionCreditsRemaining ?? 5,
            pdfCreditsRemaining: profileEnt.pdfCreditsRemaining ?? (profileEnt.planId === 'plan_kundli_report' ? 1 : 0),
            canDownloadPdf: profileEnt.planId === 'plan_kundli_report' && ((profileEnt.pdfCreditsRemaining ?? 1) > 0 || isRepeat),
            isRepeatFreePdf: isRepeat,
          };
        }
      }
    }
  } catch {
    // ignore
  }

  return defaultRes;
}

// Consume 1 question credit
export async function consumeClientQuestionCredit(
  profileId: string,
  question: string
): Promise<{ success: boolean; remainingCredits: number; message: string; isVipUnlimited?: boolean }> {
  const userId = getOrCreateUserId();
  try {
    const res = await fetch('/api/entitlements/consume-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, profileId, question }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e: any) {
    console.warn('Network error consuming question credit:', e);
  }

  return {
    success: true, // Allow proceed in offline/fallback
    remainingCredits: 4,
    message: '✓ प्रश्न दर्ज किया गया',
  };
}

// Consume 1 PDF credit or mark repeat download
export async function consumeClientPdfCredit(
  profileId: string
): Promise<{ success: boolean; isRepeatFree: boolean; remainingPdfCredits: number; message: string }> {
  const userId = getOrCreateUserId();
  try {
    const res = await fetch('/api/entitlements/consume-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, profileId }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e: any) {
    console.warn('Network error consuming PDF credit:', e);
  }

  return {
    success: true,
    isRepeatFree: false,
    remainingPdfCredits: 0,
    message: '✓ PDF डाउनलोड स्वीकृत',
  };
}

// Check if PDF can be downloaded
export async function checkCanDownloadClientPdf(
  profileId: string
): Promise<{ canDownload: boolean; isRepeatFree: boolean; remainingPdfCredits: number; reason: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('astrodost_admin_token') : null;
  const accessRaw = typeof window !== 'undefined' ? localStorage.getItem('astrodost_access_state') : null;
  let isAdmin = token === 'manishastrodostai@111' || (typeof token === 'string' && token.startsWith('adm_tok_'));
  if (accessRaw) {
    try {
      const parsed = JSON.parse(accessRaw);
      if (parsed.isAdminUnlocked || parsed.role === 'admin' || parsed.isVipUnlocked) {
        isAdmin = true;
      }
    } catch {}
  }
  if (isAdmin) {
    return {
      canDownload: true,
      isRepeatFree: true,
      remainingPdfCredits: 9999,
      reason: 'मास्टर एडमिन 100% नि:शुल्क पीडीएफ डाउनलोड',
    };
  }

  const userId = getOrCreateUserId();
  try {
    const res = await fetch(`/api/entitlements/can-download-pdf?userId=${encodeURIComponent(userId)}&profileId=${encodeURIComponent(profileId)}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e: any) {
    console.warn('Network error checking PDF eligibility:', e);
  }

  return {
    canDownload: false,
    isRepeatFree: false,
    remainingPdfCredits: 0,
    reason: 'PDF डाउनलोड के लिए उपयुक्त प्लान आवश्यक है।',
  };
}

// VIP Subscription Lifecycle Management
export interface VipSubscriptionDetails {
  success: boolean;
  isVip: boolean;
  status: 'active' | 'cancelled_at_period_end' | 'expired' | 'none';
  entitlement: VerifiedEntitlement | null;
  expiresAt: string | null;
  daysRemaining: number;
  autoRenew: boolean;
  pdfCreditsRemaining: number;
  canFreeTextChat: boolean;
  fairUse?: {
    dailyCount: number;
    dailyLimit: number;
    dailyRemaining: number;
  };
}

export async function getClientVipSubscriptionStatus(): Promise<VipSubscriptionDetails> {
  const userId = getOrCreateUserId();
  try {
    const res = await fetch(`/api/subscriptions/vip-status?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch VIP subscription status:', e);
  }
  return {
    success: false,
    isVip: false,
    status: 'none',
    entitlement: null,
    expiresAt: null,
    daysRemaining: 0,
    autoRenew: false,
    pdfCreditsRemaining: 0,
    canFreeTextChat: false,
  };
}

export async function cancelClientVipSubscription(): Promise<{ success: boolean; message: string; expiresAt?: string | null }> {
  const userId = getOrCreateUserId();
  try {
    const res = await fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e: any) {
    console.warn('Could not cancel VIP subscription:', e);
  }
  return {
    success: false,
    message: 'सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।',
  };
}

export async function renewClientVipSubscription(durationDays = 30): Promise<{ success: boolean; message: string }> {
  const userId = getOrCreateUserId();
  try {
    const res = await fetch('/api/subscriptions/renew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, durationDays }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e: any) {
    console.warn('Could not renew VIP subscription:', e);
  }
  return {
    success: false,
    message: 'सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।',
  };
}

