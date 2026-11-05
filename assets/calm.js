/* Calm-theme extras, loaded last: bottom tab bar on tablets and phones, Focus mode, text size, optional problem timer.
   Everything here is progressive: if this file fails to load the site still works. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const svg = (d) => `<svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  /* ---- text size: A− A+ scales everything (the site is built on rem) ---- */
  const SIZES = [90, 100, 112, 125];
  let si = Math.max(0, SIZES.indexOf(+ls.get("read:size") || 100));
  const applySize = () => { document.documentElement.style.fontSize = SIZES[si] + "%"; ls.set("read:size", SIZES[si]); };
  applySize();

  /* ---- bottom tab bar (shown by CSS on tablets and phones, where the header links would get cut off) ---- */
  const TAB_ICONS = {
    "index.html": svg('<path d="M4 12l8-8 8 8M6 10v10h12V10"/>'),
    "topics.html": svg('<path d="M4 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4zM20 5h-7"/>'),
    "patterns.html": svg('<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/>'),
    "neetcode.html": svg('<path d="M4 6l6 6-6 6M12 18h8"/>'),
    "python.html": svg('<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>'),
    "revision.html": svg('<path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5"/>'),
  };
  function tabbar() {
    const S = window.SITE; if (!S || !S.links || $(".tabbar")) return;
    const here = (location.pathname.split("/").pop() || "index.html");
    const nav = document.createElement("nav");
    nav.className = "tabbar"; nav.setAttribute("aria-label", "Main");
    nav.innerHTML = S.links.map(([href, label, sub]) => {
      const on = href === here || (sub && sub.some(([x]) => x === here));
      return `<a href="${href}"${on ? ' aria-current="page"' : ""}>${TAB_ICONS[href] || ""}<span>${label}</span></a>`;
    }).join("");
    document.body.appendChild(nav);
  }

  /* ---- Focus mode: hides the header, sidebar and tab bar so only the lesson is left ---- */
  const setFocus = (on) => { document.body.classList.toggle("focus-mode", on); $$("[data-calm-focus]").forEach((b) => { b.setAttribute("aria-pressed", on); b.lastChild.textContent = on ? " Exit focus" : " Focus mode"; }); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("focus-mode")) setFocus(false); });

  /* ---- extra controls on the lesson action bar ---- */
  function extras() {
    $$(".doc-actions:not([data-calm])").forEach((bar) => {
      bar.dataset.calm = "1";
      const x = document.createElement("span");
      x.className = "calm-extra";
      x.innerHTML = `<button type="button" class="btn quiet" data-calm-focus aria-pressed="false">${svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>')} Focus mode</button>
        <span class="calm-size" role="group" aria-label="Text size"><button type="button" class="btn quiet" data-calm-size="-1" aria-label="Smaller text">A−</button><button type="button" class="btn quiet" data-calm-size="1" aria-label="Larger text">A+</button></span>`;
      bar.appendChild(x);
    });
  }
  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-calm-focus]");
    if (f) { setFocus(!document.body.classList.contains("focus-mode")); return; }
    const z = e.target.closest("[data-calm-size]");
    if (z) { si = Math.min(SIZES.length - 1, Math.max(0, si + +z.dataset.calmSize)); applySize(); }
    const t = e.target.closest("[data-calm-timer]");
    if (t) { const on = document.documentElement.dataset.timer !== "on"; document.documentElement.dataset.timer = on ? "on" : "off"; ls.set("timer:show", on ? "on" : "off"); $$("[data-calm-timer]").forEach((b) => (b.lastChild.textContent = on ? " Timer: on" : " Timer: off")); }
  });

  /* ---- the problem timer is hidden unless you switch it on (it still records your solve time) ---- */
  document.documentElement.dataset.timer = ls.get("timer:show") === "on" ? "on" : "off";
  function timerBtn() {
    $$(".nc-timer:not([data-calm])").forEach((el) => {
      el.dataset.calm = "1";
      const on = document.documentElement.dataset.timer === "on";
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn quiet"; b.setAttribute("data-calm-timer", "");
      b.innerHTML = `${svg('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 3h6"/>')} Timer: ${on ? "on" : "off"}`;
      el.parentNode.insertBefore(b, el);
    });
  }

  const tick = () => { extras(); timerBtn(); };
  tabbar(); tick();
  new MutationObserver(tick).observe(document.body, { childList: true, subtree: true });
})();
