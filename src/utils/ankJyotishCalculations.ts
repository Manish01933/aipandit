// Comprehensive Vedic & Chaldean Numerology (Ank Jyotish) Calculation Engine

export interface ChaldeanLetterBreakdown {
  letter: string;
  chaldeanValue: number;
  pythagoreanValue: number;
  isVowel: boolean;
}

export interface CompoundNumberMeaning {
  compound: number;
  title: string;
  titleHindi: string;
  vibration: string;
  vibrationHindi: string;
  isKarmicOrMaster: boolean;
}

export interface CoreNumberProfile {
  number: number;
  title: string;
  titleHindi: string;
  planet: string;
  planetHindi: string;
  deity: string;
  deityHindi: string;
  element: string;
  elementHindi: string;
  summary: string;
  summaryHindi: string;
  nature: string;
  natureHindi: string;
  strengths: string[];
  strengthsHindi: string[];
  weaknesses: string[];
  weaknessesHindi: string[];
  luckyDays: string[];
  luckyDaysHindi: string[];
  luckyDates: number[];
  luckyColors: string[];
  luckyColorsHindi: string[];
  avoidColors: string[];
  avoidColorsHindi: string[];
  luckyGems: string[];
  luckyGemsHindi: string[];
  luckyRudraksha: string;
  luckyRudrakshaHindi: string;
  luckyMetal: string;
  luckyMetalHindi: string;
  auspiciousDirection: string;
  auspiciousDirectionHindi: string;
  beejMantra: string;
  beejMantraMeaning: string;
  beejMantraMeaningHindi: string;
  gayatriMantra: string;
  chantCount: number;
  daanItems: string[];
  daanItemsHindi: string[];
  fastingDay: string;
  fastingDayHindi: string;
  careerProspects: string[];
  careerProspectsHindi: string[];
  yantraGrid: number[][]; // 3x3 Magic Square Planetary Yantra
}

export interface CompatibilityItem {
  targetNumber: number;
  relationType: 'Friendly' | 'Neutral' | 'Challenging';
  relationTypeHindi: 'अति-मित्र (श्रेष्ठ)' | 'सम (सामान्य)' | 'शत्रु (सावधानी)';
  loveScore: number; // 0-100%
  businessScore: number; // 0-100%
  friendshipScore: number; // 0-100%
  advice: string;
  adviceHindi: string;
}

export interface PersonalYearPrediction {
  year: number;
  personalYearNumber: number;
  theme: string;
  themeHindi: string;
  overview: string;
  overviewHindi: string;
  careerFinance: string;
  careerFinanceHindi: string;
  relationships: string[];
  relationshipsHindi: string[];
  dos: string[];
  dosHindi: string[];
  donts: string[];
  dontsHindi: string[];
}

export interface AnkJyotishFullReport {
  inputName: string;
  inputDob: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  
  // Core 5 Numbers
  mulank: number; // Driver / Psychic (1-9)
  mulankCompound: number; // Birth Day (1-31)
  bhagyank: number; // Destiny / Conductor (1-9)
  bhagyankCompound: number; // Total Sum of DD+MM+YYYY
  namankChaldean: number; // Chaldean Name Number (1-9)
  namankChaldeanCompound: number; // Raw Chaldean Sum
  namankPythagorean: number; // Pythagorean Name Number (1-9)
  namankPythagoreanCompound: number;
  soulUrgeNumber: number; // Vowels sum (Atmakarak)
  personalityNumber: number; // Consonants sum (Vyaktitva)

  // Evaluation of Name Harmony with Mulank & Bhagyank
  nameHarmonyScore: number; // 0-100%
  nameHarmonyStatus: 'Highly Auspicious' | 'Favorable' | 'Neutral' | 'Inharmonious';
  nameHarmonyStatusHindi: 'अत्यंत शुभ एवं फलदायी' | 'अनुकूल' | 'सामान्य' | 'असंतुलित (सुधार योग्य)';
  nameCorrectionAdvice: string;
  nameCorrectionAdviceHindi: string;

  // Breakdown of Name
  lettersBreakdown: ChaldeanLetterBreakdown[];

  // Profiles
  mulankProfile: CoreNumberProfile;
  bhagyankProfile: CoreNumberProfile;
  namankProfile: CoreNumberProfile;

  // Personal Year (Current & Next)
  personalYearCurrent: PersonalYearPrediction;
  personalYearNext: PersonalYearPrediction;
  personalMonthNumber: number;
  personalDayNumber: number;

  // 4 Pinnacles & 4 Challenges
  pinnacles: { pinnacle: number; ageRange: string; ageRangeHindi: string; number: number; theme: string; themeHindi: string }[];
  challenges: { challenge: number; number: number; lesson: string; lessonHindi: string }[];

  // Compatibility with all 1-9 Numbers
  compatibilityList: CompatibilityItem[];

  // Vedic Compound Meanings
  mulankCompoundMeaning: CompoundNumberMeaning;
  namankCompoundMeaning: CompoundNumberMeaning;
}

// Chaldean letter values mapping (1-8, no 9 in Chaldean as 9 is sacred)
export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

// Pythagorean letter values mapping (1-9)
export const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Helper to reduce number to single digit (1-9)
export function reduceToSingleDigit(num: number): number {
  let val = Math.abs(num);
  while (val > 9) {
    let sum = 0;
    while (val > 0) {
      sum += val % 10;
      val = Math.floor(val / 10);
    }
    val = sum;
  }
  return val === 0 ? 9 : val;
}

// Sum of digits without loop overflow
export function sumDigits(num: number): number {
  return String(Math.abs(num))
    .split('')
    .reduce((acc, digit) => acc + (parseInt(digit, 10) || 0), 0);
}

