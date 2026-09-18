import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/data/explorations.json' with { type: 'json' };
import { findPaths } from '../../src/lib/graph.mjs';

test('follow the editor down to silicon with explicit scope and source evidence', async ({
  page,
}) => {
  await page.goto('/products/vscode/node/');
  await expect(page.locator('.pixel-figure img')).toBeVisible();
  for (const [name, id] of [
    ['V8', 'v8'],
    ['Linux', 'linux'],
    ['Processor', 'cpu'],
    ['Transistors', 'transistors'],
    ['Silicon', 'silicon'],
  ]) {
    const link = page.locator('.deeper-row').getByRole('link', { name, exact: true });
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`/products/vscode/${id}/`);
  }
  await expect(page.getByRole('complementary', { name: 'Evidence boundary' })).toContainText(
    'not a live trace',
  );
  await expect(page.getByRole('complementary', { name: 'End of reviewed evidence' })).toContainText(
    'No mine',
  );
  const trace = page.locator('.documented-use').first();
  await trace.locator('.trace-evidence > summary').click();
  await expect(trace.locator('.connection-path')).toContainText('Linux');
  await trace.locator('.evidence > summary').last().click();
  await expect(trace.locator('.evidence-body').last()).toContainText('made from');
});

test('physical endpoint is usable on mobile without JavaScript and never invents power attribution', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/products/godot/electricity/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Electricity');
  await expect(page.locator('.endpoint')).toContainText('No utility');
  await expect(page.locator('.documented-use')).toHaveCount(6);
  await expect(page.locator('.pixel-figure img')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/design/electricity-390.png', fullPage: true });
  await context.close();
});

test('complete first-visitor path, evidence, contextual breadcrumbs and second product measurement', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore VS Code', exact: false }).first().click();
  await page.locator('#electron > summary').click();
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
  await expect(page).toHaveURL(/#layer-electron$/);
  await expect(page.locator('#electron')).toContainText('What VS Code adds');
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.shouldersEvents?.some(
          (e) => e.properties.action === 'foundation_opened' && e.properties.target === 'electron',
        ),
      ),
    )
    .toBe(true);
  await page.locator('#electron > .tree-content > .tree-explanation .evidence > summary').click();
  await expect(
    page.locator('#electron > .tree-content > .tree-explanation .evidence-body'),
  ).toContainText('Desktop VS Code; not vscode.dev.');
  await page.getByRole('link', { name: 'Explore Electron', exact: false }).click();
  await page.locator('.deeper-row').getByRole('link', { name: 'Chromium', exact: true }).click();
  await expect(page).toHaveURL('/products/vscode/chromium/');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('VS Code');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Electron');
  await expect(page.locator('.documented-use')).toHaveCount(2);
  await page.locator('.use-heading').getByRole('link', { name: 'OBS Studio', exact: true }).click();
  await expect(page).toHaveURL('/products/obs-studio/chromium/');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText(
    'Chromium Embedded Framework',
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.shouldersEvents?.some(
          (e) =>
            e.properties.action === 'second_product_explored' &&
            e.properties.product === 'obs-studio',
        ),
      ),
    )
    .toBe(true);
});

test('all generated product and foundation routes load directly and internal links resolve', async ({
  request,
}) => {
  const routes = [
    '/',
    '/about/',
    '/request/',
    '/privacy/',
    ...data.products.map((p) => `/products/${p.id}/`),
    ...data.foundations.map((f) => `/foundations/${f.id}/`),
    ...data.products.flatMap((p) =>
      data.foundations
        .filter((f) => findPaths(data.relationships, p.id, f.id).length)
        .map((f) => `/products/${p.id}/${f.id}/`),
    ),
  ];
  const known = new Set(routes);
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html, route).toContain('<h1');
    for (const match of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
      const href = match[1];
      if (href === '/favicon.svg' || href.startsWith('/_astro/')) continue;
      expect(known.has(href), `${route} links to ${href}`).toBe(true);
    }
  }
  expect((await request.get('/not-a-real-page/')).status()).toBe(404);
});

