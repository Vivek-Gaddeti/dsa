NC.add("Trees", [
{
  id: "invert-binary-tree", t: "Invert Binary Tree", lc: 226, d: "Easy", p: "Tree DFS (recursion)", h: "tree",
  q: "Given the `root` of a binary tree, **invert** it (mirror it left ↔ right) and return the root.",
  ex: [["root = [4,2,7,1,3,6,9]", "[4,7,2,9,6,3,1]", ""], ["root = [2,1,3]", "[2,3,1]", ""], ["root = []", "[]", ""]],
  c: ["0 ≤ nodes ≤ 100"],
  hint: "Mirroring a tree = swap the two children of every node. Do it recursively.",
  opt: {
    idea: "For each node: swap its left and right children, then invert both subtrees. The base case is an empty tree.",
    steps: ["if not root: return None", "root.left, root.right = root.right, root.left", "invert(root.left); invert(root.right)", "return root"],
    code: R`
class Solution:
    def invertTree(self, root: TreeNode | None) -> TreeNode | None:
        if not root:
            return None
        root.left, root.right = root.right, root.left   # swap children
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root`,
    tc: "O(n)", sc: "O(h)", sw: "Recursion depth = tree height (O(n) worst case for a skewed tree, O(log n) if balanced).",
  },
  run: R`
s = Solution()
print(tree_to_list(s.invertTree(build_tree([4, 2, 7, 1, 3, 6, 9]))))
print(tree_to_list(s.invertTree(build_tree([2, 1, 3]))))
print(tree_to_list(s.invertTree(build_tree([]))))`,
  out: R`
[4, 7, 2, 9, 6, 3, 1]
[2, 3, 1]
[]`,
  dry: ["At 4: swap (2, 7) → (7, 2)", "At 7 (now left): swap (6, 9) → (9, 6)", "At 2 (now right): swap (1, 3) → (3, 1)"],
  expl: [["root.left, root.right = root.right, root.left", "Python's tuple swap, with no temp variable needed."]],
  alt: { idea: "Iterative BFS: pop a node, swap its children, push the children.", code: R`
from collections import deque
class Solution:
    def invertTree(self, root):
        q = deque([root])
        while q:
            node = q.popleft()
            if node:
                node.left, node.right = node.right, node.left
                q.extend([node.left, node.right])
        return root` },
  take: "**Most tree problems = do something at the node + recurse on children.** Always handle `None` first.",
  mist: ["Recursing before swapping is also fine. Just don't swap twice."],
},
{
  id: "maximum-depth-of-binary-tree", t: "Maximum Depth of Binary Tree", lc: 104, d: "Easy", p: "Tree DFS / BFS", h: "tree",
  q: "Return the **maximum depth** of a binary tree: the number of nodes on the longest path from the root down to a leaf.",
  ex: [["root = [3,9,20,null,null,15,7]", "3", "3 → 20 → 15"], ["root = [1,null,2]", "2", ""]],
  c: ["0 ≤ nodes ≤ 10^4"],
  hint: "depth(node) = 1 + max(depth(left), depth(right)).",
  opt: {
    idea: "Post-order recursion. An empty tree has depth 0, and otherwise the depth is 1 + the deeper subtree.",
    steps: ["if not root: return 0", "return 1 + max(depth(left), depth(right))"],
    code: R`
class Solution:
    def maxDepth(self, root: TreeNode | None) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
    tc: "O(n)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.maxDepth(build_tree([3, 9, 20, None, None, 15, 7])))
print(s.maxDepth(build_tree([1, None, 2])))
print(s.maxDepth(build_tree([])))`,
  out: R`
3
2
0`,
  dry: ["depth(9) = 1 + max(0, 0) = 1", "depth(15) = depth(7) = 1 → depth(20) = 2", "depth(3) = 1 + max(1, 2) = 3"],
  expl: [["return 1 + max(...)", "Count the current node plus the longer of the two branches."]],
  alt: { idea: "BFS level counting: the number of levels = the depth.", code: R`
from collections import deque
class Solution:
    def maxDepth(self, root):
        if not root:
            return 0
        q, depth = deque([root]), 0
        while q:
            depth += 1
            for _ in range(len(q)):
                node = q.popleft()
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
        return depth` },
  take: "**A tree property that combines children's answers → post-order DFS returning a value.**",
  mist: ["Returning 1 for an empty tree."],
},
{
  id: "diameter-of-binary-tree", t: "Diameter of Binary Tree", lc: 543, d: "Easy", p: "Tree DFS (height + global answer)", h: "tree",
  q: "Return the **diameter** of a binary tree: the number of **edges** on the longest path between any two nodes. The path may or may not pass through the root.",
  ex: [["root = [1,2,3,4,5]", "3", "Path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3)."], ["root = [1,2]", "1", ""]],
  c: ["1 ≤ nodes ≤ 10^4"],
  hint: "The longest path through a node = height(left) + height(right). Compute heights bottom-up and track the best sum.",
  brute: {
    idea: "For every node, compute the left and right heights from scratch.",
    code: R`
class Solution:
    def diameterOfBinaryTree(self, root: TreeNode | None) -> int:
        def height(n):
            return 0 if not n else 1 + max(height(n.left), height(n.right))
        if not root:
            return 0
        through = height(root.left) + height(root.right)
        return max(through, self.diameterOfBinaryTree(root.left), self.diameterOfBinaryTree(root.right))`,
    tc: "O(n²)", sc: "O(h)", bad: "Heights are recomputed many times.",
  },
  opt: {
    idea: "A single DFS returns each node's **height** (in nodes). At each node, `left_h + right_h` is the number of edges on the longest path that bends at this node, so update a global `best` with it. Return `1 + max(left_h, right_h)` to the parent.",
    steps: ["best = 0", "dfs(node): if None → 0", "l = dfs(left); r = dfs(right); best = max(best, l + r)", "return 1 + max(l, r)"],
    code: R`
class Solution:
    def diameterOfBinaryTree(self, root: TreeNode | None) -> int:
        best = 0

        def height(node):
            nonlocal best
            if not node:
                return 0
            l, r = height(node.left), height(node.right)
            best = max(best, l + r)          # longest path bending at this node
            return 1 + max(l, r)

        height(root)
        return best`,
    tc: "O(n)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.diameterOfBinaryTree(build_tree([1, 2, 3, 4, 5])))
print(s.diameterOfBinaryTree(build_tree([1, 2])))`,
  out: R`
3
1`,
  dryOn: "[1,2,3,4,5]",
  dry: { h: ["node", "l", "r", "l + r", "returns height"], r: [[4, 0, 0, 0, 1], [5, 0, 0, 0, 1], [2, 1, 1, 2, 2], [3, 0, 0, 0, 1], [1, 2, 1, "**3**", 3]] },
  expl: [
    ["nonlocal best", "Lets the inner function update the variable from the outer scope (an alternative is `self.best`)."],
    ["best = max(best, l + r)", "Heights in nodes from the children = edges from this node down each side."],
  ],
  take: "**The DFS returns one thing (height) but updates another (global best).** This pattern repeats in Max Path Sum and Longest Univalue Path.",
  mist: ["Returning the diameter instead of the height from the helper.", "Counting nodes instead of edges."],
},
{
  id: "balanced-binary-tree", t: "Balanced Binary Tree", lc: 110, d: "Easy", p: "Tree DFS (height with early exit)", h: "tree",
  q: "A binary tree is **height-balanced** if, at every node, the heights of the left and right subtrees differ by at most 1. Return whether the tree is balanced.",
  ex: [["root = [3,9,20,null,null,15,7]", "True", ""], ["root = [1,2,2,3,3,null,null,4,4]", "False", ""], ["root = []", "True", ""]],
  c: ["0 ≤ nodes ≤ 5000"],
  hint: "Compute heights bottom-up. Return −1 as a signal meaning \"already unbalanced\" to stop early.",
  opt: {
    idea: "A DFS that returns the height, or **−1 if the subtree is unbalanced**. If either child returns −1 or the heights differ by more than 1, propagate −1.",
    steps: ["dfs(None) = 0", "l = dfs(left); r = dfs(right)", "if l == −1 or r == −1 or |l − r| > 1 → −1", "else 1 + max(l, r)"],
    code: R`
class Solution:
    def isBalanced(self, root: TreeNode | None) -> bool:
        def height(node):
            if not node:
                return 0
            l = height(node.left)
            if l == -1:
                return -1
            r = height(node.right)
            if r == -1 or abs(l - r) > 1:
                return -1                    # unbalanced somewhere below
            return 1 + max(l, r)
        return height(root) != -1`,
    tc: "O(n)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.isBalanced(build_tree([3, 9, 20, None, None, 15, 7])))
print(s.isBalanced(build_tree([1, 2, 2, 3, 3, None, None, 4, 4])))
print(s.isBalanced(build_tree([])))`,
  out: R`
True
False
True`,
  dry: ["Second tree: the node 2 (left) has left height 2 (3 → 4) and right height 1 → OK", "Root: left height 3, right height 1 → difference 2 → −1 → False"],
  expl: [["return -1", "A sentinel that means \"unbalanced\". It lets one DFS return both pieces of information."]],
  take: "**Combine \"compute a value\" and \"validate\" in one DFS using a sentinel.** This avoids O(n²) height recomputation.",
  mist: ["Only checking balance at the root."],
},
{
  id: "same-tree", t: "Same Tree", lc: 100, d: "Easy", p: "Tree DFS (parallel)", h: "tree",
  q: "Given the roots of two binary trees `p` and `q`, return `True` if they are structurally identical and their nodes have the same values.",
  ex: [["p = [1,2,3], q = [1,2,3]", "True", ""], ["p = [1,2], q = [1,null,2]", "False", ""], ["p = [1,2,1], q = [1,1,2]", "False", ""]],
  c: ["0 ≤ nodes ≤ 100"],
  hint: "Walk both trees at the same time.",
  opt: {
    idea: "Both empty → same. Exactly one empty or the values differ → different. Otherwise both subtrees must match.",
    steps: ["if not p and not q: True", "if not p or not q or p.val != q.val: False", "return same(p.left, q.left) and same(p.right, q.right)"],
    code: R`
class Solution:
    def isSameTree(self, p: TreeNode | None, q: TreeNode | None) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)`,
    tc: "O(n)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.isSameTree(build_tree([1, 2, 3]), build_tree([1, 2, 3])))
print(s.isSameTree(build_tree([1, 2]), build_tree([1, None, 2])))
print(s.isSameTree(build_tree([1, 2, 1]), build_tree([1, 1, 2])))`,
  out: R`
True
False
False`,
  dry: ["[1,2] vs [1,null,2]: roots equal → compare lefts: 2 vs None → False"],
  expl: [["if not p or not q", "Reached only if *not both* are None, so exactly one is None."]],
  take: "**Comparing two trees → recurse on both in lockstep.** Base cases: both None, one None, values differ.",
  mist: ["Comparing traversal lists without None markers ([1,2] and [1,null,2] share a preorder of values)."],
},
{
  id: "subtree-of-another-tree", t: "Subtree of Another Tree", lc: 572, d: "Easy", p: "Tree DFS + Same Tree", h: "tree",
  q: "Given trees `root` and `subRoot`, return `True` if some node of `root` has a subtree identical to `subRoot`. A subtree includes a node and **all** of its descendants.",
  ex: [["root = [3,4,5,1,2], subRoot = [4,1,2]", "True", ""], ["root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]", "False", "The 4-subtree has an extra 0."]],
  c: ["1 ≤ nodes(root) ≤ 2000", "1 ≤ nodes(subRoot) ≤ 1000"],
  hint: "At each node of `root`, ask \"is the tree starting here the same as subRoot?\" using the Same Tree function.",
  opt: {
    idea: "DFS over `root`. At each node check `isSame(node, subRoot)`. If not, recurse into the left and right children.",
    steps: ["if not subRoot: True; if not root: False", "if same(root, subRoot): True", "return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)"],
    code: R`
class Solution:
    def isSubtree(self, root: TreeNode | None, subRoot: TreeNode | None) -> bool:
        if not subRoot:
            return True
        if not root:
            return False
        if self.same(root, subRoot):
            return True
        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)

    def same(self, a, b):
        if not a and not b:
            return True
        if not a or not b or a.val != b.val:
            return False
        return self.same(a.left, b.left) and self.same(a.right, b.right)`,
    tc: "O(m · n)", tw: "For each of m nodes we may compare up to n nodes.", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.isSubtree(build_tree([3, 4, 5, 1, 2]), build_tree([4, 1, 2])))
print(s.isSubtree(build_tree([3, 4, 5, 1, 2, None, None, None, None, 0]), build_tree([4, 1, 2])))`,
  out: R`
True
False`,
  dry: ["At 3: not same (3 ≠ 4)", "At 4: same(4-subtree, [4,1,2]) → 1 = 1, 2 = 2, all leaves → True"],
  expl: [["return self.isSubtree(root.left, ...) or ...", "`or` short-circuits: stop as soon as one side finds it."]],
  alt: { idea: "O(m + n): serialize both trees with null markers (e.g. \",3,#,#\") and check substring containment, or use tree hashing." },
  take: "**Reuse a smaller tree function (Same Tree) inside a traversal.**",
  mist: ["Only checking nodes whose value matches the root of subRoot is fine, but you still need the full comparison."],
},
{
  id: "lowest-common-ancestor-of-a-binary-search-tree", t: "Lowest Common Ancestor of a BST", lc: 235, d: "Medium", p: "BST property", h: "tree",
  q: "Given a **binary search tree** and two nodes `p` and `q`, return their **lowest common ancestor**: the deepest node that has both `p` and `q` as descendants (a node counts as a descendant of itself).",
  ex: [["root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", "6", ""], ["same tree, p = 2, q = 4", "2", "A node can be its own ancestor."]],
  c: ["all values unique", "p and q exist"],
  hint: "In a BST, if both values are smaller than the node, both are in the left subtree. Where do they *split*?",
  opt: {
    idea: "Start at the root:\n- both p and q < node → go left\n- both > node → go right\n- otherwise they split here (or one equals the node) → this node is the LCA.",
    steps: ["cur = root", "while cur: if p.val < cur.val and q.val < cur.val → left", "elif both greater → right", "else → return cur"],
    code: R`
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        cur = root
        while cur:
            if p.val < cur.val and q.val < cur.val:
                cur = cur.left
            elif p.val > cur.val and q.val > cur.val:
                cur = cur.right
            else:
                return cur              # split point (or equals p/q)`,
    tc: "O(h)", sc: "O(1)",
  },
  run: R`
def find(root, v):
    while root and root.val != v:
        root = root.left if v < root.val else root.right
    return root

root = build_tree([6, 2, 8, 0, 4, 7, 9, None, None, 3, 5])
s = Solution()
print(s.lowestCommonAncestor(root, find(root, 2), find(root, 8)).val)
print(s.lowestCommonAncestor(root, find(root, 2), find(root, 4)).val)
print(s.lowestCommonAncestor(root, find(root, 3), find(root, 5)).val)`,
  out: R`
6
2
4`,
  dry: ["p = 3, q = 5: at 6 both smaller → left to 2", "at 2 both larger → right to 4", "at 4: 3 < 4 < 5 → split → LCA = 4"],
  expl: [["else: return cur", "Either p and q are on different sides, or one of them *is* cur. In both cases cur is the lowest common ancestor."]],
  take: "**BST → use ordering to pick one direction (like binary search).** For a general binary tree LCA, use DFS that returns the found nodes.",
  mist: ["Using the general-tree LCA (it works, but it's O(n) and ignores the BST property)."],
},
{
  id: "binary-tree-level-order-traversal", t: "Binary Tree Level Order Traversal", lc: 102, d: "Medium", p: "Tree BFS", h: "tree",
  q: "Return the level-order traversal of a binary tree's values: a list of levels, left to right.",
  ex: [["root = [3,9,20,null,null,15,7]", "[[3],[9,20],[15,7]]", ""], ["root = [1]", "[[1]]", ""], ["root = []", "[]", ""]],
  c: ["0 ≤ nodes ≤ 2000"],
  hint: "Use a queue. At the start of each round, the queue holds exactly one level. Process `len(queue)` nodes.",
  opt: {
    idea: "BFS with a deque. For each level: record `size = len(q)`, pop exactly `size` nodes (collecting values) and push their children. The children form the next level.",
    steps: ["q = deque([root]) if root", "while q: level = []", "for _ in range(len(q)): node = popleft; level.append(val); push children", "res.append(level)"],
    viz: "treeBFS",
    code: R`
from collections import deque

class Solution:
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        if not root:
            return []
        res, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):          # exactly the nodes of this level
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(level)
        return res`,
    tc: "O(n)", sc: "O(w)", sw: "w = maximum width of the tree (up to n/2).",
  },
  run: R`
s = Solution()
print(s.levelOrder(build_tree([3, 9, 20, None, None, 15, 7])))
print(s.levelOrder(build_tree([1])))
print(s.levelOrder(build_tree([])))`,
  out: R`
[[3], [9, 20], [15, 7]]
[[1]]
[]`,
  dry: { h: ["round", "queue at start", "level", "queue after"], r: [[1, "[3]", "[3]", "[9, 20]"], [2, "[9, 20]", "[9, 20]", "[15, 7]"], [3, "[15, 7]", "[15, 7]", "[]"]] },
  expl: [
    ["for _ in range(len(q)):", "`range(len(q))` is computed **once**, before children are added, so we process exactly one level."],
    ["deque.popleft()", "O(1). `list.pop(0)` would be O(n)."],
  ],
  take: "**Level-by-level anything (right view, zigzag, averages, min depth) → BFS with a `for _ in range(len(q))` loop.**",
  mist: ["Using `list.pop(0)` (O(n)).", "Not separating levels."],
},
{
  id: "binary-tree-right-side-view", t: "Binary Tree Right Side View", lc: 199, d: "Medium", p: "Tree BFS (last of level)", h: "tree",
  q: "Imagine standing to the **right** of a binary tree. Return the values of the nodes you can see, from top to bottom.",
  ex: [["root = [1,2,3,null,5,null,4]", "[1,3,4]", ""], ["root = [1,2,3,4]", "[1,3,4]", "4 is visible from the right because nothing on its level is to its right."], ["root = []", "[]", ""]],
  c: ["0 ≤ nodes ≤ 100"],
  hint: "You see exactly one node per level: the **last** one in left-to-right order.",
  opt: {
    idea: "Level-order BFS. After processing each level, its last node is the one visible from the right.",
    steps: ["BFS level by level", "the last node popped in each level → append to the result"],
    code: R`
from collections import deque

class Solution:
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        if not root:
            return []
        res, q = [], deque([root])
        while q:
            n = len(q)
            for i in range(n):
                node = q.popleft()
                if i == n - 1:
                    res.append(node.val)     # rightmost of this level
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
        return res`,
    tc: "O(n)", sc: "O(w)",
  },
  run: R`
s = Solution()
print(s.rightSideView(build_tree([1, 2, 3, None, 5, None, 4])))
print(s.rightSideView(build_tree([1, 2, 3, 4])))
print(s.rightSideView(build_tree([])))`,
  out: R`
[1, 3, 4]
[1, 3, 4]
[]`,
  dry: ["Levels of [1,2,3,4]: [1], [2,3], [4] → last of each: 1, 3, 4"],
  expl: [["if i == n - 1:", "The last node of the level is the rightmost."]],
  alt: { idea: "DFS visiting right before left. The first node you reach at each new depth is visible.", code: R`
class Solution:
    def rightSideView(self, root):
        res = []
        def dfs(node, depth):
            if not node:
                return
            if depth == len(res):
                res.append(node.val)       # first node at this depth (rightmost)
            dfs(node.right, depth + 1)
            dfs(node.left, depth + 1)
        dfs(root, 0)
        return res` },
  take: "**\"View from a side\" → one node per level → BFS (last/first per level) or DFS with a depth check.**",
  mist: ["Only walking right children. Left nodes can be visible when the right side is shorter."],
},
{
  id: "count-good-nodes-in-binary-tree", t: "Count Good Nodes in Binary Tree", lc: 1448, d: "Medium", p: "Tree DFS (pass state down)", h: "tree",
  q: "A node X is **good** if no node on the path from the root to X has a value **greater** than X. Return the number of good nodes.",
  ex: [["root = [3,1,4,3,null,1,5]", "4", "Good: 3 (root), 4, 3 (left-left), 5."], ["root = [3,3,null,4,2]", "3", ""], ["root = [1]", "1", ""]],
  c: ["1 ≤ nodes ≤ 10^5"],
  hint: "Carry the maximum value seen on the path so far down the recursion.",
  opt: {
    idea: "Pre-order DFS with an extra parameter `max_so_far`. A node is good if `node.val >= max_so_far`. Recurse with `max(max_so_far, node.val)`.",
    steps: ["dfs(node, mx): if None → 0", "good = 1 if node.val >= mx else 0", "mx = max(mx, node.val)", "return good + dfs(left, mx) + dfs(right, mx)"],
    code: R`
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        def dfs(node, mx):
            if not node:
                return 0
            good = 1 if node.val >= mx else 0
            mx = max(mx, node.val)
            return good + dfs(node.left, mx) + dfs(node.right, mx)
        return dfs(root, root.val)`,
    tc: "O(n)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.goodNodes(build_tree([3, 1, 4, 3, None, 1, 5])))
print(s.goodNodes(build_tree([3, 3, None, 4, 2])))
print(s.goodNodes(build_tree([1])))`,
  out: R`
4
3
1`,
  dry: { h: ["node", "max on path", "good?"], r: [[3, 3, "✓"], [1, 3, "✗"], ["3 (under 1)", 3, "✓"], [4, 3, "✓"], ["1 (under 4)", 4, "✗"], [5, 4, "✓"]] },
  expl: [["dfs(node.left, mx)", "State flows **down** through parameters (top-down DFS), unlike height, which flows up."]],
  take: "**Path-dependent conditions → top-down DFS passing state (max, sum, path) as parameters.**",
  mist: ["Using a global max that isn't restored when backtracking to another branch."],
},
{
  id: "validate-binary-search-tree", t: "Validate Binary Search Tree", lc: 98, d: "Medium", p: "Tree DFS (valid range)", h: "tree",
  q: "Determine whether a binary tree is a valid **BST**: every node's left subtree has only values **strictly less** than the node, its right subtree only values **strictly greater**, and both subtrees are BSTs too.",
  ex: [["root = [2,1,3]", "True", ""], ["root = [5,1,4,null,null,3,6]", "False", "4 is in 5's right subtree but 4 < 5."], ["root = [5,4,6,null,null,3,7]", "False", "3 is in 5's right subtree."]],
  c: ["1 ≤ nodes ≤ 10^4"],
  hint: "Checking only `left.val < node.val < right.val` is not enough. Every node must lie in a **range** inherited from all its ancestors.",
  opt: {
    idea: "DFS with bounds `(low, high)`. The root can be anything in (−∞, ∞). Going left narrows the upper bound to the node's value, and going right narrows the lower bound. A node outside its bounds → invalid.",
    steps: ["valid(node, low, high): None → True", "if not (low < node.val < high) → False", "return valid(left, low, node.val) and valid(right, node.val, high)"],
    code: R`
class Solution:
    def isValidBST(self, root: TreeNode | None) -> bool:
        def valid(node, low, high):
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return valid(node.left, low, node.val) and valid(node.right, node.val, high)
        return valid(root, float("-inf"), float("inf"))`,
    tc: "O(n)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.isValidBST(build_tree([2, 1, 3])))
print(s.isValidBST(build_tree([5, 1, 4, None, None, 3, 6])))
print(s.isValidBST(build_tree([5, 4, 6, None, None, 3, 7])))`,
  out: R`
True
False
False`,
  dryOn: "[5,4,6,null,null,3,7]",
  dry: { h: ["node", "allowed range", "ok?"], r: [[5, "(−∞, ∞)", "✓"], [4, "(−∞, 5)", "✓"], [6, "(5, ∞)", "✓"], [3, "(5, 6)", "✗ → False"]] },
  expl: [["low < node.val < high", "Strict inequalities, because duplicates aren't allowed."]],
  alt: { idea: "An in-order traversal of a BST is strictly increasing. Check each value against the previous one.", code: R`
class Solution:
    def isValidBST(self, root):
        prev = float("-inf")
        stack, cur = [], root
        while stack or cur:
            while cur:
                stack.append(cur); cur = cur.left
            cur = stack.pop()
            if cur.val <= prev:
                return False
            prev, cur = cur.val, cur.right
        return True` },
  take: "**BST validity is a global constraint → pass (low, high) bounds down, or check that the in-order sequence is sorted.**",
  mist: ["Only comparing with direct children (fails on the 3rd example)."],
},
{
  id: "kth-smallest-element-in-a-bst", t: "Kth Smallest Element in a BST", lc: 230, d: "Medium", p: "In-order traversal", h: "tree",
  q: "Given the root of a BST and an integer `k`, return the **k-th smallest** value (1-indexed).",
  ex: [["root = [3,1,4,null,2], k = 1", "1", ""], ["root = [5,3,6,2,4,null,null,1], k = 3", "3", ""]],
  c: ["1 ≤ k ≤ n ≤ 10^4"],
  hint: "In-order traversal of a BST visits values in sorted order.",
  opt: {
    idea: "Iterative in-order traversal with a stack: go left as far as possible, pop (visit), then go right. The k-th popped node is the answer, so stop early.",
    steps: ["stack, cur = [], root", "while: push all left children", "cur = pop; k −= 1; if k == 0 → return cur.val", "cur = cur.right"],
    code: R`
class Solution:
    def kthSmallest(self, root: TreeNode | None, k: int) -> int:
        stack, cur = [], root
        while stack or cur:
            while cur:                  # go as far left as possible
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()           # next smallest
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.right`,
    tc: "O(h + k)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.kthSmallest(build_tree([3, 1, 4, None, 2]), 1))
print(s.kthSmallest(build_tree([5, 3, 6, 2, 4, None, None, 1]), 3))`,
  out: R`
1
3`,
  dry: ["Second tree in-order: 1, 2, 3, 4, 5, 6 → the 3rd pop is 3"],
  expl: [["while cur: stack.append(cur); cur = cur.left", "The smallest unvisited value is the leftmost node."]],
  take: "**BST + \"sorted order / k-th\" → in-order traversal.** The iterative version lets you stop early.",
  mist: ["Collecting the whole in-order list when you can stop at k."],
},
{
  id: "construct-binary-tree-from-preorder-and-inorder-traversal", t: "Construct Binary Tree from Preorder and Inorder Traversal", lc: 105, d: "Medium", p: "Divide & Conquer (recursion)", h: "tree",
  q: "Given `preorder` and `inorder` traversals of a binary tree with **unique** values, build and return the tree.",
  ex: [["preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", "[3,9,20,null,null,15,7]", ""], ["preorder = [-1], inorder = [-1]", "[-1]", ""]],
  c: ["1 ≤ n ≤ 3000", "unique values"],
  hint: "preorder[0] is the root. Find it in inorder: everything to its left is the left subtree, and everything to its right is the right subtree.",
  brute: {
    idea: "Directly apply the rule using slicing and `list.index` (O(n) per call).",
    code: R`
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:
        if not preorder:
            return None
        root = TreeNode(preorder[0])
        mid = inorder.index(preorder[0])            # size of the left subtree
        root.left = self.buildTree(preorder[1:mid + 1], inorder[:mid])
        root.right = self.buildTree(preorder[mid + 1:], inorder[mid + 1:])
        return root`,
    tc: "O(n²)", sc: "O(n²)", sw: "Slices copy lists.",
  },
  opt: {
    idea: "Same idea, without copying:\n- A dict `value → inorder index` gives O(1) root lookups.\n- A pointer `pre_i` walks through preorder. Preorder is root, left, right, so building the left subtree fully before the right consumes the values in the correct order.\n- Recurse on inorder index ranges `[l, r]`.",
    steps: ["idx = {v: i for i, v in enumerate(inorder)}; pre_i = 0", "build(l, r): if l > r → None", "root = preorder[pre_i]; pre_i += 1; m = idx[root]", "root.left = build(l, m − 1); root.right = build(m + 1, r)"],
    code: R`
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:
        idx = {v: i for i, v in enumerate(inorder)}
        pre_i = 0

        def build(l, r):                     # build from inorder[l..r]
            nonlocal pre_i
            if l > r:
                return None
            val = preorder[pre_i]
            pre_i += 1
            root = TreeNode(val)
            m = idx[val]
            root.left = build(l, m - 1)      # must build left first (preorder order)
            root.right = build(m + 1, r)
            return root

        return build(0, len(inorder) - 1)`,
    tc: "O(n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(tree_to_list(s.buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])))
print(tree_to_list(s.buildTree([-1], [-1])))`,
  out: R`
[3, 9, 20, None, None, 15, 7]
[-1]`,
  dry: ["root = 3 (pre[0]); in inorder at index 1 → left = [9], right = [15,20,7]", "Left: root 9 (pre[1]), no children", "Right: root 20 (pre[2]); its inorder index splits [15] | [7]", "→ 15 (pre[3]) left, 7 (pre[4]) right"],
  expl: [
    ["idx = {v: i ...}", "Turns `inorder.index(val)` (O(n)) into O(1)."],
    ["root.left = build(l, m - 1)", "The left subtree is everything in inorder before the root."],
  ],
  take: "**Preorder gives roots, inorder gives the left/right split.** Divide and conquer with index ranges plus a hash map.",
  mist: ["Building the right subtree before the left (it consumes preorder in the wrong order)."],
},
{
  id: "binary-tree-maximum-path-sum", t: "Binary Tree Maximum Path Sum", lc: 124, d: "Hard", p: "Tree DFS (gain + global answer)", h: "tree",
  q: "A **path** is any sequence of adjacent nodes where each node appears at most once. It doesn't need to pass through the root. Return the maximum **sum** of any non-empty path.",
  ex: [["root = [1,2,3]", "6", "2 → 1 → 3"], ["root = [-10,9,20,null,null,15,7]", "42", "15 → 20 → 7"]],
  c: ["1 ≤ nodes ≤ 3·10^4", "-1000 ≤ val ≤ 1000"],
  hint: "Like Diameter: at each node, the best path that **bends** here = node + best gain from the left + best gain from the right. But to the parent you can only offer **one** branch. Drop negative gains (use 0 instead).",
  opt: {
    idea: "DFS returns the **max gain** of a downward path starting at this node: `node.val + max(left_gain, right_gain)`, where a negative gain is replaced by 0 (just don't take that branch).\n\nAt each node, also consider the path that goes through it using both sides: `node.val + left_gain + right_gain`. Update a global best.",
    steps: ["best = −inf", "gain(None) = 0", "l = max(gain(left), 0); r = max(gain(right), 0)", "best = max(best, node.val + l + r)", "return node.val + max(l, r)"],
    code: R`
class Solution:
    def maxPathSum(self, root: TreeNode | None) -> int:
        best = float("-inf")

        def gain(node):
            nonlocal best
            if not node:
                return 0
            l = max(gain(node.left), 0)          # ignore negative branches
            r = max(gain(node.right), 0)
            best = max(best, node.val + l + r)   # path bending at this node
            return node.val + max(l, r)          # parent can use only one branch

        gain(root)
        return best`,
    tc: "O(n)", sc: "O(h)",
  },
  run: R`
s = Solution()
print(s.maxPathSum(build_tree([1, 2, 3])))
print(s.maxPathSum(build_tree([-10, 9, 20, None, None, 15, 7])))
print(s.maxPathSum(build_tree([-3])))`,
  out: R`
6
42
-3`,
  dryOn: "[-10,9,20,null,null,15,7]",
  dry: { h: ["node", "l", "r", "through node", "returns"], r: [[9, 0, 0, 9, 9], [15, 0, 0, 15, 15], [7, 0, 0, 7, 7], [20, 15, 7, "**42**", 35], [-10, 9, 35, 34, 25]] },
  expl: [
    ["max(gain(node.left), 0)", "A negative branch would only lower the sum, so skip it."],
    ["best = float(\"-inf\")", "All-negative trees: the answer is the single largest value, which can be negative (so don't start best at 0)."],
  ],
  take: "**Return \"best single branch\" to the parent, but update the global answer with \"both branches\".** This is the core trick for path problems on trees.",
  mist: ["Initializing best = 0 (wrong for all-negative trees).", "Returning node + l + r to the parent (a path can't fork)."],
},
{
  id: "serialize-and-deserialize-binary-tree", t: "Serialize and Deserialize Binary Tree", lc: 297, d: "Hard", p: "Tree DFS (preorder with nulls)", h: "tree",
  q: "Design `serialize(root) → str` and `deserialize(str) → root` so that any binary tree survives the round trip. The format is up to you.",
  ex: [["root = [1,2,3,null,null,4,5]", "[1,2,3,null,null,4,5]", "After serialize → deserialize."]],
  c: ["0 ≤ nodes ≤ 10^4"],
  hint: "Preorder traversal **with explicit null markers** uniquely determines the tree. To decode, read tokens in the same order recursively.",
  opt: {
    idea: "**Serialize:** preorder DFS, writing each value and `N` for every None child, joined by commas.\n\n**Deserialize:** split into tokens and use an iterator. `build()` reads the next token: `N` → None. Otherwise create the node, then `node.left = build()` and `node.right = build()`. This exactly mirrors the serialization order.",
    steps: ["serialize: dfs(node): None → 'N'; else val, dfs(left), dfs(right)", "deserialize: tokens = iter(data.split(','))", "build(): t = next(tokens); 'N' → None; node = TreeNode(int(t)); node.left = build(); node.right = build()"],
    code: R`
class Codec:
    def serialize(self, root: TreeNode | None) -> str:
        out = []
        def dfs(node):
            if not node:
                out.append("N")
                return
            out.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(out)

    def deserialize(self, data: str) -> TreeNode | None:
        tokens = iter(data.split(","))
        def build():
            t = next(tokens)
            if t == "N":
                return None
            node = TreeNode(int(t))
            node.left = build()
            node.right = build()
            return node
        return build()`,
    tc: "O(n)", sc: "O(n)",
  },
  run: R`
codec = Codec()
root = build_tree([1, 2, 3, None, None, 4, 5])
data = codec.serialize(root)
print(data)
print(tree_to_list(codec.deserialize(data)))
print(tree_to_list(codec.deserialize(codec.serialize(None))))`,
  out: R`
1,2,N,N,3,4,N,N,5,N,N
[1, 2, 3, None, None, 4, 5]
[]`,
  dry: ["Tokens: 1 2 N N 3 4 N N 5 N N", "build: 1 → left build: 2 → left N, right N → back; right build: 3 → left 4 (N, N), right 5 (N, N)"],
  expl: [
    ["out.append(\"N\")", "Null markers make the encoding unambiguous. Preorder alone (1,2,3) can't distinguish shapes."],
    ["tokens = iter(...)", "`next(tokens)` consumes tokens one at a time, which is simpler than passing an index around."],
  ],
  take: "**Any DFS order + null markers = a unique, reversible tree encoding.** Decode with the same recursive order.",
  mist: ["Omitting nulls.", "Separator issues with negative or multi-digit numbers (use a delimiter like ',')."],
},
]);