// 9 Vedic Core Number Profiles with Authentic Yantras & Attributes
export const VEDIC_NUMBER_PROFILES: Record<number, CoreNumberProfile> = {
  1: {
    number: 1,
    title: 'Surya (The Sovereign Leader & Pioneer)',
    titleHindi: 'सूर्य (तेजस्वी नायक, नेतृत्व एवं आत्मबल)',
    planet: 'Sun (Surya Dev)',
    planetHindi: 'भगवान सूर्य (अग्नि तत्व)',
    deity: 'Lord Surya / Gayatri Mata',
    deityHindi: 'भगवान भुवन भास्कर / गायत्री माता',
    element: 'Fire',
    elementHindi: 'अग्नि तत्व (ऊर्जा व पराक्रम)',
    summary: 'Number 1 represents divine authority, pioneering leadership, independent ambition, and radiant vitality. Born with natural commanding magnetism.',
    summaryHindi: 'अंक 1 सूर्य का अंक है। यह दृढ़ आत्मबल, मौलिक विचार, नेतृत्व शक्ति, समाज में मान-सम्मान और उच्च प्रतिष्ठा प्रदान करता है।',
    nature: 'Dynamic, independent, visionary, highly self-reliant and authoritative.',
    natureHindi: 'स्वतंत्र विचार, आत्मविश्वासी, स्पष्टवादी, महत्वाकांक्षी और स्वाभाविक मार्गदर्शक।',
    strengths: ['Charismatic Leadership', 'Visionary Thinking', 'High Self-Respect', 'Unyielding Willpower', 'Inventive Spirit'],
    strengthsHindi: ['प्रभावशाली नेतृत्व', 'दृढ़ संकल्प व आत्मबल', 'स्वाभिमान व स्पष्टवादिता', 'रचनात्मक सोच', 'नवीन पहलों में अग्रणी'],
    weaknesses: ['Ego clashes & Pride', 'Impatience with slower peers', 'Authoritarian tendencies', 'Difficulty accepting criticism'],
    weaknessesHindi: ['अहंकार व क्रोध की संभावना', 'दूसरों के विचारों को सुनने में जल्दबाजी', 'आधिपत्य जमाने की प्रवृत्ति'],
    luckyDays: ['Sunday', 'Monday'],
    luckyDaysHindi: ['रविवार', 'सोमवार'],
    luckyDates: [1, 10, 19, 28],
    luckyColors: ['Gold', 'Crimson Red', 'Orange', 'Saffron'],
    luckyColorsHindi: ['सुनहरा', 'केसरिया', 'गाढ़ा लाल', 'नारंगी'],
    avoidColors: ['Black', 'Dark Navy Blue'],
    avoidColorsHindi: ['गहरा काला', 'गहरा नीला'],
    luckyGems: ['Ruby', 'Red Garnet'],
    luckyGemsHindi: ['माणिक्य (Ruby)', 'लाल गारनेट (Garnet)'],
    luckyRudraksha: '1 Mukhi or 12 Mukhi Rudraksha',
    luckyRudrakshaHindi: 'एक मुखी अथवा बारह मुखी रुद्राक्ष',
    luckyMetal: 'Gold / Copper',
    luckyMetalHindi: 'स्वर्ण (सोना) अथवा तांबा',
    auspiciousDirection: 'East',
    auspiciousDirectionHindi: 'पूर्व दिशा (East)',
    beejMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    beejMantraMeaning: 'Om Hraam Hreem Hroum Sah Suryaya Namaha',
    beejMantraMeaningHindi: 'भगवान सूर्य के इस बीज मंत्र का प्रतिदिन सूर्योदय के समय 108 बार जाप करें।',
    gayatriMantra: 'ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नः सूर्यः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Wheat', 'Copper Utensil', 'Red Cloth', 'Jaggery', 'Ruby / Saffron'],
    daanItemsHindi: ['गेहूं', 'तांबे का पात्र', 'लाल वस्त्र', 'गुड़', 'केसर'],
    fastingDay: 'Sunday (Salt-free diet)',
    fastingDayHindi: 'रविवार का व्रत',
    careerProspects: ['Government & Administrative Services (IAS/IPS)', 'Politics & Leadership', 'Entrepreneurship & CEO', 'Cardiology & Medicine', 'Jewelry & Gold Trade'],
    careerProspectsHindi: ['प्रशासनिक सेवाएं (UPSC/IAS)', 'राजनीति व उच्च नेतृत्व', 'स्वयं का व्यवसाय / डायरेक्टर', 'चिकित्सा (हृदय रोग)', 'स्वर्ण व आभूषण व्यापार'],
    yantraGrid: [
      [6, 1, 8],
      [7, 5, 3],
      [2, 9, 4],
    ], // Surya Yantra (Sum = 15)
  },
  2: {
    number: 2,
    title: 'Chandra (The Empathic Diplomat & Creator)',
    titleHindi: 'चन्द्र (संवेदनशील, कल्पनाशक्ति एवं सामंजस्य)',
    planet: 'Moon (Chandra Dev)',
    planetHindi: 'भगवान चन्द्र (जल तत्व)',
    deity: 'Lord Shiva / Parvati Devi',
    deityHindi: 'भगवान शिव एवं माता पार्वती',
    element: 'Water',
    elementHindi: 'जल तत्व (भावनाएं व कल्पनाशीलता)',
    summary: 'Number 2 reflects the soothing luminescence of the Moon. Highly intuitive, diplomatic, gentle, artistic, and endowed with profound emotional intelligence.',
    summaryHindi: 'अंक 2 चन्द्रमा का अंक है। यह मन की शांति, असीम कल्पनाशीलता, कलात्मक प्रतिभा, विनम्र स्वभाव और अद्भुत कूटनीतिक कुशलता देता है।',
    nature: 'Peace-loving, deeply empathetic, highly intuitive, imaginative, and cooperative.',
    natureHindi: 'शांतिप्रिय, अत्यंत संवेदनशील, मृदुभाषी, भावनात्मक और संबंधों को संजोने वाला।',
    strengths: ['Emotional Intuition', 'Diplomatic Peacemaking', 'Artistic & Poetic Creativity', 'Caring Nature', 'Adaptability'],
    strengthsHindi: ['तीव्र अंतर्ज्ञान (Intuition)', 'सुलह व कूटनीति', 'कला, संगीत व साहित्य में रुचि', 'सहानुभूतिपूर्ण दृष्टिकोण', 'सहयोग भावना'],
    weaknesses: ['Mood swings & hypersensitivity', 'Self-doubt & overthinking', 'Difficulty taking harsh decisions', 'Emotional dependency'],
    weaknessesHindi: ['मन की चंचलता व मूड स्विंग्स', 'अत्यधिक सोचना (Overthinking)', 'निर्णय लेने में अनिर्णय की स्थिति'],
    luckyDays: ['Monday', 'Friday', 'Sunday'],
    luckyDaysHindi: ['सोमवार', 'शुक्रवार', 'रविवार'],
    luckyDates: [2, 11, 20, 29],
    luckyColors: ['Pearl White', 'Cream', 'Silver', 'Sea Green'],
    luckyColorsHindi: ['मोती जैसा सफेद', 'क्रीम', 'चांदी जैसा चमकीला (Silver)', 'हल्का हरा'],
    avoidColors: ['Black', 'Dark Red'],
    avoidColorsHindi: ['गहरा काला', 'गहरा लाल'],
    luckyGems: ['Natural Pearl', 'Moonstone'],
    luckyGemsHindi: ['प्राकृतिक मोती (Pearl)', 'चंद्रकांत मणि (Moonstone)'],
    luckyRudraksha: '2 Mukhi Rudraksha (Do Mukhi)',
    luckyRudrakshaHindi: 'दो मुखी रुद्राक्ष (अर्धनारीश्वर स्वरूप)',
    luckyMetal: 'Silver',
    luckyMetalHindi: 'चांदी (Silver)',
    auspiciousDirection: 'North-West',
    auspiciousDirectionHindi: 'उत्तर-पश्चिम (वायव्य कोण)',
    beejMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः',
    beejMantraMeaning: 'Om Shraam Shreem Shroum Sah Chandramase Namaha',
    beejMantraMeaningHindi: 'चन्द्र देव के इस मंत्र का सायंकाल 108 बार जाप मानसिक शांति और स्थिरता प्रदान करता है।',
    gayatriMantra: 'ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Rice', 'Milk / Curd', 'Silver Coin', 'White Cloth', 'Sugar'],
    daanItemsHindi: ['चावल', 'दूध / दही / खीर', 'चांदी', 'श्वेत वस्त्र', 'मिश्री'],
    fastingDay: 'Monday (Offer milk to Shiva Lingam)',
    fastingDayHindi: 'सोमवार व्रत',
    careerProspects: ['Creative Writing & Poetry', 'Psychology & Counseling', 'Healthcare & Nursing', 'Hospitality & Culinary Arts', 'Dairy & Liquid Exports', 'Public Relations'],
    careerProspectsHindi: ['मनोविज्ञान व काउंसलिंग', 'कला, संगीत, अभिनय व साहित्य', 'चिकित्सा व नर्सिंग', 'हॉस्पिटैलिटी व फूड इंडस्ट्री', 'जल व तरल पदार्थों का व्यापार'],
    yantraGrid: [
      [7, 2, 9],
      [8, 6, 4],
      [3, 10, 5],
    ], // Chandra Yantra (Sum = 18)
  },
  3: {
    number: 3,
    title: 'Guru / Brihaspati (The Wise Guru & Counselor)',
    titleHindi: 'बृहस्पति (देवगुरु, ज्ञान, विवेक एवं विस्तार)',
    planet: 'Jupiter (Devguru Brihaspati)',
    planetHindi: 'देवगुरु बृहस्पति (आकाश तत्व)',
    deity: 'Lord Vishnu / Brihaspati',
    deityHindi: 'भगवान श्री हरि विष्णु / देवगुरु बृहस्पति',
    element: 'Ether / Fire',
    elementHindi: 'आकाश तत्व (ज्ञान, धर्म व समृद्धि)',
    summary: 'Number 3 embodies supreme wisdom, expansive optimism, ethical prosperity, and academic mastery. Natural counselors, teachers, and philosophers.',
    summaryHindi: 'अंक 3 देवगुरु बृहस्पति का अंक है। यह उच्च संस्कार, आध्यात्मिक ज्ञान, मार्गदर्शन क्षमता, समाज सुधार और बौद्धिक संपन्नता का प्रतीक है।',
    nature: 'Inspiring, ethical, generous, articulate, philosophical, and optimistic.',
    natureHindi: 'ज्ञानवान, न्यायप्रिय, उदार, उच्च आदर्शों वाला, प्रेरणादायी और सम्मानित व्यक्तित्व।',
    strengths: ['Expansive Intellect', 'Teaching & Mentorship', 'Optimistic Mindset', 'Integrity & Moral Standing', 'Oratory Eloquence'],
    strengthsHindi: ['अगाध ज्ञान व स्मरण शक्ति', 'उत्कृष्ट शिक्षण व परामर्श क्षमता', 'सकारात्मक दृष्टिकोण', 'धार्मिक व सदाचारी स्वभाव', 'प्रभावशाली वक्तृत्व'],
    weaknesses: ['Over-optimism', 'Preachy tendencies', 'Over-expansion of resources', 'Taking on too many responsibilities'],
    weaknessesHindi: ['अत्यधिक उपदेश देने की आदत', 'एक साथ कई कार्यों में उलझना', 'अति-उदारता के कारण आर्थिक व्यय'],
    luckyDays: ['Thursday', 'Tuesday'],
    luckyDaysHindi: ['गुरुवार (बृहस्पतिवार)', 'मंगलवार'],
    luckyDates: [3, 12, 21, 30],
    luckyColors: ['Bright Yellow', 'Golden Yellow', 'Saffron', 'Amber'],
    luckyColorsHindi: ['चमकीला पीला', 'केसरिया', 'सुनहरा', 'हल्दी जैसा पीला'],
    avoidColors: ['Dark Green', 'Charcoal Grey'],
    avoidColorsHindi: ['गहरा हरा', 'गहरा स्लेटी'],
    luckyGems: ['Yellow Sapphire', 'Yellow Topaz'],
    luckyGemsHindi: ['पुखराज (Yellow Sapphire)', 'सुनहला / पीला टोपाज'],
    luckyRudraksha: '5 Mukhi Rudraksha (Panch Mukhi)',
    luckyRudrakshaHindi: 'पांच मुखी रुद्राक्ष (पंच ब्रह्म स्वरूप)',
    luckyMetal: 'Gold / Brass',
    luckyMetalHindi: 'स्वर्ण (सोना) अथवा पीतल',
    auspiciousDirection: 'North-East',
    auspiciousDirectionHindi: 'उत्तर-पूर्व (ईशान कोण - सबसे पवित्र दिशा)',
    beejMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    beejMantraMeaning: 'Om Graam Greem Groum Sah Gurave Namaha',
    beejMantraMeaningHindi: 'गुरु बीज मंत्र का प्रतिदिन प्रातः 108 बार जाप विद्या, बुद्धि और ऐश्वर्य की वृद्धि करता है।',
    gayatriMantra: 'ॐ गुरुदेवाय विद्महे परब्रह्माय धीमहि तन्नो गुरुः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Chana Dal', 'Turmeric', 'Yellow Cloth', 'Besan Ladoo', 'Religious Books'],
    daanItemsHindi: ['चना दाल', 'साबुत हल्दी', 'पीले वस्त्र', 'बेसन के लड्डू', 'धार्मिक पुस्तकें'],
    fastingDay: 'Thursday (Worship banana tree, eat yellow food)',
    fastingDayHindi: 'गुरुवार का व्रत',
    careerProspects: ['Education, Universities & Professorship', 'Judiciary, Law & Legal Advisory', 'Banking & High Finance', 'Spiritual Ministry & Astrology', 'Publishing & Philosophy'],
    careerProspectsHindi: ['शिक्षा व प्रोफेसर', 'न्यायपालिका व कानून (Judge/Advocate)', 'बैंकिंग व वित्त प्रबंधन', 'आध्यात्मिक गुरु व ज्योतिषी', 'प्रकाशन व शोध कार्य'],
    yantraGrid: [
      [10, 5, 12],
      [11, 9, 7],
      [6, 13, 8],
    ], // Guru Yantra (Sum = 27)
  },
  4: {
    number: 4,
    title: 'Rahu (The Strategic Visionary & Master of Technology)',
    titleHindi: 'राहु (क्रांतिकारी सोच, रणनीति एवं तीव्र विश्लेषण)',
    planet: 'Rahu (Shadow Planet / North Node)',
    planetHindi: 'राहु ग्रह (वायु तत्व)',
    deity: 'Lord Bhairava / Goddess Saraswati',
    deityHindi: 'भगवान काल भैरव / माँ सरस्वती',
    element: 'Air / Earth',
    elementHindi: 'वायु तत्व (तार्किक गति व शोध)',
    summary: 'Number 4 confers unorthodox brilliance, sharp problem-solving instincts, revolutionary strategy, and technological mastery. Breaker of outdated conventions.',
    summaryHindi: 'अंक 4 राहु का अंक है। यह लीक से हटकर सोचने (Out-of-the-box), कठिन परिस्थितियों में तत्काल हल खोजने, तकनीकी महारत और आधुनिक अनुसंधान में सफलता देता है।',
    nature: 'Analytical, rebellious, disciplined worker, highly strategic, pragmatic, and unconventional.',
    natureHindi: 'व्यावहारिक, क्रांतिकारी सोच, स्पष्टवादी, तार्किक, शोधपरक और व्यवस्था में नवीनता लाने वाला।',
    strengths: ['Unorthodox Problem-Solving', 'Technical & Data Mastery', 'Unshakable Tenacity', 'Crisis Management', 'Systematic Execution'],
    strengthsHindi: ['जटिल समस्याओं का त्वरित समाधान', 'तकनीकी व डेटा विश्लेषण', 'कठिन परिश्रम की क्षमता', 'रणनीतिक दूरदर्शिता', 'संगठनात्मक कौशल'],
    weaknesses: ['Sudden unexpected obstacles', 'Extreme stubbornness', 'Misunderstood by society', 'Mental restlessness'],
    weaknessesHindi: ['अचानक उतार-चढ़ाव का सामना', 'हठी स्वभाव', 'मानसिक अशांति व भ्रम', 'गलतफहमियों का शिकार होना'],
    luckyDays: ['Sunday', 'Saturday', 'Monday'],
    luckyDaysHindi: ['रविवार', 'शनिवार', 'सोमवार'],
    luckyDates: [4, 13, 22, 31],
    luckyColors: ['Electric Blue', 'Smoky Grey', 'Khaki', 'Navy'],
    luckyColorsHindi: ['इलेक्ट्रिक ब्लू (Electric Blue)', 'स्लेटी (Grey)', 'खाकी', 'नीला'],
    avoidColors: ['Black', 'Bright Red'],
    avoidColorsHindi: ['गहरा काला', 'गहरा लाल'],
    luckyGems: ['Hessonite Garnet', 'Honey-colored Grossular'],
    luckyGemsHindi: ['गोमेद (Hessonite Garnet)', 'शहद जैसा गोमेद'],
    luckyRudraksha: '8 Mukhi Rudraksha (Ashta Mukhi)',
    luckyRudrakshaHindi: 'आठ मुखी रुद्राक्ष (श्री गणेश स्वरूप - विघ्नहर्ता)',
    luckyMetal: 'Alloy / Mixed Metals',
    luckyMetalHindi: 'अष्टधातु अथवा पंचधातु',
    auspiciousDirection: 'South-West',
    auspiciousDirectionHindi: 'दक्षिण-पश्चिम (नैऋत्य कोण)',
    beejMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    beejMantraMeaning: 'Om Bhraam Bhreem Bhroum Sah Rahave Namaha',
    beejMantraMeaningHindi: 'राहु के इस बीज मंत्र का संध्या समय 108 बार जाप अचानक आने वाली बाधाओं और भ्रम को दूर करता है।',
    gayatriMantra: 'ॐ नागाधिराजाय विद्महे चक्रधराय धीमहि तन्नो राहुः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Black Sesame Seeds', 'Blanket', 'Urad Dal', 'Seven Grains', 'Coconut in Flowing Water'],
    daanItemsHindi: ['काले तिल', 'कंबल (सफेद-काला)', 'उड़द दाल', 'सप्तधान्य', 'जटा वाला सूखा नारियल'],
    fastingDay: 'Saturday (Worship Bhairava or Saraswati)',
    fastingDayHindi: 'शनिवार',
    careerProspects: ['Software Architecture, AI & Cyber Security', 'Aviation, Space & Telecommunications', 'Data Science & Analytics', 'Stock Market Speculation', 'Investigative Journalism'],
    careerProspectsHindi: ['सॉफ्टवेयर व आर्टिफिशियल इंटेलिजेंस (AI)', 'डेटा साइंस व एनालिटिक्स', 'एविएशन, स्पेस व टेलीकॉम', 'शेयर मार्केट व रिसर्च', 'जांच एजेंसी व खोजी पत्रकारिता'],
    yantraGrid: [
      [13, 8, 15],
      [14, 12, 10],
      [9, 16, 11],
    ], // Rahu Yantra (Sum = 36)
  },
  5: {
    number: 5,
    title: 'Budha / Mercury (The Master Merchant, Communicator & Wit)',
    titleHindi: 'बुध (व्यापारिक चतुरता, वाकपटुता एवं त्वरित बुद्धि)',
    planet: 'Mercury (Budha Dev)',
    planetHindi: 'भगवान बुध (पृथ्वी/वायु तत्व)',
    deity: 'Lord Ganesha / Goddess Saraswati',
    deityHindi: 'भगवान श्री गणेश / माँ सरस्वती',
    element: 'Earth / Air',
    elementHindi: 'संतुलन तत्व (वाणिज्य, गणित व वाणी)',
    summary: 'Number 5 is the cosmic pivot of versatility, business acumen, witty communication, and rapid adaptability. The master trader and media communicator.',
    summaryHindi: 'अंक 5 बुध का अंक है। यह त्वरित निर्णय, व्यापारिक दूरदर्शिता, वाकपटुता, बहुमुखी प्रतिभा (Multi-tasking) और अद्भुत आकर्षण प्रदान करता है।',
    nature: 'Versatile, witty, extremely agile, commercially astute, and sociable.',
    natureHindi: 'हंसमुख, बहुमुखी प्रतिभा का धनी, तीव्र बुद्धि, वाक्पटु, मिलनसार और निरंतर परिवर्तनशील।',
    strengths: ['Commercial Genius', 'Magnetic Communication', 'Agile Adaptability', 'Quick Numerical Calculation', 'Networking Mastery'],
    strengthsHindi: ['व्यापारिक सूझबूझ व लाभ प्राप्ति', 'आकर्षक संवाद शैली', 'तीव्र स्मरण शक्ति व गणितीय क्षमता', 'सदा ऊर्जावान व युवा सोच', 'विशाल जनसंपर्क नेटवर्क'],
    weaknesses: ['Nervous restlessness', 'Boredom with routine', 'Scattered attention on multiple ventures', 'Impulsive risk taking'],
    weaknessesHindi: ['धैर्य की कमी व अति-उतावलापन', 'एक कार्य पूरा होने से पहले दूसरा शुरू करना', 'मानसिक तनाव'],
    luckyDays: ['Wednesday', 'Friday'],
    luckyDaysHindi: ['बुधवार', 'शुक्रवार'],
    luckyDates: [5, 14, 23],
    luckyColors: ['Emerald Green', 'Parrot Green', 'Turquoise', 'Mint'],
    luckyColorsHindi: ['पन्ना हरा (Emerald Green)', 'तोतिया हरा', 'हल्का फिरोजी'],
    avoidColors: ['Dark Red', 'Black'],
    avoidColorsHindi: ['गहरा लाल', 'काला'],
    luckyGems: ['Natural Emerald', 'Green Tourmaline', 'Peridot'],
    luckyGemsHindi: ['पन्ना (Emerald)', 'पेरिडॉट (Peridot)', 'हरा जेड (Green Jade)'],
    luckyRudraksha: '4 Mukhi or 10 Mukhi Rudraksha',
    luckyRudrakshaHindi: 'चार मुखी अथवा दस मुखी रुद्राक्ष',
    luckyMetal: 'Bronze / Gold',
    luckyMetalHindi: 'कांसा (Bronze) अथवा स्वर्ण',
    auspiciousDirection: 'North',
    auspiciousDirectionHindi: 'उत्तर दिशा (North - भगवान कुबेर का वास)',
    beejMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    beejMantraMeaning: 'Om Braam Breem Broum Sah Budhaya Namaha',
    beejMantraMeaningHindi: 'बुध बीज मंत्र का प्रातः 108 बार जाप व्यापारिक वृद्धि, वाणी में तेज और बुद्धि को प्रखर बनाता है।',
    gayatriMantra: 'ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो सौम्यः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Green Moong Dal', 'Green Fodder for Cows', 'Green Cloth', 'Bronze Item', 'Emerald'],
    daanItemsHindi: ['साबुत हरी मूंग', 'गाय को हरी घास / पालक', 'हरे वस्त्र', 'कांस्य पात्र'],
    fastingDay: 'Wednesday (Offer Durva grass and modak to Ganesha)',
    fastingDayHindi: 'बुधवार का व्रत',
    careerProspects: ['Trading, Stock Markets & Financial Broking', 'E-Commerce & Digital Marketing', 'Public Relations, Media & Journalism', 'Software Coding & IT Solutions', 'Consultancy & Public Speaking'],
    careerProspectsHindi: ['शेयर मार्केट, ट्रेडिंग व ब्रोकिंग', 'ई-कॉमर्स व डिजिटल मार्केटिंग', 'मीडिया, एंकरिंग व पत्रकारिता', 'चार्टर्ड अकाउंटेंसी (CA) व बैंकिंग', 'सलाहकार व पब्लिक रिलेशन'],
    yantraGrid: [
      [9, 4, 11],
      [10, 8, 6],
      [5, 12, 7],
    ], // Budha Yantra (Sum = 24)
  },
  6: {
    number: 6,
    title: 'Shukra / Venus (The Master of Aesthetics, Luxury & Magnetism)',
    titleHindi: 'शुक्र (सौंदर्य, कला, वैभव, प्रेम एवं भौतिक समृद्धि)',
    planet: 'Venus (Shukracharya)',
    planetHindi: 'भगवान शुक्र (जल/पृथ्वी तत्व)',
    deity: 'Goddess Lakshmi / Goddess Durga',
    deityHindi: 'माँ महालक्ष्मी / माता दुर्गा',
    element: 'Water / Earth',
    elementHindi: 'जल तत्व (आकर्षण, प्रेम व ऐश्वर्य)',
    summary: 'Number 6 radiates Venusian elegance, supreme aesthetic taste, personal charm, and material luxury. Endowed with magnetic social warmth and artistic brilliance.',
    summaryHindi: 'अंक 6 दैत्यगुरु शुक्राचार्य का अंक है। यह भौतिक सुख-साधन, विलासिता (Luxury), कला, संगीत, आकर्षण, मधुर संबंध और अटूट धन-संपत्ति प्रदान करता है।',
    nature: 'Charming, generous, artistically gifted, romantic, peace-loving, and appreciative of luxury.',
    natureHindi: 'आकर्षक व्यक्तित्व, सुरुचिपूर्ण, दयालु, कलाप्रेमी, मधुरभाषी और सुख-समृद्धि से युक्त।',
    strengths: ['Magnetic Charm & Social Grace', 'Refined Artistic Taste', 'Financial Magnetism', 'Harmonious Relationship Builder', 'Generous Hospitality'],
    strengthsHindi: ['सम्मोहक आकर्षण व मित्रता', 'उत्कृष्ट कला व डिजाइन बोध', 'धन व ऐश्वर्य को आकर्षित करने की क्षमता', 'सुखद पारिवारिक जीवन', 'उदारता व आतिथ्य सत्कार'],
    weaknesses: ['Over-indulgence in luxuries', 'Excessive spending on appearances', 'Vulnerability to flattery', 'Reluctance to face harsh conflicts'],
    weaknessesHindi: ['दिखावे व विलासिता पर अधिक खर्च', 'चापलूसी में आ जाना', 'आलस्य व आराम पसंद होना'],
    luckyDays: ['Friday', 'Wednesday'],
    luckyDaysHindi: ['शुक्रवार', 'बुधवार'],
    luckyDates: [6, 15, 24],
    luckyColors: ['Sparkling White', 'Pastel Pink', 'Cream', 'Sky Blue', 'Silver'],
    luckyColorsHindi: ['चमकीला सफेद', 'हल्का गुलाबी (Pink)', 'क्रीम', 'आसमानी नीला', 'सिल्वर'],
    avoidColors: ['Black', 'Coffee Brown'],
    avoidColorsHindi: ['गहरा काला', 'कत्थई भूरा'],
    luckyGems: ['Diamond', 'White Sapphire', 'Opal'],
    luckyGemsHindi: ['हीरा (Diamond)', 'ओपल (Opal)', 'श्वेत पुखराज / जरकन'],
    luckyRudraksha: '6 Mukhi Rudraksha (Kartikeya Swaroop)',
    luckyRudrakshaHindi: 'छह मुखी रुद्राक्ष (भगवान कार्तिकेय स्वरूप)',
    luckyMetal: 'Silver / Platinum / White Gold',
    luckyMetalHindi: 'चांदी (Silver) अथवा प्लेटिनम',
    auspiciousDirection: 'South-East',
    auspiciousDirectionHindi: 'दक्षिण-पूर्व (आग्नेय कोण)',
    beejMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    beejMantraMeaning: 'Om Draam Dreem Droum Sah Shukraya Namaha',
    beejMantraMeaningHindi: 'शुक्र बीज मंत्र का सायंकाल 108 बार जाप सौंदर्य, ऐश्वर्य, दांपत्य सुख और आकर्षण में अपार वृद्धि करता है।',
    gayatriMantra: 'ॐ भृगुपुत्राय विद्महे दिव्यदेहाय धीमहि तन्नो शुक्रः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Sugar / Mishri', 'White Clothes', 'Perfume / Scent', 'Curd & Kheer', 'Pure Cow Ghee'],
    daanItemsHindi: ['मिश्री', 'सफेद रेशमी वस्त्र', 'सुगंधित इत्र (Perfume)', 'खीर / दही', 'शुद्ध देसी घी'],
    fastingDay: 'Friday (Worship Goddess Lakshmi, offer kheer)',
    fastingDayHindi: 'शुक्रवार का व्रत',
    careerProspects: ['Fashion Design, Modeling & Glamour', 'Film, Acting, Music & Entertainment', 'Luxury Real Estate & Interior Decor', 'Cosmetics, Perfumes & Jewelry', 'Hospitality & Fine Dining'],
    careerProspectsHindi: ['फैशन डिजाइनिंग व मॉडलिंग', 'फिल्म, संगीत व अभिनय', 'इंटीरियर डिजाइनिंग व लक्जरी आर्किटेक्चर', 'सौंदर्य प्रसाधन, इत्र व आभूषण', 'होटल मैनेजमेंट व ब्रांडिंग'],
    yantraGrid: [
      [11, 6, 13],
      [12, 10, 8],
      [7, 14, 9],
    ], // Shukra Yantra (Sum = 30)
  },
  7: {
    number: 7,
    title: 'Ketu (The Mystic Philosopher, Researcher & Healer)',
    titleHindi: 'केतु (आध्यात्मिक जागृति, शोध, गुप्त ज्ञान एवं अंतर्दृष्टि)',
    planet: 'Ketu (Shadow Planet / South Node)',
    planetHindi: 'भगवान केतु (जल/अग्नि तत्व)',
    deity: 'Lord Ganesha / Lord Matsya Avatara',
    deityHindi: 'भगवान श्री गणेश / मत्स्य अवतार',
    element: 'Water / Ether',
    elementHindi: 'गुप्त ज्ञान तत्व (आत्मबोध व शोध)',
    summary: 'Number 7 is deeply metaphysical, endowed with piercing research intuition, occult wisdom, independent soul vibration, and spiritual enlightenment.',
    summaryHindi: 'अंक 7 केतु का अंक है। यह गहन अंतर्दृष्टि, वैज्ञानिक शोध, गुप्त विधाओं (ज्योतिष/तंत्र), आध्यात्मिक वैराग्य और सत्य की खोज की असीम शक्ति प्रदान करता है।',
    nature: 'Mystical, contemplative, philosophical, highly intuitive, independent, and detached from superficiality.',
    natureHindi: 'गंभीर, शोधपरक, एकांतप्रिय, गूढ़ ज्ञान में रुचि रखने वाला और असाधारण अंतर्ज्ञानी।',
    strengths: ['Profound Intuition & Sixth Sense', 'Deep Research Capability', 'Spiritual Wisdom', 'Analytical Originality', 'Healing Presence'],
    strengthsHindi: ['तीव्र छठी इंद्री (Sixth Sense)', 'गहन अनुसंधान व विश्लेषण शक्ति', 'आध्यात्मिक ऊंचाई व निष्पक्ष दृष्टि', 'सत्य को भांपने की कला', 'दार्शनिक गहराई'],
    weaknesses: ['Aloofness & social detachment', 'Cynicism or skepticism', 'Tendency towards escapism', 'Difficulty expressing feelings verbally'],
    weaknessesHindi: ['एकाकीपन व समाज से दूरी', 'मन में वैराग्य या निराशा का भाव', 'अपनी भावनाएं व्यक्त न कर पाना'],
    luckyDays: ['Monday', 'Thursday', 'Sunday'],
    luckyDaysHindi: ['सोमवार', 'गुरुवार', 'रविवार'],
    luckyDates: [7, 16, 25],
    luckyColors: ['Smoky White', 'Light Green', 'Lavender', 'Sea Green', 'Pale Yellow'],
    luckyColorsHindi: ['हल्का हरा', 'धूमिल सफेद', 'लैवेंडर', 'हल्का पीला'],
    avoidColors: ['Dark Red', 'Jet Black'],
    avoidColorsHindi: ['गहरा लाल', 'गहरा काला'],
    luckyGems: ["Cat's Eye", 'Chrysoberyl'],
    luckyGemsHindi: ["लहसुनिया (Cat's Eye)", 'क्राइसोबेरिल'],
    luckyRudraksha: '9 Mukhi Rudraksha (Nau Mukhi - Maa Durga Swaroop)',
    luckyRudrakshaHindi: 'नौ मुखी रुद्राक्ष (माँ दुर्गा स्वरूप)',
    luckyMetal: 'Mixed Metal / Silver',
    luckyMetalHindi: 'चांदी अथवा अष्टधातु',
    auspiciousDirection: 'North-East / South-West',
    auspiciousDirectionHindi: 'उत्तर-पूर्व अथवा नैऋत्य',
    beejMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    beejMantraMeaning: 'Om Sraam Sreem Sroum Sah Ketave Namaha',
    beejMantraMeaningHindi: 'केतु बीज मंत्र का रात्रि के समय 108 बार जाप मानसिक भ्रम दूर कर आध्यात्मिक जागृति व ज्ञान प्रदान करता है।',
    gayatriMantra: 'ॐ चित्रवर्णाय विद्महे सर्परूपाय धीमहि तन्नो केतुः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Seven Types of Grains', 'Black & White Blanket', 'Sesame Seeds', 'Temple Flag', 'Feeding Stray Dogs'],
    daanItemsHindi: ['सप्तधान्य', 'दो-रंगी कंबल (चितकबरा)', 'तिल', 'मंदिर में पताका (झंडा)', 'काले-सफेद श्वान (कुत्ते) को भोजन'],
    fastingDay: 'Tuesday / Thursday (Worship Lord Ganesha)',
    fastingDayHindi: 'मंगलवार / गुरुवार (गणेश जी की पूजा)',
    careerProspects: ['Scientific Research & Innovation', 'Occult Sciences, Astrology & Tarot', 'Psychiatry & Deep Therapy', 'Cyber Security & Forensic Investigation', 'Spiritual Literature & Philosophy'],
    careerProspectsHindi: ['वैज्ञानिक शोध व अनुसंधान', 'ज्योतिष, तंत्र व गूढ़ विद्याएं', 'मनोचिकित्सा व थेरेपी', 'फॉरेंसिक साइंस व साइबर सिक्योरिटी', 'दर्शनशास्त्र व उच्च लेखन'],
    yantraGrid: [
      [14, 9, 16],
      [15, 13, 11],
      [10, 17, 12],
    ], // Ketu Yantra (Sum = 39)
  },
  8: {
    number: 8,
    title: 'Shani / Saturn (The Karmic Judge, Master of Resilience & Legacy)',
    titleHindi: 'शनि (कर्मफलदाता, धैर्य, न्याय, निष्ठा एवं अकूत स्थायित्व)',
    planet: 'Saturn (Shani Dev)',
    planetHindi: 'भगवान शनि (वायु/पृथ्वी तत्व)',
    deity: 'Lord Shani Dev / Lord Shiva / Hanuman Ji',
    deityHindi: 'भगवान शनिदेव / श्री हनुमान जी',
    element: 'Air / Earth',
    elementHindi: 'कर्म व न्याय तत्व (धैर्य व निष्ठा)',
    summary: 'Number 8 represents the highest discipline, karmic justice, immense endurance, practical mastery, and durable legacy. The master of long-term empire building.',
    summaryHindi: 'अंक 8 कर्मफलदाता शनि का अंक है। यह कठिन परिश्रम, अनुशासन, न्यायप्रियता, असीम धैर्य और जीवन में स्थाई व विशाल साम्राज्य स्थापित करने की शक्ति देता है।',
    nature: 'Disciplined, persevering, serious, profoundly just, resilient, and focused on lasting results.',
    natureHindi: 'परिश्रमी, धैर्यवान, न्यायप्रिय, दूरदर्शी, गंभीर और ठोस परिणाम देने वाला व्यक्तित्व।',
    strengths: ['Unbeatable Resilience & Grit', 'High Organizational Capability', 'Fair & Unbiased Justice', 'Mass Appeal & Grounded Leadership', 'Long-term Wealth Building'],
    strengthsHindi: ['अद्भुत सहनशक्ति व संघर्ष क्षमता', 'उत्कृष्ट संगठन व प्रबंधन कला', 'सत्य व न्याय का पक्षधर', 'दीर्घकालिक संपत्ति निर्माण', 'जनसाधारण में गहरा प्रभाव'],
    weaknesses: ['Slow initial progress / delays', 'Tendency toward pessimism or loneliness', 'Harsh self-criticism', 'Overworking without rest'],
    weaknessesHindi: ['प्रारंभिक जीवन में विलंब व संघर्ष', 'अति-गंभीरता व निराशा का भाव', 'काम के दबाव में स्वास्थ्य की अनदेखी'],
    luckyDays: ['Saturday', 'Wednesday', 'Friday'],
    luckyDaysHindi: ['शनिवार', 'बुधवार', 'शुक्रवार'],
    luckyDates: [8, 17, 26],
    luckyColors: ['Dark Navy Blue', 'Royal Blue', 'Black', 'Charcoal Grey'],
    luckyColorsHindi: ['गहरा नीला (Navy Blue)', 'रॉयल ब्लू', 'काला', 'स्लेटी (Charcoal)'],
    avoidColors: ['Bright Red', 'Sun Yellow'],
    avoidColorsHindi: ['चमकीला लाल', 'केसरिया पीला'],
    luckyGems: ['Blue Sapphire', 'Amethyst', 'Lapis Lazuli'],
    luckyGemsHindi: ['नीलम (Blue Sapphire)', 'जामुनिया (Amethyst)', 'लाजवर्त (Lapis Lazuli)'],
    luckyRudraksha: '7 Mukhi or 14 Mukhi Rudraksha',
    luckyRudrakshaHindi: 'सात मुखी रुद्राक्ष (माँ महालक्ष्मी व शनि कृपा स्वरूप)',
    luckyMetal: 'Iron / Steel / Lead',
    luckyMetalHindi: 'लोहा (Iron) अथवा पंचधातु',
    auspiciousDirection: 'West',
    auspiciousDirectionHindi: 'पश्चिम दिशा (West)',
    beejMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    beejMantraMeaning: 'Om Praam Preem Proum Sah Shanaishcharaya Namaha',
    beejMantraMeaningHindi: 'शनि बीज मंत्र का सूर्यास्त के बाद पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाकर 108 बार जाप करें।',
    gayatriMantra: 'ॐ काकध्वजाय विद्महे खड्गहस्ताय धीमहि तन्नो मन्दः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Mustard Oil', 'Iron Pan / Tongs', 'Black Sesame Seeds', 'Black Umbrella / Shoes', 'Feeding Laborers'],
    daanItemsHindi: ['सरसों का तेल (छाया दान)', 'लोहे का पात्र / तवा', 'काले तिल व उड़द', 'काले जूते / छाता', 'श्रमिकों व जरूरतमंदों की सेवा'],
    fastingDay: 'Saturday (Chant Hanuman Chalisa / Sundarkand)',
    fastingDayHindi: 'शनिवार का व्रत',
    careerProspects: ['Heavy Industries, Manufacturing & Mining', 'Law, Judiciary & Human Rights', 'Real Estate Development & Civil Engineering', 'Logistics, Transport & Supply Chain', 'Public Administration & Politics'],
    careerProspectsHindi: ['भारी उद्योग, खनन व लोहा-इस्पात', 'न्यायपालिका व कानून (Judge/Lawyer)', 'रियल एस्टेट व सिविल इंजीनियरिंग', 'ट्रांसपोर्ट, लॉजिस्टिक्स व इन्फ्रास्ट्रक्चर', 'प्रशासन व जनसेवा'],
    yantraGrid: [
      [12, 7, 14],
      [13, 11, 9],
      [8, 15, 10],
    ], // Shani Yantra (Sum = 33)
  },
  9: {
    number: 9,
    title: 'Mangal / Mars (The Commander-in-Chief, Champion & Protector)',
    titleHindi: 'मंगल (सेनापति, अदम्य साहस, ऊर्जा, शौर्य एवं परोपकार)',
    planet: 'Mars (Mangal Dev / Angaraka)',
    planetHindi: 'भगवान मंगल (अग्नि तत्व)',
    deity: 'Lord Hanuman / Lord Kartikeya (Murugan)',
    deityHindi: 'भगवान श्री हनुमान जी / भगवान कार्तिकेय',
    element: 'Fire',
    elementHindi: 'अग्नि तत्व (ऊर्जा, रक्त व पराक्रम)',
    summary: 'Number 9 represents the pinnacle single-digit powerhouse: unyielding courage, champion vitality, high humanitarian ideals, and martial protection.',
    summaryHindi: 'अंक 9 मंगल का अंक है। यह अदम्य पराक्रम, उच्च ऊर्जा, निर्भीकता, नेतृत्व, रक्षक भावना, खेलकूद, तकनीकी कुशलता और परोपकार की सर्वोच्च शक्ति प्रदान करता है।',
    nature: 'Courageous, fiery, protective, straightforward, humanitarian, and highly energetic.',
    natureHindi: 'साहसी, ऊर्जावान, स्पष्टवादी, अन्याय के विरुद्ध लड़ने वाला, उदार और परोपकारी।',
    strengths: ['Fearless Bravery & Drive', 'High Physical & Mental Stamina', 'Protective Humanitarian Spirit', 'Quick Crisis Action', 'Dynamic Leadership'],
    strengthsHindi: ['अटूट साहस व निर्भीकता', 'असीम शारीरिक व मानसिक ऊर्जा', 'कमजोरों की रक्षा व परोपकार', 'तत्काल निर्णय व क्रियान्वयन', 'प्रभावी संगठन क्षमता'],
    weaknesses: ['Fiery quick temper & impatience', 'Impulsive aggression', 'Prone to burn-out from over-activity', 'Stubborn confrontations'],
    weaknessesHindi: ['शीघ्र क्रोध आना व अधीरता', 'उतावलेपन में जोखिम लेना', 'वाद-विवाद में उग्र होना'],
    luckyDays: ['Tuesday', 'Thursday', 'Sunday'],
    luckyDaysHindi: ['मंगलवार', 'गुरुवार', 'रविवार'],
    luckyDates: [9, 18, 27],
    luckyColors: ['Crimson Red', 'Scarlet', 'Maroon', 'Deep Coral'],
    luckyColorsHindi: ['लाल (Red)', 'सिंदूरी', 'मैरून (Maroon)', 'मूंगा जैसा लाल'],
    avoidColors: ['Black', 'Dark Green'],
    avoidColorsHindi: ['काला', 'गहरा हरा'],
    luckyGems: ['Red Coral', 'Carnelian'],
    luckyGemsHindi: ['लाल मूंगा (Red Coral)', 'कार्नेलियन'],
    luckyRudraksha: '3 Mukhi Rudraksha (Teen Mukhi - Agni Swaroop)',
    luckyRudrakshaHindi: 'तीन मुखी रुद्राक्ष (अग्नि देव स्वरूप)',
    luckyMetal: 'Copper / Gold',
    luckyMetalHindi: 'तांबा (Copper) अथवा स्वर्ण',
    auspiciousDirection: 'South',
    auspiciousDirectionHindi: 'दक्षिण दिशा (South)',
    beejMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    beejMantraMeaning: 'Om Kraam Kreem Kroum Sah Bhaumaya Namaha',
    beejMantraMeaningHindi: 'मंगल बीज मंत्र का प्रातः 108 बार जाप रक्त शुद्धि, साहस में वृद्धि और भूमि-भवन के लाभ देता है।',
    gayatriMantra: 'ॐ अंगारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात्॥',
    chantCount: 108,
    daanItems: ['Red Lentils', 'Jaggery', 'Red Cloth', 'Copper Vessel', 'Prasad for Hanuman Ji'],
    daanItemsHindi: ['लाल मसूर दाल', 'गुड़ व चना', 'लाल वस्त्र', 'तांबे का बर्तन', 'हनुमान जी को सिंदूर व चोला'],
    fastingDay: 'Tuesday (Fast for Hanuman Ji, avoid salt)',
    fastingDayHindi: 'मंगलवार का व्रत',
    careerProspects: ['Defense, Military, Police & Armed Forces', 'Surgery, Medicine & Emergency Healthcare', 'Civil & Mechanical Engineering', 'Athletics, Sports & Martial Arts', 'Real Estate, Construction & Mining'],
    careerProspectsHindi: ['सेना, पुलिस व सुरक्षा बल (Defense/IPS)', 'शल्य चिकित्सा (Surgeon) व आपातकालीन सेवा', 'मैकेनिकल व सिविल इंजीनियरिंग', 'खेलकूद व एथलेटिक्स', 'रियल एस्टेट, कंस्ट्रक्शन व ठेकेदारी'],
    yantraGrid: [
      [8, 3, 10],
      [9, 7, 5],
      [4, 11, 6],
    ], // Mangal Yantra (Sum = 21)
  },
};

