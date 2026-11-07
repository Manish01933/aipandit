import React, { useState } from 'react';
import { Tag, Check, X, AlertCircle, Sparkles, Gift } from 'lucide-react';
import { CouponValidationResult } from '../types/commerce';

interface CouponInputWidgetProps {
  planId: string;
  basePrice?: number;
  originalPrice?: number;
  userId?: string;
  customerEmail?: string;
  customerPhone?: string;
  isAdmin?: boolean;
  appliedCoupon?: CouponValidationResult | null;
  setAppliedCoupon?: (coupon: CouponValidationResult | null) => void;
  onCouponApplied?: (result: CouponValidationResult | null) => void;
  language: 'hi' | 'en';
}

export const CouponInputWidget: React.FC<CouponInputWidgetProps> = ({
  planId,
  basePrice = 0,
  originalPrice = 0,
  userId = 'client_guest',
  customerEmail,
  customerPhone,
  isAdmin = false,
  appliedCoupon,
  setAppliedCoupon,
  onCouponApplied,
  language,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [internalResult, setInternalResult] = useState<CouponValidationResult | null>(appliedCoupon || null);
  const [errorMessage, setErrorMessage] = useState('');

  const activeResult = appliedCoupon !== undefined ? appliedCoupon : internalResult;

  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    setIsValidating(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: clean,
          planId,
          userId,
          customerEmail,
          customerPhone,
          isAdmin,
        }),
      });

      const data = await res.json();
      if (res.ok && data.validation) {
        if (data.validation.isValid) {
          setInternalResult(data.validation);
          if (setAppliedCoupon) setAppliedCoupon(data.validation);
          if (onCouponApplied) onCouponApplied(data.validation);
        } else {
          setInternalResult(null);
          setErrorMessage(data.validation.message || 'अमान्य कूपन कोड');
          if (setAppliedCoupon) setAppliedCoupon(null);
          if (onCouponApplied) onCouponApplied(null);
        }
      } else {
        setInternalResult(null);
        setErrorMessage(data.error || 'कूपन सत्यापन में समस्या हुई');
        if (setAppliedCoupon) setAppliedCoupon(null);
        if (onCouponApplied) onCouponApplied(null);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error verifying coupon');
      if (setAppliedCoupon) setAppliedCoupon(null);
      if (onCouponApplied) onCouponApplied(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setInternalResult(null);
    setErrorMessage('');
    if (setAppliedCoupon) setAppliedCoupon(null);
    if (onCouponApplied) onCouponApplied(null);
  };

  return (
    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'hi' ? 'कूपन / प्रोमो कोड लागू करें:' : 'Have a Promo / VIP Coupon?'}</span>
        </span>
        {activeResult && (
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>{language === 'hi' ? 'लागू हुआ' : 'Applied'}</span>
          </span>
        )}
      </div>

      {!activeResult ? (
        <form onSubmit={handleValidate} className="flex items-center gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder={language === 'hi' ? 'उदा. ASTROFREE100, FREEVIP' : 'e.g. ASTROFREE100, FREEVIP'}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold uppercase focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={isValidating || !couponCode.trim()}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50 transition-all shrink-0 cursor-pointer"
          >
            {isValidating ? (language === 'hi' ? 'जांच...' : 'Checking...') : language === 'hi' ? 'लागू करें' : 'Apply'}
          </button>
        </form>
      ) : (
        <div className="bg-emerald-950/70 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-amber-300 text-sm font-black">{activeResult.code}</span>
              {activeResult.isFreeAccess ? (
                <span className="text-[10px] bg-teal-500 text-slate-950 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                  <Gift className="w-3 h-3" /> 100% FREE (₹0)
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                  -₹{activeResult.discountAmount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-tight">{activeResult.message}</p>
          </div>
          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer shrink-0 ml-2"
            title="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-xl border border-rose-900/50">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
