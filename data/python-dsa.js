/* Python for DSA: everything Python-specific you need for coding interviews
   Outputs written as "?" are filled in by running the code: node tools/fill.js <this file> */
PYDSA.push(
{
  id: "overview", group: "Start Here", title: "Why Python for DSA & What to Master",
  sub: "Python lets you write solutions quickly, but only if you know its built-in tools and their hidden costs.",
  blocks: [
    ["p", "In interviews, Python solutions are usually **shorter** than Java/C++ ones, so you can spend your time on the algorithm. The trade-off is that you must know which operations are O(1) and which are secretly O(n)."],
    ["h", "Your checklist"],
    ["steps", [
      "Know the **complexity of built-in operations** (next section). This is the #1 source of hidden TLEs.",
      "Be fluent with `list`, `dict`, `set`, `collections.deque`, `Counter`, `defaultdict`, `heapq` and `bisect`.",
      "Know `sorted(key=...)`, `enumerate`, `zip`, slicing, comprehensions, `float('inf')`.",
      "Know Python's quirks: floor division with negatives, the recursion limit, `[[0]*n]*m` aliasing, mutable defaults.",
      "Have **templates** memorized: BFS, DFS, binary search, backtracking, Dijkstra, union-find, topological sort (see the Template Library).",
      "Know LeetCode's format: `class Solution`, `List[int]` / `Optional[TreeNode]` hints, `ListNode` / `TreeNode`.",
    ]],
    ["tip", "Pair this page with [DSA Patterns](patterns.html). Every pattern there is written in the Python style taught here."],
  ],
},
{
  id: "complexity", group: "Start Here", title: "Time Complexity of Built-in Operations",
  sub: "Bookmark this table. Most surprise TLEs come from an O(n) operation hiding inside a loop.",
  blocks: [
    ["h", "list"],
    ["table", ["Operation", "Cost", "Note"], [
      ["`a[i]`, `a[i] = x`, `len(a)`", "O(1)", ""],
      ["`a.append(x)`, `a.pop()`", "O(1) amortized", "use as a stack"],
      ["`a.pop(0)`, `a.insert(0, x)`", "**O(n)**", "use `deque` instead"],
      ["`a.insert(i, x)`, `del a[i]`, `a.remove(x)`", "O(n)", "shifts elements"],
      ["`x in a`, `a.index(x)`, `a.count(x)`", "**O(n)**", "use a set for membership"],
      ["`a[i:j]` (slice)", "O(j − i)", "copies! careful in recursion"],
      ["`a + b`, `a * k`", "O(len)", "new list"],
      ["`a.sort()`, `sorted(a)`", "O(n log n)", "Timsort, stable"],
      ["`min(a)`, `max(a)`, `sum(a)`", "O(n)", ""],
      ["`a.reverse()`, `a[::-1]`", "O(n)", ""],
    ]],
    ["h", "dict / set"],
    ["table", ["Operation", "Average", "Worst"], [
      ["`d[k]`, `d[k] = v`, `k in d`, `del d[k]`", "O(1)", "O(n)"],
      ["`s.add(x)`, `x in s`, `s.remove(x)`", "O(1)", "O(n)"],
      ["iterate", "O(n)", ""],
      ["`s | t`, `s - t`", "O(len(s) + len(t))", ""],
      ["`s & t`", "O(min(len(s), len(t)))", ""],
      ["`d.copy()`, `set(list)`, `dict(pairs)`", "O(n)", ""],
    ]],
    ["h", "Others"],
    ["table", ["Structure / op", "Cost"], [
      ["`deque.append / appendleft / pop / popleft`", "O(1)"],
      ["`deque[i]` (middle)", "O(n)"],
      ["`heapq.heappush / heappop`", "O(log n)"],
      ["`heapq.heapify(list)`", "O(n)"],
      ["`heap[0]` (peek)", "O(1)"],
      ["`bisect.bisect_left / right`", "O(log n)"],
      ["`bisect.insort`", "O(n), because the insert shifts"],
      ["`s + t` (strings)", "O(len(s) + len(t))"],
      ["`''.join(parts)`", "O(total length)"],
      ["`s in t` (substring)", "O(len(s)·len(t)) worst"],
      ["`Counter(iterable)`", "O(n)"],
      ["`pow(x, k, m)`", "O(log k) multiplications"],
    ]],
    ["danger", "Classic hidden-O(n²) bugs: `while q: q.pop(0)`, `if x in some_list` inside a loop, `s += ch` building strings, passing `nums[1:]` in recursion."],
  ],
},
/* ======================================================= CORE TOOLKIT */
{
  id: "builtins", group: "Core Toolkit", title: "Built-ins You'll Use Every Day",
  sub: "enumerate, zip, sorted/min/max with key, any/all, divmod, ord/chr, infinity.",
  blocks: [
    ["code", R`
nums = [5, 2, 8, 1]

# enumerate → (index, value) pairs, so you don't need range(len(nums))
for i, x in enumerate(nums):
    print(f"  index {i} holds {x}")

# zip → walk two sequences side by side
print("zip:", list(zip([1, 2, 3], "abc")))

# sorted / min / max accept key= : the function that decides WHAT to compare
pairs = [(3, "c"), (1, "a"), (2, "b")]
print("sorted by number:", sorted(pairs))                                  # tuples compare item by item
print("sorted by letter, reversed:", sorted(pairs, key=lambda p: p[1], reverse=True))
print("value closest to 4:", min(nums, key=lambda x: abs(x - 4)))
print("max of an empty list with a default:", max([], default=-1))   # no ValueError

# any / all with a generator: stop as soon as the answer is known
print("any number > 7 ?", any(x > 7 for x in nums), "| all positive ?", all(x > 0 for x in nums))

# divmod → quotient and remainder in one call
q, r = divmod(17, 5)
print("17 = 5 *", q, "+", r)

# ord / chr → convert letters to numbers and back (great for 26-letter arrays)
print("position of 'c' in the alphabet:", ord("c") - ord("a"), "| 3 letters after 'a':", chr(ord("a") + 3))

# infinity: a perfect starting value for min/max searches
INF = float("inf")
best = INF
for x in nums:
    best = min(best, x)
print("min found starting from infinity:", best, "| inf > 10**18 ?", INF > 10**18)`, "  index 0 holds 5\n  index 1 holds 2\n  index 2 holds 8\n  index 3 holds 1\nzip: [(1, 'a'), (2, 'b'), (3, 'c')]\nsorted by number: [(1, 'a'), (2, 'b'), (3, 'c')]\nsorted by letter, reversed: [(3, 'c'), (2, 'b'), (1, 'a')]\nvalue closest to 4: 5\nmax of an empty list with a default: -1\nany number > 7 ? True | all positive ? True\n17 = 5 * 3 + 2\nposition of 'c' in the alphabet: 2 | 3 letters after 'a': d\nmin found starting from infinity: 1 | inf > 10**18 ? True"],
    ["tip", "`min(nums, key=...)` and `max(..., key=...)` replace many hand-written loops. `float('inf')` / `math.inf` are perfect initial values for min/max searches."],
  ],
},
{
  id: "lists", group: "Core Toolkit", title: "Lists as Arrays, Matrices & Stacks",
  sub: "Initialization, 2D grids, prefix sums, in-place tricks, and using a list as a stack.",
  blocks: [
    ["code", R`
n, m = 3, 4
arr = [0] * n                           # 1D array of n zeros
grid = [[0] * m for _ in range(n)]      # 2D grid: n rows × m columns (ALWAYS a comprehension)
grid[1][2] = 7                          # row 1, column 2
print("1D:", arr)
print("2D:", grid)

dp = [[float("inf")] * (m + 1) for _ in range(n + 1)]   # a typical DP table with an extra row/column
print("dp table size:", len(dp), "rows ×", len(dp[0]), "columns")`, "1D: [0, 0, 0]\n2D: [[0, 0, 0, 0], [0, 0, 7, 0], [0, 0, 0, 0]]\ndp table size: 4 rows × 5 columns"],
    ["code", R`
from itertools import accumulate

nums = [3, 1, 4, 1, 5]
prefix = [0, *accumulate(nums)]         # prefix[i] = sum of the first i numbers
print("prefix sums:", prefix)
print("sum of nums[1:4] (1+4+1) =", prefix[4] - prefix[1])   # any range sum in O(1)

stack = []                              # a list works as a stack: push/pop at the END
stack.append(1)
stack.append(2)
print("top:", stack[-1], "| pop:", stack.pop(), "| left:", stack, "| empty?", not stack)

a = [1, 2, 3, 4, 5]
a[1], a[3] = a[3], a[1]                 # swap two positions in one line
print("after swap:", a)

rows = [[1, 2, 3], [4, 5, 6]]
print("transpose:", [list(col) for col in zip(*rows)])   # zip(*rows) pairs up columns`, "prefix sums: [0, 3, 4, 8, 9, 14]\nsum of nums[1:4] (1+4+1) = 6\ntop: 2 | pop: 2 | left: [1] | empty? False\nafter swap: [1, 4, 3, 2, 5]\ntranspose: [[1, 4], [2, 5], [3, 6]]"],
    ["danger", "`[[0] * m] * n` makes n references to ONE row, so changing `grid[0][0]` changes every row."],
  ],
},
{
  id: "strings", group: "Core Toolkit", title: "Strings for DSA",
  sub: "Character counting, the 26-array trick, building strings efficiently, common checks.",
  blocks: [
    ["code", R`
# --- Counting letters with a 26-slot list (fast, and the list can become a dict key) ---
s = "Hello World"
count = [0] * 26                        # slot 0 = 'a', slot 1 = 'b', …, slot 25 = 'z'
for c in s.lower():
    if c.isalpha():                     # skip the space
        count[ord(c) - ord("a")] += 1   # ord('l') - ord('a') = 11 → slot 11
print("how many 'l':", count[ord("l") - ord("a")])
print("how many 'o':", count[ord("o") - ord("a")])
key = tuple(count)                      # tuple(...) makes it hashable, e.g. for grouping anagrams
print("can be a dict key:", {key: "hello world"}[key])`, "how many 'l': 3\nhow many 'o': 2\ncan be a dict key: hello world"],
    ["code", R`
s = "Hello World"
print("reversed:", s[::-1])
print("words:", s.lower().split())
print("letters sorted:", "".join(sorted("dcba")))

# strings can't be changed in place: convert to a list, edit, join back
chars = list("hello")
chars[0] = "j"
print("edited:", "".join(chars))

# build strings with a list + join (fast), not += in a loop
parts = [w.upper() for w in ["a", "b", "c"]]
print("joined:", "-".join(parts))

print("isalnum:", "abc".isalnum(), "a1!".isalnum(), "| isdigit:", "42".isdigit())
print("chunks of 3:", [s[i:i + 3] for i in range(0, len(s), 3)])
print("count 'o':", s.count("o"), "| find 'World':", s.find("World"))

from collections import Counter
print("anagrams? (Counter compare):", Counter("listen") == Counter("silent"))`, "reversed: dlroW olleH\nwords: ['hello', 'world']\nletters sorted: abcd\nedited: jello\njoined: A-B-C\nisalnum: True False | isdigit: True\nchunks of 3: ['Hel', 'lo ', 'Wor', 'ld']\ncount 'o': 2 | find 'World': 6\nanagrams? (Counter compare): True"],
    ["tip", "Strings are immutable. Convert to a `list` to modify characters, then `''.join` it back. A substring `s[i:j]` costs O(j−i), so compare indices instead of slicing in hot loops."],
  ],
},
{
  id: "hashing", group: "Core Toolkit", title: "dict, set, Counter, defaultdict",
  sub: "The four hash-based tools and the idioms that turn O(n²) into O(n).",
  blocks: [
    ["code", R`
from collections import Counter, defaultdict

nums = [4, 1, 4, 2, 1, 4]

freq = Counter(nums)                       # value → how many times it appears
print("frequencies:", freq)
print("most common:", freq.most_common(1), "| count of 99:", freq[99])

last_index = {}                            # value → LAST index where it appears
for i, x in enumerate(nums):
    last_index[x] = i                      # later indexes overwrite earlier ones
print("last index of each:", last_index)

first_index = {}
for i, x in enumerate(nums):
    first_index.setdefault(x, i)           # only stores the FIRST time
print("first index of each:", first_index)

adj = defaultdict(list)                    # adjacency list for a graph
for u, v in [(1, 2), (1, 3), (2, 3)]:
    adj[u].append(v)
    adj[v].append(u)                       # undirected: add both directions
print("graph:", dict(adj))

seen, dups = set(), []
for x in nums:
    if x in seen:                          # O(1) membership test
        dups.append(x)
    seen.add(x)
print("repeated values (in order):", dups)`, "frequencies: Counter({4: 3, 1: 2, 2: 1})\nmost common: [(4, 3)] | count of 99: 0\nlast index of each: {4: 5, 1: 4, 2: 3}\nfirst index of each: {4: 0, 1: 1, 2: 3}\ngraph: {1: [2, 3], 2: [1, 3], 3: [1, 2]}\nrepeated values (in order): [4, 1, 4]"],
    ["table", ["Need", "Tool"], [["count things", "`Counter`"], ["group things", "`defaultdict(list)`"], ["value → index", "`dict`"], ["visited / seen", "`set` (of tuples for grids)"], ["two-way mapping", "two dicts"]]],
  ],
},
{
  id: "deque", group: "Core Toolkit", title: "Stacks, Queues & deque",
  sub: "list for stacks, collections.deque for queues and double-ended windows.",
  blocks: [
    ["code", R`
from collections import deque

stack = []                          # STACK: last in, first out
for x in "abc":
    stack.append(x)
print("stack pop:", stack.pop(), "| new top:", stack[-1])

q = deque()                         # QUEUE: first in, first out (use for BFS)
q.append(1); q.append(2); q.append(3)
print("queue popleft:", q.popleft(), "| next in line:", q[0], "| size:", len(q))

dq = deque([1, 2, 3])               # DEQUE: add/remove at BOTH ends in O(1)
dq.appendleft(0)
dq.pop()
print("deque after appendleft(0) and pop():", dq)

window = deque(maxlen=3)            # keeps only the newest 3 items
for x in range(6):
    window.append(x)
print("last 3 items:", list(window))`, "stack pop: c | new top: b\nqueue popleft: 1 | next in line: 2 | size: 2\ndeque after appendleft(0) and pop(): deque([0, 1, 2])\nlast 3 items: [3, 4, 5]"],
    ["code", R`
from collections import deque

# Monotonic deque: maximum of every window of size k
nums, k = [1, 3, -1, -3, 5, 3], 3
dq, res = deque(), []               # dq stores INDICES; their values are decreasing
for i, x in enumerate(nums):
    while dq and nums[dq[-1]] <= x: # smaller values behind x can never be a max again
        dq.pop()
    dq.append(i)
    if dq[0] <= i - k:              # the front index slid out of the window
        dq.popleft()
    if i >= k - 1:                  # the window is full → its max is at the front
        res.append(nums[dq[0]])
print("window maxes:", res)`, "window maxes: [3, 3, 5, 5]"],
    ["danger", "Never use `list.pop(0)` as a queue in BFS. It's O(n) per pop."],
  ],
},
{
  id: "heapq", group: "Core Toolkit", title: "heapq: Priority Queues",
  sub: "A min-heap stored in a plain list. Max-heaps via negation, tuples for priorities, tie-breaking.",
  blocks: [
    ["code", R`
import heapq

h = []
for x in [5, 1, 8, 3]:
    heapq.heappush(h, x)                    # push keeps the smallest at h[0]
print("smallest (peek):", h[0])
print("pop smallest:", heapq.heappop(h), "then", heapq.heappop(h), "| left:", h)

nums = [4, 9, 2, 7]
heapq.heapify(nums)                         # turn an existing list into a heap in O(n)
print("after heapify, smallest:", nums[0])

# MAX-heap: push NEGATIVE numbers, and negate again when reading
maxh = [-x for x in [4, 9, 2, 7]]
heapq.heapify(maxh)
print("largest:", -heapq.heappop(maxh), "| next largest:", -maxh[0])`, "smallest (peek): 1\npop smallest: 1 then 3 | left: [5, 8]\nafter heapify, smallest: 2\nlargest: 9 | next largest: 7"],
    ["code", R`
import heapq

# Priorities: push tuples (priority, tiebreaker, item). Tuples compare left to right.
tasks = []
for i, (priority, name) in enumerate([(2, "b"), (1, "a"), (2, "c")]):
    heapq.heappush(tasks, (priority, i, name))    # i breaks ties so names are never compared
print("tasks in priority order:", [heapq.heappop(tasks)[2] for _ in range(3)])

print("2 largest:", heapq.nlargest(2, [5, 1, 8, 3]), "| 2 smallest:", heapq.nsmallest(2, [5, 1, 8, 3]))
print("smallest by key:", heapq.nsmallest(1, [("x", 3), ("y", 1)], key=lambda t: t[1]))

class Node:                                       # custom objects need __lt__ to be compared
    def __init__(self, v):
        self.v = v
    def __lt__(self, other):
        return self.v < other.v

nh = [Node(3), Node(1)]
heapq.heapify(nh)
print("smallest node value:", nh[0].v)`, "tasks in priority order: ['a', 'b', 'c']\n2 largest: [8, 5] | 2 smallest: [1, 3]\nsmallest by key: [('y', 1)]\nsmallest node value: 1"],
    ["tip", "Pattern: top-k largest → min-heap of size k; k smallest → max-heap (negated) of size k; Dijkstra → `(dist, node)` tuples."],
  ],
},
{
  id: "bisect", group: "Core Toolkit", title: "bisect: Binary Search Built-ins",
  sub: "O(log n) searches on sorted lists without writing the loop yourself.",
  blocks: [
    ["code", R`
import bisect

a = [1, 3, 3, 3, 7, 9]
#    0  1  2  3  4  5      ← indexes

print("bisect_left(a, 3)  =", bisect.bisect_left(a, 3), " ← first index with a value >= 3")
print("bisect_right(a, 3) =", bisect.bisect_right(a, 3), " ← first index with a value > 3")
print("how many 3s:", bisect.bisect_right(a, 3) - bisect.bisect_left(a, 3))

i = bisect.bisect_left(a, 5)
print("first value >= 5:", a[i], "at index", i)
j = bisect.bisect_right(a, 5) - 1
print("last value <= 5:", a[j], "at index", j)

bisect.insort(a, 4)                         # insert and keep the list sorted
print("after insort(4):", a)

def contains(arr, x):                       # O(log n) membership test on a sorted list
    k = bisect.bisect_left(arr, x)
    return k < len(arr) and arr[k] == x
print("contains 7?", contains(a, 7), "| contains 8?", contains(a, 8))

grades = "FDCBA"                            # map a score to a grade with one bisect
cutoffs = [60, 70, 80, 90]
print("grades:", [grades[bisect.bisect(cutoffs, s)] for s in [33, 65, 90, 100]])`, "bisect_left(a, 3)  = 1  ← first index with a value >= 3\nbisect_right(a, 3) = 4  ← first index with a value > 3\nhow many 3s: 3\nfirst value >= 5: 7 at index 4\nlast value <= 5: 3 at index 3\nafter insort(4): [1, 3, 3, 3, 4, 7, 9]\ncontains 7? True | contains 8? False\ngrades: ['F', 'D', 'A', 'A']"],
    ["table", ["Question", "Code"], [["first index with a[i] ≥ x", "`bisect_left(a, x)`"], ["first index with a[i] > x", "`bisect_right(a, x)`"], ["last index with a[i] ≤ x", "`bisect_right(a, x) - 1`"], ["last index with a[i] < x", "`bisect_left(a, x) - 1`"], ["count of x", "`bisect_right − bisect_left`"]]],
  ],
},
{
  id: "sorting", group: "Core Toolkit", title: "Sorting Like a Pro",
  sub: "key functions, multi-key sorts, stability, and custom comparators.",
  blocks: [
    ["code", R`
words = ["banana", "Apple", "fig", "cherry"]
print("default (uppercase first!):", sorted(words))
print("case-insensitive:          ", sorted(words, key=str.lower))
print("by length:                 ", sorted(words, key=len))
print("by length, then A→Z:       ", sorted(words, key=lambda w: (len(w), w)))   # tuple key = multi-level

points = [(1, 5), (3, 2), (1, 2)]
print("x ascending, y descending: ", sorted(points, key=lambda p: (p[0], -p[1])))   # negate to flip one level

intervals = [[5, 6], [1, 3], [2, 4]]
intervals.sort(key=lambda iv: iv[0])         # in-place sort by start
print("intervals by start:        ", intervals)

from collections import Counter
nums = [1, 1, 2, 2, 2, 3]
c = Counter(nums)
print("by frequency, then value desc:", sorted(nums, key=lambda x: (c[x], -x)))

values = [9, 2, 7, 1, 5]
print("argsort (indexes in sorted order):", sorted(range(len(values)), key=lambda i: values[i]))`, "default (uppercase first!): ['Apple', 'banana', 'cherry', 'fig']\ncase-insensitive:           ['Apple', 'banana', 'cherry', 'fig']\nby length:                  ['fig', 'Apple', 'banana', 'cherry']\nby length, then A→Z:        ['fig', 'Apple', 'banana', 'cherry']\nx ascending, y descending:  [(1, 5), (1, 2), (3, 2)]\nintervals by start:         [[1, 3], [2, 4], [5, 6]]\nby frequency, then value desc: [3, 1, 1, 2, 2, 2]\nargsort (indexes in sorted order): [3, 1, 4, 2, 0]"],
    ["code", R`
from functools import cmp_to_key

# When no simple key exists, write a comparator: return negative if a should come first
def compare(a, b):
    if a + b > b + a:      # "9" + "34" = "934" > "349" → 9 goes first
        return -1
    if a + b < b + a:
        return 1
    return 0

nums = ["3", "30", "34", "5", "9"]
print("largest number:", "".join(sorted(nums, key=cmp_to_key(compare))))`, "largest number: 9534330"],
    ["note", "`list.sort()` sorts in place and returns `None`. `sorted()` returns a new list. Python's sort is **stable**: equal keys keep their original order."],
  ],
},
{
  id: "itertools", group: "Core Toolkit", title: "itertools & functools for DSA",
  sub: "Ready-made permutations, combinations, products, running sums and memoization.",
  blocks: [
    ["code", R`
from itertools import permutations, combinations, product, accumulate, pairwise, groupby, chain
from math import comb

print("number of permutations of 4 items:", len(list(permutations(range(4)))))   # 4! = 24
print("pairs from 'abc':", list(combinations("abc", 2)))
print("all 2-bit strings:", ["".join(p) for p in product("01", repeat=2)])
print("running sum:", list(accumulate([1, 2, 3, 4])), "| running max:", list(accumulate([2, 5, 1], max)))
print("differences between neighbours:", [b - a for a, b in pairwise([1, 4, 9, 16])])
print("runs of equal letters:", ["".join(g) for _, g in groupby("aaabcc")])
print("flatten:", list(chain.from_iterable([[1, 2], [3]])), "| 5 choose 2 =", comb(5, 2))`, "number of permutations of 4 items: 24\npairs from 'abc': [('a', 'b'), ('a', 'c'), ('b', 'c')]\nall 2-bit strings: ['00', '01', '10', '11']\nrunning sum: [1, 3, 6, 10] | running max: [2, 5, 5]\ndifferences between neighbours: [3, 5, 7]\nruns of equal letters: ['aaa', 'b', 'cc']\nflatten: [1, 2, 3] | 5 choose 2 = 10"],
    ["code", R`
from functools import cache

@cache                                   # remembers every (r, c) it has already computed
def paths(r, c):
    if r == 0 or c == 0:
        return 1
    return paths(r - 1, c) + paths(r, c - 1)

print("paths(2, 2) =", paths(2, 2))
print("paths(10, 10) =", paths(10, 10), " ← instant thanks to the cache")`, "paths(2, 2) = 6\npaths(10, 10) = 184756  ← instant thanks to the cache"],
    ["warn", "In interviews, implement backtracking yourself unless told otherwise. Use itertools to verify your answers or when the problem is about something else."],
  ],
},
/* ======================================================= PYTHON QUIRKS */
{
  id: "numbers", group: "Python Quirks for DSA", title: "Integers, Division, Infinity & Bits",
  sub: "Big ints, floor division with negatives, infinity sentinels, and bit operations on Python's unbounded ints.",
  blocks: [
    ["code", R`
print("no overflow: 2**64 =", 2 ** 64)

# // and % round toward MINUS infinity (Java/C++ round toward zero)
print("7 // 2 =", 7 // 2, "| -7 // 2 =", -7 // 2)
print("int(-7 / 2) =", int(-7 / 2), " ← truncates toward zero like Java/C++")
print("-7 % 3 =", -7 % 3, " ← handy for wrapping around a circular array")

INF = float("inf")
print("inf - 1 =", INF - 1, "| inf > 1e308 ?", INF > 1e308)

n = 0b1011                                  # 11 in binary
print("n =", n, "| bin:", bin(n))
print("lowest bit n & 1 =", n & 1, "| n >> 1 =", n >> 1, "| n << 2 =", n << 2)
print("set bits:", n.bit_count(), "| bits needed:", n.bit_length())
print("-1 as 32-bit unsigned:", -1 & 0xFFFFFFFF, "| ~5 =", ~5)

print("round(2.5) =", round(2.5), "| round(-2.5) =", round(-2.5), " ← banker's rounding")`, "no overflow: 2**64 = 18446744073709551616\n7 // 2 = 3 | -7 // 2 = -4\nint(-7 / 2) = -3  ← truncates toward zero like Java/C++\n-7 % 3 = 2  ← handy for wrapping around a circular array\ninf - 1 = inf | inf > 1e308 ? True\nn = 11 | bin: 0b1011\nlowest bit n & 1 = 1 | n >> 1 = 5 | n << 2 = 44\nset bits: 3 | bits needed: 4\n-1 as 32-bit unsigned: 4294967295 | ~5 = -6\nround(2.5) = 2 | round(-2.5) = -2  ← banker's rounding"],
    ["table", ["Quirk", "Rule"], [
      ["`//` with negatives", "rounds toward −∞: `-7 // 2 = -4`. Use `int(a / b)` to truncate."],
      ["`%` with negatives", "takes the sign of the divisor: `-7 % 3 = 2` (handy for circular indices)"],
      ["`round()`", "banker's rounding: `round(2.5) = 2`"],
      ["negative bits", "Python ints act as if they had infinitely many leading 1s. Mask with `& 0xFFFFFFFF` for 32-bit behaviour."],
      ["overflow", "never happens, but mention it when an interviewer asks about other languages"],
    ]],
  ],
},
{
  id: "recursion", group: "Python Quirks for DSA", title: "Recursion Limit, Memoization & Iterative DFS",
  sub: "Python's default recursion depth is ~1000. Know how to raise it, memoize, or convert to an explicit stack.",
  blocks: [
    ["code", R`
import sys
from functools import lru_cache

print("default recursion limit:", sys.getrecursionlimit())
sys.setrecursionlimit(10**5)       # raise it for deep DFS (e.g. a 10^4-node path)

@lru_cache(maxsize=None)           # memoization: each n is computed only once
def climb(n):
    return 1 if n <= 1 else climb(n - 1) + climb(n - 2)
print("climb(90) =", climb(90))

def best_subset_sum(nums):
    best = 0
    def dfs(i, total):
        nonlocal best              # needed because we REASSIGN best inside dfs
        if i == len(nums):
            best = max(best, total)
            return
        dfs(i + 1, total + nums[i])   # take nums[i]
        dfs(i + 1, total)             # skip nums[i]
    dfs(0, 0)
    return best
print("best subset sum of [3, -1, 4]:", best_subset_sum([3, -1, 4]))`, "default recursion limit: 1000\nclimb(90) = 4660046610375530309\nbest subset sum of [3, -1, 4]: 7"],
    ["code", R`
# Iterative DFS with an explicit stack: no recursion limit at all
graph = {0: [1, 2], 1: [3], 2: [3], 3: []}

def dfs_iterative(start):
    seen, order, stack = {start}, [], [start]
    while stack:
        u = stack.pop()                    # take the most recently added node
        order.append(u)
        for v in reversed(graph[u]):       # reversed so neighbours are visited in the listed order
            if v not in seen:
                seen.add(v)
                stack.append(v)
    return order

print("DFS order from 0:", dfs_iterative(0))`, "DFS order from 0: [0, 1, 3, 2]"],
    ["warn", "`@cache` on a method of `class Solution` also caches `self`, and the cache persists across test cases. Prefer a nested function decorated inside the method."],
  ],
},
{
  id: "leetcode", group: "Python Quirks for DSA", title: "LeetCode Format: Solution class, ListNode, TreeNode",
  sub: "What the judge gives you, how type hints look, and helpers to test locally.",
  blocks: [
    ["code", R`
from typing import List, Optional
from collections import deque

class ListNode:                            # LeetCode defines these for you
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:                            # you write your methods inside this class
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []

    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))

# --- helpers to build inputs when testing on your own computer ---
def build_list(vals):
    dummy = tail = ListNode()
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next

def build_tree(vals):                      # LeetCode's level-order format, None = missing
    if not vals:
        return None
    root = TreeNode(vals[0])
    q, i = deque([root]), 1
    while q and i < len(vals):
        node = q.popleft()
        for side in ("left", "right"):
            if i < len(vals) and vals[i] is not None:
                child = TreeNode(vals[i])
                setattr(node, side, child)
                q.append(child)
            i += 1
    return root

s = Solution()
print("twoSum:", s.twoSum([2, 7, 11, 15], 9))
print("maxDepth:", s.maxDepth(build_tree([3, 9, 20, None, None, 15, 7])))
head = build_list([1, 2, 3])
print("list head and next:", head.val, head.next.val)`, "twoSum: [0, 1]\nmaxDepth: 3\nlist head and next: 1 2"],
    ["tip", "On LeetCode, `List`, `Optional`, `deque`, `heapq`, `Counter`, `defaultdict`, `bisect`, `math`, `functools` and more are pre-imported, but write the imports anyway in interviews."],
  ],
},
{
  id: "io", group: "Python Quirks for DSA", title: "Fast Input/Output (contests & OAs)",
  sub: "For HackerRank, Codeforces and online assessments where you read from stdin.",
  blocks: [
    ["code", R`
import sys, io

# For this demo we fake the keyboard input with StringIO
sys.stdin = io.StringIO("3\n1 2 3\n4 5 6\n7 8 9\n")

input = sys.stdin.readline               # much faster than the built-in input()
n = int(input())                         # first line: how many rows
grid = [list(map(int, input().split())) for _ in range(n)]
print("n =", n, "| grid =", grid)

sys.stdin = io.StringIO("5 1 2 3 4 5")
data = sys.stdin.read().split()           # read EVERYTHING at once, split into tokens
k, nums = int(data[0]), list(map(int, data[1:]))
print("k =", k, "| sum of the numbers =", sum(nums))

out = [str(x * x) for x in nums]
sys.stdout.write("\n".join(out) + "\n")   # one big write is faster than many print() calls`, "n = 3 | grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nk = 5 | sum of the numbers = 15\n1\n4\n9\n16\n25"],
  ],
},
{
  id: "mistakes", group: "Python Quirks for DSA", title: "Common Python Mistakes in DSA Code",
  sub: "Bugs that are specific to Python solutions.",
  blocks: [
    ["table", ["Mistake", "Fix"], [
      ["`[[0]*n]*m` aliasing", "`[[0]*n for _ in range(m)]`"],
      ["`res.append(path)` in backtracking", "`res.append(path[:])` or `path.copy()`"],
      ["`queue.pop(0)` in BFS", "`collections.deque` + `popleft()`"],
      ["`x in list` inside a loop", "convert to a `set` first"],
      ["mutable default arg `def f(memo={})`", "`memo=None` or `@cache`"],
      ["`heappush(h, (dist, node))` with uncomparable nodes on ties", "add a counter: `(dist, i, node)`"],
      ["forgetting to negate for a max-heap (or to negate back)", "push `-x`, read `-h[0]`"],
      ["`nonlocal` missing when reassigning an outer variable", "`nonlocal best`"],
      ["`//` and `%` on negatives", "`int(a / b)`, or work with `abs`"],
      ["recursion depth on large inputs", "`sys.setrecursionlimit` or an iterative version"],
      ["modifying a dict/set while iterating", "iterate over `list(d)`"],
      ["string concatenation in a loop", "collect in a list and `''.join`"],
      ["comparing floats with ==", "use integers or `math.isclose`"],
      ["`sorted()` vs `.sort()` (returns None)", "`a = sorted(a)` or `a.sort()`"],
    ]],
    ["code", R`
# The #1 backtracking bug: appending the path itself instead of a copy
res, path = [], []

def bt(i):
    if i == 2:
        res.append(path)          # ✗ BUG: stores a reference to the SAME list
        return
    path.append(i)
    bt(i + 1)
    path.pop()                    # …which we empty again while backtracking

bt(0)
print("buggy result:", res, " ← the stored path was emptied later")

res, path = [], []
def bt_fixed(i):
    if i == 2:
        res.append(path.copy())   # ✓ store a snapshot
        return
    path.append(i)
    bt_fixed(i + 1)
    path.pop()

bt_fixed(0)
print("fixed result:", res)`, "buggy result: [[]]  ← the stored path was emptied later\nfixed result: [[0, 1]]"],
  ],
},
/* ======================================================= TEMPLATE LIBRARY */
{
  id: "templates-search", group: "Template Library", title: "Templates: Binary Search, Two Pointers, Sliding Window",
  sub: "Copy-ready skeletons. Memorize them, then adapt.",
  blocks: [
    ["code", R`
# Binary search: the FIRST index i in [lo, hi] where condition(i) is True
# (the condition must look like F F F T T T)
def first_true(lo, hi, condition):
    while lo < hi:
        mid = (lo + hi) // 2
        if condition(mid):
            hi = mid          # mid works → the answer is mid or something to its left
        else:
            lo = mid + 1      # mid fails → the answer is to the right
    return lo

# Two pointers on a sorted array: find a pair with a given sum
def pair_sum(a, target):
    l, r = 0, len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == target:
            return l, r
        if s < target:
            l += 1            # need a bigger sum
        else:
            r -= 1            # need a smaller sum
    return -1, -1

# Variable sliding window: the longest substring with at most k distinct characters
def longest_window(s, k):
    count, l, best = {}, 0, 0
    for r, c in enumerate(s):
        count[c] = count.get(c, 0) + 1          # 1) expand to the right
        while len(count) > k:                   # 2) shrink while the window is invalid
            count[s[l]] -= 1
            if count[s[l]] == 0:
                del count[s[l]]
            l += 1
        best = max(best, r - l + 1)             # 3) record the valid window
    return best

a = [1, 3, 5, 7, 9]
print("first index with a value >= 6:", first_true(0, len(a), lambda i: a[i] >= 6))
print("pair summing to 12:", pair_sum(a, 12))
print("longest with <= 2 distinct chars in 'eceba':", longest_window("eceba", 2))`, "first index with a value >= 6: 3\npair summing to 12: (1, 4)\nlongest with <= 2 distinct chars in 'eceba': 3"],
  ],
},
{
  id: "templates-graph", group: "Template Library", title: "Templates: BFS, DFS, Topological Sort, Dijkstra, Union-Find",
  sub: "The graph toolkit in one place.",
  blocks: [
    ["code", R`
from collections import deque, defaultdict
import heapq

def bfs(adj, start):                          # shortest number of edges from start
    dist = {start: 0}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:                 # first visit = shortest distance
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

def dfs(adj, u, seen):                        # visit everything reachable from u
    seen.add(u)
    for v in adj[u]:
        if v not in seen:
            dfs(adj, v, seen)
    return seen

def topo(n, edges):                           # Kahn's algorithm (edge a → b: a before b)
    adj, indeg = defaultdict(list), [0] * n
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else []   # [] means there was a cycle

def dijkstra(adj, src):                       # adj[u] = [(v, weight), ...]
    dist = {src: 0}
    h = [(0, src)]
    while h:
        d, u = heapq.heappop(h)
        if d > dist.get(u, float("inf")):
            continue                          # stale heap entry
        for v, w in adj[u]:
            if d + w < dist.get(v, float("inf")):
                dist[v] = d + w
                heapq.heappush(h, (d + w, v))
    return dist

class DSU:                                    # union-find
    def __init__(self, n):
        self.p = list(range(n))
    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]     # path compression
            x = self.p[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                      # already in the same group
        self.p[rb] = ra
        return True

adj = {0: [1, 2], 1: [3], 2: [3], 3: []}
weighted = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print("BFS distances:", bfs(adj, 0))
print("DFS reachable:", sorted(dfs(adj, 0, set())))
print("topological order:", topo(4, [(0, 1), (0, 2), (1, 3), (2, 3)]))
print("Dijkstra:", dijkstra(weighted, 0))
d = DSU(4)
print("union(0,1):", d.union(0, 1), "| union(1,0) again:", d.union(1, 0), "| same group:", d.find(1) == d.find(0))`, "BFS distances: {0: 0, 1: 1, 2: 1, 3: 2}\nDFS reachable: [0, 1, 2, 3]\ntopological order: [0, 1, 2, 3]\nDijkstra: {0: 0, 1: 3, 2: 1, 3: 4}\nunion(0,1): True | union(1,0) again: False | same group: True"],
    ["code", R`
from collections import deque

# Grid BFS: steps from the start to every open cell ('.'), '#' is a wall, -1 = unreachable
def grid_bfs(grid, sr, sc):
    R, C = len(grid), len(grid[0])
    dist = [[-1] * C for _ in range(R)]
    dist[sr][sc] = 0
    q = deque([(sr, sc)])
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):        # down, up, right, left
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == "." and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
    return dist

for row in grid_bfs(["..#", ".#.", "..."], 0, 0):
    print(row)`, "[0, 1, -1]\n[1, -1, 5]\n[2, 3, 4]"],
  ],
},
{
  id: "templates-other", group: "Template Library", title: "Templates: Backtracking, DP, Monotonic Stack, Trie",
  sub: "The remaining skeletons you'll reuse again and again.",
  blocks: [
    ["code", R`
from functools import cache

def subsets(nums):                                  # backtracking: choose → explore → undo
    res, path = [], []
    def bt(start):
        res.append(path[:])                         # every node is a subset
        for i in range(start, len(nums)):
            path.append(nums[i])                    # choose
            bt(i + 1)                               # explore
            path.pop()                              # undo
    bt(0)
    return res

def coin_change(coins, amount):                     # bottom-up DP: fill the table from small to big
    dp = [0] + [float("inf")] * amount              # dp[a] = fewest coins for amount a
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1

def lcs(a, b):                                      # top-down DP: recursion + cache
    @cache
    def go(i, j):
        if i == len(a) or j == len(b):
            return 0
        if a[i] == b[j]:
            return 1 + go(i + 1, j + 1)
        return max(go(i + 1, j), go(i, j + 1))
    return go(0, 0)

def next_greater(nums):                             # monotonic stack
    res, st = [-1] * len(nums), []                  # st holds indices still waiting
    for i, x in enumerate(nums):
        while st and nums[st[-1]] < x:
            res[st.pop()] = x
        st.append(i)
    return res

class Trie:                                         # a trie made of nested dicts
    def __init__(self):
        self.root = {}
    def insert(self, word):
        node = self.root
        for c in word:
            node = node.setdefault(c, {})
        node["$"] = True                            # end-of-word marker
    def search(self, word, prefix=False):
        node = self.root
        for c in word:
            if c not in node:
                return False
            node = node[c]
        return prefix or "$" in node

print("subsets([1,2]):", subsets([1, 2]))
print("coin_change([1,2,5], 11):", coin_change([1, 2, 5], 11))
print("lcs('abcde', 'ace'):", lcs("abcde", "ace"))
print("next_greater([2,1,3]):", next_greater([2, 1, 3]))
t = Trie()
t.insert("apple")
print("trie: 'app' word?", t.search("app"), "| 'app' prefix?", t.search("app", prefix=True), "| 'apple'?", t.search("apple"))`, "subsets([1,2]): [[], [1], [1, 2], [2]]\ncoin_change([1,2,5], 11): 3\nlcs('abcde', 'ace'): 3\nnext_greater([2,1,3]): [3, 3, -1]\ntrie: 'app' word? False | 'app' prefix? True | 'apple'? True"],
  ],
},
{
  id: "interview-tips", group: "Template Library", title: "Coding Interviews in Python: Tips",
  sub: "How to present Python solutions well.",
  blocks: [
    ["list", [
      "Say the brute force first, with its complexity, then optimize.",
      "Use clear names (`left`, `right`, `seen`, `freq`). Single letters are fine for indices.",
      "Write small helper functions (`def neighbors(r, c)`), which keeps the code readable.",
      "Mention Python-specific costs: \"slicing copies, so I'll pass indices instead\".",
      "Know when **not** to use a built-in: if the problem *is* sorting or a heap, ask before calling `sorted`/`heapq`.",
      "Test by walking through an example out loud, then the edge cases: empty input, one element, duplicates, negatives.",
      "State the final time and space complexity, including the recursion stack.",
    ]],
    ["tip", "Practice typing the templates from memory weekly. Speed and accuracy on the boilerplate frees your mind for the actual problem."],
  ],
},
);
