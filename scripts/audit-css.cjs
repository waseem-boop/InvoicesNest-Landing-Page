const fs = require("node:fs");
const path = require("node:path");
const postcss = require("postcss");
const { parse: parseSelector } = require("css-what");

const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

function filesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

// Include JSX, config arrays, hooks, DOM selectors and print templates. Broad
// token matching deliberately retains more rules than JSX-only class extraction.
const source = filesIn(path.join(root, "src"))
  .filter((file) => /\.(tsx?|jsx?|json)$/.test(file))
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");
const tokens = new Set(source.match(/[A-Za-z_][\w-]*/g) ?? []);
const dynamicPrefixes = [...tokens].filter((token) => token.endsWith("-") && token.length >= 5);

function classCouldExist(name) {
  return tokens.has(name)
    || /^rt-\d+$/.test(name) // The support message map builds rt-1 ... rt-5.
    || dynamicPrefixes.some((prefix) => name.startsWith(prefix));
}

function selectorCouldMatch(parts) {
  return parts.every((token) => {
    if (token.type === "attribute" && token.name === "class" && token.action === "element") {
      // Keep framework/third-party/global selectors; prune only our known families.
      return !/^(rt-|nest-|clean-)/.test(token.value) || classCouldExist(token.value);
    }
    if (token.type === "pseudo" && ["is", "where", "has", "matches"].includes(token.name)
      && Array.isArray(token.data)) {
      return token.data.some(selectorCouldMatch);
    }
    // :not(), hover/focus states, attributes, tags and unknown syntax are retained.
    return true;
  });
}

function insideKeyframes(rule) {
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === "atrule" && /keyframes$/i.test(parent.name)) return true;
  }
  return false;
}

const styles = filesIn(path.join(root, "src")).filter((file) => file.endsWith(".css"));
const changes = [];
let totalRules = 0;
for (const file of styles) {
  const before = fs.readFileSync(file, "utf8");
  const ast = postcss.parse(before, { from: file });
  const removed = [];
  ast.walkRules((rule) => {
    totalRules++;
    if (insideKeyframes(rule)) return;
    let alternatives;
    try {
      alternatives = parseSelector(rule.selector);
    } catch {
      return; // An unknown selector is never evidence that a rule is unused.
    }
    // Preserve the entire selector group if even one branch could be used.
    if (!alternatives.length || alternatives.some(selectorCouldMatch)) return;
    removed.push({ selector: rule.selector, line: rule.source?.start?.line });
    rule.remove();
  });
  ast.walkAtRules((node) => {
    if (["media", "supports", "container"].includes(node.name)
      && node.nodes && node.nodes.every((child) => child.type === "comment")) node.remove();
  });
  if (removed.length) changes.push({ file: path.relative(root, file), before, after: ast.toString(), removed });
}

const removedRules = changes.reduce((sum, change) => sum + change.removed.length, 0);
console.log(`${removedRules} unused rules found out of ${totalRules}; ${totalRules - removedRules} retained.`);
for (const change of changes) console.log(`${change.file}: ${change.removed.length} unused rules`);

if (write && changes.length) {
  const backup = path.resolve(root, "../landing-backups", `css-cleanup-${new Date().toISOString().replace(/[:.]/g, "-")}`);
  fs.mkdirSync(backup, { recursive: true });
  // Snapshot all styles, including unchanged files, for a complete comparison.
  for (const file of styles) {
    const relative = path.relative(root, file);
    const target = path.resolve(backup, relative);
    if (!target.startsWith(backup + path.sep)) throw new Error("Invalid backup path");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target);
  }
  const report = {
    totalRules, removedRules,
    files: changes.map(({ file, removed }) => ({ file, removed })),
    protectedDynamicPrefixes: dynamicPrefixes,
  };
  fs.writeFileSync(path.join(backup, "removed-rules.json"), JSON.stringify(report, null, 2));
  for (const change of changes) fs.writeFileSync(path.join(root, change.file), change.after);
  console.log(`Original CSS and removal report backed up in ${backup}`);
}
