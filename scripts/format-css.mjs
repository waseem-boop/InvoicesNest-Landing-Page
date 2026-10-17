import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";

// Format authored CSS only. Never rewrite generated .next or dependency files.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const write = process.argv.includes("--write");

async function cssFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? cssFiles(file) : entry.name.endsWith(".css") ? [file] : [];
  }));
  return files.flat();
}

let changed = 0;
for (const file of await cssFiles(path.join(root, "src"))) {
  const before = await fs.readFile(file, "utf8");
  const after = await prettier.format(before, {
    filepath: file,
    parser: "css",
    tabWidth: 2,
    useTabs: false,
    printWidth: 100,
    endOfLine: "lf",
  });
  if (before === after) continue;
  changed++;
  console.log(`${write ? "Formatted" : "Needs formatting"}: ${path.relative(root, file)}`);
  if (write) await fs.writeFile(file, after);
}
console.log(changed ? `${changed} CSS file(s) ${write ? "formatted" : "need formatting"}.` : "CSS formatting is consistent.");
if (!write && changed) process.exitCode = 1;
