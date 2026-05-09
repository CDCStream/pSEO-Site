import { palworldPals, palworldPalsBySlug } from '@/data/palworld-pals';
import { findSpecialCombo } from '@/data/palworld-special-combos';

// Pals excluded from the closest-power numeric resolver. Bellanoir variants
// have BreedingPower 1 which is a sentinel for "summon-only / unbreedable",
// not a true low-power match, so we never let them surface as the offspring
// of a numeric pairing.
const NUMERIC_EXCLUDE_SLUGS = new Set([
  'bellanoir',
  'bellanoir-libero',
]);

const numericPool = palworldPals
  .filter((p) => !NUMERIC_EXCLUDE_SLUGS.has(p.slug))
  .slice()
  .sort((a, b) => {
    if (a.breedPower !== b.breedPower) return a.breedPower - b.breedPower;
    return a.name.localeCompare(b.name);
  });

export function averageBreedPower(a, b) {
  return Math.floor((a + b + 1) / 2);
}

export function getChild(slugA, slugB) {
  const a = palworldPalsBySlug[slugA];
  const b = palworldPalsBySlug[slugB];
  if (!a || !b) return null;

  // Layer 1: same species always returns itself (variant aware).
  if (a.slug === b.slug) {
    return {
      child: a,
      reason: 'same-species',
      avg: a.breedPower,
      distance: 0,
      parents: [a, b],
    };
  }

  // Layer 2: explicit special combo overrides.
  const special = findSpecialCombo(a.slug, b.slug);
  if (special) {
    const child = palworldPalsBySlug[special.child];
    if (child) {
      return {
        child,
        reason: 'special-combo',
        avg: averageBreedPower(a.breedPower, b.breedPower),
        distance: Math.abs(child.breedPower - averageBreedPower(a.breedPower, b.breedPower)),
        special,
        parents: [a, b],
      };
    }
  }

  // Layer 3: closest BreedingPower to the average.
  const avg = averageBreedPower(a.breedPower, b.breedPower);
  let best = null;
  let bestDistance = Infinity;
  for (const p of numericPool) {
    const d = Math.abs(p.breedPower - avg);
    if (d < bestDistance) {
      bestDistance = d;
      best = p;
    } else if (d === bestDistance && best) {
      if (p.name.localeCompare(best.name) < 0) {
        best = p;
      }
    }
  }

  return {
    child: best,
    reason: 'closest-power',
    avg,
    distance: bestDistance,
    parents: [a, b],
  };
}

export function searchPals(query, { elements = [], rarities = [] } = {}) {
  const q = (query || '').trim().toLowerCase();
  return palworldPals.filter((p) => {
    if (q) {
      const haystack = `${p.name} ${p.slug} ${p.elements.join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (elements.length) {
      const overlap = p.elements.some((e) => elements.includes(e));
      if (!overlap) return false;
    }
    if (rarities.length) {
      if (!rarities.includes(p.rarity)) return false;
    }
    return true;
  });
}

export function getPal(slug) {
  return palworldPalsBySlug[slug] || null;
}
