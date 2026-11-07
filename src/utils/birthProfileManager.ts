import { BirthDetails, KundaliResult, ZodiacSign, VedicPlanet } from '../types/astrology';
import { generateKundali, ZODIAC_HINDI, PLANETS_HINDI } from './vedicCalculations';
import { calculateJagannathaHora } from './jagannathaHoraEngine';

export interface BirthProfileRecord {
  profile_id: string;
  user_id: string;
  full_name: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth: string; // YYYY-MM-DD
  exact_time_of_birth: string; // HH:MM
  birthplace: string;
  latitude: number;
  longitude: number;
  timezone: number;
  chart_id: string;
  chart_version: string;
  calculation_timestamp: number;
  chartData: KundaliResult;
}

export interface CompleteAstrologyContext {
  profile_id: string;
  chart_id: string;
  chart_version: string;
  calculation_timestamp: number;
  name: string;
  gender: string;
  dob: string;
  tob: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;
  ascendant: ZodiacSign;
  ascendantHindi: string;
  ascendantDegree: string;
  lagnaLord: {
    planet: VedicPlanet;
    house: number;
    sign: ZodiacSign;
    dignity: string;
  };
  moonSign: ZodiacSign;
  moonSignHindi: string;
  sunSign: ZodiacSign;
  sunSignHindi: string;
  birthNakshatra: string;
  birthNakshatraHindi: string;
  nakshatraLord: string;
  currentDasha: {
    mahadasha: string;
    mahadashaHindi?: string;
    antardasha?: string;
    antardashaHindi?: string;
    startDate?: string;
    endDate?: string;
    antardashaStartDate?: string;
    antardashaEndDate?: string;
  };
  career10thHouse: {
    sign: ZodiacSign;
    lord: VedicPlanet;
    planetsIn10th: string[];
    lordPlacementHouse: number;
  };
  marriage7thHouse: {
    sign: ZodiacSign;
    lord: VedicPlanet;
    planetsIn7th: string[];
    lordPlacementHouse: number;
  };
  wealthHouses: {
    house2Sign: ZodiacSign;
    house2Lord: VedicPlanet;
    house11Sign: ZodiacSign;
    house11Lord: VedicPlanet;
  };
  health6thHouse: {
    sign: ZodiacSign;
    lord: VedicPlanet;
    planetsIn6th: string[];
  };
  planetsSummary: Array<{
    planet: VedicPlanet;
    hindiName: string;
    sign: ZodiacSign;
    signHindi: string;
    house: number;
    formattedDegree: string;
    nakshatra: string;
    isRetrograde: boolean;
    dignity: string;
    dignityHindi: string;
  }>;
  doshas: {
    isManglik: boolean;
    manglikDesc: string;
    isKalsarp: boolean;
    kalsarpType: string;
    isSadeSati: boolean;
    sadeSatiPhase: string;
  };
  yogasSummary: string[];
  functionalBenefics: VedicPlanet[];
  functionalMalefics: VedicPlanet[];
  luckyGemstones: Array<{ gem: string; gemHindi: string; planet: string }>;
  forbiddenGemstones: Array<{ gem: string; gemHindi: string; planet: string }>;
  dashaPeriods?: Array<{
    planet: string;
    hindiName?: string;
    startDate: string;
    endDate: string;
    durationYears?: number;
    current?: boolean;
  }>;
  timelineAnalysis?: {
    age: number;
    currentYear: number;
    pastMilestones: Array<{
      years: string;
      ageRange: string;
      dasha: string;
      dashaHindi: string;
      keyTheme: string;
      keyThemeHindi: string;
    }>;
    currentSituation: {
      activeDasha: string;
      activeDashaHindi: string;
      saturnTransitStatus: string;
      saturnTransitStatusHindi: string;
      jupiterTransitStatus: string;
      jupiterTransitStatusHindi: string;
      runningPhaseVedicSummary: string;
      currentMindsetState: string;
    };
    future5Years: Array<{
      year: number;
      age: number;
      dashaPeriod: string;
      forecastHindi: string;
      forecastEn: string;
      focusArea: string;
    }>;
  };
}

const STORAGE_KEYS = {
  PROFILES_LIST: 'astrodost_saved_profiles',
  ACTIVE_PROFILE_ID: 'astrodost_active_profile_id',
  LEGACY_KUNDALI: 'astrodost_saved_kundali',
};

// Zodiac lords mapping
export const ZODIAC_LORDS: Record<ZodiacSign, VedicPlanet> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
};

