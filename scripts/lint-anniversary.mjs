import { build } from "esbuild";

await build({
  entryPoints: ["srimantha_and_geethanjali_anniversary/anniversary.jsx"],
  bundle: true,
  format: "iife",
  target: ["es2020"],
  logLevel: "warning",
  outdir: ".anniversary-lint-output",
  write: false,
});
