import { describe, expect, it } from 'vitest';
import type { SkylineOptions } from './cityGeometry';
import { createRandom, createSkyline } from './cityGeometry';

const OPTIONS: SkylineOptions = {
  seed: 1234,
  columns: 9,
  rows: 6,
  spacingX: 8,
  spacingZ: 10,
  minHeight: 4,
  maxHeight: 30,
  gapChance: 0,
};

describe('cityGeometry', () => {
  describe(createRandom, () => {
    it('repeats the same sequence for the same seed', () => {
      const first = createRandom(99);
      const second = createRandom(99);

      expect([first(), first(), first()]).toStrictEqual([second(), second(), second()]);
    });

    it('diverges for different seeds', () => {
      expect(createRandom(1)()).not.toBe(createRandom(2)());
    });

    it('stays inside the unit interval', () => {
      const random = createRandom(7);

      for (let draw = 0; draw < 200; draw += 1) {
        const value = random();

        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('keeps running when the seed is zero', () => {
      expect(createRandom(0)()).toBeGreaterThan(0);
    });
  });

  describe(createSkyline, () => {
    it('fills every grid cell when no gaps are drawn', () => {
      expect(createSkyline(OPTIONS)).toHaveLength(OPTIONS.columns * OPTIONS.rows);
    });

    it('leaves cells empty as the gap chance rises', () => {
      const gapped = createSkyline({ ...OPTIONS, gapChance: 0.5 });

      expect(gapped.length).toBeLessThan(OPTIONS.columns * OPTIONS.rows);
    });

    it('builds an identical city for the same seed', () => {
      expect(createSkyline(OPTIONS)).toStrictEqual(createSkyline(OPTIONS));
    });

    it('confines every height to the configured range', () => {
      for (const building of createSkyline(OPTIONS)) {
        expect(building.height).toBeGreaterThanOrEqual(OPTIONS.minHeight);
        expect(building.height).toBeLessThanOrEqual(OPTIONS.maxHeight);
      }
    });

    it('gives every footprint a positive width and depth', () => {
      for (const building of createSkyline(OPTIONS)) {
        expect(building.width).toBeGreaterThan(0);
        expect(building.depth).toBeGreaterThan(0);
      }
    });

    it('grows the city away from the camera along negative z', () => {
      const depths = createSkyline(OPTIONS).map((building) => building.z);

      expect(Math.max(...depths)).toBeLessThan(OPTIONS.spacingZ);
      expect(Math.min(...depths)).toBeLessThan(-OPTIONS.spacingZ * (OPTIONS.rows - 2));
    });

    it('centres the grid on the x axis', () => {
      const offsets = createSkyline(OPTIONS).map((building) => building.x);
      const span = (OPTIONS.columns * OPTIONS.spacingX) / 2;

      expect(Math.min(...offsets)).toBeGreaterThan(-span);
      expect(Math.max(...offsets)).toBeLessThan(span);
    });
  });
});
