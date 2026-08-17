import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { ANNIVERSARY_EVENT as event } from "../srimantha_and_geethanjali_anniversary/event-config.mjs";
import {
  buildGoogleCalendarUrl,
  buildWhatsAppRsvpMessage,
  buildWhatsAppRsvpUrl,
  getCountdownState,
  validateRsvp,
} from "../srimantha_and_geethanjali_anniversary/invitation-utils.mjs";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "..");
const routeDirectory = path.join(projectRoot, "srimantha_and_geethanjali_anniversary");
const sourcePhotoDirectory = path.join(projectRoot, "assets", "Anniversary_Photos");

test("event configuration represents the supplied Athurugiriya event exactly", () => {
  assert.equal(event.couple.displayName, "Srimantha & Geethanjali");
  assert.equal(event.anniversaryYears, 25);
  assert.equal(event.startIso, "2026-08-23T18:00:00+05:30");
  assert.equal(new Date(event.startIso).toISOString(), "2026-08-23T12:30:00.000Z");
  assert.equal(event.timeZone, "Asia/Colombo");
  assert.equal(event.venue.name, "Yuki Grand Hotel");
  assert.match(event.venue.address, /No\. 71\/2, Govinna Road/);
  assert.equal(event.venue.website, "https://yukigrand.lk/");
  assert.match(event.venue.directionsUrl, /Yuki%20Grand%20Hotel/);
  assert.match(event.venue.mapEmbedUrl, /Athurugiriya%2010150/);
  assert.deepEqual(event.venue.guestDetails, [
    "Indoor & outdoor event spaces",
    "Convenient guest parking",
    "Dedicated event service",
  ]);
  assert.deepEqual(event.venue.structuredAddress, {
    streetAddress: "No. 71/2, Govinna Road",
    addressLocality: "Athurugiriya",
    postalCode: "10150",
    addressCountry: "LK",
  });
  assert.equal(event.rsvp.enabled, true);
  assert.equal(event.rsvp.channel, "whatsapp");
  assert.equal(event.rsvp.whatsappNumber, "94778915586");
  assert.equal(event.publicPath, "/srimantha_and_geethanjali_anniversary/");
});

