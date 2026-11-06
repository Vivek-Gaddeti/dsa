/* "Which pattern?" quiz. Built from the "Recognize it when…" cues of every pattern in data/patterns*.js:
   you read one or two cues, pick the pattern they belong to, and get the reason. Rounds of 10; keys 1-4 / A-D answer, Enter goes on. */
(() => {
  const { $, esc, icon } = window;
  const main = document.getElementById("content");
  const clean = (s) => String(s).replace(/\*\*?|`/g, "").replace(/\s+/g, " ").trim();
  const pool = (window.PATTERNS || []).map((p) => {
    const i = (p.blocks || []).findIndex((b) => b[0] === "h" && /recogni[sz]e/i.test(b[1]));
    const list = i >= 0 && p.blocks[i + 1] && p.blocks[i + 1][0] === "list" ? p.blocks[i + 1][1].map(clean) : [];
    return { id: p.id, title: p.title, group: p.group, sub: p.sub || "", cues: list };
  }).filter((p) => p.cues.length >= 2);
  const ROUND = Math.min(10, pool.length);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  let qs = [], n = 0, score = 0, miss = [], answered = false;
  const stats = () => { try { return JSON.parse(localStorage.getItem("quiz:v1") || "{}"); } catch (e) { return {}; } };
  const saveStat = (id, ok) => { try { const s = stats(); s[id] = s[id] || [0, 0]; s[id][1]++; if (ok) s[id][0]++; localStorage.setItem("quiz:v1", JSON.stringify(s)); } catch (e) {} };

  function newRound() {
    const st = stats(), weak = (p) => { const s = st[p.id]; return s ? 1 - s[0] / s[1] : 0.5; };
    // patterns you get wrong more often come up first, with some randomness
    const picks = shuffle(pool).sort((a, b) => weak(b) - weak(a) + (Math.random() - 0.5) * 0.6).slice(0, ROUND);
    qs = picks.map((p) => {
      const others = shuffle(pool.filter((x) => x.id !== p.id)), same = others.filter((x) => x.group === p.group), diff = others.filter((x) => x.group !== p.group);
      const d = shuffle([...same.slice(0, 1), ...diff]).slice(0, 3);
      return { p, cues: shuffle(p.cues).slice(0, 2), opts: shuffle([p, ...d]) };
    });
    n = 0; score = 0; miss = []; show();
  }

  function show() {
    answered = false;
    const q = qs[n];
    main.innerHTML = `
      <div class="qz">
        <div class="qz-top"><span class="eyebrow">Which pattern?</span><span class="eyebrow">Question ${n + 1} of ${qs.length}</span></div>
        <div class="qz-bar" aria-hidden="true">${qs.map((_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</div>
        <section class="qz-q card"><span class="eyebrow">A problem has these clues. Which pattern fits?</span>
          ${q.cues.map((c) => `<p class="qz-cue">${esc(c)}</p>`).join("")}</section>
        <div class="qz-opts" role="group" aria-label="Choose a pattern">
          ${q.opts.map((o, i) => `<button type="button" class="qz-opt" data-i="${i}"><span class="qz-k">${"ABCD"[i]}</span><span>${esc(o.title)}</span></button>`).join("")}
        </div>
        <div class="qz-fb" aria-live="polite"></div>
        <p class="qz-keys small muted">Keys: 1–4 to answer · Enter for next</p>
      </div>`;
  }

  function answer(i) {
    if (answered) return;
    answered = true;
    const q = qs[n], ok = q.opts[i].id === q.p.id;
    score += ok ? 1 : 0; if (!ok) miss.push(q.p); saveStat(q.p.id, ok);
    $$(".qz-opt").forEach((b, k) => { b.disabled = true; if (q.opts[k].id === q.p.id) b.classList.add("good"); else if (k === i) b.classList.add("bad"); });
    const last = n === qs.length - 1;
    $(".qz-fb").innerHTML = `<div class="qz-why ${ok ? "good" : "bad"}"><span class="eyebrow">${ok ? "Correct" : "Not quite"} · ${esc(q.p.title)}</span>
        <p>${esc(q.p.sub)}</p>
        <div class="btn-row"><a class="btn" href="patterns.html#${q.p.id}">Open this lesson</a><button type="button" class="btn primary" data-next>${last ? "See results" : "Next question"} →</button></div></div>`;
    $("[data-next]").focus();
  }

  function results() {
    const uniq = [...new Map(miss.map((p) => [p.id, p])).values()];
    main.innerHTML = `
      <div class="qz">
        <section class="qz-q card qz-end"><span class="eyebrow">Round complete</span>
          <p class="qz-score"><b>${score}</b> / ${qs.length}</p>
          <p class="muted">${score === qs.length ? "Perfect. Try another round." : "Review the patterns below, then try again."}</p></section>
        ${uniq.length ? `<h2>To review</h2><ul class="qz-miss">${uniq.map((p) => `<li><a href="patterns.html#${p.id}">${esc(p.title)}</a><span class="muted"> · ${esc(p.group)}</span></li>`).join("")}</ul>` : ""}
        <div class="btn-row"><button type="button" class="btn primary" data-again>New round</button><a class="btn" href="patterns.html">Back to patterns</a></div>
      </div>`;
  }

  const $$ = (s) => [...document.querySelectorAll(s)];
  main.addEventListener("click", (e) => {
    const o = e.target.closest(".qz-opt"); if (o) { answer(+o.dataset.i); return; }
    if (e.target.closest("[data-next]")) { n++; n < qs.length ? show() : results(); return; }
    if (e.target.closest("[data-again]")) newRound();
  });
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[1-4]$/.test(e.key) && $(".qz-opt")) { answer(+e.key - 1); }
    else if (e.key === "Enter" && answered && $("[data-next]")) { $("[data-next]").click(); }
  });

  if (pool.length < 4) main.innerHTML = `<div class="qz"><p>The quiz needs the pattern lessons to load. Open <a href="patterns.html">Patterns</a> first.</p></div>`;
  else newRound();
})();
