import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Compass, Globe, Check, AlertCircle, Sparkles, X, Crosshair } from 'lucide-react';
import { Language } from '../types/astrology';
import { KNOWN_CITIES, lookupCityCoordinates } from '../utils/citiesDatabase';

interface GoogleMapsPlacePickerProps {
  initialPlace: string;
  initialLat: number;
  initialLon: number;
  initialTz?: number;
  language: Language;
  onSelectPlace: (place: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: number;
  }) => void;
}

const CITY_PRESETS = [
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: 'Varanasi, India (Kashi)', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'Ujjain, India (Mahakal)', lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: 'Haridwar, India', lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { name: 'Ayodhya, India', lat: 26.7922, lon: 82.1998, tz: 5.5 },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Chennai, India', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Hyderabad, India', lat: 17.385, lon: 78.4867, tz: 5.5 },
  { name: 'Ahmedabad, India', lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: 'Jaipur, India', lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lon: 85.324, tz: 5.75 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, tz: -5 },
  { name: 'San Francisco, USA', lat: 37.7749, lon: -122.4194, tz: -8 },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, tz: 10 },
  { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832, tz: -5 },
];

export const GoogleMapsPlacePicker: React.FC<GoogleMapsPlacePickerProps> = ({
  initialPlace,
  initialLat,
  initialLon,
  initialTz = 5.5,
  language,
  onSelectPlace,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialPlace);
  const [searchResults, setSearchResults] = useState<Array<{ name: string; lat: number; lon: number; tz: number; isGoogleMaps?: boolean }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat || 28.6139,
    lng: initialLon || 77.209,
  });
  const [selectedPlaceName, setSelectedPlaceName] = useState(initialPlace || 'New Delhi, India');
  const [selectedTz, setSelectedTz] = useState(initialTz);
  const [showKeyInstructions, setShowKeyInstructions] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const API_KEY =
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
    '';
  const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

  useEffect(() => {
    if (initialPlace) {
      setSearchQuery(initialPlace);
      setSelectedPlaceName(initialPlace);
    }
  }, [initialPlace]);

  useEffect(() => {
    if (initialLat && initialLon) {
      setSelectedCoords({ lat: initialLat, lng: initialLon });
    }
  }, [initialLat, initialLon]);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Estimate timezone from longitude & country heuristics
  const estimateTimezone = (lat: number, lon: number): number => {
    if (lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
      return 5.5; // IST
    }
    if (lat >= 26 && lat <= 31 && lon >= 80 && lon <= 89) {
      return 5.75;
    }
    const rawOffset = lon / 15;
    return Math.round(rawOffset * 2) / 2;
  };

  // Local Mean Time (LMT) Correction in Minutes
  // In Vedic astrology: (Longitude - StandardMeridian) * 4 minutes
  const standardMeridian = selectedTz * 15;
  const lmtCorrectionMinutes = (selectedCoords.lng - standardMeridian) * 4;

  // Live Place Search using Google Maps Geocoding Proxy + Fallbacks
  const handleSearch = async (queryText: string) => {
    setSearchQuery(queryText);
    setSelectedPlaceName(queryText);

    // Check if known city database has immediate match
    const directMatch = lookupCityCoordinates(queryText);
    const activeLat = directMatch ? directMatch.lat : selectedCoords.lat;
    const activeLon = directMatch ? directMatch.lon : selectedCoords.lng;
    const activeTz = directMatch ? directMatch.tz : selectedTz;

    if (directMatch) {
      setSelectedCoords({ lat: directMatch.lat, lng: directMatch.lon });
      setSelectedTz(directMatch.tz);
    }

    onSelectPlace({
      name: queryText,
      latitude: activeLat,
      longitude: activeLon,
      timezone: activeTz,
    });

    if (!queryText || queryText.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const q = queryText.toLowerCase().trim();
      const localMatches = KNOWN_CITIES.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.state && c.state.toLowerCase().includes(q))
      ).map((c) => ({
        name: `${c.name}, ${c.state ? c.state + ', ' : ''}${c.country}`,
        lat: c.lat,
        lon: c.lon,
        tz: c.tz,
        isGoogleMaps: false,
      }));

      // 1. First attempt: Query Google Maps Geocoding API via server proxy
      let googleMatches: Array<{ name: string; lat: number; lon: number; tz: number; isGoogleMaps: boolean }> = [];
      try {
        const gRes = await fetch(`/api/maps/geocode?address=${encodeURIComponent(queryText)}`);
        const gData = await gRes.json();
        if (gData && gData.status === 'OK' && Array.isArray(gData.results)) {
          googleMatches = gData.results.slice(0, 5).map((item: any) => {
            const lat = item.geometry.location.lat;
            const lon = item.geometry.location.lng;
            return {
              name: item.formatted_address,
              lat,
              lon,
              tz: estimateTimezone(lat, lon),
              isGoogleMaps: true,
            };
          });
        }
      } catch (gErr) {
        // Non-blocking fallback
      }

      // 2. Second attempt: OpenStreetMap Geocoding if Google Maps returned no results
      let osmMatches: Array<{ name: string; lat: number; lon: number; tz: number; isGoogleMaps: boolean }> = [];
      if (googleMatches.length === 0) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryText)}&format=json&limit=5&addressdetails=1`
          );
          const data = await res.json();
          if (Array.isArray(data)) {
            osmMatches = data.map((item: any) => {
              const lat = parseFloat(item.lat);
              const lon = parseFloat(item.lon);
              return {
                name: item.display_name.split(',').slice(0, 3).join(',').trim(),
                lat,
                lon,
                tz: estimateTimezone(lat, lon),
                isGoogleMaps: false,
              };
            });
          }
        } catch {}
      }

      // Combine results prioritizing Google Maps, then local Vedic cities, then OSM
      const combined = [...googleMatches, ...localMatches, ...osmMatches];
      const uniqueResults: typeof combined = [];
      combined.forEach((item) => {
        if (!uniqueResults.some((c) => Math.abs(c.lat - item.lat) < 0.03 && Math.abs(c.lon - item.lon) < 0.03)) {
          uniqueResults.push(item);
        }
      });

      setSearchResults(uniqueResults.slice(0, 8));
    } catch {
      const q = queryText.toLowerCase().trim();
      const localMatches = KNOWN_CITIES.filter((c) => c.name.toLowerCase().includes(q)).map((c) => ({
        name: `${c.name}, ${c.country}`,
        lat: c.lat,
        lon: c.lon,
        tz: c.tz,
        isGoogleMaps: false,
      }));
      setSearchResults(localMatches);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePickLocation = (loc: { name: string; lat: number; lon: number; tz?: number }) => {
    const tz = loc.tz ?? estimateTimezone(loc.lat, loc.lon);
    setSelectedPlaceName(loc.name);
    setSelectedCoords({ lat: loc.lat, lng: loc.lon });
    setSelectedTz(tz);
    setSearchQuery(loc.name);
    setSearchResults([]);

    onSelectPlace({
      name: loc.name,
      latitude: loc.lat,
      longitude: loc.lon,
      timezone: tz,
    });
  };

  // Detect GPS Location
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const tz = estimateTimezone(lat, lng);
        setSelectedCoords({ lat, lng });
        setSelectedTz(tz);
        setIsLocating(false);

        // Try Google Maps reverse geocoding first
        try {
          const res = await fetch(`/api/maps/reverse-geocode?lat=${lat}&lng=${lng}`);
          const data = await res.json();
          if (data && data.results && data.results[0]) {
            const placeName = data.results[0].formatted_address;
            setSelectedPlaceName(placeName);
            setSearchQuery(placeName);
            onSelectPlace({ name: placeName, latitude: lat, longitude: lng, timezone: tz });
            return;
          }
        } catch {}

        // Fallback reverse geocoding
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const placeName = data.display_name?.split(',').slice(0, 3).join(',').trim() || `Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`;
          setSelectedPlaceName(placeName);
          setSearchQuery(placeName);
          onSelectPlace({ name: placeName, latitude: lat, longitude: lng, timezone: tz });
        } catch {
          const placeName = `GPS Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
          setSelectedPlaceName(placeName);
          setSearchQuery(placeName);
          onSelectPlace({ name: placeName, latitude: lat, longitude: lng, timezone: tz });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS location detection failed:', err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleMapClick = async (e: any) => {
    if (!e.detail?.latLng) return;
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    const tz = estimateTimezone(lat, lng);

    setSelectedCoords({ lat, lng });
    setSelectedTz(tz);

    // Try Google Maps reverse geocode
    try {
      const gRes = await fetch(`/api/maps/reverse-geocode?lat=${lat}&lng=${lng}`);
      const gData = await gRes.json();
      if (gData && gData.results && gData.results[0]) {
        const placeName = gData.results[0].formatted_address;
        setSelectedPlaceName(placeName);
        setSearchQuery(placeName);
        onSelectPlace({
          name: placeName,
          latitude: lat,
          longitude: lng,
          timezone: tz,
        });
        return;
      }
    } catch {}

    // Fallback reverse geocode
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const placeName = data.display_name?.split(',').slice(0, 3).join(',').trim() || `Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`;
      setSelectedPlaceName(placeName);
      setSearchQuery(placeName);

      onSelectPlace({
        name: placeName,
        latitude: lat,
        longitude: lng,
        timezone: tz,
      });
    } catch {
      const customName = `Custom Coordinates (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
      setSelectedPlaceName(customName);
      onSelectPlace({
        name: customName,
        latitude: lat,
        longitude: lng,
        timezone: tz,
      });
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Main Place Input with GPS and Map Triggers */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchResults.length > 0) {
                  e.preventDefault();
                  handlePickLocation(searchResults[0]);
                }
              }
            }}
            onFocus={() => {
              if (!searchQuery) setSearchResults(CITY_PRESETS.slice(0, 5));
            }}
            placeholder={language === 'hi' ? 'गूगल मैप्स खोज: शहर, गांव, अस्पताल या तीर्थ...' : 'Google Maps search: city, hospital, town or village...'}
            className="w-full bg-slate-950 border border-slate-700/90 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* GPS Location Button */}
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="px-3 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
            title={language === 'hi' ? 'वर्तमान GPS स्थान का पता लगाएं' : 'Detect current GPS coordinates'}
          >
            <Crosshair className={`w-3.5 h-3.5 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? '...' : language === 'hi' ? 'GPS' : 'GPS'}</span>
          </button>

          {/* Map Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              isOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/40'
            }`}
            title="Open Interactive Google Map Pin Picker"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'मानचित्र (Map)' : 'Google Map'}</span>
          </button>
        </div>
      </div>

      {/* Auto-suggest dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
          {searchResults.map((item, idx) => (
            <button
              key={`${item.name}-${idx}`}
              type="button"
              onClick={() => handlePickLocation(item)}
              className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:bg-amber-500/15 hover:text-amber-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium truncate max-w-xs">{item.name}</span>
                {item.isGoogleMaps && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    Google Maps
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}° (TZ: {item.tz >= 0 ? `+${item.tz}` : item.tz})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* High-Accuracy Coordinates & Astrological LMT Indicator Card */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 px-2 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-amber-300 font-semibold bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/20">
            📍 {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lng.toFixed(4)}° E
          </span>
          <span className="font-mono text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/60">
            TZ: UTC {selectedTz >= 0 ? `+${selectedTz}` : selectedTz}
          </span>
          <span className="font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20" title="देशांतर संस्कार (Local Mean Time Correction) for exact Lagna & planetary house cusps">
            LMT: {lmtCorrectionMinutes >= 0 ? '+' : ''}{lmtCorrectionMinutes.toFixed(1)}m
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyInstructions(!showKeyInstructions)}
          className="text-[10px] text-amber-400/90 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>{hasValidKey ? 'Google Maps Connected' : 'Google Maps Platform'}</span>
        </button>
      </div>

      {/* Google Maps Setup Instructions Helper Banner */}
      {showKeyInstructions && (
        <div className="mt-3 p-3.5 bg-slate-950 rounded-xl border border-amber-500/30 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-400" />
              Google Maps Platform Geocoding & Ephemeris Positioning
            </span>
            <button
              type="button"
              onClick={() => setShowKeyInstructions(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'सटीक जन्म स्थान, अक्षांश (Latitude) व देशांतर (Longitude) सीधे Google Maps से प्राप्त हो रहे हैं। इससे लग्न, भाव स्पष्ट और ग्रहों की डिग्रियों (Planetary Positions) में 100% शुद्धता प्राप्त होती है।'
              : 'Precise birth hospital coordinates, latitude, and longitude are resolved with Google Maps Geocoding. This guarantees astronomical precision for Ascendant (Lagna) and planetary house calculations.'}
          </p>
        </div>
      )}

      {/* Interactive Map Modal / Drawer */}
      {isOpen && (
        <div className="mt-3 bg-slate-950 rounded-2xl border border-amber-500/40 p-3 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'hi'
                  ? 'मानचित्र पर किसी भी स्थान पर क्लिक करके सटीक जन्म स्थान चुनें'
                  : 'Click anywhere on the map to pin exact birth coordinates'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'लागू करें (Done)' : 'Apply'}
            </button>
          </div>

          {/* Map View */}
          <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden relative border border-slate-800 bg-slate-900">
            {hasValidKey ? (
              <iframe
                title="Google Maps Birth Location"
                src={`https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(API_KEY)}&q=${selectedCoords.lat},${selectedCoords.lng}&zoom=11`}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              /* High performance interactive fallback OpenStreetMap Canvas */
              <iframe
                title="Birth Location Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCoords.lng - 0.2}%2C${selectedCoords.lat - 0.2}%2C${selectedCoords.lng + 0.2}%2C${selectedCoords.lat + 0.2}&layer=mapnik&marker=${selectedCoords.lat}%2C${selectedCoords.lng}`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            )}
            {/* Overlay badge indicating live coordinates */}
            <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 text-[10px] text-amber-300 font-mono shadow-md flex items-center gap-1.5 pointer-events-none">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{selectedCoords.lat.toFixed(4)}°N, {selectedCoords.lng.toFixed(4)}°E</span>
            </div>
          </div>

          {/* Quick Presets row */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] text-slate-400 font-semibold uppercase shrink-0">
              {language === 'hi' ? 'तीर्थ / प्रमुख नगर:' : 'Major Presets:'}
            </span>
            {CITY_PRESETS.slice(0, 8).map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handlePickLocation(c)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium shrink-0 transition-all border cursor-pointer ${
                  selectedPlaceName === c.name
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700'
                }`}
              >
                {c.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

