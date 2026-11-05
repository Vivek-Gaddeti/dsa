NC.add("Backtracking", [
{
  id: "subsets", t: "Subsets", lc: 78, d: "Medium", p: "Backtracking (include / exclude)",
  q: "Given an array of **unique** integers `nums`, return all possible subsets (the power set). There must be no duplicate subsets, and any order is fine.",
  ex: [["nums = [1,2,3]", "[[1,2,3],[1,2],[1,3],[1],[2,3],[2],[3],[]]", "2³ = 8 subsets"], ["nums = [0]", "[[0],[]]", ""]],
  c: ["1 ≤ n ≤ 10", "unique elements"],
  hint: "Every element is either **in** or **out**. That's a binary decision tree of depth n.",
  opt: {
    idea: "DFS over indices. At index `i`, branch twice:\n1. **Include** `nums[i]`: append it, recurse to i+1, then pop (undo).\n2. **Exclude** it: recurse to i+1 without it.\n\nWhen `i == n`, the current path is one complete subset.",
    steps: ["res, path = [], []", "dfs(i): if i == n → res.append(path.copy()); return", "path.append(nums[i]); dfs(i + 1); path.pop()", "dfs(i + 1)"],
    viz: "subsets",
    code: R`
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        res, path = [], []

        def dfs(i):
            if i == len(nums):
                res.append(path.copy())      # copy! path keeps changing
                return
            path.append(nums[i])             # choice 1: include nums[i]
            dfs(i + 1)
            path.pop()                       # undo
            dfs(i + 1)                       # choice 2: exclude nums[i]

        dfs(0)
        return res`,
    tc: "O(n · 2ⁿ)", tw: "2ⁿ subsets, each copied in O(n).", sc: "O(n)", sw: "Recursion depth plus the path (output not counted).",
  },
  run: R`
s = Solution()
print(s.subsets([1, 2, 3]))
print(s.subsets([0]))`,
  out: R`
[[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]
[[0], []]`,
  dry: ["Include 1 → include 2 → include 3 → [1,2,3] ✓", "pop 3 → exclude 3 → [1,2] ✓", "pop 2 → exclude 2 → include 3 → [1,3] ✓ → exclude → [1] ✓", "pop 1 → exclude 1 → … → [2,3], [2], [3], []"],
  expl: [
    ["res.append(path.copy())", "Appending `path` itself would store a reference that later becomes []."],
    ["path.pop()", "The \"backtrack\" step: restore state before trying the other branch."],
  ],
  alt: { idea: "Iterative: start with [[]] and, for each number, add it to every existing subset.", code: R`
class Solution:
    def subsets(self, nums):
        res = [[]]
        for x in nums:
            res += [s + [x] for s in res]
        return res` },
  take: "**Subsets = include/exclude decision tree (2ⁿ leaves).** The backtracking template: choose → recurse → un-choose.",
  mist: ["Appending `path` without copying."],
},
{
  id: "combination-sum", t: "Combination Sum", lc: 39, d: "Medium", p: "Backtracking (unbounded choices)",
  q: "Given **distinct** `candidates` and a `target`, return all unique combinations where the chosen numbers sum to `target`. The **same number may be used unlimited times**. Combinations are unique by multiset (order doesn't matter).",
  ex: [["candidates = [2,3,6,7], target = 7", "[[2,2,3],[7]]", ""], ["candidates = [2,3,5], target = 8", "[[2,2,2,2],[2,3,3],[3,5]]", ""], ["candidates = [2], target = 1", "[]", ""]],
  c: ["1 ≤ len ≤ 30", "2 ≤ candidates[i] ≤ 40", "target ≤ 40"],
  hint: "To avoid duplicates like [2,3,2] vs [2,2,3], only allow choosing candidates at index ≥ the last chosen index.",
  opt: {
    idea: "DFS with a start index `i` and the remaining `total`:\n- `total == 0` → record the path.\n- `total < 0` or `i == len` → dead end.\n- Branch 1: use `candidates[i]` again (stay at `i`).\n- Branch 2: skip to `i + 1` (never use it again).\n\nSorting lets us stop early when a candidate exceeds the remaining total.",
    steps: ["sort candidates", "dfs(i, total): total == 0 → record", "for j from i: if c[j] > total: break", "path.append(c[j]); dfs(j, total − c[j]); path.pop()"],
    code: R`
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        res, path = [], []

        def dfs(start, remain):
            if remain == 0:
                res.append(path.copy())
                return
            for j in range(start, len(candidates)):
                c = candidates[j]
                if c > remain:
                    break                    # sorted: the rest are bigger too
                path.append(c)
                dfs(j, remain - c)           # j, not j+1: c can be reused
                path.pop()

        dfs(0, target)
        return res`,
    tc: "O(N^(T/M + 1))", tw: "T = target, M = smallest candidate (max depth T/M).", sc: "O(T/M)",
  },
  run: R`
s = Solution()
print(s.combinationSum([2, 3, 6, 7], 7))
print(s.combinationSum([2, 3, 5], 8))
print(s.combinationSum([2], 1))`,
  out: R`
[[2, 2, 3], [7]]
[[2, 2, 2, 2], [2, 3, 3], [3, 5]]
[]`,
  dry: ["remain 7: take 2 → 5: take 2 → 3: take 2 → 1: 2 > 1 break, 3 > 1 break → back", "remain 3 (path [2,2]): take 3 → 0 ✓ [2,2,3]", "… remain 7: take 7 → 0 ✓ [7]"],
  expl: [
    ["dfs(j, remain - c)", "Passing `j` (not `j + 1`) allows reuse. Never going back to indices < j prevents permutations of the same combination."],
    ["if c > remain: break", "Pruning that only works because the candidates are sorted."],
  ],
  take: "**Combinations (order doesn't matter) → pass a start index forward.** Reuse allowed → recurse with `j`; no reuse → `j + 1`.",
  mist: ["Starting the loop from 0 each time, which produces duplicate permutations."],
},
{
  id: "permutations", t: "Permutations", lc: 46, d: "Medium", p: "Backtracking (used set)",
  q: "Given an array `nums` of **distinct** integers, return all possible permutations in any order.",
  ex: [["nums = [1,2,3]", "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", ""], ["nums = [0,1]", "[[0,1],[1,0]]", ""]],
  c: ["1 ≤ n ≤ 6"],
  hint: "Each position can hold any number not used yet. Track which ones are used.",
  opt: {
    idea: "Build the permutation one position at a time. Try every unused number, mark it used, recurse, then unmark (backtrack). When the path has n numbers, record it.",
    steps: ["dfs(): if len(path) == n → record", "for x in nums: if x not used: use; path.append(x); dfs(); path.pop(); unuse"],
    code: R`
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        res, path, used = [], [], [False] * len(nums)

        def dfs():
            if len(path) == len(nums):
                res.append(path.copy())
                return
            for i, x in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(x)
                dfs()
                path.pop()
                used[i] = False

        dfs()
        return res`,
    tc: "O(n · n!)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.permute([1, 2, 3]))
print(s.permute([0, 1]))`,
  out: R`
[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
[[0, 1], [1, 0]]`,
  dry: ["path [] → pick 1 → pick 2 → pick 3 ✓ [1,2,3]", "undo 3, undo 2 → pick 3 → pick 2 ✓ [1,3,2]", "undo back to [] → pick 2 … etc."],
  expl: [["used = [False] * len(nums)", "O(1) check instead of `x in path` (O(n))."]],
  alt: { idea: "Library: `itertools.permutations(nums)` (good to know, not for interviews)." },
  take: "**Permutations (order matters) → loop over all elements each level, skipping used ones.** n! leaves.",
  mist: ["Using a start index (that generates combinations, not permutations)."],
},
{
  id: "subsets-ii", t: "Subsets II", lc: 90, d: "Medium", p: "Backtracking (skip duplicates)",
  q: "Given `nums` that **may contain duplicates**, return all possible subsets without duplicate subsets.",
  ex: [["nums = [1,2,2]", "[[],[1],[1,2],[1,2,2],[2],[2,2]]", ""], ["nums = [0]", "[[],[0]]", ""]],
  c: ["1 ≤ n ≤ 10"],
  hint: "Sort so duplicates are adjacent. At the same recursion level, don't start a branch with a value you already started with.",
  opt: {
    idea: "Sort, then use the \"for loop from start\" form of subsets. Each node records the current path as a subset. In the loop, **skip `nums[j]` if `j > start` and `nums[j] == nums[j−1]`**. That means the same value was already tried at this level, and choosing it again would produce identical subsets.",
    steps: ["nums.sort()", "dfs(start): res.append(path.copy())", "for j in range(start, n): if j > start and nums[j] == nums[j−1]: continue", "path.append(nums[j]); dfs(j + 1); path.pop()"],
    code: R`
class Solution:
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res, path = [], []

        def dfs(start):
            res.append(path.copy())            # every node is a subset
            for j in range(start, len(nums)):
                if j > start and nums[j] == nums[j - 1]:
                    continue                   # same value already tried at this level
                path.append(nums[j])
                dfs(j + 1)
                path.pop()

        dfs(0)
        return res`,
    tc: "O(n · 2ⁿ)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.subsetsWithDup([1, 2, 2]))
print(s.subsetsWithDup([0]))`,
  out: R`
[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
[[], [0]]`,
  dry: ["start 0: record [] → pick 1 → record [1] → pick 2 (j=1) → [1,2] → pick 2 (j=2) → [1,2,2]", "back in [1]'s loop: j=2 is a duplicate at this level → skip", "start 0 loop: pick 2 (j=1) → [2] → [2,2]; j=2 duplicate → skip"],
  expl: [["if j > start and nums[j] == nums[j - 1]:", "`j > start` means \"not the first choice at this level\". Using the same value as the first pick of a deeper level is allowed ([2,2])."]],
  take: "**Duplicates in input → sort + skip equal neighbours at the same recursion level.** The same trick is used in Combination Sum II, 3Sum and Permutations II.",
  mist: ["Skipping with `j > 0` instead of `j > start` (that loses [1,2,2])."],
},
{
  id: "combination-sum-ii", t: "Combination Sum II", lc: 40, d: "Medium", p: "Backtracking (skip duplicates)",
  q: "Given `candidates` (may contain duplicates) and `target`, find all unique combinations that sum to `target`. **Each element may be used at most once.**",
  ex: [["candidates = [10,1,2,7,6,1,5], target = 8", "[[1,1,6],[1,2,5],[1,7],[2,6]]", ""], ["candidates = [2,5,2,1,2], target = 5", "[[1,2,2],[5]]", ""]],
  c: ["1 ≤ len ≤ 100", "target ≤ 30"],
  hint: "Combine Combination Sum (start index, early break) with Subsets II (skip duplicates at the same level). Since each element is used once, recurse with `j + 1`.",
  opt: {
    idea: "Sort. DFS(start, remain): for each j from start, skip duplicates at the same level, break if `c[j] > remain`, choose it, and recurse with `j + 1`.",
    steps: ["sort", "dfs(start, remain): remain == 0 → record", "for j: if j > start and c[j] == c[j−1]: continue", "if c[j] > remain: break", "choose; dfs(j + 1, remain − c[j]); un-choose"],
    code: R`
class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        res, path = [], []

        def dfs(start, remain):
            if remain == 0:
                res.append(path.copy())
                return
            for j in range(start, len(candidates)):
                if j > start and candidates[j] == candidates[j - 1]:
                    continue
                if candidates[j] > remain:
                    break
                path.append(candidates[j])
                dfs(j + 1, remain - candidates[j])      # j+1: each element once
                path.pop()

        dfs(0, target)
        return res`,
    tc: "O(n · 2ⁿ)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.combinationSum2([10, 1, 2, 7, 6, 1, 5], 8))
print(s.combinationSum2([2, 5, 2, 1, 2], 5))`,
  out: R`
[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]
[[1, 2, 2], [5]]`,
  dry: ["sorted [1,1,2,5,6,7,10]", "Pick 1 (j=0) → pick 1 (j=1, allowed: first choice at its level) → … [1,1,6]", "Back at the top level: j=1 is a duplicate 1 → skip (it would recreate the same combos)"],
  expl: [["dfs(j + 1, ...)", "Move past j, so each element is used at most once."]],
  take: "**Combination Sum variants differ in only two places: the recursion index (j vs j+1) and duplicate skipping.**",
  mist: ["Using a set of tuples to dedupe (slow and unnecessary)."],
},
{
  id: "word-search", t: "Word Search", lc: 79, d: "Medium", p: "Grid DFS Backtracking",
  q: "Given an `m × n` grid of characters `board` and a string `word`, return `True` if `word` can be formed from **adjacent** cells (horizontally/vertically), using each cell at most once.",
  ex: [["board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", "True", ""], ["same board, word = \"SEE\"", "True", ""], ["same board, word = \"ABCB\"", "False", "The B would have to be reused."]],
  c: ["1 ≤ m, n ≤ 6", "1 ≤ len(word) ≤ 15"],
  hint: "From each cell that matches word[0], DFS to neighbours that match the next letter. Mark cells as visited during the path, and unmark them on the way back.",
  opt: {
    idea: "`dfs(r, c, i)`: can we match `word[i:]` starting at `(r, c)`?\n- `i == len(word)` → True.\n- Out of bounds, or `board[r][c] != word[i]` → False.\n- Mark the cell (e.g. `'#'`), try 4 neighbours with `i + 1`, then restore the cell.",
    steps: ["for each cell: if dfs(r, c, 0) → True", "dfs: bounds/char check", "tmp = board[r][c]; board[r][c] = '#'", "found = any of 4 dfs(…, i + 1)", "board[r][c] = tmp; return found"],
    code: R`
class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        R, C = len(board), len(board[0])

        def dfs(r, c, i):
            if i == len(word):
                return True
            if r < 0 or c < 0 or r >= R or c >= C or board[r][c] != word[i]:
                return False
            tmp, board[r][c] = board[r][c], "#"        # mark as used
            found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                     dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
            board[r][c] = tmp                          # backtrack
            return found

        return any(dfs(r, c, 0) for r in range(R) for c in range(C))`,
    tc: "O(m·n · 3^L)", tw: "Each start explores ≤ 4·3^(L−1) paths.", sc: "O(L)", sw: "Recursion depth.",
  },
  run: R`
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
s = Solution()
print(s.exist(board, "ABCCED"), s.exist(board, "SEE"), s.exist(board, "ABCB"))`,
  out: R`
True True False`,
  dry: ["ABCCED: (0,0)A → (0,1)B → (0,2)C → (1,2)C → (2,2)E → (2,1)D ✓", "ABCB: A → B → C → the only B neighbour is already '#' → fail everywhere → False"],
  expl: [
    ["board[r][c] = \"#\"", "In-place visited marking (O(1) space). A '#' never equals a letter, so it blocks reuse."],
    ["found = (... or ...)", "`or` short-circuits, so we stop exploring once found."],
  ],
  take: "**Path search on a grid without reusing cells → DFS + mark/unmark (backtracking).**",
  mist: ["Forgetting to restore the cell, which breaks later searches.", "Using a global visited set that isn't cleaned up."],
},
{
  id: "palindrome-partitioning", t: "Palindrome Partitioning", lc: 131, d: "Medium", p: "Backtracking (partition)",
  q: "Partition the string `s` so that **every** substring of the partition is a palindrome. Return all possible partitions.",
  ex: [["s = \"aab\"", "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]", ""], ["s = \"a\"", "[[\"a\"]]", ""]],
  c: ["1 ≤ len(s) ≤ 16"],
  hint: "Choose where the first piece ends: `s[i:j+1]`. If it's a palindrome, recurse on the rest from j+1.",
  opt: {
    idea: "DFS from index `i`: try every end `j ≥ i`. If `s[i:j+1]` is a palindrome, add it to the path and recurse from `j + 1`. When `i == len(s)`, the whole string has been cut, so record the path.",
    steps: ["dfs(i): if i == n → record", "for j in range(i, n): piece = s[i:j+1]", "if piece == piece[::-1]: path.append(piece); dfs(j+1); path.pop()"],
    code: R`
class Solution:
    def partition(self, s: str) -> list[list[str]]:
        res, path = [], []

        def dfs(i):
            if i == len(s):
                res.append(path.copy())
                return
            for j in range(i, len(s)):
                piece = s[i:j + 1]
                if piece == piece[::-1]:          # palindrome check
                    path.append(piece)
                    dfs(j + 1)
                    path.pop()

        dfs(0)
        return res`,
    tc: "O(n · 2ⁿ)", tw: "Up to 2^(n−1) ways to cut, and each check/copy is O(n).", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.partition("aab"))
print(s.partition("a"))`,
  out: R`
[['a', 'a', 'b'], ['aa', 'b']]
[['a']]`,
  dry: ["i=0: 'a' ✓ → i=1: 'a' ✓ → i=2: 'b' ✓ → record [a,a,b]", "i=1: 'ab' ✗", "i=0: 'aa' ✓ → i=2: 'b' ✓ → record [aa,b]", "i=0: 'aab' ✗"],
  expl: [["piece == piece[::-1]", "A slice with step −1 reverses the string."]],
  alt: { idea: "Precompute `isPal[i][j]` with DP to make each check O(1)." },
  take: "**Partition problems → backtracking over \"where does the next piece end\".**",
  mist: ["Recording before reaching the end of the string."],
},
{
  id: "letter-combinations-of-a-phone-number", t: "Letter Combinations of a Phone Number", lc: 17, d: "Medium", p: "Backtracking (Cartesian product)",
  q: "Given a string of digits 2–9, return all letter combinations they could represent on a phone keypad (2 → abc, 3 → def, …, 9 → wxyz).",
  ex: [["digits = \"23\"", "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]", ""], ["digits = \"\"", "[]", ""], ["digits = \"2\"", "[\"a\",\"b\",\"c\"]", ""]],
  c: ["0 ≤ len ≤ 4"],
  hint: "One level of recursion per digit, branching over that digit's letters.",
  opt: {
    idea: "DFS(i, path): if `i == len(digits)`, record the path. Otherwise, for each letter mapped to `digits[i]`, append it and recurse on `i + 1`.",
    steps: ["if not digits → []", "dfs(i, cur): i == n → record cur", "for ch in keypad[digits[i]]: dfs(i + 1, cur + ch)"],
    code: R`
class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        if not digits:
            return []
        keypad = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
                  "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        res = []

        def dfs(i, cur):
            if i == len(digits):
                res.append(cur)
                return
            for ch in keypad[digits[i]]:
                dfs(i + 1, cur + ch)      # strings are immutable: no undo needed

        dfs(0, "")
        return res`,
    tc: "O(n · 4ⁿ)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.letterCombinations("23"))
print(s.letterCombinations(""))
print(s.letterCombinations("2"))`,
  out: R`
['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']
[]
['a', 'b', 'c']`,
  dry: ["i=0 '2': a → i=1 '3': ad, ae, af", "b → bd, be, bf", "c → cd, ce, cf"],
  expl: [["dfs(i + 1, cur + ch)", "Passing a new string avoids an explicit undo. With a list path you'd append/pop."]],
  alt: { idea: "`[''.join(p) for p in itertools.product(*(keypad[d] for d in digits))]`" },
  take: "**All combinations of one choice per position → backtracking (a Cartesian product).**",
  mist: ["Returning [\"\"] for empty input (expected [])."],
},
{
  id: "n-queens", t: "N-Queens", lc: 51, d: "Hard", p: "Backtracking (constraint sets)",
  q: "Place `n` queens on an `n × n` chessboard so that no two attack each other (same row, column or diagonal). Return all distinct solutions as boards of `'Q'` and `'.'`.",
  ex: [["n = 4", "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]", "2 solutions"], ["n = 1", "[[\"Q\"]]", ""]],
  c: ["1 ≤ n ≤ 9"],
  hint: "Place exactly one queen per row. For a candidate column c in row r, check three sets: used columns, used `r − c` diagonals, and used `r + c` anti-diagonals.",
  opt: {
    idea: "Go row by row. In row `r`, try each column `c` that is not attacked:\n- `c` not in `cols`\n- `r − c` not in `diag` (cells on the same ↘ diagonal share `r − c`)\n- `r + c` not in `anti` (cells on the same ↙ diagonal share `r + c`)\n\nPlace the queen (add to the sets, mark the board), recurse to `r + 1`, then remove it. When `r == n`, record the board.",
    steps: ["cols, diag, anti = set(), set(), set()", "dfs(r): if r == n → record", "for c in range(n): if attacked → skip", "place; dfs(r + 1); remove"],
    code: R`
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        cols, diag, anti = set(), set(), set()
        board = [["."] * n for _ in range(n)]
        res = []

        def dfs(r):
            if r == n:
                res.append(["".join(row) for row in board])
                return
            for c in range(n):
                if c in cols or (r - c) in diag or (r + c) in anti:
                    continue                            # square is attacked
                cols.add(c); diag.add(r - c); anti.add(r + c)
                board[r][c] = "Q"
                dfs(r + 1)
                cols.remove(c); diag.remove(r - c); anti.remove(r + c)
                board[r][c] = "."

        dfs(0)
        return res`,
    tc: "O(n!)", tw: "Row 1 has ≤ n options, row 2 ≤ n−1, …", sc: "O(n²)", sw: "The board.",
  },
  run: R`
s = Solution()
for sol in s.solveNQueens(4):
    print(sol)
print(len(s.solveNQueens(8)), "solutions for n = 8")`,
  out: R`
['.Q..', '...Q', 'Q...', '..Q.']
['..Q.', 'Q...', '...Q', '.Q..']
92 solutions for n = 8`,
  dry: ["Row 0: try c=0 → row 1: c=2 → row 2: nothing safe → backtrack … row 1: c=3 → row 2: c=1 → row 3: nothing → backtrack…", "Row 0: c=1 → row 1: c=3 → row 2: c=0 → row 3: c=2 ✓ first solution"],
  expl: [
    ["(r - c) in diag", "On a ↘ diagonal, row and column both increase together, so r − c is constant."],
    ["(r + c) in anti", "On a ↙ diagonal, the row increases while the column decreases, so r + c is constant."],
  ],
  take: "**Constraint placement problems → backtracking + O(1) conflict checks with sets.** The diagonal indices r−c and r+c come up again and again.",
  mist: ["Checking attacks by scanning the board (O(n) per check).", "Forgetting to remove from the sets when backtracking."],
},
]);
