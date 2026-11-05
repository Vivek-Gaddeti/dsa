NC.add("1-D DP", [
{
  id: "climbing-stairs", t: "Climbing Stairs", lc: 70, d: "Easy", p: "1-D DP (Fibonacci)",
  q: "You're climbing a staircase with `n` steps. Each time you can climb **1 or 2** steps. In how many distinct ways can you reach the top?",
  ex: [["n = 2", "2", "1+1, 2"], ["n = 3", "3", "1+1+1, 1+2, 2+1"]],
  c: ["1 ≤ n ≤ 45"],
  hint: "To reach step n, your last move was from step n−1 or from step n−2. So ways(n) = ways(n−1) + ways(n−2).",
  brute: {
    idea: "Plain recursion on the recurrence. The same subproblems get recomputed exponentially many times.",
    code: R`
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        return self.climbStairs(n - 1) + self.climbStairs(n - 2)`,
    run: R`
s = Solution()
print([s.climbStairs(n) for n in range(1, 8)])   # n = 45 would take minutes!`,
    out: R`
[1, 2, 3, 5, 8, 13, 21]`,
    tc: "O(2ⁿ)", sc: "O(n)", bad: "n = 45 → about 10^9 calls.",
  },
  better: {
    idea: "**Memoization (top-down DP):** cache each result so every n is computed once.",
    code: R`
from functools import cache

class Solution:
    def climbStairs(self, n: int) -> int:
        @cache
        def ways(i):
            if i <= 2:
                return i
            return ways(i - 1) + ways(i - 2)
        return ways(n)`,
    tc: "O(n)", sc: "O(n)",
  },
  opt: {
    idea: "**Bottom-up with two variables:** only the previous two values are needed. This is exactly the Fibonacci sequence.",
    steps: ["one, two = 1, 1  (ways to reach the last step and the one before it)", "repeat n − 1 times: one, two = one + two, one", "return one"],
    code: R`
class Solution:
    def climbStairs(self, n: int) -> int:
        one, two = 1, 1          # ways(i-1), ways(i-2)
        for _ in range(n - 1):
            one, two = one + two, one
        return one`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print([s.climbStairs(n) for n in range(1, 8)])
print(s.climbStairs(45))`,
  out: R`
[1, 2, 3, 5, 8, 13, 21]
1836311903`,
  dry: { h: ["step i", "ways(i)"], r: [[1, 1], [2, 2], [3, "2 + 1 = 3"], [4, "3 + 2 = 5"], [5, "5 + 3 = 8"]] },
  expl: [
    ["@cache", "`functools.cache` memoizes a function by its arguments, which gives you top-down DP for free."],
    ["one, two = one + two, one", "Simultaneous assignment shifts the window of the last two values."],
  ],
  take: "**DP recipe: define the state (ways to reach i) → recurrence (from i−1 and i−2) → base cases → order of computation → optimize space.**",
  mist: ["Plain recursion without memoization.", "Wrong base cases (n = 1 → 1, n = 2 → 2)."],
},
{
  id: "min-cost-climbing-stairs", t: "Min Cost Climbing Stairs", lc: 746, d: "Easy", p: "1-D DP",
  q: "`cost[i]` is the cost of stepping on stair `i`. After paying, you can climb 1 or 2 steps. You may start at index 0 or 1. Return the minimum cost to reach the top (just past the last index).",
  ex: [["cost = [10,15,20]", "15", "Start at 1, pay 15, jump 2 to the top."], ["cost = [1,100,1,1,1,100,1,1,100,1]", "6", ""]],
  c: ["2 ≤ n ≤ 1000"],
  hint: "dp[i] = the minimum cost to stand on step i = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]).",
  opt: {
    idea: "`dp[i]` = the cheapest way to **arrive** at position i (without paying for i yet). `dp[0] = dp[1] = 0` because you can start there for free. `dp[i] = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2])`. The answer is `dp[n]` (the top). Keep only two values.",
    steps: ["a, b = 0, 0  (dp[i−2], dp[i−1])", "for i in 2..n: a, b = b, min(b + cost[i−1], a + cost[i−2])", "return b"],
    code: R`
class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        a = b = 0                       # cost to arrive at i-2, i-1
        for i in range(2, len(cost) + 1):
            a, b = b, min(b + cost[i - 1], a + cost[i - 2])
        return b`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.minCostClimbingStairs([10, 15, 20]))
print(s.minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]))`,
  out: R`
15
6`,
  dryOn: "[10,15,20]",
  dry: { h: ["i (position)", "from i−1", "from i−2", "dp[i]"], r: [[0, "", "", 0], [1, "", "", 0], [2, "0 + 15", "0 + 10", 10], [3, "10 + 20", "0 + 15", "**15**"]] },
  expl: [["min(b + cost[i - 1], a + cost[i - 2])", "Arrive from one step below (paying for it) or from two steps below."]],
  take: "**\"Minimum cost to reach the end with small jumps\" → 1-D DP over positions.**",
  mist: ["Treating the last index as the top (the top is one past it)."],
},
{
  id: "house-robber", t: "House Robber", lc: 198, d: "Medium", p: "1-D DP (take / skip)",
  q: "Houses in a row hold `nums[i]` money. You can't rob **two adjacent** houses. Return the maximum amount you can rob.",
  ex: [["nums = [1,2,3,1]", "4", "Rob houses 0 and 2: 1 + 3."], ["nums = [2,7,9,3,1]", "12", "2 + 9 + 1"]],
  c: ["1 ≤ n ≤ 100"],
  hint: "At house i: rob it (+ the best up to i−2) or skip it (the best up to i−1).",
  brute: {
    idea: "Recursion: best(i) = max(nums[i] + best(i+2), best(i+1)). Exponential without memoization.",
    code: R`
class Solution:
    def rob(self, nums: list[int]) -> int:
        def best(i):
            if i >= len(nums):
                return 0
            return max(nums[i] + best(i + 2), best(i + 1))
        return best(0)`,
    tc: "O(2ⁿ)", sc: "O(n)",
  },
  opt: {
    idea: "`dp[i] = max(dp[i−1], nums[i] + dp[i−2])`. Only the last two values matter: `prev2` (best up to i−2) and `prev1` (best up to i−1).",
    steps: ["prev2, prev1 = 0, 0", "for x in nums: prev2, prev1 = prev1, max(prev1, prev2 + x)", "return prev1"],
    viz: "houseRobber",
    code: R`
class Solution:
    def rob(self, nums: list[int]) -> int:
        prev2 = prev1 = 0                 # best up to i-2, best up to i-1
        for x in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + x)   # skip x  vs  rob x
        return prev1`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.rob([1, 2, 3, 1]))
print(s.rob([2, 7, 9, 3, 1]))`,
  out: R`
4
12`,
  dryOn: "[2,7,9,3,1]",
  dry: { h: ["x", "skip (prev1)", "rob (prev2 + x)", "new best"], r: [[2, 0, 2, 2], [7, 2, 7, 7], [9, 7, "2 + 9 = 11", 11], [3, 11, "7 + 3 = 10", 11], [1, 11, "11 + 1 = 12", "**12**"]] },
  expl: [["max(prev1, prev2 + x)", "Skipping keeps the best so far. Robbing adds x to the best that ends at least 2 houses back."]],
  take: "**\"Pick elements with no two adjacent\" → take/skip DP: dp[i] = max(dp[i−1], dp[i−2] + val).**",
  mist: ["Greedy (taking every other house) fails: [2,1,1,2] → the best is 4 (houses 0 and 3)."],
},
{
  id: "house-robber-ii", t: "House Robber II", lc: 213, d: "Medium", p: "1-D DP (circular → two linear runs)",
  q: "Same as House Robber, but the houses are arranged in a **circle**: the first and last houses are adjacent.",
  ex: [["nums = [2,3,2]", "3", "You can't rob both 2s (they're adjacent in the circle)."], ["nums = [1,2,3,1]", "4", ""], ["nums = [1,2,3]", "3", ""]],
  c: ["1 ≤ n ≤ 100"],
  hint: "You can't take both the first and the last house. So the answer is max(rob houses 0..n−2, rob houses 1..n−1).",
  opt: {
    idea: "Break the circle: either the first house is excluded or the last house is excluded. Run linear House Robber on `nums[1:]` and on `nums[:-1]` and take the max. Special case: a single house.",
    steps: ["if n == 1 → nums[0]", "return max(rob_line(nums[1:]), rob_line(nums[:-1]))"],
    code: R`
class Solution:
    def rob(self, nums: list[int]) -> int:
        def line(arr):
            prev2 = prev1 = 0
            for x in arr:
                prev2, prev1 = prev1, max(prev1, prev2 + x)
            return prev1
        if len(nums) == 1:
            return nums[0]
        return max(line(nums[1:]), line(nums[:-1]))`,
    tc: "O(n)", sc: "O(n)", sw: "The slices (O(1) if you pass index ranges instead).",
  },
  run: R`
s = Solution()
print(s.rob([2, 3, 2]))
print(s.rob([1, 2, 3, 1]))
print(s.rob([1, 2, 3]))
print(s.rob([5]))`,
  out: R`
3
4
3
5`,
  dry: ["[2,3,2]: without the last → [2,3] → 3; without the first → [3,2] → 3 → max 3"],
  expl: [["if len(nums) == 1", "Both slices would be empty → 0, which is wrong for one house."]],
  take: "**Circular constraint → split into linear cases that exclude one end each.**",
  mist: ["Forgetting the single-house case."],
},
{
  id: "longest-palindromic-substring", t: "Longest Palindromic Substring", lc: 5, d: "Medium", p: "Expand Around Center",
  q: "Given a string `s`, return the **longest palindromic substring**.",
  ex: [["s = \"babad\"", "\"bab\"", "\"aba\" is also valid."], ["s = \"cbbd\"", "\"bb\"", ""]],
  c: ["1 ≤ len(s) ≤ 1000"],
  hint: "Every palindrome mirrors around a center. There are 2n−1 centers: each character (odd length) and each gap between characters (even length).",
  brute: {
    idea: "Check every substring and test whether it's a palindrome.",
    code: R`
class Solution:
    def longestPalindrome(self, s: str) -> str:
        best = ""
        for i in range(len(s)):
            for j in range(i, len(s)):
                sub = s[i:j + 1]
                if len(sub) > len(best) and sub == sub[::-1]:
                    best = sub
        return best`,
    tc: "O(n³)", sc: "O(n)",
  },
  opt: {
    idea: "For each center, expand outward while the characters on both sides match. Track the longest. Odd centers: `(i, i)`. Even centers: `(i, i+1)`.\n\n(DP is also possible: `dp[i][j] = s[i] == s[j] and dp[i+1][j−1]`. Same O(n²) time but O(n²) space.)",
    steps: ["for i in range(n): try expand(i, i) and expand(i, i + 1)", "expand(l, r): while l ≥ 0, r < n and s[l] == s[r]: l −= 1; r += 1", "the palindrome is s[l+1 : r]; keep the longest"],
    code: R`
class Solution:
    def longestPalindrome(self, s: str) -> str:
        def expand(l, r):
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            return s[l + 1:r]               # last valid window

        best = ""
        for i in range(len(s)):
            for p in (expand(i, i), expand(i, i + 1)):   # odd and even centers
                if len(p) > len(best):
                    best = p
        return best`,
    tc: "O(n²)", sc: "O(1)", sw: "Apart from the returned slices.",
  },
  run: R`
s = Solution()
print(s.longestPalindrome("babad"))
print(s.longestPalindrome("cbbd"))
print(s.longestPalindrome("forgeeksskeegfor"))`,
  out: R`
bab
bb
geeksskeeg`,
  dry: ["\"cbbd\": center (1,2) 'b'='b' → expand to (0,3) 'c'≠'d' → \"bb\"", "The odd centers only give length 1 → the answer is \"bb\""],
  expl: [["return s[l + 1:r]", "The loop overshoots by one on each side, so step back in."]],
  alt: { idea: "Manacher's algorithm solves it in O(n), but it's rarely expected in interviews." },
  take: "**Palindromic substrings → expand around 2n−1 centers.** It's simpler than DP and uses O(1) space.",
  mist: ["Forgetting even-length centers (\"bb\")."],
},
{
  id: "palindromic-substrings", t: "Palindromic Substrings", lc: 647, d: "Medium", p: "Expand Around Center (count)",
  q: "Return the **number** of palindromic substrings in `s`. Substrings at different positions count separately even if they're equal.",
  ex: [["s = \"abc\"", "3", "\"a\", \"b\", \"c\""], ["s = \"aaa\"", "6", "a, a, a, aa, aa, aaa"]],
  c: ["1 ≤ len(s) ≤ 1000"],
  hint: "Same expansion as the previous problem, but count every successful expansion step.",
  opt: {
    idea: "For each of the 2n−1 centers, expand while it's a palindrome, and each successful step adds one palindrome.",
    steps: ["count = 0", "for each center (i, i) and (i, i + 1): while it matches → count += 1, expand"],
    code: R`
class Solution:
    def countSubstrings(self, s: str) -> int:
        n, count = len(s), 0
        for center in range(2 * n - 1):
            l = center // 2
            r = l + center % 2              # odd center: l == r; even: r = l + 1
            while l >= 0 and r < n and s[l] == s[r]:
                count += 1
                l -= 1
                r += 1
        return count`,
    tc: "O(n²)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.countSubstrings("abc"))
print(s.countSubstrings("aaa"))`,
  out: R`
3
6`,
  dry: ["\"aaa\" centers: 0 → a (1); gap 0-1 → aa (1); 1 → a, aaa (2); gap 1-2 → aa (1); 2 → a (1) → total 6"],
  expl: [["l = center // 2; r = l + center % 2", "Encodes all 2n−1 centers in one loop: even `center` values are characters, odd ones are gaps."]],
  take: "**Count palindromes → expand around centers and count each expansion.**",
  mist: ["Only counting the longest palindrome at each center."],
},
{
  id: "decode-ways", t: "Decode Ways", lc: 91, d: "Medium", p: "1-D DP (1 or 2 chars)",
  q: "A message of letters A–Z is encoded as numbers: A → \"1\", …, Z → \"26\". Given a digit string `s`, return the number of ways to decode it. (\"06\" is not a valid code for F.)",
  ex: [["s = \"12\"", "2", "\"AB\" (1 2) or \"L\" (12)"], ["s = \"226\"", "3", "BZ, VF, BBF"], ["s = \"06\"", "0", ""]],
  c: ["1 ≤ len(s) ≤ 100"],
  hint: "Like climbing stairs: from position i, you can take 1 digit (if it's not '0') or 2 digits (if they form 10–26).",
  opt: {
    idea: "`dp[i]` = the number of ways to decode `s[:i]`.\n- One-digit step: if `s[i−1] != '0'`, add `dp[i−1]`.\n- Two-digit step: if `10 ≤ int(s[i−2:i]) ≤ 26`, add `dp[i−2]`.\n\n`dp[0] = 1` (the empty prefix). Only two previous values are needed.",
    steps: ["prev2, prev1 = 1, 1 if s[0] != '0' else 0", "for i in 2..n: cur = 0", "if s[i−1] != '0': cur += prev1", "if 10 ≤ int(s[i−2:i]) ≤ 26: cur += prev2", "shift"],
    code: R`
class Solution:
    def numDecodings(self, s: str) -> int:
        prev2 = 1                                  # dp[0]: empty prefix
        prev1 = 1 if s[0] != "0" else 0            # dp[1]
        for i in range(2, len(s) + 1):
            cur = 0
            if s[i - 1] != "0":
                cur += prev1                       # decode one digit
            if 10 <= int(s[i - 2:i]) <= 26:
                cur += prev2                       # decode two digits
            prev2, prev1 = prev1, cur
        return prev1`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
for t in ["12", "226", "06", "11106", "10"]:
    print(t, s.numDecodings(t))`,
  out: R`
12 2
226 3
06 0
11106 2
10 1`,
  dryOn: "\"226\"",
  dry: { h: ["i", "one digit", "two digits", "dp[i]"], r: [[0, "", "", 1], [1, "'2' ✓", "", 1], [2, "'2' ✓ → +1", "'22' ✓ → +1", 2], [3, "'6' ✓ → +2", "'26' ✓ → +1", "**3**"]] },
  expl: [
    ["dp[0] = 1", "One way to decode nothing. It's what makes the two-digit case at i = 2 work."],
    ["10 <= int(...) <= 26", "Excludes \"05\"-style codes with a leading zero, and anything above 26."],
  ],
  take: "**Counting ways to split a sequence into valid pieces of length 1 or 2 → Fibonacci-like DP with validity checks.**",
  mist: ["Allowing '0' as a single digit.", "Allowing \"01\"–\"09\" as two-digit codes."],
},
{
  id: "coin-change", t: "Coin Change", lc: 322, d: "Medium", p: "Unbounded Knapsack (min)",
  q: "Given coin denominations `coins` and an `amount`, return the **fewest coins** needed to make that amount, or −1 if it's impossible. You have unlimited coins of each type.",
  ex: [["coins = [1,2,5], amount = 11", "3", "5 + 5 + 1"], ["coins = [2], amount = 3", "-1", ""], ["coins = [1], amount = 0", "0", ""]],
  c: ["1 ≤ coins ≤ 12", "0 ≤ amount ≤ 10^4"],
  hint: "Greedy (always the largest coin) fails, e.g. coins [1,3,4] for 6 → 4+1+1 but 3+3 is better. Use dp[a] = min coins for amount a.",
  brute: {
    idea: "Try every coin first, recursively. Exponential without memoization.",
    code: R`
from functools import cache

class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        @cache
        def best(a):                     # memoized version shown, already O(amount * coins)
            if a == 0:
                return 0
            res = float("inf")
            for c in coins:
                if c <= a:
                    res = min(res, 1 + best(a - c))
            return res
        ans = best(amount)
        return -1 if ans == float("inf") else ans`,
    tc: "O(amount · coins)", sc: "O(amount)", bad: "The top-down version is correct, but recursion depth can reach `amount` (10^4), past Python's default limit of 1000.",
  },
  opt: {
    idea: "**Bottom-up:** `dp[a]` = the minimum coins to make `a`. `dp[0] = 0`, and everything else starts at infinity. For each amount `a` and each coin `c ≤ a`: `dp[a] = min(dp[a], dp[a − c] + 1)`.",
    steps: ["dp = [0] + [inf] * amount", "for a in 1..amount: for c in coins: if c ≤ a: dp[a] = min(dp[a], dp[a − c] + 1)", "return dp[amount] if finite else −1"],
    code: R`
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        INF = amount + 1                     # bigger than any real answer
        dp = [0] + [INF] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a:
                    dp[a] = min(dp[a], dp[a - c] + 1)   # use coin c last
        return dp[amount] if dp[amount] != INF else -1`,
    tc: "O(amount · len(coins))", sc: "O(amount)",
  },
  run: R`
s = Solution()
print(s.coinChange([1, 2, 5], 11))
print(s.coinChange([2], 3))
print(s.coinChange([1], 0))
print(s.coinChange([1, 3, 4], 6))`,
  out: R`
3
-1
0
2`,
  dryOn: "coins [1,3,4], amount 6",
  dry: { h: ["a", "dp[a]", "best last coin"], r: [[0, 0, ""], [1, 1, 1], [2, 2, 1], [3, 1, 3], [4, 1, 4], [5, 2, "4 (+1) or 1 (+4)"], [6, "**2**", "3 + 3"]] },
  expl: [
    ["INF = amount + 1", "You can never need more than `amount` coins (all 1s), so this is a safe \"impossible\" marker."],
    ["dp[a - c] + 1", "The best way to make the rest, plus this one coin."],
  ],
  take: "**Minimum number of items to reach a total with unlimited reuse → unbounded knapsack DP over the total.**",
  mist: ["Greedy largest-coin-first.", "Initializing dp with 0 instead of infinity."],
},
{
  id: "maximum-product-subarray", t: "Maximum Product Subarray", lc: 152, d: "Medium", p: "DP (track max and min)",
  q: "Given an integer array `nums`, return the largest **product** of a contiguous non-empty subarray.",
  ex: [["nums = [2,3,-2,4]", "6", "[2,3]"], ["nums = [-2,0,-1]", "0", ""], ["nums = [-2,3,-4]", "24", "All three: two negatives cancel."]],
  c: ["1 ≤ n ≤ 2·10^4"],
  hint: "A negative number turns the **smallest** (most negative) product into the largest. Track both the max and the min product ending at each position.",
  opt: {
    idea: "Like Kadane, but keep `cur_max` and `cur_min` for subarrays ending at i. For each x, the candidates are `x`, `x · cur_max` and `x · cur_min`: the new max is the largest and the new min is the smallest. Update the answer with `cur_max`.",
    steps: ["res = cur_max = cur_min = nums[0]", "for x in nums[1:]: candidates = (x, x·cur_max, x·cur_min)", "cur_max, cur_min = max(...), min(...)", "res = max(res, cur_max)"],
    code: R`
class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        res = cur_max = cur_min = nums[0]
        for x in nums[1:]:
            cands = (x, x * cur_max, x * cur_min)
            cur_max, cur_min = max(cands), min(cands)   # a negative x swaps roles
            res = max(res, cur_max)
        return res`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.maxProduct([2, 3, -2, 4]))
print(s.maxProduct([-2, 0, -1]))
print(s.maxProduct([-2, 3, -4]))`,
  out: R`
6
0
24`,
  dryOn: "[-2,3,-4]",
  dry: { h: ["x", "candidates", "cur_max", "cur_min", "res"], r: [[-2, "", -2, -2, -2], [3, "3, −6, −6", 3, -6, 3], [-4, "−4, −12, 24", 24, -12, "**24**"]] },
  expl: [["cands = (x, x * cur_max, x * cur_min)", "`x` alone = start fresh (like Kadane resetting). Multiplying by the min handles a negative × negative."]],
  take: "**When a sign flip can turn the worst into the best → track both the max and the min DP states.**",
  mist: ["Updating cur_max before computing cur_min from the old value (use a tuple or temp variables)."],
},
{
  id: "word-break", t: "Word Break", lc: 139, d: "Medium", p: "1-D DP (prefix segmentation)",
  q: "Given a string `s` and a dictionary `wordDict`, return `True` if `s` can be split into a sequence of one or more dictionary words (words may be reused).",
  ex: [["s = \"leetcode\", wordDict = [\"leet\",\"code\"]", "True", ""], ["s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", "True", ""], ["s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", "False", ""]],
  c: ["1 ≤ len(s) ≤ 300", "≤ 1000 words, each ≤ 20 chars"],
  hint: "dp[i] = can `s[:i]` be segmented? It's true if some word ends at i and `dp[i − len(word)]` is true.",
  opt: {
    idea: "`dp[0] = True` (the empty prefix). For each end position `i`, check every word `w`: if `s[i−len(w):i] == w` and `dp[i−len(w)]`, then `dp[i] = True`.",
    steps: ["dp = [True] + [False] * n", "for i in 1..n: for w in words: if i ≥ len(w) and dp[i − len(w)] and s[i − len(w):i] == w → dp[i] = True; break", "return dp[n]"],
    code: R`
class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        n = len(s)
        dp = [True] + [False] * n          # dp[i]: s[:i] can be segmented
        for i in range(1, n + 1):
            for w in wordDict:
                L = len(w)
                if L <= i and dp[i - L] and s[i - L:i] == w:
                    dp[i] = True
                    break
        return dp[n]`,
    tc: "O(n · m · k)", tw: "n positions × m words × k (comparing up to k chars).", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.wordBreak("leetcode", ["leet", "code"]))
print(s.wordBreak("applepenapple", ["apple", "pen"]))
print(s.wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]))`,
  out: R`
True
True
False`,
  dryOn: "\"leetcode\"",
  dry: ["dp[0] = T", "i = 4: \"leet\" matches and dp[0] = T → dp[4] = T", "i = 8: \"code\" matches s[4:8] and dp[4] = T → dp[8] = T → True"],
  expl: [["dp = [True] + [False] * n", "dp has n+1 entries: dp[i] refers to the prefix of length i."]],
  take: "**\"Can the string be split into valid pieces?\" → dp over prefix lengths.**",
  mist: ["Greedy matching of the longest word first (fails on cases like \"aaaaaaa\" with [\"aaaa\", \"aaa\"])."],
},
{
  id: "longest-increasing-subsequence", t: "Longest Increasing Subsequence", lc: 300, d: "Medium", p: "DP / Patience sorting + binary search",
  q: "Return the length of the longest **strictly increasing subsequence** of `nums` (elements in order, not necessarily contiguous).",
  ex: [["nums = [10,9,2,5,3,7,101,18]", "4", "[2,3,7,101]"], ["nums = [0,1,0,3,2,3]", "4", ""], ["nums = [7,7,7,7]", "1", ""]],
  c: ["1 ≤ n ≤ 2500", "Follow-up: O(n log n)"],
  hint: "O(n²) DP: `dp[i]` = the LIS ending at i. O(n log n): keep `tails[k]` = the smallest possible tail of an increasing subsequence of length k+1.",
  brute: {
    idea: "**O(n²) DP:** `dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i])`.",
    code: R`
