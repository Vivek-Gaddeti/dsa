NC.add("Graphs", [
{
  id: "number-of-islands", t: "Number of Islands", lc: 200, d: "Medium", p: "Grid DFS/BFS (flood fill)",
  q: "Given an `m × n` grid of `'1'` (land) and `'0'` (water), return the number of **islands**. An island is land connected horizontally or vertically and surrounded by water.",
  ex: [["grid = [\"11110\",\"11010\",\"11000\",\"00000\"]", "1", ""], ["grid = [\"11000\",\"11000\",\"00100\",\"00011\"]", "3", ""]],
  c: ["1 ≤ m, n ≤ 300"],
  hint: "Scan the grid. Every time you hit unvisited land, that's a new island. Flood-fill (DFS/BFS) it so you don't count it again.",
  opt: {
    idea: "For each cell: if it's `'1'` and unvisited, increment the count and **sink** the whole island with DFS/BFS (mark every connected land cell as visited, e.g. set it to `'0'`). Each cell is processed a constant number of times.",
    steps: ["count = 0", "for each (r, c): if grid[r][c] == '1': count += 1; bfs(r, c)", "bfs: queue; set the cell to '0' when enqueued; push land neighbours"],
    viz: "islands",
    code: R`
from collections import deque

class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        R, C = len(grid), len(grid[0])
        count = 0

        def bfs(r, c):
            q = deque([(r, c)])
            grid[r][c] = "0"                       # mark visited when enqueued
            while q:
                r, c = q.popleft()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == "1":
                        grid[nr][nc] = "0"
                        q.append((nr, nc))

        for r in range(R):
            for c in range(C):
                if grid[r][c] == "1":
                    count += 1
                    bfs(r, c)
        return count`,
    tc: "O(m·n)", sc: "O(min(m, n))", sw: "BFS queue width (DFS recursion could be O(m·n)).",
  },
  run: R`
s = Solution()
g1 = [list(r) for r in ["11110", "11010", "11000", "00000"]]
g2 = [list(r) for r in ["11000", "11000", "00100", "00011"]]
print(s.numIslands(g1))
print(s.numIslands(g2))`,
  out: R`
1
3`,
  dry: ["(0,0) is land → count 1, BFS sinks the 2×2 block", "(2,2) is land → count 2, sinks just itself", "(3,3) is land → count 3, sinks (3,3),(3,4)"],
  expl: [
    ["grid[r][c] = \"0\"", "Mark visited **when enqueuing**, not when popping, or the same cell can be enqueued many times."],
    ["for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):", "The 4-directional neighbour pattern you'll write a hundred times."],
  ],
  alt: { idea: "Recursive DFS (shorter, but deep recursion on a 300×300 all-land grid can hit Python's recursion limit):", code: R`
def dfs(r, c):
    if r < 0 or c < 0 or r >= R or c >= C or grid[r][c] != "1":
        return
    grid[r][c] = "0"
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)` },
  take: "**Count connected regions → loop over cells + flood fill (DFS/BFS) or Union-Find.**",
  mist: ["Marking visited at pop time (duplicates in the queue).", "Recursion depth errors with DFS in Python on big grids."],
},
{
  id: "clone-graph", t: "Clone Graph", lc: 133, d: "Medium", p: "Graph DFS + Hash Map",
  q: "Given a node in a connected undirected graph, return a **deep copy** of the graph. Each node has a `val` and a list of `neighbors`.",
  ex: [["adjList = [[2,4],[1,3],[2,4],[1,3]]", "same structure, new nodes", "A 4-cycle 1-2-3-4."]],
  c: ["0 ≤ nodes ≤ 100", "values are unique, 1..n"],
  hint: "Like Copy List with Random Pointer: map original → clone, and create clones when you first see a node so cycles don't loop forever.",
  opt: {
    idea: "DFS with a dict `clones`. `clone(node)`: if it's already cloned, return the clone (this handles cycles). Otherwise create a copy, **store it in the map first**, then clone each neighbour recursively and append it.",
    steps: ["clones = {}", "clone(n): if n in clones → return clones[n]", "copy = Node(n.val); clones[n] = copy", "for nb in n.neighbors: copy.neighbors.append(clone(nb))", "return copy"],
    code: R`
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

class Solution:
    def cloneGraph(self, node: "Node | None") -> "Node | None":
        clones = {}

        def clone(n):
            if n in clones:
                return clones[n]
            copy = Node(n.val)
            clones[n] = copy                 # register BEFORE recursing (cycles!)
            for nb in n.neighbors:
                copy.neighbors.append(clone(nb))
            return copy

        return clone(node) if node else None`,
    tc: "O(V + E)", sc: "O(V)",
  },
  run: R`
def build(adj):
    nodes = [Node(i + 1) for i in range(len(adj))]
    for i, nbs in enumerate(adj):
        nodes[i].neighbors = [nodes[j - 1] for j in nbs]
    return nodes[0] if nodes else None

def dump(start):
    seen, out, stack = {start}, {}, [start]
    while stack:
        n = stack.pop()
        out[n.val] = [x.val for x in n.neighbors]
        for x in n.neighbors:
            if x not in seen:
                seen.add(x); stack.append(x)
    return [out[k] for k in sorted(out)]

orig = build([[2, 4], [1, 3], [2, 4], [1, 3]])
copy = Solution().cloneGraph(orig)
print(dump(copy))
print("same object?", copy is orig)`,
  out: R`
[[2, 4], [1, 3], [2, 4], [1, 3]]
same object? False`,
  dry: ["clone(1): create 1', recurse on 2 → create 2', recurse on 1 → already cloned → return 1'", "2' recurses on 3 → 3' → recurses on 2 (done) and 4 → 4' → neighbours 1 (done), 3 (done)"],
  expl: [["clones[n] = copy  # before recursing", "If a neighbour points back to n, the recursion finds the clone instead of looping forever."]],
  take: "**Copying any graph or linked structure → hash map original → copy, registered before visiting neighbours.**",
  mist: ["Adding to the map after recursing (infinite recursion on cycles)."],
},
{
  id: "max-area-of-island", t: "Max Area of Island", lc: 695, d: "Medium", p: "Grid DFS (return size)",
  q: "Given a binary grid (1 = land), return the **area** (number of cells) of the largest island, or 0 if there's no land.",
  ex: [["grid with several islands", "6", ""], ["grid = [[0,0,0,0,0,0,0,0]]", "0", ""]],
  c: ["1 ≤ m, n ≤ 50"],
  hint: "Same as Number of Islands, but the flood fill **returns** how many cells it sank.",
  opt: {
    idea: "DFS that returns the area: 0 for water, out of bounds or visited; otherwise mark the cell and return `1 + dfs(4 neighbours)`. Take the max over all starting cells.",
    steps: ["dfs(r, c): invalid / water → 0", "grid[r][c] = 0 (visited)", "return 1 + sum of 4 dfs calls", "answer = max over cells"],
    code: R`
class Solution:
    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:
        R, C = len(grid), len(grid[0])

        def dfs(r, c):
            if r < 0 or c < 0 or r >= R or c >= C or grid[r][c] == 0:
                return 0
            grid[r][c] = 0                        # sink it
            return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)

        return max((dfs(r, c) for r in range(R) for c in range(C)), default=0)`,
    tc: "O(m·n)", sc: "O(m·n)", sw: "Worst-case recursion depth.",
  },
  run: R`
grid = [
    [0,0,1,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,1,1,0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,1,1,0,0,1,0,1,0,0],
    [0,1,0,0,1,1,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0],
]
s = Solution()
print(s.maxAreaOfIsland(grid))
print(s.maxAreaOfIsland([[0, 0, 0, 0, 0, 0, 0, 0]]))`,
  out: R`
6
0`,
  dry: ["The island at rows 3-5, cols 8-10 has cells (3,8),(3,10),(4,8),(4,9),(4,10),(5,10) → 6", "The others are smaller (4, 4, 5, …)"],
  expl: [["max(..., default=0)", "`default` avoids a ValueError on an empty sequence (not needed here, but it's a good habit)."]],
  take: "**Flood fill that returns an aggregate (size, perimeter, sum).**",
  mist: ["Forgetting to mark visited, which causes infinite recursion."],
},
{
  id: "pacific-atlantic-water-flow", t: "Pacific Atlantic Water Flow", lc: 417, d: "Medium", p: "Multi-source DFS (reverse flow)",
  q: "An `m × n` island has heights. The **Pacific** touches the top and left edges, and the **Atlantic** the bottom and right edges. Water flows from a cell to a neighbour with height ≤ its own. Return all cells from which water can reach **both** oceans.",
  ex: [["heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]", ""]],
  c: ["1 ≤ m, n ≤ 200"],
  hint: "Instead of asking \"where does water from this cell go?\" for every cell, go **backwards** from each ocean: climb to neighbours that are ≥ the current height.",
  brute: { idea: "Run a DFS from every cell to test whether it reaches both oceans: O((m·n)²).", tc: "O((m·n)²)", sc: "O(m·n)" },
  opt: {
    idea: "Two **reverse** searches:\n1. Start from every Pacific border cell and DFS uphill (to neighbours with height ≥ current). Everything reached can drain to the Pacific.\n2. Do the same from the Atlantic border.\n3. The answer is the intersection of the two visited sets.",
    steps: ["pac, atl = set(), set()", "dfs(r, c, visit, prev_h): skip if visited, out of bounds, or heights[r][c] < prev_h", "start pac DFS from row 0 and col 0; atl from row m−1 and col n−1", "return cells in both"],
    code: R`
class Solution:
    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:
        R, C = len(heights), len(heights[0])
        pac, atl = set(), set()

        def dfs(r, c, visit, prev):
            if (r, c) in visit or r < 0 or c < 0 or r >= R or c >= C or heights[r][c] < prev:
                return
            visit.add((r, c))
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                dfs(r + dr, c + dc, visit, heights[r][c])     # go uphill (reverse flow)

        for c in range(C):
            dfs(0, c, pac, 0)            # top edge -> Pacific
            dfs(R - 1, c, atl, 0)        # bottom edge -> Atlantic
        for r in range(R):
            dfs(r, 0, pac, 0)            # left edge -> Pacific
            dfs(r, C - 1, atl, 0)        # right edge -> Atlantic
        return sorted([r, c] for r, c in pac & atl)`,
    tc: "O(m·n)", tw: "Each cell is visited at most once per ocean.", sc: "O(m·n)",
  },
  run: R`
h = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
print(Solution().pacificAtlantic(h))`,
  out: R`
[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]`,
  dry: ["The Pacific set grows uphill from the top/left edges", "The Atlantic set grows uphill from the bottom/right edges", "e.g. (2,2) height 5 is reachable from both → included"],
  expl: [
    ["heights[r][c] < prev", "In reverse we may only move to cells at least as high (water could flow down from them)."],
    ["pac & atl", "Set intersection."],
  ],
  take: "**\"Which cells can reach the border/target?\" → start from the targets and search in reverse (multi-source).**",
  mist: ["Searching from every cell (quadratic)."],
},
{
  id: "surrounded-regions", t: "Surrounded Regions", lc: 130, d: "Medium", p: "Border DFS (reverse thinking)",
  q: "Given an `m × n` board of `'X'` and `'O'`, capture every region of `'O'` that is **completely surrounded** by `'X'` (flip it to `'X'`). `'O'` regions touching the border can't be captured. Modify the board in place.",
  ex: [["board = [[X,X,X,X],[X,O,O,X],[X,X,O,X],[X,O,X,X]]", "[[X,X,X,X],[X,X,X,X],[X,X,X,X],[X,O,X,X]]", "The bottom O touches the border, so it stays."]],
  c: ["1 ≤ m, n ≤ 200"],
  hint: "It's hard to know if a region is surrounded, but easy to know if it's **connected to the border**. Mark those safe first.",
  opt: {
    idea: "1. DFS from every border `'O'` and mark its whole region as safe (`'T'`).\n2. Sweep the board: remaining `'O'` → `'X'` (captured), and `'T'` → back to `'O'`.",
    steps: ["for border cells that are 'O': dfs mark 'T'", "for every cell: 'O' → 'X'", "for every cell: 'T' → 'O'"],
    code: R`
class Solution:
    def solve(self, board: list[list[str]]) -> None:
        R, C = len(board), len(board[0])

        def mark(r, c):
            if r < 0 or c < 0 or r >= R or c >= C or board[r][c] != "O":
                return
            board[r][c] = "T"                    # temporarily safe
            mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1)

        for r in range(R):
            for c in range(C):
                if (r in (0, R - 1) or c in (0, C - 1)) and board[r][c] == "O":
                    mark(r, c)
        for r in range(R):
            for c in range(C):
                if board[r][c] == "O":
                    board[r][c] = "X"            # surrounded -> capture
                elif board[r][c] == "T":
                    board[r][c] = "O"            # restore safe cells`,
    tc: "O(m·n)", sc: "O(m·n)",
  },
  run: R`
b = [list(r) for r in ["XXXX", "XOOX", "XXOX", "XOXX"]]
Solution().solve(b)
for row in b:
    print("".join(row))`,
  out: R`
XXXX
XXXX
XXXX
XOXX`,
  dry: ["The border 'O' at (3,1) → mark 'T'", "The interior O's at (1,1),(1,2),(2,2) are not connected to the border → become 'X'", "'T' → 'O'"],
  expl: [["r in (0, R - 1) or c in (0, C - 1)", "Cell is on the border."]],
  take: "**Complement trick: find what is NOT captured (border-connected) instead of what is.**",
  mist: ["Trying to check each region for \"surrounded\" directly. It's messy and error-prone."],
},
{
  id: "rotting-oranges", t: "Rotting Oranges", lc: 994, d: "Medium", p: "Multi-source BFS",
  q: "In a grid, `0` = empty, `1` = fresh orange, `2` = rotten orange. Every minute, fresh oranges adjacent (4 directions) to a rotten one become rotten. Return the minimum minutes until no fresh orange remains, or `-1` if that's impossible.",
  ex: [["grid = [[2,1,1],[1,1,0],[0,1,1]]", "4", ""], ["grid = [[2,1,1],[0,1,1],[1,0,1]]", "-1", "The bottom-left orange is never reached."], ["grid = [[0,2]]", "0", ""]],
  c: ["1 ≤ m, n ≤ 10"],
  hint: "All rotten oranges spread **simultaneously**. Start BFS with all of them in the queue. Each BFS level = one minute.",
  opt: {
    idea: "**Multi-source BFS.** Put every rotten orange in the queue and count the fresh ones. Process level by level: each level rots its fresh neighbours and takes 1 minute. Stop when the queue empties or no fresh oranges remain. If any fresh oranges are left → −1.",
    steps: ["q = all (r, c) with 2; fresh = count of 1s", "minutes = 0", "while q and fresh: for each in this level: rot neighbours (fresh −= 1, enqueue)", "minutes += 1", "return minutes if fresh == 0 else −1"],
    code: R`
from collections import deque

class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        R, C = len(grid), len(grid[0])
        q, fresh = deque(), 0
        for r in range(R):
            for c in range(C):
                if grid[r][c] == 2:
                    q.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1

        minutes = 0
        while q and fresh:
            for _ in range(len(q)):                  # one minute = one BFS level
                r, c = q.popleft()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1
        return minutes if fresh == 0 else -1`,
    tc: "O(m·n)", sc: "O(m·n)",
  },
  run: R`
s = Solution()
print(s.orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]))
print(s.orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]))
print(s.orangesRotting([[0, 2]]))`,
  out: R`
4
-1
0`,
  dry: { h: ["minute", "newly rotten"], r: [[1, "(0,1), (1,0)"], [2, "(0,2), (1,1)"], [3, "(2,1)"], [4, "(2,2)"], ["", "fresh = 0 → answer 4"]] },
  expl: [
    ["while q and fresh:", "Stopping when fresh hits 0 avoids counting an extra minute for the last level."],
    ["for _ in range(len(q)):", "Level-by-level BFS: everything in the queue right now rots simultaneously."],
  ],
  take: "**Simultaneous spreading from many starts (fire, infection, distance to nearest X) → multi-source BFS.**",
  mist: ["Running a separate BFS from each rotten orange.", "Off-by-one minute counting."],
},
{
  id: "walls-and-gates", t: "Walls and Gates", lc: 286, d: "Medium", p: "Multi-source BFS", prem: true,
  q: "A grid has `-1` (wall), `0` (gate) and `INF = 2147483647` (empty room). Fill each empty room with the distance to its **nearest gate**. Leave it as INF if no gate is reachable. Modify in place.",
  ex: [["rooms = [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]]", "[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]", ""]],
  c: ["1 ≤ m, n ≤ 250"],
  hint: "Same as Rotting Oranges: start BFS from **all gates** at once. The first time BFS reaches a room is its shortest distance.",
  opt: {
    idea: "Enqueue all gates. BFS outward. When you reach an INF room from a cell at distance d, set it to d + 1 and enqueue it. Rooms are filled in increasing distance order, so the first write is the minimum.",
    steps: ["q = all gates", "pop (r, c); for neighbours with INF: rooms[n] = rooms[r][c] + 1; enqueue"],
    code: R`
from collections import deque

class Solution:
    def wallsAndGates(self, rooms: list[list[int]]) -> None:
        INF = 2147483647
        R, C = len(rooms), len(rooms[0])
        q = deque((r, c) for r in range(R) for c in range(C) if rooms[r][c] == 0)
        while q:
            r, c = q.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and rooms[nr][nc] == INF:
                    rooms[nr][nc] = rooms[r][c] + 1      # first visit = shortest
                    q.append((nr, nc))`,
    tc: "O(m·n)", sc: "O(m·n)",
  },
  run: R`
INF = 2147483647
rooms = [[INF, -1, 0, INF], [INF, INF, INF, -1], [INF, -1, INF, -1], [0, -1, INF, INF]]
Solution().wallsAndGates(rooms)
for row in rooms:
    print(row)`,
  out: R`
[3, -1, 0, 1]
[2, 2, 1, -1]
[1, -1, 2, -1]
[0, -1, 3, 4]`,
  dry: ["Start: gates (0,2) and (3,0)", "Distance 1: (0,3), (1,2), (2,0)", "Distance 2: (1,1), (2,2), (1,0)", "… until the queue is empty"],
  expl: [["rooms[nr][nc] == INF", "Doubles as the \"not visited\" check: walls (−1) and visited rooms are skipped."]],
  take: "**Distance to the nearest of many sources → multi-source BFS from all sources at once** (not BFS from each room).",
  mist: ["BFS from each empty room: O((m·n)²)."],
},
{
  id: "course-schedule", t: "Course Schedule", lc: 207, d: "Medium", p: "Topological Sort / Cycle Detection",
  q: "There are `numCourses` courses (0..n−1). `prerequisites[i] = [a, b]` means you must take `b` before `a`. Can you finish all courses?",
  ex: [["numCourses = 2, prerequisites = [[1,0]]", "True", "Take 0 then 1."], ["numCourses = 2, prerequisites = [[1,0],[0,1]]", "False", "A cycle: each needs the other."]],
  c: ["1 ≤ numCourses ≤ 2000", "≤ 5000 prerequisites"],
  hint: "Model it as a directed graph b → a. It's possible exactly when the graph has **no cycle**.",
  opt: {
    idea: "**Kahn's algorithm (BFS topological sort):** compute in-degrees. Start with the courses that have in-degree 0 (no prerequisites). Taking a course removes its outgoing edges, so its dependents' in-degrees drop, and any that reach 0 join the queue.\n\nIf we manage to take all n courses → no cycle → True.",
    steps: ["graph[b].append(a); indeg[a] += 1", "q = courses with indeg 0", "pop u; taken += 1; for v in graph[u]: indeg[v] −= 1; if 0 → push", "return taken == numCourses"],
    viz: "topoSort",
    code: R`
from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)                 # b must come before a
            indeg[a] += 1

        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        taken = 0
        while q:
            u = q.popleft()
            taken += 1
            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return taken == numCourses             # leftovers are stuck in a cycle`,
    tc: "O(V + E)", sc: "O(V + E)",
  },
  run: R`
s = Solution()
print(s.canFinish(2, [[1, 0]]))
print(s.canFinish(2, [[1, 0], [0, 1]]))
print(s.canFinish(4, [[1, 0], [2, 1], [3, 2]]))`,
  out: R`
True
False
True`,
  dry: ["[[1,0],[0,1]]: indeg = [1, 1] → no course with 0 → queue empty → taken = 0 ≠ 2 → False"],
  expl: [
    ["graph[b].append(a)", "The edge points from the prerequisite to the course that depends on it."],
    ["taken == numCourses", "Nodes in a cycle never reach in-degree 0."],
  ],
  alt: { idea: "DFS with 3 colours (0 = unvisited, 1 = visiting, 2 = done). Reaching a \"visiting\" node again means a cycle.", code: R`
class Solution:
    def canFinish(self, n, prereq):
        graph = [[] for _ in range(n)]
        for a, b in prereq:
            graph[b].append(a)
        state = [0] * n
        def has_cycle(u):
            if state[u] == 1: return True      # back edge
            if state[u] == 2: return False
            state[u] = 1
            if any(has_cycle(v) for v in graph[u]): return True
            state[u] = 2
            return False
        return not any(has_cycle(u) for u in range(n))` },
  take: "**Dependencies / ordering constraints → directed graph → topological sort. \"Is it possible?\" = \"is the graph acyclic?\"**",
  mist: ["Reversing the edge direction (it still detects cycles, but the order is wrong for Course Schedule II)."],
},
{
  id: "course-schedule-ii", t: "Course Schedule II", lc: 210, d: "Medium", p: "Topological Sort (Kahn)",
  q: "Same setup as Course Schedule, but return **an order** in which you can take all courses. If it's impossible, return `[]`.",
  ex: [["numCourses = 2, prerequisites = [[1,0]]", "[0, 1]", ""], ["numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", "[0, 1, 2, 3]", "[0,2,1,3] is also valid."], ["numCourses = 1, prerequisites = []", "[0]", ""]],
  c: ["1 ≤ numCourses ≤ 2000"],
  hint: "Kahn's algorithm already produces the order: the sequence in which nodes leave the queue.",
  opt: {
    idea: "Run Kahn's BFS and append each popped course to `order`. If `len(order) == numCourses`, return it; otherwise there's a cycle → `[]`.",
    steps: ["Build graph and in-degrees", "q = in-degree-0 courses", "pop → append to order → decrement neighbours", "return order if complete else []"],
    viz: "topoSort",
    code: R`
from collections import deque

class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        order = []
        while q:
            u = q.popleft()
            order.append(u)
            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return order if len(order) == numCourses else []`,
    tc: "O(V + E)", sc: "O(V + E)",
  },
  run: R`
s = Solution()
print(s.findOrder(2, [[1, 0]]))
print(s.findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))
print(s.findOrder(1, []))
print(s.findOrder(2, [[0, 1], [1, 0]]))`,
  out: R`
[0, 1]
[0, 1, 2, 3]
[0]
[]`,
  dry: { h: ["pop", "decrement", "queue after", "order"], r: [[0, "1→0, 2→0", "[1, 2]", "[0]"], [1, "3→1", "[2]", "[0, 1]"], [2, "3→0", "[3]", "[0, 1, 2]"], [3, "—", "[]", "[0, 1, 2, 3]"]] },
  expl: [["order.append(u)", "The pop order is a valid topological order: every course appears after all its prerequisites."]],
  take: "**Topological order = BFS by in-degree (Kahn) or reversed DFS post-order.**",
  mist: ["Returning a partial order when a cycle exists."],
},
{
  id: "redundant-connection", t: "Redundant Connection", lc: 684, d: "Medium", p: "Union-Find (cycle detection)",
  q: "A tree with nodes 1..n had **one extra edge** added. Given the `edges` list, return an edge that can be removed so the result is a tree again. If there are several answers, return the one that appears **last** in the input.",
  ex: [["edges = [[1,2],[1,3],[2,3]]", "[2, 3]", ""], ["edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", "[1, 4]", ""]],
  c: ["3 ≤ n ≤ 1000"],
  hint: "Add edges one by one. The first edge whose endpoints are **already connected** closes a cycle, so it's redundant.",
  opt: {
    idea: "**Union-Find (Disjoint Set Union).** Each node starts as its own group. For each edge (a, b): if `find(a) == find(b)`, they're already connected and this edge creates a cycle → return it. Otherwise `union(a, b)`.\n\nPath compression + union by rank make each operation almost O(1).",
    steps: ["parent[i] = i, rank[i] = 0", "find(x): follow parents to the root (compress along the way)", "for (a, b): if find(a) == find(b) → return [a, b]", "else union"],
    viz: "unionFind",
    code: R`
class Solution:
    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:
        n = len(edges)
        parent = list(range(n + 1))
        rank = [0] * (n + 1)

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]   # path compression (halving)
                x = parent[x]
            return x

        def union(a, b):
            ra, rb = find(a), find(b)
            if ra == rb:
                return False                    # already connected -> cycle
            if rank[ra] < rank[rb]:
                ra, rb = rb, ra
            parent[rb] = ra                     # attach smaller tree under bigger
            if rank[ra] == rank[rb]:
                rank[ra] += 1
            return True

        for a, b in edges:
            if not union(a, b):
                return [a, b]
        return []`,
    tc: "O(n · α(n)) ≈ O(n)", tw: "α is the inverse Ackermann function, ≤ 4 for any practical n.", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.findRedundantConnection([[1, 2], [1, 3], [2, 3]]))
print(s.findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]))`,
  out: R`
[2, 3]
[1, 4]`,
  dry: ["union(1,2) ✓, union(1,3) ✓ → {1,2,3} in one group", "edge (2,3): find(2) == find(3) → cycle → return [2, 3]"],
  expl: [
    ["parent[x] = parent[parent[x]]", "Path halving: each lookup flattens the tree, so future finds are faster."],
    ["if rank[ra] < rank[rb]: swap", "Union by rank keeps trees shallow."],
  ],
  take: "**Dynamic connectivity / \"does this edge create a cycle\" in an undirected graph → Union-Find.**",
  mist: ["Forgetting path compression (it degrades to O(n) per find)."],
},
{
  id: "number-of-connected-components-in-an-undirected-graph", t: "Number of Connected Components in an Undirected Graph", lc: 323, d: "Medium", p: "Union-Find / DFS", prem: true,
  q: "Given `n` nodes (0..n−1) and a list of undirected `edges`, return the number of **connected components**.",
  ex: [["n = 5, edges = [[0,1],[1,2],[3,4]]", "2", "{0,1,2} and {3,4}"], ["n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", "1", ""]],
  c: ["1 ≤ n ≤ 2000"],
  hint: "Start with n components. Every successful union (merging two different groups) reduces the count by one.",
  opt: {
    idea: "Union-Find. `components = n`. For every edge, if its endpoints are in different groups, union them and decrement `components`.",
    steps: ["components = n", "for (a, b): if union(a, b) succeeds → components −= 1", "return components"],
    code: R`
class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        components = n
        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra != rb:
                parent[rb] = ra
                components -= 1          # two groups merged into one
        return components`,
    tc: "O(E · α(n))", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.countComponents(5, [[0, 1], [1, 2], [3, 4]]))
print(s.countComponents(5, [[0, 1], [1, 2], [2, 3], [3, 4]]))`,
  out: R`
2
1`,
  dry: ["start 5", "(0,1) merge → 4", "(1,2) merge → 3", "(3,4) merge → 2"],
  expl: [["components -= 1", "Only when the roots differ. An edge inside an existing group changes nothing."]],
  alt: { idea: "DFS/BFS: count how many times you start a new traversal from an unvisited node (like Number of Islands on an adjacency list)." },
  take: "**Count groups → Union-Find (components = n − successful unions) or count DFS starts.**",
  mist: ["Counting distinct values in `parent` without calling find (the parents aren't fully compressed)."],
},
{
  id: "graph-valid-tree", t: "Graph Valid Tree", lc: 261, d: "Medium", p: "Union-Find / DFS", prem: true,
  q: "Given `n` nodes (0..n−1) and a list of undirected edges, determine whether these edges form a **valid tree**.",
  ex: [["n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", "True", ""], ["n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", "False", "1-2-3 forms a cycle."]],
  c: ["1 ≤ n ≤ 2000"],
  hint: "A tree on n nodes has exactly **n − 1 edges** and is **connected**, or equivalently, has no cycle.",
  opt: {
    idea: "Two checks:\n1. `len(edges) == n − 1`. Otherwise it can't be a tree.\n2. No edge closes a cycle (Union-Find). With exactly n−1 edges and no cycle, the graph must be connected.",
    steps: ["if len(edges) != n − 1 → False", "for each edge: if find(a) == find(b) → False (cycle); else union", "return True"],
    code: R`
class Solution:
    def validTree(self, n: int, edges: list[list[int]]) -> bool:
        if len(edges) != n - 1:
            return False
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra == rb:
                return False             # cycle
            parent[rb] = ra
        return True                      # n-1 edges + acyclic => connected tree`,
    tc: "O(n · α(n))", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]))
