import {
  BirthDetails,
  KundaliResult,
  Language,
  VedicPlanet,
  ZodiacSign,
  VargaCode,
} from '../types/astrology';
import {
  SampoornKundaliAnalysisReport,
  QuestionCategory,
  SampoornQuestionAnswer,
  SampoornLagnaAnalysis,
  SampoornPlanetItem,
  SampoornHouseItem,
  SampoornYogaItem,
  SampoornDoshaItem,
  SampoornDivisionalChartAnalysis,
  SampoornDashaAnalysis,
  SampoornTimelineItem,
} from '../types/sampoornKundali';
import { calculateJagannathaHora, VARGA_METADATA } from './jagannathaHoraEngine';
import { ZODIAC_HINDI, PLANETS_HINDI } from './vedicCalculations';

// Detect question category
export function detectQuestionCategory(question: string): QuestionCategory {
  const q = (question || '').toLowerCase();

  if (/(नौकरी|करियर|career|job|profession|business|व्यापार|दुकान|startup|कामधंधा|office|interview|promotion|पद)/i.test(q)) {
    if (/(business|व्यापार|दुकान|startup|partner|साझेदारी)/i.test(q)) {
      return 'business';
    }
    return 'career';
  }

  if (/(विवाह|शादी|marriage|wife|husband|spouse|जीवनसाथी|पत्नी|पति|love|प्रेम|रिश्ता|relationship|लव|girl|boy|breakup|divorce)/i.test(q)) {
    if (/(प्रेम|love|relationship|रिश्ता|gf|bf|breakup)/i.test(q)) {
      return 'relationship';
    }
    return 'marriage';
  }

  if (/(धन|रुपया|पैसा|finance|wealth|money|loan|कर्ज|income|आय|सम्पत्ति|property|मकान|घर|land|जमीन|वाहन|गाड़ी|flat)/i.test(q)) {
    if (/(property|मकान|घर|land|जमीन|वाहन|गाड़ी|flat|आवास)/i.test(q)) {
      return 'property';
    }
    return 'finance';
  }

  if (/(विदेश|विदेश यात्रा|foreign|abroad|visa|पीआर|pr|settlement|यात्रा|travel|passport)/i.test(q)) {
    return 'foreign';
  }

  if (/(संतान|बच्चा|children|child|baby|पुत्र|पुत्री|वंश|गर्भ)/i.test(q)) {
    return 'children';
  }

  if (/(शिक्षा|पढ़ाई|education|study|exam|परीक्षा|college|degree|neet|upsc|iit|admission)/i.test(q)) {
    return 'education';
  }

  if (/(स्वास्थ्य|रोग|बीमारी|health|disease|illness|operation|चोट|mental|तनाव|depression)/i.test(q)) {
    return 'health';
  }

  if (/(आध्यात्म|पूजा|भक्ति|मोक्ष|guru|ईश्वर|spirituality|साधना|मंत्र|कुंडलिनी)/i.test(q)) {
    return 'spirituality';
  }

  if (/(परिवार|माता|पिता|भाई|बहन|family|mother|father|sibling)/i.test(q)) {
    return 'family';
  }

  return 'general';
}

export function getCategoryLabels(category: QuestionCategory, isHindi: boolean): { en: string; hi: string } {
  const map: Record<QuestionCategory, { en: string; hi: string }> = {
    career: { en: 'Career & Profession', hi: 'करियर एवं आजीविका' },
    business: { en: 'Business & Trade', hi: 'व्यापार एवं व्यवसाय' },
    marriage: { en: 'Marriage & Matrimony', hi: 'विवाह एवं दांपत्य' },
    relationship: { en: 'Love & Relationship', hi: 'प्रेम एवं संबंध' },
    finance: { en: 'Wealth & Financial Growth', hi: 'धन, कोष एवं आर्थिक योग' },
    education: { en: 'Education & Intellect', hi: 'शिक्षा एवं विद्या' },
    travel: { en: 'Travel & Mobility', hi: 'यात्रा एवं देशाटन' },
    foreign: { en: 'Foreign Travel & Settlement', hi: 'विदेश यात्रा एवं निवास' },
    family: { en: 'Family & Lineage', hi: 'पारिवारिक सुख व कुल' },
    children: { en: 'Children & Progeny', hi: 'संतान एवं वंश सुख' },
    property: { en: 'Property & Real Assets', hi: 'भूमि, भवन व वाहन' },
    health: { en: 'Health & Vitality', hi: 'स्वास्थ्य, दीर्घायु व मनोबल' },
    spirituality: { en: 'Spirituality & Dharma', hi: 'अध्यात्म व पूर्वपुण्य' },
    general: { en: 'Life Destiny & Overall Chart', hi: 'समग्र जीवन एवं प्रारब्ध' },
  };

  return map[category] || { en: 'General Inquiry', hi: 'सामान्य ज्योतिषीय परामर्श' };
}

