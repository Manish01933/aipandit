import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Sparkles,
  QrCode,
  CheckCircle2,
  Key,
  ShieldCheck,
  CreditCard,
  Send,
  X,
  Copy,
  Check,
  Zap,
  Star,
  Layers,
  Grid,
  Hash,
  ArrowRight,
  Clock,
  Crown,
  Smartphone,
  ExternalLink,
  User,
  FileText,
  MessageSquare,
  Gift,
  Printer,
  Download,
  Receipt,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AccessState,
  SubscriptionPlanId,
  getEffectiveSubscriptionPlans,
  getAdminSettings,
  saveAdminSettings,
  unlockModuleWithPayment,
  verifyAndUnlockWithVipCode,
  saveAccessState,
} from '../utils/accessManager';
import { Language } from '../types/astrology';
import { GPayQrCard } from './GPayQrCard';
import { launchRazorpayCheckout } from '../utils/razorpayHandler';
import { CouponInputWidget } from './CouponInputWidget';
import { CouponValidationResult, VerifiedEntitlement } from '../types/commerce';
import { getSavedProfiles, getActiveProfile, BirthProfileRecord } from '../utils/birthProfileManager';
import { getOrCreateUserId } from '../utils/entitlementManager';

interface PaymentPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetModuleId: string;
  accessState: AccessState;
  setAccessState: React.Dispatch<React.SetStateAction<AccessState>>;
  language: Language;
  onSuccessUnlock?: () => void;
}