// Functional benefics and malefics based on Lagna (Parashari Principles)
export const LAGNA_NATURE_MAP: Record<
  ZodiacSign,
  {
    benefics: VedicPlanet[];
    malefics: VedicPlanet[];
    gems: Array<{ gem: string; gemHindi: string; planet: string }>;
    forbidden: Array<{ gem: string; gemHindi: string; planet: string }>;
  }
> = {
  Aries: {
    benefics: ['Mars', 'Sun', 'Jupiter'],
    malefics: ['Mercury', 'Venus', 'Saturn'],
    gems: [
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga)', planet: 'Mars' },
      { gem: 'Ruby', gemHindi: 'माणिक्य (Manikya)', planet: 'Sun' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter' },
    ],
    forbidden: [
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury (3rd & 6th Lord)' },
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam)', planet: 'Saturn (Badhaka/Obstacle)' },
    ],
  },
  Taurus: {
    benefics: ['Venus', 'Saturn', 'Mercury'],
    malefics: ['Jupiter', 'Moon', 'Mars'],
    gems: [
      { gem: 'Diamond / White Opal', gemHindi: 'हीरा / ओपल (Heera/Opal)', planet: 'Venus' },
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam - Yogakaraka)', planet: 'Saturn' },
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury' },
    ],
    forbidden: [
      { gem: 'Ruby', gemHindi: 'माणिक्य (Manikya)', planet: 'Sun' },
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga)', planet: 'Mars (7th & 12th Lord)' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter (8th & 11th Lord)' },
    ],
  },
  Gemini: {
    benefics: ['Mercury', 'Venus'],
    malefics: ['Mars', 'Jupiter', 'Sun'],
    gems: [
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury' },
      { gem: 'Diamond / Opal', gemHindi: 'हीरा / ओपल', planet: 'Venus' },
    ],
    forbidden: [
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga)', planet: 'Mars (6th & 11th Lord)' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज', planet: 'Jupiter (Kendradhipati Dosha)' },
    ],
  },
  Cancer: {
    benefics: ['Moon', 'Mars', 'Jupiter'],
    malefics: ['Mercury', 'Venus', 'Saturn'],
    gems: [
      { gem: 'Pearl', gemHindi: 'मोती (Moti)', planet: 'Moon' },
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga - Yogakaraka)', planet: 'Mars' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter' },
    ],
    forbidden: [
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury (3rd & 12th Lord)' },
      { gem: 'Diamond', gemHindi: 'हीरा (Heera)', planet: 'Venus (4th & 11th Lord)' },
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam)', planet: 'Saturn (7th & 8th Lord)' },
    ],
  },
  Leo: {
    benefics: ['Sun', 'Mars', 'Jupiter'],
    malefics: ['Saturn', 'Venus', 'Mercury'],
    gems: [
      { gem: 'Ruby', gemHindi: 'माणिक्य (Manikya)', planet: 'Sun' },
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga - Yogakaraka)', planet: 'Mars' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter' },
    ],
    forbidden: [
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam)', planet: 'Saturn (6th & 7th Lord - Bitter Enemy)' },
      { gem: 'Diamond', gemHindi: 'हीरा (Heera)', planet: 'Venus (3rd & 10th Lord)' },
    ],
  },
  Virgo: {
    benefics: ['Mercury', 'Venus'],
    malefics: ['Mars', 'Jupiter', 'Moon'],
    gems: [
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury' },
      { gem: 'Diamond / Opal', gemHindi: 'हीरा / ओपल', planet: 'Venus (9th Lord)' },
    ],
    forbidden: [
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga)', planet: 'Mars (3rd & 8th Lord - Extreme Malefic)' },
      { gem: 'Pearl', gemHindi: 'मोती (Moti)', planet: 'Moon (11th Lord)' },
    ],
  },
  Libra: {
    benefics: ['Venus', 'Saturn', 'Mercury'],
    malefics: ['Jupiter', 'Mars', 'Sun'],
    gems: [
      { gem: 'Diamond / Opal', gemHindi: 'हीरा / ओपल (Heera/Opal)', planet: 'Venus' },
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam - Supreme Yogakaraka)', planet: 'Saturn' },
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury' },
    ],
    forbidden: [
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter (3rd & 6th Lord)' },
      { gem: 'Ruby', gemHindi: 'माणिक्य (Manikya)', planet: 'Sun (11th Lord - Badhaka)' },
    ],
  },
  Scorpio: {
    benefics: ['Mars', 'Jupiter', 'Moon'],
    malefics: ['Mercury', 'Venus'],
    gems: [
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga)', planet: 'Mars' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj - 2nd & 5th Lord)', planet: 'Jupiter' },
      { gem: 'Pearl', gemHindi: 'मोती (Moti - 9th Lord of Fortune)', planet: 'Moon' },
    ],
    forbidden: [
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury (8th & 11th Lord)' },
      { gem: 'Diamond', gemHindi: 'हीरा (Heera)', planet: 'Venus (7th & 12th Lord - Maraka)' },
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam)', planet: 'Saturn (3rd & 4th Lord)' },
    ],
  },
  Sagittarius: {
    benefics: ['Jupiter', 'Sun', 'Mars'],
    malefics: ['Venus', 'Mercury', 'Saturn'],
    gems: [
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter' },
      { gem: 'Ruby', gemHindi: 'माणिक्य (Manikya - 9th Lord)', planet: 'Sun' },
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga - 5th Lord)', planet: 'Mars' },
    ],
    forbidden: [
      { gem: 'Diamond', gemHindi: 'हीरा (Heera)', planet: 'Venus (6th & 11th Lord)' },
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury (Badhaka)' },
    ],
  },
  Capricorn: {
    benefics: ['Saturn', 'Venus', 'Mercury'],
    malefics: ['Mars', 'Jupiter', 'Moon'],
    gems: [
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam)', planet: 'Saturn' },
      { gem: 'Diamond / Opal', gemHindi: 'हीरा / ओपल (Yogakaraka 5th & 10th Lord)', planet: 'Venus' },
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna - 9th Lord of Fortune)', planet: 'Mercury' },
    ],
    forbidden: [
      { gem: 'Ruby', gemHindi: 'माणिक्य (Manikya)', planet: 'Sun (8th Lord)' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter (3rd & 12th Lord)' },
      { gem: 'Pearl', gemHindi: 'मोती (Moti)', planet: 'Moon (7th Maraka Lord)' },
    ],
  },
  Aquarius: {
    benefics: ['Saturn', 'Venus'],
    malefics: ['Jupiter', 'Moon', 'Mars'],
    gems: [
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam)', planet: 'Saturn' },
      { gem: 'Diamond / Opal', gemHindi: 'हीरा / ओपल (Yogakaraka 4th & 9th Lord)', planet: 'Venus' },
    ],
    forbidden: [
      { gem: 'Ruby', gemHindi: 'माणिक्य (Manikya)', planet: 'Sun (7th Maraka Lord)' },
      { gem: 'Pearl', gemHindi: 'मोती (Moti)', planet: 'Moon (6th Lord of Disease)' },
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज', planet: 'Jupiter (2nd & 11th Lord)' },
    ],
  },
  Pisces: {
    benefics: ['Jupiter', 'Moon', 'Mars'],
    malefics: ['Venus', 'Sun', 'Mercury', 'Saturn'],
    gems: [
      { gem: 'Yellow Sapphire', gemHindi: 'पुखराज (Pukhraj)', planet: 'Jupiter' },
      { gem: 'Pearl', gemHindi: 'मोती (Moti - 5th Lord of Wisdom)', planet: 'Moon' },
      { gem: 'Red Coral', gemHindi: 'मूंगा (Moonga - 2nd & 9th Lord of Fortune)', planet: 'Mars' },
    ],
    forbidden: [
      { gem: 'Diamond', gemHindi: 'हीरा (Heera)', planet: 'Venus (3rd & 8th Lord - Extreme Malefic)' },
      { gem: 'Emerald', gemHindi: 'पन्ना (Panna)', planet: 'Mercury (4th & 7th Lord - Maraka)' },
      { gem: 'Blue Sapphire', gemHindi: 'नीलम (Neelam)', planet: 'Saturn (11th & 12th Lord)' },
    ],
  },
};

