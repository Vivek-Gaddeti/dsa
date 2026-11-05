/* DSA Patterns, part 2: trees, heaps, backtracking, graphs, DP, greedy, bits */
PATTERNS.push(
/* ---------------------------------------------------------- TREES */
{
  id: "tree-dfs", group: "Trees", title: "Tree DFS (recursive thinking)",
  sub: "Solve the problem for the left subtree and the right subtree, then combine at the node. Information flows up (return values) or down (parameters).",
  tags: ["O(n)", "O(h) stack"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Height, diameter, balance, path sums, or any \"property of the whole tree\"", "Compare / merge / mirror two trees", "Root-to-leaf paths", "BST validation and construction"]],
    ["viz", "treeDFS"],
    ["h", "Two templates"],
    ["code", R`
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

# 1) BOTTOM-UP: children return info, parent combines
def height(node):
    if not node:
        return 0
    return 1 + max(height(node.left), height(node.right))

# 2) TOP-DOWN: parent passes state to children
def root_to_leaf_sums(node, acc=0, out=None):
    out = [] if out is None else out
    if not node:
        return out
    acc += node.val
    if not node.left and not node.right:
        out.append(acc)
    root_to_leaf_sums(node.left, acc, out)
    root_to_leaf_sums(node.right, acc, out)
    return out

root = T(1, T(2, T(4), T(5)), T(3))
print(height(root), root_to_leaf_sums(root))`, "3 [7, 8, 4]"],
    ["h", "Worked examples"],
    ["ex", { t: "Path Sum", d: "Easy", lc: 112, open: true, q: "Is there a root-to-leaf path with the given sum?", idea: "Top-down: subtract the node's value from the target as you go. At a leaf, check whether the remainder is 0.", code: R`
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def has_path_sum(node, target):
    if not node:
        return False
    target -= node.val
    if not node.left and not node.right:
        return target == 0
    return has_path_sum(node.left, target) or has_path_sum(node.right, target)

root = T(5, T(4, T(11, T(7), T(2))), T(8, T(13), T(4, None, T(1))))
print(has_path_sum(root, 22), has_path_sum(root, 26), has_path_sum(root, 5))`, out: "True True False", cx: "O(n)" }],
    ["ex", { t: "Symmetric Tree", d: "Easy", lc: 101, q: "Is the tree a mirror of itself?", idea: "Compare two subtrees in parallel: outer with outer, inner with inner.", code: R`
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def is_symmetric(root):
    def mirror(a, b):
        if not a or not b:
            return a is b
        return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
    return mirror(root.left, root.right)

print(is_symmetric(T(1, T(2, T(3), T(4)), T(2, T(4), T(3)))), is_symmetric(T(1, T(2, None, T(3)), T(2, None, T(3)))))`, out: "True False", cx: "O(n)" }],
    ["ex", { t: "Lowest Common Ancestor (general binary tree)", d: "Medium", lc: 236, q: "LCA of nodes p and q in any binary tree.", idea: "Bottom-up: return p or q if found. If both sides return something, the current node is the LCA.", code: R`
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def lca(node, p, q):
    if not node or node.val in (p, q):
        return node
    left, right = lca(node.left, p, q), lca(node.right, p, q)
    if left and right:
        return node                  # p and q are on different sides
    return left or right

root = T(3, T(5, T(6), T(2, T(7), T(4))), T(1, T(0), T(8)))
print(lca(root, 5, 1).val, lca(root, 5, 4).val, lca(root, 7, 8).val)`, out: "3 5 3", cx: "O(n)" }],
    ["ex", { t: "Path Sum II (all paths, with backtracking)", d: "Medium", lc: 113, q: "All root-to-leaf paths with the target sum.", idea: "Top-down with a shared path list: append, recurse, pop.", code: R`
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def path_sum(root, target):
    res, path = [], []
    def dfs(node, remain):
        if not node: return
        path.append(node.val)
        remain -= node.val
        if not node.left and not node.right and remain == 0:
            res.append(path.copy())
        dfs(node.left, remain); dfs(node.right, remain)
        path.pop()                    # backtrack
    dfs(root, target)
    return res

root = T(5, T(4, T(11, T(7), T(2))), T(8, T(13), T(4, T(5), T(1))))
print(path_sum(root, 22))`, out: "[[5, 4, 11, 2], [5, 8, 4, 5]]", cx: "O(n·h)" }],
    ["ex", { t: "Flatten / Serialize thinking: Sum Root to Leaf Numbers", d: "Medium", lc: 129, q: "Each root-to-leaf path forms a number (1→2→3 = 123). Sum them all.", idea: "Pass `num * 10 + val` down. Leaves return their number.", code: R`
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def sum_numbers(node, num=0):
    if not node:
        return 0
    num = num * 10 + node.val
    if not node.left and not node.right:
        return num
    return sum_numbers(node.left, num) + sum_numbers(node.right, num)

print(sum_numbers(T(4, T(9, T(5), T(1)), T(0))))`, out: "1026", cx: "O(n)" }],
    ["tip", "Ask yourself: **\"What does each child need to tell its parent?\"** (return value) and **\"What does the parent need to tell its children?\"** (parameters). Most tree problems are answered by those two questions."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Invert Binary Tree](neetcode.html#p/invert-binary-tree)", "[Diameter](neetcode.html#p/diameter-of-binary-tree)", "[Balanced Binary Tree](neetcode.html#p/balanced-binary-tree)", "[Count Good Nodes](neetcode.html#p/count-good-nodes-in-binary-tree)", "[Validate BST](neetcode.html#p/validate-binary-search-tree)", "[Max Path Sum](neetcode.html#p/binary-tree-maximum-path-sum)"]],
  ],
},
{
  id: "tree-bfs", group: "Trees", title: "Tree BFS (level order)",
  sub: "A queue processes the tree level by level. `for _ in range(len(q))` isolates exactly one level.",
  tags: ["O(n)", "O(width)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Anything \"per level\": averages, max per level, zigzag, right/left view", "**Minimum depth** / nearest leaf (BFS stops at the first leaf)", "Connect nodes on the same level"]],
    ["viz", "treeBFS"],
    ["h", "Template"],
    ["code", R`
from collections import deque

class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def levels(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):          # exactly one level
            node = q.popleft()
            level.append(node.val)
            for child in (node.left, node.right):
                if child: q.append(child)
        res.append(level)
    return res

print(levels(T(3, T(9), T(20, T(15), T(7)))))`, "[[3], [9, 20], [15, 7]]"],
    ["h", "Worked examples"],
    ["ex", { t: "Binary Tree Zigzag Level Order", d: "Medium", lc: 103, open: true, q: "Level order, alternating left→right and right→left.", idea: "Normal BFS, and reverse every other level.", code: R`
from collections import deque
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def zigzag(root):
    res, q, flip = [], deque([root] if root else []), False
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft(); level.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        res.append(level[::-1] if flip else level)
        flip = not flip
    return res

print(zigzag(T(3, T(9), T(20, T(15), T(7)))))`, out: "[[3], [20, 9], [15, 7]]", cx: "O(n)" }],
    ["ex", { t: "Minimum Depth of Binary Tree", d: "Easy", lc: 111, q: "The number of nodes on the shortest root-to-leaf path.", idea: "BFS: the first leaf you pop is at the minimum depth, so stop there.", code: R`
from collections import deque
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def min_depth(root):
    if not root: return 0
    q = deque([(root, 1)])
    while q:
        n, d = q.popleft()
        if not n.left and not n.right:
            return d
        if n.left: q.append((n.left, d + 1))
        if n.right: q.append((n.right, d + 1))

print(min_depth(T(3, T(9), T(20, T(15), T(7)))), min_depth(T(2, None, T(3, None, T(4)))))`, out: "2 3", cx: "O(n) worst, often much less" }],
    ["ex", { t: "Average of Levels", d: "Easy", lc: 637, q: "Average value of each level.", idea: "Sum each level inside the size loop.", code: R`
from collections import deque
class T:
    def __init__(self, v, l=None, r=None): self.val, self.left, self.right = v, l, r

def averages(root):
    res, q = [], deque([root])
    while q:
        size, total = len(q), 0
        for _ in range(size):
            n = q.popleft(); total += n.val
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        res.append(total / size)
    return res

print(averages(T(3, T(9), T(20, T(15), T(7)))))`, out: "[3.0, 14.5, 11.0]", cx: "O(n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Level Order Traversal](neetcode.html#p/binary-tree-level-order-traversal)", "[Right Side View](neetcode.html#p/binary-tree-right-side-view)", "[Maximum Depth](neetcode.html#p/maximum-depth-of-binary-tree)"]],
  ],
},
/* ---------------------------------------------------------- HEAPS */
{
  id: "top-k", group: "Heaps", title: "Top-K Elements (heap of size k)",
  sub: "To keep the k largest, use a min-heap of size k and pop the smallest whenever it overflows. Cost: O(n log k).",
  tags: ["O(n log k)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"k largest / smallest / most frequent / closest\"", "\"k-th largest\"", "Streaming data where you can't sort everything"]],
    ["viz", "heapPush"],
    ["table", ["Want", "Heap type", "Pop when size > k removes…"], [
      ["k **largest**", "min-heap", "the smallest → survivors are the largest"],
      ["k **smallest**", "max-heap (negate)", "the largest → survivors are the smallest"],
    ]],
    ["h", "Template"],
    ["code", R`
import heapq

def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)          # drop the smallest
    return sorted(heap, reverse=True)

print(k_largest([3, 1, 5, 12, 2, 11], 3), heapq.nlargest(3, [3, 1, 5, 12, 2, 11]))`, "[12, 11, 5] [12, 11, 5]"],
    ["h", "Worked examples"],
    ["ex", { t: "Top K Frequent Words", d: "Medium", lc: 692, open: true, q: "The k most frequent words. Ties go to the lexicographically smaller word.", idea: "Count, then sort by (−freq, word), or use heapq.nsmallest with that key.", code: R`
import heapq
from collections import Counter

def top_k_words(words, k):
    count = Counter(words)
    return heapq.nsmallest(k, count, key=lambda w: (-count[w], w))

print(top_k_words(["i", "love", "leetcode", "i", "love", "coding"], 2))
print(top_k_words(["the","day","is","sunny","the","the","the","sunny","is","is"], 4))`, out: "['i', 'love']\n['the', 'is', 'sunny', 'day']", cx: "O(n log k)" }],
    ["ex", { t: "K Closest Points to Origin", d: "Medium", lc: 973, q: "The k points nearest (0, 0).", idea: "Max-heap of size k by distance (negated).", code: R`
import heapq

def k_closest(points, k):
    heap = []
    for x, y in points:
        heapq.heappush(heap, (-(x*x + y*y), x, y))
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted([x, y] for _, x, y in heap)

print(k_closest([[3, 3], [5, -1], [-2, 4]], 2))`, out: "[[-2, 4], [3, 3]]", cx: "O(n log k)" }],
    ["ex", { t: "Reorganize String", d: "Medium", lc: 767, q: "Rearrange so that no two adjacent characters are equal (or return \"\").", idea: "Greedy with a max-heap: always place the most frequent char that isn't the one just placed (hold it back for one turn).", code: R`
import heapq
from collections import Counter

def reorganize(s):
    heap = [(-c, ch) for ch, c in Counter(s).items()]
    heapq.heapify(heap)
    res, prev = [], None
    while heap:
        c, ch = heapq.heappop(heap)
        res.append(ch)
        if prev:
            heapq.heappush(heap, prev)
        prev = (c + 1, ch) if c + 1 < 0 else None   # hold back for one turn
    return "".join(res) if len(res) == len(s) else ""

print(reorganize("aab"), repr(reorganize("aaab")))`, out: "aba ''", cx: "O(n log 26)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Kth Largest in a Stream](neetcode.html#p/kth-largest-element-in-a-stream)", "[Last Stone Weight](neetcode.html#p/last-stone-weight)", "[K Closest Points](neetcode.html#p/k-closest-points-to-origin)", "[Kth Largest in an Array](neetcode.html#p/kth-largest-element-in-an-array)", "[Task Scheduler](neetcode.html#p/task-scheduler)", "[Top K Frequent](neetcode.html#p/top-k-frequent-elements)"]],
  ],
},
{
  id: "two-heaps", group: "Heaps", title: "Two Heaps (balance two halves)",
  sub: "A max-heap holds the smaller half and a min-heap the larger half. Their tops are the middle of the data.",
  tags: ["O(log n) insert", "O(1) median"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["**Running median** of a stream", "Sliding window median", "\"Schedule\" problems that pick the best item among the available ones (IPO: one heap of locked items, one of available items)"]],
    ["h", "Template"],
    ["code", R`
import heapq

class Median:
    def __init__(self):
        self.lo, self.hi = [], []          # lo = max-heap (negated), hi = min-heap
    def add(self, x):
        heapq.heappush(self.lo, -x)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))     # keep lo <= hi
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))  # lo may hold one extra
    def median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2

m = Median()
out = []
for x in [5, 15, 1, 3]:
    m.add(x); out.append(m.median())
print(out)`, "[5, 10.0, 5, 4.0]"],
    ["h", "Worked example"],
    ["ex", { t: "IPO (maximize capital)", d: "Hard", lc: 502, open: true, q: "Do at most k projects. A project needs capital[i] to start and adds profits[i]. Maximize the final capital.", idea: "A min-heap of projects by required capital (locked). Move everything affordable into a max-heap by profit (available), then take the best one. Repeat k times.", code: R`
import heapq

def find_maximized_capital(k, w, profits, capital):
    locked = sorted(zip(capital, profits))
    avail, i = [], 0
    for _ in range(k):
        while i < len(locked) and locked[i][0] <= w:
            heapq.heappush(avail, -locked[i][1]); i += 1
        if not avail:
            break
        w -= heapq.heappop(avail)          # take the most profitable
    return w

print(find_maximized_capital(2, 0, [1, 2, 3], [0, 1, 1]), find_maximized_capital(3, 0, [1, 2, 3], [0, 1, 2]))`, out: "4 6", cx: "O(n log n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Find Median from Data Stream](neetcode.html#p/find-median-from-data-stream)"]],
  ],
},
{
  id: "k-way-merge", group: "Heaps", title: "K-way Merge",
  sub: "Merge k sorted sequences by always taking the smallest current head from a heap of size k.",
  tags: ["O(N log k)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Merge k sorted lists / arrays\"", "\"k-th smallest in a sorted matrix\" (rows are sorted lists)", "\"Smallest range covering elements from k lists\"", "Newest-first feeds from many users (Design Twitter)"]],
    ["h", "Template"],
    ["code", R`
import heapq

def merge_k(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]   # (value, list id, index)
    heapq.heapify(heap)
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out

print(merge_k([[1, 4, 5], [1, 3, 4], [2, 6]]))
print(list(heapq.merge([1, 4, 5], [1, 3, 4], [2, 6])))   # built-in lazy merge`, "[1, 1, 2, 3, 4, 4, 5, 6]\n[1, 1, 2, 3, 4, 4, 5, 6]"],
    ["h", "Worked examples"],
    ["ex", { t: "Kth Smallest Element in a Sorted Matrix", d: "Medium", lc: 378, open: true, q: "Rows and columns are sorted. Find the k-th smallest.", idea: "Each row is a sorted list. K-way merge them and pop k times.", code: R`
import heapq

def kth_smallest(matrix, k):
    heap = [(row[0], r, 0) for r, row in enumerate(matrix)]
    heapq.heapify(heap)
    for _ in range(k - 1):
        _, r, c = heapq.heappop(heap)
        if c + 1 < len(matrix[r]):
            heapq.heappush(heap, (matrix[r][c + 1], r, c + 1))
    return heap[0][0]

print(kth_smallest([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8))`, out: "13", cx: "O(k log n)" }],
    ["ex", { t: "Smallest Range Covering Elements from K Lists", d: "Hard", lc: 632, q: "The smallest [a, b] that includes at least one number from each list.", idea: "The heap holds one element per list. Track the current max. The range is [heap min, max]. Advance the list that holds the min.", code: R`
import heapq

def smallest_range(nums):
    heap = [(lst[0], i, 0) for i, lst in enumerate(nums)]
    heapq.heapify(heap)
    hi = max(lst[0] for lst in nums)
    best = [heap[0][0], hi]
    while True:
        lo, i, j = heapq.heappop(heap)
        if hi - lo < best[1] - best[0]:
            best = [lo, hi]
        if j + 1 == len(nums[i]):
            return best
        nxt = nums[i][j + 1]
        hi = max(hi, nxt)
        heapq.heappush(heap, (nxt, i, j + 1))

print(smallest_range([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]))`, out: "[20, 24]", cx: "O(N log k)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Merge k Sorted Lists](neetcode.html#p/merge-k-sorted-lists)", "[Design Twitter](neetcode.html#p/design-twitter)"]],
  ],
},
/* ---------------------------------------------------------- BACKTRACKING */
{
  id: "backtracking", group: "Recursion", title: "Backtracking (choose → explore → un-choose)",
  sub: "Build candidates step by step, abandon a branch as soon as it can't succeed, and undo each choice before trying the next.",
  tags: ["exponential", "pruning matters"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Return **all** subsets / permutations / combinations / partitions\"", "Constraint puzzles (N-Queens, Sudoku, word search)", "n is small (≤ 15–20), a sign the expected solution is exponential"]],
    ["viz", "subsets"],
    ["h", "The universal template"],
    ["code", R`
def backtrack_template(choices):
    res, path = [], []

    def bt(start):
        res.append(path.copy())            # record (where depends on the problem)
        for i in range(start, len(choices)):
            # if invalid(choices[i]): continue    <- pruning goes here
            path.append(choices[i])        # choose
            bt(i + 1)                      # explore (i+1: no reuse, i: reuse)
            path.pop()                     # un-choose

    bt(0)
    return res

print(backtrack_template([1, 2, 3]))`, "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]"],
    ["table", ["Variant", "Loop start", "Recurse with", "Record when"], [
      ["Subsets", "start", "i + 1", "every node"],
      ["Combinations of size k", "start", "i + 1", "len(path) == k"],
      ["Combination sum (reuse)", "start", "**i**", "remain == 0"],
      ["Permutations", "0, skipping used", "—", "len(path) == n"],
      ["With duplicates", "sort; skip `i > start and a[i] == a[i−1]`", "", ""],
    ]],
    ["h", "Worked examples"],
    ["ex", { t: "Combinations (n choose k)", d: "Medium", lc: 77, open: true, q: "All combinations of k numbers from 1..n.", idea: "The start-index template, recording at length k. Pruning: stop if there aren't enough numbers left.", code: R`
def combine(n, k):
    res, path = [], []
    def bt(start):
        if len(path) == k:
            res.append(path.copy()); return
        for x in range(start, n - (k - len(path)) + 2):   # pruned upper bound
            path.append(x); bt(x + 1); path.pop()
    bt(1)
    return res

print(combine(4, 2))`, out: "[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]", cx: "O(k · C(n,k))" }],
    ["ex", { t: "Permutations II (with duplicates)", d: "Medium", lc: 47, q: "All unique permutations.", idea: "Sort. Skip a value equal to the previous one when the previous one is **not** currently used (same level).", code: R`
def permute_unique(nums):
    nums.sort(); res, path, used = [], [], [False] * len(nums)
    def bt():
        if len(path) == len(nums):
            res.append(path.copy()); return
        for i in range(len(nums)):
            if used[i] or (i and nums[i] == nums[i - 1] and not used[i - 1]):
                continue
            used[i] = True; path.append(nums[i])
            bt()
            path.pop(); used[i] = False
    bt()
    return res

print(permute_unique([1, 1, 2]))`, out: "[[1, 1, 2], [1, 2, 1], [2, 1, 1]]", cx: "O(n · n!)" }],
    ["ex", { t: "Combination Sum", d: "Medium", lc: 39, q: "Combinations (with reuse) that sum to the target.", idea: "Recurse with i (reuse allowed). Sort and break early.", code: R`
def combination_sum(cands, target):
    cands.sort(); res, path = [], []
    def bt(start, remain):
        if remain == 0:
            res.append(path.copy()); return
        for i in range(start, len(cands)):
            if cands[i] > remain: break
            path.append(cands[i]); bt(i, remain - cands[i]); path.pop()
    bt(0, target)
    return res

print(combination_sum([2, 3, 6, 7], 7))`, out: "[[2, 2, 3], [7]]", cx: "exponential" }],
    ["ex", { t: "Sudoku-style constraint: N-Queens count", d: "Hard", lc: 52, q: "How many ways to place n queens?", idea: "One queen per row. Use sets for columns and both diagonals for O(1) conflict checks.", code: R`
def total_n_queens(n):
    cols, d1, d2 = set(), set(), set()
    def bt(r):
        if r == n: return 1
        count = 0
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2: continue
            cols.add(c); d1.add(r - c); d2.add(r + c)
            count += bt(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c)
        return count
    return bt(0)

print([total_n_queens(n) for n in range(1, 9)])`, out: "[1, 0, 0, 2, 10, 4, 40, 92]", cx: "O(n!)" }],
    ["ex", { t: "Restore IP Addresses", d: "Medium", lc: 93, q: "All valid IPs formed by inserting 3 dots.", idea: "Partition backtracking: each part is 1–3 digits, ≤ 255, and has no leading zero.", code: R`
def restore_ip(s):
    res = []
    def bt(i, parts):
        if len(parts) == 4:
            if i == len(s): res.append(".".join(parts))
            return
        for L in (1, 2, 3):
            seg = s[i:i + L]
            if len(seg) < L or (seg[0] == "0" and L > 1) or int(seg) > 255:
                continue
            bt(i + L, parts + [seg])
    bt(0, [])
    return res

print(restore_ip("25525511135"), restore_ip("0000"))`, out: "['255.255.11.135', '255.255.111.35'] ['0.0.0.0']", cx: "O(3^4)" }],
    ["danger", "Appending `path` instead of `path.copy()`. Every stored result then points at the same list, which ends up empty."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Subsets](neetcode.html#p/subsets)", "[Combination Sum](neetcode.html#p/combination-sum)", "[Permutations](neetcode.html#p/permutations)", "[Subsets II](neetcode.html#p/subsets-ii)", "[Word Search](neetcode.html#p/word-search)", "[Palindrome Partitioning](neetcode.html#p/palindrome-partitioning)", "[N-Queens](neetcode.html#p/n-queens)", "[Generate Parentheses](neetcode.html#p/generate-parentheses)"]],
  ],
},
/* ---------------------------------------------------------- GRAPHS */
{
  id: "graph-traversal", group: "Graphs", title: "Graph DFS / BFS (incl. grids)",
  sub: "Visit every reachable node once with a visited set. BFS gives the shortest path in unweighted graphs, and DFS explores components and paths.",
  tags: ["O(V + E)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Grids of land/water, mazes, \"connected\" regions, flood fill", "Explicit edges / adjacency lists", "\"Minimum number of steps\" (BFS)", "Implicit graphs: word ladders, lock combinations, state spaces"]],
    ["viz", "islands"],
    ["h", "Templates"],
    ["code", R`
from collections import deque

DIRS = ((1, 0), (-1, 0), (0, 1), (0, -1))

def bfs_grid(grid, start):
    R, C = len(grid), len(grid[0])
    q, seen = deque([(*start, 0)]), {start}
    while q:
        r, c, d = q.popleft()
        # process (r, c) at distance d
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1 and (nr, nc) not in seen:
                seen.add((nr, nc))                 # mark when ENQUEUING
                q.append((nr, nc, d + 1))
    return len(seen)

def dfs_graph(adj, u, seen):
    seen.add(u)
    for v in adj[u]:
        if v not in seen:
            dfs_graph(adj, v, seen)
    return seen

print(bfs_grid([[1, 1, 0], [0, 1, 0], [0, 1, 1]], (0, 0)))
print(sorted(dfs_graph({0: [1], 1: [0, 2], 2: [1], 3: []}, 0, set())))`, "5\n[0, 1, 2]"],
    ["h", "Worked examples"],
    ["ex", { t: "Flood Fill", d: "Easy", lc: 733, open: true, q: "Recolour the connected region of the starting pixel.", idea: "DFS from the start, recolouring pixels that have the original colour.", code: R`
def flood_fill(image, sr, sc, color):
    old = image[sr][sc]
    if old == color: return image
    R, C = len(image), len(image[0])
    def dfs(r, c):
        if 0 <= r < R and 0 <= c < C and image[r][c] == old:
            image[r][c] = color
            dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    dfs(sr, sc)
    return image

print(flood_fill([[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2))`, out: "[[2, 2, 2], [2, 2, 0], [2, 0, 1]]", cx: "O(m·n)" }],
    ["ex", { t: "Shortest Path in Binary Matrix", d: "Medium", lc: 1091, q: "Shortest clear path (0-cells, 8 directions) from the top-left to the bottom-right.", idea: "BFS. The first time you reach the target is the shortest path.", code: R`
from collections import deque

def shortest_path(grid):
    n = len(grid)
    if grid[0][0] or grid[-1][-1]: return -1
    q, seen = deque([(0, 0, 1)]), {(0, 0)}
    while q:
        r, c, d = q.popleft()
        if (r, c) == (n - 1, n - 1): return d
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and not grid[nr][nc] and (nr, nc) not in seen:
                    seen.add((nr, nc)); q.append((nr, nc, d + 1))
    return -1

print(shortest_path([[0, 0, 0], [1, 1, 0], [1, 1, 0]]), shortest_path([[1, 0], [0, 0]]))`, out: "4 -1", cx: "O(n²)" }],
    ["ex", { t: "Open the Lock (implicit graph)", d: "Medium", lc: 752, q: "Minimum turns from \"0000\" to the target, avoiding deadends.", idea: "Each state has 8 neighbours (turn one wheel ±1). BFS over the states.", code: R`
from collections import deque

def open_lock(deadends, target):
    dead = set(deadends)
    if "0000" in dead: return -1
    q, seen = deque([("0000", 0)]), {"0000"}
    while q:
        s, d = q.popleft()
        if s == target: return d
        for i in range(4):
            for step in (1, -1):
                nxt = s[:i] + str((int(s[i]) + step) % 10) + s[i + 1:]
                if nxt not in seen and nxt not in dead:
                    seen.add(nxt); q.append((nxt, d + 1))
    return -1

print(open_lock(["0201", "0101", "0102", "1212", "2002"], "0202"))`, out: "6", cx: "O(10^4 · 8)" }],
    ["ex", { t: "Is Graph Bipartite?", d: "Medium", lc: 785, q: "Can the nodes be coloured with 2 colours so that every edge joins different colours?", idea: "BFS colouring. A neighbour with the same colour means it's not bipartite. Loop over all components.", code: R`
from collections import deque

def is_bipartite(graph):
    color = {}
    for s in range(len(graph)):
        if s in color: continue
        color[s] = 0; q = deque([s])
        while q:
            u = q.popleft()
            for v in graph[u]:
                if v not in color:
                    color[v] = 1 - color[u]; q.append(v)
                elif color[v] == color[u]:
                    return False
    return True

print(is_bipartite([[1, 3], [0, 2], [1, 3], [0, 2]]), is_bipartite([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]))`, out: "True False", cx: "O(V + E)" }],
    ["danger", "Marking visited when you **pop** instead of when you **push** in BFS. The same node gets queued many times, and on big grids that means a TLE or memory blow-up."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Number of Islands](neetcode.html#p/number-of-islands)", "[Max Area of Island](neetcode.html#p/max-area-of-island)", "[Clone Graph](neetcode.html#p/clone-graph)", "[Pacific Atlantic](neetcode.html#p/pacific-atlantic-water-flow)", "[Surrounded Regions](neetcode.html#p/surrounded-regions)", "[Word Ladder](neetcode.html#p/word-ladder)"]],
  ],
},
{
  id: "multi-source-bfs", group: "Graphs", title: "Multi-source BFS",
  sub: "Put ALL starting points in the queue at once. BFS then computes the distance to the nearest source for every cell in one pass.",
  tags: ["O(V + E)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Distance to the **nearest** X\" for every cell", "Things spreading **simultaneously** from several places (rotting, fire, infection)", "\"Minimum time until everything is reached\""]],
    ["h", "Template"],
    ["code", R`
from collections import deque

def nearest_zero(mat):                     # LC 542: 01 Matrix
    R, C = len(mat), len(mat[0])
    dist = [[-1] * C for _ in range(R)]
    q = deque()
    for r in range(R):
        for c in range(C):
            if mat[r][c] == 0:
                dist[r][c] = 0
                q.append((r, c))           # every source starts at distance 0
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
    return dist

print(nearest_zero([[0, 0, 0], [0, 1, 0], [1, 1, 1]]))`, "[[0, 0, 0], [0, 1, 0], [1, 2, 1]]"],
    ["h", "Worked examples"],
    ["ex", { t: "Rotting Oranges", d: "Medium", lc: 994, open: true, q: "Minutes until all oranges are rotten (or −1).", idea: "Seed the queue with every rotten orange. Each BFS level is one minute.", code: R`
from collections import deque

def oranges_rotting(g):
    R, C = len(g), len(g[0])
    q = deque((r, c) for r in range(R) for c in range(C) if g[r][c] == 2)
    fresh = sum(row.count(1) for row in g)
    t = 0
    while q and fresh:
        for _ in range(len(q)):
            r, c = q.popleft()
            for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
                if 0 <= nr < R and 0 <= nc < C and g[nr][nc] == 1:
                    g[nr][nc] = 2; fresh -= 1; q.append((nr, nc))
        t += 1
    return -1 if fresh else t

print(oranges_rotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]))`, out: "4", cx: "O(m·n)" }],
    ["ex", { t: "As Far from Land as Possible", d: "Medium", lc: 1162, q: "The water cell whose distance to the nearest land is largest.", idea: "Multi-source BFS from all land cells. The last level reached gives the answer.", code: R`
from collections import deque

def max_distance(grid):
    n = len(grid)
    q = deque((r, c) for r in range(n) for c in range(n) if grid[r][c])
    if len(q) in (0, n * n): return -1
    d = -1
    while q:
        d += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
                if 0 <= nr < n and 0 <= nc < n and not grid[nr][nc]:
                    grid[nr][nc] = 1; q.append((nr, nc))
    return d

print(max_distance([[1, 0, 1], [0, 0, 0], [1, 0, 1]]))`, out: "2", cx: "O(n²)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Rotting Oranges](neetcode.html#p/rotting-oranges)", "[Walls and Gates](neetcode.html#p/walls-and-gates)", "[Pacific Atlantic Water Flow](neetcode.html#p/pacific-atlantic-water-flow) (multi-source DFS)"]],
  ],
},
{
  id: "topological-sort", group: "Graphs", title: "Topological Sort",
  sub: "Order the nodes of a DAG so that every edge goes forward. Kahn's BFS repeatedly takes nodes with in-degree 0.",
  tags: ["O(V + E)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Prerequisites\", \"dependencies\", \"build order\", \"must happen before\"", "\"Is it possible?\" → it's possible exactly when there's no cycle", "Order derived from comparisons (Alien Dictionary)", "DP on a DAG (longest path) processed in topological order"]],
    ["viz", "topoSort"],
    ["h", "Template (Kahn)"],
    ["code", R`
from collections import deque, defaultdict

def topo_sort(n, edges):                   # edge (a, b): a must come before b
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
    return order if len(order) == n else []   # [] -> cycle

print(topo_sort(4, [(0, 1), (0, 2), (1, 3), (2, 3)]), topo_sort(2, [(0, 1), (1, 0)]))`, "[0, 1, 2, 3] []"],
    ["h", "DFS version (post-order reversed)"],
    ["code", R`
def topo_dfs(n, edges):
    adj = [[] for _ in range(n)]
    for a, b in edges: adj[a].append(b)
    state, order = [0] * n, []            # 0 new, 1 visiting, 2 done
    def dfs(u):
        if state[u] == 1: return False    # back edge -> cycle
        if state[u] == 2: return True
        state[u] = 1
        if not all(dfs(v) for v in adj[u]): return False
        state[u] = 2
        order.append(u)                   # post-order
        return True
    if not all(dfs(u) for u in range(n)): return []
    return order[::-1]

print(topo_dfs(4, [(0, 1), (0, 2), (1, 3), (2, 3)]))`, "[0, 2, 1, 3]"],
    ["h", "Worked example"],
    ["ex", { t: "Parallel Courses (minimum semesters)", d: "Medium", lc: 1136, open: true, q: "With unlimited courses per semester, the fewest semesters needed (or −1 if there's a cycle).", idea: "Kahn's BFS **level by level**. Each level is one semester.", code: R`
from collections import deque, defaultdict

def minimum_semesters(n, relations):
    adj, indeg = defaultdict(list), [0] * (n + 1)
    for a, b in relations:
        adj[a].append(b); indeg[b] += 1
    q = deque(i for i in range(1, n + 1) if indeg[i] == 0)
    semesters = taken = 0
    while q:
        semesters += 1
        for _ in range(len(q)):
            u = q.popleft(); taken += 1
            for v in adj[u]:
                indeg[v] -= 1
                if indeg[v] == 0: q.append(v)
    return semesters if taken == n else -1

print(minimum_semesters(3, [[1, 3], [2, 3]]), minimum_semesters(3, [[1, 2], [2, 3], [3, 1]]))`, out: "2 -1", cx: "O(V + E)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Course Schedule](neetcode.html#p/course-schedule)", "[Course Schedule II](neetcode.html#p/course-schedule-ii)", "[Alien Dictionary](neetcode.html#p/alien-dictionary)"]],
  ],
},
{
  id: "union-find", group: "Graphs", title: "Union-Find",
  sub: "Merge groups and ask \"same group?\" in near O(1). Ideal when edges arrive one at a time.",
  tags: ["O(α(n)) per op"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Number of connected components / provinces / islands\" (especially with edges added over time)", "\"Does this edge create a cycle?\" (undirected)", "Grouping by equivalence (accounts merge, similar strings, equations)", "Kruskal's MST"]],
    ["viz", "unionFind"],
    ["h", "Template"],
    ["code", R`
def make_dsu(n):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # path compression
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return False
        parent[rb] = ra
        return True
    return find, union

find, union = make_dsu(5)
print(union(0, 1), union(1, 2), union(0, 2), find(2) == find(0), find(3) == find(0))`, "True True False True False"],
    ["h", "Worked examples"],
    ["ex", { t: "Number of Provinces", d: "Medium", lc: 547, open: true, q: "Count the connected groups in an adjacency matrix.", idea: "Start with n groups and subtract one for every successful union.", code: R`
def find_circle_num(M):
    n = len(M); parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    groups = n
    for i in range(n):
        for j in range(i + 1, n):
            if M[i][j]:
                ri, rj = find(i), find(j)
                if ri != rj:
                    parent[rj] = ri; groups -= 1
    return groups

print(find_circle_num([[1, 1, 0], [1, 1, 0], [0, 0, 1]]))`, out: "2", cx: "O(n² α(n))" }],
    ["ex", { t: "Accounts Merge", d: "Medium", lc: 721, q: "Merge accounts that share any email.", idea: "Union all the emails within one account. Then group emails by their root.", code: R`
from collections import defaultdict

def accounts_merge(accounts):
    parent, owner = {}, {}
    def find(x):
        parent.setdefault(x, x)
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    for name, *emails in accounts:
        for e in emails:
            owner[e] = name
            parent[find(e)] = find(emails[0])
    groups = defaultdict(list)
    for e in owner:
        groups[find(e)].append(e)
    return sorted([owner[r]] + sorted(es) for r, es in groups.items())

print(accounts_merge([["John", "a@x", "b@x"], ["John", "c@x"], ["John", "b@x", "d@x"], ["Mary", "m@x"]]))`, out: "[['John', 'a@x', 'b@x', 'd@x'], ['John', 'c@x'], ['Mary', 'm@x']]", cx: "O(N α(N) + N log N)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Redundant Connection](neetcode.html#p/redundant-connection)", "[Connected Components](neetcode.html#p/number-of-connected-components-in-an-undirected-graph)", "[Graph Valid Tree](neetcode.html#p/graph-valid-tree)"]],
  ],
},
{
  id: "shortest-path", group: "Graphs", title: "Shortest Paths: Dijkstra & Bellman-Ford",
  sub: "Weighted shortest paths. Dijkstra (min-heap) handles non-negative weights. Bellman-Ford handles negative weights or a limit on the number of edges.",
  tags: ["O(E log V)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Minimum cost / time / effort\" between nodes with **weighted** edges", "A grid where moves have different costs", "Minimize the **maximum** edge on a path (Dijkstra with max instead of +)"]],
    ["viz", "dijkstra"],
    ["table", ["Situation", "Algorithm"], [
      ["unweighted", "BFS"],
      ["weights 0 or 1", "0-1 BFS (deque: push 0-edges to the front)"],
      ["non-negative weights", "Dijkstra"],
      ["negative weights / at most k edges", "Bellman-Ford (k rounds)"],
      ["all pairs, V ≤ 400", "Floyd–Warshall"],
    ]],
    ["h", "Dijkstra template"],
    ["code", R`
import heapq
from collections import defaultdict

def dijkstra(n, edges, src):
    adj = defaultdict(list)
    for u, v, w in edges:
        adj[u].append((v, w))
    dist = [float("inf")] * n
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue                       # stale entry
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(heap, (dist[v], v))
    return dist

print(dijkstra(4, [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)], 0))`, "[0, 3, 1, 4]"],
    ["h", "Worked examples"],
    ["ex", { t: "Path With Minimum Effort", d: "Medium", lc: 1631, open: true, q: "Minimize the maximum absolute height difference between consecutive cells on the path.", idea: "Dijkstra where the path cost is max(cost so far, edge).", code: R`
import heapq

def minimum_effort(h):
    R, C = len(h), len(h[0])
    best = [[float("inf")] * C for _ in range(R)]
    best[0][0] = 0
    heap = [(0, 0, 0)]
    while heap:
        e, r, c = heapq.heappop(heap)
        if (r, c) == (R - 1, C - 1): return e
        if e > best[r][c]: continue
        for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
            if 0 <= nr < R and 0 <= nc < C:
                ne = max(e, abs(h[nr][nc] - h[r][c]))
                if ne < best[nr][nc]:
                    best[nr][nc] = ne; heapq.heappush(heap, (ne, nr, nc))

print(minimum_effort([[1, 2, 2], [3, 8, 2], [5, 3, 5]]))`, out: "2", cx: "O(RC log RC)" }],
    ["ex", { t: "Path with Maximum Probability", d: "Medium", lc: 1514, q: "Maximize the product of edge probabilities from start to end.", idea: "A max-heap (negated). Multiply instead of adding. It still works because probabilities ≤ 1 never increase along a path.", code: R`
import heapq
from collections import defaultdict

def max_probability(n, edges, probs, start, end):
    adj = defaultdict(list)
    for (a, b), p in zip(edges, probs):
        adj[a].append((b, p)); adj[b].append((a, p))
    best = [0.0] * n; best[start] = 1.0
    heap = [(-1.0, start)]
    while heap:
        p, u = heapq.heappop(heap); p = -p
        if u == end: return p
        if p < best[u]: continue
        for v, w in adj[u]:
            if p * w > best[v]:
                best[v] = p * w; heapq.heappush(heap, (-best[v], v))
    return 0.0

print(max_probability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2))`, out: "0.25", cx: "O(E log V)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Network Delay Time](neetcode.html#p/network-delay-time)", "[Swim in Rising Water](neetcode.html#p/swim-in-rising-water)", "[Cheapest Flights Within K Stops](neetcode.html#p/cheapest-flights-within-k-stops)"]],
  ],
},
{
  id: "mst", group: "Graphs", title: "Minimum Spanning Tree (Prim / Kruskal)",
  sub: "Connect all nodes with the minimum total edge weight (n − 1 edges, no cycles).",
  tags: ["O(E log E)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Connect all points / cities with minimum total cost\"", "\"Minimum cost to supply water / lay cables\"", "The output is a set of edges or a total cost, not a path"]],
    ["h", "Kruskal (sort edges + Union-Find)"],
    ["code", R`
def kruskal(n, edges):                      # edges: (w, u, v)
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    total, used = 0, 0
    for w, u, v in sorted(edges):           # cheapest first
        ru, rv = find(u), find(v)
        if ru != rv:                        # doesn't form a cycle
            parent[rv] = ru
            total += w; used += 1
            if used == n - 1: break
    return total

print(kruskal(4, [(1, 0, 1), (4, 0, 2), (3, 1, 2), (2, 1, 3), (5, 2, 3)]))`, "6"],
    ["h", "Prim (grow from a node with a heap)"],
    ["code", R`
import heapq

def prim(n, adj):                           # adj[u] = [(w, v), ...]
    seen, total, heap = set(), 0, [(0, 0)]
    while heap and len(seen) < n:
        w, u = heapq.heappop(heap)
        if u in seen: continue
        seen.add(u); total += w
        for w2, v in adj[u]:
            if v not in seen:
                heapq.heappush(heap, (w2, v))
    return total

adj = {0: [(1, 1), (4, 2)], 1: [(1, 0), (3, 2), (2, 3)], 2: [(4, 0), (3, 1), (5, 3)], 3: [(2, 1), (5, 2)]}
print(prim(4, adj))`, "6"],
    ["tip", "Kruskal is natural when you have an edge list. Prim is natural for dense graphs or complete graphs (all pairs of points)."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Min Cost to Connect All Points](neetcode.html#p/min-cost-to-connect-all-points)"]],
  ],
},
/* ---------------------------------------------------------- DP */
{
  id: "dp-1d", group: "Dynamic Programming", title: "1-D DP (linear sequence)",
  sub: "dp[i] depends on a few earlier states, usually dp[i−1] and dp[i−2]. It often compresses to O(1) space.",
  tags: ["O(n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Number of ways to reach step n\"", "\"Max/min value choosing elements with a constraint\" (no two adjacent)", "\"Can the prefix be split into valid pieces?\"", "The decision at i only depends on a few previous positions"]],
    ["viz", "houseRobber"],
    ["h", "Template"],
    ["code", R`
def linear_dp(nums):
    # dp[i] = best answer considering nums[:i+1]
    prev2, prev1 = 0, 0                     # dp[i-2], dp[i-1]
    for x in nums:
        cur = max(prev1, prev2 + x)         # recurrence (here: house robber)
        prev2, prev1 = prev1, cur
    return prev1

print(linear_dp([2, 7, 9, 3, 1]))`, "12"],
    ["h", "Worked examples"],
    ["ex", { t: "Climbing Stairs (with up to k steps)", d: "Easy", lc: 70, open: true, q: "Ways to climb n stairs taking 1..k steps at a time.", idea: "ways[i] = sum of ways[i−1..i−k]. For k = 2 that's Fibonacci.", code: R`
def climb(n, k=2):
    ways = [1] + [0] * n
    for i in range(1, n + 1):
        ways[i] = sum(ways[max(0, i - k):i])
    return ways[n]

print(climb(5), climb(5, 3), climb(10))`, out: "8 13 89", cx: "O(n·k)" }],
    ["ex", { t: "Decode Ways", d: "Medium", lc: 91, q: "Number of ways to decode a digit string (A=1..Z=26).", idea: "Take 1 digit (if it's not '0') or 2 digits (if 10–26).", code: R`
def num_decodings(s):
    prev2, prev1 = 1, int(s[0] != "0")
    for i in range(1, len(s)):
        cur = (prev1 if s[i] != "0" else 0) + (prev2 if 10 <= int(s[i-1:i+1]) <= 26 else 0)
        prev2, prev1 = prev1, cur
    return prev1

print(num_decodings("226"), num_decodings("06"), num_decodings("11106"))`, out: "3 0 2", cx: "O(n)" }],
    ["ex", { t: "Word Break", d: "Medium", lc: 139, q: "Can s be segmented into dictionary words?", idea: "ok[i] = any(ok[j] and s[j:i] in words).", code: R`
def word_break(s, words):
    words = set(words)
    ok = [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        ok[i] = any(ok[j] and s[j:i] in words for j in range(i))
    return ok[-1]

print(word_break("applepenapple", ["apple", "pen"]), word_break("catsandog", ["cats", "dog", "sand", "and", "cat"]))`, out: "True False", cx: "O(n²)" }],
    ["ex", { t: "Longest Increasing Subsequence (O(n²) DP)", d: "Medium", lc: 300, q: "Length of the LIS.", idea: "dp[i] = 1 + max(dp[j] for j < i with nums[j] < nums[i]).", code: R`
def lis(nums):
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))`, out: "4", cx: "O(n²)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Climbing Stairs](neetcode.html#p/climbing-stairs)", "[Min Cost Climbing Stairs](neetcode.html#p/min-cost-climbing-stairs)", "[House Robber](neetcode.html#p/house-robber)", "[House Robber II](neetcode.html#p/house-robber-ii)", "[Decode Ways](neetcode.html#p/decode-ways)", "[Word Break](neetcode.html#p/word-break)", "[LIS](neetcode.html#p/longest-increasing-subsequence)"]],
  ],
},
{
  id: "dp-knapsack", group: "Dynamic Programming", title: "Knapsack DP (0/1 and unbounded)",
  sub: "Choose items to hit or optimize a capacity. The loop direction decides whether items can be reused.",
  tags: ["O(n · capacity)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Subset with sum = target\", \"partition into equal halves\"", "\"Fewest coins / number of ways to make an amount\"", "Each item has a weight/cost and you pick a combination under a limit"]],
    ["table", ["Variant", "Item reuse", "Inner loop", "Example"], [
      ["0/1", "each item once", "capacity **backwards**", "Partition Equal Subset Sum, Target Sum"],
      ["Unbounded", "unlimited", "capacity **forwards**", "Coin Change, Coin Change II"],
      ["Count combinations", "—", "items outer, capacity inner", "Coin Change II"],
      ["Count permutations", "—", "capacity outer, items inner", "Combination Sum IV"],
    ]],
    ["h", "Template"],
    ["code", R`
def zero_one(weights, values, cap):        # each item at most once
    dp = [0] * (cap + 1)
    for w, v in zip(weights, values):
        for c in range(cap, w - 1, -1):    # BACKWARDS
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]

def unbounded(weights, values, cap):       # unlimited copies
    dp = [0] * (cap + 1)
    for w, v in zip(weights, values):
        for c in range(w, cap + 1):        # FORWARDS
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]

print(zero_one([1, 3, 4], [15, 20, 30], 4), unbounded([1, 3, 4], [15, 20, 30], 4))`, "35 60"],
    ["h", "Worked examples"],
    ["ex", { t: "Partition Equal Subset Sum", d: "Medium", lc: 416, open: true, q: "Can the array split into two equal-sum halves?", idea: "0/1 subset sum to total/2 with a boolean dp.", code: R`
def can_partition(nums):
    total = sum(nums)
    if total % 2: return False
    t = total // 2
    dp = [True] + [False] * t
    for x in nums:
        for s in range(t, x - 1, -1):
            dp[s] = dp[s] or dp[s - x]
    return dp[t]

print(can_partition([1, 5, 11, 5]), can_partition([1, 2, 3, 5]))`, out: "True False", cx: "O(n · sum)" }],
    ["ex", { t: "Coin Change II (count combinations)", d: "Medium", lc: 518, q: "Number of coin combinations making the amount.", idea: "Coins outer, amount inner (forwards).", code: R`
def change(amount, coins):
    dp = [1] + [0] * amount
    for c in coins:
        for a in range(c, amount + 1):
            dp[a] += dp[a - c]
    return dp[amount]

print(change(5, [1, 2, 5]))`, out: "4", cx: "O(n · amount)" }],
    ["ex", { t: "Combination Sum IV (count ordered sequences)", d: "Medium", lc: 377, q: "The number of ordered sequences that sum to the target.", idea: "Target outer, nums inner, so different orders count separately.", code: R`
def combination_sum4(nums, target):
    dp = [1] + [0] * target
    for t in range(1, target + 1):
        for x in nums:
            if x <= t:
                dp[t] += dp[t - x]
    return dp[target]

print(combination_sum4([1, 2, 3], 4))`, out: "7", cx: "O(n · target)" }],
    ["ex", { t: "Last Stone Weight II", d: "Medium", lc: 1049, q: "Smash stones and minimize the final weight.", idea: "Split the stones into two groups with sums as close as possible: a 0/1 subset sum up to total/2.", code: R`
def last_stone_weight_ii(stones):
    total = sum(stones)
    reach = {0}
    for s in stones:
        reach |= {r + s for r in reach if r + s <= total // 2}
    return total - 2 * max(reach)

print(last_stone_weight_ii([2, 7, 4, 1, 8, 1]), last_stone_weight_ii([31, 26, 33, 21, 40]))`, out: "1 5", cx: "O(n · sum)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Coin Change](neetcode.html#p/coin-change)", "[Partition Equal Subset Sum](neetcode.html#p/partition-equal-subset-sum)", "[Coin Change II](neetcode.html#p/coin-change-ii)", "[Target Sum](neetcode.html#p/target-sum)"]],
  ],
},
{
  id: "dp-grid", group: "Dynamic Programming", title: "Grid DP",
  sub: "dp[r][c] built from the cells you can arrive from (usually up and left).",
  tags: ["O(m·n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Moves are restricted (only right/down), so there are no cycles", "\"Number of paths\", \"min path sum\", \"largest square of 1s\"", "Obstacles that block cells"]],
    ["diagram", "grid", [[[1, 1, 1, 1], [1, 2, 3, 4], [1, 3, 6, 10]], { head: true, hl: ["2,3"], ok: ["1,3", "2,2"] }], "Unique Paths: each cell = top + left. The bottom-right holds 10."],
    ["h", "Template"],
    ["code", R`
def min_path_sum(grid):
    R, C = len(grid), len(grid[0])
    dp = [[0] * C for _ in range(R)]
    for r in range(R):
        for c in range(C):
            if r == 0 and c == 0:
                dp[r][c] = grid[0][0]
            else:
                up = dp[r - 1][c] if r else float("inf")
                left = dp[r][c - 1] if c else float("inf")
                dp[r][c] = grid[r][c] + min(up, left)
    return dp[-1][-1]

print(min_path_sum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]))`, "7"],
    ["h", "Worked examples"],
    ["ex", { t: "Unique Paths II (with obstacles)", d: "Medium", lc: 63, open: true, q: "Count the paths when some cells are blocked.", idea: "A blocked cell has 0 ways. One row of memory is enough.", code: R`
def unique_paths_with_obstacles(g):
    C = len(g[0]); row = [0] * C; row[0] = 1
    for r in range(len(g)):
        for c in range(C):
            if g[r][c] == 1:
                row[c] = 0
            elif c:
                row[c] += row[c - 1]
    return row[-1]

print(unique_paths_with_obstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]]))`, out: "2", cx: "O(m·n), O(n)" }],
    ["ex", { t: "Maximal Square", d: "Medium", lc: 221, q: "The largest square containing only 1s.", idea: "dp[r][c] = 1 + min(up, left, diagonal) when the cell is '1'. It's the side length of the best square ending there.", code: R`
def maximal_square(m):
    R, C = len(m), len(m[0])
    dp = [[0] * (C + 1) for _ in range(R + 1)]
    best = 0
    for r in range(R):
        for c in range(C):
            if m[r][c] == "1":
                dp[r + 1][c + 1] = 1 + min(dp[r][c + 1], dp[r + 1][c], dp[r][c])
                best = max(best, dp[r + 1][c + 1])
    return best * best

print(maximal_square(["10100", "10111", "11111", "10010"]))`, out: "4", cx: "O(m·n)" }],
    ["ex", { t: "Triangle", d: "Medium", lc: 120, q: "Minimum path sum from top to bottom of a triangle.", idea: "Bottom-up: each cell = its value + the min of the two cells below it.", code: R`
def minimum_total(tri):
    dp = tri[-1][:]
    for row in reversed(tri[:-1]):
        dp = [v + min(dp[i], dp[i + 1]) for i, v in enumerate(row)]
    return dp[0]

print(minimum_total([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]))`, out: "11", cx: "O(n²)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Unique Paths](neetcode.html#p/unique-paths)", "[Longest Increasing Path in a Matrix](neetcode.html#p/longest-increasing-path-in-a-matrix)"]],
  ],
},
{
  id: "dp-strings", group: "Dynamic Programming", title: "DP on Two Strings",
  sub: "dp[i][j] describes prefixes `a[:i]` and `b[:j]`. Compare the last characters and choose a transition.",
  tags: ["O(m·n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Two strings or sequences and the words \"common\", \"edit\", \"match\", \"interleave\", \"subsequence count\"", "Wildcard / regex matching"]],
    ["viz", "lcs"],
    ["table", ["Problem", "Match (a[i−1] == b[j−1])", "Mismatch"], [
      ["LCS", "diag + 1", "max(up, left)"],
      ["Edit distance", "diag", "1 + min(up, left, diag)"],
      ["Distinct subsequences", "diag + up", "up"],
      ["Shortest common supersequence", "diag + 1", "1 + min(up, left)"],
    ]],
    ["h", "Template"],
    ["code", R`
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]   # row/col 0 = empty prefix
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs("abcde", "ace"), lcs("abc", "def"))`, "3 0"],
    ["h", "Worked examples"],
    ["ex", { t: "Edit Distance", d: "Medium", lc: 72, open: true, q: "Min insert/delete/replace operations to turn a into b.", idea: "Base: dp[i][0] = i, dp[0][j] = j. Mismatch → 1 + min of the three neighbours.", code: R`
def min_distance(a, b):
    m, n = len(a), len(b)
    dp = [[i + j if i * j == 0 else 0 for j in range(n + 1)] for i in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i-1][j-1] if a[i-1] == b[j-1] else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]

print(min_distance("horse", "ros"), min_distance("intention", "execution"))`, out: "3 5", cx: "O(m·n)" }],
    ["ex", { t: "Longest Palindromic Subsequence", d: "Medium", lc: 516, q: "Length of the longest palindromic subsequence.", idea: "It's the LCS of s and reversed(s).", code: R`
def longest_palindrome_subseq(s):
    t = s[::-1]; n = len(s)
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i-1][j-1] + 1 if s[i-1] == t[j-1] else max(dp[i-1][j], dp[i][j-1])
    return dp[n][n]

print(longest_palindrome_subseq("bbbab"), longest_palindrome_subseq("cbbd"))`, out: "4 2", cx: "O(n²)" }],
    ["ex", { t: "Wildcard Matching", d: "Hard", lc: 44, q: "'?' matches one char and '*' matches any sequence. Does p match all of s?", idea: "dp[i][j]: does s[:i] match p[:j]? '*' → dp[i][j−1] (empty) or dp[i−1][j] (consume one char).", code: R`
def is_match(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j - 1] and p[j - 1] == "*"
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
            elif p[j - 1] in ("?", s[i - 1]):
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]

print(is_match("adceb", "*a*b"), is_match("acdcb", "a*c?b"))`, out: "True False", cx: "O(m·n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Longest Common Subsequence](neetcode.html#p/longest-common-subsequence)", "[Edit Distance](neetcode.html#p/edit-distance)", "[Distinct Subsequences](neetcode.html#p/distinct-subsequences)", "[Interleaving String](neetcode.html#p/interleaving-string)", "[Regular Expression Matching](neetcode.html#p/regular-expression-matching)"]],
  ],
},
{
  id: "dp-intervals", group: "Dynamic Programming", title: "Interval DP & Palindromes",
  sub: "dp[l][r] solves the sub-range l..r, built from shorter ranges, so iterate by increasing length.",
  tags: ["O(n²) – O(n³)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["The answer for a range depends on splitting it at some k", "Palindrome substrings / partitions", "\"Burst\", \"merge stones\", \"matrix chain\", \"cut a stick\""]],
    ["h", "Template"],
    ["code", R`
def palindromic_substrings_table(s):
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    count = 0
    for length in range(1, n + 1):             # short ranges first
        for l in range(n - length + 1):
            r = l + length - 1
            pal[l][r] = s[l] == s[r] and (length <= 2 or pal[l + 1][r - 1])
            count += pal[l][r]
    return count

print(palindromic_substrings_table("aaa"), palindromic_substrings_table("abc"))`, "6 3"],
    ["h", "Worked examples"],
    ["ex", { t: "Minimum Cost to Cut a Stick", d: "Hard", lc: 1547, open: true, q: "Cut a stick at the given positions. Each cut costs the current stick length. Minimize the total.", idea: "Add 0 and n to the cuts and sort. dp[i][j] = min over k of dp[i][k] + dp[k][j] + (c[j] − c[i]).", code: R`
from functools import cache

def min_cost(n, cuts):
    c = [0] + sorted(cuts) + [n]
    @cache
    def dp(i, j):
        if j - i < 2: return 0
        return min(dp(i, k) + dp(k, j) for k in range(i + 1, j)) + c[j] - c[i]
    return dp(0, len(c) - 1)

print(min_cost(7, [1, 3, 4, 5]), min_cost(9, [5, 6, 1, 4, 2]))`, out: "16 22", cx: "O(m³)" }],
    ["ex", { t: "Palindrome Partitioning II (min cuts)", d: "Hard", lc: 132, q: "Minimum cuts so that every piece is a palindrome.", idea: "Precompute the pal table. Then cuts[i] = min(cuts[j−1] + 1) over j where s[j..i] is a palindrome.", code: R`
def min_cut(s):
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    cuts = [0] * n
    for i in range(n):
        best = i
        for j in range(i + 1):
            if s[j] == s[i] and (i - j < 2 or pal[j + 1][i - 1]):
                pal[j][i] = True
                best = 0 if j == 0 else min(best, cuts[j - 1] + 1)
        cuts[i] = best
    return cuts[-1]

print(min_cut("aab"), min_cut("abccbc"))`, out: "1 2", cx: "O(n²)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Burst Balloons](neetcode.html#p/burst-balloons)", "[Longest Palindromic Substring](neetcode.html#p/longest-palindromic-substring)", "[Palindromic Substrings](neetcode.html#p/palindromic-substrings)"]],
  ],
},
{
  id: "dp-state-machine", group: "Dynamic Programming", title: "State Machine DP",
  sub: "At each step you're in one of a few named states (holding, sold, resting…). Write the transitions and keep one variable per state.",
  tags: ["O(n · states)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Stock buy/sell with rules (cooldown, fee, at most k transactions)", "\"Paint houses with no two adjacent the same colour\"", "Any process where the allowed next action depends on the current mode"]],
    ["h", "Template"],
    ["code", R`
def max_profit_fee(prices, fee):          # LC 714
    hold, free = -prices[0], 0            # best profit while holding / not holding
    for p in prices[1:]:
        hold, free = max(hold, free - p), max(free, hold + p - fee)
    return free

print(max_profit_fee([1, 3, 2, 8, 4, 9], 2))`, "8"],
    ["h", "Worked examples"],
    ["ex", { t: "Best Time to Buy and Sell Stock III (at most 2 transactions)", d: "Hard", lc: 123, open: true, q: "Max profit with ≤ 2 transactions.", idea: "Four states: after buy1, sell1, buy2, sell2.", code: R`
def max_profit_2(prices):
    b1 = b2 = float("-inf"); s1 = s2 = 0
    for p in prices:
        b1 = max(b1, -p)
        s1 = max(s1, b1 + p)
        b2 = max(b2, s1 - p)
        s2 = max(s2, b2 + p)
    return s2

print(max_profit_2([3, 3, 5, 0, 0, 3, 1, 4]), max_profit_2([1, 2, 3, 4, 5]))`, out: "6 4", cx: "O(n)" }],
    ["ex", { t: "Paint House", d: "Medium", lc: 256, q: "Paint each house one of 3 colours, with no two neighbours the same colour, at minimum cost.", idea: "State = the colour of the current house. Each colour comes from the min of the other two.", code: R`
def min_cost_paint(costs):
    r = g = b = 0
    for cr, cg, cb in costs:
        r, g, b = cr + min(g, b), cg + min(r, b), cb + min(r, g)
    return min(r, g, b)

print(min_cost_paint([[17, 2, 17], [16, 16, 5], [14, 3, 19]]))`, out: "10", cx: "O(n)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Stock with Cooldown](neetcode.html#p/best-time-to-buy-and-sell-stock-with-cooldown)"]],
  ],
},
/* ---------------------------------------------------------- OTHER */
{
  id: "greedy", group: "Greedy & Bits", title: "Greedy",
  sub: "Commit to the locally best choice. It's correct only when an exchange argument shows the choice is always safe.",
  tags: ["often O(n log n)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["Sorting by one key makes the decision obvious (earliest end, smallest first)", "\"Minimum number of …\" with simple local rules", "You can argue: \"swapping any other choice for mine never hurts\""]],
    ["table", ["Greedy family", "Rule", "Examples"], [
      ["Interval scheduling", "earliest end first", "Non-overlapping Intervals, Arrows"],
      ["Reachability", "track the farthest reach", "Jump Game I/II"],
      ["Balance / prefix", "reset when negative", "Gas Station, Kadane"],
      ["Two pointers greedy", "match the biggest with the smallest", "Boats to Save People, Assign Cookies"],
      ["Heap greedy", "always the most frequent / cheapest", "Task Scheduler, Reorganize String"],
    ]],
    ["h", "Worked examples"],
    ["ex", { t: "Assign Cookies", d: "Easy", lc: 455, open: true, q: "Children have greed values and cookies have sizes. Maximize the number of content children.", idea: "Sort both. Give the smallest sufficient cookie to the least greedy child.", code: R`
def find_content_children(greed, sizes):
    greed.sort(); sizes.sort()
    child = 0
    for s in sizes:
        if child < len(greed) and s >= greed[child]:
            child += 1
    return child

print(find_content_children([1, 2, 3], [1, 1]), find_content_children([1, 2], [1, 2, 3]))`, out: "1 2", cx: "O(n log n)" }],
    ["ex", { t: "Boats to Save People", d: "Medium", lc: 881, q: "Each boat holds ≤ 2 people with a weight limit. Find the minimum number of boats.", idea: "Sort. Pair the heaviest with the lightest if they fit, otherwise the heaviest goes alone.", code: R`
def num_rescue_boats(people, limit):
    people.sort()
    l, r, boats = 0, len(people) - 1, 0
    while l <= r:
        if people[l] + people[r] <= limit:
            l += 1
        r -= 1
        boats += 1
    return boats

print(num_rescue_boats([3, 2, 2, 1], 3), num_rescue_boats([3, 5, 3, 4], 5))`, out: "3 4", cx: "O(n log n)" }],
    ["ex", { t: "Candy", d: "Hard", lc: 135, q: "Children with higher ratings than a neighbour must get more candy. Find the minimum total.", idea: "Two passes: left→right enforces the left neighbour, right→left enforces the right neighbour (take the max).", code: R`
def candy(ratings):
    n = len(ratings); c = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]: c[i] = c[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]: c[i] = max(c[i], c[i + 1] + 1)
    return sum(c)

print(candy([1, 0, 2]), candy([1, 2, 2]))`, out: "5 4", cx: "O(n)" }],
    ["warn", "Before coding a greedy, try to break it with a small counter-example. If you can't prove it, consider DP."],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Maximum Subarray](neetcode.html#p/maximum-subarray)", "[Jump Game](neetcode.html#p/jump-game)", "[Jump Game II](neetcode.html#p/jump-game-ii)", "[Gas Station](neetcode.html#p/gas-station)", "[Hand of Straights](neetcode.html#p/hand-of-straights)", "[Partition Labels](neetcode.html#p/partition-labels)", "[Valid Parenthesis String](neetcode.html#p/valid-parenthesis-string)"]],
  ],
},
{
  id: "bit-manipulation", group: "Greedy & Bits", title: "Bit Manipulation Tricks",
  sub: "XOR cancellation, `n & (n−1)`, masks for subsets. They give O(1)-space solutions.",
  tags: ["O(n)", "O(1)"],
  blocks: [
    ["h", "Recognize it when…"],
    ["list", ["\"Every element appears twice except…\" → XOR", "Counting bits, powers of two", "Subsets of ≤ 20 items → bitmask", "\"Without + or −\", or \"in O(1) space\""]],
    ["viz", "bits"],
    ["h", "Worked examples"],
    ["ex", { t: "Single Number III (two unique numbers)", d: "Medium", lc: 260, open: true, q: "Two numbers appear once and all others twice. Find both.", idea: "XOR all → a ^ b. Its lowest set bit is a bit where a and b differ. Split the numbers into two groups by that bit and XOR each group.", code: R`
def single_number_iii(nums):
    x = 0
    for v in nums: x ^= v              # a ^ b
    low = x & -x                       # a bit where a and b differ
    a = 0
    for v in nums:
        if v & low: a ^= v
    return sorted([a, x ^ a])

print(single_number_iii([1, 2, 1, 3, 2, 5]))`, out: "[3, 5]", cx: "O(n), O(1)" }],
    ["ex", { t: "Single Number II (others appear 3 times)", d: "Medium", lc: 137, q: "Every element appears three times except one.", idea: "Count each bit position mod 3. The leftover bits form the answer (handle the sign for 32-bit).", code: R`
def single_number_ii(nums):
    res = 0
    for b in range(32):
        s = sum((x >> b) & 1 for x in nums) % 3
        res |= s << b
    return res - (1 << 32) if res >= 1 << 31 else res

print(single_number_ii([2, 2, 3, 2]), single_number_ii([0, 1, 0, 1, 0, 1, -99]))`, out: "3 -99", cx: "O(32n)" }],
    ["ex", { t: "Power of Two / Four", d: "Easy", lc: 231, q: "Is n a power of two? A power of four?", idea: "Power of two: exactly one bit set. Power of four: also, that bit is in an even position (mask 0x55555555).", code: R`
def is_power_of_two(n): return n > 0 and n & (n - 1) == 0
def is_power_of_four(n): return is_power_of_two(n) and n & 0x55555555 != 0

print([n for n in range(1, 70) if is_power_of_two(n)], [n for n in range(1, 70) if is_power_of_four(n)])`, out: "[1, 2, 4, 8, 16, 32, 64] [1, 4, 16, 64]", cx: "O(1)" }],
    ["ex", { t: "Subsets via bitmask", d: "Medium", lc: 78, q: "All subsets of nums.", idea: "Each mask from 0 to 2ⁿ − 1 encodes a subset: bit i means include nums[i].", code: R`
def subsets(nums):
    n = len(nums)
    return [[nums[i] for i in range(n) if mask >> i & 1] for mask in range(1 << n)]

print(subsets([1, 2, 3]))`, out: "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]", cx: "O(n · 2ⁿ)" }],
    ["h", "Practice (NeetCode)"],
    ["list", ["[Single Number](neetcode.html#p/single-number)", "[Number of 1 Bits](neetcode.html#p/number-of-1-bits)", "[Counting Bits](neetcode.html#p/counting-bits)", "[Reverse Bits](neetcode.html#p/reverse-bits)", "[Missing Number](neetcode.html#p/missing-number)", "[Sum of Two Integers](neetcode.html#p/sum-of-two-integers)"]],
  ],
},
);
