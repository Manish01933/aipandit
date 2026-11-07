import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Award,
  Info,
  Layers,
  Search,
  Filter,
  Calendar,
  Flame,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { Language } from '../types/astrology';

interface GemstoneRudrakshaViewProps {
  language: Language;
}

export interface GemstoneInfo {
  id: string;
  nameHi: string;
  nameEn: string;
  hindiName: string;
  planetHi: string;
  planetEn: string;
  suitableLagna: string[];
  metalHi: string;
  metalEn: string;
  fingerHi: string;
  fingerEn: string;
  dayHi: string;
  dayEn: string;
  mantra: string;
  benefitsHi: string;
  benefitsEn: string;
  cautionsHi: string;
  cautionsEn: string;
  colorCode: string;
}

export interface RudrakshaInfo {
  mukhi: number;
  nameHi: string;
  nameEn: string;
  deityHi: string;
  deityEn: string;
  planetHi: string;
  planetEn: string;
  mantra: string;
  benefitsHi: string;
  benefitsEn: string;
  wearingDayHi: string;
  wearingDayEn: string;
  auspiciousForHi: string;
  auspiciousForEn: string;
}

const NAVRATNA_LIST: GemstoneInfo[] = [
  {
    id: 'ruby',
    nameHi: 'माणिक्य (Ruby)',
    nameEn: 'Ruby (Manikya)',
    hindiName: 'माणिक्य',
    planetHi: 'सूर्य (Surya)',
    planetEn: 'Sun',
    suitableLagna: ['मेष', 'सिंह', 'धनु'],
    metalHi: 'स्वर्ण (सोना) अथवा तांबा',
    metalEn: 'Gold or Copper',
    fingerHi: 'अनामिका (Ring Finger)',
    fingerEn: 'Ring Finger',
    dayHi: 'रविवार (प्रातः सूर्योदय काल)',
    dayEn: 'Sunday Morning at Sunrise',
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    benefitsHi: 'आत्मविश्वास, सरकारी पद, नेतृत्व क्षमता, पितृ सुख और नेत्र ज्योति में वृद्धि करता है।',
    benefitsEn: 'Enhances leadership, vitality, royal favor, executive power, and fatherly blessings.',
    cautionsHi: 'नीलम, गोमेद अथवा लहसुनिया के साथ धारण न करें।',
    cautionsEn: 'Do not pair with Blue Sapphire, Hessonite, or Cat’s Eye.',
    colorCode: '#ef4444',
  },
  {
    id: 'pearl',
    nameHi: 'सच्चा मोती (Natural Pearl)',
    nameEn: 'Natural Pearl (Moti)',
    hindiName: 'मोती',
    planetHi: 'चंद्रमा (Chandra)',
    planetEn: 'Moon',
    suitableLagna: ['कर्क', 'वृश्चिक', 'मीन'],
    metalHi: 'चांदी (रजत)',
    metalEn: 'Silver',
    fingerHi: 'कनिष्ठिका (Little Finger)',
    fingerEn: 'Little Finger',
    dayHi: 'सोमवार (संध्याकाल अथवा शुक्ल पक्ष की सुबह)',
    dayEn: 'Monday Evening or Shukla Paksha Morning',
    mantra: 'ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः',
    benefitsHi: 'मानसिक शांति, तनाव मुक्ति, अनिद्रा निवारण, माता का सुख और जल तत्व का संतुलन।',
    benefitsEn: 'Calms emotions, relieves anxiety, strengthens intuition, and brings mental serenity.',
    cautionsHi: 'गोमेद या लहसुनिया के साथ न पहनें।',
    cautionsEn: 'Avoid wearing alongside Hessonite or Cat’s Eye.',
    colorCode: '#f1f5f9',
  },
  {
    id: 'yellow_sapphire',
    nameHi: 'पीला पुखराज (Yellow Sapphire)',
    nameEn: 'Yellow Sapphire (Pukhraj)',
    hindiName: 'पुखराज',
    planetHi: 'बृहस्पति (Devguru Guru)',
    planetEn: 'Jupiter',
    suitableLagna: ['धनु', 'मीन', 'मेष', 'कर्क'],
    metalHi: 'स्वर्ण (सोना) अथवा पीतल',
    metalEn: 'Gold or Brass',
    fingerHi: 'तर्जनी (Index Finger)',
    fingerEn: 'Index Finger',
    dayHi: 'गुरुवार (प्रातः पुष्य अथवा पुनर्वसु नक्षत्र में)',
    dayEn: 'Thursday Morning (Pushya/Punarvasu)',
    mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    benefitsHi: 'विशाल ज्ञान, संतान सुख, विवाह योग, उच्च पद, धार्मिक प्रगति व आर्थिक समृद्धि।',
    benefitsEn: 'Grants divine wisdom, marital bliss, career promotions, and spiritual protection.',
    cautionsHi: 'हीरा अथवा नीलम के साथ धारण वर्जित है।',
    cautionsEn: 'Do not pair with Diamond or Blue Sapphire.',
    colorCode: '#fbbf24',
  },
  {
    id: 'emerald',
    nameHi: 'पन्ना (Emerald)',
    nameEn: 'Emerald (Panna)',
    hindiName: 'पन्ना',
    planetHi: 'बुध (Budha)',
    planetEn: 'Mercury',
    suitableLagna: ['मिथुन', 'कन्या', 'वृषभ', 'तुला'],
    metalHi: 'स्वर्ण, चांदी अथवा कांसा',
    metalEn: 'Gold, Silver or Bronze',
    fingerHi: 'कनिष्ठिका (Little Finger)',
    fingerEn: 'Little Finger',
    dayHi: 'बुधवार (प्रातः काल)',
    dayEn: 'Wednesday Morning',
    mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    benefitsHi: 'प्रखर बुद्धि, व्यापार में मुनाफा, वाणी आकर्षण, शेयर बाजार व तार्किक क्षमता में सिद्धि।',
    benefitsEn: 'Boosts intellect, business acumen, communication skills, and analytical brilliance.',
    cautionsHi: 'मूँगा के साथ धारण करने से पूर्व कुंडली जांचें।',
    cautionsEn: 'Check chart before pairing with Red Coral.',
    colorCode: '#10b981',
  },
  {
    id: 'diamond',
    nameHi: 'हीरा / ओपल (Diamond / White Opal)',
    nameEn: 'Diamond / Opal (Heera)',
    hindiName: 'हीरा',
    planetHi: 'शुक्र (Shukra)',
    planetEn: 'Venus',
    suitableLagna: ['वृषभ', 'तुला', 'मकर', 'कुंभ'],
    metalHi: 'प्लेटिनम, सफेद सोना अथवा चांदी',
    metalEn: 'Platinum, White Gold or Silver',
    fingerHi: 'मध्यमा (Middle Finger) अथवा कनिष्ठिका',
    fingerEn: 'Middle or Little Finger',
    dayHi: 'शुक्रवार (प्रातः काल)',
    dayEn: 'Friday Morning',
    mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    benefitsHi: 'वैवाहिक सुख, सौंदर्य, ऐश्वर्य, कला-फिल्म-फैशन में सफलता और भौतिक सुख-सुविधाएं।',
    benefitsEn: 'Brings luxury, marital happiness, artistic success, charm, and magnetic presence.',
    cautionsHi: 'माणिक्य और पुखराज के साथ न पहनें।',
    cautionsEn: 'Do not wear with Ruby or Yellow Sapphire.',
    colorCode: '#e0e7ff',
  },
  {
    id: 'blue_sapphire',
    nameHi: 'नीलम (Blue Sapphire)',
    nameEn: 'Blue Sapphire (Neelam)',
    hindiName: 'नीलम',
    planetHi: 'शनि देव (Shani)',
    planetEn: 'Saturn',
    suitableLagna: ['मकर', 'कुंभ', 'वृषभ', 'तुला'],
    metalHi: 'पंचधातु, अष्टधातु अथवा चांदी',
    metalEn: 'Panchdhatu or Silver',
    fingerHi: 'मध्यमा (Middle Finger)',
    fingerEn: 'Middle Finger',
    dayHi: 'शनिवार (सूर्यास्त के उपरांत)',
    dayEn: 'Saturday Twilight',
    mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    benefitsHi: 'तुरंत राजयोग, अपार संपत्ति, तकनीकी व न्याय क्षेत्र में ख्याति, साढ़ेसाती की पीड़ा से मुक्ति।',
    benefitsEn: 'Fast-acting prosperity, discipline, relief from Sade Sati, and protection from misfortune.',
    cautionsHi: 'धारण से पूर्व 3 दिन तक नीले कपड़े में तकिए के नीचे रखकर स्वप्न परीक्षण अवश्य करें।',
    cautionsEn: 'Test under pillow for 3 nights before setting in ring to check auspicious vibrations.',
    colorCode: '#3b82f6',
  },
  {
    id: 'red_coral',
    nameHi: 'मूँगा (Red Coral)',
    nameEn: 'Red Coral (Moonga)',
    hindiName: 'मूँगा',
    planetHi: 'मंगल (Mangal)',
    planetEn: 'Mars',
    suitableLagna: ['मेष', 'वृश्चिक', 'सिंह', 'धनु'],
    metalHi: 'तांबा (ताम्र) अथवा सोना',
    metalEn: 'Copper or Gold',
    fingerHi: 'अनामिका (Ring Finger)',
    fingerEn: 'Ring Finger',
    dayHi: 'मंगलवार (प्रातः काल)',
    dayEn: 'Tuesday Morning',
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    benefitsHi: 'साहस, सेना व पुलिस में विजय, रक्त विकार से रक्षा, भूमि-भवन लाभ और मांगलिक दोष शांति।',
    benefitsEn: 'Courage, real estate success, vitality, victory over enemies, and Mangal peace.',
    cautionsHi: 'नीलम और पन्ना के साथ न पहनें।',
    cautionsEn: 'Do not combine with Blue Sapphire or Emerald.',
    colorCode: '#f97316',
  },
  {
    id: 'hessonite',
    nameHi: 'गोमेद (Hessonite Garnet)',
    nameEn: 'Hessonite (Gomed)',
    hindiName: 'गोमेद',
    planetHi: 'राहु (Rahu)',
    planetEn: 'Rahu (North Node)',
    suitableLagna: ['मिथुन', 'तुला', 'मकर', 'कुंभ'],
    metalHi: 'अष्टधातु अथवा चांदी',
    metalEn: 'Ashtadhatu or Silver',
    fingerHi: 'मध्यमा (Middle Finger)',
    fingerEn: 'Middle Finger',
    dayHi: 'शनिवार (रात्रि काल अथवा स्वाति/आर्द्रा नक्षत्र में)',
    dayEn: 'Saturday Night (Swati/Ardra)',
    mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    benefitsHi: 'अचानक धन लाभ, राजनीति में विजय, अनिद्रा व अज्ञात भय से मुक्ति, षड्यंत्रों का नाश।',
    benefitsEn: 'Sudden windfall, political victory, removal of phantom fears, and victory over foes.',
    cautionsHi: 'सूर्य का रत्न माणिक्य इसके साथ कदापि न पहनें।',
    cautionsEn: 'Never combine with Sun’s Ruby.',
    colorCode: '#78350f',
  },
  {
    id: 'cats_eye',
    nameHi: 'लहसुनिया (Cat’s Eye Chrysoberyl)',
    nameEn: 'Cat’s Eye (Lehsuniya)',
    hindiName: 'लहसुनिया',
    planetHi: 'केतु (Ketu)',
    planetEn: 'Ketu (South Node)',
    suitableLagna: ['धनु', 'मीन', 'मेष', 'वृश्चिक'],
    metalHi: 'पंचधातु अथवा चांदी',
    metalEn: 'Panchdhatu or Silver',
    fingerHi: 'मध्यमा (Middle Finger) अथवा कनिष्ठिका',
    fingerEn: 'Middle or Little Finger',
    dayHi: 'गुरुवार अथवा शनिवार (अश्विनी/मघा नक्षत्र में)',
    dayEn: 'Thursday or Saturday (Ashwini/Magha)',
    mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    benefitsHi: 'आध्यात्मिक मोक्ष, तंत्र बाधा से रक्षा, गुप्त ज्ञान, सट्टे व शेयर में अप्रत्याशित सफलता।',
    benefitsEn: 'Spiritual liberation, psychic shield against evil eye, intuition, and occult mastery.',
    cautionsHi: 'माणिक्य और मोती के साथ न पहनें।',
    cautionsEn: 'Avoid pairing with Ruby or Pearl.',
    colorCode: '#854d0e',
  },
];