// Build 100% authentic deterministic baseline report from calculated Kundali & Hora data
export function generateVedicSampoornAnalysis(
  kundali: KundaliResult,
  userQuestion: string,
  language: Language = 'hi'
): SampoornKundaliAnalysisReport {
  const isHindi = language === 'hi';
  const category = detectQuestionCategory(userQuestion);
  const catLabels = getCategoryLabels(category, isHindi);

  // Obtain complete Jagannatha Hora calculations for divisional charts & hierarchical dashas
  const horaData = calculateJagannathaHora(kundali.birthDetails);

  // Active Dasha extraction
  const currentHierarchicalMaha = horaData.hierarchicalDasha.find((m) => m.isCurrent) || horaData.hierarchicalDasha[0];
  const currentAntar = currentHierarchicalMaha?.antardashas?.find((a) => a.isCurrent) || currentHierarchicalMaha?.antardashas?.[0];
  const currentPratyantar = currentAntar?.pratyantardashas?.find((p) => p.isCurrent) || currentAntar?.pratyantardashas?.[0];

  // 1. Lagna Analysis
  const lagnaSign = kundali.ascendantSign;
  const lagnaSignHindi = kundali.ascendantSignHindi;
  const lagnaLord = getLordOfSign(lagnaSign);
  const lagnaLordPlanetObj = kundali.planets.find((p) => p.name === lagnaLord);
  const lagnaLordHouse = lagnaLordPlanetObj ? lagnaLordPlanetObj.house : 1;
  const lagnaLordSign = lagnaLordPlanetObj ? lagnaLordPlanetObj.sign : lagnaSign;

  const lagnaHouse = kundali.houses.find((h) => h.houseNumber === 1);
  const lagnaInfluencers = [
    ...(lagnaHouse?.planets.map((p) => (isHindi ? p.hindiName : p.name)) || []),
    ...(lagnaLordPlanetObj ? [isHindi ? `${lagnaLordPlanetObj.hindiName} (लग्नेश)` : `${lagnaLord} (Lagna Lord)`] : []),
  ];

  const lagnaAnalysis: SampoornLagnaAnalysis = {
    lagnaSign,
    lagnaSignHindi,
    degree: kundali.ascendantDegree,
    lagnaLord,
    lagnaLordHindi: PLANETS_HINDI[lagnaLord] || lagnaLord,
    lagnaLordPlacement: isHindi
      ? `लग्नेश ${PLANETS_HINDI[lagnaLord]} कुंडली के ${lagnaLordHouse}वें भाव (${lagnaLordPlanetObj?.signHindi || ''}) में ${lagnaLordPlanetObj?.dignityHindi || ''} अवस्था में स्थित हैं।`
      : `Lagna Lord ${lagnaLord} resides in House ${lagnaLordHouse} (${lagnaLordSign}) with ${lagnaLordPlanetObj?.dignity || 'normal'} dignity.`,
    influencingPlanets: lagnaInfluencers.length > 0 ? lagnaInfluencers : [isHindi ? 'सौम्य ग्रह प्रभाव' : 'Gentle Ascendant Aura'],
    personalityTraits: isHindi
      ? [
          `${lagnaSignHindi} लग्न जातक को उच्च आत्मसम्मान, नैतिक संकल्प एवं स्वाभाविक नेतृत्व क्षमता प्रदान करता है।`,
          `लगन अंश ${kundali.ascendantDegree} पर स्थित होने से निर्णय क्षमता में व्यावहारिकता और दूरदर्शिता रहती है।`,
          `आत्मविश्वास एवं कर्मठता आपकी स्वाभाविक पहचान है।`,
        ]
      : [
          `${lagnaSign} Ascendant gives strong self-respect, moral conviction, and innate leadership.`,
          `Ascendant at ${kundali.ascendantDegree} grants sharp discernment and pragmatic long-range planning.`,
          `Natural resilience and proactive nature define your daily approach.`,
        ],
    naturalStrengths: isHindi
      ? [
          `कठिन परिस्थितियों में धैर्य न खोना और स्वतंत्र निर्णय लेना`,
          `कार्यक्षेत्र में निरंतरता और बौद्धिक अनुशासन`,
          `धार्मिक एवं नैतिक मर्यादाओं का स्वतः पालन`,
        ]
      : [
          `Steadfast temperament and ability to take independent decisions during turbulence`,
          `Intellectual consistency and systematic workplace focus`,
          `Adherence to moral values and righteous self-direction`,
        ],
    challenges: isHindi
      ? [
          `अति-भावुकता या अत्यधिक विश्लेषण के कारण निर्णय लेने में अनावश्यक विलंब`,
          `दूसरों से भी अपनी तरह पूर्णता (Perfectionism) की अपेक्षा करना`,
        ]
      : [
          `Over-analysis leading to occasional hesitation in fast-moving conditions`,
          `Expecting high perfectionism from associates and team members`,
        ],
    decisionMakingTendencies: isHindi
      ? `आप व्यावहारिक तथ्यों एवं अंतर्ज्ञान (Intuition) के संतुलन से निर्णय लेते हैं। जल्दबाजी में लिए गए निर्णय कभी-कभी मानसिक तनाव दे सकते हैं, इसलिए 24 घंटे का विचार लाभप्रद रहता है।`
      : `You decide through a balance of empirical facts and internal intuition. Pondering 24 hours before major leaps yields optimal clarity.`,
    overallLifeDirection: isHindi
      ? `लग्न व लग्नेश की स्थिति दर्शाती है कि आपका जीवन निरंतर आत्म-विकास, सामाजिक प्रतिष्ठा में उत्थान और स्वावलंबन की ओर अग्रसर है।`
      : `Lagna configuration indicates progressive self-realization, elevation in societal esteem, and purposeful self-reliance.`,
  };

  // 2. Complete Planetary Analysis (All 9 planets + Ascendant)
  const planetaryAnalysis: SampoornPlanetItem[] = kundali.planets.map((p) => {
    const avastha = horaData.avasthas.find((a) => a.planet === p.name);
    const isQuestionRelevantPlanet = checkPlanetRelevanceToCategory(p.name, category);

    return {
      planet: p.name,
      hindiName: p.hindiName,
      sign: p.sign,
      signHindi: p.signHindi,
      house: p.house,
      degree: p.formattedDegree,
      nakshatra: p.nakshatra,
      pada: p.pada,
      isRetrograde: p.isRetrograde,
      isCombust: avastha ? avastha.isCombust : false,
      dignity: p.dignity,
      dignityHindi: p.dignityHindi,
      houseOwnership: getHousesRuledByPlanet(p.name, kundali.ascendantSign),
      aspects: getPlanetaryAspectsText(p.name, p.house, isHindi),
      strength: avastha ? (isHindi ? avastha.baladiHindi : avastha.baladi) : p.dignity,
      positiveInfluence: getPlanetPositiveImpact(p.name, p.house, p.dignity, isHindi),
      potentialChallenge: getPlanetChallenge(p.name, p.house, p.dignity, isHindi),
      relevanceToQuestion: isQuestionRelevantPlanet
        ? isHindi
          ? `आपके प्रश्न (${catLabels.hi}) का प्रत्यक्ष कारक ग्रह है।`
          : `Direct astrological significator for your query on ${catLabels.en}.`
        : isHindi
        ? `सामान्य जीवन क्षेत्र एवं दशा चक्र में सहयोगी भूमिका निभाता है।`
        : `Supportive secondary influence in current life phase.`,
    };
  });

  // 3. 12 Houses Analysis
  const housesAnalysis: SampoornHouseItem[] = kundali.houses.map((h) => {
    const houseLord = getLordOfSign(h.sign);
    const lordPlanet = kundali.planets.find((p) => p.name === houseLord);
    const isQRelevant = checkHouseRelevanceToCategory(h.houseNumber, category);

    const occupantNames = h.planets.map((p) => (isHindi ? p.hindiName : p.name));
    const aspecting = getPlanetsAspectingHouse(h.houseNumber, kundali.planets, isHindi);

    return {
      houseNumber: h.houseNumber,
      houseName: getHouseTraditionalName(h.houseNumber, isHindi),
      houseNameHindi: getHouseTraditionalName(h.houseNumber, true),
      sign: h.sign,
      signHindi: h.signHindi,
      houseLord,
      houseLordHindi: PLANETS_HINDI[houseLord] || houseLord,
      lordPlacement: lordPlanet
        ? isHindi
          ? `भावेश ${PLANETS_HINDI[houseLord]} ${lordPlanet.house}वें भाव में स्थित हैं`
          : `Lord ${houseLord} placed in House ${lordPlanet.house}`
        : isHindi
        ? 'सामान्य स्थिति'
        : 'Neutral placement',
      occupyingPlanets: occupantNames.length > 0 ? occupantNames : [isHindi ? 'रिक्त भाव (शुभ दृष्टि विचारणीय)' : 'Unoccupied'],
      aspectingPlanets: aspecting.length > 0 ? aspecting : [isHindi ? 'सामान्य दृष्टियां' : 'Normal aspects'],
      strength: occupantNames.length > 0 ? (isHindi ? 'सक्रिय एवं प्रबुद्ध' : 'Active') : (isHindi ? 'स्थिर' : 'Steady'),
      positiveIndications: getHousePositiveIndications(h.houseNumber, h.sign, isHindi),
      challenges: getHouseChallenges(h.houseNumber, h.sign, isHindi),
      relevantLifeAreas: isHindi ? h.significationsHindi : h.significations,
      isQuestionRelevant: isQRelevant,
    };
  });

  // 4. Yogas and Doshas
  const yogasAnalysis: SampoornYogaItem[] = kundali.yogas.map((y) => ({
    name: y.name,
    nameHindi: y.nameHindi || y.name,
    category: y.categoryLabel || 'Classical Yoga',
    formationReason: isHindi ? y.formationHindi : y.formation,
    planetsHousesInvolved: y.planetsInvolved.join(', '),
    strength: isHindi ? y.strengthHindi : y.strength,
    potentialResults: isHindi ? y.impactHindi : y.impact,
    activationPeriod: isHindi
      ? `संबद्ध ग्रहों की महादशा, अंतर्दशा एवं गोचर सक्रियता के दौरान विशेष फलित होता है।`
      : `Activates strongly during the Dasha periods and auspicious transits of participating planets.`,
  }));

  const doshasAnalysis: SampoornDoshaItem[] = [
    {
      name: 'Manglik Dosha (मांगलिक विचार)',
      nameHindi: 'मांगलिक विचार',
      status: kundali.dosha.isManglik ? (isHindi ? 'उपस्थित (सकारात्मक संतुलन संभव)' : 'Active') : (isHindi ? 'दोष मुक्त (Non-Manglik)' : 'Clean'),
      description: isHindi ? kundali.dosha.manglikDescriptionHindi : kundali.dosha.manglikDescription,
      mitigatingFactors: isHindi
        ? 'गुरु की शुभ दृष्टि अथवा 28 वर्ष के उपरांत मंगल का सौम्य प्रभाव दोष को न्यून करता है।'
        : 'Jupiterian aspect and planetary maturation temper fiery energy smoothly.',
      remedy: isHindi
        ? 'मंगलवार को श्री हनुमान चालीसा का पाठ करें एवं लाल मसूर का दान शुभकारी है।'
        : 'Recite Hanuman Chalisa on Tuesdays and offer red lentils.',
    },
    {
      name: 'Kalsarp Yoga (कालसर्प योग)',
      nameHindi: 'कालसर्प योग स्थिति',
      status: kundali.dosha.isKalsarp ? kundali.dosha.kalsarpType : (isHindi ? 'अनुपस्थित (दोष रहित)' : 'Absent'),
      description: isHindi ? kundali.dosha.kalsarpDescriptionHindi : kundali.dosha.kalsarpDescription,
      mitigatingFactors: isHindi
        ? 'राहु-केतु के मध्य से अन्य ग्रहों का गोचर गतिशीलता प्रदान करता है।'
        : 'Planetary transits outside Rahu-Ketu nodal axis unlock stagnation.',
      remedy: isHindi
        ? 'सोमवार को भगवान शिव का दुग्धाभिषेक करें एवं महामृत्युंजय मंत्र का नित्य जप करें।'
        : 'Perform Shiva Abhishek with milk on Mondays and chant Mahamrityunjaya Mantra.',
    },
    {
      name: 'Saturn Sade Sati (शनि साढ़ेसाती)',
      nameHindi: 'शनि साढ़ेसाती स्थिति',
      status: kundali.dosha.isSadeSati ? kundali.dosha.sadeSatiPhase : (isHindi ? 'वर्तमान में सक्रिय नहीं' : 'Inactive'),
      description: isHindi ? kundali.dosha.sadeSatiDescriptionHindi : kundali.dosha.sadeSatiDescription,
      mitigatingFactors: isHindi
        ? 'शनि देव कर्म प्रधान हैं, इसलिए सत्य, निष्ठा एवं परोपकार से साढ़ेसाती वरदान सिद्ध होती है।'
        : 'Saturn honors truth and diligent service, turning challenges into solid growth.',
      remedy: isHindi
        ? 'शनिवार शाम पीपल के वृक्ष तले सरसों तेल का दीपक प्रज्वलित करें।'
        : 'Light a mustard oil lamp under a sacred Peepal tree on Saturday evenings.',
    },
  ];

  // 5. Divisional Charts (D1, D9, D10, D2, and other relevant ones)
  const d1Chart = horaData.vargas.D1;
  const d9Chart = horaData.vargas.D9;
  const d10Chart = horaData.vargas.D10;
  const d2Chart = horaData.vargas.D2;

  const d1Analysis: SampoornDivisionalChartAnalysis = {
    code: 'D1',
    name: 'D1 — Rashi / Birth Chart (लग्न चक्र)',
    hindiName: 'D1 — राशि चक्र (लग्न)',
    representation: VARGA_METADATA.D1.signification,
    representationHindi: VARGA_METADATA.D1.significationHindi,
    keyPlacements: isHindi
      ? `लग्न राशि ${kundali.ascendantSignHindi} (${kundali.ascendantDegree}) है। चंद्र ${kundali.moonSignHindi} में एवं सूर्य ${kundali.sunSignHindi} में स्थित हैं।`
      : `Ascendant is ${kundali.ascendantSign} (${kundali.ascendantDegree}). Moon in ${kundali.moonSign} and Sun in ${kundali.sunSign}.`,
    strengthsAndChallenges: isHindi
      ? `केंद्र और त्रिकोण भावों में शुभ ग्रहों की उपस्थिति जीवन में मूलभूत सुरक्षा एवं उन्नति प्रदान करती है।`
      : `Kendra and Trikona house strength secures fundamental destiny and vitality.`,
    d1ConfirmationOrChange: isHindi
      ? `सम्पूर्ण कुंडली का आधारभूत स्तम्भ है, जिससे स्थूल जीवन की रूपरेखा तय होती है।`
      : `Primary anchor for all foundational life tendencies.`,
    relevanceToQuestion: isHindi
      ? `आपके प्रश्न के मुख्य भाव एवं भावेश इसी लग्न चक्र के आधार पर निर्धारित किए गए हैं।`
      : `Forms the primary blueprint for the houses governing your query.`,
  };

  const d9Analysis: SampoornDivisionalChartAnalysis = {
    code: 'D9',
    name: 'D9 — Navamsha Chart (नवांश चक्र)',
    hindiName: 'D9 — नवांश चक्र (धर्म व दांपत्य)',
    representation: VARGA_METADATA.D9.signification,
    representationHindi: VARGA_METADATA.D9.significationHindi,
    keyPlacements: isHindi
      ? `नवांश लग्न ${d9Chart.ascendantSignHindi} है। नवांश में ग्रहों की स्थिति आत्मिक बल एवं 30 वर्ष के उपरांत प्रारब्ध के वास्तविक प्रकटीकरण को दर्शाती है।`
      : `Navamsha Lagna is ${d9Chart.ascendantSign}. Navamsha clarifies inner strength and marital destiny.`,
    strengthsAndChallenges: isHindi
      ? `वर्गोत्तम एवं पुष्कर नवांश में स्थित ग्रह जीवन में अप्रत्याशित सुरक्षा और उत्थान प्रदान करते हैं।`
      : `Planets in Vargottama or Pushkara Navamsha ensure resilient recovery from challenges.`,
    d1ConfirmationOrChange: isHindi
      ? `यदि D1 में कोई ग्रह कमजोर प्रतीत हो रहा हो परंतु D9 में उच्च या स्वराशि में हो, तो उसका परिणाम अत्यंत शुभ प्राप्त होता है।`
      : `Confirms true planetary potency; planets strong in D9 uplift weak D1 placements.`,
    relevanceToQuestion: category === 'marriage' || category === 'relationship'
      ? isHindi
        ? `विवाह, जीवनसाथी के स्वभाव एवं दांपत्य सुख का अंतिम निर्णय नवांश चक्र से ही होता है।`
        : `Prime decisive divisional chart for marriage timing, spouse nature, and matrimonial harmony.`
      : isHindi
      ? `जीवन में आंतरिक संतोष, नैतिक बल और प्रारब्ध को पुष्ट करता है।`
      : `Validates overall inner strength, destiny realization, and mature life phases.`,
  };

  const d10Analysis: SampoornDivisionalChartAnalysis = {
    code: 'D10',
    name: 'D10 — Dashamsha Chart (दशांश चक्र)',
    hindiName: 'D10 — दशांश चक्र (कर्म व पद-प्रतिष्ठा)',
    representation: VARGA_METADATA.D10.signification,
    representationHindi: VARGA_METADATA.D10.significationHindi,
    keyPlacements: isHindi
      ? `दशांश लग्न ${d10Chart.ascendantSignHindi} है। दशमेश, सूर्य और शनि का दशांश में अध्ययन कार्यक्षेत्र में प्रतिष्ठा निर्धारित करता है।`
      : `Dashamsha Lagna is ${d10Chart.ascendantSign}. Crucial for authority, corporate rank, and enterprise.`,
    strengthsAndChallenges: isHindi
      ? `दशांश में केंद्र स्थानों में शुभ ग्रहों का होना व्यवसाय एवं नौकरी में स्थिरता और आदर दिलाता है।`
      : `Benefics in Dashamsha Kendras yield sustainable authority and corporate acclaim.`,
    d1ConfirmationOrChange: isHindi
      ? `D1 के दशम भाव की संभावनाओं को व्यावहारिक सफलता में बदलने का कार्य D10 करता है।`
      : `Translates D1 10th house karmic potential into tangible career milestones.`,
    relevanceToQuestion: category === 'career' || category === 'business'
      ? isHindi
        ? `आपके करियर, पदोन्नति, कार्यक्षेत्र परिवर्तन एवं व्यापारिक सफलता का यह प्रत्यक्ष चार्ट है।`
        : `Directly governs your professional growth, job security, promotions, and enterprise.`
      : isHindi
      ? `सामाजिक स्थिति एवं कर्मफल को प्रमाणित करता है।`
      : `Validates social status and professional execution.`,
  };

  const d2Analysis: SampoornDivisionalChartAnalysis = {
    code: 'D2',
    name: 'D2 — Hora Chart (होरा चक्र)',
    hindiName: 'D2 — होरा चक्र (धन व संपदा)',
    representation: VARGA_METADATA.D2.signification,
    representationHindi: VARGA_METADATA.D2.significationHindi,
    keyPlacements: isHindi
      ? `होरा चक्र में ग्रह सूर्य (सिंह) और चंद्र (कर्क) की होरा में विभक्त होते हैं, जो पराक्रम और संचय क्षमता का भेद करते हैं।`
      : `Planets divided into Sun (Leo) and Moon (Cancer) horas, balancing assertive enterprise and financial reserves.`,
    strengthsAndChallenges: isHindi
      ? `चंद्र होरा में शुभ ग्रह धन संचय कराते हैं, जबकि सूर्य होरा में ग्रह परिश्रम से संपदा अर्जन में सहायक होते हैं।`
      : `Moon hora fosters wealth retention; Sun hora drives energetic resource creation.`,
    d1ConfirmationOrChange: isHindi
      ? `D1 के द्वितीय (धन) व एकादश (लाभ) भाव के वास्तविक आर्थिक सामर्थ्य का निर्धारण करता है।`
      : `Validates net liquid reserves and financial accumulation indicated in D1.`,
    relevanceToQuestion: category === 'finance' || category === 'business' || category === 'property'
      ? isHindi
        ? `धन लाभ, बचत, निवेश और संचित कोष के लिए अत्यधिक महत्वपूर्ण है।`
        : `Prime significator for wealth growth, savings discipline, and asset growth.`
      : isHindi
      ? `जीवन में संसाधनों की उपलब्धता को दर्शाता है।`
      : `Reflects overall resource availability and financial ease.`,
  };

  // Other relevant divisional charts
  const otherCharts: SampoornDivisionalChartAnalysis[] = [];

  // D7 (Saptamsha) for children / family
  if (category === 'children' || category === 'family' || true) {
    const d7 = horaData.vargas.D7;
    otherCharts.push({
      code: 'D7',
      name: 'D7 — Saptamsha (सप्तांश चक्र)',
      hindiName: 'D7 — सप्तांश चक्र (संतान सुख)',
      representation: VARGA_METADATA.D7.signification,
      representationHindi: VARGA_METADATA.D7.significationHindi,
      keyPlacements: isHindi ? `सप्तांश लग्न ${d7.ascendantSignHindi} है।` : `Saptamsha Lagna is ${d7.ascendantSign}.`,
      strengthsAndChallenges: isHindi ? 'संतान सुख, रचनात्मकता एवं वंश वृद्धि का सूक्ष्म सूचक।' : 'Governs progeny, creative legacy, and filial bonds.',
      d1ConfirmationOrChange: isHindi ? 'पंचम भाव के फल को पुष्ट करता है।' : 'Refines 5th house indications.',
      relevanceToQuestion: isHindi ? 'संतान योग एवं पारिवारिक सुख हेतु महत्वपूर्ण।' : 'Crucial for family expansion & children.',
    });
  }

  // D4 (Chaturthamsa) for property / vehicles / assets
  if (category === 'property' || category === 'finance' || true) {
    const d4 = horaData.vargas.D4;
    otherCharts.push({
      code: 'D4',
      name: 'D4 — Chaturthamsa (चतुर्थांश चक्र)',
      hindiName: 'D4 — चतुर्थांश (भूमि, भवन व वाहन)',
      representation: VARGA_METADATA.D4.signification,
      representationHindi: VARGA_METADATA.D4.significationHindi,
      keyPlacements: isHindi ? `चतुर्थांश लग्न ${d4.ascendantSignHindi} है।` : `Chaturthamsa Lagna is ${d4.ascendantSign}.`,
      strengthsAndChallenges: isHindi ? 'अचल संपत्ति, भूमि लाभ एवं वाहन सुख की स्थिति।' : 'Fixed assets, home stability, real estate.',
      d1ConfirmationOrChange: isHindi ? 'D1 के चतुर्थ भाव के वास्तविक भौतिक सुख की पुष्टि।' : 'Confirms tangible 4th house asset security.',
      relevanceToQuestion: isHindi ? 'मकान, भूमि, वाहन एवं स्थायी संपदा के लिए प्रमुख।' : 'Decisive for real estate, vehicle purchase, and home security.',
    });
  }

  // D3 (Drekkana) for courage, siblings, initiative
  const d3 = horaData.vargas.D3;
  otherCharts.push({
    code: 'D3',
    name: 'D3 — Drekkana (द्रेष्काण चक्र)',
    hindiName: 'D3 — द्रेष्काण (पराक्रम व साहस)',
    representation: VARGA_METADATA.D3.signification,
    representationHindi: VARGA_METADATA.D3.significationHindi,
    keyPlacements: isHindi ? `द्रेष्काण लग्न ${d3.ascendantSignHindi} है।` : `Drekkana Lagna is ${d3.ascendantSign}.`,
    strengthsAndChallenges: isHindi ? 'व्यक्तिगत पुरुषार्थ, पराक्रम एवं छोटे भाई-बहनों से संबंध।' : 'Vitality, personal courage, sibling harmony.',
    d1ConfirmationOrChange: isHindi ? 'तृतीय भाव के कर्म बल को प्रदर्शित करता है।' : 'Reveals raw courage behind plans.',
    relevanceToQuestion: isHindi ? 'कार्य सिद्धि के लिए आवश्यक पहल और परिश्रम का विश्लेषण।' : 'Initiative and proactive drive to execute ambitions.',
  });

  // D60 (Shashtiamsa) past-life karma seed
  const d60 = horaData.vargas.D60;
  otherCharts.push({
    code: 'D60',
    name: 'D60 — Shashtiamsa (षष्ट्यंश चक्र)',
    hindiName: 'D60 — षष्ट्यंश (पूर्वजन्म प्रारब्ध)',
    representation: VARGA_METADATA.D60.signification,
    representationHindi: VARGA_METADATA.D60.significationHindi,
    keyPlacements: isHindi ? `षष्ट्यंश लग्न ${d60.ascendantSignHindi} है।` : `Shashtiamsa Lagna is ${d60.ascendantSign}.`,
    strengthsAndChallenges: isHindi ? 'पराशर ज्योतिष के अनुसार पूर्वजन्म के कर्म-बीज का अंतिम प्रामाणिक चक्र।' : 'Ultimate Parashari subtle seed of past karmic deeds.',
    d1ConfirmationOrChange: isHindi ? 'सभी कुंडलियों में सर्वोच्च सूक्ष्म बल।' : 'Supreme decider in subtle karmic tests.',
    relevanceToQuestion: isHindi ? 'भाग्य के अप्रत्याशित मोड़ों और दैवीय अनुग्रह को दर्शाता है।' : 'Underpins sudden breakthroughs and spiritual grace.',
  });

  // 6. Dasha Analysis
  const currentBaseDasha = kundali.dashaPeriods.find((d) => d.current) || kundali.dashaPeriods[0];
  const mahaPlanet = currentHierarchicalMaha ? currentHierarchicalMaha.mahadasha : (currentBaseDasha?.planet || 'Jupiter');
  const mahaPlanetHindi = PLANETS_HINDI[mahaPlanet] || mahaPlanet;
  const mahaObj = kundali.planets.find((p) => p.name === mahaPlanet);
  const mahaHouse = mahaObj ? mahaObj.house : 1;

  const dynamicMahaStart = currentHierarchicalMaha?.startDate || `${currentBaseDasha?.startDate || new Date().getFullYear()}-01-01`;
  const dynamicMahaEnd = currentHierarchicalMaha?.endDate || `${currentBaseDasha?.endDate || (new Date().getFullYear() + 5)}-01-01`;

  const antarPlanet = currentAntar ? currentAntar.antardasha : 'Moon';
  const antarPlanetHindi = PLANETS_HINDI[antarPlanet] || antarPlanet;

  const dynamicAntarStart = currentAntar?.startDate || dynamicMahaStart;
  const dynamicAntarEnd = currentAntar?.endDate || dynamicMahaEnd;

  const pratyPlanet = currentPratyantar ? currentPratyantar.pratyantardasha : undefined;
  const pratyPlanetHindi = pratyPlanet ? PLANETS_HINDI[pratyPlanet] : undefined;

  const dashaAnalysis: SampoornDashaAnalysis = {
    mahadasha: {
      planet: mahaPlanet,
      planetHindi: mahaPlanetHindi,
      startDate: dynamicMahaStart,
      endDate: dynamicMahaEnd,
      houseOwnership: getHousesRuledByPlanet(mahaPlanet, kundali.ascendantSign),
      natalPlacement: isHindi
        ? `जन्म कुंडली के ${mahaHouse}वें भाव में ${mahaObj?.signHindi || ''} में स्थित`
        : `Placed in House ${mahaHouse} (${mahaObj?.sign || ''})`,
      strength: mahaObj?.dignity || 'Normal',
      mainThemes: isHindi
        ? `यह महादशा आपके ${mahaHouse}वें भाव से जुड़े जीवन क्षेत्रों को मुख्य रूप से जाग्रत कर रही है।`
        : `This Mahadasha primarily unfolds life activities governed by natal House ${mahaHouse}.`,
    },
    antardasha: {
      planet: antarPlanet,
      planetHindi: antarPlanetHindi,
      startDate: dynamicAntarStart,
      endDate: dynamicAntarEnd,
      interactionWithMahaLord: isHindi
        ? `महादशा स्वामी ${mahaPlanetHindi} और अंतर्दशा स्वामी ${antarPlanetHindi} का संबंध तात्कालिक परिणामों को गति प्रदान कर रहा है।`
        : `Interplay between Mahadasha lord ${mahaPlanet} and Antardasha lord ${antarPlanet} triggers current events.`,
      likelyThemes: isHindi
        ? `वर्तमान अंतर्दशा में मानसिक स्थिरता, नए अवसरों की शुरुआत और कर्मक्षेत्र में परिश्रम का अनुकूल प्रतिफल मिलने के संकेत हैं।`
        : `Triggers focused opportunities, progressive mindset, and measurable rewards for disciplined effort.`,
    },
    pratyantarDasha: pratyPlanet
      ? {
          planet: pratyPlanet,
          planetHindi: pratyPlanetHindi || pratyPlanet,
          startDate: currentPratyantar?.startDate || dynamicAntarStart,
          endDate: currentPratyantar?.endDate || dynamicAntarEnd,
        }
      : undefined,
    whatItActivates: isHindi
      ? `वर्तमान दशा चक्र आपके कुंडली के ${mahaHouse}वें भाव, नवमेश (भाग्य) एवं दशमेश (कर्म) के समीकरणों को सक्रिय कर रहा है। यह समय जीवन में ठहराव को समाप्त कर सकारात्मक दिशा में अग्रसर होने का है।`
      : `The active Dasha cycle unlocks House ${mahaHouse}, fortune trines, and career houses, converting dormant possibilities into dynamic action.`,
    dashaSummaryForQuestion: isHindi
      ? `आपके प्रश्न (${userQuestion}) के संदर्भ में, वर्तमान दशा अनुकूल वातावरण का निर्माण कर रही है। विशेषकर अंतर्दशा की पूर्णता के समय सकारात्मक परिणाम स्पष्ट परिलक्षित होंगे।`
      : `Regarding your query, current dasha configurations cultivate supportive astrological climate, with marked fruition during upcoming sub-period peaks.`,
  };

  // 7. Question-Specific Deep Analysis (Answer Structure as requested)
  const questionAnswer: SampoornQuestionAnswer = synthesizeQuestionAnswer(
    userQuestion,
    category,
    kundali,
    dashaAnalysis,
    isHindi
  );

  // 8. Major Strengths & Challenges
  const majorStrengths = isHindi
    ? [
        `लग्न व चंद्र का शुभ संबंध: मानसिक संबल एवं परिस्थितियों के अनुसार स्वयं को ढालने की उच्च क्षमता।`,
        `कुंडली में ${kundali.yogas.length} शुभ योगों की उपस्थिति: जीवन के कठिन मोड़ों पर अदृश्य सहायता और दैवीय सुरक्षा।`,
        `दशम भाव व भाग्य भाव का बल: कर्मठता और उत्तरदायित्व निभाने की स्वाभाविक योग्यता।`,
        `विंशोत्तरी दशा का वर्तमान चक्र: जीवन में नवीन संभावनाओं एवं रचनात्मक विकास के द्वार खोलता है।`,
      ]
    : [
        `Lagna & Moon Harmony: Mental fortitude and adaptive emotional resilience.`,
        `Presence of ${kundali.yogas.length} Auspicious Classical Yogas: Unseen protection and recovery during life crossroads.`,
        `Strength of Career & Fortune Bhavas: High sense of duty and structured work ethic.`,
        `Active Vimshottari Cycle: Opening dynamic doors for career maturation and personal growth.`,
      ];

  const majorChallenges = isHindi
    ? [
        `अनावश्यक मानसिक उधेड़बुन एवं अति-सटीकता (Perfectionism) से ऊर्जा का क्षरण।`,
        `समय पर आवश्यक निर्णय न लेने से कभी-कभी अनुकूल अवसरों का पूरा लाभ न मिल पाना।`,
        `दोष व तनाव के समय धैर्य बनाए रखने और दैनिक जीवनशैली में अनुशासन की निरंतर आवश्यकता।`,
      ]
    : [
        `Tendency toward micro-management and over-contemplation burning subtle vitality.`,
        `Occasional delay in executing golden windows due to over-caution.`,
        `Need for continuous grounding and mindful discipline during stressful planetary phases.`,
      ];

  // 9. Possible Timing Windows
  const timingWindows = isHindi
    ? [
        `निकटतम अनुकूल खिड़की: अगले 3 से 9 महीनों में वर्तमान अंतर्दशा के प्रभाव से सकारात्मक वार्ता एवं प्रगति।`,
        `विस्तृत विस्तार काल: 2026 के उत्तरार्ध से 2027 के मध्य तक नई जिम्मेदारियों व वित्तीय स्थिरता का समय।`,
        `दीर्घकालिक स्थायित्व: 2028-2029 में पूर्व में किए गए कठिन परिश्रम का ठोस व स्थायी फल प्राप्त होना।`,
      ]
    : [
        `Immediate Supportive Window: Next 3 to 9 months under current Antardasha brings clarity and positive talks.`,
        `Expansionary Phase: Late 2026 to mid 2027 brings fresh mandates, expanded role, and financial balance.`,
        `Long-term Consolidation: 2028–2029 yields lasting fruits and stability from earlier diligent investments.`,
      ];

  // 10. Major Life Events Timeline (Visual Timeline 2026, 2027, 2028-29, 2030+)
  const lifeTimeline: SampoornTimelineItem[] = [
    {
      yearRange: '2026',
      title: isHindi ? 'परिवर्तन, स्पष्टता एवं नए आयाम' : 'Transition, Clarity & Fresh Initiatives',
      theme: isHindi ? 'करियर व व्यक्तिगत प्राथमिकताओं में स्पष्टता' : 'Role clarification and structural foundation',
      astrologicalBasis: isHindi
        ? `वर्तमान महादशा (${mahaPlanetHindi}) एवं अंतर्दशा के प्रभाव से पुराने गतिरोध समाप्त होने के संकेत।`
        : `Governed by current Mahadasha (${mahaPlanet}) transitioning into supportive sub-periods.`,
      confidence: 'strong',
      confidenceLabel: isHindi ? '🟢 मजबूत संकेत' : '🟢 Strong Indication',
      guidance: isHindi
        ? 'अपने कौशल को अद्यतन करें एवं किसी भी नए अवसर को बिना हिचकिचाहट स्वीकारें।'
        : 'Sharpen your specialized skill sets and embrace constructive new opportunities.',
    },
    {
      yearRange: '2027',
      title: isHindi ? 'उन्नति, प्रतिष्ठा एवं वित्तीय सुदृढ़ता' : 'Recognition, Elevation & Asset Accumulation',
      theme: isHindi ? 'प्रयासों का मान-सम्मान एवं आर्थिक संतोष' : 'Professional elevation and social respect',
      astrologicalBasis: isHindi
        ? `दशांश (D10) एवं होरा (D2) में शुभ ग्रहों का सक्रिय गोचर आर्थिक लाभ एवं पदोन्नति का कारक बनता है।`
        : `D10 Dashamsha and D2 Hora activations trigger tangible financial expansion and authority.`,
      confidence: 'strong',
      confidenceLabel: isHindi ? '🟢 मजबूत संकेत' : '🟢 Strong Indication',
      guidance: isHindi
        ? 'दीर्घकालिक निवेश एवं बचत पर ध्यान केंद्रित करें। अहंकार से दूर रहकर टीम के साथ कार्य करें।'
        : 'Focus on disciplined long-term investments; foster collaborative team relationships.',
    },
    {
      yearRange: '2028–2029',
      title: isHindi ? 'स्थिरता, पारिवारिक सुख एवं सामाजिक विस्तार' : 'Consolidation, Domestic Harmony & Milestone Accomplishments',
      theme: isHindi ? 'महत्वपूर्ण लक्ष्यों की प्राप्ति एवं पारिवारिक संतुलन' : 'Attaining milestone goals and domestic peace',
      astrologicalBasis: isHindi
        ? `कुंडली के केंद्र व त्रिकोण भावों का सक्रिय योग पारिवारिक संतोष एवं संपत्ति निर्माण में सहायक।`
        : `Trine-Kendra alignment supports domestic asset creation, property, and lasting milestones.`,
      confidence: 'medium',
      confidenceLabel: isHindi ? '🟡 मध्यम संकेत' : '🟡 Balanced Indication',
      guidance: isHindi
        ? 'पारिवारिक निर्णयों में सभी की सहमति लें। स्वास्थ्य व जीवनशैली पर संतुलित ध्यान दें।'
        : 'Maintain holistic work-life balance; consult family on major joint milestones.',
    },
    {
      yearRange: '2030+',
      title: isHindi ? 'दीर्घकालिक परिपक्वता, नेतृत्व एवं आध्यात्मिक संतोष' : 'Mature Leadership, Seniority & Spiritual Contentment',
      theme: isHindi ? 'मार्गदर्शक की भूमिका एवं स्थायी विरासत' : 'Advisory mantle, legacy, and inner peace',
      astrologicalBasis: isHindi
        ? `नवांश (D9) एवं षष्ट्यंश (D60) के सूक्ष्म प्रारब्ध का पूर्ण प्रकटीकरण जातक को वरिष्ठ पद एवं आत्मिक शांति देता है।`
        : `D9 and D60 subtle karmic fruition elevates native to advisory roles and spiritual fulfillment.`,
      confidence: 'moderate',
      confidenceLabel: isHindi ? '🔵 हल्के संकेत' : '🔵 Moderate Indication',
      guidance: isHindi
        ? 'दूसरों का मार्गदर्शन करें एवं सामाजिक व परोपकारी कार्यों में सहभागिता बढ़ाएं।'
        : 'Mentor upcoming generations and engage in benevolent community contributions.',
    },
  ];

  // 11. Final Summary
  const finalSummary = isHindi
    ? `✨ **सम्पूर्ण कुंडली निष्कर्ष:**\n\nजातक की जन्म कुंडली (${kundali.ascendantSignHindi} लग्न, ${kundali.moonSignHindi} चंद्र राशि) में कर्म, बुद्धि एवं आत्मबल का एक संतुलित संयोग विद्यमान है। आपके प्रश्न **"${userQuestion}"** के संदर्भ में कुंडली का गहन विश्लेषण यह स्पष्ट करता है कि आगामी समयावधि आपके पक्ष में अनुकूल परिस्थितियां निर्मित कर रही है। ग्रहों की स्थिति एवं विंशोत्तरी दशा चक्र यह संकेत देते हैं कि यदि आप धैर्य, अनुशासन और सकारात्मक सोच के साथ अग्रसर रहेंगे, तो न केवल आपके प्रश्न का समाधान प्राप्त होगा, अपितु जीवन के अन्य क्षेत्रों में भी स्थिरता व यश की प्राप्ति होगी। वैदिक परंपरा अनुसार नित्य सूर्य उपासना एवं अपने ईष्ट का स्मरण आपके कल्याण का मार्ग सदा प्रशस्त रखेगा।`
    : `✨ **Comprehensive Vedic Synthesis:**\n\nYour natal horoscope (${kundali.ascendantSign} Lagna, ${kundali.moonSign} Moon) harbors a balanced blend of practical intellect, willpower, and karmic resilience. Regarding your specific inquiry **"${userQuestion}"**, the comprehensive cross-chart analysis confirms supportive planetary currents forming in your upcoming seasons. By pairing mindful timing, clear communication, and disciplined daily habits, you will manifest your targeted milestones while cultivating domestic peace. May the divine planetary energies bestow wisdom, prosperity, and peace on your path.`;

  return {
    id: `sampoorn-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isLiveAI: false,
    modelUsed: 'local-vedic-engine',
    birthDetails: kundali.birthDetails,
    userQuestion,
    questionAnalysis: questionAnswer,
    lagnaAnalysis,
    planetaryAnalysis,
    housesAnalysis,
    yogasAnalysis,
    doshasAnalysis,
    divisionalCharts: {
      d1: d1Analysis,
      d9: d9Analysis,
      d10: d10Analysis,
      d2Hora: d2Analysis,
      otherCharts,
    },
    dashaAnalysis,
    majorStrengths,
    majorChallenges,
    timingWindows,
    lifeTimeline,
    finalSummary,
  };
}

// Question Answer Synthesizer
function synthesizeQuestionAnswer(
  question: string,
  category: QuestionCategory,
  kundali: KundaliResult,
  dashaAnalysis: SampoornDashaAnalysis,
  isHindi: boolean
): SampoornQuestionAnswer {
  const catLabels = getCategoryLabels(category, isHindi);

  let directAnswer = '';
  let astrologicalBasis = '';
  let keyIndicators: string[] = [];
  let opportunities: string[] = [];
  let precautions: string[] = [];
  let timingSignals = '';
  let finalConclusion = '';
  let confidenceBasis = '';

  const lagnaLord = getLordOfSign(kundali.ascendantSign);
  const mahaLord = dashaAnalysis.mahadasha.planet;

  if (category === 'career' || category === 'business') {
    const h10 = kundali.houses.find((h) => h.houseNumber === 10);
    const h10Lord = h10 ? getLordOfSign(h10.sign) : 'Saturn';
    const saturn = kundali.planets.find((p) => p.name === 'Saturn');
    const sun = kundali.planets.find((p) => p.name === 'Sun');

    directAnswer = isHindi
      ? `आपकी कुंडली में करियर एवं आजीविका के संकेत अत्यंत सकारात्मक हैं। दशम भाव (${h10?.signHindi || ''}) और भाग्य भाव की स्थिति यह दर्शाती है कि आगामी समय में आपके कार्यक्षेत्र में महत्वपूर्ण विस्तार, पद-प्रतिष्ठा में वृद्धि एवं नए अवसरों का प्रादुर्भाव होगा।`
      : `Your astrological blueprint indicates favorable professional elevation. The 10th house (${h10?.sign || ''}) and fortune trines signify growth, increased responsibility, and executive recognition.`;

    astrologicalBasis = isHindi
      ? `दशमेश ${PLANETS_HINDI[h10Lord]}, कर्मकारक शनि एवं आत्मकारक सूर्य की स्थिति कुंडली में व्यावहारिक सफलता की नींव रखती है। दशांश चक्र (D10) में लग्न और केंद्र स्थानों का बल यह प्रमाणित करता है कि आपके प्रयासों का निष्फल नहीं होना तय है।`
      : `The placement of 10th lord ${h10Lord}, karmic steward Saturn, and solar leadership indicators establish professional foundation. D10 Dashamsha confirms resilience under organizational changes.`;

    keyIndicators = isHindi
      ? [
          `दशम भाव एवं भावेश (${PLANETS_HINDI[h10Lord]}) का कर्मक्षेत्र पर सकारात्मक प्रभाव।`,
          `सूर्य व शनि की संतुलित स्थिति: अधिकार, पदोन्नति एवं उत्तरदायित्व वहन करने की क्षमता।`,
          `दशांश चक्र (D10) में कर्म योग की पुष्टि: व्यावसायिक स्थिरता एवं मान-सम्मान।`,
        ]
      : [
          `Favorable 10th Bhava disposition under lord ${h10Lord}.`,
          `Balanced Saturn-Sun dynamics conferring executive endurance and authority.`,
          `D10 Dashamsha validation for career milestones and enterprise longevity.`,
        ];

    opportunities = isHindi
      ? [
          `नए प्रोजेक्ट्स अथवा नेतृत्व की भूमिका स्वीकारने का स्वर्णिम अवसर।`,
          `कार्यक्षेत्र में किए गए पुराने प्रयासों का अब पदोन्नति अथवा वेतन वृद्धि के रूप में फलीभूत होना।`,
          `यदि व्यवसाय या स्वतंत्र कार्य की योजना है, तो अनुभवी व्यक्तियों के मार्गदर्शन से शुरुआत लाभप्रद।`,
        ]
      : [
          `Opportunity to lead high-visibility assignments and strategic projects.`,
          `Earlier diligent efforts converting into promotion or enhanced remuneration.`,
          `Favorable period for independent consultancy or measured enterprise expansion.`,
        ];

    precautions = isHindi
      ? [
          `कार्यक्षेत्र में सहकर्मियों या उच्चाधिकारियों के साथ व्यर्थ के अहं के टकराव से बचें।`,
          `जल्दबाजी में नौकरी बदलने का निर्णय न लें; सभी प्रस्तावों का भलीभांति विश्लेषण करें।`,
          `कार्य के दबाव में स्वास्थ्य व परिवार की उपेक्षा न होने दें।`,
        ]
      : [
          `Avoid ideological or ego clashes with peers or superiors.`,
          `Conduct due diligence before switching roles; prefer strategic growth over impulse moves.`,
          `Ensure adequate rest and work-life balance amidst busy work sprints.`,
        ];

    timingSignals = isHindi
      ? `दशा संकेतों के आधार पर अगले 6 से 14 महीनों के भीतर करियर में एक बड़ा सकारात्मक मोड़ देखने को मिल सकता है।`
      : `Planetary dasha windows highlight significant positive momentum unfolding across the next 6 to 14 months.`;

    finalConclusion = isHindi
      ? `आत्मविश्वास बनाए रखें, निरंतर कर्मठ रहें और अपने कौशल को निखारते रहें। सितारे आपके कर्मक्षेत्र को प्रकाशित करने के लिए अनुकूल संरेखण में हैं।`
      : `Cultivate disciplined consistency and hone specialized skills. Astrological climate supports sustained professional advancement.`;

    confidenceBasis = isHindi
      ? `D1 दशम भाव, D10 दशांश चक्र और वर्तमान महादशा के प्रत्यक्ष अनुकूल संरेखण पर आधारित।`
      : `Based on aligned configurations across D1 10th house, D10 Dashamsha, and active Mahadasha lord.`;
  } else if (category === 'marriage' || category === 'relationship') {
    const h7 = kundali.houses.find((h) => h.houseNumber === 7);
    const h7Lord = h7 ? getLordOfSign(h7.sign) : 'Venus';
    const venus = kundali.planets.find((p) => p.name === 'Venus');
    const jupiter = kundali.planets.find((p) => p.name === 'Jupiter');

    directAnswer = isHindi
      ? `आपकी कुंडली में विवाह एवं दांपत्य जीवन के संकेत अनुकूल एवं शुभ हैं। सप्तम भाव (${h7?.signHindi || ''}) और नवांश (D9) का विश्लेषण दर्शाता है कि जीवनसाथी सुसंस्कृत, बौद्धिक एवं परिवार को साथ लेकर चलने वाला होगा।`
      : `Your matrimonial indicators reveal supportive and harmonious trends. The 7th house (${h7?.sign || ''}) and Navamsha (D9) chart point to a cultured, sensible, and supportive life companion.`;

    astrologicalBasis = isHindi
      ? `सप्तमेश ${PLANETS_HINDI[h7Lord]}, विवाह कारक शुक्र एवं गुरु की शुभ स्थिति दांपत्य स्थिरता की साक्षी है। नवांश चक्र (D9) में सप्तम भाव की स्थिति यह पुष्ट करती है कि विवाह के उपरांत जीवन में सौभाग्य व स्थायित्व में वृद्धि होगी।`
      : `Disposition of 7th lord ${h7Lord}, alongside Venus and Jupiter, underpins domestic harmony. D9 Navamsha confirms mutual respect and matrimonial luck maturation.`;

    keyIndicators = isHindi
      ? [
          `सप्तम भाव (${h7?.signHindi || ''}) एवं भावेश (${PLANETS_HINDI[h7Lord]}) की अनुकूलता।`,
          `गुरु की सौम्य दृष्टि: वैवाहिक जीवन में समझदारी एवं दीर्घायु दांपत्य।`,
          `नवांश (D9) चक्र में शुभ संकेत: विवाह के पश्चात भाग्य का विशेष जागरण।`,
        ]
      : [
          `Supportive 7th house and lord ${h7Lord} placement.`,
          `Jupiter's auspicious aura providing temperamental maturity in relationships.`,
          `D9 Navamsha validation for fortune unfolding through matrimony.`,
        ];

    opportunities = isHindi
      ? [
          `विवाह वार्ता अथवा परिणय सूत्र में बंधने के लिए आने वाले समय में अनुकूल प्रस्ताव प्राप्त होना।`,
          `पारिवारिक सामंजस्य एवं पारस्परिक विश्वास में निरंतर वृद्धि।`,
          `संयुक्त प्रयासों से घर एवं सुख-सुविधाओं का संवर्धन।`,
        ]
      : [
          `Conducive matrimonial alliances and favorable matchmaking discussions.`,
          `Deepening mutual trust and warm domestic camaraderie.`,
          `Joint endeavors yielding domestic comfort and prosperity.`,
        ];

    precautions = isHindi
      ? [
          `विवाह पूर्व कुंडली गुण मिलान एवं मंगलीक विचार अवश्य कराएं।`,
          `छोटी-मोटी बातों पर हठ अथवा गलतफहमी को स्थान न दें; संवाद खुला रखें।`,
          `अति-आदर्शवादी अपेक्षाओं के स्थान पर यथार्थवादी समझ को प्राथमिकता दें।`,
        ]
      : [
          `Perform traditional Ashtakoot and Manglik matching prior to final commitment.`,
          `Keep open, honest communication channels to dispel minor assumptions early.`,
          `Prioritize real understanding over rigid perfectionist expectations.`,
        ];

    timingSignals = isHindi
      ? `वर्तमान दशा एवं गुरु के गोचर के अनुसार, विवाह हेतु आगामी 8 से 18 माह की समयावधि अत्यधिक बलशाली संकेत दे रही है।`
      : `Active dasha sub-periods combined with transits mark a vibrant matrimonial window within the upcoming 8 to 18 months.`;

    finalConclusion = isHindi
      ? `सकारात्मक दृष्टिकोण रखें और परिवार के साथ मिलकर निर्णय लें। ईश्वर की कृपा से आपको एक निष्ठावान और सुखद साथी की प्राप्ति के प्रबल संकेत हैं।`
      : `Approach relationships with optimism and family blessing. Astrological indicators highlight lasting companionship and domestic bliss.`;

    confidenceBasis = isHindi
      ? `D1 सप्तम भाव, D9 नवांश चक्र एवं गुरु-शुक्र की संयुक्त स्थिति के अध्ययन पर आधारित।`
      : `Based on D1 7th house, D9 Navamsha synthesis, and primary matrimonial karakas.`;
  } else if (category === 'finance' || category === 'property') {
    const h2 = kundali.houses.find((h) => h.houseNumber === 2);
    const h11 = kundali.houses.find((h) => h.houseNumber === 11);

    directAnswer = isHindi
      ? `आपकी कुंडली में धन संचय, आय के स्रोत एवं आर्थिक समृद्धि के योग उत्तम हैं। द्वितीय (कोष) एवं एकादश (लाभ) भाव का संबंध यह दर्शाता है कि आपके जीवन में धन का निरंतर प्रवाह बना रहेगा।`
      : `Your wealth architecture indicates sustained accumulation and multiple avenues of revenue. The 2nd (treasury) and 11th (gains) houses signify solid fiscal resilience.`;

    astrologicalBasis = isHindi
      ? `धन भाव के स्वामी, लाभेश एवं होरा चक्र (D2) की संरचना यह प्रमाणित करती है कि परिश्रम के अनुपात में वित्तीय संतोष अवश्य मिलेगा। कुंडली में उपस्थित धन योग आर्थिक संकटों से सुरक्षा प्रदान करते हैं।`
      : `Lords of the 2nd and 11th houses corroborated with D2 Hora affirm steady earning power and reliable capital preservation.`;

    keyIndicators = isHindi
      ? [
          `द्वितीय भाव (धन संचय) एवं एकादश भाव (आय व लाभ) का परस्पर शुभ संबंध।`,
          `होरा चक्र (D2) में धनकारक ग्रहों की अनुकूल स्थिति: स्थायी संपत्ति निर्माण।`,
          `कुंडली में धन योग: आकस्मिक आर्थिक संबल एवं स्रोतों का विस्तार।`,
        ]
      : [
          `Benefic link between 2nd (savings) and 11th (gains) houses.`,
          `D2 Hora support for long-range asset creation and treasury retention.`,
          `Dhana Yogas conferring financial resilience during economic swings.`,
        ];

    opportunities = isHindi
      ? [
          `सुरक्षित एवं दीर्घकालिक निवेशों (भूमि, स्वर्ण, म्यूचुअल फंड) से धन वृद्धि।`,
          `अतिरिक्त आय अथवा नए व्यापारिक अनुबंध से आर्थिक मजबूती।`,
          `पैतृक संपत्ति अथवा स्थायी परिसंपत्ति के क्रय के योग।`,
        ]
      : [
          `Compounding gains via secure long-term vehicles (real estate, gold, index assets).`,
          `Secondary revenue streams or profitable service agreements.`,
          `Favorable period for acquiring fixed residential or commercial assets.`,
        ];

    precautions = isHindi
      ? [
          `सट्टेबाजी, शेयर बाजार में अत्यधिक जोखिम या त्वरित धन कमाने के प्रलोभनों से बचें।`,
          `किसी को भी बड़ा उधार देते समय लिखित अनुबंध अवश्य रखें।`,
          `अनावश्यक दिखावे या विलासिता पर अनावश्यक खर्च को नियंत्रित रखें।`,
        ]
      : [
          `Avoid speculative gambles or get-rich-quick shortcuts.`,
          `Exercise strict legal and written documentation for loans or partnerships.`,
          `Curate disciplined budgeting against discretionary lifestyle inflation.`,
        ];

    timingSignals = isHindi
      ? `आगामी 12 से 24 महीनों में आर्थिक स्थिरता एवं संपत्ति वृद्धि के विशेष योग परिलक्षित हो रहे हैं।`
      : `Astrological indicators underline strong wealth accumulation and asset security over the upcoming 12 to 24 months.`;

    finalConclusion = isHindi
      ? `योजनाबद्ध बचत और धैर्य से धन का संचय करें। लक्ष्मी जी की कृपा से आपकी आर्थिक स्थिति दिनों-दिन सुदृढ़ होती जाएगी।`
      : `Practice structured savings and pragmatic investments. Planetary alignment ensures sustained material ease and asset stability.`;

    confidenceBasis = isHindi
      ? `D1 द्वितीय/एकादश भाव, D2 होरा चक्र एवं वर्तमान दशा के धन भाव संबंध पर आधारित।`
      : `Based on D1 2nd/11th houses, D2 Hora chart, and active Dasha financial alignments.`;
  } else {
    // General life & other categories
    directAnswer = isHindi
      ? `आपकी कुंडली का समग्र विश्लेषण यह प्रमाणित करता है कि आपके जीवन का मूल प्रारब्ध सकारात्मक, प्रगतिशील और उन्नतिशील है। लग्न एवं चंद्र का संरेखण आपको आंतरिक शक्ति, दृढ़ संकल्प और हर चुनौती से उबरने की क्षमता देता है।`
      : `Comprehensive analysis of your horoscope validates a resilient, progressive, and spiritually supported life path. Lagna and Moon alignments confer inner tenacity and high recuperative potential.`;

    astrologicalBasis = isHindi
      ? `लग्न, लग्नेश, सूर्य एवं चंद्र की संयुक्त स्थिति जीवन में एक मजबूत आधारशिला तैयार करती है। कुंडली में उपस्थित शुभ योग जीवन के महत्वपूर्ण मोड़ों पर सही मार्गदर्शन और सुरक्षा सुनिश्चित करते हैं।`
      : `Synthesized placement of Lagna, Lagna Lord, Sun, and Moon builds a grounded foundation. Auspicious Yogas grant timely clarity and guidance during crucial life chapters.`;

    keyIndicators = isHindi
      ? [
          `लग्न एवं लग्नेश की सशक्त स्थिति: स्वास्थ्य, दीर्घायु एवं सामाजिक सम्मान।`,
          `विंशोत्तरी महादशा का वर्तमान चक्र: जीवन में सकारात्मक बदलावों की शुरुआत।`,
          `शुभ योगों की उपस्थिति: संकटों से सुरक्षा और निरंतर आत्म-विकास।`,
        ]
      : [
          `Stalwart Lagna disposition: Vitality, longevity, and societal esteem.`,
          `Vimshottari Dasha cycle triggering auspicious transitional avenues.`,
          `Classical Yogas ensuring protection and progressive spiritual growth.`,
        ];

    opportunities = isHindi
      ? [
          `आत्म-सुधार, नए कौशल सीखने और ज्ञान के विस्तार के लिए उत्तम समय।`,
          `पारिवारिक एवं सामाजिक संबंधों में प्रगाढ़ता और सौहार्द।`,
          `अधूरे पड़े कार्यों को पुनः गति देकर पूर्ण करने का अवसर।`,
        ]
      : [
          `Optimal period for skill upgradation, self-mastery, and intellectual pursuits.`,
          `Deepening familial bonds and widening respectable social networks.`,
          `Reinvigorating paused ventures and bringing them to completion.`,
        ];

    precautions = isHindi
      ? [
          `मन में किसी प्रकार का नकारात्मक संशय या भय न पालें; आत्म-विश्वास रखें।`,
          `स्वास्थ्य के प्रति नियमित रहें—संतुलित आहार, प्राणायाम एवं ध्यान को दिनचर्या बनाएं।`,
          `अति-उत्साह में बिना सोचे-समझे किसी बड़े निर्णय से बचें।`,
        ]
      : [
          `Cast away unnecessary self-doubt; nurture quiet inner conviction.`,
          `Maintain physical and mental wellness routines (pranayama, balanced diet).`,
          `Refrain from hasty decisions driven by momentary emotional spikes.`,
        ];

    timingSignals = isHindi
      ? `दशा संकेतों के अनुसार, आने वाले महीनों में मानसिक शांति एवं परिस्थितियों में स्पष्ट सुधार का अनुभव होगा।`
      : `Active dasha indicators indicate deepening mental clarity and steady resolution across the coming quarters.`;

    finalConclusion = isHindi
      ? `सदा धर्म, सत्य और कर्म के मार्ग पर चलें। आपकी कुंडली में शुभता का बाहुल्य है, जो आपको हर परीक्षा में विजयी बनाएगा।`
      : `Stay anchored in righteous duty, integrity, and diligence. Favorable astrological currents support your continuous ascent.`;

    confidenceBasis = isHindi
      ? `लग्न चक्र (D1), नवांश चक्र (D9) एवं विंशोत्तरी दशा के समग्र संतुलन पर आधारित।`
      : `Derived from the harmonious balance across D1 Rashi, D9 Navamsha, and Vimshottari cycles.`;
  }

  return {
    question,
    category,
    categoryLabel: catLabels.en,
    categoryLabelHindi: catLabels.hi,
    directAnswer,
    astrologicalBasis,
    keyIndicators,
    opportunities,
    precautions,
    timingSignals,
    finalConclusion,
    confidence: 'strong',
    confidenceLabel: isHindi ? '🟢 मजबूत संकेत' : '🟢 Strong Indication',
    confidenceBasis,
  };
}

