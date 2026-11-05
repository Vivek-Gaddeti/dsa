/* dashboard.js — the home page (index.html). A switch at the top shows everything, only DSA, or only Python.
   Layout: left column (hello + today's goal, streaks, the big gauge, review) · right column (activity year grid,
   "your progress" cards with what to continue, weak spots, all categories on demand). Data: data/progress.js. */
(function () {
  const main = $("#content"), PR = window.PROGRESS;
  if (!main || !PR) return;
  const GOAL = 3;                                                         // actions a day for the "today" ring
  const ICON = (d, cls = "cat-ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const I = {
    turtle: '<path d="M4 14c0-3.9 3.6-7 8-7s8 3.1 8 7H4z"/><path d="M20 12.5h1.5a1 1 0 0 0 0-2H19"/><path d="M7 14v3M17 14v3M11 14v3"/><path d="M9 7.4 10.5 10l1.5-2.6L13.5 10 15 7.4"/>',
    snake: '<path d="M3 17.5c2.5 0 2.5-3.5 5-3.5s2.5 3.5 5 3.5 2.5-3.5 5-3.5c1.5 0 2-1.6 2-3.2V8.5a2.5 2.5 0 0 0-5 0"/><path d="M17.8 8.4h.01"/>',
    flame: '<path d="M12 22c4 0 7-2.7 7-6.8 0-3.6-2.4-6-4.6-8.7-.5 2.5-1.8 3.8-3.2 4.4C11.6 7.4 10 4.5 8 2c.3 3.6-3 6.2-3 11.2C5 18.6 8 22 12 22z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6"/><path d="M12 17h.01"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    book: '<path d="M2.5 5.5h6.5a3 3 0 0 1 3 3V20a2.2 2.2 0 0 0-2.2-2.2H2.5z"/><path d="M21.5 5.5H15a3 3 0 0 0-3 3V20a2.2 2.2 0 0 1 2.2-2.2h7.3z"/>',
    braces: '<path d="M8.5 4C6.5 4 6.5 5 6.5 7v2.2c0 1.6-.9 2.8-2.3 2.8 1.4 0 2.3 1.2 2.3 2.8V17c0 2 0 3 2 3"/><path d="M15.5 4c2 0 2 1 2 3v2.2c0 1.6.9 2.8 2.3 2.8-1.4 0-2.3 1.2-2.3 2.8V17c0 2 0 3-2 3"/>',
  };
  const SITES = {
    all: { name: "Everything", mascot: I.layers },
    dsa: { name: "DSA", mascot: I.turtle },
    py: { name: "Python", mascot: I.snake },
  };
  let cur = "all", showCats = false, year = new Date().getFullYear(), pop = null;
  try { const v = sessionStorage.getItem("dash:view"); if (SITES[v]) cur = v; } catch (e) {}
  const isDue = (it) => !!(it && it.status && it.next && it.next <= Date.now() + 60000);

  /* ---------- one part of the site: its gauge, courses, groups and an index of its items ---------- */
  function part(site, st) {
    const count = (arr, kind) => arr.filter((x) => st(kind + ":" + x.id)).length;
    const firstOpen = (arr, kind) => arr.find((x) => !st(kind + ":" + x.id));
    const index = {};                                                    // key → title + link (for review / weak spots)
    if (site === "dsa") {
      const { topics, patterns, nc, cats, icons } = PR.dsa;
      topics.forEach((s) => (index["topic:" + s.id] = { title: s.title, href: "topics.html#" + s.id }));
      patterns.forEach((s) => (index["pattern:" + s.id] = { title: s.title, href: "patterns.html#" + s.id }));
      nc.forEach((p) => (index["nc:" + p.id] = { title: p.t, href: "neetcode.html#p/" + p.id }));
      const by = (lv) => { const all = nc.filter((p) => p.d === lv); return [all.filter((p) => st("nc:" + p.id)).length, all.length]; };
      const [e1, e2] = by("Easy"), [m1, m2] = by("Medium"), [h1, h2] = by("Hard"), solved = e1 + m1 + h1;
      const tD = count(topics, "topic"), pD = count(patterns, "pattern");
      const nT = firstOpen(topics, "topic"), nP = firstOpen(patterns, "pattern"), nN = firstOpen(nc, "nc");
      return { index, done: tD + pD + solved, total: topics.length + patterns.length + nc.length,
        gauge: { title: "NeetCode 150", done: solved, total: nc.length, unit: "solved",
          rows: [["Easy", e1, e2, "green"], ["Medium", m1, m2, "amber"], ["Hard", h1, h2, "red"]] },
        courses: [
          { kicker: "Learn", name: "Topics", done: tD, total: topics.length, next: nT && { t: nT.title, href: "topics.html#" + nT.id } },
          { kicker: "Recognise", name: "Patterns", done: pD, total: patterns.length, next: nP && { t: nP.title, href: "patterns.html#" + nP.id } },
          { kicker: "Practice", name: "NeetCode 150", done: solved, total: nc.length, next: nN && { t: nN.t, href: "neetcode.html#p/" + nN.id } },
        ],
        groups: cats.map((c) => { const all = nc.filter((p) => p.cat === c); return { name: c, icon: icons[c], done: all.filter((p) => st("nc:" + p.id)).length, total: all.length, href: "neetcode.html#list", cat: c, keys: all.map((p) => "nc:" + p.id) }; }),
        help: ["<strong>Topics</strong> teach each data structure: what it is, a diagram, its costs and Python code.",
          "<strong>Patterns</strong> are the core: when to use one, a template, a visualizer and worked examples.",
          "<strong>NeetCode 150</strong>: try first (Practice mode hides solutions), then read brute force → optimal → dry run."],
      };
    }
    const { guide, pydsa } = PR.py;
    guide.forEach((s) => (index["py:" + s.id] = { title: s.title, href: "python.html#" + s.id }));
    pydsa.forEach((s) => (index["pydsa:" + s.id] = { title: s.title, href: "python-dsa.html#" + s.id }));
    const g1 = count(guide, "py"), p1 = count(pydsa, "pydsa"), nG = firstOpen(guide, "py"), nD = firstOpen(pydsa, "pydsa");
    const groupsOf = (arr, kind, page, label) => {
      const out = [];
      arr.forEach((s) => { const g = s.group || label; let G = out.find((x) => x.name === g); if (!G) { G = { name: g, items: [], href: page + "#" + s.id, kind }; out.push(G); } G.items.push(s); });
      return out;
    };
    return { index, done: g1 + p1, total: guide.length + pydsa.length,
      gauge: { title: "Python", done: g1 + p1, total: guide.length + pydsa.length, unit: "learned",
        rows: [["Guide", g1, guide.length, "accent"], ["For DSA", p1, pydsa.length, "green"]] },
      courses: [
        { kicker: "Learn", name: "Python Guide", done: g1, total: guide.length, next: nG && { t: nG.title, href: "python.html#" + nG.id } },
        { kicker: "Apply", name: "Python for DSA", done: p1, total: pydsa.length, next: nD && { t: nD.title, href: "python-dsa.html#" + nD.id } },
      ],
      groups: [...groupsOf(guide, "py", "python.html", "Guide"), ...groupsOf(pydsa, "pydsa", "python-dsa.html", "Python for DSA").map((g) => ({ ...g, name: "DSA · " + g.name }))]
        .map((g) => ({ name: g.name, icon: g.kind === "py" ? I.book : I.braces, done: g.items.filter((s) => st(g.kind + ":" + s.id)).length, total: g.items.length, href: g.href, keys: g.items.map((s) => g.kind + ":" + s.id) })),
      help: ["<strong>Python Guide</strong>: the whole language, section by section; press <strong>" + icon("play") + " Step through</strong> on any example to watch it run.",
        "<strong>Python for DSA</strong>: just the Python you need for coding problems (collections, heapq, bisect, recursion…)."],
    };
  }

  /* ---------- everything the dashboard shows for the chosen view ---------- */
  function model(view) {
    const d = Store.load(), st = (k) => (d.items[k] || {}).status;
    const A = part("dsa", st), B = part("py", st), parts = view === "dsa" ? [A] : view === "py" ? [B] : [A, B];
    const index = Object.assign({}, ...parts.map((p) => p.index));
    const m = {
      gauge: view === "all" ? { title: "Everything", done: A.done + B.done, total: A.total + B.total, unit: "done",
        rows: [["DSA", A.done, A.total, "green"], ["Python", B.done, B.total, "accent"]] } : parts[0].gauge,
      courses: parts.flatMap((p) => p.courses),
      groups: parts.flatMap((p) => p.groups),
      help: [...parts.flatMap((p) => p.help),
        "Mark things <strong>solved / learned</strong>; they come back in <strong>Revision</strong> after 1, 3, 7, 14, 30 and 60 days.",
        "Write <strong>notes</strong> on any problem or section: the key insight or the mistake you made."],
    };
    // review: what is due, in the order it fell due
    const due = Object.entries(d.items).filter(([k, it]) => index[k] && isDue(it)).sort(([, a], [, z]) => (a.next || 0) - (z.next || 0)).map(([k]) => ({ k, ...index[k] }));
    // weak spots: groups where things are marked "needs revision" or were forgotten in reviews
    const weak = m.groups.map((g) => {
      const its = g.keys.map((k) => d.items[k] || {}), revise = its.filter((it) => it.status === "revise").length, lapses = its.reduce((a, it) => a + (it.lapses || 0), 0);
      return { ...g, revise, lapses, score: revise * 2 + lapses };
    }).filter((g) => g.score > 0).sort((a, z) => z.score - a.score).slice(0, 4);
    return { ...m, act: d.activity, due, weak, streak: Store.streak(), best: Store.bestStreak(), todayN: d.activity[today()] || 0 };
  }

  /* ---------- pieces ---------- */
  const greet = () => { const h = new Date().getHours(); return h < 5 || h >= 22 ? "Late-night grind" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const ring = (frac, cls) => `<circle class="${cls}" cx="29" cy="29" r="24" pathLength="100" stroke-dasharray="${Math.max(0, Math.min(100, frac * 100)).toFixed(1)} 100"/>`;
  function gauge(G) {
    const tone = { green: "var(--green)", amber: "var(--amber)", red: "var(--red)", accent: "var(--accent)" };
    let off = 0;
    const arcs = G.rows.filter((r) => r[1] > 0).map(([, n, , col]) => { const len = (n / G.total) * 75, s = `<circle class="g-arc" cx="60" cy="60" r="48" pathLength="100" style="stroke:${tone[col]};stroke-dasharray:${len.toFixed(2)} 100;stroke-dashoffset:${(-off).toFixed(2)}"/>`; off += len; return s; }).join("");
    return `<section class="card dash-card"><div class="dash-h">${esc(G.title)}</div>
      <div class="dash-gauge-row"><div class="rm-diff">${G.rows.map(([l, n, t, col]) => `<div><span class="text-${col}">${l}</span><b>${n}<small>/${t}</small></b></div>`).join("")}</div>
      <div class="rm-gauge"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="g-track" cx="60" cy="60" r="48" pathLength="100"/>${arcs}</svg>
        <div class="rm-gauge-t"><b class="stat">${G.done}</b><span>/${G.total} ${G.unit}</span></div></div></div></section>`;
  }
  function heat(act) {
    const thisYear = new Date().getFullYear();
    const years = [...new Set(Object.keys(act).filter((k) => act[k]).map((k) => +k.slice(0, 4)).concat(thisYear))].sort((a, z) => z - a);
    if (!years.includes(year)) year = thisYear;
    const first = new Date(year, 0, 1), start = new Date(year, 0, 1 - first.getDay()), tk = today();
    const cell = 11, step = 14, left = 28, top = 18;
    let s = "", total = 0, days = 0, months = "", lastM = -1;
    for (let w = 0; w < 54; w++) for (let dw = 0; dw < 7; dw++) {
      const t = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + dw);
      if (t.getFullYear() !== year) continue;
      const key = today(t.getTime()), v = act[key] || 0;
      if (v) { total += v; days++; }
      const lvl = v === 0 ? 0 : v < 3 ? 1 : v < 6 ? 2 : v < 10 ? 3 : 4;
      s += `<rect class="hm-c l${lvl}${key > tk ? " fut" : ""}${key === tk ? " now" : ""}" x="${left + w * step}" y="${top + dw * step}" width="${cell}" height="${cell}" rx="2.5"><title>${t.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}: ${v} action${v === 1 ? "" : "s"}</title></rect>`;
      if (t.getDate() === 1 && t.getMonth() !== lastM) { lastM = t.getMonth(); months += `<text class="hm-m" x="${left + w * step}" y="11">${t.toLocaleString(undefined, { month: "short" })}</text>`; }
    }
    ["Mon", "Wed", "Fri"].forEach((l, i) => (s += `<text class="hm-m" x="0" y="${top + (1 + i * 2) * step + 9}">${l}</text>`));
    return { svg: `<svg class="hm-svg" viewBox="0 0 ${left + 54 * step} ${top + 7 * step}" preserveAspectRatio="xMinYMin meet" role="img" aria-label="Activity in ${year}">${months}${s}</svg>`, total, days, years };
  }

  /* ---------- the page ---------- */
  function render() {
    const M = model(cur), H = heat(M.act), goalFrac = Math.min(1, M.todayN / GOAL);
    const due = M.due;
    main.innerHTML = `
      <div class="dash-top">
        <div class="view-switch dash-switch" role="tablist" aria-label="Show">${["all", "dsa", "py"].map((k) => `<button type="button" role="tab" aria-selected="${k === cur}" class="${k === cur ? "on" : ""}" data-site="${k}">${ICON(SITES[k].mascot)}${k === "all" ? "All" : SITES[k].name}</button>`).join("")}</div>
        <div class="dash-tools">
          <button type="button" class="icon-btn" data-pop="help" aria-label="How to use this site" title="How to use this site">${ICON(I.help)}</button>
          <button type="button" class="icon-btn" data-pop="gear" aria-label="Backup, import or reset progress" title="Backup / import / reset">${ICON(I.gear)}</button>
        </div>
      </div>
      <div class="dash">
        <aside class="dash-left">
          <section class="card dash-card dash-hello">
            <span class="dash-mascot">${ICON(SITES[cur].mascot)}</span>
            <div class="flex-1"><div class="small muted">${greet()}</div><div class="dash-hello-t">${M.todayN >= GOAL ? "Goal done for today. Nice work!" : "Ready for today's session?"}</div></div>
            <div class="dash-goal" title="Today: ${M.todayN} of ${GOAL} actions"><svg viewBox="0 0 58 58" aria-hidden="true">${ring(1, "goal-track")}${goalFrac > 0 ? ring(goalFrac, "goal-arc") : ""}</svg>
              <div><b>${Math.min(M.todayN, GOAL)}/${GOAL}</b><span>today</span></div></div>
          </section>
          <div class="dash-pair">
            <section class="card dash-card"><div class="small muted">Current streak</div><div class="dash-big">${ICON(I.flame, "cat-ico ico-amber")}<span class="stat">${M.streak} day${M.streak === 1 ? "" : "s"}</span></div></section>
            <section class="card dash-card"><div class="small muted">Best streak</div><div class="dash-big">${ICON(I.trophy, "cat-ico ico-amber")}<span class="stat">${M.best} day${M.best === 1 ? "" : "s"}</span></div></section>
          </div>
          ${gauge(M.gauge)}
          <section class="card dash-card">
            <div class="row-between"><div class="dash-h">Review</div>${due.length ? `<span class="badge purple">${due.length} due today</span>` : `<span class="badge easy">all caught up</span>`}</div>
            <div class="small muted dash-due">${due.length ? due.slice(0, 3).map((x) => esc(x.title)).join(" · ") + (due.length > 3 ? " …" : "") : "Nothing to review right now. Learn something new below."}</div>
            ${due.length ? `<a class="btn primary dash-cta" href="revision.html">Start review ${ICON(I.arrow)}</a>` : cur !== "py" ? `<a class="btn dash-cta" href="neetcode.html#roadmap">Open the roadmap ${ICON(I.arrow)}</a>` : M.courses[0].next ? `<a class="btn dash-cta" href="${M.courses[0].next.href}">Continue learning ${ICON(I.arrow)}</a>` : ""}
          </section>
        </aside>

        <div class="dash-main">
          <details class="card dash-card hm" id="hm"><summary class="hm-sum">Activity this year <span class="muted">· ${H.total} action${H.total === 1 ? "" : "s"}</span></summary>
            <div class="hm-head"><b>${ICON(I.pulse, "cat-ico ico-green")}${H.total} action${H.total === 1 ? "" : "s"} in ${year}</b>
              <span class="hm-stats"><span>Active days <b>${H.days}</b></span><span>Current streak <b>${M.streak}</b></span><span>Max streak <b>${M.best}</b></span>
              <select id="hmYear" aria-label="Year">${H.years.map((y) => `<option ${y === year ? "selected" : ""}>${y}</option>`).join("")}</select></span></div>
            ${H.svg}
            <div class="hm-foot"><span>Each square is a day; greener means you did more that day.</span><span class="hm-legend">Less ${[0, 1, 2, 3, 4].map((l) => `<i class="l${l}"></i>`).join("")} More</span></div>
          </details>

          <section>
            <h2 class="dash-h2">Your progress</h2>
            <div class="dash-courses${M.courses.length === 5 ? " n5" : ""}">${M.courses.map((c) => `<a class="card dash-course" href="${c.next ? c.next.href : "#"}">
              <span class="dash-kicker">${c.kicker}</span>
              <span class="row-between"><b class="dash-course-t">${c.name}</b><span class="ct-n">${c.done} / ${c.total}</span></span>
              <span class="ct-bar"><span style="width: ${c.total ? ((c.done / c.total) * 100).toFixed(1) : 0}%"></span></span>
              <span class="small muted">${c.next ? `Continue: <span class="text-accent fw-700">${esc(c.next.t)}</span>` : icon("party") + " All done"}</span></a>`).join("")}</div>
          </section>

          ${M.weak.length ? `<section class="card dash-card">
            <div class="dash-h">${ICON(I.target, "cat-ico ico-red")}Weak spots</div>
            <div class="dash-chips">${M.weak.map((g) => `<a class="dash-chip" href="${g.href}"${g.cat ? ` data-cat="${esc(g.cat)}" data-s="${g.revise ? "revise" : ""}"` : ""}><b>${esc(g.name)}</b><span class="muted">${[g.revise ? g.revise + " need revision" : "", g.lapses ? "forgot " + g.lapses + "×" : ""].filter(Boolean).join(" · ")}</span><span class="text-accent fw-700">Practice</span></a>`).join("")}</div>
          </section>` : ""}

          <section>
            <button type="button" class="dash-more" data-cats aria-expanded="${showCats}"><span>${showCats ? "Hide" : "Show all"} ${M.groups.length} ${cur === "dsa" ? "categories" : cur === "py" ? "sections" : "categories and sections"}</span>${ICON(I.chev)}</button>
            ${showCats ? `<div class="cat-grid dash-cats">${M.groups.map((g) => `<a class="cat-tile${g.done === g.total ? " done" : ""}" href="${g.href}"${g.cat ? ` data-cat="${esc(g.cat)}"` : ""}><span class="cat-badge">${ICON(g.icon)}</span>
              <span class="ct-body"><span class="ct-top"><b>${esc(g.name)}</b><span class="ct-n">${g.done === g.total ? icon("check") + " " : ""}${g.done}/${g.total}</span></span><span class="ct-bar"><span style="width: ${g.total ? ((g.done / g.total) * 100).toFixed(1) : 0}%"></span></span></span></a>`).join("")}</div>` : ""}
          </section>
        </div>
      </div>
      <div class="dash-pop card" id="dashPop" hidden></div>`;
    const yr = $("#hmYear");
    if (yr) yr.onchange = () => { year = +yr.value; render(); };
  }

  /* ---------- popovers: how-to and backup ---------- */
  function openPop(kind, btn) {
    const el = $("#dashPop");
    if (pop === kind) { closePop(); return; }
    pop = kind;
    el.innerHTML = kind === "help"
      ? `<div class="dash-h">How to use this site</div><ol class="clean">${model(cur).help.map((x) => `<li>${x}</li>`).join("")}</ol><p class="small muted">Press <kbd>Ctrl</kbd> <kbd>K</kbd> to find anything, or <kbd>?</kbd> for all keyboard shortcuts.</p>`
      : `<div class="dash-h">Your progress</div><p class="small muted">DSA and Python progress, notes and bookmarks are saved together, only in this browser. Export it now and then, and import it on another device.</p>
         <div class="btn-row"><button type="button" class="btn primary" data-do="export">${icon("download")} Export</button><label class="btn">${icon("upload")} Import<input type="file" data-do="import" accept=".json,application/json" hidden></label><button type="button" class="btn on-red" data-do="reset">Reset</button></div>`;
    const r = btn.getBoundingClientRect(), mr = main.getBoundingClientRect();
    el.style.top = r.bottom - mr.top + 8 + "px"; el.style.right = mr.right - r.right + "px";
    el.hidden = false;
  }
  function closePop() { pop = null; const el = $("#dashPop"); if (el) el.hidden = true; }
  function resetAll() {
    if (!confirm("Delete ALL progress, bookmarks and notes (DSA and Python) in this browser? Export first if unsure.")) return;
    Store.reset(); toast("Progress reset"); closePop(); render();
  }

  main.addEventListener("click", (e) => {
    const sw = e.target.closest("[data-site]");
    if (sw && sw.dataset.site !== cur) { cur = sw.dataset.site; showCats = false; try { sessionStorage.setItem("dash:view", cur); } catch (x) {} closePop(); render(); if (window.FX && FX.rise) FX.rise(); return; }
    const p = e.target.closest("[data-pop]");
    if (p) { e.stopPropagation(); openPop(p.dataset.pop, p); return; }
    if (e.target.closest("[data-cats]")) { showCats = !showCats; render(); return; }
    const doIt = e.target.closest("[data-do]");
    if (doIt && doIt.dataset.do === "export") Store.exportJSON();
    if (doIt && doIt.dataset.do === "reset") resetAll();
    const cat = e.target.closest("[data-cat]");          // open NeetCode's list already filtered to that category
    if (cat) { try { sessionStorage.setItem("nc:filters", JSON.stringify({ cat: cat.dataset.cat, s: cat.dataset.s || "" })); } catch (x) {} }
  });
  main.addEventListener("change", (e) => { if (e.target.matches('[data-do="import"]') && e.target.files[0]) { Store.importJSON(e.target.files[0], render); closePop(); } });
  document.addEventListener("click", (e) => { if (pop && !e.target.closest("#dashPop")) closePop(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && pop) closePop(); });
  render();
})();
