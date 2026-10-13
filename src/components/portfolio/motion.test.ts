import { describe, expect, it } from 'vitest';
import { formatCount, parseCountTarget } from './motion';

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
});
