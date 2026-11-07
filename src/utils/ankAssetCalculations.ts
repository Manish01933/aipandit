// Asset, Vehicle, Property, Mobile, Business & Dasha Numerology Engine

import { CHALDEAN_MAP, PYTHAGOREAN_MAP, reduceToSingleDigit } from './ankJyotishCalculations';

export interface HouseNumberResult {
  rawInput: string;
  compoundSum: number;
  rootNumber: number;
  planetEn: string;
  planetHi: string;
  elementEn: string;
  elementHi: string;
  vibeSummaryEn: string;
  vibeSummaryHi: string;
  prosEn: string[];
  prosHi: string[];
  consEn: string[];
  consHi: string[];
  bestSuitedForEn: string;
  bestSuitedForHi: string;
  compatibilityScore: number; // 0 to 100%
  compatibilityVerdictEn: string;
  compatibilityVerdictHi: string;
  correctionRemedyEn: string;
  correctionRemedyHi: string;
}

export interface VehicleNumberResult {
  rawInput: string;
  vehicleType: '4wheeler' | '2wheeler';
  totalAlphanumericCompound: number;
  totalAlphanumericRoot: number;
  digitsOnlyCompound: number;
  digitsOnlyRoot: number;
  planetEn: string;
  planetHi: string;
  safetyScore: number; // 0 to 100
  breakdownPropensityEn: string;
  breakdownPropensityHi: string;
  prestigeAndLuckEn: string;
  prestigeAndLuckHi: string;
  compatibilityScore: number; // with owner
  recommendedVehicleColorsEn: string[];
  recommendedVehicleColorsHi: string[];
  vehicleRemedyEn: string;
  vehicleRemedyHi: string;
}

export interface MobileNumberResult {
  rawInput: string;
  compoundSum: number;
  rootNumber: number;
  planetEn: string;
  planetHi: string;
  wealthIndex: number; // 0 to 100%
  luckRatingEn: 'Highly Auspicious' | 'Auspicious' | 'Average / Mixed' | 'Needs Correction';
  luckRatingHi: string;
  keyCombinationsFound: { combo: string; effectEn: string; effectHi: string; type: 'positive' | 'caution' }[];
  zeroCount: number;
  isEndingWithZero: boolean;
  businessSuitabilityEn: string;
  businessSuitabilityHi: string;
  remedyEn: string;
  remedyHi: string;
}

export interface BusinessNameResult {
  rawName: string;
  chaldeanSum: number;
  chaldeanRoot: number;
  pythagoreanSum: number;
  pythagoreanRoot: number;
  planetEn: string;
  planetHi: string;
  commercialMagnetismScore: number; // 0 to 100%
  industryAlignmentEn: string;
  industryAlignmentHi: string;
  commercialVerdictEn: string;
  commercialVerdictHi: string;
  enhancementSuggestionEn: string;
  enhancementSuggestionHi: string;
}

export interface AnkDashaCycle {
  dashaNumber: number;
  planetEn: string;
  planetHi: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  isCurrent: boolean;
  themeEn: string;
  themeHi: string;
  opportunitiesEn: string[];
  opportunitiesHi: string[];
  precautionsEn: string[];
  precautionsHi: string[];
}