class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        dp = [1] * len(nums)
        for i in range(len(nums)):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp)`,
    tc: "O(n²)", sc: "O(n)", bad: "Accepted for n = 2500, but the follow-up asks for O(n log n).",
  },
  opt: {
    idea: "Keep `tails`, where `tails[k]` = the smallest tail value of any increasing subsequence of length k+1. `tails` is always sorted.\n\nFor each x: binary-search for the first tail ≥ x.\n- If there's none, x extends the longest subsequence → append it.\n- Otherwise replace that tail with x. A smaller tail is never worse, because it leaves more room to extend later.\n\nThe length of `tails` is the LIS length (tails itself isn't necessarily a real subsequence).",
    steps: ["tails = []", "for x: i = bisect_left(tails, x)", "if i == len(tails): append x, else tails[i] = x", "return len(tails)"],
    code: R`
import bisect

class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        tails = []                          # tails[k] = min tail of an inc. subseq of length k+1
        for x in nums:
            i = bisect.bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)             # extends the longest one
            else:
                tails[i] = x                # better (smaller) tail for length i+1
        return len(tails)`,
    tc: "O(n log n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]))
print(s.lengthOfLIS([0, 1, 0, 3, 2, 3]))
print(s.lengthOfLIS([7, 7, 7, 7]))`,
  out: R`
4
4
1`,
  dryOn: "[10,9,2,5,3,7,101,18]",
  dry: { h: ["x", "action", "tails"], r: [[10, "append", "[10]"], [9, "replace 10", "[9]"], [2, "replace 9", "[2]"], [5, "append", "[2, 5]"], [3, "replace 5", "[2, 3]"], [7, "append", "[2, 3, 7]"], [101, "append", "[2, 3, 7, 101]"], [18, "replace 101", "[2, 3, 7, 18] → length **4**"]] },
  expl: [["bisect_left", "Strictly increasing → find the first tail ≥ x (equal values replace, they don't extend). For non-decreasing you'd use bisect_right."]],
  take: "**LIS: O(n²) DP is the standard answer; the O(n log n) \"tails + binary search\" is the optimization to know.**",
  mist: ["Thinking `tails` is the actual subsequence.", "Using bisect_right for the strictly increasing version."],
},
{
  id: "partition-equal-subset-sum", t: "Partition Equal Subset Sum", lc: 416, d: "Medium", p: "0/1 Knapsack (subset sum)",
  q: "Given `nums`, can it be split into **two subsets with equal sums**?",
  ex: [["nums = [1,5,11,5]", "True", "[1,5,5] and [11]"], ["nums = [1,2,3,5]", "False", ""]],
  c: ["1 ≤ n ≤ 200", "1 ≤ nums[i] ≤ 100"],
  hint: "If the total is odd → impossible. Otherwise, is there a subset summing to total/2? That's the classic subset-sum / 0-1 knapsack.",
  brute: {
    idea: "Try every subset (include/exclude): 2ⁿ.",
    code: R`
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        def go(i, remain):
            if remain == 0:
                return True
            if i == len(nums) or remain < 0:
                return False
            return go(i + 1, remain - nums[i]) or go(i + 1, remain)
        return go(0, total // 2)`,
    tc: "O(2ⁿ)", sc: "O(n)",
  },
  opt: {
    idea: "Keep the **set of reachable sums** (or a boolean dp array). Start with {0}. For each number x, every reachable sum s also makes s + x reachable. Check whether target = total/2 is reachable.\n\nA boolean array `dp[s]` updated **from high to low** gives the same result. Iterating backwards stops x from being used twice in one round.",
    steps: ["if total odd → False; target = total // 2", "dp = [True] + [False] * target", "for x in nums: for s from target down to x: dp[s] |= dp[s − x]", "return dp[target]"],
    code: R`
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        dp = [True] + [False] * target        # dp[s]: some subset sums to s
        for x in nums:
            for s in range(target, x - 1, -1):    # backwards: each x used once
                if dp[s - x]:
                    dp[s] = True
            if dp[target]:
                return True
        return dp[target]`,
    tc: "O(n · target)", sc: "O(target)",
  },
  run: R`
s = Solution()
print(s.canPartition([1, 5, 11, 5]))
print(s.canPartition([1, 2, 3, 5]))`,
  out: R`
True
False`,
  dryOn: "[1,5,11,5], target 11",
  dry: ["start reachable {0}", "x = 1 → {0, 1}", "x = 5 → {0, 1, 5, 6}", "x = 11 → {…, 11, 12, 16, 17} → 11 is reachable → True"],
  expl: [["range(target, x - 1, -1)", "Going downwards means dp[s − x] still holds the value from *before* this x, so each item is used at most once (0/1 knapsack)."]],
  alt: { idea: "Set version (very readable):", code: R`
class Solution:
    def canPartition(self, nums):
        total = sum(nums)
        if total % 2: return False
        reach = {0}
        for x in nums:
            reach |= {s + x for s in reach}
        return total // 2 in reach` },
  take: "**\"Pick a subset reaching exactly a target, each item once\" → 0/1 knapsack: iterate the capacity backwards.**",
  mist: ["Iterating forwards (that's unbounded knapsack, so items get reused)."],
},
]);
