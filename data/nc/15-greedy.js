NC.add("Greedy", [
{
  id: "maximum-subarray", t: "Maximum Subarray", lc: 53, d: "Medium", p: "Kadane's Algorithm",
  q: "Find the contiguous subarray (at least one element) with the **largest sum** and return that sum.",
  ex: [["nums = [-2,1,-3,4,-1,2,1,-5,4]", "6", "[4,-1,2,1]"], ["nums = [1]", "1", ""], ["nums = [5,4,-1,7,8]", "23", ""]],
  c: ["1 ≤ n ≤ 10^5"],
  hint: "If the running sum becomes negative, it can only hurt whatever comes next, so drop it and start fresh.",
  brute: {
    idea: "Every start i, with a running sum over every end j.",
    code: R`
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        best = nums[0]
        for i in range(len(nums)):
            cur = 0
            for j in range(i, len(nums)):
                cur += nums[j]
                best = max(best, cur)
        return best`,
    tc: "O(n²)", sc: "O(1)",
  },
  opt: {
    idea: "**Kadane:** keep `cur` = the best sum of a subarray ending at the current index. For each x: `cur = max(x, cur + x)`, meaning either extend the previous subarray or start a new one at x. Track the global best.",
    steps: ["best = cur = nums[0]", "for x in nums[1:]: cur = max(x, cur + x)", "best = max(best, cur)"],
    viz: "kadane",
    code: R`
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        best = cur = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)      # extend, or restart at x
            best = max(best, cur)
        return best`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
print(s.maxSubArray([1]))
print(s.maxSubArray([5, 4, -1, 7, 8]))
print(s.maxSubArray([-3, -1, -2]))`,
  out: R`
6
1
23
-1`,
  dryOn: "[-2,1,-3,4,-1,2,1,-5,4]",
  dry: { h: ["x", "cur = max(x, cur + x)", "best"], r: [[-2, -2, -2], [1, 1, 1], [-3, -2, 1], [4, "4 (restart)", 4], [-1, 3, 4], [2, 5, 5], [1, 6, "**6**"], [-5, 1, 6], [4, 5, 6]] },
  expl: [["cur = max(x, cur + x)", "This is a DP, `dp[i] = max(nums[i], dp[i−1] + nums[i])`, with only the last value kept."]],
  take: "**Max-sum contiguous subarray → Kadane O(n).** Variants: max product (track min too), circular (total − min subarray).",
  mist: ["Starting best at 0 (wrong when every number is negative)."],
},
{
  id: "jump-game", t: "Jump Game", lc: 55, d: "Medium", p: "Greedy (farthest reach)",
  q: "You start at index 0. `nums[i]` is the **maximum** jump length from index i. Can you reach the last index?",
  ex: [["nums = [2,3,1,1,4]", "True", "0 → 1 → 4"], ["nums = [3,2,1,0,4]", "False", "Every path gets stuck at index 3 (its value is 0)."]],
  c: ["1 ≤ n ≤ 10^4"],
  hint: "Track the farthest index reachable so far. If you ever stand at an index beyond it, you're stuck.",
  brute: {
    idea: "DP: `good[i]` = can reach the end from i, computed right to left by checking every jump. O(n²).",
    code: R`
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        n = len(nums)
        good = [False] * n
        good[-1] = True
        for i in range(n - 2, -1, -1):
            for j in range(i + 1, min(n, i + nums[i] + 1)):
                if good[j]:
                    good[i] = True
                    break
        return good[0]`,
    tc: "O(n²)", sc: "O(n)",
  },
  opt: {
    idea: "Scan left to right with `reach` = the farthest index we can get to. At index i: if `i > reach`, we can't even stand here → False. Otherwise `reach = max(reach, i + nums[i])`. If reach ≥ the last index → True.",
    steps: ["reach = 0", "for i, x: if i > reach → False", "reach = max(reach, i + x)", "return True"],
    code: R`
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        reach = 0
        for i, x in enumerate(nums):
            if i > reach:
                return False             # this index is unreachable
            reach = max(reach, i + x)
        return True`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.canJump([2, 3, 1, 1, 4]))
print(s.canJump([3, 2, 1, 0, 4]))`,
  out: R`
True
False`,
  dryOn: "[3,2,1,0,4]",
  dry: { h: ["i", "x", "reach after"], r: [[0, 3, 3], [1, 2, 3], [2, 1, 3], [3, 0, 3], [4, "", "4 > 3 → **False**"]] },
  expl: [["if i > reach:", "Every index ≤ reach is reachable, because you can always make a shorter jump than the maximum."]],
  alt: { idea: "Backward greedy: `goal = n − 1`; going right to left, if `i + nums[i] ≥ goal`, set `goal = i`. The answer is `goal == 0`." },
  take: "**Reachability with \"up to k steps\" → track the farthest reachable point.**",
  mist: ["Trying every path with DFS (exponential)."],
},
{
  id: "jump-game-ii", t: "Jump Game II", lc: 45, d: "Medium", p: "Greedy BFS (levels by reach)",
  q: "Same setup, and reaching the last index is guaranteed. Return the **minimum number of jumps** needed.",
  ex: [["nums = [2,3,1,1,4]", "2", "0 → 1 → 4"], ["nums = [2,3,0,1,4]", "2", ""]],
  c: ["1 ≤ n ≤ 10^4"],
  hint: "Think in BFS levels. With k jumps you can reach some window of indices. With k+1 jumps you can reach up to the farthest point reachable from anywhere in that window.",
  opt: {
    idea: "Keep the current window `[l, r]` = the indices reachable with `jumps` jumps. The next window ends at `farthest = max(i + nums[i] for i in [l, r])`. Move to the next window and count one jump, until `r ≥ n − 1`.",
    steps: ["jumps = 0; l = r = 0", "while r < n − 1: farthest = max(i + nums[i] for i in l..r)", "l, r = r + 1, farthest; jumps += 1"],
    code: R`
class Solution:
    def jump(self, nums: list[int]) -> int:
        jumps = 0
        l = r = 0                                   # window reachable with 'jumps' jumps
        while r < len(nums) - 1:
            farthest = max(i + nums[i] for i in range(l, r + 1))
            l, r = r + 1, farthest                  # next BFS level
            jumps += 1
        return jumps`,
    tc: "O(n)", tw: "Every index belongs to exactly one window.", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.jump([2, 3, 1, 1, 4]))
print(s.jump([2, 3, 0, 1, 4]))
print(s.jump([0]))`,
  out: R`
2
2
0`,
  dryOn: "[2,3,1,1,4]",
  dry: { h: ["jumps", "window [l, r]", "farthest from window"], r: [[0, "[0, 0]", "0 + 2 = 2"], [1, "[1, 2]", "max(1 + 3, 2 + 1) = 4"], [2, "[3, 4]", "r ≥ 4 → done"]] },
  expl: [["l, r = r + 1, farthest", "The next level is everything just past the current window up to the new farthest point."]],
  take: "**Min jumps / min steps with ranges → implicit BFS over windows** (greedy).",
  mist: ["Jumping greedily to the largest nums[i] (not always optimal)."],
},
{
  id: "gas-station", t: "Gas Station", lc: 134, d: "Medium", p: "Greedy (running balance)",
  q: "There are `n` gas stations in a circle. Station i gives `gas[i]`, and driving to the next station costs `cost[i]`. You start with an empty tank. Return the starting index from which you can complete the circuit once, or −1. The answer is unique if it exists.",
  ex: [["gas = [1,2,3,4,5], cost = [3,4,5,1,2]", "3", ""], ["gas = [2,3,4], cost = [3,4,3]", "-1", ""]],
  c: ["1 ≤ n ≤ 10^5"],
  hint: "If total gas < total cost → impossible. Otherwise, run a balance. When it goes negative at i, **no station between the start and i** can work as a start, so the next candidate is i + 1.",
  brute: {
    idea: "Simulate starting from every station.",
    code: R`
class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        n = len(gas)
        for start in range(n):
            tank, ok = 0, True
            for k in range(n):
                i = (start + k) % n
                tank += gas[i] - cost[i]
                if tank < 0:
                    ok = False
                    break
            if ok:
                return start
        return -1`,
    tc: "O(n²)", sc: "O(1)",
  },
  opt: {
    idea: "1. If `sum(gas) < sum(cost)` → −1.\n2. Otherwise a start exists. Walk once, keeping `tank`. When `tank < 0` after station i, the start must be after i, so set `start = i + 1` and reset `tank = 0`.\n3. Return `start`.",
    steps: ["if sum(gas) < sum(cost) → −1", "tank = start = 0", "for i: tank += gas[i] − cost[i]; if tank < 0: start = i + 1; tank = 0", "return start"],
    code: R`
class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        if sum(gas) < sum(cost):
            return -1
        tank = start = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:                # can't reach i+1 from 'start'
                start = i + 1           # ...nor from anything in between
                tank = 0
        return start`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]))
print(s.canCompleteCircuit([2, 3, 4], [3, 4, 3]))`,
  out: R`
3
-1`,
  dryOn: "gas [1,2,3,4,5], cost [3,4,5,1,2]",
  dry: { h: ["i", "gas − cost", "tank", "start"], r: [[0, -2, "−2 → reset", 1], [1, -2, "−2 → reset", 2], [2, -2, "−2 → reset", 3], [3, 3, 3, 3], [4, 3, 6, "**3**"]] },
  expl: [["if sum(gas) < sum(cost)", "This guarantees that the start the scan finds really works for the wrap-around part as well."]],
  take: "**Circular feasibility → total check + a single pass that resets the start when the running balance goes negative.**",
  mist: ["Simulating every start (O(n²))."],
},
{
  id: "hand-of-straights", t: "Hand of Straights", lc: 846, d: "Medium", p: "Greedy + Counter (smallest first)",
  q: "Can the `hand` of cards be rearranged into groups of size `groupSize`, where each group is `groupSize` **consecutive** values?",
  ex: [["hand = [1,2,3,6,2,3,4,7,8], groupSize = 3", "True", "[1,2,3], [2,3,4], [6,7,8]"], ["hand = [1,2,3,4,5], groupSize = 4", "False", ""]],
  c: ["1 ≤ n ≤ 10^4"],
  hint: "The smallest remaining card **must** start a group (nothing smaller can contain it). Greedily build groups from the smallest value.",
  opt: {
    idea: "Count the cards. Go through the distinct values in sorted order. For each value `v` with `count[v] = k > 0`, k groups must start at v, so each of `v, v+1, …, v+groupSize−1` needs at least k cards. Subtract k from each, and fail if any would go negative.",
    steps: ["if n % groupSize → False", "count = Counter(hand)", "for v in sorted(count): k = count[v]; if k: for w in v..v+size−1: if count[w] < k → False; count[w] −= k", "True"],
    code: R`
from collections import Counter

class Solution:
    def isNStraightHand(self, hand: list[int], groupSize: int) -> bool:
        if len(hand) % groupSize:
            return False
        count = Counter(hand)
        for v in sorted(count):
            k = count[v]
            if k == 0:
                continue
            for w in range(v, v + groupSize):    # k groups start at v
                if count[w] < k:
                    return False
                count[w] -= k
        return True`,
    tc: "O(n log n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3))
print(s.isNStraightHand([1, 2, 3, 4, 5], 4))`,
  out: R`
True
False`,
  dry: ["counts {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}", "v=1: one group 1,2,3 → {2:1, 3:1, 4:1, …}", "v=2: one group 2,3,4 → all zero", "v=6: group 6,7,8 ✓ → True"],
  expl: [["count[w] < k", "A Counter returns 0 for missing keys, so a gap in values is caught here."]],
  take: "**Partition into consecutive runs → process the smallest first; it's forced to start a run.**",
  mist: ["Not checking divisibility first."],
},
{
  id: "merge-triplets-to-form-target-triplet", t: "Merge Triplets to Form Target Triplet", lc: 1899, d: "Medium", p: "Greedy (filter then combine)",
  q: "You may repeatedly pick two triplets and replace one with their element-wise **max**. Can you obtain `target` as one of the triplets?",
  ex: [["triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]", "True", "max([2,5,3], [1,7,5]) = [2,7,5]"], ["triplets = [[3,4,5],[4,5,6]], target = [3,2,5]", "False", ""]],
  c: ["1 ≤ n ≤ 10^5"],
  hint: "A triplet with **any** value above the target's can never be used, because max only grows. Among the rest, can every position reach the target exactly?",
  opt: {
    idea: "Ignore triplets with any coordinate greater than the target's. From the remaining ones, record which coordinates exactly equal the target. If all three coordinates are covered, merging those triplets gives the target.",
    steps: ["good = set()", "for t: if t[i] ≤ target[i] for all i: add each i where t[i] == target[i]", "return len(good) == 3"],
    code: R`
class Solution:
    def mergeTriplets(self, triplets: list[list[int]], target: list[int]) -> bool:
        good = set()
        for t in triplets:
            if all(t[i] <= target[i] for i in range(3)):   # usable triplet
                for i in range(3):
                    if t[i] == target[i]:
                        good.add(i)
        return len(good) == 3`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.mergeTriplets([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]))
print(s.mergeTriplets([[3, 4, 5], [4, 5, 6]], [3, 2, 5]))`,
  out: R`
True
False`,
  dry: ["[1,8,4] has 8 > 7 → unusable", "[2,5,3] covers index 0; [1,7,5] covers indexes 1 and 2 → all three → True"],
  expl: [["all(t[i] <= target[i] ...)", "Including a triplet with a bigger value would push that coordinate above the target permanently."]],
  take: "**When an operation only increases values (max/OR), first discard anything that overshoots.**",
  mist: ["Trying to simulate the merges."],
},
{
  id: "partition-labels", t: "Partition Labels", lc: 763, d: "Medium", p: "Greedy (last occurrence)",
  q: "Split string `s` into as many parts as possible so that each letter appears in **at most one** part. Return the sizes of the parts.",
  ex: [["s = \"ababcbacadefegdehijhklij\"", "[9, 7, 8]", "\"ababcbaca\", \"defegde\", \"hijhklij\""], ["s = \"eccbbbbdec\"", "[10]", ""]],
  c: ["1 ≤ len(s) ≤ 500"],
  hint: "Record the last index of each letter. Extend the current part's end to the furthest last-occurrence of any letter inside it. When i reaches that end, close the part.",
  opt: {
    idea: "`last[c]` = the last index of c. Scan with `start` and `end`. At each i, `end = max(end, last[s[i]])`. When `i == end`, every letter in `s[start..i]` has its final occurrence inside, so cut there.",
    steps: ["last = {c: i}", "start = end = 0", "for i, c: end = max(end, last[c]); if i == end: record end − start + 1; start = i + 1"],
    code: R`
class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        last = {c: i for i, c in enumerate(s)}     # later indices overwrite earlier ones
        res, start, end = [], 0, 0
        for i, c in enumerate(s):
            end = max(end, last[c])                # this part must reach c's last occurrence
            if i == end:
                res.append(end - start + 1)
                start = i + 1
        return res`,
    tc: "O(n)", sc: "O(1)", sw: "At most 26 letters.",
  },
  run: R`
s = Solution()
print(s.partitionLabels("ababcbacadefegdehijhklij"))
print(s.partitionLabels("eccbbbbdec"))`,
  out: R`
[9, 7, 8]
[10]`,
  dry: ["'a' last at 8 → end 8; the letters b, c inside end ≤ 8 → at i = 8 cut (size 9)", "'d' last at 14, 'e' at 15 → end 15 → cut (size 7)", "the rest → size 8"],
  expl: [["{c: i for i, c in enumerate(s)}", "In a dict comprehension later keys overwrite earlier ones, so each letter maps to its last index."]],
  take: "**\"Group so that each item stays in one group\" → extend the boundary to the last occurrence (an interval-merging idea).**",
  mist: ["Cutting as soon as the current letter's last occurrence is reached, ignoring the other letters in the part."],
},
{
  id: "valid-parenthesis-string", t: "Valid Parenthesis String", lc: 678, d: "Medium", p: "Greedy (range of open counts)",
  q: "A string has `(`, `)` and `*`, where `*` can be `(`, `)` or empty. Return `True` if some choice for the `*`s makes the string valid.",
  ex: [["s = \"()\"", "True", ""], ["s = \"(*)\"", "True", ""], ["s = \"(*))\"", "True", "* acts as ("], ["s = \")(\"", "False", ""]],
  c: ["1 ≤ len(s) ≤ 100"],
  hint: "Instead of one open-count, track the **range** [lo, hi] of possible open counts. `*` widens the range.",
  brute: {
    idea: "Memoized DFS over (index, open count), trying all 3 options for each `*`.",
    code: R`
from functools import cache

class Solution:
    def checkValidString(self, s: str) -> bool:
        @cache
        def dfs(i, open_):
            if open_ < 0:
                return False
            if i == len(s):
                return open_ == 0
            if s[i] == "(":
                return dfs(i + 1, open_ + 1)
            if s[i] == ")":
                return dfs(i + 1, open_ - 1)
            return dfs(i + 1, open_ + 1) or dfs(i + 1, open_ - 1) or dfs(i + 1, open_)
        return dfs(0, 0)`,
    tc: "O(n²)", sc: "O(n²)",
  },
  opt: {
    idea: "`lo` = the minimum possible open count, `hi` = the maximum.\n- `(` → lo += 1, hi += 1\n- `)` → lo −= 1, hi −= 1\n- `*` → lo −= 1 (treat it as `)`), hi += 1 (treat it as `(`)\n\nIf `hi < 0`, there are too many `)` even in the best case → False. Clamp `lo` at 0 (we can't have negative opens, so choose `*` as empty instead). At the end it's valid if `lo == 0`.",
    steps: ["lo = hi = 0", "update per char", "if hi < 0 → False", "lo = max(lo, 0)", "return lo == 0"],
    code: R`
class Solution:
    def checkValidString(self, s: str) -> bool:
        lo = hi = 0                   # range of possible "open" counts
        for c in s:
            if c == "(":
                lo, hi = lo + 1, hi + 1
            elif c == ")":
                lo, hi = lo - 1, hi - 1
            else:                     # '*'
                lo, hi = lo - 1, hi + 1
            if hi < 0:
                return False          # too many ')' no matter what
            lo = max(lo, 0)
        return lo == 0`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
for t in ["()", "(*)", "(*))", ")(", "((*"]:
    print(t, s.checkValidString(t))`,
  out: R`
() True
(*) True
(*)) True
)( False
((* False`,
  dryOn: "\"(*))\"",
  dry: { h: ["char", "lo", "hi"], r: [["(", 1, 1], ["*", 0, 2], [")", 0, 1], [")", "0 (clamped from −1)", 0], ["end", "lo == 0 → **True**", ""]] },
  expl: [["lo = max(lo, 0)", "A negative minimum would mean we chose `*` as `)` too often. We can choose it as empty instead."]],
  take: "**When choices make the state uncertain, track the range of possible states instead of one value.**",
  mist: ["A single counter with `*` treated as one fixed option."],
},
]);
