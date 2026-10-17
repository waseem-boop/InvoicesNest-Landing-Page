const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const assetsDir = path.join(root, "public", "assets");
const references = new Map();

function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(tsx?|css|svg|json)$/.test(entry.name)) {
      for (const match of fs.readFileSync(file, "utf8").matchAll(/\/assets\/([^\s"'`()<>,;]+)/g)) {
        const name = decodeURIComponent(match[1].split(/[?#]/)[0]);
        const files = references.get(name) ?? new Set();
        files.add(path.relative(root, file));
        references.set(name, files);
      }
    }
  }
}

scan(path.join(root, "src"));
scan(assetsDir);
const assets = fs.readdirSync(assetsDir);
const missing = [...references].filter(([name]) => !assets.includes(name));
const unused = assets.filter((name) => !references.has(name));
const bytes = assets.reduce((sum, name) => sum + fs.statSync(path.join(assetsDir, name)).size, 0);
console.log(`${assets.length} assets, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
for (const [name, files] of missing) console.error(`Missing: ${name} (${[...files].join(", ")})`);
for (const name of unused) console.error(`Unreferenced: ${name}`);
if (missing.length || unused.length) process.exitCode = 1;
else console.log("All local asset references resolve; no unreferenced assets remain.");
