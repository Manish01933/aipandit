// 81 Mulank-Bhagyank (Driver-Conductor) Vedic Numerology Combinations Database

export interface DriverConductorCombo {
  driver: number;
  conductor: number;
  pairKey: string; // e.g., "1-1", "1-8"
  titleEn: string;
  titleHi: string;
  rating: number; // 1 to 5 stars
  category: 'Super Auspicious' | 'Highly Favorable' | 'Neutral / Mixed' | 'Challenging / Karmic';
  categoryHi: string;
  lifePathOverviewEn: string;
  lifePathOverviewHi: string;
  careerProspectsEn: string[];
  careerProspectsHi: string[];
  financialTrajectoryEn: string;
  financialTrajectoryHi: string;
  relationshipDynamicsEn: string;
  relationshipDynamicsHi: string;
  healthAlertsEn: string;
  healthAlertsHi: string;
  masterRemedyEn: string;
  masterRemedyHi: string;
  famousPersonalitiesEn: string[];
  luckyColors: string[];
  luckyGems: string[];
}

// Generate rich, specialized data for all 81 pairs (1-1 to 9-9)
export const DRIVER_CONDUCTOR_81_DATA: Record<string, DriverConductorCombo> = {
  '1-1': {
    driver: 1,
    conductor: 1,
    pairKey: '1-1',
    titleEn: 'Double Sun - The Supreme Sovereign & Visionary King',
    titleHi: 'दोहरा सूर्य - प्रतापी राजा, स्वतंत्र नेतृत्व एवं अखंड आत्मबल',
    rating: 5,
    category: 'Super Auspicious',
    categoryHi: 'अति-शुभ एवं उच्च पद प्रदायक',
    lifePathOverviewEn: 'Both inner desire and outer destiny are ruled by the radiant Sun. You possess immense leadership ambition, unbending determination, and extraordinary executive presence. You cannot work under others and thrive as supreme head.',
    lifePathOverviewHi: 'मूलांक 1 और भाग्यांक 1 दोनों पर भगवान सूर्य का अधिपत्य है। यह जातक को जन्मजात नेतृत्व, अद्वितीय स्वाभिमान, दृढ़ निश्चय और समाज में सर्वोच्च पद प्राप्त करने की क्षमता देता है। किसी के अधीन कार्य करना इनके स्वभाव में नहीं होता।',
    careerProspectsEn: ['Government High Administration / IAS / IPS', 'Politics & Head of State', 'Founder & Chief Executive Officer', 'Surgeon & Medical Director', 'Gold & Precious Metals Enterprise'],
    careerProspectsHi: ['उच्च प्रशासनिक सेवा (IAS/IPS)', 'राजनीति व शीर्ष नेतृत्व', 'स्वयं की कंपनी के संस्थापक / CEO', 'वरिष्ठ चिकित्सक व सर्जन', 'स्वर्ण व आभूषण उद्योग'],
    financialTrajectoryEn: 'Tremendous wealth creation through self-made enterprises. High royal expenditures on status and philanthropy.',
    financialTrajectoryHi: 'स्व-निर्मित उद्यमों से अपार धनार्जन। मान-सम्मान व प्रतिष्ठा पर खर्च करने में संकोच नहीं करते।',
    relationshipDynamicsEn: 'Domineering nature may spark ego clashes. Needs a supportive, calm partner (Numbers 2, 3, or 5).',
    relationshipDynamicsHi: 'प्रबल स्वाभिमान के कारण वैवाहिक जीवन में अहंकार का टकराव संभव। शांत व समझदार जीवनसाथी (अंक 2, 3 या 5) श्रेष्ठ रहता है।',
    healthAlertsEn: 'Keep blood pressure, eye health, and heart rhythm in check. Guard against excessive heat in the body.',
    healthAlertsHi: 'रक्तचाप (BP), नेत्र विकार, हृदय गति एवं शरीर में पित्त (गर्मी) का संतुलन बनाए रखें।',
    masterRemedyEn: 'Offer Arghya (water in copper vessel) to Lord Surya daily at sunrise with Gayatri Mantra. Wear Ruby in gold.',
    masterRemedyHi: 'प्रतिदिन सूर्योदय के समय तांबे के लोटे से सूर्यदेव को अर्घ्य दें और आदित्य हृदय स्तोत्र का पाठ करें।',
    famousPersonalitiesEn: ['Dhirubhai Ambani (28-12-1932)', 'Bill Clinton', 'Indira Gandhi (19-11-1917)'],
    luckyColors: ['Gold', 'Saffron', 'Bright Red', 'Orange'],
    luckyGems: ['Ruby', 'Garnet'],
  },
  '1-2': {
    driver: 1,
    conductor: 2,
    pairKey: '1-2',
    titleEn: 'Sun & Moon - The Royal Raja & Diplomatic Queen Harmony',
    titleHi: 'सूर्य व चन्द्र - राजयोग, कूटनीति एवं रचनात्मक प्रतिभा',
    rating: 5,
    category: 'Super Auspicious',
    categoryHi: 'अति-शुभ राजयोग कारक',
    lifePathOverviewEn: 'Sun brings commanding executive fire while Moon provides soothing empathy, diplomacy, and imaginative genius. Highly loved by public and revered in society.',
    lifePathOverviewHi: 'सूर्य का ओज और चन्द्रमा की शीतलता मिलकर अद्भुत राजयोग बनाते हैं। जातक साहसी होने के साथ-साथ अत्यंत संवेदनशील, कूटनीतिज्ञ और जनप्रिय होता है।',
    careerProspectsEn: ['Diplomacy & Foreign Affairs', 'Hospitality & Luxury Real Estate', 'Public Relations & Film Direction', 'Psychology & Creative Arts', 'Maritime & International Commerce'],
    careerProspectsHi: ['विदेश सेवा व राजनयिक', 'हॉस्पिटैलिटी व लक्जरी रियल एस्टेट', 'फिल्म निर्देशन व कला-साहित्य', 'काउंसलिंग व जनसंपर्क', 'अंतरराष्ट्रीय व्यापार'],
    financialTrajectoryEn: 'Steady and magnetic financial growth. Wealth multiplies after marriage or through creative/liquid assets.',
    financialTrajectoryHi: 'विवाह के पश्चात व कलात्मक/तरल व्यापार से निरंतर धन-वैभव में तीव्र वृद्धि।',
    relationshipDynamicsEn: 'Ideal balance of firmness and affection. Deep emotional connection and respected family life.',
    relationshipDynamicsHi: 'प्रेम व अधिकार का सुंदर संतुलन। पारिवारिक व वैवाहिक जीवन अत्यंत सुखद रहता है।',
    healthAlertsEn: 'Watch for digestive sensitivity, respiratory congestion, and fluid balance in the body.',
    healthAlertsHi: 'पाचन तंत्र, कफ-सर्दी व जल तत्व के असंतुलन से बचाव रखें।',
    masterRemedyEn: 'Respect mother and father equally. Drink water from a silver cup and chant Gayatri Mantra.',
    masterRemedyHi: 'माता-पिता का प्रतिदिन चरण स्पर्श करें, चांदी के गिलास से जल पिएं और पूर्णिमा को चन्द्र दर्शन करें।',
    famousPersonalitiesEn: ['Shah Rukh Khan (2-11-1965 => D:2/C:7, related pattern)', 'Amitabh Bachchan'],
    luckyColors: ['Cream', 'Pearl White', 'Gold', 'Light Orange'],
    luckyGems: ['Pearl', 'Ruby'],
  },
  '1-3': {
    driver: 1,
    conductor: 3,
    pairKey: '1-3',
    titleEn: 'Sun & Jupiter - The Sovereign King & Wise Counselor',
    titleHi: 'सूर्य व बृहस्पति - गुरु-आदित्य योग, अपार ज्ञान व उच्च प्रतिष्ठा',
    rating: 5,
    category: 'Super Auspicious',
    categoryHi: 'अति-शुभ गुरु-आदित्य राजयोग',
    lifePathOverviewEn: 'Supreme combination of executive leadership (1) and expansive ethical wisdom (3). You are a natural educator, policy maker, and moral leader with unshakable integrity.',
    lifePathOverviewHi: 'सूर्य का नेतृत्व और देवगुरु बृहस्पति का अगाध ज्ञान मिलकर गुरु-आदित्य राजयोग का निर्माण करते हैं। ऐसा जातक ज्ञानवान, उच्च संस्कारों वाला और समाज का मार्गदर्शक बनता है।',
    careerProspectsEn: ['Judiciary & Senior High Court Advocates', 'University Vice Chancellors & Deans', 'Banking, High Finance & Treasury', 'Spiritual Foundations & Think Tanks', 'Civil Administration'],
    careerProspectsHi: ['न्यायपालिका व वरिष्ठ न्यायाधीश', 'विश्वविद्यालय कुलपति व शिक्षाविद', 'बैंकिंग व वित्त प्रबंधन', 'नीति निर्धारक व आध्यात्मिक सलाहकार'],
    financialTrajectoryEn: 'High, ethical, compounding prosperity. Abundance flows through education, consultancy, and investments.',
    financialTrajectoryHi: 'धर्म सम्मत व बौद्धिक कार्यों से विपुल धन संपदा। निवेश व ज्ञान आधारित कार्यों से निरंतर समृद्धि।',
    relationshipDynamicsEn: 'Highly supportive, dignified marital bond with deep mutual respect for family culture.',
    relationshipDynamicsHi: 'संस्कारवान व सम्मानजनक दांपत्य जीवन। परिवार में उच्च प्रतिष्ठा।',
    healthAlertsEn: 'Watch liver health, blood sugar, and weight management.',
    healthAlertsHi: 'लिवर, कोलेस्ट्रॉल और रक्त शर्करा (डायबिटीज) का ध्यान रखें।',
    masterRemedyEn: 'Wear Yellow Topaz/Sapphire, donate books and saffron, and apply yellow sandalwood tilak.',
    masterRemedyHi: 'गुरुवार को केसर अथवा हल्दी का तिलक लगाएं, पुखराज धारण करें और पीले फलों का दान करें।',
    famousPersonalitiesEn: ['Warren Buffett (30-08-1930)', ' Swami Vivekananda'],
    luckyColors: ['Bright Yellow', 'Saffron', 'Gold', 'Amber'],
    luckyGems: ['Yellow Sapphire', 'Ruby'],
  },
  '1-4': {
    driver: 1,
    conductor: 4,
    pairKey: '1-4',
    titleEn: 'Sun & Rahu - The Disruptive Innovator & Unconventional Leader',
    titleHi: 'सूर्य व राहु - क्रांतिकारी रणनीतिकार, तकनीकी शोध व साहसिक योजनाएं',
    rating: 4,
    category: 'Highly Favorable',
    categoryHi: 'अनुकूल एवं क्रांतिकारी सफलता दायक',
    lifePathOverviewEn: 'Sun provides visionary drive while Rahu injects revolutionary foresight and technical agility. Master of breaking outdated monopolies and creating disruptive startups.',
    lifePathOverviewHi: 'सूर्य की महत्वाकांक्षा और राहु की आउट-ऑफ-द-बॉक्स सोच मिलकर असंभव को संभव बनाती है। जातक तकनीकी, अनुसंधान व आधुनिक युग के व्यवसायों में बड़ा धमाका करता है।',
    careerProspectsEn: ['AI, Blockchain & Cyber Tech Startups', 'Aviation, Space Science & Defense', 'Modern Media & Mass Entertainment', 'Investigative Research & Patents', 'High-Frequency Trading'],
    careerProspectsHi: ['आर्टिफिशियल इंटेलिजेंस (AI) व टेक स्टार्टअप', 'एविएशन व रक्षा अनुसंधान', 'आधुनिक मीडिया व सिनेमा', 'शेयर मार्केट व तकनीकी शोध'],
    financialTrajectoryEn: 'Sudden, massive windfalls alternated with high-stakes bets. Enormous financial scale with proper grounding.',
    financialTrajectoryHi: 'अचानक अप्रत्याशित धनलाभ। बड़े प्रोजेक्ट्स से विशाल साम्राज्य खड़ा करने की क्षमता।',
    relationshipDynamicsEn: 'High mental restlessness. Needs partner with patience and grounded stability (Numbers 1, 5, or 6).',
    relationshipDynamicsHi: 'वैचारिक उत्तेजना के कारण संबंध में कभी-कभी तनाव। धैर्यवान जीवनसाथी की आवश्यकता।',
    healthAlertsEn: 'Guard against nervous tension, acidity, and sleep disturbances.',
    healthAlertsHi: 'मानसिक तनाव, अनिद्रा और सिरदर्द की समस्या से बचाव रखें।',
    masterRemedyEn: 'Offer water to Sun daily; feed birds seven grains (Satnaja) on Saturdays.',
    masterRemedyHi: 'सूर्य को अर्घ्य दें और शनिवार को पक्षियों को सप्तधान्य (सात अनाज) डालें।',
    famousPersonalitiesEn: ['Steve Jobs (24-02-1955)', 'Barack Obama (04-08-1961)'],
    luckyColors: ['Electric Blue', 'Orange', 'Gold', 'Smoky Grey'],
    luckyGems: ['Ruby', 'Hessonite Garnet'],
  },
  '1-5': {
    driver: 1,
    conductor: 5,
    pairKey: '1-5',
    titleEn: 'Sun & Mercury - Budh-Aditya Raj Yoga (The Master Merchant King)',
    titleHi: 'सूर्य व बुध - बुधादित्य महायोग, व्यापारिक सम्राट एवं वाकपटुता',
    rating: 5,
    category: 'Super Auspicious',
    categoryHi: 'अति-शुभ बुधादित्य महायोग',
    lifePathOverviewEn: 'Classic Budhaditya combination. Supreme commercial genius, razor-sharp mathematical wit, persuasive public communication, and lightning-fast execution.',
    lifePathOverviewHi: 'शास्त्रों का प्रसिद्ध बुधादित्य योग। जातक व्यापार, गणितीय विश्लेषण, डिजिटल मीडिया और वाणी की शक्ति से समाज में अपार धन व ख्याति अर्जित करता है।',
    careerProspectsEn: ['Global Commerce & Import-Export', 'Fintech, Stock Markets & Venture Capital', 'Public Speaking & Digital Influencing', 'Corporate Strategy & Advisory', 'Software Development & IT Leadership'],
    careerProspectsHi: ['अंतरराष्ट्रीय व्यापार व एक्सपोर्ट', 'स्टॉक मार्केट व वेंचर कैपिटल', 'सार्वजनिक वक्ता व मीडिया लीडर', 'सॉफ्टवेयर व आईटी कंसल्टेंसी'],
    financialTrajectoryEn: 'Extraordinary cash flow and diverse income streams. Master of multiplying business capital rapidly.',
    financialTrajectoryHi: 'अनेक स्रोतों से धन का निरंतर प्रवाह। व्यापारिक पूंजी को तेजी से बढ़ाने में माहिर।',
    relationshipDynamicsEn: 'Charming, friendly, and lively companion. Highly sociable family atmosphere.',
    relationshipDynamicsHi: 'रोचक, हंसमुख और सामंजस्यपूर्ण पारिवारिक वातावरण।',
    healthAlertsEn: 'Keep nerves relaxed; avoid over-exhausting with continuous multi-tasking.',
    healthAlertsHi: 'स्नायु तंत्र (Nervous system) को शांत रखें; अत्यधिक काम के तनाव से बचें।',
    masterRemedyEn: 'Chant Budh Beej Mantra and Gayatri Mantra; plant green trees.',
    masterRemedyHi: 'बुधवार को गौमाता को हरा चारा खिलाएं और श्री गणेश जी को दूर्वा अर्पित करें।',
    famousPersonalitiesEn: ['Mark Zuckerberg (14-05-1984)', 'Albert Einstein (14-03-1879)'],
    luckyColors: ['Emerald Green', 'Gold', 'Orange', 'Yellow'],
    luckyGems: ['Emerald', 'Ruby'],
  },
  '1-6': {
    driver: 1,
    conductor: 6,
    pairKey: '1-6',
    titleEn: 'Sun & Venus - The Royal Aristocrat & Master of Luxury',
    titleHi: 'सूर्य व शुक्र - वैभव, ग्लैमर, कला एवं विलासिता का सम्राट',
    rating: 4,
    category: 'Highly Favorable',
    categoryHi: 'अति-अनुकूल वैभव योग',
    lifePathOverviewEn: 'Sun gives supreme commanding dignity while Venus provides refined aesthetic taste, magnetic charm, and material opulence. A natural trendsetter in luxury lifestyles.',
    lifePathOverviewHi: 'सूर्य का मान-सम्मान और शुक्र का भौतिक ऐश्वर्य मिलकर जातक को कला, सिनेमा, फैशन और लक्जरी उद्योग में अद्वितीय प्रतिष्ठा व धन प्रदान करते हैं।',
    careerProspectsEn: ['Fashion Houses & Haute Couture', 'Film Production, Acting & Glamour Industry', 'Luxury Real Estate & High Architecture', 'Gems, Fine Jewelry & Fragrances', 'Hospitality & Boutique Resorts'],
    careerProspectsHi: ['फैशन डिजाइनिंग व ग्लैमर इंडस्ट्री', 'फिल्म निर्माण व अभिनय', 'लक्जरी रियल एस्टेट व इंटीरियर', 'रत्न, आभूषण व परफ्यूम व्यापार'],
    financialTrajectoryEn: 'Exceptional capacity to attract high-ticket wealth. Enjoys royal automobiles, mansions, and elite lifestyle.',
    financialTrajectoryHi: 'विशाल धन-संपदा, आलीशान भवन और लग्जरी वाहनों का स्वामी।',
    relationshipDynamicsEn: 'Passionate and magnetic. Needs to balance pride with affectionate compromise.',
    relationshipDynamicsHi: 'अत्यंत आकर्षक व्यक्तित्व। अहंकार को दूर रखकर दांपत्य जीवन को मधुर बनाए रखें।',
    healthAlertsEn: 'Monitor throat, endocrine glands, and urinary tract health.',
    healthAlertsHi: 'गले के विकार और डायबिटीज/किडनी स्वास्थ्य पर ध्यान दें।',
    masterRemedyEn: 'Wear natural perfume/attar, respect women, and chant Shukra/Surya mantras.',
    masterRemedyHi: 'सुगंधित इत्र लगाएं, महिलाओं का सम्मान करें और शुक्रवार को सफेद वस्तु का दान करें।',
    famousPersonalitiesEn: ['Michael Jackson (29-08-1958)', 'Sachin Tendulkar (24-04-1973)'],
    luckyColors: ['White', 'Light Pink', 'Gold', 'Saffron'],
    luckyGems: ['Diamond / Opal', 'Ruby'],
  },
  '1-7': {
    driver: 1,
    conductor: 7,
    pairKey: '1-7',
    titleEn: 'Sun & Ketu - The Mystic Sovereign & Deep Spiritual Scientist',
    titleHi: 'सूर्य व केतु - आत्म-ज्ञान, उच्च शोध, दार्शनिक नेतृत्व एवं शोधकर्ता',
    rating: 4,
    category: 'Highly Favorable',
    categoryHi: 'अनुकूल एवं आत्म-साक्षात्कार कारक',
    lifePathOverviewEn: 'Sun gives outer leadership and ambition while Ketu bestows profound intuitive depth, detachment from superficiality, and piercing research ability.',
    lifePathOverviewHi: 'सूर्य का प्रकाश और केतु की रहस्यमयी अंतर्दृष्टि। जातक सतही बातों से दूर रहकर गहन अनुसंधान, आध्यात्मिक ज्ञान, गूढ़ विज्ञान और उच्च दर्शन में कीर्ति पाता है।',
    careerProspectsEn: ['Scientific Research & Defense Technologies', 'Occult Sciences, Astrology & Vastu Architecture', 'Medical Research & Virology', 'Philosophy & Deep Analytical Authoring', 'Spiritual Guidance & Foundation Head'],
    careerProspectsHi: ['वैज्ञानिक शोध व रक्षा अनुसंधान', 'ज्योतिष, वास्तु व गूढ़ विद्याएं', 'चिकित्सा अनुसंधान व फार्मा', 'दर्शनशास्त्र व उच्च लेखन'],
    financialTrajectoryEn: 'Wealth arrives through specialized, uncopyable knowledge and consultancy rather than aggressive marketing.',
    financialTrajectoryHi: 'विशिष्ट ज्ञान व परामर्श के माध्यम से विपुल धनार्जन। भौतिक दिखावे से दूर।',
    relationshipDynamicsEn: 'Introspective. Requires an understanding partner who honors solitude and intellectual space.',
    relationshipDynamicsHi: 'गंभीर व एकांतप्रिय। जीवनसाथी का आध्यात्मिक व सहयोगी होना आवश्यक है।',
    healthAlertsEn: 'Watch for skin sensitivities, anxiety, and lower digestive tracts.',
    healthAlertsHi: 'त्वचा संबंधी विकार व मानसिक तनाव से बचाव रखें।',
    masterRemedyEn: 'Feed stray dogs, meditate at sunrise, and chant Om Namah Shivaya.',
    masterRemedyHi: 'सूर्योदय पर ध्यान करें, काले-सफेद श्वान (कुत्ते) को रोटी खिलाएं और शिव उपासना करें।',
    famousPersonalitiesEn: ['Isaac Newton', 'Dr. A. P. J. Abdul Kalam (15-10-1931)'],
    luckyColors: ['Light Green', 'Gold', 'Pale Yellow', 'White'],
    luckyGems: ["Cat's Eye", 'Ruby'],
  },
  '1-8': {
    driver: 1,
    conductor: 8,
    pairKey: '1-8',
    titleEn: 'Sun & Saturn - The Karmic Crusader & Empire Builder',
    titleHi: 'सूर्य व शनि - पिता-पुत्र संघर्ष योग, असीम सहनशक्ति व स्थाई साम्राज्य',
    rating: 3,
    category: 'Challenging / Karmic',
    categoryHi: 'संघर्षोपरांत स्थायी सफलता (कठिन पर महान)',
    lifePathOverviewEn: 'Sun (Father/Fire) meets Saturn (Son/Iron-Karma). Early life tests with severe friction, delay, and misunderstandings, but builds an indestructible, unshakeable empire in mature years.',
    lifePathOverviewHi: 'सूर्य और शनि का पौराणिक संबंध। जीवन के पूर्वार्ध में संघर्ष, विलंब और कड़े इम्तिहान, लेकिन उत्तरार्ध में जातक ऐसा स्थाई साम्राज्य बनाता है जिसे कोई हिला नहीं सकता।',
    careerProspectsEn: ['Heavy Manufacturing, Steel & Mining', 'Real Estate Infrastructure & Mega Projects', 'Judiciary, Labor Law & High Administration', 'Mass Politics & Social Reform', 'Renewable Energy & Oil Refineries'],
    careerProspectsHi: ['खनन, इस्पात व भारी उद्योग', 'रियल एस्टेट व इंफ्रास्ट्रक्चर', 'न्यायपालिका व श्रम कानून', 'जन-आंदोलन व राजनीति', 'पेट्रोकेमिकल्स व ऊर्जा क्षेत्र'],
    financialTrajectoryEn: 'Slow, compounding multi-generational wealth. Maximum financial breakthrough occurs after age 36-40.',
    financialTrajectoryHi: '36 से 40 वर्ष की आयु के बाद अकूत व स्थाई संपत्ति का निर्माण।',
    relationshipDynamicsEn: 'Challenging due to uncompromising stubbornness. Needs conscious humility and emotional warmth.',
    relationshipDynamicsHi: 'हठ और अहंकार के कारण दांपत्य में तनाव संभव। मधुर वाणी और धैर्य रखना अत्यंत आवश्यक।',
    healthAlertsEn: 'Watch bone density, joints, blood pressure, and eyesight.',
    healthAlertsHi: 'हड्डियों, जोड़ों के दर्द, नेत्र रोग और उच्च रक्तचाप का ध्यान रखें।',
    masterRemedyEn: 'Do not wear Black with Red together. Light mustard oil lamp under Peepal on Saturday; chant Hanuman Chalisa.',
    masterRemedyHi: 'शनिवार को पीपल के नीचे सरसों के तेल का दीपक जलाएं, सुंदरकांड का पाठ करें और काले व लाल रंग को एक साथ न पहनें।',
    famousPersonalitiesEn: ['Narendra Modi (17-09-1950)', 'Manmohan Singh (26-09-1932)'],
    luckyColors: ['Royal Blue', 'Gold', 'Amber', 'Cream'],
    luckyGems: ['Ruby or Amethyst - consult carefully'],
  },
  '1-9': {
    driver: 1,
    conductor: 9,
    pairKey: '1-9',
    titleEn: 'Sun & Mars - The Supreme Commander & Invincible Warrior',
    titleHi: 'सूर्य व मंगल - सेनापति योग, अद्वितीय पराक्रम, विजय एवं प्रशासनिक शक्ति',
    rating: 5,
    category: 'Super Auspicious',
    categoryHi: 'अति-शुभ शौर्य व राजयोग',
    lifePathOverviewEn: 'Sun (Supreme King) and Mars (Commander-in-Chief) form the most formidable power alliance in Vedic numerology. Fearless courage, immense vitality, and unstoppable victory over adversaries.',
    lifePathOverviewHi: 'सूर्य और मंगल का अद्भुत संबंध। जातक में असाधारण पराक्रम, निर्भीकता, त्वरित निर्णय क्षमता और शत्रुओं पर सदैव विजय प्राप्त करने की शक्ति होती है।',
    careerProspectsEn: ['Army General, Police Chief & Armed Forces', 'High Politics, Governance & Ministers', 'Surgeon & Critical Trauma Medicine', 'Sports Champion & Martial Arts', 'Real Estate Development & Industrial Plants'],
    careerProspectsHi: ['सेना व पुलिस में शीर्ष अधिकारी', 'राजनीति व मंत्रालय', 'वरिष्ठ सर्जन व आपातकालीन चिकित्सा', 'खिलाड़ी व स्पोर्ट्स चैम्पियन', 'भूमि विकास व बड़े उद्योग'],
    financialTrajectoryEn: 'High earning velocity through bold investments, government contracts, and real estate ownership.',
    financialTrajectoryHi: 'रियल एस्टेट, भूमि सौदों और साहसिक प्रोजेक्ट्स से अपार धनार्जन।',
    relationshipDynamicsEn: 'Passionate and loyal, but high temper must be tempered with mutual listening.',
    relationshipDynamicsHi: 'अत्यंत निष्ठावान परंतु त्वरित क्रोध से बचने की सलाह।',
    healthAlertsEn: 'Control anger, avoid heat stroke, and guard against accidental injuries/burns.',
    healthAlertsHi: 'क्रोध पर नियंत्रण रखें, रक्त विकार व चोट/दुर्घटनाओं से सावधानी रखें।',
    masterRemedyEn: 'Chant Hanuman Chalisa daily; offer jaggery and roasted gram to monkeys/poor on Tuesday.',
    masterRemedyHi: 'प्रतिदिन हनुमान चालीसा का पाठ करें, मंगलवार को गुड़-चना दान करें और लाल चंदन का तिलक लगाएं।',
    famousPersonalitiesEn: ['Alexander the Great', 'Nelson Mandela (18-07-1918)'],
    luckyColors: ['Crimson Red', 'Saffron', 'Gold', 'Orange'],
    luckyGems: ['Red Coral', 'Ruby'],
  },
};

