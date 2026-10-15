import { expect, test } from '@playwright/test';

// This container ships the full Chromium, not the headless shell Playwright
// defaults to, and needs SwiftShader for a WebGL2 context without a GPU.
test.use({
  launchOptions: {
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  },
});

test.describe('City background', () => {
  test('mounts a canvas on one of the two renderer backends', async ({ page }) => {
    const pageErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto('/');

    const canvas = page.locator('.city-bg canvas');

    // The chunk is ~1.5MB and only starts loading after hydration.
    await expect(canvas).toHaveCount(1, { timeout: 20_000 });

    // `data-backend` is written once `renderer.init()` resolves, so waiting on
    // it is also how this test waits for a renderer that actually started.
    await expect(canvas).toHaveAttribute('data-backend', /^webgpu$|^webgl2$/u, {
      timeout: 20_000,
    });

    expect(pageErrors).toEqual([]);
  });
});
