// @ts-check
import { test, expect } from '@playwright/test';
// Demo scenario 1 (@chromium). Deterministically fails on shards 1-2, passes on
// 3-4 and locally. Placed in @chromium so Playwright's contiguous sharding lands it
// in a failing shard; the shard-number gate keeps it correct if the suite shifts.

const FAILING_SHARDS = [1, 2];

test('demo scenario 1 @chromium', async ({ page }) => {
  const shard = test.info().config.shard?.current ?? null;
  if (shard !== null && FAILING_SHARDS.includes(shard)) {
    await page.goto('/');
    await expect(
      page.locator('#testdino-demo-missing-element'),
      `demo failure: shard ${shard} is a designated failing shard`
    ).toBeVisible({ timeout: 2000 });
  } else {
    expect(shard ?? 0).toBeGreaterThanOrEqual(0);
  }
});
