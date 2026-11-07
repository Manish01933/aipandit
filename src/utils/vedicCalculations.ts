import * as Astronomy from 'astronomy-engine';
import {
  BirthDetails,
  KundaliResult,
  PlanetInfo,
  HouseInfo,
  ZodiacSign,
  VedicPlanet,
  DashaPeriod,
  DoshaReport,
  AuspiciousYoga,
  MatchmakingResult,
  MatchGuna,
  DailyHoroscope,
  PanchangData,
  NumerologyData,
} from '../types/astrology';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const ZODIAC_HINDI: Record<ZodiacSign, string> = {
  Aries: 'मेष (Mesh)',
  Taurus: 'वृषभ (Vrishabh)',
  Gemini: 'मिथुन (Mithun)',
  Cancer: 'कर्क (Kark)',
  Leo: 'सिंह (Singh)',
  Virgo: 'कन्या (Kanya)',
  Libra: 'तुला (Tula)',
  Scorpio: 'वृश्चिक (Vrishchik)',
  Sagittarius: 'धनु (Dhanu)',
  Capricorn: 'मकर (Makar)',
  Aquarius: 'कुंभ (Kumbh)',
  Pisces: 'मीन (Meen)',
};

export const NAKSHATRAS = [
  { name: 'Ashwini', hindi: 'अश्विनी', lord: 'Ketu', deity: 'Ashwini Kumaras', yoni: 'Ashwa (Horse)', yoniHindi: 'अश्व (घोड़ा)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Bharani', hindi: 'भरणी', lord: 'Venus', deity: 'Yama', yoni: 'Gaja (Elephant)', yoniHindi: 'गज (हाथी)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Krittika', hindi: 'कृत्तिका', lord: 'Sun', deity: 'Agni', yoni: 'Mesha (Sheep/Ram)', yoniHindi: 'मेष (भेड़/बकरा)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Rohini', hindi: 'रोहिणी', lord: 'Moon', deity: 'Brahma', yoni: 'Sarpa (Serpent)', yoniHindi: 'सर्प (सांप)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Mrigashira', hindi: 'मृगशिरा', lord: 'Mars', deity: 'Soma', yoni: 'Sarpa (Serpent)', yoniHindi: 'सर्प (सांप)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Ardra', hindi: 'आर्द्रा', lord: 'Rahu', deity: 'Rudra', yoni: 'Shwana (Dog)', yoniHindi: 'श्वान (कुत्ता)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Punarvasu', hindi: 'पुनर्वसु', lord: 'Jupiter', deity: 'Aditi', yoni: 'Marjara (Cat)', yoniHindi: 'मार्जार (बिल्ली)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Pushya', hindi: 'पुष्य', lord: 'Saturn', deity: 'Brihaspati', yoni: 'Mesha (Goat/Sheep)', yoniHindi: 'मेष (बकरा)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Ashlesha', hindi: 'आश्लेषा', lord: 'Mercury', deity: 'Nagas', yoni: 'Marjara (Cat)', yoniHindi: 'मार्जार (बिल्ली)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Magha', hindi: 'मघा', lord: 'Ketu', deity: 'Pitris', yoni: 'Mushaka (Rat)', yoniHindi: 'मूषक (चूहा)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Purva Phalguni', hindi: 'पूर्वाफाल्गुनी', lord: 'Venus', deity: 'Bhaga', yoni: 'Mushaka (Rat)', yoniHindi: 'मूषक (चूहा)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Uttara Phalguni', hindi: 'उत्तराफाल्गुनी', lord: 'Sun', deity: 'Aryaman', yoni: 'Gau (Cow)', yoniHindi: 'गौ (गाय)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Hasta', hindi: 'हस्त', lord: 'Moon', deity: 'Savitar', yoni: 'Mahisha (Buffalo)', yoniHindi: 'महिष (भैंस)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Chitra', hindi: 'चित्रा', lord: 'Mars', deity: 'Tvashtar', yoni: 'Vyaghra (Tiger)', yoniHindi: 'व्याघ्र (बाघ)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Swati', hindi: 'स्वाति', lord: 'Rahu', deity: 'Vayu', yoni: 'Mahisha (Buffalo)', yoniHindi: 'महिष (भैंसा)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Vishakha', hindi: 'विशाखा', lord: 'Jupiter', deity: 'Indra-Agni', yoni: 'Vyaghra (Tiger)', yoniHindi: 'व्याघ्र (बाघ)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Anuradha', hindi: 'अनुराधा', lord: 'Saturn', deity: 'Mitra', yoni: 'Mriga (Deer)', yoniHindi: 'मृग (हिरण)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Jyeshtha', hindi: 'ज्येष्ठा', lord: 'Mercury', deity: 'Indra', yoni: 'Mriga (Deer)', yoniHindi: 'मृग (हिरण)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Mula', hindi: 'मूल', lord: 'Ketu', deity: 'Nirriti', yoni: 'Shwana (Dog)', yoniHindi: 'श्वान (कुत्ता)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Purva Ashadha', hindi: 'पूर्वाषाढ़ा', lord: 'Venus', deity: 'Apas', yoni: 'Vanara (Monkey)', yoniHindi: 'वानर (बंदर)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Uttara Ashadha', hindi: 'उत्तराषाढ़ा', lord: 'Sun', deity: 'Vishvedevas', yoni: 'Nakula (Mongoose)', yoniHindi: 'नकुल (नेवला)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Shravana', hindi: 'श्रवण', lord: 'Moon', deity: 'Vishnu', yoni: 'Vanara (Monkey)', yoniHindi: 'वानर (बंदर)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
  { name: 'Dhanishta', hindi: 'धनिष्ठा', lord: 'Mars', deity: 'Vasus', yoni: 'Simha (Lion)', yoniHindi: 'सिंह (शेर)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Shatabhisha', hindi: 'शतभिषा', lord: 'Rahu', deity: 'Varuna', yoni: 'Ashwa (Horse)', yoniHindi: 'अश्व (घोड़ा)', gana: 'Rakshasa', ganaHindi: 'राक्षस गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Purva Bhadrapada', hindi: 'पूर्वभाद्रपद', lord: 'Jupiter', deity: 'Aja Ekapada', yoni: 'Simha (Lion)', yoniHindi: 'सिंह (शेर)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Adi', nadiHindi: 'आदि नाड़ी (वात)' },
  { name: 'Uttara Bhadrapada', hindi: 'उत्तरभाद्रपद', lord: 'Saturn', deity: 'Ahir Budhnya', yoni: 'Gau (Cow)', yoniHindi: 'गौ (गाय)', gana: 'Manushya', ganaHindi: 'मनुष्य गण', nadi: 'Madhya', nadiHindi: 'मध्य नाड़ी (पित्त)' },
  { name: 'Revati', hindi: 'रेवती', lord: 'Mercury', deity: 'Pushan', yoni: 'Gaja (Elephant)', yoniHindi: 'गज (हाथी)', gana: 'Deva', ganaHindi: 'देव गण', nadi: 'Antya', nadiHindi: 'अंत्य नाड़ी (कफ)' },
];

export const PLANETS_HINDI: Record<VedicPlanet, string> = {
  Sun: 'सूर्य (Surya)',
  Moon: 'चंद्र (Chandra)',
  Mars: 'मंगल (Mangal)',
  Mercury: 'बुध (Budha)',
  Jupiter: 'बृहस्पति / गुरु (Guru)',
  Venus: 'शुक्र (Shukra)',
  Saturn: 'शनि (Shani)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)',
  Ascendant: 'लग्न (Lagna)',
};

const DASHA_YEARS: Record<VedicPlanet, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
  Ascendant: 0,
};

const DASHA_SEQUENCE: VedicPlanet[] = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rahu',
  'Jupiter',
  'Saturn',
  'Mercury',
];

// Helper: Julian Day from Date & Time
export function getJulianDay(date: Date, timezoneOffset = 5.5): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + hour / 24.0;
  return jd;
}

export function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// Varna Helper
export function getVarna(sign: ZodiacSign): { varna: string; varnaHindi: string; rank: number } {
  switch (sign) {
    case 'Cancer':
    case 'Scorpio':
    case 'Pisces':
      return { varna: 'Brahmin (ब्राह्मण)', varnaHindi: 'ब्राह्मण वर्ण', rank: 4 };
    case 'Aries':
    case 'Leo':
    case 'Sagittarius':
      return { varna: 'Kshatriya (क्षत्रिय)', varnaHindi: 'क्षत्रिय वर्ण', rank: 3 };
    case 'Taurus':
    case 'Virgo':
    case 'Capricorn':
      return { varna: 'Vaishya (वैश्य)', varnaHindi: 'वैश्य वर्ण', rank: 2 };
    case 'Gemini':
    case 'Libra':
    case 'Aquarius':
    default:
      return { varna: 'Shudra (शूद्र)', varnaHindi: 'शूद्र वर्ण', rank: 1 };
  }
}

// Vashya Helper
export function getVashya(sign: ZodiacSign, degInSign = 0): { vashya: string; vashyaHindi: string; group: 'Chatushpada' | 'Manava' | 'Jalachara' | 'Vanachara' | 'Keeta' } {
  switch (sign) {
    case 'Aries':
    case 'Taurus':
      return { vashya: 'Chatushpada (Quadruped)', vashyaHindi: 'चतुष्पद (पशु)', group: 'Chatushpada' };
    case 'Sagittarius':
      return degInSign >= 15
        ? { vashya: 'Chatushpada (Quadruped)', vashyaHindi: 'चतुष्पद (पशु)', group: 'Chatushpada' }
        : { vashya: 'Dwipada / Manava (Human)', vashyaHindi: 'द्विपद / मानव', group: 'Manava' };
    case 'Capricorn':
      return degInSign < 15
        ? { vashya: 'Chatushpada (Quadruped)', vashyaHindi: 'चतुष्पद (पशु)', group: 'Chatushpada' }
        : { vashya: 'Jalachara (Aquatic)', vashyaHindi: 'जलचर', group: 'Jalachara' };
    case 'Gemini':
    case 'Virgo':
    case 'Libra':
    case 'Aquarius':
      return { vashya: 'Dwipada / Manava (Human)', vashyaHindi: 'द्विपद / मानव', group: 'Manava' };
    case 'Cancer':
    case 'Pisces':
      return { vashya: 'Jalachara (Aquatic)', vashyaHindi: 'जलचर', group: 'Jalachara' };
    case 'Leo':
      return { vashya: 'Vanachara / Simha (Lion/Wild)', vashyaHindi: 'वनचर / सिंह', group: 'Vanachara' };
    case 'Scorpio':
      return { vashya: 'Keeta (Insect)', vashyaHindi: 'कीट', group: 'Keeta' };
    default:
      return { vashya: 'Dwipada / Manava (Human)', vashyaHindi: 'द्विपद / मानव', group: 'Manava' };
  }
}

// Tithi Calculator
export function calculateTithi(moonLon: number, sunLon: number): { tithiName: string; tithiNameHindi: string; paksha: string; pakshaHindi: string; tithiNumber: number } {
  const diff = normalizeDegrees(moonLon - sunLon);
  const tithiIndex = Math.floor(diff / 12); // 0 to 29
  const isShukla = tithiIndex < 15;
  const numInPaksha = (tithiIndex % 15) + 1;

  const tithiNames = [
    'Pratipada (प्रतिपदा)',
    'Dwitiya (द्वितीया)',
    'Tritiya (तृतीया)',
    'Chaturthi (चतुर्थी)',
    'Panchami (पंचमी)',
    'Shashthi (षष्ठी)',
    'Saptami (सप्तमी)',
    'Ashtami (अष्टमी)',
    'Navami (नवमी)',
    'Dashami (दशमी)',
    'Ekadashi (एकादशी)',
    'Dwadashi (द्वादशी)',
    'Trayodashi (त्रयोदशी)',
    'Chaturdashi (चतुर्दशी)',
    isShukla ? 'Purnima (पूर्णिमा)' : 'Amavasya (अमावस्या)',
  ];

  const name = tithiNames[numInPaksha - 1];
  const paksha = isShukla ? 'Shukla Paksha (शुक्ल पक्ष)' : 'Krishna Paksha (कृष्ण पक्ष)';
  const pakshaHindi = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const fullName = `${isShukla ? 'Shukla' : 'Krishna'} ${name}`;
  const fullNameHindi = `${pakshaHindi} ${name}`;

  return {
    tithiName: fullName,
    tithiNameHindi: fullNameHindi,
    paksha,
    pakshaHindi,
    tithiNumber: tithiIndex + 1,
  };
}

// Flexible Date and Time parsers supporting all international and Indian formats
export function parseFlexibleDate(dobStr: string): { year: number; month: number; day: number } {
  if (!dobStr) return { year: 1998, month: 1, day: 1 };
  const str = String(dobStr).trim();
  const parts = str.split(/[-/.\s]+/).map((p) => parseInt(p, 10)).filter((n) => !isNaN(n));
  if (parts.length >= 3) {
    if (parts[0] > 1000) {
      // YYYY-MM-DD or YYYY/MM/DD
      return { year: parts[0], month: Math.min(12, Math.max(1, parts[1])), day: Math.min(31, Math.max(1, parts[2])) };
    } else if (parts[2] > 1000) {
      // DD-MM-YYYY or MM-DD-YYYY (Indian format: DD-MM-YYYY)
      return { year: parts[2], month: Math.min(12, Math.max(1, parts[1])), day: Math.min(31, Math.max(1, parts[0])) };
    }
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return { year: parsed.getUTCFullYear(), month: parsed.getUTCMonth() + 1, day: parsed.getUTCDate() };
  }
  return { year: 1998, month: 1, day: 1 };
}

export function parseFlexibleTime(tobStr: string): { hour: number; minute: number; second: number } {
  if (!tobStr) return { hour: 12, minute: 0, second: 0 };
  const str = String(tobStr).trim().toLowerCase();
  const isPM = str.includes('pm') || str.includes('सायं') || str.includes('शाम') || str.includes('रात');
  const isAM = str.includes('am') || str.includes('प्रात') || str.includes('सुबह');

  const cleanStr = str.replace(/[^0-9:]/g, '');
  const parts = cleanStr.split(':').map((p) => parseInt(p, 10)).filter((n) => !isNaN(n));
  let hour = parts[0] || 0;
  let minute = parts[1] || 0;
  let second = parts[2] || 0;

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  hour = Math.min(23, Math.max(0, hour));
  minute = Math.min(59, Math.max(0, minute));
  second = Math.min(59, Math.max(0, second));

  return { hour, minute, second };
}

