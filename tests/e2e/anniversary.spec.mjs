import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const route = "/srimantha_and_geethanjali_anniversary/";

test.beforeEach(async ({ page }) => {
  await page.goto(route, { waitUntil: "domcontentloaded" });
});

test("loads through the public route with correct metadata and working primary media", async ({ page }) => {
  await expect(page).toHaveTitle("Srimantha & Geethanjali | 25th Anniversary Celebration");
  await expect(page.locator("h1")).toContainText("Srimantha");
  await expect(page.locator("h1")).toContainText("Geethanjali");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.ramindak.com/srimantha_and_geethanjali_anniversary/",
  );
  const hero = page.locator(".hero-visual img");
  await expect(hero).toBeVisible();
  await expect.poll(() => hero.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator("[data-countdown]")).toBeVisible();

  await page.goto(route.slice(0, -1), { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Geethanjali");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".hero-visual img")).toBeVisible();
});

test("has no serious automated accessibility violations", async ({ page }) => {
  await page.waitForLoadState("networkidle");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact))).toEqual([]);
});

test("loads without console errors, runtime exceptions, or broken photographs", async ({ page }) => {
  const runtimeErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.reload({ waitUntil: "networkidle" });
  const images = page.locator("img");
  await images.evaluateAll((items) => items.forEach((image) => { image.loading = "eager"; }));
  await expect.poll(
    () => images.evaluateAll((items) => items.every((image) => image.complete && image.naturalWidth > 0)),
    { timeout: 15_000 },
  ).toBeTruthy();
  expect(runtimeErrors).toEqual([]);
});

test("calendar links preserve the Colombo event instant", async ({ page }) => {
  await page.locator("[data-calendar-open]").first().click();
  const dialog = page.locator("[data-calendar-dialog]");
  await expect(dialog).toBeVisible();
  const googleUrl = new URL(await dialog.locator("[data-google-calendar]").getAttribute("href"));
  expect(googleUrl.searchParams.get("dates")).toBe("20260822T123000Z/20260822T123000Z");
  expect(googleUrl.searchParams.get("ctz")).toBe("Asia/Colombo");

  const calendarResponse = await page.request.get(`${route}srimantha-and-geethanjali-25th-anniversary.ics`);
  expect(calendarResponse.ok()).toBeTruthy();
  const calendarText = await calendarResponse.text();
  expect(calendarText).toContain("DTSTART;TZID=Asia/Colombo:20260822T180000");
  expect(calendarText).not.toContain("DTEND");
});

test("lightbox supports keyboard navigation, Escape, and focus restoration", async ({ page }) => {
  const trigger = page.locator('[data-gallery-index="0"]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const lightbox = page.locator("[data-lightbox]");
  await expect(lightbox).toBeVisible();
  await expect(page.locator("[data-lightbox-counter]")).toHaveText("1 / 5");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("[data-lightbox-counter]")).toHaveText("2 / 5");
  await page.keyboard.press("Escape");
  await expect(lightbox).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("RSVP validates inputs and opens an organized WhatsApp message without claiming delivery", async ({ page }) => {
  const postRequests = [];
  page.on("request", (request) => {
    if (request.method() === "POST") postRequests.push(request.url());
  });
  await page.evaluate(() => {
    window.__OPENED_RSVP_WHATSAPP__ = "";
    window.open = (url) => {
      window.__OPENED_RSVP_WHATSAPP__ = String(url);
      return null;
    };
  });

  await page.locator("[data-rsvp-open]").first().click();
  const dialog = page.locator("[data-rsvp-dialog]");
  await expect(dialog).toBeVisible();
  await dialog.locator("[data-submit]").click();
  await expect(dialog.locator("[data-form-status]")).toContainText("review the highlighted fields");

  await dialog.locator("#guest-name").fill("A Guest");
  await dialog.locator('input[name="attending"][value="yes"]').check();
  await dialog.locator("#guest-count").fill("2");
  await dialog.locator("#contact-number").fill("0771234567");
  await dialog.locator("#guest-message").fill("Warm wishes");
  await dialog.locator("[data-submit]").click();
  await expect(dialog.locator("[data-form-status]")).toContainText("Review the message, then tap Send");
  await expect(dialog.locator("[data-form-status]")).not.toContainText("delivered");
  const whatsappUrl = new URL(await page.evaluate(() => window.__OPENED_RSVP_WHATSAPP__));
  expect(whatsappUrl.origin).toBe("https://wa.me");
  expect(whatsappUrl.pathname).toBe("/94778915586");
  const message = whatsappUrl.searchParams.get("text");
  expect(message).toContain("25TH ANNIVERSARY RSVP");
  expect(message).toContain("Name: A Guest");
  expect(message).toContain("Attendance: Joyfully accepts");
  expect(message).toContain("Number of guests: 2");
  expect(message).toContain("Contact number: 0771234567");
  expect(message).toContain("MESSAGE FOR THE COUPLE\nWarm wishes");
  expect(message).toContain("Date: Saturday, 22 August 2026");
  expect(message).toContain("Venue: Monarch Imperial");
  expect(postRequests).toEqual([]);
});

test("the two featured memory photographs remain fully visible on phones", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(route, { waitUntil: "networkidle" });
  const cards = page.locator(".memory-card");
  await expect(cards).toHaveCount(2);
  const presentation = await cards.locator("img").evaluateAll((images) =>
    images.map((image) => ({
      objectFit: getComputedStyle(image).objectFit,
      renderedWidth: image.getBoundingClientRect().width,
      renderedHeight: image.getBoundingClientRect().height,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    })),
  );
  for (const image of presentation) {
    expect(image.objectFit).toBe("contain");
    expect(image.naturalWidth).toBeGreaterThan(0);
    expect(image.renderedWidth / image.renderedHeight).toBeCloseTo(
      image.naturalWidth / image.naturalHeight,
      2,
    );
  }
  const firstCard = await cards.nth(0).boundingBox();
  const secondCard = await cards.nth(1).boundingBox();
  expect(firstCard.width).toBeGreaterThan(240);
  expect(secondCard.width).toBeGreaterThan(240);
  expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height);
});

