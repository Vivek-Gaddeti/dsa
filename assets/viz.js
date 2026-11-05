/* =====================================================================
   viz.js — step-by-step algorithm visualizers
   Each visualizer: { title, input, help, gen(inputString) -> steps[] , kind }
   kind "rows"  : step = { rows:[{label, vals, cls:{i:'hl'|'inwin'|'done'|'dim'|'bad'}, ptr:{i:'L'}, arrows:[]}], side:{}, msg }
   kind "grid"  : step = { grid, cls:{'r,c':'hl'|'done'|'water'|'land'}, head:{rows:[],cols:[]}, side, msg }
   kind "svg"   : step = { svg: '<svg…>', side, msg }
   ===================================================================== */
(function () {
  const nums = (s) => s.split(/[\s,]+/).filter(Boolean).map(Number);
  const split2 = (s) => { const [a, b] = s.split("|"); return [a.trim(), (b || "").trim()]; };
  const range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
  const C = (pairs) => { const o = {}; pairs.forEach(([idxs, c]) => idxs.forEach((i) => (o[i] = c))); return o; };

  const V = {};

  /* ---------- Two pointers: pair with target sum in sorted array ---------- */
  V.twoPointers = {
    title: "Two Pointers — pair with target sum (sorted array)",
    input: "1 2 4 6 8 11 15 | 14", help: "sorted numbers | target",
    gen(inp) {
      const [a, t] = split2(inp), arr = nums(a).sort((x, y) => x - y), target = +t, S = [];
      let l = 0, r = arr.length - 1;
      S.push({ rows: [{ vals: arr, ptr: { [l]: "L", [r]: "R" } }], msg: `Start with L at the smallest and R at the largest. Target = ${target}.` });
      while (l < r) {
        const s = arr[l] + arr[r], ptr = l === r ? { [l]: "L R" } : { [l]: "L", [r]: "R" };
        const cls = C([[range(0, l - 1).concat(range(r + 1, arr.length - 1)), "dim"], [[l, r], "hl"]]);
        if (s === target) { S.push({ rows: [{ vals: arr, ptr, cls: C([[[l, r], "done"]]) }], side: { sum: s }, msg: `${arr[l]} + ${arr[r]} = ${s} = target ✓ Found the pair at indices (${l}, ${r}).` }); return S; }
        if (s < target) { S.push({ rows: [{ vals: arr, ptr, cls }], side: { sum: s }, msg: `${arr[l]} + ${arr[r]} = ${s} < ${target}. Sum too small → move L right (only way to increase the sum).` }); l++; }
        else { S.push({ rows: [{ vals: arr, ptr, cls }], side: { sum: s }, msg: `${arr[l]} + ${arr[r]} = ${s} > ${target}. Sum too big → move R left (only way to decrease the sum).` }); r--; }
      }
      S.push({ rows: [{ vals: arr, cls: C([[range(0, arr.length - 1), "dim"]]) }], msg: "Pointers crossed — no pair adds up to the target." });
      return S;
    },
  };

  /* ---------- Fixed sliding window: max sum of size k ---------- */
  V.fixedWindow = {
    title: "Fixed Sliding Window — max sum of k consecutive elements",
    input: "2 1 5 1 3 2 | 3", help: "numbers | k",
    gen(inp) {
      const [a, kk] = split2(inp), arr = nums(a), k = +kk || 3, S = [];
      let sum = 0, best = -Infinity, bestL = 0;
      for (let i = 0; i < k && i < arr.length; i++) { sum += arr[i]; S.push({ rows: [{ vals: arr, cls: C([[range(0, i), "inwin"]]), ptr: { [i]: "i" } }], side: { "window sum": sum }, msg: `Build the first window: add ${arr[i]} → sum = ${sum}` }); }
      best = sum;
      S.push({ rows: [{ vals: arr, cls: C([[range(0, k - 1), "inwin"]]) }], side: { "window sum": sum, best }, msg: `First window [0..${k - 1}] has sum ${sum}. best = ${best}` });
      for (let r = k; r < arr.length; r++) {
        const out = arr[r - k];
        sum += arr[r] - out;
        if (sum > best) { best = sum; bestL = r - k + 1; }
        S.push({ rows: [{ vals: arr, cls: Object.assign(C([[range(r - k + 1, r), "inwin"]]), { [r - k]: "bad", [r]: "hl" }), ptr: { [r - k + 1]: "L", [r]: "R" } }], side: { "window sum": sum, best }, msg: `Slide: add ${arr[r]} (enters), subtract ${out} (leaves) → sum = ${sum}. O(1) per move instead of re-summing k items.` });
      }
      S.push({ rows: [{ vals: arr, cls: C([[range(bestL, bestL + k - 1), "done"]]) }], side: { best }, msg: `Done. Maximum window sum = ${best} at indices ${bestL}..${bestL + k - 1}.` });
      return S;
    },
  };

  /* ---------- Variable sliding window: longest substring without repeats ---------- */
  V.slidingWindow = {
    title: "Variable Sliding Window — longest substring without repeating characters",
    input: "abcabcbb", help: "any string",
    gen(inp) {
      const s = inp.replace(/\s/g, "").split(""), S = [], seen = new Set();
      let l = 0, best = 0, bl = 0, br = -1;
      for (let r = 0; r < s.length; r++) {
        while (seen.has(s[r])) {
          S.push({ rows: [{ vals: s, cls: Object.assign(C([[range(l, r - 1), "inwin"]]), { [r]: "bad", [l]: "dim" }), ptr: { [l]: "L", [r]: "R" } }], side: { window: "{" + [...seen].join(",") + "}", best }, msg: `'${s[r]}' is already in the window → shrink: remove '${s[l]}' and move L right.` });
          seen.delete(s[l]); l++;
        }
        seen.add(s[r]);
        if (r - l + 1 > best) { best = r - l + 1; bl = l; br = r; }
        S.push({ rows: [{ vals: s, cls: Object.assign(C([[range(l, r), "inwin"]]), { [r]: "hl" }), ptr: l === r ? { [l]: "L R" } : { [l]: "L", [r]: "R" } }], side: { window: "{" + [...seen].join(",") + "}", length: r - l + 1, best }, msg: `Expand: add '${s[r]}'. Window "${s.slice(l, r + 1).join("")}" is valid (no repeats). best = ${best}` });
      }
      S.push({ rows: [{ vals: s, cls: C([[range(bl, br), "done"]]) }], side: { best }, msg: `Done. Longest = ${best} ("${s.slice(bl, br + 1).join("")}"). Each char enters and leaves the window at most once → O(n).` });
      return S;
    },
  };

  /* ---------- Binary search ---------- */
  V.binarySearch = {
    title: "Binary Search — find target in a sorted array",
    input: "1 3 5 7 9 11 13 15 17 | 13", help: "sorted numbers | target",
    gen(inp) {
      const [a, t] = split2(inp), arr = nums(a).sort((x, y) => x - y), target = +t, S = [];
      let lo = 0, hi = arr.length - 1, step = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1; step++;
        const dim = range(0, lo - 1).concat(range(hi + 1, arr.length - 1));
        const ptr = {}; ptr[lo] = "lo"; ptr[hi] = (ptr[hi] ? ptr[hi] + " " : "") + "hi"; ptr[mid] = (ptr[mid] ? ptr[mid] + " " : "") + "mid";
        if (arr[mid] === target) { S.push({ rows: [{ vals: arr, ptr, cls: Object.assign(C([[dim, "dim"]]), { [mid]: "done" }) }], side: { comparisons: step }, msg: `arr[${mid}] = ${arr[mid]} == ${target} ✓ Found at index ${mid} after ${step} comparisons (linear search could need ${arr.length}).` }); return S; }
        const go = arr[mid] < target ? "right" : "left";
        S.push({ rows: [{ vals: arr, ptr, cls: Object.assign(C([[dim, "dim"], [range(lo, hi), "inwin"]]), { [mid]: "hl" }) }], side: { comparisons: step, "search space": hi - lo + 1 }, msg: `mid = (${lo}+${hi})//2 = ${mid}. arr[mid] = ${arr[mid]} ${arr[mid] < target ? "<" : ">"} ${target} → discard the ${go === "right" ? "left" : "right"} half, search ${go}.` });
        if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
      }
      S.push({ rows: [{ vals: arr, cls: C([[range(0, arr.length - 1), "dim"]]) }], msg: `lo (${lo}) > hi (${hi}) → ${target} is not in the array. (lo = ${lo} is where it would be inserted.)` });
      return S;
    },
  };

  /* ---------- Prefix sums ---------- */
  V.prefixSum = {
    title: "Prefix Sum — answer any range-sum query in O(1)",
    input: "3 1 4 1 5 9 2 6 | 2 5", help: "numbers | query i j",
    gen(inp) {
      const [a, q] = split2(inp), arr = nums(a), [qi, qj] = nums(q).length ? nums(q) : [1, 3], S = [];
      const pre = [0];
      S.push({ rows: [{ label: "nums", vals: arr }, { label: "prefix", vals: pre.slice() }], msg: "prefix[0] = 0 (sum of zero elements). prefix[i+1] = prefix[i] + nums[i]." });
      arr.forEach((v, i) => { pre.push(pre[i] + v); S.push({ rows: [{ label: "nums", vals: arr, cls: { [i]: "hl" } }, { label: "prefix", vals: pre.slice(), cls: { [i]: "inwin", [i + 1]: "hl" } }], msg: `prefix[${i + 1}] = prefix[${i}] + nums[${i}] = ${pre[i]} + ${v} = ${pre[i + 1]}` }); });
      const ans = pre[qj + 1] - pre[qi];
      S.push({ rows: [{ label: "nums", vals: arr, cls: C([[range(qi, qj), "done"]]) }, { label: "prefix", vals: pre, cls: { [qj + 1]: "hl", [qi]: "bad" } }], side: { query: `sum(${qi}..${qj})`, answer: ans }, msg: `sum(nums[${qi}..${qj}]) = prefix[${qj + 1}] − prefix[${qi}] = ${pre[qj + 1]} − ${pre[qi]} = ${ans}. One subtraction, no loop!` });
      return S;
    },
  };

  /* ---------- Monotonic stack: daily temperatures / next greater ---------- */
  V.monoStack = {
    title: "Monotonic Stack — next warmer day (next greater element)",
    input: "73 74 75 71 69 72 76 73", help: "temperatures",
    gen(inp) {
      const t = nums(inp), n = t.length, ans = Array(n).fill(0), st = [], S = [];
      for (let i = 0; i < n; i++) {
        while (st.length && t[st[st.length - 1]] < t[i]) {
          const j = st.pop(); ans[j] = i - j;
          S.push({ rows: [{ label: "temps", vals: t, cls: Object.assign(C([[st, "inwin"]]), { [i]: "hl", [j]: "done" }), ptr: { [i]: "i" } }, { label: "answer", vals: ans.slice(), cls: { [j]: "done" } }], side: { "stack (indices)": "[" + st.join(", ") + "]" }, msg: `${t[i]} > ${t[j]} (day ${j}) → day ${j} found its warmer day. Pop it, answer[${j}] = ${i} − ${j} = ${i - j}.` });
        }
        st.push(i);
        S.push({ rows: [{ label: "temps", vals: t, cls: Object.assign(C([[st, "inwin"]]), { [i]: "hl" }), ptr: { [i]: "i" } }, { label: "answer", vals: ans.slice() }], side: { "stack (indices)": "[" + st.join(", ") + "]" }, msg: `Push day ${i} (${t[i]}). Stack temperatures stay decreasing: [${st.map((x) => t[x]).join(", ")}] — they are all still waiting for a warmer day.` });
      }
      S.push({ rows: [{ label: "temps", vals: t }, { label: "answer", vals: ans, cls: C([[range(0, n - 1), "done"]]) }], msg: `Done. Days left in the stack never got warmer → 0. Each index is pushed & popped once → O(n).` });
      return S;
    },
  };

  /* ---------- Kadane ---------- */
  V.kadane = {
    title: "Kadane's Algorithm — maximum subarray sum",
    input: "-2 1 -3 4 -1 2 1 -5 4", help: "numbers",
    gen(inp) {
      const a = nums(inp), S = [];
      let cur = 0, best = -Infinity, start = 0, bs = 0, be = 0;
      a.forEach((v, i) => {
        let note;
        if (cur < 0) { note = `Running sum ${cur} is negative — it can only hurt. Drop it and start fresh at ${v}.`; cur = 0; start = i; } else note = `Extend the current subarray with ${v}.`;
        cur += v;
        if (cur > best) { best = cur; bs = start; be = i; }
        S.push({ rows: [{ vals: a, cls: Object.assign(C([[range(start, i), "inwin"]]), { [i]: "hl" }), ptr: { [start]: start === i ? "start,i" : "start", [i]: start === i ? "start,i" : "i" } }], side: { current: cur, best }, msg: note + ` current = ${cur}, best = ${best}` });
      });
      S.push({ rows: [{ vals: a, cls: C([[range(bs, be), "done"]]) }], side: { best }, msg: `Max subarray sum = ${best} (indices ${bs}..${be}).` });
      return S;
    },
  };

  /* ---------- Floyd cycle detection ---------- */
  V.fastSlow = {
    title: "Fast & Slow Pointers — detect a cycle (Floyd)",
    input: "3 2 0 -4 5 | 1", help: "node values | index the tail points to (-1 = no cycle)",
    gen(inp) {
      const [a, p] = split2(inp), vals = nums(a), pos = p === "" ? -1 : +p, n = vals.length, S = [];
      const nxt = (i) => (i === n - 1 ? (pos >= 0 ? pos : null) : i + 1);
      const arrows = vals.map((_, i) => (i < n - 1 ? "→" : ""));
      const tail = pos >= 0 ? `tail → index ${pos}` : "tail → None";
      let s = 0, f = 0, k = 0;
      const ptr = () => (s === f ? { [s]: "S F" } : { [s]: "S", [f]: "F" });
      S.push({ rows: [{ vals, arrows, ptr: ptr(), cls: { [s]: "hl" } }], side: { link: tail }, msg: "Both pointers start at head. Slow moves 1 step, fast moves 2 steps." });
      while (k++ < 50) {
        const f1 = nxt(f); const f2 = f1 == null ? null : nxt(f1);
        if (f1 == null || f2 == null) { S.push({ rows: [{ vals, arrows, ptr: { [s]: "S" } }], side: { link: tail }, msg: "Fast pointer hit the end (None) → there is NO cycle." }); return S; }
        s = nxt(s); f = f2;
        if (s === f) { S.push({ rows: [{ vals, arrows, ptr: ptr(), cls: { [s]: "done" } }], side: { link: tail }, msg: `Slow and fast met at node ${vals[s]} → CYCLE detected! (Inside a loop, fast gains 1 step per move, so it must catch slow.)` }); return S; }
        S.push({ rows: [{ vals, arrows, ptr: ptr(), cls: { [s]: "hl", [f]: "inwin" } }], side: { link: tail }, msg: `slow → ${vals[s]}, fast → ${vals[f]}` });
      }
      return S;
    },
  };

  /* ---------- Reverse linked list ---------- */
  V.reverseList = {
    title: "In-place Reversal — reverse a linked list",
    input: "1 2 3 4 5", help: "node values",
    gen(inp) {
      const vals = nums(inp), n = vals.length, S = [], arrows = vals.map((_, i) => (i < n - 1 ? "→" : ""));
      const P = (prev, cur) => { const p = {}; if (prev >= 0) p[prev] = "prev"; if (cur < n) p[cur] = (p[cur] ? p[cur] + "," : "") + "curr"; return p; };
      let prev = -1, cur = 0;
      S.push({ rows: [{ vals, arrows: arrows.slice(), ptr: P(prev, cur) }], side: { prev: "None", curr: vals[0] }, msg: "prev = None, curr = head. At each step: save next, flip curr.next to prev, advance both." });
      while (cur < n) {
        if (cur > 0) arrows[cur - 1] = "←";
        if (cur < n - 1) arrows[cur] = "×"; // link to the rest is cut (we saved it in nxt)
        const nxtV = cur + 1 < n ? vals[cur + 1] : "None";
        prev = cur; cur++;
        S.push({ rows: [{ vals, arrows: arrows.slice(), ptr: P(prev, cur), cls: C([[range(0, prev), "done"]]) }], side: { prev: vals[prev], curr: cur < n ? vals[cur] : "None" }, msg: `nxt = ${nxtV}; ${vals[prev]}.next = ${prev > 0 ? vals[prev - 1] : "None"} (flipped); prev = ${vals[prev]}; curr = ${nxtV}.` });
      }
      S.push({ rows: [{ vals, arrows, cls: C([[range(0, n - 1), "done"]]), ptr: { [n - 1]: "new head" } }], msg: `curr is None → return prev (${vals[n - 1]}) as the new head. O(n) time, O(1) space.` });
      return S;
    },
  };

  /* ---------- Bubble sort ---------- */
  V.bubbleSort = {
    title: "Bubble Sort — largest values bubble to the end",
    input: "5 1 4 2 8 3", help: "numbers",
    gen(inp) {
      const a = nums(inp), n = a.length, S = [];
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
          const sw = a[j] > a[j + 1];
          S.push({ rows: [{ vals: a.slice(), cls: Object.assign(C([[range(n - i, n - 1), "done"]]), { [j]: sw ? "bad" : "hl", [j + 1]: sw ? "bad" : "hl" }), ptr: { [j]: "j", [j + 1]: "j+1" } }], side: { pass: i + 1 }, msg: `Compare ${a[j]} and ${a[j + 1]}: ${sw ? "out of order → swap" : "in order → leave"}` });
          if (sw) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; }
        }
        S.push({ rows: [{ vals: a.slice(), cls: C([[range(n - 1 - i, n - 1), "done"]]) }], side: { pass: i + 1 }, msg: `End of pass ${i + 1}: ${a[n - 1 - i]} is now in its final place.` });
        if (!swapped) { S.push({ rows: [{ vals: a.slice(), cls: C([[range(0, n - 1), "done"]]) }], msg: "No swaps in this pass → already sorted, stop early." }); return S; }
      }
      S.push({ rows: [{ vals: a, cls: C([[range(0, n - 1), "done"]]) }], msg: "Sorted. O(n²) comparisons in the worst case." });
      return S;
    },
  };

  /* ---------- Quicksort partition (Lomuto) ---------- */
  V.partition = {
    title: "Quick Sort Partition (Lomuto) — split around a pivot",
    input: "7 2 1 8 6 3 5 4", help: "numbers (last one is the pivot)",
    gen(inp) {
      const a = nums(inp), n = a.length, S = [], pv = a[n - 1];
      let i = 0;
      S.push({ rows: [{ vals: a.slice(), cls: { [n - 1]: "hl" }, ptr: { 0: "i", [n - 1]: "pivot" } }], msg: `Pivot = ${pv}. i marks where the next "small" (< pivot) element goes.` });
      for (let j = 0; j < n - 1; j++) {
        if (a[j] < pv) {
          [a[i], a[j]] = [a[j], a[i]];
          S.push({ rows: [{ vals: a.slice(), cls: Object.assign(C([[range(0, i), "done"]]), { [n - 1]: "hl" }), ptr: i === j ? { [i]: "i,j" } : { [i]: "i", [j]: "j" } }], msg: `${a[i]} < ${pv} → swap into position i=${i}, then i++` });
          i++;
        } else S.push({ rows: [{ vals: a.slice(), cls: Object.assign(C([[range(0, i - 1), "done"]]), { [j]: "bad", [n - 1]: "hl" }), ptr: i === j ? { [i]: "i,j" } : { [i]: "i", [j]: "j" } }], msg: `${a[j]} ≥ ${pv} → stays on the right side` });
      }
      [a[i], a[n - 1]] = [a[n - 1], a[i]];
      S.push({ rows: [{ vals: a, cls: Object.assign(C([[range(0, i - 1), "inwin"], [range(i + 1, n - 1), "dim"]]), { [i]: "done" }), ptr: { [i]: "pivot" } }], msg: `Put pivot at index ${i}. Everything left is smaller, everything right is bigger. Recurse on both sides.` });
      return S;
    },
  };

  /* ---------- Grid BFS: number of islands ---------- */
  V.islands = {
    title: "Grid BFS — count islands (flood fill)",
    input: "11000/11010/00100/00011", help: "rows of 1/0 separated by /",
    kind: "grid",
    gen(inp) {
      const g = inp.split("/").map((r) => r.trim().split("").map(Number)), R = g.length, Cc = g[0].length, S = [];
      const seen = {}, base = () => { const c = {}; g.forEach((row, i) => row.forEach((v, j) => (c[i + "," + j] = v ? "land" : "water"))); Object.keys(seen).forEach((k) => (c[k] = "done")); return c; };
      let count = 0;
      S.push({ grid: g, cls: base(), side: { islands: 0 }, msg: "Scan cells left→right, top→bottom. When we hit unvisited land, it's a NEW island: BFS to mark all of it." });
      for (let i = 0; i < R; i++) for (let j = 0; j < Cc; j++) {
        if (!g[i][j] || seen[i + "," + j]) continue;
        count++;
        const q = [[i, j]]; seen[i + "," + j] = 1;
        S.push({ grid: g, cls: Object.assign(base(), { [i + "," + j]: "hl" }), side: { islands: count, queue: `[(${i},${j})]` }, msg: `Found unvisited land at (${i},${j}) → island #${count}. Start BFS.` });
        while (q.length) {
          const [r, c] = q.shift();
          for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= R || nc >= Cc || !g[nr][nc] || seen[nr + "," + nc]) continue;
            seen[nr + "," + nc] = 1; q.push([nr, nc]);
          }
          S.push({ grid: g, cls: Object.assign(base(), Object.fromEntries(q.map(([a, b]) => [a + "," + b, "hl"]))), side: { islands: count, queue: "[" + q.map(([a, b]) => `(${a},${b})`).join(" ") + "]" }, msg: `Visit (${r},${c}); add its unvisited land neighbours (up/down/left/right) to the queue.` });
        }
      }
      S.push({ grid: g, cls: base(), side: { islands: count }, msg: `Done. ${count} island(s). Every cell is visited once → O(rows × cols).` });
      return S;
    },
  };

  /* ---------- 1D DP: House robber ---------- */
  V.houseRobber = {
    title: "1-D DP — House Robber (fill the dp table)",
    input: "2 7 9 3 1", help: "money in each house",
    gen(inp) {
      const a = nums(inp), n = a.length, dp = Array(n).fill(""), S = [];
      S.push({ rows: [{ label: "nums", vals: a }, { label: "dp", vals: dp.slice() }], msg: "dp[i] = best money robbing houses 0..i. Choice at house i: skip it (dp[i-1]) or rob it (nums[i] + dp[i-2])." });
      for (let i = 0; i < n; i++) {
        const skip = i >= 1 ? dp[i - 1] : 0, rob = a[i] + (i >= 2 ? dp[i - 2] : 0);
        dp[i] = Math.max(skip, rob);
        S.push({ rows: [{ label: "nums", vals: a, cls: { [i]: "hl" } }, { label: "dp", vals: dp.slice(), cls: Object.assign({}, i >= 1 ? { [i - 1]: "inwin" } : {}, i >= 2 ? { [i - 2]: "inwin" } : {}, { [i]: "done" }), ptr: { [i]: "i" } }], side: { skip, rob }, msg: `dp[${i}] = max(skip = ${skip}, rob = ${a[i]} + ${i >= 2 ? dp[i - 2] : 0} = ${rob}) = ${dp[i]}` });
      }
      S.push({ rows: [{ label: "nums", vals: a }, { label: "dp", vals: dp, cls: { [n - 1]: "done" } }], msg: `Answer = dp[${n - 1}] = ${dp[n - 1]}. Only dp[i-1] and dp[i-2] are used → can shrink to O(1) space.` });
      return S;
    },
  };

  /* ---------- 2D DP: LCS ---------- */
  V.lcs = {
    title: "2-D DP — Longest Common Subsequence table",
    input: "abcde | ace", help: "text1 | text2",
    kind: "grid",
    gen(inp) {
      const [a, b] = split2(inp), A = a, B = b || "ace", m = A.length, n = B.length, S = [];
      const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      const view = () => [[" ", "∅", ...B.split("")], ...dp.map((row, i) => [i ? A[i - 1] : "∅", ...row])];
      const key = (i, j) => (i + 1) + "," + (j + 1);
      const headCls = () => { const c = {}; for (let j = 0; j <= n + 1; j++) c["0," + j] = "head"; for (let i = 0; i <= m + 1; i++) c[i + ",0"] = "head"; return c; };
      S.push({ grid: view(), cls: headCls(), msg: "dp[i][j] = LCS of A[:i] and B[:j]. Row/column 0 = empty string → 0." });
      for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
        const c = headCls();
        if (A[i - 1] === B[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; c[key(i - 1, j - 1)] = "done"; c[key(i, j)] = "hl"; S.push({ grid: view(), cls: c, msg: `A[${i - 1}]='${A[i - 1]}' == B[${j - 1}]='${B[j - 1]}' → match! dp[${i}][${j}] = diagonal + 1 = ${dp[i][j]}` }); }
        else { dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); c[key(i - 1, j)] = "done"; c[key(i, j - 1)] = "done"; c[key(i, j)] = "hl"; S.push({ grid: view(), cls: c, msg: `'${A[i - 1]}' ≠ '${B[j - 1]}' → dp[${i}][${j}] = max(up ${dp[i - 1][j]}, left ${dp[i][j - 1]}) = ${dp[i][j]}` }); }
      }
      const c = headCls(); c[key(m, n)] = "done";
      S.push({ grid: view(), cls: c, msg: `Answer = dp[${m}][${n}] = ${dp[m][n]}` });
      return S;
    },
  };

  /* ---------- Backtracking: subsets ---------- */
  V.subsets = {
    title: "Backtracking — generate all subsets (choose / skip)",
    input: "1 2 3", help: "distinct numbers (keep it ≤ 4)",
    gen(inp) {
      const a = nums(inp).slice(0, 4), S = [], res = [], path = [];
      const show = (i, msg) => S.push({ rows: [{ label: "nums", vals: a, cls: Object.assign(C([[a.map((_, k) => k).filter((k) => path.includes(a[k]) && k < i), "done"]]), i < a.length ? { [i]: "hl" } : {}), ptr: i < a.length ? { [i]: "i" } : {} }], side: { path: "[" + path.join(",") + "]", found: res.length }, msg });
      (function bt(i) {
        if (i === a.length) { res.push(path.slice()); show(i, `Reached the end → record subset [${path.join(", ")}]  (#${res.length})`); return; }
        path.push(a[i]); show(i, `Choose ${a[i]} → path [${path.join(", ")}]`);
        bt(i + 1);
        path.pop(); show(i, `Undo (backtrack): remove ${a[i]}. Now try skipping it.`);
        bt(i + 1);
      })(0);
      S.push({ rows: [{ label: "nums", vals: a }], side: { total: res.length }, msg: `All ${res.length} = 2^${a.length} subsets: ` + res.map((r) => "[" + r.join(",") + "]").join(" ") });
      return S;
    },
  };

  /* ---------- Union-Find ---------- */
  V.unionFind = {
    title: "Union-Find — merge groups, track parent[]",
    input: "6 | 0-1 1-2 3-4 2-0 4-5", help: "n | edges a-b",
    gen(inp) {
      const [a, b] = split2(inp), n = +a || 6, edges = b.split(/\s+/).filter(Boolean).map((e) => e.split("-").map(Number)), S = [];
      const par = range(0, n - 1), idx = range(0, n - 1);
      const find = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
      let comps = n;
      S.push({ rows: [{ label: "node", vals: idx }, { label: "parent", vals: par.slice() }], side: { components: comps }, msg: "Initially every node is its own parent (its own group)." });
      edges.forEach(([x, y]) => {
        const rx = find(x), ry = find(y);
        if (rx === ry) S.push({ rows: [{ label: "node", vals: idx, cls: { [x]: "bad", [y]: "bad" } }, { label: "parent", vals: par.slice() }], side: { components: comps }, msg: `Edge ${x}-${y}: find(${x}) = ${rx} and find(${y}) = ${ry} are the same root → already connected (this edge would make a CYCLE).` });
        else { par[ry] = rx; comps--; S.push({ rows: [{ label: "node", vals: idx, cls: { [x]: "hl", [y]: "hl" } }, { label: "parent", vals: par.slice(), cls: { [ry]: "done" } }], side: { components: comps }, msg: `Edge ${x}-${y}: roots ${rx} and ${ry} differ → union: parent[${ry}] = ${rx}. Components = ${comps}` }); }
      });
      return S;
    },
  };

  /* ---------- Merge intervals ---------- */
  V.mergeIntervals = {
    title: "Merge Intervals — sort by start, then sweep",
    input: "1-3 2-6 8-10 9-12 15-18", help: "intervals start-end",
    kind: "svg",
    gen(inp) {
      const list = inp.split(/\s+/).filter(Boolean).map((x) => x.split("-").map(Number)).sort((a, b) => a[0] - b[0]), S = [], out = [];
      S.push({ svg: D.intervals(list), msg: "Step 1: sort by start time (done). Now sweep left to right." });
      list.forEach((iv, i) => {
        if (out.length && iv[0] <= out[out.length - 1][1]) {
          const last = out[out.length - 1]; const old = last[1]; last[1] = Math.max(last[1], iv[1]);
          S.push({ svg: D.intervals(list, { hl: [i] }) + D.intervals(out, { ok: [out.length - 1] }), side: { merged: out.map((x) => `[${x}]`).join(" ") }, msg: `[${iv}] starts at ${iv[0]} ≤ last end ${old} → overlaps. Extend last to [${last}].` });
        } else {
          out.push(iv.slice());
          S.push({ svg: D.intervals(list, { hl: [i] }) + D.intervals(out, { ok: [out.length - 1] }), side: { merged: out.map((x) => `[${x}]`).join(" ") }, msg: `[${iv}] does not overlap the last merged interval → start a new one.` });
        }
      });
      S.push({ svg: D.intervals(out, { ok: range(0, out.length - 1) }), side: { result: out.map((x) => `[${x}]`).join(" ") }, msg: "Done. Sorting dominates: O(n log n)." });
      return S;
    },
  };

  /* ---------- Tree traversals ---------- */
  const TREE = [1, 2, 3, 4, 5, 6, 7];
  V.treeBFS = {
    title: "Tree BFS — level-order traversal with a queue",
    input: "1 2 3 4 5 6 7", help: "tree in level order (use null for gaps)",
    kind: "svg",
    gen(inp) {
      const t = inp.split(/[\s,]+/).filter(Boolean).map((x) => (x === "null" ? null : x)), S = [], done = [], levels = [];
      const q = [0];
      S.push({ svg: D.tree(t, { hl: [0] }), side: { queue: `[${t[0]}]` }, msg: "Put the root in the queue. Each round processes exactly one level (len(queue) nodes)." });
      while (q.length) {
        const sz = q.length, lv = [];
        for (let k = 0; k < sz; k++) {
          const i = q.shift(); done.push(i); lv.push(t[i]);
          [2 * i + 1, 2 * i + 2].forEach((c) => { if (c < t.length && t[c] != null) q.push(c); });
          S.push({ svg: D.tree(t, { ok: done, hl: q }), side: { queue: "[" + q.map((x) => t[x]).join(", ") + "]", level: "[" + lv.join(", ") + "]" }, msg: `Pop ${t[i]}, add its children to the back of the queue.` });
        }
        levels.push(lv);
        S.push({ svg: D.tree(t, { ok: done, hl: q }), side: { result: JSON.stringify(levels).replace(/"/g, "") }, msg: `Level ${levels.length - 1} complete: [${lv.join(", ")}]` });
      }
      return S;
    },
  };
  V.treeDFS = {
    title: "Tree DFS — preorder / inorder / postorder",
    input: "1 2 3 4 5 6 7 | in", help: "tree level-order | pre, in or post",
    kind: "svg",
    gen(inp) {
      const [a, mode0] = split2(inp), mode = mode0 || "in", t = a.split(/[\s,]+/).filter(Boolean).map((x) => (x === "null" ? null : x)), S = [], out = [];
      const rule = { pre: "node → left → right", in: "left → node → right", post: "left → right → node" }[mode];
      S.push({ svg: D.tree(t), side: { order: rule }, msg: `${mode}order: ${rule}. Recursion goes as deep as possible first.` });
      (function dfs(i, path) {
        if (i >= t.length || t[i] == null) return;
        const visit = () => { out.push(i); S.push({ svg: D.tree(t, { ok: out, hl: [i] }), side: { output: out.map((x) => t[x]).join(" ") }, msg: `Visit ${t[i]} → output: ${out.map((x) => t[x]).join(", ")}` }); };
        S.push({ svg: D.tree(t, { ok: out, hl: [i], he: path.concat(i) }), side: { output: out.map((x) => t[x]).join(" ") || "—" }, msg: `Enter node ${t[i]}` });
        if (mode === "pre") visit();
        dfs(2 * i + 1, path.concat(i));
        if (mode === "in") visit();
        dfs(2 * i + 2, path.concat(i));
        if (mode === "post") visit();
      })(0, []);
      return S;
    },
  };

  /* ---------- Heap: push into min-heap ---------- */
  V.heapPush = {
    title: "Min-Heap — push & sift up",
    input: "5 3 8 1 9 2", help: "values pushed one by one",
    kind: "svg",
    gen(inp) {
      const vals = nums(inp).slice(0, 15), h = [], S = [];
      vals.forEach((v) => {
        h.push(v); let i = h.length - 1;
        S.push({ svg: D.tree(h.slice(), { hl: [i] }), side: { array: "[" + h.join(", ") + "]" }, msg: `Push ${v}: place it at the end of the array (next free spot in the tree).` });
        while (i > 0 && h[(i - 1) >> 1] > h[i]) {
          const p = (i - 1) >> 1; [h[p], h[i]] = [h[i], h[p]];
          S.push({ svg: D.tree(h.slice(), { hl: [p], ok: [i] }), side: { array: "[" + h.join(", ") + "]" }, msg: `${h[p]} < parent ${h[i]} → swap up. (parent of i is (i-1)//2)` });
          i = p;
        }
      });
      S.push({ svg: D.tree(h, { ok: [0] }), side: { array: "[" + h.join(", ") + "]" }, msg: `Min is always at index 0: ${h[0]}. Push/pop are O(log n) because the tree height is log n.` });
      return S;
    },
  };

  /* ---------- Topological sort (Kahn) ---------- */
  V.topoSort = {
    title: "Topological Sort (Kahn's BFS) — course order",
    input: "", help: "fixed example graph",
    kind: "svg",
    gen() {
      const nodes = { A: [40, 40], B: [40, 160], C: [170, 100], D: [300, 40], E: [300, 160], F: [420, 100] };
      const edges = [["A", "C"], ["B", "C"], ["C", "D"], ["C", "E"], ["D", "F"], ["E", "F"]];
      const indeg = {}; Object.keys(nodes).forEach((k) => (indeg[k] = 0)); edges.forEach(([, b]) => indeg[b]++);
      const S = [], q = Object.keys(nodes).filter((k) => !indeg[k]), order = [];
      const lab = () => Object.fromEntries(Object.keys(nodes).map((k) => [k, "in=" + indeg[k]]));
      S.push({ svg: D.graph(nodes, edges, { directed: true, hl: q, lab: lab() }), side: { queue: "[" + q.join(",") + "]" }, msg: "Count incoming edges (in-degree). Nodes with in-degree 0 have no prerequisites → start in the queue." });
      while (q.length) {
        const u = q.shift(); order.push(u); const he = [];
        edges.filter(([a]) => a === u).forEach(([, v]) => { indeg[v]--; he.push(u + "-" + v); if (!indeg[v]) q.push(v); });
        S.push({ svg: D.graph(nodes, edges, { directed: true, ok: order, hl: q, he, lab: lab() }), side: { queue: "[" + q.join(",") + "]", order: order.join(" → ") }, msg: `Take ${u}. Remove its outgoing edges (decrement neighbours' in-degree). Any neighbour reaching 0 joins the queue.` });
      }
      S.push({ svg: D.graph(nodes, edges, { directed: true, ok: order }), side: { order: order.join(" → ") }, msg: order.length === Object.keys(nodes).length ? "All nodes processed → valid order. (If some were never processed, the graph has a cycle.)" : "Cycle detected." });
      return S;
    },
  };

  /* ---------- Dijkstra ---------- */
  V.dijkstra = {
    title: "Dijkstra — shortest paths with a min-heap",
    input: "", help: "fixed example graph, source = A",
    kind: "svg",
    gen() {
      const nodes = { A: [40, 110], B: [170, 30], C: [170, 190], D: [310, 30], E: [310, 190], F: [440, 110] };
      const edges = [["A", "B", 4], ["A", "C", 1], ["C", "B", 2], ["B", "D", 5], ["C", "E", 8], ["D", "E", 3], ["D", "F", 6], ["E", "F", 1]];
      const adj = {}; Object.keys(nodes).forEach((k) => (adj[k] = [])); edges.forEach(([a, b, w]) => { adj[a].push([b, w]); adj[b].push([a, w]); });
      const dist = {}; Object.keys(nodes).forEach((k) => (dist[k] = Infinity)); dist.A = 0;
      const pq = [[0, "A"]], done = [], S = [];
      const lab = () => Object.fromEntries(Object.keys(nodes).map((k) => [k, dist[k] === Infinity ? "∞" : dist[k]]));
      S.push({ svg: D.graph(nodes, edges, { hl: ["A"], lab: lab() }), side: { heap: "[(0,A)]" }, msg: "dist[A] = 0, everything else ∞. Always expand the closest unfinished node (min-heap)." });
      while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, u] = pq.shift();
        if (done.includes(u)) { S.push({ svg: D.graph(nodes, edges, { ok: done, lab: lab() }), side: { heap: "[" + pq.map((x) => `(${x})`).join(" ") + "]" }, msg: `Pop (${d},${u}) — ${u} already finalized with a shorter distance, skip (stale entry).` }); continue; }
        done.push(u); const he = [];
        adj[u].forEach(([v, w]) => { if (!done.includes(v) && d + w < dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); he.push(u + "-" + v); } });
        S.push({ svg: D.graph(nodes, edges, { ok: done, hl: [u], he, lab: lab() }), side: { heap: "[" + pq.slice().sort((a, b) => a[0] - b[0]).map((x) => `(${x})`).join(" ") + "]" }, msg: `Finalize ${u} (dist ${d}). Relax edges: if dist[u] + w < dist[v], update and push.` });
      }
      S.push({ svg: D.graph(nodes, edges, { ok: done, lab: lab() }), msg: "Done — labels show the shortest distance from A. O((V + E) log V)." });
      return S;
    },
  };

  /* ---------- Bit manipulation ---------- */
  V.bits = {
    title: "Bits — n & (n-1) removes the lowest set bit",
    input: "44", help: "a non-negative integer",
    gen(inp) {
      let n = Math.max(0, parseInt(inp) || 0) >>> 0, S = [], cnt = 0;
      const bits = (x) => x.toString(2).padStart(8, "0").split("");
      S.push({ rows: [{ label: "n", vals: bits(n) }], side: { n }, msg: `n = ${n} = ${n.toString(2)} in binary. Count 1s by repeatedly clearing the lowest 1.` });
      while (n) {
        const m = n - 1, low = 7 - Math.log2(n & -n);
        S.push({ rows: [{ label: "n", vals: bits(n), cls: { [low]: "hl" } }, { label: "n-1", vals: bits(m), cls: { [low]: "inwin" } }, { label: "n&(n-1)", vals: bits(n & m), cls: { [low]: "done" } }], side: { count: cnt + 1 }, msg: `n − 1 flips the lowest 1 and every 0 below it. AND-ing removes exactly that lowest 1.` });
        n &= m; cnt++;
      }
      S.push({ rows: [{ label: "n", vals: bits(0) }], side: { "set bits": cnt }, msg: `n became 0 after ${cnt} steps → ${cnt} set bits. Runs once per 1-bit, not once per bit.` });
      return S;
    },
  };

  /* =================================================================== Renderer */
  function renderRows(st) {
    return (st.rows || []).map((row) => {
      const cells = row.vals.map((v, i) => {
        const c = row.cls && row.cls[i] ? row.cls[i] : "";
        const arrow = row.arrows && i < row.vals.length - 1 ? `<div class="viz-cell"><div class="ptr"></div><div class="box gap">${row.arrows[i] || ""}</div><div class="idx"></div></div>` : "";
        return `<div class="viz-cell"><div class="ptr">${row.ptr && row.ptr[i] != null ? esc(row.ptr[i]) : ""}</div><div class="box ${c}">${esc(v === "" ? "" : v)}</div><div class="idx">${i}</div></div>${arrow}`;
      }).join("");
      return `<div class="viz-row">${row.label ? `<div class="small muted viz-label">${esc(row.label)}</div>` : ""}<div class="viz-cells">${cells}</div></div>`;
    }).join("");
  }
  function renderGrid(st) {
    const cols = st.grid[0].length;
    return `<div class="text-center"><div class="viz-grid" style="grid-template-columns:repeat(${cols},38px)">${st.grid.map((row, i) => row.map((v, j) => `<div class="box ${(st.cls && st.cls[i + "," + j]) || ""}">${esc(v)}</div>`).join("")).join("")}</div></div>`;
  }
  function renderStep(def, st) {
    let body = def.kind === "grid" ? renderGrid(st) : def.kind === "svg" ? `<div class="text-center">${st.svg}</div>` : renderRows(st);
    if (st.side) body += `<div class="viz-side">${Object.entries(st.side).map(([k, v]) => `<span class="chip"><span class="muted">${esc(k)}:</span> ${esc(v)}</span>`).join("")}</div>`;
    return body;
  }

  function mount(el) {
    const name = el.dataset.viz, def = V[name];
    if (!def || el.dataset.ready) return;
    el.dataset.ready = 1;
    el.innerHTML = `<div class="viz-head"><span class="title">${icon("play")} ${esc(def.title)}</span>
        ${def.input ? `<input type="text" value="${esc(def.input)}" title="${esc(def.help || "")}" aria-label="input"><button class="btn sm" data-a="run">Run</button>` : ""}</div>
      <div class="viz-stage"></div><div class="viz-msg"></div>
      <div class="viz-ctrl"><button class="btn sm" data-a="reset">${icon("first")}</button><button class="btn sm" data-a="prev">${icon("prev")} Prev</button><button class="btn sm primary" data-a="play">${swapLabel([icon("play") + " Play", icon("pause") + " Pause"])}</button><button class="btn sm" data-a="next">Next ${icon("play")}</button>${def.help ? `<span class="hide-sm">Input: ${esc(def.help)}</span>` : ""}<span class="step"></span></div>`;
    const stage = el.querySelector(".viz-stage"), msg = el.querySelector(".viz-msg"), stepEl = el.querySelector(".step"), inp = el.querySelector("input"), playB = el.querySelector('[data-a="play"]');
    let steps = [], k = 0, timer = null;
    const draw = () => { const st = steps[k]; if (!st) return; stage.innerHTML = renderStep(def, st); msg.innerHTML = fmt(st.msg || ""); stepEl.textContent = `step ${k + 1} / ${steps.length}`; };
    const stop = () => { clearInterval(timer); timer = null; setSwap(playB, 0); };
    const run = () => { stop(); try { steps = def.gen(inp ? inp.value : ""); } catch (e) { steps = [{ rows: [], msg: "Could not parse that input. Format: " + (def.help || "") }]; } k = 0; draw(); };
    el.addEventListener("click", (e) => {
      const a = e.target.closest("[data-a]"); if (!a) return;
      const act = a.dataset.a;
      if (act === "run") run();
      if (act === "reset") { stop(); k = 0; draw(); }
      if (act === "prev") { stop(); k = Math.max(0, k - 1); draw(); }
      if (act === "next") { stop(); k = Math.min(steps.length - 1, k + 1); draw(); }
      if (act === "play") {
        if (timer) return stop();
        if (k >= steps.length - 1) k = 0;
        setSwap(playB, 1);
        timer = setInterval(() => { if (k >= steps.length - 1) return stop(); k++; draw(); }, 1100);
      }
    });
    if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    run();
  }
  window.Viz = { defs: V, mountAll: (root = document) => root.querySelectorAll(".viz[data-viz]").forEach(mount) };
})();