// Generate unique ID helper
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateProfileId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `KUN-${num}`;
}

/**
 * Loads all saved profiles from localStorage.
 * Automatically runs migration from legacy single-kundali key if present.
 */
export function getSavedProfiles(): BirthProfileRecord[] {
  if (typeof window === 'undefined') return [];

  // Migrate legacy if necessary
  migrateLegacySavedKundali();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
    if (!raw) return [];
    const list: BirthProfileRecord[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn('Failed to parse saved profiles:', err);
    return [];
  }
}

/**
 * Returns the currently active profile, or the first available saved profile, or null.
 */
export function getActiveProfile(): BirthProfileRecord | null {
  const profiles = getSavedProfiles();
  if (profiles.length === 0) return null;

  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    if (activeId) {
      const found = profiles.find((p) => p.profile_id === activeId);
      if (found) return found;
    }
  } catch (err) {
    console.warn('Failed reading active profile ID:', err);
  }

  // Default to first profile if active not found
  return profiles[0] || null;
}

/**
 * Sets a profile as the active one.
 */
export function setActiveProfile(profileId: string): BirthProfileRecord | null {
  const profiles = getSavedProfiles();
  const target = profiles.find((p) => p.profile_id === profileId);
  if (!target) return null;

  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, target.profile_id);
    // Keep legacy key synced for views that still read it
    localStorage.setItem(STORAGE_KEYS.LEGACY_KUNDALI, JSON.stringify(target.chartData));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('astrodost_profiles_changed'));
    }
  } catch (err) {
    console.warn('Error saving active profile state:', err);
  }

  return target;
}

