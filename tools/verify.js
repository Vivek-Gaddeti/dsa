/* Verifies every code sample on the site by actually running it with Python.
   - NeetCode: brute/better/opt code + p.run must print exactly p.out
   - Topics/Patterns/Python pages: every ['code', code, output] block and every example {code,out}
   Usage:  node tools/verify.js [filter]          */
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
// Python must print UTF-8 (samples print symbols like ←, ✓), whatever the Windows console code page is
const PYENV = { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };
const root = path.join(__dirname, "..");
global.window = global;
global.R = String.raw;
global.document = { addEventListener() {} };
require(path.join(root, "assets/site.js"));
const load = (f) => { const src = fs.readFileSync(f, "utf8"); new Function(src)(); };
load(path.join(root, "data/nc/helpers.js"));
const ncDir = path.join(root, "data/nc");
fs.readdirSync(ncDir).filter((f) => /^\d/.test(f)).sort().forEach((f) => load(path.join(ncDir, f)));

["topics.js", "patterns.js", "patterns-2.js", "python-1.js", "python-2.js", "python-3.js", "python-dsa.js"].forEach((f) => load(path.join(root, "data", f)));

const filter = process.argv[2] || "";
const jobs = [];
NC.forEach((p) => {
  if (filter && !p.id.includes(filter) && !p.cat.includes(filter)) return;
  const pre = p.h ? NC_HELPERS[p.h] + "\n" : "";
  [["opt", p.opt], ["brute", p.brute], ["better", p.better]].forEach(([k, a]) => {
    if (!a || !a.code || a.run === false) return;
    const own = typeof a.run === "string"; // approach-specific driver (e.g. smaller input for slow brute force)
    jobs.push({ name: `nc:${p.id}:${k}`, code: pre + a.code + "\n\n" + (own ? a.run : p.run || ""), out: own ? a.out : p.out });
  });
});
const blocks = (secs, tag) => (secs || []).forEach((s) => (s.blocks || []).forEach((b, i) => {
  if (filter && !s.id.includes(filter) && !tag.includes(filter)) return;
  if (b[0] === "code" && b[2] != null && b[2] !== "" && !b[4]) jobs.push({ name: `${tag}:${s.id}#${i}`, code: b[1], out: b[2] });
  if (b[0] === "ex" && b[1].code && b[1].out != null) jobs.push({ name: `${tag}:${s.id}#${i}:${b[1].t}`, code: b[1].code, out: b[1].out });
}));
blocks(global.TOPICS, "topic"); blocks(global.PATTERNS, "pattern"); blocks(global.PY, "py"); blocks(global.PYDSA, "pydsa");
// code inside Q&A answers: ['qa', question, [blocks...]]
[["py", global.PY], ["pydsa", global.PYDSA]].forEach(([tag, secs]) => (secs || []).forEach((s) => (s.blocks || []).forEach((b, i) => {
  if (b[0] === "qa" && Array.isArray(b[2])) blocks([{ id: s.id + "#qa" + i, blocks: b[2] }], tag);
})));

const tmp = path.join(require("os").tmpdir(), "dsa-verify");
fs.mkdirSync(tmp, { recursive: true });
let bad = 0;
jobs.forEach((j, n) => {
  const f = path.join(tmp, `job${n}.py`);
  fs.writeFileSync(f, j.code);
  let got;
  try { got = execFileSync("python", [f], { encoding: "utf8", timeout: 20000, cwd: tmp, stdio: ["pipe", "pipe", "pipe"], env: PYENV }); }
  catch (e) { got = (e.stdout || "") + "\n!!ERROR!! " + (e.stderr || e.message).split("\n").slice(-4).join("\n"); }
  const norm = (s) => String(s).replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/^\n+|\n+$/g, "");
  if (norm(got) !== norm(j.out)) { bad++; console.log(`\n✗ ${j.name}\n--- expected ---\n${norm(j.out)}\n--- got ---\n${norm(got)}`); }
});
console.log(`\n${jobs.length - bad}/${jobs.length} code samples OK` + (bad ? `, ${bad} FAILED` : ""));
process.exit(bad ? 1 : 0);