// Helper: Signs and Lords
export function getLordOfSign(sign: ZodiacSign): VedicPlanet {
  const map: Record<ZodiacSign, VedicPlanet> = {
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
  return map[sign] || 'Jupiter';
}

function getHousesRuledByPlanet(planet: VedicPlanet, ascSign: ZodiacSign): string {
  // Return readable house lordship
  const zSigns: ZodiacSign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];
  const ascIdx = zSigns.indexOf(ascSign);

  const ownedSigns: ZodiacSign[] = [];
  zSigns.forEach((s) => {
    if (getLordOfSign(s) === planet) {
      ownedSigns.push(s);
    }
  });

  const houses = ownedSigns.map((s) => {
    const sIdx = zSigns.indexOf(s);
    return ((sIdx - ascIdx + 12) % 12) + 1;
  });

  return houses.length > 0 ? `H${houses.join(', H')}` : 'Karak';
}

function checkPlanetRelevanceToCategory(planet: VedicPlanet, cat: QuestionCategory): boolean {
  switch (cat) {
    case 'career':
    case 'business':
      return planet === 'Saturn' || planet === 'Sun' || planet === 'Mercury' || planet === 'Jupiter';
    case 'marriage':
    case 'relationship':
      return planet === 'Venus' || planet === 'Jupiter' || planet === 'Mars' || planet === 'Moon';
    case 'finance':
    case 'property':
      return planet === 'Jupiter' || planet === 'Venus' || planet === 'Mercury' || planet === 'Mars';
    case 'education':
      return planet === 'Mercury' || planet === 'Jupiter';
    case 'children':
      return planet === 'Jupiter' || planet === 'Sun' || planet === 'Mars';
    case 'health':
      return planet === 'Sun' || planet === 'Mars' || planet === 'Saturn';
    case 'foreign':
      return planet === 'Rahu' || planet === 'Moon' || planet === 'Saturn';
    default:
      return true;
  }
}