/**
 * Saves or updates a birth profile and its calculated chart.
 * Recomputes the chart accurately if not provided.
 * Generates and preserves a clean, persistent Kundali ID (e.g. KUN-849201).
 */
export function saveOrUpdateProfile(params: {
  profile_id?: string;
  user_id?: string;
  birthDetails: BirthDetails;
  chartData?: KundaliResult;
}): { profile: BirthProfileRecord; chart: KundaliResult } {
  const chart = params.chartData || generateKundali(params.birthDetails);
  const now = Date.now();
  const existing = getSavedProfiles();

  const cleanName = (params.birthDetails?.name || '').trim();
  const cleanNameLower = cleanName.toLowerCase();

  let profileId = params.profile_id;
  let index = -1;

  if (profileId) {
    index = existing.findIndex((p) => p.profile_id === profileId);
  } else {
    // Check if an existing profile has the same name, DOB and TOB
    const safeDob = params.birthDetails?.dob || '1998-05-15';
    const safeTob = params.birthDetails?.tob || '10:30';
    const existingIndex = existing.findIndex(
      (p) =>
        p.full_name.trim().toLowerCase() === cleanNameLower &&
        p.date_of_birth === safeDob &&
        p.exact_time_of_birth === safeTob
    );
    if (existingIndex >= 0) {
      profileId = existing[existingIndex].profile_id;
      index = existingIndex;
    } else {
      profileId = generateProfileId();
    }
  }

  const chartId = generateId('chart');
  const chartVersion = 'v2.5-vedic-astronomy';

  const record: BirthProfileRecord = {
    profile_id: profileId,
    user_id: params.user_id || 'user_guest',
    full_name: cleanName || 'जातक',
    date_of_birth: params.birthDetails?.dob || '1998-05-15',
    exact_time_of_birth: params.birthDetails?.tob || '10:30',
    birthplace: params.birthDetails?.place || 'New Delhi, India',
    latitude:
      typeof params.birthDetails?.latitude === 'number' && !isNaN(params.birthDetails.latitude)
        ? params.birthDetails.latitude
        : 28.6139,
    longitude:
      typeof params.birthDetails?.longitude === 'number' && !isNaN(params.birthDetails.longitude)
        ? params.birthDetails.longitude
        : 77.209,
    timezone:
      typeof params.birthDetails?.timezone === 'number' && !isNaN(params.birthDetails.timezone)
        ? params.birthDetails.timezone
        : 5.5,
    chart_id: chartId,
    chart_version: chartVersion,
    calculation_timestamp: now,
    chartData: chart,
  };

  let updatedList: BirthProfileRecord[];
  if (index >= 0) {
    updatedList = [...existing];
    updatedList[index] = record;
  } else {
    updatedList = [record, ...existing];
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(updatedList));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, record.profile_id);
    localStorage.setItem(STORAGE_KEYS.LEGACY_KUNDALI, JSON.stringify(chart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('astrodost_profiles_changed'));
    }
  } catch (err) {
    console.warn('Error saving profile to localStorage:', err);
  }

  return { profile: record, chart };
}

/**
 * Deletes a profile by ID.
 */
export function deleteProfile(profileId: string): void {
  const existing = getSavedProfiles();
  const filtered = existing.filter((p) => p.profile_id !== profileId);

  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(filtered));
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    if (activeId === profileId) {
      if (filtered.length > 0) {
        setActiveProfile(filtered[0].profile_id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_KUNDALI);
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('astrodost_profiles_changed'));
    }
  } catch (err) {
    console.warn('Error deleting profile:', err);
  }
}

/**
 * Migration helper: imports legacy single `astrodost_saved_kundali` into `astrodost_saved_profiles`
 */
