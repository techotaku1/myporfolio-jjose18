import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/libs/Gsap';

const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * Runs the page's scroll-driven motion inside `root`, only when the user allows motion.
 * @param root - Element that scopes every selector and owns the animations' cleanup.
 */
export function usePortfolioMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // CSS hides `.reveal:not(.in)` under the same query, so content stays visible
        // without JavaScript or with reduced motion.
        ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>('.reveal', root.current), {
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
      });
    },
    { scope: root },
  );
}
