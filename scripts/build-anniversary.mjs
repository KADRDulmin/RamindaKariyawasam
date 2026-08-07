import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "esbuild";
import { ANNIVERSARY_EVENT as event } from "../srimantha_and_geethanjali_anniversary/event-config.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const routeDirectory = path.join(
  projectRoot,
  "srimantha_and_geethanjali_anniversary",
);

const fontDirectory = path.join(routeDirectory, "assets", "fonts");
await mkdir(fontDirectory, { recursive: true });
const fontAssets = [
  [
    path.join(projectRoot, "node_modules", "@fontsource-variable", "cormorant-garamond", "files", "cormorant-garamond-latin-wght-normal.woff2"),
    "cormorant-garamond-latin-wght-normal.woff2",
  ],
  [
    path.join(projectRoot, "node_modules", "@fontsource-variable", "cormorant-garamond", "files", "cormorant-garamond-latin-wght-italic.woff2"),
    "cormorant-garamond-latin-wght-italic.woff2",
  ],
  [
    path.join(projectRoot, "node_modules", "@fontsource-variable", "manrope", "files", "manrope-latin-wght-normal.woff2"),
    "manrope-latin-wght-normal.woff2",
  ],
  [
    path.join(projectRoot, "node_modules", "@fontsource-variable", "cormorant-garamond", "LICENSE"),
    "LICENSE-Cormorant-Garamond.txt",
  ],
  [
    path.join(projectRoot, "node_modules", "@fontsource-variable", "manrope", "LICENSE"),
    "LICENSE-Manrope.txt",
  ],
];
await Promise.all(
  fontAssets.map(([source, fileName]) => copyFile(source, path.join(fontDirectory, fileName))),
);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const absoluteUrl = (relativePath) => new URL(relativePath, event.publicUrl).href;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.calendar.title,
  description: event.metadata.description,
  startDate: event.startIso,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: event.publicUrl,
  image: [
    absoluteUrl(event.metadata.ogImage),
    absoluteUrl(event.metadata.feedImage),
    absoluteUrl(event.metadata.storyImage),
  ],
  location: {
    "@type": "Place",
    name: event.venue.name,
    url: event.venue.website,
    address: {
      "@type": "PostalAddress",
      streetAddress: "31A New Hospital Road",
      addressLocality: "Sri Jayawardenepura Kotte",
      postalCode: "10100",
      addressCountry: "LK",
    },
  },
  organizer: [
    { "@type": "Person", name: event.couple.firstName },
    { "@type": "Person", name: event.couple.secondName },
  ],
};

const replacements = {
  PAGE_TITLE: event.metadata.title,
  PAGE_DESCRIPTION: event.metadata.description,
  PUBLIC_URL: event.publicUrl,
  PUBLIC_PATH: event.publicPath,
  THEME_COLOR: event.metadata.themeColor,
  OG_IMAGE_URL: absoluteUrl(event.metadata.ogImage),
  FEED_IMAGE_URL: absoluteUrl(event.metadata.feedImage),
  STORY_IMAGE_URL: absoluteUrl(event.metadata.storyImage),
  OG_LOCALE: event.metadata.locale,
  EVENT_NAME: event.calendar.title,
  COUPLE_NAMES: event.couple.displayName,
  FIRST_NAME: event.couple.firstName,
  SECOND_NAME: event.couple.secondName,
  MONOGRAM: event.couple.monogram,
  ANNIVERSARY_YEARS: event.anniversaryYears,
  OCCASION: event.occasion,
  HEADLINE: event.headline,
  INVITATION_MESSAGE: event.invitationMessage,
  CLOSING_MESSAGE: event.closingMessage,
  DATE_LABEL: event.dateLabel,
  SHORT_DATE_LABEL: event.shortDateLabel,
  TIME_LABEL: event.timeLabel,
  START_ISO: event.startIso,
  TIME_ZONE: event.timeZone,
  VENUE_NAME: event.venue.name,
  VENUE_ADDRESS: event.venue.address,
  VENUE_WEBSITE: event.venue.website,
  DIRECTIONS_URL: event.venue.directionsUrl,
  CALENDAR_FILE: event.calendar.fileName,
  RSVP_PRIVACY_NOTICE: event.rsvp.privacyNotice,
  STRUCTURED_DATA: JSON.stringify(structuredData, null, 2).replaceAll("<", "\\u003c"),
};

