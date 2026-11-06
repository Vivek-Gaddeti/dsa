/* Pen scratch pad: a floating "Pen" button opens a drawing panel beside the page (full sheet on phones/tablets in portrait).
   Pen and mouse draw (pen pressure changes the line width); a finger scrolls unless "Finger" is switched on.
   Strokes are saved per page (and per problem) in localStorage. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const svg = (d) => `<svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    pen: svg('<path d="M4 20l1-4 11-11 3 3L8 19zM14 7l3 3"/>'),
    hi: svg('<path d="M9 14l7-7 3 3-7 7zM9 14l-3 3v3h4l2-2M4 21h16"/>'),
    erase: svg('<path d="M8 20H20M5 14l8-8 6 6-6 6H8z"/>'),
    undo: svg('<path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>'),
    redo: svg('<path d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3"/>'),
    trash: svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    grid: svg('<path d="M4 4h16v16H4zM4 12h16M12 4v16"/>'),
    save: svg('<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>'),
    x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    hand: svg('<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2-3a1.5 1.5 0 0 1 2.4-1.8L8 14"/>'),
  };
  const COLORS = [["ink", "var(--text)"], ["teal", "var(--accent)"], ["red", "var(--red)"]];
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v.slice(4, -1)).trim() || "#1F1B17";

  let panel, cv, ctx, strokes = [], hist = [], tool = "pen", colorIdx = 0, finger = false, grid = true, key = "", drawing = null, saveT = 0;
  const pageKey = () => "pad:" + (location.pathname.split("/").pop() || "index.html") + location.hash;

  function build() {
    if (panel) return;
    panel = document.createElement("section");
    panel.className = "pad"; panel.setAttribute("aria-label", "Pen scratch pad"); panel.hidden = true;
    panel.innerHTML = `
      <div class="pad-head"><strong>Scratch pad</strong><span class="pad-hint small muted">Pen draws · finger scrolls</span><button type="button" class="btn quiet" data-pad="close" aria-label="Close scratch pad">${I.x} Close</button></div>
      <div class="pad-tools" role="toolbar" aria-label="Pen tools">
        <button type="button" class="pad-b" data-tool="pen" aria-label="Pen" aria-pressed="true">${I.pen}</button>
        <button type="button" class="pad-b" data-tool="hi" aria-label="Highlighter" aria-pressed="false">${I.hi}</button>
        <button type="button" class="pad-b" data-tool="erase" aria-label="Eraser" aria-pressed="false">${I.erase}</button>
        <span class="pad-sep"></span>
        ${COLORS.map(([n], i) => `<button type="button" class="pad-b pad-c" data-color="${i}" aria-label="Ink ${n}" aria-pressed="${i === 0}"><i style="background:${COLORS[i][1]}"></i></button>`).join("")}
        <span class="pad-sep"></span>
        <button type="button" class="pad-b" data-pad="finger" aria-label="Draw with finger" aria-pressed="false">${I.hand}</button>
        <button type="button" class="pad-b" data-pad="grid" aria-label="Dot grid" aria-pressed="true">${I.grid}</button>
        <span class="pad-grow"></span>
        <button type="button" class="pad-b" data-pad="undo" aria-label="Undo">${I.undo}</button>
        <button type="button" class="pad-b" data-pad="redo" aria-label="Redo">${I.redo}</button>
        <button type="button" class="pad-b" data-pad="png" aria-label="Save as image">${I.save}</button>
        <button type="button" class="pad-b" data-pad="clear" aria-label="Clear page">${I.trash}</button>
      </div>
      <div class="pad-canvas is-grid"><canvas aria-label="Drawing area"></canvas></div>`;
    document.body.appendChild(panel);
    cv = $("canvas", panel); ctx = cv.getContext("2d");
    new ResizeObserver(resize).observe(cv.parentNode);
    cv.addEventListener("pointerdown", down); cv.addEventListener("pointermove", move);
    ["pointerup", "pointercancel", "pointerleave"].forEach((t) => cv.addEventListener(t, up));
    panel.addEventListener("click", onClick);
  }

  function resize() {
    const r = cv.parentNode.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    if (!r.width) return;
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    cv.style.width = r.width + "px"; cv.style.height = r.height + "px";
    redraw();
  }

  function seg(a, b, s) {
    const W = cv.width, H = cv.height, d = window.devicePixelRatio || 1;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const hi = s.t === "hi";
    ctx.globalAlpha = hi ? 0.3 : 1; ctx.globalCompositeOperation = hi ? "multiply" : "source-over";
    ctx.strokeStyle = s.c; ctx.lineWidth = (hi ? 16 : 2.4 * (0.5 + (b[2] || 0.5))) * d;
    ctx.beginPath(); ctx.moveTo(a[0] * W, a[1] * H); ctx.lineTo(b[0] * W, b[1] * H); ctx.stroke();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  function redraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    strokes.forEach((s) => { if (s.p.length === 1) seg(s.p[0], s.p[0], s); for (let i = 1; i < s.p.length; i++) seg(s.p[i - 1], s.p[i], s); });
  }
  const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, e.pressure || 0.5]; };
  const allowed = (e) => e.pointerType !== "touch" || finger;

  function down(e) {
    if (!allowed(e) || e.button > 0) return;
    cv.setPointerCapture(e.pointerId); e.preventDefault();
    const p = pt(e);
    if (tool === "erase") { drawing = { erase: true }; erase(p); return; }
    drawing = { t: tool, c: css(COLORS[colorIdx][1]), p: [p] };
    seg(p, p, drawing);
  }
  function move(e) {
    if (!drawing || !allowed(e)) return;
    const p = pt(e);
    if (drawing.erase) { erase(p); return; }
    const last = drawing.p[drawing.p.length - 1];
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 0.0015) return;
    drawing.p.push(p); seg(last, p, drawing);
  }
  function up() {
    if (!drawing) return;
    if (!drawing.erase && drawing.p.length) { snapshot(); strokes.push({ t: drawing.t, c: drawing.c, p: drawing.p }); save(); }
    else if (drawing.erase && drawing.changed) save();
    drawing = null;
  }
  function erase(p) {
    const r = cv.getBoundingClientRect(), rad = 14 / r.width, before = strokes.length;
    const keep = strokes.filter((s) => !s.p.some((q) => Math.hypot((q[0] - p[0]) * r.width, (q[1] - p[1]) * r.height) < 14));
    if (keep.length !== before) { if (!drawing.changed) snapshot(); drawing.changed = true; strokes = keep; redraw(); }
  }
  const snapshot = () => { hist.push(JSON.stringify(strokes)); if (hist.length > 60) hist.shift(); redoStack.length = 0; };
  const redoStack = [];

  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      const slim = strokes.map((s) => ({ t: s.t, c: s.c, p: s.p.map((q) => [+q[0].toFixed(4), +q[1].toFixed(4), +(q[2] || 0.5).toFixed(2)]) }));
      store.set(key, strokes.length ? JSON.stringify(slim) : "");
    }, 400);
  }
  function load() {
    key = pageKey();
    try { strokes = JSON.parse(store.get(key) || "[]") || []; } catch (e) { strokes = []; }
    hist = []; redoStack.length = 0; redraw();
  }

  function onClick(e) {
    const t = e.target.closest("[data-tool],[data-color],[data-pad]"); if (!t) return;
    if (t.dataset.tool) { tool = t.dataset.tool; $$("[data-tool]", panel).forEach((b) => b.setAttribute("aria-pressed", b === t)); return; }
    if (t.dataset.color) { colorIdx = +t.dataset.color; if (tool === "erase") { tool = "pen"; $$("[data-tool]", panel).forEach((b) => b.setAttribute("aria-pressed", b.dataset.tool === "pen")); } $$("[data-color]", panel).forEach((b) => b.setAttribute("aria-pressed", b === t)); return; }
    const a = t.dataset.pad;
    if (a === "close") toggle(false);
    if (a === "finger") { finger = !finger; t.setAttribute("aria-pressed", finger); $(".pad-hint", panel).textContent = finger ? "Pen and finger draw" : "Pen draws · finger scrolls"; }
    if (a === "grid") { grid = !grid; t.setAttribute("aria-pressed", grid); $(".pad-canvas", panel).classList.toggle("is-grid", grid); }
    if (a === "undo" && hist.length) { redoStack.push(JSON.stringify(strokes)); strokes = JSON.parse(hist.pop()); redraw(); save(); }
    if (a === "redo" && redoStack.length) { hist.push(JSON.stringify(strokes)); strokes = JSON.parse(redoStack.pop()); redraw(); save(); }
    if (a === "clear" && strokes.length && confirm("Clear everything on this page's scratch pad?")) { snapshot(); strokes = []; redraw(); save(); }
    if (a === "png") {
      const o = document.createElement("canvas"); o.width = cv.width; o.height = cv.height;
      const c = o.getContext("2d"); c.fillStyle = css("var(--panel)") || "#fff"; c.fillRect(0, 0, o.width, o.height); c.drawImage(cv, 0, 0);
      const l = document.createElement("a"); l.download = "scratch-pad.png"; l.href = o.toDataURL("image/png"); l.click();
    }
  }

  function toggle(on) {
    build();
    on = on === undefined ? panel.hidden : on;
    panel.hidden = !on; document.body.classList.toggle("pad-open", on);
    fab.setAttribute("aria-expanded", on);
    if (on) { load(); resize(); }
  }

  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "pad-fab"; fab.setAttribute("aria-label", "Open pen scratch pad"); fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = `${I.pen}<span>Pen</span>`;
  fab.onclick = () => toggle();
  document.body.appendChild(fab);
  window.addEventListener("hashchange", () => { if (panel && !panel.hidden) load(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel && !panel.hidden && !document.body.classList.contains("focus-mode")) toggle(false); });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-open-pad]")) toggle(true); });
})();