print(s.validTree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]))
print(s.validTree(4, [[0, 1], [2, 3]]))`,
  out: R`
True
False
False`,
  dry: ["Third case: 2 edges ≠ 4 − 1 → False immediately (disconnected)"],
  expl: [["len(edges) != n - 1", "A cheap necessary condition that also guarantees connectivity once cycles are ruled out."]],
  take: "**Tree ⟺ connected + acyclic ⟺ n − 1 edges + acyclic.**",
  mist: ["Only checking for cycles (a disconnected forest passes)."],
},
{
  id: "word-ladder", t: "Word Ladder", lc: 127, d: "Hard", p: "BFS (shortest path, implicit graph)",
  q: "Transform `beginWord` into `endWord` by changing **one letter at a time**, and every intermediate word must be in `wordList`. Return the number of words in the **shortest** transformation sequence (including both ends), or 0 if impossible.",
  ex: [["begin = \"hit\", end = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", "5", "hit → hot → dot → dog → cog"], ["same, but wordList without \"cog\"", "0", ""]],
  c: ["1 ≤ word length ≤ 10", "≤ 5000 words"],
  hint: "Words are nodes, and one-letter differences are edges. \"Shortest\" in an unweighted graph means BFS. Find neighbours quickly using **patterns** like `h*t`.",
  opt: {
    idea: "Build buckets keyed by wildcard patterns: `\"hot\"` belongs to `\"*ot\"`, `\"h*t\"`, `\"ho*\"`. Two words are neighbours if they share a pattern.\n\nBFS from `beginWord`, level by level, counting the steps. For each word, look through its patterns' buckets for unvisited words. Reaching `endWord` → return its level.",
    steps: ["if endWord not in list → 0", "buckets[pattern] = list of words", "BFS: q = [begin], visited = {begin}, steps = 1", "for each word in the level: if it's end → return steps; for each pattern: enqueue unvisited words", "steps += 1"],
    code: R`
from collections import defaultdict, deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        if endWord not in wordList:
            return 0
        L = len(beginWord)
        buckets = defaultdict(list)
        for w in wordList:
            for i in range(L):
                buckets[w[:i] + "*" + w[i + 1:]].append(w)

        q, visited, steps = deque([beginWord]), {beginWord}, 1
        while q:
            for _ in range(len(q)):
                word = q.popleft()
                if word == endWord:
                    return steps
                for i in range(L):
                    for nb in buckets[word[:i] + "*" + word[i + 1:]]:
                        if nb not in visited:
                            visited.add(nb)
                            q.append(nb)
            steps += 1
        return 0`,
    tc: "O(N · L²)", tw: "N words × L patterns × O(L) to build each pattern string.", sc: "O(N · L²)",
  },
  run: R`
s = Solution()
words = ["hot", "dot", "dog", "lot", "log", "cog"]
print(s.ladderLength("hit", "cog", words))
print(s.ladderLength("hit", "cog", words[:-1]))`,
  out: R`
5
0`,
  dry: { h: ["level (steps)", "words"], r: [[1, "hit"], [2, "hot"], [3, "dot, lot"], [4, "dog, log"], [5, "cog ✓"]] },
  expl: [
    ["w[:i] + \"*\" + w[i + 1:]", "Replace position i with a wildcard. Words sharing the result differ only at i."],
    ["visited.add(nb) when enqueuing", "Standard BFS: mark visited when you enqueue."],
  ],
  take: "**Shortest number of steps in an unweighted (often implicit) graph → BFS.** Pre-bucket neighbours to avoid O(N²) comparisons.",
  mist: ["Comparing every pair of words (O(N²·L)).", "Using DFS (it doesn't give the shortest path)."],
},
]);
