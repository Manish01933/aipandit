import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Tag,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react';
import {
  AdminAnnouncementInfo,
  AnnouncementCategory,
  DEFAULT_ANNOUNCEMENTS,
  getStoredAnnouncements,
  saveAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
} from '../../utils/accessManager';
import { Language } from '../../types/astrology';

interface AdminAnnouncementsManagerProps {
  language: Language;
}

const CATEGORY_OPTIONS: {
  id: AnnouncementCategory;
  labelHi: string;
  labelEn: string;
  defaultColor: AdminAnnouncementInfo['badgeColor'];
  icon: string;
}[] = [
  { id: 'festival', labelHi: 'मुहूर्त व पर्व 🪔', labelEn: 'Festival & Muhurat', defaultColor: 'amber', icon: '🪔' },
  { id: 'transit_alert', labelHi: 'ज्योतिष अलर्ट व गोचर 🚨', labelEn: 'Astrology Alert & Transit', defaultColor: 'rose', icon: '🚨' },
  { id: 'special_offer', labelHi: 'विशेष छूट व ऑफर 🌟', labelEn: 'Special Offer & Discount', defaultColor: 'emerald', icon: '🌟' },
  { id: 'astrology_tip', labelHi: 'दैनिक ज्योतिष टिप 💡', labelEn: 'Daily Astrology Tip', defaultColor: 'indigo', icon: '💡' },
  { id: 'guru_message', labelHi: 'गुरु संदेश व आशीर्वाद 🕉️', labelEn: 'Guru Message', defaultColor: 'amber', icon: '🕉️' },
  { id: 'general', labelHi: 'सामान्य सूचना 📢', labelEn: 'General Notice', defaultColor: 'sky', icon: '📢' },
];

const COLOR_OPTIONS: { id: AdminAnnouncementInfo['badgeColor']; name: string; bgClass: string }[] = [
  { id: 'amber', name: 'Amber Gold', bgClass: 'bg-amber-400 text-slate-950' },
  { id: 'emerald', name: 'Emerald Green', bgClass: 'bg-emerald-400 text-slate-950' },
  { id: 'rose', name: 'Ruby Rose', bgClass: 'bg-rose-500 text-white' },
  { id: 'indigo', name: 'Indigo Purple', bgClass: 'bg-indigo-500 text-white' },
  { id: 'sky', name: 'Sky Blue', bgClass: 'bg-sky-400 text-slate-950' },
];

