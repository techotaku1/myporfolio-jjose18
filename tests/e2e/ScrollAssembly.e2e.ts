import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

async function opacityOf(locator: Locator) {
  return await locator.evaluate((el) => Number(getComputedStyle(el).opacity));
}

/**
 * Reads the horizontal assembly offset GSAP wrote on a block.
 * @param locator - Block to read.
 * @returns Offset in pixels, or NaN when GSAP has not set it.
 */
async function startShiftOf(locator: Locator) {
  const shift = await locator.evaluate((el: HTMLElement) =>
    el.style.getPropertyValue('--assemble-x'),
  );
  return shift === '' ? Number.NaN : Number(shift.replace('px', ''));
}

test.describe('Scroll assembly', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.describe('With motion allowed', () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto('/');
    });

    test('holds project cards apart until the page scrolls to them', async ({ page }) => {
      const cards = page.locator('#proyectos .card');
      // Wait for hydration: the offsets exist only once the motion hook has run.
      await expect.poll(async () => await startShiftOf(cards.first())).not.toBeNaN();
      const shifts = await Promise.all(
        Array.from(
          { length: await cards.count() },
          async (_, i) => await startShiftOf(cards.nth(i)),
        ),
      );

      expect(await opacityOf(cards.first())).toBeLessThan(0.1);
      expect(shifts.some((x) => x < 0)).toBe(true);
      expect(shifts.some((x) => x > 0)).toBe(true);
    });

    test('settles a card in place once it is scrolled into view', async ({ page }) => {
      const card = page.locator('#proyectos .card').first();
      await card.evaluate((el) => {
        el.scrollIntoView({ block: 'start' });
      });

      await expect.poll(async () => await opacityOf(card)).toBe(1);
      await expect.poll(async () => await startShiftOf(card)).toBe(0);
    });

    test('keeps each section title readable while it is split', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'DESARROLLO AGÉNTICO' })).toHaveCount(1);
    });
  });

  test.describe('On a phone with motion allowed', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('never scrolls the page sideways', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto('/');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );

      expect(overflow).toBeLessThanOrEqual(0);
    });
  });

  test.describe('With reduced motion', () => {
    test('shows every card in place', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      const card = page.locator('#proyectos .card').first();

      expect(await opacityOf(card)).toBe(1);
      expect(Number.isNaN(await startShiftOf(card))).toBe(true);
    });
  });
});
