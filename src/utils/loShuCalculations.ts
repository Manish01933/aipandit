export interface ExtendedRemedyDetails {
  crystals: { en: string; hi: string };
  vastuItems: { en: string; hi: string };
  colors: { en: string; hi: string; avoid: string; avoidHi: string };
  rudrakshaBracelet: { en: string; hi: string };
  lifestyleActions: { en: string; hi: string };
  mantra: { en: string; hi: string; japaCount: string };
  affirmation: { en: string; hi: string };
  yantraOrSymbol: { en: string; hi: string };
  associatedPlanes: { en: string; hi: string }[];
}

export interface LoShuNumberInfo {
  number: number;
  title: string;
  titleHindi: string;
  element: string;
  elementHindi: string;
  direction: string;
  directionHindi: string;
  planet: string;
  planetHindi: string;
  presentTitle: string;
  presentTitleHindi: string;
  presentDesc: string;
  presentDescHindi: string;
  missingTitle: string;
  missingTitleHindi: string;
  missingDesc: string;
  missingDescHindi: string;
  repeatedTitle: string;
  repeatedTitleHindi: string;
  repeatedDesc: string;
  repeatedDescHindi: string;
  fullMeaning?: string;
  fullMeaningHindi?: string;
  remedy: string;
  remedyHindi: string;
  remediesExtended: ExtendedRemedyDetails;
}

export interface LoShuPlane {
  id: string;
  name: string;
  nameHindi: string;
  type: 'horizontal' | 'vertical' | 'diagonal';
  numbers: number[];
  percentage: number;
  status: 'Complete (100%)' | 'Partially Active' | 'Inactive (Missing)';
  statusHindi: 'पूर्ण (100%)' | 'आंशिक सक्रिय' | 'अनुपस्थित';
  significance: string;
  significanceHindi: string;
  impact: string;
  impactHindi: string;
}

export interface ElementBalanceAnalysis {
  element: 'Water' | 'Wood' | 'Fire' | 'Earth' | 'Metal';
  elementHindi: string;
  numbers: number[];
  count: number;
  status: 'Abundant (प्रचुर)' | 'Balanced (संतुलित)' | 'Weak / Missing (कमजोर / अनुपस्थित)';
  statusHindi: string;
  meaning: string;
  meaningHindi: string;
  balancingTip: string;
  balancingTipHindi: string;
  colorClass: string;
}

export interface CalculationDeepAnalysis {
  mulankInfo: {
    number: number;
    title: string;
    titleHindi: string;
    planet: string;
    planetHindi: string;
    nature: string;
    natureHindi: string;
    career: string;
    careerHindi: string;
  };
  bhagyankInfo: {
    number: number;
    title: string;
    titleHindi: string;
    planet: string;
    planetHindi: string;
    destinyPath: string;
    destinyPathHindi: string;
    lifeMission: string;
    lifeMissionHindi: string;
  };
  elementBreakdown: ElementBalanceAnalysis[];
  activeRajYogasCount: number;
  gridBalanceScore: number; // 0 - 100
  gridBalanceLevel: 'Supreme Harmony' | 'High Balance' | 'Moderate' | 'Needs Balancing';
  gridBalanceLevelHindi: string;
  keyStrengths: string[];
  keyStrengthsHindi: string[];
  growthAreas: string[];
  growthAreasHindi: string[];
  masterBalancingPlan: {
    planeId: string;
    planeName: string;
    planeNameHindi: string;
    missingNums: number[];
    percentage: number;
    howToActivate: string;
    howToActivateHindi: string;
    unlockedReward: string;
    unlockedRewardHindi: string;
  }[];
}

export interface LoShuResult {
  birthDate: string; // YYYY-MM-DD
  day: number;
  month: number;
  year: number;
  time?: string;
  name?: string;
  rawDigits: number[];
  counts: Record<number, number>; // counts of 1-9
  matrix: number[][]; // 3x3 count matrix [[4,9,2], [3,5,7], [8,1,6]]
  presentNumbers: {
    number: number;
    count: number;
    title: string;
    titleHindi: string;
    description: string;
    descriptionHindi: string;
    keywords: string[];
  }[];
  repeatedNumbers: {
    number: number;
    count: number;
    title: string;
    titleHindi: string;
    description: string;
    descriptionHindi: string;
    intensity: 'High (2x)' | 'Intense (3x)' | 'Excessive (4x+)';
    intensityHindi: 'उच्च (2 बार)' | 'प्रखर (3 बार)' | 'अति तीव्र (4+ बार)';
  }[];
  missingNumbers: {
    number: number;
    title: string;
    titleHindi: string;
    lesson: string;
    lessonHindi: string;
    remedies: {
      gemstone: string;
      color: string;
      rudraksha: string;
      vastu: string;
      habit: string;
    };
    remediesHindi: {
      gemstone: string;
      color: string;
      rudraksha: string;
      vastu: string;
      habit: string;
    };
    remediesExtended: ExtendedRemedyDetails;
  }[];
  planes: LoShuPlane[];
  mulank: number;
  bhagyank: number;
  kuaNumber?: number;
  deepAnalysis: CalculationDeepAnalysis;
}

