NC.add("Linked List", [
{
  id: "reverse-linked-list", t: "Reverse Linked List", lc: 206, d: "Easy", p: "In-place Reversal", h: "list",
  q: "Given the `head` of a singly linked list, reverse the list and return the new head.",
  ex: [["head = [1,2,3,4,5]", "[5,4,3,2,1]", ""], ["head = [1,2]", "[2,1]", ""], ["head = []", "[]", ""]],
  c: ["0 ≤ nodes ≤ 5000"],
  hint: "Walk the list and flip each `next` pointer to point backwards. You need to remember three nodes: previous, current, and the next one before you lose it.",
  brute: {
    idea: "Copy values into a Python list, then write them back in reverse order.",
    code: R`
class Solution:
    def reverseList(self, head: ListNode | None) -> ListNode | None:
        vals, cur = [], head
        while cur:
            vals.append(cur.val)
            cur = cur.next
        cur = head
        while cur:
            cur.val = vals.pop()
            cur = cur.next
        return head`,
    tc: "O(n)", sc: "O(n)", bad: "O(n) extra space, and it changes values instead of links (interviewers want pointer manipulation).",
  },
  opt: {
    idea: "Iterate with `prev = None`, `curr = head`. At each node:\n1. Save `nxt = curr.next` (otherwise we lose the rest of the list).\n2. Reverse the pointer: `curr.next = prev`.\n3. Move both forward: `prev = curr`, `curr = nxt`.\n\nWhen `curr` is None, `prev` is the new head.",
    steps: ["prev, curr = None, head", "while curr: nxt = curr.next", "curr.next = prev", "prev, curr = curr, nxt", "return prev"],
    viz: "reverseList",
    code: R`
class Solution:
    def reverseList(self, head: ListNode | None) -> ListNode | None:
        prev, curr = None, head
        while curr:
            nxt = curr.next      # 1. save the rest of the list
            curr.next = prev     # 2. flip the pointer
            prev = curr          # 3. advance prev
            curr = nxt           #    and curr
        return prev`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(to_list(s.reverseList(build_list([1, 2, 3, 4, 5]))))
print(to_list(s.reverseList(build_list([1, 2]))))
print(to_list(s.reverseList(build_list([]))))`,
  out: R`
[5, 4, 3, 2, 1]
[2, 1]
[]`,
  dryOn: "1 → 2 → 3",
  dry: { h: ["step", "prev", "curr", "after flip"], r: [[0, "None", 1, "1 → None"], [1, 1, 2, "2 → 1 → None"], [2, 2, 3, "3 → 2 → 1 → None"], [3, 3, "None", "return 3"]] },
  expl: [
    ["nxt = curr.next", "Must happen **before** we overwrite `curr.next`."],
    ["curr.next = prev", "The actual reversal of one link."],
    ["return prev", "When the loop ends, curr is None and prev is the old tail, which is the new head."],
  ],
  alt: { idea: "Recursive version: reverse the rest, then make the next node point back to us. O(n) stack space.", code: R`
class Solution:
    def reverseList(self, head):
        if not head or not head.next:
            return head
        new_head = self.reverseList(head.next)
        head.next.next = head      # the node after me now points back to me
        head.next = None
        return new_head` },
  take: "**Pointer reversal = save next, flip, advance.** It's a building block for Reorder List, Reverse k-Group and palindrome lists.",
  mist: ["Losing the rest of the list by not saving `next` first.", "Returning `head` (that's now the tail)."],
},
{
  id: "merge-two-sorted-lists", t: "Merge Two Sorted Lists", lc: 21, d: "Easy", p: "Dummy Node + Two Pointers", h: "list",
  q: "Merge two sorted linked lists `list1` and `list2` into one sorted list by splicing their nodes together. Return the head of the merged list.",
  ex: [["list1 = [1,2,4], list2 = [1,3,4]", "[1,1,2,3,4,4]", ""], ["list1 = [], list2 = []", "[]", ""], ["list1 = [], list2 = [0]", "[0]", ""]],
  c: ["0 ≤ nodes ≤ 50 each"],
  hint: "Repeatedly take the smaller head. A **dummy** starting node avoids special-casing the first node.",
  opt: {
    idea: "Create `dummy` and a `tail` pointer. While both lists have nodes, attach the smaller head to `tail.next` and advance that list. When one runs out, attach the remainder of the other (it's already sorted).",
    steps: ["dummy = tail = ListNode()", "while l1 and l2: attach the smaller, advance it, tail = tail.next", "tail.next = l1 or l2", "return dummy.next"],
    code: R`
class Solution:
    def mergeTwoLists(self, list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2        # attach whatever is left
        return dummy.next`,
    tc: "O(m + n)", sc: "O(1)", sw: "Reuses existing nodes.",
  },
  run: R`
s = Solution()
print(to_list(s.mergeTwoLists(build_list([1, 2, 4]), build_list([1, 3, 4]))))
print(to_list(s.mergeTwoLists(build_list([]), build_list([]))))
print(to_list(s.mergeTwoLists(build_list([]), build_list([0]))))`,
  out: R`
[1, 1, 2, 3, 4, 4]
[]
[0]`,
  dry: ["l1 = 1→2→4, l2 = 1→3→4", "1 ≤ 1 → take l1's 1. Then 2 vs 1 → take l2's 1. 2 vs 3 → 2. 4 vs 3 → 3. 4 vs 4 → l1's 4", "l1 empty → attach l2's remaining 4"],
  expl: [
    ["dummy = tail = ListNode()", "A fake head: we never have to ask \"is this the first node?\"."],
    ["tail.next, list1 = list1, list1.next", "Tuple assignment evaluates the right side first, so it's safe."],
    ["tail.next = list1 or list2", "`a or b` returns the first truthy value: whichever list still has nodes."],
    ["return dummy.next", "Skip the fake head."],
  ],
  take: "**Dummy node trick:** whenever you build or modify the head of a list, start from a dummy.",
  mist: ["Forgetting to attach the leftover list."],
},
{
  id: "reorder-list", t: "Reorder List", lc: 143, d: "Medium", p: "Fast/Slow + Reverse + Merge", h: "list",
  q: "Given list `L0 → L1 → … → Ln-1 → Ln`, reorder it **in place** to `L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`. Rearrange the nodes themselves, not just their values.",
  ex: [["head = [1,2,3,4]", "[1,4,2,3]", ""], ["head = [1,2,3,4,5]", "[1,5,2,4,3]", ""]],
  c: ["1 ≤ nodes ≤ 5·10^4"],
  hint: "It's three small problems: find the middle, reverse the second half, then interleave the two halves.",
  brute: {
    idea: "Put the nodes in an array, then link them with two indices from both ends.",
    code: R`
class Solution:
    def reorderList(self, head: ListNode | None) -> None:
        nodes = []
        while head:
            nodes.append(head)
            head = head.next
        i, j = 0, len(nodes) - 1
        while i < j:
            nodes[i].next = nodes[j]
            i += 1
            if i == j:
                break
            nodes[j].next = nodes[i]
            j -= 1
        nodes[i].next = None`,
    tc: "O(n)", sc: "O(n)",
  },
  opt: {
    idea: "1. **Find the middle** with slow/fast pointers.\n2. **Reverse** the second half (starting after the middle) and cut the list in two.\n3. **Merge** by alternating: first1, second1, first2, second2, …",
    steps: ["slow, fast = head, head.next; move until fast reaches the end → slow is the end of the first half", "second = slow.next; slow.next = None; reverse second", "first = head; interleave: save nexts, link first → second → first.next"],
    code: R`
class Solution:
    def reorderList(self, head: ListNode | None) -> None:
        # 1) middle
        slow, fast = head, head.next
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        # 2) reverse second half
        second = slow.next
        slow.next = None                 # cut
        prev = None
        while second:
            nxt = second.next
            second.next = prev
            prev, second = second, nxt
        # 3) merge alternately
        first, second = head, prev
        while second:
            n1, n2 = first.next, second.next
            first.next = second
            second.next = n1
            first, second = n1, n2`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
for vals in ([1, 2, 3, 4], [1, 2, 3, 4, 5]):
    head = build_list(vals)
    s.reorderList(head)          # modifies in place, returns None
    print(to_list(head))`,
  out: R`
[1, 4, 2, 3]
[1, 5, 2, 4, 3]`,
  dryOn: "[1,2,3,4,5]",
  dry: ["Middle: slow stops at 3 → first = 1→2→3, second = 4→5", "Reverse second → 5→4", "Merge: 1→5→2→4→3"],
  expl: [
    ["slow, fast = head, head.next", "Starting fast one ahead makes slow land on the end of the first half (the first half gets the extra node for odd lengths)."],
    ["slow.next = None", "Split into two independent lists."],
    ["n1, n2 = first.next, second.next", "Save both nexts before relinking."],
  ],
  take: "**Many hard linked-list problems = combine small primitives:** find the middle, reverse, merge.",
  mist: ["Not cutting the first half, which creates a cycle."],
},
{
  id: "remove-nth-node-from-end-of-list", t: "Remove Nth Node From End of List", lc: 19, d: "Medium", p: "Two Pointers (gap of n)", h: "list",
  q: "Remove the `n`-th node **from the end** of the list and return the head. Can you do it in one pass?",
  ex: [["head = [1,2,3,4,5], n = 2", "[1,2,3,5]", "Remove 4."], ["head = [1], n = 1", "[]", ""], ["head = [1,2], n = 1", "[1]", ""]],
  c: ["1 ≤ n ≤ length ≤ 30"],
  hint: "If a `right` pointer is n nodes ahead of `left`, then when `right` hits the end, `left` is just before the node to delete.",
  brute: {
    idea: "Two passes: count the length L, then walk to node L − n − 1 and unlink the next one.",
    code: R`
class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        length, cur = 0, head
        while cur:
            length, cur = length + 1, cur.next
        dummy = ListNode(0, head)
        cur = dummy
        for _ in range(length - n):
            cur = cur.next
        cur.next = cur.next.next
        return dummy.next`,
    tc: "O(L)", sc: "O(1)", bad: "Correct. The follow-up asks for one pass.",
  },
  opt: {
    idea: "Start `left` at a **dummy** before head and `right` at head. Move `right` forward n steps. Then move both until `right` is None. Now `left.next` is the node to delete: `left.next = left.next.next`.",
    steps: ["dummy = ListNode(0, head); left = dummy; right = head", "advance right n times", "while right: left, right = left.next, right.next", "left.next = left.next.next; return dummy.next"],
    code: R`
class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        dummy = ListNode(0, head)
        left, right = dummy, head
        for _ in range(n):
            right = right.next              # create a gap of n nodes
        while right:
            left, right = left.next, right.next
        left.next = left.next.next          # skip the target
        return dummy.next`,
    tc: "O(L)", tw: "One pass.", sc: "O(1)",
  },
  run: R`
s = Solution()
print(to_list(s.removeNthFromEnd(build_list([1, 2, 3, 4, 5]), 2)))
print(to_list(s.removeNthFromEnd(build_list([1]), 1)))
print(to_list(s.removeNthFromEnd(build_list([1, 2]), 1)))`,
  out: R`
[1, 2, 3, 5]
[]
[1]`,
  dryOn: "[1,2,3,4,5], n = 2",
  dry: ["right moves 2 → at 3; left at dummy", "Move together: left 1/right 4, left 2/right 5, left 3/right None", "left = 3 → 3.next = 5 (4 removed)"],
  expl: [["dummy = ListNode(0, head)", "Handles deleting the head itself (n = length) with no special case."]],
  take: "**\"k-th from the end\" → two pointers with a fixed gap of k.**",
  mist: ["Starting left at head instead of the dummy (fails when removing the head)."],
},
{
  id: "copy-list-with-random-pointer", t: "Copy List with Random Pointer", lc: 138, d: "Medium", p: "Hash Map (old → new)",
  q: "Each node has `next` and an extra `random` pointer that can point to any node or None. Make a **deep copy** of the list. No pointer in the copy may point into the original list.",
  ex: [["[[7,null],[13,0],[11,4],[10,2],[1,0]]", "same structure, new nodes", "Each pair is [val, index of random]."]],
  c: ["0 ≤ n ≤ 1000"],
  hint: "The tricky part is `random`: it might point to a node you haven't copied yet. First create **all** copies (map old → new), then wire the pointers.",
  opt: {
    idea: "Two passes with a dictionary `old_to_new`:\n1. Create a copy of every node (values only) and store `old_to_new[old] = new`.\n2. For each old node: `new.next = old_to_new[old.next]`, `new.random = old_to_new[old.random]`.\n\nMap `None → None` so null pointers work without special cases.",
    steps: ["old_to_new = {None: None}", "pass 1: for each node: old_to_new[node] = Node(node.val)", "pass 2: set copy.next and copy.random via the map", "return old_to_new[head]"],
    code: R`
class Node:
    def __init__(self, x: int, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: "Node | None") -> "Node | None":
        old_to_new = {None: None}
        cur = head
        while cur:                                  # pass 1: clone nodes
            old_to_new[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:                                  # pass 2: wire pointers
            copy = old_to_new[cur]
            copy.next = old_to_new[cur.next]
            copy.random = old_to_new[cur.random]
            cur = cur.next
        return old_to_new[head]`,
    tc: "O(n)", sc: "O(n)",
  },
  run: R`
def build(pairs):
    nodes = [Node(v) for v, _ in pairs]
    for i, (_, r) in enumerate(pairs):
        nodes[i].next = nodes[i + 1] if i + 1 < len(nodes) else None
        nodes[i].random = nodes[r] if r is not None else None
    return nodes[0] if nodes else None

def dump(head):
    nodes, cur = [], head
    while cur:
        nodes.append(cur); cur = cur.next
    idx = {n: i for i, n in enumerate(nodes)}
    return [[n.val, idx[n.random] if n.random else None] for n in nodes]

orig = build([[7, None], [13, 0], [11, 4], [10, 2], [1, 0]])
copy = Solution().copyRandomList(orig)
print(dump(copy))
print("shares nodes with original?", copy is orig or copy.next is orig.next)`,
  out: R`
[[7, None], [13, 0], [11, 4], [10, 2], [1, 0]]
shares nodes with original? False`,
  dry: ["Pass 1 creates 7', 13', 11', 10', 1' (no links yet)", "Pass 2: 13'.random = map[13.random = 7] = 7' …", "Every pointer in the copy points to a copy."],
  expl: [
    ["old_to_new = {None: None}", "Lets us write `old_to_new[cur.next]` even when cur.next is None."],
    ["Two separate passes", "When we wire `random`, the target node's copy is guaranteed to exist already."],
  ],
  alt: { idea: "O(1) extra space: interleave copies (A → A' → B → B' …), set `A'.random = A.random.next`, then split the lists. Clever, but the hash-map version is what most interviewers expect first." },
  take: "**Cloning a graph-like structure → hash map from original node to its clone.** The same idea solves Clone Graph.",
  mist: ["Setting random during the first pass (the target copy may not exist yet)."],
},
{
  id: "add-two-numbers", t: "Add Two Numbers", lc: 2, d: "Medium", p: "Linked List + carry", h: "list",
  q: "Two non-negative integers are stored as linked lists with digits in **reverse order** (ones digit first). Add them and return the sum as a linked list in the same format.",
  ex: [["l1 = [2,4,3], l2 = [5,6,4]", "[7,0,8]", "342 + 465 = 807"], ["l1 = [0], l2 = [0]", "[0]", ""], ["l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", "[8,9,9,9,0,0,0,1]", ""]],
  c: ["1 ≤ nodes ≤ 100", "no leading zeros"],
  hint: "Do grade-school addition from the ones digit, which is conveniently the head. Keep a carry.",
  opt: {
    idea: "Walk both lists at the same time. At each position `total = d1 + d2 + carry`, the new digit is `total % 10` and `carry = total // 10`. Continue while either list has nodes **or** carry is non-zero.",
    steps: ["dummy = tail = ListNode(); carry = 0", "while l1 or l2 or carry: v1 = l1.val if l1 else 0 …", "carry, digit = divmod(v1 + v2 + carry, 10)", "tail.next = ListNode(digit); advance"],
    code: R`
class Solution:
    def addTwoNumbers(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            v1 = l1.val if l1 else 0
            v2 = l2.val if l2 else 0
            carry, digit = divmod(v1 + v2 + carry, 10)
            tail.next = ListNode(digit)
            tail = tail.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next`,
    tc: "O(max(m, n))", sc: "O(max(m, n))", sw: "The output list.",
  },
  run: R`
s = Solution()
print(to_list(s.addTwoNumbers(build_list([2, 4, 3]), build_list([5, 6, 4]))))
print(to_list(s.addTwoNumbers(build_list([0]), build_list([0]))))
print(to_list(s.addTwoNumbers(build_list([9] * 7), build_list([9] * 4))))`,
  out: R`
[7, 0, 8]
[0]
[8, 9, 9, 9, 0, 0, 0, 1]`,
  dryOn: "[2,4,3] + [5,6,4]",
  dry: { h: ["v1", "v2", "carry in", "sum", "digit", "carry out"], r: [[2, 5, 0, 7, 7, 0], [4, 6, 0, 10, 0, 1], [3, 4, 1, 8, 8, 0]] },
  expl: [
    ["while l1 or l2 or carry:", "Including `carry` handles a final carry like 5 + 5 = 10 → [0, 1]."],
    ["carry, digit = divmod(total, 10)", "divmod gives (tens, ones) in one call."],
  ],
  take: "**Digit-by-digit arithmetic → loop while any input or a carry remains.**",
  mist: ["Forgetting the last carry.", "Converting to int and back: it works in Python, but misses the point (and fails in fixed-width languages)."],
},
{
  id: "linked-list-cycle", t: "Linked List Cycle", lc: 141, d: "Easy", p: "Fast & Slow Pointers (Floyd)", h: "list",
  q: "Given `head`, return `True` if the linked list contains a **cycle** (some node can be reached again by following `next`).",
  ex: [["head = [3,2,0,-4], tail connects to index 1", "True", ""], ["head = [1,2], tail connects to index 0", "True", ""], ["head = [1], no cycle", "False", ""]],
  c: ["0 ≤ nodes ≤ 10^4", "Follow-up: O(1) memory"],
  hint: "Two runners on a circular track, one twice as fast, will eventually meet.",
  brute: {
    idea: "Remember every visited node in a set. Seeing a node twice means a cycle.",
    code: R`
class Solution:
    def hasCycle(self, head: ListNode | None) -> bool:
        seen = set()
        while head:
            if head in seen:
                return True
            seen.add(head)
            head = head.next
        return False`,
    tc: "O(n)", sc: "O(n)", bad: "The follow-up asks for O(1) memory.",
  },
  opt: {
    idea: "**Floyd's tortoise and hare.** `slow` moves 1 step, `fast` moves 2. If there's no cycle, fast reaches None. If there is one, both end up looping inside it, and the gap between them shrinks by 1 each step until they meet.",
    steps: ["slow = fast = head", "while fast and fast.next: slow = slow.next; fast = fast.next.next", "if slow is fast → True", "return False"],
    viz: "fastSlow",
    code: R`
class Solution:
    def hasCycle(self, head: ListNode | None) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:          # same node object
                return True
        return False`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
def with_cycle(vals, pos):
    head = build_list(vals)
    if pos >= 0:
        tail, target = head, None
        i = 0
        while tail.next:
            if i == pos: target = tail
            tail, i = tail.next, i + 1
        tail.next = target if target else tail    # pos may be the tail itself
    return head

s = Solution()
print(s.hasCycle(with_cycle([3, 2, 0, -4], 1)))
print(s.hasCycle(with_cycle([1, 2], 0)))
print(s.hasCycle(with_cycle([1], -1)))`,
  out: R`
True
True
False`,
  dry: ["[3,2,0,−4], tail → index 1", "slow 3→2, fast 3→0", "slow 2→0, fast 0→2 (via −4)", "slow 0→−4, fast 2→−4 → meet → True"],
  expl: [
    ["while fast and fast.next:", "Both checks are needed before jumping two steps."],
    ["slow is fast", "`is` compares identity (same node), which is exactly what we want."],
  ],
  take: "**Cycle detection in O(1) space → fast & slow pointers.** It also finds the middle of a list and the cycle start (Find the Duplicate Number).",
  mist: ["Comparing values (`slow.val == fast.val`). Different nodes can share values."],
},
{
  id: "find-the-duplicate-number", t: "Find the Duplicate Number", lc: 287, d: "Medium", p: "Floyd's cycle (array as linked list)",
  q: "`nums` has `n + 1` integers, each in `[1, n]`. Exactly one value is repeated (possibly many times). Return it **without modifying** the array and using only O(1) extra space.",
  ex: [["nums = [1,3,4,2,2]", "2", ""], ["nums = [3,1,3,4,2]", "3", ""], ["nums = [3,3,3,3,3]", "3", ""]],
  c: ["1 ≤ n ≤ 10^5", "don't modify nums, O(1) space"],
  hint: "Treat index `i` as a node pointing to `nums[i]`. Because two indices point to the duplicate value, the \"list\" has a cycle, and the entrance to the cycle is the duplicate.",
  brute: {
    idea: "Use a set (O(n) space) or sort a copy. Both break the constraints.",
    code: R`
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        seen = set()
        for x in nums:
            if x in seen:
                return x
            seen.add(x)`,
    tc: "O(n)", sc: "O(n)", bad: "Violates O(1) space.",
  },
  opt: {
    idea: "Think of `i → nums[i]` as `next` pointers starting at index 0. No value is 0, so nothing points back to index 0 and it's the start of the list. The duplicate value has two incoming pointers, which is exactly where the cycle begins.\n\n**Phase 1:** slow/fast until they meet inside the cycle.\n**Phase 2:** reset one pointer to the start, then move both one step at a time. They meet at the cycle entrance, which is the duplicate.",
    steps: ["slow = fast = 0", "loop: slow = nums[slow]; fast = nums[nums[fast]] until equal", "slow2 = 0; while slow != slow2: slow = nums[slow]; slow2 = nums[slow2]", "return slow"],
    code: R`
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        slow = fast = 0
        while True:                      # phase 1: meet inside the cycle
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        slow2 = 0
        while slow != slow2:             # phase 2: find the cycle entrance
            slow = nums[slow]
            slow2 = nums[slow2]
        return slow`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.findDuplicate([1, 3, 4, 2, 2]))
print(s.findDuplicate([3, 1, 3, 4, 2]))
print(s.findDuplicate([3, 3, 3, 3, 3]))`,
  out: R`
2
3
3`,
  dryOn: "[1,3,4,2,2]: 0→1→3→2→4→2→4… (cycle 2↔4, entrance 2)",
  dry: ["Phase 1: slow 1,3,2,4 · fast 3,4,4,4 … they meet at 4", "Phase 2: slow from 4 → 2; slow2 from 0 → 1 → 3 → 2 … both reach 2", "Return 2"],
  expl: [
    ["fast = nums[nums[fast]]", "Two \"next\" hops."],
    ["Phase 2 math", "If the distance from start to entrance is a, then when they first meet, a ≡ (distance from the meeting point to the entrance) mod cycle length. So walking a steps from both points lands both on the entrance."],
  ],
  alt: { idea: "Binary search on the value: count how many numbers are ≤ mid. If the count > mid, the duplicate is ≤ mid (pigeonhole). O(n log n) time, O(1) space." },
  take: "**Array with values in [1..n] → treat values as pointers (index → value).** Then use linked-list tricks.",
  mist: ["Starting at index 1 instead of 0 (index 0 is the guaranteed non-cycle start)."],
},
{
  id: "lru-cache", t: "LRU Cache", lc: 146, d: "Medium", p: "Hash Map + Doubly Linked List",
  q: "Design a **Least Recently Used** cache with a fixed `capacity`:\n- `get(key)`: return the value, or −1 if missing. This counts as a use.\n- `put(key, value)`: insert or update. If over capacity, **evict the least recently used** key.\n\nBoth must run in O(1) average time.",
  ex: [["LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4)", "1, -1, -1, 3, 4", ""]],
  c: ["1 ≤ capacity ≤ 3000", "O(1) per operation"],
  hint: "You need O(1) lookup (hash map) and O(1) \"move to most-recent\" / \"remove least-recent\" (doubly linked list). Combine them: the map stores pointers to list nodes.",
  brute: {
    idea: "Python's `OrderedDict` already keeps insertion order and supports `move_to_end` and `popitem(last=False)` in O(1). Great in practice, but interviewers usually want you to build it.",
    code: R`
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.od = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.od:
            return -1
        self.od.move_to_end(key)          # mark as most recent
        return self.od[key]

    def put(self, key: int, value: int) -> None:
        self.od[key] = value
        self.od.move_to_end(key)
        if len(self.od) > self.cap:
            self.od.popitem(last=False)   # evict least recent`,
    tc: "O(1)", sc: "O(capacity)",
  },
  opt: {
    idea: "A **doubly linked list** keeps usage order: the node right after `left` (dummy) is the LRU, and the node right before `right` (dummy) is the MRU. A **dict** maps `key → node`.\n- `get`: look up the node, move it to the MRU end, return its value.\n- `put`: if the key exists, remove its old node. Insert a new node at the MRU end. If over capacity, remove `left.next` (the LRU) from both the list and the dict.",
    steps: ["Helpers: remove(node) and insert(node) at the right end, both O(1)", "get: if key in map: remove + insert → return val", "put: if key in map: remove; create node; insert; map[key] = node", "if len(map) > cap: lru = left.next; remove(lru); del map[lru.key]"],
    code: R`
class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}                              # key -> Node
        self.left, self.right = Node(), Node()     # dummies: left=LRU side, right=MRU side
        self.left.next, self.right.prev = self.right, self.left

    def _remove(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _insert(self, node):                       # insert just before right (MRU)
        prev = self.right.prev
        prev.next = node
        node.prev = prev
        node.next = self.right
        self.right.prev = node

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._insert(node)                          # now most recently used
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            self._remove(self.map[key])
        node = Node(key, value)
        self.map[key] = node
        self._insert(node)
        if len(self.map) > self.cap:
            lru = self.left.next                    # least recently used
            self._remove(lru)
            del self.map[lru.key]`,
    tc: "O(1) per op", sc: "O(capacity)",
  },
  run: R`
c = LRUCache(2)
c.put(1, 1); c.put(2, 2)
print(c.get(1))      # 1  (order now: 2, 1)
c.put(3, 3)          # evicts 2
print(c.get(2))      # -1
c.put(4, 4)          # evicts 1
print(c.get(1), c.get(3), c.get(4))`,
  out: R`
1
-1
-1 3 4`,
  dry: { h: ["operation", "list (LRU → MRU)", "result"], r: [["put(1,1)", "1", ""], ["put(2,2)", "1, 2", ""], ["get(1)", "2, 1", "1"], ["put(3,3)", "1, 3 (2 evicted)", ""], ["get(2)", "1, 3", "−1"], ["put(4,4)", "3, 4 (1 evicted)", ""], ["get(1), get(3), get(4)", "4, 3 → 3, 4", "−1, 3, 4"]] },
  expl: [
    ["self.left, self.right = Node(), Node()", "Two dummy sentinels, so insert/remove never deal with None neighbours."],
    ["node.prev.next, node.next.prev = node.next, node.prev", "Unlink in O(1). That's why the list must be doubly linked."],
    ["lru = self.left.next", "The first real node is the least recently used."],
    ["del self.map[lru.key]", "That's why each node stores its key: to delete it from the map on eviction."],
  ],
  take: "**O(1) lookup + O(1) ordering → hash map + doubly linked list** (= `OrderedDict`). It's a classic design-interview question.",
  mist: ["Not storing the key in the node (you can't remove it from the map on eviction).", "Updating an existing key without moving it to the MRU end."],
},
{
  id: "merge-k-sorted-lists", t: "Merge k Sorted Lists", lc: 23, d: "Hard", p: "Heap (k-way merge)", h: "list",
  q: "You're given an array of `k` sorted linked lists. Merge them into one sorted linked list and return its head.",
  ex: [["lists = [[1,4,5],[1,3,4],[2,6]]", "[1,1,2,3,4,4,5,6]", ""], ["lists = []", "[]", ""], ["lists = [[]]", "[]", ""]],
  c: ["0 ≤ k ≤ 10^4", "total nodes ≤ 10^4"],
  hint: "At every step, the next node of the answer is the smallest among the k current heads. What gives you the minimum of k items quickly?",
  brute: {
    idea: "Collect all values, sort them, and build a new list.",
    code: R`
class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        vals = []
        for node in lists:
            while node:
                vals.append(node.val)
                node = node.next
        return build_list(sorted(vals))`,
    tc: "O(N log N)", sc: "O(N)", bad: "Ignores that the lists are already sorted.",
  },
  better: {
    idea: "**Divide and conquer:** merge the lists in pairs (like merge sort), halving the number of lists each round. log k rounds, each O(N).",
    code: R`
class Solution:
    def mergeKLists(self, lists):
        def merge2(a, b):
            dummy = tail = ListNode()
            while a and b:
                if a.val <= b.val:
                    tail.next, a = a, a.next
                else:
                    tail.next, b = b, b.next
                tail = tail.next
            tail.next = a or b
            return dummy.next

        if not lists:
            return None
        while len(lists) > 1:
            merged = []
            for i in range(0, len(lists), 2):
                merged.append(merge2(lists[i], lists[i + 1] if i + 1 < len(lists) else None))
            lists = merged
        return lists[0]`,
    tc: "O(N log k)", sc: "O(1) extra",
  },
  opt: {
    idea: "Push the head of each list into a **min-heap** keyed by value. Repeatedly pop the smallest node, append it to the result, and push its `next` (if any). The heap never holds more than k nodes.\n\nPython can't compare ListNode objects, so push `(val, i, node)`. The unique index `i` breaks ties.",
    steps: ["heap = [(node.val, i, node) for each non-empty list]; heapify", "while heap: val, i, node = heappop", "tail.next = node; tail = node", "if node.next: heappush((node.next.val, i, node.next))"],
    code: R`
import heapq

class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapq.heapify(heap)
        dummy = tail = ListNode()
        while heap:
            val, i, node = heapq.heappop(heap)       # smallest current head
            tail.next = tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next`,
    tc: "O(N log k)", tw: "N total nodes, each pushed and popped once on a heap of size ≤ k.", sc: "O(k)",
  },
  run: R`
s = Solution()
print(to_list(s.mergeKLists([build_list([1, 4, 5]), build_list([1, 3, 4]), build_list([2, 6])])))
print(to_list(s.mergeKLists([])))
print(to_list(s.mergeKLists([build_list([])])))`,
  out: R`
[1, 1, 2, 3, 4, 4, 5, 6]
[]
[]`,
  dry: ["heap: (1,0), (1,1), (2,2)", "pop (1,0) → push 4 from list 0 → heap (1,1),(2,2),(4,0)", "pop (1,1) → push 3 … continue until empty"],
  expl: [
    ["(node.val, i, node)", "Tuples compare left to right. If two vals tie, `i` decides, so Python never tries to compare nodes (that would be a TypeError)."],
    ["tail.next = tail = node", "Chained assignment: first `tail.next = node`, then `tail = node`."],
  ],
  take: "**Merging k sorted sequences → min-heap of the k current heads (k-way merge).** O(N log k).",
  mist: ["Pushing `(val, node)`: ties crash with `'<' not supported between ListNode`."],
},
{
  id: "reverse-nodes-in-k-group", t: "Reverse Nodes in k-Group", lc: 25, d: "Hard", p: "In-place Reversal (groups)", h: "list",
  q: "Reverse the nodes of the list **k at a time** and return the modified list. If the number of nodes left at the end is less than k, leave them as they are. Only change links, not values.",
  ex: [["head = [1,2,3,4,5], k = 2", "[2,1,4,3,5]", ""], ["head = [1,2,3,4,5], k = 3", "[3,2,1,4,5]", ""]],
  c: ["1 ≤ k ≤ n ≤ 5000", "O(1) extra space follow-up"],
  hint: "Repeat: find the k-th node from the current group's predecessor. If it exists, reverse that group and reconnect it to its predecessor and successor.",
  opt: {
    idea: "Use a `dummy` before head and `group_prev` = the node just before the current group.\n1. Find `kth` = k steps after `group_prev`. If it doesn't exist, stop.\n2. `group_next = kth.next`.\n3. Reverse the group with the standard loop, starting `prev = group_next` so the group's first node ends up pointing to the rest of the list.\n4. Reconnect: `group_prev.next = kth` (the new first node). The old first node is now the group's tail, so it becomes the next `group_prev`.",
    steps: ["dummy → head; group_prev = dummy", "kth = get_kth(group_prev, k); if not kth: break", "reverse nodes from group_prev.next up to kth, with prev = kth.next", "tmp = group_prev.next; group_prev.next = kth; group_prev = tmp"],
    code: R`
class Solution:
    def reverseKGroup(self, head: ListNode | None, k: int) -> ListNode | None:
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            kth = group_prev
            for _ in range(k):                 # find the k-th node of this group
                kth = kth.next
                if not kth:
                    return dummy.next          # fewer than k left
            group_next = kth.next

            prev, curr = group_next, group_prev.next
            while curr is not group_next:      # standard reversal inside the group
                nxt = curr.next
                curr.next = prev
                prev, curr = curr, nxt

            first = group_prev.next            # old first = new tail of the group
            group_prev.next = kth              # kth is the new first
            group_prev = first`,
    tc: "O(n)", tw: "Every node is visited a constant number of times.", sc: "O(1)",
  },
  run: R`
s = Solution()
print(to_list(s.reverseKGroup(build_list([1, 2, 3, 4, 5]), 2)))
print(to_list(s.reverseKGroup(build_list([1, 2, 3, 4, 5]), 3)))`,
  out: R`
[2, 1, 4, 3, 5]
[3, 2, 1, 4, 5]`,
  dryOn: "[1,2,3,4,5], k = 3",
  dry: ["group_prev = dummy, kth = 3, group_next = 4", "Reverse 1,2,3 with prev starting at 4: 1→4, 2→1, 3→2", "dummy.next = 3 → list is 3→2→1→4→5; group_prev = 1", "From 1: only 4, 5 remain (< 3) → return"],
  expl: [
    ["prev, curr = group_next, group_prev.next", "Starting `prev` at the next group means the reversed group's tail automatically links to the rest."],
    ["first = group_prev.next", "Grab it **before** overwriting group_prev.next."],
  ],
  take: "**Group-wise reversal = the basic reversal + careful reconnection.** Draw the 4 pointers: group_prev, first, kth, group_next.",
  mist: ["Reversing the leftover partial group.", "Losing the link from the previous group to the new group head."],
},
]);
