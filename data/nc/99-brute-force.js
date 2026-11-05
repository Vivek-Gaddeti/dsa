/* Brute-force approaches for the problems whose main file only had the optimal solution.
   Loaded after all category files; fills p.brute where it is missing. */
(function () {
  const B = {
"evaluate-reverse-polish-notation": { idea: "Repeatedly scan the token list for the first operator, evaluate it with the two tokens before it, and splice the result back in. Repeat until one token remains.", code: R`
class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        tokens = tokens[:]
        while len(tokens) > 1:
            for i, t in enumerate(tokens):
                if t in "+-*/" and len(t) == 1:
                    a, b = int(tokens[i - 2]), int(tokens[i - 1])
                    r = a + b if t == "+" else a - b if t == "-" else a * b if t == "*" else int(a / b)
                    tokens[i - 2:i + 1] = [str(r)]      # splice: O(n)
                    break
        return int(tokens[0])`, tc: "O(n²)", sc: "O(n)", bad: "Every evaluation rescans from the start and splices the list. The stack processes each token once." },

"car-fleet": { idea: "Sort cars by position (closest to target first) and compute each one's arrival time. A car starts a new fleet only if it's slower than **every** car ahead of it, so check all of them.", code: R`
class Solution:
    def carFleet(self, target: int, position: list[int], speed: list[int]) -> int:
        cars = sorted(zip(position, speed), reverse=True)
        times = [(target - p) / s for p, s in cars]
        fleets = 0
        for i in range(len(times)):
            if all(times[i] > times[j] for j in range(i)):   # slower than everyone ahead
                fleets += 1
        return fleets`, tc: "O(n²)", sc: "O(n)", bad: "Re-checks every car ahead. Only the slowest fleet ahead matters, which is the stack top." },

"merge-two-sorted-lists": { idea: "Copy all values into a Python list, sort them, and build a brand-new linked list.", code: R`
class Solution:
    def mergeTwoLists(self, list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
        return build_list(sorted(to_list(list1) + to_list(list2)))`, tc: "O((m+n) log(m+n))", sc: "O(m+n)", bad: "Ignores that both inputs are already sorted, and allocates new nodes instead of splicing." },

"copy-list-with-random-pointer": { idea: "Put the original nodes in an array and create copies by position. For every `random` pointer, find the index it points to by **scanning** the array.", code: R`
class Node:
    def __init__(self, x: int, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: "Node | None") -> "Node | None":
        nodes, cur = [], head
        while cur:
            nodes.append(cur); cur = cur.next
        copies = [Node(n.val) for n in nodes]
        for i, n in enumerate(nodes):
            copies[i].next = copies[i + 1] if i + 1 < len(nodes) else None
            if n.random:
                j = next(k for k, m in enumerate(nodes) if m is n.random)   # O(n) search
                copies[i].random = copies[j]
        return copies[0] if copies else None`, tc: "O(n²)", sc: "O(n)", bad: "The linear search for every random pointer is what the old → new hash map removes." },

"add-two-numbers": { idea: "Convert both lists to Python integers, add them, and convert the sum back to a reversed digit list.", code: R`
class Solution:
    def addTwoNumbers(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        def to_int(node):
            n, place = 0, 1
            while node:
                n += node.val * place; place *= 10; node = node.next
            return n
        total = to_int(l1) + to_int(l2)
        return build_list([int(d) for d in reversed(str(total))])`, tc: "O(m + n)", sc: "O(m + n)", bad: "It only works because Python has unbounded ints. In Java/C++ a 100-digit number overflows, which is the whole point of the problem." },

"reverse-nodes-in-k-group": { idea: "Copy the values into an array, reverse every full chunk of k, and build a new list.", code: R`
class Solution:
    def reverseKGroup(self, head: ListNode | None, k: int) -> ListNode | None:
        vals = to_list(head)
        for i in range(0, len(vals) - k + 1, k):
            vals[i:i + k] = vals[i:i + k][::-1]
        return build_list(vals)`, tc: "O(n)", sc: "O(n)", bad: "It changes values instead of links and uses O(n) extra memory. The problem asks you to rearrange the nodes themselves." },

"invert-binary-tree": { idea: "Build a **new** mirrored tree instead of swapping in place: the new node's left is the mirrored right subtree and vice versa.", code: R`
class Solution:
    def invertTree(self, root: TreeNode | None) -> TreeNode | None:
        if not root:
            return None
        return TreeNode(root.val, self.invertTree(root.right), self.invertTree(root.left))`, tc: "O(n)", sc: "O(n)", bad: "Same time, but it allocates n new nodes. For this problem the simple recursion is already optimal." },

"maximum-depth-of-binary-tree": { idea: "Enumerate every root-to-leaf path with an explicit stack, record each path's length, and take the maximum.", code: R`
class Solution:
    def maxDepth(self, root: TreeNode | None) -> int:
        if not root:
            return 0
        lengths, stack = [], [(root, 1)]
        while stack:
            node, d = stack.pop()
            if not node.left and not node.right:
                lengths.append(d)
            for ch in (node.left, node.right):
                if ch:
                    stack.append((ch, d + 1))
        return max(lengths)`, tc: "O(n)", sc: "O(n)", bad: "Same complexity. It's shown so you see the iterative form. The one-line recursion is the expected answer." },

"balanced-binary-tree": { idea: "At every node, compute the heights of both subtrees from scratch and compare them, then recurse into the children.", code: R`
class Solution:
    def isBalanced(self, root: TreeNode | None) -> bool:
        def height(n):
            return 0 if not n else 1 + max(height(n.left), height(n.right))
        if not root:
            return True
        return (abs(height(root.left) - height(root.right)) <= 1
                and self.isBalanced(root.left) and self.isBalanced(root.right))`, tc: "O(n²) worst (O(n log n) if balanced)", sc: "O(h)", bad: "Heights are recomputed for every ancestor. The optimal DFS computes each height once." },

"same-tree": { idea: "Serialize both trees, preorder **with None markers**, and compare the lists.", code: R`
class Solution:
    def isSameTree(self, p: TreeNode | None, q: TreeNode | None) -> bool:
        def ser(n):
            return [None] if not n else [n.val] + ser(n.left) + ser(n.right)
        return ser(p) == ser(q)`, tc: "O(n²) (list concatenation)", sc: "O(n)", bad: "It builds whole lists even when the roots already differ. The parallel recursion stops at the first mismatch." },

"subtree-of-another-tree": { idea: "Serialize **every** subtree of root (re-serializing from each node) and check whether subRoot's serialization is among them.", code: R`
class Solution:
    def isSubtree(self, root: TreeNode | None, subRoot: TreeNode | None) -> bool:
        def ser(n):
            return "#" if not n else f"({n.val},{ser(n.left)},{ser(n.right)})"
        target, found = ser(subRoot), []
        def walk(n):
            if not n:
                return
            found.append(ser(n))          # re-serializes the whole subtree each time
            walk(n.left); walk(n.right)
        walk(root)
        return target in found`, tc: "O(m²)", sc: "O(m²)", bad: "Re-serializes overlapping subtrees again and again." },

"lowest-common-ancestor-of-a-binary-search-tree": { idea: "Ignore the BST property: find the full root-to-node path for p and for q with DFS, then walk both paths together. The last shared node is the LCA.", code: R`
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        def path(node, target, acc):
            if not node:
                return None
            acc = acc + [node]
            if node is target:
                return acc
            return path(node.left, target, acc) or path(node.right, target, acc)
        pp, qp = path(root, p, []), path(root, q, [])
        lca = None
        for a, b in zip(pp, qp):
            if a is not b:
                break
            lca = a
        return lca`, tc: "O(n · h)", sc: "O(n · h)", bad: "Searches the whole tree. In a BST, comparing values tells you which way to go, giving O(h)." },

"binary-tree-level-order-traversal": { idea: "Compute the height, then for each depth d walk the tree again from the root collecting nodes at exactly depth d.", code: R`
class Solution:
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        def height(n):
            return 0 if not n else 1 + max(height(n.left), height(n.right))
        def collect(n, d, out):
            if not n:
                return
            if d == 0:
                out.append(n.val); return
            collect(n.left, d - 1, out); collect(n.right, d - 1, out)
        res = []
        for d in range(height(root)):
            level = []
            collect(root, d, level)
            res.append(level)
        return res`, tc: "O(n · h), so O(n²) for a skewed tree", sc: "O(h)", bad: "It walks the top levels again for every depth. A BFS queue visits each node once." },

"binary-tree-right-side-view": { idea: "Collect **all** nodes grouped by depth, left to right, with DFS, then take the last node of each level.", code: R`
class Solution:
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        levels = {}
        def dfs(n, d):
            if not n:
                return
            levels.setdefault(d, []).append(n.val)
            dfs(n.left, d + 1); dfs(n.right, d + 1)
        dfs(root, 0)
        return [levels[d][-1] for d in range(len(levels))]`, tc: "O(n)", sc: "O(n)", bad: "Same time, but it stores every node. BFS (or right-first DFS) only needs one value per level." },

"count-good-nodes-in-binary-tree": { idea: "Keep the entire root-to-node path and, at each node, **rescan the path** to find its maximum.", code: R`
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        count = 0
        def dfs(n, path):
            nonlocal count
            if not n:
                return
            path.append(n.val)
            if n.val >= max(path):        # O(h) scan
                count += 1
            dfs(n.left, path); dfs(n.right, path)
            path.pop()
        dfs(root, [])
        return count`, tc: "O(n · h)", sc: "O(h)", bad: "Passing the running maximum down makes each check O(1)." },

"validate-binary-search-tree": { idea: "For every node, collect **all** values in its left and right subtrees and check they're all smaller or larger. Then recurse.", code: R`
class Solution:
    def isValidBST(self, root: TreeNode | None) -> bool:
        def values(n):
            return [] if not n else values(n.left) + [n.val] + values(n.right)
        if not root:
            return True
        if any(v >= root.val for v in values(root.left)):
            return False
        if any(v <= root.val for v in values(root.right)):
            return False
        return self.isValidBST(root.left) and self.isValidBST(root.right)`, tc: "O(n²)", sc: "O(n)", bad: "Subtrees are re-collected for every ancestor. Passing (low, high) bounds checks each node once." },

"kth-smallest-element-in-a-bst": { idea: "Collect every value with any traversal, sort them, and pick index k−1.", code: R`
class Solution:
    def kthSmallest(self, root: TreeNode | None, k: int) -> int:
        vals = []
        def dfs(n):
            if n:
                vals.append(n.val); dfs(n.left); dfs(n.right)
        dfs(root)
        return sorted(vals)[k - 1]`, tc: "O(n log n)", sc: "O(n)", bad: "Ignores the BST order. An in-order traversal is already sorted and can stop after k nodes." },

"binary-tree-maximum-path-sum": { idea: "Treat every node as the \"top\" of the path. For each one, compute the best downward gain on the left and right **from scratch**.", code: R`
class Solution:
    def maxPathSum(self, root: TreeNode | None) -> int:
        def down(n):                      # best downward path from n (recomputed)
            if not n:
                return 0
            return n.val + max(0, down(n.left), down(n.right))
        best = float("-inf")
        def visit(n):
            nonlocal best
            if not n:
                return
            best = max(best, n.val + max(0, down(n.left)) + max(0, down(n.right)))
            visit(n.left); visit(n.right)
        visit(root)
        return best`, tc: "O(n²)", sc: "O(h)", bad: "`down()` is recomputed for the same subtrees again and again. One post-order pass computes each gain once." },

"serialize-and-deserialize-binary-tree": { idea: "There is no meaningful \"slower\" version: any correct encoding is O(n). The naive mistake is writing only the values (e.g. preorder without null markers). That's **ambiguous**: `[1,2]` and `[1,null,2]` would encode the same. LeetCode's level-order format with `null`s also works, but it's longer to implement.", run: false, tc: "O(n)", sc: "O(n)", bad: "Without null markers the shape of the tree is lost." },

"design-add-and-search-words-data-structure": { idea: "Keep all words in a list. For `search`, compare the pattern against **every** stored word of the same length, treating `.` as a wildcard.", code: R`
class WordDictionary:
    def __init__(self):
        self.words = []

    def addWord(self, word: str) -> None:
        self.words.append(word)

    def search(self, word: str) -> bool:
        return any(len(w) == len(word) and all(b == "." or a == b for a, b in zip(w, word))
                   for w in self.words)`, tc: "search O(N · L)", sc: "O(total chars)", bad: "Scans every word on every query. A trie only explores matching prefixes." },

"task-scheduler": { idea: "Simulate time unit by unit. At each step, **scan every task type** and run the one with the most copies left among those that have cooled down. Otherwise idle.", code: R`
from collections import Counter

class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        remaining = Counter(tasks)
        ready = {t: 0 for t in remaining}           # earliest time each task can run
        time = 0
        while remaining:
            options = [t for t in remaining if ready[t] <= time]
            if options:
                t = max(options, key=lambda x: remaining[x])
                remaining[t] -= 1
                if not remaining[t]:
                    del remaining[t]
                ready[t] = time + n + 1
            time += 1
        return time`, tc: "O(T · 26)", sc: "O(26)", bad: "The same greedy idea, but with a linear scan instead of a heap. It's acceptable here (only 26 types), and the heap or the math formula is cleaner." },

"design-twitter": { idea: "Store every tweet in one global list. For a feed, filter **all** tweets by the followed users and sort by time.", code: R`
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = []                       # (time, userId, tweetId)
        self.following = defaultdict(set)

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets.append((self.time, userId, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int) -> list[int]:
        users = self.following[userId] | {userId}
        mine = [t for t in self.tweets if t[1] in users]     # scans ALL tweets
        return [tid for _, _, tid in sorted(mine, reverse=True)[:10]]

    def follow(self, followerId: int, followeeId: int) -> None:
        if followerId != followeeId:
            self.following[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].discard(followeeId)`, tc: "feed O(T log T), T = all tweets", sc: "O(T)", bad: "Gets slower as the whole site grows. The heap-based merge only touches about 10 + F tweets." },

"subsets": { idea: "Every subset corresponds to an n-bit mask: bit i set means nums[i] is included. Loop over all 2ⁿ masks. The output itself has 2ⁿ subsets, so nothing can be asymptotically faster. This iterative version is a good alternative.", code: R`
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        n = len(nums)
        return [[nums[i] for i in range(n) if mask >> i & 1] for mask in range(1 << n)]`, run: R`
s = Solution()
print(s.subsets([1, 2, 3]))
print(s.subsets([0]))`, out: R`
[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
[[], [0]]`, tc: "O(n · 2ⁿ)", sc: "O(n · 2ⁿ) output", bad: "Same complexity. It's useful to know, but backtracking generalizes to the harder variants." },

"combination-sum": { idea: "Backtrack trying **every** candidate at every step (any order), then remove duplicate combinations by storing sorted tuples in a set.", code: R`
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        res = set()
        def bt(path, total):
            if total == target:
                res.add(tuple(sorted(path)))
                return
            if total > target:
                return
            for c in candidates:              # any order -> permutations of the same combo
                bt(path + [c], total + c)
        bt([], 0)
        return sorted(list(t) for t in res)`, tc: "far more than the optimal (explores every ordering)", sc: "O(result)", bad: "It generates [2,2,3], [2,3,2] and [3,2,2] separately and then dedupes. A start index avoids generating them at all." },

"permutations": { idea: "Generate all nⁿ sequences of length n (with repetition) and keep the ones where every element is distinct.", code: R`
from itertools import product

class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        return [list(p) for p in product(nums, repeat=len(nums)) if len(set(p)) == len(nums)]`, tc: "O(n · nⁿ)", sc: "O(n · n!)", bad: "nⁿ grows much faster than n! (n = 6: 46,656 vs 720). Backtracking with a used[] array never builds invalid sequences." },

"subsets-ii": { idea: "Generate all 2ⁿ subsets of the sorted array with bitmasks, and dedupe them with a set of tuples.", code: R`
class Solution:
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        nums = sorted(nums)
        seen = set()
        for mask in range(1 << len(nums)):
            seen.add(tuple(nums[i] for i in range(len(nums)) if mask >> i & 1))
        return [list(t) for t in sorted(seen)]`, tc: "O(n · 2ⁿ)", sc: "O(n · 2ⁿ)", bad: "It still generates every duplicate before throwing it away. The skip rule avoids creating them." },

"combination-sum-ii": { idea: "Try every subset (bitmask) of the sorted candidates, keep those whose sum equals the target, and dedupe with a set.", code: R`
class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        c = sorted(candidates)
        seen = set()
        for mask in range(1 << len(c)):
            pick = tuple(c[i] for i in range(len(c)) if mask >> i & 1)
            if sum(pick) == target:
                seen.add(pick)
        return [list(t) for t in sorted(seen)]`, tc: "O(n · 2ⁿ)", sc: "O(result)", bad: "With n = 100 that's 2^100 subsets. Backtracking prunes as soon as the sum exceeds the target." },

"word-search": { idea: "From every cell, enumerate **every** non-repeating path of length len(word), and compare the spelled string only when the path is complete. There's no early pruning on mismatched letters.", code: R`
class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        R, C, L = len(board), len(board[0]), len(word)

        def dfs(r, c, path, seen):
            path += board[r][c]
            if len(path) == L:
                return path == word              # compare only at the end
            seen.add((r, c))
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in seen and dfs(nr, nc, path, seen):
                    seen.discard((r, c))
                    return True
            seen.discard((r, c))
            return False

        return any(dfs(r, c, "", set()) for r in range(R) for c in range(C))`, tc: "O(m·n · 4 · 3^(L−1)) always", sc: "O(L)", bad: "It explores dead paths fully. Checking `board[r][c] == word[i]` at each step prunes almost everything." },

"palindrome-partitioning": { idea: "There are n−1 gaps between characters, and each can be cut or not. Try all 2^(n−1) cut patterns and keep those where every piece is a palindrome.", code: R`
class Solution:
    def partition(self, s: str) -> list[list[str]]:
        n, res = len(s), []
        for mask in range(1 << (n - 1)):              # bit i = cut after s[i]
            parts, start = [], 0
            for i in range(n - 1):
                if mask >> i & 1:
                    parts.append(s[start:i + 1]); start = i + 1
            parts.append(s[start:])
            if all(p == p[::-1] for p in parts):
                res.append(parts)
        return sorted(res)`, tc: "O(n · 2ⁿ)", sc: "O(n)", bad: "It builds full partitions even when the first piece is already not a palindrome. Backtracking prunes right away." },

"letter-combinations-of-a-phone-number": { idea: "Take the Cartesian product of the letter groups directly with `itertools.product`. The output has up to 4ⁿ strings, so no approach is faster.", code: R`
from itertools import product

class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        if not digits:
            return []
        pad = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
               "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        return ["".join(p) for p in product(*(pad[d] for d in digits))]`, tc: "O(n · 4ⁿ)", sc: "O(n · 4ⁿ)", bad: "Same complexity, but interviewers usually want to see you write the backtracking yourself." },

"n-queens": { idea: "One queen per row and per column means a placement is a **permutation** of columns. Try all n! permutations and keep those with no two queens on the same diagonal.", code: R`
from itertools import permutations

class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        res = []
        for cols in permutations(range(n)):            # cols[r] = column of the queen in row r
            if (len({r - c for r, c in enumerate(cols)}) == n and
                    len({r + c for r, c in enumerate(cols)}) == n):
                res.append(["." * c + "Q" + "." * (n - c - 1) for c in cols])
        return res`, tc: "O(n · n!)", sc: "O(n)", bad: "It only checks diagonals after the board is complete. Backtracking abandons a branch as soon as a queen is attacked." },

"number-of-islands": { idea: "Repeatedly **rescan the grid from the top** to find any remaining land cell, count it as an island, and sink it. Stop when no land is left.", code: R`
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        R, C, count = len(grid), len(grid[0]), 0

        def sink(r, c):
            if 0 <= r < R and 0 <= c < C and grid[r][c] == "1":
                grid[r][c] = "0"
                sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)

        while True:
            start = next(((r, c) for r in range(R) for c in range(C) if grid[r][c] == "1"), None)
            if not start:
                return count
            count += 1
            sink(*start)`, tc: "O((m·n) · islands)", sc: "O(m·n)", bad: "Restarting the scan for each island repeats work. A single pass over the cells is enough." },

"clone-graph": { idea: "Three passes: first discover every node, then create a copy for each (keyed by its unique value), then wire the neighbour lists.", code: R`
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

class Solution:
    def cloneGraph(self, node: "Node | None") -> "Node | None":
        if not node:
            return None
        seen, stack = {node}, [node]
        while stack:                                      # pass 1: find all nodes
            n = stack.pop()
            for nb in n.neighbors:
                if nb not in seen:
                    seen.add(nb); stack.append(nb)
        copy = {n.val: Node(n.val) for n in seen}         # pass 2: create copies
        for n in seen:                                    # pass 3: wire neighbours
            copy[n.val].neighbors = [copy[nb.val] for nb in n.neighbors]
        return copy[node.val]`, tc: "O(V + E)", sc: "O(V)", bad: "Same complexity but more passes, and it relies on values being unique. The single-pass DFS keyed by node object works in general." },

"max-area-of-island": { idea: "Start a **fresh** flood fill from every land cell (with its own visited set) and measure that island's size.", code: R`
class Solution:
    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:
        R, C, best = len(grid), len(grid[0]), 0
        for r in range(R):
            for c in range(C):
                if grid[r][c] == 1:
                    seen, stack = {(r, c)}, [(r, c)]
                    while stack:
                        x, y = stack.pop()
                        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                            if 0 <= nx < R and 0 <= ny < C and grid[nx][ny] == 1 and (nx, ny) not in seen:
                                seen.add((nx, ny)); stack.append((nx, ny))
                    best = max(best, len(seen))
        return best`, tc: "O((m·n)²)", sc: "O(m·n)", bad: "An island of size k is explored k times. Sinking cells as you go visits each one once." },

"surrounded-regions": { idea: "For every 'O' cell, explore its whole region and check whether any cell touches the border. If none does, flip the region.", code: R`
class Solution:
    def solve(self, board: list[list[str]]) -> None:
        R, C = len(board), len(board[0])
        for r in range(R):
            for c in range(C):
                if board[r][c] != "O":
                    continue
                region, stack, border = {(r, c)}, [(r, c)], False
                while stack:
                    x, y = stack.pop()
                    if x in (0, R - 1) or y in (0, C - 1):
                        border = True
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        if 0 <= nx < R and 0 <= ny < C and board[nx][ny] == "O" and (nx, ny) not in region:
                            region.add((nx, ny)); stack.append((nx, ny))
                if not border:
                    for x, y in region:
                        board[x][y] = "X"`, tc: "O((m·n)²)", sc: "O(m·n)", bad: "Border-touching regions get re-explored from each of their cells. Marking the safe cells from the border once is linear." },

"rotting-oranges": { idea: "Simulate minute by minute: scan the **whole grid** to find fresh oranges next to a rotten one, rot them all at once, and repeat until nothing changes.", code: R`
class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        R, C, minutes = len(grid), len(grid[0]), 0
        while True:
            to_rot = [(r, c) for r in range(R) for c in range(C) if grid[r][c] == 1 and any(
                0 <= r + dr < R and 0 <= c + dc < C and grid[r + dr][c + dc] == 2
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
            if not to_rot:
                return -1 if any(1 in row for row in grid) else minutes
            for r, c in to_rot:
                grid[r][c] = 2
            minutes += 1`, tc: "O((m·n)²)", sc: "O(m·n)", bad: "Each minute rescans every cell. Multi-source BFS only touches the newly rotten frontier." },

"walls-and-gates": { idea: "Run a separate BFS from **each gate**, and keep the minimum distance written into every room.", code: R`
from collections import deque

class Solution:
    def wallsAndGates(self, rooms: list[list[int]]) -> None:
        R, C = len(rooms), len(rooms[0])
        gates = [(r, c) for r in range(R) for c in range(C) if rooms[r][c] == 0]
        for gr, gc in gates:
            dist, q = {(gr, gc): 0}, deque([(gr, gc)])
            while q:
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < R and 0 <= nc < C and rooms[nr][nc] > 0 and (nr, nc) not in dist:
                        dist[(nr, nc)] = dist[(r, c)] + 1
                        rooms[nr][nc] = min(rooms[nr][nc], dist[(nr, nc)])
                        q.append((nr, nc))`, tc: "O(G · m·n)", sc: "O(m·n)", bad: "One BFS per gate. Seeding the queue with all gates at once does the job in one BFS." },

"course-schedule": { idea: "Repeatedly look for courses whose prerequisites are all taken, **rescanning the whole prerequisite list** each round. If a round finds nothing new, stop.", code: R`
class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        taken = set()
        while True:
            ready = [c for c in range(numCourses) if c not in taken and
                     all(b in taken for a, b in prerequisites if a == c)]
            if not ready:
                return len(taken) == numCourses
            taken.update(ready)`, tc: "O(V² · E) worst", sc: "O(V)", bad: "Rescans everything every round. In-degree counting (Kahn) touches each edge once." },

"course-schedule-ii": { idea: "Same round-based scan as above, but record the courses in the order they become available.", code: R`
class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        order, taken = [], set()
        while len(order) < numCourses:
            ready = [c for c in range(numCourses) if c not in taken and
                     all(b in taken for a, b in prerequisites if a == c)]
            if not ready:
                return []                      # cycle: nothing can ever be taken
            order += ready
            taken.update(ready)
        return order`, tc: "O(V² · E) worst", sc: "O(V)", bad: "Same inefficiency. Kahn's queue gives O(V + E)." },

"redundant-connection": { idea: "Try removing edges from the last one backwards. After each removal, DFS to check whether the remaining n−1 edges still connect all n nodes (then it's a tree).", code: R`
class Solution:
    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:
        n = len(edges)
        def connected_without(skip):
            adj = {i: [] for i in range(1, n + 1)}
            for i, (a, b) in enumerate(edges):
                if i != skip:
                    adj[a].append(b); adj[b].append(a)
            seen, stack = {1}, [1]
            while stack:
                for v in adj[stack.pop()]:
                    if v not in seen:
                        seen.add(v); stack.append(v)
            return len(seen) == n
        for i in range(n - 1, -1, -1):
            if connected_without(i):
                return edges[i]
        return []`, tc: "O(n²)", sc: "O(n)", bad: "Rebuilds and traverses the graph for every candidate edge. Union-Find detects the cycle-closing edge in a single pass." },

"number-of-connected-components-in-an-undirected-graph": { idea: "Build an adjacency list and count how many times you must start a new DFS from an unvisited node.", code: R`
class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        adj = [[] for _ in range(n)]
        for a, b in edges:
            adj[a].append(b); adj[b].append(a)
        seen, count = set(), 0
        for s in range(n):
            if s in seen:
                continue
            count += 1
            seen.add(s); stack = [s]
            while stack:
                for v in adj[stack.pop()]:
                    if v not in seen:
                        seen.add(v); stack.append(v)
        return count`, tc: "O(V + E)", sc: "O(V + E)", bad: "Equally fast and perfectly valid! Union-Find shines when edges arrive over time (dynamic connectivity)." },

"graph-valid-tree": { idea: "DFS from node 0 carrying the parent. Seeing an already-visited node (other than the parent) means a cycle. Afterwards, check that all n nodes were reached.", code: R`
class Solution:
    def validTree(self, n: int, edges: list[list[int]]) -> bool:
        adj = [[] for _ in range(n)]
        for a, b in edges:
            adj[a].append(b); adj[b].append(a)
        seen = set()
        def has_cycle(u, parent):
            seen.add(u)
            for v in adj[u]:
                if v == parent:
                    continue
                if v in seen or has_cycle(v, u):
                    return True
            return False
        return not has_cycle(0, -1) and len(seen) == n`, tc: "O(V + E)", sc: "O(V + E)", bad: "Also optimal. The edge-count + Union-Find version is shorter and avoids deep recursion." },

"word-ladder": { idea: "BFS over words, but find each word's neighbours by **comparing it with every word** in the list.", code: R`
from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        def one_apart(a, b):
            return sum(x != y for x, y in zip(a, b)) == 1
        q, seen = deque([(beginWord, 1)]), {beginWord}
        while q:
            w, d = q.popleft()
            if w == endWord:
                return d
            for nb in wordList:                     # compare with EVERY word
                if nb not in seen and one_apart(w, nb):
                    seen.add(nb); q.append((nb, d + 1))
        return 0`, tc: "O(N² · L)", sc: "O(N)", bad: "With 5000 words that's 25 million comparisons. Wildcard buckets find the neighbours directly." },

"min-cost-to-connect-all-points": { idea: "**Kruskal:** build all n² edges, sort them by cost, and add each edge that connects two different components (Union-Find).", code: R`
class Solution:
    def minCostConnectPoints(self, points: list[list[int]]) -> int:
        n = len(points)
        edges = sorted((abs(x1 - x2) + abs(y1 - y2), i, j)
                       for i, (x1, y1) in enumerate(points)
                       for j, (x2, y2) in enumerate(points) if i < j)
        parent = list(range(n))
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]; x = parent[x]
            return x
        total = used = 0
        for w, i, j in edges:
            ri, rj = find(i), find(j)
            if ri != rj:
                parent[rj] = ri
                total += w; used += 1
                if used == n - 1:
                    break
        return total`, tc: "O(n² log n)", sc: "O(n²)", bad: "Correct and a common answer. It just materializes and sorts all n² edges. Prim's algorithm grows lazily." },

"network-delay-time": { idea: "**Bellman-Ford:** relax every edge n−1 times. It works with any edge weights.", code: R`
class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        dist = [float("inf")] * (n + 1)
        dist[k] = 0
        for _ in range(n - 1):
            for u, v, w in times:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
        best = max(dist[1:])
        return best if best < float("inf") else -1`, tc: "O(V · E)", sc: "O(V)", bad: "It relaxes edges blindly. With non-negative weights, Dijkstra finalizes each node once." },

"swim-in-rising-water": { idea: "Try t = 0, 1, 2, … in order. For each t, check with DFS whether (n−1, n−1) is reachable using only cells ≤ t. The first t that works is the answer.", code: R`
class Solution:
    def swimInWater(self, grid: list[list[int]]) -> int:
        n = len(grid)
        def can(t):
            if grid[0][0] > t:
                return False
            seen, stack = {(0, 0)}, [(0, 0)]
            while stack:
                r, c = stack.pop()
                if (r, c) == (n - 1, n - 1):
                    return True
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] <= t:
                        seen.add((nr, nc)); stack.append((nr, nc))
            return False
        t = 0
        while not can(t):
            t += 1
        return t`, tc: "O(n⁴)", sc: "O(n²)", bad: "Up to n² values of t, each needing an O(n²) search. Binary search on t gives O(n² log n), and the optimal Dijkstra is also O(n² log n)." },

"alien-dictionary": { idea: "Try **every possible ordering** of the letters, and return the first one under which the word list is sorted.", code: R`
from itertools import permutations

class Solution:
    def alienOrder(self, words: list[str]) -> str:
        letters = sorted({c for w in words for c in w})
        for perm in permutations(letters):
            rank = {c: i for i, c in enumerate(perm)}
            keys = [[rank[c] for c in w] for w in words]
            if all(keys[i] <= keys[i + 1] for i in range(len(keys) - 1)):
                return "".join(perm)
        return ""`, tc: "O(k! · C) for k letters", sc: "O(C)", bad: "With 26 letters that's 26! orderings, which is impossible. A topological sort derives the order directly." },

"cheapest-flights-within-k-stops": { idea: "DFS over **every route** that uses at most k+1 flights, and keep the cheapest one that reaches the destination.", code: R`
class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
        adj = {i: [] for i in range(n)}
        for u, v, p in flights:
            adj[u].append((v, p))
        best = float("inf")
        def dfs(u, cost, used):
            nonlocal best
            if u == dst:
                best = min(best, cost)
                return
            if used > k:                 # already used k+1 flights
                return
            for v, p in adj[u]:
                dfs(v, cost + p, used + 1)
        dfs(src, 0, 0)
        return -1 if best == float("inf") else best`, tc: "O(d^(k+1)), exponential", sc: "O(k)", bad: "The number of routes explodes. Bellman-Ford with k+1 rounds is O(k · E)." },

"min-cost-climbing-stairs": { idea: "Plain recursion: from step i, pay cost[i] and move 1 or 2 steps. Take the cheaper of the two starts.", code: R`
class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        def best(i):                         # min cost to reach the top from step i
            if i >= len(cost):
                return 0
            return cost[i] + min(best(i + 1), best(i + 2))
        return min(best(0), best(1))`, tc: "O(2ⁿ)", sc: "O(n)", bad: "The same subproblems are recomputed exponentially many times. Memoize, or go bottom-up." },

"house-robber-ii": { idea: "Try **every subset** of houses (bitmask). Skip subsets with adjacent houses, or with both the first and the last house.", code: R`
class Solution:
    def rob(self, nums: list[int]) -> int:
        n, best = len(nums), 0
        for mask in range(1 << n):
            if mask & (mask << 1):
                continue                                     # two adjacent houses
            if n > 1 and mask & 1 and mask >> (n - 1) & 1:
                continue                                     # first + last (circle)
            best = max(best, sum(nums[i] for i in range(n) if mask >> i & 1))
        return best`, tc: "O(n · 2ⁿ)", sc: "O(1)", bad: "n = 100 is impossible. Two linear DP passes take O(n)." },

"palindromic-substrings": { idea: "Check **every substring** by reversing it.", code: R`
class Solution:
    def countSubstrings(self, s: str) -> int:
        return sum(s[i:j] == s[i:j][::-1] for i in range(len(s)) for j in range(i + 1, len(s) + 1))`, tc: "O(n³)", sc: "O(n)", bad: "O(n²) substrings × O(n) check each. Expanding around centers reuses the work." },

"decode-ways": { idea: "Plain recursion: at position i, decode one digit (if it isn't '0') and/or two digits (if they form 10–26).", code: R`
class Solution:
    def numDecodings(self, s: str) -> int:
        def ways(i):
            if i == len(s):
                return 1
            if s[i] == "0":
                return 0
            res = ways(i + 1)
            if i + 1 < len(s) and int(s[i:i + 2]) <= 26:
                res += ways(i + 2)
            return res
        return ways(0)`, tc: "O(2ⁿ)", sc: "O(n)", bad: "Exponential for strings like \"1111…\". Memoizing gives O(n)." },

"maximum-product-subarray": { idea: "Try every start i and extend j to the right, keeping a running product.", code: R`
class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        best = nums[0]
        for i in range(len(nums)):
            p = 1
            for j in range(i, len(nums)):
                p *= nums[j]
                best = max(best, p)
        return best`, tc: "O(n²)", sc: "O(1)", bad: "n = 2·10^4 → 2·10^8 multiplications. Tracking the max and min products gives O(n)." },

"word-break": { idea: "Plain recursion: try every prefix that is a dictionary word and recurse on the rest.", code: R`
class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        words = set(wordDict)
        def can(i):
            if i == len(s):
                return True
            return any(s[i:j] in words and can(j) for j in range(i + 1, len(s) + 1))
        return can(0)`, tc: "O(2ⁿ)", sc: "O(n)", bad: "Inputs like \"aaaa…ab\" with words [\"a\",\"aa\",\"aaa\"] explode. The DP over prefixes is O(n²)." },

"unique-paths": { idea: "Plain recursion: paths(r, c) = paths(r+1, c) + paths(r, c+1).", code: R`
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        def paths(r, c):
            if r == m - 1 or c == n - 1:
                return 1
            return paths(r + 1, c) + paths(r, c + 1)
        return paths(0, 0)`, tc: "O(2^(m+n))", sc: "O(m + n)", bad: "A 100×100 grid is hopeless. The grid DP is O(m·n), and the math formula is O(min(m, n))." },

"longest-common-subsequence": { idea: "Plain recursion on two indices: if the characters match, take 1 + both advanced. Otherwise take the max of skipping either one.", code: R`
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        def lcs(i, j):
            if i == len(text1) or j == len(text2):
                return 0
            if text1[i] == text2[j]:
                return 1 + lcs(i + 1, j + 1)
            return max(lcs(i + 1, j), lcs(i, j + 1))
        return lcs(0, 0)`, tc: "O(2^(m+n))", sc: "O(m + n)", bad: "There are only m·n distinct (i, j) states. The table (or memoization) computes each once." },

"best-time-to-buy-and-sell-stock-with-cooldown": { idea: "Recursion over (day, holding?). If holding: sell (then skip a day for the cooldown) or wait. If not: buy or wait.", code: R`
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        def go(i, holding):
            if i >= len(prices):
                return 0
            skip = go(i + 1, holding)
            if holding:
                return max(skip, prices[i] + go(i + 2, False))   # sell, then cooldown
            return max(skip, -prices[i] + go(i + 1, True))       # buy
        return go(0, False)`, tc: "O(2ⁿ)", sc: "O(n)", bad: "There are only 2n states. Memoize them, or use the three running variables." },

"coin-change-ii": { idea: "Recursion over (coin index, remaining amount): either use coin i again, or move on to the next coin.", code: R`
class Solution:
    def change(self, amount: int, coins: list[int]) -> int:
        def ways(i, remain):
            if remain == 0:
                return 1
            if i == len(coins) or remain < 0:
                return 0
            return ways(i, remain - coins[i]) + ways(i + 1, remain)
        return ways(0, amount)`, tc: "exponential", sc: "O(amount)", bad: "The same (i, remain) pairs repeat. The 1-D DP is O(amount · coins)." },

"interleaving-string": { idea: "Recursion on (i, j): the next character of s3 comes from s1 or from s2. Try both.", code: R`
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False
        def go(i, j):
            if i == len(s1) and j == len(s2):
                return True
            k = i + j
            return ((i < len(s1) and s1[i] == s3[k] and go(i + 1, j)) or
                    (j < len(s2) and s2[j] == s3[k] and go(i, j + 1)))
        return go(0, 0)`, tc: "O(2^(m+n))", sc: "O(m + n)", bad: "Exponential when both strings share many characters. There are only m·n states." },

"longest-increasing-path-in-a-matrix": { idea: "DFS from every cell along strictly increasing neighbours, **without memoization**.", code: R`
class Solution:
    def longestIncreasingPath(self, matrix: list[list[int]]) -> int:
        R, C = len(matrix), len(matrix[0])
        def dfs(r, c):
            best = 1
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < R and 0 <= nc < C and matrix[nr][nc] > matrix[r][c]:
                    best = max(best, 1 + dfs(nr, nc))
            return best
        return max(dfs(r, c) for r in range(R) for c in range(C))`, tc: "exponential in the worst case", sc: "O(m·n)", bad: "The same cell's answer is recomputed from every path that reaches it. Caching makes it O(m·n)." },

"distinct-subsequences": { idea: "Recursion on (i, j): skip s[i], and if s[i] == t[j], also try using it.", code: R`
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        def go(i, j):
            if j == len(t):
                return 1
            if i == len(s):
                return 0
            res = go(i + 1, j)
            if s[i] == t[j]:
                res += go(i + 1, j + 1)
            return res
        return go(0, 0)`, tc: "O(2ⁿ)", sc: "O(n)", bad: "Only m·n distinct states. The DP table removes the repetition." },

"edit-distance": { idea: "Recursion on (i, j): matching characters cost nothing. Otherwise try insert, delete and replace, and take 1 + the minimum.", code: R`
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        def go(i, j):
            if i == len(word1):
                return len(word2) - j
            if j == len(word2):
                return len(word1) - i
            if word1[i] == word2[j]:
                return go(i + 1, j + 1)
            return 1 + min(go(i + 1, j), go(i, j + 1), go(i + 1, j + 1))
        return go(0, 0)`, run: R`
s = Solution()
print(s.minDistance("horse", "ros"))     # bigger inputs take far too long!
print(s.minDistance("", "abc"))`, out: R`
3
3`, tc: "O(3^(m+n))", sc: "O(m + n)", bad: "Even \"intention\" → \"execution\" (9 letters each) takes noticeably long. The table makes it O(m·n)." },

"burst-balloons": { idea: "Try **every order** of bursting: pick any balloon first, add its coins, and recurse on the remaining list.", code: R`
class Solution:
    def maxCoins(self, nums: list[int]) -> int:
        def go(arr):
            if not arr:
                return 0
            best = 0
            for i in range(len(arr)):                    # burst balloon i first
                left = arr[i - 1] if i > 0 else 1
                right = arr[i + 1] if i + 1 < len(arr) else 1
                best = max(best, left * arr[i] * right + go(arr[:i] + arr[i + 1:]))
            return best
        return go(nums)`, tc: "O(n!)", sc: "O(n²)", bad: "300! orderings is impossible. Interval DP choosing the LAST balloon is O(n³)." },

"regular-expression-matching": { idea: "The same recursion as the optimal solution, but **without memoization**.", code: R`
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        def go(i, j):
            if j == len(p):
                return i == len(s)
            first = i < len(s) and p[j] in (s[i], ".")
            if j + 1 < len(p) and p[j + 1] == "*":
                return go(i, j + 2) or (first and go(i + 1, j))
            return first and go(i + 1, j + 1)
        return go(0, 0)`, tc: "exponential (e.g. many `a*` groups)", sc: "O(m + n)", bad: "Patterns like `a*a*a*a*b` against `aaaaaaaa` blow up. `@cache` makes it O(m·n)." },

"jump-game-ii": { idea: "DP: `dp[j]` = the fewest jumps to reach j. From every i, relax every index it can jump to.", code: R`
class Solution:
    def jump(self, nums: list[int]) -> int:
        n = len(nums)
        dp = [0] + [float("inf")] * (n - 1)
        for i in range(n):
            for j in range(i + 1, min(n, i + nums[i] + 1)):
                dp[j] = min(dp[j], dp[i] + 1)
        return dp[-1]`, tc: "O(n · max jump), O(n²) worst", sc: "O(n)", bad: "The greedy BFS-by-windows approach gets O(n)." },

"hand-of-straights": { idea: "Sort the cards. Repeatedly take the smallest remaining card and remove start, start+1, … from the **list** one by one.", code: R`
class Solution:
    def isNStraightHand(self, hand: list[int], groupSize: int) -> bool:
        cards = sorted(hand)
        while cards:
            start = cards[0]
            for v in range(start, start + groupSize):
                if v not in cards:          # O(n) search
                    return False
                cards.remove(v)             # O(n) removal
        return True`, tc: "O(n²)", sc: "O(n)", bad: "List search and remove are O(n). A Counter makes each step O(1)." },

"merge-triplets-to-form-target-triplet": { idea: "Try **every subset** of triplets, merge them with element-wise max, and check whether the result equals the target.", code: R`
class Solution:
    def mergeTriplets(self, triplets: list[list[int]], target: list[int]) -> bool:
        n = len(triplets)
        for mask in range(1, 1 << n):
            merged = [0, 0, 0]
            for i in range(n):
                if mask >> i & 1:
                    merged = [max(a, b) for a, b in zip(merged, triplets[i])]
            if merged == target:
                return True
        return False`, tc: "O(n · 2ⁿ)", sc: "O(1)", bad: "n = 10^5 is impossible. Filtering out the triplets that overshoot gives O(n)." },

"partition-labels": { idea: "At each index, test whether cutting here is legal: no letter may appear both before and after the cut. Compare the letter sets of the two sides.", code: R`
class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        res, start = [], 0
        for i in range(len(s)):
            if not set(s[start:i + 1]) & set(s[i + 1:]):     # no letter crosses this cut
                res.append(i + 1 - start)
                start = i + 1
        return res`, tc: "O(n²)", sc: "O(n)", bad: "It rebuilds two sets at every position. Precomputing each letter's last index gives O(n)." },

"insert-interval": { idea: "Append the new interval, sort everything, and run the standard merge.", code: R`
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        res = []
        for s, e in sorted(intervals + [newInterval]):
            if res and s <= res[-1][1]:
                res[-1][1] = max(res[-1][1], e)
            else:
                res.append([s, e])
        return res`, tc: "O(n log n)", sc: "O(n)", bad: "Re-sorts already sorted data. A single linear pass is enough." },

"merge-intervals": { idea: "Without sorting: repeatedly find **any** overlapping pair, merge it, and restart. Stop when no pair overlaps.", code: R`
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        ivs = [iv[:] for iv in intervals]
        merged = True
        while merged:
            merged = False
            for i in range(len(ivs)):
                for j in range(i + 1, len(ivs)):
                    a, b = ivs[i], ivs[j]
                    if a[0] <= b[1] and b[0] <= a[1]:          # overlap
                        ivs[i] = [min(a[0], b[0]), max(a[1], b[1])]
                        ivs.pop(j)
                        merged = True
                        break
                if merged:
                    break
        return sorted(ivs)`, tc: "O(n³)", sc: "O(n)", bad: "Sorting by start means only the last merged interval can overlap, giving O(n log n)." },

"non-overlapping-intervals": { idea: "Try **every subset** of intervals to keep, check that it's non-overlapping, and maximize its size. The answer is n − best.", code: R`
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        n, best = len(intervals), 0
        for mask in range(1 << n):
            kept = sorted(intervals[i] for i in range(n) if mask >> i & 1)
            if all(kept[k][1] <= kept[k + 1][0] for k in range(len(kept) - 1)):
                best = max(best, len(kept))
        return n - best`, tc: "O(2ⁿ · n log n)", sc: "O(n)", bad: "Exponential. The greedy \"keep the earliest end\" rule is provably optimal and O(n log n)." },

"meeting-rooms": { idea: "Compare **every pair** of meetings for an overlap.", code: R`
class Solution:
    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
        for i in range(len(intervals)):
            for j in range(i + 1, len(intervals)):
                a, b = intervals[i], intervals[j]
                if a[0] < b[1] and b[0] < a[1]:
                    return False
        return True`, tc: "O(n²)", sc: "O(1)", bad: "After sorting, only neighbours can overlap." },

"meeting-rooms-ii": { idea: "The maximum overlap always happens at some meeting's start time. For each start time, count the meetings in progress.", code: R`
class Solution:
    def minMeetingRooms(self, intervals: list[list[int]]) -> int:
        best = 0
        for s, _ in intervals:
            best = max(best, sum(a <= s < b for a, b in intervals))
        return best`, tc: "O(n²)", sc: "O(1)", bad: "Counting from scratch for each start. A heap of end times (or a sweep line) gives O(n log n)." },

"minimum-interval-to-include-each-query": { idea: "For each query, scan **all intervals**, keep the ones containing it, and take the smallest size.", code: R`
class Solution:
    def minInterval(self, intervals: list[list[int]], queries: list[int]) -> list[int]:
        res = []
        for q in queries:
            sizes = [r - l + 1 for l, r in intervals if l <= q <= r]
            res.append(min(sizes) if sizes else -1)
        return res`, tc: "O(n · q)", sc: "O(1) extra", bad: "10^5 × 10^5 = 10^10. Sorting the queries plus a heap gives O((n + q) log n)." },

"rotate-image": { idea: "Build a **new** rotated matrix (`new[r][c] = old[n−1−c][r]`) and copy it back.", code: R`
class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        n = len(matrix)
        rotated = [[matrix[n - 1 - c][r] for c in range(n)] for r in range(n)]
        for r in range(n):
            matrix[r][:] = rotated[r]`, tc: "O(n²)", sc: "O(n²)", bad: "The problem demands in place (O(1) extra). Transpose + reverse does it." },

"spiral-matrix": { idea: "Walk the matrix with a direction vector and a `visited` grid, turning right whenever the next cell is out of bounds or already visited.", code: R`
class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        R, C = len(matrix), len(matrix[0])
        seen = [[False] * C for _ in range(R)]
        dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        r = c = d = 0
        res = []
        for _ in range(R * C):
            res.append(matrix[r][c]); seen[r][c] = True
            nr, nc = r + dirs[d][0], c + dirs[d][1]
            if not (0 <= nr < R and 0 <= nc < C) or seen[nr][nc]:
                d = (d + 1) % 4                       # turn right
                nr, nc = r + dirs[d][0], c + dirs[d][1]
            r, c = nr, nc
        return res`, tc: "O(m·n)", sc: "O(m·n)", bad: "Same time, but the visited grid costs O(m·n) extra memory. Shrinking boundaries need O(1)." },

"happy-number": { idea: "Just iterate up to a fixed number of steps (say 1000) and hope a cycle shows up within that.", code: R`
class Solution:
    def isHappy(self, n: int) -> bool:
        for _ in range(1000):                   # arbitrary cap
            if n == 1:
                return True
            n = sum(int(d) ** 2 for d in str(n))
        return False`, tc: "O(cap · log n)", sc: "O(1)", bad: "Correctness depends on a magic number. Proper cycle detection (a set, or Floyd) is rigorous." },

"plus-one": { idea: "Join the digits into an integer, add 1, and split it back into digits.", code: R`
class Solution:
    def plusOne(self, digits: list[int]) -> list[int]:
        return [int(d) for d in str(int("".join(map(str, digits))) + 1)]`, tc: "O(n)", sc: "O(n)", bad: "Works only thanks to Python's big ints, and it skips the carry logic the question is testing." },

"multiply-strings": { idea: "Implement string **addition** only, and add num1 to itself num2 times (repeated addition).", code: R`
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        def add(a, b):
            res, carry, i, j = [], 0, len(a) - 1, len(b) - 1
            while i >= 0 or j >= 0 or carry:
                carry += (ord(a[i]) - 48 if i >= 0 else 0) + (ord(b[j]) - 48 if j >= 0 else 0)
                res.append(chr(48 + carry % 10))
                carry //= 10; i -= 1; j -= 1
            return "".join(reversed(res))
        times = 0
        for ch in num2:
            times = times * 10 + (ord(ch) - 48)
        total = "0"
        for _ in range(times):                    # add num1, num2 times
            total = add(total, num1)
        return total`, tc: "O(value(num2) · n)", sc: "O(m + n)", bad: "num2 can have 200 digits, which means about 10^200 additions. Digit-by-digit multiplication is O(m·n)." },

"detect-squares": { idea: "Store the points in a plain **list**. For each diagonal candidate, count the other two corners by scanning the list.", code: R`
class DetectSquares:
    def __init__(self):
        self.pts = []

    def add(self, point: list[int]) -> None:
        self.pts.append(tuple(point))

    def count(self, point: list[int]) -> int:
        qx, qy = point
        res = 0
        for x, y in self.pts:                          # every stored point as the diagonal
            if abs(x - qx) != abs(y - qy) or x == qx:
                continue
            res += self.pts.count((qx, y)) * self.pts.count((x, qy))   # O(P) scans
        return res`, tc: "count O(P²)", sc: "O(P)", bad: "A Counter (hash map) makes each corner lookup O(1)." },

"counting-bits": { idea: "Count the 1s of every number independently, e.g. with `bin(i).count('1')`.", code: R`
class Solution:
    def countBits(self, n: int) -> list[int]:
        return [bin(i).count("1") for i in range(n + 1)]`, tc: "O(n log n)", sc: "O(n)", bad: "The follow-up asks for O(n) without built-ins. Reuse `bits[i >> 1]`." },

"reverse-bits": { idea: "Format the number as a 32-character binary string, reverse it, and parse it back.", code: R`
class Solution:
    def reverseBits(self, n: int) -> int:
        return int(format(n, "032b")[::-1], 2)`, tc: "O(32)", sc: "O(32)", bad: "Correct and fine in Python, but it avoids the bit manipulation being tested." },

"missing-number": { idea: "Put everything in a set and check 0..n one by one (or sort and scan).", code: R`
class Solution:
    def missingNumber(self, nums: list[int]) -> int:
        s = set(nums)
        for x in range(len(nums) + 1):
            if x not in s:
                return x`, tc: "O(n)", sc: "O(n)", bad: "The follow-up wants O(1) extra space: XOR or the sum formula." },

"sum-of-two-integers": { idea: "There's no slower \"legal\" version, because `+` and `-` are forbidden. The only alternative is simulating addition, which is the bitwise solution itself. (Calling `sum([a, b])` just hides a `+`, so it doesn't count.)", run: false, tc: "—", sc: "—", bad: "The XOR (sum bits) + AND-shift (carry) loop is the intended solution." },

"reverse-integer": { idea: "Convert to a string, reverse it, convert back, then check the range.", code: R`
class Solution:
    def reverse(self, x: int) -> int:
        r = int(str(abs(x))[::-1]) * (1 if x >= 0 else -1)
        return r if -2**31 <= r <= 2**31 - 1 else 0`, tc: "O(log x)", sc: "O(log x)", bad: "It builds a value that can exceed 32 bits before checking, which the problem says you can't do. The optimal version checks before each push." },
  };
  NC.forEach((p) => { if (!p.brute && B[p.id]) p.brute = B[p.id]; });
})();