// ----------------------------------------------------
// 1. HOUSE / FLAT NUMBER ANALYZER
// ----------------------------------------------------
export function analyzeHouseNumber(
  input: string,
  userMulank: number = 1,
  userBhagyank: number = 1
): HouseNumberResult {
  const clean = input.trim().toUpperCase();
  let sum = 0;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (/[0-9]/.test(char)) {
      sum += parseInt(char, 10);
    } else if (/[A-Z]/.test(char)) {
      sum += CHALDEAN_MAP[char] || 0;
    }
  }

  const compound = sum > 0 ? sum : 1;
  const root = reduceToSingleDigit(compound);

  const HOUSE_DATABASE: Record<
    number,
    {
      planetEn: string;
      planetHi: string;
      elementEn: string;
      elementHi: string;
      vibeEn: string;
      vibeHi: string;
      prosEn: string[];
      prosHi: string[];
      consEn: string[];
      consHi: string[];
      suitedEn: string;
      suitedHi: string;
      remedyEn: string;
      remedyHi: string;
    }
  > = {
    1: {
      planetEn: 'Sun (Surya)',
      planetHi: 'सूर्य देव (स्वावलंबन व प्रतिष्ठा)',
      elementEn: 'Fire',
      elementHi: 'अग्नि तत्व',
      vibeEn: 'Radiates leadership, self-reliance, high energy, and public recognition. Promotes ambition and independent careers.',
      vibeHi: 'नेतृत्व, मान-सम्मान, स्वतंत्र विचार और उच्च महत्वाकांक्षा का संचार करता है। यहां रहने वाले लोग स्वावलंबी होते हैं।',
      prosEn: ['High fame and career growth', 'Boosts self-confidence', 'Favorable for top executives and entrepreneurs'],
      prosHi: ['यश व मान-प्रतिष्ठा में वृद्धि', 'आत्मविश्वास व नेतृत्व क्षमता का विकास', 'अधिकारियों व व्यापारियों के लिए अति-शुभ'],
      consEn: ['Can trigger ego clashes among family members', 'May feel slightly isolated or overly work-focused'],
      consHi: ['परिवार में अहं का टकराव संभव', 'काम का अत्यधिक दबाव व अकेलापन'],
      suitedEn: 'Business founders, CEOs, politicians, government officers, surgeons',
      suitedHi: 'व्यापारी, राजनेता, प्रशासनिक अधिकारी व स्वतंत्र उद्यमी',
      remedyEn: 'Place a Brass/Copper Sun face on the main entrance and keep the foyer brightly illuminated.',
      remedyHi: 'मुख्य द्वार पर तांबे का सूर्य यंत्र लगाएं और प्रवेश द्वार पर पर्याप्त रोशनी रखें।',
    },
    2: {
      planetEn: 'Moon (Chandra)',
      planetHi: 'चन्द्र देव (शांति व पारिवारिक सौहार्द)',
      elementEn: 'Water',
      elementHi: 'जल तत्व',
      vibeEn: 'Warm, nurturing, deeply loving and serene sanctuary. Encourages close-knit family relationships, hospitality, and peaceful living.',
      vibeHi: 'शांति, स्नेह, पारिवारिक सामंजस्य और अतिथि सत्कार का घर। मानसिक शांति व सृजनात्मक कार्यों के लिए उत्तम।',
      prosEn: ['Deep emotional bonding and love', 'Excellent for rest, meditation and artistic projects', 'Welcoming atmosphere for guests'],
      prosHi: ['पारिवारिक प्रेम व आपसी सहयोग', 'मानसिक शांति व कला-साहित्य हेतु श्रेष्ठ', 'सकारात्मक व शांत वातावरण'],
      consEn: ['May lead to over-sensitivity or emotional mood swings', 'Can foster complacency'],
      consHi: ['भावुकता व मूड स्विंग्स', 'आलस्य या निर्णय लेने में संकोच'],
      suitedEn: 'Couples, joint families, psychologists, artists, hospitality professionals',
      suitedHi: 'सुखी परिवार, शिक्षक, काउंसलर, लेखक एवं कलाप्रेमी',
      remedyEn: 'Keep a silver bowl filled with fresh water and white flowers near the entrance; place a soft night lamp.',
      remedyHi: 'प्रवेश द्वार पर सुगंधित सफेद पुष्प रखें और चांदी का स्वास्तिक या चंद्रमा का प्रतीक लगाएं।',
    },
    3: {
      planetEn: 'Jupiter (Brihaspati)',
      planetHi: 'देवगुरु बृहस्पति (ज्ञान व समृद्धि)',
      elementEn: 'Ether / Air',
      elementHi: 'आकाश तत्व',
      vibeEn: 'Filled with knowledge, abundance, optimism, vibrant social gatherings, and creative self-expression.',
      vibeHi: 'ज्ञान, संस्कार, आध्यात्मिक उन्नति और सामाजिक प्रतिष्ठा का केंद्र। परिवार में शिक्षा व शुभ कार्यों की प्रचुरता।',
      prosEn: ['Brings continuous learning and wisdom', 'Attracts auspicious celebrations and good luck', 'Great for children education'],
      prosHi: ['ज्ञान व अध्ययन में अपार सफलता', 'घर में मांगलिक उत्सवों की निरंतरता', 'संतान की उन्नति हेतु श्रेष्ठ'],
      consEn: ['Tendency for high expenditure on celebrations', 'Can become cluttered or overly busy'],
      consHi: ['उत्सवों पर अत्यधिक व्यय', 'कामों का बिखराव'],
      suitedEn: 'Professors, legal consultants, researchers, spiritual seekers, large joyful families',
      suitedHi: 'अधिवक्ता, शिक्षक, परामर्शदाता, धर्मप्रेमी एवं अध्ययनशील परिवार',
      remedyEn: 'Display sacred scriptures or a small brass bell at the entrance; apply yellow sandalwood or turmeric tilak.',
      remedyHi: 'ईशान कोण में तुलसी का पौधा लगाएं और प्रवेश द्वार पर पीले फूलों की रंगोली या पीतल की घंटी लगाएं।',
    },
    4: {
      planetEn: 'Rahu & Uranus (Technological Precision)',
      planetHi: 'राहु / स्थिरता व व्यावहारिक सुरक्षा',
      elementEn: 'Earth',
      elementHi: 'पृथ्वी तत्व',
      vibeEn: 'Strong structural stability, discipline, rigorous hard work, organizational systems, and solid real-estate asset security.',
      vibeHi: 'कड़ा अनुशासन, ठोस योजनाएं, तकनीकी कार्य और अचल संपत्ति के निर्माण का वातावरण।',
      prosEn: ['Excellent for disciplined financial compounding', 'Strong security and grounding', 'Great for architects and engineers'],
      prosHi: ['अनुशासन व बचत में वृद्धि', 'मजबूत सुरक्षा व स्थिरता', 'इंजीनियरिंग व तकनीकी कार्यों में सफलता'],
      consEn: ['Can feel rigid, strict, or dry if balance is not maintained', 'Workload feels never-ending'],
      consHi: ['घर में अत्यधिक नियम-कानून व गंभीरता', 'मानसिक विश्राम में कभी-कभी कमी'],
      suitedEn: 'Civil engineers, IT architects, accountants, builders, financial planners',
      suitedHi: 'इंजीनियर, सीए, सॉफ्टवेयर डेवलपर व रियल एस्टेट कारोबारी',
      remedyEn: 'Introduce indoor green plants and wooden decor; place a small Ganesha idol at the foyer.',
      remedyHi: 'घर में हरे पौधे (जैसे मनी प्लांट/एरेका पाम) लगाएं और मुख्य द्वार पर श्री गणेश जी की प्रतिमा स्थापित करें।',
    },
    5: {
      planetEn: 'Mercury (Budha)',
      planetHi: 'बुध देव (गतिशीलता, व्यापार व मनोरंजन)',
      elementEn: 'Air / Fire',
      elementHi: 'वायु तत्व',
      vibeEn: 'Dynamic, versatile, fun-filled, and buzzing with commercial activity, travel, ideas, and frequent social movements.',
      vibeHi: 'उमंग, उत्साह, व्यापारिक हलचल, नए विचार और तीव्र संचार का घर। यहां कभी बोरियत नहीं होती।',
      prosEn: ['Brings rapid business transactions', 'Active, energetic and joyful environment', 'Fosters high networking'],
      prosHi: ['व्यापारिक सौदों में तेजी', 'उत्साही व प्रसन्नचित्त माहौल', 'मित्रों व संपर्कों का विस्तृत दायरा'],
      consEn: ['Hard to maintain quiet routine', 'Risk of scattered focus or restless travel'],
      consHi: ['अत्यधिक भागदौड़ व चंचलता', 'ध्यान का भटकना'],
      suitedEn: 'Marketers, media creators, stock traders, travel influencers, sales professionals',
      suitedHi: 'व्यापारी, मीडिया कर्मी, शेयर ट्रेडर्स व जनसंपर्क अधिकारी',
      remedyEn: 'Hang a 5-rod bamboo or metal wind chime near the balcony or main door; keep green quartz crystals.',
      remedyHi: 'प्रवेश द्वार पर 5-पाइप वाली विंड चाइम लगाएं और बुधवार को घर में कर्पूर की धूप दें।',
    },
    6: {
      planetEn: 'Venus (Shukra)',
      planetHi: 'शुक्राचार्य (सौंदर्य, प्रेम व भौतिक सुख)',
      elementEn: 'Water / Earth',
      elementHi: 'जल व पृथ्वी तत्व',
      vibeEn: 'The ultimate sanctuary of luxury, elegance, domestic bliss, gourmet dining, artistic aesthetics, and unconditional warmth.',
      vibeHi: 'वैभव, विलासिता, दांपत्य सुख, स्वादिष्ट खान-पान और सुरुचिपूर्ण इंटीरियर का प्रतीक।',
      prosEn: ['Attracts material luxury and financial comfort', 'Extremely harmonious marital love', 'Fosters beauty and artistic decor'],
      prosHi: ['धन-वैभव व ऐश्वर्य की प्रचुरता', 'दांपत्य जीवन में गहरा प्रेम', 'सजावट व सौंदर्य का आकर्षण'],
      consEn: ['Risk of luxury overspending and perfectionism in interior maintenance'],
      consHi: ['विलासिता पर अत्यधिक व्यय', 'आरामपसंदगी'],
      suitedEn: 'Designers, restaurateurs, jewelers, luxury brand owners, happy harmonious couples',
      suitedHi: 'फैशन डिजाइनर, कलाकार, होटल व्यवसायी व नवविवाहित युगल',
      remedyEn: 'Decorate with fresh aromatic flowers, burn rose or sandalwood incense, and use warm white ambient lights.',
      remedyHi: 'घर में सुगंधित अगरबत्ती/डिफ्यूज़र जलाएं और शुक्रवार को घर की गृहिणी का विशेष सम्मान करें।',
    },
    7: {
      planetEn: 'Ketu & Neptune (Spiritual Haven)',
      planetHi: 'केतु (शांति, अध्यात्म व गहन चिंतन)',
      elementEn: 'Ether',
      elementHi: 'आकाश तत्व',
      vibeEn: 'A tranquil, mystic oasis of introspection, deep spiritual study, scientific research, and serene meditation.',
      vibeHi: 'शांत तपोभूमि जैसा घर। यहां गहन ध्यान, शोध, लेखन और आत्मिक शांति का विशेष वास होता है।',
      prosEn: ['Profound mental clarity and intuitive breakthroughs', 'Absolute peace away from outside chaos', 'Great for research & writing'],
      prosHi: ['गहन मानसिक शांति व अंतर्ज्ञान', 'बाहरी शोरगुल से दूर सुकून', 'शोध, दर्शन व साधना हेतु सर्वोत्तम'],
      consEn: ['Not ideal for noisy commercial networking; can foster aloofness from society'],
      consHi: ['सांसारिक दिखावे से दूरी', 'कभी-कभी अत्यधिक अकेलापन महसूस होना'],
      suitedEn: 'Writers, researchers, spiritual practitioners, data scientists, healers',
      suitedHi: 'लेखक, शोधकर्ता, ज्योतिषी, चिकित्सक व आध्यात्मिक साधक',
      remedyEn: 'Create a dedicated quiet prayer/meditation corner with a Himalayan salt lamp or copper pyramid.',
      remedyHi: 'घर के पूजा स्थल पर तांबे का पिरामिड या सेंधा नमक का लैंप रखें और शिव पंचाक्षर मंत्र का श्रवण करें।',
    },
    8: {
      planetEn: 'Saturn (Shani)',
      planetHi: 'शनि देव (कर्म, न्याय व अचल संपत्ति)',
      elementEn: 'Earth',
      elementHi: 'पृथ्वी तत्व',
      vibeEn: 'Commands immense authority, executive discipline, serious ambition, and the accumulation of massive long-term wealth.',
      vibeHi: 'अथाह धैर्य, अनुशासन, दीर्घकालीन संपत्ति निर्माण और सामाजिक न्याय का घर।',
      prosEn: ['Builds multi-generational wealth and real estate', 'Demands and rewards dedicated effort', 'High societal respect and power'],
      prosHi: ['स्थाई संपत्ति व साम्राज्य का निर्माण', 'कर्मठता का शत-प्रतिशत फल', 'समाज में उच्च प्रभाव व अधिकार'],
      consEn: ['Requires constant discipline; slacking or unethical behavior can trigger penalties'],
      consHi: ['कड़ा परिश्रम अनिवार्य', 'आलस्य करने पर कार्यों में विलंब'],
      suitedEn: 'Judges, real estate developers, industrialists, senior corporate directors, long-term investors',
      suitedHi: 'उद्योगपति, न्यायाधीश, बिल्डर्स, प्रशासनिक अधिकारी व वरिष्ठ कॉर्पोरेट प्रमुख',
      remedyEn: 'Keep the home flawlessly organized and clean; light a mustard oil diya in the western balcony on Saturdays.',
      remedyHi: 'घर को हमेशा साफ-सुथरा रखें, पश्चिम दिशा में नीले रंग का हल्का बल्ब लगाएं और शनिवार को पीपल पूजन करें।',
    },
    9: {
      planetEn: 'Mars (Mangal)',
      planetHi: 'मंगल देव (ऊर्जा, शौर्य व परोपकार)',
      elementEn: 'Fire',
      elementHi: 'अग्नि तत्व',
      vibeEn: 'Radiates boundless vitality, courageous action, philanthropic warmth, global hospitality, and dynamic transformation.',
      vibeHi: 'अपार ऊर्जा, परोपकार, साहस और उत्साह का घर। यहां रहने वाले लोग समाज सेवा और साहसिक कार्यों में आगे रहते हैं।',
      prosEn: ['High energetic output and athletic drive', 'Inspires generosity and community welfare', 'Overcomes all competition'],
      prosHi: ['शारीरिक स्फूर्ति व रोग प्रतिरोधक क्षमता', 'परोपकार व सामाजिक प्रतिष्ठा', 'प्रतिद्वंद्वियों पर विजय'],
      consEn: ['High heat or tempers if not channeled into physical workout/sports'],
      consHi: ['क्रोध व जल्दबाजी से बचने की आवश्यकता'],
      suitedEn: 'Athletes, doctors, defense officers, social reformers, charitable foundations',
      suitedHi: 'खिलाड़ी, चिकित्सक, रक्षा अधिकारी, समाजसेवी व रियल एस्टेट कारोबारी',
      remedyEn: 'Display an auspicious Hanumanji or Panchmukhi Yantra badge and keep indoor air well-ventilated.',
      remedyHi: 'घर के मुख्य द्वार पर सिंदूरी स्वास्तिक बनाएं और मंगलवार को सुंदरकांड का पाठ करें।',
    },
  };

  const info = HOUSE_DATABASE[root] || HOUSE_DATABASE[1];

  // Calculate compatibility with user's Driver & Destiny numbers
  let score = 75;
  if (root === userMulank || root === userBhagyank) score += 20;
  if ([1, 3, 5, 6].includes(root) && [1, 3, 5, 6].includes(userMulank)) score += 10;
  if ((root === 8 && userMulank === 1) || (root === 1 && userMulank === 8)) score -= 15;
  if ((root === 4 && userMulank === 9) || (root === 9 && userMulank === 4)) score -= 10;
  score = Math.min(100, Math.max(45, score));

  const verdictEn =
    score >= 85
      ? 'Perfect Harmonious Sanctuary - Highly Auspicious & Lucky for You'
      : score >= 70
      ? 'Very Good & Growth-Oriented Abode'
      : 'Moderately Favorable - Apply Recommended Numerology Corrections';

  const verdictHi =
    score >= 85
      ? 'अति-शुभ व भाग्योदयकारी आवास - आपके मूलांक/भाग्यांक के पूर्णतः अनुकूल'
      : score >= 70
      ? 'उत्तम व सुख-समृद्धि प्रदायक घर'
      : 'सामान्य फलदायी - दिए गए सुधारात्मक उपाय अवश्य अपनाएं';

  return {
    rawInput: input,
    compoundSum: compound,
    rootNumber: root,
    planetEn: info.planetEn,
    planetHi: info.planetHi,
    elementEn: info.elementEn,
    elementHi: info.elementHi,
    vibeSummaryEn: info.vibeEn,
    vibeSummaryHi: info.vibeHi,
    prosEn: info.prosEn,
    prosHi: info.prosHi,
    consEn: info.consEn,
    consHi: info.consHi,
    bestSuitedForEn: info.suitedEn,
    bestSuitedForHi: info.suitedHi,
    compatibilityScore: score,
    compatibilityVerdictEn: verdictEn,
    compatibilityVerdictHi: verdictHi,
    correctionRemedyEn: info.remedyEn,
    correctionRemedyHi: info.remedyHi,
  };
}

