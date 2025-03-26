// Fish configurations with their properties
export const FISH_TYPES = [
  {
    id: "common",
    name: "Com. Fish",
    color: 0x98fb98, // Light green
    strength: 1,
    scoreValue: 100,
    size: { width: 60, height: 30 },
    scale: 0.8,
    spawnChance: 0.4, // 40% chance
    speedRange: { min: 100, max: 150 },
  },
  {
    id: "uncommon",
    name: "Unc. Fish",
    color: 0x87ceeb, // Sky blue
    strength: 2,
    scoreValue: 250,
    size: { width: 65, height: 35 },
    scale: 1.0,
    spawnChance: 0.3, // 30% chance
    speedRange: { min: 120, max: 170 },
  },
  {
    id: "rare",
    name: "Rare Fish",
    color: 0xdda0dd, // Plum
    strength: 3,
    scoreValue: 500,
    size: { width: 70, height: 40 },
    scale: 1.2,
    spawnChance: 0.15, // 15% chance
    speedRange: { min: 140, max: 190 },
  },
  {
    id: "epic",
    name: "Epic Fish",
    color: 0xffa500, // Orange
    strength: 4,
    scoreValue: 1000,
    size: { width: 75, height: 45 },
    scale: 1.4,
    spawnChance: 0.1, // 10% chance
    speedRange: { min: 160, max: 210 },
  },
  {
    id: "legendary",
    name: "Leg. Fish",
    color: 0xff4500, // Red-orange
    strength: 5,
    scoreValue: 2000,
    size: { width: 80, height: 50 },
    scale: 1.6,
    spawnChance: 0.05, // 5% chance
    speedRange: { min: 180, max: 230 },
  },
];
