NC.add("Advanced Graphs", [
{
  id: "reconstruct-itinerary", t: "Reconstruct Itinerary", lc: 332, d: "Hard", p: "Eulerian Path (Hierholzer)",
  q: "Given airline `tickets` `[from, to]`, reconstruct the itinerary in order, starting at `\"JFK\"`, using **every ticket exactly once**. If several itineraries are valid, return the one that is **lexicographically smallest**.",
  ex: [["tickets = [[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]", "[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]", ""], ["tickets = [[\"JFK\",\"SFO\"],[\"JFK\",\"ATL\"],[\"SFO\",\"ATL\"],[\"ATL\",\"JFK\"],[\"ATL\",\"SFO\"]]", "[\"JFK\",\"ATL\",\"JFK\",\"SFO\",\"ATL\",\"SFO\"]", ""]],
  c: ["1 ≤ tickets ≤ 300", "a valid itinerary always exists"],
  hint: "Using every edge exactly once is an **Eulerian path**. Hierholzer's algorithm: DFS, consuming edges, and add an airport to the route only **after** all its outgoing edges are used. Then reverse.",
  brute: {
    idea: "Backtracking: sort the destinations and try them in order, undoing when stuck. The first complete path is the answer. Worst case exponential.",
    code: R`
from collections import defaultdict

class Solution:
    def findItinerary(self, tickets: list[list[str]]) -> list[str]:
        adj = defaultdict(list)
        for a, b in sorted(tickets):
            adj[a].append(b)
        route = ["JFK"]

        def dfs(u):
            if len(route) == len(tickets) + 1:
                return True
            for i, v in enumerate(adj[u]):
                if v is None:
                    continue
                adj[u][i] = None            # use the ticket
                route.append(v)
                if dfs(v):
                    return True
                route.pop()
                adj[u][i] = v               # undo
            return False

        dfs("JFK")
        return route`,
    tc: "O(E^d) worst", sc: "O(E)",
  },
  opt: {
    idea: "Store the destinations of each airport in **reverse-sorted** lists so `pop()` gives the smallest in O(1).\n\nDFS(u): while `u` has unused tickets, pop the smallest destination `v` and DFS(v). When `u` has no tickets left, **append `u` to the route**. Airports are appended in reverse order of the itinerary (dead ends first), so reverse at the end.",
    steps: ["adj[a] = destinations sorted descending", "dfs(u): while adj[u]: dfs(adj[u].pop())", "route.append(u)  (post-order)", "return route[::-1]"],
    code: R`
from collections import defaultdict

class Solution:
    def findItinerary(self, tickets: list[list[str]]) -> list[str]:
        adj = defaultdict(list)
        for a, b in sorted(tickets, reverse=True):
            adj[a].append(b)              # reverse-sorted -> pop() gives the smallest
        route = []

        def dfs(u):
            while adj[u]:
                dfs(adj[u].pop())         # use the ticket u -> smallest v
            route.append(u)               # all tickets out of u used up

        dfs("JFK")
        return route[::-1]`,
    tc: "O(E log E)", tw: "Sorting the tickets; the DFS itself is O(E).", sc: "O(E)",
  },
  run: R`
s = Solution()
print(s.findItinerary([["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]]))
print(s.findItinerary([["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]]))
print(s.findItinerary([["JFK", "KUL"], ["JFK", "NRT"], ["NRT", "JFK"]]))`,
  out: R`
['JFK', 'MUC', 'LHR', 'SFO', 'SJC']
['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO']
['JFK', 'NRT', 'JFK', 'KUL']`,
  dryOn: "JFK→KUL, JFK→NRT, NRT→JFK (greedy smallest-first would get stuck at KUL)",
  dry: ["dfs(JFK): pop KUL (smallest) → dfs(KUL): no tickets → route = [KUL]", "back in JFK: pop NRT → dfs(NRT): pop JFK → dfs(JFK): no tickets left → route = [KUL, JFK]", "NRT done → [KUL, JFK, NRT]; JFK done → [KUL, JFK, NRT, JFK]", "reverse → JFK, NRT, JFK, KUL ✓"],
  expl: [
    ["route.append(u) after the while loop", "Post-order: the dead end gets appended first, so it ends up last after reversing. That's how Hierholzer handles getting stuck."],
    ["sorted(tickets, reverse=True)", "Then `list.pop()` (O(1)) returns the lexicographically smallest remaining destination."],
  ],
  take: "**Use every edge exactly once → Eulerian path → Hierholzer: DFS consuming edges + post-order + reverse.**",
  mist: ["Greedy smallest-first without post-order (it gets stuck at dead ends like KUL)."],
},
{
  id: "min-cost-to-connect-all-points", t: "Min Cost to Connect All Points", lc: 1584, d: "Medium", p: "Minimum Spanning Tree (Prim)",
  q: "Given `points` on a 2D plane, connecting two points costs their **Manhattan distance** `|x1−x2| + |y1−y2|`. Return the minimum cost to connect all points (any two points must be connected by exactly one simple path).",
  ex: [["points = [[0,0],[2,2],[3,10],[5,2],[7,0]]", "20", ""], ["points = [[3,12],[-2,5],[-4,1]]", "18", ""]],
  c: ["1 ≤ n ≤ 1000"],
  hint: "Connecting everything at minimum total edge cost = **Minimum Spanning Tree**. Prim: grow a tree from one point, always adding the cheapest edge to a new point.",
  opt: {
    idea: "**Prim's algorithm with a min-heap.** Start from point 0 at cost 0. Repeatedly pop the cheapest `(cost, point)`. If the point is already in the tree, skip it. Otherwise add its cost and push edges from it to every point not yet in the tree.\n\nFor a dense complete graph, an O(n²) array-based Prim is even better (shown in the alternative).",
    steps: ["heap = [(0, 0)]; in_tree = set(); total = 0", "pop (c, i); skip if in tree", "add i, total += c", "for every j not in tree: push (dist(i, j), j)", "stop when all n are in the tree"],
    code: R`
import heapq

class Solution:
    def minCostConnectPoints(self, points: list[list[int]]) -> int:
        n = len(points)
        in_tree, total = set(), 0
        heap = [(0, 0)]                          # (cost to connect, point index)
        while len(in_tree) < n:
            cost, i = heapq.heappop(heap)
            if i in in_tree:
                continue                         # stale entry
            in_tree.add(i)
            total += cost
            xi, yi = points[i]
            for j in range(n):
                if j not in in_tree:
                    xj, yj = points[j]
                    heapq.heappush(heap, (abs(xi - xj) + abs(yi - yj), j))
        return total`,
    tc: "O(n² log n)", tw: "n² edges pushed in total.", sc: "O(n²)",
  },
  run: R`
s = Solution()
print(s.minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]))
print(s.minCostConnectPoints([[3, 12], [-2, 5], [-4, 1]]))`,
  out: R`
20
18`,
  dry: ["Start (0,0). The cheapest edge goes to (2,2), cost 4 → total 4", "From {(0,0),(2,2)}: the cheapest new point is (5,2), cost 3 → 7", "Next is (7,0), cost 4 → 11", "Last is (3,10), cost 9 (from (2,2)) → 20"],
  expl: [
    ["if i in in_tree: continue", "Lazy deletion: the heap can hold outdated, more expensive entries for the same point."],
    ["while len(in_tree) < n", "An MST has exactly n − 1 edges, one per added point after the first."],
  ],
  alt: { idea: "O(n²) Prim without a heap: keep `dist[j]` = the cheapest edge from the tree to j, and each round pick the min over the non-tree points. Or use **Kruskal**: sort all edges and union-find." },
  take: "**Connect everything with minimum total cost → MST (Prim with a heap, or Kruskal with sorting + Union-Find).**",
  mist: ["Confusing MST (total edge cost) with shortest paths (Dijkstra)."],
},
{
  id: "network-delay-time", t: "Network Delay Time", lc: 743, d: "Medium", p: "Dijkstra (shortest paths)",
  q: "A network has `n` nodes (1..n) and directed `times[i] = (u, v, w)`: a signal takes `w` time to go from u to v. A signal is sent from node `k`. Return the time for **all** nodes to receive it, or −1 if some node never does.",
  ex: [["times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", "2", ""], ["times = [[1,2,1]], n = 2, k = 1", "1", ""], ["times = [[1,2,1]], n = 2, k = 2", "-1", ""]],
  c: ["1 ≤ n ≤ 100", "w ≥ 0"],
  hint: "Shortest time from k to each node with non-negative weights → Dijkstra. The answer is the max of those shortest times.",
  opt: {
    idea: "**Dijkstra:** a min-heap of `(time, node)`, starting with `(0, k)`. Pop the closest unfinalized node; its time is now final. Push its neighbours with `time + w`. Skip nodes already finalized.\n\nIf all n nodes get finalized, the answer is the largest finalized time.",
    steps: ["adj[u].append((v, w))", "heap = [(0, k)]; dist = {}", "pop (t, u); if u in dist: continue; dist[u] = t", "for (v, w): if v not in dist: push (t + w, v)", "return max(dist.values()) if len(dist) == n else −1"],
    viz: "dijkstra",
    code: R`
import heapq
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        adj = defaultdict(list)
        for u, v, w in times:
            adj[u].append((v, w))
        dist = {}                                 # finalized shortest times
        heap = [(0, k)]
        while heap:
            t, u = heapq.heappop(heap)
            if u in dist:
                continue                          # already finalized with a smaller t
            dist[u] = t
            for v, w in adj[u]:
                if v not in dist:
                    heapq.heappush(heap, (t + w, v))
        return max(dist.values()) if len(dist) == n else -1`,
    tc: "O(E log E)", sc: "O(V + E)",
  },
  run: R`
s = Solution()
print(s.networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2))
print(s.networkDelayTime([[1, 2, 1]], 2, 1))
print(s.networkDelayTime([[1, 2, 1]], 2, 2))`,
  out: R`
2
1
-1`,
  dry: { h: ["pop", "finalize", "push"], r: [["(0, 2)", "dist[2] = 0", "(1, 1), (1, 3)"], ["(1, 1)", "dist[1] = 1", "—"], ["(1, 3)", "dist[3] = 1", "(2, 4)"], ["(2, 4)", "dist[4] = 2", "—"], ["", "all 4 reached → max = 2", ""]] },
  expl: [
    ["if u in dist: continue", "The first time a node is popped is its shortest distance, because of non-negative weights and the min-heap order."],
    ["max(dist.values())", "Everyone has the signal once the slowest node has it."],
  ],
  take: "**Single-source shortest path with non-negative weights → Dijkstra (min-heap).** Unweighted → BFS. Negative weights → Bellman-Ford.",
  mist: ["Using BFS on weighted edges.", "Not skipping stale heap entries."],
},
{
  id: "swim-in-rising-water", t: "Swim in Rising Water", lc: 778, d: "Hard", p: "Dijkstra (minimax path)",
  q: "An `n × n` grid holds elevations. At time `t`, the water depth everywhere is `t`, and you can swim between adjacent cells if both elevations are ≤ t. Return the minimum time to get from `(0, 0)` to `(n−1, n−1)`.",
  ex: [["grid = [[0,2],[1,3]]", "3", "You must wait until t = 3 to enter the last cell."], ["grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]", "16", ""]],
  c: ["1 ≤ n ≤ 50", "values are a permutation of 0..n²−1"],
  hint: "The cost of a path is the **maximum** elevation on it. Minimize that maximum: Dijkstra where a path's cost is `max(cost so far, next cell)` instead of a sum.",
  opt: {
    idea: "**Modified Dijkstra:** a min-heap of `(max_height_on_path, r, c)`. Pop the cell with the smallest path-max. Moving to a neighbour gives `max(current, grid[nr][nc])`. The first time you pop the bottom-right cell, that value is the answer.",
    steps: ["heap = [(grid[0][0], 0, 0)]; visited", "pop (t, r, c); if (r, c) is the target → t", "for each unvisited neighbour: push (max(t, grid[nr][nc]), nr, nc)"],
    code: R`
import heapq

class Solution:
    def swimInWater(self, grid: list[list[int]]) -> int:
        n = len(grid)
        heap = [(grid[0][0], 0, 0)]
        visited = {(0, 0)}
        while heap:
            t, r, c = heapq.heappop(heap)
            if (r, c) == (n - 1, n - 1):
                return t
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))
        return -1`,
    tc: "O(n² log n)", sc: "O(n²)",
  },
  run: R`
s = Solution()
print(s.swimInWater([[0, 2], [1, 3]]))
print(s.swimInWater([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]))`,
  out: R`
3
16`,
  dry: ["[[0,2],[1,3]]: pop (0,(0,0)) → push (2,(0,1)), (1,(1,0))", "pop (1,(1,0)) → push (3,(1,1))", "pop (2,(0,1)) → (1,1) already queued", "pop (3,(1,1)) = target → 3"],
  expl: [["max(t, grid[nr][nc])", "The \"distance\" is the bottleneck (the highest cell so far), not a sum. Dijkstra still works because max is monotonic."]],
  alt: { idea: "Binary search on t + BFS (\"can I reach the end using only cells ≤ t?\"), or Union-Find adding cells in increasing height order." },
  take: "**Minimize the maximum along a path (bottleneck path) → Dijkstra with max instead of +, or binary search on the answer + BFS.**",
  mist: ["Summing elevations instead of taking the max."],
},
{
  id: "alien-dictionary", t: "Alien Dictionary", lc: 269, d: "Hard", p: "Topological Sort (build graph from order)", prem: true,
  q: "An alien language uses lowercase English letters in an unknown order. You get a list of `words` sorted lexicographically by the alien rules. Return a string of the letters in a valid order. If the order is invalid, return `\"\"`. Any valid answer is accepted.",
  ex: [["words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]", "\"wertf\"", ""], ["words = [\"z\",\"x\"]", "\"zx\"", ""], ["words = [\"z\",\"x\",\"z\"]", "\"\"", "z < x and x < z is a contradiction (a cycle)."]],
  c: ["1 ≤ words ≤ 100"],
  hint: "Compare adjacent words. The **first** differing character gives an edge `a → b` (a comes before b). Then topologically sort the letters. Watch out for a prefix case like [\"abc\", \"ab\"], which is invalid.",
  opt: {
    idea: "1. Every letter that appears is a node.\n2. For each adjacent pair (w1, w2): find the first index where they differ and add the edge `w1[i] → w2[i]`. If there's no difference and `w1` is longer than `w2` → invalid (a longer word can't come before its own prefix).\n3. Kahn's topological sort. If not all letters can be output → there's a cycle → `\"\"`.",
    steps: ["adj = {c: set() for every letter}; indeg = {c: 0}", "for w1, w2 adjacent: first diff → edge; prefix violation → \"\"", "Kahn BFS over letters", "return order if complete else \"\""],
    code: R`
from collections import deque

class Solution:
    def alienOrder(self, words: list[str]) -> str:
        adj = {c: set() for w in words for c in w}
        indeg = {c: 0 for c in adj}
        for w1, w2 in zip(words, words[1:]):
            for a, b in zip(w1, w2):
                if a != b:
                    if b not in adj[a]:
                        adj[a].add(b)
                        indeg[b] += 1
                    break
            else:                                   # no differing char found
                if len(w1) > len(w2):
                    return ""                       # "abc" before "ab" is invalid
        q = deque(sorted(c for c in indeg if indeg[c] == 0))
        order = []
        while q:
            c = q.popleft()
            order.append(c)
            for nb in sorted(adj[c]):
                indeg[nb] -= 1
                if indeg[nb] == 0:
                    q.append(nb)
        return "".join(order) if len(order) == len(adj) else ""`,
    tc: "O(C)", tw: "C = total characters across all words.", sc: "O(1)", sw: "At most 26 letters and 26² edges.",
  },
  run: R`
s = Solution()
print(repr(s.alienOrder(["wrt", "wrf", "er", "ett", "rftt"])))
print(repr(s.alienOrder(["z", "x"])))
print(repr(s.alienOrder(["z", "x", "z"])))
print(repr(s.alienOrder(["abc", "ab"])))`,
  out: R`
'wertf'
'zx'
''
''`,
  dry: ["wrt vs wrf → t → f", "wrf vs er → w → e", "er vs ett → r → t", "ett vs rftt → e → r", "Edges: w→e→r→t→f → order \"wertf\""],
  expl: [
    ["for ... else:", "Python's for-else: the `else` runs only if the loop did **not** `break`, i.e. one word is a prefix of the other."],
    ["only the FIRST differing char", "Later characters give no information about the order."],
  ],
  take: "**Order derived from pairwise comparisons → build a graph from adjacent pairs + topological sort.**",
  mist: ["Adding edges for every differing position (only the first one counts).", "Missing the prefix-invalid case.", "Adding duplicate edges, which double-counts in-degree."],
},
{
  id: "cheapest-flights-within-k-stops", t: "Cheapest Flights Within K Stops", lc: 787, d: "Medium", p: "Bellman-Ford (limited edges)",
  q: "Given `n` cities and `flights[i] = [from, to, price]`, return the cheapest price from `src` to `dst` with **at most `k` stops** (so at most k+1 flights), or −1 if there's no such route.",
  ex: [["n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1", "700", "0 → 1 → 3. (0→1→2→3 costs 400 but uses 2 stops.)"], ["n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1", "200", ""], ["same, k = 0", "500", ""]],
  c: ["1 ≤ n ≤ 100", "0 ≤ k < n"],
  hint: "Plain Dijkstra ignores the stop limit. Bellman-Ford relaxes all edges once per round, and after round i the prices use at most i edges. Run exactly k+1 rounds.",
  opt: {
    idea: "**Bellman-Ford with k+1 iterations.** `prices[v]` = cheapest cost to reach v using at most i flights. Each round, relax every flight **using a copy** of the previous round's prices, so one round can't chain several flights together.",
    steps: ["prices = [inf] * n; prices[src] = 0", "repeat k + 1 times: tmp = prices.copy()", "for (u, v, p): if prices[u] + p < tmp[v]: tmp[v] = prices[u] + p", "prices = tmp", "return prices[dst] or −1"],
    code: R`
class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
        INF = float("inf")
        prices = [INF] * n
        prices[src] = 0
        for _ in range(k + 1):                   # at most k+1 flights
            tmp = prices.copy()
            for u, v, p in flights:
                if prices[u] != INF and prices[u] + p < tmp[v]:
                    tmp[v] = prices[u] + p       # read OLD prices, write NEW
            prices = tmp
        return -1 if prices[dst] == INF else prices[dst]`,
    tc: "O(k · E)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.findCheapestPrice(4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1))
print(s.findCheapestPrice(3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1))
print(s.findCheapestPrice(3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0))`,
  out: R`
700
200
500`,
  dry: { h: ["round (max flights)", "prices [0, 1, 2, 3]"], r: [["start", "[0, ∞, ∞, ∞]"], ["1", "[0, 100, ∞, ∞]"], ["2", "[0, 100, 200, 700] → answer 700 (k = 1)"]] },
  expl: [["tmp = prices.copy()", "Without the copy, a single round could use 0→1 and then 1→3 immediately, which exceeds the flight limit for that round."]],
  alt: { idea: "BFS/Dijkstra over states (node, stops used), pruning when stops > k." },
  take: "**Shortest path with a limit on the number of edges → Bellman-Ford for exactly (limit) rounds, using a copy per round.**",
  mist: ["Standard Dijkstra (finalizes the cheapest path even if it uses too many stops).", "Updating prices in place within a round."],
},
]);