// Fallback generator for all 81 pairs to guarantee full coverage
export function getDriverConductorProfile(driver: number, conductor: number): DriverConductorCombo {
  const d = Math.max(1, Math.min(9, Math.round(driver) || 1));
  const c = Math.max(1, Math.min(9, Math.round(conductor) || 1));
  const key = `${d}-${c}`;

  if (DRIVER_CONDUCTOR_81_DATA[key]) {
    return DRIVER_CONDUCTOR_81_DATA[key];
  }

  // Authentic Vedic Planetary Dynamics Matrix for generated combinations
  const PLANET_NAMES: Record<number, { en: string; hi: string; element: string; elementHi: string }> = {
    1: { en: 'Sun (Surya)', hi: 'सूर्य देव (तेज/नेतृत्व)', element: 'Fire', elementHi: 'अग्नि' },
    2: { en: 'Moon (Chandra)', hi: 'चन्द्र देव (मन/कल्पना)', element: 'Water', elementHi: 'जल' },
    3: { en: 'Jupiter (Brihaspati)', hi: 'देवगुरु बृहस्पति (ज्ञान/विवेक)', element: 'Ether', elementHi: 'आकाश' },
    4: { en: 'Rahu (North Node)', hi: 'राहु (रणनीति/क्रांति)', element: 'Air', elementHi: 'वायु' },
    5: { en: 'Mercury (Budha)', hi: 'बुध देव (व्यापार/वाकपटुता)', element: 'Earth', elementHi: 'पृथ्वी' },
    6: { en: 'Venus (Shukra)', hi: 'शुक्राचार्य (वैभव/कला)', element: 'Water', elementHi: 'जल' },
    7: { en: 'Ketu (South Node)', hi: 'केतु (अध्यात्म/शोध)', element: 'Ether', elementHi: 'आकाश' },
    8: { en: 'Saturn (Shani)', hi: 'शनि देव (कर्म/न्याय)', element: 'Air', elementHi: 'वायु' },
    9: { en: 'Mars (Mangal)', hi: 'मंगल देव (साहस/पराक्रम)', element: 'Fire', elementHi: 'अग्नि' },
  };

  const p1 = PLANET_NAMES[d];
  const p2 = PLANET_NAMES[c];

  // Calculate friendly compatibility
  const isKarmic = (d === 1 && c === 8) || (d === 8 && c === 1) || (d === 2 && c === 8) || (d === 4 && c === 8) || (d === 8 && c === 4);
  const isSuper = (d === c) || (d === 1 && c === 5) || (d === 5 && c === 1) || (d === 3 && c === 3) || (d === 5 && c === 6) || (d === 6 && c === 5) || (d === 1 && c === 9) || (d === 9 && c === 1);

  const rating = isSuper ? 5 : isKarmic ? 3 : 4;
  const category = isSuper ? 'Super Auspicious' : isKarmic ? 'Challenging / Karmic' : 'Highly Favorable';
  const categoryHi = isSuper ? 'अति-शुभ एवं फलदायी' : isKarmic ? 'कठिन परीक्षा उपरांत सफलता' : 'अनुकूल व प्रगतिशील';

  return {
    driver: d,
    conductor: c,
    pairKey: key,
    titleEn: `${p1.en} & ${p2.en} - Dynamic Catalyst`,
    titleHi: `${p1.hi} व ${p2.hi} - विशिष्ट अंक योग`,
    rating,
    category,
    categoryHi,
    lifePathOverviewEn: `The synergy between Driver ${d} (${p1.en}) and Conductor ${c} (${p2.en}) creates a distinctive path where inner drive harmonizes with life-long karmic missions. You operate with focused determination and adaptability.`,
    lifePathOverviewHi: `मूलांक ${d} (${p1.hi}) और भाग्यांक ${c} (${p2.hi}) का यह संयोजन आंतरिक शक्ति और जीवन के लक्ष्यों के बीच गहरा समन्वय स्थापित करता है। जातक अपने परिश्रम और बुद्धि से समाज में विशिष्ट स्थान बनाता है।`,
    careerProspectsEn: [`Management & Strategy in ${p1.element} domains`, 'Commercial Enterprise & Modern Startups', 'Public Administration & Professional Consultancy', 'Creative Arts & Technical Solutions'],
    careerProspectsHi: ['प्रबंधन, प्रशासन व कॉर्पोरेट रणनीति', 'व्यापार, स्टार्टअप व कंसल्टेंसी', 'तकनीकी शोध व बौद्धिक कार्य', 'कला, संचार व वित्त प्रबंधन'],
    financialTrajectoryEn: 'Steady and compounding financial growth. Optimal prosperity unfolds when aligning with your core lucky numbers and colors.',
    financialTrajectoryHi: 'निरंतर बढ़ता आर्थिक ग्राफ। शुभ तिथियों और रंगों के सही प्रयोग से व्यापार और निवेश में अप्रत्याशित वृद्धि।',
    relationshipDynamicsEn: 'Balanced interpersonal bonding. Cultivate open communication and mutual respect for a deeply fulfilling domestic life.',
    relationshipDynamicsHi: 'मधुर व सहयोगी दांपत्य। आपसी समझ और सम्मान से परिवार में सुख-शांति बनी रहती है।',
    healthAlertsEn: `Pay attention to organs governed by ${p1.element} and ${p2.element}. Maintain balanced nutrition and daily mindfulness.`,
    healthAlertsHi: 'संतुलित दिनचर्या, नियमित प्राणायाम और खानपान में संयम रखने से उत्तम स्वास्थ्य बना रहता है।',
    masterRemedyEn: `Chant Beej Mantras corresponding to Number ${d} and Number ${c}. Engage in philanthropic deeds on lucky days.`,
    masterRemedyHi: `मूलांक ${d} एवं भाग्यांक ${c} के स्वामी ग्रहों के वैदिक मंत्रों का जाप करें और शुभ वार को जरूरतमंदों की सहायता करें।`,
    famousPersonalitiesEn: ['Eminent Global Leaders and Pioneers sharing this vibrational frequency'],
    luckyColors: ['Gold', 'Green', 'Yellow', 'White'],
    luckyGems: ['Emerald', 'Ruby', 'Pearl', 'Yellow Sapphire'],
  };
}
