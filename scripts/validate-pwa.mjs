import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const manifestPath = join(publicDir, "manifest.json");
const knownRoutes = new Set(["/", "/melodies", "/about", "/preparatory", "/help"]);

function fail(message) {
  console.error(`[validate:pwa] ${message}`);
  process.exitCode = 1;
}

function assertPublicFile(publicPath, label) {
  if (!publicPath.startsWith("/")) {
    fail(`${label} must start with "/": ${publicPath}`);
    return;
  }

  const filePath = join(publicDir, publicPath.slice(1));
  if (!existsSync(filePath)) {
    fail(`${label} points to a missing file: ${publicPath}`);
  }
}

if (!existsSync(manifestPath)) {
  fail("public/manifest.json is missing");
  process.exit();
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

for (const field of ["name", "short_name", "start_url", "display", "icons"]) {
  if (!manifest[field]) fail(`manifest.json is missing "${field}"`);
}

if (!knownRoutes.has(manifest.start_url)) {
  fail(`manifest start_url is not a known route: ${manifest.start_url}`);
}

for (const [index, icon] of (manifest.icons ?? []).entries()) {
  if (!icon.src || !icon.sizes || !icon.type) {
    fail(`manifest icon #${index + 1} is missing src, sizes, or type`);
    continue;
  }
  assertPublicFile(icon.src, `manifest icon #${index + 1}`);
}

for (const [index, shortcut] of (manifest.shortcuts ?? []).entries()) {
  if (!knownRoutes.has(shortcut.url)) {
    fail(`manifest shortcut #${index + 1} points to an unknown route: ${shortcut.url}`);
  }

  for (const [iconIndex, icon] of (shortcut.icons ?? []).entries()) {
    assertPublicFile(
      icon.src,
      `manifest shortcut #${index + 1} icon #${iconIndex + 1}`,
    );
  }
}

if (!existsSync(join(publicDir, "sw.js"))) {
  fail("public/sw.js is missing");
}

if (!process.exitCode) {
  console.log("[validate:pwa] manifest and service worker references are valid");
}