// Calculate Vedic planetary longitudes using Lahiri Ayanamsha & Geocentric VSOP87 Astronomy
export function calculateVedicPlanetaryPositions(
  dob: string,
  tob: string,
  latitude: number,
  longitude: number,
  timezone = 5.5
): { planets: PlanetInfo[]; ascendantDegree: number; ascendantSign: ZodiacSign } {
  const safeLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 28.6139;
  const safeLon = typeof longitude === 'number' && !isNaN(longitude) ? longitude : 77.209;
  const safeTz = typeof timezone === 'number' && !isNaN(timezone) ? timezone : 5.5;

  const { year, month, day } = parseFlexibleDate(dob);
  const { hour, minute, second } = parseFlexibleTime(tob);

  // UTC conversion
  const totalLocalHours = hour + minute / 60 + second / 3600;
  const utHours = totalLocalHours - safeTz;
  const birthDateUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) + utHours * 3600000);

  const astroTime = Astronomy.MakeTime(birthDateUTC);
  // In astronomy-engine, astroTime.ut is days since J2000.0 (JD 2451545.0)
  // Julian centuries since J2000.0 (T) = astroTime.ut / 36525.0
  const tCenturies = astroTime.ut / 36525.0;

  // Standard Lahiri (Chitra Paksha) Ayanamsha:
  // At J2000.0, Ayanamsha = 23° 51' 25.53" = 23.857092°
  // Precession rate = 50.290966" / year (0.01396971° / tropical year = 1.396971° / century)
  const ayanamsha = 23.857092 + 1.396971 * tCenturies + 0.000309 * tCenturies * tCenturies;

  // 1. High-precision Geocentric Ecliptic Longitudes (Tropical)
  // For the Sun, use SunPosition which returns apparent geocentric ecliptic coordinates (elon)
  const sunTropical = Astronomy.SunPosition(astroTime).elon;

  // Helper to get true Geocentric Ecliptic Longitude for any body
  const getGeocentricEclipticLon = (body: Astronomy.Body, time: Astronomy.AstroTime): number => {
    if (body === Astronomy.Body.Sun) {
      return Astronomy.SunPosition(time).elon;
    }
    const vec = Astronomy.GeoVector(body, time, true);
    const ecl = Astronomy.Ecliptic(vec);
    return ecl.elon;
  };

  const moonTropical = getGeocentricEclipticLon(Astronomy.Body.Moon, astroTime);
  const marsTropical = getGeocentricEclipticLon(Astronomy.Body.Mars, astroTime);
  const mercTropical = getGeocentricEclipticLon(Astronomy.Body.Mercury, astroTime);
  const jupTropical = getGeocentricEclipticLon(Astronomy.Body.Jupiter, astroTime);
  const venTropical = getGeocentricEclipticLon(Astronomy.Body.Venus, astroTime);
  const satTropical = getGeocentricEclipticLon(Astronomy.Body.Saturn, astroTime);

  // Convert to Sidereal (Nirayana) with Lahiri Ayanamsha
  const nirayanaSun = normalizeDegrees(sunTropical - ayanamsha);
  const nirayanaMoon = normalizeDegrees(moonTropical - ayanamsha);
  const nirayanaMars = normalizeDegrees(marsTropical - ayanamsha);
  const nirayanaMercury = normalizeDegrees(mercTropical - ayanamsha);
  const nirayanaJupiter = normalizeDegrees(jupTropical - ayanamsha);
  const nirayanaVenus = normalizeDegrees(venTropical - ayanamsha);
  const nirayanaSatura = normalizeDegrees(satTropical - ayanamsha);
  const nirayanaSaturn = nirayanaSatura;

  // Retrograde detection (Speed check: 1 hour later)
  const astroTimeNext = Astronomy.MakeTime(new Date(birthDateUTC.getTime() + 3600000));
  const checkRetrograde = (body: Astronomy.Body): boolean => {
    const lon1 = getGeocentricEclipticLon(body, astroTime);
    const lon2 = getGeocentricEclipticLon(body, astroTimeNext);
    let diff = lon2 - lon1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff < 0;
  };

  const isMarsRetro = checkRetrograde(Astronomy.Body.Mars);
  const isMercRetro = checkRetrograde(Astronomy.Body.Mercury);
  const isJupRetro = checkRetrograde(Astronomy.Body.Jupiter);
  const isVenRetro = checkRetrograde(Astronomy.Body.Venus);
  const isSatRetro = checkRetrograde(Astronomy.Body.Saturn);

  // Mean Lunar Ascending Node (Rahu) & Ketu (IAU formula)
  const meanNodeTropical = normalizeDegrees(
    125.04452 - 1934.136261 * tCenturies + 0.0020708 * tCenturies * tCenturies + (tCenturies * tCenturies * tCenturies) / 450000
  );
  const nirayanaRahu = normalizeDegrees(meanNodeTropical - ayanamsha);
  const nirayanaKetu = normalizeDegrees(nirayanaRahu + 180);

  // 2. Ascendant (Lagna) calculation using Local Apparent Sidereal Time (LAST)
  // GAST in sidereal hours [0, 24)
  const gastHours = Astronomy.SiderealTime(astroTime);
  // Local Sidereal Time in hours
  const lstHours = (gastHours + safeLon / 15.0 + 48.0) % 24.0;
  const ramcDeg = lstHours * 15.0; // Right Ascension of Midheaven in degrees
  const ramcRad = (ramcDeg * Math.PI) / 180.0;
  const latRad = (safeLat * Math.PI) / 180.0;

  // True Obliquity of Ecliptic (eps)
  const eps = 23.4392911 - 0.0130042 * tCenturies - 0.00000016 * tCenturies * tCenturies;
  const epsRad = (eps * Math.PI) / 180.0;

  // Standard Swiss Ephemeris / Jagannatha Hora Ascendant equation:
  // tan(Asc) = cos(RAMC) / (-sin(RAMC)*cos(eps) - tan(lat)*sin(eps))
  const yAsc = Math.cos(ramcRad);
  const xAsc = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = (Math.atan2(yAsc, xAsc) * 180.0) / Math.PI;
  ascTropical = normalizeDegrees(ascTropical);
  const nirayanaAsc = normalizeDegrees(ascTropical - ayanamsha);

  const ascSignNumber = Math.floor(nirayanaAsc / 30);
  const ascendantSign = ZODIAC_SIGNS[ascSignNumber];

  const rawPositions: { name: VedicPlanet; lon: number; isRetro: boolean }[] = [
    { name: 'Sun', lon: nirayanaSun, isRetro: false },
    { name: 'Moon', lon: nirayanaMoon, isRetro: false },
    { name: 'Mars', lon: nirayanaMars, isRetro: isMarsRetro },
    { name: 'Mercury', lon: nirayanaMercury, isRetro: isMercRetro },
    { name: 'Jupiter', lon: nirayanaJupiter, isRetro: isJupRetro },
    { name: 'Venus', lon: nirayanaVenus, isRetro: isVenRetro },
    { name: 'Saturn', lon: nirayanaSaturn, isRetro: isSatRetro },
    { name: 'Rahu', lon: nirayanaRahu, isRetro: true },
    { name: 'Ketu', lon: nirayanaKetu, isRetro: true },
    { name: 'Ascendant', lon: nirayanaAsc, isRetro: false },
  ];

  const planets: PlanetInfo[] = rawPositions.map((p) => {
    const normLon = normalizeDegrees(p.lon);
    const signIdx = Math.floor(normLon / 30) % 12;
    const sign = ZODIAC_SIGNS[signIdx] || 'Aries';
    const degInSign = normLon % 30;
    const degInt = Math.floor(degInSign);
    const minInt = Math.floor((degInSign - degInt) * 60);

    // Nakshatra (360 / 27 = 13.333333° each)
    const nakshatraIndex = Math.floor(normLon / (360 / 27));
    const safeNakIndex = ((nakshatraIndex % 27) + 27) % 27;
    const nakshatra = NAKSHATRAS[safeNakIndex] || NAKSHATRAS[0];
    const pada = Math.floor((normLon % (360 / 27)) / (360 / 108)) + 1;

    // House calculation from Ascendant sign (Whole Sign / Bhav system)
    const house = ((signIdx - ascSignNumber + 12) % 12) + 1;

    // Dignity evaluation
    let dignity: PlanetInfo['dignity'] = 'Neutral';
    let dignityHindi = 'सम (Neutral)';

    if (p.name === 'Sun') {
      if (sign === 'Aries') {
        dignity = 'Exalted';
        dignityHindi = 'उच्च (Exalted)';
      } else if (sign === 'Libra') {
        dignity = 'Debilitated';
        dignityHindi = 'नीच (Debilitated)';
      } else if (sign === 'Leo') {
        dignity = 'Own';
        dignityHindi = 'स्वराशि (Own Sign)';
      }
    } else if (p.name === 'Moon') {
      if (sign === 'Taurus') {
        dignity = 'Exalted';
        dignityHindi = 'उच्च (Exalted)';
      } else if (sign === 'Scorpio') {
        dignity = 'Debilitated';
        dignityHindi = 'नीच (Debilitated)';
      } else if (sign === 'Cancer') {
        dignity = 'Own';
        dignityHindi = 'स्वराशि (Own Sign)';
      }
    } else if (p.name === 'Jupiter') {
      if (sign === 'Cancer') {
        dignity = 'Exalted';
        dignityHindi = 'उच्च (Exalted)';
      } else if (sign === 'Capricorn') {
        dignity = 'Debilitated';
        dignityHindi = 'नीच (Debilitated)';
      } else if (sign === 'Sagittarius' || sign === 'Pisces') {
        dignity = 'Own';
        dignityHindi = 'स्वराशि (Own Sign)';
      }
    } else if (p.name === 'Mars') {
      if (sign === 'Capricorn') {
        dignity = 'Exalted';
        dignityHindi = 'उच्च (Exalted)';
      } else if (sign === 'Cancer') {
        dignity = 'Debilitated';
        dignityHindi = 'नीच (Debilitated)';
      } else if (sign === 'Aries' || sign === 'Scorpio') {
        dignity = 'Own';
        dignityHindi = 'स्वराशि (Own Sign)';
      }
    } else if (p.name === 'Venus') {
      if (sign === 'Pisces') {
        dignity = 'Exalted';
        dignityHindi = 'उच्च (Exalted)';
      } else if (sign === 'Virgo') {
        dignity = 'Debilitated';
        dignityHindi = 'नीच (Debilitated)';
      } else if (sign === 'Taurus' || sign === 'Libra') {
        dignity = 'Own';
        dignityHindi = 'स्वराशि (Own Sign)';
      }
    } else if (p.name === 'Saturn') {
      if (sign === 'Libra') {
        dignity = 'Exalted';
        dignityHindi = 'उच्च (Exalted)';
      } else if (sign === 'Aries') {
        dignity = 'Debilitated';
        dignityHindi = 'नीच (Debilitated)';
      } else if (sign === 'Capricorn' || sign === 'Aquarius') {
        dignity = 'Own';
        dignityHindi = 'स्वराशि (Own Sign)';
      }
    } else if (p.name === 'Mercury') {
      if (sign === 'Virgo') {
        dignity = 'Exalted';
        dignityHindi = 'उच्च (Exalted)';
      } else if (sign === 'Pisces') {
        dignity = 'Debilitated';
        dignityHindi = 'नीच (Debilitated)';
      } else if (sign === 'Gemini') {
        dignity = 'Own';
        dignityHindi = 'स्वराशि (Own Sign)';
      }
    }

    return {
      name: p.name,
      hindiName: PLANETS_HINDI[p.name],
      sign,
      signHindi: ZODIAC_HINDI[sign],
      signNumber: signIdx + 1,
      house,
      degree: degInSign,
      formattedDegree: `${degInt}° ${minInt.toString().padStart(2, '0')}'`,
      nakshatra: nakshatra.name,
      nakshatraHindi: nakshatra.hindi,
      pada,
      isRetrograde: p.isRetro,
      dignity,
      dignityHindi,
    };
  });

  return { planets, ascendantDegree: nirayanaAsc % 30, ascendantSign };
}

// Generate Full 12 Houses info
export function buildHouses(planets: PlanetInfo[], ascendantSign: ZodiacSign): HouseInfo[] {
  const ascIndex = ZODIAC_SIGNS.indexOf(ascendantSign);
  const houseSignifications = [
    { en: 'Self, Physical Body, Vitality & Personality', hi: 'तनु भाव: व्यक्तित्व, स्वास्थ्य, जीवन शक्ति' },
    { en: 'Wealth, Family, Speech & Accumulated Assets', hi: 'धन भाव: संपत्ति, परिवार, वाणी' },
    { en: 'Courage, Siblings, Communication & Short Journeys', hi: 'सहज भाव: पराक्रम, भाई-बहन, संचार' },
    { en: 'Mother, Home, Happiness, Real Estate & Vehicles', hi: 'सुख भाव: माता, गृह, वाहन, मानसिक शांति' },
    { en: 'Children, Intelligence, Education, Creativity & Romance', hi: 'संतान भाव: बुद्धि, विद्या, संतान, प्रेम' },
    { en: 'Health, Enemies, Debts, Daily Work & Competition', hi: 'रिपु भाव: रोग, ऋण, शत्रु, प्रतियोगिता' },
    { en: 'Spouse, Marriage, Business Partnerships & Public Life', hi: 'जाया भाव: जीवनसाथी, विवाह, व्यापारिक साझेदारी' },
    { en: 'Longevity, Transformation, Occult & Sudden Events', hi: 'आयु भाव: दीर्घायु, गुप्त विद्या, अप्रत्याशित घटनाएं' },
    { en: 'Dharma, Fortune, Higher Wisdom, Father & Pilgrimage', hi: 'भाग्य भाव: धर्म, भाग्य, उच्च शिक्षा, पिता' },
    { en: 'Career, Profession, Status, Fame & Karma', hi: 'कर्म भाव: आजीविका, पद-प्रतिष्ठा, मान-सम्मान' },
    { en: 'Gains, Income, Network Circle, Desires & Elder Siblings', hi: 'लाभ भाव: आय, मित्र, मनोकामना पूर्ति' },
    { en: 'Expenses, Foreign Travel, Spirituality & Moksha', hi: 'व्यय भाव: मोक्ष, विदेश यात्रा, खर्च, दान' },
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const signNumber = ((ascIndex + i) % 12) + 1;
    const sign = ZODIAC_SIGNS[signNumber - 1];
    const housePlanets = planets.filter((p) => p.house === houseNumber && p.name !== 'Ascendant');

    return {
      houseNumber,
      signNumber,
      sign,
      signHindi: ZODIAC_HINDI[sign],
      planets: housePlanets,
      significations: houseSignifications[i].en,
      significationsHindi: houseSignifications[i].hi,
    };
  });
}

