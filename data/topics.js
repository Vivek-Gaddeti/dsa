/* DSA Topics — one section per data structure / algorithm family */
TOPICS.push(
/* ======================================================= FOUNDATIONS */
{
  id: "approach", group: "Foundations", title: "How to Solve Any Problem",
  sub: "A repeatable process for interviews. Use it on every NeetCode problem until it becomes a habit.",
  blocks: [
    ["h", "The 7-step method"],
    ["steps", [
      "**Understand.** Restate the problem in your own words. Ask about input size, value ranges, duplicates, negatives, empty input, and sorted or unsorted data.",
      "**Examples.** Work 2–3 small examples by hand, including an edge case (empty, one element, all equal).",
      "**Brute force.** Say the simplest correct solution and its complexity out loud. That's a valid starting point.",
      "**Spot the pattern.** Look at the constraints and keywords (see the table below). Ask which work the brute force repeats.",
      "**Plan the optimal approach.** Write the steps as comments, and confirm the complexity before coding.",
      "**Code.** Use clean names and small helpers. Handle edge cases explicitly.",
      "**Test.** Dry-run your code on an example, then on the edge cases. Fix any off-by-one errors.",
    ]],
    ["h", "Constraints tell you the target complexity"],
    ["p", "A typical judge does about **10^7–10^8 simple operations per second** (Python is closer to 10^7). Work backwards from n:"],
    ["table", ["n up to", "Target complexity", "Typical techniques"], [
      ["10–12", "O(n!) / O(2ⁿ·n)", "Permutations, backtracking"],
      ["20–25", "O(2ⁿ)", "Subsets, bitmask DP"],
      ["100–500", "O(n³)", "Interval DP, Floyd–Warshall"],
      ["1,000–5,000", "O(n²)", "2-D DP, nested loops"],
      ["10^5 – 10^6", "O(n log n) or O(n)", "Sorting, heaps, binary search, two pointers, hashing"],
      ["10^9+", "O(log n) or O(1)", "Binary search on the answer, math"],
    ]],
    ["h", "Keyword → pattern cheat sheet"],
    ["table", ["If the problem says…", "Think of…"], [
      ["sorted array, find pair / target", "[Two Pointers](patterns.html#two-pointers), [Binary Search](patterns.html#binary-search-index)"],
      ["subarray / substring, longest / shortest / contains", "[Sliding Window](patterns.html#sliding-window-variable)"],
      ["subarray sum equals k, range sums", "[Prefix Sum + Hash Map](patterns.html#prefix-sum)"],
      ["seen before? count? group?", "[Hashing](patterns.html#hashing)"],
      ["next greater / smaller, span, histogram", "[Monotonic Stack](patterns.html#monotonic-stack)"],
      ["top k, k-th largest, merge k sorted", "[Heap](patterns.html#top-k)"],
      ["minimum X such that condition", "[Binary Search on Answer](patterns.html#binary-search-answer)"],
      ["linked list cycle / middle", "[Fast & Slow](patterns.html#fast-slow)"],
      ["all combinations / permutations / subsets", "[Backtracking](patterns.html#backtracking)"],
      ["grid, islands, connected regions", "[Graph DFS/BFS](patterns.html#graph-traversal)"],
      ["shortest path, unweighted", "BFS. Weighted → [Dijkstra](patterns.html#shortest-path)"],
      ["prerequisites, ordering, dependencies", "[Topological Sort](patterns.html#topological-sort)"],
      ["count ways, min/max cost, can you reach", "[Dynamic Programming](patterns.html#dp-1d)"],
      ["intervals, meetings, overlapping", "[Intervals](patterns.html#intervals)"],
      ["prefix / dictionary of words", "[Trie](topics.html#trie)"],
    ]],
    ["tip", "If you're stuck for 20–30 minutes, read only the **hint** on the NeetCode page, then try again. Read the solution after 45 minutes. Then **re-solve it from memory the next day**. The Revision tab schedules that for you."],
  ],
},
{
  id: "complexity", group: "Foundations", title: "Big-O & Complexity Analysis",
  sub: "How the running time or memory grows as the input grows. It's the language every DSA conversation uses.",
  blocks: [
    ["p", "**Big-O** describes the *growth rate* in the worst case, ignoring constants and smaller terms: `3n² + 5n + 100` is **O(n²)**. What matters is how it scales when n becomes huge."],
    ["diagram", "bigo", [], "Growth of common complexities. For large n, O(n²) and O(2ⁿ) explode."],
    ["table", ["Complexity", "Name", "n = 10^6 → ops", "Example"], [
      ["O(1)", "constant", "1", "array index, dict lookup"],
      ["O(log n)", "logarithmic", "~20", "binary search, heap push"],
      ["O(n)", "linear", "10^6", "one loop"],
      ["O(n log n)", "linearithmic", "~2·10^7", "sorting"],
      ["O(n²)", "quadratic", "10^12 ✗", "two nested loops"],
      ["O(2ⁿ)", "exponential", "✗✗✗", "all subsets"],
    ]],
    ["h", "How to compute it"],
    ["list", [
      "**Sequential steps add:** O(n) + O(n log n) = O(n log n), because the biggest term wins.",
      "**Nested loops multiply:** for i in n: for j in n → O(n²).",
      "**Halving each step** → O(log n): binary search, `while n: n //= 2`.",
      "**Recursion:** (number of calls) × (work per call). For example, fib without memo makes ~2ⁿ calls → O(2ⁿ).",
      "**Amortized:** `list.append` is O(1) on average, even though it occasionally resizes (copies) the list.",
    ]],
    ["code", R`
def linear(n):            # O(n)
    total = 0
    for i in range(n):
        total += i
    return total

def quadratic(n):         # O(n^2)
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
    return count

def logarithmic(n):       # O(log n): n halves every step
    steps = 0
    while n > 1:
        n //= 2
        steps += 1
    return steps

print(linear(10), quadratic(10), logarithmic(1_000_000))`, "45 100 19"],
    ["h", "Space complexity"],
    ["p", "Extra memory beyond the input: new lists, dicts, sets, **and the recursion stack** (depth d → O(d) space). Interviewers usually don't count the output."],
    ["warn", "Hidden costs in Python: slicing `a[i:j]` copies (O(j−i)), `x in list` is O(n), `list.pop(0)` / `insert(0, x)` are O(n), and string `+=` in a loop can be O(n²). See the [Python for DSA page](python-dsa.html)."],
    ["h", "Best / average / worst"],
    ["p", "Quicksort: average O(n log n), worst O(n²). Hash tables: average O(1), worst O(n). In interviews, quote the **worst case** unless you explicitly say \"average\" or \"amortized\"."],
  ],
},
{
  id: "recursion", group: "Foundations", title: "Recursion",
  sub: "A function that solves a problem by calling itself on smaller inputs. It's the foundation of trees, backtracking, divide & conquer and DP.",
  blocks: [
    ["p", "Every recursive function needs: (1) a **base case** that stops, and (2) a **recursive case** that moves toward the base case. Trust that the recursive call works for the smaller input (the \"leap of faith\")."],
    ["diagram", "tree", [["f(4)", "f(3)", "f(2)", "f(2)", "f(1)", "f(1)", "f(0)", "f(1)", "f(0)"], { hl: [2, 3], gap: 64 }], "Recursion tree of naive fib(4). The highlighted f(2) is computed twice, and that repetition is why memoization exists."],
    ["code", R`
def factorial(n):
    if n <= 1:              # base case
        return 1
    return n * factorial(n - 1)   # smaller problem

def fib(n, memo={}):
    if n < 2:
        return n
    if n not in memo:       # memoization: compute each n once
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]

def reverse(s):
    return s if len(s) <= 1 else reverse(s[1:]) + s[0]

print(factorial(5), fib(50), reverse("hello"))`, "120 12586269025 olleh"],
    ["h", "The call stack"],
    ["p", "Each call gets a **stack frame** (its own local variables). The depth of the recursion = the memory used. Python's default limit is ~1000 frames, so deep recursion (e.g. DFS on a 10^5-node path) raises `RecursionError`."],
    ["code", R`
import sys
sys.setrecursionlimit(10**6)   # raise the limit for deep DFS (use with care)

from functools import lru_cache

@lru_cache(maxsize=None)        # same as @functools.cache
def ways(n):
    return 1 if n <= 1 else ways(n - 1) + ways(n - 2)

print(ways(80))`, "37889062373143906"],
    ["h", "Types of recursion you'll use"],
    ["table", ["Kind", "Shape", "Examples"], [
      ["Linear", "one call per level", "factorial, linked-list recursion"],
      ["Tree / branching", "2+ calls per level", "fib, subsets, tree DFS"],
      ["Divide & conquer", "split, solve halves, combine", "merge sort, quick sort"],
      ["Backtracking", "choose → recurse → undo", "permutations, N-Queens"],
      ["Memoized (top-down DP)", "branching + cache", "climbing stairs, coin change"],
    ]],
    ["tip", "To convert recursion into iteration, use an explicit stack: push (state) tuples, and pop and process them in a while loop."],
    ["h", "Practice"],
    ["list", ["[Subsets](neetcode.html#p/subsets)", "[Maximum Depth of Binary Tree](neetcode.html#p/maximum-depth-of-binary-tree)", "[Climbing Stairs](neetcode.html#p/climbing-stairs)", "[Pow(x, n)](neetcode.html#p/powx-n)"]],
  ],
},
/* ======================================================= LINEAR */
{
  id: "arrays", group: "Linear Structures", title: "Arrays (Python lists)",
  sub: "A contiguous block of elements accessed by index. The most important structure in interviews.",
  blocks: [
    ["diagram", "arr", [[5, 8, 2, 9, 1, 7], { hl: [3], ptr: { 3: "nums[3]" }, title: "nums" }], "Index → value in O(1): the address is base + index × size."],
    ["p", "A Python `list` is a **dynamic array**: it stores references contiguously and grows by over-allocating, so `append` is amortized O(1)."],
    ["table", ["Operation", "Code", "Time"], [
      ["access / update", "`a[i]`, `a[i] = x`", "O(1)"],
      ["append / pop end", "`a.append(x)`, `a.pop()`", "O(1) amortized"],
      ["insert / delete middle", "`a.insert(i, x)`, `a.pop(i)`, `del a[i]`", "O(n)"],
      ["search", "`x in a`, `a.index(x)`", "O(n)"],
      ["slice copy", "`a[i:j]`", "O(j − i)"],
      ["sort", "`a.sort()`, `sorted(a)`", "O(n log n)"],
      ["length", "`len(a)`", "O(1)"],
    ]],
    ["code", R`
nums = [5, 8, 2, 9, 1]
nums.append(7)              # [5, 8, 2, 9, 1, 7]
nums.insert(0, 4)           # [4, 5, 8, 2, 9, 1, 7]  (O(n): shifts everything)
last = nums.pop()           # removes 7
nums.sort()                 # in place
print(nums, last)
print(nums[::-1], nums[1:4], nums[-1])
grid = [[0] * 3 for _ in range(2)]   # correct 2D list
grid[0][1] = 5
print(grid)`, "[1, 2, 4, 5, 8, 9] 7\n[9, 8, 5, 4, 2, 1] [2, 4, 5] 9\n[[0, 5, 0], [0, 0, 0]]"],
    ["danger", "`[[0] * 3] * 2` creates **two references to the same row**, so changing one row changes both. Always build 2D lists with a comprehension."],
    ["h", "Core array techniques"],
    ["list", [
      "[Two Pointers](patterns.html#two-pointers): sorted arrays, pairs, in-place partitioning",
      "[Sliding Window](patterns.html#sliding-window-variable): contiguous subarrays",
      "[Prefix Sum](patterns.html#prefix-sum): range sums in O(1)",
      "[Kadane](patterns.html#kadane): maximum subarray",
      "In-place tricks: swap, reverse, use the sign/index as a marker",
    ]],
    ["h", "Practice"],
    ["list", ["[Two Sum](neetcode.html#p/two-sum)", "[Product of Array Except Self](neetcode.html#p/product-of-array-except-self)", "[Rotate Image](neetcode.html#p/rotate-image)", "[Spiral Matrix](neetcode.html#p/spiral-matrix)"]],
  ],
},
{
  id: "strings", group: "Linear Structures", title: "Strings",
  sub: "Immutable sequences of characters. They behave like arrays, but every \"modification\" creates a new string.",
  blocks: [
    ["p", "Strings are **immutable** in Python. `s[0] = 'x'` is an error, and `s += c` builds a new string. To build strings in loops, collect the parts in a list and `''.join(parts)` once at the end (O(n) total)."],
    ["table", ["Operation", "Code", "Time"], [
      ["index / slice", "`s[i]`, `s[i:j]`", "O(1) / O(j−i)"],
      ["concatenate", "`a + b`", "O(len(a) + len(b))"],
      ["join", "`''.join(list_of_str)`", "O(total length)"],
      ["find substring", "`t in s`, `s.find(t)`", "O(n·m) worst"],
      ["reverse", "`s[::-1]`", "O(n)"],
      ["char ↔ code", "`ord('a')` = 97, `chr(97)` = 'a'", "O(1)"],
      ["checks", "`isalnum()`, `isdigit()`, `isalpha()`, `lower()`", "O(n)"],
    ]],
    ["code", R`
s = "Hello, World"
print(s.lower(), s.split(", "), s[::-1])
print(ord("a"), chr(ord("a") + 2), ord("c") - ord("a"))

# build strings efficiently
parts = []
for ch in "abc":
    parts.append(ch * 2)
print("".join(parts))

# count characters
from collections import Counter
print(Counter("banana").most_common(2))

# palindrome check, ignoring non-letters
t = "A man, a plan, a canal: Panama"
clean = [c.lower() for c in t if c.isalnum()]
print(clean == clean[::-1])`, "hello, world ['Hello', 'World'] dlroW ,olleH\n97 c 2\naabbcc\n[('a', 3), ('n', 2)]\nTrue"],
    ["h", "Common string patterns"],
    ["table", ["Problem type", "Technique"], [
      ["anagram / permutation", "frequency count (Counter or a 26-int array)"],
      ["longest substring with a property", "sliding window + hash map"],
      ["palindromes", "two pointers or expand around center"],
      ["matching two strings", "2-D DP (LCS, edit distance)"],
      ["many words / prefixes", "Trie"],
      ["parsing brackets / expressions", "Stack"],
    ]],
    ["h", "Practice"],
    ["list", ["[Valid Anagram](neetcode.html#p/valid-anagram)", "[Longest Substring Without Repeating Characters](neetcode.html#p/longest-substring-without-repeating-characters)", "[Longest Palindromic Substring](neetcode.html#p/longest-palindromic-substring)", "[Encode and Decode Strings](neetcode.html#p/encode-and-decode-strings)"]],
  ],
},
{
  id: "hashing", group: "Linear Structures", title: "Hash Maps & Hash Sets",
  sub: "O(1) average insert, delete and lookup by key. The #1 tool for turning O(n²) into O(n).",
  blocks: [
    ["p", "A hash table runs each key through a **hash function** to get a bucket index. Lookups go straight to that bucket instead of scanning everything. When two keys land in the same bucket (a **collision**), they're chained or probed. Python's `dict` and `set` are hash tables."],
    ["diagram", "hash", [[["'apple'", 0], ["'cat'", 2], ["'dog'", 2], ["'zebra'", 4]], 5], "hash(key) % 5 picks a bucket. 'cat' and 'dog' collide in bucket 2 and are chained."],
    ["table", ["Operation", "dict", "set", "Time"], [
      ["insert", "`d[k] = v`", "`s.add(x)`", "O(1) avg"],
      ["lookup", "`d[k]`, `d.get(k, 0)`", "`x in s`", "O(1) avg"],
      ["delete", "`del d[k]`, `d.pop(k)`", "`s.remove(x)`, `s.discard(x)`", "O(1) avg"],
      ["iterate", "`for k, v in d.items()`", "`for x in s`", "O(n)"],
      ["set algebra", "", "`a | b`, `a & b`, `a - b`", "O(len)"],
    ]],
    ["code", R`
from collections import defaultdict, Counter

# frequency map
freq = {}
for x in [3, 1, 3, 2, 3]:
    freq[x] = freq.get(x, 0) + 1
print(freq)

# Counter does it for you
print(Counter("mississippi"))

# grouping
groups = defaultdict(list)
for w in ["eat", "tea", "tan", "ate"]:
    groups["".join(sorted(w))].append(w)
print(dict(groups))

# set operations
a, b = {1, 2, 3}, {2, 3, 4}
print(a & b, a | b, a - b)`, "{3: 3, 1: 1, 2: 1}\nCounter({'i': 4, 's': 4, 'p': 2, 'm': 1})\n{'aet': ['eat', 'tea', 'ate'], 'ant': ['tan']}\n{2, 3} {1, 2, 3, 4} {1}"],
    ["note", "Keys must be **hashable** (immutable): int, str, tuple, frozenset work as keys. A list, dict or set can't be a key. Convert a list to a tuple first."],
    ["h", "When to use what"],
    ["table", ["Need", "Use"], [
      ["\"Have I seen x?\"", "`set`"],
      ["count occurrences", "`Counter` / dict"],
      ["value → index / position", "`dict`"],
      ["group items by a key", "`defaultdict(list)`"],
      ["insertion-ordered + move to end", "`OrderedDict` (LRU cache)"],
    ]],
    ["h", "Practice"],
    ["list", ["[Contains Duplicate](neetcode.html#p/contains-duplicate)", "[Two Sum](neetcode.html#p/two-sum)", "[Group Anagrams](neetcode.html#p/group-anagrams)", "[Longest Consecutive Sequence](neetcode.html#p/longest-consecutive-sequence)"]],
  ],
},
{
  id: "linked-list", group: "Linear Structures", title: "Linked Lists",
  sub: "Nodes connected by pointers. O(1) insert/delete if you already hold the node, but no random access.",
  blocks: [
    ["diagram", "list", [[1, 2, 3, 4], { ptr: { 0: "head" } }], "Singly linked list: each node stores val and next."],
    ["diagram", "list", [[3, 2, 0, -4], { cycle: 1, ptr: { 0: "head" } }], "A cycle: the tail points back to node 2. Detect it with fast & slow pointers."],
    ["table", ["Operation", "Time", "Note"], [
      ["access k-th", "O(k)", "must walk from the head"],
      ["insert/delete at head", "O(1)", ""],
      ["insert/delete after a known node", "O(1)", "just relink pointers"],
      ["search", "O(n)", ""],
      ["delete a given node (doubly linked)", "O(1)", "prev and next pointers"],
    ]],
    ["code", R`
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# build 1 -> 2 -> 3
head = ListNode(1, ListNode(2, ListNode(3)))

# traverse
cur, vals = head, []
while cur:
    vals.append(cur.val)
    cur = cur.next
print(vals)

# insert 99 after the head
head.next = ListNode(99, head.next)

# delete the node after the head
head.next = head.next.next

# reverse in place
prev, cur = None, head
while cur:
    cur.next, prev, cur = prev, cur, cur.next
out = []
while prev:
    out.append(prev.val); prev = prev.next
print(out)`, "[1, 2, 3]\n[3, 2, 1]"],
    ["h", "The 5 linked-list techniques"],
    ["list", [
      "**Dummy head node:** simplifies edge cases when the head might change.",
      "**Fast & slow pointers:** middle node, cycle detection, k-th from the end.",
      "**In-place reversal:** prev / curr / next.",
      "**Merge** two sorted lists (the building block of merge sort and k-way merge).",
      "**Hash map node → node** for copying structures with extra pointers.",
    ]],
    ["viz", "reverseList"],
    ["h", "Practice"],
    ["list", ["[Reverse Linked List](neetcode.html#p/reverse-linked-list)", "[Linked List Cycle](neetcode.html#p/linked-list-cycle)", "[Reorder List](neetcode.html#p/reorder-list)", "[LRU Cache](neetcode.html#p/lru-cache)"]],
  ],
},
{
  id: "stack-queue", group: "Linear Structures", title: "Stacks, Queues & Deques",
  sub: "Stack = Last In First Out. Queue = First In First Out. Deque = both ends in O(1).",
  blocks: [
    ["diagram", "stack", [["3", "7", "1", "9"]], "Stack: push and pop at the top only."],
    ["diagram", "queue", [["a", "b", "c", "d"]], "Queue: push at the back, pop from the front."],
    ["table", ["Structure", "Python", "Push", "Pop", "Peek"], [
      ["Stack", "`list`", "`s.append(x)` O(1)", "`s.pop()` O(1)", "`s[-1]`"],
      ["Queue", "`collections.deque`", "`q.append(x)` O(1)", "`q.popleft()` O(1)", "`q[0]`"],
      ["Deque", "`collections.deque`", "`appendleft` / `append`", "`popleft` / `pop`", "`q[0]`, `q[-1]`"],
    ]],
    ["danger", "Never use `list.pop(0)` as a queue: it's O(n) because every element shifts. Use `deque.popleft()`."],
    ["code", R`
from collections import deque

stack = []
for x in [1, 2, 3]:
    stack.append(x)
print(stack.pop(), stack)          # LIFO

q = deque([1, 2, 3])
q.append(4)
print(q.popleft(), list(q))        # FIFO

d = deque(maxlen=3)                # keeps only the last 3 items
for x in range(6):
    d.append(x)
print(list(d))`, "3 [1, 2]\n1 [2, 3, 4]\n[3, 4, 5]"],
    ["h", "When to reach for each"],
    ["table", ["Use", "When"], [
      ["Stack", "matching brackets, undo, DFS (iterative), expression evaluation, monotonic stack"],
      ["Queue", "BFS, level-order traversal, task scheduling"],
      ["Deque", "sliding window max/min (monotonic deque), 0-1 BFS, palindromes"],
    ]],
    ["viz", "monoStack"],
    ["h", "Practice"],
    ["list", ["[Valid Parentheses](neetcode.html#p/valid-parentheses)", "[Min Stack](neetcode.html#p/min-stack)", "[Daily Temperatures](neetcode.html#p/daily-temperatures)", "[Sliding Window Maximum](neetcode.html#p/sliding-window-maximum)"]],
  ],
},
/* ======================================================= ALGORITHMS */
{
  id: "sorting", group: "Core Algorithms", title: "Sorting Algorithms",
  sub: "You'll mostly call `sort()`, but you must know how the main algorithms work and what they cost.",
  blocks: [
    ["table", ["Algorithm", "Best", "Average", "Worst", "Space", "Stable?", "Idea"], [
      ["Bubble", "O(n)", "O(n²)", "O(n²)", "O(1)", "yes", "swap adjacent out-of-order pairs"],
      ["Selection", "O(n²)", "O(n²)", "O(n²)", "O(1)", "no", "pick the min, put it in front"],
      ["Insertion", "O(n)", "O(n²)", "O(n²)", "O(1)", "yes", "insert each item into the sorted prefix"],
      ["Merge", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "yes", "split in half, sort, merge"],
      ["Quick", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "no", "partition around a pivot"],
      ["Heap", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)", "no", "build heap, extract max"],
      ["Counting / Bucket", "O(n + k)", "O(n + k)", "O(n + k)", "O(k)", "yes", "values in a small range"],
      ["**Timsort** (Python)", "O(n)", "O(n log n)", "O(n log n)", "O(n)", "yes", "merge + insertion on natural runs"],
    ]],
    ["viz", "bubbleSort"],
    ["viz", "partition"],
    ["h", "Merge sort"],
    ["code", R`
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):        # merge two sorted halves
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]

print(merge_sort([5, 2, 9, 1, 5, 6]))`, "[1, 2, 5, 5, 6, 9]"],
    ["h", "Quick sort"],
    ["code", R`
def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    pivot, i = a[hi], lo
    for j in range(lo, hi):                 # Lomuto partition
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]               # pivot to its final spot
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)
    return a

print(quick_sort([7, 2, 1, 8, 6, 3, 5, 4]))`, "[1, 2, 3, 4, 5, 6, 7, 8]"],
    ["h", "Sorting in Python like a pro"],
    ["code", R`
people = [("bob", 25), ("alice", 30), ("carol", 25)]
print(sorted(people, key=lambda p: p[1]))               # by age (stable!)
print(sorted(people, key=lambda p: (-p[1], p[0])))      # age desc, then name asc
words = ["banana", "Apple", "cherry"]
print(sorted(words, key=str.lower))

from functools import cmp_to_key
nums = [3, 30, 34, 5, 9]                                 # "Largest Number" trick
order = sorted(map(str, nums), key=cmp_to_key(lambda a, b: -1 if a + b > b + a else 1))
print("".join(order))`, "[('bob', 25), ('carol', 25), ('alice', 30)]\n[('alice', 30), ('bob', 25), ('carol', 25)]\n['Apple', 'banana', 'cherry']\n9534330"],
    ["tip", "**Stable** means equal elements keep their original order. Python's sort is stable, so you can sort by a secondary key first and then by the primary key."],
    ["h", "Practice"],
    ["list", ["[Merge Intervals](neetcode.html#p/merge-intervals)", "[Kth Largest Element in an Array](neetcode.html#p/kth-largest-element-in-an-array) (quickselect)", "[Top K Frequent Elements](neetcode.html#p/top-k-frequent-elements) (bucket sort)"]],
  ],
},
{
  id: "binary-search", group: "Core Algorithms", title: "Binary Search",
  sub: "Halve the search space every step: O(log n). It works on any monotonic yes/no question, not just sorted arrays.",
  blocks: [
    ["viz", "binarySearch"],
    ["h", "Three templates to memorize"],
    ["code", R`
def find_exact(a, target):          # 1) exact match, [lo, hi] inclusive
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target: return mid
        if a[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1

def first_true(lo, hi, ok):         # 2) first x in [lo, hi] with ok(x) True
    while lo < hi:
        mid = (lo + hi) // 2
        if ok(mid): hi = mid        # mid might be the answer
        else: lo = mid + 1
    return lo

def last_true(lo, hi, ok):          # 3) last x with ok(x) True
    while lo < hi:
        mid = (lo + hi + 1) // 2    # round UP to avoid an infinite loop
        if ok(mid): lo = mid
        else: hi = mid - 1
    return lo

a = [1, 3, 5, 7, 9, 11]
print(find_exact(a, 7))
print(first_true(0, len(a) - 1, lambda i: a[i] >= 6))   # first index with value >= 6
print(last_true(0, 100, lambda x: x * x <= 50))          # integer sqrt of 50`, "3\n3\n7"],
    ["h", "The bisect module"],
    ["code", R`
import bisect
a = [1, 2, 4, 4, 4, 7]
print(bisect.bisect_left(a, 4))    # first index where 4 could go (first >= 4)
print(bisect.bisect_right(a, 4))   # index after the last 4 (first > 4)
bisect.insort(a, 5)                # insert keeping it sorted (O(n) shift)
print(a)
print(bisect.bisect_right(a, 4) - bisect.bisect_left(a, 4), "copies of 4")`, "2\n5\n[1, 2, 4, 4, 4, 5, 7]\n3 copies of 4"],
    ["h", "Binary search on the answer"],
    ["p", "When asked for the **minimum/maximum value** that satisfies a condition, and the condition is monotonic (if x works, then x+1 works too), binary search over the possible answers and test each one with a `feasible(x)` function. Examples: [Koko Eating Bananas](neetcode.html#p/koko-eating-bananas), ship packages within D days, split array largest sum."],
    ["warn", "Most bugs come from mixing templates. Pick one invariant (inclusive `[lo, hi]` or half-open `[lo, hi)`) and keep it consistent across the loop condition and the updates."],
    ["h", "Practice"],
    ["list", ["[Binary Search](neetcode.html#p/binary-search)", "[Search in Rotated Sorted Array](neetcode.html#p/search-in-rotated-sorted-array)", "[Koko Eating Bananas](neetcode.html#p/koko-eating-bananas)", "[Median of Two Sorted Arrays](neetcode.html#p/median-of-two-sorted-arrays)"]],
  ],
},
/* ======================================================= TREES */
{
  id: "trees", group: "Trees & Heaps", title: "Binary Trees",
  sub: "Each node has up to two children. Most tree problems are solved by recursion: \"solve left, solve right, combine\".",
  blocks: [
    ["diagram", "tree", [[1, 2, 3, 4, 5, 6, 7], { hl: [0] }], "Root 1. Leaves 4, 5, 6, 7. Height 3."],
    ["table", ["Term", "Meaning"], [
      ["root / leaf", "top node / node with no children"],
      ["depth / height", "edges from root to node / longest path from node down to a leaf"],
      ["full", "every node has 0 or 2 children"],
      ["complete", "all levels full except maybe the last, which fills left to right (heaps!)"],
      ["balanced", "left and right heights differ by ≤ 1 everywhere → height O(log n)"],
      ["perfect", "all internal nodes have 2 children and all leaves are at the same depth"],
    ]],
    ["h", "Traversals"],
    ["table", ["Order", "Visit sequence", "Example on tree above", "Used for"], [
      ["Preorder", "node, left, right", "1 2 4 5 3 6 7", "copy/serialize a tree"],
      ["Inorder", "left, node, right", "4 2 5 1 6 3 7", "BST → sorted order"],
      ["Postorder", "left, right, node", "4 5 2 6 7 3 1", "delete tree, compute heights"],
      ["Level order (BFS)", "level by level", "1 2 3 4 5 6 7", "shortest depth, views"],
    ]],
    ["viz", "treeDFS"],
    ["viz", "treeBFS"],
    ["code", R`
from collections import deque

class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3, TreeNode(6), TreeNode(7)))

def preorder(n):  return [n.val] + preorder(n.left) + preorder(n.right) if n else []
def inorder(n):   return inorder(n.left) + [n.val] + inorder(n.right) if n else []
def postorder(n): return postorder(n.left) + postorder(n.right) + [n.val] if n else []

def level_order(root):
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft()
            level.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        res.append(level)
    return res

def height(n): return 0 if not n else 1 + max(height(n.left), height(n.right))

print(preorder(root), inorder(root), postorder(root), sep="\n")
print(level_order(root), height(root))`, "[1, 2, 4, 5, 3, 6, 7]\n[4, 2, 5, 1, 6, 3, 7]\n[4, 5, 2, 6, 7, 3, 1]\n[[1], [2, 3], [4, 5, 6, 7]] 3"],
    ["h", "Two ways information flows"],
    ["list", [
      "**Bottom-up (return values):** the children report up and the parent combines. Examples: height, diameter, balanced, max path sum.",
      "**Top-down (parameters):** the parent passes state down. Examples: path sums, the valid BST range, good nodes (the max so far).",
    ]],
    ["h", "Practice"],
    ["list", ["[Invert Binary Tree](neetcode.html#p/invert-binary-tree)", "[Diameter of Binary Tree](neetcode.html#p/diameter-of-binary-tree)", "[Level Order Traversal](neetcode.html#p/binary-tree-level-order-traversal)", "[Binary Tree Maximum Path Sum](neetcode.html#p/binary-tree-maximum-path-sum)"]],
  ],
},
{
  id: "bst", group: "Trees & Heaps", title: "Binary Search Trees",
  sub: "Left subtree < node < right subtree, at every node. Search, insert and delete in O(height).",
  blocks: [
    ["diagram", "tree", [[8, 3, 10, 1, 6, null, 14, null, null, 4, 7], { hl: [0, 1, 4] }], "Searching for 6: 8 → go left → 3 → go right → 6. Each step discards a whole subtree."],
    ["table", ["Operation", "Balanced", "Skewed (worst)"], [
      ["search / insert / delete", "O(log n)", "O(n)"],
      ["min / max", "O(log n)", "O(n)"],
      ["inorder traversal", "O(n), and it comes out sorted", "O(n)"],
    ]],
    ["code", R`
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def insert(root, val):
    if not root:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    while root and root.val != val:
        root = root.left if val < root.val else root.right
    return root is not None

def inorder(n):
    return inorder(n.left) + [n.val] + inorder(n.right) if n else []

root = None
for v in [8, 3, 10, 1, 6, 14, 4, 7]:
    root = insert(root, v)
print(inorder(root))
print(search(root, 6), search(root, 5))`, "[1, 3, 4, 6, 7, 8, 10, 14]\nTrue False"],
    ["note", "Python has no built-in balanced BST. In interviews, use `bisect` on a sorted list, or `heapq` when you only need min/max. The third-party `sortedcontainers.SortedList` is an option where it's allowed."],
    ["h", "Practice"],
    ["list", ["[Validate BST](neetcode.html#p/validate-binary-search-tree)", "[Kth Smallest Element in a BST](neetcode.html#p/kth-smallest-element-in-a-bst)", "[LCA of a BST](neetcode.html#p/lowest-common-ancestor-of-a-binary-search-tree)"]],
  ],
},
{
  id: "heap", group: "Trees & Heaps", title: "Heaps / Priority Queues",
  sub: "Always gives you the smallest (or largest) element in O(1). Push and pop are O(log n).",
  blocks: [
    ["diagram", "tree", [[1, 3, 2, 5, 9, 8], { ok: [0] }], "A min-heap: every parent ≤ its children. It's stored as an array: [1, 3, 2, 5, 9, 8]."],
    ["diagram", "arr", [[1, 3, 2, 5, 9, 8], { ptr: { 0: "root", 1: "2i+1", 2: "2i+2" } }], "Array layout: the children of i are at 2i+1 and 2i+2, and the parent is at (i−1)//2."],
    ["viz", "heapPush"],
    ["table", ["Operation", "heapq", "Time"], [
      ["build from a list", "`heapq.heapify(a)`", "O(n)"],
      ["push", "`heapq.heappush(h, x)`", "O(log n)"],
      ["pop min", "`heapq.heappop(h)`", "O(log n)"],
      ["peek min", "`h[0]`", "O(1)"],
      ["push then pop", "`heapq.heappushpop(h, x)`", "O(log n)"],
      ["k smallest / largest", "`heapq.nsmallest(k, a)`, `nlargest`", "O(n log k)"],
    ]],
    ["code", R`
import heapq

h = [5, 3, 8, 1]
heapq.heapify(h)                  # min-heap
heapq.heappush(h, 2)
print([heapq.heappop(h) for _ in range(len(h))])

# max-heap: push negatives
mx = []
for x in [5, 3, 8, 1]:
    heapq.heappush(mx, -x)
print(-heapq.heappop(mx))

# tuples compare by first element, then second (use as priority, tiebreak)
tasks = [(2, "write"), (1, "plan"), (3, "test")]
heapq.heapify(tasks)
print(heapq.heappop(tasks))
print(heapq.nlargest(2, [4, 1, 7, 3]))`, "[1, 2, 3, 5, 8]\n8\n(1, 'plan')\n[7, 4]"],
    ["h", "Heap patterns"],
    ["list", [
      "[Top-K](patterns.html#top-k): a heap of size k (min-heap to keep the k largest).",
      "[Two heaps](patterns.html#two-heaps): running median.",
      "[K-way merge](patterns.html#k-way-merge): merging k sorted lists.",
      "Dijkstra / Prim: always expand the cheapest frontier node.",
      "Scheduling: always pick the task with the highest priority.",
    ]],
    ["h", "Practice"],
    ["list", ["[Kth Largest in a Stream](neetcode.html#p/kth-largest-element-in-a-stream)", "[K Closest Points](neetcode.html#p/k-closest-points-to-origin)", "[Find Median from Data Stream](neetcode.html#p/find-median-from-data-stream)", "[Merge k Sorted Lists](neetcode.html#p/merge-k-sorted-lists)"]],
  ],
},
{
  id: "trie", group: "Trees & Heaps", title: "Tries (Prefix Trees)",
  sub: "A tree of characters. Insert and search a word in O(word length), no matter how many words are stored.",
  blocks: [
    ["diagram", "trie", [["car", "cat", "cart", "dog", "do"]], "Words: car, cat, cart, dog, do. Green nodes mark the end of a word."],
    ["code", R`
class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.end = True

    def _walk(self, s):
        node = self.root
        for c in s:
            if c not in node.children:
                return None
            node = node.children[c]
        return node

    def search(self, word):
        n = self._walk(word)
        return bool(n and n.end)

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def words_with_prefix(self, prefix):      # autocomplete
        node, out = self._walk(prefix), []
        def dfs(n, path):
            if n.end: out.append(path)
            for c in sorted(n.children):
                dfs(n.children[c], path + c)
        if node: dfs(node, prefix)
        return out

t = Trie()
for w in ["car", "cat", "cart", "dog", "do"]:
    t.insert(w)
print(t.search("car"), t.search("ca"), t.starts_with("ca"))
print(t.words_with_prefix("ca"))`, "True False True\n['car', 'cart', 'cat']"],
    ["table", ["Operation", "Time", "Space"], [["insert / search / prefix", "O(L)", "O(total characters) for the whole trie"]]],
    ["tip", "Use a trie when you have **many words and prefix queries**, or when you search many words at once on a board (Word Search II)."],
    ["h", "Practice"],
    ["list", ["[Implement Trie](neetcode.html#p/implement-trie-prefix-tree)", "[Add and Search Words](neetcode.html#p/design-add-and-search-words-data-structure)", "[Word Search II](neetcode.html#p/word-search-ii)"]],
  ],
},
/* ======================================================= GRAPHS */
{
  id: "graphs", group: "Graphs", title: "Graphs: representation, BFS, DFS",
  sub: "Nodes (vertices) connected by edges. Trees, grids, maps and dependencies are all graphs.",
  blocks: [
    ["diagram", "graph", [{ A: [40, 40], B: [160, 40], C: [40, 150], D: [160, 150], E: [280, 95] }, [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"]], {}], "An undirected graph with 5 nodes and 5 edges."],
    ["table", ["Kind", "Meaning"], [
      ["directed / undirected", "edges have a direction (A→B) or not"],
      ["weighted", "edges have costs"],
      ["cyclic / acyclic", "contains a cycle or not (DAG = directed acyclic graph)"],
      ["connected", "every node is reachable from every other (undirected)"],
      ["implicit", "neighbours are computed on the fly (grids, word ladders)"],
    ]],
    ["h", "Representations"],
    ["code", R`
from collections import defaultdict

edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E")]

adj = defaultdict(list)            # adjacency list: O(V + E) space (most common)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)               # undirected: add both directions
print(dict(adj))

nodes = "ABCDE"
idx = {c: i for i, c in enumerate(nodes)}
matrix = [[0] * 5 for _ in range(5)]   # adjacency matrix: O(V^2) space, O(1) edge check
for u, v in edges:
    matrix[idx[u]][idx[v]] = matrix[idx[v]][idx[u]] = 1
print(matrix[idx["A"]])`, "{'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A', 'D'], 'D': ['B', 'C', 'E'], 'E': ['D']}\n[0, 1, 1, 0, 0]"],
    ["h", "BFS and DFS"],
    ["code", R`
from collections import deque

adj = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C", "E"], "E": ["D"]}

def bfs(start):                      # shortest path in edges (unweighted)
    dist, q = {start: 0}, deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:        # mark when enqueuing
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

def dfs(u, seen=None):               # explores as deep as possible first
    seen = seen if seen is not None else []
    seen.append(u)
    for v in adj[u]:
        if v not in seen:
            dfs(v, seen)
    return seen

print(bfs("A"))
print(dfs("A"))`, "{'A': 0, 'B': 1, 'C': 1, 'D': 2, 'E': 3}\n['A', 'B', 'D', 'C', 'E']"],
    ["table", ["", "BFS", "DFS"], [
      ["data structure", "queue", "stack / recursion"],
      ["finds", "shortest path (unweighted)", "any path, all paths, cycles, components"],
      ["memory", "O(width)", "O(depth)"],
      ["typical use", "levels, nearest, min steps", "connectivity, backtracking, topological order"],
    ]],
    ["viz", "islands"],
    ["h", "Grids are graphs"],
    ["code", R`
grid = ["S.#",
        "..#",
        "#.E"]
R, C = len(grid), len(grid[0])
DIRS = [(1, 0), (-1, 0), (0, 1), (0, -1)]
from collections import deque
q, seen = deque([(0, 0, 0)]), {(0, 0)}
while q:
    r, c, d = q.popleft()
    if grid[r][c] == "E":
        print("steps to exit:", d); break
    for dr, dc in DIRS:
        nr, nc = r + dr, c + dc
        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != "#" and (nr, nc) not in seen:
            seen.add((nr, nc)); q.append((nr, nc, d + 1))`, "steps to exit: 4"],
    ["h", "Which graph algorithm?"],
    ["table", ["Goal", "Algorithm", "Time"], [
      ["traverse / count components", "BFS / DFS / Union-Find", "O(V + E)"],
      ["shortest path, unweighted", "BFS", "O(V + E)"],
      ["shortest path, non-negative weights", "Dijkstra", "O(E log V)"],
      ["shortest path, negative weights / ≤ k edges", "Bellman-Ford", "O(V·E)"],
      ["all-pairs shortest paths (small V)", "Floyd–Warshall", "O(V³)"],
      ["ordering with dependencies", "Topological sort (Kahn / DFS)", "O(V + E)"],
      ["connect everything cheaply", "MST: Prim / Kruskal", "O(E log V)"],
      ["use every edge once", "Hierholzer (Eulerian path)", "O(E)"],
    ]],
    ["h", "Practice"],
    ["list", ["[Number of Islands](neetcode.html#p/number-of-islands)", "[Clone Graph](neetcode.html#p/clone-graph)", "[Course Schedule](neetcode.html#p/course-schedule)", "[Network Delay Time](neetcode.html#p/network-delay-time)"]],
  ],
},
{
  id: "union-find", group: "Graphs", title: "Union-Find (Disjoint Set Union)",
  sub: "Tracks which items are in the same group. Merge and find are both almost O(1).",
  blocks: [
    ["viz", "unionFind"],
    ["code", R`
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                                 # already connected
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra                             # union by size
        self.size[ra] += self.size[rb]
        self.components -= 1
        return True

d = DSU(6)
for a, b in [(0, 1), (1, 2), (3, 4)]:
    d.union(a, b)
print(d.components, d.find(2) == d.find(0), d.find(3) == d.find(0))
print(d.union(0, 2))   # False -> this edge would form a cycle`, "3 True False\nFalse"],
    ["table", ["Use it for", "Example"], [
      ["number of connected components", "[Connected Components](neetcode.html#p/number-of-connected-components-in-an-undirected-graph)"],
      ["cycle detection in an undirected graph", "[Redundant Connection](neetcode.html#p/redundant-connection)"],
      ["Kruskal's MST", "sort edges, union if it doesn't make a cycle"],
      ["dynamic connectivity / grouping", "accounts merge, similar strings"],
    ]],
    ["tip", "With path compression + union by size/rank, each operation is O(α(n)), where α is the inverse Ackermann function (≤ 4 in practice)."],
  ],
},
/* ======================================================= TECHNIQUES */
{
  id: "dp", group: "Techniques", title: "Dynamic Programming",
  sub: "Recursion + remembering answers to overlapping subproblems. Turns exponential into polynomial.",
  blocks: [
    ["p", "Use DP when a problem has **optimal substructure** (the answer is built from answers to smaller problems) and **overlapping subproblems** (the same smaller problems repeat)."],
    ["h", "The 5-step recipe"],
    ["steps", [
      "**State:** what does `dp[i]` (or `dp[i][j]`) mean, in words? This is the hardest and most important step.",
      "**Recurrence:** how does a state depend on smaller states? Think about the *last decision*.",
      "**Base cases:** the smallest states, which you know directly.",
      "**Order:** compute the states so their dependencies are ready (or use memoized recursion).",
      "**Answer + space optimization:** which state is the answer? Can you keep only the last row or the last two values?",
    ]],
    ["h", "Top-down vs bottom-up"],
    ["code", R`
from functools import cache

# top-down: recursion + cache (easy to write from the recurrence)
@cache
def coins_td(amount):
    if amount == 0: return 0
    if amount < 0: return float("inf")
    return 1 + min(coins_td(amount - c) for c in (1, 3, 4))

# bottom-up: fill a table from the base cases (no recursion limit, often faster)
def coins_bu(amount):
    dp = [0] + [float("inf")] * amount
    for a in range(1, amount + 1):
        for c in (1, 3, 4):
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount]

print(coins_td(6), coins_bu(6))`, "2 2"],
    ["viz", "houseRobber"],
    ["viz", "lcs"],
    ["h", "The DP families (learn one problem from each)"],
    ["table", ["Family", "State shape", "Classic problems"], [
      ["1-D linear", "dp[i] from dp[i−1], dp[i−2]", "Climbing Stairs, House Robber, Decode Ways"],
      ["Unbounded knapsack", "dp[amount], reuse items", "Coin Change, Coin Change II"],
      ["0/1 knapsack", "dp[capacity], iterate backwards", "Partition Equal Subset Sum, Target Sum"],
      ["Grid", "dp[r][c] from up/left", "Unique Paths, Minimum Path Sum"],
      ["Two strings", "dp[i][j] over prefixes", "LCS, Edit Distance, Distinct Subsequences"],
      ["Subsequence (LIS)", "dp[i] = best ending at i", "LIS, Russian Doll Envelopes"],
      ["Interval", "dp[l][r] over ranges", "Burst Balloons, Palindrome Partitioning II"],
      ["State machine", "a few named states per step", "Stock with cooldown / fee / k transactions"],
      ["Bitmask", "dp[mask]", "TSP, assign tasks (n ≤ 20)"],
    ]],
    ["warn", "If greedy seems to work, test it on a counter-example first. Coin Change with [1,3,4] and amount 6 breaks largest-coin greedy (4+1+1 instead of 3+3)."],
    ["h", "Practice"],
    ["list", ["[Climbing Stairs](neetcode.html#p/climbing-stairs)", "[Coin Change](neetcode.html#p/coin-change)", "[Longest Common Subsequence](neetcode.html#p/longest-common-subsequence)", "[Edit Distance](neetcode.html#p/edit-distance)"]],
  ],
},
{
  id: "greedy", group: "Techniques", title: "Greedy Algorithms",
  sub: "Make the locally best choice at every step and never look back. It's fast, but only correct when you can prove it.",
  blocks: [
    ["p", "Greedy works when a **locally optimal choice is part of some globally optimal solution** (the greedy-choice property). It's usually justified by an *exchange argument*: swapping any other choice for the greedy one never makes the solution worse."],
    ["table", ["Problem", "Greedy rule", "Why it works"], [
      ["Activity selection / non-overlapping intervals", "pick the earliest END", "leaves the most room for the rest"],
      ["Jump Game", "track the farthest reach", "reachable indices form a prefix"],
      ["Gas Station", "reset the start when the balance < 0", "no start in between can work"],
      ["Huffman coding", "merge the two smallest", "smallest frequencies go deepest"],
      ["Fractional knapsack", "highest value/weight first", "items are divisible"],
    ]],
    ["code", R`
def max_meetings(intervals):           # activity selection
    count, end = 0, float("-inf")
    for s, e in sorted(intervals, key=lambda x: x[1]):
        if s >= end:
            count, end = count + 1, e
    return count

def min_coins_greedy(amount, coins):   # works ONLY for canonical systems
    used = 0
    for c in sorted(coins, reverse=True):
        used += amount // c
        amount %= c
    return used

print(max_meetings([[1, 3], [2, 4], [3, 5], [6, 7]]))
print(min_coins_greedy(6, [1, 3, 4]), "(greedy) vs 2 (optimal: 3+3)")`, "3\n3 (greedy) vs 2 (optimal: 3+3)"],
    ["warn", "Always try to break your greedy idea with a small counter-example before coding it. If you can break it, the problem probably needs DP."],
    ["h", "Practice"],
    ["list", ["[Jump Game](neetcode.html#p/jump-game)", "[Gas Station](neetcode.html#p/gas-station)", "[Non-overlapping Intervals](neetcode.html#p/non-overlapping-intervals)", "[Partition Labels](neetcode.html#p/partition-labels)"]],
  ],
},
{
  id: "bits", group: "Techniques", title: "Bit Manipulation",
  sub: "Work directly on the binary representation. It enables tiny, fast tricks.",
  blocks: [
    ["table", ["Operator", "Meaning", "Example (a = 6 = 110, b = 3 = 011)"], [
      ["`a & b`", "AND", "010 = 2"],
      ["`a | b`", "OR", "111 = 7"],
      ["`a ^ b`", "XOR (different bits)", "101 = 5"],
      ["`~a`", "NOT (= −a − 1 in Python)", "−7"],
      ["`a << k`", "shift left = × 2^k", "6 << 1 = 12"],
      ["`a >> k`", "shift right = // 2^k", "6 >> 1 = 3"],
    ]],
    ["h", "Tricks worth memorizing"],
    ["table", ["Trick", "Code"], [
      ["is the k-th bit set?", "`(n >> k) & 1`"],
      ["set / clear / toggle bit k", "`n | (1 << k)`, `n & ~(1 << k)`, `n ^ (1 << k)`"],
      ["remove the lowest set bit", "`n & (n - 1)`"],
      ["isolate the lowest set bit", "`n & -n`"],
      ["power of two?", "`n > 0 and n & (n - 1) == 0`"],
      ["x ^ x = 0, x ^ 0 = x", "find the single / missing number"],
      ["iterate all subsets of n items", "`for mask in range(1 << n)`"],
    ]],
    ["viz", "bits"],
    ["code", R`
n = 0b101100
print(bin(n), n.bit_count(), n & (n - 1), n & -n)

# all subsets with a bitmask
items = ["a", "b", "c"]
subs = [[items[i] for i in range(3) if mask >> i & 1] for mask in range(1 << 3)]
print(subs)

print(5 ^ 3 ^ 5)          # pairs cancel -> 3
print(16 & 15 == 0)       # 16 is a power of two`, "0b101100 3 40 4\n[[], ['a'], ['b'], ['a', 'b'], ['c'], ['a', 'c'], ['b', 'c'], ['a', 'b', 'c']]\n3\nTrue"],
    ["note", "Python ints have unlimited size and negatives behave as if they had infinitely many leading 1s. To simulate 32-bit behaviour, mask with `& 0xFFFFFFFF`."],
    ["h", "Practice"],
    ["list", ["[Single Number](neetcode.html#p/single-number)", "[Number of 1 Bits](neetcode.html#p/number-of-1-bits)", "[Counting Bits](neetcode.html#p/counting-bits)", "[Sum of Two Integers](neetcode.html#p/sum-of-two-integers)"]],
  ],
},
{
  id: "math", group: "Techniques", title: "Math for Interviews",
  sub: "GCD, primes, modular arithmetic, combinatorics and matrix tricks that come up again and again.",
  blocks: [
    ["code", R`
import math

print(math.gcd(48, 18), math.lcm(4, 6))           # 6 12
print(math.comb(5, 2), math.perm(5, 2), math.factorial(5))
print(math.isqrt(50), 7 // 2, -7 // 2, int(-7 / 2), 7 % 3, -7 % 3)

def sieve(n):                                     # primes up to n, O(n log log n)
    is_p = [True] * (n + 1)
    is_p[0] = is_p[1] = False
    for i in range(2, math.isqrt(n) + 1):
        if is_p[i]:
            for j in range(i * i, n + 1, i):
                is_p[j] = False
    return [i for i, p in enumerate(is_p) if p]

print(sieve(30))
MOD = 10**9 + 7
print(pow(2, 100, MOD), pow(3, -1, 7))           # fast modular power, modular inverse`, "6 12\n10 20 120\n7 3 -4 -3 1 2\n[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]\n976371285 5"],
    ["table", ["Topic", "Key facts"], [
      ["Floor division", "Python's `//` rounds toward −∞ (`-7 // 2 = -4`). Use `int(a / b)` to truncate toward 0."],
      ["Modulo", "Python's `%` result takes the sign of the divisor (`-7 % 3 = 2`). Great for wrap-around indexing."],
      ["Mod arithmetic", "(a + b) % m, (a · b) % m distribute; division needs `pow(b, -1, m)`"],
      ["Overflow", "Not a problem in Python, but mention it in interviews (Reverse Integer)."],
      ["Gauss sum", "1 + 2 + … + n = n(n+1)/2"],
      ["Geometry", "use squared distances; cross product for orientation"],
    ]],
    ["h", "Practice"],
    ["list", ["[Pow(x, n)](neetcode.html#p/powx-n)", "[Happy Number](neetcode.html#p/happy-number)", "[Multiply Strings](neetcode.html#p/multiply-strings)", "[Detect Squares](neetcode.html#p/detect-squares)"]],
  ],
},
{
  id: "advanced", group: "Beyond NeetCode 150", title: "Advanced Structures (bonus)",
  sub: "For harder interviews and contests: range queries, string matching, and more.",
  blocks: [
    ["h", "Fenwick tree (Binary Indexed Tree)"],
    ["p", "Prefix sums **with updates**: both update and query are O(log n)."],
    ["code", R`
class Fenwick:
    def __init__(self, n):
        self.t = [0] * (n + 1)
    def update(self, i, delta):          # 1-indexed
        while i < len(self.t):
            self.t[i] += delta
            i += i & -i
    def query(self, i):                  # sum of [1..i]
        s = 0
        while i > 0:
            s += self.t[i]
            i -= i & -i
        return s

f = Fenwick(8)
for i, v in enumerate([5, 2, 9, 1, 6, 3, 8, 4], start=1):
    f.update(i, v)
print(f.query(4), f.query(8) - f.query(3))   # sum(1..4), sum(4..8)
f.update(2, 10)                              # a[2] += 10
print(f.query(4))`, "17 22\n27"],
    ["h", "Segment tree"],
    ["p", "Range queries (sum/min/max) plus point or range updates in O(log n). It's more flexible than a Fenwick tree."],
    ["code", R`
class SegTree:
    def __init__(self, a):
        self.n = len(a)
        self.t = [0] * (2 * self.n)
        self.t[self.n:] = a
        for i in range(self.n - 1, 0, -1):
            self.t[i] = min(self.t[2 * i], self.t[2 * i + 1])
    def update(self, i, v):
        i += self.n
        self.t[i] = v
        while i > 1:
            i //= 2
            self.t[i] = min(self.t[2 * i], self.t[2 * i + 1])
    def query(self, l, r):               # min of a[l:r]
        res, l, r = float("inf"), l + self.n, r + self.n
        while l < r:
            if l & 1: res = min(res, self.t[l]); l += 1
            if r & 1: r -= 1; res = min(res, self.t[r])
            l //= 2; r //= 2
        return res

st = SegTree([5, 2, 9, 1, 6, 3])
print(st.query(0, 3), st.query(2, 6))
st.update(3, 7)
print(st.query(2, 6))`, "2 1\n3"],
    ["table", ["Structure / algorithm", "What for"], [
      ["Monotonic deque", "sliding window max/min in O(n)"],
      ["KMP / Z-function / rolling hash", "substring search in O(n + m)"],
      ["Sparse table", "static range min in O(1) per query"],
      ["Topological sort + DP", "longest path in a DAG"],
      ["Floyd–Warshall", "all-pairs shortest paths, O(V³)"],
      ["Tarjan / Kosaraju", "strongly connected components, bridges"],
      ["Bitmask DP", "subsets of ≤ 20 items"],
    ]],
  ],
},
);
