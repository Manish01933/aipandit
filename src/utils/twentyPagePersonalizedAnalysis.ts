import {
  KundaliResult,
  BirthDetails,
  VedicPlanet,
  ZodiacSign,
  JagannathaHoraData,
  HouseInfo,
  PlanetInfo,
} from '../types/astrology';

// Zodiac Sign lords mapping
export const SIGN_LORDS: Record<ZodiacSign, VedicPlanet> = {
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

export const SIGN_LORDS_HINDI: Record<ZodiacSign, string> = {
  Aries: 'मंगल',
  Taurus: 'शुक्र',
  Gemini: 'बुध',
  Cancer: 'चंद्रमा',
  Leo: 'सूर्य',
  Virgo: 'बुध',
  Libra: 'शुक्र',
  Scorpio: 'मंगल',
  Sagittarius: 'गुरु (बृहस्पति)',
  Capricorn: 'शनि',
  Aquarius: 'शनि',
  Pisces: 'गुरु (बृहस्पति)',
};

export const SIGN_ELEMENTS: Record<ZodiacSign, { en: string; hi: string; dosha: string; doshaHi: string }> = {
  Aries: { en: 'Fire', hi: 'अग्नि तत्व', dosha: 'Pitta', doshaHi: 'पित्त प्रधान' },
  Taurus: { en: 'Earth', hi: 'पृथ्वी तत्व', dosha: 'Kapha-Vata', doshaHi: 'कफ-वात संतुलित' },
  Gemini: { en: 'Air', hi: 'वायु तत्व', dosha: 'Vata', doshaHi: 'वात प्रधान' },
  Cancer: { en: 'Water', hi: 'जल तत्व', dosha: 'Kapha', doshaHi: 'कफ प्रधान' },
  Leo: { en: 'Fire', hi: 'अग्नि तत्व', dosha: 'Pitta', doshaHi: 'पित्त प्रधान' },
  Virgo: { en: 'Earth', hi: 'पृथ्वी तत्व', dosha: 'Vata-Kapha', doshaHi: 'वात-कफ मिश्रित' },
  Libra: { en: 'Air', hi: 'वायु तत्व', dosha: 'Vata', doshaHi: 'वात प्रधान' },
  Scorpio: { en: 'Water', hi: 'जल तत्व', dosha: 'Pitta-Kapha', doshaHi: 'पित्त-कफ मिश्रित' },
  Sagittarius: { en: 'Fire', hi: 'अग्नि तत्व', dosha: 'Pitta', doshaHi: 'पित्त प्रधान' },
  Capricorn: { en: 'Earth', hi: 'पृथ्वी तत्व', dosha: 'Vata', doshaHi: 'वात प्रधान' },
  Aquarius: { en: 'Air', hi: 'वायु तत्व', dosha: 'Vata', doshaHi: 'वात प्रधान' },
  Pisces: { en: 'Water', hi: 'जल तत्व', dosha: 'Kapha', doshaHi: 'कफ प्रधान' },
};

// 12 Ascendant Profiles
export const ASCENDANT_PROFILES: Record<
  ZodiacSign,
  {
    symbol: string;
    natureHi: string;
    natureEn: string;
    temperamentHi: string;
    temperamentEn: string;
    strengthsHi: string;
    strengthsEn: string;
    challengesHi: string;
    challengesEn: string;
    physiqueHi: string;
    physiqueEn: string;
    remedyHi: string;
    remedyEn: string;
  }
> = {
  Aries: {
    symbol: 'मेष (Aries)',
    natureHi: 'अग्नि तत्व, चर राशि, स्वामी मंगल। साहसी, ऊर्जावान एवं स्पष्टवादी स्वभाव।',
    natureEn: 'Fiery, cardinal sign ruled by Mars. Courageous, pioneering, dynamic and direct.',
    temperamentHi: 'नेतृत्व क्षमता, त्वरित निर्णय, किसी के अधीन काम न करने की स्वाभाविक इच्छा।',
    temperamentEn: 'Natural executive authority, quick decision-maker with a strong desire for autonomy.',
    strengthsHi: 'निडरता, दृढ़ इच्छाशक्ति, संकट के समय तत्काल कदम उठाना, उच्च आत्मसम्मान।',
    strengthsEn: 'Fearlessness, iron willpower, swift crisis management, unshakeable confidence.',
    challengesHi: 'अत्यधिक अधीरता, शीघ्र क्रोध, दूसरों के धीमे काम से झुंझलाहट, बिना सोचे जोखिम लेना।',
    challengesEn: 'Impatience, sudden temper flare-ups, frustration with slower peers, impulsive risks.',
    physiqueHi: 'मध्यम से लंबा कद, बलिष्ठ मस्तक, तेजवान नेत्र और त्वरित शारीरिक गति।',
    physiqueEn: 'Athletic constitution, prominent brow, piercing gaze, energetic physical gait.',
    remedyHi: 'हनुमान चालीसा का पाठ, मंगलवार को लाल चंदन लगाना व क्रोध पर नियंत्रण का अभ्यास।',
    remedyEn: 'Hanuman Chalisa recitation, red sandalwood tilak on Tuesdays, mindfulness in anger.',
  },
  Taurus: {
    symbol: 'वृषभ (Taurus)',
    natureHi: 'पृथ्वी तत्व, स्थिर राशि, स्वामी शुक्र। व्यावहारिक, कलाप्रिय, धैर्यवान एवं गंभीर।',
    natureEn: 'Earthy, fixed sign ruled by Venus. Grounded, aesthetic, perseverant, trustworthy.',
    temperamentHi: 'स्थिर सोच, वित्तीय सुरक्षा को प्राथमिकता, सुंदरता व सात्विक जीवन का प्रेमी।',
    temperamentEn: 'Pragmatic mindset, value-driven, deeply fond of comfort, aesthetics, and lasting bonds.',
    strengthsHi: 'अतुलनीय धैर्य, निष्ठा, वित्तीय समझ, किसी भी कार्य को अंत तक निभाने की क्षमता।',
    strengthsEn: 'Enduring stamina, unwavering loyalty, sound financial instincts, reliable completion skills.',
    challengesHi: 'जिद्दीपन (हठ), बदलाव को स्वीकार करने में देरी, अत्यधिक भौतिकवादी दृष्टिकोण।',
    challengesEn: 'Stubbornness, resistance to necessary transitions, occasional over-attachment to luxury.',
    physiqueHi: 'मजबूत शारीरिक गठन, आकर्षक चेहरा, सुरीली वाणी, स्थिर व गरिमापूर्ण चाल।',
    physiqueEn: 'Broad shoulders, attractive visage, melodic speaking tone, dignified presence.',
    remedyHi: 'शुक्रवार को श्री सूक्त का पाठ, सफेद वस्त्रों का दान व माता लक्ष्मी की नित्य आराधना।',
    remedyEn: 'Recitation of Sri Suktam on Fridays, white fabric donations, honoring Devi Lakshmi.',
  },
  Gemini: {
    symbol: 'मिथुन (Gemini)',
    natureHi: 'वायु तत्व, द्विस्वभाव राशि, स्वामी बुध। बुद्धिमान, मिलनसार, जिज्ञासु एवं कुशल वक्ता।',
    natureEn: 'Airy, dual sign ruled by Mercury. Intellectual, adaptable, eloquent, communicative.',
    temperamentHi: 'बहुमुखी प्रतिभा, निरंतर नई चीजें सीखने की ललक, तीव्र विश्लेषणात्मक बुद्धि।',
    temperamentEn: 'Multifaceted versatility, endless curiosity, sharp wit, rapid mental agility.',
    strengthsHi: 'संचार कौशल, नेटवर्किंग, व्यापारिक दूरदर्शिता, परिस्थितियों के अनुसार ढलना।',
    strengthsEn: 'Verbal brilliance, elite networking, commercial foresight, effortless adaptability.',
    challengesHi: 'एकाग्रता का अभाव, एक साथ कई काम शुरू कर अधूरा छोड़ना, मानसिक चंचलता।',
    challengesEn: 'Scattered focus, starting multiple projects without concluding them, mental restlessness.',
    physiqueHi: 'फुर्तीला शरीर, लंबी उंगलियां, बात करते समय हाथ हिलाने की स्वाभाविक आदत, सजीव आंखें।',
    physiqueEn: 'Agile frame, expressive hands, youthful face, dynamic and expressive eyes.',
    remedyHi: 'गणेश अथर्वशीर्ष का पाठ, पक्षियों को हरा मूंग डालना, तुलसी जी को नित्य जल अर्पित करना।',
    remedyEn: 'Ganesh Atharvashirsha japa, feeding green gram to birds, nurturing sacred Tulsi.',
  },
  Cancer: {
    symbol: 'कर्क (Cancer)',
    natureHi: 'जल तत्व, चर राशि, स्वामी चंद्रमा। अत्यंत संवेदनशील, स्नेही, कल्पनावान एवं रक्षक।',
    natureEn: 'Watery, cardinal sign ruled by the Moon. Empathetic, nurturing, imaginative, protective.',
    temperamentHi: 'पारिवारिक सुख को सर्वोपरि मानना, गहरी अंतर्दृष्टि, दूसरों के दुख को तुरंत महसूस करना।',
    temperamentEn: 'Devotion to family sanctum, high psychic intuition, profound emotional depth.',
    strengthsHi: 'प्रबल अंतःप्रेरणा (Intuition), दूसरों का ख्याल रखना, स्मृति शक्ति, भावनात्मक निष्ठा।',
    strengthsEn: 'Powerful intuitive radar, nurturing heart, photographic memory, loyal empathy.',
    challengesHi: 'मूड स्विंग्स (मनोभावों का बदलना), अतीत की बातों को पकड़े रहना, अति-संवेदनशीलता।',
    challengesEn: 'Mood fluctuations, clinging to past grievances, taking constructive critique too personally.',
    physiqueHi: 'गोल या सौम्य चेहरा, चमकती आंखें, शीतल आभा, मध्यम शारीरिक कद।',
    physiqueEn: 'Round or soft facial contours, expressive lunar eyes, calming personal aura.',
    remedyHi: 'भगवान शिव का दूध व जल से रुद्राभिषेक, पूर्णिमा पर चंद्र दर्शन व माता का आशीर्वाद।',
    remedyEn: 'Shiva Jalabhishek, meditation under full moon, touching mother’s feet daily.',
  },
  Leo: {
    symbol: 'सिंह (Leo)',
    natureHi: 'अग्नि तत्व, स्थिर राशि, स्वामी सूर्य। स्वाभिमानी, तेजस्वी, जन्मजात नेतृत्वकर्ता ও दयालु।',
    natureEn: 'Fiery, fixed sign ruled by the Sun. Regal, magnanimous, authoritative, natural leader.',
    temperamentHi: 'राजा समान उदारता, आत्मगौरव, अन्याय के विरुद्ध आवाज उठाना, संगठन क्षमता।',
    temperamentEn: 'Regal magnanimity, high self-respect, protective of subordinates, organizational genius.',
    strengthsHi: 'सच्चा नेतृत्व, निष्कलंक सत्यनिष्ठा, विशाल हृदय, संकट में सभी की रक्षा करना।',
    strengthsEn: 'Charismatic leadership, unyielding integrity, generous heart, protective loyalty.',
    challengesHi: 'अहंकार (Ego), चापलूसों की बातों में आना, आलोचना सहन न कर पाना।',
    challengesEn: 'Ego vulnerability, susceptibility to flattery, difficulty accepting personal errors.',
    physiqueHi: 'चौड़ा सीना, सिंह समान गरिमामयी चाल, प्रभावशाली चेहरा व आत्मविश्वास भरी आवाज।',
    physiqueEn: 'Broad chest, regal posture, commanding vocal timbre, authoritative stance.',
    remedyHi: 'उगते सूर्य को तांबे के लोटे से अर्घ्य, आदित्य हृदय स्तोत्र का पाठ, पिता की सेवा।',
    remedyEn: 'Offering Arghya to rising Sun in copper vessel, Aditya Hridaya Stotra, respecting father.',
  },
  Virgo: {
    symbol: 'कन्या (Virgo)',
    natureHi: 'पृथ्वी तत्व, द्विस्वभाव राशि, स्वामी बुध। विश्लेषणात्मक, कर्तव्यनिष्ठ, व्यवस्थित एवं सेवाभावी।',
    natureEn: 'Earthy, dual sign ruled by Mercury. Analytical, systematic, perfectionist, service-oriented.',
    temperamentHi: 'हर कार्य में पूर्णता (Perfection), बारीक से बारीक त्रुटि पकड़ना, व्यावहारिक सोच।',
    temperamentEn: 'Relentless quest for excellence, microscopic attention to detail, pragmatic problem-solver.',
    strengthsHi: 'उत्कृष्ट डेटा व लॉजिकल समझ, वित्तीय अनुशासन, समस्या का तुरंत समाधान खोजना।',
    strengthsEn: 'Exceptional data comprehension, financial prudence, meticulous operational delivery.',
    challengesHi: 'अत्यधिक आत्म-समीक्षा व दूसरों की नुक्ताचीनी, तनाव लेना, चिंताग्रस्त रहना।',
    challengesEn: 'Over-criticism of self and others, micro-managing tendencies, chronic worry.',
    physiqueHi: 'सन्तुलित शारीरिक गठन, सौम्य व तीखे नैन-नक्श, शालीन व विचारशील मुद्रा।',
    physiqueEn: 'Neat, proportional posture, sharp inquisitive eyes, poised and thoughtful carriage.',
    remedyHi: 'गौ माता को हरा चारा खिलाना, बुधवार को ॐ गं गणपतये नमः का जप, व्यवस्थित दिनचर्या।',
    remedyEn: 'Feeding green fodder to cows, chanting Om Gam Ganapataye Namah on Wednesdays.',
  },
  Libra: {
    symbol: 'तुला (Libra)',
    natureHi: 'वायु तत्व, चर राशि, स्वामी शुक्र। न्यायप्रिय, संतुलनवादी, कलात्मक, सौम्य एवं राजनयिक।',
    natureEn: 'Airy, cardinal sign ruled by Venus. Diplomatic, harmonious, aesthetic, justice-seeking.',
    temperamentHi: 'सद्भाव व शांति बनाए रखना, विवादों को सुलझाना, सौंदर्य व सुरुचिपूर्ण जीवन का प्रेमी।',
    temperamentEn: 'Natural mediator, peacekeeper, refined aesthetic taste, deep love for fair partnerships.',
    strengthsHi: 'राजनयिक बातचीत (Diplomacy), निष्पक्ष निर्णय, सामाजिक आकर्षण, साझेदारी में सफलता।',
    strengthsEn: 'Negotiation mastery, impartial justice, social grace, thriving in collaborative enterprises.',
    challengesHi: 'निर्णय लेने में असमंजस (अनिर्णय की स्थिति), दूसरों को खुश रखने के चक्कर में खुद का नुकसान।',
    challengesEn: 'Indecisiveness under pressure, people-pleasing at personal expense, conflict avoidance.',
    physiqueHi: 'आकर्षक मुस्कान, सुंदर रूप, संतुलित चाल-ढाल, सुंदर व आकर्षक व्यक्तित्व।',
    physiqueEn: 'Symmetrical facial features, charming smile, refined poise, pleasing demeanor.',
    remedyHi: 'सफेद चंदन का तिलक, मां भगवती दुर्गा की आराधना, शुक्रवार को जरूरतमंदों को चीनी या चावल दान।',
    remedyEn: 'Sandalwood paste tilak, Durga Saptashati recitation, donating rice/sugar on Fridays.',
  },
  Scorpio: {
    symbol: 'वृश्चिक (Scorpio)',
    natureHi: 'जल तत्व, स्थिर राशि, स्वामी मंगल/केतु। गूढ़, तीव्र, रहस्यमयी, दृढ़ निश्चयी एवं अंतर्मुखी।',
    natureEn: 'Watery, fixed sign ruled by Mars. Intense, investigative, determined, transformative.',
    temperamentHi: 'अति-गंभीर दृष्टिकोण, किसी के झूठ को तुरंत पकड़ना, कभी हार न मानने का अदम्य जज्बा।',
    temperamentEn: 'Profound psychological radar, piercing discernment of truth, indefatigable resilience.',
    strengthsHi: 'अटूट मानसिक शक्ति, संकट से राख से उठने की क्षमता (Phoenix), गहरी शोध बुद्धि, निष्ठा।',
    strengthsEn: 'Titan mental endurance, phoenix-like regeneration from setbacks, research depth, unyielding loyalty.',
    challengesHi: 'प्रतिशोध की भावना, अत्यधिक संशय (शक करना), अपनी भावनाओं को अंदर ही अंदर दबाना।',
    challengesEn: 'Grudge-holding, hyper-suspicion, secrecy, bottling up emotional wounds until explosion.',
    physiqueHi: 'तीखी व भेदक दृष्टि, सुगठित शारीरिक ढांचा, शांत परंतु चुंबकीय व्यक्तित्व।',
    physiqueEn: 'Intense magnetic eyes, sturdy muscular frame, quiet yet commanding aura.',
    remedyHi: 'हनुमान जी को सिंदूर व चमेली का तेल अर्पित करना, महामृत्युंजय मंत्र जप, जल में तांबा दान।',
    remedyEn: 'Offering Sindoor to Lord Hanuman, chanting Mahamrityunjaya Mantra, maintaining water purity.',
  },
  Sagittarius: {
    symbol: 'धनु (Sagittarius)',
    natureHi: 'अग्नि तत्व, द्विस्वभाव राशि, स्वामी गुरु। दार्शनिक, आशावादी, सत्यवादी, धर्मनिष्ठ व मार्गदर्शक।',
    natureEn: 'Fiery, dual sign ruled by Jupiter. Philosophical, visionary, truthful, dharmic, mentor.',
    temperamentHi: 'उच्च आदर्श, सत्य का अनुसरण, न्याय और ज्ञान का प्रसार, साहसिक यात्राओं का प्रेमी।',
    temperamentEn: 'Elevated ethics, relentless pursuit of wisdom, global visionary thinking, love of exploration.',
    strengthsHi: 'असीम आशावाद, गुरु समान मार्गदर्शन क्षमता, दूरदर्शिता, खुले दिल से सहायता करना।',
    strengthsEn: 'Boundless optimism, natural mentoring capacity, strategic foresight, intellectual generosity.',
    challengesHi: 'बिना मांगे सलाह देना, अत्यधिक स्पष्टवादिता से दूसरों को चोट पहुंचाना, अति-आशावाद।',
    challengesEn: 'Preachiness, blunt honesty that hurts sensitivities, over-promising through idealism.',
    physiqueHi: 'लंबा या सुडौल कद, विशाल मस्तक, स्पष्ट व आत्मविश्वास भरी वाणी, उत्साही चाल।',
    physiqueEn: 'Tall proportional frame, broad forehead, resonant speaking cadence, energetic posture.',
    remedyHi: 'बृहस्पतिवार को हल्दी या केसर का तिलक, चने की दाल व गुड़ का दान, गुरु व बुजुर्गों का आदर।',
    remedyEn: 'Saffron/turmeric tilak on Thursdays, donating yellow pulses, serving elders and gurus.',
  },
  Capricorn: {
    symbol: 'मकर (Capricorn)',
    natureHi: 'पृथ्वी तत्व, चर राशि, स्वामी शनि। कर्मठ, अनुशासित, व्यावहारिक, धैर्यवान एवं महत्वाकांक्षी।',
    natureEn: 'Earthy, cardinal sign ruled by Saturn. Industrious, disciplined, pragmatic, ambitious.',
    temperamentHi: 'समय का पाबंद, शून्य से शिखर तक पहुंचने की क्षमता, शांत रहकर निरंतर कार्य करना।',
    temperamentEn: 'Time-disciplined, self-made builder mentality, emotional restraint, strategic perseverance.',
    strengthsHi: 'अतुलनीय कार्यकुशलता, संगठन निर्माण क्षमता, वित्तीय सावधानी, दीर्घकालिक सफलता।',
    strengthsEn: 'Relentless work ethic, structural leadership, financial realism, monumental long-range achievement.',
    challengesHi: 'अत्यधिक गंभीरता, कार्य का तनाव घर लाना, भावनाओं को व्यक्त करने में संकोच, निराशावाद।',
    challengesEn: 'Over-seriousness, inability to disconnect from work, emotional coldness, cynicism.',
    physiqueHi: 'पतला या गठीला शरीर, गंभीर चेहरा, गहरी विचारशील आंखें, अनुशासित हाव-भाव।',
    physiqueEn: 'Lean resilient build, serious and composed countenance, steady, measured steps.',
    remedyHi: 'शनिवार को पीपल वृक्ष के नीचे सरसों के तेल का दीपक, निर्धनों को भोजन व ॐ शं शनैश्चराय नमः जप।',
    remedyEn: 'Mustard oil lamp under Peepal on Saturdays, feeding the needy, chanting Shani Mantra.',
  },
  Aquarius: {
    symbol: 'कुंभ (Aquarius)',
    natureHi: 'वायु तत्व, स्थिर राशि, स्वामी शनि/राहु। मानवतावादी, दूरदर्शी, मौलिक चिंतक एवं क्रांतिकारी।',
    natureEn: 'Airy, fixed sign ruled by Saturn. Humanitarian, unconventional, innovative, progressive.',
    temperamentHi: 'रूढ़िवादिता का विरोध, सामाजिक सुधार की इच्छा, तकनीक व नवाचार का प्रेमी, निष्पक्ष दृष्टि।',
    temperamentEn: 'Anti-dogmatic, passion for social upliftment, technological curiosity, universal objectivity.',
    strengthsHi: 'क्रांतिकारी विचार, समूह का नेतृत्व, निष्पक्ष न्याय, भविष्य की तकनीकों को पहले समझना।',
    strengthsEn: 'Disruptive innovation, egalitarian leadership, humanitarian empathy, scientific insight.',
    challengesHi: 'भावनात्मक दूरी (Alloofness), विद्रोही स्वभाव, अत्यधिक सैद्धांतिक होना।',
    challengesEn: 'Emotional detachment, rebelliousness for its own sake, abstract stubbornness.',
    physiqueHi: 'आकर्षक कद-काठी, विचारशील ललाट, मित्रवत मुस्कान, स्पष्ट और स्वतंत्र अंदाज।',
    physiqueEn: 'Well-proportioned carriage, open and intellectual brow, friendly yet independent gaze.',
    remedyHi: 'शनिवार को काले तिल या उड़द का दान, असहाय लोगों की गुप्त सेवा, प्राणायाम व ध्यान।',
    remedyEn: 'Donating black sesame/urad on Saturdays, anonymous charity to the downtrodden, breathwork.',
  },
  Pisces: {
    symbol: 'मीन (Pisces)',
    natureHi: 'जल तत्व, द्विस्वभाव राशि, स्वामी गुरु/केतु। आध्यात्मिक, दयालु, कल्पनावान, त्यागी एवं ज्ञानी।',
    natureEn: 'Watery, dual sign ruled by Jupiter. Spiritual, compassionate, imaginative, selfless, mystic.',
    temperamentHi: 'गहरा आंतरिक संसार, दूसरों के कष्टों से द्रवित होना, कला व संगीत में रुचि, मोक्ष की चाह।',
    temperamentEn: 'Vast inner emotional cosmos, boundless compassion, artistic sensitivity, longing for liberation.',
    strengthsHi: 'दिव्य अंतर्दृष्टि (Clairvoyance), निस्वार्थ सेवा, कलात्मक सृजन, क्षमा करने का विशाल हृदय।',
    strengthsEn: 'Transcendent intuition, unconditional empathy, creative genius, boundless forgiveness.',
    challengesHi: 'काल्पनिक दुनिया में खोए रहना, वास्तविकता से पलायन, अत्यधिक त्याग से स्वयं का नुकसान।',
    challengesEn: 'Escapism, daydreaming without practical execution, boundary issues leading to being exploited.',
    physiqueHi: 'कोमल शारीरिक गठन, विशाल व करुणा से भरी आंखें, शांत आभा, मंद मुस्कान।',
    physiqueEn: 'Gentle and soothing presence, large liquid eyes brimming with compassion, soft step.',
    remedyHi: 'विष्णु सहस्रनाम का पाठ, गुरुवार को केसर या पीले चंदन का तिलक, मछलियों को आटे की गोलियां खिलाना।',
    remedyEn: 'Vishnu Sahasranama chanting, saffron tilak on Thursdays, feeding wheat pellets to fish.',
  },
};

// 12 Moon Sign Emotional Profiles
export const MOON_SIGN_PROFILES: Record<
  ZodiacSign,
  {
    mindsetHi: string;
    mindsetEn: string;
    emotionalCoreHi: string;
    emotionalCoreEn: string;
    innerPeaceTipsHi: string;
    innerPeaceTipsEn: string;
  }
> = {
  Aries: {
    mindsetHi: 'तीव्र विचार, त्वरित प्रतिक्रियाएं, स्वतंत्रता की गहरी आवश्यकता एवं चुनौतियों से प्रेरणा।',
    mindsetEn: 'Action-oriented subconscious, instantaneous reflexes, thriving on direct conquest and autonomy.',
    emotionalCoreHi: 'मन को निष्क्रियता और इंतजार से बेचैनी होती है; सक्रिय खेल और व्यायाम से शांति मिलती है।',
    emotionalCoreEn: 'Restlessness under enforced stagnation; calms through vigorous physical exercise.',
    innerPeaceTipsHi: 'प्रतिदिन 10 मिनट मौन बैठकर श्वास पर ध्यान दें; क्रोध के समय तत्काल उत्तर देने से बचें।',
    innerPeaceTipsEn: 'Practice 10 minutes of silent breath meditation; delay instant reactions when agitated.',
  },
  Taurus: {
    mindsetHi: 'स्थिर व शांत भावनाएं, सुरक्षा और स्थायित्व की तलाश, सुंदर वातावरण से मानसिक तृप्ति।',
    mindsetEn: 'Emotionally exalted, deeply grounded, anchored by financial stability and serene harmony.',
    emotionalCoreHi: 'अनिश्चितता और अचानक बदलाव से मन अशांत होता है; प्रकृति व संगीत से तुरंत तरोताजा होता है।',
    emotionalCoreEn: 'Disturbed by sudden unpredictable chaos; rejuvenated through nature walks and classical music.',
    innerPeaceTipsHi: 'शुक्रवार को दूध या खीर का सेवन करें; चांदी के पात्र में जल पीने से मानसिक शांति बढ़ेगी।',
    innerPeaceTipsEn: 'Savor warm kheer on Fridays; drink water stored in pure silver vessels for lunar ease.',
  },
  Gemini: {
    mindsetHi: 'विचारों का निरंतर प्रवाह, संवाद व सूचनाओं की भूख, बहु-आयामी दृष्टिकोण।',
    mindsetEn: 'Hyper-active intellect, constant appetite for knowledge, thrives on witty intellectual dialogue.',
    emotionalCoreHi: 'अकेलेपन या एकरसता से घबराहट; विचार साझा करने पर मन हल्का महसूस करता है।',
    emotionalCoreEn: 'Restlessness in sensory deprivation or isolation; finds serenity through journaling and dialogue.',
    innerPeaceTipsHi: 'सोने से 1 घंटा पूर्व मोबाइल बंद करें; प्रतिदिन तुलसी पत्र युक्त जल का सेवन करें।',
    innerPeaceTipsEn: 'Digital detox 60 minutes before bedtime; consume fresh basil-infused water at dawn.',
  },
  Cancer: {
    mindsetHi: 'अत्यंत संवेदनशील, मातृ तुल्य स्नेह, पारिवारिक वातावरण से मन का सीधा जुड़ाव।',
    mindsetEn: 'Own sign of Moon; oceanic emotional depth, profound intuitive radar, deeply maternal instincts.',
    emotionalCoreHi: 'पूर्णिमा और अमावस्या पर मनोदशा में उतार-चढ़ाव; प्रियजनों की उपेक्षा से गहरा आघात।',
    emotionalCoreEn: 'Mood ebbs and flows with lunar tides; sensitive to emotional coldness or perceived abandonment.',
    innerPeaceTipsHi: 'शिव चालीसा का नित्य पाठ; माता के चरण स्पर्श कर दिन की शुरुआत करें; जल का सम्मान करें।',
    innerPeaceTipsEn: 'Recite Shiva Chalisa daily; seek maternal blessings; never waste clean drinking water.',
  },
  Leo: {
    mindsetHi: 'आत्मसम्मान व मान-सम्मान की तीव्र भावना, उदार हृदय, सराहना मिलने पर सर्वोत्तम प्रदर्शन।',
    mindsetEn: 'Solar-infused lunar psyche; aristocratic nobility, magnanimity, thrives on sincere validation.',
    emotionalCoreHi: 'अपमान या उपेक्षा सहन नहीं होती; नेतृत्व का अवसर मिलने पर मन आनंदित होता है।',
    emotionalCoreEn: 'Deeply wounded by public humiliation; shines and blossoms when granted authority to protect.',
    innerPeaceTipsHi: 'गायत्री मंत्र का 21 बार प्रातः जप करें; दूसरों की छोटी गलतियों को क्षमा करने का अभ्यास करें।',
    innerPeaceTipsEn: 'Chant Gayatri Mantra 21 times at dawn; consciously practice letting go of pride bruises.',
  },
  Virgo: {
    mindsetHi: 'सूक्ष्म विश्लेषण, व्यवस्था प्रिय, हर स्थिति का तार्किक मूल्यांकन, अत्यधिक चिंतन।',
    mindsetEn: 'Methodical mind, perfection-seeking subconscious, dissects emotions with sharp logic.',
    emotionalCoreHi: 'अव्यवस्था या काम में त्रुटि से तनाव; दूसरों की सेवा और समस्या सुलझाने से आंतरिक सुख।',
    emotionalCoreEn: 'Stressed by disorder or broken commitments; finds profound peace in useful practical service.',
    innerPeaceTipsHi: 'सप्ताह में एक दिन डिजिटल उपवास करें; ध्यान व प्राणायाम से अत्यधिक सोचने की आदत रोकें।',
    innerPeaceTipsEn: 'Observe periodic digital fasting; quiet chronic overthinking with alternate nostril breathing.',
  },
  Libra: {
    mindsetHi: 'संतुलन, न्यायप्रियता, कलात्मक वातावरण की चाह, सौहार्दपूर्ण संबंधों से मानसिक संतोष।',
    mindsetEn: 'Aesthetic balance seeker, deeply wired for relational peace, harmony, and mutual respect.',
    emotionalCoreHi: 'कड़वाहट व झगड़ों से मन व्यथित हो जाता है; सुंदर संगीत और सज्जित वातावरण से शांति मिलती है।',
    emotionalCoreEn: 'Exhausted by toxic arguments; restores psychic vitality in orderly, beautiful settings.',
    innerPeaceTipsHi: 'सफेद चंदन की खुशबू का प्रयोग करें; महत्वपूर्ण निर्णय लेते समय दूसरों के दबाव में न आएं।',
    innerPeaceTipsEn: 'Use authentic white sandalwood aroma; center decisions on personal truth rather than appeasement.',
  },
  Scorpio: {
    mindsetHi: 'गंभीर, गूढ़ अंतर्दृष्टि, अटूट निष्ठा, किसी भी बात की तह तक जाने की तीव्र प्रवृत्ति।',
    mindsetEn: 'Debilitated Moon sign; intense psychic depth, hyper-vigilant radar, transformative resilience.',
    emotionalCoreHi: 'विश्वासघात से अत्यधिक पीड़ा; अपनी कमजोरियां किसी को न दिखाने का गुप्त प्रयास।',
    emotionalCoreEn: 'Devastated by betrayal; guards vulnerable core fiercely; capacity to rise stronger from any pain.',
    innerPeaceTipsHi: 'ॐ नमः शिवाय का 108 बार मानसिक जप; अतीत के कटु अनुभवों को क्षमा करके छोड़ देने का संकल्प।',
    innerPeaceTipsEn: 'Chant Om Namah Shivaya 108 times; consciously forgive and release historical grudges.',
  },
  Sagittarius: {
    mindsetHi: 'आशावादी, दार्शनिक, सत्य का खोजी, उच्च आदर्शों और खुलेपन से भरपूर दृष्टिकोण।',
    mindsetEn: 'Expansive Jupiterian psyche; natural optimism, thirst for metaphysical meaning and spiritual growth.',
    emotionalCoreHi: 'संकीर्ण मानसिकता या पाबंदियों से घुटन; ज्ञानवर्धक पुस्तकों और सत्संग से परम आनंद।',
    emotionalCoreEn: 'Suffocated by petty dogmatism; finds emotional ecstasy in philosophical inquiry and pilgrimage.',
    innerPeaceTipsHi: 'प्रतिदिन गीता के एक श्लोक का अर्थ सहित अध्ययन करें; पीले चंदन का तिलक ललाट पर लगाएं।',
    innerPeaceTipsEn: 'Reflect upon one Bhagavad Gita verse daily; apply yellow sandalwood tilak to Ajna chakra.',
  },
  Capricorn: {
    mindsetHi: 'अनुशासित, व्यावहारिक, कर्तव्यनिष्ठ, कार्य की सफलता से ही आत्म-संतुष्टि पाने वाला।',
    mindsetEn: 'Saturnine mind; stoic emotional discipline, high duty consciousness, delayed emotional gratification.',
    emotionalCoreHi: 'असुरक्षा और विफलता का अंतर्निहित भय; योजनाबद्ध प्रगति से ही वास्तविक मानसिक सुकून।',
    emotionalCoreEn: 'Inner dread of vulnerability or professional failure; calms only through step-by-step progress.',
    innerPeaceTipsHi: 'काम के साथ-साथ परिवार को भी समय दें; शनिवार को सरसों तेल का दान व ध्यान का अभ्यास करें।',
    innerPeaceTipsEn: 'Schedule deliberate downtime away from professional duties; practice grounding meditation.',
  },
  Aquarius: {
    mindsetHi: 'मानवतावादी, स्वतंत्र, अनोखे विचारों का धनी, सामाजिक कल्याण की गहरी चिंता।',
    mindsetEn: 'Universalist mind; emotionally detached yet deeply caring for humanity; unconventional thinker.',
    emotionalCoreHi: 'रूढ़िवादिता और अंधविश्वास से मानसिक विद्रोह; समान विचारधारा वाले मित्रों के साथ सुखद अनुभव।',
    emotionalCoreEn: 'Revolts against forced conformity; rejuvenates when discussing progressive futuristic ideas.',
    innerPeaceTipsHi: 'प्रतिदिन खुली हवा में टहलें; योग निद्रा का अभ्यास करें; समाज सेवा में थोड़ा समय अवश्य दें।',
    innerPeaceTipsEn: 'Take morning walks under open sky; practice Yoga Nidra to relieve subconscious tension.',
  },
  Pisces: {
    mindsetHi: 'अति-संवेदनशील, दयालु, आध्यात्मिक, कला व कल्पना की असीम गहराइयों में विचरण करने वाला।',
    mindsetEn: 'Mystical oceanic psyche; transcendent compassion, porous boundaries, artistic imagination.',
    emotionalCoreHi: 'दूसरों की नकारात्मक ऊर्जा को तुरंत सोख लेना; एकांत और प्रार्थना से ही आंतरिक संतुलन।',
    emotionalCoreEn: 'Absorbs environmental negativity like a psychic sponge; heals through sacred solitary contemplation.',
    innerPeaceTipsHi: 'नियमित रूप से ध्यान और प्रार्थना करें; नकारात्मक लोगों से उचित दूरी बनाए रखने का संकल्प लें।',
    innerPeaceTipsEn: 'Maintain daily sacred solitude and prayer; establish healthy energetic boundaries with others.',
  },
};

// Sun House Profiles
export const SUN_HOUSE_PROFILES: Record<
  number,
  {
    roleHi: string;
    roleEn: string;
    fatherRelationHi: string;
    fatherRelationEn: string;
    careerOrientationHi: string;
    careerOrientationEn: string;
  }
> = {
  1: {
    roleHi: 'लग्न में सूर्य: तेजस्वी व्यक्तित्व, दृढ़ आत्मसम्मान, प्राकृतिक नेतृत्व क्षमता एवं स्वाभिमान।',
    roleEn: 'Sun in 1st House: Radiant charisma, unyielding dignity, natural leadership, and high self-esteem.',
    fatherRelationHi: 'पिता का व्यक्तित्व प्रभावशाली रहा है; पिता के सिद्धांतों का जातक पर गहरा संस्कार है।',
    fatherRelationEn: 'Father possesses strong commanding presence; deeply influential in formative ethics.',
    careerOrientationHi: 'प्रशासनिक पद, सरकारी क्षेत्र, स्वतंत्र उद्यम या उच्च प्रबंधकीय भूमिकाएं सर्वोत्तम हैं।',
    careerOrientationEn: 'Government administration, corporate executive roles, sovereign entrepreneurship.',
  },
  2: {
    roleHi: 'द्वितीय भाव में सूर्य: प्रभावशाली वाणी, पैतृक मान-सम्मान एवं धन संचय के प्रति सजगता।',
    roleEn: 'Sun in 2nd House: Commanding vocal resonance, lineage prestige, protective of family legacy.',
    fatherRelationHi: 'पिता से आर्थिक और नैतिक मार्गदर्शन प्राप्त होता है; कभी-कभी विचारों का टकराव संभव।',
    fatherRelationEn: 'Father is an anchor for family values; occasional friction over strict traditional expectations.',
    careerOrientationHi: 'वित्तीय प्रबंधन, पारिवारिक व्यवसाय, परामर्श, सरकारी राजस्व या प्रशासनिक वाणिज्य।',
    careerOrientationEn: 'Financial governance, executive advisory, family enterprise, commercial administration.',
  },
  3: {
    roleHi: 'तृतीय भाव में सूर्य: पराक्रमी, साहसी, अपने दम पर भाग्य निर्माण करने वाला एवं कुशल संचारक।',
    roleEn: 'Sun in 3rd House: Valorous, courageous, self-made conqueror, impactful communicator.',
    fatherRelationHi: 'पिता जातक के पराक्रम और पुरुषार्थ के सबसे बड़े प्रेरक रहे हैं।',
    fatherRelationEn: 'Father serves as the prime catalyst for developing courage, discipline, and self-reliance.',
    careerOrientationHi: 'मीडिया, संचार, तकनीक, उद्यमशीलता, रक्षा, खेल या स्वतंत्र पेशेवर कार्य।',
    careerOrientationEn: 'Digital media, strategic communications, tech ventures, defense, bold entrepreneurship.',
  },
  4: {
    roleHi: 'चतुर्थ भाव में सूर्य: कुलदीपक योग, मातृभूमि व घर के प्रति निष्ठा, अचल संपत्ति का स्वामी।',
    roleEn: 'Sun in 4th House: Pillar of home lineage, deep patriotic pride, command over real estate.',
    fatherRelationHi: 'पिता का घर और परिवार के निर्णयों में सर्वोच्च स्थान; पैतृक संस्कारों का गहरा असर।',
    fatherRelationEn: 'Father holds high foundational status in household decisions; conservative traditional roots.',
    careerOrientationHi: 'रियल एस्टेट, राजनीति, लोक प्रशासन, ऑटोमोबाइल या गृह-संबंधित बड़े उद्योग।',
    careerOrientationEn: 'Public administration, real estate infrastructure, politics, heavy engineering.',
  },
  5: {
    roleHi: 'पंचम भाव में सूर्य: तीव्र बुद्धि, पूर्व संचित पुण्यों का लाभ, मंत्र विद्या व उच्च बौद्धिक क्षमता।',
    roleEn: 'Sun in 5th House: Brilliant intellect, past-life merits, creative mastery, sharp advisory skills.',
    fatherRelationHi: 'पिता ज्ञानी व संस्कारवान; पिता के आशीर्वाद से जातक की बुद्धि में निरंतर वृद्धि।',
    fatherRelationEn: 'Father is scholarly or values intellectual achievements; inspires higher academic pursuit.',
    careerOrientationHi: 'रणनीतिक सलाहकार, शिक्षा, शेयर बाजार/वित्तीय विश्लेषण, शोध, राजनीति व रचनात्मक क्षेत्र।',
    careerOrientationEn: 'Strategic advisory, educational leadership, policy making, research, investment strategy.',
  },
  6: {
    roleHi: 'षष्ठ भाव में सूर्य: शत्रुहंता योग, प्रतियोगिताओं में विजय, रोगों से लड़ने की अद्भुत क्षमता।',
    roleEn: 'Sun in 6th House: Shatruhanta (crusher of opposition), victorious in competitions, robust vitality.',
    fatherRelationHi: 'पिता ने जीवन में कड़े संघर्षों से सफलता पाई है; जातक को भी वही जुझारूपन विरासत में मिला।',
    fatherRelationEn: 'Father is a disciplined fighter who overcame severe obstacles; instilled relentless grit.',
    careerOrientationHi: 'प्रतियोगी परीक्षाएं (UPSC/राज्य सेवा), कानूनी क्षेत्र, चिकित्सा/सर्जरी, बैंकिंग व सुरक्षा।',
    careerOrientationEn: 'Civil service competitions, corporate legal battles, medical surgery, forensic governance.',
  },
  7: {
    roleHi: 'सप्तम भाव में सूर्य: प्रभावशाली जीवनसाथी, व्यापारिक साझेदारियों में प्रभुत्व, जनसंपर्क का तेज।',
    roleEn: 'Sun in 7th House: Dominant public partnerships, dignified spouse, magnetic public resonance.',
    fatherRelationHi: 'पिता सामाजिक रूप से प्रतिष्ठित और प्रतिष्ठित वर्ग में आदरणीय स्थान रखते हैं।',
    fatherRelationEn: 'Father commands high societal recognition and values prestigious partnerships.',
    careerOrientationHi: 'पब्लिक रिलेशंस, विदेश व्यापार, कॉर्पोरेट पार्टनरशिप्स, डिप्लोमेसी व जनसेवा।',
    careerOrientationEn: 'International commerce, diplomatic missions, public relations, high-profile alliances.',
  },
  8: {
    roleHi: 'अष्टम भाव में सूर्य: गूढ़ विद्याओं का ज्ञान, आध्यात्मिक परिवर्तन, अचानक मिलने वाले सम्मान का योग।',
    roleEn: 'Sun in 8th House: Deep occult perception, transformative spiritual breakthroughs, research depth.',
    fatherRelationHi: 'पिता के जीवन में गहरे उतार-चढ़ाव रहे हैं; पिता के साथ संबंध शांत और गंभीर रहते हैं।',
    fatherRelationEn: 'Father has navigated intense life transformations; relationship is philosophical and quiet.',
    careerOrientationHi: 'शोध व अनुसंधान, डेटा साइंस, टैक्स ऑडिट, बीमा, गूढ़ विज्ञान, पुरातत्व व खनन।',
    careerOrientationEn: 'Scientific R&D, forensic accounting, cybersecurity, insurance, occult sciences, geology.',
  },
  9: {
    roleHi: 'नवम भाव में सूर्य: परम भाग्यशाली, धर्म-कर्म में निष्ठा, गुरु कृपा व उच्च ईश्वरीय अनुग्रह।',
    roleEn: 'Sun in 9th House: Exalted fortune, dharmic righteousness, guru grace, elevated philosophical stature.',
    fatherRelationHi: 'पिता मार्गदर्शक और गुरु के समान; पिता के संस्कारों से जातक का जीवन प्रकाशित।',
    fatherRelationEn: 'Father revered as primary spiritual mentor; deep dharmic alignment and ancestral pride.',
    careerOrientationHi: 'उच्च न्यायपालिका, विदेश सेवा, विश्वविद्यालय प्रोफेसर, आध्यात्मिक नेतृत्व, तीर्थ प्रबंधन।',
    careerOrientationEn: 'High judiciary, international diplomacy, university professorship, philanthropic leadership.',
  },
  10: {
    roleHi: 'दशम भाव में सूर्य: दिग्विजयी योग, करियर का शीर्ष शिखर, शासन-सत्ता में सर्वोच्च प्रभाव।',
    roleEn: 'Sun in 10th House: Digbali (maximum directional strength), pinnacle of career triumph, sovereign authority.',
    fatherRelationHi: 'पिता का करियर अनुकरणीय रहा है; जातक पिता के नाम को और आगे बढ़ाने वाला होता है।',
    fatherRelationEn: 'Father achieved distinguished career milestones; native expands and honors paternal fame.',
    careerOrientationHi: 'आईएएस/आईपीएस, मंत्री/विधायक, सीईओ/प्रबंध निदेशक, सर्वोच्च प्रशासनिक और निर्णयकारी पद।',
    careerOrientationEn: 'Senior civil service, ministers, corporate CEO/directors, sovereign leadership pinnacles.',
  },
  11: {
    roleHi: 'एकादश भाव में सूर्य: नियमित महालाभ, प्रभावशाली मित्रों का साथ, सभी महत्वाकांक्षाओं की पूर्ति।',
    roleEn: 'Sun in 11th House: Sustained elite revenues, access to influential power brokers, fulfilled ambitions.',
    fatherRelationHi: 'पिता आर्थिक और सामाजिक रूप से समृद्ध रहे हैं; पिता के सहयोग से नए मार्ग खुलते हैं।',
    fatherRelationEn: 'Father is socially resourceful; actively champions native’s long-range professional ambitions.',
    careerOrientationHi: 'बड़े कॉर्पोरेट नेटवर्क, वेंचर कैपिटलिस्ट, सरकारी अनुबंध, बड़े संगठन के प्रमुख।',
    careerOrientationEn: 'Venture capital, large government contracts, high-yield enterprise, institutional leadership.',
  },
  12: {
    roleHi: 'द्वादश भाव में सूर्य: विदेश में प्रतिष्ठा, आध्यात्मिक मुक्ति, एकांत में चिंतन व दानशीलता।',
    roleEn: 'Sun in 12th House: Foreign acclaim, spiritual liberation, introspective enlightenment, charitable grace.',
    fatherRelationHi: 'पिता से आध्यात्मिक दूरी या विदेश गमन के कारण दूर रहना संभव; मन में गहरा आदर।',
    fatherRelationEn: 'Father has spiritual or foreign inclinations; relationship thrives through mutual silent reverence.',
    careerOrientationHi: 'मल्टीनेशनल कंपनियां, विदेश में कार्य/पीआर, दूतावास, अस्पताल प्रशासन, आध्यात्मिक आश्रम।',
    careerOrientationEn: 'Multinational corporations, foreign diplomatic missions, hospital administration, spiritual centers.',
  },
};

// House descriptions customized for each house
export function getHouseDetailedAnalysis(
  houseNumber: number,
  kundali: KundaliResult
): {
  houseNameHi: string;
  houseNameEn: string;
  sign: ZodiacSign;
  signHindi: string;
  lord: VedicPlanet;
  lordHindi: string;
  lordHouse: number;
  planetsHere: PlanetInfo[];
  analysisHi: string;
  analysisEn: string;
} {
  const house = kundali.houses.find((h) => h.houseNumber === houseNumber) || kundali.houses[houseNumber - 1];
  const sign = house?.sign || kundali.ascendantSign;
  const signHindi = house?.signHindi || kundali.ascendantSignHindi;
  const lord = SIGN_LORDS[sign] || 'Mars';
  const lordHindi = SIGN_LORDS_HINDI[sign] || 'मंगल';
  const lordPlanet = kundali.planets.find((p) => p.name === lord);
  const lordHouse = lordPlanet?.house || 1;
  const planetsHere = house?.planets || [];

  const planetsTextHi =
    planetsHere.length > 0
      ? planetsHere.map((p) => `${p.hindiName} (${p.signHindi} ${p.formattedDegree || `${p.degree.toFixed(1)}°`})`).join(', ')
      : 'कोई प्रत्यक्ष ग्रह नहीं (दृष्टि प्रभाव लागू)';
  const planetsTextEn =
    planetsHere.length > 0
      ? planetsHere.map((p) => `${p.name} in ${p.sign}`).join(', ')
      : 'No direct occupant (governed via lordship and aspects)';

  let analysisHi = '';
  let analysisEn = '';

  switch (houseNumber) {
    case 1:
      analysisHi = `लग्न भाव में ${signHindi} राशि है और लग्नेश ${lordHindi} भाव ${lordHouse} में विराजमान हैं। यह स्थिति जातक को स्वाभाविक आत्मबल, सिद्धांतों पर अडिग रहने की शक्ति और जीवन में स्वतंत्र पहचान बनाने की ऊर्जा प्रदान करती है। ${
        planetsHere.length > 0 ? `लग्न में स्थित ${planetsTextHi} व्यक्तित्व को विशेष आभा और आकर्षण देते हैं।` : 'लग्न निर्दोष होने से स्वास्थ्य उत्तम और मन स्थिर रहेगा।'
      }`;
      analysisEn = `Ascendant occupies ${sign} with Lagna Lord ${lord} positioned in House ${lordHouse}. This anchors strong self-identity, resilient constitution, and worldly drive.`;
      break;
    case 2:
      analysisHi = `द्वितीय धन भाव में ${signHindi} राशि है जिसके स्वामी ${lordHindi} भाव ${lordHouse} में स्थित हैं। यह संयोजन जातक की वाणी को प्रभावशाली बनाता है और पारिवारिक संपत्ति तथा निरंतर संचित धन की बचत को सुनिश्चित करता है। ${
        planetsHere.length > 0 ? `इस भाव में स्थित ग्रह: ${planetsTextHi}।` : ''
      }`;
      analysisEn = `2nd house of wealth and family holds ${sign} ruled by ${lord} placed in House ${lordHouse}, governing liquid capital and eloquence.`;
      break;
    case 3:
      analysisHi = `तृतीय सहज भाव में ${signHindi} राशि है। भावेश ${lordHindi} का भाव ${lordHouse} में होना जातक को निडर, उद्यमशील और नए प्रयोग करने वाला बनाता है। भाई-बहनों और मित्रों के साथ संबंध सक्रिय रहेंगे।`;
      analysisEn = `3rd house of courage holds ${sign} with ruler ${lord} in House ${lordHouse}, granting bold initiative and communicative prowess.`;
      break;
    case 4:
      analysisHi = `चतुर्थ सुख भाव में ${signHindi} राशि है, जिसके अधिपति ${lordHindi} भाव ${lordHouse} में हैं। यह स्थिति जातक को भूमि, भवन, वाहन और माता का सुख प्रदान करती है। मानसिक शांति के लिए घर का वातावरण सात्विक रखें।`;
      analysisEn = `4th house of domestic bliss and vehicles occupies ${sign} ruled by ${lord} in House ${lordHouse}, bestowing real estate assets and maternal blessings.`;
      break;
    case 5:
      analysisHi = `पंचम बुद्धि व संतान भाव में ${signHindi} राशि है। पंचमेश ${lordHindi} का भाव ${lordHouse} में बैठना जातक को कुशाग्र बुद्धि, उत्कृष्ट निर्णय क्षमता, पूर्व जन्म के संचित पुण्यों का लाभ और रचनात्मक प्रतिभा प्रदान करता है।`;
      analysisEn = `5th house of intellect and past merits holds ${sign} governed by ${lord} in House ${lordHouse}, fueling sharp analytical depth and creative foresight.`;
      break;
    case 6:
      analysisHi = `षष्ठ रिपु भाव में ${signHindi} राशि है। इसके स्वामी ${lordHindi} भाव ${lordHouse} में स्थित हैं। जातक प्रतियोगी परीक्षाओं और कार्यक्षेत्र की प्रतिस्पर्धाओं में शत्रुओं पर सहज विजय प्राप्त करेगा। स्वास्थ्य का ध्यान रखें।`;
      analysisEn = `6th house of competition and health holds ${sign} ruled by ${lord} in House ${lordHouse}, guaranteeing victory in professional rivalries.`;
      break;
    case 7:
      analysisHi = `सप्तम जाया भाव में ${signHindi} राशि है, जिसके स्वामी ${lordHindi} भाव ${lordHouse} में विराजमान हैं। यह भाव जीवनसाथी के स्वभाव और व्यापारिक साझेदारियों को दर्शाता है। जीवनसाथी समझदार और परिवार को जोड़ने वाला होगा।`;
      analysisEn = `7th house of marriage holds ${sign} ruled by ${lord} in House ${lordHouse}, governing marital harmony and partnership contracts.`;
      break;
    case 8:
      analysisHi = `अष्टम आयु भाव में ${signHindi} राशि है। अष्टमेश ${lordHindi} का भाव ${lordHouse} में होना जातक को गूढ़ विद्याओं, अनुसंधान, अप्रत्याशित आर्थिक लाभ और दीर्घायु का आशीर्वाद देता है।`;
      analysisEn = `8th house of longevity and transformation holds ${sign} with ruler ${lord} in House ${lordHouse}, awakening deep investigative and occult intuition.`;
      break;
    case 9:
      analysisHi = `नवम भाग्य भाव में ${signHindi} राशि है, जिसके स्वामी ${lordHindi} भाव ${lordHouse} में बैठे हैं। यह जातक के जीवन का सबसे शुभ त्रिकोण है, जो धर्म, ईश्वरीय कृपा, पिता के सहयोग और दूरगामी भाग्योदय को सुनिश्चित करता है।`;
      analysisEn = `9th house of fortune and dharma occupies ${sign} with ${lord} situated in House ${lordHouse}, anchoring spiritual grace and life-long good luck.`;
      break;
    case 10:
      analysisHi = `दशम कर्म भाव में ${signHindi} राशि है और दशमेश ${lordHindi} भाव ${lordHouse} में स्थित हैं। यह कार्यक्षेत्र में प्रतिष्ठा, उच्च पद, नेतृत्व और सामाजिक सम्मान की पराकाष्ठा को दर्शाता है।`;
      analysisEn = `10th house of career and executive status holds ${sign} with ruler ${lord} in House ${lordHouse}, driving professional authority and societal recognition.`;
      break;
    case 11:
      analysisHi = `एकादश लाभ भाव में ${signHindi} राशि है। एकादशेश ${lordHindi} का भाव ${lordHouse} में होना आय के बहु-आयामी स्रोतों, प्रभावशाली मित्रों और महत्वाकांक्षाओं की पूर्णता का स्पष्ट संकेत है।`;
      analysisEn = `11th house of revenues and ambitions holds ${sign} ruled by ${lord} in House ${lordHouse}, ensuring steady cash flows and high-profile networks.`;
      break;
    case 12:
      analysisHi = `द्वादश व्यय व मोक्ष भाव में ${signHindi} राशि है, जिसके अधिपति ${lordHindi} भाव ${lordHouse} में हैं। यह विदेश यात्राओं, विदेशी कंपनियों से संपर्क, दानशीलता और अंततः आध्यात्मिक मोक्ष की दिशा को स्पष्ट करता है।`;
      analysisEn = `12th house of foreign affairs and liberation holds ${sign} ruled by ${lord} in House ${lordHouse}, facilitating overseas connections and spiritual peace.`;
      break;
  }

  return {
    houseNameHi: house?.significationsHindi || `भाव ${houseNumber}`,
    houseNameEn: house?.significations || `House ${houseNumber}`,
    sign,
    signHindi,
    lord,
    lordHindi,
    lordHouse,
    planetsHere,
    analysisHi,
    analysisEn,
  };
}

// Personalized Career Analysis
export function getCareerAnalysis(kundali: KundaliResult): {
  tenthSign: ZodiacSign;
  tenthSignHindi: string;
  tenthLord: VedicPlanet;
  tenthLordHindi: string;
  tenthLordHouse: number;
  suitableSectors: { sectorHi: string; sectorEn: string; stars: string; rolesHi: string; rolesEn: string }[];
  summaryHi: string;
  summaryEn: string;
} {
  const tenthHouse = kundali.houses.find((h) => h.houseNumber === 10) || kundali.houses[9];
  const tenthSign = tenthHouse?.sign || kundali.ascendantSign;
  const tenthSignHindi = tenthHouse?.signHindi || kundali.ascendantSignHindi;
  const tenthLord = SIGN_LORDS[tenthSign] || 'Mars';
  const tenthLordHindi = SIGN_LORDS_HINDI[tenthSign] || 'मंगल';
  const tenthLordPlanet = kundali.planets.find((p) => p.name === tenthLord);
  const tenthLordHouse = tenthLordPlanet?.house || 10;

  // Build sector suitability dynamically based on 10th lord and sign
  let sectors = [
    {
      sectorHi: 'प्रबंधन, कॉर्पोरेट नेतृत्व व प्रशासन',
      sectorEn: 'Executive Management & Administration',
      stars: '⭐⭐⭐⭐⭐',
      rolesHi: 'सीईओ, निदेशक, प्रशासनिक अधिकारी, नीति निर्माता',
      rolesEn: 'CEO, Director, Administrator, Strategic Lead',
    },
    {
      sectorHi: 'आईटी, डेटा विश्लेषण व डिजिटल टेक्नोलॉजी',
      sectorEn: 'IT, Data Science & Emerging Tech',
      stars: '⭐⭐⭐⭐',
      rolesHi: 'सॉफ्टवेयर आर्किटेक्ट, तकनीकी कंसलटेंट, डेटा साइंटिस्ट',
      rolesEn: 'Software Architect, Tech Consultant, Lead Engineer',
    },
    {
      sectorHi: 'व्यापार, वित्त, बैंकिंग व निवेश',
      sectorEn: 'Commerce, Banking & Investments',
      stars: '⭐⭐⭐⭐⭐',
      rolesHi: 'उद्यमी, निवेश सलाहकार, सीए, वित्तीय विश्लेषक',
      rolesEn: 'Entrepreneur, Wealth Manager, Auditor, Trader',
    },
    {
      sectorHi: 'शिक्षा, शोध, कानून व परामर्श',
      sectorEn: 'Education, Legal & Advisory Services',
      stars: '⭐⭐⭐⭐',
      rolesHi: 'प्राध्यापक, कॉर्पोरेट वकील, शोधकर्ता, मार्गदर्शक',
      rolesEn: 'Professor, Legal Counsel, Research Scientist, Mentor',
    },
  ];

  if (tenthLord === 'Mars' || tenthLord === 'Sun') {
    sectors[0].stars = '⭐⭐⭐⭐⭐';
    sectors[0].sectorHi = 'प्रशासन, रक्षा, पुलिस, रियल एस्टेट व इंजीनियरिंग';
    sectors[0].rolesHi = 'आईएएस/आईपीएस, सेना अधिकारी, बिल्डर, चीफ प्रोजेक्ट हेड';
  } else if (tenthLord === 'Mercury') {
    sectors[1].stars = '⭐⭐⭐⭐⭐';
    sectors[2].stars = '⭐⭐⭐⭐⭐';
    sectors[1].sectorHi = 'सॉफ्टवेयर, ई-कॉमर्स, मीडिया, एनालिटिक्स व डिजिटल ट्रेडिंग';
  } else if (tenthLord === 'Jupiter') {
    sectors[3].stars = '⭐⭐⭐⭐⭐';
    sectors[3].sectorHi = 'न्यायपालिका, विश्वविद्यालय शोध, उच्च बैंकिंग व आध्यात्मिक मार्गदर्शन';
  } else if (tenthLord === 'Venus') {
    sectors[0].stars = '⭐⭐⭐⭐⭐';
    sectors[0].sectorHi = 'कला, मीडिया, फैशन, आर्किटेक्चर, हॉस्पिटैलिटी व लक्जरी व्यापार';
  }

  const summaryHi = `आपकी कुंडली में दशम भाव में ${tenthSignHindi} राशि है और इसके अधिपति ${tenthLordHindi} भाव ${tenthLordHouse} में स्थित हैं। यह ग्रहीय स्थिति जातक को कार्यक्षेत्र में स्वाभिमान, कुशल कार्यशैली और संगठन संचालन की क्षमता प्रदान करती है। ${tenthLordHindi} की दशा-अंतर्दशा में करियर में सर्वोच्च पदोन्नति के योग बनते हैं।`;
  const summaryEn = `Tenth house holds ${tenthSign} ruled by ${tenthLord} situated in House ${tenthLordHouse}. This anchors high professional integrity and executive influence.`;

  return {
    tenthSign,
    tenthSignHindi,
    tenthLord,
    tenthLordHindi,
    tenthLordHouse,
    suitableSectors: sectors,
    summaryHi,
    summaryEn,
  };
}

// Personalized Marriage Analysis
export function getMarriageAnalysis(kundali: KundaliResult): {
  seventhSign: ZodiacSign;
  seventhSignHindi: string;
  seventhLord: VedicPlanet;
  seventhLordHindi: string;
  seventhLordHouse: number;
  spouseTraitsHi: string;
  spouseTraitsEn: string;
  maritalHarmonyHi: string;
  maritalHarmonyEn: string;
  mangalStatusHi: string;
  mangalStatusEn: string;
} {
  const seventhHouse = kundali.houses.find((h) => h.houseNumber === 7) || kundali.houses[6];
  const seventhSign = seventhHouse?.sign || 'Libra';
  const seventhSignHindi = seventhHouse?.signHindi || 'तुला';
  const seventhLord = SIGN_LORDS[seventhSign] || 'Venus';
  const seventhLordHindi = SIGN_LORDS_HINDI[seventhSign] || 'शुक्र';
  const seventhLordPlanet = kundali.planets.find((p) => p.name === seventhLord);
  const seventhLordHouse = seventhLordPlanet?.house || 7;

  const spouseTraitMap: Record<ZodiacSign, { hi: string; en: string }> = {
    Aries: {
      hi: 'साहसी, स्पष्टवादी, ऊर्जावान, आत्मनिर्भर और आत्मसम्मान से भरपूर जीवनसाथी।',
      en: 'Bold, candid, self-reliant, dynamic and fiercely loyal spouse.',
    },
    Taurus: {
      hi: 'धैर्यवान, सौम्य, सौंदर्यप्रिय, व्यावहारिक, पारिवारिक मूल्यों को समर्पित जीवनसाथी।',
      en: 'Patient, graceful, aesthetically inclined, devoted to family stability.',
    },
    Gemini: {
      hi: 'बुद्धिमान, कुशल वक्ता, हंसमुख, बहुमुखी प्रतिभा का धनी एवं मिलनसार जीवनसाथी।',
      en: 'Witty, intellectually stimulating, articulate, sociable and adaptable partner.',
    },
    Cancer: {
      hi: 'अत्यंत संवेदनशील, स्नेही, मातृ तुल्य ख्याल रखने वाला, परिवार को सर्वोपरि मानने वाला जीवनसाथी।',
      en: 'Deeply caring, empathetic, family-centric, intuitively connected partner.',
    },
    Leo: {
      hi: 'स्वाभिमानी, गरिमामयी, राजा समान उदार हृदय, नेतृत्व क्षमता से युक्त जीवनसाथी।',
      en: 'Noble, dignified, magnanimous, commands respect and holds pride high.',
    },
    Virgo: {
      hi: 'सुव्यवस्थित, कर्तव्यनिष्ठ, व्यावहारिक, समझदार एवं हर कार्य को सलीके से करने वाला जीवनसाथी।',
      en: 'Meticulous, practical, orderly, supportive and analytically intelligent partner.',
    },
    Libra: {
      hi: 'कलात्मक, न्यायप्रिय, सुरुचिपूर्ण, विवादों को सुलझाने में माहिर एवं सुंदर जीवनसाथी।',
      en: 'Charming, diplomatic, fair-minded, aesthetically gifted and harmonious spouse.',
    },
    Scorpio: {
      hi: 'गंभीर, गहरा निष्ठावान, अंतर्दृष्टियुक्त, संकट में चट्टान की तरह साथ निभाने वाला जीवनसाथी।',
      en: 'Fiercely loyal, deeply perceptive, protective and emotionally transformative partner.',
    },
    Sagittarius: {
      hi: 'धार्मिक, आशावादी, ज्ञानी, मार्गदर्शक, स्वतंत्र विचारों वाला एवं उच्च आदर्शों का जीवनसाथी।',
      en: 'Philosophical, optimistic, honorable, expansive in outlook and spiritually aligned.',
    },
    Capricorn: {
      hi: 'कर्मठ, अनुशासित, गंभीर, व्यावहारिक, पारिवारिक जिम्मेदारियों को पूर्ण निष्ठा से निभाने वाला।',
      en: 'Industrious, disciplined, dependable, mature, and deeply committed to long-term goals.',
    },
    Aquarius: {
      hi: 'प्रगतिशील, मानवीय, मित्रवत, स्वतंत्र सोच वाला एवं रूढ़िवादिता से परे जीवनसाथी।',
      en: 'Forward-looking, humanitarian, friendly, intellectually autonomous spouse.',
    },
    Pisces: {
      hi: 'दयालु, आध्यात्मिक, कल्पनावान, त्यागी, निस्वार्थ प्रेम करने वाला एवं शांत स्वभाव जीवनसाथी।',
      en: 'Compassionate, spiritual, imaginative, profoundly empathetic and forgiving partner.',
    },
  };

  const traits = spouseTraitMap[seventhSign] || spouseTraitMap.Libra;

  const isManglik = kundali.dosha?.isManglik ?? false;
  const mangalPercent = kundali.dosha?.manglikPercentage ?? 0;
  const mangalStatusHi = isManglik
    ? `कुंडली में मंगल का प्रभाव (${mangalPercent}%) दृष्टिगोचर होता है। शास्त्रीय परिहार एवं जीवनसाथी के साथ परिपक्व संवाद से यह दोष स्वतः शांत हो जाता है।`
    : `कुंडली में मंगल दोष उपस्थित नहीं है (पूर्णतः मांगलिक दोष मुक्त)। दांपत्य जीवन शांतिपूर्ण और सौहार्दपूर्ण रहेगा।`;
  const mangalStatusEn = isManglik
    ? `Manglik influence calculated at ${mangalPercent}%, subject to classical scriptural cancellations (Parihara).`
    : `Free from Mangal Dosha. Favorable foundational harmony for marital life.`;

  const maritalHarmonyHi = `सप्तम भाव में ${seventhSignHindi} राशि है और सप्तमेश ${seventhLordHindi} भाव ${seventhLordHouse} में विराजमान हैं। जीवनसाथी के साथ सामंजस्य बनाए रखने के लिए विचारों का सम्मान करें। सप्तमेश अथवा शुक्र/गुरु की अंतर्दशा में दांपत्य सुख में विशेष वृद्धि होती है।`;
  const maritalHarmonyEn = `7th house holds ${seventhSign} with lord ${seventhLord} placed in House ${seventhLordHouse}, shaping relationship expectations and domestic bliss.`;

  return {
    seventhSign,
    seventhSignHindi,
    seventhLord,
    seventhLordHindi,
    seventhLordHouse,
    spouseTraitsHi: traits.hi,
    spouseTraitsEn: traits.en,
    maritalHarmonyHi,
    maritalHarmonyEn,
    mangalStatusHi,
    mangalStatusEn,
  };
}

// Personalized Gemstone and Rudraksha Recommender
export function getGemstoneAndRudraksha(kundali: KundaliResult): {
  lifeStone: { nameHi: string; nameEn: string; planetHi: string; metalHi: string; fingerHi: string; mantraHi: string };
  luckyStone: { nameHi: string; nameEn: string; planetHi: string; metalHi: string; fingerHi: string; mantraHi: string };
  beneficStone: { nameHi: string; nameEn: string; planetHi: string; metalHi: string; fingerHi: string; mantraHi: string };
  forbiddenGemsHi: string;
  forbiddenGemsEn: string;
  recommendedRudraksha: { mukhiHi: string; mukhiEn: string; deityHi: string; benefitHi: string };
} {
  const lagna = kundali.ascendantSign;
  const ninthHouse = kundali.houses.find((h) => h.houseNumber === 9) || kundali.houses[8];
  const ninthSign = ninthHouse?.sign || 'Sagittarius';
  const fifthHouse = kundali.houses.find((h) => h.houseNumber === 5) || kundali.houses[4];
  const fifthSign = fifthHouse?.sign || 'Leo';

  // Lagna Gemstones
  const GEM_MAP: Record<
    ZodiacSign,
    { nameHi: string; nameEn: string; planetHi: string; metalHi: string; fingerHi: string; mantraHi: string }
  > = {
    Aries: { nameHi: 'लाल मूंगा (Red Coral)', nameEn: 'Red Coral (Moonga)', planetHi: 'मंगल', metalHi: 'तांबा या सोना', fingerHi: 'अनामिका (Ring Finger)', mantraHi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' },
    Taurus: { nameHi: 'हीरा / ओपल (Diamond / White Opal)', nameEn: 'Diamond / Opal', planetHi: 'शुक्र', metalHi: 'चांदी या प्लेटिनम', fingerHi: 'मध्यमा या अनामिका', mantraHi: 'ॐ शुं शुक्राय नमः' },
    Gemini: { nameHi: 'पन्ना (Emerald)', nameEn: 'Emerald (Panna)', planetHi: 'बुध', metalHi: 'सोना या कांसा', fingerHi: 'कनिष्ठिका (Little Finger)', mantraHi: 'ॐ बुं बुधाय नमः' },
    Cancer: { nameHi: 'सच्चा मोती (Natural Pearl)', nameEn: 'Natural Pearl (Moti)', planetHi: 'चंद्रमा', metalHi: 'शुद्ध चांदी', fingerHi: 'कनिष्ठिका (Little Finger)', mantraHi: 'ॐ सों सोमाय नमः' },
    Leo: { nameHi: 'माणिक्य (Ruby)', nameEn: 'Ruby (Manik)', planetHi: 'सूर्य', metalHi: 'तांबा या अष्टधातु/सोना', fingerHi: 'अनामिका (Ring Finger)', mantraHi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' },
    Virgo: { nameHi: 'पन्ना (Emerald)', nameEn: 'Emerald (Panna)', planetHi: 'बुध', metalHi: 'सोना या चांदी', fingerHi: 'कनिष्ठिका (Little Finger)', mantraHi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' },
    Libra: { nameHi: 'हीरा / ओपल (Diamond / Opal)', nameEn: 'Diamond / Opal', planetHi: 'शुक्र', metalHi: 'चांदी या सफेद सोना', fingerHi: 'मध्यमा (Middle Finger)', mantraHi: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः' },
    Scorpio: { nameHi: 'लाल मूंगा (Red Coral)', nameEn: 'Red Coral (Moonga)', planetHi: 'मंगल', metalHi: 'तांबा या सोना', fingerHi: 'अनामिका (Ring Finger)', mantraHi: 'ॐ अं अंगारकाय नमः' },
    Sagittarius: { nameHi: 'पीला पुखराज (Yellow Sapphire)', nameEn: 'Yellow Sapphire (Pukhraj)', planetHi: 'गुरु', metalHi: 'पीला सोना या पीतल', fingerHi: 'तर्जनी (Index Finger)', mantraHi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' },
    Capricorn: { nameHi: 'नीलम / नीली (Blue Sapphire / Iolite)', nameEn: 'Blue Sapphire (Neelam)', planetHi: 'शनि', metalHi: 'पंचधातु या चांदी', fingerHi: 'मध्यमा (Middle Finger)', mantraHi: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' },
    Aquarius: { nameHi: 'नीलम / नीली (Blue Sapphire / Iolite)', nameEn: 'Blue Sapphire (Neelam)', planetHi: 'शनि', metalHi: 'चांदी या पंचधातु', fingerHi: 'मध्यमा (Middle Finger)', mantraHi: 'ॐ शं शनैश्चराय नमः' },
    Pisces: { nameHi: 'पीला पुखराज (Yellow Sapphire)', nameEn: 'Yellow Sapphire (Pukhraj)', planetHi: 'गुरु', metalHi: 'सोना या पीतल', fingerHi: 'तर्जनी (Index Finger)', mantraHi: 'ॐ बृं बृहस्पतये नमः' },
  };

  const lifeStone = GEM_MAP[lagna] || GEM_MAP.Aries;
  const luckyStone = GEM_MAP[ninthSign] || GEM_MAP.Sagittarius;
  const beneficStone = GEM_MAP[fifthSign] || GEM_MAP.Leo;

  // Forbidden gems based on dusthana lords
  let forbiddenGemsHi = 'नीलम व पन्ना धारण करने से पूर्व सूक्ष्म ग्रहीय परीक्षण आवश्यक है।';
  let forbiddenGemsEn = 'Caution against unvetted dark sapphire or emerald.';
  if (lagna === 'Aries') {
    forbiddenGemsHi = 'हीरा (शुक्र मारकेश) एवं पन्ना (बुध षष्ठेश) कभी भी धारण न करें।';
    forbiddenGemsEn = 'Strictly avoid Diamond and Emerald (functional malefics for Aries).';
  } else if (lagna === 'Taurus') {
    forbiddenGemsHi = 'पीला पुखराज (गुरु अष्टमेश) व माणिक्य कभी धारण न करें।';
    forbiddenGemsEn = 'Avoid Yellow Sapphire and Ruby for Taurus Ascendant.';
  } else if (lagna === 'Cancer') {
    forbiddenGemsHi = 'नीलम (शनि मारकेश) एवं पन्ना (बुध द्वादशेश) सर्वथा वर्जित हैं।';
    forbiddenGemsEn = 'Strictly avoid Blue Sapphire and Emerald for Cancer Ascendant.';
  } else if (lagna === 'Leo') {
    forbiddenGemsHi = 'नीलम (शनि षष्ठेश/सप्तमेश) एवं हीरा धारण करने से बचें।';
    forbiddenGemsEn = 'Avoid Blue Sapphire and Diamond for Leo Ascendant.';
  } else if (lagna === 'Scorpio') {
    forbiddenGemsHi = 'हीरा (शुक्र द्वादशेश) व पन्ना (बुध अष्टमेश) पूर्णतः वर्जित हैं।';
    forbiddenGemsEn = 'Strictly avoid Diamond and Emerald for Scorpio Ascendant.';
  } else if (lagna === 'Sagittarius') {
    forbiddenGemsHi = 'हीरा (शुक्र षष्ठेश/एकादशेश) कभी धारण न करें।';
    forbiddenGemsEn = 'Avoid Diamond for Sagittarius Ascendant.';
  } else if (lagna === 'Capricorn' || lagna === 'Aquarius') {
    forbiddenGemsHi = 'माणिक्य (सूर्य अष्टमेश/सप्तमेश) व पीला पुखराज धारण न करें।';
    forbiddenGemsEn = 'Avoid Ruby and Yellow Sapphire for Saturn-ruled Ascendants.';
  }

  // Rudraksha Recommender
  const RUDRAKSHA_MAP: Record<ZodiacSign, { mukhiHi: string; mukhiEn: string; deityHi: string; benefitHi: string }> = {
    Aries: { mukhiHi: '3-मुखी अथवा 11-मुखी रुद्राक्ष', mukhiEn: '3-Mukhi or 11-Mukhi Rudraksha', deityHi: 'अग्नि देव एवं श्री हनुमान जी', benefitHi: 'आत्मबल, ऊर्जा व मंगल दोष का शमन' },
    Taurus: { mukhiHi: '6-मुखी रुद्राक्ष', mukhiEn: '6-Mukhi Rudraksha', deityHi: 'भगवान कार्तिकेय', benefitHi: 'कलात्मक आकर्षण, सौहार्द व शुक्र की अनुकूलता' },
    Gemini: { mukhiHi: '4-मुखी रुद्राक्ष', mukhiEn: '4-Mukhi Rudraksha', deityHi: 'भगवान ब्रह्मा', benefitHi: 'बुद्धि, वाणी की मिठास व स्मरण शक्ति में वृद्धि' },
    Cancer: { mukhiHi: '2-मुखी रुद्राक्ष', mukhiEn: '2-Mukhi Rudraksha', deityHi: 'अर्धनारीश्वर (शिव-पार्वती)', benefitHi: 'मानसिक शांति, अनिद्रा से मुक्ति व भावनात्मक संतुलन' },
    Leo: { mukhiHi: '12-मुखी अथवा 1-मुखी रुद्राक्ष', mukhiEn: '12-Mukhi or 1-Mukhi Rudraksha', deityHi: 'भगवान सूर्य नारायण', benefitHi: 'प्रशासनिक प्रभाव, मान-सम्मान व हृदय की ऊर्जा' },
    Virgo: { mukhiHi: '4-मुखी अथवा 10-मुखी रुद्राक्ष', mukhiEn: '4-Mukhi or 10-Mukhi Rudraksha', deityHi: 'भगवान विष्णु व ब्रह्मा', benefitHi: 'व्यवसायिक सफलता, तार्किक एकाग्रता व तनाव मुक्ति' },
    Libra: { mukhiHi: '6-मुखी अथवा 13-मुखी रुद्राक्ष', mukhiEn: '6-Mukhi or 13-Mukhi Rudraksha', deityHi: 'कामदेव एवं कार्तिकेय', benefitHi: 'दांपत्य प्रेम, आर्थिक समृद्धि व व्यक्तित्व आकर्षण' },
    Scorpio: { mukhiHi: '3-मुखी अथवा 8-मुखी रुद्राक्ष', mukhiEn: '3-Mukhi or 8-Mukhi Rudraksha', deityHi: 'अग्नि देव एवं भगवान गणेश', benefitHi: 'बाधाओं से मुक्ति, निडरता व गुप्त संकटों का निवारण' },
    Sagittarius: { mukhiHi: '5-मुखी अथवा 9-मुखी रुद्राक्ष', mukhiEn: '5-Mukhi or 9-Mukhi Rudraksha', deityHi: 'भगवान शिव (कालाग्नि रुद्र) व मां दुर्गा', benefitHi: 'ज्ञान, धर्म-कर्म में रुचि व उच्च भाग्योदय' },
    Capricorn: { mukhiHi: '7-मुखी अथवा 14-मुखी रुद्राक्ष', mukhiEn: '7-Mukhi or 14-Mukhi Rudraksha', deityHi: 'माता महालक्ष्मी व भगवान शिव', benefitHi: 'स्थायी धन, शनि की साढ़ेसाती में सुरक्षा व कार्य सफलता' },
    Aquarius: { mukhiHi: '7-मुखी अथवा 11-मुखी रुद्राक्ष', mukhiEn: '7-Mukhi or 11-Mukhi Rudraksha', deityHi: 'महालक्ष्मी व एकादश रुद्र', benefitHi: 'मानसिक तनाव निवारण, नवाचार व दीर्घकालिक सफलता' },
    Pisces: { mukhiHi: '5-मुखी अथवा 10-मुखी रुद्राक्ष', mukhiEn: '5-Mukhi or 10-Mukhi Rudraksha', deityHi: 'भगवान विष्णु एवं शिव', benefitHi: 'आध्यात्मिक शांति, ज्ञानार्जन व ईश्वरीय कृपा' },
  };

  const recommendedRudraksha = RUDRAKSHA_MAP[lagna] || RUDRAKSHA_MAP.Aries;

  return {
    lifeStone,
    luckyStone,
    beneficStone,
    forbiddenGemsHi,
    forbiddenGemsEn,
    recommendedRudraksha,
  };
}

// Personalized Health and Ayurvedic Tridosha Analysis
export function getHealthAyurvedaDetails(kundali: KundaliResult): {
  primaryDoshaHi: string;
  primaryDoshaEn: string;
  lagnaElementHi: string;
  lagnaElementEn: string;
  moonElementHi: string;
  moonElementEn: string;
  vulnerableOrgansHi: string;
  vulnerableOrgansEn: string;
  tableRows: (string | number)[][];
  dinacharyaTipsHi: string[];
  dinacharyaTipsEn: string[];
} {
  const lagnaElem = SIGN_ELEMENTS[kundali.ascendantSign] || SIGN_ELEMENTS.Aries;
  const moonElem = SIGN_ELEMENTS[kundali.moonSign] || SIGN_ELEMENTS.Aries;

  const sixthHouse = kundali.houses.find((h) => h.houseNumber === 6) || kundali.houses[5];
  const sixthSign = sixthHouse?.sign || 'Virgo';

  const ORGAN_MAP: Record<ZodiacSign, { hi: string; en: string }> = {
    Aries: { hi: 'मस्तिष्क, सिर, आंखें एवं चेहरे की नसें', en: 'Head, brain, ocular nerves, cranial area' },
    Taurus: { hi: 'गला, थायरॉयड, स्वरयंत्र एवं गर्दन', en: 'Throat, thyroid, vocal cords, neck' },
    Gemini: { hi: 'फेफड़े, श्वसन तंत्र, कंधे एवं हाथ', en: 'Lungs, respiratory tract, shoulders, hands' },
    Cancer: { hi: 'छाती, पेट, पाचन तंत्र व मानसिक शांति', en: 'Chest, stomach, digestive agni, psychic state' },
    Leo: { hi: 'हृदय, रीढ़ की हड्डी एवं रक्त संचार', en: 'Heart, spine, cardiovascular circulation' },
    Virgo: { hi: 'आंतें, उदर, पाचन एंजाइम व तंत्रिका तंत्र', en: 'Intestines, abdominal tract, nervous system' },
    Libra: { hi: 'गुर्दे (Kidneys), कमर व आंतरिक जल संतुलन', en: 'Kidneys, lumbar region, fluid equilibrium' },
    Scorpio: { hi: 'प्रजनन तंत्र, मलाशय व उत्सर्जन अंग', en: 'Reproductive organs, excretory system, vitality' },
    Sagittarius: { hi: 'यकृत (Liver), जांघें, कूल्हे व वसा संतुलन', en: 'Liver, thighs, arterial system, lipids' },
    Capricorn: { hi: 'घुटने, हड्डियां, जोड़ एवं त्वचा', en: 'Knees, skeletal structure, joints, skin' },
    Aquarius: { hi: 'पिंडलियां, टखने एवं रक्त वाहिकाएं', en: 'Calves, ankles, circulatory flow, shins' },
    Pisces: { hi: 'पैर के पंजे, तलवे एवं लसिका तंत्र (Lymph)', en: 'Feet, toes, lymphatic system, restful sleep' },
  };

  const vulnerable = ORGAN_MAP[sixthSign] || ORGAN_MAP.Virgo;

  const tableRows: (string | number)[][] = [
    ['जैविक प्रकृति (Tridosha)', `${lagnaElem.doshaHi} (लग्न: ${lagnaElem.hi})`, 'ऋतु अनुसार सात्विक आहार व पर्याप्त जलपान'],
    ['संवेदनशील अंग (6th House)', `${vulnerable.hi} (${sixthSign})`, 'नियमित प्राणायाम व नियमित स्वास्थ्य जांच'],
    ['मानसिक ऊर्जा (Lunar Mind)', `${moonElem.doshaHi} (चंद्र: ${moonElem.hi})`, 'सोने से पूर्व ध्यान व रात्रि 10 बजे तक शयन'],
    ['रोग प्रतिरोधक क्षमता (Immunity)', 'स्वाभाविक प्रतिरोधक शक्ति मध्यम से प्रबल', 'प्रतिदिन 20 मिनट सूर्य नमस्कार व योग'],
  ];

  const dinacharyaTipsHi = [
    `आपकी मूल प्रकृति ${lagnaElem.doshaHi} है; अतः अत्यधिक मिर्च-मसाले या बासी भोजन से बचें।`,
    `षष्ठ भाव ${sixthSign} से संबंधित होने के कारण ${vulnerable.hi} की सुरक्षा पर विशेष ध्यान दें।`,
    'प्रातः काल तांबे या मिट्टी के पात्र का जल ग्रहण करने से पाचन अग्नि संतुलित रहती है।',
    'सप्ताह में कम से कम एक बार तेल मालिश (अभ्यंग) और वाक भ्रमण करें।',
  ];

  const dinacharyaTipsEn = [
    `Primary biological temperament is ${lagnaElem.dosha}; avoid highly processed or irregular meals.`,
    `Sixth house in ${sixthSign} suggests keeping ${vulnerable.en} well protected and nourished.`,
    'Early morning hydration balances metabolic agni and cleanses cellular tissues.',
    'Weekly herbal oil abhyanga and moderate outdoor walks sustain physical vitality.',
  ];

  return {
    primaryDoshaHi: lagnaElem.doshaHi,
    primaryDoshaEn: lagnaElem.dosha,
    lagnaElementHi: lagnaElem.hi,
    lagnaElementEn: lagnaElem.en,
    moonElementHi: moonElem.hi,
    moonElementEn: moonElem.en,
    vulnerableOrgansHi: vulnerable.hi,
    vulnerableOrgansEn: vulnerable.en,
    tableRows,
    dinacharyaTipsHi,
    dinacharyaTipsEn,
  };
}

// Personalized Wealth & Assets Analysis
export function getWealthDetails(kundali: KundaliResult): {
  secondLordHi: string;
  secondLordHouse: number;
  eleventhLordHi: string;
  eleventhLordHouse: number;
  dhanaYogasHi: string[];
  dhanaYogasEn: string[];
  tableRows: (string | number)[][];
  summaryHi: string;
  summaryEn: string;
} {
  const secondHouse = kundali.houses.find((h) => h.houseNumber === 2) || kundali.houses[1];
  const secondSign = secondHouse?.sign || 'Taurus';
  const secondLord = SIGN_LORDS[secondSign] || 'Venus';
  const secondLordHi = SIGN_LORDS_HINDI[secondSign] || 'शुक्र';
  const secondLordPlanet = kundali.planets.find((p) => p.name === secondLord);
  const secondLordHouse = secondLordPlanet?.house || 2;

  const eleventhHouse = kundali.houses.find((h) => h.houseNumber === 11) || kundali.houses[10];
  const eleventhSign = eleventhHouse?.sign || 'Aquarius';
  const eleventhLord = SIGN_LORDS[eleventhSign] || 'Saturn';
  const eleventhLordHi = SIGN_LORDS_HINDI[eleventhSign] || 'शनि';
  const eleventhLordPlanet = kundali.planets.find((p) => p.name === eleventhLord);
  const eleventhLordHouse = eleventhLordPlanet?.house || 11;

  const dhanaYogasHi = [
    `द्वितीयेश ${secondLordHi} का भाव ${secondLordHouse} में होना संचित धन (Savings) में वृद्धि कराता है।`,
    `एकादशेश ${eleventhLordHi} का भाव ${eleventhLordHouse} में बैठना आय के नियमित स्रोतों का निर्माण करता है।`,
    'गुरु और शुक्र का शुभ केंद्र-त्रिकोण प्रभाव वित्तीय स्थिरता और संपत्ति लाभ देता है।',
  ];

  const dhanaYogasEn = [
    `2nd Lord ${secondLord} in House ${secondLordHouse} anchors sustained liquid capital preservation.`,
    `11th Lord ${eleventhLord} in House ${eleventhLordHouse} activates multifaceted recurring revenue streams.`,
    'Benefic Kendra-Trikona geometry fortifies real estate equity and financial durability.',
  ];

  const tableRows: (string | number)[][] = [
    ['संचित धन (2nd House)', `${secondSign} राशि | भावेश: ${secondLordHi}`, `भाव ${secondLordHouse} में स्थित • स्थिर संचय`],
    ['आय व लाभ (11th House)', `${eleventhSign} राशि | भावेश: ${eleventhLordHi}`, `भाव ${eleventhLordHouse} में स्थित • नियमित प्रवाह`],
    ['भाग्य व समृद्धि (9th House)', `${kundali.houses[8]?.signHindi || 'धनु'} राशि`, 'ईश्वरीय कृपा एवं पैतृक संस्कारों का सहयोग'],
    ['धन योग स्तर', 'प्रबल शुभ धन योग सक्रिय', 'दीर्घकालिक निवेश व अनुशासन से अपार समृद्धि'],
  ];

  const summaryHi = `आपकी कुंडली में द्वितीय धन भाव के स्वामी ${secondLordHi} भाव ${secondLordHouse} में हैं और एकादशेश ${eleventhLordHi} भाव ${eleventhLordHouse} में विराजमान हैं। यह जातक को आर्थिक रूप से आत्मनिर्भर और बुद्धिमानी से धन का प्रबंधन करने वाला बनाता है। सट्टेबाजी और अनावश्यक जोखिम से बचें; दीर्घकालिक सुरक्षित निवेश सर्वोत्तम फल देगा।`;
  const summaryEn = `2nd lord ${secondLord} in House ${secondLordHouse} and 11th lord ${eleventhLord} in House ${eleventhLordHouse} create solid wealth accumulation potential.`;

  return {
    secondLordHi,
    secondLordHouse,
    eleventhLordHi,
    eleventhLordHouse,
    dhanaYogasHi,
    dhanaYogasEn,
    tableRows,
    summaryHi,
    summaryEn,
  };
}

// Personalized Education & Skills Details
export function getEducationDetails(kundali: KundaliResult): {
  fourthLordHi: string;
  fifthLordHi: string;
  tableRows: (string | number)[][];
  summaryHi: string;
  summaryEn: string;
} {
  const fourthHouse = kundali.houses.find((h) => h.houseNumber === 4) || kundali.houses[3];
  const fourthSign = fourthHouse?.sign || 'Cancer';
  const fourthLordHi = SIGN_LORDS_HINDI[fourthSign] || 'चंद्रमा';

  const fifthHouse = kundali.houses.find((h) => h.houseNumber === 5) || kundali.houses[4];
  const fifthSign = fifthHouse?.sign || 'Leo';
  const fifthLordHi = SIGN_LORDS_HINDI[fifthSign] || 'सूर्य';

  const mercury = kundali.planets.find((p) => p.name === 'Mercury');
  const jupiter = kundali.planets.find((p) => p.name === 'Jupiter');

  const tableRows: (string | number)[][] = [
    ['प्रारंभिक शिक्षा (4th House)', `${fourthSign} राशि (स्वामी: ${fourthLordHi})`, 'दृढ़ शैक्षणिक नींव एवं माता का मार्गदर्शन'],
    ['उच्च बुद्धि व मेधा (5th House)', `${fifthSign} राशि (स्वामी: ${fifthLordHi})`, 'रचनात्मक शोध, तीव्र स्मरण शक्ति व दूरदर्शिता'],
    ['तार्किक बुद्धि (बुध ग्रह)', `${mercury?.signHindi || 'मिथुन'} (भाव ${mercury?.house || 1})`, 'डेटा विश्लेषण, भाषा दक्षता एवं त्वरित समझ'],
    ['ज्ञान व विवेक (गुरु ग्रह)', `${jupiter?.signHindi || 'धनु'} (भाव ${jupiter?.house || 9})`, 'नैतिक मूल्य, दार्शनिक चिंतन व उच्च सलाह'],
  ];

  const summaryHi = `चतुर्थ भाव (औपचारिक शिक्षा) के स्वामी ${fourthLordHi} और पंचम भाव (मेधा शक्ति) के स्वामी ${fifthLordHi} हैं। बुध और गुरु की स्थिति जातक को तार्किक और व्यावहारिक ज्ञान में निपुण बनाती है। जातक तकनीकी, प्रबंधन, कानून अथवा विश्लेषणात्मक विषयों में उत्कृष्ट प्रदर्शन करने में सक्षम है।`;
  const summaryEn = `4th lord ${fourthLordHi} and 5th lord ${fifthLordHi} combined with Mercury and Jupiter impart high cognitive agility and intellectual depth.`;

  return {
    fourthLordHi,
    fifthLordHi,
    tableRows,
    summaryHi,
    summaryEn,
  };
}

// Personalized Sade Sati and Saturn Transit Details
export function getSadeSatiDetails(kundali: KundaliResult): {
  statusTitleHi: string;
  statusTitleEn: string;
  phaseHi: string;
  phaseEn: string;
  natalSaturnPlacementHi: string;
  natalSaturnPlacementEn: string;
  tableRows: (string | number)[][];
  guidanceHi: string;
  guidanceEn: string;
} {
  const saturn = kundali.planets.find((p) => p.name === 'Saturn') || kundali.planets[6];
  const isSadeSati = kundali.dosha?.isSadeSati ?? false;
  const rawPhase = kundali.dosha?.sadeSatiPhase || '';

  let phaseHi = 'वर्तमान में आप शनि की साढ़ेसाती के प्रभाव से पूर्णतः मुक्त हैं।';
  let phaseEn = 'Currently completely free from the 7.5-year Sade Sati cycle.';
  let statusTitleHi = 'साढ़ेसाती मुक्त (No Sade Sati)';
  let statusTitleEn = 'Sade Sati Free';

  if (isSadeSati) {
    if (rawPhase.toLowerCase().includes('peak') || rawPhase.includes('शिखर')) {
      phaseHi = 'शिखर चरण (मध्य साढ़ेसाती) - जन्म चंद्रमा पर शनि का गोचर।';
      phaseEn = 'Peak Phase - Saturn transiting directly over natal Moon.';
      statusTitleHi = 'शिखर साढ़ेसाती सक्रिय (Peak Phase)';
      statusTitleEn = 'Peak Sade Sati Active';
    } else if (rawPhase.toLowerCase().includes('rising') || rawPhase.includes('उदय') || rawPhase.includes('प्रथम')) {
      phaseHi = 'प्रथम चरण (चढ़ती साढ़ेसाती) - जन्म चंद्रमा से द्वादश भाव में शनि।';
      phaseEn = 'Rising Phase - Saturn transiting 12th from natal Moon.';
      statusTitleHi = 'प्रथम चरण साढ़ेसाती (Rising Phase)';
      statusTitleEn = 'Rising Sade Sati Active';
    } else {
      phaseHi = 'तृतीय चरण (उतरती साढ़ेसाती) - जन्म चंद्रमा से द्वितीय भाव में शनि।';
      phaseEn = 'Setting Phase - Saturn transiting 2nd from natal Moon.';
      statusTitleHi = 'उतरती साढ़ेसाती (Setting Phase)';
      statusTitleEn = 'Setting Sade Sati Active';
    }
  }

  const natalSaturnPlacementHi = `जन्म कालीन शनि ${saturn.signHindi} राशि में भाव ${saturn.house} में स्थित हैं (अंश: ${saturn.formattedDegree || `${saturn.degree.toFixed(1)}°`}, स्थिति: ${saturn.dignityHindi || saturn.dignity})।`;
  const natalSaturnPlacementEn = `Natal Saturn occupies ${saturn.sign} in House ${saturn.house} (${saturn.formattedDegree}, dignity: ${saturn.dignity}).`;

  const tableRows: (string | number)[][] = [
    ['शनि की साढ़ेसाती स्थिति', isSadeSati ? '🔥 सक्रिय प्रभाव' : '✅ शांत एवं अनुकूल (मुक्त)', phaseHi],
    ['जन्मकालीन शनि स्थिति', `${saturn.signHindi} (भाव ${saturn.house})`, `${saturn.dignityHindi || saturn.dignity} • चेष्टा बल युक्त`],
    ['गोचर शनि की वर्तमान राशि', 'कुंभ / मीन संक्रमण काल', 'कर्म फल प्रदाता के रूप में न्यायप्रिय परिणाम'],
    ['शनि शांति का मूल मंत्र', 'ईमानदारी, परिश्रम व सेवा', 'शनिवार को पीपल वृक्ष के नीचे तेल का दीपक'],
  ];

  const guidanceHi = `शनि देव दंडनायक नहीं, बल्कि कर्मों के परिशोधक हैं। ${natalSaturnPlacementHi} जीवन में ईमानदारी, समय की पाबंदी और असहायों की सेवा से शनि का परम शुभ आशीर्वाद प्राप्त होता है। झूठे वादों और अहंकार से दूर रहें।`;
  const guidanceEn = `Saturn is the divine auditor of deeds. ${natalSaturnPlacementEn} Uncompromising integrity and service to labor classes transmute Saturnian discipline into enduring success.`;

  return {
    statusTitleHi,
    statusTitleEn,
    phaseHi,
    phaseEn,
    natalSaturnPlacementHi,
    natalSaturnPlacementEn,
    tableRows,
    guidanceHi,
    guidanceEn,
  };
}

// Personalized Divisional Charts (Vargas)
export function getDivisionalChartsDetails(
  kundali: KundaliResult,
  horaData: JagannathaHoraData
): {
  d1Lagna: string;
  d9Lagna: string;
  d10Lagna: string;
  vargottamaPlanets: string[];
  tableRows: (string | number)[][];
  summaryHi: string;
  summaryEn: string;
} {
  const d9Varga = horaData.vargas?.['D9'];
  const d10Varga = horaData.vargas?.['D10'];

  const d1Lagna = kundali.ascendantSignHindi;
  const d9Lagna = d9Varga?.ascendantSign || kundali.ascendantSign;
  const d10Lagna = d10Varga?.ascendantSign || kundali.ascendantSign;

  // Find Vargottama planets (same sign in D1 and D9)
  const vargottamaPlanets: string[] = [];
  if (d9Varga?.houses) {
    kundali.planets.forEach((p) => {
      // Find planet in D9
      const d9House = d9Varga.houses.find((h) => h.planets?.some((dp) => dp.name === p.name));
      if (d9House && d9House.sign === p.sign) {
        vargottamaPlanets.push(`${p.hindiName} (${p.signHindi})`);
      }
    });
  }

  const vargottamaText =
    vargottamaPlanets.length > 0
      ? vargottamaPlanets.join(', ')
      : 'वर्गोत्तम स्थिति: नवमांश में लग्न एवं ग्रहीय बल सुदृढ़ व क्रियाशील है।';

  const tableRows: (string | number)[][] = [
    ['D1 लग्न कुंडली (Rashi)', `${d1Lagna} लग्न`, 'भौतिक शरीर, समग्र स्वास्थ्य एवं जीवन का आधार'],
    ['D9 नवमांश कुंडली (Navamsha)', `${d9Lagna} लग्न`, 'दांपत्य सुख, आंतरिक चरित्र व 32 वर्ष बाद का भाग्य'],
    ['D10 दशमांश कुंडली (Dashamsha)', `${d10Lagna} लग्न`, 'आजीविका, पद-प्रतिष्ठा, करियर व सामाजिक कीर्ति'],
    ['वर्गोत्तम ग्रह (Vargottama)', vargottamaText, 'D1 व D9 में समान राशि; राजा के समान प्रभावशाली'],
  ];

  const summaryHi = `आपकी D1 लग्न कुंडली ${d1Lagna} की है, जबकि सूक्ष्म D9 नवमांश कुंडली का लग्न ${d9Lagna} और D10 दशमांश का लग्न ${d10Lagna} है। ${
    vargottamaPlanets.length > 0
      ? `आपकी कुंडली में वर्गोत्तम ग्रह (${vargottamaPlanets.join(', ')}) जीवन के कठिन मोड़ों पर रक्षा कवच का कार्य करते हैं।`
      : 'वर्ग कुंडलियों का यह विन्यास जातक को व्यावहारिक जीवन और दांपत्य में परिपक्वता प्रदान करता है।'
  }`;
  const summaryEn = `D1 Ascendant is ${d1Lagna}, D9 Navamsha Ascendant is ${d9Lagna}, and D10 Dashamsha is ${d10Lagna}. Micro-divisional harmonics confirm solid soul resilience.`;

  return {
    d1Lagna,
    d9Lagna,
    d10Lagna,
    vargottamaPlanets,
    tableRows,
    summaryHi,
    summaryEn,
  };
}
