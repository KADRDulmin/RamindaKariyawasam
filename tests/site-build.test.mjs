import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

test("production output uses local optimized assets instead of browser compilation", async () => {
  const html = await readFile(path.join(DIST, "index.html"), "utf8");
  for (const forbidden of [
    "react.development.js",
    "react-dom.development.js",
    "@babel/standalone",
    "three.min.js",
    'type="text/babel"',
    "fonts.googleapis.com",
  ]) {
    assert.equal(html.includes(forbidden), false, `production HTML must not contain ${forbidden}`);
  }

  const scriptPath = html.match(/<script src="\.\/(assets\/portfolio-[^"]+\.js)" defer><\/script>/)?.[1];
  const stylesheetPath = html.match(/<link rel="stylesheet" href="\.\/(assets\/portfolio-[^"]+\.css)" \/>/)?.[1];
  assert.ok(scriptPath, "hashed production JavaScript is linked");
  assert.ok(stylesheetPath, "hashed production CSS is linked");

  const scriptBytes = (await stat(path.join(DIST, scriptPath))).size;
  const stylesheetBytes = (await stat(path.join(DIST, stylesheetPath))).size;
  assert.ok(scriptBytes < 350 * 1024, `portfolio JavaScript is unexpectedly large: ${scriptBytes} bytes`);
  assert.ok(stylesheetBytes < 70 * 1024, `portfolio CSS is unexpectedly large: ${stylesheetBytes} bytes`);
});

test("repository root is a synchronized branch-publishable Pages site", async () => {
  const distHtml = await readFile(path.join(DIST, "index.html"), "utf8");
  const rootHtml = await readFile(path.join(ROOT, "index.html"), "utf8");
  const distNotFound = await readFile(path.join(DIST, "404.html"), "utf8");
  const rootNotFound = await readFile(path.join(ROOT, "404.html"), "utf8");

  assert.equal(rootHtml, distHtml, "root index.html must match the tested production artifact");
  assert.equal(rootNotFound, distNotFound, "root 404.html must match the tested production artifact");
  assert.equal(existsSync(path.join(ROOT, ".nojekyll")), true, "branch publishing requires root .nojekyll");

  const scriptPath = rootHtml.match(/<script src="\.\/(assets\/portfolio-[^"]+\.js)" defer><\/script>/)?.[1];
  const stylesheetPath = rootHtml.match(/<link rel="stylesheet" href="\.\/(assets\/portfolio-[^"]+\.css)" \/>/)?.[1];
  assert.ok(scriptPath && existsSync(path.join(ROOT, scriptPath)), "root production JavaScript is missing");
  assert.ok(stylesheetPath && existsSync(path.join(ROOT, stylesheetPath)), "root production CSS is missing");
  assert.equal(existsSync(path.join(ROOT, "assets", "fonts", "patrick-hand-latin-400-normal.woff2")), true);
  assert.equal(existsSync(path.join(ROOT, ".github", "workflows", "deploy-pages.yml")), false);
  assert.equal(existsSync(path.join(ROOT, ".github", "workflows", "deploy-vercel.yml.disabled")), false);
  assert.equal(existsSync(path.join(ROOT, "vercel.json.example")), false);
});

test("deployment artifact contains public routes but excludes raw anniversary photographs", async () => {
  for (const relativePath of [
    "index.html",
    "404.html",
    "CNAME",
    "manifest.json",
    "assets/photo-suit.png",
    "uploads/Resume - Raminda Kariyawasam.pdf",
    "srimantha_and_geethanjali_anniversary/index.html",
    "srimantha_and_geethanjali_anniversary/anniversary.bundle.js",
  ]) {
    assert.equal(existsSync(path.join(DIST, relativePath)), true, `${relativePath} is missing from dist`);
  }
  assert.equal(existsSync(path.join(DIST, "assets", "Anniversary_Photos")), false);

  const fontFiles = await readdir(path.join(DIST, "assets", "fonts"));
  assert.ok(fontFiles.includes("patrick-hand-latin-400-normal.woff2"));
  assert.ok(fontFiles.includes("caveat-brush-latin-400-normal.woff2"));
});

test("draggable notes do not register one global move listener per card", async () => {
  const source = await readFile(path.join(ROOT, "src", "boards.jsx"), "utf8");
  assert.equal(source.includes('window.addEventListener("pointermove"'), false);
  assert.match(source, /setPointerCapture/);
});
