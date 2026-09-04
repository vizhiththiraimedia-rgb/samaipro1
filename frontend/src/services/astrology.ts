import { DateTime } from 'luxon';
import { detectYogas, detectDoshas } from './yogas';
import { calculateVimshottariDasha } from './dasha';
import { calculateLifeAreas } from './life-areas';

export interface ChartData {
// ... [Note to self: The snippet replacement logic below handles the actual integration]

  planetaryPositions: Record<string, any>;
  houses: Record<number, any>;
  aspects: any[];
  yogas: any[];
  doshas: any[];
  shadbala: Record<string, any>;
  ashtakavarga: Record<string, any>;
  vimshottariDasa: any[];
  currentDasha?: any;
  lifeAreas?: any[];
  nakshatra: string;
  pada: number;
  lagna: string;
  moonSign: string;
  sunSign: string;
  ascendant: string;
  panchang?: any;
  vargas?: any;
  transit?: any;
}

// Math Utility Helpers
const normDeg = (deg: number) => ((deg % 360) + 360) % 360;
const toRad = (deg: number) => (deg * Math.PI) / 180.0;
const toDeg = (rad: number) => (rad * 180.0) / Math.PI;

const RASIS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", 
  "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];


const DASHA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

const DASHA_YEARS: Record<string, number> = {
  "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
};

