NC.add("Intervals", [
{
  id: "insert-interval", t: "Insert Interval", lc: 57, d: "Medium", p: "Intervals (three phases)",
  q: "Given **non-overlapping** intervals sorted by start, insert `newInterval` and merge if necessary. Return the resulting sorted, non-overlapping list.",
  ex: [["intervals = [[1,3],[6,9]], newInterval = [2,5]", "[[1,5],[6,9]]", ""], ["intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", "[[1,2],[3,10],[12,16]]", ""]],
  c: ["0 ≤ n ≤ 10^4"],
  hint: "Three phases: intervals entirely **before** the new one, intervals that **overlap** it (merge them all into one), and intervals entirely **after**.",
  opt: {
    idea: "1. Copy intervals that end before `new` starts.\n2. While intervals overlap `new` (start ≤ new.end), expand `new` to `[min starts, max ends]`.\n3. Append `new`, then copy the rest.",
    steps: ["i = 0; res = []", "while intervals[i].end < new.start: res.append; i++", "while intervals[i].start ≤ new.end: new = [min, max]; i++", "res.append(new); res += intervals[i:]"],
    code: R`
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        res, i, n = [], 0, len(intervals)
        s, e = newInterval
        while i < n and intervals[i][1] < s:          # 1) completely before
            res.append(intervals[i])
            i += 1
        while i < n and intervals[i][0] <= e:         # 2) overlapping -> merge
            s = min(s, intervals[i][0])
            e = max(e, intervals[i][1])
            i += 1
        res.append([s, e])
        res.extend(intervals[i:])                     # 3) completely after
        return res`,
    tc: "O(n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.insert([[1, 3], [6, 9]], [2, 5]))
print(s.insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]))
print(s.insert([], [5, 7]))`,
  out: R`
[[1, 5], [6, 9]]
[[1, 2], [3, 10], [12, 16]]
[[5, 7]]`,
  dry: ["[4,8]: [1,2] ends before 4 → copy", "[3,5] overlaps → [3,8]; [6,7] → [3,8]; [8,10] → [3,10]", "[12,16] starts after 10 → append [3,10], then copy [12,16]"],
  expl: [["intervals[i][0] <= e", "It overlaps if it starts before (or exactly when) the merged interval ends."]],
  take: "**Sorted intervals + one new interval → before / overlap / after, in a single pass.**",
  mist: ["Using `<` instead of `<=` (touching intervals like [1,2] and [2,3] count as overlapping here)."],
},
{
  id: "merge-intervals", t: "Merge Intervals", lc: 56, d: "Medium", p: "Sort + Merge",
  q: "Given an array of intervals, merge all overlapping intervals and return the non-overlapping result.",
  ex: [["intervals = [[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]", ""], ["intervals = [[1,4],[4,5]]", "[[1,5]]", "Touching counts as overlapping."]],
  c: ["1 ≤ n ≤ 10^4"],
  hint: "Sort by start. Then an interval can only overlap the **last** merged interval.",
  opt: {
    idea: "Sort by start. Walk through: if the current interval starts ≤ the end of the last merged one, extend that end (`max`). Otherwise start a new merged interval.",
    steps: ["intervals.sort()", "res = [first]", "for s, e: if s ≤ res[−1][1]: res[−1][1] = max(res[−1][1], e)", "else res.append([s, e])"],
    viz: "mergeIntervals",
    code: R`
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda x: x[0])
        res = [intervals[0][:]]
        for s, e in intervals[1:]:
            if s <= res[-1][1]:                       # overlaps the last merged one
                res[-1][1] = max(res[-1][1], e)       # max: [1,10] then [2,3]
            else:
                res.append([s, e])
        return res`,
    tc: "O(n log n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.merge([[1, 3], [2, 6], [8, 10], [15, 18]]))
print(s.merge([[1, 4], [4, 5]]))
print(s.merge([[1, 10], [2, 3]]))`,
  out: R`
[[1, 6], [8, 10], [15, 18]]
[[1, 5]]
[[1, 10]]`,
  dry: ["sorted: [1,3] [2,6] [8,10] [15,18]", "[2,6]: 2 ≤ 3 → [1,6]", "[8,10]: 8 > 6 → new", "[15,18]: new"],
  expl: [["max(res[-1][1], e)", "The new interval might be completely contained, e.g. [1,10] then [2,3]."]],
  take: "**Overlapping intervals → sort by start, then compare only with the last merged interval.**",
  mist: ["Setting the end to `e` instead of `max(...)`."],
},
{
  id: "non-overlapping-intervals", t: "Non-overlapping Intervals", lc: 435, d: "Medium", p: "Greedy (earliest end)",
  q: "Return the **minimum number of intervals to remove** so the remaining ones don't overlap. (Touching endpoints like [1,2] and [2,3] do not overlap.)",
  ex: [["intervals = [[1,2],[2,3],[3,4],[1,3]]", "1", "Remove [1,3]."], ["intervals = [[1,2],[1,2],[1,2]]", "2", ""], ["intervals = [[1,2],[2,3]]", "0", ""]],
  c: ["1 ≤ n ≤ 10^5"],
  hint: "Keeping as many as possible is the classic **activity selection** problem: always keep the interval that **ends earliest**, which leaves the most room for the rest.",
  opt: {
    idea: "Sort by **end**. Keep track of the end of the last kept interval. If the next one starts ≥ that end, keep it. Otherwise it overlaps, so remove it (count += 1). Removing the one that ends later is always at least as good.",
    steps: ["sort by end", "prev_end = −inf; removed = 0", "for s, e: if s ≥ prev_end: prev_end = e else removed += 1"],
    code: R`
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[1])         # earliest end first
        removed, prev_end = 0, float("-inf")
        for s, e in intervals:
            if s >= prev_end:
                prev_end = e                       # keep it
            else:
                removed += 1                       # overlaps -> drop it
        return removed`,
    tc: "O(n log n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]))
print(s.eraseOverlapIntervals([[1, 2], [1, 2], [1, 2]]))
print(s.eraseOverlapIntervals([[1, 2], [2, 3]]))`,
  out: R`
1
2
0`,
  dry: ["sorted by end: [1,2] [2,3] [1,3] [3,4]", "keep [1,2] (end 2); keep [2,3] (end 3); [1,3] starts 1 < 3 → remove; keep [3,4]", "removed = 1"],
  expl: [["intervals.sort(key=lambda x: x[1])", "The earliest-finishing interval leaves the most room for the rest (an exchange argument)."]],
  take: "**Max number of non-overlapping intervals (or min to remove) → sort by END, greedily keep.**",
  mist: ["Sorting by start without handling the long-interval case."],
},
{
  id: "meeting-rooms", t: "Meeting Rooms", lc: 252, d: "Easy", p: "Sort + check neighbours", prem: true,
  q: "Given meeting time intervals `[start, end]`, can one person attend **all** meetings (no two overlap)?",
  ex: [["intervals = [[0,30],[5,10],[15,20]]", "False", ""], ["intervals = [[7,10],[2,4]]", "True", ""]],
  c: ["0 ≤ n ≤ 10^4"],
  hint: "After sorting by start, only neighbours can conflict.",
  opt: {
    idea: "Sort by start. If any meeting starts before the previous one ends → False.",
    steps: ["sort", "for i ≥ 1: if start[i] < end[i−1] → False", "True"],
    code: R`
class Solution:
    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
        intervals.sort()
        for i in range(1, len(intervals)):
            if intervals[i][0] < intervals[i - 1][1]:
                return False
        return True`,
    tc: "O(n log n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.canAttendMeetings([[0, 30], [5, 10], [15, 20]]))
print(s.canAttendMeetings([[7, 10], [2, 4]]))`,
  out: R`
False
True`,
  dry: ["sorted [0,30], [5,10] → 5 < 30 → conflict → False"],
  expl: [["intervals.sort()", "Lists sort by their first element, then the second."]],
  take: "**Any overlap among intervals → sort + compare adjacent ones.**",
  mist: ["Comparing every pair (O(n²))."],
},
{
  id: "meeting-rooms-ii", t: "Meeting Rooms II", lc: 253, d: "Medium", p: "Min-Heap of end times / sweep line", prem: true,
  q: "Given meeting intervals, return the **minimum number of conference rooms** required.",
  ex: [["intervals = [[0,30],[5,10],[15,20]]", "2", ""], ["intervals = [[7,10],[2,4]]", "1", ""]],
  c: ["1 ≤ n ≤ 10^4"],
  hint: "Process meetings by start time. Keep the end times of the meetings currently running in a min-heap. If the earliest-ending room is free by now, reuse it.",
  opt: {
    idea: "Sort by start. Min-heap `ends` = the end times of the rooms in use. For each meeting: if `ends[0] ≤ start`, that room is free, so pop it. Push this meeting's end. The heap's maximum size is the answer (it never shrinks below the number of rooms needed).",
    steps: ["sort by start; ends = []", "for s, e: if ends and ends[0] ≤ s: heappop", "heappush(e)", "return len(ends)"],
    code: R`
import heapq

class Solution:
    def minMeetingRooms(self, intervals: list[list[int]]) -> int:
        intervals.sort()
        ends = []                                  # end times of rooms in use
        for s, e in intervals:
            if ends and ends[0] <= s:
                heapq.heappop(ends)                # reuse the room that freed up
            heapq.heappush(ends, e)
        return len(ends)`,
    tc: "O(n log n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.minMeetingRooms([[0, 30], [5, 10], [15, 20]]))
print(s.minMeetingRooms([[7, 10], [2, 4]]))
print(s.minMeetingRooms([[1, 5], [2, 6], [3, 7], [6, 8]]))`,
  out: R`
2
1
3`,
  dry: { h: ["meeting", "heap before", "action", "heap after"], r: [["[0,30]", "[]", "new room", "[30]"], ["[5,10]", "[30]", "30 > 5 → new room", "[10, 30]"], ["[15,20]", "[10, 30]", "10 ≤ 15 → reuse", "[20, 30] → 2 rooms"]] },
  expl: [["return len(ends)", "We pop at most one per push, so the heap size equals the peak number of simultaneous meetings."]],
  alt: { idea: "Sweep line: sort the starts and ends separately and walk both with two pointers. +1 at a start, −1 at an end; the answer is the max running count.", code: R`
class Solution:
    def minMeetingRooms(self, intervals):
        starts = sorted(s for s, _ in intervals)
        ends = sorted(e for _, e in intervals)
        rooms = best = j = 0
        for s in starts:
            while ends[j] <= s:
                rooms -= 1; j += 1
            rooms += 1
            best = max(best, rooms)
        return best` },
  take: "**Max overlap at any moment (rooms, platforms, CPUs) → min-heap of end times, or a sweep line over sorted events.**",
  mist: ["Popping all finished meetings is fine too, but then you must track the maximum size separately."],
},
{
  id: "minimum-interval-to-include-each-query", t: "Minimum Interval to Include Each Query", lc: 1851, d: "Hard", p: "Sort + Heap (offline queries)",
  q: "Given `intervals[i] = [l, r]` (size = r − l + 1) and `queries`, for each query q return the **size of the smallest interval containing q**, or −1 if none does.",
  ex: [["intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]", "[3, 3, 1, 4]", ""], ["intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]", "[2, -1, 4, 6]", ""]],
  c: ["1 ≤ n, q ≤ 10^5"],
  hint: "Answer the queries in **sorted order** (offline). As q grows, add intervals that have started (l ≤ q) to a min-heap keyed by size, and pop the ones that already ended (r < q).",
  opt: {
    idea: "Sort the intervals by start, and process the queries in sorted order (remembering their original positions).\nFor each query q:\n1. Push every interval with `l ≤ q` as `(size, r)`.\n2. Pop from the heap while the top's `r < q` (it can't contain q, nor any later query).\n3. The heap's top size is the answer (or −1).",
    steps: ["intervals.sort(); i = 0; heap = []", "for q in sorted(set(queries)): push started intervals (size, r)", "pop while heap[0].r < q", "ans[q] = heap[0].size or −1", "map the answers back to the original order"],
    code: R`
import heapq

class Solution:
    def minInterval(self, intervals: list[list[int]], queries: list[int]) -> list[int]:
        intervals.sort()
        heap, i, ans = [], 0, {}
        for q in sorted(set(queries)):
            while i < len(intervals) and intervals[i][0] <= q:
                l, r = intervals[i]
                heapq.heappush(heap, (r - l + 1, r))     # (size, right end)
                i += 1
            while heap and heap[0][1] < q:
                heapq.heappop(heap)                      # ended before q
            ans[q] = heap[0][0] if heap else -1
        return [ans[q] for q in queries]`,
    tc: "O(n log n + q log q)", sc: "O(n + q)",
  },
  run: R`
s = Solution()
print(s.minInterval([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]))
print(s.minInterval([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]))`,
  out: R`
[3, 3, 1, 4]
[2, -1, 4, 6]`,
  dry: { h: ["q", "pushed", "popped (r < q)", "answer"], r: [[2, "[1,4] size 4, [2,4] size 3", "—", 3], [3, "[3,6] size 4", "—", 3], [4, "[4,4] size 1", "—", 1], [5, "—", "sizes 1, 3, 4 with r = 4", "4 ([3,6])"]] },
  expl: [
    ["sorted(set(queries))", "Offline processing: answer the queries in an order that lets the heap only grow forward."],
    ["heap[0][1] < q", "Lazy removal: only check the top; stale intervals deeper in the heap are removed when they surface."],
  ],
  take: "**Many queries over intervals → sort the queries (offline) + sweep + heap.**",
  mist: ["Answering in input order (that forces re-scanning the intervals)."],
},
]);