// ----------------------------------------------------
// 2. VEHICLE NUMBER ANALYZER (4-WHEELER & 2-WHEELER)
// ----------------------------------------------------
export function analyzeVehicleNumber(
  plateString: string,
  vehicleType: '4wheeler' | '2wheeler' = '4wheeler',
  userMulank: number = 1
): VehicleNumberResult {
  const clean = plateString.trim().toUpperCase();
  let totalSum = 0;
  let digitsSum = 0;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (/[0-9]/.test(char)) {
      const val = parseInt(char, 10);
      totalSum += val;
      digitsSum += val;
    } else if (/[A-Z]/.test(char)) {
      totalSum += CHALDEAN_MAP[char] || 0;
    }
  }

  const alphaCompound = totalSum > 0 ? totalSum : 1;
  const alphaRoot = reduceToSingleDigit(alphaCompound);
  const digCompound = digitsSum > 0 ? digitsSum : 1;
  const digRoot = reduceToSingleDigit(digCompound);

  const PLANET_MAP: Record<
    number,
    {
      en: string;
      hi: string;
      safety: number;
      breakdownEn: string;
      breakdownHi: string;
      prestigeEn: string;
      prestigeHi: string;
      colorsEn: string[];
      colorsHi: string[];
      remedyEn: string;
      remedyHi: string;
    }
  > = {
    1: {
      en: 'Sun (Surya - Royal & Commanding)',
      hi: 'सूर्य देव (राजकीय प्रभाव व सर्वोच्च प्रतिष्ठा)',
      safety: 92,
      breakdownEn: 'Very low breakdown probability; commands road respect and instant VIP presence.',
      breakdownHi: 'बहुत कम खराबी; सड़क पर प्रभावशाली और राजसी उपस्थिति।',
      prestigeEn: 'Highest executive prestige and leadership aura.',
      prestigeHi: 'सर्वोच्च प्रतिष्ठा व उच्च अधिकारियों जैसी साख।',
      colorsEn: ['Golden Yellow', 'Orange', 'Bright White', 'Metallic Ruby Red'],
      colorsHi: ['गोल्डन', 'ऑरेंज', 'सफेद', 'रूबी रेड'],
      remedyEn: 'Place a small brass Sun emblem or Gayatri Mantra sticker on the dashboard.',
      remedyHi: 'डैशबोर्ड या हैंडल पर तांबे का छोटा सूर्य प्रतीक या गायत्री मंत्र लगाएं।',
    },
    2: {
      en: 'Moon (Chandra - Smooth & Serene)',
      hi: 'चन्द्र देव (शांत, आरामदायक व सुखद यात्रा)',
      safety: 85,
      breakdownEn: 'Smooth mechanical running, but requires regular fluid/oil checks.',
      breakdownHi: 'सुगम व आरामदायक सफर; समय पर कूलेंट/इंजन ऑयल की जांच रखें।',
      prestigeEn: 'Graceful, elegant, family-oriented and peaceful.',
      prestigeHi: 'सौम्य, आरामदायक व पारिवारिक यात्रा हेतु उत्तम।',
      colorsEn: ['Pearl White', 'Silver Metallic', 'Light Blue', 'Cream'],
      colorsHi: ['पर्ल व्हाइट', 'सिल्वर', 'हल्का नीला', 'क्रीम'],
      remedyEn: 'Keep a small silver coin or Ganesha idol in the glove box / utility box.',
      remedyHi: 'डैशबोर्ड में चांदी का सिक्का या छोटे गणेश जी की मूर्ति स्थापित करें।',
    },
    3: {
      en: 'Jupiter (Brihaspati - Auspicious & Protective)',
      hi: 'देवगुरु बृहस्पति (अति-शुभ, सुरक्षित व मंगलकारी)',
      safety: 95,
      breakdownEn: 'Exceptionally rare mechanical failures; brings divine road protection and safe returns.',
      breakdownHi: 'दुर्घटनाओं से पूर्ण सुरक्षा कवच; अत्यंत सुरक्षित और भरोसेमंद यात्रा।',
      prestigeEn: 'Scholarly, highly respectable, auspicious and dignified.',
      prestigeHi: 'संस्कारवान, आदरणीय एवं सदैव मंगलकारी।',
      colorsEn: ['Golden Champagne', 'Yellow Ochre', 'White', 'Amber Bronze'],
      colorsHi: ['शैम्पेन गोल्ड', 'पीला', 'सफेद', 'ब्रॉन्ज'],
      remedyEn: 'Tie a sacred yellow moli thread on the mirror/handlebar and keep vehicle fragrant.',
      remedyHi: 'रियर व्यू मिरर या हैंडल पर पीला रक्षा सूत्र (मौली) बांधें।',
    },
    4: {
      en: 'Rahu (Strategic Tech & Bold Presence)',
      hi: 'राहु (आधुनिक तकनीक, गति व सतर्कता आवश्यक)',
      safety: 72,
      breakdownEn: 'Occasional sudden electrical sensor glitches or tire punctures; maintain preventive servicing.',
      breakdownHi: 'इलेक्ट्रिकल पार्ट्स या सेंसर में कभी-कभार अचानक समस्या; नियमित सर्विसिंग आवश्यक।',
      prestigeEn: 'Futuristic, bold, aggressive road styling and high tech vibe.',
      prestigeHi: 'आधुनिक, तकनीकी रूप से सक्षम और आकर्षक।',
      colorsEn: ['Metallic Grey', 'Midnight Blue', 'Smoky Silver', 'Dark Titanium'],
      colorsHi: ['मेटैलिक ग्रे', 'नेवी ब्लू', 'स्मोकी सिल्वर', 'टाइटैनियम'],
      remedyEn: 'Hang a blue evil-eye talisman or keep a small natural camphor tablet inside.',
      remedyHi: 'वाहन में नजर बट्टू या छोटा कपूर का पाउच रखें।',
    },
    5: {
      en: 'Mercury (Budha - Agile, Fast & Commercial)',
      hi: 'बुध देव (त्वरित गति, माइलेज व व्यापारिक लाभ)',
      safety: 90,
      breakdownEn: 'Excellent engine efficiency and superior fuel economy; perfect for daily commerce.',
      breakdownHi: 'शानदार माइलेज व न्यूनतम रखरखाव; व्यापारिक व दैनिक आवागमन के लिए सर्वोत्तम।',
      prestigeEn: 'Lively, smart, young, fast and commercially rewarding.',
      prestigeHi: 'स्मार्ट, तेज और व्यापार में धन-आकर्षक।',
      colorsEn: ['Emerald Green', 'Aqua Teal', 'Silver', 'Pearl White'],
      colorsHi: ['एमराल्ड ग्रीन', 'सिल्वर', 'व्हाइट', 'टील'],
      remedyEn: 'Keep a green Lord Ganesha visual card or lemongrass freshener inside the cabin.',
      remedyHi: 'वाहन में श्री गणेश जी का चित्र लगाएं और सुगंधित लेमनग्रास फ्रेशनर का उपयोग करें।',
    },
    6: {
      en: 'Venus (Shukra - Luxury, Glamour & Comfort)',
      hi: 'शुक्राचार्य (विलासिता, आराम व ग्लैमरस लुक)',
      safety: 91,
      breakdownEn: 'Superb comfort and smooth suspension; attracts high admiration and compliments.',
      breakdownHi: 'अति-आरामदायक सस्पेंशन और सुखद ड्राइव; देखने में अत्यंत आकर्षक।',
      prestigeEn: 'Ultimate luxury symbol, romantic travels and celebrity aura.',
      prestigeHi: 'लक्जरी, ऐश्वर्य और उच्च सामाजिक प्रतिष्ठा का प्रतीक।',
      colorsEn: ['Diamond White', 'Champagne Pearl', 'Light Pink', 'Sky Blue'],
      colorsHi: ['प्योर व्हाइट', 'शैम्पेन', 'सिल्वर', 'लाइट ब्लू'],
      remedyEn: 'Always keep the vehicle interior perfumed with natural sandalwood or rose fragrance.',
      remedyHi: 'गाड़ी में हमेशा गुलाब या चंदन की भीनी-भीनी सुगंध बनाए रखें।',
    },
    7: {
      en: 'Ketu (Mystic, Long Journeys & Introspection)',
      hi: 'केतु (लंबी यात्राएं, एकांत व सुरक्षा)',
      safety: 82,
      breakdownEn: 'Good for long highway journeys; check navigation GPS and headlights regularly.',
      breakdownHi: 'हाईवे और लंबी यात्राओं के लिए उत्तम; हेडलाइट्स और जीपीएस को दुरुस्त रखें।',
      prestigeEn: 'Understated elegance, deeply individualistic and mystic.',
      prestigeHi: 'शांत, गंभीर और विशिष्ट व्यक्तित्व का प्रतीक।',
      colorsEn: ['Pearl White', 'Matte Grey', 'Pastel Green', 'Beige'],
      colorsHi: ['व्हाइट', 'मैट ग्रे', 'पिस्ता ग्रीन', 'बेज'],
      remedyEn: 'Place a small Panchmukhi Hanuman sticker or Shiva Trishul pendant on the mirror.',
      remedyHi: 'रियर-व्यू मिरर पर पंचमुखी हनुमान जी का लॉकेट या चित्र लगाएं।',
    },
    8: {
      en: 'Saturn (Shani - Heavy Duty, Iron Endurance & Power)',
      hi: 'शनि देव (मजबूत बॉडी, सहनशक्ति व सतर्कता)',
      safety: 78,
      breakdownEn: 'Heavy duty endurance, but never postpone scheduled maintenance or brake inspections.',
      breakdownHi: 'अत्यंत मजबूत बॉडी; ब्रेक व टायरों की नियमित जांच कभी न टालें।',
      prestigeEn: 'Industrial power, solid unshakeable authority and dominance.',
      prestigeHi: 'ठोस मजबूती, भारी क्षमता और अधिकार संपन्न।',
      colorsEn: ['Royal Navy Blue', 'Deep Charcoal', 'Metallic Grey', 'Black (if suited)'],
      colorsHi: ['नेवी ब्लू', 'डार्क चारकोल', 'ग्रे'],
      remedyEn: 'Hang a lemon-chilli on Saturdays and light a mustard oil diya once a month in worship.',
      remedyHi: 'शनिवार को वाहन का पूजन करें और शनिवार को गाड़ी की सफाई पर विशेष ध्यान दें।',
    },
    9: {
      en: 'Mars (Mangal - High Power, Speed & Energy)',
      hi: 'मंगल देव (तीव्र गति, शक्ति व साहसिक ड्राइव)',
      safety: 84,
      breakdownEn: 'High engine torque and instant pickup; drive with patience and avoid aggressive overtaking.',
      breakdownHi: 'जबरदस्त पिकअप और ताकत; तेज गति व ओवरस्पीडिंग से हमेशा बचें।',
      prestigeEn: 'Dynamic, courageous, commanding and athletic presence.',
      prestigeHi: 'ऊर्जावान, साहसी और शक्तिशाली।',
      colorsEn: ['Crimson Red', 'Fiery Orange', 'Golden Copper', 'Bright White'],
      colorsHi: ['लाल', 'ऑरेंज', 'कॉपर', 'व्हाइट'],
      remedyEn: 'Apply a small vermilion (sindoor) tilak on the front grille or bumper and chant Hanuman Chalisa.',
      remedyHi: 'वाहन पर सिंदूर का स्वास्तिक लगाएं और नियमित हनुमान चालीसा का पाठ करें।',
    },
  };

  const info = PLANET_MAP[alphaRoot] || PLANET_MAP[1];

  // Specific 2-wheeler adjustments (Speed vs Safety)
  const adjustedSafety = vehicleType === '2wheeler' ? Math.max(60, info.safety - 5) : info.safety;

  // Compatibility with owner driver number
  let comp = 80;
  if (alphaRoot === userMulank) comp += 15;
  if ([1, 3, 5, 6].includes(alphaRoot) && [1, 3, 5, 6].includes(userMulank)) comp += 10;
  if ((alphaRoot === 8 && userMulank === 1) || (alphaRoot === 1 && userMulank === 8)) comp -= 15;
  comp = Math.min(100, Math.max(50, comp));

  return {
    rawInput: plateString,
    vehicleType,
    totalAlphanumericCompound: alphaCompound,
    totalAlphanumericRoot: alphaRoot,
    digitsOnlyCompound: digCompound,
    digitsOnlyRoot: digRoot,
    planetEn: info.en,
    planetHi: info.hi,
    safetyScore: adjustedSafety,
    breakdownPropensityEn: info.breakdownEn,
    breakdownPropensityHi: info.breakdownHi,
    prestigeAndLuckEn: info.prestigeEn,
    prestigeAndLuckHi: info.prestigeHi,
    compatibilityScore: comp,
    recommendedVehicleColorsEn: info.colorsEn,
    recommendedVehicleColorsHi: info.colorsHi,
    vehicleRemedyEn: info.remedyEn,
    vehicleRemedyHi: info.remedyHi,
  };
}

