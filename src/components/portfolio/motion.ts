export type CountTarget = {
  value: number;
  suffix: string;
  pad: number;
};

const LEADING_DIGITS = /^\d+/u;

/**
 * Parses a stat label such as `92%` or `03` into the number a count-up animates to.
 * @param text - Rendered label whose leading digits are the target value.
 * @returns The target value, the text after the digits, and the zero-padding width (0 when the label has no leading zero); `null` when the label does not start with a number.
 */
export function parseCountTarget(text: string): CountTarget | null {
  const label = text.trim();
  const digits = LEADING_DIGITS.exec(label)?.[0];

  if (!digits) {
    return null;
  }

  return {
    value: Number(digits),
    suffix: label.slice(digits.length),
    pad: digits.length > 1 && digits.startsWith('0') ? digits.length : 0,
  };
}

/**
 * Formats an in-between count-up value in the same shape as its target label.
 * @param current - Value reached by the animation so far.
 * @param target - Parsed label from `parseCountTarget`.
 * @returns The rounded value, zero-padded to the target width, followed by the target suffix.
 */
export function formatCount(current: number, target: CountTarget): string {
  return `${String(Math.round(current)).padStart(target.pad, '0')}${target.suffix}`;
}

/**
 * Maps a pinned section's scroll progress to the tab whose segment contains it.
 * @param progress - Scroll progress through the pinned range, from 0 to 1.
 * @param count - Number of tabs sharing the range in equal segments.
 * @returns Index of the active tab, clamped to the list; 0 when there are no tabs.
 */
export function progressToIndex(progress: number, count: number): number {
  if (count < 1) {
    return 0;
  }

  const clamped = Math.min(1, Math.max(0, progress));

  return Math.min(count - 1, Math.floor(clamped * count));
}

/**
 * Maps a tab to the scroll progress at the middle of its segment, so scrolling there activates it.
 * @param index - Tab to scroll to; clamped to the list.
 * @param count - Number of tabs sharing the range in equal segments.
 * @returns Scroll progress through the pinned range, from 0 to 1; 0 when there are no tabs.
 */
export function indexToProgress(index: number, count: number): number {
  if (count < 1) {
    return 0;
  }

  const clamped = Math.min(count - 1, Math.max(0, index));

  return (clamped + 0.5) / count;
}

/**
 * Resolves the tab a key press moves focus to in a tab list, wrapping at both ends.
 * @param key - `KeyboardEvent.key` of the press.
 * @param current - Index of the focused tab.
 * @param count - Number of tabs in the list.
 * @returns Index of the tab to focus, or `null` when the key does not move focus.
 */
export function tabIndexForKey(key: string, current: number, count: number): number | null {
  switch (key) {
    case 'ArrowDown':
    case 'ArrowRight': {
      return (current + 1) % count;
    }
    case 'ArrowUp':
    case 'ArrowLeft': {
      return (current - 1 + count) % count;
    }
    case 'Home': {
      return 0;
    }
    case 'End': {
      return count - 1;
    }
    default: {
      return null;
    }
  }
}

export type AssembleSide = 'left' | 'right' | 'bottom';

/**
 * Picks the side a block slides in from as it assembles on scroll: the side of the page it sits
 * on, so blocks converge on their places; wide or centered blocks rise from below.
 * @param left - Block's left edge in viewport pixels, without any assembly offset.
 * @param width - Block's width in pixels.
 * @param viewportWidth - Viewport width in pixels.
 * @returns `left` or `right` for blocks off to one side, `bottom` otherwise.
 */
export function assembleSide(left: number, width: number, viewportWidth: number): AssembleSide {
  if (viewportWidth <= 0 || width >= viewportWidth * 0.6) {
    return 'bottom';
  }

  const offCenter = left + width / 2 - viewportWidth / 2;

  if (Math.abs(offCenter) < viewportWidth * 0.1) {
    return 'bottom';
  }

  return offCenter < 0 ? 'left' : 'right';
}
