import { expect, test } from '@playwright/test';

test.describe('AI tool tabs', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.describe('With motion allowed', () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto('/');
    });

    test('replaces the static grid with a tab list', async ({ page }) => {
      const section = page.locator('#ia');

      await expect(section.getByRole('tablist', { name: 'Herramientas' })).toBeVisible();
      await expect(section.locator('.ai-grid')).toBeHidden();
      await expect(section.getByRole('tab')).toHaveCount(6);
    });

    test('steps through the tools as the page scrolls', async ({ page }) => {
      const tabs = page.locator('#ia').getByRole('tab');
      await tabs.first().scrollIntoViewIfNeeded();

      await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

      await page.mouse.wheel(0, 1200);

      await expect(tabs.first()).toHaveAttribute('aria-selected', 'false');
    });

    test('selects a tool when its tab is clicked', async ({ page }) => {
      const tabs = page.locator('#ia').getByRole('tab');
      await tabs.first().scrollIntoViewIfNeeded();

      const name = await tabs.nth(3).locator('span').last().textContent();
      await tabs.nth(3).click();

      await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('#ia').getByRole('tabpanel')).toContainText(name ?? '');
    });

    test('moves between tabs with the keyboard', async ({ page }) => {
      const tabs = page.locator('#ia').getByRole('tab');
      await tabs.first().scrollIntoViewIfNeeded();
      await tabs.first().focus();

      await page.keyboard.press('End');

      await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
      await expect(tabs.last()).toBeFocused();

      await page.keyboard.press('Home');

      await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

      await page.keyboard.press('ArrowDown');

      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('With reduced motion', () => {
    test('keeps the static grid', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      const section = page.locator('#ia');

      await expect(section.locator('.ai-grid')).toBeVisible();
      await expect(section.getByRole('tablist')).toHaveCount(0);
    });
  });
});