// Compound Numbers Meanings (10 to 31 & Key Master/Karmic Numbers)
export const COMPOUND_MEANINGS: Record<number, CompoundNumberMeaning> = {
  1: { compound: 1, title: 'The Solitary Sun', titleHindi: 'एकल सूर्य', vibration: 'Pure individuality, leadership and direct initiative.', vibrationHindi: 'मौलिक नेतृत्व व आत्मनिर्भरता।', isKarmicOrMaster: false },
  2: { compound: 2, title: 'The Crescent Moon', titleHindi: 'द्वितीया चन्द्र', vibration: 'Deep empathy, sensitivity and cooperative harmony.', vibrationHindi: 'संवेदनशीलता व सहयोग भावना।', isKarmicOrMaster: false },
  3: { compound: 3, title: 'The Holy Trinity', titleHindi: 'त्रिमूर्ति गुरु', vibration: 'Intellectual brilliance, creativity and optimistic expansion.', vibrationHindi: 'बुद्धि, ज्ञान व सृजनात्मकता।', isKarmicOrMaster: false },
  4: { compound: 4, title: 'The Solid Pillar', titleHindi: 'चतुर्भुज राहु', vibration: 'Practical structure, discipline and methodical execution.', vibrationHindi: 'व्यावहारिकता व दृढ़ता।', isKarmicOrMaster: false },
  5: { compound: 5, title: 'The Mercurial Spark', titleHindi: 'पंचतत्व बुध', vibration: 'Dynamic flexibility, commercial wit and versatile agility.', vibrationHindi: 'व्यापारिक सूझबूझ व वाक्पटुता।', isKarmicOrMaster: false },
  6: { compound: 6, title: 'The Hexagram of Venus', titleHindi: 'षट्कोण शुक्र', vibration: 'Loving magnetism, artistic harmony and family blessing.', vibrationHindi: 'पारिवारिक सुख व आकर्षण।', isKarmicOrMaster: false },
  7: { compound: 7, title: 'The Mystical Septet', titleHindi: 'सप्तऋषि केतु', vibration: 'Occult wisdom, research depth and soul contemplation.', vibrationHindi: 'गहन चिंतन व शोध प्रतिभा।', isKarmicOrMaster: false },
  8: { compound: 8, title: 'The Infinity of Saturn', titleHindi: 'अष्टलक्ष्मी शनि', vibration: 'Endurance, karmic justice and massive material empire.', vibrationHindi: 'धैर्य, कर्म व विशाल सफलता।', isKarmicOrMaster: false },
  9: { compound: 9, title: 'The Complete Ennead', titleHindi: 'नवग्रह मंगल', vibration: 'Universal compassion, warrior courage and high ideals.', vibrationHindi: 'साहस, ऊर्जा व परोपकार।', isKarmicOrMaster: false },
  10: { compound: 10, title: 'The Wheel of Fortune (भाग्य चक्र)', titleHindi: 'भाग्य का पहिया (Wheel of Fortune)', vibration: 'Rise to great honor, total victory over opposition, and lasting self-earned prosperity.', vibrationHindi: 'अभूतपूर्व उन्नति, विरोधियों पर विजय और जीवन में निरंतर उत्थान।', isKarmicOrMaster: false },
  11: { compound: 11, title: 'The Master Intuitive (मास्टर अंक 11)', titleHindi: 'दिव्य अंतर्ज्ञान (Master Number 11)', vibration: 'High spiritual intuition, prophetic dreams, and intense visionary magnetism.', vibrationHindi: 'दिव्य अंतर्ज्ञान, आध्यात्मिक शक्ति और दूरदर्शिता।', isKarmicOrMaster: true },
  12: { compound: 12, title: 'The Sacrifice & Self-Surrender', titleHindi: 'त्याग एवं बौद्धिक ज्ञान', vibration: 'Great intellectual depth, but requires emotional boundary setting to avoid exploitation.', vibrationHindi: 'उच्च बौद्धिक क्षमता, लेकिन दूसरों पर अति-विश्वास से बचना आवश्यक।', isKarmicOrMaster: false },
  13: { compound: 13, title: 'The Phoenix Transformation (पुनर्जन्म)', titleHindi: 'कायाकल्प व रूपांतरण (Karmic 13)', vibration: 'Karmic rebirth through discipline, breakthrough success after clearing initial hurdles.', vibrationHindi: 'कठिन परिश्रम द्वारा पुरानी सीमाओं को तोड़कर नई ऊंचाइयों को छूना।', isKarmicOrMaster: true },
  14: { compound: 14, title: 'The Magnetic Merchant (व्यापारिक आकर्षण)', titleHindi: 'व्यापारिक गतिशीलता व विवेक (Karmic 14)', vibration: 'High commercial momentum, travel, and financial gains when maintaining temperance.', vibrationHindi: 'अत्यधिक व्यावसायिक गति व लाभ, संयम रखने पर बड़ी सफलता।', isKarmicOrMaster: true },
  15: { compound: 15, title: 'The Magician of Venus (जादुई सम्मोहन)', titleHindi: 'सम्मोहन एवं अपार लक्ष्मी कृपा', vibration: 'Exceptional artistic charm, eloquence, lucrative wealth, and social magnetism.', vibrationHindi: 'अद्भुत आकर्षण, कला में प्रवीणता और प्रचुर धन-संपदा की प्राप्ति।', isKarmicOrMaster: false },
  16: { compound: 16, title: 'The Tower of Truth (सत्य की खोज)', titleHindi: 'कठिन परीक्षा व आत्मबोध (Karmic 16)', vibration: 'Warning against egoistic pride. True humility unlocks spiritual wisdom and durable triumph.', vibrationHindi: 'अहंकार का त्याग कर सत्य व अध्यात्म से जुड़ने पर अजेय विजय।', isKarmicOrMaster: true },
  17: { compound: 17, title: 'The Crown of the Magi (अमृत सितारा)', titleHindi: 'अमृत सितारा (The Star of the Magi)', vibration: 'Immense public fame, universal victory, divine protection, and enduring legacy.', vibrationHindi: 'समाज में सर्वोच्च ख्याति, हर क्षेत्र में विजय और ईश्वरीय संरक्षण।', isKarmicOrMaster: false },
  18: { compound: 18, title: 'The Spiritual Warrior (आंतरिक द्वंद्व व विजय)', titleHindi: 'सचेत कर्मठता व विजय', vibration: 'Warning against treacherous associates. Fierce determination conquers all adversaries.', vibrationHindi: 'गुप्त शत्रुओं से सतर्क रहकर अपने बाहुबल से विजय प्राप्त करना।', isKarmicOrMaster: false },
  19: { compound: 19, title: 'The Prince of Heaven (स्वर्ग का राजकुमार)', titleHindi: 'अखंड विजय व सौभाग्य (The Prince of Heaven)', vibration: 'One of the most auspicious vibrations in existence: supreme honor, happiness, and all-around triumph.', vibrationHindi: 'अंक ज्योतिष का सबसे शुभ अंक: अखंड मान-सम्मान, समृद्धि और विजय।', isKarmicOrMaster: false },
  20: { compound: 20, title: 'The Awakening (पुनर्जागरण)', titleHindi: 'आध्यात्मिक जागृति व नवीन प्रेरणा', vibration: 'Higher spiritual calling, delayed plans suddenly reviving into immense fruitful momentum.', vibrationHindi: 'आंतरिक जागृति, नई योजनाओं का उदय और उच्च उद्देश्यों की पूर्ति।', isKarmicOrMaster: false },
  21: { compound: 21, title: 'The Crown of Universal Success (संसार का मुकुट)', titleHindi: 'विश्व विजय व सर्वसिद्धि', vibration: 'Total advancement, global recognition, final fulfillment after patient perseverance.', vibrationHindi: 'सर्वकार्य सिद्धि, दीर्घकालिक परिश्रम का भव्य प्रतिफल और प्रसिद्धि।', isKarmicOrMaster: false },
  22: { compound: 22, title: 'The Master Builder (मास्टर निर्माता 22)', titleHindi: 'मास्टर निर्माता (Master Number 22)', vibration: 'Supreme ability to manifest grand dreams into physical reality on an international scale.', vibrationHindi: 'असंभव को संभव बनाने और विशाल उपक्रमों के निर्माण की दैवीय शक्ति।', isKarmicOrMaster: true },
  23: { compound: 23, title: 'The Royal Star of the Lion (सिंह का राज सितारा)', titleHindi: 'सिंह राज सितारा (अपार भाग्य)', vibration: 'Tremendous divine protection, effortless assistance from high authorities, and perpetual success.', vibrationHindi: 'उच्च अधिकारियों का सहज सहयोग, अपार यश और निरंतर सफलता।', isKarmicOrMaster: false },
  24: { compound: 24, title: 'The Harmonious Abundance (सर्वप्रिय लक्ष्मी)', titleHindi: 'सर्वप्रिय लक्ष्मी व पारिवारिक आनंद', vibration: 'Gains through diplomacy, influential patronage, marital harmony, and sustained financial abundance.', vibrationHindi: 'मित्रों व वरिष्ठों से लाभ, मधुर दांपत्य और निरंतर धन प्रवाह।', isKarmicOrMaster: false },
  25: { compound: 25, title: 'The Mystic Scholar (गूढ़ अन्वेषक)', titleHindi: 'अनुभव से ज्ञान व सिद्धि', vibration: 'Wisdom gained through deep life observations, immense academic and occult victory in later years.', vibrationHindi: 'जीवन के अनुभवों से परिपक्वता और शोध व बौद्धिक कार्यों में भारी सफलता।', isKarmicOrMaster: false },
  26: { compound: 26, title: 'The Pillar of Enterprise (व्यापारिक साम्राज्य)', titleHindi: 'धैर्य व व्यावसायिक साम्राज्य', vibration: 'Great material enterprise, requiring mindful partner selection and prudent long-term investments.', vibrationHindi: 'व्यापार में बड़ा मुकाम, साझेदारों के चयन में सावधानी से भारी लाभ।', isKarmicOrMaster: false },
  27: { compound: 27, title: 'The Sceptre of Command (राजदण्ड व सेनापति)', titleHindi: 'राजदण्ड व सर्वोच्च पराक्रम', vibration: 'Commanding authority, independent executive prowess, and supreme success in public governance.', vibrationHindi: 'उच्च प्रशासनिक शक्ति, स्वतंत्र निर्णय क्षमता और लोक सम्मान।', isKarmicOrMaster: false },
  28: { compound: 28, title: 'The Trusting Pioneer (विश्वास व सावधानी)', titleHindi: 'नवीन पहल व सतर्कता', vibration: 'High innovative potential; advises keeping financial reserves secure and avoiding blind partnerships.', vibrationHindi: 'नवीन कार्य आरंभ करने की क्षमता, वित्तीय मामलों में सतर्कता हितकर।', isKarmicOrMaster: false },
  29: { compound: 29, title: 'The Grace Under Fire (परीक्षण व विजय)', titleHindi: 'कठिनाइयों में धैर्य व सिद्धि', vibration: 'Spiritual trials leading to profound internal mastery and extraordinary resilience.', vibrationHindi: 'चुनौतियों का सामना कर आध्यात्मिक व मानसिक रूप से अजेय बनना।', isKarmicOrMaster: false },
  30: { compound: 30, title: 'The Intellectual Ruler (बौद्धिक विस्तार)', titleHindi: 'बौद्धिक विस्तार व श्रेष्ठता', vibration: 'Mental superiority, philosophical leadership, writing/speaking prowess, and social influence.', vibrationHindi: 'विशाल ज्ञान, लेखन व वक्तृत्व कला और समाज पर गहरा प्रभाव।', isKarmicOrMaster: false },
  31: { compound: 31, title: 'The Thoughtful Recluse (गहन विचारक)', titleHindi: 'चिंतनशील दूरदर्शी', vibration: 'Deep independent thinking, modern technological breakthroughs, and self-contained success.', vibrationHindi: 'गंभीर एकांत चिंतन, तकनीकी नवाचार और स्वावलंबी प्रगति।', isKarmicOrMaster: false },
};