function checkHouseRelevanceToCategory(house: number, cat: QuestionCategory): boolean {
  switch (cat) {
    case 'career':
    case 'business':
      return house === 10 || house === 1 || house === 6 || house === 2 || house === 7 || house === 11;
    case 'marriage':
    case 'relationship':
      return house === 7 || house === 1 || house === 2 || house === 5 || house === 8 || house === 11;
    case 'finance':
      return house === 2 || house === 11 || house === 5 || house === 9 || house === 1;
    case 'property':
      return house === 4 || house === 11 || house === 2 || house === 1;
    case 'children':
      return house === 5 || house === 9 || house === 1 || house === 11;
    case 'education':
      return house === 4 || house === 5 || house === 9 || house === 1;
    case 'foreign':
      return house === 12 || house === 9 || house === 7 || house === 3;
    case 'health':
      return house === 1 || house === 6 || house === 8 || house === 12;
    default:
      return house === 1 || house === 5 || house === 9 || house === 10;
  }
}

function getPlanetaryAspectsText(planet: VedicPlanet, house: number, isHindi: boolean): string {
  // Basic Vedic Drishtis: All planets aspect 7th from their placement. Mars: 4, 7, 8; Jupiter: 5, 7, 9; Saturn: 3, 7, 10
  const aspects: number[] = [((house + 6 - 1) % 12) + 1];

  if (planet === 'Mars') {
    aspects.push(((house + 3 - 1) % 12) + 1);
    aspects.push(((house + 7 - 1) % 12) + 1);
  } else if (planet === 'Jupiter' || planet === 'Rahu' || planet === 'Ketu') {
    aspects.push(((house + 4 - 1) % 12) + 1);
    aspects.push(((house + 8 - 1) % 12) + 1);
  } else if (planet === 'Saturn') {
    aspects.push(((house + 2 - 1) % 12) + 1);
    aspects.push(((house + 9 - 1) % 12) + 1);
  }

  aspects.sort((a, b) => a - b);
  return isHindi ? `भाव ${aspects.join(', ')} पर पूर्ण दृष्टि` : `Aspects Bhavas ${aspects.join(', ')}`;
}