// Vimshottari Dasha calculation (120-year cycle with dynamic starting balance)
export function calculateDashaTimeline(birthDateStr: string, moonPlanet: PlanetInfo): DashaPeriod[] {
  const { year, month, day } = parseFlexibleDate(birthDateStr);
  const birthDateObj = new Date(Date.UTC(year, month - 1, day));

  const nakshatraIndex = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === moonPlanet.nakshatra));
  const nakshatra = NAKSHATRAS[nakshatraIndex >= 0 ? nakshatraIndex : 0];
  const startLord = (nakshatra.lord as VedicPlanet) || 'Ketu';

  const nakSpan = 360 / 27; // 13.333333°
  const moonSignIdx = Math.max(0, ZODIAC_SIGNS.indexOf(moonPlanet.sign));
  const fullMoonLon = moonSignIdx * 30 + (moonPlanet.degree || 0);
  const elapsedInNak = fullMoonLon % nakSpan;
  const remainingFraction = Math.max(0.01, Math.min(0.99, 1 - elapsedInNak / nakSpan));

  const startIndex = DASHA_SEQUENCE.indexOf(startLord);
  const now = new Date();

  const formatDate = (d: Date): string => {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy}`;
  };

  const addYears = (startDate: Date, years: number): Date => {
    const daysToAdd = Math.round(years * 365.2425);
    return new Date(startDate.getTime() + daysToAdd * 86400000);
  };

  const periods: DashaPeriod[] = [];
  let currentStart = new Date(birthDateObj.getTime());

  // First Dasha (Dasha Balance at Birth)
  const firstSpan = DASHA_YEARS[startLord] * remainingFraction;
  let currentEnd = addYears(currentStart, firstSpan);
  let isCurrent = now >= currentStart && now < currentEnd;

  periods.push({
    planet: startLord,
    hindiName: PLANETS_HINDI[startLord],
    startDate: formatDate(currentStart),
    endDate: formatDate(currentEnd),
    durationYears: Number(firstSpan.toFixed(1)),
    current: isCurrent,
  });

  currentStart = currentEnd;

  for (let i = 1; i < 9; i++) {
    const planet = DASHA_SEQUENCE[(startIndex + i) % 9];
    const span = DASHA_YEARS[planet];
    currentEnd = addYears(currentStart, span);

    isCurrent = now >= currentStart && now < currentEnd;

    periods.push({
      planet,
      hindiName: PLANETS_HINDI[planet],
      startDate: formatDate(currentStart),
      endDate: formatDate(currentEnd),
      durationYears: span,
      current: isCurrent,
    });

    currentStart = currentEnd;
  }

  if (!periods.some((p) => p.current)) {
    const fallback = periods.find((p) => {
      const parts = p.endDate.split('-').map(Number);
      const endD = new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]));
      return now <= endD;
    }) || periods[periods.length - 1];
    if (fallback) fallback.current = true;
  }

  return periods;
}

// Dosha Analyzer (Manglik, Kalsarp, Sade Sati)
export function analyzeDoshas(planets: PlanetInfo[], moonSign: ZodiacSign): DoshaReport {
  const mars = planets.find((p) => p.name === 'Mars');
  const rahu = planets.find((p) => p.name === 'Rahu');
  const ketu = planets.find((p) => p.name === 'Ketu');

  // Manglik houses: 1, 4, 7, 8, 12
  const manglikHouses = [1, 4, 7, 8, 12];
  const isManglik = mars ? manglikHouses.includes(mars.house) : false;

  let manglikDescription = 'No Manglik Dosha detected. Normal marital compatibility.';
  let manglikDescriptionHindi = 'कुंडली में मांगलिक दोष नहीं है। दांपत्य जीवन सामान्य व शुभ रहेगा।';

  if (isManglik && mars) {
    manglikDescription = `Mars is placed in House ${mars.house} (${mars.sign}). Manglik influence indicated. Chanting Hanuman Chalisa and matching with a compatible partner is beneficial.`;
    manglikDescriptionHindi = `मंगल ग्रह ${mars.house}वें भाव (${mars.signHindi}) में स्थित है। यह मांगलिक योग दर्शाता है। हनुमान चालीसा का पाठ तथा मंगल शांति उपाय लाभकारी रहते हैं।`;
  }

  // Kalsarp Dosha (all other 7 planets placed on one side of Rahu-Ketu axis)
  let isKalsarp = false;
  let kalsarpType = 'None';
  let kalsarpDescription = 'No Kalsarpa Yoga detected in the chart.';
  let kalsarpDescriptionHindi = 'कुंडली में कालसर्प दोष नहीं है।';

  if (rahu && ketu) {
    const otherPlanets = planets.filter((p) => p.name !== 'Rahu' && p.name !== 'Ketu' && p.name !== 'Ascendant');
    const rH = rahu.house;
    const kH = ketu.house;
    const between1 = otherPlanets.every((p) => {
      const h = p.house;
      if (rH < kH) return h >= rH && h <= kH;
      return h >= rH || h <= kH;
    });

    if (between1) {
      isKalsarp = true;
      kalsarpType = rH === 1 ? 'Anant Kalsarp' : rH === 2 ? 'Kulik Kalsarp' : 'Vedic Kalsarp';
      kalsarpDescription = `${kalsarpType} detected with Rahu in House ${rH}. Chanting Maha Mrityunjaya Mantra and offering Milk to Shivling brings peace.`;
      kalsarpDescriptionHindi = `कुंडली में ${kalsarpType} योग बन रहा है (राहु ${rH}वें भाव में)। भगवान शिव की पूजा और महामृत्युंजय मंत्र का जप विशेष फलदायी है।`;
    }
  }

  // Sade Sati: Saturn in 12th, 1st, or 2nd from Natal Moon (Transit Saturn in Aquarius/Pisces)
  const currentTransitSaturnSign: ZodiacSign = 'Aquarius';
  const moonIndex = ZODIAC_SIGNS.indexOf(moonSign);
  const saturnIndex = ZODIAC_SIGNS.indexOf(currentTransitSaturnSign);
  const diff = (saturnIndex - moonIndex + 12) % 12;

  let isSadeSati = false;
  let sadeSatiPhase = 'None';
  let sadeSatiDescription = 'You are currently not under Saturn Sade Sati influence.';
  let sadeSatiDescriptionHindi = 'वर्तमान में आप पर शनि की साढ़ेसाती का प्रभाव नहीं है।';

  if (diff === 11) {
    isSadeSati = true;
    sadeSatiPhase = '1st Phase (Rising / उदय)';
    sadeSatiDescription = 'Saturn is transiting in the 12th house from natal Moon. Focus on mental calmness, steady planning, and disciplined finances.';
    sadeSatiDescriptionHindi = 'शनि जन्म चंद्र से 12वें भाव में गोचर कर रहे हैं (प्रथम चरण)। संयम, नियमित दान और शनि चालीसा से लाभ होगा।';
  } else if (diff === 0) {
    isSadeSati = true;
    sadeSatiPhase = '2nd Phase (Peak / शिखर)';
    sadeSatiDescription = 'Saturn is transiting over your natal Moon (Core Peak Phase). Hard work yields lasting success, avoid hasty decisions.';
    sadeSatiDescriptionHindi = 'शनि जन्म चंद्र के ऊपर गोचर कर रहे हैं (मध्य / मुख्य चरण)। निष्ठापूर्वक कर्म और शनिवार को दीप दान सर्वोत्तम रहता है।';
  } else if (diff === 1) {
    isSadeSati = true;
    sadeSatiPhase = '3rd Phase (Setting / अस्त)';
    sadeSatiDescription = 'Saturn is transiting the 2nd house from natal Moon (Concluding Phase). Relief from hurdles and gradual prosperity.';
    sadeSatiDescriptionHindi = 'शनि जन्म चंद्र से दूसरे भाव में हैं (अंतिम चरण)। धीरे-धीरे कार्यों में गति आएगी और लाभ प्राप्त होगा।';
  }

  return {
    isManglik,
    manglikPercentage: isManglik ? 75 : 0,
    manglikDescription,
    manglikDescriptionHindi,
    isKalsarp,
    kalsarpType,
    kalsarpDescription,
    kalsarpDescriptionHindi,
    isSadeSati,
    sadeSatiPhase,
    sadeSatiDescription,
    sadeSatiDescriptionHindi,
  };
}

// Sign Lordship Mapping in Vedic Astrology
export const SIGN_LORDS: Record<ZodiacSign, string> = {
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

export const PLANET_HINDI_NAMES: Record<string, string> = {
  Sun: 'सूर्य (Sun)',
  Moon: 'चन्द्र (Moon)',
  Mars: 'मंगल (Mars)',
  Mercury: 'बुध (Mercury)',
  Jupiter: 'गुरु (Jupiter)',
  Venus: 'शुक्र (Venus)',
  Saturn: 'शनि (Saturn)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)',
};

// Comprehensive Classical Vedic Yogas Detection Engine (BPHS & Jataka Parijata)
export function calculateAuspiciousYogas(
  planets: PlanetInfo[],
  houses: HouseInfo[],
  ascendantSign: ZodiacSign
): AuspiciousYoga[] {
  const yogas: AuspiciousYoga[] = [];

  const getPlanet = (name: string): PlanetInfo =>
    planets.find((p) => p.name === name) || planets[0];

  const sun = getPlanet('Sun');
  const moon = getPlanet('Moon');
  const mars = getPlanet('Mars');
  const mercury = getPlanet('Mercury');
  const jupiter = getPlanet('Jupiter');
  const venus = getPlanet('Venus');
  const saturn = getPlanet('Saturn');

  const ascIndex = ZODIAC_SIGNS.indexOf(ascendantSign);
  const getHouseLord = (h: number): string => {
    const signIdx = (ascIndex + (h - 1)) % 12;
    return SIGN_LORDS[ZODIAC_SIGNS[signIdx]];
  };

  const lord1 = getPlanet(getHouseLord(1));
  const lord2 = getPlanet(getHouseLord(2));
  const lord4 = getPlanet(getHouseLord(4));
  const lord5 = getPlanet(getHouseLord(5));
  const lord6 = getPlanet(getHouseLord(6));
  const lord7 = getPlanet(getHouseLord(7));
  const lord8 = getPlanet(getHouseLord(8));
  const lord9 = getPlanet(getHouseLord(9));
  const lord10 = getPlanet(getHouseLord(10));
  const lord11 = getPlanet(getHouseLord(11));
  const lord12 = getPlanet(getHouseLord(12));

  // 1. PANCHA MAHAPURUSHA YOGAS
  // ----------------------------------------------------
  // Hamsa Yoga (Jupiter in Kendra & Own/Exalted)
  if ([1, 4, 7, 10].includes(jupiter.house) && (jupiter.dignity === 'Exalted' || jupiter.dignity === 'Own')) {
    yogas.push({
      id: 'hamsa_yoga',
      name: 'Hamsa Mahapurusha Yoga',
      nameHindi: 'हंस महापुरुष योग',
      category: 'mahapurusha',
      categoryLabel: 'Pancha Mahapurusha Yoga',
      categoryLabelHindi: 'पंच महापुरुष योग (सर्वश्रेष्ठ)',
      planetsInvolved: ['Jupiter'],
      planetsInvolvedHindi: ['देवगुरु बृहस्पति'],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (सर्वश्रेष्ठ)',
      formation: `Jupiter is strongly placed in Kendra House ${jupiter.house} in its ${jupiter.dignity === 'Own' ? 'Own Sign' : 'Exalted Sign'} (${jupiter.sign} ${jupiter.formattedDegree}).`,
      formationHindi: `देवगुरु बृहस्पति कुंडली के केंद्र भाव (भाव ${jupiter.house}) में अपनी ${jupiter.dignity === 'Own' ? 'स्वराशि' : 'उच्च राशि'} (${ZODIAC_HINDI[jupiter.sign]} ${jupiter.formattedDegree}) में विराजमान होकर परम हंस योग का निर्माण कर रहे हैं।`,
      description: 'One of the five celestial royal combinations described by Sage Parashara in Brihat Parashara Hora Shastra, formed when divine preceptor Jupiter occupies a cardinal quadrant (Kendra) in exalted or own sign.',
      descriptionHindi: 'महर्षि पराशर द्वारा वर्णित पंच महापुरुष योगों में हंस योग को सबसे पवित्र और श्रेष्ठ माना गया है। यह योग जब बृहस्पति केंद्र में उच्च या स्वग्रही होते हैं तब बनता है।',
      impact: 'Confers sublime wisdom, unblemished moral character, noble public standing, spiritual enlightenment, scholarly honor, righteous wealth, and long-lasting societal reverence.',
      impactHindi: 'जातक को प्रखर बुद्धि, उच्च नैतिक आचरण, समाज में पूज्यनीय स्थान, आध्यात्मिक तेज, प्रशासनिक प्रतिष्ठा, अकूत ज्ञान व धार्मिक कार्यों से निरंतर यश व धन की प्राप्ति होती है।'
    });
  }

  // Ruchaka Yoga (Mars in Kendra & Own/Exalted)
  if ([1, 4, 7, 10].includes(mars.house) && (mars.dignity === 'Exalted' || mars.dignity === 'Own')) {
    yogas.push({
      id: 'ruchaka_yoga',
      name: 'Ruchaka Mahapurusha Yoga',
      nameHindi: 'रुचक महापुरुष योग',
      category: 'mahapurusha',
      categoryLabel: 'Pancha Mahapurusha Yoga',
      categoryLabelHindi: 'पंच महापुरुष योग',
      planetsInvolved: ['Mars'],
      planetsInvolvedHindi: ['मंगल देव'],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (सेनापति योग)',
      formation: `Mars is placed in Kendra House ${mars.house} in ${mars.sign} (${mars.dignity === 'Own' ? 'Own Sign' : 'Exalted'}).`,
      formationHindi: `मंगल देव केंद्र भाव (भाव ${mars.house}) में अपनी ${mars.dignity === 'Own' ? 'स्वराशि' : 'उच्च राशि'} (${ZODIAC_HINDI[mars.sign]}) में स्थित हैं।`,
      description: 'Formed by an exalted or own-sign Mars situated in an angular house, granting martial vigor and supreme physical capability.',
      descriptionHindi: 'मंगल के केंद्र में स्वग्रही या उच्च होने पर रुचक योग बनता है जो जातक को अजेय साहस और पराक्रम प्रदान करता है।',
      impact: 'Bestows fearless leadership, executive command, athletic vitality, victory over all competitors, massive land/property gains, and commanding authority in government or enterprise.',
      impactHindi: 'जातक को निर्भीक नेतृत्व, असीम पराक्रम, भूमि व अचल संपत्ति का भारी लाभ, प्रशासनिक शक्ति और विरोधियों पर सहज विजय दिलाता है।'
    });
  }

  // Bhadra Yoga (Mercury in Kendra & Own/Exalted)
  if ([1, 4, 7, 10].includes(mercury.house) && (mercury.dignity === 'Exalted' || mercury.dignity === 'Own')) {
    yogas.push({
      id: 'bhadra_yoga',
      name: 'Bhadra Mahapurusha Yoga',
      nameHindi: 'भद्र महापुरुष योग',
      category: 'mahapurusha',
      categoryLabel: 'Pancha Mahapurusha Yoga',
      categoryLabelHindi: 'पंच महापुरुष योग',
      planetsInvolved: ['Mercury'],
      planetsInvolvedHindi: ['बुध देव'],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (बुद्धि सम्राट)',
      formation: `Mercury is seated in Kendra House ${mercury.house} in ${mercury.sign}.`,
      formationHindi: `बुध देव केंद्र (भाव ${mercury.house}) में अपनी स्वराशि/उच्च राशि (${ZODIAC_HINDI[mercury.sign]}) में स्थित हैं।`,
      description: 'Occurs when Mercury occupies cardinal houses in its own or exalted sign, awakening consummate intellectual mastery.',
      descriptionHindi: 'बुध ग्रह के केंद्र में स्वराशि या उच्च राशि में बैठने से भद्र महापुरुष योग बनता है।',
      impact: 'Grants extraordinary memory, supreme eloquence, mastery in commerce, mathematics, literature, diplomacy, and longevity with intellectual distinction.',
      impactHindi: 'जातक को विलक्षण स्मरण शक्ति, सम्मोहक वाणी, व्यापार-वाणिज्य में महारत, लेखन, अनुसंधान और कूटनीति में अंतरराष्ट्रीय सफलता प्रदान करता है।'
    });
  }

  // Malavya Yoga (Venus in Kendra & Own/Exalted)
  if ([1, 4, 7, 10].includes(venus.house) && (venus.dignity === 'Exalted' || venus.dignity === 'Own')) {
    yogas.push({
      id: 'malavya_yoga',
      name: 'Malavya Mahapurusha Yoga',
      nameHindi: 'मालव्य महापुरुष योग',
      category: 'mahapurusha',
      categoryLabel: 'Pancha Mahapurusha Yoga',
      categoryLabelHindi: 'पंच महापुरुष योग',
      planetsInvolved: ['Venus'],
      planetsInvolvedHindi: ['शुक्र देव'],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (सौंदर्य व वैभव)',
      formation: `Venus is in Kendra House ${venus.house} in ${venus.sign} (${venus.dignity === 'Own' ? 'Own' : 'Exalted'}).`,
      formationHindi: `शुक्र देव केंद्र भाव (भाव ${venus.house}) में ${ZODIAC_HINDI[venus.sign]} में स्थित हैं।`,
      description: 'Venus in Kendra in its own or exalted sign produces the opulent Malavya Mahapurusha Yoga.',
      descriptionHindi: 'शुक्र के केंद्र में स्वग्रही या उच्च होने पर मालव्य योग बनता है जो ऐश्वर्य और कलात्मक प्रतिभा का प्रतीक है।',
      impact: 'Brings immense material luxury, conveyances, artistic refinement, magnetic personal charisma, marital bliss, and prosperity in hospitality, arts, or entertainment.',
      impactHindi: 'जातक को विलासिता, वाहन सुख, कलात्मक दृष्टि, आकर्षक व्यक्तित्व, दांपत्य सुख और ऐश्वर्यपूर्ण जीवनशैली प्राप्त होती है।'
    });
  }

  // Sasa Yoga (Saturn in Kendra & Own/Exalted)
  if ([1, 4, 7, 10].includes(saturn.house) && (saturn.dignity === 'Exalted' || saturn.dignity === 'Own')) {
    yogas.push({
      id: 'sasa_yoga',
      name: 'Sasa Mahapurusha Yoga',
      nameHindi: 'शश महापुरुष योग',
      category: 'mahapurusha',
      categoryLabel: 'Pancha Mahapurusha Yoga',
      categoryLabelHindi: 'पंच महापुरुष योग',
      planetsInvolved: ['Saturn'],
      planetsInvolvedHindi: ['शनि देव'],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (जननायक योग)',
      formation: `Saturn is established in Kendra House ${saturn.house} in ${saturn.sign}.`,
      formationHindi: `शनि देव केंद्र भाव (भाव ${saturn.house}) में स्वराशि/उच्च राशि (${ZODIAC_HINDI[saturn.sign]}) में विराजमान हैं।`,
      description: 'Saturn in Kendra in Capricorn, Aquarius, or Libra forms Sasa Yoga, creating masters of discipline and grassroots authority.',
      descriptionHindi: 'शनि देव के केंद्र में मकर, कुंभ या तुला राशि में स्थित होने से शश योग का निर्माण होता है।',
      impact: 'Confers monumental patience, commanding authority over large organizations or public masses, political ascendancy, and permanent historical achievements.',
      impactHindi: 'जातक को अद्भुत धैर्य, जनता व जनसमूह पर गहरा प्रभाव, उच्च प्रशासनिक/राजनीतिक पद और दीर्घकालिक स्थायी संपत्तियों का स्वामी बनाता है।'
    });
  }

  // 2. GAJAKESARI YOGA
  // ----------------------------------------------------
  const jupMoonKendra = [0, 3, 6, 9].includes(Math.abs(jupiter.house - moon.house));
  if (jupMoonKendra) {
    const isJupStrong = jupiter.dignity === 'Own' || jupiter.dignity === 'Exalted';
    yogas.push({
      id: 'gaja_kesari_yoga',
      name: 'Gaja Kesari Maha Raj Yoga',
      nameHindi: 'गजकेसरी महा राजयोग',
      category: 'raj_yoga',
      categoryLabel: 'Imperial Raj Yoga',
      categoryLabelHindi: 'शाही राजयोग (गजकेसरी)',
      planetsInvolved: ['Jupiter', 'Moon'],
      planetsInvolvedHindi: ['देवगुरु बृहस्पति', 'चन्द्र देव'],
      strength: isJupStrong ? 'Exceptional' : 'Strong',
      strengthHindi: isJupStrong ? 'अत्यंत प्रबल (गजकेसरी)' : 'प्रबल व शुभ',
      formation: `Jupiter (House ${jupiter.house}) is in mutual Kendra aspect to Moon (House ${moon.house}, ${moon.sign}).`,
      formationHindi: `देवगुरु बृहस्पति (भाव ${jupiter.house}) और चंद्र देव (भाव ${moon.house}, ${ZODIAC_HINDI[moon.sign]}) एक-दूसरे से केंद्र भाव में स्थित होकर गजकेसरी योग निर्मित कर रहे हैं।`,
      description: 'The elephant (Gaja - wisdom, nobility) and the lion (Kesari - courage, majesty) unite when Jupiter is in Kendra from Moon, as declared by Varahamihira.',
      descriptionHindi: 'वराहमिहिर के अनुसार चंद्रमा से केंद्र में गुरु के होने पर हाथी जैसी गंभीरता-ज्ञान (गज) और सिंह जैसा पराक्रम-तेज (केसरी) मिलकर गजकेसरी राजयोग बनाते हैं।',
      impact: 'Bestows illustrious reputation, natural commanding presence, high academic and governmental accolades, defeat of adversaries, prosperity, and enduring lineage.',
      impactHindi: 'जातक अत्यंत तेजस्वी, प्रतिष्ठित, उच्च विद्वान, शासकीय सम्मान प्राप्त करने वाला और कुलदीपक होता है जिसकी ख्याति दूर-दूर तक फैलती है।'
    });
  }

  // 3. BUDHADITYA YOGA
  // ----------------------------------------------------
  if (sun.house === mercury.house) {
    const houseNum = sun.house;
    yogas.push({
      id: 'budhaditya_yoga',
      name: 'Budhaditya Yoga',
      nameHindi: 'बुधादित्य राजयोग',
      category: 'gyana_yoga',
      categoryLabel: 'Wisdom & Career Yoga',
      categoryLabelHindi: 'बुद्धि व प्रतिभा राजयोग',
      planetsInvolved: ['Sun', 'Mercury'],
      planetsInvolvedHindi: ['सूर्य देव', 'बुध देव'],
      strength: 'Strong',
      strengthHindi: 'प्रबल व शुभ',
      formation: `Sun and Mercury are united in House ${houseNum} (${sun.sign}).`,
      formationHindi: `सूर्य देव और बुध देव दोनों एक साथ कुंडली के भाव ${houseNum} (${ZODIAC_HINDI[sun.sign]}) में युति कर रहे हैं।`,
      description: 'Conjunction of the royal Sun (soul, authority) and Mercury (intellect, logic) produces the celebrated Budhaditya Yoga.',
      descriptionHindi: 'आत्मकारक सूर्य और बुद्धिकारक बुध की युति से बुधादित्य योग बनता है जो जातक को कुशाग्र बुद्धि प्रदान करता है।',
      impact: 'Grants exceptional analytical intellect, quick mathematical comprehension, persuasive speech, administrative leadership, and academic or technological honors.',
      impactHindi: 'जातक को तीक्ष्ण बुद्धि, तार्किक विश्लेषण क्षमता, आकर्षक संभाषण कला, उच्च सरकारी या कॉर्पोरेट सम्मान और व्यापार में बड़ी सफलता दिलाता है।'
    });
  }

  // 4. CHANDRA-MANGAL DHANA YOGA
  // ----------------------------------------------------
  const isChandraMangal = moon.house === mars.house || [3, 6, 9].includes(Math.abs(moon.house - mars.house));
  if (isChandraMangal) {
    yogas.push({
      id: 'chandra_mangal_yoga',
      name: 'Chandra-Mangal Mahalakshmi Dhana Yoga',
      nameHindi: 'चन्द्र-मंगल महालक्ष्मी धन योग',
      category: 'dhana_yoga',
      categoryLabel: 'Wealth & Prosperity Yoga',
      categoryLabelHindi: 'महालक्ष्मी धन योग',
      planetsInvolved: ['Moon', 'Mars'],
      planetsInvolvedHindi: ['चन्द्र देव', 'मंगल देव'],
      strength: 'Strong',
      strengthHindi: 'प्रबल धन योग',
      formation: `Moon (House ${moon.house}) and Mars (House ${mars.house}) are in mutual aspect/conjunction.`,
      formationHindi: `चन्द्रमा (भाव ${moon.house}) और मंगल (भाव ${mars.house}) आपस में युति या परस्पर दृष्टि संबंध बना रहे हैं।`,
      description: 'When the watery Moon and fiery Mars form a harmonious connection, an extraordinary dynamic earning current is activated.',
      descriptionHindi: 'चन्द्रमा और मंगल का शुभ संबंध शास्त्रों में महालक्ष्मी धन योग कहलाता है, जो निरंतर आय और अचल संपत्ति का सृजन करता है।',
      impact: 'Ignites tremendous commercial enterprise, acumen in real estate, industry, commodities, financial investments, and abundant lifelong cash flow.',
      impactHindi: 'जातक को व्यापारिक सूझबूझ, भूमि-भवन, रियल एस्टेट, उद्योगों और वित्तीय निवेशों से निरंतर प्रचुर धन लाभ और आर्थिक स्वतंत्रता प्रदान करता है।'
    });
  }

  // 5. DHARMA-KARMADHIPATI RAJ YOGA (9th & 10th Lords)
  // ----------------------------------------------------
  const is910Conjoined = lord9.house === lord10.house;
  const is910Aspect = Math.abs(lord9.house - lord10.house) === 6;
  const is910Parivartana = (lord9.name === getHouseLord(10) && lord10.name === getHouseLord(9)) || (lord9.house === 10 && lord10.house === 9);
  if (is910Conjoined || is910Aspect || is910Parivartana) {
    yogas.push({
      id: 'dharma_karmadhipati_yoga',
      name: 'Dharma-Karmadhipati Maha Raj Yoga',
      nameHindi: 'धर्म-कर्माधिपति महा राजयोग',
      category: 'raj_yoga',
      categoryLabel: 'Supreme Vedic Raj Yoga',
      categoryLabelHindi: 'परम धर्म-कर्माधिपति राजयोग',
      planetsInvolved: [lord9.name, lord10.name],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord9.name] || lord9.name, PLANET_HINDI_NAMES[lord10.name] || lord10.name],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (सर्वोच्च पद)',
      formation: `9th Lord of Fortune (${lord9.name}) and 10th Lord of Career (${lord10.name}) are intimately connected via ${is910Conjoined ? 'conjunction' : is910Parivartana ? 'mutual house exchange (Parivartana)' : 'mutual 7th aspect'}.`,
      formationHindi: `भाग्य भाव (नवमेश: ${PLANET_HINDI_NAMES[lord9.name] || lord9.name}) और कर्म भाव (दशमेश: ${PLANET_HINDI_NAMES[lord10.name] || lord10.name}) आपस में परम राजयोग संबंध बना रहे हैं।`,
      description: 'The highest Raj Yoga in Brihat Parashara Hora Shastra, harmonizing Dharma (9th house of divine grace) with Karma (10th house of world action).',
      descriptionHindi: 'पाराशरीय ज्योतिष का सर्वोच्च राजयोग जो भाग्य (नवम भाव) और कर्म (दशम भाव) के स्वामियों के मिलन से उत्पन्न होता है।',
      impact: 'Propels the native to the pinnacle of professional career, constitutional or governmental high offices, unassailable public authority, and ethical prosperity.',
      impactHindi: 'जातक को करियर के सर्वोच्च शिखर, शासन-सत्ता में उच्च पद, निर्विवाद प्रतिष्ठा, मान-सम्मान और धर्मनिष्ठ समृद्धि का वरदान देता है।'
    });
  }

  // 6. SWAKSHETRA LAGNESHA RAJ YOGA (Lagnesha in 1st house / Kendra)
  // ----------------------------------------------------
  if (lord1.house === 1 && (lord1.dignity === 'Own' || lord1.dignity === 'Exalted')) {
    yogas.push({
      id: 'lagnesha_swakshetra_yoga',
      name: 'Akhanda Lagnesha Raj Yoga',
      nameHindi: 'अखण्ड लग्नेश राजयोग (स्वग्रही लग्न)',
      category: 'raj_yoga',
      categoryLabel: 'Foundational Raj Yoga',
      categoryLabelHindi: 'अखण्ड लग्नेश राजयोग',
      planetsInvolved: [lord1.name],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord1.name] || lord1.name],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (जीवन सुरक्षा कवच)',
      formation: `Ascendant Lord (${lord1.name}) is seated powerfully in House 1 (${lord1.sign} ${lord1.formattedDegree}) in its own domain.`,
      formationHindi: `लग्न के स्वामी (${PLANET_HINDI_NAMES[lord1.name] || lord1.name}) स्वयं अपने लग्न भाव (प्रथम भाव) में स्वराशि में विराजमान हैं।`,
      description: 'When the ruler of the first house sits in the ascendant itself in own or exalted sign, the foundational vitality and luck of the entire horoscope is magnified tenfold.',
      descriptionHindi: 'जब लग्नेश स्वयं लग्न में स्वराशि या उच्च होकर बैठते हैं तो पूरी कुंडली को एक अभेद्य सुरक्षा चक्र और प्रबल भाग्योदय की शक्ति प्राप्त होती है।',
      impact: 'Grants robust vitality, magnetic aura, commanding personality, long life, resilience against misfortunes, and natural elevation to leadership.',
      impactHindi: 'जातक को सुदृढ़ स्वास्थ्य, दीर्घायु, आकर्षक प्रभावशाली व्यक्तित्व, संकटों से स्वतः रक्षा और जीवन में स्वतः उच्च पदों पर पहुंचने की सहज क्षमता प्रदान करता है।'
    });
  }

  // 7. SWAKSHETRA DHANA / LABHA YOGA (2nd or 11th Lord in Own Sign)
  // ----------------------------------------------------
  if (lord2.house === 2 && (lord2.dignity === 'Own' || lord2.dignity === 'Exalted')) {
    yogas.push({
      id: 'swakshetra_dhana_yoga',
      name: 'Swakshetra Dhana Yoga (2nd House Lord in 2nd)',
      nameHindi: 'स्वक्षेत्री धन योग (द्वितीयेश स्वग्रही)',
      category: 'dhana_yoga',
      categoryLabel: 'Accumulated Wealth Yoga',
      categoryLabelHindi: 'अखंड संचित धन योग',
      planetsInvolved: [lord2.name],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord2.name] || lord2.name],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (धन समृद्धि)',
      formation: `2nd Lord of Wealth (${lord2.name}) is placed in its own 2nd House (${lord2.sign} ${lord2.formattedDegree}).`,
      formationHindi: `धन भाव (द्वितीय भाव) के स्वामी ${PLANET_HINDI_NAMES[lord2.name] || lord2.name} स्वयं अपने द्वितीय भाव में स्वराशि में विराजमान हैं।`,
      description: 'The 2nd house governs treasury, family legacy, and liquid assets. Its lord resting in its own house guarantees generational wealth accumulation.',
      descriptionHindi: 'द्वितीय भाव संचित धन, पैतृक संपत्ति और कोष का कारक है। द्वितीयेश के स्वग्रही होने से अखंड धन योग बनता है।',
      impact: 'Guarantees ever-growing financial reserves, royal speech, high family status, flourishing investments, and freedom from financial distress.',
      impactHindi: 'जातक के पास धन का निरंतर संचय रहता है, वाणी प्रभावशाली होती है, उत्तम कुल की प्रतिष्ठा और जीवन भर धन की कोई कमी नहीं रहती।'
    });
  }

  if (lord11.house === 11 && (lord11.dignity === 'Own' || lord11.dignity === 'Exalted')) {
    yogas.push({
      id: 'swakshetra_labha_yoga',
      name: 'Swakshetra Labha Yoga (11th House Lord in 11th)',
      nameHindi: 'स्वक्षेत्री लाभ योग (एकादशेश स्वग्रही)',
      category: 'dhana_yoga',
      categoryLabel: 'Income & Inflow Yoga',
      categoryLabelHindi: 'निरंतर महालाभ योग',
      planetsInvolved: [lord11.name],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord11.name] || lord11.name],
      strength: 'Strong',
      strengthHindi: 'प्रबल लाभ योग',
      formation: `11th Lord of Gains (${lord11.name}) is situated in its own 11th House (${lord11.sign}).`,
      formationHindi: `लाभ भाव (एकादश भाव) के स्वामी ${PLANET_HINDI_NAMES[lord11.name] || lord11.name} स्वयं एकादश भाव में स्वराशि में विराजमान हैं।`,
      description: 'The 11th house of gains (Labha Bhava) with its own lord ensures multiple continuous streams of revenue and fulfillment of desires.',
      descriptionHindi: 'एकादश भाव सभी मनोकामनाओं की पूर्ति और आय का भाव है। एकादशेश के स्वग्रही होने से जातक की सभी बड़ी इच्छाएं पूरी होती हैं।',
      impact: 'Provides multiple concurrent income sources, influential social networks, realization of big ambitions, and sustained profitability in ventures.',
      impactHindi: 'जातक को एक से अधिक आय स्रोतों से लाभ, बड़े मित्रों व समर्थकों का सहयोग और हर उद्यम में प्रचुर मुनाफा मिलता है।'
    });
  }

  // 8. KENDRA-TRIKONA RAJ YOGA
  // ----------------------------------------------------
  // Conjunction or mutual aspect between Kendra lords (1, 4, 7, 10) and Trikona lords (1, 5, 9)
  const kendraLords = [lord1.name, lord4.name, lord7.name, lord10.name];
  const trikonaLords = [lord1.name, lord5.name, lord9.name];
  let foundKT = false;
  for (const kName of kendraLords) {
    for (const tName of trikonaLords) {
      if (kName !== tName && !foundKT) {
        const kp = getPlanet(kName);
        const tp = getPlanet(tName);
        if (kp.house === tp.house) {
          foundKT = true;
          yogas.push({
            id: 'kendra_trikona_raj_yoga',
            name: 'Kendra-Trikona Raj Yoga',
            nameHindi: 'केंद्र-त्रिकोण राजयोग',
            category: 'raj_yoga',
            categoryLabel: 'Auspicious Vedic Raj Yoga',
            categoryLabelHindi: 'शुभ केंद्र-त्रिकोण राजयोग',
            planetsInvolved: [kName, tName],
            planetsInvolvedHindi: [PLANET_HINDI_NAMES[kName] || kName, PLANET_HINDI_NAMES[tName] || tName],
            strength: 'Strong',
            strengthHindi: 'प्रबल राजयोग',
            formation: `Kendra Lord (${kName}) and Trikona Lord (${tName}) are conjoined in House ${kp.house}.`,
            formationHindi: `केंद्र भाव के स्वामी (${PLANET_HINDI_NAMES[kName] || kName}) और त्रिकोण भाव के स्वामी (${PLANET_HINDI_NAMES[tName] || tName}) भाव ${kp.house} में एक साथ युति कर रहे हैं।`,
            description: 'Kendra represents Vishnu (effort, sustenance) and Trikona represents Lakshmi (grace, luck). Their conjunction creates pure royal auspiciousness.',
            descriptionHindi: 'केंद्र (विष्णु स्थान) और त्रिकोण (लक्ष्मी स्थान) के स्वामियों के मिलन से केंद्र-त्रिकोण राजयोग बनता है जो जीवन में निरंतर प्रगति देता है।',
            impact: 'Brings sudden breakthroughs, favorable circumstances, unearned divine blessings, social prominence, and lasting achievements.',
            impactHindi: 'जातक को अचानक नए अवसर, शासकीय सहयोग, भाग्य का निरंतर साथ, पारिवारिक सुख और जीवन में तेजी से पदोन्नति मिलती है।'
          });
        }
      }
    }
  }

  // 9. VIPREET RAJ YOGA (Harsha / Sarala / Vimala)
  // ----------------------------------------------------
  if ([6, 8, 12].includes(lord6.house)) {
    yogas.push({
      id: 'harsha_vipreet_yoga',
      name: 'Harsha Vipreet Raj Yoga',
      nameHindi: 'हर्ष विपरीत राजयोग',
      category: 'special_yoga',
      categoryLabel: 'Vipreet Raj Yoga',
      categoryLabelHindi: 'विपरीत राजयोग (हर्ष योग)',
      planetsInvolved: [lord6.name],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord6.name] || lord6.name],
      strength: 'Strong',
      strengthHindi: 'विजय व आरोग्य प्रदाता',
      formation: `6th Lord of Obstacles (${lord6.name}) is confined in Trika House ${lord6.house}.`,
      formationHindi: `षष्ठेश (${PLANET_HINDI_NAMES[lord6.name] || lord6.name}) त्रिक भाव (भाव ${lord6.house}) में स्थित होकर हर्ष विपरीत राजयोग बना रहे हैं।`,
      description: 'When the lord of enemies/debts/diseases is placed in a dusthana (6/8/12), the negative forces neutralize each other, turning adversity into triumph.',
      descriptionHindi: 'षष्ठ भाव के स्वामी का त्रिक भाव में स्थित होना शत्रुओं और बाधाओं का नाश कर जातक को अप्रत्याशित विजय दिलाता है।',
      impact: 'Confers unassailable immunity, triumph over litigation and competitors, happiness (Harsha), and turning crises into personal growth.',
      impactHindi: 'जातक शत्रुओं और विरोधियों पर हमेशा भारी पड़ता है, मुकदमों में जीत होती है, उत्तम स्वास्थ्य और विपरीत परिस्थितियों में भी बड़ी सफलता मिलती है।'
    });
  }

  if ([6, 8, 12].includes(lord8.house)) {
    yogas.push({
      id: 'sarala_vipreet_yoga',
      name: 'Sarala Vipreet Raj Yoga',
      nameHindi: 'सरल विपरीत राजयोग',
      category: 'special_yoga',
      categoryLabel: 'Vipreet Raj Yoga',
      categoryLabelHindi: 'विपरीत राजयोग (सरल योग)',
      planetsInvolved: [lord8.name],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord8.name] || lord8.name],
      strength: 'Strong',
      strengthHindi: 'दीर्घायु व संकट मोचक',
      formation: `8th Lord of Transformation (${lord8.name}) is placed in Trika House ${lord8.house}.`,
      formationHindi: `अष्टमेश (${PLANET_HINDI_NAMES[lord8.name] || lord8.name}) त्रिक भाव (भाव ${lord8.house}) में स्थित होकर सरल योग निर्मित कर रहे हैं।`,
      description: 'The 8th lord in 6th, 8th, or 12th house neutralizes existential fears and bestows longevity, resilience, and unearned windfalls.',
      descriptionHindi: 'अष्टम भाव के स्वामी का त्रिक भाव में होना संकटों से सहज मुक्ति, दीर्घायु और आकस्मिक लाभ का सरल योग बनाता है।',
      impact: 'Grants long life, courage under pressure, deep intuitive insights, immunity from severe scandals, and steady resolution of obstacles.',
      impactHindi: 'जातक दीर्घायु, अत्यंत साहसी, गूढ़ विद्याओं का ज्ञाता, संकटों से आसानी से पार पाने वाला और सम्मानित जीवन जीने वाला होता है।'
    });
  }

  if ([6, 8, 12].includes(lord12.house)) {
    yogas.push({
      id: 'vimala_vipreet_yoga',
      name: 'Vimala Vipreet Raj Yoga',
      nameHindi: 'विमल विपरीत राजयोग',
      category: 'special_yoga',
      categoryLabel: 'Vipreet Raj Yoga',
      categoryLabelHindi: 'विपरीत राजयोग (विमल योग)',
      planetsInvolved: [lord12.name],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord12.name] || lord12.name],
      strength: 'Strong',
      strengthHindi: 'पवित्रता व व्यय नियंत्रण',
      formation: `12th Lord of Losses (${lord12.name}) is situated in Trika House ${lord12.house}.`,
      formationHindi: `द्वादशेश (${PLANET_HINDI_NAMES[lord12.name] || lord12.name}) त्रिक भाव (भाव ${lord12.house}) में स्थित होकर विमल योग निर्मित कर रहे हैं।`,
      description: 'The 12th lord placed in a dusthana controls wasteful expenditure, spiritualizes the mind, and purifies financial integrity.',
      descriptionHindi: 'द्वादशेश का त्रिक भाव में बैठना अनावश्यक खर्चों पर रोक लगाता है और जातक को सदाचारी व पवित्र (विमल) बनाता है।',
      impact: 'Protects from financial leaks, grants independence, noble expenditure on righteous causes, inner spiritual tranquility, and international travel gains.',
      impactHindi: 'जातक मितव्ययी, स्वतंत्र विचारों वाला, धार्मिक व परोपकारी कार्यों में व्यय करने वाला और विदेश संपर्कों से लाभ पाने वाला होता है।'
    });
  }

  // 10. SARASWATI YOGA (Wisdom, Learning, Arts)
  // ----------------------------------------------------
  const beneficLoci = [1, 2, 4, 5, 7, 9, 10];
  if (beneficLoci.includes(jupiter.house) && beneficLoci.includes(venus.house) && beneficLoci.includes(mercury.house)) {
    yogas.push({
      id: 'saraswati_yoga',
      name: 'Saraswati Maha Vidya Yoga',
      nameHindi: 'सरस्वती महा विद्या योग',
      category: 'gyana_yoga',
      categoryLabel: 'Wisdom & Knowledge Yoga',
      categoryLabelHindi: 'माँ सरस्वती ज्ञान योग',
      planetsInvolved: ['Jupiter', 'Venus', 'Mercury'],
      planetsInvolvedHindi: ['देवगुरु बृहस्पति', 'शुक्र देव', 'बुध देव'],
      strength: 'Exceptional',
      strengthHindi: 'अत्यंत प्रबल (विद्या सम्राट)',
      formation: `All three natural benefics—Jupiter (House ${jupiter.house}), Venus (House ${venus.house}), and Mercury (House ${mercury.house})—occupy auspicious Kendra/Trikona/2nd houses.`,
      formationHindi: `तीनों नैसर्गिक शुभ ग्रह—गुरु (भाव ${jupiter.house}), शुक्र (भाव ${venus.house}) और बुध (भाव ${mercury.house})—शुभ भावों में विराजमान हैं।`,
      description: 'Named after the Goddess of Learning, this yoga bestows supreme creative genius, scholarly mastery, and artistic perfection.',
      descriptionHindi: 'विद्या की देवी माँ सरस्वती के नाम पर बना यह योग जातक को समस्त शास्त्रों, कलाओं, साहित्य और संगीत में अद्वितीय निपुणता देता है।',
      impact: 'Endows mastery in writing, sciences, arts, speech, publication of acclaimed works, worldwide intellectual respect, and enduring scholarly legacy.',
      impactHindi: 'जातक उच्च कोटि का विद्वान, कुशल वक्ता, लेखक, कला प्रेमी और समाज में ज्ञान व बुद्धि के बल पर शीर्ष सम्मान प्राप्त करता है।'
    });
  }

  // 11. AMALA YOGA (Pure Benefic in 10th from Lagna or Moon)
  // ----------------------------------------------------
  const lagna10thHousePlanets = planets.filter((p) => p.house === 10);
  const isAmalaLagna = lagna10thHousePlanets.some((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.name));
  const moon10thHouseNum = ((moon.house + 9 - 1) % 12) + 1;
  const isAmalaMoon = planets.some((p) => p.house === moon10thHouseNum && ['Jupiter', 'Venus', 'Mercury'].includes(p.name));

  if (isAmalaLagna || isAmalaMoon) {
    yogas.push({
      id: 'amala_yoga',
      name: 'Amala Kirti Yoga',
      nameHindi: 'अमल कीर्ति योग',
      category: 'raj_yoga',
      categoryLabel: 'Fame & Reputation Yoga',
      categoryLabelHindi: 'अमल यश व कीर्ति योग',
      planetsInvolved: isAmalaLagna ? lagna10thHousePlanets.map((p) => p.name) : ['Jupiter/Venus/Mercury'],
      planetsInvolvedHindi: ['शुभ ग्रह (बृहस्पति/शुक्र/बुध)'],
      strength: 'Strong',
      strengthHindi: 'प्रबल व शुभ',
      formation: `Natural benefic occupies the 10th house of profession from ${isAmalaLagna ? 'Lagna' : 'Moon'}.`,
      formationHindi: `दशम कर्म भाव में नैसर्गिक शुभ ग्रह की उपस्थिति से निष्कलंक अमल कीर्ति योग बन रहा है।`,
      description: 'Amala signifies purity and spotless grace. Benefics in the 10th house ensure the career is marked by honesty, benevolence, and revered ethics.',
      descriptionHindi: 'अमल का अर्थ है निष्कलंक। दशम भाव में शुभ ग्रह होने से जातक का करियर अत्यंत स्वच्छ, परोपकारी और सम्मानित रहता है।',
      impact: 'Yields spotless public reputation, high executive office, humanitarian leadership, steady prosperity, and universal goodwill.',
      impactHindi: 'जातक को निष्कलंक ख्याति, समाज सेवा में बड़ा मान, उच्च पद पर रहते हुए जनता का असीम स्नेह और निष्ठावान जीवन का फल मिलता है।'
    });
  }

  // 12. VESI / VOSI / UBHAYACHARI YOGA (From Sun)
  // ----------------------------------------------------
  const house2FromSun = (sun.house % 12) + 1;
  const house12FromSun = ((sun.house + 10) % 12) + 1;
  const pIn2FromSun = planets.filter((p) => p.house === house2FromSun && !['Rahu', 'Ketu', 'Sun', 'Moon'].includes(p.name));
  const pIn12FromSun = planets.filter((p) => p.house === house12FromSun && !['Rahu', 'Ketu', 'Sun', 'Moon'].includes(p.name));

  if (pIn2FromSun.length > 0 && pIn12FromSun.length > 0) {
    yogas.push({
      id: 'ubhayachari_yoga',
      name: 'Ubhayachari Solar Raj Yoga',
      nameHindi: 'उभयचारी सूर्य राजयोग',
      category: 'raj_yoga',
      categoryLabel: 'Solar Splendor Yoga',
      categoryLabelHindi: 'सूर्य उभयचारी राजयोग',
      planetsInvolved: [...pIn2FromSun.map((p) => p.name), ...pIn12FromSun.map((p) => p.name)],
      planetsInvolvedHindi: [...pIn2FromSun.map((p) => PLANET_HINDI_NAMES[p.name] || p.name), ...pIn12FromSun.map((p) => PLANET_HINDI_NAMES[p.name] || p.name)],
      strength: 'Strong',
      strengthHindi: 'प्रबल सूर्य योग',
      formation: `Planets are stationed on both sides of Sun (House 2 from Sun: ${pIn2FromSun.map((p) => p.name).join(', ')} and House 12 from Sun: ${pIn12FromSun.map((p) => p.name).join(', ')}).`,
      formationHindi: `सूर्य देव के दोनों ओर (द्वितीय व द्वादश भाव में) ग्रहों की उपस्थिति से उभयचारी योग बन रहा है।`,
      description: 'Ubhayachari yoga is formed when planets surround the royal Sun from both flanks, providing equilibrium, charisma, and state protection.',
      descriptionHindi: 'सूर्य के दोनों तरफ शुभ व अनुकूल ग्रहों के होने से उभयचारी योग बनता है जो जातक को राजसी तेज और संतुलन प्रदान करता है।',
      impact: 'Grants regal eloquence, magnetic personal poise, support from government and superiors, high stamina, and comfortable lifestyle.',
      impactHindi: 'जातक राजा के समान प्रभावशाली, ओजस्वी वक्ता, सुखी, संपन्न और शासन-प्रशासन में उच्च स्तर के लोगों से प्रगाढ़ संबंध रखने वाला होता है।'
    });
  } else if (pIn2FromSun.length > 0) {
    yogas.push({
      id: 'vesi_yoga',
      name: 'Vesi Solar Yoga',
      nameHindi: 'वेसी सूर्य योग',
      category: 'special_yoga',
      categoryLabel: 'Solar Auspicious Yoga',
      categoryLabelHindi: 'वेसी योग',
      planetsInvolved: pIn2FromSun.map((p) => p.name),
      planetsInvolvedHindi: pIn2FromSun.map((p) => PLANET_HINDI_NAMES[p.name] || p.name),
      strength: 'Moderate',
      strengthHindi: 'सकारात्मक व शुभ',
      formation: `Planets (${pIn2FromSun.map((p) => p.name).join(', ')}) reside in the 2nd house from Sun.`,
      formationHindi: `सूर्य से द्वितीय भाव में ${pIn2FromSun.map((p) => PLANET_HINDI_NAMES[p.name] || p.name).join(', ')} स्थित हैं।`,
      description: 'Planets in the 2nd house from Sun impart distinct brilliance, wealth accumulation habits, and dignified conduct.',
      descriptionHindi: 'सूर्य से दूसरे भाव में ग्रहों की स्थिति से वेसी योग बनता है जो जातक को सत्यवादी और धनवान बनाता है।',
      impact: 'Promotes truthfulness, disciplined financial judgment, sound physical stamina, and dignified social standing.',
      impactHindi: 'जातक सत्यवक्ता, नीतिवान, कार्यकुशल और अपने श्रम से मान-प्रतिष्ठा व धन अर्जित करने वाला होता है।'
    });
  } else if (pIn12FromSun.length > 0) {
    yogas.push({
      id: 'vosi_yoga',
      name: 'Vosi Solar Yoga',
      nameHindi: 'वोसी सूर्य योग',
      category: 'special_yoga',
      categoryLabel: 'Solar Auspicious Yoga',
      categoryLabelHindi: 'वोसी योग',
      planetsInvolved: pIn12FromSun.map((p) => p.name),
      planetsInvolvedHindi: pIn12FromSun.map((p) => PLANET_HINDI_NAMES[p.name] || p.name),
      strength: 'Moderate',
      strengthHindi: 'सकारात्मक व शुभ',
      formation: `Planets (${pIn12FromSun.map((p) => p.name).join(', ')}) reside in the 12th house from Sun.`,
      formationHindi: `सूर्य से द्वादश भाव में ${pIn12FromSun.map((p) => PLANET_HINDI_NAMES[p.name] || p.name).join(', ')} स्थित हैं।`,
      description: 'Planets in the 12th house from Sun grant philanthropic nature, charitable inclinations, and spiritual depth.',
      descriptionHindi: 'सूर्य से बारहवें भाव में ग्रहों के बैठने से वोसी योग बनता है जो जातक को परोपकारी और उदार बनाता है।',
      impact: 'Bestows generous temperament, spiritual inclinations, skilled memory, and wide travel prospects.',
      impactHindi: 'जातक उदारमना, परोपकारी, उत्तम याददाश्त वाला और धार्मिक व गूढ़ विषयों में गहरी रुचि रखने वाला होता है।'
    });
  }

  // 13. SUNAPHA / ANAPHA / DURUDHARA YOGA (From Moon)
  // ----------------------------------------------------
  const house2FromMoon = (moon.house % 12) + 1;
  const house12FromMoon = ((moon.house + 10) % 12) + 1;
  const pIn2FromMoon = planets.filter((p) => p.house === house2FromMoon && !['Rahu', 'Ketu', 'Sun', 'Moon'].includes(p.name));
  const pIn12FromMoon = planets.filter((p) => p.house === house12FromMoon && !['Rahu', 'Ketu', 'Sun', 'Moon'].includes(p.name));

  if (pIn2FromMoon.length > 0 && pIn12FromMoon.length > 0) {
    yogas.push({
      id: 'durudhara_yoga',
      name: 'Durudhara Lunar Yoga',
      nameHindi: 'दुरुधरा चंद्र योग',
      category: 'special_yoga',
      categoryLabel: 'Lunar Abundance Yoga',
      categoryLabelHindi: 'दुरुधरा महायोग',
      planetsInvolved: [...pIn2FromMoon.map((p) => p.name), ...pIn12FromMoon.map((p) => p.name)],
      planetsInvolvedHindi: [...pIn2FromMoon.map((p) => PLANET_HINDI_NAMES[p.name] || p.name), ...pIn12FromMoon.map((p) => PLANET_HINDI_NAMES[p.name] || p.name)],
      strength: 'Strong',
      strengthHindi: 'प्रबल चंद्र योग',
      formation: `Planets flank Moon in both 2nd and 12th houses from Moon.`,
      formationHindi: `चंद्रमा के दोनों ओर (द्वितीय व द्वादश भाव में) अनुकूल ग्रह स्थित हैं।`,
      description: 'Durudhara yoga ensures emotional balance, generous abundance, and unshakeable prosperity.',
      descriptionHindi: 'चंद्रमा के दोनों ओर ग्रहों की उपस्थिति से दुरुधरा योग बनता है जो जातक को सुख-साधन और वाहन सुख देता है।',
      impact: 'Grants vehicles, real estate, affectionate family life, steady income flow, and widespread benevolence.',
      impactHindi: 'जातक सुख-साधनों से युक्त, उदार, दानवीर, वाहन सुख का उपभोग करने वाला और सुखी गृहस्थ जीवन जीने वाला होता है।'
    });
  } else if (pIn2FromMoon.length > 0) {
    yogas.push({
      id: 'sunapha_yoga',
      name: 'Sunapha Lunar Yoga',
      nameHindi: 'सुनफा चंद्र योग',
      category: 'special_yoga',
      categoryLabel: 'Lunar Auspicious Yoga',
      categoryLabelHindi: 'सुनफा योग',
      planetsInvolved: pIn2FromMoon.map((p) => p.name),
      planetsInvolvedHindi: pIn2FromMoon.map((p) => PLANET_HINDI_NAMES[p.name] || p.name),
      strength: 'Moderate',
      strengthHindi: 'सकारात्मक व शुभ',
      formation: `Planets (${pIn2FromMoon.map((p) => p.name).join(', ')}) in 2nd house from Moon.`,
      formationHindi: `चंद्रमा से द्वितीय भाव में ${pIn2FromMoon.map((p) => PLANET_HINDI_NAMES[p.name] || p.name).join(', ')} स्थित हैं।`,
      description: 'Sunapha yoga brings self-earned wealth, intellectual clarity, and good social rank.',
      descriptionHindi: 'चंद्रमा से दूसरे भाव में ग्रह होने से सुनफा योग बनता है जो स्वअर्जित धन का कारक है।',
      impact: 'Bestows self-made financial success, sharp intellect, and respectable position in society.',
      impactHindi: 'जातक अपने पराक्रम से धन कमाने वाला, बुद्धिमान, नीतिवान और समाज में प्रतिष्ठित होता है।'
    });
  } else if (pIn12FromMoon.length > 0) {
    yogas.push({
      id: 'anapha_yoga',
      name: 'Anapha Lunar Yoga',
      nameHindi: 'अनफा चंद्र योग',
      category: 'special_yoga',
      categoryLabel: 'Lunar Auspicious Yoga',
      categoryLabelHindi: 'अनफा योग',
      planetsInvolved: pIn12FromMoon.map((p) => p.name),
      planetsInvolvedHindi: pIn12FromMoon.map((p) => PLANET_HINDI_NAMES[p.name] || p.name),
      strength: 'Moderate',
      strengthHindi: 'सकारात्मक व शुभ',
      formation: `Planets (${pIn12FromMoon.map((p) => p.name).join(', ')}) in 12th house from Moon.`,
      formationHindi: `चंद्रमा से द्वादश भाव में ${pIn12FromMoon.map((p) => PLANET_HINDI_NAMES[p.name] || p.name).join(', ')} स्थित हैं।`,
      description: 'Anapha yoga creates a self-disciplined, healthy, and magnetic personality.',
      descriptionHindi: 'चंद्रमा से बारहवें भाव में ग्रह होने से अनफा योग बनता है जो निरोगी काया और आकर्षण देता है।',
      impact: 'Grants radiant health, self-control, refined demeanor, and peaceful mental equilibrium.',
      impactHindi: 'जातक सुंदर, निरोगी, शिष्ट आचरण वाला, इंद्रिय संयमी और मानसिक रूप से शांत रहने वाला होता है।'
    });
  }

  // 14. VASUMATI YOGA (Benefics in Upachaya 3, 6, 10, 11 from Lagna)
  // ----------------------------------------------------
  const upachayaHouses = [3, 6, 10, 11];
  const beneficsInUpachaya = [jupiter, venus, mercury].filter((p) => upachayaHouses.includes(p.house));
  if (beneficsInUpachaya.length >= 2) {
    yogas.push({
      id: 'vasumati_yoga',
      name: 'Vasumati Maha Dhana Yoga',
      nameHindi: 'वसुमती महा धन योग',
      category: 'dhana_yoga',
      categoryLabel: 'Prosperity & Enterprise Yoga',
      categoryLabelHindi: 'वसुमती अखंड धन योग',
      planetsInvolved: beneficsInUpachaya.map((p) => p.name),
      planetsInvolvedHindi: beneficsInUpachaya.map((p) => PLANET_HINDI_NAMES[p.name] || p.name),
      strength: 'Strong',
      strengthHindi: 'प्रबल धन योग',
      formation: `Multiple natural benefics (${beneficsInUpachaya.map((p) => `${p.name} in H${p.house}`).join(', ')}) are located in Upachaya growth houses.`,
      formationHindi: `शुभ ग्रह (${beneficsInUpachaya.map((p) => `${PLANET_HINDI_NAMES[p.name] || p.name} भाव ${p.house}`).join(', ')}) उपचय भावों में स्थित हैं।`,
      description: 'Vasumati signifies fertile earth. Benefics in Upachaya houses ensure that with passing years, prosperity multiplies exponentially.',
      descriptionHindi: 'वसुमती का अर्थ है समृद्ध पृथ्वी। उपचय भावों (3, 6, 10, 11) में शुभ ग्रहों के बैठने से जातक का धन समय के साथ कई गुना बढ़ता जाता है।',
      impact: 'Ensures financial self-reliance, overcoming competition, burgeoning commercial enterprise, and immense property accumulation.',
      impactHindi: 'जातक को आत्मनिर्भरता, व्यवसाय में निरंतर प्रगति, अचल संपत्तियों की प्राप्ति और जीवन के उत्तरार्ध में अपार धन संपदा मिलती है।'
    });
  }

  // 15. KAHALA YOGA (Courage & High Executive Post)
  // ----------------------------------------------------
  if ([1, 4, 7, 10].includes(lord4.house) && [1, 4, 7, 10].includes(jupiter.house)) {
    yogas.push({
      id: 'kahala_yoga',
      name: 'Kahala Raj Yoga',
      nameHindi: 'काहल राजयोग',
      category: 'raj_yoga',
      categoryLabel: 'Command & Valor Yoga',
      categoryLabelHindi: 'काहल पराक्रम राजयोग',
      planetsInvolved: [lord4.name, 'Jupiter'],
      planetsInvolvedHindi: [PLANET_HINDI_NAMES[lord4.name] || lord4.name, 'देवगुरु बृहस्पति'],
      strength: 'Strong',
      strengthHindi: 'प्रबल नेतृत्व योग',
      formation: `4th Lord (${lord4.name}) and Jupiter are both positioned in powerful Kendra houses.`,
      formationHindi: `चतुर्थेश (${PLANET_HINDI_NAMES[lord4.name] || lord4.name}) और देवगुरु बृहस्पति दोनों केंद्र भावों में स्थित हैं।`,
      description: 'Kahala Yoga bestows commanding leadership, physical bravery, and high administrative appointment.',
      descriptionHindi: 'चतुर्थेश और गुरु के केंद्र में होने से काहल योग बनता है जो जातक को अदम्य साहस और सेनापति जैसा प्रभाव देता है।',
      impact: 'Bestows resolute courage, leadership over large teams, strategic wisdom, and high societal rank.',
      impactHindi: 'जातक साहसी, दृढ़ संकल्पी, बड़े संगठनों का नेतृत्व करने वाला और मान-सम्मान पाने वाला होता है।'
    });
  }

  // Return generated yogas (or at least fallback royal combination)
  if (yogas.length === 0) {
    yogas.push({
      id: 'vedic_raj_yoga_general',
      name: 'Vedic Shubha Yoga',
      nameHindi: 'वैदिक शुभ योग',
      category: 'raj_yoga',
      categoryLabel: 'Auspicious Planetary Yoga',
      categoryLabelHindi: 'वैदिक शुभ योग',
      planetsInvolved: ['Jupiter', 'Sun'],
      planetsInvolvedHindi: ['देवगुरु बृहस्पति', 'सूर्य देव'],
      strength: 'Strong',
      strengthHindi: 'प्रबल व शुभ',
      formation: 'Benefic planetary alignments in supportive houses.',
      formationHindi: 'कुंडली के शुभ भावों में ग्रहों की अनुकूल स्थिति।',
      description: 'Harmonious disposition of planetary energies providing stability and career growth.',
      descriptionHindi: 'कुंडली में ग्रहों का अनुकूल संयोजन जातक को निरंतर प्रगति और स्थिरता देता है।',
      impact: 'Brings steady career opportunities, good social reputation, and sustained family well-being.',
      impactHindi: 'जातक को आजीविका में उन्नति, समाज में प्रतिष्ठा और परिवार में सुख-शांति प्राप्त होती है।'
    });
  }

  return yogas;
}

// Generate Full Kundali Object
export function generateKundali(birthDetails: BirthDetails): KundaliResult {
  const safeDetails: BirthDetails = {
    name: birthDetails?.name?.trim() || 'Seeker',
    gender: birthDetails?.gender || 'male',
    dob: birthDetails?.dob ? String(birthDetails.dob) : '1998-01-01',
    tob: birthDetails?.tob ? String(birthDetails.tob) : '12:00',
    place: birthDetails?.place || 'New Delhi, India',
    latitude: typeof birthDetails?.latitude === 'number' && !isNaN(birthDetails.latitude) ? birthDetails.latitude : 28.6139,
    longitude: typeof birthDetails?.longitude === 'number' && !isNaN(birthDetails.longitude) ? birthDetails.longitude : 77.209,
    timezone: typeof birthDetails?.timezone === 'number' && !isNaN(birthDetails.timezone) ? birthDetails.timezone : 5.5,
  };

  const safeDob = safeDetails.dob;

  const { planets, ascendantDegree, ascendantSign } = calculateVedicPlanetaryPositions(
    safeDetails.dob,
    safeDetails.tob,
    safeDetails.latitude,
    safeDetails.longitude,
    safeDetails.timezone
  );

  const houses = buildHouses(planets, ascendantSign);
  const moon = planets.find((p) => p.name === 'Moon') || planets[0];
  const sun = planets.find((p) => p.name === 'Sun') || planets[0];
  const jupiter = planets.find((p) => p.name === 'Jupiter') || planets[0];
  const mercury = planets.find((p) => p.name === 'Mercury') || planets[0];
  const mars = planets.find((p) => p.name === 'Mars') || planets[0];
  const venus = planets.find((p) => p.name === 'Venus') || planets[0];
  const saturn = planets.find((p) => p.name === 'Saturn') || planets[0];

  const dashaPeriods = calculateDashaTimeline(safeDob, moon);
  const dosha = analyzeDoshas(planets, moon.sign);

  // Dynamic Tithi Calculation
  const tithiInfo = calculateTithi(
    (ZODIAC_SIGNS.indexOf(moon.sign) * 30) + moon.degree,
    (ZODIAC_SIGNS.indexOf(sun.sign) * 30) + sun.degree
  );

  // Dynamic Varna & Vashya
  const varnaInfo = getVarna(moon.sign);
  const vashyaInfo = getVashya(moon.sign, moon.degree);

  // Dynamic Nakshatra info
  const moonNakObj = NAKSHATRAS.find((n) => n.name === moon.nakshatra) || NAKSHATRAS[0];

  const yogas = calculateAuspiciousYogas(planets, houses, ascendantSign);

  return {
    birthDetails: safeDetails,
    ascendantSign,
    ascendantSignHindi: ZODIAC_HINDI[ascendantSign],
    ascendantDegree: `${Math.floor(ascendantDegree)}° ${Math.floor((ascendantDegree % 1) * 60)}'`,
    moonSign: moon.sign,
    moonSignHindi: ZODIAC_HINDI[moon.sign],
    sunSign: sun.sign,
    sunSignHindi: ZODIAC_HINDI[sun.sign],
    birthNakshatra: moon.nakshatra,
    birthNakshatraHindi: moon.nakshatraHindi,
    nakshatraLord: moonNakObj.lord || 'Jupiter',
    tithi: tithiInfo.tithiName,
    varna: varnaInfo.varna,
    vashya: vashyaInfo.vashya,
    yoni: moonNakObj.yoni,
    gana: `${moonNakObj.gana} Gana (${moonNakObj.ganaHindi})`,
    nadi: `${moonNakObj.nadi} Nadi (${moonNakObj.nadiHindi})`,
    planets,
    houses,
    dashaPeriods,
    dosha,
    yogas,
  };
}

