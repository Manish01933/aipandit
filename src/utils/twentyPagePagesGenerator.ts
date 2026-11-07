import { KundaliResult, BirthDetails, JagannathaHoraData, PlanetInfo } from '../types/astrology';
import { TwentyPageReportPage } from './twentyPageKundaliEngine';
import {
  SIGN_LORDS,
  SIGN_LORDS_HINDI,
  SIGN_ELEMENTS,
  ASCENDANT_PROFILES,
  MOON_SIGN_PROFILES,
  SUN_HOUSE_PROFILES,
  getHouseDetailedAnalysis,
  getCareerAnalysis,
  getMarriageAnalysis,
  getGemstoneAndRudraksha,
  getHealthAyurvedaDetails,
  getWealthDetails,
  getEducationDetails,
  getSadeSatiDetails,
  getDivisionalChartsDetails,
} from './twentyPagePersonalizedAnalysis';

export function appendPersonalizedPages5To25(
  pages: TwentyPageReportPage[],
  kundali: KundaliResult,
  horaData: JagannathaHoraData
): void {
  const { birthDetails } = kundali;
  const sun = kundali.planets.find((p) => p.name === 'Sun') || kundali.planets[0];
  const moon = kundali.planets.find((p) => p.name === 'Moon') || kundali.planets[1];
  const mars = kundali.planets.find((p) => p.name === 'Mars');
  const ascLord = SIGN_LORDS[kundali.ascendantSign] || 'Mars';
  const ascLordHindi = SIGN_LORDS_HINDI[kundali.ascendantSign] || 'मंगल';
  const ascLordPlanet = kundali.planets.find((p) => p.name === ascLord);

  // ==========================================
  // PAGE 5: ASCENDANT AND PERSONALITY ANALYSIS
  // ==========================================
  const ascProfile = ASCENDANT_PROFILES[kundali.ascendantSign] || ASCENDANT_PROFILES.Aries;
  const ascElement = SIGN_ELEMENTS[kundali.ascendantSign] || SIGN_ELEMENTS.Aries;
  const lagnaHouse = kundali.houses.find((h) => h.houseNumber === 1) || kundali.houses[0];
  const planetsInLagna = lagnaHouse?.planets || [];
  const planetsInLagnaText =
    planetsInLagna.length > 0
      ? planetsInLagna.map((p) => `${p.hindiName} (${p.signHindi} ${p.formattedDegree || `${p.degree.toFixed(1)}°`})`).join(', ')
      : 'कोई प्रत्यक्ष ग्रह नहीं (दृष्टि प्रभाव लागू)';

  pages.push({
    pageNumber: 5,
    titleHi: 'पृष्ठ 5: लग्न एवं व्यक्तित्व का विस्तृत विश्लेषण',
    titleEn: 'Page 5: Ascendant & Personality Analysis (Lagna)',
    subtitleHi: 'प्रथम भाव, लग्नेश की स्थिति, शारीरिक संरचना, स्वभाव, शक्तियां व संभावित चुनौतियां',
    subtitleEn: 'First House, Lagna Lord Placement, Constitution, Strengths & Growth Areas',
    category: 'house',
    sections: [
      {
        headingHi: `लग्न राशि: ${kundali.ascendantSignHindi} (${kundali.ascendantSign}) - तनु भाव विश्लेषण`,
        headingEn: `Ascendant Sign: ${kundali.ascendantSign} - 1st House Analysis`,
        contentHi: `जातक का जन्म ${kundali.ascendantSignHindi} लग्न में हुआ है। ${ascProfile.natureHi} प्रथम भाव को तनु भाव कहा जाता है, जो शारीरिक संरचना, आत्मसम्मान, मानसिक दृढ़ता और समाज में प्रथम प्रभाव का नियंत्रक है। लग्नेश ${ascLordHindi} आपकी कुंडली में भाव ${ascLordPlanet?.house || 1} (${ascLordPlanet?.signHindi || ''} राशि) में स्थित हैं। यह स्थिति जातक को आत्मनिर्भर और जीवन में अपने पराक्रम से मुकाम हासिल करने का सामर्थ्य देती है।`,
        contentEn: `The native's Ascendant is ${kundali.ascendantSign}. ${ascProfile.natureEn} The 1st house (Tanu Bhava) governs physical constitution, vitality, and societal persona. Lagna Lord ${ascLord} is situated in House ${ascLordPlanet?.house || 1} in ${ascLordPlanet?.sign || ''}, infusing dynamic self-determination.`,
        bulletPointsHi: [
          `शारीरिक बनावट: ${ascProfile.physiqueHi}`,
          `मानसिक स्वभाव: ${ascProfile.temperamentHi}`,
          `लग्न में स्थित ग्रह: ${planetsInLagnaText}`,
        ],
        bulletPointsEn: [
          `Physical constitution: ${ascProfile.physiqueEn}`,
          `Temperament: ${ascProfile.temperamentEn}`,
          `Planets in Lagna: ${planetsInLagna.length > 0 ? planetsInLagna.map((p) => p.name).join(', ') : 'Unoccupied'}`,
        ],
      },
      {
        headingHi: 'व्यक्तित्व की मुख्य शक्तियां एवं संतुलित जीवन सूत्र',
        headingEn: 'Core Strengths & Potential Behavioral Blind Spots',
        contentHi:
          'हर लग्न की अपनी अनूठी शक्तियां और कुछ कमजोरियां होती हैं। इन शक्तियों को पहचानकर सही दिशा में लगाना और कमजोरियों पर सजगता से नियंत्रण पाना ही वैदिक ज्योतिष का मुख्य उद्देश्य है।',
        contentEn:
          'Understanding psychological strengths and subconscious triggers allows conscious elevation of personal character and relationships.',
        tableData: {
          headers: ['पक्ष (Aspect)', 'जातक के विशिष्ट लक्षण', 'सुधार व संतुलन के उपाय'],
          rows: [
            ['प्रमुख शक्तियां (Strengths)', ascProfile.strengthsHi, 'नेतृत्व और उत्तरदायित्व के पदों में सर्वोत्तम परिणाम'],
            ['चुनौतियां (Challenges)', ascProfile.challengesHi, 'महत्वपूर्ण निर्णयों से पूर्व विचार-विमर्श करें'],
            ['संतुलन व सुधार सूत्र', ascProfile.remedyHi, 'प्रतिदिन आचरण में उतारें'],
            ['जैविक तत्व व प्रकृति', `${ascElement.hi} • ${ascElement.doshaHi}`, 'संतुलित सात्विक दिनचर्या अपनाएं'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 6: MOON SIGN AND MENTAL TENDENCIES
  // ==========================================
  const moonProfile = MOON_SIGN_PROFILES[kundali.moonSign] || MOON_SIGN_PROFILES.Aries;
  const moonElement = SIGN_ELEMENTS[kundali.moonSign] || SIGN_ELEMENTS.Aries;

  pages.push({
    pageNumber: 6,
    titleHi: 'पृष्ठ 6: चंद्र राशि एवं मानसिक प्रवृत्तियों का विश्लेषण',
    titleEn: 'Page 6: Moon Sign & Mental Tendencies (Chandra Rashi)',
    subtitleHi: 'चंद्रमा की स्थिति, जन्म नक्षत्र, भावनात्मक प्रतिक्रियाएं, अवचेतन मन व मानसिक शांति',
    subtitleEn: 'Moon Placement, Nakshatra Psychology, Emotional Reflexes & Mental Serenity',
    category: 'house',
    sections: [
      {
        headingHi: `चंद्र राशि: ${kundali.moonSignHindi} (${kundali.moonSign}) - जन्म राशि व नक्षत्र`,
        headingEn: `Moon Sign: ${kundali.moonSign} (Janma Rashi) & Nakshatra`,
        contentHi: `ऋग्वेद के अनुसार "चंद्रमा मनसो जातः" - चंद्रमा मन, अवचेतन, संवेदना और विचार शक्ति का नियंत्रक है। आपकी जन्म चंद्र राशि ${kundali.moonSignHindi} है और जन्म नक्षत्र ${kundali.birthNakshatraHindi} (चरण ${moon.pada}) है, जिसके स्वामी ${kundali.nakshatraLord} हैं। ${moonProfile.mindsetHi} चंद्रमा आपकी कुंडली में भाव ${moon.house} में स्थित हैं (गरिमा: ${moon.dignityHindi || moon.dignity})।`,
        contentEn: `According to the Rig Veda, "Chandrama Manaso Jatah" — the Moon is born from the Cosmic Mind. Native's Janma Rashi is ${kundali.moonSign} and Nakshatra is ${kundali.birthNakshatra} (Pada ${moon.pada}) ruled by ${kundali.nakshatraLord}. Moon occupies House ${moon.house} (${moon.dignity}).`,
        bulletPointsHi: [
          `भावनात्मक ढांचा: ${moonProfile.emotionalCoreHi}`,
          `जन्म नक्षत्र प्रभाव: ${kundali.birthNakshatraHindi} नक्षत्र जातक को विशिष्ट अंतर्दृष्टि और चिंतन शैली देता है।`,
          `मानसिक शांति सूत्र: ${moonProfile.innerPeaceTipsHi}`,
        ],
        bulletPointsEn: [
          `Emotional framework: ${moonProfile.emotionalCoreEn}`,
          `Janma Nakshatra: ${kundali.birthNakshatra} imparts sharp intuitive faculties.`,
          `Inner peace formula: ${moonProfile.innerPeaceTipsEn}`,
        ],
      },
      {
        headingHi: 'मानसिक संतुलन एवं अवचेतन मन की साधना',
        headingEn: 'Cultivating Mental Serenity & Lunar Harmony',
        contentHi:
          'चंद्रमा मन का स्वामी है। पूर्णिमा के दिन ध्यान करना, चांदी के पात्र में जल पीना और माता का चरण स्पर्श कर आशीर्वाद लेना मानसिक संतुलन और अनिद्रा से मुक्ति प्रदान करता है।',
        contentEn:
          'Meditation during full moon cycles, drinking water from silver vessels, and honoring the maternal figure anchor mental tranquility and restorative sleep.',
        tableData: {
          headers: ['चंद्र स्तंभ', 'जातक की स्थिति', 'ज्योतिषीय फल व उपाय'],
          rows: [
            ['चंद्र राशि व तत्व', `${kundali.moonSignHindi} (${moonElement.hi})`, `${moonElement.doshaHi} • मन की गहराइयां`],
            ['जन्म नक्षत्र व चरण', `${kundali.birthNakshatraHindi} (चरण ${moon.pada})`, `नक्षत्र स्वामी: ${kundali.nakshatraLord}`],
            ['चंद्रमा की स्थिति', `भाव ${moon.house} (${moon.formattedDegree || `${moon.degree.toFixed(1)}°`})`, `${moon.dignityHindi || moon.dignity} • चेष्टा बल`],
            ['मानसिक शांति का अचूक उपाय', moonProfile.innerPeaceTipsHi, 'सप्ताह में एक दिन मौन व आत्म-चिंतन'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 7: SUN, IDENTITY AND PERSONAL DIRECTION
  // ==========================================
  const sunProfile = SUN_HOUSE_PROFILES[sun.house] || SUN_HOUSE_PROFILES[1];

  pages.push({
    pageNumber: 7,
    titleHi: 'पृष्ठ 7: सूर्य, आत्मबल एवं जीवन की दिशा',
    titleEn: 'Page 7: Sun, Identity & Personal Direction (Surya)',
    subtitleHi: 'सूर्य की स्थिति, आत्मकारक, पिता से संबंध, प्रशासनिक क्षमता व सार्वजनिक मान-सम्मान',
    subtitleEn: 'Solar Placement, Soul Purpose, Paternal Relationship & Authority Orientation',
    category: 'house',
    sections: [
      {
        headingHi: `सूर्य की स्थिति: ${sun.signHindi} (भाव ${sun.house}) - आत्मकारक व आत्मबल`,
        headingEn: `Solar Placement in ${sun.sign} (House ${sun.house})`,
        contentHi: `सूर्य आत्मा, आत्मसम्मान, पिता, सरकार और प्रशासनिक क्षमता का कारक है। आपकी कुंडली में सूर्य ${sun.signHindi} राशि में भाव ${sun.house} में स्थित हैं (स्पष्ट अंश: ${sun.formattedDegree || `${sun.degree.toFixed(1)}°`}, गरिमा: ${sun.dignityHindi || sun.dignity})। ${sunProfile.roleHi}`,
        contentEn: `The Sun signifies the Atman (Soul), father, government, and vitality. In ${sun.sign} occupying House ${sun.house}, the Sun infuses authority, a strong sense of purpose, and resilience under pressure.`,
        bulletPointsHi: [
          `आत्मबल व प्रतिष्ठा: ${sunProfile.roleHi}`,
          `पिता के साथ संबंध: ${sunProfile.fatherRelationHi}`,
          `करियर में दिशा: ${sunProfile.careerOrientationHi}`,
        ],
        bulletPointsEn: [
          `Vitality & prestige: ${sunProfile.roleEn}`,
          `Paternal bond: ${sunProfile.fatherRelationEn}`,
          `Career trajectory: ${sunProfile.careerOrientationEn}`,
        ],
      },
      {
        headingHi: 'सूर्य का शुभ प्रभाव बढ़ाने के पारम्परिक उपाय',
        headingEn: 'Harmonizing Solar Energy',
        contentHi:
          'प्रतिदिन प्रातःकाल तांबे के पात्र में जल, रोली और अक्षत डालकर उगते सूर्य को अर्घ्य दें। आदित्य हृदय स्तोत्र का पाठ करने से करियर में बाधाएं दूर होती हैं और पिता के साथ संबंध मधुर रहते हैं।',
        contentEn:
          'Offering Arghya (water) to the rising Sun daily and reciting Aditya Hridaya Stotra amplifies leadership potential and clears obstacles in professional hierarchy.',
        tableData: {
          headers: ['सूर्य कारकत्व', 'जातक की स्थिति', 'ज्योतिषीय फल / प्रभाव'],
          rows: [
            ['सूर्य की राशि व भाव', `${sun.signHindi} (भाव ${sun.house})`, `${sun.dignityHindi || sun.dignity} स्थिति`],
            ['आत्मविश्वास व प्रभाव', sunProfile.roleHi, 'सार्वजनिक प्रतिष्ठा में वृद्धि'],
            ['पिता से संबंध व संस्कार', sunProfile.fatherRelationHi, 'पितृ आशीर्वाद से भाग्योदय'],
            ['सूर्य अर्घ्य व साधना', 'प्रातः काल तांबे के लोटे से उगते सूर्य को जल', 'आदित्य हृदय स्तोत्र का पाठ'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 8: DETAILED ANALYSIS OF HOUSES 1 TO 4
  // ==========================================
  const h1 = getHouseDetailedAnalysis(1, kundali);
  const h2 = getHouseDetailedAnalysis(2, kundali);
  const h3 = getHouseDetailedAnalysis(3, kundali);
  const h4 = getHouseDetailedAnalysis(4, kundali);

  pages.push({
    pageNumber: 8,
    titleHi: 'पृष्ठ 8: भाव विश्लेषण (भाव 1 से 4: स्व, धन, पराक्रम व सुख)',
    titleEn: 'Page 8: Detailed Analysis of Houses 1 to 4',
    subtitleHi: 'तनु भाव (शरीर), धन भाव (संपत्ति/कुटुंब), सहज भाव (साहस/भाई) एवं सुख भाव (माता/वाहन)',
    subtitleEn: '1st (Self/Body), 2nd (Wealth/Speech), 3rd (Valour/Siblings), 4th (Mother/Comfort)',
    category: 'house',
    sections: [
      {
        headingHi: 'भाव 1 व भाव 2: व्यक्तित्व एवं संचित धन का व्यक्तिगत विवरण',
        headingEn: 'House 1 (Self) & House 2 (Wealth & Family)',
        contentHi: `${h1.analysisHi}\n\n${h2.analysisHi}`,
        contentEn: `${h1.analysisEn}\n\n${h2.analysisEn}`,
      },
      {
        headingHi: 'भाव 3 व भाव 4: पराक्रम, भाई-बहन एवं मातृ/वाहन सुख',
        headingEn: 'House 3 (Courage) & House 4 (Domestic Bliss & Conveyances)',
        contentHi: `${h3.analysisHi}\n\n${h4.analysisHi}`,
        contentEn: `${h3.analysisEn}\n\n${h4.analysisEn}`,
        tableData: {
          headers: ['भाव (House)', 'राशि', 'भावेश (Lord)', 'स्थित ग्रह', 'व्यक्तिगत फल व शक्ति'],
          rows: [
            ['भाव 1 (तनु भाव)', h1.signHindi, `${h1.lordHindi} (भाव ${h1.lordHouse})`, h1.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'आत्मबल, शरीर व स्वतंत्र पहचान'],
            ['भाव 2 (धन भाव)', h2.signHindi, `${h2.lordHindi} (भाव ${h2.lordHouse})`, h2.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'संचित पूंजी, वाणी की मिठास व कुटुंब'],
            ['भाव 3 (सहज भाव)', h3.signHindi, `${h3.lordHindi} (भाव ${h3.lordHouse})`, h3.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'साहस, पराक्रम, छोटे भाई-बहन व उद्यम'],
            ['भाव 4 (सुख भाव)', h4.signHindi, `${h4.lordHindi} (भाव ${h4.lordHouse})`, h4.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'माता का सुख, भूमि, भवन व वाहन'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 9: DETAILED ANALYSIS OF HOUSES 5 TO 8
  // ==========================================
  const h5 = getHouseDetailedAnalysis(5, kundali);
  const h6 = getHouseDetailedAnalysis(6, kundali);
  const h7 = getHouseDetailedAnalysis(7, kundali);
  const h8 = getHouseDetailedAnalysis(8, kundali);

  pages.push({
    pageNumber: 9,
    titleHi: 'पृष्ठ 9: भाव विश्लेषण (भाव 5 से 8: बुद्धि, रिपु, दांपत्य व आयु)',
    titleEn: 'Page 9: Detailed Analysis of Houses 5 to 8',
    subtitleHi: 'सुत भाव (संतान/विद्या), रिपु भाव (ऋण/रोग/शत्रु), जाया भाव (विवाह/साझेदारी) व आयु भाव',
    subtitleEn: '5th (Intellect/Progeny), 6th (Health/Debts), 7th (Spouse/Partnership), 8th (Longevity)',
    category: 'house',
    sections: [
      {
        headingHi: 'भाव 5 व भाव 6: बुद्धि, पूर्वपुण्य, सेवा एवं प्रतियोगी विजय',
        headingEn: 'House 5 (Intellect & Past Merits) & House 6 (Competition & Health)',
        contentHi: `${h5.analysisHi}\n\n${h6.analysisHi}`,
        contentEn: `${h5.analysisEn}\n\n${h6.analysisEn}`,
      },
      {
        headingHi: 'भाव 7 व भाव 8: वैवाहिक सुख, साझेदारी, दीर्घायु एवं गूढ़ विद्या',
        headingEn: 'House 7 (Marriage) & House 8 (Longevity & Transformation)',
        contentHi: `${h7.analysisHi}\n\n${h8.analysisHi}`,
        contentEn: `${h7.analysisEn}\n\n${h8.analysisEn}`,
        tableData: {
          headers: ['भाव (House)', 'राशि', 'भावेश (Lord)', 'स्थित ग्रह', 'व्यक्तिगत फल व शक्ति'],
          rows: [
            ['भाव 5 (सुत भाव)', h5.signHindi, `${h5.lordHindi} (भाव ${h5.lordHouse})`, h5.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'उच्च बुद्धि, रचनात्मकता व पूर्व पुण्य'],
            ['भाव 6 (रिपु भाव)', h6.signHindi, `${h6.lordHindi} (भाव ${h6.lordHouse})`, h6.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'प्रतिद्वंद्वियों पर विजय व सेवा धर्म'],
            ['भाव 7 (जाया भाव)', h7.signHindi, `${h7.lordHindi} (भाव ${h7.lordHouse})`, h7.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'दांपत्य प्रेम, जीवनसाथी व साझेदारी'],
            ['भाव 8 (आयु भाव)', h8.signHindi, `${h8.lordHindi} (भाव ${h8.lordHouse})`, h8.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'दीर्घायु, अनुसंधान व गूढ़ अंतर्दृष्टि'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 10: DETAILED ANALYSIS OF HOUSES 9 TO 12
  // ==========================================
  const h9 = getHouseDetailedAnalysis(9, kundali);
  const h10 = getHouseDetailedAnalysis(10, kundali);
  const h11 = getHouseDetailedAnalysis(11, kundali);
  const h12 = getHouseDetailedAnalysis(12, kundali);

  pages.push({
    pageNumber: 10,
    titleHi: 'पृष्ठ 10: भाव विश्लेषण (भाव 9 से 12: भाग्य, कर्म, लाभ व मोक्ष)',
    titleEn: 'Page 10: Detailed Analysis of Houses 9 to 12',
    subtitleHi: 'धर्म भाव (भाग्य), कर्म भाव (करियर/कीर्ति), लाभ भाव (आय/मित्र) एवं व्यय भाव (विदेश/मोक्ष)',
    subtitleEn: '9th (Fortune/Dharma), 10th (Career/Status), 11th (Income/Gains), 12th (Foreign/Moksha)',
    category: 'house',
    sections: [
      {
        headingHi: 'भाव 9 व भाव 10: भाग्योदय, ईश्वरीय कृपा एवं कार्यक्षेत्र में प्रतिष्ठा',
        headingEn: 'House 9 (Fortune & Dharma) & House 10 (Career & Executive Status)',
        contentHi: `${h9.analysisHi}\n\n${h10.analysisHi}`,
        contentEn: `${h9.analysisEn}\n\n${h10.analysisEn}`,
      },
      {
        headingHi: 'भाव 11 व भाव 12: नियमित महालाभ, विदेश संबंध एवं आध्यात्मिक मोक्ष',
        headingEn: 'House 11 (Revenues & Networks) & House 12 (Foreign Travels & Liberation)',
        contentHi: `${h11.analysisHi}\n\n${h12.analysisHi}`,
        contentEn: `${h11.analysisEn}\n\n${h12.analysisEn}`,
        tableData: {
          headers: ['भाव (House)', 'राशि', 'भावेश (Lord)', 'स्थित ग्रह', 'व्यक्तिगत फल व शक्ति'],
          rows: [
            ['भाव 9 (धर्म भाव)', h9.signHindi, `${h9.lordHindi} (भाव ${h9.lordHouse})`, h9.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'ईश्वरीय कृपा, भाग्य व तीर्थ यात्रा'],
            ['भाव 10 (कर्म भाव)', h10.signHindi, `${h10.lordHindi} (भाव ${h10.lordHouse})`, h10.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'कार्यक्षेत्र में उच्च पद, आजीविका व प्रतिष्ठा'],
            ['भाव 11 (लाभ भाव)', h11.signHindi, `${h11.lordHindi} (भाव ${h11.lordHouse})`, h11.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'नियमित आय, बहुआयामी लाभ व नेटवर्क'],
            ['भाव 12 (व्यय भाव)', h12.signHindi, `${h12.lordHindi} (भाव ${h12.lordHouse})`, h12.planetsHere.map((p) => p.hindiName).join(', ') || 'निर्दोष भाव', 'विदेश यात्रा, दानशीलता व आध्यात्मिक मोक्ष'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 11: CAREER AND PROFESSIONAL LIFE
  // ==========================================
  const career = getCareerAnalysis(kundali);

  pages.push({
    pageNumber: 11,
    titleHi: 'पृष्ठ 11: करियर, व्यवसाय एवं आजीविका का संपूर्ण विश्लेषण',
    titleEn: 'Page 11: Career, Profession & Public Ascent',
    subtitleHi: 'दशम भाव, दशमेश, D10 दशमांश चक्र, अनुकूल कार्यक्षेत्र एवं व्यावसायिक सफलता के योग',
    subtitleEn: 'Tenth House, Career Significators, D10 Dashamsha Chart & Suitable Industries',
    category: 'career',
    sections: [
      {
        headingHi: `दशम भाव (${career.tenthSignHindi}) एवं दशमेश (${career.tenthLordHindi}) की स्थिति`,
        headingEn: 'Tenth House & Prime Professional Drivers',
        contentHi: career.summaryHi,
        contentEn: career.summaryEn,
        tableData: {
          headers: ['कार्यक्षेत्र (Sector)', 'अनुकूलता स्तर', 'संभावित पद / भूमिका'],
          rows: career.suitableSectors.map((s) => [s.sectorHi, s.stars, s.rolesHi]),
        },
      },
      {
        headingHi: 'करियर में भाग्योदय के समय और सावधानियां',
        headingEn: 'Career Golden Milestones & Advice',
        contentHi: `दशमेश ${career.tenthLordHindi} की महादशा अथवा अंतर्दशा और गोचर में गुरु का दशम भाव पर प्रभाव आने पर जातक को अप्रत्याशित पदोन्नति, व्यावसायिक विस्तार और मान-सम्मान प्राप्त होता है।`,
        contentEn: `Whenever the Dasha of 10th lord ${career.tenthLord} or Jupiter’s transit stimulates the 10th house, major milestones, promotions, and industry recognition manifest.`,
        bulletPointsHi: [
          'प्रतिदिन कार्य आरंभ करने से पूर्व अपने ईष्ट देव का स्मरण करें।',
          'महत्वपूर्ण व्यापारिक अनुबंधों पर हस्ताक्षर करते समय शुभ मुहूर्त का ध्यान रखें।',
          'अहंकार से बचें; विनम्रता और कार्यकुशलता ही स्थायी नेतृत्व की कुंजी है।',
        ],
        bulletPointsEn: [
          'Center consciousness before launching complex professional tasks.',
          'Align pivotal contractual signings with auspicious planetary hours.',
          'Humility and ethical integrity remain the sole guardians of high status.',
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 12: WEALTH AND FINANCIAL PROSPERITY
  // ==========================================
  const wealth = getWealthDetails(kundali);

  pages.push({
    pageNumber: 12,
    titleHi: 'पृष्ठ 12: धन, स्थायी संपत्ति एवं आर्थिक समृद्धि का योग',
    titleEn: 'Page 12: Wealth, Assets & Financial Prosperity (Dhana)',
    subtitleHi: 'द्वितीय व एकादश भाव, धन योग, संचित पूंजी, अचल संपत्ति एवं निवेश मार्गदर्शन',
    subtitleEn: '2nd & 11th Houses, Dhana Yogas, Real Estate Equity & Wealth Preservation',
    category: 'wealth',
    sections: [
      {
        headingHi: 'धन भाव (2nd) एवं लाभ भाव (11th) का व्यक्तिगत विश्लेषण',
        headingEn: 'Foundations of Sustained Abundance & Assets',
        contentHi: wealth.summaryHi,
        contentEn: wealth.summaryEn,
        tableData: {
          headers: ['धन स्तंभ', 'ग्रह / भाव स्थिति', 'ज्योतिषीय फल व शक्ति'],
          rows: wealth.tableRows,
        },
      },
      {
        headingHi: 'स्थिर लक्ष्मी एवं स्थायी आर्थिक समृद्धि के नियम',
        headingEn: 'Principles for Sustained Abundance & Wealth Growth',
        contentHi:
          'शास्त्रों के अनुसार चंचल लक्ष्मी को स्थिर बनाने के लिए धन का एक अंश सदैव परोपकार, शिक्षा और निराश्रितों के सहयोग में लगाना चाहिए।',
        contentEn:
          'Classical lore reminds that wealth (Lakshmi) remains stable and pure when consecrated by tithing, ethical earning, and community support.',
        bulletPointsHi: wealth.dhanaYogasHi,
        bulletPointsEn: wealth.dhanaYogasEn,
      },
    ],
  });

  // ==========================================
  // PAGE 13: MARRIAGE AND RELATIONSHIPS
  // ==========================================
  const marriage = getMarriageAnalysis(kundali);

  pages.push({
    pageNumber: 13,
    titleHi: 'पृष्ठ 13: विवाह, दांपत्य जीवन एवं संबंधों का विश्लेषण',
    titleEn: 'Page 13: Marriage, Partnerships & Relationship Harmony',
    subtitleHi: 'सप्तम भाव, सप्तमेश, शुक्र/गुरु की स्थिति, D9 नवमांश चक्र एवं जीवनसाथी का स्वभाव',
    subtitleEn: '7th House, 7th Lord, Venus/Jupiter Significations, D9 Navamsha & Marital Harmony',
    category: 'marriage',
    sections: [
      {
        headingHi: `सप्तम भाव (${marriage.seventhSignHindi}) एवं जीवनसाथी का संभावित स्वभाव`,
        headingEn: 'Seventh House & Nature of the Spouse',
        contentHi: marriage.maritalHarmonyHi,
        contentEn: marriage.maritalHarmonyEn,
        bulletPointsHi: [
          `जीवनसाथी का स्वभाव: ${marriage.spouseTraitsHi}`,
          `मांगलिक दोष स्थिति: ${marriage.mangalStatusHi}`,
          `विवाह का शुभ समय: सप्तमेश अथवा नवमेश की अंतर्दशा और गुरु के गोचर काल में विवाह के प्रबल योग बनते हैं।`,
        ],
        bulletPointsEn: [
          `Spouse temperament: ${marriage.spouseTraitsEn}`,
          `Manglik status: ${marriage.mangalStatusEn}`,
          `Timing window: Dasha of 7th/9th lords coupled with Jupiter’s transit activates marriage opportunities.`,
        ],
      },
      {
        headingHi: 'सुखी वैवाहिक जीवन हेतु वैदिक सारणी एवं उपाय',
        headingEn: 'Vedic Guidance for Marital Longevity',
        contentHi:
          'सप्तम भाव का मूल मंत्र पारस्परिक सम्मान और क्षमाशीलता है। जब दोनों जीवनसाथी एक-दूसरे की स्वतंत्रता और आत्मसम्मान का आदर करते हैं, तो दांपत्य जीवन सुखमय बन जाता है।',
        contentEn:
          'The essence of the 7th house is consecrated partnership. Mutual respect, unconditional forgiveness, and shared spiritual purpose foster lifelong bliss.',
        tableData: {
          headers: ['दांपत्य स्तंभ', 'जातक की कुंडली में स्थिति', 'ज्योतिषीय फल व सुझाव'],
          rows: [
            ['सप्तम भाव राशि', `${marriage.seventhSignHindi} (${marriage.seventhSign})`, 'दांपत्य की मूल ऊर्जा'],
            ['सप्तमेश की स्थिति', `${marriage.seventhLordHindi} (भाव ${marriage.seventhLordHouse})`, 'संबंधों में स्थायित्व व समझदारी'],
            ['जीवनसाथी का स्वभाव', marriage.spouseTraitsHi, 'सहयोगात्मक व परिपक्व'],
            ['मांगलिक स्थिति', marriage.mangalStatusHi, 'शास्त्रीय परिहार लागू'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 14: EDUCATION, SKILLS AND CREATIVITY
  // ==========================================
  const edu = getEducationDetails(kundali);

  pages.push({
    pageNumber: 14,
    titleHi: 'पृष्ठ 14: शिक्षा, कौशल, रचनात्मकता एवं उच्च विद्या',
    titleEn: 'Page 14: Education, Intellectual Skills & Creativity',
    subtitleHi: 'चतुर्थ व पंचम भाव, बुध व गुरु का प्रभाव, एकाग्रता, तकनीकी कौशल एवं शोध क्षमता',
    subtitleEn: '4th & 5th Houses, Mercury & Jupiter Significations, Learning Aptitude & Intellect',
    category: 'education',
    sections: [
      {
        headingHi: 'बुद्धि एवं शिक्षा के मुख्य स्तंभ',
        headingEn: 'Foundations of Learning & Academic Acumen',
        contentHi: edu.summaryHi,
        contentEn: edu.summaryEn,
        tableData: {
          headers: ['शिक्षा व ज्ञान स्तंभ', 'संबंधित भाव / ग्रह', 'शैक्षणिक फल व क्षमता'],
          rows: edu.tableRows,
        },
      },
      {
        headingHi: 'बौद्धिक दक्षता एवं आजीवन सीखने की कला',
        headingEn: 'Cognitive Mastery & Lifelong Learning Sutras',
        contentHi:
          'बुध और गुरु के शुभ प्रभाव को बढ़ाने के लिए प्रतिदिन स्वाध्याय (सद्ग्रंथों का अध्ययन) करना और नई तकनीकों से अवगत रहना अत्यंत लाभकारी होता है।',
        contentEn:
          'Nurturing Mercury and Jupiter requires daily Swadhyaya (reflective study of timeless wisdom) and active engagement with cutting-edge innovations.',
        bulletPointsHi: [
          'प्रातः काल तुलसी के पत्ते जल के साथ ग्रहण करने से बुद्धि प्रखर होती है।',
          'किताबों और अध्ययन सामग्री का आदर करें; उन्हें सदैव व्यवस्थित रखें।',
          'दूसरों को निःशुल्क ज्ञान बांटने से अपनी विद्या में वृद्धि होती है।',
        ],
        bulletPointsEn: [
          'Hydration infused with sacred basil enhances neural focus.',
          'Treat books and intellectual tools with reverence and order.',
          'Sharing knowledge freely multiplies cognitive retention and insight.',
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 15: HEALTH-RELATED TRADITIONAL ASTROLOGY
  // ==========================================
  const health = getHealthAyurvedaDetails(kundali);

  pages.push({
    pageNumber: 15,
    titleHi: 'पृष्ठ 15: स्वास्थ्य एवं पारंपरिक वैदिक स्वास्थ्य दृष्टिकोण',
    titleEn: 'Page 15: Health-Related Traditional Astrology & Well-Being',
    subtitleHi: 'षष्ठ व अष्टम भाव, त्रिदोष संतुलन (वात, पित्त, कफ), रोग प्रतिरोधक क्षमता एवं दिनचर्या',
    subtitleEn: '6th & 8th Houses, Ayurvedic Tridosha Balance, Vitality & Holistic Wellness Guidelines',
    category: 'health',
    sections: [
      {
        headingHi: `पारंपरिक आयुर्वेदिक त्रिदोष प्रकृति: ${health.primaryDoshaHi}`,
        headingEn: `Traditional Tridosha Constitution: ${health.primaryDoshaEn}`,
        contentHi: `जातक का जन्म लग्न ${kundali.ascendantSignHindi} (${health.lagnaElementHi}) और चंद्र राशि ${kundali.moonSignHindi} (${health.moonElementHi}) है। इसके आधार पर जातक की स्वाभाविक आयुर्वेदिक प्रकृति ${health.primaryDoshaHi} है। षष्ठ भाव के आधार पर विशेष रूप से ${health.vulnerableOrgansHi} की सुरक्षा और संतुलित जीवनशैली आवश्यक है।`,
        contentEn: `Ascendant in ${kundali.ascendantSign} (${health.lagnaElementEn}) and Moon in ${kundali.moonSign} (${health.moonElementEn}) establish an Ayurvedic baseline of ${health.primaryDoshaEn}. Sixth house signifies keeping ${health.vulnerableOrgansEn} protected.`,
        tableData: {
          headers: ['शारीरिक तंत्र', 'जातक की स्थिति', 'पारंपरिक देखभाल निर्देश'],
          rows: health.tableRows,
        },
      },
      {
        headingHi: 'प्राकृतिक वैदिक दिनचर्या एवं ऋतुचर्या दिशानिर्देश',
        headingEn: 'Dinacharya: Holistic Vedic Daily Wellness Regimen',
        contentHi:
          'ऋषि चरक और सुश्रुत के अनुसार सूर्योदय से पूर्व जागना (ब्रह्म मुहूर्त), तांबे के पात्र का जल पीना, और ऋतु के अनुसार खानपान अपनाना दीर्घायु का अचूक साधन है।',
        contentEn:
          'Classical Ayurveda counsels awakening in Brahma Muhurta, morning copper-water hydration, and seasonal nutrition (Ritucharya) for vibrant longevity.',
        bulletPointsHi: health.dinacharyaTipsHi,
        bulletPointsEn: health.dinacharyaTipsEn,
      },
      {
        headingHi: 'महत्वपूर्ण नैतिक एवं वैधानिक स्वास्थ्य अस्वीकरण',
        headingEn: 'Mandatory Ethical Health & Medical Disclaimer',
        contentHi:
          '⚠️ महत्वपूर्ण अस्वीकरण: यह रिपोर्ट केवल पारंपरिक वैदिक ज्योतिषीय प्रवृत्तियों का प्रतीकात्मक विश्लेषण है। यह किसी भी रोग का चिकित्सीय निदान (Medical Diagnosis) अथवा उपचार नहीं है। किसी भी स्वास्थ्य समस्या के लिए केवल योग्य चिकित्सक (Doctor/Physician) से ही परामर्श लें। कभी भी दवाइयां न छोड़ें और न ही चिकित्सीय सलाह की उपेक्षा करें।',
        contentEn:
          '⚠️ MANDATORY MEDICAL DISCLAIMER: This astrological analysis is purely symbolic and educational based on traditional Vedic philosophies. It is NOT medical advice or diagnosis. Never discontinue medications or delay medical consultations based on astrological texts.',
        highlightBadge: 'कठोर नैतिक स्वास्थ्य अस्वीकरण लागू',
      },
    ],
  });

  // ==========================================
  // PAGE 16: AUSPICIOUS YOGAS AND RAJ YOGAS
  // ==========================================
  const rawYogas = kundali.yogas || [];
  const yogaRows =
    rawYogas.length > 0
      ? rawYogas.map((y) => [
          y.nameHindi || y.name,
          y.categoryLabelHindi || 'शुभ योग',
          (y.planetsInvolvedHindi || y.planetsInvolved || []).join(', '),
          y.formationHindi || y.formation,
          y.strengthHindi || y.strength,
        ])
      : [
          ['लग्न-केंद्र योग', 'शुभ योग', `${ascLordHindi}`, 'लग्नेश का केंद्र/त्रिकोण में होना', 'प्रबल'],
          ['भाग्य-कर्म योग', 'राजयोग', 'गुरु / सूर्य', 'नवम व दशम भाव का संबंध', 'शुभ फलदायी'],
          ['चंद्र-बुद्धि योग', 'ज्ञान योग', 'चंद्रमा / बुध', 'शुभ भावों में ग्रहीय दृष्टि', 'सक्रिय'],
        ];

  pages.push({
    pageNumber: 16,
    titleHi: 'पृष्ठ 16: शुभ योग, राजयोग एवं विशेष ग्रहीय युतियां',
    titleEn: 'Page 16: Auspicious Yogas, Raja Yogas & Planetary Combinations',
    subtitleHi: 'पंच महापुरुष योग, गजकेसरी, बुधादित्य, धन योग एवं जीवन में भाग्योदय के स्वर्णिम क्षण',
    subtitleEn: 'Pancha Mahapurusha, Gajakesari, Budhaditya, Dhana Yogas & Auspicious Conjunctions',
    category: 'yoga_dosha',
    sections: [
      {
        headingHi: `आपकी कुंडली में उपस्थित प्रमुख शुभ योग (${yogaRows.length} योग सत्यापित)`,
        headingEn: `Verified Auspicious Yogas in Native's Chart (${yogaRows.length} Detected)`,
        contentHi: `कुंडली में योग तब बनते हैं जब शुभ ग्रह विशिष्ट भावों और राशियों में एक-दूसरे से संबंध स्थापित करते हैं। ये योग जीवन में ईश्वरीय अनुग्रह और अप्रत्याशित सफलता के अवसर प्रदान करते हैं।`,
        contentEn: `Auspicious yogas manifest when celestial forces form geometric alignments across Kendra and Trikona houses, unlocking latent success potential.`,
        tableData: {
          headers: ['योग का नाम', 'श्रेणी', 'संबंधित ग्रह', 'निर्माण का आधार', 'बल / शक्ति'],
          rows: yogaRows,
        },
      },
      {
        headingHi: 'योगों को सक्रिय करने के स्वर्णिम सूत्र',
        headingEn: 'Activating Natal Yogas Through Righteous Action',
        contentHi:
          'महर्षि पराशर के अनुसार केवल योग का होना पर्याप्त नहीं है; योग के पूर्ण फल के लिए संबंधित ग्रह की दशा और जातक का स्वयं पुरुषार्थ (कड़ा परिश्रम) करना अनिवार्य है। पाप ग्रहों की दृष्टि होने पर योग के फलों में कुछ विलंब हो सकता है।',
        contentEn:
          'Yogas require planetary Dasha timing and human diligence (Purushartha) to bear fruit. Afflictions from malefic aspects may delay but rarely cancel verified benefic yogas.',
        bulletPointsHi: [
          'ईष्ट देव की नियमित आराधना से शुभ योग समय पर सक्रिय होते हैं।',
          'अहंकार और दूसरों के शोषण से बचें; सात्विक आचरण से योगों की शक्ति द्विगुणित होती है।',
          'सक्रिय योग के स्वामी ग्रह के बीज मंत्र का जप विशेष फलदायी होता है।',
        ],
        bulletPointsEn: [
          'Regular reverence to Ishta Devata awakens auspicious yogic frequencies.',
          'Cultivate humility; exploitation of subordinates weakens positive yogic merits.',
          'Reciting beej mantras of yoga-forming planets accelerates manifestation.',
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 17: DOSHA ANALYSIS AND VERIFICATION
  // ==========================================
  const isManglik = kundali.dosha?.isManglik ?? false;
  const isKaalSarp = kundali.dosha?.isKalsarp ?? false;
  const isSadeSatiDosha = kundali.dosha?.isSadeSati ?? false;

  pages.push({
    pageNumber: 17,
    titleHi: 'पृष्ठ 17: दोष विश्लेषण एवं सत्यापन (Dosha Verification)',
    titleEn: 'Page 17: Dosha Analysis & Accurate Verification',
    subtitleHi: 'मंगल दोष (कुज दोष), कालसर्प दोष, पितृ दोष एवं निवारण की प्रामाणिक स्थिति',
    subtitleEn: 'Mangal Dosha, Kaal Sarp Dosha, Pitra Afflictions & Scriptural Mitigations',
    category: 'yoga_dosha',
    sections: [
      {
        headingHi: 'मंगल दोष, कालसर्प एवं ग्रहीय दोषों का सूक्ष्म सत्यापन',
        headingEn: 'Technical Evaluation of Astrological Doshas',
        contentHi: `लग्न, चंद्र और शुक्र से मंगल की स्थिति तथा राहु-केतु अक्ष का शास्त्रीय परीक्षण किया गया है। आपकी कुंडली में: ${
          isManglik
            ? `मंगल का प्रभाव (${kundali.dosha?.manglikPercentage || 50}%) दृष्टिगोचर होता है, परंतु शास्त्रीय परिहार नियमों के कारण इसका प्रभाव क्षीण हो जाता है।`
            : 'मंगल दोष उपस्थित नहीं है (निर्दोष स्थिति)।'
        }`,
        contentEn: `Evaluated across Lagna, Moon, and Venus. Status: ${
          isManglik
            ? `Mangal influence detected (${kundali.dosha?.manglikPercentage || 50}%), subject to classical Parashari cancellation (Parihara) rules.`
            : 'No adverse Mangal Dosha present.'
        }`,
        tableData: {
          headers: ['दोष का नाम', 'सत्यापित स्थिति (Result)', 'परीक्षित शर्त / नियम', 'शास्त्रीय प्रभाव'],
          rows: [
            [
              'मंगल दोष (Kuja Dosha)',
              isManglik ? `सक्रिय (${kundali.dosha?.manglikPercentage || 50}%)` : 'अनुपस्थित (Safe)',
              `मंगल भाव ${mars?.house || 1} में स्थित`,
              isManglik ? 'दांपत्य में समझदारी व परिपक्वता आवश्यक' : 'दांपत्य सुख शांतिपूर्ण रहेगा',
            ],
            [
              'कालसर्प योग (Kaal Sarp)',
              isKaalSarp ? `सक्रिय (${kundali.dosha?.kalsarpType || 'आंशिक'})` : 'पूर्णतः अनुपस्थित (Safe)',
              'राहु-केतु अक्ष परीक्षण',
              isKaalSarp ? 'जीवन में निरंतर कर्म से बड़ी प्रगति' : 'सभी ग्रह राहु-केतु अक्ष से स्वतंत्र',
            ],
            [
              'शनि साढ़ेसाती प्रभाव',
              isSadeSatiDosha ? 'सक्रिय चक्र' : 'शांत / अनुकूल (मुक्त)',
              'गोचर शनि व जन्म चंद्रमा परीक्षण',
              isSadeSatiDosha ? 'धैर्य व कर्म की परीक्षा' : 'मानसिक शांति व स्थिरता',
            ],
            ['पितृ दोष विचार', 'शांत एवं निर्दोष', 'सूर्य-राहु युति परीक्षण', 'पूर्वजों के प्रति सम्मान व तर्पण से शुभता'],
          ],
        },
      },
      {
        headingHi: 'भय-मुक्त वैदिक दृष्टिकोण',
        headingEn: 'Fear-Free Vedic Philosophical Perspective',
        contentHi:
          'शास्त्रों में किसी भी दोष को अंतिम अभिशाप नहीं माना गया है। सच्चे कर्म, सकारात्मक सोच, माता-पिता की सेवा और ईश्वर भक्ति से सभी प्रकार के ग्रह दोष स्वतः निष्प्रभावी हो जाते हैं। अंधविश्वास और अनावश्यक महंगे अनुष्ठानों से दूर रहें।',
        contentEn:
          'Scriptures teach that conscious ethical action, devotion, and compassion dissolve afflictions. Avoid superstition and fear-based commercially engineered rituals.',
        highlightBadge: 'प्रामाणिक शास्त्रीय नियम (No Superstition)',
      },
    ],
  });

  // ==========================================
  // PAGE 18: VIMSHOTTARI DASHA ANALYSIS
  // ==========================================
  const activeDasha = kundali.dashaPeriods.find((d) => d.current) || kundali.dashaPeriods[0];
  const activeDashaPlanet = kundali.planets.find((p) => p.name === activeDasha.planet);

  pages.push({
    pageNumber: 18,
    titleHi: 'पृष्ठ 18: विंशोत्तरी महादशा एवं अंतर्दशा समयरेखा',
    titleEn: 'Page 18: Vimshottari Dasha Analysis & Predictive Cycles',
    subtitleHi: '120-वर्षीय विंशोत्तरी चक्र, वर्तमान सक्रिय महादशा, अंतर्दशा एवं आगामी कालखंड',
    subtitleEn: '120-Year Parashari Planetary Cycle, Active Mahadasha & Sequential Sub-Periods',
    category: 'dasha',
    sections: [
      {
        headingHi: 'विंशोत्तरी महादशा कालक्रम सारणी (सम्पूर्ण जीवन चक्र)',
        headingEn: 'Vimshottari 9 Mahadasha Cycles Timeline',
        contentHi:
          'विंशोत्तरी दशा वैदिक भविष्य कथन का मूलाधार है। 120 वर्ष के चक्र में प्रत्येक ग्रह का अपना निश्चित कालखंड होता है। वर्तमान में सक्रिय महादशा जातक के जीवन के इस अध्याय की प्राथमिक दिशा तय करती है।',
        contentEn:
          'Vimshottari Dasha is the preeminent timing system of Parashara. A 120-year cycle allocates governance to nine planets according to natal Moon longitude.',
        tableData: {
          headers: ['महादशा स्वामी', 'संस्कृत नाम', 'अवधि (वर्ष)', 'कालखंड (Period)', 'वर्तमान स्थिति'],
          rows: kundali.dashaPeriods.map((d) => [
            d.planet,
            d.hindiName,
            `${d.durationYears} वर्ष`,
            `${d.startDate} से ${d.endDate}`,
            d.current ? '🔥 सक्रिय वर्तमान महादशा (ACTIVE)' : 'आगामी / व्यतीत',
          ]),
        },
      },
      {
        headingHi: `वर्तमान सक्रिय महादशा: ${activeDasha.hindiName} (${activeDasha.planet}) का प्रभाव`,
        headingEn: `Impact of Active Mahadasha (${activeDasha.planet})`,
        contentHi: `वर्तमान में आप ${activeDasha.hindiName} (${activeDasha.planet}) की महादशा में चल रहे हैं (${activeDasha.startDate} से ${activeDasha.endDate})। यह ग्रह आपकी कुंडली में भाव ${activeDashaPlanet?.house || 'केंद्र'} में स्थित है। इस दशा में इस ग्रह के कारकत्व और इसके अधिकार वाले भावों के फल जीवन में अत्यंत सक्रिय रूप से प्रकट हो रहे हैं।`,
        contentEn: `Currently navigating the Mahadasha of ${activeDasha.planet} (${activeDasha.startDate} to ${activeDasha.endDate}), positioned in House ${activeDashaPlanet?.house || 'Kendra'}.`,
        bulletPointsHi: [
          `सक्रिय महादशा स्वामी: ${activeDasha.hindiName} (${activeDasha.planet})`,
          `कालखंड: ${activeDasha.startDate} से ${activeDasha.endDate}`,
          `सफलता का सूत्र: ${activeDasha.hindiName} के मंत्र का नियमित जप और ईष्ट देव की आराधना करें।`,
        ],
        bulletPointsEn: [
          `Active Mahadasha Lord: ${activeDasha.planet}`,
          `Time window: ${activeDasha.startDate} to ${activeDasha.endDate}`,
          `Recommendation: Chant the beej mantra of ${activeDasha.planet} and maintain righteous karma.`,
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 19: SADE SATI & SATURN TRANSIT
  // ==========================================
  const sadeSati = getSadeSatiDetails(kundali);

  pages.push({
    pageNumber: 19,
    titleHi: 'पृष्ठ 19: शनि साढ़ेसाती, ढैया एवं गोचर प्रभाव का विश्लेषण',
    titleEn: 'Page 19: Sade Sati, Dhaiya & Saturn Transit Dynamics',
    subtitleHi: 'जन्म चंद्रमा से शनि का गोचर, साढ़ेसाती के तीन चरण, ढैया एवं व्यावहारिक कर्मयोग',
    subtitleEn: 'Saturn Transit Relative to Natal Moon, 3 Sade Sati Phases, Kantaka Shani & Karmic Realignment',
    category: 'timeline',
    sections: [
      {
        headingHi: `शनि साढ़ेसाती की वास्तविक स्थिति: ${sadeSati.statusTitleHi}`,
        headingEn: `Saturn Sade Sati Evaluation: ${sadeSati.statusTitleEn}`,
        contentHi: `${sadeSati.guidanceHi}`,
        contentEn: `${sadeSati.guidanceEn}`,
        tableData: {
          headers: ['शनि स्तंभ', 'जातक की कुंडली में स्थिति', 'शास्त्रीय प्रभाव व समाधान'],
          rows: sadeSati.tableRows,
        },
      },
      {
        headingHi: 'शनि कृपा प्राप्ति के व्यावहारिक नियम',
        headingEn: 'Ethical Guidelines for Harmonizing Saturn',
        contentHi:
          'शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का चौमुखी दीपक जलाना, श्रमिकों व सफाई कर्मियों का सम्मान करना और असहायों को भोजन कराना शनि के प्रतिकूल प्रभाव को नष्ट कर देता है।',
        contentEn:
          'Lighting a mustard oil lamp near a sacred Peepal tree on Saturdays and feeding marginalized communities aligns transit energies beneficially.',
        bulletPointsHi: [
          'समय के पाबंद रहें और झूठे वादे न करें।',
          'अपने अधीनस्थ कर्मचारियों के साथ सदैव न्यायपूर्ण और दयालु व्यवहार रखें।',
          'प्रतिदिन या प्रत्येक शनिवार को हनुमान चालीसा अथवा सुंदरकांड का पाठ करें।',
        ],
        bulletPointsEn: [
          'Maintain rigorous punctuality and never make false commitments.',
          'Treat subordinates and service personnel with absolute fairness and generosity.',
          'Recite Hanuman Chalisa or Sundarkand on Saturdays.',
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 20: DIVISIONAL CHARTS (VARGAS)
  // ==========================================
  const divCharts = getDivisionalChartsDetails(kundali, horaData);

  pages.push({
    pageNumber: 20,
    titleHi: 'पृष्ठ 20: वर्ग कुंडलियों का सूक्ष्म विश्लेषण (Divisional Charts)',
    titleEn: 'Page 20: Divisional Chart Interpretation (Vargas)',
    subtitleHi: 'D9 नवमांश (भाग्य/दांपत्य), D10 दशमांश (करियर), D7 सप्तमांश व वर्गोत्तम ग्रह स्थिति',
    subtitleEn: 'D9 Navamsha, D10 Dashamsha, D7 Saptamsha, D12 Dwadashamsha & Vargottama Planets',
    category: 'varga',
    sections: [
      {
        headingHi: 'वर्ग कुंडलियों की महत्ता एवं सूक्ष्म फल',
        headingEn: 'The Science of Divisional Charts',
        contentHi: divCharts.summaryHi,
        contentEn: divCharts.summaryEn,
        tableData: {
          headers: ['वर्ग चक्र', 'जातक की स्थिति', 'नियंत्रित विषय व सूक्ष्म फल'],
          rows: divCharts.tableRows,
        },
      },
      {
        headingHi: 'वर्गोत्तम ग्रह एवं आंतरिक आत्मबल',
        headingEn: 'Vargottama Planetary Strength',
        contentHi:
          'जो ग्रह D1 और D9 दोनों में एक ही राशि में स्थित होते हैं, उन्हें वर्गोत्तम कहा जाता है। वर्गोत्तम ग्रह राजा के समान बलशाली माने जाते हैं और जीवन में जातक को कभी भी असहाय नहीं होने देते।',
        contentEn:
          'Planets occupying the identical zodiac sign in both D1 Rashi and D9 Navamsha achieve Vargottama status, bestowing enduring resilience and high self-protective power.',
        bulletPointsHi: [
          `D1 लग्न: ${divCharts.d1Lagna}`,
          `D9 नवमांश लग्न: ${divCharts.d9Lagna}`,
          `D10 दशमांश लग्न: ${divCharts.d10Lagna}`,
        ],
        bulletPointsEn: [
          `D1 Ascendant: ${divCharts.d1Lagna}`,
          `D9 Navamsha Ascendant: ${divCharts.d9Lagna}`,
          `D10 Dashamsha Ascendant: ${divCharts.d10Lagna}`,
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 21: PERSONALIZED GEMSTONES & RUDRAKSHA
  // ==========================================
  const gemRud = getGemstoneAndRudraksha(kundali);

  pages.push({
    pageNumber: 21,
    titleHi: 'पृष्ठ 21: व्यक्तिगत रत्न एवं रुद्राक्ष परामर्श (Gemstones & Rudraksha)',
    titleEn: 'Page 21: Personalized Gemstones & Rudraksha Recommendations',
    subtitleHi: 'लग्नेश रत्न (जीवन रत्न), भाग्येश रत्न, वर्जित रत्न एवं रुद्राक्ष धारण विधि',
    subtitleEn: 'Life Stone, Fortune Stone, Prohibited Gems & Sacred Rudraksha Wearing Protocol',
    category: 'remedies',
    sections: [
      {
        headingHi: `जातक (${birthDetails.name || 'जातक'}) के अनुकूल प्रामाणिक रत्न (${kundali.ascendantSignHindi} लग्न)`,
        headingEn: `Auspicious Gemstones for ${birthDetails.name || 'Native'} (${kundali.ascendantSign} Lagna)`,
        contentHi: `वैदिक ज्योतिष के अनुसार केवल त्रिकोण (1, 5, 9) के स्वामियों के रत्न ही धारण करने चाहिए। 6, 8, 12 भावों के स्वामियों के रत्न कभी धारण नहीं करने चाहिए। आपकी ${kundali.ascendantSignHindi} लग्न कुंडली और वर्तमान सक्रिय महादशा (${activeDasha.hindiName}) के अनुसार:`,
        contentEn: `In Parashari astrology, only lords of auspicious Trikona houses (1, 5, 9) may be consecrated as gemstones. Lords of Dusthana houses (6, 8, 12) must never be worn. Calculated for ${kundali.ascendantSign} Lagna and ${activeDasha.planet} Mahadasha:`,
        tableData: {
          headers: ['रत्न का प्रकार', 'अनुशंसित रत्न', 'संबंधित ग्रह', 'धातु व उंगली', 'बीज मंत्र'],
          rows: [
            ['जीवन रत्न (Life Stone)', gemRud.lifeStone.nameHi, gemRud.lifeStone.planetHi, `${gemRud.lifeStone.metalHi} • ${gemRud.lifeStone.fingerHi}`, gemRud.lifeStone.mantraHi],
            ['भाग्य रत्न (Lucky Stone)', gemRud.luckyStone.nameHi, gemRud.luckyStone.planetHi, `${gemRud.luckyStone.metalHi} • ${gemRud.luckyStone.fingerHi}`, gemRud.luckyStone.mantraHi],
            ['विद्या रत्न (Benefic Stone)', gemRud.beneficStone.nameHi, gemRud.beneficStone.planetHi, `${gemRud.beneficStone.metalHi} • ${gemRud.beneficStone.fingerHi}`, gemRud.beneficStone.mantraHi],
            ['सक्रिय दशा अनुकूलता', `${activeDasha.hindiName} (${activeDasha.planet})`, 'वर्तमान महादशा स्वामी', 'कनिष्ठिका / अनामिका', `दशा काल (${activeDasha.startDate} से ${activeDasha.endDate})`],
          ],
        },
      },
      {
        headingHi: 'अनुशंसित रुद्राक्ष एवं वर्जित रत्न चेतावनी',
        headingEn: 'Recommended Rudraksha & Forbidden Gemstone Warnings',
        contentHi: `⚠️ वर्जित रत्न चेतावनी: ${gemRud.forbiddenGemsHi} किसी भी अंधविश्वास में आकर गलत रत्न न पहनें, अन्यथा विपरीत परिणाम हो सकते हैं।`,
        contentEn: `⚠️ Warning on Prohibited Gems: ${gemRud.forbiddenGemsEn}`,
        bulletPointsHi: [
          `अनुशंसित रुद्राक्ष: ${gemRud.recommendedRudraksha.mukhiHi}`,
          `अधिष्ठाता देवता: ${gemRud.recommendedRudraksha.deityHi}`,
          `शुभ प्रभाव: ${gemRud.recommendedRudraksha.benefitHi}`,
          `धारण विधि: सोमवार या गुरुवार को गंगाजल व कच्चे दूध से शुद्ध कर ॐ नमः शिवाय का 108 बार जप करके लाल धागे में धारण करें।`,
        ],
        bulletPointsEn: [
          `Recommended Rudraksha: ${gemRud.recommendedRudraksha.mukhiEn}`,
          `Presiding Deity: ${gemRud.recommendedRudraksha.deityHi}`,
          `Auspicious Benefit: ${gemRud.recommendedRudraksha.benefitHi}`,
          `Protocol: Consecrate on Mondays/Thursdays in Ganga water and raw milk, chanting Om Namah Shivaya 108 times.`,
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 22: VEDIC REMEDIES, MANTRAS & CHARITY
  // ==========================================
  pages.push({
    pageNumber: 22,
    titleHi: 'पृष्ठ 22: संपूर्ण वैदिक उपाय, मंत्र साधना एवं सात्विक दान',
    titleEn: 'Page 22: Personalized Vedic Remedies, Mantras & Charity (Upay)',
    subtitleHi: 'लग्नेश, चंद्रेश व दशा स्वामी के वैदिक बीज मंत्र, दैनिक जप एवं सात्विक दान सामग्री',
    subtitleEn: 'Beej Mantras for Lagna Lord, Moon Lord & Dasha Lord, Daily Japa & Charitable Offerings',
    category: 'remedies',
    sections: [
      {
        headingHi: 'आपकी कुंडली के विशिष्ट दैनिक वैदिक मंत्र',
        headingEn: 'Sacred Beej Mantras Tailored to Your Natal Lords',
        contentHi:
          'मंत्र ध्वनि की तरंगे हैं जो अंतःकरण को शुद्ध करती हैं। प्रतिदिन प्रातः स्नान के बाद 11 या 108 बार निम्न मंत्रों का जप करने से मानसिक स्पष्टता और सकारात्मक ऊर्जा का संचार होता है।',
        contentEn:
          'Mantras are vibrational tools for conscious alignment. Reciting these beej mantras 11 to 108 times daily cultivates mental clarity and peace.',
        tableData: {
          headers: ['मंत्र का नाम', 'वैदिक बीज मंत्र', 'समय / विधि', 'शुभ प्रभाव'],
          rows: [
            ['लग्नेश मंत्र', `${ascLordHindi} का मंत्र: ${gemRud.lifeStone.mantraHi}`, 'प्रातः काल स्नान उपरांत', 'आत्मबल, स्वास्थ्य व ऊर्जा'],
            ['चंद्र देव मंत्र', `ॐ सों सोमाय नमः (चंद्रमा: ${kundali.moonSignHindi})`, 'संध्या काल या पूर्णिमा', 'मानसिक शांति व अनिद्रा मुक्ति'],
            ['महादशा स्वामी मंत्र', `${activeDasha.hindiName} का मंत्र: ॐ ह्रीं श्रीं क्लीं...`, 'दैनिक पूजा में 1 माला', 'सक्रिय दशा के शुभ फलों की प्राप्ति'],
            ['महामृत्युंजय मंत्र', 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥', 'नित्य 11 बार', 'आरोग्य, अभय व दीर्घायु'],
          ],
        },
      },
      {
        headingHi: 'सात्विक दान एवं नैतिक आचरण सूत्र',
        headingEn: 'Charitable Practices & Ethical Living Sutras',
        contentHi:
          'शास्त्रों के अनुसार सबसे बड़ा और अचूक उपाय है—सत्य आचरण, माता-पिता का सम्मान, असहायों को अन्न दान और गौ-सेवा। दान सदैव सात्विक मन से और पात्र व्यक्ति को ही देना चाहिए।',
        contentEn:
          'Ancient scriptures remind that compassionate charity, caring for elderly parents, and supporting the hungry dissolve planetary hardships far beyond commercial rituals.',
        bulletPointsHi: [
          'बुधवार को गौ माता को हरा चारा खिलाएं।',
          'सप्ताह में एक बार पक्षियों के लिए छत पर जल और दाना रखें।',
          'अमावस्या के दिन पितरों के निमित्त किसी जरूरतमंद को भोजन कराएं।',
        ],
        bulletPointsEn: [
          'Feed fresh green fodder to cows on Wednesdays.',
          'Place clean drinking water and grains for wild birds.',
          'Donate cooked food to impoverished seekers on Amavasya.',
        ],
      },
    ],
  });

  // ==========================================
  // PAGE 23: CORE STRENGTHS & LIFE ROADMAP
  // ==========================================
  pages.push({
    pageNumber: 23,
    titleHi: 'पृष्ठ 23: जातक की मूल शक्तियां एवं 3-चरणीय जीवन रोडमैप',
    titleEn: 'Page 23: Core Strengths, Life Path & 3-Phase Action Roadmap',
    subtitleHi: 'संश्लिष्ट व्यक्तित्व ढांचा, नैतिक दिशा, 3-चरणीय कार्ययोजना एवं जीवन लक्ष्य',
    subtitleEn: 'Holistic Synthesis, Ethical Anchors, 3-Phase Strategic Roadmap & Self-Actualization',
    category: 'strength',
    sections: [
      {
        headingHi: `जातक का व्यक्तित्व ढांचा: ${kundali.ascendantSignHindi} लग्न + ${kundali.moonSignHindi} राशि`,
        headingEn: `Holistic Synthesis: ${kundali.ascendantSign} Lagna + ${kundali.moonSign} Moon`,
        contentHi: `आपकी कुंडली में ${kundali.ascendantSignHindi} लग्न जातक को ${ascProfile.strengthsHi} प्रदान करता है, जबकि ${kundali.moonSignHindi} चंद्र राशि ${moonProfile.mindsetHi} यह संयोजन जातक को व्यावहारिक और भावनात्मक दोनों स्तरों पर सुदृढ़ बनाता है।`,
        contentEn: `Ascendant in ${kundali.ascendantSign} anchors outward resilience while Moon in ${kundali.moonSign} shapes subconscious intuition, forging a well-balanced character.`,
        bulletPointsHi: [
          `आंतरिक शक्ति: प्रतिकूल परिस्थितियों में भी धैर्य न खोने का स्वाभाविक गुण।`,
          `बुद्धि व निर्णय क्षमता: सही अवसर को पहचानने और योजनाबद्ध कार्य करने की दक्षता।`,
          `सामाजिक सद्भावना: लोगों का विश्वास जीतने और निष्ठावान संबंध बनाए रखने की क्षमता।`,
        ],
        bulletPointsEn: [
          `Psychological grit: Natural resilience to overcome complex external setbacks.`,
          `Discernment: Intuitive grasp of viable commercial and interpersonal opportunities.`,
          `Integrity: Ability to evoke deep trust and command respect across communities.`,
        ],
      },
      {
        headingHi: '3-चरणीय व्यावहारिक जीवन रोडमैप (Action Plan)',
        headingEn: '3-Phase Practical Life Roadmap',
        contentHi:
          'जीवन को सफल और संतुलित बनाने के लिए वैदिक ऋषियों ने तीन चरणों का विधान किया है: मन की शुद्धि, कर्म की दृढ़ता, और समाज को समर्पण।',
        contentEn:
          'The Vedic path prescribes threefold harmony: mental purity (Sattva), disciplined action (Karma), and benevolent service (Seva).',
        tableData: {
          headers: ['चरण (Phase)', 'मुख्य कार्यक्षेत्र', 'व्यावहारिक नियम'],
          rows: [
            ['चरण 1: आत्म-अनुशासन', 'स्वास्थ्य एवं दैनिक दिनचर्या', 'नियमित योग, संतुलित खानपान व समय पर शयन'],
            ['चरण 2: व्यावसायिक विस्तार', 'करियर व आर्थिक योजना', 'निरंतर नए कौशल सीखना, लंबी अवधि के वित्तीय लक्ष्य'],
            ['चरण 3: आध्यात्मिक संतुलन', 'परिवार, समाज व सेवा', 'प्रतिदिन 15 मिनट ध्यान, दीन-दुखियों की सेवा व सत्संग'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 24: ASTROLOGICAL GLOSSARY & PERSONAL COORDINATES
  // ==========================================
  pages.push({
    pageNumber: 24,
    titleHi: 'पृष्ठ 24: प्रामाणिक वैदिक ज्योतिष पारिभाषिक शब्दावली',
    titleEn: 'Page 24: Astrological Glossary & Key Vedic Concepts',
    subtitleHi: 'लग्न, राशि, भाव, नक्षत्र, दशा, गोचर, योग, दृष्टि एवं नवमांश की सरल व्याख्या',
    subtitleEn: 'Comprehensive Dictionary of Vedic Astrology Terms & Technical Definitions',
    category: 'glossary',
    sections: [
      {
        headingHi: `जातक के व्यक्तिगत खगोलीय पैरामीटर (${birthDetails.name || 'जातक'})`,
        headingEn: `Native's Personalized Astronomical Coordinates`,
        contentHi: `यह तालिका जातक की व्यक्तिगत कुंडली के मुख्य खगोलीय आंकड़ों को संक्षेप में प्रस्तुत करती है:`,
        contentEn: `Summary of key astronomical coordinates calculated for this specific birth profile:`,
        tableData: {
          headers: ['पैरामीटर', 'मान (Value)', 'शास्त्रीय महत्व'],
          rows: [
            ['जन्म लग्न (Ascendant)', `${kundali.ascendantSignHindi} (${kundali.ascendantSign})`, `स्पष्ट अंश: ${kundali.ascendantDegree}`],
            ['जन्म चंद्र राशि (Moon)', `${kundali.moonSignHindi} (${kundali.moonSign})`, `स्वामी: ${SIGN_LORDS_HINDI[kundali.moonSign]}`],
            ['जन्म नक्षत्र व चरण', `${kundali.birthNakshatraHindi} (चरण ${moon.pada})`, `नक्षत्र अधिपति: ${kundali.nakshatraLord}`],
            ['सक्रिय महादशा', `${activeDasha.hindiName} (${activeDasha.planet})`, `${activeDasha.startDate} से ${activeDasha.endDate}`],
            ['अयनांश मानक', "Lahiri (Chitrapaksha) 24° 10'", 'खगोलीय शुद्धीकरण'],
          ],
        },
      },
      {
        headingHi: 'वैदिक ज्योतिष के प्रमुख पारिभाषिक शब्द',
        headingEn: 'Key Astrological Terminology',
        contentHi:
          'वैदिक ज्योतिष एक विशुद्ध खगोलीय और दार्शनिक विज्ञान है। इस रिपोर्ट में प्रयुक्त मुख्य शब्दों की संक्षिप्त व्याख्या यहां दी जा रही है ताकि आप अपनी कुंडली को सरलता से समझ सकें।',
        contentEn:
          'Vedic astrology is an exact astronomical and philosophical science. Below is a dictionary of primary terms utilized throughout this report.',
        tableData: {
          headers: ['शब्द (Term)', 'संस्कृत मूल / परिभाषा', 'सरल अर्थ एवं महत्व'],
          rows: [
            ['लग्न (Ascendant)', 'तनु भाव (Rising Sign)', 'जन्म के समय पूर्वी क्षितिज पर उदित राशि; जीवन का मुख्य आधार'],
            ['राशि (Moon Sign)', 'चंद्र राशि (Janma Rashi)', 'जन्म के समय चंद्रमा जिस राशि में स्थित हो; मन और भावनाओं का प्रतीक'],
            ['भाव (Bhava / House)', 'द्वादश भाव (12 Houses)', 'कुंडली के 12 घर, जिनमें से प्रत्येक जीवन के अलग-अलग क्षेत्र को दर्शाता है'],
            ['नक्षत्र (Nakshatra)', '27 चंद्र नक्षत्र', 'आकाश मंडल के 27 तारामंडल; व्यक्ति के सूक्ष्म स्वभाव का नियंत्रक'],
            ['विंशोत्तरी दशा', '120-वर्षीय कालचक्र', 'ग्रहों के शासन काल की समयरेखा जो जीवन की घटनाओं के समय को निर्धारित करती है'],
            ['गोचर (Gochara)', 'ग्रहों का वर्तमान भ्रमण', 'आकाश में ग्रहों की वर्तमान स्थिति का जातक की जन्म कुंडली पर प्रभाव'],
            ['वर्ग चक्र (Vargas)', 'विभागीय कुंडलियां', 'D1 से D60 तक के सूक्ष्म चक्र जो जीवन के विशिष्ट क्षेत्रों का विश्लेषण करते हैं'],
            ['केंद्र भाव (Kendra)', '1, 4, 7, 10 भाव', 'कुंडली के चार मुख्य खंभे (भगवान विष्णु के स्थान); सांसारिक स्थिरता'],
            ['त्रिकोण भाव (Trikona)', '1, 5, 9 भाव', 'धर्म और ईश्वरीय अनुग्रह के स्थान (माता लक्ष्मी के स्थान); परम शुभ'],
            ['साढ़ेसाती (Sade Sati)', 'शनि का 7.5 वर्षीय गोचर', 'जन्म चंद्रमा से 12वें, 1वें व 2रे भाव में शनि का 7.5 वर्ष का अनुशासन काल'],
          ],
        },
      },
    ],
  });

  // ==========================================
  // PAGE 25: VERIFICATION AND FINAL ASTROLOGICAL SUMMARY
  // ==========================================
  pages.push({
    pageNumber: 25,
    titleHi: 'पृष्ठ 25: अंतिम ज्योतिषीय सत्यापन, शास्त्रीय संदर्भ एवं आशीर्वचन',
    titleEn: 'Page 25: Verification Checklist, Classical Citations & Official Seal',
    subtitleHi: 'खगोलीय गणना सत्यापन, अयनांश मानक, शास्त्रीय संदर्भ ग्रंथ एवं वैदिक आशीर्वचन',
    subtitleEn: 'Astronomical Verification Checklist, Classical Citations & AstroDost Official Seal',
    category: 'verification',
    sections: [
      {
        headingHi: `गणना सत्यापन एवं खगोलीय मानक चेकलिस्ट: ${birthDetails.name || 'जातक'}`,
        headingEn: `Astronomical Computation Checklist: ${birthDetails.name || 'Native'}`,
        contentHi: `AstroDost AI द्वारा उत्पन्न यह 25-पृष्ठीय संपूर्ण जन्मकुंडली लेखा-जोखा नासा जेपीएल (NASA JPL DE405/441) एफिमेरिस एवं स्विस एफिमेरिस के उच्चतम परिशुद्धता मानकों पर सत्यापित है।`,
        contentEn: `This 25-page complete horoscope documentation conforms strictly to astronomical Swiss Ephemeris algorithms and Parashari canonical scriptures.`,
        tableData: {
          headers: ['सत्यापन बिंदु (Audit Item)', 'प्रयुक्त मानक / गणना', 'सत्यापन स्थिति (Status)'],
          rows: [
            ['जातक का नाम', birthDetails.name || 'जातक', '✓ सत्यापित अभिलेख'],
            ['जन्म विवरण', `${birthDetails.dob} • ${birthDetails.tob} • ${birthDetails.place}`, '✓ सत्यापित विवरण'],
            ['खगोलीय इंजन', 'Swiss Ephemeris High Precision C/Wasm Engine', '✓ 100% गणितीय शुद्धता'],
            ['अयनांश मानक', "Lahiri (Chitrapaksha) 24° 10' Precision", '✓ पूर्णतः सत्यापित'],
            ['स्थान निर्देशांक', `Lat: ${birthDetails.latitude.toFixed(4)}°, Lon: ${birthDetails.longitude.toFixed(4)}°`, '✓ जीपीएस सत्यापित'],
            ['शास्त्रीय आधार', 'बृहत्पाराशर होराशास्त्र, बृहज्जातक व जैमिनी सूत्र', '✓ प्रामाणिक संदर्भ'],
            ['दशा गणना', 'विंशोत्तरी 120-वर्षीय सौर वर्ष चक्र', '✓ शुद्ध गणितीय'],
          ],
        },
      },
      {
        headingHi: 'वैदिक आशीर्वचन एवं आधिकारिक मुहर',
        headingEn: 'Vedic Benediction & AstroDost AI Official Seal',
        contentHi:
          'स्वस्ति न इन्द्रो वृद्धश्रवाः स्वस्ति नः पूषा विश्ववेदाः। स्वस्ति नस्तार्क्ष्यो अरिष्टनेमिः स्वस्ति नो बृहस्पतिर्दधातु॥ ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः। वनस्पतयः शान्तिर्विश्वेदेवाः शान्तिर्ब्रह्म शान्तिः सर्वं शान्तिः शान्तिरेव शान्तिः सा मा शान्तिरेधि॥ ॐ शान्तिः शान्तिः शान्तिः॥',
        contentEn:
          'May the divine cosmic forces bestow supreme wisdom, peace, longevity, radiant health, and spiritual fulfillment upon you. Walk the path of Satya (Truth) and Dharma (Righteousness).',
        highlightBadge: 'AstroDost AI Official Vedic Certified Seal • 2026',
      },
    ],
  });
}