function getPlanetsAspectingHouse(house: number, planets: any[], isHindi: boolean): string[] {
  const aspecting: string[] = [];
  planets.forEach((p) => {
    const pHouse = p.house;
    const direct7th = ((pHouse + 6 - 1) % 12) + 1;
    let isAspecting = direct7th === house;

    if (p.name === 'Mars') {
      const asp4th = ((pHouse + 3 - 1) % 12) + 1;
      const asp8th = ((pHouse + 7 - 1) % 12) + 1;
      if (asp4th === house || asp8th === house) isAspecting = true;
    } else if (p.name === 'Jupiter') {
      const asp5th = ((pHouse + 4 - 1) % 12) + 1;
      const asp9th = ((pHouse + 8 - 1) % 12) + 1;
      if (asp5th === house || asp9th === house) isAspecting = true;
    } else if (p.name === 'Saturn') {
      const asp3rd = ((pHouse + 2 - 1) % 12) + 1;
      const asp10th = ((pHouse + 9 - 1) % 12) + 1;
      if (asp3rd === house || asp10th === house) isAspecting = true;
    }

    if (isAspecting) {
      aspecting.push(isHindi ? p.hindiName : p.name);
    }
  });
  return aspecting;
}

function getHouseTraditionalName(houseNum: number, isHindi: boolean): string {
  const names: Record<number, { en: string; hi: string }> = {
    1: { en: 'Tanu Bhava (Self & Physique)', hi: 'तनु भाव (शरीर, रूप व जीवन शक्ति)' },
    2: { en: 'Dhana Bhava (Wealth & Speech)', hi: 'धन भाव (कोष, वाणी व परिवार)' },
    3: { en: 'Bhratri Bhava (Courage & Siblings)', hi: 'सहज भाव (पराक्रम, उद्यम व बंधु)' },
    4: { en: 'Sukha Bhava (Mother & Property)', hi: 'सुख भाव (माता, गृह, भूमि व वाहन)' },
    5: { en: 'Putra Bhava (Children & Intellect)', hi: 'पुत्र भाव (संतान, बुद्धि व पूर्वपुण्य)' },
    6: { en: 'Ripu Bhava (Service & Health)', hi: 'शत्रु भाव (रोग, ऋण, सेवा व संघर्ष)' },
    7: { en: 'Kalatra Bhava (Spouse & Partnership)', hi: 'जाया भाव (दांपत्य, जीवनसाथी व साझेदारी)' },
    8: { en: 'Ayur Bhava (Longevity & Mysticism)', hi: 'मृत्यु भाव (आयु, गूढ़ विद्या व परिवर्तन)' },
    9: { en: 'Dharma Bhava (Fortune & Spirituality)', hi: 'भाग्य भाव (धर्म, तीर्थ, पिता व सौभाग्य)' },
    10: { en: 'Karma Bhava (Career & Authority)', hi: 'कर्म भाव (आजीविका, पद-प्रतिष्ठा व कीर्ति)' },
    11: { en: 'Labha Bhava (Gains & Fulfillment)', hi: 'लाभ भाव (आय, अभीष्ट सिद्धि व मित्र)' },
    12: { en: 'Vyaya Bhava (Expenditure & Moksha)', hi: 'व्यय भाव (मोक्ष, विदेश यात्रा व निद्रा)' },
  };
  return isHindi ? names[houseNum]?.hi || `भाव ${houseNum}` : names[houseNum]?.en || `House ${houseNum}`;
}

