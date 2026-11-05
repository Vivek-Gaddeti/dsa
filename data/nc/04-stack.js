NC.add("Stack", [
{
  id: "valid-parentheses", t: "Valid Parentheses", lc: 20, d: "Easy", p: "Stack (matching pairs)",
  q: "Given a string `s` containing only `()[]{}`, decide whether it is **valid**: every opening bracket is closed by the same type, brackets close in the correct order, and every closing bracket has a matching opener.",
  ex: [["s = \"()[]{}\"", "True", ""], ["s = \"(]\"", "False", ""], ["s = \"([])\"", "True", "Nested correctly."], ["s = \"([)]\"", "False", "Closed in the wrong order."]],
  c: ["1 ≤ len(s) ≤ 10^4"],
  hint: "The most recently opened bracket must be the first one closed: Last In, First Out.",
  brute: {
    idea: "Repeatedly delete adjacent pairs `()`, `[]`, `{}` until nothing changes. Valid strings shrink to empty.",
    code: R`
class Solution:
    def isValid(self, s: str) -> bool:
        prev = None
        while prev != s:
            prev = s
            s = s.replace("()", "").replace("[]", "").replace("{}", "")
        return s == ""`,
    tc: "O(n²)", sc: "O(n)", bad: "Each pass is O(n) and there can be n/2 passes.",
  },
  opt: {
    idea: "Scan left to right with a stack of open brackets.\n- Opening bracket → push.\n- Closing bracket → the stack top must be its matching opener, so pop it. If the stack is empty or the top doesn't match → invalid.\n\nAt the end the stack must be empty (no unclosed openers).",
    steps: ["`pairs = {')': '(', ']': '[', '}': '{'}`", "for c in s: if c is a closer: check `stack and stack[-1] == pairs[c]`, then pop; else push c", "return `not stack`"],
    code: R`
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []
        for c in s:
            if c in pairs:                              # closing bracket
                if not stack or stack[-1] != pairs[c]:
                    return False
                stack.pop()
            else:                                       # opening bracket
                stack.append(c)
        return not stack                                # leftovers = unclosed`,
    tc: "O(n)", sc: "O(n)",
  },
  run: R`
s = Solution()
for t in ["()[]{}", "(]", "([])", "([)]", "(("]:
    print(t, s.isValid(t))`,
  out: R`
()[]{} True
(] False
([]) True
([)] False
(( False`,
  dryOn: "\"([)]\"",
  dry: { h: ["char", "action", "stack"], r: [["(", "push", "["], ["[", "push", "( ["], [")", "top is '[' but need '(' → **False**", ""]] },
  expl: [
    ["pairs = {\")\": \"(\", ...}", "Map each closer to its opener. Checking `c in pairs` tells us it's a closer."],
    ["if not stack or stack[-1] != pairs[c]:", "Closer with nothing open, or the wrong type on top."],
    ["return not stack", "An empty list is falsy. `not stack` is True only when everything was closed."],
  ],
  take: "**Nested / matching structure → stack.** It works for brackets, HTML tags, undo operations and expression parsing.",
  mist: ["Returning `True` at the end without checking the stack is empty (\"((\" would pass)."],
},
{
  id: "min-stack", t: "Min Stack", lc: 155, d: "Medium", p: "Stack (auxiliary min stack)",
  q: "Design a stack that supports `push(val)`, `pop()`, `top()` and `getMin()`, **all in O(1) time**.",
  ex: [["push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()", "-3, 0, -2", ""]],
  c: ["pop/top/getMin are only called on non-empty stacks"],
  hint: "When you push, what is the minimum of the stack *at that moment*? Store it alongside the value so it's restored automatically when you pop.",
  brute: {
    idea: "A normal list, and `getMin` scans the whole list.",
    code: R`
class MinStack:
    def __init__(self):
        self.st = []
    def push(self, val: int) -> None:
        self.st.append(val)
    def pop(self) -> None:
        self.st.pop()
    def top(self) -> int:
        return self.st[-1]
    def getMin(self) -> int:
        return min(self.st)         # O(n)`,
    tc: "getMin O(n)", sc: "O(n)", bad: "Violates the O(1) requirement.",
  },
  opt: {
    idea: "Keep a second stack `mins` where `mins[i]` = the minimum of `stack[0..i]`. On push, append `min(val, mins[-1])`. On pop, pop both. `getMin` is just `mins[-1]`.",
    steps: ["push(v): stack.append(v); mins.append(v if not mins else min(v, mins[-1]))", "pop(): stack.pop(); mins.pop()", "top(): stack[-1]", "getMin(): mins[-1]"],
    code: R`
class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []          # mins[i] = min of stack[0..i]

    def push(self, val: int) -> None:
        self.stack.append(val)
        self.mins.append(val if not self.mins else min(val, self.mins[-1]))

    def pop(self) -> None:
        self.stack.pop()
        self.mins.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.mins[-1]`,
    tc: "O(1) every operation", sc: "O(n)",
  },
  run: R`
ms = MinStack()
ms.push(-2); ms.push(0); ms.push(-3)
print(ms.getMin())
ms.pop()
print(ms.top())
print(ms.getMin())`,
  out: R`
-3
0
-2`,
  dry: { h: ["operation", "stack", "mins", "returns"], r: [["push(−2)", "[−2]", "[−2]", ""], ["push(0)", "[−2, 0]", "[−2, −2]", ""], ["push(−3)", "[−2, 0, −3]", "[−2, −2, −3]", ""], ["getMin", "", "", "−3"], ["pop", "[−2, 0]", "[−2, −2]", ""], ["top", "", "", "0"], ["getMin", "", "", "−2"]] },
  expl: [
    ["self.mins.append(val if not self.mins else min(val, self.mins[-1]))", "Each level remembers the min up to that level. Popping restores the previous min for free."],
  ],
  take: "**Need an aggregate (min/max) of a stack in O(1) → store the aggregate alongside each element.**",
  mist: ["Only pushing to `mins` when val ≤ current min, then forgetting to pop it correctly with duplicates."],
},
{
  id: "evaluate-reverse-polish-notation", t: "Evaluate Reverse Polish Notation", lc: 150, d: "Medium", p: "Stack (expression evaluation)",
  q: "Evaluate an arithmetic expression given in **Reverse Polish Notation** (operators come after their operands), e.g. `[\"2\",\"1\",\"+\",\"3\",\"*\"]` means (2 + 1) × 3.\n\nOperators are `+ - * /`. Division **truncates toward zero**.",
  ex: [["tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]", "9", "(2 + 1) × 3"], ["tokens = [\"4\",\"13\",\"5\",\"/\",\"+\"]", "6", "4 + 13/5 = 4 + 2"], ["tokens = [\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]", "22", ""]],
  c: ["valid expression", "result fits in 32-bit int"],
  hint: "Numbers wait on a stack. When an operator comes, it applies to the two most recent numbers.",
  opt: {
    idea: "Push numbers. On an operator, pop `b` (top) and then `a`, compute `a op b`, and push the result. Order matters for `-` and `/`.\n\nPython's `//` floors toward −∞ (`-7 // 2 = -4`), but we need truncation toward 0, so use `int(a / b)`.",
    steps: ["for each token: if operator → b = pop(), a = pop(), push(a op b)", "else push(int(token))", "return stack[0]"],
    code: R`
class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = []
        for tok in tokens:
            if tok in "+-*/" and len(tok) == 1:     # "-11" is a number, not an operator
                b, a = stack.pop(), stack.pop()     # b is on top!
                if tok == "+":
                    stack.append(a + b)
                elif tok == "-":
                    stack.append(a - b)
                elif tok == "*":
                    stack.append(a * b)
                else:
                    stack.append(int(a / b))        # truncate toward zero
            else:
                stack.append(int(tok))
        return stack[0]`,
    tc: "O(n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.evalRPN(["2", "1", "+", "3", "*"]))
print(s.evalRPN(["4", "13", "5", "/", "+"]))
print(s.evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]))`,
  out: R`
9
6
22`,
  dryOn: "[\"4\",\"13\",\"5\",\"/\",\"+\"]",
  dry: { h: ["token", "stack after"], r: [["4", "[4]"], ["13", "[4, 13]"], ["5", "[4, 13, 5]"], ["/", "13/5 → 2 → [4, 2]"], ["+", "4+2 → [6]"]] },
  expl: [
    ["b, a = stack.pop(), stack.pop()", "The first pop is the **right** operand."],
    ["int(a / b)", "True division then int() truncates toward zero: int(-6/132) = 0, while -6 // 132 = -1."],
    ["len(tok) == 1", "Negative numbers like \"-11\" start with '-', so make sure an operator is a single character."],
  ],
  take: "**Postfix evaluation = stack of operands.** Watch operand order and Python's floor-division semantics.",
  mist: ["`a // b` for negatives gives the wrong answer.", "Swapping a and b."],
},
{
  id: "generate-parentheses", t: "Generate Parentheses", lc: 22, d: "Medium", p: "Backtracking (with constraints)",
  q: "Given `n` pairs of parentheses, generate **all** combinations of well-formed parentheses.",
  ex: [["n = 3", "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]", ""], ["n = 1", "[\"()\"]", ""]],
  c: ["1 ≤ n ≤ 8"],
  hint: "Build the string one char at a time. You can add `(` while `open < n`. You can add `)` only while `close < open`.",
  brute: {
    idea: "Generate all 2^(2n) strings of '(' and ')' and keep the valid ones.",
    code: R`
from itertools import product

class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        def valid(s):
            bal = 0
            for c in s:
                bal += 1 if c == "(" else -1
                if bal < 0:
                    return False
            return bal == 0
        return [s for s in ("".join(p) for p in product("()", repeat=2 * n)) if valid(s)]`,
    tc: "O(2^(2n) · n)", sc: "O(n)",
  },
  opt: {
    idea: "Backtracking that only ever builds **valid prefixes**:\n- add `(` if `open < n`\n- add `)` if `close < open` (there's an unmatched `(` to close)\n\nWhen the length reaches 2n, record the string. No invalid branch is ever explored.",
    steps: ["bt(open, close, path)", "if len(path) == 2n: record", "if open < n: bt(open+1, close, path + '(')", "if close < open: bt(open, close+1, path + ')')"],
    code: R`
class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        res = []

        def bt(open_, close, path):
            if len(path) == 2 * n:
                res.append("".join(path))
                return
            if open_ < n:
                path.append("(")
                bt(open_ + 1, close, path)
                path.pop()                 # undo choice
            if close < open_:
                path.append(")")
                bt(open_, close + 1, path)
                path.pop()

        bt(0, 0, [])
        return res`,
    tc: "O(4ⁿ / √n)", tw: "That's the n-th Catalan number of results, each of length 2n.", sc: "O(n)", sw: "Recursion depth 2n.",
  },
  run: R`
s = Solution()
print(s.generateParenthesis(3))
print(s.generateParenthesis(1))`,
  out: R`
['((()))', '(()())', '(())()', '()(())', '()()()']
['()']`,
  dryOn: "n = 2",
  dry: ["\"\" → \"(\" → \"((\" → \"(()\" → \"(())\" ✓", "backtrack to \"(\" → \"()\" → \"()(\" → \"()()\" ✓", "Result: [\"(())\", \"()()\"]"],
  expl: [
    ["if open_ < n:", "We can still open one more."],
    ["if close < open_:", "Never close more than we've opened, which keeps every prefix valid."],
    ["path.pop()", "Backtrack: undo the choice before trying the next option."],
  ],
  take: "**Generate all valid configurations → backtracking with pruning rules that keep the partial answer valid.**",
  mist: ["Generating everything and filtering (exponentially more work)."],
},
{
  id: "daily-temperatures", t: "Daily Temperatures", lc: 739, d: "Medium", p: "Monotonic Stack (next greater element)",
  q: "Given `temperatures`, return `answer` where `answer[i]` is the number of days you must wait after day `i` for a **warmer** temperature. Use 0 if no warmer day comes.",
  ex: [["temperatures = [73,74,75,71,69,72,76,73]", "[1, 1, 4, 2, 1, 1, 0, 0]", ""], ["temperatures = [30,40,50,60]", "[1, 1, 1, 0]", ""]],
  c: ["1 ≤ n ≤ 10^5"],
  hint: "Keep the days that are still waiting for a warmer day on a stack. When a warm day arrives, it resolves every colder day on top.",
  brute: {
    idea: "For each day, scan forward until a warmer day.",
    code: R`
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        n = len(temperatures)
        ans = [0] * n
        for i in range(n):
            for j in range(i + 1, n):
                if temperatures[j] > temperatures[i]:
                    ans[i] = j - i
                    break
        return ans`,
    tc: "O(n²)", sc: "O(1)",
  },
  opt: {
    idea: "A **monotonic decreasing stack** of indices of unresolved days. For each new day `i`: while today is warmer than the day on top of the stack, pop that day `j` and set `ans[j] = i − j`. Then push `i`.",
    steps: ["stack = []", "for i, t: while stack and temps[stack[-1]] < t: j = pop; ans[j] = i − j", "push i"],
    viz: "monoStack",
    code: R`
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        ans = [0] * len(temperatures)
        stack = []                                   # indices waiting for a warmer day
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                ans[j] = i - j
            stack.append(i)
        return ans`,
    tc: "O(n)", tw: "Each index is pushed once and popped once.", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]))
