export type Language = 'en' | 'hi';

export interface BirthDetails {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type VedicPlanet =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu'
  | 'Ascendant';

export interface PlanetInfo {
  name: VedicPlanet;
  hindiName: string;
  sign: ZodiacSign;
  signHindi: string;
  signNumber: number; // 1-12
  house: number; // 1-12
  degree: number; // 0 - 30 deg
  formattedDegree: string;
  nakshatra: string;
  nakshatraHindi: string;
  pada: number;
  isRetrograde: boolean;
  dignity: 'Exalted' | 'Debilitated' | 'Own' | 'Friendly' | 'Enemy' | 'Neutral';
  dignityHindi: string;
}

export interface HouseInfo {
  houseNumber: number;
  signNumber: number;
  sign: ZodiacSign;
  signHindi: string;
  planets: PlanetInfo[];
  significations: string;
  significationsHindi: string;
}

export interface DashaPeriod {
  planet: VedicPlanet;
  hindiName: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  current?: boolean;
}

export interface DoshaReport {
  isManglik: boolean;
  manglikPercentage: number;
  manglikDescription: string;
  manglikDescriptionHindi: string;
  isKalsarp: boolean;
  kalsarpType: string;
  kalsarpDescription: string;
  kalsarpDescriptionHindi: string;
  isSadeSati: boolean;
  sadeSatiPhase: string;
  sadeSatiDescription: string;
  sadeSatiDescriptionHindi: string;
}

export interface AuspiciousYoga {
  id: string;
  name: string;
  nameHindi: string;
  category: 'raj_yoga' | 'dhana_yoga' | 'mahapurusha' | 'gyana_yoga' | 'special_yoga';
  categoryLabel: string;
  categoryLabelHindi: string;
  planetsInvolved: string[];
  planetsInvolvedHindi: string[];
  formation: string;
  formationHindi: string;
  description: string;
  descriptionHindi: string;
  impact: string;
  impactHindi: string;
  strength: 'Exceptional' | 'Strong' | 'Moderate';
  strengthHindi: string;
}

export interface KundaliResult {
  birthDetails: BirthDetails;
  ascendantSign: ZodiacSign;
  ascendantSignHindi: string;
  ascendantDegree: string;
  moonSign: ZodiacSign;
  moonSignHindi: string;
  sunSign: ZodiacSign;
  sunSignHindi: string;
  birthNakshatra: string;
  birthNakshatraHindi: string;
  nakshatraLord: string;
  tithi: string;
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  planets: PlanetInfo[];
  houses: HouseInfo[];
  dashaPeriods: DashaPeriod[];
  dosha: DoshaReport;
  yogas: AuspiciousYoga[];
  aiAnalysis?: string;
}

export interface MatchGuna {
  name: string;
  hindiName: string;
  maxPoints: number;
  obtainedPoints: number;
  groomValue: string;
  brideValue: string;
  area: string;
  areaHindi: string;
  description: string;
  descriptionHindi: string;
}

export interface MatchmakingResult {
  groomDetails: BirthDetails;
  brideDetails: BirthDetails;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  recommendation: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
  recommendationHindi: string;
  gunas: MatchGuna[];
  manglikCheck: {
    groomManglik: boolean;
    brideManglik: boolean;
    compatibility: string;
    compatibilityHindi: string;
  };
  nadiDosha: boolean;
  bhakootDosha: boolean;
  aiReport?: string;
}

export interface DailyHoroscope {
  sign: ZodiacSign;
  signHindi: string;
  sanskritName: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  rulingPlanet: string;
  date: string;
  summary: string;
  summaryHindi: string;
  ratings: {
    overall: number;
    love: number;
    career: number;
    wealth: number;
    health: number;
  };
  luckyNumber: number;
  luckyColor: string;
  luckyColorHindi: string;
  luckyTime: string;
  auspiciousDirection: string;
  mantra: string;
  mantraHindi: string;
}

export interface PanchangData {
  date: string;
  location: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  tithiHindi: string;
  tithiEndTime: string;
  nakshatra: string;
  nakshatraHindi: string;
  nakshatraEndTime: string;
  yoga: string;
  yogaHindi: string;
  karana: string;
  karanaHindi: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  abhijitMuhurat: string;
  shubhMuhurat: string[];
  choghadiyaDay: { name: string; type: 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Rog' | 'Kaal' | 'Udveg'; time: string }[];
}

export interface NumerologyData {
  name: string;
  dob: string;
  mulank: number; // Driver / Psychic (1-9)
  bhagyank: number; // Conductor / Destiny (1-9)
  namank: number; // Name Number (1-9)
  kuaNumber: number;
  rulingPlanet: string;
  rulingPlanetHindi: string;
  qualities: string[];
  luckyDays: string[];
  luckyColors: string[];
  luckyGems: string[];
  compatibleNumbers: number[];
  enemyNumbers: number[];
  careerProspects: string[];
  loShuGrid: number[][]; // 3x3 grid
  analysis: string;
  analysisHindi: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  modelUsed?: string;
  isLiveAI?: boolean;
}

export type VargaCode =
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D7'
  | 'D9'
  | 'D10'
  | 'D12'
  | 'D16'
  | 'D20'
  | 'D24'
  | 'D27'
  | 'D30'
  | 'D40'
  | 'D45'
  | 'D60';

export interface VargaPlanet {
  name: VedicPlanet;
  hindiName: string;
  signNumber: number; // 1-12
  sign: ZodiacSign;
  signHindi: string;
  house: number; // 1-12
  degree: number;
  formattedDegree: string;
  isVargottama?: boolean;
  isPushkara?: boolean;
  dignity?: string;
}

export interface VargaHouse {
  houseNumber: number;
  signNumber: number;
  sign: ZodiacSign;
  signHindi: string;
  planets: VargaPlanet[];
}

export interface VargaChartData {
  code: VargaCode;
  name: string;
  hindiName: string;
  sanskritName: string;
  signification: string;
  significationHindi: string;
  divisionFactor: number;
  ascendantSignNumber: number;
  ascendantSign: ZodiacSign;
  ascendantSignHindi: string;
  planets: VargaPlanet[];
  houses: VargaHouse[];
}

export interface CharaKaraka {
  planet: VedicPlanet;
  hindiName: string;
  code: 'AK' | 'AmK' | 'BK' | 'MK' | 'PiK' | 'PK' | 'GK' | 'DK';
  title: string;
  titleHindi: string;
  degreeInSign: number;
  formattedDegree: string;
  sign: ZodiacSign;
  signHindi: string;
  signification: string;
  significationHindi: string;
  karakamshaSign: ZodiacSign;
  karakamshaSignHindi: string;
}

export interface SpecialLagnaInfo {
  code: string;
  name: string;
  hindiName: string;
  sign: ZodiacSign;
  signHindi: string;
  houseFromLagna: number;
  formattedDegree: string;
  description: string;
  descriptionHindi: string;
}

export interface ArudhaPadaInfo {
  code: string;
  name: string;
  hindiName: string;
  houseRepresented: number;
  occupiedSign: ZodiacSign;
  occupiedSignHindi: string;
  occupiedHouse: number;
  signification: string;
  significationHindi: string;
}

export interface ShadbalaItem {
  planet: VedicPlanet;
  hindiName: string;
  sthanaBala: number; // in Virupas
  digBala: number;
  kaalaBala: number;
  cheshtaBala: number;
  naisargikaBala: number;
  drikBala: number;
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  ratio: number; // percentage
  rank: number;
  verdict: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak';
  verdictHindi: string;
  ishtaPhala: number;
  kashtaPhala: number;
}

export interface AshtakavargaPlanetaryTable {
  planet: VedicPlanet;
  hindiName: string;
  bindus: number[]; // 12 signs
  totalBindus: number;
  rashiPinda: number;
  grahaPinda: number;
  shodhyaPinda: number;
}

export interface SarvashtakavargaData {
  signBindus: { signNumber: number; sign: ZodiacSign; signHindi: string; bindus: number; houseFromLagna: number; strength: 'Very Strong' | 'Strong' | 'Average' | 'Low' }[];
  totalBindus: number; // typically 337
  planetaryTables: AshtakavargaPlanetaryTable[];
  samudayaStrength: string;
  samudayaStrengthHindi: string;
}

export interface PlanetaryAvasthaInfo {
  planet: VedicPlanet;
  hindiName: string;
  baladi: 'Bala (Infant)' | 'Kumara (Youthful)' | 'Yuva (Adult/Prime)' | 'Vriddha (Aged)' | 'Mrita (Dead/Inactive)';
  baladiHindi: string;
  jagradadi: 'Jagrata (Awake - 100%)' | 'Swapna (Dreaming - 50%)' | 'Sushupti (Asleep - 0%)';
  jagradadiHindi: string;
  deeptadi: 'Deepta (Exalted - Radiant)' | 'Swastha (Own Sign - Peaceful)' | 'Mudita (Friendly - Happy)' | 'Shanta (Calm)' | 'Dina (Depressed)' | 'Vikala (Afflicted/Combust)' | 'Khala (Wicked/Enemy)' | 'Kopa (Angry/Combust)';
  deeptadiHindi: string;
  isCombust: boolean;
  isVargottama: boolean;
  isPushkaraNavamsha: boolean;
  pushkaraDegreeDescription: string;
}

export interface DetailedVimshottariPeriod {
  mahadasha: VedicPlanet;
  mahadashaHindi: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent: boolean;
  antardashas: {
    antardasha: VedicPlanet;
    antardashaHindi: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    pratyantardashas: {
      pratyantardasha: VedicPlanet;
      pratyantardashaHindi: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
    }[];
  }[];
}

export interface JagannathaHoraData {
  birthDetails: BirthDetails;
  vargas: Record<VargaCode, VargaChartData>;
  charaKarakas: CharaKaraka[];
  karakamsha: {
    sign: ZodiacSign;
    signHindi: string;
    houseInD1: number;
    houseInD9: number;
    atmakarakaPlanet: VedicPlanet;
  };
  specialLagnas: SpecialLagnaInfo[];
  arudhaPadas: ArudhaPadaInfo[];
  shadbala: {
    planets: ShadbalaItem[];
    strongestPlanet: VedicPlanet;
    weakestPlanet: VedicPlanet;
  };
  ashtakavarga: SarvashtakavargaData;
  avasthas: PlanetaryAvasthaInfo[];
  hierarchicalDasha: DetailedVimshottariPeriod[];
  pushkaraPlanets: { planet: VedicPlanet; varga: string; degree: string; benefit: string; benefitHindi: string }[];
}

