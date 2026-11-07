import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KundaliResult } from '../types/astrology';
import { calculateJagannathaHora } from './jagannathaHoraEngine';

export function exportKundaliPDF(kundali: KundaliResult) {
  const doc = new jsPDF();
  const { birthDetails, ascendantSign, moonSign, sunSign, birthNakshatra, planets, dashaPeriods, dosha } = kundali;

  // Title & Header Banner
  doc.setFillColor(15, 23, 42); // Deep Navy
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(245, 158, 11); // Golden Amber
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ASTRODOST AI - VEDIC JANAMPATRIKA', 105, 18, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Comprehensive Vedic Horoscope & Planetary Analysis Report', 105, 27, { align: 'center' });

  // Birth Particulars Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Native Birth Details (जातक विवरण)', 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [['Field / क्षेत्र', 'Particulars / विवरण', 'Field / क्षेत्र', 'Particulars / विवरण']],
    body: [
      ['Name (नाम)', birthDetails.name, 'Gender (लिंग)', birthDetails.gender.toUpperCase()],
      ['Date of Birth (जन्म तिथि)', birthDetails.dob, 'Time of Birth (जन्म समय)', birthDetails.tob],
      ['Place of Birth (जन्म स्थान)', birthDetails.place, 'Latitude / Longitude', `${birthDetails.latitude.toFixed(2)}° N, ${birthDetails.longitude.toFixed(2)}° E`],
      ['Lagna / Ascendant (लग्न)', `${ascendantSign} (${kundali.ascendantDegree})`, 'Moon Sign (चंद्र राशि)', moonSign],
      ['Sun Sign (सूर्य राशि)', sunSign, 'Birth Nakshatra (नक्षत्र)', `${birthNakshatra} (Pada ${kundali.planets.find((p) => p.name === 'Moon')?.pada || 1})`],
      ['Nakshatra Lord (नक्षत्र स्वामी)', kundali.nakshatraLord, 'Varna / Gana / Nadi', `${kundali.varna} / ${kundali.gana} / ${kundali.nadi}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [245, 158, 11], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  // Planetary Positions Table
  const finalY1 = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Planetary Placements & Dignities (ग्रह स्थिति)', 14, finalY1 + 10);

  const planetRows = planets.map((p) => [
    p.name,
    p.hindiName,
    p.sign,
    p.formattedDegree,
    `House ${p.house}`,
    `${p.nakshatra} (Pada ${p.pada})`,
    p.isRetrograde ? 'Vakri (R)' : 'Direct',
    p.dignity,
  ]);

  autoTable(doc, {
    startY: finalY1 + 14,
    head: [['Planet', 'Graha', 'Rashi (Sign)', 'Degree', 'Bhava', 'Nakshatra', 'Motion', 'Dignity']],
    body: planetRows,
    theme: 'striped',
    headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
  });

  // Page 2: Dasha, Dosha & Yogas
  doc.addPage();

  // Page 2 Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text('AstroDost AI - Vimshottari Dasha, Dosha & Vedic Yogas', 105, 13, { align: 'center' });

  // Dasha Timeline Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Vimshottari Mahadasha Timeline (120 Years Cycle)', 14, 30);

  const dashaRows = dashaPeriods.map((d) => [
    d.planet,
    d.hindiName,
    `${d.durationYears} Years`,
    `${d.startDate} - ${d.endDate}`,
    d.current ? 'ACTIVE CURRENT DASHA' : 'Completed / Upcoming',
  ]);

  autoTable(doc, {
    startY: 34,
    head: [['Mahadasha Lord', 'Graha', 'Duration', 'Period Window', 'Status']],
    body: dashaRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    rowPageBreak: 'avoid',
    didParseCell: (data) => {
      if (data.row.raw && (data.row.raw as string[])[4]?.includes('ACTIVE')) {
        data.cell.styles.fillColor = [254, 243, 199];
        data.cell.styles.textColor = [180, 83, 9];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
  });

  // Doshas & Yogas
  const finalY2 = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Dosha & Yoga Analysis (दोष एवं शुभ योग)', 14, finalY2 + 10);

  autoTable(doc, {
    startY: finalY2 + 14,
    head: [['Category / योग', 'Status / स्थिति', 'Detailed Vedic Insight & Recommended Remedies']],
    body: [
      ['Manglik Dosha', dosha.isManglik ? 'Manglik Present' : 'Non-Manglik', dosha.manglikDescription],
      ['Kalsarp Yoga', dosha.isKalsarp ? dosha.kalsarpType : 'No Kalsarp', dosha.kalsarpDescription],
      ['Saturn Sade Sati', dosha.isSadeSati ? dosha.sadeSatiPhase : 'Not Active', dosha.sadeSatiDescription],
      ...kundali.yogas.map((y) => [
        `${y.name} (${y.nameHindi || ''})`,
        y.strength || 'Auspicious',
        `${y.formation ? `[${y.formation}] ` : ''}${y.description} -> Impact: ${y.impact}`,
      ]),
    ],
    theme: 'grid',
    headStyles: { fillColor: [67, 56, 202], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 3 },
  });

  // Page 3: Divisional D-Charts (D9 Navamsha & D10 Dashamsha) & Jaimini Karakas
  try {
    const hora = calculateJagannathaHora(birthDetails);

    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(245, 158, 11);
    doc.setFontSize(14);
    doc.text('AstroDost AI - Divisional Charts (D9 Navamsha, D10 Dashamsha) & Karakas', 105, 13, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('5. Jaimini Chara Karakas (आत्मकारक एवं चर कारक)', 14, 30);

    const karakaRows = hora.charaKarakas.map((k) => [
      k.code,
      k.titleHindi,
      k.planet,
      k.sign,
      k.formattedDegree,
      k.signification,
    ]);

    autoTable(doc, {
      startY: 34,
      head: [['Karaka', 'संस्कृत संज्ञा', 'Graha', 'Rashi', 'Degree', 'Core Signification']],
      body: karakaRows,
      theme: 'grid',
      headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255] },
      styles: { fontSize: 8.5, cellPadding: 2.5 },
    });

    const finalY3 = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('6. D9 Navamsha & D10 Dashamsha Planetary Placements', 14, finalY3 + 10);

    const d9Varga = hora.vargas['D9'];
    const d10Varga = hora.vargas['D10'];

    const d9Planets = d9Varga.houses.flatMap((h) => h.planets);
    const d10Planets = d10Varga.houses.flatMap((h) => h.planets);

    const combinedRows = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((pName) => {
      const p9 = d9Planets.find((p) => p.name === pName);
      const p10 = d10Planets.find((p) => p.name === pName);
      return [
        pName,
        p9 ? `${p9.sign} (House ${p9.house})` : '-',
        p9?.isVargottama ? 'Vargottama' : p9?.isPushkara ? 'Pushkara' : 'Direct',
        p10 ? `${p10.sign} (House ${p10.house})` : '-',
        p10?.isVargottama ? 'Vargottama' : 'Direct',
      ];
    });

    autoTable(doc, {
      startY: finalY3 + 14,
      head: [['Planet', 'D9 Navamsha Placement', 'D9 Dignity', 'D10 Dashamsha Placement', 'D10 Dignity']],
      body: combinedRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], textColor: [245, 158, 11] },
      styles: { fontSize: 8.5, cellPadding: 2.5 },
    });
  } catch (err) {
    console.error('Failed to append D-Charts to PDF', err);
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Generated by AstroDost AI Vedic Portal | Page ${i} of ${pageCount} | https://ai.studio`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`${birthDetails.name.replace(/\s+/g, '_')}_AstroDost_Kundali.pdf`);
}
