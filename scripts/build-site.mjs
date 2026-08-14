import { createHash } from "node:crypto";
import { cp, copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, transform } from "esbuild";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(projectRoot, "dist");
const outputAssets = path.join(outputDirectory, "assets");
const anniversarySource = path.join(projectRoot, "srimantha_and_geethanjali_anniversary");
const anniversaryOutput = path.join(outputDirectory, "srimantha_and_geethanjali_anniversary");

const webPath = (value) => value.split(path.sep).join("/");
const shortHash = (contents) => createHash("sha256").update(contents).digest("hex").slice(0, 10);

async function copyFileTo(source, destination) {
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputAssets, { recursive: true });

const fontAssets = [
  ["patrick-hand", "patrick-hand-latin-400-normal.woff2", "Patrick Hand", 400, "normal"],
  ["caveat-brush", "caveat-brush-latin-400-normal.woff2", "Caveat Brush", 400, "normal"],
  ["shadows-into-light", "shadows-into-light-latin-400-normal.woff2", "Shadows Into Light", 400, "normal"],
  ["space-mono", "space-mono-latin-400-normal.woff2", "Space Mono", 400, "normal"],
  ["space-mono", "space-mono-latin-700-normal.woff2", "Space Mono", 700, "normal"],
  ["gloria-hallelujah", "gloria-hallelujah-latin-400-normal.woff2", "Gloria Hallelujah", 400, "normal"],
];
const outputFonts = path.join(outputAssets, "fonts");
await mkdir(outputFonts, { recursive: true });
await Promise.all(fontAssets.map(async ([packageName, fileName]) => {
  await copyFile(
    path.join(projectRoot, "node_modules", "@fontsource", packageName, "files", fileName),
    path.join(outputFonts, fileName),
  );
}));
await Promise.all([...new Set(fontAssets.map(([packageName]) => packageName))].map(async (packageName) => {
  await copyFile(
    path.join(projectRoot, "node_modules", "@fontsource", packageName, "LICENSE"),
    path.join(outputFonts, `LICENSE-${packageName}.txt`),
  );
}));

const fontCss = fontAssets.map(([, fileName, family, weight, style]) =>
  `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:swap;src:url("./fonts/${fileName}") format("woff2")}`,
).join("\n");

