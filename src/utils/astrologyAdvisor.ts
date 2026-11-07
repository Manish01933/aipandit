import { Language, ZodiacSign, VedicPlanet } from '../types/astrology';
import { ZODIAC_HINDI, PLANETS_HINDI } from './vedicCalculations';
import {
  LAGNA_NATURE_MAP,
  ZODIAC_LORDS,
  CompleteAstrologyContext,
} from './birthProfileManager';

interface AdvisorResult {
  reply: string;
  suggestedQuestions: string[];
}

// Current planetary transits for Saturn
const CURRENT_SADE_SATI_SIGNS: ZodiacSign[] = ['Capricorn', 'Aquarius', 'Pisces', 'Aries'];
const CURRENT_DHAIYA_SIGNS: ZodiacSign[] = ['Cancer', 'Scorpio'];

// Characteristic traits of 7th house signs for spouse description in simple Hindi and English
const SPOUSE_TRAITS_BY_7TH_SIGN: Record<
  ZodiacSign,
  { hi: string; en: string }
> = {
  Aries: {
    hi: 'स्वभाव से आत्मविश्वासी, ऊर्जावान, साहसी और अपने दम पर फैसले लेने वाले होंगे।',
    en: 'Confident, energetic, proactive, and independent with natural leadership instincts.',
  },
  Taurus: {
    hi: 'शांत, व्यावहारिक, समझदार, परिवार की कद्र करने वाले और कला व सुख-सुविधाओं के शौकीन होंगे।',
    en: 'Calm, patient, loyal, family-oriented, and appreciative of comfort and fine arts.',
  },
  Gemini: {
    hi: 'तेज बुद्धि वाले, बातचीत में कुशल, मिलनसार और हर परिस्थिति में ढल जाने वाले होंगे।',
    en: 'Witty, articulate, communicative, intellectually sharp, and adaptable.',
  },
  Cancer: {
    hi: 'अत्यंत स्नेहमयी, भावुक, परिवार की देखरेख करने वाले और घर-गृहस्थी को प्राथमिकता देने वाले होंगे।',
    en: 'Caring, nurturing, emotionally supportive, and deeply devoted to home and family.',
  },
  Leo: {
    hi: 'स्वाभिमानी, प्रभावशाली व्यक्तित्व वाले, दिल के उदार और समाज में मान-सम्मान पाने वाले होंगे।',
    en: 'Dignified, warm-hearted, charismatic, and respected in social and family circles.',
  },
  Virgo: {
    hi: 'समझदार, व्यवस्थित, काम में निपुण, कर्तव्यनिष्ठ और व्यावहारिक सोच वाले होंगे।',
    en: 'Practical, detail-oriented, organized, supportive, and health-conscious.',
  },
  Libra: {
    hi: 'आकर्षक, न्यायप्रिय, सौम्य स्वभाव वाले, और रिश्ते में बराबरी व मधुरता पसंद करने वाले होंगे।',
    en: 'Charming, diplomatic, balanced, culturally refined, and committed to harmonious partnership.',
  },
  Scorpio: {
    hi: 'गहरे विचारों वाले, निष्ठावान, हर परिस्थिति में साथ निभाने वाले और मजबूत इरादों वाले होंगे।',
    en: 'Deeply loyal, strong-willed, perceptive, and steadfastly committed through life’s ups and downs.',
  },
  Sagittarius: {
    hi: 'धार्मिक, सकारात्मक सोच वाले, ज्ञानवान, स्पष्टवादी और नैतिक मूल्यों को मानने वाले होंगे।',
    en: 'Optimistic, ethical, truthful, open-minded, and appreciative of learning and spirituality.',
  },
  Capricorn: {
    hi: 'मेहनती, गंभीर, जिम्मेदार, समय के पाबंद और अपने काम व परिवार के प्रति समर्पित होंगे।',
    en: 'Disciplined, realistic, responsible, industrious, and dedicated to building long-term security.',
  },
  Aquarius: {
    hi: 'आधुनिक सोच वाले, मानवतावादी, मित्रवत और सामाजिक कार्यों में रुचि रखने वाले होंगे।',
    en: 'Progressive, broad-minded, friendly, humanitarian, and intellectually curious.',
  },
  Pisces: {
    hi: 'दयालु, आध्यात्मिक, संवेदनशील, कलात्मक और दूसरों की मदद के लिए सदैव तत्पर रहने वाले होंगे।',
    en: 'Compassionate, empathetic, spiritual, artistic, and profoundly kind-hearted.',
  },
};

// Career domains suitable for 10th house lords in simple Hindi and English
const CAREER_BY_PLANET: Record<
  VedicPlanet,
  { hi: string; en: string }
> = {
  Sun: {
    hi: 'प्रशासनिक सेवाएं, सरकारी विभाग, प्रबंधन, चिकित्सा (डॉक्टर), और नेतृत्व से जुड़े कार्य।',
    en: 'Public administration, government services, executive leadership, medicine, and managerial roles.',
  },
  Moon: {
    hi: 'जनसंपर्क, अस्पताल, नर्सिंग, होटल व खानपान, यात्रा, और कला से जुड़े क्षेत्र।',
    en: 'Healthcare, public relations, hospitality, creative arts, and people-oriented vocations.',
  },
  Mars: {
    hi: 'इंजीनियरिंग, पुलिस व सेना, तकनीकी क्षेत्र, रियल एस्टेट, खेलकूद, और निर्माण कार्य।',
    en: 'Engineering, defense, law enforcement, real estate, athletics, and technical operations.',
  },
  Mercury: {
    hi: 'आईटी व सॉफ्टवेयर, बैंकिंग, वाणिज्य (कॉमर्स), डेटा विश्लेषण, पत्रकारिता, और व्यापार।',
    en: 'IT & software, banking, accounting, marketing, data analysis, journalism, and commerce.',
  },
  Jupiter: {
    hi: 'शिक्षा, अध्यापन, कानून व वकालत, वित्तीय परामर्श, बैंकिंग, और शोध कार्य।',
    en: 'Education, academic teaching, judicial services, law, financial advisory, and research.',
  },
  Venus: {
    hi: 'डिजाइनिंग, कला, मीडिया, हॉस्पिटैलिटी, फैशन, और सौंदर्य व रचनात्मक क्षेत्र।',
    en: 'Creative design, arts, media, architecture, hospitality, fashion, and digital aesthetics.',
  },
  Saturn: {
    hi: 'तकनीकी कार्य, मैन्युफैक्चरिंग, मशीनरी, कानूनी अनुसंधान, और बड़े उद्यमों का संचालन।',
    en: 'Engineering, manufacturing, technology, legal research, operations, and structured industry.',
  },
  Rahu: {
    hi: 'विदेश से जुड़े काम, आर्टिफिशियल इंटेलिजेंस (AI), डिजिटल मार्केटिंग, और नए नवाचार।',
    en: 'International trade, disruptive technology, digital media, AI, and aviation.',
  },
  Ketu: {
    hi: 'सॉफ्टवेयर कोडिंग, साइबर सुरक्षा, आयुर्वेद, डेटा रिसर्च, और स्वतंत्र तकनीकी कार्य।',
    en: 'Software development, cybersecurity, research, data encryption, and specialized consulting.',
  },
  Ascendant: {
    hi: 'स्वतंत्र व्यवसाय, उद्यमिता, और व्यक्तिगत परामर्श।',
    en: 'Independent entrepreneurship, consulting, and business ownership.',
  },
};

