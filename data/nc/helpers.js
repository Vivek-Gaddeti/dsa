/* Helper classes shown on linked-list / tree problems (LeetCode provides these for you) */
window.NC_HELPERS = {
  list: R`
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_list(values):
    """[1,2,3] -> 1 -> 2 -> 3"""
    dummy = tail = ListNode()
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next

def to_list(head):
    """1 -> 2 -> 3 -> [1,2,3]"""
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out
`,
  tree: R`
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(values):
    """LeetCode level-order list -> tree, e.g. [3,9,20,None,None,15,7]"""
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    q, i = deque([root]), 1
    while q and i < len(values):
        node = q.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            q.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            q.append(node.right)
        i += 1
    return root

def tree_to_list(root):
    """tree -> LeetCode level-order list (trailing None removed)"""
    out, q = [], deque([root])
    while q:
        node = q.popleft()
        if node:
            out.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            out.append(None)
    while out and out[-1] is None:
        out.pop()
    return out
`,
};
