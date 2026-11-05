NC.add("Arrays & Hashing", [
{
  id: "contains-duplicate", t: "Contains Duplicate", lc: 217, d: "Easy", p: "Hash Set",
  q: "You are given an integer array `nums`. Return `True` if any value appears **at least twice** in the array, and `False` if every element is distinct.",
  ex: [["nums = [1,2,3,1]", "True", "1 appears at index 0 and index 3."], ["nums = [1,2,3,4]", "False", "All four values are different."], ["nums = [1,1,1,3,3,4,3,2,4,2]", "True", ""]],
  c: ["1 ≤ len(nums) ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
  hint: "You need to answer \"have I seen this value before?\" quickly for every element. Which data structure answers membership questions in O(1)?",
  brute: {
    idea: "Compare every pair `(i, j)` with `i < j`. If any two are equal, there is a duplicate.",
    code: R`
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                if nums[i] == nums[j]:
                    return True
        return False`,
    tc: "O(n²)", tw: "About n²/2 pairs are compared.", sc: "O(1)", sw: "Only loop variables.",
    bad: "With n = 10^5 that is ~5·10^9 comparisons, far too slow (Time Limit Exceeded).",
  },
  better: {
    idea: "Sort the array. Duplicates then sit **next to each other**, so you only compare neighbours.",
    code: R`
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        nums = sorted(nums)
        for i in range(1, len(nums)):
            if nums[i] == nums[i - 1]:
                return True
        return False`,
    tc: "O(n log n)", tw: "Sorting dominates.", sc: "O(n)", sw: "`sorted()` makes a copy (O(1) extra if you sort in place).",
  },
  opt: {
    idea: "Walk through the array once and keep a **set** of values seen so far. Before adding a value, check whether it is already in the set. Set lookups are O(1) on average because a set is a hash table.",
    steps: ["Create an empty set `seen`.", "For each number `x` in `nums`:", "If `x` is already in `seen`, you found a duplicate. Return `True` immediately.", "Otherwise add `x` to `seen`.", "If the loop finishes, every value was unique. Return `False`."],
    code: R`
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        seen = set()
        for x in nums:
            if x in seen:        # O(1) average membership test
                return True
            seen.add(x)
        return False`,
    tc: "O(n)", tw: "One pass. Each set check/add is O(1) on average.", sc: "O(n)", sw: "In the worst case (no duplicates) the set stores all n values.",
  },
  run: R`
s = Solution()
print(s.containsDuplicate([1, 2, 3, 1]))
print(s.containsDuplicate([1, 2, 3, 4]))
print(s.containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]))`,
  out: R`
True
False
True`,
  dryOn: "nums = [1,2,3,1]",
  dry: { h: ["step", "x", "x in seen?", "seen after"], r: [[1, 1, "No", "{1}"], [2, 2, "No", "{1, 2}"], [3, 3, "No", "{1, 2, 3}"], [4, 1, "**Yes** → return True", "—"]] },
  expl: [
    ["seen = set()", "A hash set gives O(1) average `in` checks and `add`."],
    ["for x in nums:", "Visit each number exactly once."],
    ["if x in seen:\n    return True", "If we met this value before, it's a duplicate, so stop early."],
    ["seen.add(x)", "Remember this value for later elements."],
    ["return False", "We only reach this if no value repeated."],
  ],
  alt: { idea: "One-liner: a set removes duplicates, so if the set is smaller than the list there was a repeat. Same O(n) time and space, but it can't stop early.", code: R`
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return len(set(nums)) < len(nums)` },
  take: "**\"Have I seen this before?\" → use a hash set.** It turns an O(n²) pair check into O(n).",
  mist: ["Using a list for `seen`: `x in list` is O(n), so the whole thing becomes O(n²) again.", "Forgetting that sorting changes the input (use `sorted()` if you must not mutate it)."],
},
{
  id: "valid-anagram", t: "Valid Anagram", lc: 242, d: "Easy", p: "Frequency Count",
  q: "Given two strings `s` and `t`, return `True` if `t` is an **anagram** of `s`, otherwise `False`.\n\nAn anagram uses exactly the same letters the same number of times, just in a different order (e.g. \"listen\" → \"silent\").",
  ex: [["s = \"anagram\", t = \"nagaram\"", "True", "Both have a×3, n×1, g×1, r×1, m×1."], ["s = \"rat\", t = \"car\"", "False", "s has a 't', t has a 'c'."]],
  c: ["1 ≤ len(s), len(t) ≤ 5·10^4", "lowercase English letters"],
  hint: "Two strings are anagrams exactly when every character has the same count in both. Count them.",
  brute: {
    idea: "Sort both strings. Anagrams become identical after sorting.",
    code: R`
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return sorted(s) == sorted(t)`,
    tc: "O(n log n)", tw: "Sorting both strings.", sc: "O(n)", sw: "`sorted` builds new lists.",
    bad: "Correct and short, often fine in interviews, but counting is O(n).",
  },
  opt: {
    idea: "Count how many times each character appears in `s`, then **subtract** the counts for `t`. If every count ends at 0, the strings have identical letter frequencies.",
    steps: ["If lengths differ → cannot be anagrams, return `False`.", "Build a count dictionary: `count[c] += 1` for each char in `s`.", "For each char in `t`: `count[c] -= 1`. If it ever goes below 0, `t` has too many of that char → `False`.", "Since lengths are equal and nothing went negative, all counts are 0 → `True`."],
    code: R`
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = {}
        for c in s:
            count[c] = count.get(c, 0) + 1
        for c in t:
            count[c] = count.get(c, 0) - 1
            if count[c] < 0:
                return False
        return True`,
    tc: "O(n)", tw: "Two linear passes.", sc: "O(1)", sw: "At most 26 keys for lowercase letters (O(k) for an alphabet of size k).",
  },
  run: R`
s = Solution()
print(s.isAnagram("anagram", "nagaram"))
print(s.isAnagram("rat", "car"))`,
  out: R`
True
False`,
  dryOn: "s = \"rat\", t = \"car\"",
  dry: ["Lengths equal (3).", "After counting s: `{r:1, a:1, t:1}`", "t[0] = 'c' → count['c'] = 0 − 1 = **−1** < 0 → return `False`."],
  expl: [
    ["if len(s) != len(t):\n    return False", "Quick exit: different lengths can never match."],
    ["count[c] = count.get(c, 0) + 1", "`dict.get(key, default)` avoids a KeyError for the first occurrence."],
    ["count[c] = count.get(c, 0) - 1", "Use up one occurrence for each char of `t`."],
    ["if count[c] < 0:", "`t` uses a char more often than `s` (or a char `s` lacks)."],
  ],
  alt: { idea: "Pythonic version with `collections.Counter`. Counters compare equal when all counts match.", code: R`
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)` },
  take: "**Anagram / permutation / same letters → compare frequency counts** (dict, Counter or a 26-length array).",
  mist: ["Forgetting the length check when you only decrement (then extra letters in `s` go unnoticed).", "Using `set(s) == set(t)`. Sets ignore counts, so \"aab\" vs \"abb\" would wrongly pass."],
},
{
  id: "two-sum", t: "Two Sum", lc: 1, d: "Easy", p: "Hash Map (complement lookup)",
  q: "Given an array `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`.\n\nThere is exactly one valid answer, and you may not use the same element twice. Return the answer in any order.",
  ex: [["nums = [2,7,11,15], target = 9", "[0, 1]", "nums[0] + nums[1] = 2 + 7 = 9"], ["nums = [3,2,4], target = 6", "[1, 2]", "2 + 4 = 6 (not 3 + 3, the same element twice)"], ["nums = [3,3], target = 6", "[0, 1]", ""]],
  c: ["2 ≤ len(nums) ≤ 10^4", "exactly one solution exists"],
  hint: "For each number `x`, the partner you need is `target - x`. Can you look up \"have I already seen `target - x`, and where?\" in O(1)?",
  brute: {
    idea: "Try every pair `(i, j)` and check whether `nums[i] + nums[j] == target`.",
    code: R`
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`,
    tc: "O(n²)", tw: "All pairs.", sc: "O(1)", sw: "",
    bad: "Works for 10^4 elements (~5·10^7 ops) but the interviewer expects O(n).",
  },
  opt: {
    idea: "While scanning, store each value → its index in a dictionary. For the current number `x`, its needed partner is `need = target - x`. If `need` is already in the dictionary, you're done: the answer is `[index_of_need, current_index]`.\n\nWe check **before** inserting `x`, so an element is never paired with itself.",
    steps: ["Create an empty dict `pos` (value → index).", "For each index `i` and value `x`:", "Compute `need = target - x`.", "If `need` is in `pos` → return `[pos[need], i]`.", "Otherwise store `pos[x] = i` and continue."],
    code: R`
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pos = {}                      # value -> index where we saw it
        for i, x in enumerate(nums):
            need = target - x
            if need in pos:
                return [pos[need], i]
            pos[x] = i
        return []`,
    tc: "O(n)", tw: "Single pass with O(1) dict operations.", sc: "O(n)", sw: "The dict can hold up to n entries.",
  },
  run: R`
s = Solution()
print(s.twoSum([2, 7, 11, 15], 9))
print(s.twoSum([3, 2, 4], 6))
print(s.twoSum([3, 3], 6))`,
  out: R`
[0, 1]
[1, 2]
[0, 1]`,
  dryOn: "nums = [3,2,4], target = 6",
  dry: { h: ["i", "x", "need = 6 − x", "need in pos?", "pos after"], r: [[0, 3, 3, "No (pos empty)", "{3: 0}"], [1, 2, 4, "No", "{3: 0, 2: 1}"], [2, 4, 2, "**Yes**, at index 1", "return [1, 2]"]] },
  expl: [
    ["pos = {}", "Maps a value we've passed to its index."],
    ["for i, x in enumerate(nums):", "`enumerate` gives index and value together."],
    ["need = target - x", "The exact partner value that completes the sum."],
    ["if need in pos:\n    return [pos[need], i]", "Partner seen earlier → its index plus the current index."],
    ["pos[x] = i", "Insert **after** checking so `x` can't pair with itself (matters for `[3,3], 6` → handled because the 2nd 3 finds the 1st)."],
  ],
  take: "**Pair that sums to target → for each x, look up `target − x` in a hash map.** If the array is sorted, use two pointers instead (Two Sum II).",
  mist: ["Inserting before checking → `[3], target 6` would pair index 0 with itself.", "Returning values instead of indices."],
},
{
  id: "group-anagrams", t: "Group Anagrams", lc: 49, d: "Medium", p: "Hash Map with computed key",
  q: "Given a list of strings `strs`, group the anagrams together. You may return the groups in any order.",
  ex: [["strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]", "Words with the same letters land in the same group."], ["strs = [\"\"]", "[[\"\"]]", ""], ["strs = [\"a\"]", "[[\"a\"]]", ""]],
  c: ["1 ≤ len(strs) ≤ 10^4", "0 ≤ len(strs[i]) ≤ 100", "lowercase letters"],
  hint: "All anagrams share some *signature*. If you can compute the same key for all anagrams, a dict of key → list does the grouping.",
  brute: {
    idea: "For each word, compare it with the representative of every existing group (using sorted-string equality). Add it to the matching group or start a new one.",
    code: R`
class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = []
        for w in strs:
            for g in groups:
                if sorted(g[0]) == sorted(w):
                    g.append(w)
                    break
            else:                      # no group matched
                groups.append([w])
        return groups`,
    tc: "O(n² · k log k)", tw: "Each of n words is compared with up to n groups, sorting k-length words.", sc: "O(n·k)", sw: "",
    bad: "Quadratic in the number of words.",
  },
  opt: {
    idea: "Give every word a **key** that is identical for all its anagrams: the sorted word (\"eat\" → \"aet\"), or a tuple of 26 letter counts. Then use `defaultdict(list)` and append each word under its key. One pass.",
    steps: ["Create `groups = defaultdict(list)`.", "For each word `w`: build `key` = tuple of 26 counts (or `''.join(sorted(w))`).", "Append `w` to `groups[key]`.", "Return `list(groups.values())`."],
    code: R`
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)
        for w in strs:
            count = [0] * 26
            for c in w:
                count[ord(c) - ord('a')] += 1
            groups[tuple(count)].append(w)   # lists can't be dict keys, tuples can
        return list(groups.values())`,
    tc: "O(n · k)", tw: "n words, each of length up to k, counted in O(k). (Sorted-key version: O(n · k log k).)", sc: "O(n · k)", sw: "All words stored in the groups.",
  },
  run: R`
s = Solution()
print(s.groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
print(s.groupAnagrams([""]))
print(s.groupAnagrams(["a"]))`,
  out: R`
[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
[['']]
[['a']]`,
  dryOn: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"] (showing sorted keys for readability)",
  dry: { h: ["word", "key (sorted)", "groups after"], r: [["eat", "aet", "aet: [eat]"], ["tea", "aet", "aet: [eat, tea]"], ["tan", "ant", "…, ant: [tan]"], ["ate", "aet", "aet: [eat, tea, ate]"], ["nat", "ant", "ant: [tan, nat]"], ["bat", "abt", "abt: [bat]"]] },
  expl: [
    ["groups = defaultdict(list)", "Missing keys automatically start as `[]`, so no `if key not in groups` check is needed."],
    ["count = [0] * 26", "One slot per letter a–z."],
    ["count[ord(c) - ord('a')] += 1", "`ord('a')` = 97, so 'a'→0, 'b'→1, … 'z'→25."],
    ["groups[tuple(count)].append(w)", "Lists are mutable → unhashable. Convert to a tuple to use as a key."],
    ["return list(groups.values())", "We only need the groups, not the keys."],
  ],
  alt: { idea: "Sorted-string key, which is shorter to write and usually what people use:", code: R`
class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for w in strs:
            groups["".join(sorted(w))].append(w)
        return list(groups.values())` },
  take: "**Grouping things that are \"equivalent\" → design a canonical key and use `defaultdict(list)`.**",
  mist: ["Using a list as a dict key → `TypeError: unhashable type: 'list'`.", "Using `set(w)` as the key: it loses counts (\"aab\" and \"ab\" would collide)."],
},
{
  id: "top-k-frequent-elements", t: "Top K Frequent Elements", lc: 347, d: "Medium", p: "Bucket Sort / Heap",
  q: "Given an integer array `nums` and an integer `k`, return the `k` **most frequent** elements. The answer is guaranteed to be unique, and you may return it in any order.",
  ex: [["nums = [1,1,1,2,2,3], k = 2", "[1, 2]", "1 appears 3×, 2 appears 2×."], ["nums = [1], k = 1", "[1]", ""]],
  c: ["1 ≤ len(nums) ≤ 10^5", "k is in range [1, number of distinct elements]", "Follow-up: better than O(n log n)"],
  hint: "First count frequencies. Then you need the k largest counts. A frequency can be at most n, so you can index buckets by frequency.",
  brute: {
    idea: "Count with a dictionary, sort the distinct values by count (descending), take the first k.",
    code: R`
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        ordered = sorted(count, key=lambda x: count[x], reverse=True)
        return ordered[:k]`,
    tc: "O(n log n)", tw: "Sorting up to n distinct values.", sc: "O(n)", sw: "",
    bad: "Fine in practice, but the follow-up asks for better than O(n log n).",
  },
  better: {
    idea: "Keep a **min-heap of size k** of `(count, value)`. Push each pair, and pop when the size exceeds k, so the smallest count leaves. The k survivors are the most frequent.",
    code: R`
import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        heap = []
        for val, c in count.items():
            heapq.heappush(heap, (c, val))
            if len(heap) > k:
                heapq.heappop(heap)       # drop the least frequent
        return sorted((v for c, v in heap), key=lambda v: -count[v])`,
    tc: "O(n log k)", tw: "Each push/pop on a heap of size k is O(log k).", sc: "O(n + k)", sw: "",
  },
  opt: {
    idea: "**Bucket sort by frequency.** Make a list of buckets where `buckets[f]` holds every number that appears exactly `f` times. Frequencies are between 1 and n, so there are n+1 buckets. Then walk the buckets from high to low frequency and collect numbers until you have k.",
    steps: ["Count frequencies with a dict / `Counter`.", "Create `buckets = [[] for _ in range(n + 1)]`.", "For each `(value, freq)`: `buckets[freq].append(value)`.", "Iterate `f` from n down to 1, extend the result with `buckets[f]`, and stop once you have k items."],
    code: R`
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]   # index = frequency
        for val, freq in count.items():
            buckets[freq].append(val)

        res = []
        for freq in range(len(buckets) - 1, 0, -1):    # high -> low frequency
            for val in buckets[freq]:
                res.append(val)
                if len(res) == k:
                    return res
        return res`,
    tc: "O(n)", tw: "Counting O(n) + bucket fill O(n) + one scan over n+1 buckets.", sc: "O(n)", sw: "Counter + buckets.",
  },
  run: R`
s = Solution()
print(s.topKFrequent([1, 1, 1, 2, 2, 3], 2))
print(s.topKFrequent([1], 1))`,
  out: R`
[1, 2]
[1]`,
  dryOn: "nums = [1,1,1,2,2,3], k = 2",
  dry: ["count = {1: 3, 2: 2, 3: 1}", "buckets (index = freq): `[[], [3], [2], [1], [], [], []]`", "freq 6,5,4 → empty. freq 3 → take 1 → res = [1]", "freq 2 → take 2 → res = [1, 2], len == k → return."],
  expl: [
    ["count = Counter(nums)", "`Counter` builds value → frequency in O(n)."],
    ["buckets = [[] for _ in range(len(nums) + 1)]", "A frequency can be anywhere from 1 to n. Don't write `[[]] * (n+1)`, which makes every slot the same list!"],
    ["buckets[freq].append(val)", "Group values by how often they occur."],
    ["for freq in range(len(buckets) - 1, 0, -1):", "Go from the highest possible frequency down to 1."],
    ["if len(res) == k:\n    return res", "Stop as soon as we have k elements."],
  ],
  alt: { idea: "Python shortcut: `Counter.most_common(k)` (uses a heap internally, O(n log k)).", code: R`
class Solution:
    def topKFrequent(self, nums, k):
        return [v for v, _ in Counter(nums).most_common(k)]` },
  take: "**Top-K → heap of size k (O(n log k)).** When the values you rank by are bounded (like frequency ≤ n), **bucket sort** gives O(n).",
  mist: ["`[[]] * n` creates n references to the *same* list.", "Using a max-heap of all elements: that's O(n log n), no better than sorting."],
},
{
  id: "encode-and-decode-strings", t: "Encode and Decode Strings", lc: 271, d: "Medium", p: "String design (length prefix)", prem: true,
  q: "Design an algorithm to **encode** a list of strings into a single string, and **decode** that single string back into the original list.\n\nThe strings may contain **any** characters, including the delimiter you might pick, such as `,` or `#`.",
  ex: [["[\"neet\",\"code\",\"love\",\"you\"]", "[\"neet\",\"code\",\"love\",\"you\"]", "encode → \"4#neet4#code4#love3#you\" → decode back"], ["[\"we\",\"say\",\":\",\"yes\"]", "[\"we\",\"say\",\":\",\"yes\"]", ""]],
  c: ["0 ≤ len(strs) ≤ 200", "strings may contain any of the 256 ASCII chars"],
  hint: "A plain delimiter fails if a string contains it. What if each string tells you **how long** it is before its content starts?",
  brute: {
    idea: "Join with a separator like `,` and split on it. **This is wrong in general:** `[\"a,b\", \"c\"]` encodes to `\"a,b,c\"`, which decodes into 3 strings. Escaping characters can fix it, but that gets fiddly.",
    code: R`
class Solution:
    def encode(self, strs: list[str]) -> str:
        return ",".join(strs)           # breaks if a string contains ","

    def decode(self, s: str) -> list[str]:
        return s.split(",") if s else []`,
    run: false,
    tc: "O(n)", sc: "O(n)", bad: "Not correct for arbitrary input. Shown to explain why we need length prefixes.",
  },
  opt: {
    idea: "**Length-prefix encoding:** for each string write `len(s)`, then a `#`, then the string itself, for example `\"4#neet\"`.\n\nTo decode, read digits up to the `#` to get the length `L`, then take exactly the next `L` characters, whatever they are (even `#` or digits). Then jump ahead and repeat.",
    steps: ["encode: `\"\".join(f\"{len(s)}#{s}\" for s in strs)`", "decode: start `i = 0`.", "Move `j` from `i` until `s[j] == '#'`. Then `length = int(s[i:j])`.", "The word is `s[j+1 : j+1+length]`; append it.", "Set `i = j + 1 + length` and repeat until `i == len(s)`."],
    code: R`
class Solution:
    def encode(self, strs: list[str]) -> str:
        return "".join(f"{len(s)}#{s}" for s in strs)

    def decode(self, s: str) -> list[str]:
        res, i = [], 0
        while i < len(s):
            j = i
            while s[j] != "#":          # read the length digits
                j += 1
            length = int(s[i:j])
            res.append(s[j + 1 : j + 1 + length])
            i = j + 1 + length          # jump to the next "<len>#"
        return res`,
    tc: "O(n)", tw: "n = total characters; each is read once.", sc: "O(n)", sw: "Output string / list.",
  },
  run: R`
s = Solution()
for strs in (["neet", "code", "love", "you"], ["we", "say", ":", "yes"], ["a#b", "12#", ""]):
    enc = s.encode(strs)
    print(repr(enc), "->", s.decode(enc))`,
  out: R`
'4#neet4#code4#love3#you' -> ['neet', 'code', 'love', 'you']
'2#we3#say1#:3#yes' -> ['we', 'say', ':', 'yes']
'3#a#b3#12#0#' -> ['a#b', '12#', '']`,
  dryOn: "decode \"3#a#b3#12#0#\"",
  dry: ["i=0: digits \"3\" up to '#' at j=1 → take s[2:5] = \"a#b\" → i = 5", "i=5: \"3\" → '#' at 6 → take s[7:10] = \"12#\" → i = 10", "i=10: \"0\" → '#' at 11 → take s[12:12] = \"\" → i = 12 = len → done"],
  expl: [
    ["f\"{len(s)}#{s}\"", "The prefix says exactly how many characters to read, so the content can never be confused with the delimiter."],
    ["while s[j] != \"#\":", "Read the length digits. The **first** '#' after `i` always ends the length, because lengths contain only digits."],
    ["s[j + 1 : j + 1 + length]", "Slice exactly `length` chars. Their content doesn't matter."],
    ["i = j + 1 + length", "Skip past this word to the next length prefix."],
  ],
  take: "**Length-prefixing** (like network protocols) makes any byte sequence safe to frame. Empty strings and strings containing `#` still work.",
  mist: ["Splitting on '#'. Content may contain '#'.", "Assuming one-digit lengths. Read until the '#' so lengths like 123 work."],
},
{
  id: "product-of-array-except-self", t: "Product of Array Except Self", lc: 238, d: "Medium", p: "Prefix / Suffix products",
  q: "Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of every element of `nums` **except** `nums[i]`.\n\nYou must solve it in O(n) time **without using division**.",
  ex: [["nums = [1,2,3,4]", "[24, 12, 8, 6]", "answer[0] = 2·3·4 = 24, answer[1] = 1·3·4 = 12, …"], ["nums = [-1,1,0,-3,3]", "[0, 0, 9, 0, 0]", "Only index 2 (the zero) gets a non-zero product."]],
  c: ["2 ≤ len(nums) ≤ 10^5", "products fit in 32-bit int", "Follow-up: O(1) extra space (output array doesn't count)"],
  hint: "answer[i] = (product of everything **left** of i) × (product of everything **right** of i). Both can be built in one pass each.",
  brute: {
    idea: "For each index i, multiply all other elements.",
    code: R`
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        ans = []
        for i in range(n):
            p = 1
            for j in range(n):
                if j != i:
                    p *= nums[j]
            ans.append(p)
        return ans`,
    tc: "O(n²)", sc: "O(1) extra", bad: "Too slow for n = 10^5. (Dividing the total product by nums[i] is forbidden, and it breaks on zeros anyway.)",
  },
  opt: {
    idea: "Split the product into two halves:\n\n`answer[i] = prefix[i] × suffix[i]`, where `prefix[i]` = product of `nums[0..i-1]` and `suffix[i]` = product of `nums[i+1..n-1]`.\n\nTo save space, first store the prefix products **in the answer array**, then sweep from the right with one running variable `suffix` and multiply it in.",
    steps: ["`ans = [1] * n`.", "Left pass: `prefix = 1`. For i = 0..n-1: `ans[i] = prefix`, then `prefix *= nums[i]`.", "Right pass: `suffix = 1`. For i = n-1..0: `ans[i] *= suffix`, then `suffix *= nums[i]`.", "Return `ans`."],
    code: R`
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        ans = [1] * n

        prefix = 1
        for i in range(n):              # ans[i] = product of everything LEFT of i
            ans[i] = prefix
            prefix *= nums[i]

        suffix = 1
        for i in range(n - 1, -1, -1):  # multiply by product of everything RIGHT of i
            ans[i] *= suffix
            suffix *= nums[i]
        return ans`,
    tc: "O(n)", tw: "Two linear passes.", sc: "O(1) extra", sw: "Only `prefix`/`suffix` variables; the output array isn't counted.",
  },
  run: R`
s = Solution()
print(s.productExceptSelf([1, 2, 3, 4]))
print(s.productExceptSelf([-1, 1, 0, -3, 3]))`,
  out: R`
[24, 12, 8, 6]
[0, 0, 9, 0, 0]`,
  dryOn: "nums = [1,2,3,4]",
  dry: { h: ["i", "left pass: ans[i] = prefix", "prefix after", "right pass: ans[i] *= suffix", "suffix after"], r: [[0, 1, 1, "1 × 24 = **24**", 24], [1, 1, 2, "1 × 12 = **12**", 24], [2, 2, 6, "2 × 4 = **8**", 12], [3, 6, 24, "6 × 1 = **6**", 4]] },
  expl: [
    ["ans = [1] * n", "Neutral element for multiplication."],
    ["ans[i] = prefix\nprefix *= nums[i]", "Assign **before** multiplying so `ans[i]` excludes `nums[i]` itself."],
    ["for i in range(n - 1, -1, -1):", "Walk backwards: n-1, n-2, …, 0."],
    ["ans[i] *= suffix\nsuffix *= nums[i]", "Same trick from the right: multiply in everything to the right, then include nums[i] for the next index."],
  ],
  take: "**\"Everything except i\" → combine a prefix pass and a suffix pass.** The same idea appears in Trapping Rain Water (max-left / max-right).",
  mist: ["Using division: it's forbidden, and it divides by zero when nums contains 0.", "Updating prefix before assigning (that would include nums[i])."],
},
{
  id: "valid-sudoku", t: "Valid Sudoku", lc: 36, d: "Medium", p: "Hash Sets (rows / cols / boxes)",
  q: "Determine whether a 9×9 Sudoku board is **valid**. Only the filled cells need to be checked:\n\n1. Each row contains digits 1–9 without repetition.\n2. Each column contains digits 1–9 without repetition.\n3. Each of the nine 3×3 sub-boxes contains digits 1–9 without repetition.\n\nEmpty cells are `\".\"`. A valid board doesn't need to be solvable.",
  ex: [["a standard partially-filled board", "True", "No repeats in any row, column or box."], ["same board but top-left '5' changed to '8'", "False", "Two 8s in the top-left 3×3 box (and in column 0)."]],
  c: ["board is 9×9", "cells are '1'-'9' or '.'"],
  hint: "Keep a set of seen digits for each row, each column and each box. Which box is cell (r, c) in? Try `(r // 3, c // 3)`.",
  brute: {
    idea: "Check each of the 27 units (9 rows, 9 columns, 9 boxes) separately, collecting digits and looking for repeats. This is actually also O(81) = O(1), but it takes three separate passes.",
    code: R`
class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        def ok(cells):
            digits = [c for c in cells if c != "."]
            return len(digits) == len(set(digits))

        for i in range(9):
            if not ok(board[i]):                                   # row i
                return False
            if not ok([board[r][i] for r in range(9)]):            # column i
                return False
        for br in range(0, 9, 3):
            for bc in range(0, 9, 3):
                box = [board[r][c] for r in range(br, br + 3) for c in range(bc, bc + 3)]
                if not ok(box):
                    return False
        return True`,
    tc: "O(81)", sc: "O(9)", bad: "Perfectly acceptable. The one-pass version is cleaner and is the one interviewers like.",
  },
  opt: {
    idea: "One pass over the 81 cells. Keep 9 row sets, 9 column sets and 9 box sets. Cell `(r, c)` belongs to box `(r // 3) * 3 + c // 3` (0–8). If a digit is already in its row, column or box set → invalid.",
    steps: ["Create `rows`, `cols`, `boxes` as 9 empty sets each.", "For every cell with digit `v`: compute `b = (r // 3) * 3 + c // 3`.", "If `v` is in `rows[r]` or `cols[c]` or `boxes[b]` → return `False`.", "Otherwise add `v` to all three.", "Return `True`."],
    code: R`
class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == ".":
                    continue
                b = (r // 3) * 3 + c // 3          # box index 0..8
                if v in rows[r] or v in cols[c] or v in boxes[b]:
                    return False
                rows[r].add(v)
                cols[c].add(v)
                boxes[b].add(v)
        return True`,
    tc: "O(81) = O(1)", tw: "Fixed-size board. For an n×n board it's O(n²).", sc: "O(81)", sw: "",
  },
  run: R`
board = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"],
]
s = Solution()
print(s.isValidSudoku(board))
board[0][0] = "8"           # now two 8s in column 0 and in the top-left box
print(s.isValidSudoku(board))`,
  out: R`
True
False`,
  dryOn: "box index formula",
  dry: { h: ["cell (r, c)", "r // 3", "c // 3", "box = (r//3)*3 + c//3"], r: [["(0, 0)", 0, 0, 0], ["(1, 5)", 0, 1, 1], ["(4, 4)", 1, 1, 4], ["(7, 2)", 2, 0, 6], ["(8, 8)", 2, 2, 8]] },
  expl: [
    ["rows = [set() for _ in range(9)]", "Nine independent sets. (`[set()] * 9` would share one set!)"],
    ["if v == \".\":\n    continue", "Empty cells don't matter."],
    ["b = (r // 3) * 3 + c // 3", "Integer division maps rows 0–2 → 0, 3–5 → 1, 6–8 → 2. The same for columns. Combine them into 0–8."],
    ["if v in rows[r] or v in cols[c] or v in boxes[b]:", "A repeat in any of the three units makes the board invalid."],
  ],
  alt: { idea: "Single set of tagged tuples: add `(v, 'r', r)`, `(v, 'c', c)`, `(v, r//3, c//3)`. If any is already present, return False.", code: R`
class Solution:
    def isValidSudoku(self, board):
        seen = set()
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == ".":
                    continue
                keys = [(v, "row", r), (v, "col", c), (v, r // 3, c // 3)]
                if any(k in seen for k in keys):
                    return False
                seen.update(keys)
        return True` },
  take: "**Grid with region constraints → index regions with integer division** (`r // 3, c // 3`) and use one hash set per region.",
  mist: ["Trying to *solve* the sudoku. Only validity is asked.", "`[set()] * 9`: aliasing bug, all nine entries are the same set."],
},
{
  id: "longest-consecutive-sequence", t: "Longest Consecutive Sequence", lc: 128, d: "Medium", p: "Hash Set (sequence starts)",
  q: "Given an **unsorted** array of integers `nums`, return the length of the longest run of consecutive values (like 1, 2, 3, 4). The values don't need to be adjacent in the array.\n\nYou must write an O(n) algorithm.",
  ex: [["nums = [100,4,200,1,3,2]", "4", "The run 1, 2, 3, 4 has length 4."], ["nums = [0,3,7,2,5,8,4,6,0,1]", "9", "0 through 8."]],
  c: ["0 ≤ len(nums) ≤ 10^5"],
  hint: "Put everything in a set. A number `x` is the **start** of a run only if `x - 1` is not in the set. Count upward only from starts.",
  brute: {
    idea: "Sort the numbers, then scan, counting the current run (skip duplicates, reset when there's a gap).",
    code: R`
class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        if not nums:
            return 0
        nums = sorted(set(nums))
        best = cur = 1
        for i in range(1, len(nums)):
            if nums[i] == nums[i - 1] + 1:
                cur += 1
            else:
                cur = 1
            best = max(best, cur)
        return best`,
    tc: "O(n log n)", sc: "O(n)", bad: "Good answer, but the problem explicitly demands O(n).",
  },
  opt: {
    idea: "Store all numbers in a set for O(1) lookups. For each number `x`, if `x - 1` is **not** in the set, then `x` starts a run. From a start, count `x+1, x+2, …` while they exist.\n\nBecause we only count upward from starts, each number is visited by at most one counting loop, so the total is O(n) even though there's a nested `while`.",
    steps: ["`s = set(nums)`.", "For each `x` in `s`: if `x - 1 in s`, skip it (it's not a start).", "Otherwise `length = 1`, and while `x + length in s`: `length += 1`.", "Track the max length."],
    code: R`
class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        s = set(nums)
        best = 0
        for x in s:
            if x - 1 not in s:              # x is the START of a run
                length = 1
                while x + length in s:
                    length += 1
                best = max(best, length)
        return best`,
    tc: "O(n)", tw: "Each number is checked once in the for-loop and counted at most once inside a while-loop.", sc: "O(n)", sw: "The set.",
  },
  run: R`
s = Solution()
print(s.longestConsecutive([100, 4, 200, 1, 3, 2]))
print(s.longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]))
print(s.longestConsecutive([]))`,
  out: R`
4
9
0`,
  dryOn: "nums = [100,4,200,1,3,2]",
  dry: { h: ["x", "x−1 in set?", "action", "best"], r: [[100, "99 → no", "start: 101? no → length 1", 1], [4, "3 → yes", "skip (not a start)", 1], [200, "199 → no", "start: length 1", 1], [1, "0 → no", "start: 2 ✓ 3 ✓ 4 ✓ 5 ✗ → length 4", 4], [3, "yes", "skip", 4], [2, "yes", "skip", 4]] },
  expl: [
    ["s = set(nums)", "Removes duplicates and gives O(1) membership."],
    ["if x - 1 not in s:", "The key trick: only start counting at the smallest element of each run."],
    ["while x + length in s:\n    length += 1", "Extend the run upward."],
    ["for x in s:", "Iterate the set, not `nums`, to avoid re-processing duplicate starts (important for O(n) on inputs like [1,1,1,…])."],
  ],
  take: "**Need O(n) on unsorted data where sorting would help → hash set plus \"only start from the beginning of a chain\".** The nested loop is still linear overall (amortized analysis).",
  mist: ["Counting from every element (no start check) → O(n²) on one long run.", "Looping over `nums` with many duplicate starts can be slow. Loop over the set."],
},
]);