test('keyboard disclosures, history and direct fragment restoration', async ({ page }) => {
  await page.goto('/products/vscode/');
  const summary = page.locator('#electron > summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
  await page.locator('#xterm > summary').click();
  await expect(page.locator('#xterm')).toHaveAttribute('open', '');
  await expect(page.locator('#electron')).not.toHaveAttribute('open', '');
  await expect(page).toHaveURL(/#layer-xterm$/);
  await page.goBack();
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
  await page.goto('/products/obs-studio/#cef');
  await expect(page.locator('#cef')).toHaveAttribute('open', '');
  await expect(page.locator('#cef')).toContainText('View evidence');
});

test('no JavaScript retains disclosures, evidence and context routes', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/products/vscode/');
  await page.locator('#electron > summary').click();
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
  await page.goto('http://127.0.0.1:4321/products/vscode/#layer-ripgrep');
  await expect(page.locator('#ripgrep')).toHaveAttribute('open', '');
  await page.goto('http://127.0.0.1:4321/products/vscode/#layer-electron');
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
  await page.getByRole('link', { name: 'Explore Electron', exact: false }).focus();
  await page.keyboard.press('Enter');
  await page.locator('.deeper-row').getByRole('link', { name: 'Chromium', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('VS Code');
  await context.close();
});

for (const width of [390, 768, 1440])
  test(`responsive, accessible exploration at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `artifacts/design/after-${width}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    for (const product of data.products) {
      await page.goto(`/products/${product.id}/`);
      await page.locator('details.foundation > summary').first().click();
      await expect(page.locator('details.foundation[open]')).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        product.id,
      ).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({
        path: `artifacts/design/${product.id}-${width}.png`,
        fullPage: true,
      });
    }
    await page.goto('/products/vscode/chromium/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: `artifacts/design/chromium-${width}.png`, fullPage: true });
    for (const layer of ['node', 'cpu', 'electricity']) {
      await page.goto(`/products/vscode/${layer}/`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `artifacts/design/${layer}-${width}.png`, fullPage: true });
    }
  });

test('reduced motion and unavailable storage do not prevent exploration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new Error('disabled');
      },
    });
  });
  await page.goto('/products/supabase/');
  await page.locator('#postgres > summary').click();
  await expect(page.locator('#postgres')).toHaveAttribute('open', '');
  expect(
    await page
      .locator('.tree-explanation')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
});

test('privacy opt-out disables events and session markers', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true }),
  );
  await page.goto('/products/vscode/');
  await page.locator('#electron > summary').click();
  expect(await page.evaluate(() => window.shouldersEvents)).toBeUndefined();
  expect(await page.evaluate(() => sessionStorage.getItem('shoulders:products'))).toBeNull();
});

test('tree selection records one opening and updates the selected branch', async ({ page }) => {
  await page.goto('/products/vscode/');
  await page.locator('#electron > summary').click();
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
  await expect(page.locator('#electron')).toHaveAttribute('data-selected', '');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.shouldersEvents?.filter(
            (e) => e.properties.action === 'foundation_opened' && e.event === 'core_action',
          ).length,
      ),
    )
    .toBe(1);
  expect(
    await page.evaluate(
      () => window.shouldersEvents?.filter((e) => e.event === 'activated').length,
    ),
  ).toBe(1);
  await page.locator('#ripgrep > summary').click();
  await expect(page.locator('#ripgrep')).toHaveAttribute('open', '');
  await expect(page.locator('#ripgrep')).toHaveAttribute('data-selected', '');
});

