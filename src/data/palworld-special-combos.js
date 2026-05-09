// Special breeding overrides observed in-game. These are checked BEFORE the
// closest-power numeric match. Order of parents does not matter; the lookup
// helper normalizes alphabetically.
//
// Format: { parents: [slugA, slugB], child: slug, note?: string }
// Slugs must match entries in src/data/palworld-pals.js.

export const palworldSpecialCombos = [
  { parents: ['frostallion', 'jetragon'], child: 'necromus' },
  { parents: ['frostallion', 'helzephyr'], child: 'frostallion-noct' },
  { parents: ['jetragon', 'frostallion-noct'], child: 'paladius' },
  { parents: ['jormuntide', 'suzaku'], child: 'suzaku-aqua' },
  { parents: ['jormuntide', 'pyrin'], child: 'jormuntide-ignis' },
  { parents: ['mau', 'pengullet'], child: 'mau-cryst' },
  { parents: ['vanwyrm', 'foxcicle'], child: 'vanwyrm-cryst' },
  { parents: ['eikthyrdeer', 'hangyu'], child: 'eikthyrdeer-terra' },
  { parents: ['elphidran', 'surfent'], child: 'elphidran-aqua' },
  { parents: ['pyrin', 'katress'], child: 'pyrin-noct' },
  { parents: ['mossanda', 'grizzbolt'], child: 'mossanda-lux' },
  { parents: ['relaxaurus', 'sparkit'], child: 'relaxaurus-lux' },
  { parents: ['kingpaca', 'reindrix'], child: 'kingpaca-cryst' },
  { parents: ['lyleen', 'menasting'], child: 'lyleen-noct' },
  { parents: ['leezpunk', 'flambelle'], child: 'leezpunk-ignis' },
  { parents: ['blazehowl', 'felbat'], child: 'blazehowl-noct' },
  { parents: ['robinquill', 'fuddler'], child: 'robinquill-terra' },
  { parents: ['broncherry', 'fuack'], child: 'broncherry-aqua' },
  { parents: ['surfent', 'dumud'], child: 'surfent-terra' },
  { parents: ['gobfin', 'rooby'], child: 'gobfin-ignis' },
  { parents: ['suzaku', 'jormuntide-ignis'], child: 'faleris' },
  { parents: ['ragnahawk', 'kitsun'], child: 'faleris', note: 'Alt route' },
  { parents: ['mossanda', 'rayhound'], child: 'grizzbolt' },
  { parents: ['dinossom', 'rayhound'], child: 'dinossom-lux' },
  { parents: ['mammorest', 'wumpo'], child: 'mammorest-cryst' },
  { parents: ['pengullet', 'cryolinx'], child: 'reptyro-cryst' },
  { parents: ['relaxaurus', 'lovander'], child: 'relaxaurus-lux', note: 'Alt route' },
  { parents: ['jolthog', 'pengullet'], child: 'jolthog-cryst' },
  { parents: ['kelpsea', 'flambelle'], child: 'kelpsea-ignis' },
  { parents: ['killamari', 'celaray'], child: 'killamari-primo' },
];

function normalizePair(a, b) {
  return [a, b].slice().sort();
}

const lookup = new Map();
for (const combo of palworldSpecialCombos) {
  const [a, b] = normalizePair(combo.parents[0], combo.parents[1]);
  lookup.set(`${a}|${b}`, combo);
}

export function findSpecialCombo(slugA, slugB) {
  const [a, b] = normalizePair(slugA, slugB);
  return lookup.get(`${a}|${b}`) || null;
}

export const specialComboCount = palworldSpecialCombos.length;
