import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit3,
  CheckCircle2,
  XCircle,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { PresetQuestion } from '../../types/commerce';
import { Language } from '../../types/astrology';
import { DEFAULT_PRESET_QUESTIONS } from '../../utils/entitlementManager';

interface AdminPresetQuestionsManagerProps {
  language: Language;
}

export const AdminPresetQuestionsManager: React.FC<AdminPresetQuestionsManagerProps> = ({ language }) => {
  const [questions, setQuestions] = useState<PresetQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PresetQuestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/preset-questions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          return;
        }
      }
      setQuestions(DEFAULT_PRESET_QUESTIONS);
    } catch {
      setQuestions(DEFAULT_PRESET_QUESTIONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const saveQuestionsToServer = async (newList: PresetQuestion[]) => {
    try {
      const res = await fetch('/api/admin/preset-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: newList }),
      });
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: language === 'hi' ? '✓ प्रश्न सूची सफलतापूर्वक सहेजी गई!' : '✓ Questions saved successfully!',
        });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({
          type: 'error',
          text: language === 'hi' ? 'सहेजने में त्रुटि आई' : 'Failed to save questions',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: language === 'hi' ? 'सर्वर से संपर्क नहीं हो सका' : 'Network error saving questions',
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q));
    setQuestions(updated);
    await saveQuestionsToServer(updated);
  };

  const handleDelete = async (id: string) => {
    if (questions.length <= 1) {
      setStatusMessage({
        type: 'error',
        text: language === 'hi' ? 'कम से कम 1 प्रश्न रहना आवश्यक है।' : 'At least 1 question is required.',
      });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    await saveQuestionsToServer(updated);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    const copy = [...questions];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    copy.forEach((q, idx) => (q.order = idx + 1));
    setQuestions(copy);
    await saveQuestionsToServer(copy);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.questionHi.trim()) return;

    let updated: PresetQuestion[];
    const exists = questions.some((q) => q.id === editingQuestion.id);

    if (exists) {
      updated = questions.map((q) => (q.id === editingQuestion.id ? editingQuestion : q));
    } else {
      updated = [...questions, { ...editingQuestion, order: questions.length + 1 }];
    }

    setQuestions(updated);
    setIsModalOpen(false);
    setEditingQuestion(null);
    await saveQuestionsToServer(updated);
  };

  const handleResetDefaults = async () => {
    if (window.confirm(language === 'hi' ? 'क्या आप मूल 5 वैदिक प्रश्नों पर रीसेट करना चाहते हैं?' : 'Reset to default 5 questions?')) {
      setQuestions(DEFAULT_PRESET_QUESTIONS);
      await saveQuestionsToServer(DEFAULT_PRESET_QUESTIONS);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              {language === 'hi'
                ? 'पूर्व-निर्धारित AI ज्योतिष प्रश्न सूची (Admin Configurable)'
                : 'Preset AI Astrology Questions Catalog'}
            </h3>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/40">
              {questions.filter((q) => q.isActive).length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'hi'
              ? 'कुंडली एक्सप्लोरर (₹299) व कुंडली रिपोर्ट (₹499) में उपयोगकर्ता को यही 5 प्रश्न उपलब्ध होते हैं।'
              : 'These questions are granted to users under Kundli Explorer (₹299) & Kundli Report (₹499).'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'डिफ़ॉल्ट 5 प्रश्न' : 'Reset Defaults'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingQuestion({
                id: `pq_${Date.now().toString(36)}`,
                questionHi: '',
                questionEn: '',
                category: 'general',
                isActive: true,
                order: questions.length + 1,
              });
              setIsModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया प्रश्न जोड़ें' : 'Add Question'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-2.5">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
              q.isActive
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950/60 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-100 leading-snug">{q.questionHi}</p>
                {q.questionEn && <p className="text-[11px] text-slate-400 font-sans italic">{q.questionEn}</p>}
                <div className="flex items-center gap-2 pt-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    Category: {q.category || 'general'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${
                      q.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {q.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
              {/* Move buttons */}
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMove(index, 'up')}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === questions.length - 1}
                onClick={() => handleMove(index, 'down')}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              {/* Active Toggle */}
              <button
                type="button"
                onClick={() => handleToggleActive(q.id)}
                className={`p-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  q.isActive
                    ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={q.isActive ? 'Deactivate' : 'Activate'}
              >
                {q.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              </button>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(q);
                  setIsModalOpen(true);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDelete(q.id)}
                className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950/50 border border-slate-700 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  {questions.some((q) => q.id === editingQuestion.id)
                    ? language === 'hi'
                      ? 'प्रश्न संपादित करें'
                      : 'Edit Preset Question'
                    : language === 'hi'
                    ? 'नया पूर्व-निर्धारित प्रश्न'
                    : 'Add New Preset Question'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingQuestion(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'प्रश्न (हिंदी - अनिवार्य) *' : 'Question in Hindi *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingQuestion.questionHi}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionHi: e.target.value })}
                  placeholder="उदा. मेरी कुंडली के अनुसार करियर या नौकरी में उन्नति कब होगी?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'Question (English - Optional)' : 'Question in English (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.questionEn || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionEn: e.target.value })}
                  placeholder="e.g. According to my Kundli, when will I get a career promotion?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'श्रेणी (Category)' : 'Category'}
                  </label>
                  <select
                    value={editingQuestion.category || 'general'}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="career">Career / नौकरी / व्यापार</option>
                    <option value="marriage">Marriage / विवाह / दांपत्य</option>
                    <option value="wealth">Wealth / धन / समृद्धि</option>
                    <option value="remedies">Remedies / उपाय / रत्न</option>
                    <option value="dosha">Dosha / मांगलिक / साढ़ेसाती</option>
                    <option value="health">Health / स्वास्थ्य</option>
                    <option value="general">General / सामान्य</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="pq-active-chk"
                    checked={editingQuestion.isActive}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-950 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="pq-active-chk" className="text-xs text-slate-200 font-medium cursor-pointer">
                    {language === 'hi' ? 'सक्रिय रखें (Active)' : 'Keep Active'}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingQuestion(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सहेजें' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
