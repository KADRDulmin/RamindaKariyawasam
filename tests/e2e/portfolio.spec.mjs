import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("evidence-led portfolio", () => {
  test("renders aligned positioning, featured evidence, and the complete catalogue", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page).toHaveTitle(/Full-Stack Software Engineer/);
    await expect(page.locator(".hero-thesis")).toContainText("AI-enabled university platforms");
    await expect(page.locator("#board-nsbm .featured-case")).toHaveCount(4);
    await expect(page.locator("#board-work .project-card")).toHaveCount(24);
    const ids = await page.locator("#board-work .project-card").evaluateAll((cards) => cards.map((card) => card.getAttribute("aria-label")));
    expect(new Set(ids).size).toBe(24);
    expect(errors).toEqual([]);
  });

  test("filters support multiple categories and expose active state", async ({ page }) => {
    await page.goto("/");
    const categories = await page.evaluate(() => window.RK.projectCategories.map((category) => ({
      ...category,
      count: category.id === "all" ? window.RK.projects.length : window.RK.projects.filter((project) => project.categories.includes(category.id)).length,
    })));
    for (const category of categories) {
      const button = page.getByRole("button", { name: new RegExp(`^${category.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator("#board-work .project-card")).toHaveCount(category.count);
    }
  });

  test("project dialog traps focus, closes on Escape, and restores the trigger", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator("#board-work .project-card").first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: /UMIS Student Portal/ });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    const close = dialog.getByRole("button", { name: /Close .* details/ });
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("resume chooser exposes four real download anchors", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /choose a résumé/i });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: /Which résumé fits/ });
    await expect(dialog).toBeVisible();
    const options = dialog.locator("a[download][data-resume-option]");
    await expect(options).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) {
      const href = await options.nth(index).getAttribute("href");
      const response = await page.request.get(href);
      expect(response.ok()).toBeTruthy();
      expect(response.headers()["content-type"]).toContain("application/pdf");
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(severe, severe.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
  });

  for (const width of [320, 375]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.goto("/");
      const overflow = await page.evaluate(() => ({
        body: document.body.scrollWidth - document.body.clientWidth,
        html: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        offenders: Array.from(document.querySelectorAll("body *")).map((element) => {
          const rect = element.getBoundingClientRect();
          return { tag: element.tagName, id: element.id, className: String(element.className).slice(0, 80), left: rect.left, right: rect.right, width: rect.width };
        }).filter((item) => item.right > window.innerWidth + 1 || item.left < -1 || item.width > window.innerWidth + 1).slice(0, 20),
      }));
      expect(overflow.body, JSON.stringify(overflow.offenders, null, 2)).toBeLessThanOrEqual(1);
      expect(overflow.html, JSON.stringify(overflow.offenders, null, 2)).toBeLessThanOrEqual(1);
    });
  }

  test("reduced motion keeps hero photography static and content visible", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const initial = await page.locator(".hero-photo-layer img").getAttribute("src");
    await page.waitForTimeout(4300);
    await expect(page.locator(".hero-photo-layer img")).toHaveAttribute("src", initial);
    await expect(page.locator("#board-work .project-card").first()).toBeVisible();
    await context.close();
  });
});