// ----------------------------------------------------
// 3. MOBILE NUMBER NUMEROLOGY ANALYZER
// ----------------------------------------------------
export function analyzeMobileNumber(
  phone: string,
  userMulank: number = 1
): MobileNumberResult {
  const digits = phone.replace(/[^0-9]/g, '');
  let sum = 0;
  let zeroCount = 0;

  for (let i = 0; i < digits.length; i++) {
    const d = parseInt(digits[i], 10);
    sum += d;
    if (d === 0) zeroCount++;
  }

  const compound = sum > 0 ? sum : 1;
  const root = reduceToSingleDigit(compound);
  const isEndingWithZero = digits.endsWith('0');

  // Detect wealth combinations in the number
  const combosFound: { combo: string; effectEn: string; effectHi: string; type: 'positive' | 'caution' }[] = [];

  if (digits.includes('24') || digits.includes('42')) {
    combosFound.push({
      combo: '24 / 42 (Venus-Moon Harmony)',
      effectEn: 'Magnetic luxury, emotional harmony, steady wealth inflow and strong social popularity.',
      effectHi: 'धन-आकर्षण, पारिवारिक सौहार्द और सामाजिक लोकप्रियता प्रदान करता है।',
      type: 'positive',
    });
  }
  if (digits.includes('33')) {
    combosFound.push({
      combo: '33 (Master Teacher / Jupiter Wealth)',
      effectEn: 'Exceptional wisdom, counseling success, and educational authority.',
      effectHi: 'ज्ञान, सलाहकारी कार्यों व शिक्षा क्षेत्र में अपार सफलता।',
      type: 'positive',
    });
  }
  if (digits.includes('15') || digits.includes('51')) {
    combosFound.push({
      combo: '15 / 51 (Sun-Mercury Commercial Radiance)',
      effectEn: 'High communication charisma, quick commercial deals, and leadership status.',
      effectHi: 'वाकपटुता, व्यापारिक सौदों में तेजी और उच्च नेतृत्व।',
      type: 'positive',
    });
  }
  if (digits.includes('48') || digits.includes('84')) {
    combosFound.push({
      combo: '48 / 84 (Rahu-Saturn Delay Sequence)',
      effectEn: 'Can trigger unannounced delays or technical disputes; requires conscious patience.',
      effectHi: 'कार्यों में आकस्मिक विलंब या तनाव की संभावना; सावधानी अपेक्षित।',
      type: 'caution',
    });
  }
  if (digits.includes('28') || digits.includes('82')) {
    combosFound.push({
      combo: '28 / 82 (Moon-Saturn Emotional Turbulence)',
      effectEn: 'Can bring mood fluctuations or over-thinking during negotiations.',
      effectHi: 'बातचीत के दौरान मानसिक तनाव या अत्यधिक भावुकता से बचें।',
      type: 'caution',
    });
  }

  // Determine Planet and Luck Rating
  const PLANET_DATA: Record<
    number,
    { en: string; hi: string; suitEn: string; suitHi: string; wealthIdx: number; remedyEn: string; remedyHi: string }
  > = {
    1: {
      en: 'Sun (Surya - Authority & Leadership)',
      hi: 'सूर्य देव (अधिकार, प्रशासन व मान-सम्मान)',
      suitEn: 'Ideal for CEOs, politicians, top executives, and independent founders.',
      suitHi: 'उच्च अधिकारियों, राजनेताओं और शीर्ष व्यापारिक लीडर्स के लिए सर्वोत्तम।',
      wealthIdx: 92,
      remedyEn: 'Save important business contacts with proper honorifics; keep phone wallpaper in gold/orange tones.',
      remedyHi: 'फोन का वॉलपेपर गोल्डन या सूर्य के प्रतीक वाला रखें।',
    },
    2: {
      en: 'Moon (Chandra - Diplomacy & Care)',
      hi: 'चन्द्र देव (काउंसलिंग, सेवा व सौम्य संबंध)',
      suitEn: 'Best for counselors, customer support, healthcare, and creative arts.',
      suitHi: 'काउंसलर, डॉक्टर, हॉस्पिटैलिटी और जनसंपर्क हेतु उत्तम।',
      wealthIdx: 80,
      remedyEn: 'Use a silver/white case and avoid heated arguments late at night over calls.',
      remedyHi: 'फोन पर सफेद या सिल्वर कवर का प्रयोग करें।',
    },
    3: {
      en: 'Jupiter (Brihaspati - Wisdom & Advisory)',
      hi: 'देवगुरु बृहस्पति (सलाह, शिक्षा व परामर्श)',
      suitEn: 'Superb for consultants, advocates, educators, and high finance.',
      suitHi: 'वकीलों, शिक्षकों, सलाहकारों और वित्तीय विशेषज्ञों हेतु अति-शुभ।',
      wealthIdx: 90,
      remedyEn: 'Keep phone wallpaper with yellow aesthetic or sacred symbols.',
      remedyHi: 'वॉलपेपर में पीले रंग या शुभ ॐ/स्वास्तिक चिन्ह का प्रयोग करें।',
    },
    4: {
      en: 'Rahu (Tech & Digital Networks)',
      hi: 'राहु (आईटी, डिजिटल मार्केटिंग व शोध)',
      suitEn: 'Great for digital marketers, coders, and international traders.',
      suitHi: 'डिजिटल मीडिया, सॉफ्टवेयर डेवलपर्स और शेयर मार्केट हेतु अनुकूल।',
      wealthIdx: 75,
      remedyEn: 'Regularly clear cached files and remove spam contacts.',
      remedyHi: 'फोन से अनावश्यक ऐप्स व स्पैम कॉन्टैक्ट्स को समय-समय पर डिलीट करें।',
    },
    5: {
      en: 'Mercury (Budha - Supreme Commerce & Speed)',
      hi: 'बुध देव (सर्वश्रेष्ठ व्यापारिक व वित्तीय अंक)',
      suitEn: 'The ultimate business number. Multiplying sales, networking, and clients.',
      suitHi: 'व्यापार, सेल्स, ट्रेडिंग और क्लाइंट डीलिंग के लिए सर्वश्रेष्ठ।',
      wealthIdx: 96,
      remedyEn: 'Keep phone clean, use green accents, and send cordial morning messages to clients.',
      remedyHi: 'हरे रंग का कवर या वॉलपेपर लगाएं और व्यापारिक वार्तालाप में मधुर वाणी रखें।',
    },
    6: {
      en: 'Venus (Shukra - Luxury & Cash Inflow)',
      hi: 'शुक्राचार्य (लक्जरी, आकर्षण व नकद प्रवाह)',
      suitEn: 'Attracts high-paying clients, luxury deals, entertainment, and glamour.',
      suitHi: 'लक्जरी प्रोडक्ट्स, इंटीरियर, ग्लैमर व बड़े क्लाइंट्स को आकर्षित करने हेतु।',
      wealthIdx: 95,
      remedyEn: 'Keep phone pristine without scratches and use aromatic phone wipes.',
      remedyHi: 'फोन को हमेशा साफ-सुथरा रखें और आकर्षक कवर का प्रयोग करें।',
    },
    7: {
      en: 'Ketu (Intuition & Specialist Knowledge)',
      hi: 'केतु (गहन शोध, हीलिंग व विशिष्ट ज्ञान)',
      suitEn: 'Best for researchers, astrologers, psychologists, and writers.',
      suitHi: 'शोधकर्ताओं, ज्योतिषियों, डॉक्टरों और एकांत अध्ययन हेतु उत्तम।',
      wealthIdx: 74,
      remedyEn: 'Avoid excessive screen addiction; take periodic digital detoxes.',
      remedyHi: 'अनावश्यक फोन स्क्रॉलिंग से बचें और नियमित डिजिटल डिटॉक्स करें।',
    },
    8: {
      en: 'Saturn (Shani - Big Enterprise & Contracts)',
      hi: 'शनि देव (बड़े अनुबंध, रियल एस्टेट व कानूनी सौदे)',
      suitEn: 'Strong for heavy manufacturing, real estate deals, and long-term contracts.',
      suitHi: 'रियल एस्टेट, कंस्ट्रक्शन, बड़े टेंडर व कानूनी कार्यों हेतु उपयुक्त।',
      wealthIdx: 82,
      remedyEn: 'Keep business transactions documented in writing; avoid impulsive promises.',
      remedyHi: 'फोन पर होने वाले सभी सौदों को लिखित रूप में प्रमाणित रखें।',
    },
    9: {
      en: 'Mars (Mangal - High Drive & Action)',
      hi: 'मंगल देव (साहस, त्वरित निर्णय व पराक्रम)',
      suitEn: 'Best for sports, emergency services, real estate brokers, and builders.',
      suitHi: 'प्रॉपर्टी डीलर्स, डॉक्टरों, पुलिस/सेना व त्वरित निर्णय लेने वालों हेतु।',
      wealthIdx: 84,
      remedyEn: 'Avoid quick temper on calls; listen completely before responding.',
      remedyHi: 'कॉल पर बात करते समय शांत रहें और जल्दबाजी में प्रतिक्रिया न दें।',
    },
  };

  const pInfo = PLANET_DATA[root] || PLANET_DATA[5];
  let wealthIdx = pInfo.wealthIdx;

  if (isEndingWithZero) wealthIdx -= 8;
  if (zeroCount > 2) wealthIdx -= 6;
  if (combosFound.some((c) => c.type === 'positive')) wealthIdx += 6;
  wealthIdx = Math.min(100, Math.max(50, wealthIdx));

  let ratingEn: 'Highly Auspicious' | 'Auspicious' | 'Average / Mixed' | 'Needs Correction' = 'Auspicious';
  let ratingHi = 'शुभ व फलदायी';

  if (wealthIdx >= 90) {
    ratingEn = 'Highly Auspicious';
    ratingHi = 'अति-शुभ एवं धन-आकर्षक (Money Magnet)';
  } else if (wealthIdx >= 78) {
    ratingEn = 'Auspicious';
    ratingHi = 'अनुकूल व व्यापारिक रूप से उत्तम';
  } else {
    ratingEn = 'Needs Correction';
    ratingHi = 'सुधार योग्य / उपाय आवश्यक';
  }

  return {
    rawInput: phone,
    compoundSum: compound,
    rootNumber: root,
    planetEn: pInfo.en,
    planetHi: pInfo.hi,
    wealthIndex: wealthIdx,
    luckRatingEn: ratingEn,
    luckRatingHi: ratingHi,
    keyCombinationsFound: combosFound,
    zeroCount,
    isEndingWithZero,
    businessSuitabilityEn: pInfo.suitEn,
    businessSuitabilityHi: pInfo.suitHi,
    remedyEn: pInfo.remedyEn,
    remedyHi: pInfo.remedyHi,
  };
}

