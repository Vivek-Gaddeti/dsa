# My Study Hub

One offline study website for DSA and Python. Open `index.html` (double-click) to start: it is the dashboard.

| Page | What's inside |
|---|---|
| `index.html` | Dashboard: today's goal, streaks, progress (All / DSA / Python), what's due, a year of activity |
| `topics.html` | DSA topics: each data structure with diagrams, costs and Python code |
| `patterns.html` | 35 patterns with templates, visualizers and worked examples |
| `neetcode.html` | NeetCode 150 as a list or a roadmap, with brute force → optimal → dry run |
| `python.html` | The complete Python guide (header: **Python ▾ → Complete Guide**) |
| `python-dsa.html` | Python for DSA (header: **Python ▾ → Python for DSA**) |
| `revision.html` | Spaced-repetition review of everything, DSA and Python |

Press **Ctrl + K** (or 🔍 in the header) on any page to find any topic, pattern, problem or Python section.

## Run Python on the page (`assets/py.js`)
Real Python 3.12 (Pyodide) runs inside the browser. It needs internet the **first** time it starts (about 10 MB, then the
browser caches it); everything else works offline.
- **✏️ Edit & run** on every Python example: change the code, press **Run** or **Ctrl + Enter**; **Reset** brings the original back.
- **Python playground**: the terminal icon in the header (or press **P**). Your code is saved in this browser.
- **🧪 Try it yourself** on every NeetCode problem: write your solution (starts from the empty method), press Run, and it is
  checked against the problem's tests line by line (✓ / ✗ with expected vs your output). Your code is saved per problem.
- The editor closes brackets and quotes for you (type over the closer, Backspace removes an empty pair, select text and type `(` or `"` to wrap it, Enter inside `[]` opens it up), highlights the matching bracket, and has Tab / Shift+Tab, Ctrl+/ to comment, Ctrl+Z to undo.
- **Step through** your own code (playground, Edit & run, and your NeetCode solution together with its tests): the same
  line-by-line player as the examples, with variables, call stack and output so far. **Back to editing** returns to the editor.
- Errors show the traceback and mark the line in red. **Stop** ends an endless loop. Code that calls `input()` asks you for
  the input first (the *Input* box, one line per call).

Folders: `assets/` (code and styles), `data/` (content), `tools/` (build scripts, optional).

## Features on every code example
- **Line numbers + inline outputs**: each output appears right under the line that printed it
  (toggle *Outputs: inline / at end*).
- **▶ Step through**: run the code one line at a time and watch the variables, call stack and output.
- **🔍 Google it**: highlight any text and a small "Google it" pill appears; click it to search that text. Or just start
  typing: the pill turns into a question box, and **Enter** searches the highlighted text plus your question. Backspace on an
  empty box turns it back into the pill; **Esc** closes it.
- Hover over dotted-underlined words for plain-English definitions.

## Little extras (`assets/fx/`)
The optional effects live in one stylesheet and six small scripts, one per area: `fx.css`, `fx-core.js` (shared helpers),
`fx-page.js`, `fx-header.js`, `fx-sidebar.js`, `fx-cursor.js` and `fx-celebrate.js`. To drop one group of effects,
remove its `<script>` tag. Keep `fx-core.js` first.

