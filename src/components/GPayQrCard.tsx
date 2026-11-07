import React, { useState } from 'react';
import { Copy, Check, QrCode, Sparkles } from 'lucide-react';
import { getAdminSettings } from '../utils/accessManager';
import { Language } from '../types/astrology';

interface GPayQrCardProps {
  amount?: number;
  planName?: string;
  selectedUpi?: 'hdfc' | 'gpay_axis';
  onSelectUpi?: (upi: 'hdfc' | 'gpay_axis') => void;
  language?: Language;
}

export const GPayQrCard: React.FC<GPayQrCardProps> = ({
  amount = 999,
  planName = 'AstroDost 3-in-1 Premium Services',
  selectedUpi = 'hdfc',
  onSelectUpi,
  language = 'hi',
}) => {
  const [copiedUpi, setCopiedUpi] = useState<string | null>(null);

  const settings = getAdminSettings();
  const hdfcUpiId = settings.upiId || 'darksecrets0unveiled@okhdfcbank';
  const hdfcName = settings.upiName || 'AstroDost AI Acharya Manish Ji';

  const axisUpiId = settings.secondaryUpiId || 'pari.sharma2342@okaxis';
  const axisName = settings.secondaryUpiName || 'Meenakshi Sharma';

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedUpi(id);
    setTimeout(() => setCopiedUpi(null), 2500);
  };

  // Clean payee name according to NPCI guidelines (remove special characters like brackets)
  const sanitizeUpiName = (name: string) => name.replace(/[()]/g, '').trim();

  const cleanHdfcName = sanitizeUpiName(hdfcName);
  const cleanAxisName = sanitizeUpiName(axisName);

  // URL-encoded UPI deep links
  const hdfcUri = `upi://pay?pa=${hdfcUpiId}&pn=${encodeURIComponent(
    cleanHdfcName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(planName)}`;

  const axisUri = `upi://pay?pa=${axisUpiId}&pn=${encodeURIComponent(
    cleanAxisName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(planName)}`;

  const hdfcQrImg = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(hdfcUri)}`;
  const axisQrImg = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(axisUri)}`;

  const isHdfc = selectedUpi === 'hdfc';
  const activeUpiId = isHdfc ? hdfcUpiId : axisUpiId;
  const activeName = isHdfc ? hdfcName : axisName;
  const activeQrImg = isHdfc ? hdfcQrImg : axisQrImg;
  const activeUri = isHdfc ? hdfcUri : axisUri;

  return (
    <div className="space-y-3">
      {/* UPI Account Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => onSelectUpi && onSelectUpi('hdfc')}
          className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isHdfc
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>HDFC UPI (Official)</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectUpi && onSelectUpi('gpay_axis')}
          className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            !isHdfc
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Google Pay QR</span>
        </button>
      </div>

      {/* The Styled QR Card (Replica of Google Pay UPI Merchant Standee Card) */}
      <div className="relative bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-2 border-slate-200 flex flex-col items-center max-w-sm mx-auto overflow-hidden">
        {/* Subtle top decoration bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-green-500 to-amber-500" />

        {/* Merchant Header */}
        <div className="flex items-center gap-3 mt-1 mb-3 w-full justify-center">
          <div className="w-11 h-11 rounded-full bg-[#00897b] text-white font-black text-xl flex items-center justify-center shadow-md">
            {isHdfc ? 'A' : 'M'}
          </div>
          <div className="text-left">
            <h4 className="font-extrabold text-slate-900 text-base leading-tight">{activeName}</h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
              Verified UPI Merchant
            </span>
          </div>
        </div>

        {/* QR Code Frame */}
        <div className="relative p-3 bg-white rounded-2xl border-2 border-slate-200/80 shadow-inner my-1">
          <img
            src={activeQrImg}
            alt="UPI QR Code"
            className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto rounded-lg"
            referrerPolicy="no-referrer"
          />

          {/* Central GPay / Astro logo pill in middle of QR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 bg-white rounded-full p-1 shadow-lg border border-slate-200 flex items-center justify-center">
              {isHdfc ? (
                <span className="text-lg">🕉️</span>
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* UPI ID Pill with 1-Click Copy */}
        <div className="mt-3 w-full">
          <div className="flex items-center justify-between gap-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl px-3 py-1.5 transition-colors">
            <span className="text-xs font-mono font-bold text-slate-800 truncate select-all">
              UPI ID: {activeUpiId}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(activeUpiId)}
              className="p-1 rounded-md bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
              title="Copy UPI ID"
            >
              {copiedUpi === activeUpiId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Amount Pre-filled Notice */}
        <div className="mt-2 text-center">
          <span className="text-xs font-semibold text-slate-600">
            Amount Pre-configured:{' '}
            <strong className="text-emerald-700 font-extrabold text-sm font-mono">₹{amount}</strong>
          </span>
        </div>

        {/* Scan instruction tagline */}
        <p className="mt-2 text-[11px] font-medium text-slate-500 text-center tracking-wide">
          Scan to pay with any UPI app (GPay, PhonePe, Paytm, BHIM)
        </p>

        {/* Direct Mobile UPI Intent Button (Opens installed UPI app directly on mobile) */}
        <div className="mt-3 w-full">
          <a
            href={activeUri}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition-transform active:scale-98"
          >
            <span>
              {language === 'hi'
                ? `📲 मोबाइल UPI ऐप में खोलें (Pay ₹${amount})`
                : `📲 Open in Mobile UPI App (Pay ₹${amount})`}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
