import type { RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/libs/Gsap';
import { formatCount, parseCountTarget } from './motion';

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
      // Hand control back to CSS, as the scroll reveals do.
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
 * Reveals each section heading as it scrolls into view: the eyebrow rises, the title's words
 * slide up out of their masks, the rule draws from the left and the summary follows.
 * CSS holds the start state, and the split is reverted once the heading settles.
 * @param scope - Element that contains the section headings.
 */
function revealSectionHeads(scope: HTMLElement) {
  for (const head of gsap.utils.toArray<HTMLElement>('.sec-head', scope)) {
    const q = gsap.utils.selector(head);
    const [title] = q('h2');

    if (!title) {
      continue;
    }

    // Spans keep the heading's phrasing-only content model; `aria: 'auto'` (the default)
    // labels the h2 with its full text and hides the word pieces while it is split.
    const split = SplitText.create(title, {
      type: 'words',
      mask: 'words',
      wordsClass: 'split-word',
      tag: 'span',
    });
    const parts = [...q('.eyebrow'), ...q('.rule'), ...q('.sub')];

    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: 'power3.out' },
      scrollTrigger: { trigger: head, start: 'top 85%', once: true },
      onComplete: () => {
        head.classList.add('in');
        gsap.set([title, ...parts], { clearProps: 'opacity,transform' });
        split.revert();
      },
    });

    tl.to(q('.eyebrow'), { opacity: 1, y: 0 })
      .from(split.words, { yPercent: 140, duration: 1, ease: 'expo.out', stagger: 0.08 }, '<0.1')
      .to(q('.rule'), { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '<0.25')
      .to(q('.sub'), { opacity: 1, y: 0 }, '<0.1');

    // The `from` tween has already pushed the words below their masks, so showing the
    // title now reveals nothing until the timeline plays.
    gsap.set(title, { opacity: 1 });
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

        // CSS hides `.reveal:not(.in)` under the same query, so content stays visible
        // without JavaScript or with reduced motion.
        ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>('.reveal', scope), {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.08,
              overwrite: true,
              onComplete: () => {
                // Hand control back to CSS so hover transforms and transitions work again.
                for (const el of batch) {
                  el.classList.add('in');
                }
                gsap.set(batch, { clearProps: 'opacity,transform' });
              },
            });
          },
        });

        return restoreHero;
      });
    },
    { scope: root },
  );
}