// Calculate Vedic Compatibility between a user's Mulank & all 1-9 numbers
export function calculateVedicCompatibility(userMulank: number): CompatibilityItem[] {
  const COMPATIBILITY_RULES: Record<
    number,
    Record<number, { relation: 'Friendly' | 'Neutral' | 'Challenging'; love: number; business: number; friendship: number; adviceEn: string; adviceHi: string }>
  > = {
    1: {
      1: { relation: 'Friendly', love: 85, business: 90, friendship: 88, adviceEn: 'Dynamic power duo; share leadership to avoid ego friction.', adviceHi: 'दोनों में नेतृत्व गुण है, अहंकार से बचकर चलें तो बड़ी सफलता मिलेगी।' },
      2: { relation: 'Friendly', love: 92, business: 85, friendship: 90, adviceEn: 'Sun and Moon harmony: perfect complementary balance.', adviceHi: 'सूर्य और चन्द्रमा का उत्तम संगम; अत्यंत सुखद व सहयोगी संबंध।' },
      3: { relation: 'Friendly', love: 90, business: 95, friendship: 92, adviceEn: 'Sun and Jupiter: glorious growth, moral respect, and prosperity.', adviceHi: 'सूर्य और गुरु की युति; मान-सम्मान व व्यापार में अपार वृद्धि।' },
      4: { relation: 'Neutral', love: 75, business: 80, friendship: 78, adviceEn: 'Unconventional match; 4 provides strategy to 1’s vision.', adviceHi: 'राहु और सूर्य; रणनीतिक तालमेल, परस्पर सम्मान जरूरी।' },
      5: { relation: 'Friendly', love: 88, business: 92, friendship: 90, adviceEn: 'Sun and Mercury (Budhaditya Yoga): sharp commercial success.', adviceHi: 'बुधादित्य योग; व्यापार, संचार और सामाजिक जीवन में श्रेष्ठ।' },
      6: { relation: 'Neutral', love: 70, business: 72, friendship: 75, adviceEn: 'Different priorities; 1 is ambitious, 6 seeks comfort.', adviceHi: 'दोनों के दृष्टिकोण अलग हैं, सामंजस्य बनाने पर मधुरता।' },
      7: { relation: 'Friendly', love: 82, business: 78, friendship: 85, adviceEn: '1 provides direction while 7 offers deep spiritual insights.', adviceHi: 'सूर्य और केतु; एक मार्गदर्शक है तो दूसरा दार्शनिक।' },
      8: { relation: 'Challenging', love: 55, business: 60, friendship: 58, adviceEn: 'Sun and Saturn: karmic relationship; requires deep patience.', adviceHi: 'सूर्य और शनि; वैचारिक मतभेद संभव, धैर्य व स्पष्टता अनिवार्य।' },
      9: { relation: 'Friendly', love: 95, business: 92, friendship: 96, adviceEn: 'Sun and Mars: unbeatable firepower, loyalty and triumph.', adviceHi: 'सूर्य और मंगल; सर्वोत्तम मित्र, अटूट विश्वास और विजय।' },
    },
    2: {
      1: { relation: 'Friendly', love: 92, business: 85, friendship: 90, adviceEn: 'Sun and Moon balance: caring support with confident leadership.', adviceHi: 'सूर्य-चन्द्र का पवित्र संगम; प्रेम व सहयोग में सर्वश्रेष्ठ।' },
      2: { relation: 'Friendly', love: 80, business: 70, friendship: 82, adviceEn: 'Deep emotional empathy, but prone to dual mood fluctuations.', adviceHi: 'अत्यधिक संवेदनशीलता, भावनाओं का सम्मान रहेगा।' },
      3: { relation: 'Friendly', love: 88, business: 90, friendship: 88, adviceEn: 'Moon and Jupiter: Gajakesari warmth, prosperity and peace.', adviceHi: 'गजकेसरी योग जैसा शुभ प्रभाव; ज्ञान व भावनात्मक तृप्ति।' },
      4: { relation: 'Neutral', love: 68, business: 75, friendship: 72, adviceEn: '4 provides grounding while 2 offers empathy; communicate clearly.', adviceHi: 'व्यावहारिक व भावनात्मक संतुलन बनाने का प्रयास करें।' },
      5: { relation: 'Neutral', love: 72, business: 75, friendship: 74, adviceEn: 'Speed vs feelings; give each other space to breathe.', adviceHi: 'बुध और चन्द्र; विचारों में भिन्नता पर मैत्री भाव।' },
      6: { relation: 'Friendly', love: 90, business: 85, friendship: 88, adviceEn: 'Moon and Venus: aesthetic joy, romance and peaceful luxury.', adviceHi: 'कला, सौंदर्य और दांपत्य जीवन के लिए अत्यंत सुखद।' },
      7: { relation: 'Friendly', love: 88, business: 80, friendship: 90, adviceEn: 'Deep telepathic connection and spiritual mutual understanding.', adviceHi: 'गहरा आध्यात्मिक व मानसिक जुड़ाव।' },
      8: { relation: 'Neutral', love: 65, business: 70, friendship: 68, adviceEn: 'Saturn can feel stern to sensitive Moon; focus on patience.', adviceHi: 'शनि की गंभीरता और चन्द्र की कोमलता; समझदारी जरूरी।' },
      9: { relation: 'Challenging', love: 58, business: 62, friendship: 60, adviceEn: 'Fire vs Water; Mars can be too aggressive for tender Moon.', adviceHi: 'अग्नि और जल तत्व; क्रोध से बचें, शांति से संवाद करें।' },
    },
    3: {
      1: { relation: 'Friendly', love: 90, business: 95, friendship: 92, adviceEn: 'Jupiter and Sun: king and prime minister dynamic.', adviceHi: 'राजा और गुरु का संबंध; मान-सम्मान व वैभव।' },
      2: { relation: 'Friendly', love: 88, business: 90, friendship: 88, adviceEn: 'Spiritual guidance and emotional understanding flourish.', adviceHi: 'ज्ञान और सहृदयता का संगम।' },
      3: { relation: 'Friendly', love: 85, business: 88, friendship: 86, adviceEn: 'Double Jupiter: shared philosophy and intellectual debates.', adviceHi: 'बौद्धिक संवाद, धार्मिक विचार व शिक्षा में उन्नति।' },
      4: { relation: 'Neutral', love: 72, business: 80, friendship: 75, adviceEn: 'Guru and Rahu; great for technical innovations with discipline.', adviceHi: 'गुरु-राहु; तकनीकी कार्यों में लाभकारी।' },
      5: { relation: 'Friendly', love: 86, business: 92, friendship: 88, adviceEn: 'Jupiter and Mercury: wisdom meets clever commerce.', adviceHi: 'ज्ञान और व्यापारिक चतुरता का शानदार मेल।' },
      6: { relation: 'Challenging', love: 60, business: 65, friendship: 62, adviceEn: 'Devguru (3) vs Daityaguru (6): conflicting philosophies.', adviceHi: 'देवगुरु और दैत्यगुरु; सिद्धांतों में टकराव से बचें।' },
      7: { relation: 'Friendly', love: 92, business: 85, friendship: 94, adviceEn: 'Profound spiritual seekers; deep mutual veneration.', adviceHi: 'आध्यात्मिक व दार्शनिक रूप से श्रेष्ठ जोड़ी।' },
      8: { relation: 'Neutral', love: 70, business: 78, friendship: 72, adviceEn: 'Guru and Shani; durable long-term foundations.', adviceHi: 'दीर्घकालिक कार्यों और न्याय व्यवस्था में उत्तम।' },
      9: { relation: 'Friendly', love: 94, business: 92, friendship: 95, adviceEn: 'Jupiter and Mars: powerhouse of righteous action and victory.', adviceHi: 'ज्ञान और पराक्रम का सर्वश्रेष्ठ मेल।' },
    },
    4: {
      1: { relation: 'Neutral', love: 75, business: 80, friendship: 78, adviceEn: '1 commands, 4 strategizes; dynamic if goals align.', adviceHi: 'लक्ष्य स्पष्ट हो तो बड़ी सफलता।' },
      2: { relation: 'Neutral', love: 68, business: 75, friendship: 72, adviceEn: '4 stabilizes 2’s emotions; avoid over-critical logic.', adviceHi: 'तर्क के स्थान पर प्रेम को प्राथमिकता दें।' },
      3: { relation: 'Neutral', love: 72, business: 80, friendship: 75, adviceEn: 'Respect 3’s ethics and 4’s technical execution.', adviceHi: 'नैतिकता व तकनीक का समन्वय।' },
      4: { relation: 'Challenging', love: 58, business: 65, friendship: 62, adviceEn: 'Double 4 can lead to headstrong stubborn impasses.', adviceHi: 'दोनों हठी हो सकते हैं; लचीलापन अपनाएं।' },
      5: { relation: 'Friendly', love: 85, business: 90, friendship: 88, adviceEn: 'Rahu and Mercury: digital breakthroughs, speed, and modern trade.', adviceHi: 'तकनीक, आईटी व आधुनिक व्यापार में सुपर-हिट।' },
      6: { relation: 'Friendly', love: 88, business: 85, friendship: 86, adviceEn: 'Rahu and Venus: luxury attractions and material abundance.', adviceHi: 'भौतिक सुख-सुविधा व धन लाभ के लिए शुभ।' },
      7: { relation: 'Friendly', love: 90, business: 82, friendship: 92, adviceEn: 'Rahu and Ketu (Head and Tail): karmic soul completion.', adviceHi: 'राहु और केतु का कार्मिक संतुलन।' },
      8: { relation: 'Friendly', love: 86, business: 92, friendship: 88, adviceEn: 'Rahu and Saturn: unshakeable perseverance and empire building.', adviceHi: 'कठिन परिश्रम से बड़ा साम्राज्य बनाने में सक्षम।' },
      9: { relation: 'Challenging', love: 52, business: 58, friendship: 55, adviceEn: 'High friction and sudden anger; maintain calm distance.', adviceHi: 'उग्रता व अचानक टकराव से बचें।' },
    },
    5: {
      1: { relation: 'Friendly', love: 88, business: 92, friendship: 90, adviceEn: 'Brilliant intellectual sparkle and commercial leadership.', adviceHi: 'व्यापार व नेतृत्व का अद्भुत संगम।' },
      2: { relation: 'Neutral', love: 72, business: 75, friendship: 74, adviceEn: 'Patience required; mind and emotions need mutual space.', adviceHi: 'आपसी समझदारी से संतुलन बनाएं।' },
      3: { relation: 'Friendly', love: 86, business: 92, friendship: 88, adviceEn: 'Wisdom combined with marketing eloquence.', adviceHi: 'ज्ञान और संवाद का सुंदर मेल।' },
      4: { relation: 'Friendly', love: 85, business: 90, friendship: 88, adviceEn: 'Digital, analytical, and commercial synergy.', adviceHi: 'आधुनिक व्यापार में तीव्र प्रगति।' },
      5: { relation: 'Friendly', love: 82, business: 88, friendship: 85, adviceEn: 'Ultra-fast, lively lifestyle; avoid financial scatteredness.', adviceHi: 'ऊर्जावान जोड़ी; आर्थिक अनुशासन बनाए रखें।' },
      6: { relation: 'Friendly', love: 92, business: 94, friendship: 92, adviceEn: 'Mercury and Venus (Lakshmi-Narayan harmony): absolute wealth and charm.', adviceHi: 'लक्ष्मी-नारायण योग; दांपत्य व धन में सर्वोच्च शुभ।' },
      7: { relation: 'Neutral', love: 74, business: 78, friendship: 76, adviceEn: 'Commercial mind meets spiritual seeker.', adviceHi: 'व्यापार और वैराग्य का संतुलन।' },
      8: { relation: 'Friendly', love: 85, business: 90, friendship: 86, adviceEn: 'Mercury and Saturn: clever trading with solid foundation.', adviceHi: 'चतुरता और स्थिरता का बेहतरीन मेल।' },
      9: { relation: 'Neutral', love: 70, business: 75, friendship: 72, adviceEn: 'Fast wits meet fiery courage; avoid hasty arguments.', adviceHi: 'तर्क और पराक्रम; जल्दबाजी से बचें।' },
    },
    6: {
      1: { relation: 'Neutral', love: 70, business: 72, friendship: 75, adviceEn: 'Luxurious lifestyle with authoritative drive.', adviceHi: 'परस्पर समझ से संबंध मजबूत होंगे।' },
      2: { relation: 'Friendly', love: 90, business: 85, friendship: 88, adviceEn: 'Tender romance, emotional safety, and shared artistic tastes.', adviceHi: 'रोमांस, कला और पारिवारिक सुख।' },
      3: { relation: 'Challenging', love: 60, business: 65, friendship: 62, adviceEn: 'Different value systems; focus on mutual respect.', adviceHi: 'सिद्धांतों में अंतर; आदर भाव रखें।' },
      4: { relation: 'Friendly', love: 88, business: 85, friendship: 86, adviceEn: 'Material growth and aesthetic pleasure combine well.', adviceHi: 'भौतिक सुख व धन अर्जन हेतु उत्तम।' },
      5: { relation: 'Friendly', love: 92, business: 94, friendship: 92, adviceEn: 'Golden pair: sparkling wit, immense wealth, and mutual delight.', adviceHi: 'व्यापार और प्रेम दोनों में भाग्यशाली।' },
      6: { relation: 'Friendly', love: 85, business: 80, friendship: 84, adviceEn: 'High luxury, romance and social warmth; keep budgets in check.', adviceHi: 'सुख-सुविधाएं भरपूर; खर्चों पर नियंत्रण रखें।' },
      7: { relation: 'Neutral', love: 72, business: 70, friendship: 75, adviceEn: 'Worldly beauty meets mystical detachment.', adviceHi: 'सांसारिक सुख व अध्यात्म का संतुलन।' },
      8: { relation: 'Friendly', love: 88, business: 92, friendship: 90, adviceEn: 'Venus and Saturn: durable love, lifelong loyalty, and wealth.', adviceHi: 'शुक्र-शनि की मित्रता; अटूट संबंध व धन लाभ।' },
      9: { relation: 'Friendly', love: 86, business: 88, friendship: 88, adviceEn: 'Passion, charisma, and dynamic protective chemistry.', adviceHi: 'आकर्षण, ऊर्जा और प्रेम संबंध।' },
    },
    7: {
      1: { relation: 'Friendly', love: 82, business: 78, friendship: 85, adviceEn: 'Visionary leadership illuminated by spiritual wisdom.', adviceHi: 'सूर्य और केतु का दार्शनिक संबंध।' },
      2: { relation: 'Friendly', love: 88, business: 80, friendship: 90, adviceEn: 'Intuitive telepathy and tender mental resonance.', adviceHi: 'गहरा भावनात्मक व आत्मिक जुड़ाव।' },
      3: { relation: 'Friendly', love: 92, business: 85, friendship: 94, adviceEn: 'Spiritual teachers and researchers uniting for noble causes.', adviceHi: 'ज्ञान, धर्म और शोध में सर्वश्रेष्ठ जोड़ी।' },
      4: { relation: 'Friendly', love: 90, business: 82, friendship: 92, adviceEn: 'Ketu and Rahu: complementary polar forces creating equilibrium.', adviceHi: 'राहु-केतु का संतुलन; अद्भुत तालमेल।' },
      5: { relation: 'Neutral', love: 74, business: 78, friendship: 76, adviceEn: 'Deep thinker meets lively communicator.', adviceHi: 'गंभीरता और चपलता का मिलन।' },
      6: { relation: 'Neutral', love: 72, business: 70, friendship: 75, adviceEn: 'Mystic depth meets aesthetic enjoyment.', adviceHi: 'सामंजस्य से रिश्ते में मधुरता।' },
      7: { relation: 'Friendly', love: 80, business: 72, friendship: 85, adviceEn: 'Two deep mystics; share outside social activities together.', adviceHi: 'आध्यात्मिक चिंतन; एकाकीपन से बचें।' },
      8: { relation: 'Neutral', love: 75, business: 80, friendship: 78, adviceEn: 'Ketu and Saturn: deep philosophical resilience.', adviceHi: 'गंभीर व दीर्घकालिक योजनाओं के लिए शुभ।' },
      9: { relation: 'Challenging', love: 58, business: 62, friendship: 60, adviceEn: 'Calm contemplation vs fiery impulse; tread gently.', adviceHi: 'शांति और उग्रता; संयम से बात करें।' },
    },
    8: {
      1: { relation: 'Challenging', love: 55, business: 60, friendship: 58, adviceEn: 'Sun and Saturn: polar opposites requiring ego surrender.', adviceHi: 'सूर्य-शनि संबंध; अहंकार छोड़ने पर ही सफलता।' },
      2: { relation: 'Neutral', love: 65, business: 70, friendship: 68, adviceEn: 'Saturn provides stability; Moon needs warmth.', adviceHi: 'धैर्य और स्नेह से सामंजस्य बनाएं।' },
      3: { relation: 'Neutral', love: 70, business: 78, friendship: 72, adviceEn: 'Wisdom balances hard practical reality.', adviceHi: 'गुरु और शनि का संतुलित दृष्टिकोण।' },
      4: { relation: 'Friendly', love: 86, business: 92, friendship: 88, adviceEn: 'Saturn and Rahu: master architects of big ventures.', adviceHi: 'बड़ा साम्राज्य व उद्योग स्थापित करने में सक्षम।' },
      5: { relation: 'Friendly', love: 85, business: 90, friendship: 86, adviceEn: 'Clever intellect backed by iron determination.', adviceHi: 'व्यापार व वित्तीय प्रबंधन में अत्यंत लाभकारी।' },
      6: { relation: 'Friendly', love: 88, business: 92, friendship: 90, adviceEn: 'Saturn and Venus: profound durability, loyalty and wealth.', adviceHi: 'स्थाई संबंध, वफादारी और अपार समृद्धि।' },
      7: { relation: 'Neutral', love: 75, business: 80, friendship: 78, adviceEn: 'Patience and introspection work hand in hand.', adviceHi: 'धैर्य और शोध का अच्छा तालमेल।' },
      8: { relation: 'Friendly', love: 82, business: 88, friendship: 84, adviceEn: 'Double Saturn: titanic discipline and massive long-term success.', adviceHi: 'अथक परिश्रम और बड़ी उपलब्धियों का योग।' },
      9: { relation: 'Challenging', love: 52, business: 55, friendship: 54, adviceEn: 'Saturn vs Mars: cold restraint vs hot fire; high friction.', adviceHi: 'शनि और मंगल; धैर्य से काम लें, टकराव से बचें।' },
    },
    9: {
      1: { relation: 'Friendly', love: 95, business: 92, friendship: 96, adviceEn: 'Sun and Mars: ultimate power duo with unstoppable victory.', adviceHi: 'सूर्य-मंगल; सर्वोत्कृष्ट मैत्री, विजय और ऊर्जा।' },
      2: { relation: 'Challenging', love: 58, business: 62, friendship: 60, adviceEn: 'Mars is too assertive for sensitive Moon; tone down fire.', adviceHi: 'क्रोध पर नियंत्रण रखें, कोमलता से बात करें।' },
      3: { relation: 'Friendly', love: 94, business: 92, friendship: 95, adviceEn: 'Mars and Jupiter: righteous courage and glorious success.', adviceHi: 'साहस और ज्ञान का विजय प्रदायक संगम।' },
      4: { relation: 'Challenging', love: 52, business: 58, friendship: 55, adviceEn: 'Volatile friction; keep clear boundaries.', adviceHi: 'विवाद से बचें, शांति से निर्णय लें।' },
      5: { relation: 'Neutral', love: 70, business: 75, friendship: 72, adviceEn: 'Dynamic speed; channel combined energies constructively.', adviceHi: 'ऊर्जा को सही दिशा में लगाएं।' },
      6: { relation: 'Friendly', love: 86, business: 88, friendship: 88, adviceEn: 'Passionate chemistry, vibrant love and artistic magnetism.', adviceHi: 'आकर्षण, प्रेम और सुखद दांपत्य।' },
      7: { relation: 'Challenging', love: 58, business: 62, friendship: 60, adviceEn: 'Fiery action vs quiet solitude; give mutual space.', adviceHi: 'एक-दूसरे के स्वभाव का सम्मान करें।' },
      8: { relation: 'Challenging', love: 52, business: 55, friendship: 54, adviceEn: 'Cold ice vs hot fire; avoid stubborn ego stalemates.', adviceHi: 'टकराव की स्थिति में समझौतावादी बनें।' },
      9: { relation: 'Friendly', love: 85, business: 88, friendship: 90, adviceEn: 'Double Mars: incredible bravery, loyalty and shared missions.', adviceHi: 'साहस व परोपकार में अग्रणी जोड़ी।' },
    },
  };

  const currentRules = COMPATIBILITY_RULES[userMulank] || COMPATIBILITY_RULES[1];
  const list: CompatibilityItem[] = [];

  for (let target = 1; target <= 9; target++) {
    const item = currentRules[target];
    const relationType = item.relation;
    const relationTypeHindi =
      relationType === 'Friendly'
        ? 'अति-मित्र (श्रेष्ठ)'
        : relationType === 'Neutral'
        ? 'सम (सामान्य)'
        : 'शत्रु (सावधानी)';

    list.push({
      targetNumber: target,
      relationType,
      relationTypeHindi,
      loveScore: item.love,
      businessScore: item.business,
      friendshipScore: item.friendship,
      advice: item.adviceEn,
      adviceHindi: item.adviceHi,
    });
  }

  return list;
}