// Ashtakoot 36-Gun Milan Matchmaking Engine
export function calculateMatchmaking(groom: BirthDetails, bride: BirthDetails): MatchmakingResult {
  const groomKundali = generateKundali(groom);
  const brideKundali = generateKundali(bride);

  const groomMoon = groomKundali.planets.find((p) => p.name === 'Moon') || groomKundali.planets[0];
  const brideMoon = brideKundali.planets.find((p) => p.name === 'Moon') || brideKundali.planets[0];

  const gNakIndex = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === groomMoon.nakshatra)) % 27;
  const bNakIndex = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === brideMoon.nakshatra)) % 27;

  const gNak = NAKSHATRAS[gNakIndex];
  const bNak = NAKSHATRAS[bNakIndex];

  // 1. Varna (1 point) - Spiritual & ego compatibility
  const gVarna = getVarna(groomMoon.sign);
  const bVarna = getVarna(brideMoon.sign);
  const varnaPts = gVarna.rank >= bVarna.rank ? 1 : 0;

  // 2. Vashya (2 points) - Mutual attraction & harmony
  const gVashya = getVashya(groomMoon.sign, groomMoon.degree);
  const bVashya = getVashya(brideMoon.sign, brideMoon.degree);
  let vashyaPts = 0;
  if (gVashya.group === bVashya.group) {
    vashyaPts = 2;
  } else if (
    (gVashya.group === 'Manava' && bVashya.group === 'Chatushpada') ||
    (gVashya.group === 'Chatushpada' && bVashya.group === 'Manava')
  ) {
    vashyaPts = 1;
  } else if (
    (gVashya.group === 'Manava' && bVashya.group === 'Jalachara') ||
    (gVashya.group === 'Jalachara' && bVashya.group === 'Manava')
  ) {
    vashyaPts = 1;
  } else if (gVashya.group === 'Vanachara' || bVashya.group === 'Vanachara') {
    vashyaPts = 0; // Incompatible with tame categories
  } else {
    vashyaPts = 0.5;
  }

  // 3. Tara (3 points) - Destiny & health
  const gToB = ((bNakIndex - gNakIndex + 27) % 9) + 1;
  const bToG = ((gNakIndex - bNakIndex + 27) % 9) + 1;
  // Auspicious taras: 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra), 9 (Parama Mitra)
  const isGAuspicious = [2, 4, 6, 8, 9, 0].includes(gToB % 9);
  const isBAuspicious = [2, 4, 6, 8, 9, 0].includes(bToG % 9);
  let taraPts = 0;
  if (isGAuspicious && isBAuspicious) {
    taraPts = 3;
  } else if (isGAuspicious || isBAuspicious) {
    taraPts = 1.5;
  } else {
    taraPts = 0;
  }

  // 4. Yoni (4 points) - Intimate harmony & biological nature
  let yoniPts = 2;
  if (gNak.yoni === bNak.yoni) {
    yoniPts = 4;
  } else {
    // Enemy animal pairings: (Horse, Buffalo), (Elephant, Lion), (Sheep, Monkey), (Serpent, Mongoose), (Dog, Deer), (Cat, Rat), (Cow, Tiger)
    const hostileYonis = [
      ['Ashwa (Horse)', 'Mahisha (Buffalo)'],
      ['Gaja (Elephant)', 'Simha (Lion)'],
      ['Mesha (Sheep/Ram)', 'Vanara (Monkey)'],
      ['Mesha (Goat/Sheep)', 'Vanara (Monkey)'],
      ['Sarpa (Serpent)', 'Nakula (Mongoose)'],
      ['Shwana (Dog)', 'Mriga (Deer)'],
      ['Marjara (Cat)', 'Mushaka (Rat)'],
      ['Gau (Cow)', 'Vyaghra (Tiger)'],
    ];
    const isEnemy = hostileYonis.some(
      ([y1, y2]) =>
        (gNak.yoni.includes(y1.split(' ')[0]) && bNak.yoni.includes(y2.split(' ')[0])) ||
        (gNak.yoni.includes(y2.split(' ')[0]) && bNak.yoni.includes(y1.split(' ')[0]))
    );
    if (isEnemy) {
      yoniPts = 0;
    } else {
      yoniPts = 3;
    }
  }

  // 5. Graha Maitri (5 points) - Friendship of Moon sign lords
  const signLords: Record<ZodiacSign, VedicPlanet> = {
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
  const gLord = signLords[groomMoon.sign];
  const bLord = signLords[brideMoon.sign];

  let grahaMaitriPts = 3;
  if (gLord === bLord) {
    grahaMaitriPts = 5;
  } else {
    const naturalFriends: Record<string, string[]> = {
      Sun: ['Moon', 'Mars', 'Jupiter'],
      Moon: ['Sun', 'Mercury'],
      Mars: ['Sun', 'Moon', 'Jupiter'],
      Mercury: ['Sun', 'Venus'],
      Jupiter: ['Sun', 'Moon', 'Mars'],
      Venus: ['Mercury', 'Saturn'],
      Saturn: ['Mercury', 'Venus'],
    };
    const gFriends = naturalFriends[gLord] || [];
    const bFriends = naturalFriends[bLord] || [];
    const gLikesB = gFriends.includes(bLord);
    const bLikesG = bFriends.includes(gLord);

    if (gLikesB && bLikesG) {
      grahaMaitriPts = 5;
    } else if (gLikesB || bLikesG) {
      grahaMaitriPts = 4;
    } else {
      grahaMaitriPts = 1;
    }
  }

  // 6. Gana (6 points) - Temperament & psychological match
  let ganaPts = 0;
  if (gNak.gana === bNak.gana) {
    ganaPts = 6;
  } else if (
    (gNak.gana === 'Deva' && bNak.gana === 'Manushya') ||
    (gNak.gana === 'Manushya' && bNak.gana === 'Deva')
  ) {
    ganaPts = 5;
  } else if (gNak.gana === 'Deva' && bNak.gana === 'Rakshasa') {
    ganaPts = 1;
  } else {
    ganaPts = 0;
  }

  // 7. Bhakoot (7 points) - Family welfare & emotional bond
  const gSignNum = groomMoon.signNumber;
  const bSignNum = brideMoon.signNumber;
  const signDiff = (Math.abs(gSignNum - bSignNum) + 12) % 12;
  // Inauspicious Bhakoot: 2/12 (Dwi-Dwadasha), 6/8 (Shadashtaka), 9/5 (Nava-Panchama)
  const isBhakootDosha = [1, 11, 5, 7, 4, 8].includes(signDiff);
  let bhakootPts = isBhakootDosha ? 0 : 7;
  // Cancellation if sign lords are identical or mutual friends
  if (isBhakootDosha && (gLord === bLord || grahaMaitriPts >= 4)) {
    bhakootPts = 7; // Bhakoot Dosha Parihara
  }

  // 8. Nadi (8 points) - Genetic, physiological & progeny health
  const isNadiDosha = gNak.nadi === bNak.nadi;
  const nadiPts = isNadiDosha ? 0 : 8;

  const totalPoints = varnaPts + vashyaPts + taraPts + yoniPts + grahaMaitriPts + ganaPts + bhakootPts + nadiPts;
  const maxPoints = 36;
  const percentage = Math.round((totalPoints / maxPoints) * 100);

  let recommendation: MatchmakingResult['recommendation'] = 'Average';
  let recommendationHindi = 'मध्यम गुण मिलान (Average)';

  if (totalPoints >= 28) {
    recommendation = 'Excellent';
    recommendationHindi = 'अति उत्तम मिलान (Excellent)';
  } else if (totalPoints >= 21) {
    recommendation = 'Good';
    recommendationHindi = 'शुभ व अनुकूल मिलान (Good)';
  } else if (totalPoints < 18) {
    recommendation = 'Not Recommended';
    recommendationHindi = 'सावधानी अपेक्षित (Not Recommended)';
  }

  if (totalPoints >= 28) {
    recommendation = 'Excellent';
    recommendationHindi = 'अति उत्तम मिलान (Excellent)';
  } else if (totalPoints >= 21) {
    recommendation = 'Good';
    recommendationHindi = 'शुभ व अनुकूल मिलान (Good)';
  } else if (totalPoints < 18) {
    recommendation = 'Not Recommended';
    recommendationHindi = 'सावधानी अपेक्षित (Not Recommended)';
  }

  const gunas: MatchGuna[] = [
    {
      name: 'Varna (वर्ण)',
      hindiName: 'वर्ण मिलान',
      maxPoints: 1,
      obtainedPoints: varnaPts,
      groomValue: groomKundali.varna,
      brideValue: brideKundali.varna,
      area: 'Spiritual Compatibility & Ego Balance',
      areaHindi: 'मानसिक समरसता व अहंकार संतुलन',
      description: 'Aligns intellectual and spiritual wavelengths of both partners.',
      descriptionHindi: 'दोनों के आत्मिक व बौद्धिक स्तर का संतुलन दर्शाता है।',
    },
    {
      name: 'Vashya (वश्य)',
      hindiName: 'वश्य मिलान',
      maxPoints: 2,
      obtainedPoints: vashyaPts,
      groomValue: groomKundali.vashya,
      brideValue: brideKundali.vashya,
      area: 'Mutual Influence & Attraction',
      areaHindi: 'पारस्परिक आकर्षण व अनुकूलता',
      description: 'Measures natural mutual respect, devotion, and magnetic bonding.',
      descriptionHindi: 'आपसी प्रेम, समर्पण और सामंजस्य का सूचक है।',
    },
    {
      name: 'Tara (तारा)',
      hindiName: 'तारा मिलान',
      maxPoints: 3,
      obtainedPoints: taraPts,
      groomValue: groomKundali.birthNakshatra,
      brideValue: brideKundali.birthNakshatra,
      area: 'Destiny, Health & Longevity',
      areaHindi: 'भाग्य, स्वास्थ्य और सुरक्षा',
      description: 'Calculates planetary harmony for fortune and well-being.',
      descriptionHindi: 'दोनों के भाग्य और शारीरिक आरोग्य की अनुकूलता।',
    },
    {
      name: 'Yoni (योनि)',
      hindiName: 'योनि मिलान',
      maxPoints: 4,
      obtainedPoints: yoniPts,
      groomValue: groomKundali.yoni,
      brideValue: brideKundali.yoni,
      area: 'Intimate Chemistry & Instinctive Harmony',
      areaHindi: 'दाम्पत्य सुख व शारीरिक अनुकूलता',
      description: 'Harmonizes biological nature, sexual affinity, and emotional closeness.',
      descriptionHindi: 'पारस्परिक घनिष्ठता, सहजता व सुखद वैवाहिक संबंध।',
    },
    {
      name: 'Graha Maitri (ग्रह मैत्री)',
      hindiName: 'ग्रह मैत्री',
      maxPoints: 5,
      obtainedPoints: grahaMaitriPts,
      groomValue: groomKundali.moonSign,
      brideValue: brideKundali.moonSign,
      area: 'Friendship & Intellectual Accord',
      areaHindi: 'वैचारिक मित्रता व आपसी समझ',
      description: 'Determines compatibility between Moon sign planetary rulers.',
      descriptionHindi: 'राशि स्वामियों की मित्रता एवं दैनिक विचारों का मिलान।',
    },
    {
      name: 'Gana (गण)',
      hindiName: 'गण मिलान',
      maxPoints: 6,
      obtainedPoints: ganaPts,
      groomValue: groomKundali.gana,
      brideValue: brideKundali.gana,
      area: 'Temperament, Values & Behavior',
      areaHindi: 'स्वभाव, व्यवहार व चरित्र',
      description: 'Matches core life values, behavior patterns, and communication temperaments.',
      descriptionHindi: 'दोनों के स्वभाव, दृष्टिकोण और सामाजिक तालमेल की जांच।',
    },
    {
      name: 'Bhakoot (भकूट)',
      hindiName: 'भकूट मिलान',
      maxPoints: 7,
      obtainedPoints: bhakootPts,
      groomValue: groomKundali.moonSign,
      brideValue: brideKundali.moonSign,
      area: 'Family Welfare, Prosperity & Emotional Stability',
      areaHindi: 'वंश वृद्धि, आर्थिक समृद्धि व परिवार',
      description: 'Evaluates life trajectory, financial growth, and joy in marital bond.',
      descriptionHindi: 'वैवाहिक सुख, गृहस्थ जीवन की शांति एवं आर्थिक उन्नति।',
    },
    {
      name: 'Nadi (नाड़ी)',
      hindiName: 'नाड़ी मिलान',
      maxPoints: 8,
      obtainedPoints: nadiPts,
      groomValue: groomKundali.nadi,
      brideValue: brideKundali.nadi,
      area: 'Genetic Health, Progeny & Life Force',
      areaHindi: 'संतान सुख, वंश वृद्धि व स्वास्थ्य',
      description: 'Ensures optimal genetic compatibility, healthy progeny, and physiological vitality.',
      descriptionHindi: 'संतान प्राप्ति, दीर्घायु और जैविक ऊर्जा का संतुलन।',
    },
  ];

  const groomManglik = groomKundali.dosha.isManglik;
  const brideManglik = brideKundali.dosha.isManglik;
  let manglikCompat = 'Both charts are non-Manglik. Highly auspicious match.';
  let manglikCompatHindi = 'दोनों कुंडलियाँ अमंगल दोष से मुक्त हैं। उत्तम वैवाहिक संयोग।';

  if (groomManglik && brideManglik) {
    manglikCompat = 'Both are Manglik. Manglik Dosha cancels out (Bhanga), resulting in strong marital harmony.';
    manglikCompatHindi = 'दोनों कुंडलियों में मांगलिक योग होने से दोष का परिहार (कैंसिलेशन) होता है।';
  } else if (groomManglik || brideManglik) {
    manglikCompat = `Single chart Manglik detected (${groomManglik ? 'Groom' : 'Bride'}). Vedic remedies like Kumbh Vivah or Hanuman Chalisa recitation recommended.`;
    manglikCompatHindi = `एक कुंडली में मांगलिक योग है (${groomManglik ? 'वर' : 'वधू'})। उपयुक्त वैदिक उपाय से सुखद जीवन संभव है।`;
  }

  return {
    groomDetails: groom,
    brideDetails: bride,
    totalPoints,
    maxPoints,
    percentage,
    recommendation,
    recommendationHindi,
    gunas,
    manglikCheck: {
      groomManglik,
      brideManglik,
      compatibility: manglikCompat,
      compatibilityHindi: manglikCompatHindi,
    },
    nadiDosha: isNadiDosha,
    bhakootDosha: isBhakootDosha,
  };
}

