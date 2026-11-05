NC.add("Heap / Priority Queue", [
{
  id: "kth-largest-element-in-a-stream", t: "Kth Largest Element in a Stream", lc: 703, d: "Easy", p: "Min-Heap of size k",
  q: "Design `KthLargest(k, nums)` with a method `add(val)` that adds `val` to the stream and returns the **k-th largest** element seen so far.",
  ex: [["KthLargest(3, [4,5,8,2]); add(3), add(5), add(10), add(9), add(4)", "4, 5, 5, 8, 8", ""]],
  c: ["1 ≤ k ≤ 10^4", "≤ 10^4 add calls"],
  hint: "Keep only the k largest values seen. The smallest of those k is the answer. Which structure gives the smallest element in O(1)?",
  brute: {
    idea: "Keep all values in a list and sort on every add.",
    code: R`
class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k, self.nums = k, nums[:]
    def add(self, val: int) -> int:
        self.nums.append(val)
        self.nums.sort()
        return self.nums[-self.k]`,
    tc: "add O(n log n)", sc: "O(n)",
  },
  opt: {
    idea: "Maintain a **min-heap containing only the k largest** elements. Its root (`heap[0]`) is the k-th largest.\n\nOn `add`: push the value. If the heap grows beyond k, pop the smallest. That value can never be the k-th largest again.",
    steps: ["heap = nums; heapify; pop until len == k", "add(v): heappush(v); if len > k: heappop", "return heap[0]"],
    viz: "heapPush",
    code: R`
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = nums[:]
        heapq.heapify(self.heap)               # O(n)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)           # drop the smallest
        return self.heap[0]                    # smallest of the k largest`,
    tc: "add O(log k)", sc: "O(k)",
  },
  run: R`
kl = KthLargest(3, [4, 5, 8, 2])
print([kl.add(v) for v in [3, 5, 10, 9, 4]])`,
  out: R`
[4, 5, 5, 8, 8]`,
  dry: { h: ["add", "heap (k = 3 largest)", "returns heap[0]"], r: [["init", "[4, 5, 8]", ""], [3, "3 popped → [4, 5, 8]", 4], [5, "4 popped → [5, 5, 8]", 5], [10, "5 popped → [5, 8, 10]", 5], [9, "5 popped → [8, 9, 10]", 8], [4, "4 popped → [8, 9, 10]", 8]] },
  expl: [
    ["heapq.heapify(self.heap)", "Rearranges a list into a heap in O(n). Python's heapq is a **min**-heap."],
    ["return self.heap[0]", "The root of a min-heap is its smallest element."],
  ],
  take: "**k-th largest → min-heap of size k. k-th smallest → max-heap of size k** (push negatives in Python).",
  mist: ["Using a max-heap of everything (O(n) memory and slower)."],
},
{
  id: "last-stone-weight", t: "Last Stone Weight", lc: 1046, d: "Easy", p: "Max-Heap (simulation)",
  q: "Each turn, smash the two **heaviest** stones x ≤ y together: if x == y both are destroyed, otherwise a stone of weight `y − x` remains. Return the weight of the last remaining stone, or 0 if none are left.",
  ex: [["stones = [2,7,4,1,8,1]", "1", "8,7 → 1; 4,2 → 2; 2,1 → 1; 1,1 → 0; 1 left"], ["stones = [1]", "1", ""]],
  c: ["1 ≤ n ≤ 30"],
  hint: "You repeatedly need the largest two. Max-heap. In Python, store negatives in heapq.",
  brute: {
    idea: "Sort each round and take the last two.",
    code: R`
class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        stones = stones[:]
        while len(stones) > 1:
            stones.sort()
            y, x = stones.pop(), stones.pop()
            if y != x:
                stones.append(y - x)
        return stones[0] if stones else 0`,
    tc: "O(n² log n)", sc: "O(1)",
  },
  opt: {
    idea: "Put the negatives into a heap (a min-heap of negatives behaves like a max-heap). Pop two, and push the difference back if it's non-zero.",
    steps: ["heap = [−s for s in stones]; heapify", "while len > 1: y = −pop; x = −pop", "if y != x: push −(y − x)", "return −heap[0] if heap else 0"],
    code: R`
import heapq

class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        heap = [-s for s in stones]      # max-heap via negation
        heapq.heapify(heap)
        while len(heap) > 1:
            y = -heapq.heappop(heap)     # heaviest
            x = -heapq.heappop(heap)     # second heaviest
            if y != x:
                heapq.heappush(heap, -(y - x))
        return -heap[0] if heap else 0`,
    tc: "O(n log n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.lastStoneWeight([2, 7, 4, 1, 8, 1]))
print(s.lastStoneWeight([1]))
print(s.lastStoneWeight([3, 3]))`,
  out: R`
1
1
0`,
  dry: ["[8,7,4,2,1,1] → smash 8,7 → 1 → [4,2,1,1,1]", "4,2 → 2 → [2,1,1,1]", "2,1 → 1 → [1,1,1]", "1,1 → 0 → [1] → answer 1"],
  expl: [["heap = [-s for s in stones]", "heapq only supports min-heaps. Negating flips the order."]],
  take: "**Repeatedly take the largest → max-heap (negate values in Python).**",
  mist: ["Forgetting to negate back when reading values."],
},
{
  id: "k-closest-points-to-origin", t: "K Closest Points to Origin", lc: 973, d: "Medium", p: "Heap (top k smallest)",
  q: "Given `points[i] = [x, y]` and `k`, return the `k` points closest to the origin `(0, 0)` (Euclidean distance). Any order is fine.",
  ex: [["points = [[1,3],[-2,2]], k = 1", "[[-2,2]]", "dist² 10 vs 8"], ["points = [[3,3],[5,-1],[-2,4]], k = 2", "[[3,3],[-2,4]]", ""]],
  c: ["1 ≤ k ≤ n ≤ 10^4"],
  hint: "Compare squared distances (no sqrt needed). Keep the k smallest with a **max-heap of size k**.",
  brute: {
    idea: "Sort all points by squared distance and take k.",
    code: R`
class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        return sorted(points, key=lambda p: p[0] ** 2 + p[1] ** 2)[:k]`,
    tc: "O(n log n)", sc: "O(n)",
  },
  opt: {
    idea: "Keep a max-heap (negated distances) of size k. Push each point; if the size exceeds k, pop the **farthest**. The survivors are the k closest. O(n log k).",
    steps: ["for (x, y): push (−(x² + y²), x, y)", "if len > k: pop (removes the farthest)", "return the remaining points"],
    code: R`
import heapq

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        heap = []                                    # max-heap by distance (negated)
        for x, y in points:
            heapq.heappush(heap, (-(x * x + y * y), x, y))
            if len(heap) > k:
                heapq.heappop(heap)                  # remove the farthest
        return [[x, y] for _, x, y in heap]`,
    tc: "O(n log k)", sc: "O(k)",
  },
  run: R`
s = Solution()
print(s.kClosest([[1, 3], [-2, 2]], 1))
print(sorted(s.kClosest([[3, 3], [5, -1], [-2, 4]], 2)))`,
  out: R`
[[-2, 2]]
[[-2, 4], [3, 3]]`,
  dry: ["Distances²: (3,3) → 18, (5,−1) → 26, (−2,4) → 20", "After pushing all three with k = 2, the farthest (26) is popped → (3,3), (−2,4)"],
  expl: [["-(x * x + y * y)", "Negated so the farthest point is at the top and gets popped first."]],
  alt: { idea: "`heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)` does this in one line. Quickselect gives O(n) on average." },
  take: "**k smallest → max-heap of size k; k largest → min-heap of size k.**",
  mist: ["Using sqrt (slower, floating point) when the squared distance preserves the order."],
},
{
  id: "kth-largest-element-in-an-array", t: "Kth Largest Element in an Array", lc: 215, d: "Medium", p: "Heap / Quickselect",
  q: "Return the **k-th largest** element of an unsorted array (in sorted order, not the k-th distinct). Can you do it without sorting?",
  ex: [["nums = [3,2,1,5,6,4], k = 2", "5", ""], ["nums = [3,2,3,1,2,4,5,5,6], k = 4", "4", ""]],
  c: ["1 ≤ k ≤ n ≤ 10^5"],
  hint: "Min-heap of size k (O(n log k)), or **quickselect**: partition like quicksort, but recurse into only one side (O(n) on average).",
  brute: {
    idea: "Sort descending and index.",
    code: R`
class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        return sorted(nums, reverse=True)[k - 1]`,
    tc: "O(n log n)", sc: "O(n)",
  },
  better: {
    idea: "Min-heap of the k largest. The root is the answer.",
    code: R`
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]`,
    tc: "O(n log k)", sc: "O(k)",
  },
  opt: {
    idea: "**Quickselect.** The k-th largest sits at index `n − k` in sorted order. Pick a random pivot and partition into `< pivot`, `== pivot`, `> pivot`. Recurse only into the group that contains index `n − k`. On average each step halves the work: n + n/2 + n/4 + … = O(n).\n\nThe 3-way partition handles many duplicates gracefully.",
    steps: ["target = n − k (index in ascending order)", "pivot = random; split into lo / eq / hi lists", "target < len(lo) → recurse on lo", "target < len(lo) + len(eq) → pivot is the answer", "else recurse on hi with target −= len(lo) + len(eq)"],
    code: R`
import random

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        target = len(nums) - k                  # index in ascending order

        def select(arr, t):
            pivot = random.choice(arr)
            lo = [x for x in arr if x < pivot]
            eq = [x for x in arr if x == pivot]
            hi = [x for x in arr if x > pivot]
            if t < len(lo):
                return select(lo, t)
            if t < len(lo) + len(eq):
                return pivot
            return select(hi, t - len(lo) - len(eq))

        return select(nums, target)`,
    tc: "O(n) average, O(n²) worst", tw: "A random pivot makes the worst case extremely unlikely.", sc: "O(n)", sw: "This readable version builds lists. An in-place partition gives O(1) extra.",
  },
  run: R`
s = Solution()
print(s.findKthLargest([3, 2, 1, 5, 6, 4], 2))
print(s.findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))`,
  out: R`
5
4`,
  dry: ["[3,2,1,5,6,4], k = 2 → target index 4 (ascending [1,2,3,4,5,6] → 5)", "Say pivot 3 → lo [2,1], eq [3], hi [5,6,4]", "4 ≥ 2 + 1 → recurse on hi with t = 4 − 3 = 1 → [4,5,6] index 1 = 5"],
  expl: [
    ["target = len(nums) - k", "The k-th largest = the (n−k)-th smallest (0-indexed)."],
    ["random.choice(arr)", "Random pivots avoid the adversarial O(n²) case."],
  ],
  take: "**k-th order statistic: heap O(n log k) for streams; quickselect O(n) average for a fixed array.**",
  mist: ["Deduplicating values (the k-th largest counts duplicates)."],
},
{
  id: "task-scheduler", t: "Task Scheduler", lc: 621, d: "Medium", p: "Greedy + Max-Heap (or math)",
  q: "Tasks are letters, and each takes 1 unit of time. The **same** task must be separated by at least `n` units (other tasks or idle). Return the minimum total time to finish all tasks.",
  ex: [["tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2", "8", "A B idle A B idle A B"], ["tasks = [\"A\",\"C\",\"A\",\"B\",\"D\",\"B\"], n = 1", "6", "No idle needed."], ["tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 3", "10", ""]],
  c: ["1 ≤ len ≤ 10^4", "0 ≤ n ≤ 100"],
  hint: "Always run the task with the most remaining copies that is available (greedy). Track the cooling tasks in a queue with their ready time.",
  opt: {
    idea: "**Simulation:** a max-heap of remaining counts, plus a queue of `(count, ready_time)` for cooling tasks.\nEach time unit: if the heap has a task, run it (count − 1); if it still has copies, put it in the queue to be ready at `time + n`. If the queue front is ready, move it back to the heap.\n\n**Math shortcut:** with `maxf` = the highest frequency and `cnt` = how many tasks have it, the answer is `max(len(tasks), (maxf − 1) × (n + 1) + cnt)`.",
    steps: ["heap = [−count for each task]; q = deque(); time = 0", "while heap or q: time += 1", "if heap: c = pop + 1 (one done); if c: q.append((c, time + n))", "if q and q[0].ready == time: push q.popleft().count", "return time"],
    code: R`
import heapq
from collections import Counter, deque

class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        heap = [-c for c in Counter(tasks).values()]   # max-heap of remaining counts
        heapq.heapify(heap)
        q = deque()                                    # (neg_count, time it's ready)
        time = 0
        while heap or q:
            time += 1
            if heap:
                c = heapq.heappop(heap) + 1            # run one copy (count is negative)
                if c:
                    q.append((c, time + n))
            if q and q[0][1] == time:
                heapq.heappush(heap, q.popleft()[0])   # cooled down
        return time`,
    tc: "O(T · log 26) ≈ O(T)", tw: "T = total time; at most 26 task types.", sc: "O(26)",
  },
  run: R`
s = Solution()
print(s.leastInterval(["A", "A", "A", "B", "B", "B"], 2))
print(s.leastInterval(["A", "C", "A", "B", "D", "B"], 1))
print(s.leastInterval(["A", "A", "A", "B", "B", "B"], 3))`,
  out: R`
8
6
10`,
  dry: { h: ["time", "run", "heap after", "cooling queue"], r: [[1, "A", "[B3]", "A2 ready@3"], [2, "B", "[]", "A2@3, B2@4"], [3, "idle → A ready", "[A2]", "B2@4"], [4, "A", "[B2] (B ready)", "A1@6"], [5, "B", "[]", "A1@6, B1@7"], [6, "idle → A ready", "[A1]", "B1@7"], [7, "A", "[B1]", ""], [8, "B", "[]", "done → 8"]] },
  expl: [
    ["heapq.heappop(heap) + 1", "Counts are stored negative, so +1 means \"one fewer remaining\"."],
    ["q.append((c, time + n))", "This task can run again at time + n + 1. We re-add it at the end of time + n, in time for the next unit."],
  ],
  alt: { idea: "O(n) formula: frame the most frequent task.", code: R`
from collections import Counter
class Solution:
    def leastInterval(self, tasks, n):
        freq = Counter(tasks).values()
        maxf = max(freq)
        cnt = sum(1 for f in freq if f == maxf)
        return max(len(tasks), (maxf - 1) * (n + 1) + cnt)` },
  take: "**Scheduling with cooldowns → greedy: always pick the most frequent available item (max-heap) + a cooldown queue.**",
  mist: ["Picking tasks alphabetically instead of by remaining frequency."],
},
{
  id: "design-twitter", t: "Design Twitter", lc: 355, d: "Medium", p: "Heap (k-way merge of feeds)",
  q: "Design a simplified Twitter:\n- `postTweet(userId, tweetId)`\n- `getNewsFeed(userId)`: the **10 most recent** tweet IDs from the user and everyone they follow, newest first\n- `follow(followerId, followeeId)`, `unfollow(followerId, followeeId)`",
  ex: [["post(1,5); feed(1); follow(1,2); post(2,6); feed(1); unfollow(1,2); feed(1)", "[5], [6,5], [5]", ""]],
  c: ["≤ 3·10^4 calls"],
  hint: "Each user's tweets are already in time order. Merging the newest tweets from several sorted lists is a k-way merge with a heap.",
  opt: {
    idea: "Store `tweets[user] = [(time, tweetId), …]` and `following[user] = set()`. A global counter acts as time.\n\nFor the feed: for the user and each followee, push their **latest** tweet into a max-heap (negated time) along with an index into their list. Pop the newest, then push that user's next-older tweet. Stop after 10.",
    steps: ["post: tweets[u].append((time, id)); time += 1", "feed: users = following[u] ∪ {u}", "for each with tweets: push (−time, id, user, idx = last)", "pop up to 10; push the previous tweet of the same user"],
    code: R`
import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)          # user -> [(time, tweetId)]
        self.following = defaultdict(set)

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int) -> list[int]:
        heap = []
        for u in self.following[userId] | {userId}:
            if self.tweets[u]:
                i = len(self.tweets[u]) - 1
                t, tid = self.tweets[u][i]
                heap.append((-t, tid, u, i))
        heapq.heapify(heap)
        feed = []
        while heap and len(feed) < 10:
            _, tid, u, i = heapq.heappop(heap)
            feed.append(tid)
            if i > 0:                                 # next older tweet of that user
                t, nid = self.tweets[u][i - 1]
                heapq.heappush(heap, (-t, nid, u, i - 1))
        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        if followerId != followeeId:
            self.following[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].discard(followeeId)`,
    tc: "feed O(F + 10 log F)", tw: "F = number of followees.", sc: "O(users + tweets)",
  },
  run: R`
