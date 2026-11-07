import {
  JagannathaHoraData,
  KundaliResult,
  BirthDetails,
  VedicPlanet,
  ZodiacSign,
  VargaCode,
} from '../types/astrology';
import { generateKundali, ZODIAC_HINDI, PLANETS_HINDI } from './vedicCalculations';
import { calculateJagannathaHora, VARGA_METADATA } from './jagannathaHoraEngine';

export interface TenPageHoraSection {
  headingHi: string;
  headingEn: string;
  subheadingHi?: string;
  subheadingEn?: string;
  contentHi: string;
  contentEn: string;
  bulletPointsHi?: string[];
  bulletPointsEn?: string[];
  highlightBadge?: string;
  metricBadge?: { label: string; value: string; color?: string };
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export interface TenPageHoraPage {
  pageNumber: number; // 1 to 10
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  badge: string;
  iconName: string;
  sections: TenPageHoraSection[];
  summaryTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  keyTakeawayHi: string;
  keyTakeawayEn: string;
}

export interface TenPageHoraReport {
  generatedAt: string;
  nativeName: string;
  birthSummary: string;
  horaData: JagannathaHoraData;
  kundali: KundaliResult;
  pages: TenPageHoraPage[];
  totalPages: number;
}

export function generateTenPageJagannathaHoraReport(
  details: BirthDetails,
  inputHoraData?: JagannathaHoraData,
  inputKundali?: KundaliResult
): TenPageHoraReport {
  const safeDetails: BirthDetails = {
    name: details.name?.trim() || 'जातक (Seeker)',
    gender: details.gender || 'male',
    dob: details.dob || '1998-05-15',
    tob: details.tob || '10:30',
    place: details.place || 'New Delhi, India',
    latitude: typeof details.latitude === 'number' && !isNaN(details.latitude) ? details.latitude : 28.6139,
    longitude: typeof details.longitude === 'number' && !isNaN(details.longitude) ? details.longitude : 77.209,
    timezone: typeof details.timezone === 'number' && !isNaN(details.timezone) ? details.timezone : 5.5,
  };

  const kundali = inputKundali || generateKundali(safeDetails);
  const horaData = inputHoraData || calculateJagannathaHora(safeDetails);

  const nativeName = safeDetails.name;
  const birthSummary = `${safeDetails.dob} | ${safeDetails.tob} | ${safeDetails.place}`;
  const ascSign = kundali.ascendantSign;
  const ascHindi = kundali.ascendantSignHindi;
  const moonSign = kundali.moonSign;
  const moonHindi = kundali.moonSignHindi;
  const sunSign = kundali.sunSign;
  const sunHindi = kundali.sunSignHindi;
  const nakshatra = kundali.birthNakshatra;
  const nakshatraHindi = kundali.birthNakshatraHindi;
  const nakshatraLord = kundali.nakshatraLord;

  const ak = horaData.charaKarakas[0];
  const amk = horaData.charaKarakas[1];
  const al = horaData.arudhaPadas[0];
  const ul = horaData.arudhaPadas[11];
  const strongPlanet = horaData.shadbala.strongestPlanet;
  const weakPlanet = horaData.shadbala.weakestPlanet;
  const totalBindus = horaData.ashtakavarga.totalBindus;
  const activeMaha = horaData.hierarchicalDasha.find((m) => m.isCurrent) || horaData.hierarchicalDasha[0];
  const activeAntar = activeMaha?.antardashas?.find((a) => a.isCurrent) || activeMaha?.antardashas?.[0];

  const pages: TenPageHoraPage[] = [];

  // ==========================================
  // PAGE 1: प्रस्तावना, खगोलीय समन्वय एवं पंचांग
  // ==========================================
  pages.push({
    pageNumber: 1,
    titleHi: 'पृष्ठ १: प्रस्तावना, खगोलीय समन्वय एवं पंचांग तत्व',
    titleEn: 'Page 1: Ephemeris Precision, Astronomical Calibration & Panchanga',
    subtitleHi: 'स्विस एफिमेरिस (Swiss Ephemeris) एवं महर्षि पराशर-जैमिनी परंपरा का प्रामाणिक गणित',
    subtitleEn: 'High-precision Nirayana Chitra Paksha (Lahiri) calculations and baseline attributes',
    badge: 'खगोलीय आधार (Astronomical Baseline)',
    iconName: 'Compass',
    sections: [
      {
        headingHi: '१.१ जगन्नाथ होरा एवं स्विस एफिमेरिस का महत्व',
        headingEn: '1.1 Significance of Jagannatha Hora & Swiss Ephemeris',
        contentHi: `वैदिक ज्योतिष के सर्वोच्च सिद्धांतों में 'जगन्नाथ होरा' प्रणाली को महर्षि पराशर के 'बृहत्पाराशर होराशास्त्र' और महर्षि जैमिनी के 'उपदेश सूत्रों' का सबसे प्रमाणिक व सूक्ष्म विश्लेषण माना जाता है। इस रिपोर्ट में नासा (NASA) और स्विस एफिमेरिस के सूक्ष्म खगोलीय एल्गोरिदम के आधार पर जातक ${nativeName} के जन्म समय की प्रत्येक ग्रह स्थिति को ०.००१ कला (Arcseconds) की शुद्धता के साथ निरयण चित्रा पक्ष (लाहिड़ी अयनांश) पर परिगणित किया गया है।`,
        contentEn: `In classical Vedic predictive science, the Jagannatha Hora tradition bridges Brihat Parasara Hora Sastra and Jaimini Upadesha Sutras. This analysis computes planetary longitudes using NASA JPL & Swiss Ephemeris algorithms calibrated to the Lahiri (Chitra Paksha) ayanamsha with arc-second precision for ${nativeName}.`,
        bulletPointsHi: [
          `लाहिड़ी अयनांश (Lahiri Ayanamsha) पर आधारित अचूक निरयण गणना।`,
          `१६ वर्ग कुंडलियों (षोडशवर्ग D1 से D60) का एकीकृत त्रि-आयामी समन्वय।`,
          `८-चर कारक (Jaimini Chara Karakas) एवं १२ आरूढ़ पदों की सूक्ष्म स्थिति।`,
          `षड्बल (६-आयामी ग्रह शक्ति) एवं सर्वाष्टकवर्ग के वास्तविक रेखा-बिंदु।`,
        ],
        bulletPointsEn: [
          `Calculated via Nirayana Chitra Paksha (Lahiri Ayanamsha).`,
          `3-dimensional synthesis across all 16 Shodashvargas (D1 to D60).`,
          `8 Jaimini Chara Karakas and 12 Arudha Padas for maya/reality calibration.`,
          `6-fold Shadbala strengths and complete Sarvashtakavarga matrix.`,
        ],
        highlightBadge: 'प्रामाणिक वैदिक गणना सील (Vedic Certified)',
      },
      {
        headingHi: '१.२ जन्म पंचांग एवं वैदिक बायोडाटा',
        headingEn: '1.2 Natal Panchanga & Astro Attributes',
        contentHi: `जन्म कालीन पंचांग के पांचों अंग (तिथि, वार, नक्षत्र, योग और करण) जातक के स्थूल शरीर और आंतरिक प्राण ऊर्जा का निर्माण करते हैं। आपका जन्म लग्न ${ascHindi} (${ascSign}) है, जो आपके संपूर्ण जीवन की दिशा, चरित्र और बाह्य जगत में आपकी ऊर्जा को निर्धारित करता है। चंद्र राशि ${moonHindi} मन की एकाग्रता, भावनात्मक संबल और मानसिक शक्ति की आधारशिला है।`,
        contentEn: `The 5 limbs of the Panchanga (Tithi, Vaar, Nakshatra, Yoga, Karana) govern physical vitality and life breath. Your Ascendant Lagna is ${ascSign}, steering character and destiny blueprint, while Moon sign ${moonSign} rules mental equanimity.`,
        tableData: {
          headers: ['घटक (Attribute)', 'मान (Value)', 'ज्योतिषीय फलित प्रभाव (Vedic Impact)'],
          rows: [
            ['नाम (Native Name)', nativeName, 'नामकरण एवं प्रथम ध्वनि संस्कार'],
            ['जन्म तिथि व समय', `${safeDetails.dob} • ${safeDetails.tob}`, 'सूक्ष्म इष्टकाल एवं लग्न स्पष्टीकरण'],
            ['जन्म स्थान', safeDetails.place, `अक्षांश: ${safeDetails.latitude.toFixed(2)}°, देशांतर: ${safeDetails.longitude.toFixed(2)}°`],
            ['जन्म लग्न (Ascendant)', `${ascHindi} (${ascSign})`, `डिग्री: ${kundali.ascendantDegree} — जीवन की मुख्य धुरी`],
            ['चंद्र राशि (Moon Rashi)', `${moonHindi} (${moonSign})`, 'मन, विचार, स्मृति एवं मानसिक शांति'],
            ['सूर्य राशि (Sun Sign)', `${sunHindi} (${sunSign})`, 'आत्मा, आत्मबल, पिता एवं सामाजिक प्रतिष्ठा'],
            ['जन्म नक्षत्र (Nakshatra)', `${nakshatraHindi} (${nakshatra})`, `स्वामी: ${PLANETS_HINDI[nakshatraLord as VedicPlanet] || nakshatraLord}`],
            ['वर्तमान महादशा', `${activeMaha?.mahadashaHindi || activeMaha?.mahadasha} महादशा`, `अवधि: ${activeMaha?.startDate} से ${activeMaha?.endDate}`],
          ],
        },
      },
    ],
    keyTakeawayHi: `लग्न ${ascHindi} और चंद्र ${moonHindi} का संयोजन जातक को व्यावहारिक बुद्धि, आत्म-सम्मान और विषम परिस्थितियों में भी पुनः उठ खड़े होने की अद्वितीय सामर्थ्य प्रदान करता है।`,
    keyTakeawayEn: `The fusion of ${ascSign} Lagna and ${moonSign} Moon endows the native with strategic fortitude, ethical self-respect, and resilient recovery.`,
  });

  // ==========================================
  // PAGE 2: षोडशवर्ग चक्र मीमांसा (भाग १: D1 से D9)
  // ==========================================
  const d1 = horaData.vargas.D1;
  const d2 = horaData.vargas.D2;
  const d3 = horaData.vargas.D3;
  const d4 = horaData.vargas.D4;
  const d7 = horaData.vargas.D7;
  const d9 = horaData.vargas.D9;

  pages.push({
    pageNumber: 2,
    titleHi: 'पृष्ठ २: षोडशवर्ग चक्र मीमांसा (भाग १: स्थूल से सूक्ष्म शरीर — D1 से D9)',
    titleEn: 'Page 2: Shodashvarga Analysis (Part 1: D1 to D9 Primary Divisions)',
    subtitleHi: 'लग्न, होरा, द्रेष्काण, चतुर्थांश, सप्तांश एवं नवांश का तुलनात्मक विश्लेषण',
    subtitleEn: 'Physical vitality, liquid wealth, courage, real estate assets, progeny and soul dharma',
    badge: 'षोडशवर्ग भाग १ (Divisional Tier 1)',
    iconName: 'Layers',
    sections: [
      {
        headingHi: '२.१ D1 जन्म राशि एवं D9 नवांश का द्वैत समन्वय',
        headingEn: '2.1 D1 Rashi vs D9 Navamsha Core Synthesis',
        contentHi: `पराशर ज्योतिष में D1 जन्म चक्र को 'वृक्ष का तना' और D9 नवांश चक्र को 'वृक्ष का फल' कहा गया है। D1 से यह ज्ञात होता है कि इस जन्म में आपको कौन से साधन और शरीर मिला है, जबकि D9 नवांश यह उद्घाटित करता है कि ३० वर्ष की आयु के उपरांत आपका भाग्य किस दिशा में विकसित होगा और आपका वास्तविक आंतरिक बल क्या है।`,
        contentEn: `In Parashari doctrine, D1 represents the root and trunk while D9 Navamsha is the ripened fruit. D1 shows physical potentials, whereas D9 reveals spiritual potency, marriage stability, and destiny maturation after age 30.`,
        bulletPointsHi: [
          `D1 लग्न: ${d1.ascendantSignHindi} (${d1.ascendantSign}) — बाह्य व्यक्तित्व एवं जीवन संग्राम।`,
          `D9 नवांश लग्न: ${d9.ascendantSignHindi} (${d9.ascendantSign}) — धर्म, आत्मिक शक्ति, विवाह एवं परिपक्वता काल।`,
          `यदि कोई ग्रह D1 में सामान्य हो परंतु D9 में स्वराशि या उच्च का हो, तो वह जीवन के उत्तरार्ध में अप्रत्याशित सफलता देता है।`,
        ],
        bulletPointsEn: [
          `D1 Lagna: ${d1.ascendantSign} — Manifest physical arena and outer demeanor.`,
          `D9 Navamsha Lagna: ${d9.ascendantSign} — Inner spiritual strength, matrimonial destiny, and mature era.`,
          `Planets strengthening in D9 uplift natal promises exponentially over time.`,
        ],
      },
      {
        headingHi: '२.२ D2 (होरा), D3 (द्रेष्काण), D4 (चतुर्थांश) व D7 (सप्तांश) का फलित',
        headingEn: '2.2 Wealth (D2), Courage (D3), Real Estate (D4) & Progeny (D7)',
        contentHi: `होरा चक्र (D2) धन संचय और संपदा के प्रवाह को सूर्य (सिंह) और चंद्र (कर्क) की ऊर्जा में विभाजित करता है। द्रेष्काण (D3) जातक के पुरुषार्थ, उद्यम और भाई-बहनों से सहयोग को दर्शाता है। चतुर्थांश (D4) स्थायी भूमि, मकान, वाहन एवं घरेलू सुख का सूक्ष्म दर्पण है। सप्तांश (D7) वंश वृद्धि, संतान सुख एवं रचनात्मक प्रतिभा का निर्णायक चक्र है।`,
        contentEn: `D2 Hora governs liquidity and capital accumulation. D3 Drekkana measures initiative, courage, and sibling synergy. D4 Chaturthamsa reflects fixed property and conveyances. D7 Saptamsha is the definitive matrix for children and legacy.`,
        tableData: {
          headers: ['वर्ग चक्र (Varga)', 'लग्न (Ascendant)', 'जीवन क्षेत्र (Signification)', 'ज्योतिषीय निष्कर्ष (Vedic Evaluation)'],
          rows: [
            ['D1 (जन्म चक्र)', `${d1.ascendantSignHindi}`, 'शारीरिक स्वास्थ्य, जीवन दिशा व सामान्य भाग्य', 'स्थूल शरीर एवं सांसारिक पहचान का आधार'],
            ['D2 (होरा चक्र)', `${d2.ascendantSignHindi}`, 'धन संचय, नकदी प्रवाह एवं वित्तीय सामर्थ्य', 'कर्क व सिंह होरा में ग्रहों का संतुलित धन योग'],
            ['D3 (द्रेष्काण)', `${d3.ascendantSignHindi}`, 'पराक्रम, साहस, छोटे भाई-बहन एवं उद्यम', 'स्व-पुरुषार्थ एवं संकट काल में दृढ़ इच्छाशक्ति'],
            ['D4 (चतुर्थांश)', `${d4.ascendantSignHindi}`, 'भूमि, भवन, वाहन, पैतृक सुख एवं अचल संपत्ति', 'स्थिर संपत्ति निर्माण के प्रबल योग'],
            ['D7 (सप्तांश)', `${d7.ascendantSignHindi}`, 'संतान सुख, वंश परंपरा एवं रचनात्मक बुद्धि', 'संतान पक्ष से सुख एवं वंश वृद्धि के शुभ संकेत'],
            ['D9 (नवांश)', `${d9.ascendantSignHindi}`, 'धर्म, दांपत्य जीवन, आंतरिक बल एवं भाग्योदय', 'वैवाहिक सुख एवं ३०+ वर्ष उपरांत निरंतर भाग्योदय'],
          ],
        },
      },
    ],
    keyTakeawayHi: `D1 और D9 के लग्न का सौहार्द यह दर्शाता है कि जातक के विचार और कर्म एक-दूसरे के पूरक हैं, जिससे दीर्घकालिक योजनाओं में स्थिरता बनी रहेगी।`,
    keyTakeawayEn: `Harmonious interplay between D1 and D9 confirms that the native's subconscious aspirations and worldly efforts converge into steady progress.`,
  });

  // ==========================================
  // PAGE 3: षोडशवर्ग चक्र मीमांसा (भाग २: D10 से D60)
  // ==========================================
  const d10 = horaData.vargas.D10;
  const d12 = horaData.vargas.D12;
  const d16 = horaData.vargas.D16;
  const d20 = horaData.vargas.D20;
  const d24 = horaData.vargas.D24;
  const d27 = horaData.vargas.D27;
  const d30 = horaData.vargas.D30;
  const d60 = horaData.vargas.D60;

  pages.push({
    pageNumber: 3,
    titleHi: 'पृष्ठ ३: षोडशवर्ग चक्र मीमांसा (भाग २: कर्म, प्रारब्ध व सूक्ष्म बल — D10 से D60)',
    titleEn: 'Page 3: Shodashvarga Analysis (Part 2: D10 to D60 Subtle Karmic Divisions)',
    subtitleHi: 'दशांश (D10) करियर, विंशांश (D20) साधना, त्रिंशांश (D30) अरिष्ट एवं षष्ट्यंश (D60) पूर्वजन्म कर्म',
    subtitleEn: 'Professional sovereignty, higher vidya, karmic afflictions and supreme D60 past-life seeds',
    badge: 'षोडशवर्ग भाग २ (Subtle Karmic Tier 2)',
    iconName: 'Crown',
    sections: [
      {
        headingHi: '३.१ D10 दशांश चक्र — करियर, पद-प्रतिष्ठा एवं कार्यक्षेत्र',
        headingEn: '3.1 D10 Dashamsha — Professional Realm & Social Authority',
        contentHi: `दशांश चक्र (D10) जातक की आजीविका, व्यवसाय, नौकरी, सामाजिक प्रतिष्ठा एवं नेतृत्व क्षमता का प्रधान चक्र है। आपका दशांश लग्न ${d10.ascendantSignHindi} (${d10.ascendantSign}) है। दशम भाव में स्थित ग्रह यह निर्धारित करते हैं कि कार्यक्षेत्र में आपको कितनी शक्ति, अधिकार और स्थिरता प्राप्त होगी।`,
        contentEn: `D10 Dashamsha evaluates public vocation, corporate hierarchy, promotions, and enterprise sovereignty. Your Dashamsha Lagna is ${d10.ascendantSign}.`,
        bulletPointsHi: [
          `दशांश लग्न: ${d10.ascendantSignHindi} — कार्यशैली, उत्तरदायित्व वहन करने की क्षमता और पद-प्राप्ति।`,
          `दशमेश एवं सूर्य/शनि का दशांश में बल कार्यक्षेत्र में प्रतिद्वंद्वियों पर विजय दिलाता है।`,
          `सरकारी सेवा, उच्च प्रबंधन या स्वतंत्र व्यवसाय में मान-सम्मान की पूर्ण पुष्टि।`,
        ],
        bulletPointsEn: [
          `Dashamsha Lagna is ${d10.ascendantSign}, governing executive authority and vocational focus.`,
          `Planetary strength in D10 Kendras converts effort into recognized market value.`,
          `Indicates enduring reputation in chosen trade or professional administration.`,
        ],
      },
      {
        headingHi: '३.२ सूक्ष्म वर्ग: D12, D16, D20, D24, D27, D30 एवं D60 (षष्ट्यंश)',
        headingEn: '3.2 Higher Vargas: D12 Parents, D20 Upasana, D30 Curses & Supreme D60 Seed',
        contentHi: `महर्षि पराशर के अनुसार D60 (षष्ट्यंश) को सभी वर्ग चक्रों में सर्वाधिक ४ गुणा बल प्राप्त है। यदि कोई योग D1 में अधूरा दिखता हो परंतु D60 में शुद्ध हो, तो उसका फल अकाट्य सिद्ध होता है। D30 त्रिंशांश जीवन के गुप्त संकटों और स्वास्थ्य दोषों का निवारण सुझाता है। D24 उच्च विद्या और बौद्धिक परिपक्वता को दर्शाता है।`,
        contentEn: `In Parashari Shodashvarga weighting, D60 Shashtiamsa holds 4 full Rupas of strength—the ultimate arbiter of past-life prarabdha karma. D30 isolates afflictions, D24 measures higher scholarship, and D20 tracks spiritual grace.`,
        tableData: {
          headers: ['सूक्ष्म वर्ग', 'लग्न (Asc)', 'प्रधान विषय (Signification)', 'सूक्ष्म फलित मीमांसा'],
          rows: [
            ['D10 (दशांश)', `${d10.ascendantSignHindi}`, 'करियर, प्रतिष्ठा, व्यापार व सत्ता', 'कार्यक्षेत्र में स्थिरता एवं प्रगति'],
            ['D12 (द्वादशांश)', `${d12.ascendantSignHindi}`, 'माता-पिता, पितृ ऋण व कुल परंपरा', 'माता-पिता का आशीर्वाद एवं संस्कार'],
            ['D16 (षोडशांश)', `${d16.ascendantSignHindi}`, 'वाहन सुख, आंतरिक आनंद व मानसिक शांति', 'सुख-सुविधाओं का उपभोग व मानसिक संतोष'],
            ['D20 (विंशांश)', `${d20.ascendantSignHindi}`, 'उपासना, ईष्ट कृपा व आध्यात्मिक साधना', 'दैवीय सुरक्षा एवं आध्यात्मिक रुचि'],
            ['D24 (चतुर्विंशांश)', `${d24.ascendantSignHindi}`, 'उच्च ज्ञान, विद्या, अनुसंधान व बुद्धि', 'शैक्षणिक दक्षता एवं विश्लेषणात्मक शक्ति'],
            ['D27 (सप्तविंशांश)', `${d27.ascendantSignHindi}`, 'शारीरिक व मानसिक सामर्थ्य (बल-अबल)', 'तनाव प्रबंधन एवं आत्म-संयम'],
            ['D30 (त्रिंशांश)', `${d30.ascendantSignHindi}`, 'अरिष्ट, रोग, गुप्त भय व कर्म बंधन', 'सत्कर्मों एवं उपायों द्वारा संकट निवारण'],
            ['D60 (षष्ट्यंश)', `${d60.ascendantSignHindi}`, 'पूर्वजन्म प्रारब्ध, अंतिम फल व सर्वोच्च बल', 'सर्वोच्च निर्णायक सूक्ष्म कर्म-बीज'],
          ],
        },
      },
    ],
    keyTakeawayHi: `D60 षष्ट्यंश लग्न ${d60.ascendantSignHindi} जातक के पूर्व जन्म के संचित पुण्य का संकेत देता है, जो जीवन के कठिन मोड़ों पर अप्रत्याशित ईश्वरीय सहायता प्रदान करता है।`,
    keyTakeawayEn: `Shashtiamsa D60 Lagna ${d60.ascendantSign} denotes an auspicious reservoir of past-life purva-punya, providing invisible divine shield in critical life trials.`,
  });

  // ==========================================
  // PAGE 4: जैमिनी चर कारक एवं कारकांश विचार
  // ==========================================
  pages.push({
    pageNumber: 4,
    titleHi: 'पृष्ठ ४: जैमिनी चर कारक एवं कारकांश लग्न विचार',
    titleEn: 'Page 4: Jaimini Chara Karakas, Atmakaraka & Karakamsha Lagna',
    subtitleHi: '८-चर कारक योजना: आत्मकारक, अमात्यकारक, भ्रातृकारक एवं आत्मा का गंतव्य',
    subtitleEn: 'Soul purpose, executive minister, matrimonial karaka and spiritual ascent',
    badge: 'जैमिनी सूत्र (Jaimini Chara Karakas)',
    iconName: 'Zap',
    sections: [
      {
        headingHi: '४.१ आत्मकारक (AK) — आत्मा का वास्तविक प्रतिनिधि',
        headingEn: '4.1 Atmakaraka (AK) — King of the Chart & Soul Mission',
        contentHi: `जैमिनी ज्योतिष में जिस ग्रह के अंश सबसे अधिक होते हैं, वह जातक का 'आत्मकारक (AK)' कहलाता है। आपकी कुंडली में आत्मकारक ग्रह **${ak ? ak.planet : 'ग्रह'}** (${ak ? ak.sign : 'राशि'}, डिग्री: ${ak ? ak.formattedDegree : ''}) हैं। आत्मकारक ग्रह यह बताता है कि इस जन्म में आपकी आत्मा किस विशेष कर्म-शोधन और आध्यात्मिक उत्थान के लिए अवतरित हुई है।`,
        contentEn: `In Jaimini Upadesha Sutras, the planet holding the highest degrees in any rashi is crowned the Atmakaraka (AK)—the King of the Horoscope. For ${nativeName}, the Atmakaraka is ${ak?.planet} (${ak?.sign}, ${ak?.formattedDegree}).`,
        bulletPointsHi: [
          `आत्मकारक ग्रह: ${ak?.planet} (${ak?.sign}) — जीवन की सर्वोच्च प्राथमिकता एवं आंतरिक आत्मा की पुकार।`,
          `कारकांश लग्न: ${horaData.karakamsha.signHindi} (${horaData.karakamsha.sign}) — नवांश चक्र में आत्मकारक की स्थिति।`,
          `कारकांश लग्न से दशम भाव जातक की वास्तविक स्वाभाविक प्रतिभा और अंतरात्मा के अनुकूल आजीविका को प्रकट करता है।`,
          `आत्मकारक की दशा या अंतर्दशा में जीवन में गहन आध्यात्मिक मोड़ और अहं का परिष्कार होता है।`,
        ],
        bulletPointsEn: [
          `Atmakaraka: ${ak?.planet} (${ak?.sign}) embodies primary life tests and spiritual evolution.`,
          `Karakamsha Lagna is ${horaData.karakamsha.sign}, defining intuitive talents and vocational destiny.`,
          `The 10th house from Karakamsha specifies unshakeable karmic calling.`,
          `Atmakaraka periods refine ego, sparking profound wisdom and breakthrough self-realization.`,
        ],
        highlightBadge: `प्रधान आत्मकारक: ${ak?.planet} 👑`,
      },
      {
        headingHi: '४.२ समस्त ८ चर कारकों का विस्तृत विवरण',
        headingEn: '4.2 Exhaustive 8-Karaka Matrix & Roles',
        contentHi: `अमात्यकारक (AmK) जातक के करियर का 'प्रधानमंत्री' है, जो आजीविका को गति देता है। दाराकारक (DK) जीवनसाथी और साझेदारी का प्रतिनिधित्व करता है। भ्रातृकारक (BK) गुरु और मार्गदर्शकों का सूचक है।`,
        contentEn: `Amatyakaraka (AmK) acts as Chief Minister driving career implementation. Darakaraka (DK) represents spouse and key partnerships. Bhratrikaraka (BK) denotes mentors and gurus.`,
        tableData: {
          headers: ['कारक कोड', 'कारक पदवी (Title)', 'ग्रह (Planet)', 'राशि व अंश (Placement)', 'जीवन में भूमिका (Role)'],
          rows: horaData.charaKarakas.map((k) => [
            k.code,
            k.titleHindi,
            k.planet,
            `${ZODIAC_HINDI[k.sign] || k.sign} (${k.formattedDegree})`,
            k.significationHindi,
          ]),
        },
      },
    ],
    keyTakeawayHi: `आत्मकारक ${ak?.planet} और अमात्यकारक ${amk?.planet} का शुभ संबंध जातक को अपने कार्यक्षेत्र में नेतृत्व और समाज में सम्मानित स्थान दिलाने में सक्षम है।`,
    keyTakeawayEn: `Supportive synergy between Atmakaraka ${ak?.planet} and Amatyakaraka ${amk?.planet} unlocks executive authority and sustainable recognition.`,
  });

  // ==========================================
  // PAGE 5: आरूढ़ पद एवं सामाजिक प्रतिष्ठा
  // ==========================================
  pages.push({
    pageNumber: 5,
    titleHi: 'पृष्ठ ५: आरूढ़ पद एवं सामाजिक प्रतिष्ठा (माया व यथार्थ)',
    titleEn: 'Page 5: Arudha Padas — Social Perception, Wealth (AL) & Upapada (UL)',
    subtitleHi: 'आरूढ़ लग्न (AL - समाज में छवि) एवं उपपद लग्न (UL - वैवाहिक यथार्थ)',
    subtitleEn: 'How the world perceives the native, career status and tangible relationship reality',
    badge: 'आरूढ़ विचार (Arudha Padas AL/UL)',
    iconName: 'Grid3X3',
    sections: [
      {
        headingHi: '५.१ आरूढ़ लग्न (AL - पद लग्न) — सांसारिक पहचान',
        headingEn: '5.1 Arudha Lagna (AL) — The Maya of Perception',
        contentHi: `ऋषि जैमिनी के अनुसार लग्न जातक का 'सत्य' है, जबकि आरूढ़ लग्न (AL) वह 'माया या छवि' है जिसे दुनिया देखती है। आपका आरूढ़ लग्न **${al?.occupiedSignHindi || al?.occupiedSign}** में स्थित है। लोग आपके बारे में क्या राय रखते हैं, आपकी सामाजिक हैसियत क्या है, और व्यावसायिक जगत में आपका क्या मान है — यह सब आरूढ़ लग्न से निर्धारित होता है।`,
        contentEn: `Lagna is your existential truth, whereas Arudha Lagna (AL) is your projected status in the matrix of society. Your Arudha Lagna falls in ${al?.occupiedSign}.`,
        bulletPointsHi: [
          `आरूढ़ लग्न (AL): ${al?.occupiedSignHindi} (${al?.occupiedSign}) — सामाजिक प्रतिष्ठा, वित्तीय छवि और सार्वजनिक सम्मान।`,
          `आरूढ़ लग्न से एकादश भाव में शुभ ग्रह जातक को सरलता से धन और सामाजिक मान्यता प्रदान करते हैं।`,
          `आरूढ़ लग्न से द्वादश भाव में शुभ ग्रह खर्चों को धर्मार्थ और समाज कल्याण में लगाते हैं।`,
        ],
        bulletPointsEn: [
          `Arudha Lagna (AL) in ${al?.occupiedSign} governs public reputation and status.`,
          `Benefics in the 11th from AL guarantee natural wealth inflows and societal acclaim.`,
          `Benefics in the 12th from AL encourage charitable expenditures and graceful living.`,
        ],
        highlightBadge: `आरूढ़ लग्न: ${al?.occupiedSign} 🏛️`,
      },
      {
        headingHi: '५.२ उपपद लग्न (UL) एवं द्वादश आरूढ़ पदों की तालिका',
        headingEn: '5.2 Upapada Lagna (UL) & 12 Arudha Padas Matrix',
        contentHi: `उपपद लग्न (UL - A12) वैवाहिक सुख, जीवनसाथी के कुल-परिवार और दांपत्य जीवन की स्थिरता का प्रामाणिक दर्पण है। आपका उपपद लग्न **${ul?.occupiedSignHindi || ul?.occupiedSign}** में स्थित है। यदि उपपद लग्न पर शुभ ग्रहों की दृष्टि हो, तो विवाह दीर्घकालिक और सुखद रहता है।`,
        contentEn: `Upapada Lagna (UL / A12) is the definitive anchor for marriage stability, in-laws' standing, and relationship harmony. Your UL is in ${ul?.occupiedSign}.`,
        tableData: {
          headers: ['आरूढ़ पद', 'नाम (Title)', 'स्थित राशि (Sign)', 'भाव (House)', 'ज्योतिषीय फलित (Signification)'],
          rows: horaData.arudhaPadas.map((p) => [
            p.code,
            p.hindiName || p.name,
            `${p.occupiedSignHindi} (${p.occupiedSign})`,
            `${p.occupiedHouse}वां भाव`,
            p.significationHindi || p.signification,
          ]),
        },
      },
    ],
    keyTakeawayHi: `आरूढ़ लग्न और उपपद लग्न की अनुकूलता यह सुनिश्चित करती है कि जातक अपने गृहस्थ जीवन और बाह्य सामाजिक प्रतिष्ठा के मध्य एक सुंदर संतुलन बनाए रखने में सफल रहेगा।`,
    keyTakeawayEn: `Equilibrium between AL (public stature) and UL (matrimonial core) ensures sustained domestic joy alongside corporate respect.`,
  });

  // ==========================================
  // PAGE 6: षड्बल ६-आयामी ग्रह बल एवं इष्ट/कष्ट फल
  // ==========================================
  const sortedShadbala = [...horaData.shadbala.planets].sort((a, b) => b.ratio - a.ratio);

  pages.push({
    pageNumber: 6,
    titleHi: 'पृष्ठ ६: षड्बल ६-आयामी ग्रह बल एवं इष्ट/कष्ट फल मीमांसा',
    titleEn: 'Page 6: Shadbala 6-Fold Planetary Strength & Ishta/Kashta Phala',
    subtitleHi: 'स्थान बल, दिग्बल, कालबल, चेष्टाबल, नैसर्गिक बल एवं दृग्बल का गणितीय परीक्षण',
    subtitleEn: 'Mathematical virupa quantification, minimum rupa thresholds, and benefic/malefic ratios',
    badge: 'षड्बल गणित (Shadbala Strengths)',
    iconName: 'BarChart3',
    sections: [
      {
        headingHi: '६.१ षड्बल के ६ घटक एवं ग्रह क्रम',
        headingEn: '6.1 The 6 Pillars of Shadbala & Planetary Rankings',
        contentHi: `पराशर ज्योतिष में षड्बल ग्रहों की वास्तविक कार्य-क्षमता को मापने का सर्वोच्च गणितीय मापदंड है। केवल राशि में उच्च होने से कोई ग्रह बली नहीं होता; उसे दिग्बल (दिशा बल), कालबल (समय बल), चेष्टाबल (वक्री गति का बल) आदि की भी आवश्यकता होती है। आपकी कुंडली में सबसे शक्तिशाली ग्रह **${strongPlanet}** हैं, जो संकटों में आपका मुख्य संबल हैं। सबसे कम बली ग्रह **${weakPlanet}** हैं, जिनकी शांति लाभकारी रहेगी।`,
        contentEn: `Shadbala aggregates Sthana Bala (position), Dig Bala (direction), Kaala Bala (time), Cheshta Bala (motion), Naisargika Bala (natural strength), and Drik Bala (aspects). Your strongest planet is ${strongPlanet}, while ${weakPlanet} requires remedial harmony.`,
        tableData: {
          headers: ['ग्रह (Planet)', 'कुल विरूपा (Virupas)', 'रूपा (Rupas)', 'अपेक्षित (Required)', 'अनुपात % (Ratio)', 'श्रेणी (Verdict)', 'इष्ट फल / कष्ट फल'],
          rows: sortedShadbala.map((p, idx) => [
            `${PLANETS_HINDI[p.planet] || p.planet} (#${idx + 1})`,
            p.totalVirupas,
            p.totalRupas,
            p.requiredRupas,
            `${p.ratio}%`,
            p.verdictHindi,
            `${p.ishtaPhala} / ${p.kashtaPhala}`,
          ]),
        },
      },
      {
        headingHi: '६.२ इष्ट फल एवं कष्ट फल का व्यावहारिक उपयोग',
        headingEn: '6.2 Practical Application of Ishta & Kashta Phala',
        contentHi: `इष्ट फल यह दर्शाता है कि ग्रह अपनी दशा या गोचर में कितने प्रतिशत शुभ, सुखद और कल्याणकारी परिणाम देगा। कष्ट फल उन चुनौतियों का अनुपात बताता है जो जातक को परिपक्व बनाने के लिए आती हैं। जिस ग्रह का इष्ट फल कष्ट फल से दोगुना हो, उसका रत्न या मंत्र जीवन में चमत्कारिक सकारात्मक परिवर्तन लाता है।`,
        contentEn: `Ishta Phala measures the percentage of pure benefic output a planet produces during its dasha, while Kashta Phala represents testing friction. Planets with high Ishta Phala yield smooth fortunes.`,
        bulletPointsHi: [
          `सर्वाधिक बली ग्रह: ${strongPlanet} — आपके जीवन का मुख्य रक्षा कवच एवं सफलता का स्रोत।`,
          `न्यूनतम बली ग्रह: ${weakPlanet} — इस ग्रह के मंत्र जप अथवा दान से संतुलन स्थापित करें।`,
          `इष्ट फल का सदुपयोग: उच्च इष्ट फल वाले ग्रहों के कार्यक्षेत्र में निवेश करना सदैव लाभकारी रहता है।`,
        ],
        bulletPointsEn: [
          `Dominant Planet: ${strongPlanet} acts as your chief guardian shield in adversity.`,
          `Vulnerable Planet: ${weakPlanet} benefits greatly from daily Vedic propitiation.`,
          `Channeling high Ishta Phala energy fuels strategic personal and financial breakthroughs.`,
        ],
        metricBadge: { label: 'सर्वोच्च बली ग्रह', value: `${strongPlanet} (${sortedShadbala[0]?.ratio}%)`, color: 'emerald' },
      },
    ],
    keyTakeawayHi: `षड्बल में ${strongPlanet} की सर्वोच्च स्थिति जातक को प्रशासनिक क्षमता, मानसिक दृढ़ता एवं विपरीत परिस्थितियों में भी विजयी होने का जन्मजात वरदान देती है।`,
    keyTakeawayEn: `Peak Shadbala strength in ${strongPlanet} confers natural managerial acumen, mental resilience, and triumph over trying phases.`,
  });

  // ==========================================
  // PAGE 7: सर्वाष्टकवर्ग एवं भिन्नाष्टकवर्ग शक्ति
  // ==========================================
  const sav = horaData.ashtakavarga;
  const highBinduSigns = sav.signBindus.filter((s) => s.bindus >= 30);
  const lowBinduSigns = sav.signBindus.filter((s) => s.bindus < 25);

  pages.push({
    pageNumber: 7,
    titleHi: 'पृष्ठ ७: सर्वाष्टकवर्ग एवं भिन्नाष्टकवर्ग शक्ति विश्लेषण',
    titleEn: 'Page 7: Sarvashtakavarga & Bhinnashtakavarga Power Analysis',
    subtitleHi: '१२ राशियों में ३३७ बिंदुओं का वितरण — जीवन ऊर्जा एवं धन-समृद्धि का गुप्त नक्शा',
    subtitleEn: 'Distribution of 337 auspicious bindus across 12 rashis for effortless vs effort-driven houses',
    badge: 'अष्टकवर्ग शक्ति (Ashtakavarga 337 Matrix)',
    iconName: 'Grid',
    sections: [
      {
        headingHi: '७.१ सर्वाष्टकवर्ग (SAV) — कुल बिंदु एवं ऊर्जा वितरण',
        headingEn: '7.1 Sarvashtakavarga (SAV) — Total Bindus & Energy Matrix',
        contentHi: `अष्टकवर्ग प्रणाली महर्षि पराशर द्वारा प्रदत्त वह गुप्त गणित है जो गोचर के सटीक फल को प्रमाणित करता है। संपूर्ण राशि चक्र में कुल ३३७ शुभ बिंदु होते हैं। सामान्यतः जिस राशि में २८ से अधिक बिंदु होते हैं, वह राशि शुभ व फलदायी मानी जाती है। यदि किसी राशि में ३०+ बिंदु हों, तो वहां ग्रहों का गोचर जातक को बिना अधिक संघर्ष के प्रचुर लाभ कराता है। आपकी कुंडली में कुल **${totalBindus} बिंदु** हैं (${sav.samudayaStrengthHindi})।`,
        contentEn: `Ashtakavarga evaluates the transit strength of all planets. Out of 337 universal bindus, a score of 28 is the benchmark. Signs exceeding 30 bindus yield effortless growth during planetary transits. Your chart holds ${totalBindus} bindus (${sav.samudayaStrength}).`,
        tableData: {
          headers: ['राशि (Sign)', 'संस्कृत नाम', 'बिंदु (Bindus)', 'ऊर्जा स्तर (Energy Level)', 'व्यावहारिक प्रभाव (Practical Effect)'],
          rows: sav.signBindus.map((s) => [
            `${s.signHindi} (${s.sign})`,
            s.sign,
            s.bindus,
            s.bindus >= 30 ? '🟢 उच्च शक्ति (३०+)' : s.bindus >= 28 ? '🟡 संतुलित (२८-२९)' : '🔵 अल्प शक्ति (<२८)',
            s.bindus >= 30 ? 'गोचर में स्वतः लाभ, धन वृद्धि व सुख' : s.bindus >= 28 ? 'परिश्रम के अनुरूप सामान्य लाभ' : 'सजगता, संयम व विशेष प्रयास अपेक्षित',
          ]),
        },
      },
      {
        headingHi: '७.२ त्रिकोण ऊर्जा एवं गोचर में शुभ दिशाएं',
        headingEn: '7.2 Triplicity Energies & Auspicious Horizons',
        contentHi: `सर्वाष्टकवर्ग के आधार पर उच्च बिंदुओं वाली राशियां जातक के सबसे बलशाली जीवन स्तंभ हैं। उच्च बिंदु वाली राशियां: ${highBinduSigns.map((s) => `${s.signHindi} (${s.bindus})`).join(', ') || 'संतुलित वितरण'}। इन राशियों में जब भी गुरु, शुक्र या शनि जैसे बड़े ग्रहों का गोचर होता है, तो जातक के जीवन में बड़े सकारात्मक परिवर्तन घटित होते हैं।`,
        contentEn: `High-bindu signs (${highBinduSigns.map((s) => `${s.sign} [${s.bindus}]`).join(', ')}) trigger major life expansions whenever Jupiter or Saturn transits through them.`,
        bulletPointsHi: [
          `कुल समुदाय बिंदु: ${totalBindus} / ३३७ — ${sav.samudayaStrengthHindi}।`,
          `सर्वोच्च बिंदु वाली राशियां: ${highBinduSigns.map((s) => `${s.signHindi} (${s.bindus})`).join(', ') || 'समान संतुलित'}।`,
          `अल्प बिंदु वाली राशियां: ${lowBinduSigns.map((s) => `${s.signHindi} (${s.bindus})`).join(', ') || 'कोई गंभीर न्यूनता नहीं'} — इन राशियों के गोचर में संयम रखें।`,
          `अष्टकवर्ग के अनुसार अनुकूल दिशाओं में यात्रा या व्यापारिक विस्तार अत्यंत मंगलकारी सिद्ध होता है।`,
        ],
        bulletPointsEn: [
          `Total Samudaya Bindus: ${totalBindus} / 337 (${sav.samudayaStrength}).`,
          `Peak Signs: ${highBinduSigns.map((s) => `${s.sign} [${s.bindus}]`).join(', ')}.`,
          `Cautionary Signs: ${lowBinduSigns.map((s) => `${s.sign} [${s.bindus}]`).join(', ')} require patience during transits.`,
          `Aligning career initiatives with high-bindu zodiac houses yields optimal ROI.`,
        ],
        highlightBadge: `समुदाय शक्ति: ${sav.samudayaStrengthHindi}`,
      },
    ],
    keyTakeawayHi: `सर्वाष्टकवर्ग में ${totalBindus} बिंदुओं का कुल संचय यह प्रमाणित करता है कि जातक के पास जीवन में आर्थिक व सामाजिक सुरक्षा की एक अत्यंत सुदृढ़ नींव विद्यमान है।`,
    keyTakeawayEn: `Accumulation of ${totalBindus} total bindus solidifies native's financial insulation and provides smooth long-term sustainability.`,
  });

  // ==========================================
  // PAGE 8: ग्रहावस्था, पुष्कर नवांश एवं विशेष लग्न
  // ==========================================
  const pushkaraList = horaData.pushkaraPlanets;

  pages.push({
    pageNumber: 8,
    titleHi: 'पृष्ठ ८: ग्रहावस्था, पुष्कर नवांश एवं विशेष लग्न फलित',
    titleEn: 'Page 8: Planetary Avasthas, Pushkara Navamsha & Special Lagnas',
    subtitleHi: 'बालादि (उम्र), जाग्रदादि (जागृति) एवं दीप्तादि अवस्थाओं का जादुई प्रभाव',
    subtitleEn: 'Baladi awakeness, Jagradadi consciousness, divine Pushkara healing and special lagnas',
    badge: 'ग्रहावस्था व पुष्कर (Avasthas & Special Lagnas)',
    iconName: 'Activity',
    sections: [
      {
        headingHi: '८.१ ग्रहावस्था — ग्रह कितना प्रतिशत फल देने में सक्षम है',
        headingEn: '8.1 Planetary Avasthas — Manifestation Capacity',
        contentHi: `ग्रह केवल उपस्थित होने से पूरा फल नहीं देते; उनकी 'अवस्था' यह तय करती है कि वे जागृत हैं या सोए हुए। जाग्रदादि अवस्था में जागृत ग्रह १००% फल देता है, स्वप्नावस्था का ग्रह ५०% फल देता है, और सुषुप्त ग्रह ०% फल देता है। इसी प्रकार बालादि अवस्था में 'युवा' ग्रह पूर्ण सामर्थ्यवान होता है।`,
        contentEn: `Planetary Avasthas reflect planetary consciousness. In Jagradadi, Awake planets express 100% potency, Dreaming planets yield 50%, and Sleeping planets remain dormant. In Baladi, Yuva (adult) planets execute complete results.`,
        tableData: {
          headers: ['ग्रह (Planet)', 'बालादि अवस्था (Age)', 'जाग्रदादि (Consciousness)', 'दीप्तादि (State of Dignity)', 'विशेष गुण (Special Status)'],
          rows: horaData.avasthas.map((a) => [
            a.hindiName || a.planet,
            a.baladiHindi,
            a.jagradadiHindi,
            a.deeptadiHindi,
            a.isPushkaraNavamsha ? '✨ पुष्कर नवांश (दैवीय रक्षा)' : a.isVargottama ? '👑 वर्गोत्तम (अति बली)' : a.isCombust ? '🔥 अस्त (Combust)' : 'सामान्य',
          ]),
        },
      },
      {
        headingHi: '८.२ पुष्कर नवांश एवं विशेष लग्न (होरा लग्न, घटी लग्न, श्री लग्न व इन्दु लग्न)',
        headingEn: '8.2 Pushkara Navamsha & Special Lagnas (HL, GL, SL, Indu Lagna)',
        contentHi: `पुष्कर नवांश राशि चक्र के वे अमृत तुल्य अंश हैं जहाँ स्थित ग्रह जीवन के सबसे भयानक संकटों में भी जातक को उबार लेते हैं। विशेष लग्नों में होरा लग्न (HL) धन प्रवाह को, घटी लग्न (GL) सामाजिक प्रभाव व राजसत्ता को, श्री लग्न (SL) मां लक्ष्मी की कृपा को, और इन्दु लग्न विशेष आकस्मिक धन लाभ को दर्शाता है।`,
        contentEn: `Pushkara Navamsha degrees represent rejuvenating soul-nectar where planets gain divine protection against calamities. Special Lagnas track wealth flow (HL), power (GL), and Lakshmi blessings (SL, Indu Lagna).`,
        tableData: {
          headers: ['विशेष लग्न', 'कोड', 'राशि (Sign)', 'भाव (From Lagna)', 'ज्योतिषीय फलित (Signification)'],
          rows: horaData.specialLagnas.map((sl) => [
            sl.hindiName,
            sl.code,
            `${sl.signHindi} (${sl.sign})`,
            `${sl.houseFromLagna}वां भाव`,
            sl.descriptionHindi,
          ]),
        },
      },
    ],
    keyTakeawayHi: `${pushkaraList.length > 0 ? `कुंडली में ${pushkaraList.map((p) => p.planet).join(', ')} पुष्कर नवांश में स्थित होकर जातक को दैवीय सुरक्षा और संकटमोचक बल प्रदान करते हैं।` : 'विशेष लग्नों का केंद्र भावों से संबंध जातक को आर्थिक स्वावलंबन और सामाजिक आदर सुनिश्चित करता है।'}`,
    keyTakeawayEn: `${pushkaraList.length > 0 ? `Planets in Pushkara Navamsha (${pushkaraList.map((p) => p.planet).join(', ')}) confer divine rejuvenation and angelic protection in crises.` : 'Auspicious disposition of Special Lagnas secures financial sovereignty and dignified societal status.'}`,
  });

  // ==========================================
  // PAGE 9: त्रि-स्तरीय विंशोत्तरी दशा वृक्ष एवं जीवन कालक्रम
  // ==========================================
  pages.push({
    pageNumber: 9,
    titleHi: 'पृष्ठ ९: त्रि-स्तरीय विंशोत्तरी दशा वृक्ष एवं जीवन कालक्रम (१२० वर्ष)',
    titleEn: 'Page 9: 3-Tier Hierarchical Vimshottari Dasha Tree & Life Timeline',
    subtitleHi: 'महादशा > अंतर्दशा > प्रत्यंतर्दशा की सटीक गणना एवं आगामी जीवन मोड़',
    subtitleEn: 'Complete 120-year Parashari Vimshottari progression calibrated to natal Moon longitude',
    badge: 'विंशोत्तरी दशा वृक्ष (120-Year Vimshottari Tree)',
    iconName: 'Calendar',
    sections: [
      {
        headingHi: '९.१ वर्तमान सक्रिय दशा चक्र एवं तात्कालिक प्रभाव',
        headingEn: '9.1 Current Active Dasha Matrix & Real-time Impact',
        contentHi: `विंशोत्तरी दशा वैदिक ज्योतिष में घटनाओं के सटीक समय (Timing of Events) को जानने का सबसे विश्वसनीय साधन है। जातक की कुंडली में वर्तमान में **${activeMaha?.mahadashaHindi || activeMaha?.mahadasha} की महादशा** सक्रिय है (${activeMaha?.startDate} से ${activeMaha?.endDate} तक), जिसके अंतर्गत **${activeAntar?.antardashaHindi || activeAntar?.antardasha} की अंतर्दशा** (${activeAntar?.startDate} से ${activeAntar?.endDate} तक) गतिमान है।`,
        contentEn: `Vimshottari Dasha is the preeminent timing system of Parashara. Currently, you are traversing the Mahadasha of ${activeMaha?.mahadasha} (${activeMaha?.startDate} to ${activeMaha?.endDate}) with sub-period Antardasha of ${activeAntar?.antardasha} (${activeAntar?.startDate} to ${activeAntar?.endDate}).`,
        bulletPointsHi: [
          `सक्रिय महादशा: ${activeMaha?.mahadashaHindi || activeMaha?.mahadasha} — दीर्घकालिक जीवन विषय एवं पृष्ठभूमि ऊर्जा।`,
          `सक्रिय अंतर्दशा: ${activeAntar?.antardashaHindi || activeAntar?.antardasha} — तात्कालिक परिस्थितियां, नए अवसर एवं कार्यक्षेत्र मोड़।`,
          `वर्तमान दशा चक्र जातक के कर्म भाव एवं भाग्य भाव के मध्य नए समीकरण स्थापित कर रहा है।`,
          `संयम व कर्मठता से इस समय का उपयोग करने पर दीर्घकालिक स्थायी लाभ सुनिश्चित होगा।`,
        ],
        bulletPointsEn: [
          `Active Mahadasha: ${activeMaha?.mahadasha} sets the macro theme and foundational currents.`,
          `Active Antardasha: ${activeAntar?.antardasha} triggers concrete milestone events and career inflection points.`,
          `Interplay harmonizes natal career Kendra and trinal fortune axes.`,
          `Disciplined execution now anchors decade-long professional rewards.`,
        ],
        highlightBadge: `सक्रिय: ${activeMaha?.mahadashaHindi || activeMaha?.mahadasha} महादशा ⏳`,
      },
      {
        headingHi: '९.२ सम्पूर्ण १२० वर्षीय विंशोत्तरी महादशा कालक्रम तालिका',
        headingEn: '9.2 Full 120-Year Vimshottari Mahadasha Sequence Table',
        contentHi: `जन्म कालीन चंद्रमा के नक्षत्र के आधार पर निर्धारित यह संपूर्ण कालक्रम जातक के बाल्यकाल से लेकर जीवन के परिपक्व चरणों तक का संपूर्ण रोडमैप प्रस्तुत करता है:`,
        contentEn: `Derived directly from natal Moon longitude, this authoritative sequence charts the complete progression of your lifespan:`,
        tableData: {
          headers: ['महादशा स्वामी (Lord)', 'अवधि (Years)', 'आरंभ तिथि (Start)', 'समाप्ति तिथि (End)', 'स्थिति (Status)'],
          rows: horaData.hierarchicalDasha.map((m) => [
            `${m.mahadashaHindi || m.mahadasha} महादशा`,
            `${m.durationYears} वर्ष`,
            m.startDate,
            m.endDate,
            m.isCurrent ? '🔴 [वर्तमान सक्रिय दशा]' : new Date(m.endDate) < new Date() ? 'व्यतीत (Completed)' : 'आगामी (Upcoming)',
          ]),
        },
      },
    ],
    keyTakeawayHi: `वर्तमान में सक्रिय ${activeMaha?.mahadashaHindi || activeMaha?.mahadasha} महादशा जातक के जीवन में परिपक्वता, उत्तरदायित्व और दीर्घकालिक लक्ष्यों की प्राप्ति के लिए अत्यंत महत्वपूर्ण कालखंड है।`,
    keyTakeawayEn: `The active ${activeMaha?.mahadasha} Mahadasha represents an empowering era for solidifying structural career foundations and personal maturity.`,
  });

  // ==========================================
  // PAGE 10: सर्वांगीण निष्कर्ष, रत्न, रुद्राक्ष एवं सिद्ध वैदिक उपाय
  // ==========================================
  const lagnaLord = kundali.ascendantSign;
  const luckyGems = [
    { planet: 'Sun', gemHi: 'माणिक्य (Ruby)', metal: 'तांबा / सोना', finger: 'अनामिका (Ring finger)', mantra: 'ॐ घृणिः सूर्याय नमः' },
    { planet: 'Moon', gemHi: 'मोती (Pearl)', metal: 'चांदी', finger: 'कनिष्ठिका (Little finger)', mantra: 'ॐ सों सोमाय नमः' },
    { planet: 'Mars', gemHi: 'मूंगा (Red Coral)', metal: 'तांबा / पंचधातु', finger: 'अनामिका (Ring finger)', mantra: 'ॐ अं अंगारकाय नमः' },
    { planet: 'Mercury', gemHi: 'पन्ना (Emerald)', metal: 'सोना / कांसा', finger: 'कनिष्ठिका (Little finger)', mantra: 'ॐ बुं बुधाय नमः' },
    { planet: 'Jupiter', gemHi: 'पुखराज (Yellow Sapphire)', metal: 'सोना / पीतल', finger: 'तर्जनी (Index finger)', mantra: 'ॐ बृं बृहस्पतये नमः' },
    { planet: 'Venus', gemHi: 'हीरा / ओपल (Opal)', metal: 'चांदी / प्लैटिनम', finger: 'मध्यमा / अनामिका', mantra: 'ॐ शुं शुक्राय नमः' },
    { planet: 'Saturn', gemHi: 'नीलम (Blue Sapphire) / एमेथिस्ट', metal: 'पंचधातु / लोहा', finger: 'मध्यमा (Middle finger)', mantra: 'ॐ शं शनैश्चराय नमः' },
  ];

  const primaryLuckyGem = luckyGems.find((g) => g.planet === strongPlanet) || luckyGems[4];

  pages.push({
    pageNumber: 10,
    titleHi: 'पृष्ठ १०: सर्वांगीण निष्कर्ष, रत्न, रुद्राक्ष एवं सिद्ध वैदिक उपाय',
    titleEn: 'Page 10: Grand Synthesis, Auspicious Gemstones, Rudraksha & Remedies',
    subtitleHi: 'षोडशवर्ग, चर कारक, आरूढ़ व षड्बल का अंतिम संश्लेषित वैदिक फलादेश',
    subtitleEn: 'Integrated harmonic synthesis, tailored gemstone energization, and sacred Vedic propitiations',
    badge: 'महा-निष्कर्ष व उपाय (Remedies & Blessing)',
    iconName: 'Flame',
    sections: [
      {
        headingHi: '१०.१ जगन्नाथ होरा महा-संश्लेषण (Grand Synthesis)',
        headingEn: '10.1 Grand Architectural Vedic Synthesis',
        contentHi: `जातक ${nativeName} की कुंडली में ${ascHindi} लग्न, ${moonHindi} चंद्र राशि, आत्मकारक ${ak?.planet} एवं आरूढ़ लग्न ${al?.occupiedSignHindi} का यह अद्वितीय संयोग यह सिद्ध करता है कि जातक के जीवन में संघर्ष क्षणिक और सफलताएं स्थायी होंगी। षड्बल में ${strongPlanet} का बल और सर्वाष्टकवर्ग में ${totalBindus} बिंदु जीवन के प्रत्येक क्षेत्र में आपको एक स्वतः सुरक्षा कवच प्रदान करते हैं।`,
        contentEn: `The harmonic triangulation of ${ascSign} Lagna, ${moonSign} Moon, Atmakaraka ${ak?.planet}, and Arudha Lagna ${al?.occupiedSign} affirms that setbacks are transient while milestones will endure. Strongest planet ${strongPlanet} and ${totalBindus} SAV bindus anchor enduring life triumphs.`,
        bulletPointsHi: [
          `आर्थिक स्थिति: होरा लग्न एवं D2 होरा के अनुसार धन संचय क्षमता उत्तम है।`,
          `करियर व आजीविका: D10 दशांश एवं अमात्यकारक ${amk?.planet} उच्च प्रबंधन अथवा स्वतंत्र व्यापार में यश दिलाएंगे।`,
          `दांपत्य जीवन: उपपद लग्न (UL) एवं D9 नवांश के अनुसार परस्पर सम्मान और धैर्य से वैवाहिक सुख प्रगाढ़ रहेगा।`,
          `आध्यात्मिक उन्नति: आत्मकारक ${ak?.planet} एवं कारकांश लग्न आंतरिक शांति व परोपकारी चिंतन का वरदान देते हैं।`,
        ],
        bulletPointsEn: [
          `Finances: D2 Hora confirms disciplined capital accumulation and growing assets.`,
          `Vocation: D10 Dashamsha and Amatyakaraka ${amk?.planet} favor executive seniority and autonomous enterprise.`,
          `Matrimony: Upapada Lagna (UL) and D9 Navamsha foster lifelong loyalty and domestic warmth.`,
          `Spiritual evolution: Atmakaraka ${ak?.planet} guides inner wisdom and generous mentorship.`,
        ],
      },
      {
        headingHi: '१०.२ अनुकूल रत्न, रुद्राक्ष एवं वैदिक मंत्रोपचार',
        headingEn: '10.2 Gemstone Prescription, Rudraksha & Vedic Mantras',
        contentHi: `ग्रहों के शुभ स्पंदन को जाग्रत करने और कमजोर ग्रहों के दोष को शांत करने हेतु वैदिक शास्त्र अनुकूल रत्न और मंत्र साधना का विधान करते हैं:`,
        contentEn: `To amplify benefic planetary vibrations and pacify adverse transits, classical treatises prescribe authentic gemstones, rudraksha, and sacred Vedic mantras:`,
        tableData: {
          headers: ['उपाय श्रेणी (Category)', 'अनुशंसा (Prescription)', 'धारण विधि एवं मंत्र (Procedure & Mantra)'],
          rows: [
            ['भाग्य संवर्धक रत्न', `${primaryLuckyGem.gemHi}`, `धातु: ${primaryLuckyGem.metal}, अंगुली: ${primaryLuckyGem.finger}। मंत्र: "${primaryLuckyGem.mantra}" (१०८ बार)।`],
            ['शुभ रुद्राक्ष कवच', 'पंचमुखी अथवा सातमुखी रुद्राक्ष', 'सोमवार को गंगाजल व कच्चे दूध से शुद्ध कर लाल धागे में गले में धारण करें।'],
            ['नित्य वैदिक उपासना', 'सूर्य अर्घ्य एवं गायत्री मंत्र', 'प्रातःकाल तांबे के लोटे में रोली-अक्षत डालकर सूर्य देव को अर्घ्य दें।'],
            ['ग्रह शांति दान', `${weakPlanet ? PLANETS_HINDI[weakPlanet] || weakPlanet : 'शनि'} देव निमित्त दान`, 'शनिवार/बुधवार को जरूरतमंदों को अन्न, वस्त्र या तिल का दान करें।'],
            ['आध्यात्मिक संकल्प', 'महामृत्युंजय मंत्र जप', 'दैनिक ११ या २१ बार महामृत्युंजय मंत्र का मानसिक जप सर्वकल्याणकारी है।'],
          ],
        },
      },
      {
        headingHi: '१०.३ आचार्य का अंतिम वैदिक आशीष',
        headingEn: '10.3 Acharya Divine Vedic Blessing',
        contentHi: `ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥\n\nजातक ${nativeName} की यह सम्पूर्ण १०-पृष्ठीय जगन्नाथ होरा महा-मीमांसा निष्कपट वैदिक निष्ठा के साथ संपन्न हुई। नवग्रह आपके जीवन में स्वास्थ्य, यश, कीर्ति, संपन्नता और आत्मिक शांति की निरंतर वर्षा करें। सत्य, धर्म और सत्कर्म पर अटल विश्वास बनाए रखें। शुभम् भवतु! कल्याणम् अस्तु!`,
        contentEn: `May all beings be happy, may all beings be free from illness. May all see auspiciousness, may none suffer sorrow.\n\nThis 10-page master Jagannatha Hora dossier for ${nativeName} concludes with divine Vedic blessings. May the Navagrahas illuminate your path with vitality, wealth, wisdom, and peace.`,
        highlightBadge: 'ॐ शांतिः शांतिः शांतिः 🪔',
      },
    ],
    keyTakeawayHi: `धर्म, सत्य और कर्मठता के त्रिवेणी संगम पर चलकर जातक न केवल अपने संपूर्ण मनोरथों को सिद्ध करेगा, अपितु समाज में एक प्रेरणादायक व्यक्तित्व के रूप में स्थापित होगा।`,
    keyTakeawayEn: `Guided by ethics, disciplined labor, and noble intent, the native will achieve holistic prosperity while serving as an inspiring mentor to many.`,
  });

  return {
    generatedAt: new Date().toISOString(),
    nativeName,
    birthSummary,
    horaData,
    kundali,
    pages,
    totalPages: pages.length,
  };
}
