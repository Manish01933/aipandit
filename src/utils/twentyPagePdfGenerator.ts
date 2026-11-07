import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { KundaliResult } from '../types/astrology';
import {
  generateTwentyPageKundaliReport,
  TwentyPageKundaliReport,
  TwentyPageReportPage,
} from './twentyPageKundaliEngine';

export interface PdfExportOptions {
  language?: 'hi' | 'en';
  onProgress?: (currentPage: number, totalPages: number) => void;
}

// Clean and sanitize string for ASCII fallback to prevent any $ % @ > # corruption
function toCleanAscii(str: string): string {
  if (!str) return '';
  return str
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Format coordinates and degrees cleanly without weird chars
function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

// Escape HTML characters for DOM rendering
function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate HTML string for Page 1 (Ornate Royal Cover Page)
 */
function generateCoverPageHtml(
  report: TwentyPageKundaliReport,
  kundali: KundaliResult,
  isHindi: boolean
): string {
  const nativeName = report.nativeName || (isHindi ? 'जातक' : 'Seeker');
  const activeDasha = kundali.dashaPeriods.find((d) => d.current);

  const col1 = [
    { no: 1, title: isHindi ? 'पृष्ठ 1: आमुख एवं जातक परिचय' : 'Page 1: Title & Native Cover Page' },
    { no: 2, title: isHindi ? 'पृष्ठ 2: सत्यापित जन्म विवरण व पंचांग' : 'Page 2: Verified Birth Details & Settings' },
    { no: 3, title: isHindi ? 'पृष्ठ 3: कार्यकारी कुंडली सारांश' : 'Page 3: Executive Kundali Summary' },
    { no: 4, title: isHindi ? 'पृष्ठ 4: स्पष्ट ग्रह स्थिति सारणी' : 'Page 4: Complete Planetary Positions' },
    { no: 5, title: isHindi ? 'पृष्ठ 5: लग्न एवं व्यक्तित्व विश्लेषण' : 'Page 5: Ascendant & Personality Analysis' },
    { no: 6, title: isHindi ? 'पृष्ठ 6: चंद्र राशि एवं मानसिक प्रवृत्तियां' : 'Page 6: Moon Sign & Mental Tendencies' },
    { no: 7, title: isHindi ? 'पृष्ठ 7: सूर्य, आत्मबल एवं जीवन दिशा' : 'Page 7: Sun, Identity & Soul Purpose' },
    { no: 8, title: isHindi ? 'पृष्ठ 8: भाव 1 से 4 का विस्तृत विश्लेषण' : 'Page 8: Detailed Houses 1 to 4 Analysis' },
    { no: 9, title: isHindi ? 'पृष्ठ 9: भाव 5 से 8 का विस्तृत विश्लेषण' : 'Page 9: Detailed Houses 5 to 8 Analysis' },
    { no: 10, title: isHindi ? 'पृष्ठ 10: भाव 9 से 12 का विस्तृत विश्लेषण' : 'Page 10: Detailed Houses 9 to 12 Analysis' },
    { no: 11, title: isHindi ? 'पृष्ठ 11: करियर, व्यवसाय व आजीविका' : 'Page 11: Career & Professional Life' },
    { no: 12, title: isHindi ? 'पृष्ठ 12: धन, आय व वित्तीय प्रवृत्तियां' : 'Page 12: Wealth, Income & Finances' },
  ];

  const col2 = [
    { no: 13, title: isHindi ? 'पृष्ठ 13: विवाह व दांपत्य जीवन विश्लेषण' : 'Page 13: Marriage & Relationships' },
    { no: 14, title: isHindi ? 'पृष्ठ 14: शिक्षा, कौशल व उच्च विद्या' : 'Page 14: Education, Skills & Intellect' },
    { no: 15, title: isHindi ? 'पृष्ठ 15: स्वास्थ्य एवं पारंपरिक दृष्टिकोण' : 'Page 15: Health & Traditional Wellness' },
    { no: 16, title: isHindi ? 'पृष्ठ 16: प्रमुख राजयोग व फलकथन' : 'Page 16: Major Yogas & Interpretations' },
    { no: 17, title: isHindi ? 'पृष्ठ 17: दोष विश्लेषण (मांगलिक/कालसर्प)' : 'Page 17: Dosha Analysis & Verification' },
    { no: 18, title: isHindi ? 'पृष्ठ 18: विंशोत्तरी महादशा कालक्रम' : 'Page 18: Vimshottari Dasha Cycles' },
    { no: 19, title: isHindi ? 'पृष्ठ 19: गोचर, साढ़ेसाती व वर्तमान ग्रह' : 'Page 19: Transit & Current Planetary Shifts' },
    { no: 20, title: isHindi ? 'पृष्ठ 20: वर्ग कुंडलियां (D9, D10, D7)' : 'Page 20: Divisional Charts (Vargas)' },
    { no: 21, title: isHindi ? 'पृष्ठ 21: वैदिक उपाय, रत्न व मंत्र साधना' : 'Page 21: Vedic Remedies & Mantras' },
    { no: 22, title: isHindi ? 'पृष्ठ 22: 10-वर्षीय जीवन योजना व कालखंड' : 'Page 22: 10-Year Life Roadmap & Planning' },
    { no: 23, title: isHindi ? 'पृष्ठ 23: कुंडली की शक्तियां व कार्ययोजना' : 'Page 23: Strengths & Practical Action Plan' },
    { no: 24, title: isHindi ? 'पृष्ठ 24: पारिभाषिक शब्दावली व ग्रंथ संदर्भ' : 'Page 24: Astrological Glossary & Terms' },
    { no: 25, title: isHindi ? 'पृष्ठ 25: सत्यापन प्रमाण पत्र व आधिकारिक मुहर' : 'Page 25: Verification Checklist & Official Seal' },
  ];

  return `
    <div class="pdf-a4-page" style="width: 794px; min-height: 1123px; height: 1123px; box-sizing: border-box; padding: 26px; background: #ffffff; color: #0f172a; font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif; display: flex; flex-direction: column; justify-content: space-between; position: relative; border: 3px double #d97706;">
      <!-- Corner Accents -->
      <div style="position: absolute; top: 8px; left: 10px; color: #d97706; font-size: 16px;">✦</div>
      <div style="position: absolute; top: 8px; right: 10px; color: #d97706; font-size: 16px;">✦</div>
      <div style="position: absolute; bottom: 8px; left: 10px; color: #d97706; font-size: 16px;">✦</div>
      <div style="position: absolute; bottom: 8px; right: 10px; color: #d97706; font-size: 16px;">✦</div>

      <!-- Header Royal Banner -->
      <div style="background: #0f172a; border-radius: 12px; padding: 18px 20px; text-align: center; border-bottom: 3px solid #f59e0b;">
        <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #f59e0b; font-weight: 800;">
          ASTRODOST AI • VEDIC ASTROLOGY HOROSCOPE
        </div>
        <div style="font-size: 20px; font-weight: 900; color: #ffffff; margin-top: 4px; font-family: 'Noto Sans Devanagari', sans-serif;">
          ${isHindi ? '📜 सम्पूर्ण जन्मकुंडली लेखा-जोखा (25-पृष्ठीय महापत्रिका)' : '📜 COMPLETE KUNDALI LIFE REPORT (25-PAGE HOROSCOPE)'}
        </div>
        <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
          ${isHindi ? 'महर्षि पराशर सिद्धांत • स्विस एफिमरिस खगोलीय शुद्धता • लाहिरी चित्रापक्ष अयनांश' : 'Classical Parashari Principles • Swiss Ephemeris Precision • Lahiri Chitrapaksha Ayanamsha'}
        </div>
      </div>

      <!-- Native Birth Particulars Card -->
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 18px;">
        <div style="font-size: 12px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; pb: 6px; margin-bottom: 10px; text-align: center;">
          ${isHindi ? 'जातक जन्म विवरण एवं खगोलीय मापदंड' : 'NATIVE BIRTH RECORD & ASTRONOMICAL PARAMETERS'}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 11px; color: #1e293b;">
          <div><strong>${isHindi ? 'जातक का नाम:' : 'Full Name:'}</strong> ${escapeHtml(nativeName)}</div>
          <div><strong>${isHindi ? 'लिंग:' : 'Gender:'}</strong> ${escapeHtml(kundali.birthDetails.gender.toUpperCase())}</div>
          <div><strong>${isHindi ? 'जन्म तिथि:' : 'Date of Birth:'}</strong> ${escapeHtml(kundali.birthDetails.dob)}</div>
          <div><strong>${isHindi ? 'जन्म समय:' : 'Time of Birth:'}</strong> ${escapeHtml(kundali.birthDetails.tob)}</div>
          <div><strong>${isHindi ? 'जन्म स्थान:' : 'Birth Place:'}</strong> ${escapeHtml(kundali.birthDetails.place)}</div>
          <div><strong>${isHindi ? 'अक्षांश / देशांतर:' : 'Coordinates:'}</strong> ${kundali.birthDetails.latitude.toFixed(4)}° N, ${kundali.birthDetails.longitude.toFixed(4)}° E</div>
          <div><strong>${isHindi ? 'समय क्षेत्र (Timezone):' : 'Time Zone:'}</strong> UTC +${kundali.birthDetails.timezone}</div>
          <div><strong>${isHindi ? 'रिपोर्ट निर्माण तिथि:' : 'Generated On:'}</strong> ${escapeHtml(report.generatedAt)}</div>
        </div>
      </div>

      <!-- Core Astrological Pillars at Birth -->
      <div style="background: #0f172a; border-radius: 12px; padding: 12px 18px; color: #ffffff;">
        <div style="font-size: 11px; font-weight: 800; color: #f59e0b; text-align: center; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
          ${isHindi ? 'जन्मकालीन प्रमुख ज्योतिषीय आधार स्तंभ' : 'CORE ASTROLOGICAL PILLARS AT BIRTH'}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px 12px; font-size: 10.5px;">
          <div><span style="color: #94a3b8;">${isHindi ? 'लग्न (Ascendant):' : 'Ascendant:'}</span> <strong>${escapeHtml(kundali.ascendantSign)}</strong></div>
          <div><span style="color: #94a3b8;">${isHindi ? 'चंद्र राशि (Moon Sign):' : 'Moon Sign:'}</span> <strong>${escapeHtml(kundali.moonSign)}</strong></div>
          <div><span style="color: #94a3b8;">${isHindi ? 'सूर्य राशि (Sun Sign):' : 'Sun Sign:'}</span> <strong>${escapeHtml(kundali.sunSign)}</strong></div>
          <div><span style="color: #94a3b8;">${isHindi ? 'जन्म नक्षत्र:' : 'Nakshatra:'}</span> <strong>${escapeHtml(kundali.birthNakshatra)}</strong></div>
          <div><span style="color: #94a3b8;">${isHindi ? 'नक्षत्र स्वामी:' : 'Nakshatra Lord:'}</span> <strong>${escapeHtml(kundali.nakshatraLord)}</strong></div>
          <div><span style="color: #94a3b8;">${isHindi ? 'सक्रिय महादशा:' : 'Active Dasha:'}</span> <strong style="color: #34d399;">${escapeHtml(activeDasha ? activeDasha.planet : 'Direct')}</strong></div>
        </div>
      </div>

      <!-- 25-Page Table of Contents -->
      <div style="background: #f1f5f9; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 16px;">
        <div style="font-size: 11.5px; font-weight: 800; color: #b45309; text-align: center; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
          ${isHindi ? '25-पृष्ठीय महापत्रिका विषय-सूची (Table of Contents)' : '25-PAGE COMPLETE HOROSCOPE INDEX'}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; font-size: 9.5px; color: #334155;">
          <div>
            ${col1
              .map(
                (item) => `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding: 2px 0;">
                <span>${escapeHtml(item.title)}</span>
              </div>
            `
              )
              .join('')}
          </div>
          <div>
            ${col2
              .map(
                (item) => `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding: 2px 0;">
                <span>${escapeHtml(item.title)}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>

      <!-- Royal Footer -->
      <div style="border-top: 1px solid #cbd5e1; padding-top: 8px; text-align: center; font-size: 9.5px; color: #64748b;">
        <div>AstroDost AI • Vedic Astrology & Ephemeris Engine • www.astrodost.ai</div>
        <div style="color: #94a3b8; font-size: 8.5px; margin-top: 2px;">
          ${isHindi ? 'शुद्ध गणना • प्रामाणिक सूत्र • पृष्ठ 1 / 25' : 'Pure Parashari Calculations • ISO Compliant • Page 1 of 25'}
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate HTML string for Content Pages (Pages 2 to 25)
 */
function generateContentPageHtml(
  page: TwentyPageReportPage,
  report: TwentyPageKundaliReport,
  isHindi: boolean,
  totalPages: number
): string {
  const title = isHindi ? page.titleHi : page.titleEn;
  const subtitle = isHindi ? page.subtitleHi : page.subtitleEn;
  const nativeName = report.nativeName || (isHindi ? 'जातक' : 'Seeker');

  return `
    <div class="pdf-a4-page" style="width: 794px; min-height: 1123px; height: 1123px; box-sizing: border-box; padding: 24px; background: #ffffff; color: #0f172a; font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif; display: flex; flex-direction: column; justify-content: space-between; position: relative; border: 3px double #d97706;">
      <!-- Corner Accents -->
      <div style="position: absolute; top: 6px; left: 8px; color: #d97706; font-size: 14px;">✦</div>
      <div style="position: absolute; top: 6px; right: 8px; color: #d97706; font-size: 14px;">✦</div>
      <div style="position: absolute; bottom: 6px; left: 8px; color: #d97706; font-size: 14px;">✦</div>
      <div style="position: absolute; bottom: 6px; right: 8px; color: #d97706; font-size: 14px;">✦</div>

      <!-- Header Royal Banner -->
      <div style="background: #0f172a; border-radius: 10px; padding: 10px 16px; border-bottom: 2.5px solid #f59e0b; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 9.5px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1.5px;">
            ASTRODOST AI • 25-PAGE VEDIC HOROSCOPE
          </div>
          <div style="font-size: 13px; font-weight: 900; color: #ffffff; margin-top: 2px;">
            ${escapeHtml(title)}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="background: #f59e0b; color: #0f172a; font-size: 10px; font-weight: 900; padding: 2px 8px; rounded: 4px; display: inline-block; border-radius: 4px;">
            ${isHindi ? `पृष्ठ ${page.pageNumber} / ${totalPages}` : `Page ${page.pageNumber} of ${totalPages}`}
          </div>
          <div style="font-size: 9px; color: #94a3b8; margin-top: 2px;">
            ${escapeHtml(nativeName)} • ${escapeHtml(report.birthSummary)}
          </div>
        </div>
      </div>

      <!-- Page Subtitle Description Ribbon -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 12px; margin-top: 6px; font-size: 9.5px; color: #475569; font-style: italic;">
        ${escapeHtml(subtitle)}
      </div>

      <!-- Main Content Flow Container (Evenly distributed sections) -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; gap: 10px; margin-top: 8px; margin-bottom: 8px;">
        ${page.sections
          .map((sec) => {
            const heading = isHindi ? sec.headingHi : sec.headingEn;
            const content = isHindi ? sec.contentHi : sec.contentEn;
            const bullets = isHindi ? sec.bulletPointsHi : sec.bulletPointsEn;

            return `
              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 12px 14px;">
                <!-- Section Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 6px;">
                  <div style="font-size: 11.5px; font-weight: 800; color: #b45309; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #d97706;">✦</span>
                    <span>${escapeHtml(heading)}</span>
                  </div>
                  ${
                    sec.highlightBadge
                      ? `<span style="font-size: 9px; font-weight: 700; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 1px 6px; border-radius: 4px;">${escapeHtml(
                          sec.highlightBadge
                        )}</span>`
                      : ''
                  }
                </div>

                <!-- Section Paragraph -->
                <div style="font-size: 11px; line-height: 1.6; color: #1e293b; text-align: justify;">
                  ${escapeHtml(content)}
                </div>

                <!-- Table Data (if present) -->
                ${
                  sec.tableData && sec.tableData.rows.length > 0
                    ? `
                  <div style="margin-top: 8px; border-radius: 6px; overflow: hidden; border: 1px solid #cbd5e1;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; table-layout: fixed;">
                      <thead>
                        <tr style="background: #1e293b; color: #f59e0b;">
                          ${sec.tableData.headers
                            .map(
                              (h) => `
                            <th style="padding: 5px 6px; text-align: left; font-weight: 800; border-right: 1px solid #334155; word-break: break-word;">
                              ${escapeHtml(h)}
                            </th>
                          `
                            )
                            .join('')}
                        </tr>
                      </thead>
                      <tbody>
                        ${sec.tableData.rows
                          .map(
                            (row, rIdx) => `
                          <tr style="background: ${rIdx % 2 === 0 ? '#ffffff' : '#f1f5f9'}; border-bottom: 1px solid #e2e8f0;">
                            ${row
                              .map(
                                (cell) => `
                              <td style="padding: 4px 6px; color: #0f172a; border-right: 1px solid #e2e8f0; word-break: break-word; line-height: 1.35;">
                                ${escapeHtml(String(cell))}
                              </td>
                            `
                              )
                              .join('')}
                          </tr>
                        `
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                `
                    : ''
                }

                <!-- Bullet Points (if present) -->
                ${
                  bullets && bullets.length > 0
                    ? `
                  <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 3px;">
                    ${bullets
                      .map(
                        (bp) => `
                      <div style="font-size: 10px; color: #334155; line-height: 1.45; display: flex; align-items: flex-start; gap: 5px;">
                        <span style="color: #d97706; margin-top: 1px;">•</span>
                        <span>${escapeHtml(bp)}</span>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                `
                    : ''
                }
              </div>
            `;
          })
          .join('')}
      </div>

      <!-- Royal Footer -->
      <div style="border-top: 1px solid #cbd5e1; padding-top: 6px; text-align: center; font-size: 8.5px; color: #64748b; display: flex; align-items: center; justify-content: space-between;">
        <span>AstroDost AI • www.astrodost.ai</span>
        <span>${isHindi ? `पृष्ठ ${page.pageNumber} / ${totalPages} • प्रामाणिक वैदिक विश्लेषण` : `Page ${page.pageNumber} of ${totalPages} • Authentic Vedic Analysis`}</span>
        <span>${escapeHtml(report.generatedAt)}</span>
      </div>
    </div>
  `;
}

/**
 * Fallback direct jsPDF generator (Fast & Offline)
 * Hardened to prevent any $ % @ > # symbol corruption by using clean ASCII/Latin characters.
 */
function exportViaJsPdfDirectFallback(
  report: TwentyPageKundaliReport,
  kundali: KundaliResult,
  onProgress?: (curr: number, total: number) => void
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totalPages = report.pages.length;
  const nativeName = toCleanAscii(report.nativeName || 'Seeker');
  const birthSummary = toCleanAscii(report.birthSummary);

  for (let i = 0; i < totalPages; i++) {
    const page = report.pages[i];
    if (i > 0) doc.addPage();
    if (onProgress) onProgress(i + 1, totalPages);

    // Decorative Borders
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.8);
    doc.rect(7, 7, 196, 283);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);
    doc.rect(9, 9, 192, 279);

    if (page.pageNumber === 1) {
      // Cover Page
      doc.setFillColor(15, 23, 42);
      doc.rect(10, 10, 190, 48, 'F');
      doc.setFillColor(245, 158, 11);
      doc.rect(10, 58, 190, 2.5, 'F');

      doc.setTextColor(245, 158, 11);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ASTRODOST AI VEDIC HOROSCOPE', 105, 24, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('COMPLETE KUNDALI LIFE REPORT (25 PAGES)', 105, 33, { align: 'center' });

      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      doc.text('25-Page Parashari Vedic Life Analysis & Ephemeris Chart', 105, 41, { align: 'center' });
      doc.text('High-Precision Swiss Ephemeris • Lahiri Chitrapaksha Ayanamsha', 105, 47, { align: 'center' });

      // Native Details
      const coverY = 72;
      doc.setFillColor(248, 250, 252);
      doc.rect(18, coverY, 174, 55, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(18, coverY, 174, 55);

      doc.setTextColor(180, 83, 9);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('NATIVE BIRTH RECORD & HOROSCOPE PARTICULARS', 105, coverY + 9, { align: 'center' });

      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.text(`Full Name: ${nativeName}`, 24, coverY + 20);
      doc.text(`Date of Birth: ${kundali.birthDetails.dob}`, 24, coverY + 27);
      doc.text(`Time of Birth: ${kundali.birthDetails.tob}`, 24, coverY + 34);
      doc.text(`Birth Place: ${toCleanAscii(kundali.birthDetails.place)}`, 24, coverY + 41);

      doc.text(`Gender: ${kundali.birthDetails.gender.toUpperCase()}`, 115, coverY + 20);
      doc.text(`Coordinates: ${kundali.birthDetails.latitude.toFixed(2)} N, ${kundali.birthDetails.longitude.toFixed(2)} E`, 115, coverY + 27);
      doc.text(`Time Zone: UTC +${kundali.birthDetails.timezone}`, 115, coverY + 34);
      doc.text(`Generated On: ${toCleanAscii(report.generatedAt)}`, 115, coverY + 41);
      doc.text(`Total Pages: 25 Detailed Pages`, 115, coverY + 48);

      // Core Pillars
      const pillarsY = 135;
      doc.setFillColor(15, 23, 42);
      doc.rect(18, pillarsY, 174, 28, 'F');
      doc.setTextColor(245, 158, 11);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('CORE ASTROLOGICAL PILLARS AT BIRTH', 105, pillarsY + 8, { align: 'center' });

      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.text(`Ascendant: ${toCleanAscii(kundali.ascendantSign)}`, 25, pillarsY + 16);
      doc.text(`Moon Sign: ${toCleanAscii(kundali.moonSign)}`, 80, pillarsY + 16);
      doc.text(`Nakshatra: ${toCleanAscii(kundali.birthNakshatra)}`, 135, pillarsY + 16);

      const activeD = kundali.dashaPeriods.find((d) => d.current);
      doc.text(`Nakshatra Lord: ${toCleanAscii(kundali.nakshatraLord)}`, 25, pillarsY + 22);
      doc.text(`Active Dasha: ${activeD ? toCleanAscii(activeD.planet) : 'Direct'}`, 80, pillarsY + 22);
      doc.text(`Ayanamsha: Lahiri (24 deg)`, 135, pillarsY + 22);
    } else {
      // Content Pages
      doc.setFillColor(15, 23, 42);
      doc.rect(10, 10, 190, 24, 'F');
      doc.setFillColor(245, 158, 11);
      doc.rect(10, 33.5, 190, 1.5, 'F');

      doc.setTextColor(245, 158, 11);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ASTRODOST AI - 25-PAGE COMPLETE KUNDALI LIFE REPORT', 105, 18, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${page.pageNumber} of ${totalPages} - ${toCleanAscii(page.titleEn)}`, 105, 25, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Native: ${nativeName} | ${birthSummary}`, 105, 30, { align: 'center' });

      let currentY = 39;
      for (const sec of page.sections) {
        if (currentY > 260) break;

        doc.setFillColor(241, 245, 249);
        doc.rect(12, currentY, 186, 6.5, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(12, currentY, 186, 6.5);

        doc.setTextColor(180, 83, 9);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(toCleanAscii(sec.headingEn), 16, currentY + 4.5);

        currentY += 8.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);

        const cleanContent = toCleanAscii(sec.contentEn);
        const splitText = doc.splitTextToSize(cleanContent, 182);
        doc.text(splitText, 14, currentY + 2);
        currentY += splitText.length * 3.8 + 4;

        if (sec.tableData && sec.tableData.rows.length > 0 && currentY < 240) {
          const cleanHeaders = sec.tableData.headers.map((h) => toCleanAscii(h));
          const cleanRows = sec.tableData.rows.map((row) =>
            row.map((cell) => toCleanAscii(String(cell)))
          );

          autoTable(doc, {
            startY: currentY,
            margin: { left: 12, right: 12 },
            head: [cleanHeaders],
            body: cleanRows,
            theme: 'grid',
            headStyles: {
              fillColor: [30, 41, 59],
              textColor: [245, 158, 11],
              fontSize: 7,
              fontStyle: 'bold',
            },
            styles: {
              fontSize: 7,
              cellPadding: 1.8,
              textColor: [15, 23, 42],
              overflow: 'linebreak',
            },
            tableWidth: 186,
          });

          currentY = (doc as any).lastAutoTable.finalY + 5;
        }
      }

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(12, 280, 198, 280);
      doc.setFontSize(7.2);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `AstroDost AI • Page ${page.pageNumber} of ${totalPages} • Parashari Complete Life Analysis • ${toCleanAscii(report.generatedAt)}`,
        105,
        284,
        { align: 'center' }
      );
    }
  }

  const cleanFileName = `${(report.nativeName || 'User').replace(/[^a-zA-Z0-9]/g, '_')}_25_Page_Complete_Kundali_Report.pdf`;
  doc.save(cleanFileName);
}

/**
 * Main export function: Uses HTML Canvas rendering to guarantee 100% perfect Unicode,
 * Devanagari HarfBuzz glyph shaping, zero text corruption, and balanced page utilization.
 */
export async function exportTwentyPageKundaliPDF(
  kundali: KundaliResult,
  optionsOrProgress?:
    | ((currentPage: number, totalPages: number) => void)
    | PdfExportOptions
): Promise<void> {
  let language: 'hi' | 'en' = 'hi';
  let onProgress: ((currentPage: number, totalPages: number) => void) | undefined;

  if (typeof optionsOrProgress === 'function') {
    onProgress = optionsOrProgress;
  } else if (optionsOrProgress) {
    if (optionsOrProgress.language) language = optionsOrProgress.language;
    if (optionsOrProgress.onProgress) onProgress = optionsOrProgress.onProgress;
  }

  const report: TwentyPageKundaliReport = generateTwentyPageKundaliReport(kundali);
  const isHindi = language === 'hi';
  const totalPages = report.pages.length;

  // Check if browser environment supports DOM stage
  if (typeof document === 'undefined') {
    exportViaJsPdfDirectFallback(report, kundali, onProgress);
    return;
  }

  // Create offscreen staging container
  const stage = document.createElement('div');
  stage.id = 'astrodost-pdf-export-stage';
  stage.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 794px;
    z-index: -99999;
    background: #ffffff;
    color: #0f172a;
    font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif;
    opacity: 0.01;
    pointer-events: none;
  `;
  document.body.appendChild(stage);

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let i = 0; i < totalPages; i++) {
      if (onProgress) {
        onProgress(i + 1, totalPages);
      }

      const page = report.pages[i];
      let pageHtml = '';

      if (page.pageNumber === 1) {
        pageHtml = generateCoverPageHtml(report, kundali, isHindi);
      } else {
        pageHtml = generateContentPageHtml(page, report, isHindi, totalPages);
      }

      stage.innerHTML = pageHtml;
      const pageElement = stage.firstElementChild as HTMLElement;

      // Render page via html2canvas with high scale for razor-sharp typography
      const canvas = await html2canvas(pageElement, {
        scale: 1.75, // 1.75x produces ~200-250 DPI print quality without excessive RAM
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        windowHeight: 1123,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (i > 0) {
        doc.addPage();
      }

      // Add image filling standard A4 dimension exactly (210mm x 297mm)
      doc.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    const rawName = report.nativeName || 'User';
    const cleanFileName = `${rawName.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_')}_25_Page_Complete_Kundali_${language.toUpperCase()}.pdf`;
    doc.save(cleanFileName);
  } catch (err) {
    console.warn('Canvas PDF export failed, falling back to direct jsPDF engine:', err);
    exportViaJsPdfDirectFallback(report, kundali, onProgress);
  } finally {
    if (stage.parentNode) {
      stage.parentNode.removeChild(stage);
    }
  }
}
