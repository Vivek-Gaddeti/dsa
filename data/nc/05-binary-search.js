NC.add("Binary Search", [
{
  id: "binary-search", t: "Binary Search", lc: 704, d: "Easy", p: "Binary Search (classic)",
  q: "Given a sorted (ascending) array of distinct integers `nums` and a `target`, return the index of `target`, or `-1` if it isn't there. You must write an O(log n) algorithm.",
  ex: [["nums = [-1,0,3,5,9,12], target = 9", "4", ""], ["nums = [-1,0,3,5,9,12], target = 2", "-1", ""]],
  c: ["1 ≤ n ≤ 10^4", "sorted, distinct"],
  hint: "Look at the middle. If it's too small, the target can only be on the right half.",
  brute: {
    idea: "Linear scan.",
    code: R`
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        for i, x in enumerate(nums):
            if x == target:
                return i
        return -1`,
    tc: "O(n)", sc: "O(1)", bad: "Ignores the sorted order. The problem demands O(log n).",
  },
  opt: {
    idea: "Keep the search space `[lo, hi]`. Compare the middle element with the target and throw away the half that can't contain it. Each step halves the space, giving O(log n).",
    steps: ["lo, hi = 0, n − 1", "while lo ≤ hi: mid = (lo + hi) // 2", "nums[mid] == target → return mid", "nums[mid] < target → lo = mid + 1, else hi = mid − 1", "return −1"],
    viz: "binarySearch",
    code: R`
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:                  # space [lo, hi] is non-empty
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                lo = mid + 1             # target is to the right
            else:
                hi = mid - 1             # target is to the left
        return -1`,
    tc: "O(log n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.search([-1, 0, 3, 5, 9, 12], 9))
print(s.search([-1, 0, 3, 5, 9, 12], 2))`,
  out: R`
4
-1`,
  dryOn: "target = 9",
  dry: { h: ["lo", "hi", "mid", "nums[mid]", "action"], r: [[0, 5, 2, 3, "3 < 9 → lo = 3"], [3, 5, 4, 9, "found → 4"]] },
  expl: [
    ["while lo <= hi:", "`<=` because a single-element range (lo == hi) still needs checking."],
    ["mid = (lo + hi) // 2", "In Python ints don't overflow. In Java/C++ write `lo + (hi - lo) / 2`."],
    ["lo = mid + 1 / hi = mid - 1", "mid is already ruled out, so exclude it to guarantee progress."],
  ],
  take: "**Sorted + search → binary search. Get the loop invariant right:** `[lo, hi]` inclusive ↔ `while lo <= hi` ↔ `mid ± 1`.",
  mist: ["`lo = mid` with `while lo <= hi` → infinite loop.", "Off-by-one with `hi = len(nums)` (that's the half-open `[lo, hi)` style, which uses `while lo < hi`)."],
},
{
  id: "search-a-2d-matrix", t: "Search a 2D Matrix", lc: 74, d: "Medium", p: "Binary Search (flattened index)",
  q: "An `m × n` matrix has each row sorted, and the first number of each row is greater than the last number of the previous row. Return `True` if `target` is in the matrix. You must use O(log(m·n)) time.",
  ex: [["matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", "True", ""], ["same matrix, target = 13", "False", ""]],
  c: ["1 ≤ m, n ≤ 100"],
  hint: "Read row by row, the matrix is one long sorted array of length m·n. Index k maps to `(k // n, k % n)`.",
  brute: {
    idea: "Check every cell.",
    code: R`
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        return any(target in row for row in matrix)`,
    tc: "O(m·n)", sc: "O(1)",
  },
  opt: {
    idea: "Treat the matrix as a virtual sorted array of length `m·n` and binary-search it. Convert a virtual index `mid` to a cell with `row, col = divmod(mid, n)`.",
    steps: ["lo, hi = 0, m·n − 1", "mid → r, c = divmod(mid, n)", "compare matrix[r][c] with target and halve"],
    code: R`
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            r, c = divmod(mid, n)          # virtual index -> (row, col)
            val = matrix[r][c]
            if val == target:
                return True
            if val < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return False`,
    tc: "O(log(m·n))", sc: "O(1)",
  },
  run: R`
M = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
s = Solution()
print(s.searchMatrix(M, 3))
print(s.searchMatrix(M, 13))`,
  out: R`
True
False`,
  dryOn: "target = 13 (n = 4)",
  dry: { h: ["lo", "hi", "mid", "(r, c)", "val", "action"], r: [[0, 11, 5, "(1,1)", 11, "lo = 6"], [6, 11, 8, "(2,0)", 23, "hi = 7"], [6, 7, 6, "(1,2)", 16, "hi = 5"], [6, 5, "", "", "", "lo > hi → False"]] },
  expl: [["r, c = divmod(mid, n)", "`divmod(a, b)` returns `(a // b, a % b)` → row and column."]],
  alt: { idea: "Two binary searches: first find the row (the last row whose first element ≤ target), then search inside it. Same complexity." },
  take: "**A sorted 2D structure is often just a 1D sorted array in disguise.** Map indices with `divmod`.",
  mist: ["Using `divmod(mid, m)` (rows) instead of `n` (columns)."],
},
{
  id: "koko-eating-bananas", t: "Koko Eating Bananas", lc: 875, d: "Medium", p: "Binary Search on the Answer",
  q: "There are `piles` of bananas. Koko chooses an eating speed `k` (bananas/hour). Each hour she eats `k` bananas from one pile. If the pile has fewer, she eats them all and waits out the rest of that hour.\n\nReturn the **minimum** integer `k` that lets her finish all piles within `h` hours.",
  ex: [["piles = [3,6,7,11], h = 8", "4", "At speed 4: 1+2+2+3 = 8 hours."], ["piles = [30,11,23,4,20], h = 5", "30", ""], ["piles = [30,11,23,4,20], h = 6", "23", ""]],
  c: ["len(piles) ≤ h ≤ 10^9", "1 ≤ piles[i] ≤ 10^9"],
  hint: "If speed k works, every speed > k also works. The yes/no answer is **monotonic** in k, so binary search over k in `[1, max(piles)]`.",
  brute: {
    idea: "Try k = 1, 2, 3, … until the hours fit.",
    code: R`
import math

class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        k = 1
        while sum(math.ceil(p / k) for p in piles) > h:
            k += 1
        return k`,
    tc: "O(max(p) · n)", sc: "O(1)", bad: "max(p) can be 10^9.",
  },
  opt: {
    idea: "Binary search over the **answer** `k ∈ [1, max(piles)]`. For a candidate `k`, the hours needed are `sum(ceil(p / k))`.\n- If it fits in `h`: k works, but maybe a smaller one does too → `hi = k`.\n- Else: too slow → `lo = k + 1`.\n\nThis is the \"find the first True\" template.",
    steps: ["lo, hi = 1, max(piles)", "while lo < hi: mid = (lo + hi) // 2", "hours(mid) ≤ h → hi = mid  (keep mid, it might be the answer)", "else lo = mid + 1", "return lo"],
    code: R`
class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        def hours(k):
            return sum((p + k - 1) // k for p in piles)   # ceil(p / k) with ints

        lo, hi = 1, max(piles)
        while lo < hi:                  # find the FIRST k where hours(k) <= h
            mid = (lo + hi) // 2
            if hours(mid) <= h:
                hi = mid                # mid works; maybe something smaller works too
            else:
                lo = mid + 1            # too slow
        return lo`,
    tc: "O(n · log max(p))", tw: "~30 iterations × n piles.", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.minEatingSpeed([3, 6, 7, 11], 8))
print(s.minEatingSpeed([30, 11, 23, 4, 20], 5))
print(s.minEatingSpeed([30, 11, 23, 4, 20], 6))`,
  out: R`
4
30
23`,
  dryOn: "piles = [3,6,7,11], h = 8",
  dry: { h: ["lo", "hi", "mid", "hours(mid)", "action"], r: [[1, 11, 6, "1+1+2+2 = 6 ≤ 8", "hi = 6"], [1, 6, 3, "1+2+3+4 = 10 > 8", "lo = 4"], [4, 6, 5, "1+2+2+3 = 8 ≤ 8", "hi = 5"], [4, 5, 4, "1+2+2+3 = 8 ≤ 8", "hi = 4"], [4, 4, "", "", "return 4"]] },
  expl: [
    ["(p + k - 1) // k", "Integer ceiling division, avoiding float errors."],
    ["while lo < hi:  ...  hi = mid", "Half-open \"first true\" template: `hi = mid` keeps the candidate. The loop ends when lo == hi, which is the answer."],
  ],
  take: "**\"Minimum X such that condition holds\" + monotonic condition → binary search on the answer space.** Write a `feasible(x)` helper.",
  mist: ["Using `while lo <= hi` with `hi = mid` → infinite loop.", "Searching k in [0, …] and dividing by zero."],
},
{
  id: "find-minimum-in-rotated-sorted-array", t: "Find Minimum in Rotated Sorted Array", lc: 153, d: "Medium", p: "Binary Search (rotated)",
  q: "A sorted array of **unique** numbers was rotated between 1 and n times (e.g. `[0,1,2,4,5,6,7]` → `[4,5,6,7,0,1,2]`). Return the minimum element in O(log n).",
  ex: [["nums = [3,4,5,1,2]", "1", ""], ["nums = [4,5,6,7,0,1,2]", "0", ""], ["nums = [11,13,15,17]", "11", "Rotated n times = not rotated."]],
  c: ["1 ≤ n ≤ 5000", "unique values"],
  hint: "Compare `nums[mid]` with `nums[hi]`. If `nums[mid] > nums[hi]`, the drop (the minimum) must be to the right of mid.",
  brute: { idea: "`min(nums)`.", code: R`
class Solution:
    def findMin(self, nums: list[int]) -> int:
        return min(nums)`, tc: "O(n)", sc: "O(1)" },
  opt: {
    idea: "The minimum is the only point where the order \"breaks\".\n- If `nums[mid] > nums[hi]`: the break is in `(mid, hi]` → `lo = mid + 1`.\n- Else `nums[mid] ≤ nums[hi]`: `[mid, hi]` is sorted, so the minimum is at `mid` or to its left → `hi = mid`.\n\nLoop until `lo == hi`.",
    steps: ["lo, hi = 0, n − 1", "while lo < hi: mid = (lo + hi) // 2", "nums[mid] > nums[hi] → lo = mid + 1", "else → hi = mid", "return nums[lo]"],
    code: R`
class Solution:
    def findMin(self, nums: list[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1        # min is strictly right of mid
            else:
                hi = mid            # mid could be the min
        return nums[lo]`,
    tc: "O(log n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.findMin([3, 4, 5, 1, 2]))
print(s.findMin([4, 5, 6, 7, 0, 1, 2]))
print(s.findMin([11, 13, 15, 17]))`,
  out: R`
1
0
11`,
  dryOn: "[4,5,6,7,0,1,2]",
  dry: { h: ["lo", "hi", "mid", "nums[mid] vs nums[hi]", "action"], r: [[0, 6, 3, "7 > 2", "lo = 4"], [4, 6, 5, "1 ≤ 2", "hi = 5"], [4, 5, 4, "0 ≤ 1", "hi = 4"], [4, 4, "", "", "return 0"]] },
  expl: [["if nums[mid] > nums[hi]:", "Comparing with `hi` (not `lo`) handles the not-rotated case cleanly."]],
  take: "**Rotated sorted array → one half is always sorted.** Compare mid with an end to tell which half has the break.",
  mist: ["Comparing with nums[lo]: it fails on unrotated arrays unless handled separately."],
},
{
  id: "search-in-rotated-sorted-array", t: "Search in Rotated Sorted Array", lc: 33, d: "Medium", p: "Binary Search (rotated)",
  q: "Given a rotated sorted array `nums` of **distinct** values and a `target`, return its index or `-1`. Must be O(log n).",
  ex: [["nums = [4,5,6,7,0,1,2], target = 0", "4", ""], ["nums = [4,5,6,7,0,1,2], target = 3", "-1", ""], ["nums = [1], target = 0", "-1", ""]],
  c: ["1 ≤ n ≤ 5000"],
  hint: "At any mid, at least one half (`[lo, mid]` or `[mid, hi]`) is sorted normally. Check whether the target lies inside that sorted half.",
  brute: { idea: "Linear search.", code: R`
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        return nums.index(target) if target in nums else -1`, tc: "O(n)", sc: "O(1)" },
  opt: {
    idea: "Standard binary search plus one extra decision:\n1. If `nums[lo] ≤ nums[mid]`, the **left half is sorted**. If `nums[lo] ≤ target < nums[mid]`, search left; otherwise search right.\n2. Else the **right half is sorted**. If `nums[mid] < target ≤ nums[hi]`, search right; otherwise search left.",
    steps: ["mid = (lo + hi) // 2; if nums[mid] == target → mid", "left sorted (nums[lo] ≤ nums[mid]): target in [nums[lo], nums[mid]) ? hi = mid − 1 : lo = mid + 1", "right sorted: target in (nums[mid], nums[hi]] ? lo = mid + 1 : hi = mid − 1"],
    code: R`
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:                 # left half [lo..mid] is sorted
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:                                     # right half [mid..hi] is sorted
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1`,
    tc: "O(log n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.search([4, 5, 6, 7, 0, 1, 2], 0))
print(s.search([4, 5, 6, 7, 0, 1, 2], 3))
print(s.search([1], 0))`,
  out: R`
4
-1
-1`,
  dryOn: "target = 0",
  dry: { h: ["lo", "hi", "mid", "sorted half", "target inside?", "action"], r: [[0, 6, 3, "left [4..7]", "no", "lo = 4"], [4, 6, 5, "left [0..1]", "0 ≤ 0 < 1 yes", "hi = 4"], [4, 4, 4, "", "nums[4] = 0", "return 4"]] },
  expl: [
    ["if nums[lo] <= nums[mid]:", "`<=` matters when lo == mid (two elements left)."],
    ["nums[lo] <= target < nums[mid]", "Python chained comparison: a range check in one expression."],
  ],
  take: "**In a rotated array, identify the sorted half first, then ask whether the target is in it.**",
  mist: ["Using `<` instead of `<=` in `nums[lo] <= nums[mid]` (breaks on 2-element ranges)."],
},
{
  id: "time-based-key-value-store", t: "Time Based Key-Value Store", lc: 981, d: "Medium", p: "Binary Search (on timestamps)",
  q: "Design a store with:\n- `set(key, value, timestamp)`: store a value at a time.\n- `get(key, timestamp)`: return the value with the **largest timestamp ≤ timestamp**, or `\"\"` if there's none.\n\nTimestamps for `set` are strictly increasing.",
  ex: [["set(\"foo\",\"bar\",1), get(\"foo\",1), get(\"foo\",3), set(\"foo\",\"bar2\",4), get(\"foo\",4), get(\"foo\",5)", "\"bar\", \"bar\", \"bar2\", \"bar2\"", ""]],
  c: ["timestamps are strictly increasing per set call", "≤ 2·10^5 calls"],
  hint: "Per key, the (timestamp, value) list is already sorted, because timestamps only increase. \"Largest ≤ t\" is a binary search.",
  brute: { idea: "Scan the key's list backwards until a timestamp ≤ t.", code: R`
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)
    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))
    def get(self, key: str, timestamp: int) -> str:
        for t, v in reversed(self.store[key]):
            if t <= timestamp:
                return v
        return ""`, tc: "get O(n)", sc: "O(n)" },
  opt: {
    idea: "`store[key]` = a list of `(timestamp, value)` appended in increasing time order. For `get`, binary search for the **last** timestamp ≤ t.\n\n`bisect_right(times, t)` returns the insertion point *after* any equal timestamps. The element just before it is the answer.",
    steps: ["set: store[key].append((t, v))", "get: binary search the rightmost index with time ≤ t", "return value or \"\""],
    code: R`
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)          # key -> [(timestamp, value), ...] sorted

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        arr = self.store.get(key, [])
        lo, hi, res = 0, len(arr) - 1, ""
        while lo <= hi:
            mid = (lo + hi) // 2
            if arr[mid][0] <= timestamp:
                res = arr[mid][1]               # candidate; look for a later one
                lo = mid + 1
            else:
                hi = mid - 1
        return res`,
    tc: "set O(1), get O(log n)", sc: "O(total sets)",
  },
  run: R`
tm = TimeMap()
tm.set("foo", "bar", 1)
print(tm.get("foo", 1))
print(tm.get("foo", 3))
tm.set("foo", "bar2", 4)
print(tm.get("foo", 4))
print(tm.get("foo", 5))
print(repr(tm.get("foo", 0)))`,
  out: R`
bar
bar
bar2
bar2
''`,
  dryOn: "get(\"foo\", 3) with arr = [(1,\"bar\"), (4,\"bar2\")]",
  dry: ["mid = 0: time 1 ≤ 3 → res = \"bar\", lo = 1", "mid = 1: time 4 > 3 → hi = 0", "loop ends → \"bar\""],
  expl: [
    ["res = arr[mid][1]\nlo = mid + 1", "\"Last true\" template: remember the candidate, then keep searching right for a later one."],
    ["self.store.get(key, [])", "`.get` avoids creating empty lists for missing keys on reads."],
  ],
  alt: { idea: "Using the bisect module:", code: R`
import bisect
# inside get():
i = bisect.bisect_right(arr, (timestamp, chr(127)))   # chr(127) sorts after any value
return arr[i - 1][1] if i else ""` },
  take: "**\"Latest value at or before time t\" → keep sorted (time, value) lists and binary search (last ≤ t).**",
  mist: ["Returning the first match instead of the latest ≤ t."],
},
{
  id: "median-of-two-sorted-arrays", t: "Median of Two Sorted Arrays", lc: 4, d: "Hard", p: "Binary Search (partition)",
  q: "Given two sorted arrays `nums1` (size m) and `nums2` (size n), return the **median** of the two arrays combined. The overall run time must be O(log(m+n)).",
  ex: [["nums1 = [1,3], nums2 = [2]", "2.0", "merged = [1,2,3]"], ["nums1 = [1,2], nums2 = [3,4]", "2.5", "merged = [1,2,3,4] → (2+3)/2"]],
  c: ["0 ≤ m, n ≤ 1000", "m + n ≥ 1"],
  hint: "The median splits the combined array into a left half and a right half. Choose how many elements of the **smaller** array go to the left half (binary search!), and the rest is forced.",
  brute: {
    idea: "Merge the two sorted arrays (like merge sort), then take the middle.",
    code: R`
class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        merged, i, j = [], 0, 0
        while i < len(nums1) and j < len(nums2):
            if nums1[i] <= nums2[j]:
                merged.append(nums1[i]); i += 1
            else:
                merged.append(nums2[j]); j += 1
        merged += nums1[i:] + nums2[j:]
        n = len(merged)
        if n % 2:
            return float(merged[n // 2])
        return (merged[n // 2 - 1] + merged[n // 2]) / 2`,
    tc: "O(m + n)", sc: "O(m + n)", bad: "Doesn't meet O(log(m+n)), though it's a good starting answer.",
  },
  opt: {
    idea: "Let A be the smaller array. We want a **partition**: take `i` elements from A and `j = half − i` from B for the left half, where `half = (m + n + 1) // 2`.\n\nThe partition is correct when every element on the left is ≤ every element on the right:\n`Aleft ≤ Bright` and `Bleft ≤ Aright` (where Aleft = A[i−1], Aright = A[i], etc.; use ±∞ past the ends).\n\n- If `Aleft > Bright`: we took too many from A → move left (`hi = i − 1`).\n- If `Bleft > Aright`: too few from A → `lo = i + 1`.\n\nOnce it's correct: if the total is odd → `max(Aleft, Bleft)`; if even → `(max(Aleft, Bleft) + min(Aright, Bright)) / 2`.",
    steps: ["Make A the shorter array. half = (m + n + 1) // 2", "Binary search i in [0, m]; j = half − i", "Aleft = A[i−1] or −inf, Aright = A[i] or +inf (same for B)", "Aleft ≤ Bright and Bleft ≤ Aright → found", "Aleft > Bright → hi = i − 1, else lo = i + 1"],
    code: R`
class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        A, B = nums1, nums2
        if len(A) > len(B):
            A, B = B, A                       # binary search the shorter one
        m, n = len(A), len(B)
        half = (m + n + 1) // 2
        lo, hi = 0, m
        INF = float("inf")
        while lo <= hi:
            i = (lo + hi) // 2                # elements taken from A
            j = half - i                      # elements taken from B
            a_left = A[i - 1] if i > 0 else -INF
            a_right = A[i] if i < m else INF
            b_left = B[j - 1] if j > 0 else -INF
            b_right = B[j] if j < n else INF
            if a_left <= b_right and b_left <= a_right:     # correct partition
                if (m + n) % 2:
                    return float(max(a_left, b_left))
                return (max(a_left, b_left) + min(a_right, b_right)) / 2
            if a_left > b_right:
                hi = i - 1                    # took too many from A
            else:
                lo = i + 1                    # took too few from A
        return 0.0`,
    tc: "O(log(min(m, n)))", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.findMedianSortedArrays([1, 3], [2]))
print(s.findMedianSortedArrays([1, 2], [3, 4]))
print(s.findMedianSortedArrays([], [5]))`,
  out: R`
2.0
2.5
5.0`,
  dryOn: "A = [1,2], B = [3,4]; half = 2",
  dry: { h: ["lo", "hi", "i", "j", "Aleft | Aright", "Bleft | Bright", "check"], r: [[0, 2, 1, 1, "1 | 2", "3 | 4", "Bleft 3 > Aright 2 → lo = 2"], [2, 2, 2, 0, "2 | ∞", "−∞ | 3", "✓ even → (max(2,−∞) + min(∞,3)) / 2 = **2.5**"]] },
  expl: [
    ["if len(A) > len(B):\n    A, B = B, A", "Searching the shorter array keeps j in a valid range and gives O(log(min))."],
    ["half = (m + n + 1) // 2", "The left half gets the extra element when the total is odd, so the median is max(left side)."],
    ["-INF / INF", "Sentinels for an empty side of the partition, so there's no special-casing."],
  ],
  take: "**Binary search doesn't have to be over values. Here it searches over *partition positions*.** Treat it as \"find the split where left ≤ right\".",
  mist: ["Searching the longer array (j can become negative).", "Forgetting the sentinel edge cases when i = 0 or i = m."],
},
]);
