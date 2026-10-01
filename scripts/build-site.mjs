#!/usr/bin/env node
// Build for scanthechain.com (plain static GitHub Pages site, no bundler).
// Copies the static root into dist/ so the pipeline's stage-09 staging/deploy
// gate has a real build artifact matching production exactly.
import { readdirSync, statSync } from 'node:fs';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');

const EXCLUDE = new Set(['.git', 'node_modules', 'dist', 'scripts', 'scanthechain-launch']);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const entry of readdirSync(root)) {
  if (EXCLUDE.has(entry)) continue;
  cpSync(path.join(root, entry), path.join(dist, entry), { recursive: true });
}
console.log(`built dist/ from static root: ${root} (${readdirSync(dist).length} entries, root mtime ${statSync(root).mtime.toISOString()})`);