const RUDRAKSHA_LIST: RudrakshaInfo[] = [
  {
    mukhi: 1,
    nameHi: 'एक मुखी रुद्राक्ष (साक्षात् शिव स्वरूप)',
    nameEn: '1 Mukhi Rudraksha (Lord Shiva)',
    deityHi: 'भगवान शिव',
    deityEn: 'Lord Shiva',
    planetHi: 'सूर्य (Surya)',
    planetEn: 'Sun',
    mantra: 'ॐ ह्रीं नमः (Om Hreem Namah)',
    benefitsHi: 'परम मोक्ष, एकाग्रता, नेत्र रोग निवारण, ब्रह्म ज्ञान एवं समस्त पापों का शमन।',
    benefitsEn: 'Highest spiritual liberation, immense concentration, and divine grace of Shiva.',
    wearingDayHi: 'सोमवार अथवा शिवरात्रि (प्रातः काल)',
    wearingDayEn: 'Monday or Shivratri morning',
    auspiciousForHi: 'अध्यापक, प्रशासक, राजनेता एवं संन्यासी',
    auspiciousForEn: 'Leaders, Yogis, Administrators & Seekers',
  },
  {
    mukhi: 2,
    nameHi: 'दो मुखी रुद्राक्ष (अर्धनारीश्वर)',
    nameEn: '2 Mukhi Rudraksha (Ardhanarishwara)',
    deityHi: 'शिव-पार्वती (अर्धनारीश्वर)',
    deityEn: 'Shiva-Parvati',
    planetHi: 'चंद्रमा (Moon)',
    planetEn: 'Moon',
    mantra: 'ॐ नमः (Om Namah)',
    benefitsHi: 'पति-पत्नी में मधुर संबंध, मानसिक शांति, पारिवारिक कलह का अंत एवं गर्भाशय दोष निवारण।',
    benefitsEn: 'Harmonious relationships, mental tranquility, and marital unity.',
    wearingDayHi: 'सोमवार',
    wearingDayEn: 'Monday',
    auspiciousForHi: 'दांपत्य सुख, पार्टनरशिप व्यापार व मानसिक शांति चाहने वाले',
    auspiciousForEn: 'Couples, Business Partners, Anxiety Sufferers',
  },
  {
    mukhi: 3,
    nameHi: 'तीन मुखी रुद्राक्ष (अग्नि देव)',
    nameEn: '3 Mukhi Rudraksha (Agni Deva)',
    deityHi: 'अग्नि देव व त्रिदेव',
    deityEn: 'Agni Deva & Trideva',
    planetHi: 'मंगल (Mars)',
    planetEn: 'Mars',
    mantra: 'ॐ क्लीं नमः (Om Kleem Namah)',
    benefitsHi: 'हीन भावना व अपराध बोध से मुक्ति, आत्मशक्ति, पाचन तंत्र सुधार एवं आलस्य का नाश।',
    benefitsEn: 'Purification from past karmas, destroys depression and ignites digestive/creative fire.',
    wearingDayHi: 'मंगलवार',
    wearingDayEn: 'Tuesday',
    auspiciousForHi: 'छात्र, रक्षा कर्मी, खिलाड़ी व आत्मविश्वास की कमी वाले लोग',
    auspiciousForEn: 'Students, Athletes, Soldiers & Creators',
  },
  {
    mukhi: 4,
    nameHi: 'चार मुखी रुद्राक्ष (ब्रह्मा जी)',
    nameEn: '4 Mukhi Rudraksha (Lord Brahma)',
    deityHi: 'चतुर्मुख ब्रह्मा जी',
    deityEn: 'Lord Brahma',
    planetHi: 'बुध (Mercury)',
    planetEn: 'Mercury',
    mantra: 'ॐ ह्रीं नमः (Om Hreem Namah)',
    benefitsHi: 'तीक्ष्ण स्मरण शक्ति, वाक् सिद्धि, संगीत व अध्ययन में असाधारण सफलता, हकलाना दूर।',
    benefitsEn: 'Enhances memory, eloquence, vocal mastery, intellect, and scientific reasoning.',
    wearingDayHi: 'गुरुवार अथवा बुधवार',
    wearingDayEn: 'Thursday or Wednesday',
    auspiciousForHi: 'अधिवक्ता, शोधकर्ता, लेखक, संगीतकार व विद्यार्थी',
    auspiciousForEn: 'Researchers, Advocates, Writers & Scientists',
  },
  {
    mukhi: 5,
    nameHi: 'पंच मुखी रुद्राक्ष (कालाग्नि रुद्र)',
    nameEn: '5 Mukhi Rudraksha (Kalagni Rudra)',
    deityHi: 'कालाग्नि रुद्र स्वरूप',
    deityEn: 'Kalagni Rudra',
    planetHi: 'बृहस्पति (Jupiter)',
    planetEn: 'Jupiter',
    mantra: 'ॐ ह्रीं नमः (Om Hreem Namah)',
    benefitsHi: 'रक्तचाप नियंत्रण, हृदय स्वास्थ्य, मन की शांति, दीर्घायु एवं समस्त अनिष्टों से अभय।',
    benefitsEn: 'Balances blood pressure, brings longevity, spiritual upliftment, and peace of mind.',
    wearingDayHi: 'सोमवार अथवा गुरुवार',
    wearingDayEn: 'Monday or Thursday',
    auspiciousForHi: 'सभी मनुष्य (बाल, वृद्ध, स्त्री, पुरुष सबके लिए सार्वभौमिक)',
    auspiciousForEn: 'Universal for all human beings of all ages',
  },
  {
    mukhi: 6,
    nameHi: 'छह मुखी रुद्राक्ष (भगवान कार्तिकेय)',
    nameEn: '6 Mukhi Rudraksha (Kartikeya)',
    deityHi: 'भगवान कार्तिकेय एवं गणेश',
    deityEn: 'Lord Kartikeya',
    planetHi: 'शुक्र (Venus)',
    planetEn: 'Venus',
    mantra: 'ॐ ह्रीं हुं नमः (Om Hreem Hoom Namah)',
    benefitsHi: 'शत्रु पराजय, आकर्षण शक्ति, पौरुष बल, कला-फैशन में सफलता एवं चंचलता पर नियंत्रण।',
    benefitsEn: 'Victory over competitors, charisma, grounding, and artistic success.',
    wearingDayHi: 'सोमवार अथवा शुक्रवार',
    wearingDayEn: 'Monday or Friday',
    auspiciousForHi: 'सैनिक, कलाकार, व्यवसायी, पुलिसकर्मी व अभिनेता',
    auspiciousForEn: 'Actors, Executives, Armed Forces & Artists',
  },
  {
    mukhi: 7,
    nameHi: 'सात मुखी रुद्राक्ष (महालक्ष्मी स्वरूप)',
    nameEn: '7 Mukhi Rudraksha (Mahalakshmi)',
    deityHi: 'देवी महालक्ष्मी व सप्तर्षि',
    deityEn: 'Goddess Mahalakshmi',
    planetHi: 'शनि देव (Saturn)',
    planetEn: 'Saturn',
    mantra: 'ॐ हुं नमः (Om Hoom Namah)',
    benefitsHi: 'दरिद्रता का नाश, प्रचुर धन प्राप्ति, व्यापार वृद्धि, शनि की ढैय्या/साढ़ेसाती में रक्षा।',
    benefitsEn: 'Attracts sustained wealth, dispels poverty, and shields from Shani afflictions.',
    wearingDayHi: 'शुक्रवार अथवा शनिवार',
    wearingDayEn: 'Friday or Saturday',
    auspiciousForHi: 'व्यापारी, उद्योगपति, ऋणग्रस्त व्यक्ति व शनि पीड़ित',
    auspiciousForEn: 'Businessmen, Investors, Debt Recovery & Saturn Sufferers',
  },
  {
    mukhi: 8,
    nameHi: 'आठ मुखी रुद्राक्ष (विघ्नहर्ता गणेश)',
    nameEn: '8 Mukhi Rudraksha (Lord Ganesha)',
    deityHi: 'विघ्नहर्ता श्री गणेश एवं अष्टवसु',
    deityEn: 'Lord Ganesha',
    planetHi: 'राहु (Rahu)',
    planetEn: 'Rahu',
    mantra: 'ॐ हुं नमः (Om Hoom Namah)',
    benefitsHi: 'सभी कार्यों में विघ्न बाधाओं का समूल नाश, राहु दोष शांति, आकस्मिक दुर्घटनाओं से रक्षा।',
    benefitsEn: 'Removes all obstacles, mitigates Rahu doshas, and grants sudden success.',
    wearingDayHi: 'बुधवार अथवा सोमवार',
    wearingDayEn: 'Wednesday or Monday',
    auspiciousForHi: 'नया कार्य शुरू करने वाले, जोखिम उठाने वाले व राहु पीड़ित',
    auspiciousForEn: 'Entrepreneurs, Risk Takers & Students',
  },
  {
    mukhi: 9,
    nameHi: 'नौ मुखी रुद्राक्ष (मां नवदुर्गा)',
    nameEn: '9 Mukhi Rudraksha (Navadurga)',
    deityHi: 'भगवती नवदुर्गा',
    deityEn: 'Goddess Durga (9 Forms)',
    planetHi: 'केतु (Ketu)',
    planetEn: 'Ketu',
    mantra: 'ॐ ह्रीं हुं नमः (Om Hreem Hoom Namah)',
    benefitsHi: 'अभय वरदान, यम भय निवारण, अदम्य साहस, तंत्र बाधा मुक्ति एवं केतु के कुप्रभाव से मुक्ति।',
    benefitsEn: 'Total fearlessness, protection against black magic, and boundless divine energy.',
    wearingDayHi: 'शनिवार अथवा नवरात्रि',
    wearingDayEn: 'Saturday or Navratri',
    auspiciousForHi: 'महिलाएं, सुरक्षा कर्मी, साहसी कार्य करने वाले',
    auspiciousForEn: 'Women, Healers, Security Personnel & Seekers',
  },
];

