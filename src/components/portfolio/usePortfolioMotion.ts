import type { RefObject } from 'react';
import { gsap, SplitText, useGSAP } from '@/libs/Gsap';
import { assembleSide, formatCount, parseCountTarget } from './motion';

const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * Plays the hero entrance: the copy rises in, then the console bars fill while its stats count up.
 * CSS holds the start state, so every tween goes `to` the final state and nothing flashes on hydration.
 * @param scope - Element that contains the hero.
 * @returns Cleanup that restores the stat labels when the animation is reverted midway.
 */
function playHeroEntrance(scope: HTMLElement) {
  const q = gsap.utils.selector(scope);
  const bars = q('.console .bar > i');
  const counters = q('.console [data-count]');
  const labels = counters.map((el) => el.textContent);

  const tl = gsap.timeline({
    defaults: { duration: 0.9, ease: 'power3.out' },
    onComplete: () => {
      // Hand control back to CSS so the hero settles on its stylesheet state.
      const settled = [...q('.hero .enter'), ...q('.hero h1'), ...bars];
      for (const el of settled) {
        el.classList.add('in');
      }
      gsap.set(settled, { clearProps: 'opacity,transform' });
    },
  });

  tl.to(q('.hero-intro'), { opacity: 1, y: 0 })
    .to(q('.hero h1'), { y: 0, duration: 1.2, ease: 'expo.out' }, '<0.1')
    .to(q('.hero .lead'), { opacity: 1, y: 0 }, '<0.15')
    .to(q('.hero-actions'), { opacity: 1, y: 0 }, '<0.12')
    .to(q('.console'), { opacity: 1, y: 0 }, '<0.1')
    .addLabel('stats', '<0.3');

  for (const [i, bar] of bars.entries()) {
    tl.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power2.out' },
      `stats+=${i * 0.12}`,
    );
  }

  for (const [i, el] of counters.entries()) {
    const target = parseCountTarget(el.textContent);
    if (!target) {
      continue;
    }
    const count = { value: 0 };
    el.textContent = formatCount(0, target);
    tl.to(
      count,
      {
        value: target.value,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = formatCount(count.value, target);
        },
      },
      `stats+=${i * 0.12}`,
    );
  }

  return () => {
    for (const [i, el] of counters.entries()) {
      el.textContent = labels[i] ?? el.textContent;
    }
  };
}

/**
 * Reveals each section heading as the page scrolls through it: the eyebrow rises, the title's
 * words slide up out of their masks, the rule draws from the left and the summary fills in word
 * by word. Progress follows the scroll position, so scrolling back up plays it in reverse.
 * CSS holds the start state; the splits stay in place and are reverted with the media query.
 * @param scope - Element that contains the section headings.
 */
function revealSectionHeads(scope: HTMLElement) {
  for (const head of gsap.utils.toArray<HTMLElement>('.sec-head', scope)) {
    const q = gsap.utils.selector(head);
    const [title] = q('h2');
    const [sub] = q('.sub');

    if (!title) {
      continue;
    }

    // Spans keep the heading's phrasing-only content model; `aria: 'auto'` (the default)
    // labels each element with its full text and hides the word pieces while it is split.
    const split = SplitText.create(title, {
      type: 'words',
      mask: 'words',
      wordsClass: 'split-word',
      tag: 'span',
    });
    const subWords = sub ? SplitText.create(sub, { type: 'words', tag: 'span' }).words : [];

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: head, start: 'top 92%', end: 'clamp(top 45%)', scrub: 0.8 },
    });

    tl.to(q('.eyebrow'), { opacity: 1, y: 0, duration: 0.4 })
      .from(split.words, { yPercent: 140, duration: 0.6, stagger: 0.1 }, '<0.1')
      .to(q('.rule'), { scaleX: 1, duration: 0.6, ease: 'power1.inOut' }, '<0.2')
      .to(q('.sub'), { opacity: 1, y: 0, duration: 0.3 }, '<0.1')
      .from(subWords, { opacity: 0.12, duration: 0.3, stagger: 0.03, ease: 'none' }, '<');

    // The `from` tween has already pushed the words below their masks, so showing the
    // title now reveals nothing until the page scrolls.
    gsap.set(title, { opacity: 1 });
  }
}

/** How far blocks start from their place: a share of the viewport width, capped, or a rise. */
const ASSEMBLE_SHIFT = { share: 0.1, max: 140, rise: 72 };

/**
 * Measures where a block starts its assembly, on the side of the page it sits on.
 * @param block - Block to measure; its current assembly offset is discounted.
 * @returns Start offset in pixels on each axis.
 */
function assembleOffset(block: HTMLElement) {
  // GSAP writes the offset as `<number>px`; an unset property reads as '' and coerces to 0.
  const shiftedBy = Number(block.style.getPropertyValue('--assemble-x').replace('px', '')) || 0;
  const rect = block.getBoundingClientRect();
  const side = assembleSide(rect.left - shiftedBy, rect.width, window.innerWidth);
  const shift = Math.min(ASSEMBLE_SHIFT.max, window.innerWidth * ASSEMBLE_SHIFT.share);

  if (side === 'bottom') {
    return { x: 0, y: ASSEMBLE_SHIFT.rise };
  }

  return { x: side === 'left' ? -shift : shift, y: ASSEMBLE_SHIFT.rise / 3 };
}

/**
 * Assembles every `.reveal` block as it scrolls into view: each one slides in from the side of
 * the page it sits on, or rises from below, and fades up, following the scroll position.
 * GSAP drives CSS variables that feed `translate` and `opacity`, so hover `transform`s still work.
 * @param scope - Element that contains the blocks.
 */
function assembleBlocks(scope: HTMLElement) {
  for (const block of gsap.utils.toArray<HTMLElement>('.reveal', scope)) {
    gsap.fromTo(
      block,
      {
        '--assemble-x': () => `${assembleOffset(block).x}px`,
        '--assemble-y': () => `${assembleOffset(block).y}px`,
        '--assemble-o': 0,
      },
      {
        '--assemble-x': '0px',
        '--assemble-y': '0px',
        '--assemble-o': 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top bottom',
          // Clamped so blocks at the foot of the page still finish assembling at max scroll.
          end: 'clamp(top 62%)',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    );
  }
}

/**
 * Runs the page's scroll-driven motion inside `root`, only when the user allows motion.
 * @param root - Element that scopes every selector and owns the animations' cleanup.
 */
export function usePortfolioMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const scope = root.current;

      if (!scope) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Created first: the hero sits at the top of the page.
        const restoreHero = playHeroEntrance(scope);
        revealSectionHeads(scope);
        // CSS hides `.reveal` under the same query, so content stays visible without
        // JavaScript or with reduced motion.
        assembleBlocks(scope);

        return restoreHero;
      });
    },
    { scope: root },
  );
}
