import { calculateVarga } from "@node-jhora/core";

const ZODIAC_SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];

const SIGN_LORDS: Record<number, string> = {
  1: "Mars", 2: "Venus", 3: "Mercury", 4: "Moon",
  5: "Sun", 6: "Mercury", 7: "Venus", 8: "Mars",
  9: "Jupiter", 10: "Saturn", 11: "Saturn", 12: "Jupiter"
};

function getHouseSign(ascendantSign: number, house: number) {
  let sign = ascendantSign + house - 1;
  while (sign > 12) sign -= 12;
  return sign;
}

function getSignDistance(fromSign: number, toSign: number) {
  let dist = toSign - fromSign + 1;
  if (dist <= 0) dist += 12;
  return dist;
}

export function calculateArudhaPadas(planetaryPositions: Record<string, any>) {
  const padas: Record<string, { sign: number, signName: string }> = {};
  
  const asc = planetaryPositions["Ascendant"] || planetaryPositions["Lagna"] || planetaryPositions["Asc"];
  if (!asc || typeof (asc.longitude ?? asc.degree) !== 'number') return padas;
  
  const ascVarga = calculateVarga((asc.longitude ?? asc.degree), 1);
  const ascSign = ascVarga.sign;

  const planetSigns: Record<string, number> = {};
  for (const [name, data] of Object.entries(planetaryPositions)) {
    if (typeof ((data as any)?.longitude ?? (data as any)?.degree) === 'number') {
      planetSigns[name] = calculateVarga(((data as any).longitude ?? (data as any).degree), 1).sign;
    }
  }

  for (let house = 1; house <= 12; house++) {
    const houseSign = getHouseSign(ascSign, house);
    const lord = SIGN_LORDS[houseSign];
    
    const lordSign = planetSigns[lord];
    if (!lordSign) continue;

    const distance = getSignDistance(houseSign, lordSign);
    
    let arudhaSign = lordSign + distance - 1;
    while (arudhaSign > 12) arudhaSign -= 12;

    if (arudhaSign === houseSign) {
      arudhaSign = houseSign + 9;
      while (arudhaSign > 12) arudhaSign -= 12;
    }
    else if (arudhaSign === getHouseSign(houseSign, 7)) {
      arudhaSign = houseSign + 3;
      while (arudhaSign > 12) arudhaSign -= 12;
    }

    const key = house === 12 ? "UL" : "A" + house;
    padas[key] = { sign: arudhaSign, signName: ZODIAC_SIGNS[arudhaSign - 1] };
  }

  return padas;
}