print(s.dailyTemperatures([30, 40, 50, 60]))`,
  out: R`
[1, 1, 4, 2, 1, 1, 0, 0]
[1, 1, 1, 0]`,
  dryOn: "[73,74,75,71,69,72,76,73] (stack shows temps)",
  dry: { h: ["i", "temp", "pops (resolved)", "stack after"], r: [[0, 73, "—", "[73]"], [1, 74, "73 → ans[0]=1", "[74]"], [2, 75, "74 → ans[1]=1", "[75]"], [3, 71, "—", "[75, 71]"], [4, 69, "—", "[75, 71, 69]"], [5, 72, "69 → 1, 71 → 2", "[75, 72]"], [6, 76, "72 → 1, 75 → 4", "[76]"], [7, 73, "—", "[76, 73]"]] },
  expl: [
    ["while stack and temperatures[stack[-1]] < t:", "Today answers every colder day still waiting on top."],
    ["ans[j] = i - j", "The distance in days."],
    ["stack.append(i)", "Today now waits for its own warmer day. Leftovers keep answer 0."],
  ],
  take: "**Next greater / next smaller element → monotonic stack.** Decreasing stack for \"next greater\", increasing stack for \"next smaller\".",
  mist: ["Pushing values instead of indices (you need the distance)."],
},
{
  id: "car-fleet", t: "Car Fleet", lc: 853, d: "Medium", p: "Sort + Stack",
  q: "`n` cars drive toward a destination `target` on a one-lane road. Car `i` starts at `position[i]` with speed `speed[i]`. A car can't pass the one ahead; when it catches up, they move together as one **fleet** at the slower speed.\n\nHow many fleets arrive at the destination?",
  ex: [["target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]", "3", "Cars at 10 & 8 meet at 12; car at 0 alone; cars at 5 & 3 meet at 6."], ["target = 10, position = [3], speed = [3]", "1", ""]],
  c: ["1 ≤ n ≤ 10^5", "positions are unique"],
  hint: "Sort cars by position, closest to the target first. Compute each car's arrival time if it were alone. A car behind that would arrive *sooner* (or at the same time) gets blocked and joins the fleet ahead.",
  opt: {
    idea: "Process cars from closest-to-target to farthest. The time to arrive alone is `(target − pos) / speed`.\n\nKeep a stack of fleet arrival times. If the current car's time is **≤** the time of the fleet just ahead (stack top), it catches up and merges, so don't push. Otherwise it's slower and forms a **new fleet**, so push its time.",
    steps: ["pairs = sorted(zip(position, speed), reverse=True)", "for pos, spd: t = (target − pos) / spd", "if not stack or t > stack[-1]: stack.append(t)", "return len(stack)"],
    code: R`
