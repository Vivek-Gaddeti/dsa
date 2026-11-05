/* Writes PATTERNS-SITE-HANDOFF.md: every pattern (data/patterns*.js) as readable Markdown, plus notes for building a patterns-only site.
   Usage: node tools/patterns-doc.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
global.R = String.raw; global.PATTERNS = [];
for (const f of ["data/patterns.js", "data/patterns-2.js"]) (0, eval)(fs.readFileSync(path.join(root, f), "utf8"));
const fence = (c) => "```python\n" + String(c).replace(/^\n/, "").replace(/\s+$/, "") + "\n```\n";
const bq = (s) => String(s).split("\n").map((l) => "> " + l).join("\n") + "\n";
function block(b) {
  const [t, a, c, d] = b;
  switch (t) {
    case "h": return `\n#### ${a}\n`;
    case "p": return a + "\n";
    case "list": return a.map((x) => "- " + x).join("\n") + "\n";
    case "code": return fence(a) + (c ? "Output: `" + String(c).replace(/\n/g, " ⏎ ") + "`\n" : "");
    case "table": return "| " + a.join(" | ") + " |\n|" + a.map(() => "---").join("|") + "|\n" + c.map((r) => "| " + r.join(" | ") + " |").join("\n") + "\n";
    case "tip": return bq("**Tip:** " + a);
    case "warn": return bq("**Warning:** " + a);
    case "danger": return bq("**Pitfall:** " + a);
    case "diagram": return `*[diagram: ${a}]* ${d || ""}\n`;
    case "viz": return `*[interactive visualiser: ${a}]*\n`;
    case "ex": {
      let s = `\n##### ${a.t}${a.d ? " (" + a.d + ")" : ""}${a.lc ? ", LeetCode " + a.lc : ""}\n`;
      if (a.q) s += `**Question:** ${a.q}\n\n`;
      if (a.idea) s += `**Idea:** ${a.idea}\n\n`;
      if (a.code) s += fence(a.code);
      if (a.out) s += "Output: `" + String(a.out).replace(/\n/g, " ⏎ ") + "`\n";
      if (a.cx) s += `\n**Complexity:** ${a.cx}\n`;
      const known = ["t", "d", "lc", "open", "q", "idea", "code", "out", "cx"];
      Object.keys(a).filter((k) => !known.includes(k)).forEach((k) => (s += `\n**${k}:** ${typeof a[k] === "string" ? a[k] : JSON.stringify(a[k])}\n`));
      return s;
    }
    default: return `*[${t}: ${JSON.stringify(b.slice(1)).slice(0, 200)}]*\n`;
  }
}
const groups = [...new Set(PATTERNS.map((p) => p.group))];
let out = `# Patterns-only site: hand-off + full pattern content

Use this document as the starting context for a new session that builds a **separate website only about DSA patterns**. Part 1 is the build brief; Part 2 is the complete content of all ${PATTERNS.length} patterns taken from the Study Hub site (\`data/patterns.js\`, \`data/patterns-2.js\`).

## Part 1: Build brief

- **What to build:** a static, offline-friendly site (plain HTML/CSS/JS, works from \`file://\`, no build step required) that teaches DSA **patterns**: how to recognise each one, a reusable template, worked examples, pitfalls, complexity.
- **Look and feel:** same family as Study Hub: soft, minimal, refined. Dark and light themes, subtle slow animations, SVG line icons only (no emoji), no hover halo, no button size shifts.
- **Per pattern page:** title, one-line summary, tags (complexity), "Recognize it when…", template code, diagram or visualiser where it helps, worked examples (title, difficulty, LeetCode number, question, idea, code, output, complexity), tips / warnings / pitfalls.
- **Features worth carrying over:** progress per pattern (seen / learned / needs revision) in localStorage, bookmarks and notes, Ctrl+K finder, sidebar grouped by category (${groups.join(", ")}), previous/next, a pattern-recogniser quiz ("which pattern fits this problem?"), optional in-browser Python (Pyodide in a Web Worker) for "Edit & run".
- **Data shape** (one object per pattern): \`{ id, group, title, sub, tags: [], blocks: [] }\`. Block kinds: \`["h", text]\`, \`["p", md]\`, \`["list", [md…]]\`, \`["code", source, expectedOutput]\`, \`["table", headers, rows]\`, \`["tip"|"warn"|"danger", md]\`, \`["diagram", kind, data, caption]\`, \`["viz", name]\`, \`["ex", { t, d, lc, q, idea, code, out, cx }]\`. Inline markdown: \`**bold**\`, \`*italic*\`, backticks.
- **Where the original code lives:** the Study Hub folder (\`Desktop\DSA\`): \`assets/common.js\` (store, icons, doc renderer), \`assets/py.js\` (Python runner), \`assets/viz.js\` (visualisers), \`data/patterns*.js\` (this content), \`tools/pages.py\` (page generator). Copy and trim rather than rewrite.
- **Ideas to go further:** a "which pattern?" decision flowchart, side-by-side comparison of similar patterns (sliding window vs two pointers, BFS vs DFS), a problem index mapping LeetCode numbers to patterns, spaced-revision of patterns.

## Part 2: Pattern content

**Patterns (${PATTERNS.length}):** ${PATTERNS.map((p) => p.title).join(" · ")}
`;
for (const g of groups) {
  out += `\n---\n\n## ${g}\n`;
  for (const p of PATTERNS.filter((x) => x.group === g)) {
    out += `\n### ${p.title}\n\n*id: \`${p.id}\`*${p.tags && p.tags.length ? " · " + p.tags.join(" · ") : ""}\n\n${p.sub || ""}\n`;
    for (const b of p.blocks) out += block(b);
  }
}
fs.writeFileSync(path.join(root, "PATTERNS-SITE-HANDOFF.md"), out);
console.log("wrote PATTERNS-SITE-HANDOFF.md,", PATTERNS.length, "patterns,", Math.round(out.length / 1024) + " KB");