// Calculate Personal Year Predictions (1-9)
export function getPersonalYearDetails(personalYearNum: number, targetYear: number): PersonalYearPrediction {
  const PERSONAL_YEAR_DATA: Record<
    number,
    {
      themeEn: string;
      themeHi: string;
      overviewEn: string;
      overviewHi: string;
      careerEn: string;
      careerHi: string;
      relEn: string[];
      relHi: string[];
      dosEn: string[];
      dosHi: string[];
      dontsEn: string[];
      dontsHi: string[];
    }
  > = {
    1: {
      themeEn: 'New Beginnings, Seeds of the 9-Year Cycle & Bold Initiatives',
      themeHi: 'नवीन शुरुआत, नए 9-वर्षीय चक्र का बीजारोपण एवं आत्मनिर्भरता',
      overviewEn: 'Personal Year 1 is the commencement of an entirely new 9-year evolutionary cycle. High vitality, fresh career opportunities, and bold individual initiatives take root.',
      overviewHi: 'यह वर्ष आपके जीवन के नए 9-वर्षीय अध्याय का पहला वर्ष है। इस वर्ष आप जो भी नई नींव रखेंगे, उसका प्रभाव अगले 9 वर्षों तक रहेगा। नई योजनाएं शुरू करने का सर्वश्रेष्ठ समय।',
      careerEn: 'Launch new ventures, seek promotions, start businesses, and lead independently.',
      careerHi: 'नया व्यवसाय शुरू करें, नई नौकरी या पदोन्नति के लिए प्रयास करें और स्वतंत्र नेतृत्व संभालें।',
      relEn: ['Form independent, fresh connections', 'Set clear personal boundaries', 'Attract dynamic allies'],
      relHi: ['नए व प्रेरणादायी संबंध बनेंगे', 'अपनी पहचान व सीमाओं को स्पष्ट रखें', 'आत्मविश्वास से लोग आकर्षित होंगे'],
      dosEn: ['Take brave calculated risks', 'Start learning high-income skills', 'Be proactive and decisive'],
      dosHi: ['साहसिक व सकारात्मक निर्णय लें', 'नए कौशल सीखें', 'आत्मनिर्भर बनकर कार्य करें'],
      dontsEn: ['Do not procrastinate', 'Do not rely solely on past laurels', 'Avoid arrogance'],
      dontsHi: ['आलस्य व टालमटोल से बचें', 'दूसरों पर अति-निर्भर न रहें', 'अहंकार न आने दें'],
    },
    2: {
      themeEn: 'Patience, Partnerships, Diplomacy & Emotional Intuition',
      themeHi: 'धैर्य, सहयोग, साझेदारी, शांति एवं अंतर्ज्ञान का विकास',
      overviewEn: 'A year of gentle cooperation and nurturing what you started in Year 1. Partnerships, romance, diplomacy, and keen intuition are highlighted.',
      overviewHi: 'यह वर्ष शांति, कूटनीति और दूसरों के साथ मिलकर कार्य करने का है। पहले वर्ष में बोए गए बीजों को सींचने और संबंधों को मधुर बनाने का समय है।',
      careerEn: 'Collaborate with trusted co-founders, resolve conflicts smoothly, and excel in team projects.',
      careerHi: 'साझेदारी के कार्यों में लाभ, विवादों का शांतिपूर्ण समाधान और टीम वर्क से सफलता।',
      relEn: ['Romantic commitments deepen', 'Healing of old misunderstandings', 'Forging strong friendships'],
      relHi: ['दांपत्य व प्रेम संबंधों में प्रगाढ़ता', 'पारिवारिक गिले-शिकवे दूर होंगे', 'सच्चे मित्रों का सहयोग'],
      dosEn: ['Practice active listening', 'Trust your intuitive gut feelings', 'Maintain emotional balance'],
      dosHi: ['धैर्य और विनम्रता से बात करें', 'अपने अंतर्ज्ञान (Intuition) पर भरोसा करें', 'मन की शांति बनाए रखें'],
      dontsEn: ['Do not force hasty confrontations', 'Avoid oversensitivity', 'Do not isolate yourself'],
      dontsHi: ['जल्दबाजी में टकराव से बचें', 'छोटी बातों को दिल से न लगाएं', 'एकाकी न रहें'],
    },
    3: {
      themeEn: 'Creativity, Self-Expression, Joy, Social Expansion & Learning',
      themeHi: 'रचनात्मकता, सामाजिक विस्तार, विद्या, ज्ञान एवं आनंद',
      overviewEn: 'A sparkling, joyful, and creative year ruled by Jupiter’s expansive warmth. Public recognition, writing, teaching, social networking, and travels abound.',
      overviewHi: 'यह वर्ष देवगुरु बृहस्पति की कृपा से ज्ञान, रचनात्मकता और सामाजिक प्रतिष्ठा में भारी वृद्धि का है। आपके विचारों और प्रतिभा को व्यापक सराहना मिलेगी।',
      careerEn: 'Excellent for marketing, media, public speaking, publishing, and creative innovations.',
      careerHi: 'मार्केटिंग, मीडिया, लेखन, कला, शिक्षा और प्रचार-प्रसार में अभूतपूर्व सफलता।',
      relEn: ['Vibrant social calendar', 'Meeting inspirational mentors', 'Joyful celebrations'],
      relHi: ['सामाजिक दायरा बढ़ेगा', 'योग्य गुरुओं व मार्गदर्शकों से भेंट', 'मांगलिक उत्सवों में सहभागिता'],
      dosEn: ['Express your creative ideas openly', 'Travel and learn new subjects', 'Stay optimistic'],
      dosHi: ['अपनी प्रतिभा व कला का खुलकर प्रदर्शन करें', 'ज्ञानवर्धन व यात्राएं करें', 'सदा प्रसन्नचित्त रहें'],
      dontsEn: ['Do not scatter your focus across too many hobbies', 'Avoid frivolous overspending'],
      dontsHi: ['एक साथ बहुत सारे कार्यों में ध्यान न भटकाएं', 'फिजूलखर्ची पर नियंत्रण रखें'],
    },
    4: {
      themeEn: 'Hard Work, Building Solid Foundations, Discipline & Health',
      themeHi: 'कठिन परिश्रम, अनुशासन, स्थायी नींव का निर्माण एवं स्वास्थ्य पर ध्यान',
      overviewEn: 'A year of systematic discipline, organizational structuring, real estate, and practical diligence. Solid foundations laid here guarantee long-term security.',
      overviewHi: 'यह वर्ष राहु व शनि के प्रभाव से ठोस परिश्रम और भविष्य के लिए मजबूत आधारशिला रखने का है। योजनाबद्ध तरीके से काम करने पर भविष्य सुरक्षित होगा।',
      careerEn: 'Focus on systems, legal documentation, skill certification, and durable infrastructure.',
      careerHi: 'कागजी कार्रवाई, कानूनी स्पष्टता, तकनीकी दक्षता और स्थायी संपत्ति निर्माण पर ध्यान दें।',
      relEn: ['Grounding family roots', 'Supporting dependants faithfully', 'Valuing dependable companions'],
      relHi: ['परिवार के प्रति जिम्मेदारियां निभाएं', 'विश्वसनीय लोगों के साथ रहें', 'स्थिर संबंध'],
      dosEn: ['Work methodically with daily routines', 'Organize your finances and health checkups'],
      dosHi: ['नियमित दिनचर्या व अनुशासन अपनाएं', 'बचत व स्वास्थ्य का विशेष ध्यान रखें'],
      dontsEn: ['Do not take short-cuts', 'Avoid mental frustration over slow pace'],
      dontsHi: ['शॉर्टकट अपनाने से बचें', 'काम में देरी से निराश न हों, धैर्य रखें'],
    },
    5: {
      themeEn: 'Dynamic Change, Freedom, Travel, New Opportunities & Versatility',
      themeHi: 'बड़ा बदलाव, स्वतंत्रता, यात्राएं, नए अवसर एवं व्यापारिक छलांग',
      overviewEn: 'A dynamic midpoint year bursting with exciting shifts, international travels, sudden opportunities, and commercial expansion. Embrace adaptability.',
      overviewHi: 'यह 9-वर्षीय चक्र का मध्य बिंदु है जहां जीवन में बड़े और सकारात्मक बदलाव आते हैं। यात्राएं, नए संपर्क, व्यापारिक विस्तार और नई दिशाएं खुलेंगी।',
      careerEn: 'Seize sudden market opportunities, expand digital reach, and embrace modern upgrades.',
      careerHi: 'शेयर मार्केट, ई-कॉमर्स, नए सौदों और डिजिटल विस्तार में भारी लाभ।',
      relEn: ['Exciting new acquaintances', 'Spontaneous adventures', 'Dynamic social connections'],
      relHi: ['नए रोचक लोगों से परिचय', 'रोमांचक यात्राएं व नए मित्र', 'ऊर्जावान संबंध'],
      dosEn: ['Be agile and adaptable to sudden shifts', 'Embrace constructive travel and marketing'],
      dosHi: ['बदलाव को सहर्ष स्वीकार करें', 'नई तकनीक व व्यापारिक अवसर तुरंत लपकें'],
      dontsEn: ['Do not make reckless impulsive gambles', 'Avoid over-indulgence in sensual excesses'],
      dontsHi: ['अति-उतावलेपन में अनैतिक जोखिम न लें', 'खान-पान व दिनचर्या को अनियंत्रित न होने दें'],
    },
    6: {
      themeEn: 'Family Harmony, Home Life, Marriage, Domestic Luxury & Responsibility',
      themeHi: 'पारिवारिक सुख, विवाह, गृह-सज्जा, प्रेम एवं जिम्मेदारियां',
      overviewEn: 'A warm, Venusian year focusing on marriage, domestic beautification, caring for loved ones, and attracting luxury and wealth into the household.',
      overviewHi: 'यह वर्ष शुक्र ग्रह के प्रभाव से घर-परिवार, विवाह, दांपत्य सुख, नया मकान या वाहन खरीदने और सौंदर्य प्रसाधन हेतु अत्यंत अनुकूल व फलदायी है।',
      careerEn: 'Great for design, hospitality, customer service, luxury real estate, and artistic businesses.',
      careerHi: 'हॉस्पिटैलिटी, डिजाइनिंग, आर्किटेक्चर, रियल एस्टेट व उपभोक्ता सेवाओं में लाभ।',
      relEn: ['Auspicious for marriage & engagement', 'Deepening family bonds', 'Welcoming newborns'],
      relHi: ['विवाह व सगाई के प्रबल योग', 'घर में खुशहाली व मांगलिक कार्य', 'संतान सुख'],
      dosEn: ['Beautify your home and workspace', 'Prioritize harmony in family relations', 'Give generously'],
      dosHi: ['घर व कार्यस्थल का सौंदर्यीकरण करें', 'परिजनों की जरूरतों का ध्यान रखें', 'दान-पुण्य करें'],
      dontsEn: ['Do not meddle excessively in others’ personal affairs', 'Avoid perfectionist martyrdom'],
      dontsHi: ['दूसरों के निजी मामलों में अधिक दखल न दें', 'अपनी इच्छाएं दूसरों पर न थोपें'],
    },
    7: {
      themeEn: 'Spiritual Realization, Deep Reflection, Research & Soul Healing',
      themeHi: 'आत्मचिंतन, आध्यात्मिक जागृति, शोध, एकांत साधना एवं मानसिक शांति',
      overviewEn: 'A contemplative, mystical Ketu-ruled year for inner exploration, advanced research, meditation, and disconnecting from hollow worldly noise.',
      overviewHi: 'यह वर्ष आध्यात्मिक उन्नति, आत्मनिरीक्षण, योग-ध्यान, उच्च अध्ययन और शोध कार्य के लिए सर्वोत्तम है। अंतर्मुखी होकर स्वयं को जानने का समय है।',
      careerEn: 'Focus on specialized research, writing, spiritual consultancy, and behind-the-scenes mastery.',
      careerHi: 'शोध, उच्च शिक्षा, लेखन, कोडिंग व गुप्त योजनाओं को अंतिम रूप देने में सफलता।',
      relEn: ['Quality over quantity in friends', 'Deep soul-level connections', 'Appreciating quiet intimacy'],
      relHi: ['गंभीर व सच्चे लोगों से ही संगति रखें', 'आध्यात्मिक चर्चाएं व आत्मिक शांति'],
      dosEn: ['Practice daily meditation and yoga', 'Spend time in nature and study deep subjects'],
      dosHi: ['प्रतिदिन ध्यान व प्राणायाम करें', 'प्रकृति के सानिध्य में समय बिताएं व ज्ञानार्जन करें'],
      dontsEn: ['Do not push for aggressive commercial expansion', 'Avoid sinking into cynical isolation'],
      dontsHi: ['भौतिक लाभ के पीछे अंधी दौड़ न लगाएं', 'नकारात्मक विचारों व अकेलेपन से बचें'],
    },
    8: {
      themeEn: 'Material Empowerment, Financial Harvest, Authority & Karmic Rewards',
      themeHi: 'आर्थिक फसल (Harvest), सत्ता, अधिकार, मान-सम्मान एवं कर्मफल की प्राप्ति',
      overviewEn: 'The supreme harvest year of the 9-year cycle! What you worked for over the past 7 years manifests as tangible wealth, senior executive status, and massive victory.',
      overviewHi: 'यह 9-वर्षीय चक्र का सबसे शक्तिशाली आर्थिक व सत्ता वर्ष (Harvest Year) है। पिछले वर्षों के कठिन परिश्रम का फल पद, प्रतिष्ठा, धन और अधिकार के रूप में प्राप्त होगा।',
      careerEn: 'Scale your business empire, command leadership, acquire prime assets, and achieve financial peaks.',
      careerHi: 'व्यापार का विस्तार करें, वरिष्ठ पद प्राप्त करें, अचल संपत्ति खरीदें और बड़ा आर्थिक लाभ कमाएं।',
      relEn: ['Commanding high social respect', 'Alliances with influential leaders', 'Generous philanthropy'],
      relHi: ['समाज में उच्च मान-सम्मान', 'प्रभावशाली व्यक्तियों से सहयोग', 'परोपकार व जनकल्याण'],
      dosEn: ['Manage your finances with strict justice and vision', 'Step up boldly into leadership'],
      dosHi: ['ईमानदारी व न्यायप्रियता से वित्तीय प्रबंधन करें', 'साहस के साथ बड़ा निर्णय लें'],
      dontsEn: ['Do not abuse power or neglect ethical principles', 'Avoid prideful ruthlessness'],
      dontsHi: ['अधिकार का दुरुपयोग न करें', 'अहंकार व लोभ से कोसों दूर रहें'],
    },
    9: {
      themeEn: 'Completion, Forgiveness, Letting Go & Clearing the Path for a New Cycle',
      themeHi: 'पूर्णता (Completion), क्षमा भाव, अनुपयोगी का त्याग एवं नए चक्र की तैयारी',
      overviewEn: 'The culminating graduation year. Release outdated habits, toxic relationships, and non-serving projects. Forgive, clean your karmic slate, and prepare for the next 9-year cycle.',
      overviewHi: 'यह 9-वर्षीय चक्र का अंतिम वर्ष (पूर्णाहुति वर्ष) है। जो भी अनुपयोगी है—चाहे पुरानी आदतें हों या नकारात्मक संबंध—उन्हें विदा करने और नई ऊर्जा के लिए स्थान बनाने का समय है।',
      careerEn: 'Finish pending projects, settle debts, wrap up legacy assignments, and mentor the next generation.',
      careerHi: 'अटके कार्यों को पूरा करें, पुराने कर्जे चुकाएं और नए 9-वर्षीय चक्र की तैयारी करें।',
      relEn: ['Forgiving past grievances', 'Humanitarian service', 'Letting go of unsupportive ties'],
      relHi: ['पुरानी कड़वाहट भूलकर क्षमा करें', 'समाज सेवा व परोपकार करें', 'सच्चे संबंध संजोएं'],
      dosEn: ['Declutter physical and mental space', 'Engage in charity and altruism', 'Celebrate completions'],
      dosHi: ['घर व मन से अवांछित वस्तुओं व विचारों को हटाएं', 'दान-पुण्य करें व क्षमा भाव रखें'],
      dontsEn: ['Do not initiate massive brand-new long-term contracts right now (wait for Year 1)'],
      dontsHi: ['इस वर्ष बिना सोचे-समझे बहुत बड़ा नया उपक्रम शुरू न करें, वर्ष 1 की प्रतीक्षा करें'],
    },
  };

  const details = PERSONAL_YEAR_DATA[personalYearNum] || PERSONAL_YEAR_DATA[1];

  return {
    year: targetYear,
    personalYearNumber: personalYearNum,
    theme: details.themeEn,
    themeHindi: details.themeHi,
    overview: details.overviewEn,
    overviewHindi: details.overviewHi,
    careerFinance: details.careerEn,
    careerFinanceHindi: details.careerHi,
    relationships: details.relEn,
    relationshipsHindi: details.relHi,
    dos: details.dosEn,
    dosHindi: details.dosHi,
    donts: details.dontsEn,
    dontsHindi: details.dontsHi,
  };
}

