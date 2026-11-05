/* DSA Patterns, part 1: arrays, strings, stacks, searching, linked lists */
PATTERNS.push(
{
  id: "hashing", group: "Arrays & Strings", title: "Hashing: Seen / Count / Group",
  sub: "Trade memory for speed: remember what you've seen in a dict or set so each lookup is O(1).",
  tags: ["O(n) time", "O(n) space"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Find a pair / complement\" in an **unsorted** array", "\"Has duplicates?\" / \"first unique\" / \"how many times\"", "\"Group items that are equivalent\" (anagrams, same pattern)", "You're about to write a nested loop just to *search* for something"]],
    ["h", "Template"],
    ["code", R`
def solve(nums, target):
    seen = {}                          # value -> index (or count, or list)
    for i, x in enumerate(nums):
        need = target - x              # what would complete the answer?
        if need in seen:               # O(1) lookup instead of an inner loop
            return [seen[need], i]
        seen[x] = i                    # record AFTER checking (don't pair with itself)
    return []

print(solve([2, 7, 11, 15], 9))`, "[0, 1]"],
    ["diagram", "hash", [[["2 → 0", 2], ["7 → 1", 2], ["11 → 2", 1]], 3], "The dict stores value → index. Checking `9 − 7 = 2` is one bucket lookup."],
    ["h", "Worked examples"],
    ["ex", { t: "Contains Duplicate", d: "Easy", lc: 217, open: true, q: "Does any value appear twice?", idea: "A set remembers seen values. Hitting one again means a duplicate.", code: R`
def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False

print(contains_duplicate([1, 2, 3, 1]), contains_duplicate([1, 2, 3]))`, out: "True False", cx: "O(n) time, O(n) space" }],
    ["ex", { t: "First Unique Character", d: "Easy", lc: 387, q: "Return the index of the first non-repeating character, or −1.", idea: "Pass 1: count every char. Pass 2: the first char with count 1.", code: R`
from collections import Counter

def first_uniq_char(s):
    count = Counter(s)
    for i, c in enumerate(s):
        if count[c] == 1:
            return i
    return -1

print(first_uniq_char("leetcode"), first_uniq_char("loveleetcode"), first_uniq_char("aabb"))`, out: "0 2 -1", cx: "O(n) time, O(1) space (26 letters)" }],
    ["ex", { t: "Group Anagrams", d: "Medium", lc: 49, q: "Group the words that are anagrams of each other.", idea: "Anagrams share a canonical key (the sorted letters), so use a dict of key → list.", code: R`
from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))`, out: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]", cx: "O(n · k log k)" }],
    ["ex", { t: "Isomorphic Strings", d: "Easy", lc: 205, q: "Can the characters of s be replaced to get t (a one-to-one mapping)?", idea: "Two dicts enforce the mapping in both directions: s→t and t→s.", code: R`
def is_isomorphic(s, t):
    st, ts = {}, {}
    for a, b in zip(s, t):
        if st.get(a, b) != b or ts.get(b, a) != a:
            return False
        st[a], ts[b] = b, a
    return True

print(is_isomorphic("egg", "add"), is_isomorphic("foo", "bar"), is_isomorphic("badc", "baba"))`, out: "True False False", cx: "O(n)" }],
    ["ex", { t: "Longest Consecutive Sequence", d: "Medium", lc: 128, q: "Length of the longest run of consecutive integers (unsorted input, O(n)).", idea: "A set gives O(1) membership. Only start counting at a run's beginning (x − 1 not present).", code: R`
def longest_consecutive(nums):
    s, best = set(nums), 0
    for x in s:
        if x - 1 not in s:
            n = 1
            while x + n in s:
                n += 1
            best = max(best, n)
    return best

print(longest_consecutive([100, 4, 200, 1, 3, 2]))`, out: "4", cx: "O(n)" }],
    ["danger", "Using a **list** for `seen` (`x in list` is O(n)), so the whole thing becomes O(n²). Using a mutable list as a dict key: convert it to a tuple."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Contains Duplicate](neetcode.html#p/contains-duplicate)", "[Valid Anagram](neetcode.html#p/valid-anagram)", "[Two Sum](neetcode.html#p/two-sum)", "[Group Anagrams](neetcode.html#p/group-anagrams)", "[Top K Frequent Elements](neetcode.html#p/top-k-frequent-elements)", "[Longest Consecutive Sequence](neetcode.html#p/longest-consecutive-sequence)"]],
  ],
},
{
  id: "prefix-sum", group: "Arrays & Strings", title: "Prefix Sum (+ Hash Map)",
  sub: "Precompute running totals so any range sum is one subtraction. Combine it with a hash map to count subarrays.",
  tags: ["O(n) build", "O(1) per query"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Many **range sum** queries on a static array", "\"Number of subarrays with sum = k\" (works with negative numbers, unlike sliding window)", "\"Product / sum of everything except i\" (prefix + suffix)", "2-D: sum of a sub-rectangle"]],
    ["viz", "prefixSum"],
    ["h", "Template"],
    ["code", R`
from itertools import accumulate

nums = [3, 1, 4, 1, 5, 9, 2]
prefix = [0] + list(accumulate(nums))    # prefix[i] = sum(nums[:i])

def range_sum(i, j):                     # sum(nums[i..j]) inclusive
    return prefix[j + 1] - prefix[i]

print(prefix)
print(range_sum(2, 5), sum(nums[2:6]))`, "[0, 3, 4, 8, 9, 14, 23, 25]\n19 19"],
    ["p", "**The key identity for counting:** `sum(nums[i..j]) = prefix[j+1] − prefix[i]`. A subarray ending at j has sum k ⟺ some earlier prefix equals `prefix[j+1] − k`. Store counts of the prefixes seen so far in a hash map."],
    ["h", "Worked examples"],
    ["ex", { t: "Subarray Sum Equals K", d: "Medium", lc: 560, open: true, q: "Count the contiguous subarrays whose sum is k (values can be negative).", idea: "Running sum `cur`. The number of subarrays ending here with sum k = how many earlier prefixes equal `cur − k`.", code: R`
from collections import defaultdict

def subarray_sum(nums, k):
    count = defaultdict(int)
    count[0] = 1                     # empty prefix
    cur = ans = 0
    for x in nums:
        cur += x
        ans += count[cur - k]        # earlier prefixes that make sum k
        count[cur] += 1
    return ans

print(subarray_sum([1, 1, 1], 2), subarray_sum([1, 2, 3], 3), subarray_sum([1, -1, 0], 0))`, out: "2 2 3", cx: "O(n) time, O(n) space" }],
    ["ex", { t: "Range Sum Query – Immutable", d: "Easy", lc: 303, q: "Answer many sumRange(i, j) queries quickly.", idea: "Build the prefix array once, then each query is one subtraction.", code: R`
class NumArray:
    def __init__(self, nums):
        self.p = [0]
        for x in nums:
            self.p.append(self.p[-1] + x)
    def sumRange(self, i, j):
        return self.p[j + 1] - self.p[i]

na = NumArray([-2, 0, 3, -5, 2, -1])
print(na.sumRange(0, 2), na.sumRange(2, 5), na.sumRange(0, 5))`, out: "1 -1 -3", cx: "O(n) build, O(1) query" }],
    ["ex", { t: "Find Pivot Index", d: "Easy", lc: 724, q: "Find the index where the left sum equals the right sum.", idea: "right = total − left − nums[i]. Keep a running left sum.", code: R`
def pivot_index(nums):
    total, left = sum(nums), 0
    for i, x in enumerate(nums):
        if left == total - left - x:
            return i
        left += x
    return -1

print(pivot_index([1, 7, 3, 6, 5, 6]), pivot_index([1, 2, 3]))`, out: "3 -1", cx: "O(n)" }],
    ["ex", { t: "Continuous Subarray Sum (multiple of k)", d: "Medium", lc: 523, q: "Is there a subarray of length ≥ 2 whose sum is a multiple of k?", idea: "If two prefixes have the same value mod k, the sum between them is divisible by k. Store the first index of each remainder.", code: R`
def check_subarray_sum(nums, k):
    first = {0: -1}                   # remainder -> earliest index
    cur = 0
    for i, x in enumerate(nums):
        cur = (cur + x) % k
        if cur in first:
            if i - first[cur] >= 2:
                return True
        else:
            first[cur] = i
    return False

print(check_subarray_sum([23, 2, 4, 6, 7], 6), check_subarray_sum([23, 2, 6, 4, 7], 13))`, out: "True False", cx: "O(n)" }],
    ["ex", { t: "2-D Prefix Sum (Range Sum Query 2D)", d: "Medium", lc: 304, q: "Sum of any sub-rectangle in O(1).", idea: "P[r+1][c+1] = cell + P[r][c+1] + P[r+1][c] − P[r][c]. A query uses inclusion–exclusion.", code: R`
def build(m):
    R, C = len(m), len(m[0])
    P = [[0] * (C + 1) for _ in range(R + 1)]
    for r in range(R):
        for c in range(C):
            P[r + 1][c + 1] = m[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c]
    return P

def region(P, r1, c1, r2, c2):
    return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]

M = [[3, 0, 1, 4], [5, 6, 3, 2], [1, 2, 0, 1]]
P = build(M)
print(region(P, 1, 1, 2, 2), region(P, 0, 0, 2, 3))`, out: "11 28", cx: "O(R·C) build, O(1) query" }],
    ["warn", "Sliding window does **not** work for \"sum = k\" when negative numbers exist (shrinking might *increase* the sum). Use prefix sum + hash map."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Product of Array Except Self](neetcode.html#p/product-of-array-except-self)", "[Trapping Rain Water](neetcode.html#p/trapping-rain-water) (prefix max)"]],
  ],
},
{
  id: "two-pointers", group: "Arrays & Strings", title: "Two Pointers",
  sub: "Two indices moving through the data with a rule. They replace a nested loop with one pass.",
  tags: ["O(n) time", "O(1) space"],
  blocks: [
    ["h", "Three flavours"],
    ["table", ["Flavour", "Setup", "Use for"], [
      ["**Opposite ends**", "l = 0, r = n − 1, move inward", "sorted pair sums, palindromes, container/water"],
      ["**Same direction (read/write)**", "slow = write position, fast = read position", "remove duplicates, move zeros, partition in place"],
      ["**Two sequences**", "i in A, j in B", "merge sorted arrays, subsequence check, intersections"],
    ]],
    ["h", "Recognize it when…"],
    ["list", ["The input is **sorted** (or you can sort it) and you look for pairs/triplets", "You must modify an array **in place** with O(1) space", "Comparing from both ends (palindromes, reversing)", "Merging or comparing two sequences"]],
    ["viz", "twoPointers"],
    ["h", "Templates"],
    ["code", R`
def opposite_ends(a, target):          # a is sorted
    l, r = 0, len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == target: return (l, r)
        if s < target: l += 1          # need bigger
        else: r -= 1                   # need smaller
    return None

def read_write(a):                     # remove duplicates in a sorted array, in place
    w = 0                              # next write position
    for r in range(len(a)):
        if r == 0 or a[r] != a[r - 1]:
            a[w] = a[r]
            w += 1
    return w                           # new length

arr = [1, 1, 2, 3, 3, 3, 4]
k = read_write(arr)
print(opposite_ends([1, 2, 4, 6, 8], 10), arr[:k])`, "(1, 4) [1, 2, 3, 4]"],
    ["h", "Worked examples"],
    ["ex", { t: "Valid Palindrome", d: "Easy", lc: 125, open: true, q: "Is the string a palindrome considering only letters and digits?", idea: "Opposite ends. Skip non-alphanumerics and compare lowercase characters.", code: R`
def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l, r = l + 1, r - 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"), is_palindrome("race a car"))`, out: "True False", cx: "O(n), O(1)" }],
    ["ex", { t: "Move Zeroes", d: "Easy", lc: 283, q: "Move all 0s to the end, keeping the order of the others, in place.", idea: "Read/write pointers: copy non-zeros forward with the write pointer, then fill the rest with zeros (or swap).", code: R`
def move_zeroes(nums):
    w = 0
    for r in range(len(nums)):
        if nums[r] != 0:
            nums[w], nums[r] = nums[r], nums[w]   # swap keeps it one pass
            w += 1
    return nums

print(move_zeroes([0, 1, 0, 3, 12]))`, out: "[1, 3, 12, 0, 0]", cx: "O(n), O(1)" }],
    ["ex", { t: "3Sum", d: "Medium", lc: 15, q: "All unique triplets summing to 0.", idea: "Sort. Fix i, then opposite-ends two pointers on the rest. Skip duplicates.", code: R`
def three_sum(nums):
    nums.sort(); res = []
    for i in range(len(nums)):
        if i and nums[i] == nums[i - 1]: continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]]); l += 1
                while l < r and nums[l] == nums[l - 1]: l += 1
    return res

print(three_sum([-1, 0, 1, 2, -1, -4]))`, out: "[[-1, -1, 2], [-1, 0, 1]]", cx: "O(n²)" }],
    ["ex", { t: "Merge Sorted Array", d: "Easy", lc: 88, q: "Merge nums2 into nums1 (which has space at the end), in place.", idea: "Fill from the **back** with three pointers so nothing gets overwritten.", code: R`
def merge(nums1, m, nums2, n):
    i, j, w = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[w] = nums1[i]; i -= 1
        else:
            nums1[w] = nums2[j]; j -= 1
        w -= 1
    return nums1

print(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3))`, out: "[1, 2, 2, 3, 5, 6]", cx: "O(m + n), O(1)" }],
    ["ex", { t: "Is Subsequence", d: "Easy", lc: 392, q: "Is s a subsequence of t?", idea: "Two sequences: advance i in s only on a match. Always advance j in t.", code: R`
def is_subsequence(s, t):
    i = 0
    for ch in t:
        if i < len(s) and s[i] == ch:
            i += 1
    return i == len(s)

print(is_subsequence("abc", "ahbgdc"), is_subsequence("axc", "ahbgdc"))`, out: "True False", cx: "O(len t)" }],
    ["danger", "Using opposite-end pointers on an **unsorted** array for pair sums. The \"move l when the sum is too small\" logic only works if the array is sorted."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Valid Palindrome](neetcode.html#p/valid-palindrome)", "[Two Sum II](neetcode.html#p/two-sum-ii-input-array-is-sorted)", "[3Sum](neetcode.html#p/3sum)", "[Container With Most Water](neetcode.html#p/container-with-most-water)", "[Trapping Rain Water](neetcode.html#p/trapping-rain-water)"]],
  ],
},
{
  id: "sliding-window-fixed", group: "Arrays & Strings", title: "Sliding Window: Fixed Size",
  sub: "A window of exactly k elements slides one step at a time. Update in O(1): add the new element, remove the old one.",
  tags: ["O(n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"…of every subarray / substring **of length k**\"", "\"max/min/average of k consecutive\"", "\"does some window of size len(p) match p\" (anagram / permutation in string)"]],
    ["viz", "fixedWindow"],
    ["h", "Template"],
    ["code", R`
def fixed_window(nums, k):
    window = sum(nums[:k])          # first window
    best = window
    for r in range(k, len(nums)):
        window += nums[r] - nums[r - k]   # add entering, remove leaving
        best = max(best, window)
    return best

print(fixed_window([2, 1, 5, 1, 3, 2], 3))`, "9"],
    ["h", "Worked examples"],
    ["ex", { t: "Maximum Average Subarray I", d: "Easy", lc: 643, open: true, q: "Max average of any k consecutive elements.", idea: "Max sum of a fixed window, divided by k.", code: R`
def find_max_average(nums, k):
    s = best = sum(nums[:k])
    for r in range(k, len(nums)):
        s += nums[r] - nums[r - k]
        best = max(best, s)
    return best / k

print(find_max_average([1, 12, -5, -6, 50, 3], 4))`, out: "12.75", cx: "O(n)" }],
    ["ex", { t: "Find All Anagrams in a String", d: "Medium", lc: 438, q: "All start indices where a window of s is an anagram of p.", idea: "A window of size len(p) with 26-count arrays. Compare after each slide.", code: R`
def find_anagrams(s, p):
    k, res = len(p), []
    if k > len(s): return res
    need, win = [0] * 26, [0] * 26
    for c in p: need[ord(c) - 97] += 1
    for r, c in enumerate(s):
        win[ord(c) - 97] += 1
        if r >= k:
            win[ord(s[r - k]) - 97] -= 1
        if r >= k - 1 and win == need:
            res.append(r - k + 1)
    return res

print(find_anagrams("cbaebabacd", "abc"))`, out: "[0, 6]", cx: "O(26 · n)" }],
    ["ex", { t: "Contains Duplicate II", d: "Easy", lc: 219, q: "Are there equal values whose indices differ by at most k?", idea: "Keep a set holding the last k elements (a fixed window of size k).", code: R`
def contains_nearby_duplicate(nums, k):
    window = set()
    for i, x in enumerate(nums):
        if x in window:
            return True
        window.add(x)
        if len(window) > k:
            window.remove(nums[i - k])
    return False

print(contains_nearby_duplicate([1, 2, 3, 1], 3), contains_nearby_duplicate([1, 2, 3, 1, 2, 3], 2))`, out: "True False", cx: "O(n), O(k)" }],
    ["ex", { t: "Maximum Vowels in a Substring of Length k", d: "Medium", lc: 1456, q: "Max vowel count in any window of length k.", idea: "Count vowels entering and leaving.", code: R`
def max_vowels(s, k):
    V = set("aeiou")
    cur = sum(c in V for c in s[:k])
    best = cur
    for r in range(k, len(s)):
        cur += (s[r] in V) - (s[r - k] in V)
        best = max(best, cur)
    return best

print(max_vowels("abciiidef", 3), max_vowels("leetcode", 3))`, out: "3 2", cx: "O(n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Permutation in String](neetcode.html#p/permutation-in-string)", "[Sliding Window Maximum](neetcode.html#p/sliding-window-maximum)"]],
  ],
},
{
  id: "sliding-window-variable", group: "Arrays & Strings", title: "Sliding Window: Variable Size",
  sub: "Expand the right edge. Shrink the left edge only while the window breaks a rule. Each element enters and leaves once, so it's O(n).",
  tags: ["O(n)", "the most common string pattern"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"**Longest / shortest** substring or subarray such that…\"", "The condition can be **maintained incrementally** (counts, sums of non-negative numbers, distinct count)", "Shrinking the window can only make it \"more valid\" (monotonic)"]],
    ["viz", "slidingWindow"],
    ["h", "Two templates"],
    ["code", R`
# LONGEST valid window: expand; shrink WHILE invalid; record after
def longest(s):
    seen, l, best = {}, 0, 0
    for r, c in enumerate(s):
        seen[c] = seen.get(c, 0) + 1
        while seen[c] > 1:                  # invalid -> shrink
            seen[s[l]] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best

# SHORTEST valid window: expand; WHILE valid -> record, then shrink
def shortest(nums, target):                 # min length with sum >= target
    l, total, best = 0, 0, float("inf")
    for r, x in enumerate(nums):
        total += x
        while total >= target:
            best = min(best, r - l + 1)
            total -= nums[l]
            l += 1
    return 0 if best == float("inf") else best

print(longest("abcabcbb"), shortest([2, 3, 1, 2, 4, 3], 7))`, "3 2"],
    ["h", "Worked examples"],
    ["ex", { t: "Minimum Size Subarray Sum", d: "Medium", lc: 209, open: true, q: "Smallest length of a subarray with sum ≥ target (positive numbers).", idea: "Shortest template: while the window is valid, record it and shrink.", code: R`
def min_subarray_len(target, nums):
    l = total = 0
    best = float("inf")
    for r, x in enumerate(nums):
        total += x
        while total >= target:
            best = min(best, r - l + 1)
            total -= nums[l]; l += 1
    return 0 if best == float("inf") else best

print(min_subarray_len(7, [2, 3, 1, 2, 4, 3]), min_subarray_len(11, [1, 1, 1]))`, out: "2 0", cx: "O(n)" }],
    ["ex", { t: "Longest Substring with At Most K Distinct Characters", d: "Medium", lc: 340, q: "Longest substring containing ≤ k distinct chars.", idea: "Keep a count map. While there are more than k distinct keys, shrink and delete keys whose count reaches 0.", code: R`
def longest_k_distinct(s, k):
    count, l, best = {}, 0, 0
    for r, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        while len(count) > k:
            count[s[l]] -= 1
            if count[s[l]] == 0:
                del count[s[l]]
            l += 1
        best = max(best, r - l + 1)
    return best

print(longest_k_distinct("eceba", 2), longest_k_distinct("aa", 1))`, out: "3 2", cx: "O(n)" }],
    ["ex", { t: "Max Consecutive Ones III", d: "Medium", lc: 1004, q: "Longest run of 1s if you may flip at most k zeros.", idea: "The window is valid while it holds ≤ k zeros.", code: R`
def longest_ones(nums, k):
    l = zeros = best = 0
    for r, x in enumerate(nums):
        zeros += x == 0
        while zeros > k:
            zeros -= nums[l] == 0
            l += 1
        best = max(best, r - l + 1)
    return best

print(longest_ones([1,1,1,0,0,0,1,1,1,1,0], 2))`, out: "6", cx: "O(n)" }],
    ["ex", { t: "Fruit Into Baskets", d: "Medium", lc: 904, q: "Longest subarray with at most 2 distinct values.", idea: "It's the \"at most K distinct\" template with K = 2.", code: R`
from collections import Counter

def total_fruit(fruits):
    basket, l, best = Counter(), 0, 0
    for r, f in enumerate(fruits):
        basket[f] += 1
        while len(basket) > 2:
            basket[fruits[l]] -= 1
            if not basket[fruits[l]]:
                del basket[fruits[l]]
            l += 1
        best = max(best, r - l + 1)
    return best

print(total_fruit([1, 2, 3, 2, 2]), total_fruit([3,3,3,1,2,1,1,2,3,3,4]))`, out: "4 5", cx: "O(n)" }],
    ["ex", { t: "Longest Repeating Character Replacement", d: "Medium", lc: 424, q: "Longest window that can become one letter with ≤ k replacements.", idea: "Valid while `len − maxCount ≤ k`.", code: R`
def character_replacement(s, k):
    count, l, maxf, best = {}, 0, 0, 0
    for r, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        maxf = max(maxf, count[c])
        if r - l + 1 - maxf > k:
            count[s[l]] -= 1; l += 1
        best = max(best, r - l + 1)
    return best

print(character_replacement("AABABBA", 1))`, out: "4", cx: "O(n)" }],
    ["danger", "Using a sliding window when the array has **negative numbers** and the condition is a sum. Shrinking no longer moves the sum predictably, so use prefix sums instead."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Best Time to Buy and Sell Stock](neetcode.html#p/best-time-to-buy-and-sell-stock)", "[Longest Substring Without Repeating](neetcode.html#p/longest-substring-without-repeating-characters)", "[Longest Repeating Character Replacement](neetcode.html#p/longest-repeating-character-replacement)", "[Minimum Window Substring](neetcode.html#p/minimum-window-substring)"]],
  ],
},
{
  id: "kadane", group: "Arrays & Strings", title: "Kadane's Algorithm (best subarray ending here)",
  sub: "At each index, either extend the best subarray ending at the previous index or start fresh.",
  tags: ["O(n)", "O(1)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Maximum (or minimum) **sum/product of a contiguous subarray**", "\"Best profit\" with one buy/sell", "Circular subarray variants"]],
    ["viz", "kadane"],
    ["h", "Template"],
    ["code", R`
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)        # extend or restart
        best = max(best, cur)
    return best

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`, "6"],
    ["h", "Worked examples"],
    ["ex", { t: "Maximum Sum Circular Subarray", d: "Medium", lc: 918, open: true, q: "The array is circular. Find the max subarray sum.", idea: "The answer either doesn't wrap (normal Kadane) or wraps = total − (minimum subarray). If every number is negative, return the normal max.", code: R`
def max_subarray_circular(nums):
    cur_max = cur_min = 0
    best_max, best_min, total = nums[0], nums[0], 0
    for x in nums:
        cur_max = max(x, cur_max + x); best_max = max(best_max, cur_max)
        cur_min = min(x, cur_min + x); best_min = min(best_min, cur_min)
        total += x
    return best_max if best_max < 0 else max(best_max, total - best_min)

print(max_subarray_circular([5, -3, 5]), max_subarray_circular([-3, -2, -3]))`, out: "10 -2", cx: "O(n)" }],
    ["ex", { t: "Maximum Product Subarray", d: "Medium", lc: 152, q: "Max product of a contiguous subarray.", idea: "Track both the max and the min, because a negative number swaps them.", code: R`
def max_product(nums):
    res = hi = lo = nums[0]
    for x in nums[1:]:
        hi, lo = max(x, hi * x, lo * x), min(x, hi * x, lo * x)
        res = max(res, hi)
    return res

print(max_product([2, 3, -2, 4]), max_product([-2, 3, -4]))`, out: "6 24", cx: "O(n)" }],
    ["ex", { t: "Best Time to Buy and Sell Stock", d: "Easy", lc: 121, q: "Max profit from one buy then one later sell.", idea: "Kadane on the daily price differences, or keep the running minimum.", code: R`
def max_profit(prices):
    cur = best = 0
    for i in range(1, len(prices)):
        cur = max(0, cur + prices[i] - prices[i - 1])
        best = max(best, cur)
    return best

print(max_profit([7, 1, 5, 3, 6, 4]))`, out: "5", cx: "O(n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Maximum Subarray](neetcode.html#p/maximum-subarray)", "[Maximum Product Subarray](neetcode.html#p/maximum-product-subarray)"]],
  ],
},
{
  id: "cyclic-sort", group: "Arrays & Strings", title: "Index as Hash (Cyclic Sort)",
  sub: "When the values are in the range 1..n, each value has a \"home\" index. Use the array itself as a hash table for O(1) space.",
  tags: ["O(n)", "O(1) space"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Values are guaranteed to be in **[0, n]** or **[1, n]**", "\"Find the missing / duplicate / first missing positive\" with **O(1) extra space**"]],
    ["h", "Template"],
    ["code", R`
def cyclic_sort(nums):               # values 1..n -> put value v at index v-1
    i = 0
    while i < len(nums):
        home = nums[i] - 1
        if 0 <= home < len(nums) and nums[i] != nums[home]:
            nums[i], nums[home] = nums[home], nums[i]   # send it home
        else:
            i += 1
    return nums

print(cyclic_sort([3, 1, 5, 4, 2]))`, "[1, 2, 3, 4, 5]"],
    ["h", "Worked examples"],
    ["ex", { t: "First Missing Positive", d: "Hard", lc: 41, open: true, q: "Smallest missing positive integer, in O(n) time and O(1) space.", idea: "Place each value v in [1, n] at index v−1. The first index i with nums[i] ≠ i+1 gives the answer.", code: R`
def first_missing_positive(nums):
    n, i = len(nums), 0
    while i < n:
        v = nums[i]
        if 1 <= v <= n and nums[v - 1] != v:
            nums[i], nums[v - 1] = nums[v - 1], v
        else:
            i += 1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1

print(first_missing_positive([3, 4, -1, 1]), first_missing_positive([1, 2, 0]), first_missing_positive([7, 8, 9]))`, out: "2 3 1", cx: "O(n), O(1)" }],
    ["ex", { t: "Find All Numbers Disappeared in an Array", d: "Easy", lc: 448, q: "Values are in 1..n. Which are missing?", idea: "Mark that v is present by making nums[v−1] negative. The indices still positive at the end are missing.", code: R`
def find_disappeared(nums):
    for v in nums:
        i = abs(v) - 1
        nums[i] = -abs(nums[i])          # mark "value i+1 seen"
    return [i + 1 for i, v in enumerate(nums) if v > 0]

print(find_disappeared([4, 3, 2, 7, 8, 2, 3, 1]))`, out: "[5, 6]", cx: "O(n), O(1)" }],
    ["ex", { t: "Find All Duplicates in an Array", d: "Medium", lc: 442, q: "Values are in 1..n, and each appears once or twice. Return the duplicates.", idea: "Sign marking. If the target is already negative, we've seen this value before.", code: R`
def find_duplicates(nums):
    res = []
    for v in nums:
        i = abs(v) - 1
        if nums[i] < 0:
            res.append(abs(v))
        else:
            nums[i] = -nums[i]
    return res

print(find_duplicates([4, 3, 2, 7, 8, 2, 3, 1]))`, out: "[2, 3]", cx: "O(n), O(1)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Find the Duplicate Number](neetcode.html#p/find-the-duplicate-number)", "[Missing Number](neetcode.html#p/missing-number)"]],
  ],
},
{
  id: "matrix", group: "Arrays & Strings", title: "Matrix Traversal Tricks",
  sub: "Directions arrays, boundaries, transpose/reverse, and diagonals. These come up in every grid problem.",
  tags: ["grids"],
  blocks: [
    ["diagram", "grid", [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], { head: true, hl: ["1,1"], ok: ["0,1", "2,1", "1,0", "1,2"] }], "The 4 neighbours of (1,1) via DIRS = [(1,0),(-1,0),(0,1),(0,-1)]."],
    ["table", ["Trick", "Code"], [
      ["4 / 8 directions", "`for dr, dc in ((1,0),(-1,0),(0,1),(0,-1))`"],
      ["bounds check", "`0 <= r < R and 0 <= c < C`"],
      ["transpose", "`list(zip(*m))` or swap m[i][j] / m[j][i] for j > i"],
      ["rotate 90° clockwise", "transpose + reverse each row (or `zip(*m[::-1])`)"],
      ["same diagonal", "`r - c` constant (↘); anti-diagonal: `r + c` constant (↙)"],
      ["flatten index", "`k = r * C + c`, `r, c = divmod(k, C)`"],
    ]],
    ["code", R`
m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print([list(r) for r in zip(*m)])          # transpose
print([list(r) for r in zip(*m[::-1])])    # rotate clockwise
print([m[i][i] for i in range(3)], [m[i][2 - i] for i in range(3)])   # diagonals
print(sum(map(sum, m)), max(map(max, m)))`, "[[1, 4, 7], [2, 5, 8], [3, 6, 9]]\n[[7, 4, 1], [8, 5, 2], [9, 6, 3]]\n[1, 5, 9] [3, 5, 7]\n45 9"],
    ["h", "Worked examples"],
    ["ex", { t: "Spiral Matrix", d: "Medium", lc: 54, open: true, q: "Return the elements in spiral order.", idea: "Four shrinking boundaries.", code: R`
def spiral(m):
    res = []
    while m:
        res += m.pop(0)                      # take the top row
        m = [list(r) for r in zip(*m)][::-1] # rotate the rest counter-clockwise
    return res

print(spiral([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))`, out: "[1, 2, 3, 6, 9, 8, 7, 4, 5]", cx: "O((m·n)·min(m,n)) for this short version; the boundary version is O(m·n)" }],
    ["ex", { t: "Game of Life (in place)", d: "Medium", lc: 289, q: "Compute the next state simultaneously, in place.", idea: "Encode both states in one cell: bit 0 = the current state, bit 1 = the next state. Then shift.", code: R`
def game_of_life(b):
    R, C = len(b), len(b[0])
    for r in range(R):
        for c in range(C):
            live = sum(b[i][j] & 1 for i in range(r - 1, r + 2) for j in range(c - 1, c + 2)
                       if 0 <= i < R and 0 <= j < C and (i, j) != (r, c))
            if b[r][c] & 1 and live in (2, 3) or not b[r][c] & 1 and live == 3:
                b[r][c] |= 2                 # next state = alive
    for r in range(R):
        for c in range(C):
            b[r][c] >>= 1
    return b

print(game_of_life([[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]))`, out: "[[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]]", cx: "O(m·n), O(1)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Rotate Image](neetcode.html#p/rotate-image)", "[Spiral Matrix](neetcode.html#p/spiral-matrix)", "[Set Matrix Zeroes](neetcode.html#p/set-matrix-zeroes)", "[Valid Sudoku](neetcode.html#p/valid-sudoku)"]],
  ],
},
{
  id: "intervals", group: "Arrays & Strings", title: "Intervals: Sort + Sweep",
  sub: "Sort intervals (by start or by end), then sweep once and compare each interval with the last one you kept.",
  tags: ["O(n log n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Input is a list of `[start, end]` pairs: meetings, bookings, ranges", "\"merge\", \"overlap\", \"insert\", \"minimum rooms\", \"remove the fewest\""]],
    ["viz", "mergeIntervals"],
    ["table", ["Question", "Sort by", "Sweep rule"], [
      ["merge overlapping", "start", "if s ≤ last.end: extend, else append"],
      ["max non-overlapping / min removals", "**end**", "keep if s ≥ last kept end"],
      ["min rooms / max overlap", "start (+ heap of ends) or events", "+1 at start, −1 at end"],
      ["intersection of two lists", "both already sorted", "two pointers, advance the one that ends first"],
    ]],
    ["h", "Two overlap facts to memorize"],
    ["list", ["`[a, b]` and `[c, d]` overlap ⟺ `a <= d and c <= b`", "Their intersection is `[max(a, c), min(b, d)]` (if non-empty)"]],
    ["h", "Worked examples"],
    ["ex", { t: "Merge Intervals", d: "Medium", lc: 56, open: true, q: "Merge all overlapping intervals.", idea: "Sort by start and compare with the last merged interval.", code: R`
def merge(intervals):
    res = []
    for s, e in sorted(intervals):
        if res and s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res

print(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))`, out: "[[1, 6], [8, 10], [15, 18]]", cx: "O(n log n)" }],
    ["ex", { t: "Interval List Intersections", d: "Medium", lc: 986, q: "Intersect two sorted lists of disjoint intervals.", idea: "Two pointers. Record max(start), min(end) if valid, then advance whichever interval ends first.", code: R`
def interval_intersection(A, B):
    i = j = 0; res = []
    while i < len(A) and j < len(B):
        lo, hi = max(A[i][0], B[j][0]), min(A[i][1], B[j][1])
        if lo <= hi:
            res.append([lo, hi])
        if A[i][1] < B[j][1]: i += 1
        else: j += 1
    return res

print(interval_intersection([[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]))`, out: "[[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]]", cx: "O(m + n)" }],
    ["ex", { t: "Minimum Number of Arrows to Burst Balloons", d: "Medium", lc: 452, q: "Minimum vertical arrows so that every interval is hit.", idea: "Sort by end. Shoot at the end of the first interval, and every interval starting ≤ that point is burst too.", code: R`
def find_min_arrows(points):
    arrows, pos = 0, float("-inf")
    for s, e in sorted(points, key=lambda p: p[1]):
        if s > pos:
            arrows += 1
            pos = e
    return arrows

print(find_min_arrows([[10, 16], [2, 8], [1, 6], [7, 12]]))`, out: "2", cx: "O(n log n)" }],
    ["ex", { t: "Meeting Rooms II (sweep line)", d: "Medium", lc: 253, q: "Minimum rooms needed.", idea: "Events: +1 at each start, −1 at each end. The max running total is the answer. Sorting (time, delta) puts an end before a start at the same time.", code: R`
def min_rooms(intervals):
    events = sorted([(s, 1) for s, _ in intervals] + [(e, -1) for _, e in intervals])
    cur = best = 0
    for _, d in events:
        cur += d
        best = max(best, cur)
    return best

print(min_rooms([[0, 30], [5, 10], [15, 20]]), min_rooms([[1, 5], [5, 10]]))`, out: "2 1", cx: "O(n log n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Insert Interval](neetcode.html#p/insert-interval)", "[Merge Intervals](neetcode.html#p/merge-intervals)", "[Non-overlapping Intervals](neetcode.html#p/non-overlapping-intervals)", "[Meeting Rooms II](neetcode.html#p/meeting-rooms-ii)", "[Minimum Interval to Include Each Query](neetcode.html#p/minimum-interval-to-include-each-query)"]],
  ],
},
/* ---------------------------------------------------------- STACKS */
{
  id: "monotonic-stack", group: "Stacks & Queues", title: "Monotonic Stack",
  sub: "A stack kept in increasing or decreasing order. Each element is pushed and popped once, and it answers \"next greater/smaller\" questions in O(n).",
  tags: ["O(n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"**Next / previous greater** (or smaller) element\"", "\"How many days until warmer\", \"stock span\"", "\"Largest rectangle\", \"how far can each bar extend\"", "Remove digits / characters to make the result smallest"]],
    ["viz", "monoStack"],
    ["table", ["Want", "Keep the stack", "Pop when"], [
      ["next **greater**", "decreasing", "current > top"],
      ["next **smaller**", "increasing", "current < top"],
      ["previous greater/smaller", "same stacks; the answer is the top *after* popping", ""],
    ]],
    ["h", "Template"],
    ["code", R`
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                          # indices, values decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x        # x is the next greater for that index
        stack.append(i)
    return res

print(next_greater([2, 1, 2, 4, 3]))`, "[4, 2, 4, -1, -1]"],
    ["h", "Worked examples"],
    ["ex", { t: "Next Greater Element II (circular)", d: "Medium", lc: 503, open: true, q: "Next greater element in a circular array.", idea: "Loop twice (i in range(2n)) using i % n. Only push during the first pass.", code: R`
def next_greater_circular(nums):
    n = len(nums); res = [-1] * n; stack = []
    for i in range(2 * n):
        x = nums[i % n]
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x
        if i < n:
            stack.append(i)
    return res

print(next_greater_circular([1, 2, 1]), next_greater_circular([1, 2, 3, 4, 3]))`, out: "[2, -1, 2] [2, 3, 4, -1, 4]", cx: "O(n)" }],
    ["ex", { t: "Online Stock Span", d: "Medium", lc: 901, q: "For each price, how many consecutive days (including today) had a price ≤ today's?", idea: "Decreasing stack of (price, span). Pop smaller prices and absorb their spans.", code: R`
def stock_spans(prices):
    stack, out = [], []                 # (price, span)
    for p in prices:
        span = 1
        while stack and stack[-1][0] <= p:
            span += stack.pop()[1]
        stack.append((p, span))
        out.append(span)
    return out

print(stock_spans([100, 80, 60, 70, 60, 75, 85]))`, out: "[1, 1, 1, 2, 1, 4, 6]", cx: "O(n)" }],
    ["ex", { t: "Remove K Digits", d: "Medium", lc: 402, q: "Remove k digits to make the smallest number.", idea: "Increasing stack: while the top is bigger than the current digit and you still have removals left, pop it.", code: R`
def remove_k_digits(num, k):
    stack = []
    for d in num:
        while k and stack and stack[-1] > d:
            stack.pop(); k -= 1
        stack.append(d)
    stack = stack[:len(stack) - k]      # remove the rest from the end
    return "".join(stack).lstrip("0") or "0"

print(remove_k_digits("1432219", 3), remove_k_digits("10200", 1), remove_k_digits("10", 2))`, out: "1219 200 0", cx: "O(n)" }],
    ["ex", { t: "Largest Rectangle in Histogram", d: "Hard", lc: 84, q: "Biggest rectangle in the bar chart.", idea: "Increasing stack. When a shorter bar arrives, pop the taller bars and compute their areas. Add a sentinel 0 at the end to flush the stack.", code: R`
def largest_rectangle(heights):
    stack, best = [], 0                 # indices, heights increasing
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            left = stack[-1] + 1 if stack else 0
            best = max(best, height * (i - left))
        stack.append(i)
    return best

print(largest_rectangle([2, 1, 5, 6, 2, 3]))`, out: "10", cx: "O(n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Daily Temperatures](neetcode.html#p/daily-temperatures)", "[Car Fleet](neetcode.html#p/car-fleet)", "[Largest Rectangle in Histogram](neetcode.html#p/largest-rectangle-in-histogram)", "[Trapping Rain Water](neetcode.html#p/trapping-rain-water)"]],
  ],
},
{
  id: "monotonic-queue", group: "Stacks & Queues", title: "Monotonic Deque (window max/min)",
  sub: "A deque of indices with decreasing values. The front is always the max of the current window.",
  tags: ["O(n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Maximum / minimum of every window of size k\"", "DP where `dp[i]` depends on the max/min of a sliding range of previous states"]],
    ["h", "Template"],
    ["code", R`
from collections import deque

def window_max(nums, k):
    dq, res = deque(), []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()                    # smaller older elements are useless
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()                # expired
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res

print(window_max([1, 3, -1, -3, 5, 3, 6, 7], 3))`, "[3, 3, 5, 5, 6, 7]"],
    ["h", "Worked examples"],
    ["ex", { t: "Longest Subarray with Absolute Diff ≤ Limit", d: "Medium", lc: 1438, open: true, q: "Longest subarray where max − min ≤ limit.", idea: "A variable window with **two** deques: a decreasing one (max) and an increasing one (min). Shrink while max − min > limit.", code: R`
from collections import deque

def longest_subarray(nums, limit):
    mx, mn = deque(), deque()
    l = best = 0
    for r, x in enumerate(nums):
        while mx and mx[-1] < x: mx.pop()
        while mn and mn[-1] > x: mn.pop()
        mx.append(x); mn.append(x)
        while mx[0] - mn[0] > limit:
            if nums[l] == mx[0]: mx.popleft()
            if nums[l] == mn[0]: mn.popleft()
            l += 1
        best = max(best, r - l + 1)
    return best

print(longest_subarray([8, 2, 4, 7], 4), longest_subarray([10, 1, 2, 4, 7, 2], 5))`, out: "2 4", cx: "O(n)" }],
    ["ex", { t: "Jump Game VI", d: "Medium", lc: 1696, q: "Max score jumping at most k steps (score = sum of visited values).", idea: "dp[i] = nums[i] + max(dp[i−k..i−1]). Keep that window max with a monotonic deque.", code: R`
from collections import deque

def max_result(nums, k):
    dp = [0] * len(nums); dp[0] = nums[0]
    dq = deque([0])
    for i in range(1, len(nums)):
        if dq[0] < i - k: dq.popleft()
        dp[i] = nums[i] + dp[dq[0]]
        while dq and dp[dq[-1]] <= dp[i]: dq.pop()
        dq.append(i)
    return dp[-1]

print(max_result([1, -1, -2, 4, -7, 3], 2))`, out: "7", cx: "O(n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Sliding Window Maximum](neetcode.html#p/sliding-window-maximum)"]],
  ],
},
/* ---------------------------------------------------------- SEARCH */
{
  id: "binary-search-index", group: "Searching", title: "Binary Search on a Sorted / Rotated Array",
  sub: "Discard half of the search space every step. Also find the first/last occurrence or the insertion point.",
  tags: ["O(log n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["The array is **sorted** (even partially: rotated, mountain, matrix)", "\"Find target / first ≥ x / last ≤ x / insert position\"", "Required time is O(log n)"]],
    ["viz", "binarySearch"],
    ["h", "Template: lower bound (first index with a[i] ≥ x)"],
    ["code", R`
def lower_bound(a, x):
    lo, hi = 0, len(a)               # half-open [lo, hi)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo

a = [1, 2, 2, 2, 5, 7]
print(lower_bound(a, 2), lower_bound(a, 3), lower_bound(a, 9))`, "1 4 6"],
    ["h", "Worked examples"],
    ["ex", { t: "Find First and Last Position", d: "Medium", lc: 34, open: true, q: "Return the [first, last] index of the target, or [−1, −1].", idea: "first = lower_bound(x), last = lower_bound(x + 1) − 1.", code: R`
import bisect

def search_range(nums, target):
    l = bisect.bisect_left(nums, target)
    if l == len(nums) or nums[l] != target:
        return [-1, -1]
    return [l, bisect.bisect_right(nums, target) - 1]

print(search_range([5, 7, 7, 8, 8, 10], 8), search_range([5, 7, 7, 8, 8, 10], 6))`, out: "[3, 4] [-1, -1]", cx: "O(log n)" }],
    ["ex", { t: "Search Insert Position", d: "Easy", lc: 35, q: "Index of the target, or where it would be inserted.", idea: "That's exactly the lower bound.", code: R`
def search_insert(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target: lo = mid + 1
        else: hi = mid
    return lo

print(search_insert([1, 3, 5, 6], 5), search_insert([1, 3, 5, 6], 2), search_insert([1, 3, 5, 6], 7))`, out: "2 1 4", cx: "O(log n)" }],
    ["ex", { t: "Find Peak Element", d: "Medium", lc: 162, q: "Return any index whose value is greater than its neighbours.", idea: "If nums[mid] < nums[mid+1], a peak must exist on the right (it's going uphill). Otherwise one is at mid or to its left.", code: R`
def find_peak(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo

print(find_peak([1, 2, 3, 1]), find_peak([1, 2, 1, 3, 5, 6, 4]))`, out: "2 5", cx: "O(log n)" }],
    ["ex", { t: "Find Minimum in Rotated Sorted Array", d: "Medium", lc: 153, q: "Minimum of a rotated sorted array.", idea: "Compare mid with hi to find which side contains the drop.", code: R`
def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]: lo = mid + 1
        else: hi = mid
    return nums[lo]

print(find_min([4, 5, 6, 7, 0, 1, 2]), find_min([11, 13, 15]))`, out: "0 11", cx: "O(log n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Binary Search](neetcode.html#p/binary-search)", "[Search a 2D Matrix](neetcode.html#p/search-a-2d-matrix)", "[Find Minimum in Rotated Sorted Array](neetcode.html#p/find-minimum-in-rotated-sorted-array)", "[Search in Rotated Sorted Array](neetcode.html#p/search-in-rotated-sorted-array)", "[Time Based Key-Value Store](neetcode.html#p/time-based-key-value-store)"]],
  ],
},
{
  id: "binary-search-answer", group: "Searching", title: "Binary Search on the Answer",
  sub: "When the answer is a number and \"is x feasible?\" is monotonic, binary search over x instead of over an array.",
  tags: ["O(n log range)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"**Minimum** possible maximum\" / \"**maximum** possible minimum\"", "\"Smallest speed / capacity / time such that…\"", "Checking whether a given x works is easy (often greedy, O(n)), but finding the best x directly is hard"]],
    ["diagram", "arr", [["✗", "✗", "✗", "✗", "✓", "✓", "✓", "✓"], { ptr: { 4: "answer" }, ok: [4, 5, 6, 7], bad: [0, 1, 2, 3], idx: false }], "feasible(x) over candidate answers looks like F F F F T T T T. Find the first T."],
    ["h", "Template"],
    ["code", R`
def min_feasible(lo, hi, feasible):
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid              # mid works, try smaller
        else:
            lo = mid + 1          # mid fails, need bigger
    return lo

# example: smallest x with x*x >= 200
print(min_feasible(0, 200, lambda x: x * x >= 200))`, "15"],
    ["h", "Worked examples"],
    ["ex", { t: "Capacity To Ship Packages Within D Days", d: "Medium", lc: 1011, open: true, q: "Minimum ship capacity to deliver the weights (in order) within D days.", idea: "Capacity range: [max(w), sum(w)]. feasible(cap) = greedily count days needed ≤ D.", code: R`
def ship_within_days(weights, days):
    def days_needed(cap):
        d, load = 1, 0
        for w in weights:
            if load + w > cap:
                d, load = d + 1, 0
            load += w
        return d
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if days_needed(mid) <= days: hi = mid
        else: lo = mid + 1
    return lo

print(ship_within_days([1,2,3,4,5,6,7,8,9,10], 5), ship_within_days([3,2,2,4,1,4], 3))`, out: "15 6", cx: "O(n log(sum))" }],
    ["ex", { t: "Koko Eating Bananas", d: "Medium", lc: 875, q: "Minimum eating speed to finish within h hours.", idea: "speed ∈ [1, max(piles)], hours(speed) = Σ ceil(p/speed).", code: R`
def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        k = (lo + hi) // 2
        if sum((p + k - 1) // k for p in piles) <= h: hi = k
        else: lo = k + 1
    return lo

print(min_eating_speed([3, 6, 7, 11], 8), min_eating_speed([30, 11, 23, 4, 20], 6))`, out: "4 23", cx: "O(n log max)" }],
    ["ex", { t: "Split Array Largest Sum", d: "Hard", lc: 410, q: "Split into k subarrays and minimize the largest subarray sum.", idea: "Same shape as shipping: is the max part sum ≤ X achievable with ≤ k parts?", code: R`
def split_array(nums, k):
    def parts(limit):
        cnt, cur = 1, 0
        for x in nums:
            if cur + x > limit:
                cnt, cur = cnt + 1, 0
            cur += x
        return cnt
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if parts(mid) <= k: hi = mid
        else: lo = mid + 1
    return lo

print(split_array([7, 2, 5, 10, 8], 2), split_array([1, 2, 3, 4, 5], 2))`, out: "18 9", cx: "O(n log(sum))" }],
    ["ex", { t: "Sqrt(x)", d: "Easy", lc: 69, q: "Integer square root without built-ins.", idea: "The last x with x² ≤ n (the \"last true\" template rounds mid up).", code: R`
def my_sqrt(n):
    lo, hi = 0, n
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if mid * mid <= n: lo = mid
        else: hi = mid - 1
    return lo

print(my_sqrt(8), my_sqrt(16), my_sqrt(0))`, out: "2 4 0", cx: "O(log n)" }],
    ["warn", "Get the search range right: the low end is the smallest possibly valid answer (often max(element)), and the high end is a value that is definitely feasible (often the sum)."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Koko Eating Bananas](neetcode.html#p/koko-eating-bananas)", "[Swim in Rising Water](neetcode.html#p/swim-in-rising-water) (alternative solution)"]],
  ],
},
/* ---------------------------------------------------------- LINKED LISTS */
{
  id: "fast-slow", group: "Linked Lists", title: "Fast & Slow Pointers",
  sub: "Two pointers moving at different speeds. They detect cycles, find the middle, or find the k-th from the end, all in O(1) space.",
  tags: ["O(n)", "O(1) space"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Linked list **cycle** or the start of the cycle", "**Middle** of a linked list (split for merge sort, palindrome list)", "Any sequence x → f(x) that may loop (Happy Number, Find the Duplicate)", "\"k-th from the end\" (a fixed gap rather than different speeds)"]],
    ["viz", "fastSlow"],
    ["h", "Templates"],
    ["code", R`
class Node:
    def __init__(self, v, nxt=None): self.val, self.next = v, nxt

def build(vals):
    head = None
    for v in reversed(vals): head = Node(v, head)
    return head

def middle(head):                 # second middle for even lengths
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow

def kth_from_end(head, k):        # fixed gap of k
    lead = trail = head
    for _ in range(k): lead = lead.next
    while lead:
        lead, trail = lead.next, trail.next
    return trail

h = build([1, 2, 3, 4, 5, 6])
print(middle(h).val, kth_from_end(h, 2).val)`, "4 5"],
    ["h", "Worked examples"],
    ["ex", { t: "Linked List Cycle II (find the cycle start)", d: "Medium", lc: 142, open: true, q: "Return the node where the cycle begins.", idea: "After slow and fast meet, restart one pointer at head and move both one step at a time. They meet at the cycle start.", code: R`
class Node:
    def __init__(self, v): self.val, self.next = v, None

def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            p = head
            while p is not slow:
                p, slow = p.next, slow.next
            return p
    return None

nodes = [Node(v) for v in [3, 2, 0, -4]]
for a, b in zip(nodes, nodes[1:]): a.next = b
nodes[-1].next = nodes[1]                 # tail -> node "2"
print(detect_cycle(nodes[0]).val)`, out: "2", cx: "O(n), O(1)" }],
    ["ex", { t: "Palindrome Linked List", d: "Easy", lc: 234, q: "Is the list a palindrome? O(1) space.", idea: "Find the middle (fast/slow), reverse the second half, then compare the halves.", code: R`
class Node:
    def __init__(self, v, n=None): self.val, self.next = v, n

def is_palindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    prev = None
    while slow:                                  # reverse the second half
        slow.next, prev, slow = prev, slow, slow.next
    a, b = head, prev
    while b:
        if a.val != b.val: return False
        a, b = a.next, b.next
    return True

def build(v):
    h = None
    for x in reversed(v): h = Node(x, h)
    return h

print(is_palindrome(build([1, 2, 2, 1])), is_palindrome(build([1, 2])))`, out: "True False", cx: "O(n), O(1)" }],
    ["ex", { t: "Happy Number", d: "Easy", lc: 202, q: "Does repeatedly summing the squared digits reach 1?", idea: "The sequence n → f(n) either reaches 1 or cycles. Floyd detects the cycle without a set.", code: R`
def is_happy(n):
    f = lambda x: sum(int(d) ** 2 for d in str(x))
    slow, fast = n, f(n)
    while fast != 1 and slow != fast:
        slow, fast = f(slow), f(f(fast))
    return fast == 1

print(is_happy(19), is_happy(2))`, out: "True False", cx: "O(log n) per step" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Linked List Cycle](neetcode.html#p/linked-list-cycle)", "[Find the Duplicate Number](neetcode.html#p/find-the-duplicate-number)", "[Remove Nth Node From End](neetcode.html#p/remove-nth-node-from-end-of-list)", "[Reorder List](neetcode.html#p/reorder-list)"]],
  ],
},
{
  id: "ll-reversal", group: "Linked Lists", title: "In-place Linked List Reversal & Dummy Nodes",
  sub: "Re-point `next` links with prev/curr/nxt. Use a dummy head whenever the head might change.",
  tags: ["O(n)", "O(1) space"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Reverse\" a list, part of a list, or groups of k", "\"Swap nodes\", \"rotate list\", \"reorder\"", "Building or merging lists (the dummy-node trick)"]],
    ["viz", "reverseList"],
    ["h", "Template"],
    ["code", R`
class Node:
    def __init__(self, v, n=None): self.val, self.next = v, n

def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next      # 1 save
        cur.next = prev     # 2 flip
        prev = cur          # 3 advance
        cur = nxt
    return prev

def to_list(h):
    out = []
    while h: out.append(h.val); h = h.next
    return out

h = Node(1, Node(2, Node(3, Node(4))))
print(to_list(reverse(h)))`, "[4, 3, 2, 1]"],
    ["h", "Worked examples"],
    ["ex", { t: "Reverse Linked List II (positions left..right)", d: "Medium", lc: 92, open: true, q: "Reverse only the nodes from position left to right (1-indexed).", idea: "Dummy → walk to the node before `left`. Then repeatedly move the next node to the front of the sublist (head insertion).", code: R`
class Node:
    def __init__(self, v, n=None): self.val, self.next = v, n

def reverse_between(head, left, right):
    dummy = Node(0, head)
    before = dummy
    for _ in range(left - 1):
        before = before.next
    cur = before.next
    for _ in range(right - left):
        move = cur.next                 # node to bring to the front
        cur.next = move.next
        move.next = before.next
        before.next = move
    return dummy.next

def build(v):
    h = None
    for x in reversed(v): h = Node(x, h)
    return h
def to_list(h):
    out = []
    while h: out.append(h.val); h = h.next
    return out

print(to_list(reverse_between(build([1, 2, 3, 4, 5]), 2, 4)))`, out: "[1, 4, 3, 2, 5]", cx: "O(n), O(1)" }],
    ["ex", { t: "Swap Nodes in Pairs", d: "Medium", lc: 24, q: "Swap every two adjacent nodes.", idea: "Dummy + a pointer to the node before each pair. Relink: prev → b → a → rest.", code: R`
class Node:
    def __init__(self, v, n=None): self.val, self.next = v, n

def swap_pairs(head):
    dummy = prev = Node(0, head)
    while prev.next and prev.next.next:
        a, b = prev.next, prev.next.next
        prev.next, a.next, b.next = b, b.next, a
        prev = a
    return dummy.next

h = Node(1, Node(2, Node(3, Node(4, Node(5)))))
h = swap_pairs(h); out = []
while h: out.append(h.val); h = h.next
print(out)`, out: "[2, 1, 4, 3, 5]", cx: "O(n)" }],
    ["ex", { t: "Rotate List", d: "Medium", lc: 61, q: "Rotate the list to the right by k places.", idea: "Get the length, connect the tail to the head (a ring), walk to the new tail at len − k % len − 1, then cut.", code: R`
class Node:
    def __init__(self, v, n=None): self.val, self.next = v, n

def rotate_right(head, k):
    if not head: return head
    n, tail = 1, head
    while tail.next: tail, n = tail.next, n + 1
    tail.next = head                       # make a ring
    for _ in range(n - k % n - 1):
        head = head.next
    new_head, head.next = head.next, None  # cut
    return new_head

h = Node(1, Node(2, Node(3, Node(4, Node(5)))))
h = rotate_right(h, 2); out = []
while h: out.append(h.val); h = h.next
print(out)`, out: "[4, 5, 1, 2, 3]", cx: "O(n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Reverse Linked List](neetcode.html#p/reverse-linked-list)", "[Merge Two Sorted Lists](neetcode.html#p/merge-two-sorted-lists)", "[Reorder List](neetcode.html#p/reorder-list)", "[Reverse Nodes in k-Group](neetcode.html#p/reverse-nodes-in-k-group)", "[Add Two Numbers](neetcode.html#p/add-two-numbers)"]],
  ],
},
);
