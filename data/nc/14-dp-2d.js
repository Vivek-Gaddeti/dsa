NC.add("2-D DP", [
{
  id: "unique-paths", t: "Unique Paths", lc: 62, d: "Medium", p: "Grid DP",
  q: "A robot starts at the top-left of an `m × n` grid and can only move **right or down**. How many unique paths lead to the bottom-right corner?",
  ex: [["m = 3, n = 7", "28", ""], ["m = 3, n = 2", "3", "R→D→D, D→R→D, D→D→R"]],
  c: ["1 ≤ m, n ≤ 100"],
  hint: "paths(r, c) = paths(r−1, c) + paths(r, c−1): you arrived from above or from the left.",
  opt: {
    idea: "`dp[r][c]` = the number of ways to reach (r, c). The first row and column have exactly 1 way. Every other cell is the sum from above and from the left. One row of memory is enough: `row[c] += row[c−1]`.",
    steps: ["row = [1] * n", "repeat m − 1 times: for c in 1..n−1: row[c] += row[c − 1]", "return row[−1]"],
    code: R`
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n                    # first row: one way to each cell
        for _ in range(m - 1):
            for c in range(1, n):
                row[c] += row[c - 1]     # from above (old row[c]) + from left
        return row[-1]`,
    tc: "O(m·n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.uniquePaths(3, 7))
print(s.uniquePaths(3, 2))`,
  out: R`
28
3`,
  dryOn: "m = 3, n = 3",
  dry: { h: ["row", "values"], r: [["0", "1 1 1"], ["1", "1 2 3"], ["2", "1 3 **6**"]] },
  expl: [["row[c] += row[c - 1]", "Before the update, row[c] holds the value from the row above. Adding row[c−1] (already updated this row) adds the path from the left."]],
  alt: { idea: "Combinatorics: choose which (m−1) of the (m+n−2) moves are downward → `math.comb(m + n - 2, m - 1)`." },
  take: "**Counting paths on a grid with restricted moves → dp[r][c] = sum of the cells you can come from.** One row of memory is usually enough.",
  mist: ["Initializing the first row/column to 0."],
},
{
  id: "longest-common-subsequence", t: "Longest Common Subsequence", lc: 1143, d: "Medium", p: "2-D DP on two strings",
  q: "Given `text1` and `text2`, return the length of their **longest common subsequence** (characters in the same relative order, not necessarily contiguous). Return 0 if there's none.",
  ex: [["text1 = \"abcde\", text2 = \"ace\"", "3", "\"ace\""], ["text1 = \"abc\", text2 = \"abc\"", "3", ""], ["text1 = \"abc\", text2 = \"def\"", "0", ""]],
  c: ["1 ≤ lengths ≤ 1000"],
  hint: "Compare the last characters. Equal → 1 + LCS of both without them. Different → drop one character from either string and take the better result.",
  opt: {
    idea: "`dp[i][j]` = the LCS of `text1[:i]` and `text2[:j]`.\n- If `text1[i−1] == text2[j−1]`: `dp[i][j] = dp[i−1][j−1] + 1` (diagonal + 1)\n- Else: `dp[i][j] = max(dp[i−1][j], dp[i][j−1])` (up or left)\n\nRow 0 and column 0 are 0 (empty strings).",
    steps: ["dp = (m+1) × (n+1) zeros", "for i, j: match → diagonal + 1; else max(up, left)", "return dp[m][n]"],
    viz: "lcs",
    code: R`
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]`,
    tc: "O(m·n)", sc: "O(m·n)", sw: "Reducible to O(min(m, n)) with two rows.",
  },
  run: R`
s = Solution()
print(s.longestCommonSubsequence("abcde", "ace"))
print(s.longestCommonSubsequence("abc", "abc"))
print(s.longestCommonSubsequence("abc", "def"))`,
  out: R`
3
3
0`,
  dryOn: "\"abcde\" vs \"ace\"",
  dry: { h: ["", "∅", "a", "c", "e"], r: [["∅", 0, 0, 0, 0], ["a", 0, "**1**", 1, 1], ["b", 0, 1, 1, 1], ["c", 0, 1, "**2**", 2], ["d", 0, 1, 2, 2], ["e", 0, 1, 2, "**3**"]] },
  expl: [
    ["[[0] * (n + 1) for _ in range(m + 1)]", "The correct way to make a 2D list. `[[0]*(n+1)]*(m+1)` would alias the rows."],
    ["text1[i - 1]", "The dp indices are shifted by 1 because of the empty-string row/column."],
  ],
  take: "**Two strings → dp[i][j] over prefixes.** This one template covers LCS, Edit Distance, Distinct Subsequences and Interleaving String.",
  mist: ["The `[[0]*n]*m` aliasing bug.", "Off-by-one between string indices and dp indices."],
},
{
  id: "best-time-to-buy-and-sell-stock-with-cooldown", t: "Best Time to Buy and Sell Stock with Cooldown", lc: 309, d: "Medium", p: "State Machine DP",
  q: "You can make as many transactions as you like (buy one share, then sell it), but after selling you must **cool down one day** before buying again. You can't hold more than one share. Return the max profit.",
  ex: [["prices = [1,2,3,0,2]", "3", "buy, sell, cooldown, buy, sell"], ["prices = [1]", "0", ""]],
  c: ["1 ≤ n ≤ 5000"],
  hint: "Each day you're in one of three states: **holding** a share, **just sold** (cooldown next), or **resting** (free to buy). Write transitions between them.",
  opt: {
    idea: "Three running values for the end of each day:\n- `hold` = best profit while holding a share: `max(hold, rest − price)` (keep holding, or buy today from the rest state)\n- `sold` = best profit having sold today: `hold + price`\n- `rest` = best profit while not holding and allowed to buy: `max(rest, sold_yesterday)`\n\nThe answer is `max(sold, rest)` on the last day.",
    steps: ["hold, sold, rest = −inf, 0, 0", "for p: prev_sold = sold", "sold = hold + p; hold = max(hold, rest − p); rest = max(rest, prev_sold)", "return max(sold, rest)"],
    code: R`
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        hold, sold, rest = float("-inf"), 0, 0
        for p in prices:
            prev_sold = sold
            sold = hold + p                 # sell the share we held
            hold = max(hold, rest - p)      # keep holding, or buy (only from rest)
            rest = max(rest, prev_sold)     # cooldown finished / keep resting
        return max(sold, rest)`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.maxProfit([1, 2, 3, 0, 2]))
print(s.maxProfit([1]))`,
  out: R`
3
0`,
  dryOn: "[1,2,3,0,2]",
  dry: { h: ["price", "hold", "sold", "rest"], r: [[1, -1, "−inf", 0], [2, -1, 1, 0], [3, -1, 2, 1], [0, "1 (buy at 0 from rest = 1)", -1, 2], [2, 1, "**3**", 2]] },
  expl: [
    ["hold = max(hold, rest - p)", "Buying is only allowed from `rest`, never right after selling. That's how the cooldown is enforced."],
    ["prev_sold", "We need yesterday's sold value for rest, and sold gets overwritten earlier in the loop."],
  ],
  alt: { idea: "Top-down: `dfs(i, can_buy)` with memoization. If buying: max(buy → dfs(i+1, False) − p, skip). If selling: max(sell → dfs(i+2, True) + p, skip). The i+2 is the cooldown." },
  take: "**Stock problems with rules (cooldown, fee, k transactions) → state machine DP with one variable per state.**",
  mist: ["Allowing a buy on the day right after a sell."],
},
{
  id: "coin-change-ii", t: "Coin Change II", lc: 518, d: "Medium", p: "Unbounded Knapsack (count combinations)",
  q: "Return the number of **combinations** of coins that sum to `amount` (unlimited coins per denomination). The order of coins doesn't matter: 1+2 and 2+1 are the same combination.",
  ex: [["amount = 5, coins = [1,2,5]", "4", "5, 2+2+1, 2+1+1+1, 1+1+1+1+1"], ["amount = 3, coins = [2]", "0", ""], ["amount = 10, coins = [10]", "1", ""]],
  c: ["0 ≤ amount ≤ 5000"],
  hint: "To count combinations (not permutations), put **coins in the outer loop** and amounts in the inner loop. Then each combination is built in a fixed coin order.",
  opt: {
    idea: "`dp[a]` = the number of ways to make `a` using the coins processed so far. `dp[0] = 1`. For each coin c (outer loop), for a from c to amount: `dp[a] += dp[a − c]`.\n\nThe forward inner loop allows reusing c (unbounded). The coin-outer order prevents counting both 1+2 and 2+1.",
    steps: ["dp = [1] + [0] * amount", "for c in coins: for a in c..amount: dp[a] += dp[a − c]", "return dp[amount]"],
    code: R`
class Solution:
    def change(self, amount: int, coins: list[int]) -> int:
        dp = [1] + [0] * amount          # one way to make 0: choose nothing
        for c in coins:                  # coins OUTER -> combinations, not orderings
            for a in range(c, amount + 1):
                dp[a] += dp[a - c]
        return dp[amount]`,
    tc: "O(amount · len(coins))", sc: "O(amount)",
  },
  run: R`
s = Solution()
print(s.change(5, [1, 2, 5]))
print(s.change(3, [2]))
print(s.change(10, [10]))`,
  out: R`
4
0
1`,
  dryOn: "amount 5, coins [1,2,5]",
  dry: { h: ["after coin", "dp[0..5]"], r: [["start", "1 0 0 0 0 0"], ["1", "1 1 1 1 1 1"], ["2", "1 1 2 2 3 3"], ["5", "1 1 2 2 3 **4**"]] },
  expl: [["for c in coins:  (outer)", "If you swap the loops (amount outer), you count ordered sequences: that's Combination Sum IV, a different problem."]],
  take: "**Counting combinations → items outer, capacity inner. Counting permutations → capacity outer, items inner.**",
  mist: ["Swapping the loop order (counts 1+2 and 2+1 separately)."],
},
{
  id: "target-sum", t: "Target Sum", lc: 494, d: "Medium", p: "DP over sums (or subset-sum math)",
  q: "Put a `+` or `-` in front of each number in `nums` and evaluate the expression. Count the assignments that evaluate to `target`.",
  ex: [["nums = [1,1,1,1,1], target = 3", "5", "−1+1+1+1+1 = 3 and four more"], ["nums = [1], target = 1", "1", ""]],
  c: ["1 ≤ n ≤ 20", "0 ≤ sum(nums) ≤ 1000"],
  hint: "Track a dictionary {current_sum: number_of_ways} and process the numbers one at a time.",
  brute: {
    idea: "Try both signs for every number: 2ⁿ (n ≤ 20 is about 10^6, so it's borderline).",
    code: R`
class Solution:
    def findTargetSumWays(self, nums: list[int], target: int) -> int:
        def go(i, total):
            if i == len(nums):
                return 1 if total == target else 0
            return go(i + 1, total + nums[i]) + go(i + 1, total - nums[i])
        return go(0, 0)`,
    tc: "O(2ⁿ)", sc: "O(n)",
  },
  opt: {
    idea: "DP over reachable sums: `ways` maps sum → count. For each number x, every existing sum s branches to s + x and s − x, carrying its count. At the end, read `ways[target]`.",
    steps: ["ways = {0: 1}", "for x: nxt = defaultdict(int); for s, cnt: nxt[s + x] += cnt; nxt[s − x] += cnt", "ways = nxt", "return ways[target]"],
    code: R`
from collections import defaultdict

class Solution:
    def findTargetSumWays(self, nums: list[int], target: int) -> int:
        ways = {0: 1}                         # sum -> number of sign assignments
        for x in nums:
            nxt = defaultdict(int)
            for s, cnt in ways.items():
                nxt[s + x] += cnt
                nxt[s - x] += cnt
            ways = nxt
        return ways.get(target, 0)`,
    tc: "O(n · S)", tw: "S = sum(nums): at most 2S+1 distinct sums.", sc: "O(S)",
  },
  run: R`
s = Solution()
print(s.findTargetSumWays([1, 1, 1, 1, 1], 3))
print(s.findTargetSumWays([1], 1))`,
  out: R`
5
1`,
  dry: ["{0:1} → x=1 → {1:1, −1:1} → x=1 → {2:1, 0:2, −2:1} → … → after 5 ones, ways[3] = 5"],
  expl: [["ways.get(target, 0)", "The target may be unreachable."]],
  alt: { idea: "Math trick: if P is the set of + numbers, then sum(P) = (total + target) / 2, so count the subsets with that sum (0/1 knapsack count). It's impossible when (total + target) is odd or |target| > total." },
  take: "**Sign assignment / reachable values → DP over a dictionary of states {value: count}.**",
  mist: ["Using an array without offsetting for negative sums."],
},
{
  id: "interleaving-string", t: "Interleaving String", lc: 97, d: "Medium", p: "2-D DP on two strings",
  q: "Is `s3` formed by **interleaving** `s1` and `s2`, i.e. merging their characters while keeping each string's internal order?",
  ex: [["s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"", "True", ""], ["s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbbaccc\"", "False", ""], ["s1 = \"\", s2 = \"\", s3 = \"\"", "True", ""]],
  c: ["0 ≤ len(s1), len(s2) ≤ 100"],
  hint: "dp[i][j] = can s1[:i] and s2[:j] form s3[:i+j]? The last char of s3[:i+j] came either from s1 (s1[i−1]) or from s2 (s2[j−1]).",
  opt: {
    idea: "`dp[i][j]` is True if:\n- `dp[i−1][j]` and `s1[i−1] == s3[i+j−1]` (the last char came from s1), or\n- `dp[i][j−1]` and `s2[j−1] == s3[i+j−1]` (the last char came from s2).\n\n`dp[0][0] = True`. If the lengths don't add up → False.",
    steps: ["if len(s1) + len(s2) != len(s3) → False", "dp[0][0] = True", "fill row by row with the two transitions", "return dp[m][n]"],
    code: R`
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        m, n = len(s1), len(s2)
        if m + n != len(s3):
            return False
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True
        for i in range(m + 1):
            for j in range(n + 1):
                k = i + j - 1                         # index in s3 of the last char
                if i > 0 and dp[i - 1][j] and s1[i - 1] == s3[k]:
                    dp[i][j] = True
                if j > 0 and dp[i][j - 1] and s2[j - 1] == s3[k]:
                    dp[i][j] = True
        return dp[m][n]`,
    tc: "O(m·n)", sc: "O(m·n)",
  },
  run: R`
s = Solution()
print(s.isInterleave("aabcc", "dbbca", "aadbbcbcac"))
print(s.isInterleave("aabcc", "dbbca", "aadbbbaccc"))
print(s.isInterleave("", "", ""))`,
  out: R`
True
False
True`,
  dry: ["dp[1][0]: 'a' == s3[0] ✓", "dp[2][0]: 'a' == s3[1] ✓", "dp[2][1]: from dp[2][0] with s2[0] = 'd' == s3[2] ✓ … and so on to dp[5][5]"],
  expl: [["k = i + j - 1", "Using i chars of s1 and j chars of s2 means we've produced i+j chars of s3, and the last one is at index i+j−1."]],
  take: "**Merging two sequences while keeping their order → dp[i][j] over how much of each you've used.**",
  mist: ["A greedy two-pointer approach fails when both strings offer the same next char."],
},
{
  id: "longest-increasing-path-in-a-matrix", t: "Longest Increasing Path in a Matrix", lc: 329, d: "Hard", p: "DFS + Memoization (DAG DP)",
  q: "Given an `m × n` integer matrix, return the length of the longest **strictly increasing** path. You can move up, down, left or right (no diagonals, no wrapping).",
  ex: [["matrix = [[9,9,4],[6,6,8],[2,1,1]]", "4", "1 → 2 → 6 → 9"], ["matrix = [[3,4,5],[3,2,6],[2,2,1]]", "4", "3 → 4 → 5 → 6"]],
  c: ["1 ≤ m, n ≤ 200"],
  hint: "Strictly increasing moves can never cycle, so the grid is a DAG. `longest(r, c)` depends only on bigger neighbours. Memoize it.",
  opt: {
    idea: "`dfs(r, c)` = the longest increasing path **starting** at (r, c) = `1 + max(dfs(neighbour))` over neighbours with a larger value. Cache the results. Since a value only leads to strictly larger ones, there are no cycles and no visited set is needed. The answer is the max over all cells.",
    steps: ["@cache dfs(r, c): best = 1", "for each neighbour with a larger value: best = max(best, 1 + dfs(nb))", "return the max of dfs over all cells"],
    code: R`
from functools import cache

class Solution:
    def longestIncreasingPath(self, matrix: list[list[int]]) -> int:
        R, C = len(matrix), len(matrix[0])

        @cache
        def dfs(r, c):
            best = 1
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and matrix[nr][nc] > matrix[r][c]:
                    best = max(best, 1 + dfs(nr, nc))
            return best

        return max(dfs(r, c) for r in range(R) for c in range(C))`,
    tc: "O(m·n)", tw: "Each cell's answer is computed once, with 4 neighbour checks.", sc: "O(m·n)",
  },
  run: R`
s = Solution()
print(s.longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]))
print(s.longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]]))
print(s.longestIncreasingPath([[1]]))`,
  out: R`
4
4
1`,
  dry: ["dfs(9) = 1 (no bigger neighbour)", "dfs(6 at (1,0)) = 1 + dfs(9) = 2", "dfs(2) = 1 + dfs(6) = 3", "dfs(1 at (2,1)) = 1 + dfs(2) = 4 → answer 4"],
  expl: [["@cache", "Memoization turns an exponential DFS into O(m·n). It's safe because the dependencies form a DAG."]],
  take: "**Longest path in a DAG (moves that strictly increase) → DFS + memoization.**",
  mist: ["Adding a visited set (it's unnecessary and breaks memoization correctness).", "Allowing ≥ moves (that creates cycles)."],
},
{
  id: "distinct-subsequences", t: "Distinct Subsequences", lc: 115, d: "Hard", p: "2-D DP on two strings (count)",
  q: "Given strings `s` and `t`, return the number of distinct **subsequences of `s`** that equal `t`.",
  ex: [["s = \"rabbbit\", t = \"rabbit\"", "3", "Choose which of the three b's to drop."], ["s = \"babgbag\", t = \"bag\"", "5", ""]],
  c: ["1 ≤ len(s), len(t) ≤ 1000"],
  hint: "dp[i][j] = ways to form t[j:] from s[i:]. If s[i] == t[j], you can **use** s[i] (advance both) or **skip** it. Otherwise you must skip it.",
  opt: {
    idea: "`dp[i][j]` = the number of ways `s[i:]` contains `t[j:]` as a subsequence.\n- `dp[i][len(t)] = 1` (an empty t can be formed in exactly one way).\n- If `s[i] == t[j]`: `dp[i][j] = dp[i+1][j+1] + dp[i+1][j]` (use it + skip it)\n- Else: `dp[i][j] = dp[i+1][j]` (skip it)\n\nFill from the bottom-right. The answer is `dp[0][0]`.",
    steps: ["dp = (m+1) × (n+1) zeros; dp[i][n] = 1 for all i", "for i from m−1 down, j from n−1 down: apply the rule", "return dp[0][0]"],
    code: R`
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][n] = 1                              # empty t: one way
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                dp[i][j] = dp[i + 1][j]               # skip s[i]
                if s[i] == t[j]:
                    dp[i][j] += dp[i + 1][j + 1]      # use s[i] for t[j]
        return dp[0][0]`,
    tc: "O(m·n)", sc: "O(m·n)",
  },
  run: R`
s = Solution()
print(s.numDistinct("rabbbit", "rabbit"))
print(s.numDistinct("babgbag", "bag"))`,
  out: R`
3
5`,
  dry: ["\"rabbbit\" → \"rabbit\": the three b's in s, and t needs two of them → C(3,2) = 3 ways"],
  expl: [["dp[i][j] = dp[i + 1][j]", "Skipping s[i] is always allowed."]],
  take: "**Counting the ways one string appears inside another → dp over suffixes (or prefixes) with use/skip transitions.**",
  mist: ["Base case dp[m][j] for j < n must be 0 (s is exhausted but t isn't)."],
},
{
  id: "edit-distance", t: "Edit Distance", lc: 72, d: "Medium", p: "2-D DP on two strings",
  q: "Return the minimum number of operations (**insert**, **delete**, **replace** a character) to convert `word1` into `word2`.",
  ex: [["word1 = \"horse\", word2 = \"ros\"", "3", "horse → rorse (replace) → rose (delete r) → ros (delete e)"], ["word1 = \"intention\", word2 = \"execution\"", "5", ""]],
  c: ["0 ≤ lengths ≤ 500"],
  hint: "dp[i][j] = the edit distance between word1[:i] and word2[:j]. If the last chars match, there's no cost. Otherwise take 1 + the min of the three operations.",
  opt: {
    idea: "`dp[i][j]` = the min edits to turn `word1[:i]` into `word2[:j]`.\n- Base: `dp[i][0] = i` (delete everything), `dp[0][j] = j` (insert everything).\n- Last chars equal → `dp[i][j] = dp[i−1][j−1]`.\n- Else `1 + min(`\n  - `dp[i−1][j]` → **delete** word1[i−1]\n  - `dp[i][j−1]` → **insert** word2[j−1]\n  - `dp[i−1][j−1]` → **replace**\n  `)`",
    steps: ["init the first row and column", "fill with the match / 1 + min(delete, insert, replace) rule", "return dp[m][n]"],
    code: R`
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j],      # delete
                                       dp[i][j - 1],      # insert
                                       dp[i - 1][j - 1])  # replace
        return dp[m][n]`,
    tc: "O(m·n)", sc: "O(m·n)",
  },
  run: R`
s = Solution()
print(s.minDistance("horse", "ros"))
print(s.minDistance("intention", "execution"))
print(s.minDistance("", "abc"))`,
  out: R`
3
5
3`,
  dryOn: "\"horse\" → \"ros\"",
  dry: { h: ["", "∅", "r", "o", "s"], r: [["∅", 0, 1, 2, 3], ["h", 1, 1, 2, 3], ["o", 2, 2, 1, 2], ["r", 3, 2, 2, 2], ["s", 4, 3, 3, 2], ["e", 5, 4, 4, "**3**"]] },
  expl: [["1 + min(...)", "One operation now, plus the best way to finish the smaller subproblem it leaves."]],
  take: "**The classic string DP: edit distance.** Learn the three transitions (delete = up, insert = left, replace = diagonal).",
  mist: ["Forgetting the base row and column."],
},
{
  id: "burst-balloons", t: "Burst Balloons", lc: 312, d: "Hard", p: "Interval DP",
  q: "`n` balloons have values `nums`. Bursting balloon `i` earns `nums[left] × nums[i] × nums[right]`, where left and right are its **current** neighbours (out of bounds counts as 1). Return the max coins from bursting all balloons.",
  ex: [["nums = [3,1,5,8]", "167", "burst 1, 5, 3, 8 → 3·1·5 + 3·5·8 + 1·3·8 + 1·8·1 = 167"], ["nums = [1,5]", "10", ""]],
  c: ["1 ≤ n ≤ 300"],
  hint: "Choosing which balloon to burst **first** makes the subproblems depend on each other. Instead choose which balloon in the interval is burst **last**: its neighbours are then the fixed boundaries of the interval.",
  opt: {
    idea: "Pad: `vals = [1] + nums + [1]`. Let `dp[l][r]` = the max coins from bursting all balloons **strictly between** l and r.\n\nIf `k` is the **last** balloon burst in (l, r), at that moment its neighbours are exactly l and r:\n`dp[l][r] = max over k in (l, r) of dp[l][k] + vals[l]·vals[k]·vals[r] + dp[k][r]`.\n\nCompute by increasing interval length. The answer is `dp[0][n+1]`.",
    steps: ["vals = [1] + nums + [1]", "for length 2..n+1: for l: r = l + length", "for k in (l, r): dp[l][r] = max(dp[l][k] + vals[l]·vals[k]·vals[r] + dp[k][r])", "return dp[0][n+1]"],
    code: R`
class Solution:
    def maxCoins(self, nums: list[int]) -> int:
        vals = [1] + nums + [1]
        n = len(vals)
        dp = [[0] * n for _ in range(n)]          # dp[l][r]: open interval (l, r)
        for length in range(2, n):
            for l in range(0, n - length):
                r = l + length
                best = 0
                for k in range(l + 1, r):         # k is burst LAST in (l, r)
                    best = max(best, dp[l][k] + vals[l] * vals[k] * vals[r] + dp[k][r])
                dp[l][r] = best
        return dp[0][n - 1]`,
    tc: "O(n³)", sc: "O(n²)",
  },
  run: R`
s = Solution()
print(s.maxCoins([3, 1, 5, 8]))
print(s.maxCoins([1, 5]))`,
  out: R`
167
10`,
  dry: ["vals = [1,3,1,5,8,1]", "Small intervals first, e.g. dp[0][2] = 1·3·1 = 3 (only balloon 3 inside)", "…the full interval: k = 8 last → dp[0][4] + 1·8·1 + dp[4][5] = 159 + 8 = 167"],
  expl: [["k is burst LAST", "That makes the left part (l, k) and right part (k, r) independent, because k separates them until the very end."]],
  take: "**Interval DP: dp[l][r] over sub-ranges; the trick is often to pick the element that acts LAST (or first) in the range.** Related: Matrix Chain Multiplication, Minimum Cost to Cut a Stick.",
  mist: ["Choosing the first balloon to burst (the subproblems aren't independent)."],
},
{
  id: "regular-expression-matching", t: "Regular Expression Matching", lc: 10, d: "Hard", p: "2-D DP / memoized recursion",
  q: "Implement regex matching with `.` (any single char) and `*` (**zero or more** of the preceding element). The match must cover the **entire** string `s`.",
  ex: [["s = \"aa\", p = \"a\"", "False", ""], ["s = \"aa\", p = \"a*\"", "True", ""], ["s = \"ab\", p = \".*\"", "True", ""], ["s = \"aab\", p = \"c*a*b\"", "True", "c* matches zero c's."]],
  c: ["1 ≤ len(s) ≤ 20", "1 ≤ len(p) ≤ 20", "every * follows a valid char"],
  hint: "dfs(i, j): does s[i:] match p[j:]? If p[j+1] is '*': either skip `x*` entirely (j+2), or, if s[i] matches x, consume one char of s and stay at j.",
  opt: {
    idea: "`dfs(i, j)` = does `s[i:]` match `p[j:]`? Memoize it.\n- If `j == len(p)`: True only if `i == len(s)`.\n- `first = i < len(s) and p[j] in (s[i], '.')`\n- If `p[j+1] == '*'`: `dfs(i, j+2)` (zero copies) **or** `first and dfs(i+1, j)` (one more copy)\n- Else: `first and dfs(i+1, j+1)`",
    steps: ["@cache dfs(i, j)", "j == len(p) → i == len(s)", "first = the current chars match", "star: skip the pair OR consume one char", "otherwise advance both"],
    code: R`
from functools import cache

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        @cache
        def dfs(i, j):
            if j == len(p):
                return i == len(s)
            first = i < len(s) and p[j] in (s[i], ".")
            if j + 1 < len(p) and p[j + 1] == "*":
                return dfs(i, j + 2) or (first and dfs(i + 1, j))   # zero  |  one more
            return first and dfs(i + 1, j + 1)
        return dfs(0, 0)`,
    tc: "O(m·n)", sc: "O(m·n)",
  },
  run: R`
s = Solution()
for a, b in [("aa", "a"), ("aa", "a*"), ("ab", ".*"), ("aab", "c*a*b"), ("mississippi", "mis*is*p*.")]:
    print(a, b, s.isMatch(a, b))`,
  out: R`
aa a False
aa a* True
ab .* True
aab c*a*b True
mississippi mis*is*p*. False`,
  dryOn: "s = \"aab\", p = \"c*a*b\"",
  dry: ["dfs(0,0): p[1] = '*' → try zero c's → dfs(0,2)", "dfs(0,2): 'a*' and first = True → consume: dfs(1,2) → consume: dfs(2,2) → 'b' ≠ 'a' → skip: dfs(2,4)", "dfs(2,4): 'b' == 'b' → dfs(3,5) → both at the end → True"],
  expl: [
    ["dfs(i, j + 2)", "Use `x*` zero times: jump over both the char and the star."],
    ["first and dfs(i + 1, j)", "Use one more copy: consume s[i] but keep the pattern at `x*` so it can match again."],
  ],
  take: "**Pattern matching with wildcards → dfs(i, j) over both strings + memoization.** The same structure solves Wildcard Matching.",
  mist: ["Treating `*` on its own (it always binds to the preceding char).", "Checking p[j+1] without a bounds check."],
},
]);