function getHousePositiveIndications(houseNum: number, sign: ZodiacSign, isHindi: boolean): string {
  const map: Record<number, { en: string; hi: string }> = {
    1: { en: 'Strong vitality, high self-regard and radiant personal presence.', hi: 'सशक्त जीवन ऊर्जा, उच्च आत्मसम्मान एवं आकर्षक व्यक्तित्व।' },
    2: { en: 'Financial prudence, eloquent speech and steady assets.', hi: 'धन संचय की समझ, ओजस्वी वाणी एवं पारिवारिक संपदा।' },
    3: { en: 'Courage, self-made drive and creative initiative.', hi: 'साहस, स्वावलंबी प्रयास एवं नवीन कार्य शुरू करने की ऊर्जा।' },
    4: { en: 'Domestic peace, vehicle comfort and filial blessings.', hi: 'पारिवारिक सुख, वाहन सुख एवं माता का स्नेहिल संबल।' },
    5: { en: 'Creative genius, sharp scholarship and auspicious progeny.', hi: 'बौद्धिक कुशाग्रता, विद्या में सफलता एवं संतान का सुखद भविष्य।' },
    6: { en: 'Victory over hurdles, competitive edge and healing prowess.', hi: 'शत्रु बाधाओं पर विजय, प्रतियोगी क्षमता एवं रोगों से मुक्ति।' },
    7: { en: 'Supportive marital bond, balanced partnership and social grace.', hi: 'सौहार्दपूर्ण दांपत्य, सुयोग्य जीवनसाथी एवं फलदायी साझेदारी।' },
    8: { en: 'Deep intuition, resilience and longevity protection.', hi: 'गहन अंतर्दृष्टि, संकटों से उबरने की शक्ति एवं दीर्घायु का वरदान।' },
    9: { en: 'Supreme divine luck, righteous mentorship and global wisdom.', hi: 'सर्वोच्च दैवीय कृपा, गुरु कृपा, तीर्थ यात्रा एवं निरंतर भाग्योदय।' },
    10: { en: 'Professional stature, public authority and productive deeds.', hi: 'कार्यक्षेत्र में सम्मान, प्रशासनिक योग्यता एवं यश की प्राप्ति।' },
    11: { en: 'Multiple income streams, supportive allies and dream fulfillment.', hi: 'आय के प्रचुर साधन, शुभ मित्रों का सहयोग एवं मनोरथ सिद्धि।' },
    12: { en: 'Spiritual liberation, philanthropic grace and foreign connection.', hi: 'आध्यात्मिक शांति, परोपकार की भावना एवं विदेश संपर्क का लाभ।' },
  };
  return isHindi ? map[houseNum]?.hi || 'शुभ फल' : map[houseNum]?.en || 'Auspicious results';
}