// Master calculation function for complete Ank Jyotish
export function calculateAnkJyotish(name: string, dobStr: string): AnkJyotishFullReport {
  const cleanName = (name || 'Aarav Sharma').trim();
  const cleanDob = dobStr || '1998-05-15';

  const parts = cleanDob.split('-').map(Number);
  const birthYear = parts[0] || 1998;
  const birthMonth = parts[1] || 5;
  const birthDay = parts[2] || 15;

  // 1. Mulank (Day of birth 1-31 -> 1-9)
  const mulankCompound = birthDay;
  const mulank = reduceToSingleDigit(birthDay);

  // 2. Bhagyank (Full DOB sum -> 1-9)
  const fullDobSum = sumDigits(birthDay) + sumDigits(birthMonth) + sumDigits(birthYear);
  const bhagyankCompound = fullDobSum;
  const bhagyank = reduceToSingleDigit(fullDobSum);

  // 3. Name Breakdown (Chaldean & Pythagorean)
  const upperName = cleanName.toUpperCase();
  const lettersBreakdown: ChaldeanLetterBreakdown[] = [];
  let rawChaldeanSum = 0;
  let rawPythagoreanSum = 0;
  let vowelsSum = 0;
  let consonantsSum = 0;

  for (let i = 0; i < upperName.length; i++) {
    const char = upperName[i];
    if (/[A-Z]/.test(char)) {
      const cVal = CHALDEAN_MAP[char] || 0;
      const pVal = PYTHAGOREAN_MAP[char] || 0;
      const isVow = VOWELS.has(char);

      lettersBreakdown.push({
        letter: char,
        chaldeanValue: cVal,
        pythagoreanValue: pVal,
        isVowel: isVow,
      });

      rawChaldeanSum += cVal;
      rawPythagoreanSum += pVal;

      if (isVow) {
        vowelsSum += cVal;
      } else {
        consonantsSum += cVal;
      }
    }
  }

  const namankChaldeanCompound = rawChaldeanSum || 14;
  const namankChaldean = reduceToSingleDigit(namankChaldeanCompound);
  const namankPythagoreanCompound = rawPythagoreanSum || 14;
  const namankPythagorean = reduceToSingleDigit(namankPythagoreanCompound);

  const soulUrgeNumber = reduceToSingleDigit(vowelsSum || 1);
  const personalityNumber = reduceToSingleDigit(consonantsSum || 1);

  // 4. Name Harmony with Mulank & Bhagyank
  // Evaluate if namankChaldean is friendly to mulank and bhagyank
  const mulankProfile = VEDIC_NUMBER_PROFILES[mulank] || VEDIC_NUMBER_PROFILES[1];
  const bhagyankProfile = VEDIC_NUMBER_PROFILES[bhagyank] || VEDIC_NUMBER_PROFILES[1];
  const namankProfile = VEDIC_NUMBER_PROFILES[namankChaldean] || VEDIC_NUMBER_PROFILES[1];

  let harmonyScore = 70;
  let harmonyStatus: AnkJyotishFullReport['nameHarmonyStatus'] = 'Favorable';
  let harmonyStatusHindi: AnkJyotishFullReport['nameHarmonyStatusHindi'] = 'अनुकूल';
  let adviceEn = '';
  let adviceHi = '';

  const isFriendlyToMulank = mulankProfile.strengths ? true : false;
  // Check compatibility
  const compList = calculateVedicCompatibility(mulank);
  const compWithNamank = compList.find((c) => c.targetNumber === namankChaldean);

  if (compWithNamank?.relationType === 'Friendly') {
    harmonyScore += 20;
  } else if (compWithNamank?.relationType === 'Challenging') {
    harmonyScore -= 30;
  }

  // Check against Bhagyank
  const bhagyankCompList = calculateVedicCompatibility(bhagyank);
  const compBhagyankWithNamank = bhagyankCompList.find((c) => c.targetNumber === namankChaldean);
  if (compBhagyankWithNamank?.relationType === 'Friendly') {
    harmonyScore += 10;
  } else if (compBhagyankWithNamank?.relationType === 'Challenging') {
    harmonyScore -= 20;
  }

  // Compound vibration check (e.g. 19, 23, 24, 37, 41, 46, 51 are auspicious)
  const AUSPICIOUS_COMPOUNDS = new Set([1, 3, 5, 6, 9, 10, 14, 15, 17, 19, 21, 23, 24, 27, 30, 32, 33, 37, 41, 42, 45, 46, 50, 51]);
  if (AUSPICIOUS_COMPOUNDS.has(namankChaldeanCompound)) {
    harmonyScore += 10;
  } else if ([12, 16, 18, 26, 28, 29].includes(namankChaldeanCompound)) {
    harmonyScore -= 15;
  }

  harmonyScore = Math.max(35, Math.min(99, harmonyScore));

  if (harmonyScore >= 85) {
    harmonyStatus = 'Highly Auspicious';
    harmonyStatusHindi = 'अत्यंत शुभ एवं फलदायी';
    adviceEn = `Your name number ${namankChaldean} (${namankChaldeanCompound}) resonates harmoniously with your Mulank ${mulank} and Bhagyank ${bhagyank}. It acts as an energetic booster for commercial success and social popularity.`;
    adviceHi = `आपका नामांक ${namankChaldean} (संयुक्त मान ${namankChaldeanCompound}) आपके मूलांक ${mulank} एवं भाग्यांक ${bhagyank} के साथ पूर्ण सामंजस्य में है। यह नाम आपको समाज में यश, सफलता और धन आकर्षित करने में अत्यधिक सहायक है।`;
  } else if (harmonyScore >= 65) {
    harmonyStatus = 'Favorable';
    harmonyStatusHindi = 'अनुकूल';
    adviceEn = `Your name number ${namankChaldean} holds a favorable vibration with your birth chart. Minor spelling fine-tuning can elevate it to peak vibration.`;
    adviceHi = `आपका नामांक ${namankChaldean} अनुकूल है। थोड़े से अक्षर सुधार (Spelling Adjustment) से इसे और अधिक शक्तिशाली बनाया जा सकता है।`;
  } else {
    harmonyStatus = 'Inharmonious';
    harmonyStatusHindi = 'असंतुलित (सुधार योग्य)';
    adviceEn = `Your current name vibration (${namankChaldean}) produces friction with your Mulank ${mulank} or Bhagyank ${bhagyank}. Consider adding or adjusting letters to bring the sum to a friendly compound (like 1, 5, or 6).`;
    adviceHi = `आपका वर्तमान नामांक ${namankChaldean} आपके मूलांक या भाग्यांक के साथ पूर्ण मित्रवत नहीं है। नाम की स्पेलिंग में एक-दो अक्षर जोड़कर इसे मित्र अंक (जैसे 1, 5 अथवा 6) पर लाना अत्यंत लाभकारी सिद्ध होगा।`;
  }

  // 5. Personal Year (Current: 2026/2027)
  const currentCalendarYear = new Date().getFullYear(); // 2026 or 2027
  const pyCurrentSum = sumDigits(birthDay) + sumDigits(birthMonth) + sumDigits(currentCalendarYear);
  const personalYearNumCurrent = reduceToSingleDigit(pyCurrentSum);
  const personalYearCurrent = getPersonalYearDetails(personalYearNumCurrent, currentCalendarYear);

  const nextCalendarYear = currentCalendarYear + 1;
  const pyNextSum = sumDigits(birthDay) + sumDigits(birthMonth) + sumDigits(nextCalendarYear);
  const personalYearNumNext = reduceToSingleDigit(pyNextSum);
  const personalYearNext = getPersonalYearDetails(personalYearNumNext, nextCalendarYear);

  // Personal Month & Personal Day
  const currentMonthNum = new Date().getMonth() + 1;
  const personalMonthNumber = reduceToSingleDigit(personalYearNumCurrent + currentMonthNum);
  const currentDayNum = new Date().getDate();
  const personalDayNumber = reduceToSingleDigit(personalMonthNumber + currentDayNum);

  // 6. 4 Pinnacles & 4 Challenges
  // 1st Pinnacle = Month + Day
  const p1 = reduceToSingleDigit(birthMonth + birthDay);
  // 2nd Pinnacle = Day + Year
  const p2 = reduceToSingleDigit(birthDay + sumDigits(birthYear));
  // 3rd Pinnacle = P1 + P2
  const p3 = reduceToSingleDigit(p1 + p2);
  // 4th Pinnacle = Month + Year
  const p4 = reduceToSingleDigit(birthMonth + sumDigits(birthYear));

  const firstPinnacleEndAge = 36 - mulank;
  const pinnacles = [
    {
      pinnacle: 1,
      ageRange: `Age 0 to ${firstPinnacleEndAge}`,
      ageRangeHindi: `जन्म से ${firstPinnacleEndAge} वर्ष तक`,
      number: p1,
      theme: `Foundation period governed by vibration of Number ${p1}`,
      themeHindi: `प्रारंभिक निर्माण काल (अंक ${p1} का प्रभाव)`,
    },
    {
      pinnacle: 2,
      ageRange: `Age ${firstPinnacleEndAge + 1} to ${firstPinnacleEndAge + 9}`,
      ageRangeHindi: `${firstPinnacleEndAge + 1} से ${firstPinnacleEndAge + 9} वर्ष तक`,
      number: p2,
      theme: `Productive expansion under vibration of Number ${p2}`,
      themeHindi: `करियर व पारिवारिक विस्तार काल (अंक ${p2} का प्रभाव)`,
    },
    {
      pinnacle: 3,
      ageRange: `Age ${firstPinnacleEndAge + 10} to ${firstPinnacleEndAge + 18}`,
      ageRangeHindi: `${firstPinnacleEndAge + 10} से ${firstPinnacleEndAge + 18} वर्ष तक`,
      number: p3,
      theme: `Maturity & authority peak under vibration of Number ${p3}`,
      themeHindi: `परिपक्वता व सर्वोच्च सम्मान काल (अंक ${p3} का प्रभाव)`,
    },
    {
      pinnacle: 4,
      ageRange: `Age ${firstPinnacleEndAge + 19}+ onwards`,
      ageRangeHindi: `${firstPinnacleEndAge + 19} वर्ष के बाद का जीवन`,
      number: p4,
      theme: `Wisdom & lasting legacy under vibration of Number ${p4}`,
      themeHindi: `ज्ञान, संतुष्टि एवं स्थायी विरासत काल (अंक ${p4} का प्रभाव)`,
    },
  ];

  // 4 Challenges
  // C1 = |Month - Day|
  const c1 = reduceToSingleDigit(Math.abs(birthMonth - birthDay));
  // C2 = |Day - YearSum|
  const c2 = reduceToSingleDigit(Math.abs(birthDay - sumDigits(birthYear)));
  // C3 = |C1 - C2| (Major Challenge)
  const c3 = reduceToSingleDigit(Math.abs(c1 - c2));
  // C4 = |Month - YearSum|
  const c4 = reduceToSingleDigit(Math.abs(birthMonth - sumDigits(birthYear)));

  const CHALLENGE_LESSONS: Record<number, { en: string; hi: string }> = {
    0: { en: 'No major obstacle; free flow of creative karma when choosing right intent.', hi: 'कोई बड़ी बाधा नहीं; स्वतंत्र सोच व शुभ कर्मों से सहज सफलता।' },
    1: { en: 'Challenge of self-confidence; avoid depending on validation or becoming aggressive.', hi: 'आत्मविश्वास की परीक्षा; दूसरों की स्वीकृति पर निर्भर न रहें और अहंकार से बचें।' },
    2: { en: 'Challenge of oversensitivity; balance emotions and stand firm in diplomacy.', hi: 'अति-संवेदनशीलता पर नियंत्रण; भावनाओं को संतुलित रखें।' },
    3: { en: 'Challenge of scattered focus; concentrate artistic energy instead of shallow distractions.', hi: 'एकाग्रता की कमी; अपनी ऊर्जा को एक निश्चित दिशा में लगाएं।' },
    4: { en: 'Challenge of impatience with routine; master discipline and methodical diligence.', hi: 'धैर्य व अनुशासन की परीक्षा; शॉर्टकट की जगह व्यवस्थित काम करें।' },
    5: { en: 'Challenge of restlessness; avoid escapism and maintain consistency in commitments.', hi: 'चंचलता व भटकाव से बचाव; स्थिरता व संयम बनाए रखें।' },
    6: { en: 'Challenge of idealistic expectations in relationships; accept people with flaws.', hi: 'संबंधों में अति-आदर्शवाद से बचें; सबको उनकी कमजोरियों सहित स्वीकारें।' },
    7: { en: 'Challenge of cynicism and isolation; open your heart to faith and connection.', hi: 'संशय व एकाकीपन से बचें; विश्वास व आध्यात्मिक समर्पण अपनाएं।' },
    8: { en: 'Challenge of balancing material power and spiritual justice; avoid greed.', hi: 'धन व अधिकार का सही उपयोग; लोभ व अनुचित तरीकों से दूर रहें।' },
    9: { en: 'Challenge of universal forgiveness; let go of resentments to invite blessings.', hi: 'क्षमा भाव अपनाना; पुरानी कड़वाहट को त्यागें।' },
  };

  const challenges = [
    { challenge: 1, number: c1, lesson: CHALLENGE_LESSONS[c1]?.en || CHALLENGE_LESSONS[0].en, lessonHindi: CHALLENGE_LESSONS[c1]?.hi || CHALLENGE_LESSONS[0].hi },
    { challenge: 2, number: c2, lesson: CHALLENGE_LESSONS[c2]?.en || CHALLENGE_LESSONS[0].en, lessonHindi: CHALLENGE_LESSONS[c2]?.hi || CHALLENGE_LESSONS[0].hi },
    { challenge: 3, number: c3, lesson: CHALLENGE_LESSONS[c3]?.en || CHALLENGE_LESSONS[0].en, lessonHindi: CHALLENGE_LESSONS[c3]?.hi || CHALLENGE_LESSONS[0].hi },
    { challenge: 4, number: c4, lesson: CHALLENGE_LESSONS[c4]?.en || CHALLENGE_LESSONS[0].en, lessonHindi: CHALLENGE_LESSONS[c4]?.hi || CHALLENGE_LESSONS[0].hi },
  ];

  // Compound Meanings
  const mulankCompoundMeaning = COMPOUND_MEANINGS[mulankCompound] || {
    compound: mulankCompound,
    title: `Compound Number ${mulankCompound}`,
    titleHindi: `संयुक्त अंक ${mulankCompound}`,
    vibration: `Unique vibrational energy of birth day ${mulankCompound}.`,
    vibrationHindi: `जन्म तिथि ${mulankCompound} का विशिष्ट प्रभाव।`,
    isKarmicOrMaster: false,
  };

  const namankCompoundMeaning = COMPOUND_MEANINGS[namankChaldeanCompound] || {
    compound: namankChaldeanCompound,
    title: `Name Vibration ${namankChaldeanCompound}`,
    titleHindi: `नामांक संयुक्त मान ${namankChaldeanCompound}`,
    vibration: `Commercial and social aura of sum ${namankChaldeanCompound}.`,
    vibrationHindi: `नाम का संयुक्त प्रभाव एवं सामाजिक आकर्षण।`,
    isKarmicOrMaster: false,
  };

  return {
    inputName: cleanName,
    inputDob: cleanDob,
    birthDay,
    birthMonth,
    birthYear,
    mulank,
    mulankCompound,
    bhagyank,
    bhagyankCompound,
    namankChaldean,
    namankChaldeanCompound,
    namankPythagorean,
    namankPythagoreanCompound,
    soulUrgeNumber,
    personalityNumber,
    nameHarmonyScore: harmonyScore,
    nameHarmonyStatus: harmonyStatus,
    nameHarmonyStatusHindi: harmonyStatusHindi,
    nameCorrectionAdvice: adviceEn,
    nameCorrectionAdviceHindi: adviceHi,
    lettersBreakdown,
    mulankProfile,
    bhagyankProfile,
    namankProfile,
    personalYearCurrent,
    personalYearNext,
    personalMonthNumber,
    personalDayNumber,
    pinnacles,
    challenges,
    compatibilityList: compList,
    mulankCompoundMeaning,
    namankCompoundMeaning,
  };
}