test("map is consent-loaded and external links open safely", async ({ page }) => {
  await page.route("https://www.google.com/maps?**", (route) => route.fulfill({ body: "<html></html>", contentType: "text/html" }));
  await page.locator("[data-map-load]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-map-card] iframe")).toHaveCount(0);
  await page.locator("[data-map-load]").click();
  await expect(page.locator("[data-map-card] iframe")).toHaveCount(1);

  const unsafeExternalLinks = await page.locator('a[target="_blank"]').evaluateAll((links) =>
    links.filter((link) => !link.rel.split(/\s+/).includes("noopener")).map((link) => link.href),
  );
  expect(unsafeExternalLinks).toEqual([]);
});

test("share fallback, WhatsApp link, and back-to-top control work", async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (value) => { window.__COPIED_INVITATION__ = value; } },
      configurable: true,
    });
  });
  await page.locator("[data-share]").first().click();
  await expect(page.locator("[data-toast]")).toHaveText("Invitation link copied.");
  expect(await page.evaluate(() => window.__COPIED_INVITATION__)).toBe(
    "https://www.ramindak.com/srimantha_and_geethanjali_anniversary/",
  );

  const whatsappHref = await page.locator("[data-whatsapp-share]").getAttribute("href");
  expect(whatsappHref).toMatch(/^https:\/\/wa\.me\/\?text=/);
  expect(decodeURIComponent(whatsappHref)).toContain("22 August 2026");

  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-back-to-top]")).toHaveClass(/is-visible/);
  await page.locator("[data-back-to-top]").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(4);
});

test("mobile layouts have no horizontal page overflow and expose the quick action bar", async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 568, height: 320 },
    { width: 844, height: 390 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `overflow at ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(1);
    const copy = await page.locator(".hero-copy").boundingBox();
    const visual = await page.locator(".hero-visual").boundingBox();
    expect(copy).not.toBeNull();
    expect(visual).not.toBeNull();
    const overlaps = !(
      copy.x + copy.width <= visual.x ||
      visual.x + visual.width <= copy.x ||
      copy.y + copy.height <= visual.y ||
      visual.y + visual.height <= copy.y
    );
    expect(overlaps, `hero text/photo overlap at ${viewport.width}x${viewport.height}`).toBeFalsy();
    if (viewport.width <= 900) await expect(page.locator(".quick-actions")).toBeVisible();
  }
});

test("keeps the existing portfolio home page available", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#root")).toBeAttached();
  await expect(page).not.toHaveTitle(/Srimantha/);
});

test("reduced motion keeps the complete invitation immediately available", async ({ browser }) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".invitation-card")).toBeVisible();
  await expect(page.locator(".hero h1")).toBeVisible();
  const animationName = await page.locator(".hero-visual img").evaluate(
    (element) => getComputedStyle(element).animationName,
  );
  expect(animationName === "none" || animationName.includes("hero-image-reveal")).toBeTruthy();
  await context.close();
});

test("countdown helper handles both sides of the event without negative values", async ({ page }) => {
  const states = await page.evaluate(() => {
    const target = Date.parse("2026-08-22T18:00:00+05:30");
    return {
      before: window.__ANNIVERSARY_TEST__.getCountdownState(target - 1000, target),
      after: window.__ANNIVERSARY_TEST__.getCountdownState(target + 1000, target),
    };
  });
  expect(states.before).toEqual({ complete: false, days: 0, hours: 0, minutes: 0, seconds: 1 });
  expect(states.after).toEqual({ complete: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
});

test("countdown UI changes to a welcoming message after the event begins", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.clock.install({ time: new Date("2026-08-22T12:31:00.000Z") });
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-countdown]")).toHaveCount(0);
  await expect(page.locator("[data-countdown-complete]")).toContainText("celebration has begun");
  await context.close();
});
