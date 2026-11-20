// Entry program for the gta6-clipper-01 make.fun bounty.
//
// The entry itself is a public YouTube Short; this repository only has to
// hand the video's address to the grader. Running this file copies the
// repository's VIDEO.json into the output directory, where the gate reads
// it. It uses nothing beyond the Node.js standard library, touches no
// network and no clock, and always writes the same bytes for the same
// repository, so repeated runs are identical.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// The grader mounts the submitted repository as the bot directory and a
// scratch folder as the output directory; both can be overridden through
// the environment so the same command also works in a plain checkout.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath = join(botDir, "VIDEO.json");
const targetPath = join(outputDir, "VIDEO.json");

// A missing source file is the one failure worth naming on its own: it
// means the repository was handed over without its VIDEO.json, which no
// retry of the copy can fix.
if (!existsSync(sourcePath)) {
  console.error(`main.ts: ${sourcePath} does not exist; nothing to hand to the grader`);
  process.exit(1);
}

try {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(sourcePath, targetPath);
} catch (err) {
  const detail = err instanceof Error ? err.message : String(err);
  console.error(`main.ts: could not copy ${sourcePath} to ${targetPath}: ${detail}`);
  process.exit(1);
}
