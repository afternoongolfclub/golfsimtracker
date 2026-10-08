// Sanity checks for a no-build, single-page app. Cheap things that are easy to
// break by hand and annoying to notice in a browser: a syntax error in the one
// big inline script, or an icon reference left pointing at a renamed file.
import { readFileSync, existsSync } from "node:fs";
import { Script } from "node:vm";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const problems = [];
const fail = (msg) => problems.push(msg);

const indexPath = join(root, "index.html");
if (!existsSync(indexPath)) {
  console.error("index.html is missing from the repository root.");
  process.exit(1);
}
const html = readFileSync(indexPath, "utf8");

// 1. The inline script has to parse. It's ~1,700 lines in one <script>, so a
//    stray brace takes the whole app down with nothing rendered.
const blocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
if (blocks.length === 0) {
  fail("No inline <script> found in index.html — the app has no code.");
}
blocks.forEach((m, i) => {
  try {
    new Script(m[1], { filename: `index.html#script${i + 1}` });
  } catch (err) {
    fail(`Inline script ${i + 1} doesn't parse: ${err.message}`);
  }
});

// 2. Everything index.html points at locally has to exist. Icons get renamed.
const refs = new Set();
for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const url = m[1];
  if (/^(https?:|data:|blob:|mailto:|#|\/\/)/.test(url)) continue;
  refs.add(url.split(/[?#]/)[0]);
}
for (const ref of refs) {
  if (!existsSync(join(root, ref))) fail(`index.html references "${ref}", which isn't in the repository.`);
}

// 3. The manifest has to be valid JSON and its icons have to exist, or
//    Add to Home Screen quietly installs a blank icon.
const manifestPath = join(root, "manifest.webmanifest");
if (existsSync(manifestPath)) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (err) {
    fail(`manifest.webmanifest isn't valid JSON: ${err.message}`);
  }
  for (const icon of manifest?.icons ?? []) {
    const src = String(icon.src || "").replace(/^\.?\//, "");
    if (src && !existsSync(join(root, src))) {
      fail(`manifest.webmanifest lists icon "${icon.src}", which isn't in the repository.`);
    }
  }
}

if (problems.length) {
  console.error("Validation failed:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`index.html OK — ${blocks.length} inline script(s) parsed, ${refs.size} local reference(s) resolved.`);