export const LO_SHU_NUMBERS_METADATA: Record<number, LoShuNumberInfo> = {
  1: {
    number: 1,
    title: 'Self-expression and communication',
    titleHindi: 'आत्म-अभिव्यक्ति एवं संवाद',
    element: 'Water (जल)',
    elementHindi: 'जल तत्व',
    direction: 'North (उत्तर)',
    directionHindi: 'उत्तर दिशा',
    planet: 'Sun (सूर्य)',
    planetHindi: 'सूर्य देव',
    presentTitle: 'Number 1 — Self-expression and communication',
    presentTitleHindi: 'अंक 1 — आत्म-अभिव्यक्ति एवं संवाद',
    presentDesc:
      'The number of voice and individuality. Present, it gives a clear sense of self, career drive, and the confidence to speak your mind.',
    presentDescHindi:
      'यह वाणी और व्यक्तित्व का सूचक अंक है। उपस्थित होने पर यह आत्म-सम्मान, स्वतंत्र सोच, करियर में प्रगति और आत्मविश्वास से अपनी बात रखने की क्षमता प्रदान करता है।',
    missingTitle: 'Number 1 Missing — Finding Voice & Self-Confidence',
    missingTitleHindi: 'अंक 1 अनुपस्थित — आत्मविश्वास व वाणी का विकास',
    missingDesc:
      'Missing, learning to express yourself clearly, overcoming hesitation in public, and standing your ground is the primary life lesson.',
    missingDescHindi:
      'अनुपस्थित होने पर जीवन का मुख्य सबक अपनी भावनाओं को खुलकर व्यक्त करना, झिझक त्यागना, करियर में दृढ़ संकल्प बनाना और आत्मविश्वास से अपनी जगह बनाना है।',
    repeatedTitle: 'Number 1 Repeated — Strong Voice & Leadership',
    repeatedTitleHindi: 'अंक 1 पुनरावृत्त — प्रबल नेतृत्व व अधिकार',
    repeatedDesc:
      'Repeated, the will is exceptionally strong and authoritative, but can turn stubborn, overly talkative, or self-centred if not balanced.',
    repeatedDescHindi:
      'दोहराए जाने पर इच्छाशक्ति अत्यधिक प्रबल होती है। व्यक्ति प्रभावशाली वक्ता बनता है, परंतु कभी-कभी हठ या स्वयं को ही सही मानने की प्रवृत्ति आ सकती है।',
    fullMeaning:
      'The number of voice and individuality. Present, it gives a clear sense of self and the confidence to speak your mind; missing, learning to express yourself and stand your ground is the lesson; repeated, the will is strong and can turn stubborn or self-centred.',
    fullMeaningHindi:
      'यह वाणी और व्यक्तित्व का अंक है। उपस्थित होने पर यह आत्म-पहचान और आत्मविश्वास से बात रखने की शक्ति देता है; अनुपस्थित होने पर खुद को व्यक्त करना और दृढ़ रहना सीखना सबक है; दोहराए जाने पर इच्छाशक्ति अत्यंत प्रबल होती है जो हठ या आत्मकेंद्रित रूप ले सकती है।',
    remedy:
      'Place a water fountain or fish aquarium in the North direction. Wear a Brass or Red Thread wristlet, or offer water (Arghya) to the rising Sun daily.',
    remedyHindi:
      'उत्तर दिशा में छोटा जल फव्वारा या जल पात्र रखें। प्रातः काल उगते सूर्य को तांबे के लोटे से अर्घ्य दें।',
    remediesExtended: {
      crystals: {
        en: 'Ruby, Sunstone, Red Jasper, or Clear Quartz.',
        hi: 'माणिक्य (Ruby), सनस्टोन (Sunstone), रेड जैस्पर या स्फटिक क्रिस्टल।',
      },
      vastuItems: {
        en: 'Small tabletop water fountain or blue water bowl in the North direction; Brass Sun emblem on the East wall.',
        hi: 'उत्तर (North) दिशा में छोटा जल फव्वारा या नीला जल पात्र रखें; पूर्व दीवार पर पीतल का सूर्य प्रतीक लगाएं।',
      },
      colors: {
        en: 'Royal Blue, Light Blue, Bright Red, and Gold.',
        hi: 'रॉयल ब्लू, हल्का नीला, चमकदार लाल और सुनहरा।',
        avoid: 'Dull charcoal grey, faded muddy brown.',
        avoidHi: 'मटमैला भूरा एवं अत्यधिक गहरा काला रंग।',
      },
      rudrakshaBracelet: {
        en: '1-Mukhi or 12-Mukhi Rudraksha, Sunstone / Tiger Eye Energy Bracelet, Pure Copper kada on right wrist.',
        hi: '1 मुखी या 12 मुखी रुद्राक्ष, सनस्टोन / टाइगर आई ब्रेसलेट, दाहिने हाथ में तांबे का कड़ा।',
      },
      lifestyleActions: {
        en: 'Perform Surya Namaskar at sunrise, practice public speaking, actively participate in discussions, and maintain a daily goal diary.',
        hi: 'प्रातः काल सूर्य नमस्कार करें, तांबे के पात्र से जल अर्पण करें, बैठकों में खुलकर विचार रखें और दैनिक लक्ष्य डायरी बनाएं।',
      },
      mantra: {
        en: 'Om Hram Hreem Hroum Sah Suryaya Namah (108 times daily at sunrise).',
        hi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (नित्य प्रातः 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'I express my authentic truth with clarity, strength, and unwavering confidence.',
        hi: 'मैं अपनी बात स्पष्टता, निर्भयता और अटूट आत्मविश्वास के साथ व्यक्त करता हूँ।',
      },
      yantraOrSymbol: {
        en: 'Surya Yantra or North Water Flowing Wall Frame.',
        hi: 'श्री सूर्य यंत्र अथवा उत्तर दिशा में बहते जल की सुंदर तस्वीर।',
      },
      associatedPlanes: [
        { en: 'Practical / Physical Plane (8-1-6)', hi: 'व्यावहारिक / भौतिक तल (8-1-6)' },
        { en: 'Will Power Plane (9-5-1)', hi: 'इच्छाशक्ति तल (9-5-1)' },
      ],
    },
  },
  2: {
    number: 2,
    title: 'Sensitivity and relationships',
    titleHindi: 'संवेदनशीलता एवं संबंध',
    element: 'Earth (पृथ्वी)',
    elementHindi: 'पृथ्वी तत्व',
    direction: 'South-West (नैऋत्य)',
    directionHindi: 'दक्षिण-पश्चिम (नैऋत्य)',
    planet: 'Moon (चंद्र)',
    planetHindi: 'चंद्र देव',
    presentTitle: 'Number 2 — Sensitivity and relationships',
    presentTitleHindi: 'अंक 2 — संवेदनशीलता एवं संबंध',
    presentDesc:
      'The number of feeling and connection. Present, it brings empathy, intuition, domestic harmony, and an ease with people.',
    presentDescHindi:
      'यह भावना और जुड़ाव का अंक है। उपस्थित होने पर यह गहरी सहानुभूति, सहज अंतर्ज्ञान (Intuition), वैवाहिक सुख और लोगों के साथ सौहार्दपूर्ण संबंध बनाने की कला देता है।',
    missingTitle: 'Number 2 Missing — Emotional Trust & Empathy',
    missingTitleHindi: 'अंक 2 अनुपस्थित — संवेदनशीलता व धैर्य का पाठ',
    missingDesc:
      'Missing, trusting your inner instincts, staying patient in partnerships, and avoiding unnecessary emotional detachment is the key lesson.',
    missingDescHindi:
      'अनुपस्थित होने पर अपने अंतर्मन की आवाज पर भरोसा करना, रिश्तों में संवेदनशीलता व धैर्य विकसित करना और जल्दबाजी में फैसले न लेना प्रमुख सीख है।',
    repeatedTitle: 'Number 2 Repeated — Deep Intuition & Attachment',
    repeatedTitleHindi: 'अंक 2 पुनरावृत्त — अत्यधिक भावुकता व अंतर्ज्ञान',
    repeatedDesc:
      'Repeated, sensitivity runs very deep, enhancing creative intuition, but can tip into over-dependence or mood swings.',
    repeatedDescHindi:
      'अंक 2 दोहराए जाने पर व्यक्ति अत्यंत भावुक, संवेदनशील और कल्पनाशील होता है; हालांकि अति-निर्भरता या मूड स्विंग्स से बचना चाहिए।',
    fullMeaning:
      'The number of feeling and connection. Present, it brings empathy, intuition and an ease with people; missing, trusting your instincts and tending to relationships is the lesson; repeated, sensitivity runs deep and can tip into over-dependence.',
    fullMeaningHindi:
      'यह भावना और आपसी जुड़ाव का अंक है। उपस्थित होने पर यह सहानुभूति, अंतर्ज्ञान और लोगों के साथ सहजता लाता है; अनुपस्थित होने पर अपनी सहज बुद्धि पर भरोसा करना और रिश्तों को संजोना सबक है; दोहराए जाने पर संवेदनशीलता बहुत गहरी होती है जो अत्यधिक निर्भरता में बदल सकती है।',
    remedy:
      'Keep two Rose Quartz crystals or brass duck figurines in the South-West. Wear silver ornaments or a Natural Pearl/Moonstone.',
    remedyHindi:
      'घर के दक्षिण-पश्चिम कोने में दो गुलाबी क्वार्ट्ज क्रिस्टल रखें। चांदी का छल्ला या 2 मुखी रुद्राक्ष धारण करें।',
    remediesExtended: {
      crystals: {
        en: 'Natural Pearl (Moti), Moonstone, Rose Quartz, or White Agate.',
        hi: 'प्राकृतिक मोती, चंद्रकांत मणि (Moonstone), रोज़ क्वार्ट्ज या सफेद हकीक।',
      },
      vastuItems: {
        en: 'Pair of Rose Quartz ducks/hearts or ceramic clay pots in the South-West (relationship corner); crystal globe on table.',
        hi: 'दक्षिण-पश्चिम (South-West) में 2 रोज़ क्वार्ट्ज बत्तख की जोड़ी या मिट्टी का सजावटी गमला रखें।',
      },
      colors: {
        en: 'Pearl White, Cream, Silver, Light Pink, and Pale Yellow.',
        hi: 'सफेद, क्रीम, सिल्वर, हल्का गुलाबी और हल्का पीला।',
        avoid: 'Excessive harsh crimson red and jet black in sleeping quarters.',
        avoidHi: 'शयनकक्ष में अत्यधिक गहरा लाल और काला रंग।',
      },
      rudrakshaBracelet: {
        en: '2-Mukhi Rudraksha (for relationship & mind balance), Rose Quartz + Moonstone Harmony Bracelet, Pure Silver ring on little finger.',
        hi: '2 मुखी रुद्राक्ष (रिश्तों में शांति व मानसिक स्थिरता), रोज़ क्वार्ट्ज ब्रेसलेट, कनिष्ठा उंगली में चांदी का छल्ला।',
      },
      lifestyleActions: {
        en: 'Drink water from a silver vessel, seek daily blessings from your mother or elderly women, and practice 10 minutes of calm breathing.',
        hi: 'चांदी के पात्र से जल पिएं, माता अथवा वरिष्ठ महिलाओं का चरण स्पर्श कर आशीर्वाद लें, मन की चंचलता रोकने हेतु ध्यान करें।',
      },
      mantra: {
        en: 'Om Shram Shreem Shroum Sah Chandramase Namah (108 times on Monday evening).',
        hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः (सोमवार को 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'I honor my emotions, trust my intuition, and create loving, peaceful relationships.',
        hi: 'मैं अपनी भावनाओं का सम्मान करता हूँ, अंतर्मन पर भरोसा रखता हूँ और मधुर संबंध बनाता हूँ।',
      },
      yantraOrSymbol: {
        en: 'Chandra Yantra or Silver Moon Coin.',
        hi: 'श्री चंद्र यंत्र अथवा चांदी का अर्धचंद्र सिक्का।',
      },
      associatedPlanes: [
        { en: 'Mental Plane (4-9-2)', hi: 'मानसिक तल (4-9-2)' },
        { en: 'Action / Execution Plane (2-7-6)', hi: 'कर्म / क्रियान्वयन तल (2-7-6)' },
        { en: 'Silver Property Yoga (2-5-8)', hi: 'रजत / भूमि-भवन योग (2-5-8)' },
      ],
    },
  },
  3: {
    number: 3,
    title: 'Imagination and creativity',
    titleHindi: 'कल्पनाशीलता एवं रचनात्मकता',
    element: 'Wood (काष्ठ/लकड़ी)',
    elementHindi: 'काष्ठ तत्व',
    direction: 'East (पूर्व)',
    directionHindi: 'पूर्व दिशा',
    planet: 'Jupiter (बृहस्पति/गुरु)',
    planetHindi: 'देवगुरु बृहस्पति',
    presentTitle: 'Number 3 — Imagination and creativity',
    presentTitleHindi: 'अंक 3 — कल्पनाशीलता एवं रचनात्मकता',
    presentDesc:
      'The number of mind and imagination. Present, it brings creative flair, intellect, optimism, academic wisdom, and love for knowledge.',
    presentDescHindi:
      'यह बुद्धि और रचनात्मकता का अंक है। उपस्थित होने पर यह प्रखर कल्पना, आशावाद, ज्ञान-पिपासा, गुरु कृपा और उत्कृष्ट बौद्धिक समझ प्रदान करता है।',
    missingTitle: 'Number 3 Missing — Cultivating Knowledge & Focus',
    missingTitleHindi: 'अंक 3 अनुपस्थित — एकाग्रता व ज्ञानार्जन',
    missingDesc:
      'Missing, cultivating patience, learning systematically, valuing elder wisdom, and building unshakeable self-confidence is the growth area.',
    missingDescHindi:
      'अनुपस्थित होने पर नियमित अध्ययन, अनुशासन, शिक्षकों का सम्मान और अपनी क्षमताओं पर दृढ़ विश्वास बनाए रखना आवश्यक सबक है।',
    repeatedTitle: 'Number 3 Repeated — High Intellect & Expression',
    repeatedTitleHindi: 'अंक 3 पुनरावृत्त — प्रखर बुद्धि व बहुमुखी प्रतिभा',
    repeatedDesc:
      'Repeated, creative expression and mental faculties are sharp and expansive; focus must be guarded against scattered energy.',
    repeatedDescHindi:
      'दोहराए जाने पर व्यक्ति की वैचारिक क्षमता और वाकपटुता अत्यधिक प्रखर होती है। विचारों को एक दिशा में केंद्रित रखना लाभकारी होता है।',
    fullMeaning:
      'The number of mind and imagination. Present, it brings creativity, enthusiasm and a lively curiosity; missing, trusting your creative voice and maintaining focus is the lesson; repeated, the imagination is rich but can scatter or create undue worry.',
    fullMeaningHindi:
      'यह मन और कल्पना का अंक है। उपस्थित होने पर यह रचनात्मकता, उत्साह और जीवंत जिज्ञासा लाता है; अनुपस्थित होने पर अपनी रचनात्मक आवाज पर भरोसा करना और एकाग्रता बनाए रखना सबक है; दोहराए जाने पर कल्पना समृद्ध होती है परंतु ऊर्जा बिखर सकती है या अकारण चिंता उत्पन्न कर सकती है।',
    remedy:
      'Place vibrant green plants or a Tulsi plant in the East. Wear a 5-Mukhi Rudraksha or Yellow Sapphire / Citrine, and respect elders/teachers.',
    remedyHindi:
      'पूर्व दिशा में हरे पौधे या तुलसी का पौधा लगाएं। 5 मुखी रुद्राक्ष या पीला पुखराज / सिट्रीन क्रिस्टल धारण करें।',
    remediesExtended: {
      crystals: {
        en: 'Yellow Sapphire (Pukhraj), Citrine, Yellow Topaz, or Green Aventurine.',
        hi: 'पीला पुखराज (Yellow Sapphire), सिट्रीन (Citrine / सुनहला), पीला टोपाज।',
      },
      vastuItems: {
        en: 'Lush green indoor plants or holy Tulsi plant in East direction; wooden wind chime, wooden flute, green forest painting.',
        hi: 'पूर्व (East) दिशा में हरी-भरी तुलसी या हरे पौधे लगाएं; लकड़ी की बांसुरी या लकड़ी की विंड चाइम लगाएं।',
      },
      colors: {
        en: 'Bright Golden Yellow, Saffron, Light Green, and Mustard.',
        hi: 'चमकीला पीला, केसरिया, सुनहरा और हल्का हरा।',
        avoid: 'Dark dull grey and all-black attire on Thursdays.',
        avoidHi: 'गुरुवार के दिन गहरा स्लेटी और काला रंग।',
      },
      rudrakshaBracelet: {
        en: '5-Mukhi Rudraksha (blessed by Guru Jupiter), Citrine Abundance Bracelet, Gold or Brass ring on index finger.',
        hi: '5 मुखी रुद्राक्ष (देवगुरु बृहस्पति), सिट्रीन वेल्थ ब्रेसलेट, तर्जनी उंगली में पीतल या सोने का छल्ला।',
      },
      lifestyleActions: {
        en: 'Apply a subtle saffron/turmeric tilak on forehead, read wisdom books daily, and respect teachers, mentors, and elders.',
        hi: 'माथे पर केसर या हल्दी का तिलक लगाएं, प्रतिदिन 15 मिनट ज्ञानवर्धक पुस्तकें पढ़ें, गुरुजनों का आदर करें।',
      },
      mantra: {
        en: 'Om Gram Greem Groum Sah Guruve Namah (108 times on Thursday morning).',
        hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (गुरुवार प्रातः 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'My intellect is sharp, illuminated by higher wisdom, and blessed with creative clarity.',
        hi: 'मेरी बुद्धि प्रखर है, गुरु कृपा से प्रकाशित है और रचनात्मक ज्ञान से परिपूर्ण है।',
      },
      yantraOrSymbol: {
        en: 'Guru Brihaspati Yantra or Sacred Om symbol.',
        hi: 'श्री बृहस्पति यंत्र अथवा लकड़ी पर उकेरा ॐ प्रतीक।',
      },
      associatedPlanes: [
        { en: 'Thought / Planning Plane (4-3-8)', hi: 'विचार / योजना तल (4-3-8)' },
        { en: 'Emotional / Soul Plane (3-5-7)', hi: 'भावनात्मक / आत्मिक तल (3-5-7)' },
      ],
    },
  },
  4: {
    number: 4,
    title: 'Order, patience and practicality',
    titleHindi: 'अनुशासन, धैर्य एवं व्यावहारिकता',
    element: 'Wood (काष्ठ/लकड़ी)',
    elementHindi: 'काष्ठ तत्व',
    direction: 'South-East (आग्नेय)',
    directionHindi: 'दक्षिण-पूर्व (आग्नेय)',
    planet: 'Rahu (राहु)',
    planetHindi: 'राहु देव',
    presentTitle: 'Number 4 — Order, patience and practicality',
    presentTitleHindi: 'अंक 4 — अनुशासन, धैर्य एवं व्यावहारिकता',
    presentDesc:
      'The number of structure, discipline and wealth accumulation. Present, it brings practicality, financial planning, and a knack for getting things done.',
    presentDescHindi:
      'यह व्यवस्था, अनुशासन, धन संचय और क्रियान्वयन का अंक है। उपस्थित होने पर यह कार्यकुशलता, धैर्य, व्यवस्थित सोच और योजनाओं को धरातल पर उतारने की क्षमता देता है।',
    missingTitle: 'Number 4 Missing — Building System & Follow-Through',
    missingTitleHindi: 'अंक 4 अनुपस्थित — व्यवस्था व निरंतरता का विकास',
    missingDesc:
      'Missing, bringing steady method, practical organization, systematic budgeting, and consistent follow-through to your efforts is the lesson.',
    missingDescHindi:
      'अनुपस्थित होने पर कार्यों को व्यवस्थित रूप से प्रबंधित करना, आय-व्यय का हिसाब रखना और निरंतरता बनाए रखना प्रमुख अभ्यास होना चाहिए।',
    repeatedTitle: 'Number 4 Repeated — Extreme Industry & Precision',
    repeatedTitleHindi: 'अंक 4 पुनरावृत्त — कठोर परिश्रम व कार्यदक्षता',
    repeatedDesc:
      'Repeated, gives tremendous industrious stamina and meticulous eye for detail, which should be protected from turning into rigid overwork.',
    repeatedDescHindi:
      'दोहराए जाने पर कार्य के प्रति अत्यधिक समर्पण और सूक्ष्म विवरणों को परखने की अद्भुत दृष्टि मिलती है।',
    fullMeaning:
      'The number of method and the hands. Present, it brings practicality, patience and a knack for getting things done; missing, building order and follow-through is the lesson; repeated, it gives great industry that can harden into rigidity or overwork.',
    fullMeaningHindi:
      'यह विधि और हाथों के कौशल का अंक है। उपस्थित होने पर यह व्यावहारिकता, धैर्य और कार्य पूरा करने की कला देता है; अनुपस्थित होने पर सुव्यवस्था बनाना और कार्यों को पूरा करना सीखना सबक है; दोहराए जाने पर यह असाधारण परिश्रम देता है जो कठोरता या अत्यधिक कार्यबोझ में बदल सकता है।',
    remedy:
      'Keep a healthy money plant or wooden wind chime in the South-East corner. Keep a Green Jade or Hessonite gemstone.',
    remedyHindi:
      'दक्षिण-पूर्व (South-East) में मनी प्लांट या लकड़ी की विंड चाइम लगाएं। ग्रीन जेड या 8 मुखी रुद्राक्ष धारण करें।',
    remediesExtended: {
      crystals: {
        en: 'Hessonite (Gomed), Green Jade, Pyrite (Money Magnet stone), or Green Tourmaline.',
        hi: 'गोमेद (Hessonite), ग्रीन जेड (Green Jade), पाइराइट (Pyrite) या ग्रीन टूमलाइन।',
      },
      vastuItems: {
        en: 'Money plant in a green glass bottle or green pot in South-East (wealth corner); 4-tier fountain or wooden artifacts.',
        hi: 'दक्षिण-पूर्व (South-East / आग्नेय कोण) में हरी कांच की बोतल में मनी प्लांट लगाएं; 4 stalks वाला लकी बैम्बू रखें।',
      },
      colors: {
        en: 'Emerald Green, Forest Green, Earthy Olive, and Jade Green.',
        hi: 'पन्ना हरा, गहरा हरा, जैतून हरा और जेड ग्रीन।',
        avoid: 'Chaotic neon mixes and messy cluttered patterns.',
        avoidHi: 'अव्यवस्था और बेतरतीब चमकीले नियॉन रंग।',
      },
      rudrakshaBracelet: {
        en: '8-Mukhi Rudraksha, Pyrite + Green Jade Wealth & Organization Bracelet, Natural Tulsi wood beads.',
        hi: '8 मुखी रुद्राक्ष, पाइराइट + ग्रीन जेड वेल्थ ब्रेसलेट, तुलसी काष्ठ माला।',
      },
      lifestyleActions: {
        en: 'Maintain a written daily to-do list, strictly track income and expenditures, finish started projects before beginning new ones.',
        hi: 'दैनिक कार्यों की लिखित चेकलिस्ट बनाएं, खर्चों का हिसाब रखें, शुरू किए गए कार्यों को अधूरा न छोड़ें।',
      },
      mantra: {
        en: 'Om Bhram Bhreem Bhroum Sah Rahave Namah (108 times in the evening).',
        hi: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः (सायंकाल 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'I am disciplined, systematic, and manifest consistent financial stability and order.',
        hi: 'मैं अनुशासित और व्यवस्थित हूँ; मेरी मेहनत से स्थायी धन-समृद्धि निर्मित होती है।',
      },
      yantraOrSymbol: {
        en: 'Rahu Yantra or Sacred Kubera Wealth Geometry.',
        hi: 'श्री राहु यंत्र अथवा श्री कुबेर धन प्रतीक।',
      },
      associatedPlanes: [
        { en: 'Mental Plane (4-9-2)', hi: 'मानसिक तल (4-9-2)' },
        { en: 'Thought / Planning Plane (4-3-8)', hi: 'विचार / योजना तल (4-3-8)' },
        { en: 'Golden Raj Yoga (4-5-6)', hi: 'स्वर्ण राजयोग (4-5-6)' },
      ],
    },
  },
  5: {
    number: 5,
    title: 'Will, balance and adaptability',
    titleHindi: 'इच्छाशक्ति, संतुलन एवं अनुकूलनशीलता',
    element: 'Earth (पृथ्वी/केंद्र)',
    elementHindi: 'पृथ्वी तत्व (ब्रह्मस्थान)',
    direction: 'Center (ब्रह्मस्थान)',
    directionHindi: 'केंद्र (ब्रह्मस्थान)',
    planet: 'Mercury (बुध)',
    planetHindi: 'बुध देव',
    presentTitle: 'Number 5 — Will, balance and adaptability',
    presentTitleHindi: 'अंक 5 — इच्छाशक्ति, संतुलन एवं अनुकूलनशीलता',
    presentDesc:
      'The centre of the grid, the master pivot of balance. Present, it gives drive, emotional balance, business sense, adaptability, and resilience.',
    presentDescHindi:
      'लो शू ग्रिड का केंद्र बिंदु, संतुलन की धुरी। उपस्थित होने पर यह जीवन में संतुलन, त्वरित निर्णय क्षमता, व्यापारिक बुद्धि, इच्छाशक्ति और हर परिस्थिति में सफलता देता है।',
    missingTitle: 'Number 5 Missing — Centering Drive & Emotional Stability',
    missingTitleHindi: 'अंक 5 अनुपस्थित — जीवन में संतुलन व स्थिरता',
    missingDesc:
      'Missing, finding personal balance, avoiding extreme fluctuations, grounding your goals, and keeping a steady center is the lesson.',
    missingDescHindi:
      'अनुपस्थित होने पर मन में भटकाव या निर्णय में अनिश्चय आ सकता है; अतः जीवन में स्थिरता, केंद्रित दृष्टिकोण और नियमित दिनचर्या विकसित करना लक्ष्य होना चाहिए।',
    repeatedTitle: 'Number 5 Repeated — Dynamic Will & Freedom',
    repeatedTitleHindi: 'अंक 5 पुनरावृत्त — असीम ऊर्जा व स्वतंत्रता प्रियता',
    repeatedDesc:
      'Repeated, the willpower and versatility are very powerful, but can become headstrong, impatient, or restless.',
    repeatedDescHindi:
      'दोहराए जाने पर स्वतंत्र विचार, तीव्र व्यापारिक बुद्धि और असीम ऊर्जा मिलती है; अधीरता से बचना श्रेयस्कर है।',
    fullMeaning:
      'The centre of the grid, the point of balance. Present, it gives drive, adaptability and a steady core; missing, finding balance and direction is the lesson; repeated, the will is powerful and can become headstrong or restless.',
    fullMeaningHindi:
      'ग्रिड का केंद्र बिंदु, संतुलन का आधार। उपस्थित होने पर यह कर्मठता, अनुकूलनशीलता और एक दृढ़ आधार देता है; अनुपस्थित होने पर जीवन में संतुलन और सही दिशा खोजना सबक है; दोहराए जाने पर इच्छाशक्ति बहुत शक्तिशाली होती है जो हठधर्मिता या अशांति का रूप ले सकती है।',
    remedy:
      'Keep the central area (Brahmasthan) of your home clutter-free. Wear Emerald (पन्ना) or Green Aventurine, and chant Budh Mantra.',
    remedyHindi:
      'घर के मध्य भाग को स्वच्छ व खुला रखें। पन्ना (Emerald) रत्न या ग्रीन एवेंट्यूरिन ब्रेसलेट धारण करें।',
    remediesExtended: {
      crystals: {
        en: 'Natural Emerald (Panna), Green Aventurine, Peridot, or 7-Chakra balancing crystal.',
        hi: 'प्राकृतिक पन्ना (Emerald), ग्रीन एवेंट्यूरिन, पेरिडॉट या 7-चक्र संतुलन क्रिस्टल।',
      },
      vastuItems: {
        en: 'Keep the central area (Brahmasthan) of the house open, clean, and bright; hang a crystal ball or brass sun in the center to circulate positive energy.',
        hi: 'घर के बिल्कुल मध्य भाग (ब्रह्मस्थान) को खुला, हवादार और साफ-सुथरा रखें; मध्य में क्रिस्टल बॉल या पीतल का सूर्य लटकाएं।',
      },
      colors: {
        en: 'Parrot Green, Grass Green, Turquoise, and Golden Earthy Ochre.',
        hi: 'तोतिया हरा, घास जैसा हरा, फिरोज़ा और हल्का पीला।',
        avoid: 'Clashing extreme dark colors in workspace.',
        avoidHi: 'कार्यस्थल पर अत्यधिक गहरे और भारी रंग।',
      },
      rudrakshaBracelet: {
        en: '4-Mukhi or 10-Mukhi Rudraksha, Green Aventurine + Tiger Eye Balance Bracelet, Panchadhatu ring on little finger.',
        hi: '4 मुखी या 10 मुखी रुद्राक्ष, ग्रीन एवेंट्यूरिन ब्रेसलेट, कनिष्ठा उंगली में पंचधातु छल्ला।',
      },
      lifestyleActions: {
        en: 'Feed green grass or fresh spinach to cows on Wednesdays, practice 5 minutes of grounding meditation, communicate with gentleness.',
        hi: 'बुधवार को गाय को हरा चारा या पालक खिलाएं, प्रतिदिन 5 मिनट शांत बैठकर ध्यान करें, वाणी में सौम्यता रखें।',
      },
      mantra: {
        en: 'Om Bram Breem Broum Sah Budhaya Namah (108 times on Wednesday morning).',
        hi: 'ॐ ब्रां ग्रीं ग्रौं सः बुधाय नमः (बुधवार प्रातः 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'I am centered, adaptable, and gracefully balanced in all aspects of life.',
        hi: 'मैं पूर्णतः संतुलित और शांत हूँ; जीवन के हर मोड़ पर सही निर्णय लेता हूँ।',
      },
      yantraOrSymbol: {
        en: 'Budh Yantra or Sacred 3D Meru Crystal Pyramid.',
        hi: 'श्री बुध यंत्र अथवा स्फटिक श्री मेरु पिरामिड।',
      },
      associatedPlanes: [
        { en: 'Emotional / Soul Plane (3-5-7)', hi: 'भावनात्मक / आत्मिक तल (3-5-7)' },
        { en: 'Will Power Plane (9-5-1)', hi: 'इच्छाशक्ति तल (9-5-1)' },
        { en: 'Golden Raj Yoga (4-5-6)', hi: 'स्वर्ण राजयोग (4-5-6)' },
        { en: 'Silver Property Yoga (2-5-8)', hi: 'रजत / भूमि-भवन योग (2-5-8)' },
      ],
    },
  },
  6: {
    number: 6,
    title: 'Home, love and responsibility',
    titleHindi: 'पारिवारिक प्रेम, गृह एवं उत्तरदायित्व',
    element: 'Metal (धातु)',
    elementHindi: 'धातु तत्व',
    direction: 'North-West (वायव्य)',
    directionHindi: 'उत्तर-पश्चिम (वायव्य)',
    planet: 'Venus (शुक्र)',
    planetHindi: 'शुक्र देव',
    presentTitle: 'Number 6 — Home, love and responsibility',
    presentTitleHindi: 'अंक 6 — पारिवारिक प्रेम, गृह एवं उत्तरदायित्व',
    presentDesc:
      'The number of the heart, home, and worldly luxury. Present, it brings warmth, supportive friends, aesthetic grace, and luxury.',
    presentDescHindi:
      'यह हृदय, परिवार, सहयोगी मित्रों और भौतिक ऐश्वर्य का अंक है। उपस्थित होने पर यह पारिवारिक सुख, उत्तरदायित्व, ऐश्वर्य और दूसरों की देखभाल की सहज प्रेरणा देता है।',
    missingTitle: 'Number 6 Missing — Opening Heart & Domestic Harmony',
    missingTitleHindi: 'अंक 6 अनुपस्थित — प्रेम, सौहार्द व उत्तरदायित्व',
    missingDesc:
      'Missing, the lesson is to invite supportive friends, value luxury without guilt, and nurture domestic life with dedicated love.',
    missingDescHindi:
      'अनुपस्थित होने पर दूसरों से सहयोग स्वीकार करना सीखना, घर की सुंदरता बढ़ाना और पारिवारिक बंधनों को स्नेह व समय देना महत्वपूर्ण सीख है।',
    repeatedTitle: 'Number 6 Repeated — Deep Devotion & Nurturing',
    repeatedTitleHindi: 'अंक 6 पुनरावृत्त — गहरा पारिवारिक समर्पण व ऐश्वर्य',
    repeatedDesc:
      'Repeated, devotion and protective instincts are massive; beware of over-controlling loved ones or excessive worry.',
    repeatedDescHindi:
      'दोहराए जाने पर व्यक्ति अपनों के प्रति अत्यधिक समर्पित और कला-प्रेमी होता है; अत्यधिक चिंता करने से बचना चाहिए।',
    fullMeaning:
      'The number of the heart and the home. Present, it brings warmth, care and a sense of responsibility for others; missing, the lesson is to open the heart and accept care as well as give it; repeated, devotion is strong and can slip into worry or control.',
    fullMeaningHindi:
      'यह हृदय और गृहस्थी का अंक है। उपस्थित होने पर यह स्नेह, देखभाल और दूसरों के प्रति जिम्मेदारी की भावना लाता है; अनुपस्थित होने पर हृदय खोलना और स्नेह देने के साथ स्वीकार करना भी सीखना सबक है; दोहराए जाने पर समर्पण अत्यधिक गहरा होता है जो चिंता या नियंत्रण में बदल सकता है।',
    remedy:
      'Hang a 6-rod metallic wind chime in the North-West. Wear a Diamond, White Zircon, or 6-Mukhi Rudraksha, and respect women.',
    remedyHindi:
      'उत्तर-पश्चिम में 6 छड़ों वाली धातु की विंड चाइम लगाएं। 6 मुखी रुद्राक्ष या श्वेत जरकन / स्फटिक माला धारण करें।',
    remediesExtended: {
      crystals: {
        en: 'Natural Diamond, White Zircon, Opal, Clear Quartz (Sphatik), or Selenite.',
        hi: 'सफेद जरकन (White Zircon), ओपल (Opal), स्फटिक (Sphatik) या सेलेनाइट क्रिस्टल।',
      },
      vastuItems: {
        en: '6-pipe hollow metal/silver wind chime in North-West (helpful people/travel corner); bowl with fresh water and fragrant white flowers.',
        hi: 'उत्तर-पश्चिम (North-West) में 6 छड़ों वाली धातु की विंड चाइम लगाएं; सफेद संगमरमर की कलाकृति रखें।',
      },
      colors: {
        en: 'Glittering White, Silver, Cream, Light Rose Pink, and Lilac.',
        hi: 'चमकदार सफेद, सिल्वर, क्रीम, हल्का गुलाबी और लैवेंडर।',
        avoid: 'Torn, unwashed, or faded clothes.',
        avoidHi: 'मैले-कुचैले या फटे हुए वस्त्र पहनना।',
      },
      rudrakshaBracelet: {
        en: '6-Mukhi Rudraksha (ruled by Lord Kartikeya & Venus), Clear Quartz Sphatik Mala / Luxury Attraction Bracelet, Silver Kada on wrist.',
        hi: '6 मुखी रुद्राक्ष (शुक्र देव व भगवान कार्तिकेय), स्फटिक माला / ब्रेसलेट, हाथ में चांदी का कड़ा।',
      },
      lifestyleActions: {
        en: 'Use pleasant natural perfumes daily, treat your partner and women with highest respect, maintain a beautiful and fragrant home.',
        hi: 'नित्य सुगंधित इत्र (Perfume) का प्रयोग करें, महिलाओं का विशेष सम्मान करें, घर को सुरुचिपूर्ण व सुवासित रखें।',
      },
      mantra: {
        en: 'Om Shum Shukraya Namah (108 times on Friday morning).',
        hi: 'ॐ शुं शुक्राय नमः (शुक्रवार प्रातः 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'I attract unconditional love, prosperity, supportive mentors, and refined luxury effortlessly.',
        hi: 'मैं प्रेम, सुख-समृद्धि, सहयोगी मित्रों और ऐश्वर्य को सहजता से आकर्षित करता हूँ।',
      },
      yantraOrSymbol: {
        en: 'Shukra Yantra or Silver Peacock symbol.',
        hi: 'श्री शुक्र यंत्र अथवा चांदी का मयूर प्रतीक।',
      },
      associatedPlanes: [
        { en: 'Practical / Physical Plane (8-1-6)', hi: 'व्यावहारिक / भौतिक तल (8-1-6)' },
        { en: 'Action / Execution Plane (2-7-6)', hi: 'कर्म / क्रियान्वयन तल (2-7-6)' },
        { en: 'Golden Raj Yoga (4-5-6)', hi: 'स्वर्ण राजयोग (4-5-6)' },
      ],
    },
  },
  7: {
    number: 7,
    title: 'Patience, spirituality and sacrifice',
    titleHindi: 'धैर्य, आध्यात्मिकता एवं आंतरिक विकास',
    element: 'Metal (धातु)',
    elementHindi: 'धातु तत्व',
    direction: 'West (पश्चिम)',
    directionHindi: 'पश्चिम दिशा',
    planet: 'Ketu (केतु)',
    planetHindi: 'केतु देव',
    presentTitle: 'Number 7 — Patience, spirituality and sacrifice',
    presentTitleHindi: 'अंक 7 — धैर्य, आध्यात्मिकता एवं आंतरिक विकास',
    presentDesc:
      'The number of inner growth and experiential wisdom. Present, it brings research mindset, occult insight, intuition, and spiritual grace.',
    presentDescHindi:
      'यह गहन चिंतन और आत्म-विकास का अंक है। उपस्थित होने पर यह शोध-दृष्टि, धैर्य, दार्शनिक सोच, संतान सुख और आध्यात्मिक अभिरुचि प्रदान करता है।',
    missingTitle: 'Number 7 Missing — Inner Reflection & Life Wisdom',
    missingTitleHindi: 'अंक 7 अनुपस्थित — आध्यात्मिक चिंतन व धैर्य',
    missingDesc:
      'Missing, the lesson is to seek higher meaning, learn from past life experiences, embrace meditation, and practice unconditional trust.',
    missingDescHindi:
      'अनुपस्थित होने पर जीवन के अनुभवों से सबक लेना, ध्यान-योग अपनाना, संतान व परिवार के साथ आत्मीयता और धैर्यपूर्वक आगे बढ़ना जरूरी होता है।',
    repeatedTitle: 'Number 7 Repeated — Rich Inner Life & Wisdom',
    repeatedTitleHindi: 'अंक 7 पुनरावृत्त — गहन दार्शनिक चिंतन',
    repeatedDesc:
      'Repeated, the inner philosophical life is exceptionally rich; beware of becoming overly introspective or detached from society.',
    repeatedDescHindi:
      'दोहराए जाने पर व्यक्ति अत्यंत गूढ़ विचारक, अंतर्मुखी और अनुभवी होता है; समाज से अलग-थलग होने से बचना चाहिए।',
    fullMeaning:
      'The number of inner growth, often deepened through experience. Present, it brings reflection, patience and a spiritual streak; missing, the lesson is to seek meaning and learn through life’s tests; repeated, the inner life is rich but can turn withdrawn.',
    fullMeaningHindi:
      'यह आंतरिक विकास का अंक है जो अक्सर अनुभवों से परिपक्व होता है। उपस्थित होने पर यह आत्म-चिंतन, धैर्य और आध्यात्मिक झुकाव लाता है; अनुपस्थित होने पर जीवन की परीक्षाओं से सीख लेकर अर्थ खोजना सबक है; दोहराए जाने पर आंतरिक जीवन बहुत समृद्ध होता है परंतु व्यक्ति समाज से कट सकता है।',
    remedy:
      'Place metal bells or silver accessories in the West. Wear a Cat’s Eye gemstone (लहसुनिया) or 9-Mukhi Rudraksha.',
    remedyHindi:
      'पश्चिम दिशा में चांदी का सिक्का या धातु का कलश रखें। 9 मुखी रुद्राक्ष या लहसुनिया (Cat’s Eye) धारण करें।',
    remediesExtended: {
      crystals: {
        en: 'Cat’s Eye (Lehsuniya), Labradorite, Amethyst, or Smoky Quartz.',
        hi: 'लहसुनिया (Cat’s Eye), लैब्राडोराइट, एमेथिस्ट या स्मोकी क्वार्ट्ज।',
      },
      vastuItems: {
        en: 'Metal wall clock, round metallic mirror, or Tibetan singing bowl in the West direction; brass bell near entrance.',
        hi: 'पश्चिम (West) दिशा में गोल धातु की घड़ी, चांदी का सिक्का या धातु का सिंगिंग बाउल रखें।',
      },
      colors: {
        en: 'Pure White, Metallic Grey, Silver, Light Lavender, and Smoky Grey.',
        hi: 'सफेद, मैटेलिक ग्रे, सिल्वर और हल्का लैवेंडर।',
        avoid: 'Excessive dark murky shadows in study rooms.',
        avoidHi: 'अध्ययन कक्ष में धुंधले और उदास रंग।',
      },
      rudrakshaBracelet: {
        en: '9-Mukhi Rudraksha (blessed by Maa Durga & Ketu), Labradorite Intuition Bracelet, Silver ring on ring finger.',
        hi: '9 मुखी रुद्राक्ष (मां भगवती दुर्गा), लैब्राडोराइट अंतर्ज्ञान ब्रेसलेट, अनामिका उंगली में चांदी का छल्ला।',
      },
      lifestyleActions: {
        en: 'Feed stray dogs (especially black or spotted dogs) on Saturdays, dedicate 10 minutes to silent mindfulness, maintain gratitude.',
        hi: 'शनिवार को श्वान (कुत्तों) को भोजन या मीठी रोटी दें, प्रतिदिन 10 मिनट मौन ध्यान करें, अध्यात्म में रुचि लें।',
      },
      mantra: {
        en: 'Om Sram Sreem Sroum Sah Ketave Namah (108 times at dusk).',
        hi: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः (सायंकाल 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'I trust the divine wisdom within me; my mind is peaceful, intuitive, and spiritually aligned.',
        hi: 'मेरी अंतरात्मा दिव्य ज्ञान से आलोकित है; मेरा मन शांत और आध्यात्मिक रूप से सजग है।',
      },
      yantraOrSymbol: {
        en: 'Ketu Yantra or Sacred Tibetan Metal Bell.',
        hi: 'श्री केतु यंत्र अथवा धातु की पवित्र घंटी।',
      },
      associatedPlanes: [
        { en: 'Emotional / Soul Plane (3-5-7)', hi: 'भावनात्मक / आत्मिक तल (3-5-7)' },
        { en: 'Action / Execution Plane (2-7-6)', hi: 'कर्म / क्रियान्वयन तल (2-7-6)' },
      ],
    },
  },
  8: {
    number: 8,
    title: 'Method, organisation and duty',
    titleHindi: 'कार्यप्रणाली, संगठन एवं कर्तव्यनिष्ठा',
    element: 'Earth (पृथ्वी)',
    elementHindi: 'पृथ्वी तत्व',
    direction: 'North-East (ईशान)',
    directionHindi: 'उत्तर-पूर्व (ईशान)',
    planet: 'Saturn (शनि)',
    planetHindi: 'शनि देव',
    presentTitle: 'Number 8 — Method, organisation and duty',
    presentTitleHindi: 'अंक 8 — कार्यप्रणाली, संगठन एवं कर्तव्यनिष्ठा',
    presentDesc:
      'The number of structure, karma, and enduring wealth. Present, it brings organisation, duty, patience to build over time, and real-estate prosperity.',
    presentDescHindi:
      'यह कर्म, अनुशासन, न्याय और स्थायी संपत्ति का अंक है। उपस्थित होने पर यह संगठन क्षमता, कर्तव्यपरायणता, वित्तीय प्रबंधन और दीर्घकालिक सफलता की नींव रखता है।',
    missingTitle: 'Number 8 Missing — Practical Discipline & Organization',
    missingTitleHindi: 'अंक 8 अनुपस्थित — वित्तीय अनुशासन व धैर्य',
    missingDesc:
      'Missing, the lesson is to bring method, steady discipline, long-term asset building, and systematic patience to all personal efforts.',
    missingDescHindi:
      'अनुपस्थित होने पर धन प्रबंधन में सावधानी, नियमित श्रम, जल्द अमीर बनने के लालच से बचना और योजनाओं को पूरा करने का अभ्यास जरूरी है।',
    repeatedTitle: 'Number 8 Repeated — Intense Drive & Organization',
    repeatedTitleHindi: 'अंक 8 पुनरावृत्त — अखंड कर्मठता व नेतृत्व',
    repeatedDesc:
      'Repeated, drive, order, and perseverance are supreme; take care not to become overly rigid or excessively exacting.',
    repeatedDescHindi:
      'दोहराए जाने पर असाधारण कर्मठता और प्रबंधन शक्ति मिलती है; अत्यधिक कठोर होने से बचें।',
    fullMeaning:
      'The number of structure and discipline. Present, it brings organisation, a sense of duty, hard work, and the patience to build over time; missing, learning systematic discipline and careful management is the lesson; repeated, the drive is immense but can turn rigid, materialistic, or restless.',
    fullMeaningHindi:
      'यह संरचना और अनुशासन का अंक है। उपस्थित होने पर यह संगठन, कर्तव्य की भावना, कड़ी मेहनत और धैर्य से निर्माण की क्षमता लाता है; अनुपस्थित होने पर व्यवस्थित अनुशासन और प्रबंधन सीखना सबक है; दोहराए जाने पर कर्मठता अपार होती है जो कठोरता या अशांति में बदल सकती है।',
    remedy:
      'Keep North-East corner clean and lit with a blue or crystal element. Wear Blue Sapphire / Amethyst, or help hardworking laborers.',
    remedyHindi:
      'ईशान कोण को बिल्कुल स्वच्छ रखें। 7 मुखी रुद्राक्ष या एमेथिस्ट (जामुनिया) ब्रेसलेट धारण करें और जरूरतमंदों की सहायता करें।',
    remediesExtended: {
      crystals: {
        en: 'Blue Sapphire (Neelam), Amethyst (Jamunia), Lapis Lazuli, or Black Tourmaline.',
        hi: 'नीलम (Blue Sapphire), जामुनिया (Amethyst), लाजवर्त (Lapis Lazuli) या ब्लैक टूमलाइन।',
      },
      vastuItems: {
        en: 'Keep North-East (Ishaan corner) absolutely clean and elevated; place a blue crystal globe or clean water urn with crystal stones.',
        hi: 'ईशान कोण (North-East) को अत्यंत स्वच्छ, खुला और पवित्र रखें; वहां स्फटिक पिरामिड या नीले पत्थर का सजावटी पात्र रखें।',
      },
      colors: {
        en: 'Royal Navy Blue, Indigo, Charcoal Blue, and Deep Violet.',
        hi: 'गहरा नीला (Navy Blue), इंडिगो, जामुनी और गहरा आसमानी।',
        avoid: 'Loud flashy neon hues when planning critical investments.',
        avoidHi: 'महत्वपूर्ण निर्णय लेते समय अत्यधिक भड़कीले रंग।',
      },
      rudrakshaBracelet: {
        en: '7-Mukhi or 14-Mukhi Rudraksha (Goddess Mahalakshmi / Saturn), Amethyst + Lapis Lazuli Focus Bracelet, Iron ring on middle finger.',
        hi: '7 मुखी रुद्राक्ष (महालक्ष्मी व शनि देव), एमेथिस्ट ब्रेसलेट, मध्यमा उंगली में घोड़े की नाल का छल्ला।',
      },
      lifestyleActions: {
        en: 'Help manual workers, sweepers, and underprivileged people on Saturdays; strictly respect promises; light a mustard oil diya under Peepal tree.',
        hi: 'शनिवार को श्रमिकों व निर्धनों को भोजन या सहायता दें, अपने वचनों और समय का पालन करें, शनिवार शाम पीपल के नीचे सरसों के तेल का दीपक जलाएं।',
      },
      mantra: {
        en: 'Om Sham Shanaishcharaya Namah (108 times on Saturday evening).',
        hi: 'ॐ शं शनैश्चराय नमः (शनिवार सायंकाल 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'My patience, disciplined labor, and ethical integrity create unbreakable prosperity and honor.',
        hi: 'मेरा धैर्य, अनुशासन और निष्ठावान कर्म मुझे अटूट धन-समृद्धि और सम्मान प्रदान करते हैं।',
      },
      yantraOrSymbol: {
        en: 'Shani Yantra or Sacred Shani Mudrika.',
        hi: 'श्री शनि यंत्र अथवा पवित्र शनि मुद्रिका।',
      },
      associatedPlanes: [
        { en: 'Thought / Planning Plane (4-3-8)', hi: 'विचार / योजना तल (4-3-8)' },
        { en: 'Practical / Physical Plane (8-1-6)', hi: 'व्यावहारिक / भौतिक तल (8-1-6)' },
        { en: 'Silver Property Yoga (2-5-8)', hi: 'रजत / भूमि-भवन योग (2-5-8)' },
      ],
    },
  },
  9: {
    number: 9,
    title: 'Intellect, ambition and humanity',
    titleHindi: 'बुद्धिमत्ता, महत्वाकांक्षा एवं मानवता',
    element: 'Fire (अग्नि)',
    elementHindi: 'अग्नि तत्व',
    direction: 'South (दक्षिण)',
    directionHindi: 'दक्षिण दिशा',
    planet: 'Mars (मंगल)',
    planetHindi: 'मंगल देव',
    presentTitle: 'Number 9 — Intellect, ambition and humanity',
    presentTitleHindi: 'अंक 9 — बुद्धिमत्ता, महत्वाकांक्षा एवं मानवता',
    presentDesc:
      'The number of vision, fame, and courage. Present, it brings intellect, ambition, humanitarian passion, and leadership status in society.',
    presentDescHindi:
      'यह ऊर्जा, शौर्य, मान-प्रतिष्ठा और परोपकार का अंक है। उपस्थित होने पर यह उच्च बौद्धिक दृष्टि, समाज में यश, महत्वाकांक्षा और नेतृत्व शक्ति देता है।',
    missingTitle: 'Number 9 Missing — Broadening Vision & Compassion',
    missingTitleHindi: 'अंक 9 अनुपस्थित — उदारता व व्यापक दृष्टिकोण',
    missingDesc:
      'Missing, the lesson is to widen your view, develop public courage, manage sudden anger, and act for higher social purpose.',
    missingDescHindi:
      'अनुपस्थित होने पर व्यापक दृष्टिकोण अपनाना, समाज में पहचान बनाने का आत्मविश्वास जुटाना, क्रोध पर नियंत्रण रखना और परोपकार करना मुख्य सीख है।',
    repeatedTitle: 'Number 9 Repeated — Flaming Ambition & Energy',
    repeatedTitleHindi: 'अंक 9 पुनरावृत्त — प्रखर पराक्रम व महत्वाकांक्षा',
    repeatedDesc:
      'Repeated, ambition burns bright and passionate; channeling energy constructively prevents aggression or burnout.',
    repeatedDescHindi:
      'दोहराए जाने पर अदम्य साहस और नेतृत्व क्षमता मिलती है; ऊर्जा को सकारात्मक रचनात्मक दिशा में लगाना चाहिए।',
    fullMeaning:
      'The number of vision and the wider world. Present, it brings intellect, ambition and deep care for humanity; missing, discovering higher purpose, selflessness and empathy is the lesson; repeated, idealism runs very high and can slip into restlessness, impatience, or unrealistic expectations.',
    fullMeaningHindi:
      'यह दूरदर्शिता और व्यापक जगत का अंक है। उपस्थित होने पर यह बुद्धि, महत्वाकांक्षा और मानवता के प्रति गहरा समर्पण लाता है; अनुपस्थित होने पर उच्च उद्देश्य, निस्वार्थ भाव और सहानुभूति खोजना सबक है; दोहराए जाने पर आदर्शवाद बहुत तीव्र होता है जो अधीरता या अव्यावहारिक अपेक्षाओं में बदल सकता है।',
    remedy:
      'Place a red lamp or Mars pyramid in the South. Wear a Red Coral (मूंगा) or 3-Mukhi Rudraksha, and engage in charity.',
    remedyHindi:
      'दक्षिण दिशा में लाल बल्ब या लाल पिरामिड लगाएं। 3 मुखी रुद्राक्ष या मूंगा (Red Coral) धारण करें।',
    remediesExtended: {
      crystals: {
        en: 'Natural Red Coral (Moonga), Carnelian, Red Jasper, or Garnet.',
        hi: 'प्राकृतिक मूंगा (Red Coral), कार्नेलियन (Carnelian), रेड जैस्पर या गार्नेट।',
      },
      vastuItems: {
        en: 'Red night lamp or copper pyramid in the South direction; picture of 7 running white horses (facing inside room) on South wall.',
        hi: 'दक्षिण (South) दिशा में लाल रंग का नाइट लैंप या तांबे का पिरामिड लगाएं; दक्षिण दीवार पर 7 दौड़ते घोड़ों का चित्र लगाएं।',
      },
      colors: {
        en: 'Vibrant Scarlet Red, Crimson, Rust Orange, and Maroon.',
        hi: 'चटक लाल, सिंदूरी, गहरा नारंगी और मैरून।',
        avoid: 'Complete pitch black when presenting or attending public events.',
        avoidHi: 'महत्वपूर्ण सामाजिक अवसरों पर पूर्णतः काला वस्त्र।',
      },
      rudrakshaBracelet: {
        en: '3-Mukhi Rudraksha (ruled by Lord Agni & Mars), Red Carnelian Courage Bracelet, Pure Copper kada on right wrist.',
        hi: '3 मुखी रुद्राक्ष (अग्नि देव व मंगल देव), रेड कार्नेलियन ब्रेसलेट, दाहिने हाथ में तांबे का कड़ा।',
      },
      lifestyleActions: {
        en: 'Do daily physical workouts or yoga, donate blood or red lentils (Masoor Dal) on Tuesdays, stand up for righteous causes without losing temper.',
        hi: 'नियमित व्यायाम या खेलकूद करें, मंगलवार को मसूर दाल का दान करें, समाज सेवा करें और क्रोध पर नियंत्रण रखें।',
      },
      mantra: {
        en: 'Om Kram Kreem Kroum Sah Bhaumaya Namah (108 times on Tuesday morning).',
        hi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः (मंगलवार प्रातः 108 बार जपें)।',
        japaCount: '108 Japa',
      },
      affirmation: {
        en: 'I am bold, energized, and lead with compassion, honor, and extraordinary courage.',
        hi: 'मैं ऊर्जावान, पराक्रमी और निडर हूँ; मेरा नेतृत्व समाज में यश और सकारात्मक परिवर्तन लाता है।',
      },
      yantraOrSymbol: {
        en: 'Mangal Yantra or Sacred Copper Mars Triangle.',
        hi: 'श्री मंगल यंत्र अथवा तांबे का त्रिकोण यंत्र।',
      },
      associatedPlanes: [
        { en: 'Mental Plane (4-9-2)', hi: 'मानसिक तल (4-9-2)' },
        { en: 'Will Power Plane (9-5-1)', hi: 'इच्छाशक्ति तल (9-5-1)' },
      ],
    },
  },
};

export const LO_SHU_PLANES_DEF = [
  // Horizontal Planes
  {
    id: 'mental',
    name: 'Mental Plane (4-9-2)',
    nameHindi: 'मानसिक तल (4-9-2)',
    type: 'horizontal' as const,
    numbers: [4, 9, 2],
    significance: 'Governs intellectual memory, analytical thinking, logic, and deep thought processing.',
    significanceHindi: 'तीक्ष्ण स्मरण शक्ति, तार्किक चिंतन, बौद्धिक विश्लेषण और गहरी सोच का प्रतीक।',
    impact: 'Sharp retention, excellent problem solving, strong academic or strategic capability.',
    impactHindi: 'उत्कृष्ट स्मरण शक्ति, त्वरित निर्णय क्षमता और जटिल समस्याओं को सुलझाने में निपुणता।',
  },
  {
    id: 'emotional',
    name: 'Emotional / Soul Plane (3-5-7)',
    nameHindi: 'भावनात्मक / आत्मिक तल (3-5-7)',
    type: 'horizontal' as const,
    numbers: [3, 5, 7],
    significance: 'Governs heart feelings, spiritual intuition, empathy, and artistic balance.',
    significanceHindi: 'हृदय की भावनाएं, आत्मिक अंतर्ज्ञान, संवेदनशीलता और कलात्मक संतुलन।',
    impact: 'Deep empathy, powerful intuitive hunches, emotional resilience, magnetic spiritual aura.',
    impactHindi: 'गहरी संवेदनशीलता, अचूक अंतर्ज्ञान और विषम परिस्थितियों में आत्मिक संतुलन बनाए रखने की शक्ति।',
  },
  {
    id: 'practical',
    name: 'Practical / Physical Plane (8-1-6)',
    nameHindi: 'व्यावहारिक / भौतिक तल (8-1-6)',
    type: 'horizontal' as const,
    numbers: [8, 1, 6],
    significance: 'Governs physical stamina, commercial execution, material abundance, and real-world tools.',
    significanceHindi: 'शारीरिक सामर्थ्य, व्यावहारिक क्रियान्वयन, धन-समृद्धि और कार्य निष्पादन।',
    impact: 'Hands-on practicality, business flair, ability to monetize skills and manifest tangible success.',
    impactHindi: 'व्यावहारिक कार्यकुशलता, व्यापारिक सफलता और विचारों को भौतिक जगत में साकार करने की क्षमता।',
  },

  // Vertical Planes
  {
    id: 'thought',
    name: 'Thought / Planning Plane (4-3-8)',
    nameHindi: 'विचार / योजना तल (4-3-8)',
    type: 'vertical' as const,
    numbers: [4, 3, 8],
    significance: 'Governs strategic planning, foresight, structuring ideas, and vision.',
    significanceHindi: 'दूरदर्शिता, रणनीतिक योजना, विचारशीलता और भविष्य की रूपरेखा तैयार करना।',
    impact: 'Exceptional visionary planner, architects of grand ideas, systematic strategists.',
    impactHindi: 'उत्कृष्ट रणनीतिकार, दूरदर्शी योजनाकार और व्यवस्थित रूप से कार्य करने की क्षमता।',
  },
  {
    id: 'will',
    name: 'Will Power Plane (9-5-1)',
    nameHindi: 'इच्छाशक्ति तल (9-5-1)',
    type: 'vertical' as const,
    numbers: [9, 5, 1],
    significance: 'Governs determination, grit, perseverance, courage, and unyielding will.',
    significanceHindi: 'दृढ़ इच्छाशक्ति, अदम्य साहस, संकल्प और विपरीत परिस्थितियों में अडिग रहने का बल।',
    impact: 'Unstoppable perseverance; turns setbacks into stepping stones toward victory.',
    impactHindi: 'कठिन से कठिन चुनौतियों को पार कर सफलता हासिल करने का अटूट संकल्प।',
  },
  {
    id: 'action',
    name: 'Action / Execution Plane (2-7-6)',
    nameHindi: 'कर्म / क्रियान्वयन तल (2-7-6)',
    type: 'vertical' as const,
    numbers: [2, 7, 6],
    significance: 'Governs prompt action, athletic agility, swift physical execution, and turning ideas into deed.',
    significanceHindi: 'त्वरित क्रियान्वयन, सक्रियता, तात्कालिक निर्णय और कर्मठता।',
    impact: 'Fast executor; acts decisively without unnecessary delay or analysis paralysis.',
    impactHindi: 'बिना समय गंवाए कार्य शुरू करने और उसे परिणाम तक पहुंचाने की अद्भुत क्षमता।',
  },

  // Diagonals (Raj Yogas of Lo Shu)
  {
    id: 'golden_raj_yoga',
    name: 'Golden Raj Yoga / Success Line (4-5-6)',
    nameHindi: 'स्वर्ण राजयोग / महा सफलता रेखा (4-5-6)',
    type: 'diagonal' as const,
    numbers: [4, 5, 6],
    significance: 'The ultimate line of fortune, all-round prosperity, fame, happiness, and high social elevation.',
    significanceHindi: 'लो शू ग्रिड का सबसे शुभ योग। अपार यश, मान-प्रतिष्ठा, समृद्धि और ऐश्वर्य का सूचक।',
    impact: 'Immense luck, leadership recognition, financial security, and universal support.',
    impactHindi: 'जातक को जीवन में उच्च पद, समाज में आदर और प्रचुर भौतिक व आत्मिक सुख प्राप्त होता है।',
  },
  {
    id: 'silver_earth_yoga',
    name: 'Silver / Property Yoga / Earth Line (2-5-8)',
    nameHindi: 'रजत योग / भूमि-भवन संपत्ति रेखा (2-5-8)',
    type: 'diagonal' as const,
    numbers: [2, 5, 8],
    significance: 'Governs real estate ownership, land, property, material foundation, and financial stability.',
    significanceHindi: 'स्थिर संपत्ति, भूमि-भवन, रियल एस्टेट लाभ और दीर्घकालिक वित्तीय स्थिरता।',
    impact: 'Strong propensity for owning multiple properties, solid ancestral or self-made assets.',
    impactHindi: 'अचल संपत्ति, मकान, भूमि की प्राप्ति और आर्थिक रूप से सुदृढ़ आधार।',
  },
];

export const MULANK_DETAILS: Record<number, { title: string; titleHindi: string; planet: string; planetHindi: string; nature: string; natureHindi: string; career: string; careerHindi: string }> = {
  1: {
    title: 'The Pioneering Leader (मूलांक 1 - नेतृत्वकर्ता)',
    titleHindi: 'मूलांक 1 — सूर्य का प्रभाव (प्रबल नेतृत्वकर्ता)',
    planet: 'Sun (सूर्य)',
    planetHindi: 'सूर्य देव',
    nature: 'Independent, confident, ambitious, highly self-driven with natural commanding authority.',
    natureHindi: 'आत्मविश्वासी, स्वतंत्र विचारक, महत्वाकांक्षी और स्वाभाविक नेतृत्व क्षमता से युक्त।',
    career: 'Administration, Government Services, Entrepreneurship, Management, Politics, Executive leadership.',
    careerHindi: 'प्रशासन, सरकारी सेवाएं, उद्यमशीलता, प्रबंधन, राजनीति और उच्च अधिकारी पद।',
  },
  2: {
    title: 'The Diplomat & Peacemaker (मूलांक 2 - सौम्य शांतिदूत)',
    titleHindi: 'मूलांक 2 — चंद्र का प्रभाव (सौम्य, कल्पनाशील व शांतिप्रिय)',
    planet: 'Moon (चंद्र)',
    planetHindi: 'चंद्र देव',
    nature: 'Gentle, intuitive, imaginative, cooperative, highly empathetic with deep emotional intelligence.',
    natureHindi: 'सौम्य, दयालु, कल्पनाशील, सहयोगी और तीव्र अंतर्ज्ञान व भावनात्मक समझ से संपन्न।',
    career: 'Art, Counseling, Healthcare, Writing, Hospitality, Human Resources, Public Relations.',
    careerHindi: 'कला, परामर्श, चिकित्सा/नर्सिंग, साहित्य लेखन, हॉस्पिटैलिटी, एचआर और जनसंपर्क।',
  },
  3: {
    title: 'The Creative Master & Advisor (मूलांक 3 - ज्ञानी सलाहकार)',
    titleHindi: 'मूलांक 3 — बृहस्पति का प्रभाव (ज्ञानी, शिक्षक व रचनात्मक)',
    planet: 'Jupiter (गुरु)',
    planetHindi: 'देवगुरु बृहस्पति',
    nature: 'Wise, optimistic, creative, expressive, scholarly with an innate flair for teaching and guidance.',
    natureHindi: 'ज्ञानी, आशावादी, रचनात्मक, वाकपटु और दूसरों को सही मार्ग दिखाने में कुशल।',
    career: 'Education, Finance, Law, Consulting, Media, Publishing, Mentorship, Philosophy.',
    careerHindi: 'शिक्षा, वित्त/बैंकिंग, कानून, कॉर्पोरेट कंसल्टिंग, मीडिया, प्रकाशन और आध्यात्मिक मार्गदर्शन।',
  },
  4: {
    title: 'The Master Organizer (मूलांक 4 - व्यावहारिक योजनाकार)',
    titleHindi: 'मूलांक 4 — राहु का प्रभाव (दृढ़ परिश्रमी व संगठनकर्ता)',
    planet: 'Rahu (राहु)',
    planetHindi: 'राहु देव',
    nature: 'Hardworking, organized, disciplined, practical, analytical with focus on solid real-world systems.',
    natureHindi: 'कठोर परिश्रमी, व्यवस्थित, अनुशासित, व्यावहारिक और जमीनी स्तर पर कार्य करने वाले।',
    career: 'Engineering, Technology, Real Estate, Architecture, Operations, Logistics, Research.',
    careerHindi: 'इंजीनियरिंग, आईटी/सॉफ्टवेयर, रियल एस्टेट, वास्तुकला, ऑपरेशंस और शोध कार्य।',
  },
  5: {
    title: 'The Dynamic Communicator (मूलांक 5 - चतुर व्यापारी व वक्ता)',
    titleHindi: 'मूलांक 5 — बुध का प्रभाव (बहुमुखी प्रतिभा, वक्ता व व्यापारी)',
    planet: 'Mercury (बुध)',
    planetHindi: 'बुध देव',
    nature: 'Versatile, sharp-witted, freedom-loving, adaptable, magnetic communicator with brilliant business acumen.',
    natureHindi: 'बहुमुखी प्रतिभा के धनी, तीव्र बुद्धि, वाणी के धनी, स्वतंत्र विचार और उत्कृष्ट व्यापारिक समझ।',
    career: 'Commerce, Trading, Marketing, Sales, Journalism, Travel, Public Speaking, FinTech.',
    careerHindi: 'वाणिज्य/व्यापार, ट्रेडिंग, मार्केटिंग, पत्रकारिता, पर्यटन, जनसंचार और फिनटेक।',
  },
  6: {
    title: 'The Refined Harmonizer (मूलांक 6 - सौंदर्य व ऐश्वर्य प्रेमी)',
    titleHindi: 'मूलांक 6 — शुक्र का प्रभाव (कलात्मक, ऐश्वर्यवान व स्नेही)',
    planet: 'Venus (शुक्र)',
    planetHindi: 'शुक्र देव',
    nature: 'Charming, loving, responsible, aesthetically refined, seeking luxury and domestic tranquility.',
    natureHindi: 'आकर्षक, स्नेही, उत्तरदायी, कला-प्रेमी और सुख-समृद्धि व पारिवारिक शांति के समर्थक।',
    career: 'Luxury Brands, Interior Design, Fashion, Entertainment, Event Management, Hospitality, Gems.',
    careerHindi: 'फैशन, इंटीरियर डिजाइनिंग, सिनेमा/मनोरंजन, इवेंट मैनेजमेंट, रत्न-आभूषण और होटल व्यवसाय।',
  },
  7: {
    title: 'The Mystic Researcher (मूलांक 7 - आध्यात्मिक शोधकर्ता)',
    titleHindi: 'मूलांक 7 — केतु का प्रभाव (दार्शनिक, खोजी व आध्यात्मिक)',
    planet: 'Ketu (केतु)',
    planetHindi: 'केतु देव',
    nature: 'Introspective, intuitive, analytical, philosophical, spiritual seeker with a deep thinking mind.',
    natureHindi: 'गहन चिंतक, शोध-दृष्टि, दार्शनिक, अंतर्मुखी और जीवन के गूढ़ रहस्यों को जानने के इच्छुक।',
    career: 'Data Science, Research, Spiritual Teaching, Psychology, Astrology, Forensics, Philosophy.',
    careerHindi: 'डेटा साइंस, वैज्ञानिक शोध, मनोविज्ञान, ज्योतिष/अध्यात्म, फॉरेन्सिक और गूढ़ विद्याएं।',
  },
  8: {
    title: 'The Powerful Manifestor (मूलांक 8 - कर्मठ साम्राज्य निर्माता)',
    titleHindi: 'मूलांक 8 — शनि का प्रभाव (न्यायप्रिय, धैर्यवान व साम्राज्य निर्माता)',
    planet: 'Saturn (शनि)',
    planetHindi: 'शनि देव',
    nature: 'Persistent, just, deeply ambitious, patient, resilient, capable of building long-term financial empires.',
    natureHindi: 'अखंड परिश्रमी, न्यायप्रिय, धैर्यवान, विपरीत परिस्थितियों में अडिग और बड़े साम्राज्य का निर्माण करने वाले।',
    career: 'Heavy Industries, Real Estate Development, Law & Judiciary, Mining, Corporate Leadership, Finance.',
    careerHindi: 'भारी उद्योग, रियल एस्टेट निर्माण, न्यायपालिका/कानून, खनन, कॉर्पोरेट नेतृत्व और बैंकिंग।',
  },
  9: {
    title: 'The Visionary Warrior (मूलांक 9 - पराक्रमी पथप्रदर्शक)',
    titleHindi: 'मूलांक 9 — मंगल का प्रभाव (ऊर्जावान, साहसी व समाज सुधारक)',
    planet: 'Mars (मंगल)',
    planetHindi: 'मंगल देव',
    nature: 'Courageous, energetic, idealistic, humanitarian, fiercely protective with boundless enthusiasm.',
    natureHindi: 'साहसी, ऊर्जावान, परोपकारी, निडर, सामाजिक न्याय के लिए तत्पर और प्रखर पराक्रमी।',
    career: 'Defense/Military, Police, Surgery/Medicine, Sports, Social Reform, NGO Leadership, Construction.',
    careerHindi: 'सेना/रक्षा, पुलिस, शल्य चिकित्सा (Surgeon), खेलकूद, एनजीओ नेतृत्व, सामाजिक सुधार और निर्माण।',
  },
};

export const BHAGYANK_DETAILS: Record<number, { title: string; titleHindi: string; planet: string; planetHindi: string; destinyPath: string; destinyPathHindi: string; lifeMission: string; lifeMissionHindi: string }> = {
  1: {
    title: 'Destiny of Independent Leadership (भाग्यांक 1)',
    titleHindi: 'भाग्यांक 1 — स्वतंत्र नेतृत्व व मान-सम्मान का मार्ग',
    planet: 'Sun (सूर्य)',
    planetHindi: 'सूर्य देव',
    destinyPath: 'You are destined to stand out from the crowd, initiate new paths, and hold authoritative responsibility.',
    destinyPathHindi: 'आपका भाग्य आपको भीड़ से अलग एक विशिष्ट पहचान, उच्च पद और नए आयाम स्थापित करने की ओर ले जाता है।',
    lifeMission: 'Empowering others through visionary leadership and unwavering self-reliance.',
    lifeMissionHindi: 'अपने नेतृत्व और आत्मविश्वास से समाज को दिशा देना और आत्मनिर्भरता का आदर्श बनना।',
  },
  2: {
    title: 'Destiny of Harmony & Collaboration (भाग्यांक 2)',
    titleHindi: 'भाग्यांक 2 — शांति, सहयोग एवं सौहार्द का मार्ग',
    planet: 'Moon (चंद्र)',
    planetHindi: 'चंद्र देव',
    destinyPath: 'You are destined to bridge divides, foster deep relationships, and heal conflicts with gentle intuition.',
    destinyPathHindi: 'आपका भाग्य लोगों को परस्पर जोड़ने, मधुर संबंध स्थापित करने और अपनी संवेदनशीलता से शांति लाने में है।',
    lifeMission: 'Spreading emotional understanding, artistic grace, and unconditional support.',
    lifeMissionHindi: 'रिश्तों में सद्भाव, कलात्मक सौंदर्य और परस्पर सहयोग की भावना का विस्तार करना।',
  },
  3: {
    title: 'Destiny of Wisdom & Expression (भाग्यांक 3)',
    titleHindi: 'भाग्यांक 3 — ज्ञान, अध्यापन एवं रचनात्मक अभिव्यक्ति का मार्ग',
    planet: 'Jupiter (गुरु)',
    planetHindi: 'देवगुरु बृहस्पति',
    destinyPath: 'You are destined to educate, enlighten minds, communicate profound truths, and inspire through creativity.',
    destinyPathHindi: 'आपका भाग्य लोगों को शिक्षित करने, रचनात्मक कार्यों से प्रेरित करने और ज्ञान का प्रकाश फैलाने में है।',
    lifeMission: 'Elevating society through knowledge, optimism, and artistic innovation.',
    lifeMissionHindi: 'सकारात्मक दृष्टिकोण, विद्या और रचनात्मकता के माध्यम से समाज को उन्नति की ओर ले जाना।',
  },
  4: {
    title: 'Destiny of Master Construction (भाग्यांक 4)',
    titleHindi: 'भाग्यांक 4 — मजबूत नींव एवं व्यवस्था निर्माण का मार्ग',
    planet: 'Rahu (राहु)',
    planetHindi: 'राहु देव',
    destinyPath: 'You are destined to build enduring structures, establish organized systems, and bring stability to chaos.',
    destinyPathHindi: 'आपका भाग्य ठोस व्यवस्थाएं स्थापित करने, कठिन परिश्रम से स्थायी संपत्तियों का निर्माण करने में है।',
    lifeMission: 'Creating reliable, long-lasting foundations and disciplined practical systems.',
    lifeMissionHindi: 'व्यावहारिक और मजबूत आधारशिला रखना जिससे आने वाली पीढ़ियां लाभान्वित हो सकें।',
  },
  5: {
    title: 'Destiny of Dynamic Transformation (भाग्यांक 5)',
    titleHindi: 'भाग्यांक 5 — परिवर्तन, व्यापार एवं स्वतंत्रता का मार्ग',
    planet: 'Mercury (बुध)',
    planetHindi: 'बुध देव',
    destinyPath: 'You are destined for rapid growth, international ventures, innovative commerce, and progressive change.',
    destinyPathHindi: 'आपका भाग्य व्यापारिक उन्नति, नए प्रयोगों, तीव्र अनुकूलनशीलता और दूरगामी संपर्कों में है।',
    lifeMission: 'Pioneering versatile solutions, modern trade, and empowering adaptive freedom.',
    lifeMissionHindi: 'नवाचार (Innovation), प्रगतिशील व्यापार और बहुआयामी प्रतिभा से समाज को आगे बढ़ाना।',
  },
  6: {
    title: 'Destiny of Nurturing & Prosperity (भाग्यांक 6)',
    titleHindi: 'भाग्यांक 6 — पारिवारिक कल्याण, ऐश्वर्य एवं सेवा का मार्ग',
    planet: 'Venus (शुक्र)',
    planetHindi: 'शुक्र देव',
    destinyPath: 'You are destined to create beautiful spaces, nurture family and community, and enjoy refined prosperity.',
    destinyPathHindi: 'आपका भाग्य पारिवारिक सुख, कला, ऐश्वर्य और जरूरतमंदों की सेवा व देखरेख करने में है।',
    lifeMission: 'Infusing life with elegance, unconditional love, and generous hospitality.',
    lifeMissionHindi: 'जीवन में सौंदर्य, प्रेम, पारिवारिक आत्मीयता और समृद्धि का संचार करना।',
  },
  7: {
    title: 'Destiny of Truth & Spiritual Awakening (भाग्यांक 7)',
    titleHindi: 'भाग्यांक 7 — आत्मज्ञान, शोध एवं आध्यात्मिक उत्थान का मार्ग',
    planet: 'Ketu (केतु)',
    planetHindi: 'केतु देव',
    destinyPath: 'You are destined to explore deep spiritual truths, uncover hidden knowledge, and master self-realization.',
    destinyPathHindi: 'आपका भाग्य गहन शोध, गूढ़ विद्याओं और आत्मिक शांति की प्राप्ति में निहित है।',
    lifeMission: 'Illuminating life’s deeper mysteries and guiding seekers with experiential wisdom.',
    lifeMissionHindi: 'संसार के भ्रम से परे हटकर वास्तविक आत्म-ज्ञान और उच्च चेतना का मार्गदर्शन करना।',
  },
  8: {
    title: 'Destiny of Financial Empire & Justice (भाग्यांक 8)',
    titleHindi: 'भाग्यांक 8 — कर्म योग, धन-साम्राज्य एवं न्याय का मार्ग',
    planet: 'Saturn (शनि)',
    planetHindi: 'शनि देव',
    destinyPath: 'You are destined to manage grand enterprises, master material resources, and uphold karmic justice.',
    destinyPathHindi: 'आपका भाग्य बड़े संगठनों का नेतृत्व करने, विशाल संपत्तियों का प्रबंधन करने और न्याय स्थापित करने में है।',
    lifeMission: 'Demonstrating that disciplined ethical effort manifests unshakable abundance and justice.',
    lifeMissionHindi: 'सच्ची लगन और धर्मसम्मत कर्म से अखंड समृद्धि और समाज कल्याण की मिसाल बनना।',
  },
  9: {
    title: 'Destiny of Universal Humanitarianism (भाग्यांक 9)',
    titleHindi: 'भाग्यांक 9 — वैश्विक परोपकार, शौर्य एवं परिवर्तन का मार्ग',
    planet: 'Mars (मंगल)',
    planetHindi: 'मंगल देव',
    destinyPath: 'You are destined to champion noble causes, lead humanitarian movements, and leave an indelible legacy.',
    destinyPathHindi: 'आपका भाग्य जन-कल्याण, बड़े सामाजिक सुधारों और पराक्रम से असंभव को संभव करने में है।',
    lifeMission: 'Serving humanity with fearless compassion and inspiring global harmony.',
    lifeMissionHindi: 'निस्वार्थ सेवा, त्याग और अदम्य साहस से संसार को एक बेहतर स्थान बनाना।',
  },
};

export function calculateLoShuGrid(
  dob: string,
  timeOfBirth?: string,
  personName?: string,
  includeMulankBhagyank = false
): LoShuResult {
  // Parse date
  const cleanDob = dob.replace(/[^0-9]/g, '');
  const digits = cleanDob.split('').map(Number).filter((d) => d >= 1 && d <= 9);

  const parts = dob.split('-');
  const year = parts[0] ? parseInt(parts[0], 10) : 1995;
  const month = parts[1] ? parseInt(parts[1], 10) : 1;
  const day = parts[2] ? parseInt(parts[2], 10) : 1;

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

  const mulank = reduceToSingleDigit(day);
  const fullDateSum = cleanDob.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  const bhagyank = reduceToSingleDigit(fullDateSum);

  // Kua number
  let kua = 0;
  const yearSum = reduceToSingleDigit(year);
  kua = reduceToSingleDigit(10 - yearSum);

  const counts: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };

  // Base digits from DoB itself (traditional Lo Shu magic square rule: zeros skipped)
  for (const d of digits) {
    if (d >= 1 && d <= 9) {
      counts[d] = (counts[d] || 0) + 1;
    }
  }

  // If user selected to include Mulank / Bhagyank in advanced mode
  if (includeMulankBhagyank) {
    counts[mulank] = (counts[mulank] || 0) + 1;
    counts[bhagyank] = (counts[bhagyank] || 0) + 1;
  }

  // 3x3 Magic Square Matrix
  // Row 1: 4, 9, 2
  // Row 2: 3, 5, 7
  // Row 3: 8, 1, 6
  const matrix = [
    [counts[4], counts[9], counts[2]],
    [counts[3], counts[5], counts[7]],
    [counts[8], counts[1], counts[6]],
  ];

  // Build present numbers
  const presentNumbers: LoShuResult['presentNumbers'] = [];
  const repeatedNumbers: LoShuResult['repeatedNumbers'] = [];
  const missingNumbers: LoShuResult['missingNumbers'] = [];

  for (let n = 1; n <= 9; n++) {
    const meta = LO_SHU_NUMBERS_METADATA[n];
    const cnt = counts[n] || 0;

    if (cnt > 0) {
      presentNumbers.push({
        number: n,
        count: cnt,
        title: `Number ${n} — ${meta.title}`,
        titleHindi: `अंक ${n} — ${meta.titleHindi}`,
        description: meta.presentDesc,
        descriptionHindi: meta.presentDescHindi,
        keywords: [meta.element, meta.direction, meta.planet],
      });

      if (cnt >= 2) {
        let intensity: 'High (2x)' | 'Intense (3x)' | 'Excessive (4x+)' = 'High (2x)';
        let intensityHindi: 'उच्च (2 बार)' | 'प्रखर (3 बार)' | 'अति तीव्र (4+ बार)' = 'उच्च (2 बार)';

        if (cnt === 3) {
          intensity = 'Intense (3x)';
          intensityHindi = 'प्रखर (3 बार)';
        } else if (cnt >= 4) {
          intensity = 'Excessive (4x+)';
          intensityHindi = 'अति तीव्र (4+ बार)';
        }

        repeatedNumbers.push({
          number: n,
          count: cnt,
          title: `Number ${n} — ${meta.title}`,
          titleHindi: `अंक ${n} — ${meta.titleHindi}`,
          description: meta.repeatedDesc,
          descriptionHindi: meta.repeatedDescHindi,
          intensity,
          intensityHindi,
        });
      }
    } else {
      missingNumbers.push({
        number: n,
        title: `Number ${n} — ${meta.title}`,
        titleHindi: `अंक ${n} — ${meta.titleHindi}`,
        lesson: meta.missingDesc,
        lessonHindi: meta.missingDescHindi,
        remedies: {
          gemstone: meta.remediesExtended.crystals.en,
          color: meta.remediesExtended.colors.en,
          rudraksha: meta.remediesExtended.rudrakshaBracelet.en,
          vastu: meta.direction,
          habit: meta.remedy,
        },
        remediesHindi: {
          gemstone: meta.remediesExtended.crystals.hi,
          color: meta.remediesExtended.colors.hi,
          rudraksha: meta.remediesExtended.rudrakshaBracelet.hi,
          vastu: meta.directionHindi,
          habit: meta.remedyHindi,
        },
        remediesExtended: meta.remediesExtended,
      });
    }
  }

  // Calculate planes
  let completePlanesCount = 0;
  const planes: LoShuPlane[] = LO_SHU_PLANES_DEF.map((planeDef) => {
    const presentCount = planeDef.numbers.filter((num) => counts[num] > 0).length;
    let percentage = Math.round((presentCount / 3) * 100);
    let status: 'Complete (100%)' | 'Partially Active' | 'Inactive (Missing)' = 'Inactive (Missing)';
    let statusHindi: 'पूर्ण (100%)' | 'आंशिक सक्रिय' | 'अनुपस्थित' = 'अनुपस्थित';

    if (presentCount === 3) {
      status = 'Complete (100%)';
      statusHindi = 'पूर्ण (100%)';
      percentage = 100;
      completePlanesCount++;
    } else if (presentCount > 0) {
      status = 'Partially Active';
      statusHindi = 'आंशिक सक्रिय';
    }

    return {
      ...planeDef,
      percentage,
      status,
      statusHindi,
    };
  });

  // 5-Element Distribution Analysis
  const waterCount = counts[1] || 0;
  const woodCount = (counts[3] || 0) + (counts[4] || 0);
  const fireCount = counts[9] || 0;
  const earthCount = (counts[2] || 0) + (counts[5] || 0) + (counts[8] || 0);
  const metalCount = (counts[6] || 0) + (counts[7] || 0);

  const getElementStatus = (cnt: number, totalSlots: number) => {
    if (cnt === 0) return { status: 'Weak / Missing (कमजोर / अनुपस्थित)' as const, statusHindi: 'अनुपस्थित / कमजोर' };
    if (cnt > totalSlots + 1) return { status: 'Abundant (प्रचुर)' as const, statusHindi: 'अत्यधिक प्रचुर' };
    return { status: 'Balanced (संतुलित)' as const, statusHindi: 'संतुलित' };
  };

  const waterStat = getElementStatus(waterCount, 1);
  const woodStat = getElementStatus(woodCount, 2);
  const fireStat = getElementStatus(fireCount, 1);
  const earthStat = getElementStatus(earthCount, 3);
  const metalStat = getElementStatus(metalCount, 2);

  const elementBreakdown: ElementBalanceAnalysis[] = [
    {
      element: 'Water',
      elementHindi: 'जल तत्व (अंक 1)',
      numbers: [1],
      count: waterCount,
      status: waterStat.status,
      statusHindi: waterStat.statusHindi,
      meaning: 'Governs career flow, speech, adaptability, clarity, and wealth circulation.',
      meaningHindi: 'करियर की गतिशीलता, वाक्-चातुर्य, अनुकूलनशीलता और धन प्रवाह का नियंत्रण करता है।',
      balancingTip: waterCount === 0 ? 'Place a water fountain in the North or drink water from silver/copper vessels.' : 'Keep the North direction clean and clear of clutter.',
      balancingTipHindi: waterCount === 0 ? 'उत्तर दिशा में छोटा जल फव्वारा रखें या तांबे के लोटे से सूर्य को जल दें।' : 'उत्तर दिशा को स्वच्छ और बाधा-मुक्त रखें।',
      colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      element: 'Wood',
      elementHindi: 'काष्ठ तत्व (अंक 3, 4)',
      numbers: [3, 4],
      count: woodCount,
      status: woodStat.status,
      statusHindi: woodStat.statusHindi,
      meaning: 'Governs intellectual wisdom, wealth accumulation, health, growth, and patience.',
      meaningHindi: 'बौद्धिक ज्ञान, धन संचय, स्वास्थ्य, निरंतर विकास और धैर्य को दर्शाता है।',
      balancingTip: woodCount === 0 ? 'Place lush green plants in East/South-East and wear Green Jade/Citrine.' : 'Maintain live green plants in your living area.',
      balancingTipHindi: woodCount === 0 ? 'पूर्व या आग्नेय कोण में हरे पौधे/मनी प्लांट लगाएं व सिट्रीन क्रिस्टल रखें।' : 'घर में जीवित हरे पौधों की देखभाल करें।',
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      element: 'Fire',
      elementHindi: 'अग्नि तत्व (अंक 9)',
      numbers: [9],
      count: fireCount,
      status: fireStat.status,
      statusHindi: fireStat.statusHindi,
      meaning: 'Governs reputation, social fame, courage, passion, ambition, and inner drive.',
      meaningHindi: 'सामाजिक मान-सम्मान, शौर्य, उत्साह, महत्वाकांक्षा और नेतृत्व क्षमता का संचालन करता है।',
      balancingTip: fireCount === 0 ? 'Place a red bulb or copper pyramid in the South and wear Red Carnelian.' : 'Channel high energy through exercise and positive creativity.',
      balancingTipHindi: fireCount === 0 ? 'दक्षिण दिशा में लाल बल्ब या तांबे का पिरामिड लगाएं।' : 'ऊर्जा को व्यायाम और सकारात्मक कार्यों में लगाएं।',
      colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
    {
      element: 'Earth',
      elementHindi: 'पृथ्वी तत्व (अंक 2, 5, 8)',
      numbers: [2, 5, 8],
      count: earthCount,
      status: earthStat.status,
      statusHindi: earthStat.statusHindi,
      meaning: 'Governs stability, property ownership, grounding, relationships, and perseverance.',
      meaningHindi: 'स्थिरता, अचल संपत्ति (मकान/भूमि), आत्मीय रिश्ते और आंतरिक संतुलन प्रदान करता है।',
      balancingTip: earthCount === 0 ? 'Keep clay pots in South-West, crystal pyramid in center, and clean North-East.' : 'Stay connected with nature and maintain home stability.',
      balancingTipHindi: earthCount === 0 ? 'दक्षिण-पश्चिम में मिट्टी के पात्र, केंद्र में स्फटिक पिरामिड और ईशान कोण स्वच्छ रखें।' : 'प्रकृति से जुड़े रहें और जीवन में स्थिरता बनाए रखें।',
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      element: 'Metal',
      elementHindi: 'धातु तत्व (अंक 6, 7)',
      numbers: [6, 7],
      count: metalCount,
      status: metalStat.status,
      statusHindi: metalStat.statusHindi,
      meaning: 'Governs helpful friends, luxury, spiritual research, creativity, and children’s luck.',
      meaningHindi: 'सहयोगी मित्र, भौतिक ऐश्वर्य, आध्यात्मिक अनुसंधान, रचनात्मकता और संतान सुख का कारक है।',
      balancingTip: metalCount === 0 ? 'Hang a 6-rod metal wind chime in North-West and place silver items in West.' : 'Surround yourself with refined artistic and silver elements.',
      balancingTipHindi: metalCount === 0 ? 'उत्तर-पश्चिम में 6 छड़ों वाली धातु की विंड चाइम लगाएं और पश्चिम में चांदी रखें।' : 'सुरुचिपूर्ण कलात्मक वस्तुओं से वातावरण सजाएं।',
      colorClass: 'text-slate-300 bg-slate-500/10 border-slate-500/30',
    },
  ];

  // Grid Balance Score
  const presentCount = presentNumbers.length;
  const gridBalanceScore = Math.min(100, Math.round((presentCount / 9) * 60 + (completePlanesCount * 10) + 10));
  let gridBalanceLevel: 'Supreme Harmony' | 'High Balance' | 'Moderate' | 'Needs Balancing' = 'Needs Balancing';
  let gridBalanceLevelHindi = 'संतुलन की आवश्यकता';

  if (gridBalanceScore >= 85) {
    gridBalanceLevel = 'Supreme Harmony';
    gridBalanceLevelHindi = 'परम संतुलित (Supreme Harmony)';
  } else if (gridBalanceScore >= 70) {
    gridBalanceLevel = 'High Balance';
    gridBalanceLevelHindi = 'उच्च संतुलन (High Balance)';
  } else if (gridBalanceScore >= 50) {
    gridBalanceLevel = 'Moderate';
    gridBalanceLevelHindi = 'मध्यम संतुलन (Moderate)';
  } else {
    gridBalanceLevel = 'Needs Balancing';
    gridBalanceLevelHindi = 'ऊर्जा संतुलन की आवश्यकता';
  }

  // Key Strengths & Growth Areas derived from grid
  const keyStrengths: string[] = [];
  const keyStrengthsHindi: string[] = [];
  const growthAreas: string[] = [];
  const growthAreasHindi: string[] = [];

  if (counts[1] > 0) {
    keyStrengths.push('Natural communication ability and clear professional focus');
    keyStrengthsHindi.push('प्रभावशाली संवाद कला और करियर के प्रति स्पष्ट दृष्टिकोण');
  } else {
    growthAreas.push('Speaking up boldly in public and taking decisive career initiatives');
    growthAreasHindi.push('सार्वजनिक मंचों पर खुलकर बोलना और करियर में निर्भीक निर्णय लेना');
  }

  if (counts[5] > 0) {
    keyStrengths.push('Inner resilience, adaptability, and emotional grounding at the core');
    keyStrengthsHindi.push('आंतरिक संतुलन, विपरीत परिस्थितियों में ढलने की शक्ति और मजबूत इच्छाशक्ति');
  } else {
    growthAreas.push('Cultivating centered routine and avoiding wavering in decision-making');
    growthAreasHindi.push('दैनिक जीवन में स्थिरता लाना और निर्णयों में भटकाव से बचना');
  }

  if (counts[9] > 0) {
    keyStrengths.push('Passionate energy, high social ambition, and humanitarian courage');
    keyStrengthsHindi.push('उच्च महत्वाकांक्षा, पराक्रम और समाज में यश प्राप्त करने की तीव्र ललक');
  } else {
    growthAreas.push('Widening vision, building social visibility, and nurturing noble aspirations');
    growthAreasHindi.push('दूरदर्शी सोच विकसित करना और समाज में अपनी सशक्त पहचान बनाना');
  }

  if (counts[4] > 0 && counts[5] > 0 && counts[6] > 0) {
    keyStrengths.push('★ Active Golden Raj Yoga (4-5-6): Exceptional luck, all-round fortune, and luxury elevation');
    keyStrengthsHindi.push('★ सक्रिय स्वर्ण राजयोग (4-5-6): अपार सौभाग्य, ऐश्वर्य, पद-प्रतिष्ठा और चहुंमुखी सफलता');
  }

  if (counts[2] > 0 && counts[5] > 0 && counts[8] > 0) {
    keyStrengths.push('★ Active Silver Property Yoga (2-5-8): Solid land, house ownership, and material stability');
    keyStrengthsHindi.push('★ सक्रिय रजत योग (2-5-8): भूमि-भवन, अचल संपत्ति और वित्तीय सुदृढ़ता का वरदान');
  }

  if (counts[9] > 0 && counts[5] > 0 && counts[1] > 0) {
    keyStrengths.push('★ Complete Will Power Line (9-5-1): Unstoppable determination and victory over hurdles');
    keyStrengthsHindi.push('★ पूर्ण इच्छाशक्ति तल (9-5-1): अटूट संकल्प शक्ति और हर बाधा पर विजय प्राप्त करने का सामर्थ्य');
  }

  // Master Plan to Balance and Complete Missing Planes
  const masterBalancingPlan = planes
    .filter((p) => p.percentage < 100 && p.percentage > 0)
    .map((p) => {
      const missingNums = p.numbers.filter((num) => (counts[num] || 0) === 0);
      const missingNames = missingNums.map((n) => `Number ${n}`).join(', ');
      const missingNamesHi = missingNums.map((n) => `अंक ${n}`).join(', ');

      const remediesSummary = missingNums
        .map((n) => {
          const m = LO_SHU_NUMBERS_METADATA[n];
          return `${m.planet} (${m.direction} - ${m.remediesExtended.vastuItems.en})`;
        })
        .join(' + ');

      const remediesSummaryHi = missingNums
        .map((n) => {
          const m = LO_SHU_NUMBERS_METADATA[n];
          return `${m.planetHindi} (${m.directionHindi} - ${m.remediesExtended.vastuItems.hi})`;
        })
        .join(' + ');

      return {
        planeId: p.id,
        planeName: p.name,
        planeNameHindi: p.nameHindi,
        missingNums,
        percentage: p.percentage,
        howToActivate: `Activate ${missingNames} by balancing ${remediesSummary}.`,
        howToActivateHindi: `${missingNamesHi} की ऊर्जा को सक्रिय करने हेतु: ${remediesSummaryHi} अपनाएं।`,
        unlockedReward: p.impact,
        unlockedRewardHindi: p.impactHindi,
      };
    });

  const deepAnalysis: CalculationDeepAnalysis = {
    mulankInfo: { number: mulank, ...(MULANK_DETAILS[mulank] || MULANK_DETAILS[1]) },
    bhagyankInfo: { number: bhagyank, ...(BHAGYANK_DETAILS[bhagyank] || BHAGYANK_DETAILS[1]) },
    elementBreakdown,
    activeRajYogasCount: completePlanesCount,
    gridBalanceScore,
    gridBalanceLevel,
    gridBalanceLevelHindi,
    keyStrengths,
    keyStrengthsHindi,
    growthAreas,
    growthAreasHindi,
    masterBalancingPlan,
  };

  return {
    birthDate: dob,
    day,
    month,
    year,
    time: timeOfBirth,
    name: personName,
    rawDigits: digits,
    counts,
    matrix,
    presentNumbers,
    repeatedNumbers,
    missingNumbers,
    planes,
    mulank,
    bhagyank,
    kuaNumber: kua,
    deepAnalysis,
  };
}