export const GemstoneRudrakshaView: React.FC<GemstoneRudrakshaViewProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'gemstones' | 'rudraksha' | 'recommender'>('gemstones');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLagna, setSelectedLagna] = useState('मेष');

  const LAGNAS = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'];

  const getLagnaRecommendation = (lagna: string) => {
    switch (lagna) {
      case 'मेष':
        return { life: 'मूँगा (Red Coral)', lucky: 'पीला पुखराज (Yellow Sapphire)', avoid: 'हीरा व पन्ना', rudraksha: '3 मुखी एवं 5 मुखी' };
      case 'वृषभ':
        return { life: 'हीरा / ओपल (Diamond)', lucky: 'नीलम (Blue Sapphire)', avoid: 'माणिक्य व पुखराज', rudraksha: '6 मुखी एवं 7 मुखी' };
      case 'मिथुन':
        return { life: 'पन्ना (Emerald)', lucky: 'हीरा (Diamond)', avoid: 'मूँगा व मोती', rudraksha: '4 मुखी एवं 6 मुखी' };
      case 'कर्क':
        return { life: 'मोती (Natural Pearl)', lucky: 'मूँगा (Red Coral)', avoid: 'नीलम व हीरा', rudraksha: '2 मुखी एवं 3 मुखी' };
      case 'सिंह':
        return { life: 'माणिक्य (Ruby)', lucky: 'मूँगा व पुखराज', avoid: 'नीलम व हीरा', rudraksha: '1 मुखी एवं 5 मुखी' };
      case 'कन्या':
        return { life: 'पन्ना (Emerald)', lucky: 'हीरा व नीलम', avoid: 'माणिक्य व मूँगा', rudraksha: '4 मुखी एवं 7 मुखी' };
      case 'तुला':
        return { life: 'हीरा / ओपल (Diamond)', lucky: 'नीलम व पन्ना', avoid: 'माणिक्य व पुखराज', rudraksha: '6 मुखी एवं 7 मुखी' };
      case 'वृश्चिक':
        return { life: 'मूँगा (Red Coral)', lucky: 'पीला पुखराज व मोती', avoid: 'हीरा व नीलम', rudraksha: '3 मुखी एवं 5 मुखी' };
      case 'धनु':
        return { life: 'पीला पुखराज (Yellow Sapphire)', lucky: 'माणिक्य व मूँगा', avoid: 'हीरा व शुक्र रत्न', rudraksha: '5 मुखी एवं 1 मुखी' };
      case 'मकर':
        return { life: 'नीलम (Blue Sapphire)', lucky: 'हीरा व पन्ना', avoid: 'माणिक्य व मोती', rudraksha: '7 मुखी एवं 6 मुखी' };
      case 'कुंभ':
        return { life: 'नीलम (Blue Sapphire)', lucky: 'हीरा व पन्ना', avoid: 'माणिक्य व पुखराज', rudraksha: '7 मुखी एवं 4 मुखी' };
      case 'मीन':
        return { life: 'पीला पुखराज (Yellow Sapphire)', lucky: 'मोती व मूँगा', avoid: 'हीरा व नीलम', rudraksha: '5 मुखी एवं 2 मुखी' };
      default:
        return { life: 'पीला पुखराज', lucky: 'माणिक्य', avoid: 'नीलम', rudraksha: '5 मुखी' };
    }
  };

  const currentRec = getLagnaRecommendation(selectedLagna);

  const filteredGems = NAVRATNA_LIST.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      g.nameHi.toLowerCase().includes(q) ||
      g.nameEn.toLowerCase().includes(q) ||
      g.planetHi.toLowerCase().includes(q) ||
      g.benefitsHi.toLowerCase().includes(q)
    );
  });

  const filteredRudrakshas = RUDRAKSHA_LIST.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.nameHi.toLowerCase().includes(q) ||
      r.nameEn.toLowerCase().includes(q) ||
      r.deityHi.toLowerCase().includes(q) ||
      r.benefitsHi.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'वैदिक रत्न एवं रुद्राक्ष अनुसंधान केंद्र' : 'Authentic Vedic Gemstone & Rudraksha Guide'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'hi' ? '💎 नवरत्न एवं रुद्राक्ष धारण विधि व शुभ मुहूर्त' : '💎 Sacred Gemstones & Rudraksha Science'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            {language === 'hi'
              ? 'प्रामाणिक नवग्रह रत्न (माणिक्य, मोती, पुखराज, पन्ना, हीरा, नीलम, मूँगा, गोमेद, लहसुनिया) एवं १ से ९ मुखी रुद्राक्ष की शास्त्रीय धारण विधि, प्राण प्रतिष्ठा मंत्र, शुभ उंगली, धातु एवं निषिद्ध संयोजन।'
              : 'Detailed astrological manual covering Navratna gemstones and 1-9 Mukhi Rudraksha, energization mantras, wearing fingers, metals, and Vedic compatibility rules.'}
          </p>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('gemstones')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'gemstones'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? '💎 ९ नवरत्न मार्गदर्शिका' : '💎 9 Navratna Guide'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rudraksha')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'rudraksha'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{language === 'hi' ? '📿 १ से ९ मुखी रुद्राक्ष' : '📿 Sacred Rudrakshas'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recommender')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'recommender'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{language === 'hi' ? '🎯 लग्न अनुसार रत्न चयन' : '🎯 Lagna Gem Recommender'}</span>
          </button>
        </div>

        {activeTab !== 'recommender' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'खोजें (रत्न, ग्रह या लाभ)...' : 'Search by gem, planet, benefit...'}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: NAVRATNA GEMSTONES */}
      {/* ======================================================== */}
      {activeTab === 'gemstones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGems.map((gem) => (
            <div
              key={gem.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/40 shadow"
                      style={{ backgroundColor: gem.colorCode }}
                    />
                    <h3 className="text-base font-bold text-white">
                      {language === 'hi' ? gem.nameHi : gem.nameEn}
                    </h3>
                  </div>
                  <span className="text-xs bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md border border-slate-800 font-semibold">
                    {gem.planetHi}
                  </span>
                </div>

                <div className="space-y-2.5 mt-3 text-xs">
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {language === 'hi' ? gem.benefitsHi : gem.benefitsEn}
                  </p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'शुभ धातु' : 'Metal'}</span>
                      <strong className="text-white text-[11px]">{gem.metalHi}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'धारण उंगली' : 'Finger'}</span>
                      <strong className="text-white text-[11px]">{gem.fingerHi}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'शुभ दिन व समय' : 'Day'}</span>
                      <strong className="text-amber-300 text-[11px]">{gem.dayHi}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'अनुकूल लग्न' : 'Lagna'}</span>
                      <strong className="text-emerald-300 text-[11px]">{gem.suitableLagna.join(', ')}</strong>
                    </div>
                  </div>

                  {/* Mantra */}
                  <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl">
                    <span className="text-[10px] text-amber-400 block font-semibold mb-0.5">
                      {language === 'hi' ? '📿 प्राण प्रतिष्ठा एवं 108 जप बीज मंत्र:' : '📿 108 Chanting Mantra:'}
                    </span>
                    <p className="text-xs font-mono font-bold text-amber-200">
                      {gem.mantra}
                    </p>
                  </div>
                </div>
              </div>

              {/* Precautions */}
              <div className="border-t border-slate-800 pt-2.5">
                <span className="text-[11px] text-rose-300/90 font-medium block">
                  ⚠️ <strong>सावधानी:</strong> {gem.cautionsHi}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SACRED RUDRAKSHAS */}
      {/* ======================================================== */}
      {activeTab === 'rudraksha' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRudrakshas.map((rudraksha) => (
            <div
              key={rudraksha.mukhi}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📿</span>
                    <h3 className="text-base font-bold text-amber-300">
                      {language === 'hi' ? rudraksha.nameHi : rudraksha.nameEn}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    {rudraksha.mukhi} Mukhi
                  </span>
                </div>

                <div className="space-y-2.5 mt-3 text-xs">
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px]">
                    <span className="text-slate-400">
                      {language === 'hi' ? 'अधिष्ठाता देवता:' : 'Presiding Deity:'} <strong className="text-white">{rudraksha.deityHi}</strong>
                    </span>
                    <span className="text-slate-400">
                      {language === 'hi' ? 'ग्रह:' : 'Planet:'} <strong className="text-amber-300">{rudraksha.planetHi}</strong>
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed font-medium">
                    {language === 'hi' ? rudraksha.benefitsHi : rudraksha.benefitsEn}
                  </p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'किसके लिए विशेष लाभकारी:' : 'Auspicious For:'}</span>
                      <strong className="text-emerald-300 text-[11px]">{rudraksha.auspiciousForHi}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'धारण करने का शुभ दिन:' : 'Wearing Day:'}</span>
                      <strong className="text-amber-200 text-[11px]">{rudraksha.wearingDayHi}</strong>
                    </div>
                  </div>

                  {/* Mantra */}
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-400 block font-semibold mb-0.5">
                      {language === 'hi' ? '🕉️ धारण व सिद्धि मंत्र:' : '🕉️ Sacred Mantra:'}
                    </span>
                    <p className="text-xs font-mono font-bold text-emerald-200">
                      {rudraksha.mantra}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2.5 text-[11px] text-slate-400">
                <span>{language === 'hi' ? 'गंगाजल व कच्चे दूध से शुद्ध करके लाल धागे या चांदी में धारण करें।' : 'Purify with Gangajal and wear in red silk thread or silver cap.'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: LAGNA GEMSTONE RECOMMENDER */}
      {/* ======================================================== */}
      {activeTab === 'recommender' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{language === 'hi' ? 'अपनी जन्म कुंडली का लग्न चुनें' : 'Select Your Ascendant (Lagna)'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'hi'
                ? 'वैदिक ज्योतिष में लग्न (प्रथम भाव) जीवन का आधार है और पंचम/नवम भाव भाग्य का आधार हैं। अपना लग्न चुनकर अपना अनुकूल रत्न जानें।'
                : 'Select your Ascendant to reveal your primary Life Stone, Fortune Stone, and harmful stones.'}
            </p>
          </div>

          {/* Lagna Chips */}
          <div className="flex flex-wrap gap-2">
            {LAGNAS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setSelectedLagna(l)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedLagna === l
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {l} लग्न
              </button>
            ))}
          </div>

          {/* Recommendation Result Card */}
          <div className="bg-slate-950 border-2 border-amber-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {language === 'hi' ? 'वैदिक शास्त्रीय परामर्श' : 'Vedic Recommendation'}
                </span>
                <h4 className="text-xl font-black text-white mt-0.5">
                  {selectedLagna} लग्न हेतु शुभ रत्न व रुद्राक्ष
                </h4>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-bold">
                १००% प्रामाणिक
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 font-semibold">{language === 'hi' ? '👑 जीवन रत्न (Lagna Lord):' : '👑 Life Stone:'}</span>
                <strong className="text-amber-300 text-sm block">{currentRec.life}</strong>
                <span className="text-[11px] text-slate-400 mt-1 block">स्वास्थ्य, आत्मविश्वास व दीर्घायु हेतु।</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 font-semibold">{language === 'hi' ? '⭐ भाग्य रत्न (Fortune):' : '⭐ Fortune Stone:'}</span>
                <strong className="text-emerald-300 text-sm block">{currentRec.lucky}</strong>
                <span className="text-[11px] text-slate-400 mt-1 block">भाग्य वृद्धि, सफलता व ऐश्वर्य हेतु।</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 font-semibold">{language === 'hi' ? '📿 सिद्ध रुद्राक्ष:' : '📿 Auspicious Rudraksha:'}</span>
                <strong className="text-amber-200 text-sm block">{currentRec.rudraksha}</strong>
                <span className="text-[11px] text-slate-400 mt-1 block">समस्त ग्रह शांति एवं सुरक्षा हेतु।</span>
              </div>

              <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-500/30">
                <span className="text-rose-400 block mb-1 font-semibold">{language === 'hi' ? '🚫 वर्जित रत्न (Avoid):' : '🚫 Prohibited Stone:'}</span>
                <strong className="text-rose-200 text-sm block">{currentRec.avoid}</strong>
                <span className="text-[11px] text-rose-300/80 mt-1 block">मारकेश व बाधक होने से धारण न करें।</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