test('whitespace-only suggestion reports a recoverable validation error', async ({ page }) => {
  await page.goto('/request/');
  await page.getByLabel('Your suggestion').fill('   ');
  // Inspect validity without submitting, even when testing invalid input.
  expect(
    await page
      .getByLabel('Your suggestion')
      .evaluate((el: HTMLTextAreaElement) => el.validationMessage),
  ).toContain('Please name a product');
  await page.getByLabel('Your suggestion').fill('A new product');
  expect(
    await page
      .getByLabel('Your suggestion')
      .evaluate((el: HTMLTextAreaElement) => el.checkValidity()),
  ).toBe(true);
});

test('suggestion explains the email handoff and keeps entered text out of analytics', async ({
  page,
}) => {
  await page.goto('/request/');
  await page.getByLabel('Your suggestion').fill('Please explore a browser, with a source.');
  // Never activate a valid mailto submission: it launches the operator's mail app.
  await expect(page.getByRole('button', { name: 'Open email draft', exact: false })).toBeVisible();
  await expect(page.locator('.form-note')).toContainText(
    'Your suggestion is sent only when you send the email',
  );
  await expect(page.getByRole('status')).toBeEmpty();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const events = await page.evaluate(() => window.shouldersEvents);
  expect(JSON.stringify(events)).not.toContain('Please explore');
});

test('existing analytics provider receives scoped events without query or request text', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const receipts: Array<{ event: string; properties: Record<string, string> }> = [];
    Object.defineProperty(window, 'providerReceipts', { value: receipts });
    window.posthog = { capture: (event, properties) => receipts.push({ event, properties }) };
  });
  await page.goto('/products/vscode/?test_private_value=do-not-collect');
  await page.locator('#electron > summary').click();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'providerReceipts').length))
    .toBe(3);
  const receipts = await page.evaluate(() => Reflect.get(window, 'providerReceipts'));
  expect(receipts.map((receipt: { event: string }) => receipt.event)).toEqual([
    'page_view',
    'core_action',
    'activated',
  ]);
  expect(
    receipts.every(
      (receipt: { properties: Record<string, string> }) =>
        receipt.properties.project_id === 'shoulders',
    ),
  ).toBe(true);
  expect(JSON.stringify(receipts)).not.toContain('do-not-collect');
});

test('provider failure cannot break foundation navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.posthog = {
      capture: () => {
        throw new Error('Provider unavailable');
      },
    };
  });
  await page.goto('/products/vscode/');
  await page.locator('#electron > summary').click();
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
  await page.getByRole('link', { name: 'Explore Electron →', exact: true }).click();
  await expect(page).toHaveURL('/products/vscode/electron/');
  expect(errors).toEqual([]);
});

test('unrelated anchors preserve the selected foundation', async ({ page }) => {
  await page.goto('/products/vscode/#layer-electron');
  await page.getByRole('link', { name: 'Skip to content', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#electron')).toHaveAttribute('open', '');
});

test('progressive tree retains exact ancestry through sharing and browser history', async ({
  page,
}) => {
  await page.goto('/products/vscode/');
  await expect(page.locator('.tree-node > summary:visible')).toHaveCount(3);
  const path = ['electron', 'node', 'v8', 'linux', 'cpu', 'transistors', 'silicon'];
  let key = '';
  for (const part of path) {
    key = key ? `${key}--${part}` : part;
    await page.locator(`#${key} > summary`).click();
    await expect(page.locator('.tree-explanation:visible')).toHaveCount(1);
    await expect(page).toHaveURL(new RegExp(`#layer-${key}$`));
  }
  await expect(page.locator('.tree-node[open]')).toHaveCount(7);
  await page.reload();
  await expect(page.locator('.tree-node[open]')).toHaveCount(7);
  await expect(page.locator('.tree-explanation:visible')).toContainText('silicon');
  await page.locator('#ripgrep > summary').click();
  await expect(page.locator('.tree-node[open]')).toHaveCount(1);
  await page.goBack();
  await expect(page.locator('.tree-node[open]')).toHaveCount(7);
  await expect(page.locator('.tree-explanation:visible')).toHaveCount(1);
});
