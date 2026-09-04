export function calculateLifeAreas(planetaryPositions: Record<string, any>, lagnaSign: string) {
  // A foundational rule-engine for Life Area analysis.
  // In advanced Vedic astrology, this involves Shadbala, Ashtakavarga, D9, and house lord strength.
  // Here we use a simplified point system based on planetary dignity and house placements.

  const getPlanet = (name: string) => planetaryPositions[name];
  
  // Helper to find planets in a specific house
  const getPlanetsInHouse = (houseNum: number) => {
    return Object.keys(planetaryPositions)
      .map(k => ({ name: k, ...planetaryPositions[k] }))
      .filter(p => p.house === houseNum);
  };

  const calculateScore = (houses: number[], karakas: string[]) => {
    let score = 50; // Base score out of 100

    // 1. Evaluate Karakas (Significators)
    karakas.forEach(k => {
      const p = getPlanet(k);
      if (p) {
        // Exalted or Own sign boosts score
        if (p.name === "Jupiter" && ["Cancer", "Sagittarius", "Pisces"].includes(p.sign)) score += 15;
        if (p.name === "Venus" && ["Pisces", "Taurus", "Libra"].includes(p.sign)) score += 15;
        if (p.name === "Saturn" && ["Libra", "Capricorn", "Aquarius"].includes(p.sign)) score += 15;
        if (p.name === "Mars" && ["Capricorn", "Aries", "Scorpio"].includes(p.sign)) score += 15;
        if (p.name === "Mercury" && ["Virgo", "Gemini"].includes(p.sign)) score += 15;
        if (p.name === "Sun" && ["Aries", "Leo"].includes(p.sign)) score += 15;
        if (p.name === "Moon" && ["Taurus", "Cancer"].includes(p.sign)) score += 15;

        // Debilitated reduces score
        if (p.name === "Jupiter" && p.sign === "Capricorn") score -= 10;
        if (p.name === "Venus" && p.sign === "Virgo") score -= 10;
        if (p.name === "Saturn" && p.sign === "Aries") score -= 10;
        if (p.name === "Mars" && p.sign === "Cancer") score -= 10;
        if (p.name === "Mercury" && p.sign === "Pisces") score -= 10;
        if (p.name === "Sun" && p.sign === "Libra") score -= 10;
        if (p.name === "Moon" && p.sign === "Scorpio") score -= 10;
      }
    });

    // 2. Evaluate Houses
    houses.forEach(h => {
      const occupants = getPlanetsInHouse(h);
      occupants.forEach(occ => {
        if (["Jupiter", "Venus", "Moon", "Mercury"].includes(occ.name)) {
          score += 5; // Benefics in the house
        }
        if (["Saturn", "Mars", "Rahu", "Ketu", "Sun"].includes(occ.name)) {
          score -= 5; // Malefics in the house (general rule, exceptions exist)
        }
      });
    });

    // Clamp score between 10 and 95 for realistic representation
    return Math.max(10, Math.min(95, score));
  };

  const areas = [
    {
      id: "career",
      name: "Career & Profession",
      score: calculateScore([10], ["Saturn", "Sun", "Mercury"]),
      description: "Analysis of the 10th house of profession and Saturn as the karaka of work."
    },
    {
      id: "finance",
      name: "Wealth & Finance",
      score: calculateScore([2, 11], ["Jupiter", "Venus"]),
      description: "Analysis of the 2nd house of savings, 11th house of gains, and Jupiter."
    },
    {
      id: "marriage",
      name: "Marriage & Partnerships",
      score: calculateScore([7], ["Venus", "Jupiter"]),
      description: "Analysis of the 7th house of marriage and Venus (for men) / Jupiter (for women)."
    },
    {
      id: "education",
      name: "Education & Intellect",
      score: calculateScore([4, 5], ["Mercury", "Jupiter"]),
      description: "Analysis of the 4th house of basic education and 5th house of intellect."
    },
    {
      id: "health",
      name: "Health & Vitality",
      score: calculateScore([1, 6], ["Sun", "Mars"]),
      description: "Analysis of the Lagna (1st house) and 6th house of diseases."
    }
  ];

  return areas;
}
