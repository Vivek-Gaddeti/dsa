/* Site config: one site for DSA (topics, patterns, NeetCode 150) and Python (complete guide, Python for DSA) */
window.SITE = {
  storeKey: "study:v1",                                             // all progress, notes and bookmarks (older per-site saves are merged in once, see common.js)
  brand: "Study Hub",
  logo: "SH",
  home: "index.html",
  mascot: "turtle",                                                    // walks along the bottom of the sidebar as you progress (a page can pass its own)
  ring: { prefixes: ["topic:", "pattern:", "nc:", "py:", "pydsa:"], total: 270, label: "items done" },   // progress ring around the logo
  // [href, label] or [href, label, [[href, label, subtitle], …]] for a link with a small menu
  links: [
    ["index.html", "Home"],
    ["topics.html", "Learn"],
    ["patterns.html", "Patterns"],
    ["neetcode.html", "Practice"],
    ["python.html", "Python", [
      ["python.html", "Complete Guide", "The whole language, step by step"],
      ["python-dsa.html", "Python for DSA", "Just what coding problems need"],
    ]],
    ["revision.html", "Revision"],
  ],
};

/* Data containers filled by data/*.js */
window.TOPICS = window.TOPICS || [];
window.PATTERNS = window.PATTERNS || [];
window.NC = window.NC || [];
window.PY = window.PY || [];
window.PYDSA = window.PYDSA || [];
window.NC_CATS = [
  "Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search", "Linked List",
  "Trees", "Tries", "Heap / Priority Queue", "Backtracking", "Graphs", "Advanced Graphs",
  "1-D DP", "2-D DP", "Greedy", "Intervals", "Math & Geometry", "Bit Manipulation",
];
/* one small line icon per NeetCode category (24×24, drawn with the current text colour) */
window.NC_ICONS = {
  "Arrays & Hashing": '<rect x="2.5" y="7" width="19" height="10" rx="2"/><path d="M8.8 7v10M15.2 7v10"/>',
  "Two Pointers": '<path d="M3 12h6M6.5 8.5 10 12l-3.5 3.5M21 12h-6M17.5 8.5 14 12l3.5 3.5"/>',
  "Sliding Window": '<rect x="2.5" y="9" width="19" height="6" rx="1.5"/><rect x="6.5" y="5.5" width="8" height="13" rx="2.2"/>',
  "Stack": '<path d="M12 3.5 3.5 7.8 12 12l8.5-4.2z"/><path d="m3.5 12.2 8.5 4.3 8.5-4.3"/><path d="m3.5 16.4 8.5 4.1 8.5-4.1"/>',
  "Binary Search": '<circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.3 5.3M10.5 6.8v7.4"/>',
  "Linked List": '<rect x="2.5" y="9" width="6" height="6" rx="1.6"/><rect x="15.5" y="9" width="6" height="6" rx="1.6"/><path d="M8.5 12h6.5M12.8 9.8 15 12l-2.2 2.2"/>',
  "Trees": '<circle cx="12" cy="5" r="2.2"/><circle cx="6" cy="18.5" r="2.2"/><circle cx="18" cy="18.5" r="2.2"/><path d="M11 7 7 16.4M13 7l4 9.4"/>',
  "Tries": '<path d="M12 3.5v4M12 7.5l-6.5 5M12 7.5v5M12 7.5l6.5 5"/><circle cx="5.5" cy="14.5" r="2"/><circle cx="12" cy="14.5" r="2"/><circle cx="18.5" cy="14.5" r="2"/><path d="M12 16.5v3.5"/>',
  "Heap / Priority Queue": '<circle cx="12" cy="5" r="2.1"/><circle cx="7.5" cy="12" r="2.1"/><circle cx="16.5" cy="12" r="2.1"/><circle cx="4.8" cy="19" r="2.1"/><circle cx="10.2" cy="19" r="2.1"/><path d="m10.8 6.8-2.1 3.4M13.2 6.8l2.1 3.4M6.6 13.9l-.9 3.1M8.4 13.9l.9 3.1"/>',
  "Backtracking": '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  "Graphs": '<circle cx="6" cy="6.5" r="2.4"/><circle cx="18" cy="8" r="2.4"/><circle cx="10.5" cy="18" r="2.4"/><path d="m8.4 6.8 7.2.9M7 8.8l2.5 6.8M16.4 10l-4.4 6.1"/>',
  "Advanced Graphs": '<circle cx="5" cy="6" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="12" cy="18.5" r="2.2"/><path d="M7.2 6h9.6M6.2 8 10.9 16.5M17.8 8l-4.7 8.5"/><path d="M11 3.2h2"/>',
  "1-D DP": '<rect x="2.5" y="10" width="5" height="6" rx="1.2"/><rect x="9.5" y="10" width="5" height="6" rx="1.2"/><rect x="16.5" y="10" width="5" height="6" rx="1.2"/><path d="M5 7.5c1.8-2 5.2-2 7 0M12 7.5c1.8-2 5.2-2 7 0"/>',
  "2-D DP": '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  "Greedy": '<path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z"/>',
  "Intervals": '<path d="M3 8h11M10 16h11"/><path d="M3 5.5v5M14 5.5v5M10 13.5v5M21 13.5v5"/>',
  "Math & Geometry": '<path d="M4 20 12 4l8 16z"/><path d="M8.3 13h7.4"/>',
  "Bit Manipulation": '<rect x="3" y="6" width="7.5" height="12" rx="3.75"/><path d="M16.5 6v12M14 8.5 16.5 6"/>',
};
window.ncIcon = (cat, cls = "") => window.NC_ICONS[cat] ? `<svg class="cat-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${window.NC_ICONS[cat]}</svg>` : "";
/* NC.add(category, [problems]) — called from data/nc/*.js */
window.NC.add = function (cat, list) {
  list.forEach((p) => { p.cat = cat; NC.push(p); });
};

/* Every trackable thing on the site, keyed the same way as Store items */
function siteIndex() {
  const idx = {};
  NC.forEach((p, i) => (idx["nc:" + p.id] = { type: "Problem", title: p.t, href: "neetcode.html#p/" + p.id, d: p.d, cat: p.cat, order: i, p }));
  PATTERNS.forEach((s) => (idx["pattern:" + s.id] = { type: "Pattern", title: s.title, href: "patterns.html#" + s.id, cat: s.group }));
  TOPICS.forEach((s) => (idx["topic:" + s.id] = { type: "Topic", title: s.title, href: "topics.html#" + s.id, cat: s.group }));
  PY.forEach((s) => (idx["py:" + s.id] = { type: "Python", title: s.title, href: "python.html#" + s.id, cat: s.group }));
  PYDSA.forEach((s) => (idx["pydsa:" + s.id] = { type: "Python", title: s.title, href: "python-dsa.html#" + s.id, cat: "Python for DSA" + (s.group ? " · " + s.group : "") }));
  return idx;
}
function ncSorted() {
  return NC_CATS.flatMap((c) => NC.filter((p) => p.cat === c));
}
