// A working news-image-20261118 entry (Node 22, standard library only): its
// image is the entry.png beside this file, and the program copies it to
// /output/entry.png. The gate takes a whole PNG or JPEG of at most 1 MiB and
// 1024 by 1024 pixels, and the judge sees exactly the bytes copied.
//
// The image is a newspaper front page for Wednesday 18 November 2026, built
// as an HTML page and screenshotted at 1024 by 1024, so every word is real
// text, not a model's guess at lettering. It names its day in the masthead
// and leads with the day's most consequential stories across regions and
// fields, each with its own drawn picture and a short label: the APEC summit
// opening in Shenzhen with the first Trump-Xi-Putin trilateral set for the
// next day; the Quad's new plan in Manila; Ukraine's strike on the Crimean
// bridge as Russia hits Kyiv; Iran's drone attack on a US radar site in
// Bahrain; Nvidia's revenue doubling to $115.8bn; and briefs on Cyclone
// Akvan, the Prague march and North Korea's missile launch. Nothing in it
// is invented: every headline follows wire reports of 18 November 2026.
//
// Revised once after a first run: the program now checks its own output
// against the gate before finishing — it reads the copied file's PNG header
// and refuses to finish silently if the image is not a PNG, is larger than
// 1 MiB, or is wider or taller than 1024 pixels. A bad output fails loudly
// instead of reaching the judge.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');
copyFileSync(new URL('./entry.png', import.meta.url), out);

// Gate check: PNG signature, then width and height from the IHDR chunk.
const bytes = readFileSync(out);
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(pngSignature)) throw new Error('entry.png is not a PNG');
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
const size = statSync(out).size;
if (size > 1048576) throw new Error(`entry.png is ${size} bytes, over the 1 MiB gate`);
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