export const AdminAnnouncementsManager: React.FC<AdminAnnouncementsManagerProps> = ({ language }) => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncementInfo[]>(getStoredAnnouncements());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('festival');
  const [badgeColor, setBadgeColor] = useState<AdminAnnouncementInfo['badgeColor']>('amber');
  const [message, setMessage] = useState('');
  const [actionTab, setActionTab] = useState('chat');
  const [actionText, setActionText] = useState('अभी देखें ➔');
  const [linkUrl, setLinkUrl] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast(language === 'hi' ? 'कृपया शीर्षक और संदेश दोनों दर्ज करें।' : 'Please enter both title and message.');
      return;
    }

    const selectedCat = CATEGORY_OPTIONS.find((c) => c.id === category) || CATEGORY_OPTIONS[0];

    const updated = addAnnouncement({
      isActive: true,
      title: title.trim(),
      category,
      categoryLabelHi: selectedCat.labelHi,
      categoryLabelEn: selectedCat.labelEn,
      message: message.trim(),
      badgeColor,
      actionTab: actionTab || undefined,
      actionText: actionText.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
      isPinned: false,
    });

    setAnnouncements(updated);
    setTitle('');
    setMessage('');
    setLinkUrl('');
    showToast(
      language === 'hi'
        ? 'नई सूचना सफलतापूर्वक जोड़ी गई और वेबऐप पर सक्रिय कर दी गई!'
        : 'New announcement successfully added and published on the webapp!'
    );
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (
      window.confirm(
        language === 'hi'
          ? `क्या आप सूचना "${itemTitle}" को स्थायी रूप से हटाना (Del) चाहते हैं?`
          : `Permanently delete notice "${itemTitle}"?`
      )
    ) {
      const updated = deleteAnnouncement(id);
      setAnnouncements(updated);
      showToast(
        language === 'hi'
          ? 'सूचना सफलतापूर्वक हटा दी गई (Deleted)!'
          : 'Announcement deleted successfully!'
      );
    }
  };

  const handleToggle = (id: string) => {
    const updated = toggleAnnouncementStatus(id);
    setAnnouncements(updated);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        language === 'hi'
          ? 'क्या आप डिफ़ॉल्ट सूचनाएं पुनः लोड करना चाहते हैं?'
          : 'Reset to default announcements?'
      )
    ) {
      const updated = saveAnnouncements(DEFAULT_ANNOUNCEMENTS);
      setAnnouncements(updated);
      showToast(language === 'hi' ? 'डिफ़ॉल्ट सूचनाएं लोड की गईं!' : 'Default notices restored!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status Bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/60 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
            📢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-emerald-300">
                {language === 'hi' ? 'विंडो 2: सूचनाएं व अपडेट्स प्रबंधन (Add / Del Info)' : 'Window 2: Info & Announcements Manager (Add / Del)'}
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {announcements.filter((a) => a.isActive).length} {language === 'hi' ? 'सक्रिय' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'वेबऐप पर किसी भी प्रकार की सूचना, पर्व अलर्ट या समाचार जोड़ें व जब चाहें Del (डिलीट) करें।'
                : 'Add any announcements, festive alerts or tips to the webapp, and delete (del) them anytime.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-xs text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'डिफ़ॉल्ट सूचनाएं' : 'Default Notices'}</span>
        </button>
      </div>

      {toastMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main 2-Column: Left = Add Form, Right = Active List with Delete Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Add New Info Form (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
              {language === 'hi' ? 'नई सूचना जोड़ें (Add New Info)' : 'Add New Info Bulletin'}
            </h4>
          </div>

          <form onSubmit={handleAddInfo} className="space-y-3.5">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                {language === 'hi' ? 'सूचना का शीर्षक (Headline):' : 'Headline Title:'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. महाशिवरात्रि विशेष पूजा व मुहूर्त...' : 'e.g. Special Muhurat Alert...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                {language === 'hi' ? 'कैटेगरी / प्रकार चुनें:' : 'Select Category:'}
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const catId = e.target.value as AnnouncementCategory;
                  setCategory(catId);
                  const found = CATEGORY_OPTIONS.find((c) => c.id === catId);
                  if (found) setBadgeColor(found.defaultColor);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {language === 'hi' ? cat.labelHi : cat.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Badge Color */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300">
                {language === 'hi' ? 'बैज का रंग:' : 'Badge Color Tag:'}
              </label>
              <div className="flex items-center gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setBadgeColor(c.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                      c.bgClass
                    } ${badgeColor === c.id ? 'ring-2 ring-white scale-105 shadow-md' : 'opacity-60 hover:opacity-100'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                {language === 'hi' ? 'विस्तृत संदेश / सूचना पाठ:' : 'Detailed Message / Info Body:'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'अपनी घोषणा, ज्योतिषीय टिप, छूट का विवरण या परामर्श समय यहाँ लिखें...'
                    : 'Write announcement details, guidelines, or timings...'
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                required
              />
            </div>

            {/* Action Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">
                  {language === 'hi' ? 'क्लिक पर गंतव्य (Tab):' : 'Click Action:'}
                </label>
                <select
                  value={actionTab}
                  onChange={(e) => setActionTab(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="chat">🕉️ AI ज्योतिषी चैट</option>
                  <option value="free-kundali">📜 जन्म कुंडली</option>
                  <option value="horoscope">☀️ दैनिक राशिफल</option>
                  <option value="panchang">📅 पंचांग</option>
                  <option value="matchmaking">❤️ गुण मिलान</option>
                  <option value="remedies">🪔 उपाय व रत्न</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">
                  {language === 'hi' ? 'बटन टेक्स्ट:' : 'Button Label:'}
                </label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="अभी देखें ➔"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'hi' ? '+ सूचना जोड़ें व लाइव करें' : '+ Add & Publish Info'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Bulletins List with Del / Delete Options (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  {language === 'hi' ? 'मौजूदा सूचनाएं (सूचनाएं देखें व Del करें)' : 'Active Bulletins (View & Del)'}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">कुल: {announcements.length}</span>
            </div>

            {announcements.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  {language === 'hi'
                    ? 'कोई सूचना मौजूद नहीं है। बाईं ओर फॉर्म से नई सूचना जोड़ें।'
                    : 'No announcements found. Add one using the form on the left.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-3 max-h-[480px] overflow-y-auto pr-1">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.isActive
                        ? 'bg-slate-900 border-slate-700/80 hover:border-amber-500/50'
                        : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              item.badgeColor === 'amber'
                                ? 'bg-amber-400 text-slate-950'
                                : item.badgeColor === 'emerald'
                                ? 'bg-emerald-400 text-slate-950'
                                : item.badgeColor === 'rose'
                                ? 'bg-rose-500 text-white'
                                : item.badgeColor === 'indigo'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-sky-400 text-slate-950'
                            }`}
                          >
                            {language === 'hi' ? item.categoryLabelHi : item.categoryLabelEn}
                          </span>

                          <h5 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h5>

                          {!item.isActive && (
                            <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                              INACTIVE
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                          {item.message}
                        </p>
                      </div>

                      {/* Action Controls: Toggle Active & Delete Button */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleToggle(item.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            item.isActive
                              ? 'text-emerald-400 hover:bg-emerald-950/40'
                              : 'text-slate-500 hover:bg-slate-800'
                          }`}
                          title={item.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                        >
                          {item.isActive ? (
                            <ToggleRight className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-500" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title="हटाएं (Del)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 mt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      {item.actionText && (
                        <span className="text-amber-400/90 font-medium font-mono">
                          Action: {item.actionTab || item.linkUrl}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {language === 'hi'
                ? '💡 किसी भी सूचना के पास लाल डस्टबिन (Del) बटन दबाकर तुरंत हटाएं।'
                : '💡 Click the red trash bin icon to instantly delete (del) any notice.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