// ----------------------------------------------------
// 4. BUSINESS & BRAND NAME NUMEROLOGY
// ----------------------------------------------------
export function analyzeBusinessName(
  brandName: string,
  userMulank: number = 1,
  userBhagyank: number = 1
): BusinessNameResult {
  const clean = brandName.trim().toUpperCase();
  let cSum = 0;
  let pSum = 0;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (/[A-Z]/.test(char)) {
      cSum += CHALDEAN_MAP[char] || 0;
      pSum += PYTHAGOREAN_MAP[char] || 0;
    } else if (/[0-9]/.test(char)) {
      const v = parseInt(char, 10);
      cSum += v;
      pSum += v;
    }
  }

  const cCompound = cSum > 0 ? cSum : 1;
  const cRoot = reduceToSingleDigit(cCompound);
  const pCompound = pSum > 0 ? pSum : 1;
  const pRoot = reduceToSingleDigit(pCompound);

  const BIZ_DATABASE: Record<
    number,
    {
      en: string;
      hi: string;
      magnetism: number;
      indEn: string;
      indHi: string;
      verdictEn: string;
      verdictHi: string;
      suggEn: string;
      suggHi: string;
    }
  > = {
    1: {
      en: 'Sun (Surya - Royal Monopoly & Leadership)',
      hi: 'सूर्य देव (ब्रांड लीडरशिप व एकाधिकार)',
      magnetism: 96,
      indEn: 'Government contracting, Technology Hardware, Gold & Jewelry, Energy, Corporate HQ',
      indHi: 'उच्च कॉर्पोरेट ब्रांड, टेक्नोलॉजी, स्वर्ण व्यापार, ऊर्जा क्षेत्र व प्रशासन',
      verdictEn: 'Superb brand vibration. Commands instant trust, premium pricing, and market leadership.',
      verdictHi: 'सर्वोच्च ब्रांड प्रतिष्ठा। प्रीमियम मूल्य और मार्केट में शीर्ष स्थान दिलाने वाला अंक।',
      suggEn: 'Maintain bold, minimalist logo branding with gold, orange, or royal blue accents.',
      suggHi: 'गोल्डन या रॉयल ब्लू लोगो का प्रयोग करें और ब्रांड स्लोगन में आत्मविश्वास झलकने दें।',
    },
    2: {
      en: 'Moon (Chandra - Customer Care & Liquids)',
      hi: 'चन्द्र देव (कस्टमर केयर, पेय पदार्थ व डेयरी)',
      magnetism: 78,
      indEn: 'Beverages, Dairy, Public Relations, Travel agencies, Hospitality, Counseling',
      indHi: 'डेयरी, पेय पदार्थ, हॉस्पिटैलिटी, ट्रैवल एजेंसी व जनसंपर्क',
      verdictEn: 'Builds intense emotional customer loyalty, but pair with active marketing to sustain cash flow.',
      verdictHi: 'ग्राहकों का अटूट विश्वास जीतता है; नगदी प्रवाह को निरंतर बनाए रखने के लिए सक्रिय मार्केटिंग रखें।',
      suggEn: 'Add an extra letter if you wish to tune toward 5 (Mercury) or 6 (Venus) for aggressive sales.',
      suggHi: 'यदि अधिक आक्रामक बिक्री चाहिए, तो नाम में एक अक्षर जोड़कर इसे 5 या 6 पर ला सकते हैं।',
    },
    3: {
      en: 'Jupiter (Brihaspati - Education, Law & Abundance)',
      hi: 'देवगुरु बृहस्पति (शिक्षा, कोचिंग, कानून व कंसल्टेंसी)',
      magnetism: 92,
      indEn: 'EdTech, Legal firms, Publishing, Financial Advisory, Health institutions',
      indHi: 'एजुकेशन, लीगल फर्म, पब्लिशिंग, वित्तीय सलाहकार व आयुर्वेद',
      verdictEn: 'Highly respected in society. Attracts high-value clients and long-term institutional contracts.',
      verdictHi: 'समाज में अत्यंत सम्मानित नाम। दीर्घकालीन व प्रतिष्ठित क्लाइंट्स को आकर्षित करता है।',
      suggEn: 'Ensure marketing highlights your domain authority, certifications, and ethics.',
      suggHi: 'ब्रांडिंग में अपनी विशेषज्ञता, प्रामाणिकता और उच्च गुणवत्ता को प्रमुखता दें।',
    },
    4: {
      en: 'Rahu (Modern Innovation & Automation)',
      hi: 'राहु (सॉफ्टवेयर, डिजिटल प्लेटफॉर्म व लॉजिस्टिक्स)',
      magnetism: 80,
      indEn: 'AI Software, Cybersecurity, Electronics, Aviation, Global logistics',
      indHi: 'सॉफ्टवेयर, आर्टिफिशियल इंटेलिजेंस, इलेक्ट्रॉनिक्स व लॉजिस्टिक्स',
      verdictEn: 'High capacity for disruptive scale, but contracts must be strictly legally drafted.',
      verdictHi: 'क्रांतिकारी विस्तार की अपार क्षमता; सभी अनुबंधों को कानूनी रूप से मजबूत रखें।',
      suggEn: 'Pair with high-speed digital marketing campaigns and clear terms of service.',
      suggHi: 'आधुनिक डिजिटल विज्ञापनों और स्पष्ट सर्विस शर्तों के साथ प्रचार करें।',
    },
    5: {
      en: 'Mercury (Budha - The Golden Commercial Magnet)',
      hi: 'बुध देव (सर्वश्रेष्ठ व्यापारिक, ई-कॉमर्स व सेल्स अंक)',
      magnetism: 99,
      indEn: 'E-commerce, Retail, Trading, Digital Media, Fintech, FMCG Products',
      indHi: 'ई-कॉमर्स, रिटेल, शेयर ट्रेडिंग, डिजिटल मीडिया व उपभोक्ता उत्पाद (FMCG)',
      verdictEn: 'The most universally profitable number for business. Fast cash turnover, high viral reach.',
      verdictHi: 'व्यापार का सबसे शक्तिशाली अंक। तीव्र कैश फ्लो, बहुआयामी बिक्री और असाधारण वृद्धि।',
      suggEn: 'This spelling is in the golden zone. Retain and trademark this brand formulation.',
      suggHi: 'यह नाम स्वर्णिम व्यापारिक कंपन पर है। इसे ट्रेडमार्क कराकर सुरक्षित रखें।',
    },
    6: {
      en: 'Venus (Shukra - Luxury, Fashion & High Margins)',
      hi: 'शुक्राचार्य (लक्जरी, ब्यूटी, इंटीरियर व फैशन)',
      magnetism: 98,
      indEn: 'Fashion apparel, Cosmetics, Luxury Real Estate, Gems, Restaurants, Entertainment',
      indHi: 'फैशन, कॉस्मेटिक्स, लक्जरी रियल एस्टेट, रेस्टोरेंट व एंटरटेनमेंट',
      verdictEn: 'Exceptional for high profit margins, premium branding, and aesthetic appeal.',
      verdictHi: 'अति-उच्च लाभ मार्जिन और ब्रांड के ग्लैमरस आकर्षण के लिए सर्वोत्तम।',
      suggEn: 'Use high-end packaging, refined typography, and white/rose/gold visual aesthetics.',
      suggHi: 'प्रीमियम पैकेजिंग और सुंदर विजुअल डिज़ाइनों के साथ ग्राहकों को आकर्षित करें।',
    },
    7: {
      en: 'Ketu (Research, Pharma & Specialized Services)',
      hi: 'केतु (फार्मा, पैथोलॉजी, शोध व विशिष्ट सेवाएं)',
      magnetism: 76,
      indEn: 'Pathology Labs, Medical research, Specialized Diagnostics, Occult & Vastu consultancies',
      indHi: 'डायग्नोस्टिक लैब, फार्मा रिसर्च, वास्तु व गूढ़ विज्ञान परामर्श',
      verdictEn: 'Famous for uncompromised quality and niche specialization rather than mass retail.',
      verdictHi: 'गुणवत्ता और विशिष्ट शोध आधारित कार्यों में अद्वितीय पहचान।',
      suggEn: 'If running a retail mass-market shop, consider tuning spelling to 1, 5, or 6.',
      suggHi: 'यदि खुदरा दुकान या सामान्य व्यापार है, तो एक अक्षर जोड़कर इसे 5 या 6 पर सेट करना लाभकारी होगा।',
    },
    8: {
      en: 'Saturn (Shani - Heavy Infrastructure & Manufacturing)',
      hi: 'शनि देव (भारी उद्योग, स्टील, कंस्ट्रक्शन व माइनिंग)',
      magnetism: 85,
      indEn: 'Civil construction, Mining, Steel fabrication, Transport fleets, Oil & Gas',
      indHi: 'कंस्ट्रक्शन, स्टील, खनन, ट्रांसपोर्ट व भारी मशीनरी',
      verdictEn: 'Builds permanent, multi-decade market empires with steady compound cash reserves.',
      verdictHi: 'दशकों तक चलने वाले विशाल और स्थाई व्यापारिक साम्राज्य का निर्माण करता है।',
      suggEn: 'Emphasize structural durability, punctuality, and uncompromising quality standards.',
      suggHi: 'मजबूती, गुणवत्ता और समयबद्ध डिलीवरी को अपना मुख्य यूएसपी (USP) बनाएं।',
    },
    9: {
      en: 'Mars (Mangal - Action, Defense & Real Estate)',
      hi: 'मंगल देव (भूमि विकास, खेल उपकरण व सुरक्षा)',
      magnetism: 88,
      indEn: 'Land Development, Security agencies, Sports gear, Pharma manufacturing, Agro-farms',
      indHi: 'रियल एस्टेट, सिक्योरिटी, खेल सामग्री, फार्मा निर्माण व कृषि उद्योग',
      verdictEn: 'Dynamic, high energy execution and fearless market expansion.',
      verdictHi: 'साहसिक विस्तार और बड़े प्रोजेक्ट्स को तेजी से पूरा करने की शक्ति।',
      suggEn: 'Focus on high-speed customer fulfillment and direct, confident advertising.',
      suggHi: 'त्वरित डिलीवरी और साहसिक विज्ञापनों पर ध्यान केंद्रित करें।',
    },
  };

  const bInfo = BIZ_DATABASE[cRoot] || BIZ_DATABASE[5];

  return {
    rawName: brandName,
    chaldeanSum: cCompound,
    chaldeanRoot: cRoot,
    pythagoreanSum: pCompound,
    pythagoreanRoot: pRoot,
    planetEn: bInfo.en,
    planetHi: bInfo.hi,
    commercialMagnetismScore: bInfo.magnetism,
    industryAlignmentEn: bInfo.indEn,
    industryAlignmentHi: bInfo.indHi,
    commercialVerdictEn: bInfo.verdictEn,
    commercialVerdictHi: bInfo.verdictHi,
    enhancementSuggestionEn: bInfo.suggEn,
    enhancementSuggestionHi: bInfo.suggHi,
  };
}