// Numerology Engine (Mulank, Bhagyank, Namank & Lo Shu Grid)
export function calculateNumerology(name: string, dob: string): NumerologyData {
  const { year, month, day } = parseFlexibleDate(dob);

  // Single digit reduction helper
  const reduceToSingleDigit = (num: number): number => {
    let sum = num;
    while (sum > 9) {
      sum = sum
        .toString()
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return sum;
  };

  const mulank = reduceToSingleDigit(day); // Driver number (1-9)
  const fullDateSum = dob.replace(/[^0-9]/g, '').split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  const bhagyank = reduceToSingleDigit(fullDateSum); // Conductor / Destiny number

  // Chaldean Name Number Matrix
  const chaldeanValues: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8,
  };

  const nameUpper = name.toUpperCase().replace(/[^A-Z]/g, '');
  let nameSum = 0;
  for (const char of nameUpper) {
    nameSum += chaldeanValues[char] || 0;
  }
  const namank = reduceToSingleDigit(nameSum || mulank);

  // Lo Shu 3x3 Grid Population
  // Standard Lo Shu grid order:
  // [4, 9, 2]
  // [3, 5, 7]
  // [8, 1, 6]
  const digitsInDob = dob.replace(/[^0-9]/g, '').split('').map(Number);
  const digitCounts: Record<number, number> = {};
  for (const d of digitsInDob) {
    if (d > 0) digitCounts[d] = (digitCounts[d] || 0) + 1;
  }
  digitCounts[mulank] = (digitCounts[mulank] || 0) + 1;
  digitCounts[bhagyank] = (digitCounts[bhagyank] || 0) + 1;

  const loShuGrid = [
    [digitCounts[4] || 0, digitCounts[9] || 0, digitCounts[2] || 0],
    [digitCounts[3] || 0, digitCounts[5] || 0, digitCounts[7] || 0],
    [digitCounts[8] || 0, digitCounts[1] || 0, digitCounts[6] || 0],
  ];

  // Number Profiles
  const numberProfiles: Record<
    number,
    {
      planet: string;
      planetHindi: string;
      qualities: string[];
      days: string[];
      colors: string[];
      gems: string[];
      compatible: number[];
      enemy: number[];
      careers: string[];
      analysis: string;
      analysisHindi: string;
    }
  > = {
    1: {
      planet: 'Sun (Surya)',
      planetHindi: 'सूर्य',
      qualities: ['Natural Leader', 'Ambitious', 'Visionary', 'Independent', 'Dynamic'],
      days: ['Sunday', 'Monday'],
      colors: ['Gold', 'Orange', 'Yellow', 'Ruby Red'],
      gems: ['Ruby (माणिक्य)', 'Sunstone', 'Amber'],
      compatible: [1, 2, 3, 5, 9],
      enemy: [6, 8],
      careers: ['Executive Leadership', 'Civil Services (IAS/IPS)', 'Entrepreneurship', 'Politics', 'Management'],
      analysis: 'Number 1 is energized by the Sun, granting magnetic charisma, pioneering spirit, and authoritative commanding presence.',
      analysisHindi: 'मूलांक 1 सूर्य का प्रतीक है। यह आपको नेतृत्व क्षमता, अदम्य आत्मविश्वास, समाज में उच्च प्रतिष्ठा और स्वतंत्र विचार प्रदान करता है।',
    },
    2: {
      planet: 'Moon (Chandra)',
      planetHindi: 'चंद्र',
      qualities: ['Intuitive', 'Diplomatic', 'Creative', 'Gentle', 'Empathetic'],
      days: ['Monday', 'Friday'],
      colors: ['White', 'Cream', 'Silver', 'Pearl'],
      gems: ['Pearl (मोती)', 'Moonstone'],
      compatible: [1, 2, 4, 7],
      enemy: [9],
      careers: ['Creative Arts', 'Psychology', 'Diplomacy', 'Healthcare & Nursing', 'Writing & Media'],
      analysis: 'Number 2 reflects the soothing luminescence of Moon, blessing you with immense emotional depth, keen artistic sense, and harmonious diplomacy.',
      analysisHindi: 'मूलांक 2 चंद्र देव से संचालित है। यह आपको शांत, संवेदनशील, रचनात्मक और अत्यधिक सहृदय बनाता है।',
    },
    3: {
      planet: 'Jupiter (Guru)',
      planetHindi: 'बृहस्पति / गुरु',
      qualities: ['Wise', 'Philosophical', 'Optimistic', 'Inspiring', 'Knowledgeable'],
      days: ['Thursday', 'Tuesday'],
      colors: ['Yellow', 'Saffron', 'Bright Gold'],
      gems: ['Yellow Sapphire (पुखराज)', 'Topaz'],
      compatible: [1, 3, 5, 7, 9],
      enemy: [6],
      careers: ['Education & Teaching', 'Law & Judiciary', 'Finance & Banking', 'Spiritual Guidance', 'Publishing'],
      analysis: 'Number 3 embodies Jupiter’s divine wisdom, expansive mind, mentorship skills, and ethical prosperity.',
      analysisHindi: 'मूलांक 3 देवगुरु बृहस्पति का अंक है। यह ज्ञान, सलाहकारी क्षमता, उच्च संस्कार और बौद्धिक समृद्धि का प्रतीक है।',
    },
    4: {
      planet: 'Rahu (North Node)',
      planetHindi: 'राहु',
      qualities: ['Analytical', 'Revolutionary', 'Strategic', 'Practical', 'Persistent'],
      days: ['Saturday', 'Sunday'],
      colors: ['Electric Blue', 'Grey', 'Brown'],
      gems: ['Hessonite (गोमेद)', 'Cat’s Eye'],
      compatible: [1, 2, 7, 8],
      enemy: [4, 9],
      careers: ['Software & AI Engineering', 'Data Analytics', 'Research & Innovation', 'Real Estate', 'Aviation'],
      analysis: 'Number 4 confers innovative non-conventional thinking, intense problem-solving power, and technological mastery.',
      analysisHindi: 'मूलांक 4 राहु से प्रभावित है। यह आउट-ऑफ़-द-बॉक्स सोच, तकनीक में निपुणता और कठिन परिस्थितियों में समाधान ढूंढने की शक्ति देता है।',
    },
    5: {
      planet: 'Mercury (Budha)',
      planetHindi: 'बुध',
      qualities: ['Versatile', 'Witty', 'Adaptable', 'Eloquent', 'Commercial Acumen'],
      days: ['Wednesday', 'Friday'],
      colors: ['Emerald Green', 'Light Turquoise', 'Pastels'],
      gems: ['Emerald (पन्ना)', 'Peridot', 'Green Tourmaline'],
      compatible: [1, 3, 5, 6],
      enemy: [2],
      careers: ['Trading & Stock Markets', 'Public Relations', 'Journalism', 'E-Commerce', 'Marketing'],
      analysis: 'Number 5 radiates Mercury’s quick intellect, communicative sparkle, boundless curiosity, and commercial flair.',
      analysisHindi: 'मूलांक 5 बुध का अंक है। यह संवाद कला, व्यापारिक चतुरता, तीव्र स्मरण शक्ति और त्वरित निर्णय लेने की क्षमता प्रदान करता है।',
    },
    6: {
      planet: 'Venus (Shukra)',
      planetHindi: 'शुक्र',
      qualities: ['Charming', 'Aesthetic', 'Generous', 'Romantic', 'Luxury Lover'],
      days: ['Friday', 'Wednesday'],
      colors: ['White', 'Light Pink', 'Sky Blue', 'Silver'],
      gems: ['Diamond (हीरा)', 'White Sapphire', 'Opal'],
      compatible: [5, 6, 8, 9],
      enemy: [1, 3],
      careers: ['Fashion & Design', 'Entertainment & Film', 'Luxury Branding', 'Hospitality', 'Cosmetics & Architecture'],
      analysis: 'Number 6 is graced by Venus, blessing you with magnetism, fine aesthetic taste, relationship warmth, and material abundance.',
      analysisHindi: 'मूलांक 6 शुक्र ग्रह का प्रतिनिधित्व करता है। यह सौंदर्य, कला, सुख-साधन, आकर्षण और प्रेम संबंधों में मधुरता लाता है।',
    },
    7: {
      planet: 'Ketu (South Node)',
      planetHindi: 'केतु',
      qualities: ['Mystic', 'Spiritual', 'Research-Oriented', 'Independent', 'Philosophical'],
      days: ['Monday', 'Thursday'],
      colors: ['White', 'Light Green', 'Lavender'],
      gems: ['Cat’s Eye (लहसुनिया)', 'Amethyst'],
      compatible: [1, 2, 4, 7],
      enemy: [9],
      careers: ['Spiritual Leadership', 'Research Science', 'Astrology & Mysticism', 'Philosophy', 'Cybersecurity'],
      analysis: 'Number 7 is deeply connected with spiritual realization, occult insights, research depth, and detachment from superficial illusions.',
      analysisHindi: 'मूलांक 7 केतु का अंक है। यह आत्मचिंतन, शोध, गुप्त ज्ञान, आध्यात्मिक जागृति और गहरी अंतर्दृष्टि प्रदान करता है।',
    },
    8: {
      planet: 'Saturn (Shani)',
      planetHindi: 'शनि',
      qualities: ['Disciplined', 'Tenacious', 'Justice-Loving', 'Strategic', 'Patient'],
      days: ['Saturday', 'Wednesday'],
      colors: ['Dark Blue', 'Black', 'Charcoal Grey'],
      gems: ['Blue Sapphire (नीलम)', 'Amethyst', 'Lapis Lazuli'],
      compatible: [4, 5, 6, 8],
      enemy: [1, 2, 9],
      careers: ['Heavy Industries & Manufacturing', 'Law & Justice', 'Real Estate Development', 'Mining & Logistics', 'Administration'],
      analysis: 'Number 8 represents Saturn’s profound discipline, reward for hard labor, resilience through tests, and massive ultimate achievements.',
      analysisHindi: 'मूलांक 8 कर्मफलदाता शनि का अंक है। यह धैर्य, परिश्रम, न्यायप्रियता और दीर्घकालिक अभूतपूर्व सफलता देता है।',
    },
    9: {
      planet: 'Mars (Mangal)',
      planetHindi: 'मंगल',
      qualities: ['Courageous', 'Energetic', 'Protective', 'Passionate', 'Fearless'],
      days: ['Tuesday', 'Thursday'],
      colors: ['Crimson Red', 'Maroon', 'Scarlet'],
      gems: ['Red Coral (मूंगा)', 'Carnelian'],
      compatible: [1, 3, 5, 9],
      enemy: [2, 4, 8],
      careers: ['Defense & Military', 'Surgery & Medicine', 'Sports & Athletics', 'Engineering', 'Emergency Services'],
      analysis: 'Number 9 burns with the warrior energy of Mars, granting fearless courage, humanitarian protection, and unstoppable drive.',
      analysisHindi: 'मूलांक 9 मंगल का अंक है। यह अदम्य साहस, ऊर्जा, रक्षक भावना, खेल और रणनीतिक सफलता प्रदान करता है।',
    },
  };

  const profile = numberProfiles[mulank] || numberProfiles[1];

  return {
    name,
    dob,
    mulank,
    bhagyank,
    namank,
    kuaNumber: reduceToSingleDigit(year),
    rulingPlanet: profile.planet,
    rulingPlanetHindi: profile.planetHindi,
    qualities: profile.qualities,
    luckyDays: profile.days,
    luckyColors: profile.colors,
    luckyGems: profile.gems,
    compatibleNumbers: profile.compatible,
    enemyNumbers: profile.enemy,
    careerProspects: profile.careers,
    loShuGrid,
    analysis: profile.analysis,
    analysisHindi: profile.analysisHindi,
  };
}