- Press **?** for keyboard shortcuts: **Ctrl K** find anything, **P** Python playground, ←/→ prev/next, **S** solved, **R** revise, **B** bookmark, **/** search the sidebar, **T** theme, **G** top.
- Confetti when you solve or learn something. You get a bigger burst for finishing a whole category or clearing all reviews, and a finished category's progress bar turns rainbow.
- Resume chip (bottom left), back-to-top bubble, smooth open/close of boxes, button squish, gentle magnetic main buttons.
- **✨ / ☆** in the top bar opens a small menu with two switches:
  - **Animations**: until you set it, this follows your system setting (Windows: Settings → Accessibility →
    Visual effects → *Animation effects*). Setting it overrides that.
  - **Glow cursor**: a soft light that follows your mouse. It's off by default.
- **⏱ Problem timer** on every NeetCode problem. It only counts while the page is on screen. When you mark the problem solved it saves
  your time, and your best time appears in the problem list.
- **🎯 Weak spots** on the dashboard: the categories and items you most often mark "Needs revision" or forget in reviews.
- Dashboard numbers count up when the page opens, and switching light/dark cross-fades.
- **Sidebar:** a small bar glides to the current section, which (with its neighbours) reads a little stronger. Learned items soften and
  get a ✓. Each group folds and unfolds (click its title), shows done/total and has a thin progress line. Hover an item for a moment
  to see its one-line summary and reading time. Search folds away non-matching items and highlights matches. A little 🐢 (DSA) or
  🐍 (Python) walks toward the 🏁 at the bottom as you progress.
- **Header extras:** a time-of-day greeting, a logo whose colour follows the time of day and that breathes when you're idle, a progress
  ring around the logo, peek cards when you hover a link ("Next up: …"), the 🔥 streak rolling up when it grows, and seasonal touches
  (🎃 in October, ❄ in December).
- **Cursor:** a soft halo over clickable things, a click "bloom" in the colour of what you clicked, and text selection in the page's
  colour. The optional glow cursor is calm and colour-aware: it rests when you stop moving, lights up card borders near it,
  hides over text, code and while scrolling, and leaves two tiny ✦ when you click.
- **Dashboard** (`index.html`) with an **All | DSA | Python** switch. It shows today's goal (3 actions), streaks, a progress gauge, what's due for review, a year
  of activity, "continue" cards, weak spots and all categories. The ? button explains the site, and ⚙ exports, imports or resets progress.
- **Header:** each link has its own soft colour. Line icons move a little on hover, a pill glides to the link you point at and takes on
  its colour, and a purple badge
  on Revision when reviews are due. **Python ▾** opens a small menu (Complete Guide, Python for DSA). There's also a 🔥 streak, a logo shine, and a header that shrinks and frosts on scroll.
- **Sliding:** sections and problems slide in from the side you're heading to when you move with ← / → or the sidebar.
- **Page changes:** the content dissolves out and the new page's blocks rise into focus. Light/dark is a soft fade, while
  the sun ↔ moon icon morphs and twinkles stars or glows.
- **Liquid fills:** the button you click (Learned/Solved green, Needs revision red, Bookmark amber with sparkles) pours in with a wavy
  edge, bubbles and a shine, and drains out when undone. NeetCode list circles fill like a glass, sidebar dots fill from the bottom, Revision ✓/✗
  fill and then the row drains away, and growing progress bars rise like water.
- **✨ menu:** Animations, Glow cursor and **Aurora everywhere** (soft colours behind every page; always on for dashboards).
- There are a few hidden easter eggs 🥚.

## Look & feel
- All sizes, corners and gaps come from one scale at the top of `assets/style.css` (`--fs-*`, `--r-*`, `--sp-*`).
  Shared helper classes (like `stats`, `row-between`, `page-nav`) sit at the end of that file.
- Each page has its own colour (from its header link). That colour drives the links, buttons, sidebar, focus rings and diagrams on
  that page, with darker/lighter shades so text stays readable in light and dark mode.
- Headings, header and buttons use **Nunito** (loaded from Google Fonts when online), and body text uses the system font.
  Offline, everything falls back to the system font.
- Problem pages use a comfortable reading width; dashboards and lists use the full width.

## Progress
Saved in your browser's localStorage (per browser, per address), DSA and Python together. Use ⚙ **Export / Import** on the
dashboard to back it up or move it to another device. (Progress from the old separate DSA Prep and Python Guide sites is
merged in automatically the first time you open the site; older export files can be imported too.)

## Editing content (optional)
Content lives in `data/*.js`. After editing, run (needs Python + Node):

```
node tools/fill.js data/python-1.js    # fill outputs written as "?"
node tools/verify.js                   # check every example prints its shown output
node tools/build.js                    # regenerate inline outputs + step-through traces (+ runs lite.js and stamp.js)
node tools/lite.js                     # rebuild data/index.js and data/progress.js (Revision, dashboard, Ctrl+K)
node tools/stamp.js                    # refresh the ?v= version stamps so browsers never mix old and new files
python tools/pages.py                  # rewrite every page from one template (then run stamp.js)
node tools/cdp.js my-steps.js          # test the site in headless Chrome (see the comment at the top of the file)
```