// ----------------------------------------------------
// 5. VEDIC ANK DASHA & TIMELINE ENGINE
// ----------------------------------------------------
export function calculateAnkDashaTimeline(
  dobString: string,
  mulank: number,
  bhagyank: number
): {
  dashas: AnkDashaCycle[];
  currentDasha: AnkDashaCycle;
  currentAntardasha: { number: number; planetEn: string; planetHi: string; focusEn: string; focusHi: string };
} {
  const parts = dobString.split('-');
  const birthYear = parseInt(parts[0], 10) || 1995;
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  // Authentic Vedic Numerology Progression: Dasha spans across 9 planetary periods
  // The starting dasha is governed by the Mulank
  const DASHA_YEARS: Record<number, number> = {
    1: 6, // Sun
    2: 10, // Moon
    3: 16, // Jupiter
    4: 18, // Rahu
    5: 17, // Mercury
    6: 20, // Venus
    7: 7, // Ketu
    8: 19, // Saturn
    9: 7, // Mars
  };

  const PLANET_NAMES: Record<number, { en: string; hi: string; themeEn: string; themeHi: string }> = {
    1: {
      en: 'Sun (Surya)',
      hi: 'सूर्य देव',
      themeEn: 'Authority, promotion, public recognition, father support, executive power',
      themeHi: 'पदोन्नति, उच्च पद, पिता का सहयोग, यश व आत्मबल में वृद्धि',
    },
    2: {
      en: 'Moon (Chandra)',
      hi: 'चन्द्र देव',
      themeEn: 'Emotional fulfillment, travel, marriage/partnership, creative arts',
      themeHi: 'मानसिक प्रसन्नता, विवाह, लंबी यात्राएं, कला व रचनात्मक सफलता',
    },
    3: {
      en: 'Jupiter (Brihaspati)',
      hi: 'देवगुरु बृहस्पति',
      themeEn: 'High learning, wealth accumulation, children, spiritual elevation',
      themeHi: 'विपुल धन लाभ, संतान सुख, उच्च शिक्षा, गुरु कृपा व प्रतिष्ठा',
    },
    4: {
      en: 'Rahu',
      hi: 'राहु देव',
      themeEn: 'Sudden breakthroughs, international travel, tech innovation, high ambition',
      themeHi: 'आकस्मिक सफलता, विदेश यात्रा, तकनीकी शोध व साहसिक योजनाएं',
    },
    5: {
      en: 'Mercury (Budha)',
      hi: 'बुध देव',
      themeEn: 'Massive business expansion, communication, stock gains, multiple income streams',
      themeHi: 'व्यापार में अप्रत्याशित वृद्धि, वाकपटुता, शेयर लाभ व नए संपर्क',
    },
    6: {
      en: 'Venus (Shukra)',
      hi: 'शुक्राचार्य',
      themeEn: 'Luxury vehicles, mansion construction, glamour, marital bliss, financial prosperity',
      themeHi: 'नया वाहन, आलीशान मकान, दांपत्य सुख, विलासिता व आकस्मिक धन',
    },
    7: {
      en: 'Ketu',
      hi: 'केतु देव',
      themeEn: 'Spiritual mastery, deep analytical research, property purchase, intuition',
      themeHi: 'आध्यात्मिक जागृति, शोध कार्य, अचल संपत्ति व अंतर्ज्ञान की शक्ति',
    },
    8: {
      en: 'Saturn (Shani)',
      hi: 'शनि देव',
      themeEn: 'Massive empire building, legal triumphs, hard-earned permanent wealth, discipline',
      themeHi: 'स्थाई संपत्ति निर्माण, कानूनी विजय, कड़े परिश्रम का स्वर्णिम फल',
    },
    9: {
      en: 'Mars (Mangal)',
      hi: 'मंगल देव',
      themeEn: 'Dynamic courage, sports & real estate leadership, victory over competitors',
      themeHi: 'शत्रुओं पर विजय, भूमि क्रय-विक्रय, पराक्रम व प्रशासनिक अधिकार',
    },
  };

  const dashaSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Reorder sequence starting from Mulank
  const startIdx = dashaSequence.indexOf(mulank);
  const reordered = [...dashaSequence.slice(startIdx), ...dashaSequence.slice(0, startIdx)];

  const dashas: AnkDashaCycle[] = [];
  let runningAge = 0;

  for (let i = 0; i < reordered.length; i++) {
    const num = reordered[i];
    const duration = DASHA_YEARS[num] || 10;
    const startAge = runningAge;
    const endAge = runningAge + duration;
    const startYr = birthYear + startAge;
    const endYr = birthYear + endAge;
    const isCur = currentAge >= startAge && currentAge < endAge;

    const pMeta = PLANET_NAMES[num] || PLANET_NAMES[1];

    dashas.push({
      dashaNumber: num,
      planetEn: pMeta.en,
      planetHi: pMeta.hi,
      startAge,
      endAge,
      startYear: startYr,
      endYear: endYr,
      isCurrent: isCur,
      themeEn: pMeta.themeEn,
      themeHi: pMeta.themeHi,
      opportunitiesEn: [
        `High activation of ${pMeta.en} planetary powers`,
        `Favorable for major milestones related to ${pMeta.themeEn}`,
      ],
      opportunitiesHi: [
        `${pMeta.hi} के शुभ प्रभाव से जीवन में नए अवसरों का सृजन`,
        `${pMeta.themeHi} के क्षेत्र में महत्वपूर्ण सफलता`,
      ],
      precautionsEn: [`Maintain balance in ${pMeta.en} energies`, 'Perform regular Vedic remedies for optimal harmony'],
      precautionsHi: [`${pMeta.hi} की नकारात्मकता से बचने हेतु उपाय करें`, 'शुभ तिथियों का ध्यान रखें'],
    });

    runningAge = endAge;
  }

  const currentDasha = dashas.find((d) => d.isCurrent) || dashas[0];

  // Calculate Antardasha (Sub-period within current Dasha)
  // Determined by year progression
  const yearsInDasha = Math.max(0, currentYear - currentDasha.startYear);
  const adNum = reduceToSingleDigit(currentDasha.dashaNumber + yearsInDasha);
  const adMeta = PLANET_NAMES[adNum] || PLANET_NAMES[1];

  return {
    dashas,
    currentDasha,
    currentAntardasha: {
      number: adNum,
      planetEn: adMeta.en,
      planetHi: adMeta.hi,
      focusEn: `Current sub-vibration activating ${adMeta.themeEn}`,
      focusHi: `वर्तमान सूक्ष्म अंतर-कंपन: ${adMeta.themeHi}`,
    },
  };
}