// City Coordinates & Timezone Presets
export const PANCHANG_CITY_PRESETS: Record<string, { lat: number; lon: number; tz: number }> = {
  'New Delhi, India': { lat: 28.6139, lon: 77.209, tz: 5.5 },
  'Varanasi, India (Kashi)': { lat: 25.3176, lon: 82.9739, tz: 5.5 },
  'Ujjain, India (Mahakal)': { lat: 23.1765, lon: 75.7885, tz: 5.5 },
  'Haridwar, India': { lat: 29.9457, lon: 78.1642, tz: 5.5 },
  'Ayodhya, India': { lat: 26.7922, lon: 82.1998, tz: 5.5 },
  'Mumbai, India': { lat: 19.076, lon: 72.8777, tz: 5.5 },
  'Bengaluru, India': { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  'Kolkata, India': { lat: 22.5726, lon: 88.3639, tz: 5.5 },
  'Chennai, India': { lat: 13.0827, lon: 80.2707, tz: 5.5 },
  'Hyderabad, India': { lat: 17.385, lon: 78.4867, tz: 5.5 },
  'Ahmedabad, India': { lat: 23.0225, lon: 72.5714, tz: 5.5 },
  'Jaipur, India': { lat: 26.9124, lon: 75.7873, tz: 5.5 },
  'Kathmandu, Nepal': { lat: 27.7172, lon: 85.324, tz: 5.75 },
  'London, UK': { lat: 51.5074, lon: -0.1278, tz: 0 },
  'New York, USA': { lat: 40.7128, lon: -74.006, tz: -5 },
  'San Francisco, USA': { lat: 37.7749, lon: -122.4194, tz: -8 },
  'Dubai, UAE': { lat: 25.2048, lon: 55.2708, tz: 4 },
  'Singapore': { lat: 1.3521, lon: 103.8198, tz: 8 },
  'Sydney, Australia': { lat: -33.8688, lon: 151.2093, tz: 10 },
  'Toronto, Canada': { lat: 43.6532, lon: -79.3832, tz: -5 },
};

// Helper to format Date into 12-hour local time string (hh:mm AM/PM)
function formatLocalTime(date: Date, tzHours: number): string {
  const localMs = date.getTime() + tzHours * 3600 * 1000;
  const localDate = new Date(localMs);
  let h = localDate.getUTCHours();
  const m = localDate.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatLocalTimeRange(startDate: Date, endDate: Date, tzHours: number): string {
  return `${formatLocalTime(startDate, tzHours)} - ${formatLocalTime(endDate, tzHours)}`;
}

// Generate Real-time Vedic Daily Panchang for specified date & city
export function calculateDailyPanchang(
  dateStr?: string,
  city = 'New Delhi, India',
  customLat?: number,
  customLon?: number,
  customTz?: number
): PanchangData {
  // Resolve city coordinates & timezone
  let lat = 28.6139;
  let lon = 77.209;
  let tz = 5.5;

  if (typeof customLat === 'number' && typeof customLon === 'number') {
    lat = customLat;
    lon = customLon;
    tz = typeof customTz === 'number' ? customTz : 5.5;
  } else {
    // Check preset match or substring
    const matchedKey = Object.keys(PANCHANG_CITY_PRESETS).find(
      (k) => k.toLowerCase() === city.toLowerCase() || k.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey && PANCHANG_CITY_PRESETS[matchedKey]) {
      lat = PANCHANG_CITY_PRESETS[matchedKey].lat;
      lon = PANCHANG_CITY_PRESETS[matchedKey].lon;
      tz = PANCHANG_CITY_PRESETS[matchedKey].tz;
    }
  }

  // Parse target date components
  let targetYear: number, targetMonth: number, targetDay: number;
  if (dateStr && dateStr.includes('-')) {
    const parts = dateStr.split('-').map(Number);
    targetYear = parts[0];
    targetMonth = parts[1];
    targetDay = parts[2];
  } else {
    const now = new Date();
    // In local timezone
    const nowLocal = new Date(now.getTime() + tz * 3600 * 1000);
    targetYear = nowLocal.getUTCFullYear();
    targetMonth = nowLocal.getUTCMonth() + 1;
    targetDay = nowLocal.getUTCDate();
  }

  // Local Midnight and Local Noon in UTC timestamp
  const localMidnightUTC = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 0, 0, 0) - tz * 3600 * 1000);
  const localNoonUTC = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 12, 0, 0) - tz * 3600 * 1000);

  // Day of week in local calendar (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const localCalendarDate = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 12, 0, 0));
  const dayOfWeek = localCalendarDate.getUTCDay();

  // Astronomical calculations for Sun & Moon rise/set
  const observer = new Astronomy.Observer(lat, lon, 0);
  const startAstroTime = Astronomy.MakeTime(localMidnightUTC);

  // Search for Sunrise and Sunset
  let sunriseDate: Date;
  let sunsetDate: Date;

  try {
    const sunriseRes = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, startAstroTime, 1.0);
    if (sunriseRes && sunriseRes.date) {
      sunriseDate = sunriseRes.date;
    } else {
      sunriseDate = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 6, 0, 0) - tz * 3600 * 1000);
    }
  } catch {
    sunriseDate = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 6, 0, 0) - tz * 3600 * 1000);
  }

  try {
    const sunsetSearchStart = Astronomy.MakeTime(sunriseDate);
    const sunsetRes = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunsetSearchStart, 1.0);
    if (sunsetRes && sunsetRes.date) {
      sunsetDate = sunsetRes.date;
    } else {
      sunsetDate = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 18, 0, 0) - tz * 3600 * 1000);
    }
  } catch {
    sunsetDate = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 18, 0, 0) - tz * 3600 * 1000);
  }

  // Moonrise and Moonset
  let moonriseStr = '04:15 PM';
  let moonsetStr = '05:30 AM';
  try {
    const moonriseRes = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, startAstroTime, 1.5);
    if (moonriseRes && moonriseRes.date) {
      moonriseStr = formatLocalTime(moonriseRes.date, tz);
    }
    const moonsetRes = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, startAstroTime, 1.5);
    if (moonsetRes && moonsetRes.date) {
      moonsetStr = formatLocalTime(moonsetRes.date, tz);
    }
  } catch {
    // Keep fallback strings
  }

  const sunriseStr = formatLocalTime(sunriseDate, tz);
  const sunsetStr = formatLocalTime(sunsetDate, tz);

  // Exact Daytime Duration (दिनमान) and 8 equal segments
  const dayDurationMs = Math.max(sunsetDate.getTime() - sunriseDate.getTime(), 10 * 3600 * 1000);
  const partDurationMs = dayDurationMs / 8;

  // ----------------------------------------------------
  // VEDIC RAHU KAAL, YAMAGANDA, GULIKA KAAL CALCULATION
  // Based on the 8 segments of the day from Sunrise to Sunset
  // ----------------------------------------------------
  // Rahu Kaal Part (0-indexed segment 0 to 7):
  // Sunday (0): 8th part (idx 7)
  // Monday (1): 2nd part (idx 1)
  // Tuesday (2): 7th part (idx 6)
  // Wednesday (3): 5th part (idx 4)
  // Thursday (4): 6th part (idx 5)
  // Friday (5): 4th part (idx 3)
  // Saturday (6): 3rd part (idx 2)
  const RAHU_PARTS = [7, 1, 6, 4, 5, 3, 2];
  const rahuPartIdx = RAHU_PARTS[dayOfWeek];
  const rahuStartTime = new Date(sunriseDate.getTime() + rahuPartIdx * partDurationMs);
  const rahuEndTime = new Date(sunriseDate.getTime() + (rahuPartIdx + 1) * partDurationMs);
  const rahuKaal = formatLocalTimeRange(rahuStartTime, rahuEndTime, tz);

  // Yamaganda Part (0-indexed):
  // Sun: 5th(4), Mon: 4th(3), Tue: 3rd(2), Wed: 2nd(1), Thu: 1st(0), Fri: 7th(6), Sat: 6th(5)
  const YAMA_PARTS = [4, 3, 2, 1, 0, 6, 5];
  const yamaPartIdx = YAMA_PARTS[dayOfWeek];
  const yamaStartTime = new Date(sunriseDate.getTime() + yamaPartIdx * partDurationMs);
  const yamaEndTime = new Date(sunriseDate.getTime() + (yamaPartIdx + 1) * partDurationMs);
  const yamaganda = formatLocalTimeRange(yamaStartTime, yamaEndTime, tz);

  // Gulika Kaal Part (0-indexed):
  // Sun: 7th(6), Mon: 6th(5), Tue: 5th(4), Wed: 4th(3), Thu: 3rd(2), Fri: 2nd(1), Sat: 1st(0)
  const GULIKA_PARTS = [6, 5, 4, 3, 2, 1, 0];
  const gulikaPartIdx = GULIKA_PARTS[dayOfWeek];
  const gulikaStartTime = new Date(sunriseDate.getTime() + gulikaPartIdx * partDurationMs);
  const gulikaEndTime = new Date(sunriseDate.getTime() + (gulikaPartIdx + 1) * partDurationMs);
  const gulikaKaal = formatLocalTimeRange(gulikaStartTime, gulikaEndTime, tz);

  // Abhijit Muhurat (8th Muhurat of 15 Muhurtas of the day)
  const muhurtaDurationMs = dayDurationMs / 15;
  const abhijitStartTime = new Date(sunriseDate.getTime() + 7 * muhurtaDurationMs);
  const abhijitEndTime = new Date(sunriseDate.getTime() + 8 * muhurtaDurationMs);
  const abhijitMuhurat = formatLocalTimeRange(abhijitStartTime, abhijitEndTime, tz);

  // Vijay Muhurat (11th Muhurat)
  const vijayStartTime = new Date(sunriseDate.getTime() + 10 * muhurtaDurationMs);
  const vijayEndTime = new Date(sunriseDate.getTime() + 11 * muhurtaDurationMs);

  // Brahma Muhurat (approx 96 min to 48 min before sunrise)
  const brahmaStartTime = new Date(sunriseDate.getTime() - 96 * 60 * 1000);
  const brahmaEndTime = new Date(sunriseDate.getTime() - 48 * 60 * 1000);

  // Godhuli Bela (24 min before to 24 min after sunset)
  const godhuliStartTime = new Date(sunsetDate.getTime() - 24 * 60 * 1000);
  const godhuliEndTime = new Date(sunsetDate.getTime() + 24 * 60 * 1000);

  // Amrit Kaal (auspicious morning/day Muhurat)
  const amritStartTime = new Date(sunriseDate.getTime() + 1.2 * muhurtaDurationMs);
  const amritEndTime = new Date(sunriseDate.getTime() + 2.8 * muhurtaDurationMs);

  const shubhMuhurat = [
    `Brahma Muhurat: ${formatLocalTimeRange(brahmaStartTime, brahmaEndTime, tz)}`,
    `Abhijit Muhurat: ${abhijitMuhurat}`,
    `Vijay Muhurat: ${formatLocalTimeRange(vijayStartTime, vijayEndTime, tz)}`,
    `Godhuli Bela: ${formatLocalTimeRange(godhuliStartTime, godhuliEndTime, tz)}`,
    `Amrit Kaal: ${formatLocalTimeRange(amritStartTime, amritEndTime, tz)}`,
  ];

  // ----------------------------------------------------
  // DYNAMIC DAY CHOGHADIYA CALCULATION (8 equal parts)
  // ----------------------------------------------------
  const CHOG_TYPES: Record<string, { type: 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Rog' | 'Kaal' | 'Udveg'; descHi: string; descEn: string }> = {
    Udveg: { type: 'Udveg', descHi: 'उद्वेग - तनावपूर्ण (अशुभ)', descEn: 'Stressful (Inauspicious)' },
    Char: { type: 'Char', descEn: 'Good for travel & movement', descHi: 'चर - यात्रा व गतिशीलता हेतु शुभ' },
    Labh: { type: 'Labh', descHi: 'लाभ - व्यापार व धन प्राप्ति हेतु उत्तम', descEn: 'Financial gain & business' },
    Amrit: { type: 'Amrit', descHi: 'अमृत - सर्वकार्य सिद्धि (सर्वश्रेष्ठ)', descEn: 'Highest Auspiciousness' },
    Kaal: { type: 'Kaal', descHi: 'काल - अशुभ काल (हानिप्रद)', descEn: 'Inauspicious Period' },
    Shubh: { type: 'Shubh', descHi: 'शुभ - मांगलिक कार्य हेतु श्रेष्ठ', descEn: 'Auspicious Ceremonies' },
    Rog: { type: 'Rog', descHi: 'रोग - स्वास्थ्य व विवाद से बचें', descEn: 'Inauspicious / Health Hazard' },
  };

  const DAY_CHOG_ORDERS: string[][] = [
    ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sun
    ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'], // Mon
    ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'], // Tue
    ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'], // Wed
    ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Thu
    ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'], // Fri
    ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal'], // Sat
  ];

  const weekdayChogOrder = DAY_CHOG_ORDERS[dayOfWeek];
  const choghadiyaDay: PanchangData['choghadiyaDay'] = weekdayChogOrder.map((chogKey, idx) => {
    const slotStart = new Date(sunriseDate.getTime() + idx * partDurationMs);
    const slotEnd = new Date(sunriseDate.getTime() + (idx + 1) * partDurationMs);
    const timeRangeStr = formatLocalTimeRange(slotStart, slotEnd, tz);
    const meta = CHOG_TYPES[chogKey] || CHOG_TYPES['Amrit'];
    return {
      name: `${chogKey} (${meta.descHi})`,
      type: meta.type,
      time: timeRangeStr,
    };
  });

  // ----------------------------------------------------
  // PLANETARY & 5 PANCHANG LIMBS AT SUNRISE
  // ----------------------------------------------------
  const astroSunriseTime = Astronomy.MakeTime(sunriseDate);
  const tCenturies = astroSunriseTime.ut / 36525.0;
  const ayanamsha = 23.857092 + 1.396971 * tCenturies + 0.000309 * tCenturies * tCenturies;

  const sunTropical = Astronomy.SunPosition(astroSunriseTime).elon;
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, astroSunriseTime, true);
  const moonTropical = Astronomy.Ecliptic(moonVec).elon;
  const nirayanaSun = normalizeDegrees(sunTropical - ayanamsha);
  const nirayanaMoon = normalizeDegrees(moonTropical - ayanamsha);

  // 1. Tithi
  const tithiInfo = calculateTithi(nirayanaMoon, nirayanaSun);

  // Calculate dynamic Tithi End Time
  const diffAtSunrise = normalizeDegrees(nirayanaMoon - nirayanaSun);
  const currentTithiIndex = Math.floor(diffAtSunrise / 12);
  const targetTithiDegree = (currentTithiIndex + 1) * 12;
  let tithiEndTime = '10:45 PM';

  try {
    // Step forward hour by hour up to 36 hours to find when Moon-Sun diff crosses next 12 deg boundary
    let foundMs: number | null = null;
    for (let m = 15; m <= 36 * 60; m += 15) {
      const probeDate = new Date(sunriseDate.getTime() + m * 60000);
      const probeAstro = Astronomy.MakeTime(probeDate);
      const sT = Astronomy.SunPosition(probeAstro).elon;
      const mVec = Astronomy.GeoVector(Astronomy.Body.Moon, probeAstro, true);
      const mT = Astronomy.Ecliptic(mVec).elon;
      const tProbe = probeAstro.ut / 36525.0;
      const ayanProbe = 23.857092 + 1.396971 * tProbe + 0.000309 * tProbe * tProbe;
      const nSun = normalizeDegrees(sT - ayanProbe);
      const nMoon = normalizeDegrees(mT - ayanProbe);
      const dNow = normalizeDegrees(nMoon - nSun);
      const curIdxNow = Math.floor(dNow / 12);
      if (curIdxNow !== currentTithiIndex) {
        foundMs = probeDate.getTime();
        break;
      }
    }
    if (foundMs) {
      tithiEndTime = formatLocalTime(new Date(foundMs), tz);
    }
  } catch {
    // Keep fallback
  }

  // 2. Nakshatra
  const nakIndex = Math.floor(nirayanaMoon / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakIndex] || NAKSHATRAS[0];

  // Calculate dynamic Nakshatra End Time
  let nakshatraEndTime = '11:30 PM';
  try {
    let foundNakMs: number | null = null;
    for (let m = 15; m <= 36 * 60; m += 15) {
      const probeDate = new Date(sunriseDate.getTime() + m * 60000);
      const probeAstro = Astronomy.MakeTime(probeDate);
      const mVec = Astronomy.GeoVector(Astronomy.Body.Moon, probeAstro, true);
      const mT = Astronomy.Ecliptic(mVec).elon;
      const tProbe = probeAstro.ut / 36525.0;
      const ayanProbe = 23.857092 + 1.396971 * tProbe + 0.000309 * tProbe * tProbe;
      const nMoon = normalizeDegrees(mT - ayanProbe);
      const curNakIdxNow = Math.floor(nMoon / (360 / 27)) % 27;
      if (curNakIdxNow !== nakIndex) {
        foundNakMs = probeDate.getTime();
        break;
      }
    }
    if (foundNakMs) {
      nakshatraEndTime = formatLocalTime(new Date(foundNakMs), tz);
    }
  } catch {
    // Keep fallback
  }

  // 3. Yoga (Sun + Moon Nirayana Longitude / 13°20')
  const YOGAS = [
    { en: 'Vishkambha', hi: 'विष्कम्भ योग' },
    { en: 'Priti', hi: 'प्रीति योग' },
    { en: 'Ayushman', hi: 'आयुष्मान् योग' },
    { en: 'Saubhagya', hi: 'सौभाग्य योग' },
    { en: 'Shobhana', hi: 'शोभन योग' },
    { en: 'Atiganda', hi: 'अतिगण्ड योग' },
    { en: 'Sukarma', hi: 'सुकर्मा योग' },
    { en: 'Dhriti', hi: 'धृति योग' },
    { en: 'Shoola', hi: 'शूल योग' },
    { en: 'Ganda', hi: 'गण्ड योग' },
    { en: 'Vriddhi', hi: 'वृद्धि योग' },
    { en: 'Dhruva', hi: 'ध्रुव योग' },
    { en: 'Vyaghata', hi: 'व्याघात योग' },
    { en: 'Harshana', hi: 'हर्षण योग' },
    { en: 'Vajra', hi: 'वज्र योग' },
    { en: 'Siddhi', hi: 'सिद्धि योग' },
    { en: 'Vyatipata', hi: 'व्यतीपात योग' },
    { en: 'Variyana', hi: 'वरीयान् योग' },
    { en: 'Parigha', hi: 'परिघ योग' },
    { en: 'Shiva', hi: 'शिव योग' },
    { en: 'Siddha', hi: 'सिद्ध योग' },
    { en: 'Sadhya', hi: 'साध्य योग' },
    { en: 'Shubha', hi: 'शुभ योग' },
    { en: 'Shukla', hi: 'शुक्ल योग' },
    { en: 'Brahma', hi: 'ब्रह्म योग' },
    { en: 'Indra', hi: 'इन्द्र योग' },
    { en: 'Vaidhriti', hi: 'वैधृति योग' },
  ];
  const yogaIndex = Math.floor(normalizeDegrees(nirayanaSun + nirayanaMoon) / (360 / 27)) % 27;
  const yoga = YOGAS[yogaIndex] || YOGAS[0];

  // 4. Karana (Half of Tithi = 6 degrees)
  const KARANAS = [
    { en: 'Bava', hi: 'बव करण' },
    { en: 'Balava', hi: 'बालव करण' },
    { en: 'Kaulava', hi: 'कौलव करण' },
    { en: 'Taitila', hi: 'तैतिल करण' },
    { en: 'Gara', hi: 'गर करण' },
    { en: 'Vanija', hi: 'वणिज करण' },
    { en: 'Vishti (Bhadra)', hi: 'विष्टि (भद्रा) करण' },
    { en: 'Shakuni', hi: 'शकुनि करण' },
    { en: 'Chatushpada', hi: 'चतुष्पद करण' },
    { en: 'Naga', hi: 'नाग करण' },
    { en: 'Kimstughna', hi: 'किंस्तुघ्न करण' },
  ];
  const totalKaranaIndex = Math.floor(normalizeDegrees(nirayanaMoon - nirayanaSun) / 6);
  let karanaObj = KARANAS[0];
  if (totalKaranaIndex === 0) {
    karanaObj = KARANAS[10]; // Kimstughna
  } else if (totalKaranaIndex >= 57) {
    if (totalKaranaIndex === 57) karanaObj = KARANAS[7]; // Shakuni
    else if (totalKaranaIndex === 58) karanaObj = KARANAS[8]; // Chatushpada
    else karanaObj = KARANAS[9]; // Naga
  } else {
    karanaObj = KARANAS[(totalKaranaIndex - 1) % 7];
  }

  const resultDateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;

  return {
    date: resultDateStr,
    location: city,
    sunrise: sunriseStr,
    sunset: sunsetStr,
    moonrise: moonriseStr,
    moonset: moonsetStr,
    tithi: tithiInfo.tithiName,
    tithiHindi: tithiInfo.tithiNameHindi,
    tithiEndTime,
    nakshatra: nakshatra.name,
    nakshatraHindi: nakshatra.hindi,
    nakshatraEndTime,
    yoga: `${yoga.en} (${yoga.hi})`,
    yogaHindi: yoga.hi,
    karana: `${karanaObj.en} (${karanaObj.hi})`,
    karanaHindi: karanaObj.hi,
    rahuKaal,
    yamaganda,
    gulikaKaal,
    abhijitMuhurat,
    shubhMuhurat,
    choghadiyaDay,
  };
}