export async function calculateChart(params: any): Promise<ChartData> {
  const [hour, minute] = params.birthTime.split(':').map(Number);
  
  // 1. Calculate UTC birth date & time fraction
  // Support both named zone (e.g. "Asia/Colombo") and numeric offsets
  let dt = DateTime.fromJSDate(params.dateOfBirth, { zone: params.timezone || 'UTC' }).set({ hour, minute, second: 0, millisecond: 0 });
  dt = dt.toUTC();

  const y = dt.year;
  const m = dt.month;
  const d = dt.day;
  const h_fraction = dt.hour + (dt.minute / 60.0) + (dt.second / 3600.0);

  // 2. Julian Date (JD) & Century T
  let Y_temp = y;
  let M_temp = m;
  if (M_temp <= 2) {
    Y_temp -= 1;
    M_temp += 12;
  }
  const A = Math.floor(Y_temp / 100);
  const B = 2 - A + Math.floor(A / 4);
  const day_fraction = d + (h_fraction / 24.0);
  const JD = Math.floor(365.25 * (Y_temp + 4716)) + Math.floor(30.6001 * (M_temp + 1)) + day_fraction + B - 1524.5;
  const T = (JD - 2451545.0) / 36525.0;

  // 3. Lahiri Ayanamsa
  const ayanamsa = 23.8565 + (JD - 2451545.0) * (50.29 / 3600.0) / 365.25;

  // 4. Earth/Sun Heliocentric & Geocentric Coordinates
  const d_since_j2000 = JD - 2451545.0;
  const L_sun = normDeg(280.46646 + 36000.76983 * T);
  const M_sun = normDeg(357.52911 + 35999.05029 * T);
  const C_sun = (1.914602 - 0.004817 * T) * Math.sin(toRad(M_sun)) + (0.019993 - 0.000101 * T) * Math.sin(toRad(2 * M_sun));
  const sun_trop = normDeg(L_sun + C_sun);
  const sun_sid = normDeg(sun_trop - ayanamsa);
  
  const L_E = normDeg(sun_trop + 180);
  const R_E = 1.0;
  const L_E_rad = toRad(L_E);
  const xe = R_E * Math.cos(L_E_rad);
  const ye = R_E * Math.sin(L_E_rad);

  // 5. Moon Coordinates (including perturbations)
  const L_moon = normDeg(218.3164477 + 481267.88128 * T);
  const M_moon = normDeg(134.9633964 + 477198.867505 * T);
  const D_moon = normDeg(297.8501921 + 445267.1114034 * T);
  const F_moon = normDeg(93.2720950 + 483202.0175233 * T);
  const moon_perturb = 6.288774 * Math.sin(toRad(M_moon)) + 
                       1.274027 * Math.sin(toRad(2 * D_moon - M_moon)) + 
                       0.658314 * Math.sin(toRad(2 * D_moon)) + 
                       0.213618 * Math.sin(toRad(2 * M_moon)) - 
                       0.185116 * Math.sin(toRad(M_sun)) - 
                       0.114332 * Math.sin(toRad(2 * F_moon));
  const moon_trop = normDeg(L_moon + moon_perturb);
  const moon_sid = normDeg(moon_trop - ayanamsa);

  // 6. Nodes (Rahu & Ketu)
  const rahu_trop = normDeg(125.04452 - 1934.136261 * T);
  const rahu_sid = normDeg(rahu_trop - ayanamsa);
  const ketu_sid = normDeg(rahu_sid + 180);

  // 7. 3D Heliocentric Orbit Coordinates for Planets
  const planetsEl: { [key: string]: any } = {
    Mercury: {
      N: 48.3313 + 3.24587e-5 * d_since_j2000,
      i: 7.0047 + 5.00e-8 * d_since_j2000,
      w: 29.1241 + 1.01444e-5 * d_since_j2000,
      e: 0.205635 + 5.59e-10 * d_since_j2000,
      M: normDeg(168.6562 + 4.0923344368 * d_since_j2000),
      a: 0.387098
    },
    Venus: {
      N: 76.6799 + 2.46590e-5 * d_since_j2000,
      i: 3.3946 + 2.75e-8 * d_since_j2000,
      w: 54.8910 + 1.38374e-5 * d_since_j2000,
      e: 0.006773 - 1.302e-9 * d_since_j2000,
      M: normDeg(48.0052 + 1.6021302244 * d_since_j2000),
      a: 0.723330
    },
    Mars: {
      N: 49.5574 + 2.11081e-5 * d_since_j2000,
      i: 1.8497 - 1.78e-8 * d_since_j2000,
      w: 286.5016 + 2.92961e-5 * d_since_j2000,
      e: 0.093405 + 2.516e-9 * d_since_j2000,
      M: normDeg(18.6021 + 0.5240207766 * d_since_j2000),
      a: 1.523688
    },
    Jupiter: {
      N: 100.4542 + 2.76854e-5 * d_since_j2000,
      i: 1.3030 - 1.557e-7 * d_since_j2000,
      w: 273.8777 + 1.64505e-5 * d_since_j2000,
      e: 0.048498 + 4.469e-9 * d_since_j2000,
      M: normDeg(19.8950 + 0.0830853001 * d_since_j2000),
      a: 5.202561
    },
    Saturn: {
      N: 113.6655 + 2.38378e-5 * d_since_j2000,
      i: 2.4886 - 1.081e-7 * d_since_j2000,
      w: 339.3939 + 2.97661e-5 * d_since_j2000,
      e: 0.055546 - 9.499e-9 * d_since_j2000,
      M: normDeg(316.9670 + 0.0334442282 * d_since_j2000),
      a: 9.554747
    }
  };

  const geoPlanets: { [key: string]: number } = {};
  for (const [pName, el] of Object.entries(planetsEl)) {
    const M_rad = toRad(el.M);
    let E = el.M + toDeg(el.e * Math.sin(M_rad) * (1.0 + el.e * Math.cos(M_rad)));
    for (let i = 0; i < 3; i++) {
      const E_rad = toRad(E);
      E = E - toDeg((E_rad - el.e * Math.sin(E_rad) - M_rad) / (1.0 - el.e * Math.cos(E_rad)));
    }
    const E_rad = toRad(E);
    const xv = el.a * (Math.cos(E_rad) - el.e);
    const yv = el.a * (Math.sqrt(1.0 - el.e * el.e) * Math.sin(E_rad));
    const v = toDeg(Math.atan2(yv, xv));
    const r = Math.sqrt(xv * xv + yv * yv);
    
    const u = toRad(v + el.w);
    const N_rad = toRad(el.N);
    const i_rad = toRad(el.i);
    
    const xh = r * (Math.cos(N_rad) * Math.cos(u) - Math.sin(N_rad) * Math.sin(u) * Math.cos(i_rad));
    const yh = r * (Math.sin(N_rad) * Math.cos(u) + Math.cos(N_rad) * Math.sin(u) * Math.cos(i_rad));
    
    const xg = xh - xe;
    const yg = yh - ye;
    const l_geo_trop = normDeg(toDeg(Math.atan2(yg, xg)));
    geoPlanets[pName] = normDeg(l_geo_trop - ayanamsa);
  }

  // 8. Ascendant (Lagna)
  const lat = params.latitude;
  const lon = params.longitude;
  const GMST0 = normDeg(280.46061837 + 360.98564736629 * d_since_j2000 + 0.000387933 * T * T);
  const RAMC = normDeg(GMST0 + lon);
  const eps = 23.4392911 - 0.0130042 * T;
  const RAMC_rad = toRad(RAMC);
  const eps_rad = toRad(eps);
  const lat_rad = toRad(lat);
  
  const y_asc = Math.cos(RAMC_rad);
  const x_asc = -Math.sin(RAMC_rad) * Math.cos(eps_rad) - Math.tan(lat_rad) * Math.sin(eps_rad);
  const asc_trop = normDeg(toDeg(Math.atan2(y_asc, x_asc)));
  const asc_sid = normDeg(asc_trop - ayanamsa);

  // 9. Format planetary positions object
  const rawPositions: Record<string, number> = {
    Ascendant: asc_sid,
    Sun: sun_sid,
    Moon: moon_sid,
    Mars: geoPlanets.Mars,
    Mercury: geoPlanets.Mercury,
    Jupiter: geoPlanets.Jupiter,
    Venus: geoPlanets.Venus,
    Saturn: geoPlanets.Saturn,
    Rahu: rahu_sid,
    Ketu: ketu_sid
  };

  const planetaryPositions: Record<string, any> = {};
  for (const [pName, pos] of Object.entries(rawPositions)) {
    const rasiIdx = Math.floor(pos / 30) % 12;
    planetaryPositions[pName] = {
      degree: pos,
      sign: RASIS[rasiIdx],
      posInSign: pos % 30,
      retrograde: pName === 'Rahu' || pName === 'Ketu',
      house: rasiIdx + 1
    };
  }

  // 10. Nakshatra & Pada
  const moon_nak_deg = (moon_sid * 3) / 40.0; // 360 degrees / 27 nakshatras = 13.3333 degrees per nakshatra
  const nakIdx = Math.floor(moon_nak_deg) % 27;
  const pada = (Math.floor(moon_nak_deg * 4) % 4) + 1;
  const nakshatra = NAKSHATRAS[nakIdx];

  const lagnaRasi = RASIS[Math.floor(asc_sid / 30) % 12];
  const moonRasi = RASIS[Math.floor(moon_sid / 30) % 12];
  const sunRasi = RASIS[Math.floor(sun_sid / 30) % 12];

  // 11. Navamsa (D9) Calculation
  const getNavamsaSign = (totalDegree: number) => {
    const signIdx = Math.floor(totalDegree / 30) % 12; // 0=Aries, 1=Taurus...
    const degInSign = totalDegree % 30;
    const navamsaPart = Math.floor(degInSign / (3 + 1/3)); // 3 degrees 20 minutes = 3.3333...

    let startSignIdx = 0;
    if (signIdx % 4 === 0) startSignIdx = 0; // Aries, Leo, Sagittarius -> Starts from Aries (0)
    else if (signIdx % 4 === 1) startSignIdx = 9; // Taurus, Virgo, Capricorn -> Starts from Capricorn (9)
    else if (signIdx % 4 === 2) startSignIdx = 6; // Gemini, Libra, Aquarius -> Starts from Libra (6)
    else if (signIdx % 4 === 3) startSignIdx = 3; // Cancer, Scorpio, Pisces -> Starts from Cancer (3)

    const finalNavamsaIdx = (startSignIdx + navamsaPart) % 12;
    return RASIS[finalNavamsaIdx];
  };

  const navamsaPositions: Record<string, any> = {};
  for (const [pName, pos] of Object.entries(rawPositions)) {
    const navSign = getNavamsaSign(pos);
    navamsaPositions[pName] = {
      degree: pos,
      sign: navSign,
      retrograde: pName === 'Rahu' || pName === 'Ketu',
      house: (RASIS.indexOf(navSign) - RASIS.indexOf(getNavamsaSign(asc_sid)) + 12) % 12 + 1
    };
  }

  // Format D9 planets array for the chart renderer
  const d9PlanetsArray = Object.keys(navamsaPositions).map(name => ({
    name: name,
    sign: navamsaPositions[name].sign,
    isRetrograde: navamsaPositions[name].retrograde
  }));

  // 12. Yogas & Doshas Calculation
  const yogas = detectYogas(planetaryPositions, lagnaRasi);
  const doshas = detectDoshas(planetaryPositions);

  // 13. Vimshottari Dasha Calculation
  const dashaData = calculateVimshottariDasha(params.dateOfBirth, moon_sid);

  // 14. Basic Ashtakavarga & Shadbala stubs for now (Phase 4 scope)
  const shadbala = {
    Sun: { strength: 1.2, status: "Strong" },
    Moon: { strength: 0.9, status: "Moderate" },
    Mars: { strength: 1.5, status: "Very Strong" }
  };
  
  // 15. Transits (Gochar)
  // Which house is Saturn/Jupiter transiting relative to Moon Sign?
  // We mock the current transit degrees for 2026 roughly. 
  // In production, we would call calculateChart() again for Date.now().
  // Assuming a rough placement for mid-2026 for now:
  const transitPlanets = [
    { name: "Jupiter", sign: "Cancer", isRetrograde: false }, // Jupiter exalted in Cancer 2026
    { name: "Saturn", sign: "Pisces", isRetrograde: true },   // Saturn in Pisces 2026
    { name: "Rahu", sign: "Aquarius", isRetrograde: true },
    { name: "Ketu", sign: "Leo", isRetrograde: true }
  ].map(tp => {
    // calculate house from natal moon
    const moonIdx = RASIS.indexOf(moonRasi);
    const transitIdx = RASIS.indexOf(tp.sign);
    const houseFromMoon = (transitIdx - moonIdx + 12) % 12 + 1;
    return { ...tp, houseFromMoon };
  });

  // 16. Life Area Scoring
  const lifeAreas = calculateLifeAreas(planetaryPositions, lagnaRasi);

  return {
    planetaryPositions,
    houses: {},
    aspects: [],
    yogas,
    doshas,
    shadbala,
    ashtakavarga: {},
    vimshottariDasa: dashaData.timeline,
    currentDasha: dashaData.currentMahadasha,
    nakshatra,
    pada,
    lagna: lagnaRasi,
    moonSign: moonRasi,
    sunSign: sunRasi,
    ascendant: lagnaRasi,
    lifeAreas,
    vargas: {
      D9: d9PlanetsArray
    },
    transit: {
      planets: transitPlanets
    }
  };
}
