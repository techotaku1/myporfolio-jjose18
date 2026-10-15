import { describe, expect, it } from 'vitest';
import {
  formatCount,
  indexToProgress,
  parseCountTarget,
  progressToIndex,
  tabIndexForKey,
} from './motion';

describe('motion', () => {
  describe(parseCountTarget, () => {
    it('reads the number and keeps a trailing suffix', () => {
      expect(parseCountTarget('92%')).toStrictEqual({ value: 92, suffix: '%', pad: 0 });
    });

    it('records zero padding when the number has a leading zero', () => {
      expect(parseCountTarget('03')).toStrictEqual({ value: 3, suffix: '', pad: 2 });
    });

    it('ignores surrounding whitespace', () => {
      expect(parseCountTarget('  78% ')).toStrictEqual({ value: 78, suffix: '%', pad: 0 });
    });

    it('returns null for text without a leading number', () => {
      expect(parseCountTarget('NORMAL')).toBeNull();
      expect(parseCountTarget('')).toBeNull();
    });
  });

  describe(formatCount, () => {
    it('rounds the current value and appends the suffix', () => {
      expect(formatCount(41.6, { value: 92, suffix: '%', pad: 0 })).toBe('42%');
    });

    it('pads the current value to the target width', () => {
      expect(formatCount(1, { value: 3, suffix: '', pad: 2 })).toBe('01');
    });

    it('rebuilds the original text at the target value', () => {
      for (const text of ['92%', '78%', '96%', '03']) {
        const target = parseCountTarget(text);

        expect(target).not.toBeNull();
        expect(target && formatCount(target.value, target)).toBe(text);
      }
    });
  });

  describe(progressToIndex, () => {
    it('splits the progress into evenly spaced segments', () => {
      expect(progressToIndex(0, 6)).toBe(0);
      expect(progressToIndex(0.17, 6)).toBe(1);
      expect(progressToIndex(0.5, 6)).toBe(3);
      expect(progressToIndex(0.99, 6)).toBe(5);
    });

    it('keeps the last segment active at full progress', () => {
      expect(progressToIndex(1, 6)).toBe(5);
    });

    it('clamps progress outside the zero to one range', () => {
      expect(progressToIndex(-0.2, 6)).toBe(0);
      expect(progressToIndex(1.4, 6)).toBe(5);
    });

    it('returns zero when there are no segments', () => {
      expect(progressToIndex(0.5, 0)).toBe(0);
    });
  });

  describe(indexToProgress, () => {
    it('points at the middle of the segment', () => {
      expect(indexToProgress(0, 4)).toBe(0.125);
      expect(indexToProgress(3, 4)).toBe(0.875);
    });

    it('clamps indexes outside the list', () => {
      expect(indexToProgress(-1, 4)).toBe(0.125);
      expect(indexToProgress(9, 4)).toBe(0.875);
    });

    it('maps back to the same index', () => {
      for (let index = 0; index < 6; index += 1) {
        expect(progressToIndex(indexToProgress(index, 6), 6)).toBe(index);
      }
    });
  });

  describe(tabIndexForKey, () => {
    it('moves to the next and previous tab with the arrow keys', () => {
      expect(tabIndexForKey('ArrowDown', 2, 6)).toBe(3);
      expect(tabIndexForKey('ArrowRight', 2, 6)).toBe(3);
      expect(tabIndexForKey('ArrowUp', 2, 6)).toBe(1);
      expect(tabIndexForKey('ArrowLeft', 2, 6)).toBe(1);
    });

    it('wraps around at both ends of the list', () => {
      expect(tabIndexForKey('ArrowDown', 5, 6)).toBe(0);
      expect(tabIndexForKey('ArrowUp', 0, 6)).toBe(5);
    });

    it('jumps to the first and last tab with Home and End', () => {
      expect(tabIndexForKey('Home', 3, 6)).toBe(0);
      expect(tabIndexForKey('End', 3, 6)).toBe(5);
    });

    it('returns null for keys the tab list does not use', () => {
      expect(tabIndexForKey('Enter', 3, 6)).toBeNull();
      expect(tabIndexForKey('a', 3, 6)).toBeNull();
    });
  });
});