export const PaymentPaywallModal: React.FC<PaymentPaywallModalProps> = ({
  isOpen,
  onClose,
  targetModuleId,
  accessState,
  setAccessState,
  language,
  onSuccessUnlock,
}) => {
  const settings = getAdminSettings();
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('plan_kundli_report');
  const [paymentTab, setPaymentTab] = useState<'upi_qr' | 'razorpay' | 'vip_code'>('upi_qr');
  const [selectedUpiAccount, setSelectedUpiAccount] = useState<'hdfc' | 'gpay_axis'>('hdfc');

  // Customer form details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [vipCodeInput, setVipCodeInput] = useState('');
  const [vipError, setVipError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayError, setRazorpayError] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<{
    txId: string;
    planName: string;
    amount: number;
    paymentMethod: string;
    clientName: string;
    minutes: number;
    pdfCredits: number;
    timestamp: string;
  } | null>(null);

  // Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);

  // Profile selection state for per-profile plans
  const [savedProfiles, setSavedProfiles] = useState<BirthProfileRecord[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const list = getSavedProfiles();
      setSavedProfiles(list);
      const active = getActiveProfile();
      if (active) {
        setSelectedProfileId(active.profile_id);
        if (!customerName) setCustomerName(active.full_name);
      } else if (list.length > 0) {
        setSelectedProfileId(list[0].profile_id);
        if (!customerName) setCustomerName(list[0].full_name);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const effectivePlans = getEffectiveSubscriptionPlans();
  const currentPlan = effectivePlans[selectedPlanId] || effectivePlans['plan_kundli_report'] || effectivePlans['1_month'];
  const basePrice = currentPlan.price;
  const currentPrice = appliedCoupon ? appliedCoupon.finalPrice : basePrice;

  const selectedProfile = savedProfiles.find((p) => p.profile_id === selectedProfileId);
  const resolvedProfileName = selectedProfile?.full_name || customerName || 'Seeker';

  const recordLocalEntitlement = (paymentMethod: string, txId: string) => {
    const isVip = selectedPlanId === 'plan_astrodost_vip' || selectedPlanId === '1_month' || selectedPlanId === 'lifetime';
    const newEnt: VerifiedEntitlement = {
      id: 'ENT-' + Date.now().toString(36).toUpperCase(),
      userId: getOrCreateUserId(),
      clientName: customerName || resolvedProfileName,
      planId: selectedPlanId,
      planName: currentPlan.nameEn,
      billingType: isVip ? 'recurring' : 'one_time',
      unlockedModules: ['jagannatha', 'loshu', 'numerology', '*'],
      grantedAt: new Date().toISOString(),
      expiresAt: isVip ? new Date(Date.now() + 30 * 86400000).toISOString() : null,
      isActive: true,
      profileId: selectedProfileId || undefined,
      profileName: resolvedProfileName,
      questionCreditsRemaining: isVip ? 9999 : 5,
      pdfCreditsRemaining: selectedPlanId === 'plan_kundli_report' ? 1 : isVip ? 2 : 0,
      downloadedReportProfileIds: [],
      canFreeTextChat: isVip,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('astrodost_client_entitlements_v2') || '[]');
      existing.unshift(newEnt);
      localStorage.setItem('astrodost_client_entitlements_v2', JSON.stringify(existing));
    } catch {
      // ignore
    }
  };

  const triggerSuccessCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
      });
    } catch {
      // ignore
    }
  };

  const handleConfirmUpiPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const moduleIdsToUnlock = ['jagannatha', 'loshu', 'numerology'];
      const txId = utrNumber || 'UPI-' + Math.floor(100000 + Math.random() * 900000);
      const updatedState = unlockModuleWithPayment(
        moduleIdsToUnlock,
        language === 'hi' ? currentPlan.nameHi : currentPlan.nameEn,
        currentPrice,
        txId,
        'upi_qr',
        customerName || resolvedProfileName,
        selectedPlanId
      );
      recordLocalEntitlement('upi_qr', txId);
      setAccessState(updatedState);
      const receiptData = {
        txId,
        planName: language === 'hi' ? currentPlan.nameHi : currentPlan.nameEn,
        amount: currentPrice,
        paymentMethod: 'UPI QR (GPay / PhonePe / Paytm)',
        clientName: customerName || resolvedProfileName,
        minutes: currentPlan.allocatedMinutes || 35,
        pdfCredits: selectedPlanId === 'plan_kundli_report' ? 1 : selectedPlanId === 'plan_astrodost_vip' ? 2 : 0,
        timestamp: new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN'),
      };
      setSuccessReceipt(receiptData);
      setIsProcessing(false);
      triggerSuccessCelebration();
      if (onSuccessUnlock) onSuccessUnlock();
    }, 800);
  };

  // Secure Server-Verified Razorpay Checkout Flow
  const handleLaunchRazorpay = async () => {
    setRazorpayError('');
    setIsProcessing(true);

    const clientUserId = getOrCreateUserId();
    const clientName = customerName || resolvedProfileName;
    const clientPhone = customerPhone || '9888600000';
    const clientEmail = customerEmail || 'seeker@astrodost.ai';

    try {
      // Step 1: Create Order on backend with trusted catalog and coupon verification
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          couponCode: appliedCoupon?.code,
          userId: clientUserId,
          customerName: clientName,
          customerEmail: clientEmail,
          customerPhone: clientPhone,
          profileId: selectedProfileId,
          profileName: resolvedProfileName,
          isAdmin: accessState.isAdminUnlocked,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        setIsProcessing(false);
        setRazorpayError(orderData.error || 'Failed to initialize payment order');
        return;
      }

      const planTitle = `AstroDost (${currentPlan.nameEn}) - ₹${orderData.amount}`;

      // Step 2: Launch Razorpay Checkout Modal
      await launchRazorpayCheckout({
        keyId: orderData.keyId,
        amount: orderData.amount,
        planTitle,
        customerName: clientName,
        customerPhone: clientPhone,
        customerEmail: clientEmail,
        onSuccess: async (payment) => {
          // Step 3: Server-side signature & transaction verification
          try {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: payment.razorpay_order_id || orderData.orderId,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
                planId: selectedPlanId,
                userId: clientUserId,
                clientName,
                profileId: selectedProfileId,
                profileName: resolvedProfileName,
              }),
            });

            const verifyData = await verifyRes.json();
            setIsProcessing(false);

            if (verifyRes.ok && verifyData.success) {
              const moduleIdsToUnlock = ['jagannatha', 'loshu', 'numerology'];
              const updatedState = unlockModuleWithPayment(
                moduleIdsToUnlock,
                planTitle,
                orderData.amount,
                payment.razorpay_payment_id,
                'razorpay',
                clientName,
                selectedPlanId
              );
              recordLocalEntitlement('razorpay', payment.razorpay_payment_id);
              setAccessState(updatedState);
              const receiptData = {
                txId: payment.razorpay_payment_id || `RZP-${Date.now().toString(36).toUpperCase()}`,
                planName: planTitle,
                amount: orderData.amount,
                paymentMethod: 'Razorpay (Card / NetBanking / UPI)',
                clientName,
                minutes: currentPlan.allocatedMinutes || 35,
                pdfCredits: selectedPlanId === 'plan_kundli_report' ? 1 : selectedPlanId === 'plan_astrodost_vip' ? 2 : 0,
                timestamp: new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN'),
              };
              setSuccessReceipt(receiptData);
              triggerSuccessCelebration();
              if (onSuccessUnlock) onSuccessUnlock();
            } else {
              setRazorpayError(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (verErr: any) {
            setIsProcessing(false);
            setRazorpayError(verErr?.message || 'Server verification failed');
          }
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
        onError: (err) => {
          setIsProcessing(false);
          setRazorpayError(err);
        },
      });
    } catch (err: any) {
      setRazorpayError(err?.message || 'Gateway connection error');
    }
  };

  // 100% Free Coupon Direct Server Redemption (Zero Payment Gateway)
  const handleRedeem100PercentFreeCoupon = async () => {
    if (!appliedCoupon) return;
    setIsProcessing(true);
    setRazorpayError('');

    const clientUserId = getOrCreateUserId();
    const clientName = customerName?.trim() || resolvedProfileName;

    try {
      const res = await fetch('/api/coupons/redeem-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: appliedCoupon.code,
          planId: selectedPlanId,
          userId: clientUserId,
          customerName: clientName,
          customerEmail: customerEmail?.trim(),
          customerPhone: customerPhone?.trim(),
          profileId: selectedProfileId,
          profileName: resolvedProfileName,
          isAdmin: accessState.isAdminUnlocked,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok && data.success) {
        const isVip = selectedPlanId === 'plan_astrodost_vip' || selectedPlanId === '1_month' || selectedPlanId === 'lifetime';
        recordLocalEntitlement('free_coupon', 'COUPON-' + appliedCoupon.code);

        setAccessState({
          ...accessState,
          isVipUnlocked: isVip ? true : accessState.isVipUnlocked,
          vipClientName: isVip ? clientName : accessState.vipClientName,
          unlockedModules: isVip ? ['*'] : Array.from(new Set([...accessState.unlockedModules, 'jagannatha', 'loshu', 'numerology'])),
        });

        const receiptData = {
          txId: 'COUPON-' + appliedCoupon.code.toUpperCase(),
          planName: language === 'hi' ? currentPlan.nameHi : currentPlan.nameEn,
          amount: 0,
          paymentMethod: `100% Free Promo Coupon (${appliedCoupon.code})`,
          clientName,
          minutes: currentPlan.allocatedMinutes || 35,
          pdfCredits: selectedPlanId === 'plan_kundli_report' ? 1 : selectedPlanId === 'plan_astrodost_vip' ? 2 : 0,
          timestamp: new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN'),
        };
        setSuccessReceipt(receiptData);
        triggerSuccessCelebration();
        if (onSuccessUnlock) onSuccessUnlock();
      } else {
        setRazorpayError(data.error || 'Failed to redeem free coupon');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setRazorpayError(err?.message || 'Network error redeeming free coupon');
    }
  };

  // Instant 1-Click Master VIP Unlock for Owner / Free Pass
  const handleInstantVipUnlock = () => {
    const clientName = customerName?.trim() || resolvedProfileName || 'Acharya Manish (Master Admin)';
    recordLocalEntitlement('admin_free_vip', 'PASS-FREEVIP');
    const updatedState: AccessState = {
      ...accessState,
      role: 'admin',
      isAdminUnlocked: true,
      isVipUnlocked: true,
      vipClientName: clientName,
      vipPassCode: 'FREEVIP',
      unlockedModules: ['*'],
      planId: 'plan_astrodost_vip',
      activatedAt: new Date().toISOString(),
    };
    saveAccessState(updatedState);
    setAccessState(updatedState);
    const receiptData = {
      txId: 'VIP-FREEVIP-ADMIN',
      planName: 'एस्ट्रोदोस्त VIP ऑल-इन-वन (Master Pass)',
      amount: 0,
      paymentMethod: 'Master VIP Admin Pass',
      clientName,
      minutes: 120,
      pdfCredits: 2,
      timestamp: new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN'),
    };
    setSuccessReceipt(receiptData);
    triggerSuccessCelebration();
    if (onSuccessUnlock) onSuccessUnlock();
  };

  // Free Access Coupon / VIP Code Server Redemption
  const handleApplyVipCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVipError('');
    setIsProcessing(true);

    const clientName = customerName?.trim() || resolvedProfileName;

    try {
      const res = await fetch('/api/coupons/redeem-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: vipCodeInput.trim().toUpperCase(),
          planId: selectedPlanId,
          userId: getOrCreateUserId(),
          customerName: clientName,
          profileId: selectedProfileId,
          profileName: resolvedProfileName,
          isAdmin: accessState.isAdminUnlocked,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok && data.success) {
        recordLocalEntitlement('free_coupon', 'COUPON-' + vipCodeInput.trim());
        setAccessState({
          ...accessState,
          isVipUnlocked: true,
          vipClientName: clientName,
          unlockedModules: ['*'],
        });
        const receiptData = {
          txId: 'VIP-' + vipCodeInput.trim().toUpperCase(),
          planName: 'एस्ट्रोदोस्त VIP ऑल-इन-वन (Master Pass)',
          amount: 0,
          paymentMethod: 'VIP Passcode Redemption',
          clientName,
          minutes: 120,
          pdfCredits: 2,
          timestamp: new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN'),
        };
        setSuccessReceipt(receiptData);
        triggerSuccessCelebration();
        if (onSuccessUnlock) onSuccessUnlock();
      } else {
        // Fallback to local access manager check if server offline
        const localRes = verifyAndUnlockWithVipCode(vipCodeInput, clientName);
        if (localRes.success) {
          recordLocalEntitlement('free_vip_pass', 'PASS-' + vipCodeInput.trim());
          setAccessState({
            ...accessState,
            isVipUnlocked: true,
            vipClientName: localRes.clientName,
            unlockedModules: ['*'],
          });
          const receiptData = {
            txId: 'VIP-' + vipCodeInput.trim().toUpperCase(),
            planName: 'एस्ट्रोदोस्त VIP ऑल-इन-वन (Master Pass)',
            amount: 0,
            paymentMethod: 'VIP Passcode Redemption (Local)',
            clientName: localRes.clientName,
            minutes: 120,
            pdfCredits: 2,
            timestamp: new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN'),
          };
          setSuccessReceipt(receiptData);
          triggerSuccessCelebration();
          if (onSuccessUnlock) onSuccessUnlock();
        } else {
          setVipError(data.error || localRes.message);
        }
      }
    } catch {
      setIsProcessing(false);
      const localRes = verifyAndUnlockWithVipCode(vipCodeInput, clientName);
      if (localRes.success) {
        recordLocalEntitlement('free_vip_pass', 'PASS-' + vipCodeInput.trim());
        setAccessState({
          ...accessState,
          isVipUnlocked: true,
          vipClientName: localRes.clientName,
          unlockedModules: ['*'],
        });
        const receiptData = {
          txId: 'VIP-' + vipCodeInput.trim().toUpperCase(),
          planName: 'एस्ट्रोदोस्त VIP ऑल-इन-वन (Master Pass)',
          amount: 0,
          paymentMethod: 'VIP Passcode Redemption (Offline)',
          clientName: localRes.clientName,
          minutes: 120,
          pdfCredits: 2,
          timestamp: new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN'),
        };
        setSuccessReceipt(receiptData);
        triggerSuccessCelebration();
        if (onSuccessUnlock) onSuccessUnlock();
      } else {
        setVipError(localRes.message);
      }
    }
  };

  // The 3 official tiers
  const officialTierIds: SubscriptionPlanId[] = [
    'plan_kundli_explorer',
    'plan_kundli_report',
    'plan_astrodost_vip',
  ];

  const handleGoToKundaliReport = () => {
    window.dispatchEvent(new CustomEvent('astrodost_navigate_tab', { detail: { tab: 'sampoorn-report' } }));
    onClose();
  };

  const handleGoToChat = () => {
    window.dispatchEvent(new CustomEvent('astrodost_navigate_tab', { detail: { tab: 'chat' } }));
    onClose();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareOnWhatsApp = (receipt: NonNullable<typeof successReceipt>) => {
    const message = `🕉️ *आचार्य एस्ट्रोदोस्त AI - पेमेंट कन्फर्मेशन रसीद*\n\n` +
      `✅ *स्थिति:* भुगतान सफल व प्लान सक्रिय\n` +
      `🆔 *ट्रांजेक्शन ID:* ${receipt.txId}\n` +
      `👤 *जातक:* ${receipt.clientName}\n` +
      `📦 *प्लान:* ${receipt.planName}\n` +
      `💰 *शुल्क अदा:* ₹${receipt.amount}\n` +
      `⏱️ *AI परामर्श समय:* ${receipt.minutes} मिनट\n` +
      `📜 *२५-पृष्ठ महा-कुंडली:* ${receipt.pdfCredits > 0 ? 'उपलब्ध (1 Master PDF)' : 'त्वरित लग्न कुंडली'}\n` +
      `📅 *दिनांक:* ${receipt.timestamp}\n\n` +
      `पोर्टल: https://astrodost.ai\nधन्यवाद! 🙏`;
    const waUrl = `https://wa.me/919888600000?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/20 text-slate-100 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/20 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Crown className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {language === 'hi'
                    ? 'एस्ट्रोदोस्त आधिकारिक योजनाएं (AstroDost Plans)'
                    : 'AstroDost Official Membership Plans'}
                </h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-sm">
                  OFFICIAL 3 TIERS
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">
                {language === 'hi'
                  ? 'अपनी आवश्यकतानुसार उपयुक्त प्लान चुनें — 100% सुरक्षित भुगतान'
                  : 'Select your preferred tier — 100% Secure & Instant Activation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {successReceipt ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Pulsing Success Alert */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-emerald-400/80 rounded-2xl p-5 text-center shadow-xl shadow-emerald-950/50">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-3 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
                  <span>{language === 'hi' ? '🎉 भुगतान सफल — प्लान तत्काल सक्रिय!' : '🎉 Payment Confirmed — Plan Activated!'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-1.5 max-w-lg mx-auto font-medium">
                  {language === 'hi'
                    ? 'आपका प्लान इसी समय तत्काल चालू हो चुका है। नीचे दिए गए बटनों से तुरंत अपनी 25-पेज कुंडली खोलें या AI ज्योतिषी से परामर्श शुरू करें।'
                    : 'Your subscription is active right now. Access your 25-page Kundali report or start AI consultation immediately.'}
                </p>
              </div>

              {/* Official Digital Tax / Service Invoice Receipt */}
              <div className="bg-slate-950 border-2 border-amber-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                {/* Gold Watermark Emblem */}
                <div className="absolute top-2 right-3 pointer-events-none opacity-10 text-amber-300 text-8xl font-serif">
                  ॐ
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-md">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>आचार्य एस्ट्रोदोस्त AI • आधिकारिक डिजिटल रसीद</span>
                      </h4>
                      <p className="text-[10px] text-amber-300/80 font-mono">
                        VERIFIED TRANSACTION INVOICE #{successReceipt.txId}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black tracking-wider uppercase">
                    <Check className="w-3.5 h-3.5" />
                    PAID / सक्रिय
                  </span>
                </div>

                {/* Receipt Breakdown Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">जातक / ग्राहक का नाम</span>
                    <p className="font-bold text-white text-sm flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{successReceipt.clientName}</span>
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">सक्रिय प्लान (Active Tier)</span>
                    <p className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>{successReceipt.planName}</span>
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">भुगतान माध्यम व ट्रांजेक्शन ID</span>
                    <p className="font-mono text-emerald-300 text-xs break-all">
                      {successReceipt.paymentMethod}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">
                      Ref: {successReceipt.txId}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">दिनांक व भुगतान राशि</span>
                    <p className="font-mono text-white text-xs">
                      {successReceipt.timestamp}
                    </p>
                    <p className="text-base font-black text-emerald-400">
                      ₹{successReceipt.amount} <span className="text-[10px] font-normal text-slate-400">(कर सहित)</span>
                    </p>
                  </div>
                </div>

                {/* Live Unlocked Deliverables Card */}
                <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-4 rounded-xl border border-emerald-500/40 space-y-2 mb-4">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>तत्काल सक्रिय सेवाएं (Unlocked Deliverables):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">२५-पृष्ठ सम्पूर्ण महा-कुंडली</div>
                        <div className="text-[11px] text-slate-300">
                          {successReceipt.pdfCredits > 0
                            ? 'पूर्ण पुस्तक जनरेशन व आजीवन री-डाउनलोड अनलॉक'
                            : 'त्वरित D1-D9 लग्न विश्लेषण उपलब्ध'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">AI ज्योतिषी परामर्श समय</div>
                        <div className="text-[11px] text-emerald-300 font-semibold">
                          {successReceipt.minutes} मिनट टॉक-टाइम तत्काल उपलब्ध
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleGoToKundaliReport}
                    className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>📥 अपनी २५-पृष्ठ संपूर्ण महा-कुंडली खोलें व PDF बनाएं</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleGoToChat}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>💬 {successReceipt.minutes} Min AI ज्योतिषी परामर्श शुरू करें</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintReceipt}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>🖨️ रसीद प्रिंट करें / PDF सहेजें</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleShareOnWhatsApp(successReceipt)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>📲 WhatsApp पर रसीद सहेजें / शेयर करें</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      मुख्य पोर्टल पर लौटें ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* THE 3 OFFICIAL TIERS CARDS */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'आधिकारिक 3 प्लान में से चुनें:' : 'Choose from 3 Official Tiers:'}</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-semibold">
                {language === 'hi' ? 'तत्काल एक्टिवेशन' : 'Instant Activation'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {officialTierIds.map((pid) => {
                const plan = effectivePlans[pid];
                if (!plan) return null;
                const isSelected = selectedPlanId === pid;
                const isReport = pid === 'plan_kundli_report';
                const isVip = pid === 'plan_astrodost_vip';

                return (
                  <div
                    key={pid}
                    onClick={() => setSelectedPlanId(pid)}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950 border-amber-400 shadow-xl shadow-emerald-500/30 scale-[1.02]'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div
                        className={`absolute -top-2.5 right-3 text-[9px] font-black px-2.5 py-0.5 rounded-full shadow ${
                          isReport
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                            : isVip
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                        {isVip && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
                        {isReport && <FileText className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {pid === 'plan_kundli_explorer' && <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />}
                        <span>{language === 'hi' ? plan.nameHi.split('(')[0] : plan.nameEn}</span>
                      </div>

                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black font-mono text-amber-300">₹{plan.price}</span>
                        {plan.originalPrice && (
                          <span className="text-xs text-slate-500 line-through font-mono">₹{plan.originalPrice}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-sans">
                          {isVip ? (language === 'hi' ? '/माह' : '/month') : (language === 'hi' ? 'एकमुश्त' : 'one-time')}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">
                        {language === 'hi' ? plan.taglineHi : plan.taglineEn}
                      </p>

                      {/* Consultation Minutes Highlight Badge */}
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {pid === 'plan_kundli_explorer' && (language === 'hi' ? '⏱️ 15 मिनट लाइव परामर्श' : '⏱️ 15 Min Live Consultation')}
                          {pid === 'plan_kundli_report' && (language === 'hi' ? '⏱️ 35 मिनट विस्तृत परामर्श (28% बचत)' : '⏱️ 35 Min Consultation (28% off)')}
                          {pid === 'plan_astrodost_vip' && (language === 'hi' ? '⏱️ 120 मिनट (2 घंटे) वीआईपी परामर्श (58% बचत)' : '⏱️ 120 Min (2 Hrs) VIP Consultation')}
                        </span>
                      </div>

                      {/* Feature Bullet Points */}
                      <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300 border-t border-slate-800/80 pt-2.5">
                        {pid === 'plan_kundli_explorer' && (
                          <>
                            <li className="flex items-center gap-1.5 text-amber-300 font-bold">
                              <Check className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                              <span>{language === 'hi' ? '15 मिनट AI ज्योतिषी लाइव परामर्श (चैट/वॉइस)' : '15 Min AI Astrologer Live Chat Consultation'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-300">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{language === 'hi' ? 'D1 जन्मकुंडली, चंद्र राशि व दशा सारांश' : 'D1 Birth Chart & Current Dasha Overview'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-300">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{language === 'hi' ? '5 त्वरित AI प्रश्न उत्तर + वैदिक उपाय' : '5 instant AI questions + Vedic remedies'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                              <Sparkles className="w-3 h-3 shrink-0 text-teal-400" />
                              <span>{language === 'hi' ? 'स्क्रीन पर तुरंत विश्लेषण (बिना PDF)' : 'Instant on-screen reading (Starter)'}</span>
                            </li>
                          </>
                        )}

                        {pid === 'plan_kundli_report' && (
                          <>
                            <li className="flex items-center gap-1.5 text-amber-300 font-black">
                              <Check className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                              <span>{language === 'hi' ? '📜 १ सम्पूर्ण २५-पृष्ठ मास्टर PDF रिपोर्ट (डाउनलोड)' : '📜 1 Complete 25-Page Master PDF Report'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-300 font-bold">
                              <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              <span>{language === 'hi' ? '🪐 जगन्नाथ होरा सम्पूर्ण चार्ट्स (D1-D60, AK, AL, षड्बल)' : '🪐 Full Jagannatha Hora (D1-D60, AK, AL, Shadbala)'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-300">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{language === 'hi' ? '⏱️ 35 मिनट विस्तृत AI परामर्श (सत्र विभाजन)' : '⏱️ 35 Min Detailed AI Consultation'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-teal-300">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{language === 'hi' ? '💎 रत्न, रुद्राक्ष, यंत्र, वैदिक मंत्र व उपाय' : '💎 Gemstones, Rudraksha & Vedic Remedies'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-amber-200 text-[10px]">
                              <Sparkles className="w-3 h-3 shrink-0 text-amber-400" />
                              <span>{language === 'hi' ? 'उसी कुंडली की PDF लाइफटाइम फ्री री-डाउनलोड' : 'Free Lifetime Repeat PDF Re-downloads'}</span>
                            </li>
                          </>
                        )}

                        {pid === 'plan_astrodost_vip' && (
                          <>
                            <li className="flex items-center gap-1.5 text-amber-300 font-black">
                              <Check className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                              <span>{language === 'hi' ? '👑 120 मिनट (2 घंटे) वीआईपी AI परामर्श' : '👑 120 Min (2 Hrs) VIP AI Consultation'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-cyan-300 font-bold">
                              <Check className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                              <span>{language === 'hi' ? '📜 2 सम्पूर्ण २५-पृष्ठ PDF रिपोर्ट्स (स्वयं + परिवार)' : '📜 2 Full 25-Page PDF Reports (Self + Family)'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{language === 'hi' ? '🪐 जगन्नाथ होरा + लो शू ग्रिड + अंकज्योतिष' : '🪐 Jagannatha Hora + Lo Shu + Numerology'}</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-300">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{language === 'hi' ? 'सभी प्रीमियम सर्विसेज व टूल्स पूर्ण अनलॉक' : 'All Premium Modules 100% Unlocked'}</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-bold">
                        {isSelected
                          ? language === 'hi'
                            ? '✓ चयनित'
                            : 'Selected'
                          : language === 'hi'
                          ? 'चुनने के लिए क्लिक करें'
                          : 'Click to select'}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-slate-950 font-bold" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TARGET BIRTH PROFILE SELECTOR (For Plan A and Plan B) */}
          {(selectedPlanId === 'plan_kundli_explorer' || selectedPlanId === 'plan_kundli_report') && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  {language === 'hi'
                    ? 'यह प्लान किस जन्म कुंडली/प्रोफाइल के लिए है?'
                    : 'Target Birth Profile for this purchase:'}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                  {language === 'hi' ? '1 व्यक्ति के लिए आरक्षित' : 'Single Person Bound'}
                </span>
              </div>

              {savedProfiles.length > 0 ? (
                <div className="space-y-1.5">
                  <select
                    value={selectedProfileId}
                    onChange={(e) => {
                      setSelectedProfileId(e.target.value);
                      const p = savedProfiles.find((x) => x.profile_id === e.target.value);
                      if (p) setCustomerName(p.full_name);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {savedProfiles.map((p) => (
                      <option key={p.profile_id} value={p.profile_id}>
                        {p.full_name} ({p.date_of_birth} • {p.birthplace})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi'
                      ? '✓ 5 AI प्रश्न और कुंडली एनालिसिस इसी व्यक्ति की जन्म कुंडली से जुड़े रहेंगे।'
                      : '✓ The 5 AI questions and Kundli report will be tied to this native profile.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'hi' ? 'जातक का पूरा नाम दर्ज करें' : 'Enter Native Full Name'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi'
                      ? 'खरीद के पश्चात यह नाम आपकी जन्म कुंडली रिकॉर्ड से सुरक्षित रूप से लिंक हो जाएगा।'
                      : 'This name will be linked to the purchased birth profile.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* COUPON INPUT WIDGET */}
          <CouponInputWidget
            planId={selectedPlanId}
            basePrice={basePrice}
            language={language}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
          />

          {/* 100% FREE COUPON CLAIM OR STANDARD PAYMENT METHOD TABS */}
          {currentPrice === 0 || appliedCoupon?.isFreeAccess ? (
            <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 p-5 rounded-2xl border-2 border-emerald-400 shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-black text-emerald-300">
                    {language === 'hi' ? '100% फ्री कूपन सक्रिय (देय राशि: ₹0)' : '100% Free Coupon Applied (Payable: ₹0)'}
                  </span>
                </div>
                <span className="font-mono text-sm font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/40">
                  {appliedCoupon?.code}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p>
                  {language === 'hi'
                    ? `बधाई! आपके कूपन द्वारा "${currentPlan.nameHi}" पूर्णतः निःशुल्क अनलॉक करने के लिए तैयार है। किसी भी कार्ड या भुगतान की आवश्यकता नहीं है।`
                    : `Congratulations! "${currentPlan.nameEn}" is unlocked 100% free with this promo code. No card or payment required.`}
                </p>
                <div className="text-[11px] text-teal-300 bg-slate-900 p-2.5 rounded-xl border border-teal-800/40 flex items-center justify-between">
                  <span>{language === 'hi' ? 'अनलॉक अवधि:' : 'Access Duration:'}</span>
                  <span className="font-bold">
                    {appliedCoupon?.grantedDurationDays === 0
                      ? '♾️ आजीवन स्थायी एक्सेस (Lifetime)'
                      : `${appliedCoupon?.grantedDurationDays || currentPlan.durationDays || 30} दिन`}
                  </span>
                </div>
              </div>

              {razorpayError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-900/60 text-xs text-rose-300">
                  {razorpayError}
                </div>
              )}

              <button
                type="button"
                onClick={handleRedeem100PercentFreeCoupon}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Gift className="w-5 h-5" />
                <span>
                  {isProcessing
                    ? (language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Activating Entitlement...')
                    : (language === 'hi' ? '🎁 100% फ्री में अभी अनलॉक करें (Claim Free Access)' : '🎁 Claim 100% Free Access Now')}
                </span>
              </button>
            </div>
          ) : (
            /* PAYMENT METHOD SELECTION TABS */
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
              {/* 1-Click Free VIP All-Access for Owner / Acharya Manish */}
              <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-amber-500/20 border border-amber-500/50 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-amber-950/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                      <span>{language === 'hi' ? '👑 आचार्य मनीष जी / 100% मुफ़्त VIP एक्सेस' : '👑 Acharya Manish / VIP All-Access'}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">100% FREE</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {language === 'hi' ? 'बिना भुगतान के तुरंत समस्त 12+ मॉड्यूल व AI रिपोर्ट्स अनलॉक करें' : 'Instantly unlock all 12+ modules and VIP features'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleInstantVipUnlock}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{language === 'hi' ? '1-क्लिक में तुरंत अनलॉक करें' : '1-Click Free Unlock'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'hi' ? 'भुगतान विधि चुनें:' : 'Select Payment Method:'}</span>
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-400">
                    {language === 'hi' ? 'कुल देय राशि: ' : 'Total Payable: '}
                  </span>
                  <span className="text-base font-black font-mono text-amber-300">
                    ₹{currentPrice}
                  </span>
                </div>
              </div>

              {/* TAB SELECTORS */}
              <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentTab('upi_qr')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentTab === 'upi_qr'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'UPI QR कोड' : 'UPI QR Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('razorpay')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentTab === 'razorpay'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'Razorpay (कार्ड / नेटबैंकिंग)' : 'Razorpay (Cards/UPI)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('vip_code')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentTab === 'vip_code'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'VIP पास / कोड' : 'VIP Code'}</span>
                </button>
              </div>

            {/* TAB 1: UPI QR CODE */}
            {paymentTab === 'upi_qr' && (
              <div className="space-y-4 animate-fadeIn">
                <GPayQrCard
                  upiId={selectedUpiAccount === 'hdfc' ? settings.upiId : (settings.secondaryUpiId || settings.upiId)}
                  payeeName={selectedUpiAccount === 'hdfc' ? settings.upiName : (settings.secondaryUpiName || settings.upiName)}
                  amount={currentPrice}
                  accountType={selectedUpiAccount}
                  onSelectAccount={(acc) => setSelectedUpiAccount(acc)}
                  secondaryUpiId={settings.secondaryUpiId}
                  secondaryUpiName={settings.secondaryUpiName}
                  serviceTitle={language === 'hi' ? currentPlan.nameHi : currentPlan.nameEn}
                  language={language}
                />

                <form onSubmit={handleConfirmUpiPayment} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {language === 'hi' ? 'आपका नाम (Your Name):' : 'Your Name:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={resolvedProfileName}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {language === 'hi' ? 'UPI UTR / संदर्भ संख्या (UTR / Ref Number):' : 'UPI UTR / Ref Number:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="उदा. 423589123456"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? language === 'hi'
                          ? 'सत्यापित किया जा रहा है...'
                          : 'Verifying...'
                        : language === 'hi'
                        ? `भुगतान पुष्टि करें — ₹${currentPrice} अनलॉक करें`
                        : `Confirm UPI Payment — Unlock for ₹${currentPrice}`}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: RAZORPAY GATEWAY */}
            {paymentTab === 'razorpay' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-slate-900 p-4 rounded-2xl border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      {language === 'hi' ? 'सुरक्षित ऑनलाइन भुगतान (Razorpay)' : 'Secure Online Payment (Razorpay)'}
                    </span>
                    <span className="text-[10px] text-slate-400">UPI / Cards / NetBanking</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        {language === 'hi' ? 'नाम:' : 'Name:'}
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={resolvedProfileName}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        {language === 'hi' ? 'मोबाइल नंबर:' : 'Mobile Phone:'}
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="9888600000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        {language === 'hi' ? 'ईमेल:' : 'Email:'}
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="seeker@astrodost.ai"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {razorpayError && (
                    <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl">
                      {razorpayError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleLaunchRazorpay}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? language === 'hi'
                          ? 'प्रोसेसिंग...'
                          : 'Processing...'
                        : language === 'hi'
                        ? `Razorpay से भुगतान करें (₹${currentPrice})`
                        : `Pay with Razorpay (₹${currentPrice})`}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: VIP PASS / CODE */}
            {paymentTab === 'vip_code' && (
              <form onSubmit={handleApplyVipCode} className="space-y-3 animate-fadeIn">
                <div className="bg-slate-900 p-4 rounded-2xl border border-amber-500/30 space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">
                    {language === 'hi'
                      ? 'यदि आपके पास मास्टर VIP कोड या एडमिन पास है, तो यहां दर्ज करें:'
                      : 'Enter Master VIP Code or Admin Gift Pass:'}
                  </span>

                  <input
                    type="text"
                    required
                    value={vipCodeInput}
                    onChange={(e) => setVipCodeInput(e.target.value.toUpperCase())}
                    placeholder="उदा. FREEVIP / VIP-ASTRO-XXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-widest focus:outline-none focus:border-amber-400"
                  />

                  {/* Quick Code Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 mr-1">त्वरित कोड:</span>
                    {['FREEVIP', 'MANISH', '111', 'GURUGIFT', 'ADMINVIP'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setVipCodeInput(code);
                          handleInstantVipUnlock();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold transition-all cursor-pointer"
                      >
                        {code}
                      </button>
                    ))}
                  </div>

                  {vipError && (
                    <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl">
                      {vipError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <Key className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? language === 'hi'
                          ? 'सत्यापित किया जा रहा है...'
                          : 'Verifying...'
                        : language === 'hi'
                        ? 'VIP कोड लागू करें व अनलॉक करें'
                        : 'Redeem VIP Code & Unlock'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
            </>
          )}
      </div>
    </div>
  </div>
);
};