export function migrateLegacySavedKundali(): void {
  if (typeof window === 'undefined') return;

  try {
    const listRaw = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
    if (listRaw) return; // Already migrated or has list

    const legacyRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_KUNDALI);
    if (!legacyRaw) return;

    const parsed: KundaliResult = JSON.parse(legacyRaw);
    const name = parsed?.birthDetails?.name || '';
    if (!name || name.trim().toLowerCase() === 'aarav sharma' || name.trim().toLowerCase() === 'seeker') {
      localStorage.removeItem(STORAGE_KEYS.LEGACY_KUNDALI);
      return;
    }

    const record: BirthProfileRecord = {
      profile_id: generateId('profile_migrated'),
      user_id: 'user_guest',
      full_name: name,
      date_of_birth: parsed.birthDetails.dob,
      exact_time_of_birth: parsed.birthDetails.tob,
      birthplace: parsed.birthDetails.place,
      latitude: parsed.birthDetails.latitude,
      longitude: parsed.birthDetails.longitude,
      timezone: parsed.birthDetails.timezone,
      chart_id: generateId('chart_migrated'),
      chart_version: 'v2.5-vedic-astronomy',
      calculation_timestamp: Date.now(),
      chartData: parsed,
    };

    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify([record]));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, record.profile_id);
  } catch (err) {
    console.warn('Migration error:', err);
  }
}

/**
 * Builds the comprehensive astrological context from an active profile or KundaliResult.
 * This powers both the server AI prompt and the local dynamic astrological reasoning engine.
 */
