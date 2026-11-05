/* Clear, step-by-step dry runs (part B: Backtracking → Bit Manipulation). Each step: [what happens, why]. */
(function () {
  const D = {
/* ================= BACKTRACKING ================= */
"subsets": { on: "nums = [1, 2, 3]", setup: "`path` = the subset being built. At each index we choose to include nums[i], then undo that choice and exclude it.", steps: [
  ["include 1 → include 2 → include 3 → index 3 = end → record [1, 2, 3]", "Always \"include\" first."],
  ["undo 3 → exclude 3 → record [1, 2]", ""],
  ["undo 2 → exclude 2 → include 3 → [1, 3];  exclude 3 → [1]", ""],
  ["undo 1 → exclude 1 → same process → [2, 3], [2], [3], []", "Each number is in or out: 2 × 2 × 2 = 8 subsets."]],
  result: "`[[1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], []]`" },
"combination-sum": { on: "candidates = [2, 3, 6, 7], target = 7", setup: "`remain` = how much is left to reach the target. We may reuse the same candidate (recurse with j), but never go back to earlier candidates (that prevents duplicates).", steps: [
  ["2 → remain 5 → 2 → remain 3 → 2 → remain 1 → 2 > 1, stop (sorted, so break)", "Dead end."],
  ["Back at remain 3 (path [2, 2]) → try 3 → remain 0 → record [2, 2, 3]", ""],
  ["Back at remain 5 (path [2]) → try 3 → remain 2 → 3 > 2 stop;  6 > 5 stop", ""],
  ["Back at the top → try 3, 6 … → none fit;  try 7 → remain 0 → record [7]", ""]],
  result: "`[[2, 2, 3], [7]]`" },
"permutations": { on: "nums = [1, 2, 3]", setup: "Fill positions one at a time with any number not yet used.", steps: [
  ["pick 1 → pick 2 → pick 3 → full → record [1, 2, 3]", ""],
  ["undo 3, undo 2 → pick 3 → pick 2 → record [1, 3, 2]", ""],
  ["undo back to empty → start with 2 → [2, 1, 3], [2, 3, 1]", ""],
  ["start with 3 → [3, 1, 2], [3, 2, 1]", "3 × 2 × 1 = 6 permutations."]],
  result: "6 permutations" },
"subsets-ii": { on: "nums = [1, 2, 2] (sorted)", setup: "Every node of the recursion records a subset. At the same depth, we never start a branch with a value we've already started a branch with.", steps: [
  ["record [] → pick 1 → record [1] → pick 2 → [1, 2] → pick 2 → [1, 2, 2]", ""],
  ["back in [1]'s loop: the second 2 is a duplicate at this level → skip", "It would create [1, 2] again."],
  ["back at the top: pick 2 → [2] → pick 2 → [2, 2]", "Using the second 2 one level deeper is fine."],
  ["top-level second 2 → skip", ""]],
  result: "`[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]`" },
"combination-sum-ii": { on: "candidates sorted [1, 1, 2, 5, 6, 7, 10], target = 8", setup: "Each element is used at most once (recurse with j + 1). Equal values at the same depth are skipped.", steps: [
  ["1 → 1 → (remain 6) → 2 → 5 > 4 stop … → 6 → remain 0 → record [1, 1, 6]", ""],
  ["1 → 2 → 5 → remain 0 → record [1, 2, 5];  1 → 7 → record [1, 7]", ""],
  ["top level: the second 1 → skip (a duplicate start)", "It would repeat the combos above."],
  ["2 → 6 → record [2, 6];  5, 6, 7 … nothing else fits", ""]],
  result: "`[[1,1,6], [1,2,5], [1,7], [2,6]]`" },
"word-search": { on: "board ABCE / SFCS / ADEE, word \"ABCCED\"", setup: "DFS from a cell, matching word[i]. Cells on the current path are marked '#' so they aren't reused, then restored.", steps: [
  ["(0,0) 'A' ✓ → (0,1) 'B' ✓ → (0,2) 'C' ✓", ""],
  ["→ (1,2) 'C' ✓ → (2,2) 'E' ✓ → (2,1) 'D' ✓ → i = 6 = len → True", "Every letter matched along adjacent cells."],
  ["For \"ABCB\": after A → B → C, the only 'B' next to it is already '#' → fail everywhere", "A cell can't be reused."]],
  result: "`True` (\"ABCB\" → `False`)" },
"palindrome-partitioning": { on: "s = \"aab\"", setup: "Choose where the next piece ends. Only continue if that piece is a palindrome.", steps: [
  ["\"a\" ✓ → \"a\" ✓ → \"b\" ✓ → reached the end → record [a, a, b]", ""],
  ["at index 1: \"ab\" ✗ → skip", ""],
  ["at index 0: \"aa\" ✓ → \"b\" ✓ → record [aa, b]", ""],
  ["\"aab\" ✗ → skip", ""]],
  result: "`[[\"a\",\"a\",\"b\"], [\"aa\",\"b\"]]`" },
"letter-combinations-of-a-phone-number": { on: "digits = \"23\"", setup: "One recursion level per digit. Branch over that digit's letters.", steps: [
  ["'2' → a, b, c", ""],
  ["a + '3' → ad, ae, af", ""],
  ["b → bd, be, bf;  c → cd, ce, cf", "3 × 3 = 9 strings."]],
  result: "9 combinations" },
"n-queens": { on: "n = 4", setup: "One queen per row. Sets track used columns, ↘ diagonals (r − c) and ↙ diagonals (r + c).", steps: [
  ["row 0, col 0 → row 1: col 2 → row 2: every column is attacked → backtrack", ""],
  ["row 1: col 3 → row 2: col 1 → row 3: all attacked → backtrack all the way", ""],
  ["row 0, col 1 → row 1 col 3 → row 2 col 0 → row 3 col 2 ✓ → record .Q.. / ...Q / Q... / ..Q.", "The first solution."],
  ["continue … row 0 col 2 → the mirror solution", ""]],
  result: "2 solutions" },
/* ================= GRAPHS ================= */
"number-of-islands": { on: "grid 11000 / 11000 / 00100 / 00011", setup: "Scan every cell. Unvisited land = a new island, so BFS from it and turn all of its land to water.", steps: [
  ["(0,0) is land → count 1 → BFS sinks (0,0) (0,1) (1,0) (1,1)", "The whole top-left block is one island."],
  ["Continue scanning… (2,2) is land → count 2 → sink it", ""],
  ["(3,3) is land → count 3 → sink (3,3) (3,4)", ""],
  ["No land left", ""]],
  result: "`3`" },
"clone-graph": { on: "4-cycle 1 – 2 – 3 – 4 – 1", setup: "`clones` maps original → copy. A copy is registered BEFORE its neighbours are cloned.", steps: [
  ["clone(1) → create 1', register it → clone neighbour 2", ""],
  ["clone(2) → create 2' → neighbour 1 is already cloned → reuse 1' → clone 3", "This is what stops infinite loops."],
  ["clone(3) → 3' → neighbours 2 (done) and 4 → clone(4) → 4' → neighbours 1, 3 (done)", ""]],
  result: "A separate copy with the same edges." },
"max-area-of-island": { on: "the 8×13 example grid", setup: "DFS returns how many land cells it sank. Take the max over all islands.", steps: [
  ["Island at (0,2) → area 1", ""],
  ["Island at (0,7) → area 4;  the (2,1) island → area 4", ""],
  ["Island at (3,8) → cells (3,8) (3,10) (4,8) (4,9) (4,10) (5,10) → area **6**", ""],
  ["Others are smaller", ""]],
  result: "`6`" },
"pacific-atlantic-water-flow": { on: "the 5×5 heights example", setup: "Run DFS from each ocean's border and move UPHILL (to neighbours ≥ the current height). The cells reached could drain to that ocean.", steps: [
  ["From the top and left edges → `pac` = all cells reachable uphill", ""],
  ["From the bottom and right edges → `atl`", ""],
  ["Answer = cells in both sets, e.g. (2,2) with height 5 drains both ways", ""]],
  result: "`[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`" },
"surrounded-regions": { on: "XXXX / XOOX / XXOX / XOXX", setup: "Mark every 'O' connected to the border as safe ('T'). The remaining 'O's are surrounded.", steps: [
  ["Border 'O' at (3,1) → mark 'T'", "Touching the edge, so it can't be captured."],
  ["Interior O's (1,1) (1,2) (2,2) → never marked → flip to X", ""],
  ["'T' → back to O", ""]],
  result: "XXXX / XXXX / XXXX / XOXX" },
"rotting-oranges": { on: "[[2,1,1],[1,1,0],[0,1,1]]", setup: "Multi-source BFS: every rotten orange starts in the queue, and each BFS level is one minute.", steps: [
  ["Minute 1: (0,0) rots (0,1) and (1,0)", ""],
  ["Minute 2: those rot (0,2) and (1,1)", ""],
  ["Minute 3: (1,1) rots (2,1)", ""],
  ["Minute 4: (2,1) rots (2,2) → fresh = 0", ""]],
  result: "`4`" },
"walls-and-gates": { on: "the 4×4 rooms example", setup: "Multi-source BFS from ALL gates at once. The first time a room is reached is its shortest distance.", steps: [
  ["Queue starts with both gates (0,2) and (3,0)", ""],
  ["Distance 1: (0,3), (1,2), (2,0)", ""],
  ["Distance 2: (1,1), (2,2), (1,0) … and so on outward", "Walls (−1) block the spread."]],
  result: "Every room holds its distance to the nearest gate." },
"course-schedule": { on: "numCourses = 2, prerequisites [[1,0],[0,1]]", setup: "in-degree = the number of unmet prerequisites. Courses with in-degree 0 can be taken.", steps: [
  ["indeg = [1, 1] → no course has 0", "Each course needs the other."],
  ["The queue is empty → taken = 0", ""],
  ["0 ≠ 2 → return False", "A cycle means it's impossible."]],
  result: "`False` (with only [[1,0]]: take 0, then 1 → `True`)" },
"course-schedule-ii": { on: "4 courses, prerequisites [[1,0],[2,0],[3,1],[3,2]]", setup: "Kahn's algorithm: take any course with in-degree 0, then reduce the in-degree of the courses that depend on it.", steps: [
  ["indeg = [0, 1, 1, 2] → queue [0]", ""],
  ["take 0 → 1 and 2 drop to 0 → queue [1, 2] → order [0]", ""],
  ["take 1 → 3 drops to 1;  take 2 → 3 drops to 0 → queue [3]", ""],
  ["take 3 → order [0, 1, 2, 3]", ""]],
  result: "`[0, 1, 2, 3]`" },
"redundant-connection": { on: "edges [[1,2],[1,3],[2,3]]", setup: "Union-Find: add edges one by one. An edge whose ends are already connected closes a cycle.", steps: [
  ["(1,2) → different groups → merge {1,2}", ""],
  ["(1,3) → merge → {1,2,3}", ""],
  ["(2,3) → find(2) == find(3) → already connected → return [2, 3]", ""]],
  result: "`[2, 3]`" },
"number-of-connected-components-in-an-undirected-graph": { on: "n = 5, edges [[0,1],[1,2],[3,4]]", setup: "Start with 5 groups. Each successful merge reduces the count by 1.", steps: [
  ["(0,1) merge → 4", ""],
  ["(1,2) merge → 3", ""],
  ["(3,4) merge → 2", ""]],
  result: "`2` → {0,1,2} and {3,4}" },
"graph-valid-tree": { on: "n = 5, edges [[0,1],[1,2],[2,3],[1,3],[1,4]]", setup: "A tree needs exactly n − 1 edges and no cycle.", steps: [
  ["5 edges ≠ 5 − 1 = 4 → return False immediately", "Too many edges for a tree, so a cycle must exist."]],
  result: "`False`" },
"word-ladder": { on: "hit → cog, words [hot, dot, dog, lot, log, cog]", setup: "BFS over words, level by level. Neighbours are found through wildcard patterns like h*t.", steps: [
  ["level 1: hit", ""],
  ["level 2: hot (via h*t)", ""],
  ["level 3: dot, lot (via *ot)", ""],
  ["level 4: dog, log", ""],
  ["level 5: cog ✓", ""]],
  result: "`5` words in the shortest chain." },
/* ================= ADVANCED GRAPHS ================= */
"reconstruct-itinerary": { on: "JFK→KUL, JFK→NRT, NRT→JFK", setup: "DFS that uses up tickets smallest-destination first. An airport is added to the route only after ALL its tickets are used (post-order). Reverse at the end.", steps: [
  ["dfs(JFK) → take KUL (smallest) → dfs(KUL): no tickets → route [KUL]", "A dead end gets added first."],
  ["back at JFK → take NRT → dfs(NRT) → take JFK → dfs(JFK): no tickets left → route [KUL, JFK]", ""],
  ["NRT done → [KUL, JFK, NRT];  JFK done → [KUL, JFK, NRT, JFK]", ""],
  ["reverse → JFK, NRT, JFK, KUL", ""]],
  result: "`[\"JFK\",\"NRT\",\"JFK\",\"KUL\"]`" },
"min-cost-to-connect-all-points": { on: "[[0,0],[2,2],[3,10],[5,2],[7,0]]", setup: "Prim's algorithm: grow the tree from (0,0), always adding the cheapest edge to a point not yet in it.", steps: [
  ["Add (0,0) at cost 0", ""],
  ["Cheapest new point: (2,2), cost 4 → total 4", ""],
  ["(5,2), cost 3 → 7;  (7,0), cost 4 → 11", ""],
  ["(3,10), cost 9 (from (2,2)) → 20", ""]],
  result: "`20`" },
"network-delay-time": { on: "times [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", setup: "Dijkstra: always pop the node with the smallest known time. The first pop finalizes it.", steps: [
  ["pop (0, 2) → final 2 = 0 → push (1, 1), (1, 3)", ""],
  ["pop (1, 1) → final 1 = 1", ""],
  ["pop (1, 3) → final 3 = 1 → push (2, 4)", ""],
  ["pop (2, 4) → final 4 = 2 → all 4 reached → the max time is 2", ""]],
  result: "`2`" },
"swim-in-rising-water": { on: "[[0,2],[1,3]]", setup: "Dijkstra where a path's cost is the HIGHEST cell on it.", steps: [
  ["pop (0, (0,0)) → push (2, (0,1)), (1, (1,0))", ""],
  ["pop (1, (1,0)) → push (max(1, 3) = 3, (1,1))", ""],
  ["pop (2, (0,1)) → (1,1) already queued", ""],
  ["pop (3, (1,1)) = target", ""]],
  result: "`3`" },
"alien-dictionary": { on: "[wrt, wrf, er, ett, rftt]", setup: "Compare each adjacent pair of words. The first differing letter gives an ordering rule. Then topologically sort the letters.", steps: [
  ["wrt vs wrf → t before f", ""],
  ["wrf vs er → w before e", ""],
  ["er vs ett → r before t", ""],
  ["ett vs rftt → e before r", ""],
  ["Rules w→e→r→t→f → topological order", ""]],
  result: "`\"wertf\"`" },
"cheapest-flights-within-k-stops": { on: "the 4-city example, src 0 → dst 3, k = 1 (so at most 2 flights)", setup: "Bellman-Ford for k + 1 rounds. Each round reads LAST round's prices, so one round adds at most one more flight.", steps: [
  ["start: [0, ∞, ∞, ∞]", ""],
  ["round 1: 0→1 → [0, 100, ∞, ∞]", ""],
  ["round 2: 1→2 = 200, 1→3 = 700 → [0, 100, 200, 700]", "2→3 would cost 400, but that needs a 3rd flight."]],
  result: "`700`" },
/* ================= 1-D DP ================= */
"climbing-stairs": { on: "n = 5", setup: "ways(i) = ways(i−1) + ways(i−2): your last move was 1 step or 2 steps.", steps: [
  ["ways(1) = 1, ways(2) = 2", "The base cases."],
  ["ways(3) = 2 + 1 = 3", ""],
  ["ways(4) = 3 + 2 = 5", ""],
  ["ways(5) = 5 + 3 = 8", ""]],
  result: "`8`" },
"min-cost-climbing-stairs": { on: "cost = [10, 15, 20]", setup: "dp[i] = the cheapest way to ARRIVE at step i. You can start at 0 or 1 for free.", steps: [
  ["dp[0] = 0, dp[1] = 0", ""],
  ["dp[2] = min(dp[1] + 15, dp[0] + 10) = 10", ""],
  ["dp[3] (the top) = min(dp[2] + 20, dp[1] + 15) = **15**", "Start at step 1, pay 15, jump 2 steps."]],
  result: "`15`" },
"house-robber": { on: "nums = [2, 7, 9, 3, 1]", setup: "best(i) = max(skip house i → best(i−1),  rob it → nums[i] + best(i−2)).", steps: [
  ["house 0 (2): best 2", ""],
  ["house 1 (7): max(2, 7) = 7", ""],
  ["house 2 (9): max(7, 2 + 9) = 11", ""],
  ["house 3 (3): max(11, 7 + 3) = 11", ""],
  ["house 4 (1): max(11, 11 + 1) = **12**", "Rob houses 0, 2 and 4."]],
  result: "`12`" },
"house-robber-ii": { on: "nums = [2, 3, 2] (a circle)", setup: "The first and last houses can't both be robbed, so solve two straight lines and take the better one.", steps: [
  ["Without the last house: [2, 3] → 3", ""],
  ["Without the first house: [3, 2] → 3", ""],
  ["max(3, 3)", ""]],
  result: "`3`" },
"longest-palindromic-substring": { on: "s = \"babad\"", setup: "Expand around each of the 2n − 1 centers while both ends match.", steps: [
  ["center 'b' (0) → \"b\"", ""],
  ["center 'a' (1) → b = b → \"bab\" → best", ""],
  ["center 'b' (2) → \"aba\" (same length, not better) → then b ≠ d, stop", ""],
  ["other centers give shorter palindromes", ""]],
  result: "`\"bab\"`" },
"palindromic-substrings": { on: "s = \"aaa\"", setup: "Every successful expansion is one more palindrome.", steps: [
  ["center 0 → \"a\" (1)", ""],
  ["gap 0-1 → \"aa\" (2)", ""],
  ["center 1 → \"a\", then \"aaa\" (4)", ""],
  ["gap 1-2 → \"aa\" (5);  center 2 → \"a\" (6)", ""]],
  result: "`6`" },
"decode-ways": { on: "s = \"226\"", setup: "dp[i] = the number of ways to decode the first i characters.", steps: [
  ["dp[0] = 1 (empty), dp[1] = 1 (\"2\")", ""],
  ["i = 2: \"2\" ok → + dp[1] = 1;  \"22\" ok → + dp[0] = 1 → dp[2] = 2", "BB or V."],
  ["i = 3: \"6\" ok → + dp[2] = 2;  \"26\" ok → + dp[1] = 1 → dp[3] = 3", "BBF, VF, BZ."]],
  result: "`3`" },
"coin-change": { on: "coins = [1, 3, 4], amount = 6", setup: "dp[a] = the fewest coins to make a. Try each coin as the last one used.", steps: [
  ["dp[0] = 0, dp[1] = 1, dp[2] = 2", ""],
  ["dp[3] = 1 (one 3), dp[4] = 1 (one 4)", ""],
  ["dp[5] = min(dp[4] + 1, dp[2] + 1, dp[1] + 1) = 2", ""],
  ["dp[6] = min(dp[5] + 1 = 3, dp[3] + 1 = **2**, dp[2] + 1 = 3) = 2", "3 + 3 beats greedy's 4 + 1 + 1."]],
  result: "`2`" },
"maximum-product-subarray": { on: "nums = [2, 3, −2, 4]", setup: "Track the largest AND smallest product ending at the current position, because a negative swaps them.", steps: [
  ["2 → hi 2, lo 2, best 2", ""],
  ["3 → hi 6, lo 3, best 6", ""],
  ["−2 → candidates −2, −12, −6 → hi −2, lo −12", ""],
  ["4 → candidates 4, −8, −48 → hi 4 → best stays 6", ""]],
  result: "`6`" },
"word-break": { on: "s = \"leetcode\", words [leet, code]", setup: "ok[i] = can the first i characters be split into words?", steps: [
  ["ok[0] = True (empty)", ""],
  ["ok[4]: \"leet\" is a word and ok[0] → True", ""],
  ["ok[8]: \"code\" (s[4:8]) is a word and ok[4] → True", ""]],
  result: "`True`" },
"longest-increasing-subsequence": { on: "[10, 9, 2, 5, 3, 7, 101, 18]", setup: "`tails[k]` = the smallest possible ending value of an increasing run of length k + 1.", steps: [
  ["10 → [10];  9 → replace → [9];  2 → [2]", "Smaller tails are always better."],
  ["5 → append → [2, 5];  3 → replace 5 → [2, 3]", ""],
  ["7 → [2, 3, 7];  101 → [2, 3, 7, 101]", ""],
  ["18 → replace 101 → [2, 3, 7, 18] → length 4", ""]],
  result: "`4`" },
"partition-equal-subset-sum": { on: "nums = [1, 5, 11, 5] (total 22 → target 11)", setup: "Track every subset sum we can reach.", steps: [
  ["start {0}", ""],
  ["1 → {0, 1}", ""],
  ["5 → {0, 1, 5, 6}", ""],
  ["11 → {…, 11, 12, 16, 17} → 11 reached", ""]],
  result: "`True` ([1, 5, 5] and [11])" },
/* ================= 2-D DP ================= */
"unique-paths": { on: "3 × 3 grid", setup: "Each cell = paths from above + paths from the left. The first row and column are all 1.", steps: [
  ["row 0: 1 1 1", ""],
  ["row 1: 1, 1+1 = 2, 2+1 = 3", ""],
  ["row 2: 1, 2+1 = 3, 3+3 = 6", ""]],
  result: "`6` (3 × 7 → 28)" },
"longest-common-subsequence": { on: "\"abcde\" vs \"ace\"", setup: "dp[i][j] = the LCS of the first i letters and the first j letters.", steps: [
  ["a = a → dp = diagonal + 1 = 1", ""],
  ["c = c (row c, column c) → diagonal (1) + 1 = 2", ""],
  ["e = e → 2 + 1 = 3", ""],
  ["Mismatches copy the bigger of up and left", ""]],
  result: "`3` (\"ace\")" },
"best-time-to-buy-and-sell-stock-with-cooldown": { on: "prices = [1, 2, 3, 0, 2]", setup: "Three states: hold (owning a share), sold (just sold today), rest (free to buy).", steps: [
  ["day 0 (1): buy → hold −1", ""],
  ["day 1 (2): sell → sold 1;  day 2 (3): sell → sold 2, rest 1", ""],
  ["day 3 (0): buy from rest → hold = 1 − 0 = 1", "Cooldown respected."],
  ["day 4 (2): sell → sold = 1 + 2 = **3**", ""]],
  result: "`3`" },
"coin-change-ii": { on: "amount = 5, coins [1, 2, 5]", setup: "dp[a] = the number of combinations. With coins in the outer loop, each combination is counted once.", steps: [
  ["only coin 1: 1 1 1 1 1 1", ""],
  ["add coin 2: dp = 1 1 2 2 3 3", ""],
  ["add coin 5: dp[5] = 3 + dp[0] = 4", ""]],
  result: "`4`" },
"target-sum": { on: "[1, 1, 1, 1, 1], target 3", setup: "`ways` = {sum: number of sign choices}. Each number branches every sum into + and −.", steps: [
  ["after 1st: {1:1, −1:1}", ""],
  ["after 2nd: {2:1, 0:2, −2:1}", ""],
  ["after 3rd: {3:1, 1:3, −1:3, −3:1}", ""],
  ["after 5th: {5:1, 3:5, 1:10, …}", ""]],
  result: "`5`" },
"interleaving-string": { on: "s1 = aabcc, s2 = dbbca, s3 = aadbbcbcac", setup: "dp[i][j] = can i chars of s1 and j chars of s2 form the first i + j chars of s3?", steps: [
  ["dp[1][0], dp[2][0] ✓ (a, a from s1)", ""],
  ["dp[2][1] ✓ (d from s2) …", ""],
  ["Keep extending, taking the next char from whichever string matches s3", ""],
  ["dp[5][5] ✓", ""]],
  result: "`True`" },
"longest-increasing-path-in-a-matrix": { on: "[[9,9,4],[6,6,8],[2,1,1]]", setup: "dfs(cell) = 1 + the best over strictly bigger neighbours, cached.", steps: [
  ["dfs(9) = 1 (no bigger neighbour)", ""],
  ["dfs(6 at (1,0)) = 1 + dfs(9) = 2", ""],
  ["dfs(2) = 1 + dfs(6) = 3", ""],
  ["dfs(1 at (2,1)) = 1 + dfs(2) = 4", ""]],
  result: "`4` (1 → 2 → 6 → 9)" },
"distinct-subsequences": { on: "s = rabbbit, t = rabbit", setup: "dp[i][j] = the number of ways s[i:] forms t[j:]. Skip s[i], or use it if it matches.", steps: [
  ["\"rabb\" must use two of the three b's", ""],
  ["Choose which b to drop: 3 options", "C(3, 2) = 3."]],
  result: "`3`" },
"edit-distance": { on: "horse → ros", setup: "dp[i][j] = the edits needed to turn the first i chars into the first j chars.", steps: [
  ["Base row/column: 0..3 and 0..5", ""],
  ["Replace h → r", ""],
  ["'o' matches 'o' → free", ""],
  ["Delete r, delete e", ""],
  ["dp[5][3] = 3", ""]],
  result: "`3`" },
"burst-balloons": { on: "[3, 1, 5, 8] padded [1, 3, 1, 5, 8, 1]", setup: "dp[l][r] = the best for the balloons strictly between l and r. Choose which balloon pops LAST.", steps: [
  ["Short ranges first", ""],
  ["For the full range: try each balloon k as the last one", ""],
  ["k = 8 last gives 159 + 1 × 8 × 1 = 167", ""]],
  result: "`167`" },
"regular-expression-matching": { on: "s = aab, p = c*a*b", setup: "dfs(i, j): does s[i:] match p[j:]? Each `x*` can match zero or more x.", steps: [
  ["c* → match zero c's → p moves to a*", ""],
  ["a* eats 'a', 'a'", ""],
  ["a* then matches zero more → p at b", ""],
  ["b = b → both at end ✓", ""]],
  result: "`True`" },
/* ================= GREEDY ================= */
"maximum-subarray": { on: "[−2, 1, −3, 4, −1, 2, 1, −5, 4]", setup: "cur = the best sum ending here (extend, or restart).", steps: [
  ["−2 → cur −2;  1 → restart at 1", "A negative prefix only hurts."],
  ["−3 → cur −2;  4 → restart at 4", ""],
  ["−1 → 3;  2 → 5;  1 → **6**", ""],
  ["−5 → 1;  4 → 5 → best stays 6", ""]],
  result: "`6` ([4, −1, 2, 1])" },
"jump-game": { on: "[3, 2, 1, 0, 4]", setup: "reach = the farthest index reachable so far.", steps: [
  ["i0 → reach 3", ""],
  ["i1, i2, i3 → reach stays 3", "Every jump lands on or before index 3."],
  ["i4 > reach 3 → stuck", ""]],
  result: "`False` ([2, 3, 1, 1, 4] → `True`)" },
"jump-game-ii": { on: "[2, 3, 1, 1, 4]", setup: "Each \"window\" = the indices reachable with the current number of jumps.", steps: [
  ["0 jumps: [0, 0] → farthest 2", ""],
  ["1 jump: [1, 2] → farthest max(1 + 3, 2 + 1) = 4", ""],
  ["4 ≥ last index → 2 jumps", ""]],
  result: "`2`" },
"gas-station": { on: "gas [1,2,3,4,5], cost [3,4,5,1,2]", setup: "Keep a running tank. If it goes negative, the start must be after this station.", steps: [
  ["totals 15 ≥ 15 → a solution exists", ""],
  ["stations 0, 1, 2 each give −2 → reset → start 3", ""],
  ["station 3: +3, station 4: +3 → never negative", ""]],
  result: "`3`" },
"hand-of-straights": { on: "[1,2,3,6,2,3,4,7,8], groupSize 3", setup: "The smallest remaining card must start a group.", steps: [
  ["1 starts 1-2-3", ""],
  ["the next smallest, 2, starts 2-3-4", ""],
  ["6 starts 6-7-8", ""],
  ["nothing left", ""]],
  result: "`True`" },
"merge-triplets-to-form-target-triplet": { on: "[[2,5,3],[1,8,4],[1,7,5]] → target [2,7,5]", setup: "Skip any triplet that exceeds the target anywhere. Collect the positions that match the target exactly.", steps: [
  ["[1,8,4] → 8 > 7 → skip", ""],
  ["[2,5,3] → matches position 0", ""],
  ["[1,7,5] → matches positions 1 and 2 → all three covered", ""]],
  result: "`True`" },
"partition-labels": { on: "ababcbacadefegdehijhklij", setup: "end = the furthest last occurrence of any letter in the current part.", steps: [
  ["'a' last at 8 → end 8 → cut at 8 → size 9", ""],
  ["'d' 14, 'e' 15 → cut at 15 → size 7", ""],
  ["the rest → size 8", ""]],
  result: "`[9, 7, 8]`" },
"valid-parenthesis-string": { on: "\"(*))\"", setup: "[lo, hi] = the range of possible open-bracket counts.", steps: [
  ["( → [1, 1];  * → [0, 2]", ""],
  [") → [0, 1];  ) → [0, 0] (lo clamped)", ""],
  ["end with lo = 0 → valid", ""]],
  result: "`True`" },
/* ================= INTERVALS ================= */
"insert-interval": { on: "[[1,2],[3,5],[6,7],[8,10],[12,16]] + [4,8]", setup: "Three phases: before, overlapping, after.", steps: [
  ["[1,2] ends before 4 → copy it", ""],
  ["[3,5], [6,7], [8,10] overlap → merge into [3,10]", ""],
  ["[12,16] comes after → copy it", ""]],
  result: "`[[1,2],[3,10],[12,16]]`" },
"merge-intervals": { on: "[[1,3],[2,6],[8,10],[15,18]]", setup: "Sort by start, then compare each interval with the last merged one.", steps: [
  ["[1,3]", ""],
  ["[2,6] overlaps → [1,6]", ""],
  ["[8,10] new;  [15,18] new", ""]],
  result: "`[[1,6],[8,10],[15,18]]`" },
"non-overlapping-intervals": { on: "[[1,2],[2,3],[3,4],[1,3]]", setup: "Sort by end and keep greedily.", steps: [
  ["keep [1,2], keep [2,3]", ""],
  ["[1,3] starts before 3 → remove", ""],
  ["keep [3,4]", ""]],
  result: "`1`" },
"meeting-rooms": { on: "[[0,30],[5,10],[15,20]]", setup: "Sort, then compare neighbours.", steps: [["[5,10] starts before [0,30] ends → conflict", ""]], result: "`False`" },
"meeting-rooms-ii": { on: "[[0,30],[5,10],[15,20]]", setup: "A min-heap of end times for the rooms in use.", steps: [
  ["[0,30] → rooms {30}", ""],
  ["[5,10] → 30 > 5 → a new room → {10, 30}", ""],
  ["[15,20] → 10 ≤ 15 → reuse → {20, 30}", ""]],
  result: "`2`" },
"minimum-interval-to-include-each-query": { on: "intervals [[1,4],[2,4],[3,6],[4,4]], queries [2,3,4,5]", setup: "Process the queries in sorted order. The heap holds (size, end).", steps: [
  ["q2: add [1,4] (4), [2,4] (3) → 3", ""],
  ["q3: add [3,6] → still 3", ""],
  ["q4: add [4,4] (1) → 1", ""],
  ["q5: pop everything ending before 5 → [3,6] → 4", ""]],
  result: "`[3, 3, 1, 4]`" },
/* ================= MATH & GEOMETRY ================= */
"rotate-image": { on: "[[1,2,3],[4,5,6],[7,8,9]]", setup: "Transpose, then reverse each row.", steps: [
  ["transpose → [[1,4,7],[2,5,8],[3,6,9]]", ""],
  ["reverse rows → [[7,4,1],[8,5,2],[9,6,3]]", ""]],
  result: "Rotated 90° clockwise." },
"spiral-matrix": { on: "3 × 3", setup: "Four shrinking boundaries.", steps: [
  ["top row → 1, 2, 3", ""],
  ["right column → 6, 9", ""],
  ["bottom row → 8, 7;  left column → 4", ""],
  ["center → 5", ""]],
  result: "`[1,2,3,6,9,8,7,4,5]`" },
"set-matrix-zeroes": { on: "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]", setup: "Use row 0 and column 0 as markers.", steps: [
  ["The first row has zeros → remember that", ""],
  ["The markers already say: zero columns 0 and 3", ""],
  ["Zero those columns, then the first row", ""]],
  result: "`[[0,0,0,0],[0,4,5,0],[0,3,1,0]]`" },
"happy-number": { on: "19", setup: "Repeat the squared-digit sum and watch for cycles.", steps: [["1² + 9² = 82", ""], ["8² + 2² = 68", ""], ["6² + 8² = 100", ""], ["1² + 0² + 0² = 1 → happy", ""]], result: "`True`" },
"plus-one": { on: "[9,9,9]", setup: "Add from the right with a carry.", steps: [["9 → 0 (carry)", ""], ["9 → 0 (carry)", ""], ["9 → 0 (carry) → prepend 1", ""]], result: "`[1,0,0,0]`" },
"powx-n": { on: "2^10", setup: "Square the base each step. When a bit of n is 1, multiply it into the result.", steps: [["10 = 1010₂", ""], ["bit 1 → res × 4", ""], ["bit 3 → res × 256", ""]], result: "`1024.0`" },
"multiply-strings": { on: "123 × 456", setup: "Grade-school multiplication with carries.", steps: [["Multiply each pair of digits", ""], ["Add each product into position i + j + 1", ""], ["Carry to i + j", ""]], result: "`56088`" },
"detect-squares": { on: "points (3,10), (11,2), (3,2), query (11,10)", setup: "Use each stored point as the diagonal corner.", steps: [["(3,2) is a valid diagonal", ""], ["(11,2) and (3,10) exist", ""], ["1 × 1 × 1 = 1", ""]], result: "`1`" },
/* ================= BIT MANIPULATION ================= */
"single-number": { on: "[4,1,2,1,2]", setup: "XOR everything together.", steps: [["4 ^ 1 ^ 2 ^ 1 ^ 2", ""], ["The pairs cancel", ""], ["4 remains", ""]], result: "`4`" },
"number-of-1-bits": { on: "11 = 1011₂", setup: "n &= n − 1 removes the lowest 1.", steps: [["1011 → 1010", ""], ["1010 → 1000", ""], ["1000 → 0000", ""]], result: "`3`" },
"counting-bits": { on: "n = 5", setup: "bits[i] = bits[i >> 1] + (i & 1).", steps: [["0:0, 1:1, 2:1", ""], ["3:2, 4:1, 5:2", ""]], result: "`[0,1,1,2,1,2]`" },
"reverse-bits": { on: "n = 1", setup: "Push n's bits into res from the right, 32 times.", steps: [["bit 0 = 1 → becomes bit 31", ""], ["the other bits are 0", ""]], result: "`2147483648`" },
"missing-number": { on: "[3,0,1]", setup: "XOR all indices 0..n with all values.", steps: [["res = 3", ""], ["XOR in 0^3, 1^0, 2^1", ""], ["Everything cancels except 2", ""]], result: "`2`" },
"sum-of-two-integers": { on: "2 + 3", setup: "XOR = sum without carry, AND << 1 = carry.", steps: [["010 ^ 011 = 001, carry 100", ""], ["001 ^ 100 = 101, carry 0", ""]], result: "`5`" },
"reverse-integer": { on: "123", setup: "Pop the last digit and push it onto res, checking for overflow first.", steps: [["3", ""], ["32", ""], ["321", ""]], result: "`321`" },
  };
  NC.forEach((p) => { if (D[p.id]) { p.dry = D[p.id]; if (D[p.id].on) p.dryOn = D[p.id].on; } });
})();