export function generateDynamicAstrologyResponse(
  message: string,
  language: Language = 'en',
  kundaliContext?: any,
  conversationHistory: any[] = []
): AdvisorResult {
  const query = (message || '').toLowerCase().trim();
  const isHindi = language === 'hi';

  // Normalize Kundali context
  const hasRealKundali =
    kundaliContext &&
    typeof kundaliContext.name === 'string' &&
    kundaliContext.name.trim().length > 0 &&
    kundaliContext.name.trim().toLowerCase() !== 'aarav sharma' &&
    kundaliContext.name.trim().toLowerCase() !== 'seeker' &&
    Boolean(kundaliContext.ascendant || kundaliContext.ascendantSign);

  const userName = hasRealKundali ? kundaliContext.name : null;
  const ascendant: ZodiacSign = hasRealKundali
    ? (kundaliContext.ascendant || kundaliContext.ascendantSign || 'Aries')
    : 'Aries';
  const ascHindi = hasRealKundali
    ? (kundaliContext.ascendantHindi || ZODIAC_HINDI[ascendant] || ascendant)
    : '';

  const moonSign: ZodiacSign = hasRealKundali
    ? (kundaliContext.moonSign || 'Taurus')
    : 'Taurus';
  const moonHindi = hasRealKundali
    ? (kundaliContext.moonSignHindi || ZODIAC_HINDI[moonSign] || moonSign)
    : '';

  const nakshatra = hasRealKundali
    ? (kundaliContext.birthNakshatra || kundaliContext.nakshatra || '')
    : '';
  const nakshatraHindi = hasRealKundali
    ? (kundaliContext.birthNakshatraHindi || nakshatra)
    : '';

  const currentDasha = hasRealKundali
    ? (typeof kundaliContext.currentDasha === 'string'
        ? kundaliContext.currentDasha
        : kundaliContext.currentDasha?.mahadasha || 'Jupiter')
    : 'Jupiter';
  const dashaHindi = PLANETS_HINDI[currentDasha as VedicPlanet] || currentDasha;

  const lagnaLord = ZODIAC_LORDS[ascendant] || 'Mars';
  const lagnaLordHindi = PLANETS_HINDI[lagnaLord] || lagnaLord;

  const lagnaInfo = LAGNA_NATURE_MAP[ascendant] || LAGNA_NATURE_MAP.Aries;

  // 10th House (Career)
  let sign10: ZodiacSign = 'Capricorn';
  let lord10: VedicPlanet = 'Saturn';
  let planetsIn10: string[] = [];

  if (kundaliContext?.career10thHouse) {
    sign10 = kundaliContext.career10thHouse.sign;
    lord10 = kundaliContext.career10thHouse.lord;
    planetsIn10 = kundaliContext.career10thHouse.planetsIn10th || [];
  } else if (hasRealKundali) {
    const signs: ZodiacSign[] = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const ascIdx = signs.indexOf(ascendant);
    sign10 = signs[(ascIdx + 9) % 12];
    lord10 = ZODIAC_LORDS[sign10];
  }

  // 7th House (Marriage)
  let sign7: ZodiacSign = 'Libra';
  let lord7: VedicPlanet = 'Venus';
  let planetsIn7: string[] = [];

  if (kundaliContext?.marriage7thHouse) {
    sign7 = kundaliContext.marriage7thHouse.sign;
    lord7 = kundaliContext.marriage7thHouse.lord;
    planetsIn7 = kundaliContext.marriage7thHouse.planetsIn7th || [];
  } else if (hasRealKundali) {
    const signs: ZodiacSign[] = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const ascIdx = signs.indexOf(ascendant);
    sign7 = signs[(ascIdx + 6) % 12];
    lord7 = ZODIAC_LORDS[sign7];
  }

  // Manglik Check
  const isManglik = Boolean(kundaliContext?.doshas?.isManglik || kundaliContext?.dosha?.isManglik);
  const isSadeSati = Boolean(
    kundaliContext?.doshas?.isSadeSati ||
    kundaliContext?.dosha?.isSadeSati ||
    CURRENT_SADE_SATI_SIGNS.includes(moonSign)
  );

  // ==========================================
  // ANTI-REPETITION CONTEXT TRACKING
  // ==========================================
  const previousBotTexts = (conversationHistory || [])
    .filter((m: any) => m.role === 'model' || m.role === 'assistant' || m.sender === 'assistant')
    .map((m: any) => m.text || m.content || '')
    .filter((t: string) => typeof t === 'string' && t.trim().length > 0);

  const isFollowUp = previousBotTexts.length > 0;
  const birthDateStr = kundaliContext?.dob || kundaliContext?.birthDetails?.dob || '1995-01-01';
  const birthYear = parseInt((birthDateStr || '').split('-')[0], 10) || 1995;
  const currentYear = new Date().getFullYear();
  const nativeAge = Math.max(0, currentYear - birthYear);

  // ==========================================
  // PRESET QUESTION 1: NEXT 5 YEARS FUTURE FORECAST (pq_future_5years)
  // ==========================================
  if (/(aane wale 5 sal|5 saal|5 sal|5 year|5 वर्ष|five years|अगले 5|आगामी 5|next 5 year|future 5|आने वाले पांच|भविष्य कैसा रहेगा|भविष्य कैसा होगा)/i.test(query)) {
    const yearsList = kundaliContext?.timelineAnalysis?.future5Years || [
      {
        year: currentYear,
        age: nativeAge,
        dashaPeriod: dashaHindi,
        forecastHindi: `वर्ष ${currentYear} (आयु ${nativeAge}): ${dashaHindi} की महादशा का प्रभाव। आजीविका, करियर और प्राथमिक योजनाओं में नए पुनर्गठन का समय। पुराने रुके हुए प्रयासों को नई गति प्राप्त होगी।`,
        forecastEn: `Year ${currentYear} (Age ${nativeAge}): Influenced by ${currentDasha}. Career restructuring and resumption of pending initiatives.`,
        focusArea: 'करियर व आजीविका पुनर्गठन',
      },
      {
        year: currentYear + 1,
        age: nativeAge + 1,
        dashaPeriod: dashaHindi,
        forecastHindi: `वर्ष ${currentYear + 1} (आयु ${nativeAge + 1}): आर्थिक उन्नति और प्रभावशाली संपर्कों का विस्तार। पद-प्रतिष्ठा, वेतन वृद्धि तथा सामाजिक प्रभाव में सुखद वृद्धि के योग।`,
        forecastEn: `Year ${currentYear + 1} (Age ${nativeAge + 1}): Financial expansion, valuable professional contacts, and elevation in public reputation.`,
        focusArea: 'आर्थिक लाभ व पदोन्नति',
      },
      {
        year: currentYear + 2,
        age: nativeAge + 2,
        dashaPeriod: dashaHindi,
        forecastHindi: `वर्ष ${currentYear + 2} (आयु ${nativeAge + 2}): पारिवारिक सौहार्द, सुख-सुविधाओं में वृद्धि, तथा अचल संपत्ति (मकान/भूमि) या वाहन प्राप्ति के प्रबल योग।`,
        forecastEn: `Year ${currentYear + 2} (Age ${nativeAge + 2}): Domestic harmony, growth in comforts, and favorable prospects for fixed assets or property.`,
        focusArea: 'संपत्ति व पारिवारिक मंगल',
      },
      {
        year: currentYear + 3,
        age: nativeAge + 3,
        dashaPeriod: dashaHindi,
        forecastHindi: `वर्ष ${currentYear + 3} (आयु ${nativeAge + 3}): कार्यक्षेत्र में व्यापक विस्तार और नेतृत्वकारी जिम्मेदारियां। कार्यभार अधिक रहेगा, अतः स्वास्थ्य व जीवनशैली पर संतुलन आवश्यक है।`,
        forecastEn: `Year ${currentYear + 3} (Age ${nativeAge + 3}): Professional expansion and leadership duties. Balance needed for lifestyle and vitality.`,
        focusArea: 'कार्य विस्तार व स्वास्थ्य संतुलन',
      },
      {
        year: currentYear + 4,
        age: nativeAge + 4,
        dashaPeriod: dashaHindi,
        forecastHindi: `वर्ष ${currentYear + 4} (आयु ${nativeAge + 4}): दीर्घकालिक परिश्रम का संपूर्ण फल। मानसिक शांति, संचित धन की सुदृढ़ता, समाज में उच्च सम्मान और स्थायी सफलता का दौर।`,
        forecastEn: `Year ${currentYear + 4} (Age ${nativeAge + 4}): Consolidating long-term perseverance, solidified financial base, high honor, and deep peace.`,
        focusArea: 'स्थायी प्रतिष्ठा व पूर्णता',
      },
    ];

    if (isHindi) {
      return {
        reply: `🔮 **आगामी 5 वर्षों का वर्ष-वार संपूर्ण भविष्यफल (${currentYear} से ${currentYear + 4})**
*(जातक: ${userName || 'सम्मानित जातक'} | जन्म लग्न: ${ascHindi} | चंद्र राशि: ${moonHindi} | वर्तमान महादशा: ${dashaHindi})*

आपकी जन्म कुंडली के 10वें (कर्म), 2रे/11वें (धन-लाभ), 4थे (सुख-संपत्ति) भावों और वर्तमान **${dashaHindi} की महादशा** व शनि-गुरु के गोचर के सूक्ष्म विश्लेषण के अनुसार आने वाले 5 वर्षों का वर्ष-वार फलादेश निम्नवत है:

${yearsList
  .map(
    (item: any, i: number) =>
      `📅 **${i + 1}. वर्ष ${item.year} (आयु: ~${item.age} वर्ष):**\n• **मुख्य प्रभाव:** ${item.dashaPeriod}\n• **फलादेश:** ${item.forecastHindi}\n• **प्राथमिकता क्षेत्र:** ${item.focusArea}`
  )
  .join('\n\n')}

🌟 **आगामी 5 वर्षों के सबसे महत्वपूर्ण मोड़ व शुभ संकेत:**
• **करियर एवं आजीविका:** वर्ष ${currentYear} के उत्तरार्ध से वर्ष ${currentYear + 1} के बीच आपको कार्यक्षेत्र में सबसे बड़ा सकारात्मक उछाल या प्रमोशन देखने को मिलेगा।
• **आर्थिक स्थिति:** वर्ष ${currentYear + 1} और ${currentYear + 2} में स्थायी संपत्ति, बचत और पुराने कर्जों से मुक्ति के विशेष योग बनते हैं।
• **स्वास्थ्य एवं सावधानी:** वर्ष ${currentYear + 3} में अत्यधिक कार्यभार के कारण मानसिक तनाव से बचें। नियमित दिनचर्या और योग अत्यंत लाभकारी रहेगा।

🪔 **आगामी 5 वर्षों को निर्बाध व अत्यंत सफल बनाने के वैदिक उपाय:**
• **महादशा स्वामी की अनुकूलता:** ${dashaHindi} के शुभ प्रभाव को बढ़ाने के लिए प्रतिदिन शुद्ध भाव से ईष्ट देव का स्मरण करें।
• **कल्याणकारी मंत्र:** प्रतिदिन सुबह 11 बार *"ॐ नमो भगवते वासुदेवाय"* या *"ॐ नमः शिवाय"* का मानसिक जप करें।
• **कौटुंबिक व सामाजिक कर्म:** प्रति माह एक बार असहायों, विद्यार्थियों या गौशाला में अपनी सामर्थ्यानुसार गुप्त दान अवश्य करें; इससे गोचर जनित बाधाएं स्वतः शांत हो जाती हैं।`,
        suggestedQuestions: [
          'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
          'मेरी कुंडली में धन संचय और संपत्ति के क्या योग हैं?',
          'करियर में प्रमोशन और तरक्की के लिए सबसे शुभ समय कौन सा है?',
          'मेरी लग्न के अनुसार सबसे भाग्यशाली रत्न कौन सा है?',
        ],
      };
    } else {
      return {
        reply: `🔮 **Comprehensive 5-Year Year-by-Year Vedic Forecast (${currentYear}–${currentYear + 4})**
*(Native: ${userName || 'Seeker'} | Ascendant: ${ascendant} | Moon Sign: ${moonSign} | Active Mahadasha: ${currentDasha})*

Synthesizing your natal 10th (Karma), 2nd/11th (Wealth), and 4th (Assets) houses alongside your running **${currentDasha} Mahadasha cycle** and Saturn-Jupiter transits:

${yearsList
  .map(
    (item: any, i: number) =>
      `📅 **${i + 1}. Year ${item.year} (Age: ~${item.age} yrs):**\n• **Planetary Ruler:** ${item.dashaPeriod}\n• **Detailed Outlook:** ${item.forecastEn || item.forecastHindi}\n• **Key Focus:** ${item.focusArea}`
  )
  .join('\n\n')}

🌟 **Strategic Turning Points Across the 5-Year Horizon:**
• **Career Elevation:** The phase between late ${currentYear} and ${currentYear + 1} marks your strongest window for promotions and vocational breakthroughs.
• **Financial Consolidation:** Years ${currentYear + 1} and ${currentYear + 2} strongly favor property purchases, debt liquidation, and growing fixed savings.
• **Wellness Vigilance:** During year ${currentYear + 3}, guard against burnout by maintaining balanced sleep habits and regular exercise.

🪔 **Vedic Remedial Alignment:**
• Chant *"Om Namo Bhagavate Vasudevaya"* 11 times every morning at sunrise.
• Offer quiet charity or support to destitute elders or shelters once a month to ensure steady planetary grace.`,
        suggestedQuestions: [
          'Deep Past, Present & Future Astrological Timeline Analysis',
          'What are the wealth combinations in my chart?',
          'When is the auspicious time for my marriage?',
          'Which gemstone accelerates career advancement?',
        ],
      };
    }
  }

  // ==========================================
  // PRESET QUESTION 2: PAST, PRESENT & FUTURE COMPLETE TIMELINE (pq_past_present_future)
  // ==========================================
  if (/(bhoot|past|vartman|present|bhavisya|timeline|time line|भूत.*वर्तमान.*भविष्य|संपूर्ण विश्लेषण|जीवन यात्रा|बीता हुआ kal|बीते वर्ष)/i.test(query)) {
    const pastMilestones = kundaliContext?.timelineAnalysis?.pastMilestones || [
      {
        years: `${Math.max(birthYear, birthYear + 15)}–${birthYear + 22}`,
        ageRange: `आयु 15–22 वर्ष`,
        dasha: 'आरंभिक दशा',
        dashaHindi: 'आरंभिक ग्रह चक्र',
        keyThemeHindi: 'माध्यमिक व उच्च शिक्षा, संस्कारों का निर्माण और जीवन की प्रथम दिशा निर्धारण का कालखंड।',
        keyTheme: 'Formative education and academic milestones.',
      },
      {
        years: `${birthYear + 22}–${Math.min(currentYear, birthYear + 29)}`,
        ageRange: `आयु 22–29 वर्ष`,
        dasha: 'कर्म दशा',
        dashaHindi: 'कर्म चक्र',
        keyThemeHindi: 'करियर की प्रथम नींव, आजीविका हेतु कड़ा संघर्ष, स्थान परिवर्तन अथवा पारिवारिक उत्तरदायित्वों का आरंभ।',
        keyTheme: 'First career struggles, relocation, and personal identity consolidation.',
      },
    ];

    const currentSit = kundaliContext?.timelineAnalysis?.currentSituation;
    const isSadeSatiActive = Boolean(kundaliContext?.doshas?.isSadeSati || CURRENT_SADE_SATI_SIGNS.includes(moonSign));
    const isDhaiyaActive = CURRENT_DHAIYA_SIGNS.includes(moonSign);

    let saturnAnalysisHi = 'शनि देव आपकी कुंडली में अनुकूल गोचर में हैं, जिससे आपके धैर्य और ईमानदारी का निरंतर शुभ प्रतिफल मिल रहा है।';
    if (isSadeSatiActive) {
      saturnAnalysisHi = `आपकी ${moonHindi} चंद्र राशि पर **शनि की साढ़ेसाती** का प्रभाव सक्रिय है। यह समय जीवन में अनुशासन, धीरज और पुराने कर्मों के शोधन का है। कोई भी बड़ा निर्णय जल्दबाजी या आवेश में न लें।`;
    } else if (isDhaiyaActive) {
      saturnAnalysisHi = `आपकी राशि पर **शनि की ढैया** का गोचर प्रभाव है। यह मानसिक संतुलन बनाए रखने और अनावश्यक आर्थिक जोखिमों से बचने की सलाह देता है।`;
    }

    if (isHindi) {
      return {
        reply: `📜 **भूत, वर्तमान और भविष्य का संपूर्ण वैदिक विश्लेषण (Deep Life Timeline Report)**
*(जातक: ${userName || 'सम्मानित जातक'} | जन्म वर्ष: ~${birthYear} | वर्तमान आयु: ~${nativeAge} वर्ष | जन्म लग्न: ${ascHindi} | चंद्र राशि: ${moonHindi})*

वैदिक ज्योतिष में महर्षि पराशर के विंशोत्तरी दशा चक्र एवं ग्रहों के गोचर के अनुसार आपकी संपूर्ण जीवन यात्रा का यथार्थ विश्लेषण इस प्रकार है:

---

⏳ **१. भूतकाल की प्रमुख घटनाएं एवं मील के पत्थर (Past Milestones by Years & Age):**
आपकी जन्म कुंडली में पुरानी महादशाओं के परिवर्तन ने आपके जीवन में समय-समय पर महत्वपूर्ण मोड़ दिए हैं:
${pastMilestones
  .map(
    (m: any) =>
      `• **कालखंड ${m.years} (${m.ageRange}):** ${m.dashaHindi} का काल — ${m.keyThemeHindi}`
  )
  .join('\n')}
*ज्योतिषीय पुष्टि:* इन विगत वर्षों में आपने जो भी परिश्रम या संघर्ष देखा, वह आपकी कुंडली में कर्म स्थान को तराशने की आवश्यक प्रक्रिया थी, जिसने आपके व्यक्तित्व को सुदृढ़ बनाया।

---

⚡ **२. वर्तमान स्थिति और हालातों का सूक्ष्म विश्लेषण (Current Life Situation Report):**
• **सक्रिय महादशा:** वर्तमान समय में आपकी कुंडली पर **${dashaHindi} की महादशा** का प्रत्यक्ष प्रभाव है।
• **मानसिक व परिस्थितिजन्य स्थिति:** ${
        currentSit?.currentMindsetState ||
        'वर्तमान में आप अपने करियर, आर्थिक स्थिरता और भविष्य की दिशा को लेकर अत्यंत जागरूक और गंभीर हैं। मन में कभी-कभी कार्य में विलंब को लेकर चिंता हो सकती है, लेकिन आपकी आंतरिक शक्ति पूर्णतः जीवंत है।'
      }
• **शनि गोचर स्थिति:** ${saturnAnalysisHi}
• **बृहस्पति (गुरु) का प्रभाव:** गुरु देव का शुभ दृष्टि प्रभाव आपके विवेक, ज्ञान और सही निर्णय लेने की क्षमता को निरंतर संबल प्रदान कर रहा है।

---

🌅 **३. आगामी भविष्य के प्रमुख मोड़ व भाग्योदय (Future Turning Points & Breakthroughs):**
• **राहत व सफलता का कालखंड:** आगामी 6 से 18 महीनों के भीतर आपके रुके हुए कार्यों में अप्रत्याशित गति आएगी। विशेष रूप से करियर व आर्थिक क्षेत्र में नए सकारात्मक द्वार खुलेंगे।
• **दीर्घकालिक दृष्टिकोण:** वर्ष ${currentYear + 1} से ${currentYear + 3} के मध्य पारिवारिक प्रतिष्ठा, धन संचय और स्थायी संपत्तियों के निर्माण में बड़ा मोड़ आएगा।
• **भाग्य की दिशा:** आपकी मेहनत का 80% परिणाम तुरंत और शेष 20% संचित भाग्य के रूप में आगामी अनुकूल दशा में अवश्य फलीभूत होगा।

---

🌿 **४. वर्तमान ग्रह-शांति व निर्बाध उन्नति हेतु सिद्ध वैदिक उपाय:**
• **दैनिक सात्विक नियम:** प्रतिदिन सुबह माता-पिता व बुजुर्गों का चरण स्पर्श कर आशीर्वाद लें; यह नवग्रहों की सबसे बड़ी सात्विक शांति है।
• **शनि व राहु शांति:** प्रत्येक शनिवार को शाम के समय पीपल के वृक्ष के नीचे या घर के पूजा स्थल पर सरसों के तेल का दीपक प्रज्वलित करें।
• **मानसिक शांति व एकाग्रता:** नियमित रूप से *"ॐ नमः शिवाय"* का 108 बार जप करें। यह चंद्रमा को बलवान बनाकर मानसिक तनाव को पूर्णतः समाप्त करता है।`,
        suggestedQuestions: [
          'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
          'मेरी कुंडली में नौकरी और प्रमोशन के क्या योग हैं?',
          'मेरी कुंडली में कौन से ग्रह कमजोर हैं और उनके उपाय क्या हैं?',
          'मेरे लिए सबसे भाग्यशाली रत्न कौन सा है?',
        ],
      };
    } else {
      return {
        reply: `📜 **Deep Past, Present & Future Astrological Timeline Analysis**
*(Native: ${userName || 'Seeker'} | Birth Year: ~${birthYear} | Age: ~${nativeAge} yrs | Ascendant: ${ascendant} | Moon Sign: ${moonSign})*

Structured strictly according to classical Parashari Dasha principles and astronomical planetary transits:

---

⏳ **1. Past Milestone Years & Events (Historical Life Phases):**
${pastMilestones
  .map(
    (m: any) =>
      `• **Years ${m.years} (${m.ageRange}):** Under ${m.dasha} — ${m.keyTheme}`
  )
  .join('\n')}
*Astrological Confirmation:* Past cycles fulfilled necessary karmic groundwork, strengthening your maturity and resilience.

---

⚡ **2. Current Life Situation & Circumstances:**
• **Active Mahadasha:** You are navigating the **${currentDasha} cycle**, steering foundational life themes.
• **State of Mind:** You are actively evaluating long-term financial security and professional trajectory.
• **Saturn Influence:** ${isSadeSatiActive ? 'Saturn Sade Sati is active, requiring patience and systematic discipline.' : 'Saturn is transiting favorable houses, gradually rewarding consistent effort.'}
• **Jupiter's Grace:** Jupiter's benevolent trines preserve wisdom and protect against irreversible pitfalls.

---

🌅 **3. Upcoming Future Milestones & Turning Points:**
• **Breakthrough Window:** An auspicious acceleration occurs within the next 6 to 18 months in vocational and financial channels.
• **Long-term Trajectory:** Years ${currentYear + 1} to ${currentYear + 3} establish permanent assets, domestic harmony, and elevated status.

---

🌿 **4. Authentic Vedic Harmonizing Remedies:**
• Light a mustard oil lamp on Saturday evenings to harmonize Saturnian energy.
• Chant *"Om Namah Shivaya"* 108 times daily to stabilize lunar emotions and cultivate sharp mental clarity.`,
        suggestedQuestions: [
          'How will my life unfold over the next 5 years?',
          'What are my career and promotion prospects?',
          'Which gemstone suits my destiny best?',
          'What are the remedies for my weak planets?',
        ],
      };
    }
  }

  // ==========================================
  // 1. GREETINGS & INTRODUCTIONS
  // ==========================================
  if (/^(hi|hello|hey|namaste|pranam|namaskar|radhe|jai|shree|hari|om|kese ho|kaise ho|ram ram)/i.test(query)) {
    if (isFollowUp) {
      if (isHindi) {
        return {
          reply: `🙏 **प्रणाम${userName ? ` ${userName} जी` : ''}!** आपकी कुंडली सक्रिय है। आप अपने करियर, विवाह, आगामी 5 वर्षों के भविष्य, या भूत-वर्तमान-भविष्य के संपूर्ण विश्लेषण में से जो भी विषय जानना चाहें, सीधा पूछ सकते हैं।`,
          suggestedQuestions: [
            'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
            'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
            'मेरी कुंडली में करियर और प्रमोशन के क्या योग हैं?',
            'मेरे लिए सबसे भाग्यशाली रत्न कौन सा है?',
          ],
        };
      } else {
        return {
          reply: `🙏 **Namaste${userName ? ` ${userName}` : ''}!** Your chart is active. Feel free to ask about your career, marriage timing, upcoming 5-year forecast, or full past-present-future timeline.`,
          suggestedQuestions: [
            'How will my life unfold over the next 5 years?',
            'Comprehensive Past, Present & Future Vedic Timeline',
            'What are my career and promotion prospects?',
            'Which gemstone suits my destiny best?',
          ],
        };
      }
    }
    if (isHindi) {
      return {
        reply: `🙏 **प्रणाम एवं सप्रेम शुभाशीर्वाद${userName ? `, ${userName} जी` : ''}!**

मैं आपका ज्योतिष मार्गदर्शक **"आचार्य एस्ट्रोदोस्त"** हूँ।

${
  hasRealKundali
    ? `**सक्रिय कुंडली:**
• **जातक:** ${userName}
• **लग्न:** ${ascHindi} (लग्न स्वामी: ${lagnaLordHindi})
• **चंद्र राशि:** ${moonHindi}${nakshatraHindi ? ` (नक्षत्र: ${nakshatraHindi})` : ''}
• **वर्तमान महादशा:** ${dashaHindi}

आपकी जन्म कुंडली मेरे सामने खुली है। आप मुझसे अपने करियर, नौकरी, विवाह, धन, स्वास्थ्य या उपायों के बारे में निसंकोच सीधा प्रश्न पूछ सकते हैं।`
    : `*नोट: अभी आपने कोई जन्म कुंडली लिंक नहीं की है। आप ऊपर "अपनी जन्म जानकारी जोड़ें" पर क्लिक करके अपना विवरण जोड़ सकते हैं ताकि आपको अपनी कुंडली के अनुसार सटीक उत्तर मिले।*`
}

बताइए, आज आप किस विषय में मार्गदर्शन चाहते हैं?`,
        suggestedQuestions: [
          hasRealKundali ? `मेरी कुंडली में नौकरी और प्रमोशन के क्या योग हैं?` : 'मेरी कुंडली में सरकारी नौकरी या प्रमोशन के क्या योग हैं?',
          hasRealKundali ? `मेरा विवाह कब तक होगा और जीवनसाथी कैसा मिलेगा?` : 'मेरा विवाह कब होगा और वैवाहिक जीवन कैसा रहेगा?',
          hasRealKundali ? `मेरी ${ascHindi} लग्न के लिए कौन सा रत्न सबसे शुभ है?` : 'मेरे लिए सबसे भाग्यशाली रत्न कौन सा है?',
          hasRealKundali ? `क्या मेरी ${moonHindi} राशि पर शनि की साढ़ेसाती का असर है?` : 'शनि की साढ़ेसाती / ढैया के सरल उपाय बताएं',
        ],
      };
    } else {
      return {
        reply: `🙏 **Namaste & Warm Blessings${userName ? `, ${userName}` : ''}!**

I am your Vedic astrology guide, **"Acharya AstroDost"**.

${
  hasRealKundali
    ? `**Active Birth Chart:**
• **Native:** ${userName}
• **Ascendant (Lagna):** ${ascendant} (Lord: ${lagnaLord})
• **Moon Sign (Rashi):** ${moonSign}${nakshatra ? ` (Nakshatra: ${nakshatra})` : ''}
• **Current Mahadasha:** ${currentDasha}

Your chart is active. Feel free to ask about your career, marriage timing, finances, Sade Sati, or auspicious remedies.`
    : `*Note: No birth chart is currently linked. You can link your birth details at the top to receive chart-tailored timing.*`
}

What question may I illuminate for you today?`,
        suggestedQuestions: [
          hasRealKundali ? `What are my career prospects for ${ascendant} Ascendant?` : 'What are my career and promotion prospects?',
          hasRealKundali ? `When is my marriage window and what will my spouse be like?` : 'When is the auspicious time for my marriage?',
          hasRealKundali ? `Which gemstone suits my ${ascendant} Ascendant best?` : 'Which gemstone and metal suit my destiny best?',
          hasRealKundali ? `Is Saturn Sade Sati currently affecting my ${moonSign} Moon?` : 'What are the best remedies for Saturn Sade Sati?',
        ],
      };
    }
  }

  // ==========================================
  // 2. CAREER / JOB / SARKARI NAUKRI / PROMOTION
  // ==========================================
  if (/(career|job|naukri|promotion|business|vyapar|kaam|work|interview|office|salary|exam|sarkari|goverment|transfer|नौकरी|जॉब|करियर|काम|व्यवसाय|व्यापार|पदोन्नति|प्रमोशन|वेतन|सैलरी|सरकारी|परीक्षा|आजीविका|रोजगार)/i.test(query)) {
    const isSarkariQuery = /(sarkari|goverment|civil|upsc|ssc|ias|ips|exam|सरकारी|प्रशासन|सिविल)/i.test(query);
    const careerDomain = CAREER_BY_PLANET[lord10] || CAREER_BY_PLANET.Saturn;
    const sign10Hindi = ZODIAC_HINDI[sign10] || sign10;
    const lord10Hindi = PLANETS_HINDI[lord10] || lord10;

    const careerRemedyHi = isFollowUp
      ? `• दशमेश **${lord10Hindi}** की शुभता हेतु प्रत्येक मंगलवार अथवा शनिवार को हनुमान चालीसा का पाठ करें और कार्यस्थल पर उत्तर दिशा की ओर मुख रखकर काम करें।`
      : `• प्रतिदिन सुबह तांबे के पात्र से सूर्य देव को जल अर्पित करें और *"ॐ घृणिः सूर्याय नमः"* का 11 बार जप करें।`;

    if (isHindi) {
      return {
        reply: `🎯 **करियर व आजीविका फलादेश (Professional Trajectory)**
*(लग्न: ${ascHindi} | दशम कर्म भाव: ${sign10Hindi} | कर्मेश: ${lord10Hindi} | सक्रिय दशा: ${dashaHindi})*

${
  isSarkariQuery
    ? `आपकी कुंडली में कर्म और प्रशासनिक प्रभाव का स्थान मजबूत स्थिति में है। सरकारी या संगठित क्षेत्र की प्रतियोगी परीक्षाओं में सतत तैयारी से आगामी 6 से 12 महीनों में सफलता के स्पष्ट योग बनते हैं।`
    : `आपके कार्यक्षेत्र में सकारात्मक गतिशीलता और उन्नति के योग सक्रिय हैं। आने वाले 4 से 8 महीनों में आपको पदोन्नति (प्रमोशन), नई जिम्मेदारियां या अनुकूल ट्रांसफर के सुखद समाचार मिल सकते हैं।`
}

🪐 **दशम भाव व कर्मेश का ज्योतिषीय विश्लेषण:**
• आपकी कुंडली का 10वां भाव (कर्म व मान-प्रतिष्ठा) **${sign10Hindi}** राशि में है, जिसके स्वामी ग्रह **${lord10Hindi}** हैं।
• वर्तमान में **${dashaHindi} की महादशा** आपके कर्म और लाभ स्थान को सक्रिय कर रही है।
${planetsIn10.length > 0 ? `• दशम भाव में स्थित ग्रह: ${planetsIn10.join(', ')}।` : ''}

✨ **आपके लिए अनुकूल कार्यक्षेत्र व व्यावहारिक दिशा:**
आपके लिए विशेष रूप से **${careerDomain.hi}** के क्षेत्रों में आगे बढ़ने पर सबसे अधिक मान-सम्मान और सफलता के आसार हैं।

🪔 **कार्यसिद्धि व उन्नति के विशिष्ट उपाय:**
${careerRemedyHi}
• अपने काम में ईमानदारी, समय की पाबंदी और अनुशासन बनाए रखें। किसी भी नए अवसर में जल्दबाजी के बजाय पूरी तैयारी से आगे बढ़ें।`,
        suggestedQuestions: [
          'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
          'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
          'मेरी कुंडली के अनुसार व्यापार अच्छा रहेगा या नौकरी?',
          'करियर में सफलता के लिए कौन सा रत्न धारण करना चाहिए?',
        ],
      };
    } else {
      return {
        reply: `🎯 **Career & Professional Trajectory**
*(Ascendant: ${ascendant} | 10th House: ${sign10} | 10th Lord: ${lord10} | Active Dasha: ${currentDasha})*

${
  isSarkariQuery
    ? `Your birth chart indicates promising planetary alignments for competitive examinations and administrative advancement over the upcoming 6 to 12 months.`
    : `Your chart shows positive professional momentum. The next 4 to 8 months are favorable for promotions, career shifts, or new responsibilities.`
}

🪐 **10th House Planetary Analysis:**
• 10th House (Karma & Status) is placed in **${sign10}**, ruled by **${lord10}**.
• You are currently running the **${currentDasha} Mahadasha cycle**, activating vocational momentum.
${planetsIn10.length > 0 ? `• Planets occupying 10th House: ${planetsIn10.join(', ')}.` : ''}

✨ **High-Potential Professional Domains:**
Excellence indicated in: **${careerDomain.en}**.

🪔 **Targeted Remedies for Career Advancement:**
• Chant *"Om Ghrinih Suryaya Namah"* 11 times every morning.
• Align your workspace toward the North or East to channel auspicious creative clarity.`,
        suggestedQuestions: [
          'How will my life unfold over the next 5 years?',
          'Deep Past, Present & Future Astrological Timeline Analysis',
          'Is business or salaried employment more profitable for my chart?',
          'Which gemstone accelerates career advancement?',
        ],
      };
    }
  }

  // ==========================================
  // 3. MARRIAGE / RELATIONSHIPS / LOVE / SPOUSE
  // ==========================================
  if (/(marr|shaadi|vivah|love|relationship|patni|pati|spouse|husband|wife|pyaar|breakup|divorce|shadi|partner|wedding|rishta|jeevansathi|विवाह|शादी|ब्याह|दांपत्य|जीवनसाथी|पति|पत्नी|प्रेम|प्यार|रिश्ता|संबंध|सगाई|लव मैरिज)/i.test(query)) {
    const sign7Hindi = ZODIAC_HINDI[sign7] || sign7;
    const lord7Hindi = PLANETS_HINDI[lord7] || lord7;
    const spouseTraits = SPOUSE_TRAITS_BY_7TH_SIGN[sign7] || SPOUSE_TRAITS_BY_7TH_SIGN.Libra;

    const marriageRemedyHi = isFollowUp
      ? `• वैवाहिक समरसता हेतु शुक्रवार के दिन किसी कन्या अथवा जरूरतमंद को श्वेत मिष्ठान या खीर का प्रसाद वितरित करें।\n• शयनकक्ष में सकारात्मक ऊर्जा हेतु गुलाब जल का हल्का छिड़काव रखें और कटु वचनों से बचें।`
      : `• प्रत्येक शुक्रवार को माता महालक्ष्मी अथवा भगवान शिव-पार्वती का ध्यान कर घी का दीपक प्रज्वलित करें।\n• जीवनसाथी के प्रति आदर, मधुर वाणी और पारदर्शी संवाद बनाए रखें।`;

    if (isHindi) {
      return {
        reply: `💍 **विवाह योग व दांपत्य जीवन फलादेश (Marital Astrological Analysis)**
*(लग्न: ${ascHindi} | सप्तम कलत्र भाव: ${sign7Hindi} | सप्तमेश: ${lord7Hindi} | सक्रिय महादशा: ${dashaHindi})*

आपकी कुंडली के सप्तम भाव और विवाह कारक ग्रहों के सूक्ष्म निरीक्षण से आगामी 6 से 14 महीनों के भीतर विवाह के अत्यंत शुभ और फलदायी योग निर्मित हो रहे हैं।

🪐 **सप्तम भाव व दांपत्य ग्रहों की स्थिति:**
• आपकी कुंडली का 7वां भाव (विवाह व जीवनसाथी) **${sign7Hindi}** राशि में है, जिसके स्वामी ग्रह **${lord7Hindi}** हैं।
• ${
  isManglik
    ? `आपकी कुंडली में सौम्य मंगल का प्रभाव (मांगलिक योग) है। 28 वर्ष की आयु के बाद यह प्रभाव स्वाभाविक रूप से शांत हो जाता है, और अनुकूल गुण मिलान से दांपत्य जीवन अत्यंत मधुर रहता है।`
    : `आपकी कुंडली पूर्णतः मांगलिक दोष से मुक्त है। दांपत्य भाव में शुभ ग्रहों का संरक्षण प्राप्त है।`
}
• वर्तमान में सक्रिय **${dashaHindi} महादशा** और देवगुरु बृहस्पति के गोचर का शुभ प्रभाव विवाह संबंधी वार्ताओं को शीघ्र परिणति तक पहुंचाने में सहायक है।

✨ **भावी जीवनसाथी का स्वरूप व अनुकूल स्वभाव:**
आपके होने वाले जीवनसाथी **${spouseTraits.hi}** उनका कार्यक्षेत्र शिक्षा, वित्त, कला, चिकित्सा, प्रबंधन या स्वतंत्र व्यवसाय से जुड़ा रहने की प्रबल संभावना है।

🪔 **सुखद दांपत्य व शीघ्र मांगलिक कार्य हेतु सिद्ध उपाय:**
${marriageRemedyHi}
• वैवाहिक निर्णय में जल्दबाजी के स्थान पर दोनों परिवारों की आपसी समझ और संस्कारों की अनुकूलता को प्राथमिकता दें।`,
        suggestedQuestions: [
          'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
          'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
          'क्या मेरी कुंडली में प्रेम विवाह (Love Marriage) के योग हैं या अरेंज मैरिज के?',
          'मेरी कुंडली में करियर और प्रमोशन के क्या योग हैं?',
        ],
      };
    } else {
      return {
        reply: `💍 **Marital & Relationship Astrological Reading**
*(Ascendant: ${ascendant} | 7th House: ${sign7} | 7th Lord: ${lord7} | Running Dasha: ${currentDasha})*

Planetary configurations operating in your 7th house and Venusian-Jupiterian transits activate an auspicious matrimonial window within the upcoming 6 to 14 months.

🪐 **7th House Planetary Dynamics:**
• 7th House of partnership is situated in **${sign7}**, governed by **${lord7}**.
• ${
  isManglik
    ? `Your chart reflects gentle Manglik dynamics. Classical texts indicate that this energy matures comfortably after age 28, harmonized through balanced astrological matching.`
    : `Your horoscope is free from disruptive Manglik Dosha, indicating organic equilibrium in partnership matters.`
}
• Active **${currentDasha} Mahadasha cycle** combined with Jupiter's benevolent aspects creates favorable conditions for matrimony.

✨ **Spousal Characteristics & Archetype:**
Your prospective partner naturally exhibits: **${spouseTraits.en}**

🪔 **Vedic Harmonizing Practices:**
• Offer white sweets or milk charity on Friday mornings for Venusian blessings.
• Maintain open, transparent communication and mutual respect across all relationships.`,
        suggestedQuestions: [
          'How will my life unfold over the next 5 years?',
          'Deep Past, Present & Future Astrological Timeline Analysis',
          'Does my chart indicate love marriage or arranged marriage?',
          'What are my career and promotion prospects?',
        ],
      };
    }
  }

  // ==========================================
  // 4. GEMSTONES / RATNA / PANNA / PUKHRAJ / MANIKYA
  // ==========================================
  if (/(gemstone|ratna|stone|panna|emerald|pukhraj|sapphire|manikya|ruby|neelam|moti|pearl|moonga|coral|heera|diamond|gomed|catseye|ring|anguthi|रत्न|नगीना|अंगूठी|माणिक्य|माणिक|मोती|मूंगा|पन्ना|पुखराज|हीरा|नीलम|गोमेद|लहसुनिया|स्टोन)/i.test(query)) {
    const luckyGems = lagnaInfo.gems;
    const forbiddenGems = lagnaInfo.forbidden;

    if (isHindi) {
      return {
        reply: `💎 **लग्न-विशेष भाग्यशाली रत्न परामर्श (Auspicious Gemstone Guidance)**
*(आपकी लग्न: ${ascHindi} | लग्नेश: ${lagnaLordHindi} | शुभ त्रिकोण भाव: 1, 5, 9)*

वैदिक ज्योतिष के महर्षि पराशर सिद्धांत के अनुसार रत्न केवल उन्हीं ग्रहों के धारण करने चाहिए जो आपकी जन्म लग्न के लिए स्वाभाविक रूप से कारक (योगकारक व त्रिकोण स्वामी) हों।

✨ **आपकी ${ascHindi} लग्न के लिए सर्वाधिक शुभ कारक रत्न:**
${luckyGems
  .map(
    (g, idx) =>
      `• **${idx === 0 ? 'प्राण/जीवन रत्न (Life Stone)' : idx === 1 ? 'भाग्य संवर्धक रत्न (Lucky Stone)' : 'विद्या व ज्ञान रत्न (Wisdom Stone)'}:** **${g.gemHindi}** (${g.planet} का रत्न)\n  यह रत्न आपकी जीवन ऊर्जा, आत्मविश्वास, निर्णय शक्ति और भाग्य के अवरोधों को दूर करने में सर्वाधिक सक्षम है।`
  )
  .join('\n')}

🪔 **रत्न धारण की शास्त्रीय विधि व सावधानियां:**
• किसी भी रत्न को धारण करने से पूर्व कच्चे दूध, गंगाजल और तुलसी पत्र से शुद्ध करें।
• उस ग्रह के शुभ वार को सूर्योदय के समय बीज मंत्र का 108 बार जप कर उचित धातु (सोना, चांदी या पंचधातु) में दाहिने हाथ की संबंधित उंगली में धारण करें।
• यदि मुख्य रत्न अत्यंत कीमती हो, तो उसका प्रामाणिक उपरत्न भी समान रूप से प्रभावी होता है।

⚠️ **वर्जित मारक रत्न (इन्हें भूलकर भी न पहनें):**
${forbiddenGems
  .map((f) => `• **${f.gemHindi}:** यह रत्न आपकी लग्न के लिए मारक/बाधक ग्रह का है, इसे पहनने से मानसिक तनाव या स्वास्थ्य समस्याएं हो सकती हैं।`)
  .join('\n')}`,
        suggestedQuestions: [
          'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
          'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
          'रत्न को किस धातु (सोना, चांदी, तांबा) में बनवाना चाहिए?',
          'मेरी कुंडली में करियर और प्रमोशन के क्या योग हैं?',
        ],
      };
    } else {
      return {
        reply: `💎 **Ascendant-Specific Gemstone Consultation**
*(Ascendant: ${ascendant} | Ascendant Lord: ${lagnaLord} | Supportive Houses: 1, 5, 9)*

In classical Vedic astrology, gemstones should exclusively strengthen functional benefic planets governing the trine houses (1st, 5th, 9th). Obstructive planet gems must be avoided.

✨ **Most Auspicious Gemstones for Your ${ascendant} Ascendant:**
${luckyGems
  .map(
    (g, idx) =>
      `• **${idx === 0 ? 'Primary Life Stone' : idx === 1 ? 'Fortune Catalyst' : 'Wisdom & Intellect Stone'}:** **${g.gem} (${g.gemHindi})** — Governed by ${g.planet}.\n  Amplifies vitality, cognitive clarity, and fortunate opportunities.`
  )
  .join('\n')}

🪔 **Purification and Wearing Guidelines:**
• Cleanse with pure water and milk on an auspicious morning.
• Energize with 108 mantra recitations of the ruling planet at sunrise.
• Wear in the designated finger in certified gold, silver, or Panchadhatu.

⚠️ **Contraindicated Stones (Avoid Wearing):**
${forbiddenGems
  .map((f) => `• **${f.gem} (${f.gemHindi}):** Functions as an obstacle or Maraka ruler for your Ascendant; avoid wearing it.`)
  .join('\n')}`,
        suggestedQuestions: [
          'How will my life unfold over the next 5 years?',
          'Deep Past, Present & Future Astrological Timeline Analysis',
          'Which metal and finger are recommended for my lucky stone?',
          'What are my career and promotion prospects?',
        ],
      };
    }
  }

  // ==========================================
  // 5. SHANI / SADE SATI / DHAIYA / SATURN
  // ==========================================
  if (/(shani|sadesati|sade sati|sade-sati|dhaiya|saturn|panoti|kantak)/i.test(query)) {
    const shaniRemedyHi = isFollowUp
      ? `• प्रत्येक मंगलवार व शनिवार को सुंदरकांड का पाठ अथवा 11 बार संकटमोचन हनुमानाष्टक का पाठ करें।\n• घर के वृद्धजनों और कार्यस्थल के सहायकों को कभी भी अपमानित न करें, उन्हें यथोचित सम्मान दें।`
      : `• शनिवार शाम को पीपल के वृक्ष के नीचे सरसों के तेल का चौमुखा दीपक जलाएं।\n• *"ॐ शं शनैश्चराय नमः"* का शांत मन से 108 बार जप करें और जरूरतमंदों को काले तिल अथवा भोजन दान करें।`;

    if (isHindi) {
      return {
        reply: `🪐 **शनि देव गोचर व साढ़ेसाती/ढैया यथार्थ विश्लेषण (Saturn Transit Assessment)**
*(आपकी चंद्र राशि: ${moonHindi} | जन्म लग्न: ${ascHindi} | सक्रिय ग्रह दशा: ${dashaHindi})*

शनि देव न्याय, सत्य और कर्मफल के अधिष्ठाता हैं। जो साधक अपने जीवन में अनुशासन, ईमानदारी और संयम बनाए रखता है, उसे शनि देव कभी हानि नहीं पहुंचाते, बल्कि दीर्घकालिक प्रतिष्ठा और स्थिरता प्रदान करते हैं।

⚡ **आपकी राशि पर शनि गोचर की वास्तविक स्थिति:**
• आपकी जन्म कालीन चंद्र राशि **${moonHindi}** है।
• ${
  isSadeSati
    ? `वर्तमान में आपकी चंद्र राशि पर **शनि की साढ़ेसाती / ढैया** का प्रभाव सक्रिय है। यह कालखंड घबराने का नहीं, बल्कि पुराने कर्मों के शोधन, अनावश्यक अहंकार के त्याग और भविष्य की सुदृढ़ नींव रखने का है।`
    : `वर्तमान में आपकी राशि साढ़ेसाती के कष्टकारी प्रभाव से पूर्णतः मुक्त है। शनि का गोचर आपके लिए सामान्य और अनुकूल है।`
}

✨ **धैर्य, कर्म शुद्धि और आगामी प्रभाव:**
इस समय की गई मेहनत का फल तत्काल मिलने के बजाय स्थायी रूप से मिलता है। किसी भी नए कार्य या कानूनी मामले में जल्दबाजी के स्थान पर अनुभवी व्यक्तियों की सलाह लें।

🪔 **सिद्ध शनि शांति व अनुकूलता हेतु वैदिक उपाय:**
${shaniRemedyHi}
• शनिवार के दिन मदिरा, मांसाहार और अनैतिक आचरण से पूर्णतः दूर रहें; यह शनि देव की सबसे बड़ी सात्विक प्रसन्नता है।`,
        suggestedQuestions: [
          'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
          'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
          'शनि की महादशा में किन बातों का ध्यान रखना चाहिए?',
          'मेरी कुंडली में धन संचय और संपत्ति के क्या योग हैं?',
        ],
      };
    } else {
      return {
        reply: `🪐 **Lord Shani Transit & Sade Sati Vedic Evaluation**
*(Moon Sign: ${moonSign} | Ascendant: ${ascendant} | Current Mahadasha: ${currentDasha})*

Lord Saturn represents karmic equilibrium, justice, and endurance. When approached with ethical integrity and steady diligence, Saturnian cycles solidify enduring achievement and resilience.

⚡ **Planetary Transit Status:**
• Your Moon Sign is **${moonSign}**.
• ${
  isSadeSati
    ? `Your Moon is currently navigating active **Saturn Sade Sati / Dhaiya transits**. This period cultivates mental fortitude, clears karmic backlogs, and establishes maturity.`
    : `Your Moon sign is currently free from the intense phases of Sade Sati. Transit conditions remain steady.`
}

✨ **Constructive Behavioral Alignment:**
Saturn rewards long-range planning, patience, and humility. Avoid impulsive shortcuts and maintain uncompromising consistency.

🪔 **Authentic Vedic Harmonization:**
• Recite the *Hanuman Chalisa* on Tuesdays and Saturdays.
• Light a mustard oil lamp under a Peepal tree or altar on Saturday evenings.
• Chant *"Om Sham Shanaishcharaya Namah"* 108 times and assist workers or elderly individuals.`,
        suggestedQuestions: [
          'How will my life unfold over the next 5 years?',
          'Deep Past, Present & Future Astrological Timeline Analysis',
          'How does Saturn transit interact with my natal chart?',
          'What are my career and promotion prospects?',
        ],
      };
    }
  }

  // ==========================================
  // 6. MANGLIK DOSHA / MARS / MANGAL
  // ==========================================
  if (/(mangal|manglik|kuja|bhauma|mars)/i.test(query)) {
    const mangalRemedyHi = isFollowUp
      ? `• मंगलवार के दिन लाल मसूर की दाल या गुड़ किसी मंदिर या गौशाला में दान करें।\n• अपने क्रोध और त्वरित प्रतिक्रिया पर नियंत्रण रखें; शांत मन से लिया गया निर्णय ही मंगलकारी होगा।`
      : `• मंगलवार को हनुमान जी के सम्मुख चमेली के तेल का दीपक जलाकर हनुमान बाहुक अथवा चालीसा का पाठ करें।\n• वर्ष में एक बार स्वेच्छा से रक्तदान करें; यह मंगल की अतिरिक्त ऊर्जा को जनकल्याण में परिवर्तित करता है।`;

    if (isHindi) {
      return {
        reply: `🔥 **मंगल प्रभाव व मांगलिक योग यथार्थ समीक्षा (Manglik Analysis)**
*(जन्म लग्न: ${ascHindi} | मंगल स्थिति विश्लेषण | सक्रिय महादशा: ${dashaHindi})*

${
  isManglik
    ? `आपकी कुंडली में मंगल ग्रह का विशेष प्रभाव (मांगलिक योग) उपस्थित है। वैदिक ज्योतिष में मांगलिक होना कोई अनिष्ट या भय का विषय नहीं है; यह जातक को अद्वितीय साहस, दृढ़ इच्छाशक्ति, त्वरित निर्णय क्षमता और नेतृत्व कौशल प्रदान करता है।`
    : `आपकी जन्म कुंडली पूर्णतः मांगलिक दोष से मुक्त है। वैवाहिक व सामाजिक क्षेत्र में मंगल का कोई नकारात्मक अवरोध नहीं है।`
}

🪐 **कुंडली में मंगल ग्रह का प्रभाव व लक्षण:**
• वैदिक सिद्धांत के अनुसार मंगल 1, 4, 7, 8 या 12वें भाव में स्थित होने पर यह योग बनाता है।
• ${
  isManglik
    ? `आपकी कुंडली में मंगल की ऊर्जा अत्यधिक जीवंत है। शास्त्रीय मतानुसार 28 वर्ष की आयु के पश्चात मंगल का उग्र प्रभाव स्वतः परिपक्व और शांत हो जाता है।`
    : `आपकी कुंडली में मंगल अनुकूल भावों में स्थित होकर आपको कार्यक्षमता और पुरुषार्थ प्रदान कर रहा है।`
}

✨ **ऊर्जा संतुलन व वैवाहिक दिशा:**
मांगलिक जातक अत्यंत स्वाभिमानी और स्पष्टवादी होते हैं। वैवाहिक संबंधों में केवल आपसी विश्वास, सम्मान और थोड़ा लचीलापन बनाए रखने से जीवन अत्यंत सुखी रहता है।

🪔 **मंगल शांति व सात्विक संवर्धन उपाय:**
${mangalRemedyHi}
• मांगलिक योग को किसी भी अंधविश्वास का रूप न दें; यह आपकी अदम्य कार्यशक्ति का परिचायक है।`,
        suggestedQuestions: [
          'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
          'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
          'क्या मांगलिक और गैर-मांगलिक का विवाह हो सकता है?',
          'विवाह में आ रहे विलंब को दूर करने के उपाय',
        ],
      };
    } else {
      return {
        reply: `🔥 **Mars Dynamics & Manglik Assessment**
*(Ascendant: ${ascendant} | Mars Placement Analysis | Running Dasha: ${currentDasha})*

${
  isManglik
    ? `Your horoscope reflects active Mars placement (Manglik configuration). In authentic Vedic principles, this is not a curse, but a marker of high physical vitality, leadership drive, and resolute determination.`
    : `Your birth chart is completely free from disruptive Manglik influences. Marital and partnership vectors remain open and balanced.`
}

🪐 **Classical Astrological Foundation:**
• ${
  isManglik
    ? `Classical texts affirm that Martian intensity naturally settles into mature leadership after age 28. Standard horoscopic matching ensures complete relational balance.`
    : `Mars is placed favorably, endowing you with stamina and productive initiative without friction.`
}

🪔 **Vedic Harmonizing Practices:**
• Chant *Hanuman Chalisa* on Tuesdays.
• Voluntary blood donation once a year channels surplus Martian heat into humanitarian grace.
• Channel excess energy into physical sports, disciplined workouts, and decisive creative projects.`,
        suggestedQuestions: [
          'How will my life unfold over the next 5 years?',
          'Deep Past, Present & Future Astrological Timeline Analysis',
          'Can a Manglik safely marry a non-Manglik?',
          'What are my career and promotion prospects?',
        ],
      };
    }
  }

  // ==========================================
  // 7. WEALTH / FINANCE / MONEY / DHANA YOGA
  // ==========================================
  if (/(wealth|finance|money|dhan|paisa|kuber|lakshmi|income|property|investment|loss|karz|debt|loan)/i.test(query)) {
    const wealthRemedyHi = isFollowUp
      ? `• प्रतिदिन सुबह घर की उत्तर दिशा में एक तांबे के पात्र में स्वच्छ जल रखें और शाम को किसी पौधे में अर्पित करें।\n• एकादशी के दिन अन्न दान अथवा गौ सेवा करें; इससे संचित धन में बरकत बनी रहती है।`
      : `• प्रत्येक शुक्रवार की शाम माता महालक्ष्मी के सम्मुख शुद्ध घी का दीपक जलाकर कनकधारा स्तोत्र अथवा श्री सूक्त का पाठ करें।\n• अपनी ईमानदारी से कमाई गई आय का न्यूनतम 2% हिस्सा परोपकार या असहायों की सेवा में लगाएं।`;

    if (isHindi) {
      return {
        reply: `💰 **धन, संचित कोष व आर्थिक योग फलादेश (Financial & Wealth Analysis)**
*(जन्म लग्न: ${ascHindi} | द्वितीय धन भाव | एकादश लाभ भाव | सक्रिय महादशा: ${dashaHindi})*

आपकी कुंडली के द्वितीय (संचित धन), एकादश (आय व लाभ) तथा नवम (भाग्य) भावों के योग यह दर्शाते हैं कि आपकी आजीविका में नियमित आर्थिक आवक और संपत्ति निर्माण के प्रबल अवसर विद्यमान हैं।

🪐 **द्वितीय व एकादश भाव का ज्योतिषीय विश्लेषण:**
• आपकी कुंडली में दूसरा भाव संचित धन, बैंक बैलेंस और वाणी का है, जबकि 11वां भाव स्थायी लाभ व आय के स्रोतों को नियंत्रित करता है।
• वर्तमान **${dashaHindi} महादशा** आपके आर्थिक प्रयासों को सुदृढ़ दिशा दे रही है। अनुशासित बचत से आपकी आर्थिक नींव निरंतर मजबूत होगी।

✨ **आर्थिक वृद्धि के स्वर्णिम अवसर व सावधानियां:**
• आगामी 8 से 16 महीनों में धन लाभ और नए आय के साधन विकसित होने के शुभ संकेत हैं।
• सट्टेबाजी, अनियोजित शेयर ट्रेडिंग या बिना लिखा-पढ़ी के किसी को बड़ी रकम उधार देने से बचें। स्थायी संपत्ति (भूमि, भवन, सुरक्षित बचत) में निवेश सर्वाधिक फलदायी रहेगा।

🪔 **श्री महालक्ष्मी कृपा व स्थायी धन संचय के सिद्ध उपाय:**
${wealthRemedyHi}
• घर की उत्तर दिशा (कुबेर स्थान) को हमेशा स्वच्छ, सुव्यवस्थित और हल्का रखें।`,
        suggestedQuestions: [
          'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
          'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
          'मेरी कुंडली में कौन से धन योग उपस्थित हैं?',
          'करियर में प्रमोशन और तरक्की के लिए सबसे शुभ समय कौन सा है?',
        ],
      };
    } else {
      return {
        reply: `💰 **Financial Potential & Wealth Accumulation Analysis**
*(Ascendant: ${ascendant} | 2nd Dhana Bhava | 11th Labha Bhava | Active Dasha: ${currentDasha})*

Synthesizing the 2nd house (accumulated savings), 11th house (revenue channels), and 9th house (fortune) in your birth chart indicates reliable prospects for long-term financial security.

🪐 **Planetary Wealth Vectors:**
• The 2nd and 11th houses govern your monetary inflow and financial stability.
• Your ongoing **${currentDasha} Mahadasha cycle** activates productive avenues for growing financial assets.

✨ **Wealth Milestones & Prudent Steps:**
• The upcoming 8 to 16 months offer high-potential windows for salary increments and new income streams.
• Prioritize secure, tangible assets (property, disciplined savings) over speculative gambling or unsecured personal loans.

🪔 **Vedic Financial Harmonizing Practices:**
• Recite the *Shree Suktam* or *Kanakadhara Stotram* on Friday evenings with a pure ghee lamp.
• Keep the North sector of your residence or office uncluttered to foster prosperous flow.
• Allocate a consistent modest portion of profits toward charitable and elder welfare.`,
        suggestedQuestions: [
          'How will my life unfold over the next 5 years?',
          'Deep Past, Present & Future Astrological Timeline Analysis',
          'What wealth yogas exist in my birth chart?',
          'What are my career and promotion prospects?',
        ],
      };
    }
  }

  // ==========================================
  // 8. DEFAULT / GENERAL / OTHER QUESTIONS (Zero Repetition)
  // ==========================================
  const generalRemedyHi = isFollowUp
    ? `• अपने ईष्ट देव के सम्मुख शुद्ध घी का दीपक जलाकर मौन ध्यान करें।
• पक्षियों को 7 प्रकार का अनाज (सप्तधान्य) या गौ माता को हरा चारा खिलाएं; यह समस्त ग्रहों के दोषों को स्वतः शांत करता है।`
    : `• प्रतिदिन सुबह स्नान के पश्चात सूर्य देव को जल अर्पित करें अथवा 11 बार गायत्री मंत्र का शांत मन से जप करें।
• माता-पिता व गुरुजनों का आदर करें और उनका शुभाशीर्वाद प्राप्त करें।`;

  if (isHindi) {
    return {
      reply: `🌟 **वैदिक ज्योतिषीय विश्लेषण व मार्गदर्शन**
*(लग्न: ${ascHindi} | लग्नेश: ${lagnaLordHindi} | चंद्र राशि: ${moonHindi} | सक्रिय ग्रह दशा: ${dashaHindi})*

आपके प्रश्न का उत्तर आपकी जन्म कुंडली की ग्रह स्थिति और वर्तमान दशा के आधार पर अत्यंत सकारात्मक और विचारणीय है।

🪐 **आपकी जन्मकुंडली के विशिष्ट संकेत:**
• आपकी कुंडली में **${ascHindi} लग्न** और **${moonHindi} चंद्र राशि** है, जो जातक को सहनशील, गंभीर और लक्ष्य के प्रति समर्पित बनाती है।
• वर्तमान समय में **${dashaHindi} की महादशा** का प्रभाव सक्रिय है, जो आपके जीवन में नए सुधार और सकारात्मक परिवर्तन की ओर संकेत कर रही है।
• किसी भी असमंजस की स्थिति में अधीर होने के बजाय योजनाबद्ध तरीके से कदम उठाएं। अगले 3 से 6 महीनों में आपको अपनी स्थिति में स्पष्ट उन्नति का अनुभव होगा।

🌿 **शुभ व कल्याणकारी वैदिक उपाय:**
${generalRemedyHi}
• किसी भी कठिन परिस्थिति में विचलित न हों; शुभ संकल्प और सात्विक कर्म ही भाग्य को सर्वश्रेष्ठ दिशा प्रदान करते हैं।`,
      suggestedQuestions: [
        'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा?',
        'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण',
        'मेरी कुंडली में नौकरी और प्रमोशन के क्या योग हैं?',
        'मेरे लिए सबसे भाग्यशाली रत्न कौन सा है?',
      ],
    };
  } else {
    return {
      reply: `🌟 **Vedic Astrological Guidance**
*(Ascendant: ${ascendant} | Ascendant Lord: ${lagnaLord} | Moon Sign: ${moonSign} | Active Dasha: ${currentDasha})*

Based on your verified birth chart and active planetary cycles, the overall astrological outlook is empowering and supportive.

🪐 **Core Chart Insights:**
• Your **${ascendant} Ascendant** and **${moonSign} Moon Sign** endow you with fortitude, thoughtful discernment, and deep dedication to your goals.
• You are experiencing the ongoing influence of the **${currentDasha} Mahadasha cycle**, bringing progressive clarity and valuable life lessons.
• The next 3 to 6 months bring increasing stability, emotional calm, and constructive forward momentum.

🌿 **Harmonizing Practices:**
• Offer morning water or recite the sacred Gayatri Mantra 11 times for clarity and peace.
• Seek elder blessings and maintain consistent daily disciplines.`,
      suggestedQuestions: [
        'How will my life unfold over the next 5 years?',
        'Deep Past, Present & Future Astrological Timeline Analysis',
        'What are my career and promotion prospects?',
        'Which gemstone suits my destiny best?',
      ],
    };
  }
}