const templatePath = path.join(routeDirectory, "index.template.html");
const outputPath = path.join(routeDirectory, "index.html");
let html = await readFile(templatePath, "utf8");

for (const [token, rawValue] of Object.entries(replacements)) {
  const value = token === "STRUCTURED_DATA" ? rawValue : escapeHtml(rawValue);
  html = html.replaceAll(`{{${token}}}`, value);
}

const unresolvedTokens = html.match(/{{[A-Z0-9_]+}}/g);
if (unresolvedTokens) {
  throw new Error(`Unresolved template tokens: ${unresolvedTokens.join(", ")}`);
}

await writeFile(outputPath, html, "utf8");

const escapeIcs = (value) =>
  String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("\r\n", "\\n")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");

const foldIcsLine = (line) => {
  const lines = [];
  let current = "";
  for (const character of line) {
    const candidate = current + character;
    const byteLimit = lines.length === 0 ? 75 : 74;
    if (Buffer.byteLength(candidate, "utf8") > byteLimit) {
      lines.push(current);
      current = ` ${character}`;
    } else {
      current = candidate;
    }
  }
  lines.push(current);
  return lines.join("\r\n");
};

const now = new Date();
const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const startLocal = event.startLocal.replaceAll("-", "").replaceAll(":", "");
const icsLines = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "PRODID:-//Raminda Kariyawasam//Silver Jubilee Invitation//EN",
  "X-WR-CALNAME:Srimantha & Geethanjali — 25th Anniversary",
  `X-WR-TIMEZONE:${event.timeZone}`,
  "BEGIN:VTIMEZONE",
  `TZID:${event.timeZone}`,
  `X-LIC-LOCATION:${event.timeZone}`,
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0530",
  "TZOFFSETTO:+0530",
  "TZNAME:+0530",
  "DTSTART:19700101T000000",
  "END:STANDARD",
  "END:VTIMEZONE",
  "BEGIN:VEVENT",
  `UID:${event.id}@ramindak.com`,
  `DTSTAMP:${stamp}`,
  `DTSTART;TZID=${event.timeZone}:${startLocal}`,
  `SUMMARY:${escapeIcs(event.calendar.title)}`,
  `DESCRIPTION:${escapeIcs(event.calendar.description)}`,
  `LOCATION:${escapeIcs(`${event.venue.name}, ${event.venue.address}`)}`,
  `URL:${event.publicUrl}`,
  "STATUS:CONFIRMED",
  "TRANSP:OPAQUE",
  "SEQUENCE:0",
  "END:VEVENT",
  "END:VCALENDAR",
];

const calendarContents = `${icsLines.map(foldIcsLine).join("\r\n")}\r\n`;
await writeFile(
  path.join(routeDirectory, event.calendar.fileName),
  calendarContents,
  "utf8",
);

const bundlePath = path.join(routeDirectory, "anniversary.bundle.js");
await build({
  entryPoints: [path.join(routeDirectory, "anniversary.jsx")],
  outfile: bundlePath,
  bundle: true,
  minify: true,
  treeShaking: true,
  format: "iife",
  target: ["es2020"],
  charset: "utf8",
  legalComments: "none",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
console.log(`Generated ${path.join(path.basename(routeDirectory), event.calendar.fileName)}`);
console.log(`Bundled ${path.relative(projectRoot, bundlePath)}`);
console.log(`Copied ${fontAssets.length} self-hosted font assets and licenses`);
