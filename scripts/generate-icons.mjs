// Generates the static app icons from the shared monogram in app/monogram.ts.
// Run with: node scripts/generate-icons.mjs
// Writes app/icon.svg, app/favicon.ico (16, 32, 48 px) and app/apple-icon.png (180 px).
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { monogramSvg } from "../app/monogram.ts";

const app = (name) => fileURLToPath(new URL(`../app/${name}`, import.meta.url));
const DOT = "#ededed"; // default monochrome accent; the live favicon recolours it at runtime

const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 * (size / 32) * 4 }).resize(size, size).png().toBuffer();

// ICO container holding PNG-compressed images (supported by every current browser).
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const svg = monogramSvg(DOT);
await writeFile(app("icon.svg"), svg + "\n");

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(svg, size) })));
await writeFile(app("favicon.ico"), ico(images));

// iOS applies its own rounded mask, so the home-screen icon is full-bleed.
await writeFile(app("apple-icon.png"), await png(monogramSvg(DOT, { rounded: false }), 180));

console.log("Wrote app/icon.svg, app/favicon.ico, app/apple-icon.png");