tw = Twitter()
tw.postTweet(1, 5)
print(tw.getNewsFeed(1))
tw.follow(1, 2)
tw.postTweet(2, 6)
print(tw.getNewsFeed(1))
tw.unfollow(1, 2)
print(tw.getNewsFeed(1))`,
  out: R`
[5]
[6, 5]
[5]`,
  dry: ["After follow(1,2) and post(2,6): user 1's latest is (t0, 5), user 2's latest is (t1, 6)", "The heap pops t1 (6) first, then t0 (5) → [6, 5]"],
  expl: [
    ["self.following[userId] | {userId}", "Set union: include the user's own tweets."],
    ["discard", "Like remove, but it doesn't raise if the element is missing."],
  ],
  take: "**\"Top N newest across many sorted lists\" → k-way merge with a heap.** You don't need to merge everything.",
  mist: ["Collecting and sorting all tweets of all followees on each feed call."],
},
{
  id: "find-median-from-data-stream", t: "Find Median from Data Stream", lc: 295, d: "Hard", p: "Two Heaps",
  q: "Design `MedianFinder` with `addNum(num)` and `findMedian()`, which returns the median of all numbers added so far (the mean of the two middle values if the count is even).",
  ex: [["addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", "1.5, 2.0", ""]],
  c: ["≤ 5·10^4 calls"],
  hint: "Split the numbers into a lower half and an upper half. You need the max of the lower half and the min of the upper half quickly.",
  brute: {
    idea: "Keep a sorted list using `bisect.insort` (O(n) insert) and read the middle.",
    code: R`
