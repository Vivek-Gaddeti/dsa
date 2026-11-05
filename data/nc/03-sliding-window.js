NC.add("Sliding Window", [
{
  id: "best-time-to-buy-and-sell-stock", t: "Best Time to Buy and Sell Stock", lc: 121, d: "Easy", p: "Sliding Window / running min",
  q: "`prices[i]` is the price of a stock on day `i`. Choose **one** day to buy and a **later** day to sell to maximize profit. Return the maximum profit, or `0` if no profit is possible.",
  ex: [["prices = [7,1,5,3,6,4]", "5", "Buy on day 1 (price 1), sell on day 4 (price 6)."], ["prices = [7,6,4,3,1]", "0", "Prices only fall, so don't trade."]],
  c: ["1 ≤ n ≤ 10^5"],
  hint: "For each day treated as the selling day, the best buying day is the cheapest day *before* it. Track that minimum as you go.",
  brute: {
    idea: "Try every buy day `i` and every later sell day `j`.",
    code: R`
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        best = 0
        for i in range(len(prices)):
            for j in range(i + 1, len(prices)):
                best = max(best, prices[j] - prices[i])
        return best`,
    tc: "O(n²)", sc: "O(1)", bad: "Too slow for 10^5 days.",
  },
  opt: {
    idea: "Scan once. Keep `min_price` = the cheapest price so far (the best day to have bought). For each day, the profit from selling today is `price − min_price`. Track the maximum.\n\nYou can see it as a window `[buy, sell]`: when today's price drops below the buy price, move the left edge (buy) to today.",
    steps: ["`min_price = inf`, `best = 0`", "For each price `p`: `min_price = min(min_price, p)`", "`best = max(best, p − min_price)`", "Return best"],
    code: R`
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float("inf")
        best = 0
        for p in prices:
            min_price = min(min_price, p)      # cheapest day to buy so far
            best = max(best, p - min_price)    # sell today?
        return best`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.maxProfit([7, 1, 5, 3, 6, 4]))
print(s.maxProfit([7, 6, 4, 3, 1]))`,
  out: R`
5
0`,
  dryOn: "[7,1,5,3,6,4]",
  dry: { h: ["day", "price", "min_price", "profit today", "best"], r: [[0, 7, 7, 0, 0], [1, 1, 1, 0, 0], [2, 5, 1, 4, 4], [3, 3, 1, 2, 4], [4, 6, 1, 5, 5], [5, 4, 1, 3, 5]] },
  expl: [
    ["min_price = float(\"inf\")", "Any real price will be smaller."],
    ["min_price = min(min_price, p)", "Update before computing profit: buying and selling on the same day gives 0, which is harmless."],
    ["best = max(best, p - min_price)", "The best profit if we sell today."],
  ],
  take: "**\"Best pair i < j\" → keep a running best of the left side while scanning the right side.** Turns O(n²) into O(n).",
  mist: ["Using global min and max: the min might come *after* the max."],
},
{
  id: "longest-substring-without-repeating-characters", t: "Longest Substring Without Repeating Characters", lc: 3, d: "Medium", p: "Variable Sliding Window",
  q: "Given a string `s`, find the length of the **longest substring** (contiguous) that has no repeated characters.",
  ex: [["s = \"abcabcbb\"", "3", "\"abc\""], ["s = \"bbbbb\"", "1", "\"b\""], ["s = \"pwwkew\"", "3", "\"wke\". \"pwke\" is a subsequence, not a substring."]],
  c: ["0 ≤ len(s) ≤ 5·10^4"],
  hint: "Keep a window with no repeats. Extend the right edge, and when a repeat appears, shrink from the left until the window is valid again.",
  brute: {
    idea: "Check every substring and test whether its characters are unique.",
    code: R`
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        best = 0
        for i in range(len(s)):
            seen = set()
            for j in range(i, len(s)):
                if s[j] in seen:
                    break
                seen.add(s[j])
                best = max(best, j - i + 1)
        return best`,
    tc: "O(n²)", tw: "With the early break (O(n·alphabet) actually), but quadratic in general.", sc: "O(min(n, alphabet))",
  },
  opt: {
    idea: "Maintain a window `[l, r]` that never contains duplicates, using a set of its characters.\n\n- Move `r` forward, adding `s[r]`.\n- If `s[r]` is already in the window, **remove `s[l]` and move `l` right** until it isn't.\n- After each step the window is valid. Record its length.",
    steps: ["`chars = set()`, `l = 0`, `best = 0`", "for r, c in enumerate(s):", "while c in chars: chars.remove(s[l]); l += 1", "chars.add(c); best = max(best, r − l + 1)"],
    viz: "slidingWindow",
    code: R`
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        chars = set()
        l = best = 0
        for r, c in enumerate(s):
            while c in chars:           # shrink until c is no longer duplicated
                chars.remove(s[l])
                l += 1
            chars.add(c)
            best = max(best, r - l + 1)
        return best`,
    tc: "O(n)", tw: "Each character is added once and removed at most once.", sc: "O(min(n, alphabet))",
  },
  run: R`
s = Solution()
for t in ["abcabcbb", "bbbbb", "pwwkew", ""]:
    print(s.lengthOfLongestSubstring(t))`,
  out: R`
3
1
3
0`,
  dryOn: "\"pwwkew\"",
  dry: { h: ["r", "char", "action", "window", "best"], r: [[0, "p", "add", "p", 1], [1, "w", "add", "pw", 2], [2, "w", "dup → remove p, remove w", "w", 2], [3, "k", "add", "wk", 2], [4, "e", "add", "wke", 3], [5, "w", "dup → remove w", "kew", 3]] },
  expl: [
    ["while c in chars:", "`while`, not `if`: the duplicate might be deep inside the window, so several left chars may need removing."],
    ["chars.remove(s[l])\nl += 1", "Shrink from the left."],
    ["best = max(best, r - l + 1)", "Window length after it's valid again."],
  ],
  alt: { idea: "Jump `l` directly using last-seen indices (dict char → index). This avoids the inner while loop.", code: R`
class Solution:
    def lengthOfLongestSubstring(self, s):
        last, l, best = {}, 0, 0
        for r, c in enumerate(s):
            if c in last and last[c] >= l:
                l = last[c] + 1
            last[c] = r
            best = max(best, r - l + 1)
        return best` },
  take: "**Longest/shortest substring with a constraint → variable sliding window:** expand right, shrink left while invalid, record the answer.",
  mist: ["Using `if` instead of `while` for shrinking.", "In the jump version, forgetting `last[c] >= l` (an old occurrence outside the window)."],
},
{
  id: "longest-repeating-character-replacement", t: "Longest Repeating Character Replacement", lc: 424, d: "Medium", p: "Variable Sliding Window + counts",
  q: "Given a string `s` of uppercase letters and an integer `k`, you may change at most `k` characters to any other uppercase letter. Return the length of the longest substring containing only one repeated letter you can get.",
  ex: [["s = \"ABAB\", k = 2", "4", "Replace both A's with B's (or vice versa)."], ["s = \"AABABBA\", k = 1", "4", "Replace the B in \"AABA\" → \"AAAA\"."]],
  c: ["1 ≤ n ≤ 10^5", "0 ≤ k ≤ n"],
  hint: "A window can be made uniform if `window_length − count_of_most_frequent_char ≤ k`. Those are the chars you need to replace.",
  brute: {
    idea: "For every substring, count letters and check `length − maxCount ≤ k`.",
    code: R`
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        best = 0
        for i in range(len(s)):
            count = {}
            for j in range(i, len(s)):
                count[s[j]] = count.get(s[j], 0) + 1
                if (j - i + 1) - max(count.values()) <= k:
                    best = max(best, j - i + 1)
        return best`,
    tc: "O(n² · 26)", sc: "O(26)",
  },
  opt: {
    idea: "Slide a window and keep letter counts plus `maxf`, the highest single-letter count seen in any window so far.\n\nThe window is valid while `(r − l + 1) − maxf ≤ k`. If it becomes invalid, move `l` right by one. The window then **slides** at the same size rather than shrinking.\n\n**Why we never decrease `maxf`:** the answer only grows when a window with a *larger* maxf appears. A stale (too high) maxf just keeps the window size fixed, which never produces a wrong larger answer.",
    steps: ["count = {}, l = 0, maxf = 0", "for r: count[s[r]] += 1; maxf = max(maxf, count[s[r]])", "if (r − l + 1) − maxf > k: count[s[l]] −= 1; l += 1", "best = max(best, r − l + 1)"],
    code: R`
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {}
        l = maxf = best = 0
        for r, c in enumerate(s):
            count[c] = count.get(c, 0) + 1
            maxf = max(maxf, count[c])
            if (r - l + 1) - maxf > k:      # too many chars to replace
                count[s[l]] -= 1
                l += 1
            best = max(best, r - l + 1)
        return best`,
    tc: "O(n)", sc: "O(26)",
  },
  run: R`
s = Solution()
print(s.characterReplacement("ABAB", 2))
print(s.characterReplacement("AABABBA", 1))`,
  out: R`
4
4`,
  dryOn: "\"AABABBA\", k = 1",
  dry: { h: ["r", "char", "window", "maxf", "len − maxf", "action", "best"], r: [[0, "A", "A", 1, 0, "ok", 1], [1, "A", "AA", 2, 0, "ok", 2], [2, "B", "AAB", 2, 1, "ok", 3], [3, "A", "AABA", 3, 1, "ok", 4], [4, "B", "AABAB", 3, 2, "> k → drop A, l=1", 4], [5, "B", "ABABB", 3, 2, "> k → drop A, l=2", 4], [6, "A", "BABBA", 3, 2, "> k → drop B, l=3", 4]] },
  expl: [
    ["(r - l + 1) - maxf > k", "Characters that aren't the majority letter must be replaced. More than k → invalid."],
    ["count[s[l]] -= 1\nl += 1", "Slide the window (shrink by one), keeping its length constant from here on."],
  ],
  take: "**Window validity often looks like `window_size − (something you keep) ≤ budget`.**",
  mist: ["Recomputing `max(count.values())` each step is fine (26 letters), but don't forget it must be the max *inside the window* if you choose that approach."],
},
{
  id: "permutation-in-string", t: "Permutation in String", lc: 567, d: "Medium", p: "Fixed Sliding Window + counts",
  q: "Given strings `s1` and `s2`, return `True` if `s2` contains a **permutation** of `s1` as a substring, i.e. some window of `s2` is an anagram of `s1`.",
  ex: [["s1 = \"ab\", s2 = \"eidbaooo\"", "True", "\"ba\" is in s2."], ["s1 = \"ab\", s2 = \"eidboaoo\"", "False", ""]],
  c: ["1 ≤ len(s1), len(s2) ≤ 10^4", "lowercase letters"],
  hint: "A permutation of `s1` has the same length and letter counts. Slide a window of size `len(s1)` over `s2` and compare counts.",
  brute: {
    idea: "For each window of length `len(s1)`, compare sorted strings.",
    code: R`
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        k, target = len(s1), sorted(s1)
        for i in range(len(s2) - k + 1):
            if sorted(s2[i:i + k]) == target:
                return True
        return False`,
    tc: "O(n · k log k)", sc: "O(k)",
  },
  opt: {
    idea: "Keep two 26-length count arrays: one for `s1` and one for the current window of `s2`. Slide the window one step at a time: add the new right char and remove the char that falls off the left. Compare the arrays (26 ops) each step.",
    steps: ["If len(s1) > len(s2) → False", "need = counts of s1; win = counts of s2[:k]", "If need == win → True", "For r from k to n−1: win[s2[r]] += 1; win[s2[r−k]] −= 1; if equal → True"],
    viz: "fixedWindow",
    code: R`
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        k = len(s1)
        if k > len(s2):
            return False
        need, win = [0] * 26, [0] * 26
        for i in range(k):
            need[ord(s1[i]) - 97] += 1
            win[ord(s2[i]) - 97] += 1
        if need == win:
            return True
        for r in range(k, len(s2)):
            win[ord(s2[r]) - 97] += 1          # char entering on the right
            win[ord(s2[r - k]) - 97] -= 1      # char leaving on the left
            if need == win:
                return True
        return False`,
    tc: "O(26 · n) = O(n)", sc: "O(1)", sw: "Two fixed arrays of 26.",
  },
  run: R`
s = Solution()
print(s.checkInclusion("ab", "eidbaooo"))
print(s.checkInclusion("ab", "eidboaoo"))`,
  out: R`
True
False`,
  dryOn: "s1 = \"ab\", s2 = \"eidbaooo\"",
  dry: ["Windows of size 2: \"ei\", \"id\", \"db\", \"ba\"", "\"ba\" has {a:1, b:1} = need → **True**"],
  expl: [
    ["ord(c) - 97", "97 is `ord('a')`, mapping 'a'..'z' → 0..25."],
    ["win[ord(s2[r - k]) - 97] -= 1", "The character at index r−k has just left the size-k window."],
    ["need == win", "List equality compares element by element (26 comparisons)."],
  ],
  take: "**\"Does some substring have property P of fixed length k\" → fixed sliding window with incremental updates.**",
  mist: ["Off-by-one on the char that leaves (it is `r − k`, not `r − k + 1`)."],
},
{
  id: "minimum-window-substring", t: "Minimum Window Substring", lc: 76, d: "Hard", p: "Variable Sliding Window (shrink while valid)",
  q: "Given strings `s` and `t`, return the **minimum window substring** of `s` that contains every character of `t` (including duplicates). If there's no such window, return `\"\"`.",
  ex: [["s = \"ADOBECODEBANC\", t = \"ABC\"", "\"BANC\"", ""], ["s = \"a\", t = \"a\"", "\"a\"", ""], ["s = \"a\", t = \"aa\"", "\"\"", "s has only one 'a'."]],
  c: ["1 ≤ len(s), len(t) ≤ 10^5"],
  hint: "Expand right until the window covers `t`. Then shrink from the left as long as it **still** covers `t`, recording the smallest window. Track how many required characters are satisfied with a counter, not by comparing whole maps.",
  brute: {
    idea: "Check every substring with a Counter comparison.",
    code: R`
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need, best = Counter(t), ""
        for i in range(len(s)):
            for j in range(i + len(t), len(s) + 1):
                if not need - Counter(s[i:j]):          # window covers t
                    if not best or j - i < len(best):
                        best = s[i:j]
                    break
        return best`,
    tc: "O(n² · n)", sc: "O(n)", bad: "Hopeless for n = 10^5.",
  },
  opt: {
    idea: "`need` = counts of t. `have` = how many distinct chars currently meet their required count. `required` = the number of distinct chars in t.\n\n1. Move `r` right and add `s[r]` to the window counts. If that char's count just reached what we need, `have += 1`.\n2. While `have == required` (the window is valid): record it if it's the smallest, then remove `s[l]`. If that breaks a requirement, `have -= 1`. Move `l` right.",
    steps: ["need = Counter(t); window = {}; have = 0; required = len(need)", "for r: add s[r]; if window[c] == need[c]: have += 1", "while have == required: update answer; remove s[l]; if window[s[l]] < need[s[l]]: have −= 1; l += 1", "return the best slice"],
    code: R`
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not t or not s:
            return ""
        need = Counter(t)
        window = {}
        have, required = 0, len(need)
        best_len, best_l = float("inf"), 0
        l = 0
        for r, c in enumerate(s):
            window[c] = window.get(c, 0) + 1
            if c in need and window[c] == need[c]:
                have += 1
            while have == required:                 # valid -> try to shrink
                if r - l + 1 < best_len:
                    best_len, best_l = r - l + 1, l
                out = s[l]
                window[out] -= 1
                if out in need and window[out] < need[out]:
                    have -= 1
                l += 1
        return "" if best_len == float("inf") else s[best_l:best_l + best_len]`,
    tc: "O(|s| + |t|)", tw: "Each index enters and leaves the window once.", sc: "O(alphabet)",
  },
  run: R`
s = Solution()
print(repr(s.minWindow("ADOBECODEBANC", "ABC")))
print(repr(s.minWindow("a", "a")))
print(repr(s.minWindow("a", "aa")))`,
  out: R`
'BANC'
'a'
''`,
  dryOn: "s = \"ADOBECODEBANC\", t = \"ABC\"",
  dry: ["r expands to 5: \"ADOBEC\" contains A, B, C → valid. best = 6", "Shrink: removing 'A' breaks it → have = 2, l = 1", "Expand to r = 10 ('A'): \"DOBECODEBA\" valid again. Shrink past D, O, B (still have B later), E, C… until invalid", "Expand to r = 12 ('C'): shrink until \"BANC\" (length 4) is the smallest valid → answer"],
  expl: [
    ["have, required = 0, len(need)", "Compare one integer instead of comparing maps every step."],
    ["if c in need and window[c] == need[c]:\n    have += 1", "Only count it when a char *just* reaches its quota (`==`, not `>=`), so it's counted once."],
    ["while have == required:", "Shrink as much as possible while still valid. That gives the minimum window ending at r."],
    ["if out in need and window[out] < need[out]:\n    have -= 1", "Removing that char broke one requirement."],
  ],
  take: "**Minimum window → expand until valid, then shrink while valid.** (Maximum window → expand while valid, shrink while invalid.)",
  mist: ["Using `>=` when incrementing `have` (it gets counted multiple times).", "Storing the substring on every update. Store indices and slice once at the end."],
},
{
  id: "sliding-window-maximum", t: "Sliding Window Maximum", lc: 239, d: "Hard", p: "Monotonic Deque",
  q: "Given an array `nums` and a window size `k` that slides from left to right one position at a time, return the **maximum of each window**.",
  ex: [["nums = [1,3,-1,-3,5,3,6,7], k = 3", "[3, 3, 5, 5, 6, 7]", "Windows: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, …"], ["nums = [1], k = 1", "[1]", ""]],
  c: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ n"],
  hint: "If a newer element is bigger than an older one, the older one can **never** be a window max again. Throw it away. What structure keeps candidates in decreasing order?",
  brute: {
    idea: "Compute `max(nums[i:i+k])` for each window.",
    code: R`
class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        return [max(nums[i:i + k]) for i in range(len(nums) - k + 1)]`,
    tc: "O(n · k)", sc: "O(1) extra", bad: "With n = k ≈ 10^5/2 that's ~2.5·10^9.",
  },
  better: {
    idea: "Max-heap of `(-value, index)`. Pop from the top while that index has left the window.",
    code: R`
import heapq

class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        heap, res = [], []
        for i, x in enumerate(nums):
            heapq.heappush(heap, (-x, i))
            if i >= k - 1:
                while heap[0][1] <= i - k:      # top is outside the window
                    heapq.heappop(heap)
                res.append(-heap[0][0])
        return res`,
    tc: "O(n log n)", sc: "O(n)",
  },
  opt: {
    idea: "Keep a **deque of indices** whose values are in **decreasing order**. The front is always the max of the current window.\n\nFor each new index `i`:\n1. Pop from the **back** while `nums[back] < nums[i]`. Those smaller, older elements can never be a maximum again.\n2. Push `i` on the back.\n3. If the front index has slid out (`front ≤ i − k`), pop it from the **front**.\n4. Once the first full window exists, the answer is `nums[deque[0]]`.",
    steps: ["dq = deque()", "while dq and nums[dq[-1]] < x: dq.pop()", "dq.append(i)", "if dq[0] <= i − k: dq.popleft()", "if i >= k − 1: res.append(nums[dq[0]])"],
    code: R`
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq = deque()           # indices; their values are decreasing
        res = []
        for i, x in enumerate(nums):
            while dq and nums[dq[-1]] < x:
                dq.pop()                  # smaller & older -> useless forever
            dq.append(i)
            if dq[0] <= i - k:
                dq.popleft()              # front fell out of the window
            if i >= k - 1:
                res.append(nums[dq[0]])
        return res`,
    tc: "O(n)", tw: "Every index is pushed once and popped at most once.", sc: "O(k)",
  },
  run: R`
s = Solution()
print(s.maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3))
print(s.maxSlidingWindow([1], 1))`,
  out: R`
[3, 3, 5, 5, 6, 7]
[1]`,
  dryOn: "[1,3,-1,-3,5,3,6,7], k = 3 (deque shows values)",
  dry: { h: ["i", "x", "deque after", "window max"], r: [[0, 1, "[1]", "—"], [1, 3, "[3] (1 popped)", "—"], [2, -1, "[3, −1]", 3], [3, -3, "[3, −1, −3]", 3], [4, 5, "[5] (all popped)", 5], [5, 3, "[5, 3]", 5], [6, 6, "[6]", 6], [7, 7, "[7]", 7]] },
  expl: [
    ["while dq and nums[dq[-1]] < x:\n    dq.pop()", "Keep the deque decreasing. A smaller element before x will leave the window before x does, so it can never be the max."],
    ["if dq[0] <= i - k:\n    dq.popleft()", "The window is [i−k+1, i]. Index i−k is out."],
    ["if i >= k - 1:", "The first full window ends at index k−1."],
  ],
  take: "**Max/min of every window → monotonic deque.** Store indices (not values) so you can tell when they expire.",
  mist: ["Storing values instead of indices (you can't tell if the max has left the window).", "Popping with `<=` vs `<`: both work here, but be deliberate about it."],
},
]);