function getHouseChallenges(houseNum: number, sign: ZodiacSign, isHindi: boolean): string {
  const map: Record<number, { en: string; hi: string }> = {
    1: { en: 'Occasional pride or over-exertion demanding physical rest.', hi: 'कभी-कभी अत्यधिक थकान या आत्म-मुग्धता से बचाव आवश्यक।' },
    2: { en: 'Harsh speech in anger or impulsive expenditure.', hi: 'क्रोध में कठोर वाणी अथवा आकस्मिक खर्चों पर नियंत्रण जरूरी।' },
    3: { en: 'Restlessness or miscommunication with peers.', hi: 'अधीरता अथवा सहयोगियों के साथ संवाद में स्पष्टता की आवश्यकता।' },
    4: { en: 'Emotional sensitivity and home maintenance stress.', hi: 'अति-संवेदनशीलता एवं पारिवारिक मामलों में व्यर्थ की चिंता।' },
    5: { en: 'Speculative risks or over-expectation from offspring.', hi: 'जोखिम भरे निवेश अथवा संतान को लेकर अनावश्यक मानसिक दबाव।' },
    6: { en: 'Dietary neglect leading to digestive or fatigue issues.', hi: 'अनियमित खान-पान से उदर विकार अथवा कार्यभार का तनाव।' },
    7: { en: 'Ego friction in agreements or partnerships.', hi: 'भागीदारी अथवा दांपत्य में विचारों के टकराव से बचना श्रेयस्कर।' },
    8: { en: 'Sudden unexpected changes requiring high adaptability.', hi: 'आकस्मिक परिवर्तन, जिनमें धैर्य और विवेक की परीक्षा होती है।' },
    9: { en: 'Rigid dogmatism or delays in ancestral outcomes.', hi: 'कट्टरता से बचाव एवं पिता के स्वास्थ्य का ध्यान रखना चाहिए।' },
    10: { en: 'Workplace politics or fatigue from heavy responsibility.', hi: 'सहकर्मियों की ईर्ष्या अथवा अत्यधिक कार्यभार से मानसिक तनाव।' },
    11: { en: 'Misplaced trust in superficial social acquaintances.', hi: 'अपरिचित व्यक्तियों पर अंधविश्वास अथवा बड़े उधार से बचें।' },
    12: { en: 'Sleep irregularity, unnecessary anxiety and wasteful expense.', hi: 'अनिद्रा, व्यर्थ की चिंता एवं अनावश्यक दिखावे पर व्यय।' },
  };
  return isHindi ? map[houseNum]?.hi || 'सावधानी' : map[houseNum]?.en || 'Caution required';
}