import bisect

class MedianFinder:
    def __init__(self):
        self.a = []
    def addNum(self, num: int) -> None:
        bisect.insort(self.a, num)          # O(n) shifting
    def findMedian(self) -> float:
        n = len(self.a)
        return float(self.a[n // 2]) if n % 2 else (self.a[n // 2 - 1] + self.a[n // 2]) / 2`,
    tc: "add O(n), median O(1)", sc: "O(n)",
  },
  opt: {
    idea: "**Two heaps:**\n- `small` = max-heap (negated) holding the smaller half\n- `large` = min-heap holding the larger half\n\nInvariants: every element of small ≤ every element of large, and `len(small)` is either `len(large)` or `len(large) + 1`.\n\n**addNum:** push into small, then move small's max into large (this keeps the ordering). If large becomes bigger, move its min back to small.\n**findMedian:** odd count → top of small; even → the average of both tops.",
    steps: ["push −num to small", "move −pop(small) to large", "if len(large) > len(small): move pop(large) to small as negative", "median = −small[0] or (−small[0] + large[0]) / 2"],
    code: R`
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []     # max-heap (store negatives): lower half
        self.large = []     # min-heap: upper half

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))   # keep small <= large
        if len(self.large) > len(self.small):                     # rebalance sizes
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2`,
    tc: "add O(log n), median O(1)", sc: "O(n)",
  },
  run: R`
mf = MedianFinder()
mf.addNum(1); mf.addNum(2)
print(mf.findMedian())
mf.addNum(3)
print(mf.findMedian())
for x in [10, -5]:
    mf.addNum(x)
print(mf.findMedian())`,
  out: R`
1.5
2.0
2.0`,
  dry: { h: ["add", "small (max-heap)", "large (min-heap)", "median"], r: [[1, "[1]", "[]", "1"], [2, "[1]", "[2]", "1.5"], [3, "[2, 1]", "[3]", "2"], [10, "[2, 1]", "[3, 10]", "2.5"], [-5, "[2, 1, −5]", "[3, 10]", "2"]] },
  expl: [
    ["heapq.heappush(self.large, -heapq.heappop(self.small))", "Routing every number through small guarantees max(small) ≤ min(large)."],
    ["if len(self.large) > len(self.small):", "We allow small to be bigger by 1, so for odd counts the median is small's top."],
  ],
  take: "**Running median / balancing two halves → two heaps (max-heap low, min-heap high).**",
  mist: ["Forgetting to negate when pushing to or reading from the max-heap."],
},
]);