class Solution:
    def carFleet(self, target: int, position: list[int], speed: list[int]) -> int:
        cars = sorted(zip(position, speed), reverse=True)   # closest to target first
        stack = []                                          # arrival times of fleets
        for pos, spd in cars:
            t = (target - pos) / spd
            if not stack or t > stack[-1]:      # slower than the fleet ahead -> new fleet
                stack.append(t)
            # else: catches up and merges with the fleet ahead
        return len(stack)`,
    tc: "O(n log n)", tw: "Sorting.", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]))
print(s.carFleet(10, [3], [3]))
print(s.carFleet(100, [0, 2, 4], [4, 2, 1]))`,
  out: R`
3
1
1`,
  dryOn: "target 12",
  dry: { h: ["pos", "speed", "time alone", "vs stack top", "stack"], r: [[10, 2, "1.0", "empty → new fleet", "[1.0]"], [8, 4, "1.0", "1.0 ≤ 1.0 → merges", "[1.0]"], [5, 1, "7.0", "> 1.0 → new", "[1.0, 7.0]"], [3, 3, "3.0", "≤ 7.0 → merges", "[1.0, 7.0]"], [0, 1, "12.0", "> 7.0 → new", "[1, 7, 12]"]] },
  expl: [
    ["sorted(zip(position, speed), reverse=True)", "Pair up and sort by position, descending."],
    ["if not stack or t > stack[-1]:", "Strictly slower than the fleet ahead, so it can never catch up. A new fleet."],
  ],
  take: "**Process in a sorted order and compare each item with the last \"group\" → stack.** Converting to arrival *times* makes the comparison simple.",
  mist: ["Sorting ascending (you must start from the car nearest the target).", "Integer division for the time."],
},
{
  id: "largest-rectangle-in-histogram", t: "Largest Rectangle in Histogram", lc: 84, d: "Hard", p: "Monotonic Stack (increasing)",
  q: "Given bar heights `heights` (each bar has width 1), return the area of the **largest rectangle** that fits inside the histogram.",
  ex: [["heights = [2,1,5,6,2,3]", "10", "Bars 5 and 6 → height 5 × width 2."], ["heights = [2,4]", "4", ""]],
  c: ["1 ≤ n ≤ 10^5"],
  hint: "For each bar, the biggest rectangle using its full height stretches left and right until a **shorter** bar. An increasing stack tells you exactly when a bar can't extend further right.",
  brute: {
    idea: "For each bar as the minimum height, expand left and right while bars are at least as tall.",
    code: R`
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        n, best = len(heights), 0
        for i in range(n):
            l = r = i
            while l > 0 and heights[l - 1] >= heights[i]:
                l -= 1
            while r < n - 1 and heights[r + 1] >= heights[i]:
                r += 1
            best = max(best, heights[i] * (r - l + 1))
        return best`,
    tc: "O(n²)", sc: "O(1)",
  },
  opt: {
    idea: "Keep a stack of `(start_index, height)` with **increasing heights**.\n\nWhen bar `i` is shorter than the top, the top bar can't extend past `i`. Pop it and compute its area = `height × (i − start)`. The current bar can then extend **left** to the popped bar's start, because those bars were all taller, so remember `start`.\n\nAfter the scan, bars left on the stack extend to the end: area = `h × (n − start)`.",
    steps: ["stack = []", "for i, h: start = i", "while stack and stack[-1].h > h: (idx, hh) = pop; best = max(best, hh × (i − idx)); start = idx", "push (start, h)", "after loop: for (idx, hh) in stack: best = max(best, hh × (n − idx))"],
    code: R`
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        stack = []                  # (start index, height), heights increasing
        best = 0
        for i, h in enumerate(heights):
            start = i
            while stack and stack[-1][1] > h:
                idx, height = stack.pop()
                best = max(best, height * (i - idx))   # it can't extend to i
                start = idx                            # current bar extends left to idx
            stack.append((start, h))
        n = len(heights)
        for idx, height in stack:                      # these extend to the end
            best = max(best, height * (n - idx))
        return best`,
    tc: "O(n)", sc: "O(n)",
  },
  run: R`
s = Solution()
print(s.largestRectangleArea([2, 1, 5, 6, 2, 3]))
print(s.largestRectangleArea([2, 4]))`,
  out: R`
10
4`,
  dryOn: "[2,1,5,6,2,3]",
  dry: { h: ["i", "h", "pops → area", "push", "stack"], r: [[0, 2, "—", "(0,2)", "(0,2)"], [1, 1, "(0,2) → 2×1 = 2", "(0,1)", "(0,1)"], [2, 5, "—", "(2,5)", "(0,1)(2,5)"], [3, 6, "—", "(3,6)", "(0,1)(2,5)(3,6)"], [4, 2, "(3,6) → 6×1 = 6; (2,5) → 5×2 = **10**", "(2,2)", "(0,1)(2,2)"], [5, 3, "—", "(5,3)", "(0,1)(2,2)(5,3)"], ["end", "", "3×1 = 3, 2×4 = 8, 1×6 = 6", "", "best = 10"]] },
  expl: [
    ["while stack and stack[-1][1] > h:", "A shorter bar ends the rectangles of all taller bars on top."],
    ["best = max(best, height * (i - idx))", "The popped bar spans from its start to i−1."],
    ["start = idx", "Key trick: the current bar can extend left over the popped (taller) bars."],
    ["for idx, height in stack:", "Remaining bars never met a shorter bar, so they extend to the right edge."],
  ],
  take: "**\"How far can each element extend before hitting something smaller\" → monotonic increasing stack.** The same technique solves Maximal Rectangle.",
  mist: ["Forgetting to process the stack after the loop.", "Not carrying `start` back for the current bar."],
},
]);
