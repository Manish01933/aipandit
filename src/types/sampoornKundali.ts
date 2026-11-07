import { BirthDetails, ZodiacSign, VedicPlanet } from './astrology';

export type QuestionCategory =
  | 'career'
  | 'business'
  | 'marriage'
  | 'relationship'
  | 'finance'
  | 'education'
  | 'travel'
  | 'foreign'
  | 'family'
  | 'children'
  | 'property'
  | 'health'
  | 'spirituality'
  | 'general';

export type AstrologicalConfidence = 'strong' | 'medium' | 'moderate';

export interface SampoornQuestionAnswer {
  question: string;
  category: QuestionCategory;
  categoryLabel: string;
  categoryLabelHindi: string;
  directAnswer: string;
  astrologicalBasis: string;
  keyIndicators: string[];
  opportunities: string[];
  precautions: string[];
  timingSignals: string;
  finalConclusion: string;
  confidence: AstrologicalConfidence;
  confidenceLabel: string;
  confidenceBasis: string;
}

export interface SampoornLagnaAnalysis {
  lagnaSign: ZodiacSign;
  lagnaSignHindi: string;
  degree: string;
  lagnaLord: VedicPlanet;
  lagnaLordHindi: string;
  lagnaLordPlacement: string;
  influencingPlanets: string[];
  personalityTraits: string[];
  naturalStrengths: string[];
  challenges: string[];
  decisionMakingTendencies: string;
  overallLifeDirection: string;
}

export interface SampoornPlanetItem {
  planet: VedicPlanet;
  hindiName: string;
  sign: ZodiacSign;
  signHindi: string;
  house: number;
  degree: string;
  nakshatra: string;
  pada: number;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: string;
  dignityHindi: string;
  houseOwnership: string;
  aspects: string;
  strength: string;
  positiveInfluence: string;
  potentialChallenge: string;
  relevanceToQuestion: string;
}

export interface SampoornHouseItem {
  houseNumber: number;
  houseName: string;
  houseNameHindi: string;
  sign: ZodiacSign;
  signHindi: string;
  houseLord: VedicPlanet;
  houseLordHindi: string;
  lordPlacement: string;
  occupyingPlanets: string[];
  aspectingPlanets: string[];
  strength: string;
  positiveIndications: string;
  challenges: string;
  relevantLifeAreas: string;
  isQuestionRelevant: boolean;
}

export interface SampoornYogaItem {
  name: string;
  nameHindi: string;
  category: string;
  formationReason: string;
  planetsHousesInvolved: string;
  strength: string;
  potentialResults: string;
  activationPeriod: string;
}

export interface SampoornDoshaItem {
  name: string;
  nameHindi: string;
  status: string;
  description: string;
  mitigatingFactors: string;
  remedy: string;
}

export interface SampoornDivisionalChartAnalysis {
  code: string;
  name: string;
  hindiName: string;
  representation: string;
  representationHindi: string;
  keyPlacements: string;
  strengthsAndChallenges: string;
  d1ConfirmationOrChange: string;
  relevanceToQuestion: string;
}

export interface SampoornDashaAnalysis {
  mahadasha: {
    planet: VedicPlanet;
    planetHindi: string;
    startDate: string;
    endDate: string;
    houseOwnership: string;
    natalPlacement: string;
    strength: string;
    mainThemes: string;
  };
  antardasha: {
    planet: VedicPlanet;
    planetHindi: string;
    startDate: string;
    endDate: string;
    interactionWithMahaLord: string;
    likelyThemes: string;
  };
  pratyantarDasha?: {
    planet: VedicPlanet;
    planetHindi: string;
    startDate: string;
    endDate: string;
  };
  whatItActivates: string;
  dashaSummaryForQuestion: string;
}

export interface SampoornTimelineItem {
  yearRange: string;
  title: string;
  theme: string;
  astrologicalBasis: string;
  confidence: AstrologicalConfidence;
  confidenceLabel: string;
  guidance: string;
}

export interface SampoornKundaliAnalysisReport {
  id: string;
  timestamp: string;
  modelUsed?: string;
  isLiveAI: boolean;
  birthDetails: BirthDetails;
  userQuestion: string;
  questionAnalysis: SampoornQuestionAnswer;
  lagnaAnalysis: SampoornLagnaAnalysis;
  planetaryAnalysis: SampoornPlanetItem[];
  housesAnalysis: SampoornHouseItem[];
  yogasAnalysis: SampoornYogaItem[];
  doshasAnalysis: SampoornDoshaItem[];
  divisionalCharts: {
    d1: SampoornDivisionalChartAnalysis;
    d9: SampoornDivisionalChartAnalysis;
    d10: SampoornDivisionalChartAnalysis;
    d2Hora: SampoornDivisionalChartAnalysis;
    otherCharts: SampoornDivisionalChartAnalysis[];
  };
  dashaAnalysis: SampoornDashaAnalysis;
  majorStrengths: string[];
  majorChallenges: string[];
  timingWindows: string[];
  lifeTimeline: SampoornTimelineItem[];
  finalSummary: string;
  fullMarkdownReport?: string;
}