test("countdown returns stable before-event values and a natural completed state", () => {
  const target = Date.parse(event.startIso);
  const before = getCountdownState(
    target - (2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000),
    target,
  );
  assert.deepEqual(before, {
    complete: false,
    days: 2,
    hours: 3,
    minutes: 4,
    seconds: 5,
  });
  assert.deepEqual(getCountdownState(target, target), {
    complete: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.equal(getCountdownState(target + 60_000, target).complete, true);
});

test("Google Calendar URL uses the exact UTC instant and Colombo timezone", () => {
  const calendarUrl = new URL(buildGoogleCalendarUrl());
  assert.equal(calendarUrl.origin, "https://calendar.google.com");
  assert.equal(calendarUrl.searchParams.get("action"), "TEMPLATE");
  assert.equal(
    calendarUrl.searchParams.get("dates"),
    "20260823T123000Z/20260823T123000Z",
  );
  assert.equal(calendarUrl.searchParams.get("ctz"), "Asia/Colombo");
  assert.equal(calendarUrl.searchParams.get("text"), event.calendar.title);
  assert.match(calendarUrl.searchParams.get("location"), /Yuki Grand Hotel/);
});

test("RSVP validation accepts complete responses and rejects unsafe or missing values", () => {
  assert.deepEqual(
    validateRsvp({
      guestName: "A Guest",
      attending: "yes",
      guestCount: 2,
      contactNumber: "+94 77 123 4567",
      message: "Warm wishes",
    }),
    {},
  );
  const errors = validateRsvp({
    guestName: "",
    attending: "",
    guestCount: 0,
    contactNumber: "12",
    message: "x".repeat(501),
  });
  assert.deepEqual(Object.keys(errors).sort(), [
    "attending",
    "contactNumber",
    "guestName",
    "message",
  ]);
  assert.deepEqual(
    validateRsvp({
      guestName: "A Guest",
      attending: "no",
      guestCount: 0,
      contactNumber: "0771234567",
      message: "",
    }),
    {},
  );
});

test("WhatsApp RSVP uses the configured international number and an organized message", () => {
  const values = {
    guestName: "A Guest",
    attending: "yes",
    guestCount: 2,
    contactNumber: "077 123 4567",
    message: "Warm wishes",
  };
  const whatsappUrl = new URL(buildWhatsAppRsvpUrl(values));
  assert.equal(whatsappUrl.origin, "https://wa.me");
  assert.equal(whatsappUrl.pathname, "/94778915586");
  assert.equal(whatsappUrl.searchParams.get("text"), buildWhatsAppRsvpMessage(values));
  assert.match(whatsappUrl.searchParams.get("text"), /25TH ANNIVERSARY RSVP/);
  assert.match(whatsappUrl.searchParams.get("text"), /Name: A Guest/);
  assert.match(whatsappUrl.searchParams.get("text"), /Attendance: Joyfully accepts/);
  assert.match(whatsappUrl.searchParams.get("text"), /Number of guests: 2/);
  assert.match(whatsappUrl.searchParams.get("text"), /Date: Sunday, 23 August 2026/);
  assert.match(whatsappUrl.searchParams.get("text"), /Venue: Yuki Grand Hotel/);

  const declineMessage = buildWhatsAppRsvpMessage({ ...values, attending: "no", guestCount: 0 });
  assert.match(declineMessage, /Attendance: Regretfully declines/);
  assert.doesNotMatch(declineMessage, /Number of guests:/);
});

test("generated invitation contains crawler-readable metadata and no template tokens", async () => {
  const html = await readFile(path.join(routeDirectory, "index.html"), "utf8");
  const jsx = await readFile(path.join(routeDirectory, "anniversary.jsx"), "utf8");
  assert.doesNotMatch(html, /{{[A-Z0-9_]+}}/);
  assert.match(html, /<title>Srimantha &amp; Geethanjali \| 25th Anniversary Celebration<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.ramindak\.com\/srimantha_and_geethanjali_anniversary\/"/);
  assert.match(html, /property="og:image" content="https:\/\/www\.ramindak\.com\/srimantha_and_geethanjali_anniversary\/assets\/images\/anniversary-og-1200x630\.jpg"/);
  assert.match(html, /"startDate": "2026-08-23T18:00:00\+05:30"/);
  assert.match(html, /"name": "Yuki Grand Hotel"/);
  assert.match(html, /"streetAddress": "No\. 71\/2, Govinna Road"/);
  assert.doesNotMatch(html, /Monarch Imperial|31A New Hospital Road|monarchimperial\.lk/i);
  assert.match(html, /id="anniversary-root"/);
  assert.match(html, /src="anniversary\.bundle\.js"/);
  assert.doesNotMatch(html, /assets\/Anniversary_Photos/);
  assert.match(jsx, /event\.gallery\.map/);
  assert.match(jsx, /data-rsvp-form/);
  assert.match(jsx, /createRoot\(rootElement\)/);
});

test("ICS file is timezone-aware, folded correctly, and does not invent an end time", async () => {
  const ics = await readFile(path.join(routeDirectory, event.calendar.fileName), "utf8");
  assert.match(ics, /BEGIN:VCALENDAR\r?\n/);
  assert.match(ics, /TZID:Asia\/Colombo/);
  assert.match(ics, /DTSTART;TZID=Asia\/Colombo:20260823T180000/);
  assert.match(ics, /TZOFFSETTO:\+0530/);
  assert.match(ics, /LOCATION:Yuki Grand Hotel\\,/);
  assert.doesNotMatch(ics, /DTEND|DURATION/);
  assert.doesNotMatch(ics, /[ \t]+\r?$/m);
  const unfoldedIcs = ics.replace(/\r?\n[ \t]/g, "");
  assert.match(
    unfoldedIcs,
    /LOCATION:Yuki Grand Hotel\\, No\. 71\/2\\, Govinna Road\\, Athurugiriya 10150\\, Sri Lanka/,
  );
  for (const line of ics.split(/\r?\n/).filter(Boolean)) {
    assert.ok(Buffer.byteLength(line, "utf8") <= 75, `ICS line exceeds 75 octets: ${line}`);
  }
});

test("every supplied photograph has a mapped, optimized public derivative", async () => {
  assert.equal(event.gallery.length, 5);
  const uniqueSources = new Set(event.gallery.map((image) => image.src));
  assert.equal(uniqueSources.size, 5);
  for (const image of event.gallery) {
    const imagePath = path.join(routeDirectory, image.src);
    assert.ok(existsSync(imagePath), `${image.src} should exist`);
    assert.ok((await stat(imagePath)).size > 10_000, `${image.src} should not be empty`);
    assert.match(image.src, /\.webp$/);
  }
  const generated = await readdir(path.join(routeDirectory, "assets", "images"));
  assert.ok(generated.includes("invitation-paper-texture-v1.webp"));
  assert.ok(generated.filter((name) => name.endsWith(".webp")).length >= 17);
});

test("social preview assets use the requested dimensions", () => {
  const expectations = new Map([
    ["anniversary-og-1200x630.jpg", "1200x630"],
    ["anniversary-feed-1080x1350.jpg", "1080x1350"],
    ["anniversary-story-1080x1920.jpg", "1080x1920"],
  ]);
  for (const [fileName, dimensions] of expectations) {
    const filePath = path.join(routeDirectory, "assets", "images", fileName);
    const actual = execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "csv=s=x:p=0",
        filePath,
      ],
      { encoding: "utf8" },
    ).trim();
    assert.equal(actual, dimensions);
  }
});

test("production build includes the self-hosted invitation fonts and licenses", () => {
  for (const fileName of [
    "cormorant-garamond-latin-wght-normal.woff2",
    "cormorant-garamond-latin-wght-italic.woff2",
    "manrope-latin-wght-normal.woff2",
    "LICENSE-Cormorant-Garamond.txt",
    "LICENSE-Manrope.txt",
  ]) {
    assert.ok(existsSync(path.join(routeDirectory, "assets", "fonts", fileName)), `${fileName} should exist`);
  }
});

test("public source photographs contain no sensitive descriptive or location metadata", async () => {
  const sourceNames = await readdir(sourcePhotoDirectory);
  for (const fileName of sourceNames) {
    const contents = await readFile(path.join(sourcePhotoDirectory, fileName));
    const searchable = contents.toString("latin1");
    assert.doesNotMatch(
      searchable,
      /GPSLatitude|GPSLongitude|GPSInfo|DateTimeOriginal|BodySerialNumber|SerialNumber|LensModel|CameraModelName/i,
      `${fileName} should not expose private EXIF fields`,
    );

    if (fileName.toLowerCase().endsWith(".png")) {
      const chunkTypes = [];
      let offset = 8;
      while (offset + 12 <= contents.length) {
        const chunkLength = contents.readUInt32BE(offset);
        const chunkType = contents.toString("ascii", offset + 4, offset + 8);
        chunkTypes.push(chunkType);
        offset += chunkLength + 12;
        if (chunkType === "IEND") break;
      }
      for (const privateChunk of ["eXIf", "tEXt", "iTXt", "zTXt"]) {
        assert.ok(!chunkTypes.includes(privateChunk), `${fileName} should not contain ${privateChunk}`);
      }
    }
  }
});
