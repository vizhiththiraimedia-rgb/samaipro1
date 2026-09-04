import { DateTime } from 'luxon';

const DASHA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

const DASHA_YEARS: Record<string, number> = {
  "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
};

export function calculateVimshottariDasha(birthDate: Date, moonSiderealDegree: number) {
  // 1 Nakshatra = 13.3333 degrees = 13 degrees 20 minutes
  const nakshatraExtent = 13 + 1/3;
  const nakshatraPassed = moonSiderealDegree / nakshatraExtent;
  const nakIdx = Math.floor(nakshatraPassed) % 27;
  const fractionPassed = nakshatraPassed % 1;
  const fractionRemaining = 1 - fractionPassed;

  const firstDashaLordIdx = nakIdx % 9;
  const firstDashaLord = DASHA_LORDS[firstDashaLordIdx];
  const firstDashaDuration = DASHA_YEARS[firstDashaLord];
  const firstDashaRemaining = fractionRemaining * firstDashaDuration;

  const dashas: any[] = [];
  
  let currentStartDate = DateTime.fromJSDate(birthDate);
  let currentEndDate = currentStartDate.plus({ days: firstDashaRemaining * 365.25 });

  // Add the first (balance) dasha
  dashas.push({
    lord: firstDashaLord,
    startDate: currentStartDate.toISODate(),
    endDate: currentEndDate.toISODate(),
    durationYears: firstDashaRemaining,
    isBalance: true
  });

  // Calculate the next dashas to complete 120 years
  let currentLordIdx = (firstDashaLordIdx + 1) % 9;
  
  // typically calculate for 120 years (9 dashas minimum)
  for (let i = 1; i < 9; i++) {
    const lord = DASHA_LORDS[currentLordIdx];
    const duration = DASHA_YEARS[lord];
    
    currentStartDate = currentEndDate;
    currentEndDate = currentStartDate.plus({ days: duration * 365.25 });
    
    dashas.push({
      lord: lord,
      startDate: currentStartDate.toISODate(),
      endDate: currentEndDate.toISODate(),
      durationYears: duration,
      isBalance: false
    });

    currentLordIdx = (currentLordIdx + 1) % 9;
  }

  // To support Antardashas (sub-periods), we can calculate them for the currently active Mahadasha
  const now = DateTime.now();
  let currentMahadasha = null;

  for (const d of dashas) {
    if (now >= DateTime.fromISO(d.startDate) && now <= DateTime.fromISO(d.endDate)) {
      currentMahadasha = d;
      break;
    }
  }

  return {
    timeline: dashas,
    currentMahadasha
  };
}