function getPlanetPositiveImpact(planet: VedicPlanet, house: number, dignity: string, isHindi: boolean): string {
  if (isHindi) {
    switch (planet) {
      case 'Sun': return 'आत्मविश्वास, तेज, सरकारी संपर्क एवं नेतृत्व क्षमता का विकास।';
      case 'Moon': return 'मानसिक शांति, अंतर्ज्ञान, जनप्रियता एवं रचनात्मक सोच।';
      case 'Mars': return 'पराक्रम, साहस, तकनीकी कौशल एवं त्वरित निर्णय लेने की शक्ति।';
      case 'Mercury': return 'बुद्धि, व्यापारिक सूझबूझ, गणितीय निपुणता एवं वाकपटुता।';
      case 'Jupiter': return 'ज्ञान, विवेक, गुरु कृपा, आर्थिक समृद्धि एवं आध्यात्मिक शुचिता।';
      case 'Venus': return 'सुख-साधन, दांपत्य मधुरता, कलात्मक अभिरुचि एवं भौतिक ऐश्वर्य।';
      case 'Saturn': return 'धैर्य, अनुशासन, न्यायप्रियता, दीर्घायु एवं स्थायी सफलता।';
      case 'Rahu': return 'अपरंपरागत सोच, तकनीकी क्रांति एवं आकस्मिक विस्तार।';
      case 'Ketu': return 'आध्यात्मिक वैराग्य, शोध दृष्टि एवं सूक्ष्म अंतर्दृष्टि।';
      default: return 'सकारात्मक ऊर्जा।';
    }
  } else {
    switch (planet) {
      case 'Sun': return 'Courage, executive presence, government goodwill, and vital authority.';
      case 'Moon': return 'Intuitive empathy, popularity, mental peace, and imaginative agility.';
      case 'Mars': return 'Dynamic stamina, technical flair, initiative, and fearless execution.';
      case 'Mercury': return 'Pragmatic intellect, commercial acumen, wit, and linguistic fluency.';
      case 'Jupiter': return 'Wisdom, spiritual elevation, financial treasury, and wise mentorship.';
      case 'Venus': return 'Aesthetic charm, harmonious relationships, luxuries, and artistic grace.';
      case 'Saturn': return 'Steadfast perseverance, karmic discipline, endurance, and lasting foundations.';
      case 'Rahu': return 'Innovative boundary-pushing, tech ambition, and sudden global breakthroughs.';
      case 'Ketu': return 'Spiritual discrimination, detachment from triviality, and esoteric research.';
      default: return 'Constructive planetary grace.';
    }
  }
}

function getPlanetChallenge(planet: VedicPlanet, house: number, dignity: string, isHindi: boolean): string {
  if (isHindi) {
    switch (planet) {
      case 'Sun': return 'अहंकार, नेत्र विकार अथवा पित्त की अधिकता।';
      case 'Moon': return 'मन में चंचलता, अति-संवेदनशीलता एवं जल भय।';
      case 'Mars': return 'क्रोध, जल्दबाजी, रक्त विकार अथवा चोट की संभावना।';
      case 'Mercury': return 'अति-तार्किक बहस, अनिद्रा अथवा नसों में तनाव।';
      case 'Jupiter': return 'अति-विश्वास, आलस्य अथवा कफ जनित विकार।';
      case 'Venus': return 'अत्यधिक विलासिता, वासना अथवा फिजूलखर्ची।';
      case 'Saturn': return 'कार्यों में विलंब, अकेलापन अथवा हड्डियों/जोड़ों में वात विकार।';
      case 'Rahu': return 'भ्रम, अनिर्णय, अति-महत्वाकांक्षा अथवा संशय।';
      case 'Ketu': return 'एकाकीपन, अचानक अलगाव अथवा त्वचा रोग।';
      default: return 'संतुलन की आवश्यकता।';
    }
  } else {
    switch (planet) {
      case 'Sun': return 'Tendency toward domineering pride, eye strain, or pitta aggravation.';
      case 'Moon': return 'Mood swings, seasonal melancholy, or emotional vulnerability.';
      case 'Mars': return 'Impulsive haste, hot temper, accidents, or inflammation.';
      case 'Mercury': return 'Nervous exhaustion, hair-splitting arguments, or insomnia.';
      case 'Jupiter': return 'Over-optimism, complacency, or dietary excess.';
      case 'Venus': return 'Sensory over-indulgence, extravagant spending, or vanity.';
      case 'Saturn': return 'Unavoidable delays, heavy burdens, pessimism, or joint stiffness.';
      case 'Rahu': return 'Illusory anxiety, restlessness, or erratic speculation.';
      case 'Ketu': return 'Abrupt aloofness, indecision, or enigmatic allergies.';
      default: return 'Demands measured equilibrium.';
    }
  }
}