export function buildCompleteAstrologyContext(
  profileOrChart: BirthProfileRecord | KundaliResult | null
): CompleteAstrologyContext | null {
  if (!profileOrChart) return null;

  let chart: KundaliResult;
  let profileId = 'anon_profile';
  let chartId = 'anon_chart';
  let chartVersion = 'v2.5-vedic-astronomy';
  let calcTime = Date.now();

  if ('chartData' in profileOrChart) {
    chart = profileOrChart.chartData;
    profileId = profileOrChart.profile_id;
    chartId = profileOrChart.chart_id;
    chartVersion = profileOrChart.chart_version;
    calcTime = profileOrChart.calculation_timestamp;
  } else {
    chart = profileOrChart;
  }

  const name = chart.birthDetails?.name || '';
  if (!name || name.trim().toLowerCase() === 'aarav sharma' || name.trim().toLowerCase() === 'seeker') {
    return null;
  }

  const asc = chart.ascendantSign;
  const lagnaLord = ZODIAC_LORDS[asc];
  const lagnaLordPlanet = chart.planets.find((p) => p.name === lagnaLord);

  // Houses map
  const getHouseSign = (hNum: number): ZodiacSign => {
    const h = chart.houses.find((item) => item.houseNumber === hNum);
    return h ? h.sign : asc;
  };

  const getPlanetsInHouse = (hNum: number): string[] => {
    return chart.planets
      .filter((p) => p.house === hNum)
      .map((p) => `${PLANETS_HINDI[p.name] || p.name} (${p.formattedDegree}, ${p.dignity})`);
  };

  // 10th House (Career)
  const sign10 = getHouseSign(10);
  const lord10 = ZODIAC_LORDS[sign10];
  const lord10Planet = chart.planets.find((p) => p.name === lord10);

  // 7th House (Marriage)
  const sign7 = getHouseSign(7);
  const lord7 = ZODIAC_LORDS[sign7];
  const lord7Planet = chart.planets.find((p) => p.name === lord7);

  // 2nd & 11th House (Wealth)
  const sign2 = getHouseSign(2);
  const lord2 = ZODIAC_LORDS[sign2];
  const sign11 = getHouseSign(11);
  const lord11 = ZODIAC_LORDS[sign11];

  // 6th House (Health)
  const sign6 = getHouseSign(6);
  const lord6 = ZODIAC_LORDS[sign6];

  // Active dasha calculations via Jagannatha Hora hierarchical engine
  let jhData: any = null;
  try {
    jhData = calculateJagannathaHora(chart.birthDetails);
  } catch (err) {
    console.warn('JH calculation fallback in buildCompleteAstrologyContext:', err);
  }

  const activeHierarchicalMaha = jhData?.hierarchicalDasha?.find((m: any) => m.isCurrent);
  const activeAntar = activeHierarchicalMaha?.antardashas?.find((a: any) => a.isCurrent);
  const currentDashaObj = chart.dashaPeriods.find((d) => d.current) || chart.dashaPeriods[0];

  const effectiveMahaPlanet = activeHierarchicalMaha ? activeHierarchicalMaha.mahadasha : (currentDashaObj ? currentDashaObj.planet : 'Sun');
  const effectiveMahaHindi = activeHierarchicalMaha?.mahadashaHindi || (currentDashaObj ? PLANETS_HINDI[currentDashaObj.planet as VedicPlanet] : 'सूर्य');
  const effectiveMahaStart = activeHierarchicalMaha ? activeHierarchicalMaha.startDate : currentDashaObj?.startDate;
  const effectiveMahaEnd = activeHierarchicalMaha ? activeHierarchicalMaha.endDate : currentDashaObj?.endDate;

  // Lagna functional benefics and malefics
  const lagnaConfig = LAGNA_NATURE_MAP[asc] || {
    benefics: [lagnaLord],
    malefics: [],
    gems: [],
    forbidden: [],
  };

  const planetsSummary = chart.planets.map((p) => ({
    planet: p.name,
    hindiName: PLANETS_HINDI[p.name] || p.name,
    sign: p.sign,
    signHindi: ZODIAC_HINDI[p.sign] || p.sign,
    house: p.house,
    formattedDegree: p.formattedDegree,
    nakshatra: p.nakshatra,
    isRetrograde: p.isRetrograde,
    dignity: p.dignity,
    dignityHindi: p.dignityHindi,
  }));

  const yogasSummary = (chart.yogas || []).map((y) => `${y.nameHindi || y.name} (${y.strengthHindi || y.strength})`);

  return {
    profile_id: profileId,
    chart_id: chartId,
    chart_version: chartVersion,
    calculation_timestamp: calcTime,
    name: chart.birthDetails.name,
    gender: chart.birthDetails.gender,
    dob: chart.birthDetails.dob,
    tob: chart.birthDetails.tob,
    place: chart.birthDetails.place,
    latitude: chart.birthDetails.latitude,
    longitude: chart.birthDetails.longitude,
    timezone: chart.birthDetails.timezone,
    ascendant: asc,
    ascendantHindi: chart.ascendantSignHindi || ZODIAC_HINDI[asc],
    ascendantDegree: chart.ascendantDegree,
    lagnaLord: {
      planet: lagnaLord,
      house: lagnaLordPlanet ? lagnaLordPlanet.house : 1,
      sign: lagnaLordPlanet ? lagnaLordPlanet.sign : asc,
      dignity: lagnaLordPlanet ? lagnaLordPlanet.dignity : 'Neutral',
    },
    moonSign: chart.moonSign,
    moonSignHindi: chart.moonSignHindi || ZODIAC_HINDI[chart.moonSign],
    sunSign: chart.sunSign,
    sunSignHindi: chart.sunSignHindi || ZODIAC_HINDI[chart.sunSign],
    birthNakshatra: chart.birthNakshatra,
    birthNakshatraHindi: chart.birthNakshatraHindi,
    nakshatraLord: chart.nakshatraLord,
    currentDasha: {
      mahadasha: effectiveMahaPlanet,
      mahadashaHindi: effectiveMahaHindi,
      startDate: effectiveMahaStart,
      endDate: effectiveMahaEnd,
      antardasha: activeAntar?.antardasha,
      antardashaHindi: activeAntar?.antardashaHindi,
      antardashaStartDate: activeAntar?.startDate,
      antardashaEndDate: activeAntar?.endDate,
    },
    career10thHouse: {
      sign: sign10,
      lord: lord10,
      planetsIn10th: getPlanetsInHouse(10),
      lordPlacementHouse: lord10Planet ? lord10Planet.house : 10,
    },
    marriage7thHouse: {
      sign: sign7,
      lord: lord7,
      planetsIn7th: getPlanetsInHouse(7),
      lordPlacementHouse: lord7Planet ? lord7Planet.house : 7,
    },
    wealthHouses: {
      house2Sign: sign2,
      house2Lord: lord2,
      house11Sign: sign11,
      house11Lord: lord11,
    },
    health6thHouse: {
      sign: sign6,
      lord: lord6,
      planetsIn6th: getPlanetsInHouse(6),
    },
    planetsSummary,
    doshas: {
      isManglik: Boolean(chart.dosha?.isManglik),
      manglikDesc: chart.dosha?.manglikDescriptionHindi || chart.dosha?.manglikDescription || 'सामान्य स्थिति',
      isKalsarp: Boolean(chart.dosha?.isKalsarp),
      kalsarpType: chart.dosha?.kalsarpType || 'कोई कालसर्प नहीं',
      isSadeSati: Boolean(chart.dosha?.isSadeSati),
      sadeSatiPhase: chart.dosha?.sadeSatiPhase || 'साढ़ेसाती प्रभाव नहीं',
    },
    yogasSummary,
    functionalBenefics: lagnaConfig.benefics,
    functionalMalefics: lagnaConfig.malefics,
    luckyGemstones: lagnaConfig.gems,
    forbiddenGemstones: lagnaConfig.forbidden,
    dashaPeriods: (jhData?.hierarchicalDasha || chart.dashaPeriods || []).map((d: any) => ({
      planet: d.mahadasha || d.planet,
      hindiName: d.mahadashaHindi || d.hindiName || PLANETS_HINDI[(d.mahadasha || d.planet) as VedicPlanet] || (d.mahadasha || d.planet),
      startDate: d.startDate,
      endDate: d.endDate,
      durationYears: d.durationYears,
      current: Boolean(d.isCurrent ?? d.current),
    })),
    timelineAnalysis: (() => {
      const dobParts = (chart.birthDetails?.dob || '').split('-');
      const birthYear = parseInt(dobParts[0], 10) || 1995;
      const currentYear = new Date().getFullYear();
      const currentAge = Math.max(0, currentYear - birthYear);

      const pastMilestones: Array<{
        years: string;
        ageRange: string;
        dasha: string;
        dashaHindi: string;
        keyTheme: string;
        keyThemeHindi: string;
      }> = [];

      const dPeriods = chart.dashaPeriods || [];
      for (const dp of dPeriods) {
        const sYear = parseInt(dp.startDate, 10);
        const eYear = parseInt(dp.endDate, 10);
        if (isNaN(sYear) || isNaN(eYear)) continue;

        if (sYear <= currentYear) {
          const startAge = Math.max(0, sYear - birthYear);
          const endAge = Math.max(startAge, Math.min(currentAge, eYear - birthYear));
          const pName = dp.planet;
          const pHindi = dp.hindiName || PLANETS_HINDI[pName as VedicPlanet] || pName;

          let themeHi = 'आरंभिक शिक्षा, स्वास्थ्य तथा पारिवारिक परिवेश का निर्माण काल।';
          let themeEn = 'Formative childhood period, foundational schooling, and home values.';

          if (startAge >= 17 && startAge < 25) {
            themeHi = 'उच्च शिक्षा, करियर की प्रथम नींव, दिशा परिवर्तन तथा जीवन में स्वतंत्र पहचान का संघर्ष।';
            themeEn = 'Higher academic pursuits, foundational vocational struggles, and seeking independence.';
          } else if (startAge >= 25 && startAge < 35) {
            themeHi = 'आजीविका में स्थिरता, विवाह अथवा वैवाहिक संबंध, आर्थिक उत्तरदायित्व और सामाजिक पहचान।';
            themeEn = 'Career consolidation, marriage/relationship milestone, and core financial responsibilities.';
          } else if (startAge >= 35 && startAge < 50) {
            themeHi = 'व्यावसायिक विस्तार, सामाजिक मान-प्रतिष्ठा, अचल संपत्ति और पारिवारिक उत्तरदायित्वों की पूर्ति।';
            themeEn = 'Professional expansion, status growth, asset acquisition, and family duties.';
          } else if (startAge >= 50) {
            themeHi = 'परिपक्वता, वित्तीय आत्मनिर्भरता, गहन अनुभव एवं आध्यात्मिक-दार्शनिक चिंतन का समय।';
            themeEn = 'Mature consolidation, wisdom sharing, financial self-reliance, and spiritual orientation.';
          }

          pastMilestones.push({
            years: `${sYear}–${Math.min(currentYear, eYear)}`,
            ageRange: `आयु ${startAge}–${endAge} वर्ष`,
            dasha: pName,
            dashaHindi: pHindi,
            keyTheme: themeEn,
            keyThemeHindi: themeHi,
          });
        }
      }

      const isSadeSati = Boolean(chart.dosha?.isSadeSati);
      const sadeSatiPhase = chart.dosha?.sadeSatiPhase || '';
      let saturnStatusEn = 'Saturn in favorable transit; rewarding dedicated effort.';
      let saturnStatusHi = 'शनि देव अनुकूल भाव गोचर में हैं; निरंतर कर्म व ईमानदारी का शुभ फल प्राप्त हो रहा है।';
      if (isSadeSati) {
        saturnStatusEn = `Active Saturn Sade Sati (${sadeSatiPhase || 'active phase'}). Demands patience, disciplined routine, and emotional grit.`;
        saturnStatusHi = `शनि की साढ़ेसाती का प्रभाव (${sadeSatiPhase || 'सक्रिय चरण'})। धैर्य, अनुशासन और जल्दबाजी से बचने का समय।`;
      }

      const future5Years: Array<{
        year: number;
        age: number;
        dashaPeriod: string;
        forecastHindi: string;
        forecastEn: string;
        focusArea: string;
      }> = [];

      const curDashaPlanet = currentDashaObj ? currentDashaObj.planet : 'Jupiter';
      const curDashaHindi = currentDashaObj?.hindiName || PLANETS_HINDI[curDashaPlanet as VedicPlanet] || curDashaPlanet;

      for (let offset = 0; offset < 5; offset++) {
        const fYear = currentYear + offset;
        const fAge = currentAge + offset;

        const matchingDasha = dPeriods.find((d) => {
          const sy = parseInt(d.startDate, 10);
          const ey = parseInt(d.endDate, 10);
          return fYear >= sy && fYear <= ey;
        }) || currentDashaObj;

        const dPlanet = matchingDasha ? matchingDasha.planet : curDashaPlanet;
        const dHindi = matchingDasha?.hindiName || PLANETS_HINDI[dPlanet as VedicPlanet] || dPlanet;

        let fHi = '';
        let fEn = '';
        let focus = '';

        if (offset === 0) {
          fHi = `वर्ष ${fYear} (आयु ${fAge}): ${dHindi} का प्रभाव। आजीविका और व्यक्तिगत योजनाओं में महत्वपूर्ण पुनर्गठन; पुराने रुके हुए प्रयासों को नई दिशा मिलेगी।`;
          fEn = `Year ${fYear} (Age ${fAge}): Under ${dPlanet}. Career restructuring, clearing pending roadblocks, and fresh initiatives.`;
          focus = 'करियर व स्थिरता';
        } else if (offset === 1) {
          fHi = `वर्ष ${fYear} (आयु ${fAge}): आर्थिक उन्नति, शुभ संपर्कों का विस्तार, पद-प्रतिष्ठा में वृद्धि तथा आत्मविश्वास में भारी उछाल।`;
          fEn = `Year ${fYear} (Age ${fAge}): Financial growth, valuable professional connections, and elevation in public reputation.`;
          focus = 'धन लाभ व पदोन्नति';
        } else if (offset === 2) {
          fHi = `वर्ष ${fYear} (आयु ${fAge}): पारिवारिक सौहार्द, संपत्ति या वाहन आदि के योग, तथा व्यक्तिगत जीवन में बड़े सकारात्मक फैसले।`;
          fEn = `Year ${fYear} (Age ${fAge}): Domestic bliss, asset/property prospects, and major empowering life decisions.`;
          focus = 'संपत्ति व पारिवारिक सुख';
        } else if (offset === 3) {
          fHi = `वर्ष ${fYear} (आयु ${fAge}): कार्यक्षेत्र में विस्तार, नेतृत्वकारी भूमिका, नई जिम्मेदारियां; स्वास्थ्य और खानपान पर संतुलन रखें।`;
          fEn = `Year ${fYear} (Age ${fAge}): Professional expansion, leadership responsibilities; balance recommended for physical vitality.`;
          focus = 'कार्य विस्तार व स्वास्थ्य';
        } else {
          fHi = `वर्ष ${fYear} (आयु ${fAge}): दीर्घकालिक परिश्रम का सुखद प्रतिफल, आर्थिक मजबूती, सामाजिक प्रतिष्ठा और मानसिक शांति का स्वर्णिम समय।`;
          fEn = `Year ${fYear} (Age ${fAge}): Harvesting rewards of perseverance, solid financial base, high honor, and mental fulfillment.`;
          focus = 'सफलता व परिपक्वता';
        }

        future5Years.push({
          year: fYear,
          age: fAge,
          dashaPeriod: `${dPlanet} (${dHindi})`,
          forecastHindi: fHi,
          forecastEn: fEn,
          focusArea: focus,
        });
      }

      return {
        age: currentAge,
        currentYear,
        pastMilestones,
        currentSituation: {
          activeDasha: curDashaPlanet,
          activeDashaHindi: curDashaHindi,
          saturnTransitStatus: saturnStatusEn,
          saturnTransitStatusHindi: saturnStatusHi,
          jupiterTransitStatus: 'Jupiter blessing 9th/5th house trines bringing wisdom and opportunities',
          jupiterTransitStatusHindi: 'बृहस्पति देव का शुभ दृष्टि प्रभाव ज्ञान, मार्गदर्शन व अनुकूल अवसर प्रदान कर रहा है।',
          runningPhaseVedicSummary: `जातक वर्तमान में ${currentAge} वर्ष की आयु में ${curDashaHindi} की दशा के प्रभाव में है।`,
          currentMindsetState: 'जातक भविष्य को लेकर जागरूक है और सही समय पर सटीक निर्णय लेने हेतु प्रयासरत है।',
        },
        future5Years,
      };
    })(),
  };
}
