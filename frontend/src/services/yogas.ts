export function detectYogas(planetaryPositions: Record<string, any>, lagnaSign: string) {
  const yogas: any[] = [];
  const planetsArray = Object.keys(planetaryPositions).map(k => ({ name: k, ...planetaryPositions[k] }));

  // Helper to find planet by name
  const getPlanet = (name: string) => planetaryPositions[name];
  
  // Helper to check if a house is a Kendra (1, 4, 7, 10)
  const isKendra = (house: number) => [1, 4, 7, 10].includes(house);

  const sun = getPlanet("Sun");
  const moon = getPlanet("Moon");
  const mars = getPlanet("Mars");
  const mercury = getPlanet("Mercury");
  const jupiter = getPlanet("Jupiter");
  const venus = getPlanet("Venus");
  const saturn = getPlanet("Saturn");

  // 1. Pancha Mahapurusha Yogas
  
  // Ruchaka (Mars)
  if (mars && isKendra(mars.house) && ["Aries", "Scorpio", "Capricorn"].includes(mars.sign)) {
    yogas.push({
      name: "Ruchaka Yoga",
      description: "Mars is in a Kendra and in its own or exaltation sign.",
      effects: "Courage, leadership, physical strength, success in competitive fields."
    });
  }

  // Bhadra (Mercury)
  if (mercury && isKendra(mercury.house) && ["Gemini", "Virgo"].includes(mercury.sign)) {
    yogas.push({
      name: "Bhadra Yoga",
      description: "Mercury is in a Kendra and in its own or exaltation sign.",
      effects: "High intellect, excellent communication skills, business acumen, scholarly nature."
    });
  }

  // Hamsa (Jupiter)
  if (jupiter && isKendra(jupiter.house) && ["Sagittarius", "Pisces", "Cancer"].includes(jupiter.sign)) {
    yogas.push({
      name: "Hamsa Yoga",
      description: "Jupiter is in a Kendra and in its own or exaltation sign.",
      effects: "Wisdom, pure heart, religious nature, respect in society, good fortune."
    });
  }

  // Malavya (Venus)
  if (venus && isKendra(venus.house) && ["Taurus", "Libra", "Pisces"].includes(venus.sign)) {
    yogas.push({
      name: "Malavya Yoga",
      description: "Venus is in a Kendra and in its own or exaltation sign.",
      effects: "Beauty, artistic talents, luxury, happy marriage, material comforts."
    });
  }

  // Sasa (Saturn)
  if (saturn && isKendra(saturn.house) && ["Capricorn", "Aquarius", "Libra"].includes(saturn.sign)) {
    yogas.push({
      name: "Sasa Yoga",
      description: "Saturn is in a Kendra and in its own or exaltation sign.",
      effects: "Authority, discipline, political success, leadership over masses, longevity."
    });
  }

  // 2. Gaja Kesari Yoga (Jupiter in Kendra from Moon)
  if (jupiter && moon) {
    const jupiterHouseFromMoon = (jupiter.house - moon.house + 12) % 12 + 1;
    if (isKendra(jupiterHouseFromMoon)) {
      yogas.push({
        name: "Gaja Kesari Yoga",
        description: "Jupiter is in a Kendra (1, 4, 7, 10) from the Moon.",
        effects: "Intelligence, good moral character, lasting wealth, reputation, and authority."
      });
    }
  }

  // 3. Budha Aditya Yoga (Sun and Mercury conjunct)
  if (sun && mercury && sun.sign === mercury.sign) {
    yogas.push({
      name: "Budha Aditya Yoga",
      description: "Sun and Mercury are in the same sign.",
      effects: "Intelligence, skill in communication and commerce, academic success."
    });
  }

  // 4. Chandra Mangala Yoga (Moon and Mars conjunct)
  if (moon && mars && moon.sign === mars.sign) {
    yogas.push({
      name: "Chandra Mangala Yoga",
      description: "Moon and Mars are in the same sign.",
      effects: "Determination, resourcefulness in making money, but can cause emotional volatility."
    });
  }

  return yogas;
}

export function detectDoshas(planetaryPositions: Record<string, any>) {
  const doshas: any[] = [];
  
  const getPlanet = (name: string) => planetaryPositions[name];
  
  const mars = getPlanet("Mars");
  const rahu = getPlanet("Rahu");
  const ketu = getPlanet("Ketu");

  // 1. Manglik / Kuja Dosha
  // Mars in 1st, 4th, 7th, 8th, or 12th house from Lagna
  if (mars && [1, 4, 7, 8, 12].includes(mars.house)) {
    doshas.push({
      name: "Manglik Dosha (Kuja Dosha)",
      description: `Mars is placed in House ${mars.house}.`,
      effects: "Traditional Jyotisha interpretations associate this combination with intense relationship dynamics. It is often recommended to seek compatibility with another Manglik profile.",
      detected: true
    });
  }

  // 2. Kala Sarpa Dosha Check
  if (rahu && ketu) {
    const rahuDeg = rahu.degree;
    
    const normalize = (deg: number) => (deg - rahuDeg + 360) % 360;
    
    const planetsToCheck = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    
    let side1Count = 0;
    let side2Count = 0;

    planetsToCheck.forEach(pName => {
      const p = getPlanet(pName);
      if (p) {
        const normDeg = normalize(p.degree);
        if (normDeg > 0 && normDeg < 180) side1Count++;
        else side2Count++;
      }
    });

    if (side1Count === 7 || side2Count === 7) {
      doshas.push({
        name: "Kala Sarpa Dosha",
        description: "All 7 major planets are hemmed between Rahu and Ketu.",
        effects: "Traditional Jyotisha views this as a period of extreme highs and lows in life. It often brings spiritual growth through challenging worldly experiences.",
        detected: true
      });
    }
  }

  return doshas;
}
