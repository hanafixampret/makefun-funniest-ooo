import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I set this auto-reply in March, forgot to turn it off, and have been back for months — I just like the quiet.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const trimmed = ENTRY.trim();
if (trimmed.length < 1 || trimmed.length > 140) {
  throw new Error(`entry must be 1-140 characters, got ${trimmed.length}`);
}
if (trimmed.includes("\n") || trimmed.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (trimmed !== ENTRY) {
  throw new Error("entry has leading or trailing whitespace");
}

const target = join(outDir, "entry.txt");
writeFileSync(target, trimmed, "utf8");

// Round-trip guard: what we wrote must read back byte-identical.
const back = readFileSync(target, "utf8");
if (back !== trimmed) {
  throw new Error("round-trip check failed: entry.txt differs from entry");
}

console.log(`wrote ${target} (${trimmed.length} chars, 1 line)`);
