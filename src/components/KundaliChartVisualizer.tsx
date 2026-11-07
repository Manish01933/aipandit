import React, { useState } from 'react';
import { BirthDetails, HouseInfo, Language, PlanetInfo, ZodiacSign } from '../types/astrology';
import { calculateJagannathaHora, VargaCode, VARGA_METADATA } from '../utils/jagannathaHoraEngine';
import { Layers } from 'lucide-react';

interface KundaliChartVisualizerProps {
  houses: HouseInfo[];
  ascendantSign: ZodiacSign;
  language: Language;
  title?: string;
  birthDetails?: BirthDetails;
}

export const KundaliChartVisualizer: React.FC<KundaliChartVisualizerProps> = ({
  houses: initialHouses,
  ascendantSign: initialAscendantSign,
  language,
  title,
  birthDetails,
}) => {
  const [chartType, setChartType] = useState<'north' | 'south'>('north');
  const [selectedVarga, setSelectedVarga] = useState<VargaCode>('D1');
  const [selectedHouseNumber, setSelectedHouseNumber] = useState<number | null>(1);

  // Compute active D-Chart data
  const vargaData = React.useMemo(() => {
    if (!birthDetails) return null;
    try {
      const hora = calculateJagannathaHora(birthDetails);
      return hora.vargas[selectedVarga] || null;
    } catch {
      return null;
    }
  }, [birthDetails, selectedVarga]);

  // Derived houses and ascendant based on selected varga
  const houses: HouseInfo[] = React.useMemo(() => {
    if (selectedVarga === 'D1' || !vargaData) {
      return initialHouses;
    }
    return vargaData.houses.map((vh) => ({
      houseNumber: vh.houseNumber,
      signNumber: vh.signNumber,
      sign: vh.sign,
      signHindi: vh.signHindi,
      significations: `House ${vh.houseNumber} in ${vargaData.name}: ${vargaData.signification}`,
      significationsHindi: `${vargaData.hindiName} में ${vh.houseNumber}वां भाव: ${vargaData.significationHindi}`,
      planets: vh.planets.map((vp) => ({
        name: vp.name,
        hindiName: vp.hindiName,
        sign: vp.sign,
        signHindi: vp.signHindi,
        signNumber: vp.signNumber,
        house: vp.house,
        degree: vp.degree,
        formattedDegree: vp.formattedDegree,
        nakshatra: '',
        nakshatraHindi: '',
        pada: 1,
        isRetrograde: false,
        dignity: vp.isVargottama ? 'Exalted' : 'Neutral',
        dignityHindi: vp.isVargottama ? 'वर्गोत्तम (Vargottama)' : vp.isPushkara ? 'पुष्कर (Pushkara)' : 'सामान्य (Normal)',
      })),
    }));
  }, [selectedVarga, vargaData, initialHouses]);

  const activeAscendantSign = selectedVarga === 'D1' || !vargaData ? initialAscendantSign : vargaData.ascendantSign;
  const selectedHouse = houses.find((h) => h.houseNumber === selectedHouseNumber) || houses[0] || null;

  // North Indian House Centers and coordinate bounding polygons for standard 400x400 SVG
  // 1 (Top Center Diamond): (200, 200) -> (100, 100) -> (200, 0) -> (300, 100)
  // 2 (Top Left Triangle): (0, 0) -> (200, 0) -> (100, 100)
  // 3 (Left Top Triangle): (0, 0) -> (100, 100) -> (0, 200)
  // 4 (Left Diamond): (0, 200) -> (100, 100) -> (200, 200) -> (100, 300)
  // 5 (Left Bottom Triangle): (0, 200) -> (100, 300) -> (0, 400)
  // 6 (Bottom Left Triangle): (0, 400) -> (100, 300) -> (200, 400)
  // 7 (Bottom Center Diamond): (200, 200) -> (100, 300) -> (200, 400) -> (300, 300)
  // 8 (Bottom Right Triangle): (200, 400) -> (300, 300) -> (400, 400)
  // 9 (Right Bottom Triangle): (300, 300) -> (400, 200) -> (400, 400)
  // 10 (Right Diamond): (200, 200) -> (300, 100) -> (400, 200) -> (300, 300)
  // 11 (Right Top Triangle): (300, 100) -> (400, 0) -> (400, 200)
  // 12 (Top Right Triangle): (200, 0) -> (400, 0) -> (300, 100)

  const northHousePoints: Record<number, { polygon: string; textX: number; textY: number; labelX: number; labelY: number }> = {
    1: { polygon: '200,200 100,100 200,0 300,100', textX: 200, textY: 105, labelX: 200, labelY: 45 },
    2: { polygon: '0,0 200,0 100,100', textX: 100, textY: 45, labelX: 130, labelY: 25 },
    3: { polygon: '0,0 100,100 0,200', textX: 45, textY: 100, labelX: 25, labelY: 130 },
    4: { polygon: '0,200 100,100 200,200 100,300', textX: 105, textY: 200, labelX: 45, labelY: 200 },
    5: { polygon: '0,200 100,300 0,400', textX: 45, textY: 300, labelX: 25, labelY: 270 },
    6: { polygon: '0,400 100,300 200,400', textX: 100, textY: 355, labelX: 130, labelY: 375 },
    7: { polygon: '200,200 100,300 200,400 300,300', textX: 200, textY: 295, labelX: 200, labelY: 355 },
    8: { polygon: '200,400 300,300 400,400', textX: 300, textY: 355, labelX: 270, labelY: 375 },
    9: { polygon: '300,300 400,200 400,400', textX: 355, textY: 300, labelX: 375, labelY: 270 },
    10: { polygon: '200,200 300,100 400,200 300,300', textX: 295, textY: 200, labelX: 355, labelY: 200 },
    11: { polygon: '300,100 400,0 400,200', textX: 355, textY: 100, labelX: 375, labelY: 130 },
    12: { polygon: '200,0 400,0 300,100', textX: 300, textY: 45, labelX: 270, labelY: 25 },
  };

  const getPlanetAbbreviation = (planetName: string) => {
    if (language === 'hi') {
      switch (planetName) {
        case 'Sun': return 'सू';
        case 'Moon': return 'चं';
        case 'Mars': return 'मं';
        case 'Mercury': return 'बु';
        case 'Jupiter': return 'गु';
        case 'Venus': return 'शु';
        case 'Saturn': return 'श';
        case 'Rahu': return 'रा';
        case 'Ketu': return 'के';
        case 'Ascendant': return 'लग्न';
        default: return planetName.substring(0, 2);
      }
    }
    switch (planetName) {
      case 'Sun': return 'Su';
      case 'Moon': return 'Mo';
      case 'Mars': return 'Ma';
      case 'Mercury': return 'Me';
      case 'Jupiter': return 'Ju';
      case 'Venus': return 'Ve';
      case 'Saturn': return 'Sa';
      case 'Rahu': return 'Ra';
      case 'Ketu': return 'Ke';
      case 'Ascendant': return 'Asc';
      default: return planetName.substring(0, 2);
    }
  };

  const D_CHARTS: Array<{ code: VargaCode; name: string; nameHindi: string; label: string; desc: string }> = [
    { code: 'D1', name: 'Rashi / Lagna (D1)', nameHindi: 'लग्न कुंडली (D1)', label: 'D1 Lagna', desc: 'Physical self, general life, overall destiny' },
    { code: 'D9', name: 'Navamsha (D9)', nameHindi: 'नवांश कुंडली (D9)', label: 'D9 Navamsha', desc: 'Dharma, spouse, marriage, inner strength' },
    { code: 'D10', name: 'Dashamsha (D10)', nameHindi: 'दशांश कुंडली (D10)', label: 'D10 Dashamsha', desc: 'Career, profession, power, status & fame' },
    { code: 'D7', name: 'Saptamsha (D7)', nameHindi: 'सप्तांश कुंडली (D7)', label: 'D7 Saptamsha', desc: 'Children, progeny, legacy & happiness' },
    { code: 'D2', name: 'Hora (D2)', nameHindi: 'होरा कुंडली (D2)', label: 'D2 Hora', desc: 'Wealth, finances, prosperity & resources' },
    { code: 'D3', name: 'Drekkana (D3)', nameHindi: 'द्रेष्काण कुंडली (D3)', label: 'D3 Drekkana', desc: 'Siblings, courage, vitality, karma initiative' },
    { code: 'D12', name: 'Dwadashamsha (D12)', nameHindi: 'द्वादशांश (D12)', label: 'D12 Dwadash', desc: 'Parents, heritage, past ancestral lineage' },
    { code: 'D60', name: 'Shashtiamsha (D60)', nameHindi: 'षष्ट्यंश (D60)', label: 'D60 Shashtiamsha', desc: 'Past-life karma, ultimate subtle destiny' },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-amber-500/20 p-4 sm:p-6 shadow-xl space-y-4">
      {/* Divisional D-Charts Horizontal Tabs */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {language === 'hi' ? 'विभागीय वर्ग कुंडलियां (Divisional D-Charts)' : 'Divisional Charts (Vargas)'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {language === 'hi' ? 'जातक विवरण के आधार पर गतिशील गणना' : 'Live Recalculated for Native'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {D_CHARTS.map((dc) => (
            <button
              key={dc.code}
              type="button"
              onClick={() => {
                setSelectedVarga(dc.code);
                setSelectedHouseNumber(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                selectedVarga === dc.code
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <span>{language === 'hi' ? dc.nameHindi : dc.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Header & Style Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 pt-3">
        <div>
          <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
            <span>✨</span>
            {language === 'hi'
              ? `${D_CHARTS.find((d) => d.code === selectedVarga)?.nameHindi || 'लग्न कुंडली'} चक्र`
              : `${D_CHARTS.find((d) => d.code === selectedVarga)?.name || 'Lagna (D1)'} Chart`}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'hi'
              ? `लग्न राशि: ${activeAscendantSign} | ${D_CHARTS.find((d) => d.code === selectedVarga)?.desc}`
              : `Ascendant: ${activeAscendantSign} | ${D_CHARTS.find((d) => d.code === selectedVarga)?.desc}`}
          </p>
        </div>

        {/* Chart Style Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('north')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              chartType === 'north'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? 'उत्तर भारतीय (North)' : 'North Indian'}
          </button>
          <button
            type="button"
            onClick={() => setChartType('south')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              chartType === 'south'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? 'दक्षिण भारतीय (South)' : 'South Indian'}
          </button>
        </div>
      </div>

      {/* Visual Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Chart */}
        <div className="lg:col-span-7 flex justify-center">
          {chartType === 'north' ? (
            <div className="relative w-full max-w-[380px] aspect-square bg-slate-950/80 rounded-xl p-2 border border-amber-500/30 shadow-inner">
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md select-none">
                {/* Background Grid Lines */}
                <rect x="0" y="0" width="400" height="400" fill="none" stroke="#d97706" strokeWidth="2.5" />
                <line x1="0" y1="0" x2="400" y2="400" stroke="#d97706" strokeWidth="1.5" />
                <line x1="400" y1="0" x2="0" y2="400" stroke="#d97706" strokeWidth="1.5" />
                <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#d97706" strokeWidth="2" />

                {/* 12 Interactive Houses */}
                {houses.map((house) => {
                  const coords = northHousePoints[house.houseNumber];
                  const isSelected = selectedHouse?.houseNumber === house.houseNumber;

                  return (
                    <g
                      key={house.houseNumber}
                      onClick={() => setSelectedHouseNumber(house.houseNumber)}
                      className="cursor-pointer transition-all duration-150"
                    >
                      <polygon
                        points={coords.polygon}
                        className={`${
                          isSelected
                            ? 'fill-amber-500/25 stroke-amber-400 stroke-[2.5]'
                            : 'fill-transparent hover:fill-amber-500/10'
                        }`}
                      />

                      {/* Sign Number Indicator */}
                      <text
                        x={coords.labelX}
                        y={coords.labelY}
                        fill="#f59e0b"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="opacity-90 font-mono"
                      >
                        {house.signNumber}
                      </text>

                      {/* House Planets List */}
                      {house.planets.map((planet, pIdx) => {
                        const lineSpacing = 13;
                        const totalPlanets = house.planets.length;
                        const startY = coords.textY - ((totalPlanets - 1) * lineSpacing) / 2;

                        return (
                          <text
                            key={`${planet.name}-${pIdx}`}
                            x={coords.textX}
                            y={startY + pIdx * lineSpacing}
                            fill={
                              planet.dignity === 'Exalted'
                                ? '#4ade80'
                                : planet.dignity === 'Debilitated'
                                ? '#f87171'
                                : '#fef3c7'
                            }
                            fontSize="10"
                            fontWeight="600"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="drop-shadow"
                          >
                            {getPlanetAbbreviation(planet.name)}
                            {planet.isRetrograde ? '®' : ''}
                          </text>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* South Indian 4x4 Grid Chart */
            <div className="w-full max-w-[380px] aspect-square grid grid-cols-4 grid-rows-4 gap-1 p-2 bg-slate-950/80 rounded-xl border border-amber-500/30">
              {[
                { sign: 'Pisces', r: 1, c: 1 },
                { sign: 'Aries', r: 1, c: 2 },
                { sign: 'Taurus', r: 1, c: 3 },
                { sign: 'Gemini', r: 1, c: 4 },
                { sign: 'Aquarius', r: 2, c: 1 },
                { sign: 'Cancer', r: 2, c: 4 },
                { sign: 'Capricorn', r: 3, c: 1 },
                { sign: 'Leo', r: 3, c: 4 },
                { sign: 'Sagittarius', r: 4, c: 1 },
                { sign: 'Scorpio', r: 4, c: 2 },
                { sign: 'Libra', r: 4, c: 3 },
                { sign: 'Virgo', r: 4, c: 4 },
              ].map((box) => {
                const house = houses.find((h) => h.sign === box.sign);
                const isLagna = box.sign === activeAscendantSign;
                const isSelected = house && selectedHouse?.houseNumber === house.houseNumber;

                return (
                  <div
                    key={box.sign}
                    onClick={() => house && setSelectedHouseNumber(house.houseNumber)}
                    style={{ gridRow: box.r, gridColumn: box.c }}
                    className={`p-1.5 rounded border border-amber-500/30 flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400'
                        : 'bg-slate-900/60 hover:bg-amber-500/10'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-bold text-amber-400">
                      <span>{box.sign.substring(0, 3)}</span>
                      {isLagna && <span className="text-[9px] bg-rose-500 text-white px-1 rounded">Asc</span>}
                    </div>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {house?.planets.map((p) => (
                        <span key={p.name} className="text-[9px] text-amber-200 font-semibold">
                          {p.name.substring(0, 2)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Center Space */}
              <div
                style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }}
                className="flex items-center justify-center p-2 text-center text-xs font-bold text-amber-400/90 bg-slate-900/40 rounded border border-amber-500/10"
              >
                <div>
                  <p className="text-sm">🕉️</p>
                  <p>{activeAscendantSign} ({selectedVarga})</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* House Inspection Panel */}
        <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <h4 className="text-sm font-bold text-amber-300 mb-2 flex items-center justify-between">
            <span>
              {selectedHouse
                ? `${language === 'hi' ? `${selectedHouse.houseNumber}वां भाव` : `House ${selectedHouse.houseNumber}`} (${selectedHouse.sign})`
                : language === 'hi'
                ? 'भाव विवरण (House Details)'
                : 'House Particulars'}
            </span>
            {selectedHouse && (
              <span className="text-xs font-normal text-slate-400 font-mono">
                {language === 'hi' ? `राशि स्वामी: ${selectedHouse.signHindi}` : `Sign: ${selectedHouse.sign}`}
              </span>
            )}
          </h4>

          {selectedHouse ? (
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  {language === 'hi' ? 'कारक एवं प्रभाव (Significations):' : 'Significations & Domains:'}
                </p>
                <p className="text-slate-200 mt-0.5">
                  {language === 'hi' ? selectedHouse.significationsHindi : selectedHouse.significations}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  {language === 'hi' ? 'विराजमान ग्रह (Planets In House):' : 'Occupying Planets:'}
                </p>
                {selectedHouse.planets.length > 0 ? (
                  <div className="mt-1.5 space-y-1.5">
                    {selectedHouse.planets.map((p) => (
                      <div
                        key={p.name}
                        className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/60 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-amber-300">
                            {language === 'hi' ? (p.hindiName || p.name) : p.name}
                          </span>
                          {language === 'hi' && (
                            <span className="text-slate-400 text-[11px] ml-1.5">({p.name})</span>
                          )}
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {p.nakshatra} (Pada {p.pada}) • {p.formattedDegree}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            p.dignity === 'Exalted'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : p.dignity === 'Debilitated'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {language === 'hi' ? p.dignityHindi : p.dignity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic mt-1">
                    {language === 'hi' ? 'इस भाव में कोई प्रत्यक्ष ग्रह नहीं है।' : 'No physical planets occupying this house.'}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p className="text-2xl mb-2">🔍</p>
              <p>
                {language === 'hi'
                  ? 'चक्र में किसी भी भाव (त्रिकोण या केंद्र) पर क्लिक करके उसकी विस्तृत व्याख्या देखें।'
                  : 'Click on any house in the chart to inspect its planets, nakshatras, and life domains.'}
              </p>
            </div>
          )}

          {/* Quick Dignity Color Legend */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {language === 'hi' ? 'उच्च (Exalted)' : 'Exalted'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {language === 'hi' ? 'सामान्य (Own/Neutral)' : 'Normal'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              {language === 'hi' ? 'नीच (Debilitated)' : 'Debilitated'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
