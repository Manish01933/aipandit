import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit3,
  CheckCircle2,
  XCircle,
  Crown,
  Layers,
  Sparkles,
  AlertCircle,
  Save,
  RotateCcw,
} from 'lucide-react';
import { PlanCatalogItem } from '../../types/commerce';
import { Language } from '../../types/astrology';

interface AdminPlanManagerProps {
  language: Language;
}

export const AdminPlanManager: React.FC<AdminPlanManagerProps> = ({ language }) => {
  const [plans, setPlans] = useState<PlanCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanCatalogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data = await res.json();
        if (data.plans) {
          setPlans(data.plans);
        }
      }
    } catch (err) {
      console.warn('Failed to load plans from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggleActive = async (plan: PlanCatalogItem) => {
    const updated = plans.map((p) => (p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
    setPlans(updated);
    try {
      await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans: updated }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const updated = plans.map((p) => (p.id === editingPlan.id ? { ...editingPlan, updatedAt: new Date().toISOString() } : p));
    setPlans(updated);
    setIsModalOpen(false);
    setEditingPlan(null);

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans: updated }),
      });
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: language === 'hi' ? 'प्लान सेटिंग्स सर्वर पर सफलतापूर्वक सहेजी गईं!' : 'Plan updated on server!',
        });
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error updating plan',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {language === 'hi'
                ? 'प्लान कैटलॉग व एंटाइटेलमेंट (Central Plan Catalog)'
                : 'Central Plan Catalog & Entitlements'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'hi'
              ? 'विश्वासपात्र सर्वर-आधारित मूल्य, अवधि, सुविधाएं और मॉड्यूल पात्रता नियंत्रण।'
              : 'Trusted server-authoritative prices, duration, billing types and feature access.'}
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              p.isActive
                ? 'bg-slate-950 border-slate-800 shadow-lg'
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-white">
                  {language === 'hi' ? p.nameHi : p.nameEn}
                </span>
                <span className="text-sm font-black font-mono text-amber-300">
                  ₹{p.price}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-semibold">
                  {p.billingType === 'one_time' ? '📦 One-Time Purchase' : `🔄 Recurring (${p.durationDays} Days)`}
                </span>
                {p.badge && (
                  <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    {p.badge}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {language === 'hi' ? p.descriptionHi : p.descriptionEn}
              </p>

              {/* Module access badges */}
              <div className="flex flex-wrap gap-1 mt-3">
                {p.includedModules.map((m) => (
                  <span
                    key={m}
                    className="text-[9px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded font-mono"
                  >
                    {m === '*' ? 'ALL MODULES (*)' : m}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs">
              <button
                type="button"
                onClick={() => handleToggleActive(p)}
                className={`flex items-center gap-1 font-semibold ${
                  p.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {p.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{p.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingPlan({ ...p });
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold"
              >
                <Edit3 className="w-3 h-3" />
                <span>संपादित करें</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {isModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-amber-300">
                प्लान कॉन्फ़िगरेशन (Edit Plan Properties)
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">प्लान मूल्य (Price ₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">अवधि (Days: 0 = Lifetime)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPlan.durationDays}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">नाम (Name English)</label>
                <input
                  type="text"
                  required
                  value={editingPlan.nameEn}
                  onChange={(e) => setEditingPlan({ ...editingPlan, nameEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">नाम (Name Hindi)</label>
                <input
                  type="text"
                  required
                  value={editingPlan.nameHi}
                  onChange={(e) => setEditingPlan({ ...editingPlan, nameHi: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.couponEligible}
                    onChange={(e) => setEditingPlan({ ...editingPlan, couponEligible: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500"
                  />
                  <span className="text-[11px] text-slate-300">कूपन डिस्काउंट योग्य (Coupon Eligible)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                  />
                  <span className="text-[11px] text-slate-300">सक्रिय (Active)</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
