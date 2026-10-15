export type BuildingFootprint = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
};

export type SkylineOptions = {
  seed: number;
  columns: number;
  rows: number;
  spacingX: number;
  spacingZ: number;
  minHeight: number;
  maxHeight: number;
  gapChance: number;
};

const LCG_MULTIPLIER = 16_807;
const LCG_MODULUS = 2_147_483_647;

/**
 * Creates a deterministic pseudo-random generator (Park-Miller).
 * The skyline is built once per page load, so the same seed has to produce the
 * same city every time rather than a layout that shifts between renders.
 * @param seed - Starting state; any value maps into the generator's range.
 * @returns A function returning the next value in `[0, 1)`.
 */
export function createRandom(seed: number): () => number {
  let state = Math.floor(Math.abs(seed)) % LCG_MODULUS || 1;

  return () => {
    state = (state * LCG_MULTIPLIER) % LCG_MODULUS;

    return state / LCG_MODULUS;
  };
}

/**
 * Lays out a skyline as a jittered grid of building footprints.
 * Towers grow toward the middle columns and the far rows so the silhouette
 * reads as a downtown core seen from its edge instead of an even field of boxes.
 * @param options - Grid size, spacing, height range and the odds of an empty cell.
 * @returns One footprint per filled cell, in world units, with `x`/`z` centred on the grid.
 */
export function createSkyline(options: SkylineOptions): BuildingFootprint[] {
  const random = createRandom(options.seed);
  const buildings: BuildingFootprint[] = [];
  const halfColumns = Math.max((options.columns - 1) / 2, 1);
  const heightRange = options.maxHeight - options.minHeight;

  for (let row = 0; row < options.rows; row += 1) {
    for (let column = 0; column < options.columns; column += 1) {
      // Drawn first so a skipped cell still advances the sequence by one step.
      const gapRoll = random();
      const jitterX = (random() - 0.5) * options.spacingX * 0.45;
      const jitterZ = (random() - 0.5) * options.spacingZ * 0.4;
      const heightRoll = random() ** 1.7;
      const width = options.spacingX * (0.42 + random() * 0.3);
      const depth = options.spacingZ * (0.42 + random() * 0.3);

      if (gapRoll < options.gapChance) {
        continue;
      }

      const distanceFromCore = Math.abs(column - halfColumns) / halfColumns;
      const coreBoost = 1 - distanceFromCore * 0.65;
      const depthBoost = 0.55 + (row / options.rows) * 0.45;

      buildings.push({
        x: (column - halfColumns) * options.spacingX + jitterX,
        z: -row * options.spacingZ + jitterZ,
        width,
        depth,
        height: options.minHeight + heightRange * heightRoll * coreBoost * depthBoost,
      });
    }
  }

  return buildings;
}
