import { expect, test } from "@playwright/test";

test.skip(process.env.VISUAL_QA !== "1", "Run with VISUAL_QA=1 for local design review captures.");

test("capture portfolio layouts for visual QA", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { name: "desktop-1366", width: 1366, height: 768 },
    { name: "mobile-320", width: 320, height: 812 },
    { name: "mobile-375", width: 375, height: 812 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator(".hero-thesis")).toBeVisible();
    await page.locator("#board-home").screenshot({
      path: testInfo.outputPath(`${viewport.name}-portfolio-home.png`),
      animations: "disabled",
    });
    await page.locator("#board-nsbm").screenshot({
      path: testInfo.outputPath(`${viewport.name}-portfolio-evidence.png`),
      animations: "disabled",
    });
  }

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#board-work").screenshot({
    path: testInfo.outputPath("desktop-1366-portfolio-catalogue.png"),
    animations: "disabled",
  });
});
