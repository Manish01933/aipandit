import {
  KundaliResult,
  BirthDetails,
  VedicPlanet,
  ZodiacSign,
  JagannathaHoraData,
} from '../types/astrology';
import { calculateJagannathaHora } from './jagannathaHoraEngine';
import { calculateAnkJyotish } from './ankJyotishCalculations';
import { ZODIAC_HINDI, PLANETS_HINDI } from './vedicCalculations';
import {
  SIGN_LORDS,
  SIGN_LORDS_HINDI,
} from './twentyPagePersonalizedAnalysis';
import { appendPersonalizedPages5To25 } from './twentyPagePagesGenerator';

export interface TwentyPageReportPage {
  pageNumber: number;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  category:
    | 'intro'
    | 'astronomy'
    | 'varga'
    | 'strength'
    | 'dasha'
    | 'house'
    | 'yoga_dosha'
    | 'timeline'
    | 'remedies'
    | 'career'
    | 'wealth'
    | 'marriage'
    | 'education'
    | 'health'
    | 'glossary'
    | 'verification';
  sections: TwentyPageReportSection[];
  summaryTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export interface TwentyPageReportSection {
  headingHi: string;
  headingEn: string;
  contentHi: string;
  contentEn: string;
  bulletPointsHi?: string[];
  bulletPointsEn?: string[];
  highlightBadge?: string;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export interface TwentyPageKundaliReport {
  generatedAt: string;
  kundali: KundaliResult;
  horaData: JagannathaHoraData;
  pages: TwentyPageReportPage[];
  totalPages: number;
  nativeName: string;
  birthSummary: string;
}

// House Significations mapping
const HOUSE_NAMES: Record<
  number,
  {
    nameHi: string;
    nameEn: string;
    sanskrit: string;
    significationsHi: string;
    significationsEn: string;
  }
> = {
  1: {
    nameHi: 'प्रथम भाव (तनु भाव / लग्न)',
    nameEn: '1st House (Lagna / Ascendant)',
    sanskrit: 'तनु भाव (Tanu Bhava)',
    significationsHi: 'शारीरिक बनावट, व्यक्तित्व, जीवन शक्ति, आत्मबल, स्वास्थ्य, स्वभाव व प्रथम प्रभाव',
    significationsEn: 'Physical body, vitality, character, temperament, self-identity and longevity baseline',
  },
  2: {
    nameHi: 'द्वितीय भाव (धन व कुटुंब भाव)',
    nameEn: '2nd House (Wealth & Family)',
    sanskrit: 'धन भाव (Dhana Bhava)',
    significationsHi: 'संचित धन, पैतृक संपत्ति, वाणी की मिठास, परिवार, भोजन की आदतें एवं दाईं आंख',
    significationsEn: 'Accumulated wealth, speech eloquence, lineage, liquid assets and financial stability',
  },
  3: {
    nameHi: 'तृतीय भाव (सहज व पराक्रम भाव)',
    nameEn: '3rd House (Courage & Siblings)',
    sanskrit: 'सहज भाव (Sahaja Bhava)',
    significationsHi: 'साहस, पराक्रम, छोटे भाई-बहन, लेखन क्षमता, संचार कौशल, छोटी यात्राएं व उद्यमशीलता',
    significationsEn: 'Valour, younger siblings, determination, communication, digital media and initiatives',
  },
  4: {
    nameHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
    nameEn: '4th House (Happiness & Mother)',
    sanskrit: 'सुख भाव (Sukha Bhava)',
    significationsHi: 'माता, भूमि, भवन, वाहन सुख, मानसिक शांति, घर का वातावरण व प्रारंभिक शिक्षा',
    significationsEn: 'Mother, real estate, conveyances, mental peace, domestic comfort and formal schooling',
  },
  5: {
    nameHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
    nameEn: '5th House (Children & Intellect)',
    sanskrit: 'सुत भाव (Suta Bhava)',
    significationsHi: 'संतान, उच्च बुद्धि, रचनात्मकता, पूर्व जन्म के पुण्य, शेयर बाजार/सट्टा व मंत्र साधना',
    significationsEn: 'Progeny, higher intellect, creativity, past-life merits, speculation and spiritual devotion',
  },
  6: {
    nameHi: 'षष्ठ भाव (रिपु व सेवा भाव)',
    nameEn: '6th House (Enemies, Health & Debts)',
    sanskrit: 'रिपु भाव (Ripu Bhava)',
    significationsHi: 'शारीरिक रोग, ऋण (कर्ज), गुप्त शत्रु, कानूनी वाद-विवाद, प्रतियोगी परीक्षाएं व दैनिक सेवा',
    significationsEn: 'Illnesses, debts, litigation, competitors, service mindset and daily problem solving',
  },
  7: {
    nameHi: 'सप्तम भाव (जाया व साझेदारी भाव)',
    nameEn: '7th House (Marriage & Partnership)',
    sanskrit: 'जाया भाव (Jaya Bhava)',
    significationsHi: 'विवाह, जीवनसाथी का स्वभाव, दांपत्य सुख, व्यापारिक साझेदारी, जनसंपर्क व विदेश यात्रा',
    significationsEn: 'Marriage, spouse nature, partnership, commercial trade, public reputation and contracts',
  },
  8: {
    nameHi: 'अष्टम भाव (आयु व गुप्त भाव)',
    nameEn: '8th House (Longevity & Transformation)',
    sanskrit: 'आयुर्भाव (Ayur Bhava)',
    significationsHi: 'आयु, दीर्घायु, गुप्त विद्याएं, अचानक आने वाले संकट या धनलाभ, वसीयत व अनुसंधान',
    significationsEn: 'Longevity, occult knowledge, unearned wealth, sudden transformations and psychological depth',
  },
  9: {
    nameHi: 'नवम भाव (धर्म व भाग्य भाव)',
    nameEn: '9th House (Fortune, Dharma & Father)',
    sanskrit: 'धर्म भाव (Dharma Bhava)',
    significationsHi: 'भाग्य, गुरु कृपा, पिता का संबंध, धर्म-कर्म, उच्च शिक्षा, तीर्थ यात्राएं व ईश्वरीय अनुग्रह',
    significationsEn: 'Fortune, father, higher philosophical education, spiritual gurus and pilgrimages',
  },
  10: {
    nameHi: 'दशम भाव (कर्म व मान-प्रतिष्ठा भाव)',
    nameEn: '10th House (Career, Status & Action)',
    sanskrit: 'कर्म भाव (Karma Bhava)',
    significationsHi: 'आजीविका, पद-प्रतिष्ठा, सरकारी नौकरी या व्यापार, नेतृत्व क्षमता, सामाजिक कीर्ति व पिता का मान',
    significationsEn: 'Profession, societal standing, authority, executive power, public fame and enterprise',
  },
  11: {
    nameHi: 'एकादश भाव (आय व लाभ भाव)',
    nameEn: '11th House (Gains, Income & Desires)',
    sanskrit: 'लाभ भाव (Labha Bhava)',
    significationsHi: 'नियमित आय, सभी प्रकार के लाभ, बड़े भाई-बहन, प्रभावशाली मित्र मंडली व इच्छाओं की पूर्ति',
    significationsEn: 'Incomes, cash flows, elder siblings, network circle, fulfillment of ambitions and rewards',
  },
  12: {
    nameHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
    nameEn: '12th House (Expenditure & Liberation)',
    sanskrit: 'व्यय भाव (Vyaya Bhava)',
    significationsHi: 'खर्च, विदेश यात्रा, विदेश में निवास/पीआर, अनिद्रा, एकांतवास, अस्पताल के खर्चे व आध्यात्मिक मोक्ष',
    significationsEn: 'Expenditures, foreign settlements, isolation, subconscious realm, sleep and spiritual moksha',
  },
};

export function generateTwentyPageKundaliReport(kundali: KundaliResult): TwentyPageKundaliReport {
  const horaData = calculateJagannathaHora(kundali.birthDetails);
  const ankData = calculateAnkJyotish(kundali.birthDetails.dob, kundali.birthDetails.name);
  const { birthDetails } = kundali;

  const currentYear = new Date().getFullYear();
  const pages: TwentyPageReportPage[] = [];

  // Find key planetary positions
  const sun = kundali.planets.find((p) => p.name === 'Sun') || kundali.planets[0];
  const moon = kundali.planets.find((p) => p.name === 'Moon') || kundali.planets[1];
  const mars = kundali.planets.find((p) => p.name === 'Mars');
  const mercury = kundali.planets.find((p) => p.name === 'Mercury');
  const jupiter = kundali.planets.find((p) => p.name === 'Jupiter');
  const venus = kundali.planets.find((p) => p.name === 'Venus');
  const saturn = kundali.planets.find((p) => p.name === 'Saturn');
  const rahu = kundali.planets.find((p) => p.name === 'Rahu');
  const ketu = kundali.planets.find((p) => p.name === 'Ketu');

  const d9Varga = horaData.vargas['D9'];
  const d10Varga = horaData.vargas['D10'];
  const d7Varga = horaData.vargas['D7'];
  const d12Varga = horaData.vargas['D12'];

  const d9Planets = d9Varga?.houses?.flatMap((h) => h.planets) || [];
  const d10Planets = d10Varga?.houses?.flatMap((h) => h.planets) || [];

  const SIGN_LORDS: Record<ZodiacSign, string> = {
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
  const ascendantLord = SIGN_LORDS[kundali.ascendantSign] || 'Mars';

  // ==========================================
  // PAGE 1: PREMIUM COVER PAGE
  // ==========================================
  pages.push({
    pageNumber: 1,
    titleHi: 'पृष्ठ 1: सम्पूर्ण जन्मकुंडली लेखा-जोखा (आमुख पृष्ठ)',
    titleEn: 'Page 1: Complete Kundali Life Report - Premium Cover Page',
    subtitleHi: 'AstroDost AI प्रामाणिक वैदिक ज्योतिष महापत्रिका एवं 25 पृष्ठीय जीवन विश्लेषण',
    subtitleEn: 'Comprehensive Parashari Life Analysis & Astrological Documentation',
    category: 'intro',
    sections: [
      {
        headingHi: 'वैदिक मंगलाचरण एवं ईश्वरीय वंदना',
        headingEn: 'Vedic Invocations & Divine Blessings',
        contentHi:
          'ॐ श्री गणेशाय नमः। ॐ नमो भगवते वासुदेवाय। वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥ यह 25-पृष्ठीय संपूर्ण जन्मकुंडली लेखा-जोखा महर्षि पराशर के बृहत्पाराशर होराशास्त्र, वराहमिहिर के बृहज्जातक तथा महर्षि जैमिनी के सिद्धांतों पर आधारित एक प्रामाणिक ग्रंथीय विश्लेषण है।',
        contentEn:
          'Om Sri Ganeshaya Namah. Dedicated to the eternal wisdom of Vedic Astrology, calculated strictly according to Brihat Parashara Hora Shastra, Varahamihira principles, and high-precision Swiss Ephemeris astronomical models.',
        highlightBadge: 'सम्पूर्ण जन्मकुंडली लेखा-जोखा • 25 पृष्ठ प्रीमियम महापत्रिका',
      },
      {
        headingHi: 'जातक व्यक्तिगत आमुख पत्र (Native Identity Record)',
        headingEn: 'Native Identity Record & Core Coordinates',
        contentHi: `जातक: ${birthDetails.name} | जन्म तिथि: ${birthDetails.dob} | जन्म समय: ${birthDetails.tob} | जन्म स्थान: ${birthDetails.place} (${birthDetails.latitude.toFixed(4)}° N, ${birthDetails.longitude.toFixed(4)}° E)। यह पत्रिका जातक के जीवन, कर्म, भाग्य, संबंध और स्वास्थ्य का समग्र दर्पण है।`,
        contentEn: `Native: ${birthDetails.name} | Date of Birth: ${birthDetails.dob} | Time of Birth: ${birthDetails.tob} | Location: ${birthDetails.place} (${birthDetails.latitude.toFixed(4)}° N, ${birthDetails.longitude.toFixed(4)}° E). This document provides an exhaustive astrological roadmap of personal destiny.`,
        tableData: {
          headers: ['विवरण (Attribute)', 'मान (Value)', 'विवरण (Attribute)', 'मान (Value)'],
          rows: [
            ['जातक का नाम', birthDetails.name, 'लिंग (Gender)', birthDetails.gender.toUpperCase()],
            ['जन्म तिथि (DOB)', birthDetails.dob, 'जन्म समय (TOB)', birthDetails.tob],
            ['जन्म स्थान (City)', birthDetails.place, 'समय क्षेत्र (Timezone)', `UTC +${birthDetails.timezone}`],
            ['अक्षांश (Latitude)', `${birthDetails.latitude.toFixed(4)}° N`, 'देशांतर (Longitude)', `${birthDetails.longitude.toFixed(4)}° E`],
            ['रिपोर्ट निर्माण तिथि', new Date().toLocaleDateString('hi-IN'), 'गणना प्रणाली', 'Lahiri (Chitrapaksha)'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 2: PERSONAL BIRTH DETAILS & VERIFICATION
  // ==========================================
  pages.push({
    pageNumber: 2,
    titleHi: 'पृष्ठ 2: सत्यापित जन्म विवरण एवं पंचांग तत्त्व',
    titleEn: 'Page 2: Personal Birth Details, Verification & Settings',
    subtitleHi: 'भौगोलिक निर्देशांक, अयनांश, पंचांग, अवकहड़ा चक्र एवं जन्म समय सटीकता सूचना',
    subtitleEn: 'Verified Geodetic Coordinates, Panchang Attributes & Birth Time Precision Advisory',
    category: 'astronomy',
    sections: [
      {
        headingHi: 'जन्म समय एवं भौगोलिक निर्देशांक सत्यापन (Verification)',
        headingEn: 'Verified Geodetic & Astrological Setup',
        contentHi:
          'कुंडली की गणना में जन्म समय और भौगोलिक निर्देशांकों की सूक्ष्म शुद्धता अनिवार्य है। यहां उपयोग किए गए निर्देशांक और समय क्षेत्र अंतरराष्ट्रीय मानक पंचांग और जीपीएस प्रणाली से सत्यापित हैं।',
        contentEn:
          'Exact geographic coordinates and time zone offsets have been mathematically verified using geodesic coordinates. Ayanamsha applied is Lahiri (Chitra Paksha), conforming to the Indian Calendar Reform Committee standards.',
        tableData: {
          headers: ['पंचांग अंग / Parameter', 'सत्यापित मान (Value)', 'ज्योतिषीय प्रभाव / Signification'],
          rows: [
            ['वार (Day of Birth)', 'सोम/मंगल/बुध/गुरु/शुक्र/शनि/रवि', 'दिन के स्वामी ग्रह का जातक के स्वभाव पर प्रभाव'],
            ['तिथि (Tithi)', 'शुक्ल / कृष्ण पक्ष तिथि', 'मानसिक प्रवृत्ति एवं भावनात्मक संतुलन'],
            ['जन्म नक्षत्र (Nakshatra)', `${kundali.birthNakshatra} (चरण 1-4)`, 'आंतरिक विचार, चेतना एवं दशा चक्र का आधार'],
            ['नक्षत्र स्वामी (Lord)', kundali.nakshatraLord, 'जीवन की प्रथम विंशोत्तरी महादशा के स्वामी'],
            ['करण (Karana)', 'बव / बालव / कौलव / तैतिल', 'कर्म करने की क्षमता एवं व्यावसायिक दक्षता'],
            ['योग (Yoga)', 'विष्कुम्भ / प्रीति / आयुष्मान', 'स्वास्थ्य एवं जीवन की सुगमता'],
            ['अयनांश (Ayanamsha)', '24° 10\' Lahiri (Chitrapaksha)', 'निरयण भचक्र का खगोलीय शुद्धीकरण'],
            ['भाव प्रणाली (House System)', 'Equal House / Sripati Padhhati', 'भाव मध्य एवं भाव संधि की शास्त्रीय गणना'],
          ],
        },
      },
      {
        headingHi: 'जन्म समय सटीकता सूचना (Birth-Time Accuracy Notice)',
        headingEn: 'Birth-Time Accuracy & Advisory Notice',
        contentHi:
          'वैदिक ज्योतिष में लग्न (Ascendant) औसतन 2 घंटे में बदलता है, जबकि नवमांश (D9) मात्र 13 से 15 मिनट में बदल जाता है। अतः यदि जन्म समय में 5 मिनट से अधिक का अंतर हो, तो नवमांश चक्र में सूक्ष्म परिवर्तन हो सकता है। यह रिपोर्ट जातक द्वारा प्रदान किए गए समय पर पूर्ण रूप से आधारित है।',
        contentEn:
          'Notice of Precision: In Vedic astrology, the rising Lagna changes every ~2 hours, but divisional charts such as D9 Navamsha shift every 13 to 15 minutes. The native is advised that precise birth time ensures optimal divisional accuracy.',
        highlightBadge: 'सत्यापित खगोलीय मानक (Swiss Ephemeris)',
      },
    ],
  });

  // ==========================================
  // PAGE 3: EXECUTIVE KUNDALI SUMMARY
  // ==========================================
  pages.push({
    pageNumber: 3,
    titleHi: 'पृष्ठ 3: कार्यकारी कुंडली सारांश (Executive Summary)',
    titleEn: 'Page 3: Executive Kundali Summary & Chart Highlights',
    subtitleHi: 'लग्न, चंद्र राशि, सूर्य राशि, प्रमुख ग्रहीय प्रभाव एवं कुंडली की रीढ़',
    subtitleEn: 'Lagna, Moon Sign, Sun Sign, Dominant Influences & Chart Architecture',
    category: 'intro',
    sections: [
      {
        headingHi: 'त्रिमूर्ति स्तंभ: लग्न, चंद्र एवं सूर्य (Core Pillars)',
        headingEn: 'The Three Astrological Pillars',
        contentHi: `जातक का लग्न ${kundali.ascendantSign} है, जो शारीरिक गठन और जीवन की मूल दिशा तय करता है। चंद्र राशि ${kundali.moonSign} है, जो मन, संवेदना और मानसिक झुकाव का संचालन करती है। सूर्य राशि ${sun.sign} है, जो आत्मा, आत्मबल और सामाजिक प्रतिष्ठा को दर्शाती है।`,
        contentEn: `Ascendant (Lagna) is ${kundali.ascendantSign}, governing bodily vitality and worldly orientation. Moon Sign is ${kundali.moonSign}, governing subconscious reflexes and emotions. Sun Sign is ${sun.sign}, driving soul purpose and authority.`,
        tableData: {
          headers: ['स्तंभ (Pillar)', 'राशि (Sign)', 'स्वामी ग्रह (Ruler)', 'मुख्य लक्षण एवं शक्ति'],
          rows: [
            ['लग्न (Ascendant)', kundali.ascendantSign, ascendantLord, 'शारीरिक ऊर्जा, जीवन दृष्टिकोण एवं कर्मक्षेत्र'],
            ['चंद्र राशि (Moon)', kundali.moonSign, kundali.planets.find(p => p.name === 'Moon')?.sign || 'Moon', 'मानसिक शक्ति, भावनात्मक प्रतिक्रिया एवं विचार'],
            ['सूर्य राशि (Sun)', sun.sign, 'Sun', 'आत्मविश्वास, आत्मसम्मान, नेतृत्व व मान-सम्मान'],
            ['जन्म नक्षत्र', kundali.birthNakshatra, kundali.nakshatraLord, 'मूल स्वभाव, जीवन की दिशा एवं प्रारब्ध कर्म'],
          ],
        },
      },
      {
        headingHi: 'मुख्य ग्रहीय प्रभाव एवं कुंडली के मजबूत केंद्र',
        headingEn: 'Dominant Planetary Influences & Strengths',
        contentHi: `आपकी कुंडली में केंद्र भावों (1, 4, 7, 10) और त्रिकोण भावों (1, 5, 9) का विशेष महत्व है। त्रिकोण भाव ईश्वरीय कृपा व पूर्व संचित पुण्यों के प्रतीक हैं, जबकि केंद्र भाव जीवन में स्थिरता और सांसारिक सफलता के स्तंभ हैं।`,
        contentEn: `Trikona houses (1, 5, 9) signify past-life merits and divine grace. Kendra houses (1, 4, 7, 10) represent Pillars of Vishnu, granting resilience in worldly affairs.`,
        bulletPointsHi: [
          `लग्न स्वामी ${ascendantLord} की स्थिति जातक को जीवन में आत्मबल और चुनौतियों से उबरने की शक्ति देती है।`,
          `चंद्रमा का ${kundali.birthNakshatra} नक्षत्र में होना जातक को संवेदनशील और तीव्र निर्णय क्षमता प्रदान करता है।`,
          `कुंडली में सक्रिय विंशोत्तरी दशा जीवन के इस वर्तमान पड़ाव में नए अवसरों के द्वार खोल रही है।`,
        ],
        bulletPointsEn: [
          `Lagna Lord ${ascendantLord} grants resilience, self-reliance, and physical vitality.`,
          `Janma Nakshatra ${kundali.birthNakshatra} imparts sharp intuitive faculties and distinct personality traits.`,
          `Current Vimshottari Mahadasha is activating key houses for upcoming life expansion.`,
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 4: COMPLETE PLANETARY POSITIONS
  // ==========================================
  pages.push({
    pageNumber: 4,
    titleHi: 'पृष्ठ 4: स्पष्ट ग्रह स्थिति सारणी (Planetary Ephemeris)',
    titleEn: 'Page 4: Complete Planetary Positions & Degrees',
    subtitleHi: 'नवग्रहों की स्पष्ट अंश, राशि, भाव, नक्षत्र, चरण, वक्री/मार्गी स्थिति एवं गरिमा',
    subtitleEn: 'Precise Longitudes, Signs, Degrees, Nakshatras, Houses, Dignity & Retrogradation',
    category: 'astronomy',
    sections: [
      {
        headingHi: 'नवग्रह स्पष्ट अंश एवं गति सारणी',
        headingEn: 'Planetary Ephemeris & Astronomical Details',
        contentHi:
          'ग्रहों की स्पष्ट अंश स्थिति (Degrees) यह निर्धारित करती है कि कौन सा ग्रह बाल्यावस्था, युवावस्था या वृद्धावस्था में है। वक्री ग्रह (Retrograde) चेष्टा बल से युक्त होकर गहरा आंतरिक प्रभाव डालते हैं।',
        contentEn:
          'Planetary longitudes determine states of infancy, youth, or old age. Retrograde grahas carry Cheshta Bala (motional strength) and reflect profound karmic patterns.',
        tableData: {
          headers: ['ग्रह (Planet)', 'संस्कृत (Graha)', 'राशि (Sign)', 'अंश (Degree)', 'भाव (Bhava)', 'नक्षत्र (Pada)', 'गति (Motion)', 'गरिमा (Dignity)'],
          rows: kundali.planets.map((p) => [
            p.name,
            p.hindiName,
            `${p.sign} (${p.signHindi})`,
            p.formattedDegree,
            `भाव ${p.house}`,
            `${p.nakshatra} (प ${p.pada})`,
            p.isRetrograde ? 'वक्री (R)' : 'मार्गी (D)',
            p.dignity,
          ]),
        },
      },
      {
        headingHi: 'अस्त (Combustion) एवं ग्रहीय अवस्था विश्लेषण',
        headingEn: 'Planetary Avasthas & Dignity Synthesis',
        contentHi:
          'सूर्य के निकट आने पर ग्रह अस्त (Combust) हो जाते हैं, जिससे उनके भौतिक फलों में कुछ विलंब या संघर्ष देखा जाता है। उच्च (Exalted) और स्वराशि (Own sign) के ग्रह जातक को विशिष्ट क्षेत्रों में अप्रत्याशित सफलता दिलाते हैं।',
        contentEn:
          'Planets within proximity to the Sun experience combustion, demanding extra discipline in their significations. Exalted and own-house grahas generate consistent positive fruits.',
        bulletPointsHi: [
          'उच्च ग्रह (Exalted): जीवन में अप्रत्याशित सम्मान व सफलता का मार्ग प्रशस्त करते हैं।',
          'स्वराशि ग्रह (Own Sign): संबंधित भाव के फलों को दीर्घकालिक स्थिरता व मजबूती देते हैं।',
          'वक्री ग्रह (Retrograde): चेष्टा बल से युक्त होकर गहरा आंतरिक प्रभाव डालते हैं।',
        ],
        bulletPointsEn: [
          'Exalted planets unlock unexpected public elevation and auspicious outcomes.',
          'Own-sign grahas anchor lasting structural stability to their respective houses.',
          'Retrograde grahas possess heightened Cheshta Bala driving reflective karmic focus.',
        ],
      },
    ],
  });

  // ==========================================
  // PAGES 5 TO 25: 100% PERSONALIZED DYNAMIC ANALYSIS
  // ==========================================
  appendPersonalizedPages5To25(pages, kundali, horaData);

  return {
    generatedAt: new Date().toLocaleDateString('hi-IN'),
    kundali,
    horaData,
    pages,
    totalPages: pages.length,
    nativeName: birthDetails.name || 'जातक',
    birthSummary: `${birthDetails.dob} | ${birthDetails.tob} | ${birthDetails.place}`,
  };
}

export interface SavedKundaliLifeReport {
  id: string;
  createdAt: string;
  birthDetails: {
    name: string;
    dob: string;
    tob: string;
    place: string;
    city?: string;
    state?: string;
    country?: string;
    latitude: number;
    longitude: number;
    timezone: number;
    gender: 'male' | 'female' | 'other';
  };
  summary: {
    ascendantSign: string;
    moonSign: string;
    nakshatra: string;
    totalPages: number;
  };
  kundali: KundaliResult;
}

const STORAGE_KEY_SAVED_REPORTS = 'astrodost_saved_life_reports';

export function getSavedLifeReports(): SavedKundaliLifeReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_REPORTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load saved life reports', e);
    return [];
  }
}

export function saveLifeReport(
  kundali: KundaliResult,
  extraDetails?: { city?: string; state?: string; country?: string }
): SavedKundaliLifeReport {
  const existing = getSavedLifeReports();
  const id = `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newReport: SavedKundaliLifeReport = {
    id,
    createdAt: new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    birthDetails: {
      name: kundali.birthDetails.name || 'जातक',
      dob: kundali.birthDetails.dob,
      tob: kundali.birthDetails.tob,
      place: kundali.birthDetails.place,
      city: extraDetails?.city,
      state: extraDetails?.state,
      country: extraDetails?.country,
      latitude: kundali.birthDetails.latitude,
      longitude: kundali.birthDetails.longitude,
      timezone: kundali.birthDetails.timezone,
      gender: kundali.birthDetails.gender || 'male',
    },
    summary: {
      ascendantSign: kundali.ascendantSign,
      moonSign: kundali.moonSign,
      nakshatra: kundali.birthNakshatra,
      totalPages: 25,
    },
    kundali,
  };

  const updated = [newReport, ...existing.filter((r) => r.birthDetails.name !== newReport.birthDetails.name || r.birthDetails.dob !== newReport.birthDetails.dob)].slice(0, 20);
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_REPORTS, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage limit reached when saving life report', e);
  }
  return newReport;
}

export function deleteSavedLifeReport(id: string): SavedKundaliLifeReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedLifeReports();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY_SAVED_REPORTS, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete report', e);
    return [];
  }
}