const javascriptBuild = await build({
  entryPoints: [path.join(projectRoot, "src", "app.jsx")],
  outdir: outputAssets,
  entryNames: "portfolio-[hash]",
  bundle: true,
  minify: true,
  treeShaking: true,
  format: "iife",
  target: ["es2020"],
  charset: "utf8",
  legalComments: "none",
  metafile: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

const javascriptOutput = Object.entries(javascriptBuild.metafile.outputs).find(([, metadata]) =>
  metadata.entryPoint?.endsWith("src/app.jsx"),
);
if (!javascriptOutput) throw new Error("The portfolio JavaScript entry was not emitted.");
const javascriptFile = path.basename(javascriptOutput[0]);

let html = await readFile(path.join(projectRoot, "index.html"), "utf8");
const inlineStyle = html.match(/<style>([\s\S]*?)<\/style>/);
if (!inlineStyle) throw new Error("The portfolio stylesheet block is missing from index.html.");

const performanceCss = `
.note{transform:translate3d(var(--drag-x,0px),var(--drag-y,0px),0) rotate(var(--rot,-2deg))}
.note:hover{transform:translate3d(var(--drag-x,0px),var(--drag-y,0px),0) rotate(0deg) translateY(-4px)}
.draggable.dragging{will-change:transform;transition:none}
.cursor-pencil{will-change:transform,opacity}
.cursor-pencil.pressed{--cursor-scale:.85}
.ink-dot{animation:ink-trail var(--trail-life,560ms) ease-out forwards;will-change:transform,opacity}
.ink-dot svg{display:block;width:14px;height:14px}
@keyframes ink-trail{from{opacity:.75;transform:translate(-50%,-50%) rotate(var(--trail-rotation,0deg))}to{opacity:0;transform:translate(-50%,-50%) translateY(var(--trail-shift,10px)) rotate(var(--trail-rotation,0deg)) scale(var(--trail-scale,.5))}}
.project-card{content-visibility:auto;contain-intrinsic-size:auto 390px}
.contact-note:hover{transform:translate3d(var(--drag-x,0px),var(--drag-y,0px),0) rotate(-1.5deg)}
.board-divider{position:relative;z-index:2;height:40px;margin:-20px 0;overflow:visible;pointer-events:none}
.board-divider svg{display:block;width:100%;height:40px;opacity:.35}
.board-divider path{fill:none;stroke:var(--ink-soft);stroke-width:2;stroke-linecap:round}
.confetti-particle{position:fixed;z-index:9100;pointer-events:none;border:1.5px solid rgba(42,36,31,.35);will-change:transform,opacity}
@media (prefers-reduced-motion:reduce){html,body,a,button,input,textarea,select{cursor:auto!important}.cursor-pencil,.ink-dot{display:none!important}.note:hover{transform:translate3d(var(--drag-x,0px),var(--drag-y,0px),0) rotate(var(--rot,0deg))}}
`;
const stylesheet = await transform(`${fontCss}\n${inlineStyle[1]}\n${performanceCss}`, {
  loader: "css",
  minify: true,
  target: "es2020",
});
const stylesheetFile = `portfolio-${shortHash(stylesheet.code)}.css`;
await writeFile(path.join(outputAssets, stylesheetFile), stylesheet.code, "utf8");

html = html
  .replace(/\s*<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/, "")
  .replace(/\s*<!-- Microsoft Clarity -->[\s\S]*?<\/script>/, "")
  .replace(/\s*<!-- Google tag \(gtag\.js\) -->[\s\S]*?<script>[\s\S]*?<\/script>/, "")
  .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>[\s\S]*?rel="stylesheet"\s*\/>/, "")
  .replace(inlineStyle[0], [
    `    <link rel="preload" href="./assets/fonts/patrick-hand-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />`,
    `    <link rel="preload" href="./assets/photo-suit.png" as="image" fetchpriority="high" />`,
    `    <link rel="stylesheet" href="./assets/${stylesheetFile}" />`,
  ].join("\n"))
  .replace(/\s*<!-- Spline viewer web component \(used by 404 page\) -->[\s\S]*?<!-- Vanilla helpers: cursor, theme, tabs -->\s*<script>[\s\S]*?<\/script>\s*(?=<\/body>)/, `\n    <script src="./assets/${javascriptFile}" defer></script>\n  `)
  .replace('<html lang="en">', '<html lang="en" class="theme-light">')
  .replace('<body class="theme-light">', "<body>")
  .replace(/\s*<link rel="icon" type="image\/png" sizes="32x32" href="\/favicon-32x32\.png" \/>/, "")
  .replace(/\s*<link rel="icon" type="image\/png" sizes="16x16" href="\/favicon-16x16\.png" \/>/, '\n    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />')
  .replace(
    '    <meta charset="utf-8" />',
    '    <meta charset="utf-8" />\n    <script>try{const t=localStorage.getItem("rk-theme");if(t==="dark"){document.documentElement.classList.replace("theme-light","theme-dark")}}catch{}</script>',
  );

for (const forbidden of ["react.development.js", "@babel/standalone", "three.min.js", "type=\"text/babel\""]) {
  if (html.includes(forbidden)) throw new Error(`Production HTML still contains ${forbidden}.`);
}
await writeFile(path.join(outputDirectory, "index.html"), html, "utf8");

const rootFiles = [
  "CNAME",
  "robots.txt",
  "sitemap.xml",
  "manifest.json",
  "llms.txt",
  "favicon.svg",
  "favicon.ico",
  "favicon-96x96.png",
  "apple-touch-icon.png",
];
await Promise.all(rootFiles.map((fileName) => copyFileTo(
  path.join(projectRoot, fileName),
  path.join(outputDirectory, fileName),
)));

const rootEntries = await readdir(projectRoot, { withFileTypes: true });
await Promise.all(rootEntries
  .filter((entry) => entry.isFile() && /^[a-f0-9]{32}\.txt$/i.test(entry.name))
  .map((entry) => copyFileTo(path.join(projectRoot, entry.name), path.join(outputDirectory, entry.name))));

for (const fileName of ["photo-suit.png", "photo-suit-pose.png", "photo-grad.png", "photo-degree-looking.png", "og-card.png"]) {
  await copyFileTo(path.join(projectRoot, "assets", fileName), path.join(outputAssets, fileName));
}

const uploadsOutput = path.join(outputDirectory, "uploads");
const uploadEntries = await readdir(path.join(projectRoot, "uploads"), { withFileTypes: true });
await Promise.all(uploadEntries
  .filter((entry) => entry.isFile() && (entry.name.endsWith(".pdf") || /^(desktop|mobile)-screenshot/.test(entry.name)))
  .map((entry) => copyFileTo(path.join(projectRoot, "uploads", entry.name), path.join(uploadsOutput, entry.name))));

await mkdir(anniversaryOutput, { recursive: true });
process.env.ANNIVERSARY_OUTPUT_DIR = anniversaryOutput;
await import("./build-anniversary.mjs");
delete process.env.ANNIVERSARY_OUTPUT_DIR;

const anniversaryStyles = await readFile(path.join(anniversarySource, "styles.css"), "utf8");
const minifiedAnniversaryStyles = await transform(anniversaryStyles, { loader: "css", minify: true, target: "es2020" });
await writeFile(path.join(anniversaryOutput, "styles.css"), minifiedAnniversaryStyles.code, "utf8");
await copyFileTo(path.join(anniversarySource, "favicon.svg"), path.join(anniversaryOutput, "favicon.svg"));
await cp(path.join(anniversarySource, "assets", "images"), path.join(anniversaryOutput, "assets", "images"), { recursive: true });

let notFoundHtml = await readFile(path.join(projectRoot, "404.html"), "utf8");
notFoundHtml = notFoundHtml
  .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>[\s\S]*?<link href="https:\/\/fonts\.googleapis\.com[\s\S]*?rel="stylesheet" \/>/, "")
  .replace("  <style>", `  <style>\n${fontCss.replaceAll('url("./fonts/', 'url("./assets/fonts/')}`);
await writeFile(path.join(outputDirectory, "404.html"), notFoundHtml, "utf8");
await writeFile(path.join(outputDirectory, ".nojekyll"), "", "utf8");

async function directorySize(directory) {
  let bytes = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    bytes += entry.isDirectory() ? await directorySize(entryPath) : (await stat(entryPath)).size;
  }
  return bytes;
}

const javascriptBytes = (await stat(path.join(outputAssets, javascriptFile))).size;
const stylesheetBytes = (await stat(path.join(outputAssets, stylesheetFile))).size;
const totalBytes = await directorySize(outputDirectory);
console.log(`Built ${webPath(path.relative(projectRoot, outputDirectory))}/ for GitHub Pages`);
console.log(`Portfolio bundle: ${(javascriptBytes / 1024).toFixed(1)} KB; CSS: ${(stylesheetBytes / 1024).toFixed(1)} KB`);
console.log(`Deploy artifact: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
