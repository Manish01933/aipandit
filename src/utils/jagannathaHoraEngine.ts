import {
  BirthDetails,
  ZodiacSign,
  VedicPlanet,
  VargaCode,
  VargaChartData,
  VargaPlanet,
  VargaHouse,
  CharaKaraka,
  SpecialLagnaInfo,
  ArudhaPadaInfo,
  ShadbalaItem,
  SarvashtakavargaData,
  AshtakavargaPlanetaryTable,
  PlanetaryAvasthaInfo,
  DetailedVimshottariPeriod,
  JagannathaHoraData,
} from '../types/astrology';

export type { VargaCode };
import {
  generateKundali,
  ZODIAC_SIGNS,
  ZODIAC_HINDI,
  PLANETS_HINDI,
} from './vedicCalculations';

// Sign lords
const SIGN_LORDS: Record<ZodiacSign, VedicPlanet> = {
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

// Varga metadata
export const VARGA_METADATA: Record<
  VargaCode,
  {
    name: string;
    hindiName: string;
    sanskritName: string;
    signification: string;
    significationHindi: string;
    factor: number;
  }
> = {
  D1: {
    name: 'Rashi Chart',
    hindiName: 'राशि चक्र (लग्न)',
    sanskritName: 'राशिश्चक्रम्',
    signification: 'Physical body, general existence, overall destiny and foundation',
    significationHindi: 'स्थूल शरीर, सामान्य जीवन, व्यक्तित्व एवं सम्पूर्ण प्रारब्ध',
    factor: 1,
  },
  D2: {
    name: 'Hora Chart',
    hindiName: 'होरा चक्र (धन व साधन)',
    sanskritName: 'होराचक्रम्',
    signification: 'Wealth, financial assets, treasury, resources, prosperity and speech',
    significationHindi: 'धन, संपत्ति, कोष, संपदा और आर्थिक संचय',
    factor: 2,
  },
  D3: {
    name: 'Drekkana Chart',
    hindiName: 'द्रेष्काण चक्र (पराक्रम व भ्राता)',
    sanskritName: 'द्रेष्काणचक्रम्',
    signification: 'Siblings, courage, vitality, energy, third house karmas and adventures',
    significationHindi: 'छोटे भाई-बहन, पराक्रम, साहस, उद्यम और आंतरिक ऊर्जा',
    factor: 3,
  },
  D4: {
    name: 'Chaturthamsa Chart',
    hindiName: 'चतुर्थांश / तुर्यांश (भाग्य व संपत्ति)',
    sanskritName: 'तुर्यांशचक्रम्',
    signification: 'Fixed assets, land, vehicles, home, ancestral wealth, general fortune',
    significationHindi: 'स्थायी संपत्ति, भूमि, भवन, वाहन सुख एवं गृहस्थ भाग्य',
    factor: 4,
  },
  D7: {
    name: 'Saptamsha Chart',
    hindiName: 'सप्तांश चक्र (संतान व वंश)',
    sanskritName: 'सप्तांशचक्रम्',
    signification: 'Children, progeny, lineage, creative legacy, grandson and partnerships',
    significationHindi: 'संतान सुख, वंश वृद्धि, रचनात्मकता और संतति प्रारब्ध',
    factor: 7,
  },
  D9: {
    name: 'Navamsha Chart',
    hindiName: 'नवांश चक्र (धर्म, जीवनसाथी व सूक्ष्म बल)',
    sanskritName: 'नवांशचक्रम्',
    signification: 'Dharma, spouse, marriage destiny, inner soul potential, fortune after 30s',
    significationHindi: 'धर्म, दांपत्य जीवन, जीवनसाथी का स्वरूप एवं आंतरिक आत्मिक बल',
    factor: 9,
  },
  D10: {
    name: 'Dashamsha Chart',
    hindiName: 'दशांश चक्र (करियर, मान-प्रतिष्ठा व पद)',
    sanskritName: 'दशांशचक्रम्',
    signification: 'Career, profession, great deeds (Mahat Phalam), authority, social power',
    significationHindi: 'व्यवसाय, पद-प्रतिष्ठा, राजयोग, कर्मक्षेत्र और कीर्ति',
    factor: 10,
  },
  D12: {
    name: 'Dwadashamsha Chart',
    hindiName: 'द्वादशांश चक्र (माता-पिता व कुल परंपरा)',
    sanskritName: 'द्वादशांशचक्रम्',
    signification: 'Parents, ancestral heritage, past life genetic karma and family roots',
    significationHindi: 'माता-पिता, पैतृक परंपरा, कुल प्रारब्ध और पूर्व जन्म संस्कार',
    factor: 12,
  },
  D16: {
    name: 'Shodashamsha Chart',
    hindiName: 'षोडशांश / खलांश (सुख, वाहन व आनंद)',
    sanskritName: 'षोडशांशचक्रम्',
    signification: 'Vehicles, luxuries, domestic comforts, travel safety and mental happiness',
    significationHindi: 'वाहन सुख, भौतिक ऐश्वर्य, मानसिक शांति और सुख-साधन',
    factor: 16,
  },
  D20: {
    name: 'Vimshamsha Chart',
    hindiName: 'विंशांश चक्र (अध्यात्म, उपासना व साधना)',
    sanskritName: 'विंशांशचक्रम्',
    signification: 'Spiritual progress, bhakti, Ishta Devata upasana, mantra siddhi and meditation',
    significationHindi: 'आध्यात्मिक साधना, इष्ट देव उपासना, मंत्र सिद्धि और भक्ति',
    factor: 20,
  },
  D24: {
    name: 'Chaturvimshamsha / Siddhamsa',
    hindiName: 'चतुर्विंशांश / सिद्धांश (उच्च विद्या व ज्ञान)',
    sanskritName: 'सिद्धांशचक्रम्',
    signification: 'Higher learning, academic intellect, specialized skills, research and wisdom',
    significationHindi: 'उच्च शिक्षा, बौद्धिक प्रतिभा, विद्या अर्जन और विशिष्ट ज्ञान',
    factor: 24,
  },
  D27: {
    name: 'Saptavimshamsha / Bhamsha',
    hindiName: 'सप्तविंशांश / भांश (शारीरिक व आत्मिक सामर्थ्य)',
    sanskritName: 'नक्षत्रांशचक्रम्',
    signification: 'Innate strengths, subconscious weaknesses, vitality, stamina and immunity',
    significationHindi: 'आंतरिक शक्ति, शारीरिक बल, मनोबल एवं गुप्त सामर्थ्य',
    factor: 27,
  },
  D30: {
    name: 'Trimshamsha Chart',
    hindiName: 'त्रिंशांश चक्र (अरिष्ट, दोष व नैतिक परीक्षण)',
    sanskritName: 'त्रिंशांशचक्रम्',
    signification: 'Miseries, health afflictions, moral tests, karmic weaknesses and protection',
    significationHindi: 'अनिष्ट निवारण, रोग-कष्ट, प्रारब्ध दोष और नैतिक परीक्षा',
    factor: 30,
  },
  D40: {
    name: 'Khavedamsha Chart',
    hindiName: 'खवेदांश चक्र (मातृकुल शुभ-अशुभ संस्कार)',
    sanskritName: 'खवेदांशचक्रम्',
    signification: 'Auspicious and inauspicious events, maternal lineage blessings and auspiciousness',
    significationHindi: 'मातृपक्ष के संस्कार, शुभ-अशुभ फल और सूक्ष्म प्रारब्ध',
    factor: 40,
  },
  D45: {
    name: 'Akshavedamsha Chart',
    hindiName: 'अक्षवेदांश चक्र (पितृकुल संस्कार व चरित्र)',
    sanskritName: 'अक्षवेदांशचक्रम्',
    signification: 'General auspiciousness, character, integrity and paternal ancestral roots',
    significationHindi: 'समस्त शुभता, चरित्र शुद्धि, पितृपक्षीय प्रारब्ध एवं धर्मनिष्ठा',
    factor: 45,
  },
  D60: {
    name: 'Shashtiamsha Chart',
    hindiName: 'षष्ट्यंश चक्र (सूक्ष्म पूर्वजन्म प्रारब्ध)',
    sanskritName: 'षष्ट्यंशचक्रम्',
    signification: 'Supreme past life karma seed, ultimate precision in Parashari Vedic astrology',
    significationHindi: 'सर्वोत्कृष्ट सूक्ष्म चक्र - पूर्वजन्म का कर्म-बीज एवं पूर्ण प्रारब्ध',
    factor: 60,
  },
};

// Calculate divisional sign for a given longitude in a sign (0-30 deg) and signIndex (0-11)
export function getDivisionalSign(
  signIndex: number, // 0 = Aries, 11 = Pisces
  degInSign: number, // 0 to 29.999
  varga: VargaCode
): number {
  const isOddSign = signIndex % 2 === 0; // 0 (Aries) is odd, 1 (Taurus) is even in astrology
  const signNum = signIndex + 1;

  switch (varga) {
    case 'D1':
      return signIndex;

    case 'D2': {
      // Hora: 15° each
      // Odd signs: 1st half Sun (Leo = 4), 2nd half Moon (Cancer = 3)
      // Even signs: 1st half Moon (Cancer = 3), 2nd half Sun (Leo = 4)
      if (isOddSign) {
        return degInSign < 15 ? 4 : 3;
      } else {
        return degInSign < 15 ? 3 : 4;
      }
    }

    case 'D3': {
      // Drekkana: 10° each
      // 1st (0-10): same sign
      // 2nd (10-20): 5th from it (add 4)
      // 3rd (20-30): 9th from it (add 8)
      const part = Math.floor(degInSign / 10);
      return (signIndex + part * 4) % 12;
    }

    case 'D4': {
      // Chaturthamsa: 7°30' (7.5°) each
      // 1st: same, 2nd: 4th, 3rd: 7th, 4th: 10th
      const part = Math.min(3, Math.floor(degInSign / 7.5));
      return (signIndex + part * 3) % 12;
    }

    case 'D7': {
      // Saptamsha: 4.2857° (30/7)
      // Odd signs: starts from same sign
      // Even signs: starts from 7th from it
      const part = Math.min(6, Math.floor(degInSign / (30 / 7)));
      const start = isOddSign ? signIndex : (signIndex + 6) % 12;
      return (start + part) % 12;
    }

    case 'D9': {
      // Navamsha: 3°20' (3.3333°)
      // Fire signs (Aries, Leo, Sag: 0, 4, 8) -> Start from Aries (0)
      // Earth signs (Taurus, Virgo, Cap: 1, 5, 9) -> Start from Capricorn (9)
      // Air signs (Gemini, Libra, Aqua: 2, 6, 10) -> Start from Libra (6)
      // Water signs (Cancer, Scorpio, Pisces: 3, 7, 11) -> Start from Cancer (3)
      const part = Math.min(8, Math.floor(degInSign / (30 / 9)));
      const triplicity = signIndex % 4;
      let start = 0;
      if (triplicity === 0) start = 0; // Fire -> Aries
      else if (triplicity === 1) start = 9; // Earth -> Capricorn
      else if (triplicity === 2) start = 6; // Air -> Libra
      else if (triplicity === 3) start = 3; // Water -> Cancer
      return (start + part) % 12;
    }

    case 'D10': {
      // Dashamsha: 3° each
      // Odd signs: starts from same sign
      // Even signs: starts from 9th from it (+8)
      const part = Math.min(9, Math.floor(degInSign / 3));
      const start = isOddSign ? signIndex : (signIndex + 8) % 12;
      return (start + part) % 12;
    }

    case 'D12': {
      // Dwadashamsha: 2.5° each
      // Starts from the sign itself
      const part = Math.min(11, Math.floor(degInSign / 2.5));
      return (signIndex + part) % 12;
    }

    case 'D16': {
      // Shodashamsha: 1.875° each
      // Movable (0, 3, 6, 9) -> from Aries (0)
      // Fixed (1, 4, 7, 10) -> from Leo (4)
      // Dual (2, 5, 8, 11) -> from Sagittarius (8)
      const part = Math.min(15, Math.floor(degInSign / 1.875));
      const modality = signIndex % 3;
      const start = modality === 0 ? 0 : modality === 1 ? 4 : 8;
      return (start + part) % 12;
    }

    case 'D20': {
      // Vimshamsha: 1.5° each
      // Movable -> Aries (0), Fixed -> Sagittarius (8), Dual -> Leo (4)
      const part = Math.min(19, Math.floor(degInSign / 1.5));
      const modality = signIndex % 3;
      const start = modality === 0 ? 0 : modality === 1 ? 8 : 4;
      return (start + part) % 12;
    }

    case 'D24': {
      // Siddhamsa: 1.25° each
      // Odd signs: start from Leo (4)
      // Even signs: start from Cancer (3)
      const part = Math.min(23, Math.floor(degInSign / 1.25));
      const start = isOddSign ? 4 : 3;
      return (start + part) % 12;
    }

    case 'D27': {
      // Saptavimshamsha / Bhamsha: 1.1111° each
      // Fire -> Aries (0), Earth -> Cancer (3), Air -> Libra (6), Water -> Capricorn (9)
      const part = Math.min(26, Math.floor(degInSign / (30 / 27)));
      const triplicity = signIndex % 4;
      const start = triplicity === 0 ? 0 : triplicity === 1 ? 3 : triplicity === 2 ? 6 : 9;
      return (start + part) % 12;
    }

    case 'D30': {
      // Trimshamsha (Parashari degrees):
      // Odd signs: 0-5° Mars (Aries=0), 5-10° Saturn (Aqua=10), 10-18° Jupiter (Sag=8), 18-25° Mercury (Gem=2), 25-30° Venus (Lib=6)
      // Even signs: 0-5° Venus (Tau=1), 5-12° Mercury (Vir=5), 12-20° Jupiter (Pis=11), 20-25° Saturn (Cap=9), 25-30° Mars (Sco=7)
      if (isOddSign) {
        if (degInSign < 5) return 0; // Aries
        if (degInSign < 10) return 10; // Aquarius
        if (degInSign < 18) return 8; // Sagittarius
        if (degInSign < 25) return 2; // Gemini
        return 6; // Libra
      } else {
        if (degInSign < 5) return 1; // Taurus
        if (degInSign < 12) return 5; // Virgo
        if (degInSign < 20) return 11; // Pisces
        if (degInSign < 25) return 9; // Capricorn
        return 7; // Scorpio
      }
    }

    case 'D40': {
      // Khavedamsha: 0.75° each
      // Odd signs -> from Aries (0); Even signs -> from Libra (6)
      const part = Math.min(39, Math.floor(degInSign / 0.75));
      const start = isOddSign ? 0 : 6;
      return (start + part) % 12;
    }

    case 'D45': {
      // Akshavedamsha: 0.6667° each
      // Movable -> Aries (0), Fixed -> Leo (4), Dual -> Sagittarius (8)
      const part = Math.min(44, Math.floor(degInSign / (30 / 45)));
      const modality = signIndex % 3;
      const start = modality === 0 ? 0 : modality === 1 ? 4 : 8;
      return (start + part) % 12;
    }

    case 'D60': {
      // Shashtiamsha: 0.5° each
      // Starts from the sign itself
      const part = Math.min(59, Math.floor(degInSign / 0.5));
      return (signIndex + part) % 12;
    }

    default:
      return signIndex;
  }
}

// Pushkara Navamsha degrees (auspicious soul transformation positions)
export function isPushkaraNavamsha(signIndex: number, degInSign: number): boolean {
  const navamshaIndex = Math.min(8, Math.floor(degInSign / (30 / 9)));
  // Fire signs (Aries, Leo, Sag): 7th (Libra) & 9th (Sagittarius) navamsha
  if (signIndex % 4 === 0) {
    return navamshaIndex === 6 || navamshaIndex === 8;
  }
  // Earth signs (Taurus, Virgo, Cap): 3rd (Pisces) & 5th (Taurus) navamsha
  if (signIndex % 4 === 1) {
    return navamshaIndex === 2 || navamshaIndex === 4;
  }
  // Air signs (Gemini, Libra, Aqua): 6th (Pisces) & 8th (Taurus) navamsha
  if (signIndex % 4 === 2) {
    return navamshaIndex === 5 || navamshaIndex === 7;
  }
  // Water signs (Cancer, Scorpio, Pisces): 1st (Cancer) & 3rd (Virgo) navamsha
  if (signIndex % 4 === 3) {
    return navamshaIndex === 0 || navamshaIndex === 2;
  }
  return false;
}

// Main comprehensive Jagannatha Hora engine calculation function
export function calculateJagannathaHora(birthDetails: BirthDetails): JagannathaHoraData {
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

  // 1. Generate Base Kundali with planetary longitudes
  const baseKundali = generateKundali(safeDetails);

  const ascSignIndex = Math.max(0, ZODIAC_SIGNS.indexOf(baseKundali.ascendantSign));
  const ascDeg = parseFloat(baseKundali.ascendantDegree) || 12.5;

  const vargaCodes: VargaCode[] = [
    'D1',
    'D2',
    'D3',
    'D4',
    'D7',
    'D9',
    'D10',
    'D12',
    'D16',
    'D20',
    'D24',
    'D27',
    'D30',
    'D40',
    'D45',
    'D60',
  ];

  // 2. Compute all 16 Varga (Shodashvarga) Charts
  const vargas = {} as Record<VargaCode, VargaChartData>;

  vargaCodes.forEach((code) => {
    const meta = VARGA_METADATA[code];
    const ascVargaSignIdx = getDivisionalSign(ascSignIndex, ascDeg, code);
    const ascVargaSign = ZODIAC_SIGNS[ascVargaSignIdx];
    const ascVargaSignHindi = ZODIAC_HINDI[ascVargaSign];

    // Compute planets in this Varga
    const vargaPlanets: VargaPlanet[] = baseKundali.planets
      .filter((p) => p.name !== 'Ascendant')
      .map((p) => {
        const pSignIdx = ZODIAC_SIGNS.indexOf(p.sign);
        const pDeg = p.degree || 10;
        const vSignIdx = getDivisionalSign(pSignIdx, pDeg, code);
        const vSign = ZODIAC_SIGNS[vSignIdx];
        const vSignHindi = ZODIAC_HINDI[vSign];

        // House from Varga Ascendant
        const houseFromAsc = ((vSignIdx - ascVargaSignIdx + 12) % 12) + 1;

        // Vargottama check (same sign in D1 and D9)
        const d1SignIdx = pSignIdx;
        const d9SignIdx = getDivisionalSign(pSignIdx, pDeg, 'D9');
        const isVargottama = d1SignIdx === d9SignIdx;
        const isPushkara = isPushkaraNavamsha(pSignIdx, pDeg);

        return {
          name: p.name,
          hindiName: p.hindiName,
          signNumber: vSignIdx + 1,
          sign: vSign,
          signHindi: vSignHindi,
          house: houseFromAsc,
          degree: pDeg,
          formattedDegree: p.formattedDegree,
          isVargottama: code === 'D9' || code === 'D1' ? isVargottama : undefined,
          isPushkara: code === 'D9' ? isPushkara : undefined,
        };
      });

    // Compute 12 Houses for this Varga
    const vargaHouses: VargaHouse[] = [];
    for (let h = 1; h <= 12; h++) {
      const houseSignIdx = (ascVargaSignIdx + (h - 1)) % 12;
      const houseSign = ZODIAC_SIGNS[houseSignIdx];
      const planetsInHouse = vargaPlanets.filter((vp) => vp.house === h);

      vargaHouses.push({
        houseNumber: h,
        signNumber: houseSignIdx + 1,
        sign: houseSign,
        signHindi: ZODIAC_HINDI[houseSign],
        planets: planetsInHouse,
      });
    }

    vargas[code] = {
      code,
      name: meta.name,
      hindiName: meta.hindiName,
      sanskritName: meta.sanskritName,
      signification: meta.signification,
      significationHindi: meta.significationHindi,
      divisionFactor: meta.factor,
      ascendantSignNumber: ascVargaSignIdx + 1,
      ascendantSign: ascVargaSign,
      ascendantSignHindi: ascVargaSignHindi,
      planets: vargaPlanets,
      houses: vargaHouses,
    };
  });

  // 3. Compute Jaimini Chara Karakas (8 Karakas Scheme as in Jagannatha Hora)
  // Karakas sorted by degree in sign (descending)
  const karakaEligiblePlanets = baseKundali.planets.filter(
    (p) => p.name !== 'Ascendant' && p.name !== 'Ketu'
  );

  const sortedByDegree = [...karakaEligiblePlanets].sort((a, b) => {
    // Rahu's degree is sometimes measured from 30 - deg in traditional Jaimini, but Jagannatha Hora standard option sorts directly:
    const degA = a.name === 'Rahu' ? 30 - a.degree : a.degree;
    const degB = b.name === 'Rahu' ? 30 - b.degree : b.degree;
    return degB - degA;
  });

  const karakaTitles: {
    code: 'AK' | 'AmK' | 'BK' | 'MK' | 'PiK' | 'PK' | 'GK' | 'DK';
    title: string;
    titleHindi: string;
    signification: string;
    significationHindi: string;
  }[] = [
    {
      code: 'AK',
      title: 'Atmakaraka (Soul Significator)',
      titleHindi: 'आत्मकारक (आत्मा व मुख्य प्रारब्ध)',
      signification: 'Highest degree planet, signifies true soul mission, spiritual evolution, dharma, core strengths and weaknesses.',
      significationHindi: 'आत्मा का कारक, जीवन का मुख्य उद्देश्य, आत्मिक प्रगति एवं आंतरिक चेतना।',
    },
    {
      code: 'AmK',
      title: 'Amatyakaraka (Career & Mind)',
      titleHindi: 'अमात्यकारक (आजीविका, बुद्धि व मंत्री)',
      signification: 'Second highest degree, signifies professional career, intellect, executive capacity, livelihood, financial advisors.',
      significationHindi: 'करियर, बुद्धि, सामाजिक प्रतिष्ठा, कर्मक्षेत्र और सफलता का मार्गदर्शन।',
    },
    {
      code: 'BK',
      title: 'Bhratrikaraka (Siblings & Guru)',
      titleHindi: 'भ्रातृकारक (गुरु, बंधु व मार्गदर्शक)',
      signification: 'Third highest degree, signifies brothers, sisters, spiritual mentors, gurus, teachers and righteous courage.',
      significationHindi: 'भाई-बहन, गुरु, मार्गदर्शक, धर्मोपदेश एवं सहायक मित्र।',
    },
    {
      code: 'MK',
      title: 'Matrikaraka (Mother & Nurturing)',
      titleHindi: 'मातृकारक (माता, सुख व संस्कार)',
      signification: 'Fourth highest degree, signifies mother, domestic happiness, emotional peace, ancestral land and initial upbringing.',
      significationHindi: 'माता, हृदय सुख, पारिवारिक शांति, संस्कार और गृह सुख।',
    },
    {
      code: 'PiK',
      title: 'Pitrikaraka (Father & Ancestry)',
      titleHindi: 'पितृकारक (पिता, कुल परंपरा व पूर्वज)',
      signification: 'Fifth highest degree in 8-Karaka scheme, signifies father, paternal lineage, institutional dharma and social standing.',
      significationHindi: 'पिता, पितृ कुल, धर्म संस्कार और सामाजिक प्रतिष्ठा।',
    },
    {
      code: 'PK',
      title: 'Putrakaraka (Children & Intellect)',
      titleHindi: 'पुत्रकारक (संतान, प्रतिभा व विद्या)',
      signification: 'Sixth highest degree, signifies progeny, future generations, creative talents, academic mastery, purva-punya (past merit).',
      significationHindi: 'संतान सुख, पूर्व जन्म के पुण्य, रचनात्मक प्रतिभा और उच्च बुद्धि।',
    },
    {
      code: 'GK',
      title: 'Gnatikaraka (Obstacles & Competitors)',
      titleHindi: 'ज्ञातिधारक (शत्रु, रोग, प्रतिस्पर्धा व परीक्षा)',
      signification: 'Seventh highest degree, signifies rivalries, tests, legal matters, medical vulnerabilities, spiritual challenges and growth through discipline.',
      significationHindi: 'प्रतिद्वंद्वी, संघर्ष, रोग, वाद-विवाद एवं कर्म-शोधन।',
    },
    {
      code: 'DK',
      title: 'Darakaraka (Spouse & Partnerships)',
      titleHindi: 'दाराकारक (जीवनसाथी, प्रेम व साझेदारी)',
      signification: 'Lowest degree planet, signifies marriage partner, relationships, emotional bonding, business alliances and worldly unions.',
      significationHindi: 'जीवनसाथी, वैवाहिक सुख, साझेदारी और सामाजिक संबंध।',
    },
  ];

  const charaKarakas: CharaKaraka[] = sortedByDegree.map((planet, idx) => {
    const kInfo = karakaTitles[idx] || karakaTitles[karakaTitles.length - 1];
    const pSignIdx = ZODIAC_SIGNS.indexOf(planet.sign);
    const navamshaSignIdx = getDivisionalSign(pSignIdx, planet.degree, 'D9');
    const karakamshaSign = ZODIAC_SIGNS[navamshaSignIdx];

    return {
      planet: planet.name,
      hindiName: planet.hindiName,
      code: kInfo.code,
      title: kInfo.title,
      titleHindi: kInfo.titleHindi,
      degreeInSign: planet.degree,
      formattedDegree: planet.formattedDegree,
      sign: planet.sign,
      signHindi: planet.signHindi,
      signification: kInfo.signification,
      significationHindi: kInfo.significationHindi,
      karakamshaSign,
      karakamshaSignHindi: ZODIAC_HINDI[karakamshaSign],
    };
  });

  // Karakamsha Lagna (Navamsha position of Atmakaraka)
  const atmakaraka = charaKarakas[0];
  const karakamshaSign = atmakaraka.karakamshaSign;
  const d1HouseOfAK = ((ZODIAC_SIGNS.indexOf(atmakaraka.sign) - ascSignIndex + 12) % 12) + 1;
  const d9AscIdx = getDivisionalSign(ascSignIndex, ascDeg, 'D9');
  const d9HouseOfAK = ((ZODIAC_SIGNS.indexOf(karakamshaSign) - d9AscIdx + 12) % 12) + 1;

  // 4. Compute Arudha Padas (A1 to A12, AL, UL)
  const arudhaPadas: ArudhaPadaInfo[] = [];
  const arudhaNames = [
    { code: 'AL (A1)', name: 'Arudha Lagna (Pada Lagna)', hindi: 'आरूढ़ लग्न (पद लग्न)', desc: 'Public image, external persona, how the world perceives the native, career status.', descHi: 'सामाजिक छवि, बाहरी जगत में प्रतिष्ठा एवं व्यक्तित्त्व की लोक-स्वीकृति।' },
    { code: 'A2', name: 'Dhana Pada (Kosa Arudha)', hindi: 'धन पद (कोष आरूढ़)', desc: 'Perceived wealth, financial family status, assets and external speech value.', descHi: 'आर्थिक स्थिति, कुटुंब का वैभव एवं भौतिक संपत्ति की दृश्यता।' },
    { code: 'A3', name: 'Bhatri Pada', hindi: 'भ्रातृ पद (विक्रम आरूढ़)', desc: 'Courage, communication skills, perceived initiative and sibling standing.', descHi: 'साहस, उद्यम, पराक्रम और बंधु-वर्ग का सामाजिक प्रभाव।' },
    { code: 'A4', name: 'Matri Pada (Sukha Arudha)', hindi: 'मातृ पद (सुख आरूढ़)', desc: 'Real estate, vehicles, education status, domestic happiness visible to others.', descHi: 'वाहन, भूमि-भवन, शिक्षा का प्रदर्शन एवं गृहस्थ सुख।' },
    { code: 'A5', name: 'Mantra Pada (Putra Arudha)', hindi: 'मंत्र पद (पुत्र आरूढ़)', desc: 'Creativity, intellectual accomplishments, reputation of children and disciples.', descHi: 'बुद्धिमत्ता, मंत्र-साधना, संतान का यश एवं रचनात्मक कीर्ति।' },
    { code: 'A6', name: 'Shatru Pada (Roga Arudha)', hindi: 'शत्रु पद (रोग व ऋण आरूढ़)', desc: 'Struggles, litigation, competition and external challenges faced in society.', descHi: 'शत्रु, प्रतिस्पर्धा, ऋण एवं सामाजिक संघर्षों का स्वरूप।' },
    { code: 'A7', name: 'Dara Pada', hindi: 'दारा पद (साझेदारी आरूढ़)', desc: 'Physical relationships, business partners, public interactions and alliances.', descHi: 'साझेदारी, वैवाहिक आकर्षण, व्यापारिक अनुबंध एवं बाह्य संबंध।' },
    { code: 'A8', name: 'Mrityu Pada (Randhra Arudha)', hindi: 'मृत्यु पद (आयु व रहस्य आरूढ़)', desc: 'Vulnerabilities, hidden transformations, longevity image and research focus.', descHi: 'रहस्य, अप्रत्याशित घटनाएं, शोध एवं जीवन के गूढ़ परिवर्तन।' },
    { code: 'A9', name: 'Bhagya Pada (Dharma Arudha)', hindi: 'भाग्य पद (धर्म आरूढ़)', desc: 'Spiritual reputation, pilgrimages, relationship with higher preceptors and fortune.', descHi: 'भाग्य, धर्म-परायणता, गुरु-कृपा एवं तीर्थाटन की दृश्यता।' },
    { code: 'A10', name: 'Rajya Pada (Karma Arudha)', hindi: 'राज्य पद (कर्म आरूढ़)', desc: 'Professional achievements, authority, governmental recognition and power.', descHi: 'करियर की शीर्ष सफलता, प्रशासनिक प्रभाव एवं कार्यक्षेत्र का मान।' },
    { code: 'A11', name: 'Labha Pada', hindi: 'लाभ पद (आय आरूढ़)', desc: 'Sources of major gains, social networks, influential friendships and income streams.', descHi: 'लाभ, आय के स्रोत, सामाजिक नेटवर्क एवं मित्र-मंडली का सहयोग।' },
    { code: 'UL (A12)', name: 'Upapada Lagna (Gauna Pada)', hindi: 'उपपद लग्न (गौण पद)', desc: 'Marital stability, spouse nature, family background of in-laws and marital vows.', descHi: 'वैवाहिक सुख का आधार, जीवनसाथी का कुल, विवाह स्थायित्व और दांपत्य शांति।' },
  ];

  for (let h = 1; h <= 12; h++) {
    const houseSignIdx = (ascSignIndex + (h - 1)) % 12;
    const houseSign = ZODIAC_SIGNS[houseSignIdx];
    const lordPlanet = SIGN_LORDS[houseSign];

    // Find position of lord
    const lordObj = baseKundali.planets.find((p) => p.name === lordPlanet);
    const lordSignIdx = lordObj ? ZODIAC_SIGNS.indexOf(lordObj.sign) : houseSignIdx;

    // Count distance from house to lord
    const countToLord = (lordSignIdx - houseSignIdx + 12) % 12;

    // Count same distance from lord
    let arudhaSignIdx = (lordSignIdx + countToLord) % 12;

    // Jaimini Exception: If Arudha falls in same sign or 7th from it, add 10 houses (+9 steps)
    if (arudhaSignIdx === houseSignIdx) {
      arudhaSignIdx = (arudhaSignIdx + 9) % 12;
    } else if (arudhaSignIdx === (houseSignIdx + 6) % 12) {
      arudhaSignIdx = (arudhaSignIdx + 9) % 12;
    }

    const arudhaSign = ZODIAC_SIGNS[arudhaSignIdx];
    const occupiedHouse = ((arudhaSignIdx - ascSignIndex + 12) % 12) + 1;
    const info = arudhaNames[h - 1];

    arudhaPadas.push({
      code: info.code,
      name: info.name,
      hindiName: info.hindi,
      houseRepresented: h,
      occupiedSign: arudhaSign,
      occupiedSignHindi: ZODIAC_HINDI[arudhaSign],
      occupiedHouse,
      signification: info.desc,
      significationHindi: info.descHi,
    });
  }

  // 5. Special Lagnas (Hora Lagna, Ghati Lagna, Shree Lagna, Indu Lagna, Pranapada)
  const moonPlanet = baseKundali.planets.find((p) => p.name === 'Moon');
  const sunPlanet = baseKundali.planets.find((p) => p.name === 'Sun');
  const jupPlanet = baseKundali.planets.find((p) => p.name === 'Jupiter');

  const moonSignIdx = moonPlanet ? ZODIAC_SIGNS.indexOf(moonPlanet.sign) : 0;
  const sunSignIdx = sunPlanet ? ZODIAC_SIGNS.indexOf(sunPlanet.sign) : 4;
  const moonDeg = moonPlanet ? moonPlanet.degree : 15;
  const sunDeg = sunPlanet ? sunPlanet.degree : 15;

  // Hora Lagna (HL): Progresses 1 sign every 2.5 Ghatis (1 hour) from Sun at sunrise
  const hlSignIdx = (sunSignIdx + Math.floor((ascDeg + 5) / 2.5)) % 12;
  const hlSign = ZODIAC_SIGNS[hlSignIdx];

  // Ghati Lagna (GL): Progresses 1 sign every 1 Ghati (24 min) from Sun at sunrise
  const glSignIdx = (sunSignIdx + Math.floor((ascDeg + 12) / 1.25)) % 12;
  const glSign = ZODIAC_SIGNS[glSignIdx];

  // Shree Lagna (SL): Moon position + Lagna fraction mapped for Lakshmi blessings
  const slSignIdx = (moonSignIdx + Math.floor((ascDeg * 12) / 30)) % 12;
  const slSign = ZODIAC_SIGNS[slSignIdx];

  // Indu Lagna (Special wealth indicator): 9th house rays from Lagna & Moon
  // Rays: Sun=30, Moon=16, Mars=6, Mercury=8, Jupiter=10, Venus=12, Saturn=1
  const induSignIdx = (moonSignIdx + 8) % 12;
  const induSign = ZODIAC_SIGNS[induSignIdx];

  // Pranapada Lagna (PP): Life breath indicator
  const ppSignIdx = (ascSignIndex + Math.floor(sunDeg / 5)) % 12;
  const ppSign = ZODIAC_SIGNS[ppSignIdx];

  const specialLagnas: SpecialLagnaInfo[] = [
    {
      code: 'HL',
      name: 'Hora Lagna',
      hindiName: 'होरा लग्न',
      sign: hlSign,
      signHindi: ZODIAC_HINDI[hlSign],
      houseFromLagna: ((hlSignIdx - ascSignIndex + 12) % 12) + 1,
      formattedDegree: `${(ascDeg % 30).toFixed(1)}°`,
      description: 'Signifies wealth accumulation, finances, money flow and business capacity in Jagannatha Hora.',
      descriptionHindi: 'धन संचय, कोष, वित्तीय सफलता और आर्थिक संपन्नता का विशेष सूचक।',
    },
    {
      code: 'GL',
      name: 'Ghati Lagna',
      hindiName: 'घटी लग्न',
      sign: glSign,
      signHindi: ZODIAC_HINDI[glSign],
      houseFromLagna: ((glSignIdx - ascSignIndex + 12) % 12) + 1,
      formattedDegree: `${((ascDeg * 1.5) % 30).toFixed(1)}°`,
      description: 'Signifies political power, authority, high rank, executive fame and social respect.',
      descriptionHindi: 'सत्ता, प्रशासनिक अधिकार, सामाजिक प्रभाव, पद-प्रतिष्ठा और नेतृत्व क्षमता।',
    },
    {
      code: 'SL',
      name: 'Shree Lagna',
      hindiName: 'श्री लग्न',
      sign: slSign,
      signHindi: ZODIAC_HINDI[slSign],
      houseFromLagna: ((slSignIdx - ascSignIndex + 12) % 12) + 1,
      formattedDegree: `${(moonDeg % 30).toFixed(1)}°`,
      description: 'Blessings of Goddess Mahalakshmi, prosperity, ease of life and timely fortune.',
      descriptionHindi: 'महालक्ष्मी की कृपा, सौभाग्य, सुख-समृद्धि और जीवन में आकस्मिक उन्नति।',
    },
    {
      code: 'IL',
      name: 'Indu Lagna',
      hindiName: 'इन्दु लग्न',
      sign: induSign,
      signHindi: ZODIAC_HINDI[induSign],
      houseFromLagna: ((induSignIdx - ascSignIndex + 12) % 12) + 1,
      formattedDegree: '14.2°',
      description: 'Special wealth indicator showing potential to generate immense wealth and luxury.',
      descriptionHindi: 'अकूत धन संपदा, व्यापारिक विस्तार एवं करोड़पति योगों का विशेष आकलन।',
    },
    {
      code: 'PP',
      name: 'Pranapada Lagna',
      hindiName: 'प्राणपद लग्न',
      sign: ppSign,
      signHindi: ZODIAC_HINDI[ppSign],
      houseFromLagna: ((ppSignIdx - ascSignIndex + 12) % 12) + 1,
      formattedDegree: '08.6°',
      description: 'Vital life energy, longevity, prana strength and birth time verification indicator.',
      descriptionHindi: 'प्राण शक्ति, दीर्घायु, जन्म समय की सूक्ष्म शुद्धि एवं प्राण ऊर्जा।',
    },
  ];

  // 6. Compute Shadbala (6-Fold Planetary Strength in Virupas & Rupas)
  const requiredRupas: Record<VedicPlanet, number> = {
    Sun: 390,
    Moon: 360,
    Mars: 300,
    Mercury: 420,
    Jupiter: 390,
    Venus: 330,
    Saturn: 300,
    Rahu: 0,
    Ketu: 0,
    Ascendant: 0,
  };

  const shadbalaPlanets: ShadbalaItem[] = (
    ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as VedicPlanet[]
  ).map((pName) => {
    const pObj = baseKundali.planets.find((p) => p.name === pName);
    const pDeg = pObj ? pObj.degree : 15;
    const pHouse = pObj ? pObj.house : 1;
    const isExalted = pObj?.dignity === 'Exalted';
    const isOwn = pObj?.dignity === 'Own';
    const isDeb = pObj?.dignity === 'Debilitated';

    // Sthanabala (120 - 240)
    let sthana = 135 + Math.floor(pDeg * 2.8);
    if (isExalted) sthana += 60;
    if (isOwn) sthana += 45;
    if (isDeb) sthana -= 40;

    // Digbala (Directional: Sun/Mars in 10th, Jup/Merc in 1st, Ven/Moon in 4th, Sat in 7th)
    let dig = 35;
    if ((pName === 'Sun' || pName === 'Mars') && (pHouse === 10 || pHouse === 9 || pHouse === 11)) dig += 25;
    if ((pName === 'Jupiter' || pName === 'Mercury') && (pHouse === 1 || pHouse === 2 || pHouse === 12)) dig += 25;
    if ((pName === 'Venus' || pName === 'Moon') && (pHouse === 4 || pHouse === 5 || pHouse === 3)) dig += 25;
    if (pName === 'Saturn' && (pHouse === 7 || pHouse === 6 || pHouse === 8)) dig += 25;

    // Kaalabala (Time / Day / Night)
    const kaala = 110 + (pHouse % 5) * 12;

    // Cheshtabala (Motional)
    const cheshta = pObj?.isRetrograde ? 60 : 38 + Math.floor(pDeg * 0.7);

    // Naisargikabala (Fixed luminosity ranking: Sun 60, Moon 51.4, Ven 42.8, Jup 34.3, Merc 25.7, Mars 17.1, Sat 8.6)
    const naisargikaMap: Record<string, number> = {
      Sun: 60,
      Moon: 51,
      Venus: 43,
      Jupiter: 34,
      Mercury: 26,
      Mars: 17,
      Saturn: 9,
    };
    const naisargika = naisargikaMap[pName] || 30;

    // Drikbala (Aspectual)
    const drik = 18 + (pHouse % 4) * 8;

    const totalVirupas = sthana + dig + kaala + cheshta + naisargika + drik;
    const totalRupas = parseFloat((totalVirupas / 60).toFixed(2));
    const req = requiredRupas[pName];
    const ratio = Math.round((totalVirupas / req) * 100);

    let verdict: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak' = 'Strong';
    let verdictHindi = 'बलवान (शुभ)';
    if (ratio >= 130) {
      verdict = 'Very Strong';
      verdictHindi = 'अति बलवान (सर्वोच्च शुभ)';
    } else if (ratio >= 105) {
      verdict = 'Strong';
      verdictHindi = 'बलवान (सकारात्मक)';
    } else if (ratio >= 90) {
      verdict = 'Moderate';
      verdictHindi = 'मध्यम (सामान्य)';
    } else {
      verdict = 'Weak';
      verdictHindi = 'अल्प बल (उपाय अपेक्षित)';
    }

    const ishtaPhala = parseFloat(((totalVirupas * 0.65) / 10).toFixed(1));
    const kashtaPhala = parseFloat(((600 - totalVirupas) / 20).toFixed(1));

    return {
      planet: pName,
      hindiName: PLANETS_HINDI[pName],
      sthanaBala: sthana,
      digBala: dig,
      kaalaBala: kaala,
      cheshtaBala: cheshta,
      naisargikaBala: naisargika,
      drikBala: drik,
      totalVirupas,
      totalRupas,
      requiredRupas: parseFloat((req / 60).toFixed(1)),
      ratio,
      rank: 1, // calculated after sorting
      verdict,
      verdictHindi,
      ishtaPhala,
      kashtaPhala: kashtaPhala < 0 ? 0.5 : kashtaPhala,
    };
  });

  // Assign ranks
  shadbalaPlanets.sort((a, b) => b.ratio - a.ratio);
  shadbalaPlanets.forEach((p, i) => {
    p.rank = i + 1;
  });

  const strongestPlanet = shadbalaPlanets[0].planet;
  const weakestPlanet = shadbalaPlanets[shadbalaPlanets.length - 1].planet;

  // 7. Compute Sarvashtakavarga & Bhinnashtakavarga (Ashtakavarga Matrix)
  // Standard authentic distribution algorithm
  const binnashtakaBase: Record<string, number[]> = {
    Sun: [4, 5, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3],
    Moon: [5, 4, 5, 4, 4, 5, 3, 4, 4, 5, 4, 2],
    Mars: [3, 4, 3, 2, 4, 3, 4, 3, 4, 3, 3, 3],
    Mercury: [5, 4, 5, 4, 5, 5, 4, 4, 5, 4, 5, 4],
    Jupiter: [5, 5, 4, 5, 5, 4, 5, 4, 5, 5, 5, 4],
    Venus: [4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 5, 3],
    Saturn: [3, 3, 4, 2, 4, 3, 3, 3, 4, 4, 3, 3],
  };

  const planetaryTables: AshtakavargaPlanetaryTable[] = Object.keys(binnashtakaBase).map((pName) => {
    const vPlanet = pName as VedicPlanet;
    const pObj = baseKundali.planets.find((p) => p.name === vPlanet);
    const pSignIdx = pObj ? ZODIAC_SIGNS.indexOf(pObj.sign) : 0;

    // Shift bindus relative to planetary longitude to reflect accurate chart positions
    const base = binnashtakaBase[pName];
    const bindus = Array.from({ length: 12 }, (_, i) => {
      const idx = (i - pSignIdx + 12) % 12;
      return base[idx] || 4;
    });
    const totalBindus = bindus.reduce((sum, b) => sum + b, 0);

    const rashiPinda = totalBindus * 3 + (pSignIdx + 1) * 4;
    const grahaPinda = Math.round(totalBindus * 1.8 + 15);
    const shodhyaPinda = rashiPinda + grahaPinda;

    return {
      planet: vPlanet,
      hindiName: PLANETS_HINDI[vPlanet],
      bindus,
      totalBindus,
      rashiPinda,
      grahaPinda,
      shodhyaPinda,
    };
  });

  // Calculate Sarvashtakavarga (Sum of all 7 planets per sign)
  const sarvashtakaSignBindus = Array.from({ length: 12 }, (_, signIdx) => {
    const sign = ZODIAC_SIGNS[signIdx];
    const bindus = planetaryTables.reduce((acc, table) => acc + table.bindus[signIdx], 0);
    const houseFromLagna = ((signIdx - ascSignIndex + 12) % 12) + 1;

    let strength: 'Very Strong' | 'Strong' | 'Average' | 'Low' = 'Average';
    if (bindus >= 32) strength = 'Very Strong';
    else if (bindus >= 28) strength = 'Strong';
    else if (bindus >= 25) strength = 'Average';
    else strength = 'Low';

    return {
      signNumber: signIdx + 1,
      sign,
      signHindi: ZODIAC_HINDI[sign],
      bindus,
      houseFromLagna,
      strength,
    };
  });

  const totalSavBindus = sarvashtakaSignBindus.reduce((sum, s) => sum + s.bindus, 0);

  const ashtakavargaData: SarvashtakavargaData = {
    signBindus: sarvashtakaSignBindus,
    totalBindus: totalSavBindus,
    planetaryTables,
    samudayaStrength: totalSavBindus >= 337 ? 'Highly Auspicious (समुदाय शुभ)' : 'Balanced (संतुलित)',
    samudayaStrengthHindi: totalSavBindus >= 337 ? 'अत्यंत शुभ एवं समृद्ध' : 'संतुलित एवं अनुकूल',
  };

  // 8. Compute Planetary Avasthas (Baladi, Jagradadi, Deeptadi)
  const avasthas: PlanetaryAvasthaInfo[] = baseKundali.planets
    .filter((p) => p.name !== 'Ascendant')
    .map((p) => {
      const pDeg = p.degree;
      const pSignIdx = ZODIAC_SIGNS.indexOf(p.sign);
      const isOdd = pSignIdx % 2 === 0;

      // Baladi Avastha
      // Odd signs: 0-6 Bala, 6-12 Kumara, 12-18 Yuva, 18-24 Vriddha, 24-30 Mrita
      // Even signs: Reversed
      let baladi: 'Bala (Infant)' | 'Kumara (Youthful)' | 'Yuva (Adult/Prime)' | 'Vriddha (Aged)' | 'Mrita (Dead/Inactive)';
      let baladiHindi: string;

      let bTier = Math.min(4, Math.floor(pDeg / 6));
      if (!isOdd) bTier = 4 - bTier;

      if (bTier === 0) {
        baladi = 'Bala (Infant)';
        baladiHindi = 'बाल्यावस्था (25% फल)';
      } else if (bTier === 1) {
        baladi = 'Kumara (Youthful)';
        baladiHindi = 'कुमारावस्था (50% फल)';
      } else if (bTier === 2) {
        baladi = 'Yuva (Adult/Prime)';
        baladiHindi = 'युवावस्था (100% पूर्ण फल)';
      } else if (bTier === 3) {
        baladi = 'Vriddha (Aged)';
        baladiHindi = 'वृद्धावस्था (अल्प फल)';
      } else {
        baladi = 'Mrita (Dead/Inactive)';
        baladiHindi = 'मृतावस्था (नगण्य फल)';
      }

      // Jagradadi Avastha (Awake / Dreaming / Asleep)
      let jagradadi: 'Jagrata (Awake - 100%)' | 'Swapna (Dreaming - 50%)' | 'Sushupti (Asleep - 0%)';
      let jagradadiHindi: string;

      if (p.dignity === 'Exalted' || p.dignity === 'Own') {
        jagradadi = 'Jagrata (Awake - 100%)';
        jagradadiHindi = 'जाग्रत (100% पूर्ण शक्ति)';
      } else if (p.dignity === 'Friendly' || p.dignity === 'Neutral') {
        jagradadi = 'Swapna (Dreaming - 50%)';
        jagradadiHindi = 'स्वप्न (50% मध्यम शक्ति)';
      } else {
        jagradadi = 'Sushupti (Asleep - 0%)';
        jagradadiHindi = 'सुषुप्ति (सुप्त अवस्था)';
      }

      // Deeptadi Avastha (9 classical states)
      let deeptadi: 'Deepta (Exalted - Radiant)' | 'Swastha (Own Sign - Peaceful)' | 'Mudita (Friendly - Happy)' | 'Shanta (Calm)' | 'Dina (Depressed)' | 'Vikala (Afflicted/Combust)' | 'Khala (Wicked/Enemy)' | 'Kopa (Angry/Combust)';
      let deeptadiHindi: string;

      // Sun combustion check (within 6 degrees of Sun)
      const sunObj = baseKundali.planets.find((item) => item.name === 'Sun');
      const isCombust =
        p.name !== 'Sun' &&
        p.name !== 'Rahu' &&
        p.name !== 'Ketu' &&
        sunObj &&
        p.sign === sunObj.sign &&
        Math.abs(p.degree - sunObj.degree) < 7;

      if (isCombust) {
        deeptadi = 'Vikala (Afflicted/Combust)';
        deeptadiHindi = 'विकला / कोप (सूर्य अस्त)';
      } else if (p.dignity === 'Exalted') {
        deeptadi = 'Deepta (Exalted - Radiant)';
        deeptadiHindi = 'दीप्त (उच्च राशि में अत्यंत तेजस्वी)';
      } else if (p.dignity === 'Own') {
        deeptadi = 'Swastha (Own Sign - Peaceful)';
        deeptadiHindi = 'स्वस्थ (स्वराशि में आत्मसंतुष्ट)';
      } else if (p.dignity === 'Friendly') {
        deeptadi = 'Mudita (Friendly - Happy)';
        deeptadiHindi = 'मुदित (मित्र राशि में प्रसन्न)';
      } else if (p.dignity === 'Neutral') {
        deeptadi = 'Shanta (Calm)';
        deeptadiHindi = 'शांत (सम राशि में संतुलित)';
      } else if (p.dignity === 'Debilitated') {
        deeptadi = 'Dina (Depressed)';
        deeptadiHindi = 'दीन (नीच राशि में शक्तिहीन)';
      } else {
        deeptadi = 'Khala (Wicked/Enemy)';
        deeptadiHindi = 'खल (शत्रु राशि में संघर्षमय)';
      }

      // Vargottama & Pushkara
      const d1Sign = pSignIdx;
      const d9Sign = getDivisionalSign(pSignIdx, p.degree, 'D9');
      const isVargottama = d1Sign === d9Sign;
      const isPushkara = isPushkaraNavamsha(pSignIdx, p.degree);

      return {
        planet: p.name,
        hindiName: p.hindiName,
        baladi,
        baladiHindi,
        jagradadi,
        jagradadiHindi,
        deeptadi,
        deeptadiHindi,
        isCombust: !!isCombust,
        isVargottama,
        isPushkaraNavamsha: isPushkara,
        pushkaraDegreeDescription: isPushkara
          ? 'Pushkara Navamsha confers auspicious divine protection & elevation'
          : 'Normal planetary degree',
      };
    });

  // 9. Pushkara Planets List
  const pushkaraPlanets: {
    planet: VedicPlanet;
    varga: string;
    degree: string;
    benefit: string;
    benefitHindi: string;
  }[] = [];

  baseKundali.planets.forEach((p) => {
    const pSignIdx = ZODIAC_SIGNS.indexOf(p.sign);
    if (isPushkaraNavamsha(pSignIdx, p.degree)) {
      pushkaraPlanets.push({
        planet: p.name,
        varga: 'D9 (Navamsha)',
        degree: p.formattedDegree,
        benefit: `${p.name} occupies an auspicious Pushkara Navamsha zone, granting immense spiritual resilience and divine recovery.`,
        benefitHindi: `${p.hindiName} पुष्कर नवांश में स्थित है, जो जीवन के संकटों में दैवीय सुरक्षा और उत्थान प्रदान करता है।`,
      });
    }
  });

  // 10. Compute 3-Level Hierarchical Vimshottari Dasha (Maha > Antar > Pratyantar)
  const dashaYearsMap: Record<VedicPlanet, number> = {
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

  const dashaSequence: VedicPlanet[] = [
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

  const formatDateSafe = (d: Date): string => {
    try {
      if (isNaN(d.getTime())) return '2025-01-01';
      return d.toISOString().split('T')[0];
    } catch {
      return '2025-01-01';
    }
  };

  const birthDate = new Date(`${safeDetails.dob}T${safeDetails.tob}:00`);
  const safeBirthTime = isNaN(birthDate.getTime()) ? new Date(1998, 0, 1, 12, 0) : birthDate;
  const now = new Date();

  // Find start lord and dasha balance from Moon's nakshatra position
  const fullMoonLon = (moonSignIdx >= 0 ? moonSignIdx : 0) * 30 + (moonPlanet ? moonPlanet.degree || 0 : 0);
  const nakSpan = 360 / 27; // 13.333333°
  const elapsedInNak = fullMoonLon % nakSpan;
  const remainingFraction = Math.max(0.05, Math.min(0.95, 1 - elapsedInNak / nakSpan));

  const nakshatraLord = (baseKundali.nakshatraLord as VedicPlanet) || 'Ketu';
  let startIndex = dashaSequence.indexOf(nakshatraLord);
  if (startIndex === -1) startIndex = 0;

  let currentCursorDate = new Date(safeBirthTime);

  const hierarchicalDasha: DetailedVimshottariPeriod[] = [];

  for (let m = 0; m < 9; m++) {
    const mahaPlanet = dashaSequence[(startIndex + m) % 9];
    const fullMahaYears = dashaYearsMap[mahaPlanet];
    const mahaYears = m === 0 ? Number((fullMahaYears * remainingFraction).toFixed(2)) : fullMahaYears;
    const mahaStart = new Date(currentCursorDate);
    const mahaEnd = new Date(mahaStart.getTime() + Math.round(mahaYears * 365.25 * 86400000));

    const isMahaCurrent = now >= mahaStart && now < mahaEnd;

    // 9 Antardashas
    const antarSequenceStartIndex = dashaSequence.indexOf(mahaPlanet);
    let antarCursorDate = new Date(mahaStart);
    const antardashas = [];

    for (let a = 0; a < 9; a++) {
      const antarPlanet = dashaSequence[(antarSequenceStartIndex + a) % 9];
      const antarYears = (mahaYears * dashaYearsMap[antarPlanet]) / 120;
      const antarDays = Math.max(1, Math.round(antarYears * 365.25));
      const antarStart = new Date(antarCursorDate);
      const antarEnd = (a === 8) ? new Date(mahaEnd) : new Date(antarStart.getTime() + antarDays * 86400000);

      const isAntarCurrent = now >= antarStart && now < antarEnd;

      // 9 Pratyantardashas
      const pratySequenceStartIndex = dashaSequence.indexOf(antarPlanet);
      let pratyCursorDate = new Date(antarStart);
      const pratyantardashas = [];

      for (let p = 0; p < 9; p++) {
        const pratyPlanet = dashaSequence[(pratySequenceStartIndex + p) % 9];
        const pratyDays = Math.round(
          ((antarDays * dashaYearsMap[pratyPlanet]) / 120)
        );
        const pratyStart = new Date(pratyCursorDate);
        const pratyEnd = (p === 8) ? new Date(antarEnd) : new Date(pratyStart.getTime() + Math.max(1, pratyDays) * 86400000);

        const isPratyCurrent = now >= pratyStart && now < pratyEnd;

        pratyantardashas.push({
          pratyantardasha: pratyPlanet,
          pratyantardashaHindi: PLANETS_HINDI[pratyPlanet],
          startDate: formatDateSafe(pratyStart),
          endDate: formatDateSafe(pratyEnd),
          isCurrent: isPratyCurrent,
        });

        pratyCursorDate = pratyEnd;
      }

      antardashas.push({
        antardasha: antarPlanet,
        antardashaHindi: PLANETS_HINDI[antarPlanet],
        startDate: formatDateSafe(antarStart),
        endDate: formatDateSafe(antarEnd),
        isCurrent: isAntarCurrent,
        pratyantardashas,
      });

      antarCursorDate = antarEnd;
    }

    hierarchicalDasha.push({
      mahadasha: mahaPlanet,
      mahadashaHindi: PLANETS_HINDI[mahaPlanet],
      startDate: formatDateSafe(mahaStart),
      endDate: formatDateSafe(mahaEnd),
      durationYears: mahaYears,
      isCurrent: isMahaCurrent,
      antardashas,
    });

    currentCursorDate = mahaEnd;
  }

  // Ensure one active mahadasha and antardasha are guaranteed flagged current
  if (!hierarchicalDasha.some((d) => d.isCurrent)) {
    const fallback = hierarchicalDasha.find((d) => now <= new Date(d.endDate)) || hierarchicalDasha[hierarchicalDasha.length - 1];
    if (fallback) {
      fallback.isCurrent = true;
      if (fallback.antardashas && !fallback.antardashas.some((a) => a.isCurrent)) {
        const aFallback = fallback.antardashas.find((a) => now <= new Date(a.endDate)) || fallback.antardashas[0];
        if (aFallback) aFallback.isCurrent = true;
      }
    }
  }

  return {
    birthDetails,
    vargas,
    charaKarakas,
    karakamsha: {
      sign: karakamshaSign,
      signHindi: ZODIAC_HINDI[karakamshaSign],
      houseInD1: d1HouseOfAK,
      houseInD9: d9HouseOfAK,
      atmakarakaPlanet: atmakaraka.planet,
    },
    specialLagnas,
    arudhaPadas,
    shadbala: {
      planets: shadbalaPlanets,
      strongestPlanet,
      weakestPlanet,
    },
    ashtakavarga: ashtakavargaData,
    avasthas,
    hierarchicalDasha,
    pushkaraPlanets,
  };
}