// 12 Zodiac Daily Predictions
export function getDailyHoroscope(sign: ZodiacSign): DailyHoroscope {
  const signData: Record<
    ZodiacSign,
    {
      sanskrit: string;
      hindi: string;
      element: 'Fire' | 'Earth' | 'Air' | 'Water';
      lord: string;
      en: string;
      hi: string;
      color: string;
      colorHi: string;
      num: number;
      time: string;
      dir: string;
      mantra: string;
      mantraHi: string;
      ratings: { overall: number; love: number; career: number; wealth: number; health: number };
    }
  > = {
    Aries: {
      sanskrit: 'Mesha',
      hindi: 'मेष',
      element: 'Fire',
      lord: 'Mars',
      en: 'A high-energy day filled with proactive opportunities. Your confidence will impress senior colleagues and open pathways for new project leadership. Keep your temper cool in evening family discussions.',
      hi: 'आज का दिन नई ऊर्जा और उत्साह से भरा रहेगा। कार्यक्षेत्र में आपके सुझावों की प्रशंसा होगी। सायंकाल में परिवार के साथ मधुर संवाद रखें।',
      color: 'Scarlet Red',
      colorHi: 'लाल',
      num: 9,
      time: '09:00 AM - 10:30 AM',
      dir: 'East',
      mantra: 'Om Hanumate Namaha',
      mantraHi: 'ॐ हनुमते नमः',
      ratings: { overall: 5, love: 4, career: 5, wealth: 4, health: 4 },
    },
    Taurus: {
      sanskrit: 'Vrishabha',
      hindi: 'वृषभ',
      element: 'Earth',
      lord: 'Venus',
      en: 'Financial stability increases with unexpected returns or bonus incentives. Romantic relations will flourish with heartfelt understanding. Enjoy creative culinary or artistic pastimes.',
      hi: 'आर्थिक स्थिति में सुधार होगा। जीवनसाथी या प्रेमी के साथ सामंजस्य बढ़ेगा। कला व संगीत में रुचि मन को शांति देगी।',
      color: 'Emerald White',
      colorHi: 'सफेद / चमकीला',
      num: 6,
      time: '02:00 PM - 03:30 PM',
      dir: 'South-East',
      mantra: 'Om Shukraya Namaha',
      mantraHi: 'ॐ शुक्राय नमः',
      ratings: { overall: 4, love: 5, career: 4, wealth: 5, health: 4 },
    },
    Gemini: {
      sanskrit: 'Mithuna',
      hindi: 'मिथुन',
      element: 'Air',
      lord: 'Mercury',
      en: 'Brilliant communication skills will help you close critical agreements. Networking with high-profile industry peers brings lucrative breakthroughs. Avoid multitasking overextension.',
      hi: 'आपकी वाकपटुता और बुद्धिमत्ता से अटके कार्य पूरे होंगे। नए संपर्कों से व्यापारिक लाभ के योग हैं।',
      color: 'Parrot Green',
      colorHi: 'हरा',
      num: 5,
      time: '11:00 AM - 12:30 PM',
      dir: 'North',
      mantra: 'Om Budhaya Namaha',
      mantraHi: 'ॐ बुधाय नमः',
      ratings: { overall: 5, love: 4, career: 5, wealth: 4, health: 4 },
    },
    Cancer: {
      sanskrit: 'Karka',
      hindi: 'कर्क',
      element: 'Water',
      lord: 'Moon',
      en: 'Intuition is at its peak. Trust your inner feelings regarding family decisions and investments. Domestic peace returns, soothing previous stress. Hydrate well throughout the day.',
      hi: 'आत्मविश्वास और अंतर्ज्ञान मजबूत रहेगा। घर-परिवार में सुख-शांति का वातावरण रहेगा। स्वास्थ्य का ध्यान रखें।',
      color: 'Silver / Pearl White',
      colorHi: 'चांदी जैसा सफेद',
      num: 2,
      time: '07:00 AM - 08:30 AM',
      dir: 'North-West',
      mantra: 'Om Chandraya Namaha',
      mantraHi: 'ॐ सोमाय नमः',
      ratings: { overall: 4, love: 5, career: 4, wealth: 4, health: 4 },
    },
    Leo: {
      sanskrit: 'Simha',
      hindi: 'सिंह',
      element: 'Fire',
      lord: 'Sun',
      en: 'You naturally command admiration and leadership today. Recognition from authorities or government agencies is very favorable. Keep generosity at the core of all dealings.',
      hi: 'मान-सम्मान और पद-प्रतिष्ठा में वृद्धि होगी। उच्चाधिकारियों से सहयोग मिलेगा। सूर्य देव को जल अर्पित करें।',
      color: 'Royal Gold',
      colorHi: 'सुनहरा / केसरिया',
      num: 1,
      time: '08:00 AM - 09:30 AM',
      dir: 'East',
      mantra: 'Om Suryaya Namaha',
      mantraHi: 'ॐ सूर्याय नमः',
      ratings: { overall: 5, love: 4, career: 5, wealth: 5, health: 5 },
    },
    Virgo: {
      sanskrit: 'Kanya',
      hindi: 'कन्या',
      element: 'Earth',
      lord: 'Mercury',
      en: 'Meticulous analytical focus helps you streamline complex accounts or audits. Health routines started today will give rapid positive transformations. Helpful advice arrives from a mentor.',
      hi: 'बारीकी से किए गए कार्यों में उत्कृष्ट सफलता मिलेगी। विद्यार्थियों और शोधकर्ताओं के लिए उत्तम दिन है।',
      color: 'Light Jade Green',
      colorHi: 'हल्का हरा',
      num: 5,
      time: '03:30 PM - 05:00 PM',
      dir: 'North',
      mantra: 'Om Namo Bhagavate Vasudevaya',
      mantraHi: 'ॐ नमो भगवते वासुदेवाय',
      ratings: { overall: 4, love: 4, career: 5, wealth: 4, health: 4 },
    },
    Libra: {
      sanskrit: 'Tula',
      hindi: 'तुला',
      element: 'Air',
      lord: 'Venus',
      en: 'Balance and beauty reign supreme today. Ideal day for signing collaborative partnerships, fashion shopping, and romantic date nights. Mutual consensus brings victory.',
      hi: 'साझेदारी के कार्यों में उत्तम लाभ होगा। दांपत्य जीवन में सुखद पल व्यतीत होंगे। सुंदरता व कला की ओर रुझान रहेगा।',
      color: 'Rose Pink',
      colorHi: 'गुलाबी / क्रीम',
      num: 6,
      time: '05:00 PM - 06:30 PM',
      dir: 'West',
      mantra: 'Om Mahalakshmyai Namaha',
      mantraHi: 'ॐ महालक्ष्म्यै नमः',
      ratings: { overall: 5, love: 5, career: 4, wealth: 4, health: 4 },
    },
    Scorpio: {
      sanskrit: 'Vrischika',
      hindi: 'वृश्चिक',
      element: 'Water',
      lord: 'Mars',
      en: 'Deep transformational focus allows you to uncover hidden knowledge and solve long-standing puzzles. Your magnetic aura attracts influential allies. Maintain confidentiality on big plans.',
      hi: 'गुढ़ विषयों में सफलता मिलेगी। गुप्त शत्रुओं पर विजय प्राप्त होगी। अपनी योजनाओं को गोपनीय रखें।',
      color: 'Deep Maroon',
      colorHi: 'गहरा लाल / मैरून',
      num: 9,
      time: '01:00 PM - 02:30 PM',
      dir: 'South',
      mantra: 'Om Rudraya Namaha',
      mantraHi: 'ॐ रुद्राय नमः',
      ratings: { overall: 4, love: 4, career: 5, wealth: 4, health: 4 },
    },
    Sagittarius: {
      sanskrit: 'Dhanu',
      hindi: 'धनु',
      element: 'Fire',
      lord: 'Jupiter',
      en: 'Wisdom, optimism, and higher learning guide your day. Favorable indicators for educational examinations, legal vindication, or spiritual pilgrimages. Generosity brings fortune.',
      hi: 'गुरु कृपा से भाग्य पक्ष मजबूत रहेगा। धार्मिक कार्यों में मन लगेगा। यात्रा के शुभ योग बन रहे हैं।',
      color: 'Bright Saffron Yellow',
      colorHi: 'पीला / केसरिया',
      num: 3,
      time: '10:00 AM - 11:30 AM',
      dir: 'North-East',
      mantra: 'Om Gurave Namaha',
      mantraHi: 'ॐ बृं बृहस्पतये नमः',
      ratings: { overall: 5, love: 4, career: 5, wealth: 5, health: 5 },
    },
    Capricorn: {
      sanskrit: 'Makara',
      hindi: 'मकर',
      element: 'Earth',
      lord: 'Saturn',
      en: 'Solid long-term foundations are laid today. Your perseverance in career and practical discipline will soon be rewarded with durable seniority. Stay grounded and patient.',
      hi: 'कर्मक्षेत्र में आपकी निष्ठा रंग लाएगी। वरिष्ठ अधिकारियों का विश्वास प्राप्त होगा। परिश्रम से लाभ मिलेगा।',
      color: 'Navy Blue',
      colorHi: 'नीला / काला',
      num: 8,
      time: '04:00 PM - 05:30 PM',
      dir: 'South',
      mantra: 'Om Sham Shanicharaya Namaha',
      mantraHi: 'ॐ शं शनैश्चराय नमः',
      ratings: { overall: 4, love: 4, career: 5, wealth: 4, health: 4 },
    },
    Aquarius: {
      sanskrit: 'Kumbha',
      hindi: 'कुंभ',
      element: 'Air',
      lord: 'Saturn / Rahu',
      en: 'Inventive breakthroughs, social networking, and group projects thrive under your visionary guidance. A sudden humanitarian impulse brings profound internal joy and blessings.',
      hi: 'नवोन्मेषी विचारों से समाज व मित्रों में प्रभाव बढ़ेगा। परोपकार के कार्य आत्मसंतुष्टि देंगे।',
      color: 'Electric Cyan',
      colorHi: 'आसमानी नीला',
      num: 8,
      time: '12:30 PM - 02:00 PM',
      dir: 'West',
      mantra: 'Om Namah Shivaya',
      mantraHi: 'ॐ नमः शिवाय',
      ratings: { overall: 5, love: 4, career: 4, wealth: 4, health: 5 },
    },
    Pisces: {
      sanskrit: 'Meena',
      hindi: 'मीन',
      element: 'Water',
      lord: 'Jupiter',
      en: 'Serenity, divine imagination, and compassion grace your mindset. Art, meditation, and music provide therapeutic rejuvenation. Romantic conversations are exceptionally tender and healing.',
      hi: 'मन में शांति व भक्ति भाव रहेगा। रचनात्मक व आध्यात्मिक कार्यों में सिद्धि मिलेगी। दांपत्य जीवन सुखद रहेगा।',
      color: 'Seafoam Green / Golden',
      colorHi: 'पीला / समुद्री हरा',
      num: 3,
      time: '08:30 AM - 10:00 AM',
      dir: 'North-East',
      mantra: 'Om Namo Narayanaya',
      mantraHi: 'ॐ नमो नारायणाय',
      ratings: { overall: 5, love: 5, career: 4, wealth: 4, health: 5 },
    },
  };

  const item = signData[sign];
  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    sign,
    signHindi: item.hindi,
    sanskritName: item.sanskrit,
    element: item.element,
    rulingPlanet: item.lord,
    date: todayDate,
    summary: item.en,
    summaryHindi: item.hi,
    ratings: item.ratings,
    luckyNumber: item.num,
    luckyColor: item.color,
    luckyColorHindi: item.colorHi,
    luckyTime: item.time,
    auspiciousDirection: item.dir,
    mantra: item.mantra,
    mantraHindi: item.mantraHi,
  };
}
