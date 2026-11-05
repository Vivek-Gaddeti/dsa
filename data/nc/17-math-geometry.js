NC.add("Math & Geometry", [
{
  id: "rotate-image", t: "Rotate Image", lc: 48, d: "Medium", p: "Matrix (transpose + reverse)",
  q: "Rotate an `n × n` matrix by **90° clockwise, in place** (without allocating another matrix).",
  ex: [["matrix = [[1,2,3],[4,5,6],[7,8,9]]", "[[7,4,1],[8,5,2],[9,6,3]]", ""]],
  c: ["1 ≤ n ≤ 20"],
  hint: "A clockwise rotation = **transpose** (swap across the main diagonal) and then **reverse each row**.",
  opt: {
    idea: "1. Transpose: swap `m[i][j]` with `m[j][i]` for `j > i`.\n2. Reverse every row.\n\nWhy it works: rotating moves (i, j) to (j, n−1−i). Transposing gives (j, i), and reversing the row maps column i to n−1−i.",
    steps: ["for i: for j > i: swap m[i][j], m[j][i]", "for row in m: row.reverse()"],
    code: R`
class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        n = len(matrix)
        for i in range(n):                       # 1) transpose
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:                       # 2) reverse each row
            row.reverse()`,
    tc: "O(n²)", sc: "O(1)",
  },
  run: R`
m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
Solution().rotate(m)
print(m)`,
  out: R`
[[7, 4, 1], [8, 5, 2], [9, 6, 3]]`,
  dry: ["transpose → [[1,4,7],[2,5,8],[3,6,9]]", "reverse rows → [[7,4,1],[8,5,2],[9,6,3]]"],
  expl: [["range(i + 1, n)", "Only the upper triangle, otherwise every pair is swapped twice (undoing it)."]],
  alt: { idea: "Counter-clockwise = transpose + reverse each **column** (or reverse the rows first, then transpose). Out of place, Python gives `[list(r) for r in zip(*matrix[::-1])]`." },
  take: "**Matrix rotations = combinations of transpose and reversals.**",
  mist: ["Swapping the whole matrix in the transpose (j from 0)."],
},
{
  id: "spiral-matrix", t: "Spiral Matrix", lc: 54, d: "Medium", p: "Matrix (shrinking boundaries)",
  q: "Return all elements of an `m × n` matrix in **spiral order** (clockwise from the top-left).",
  ex: [["matrix = [[1,2,3],[4,5,6],[7,8,9]]", "[1,2,3,6,9,8,7,4,5]", ""], ["matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", "[1,2,3,4,8,12,11,10,9,5,6,7]", ""]],
  c: ["1 ≤ m, n ≤ 10"],
  hint: "Keep four boundaries: top, bottom, left, right. Walk one side, then shrink that boundary.",
  opt: {
    idea: "Repeat while `top ≤ bottom` and `left ≤ right`:\n1. Left → right along `top`, then `top += 1`\n2. Top → bottom along `right`, then `right −= 1`\n3. If rows remain: right → left along `bottom`, then `bottom −= 1`\n4. If columns remain: bottom → top along `left`, then `left += 1`",
    steps: ["top, bottom, left, right = 0, m−1, 0, n−1", "4 walks with boundary updates", "check the bounds before walks 3 and 4 (single row/column cases)"],
    code: R`
class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        res = []
        top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for c in range(left, right + 1):
                res.append(matrix[top][c])
            top += 1
            for r in range(top, bottom + 1):
                res.append(matrix[r][right])
            right -= 1
            if top <= bottom:
                for c in range(right, left - 1, -1):
                    res.append(matrix[bottom][c])
                bottom -= 1
            if left <= right:
                for r in range(bottom, top - 1, -1):
                    res.append(matrix[r][left])
                left += 1
        return res`,
    tc: "O(m·n)", sc: "O(1)", sw: "Excluding the output.",
  },
  run: R`
s = Solution()
print(s.spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))
print(s.spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]))`,
  out: R`
[1, 2, 3, 6, 9, 8, 7, 4, 5]
[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]`,
  dry: ["top row 1 2 3 → right col 6 9 → bottom row 8 7 → left col 4 → inner: 5"],
  expl: [["if top <= bottom:", "After the first two walks, the remaining area could be a single row that was already traversed."]],
  take: "**Layer-by-layer matrix traversal → four boundaries that shrink.**",
  mist: ["Missing the bound checks → duplicates on non-square matrices."],
},
{
  id: "set-matrix-zeroes", t: "Set Matrix Zeroes", lc: 73, d: "Medium", p: "Matrix (in-place markers)",
  q: "If an element is 0, set its **entire row and column** to 0. Do it in place. Follow-up: O(1) extra space.",
  ex: [["matrix = [[1,1,1],[1,0,1],[1,1,1]]", "[[1,0,1],[0,0,0],[1,0,1]]", ""], ["matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]", ""]],
  c: ["1 ≤ m, n ≤ 200"],
  hint: "Record which rows and columns must be zeroed first, then zero them. For O(1) space, store those flags in the first row and column themselves.",
  brute: {
    idea: "Two sets: rows to zero and columns to zero. O(m + n) space.",
    code: R`
class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        R, C = len(matrix), len(matrix[0])
        rows, cols = set(), set()
        for r in range(R):
            for c in range(C):
                if matrix[r][c] == 0:
                    rows.add(r); cols.add(c)
        for r in range(R):
            for c in range(C):
                if r in rows or c in cols:
                    matrix[r][c] = 0`,
    tc: "O(m·n)", sc: "O(m + n)",
  },
  opt: {
    idea: "Use row 0 and column 0 as the marker arrays. `matrix[r][0] = 0` means \"zero row r\", and `matrix[0][c] = 0` means \"zero column c\". The first row's own flag needs a separate variable (`first_row_zero`), because `matrix[0][0]` can only hold one of the two flags.",
    steps: ["first_row_zero = any(matrix[0][c] == 0)", "for r ≥ 1, all c: if 0 → matrix[r][0] = matrix[0][c] = 0", "for r ≥ 1, c ≥ 1: zero if marked", "if matrix[0][0] == 0: zero column 0", "if first_row_zero: zero row 0"],
    code: R`
class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        R, C = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][c] == 0 for c in range(C))
        for r in range(1, R):
            for c in range(C):
                if matrix[r][c] == 0:
                    matrix[r][0] = 0          # mark row r
                    matrix[0][c] = 0          # mark column c
        for r in range(1, R):
            for c in range(1, C):
                if matrix[r][0] == 0 or matrix[0][c] == 0:
                    matrix[r][c] = 0
        if matrix[0][0] == 0:                 # column 0 must be zeroed
            for r in range(R):
                matrix[r][0] = 0
        if first_row_zero:
            for c in range(C):
                matrix[0][c] = 0`,
    tc: "O(m·n)", sc: "O(1)",
  },
  run: R`
s = Solution()
a = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
b = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]
s.setZeroes(a); s.setZeroes(b)
print(a)
print(b)`,
  out: R`
[[1, 0, 1], [0, 0, 0], [1, 0, 1]]
[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]`,
  dry: ["Second matrix: first_row_zero = True (it has 0s)", "No zeros in rows 1–2, but matrix[0][0] = 0 and matrix[0][3] = 0 are already column markers", "Zero columns 0 and 3, then the whole first row"],
  expl: [["first_row_zero", "Saved before marking, because the markers overwrite row 0."]],
  take: "**O(1) extra space trick: reuse part of the input (the first row/column) as bookkeeping.**",
  mist: ["Zeroing immediately while scanning (the new zeros trigger even more zeroing)."],
},
{
  id: "happy-number", t: "Happy Number", lc: 202, d: "Easy", p: "Cycle Detection (set / Floyd)",
  q: "Replace a number by the **sum of the squares of its digits**, repeatedly. If this process reaches 1, the number is **happy**. Otherwise it loops forever in a cycle that doesn't include 1. Return whether `n` is happy.",
  ex: [["n = 19", "True", "1²+9² = 82 → 68 → 100 → 1"], ["n = 2", "False", ""]],
  c: ["1 ≤ n ≤ 2^31 − 1"],
  hint: "The sequence either reaches 1 or repeats. Detect a repeat with a set, or with fast/slow pointers.",
  opt: {
    idea: "Generate the sequence and keep a `seen` set. If we hit 1 → happy. If we see a number again → it's a cycle → not happy.",
    steps: ["seen = set()", "while n != 1 and n not in seen: seen.add(n); n = next(n)", "return n == 1"],
    code: R`
class Solution:
    def isHappy(self, n: int) -> bool:
        def nxt(x):
            total = 0
            while x:
                x, d = divmod(x, 10)
                total += d * d
            return total

        seen = set()
        while n != 1 and n not in seen:
            seen.add(n)
            n = nxt(n)
        return n == 1`,
    tc: "O(log n)", tw: "Numbers quickly drop below 243 (= 3·9² for 3-digit values), then cycle.", sc: "O(log n)",
  },
  run: R`
s = Solution()
print(s.isHappy(19))
print(s.isHappy(2))`,
  out: R`
True
False`,
  dry: ["19 → 1 + 81 = 82 → 64 + 4 = 68 → 36 + 64 = 100 → 1 ✓"],
  expl: [["x, d = divmod(x, 10)", "Peel off the last digit."]],
  alt: { idea: "Floyd's cycle detection with O(1) space: `slow = nxt(n)`, `fast = nxt(nxt(n))` until they meet; happy if they meet at 1." },
  take: "**An iterated function on a finite set eventually cycles → detect it with a set or with fast/slow pointers.**",
  mist: ["Looping forever without cycle detection."],
},
{
  id: "plus-one", t: "Plus One", lc: 66, d: "Easy", p: "Array arithmetic (carry)",
  q: "A large integer is given as an array of digits (most significant first). Add one and return the resulting array.",
  ex: [["digits = [1,2,3]", "[1, 2, 4]", ""], ["digits = [4,3,2,1]", "[4, 3, 2, 2]", ""], ["digits = [9]", "[1, 0]", ""]],
  c: ["1 ≤ len ≤ 100", "no leading zeros"],
  hint: "Walk from the end. A 9 becomes 0 and carries; anything else gets +1 and you're done.",
  opt: {
    idea: "From the last digit backwards: if the digit < 9, increment it and return. Otherwise set it to 0 and continue (carry). If every digit was 9, prepend 1.",
    steps: ["for i from n−1 down to 0: if digits[i] < 9: digits[i] += 1; return", "digits[i] = 0", "return [1] + digits"],
    code: R`
class Solution:
    def plusOne(self, digits: list[int]) -> list[int]:
        for i in range(len(digits) - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0               # 9 + 1 = 10 -> write 0, carry 1
        return [1] + digits             # all nines: 999 -> 1000`,
    tc: "O(n)", sc: "O(1)", sw: "O(n) only in the all-9s case.",
  },
  run: R`
s = Solution()
print(s.plusOne([1, 2, 3]))
print(s.plusOne([4, 3, 2, 1]))
print(s.plusOne([9]))
print(s.plusOne([9, 9, 9]))`,
  out: R`
[1, 2, 4]
[4, 3, 2, 2]
[1, 0]
[1, 0, 0, 0]`,
  dry: ["[9,9,9]: 9 → 0, 9 → 0, 9 → 0 → prepend 1 → [1,0,0,0]"],
  expl: [["return digits", "The early return: once a digit doesn't overflow, nothing to its left changes."]],
  take: "**Digit-array arithmetic → process from the least significant digit with a carry.**",
  mist: ["Converting to int and back. It works in Python, but misses the point of the exercise."],
},
{
  id: "powx-n", t: "Pow(x, n)", lc: 50, d: "Medium", p: "Fast Exponentiation (divide & conquer)",
  q: "Implement `pow(x, n)`: x raised to the integer power n (n may be negative).",
  ex: [["x = 2.0, n = 10", "1024.0", ""], ["x = 2.1, n = 3", "9.261", ""], ["x = 2.0, n = -2", "0.25", ""]],
  c: ["-2^31 ≤ n ≤ 2^31 − 1"],
  hint: "x^n = (x^(n/2))² for even n. This halves n each step, giving O(log n) multiplications instead of n.",
  brute: {
    idea: "Multiply x by itself |n| times.",
    code: R`
class Solution:
    def myPow(self, x: float, n: int) -> float:
        res = 1.0
        for _ in range(abs(n)):
            res *= x
        return res if n >= 0 else 1 / res`,
    run: R`
s = Solution()
print(s.myPow(2.0, 10))
print(round(s.myPow(2.1, 3), 5))
print(s.myPow(2.0, -2))`,
    out: R`
1024.0
9.261
0.25`,
    tc: "O(|n|)", sc: "O(1)", bad: "n can be 2·10^9.",
  },
  opt: {
    idea: "**Binary exponentiation (iterative):** go through the bits of n. Keep `base = x`, squaring it each step (x, x², x⁴, x⁸, …). Whenever the current bit of n is 1, multiply the result by `base`. For negative n, use 1/x and −n.",
    steps: ["if n < 0: x, n = 1/x, −n", "res = 1", "while n: if n & 1: res *= x", "x *= x; n >>= 1", "return res"],
    code: R`
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x, n = 1 / x, -n
        res = 1.0
        while n:
            if n & 1:            # this bit of n is set -> include current power
                res *= x
            x *= x               # x, x^2, x^4, x^8, ...
            n >>= 1
        return res`,
    tc: "O(log n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.myPow(2.0, 10))
print(round(s.myPow(2.1, 3), 5))
print(s.myPow(2.0, -2))
print(s.myPow(1.0000001, 2**31 - 1) > 1)`,
  out: R`
1024.0
9.261
0.25
True`,
  dryOn: "x = 2, n = 10 (binary 1010)",
  dry: { h: ["bit", "x (power)", "res"], r: [["0", "2 → 4", 1], ["1", "4 → 16", "1 · 4 = 4"], ["0", "16 → 256", 4], ["1", "256 → …", "4 · 256 = **1024**"]] },
  expl: [["n & 1 / n >>= 1", "Check the lowest bit, then shift right: reading n in binary."]],
  alt: { idea: "Recursive: `half = pow(x, n // 2)`; return `half * half` (even n) or `half * half * x` (odd n)." },
  take: "**Repeated operations with an associative op → binary exponentiation (also modular power and matrix power for Fibonacci).**",
  mist: ["Not handling negative n.", "Recursing as pow(x, n−1) (that's still O(n))."],
},
{
  id: "multiply-strings", t: "Multiply Strings", lc: 43, d: "Medium", p: "Grade-school multiplication",
  q: "Given two non-negative integers as strings `num1` and `num2`, return their product as a string. You may **not** convert the inputs to integers directly.",
  ex: [["num1 = \"2\", num2 = \"3\"", "\"6\"", ""], ["num1 = \"123\", num2 = \"456\"", "\"56088\"", ""]],
  c: ["1 ≤ length ≤ 200", "no leading zeros except \"0\""],
  hint: "Digit i of num1 times digit j of num2 contributes to positions `i + j` and `i + j + 1` of the result (an array of length m + n).",
  opt: {
    idea: "Make a result array of `m + n` zeros. For i from right to left in num1 and j from right to left in num2: `mul = d1 · d2`, then add it at position `i + j + 1` and carry into `i + j`. Finally strip leading zeros.",
    steps: ["res = [0] * (m + n)", "for i, j reversed: total = d1·d2 + res[i+j+1]", "res[i+j+1] = total % 10; res[i+j] += total // 10", "strip leading zeros"],
    code: R`
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == "0" or num2 == "0":
            return "0"
        m, n = len(num1), len(num2)
        res = [0] * (m + n)
        for i in range(m - 1, -1, -1):
            d1 = ord(num1[i]) - 48                  # '0' is 48
            for j in range(n - 1, -1, -1):
                d2 = ord(num2[j]) - 48
                total = d1 * d2 + res[i + j + 1]
                res[i + j + 1] = total % 10
                res[i + j] += total // 10           # carry
        s = "".join(map(str, res)).lstrip("0")
        return s or "0"`,
    tc: "O(m·n)", sc: "O(m + n)",
  },
  run: R`
s = Solution()
print(s.multiply("2", "3"))
print(s.multiply("123", "456"))
print(s.multiply("999", "0"))`,
  out: R`
6
56088
0`,
  dry: ["positions: num1[i] × num2[j] lands at i + j + 1 (ones) and carries to i + j", "123 × 456 → the res array fills to [0,5,6,0,8,8] → \"56088\""],
  expl: [["ord(c) - 48", "Converts a digit character to its value without int()."], [".lstrip(\"0\")", "Removes the leading zeros from the fixed-size array."]],
  take: "**Big-number arithmetic on strings → simulate the school method with an array of digits and carries.**",
  mist: ["Forgetting that the result can have m + n digits."],
},
{
  id: "detect-squares", t: "Detect Squares", lc: 2013, d: "Medium", p: "Hash Map (counting points)",
  q: "Design a structure that:\n- `add(point)`: adds a point (duplicates allowed)\n- `count(point)`: counts the ways to choose 3 stored points that form an **axis-aligned square with positive area** together with the query point.",
  ex: [["add([3,10]), add([11,2]), add([3,2]), count([11,10]), count([14,8]), add([11,2]), count([11,10])", "1, 0, 2", ""]],
  c: ["0 ≤ x, y ≤ 1000", "≤ 3000 calls"],
  hint: "The query point and a **diagonal** point fully define a square. Iterate over the stored points as candidate diagonals and look up the other two corners by count.",
  opt: {
    idea: "Keep a Counter of points. For `count(qx, qy)`: for each distinct stored point `(x, y)` with `|x − qx| == |y − qy| ≠ 0` (a diagonal), the other corners are `(qx, y)` and `(x, qy)`. Add `cnt[(x, y)] · cnt[(qx, y)] · cnt[(x, qy)]`.",
    steps: ["pts = Counter()", "add: pts[(x, y)] += 1", "count: for (x, y), c in pts: if a diagonal: res += c · pts[(qx, y)] · pts[(x, qy)]"],
    code: R`
from collections import Counter

class DetectSquares:
    def __init__(self):
        self.pts = Counter()

    def add(self, point: list[int]) -> None:
        self.pts[tuple(point)] += 1

    def count(self, point: list[int]) -> int:
        qx, qy = point
        res = 0
        for (x, y), c in self.pts.items():
            if abs(x - qx) != abs(y - qy) or x == qx:
                continue                          # not a diagonal of a square
            res += c * self.pts[(qx, y)] * self.pts[(x, qy)]
        return res`,
    tc: "add O(1), count O(P)", tw: "P = distinct stored points.", sc: "O(P)",
  },
  run: R`
ds = DetectSquares()
ds.add([3, 10]); ds.add([11, 2]); ds.add([3, 2])
print(ds.count([11, 10]))
print(ds.count([14, 8]))
ds.add([11, 2])
print(ds.count([11, 10]))`,
  out: R`
1
0
2`,
  dry: ["count(11,10): diagonal candidate (3,2): |3−11| = 8 = |2−10| ✓", "other corners: (11,2) count 1, (3,10) count 1 → 1·1·1 = 1", "after adding (11,2) again → 1·2·1 = 2"],
  expl: [["Counter()[missing] == 0", "Missing corners contribute 0 automatically."], ["x == qx", "Rules out zero-area \"squares\"."]],
  take: "**Geometry counting → fix one defining element (the diagonal), derive the rest, and look them up in a hash map.**",
  mist: ["Forgetting duplicate points multiply the count."],
},
]);
