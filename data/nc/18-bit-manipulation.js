NC.add("Bit Manipulation", [
{
  id: "single-number", t: "Single Number", lc: 136, d: "Easy", p: "XOR",
  q: "Every element appears **twice** except one. Find that single one, in O(n) time and O(1) extra space.",
  ex: [["nums = [2,2,1]", "1", ""], ["nums = [4,1,2,1,2]", "4", ""]],
  c: ["1 ≤ n ≤ 3·10^4"],
  hint: "x ^ x = 0 and x ^ 0 = x, and XOR is commutative. XOR everything together.",
  brute: {
    idea: "Count with a dictionary (O(n) space).",
    code: R`
from collections import Counter

class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        return next(x for x, c in Counter(nums).items() if c == 1)`,
    tc: "O(n)", sc: "O(n)",
  },
  opt: {
    idea: "XOR all numbers. The pairs cancel (`a ^ a = 0`), and the order doesn't matter, so only the single number remains.",
    steps: ["res = 0", "for x: res ^= x", "return res"],
    code: R`
class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        res = 0
        for x in nums:
            res ^= x          # pairs cancel out
        return res`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.singleNumber([2, 2, 1]))
print(s.singleNumber([4, 1, 2, 1, 2]))`,
  out: R`
1
4`,
  dry: ["0 ^ 4 = 4 → ^1 = 5 → ^2 = 7 → ^1 = 6 → ^2 = 4"],
  expl: [["res ^= x", "XOR is the \"toggle\" operation: toggling a bit twice restores it."]],
  take: "**Pairs cancel → XOR.** Related tricks: missing number, find two unique numbers (split by a set bit).",
  mist: ["Sorting (O(n log n))."],
},
{
  id: "number-of-1-bits", t: "Number of 1 Bits", lc: 191, d: "Easy", p: "Bit tricks (n & (n−1))",
  q: "Return the number of set bits (`1`s) in the binary representation of a positive integer `n` (its Hamming weight).",
  ex: [["n = 11 (1011)", "3", ""], ["n = 128 (10000000)", "1", ""], ["n = 2147483645", "30", ""]],
  c: ["1 ≤ n ≤ 2^31 − 1"],
  hint: "`n & (n − 1)` clears the lowest set bit. Count how many times you can do it before n becomes 0.",
  brute: {
    idea: "Check every bit: `n & 1`, then shift right.",
    code: R`
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            count += n & 1
            n >>= 1
        return count`,
    tc: "O(32)", sc: "O(1)",
  },
  opt: {
    idea: "**Brian Kernighan's trick:** `n − 1` flips the lowest 1 to 0 and every 0 below it to 1. ANDing with n clears exactly that lowest 1, so the loop runs once per set bit.",
    steps: ["count = 0", "while n: n &= n − 1; count += 1"],
    viz: "bits",
    code: R`
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1        # drop the lowest set bit
            count += 1
        return count`,
    tc: "O(number of 1 bits)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.hammingWeight(11))
print(s.hammingWeight(128))
print(s.hammingWeight(2147483645))
print(bin(11), bin(11).count("1"))`,
  out: R`
3
1
30
0b1011 3`,
  dry: ["1011 → & 1010 = 1010 (1)", "1010 → & 1001 = 1000 (2)", "1000 → & 0111 = 0000 (3)"],
  expl: [["n &= n - 1", "One of the most useful bit identities. It also tests powers of two: `n & (n − 1) == 0`."]],
  alt: { idea: "Built-ins: `bin(n).count('1')` or `n.bit_count()` (Python 3.10+)." },
  take: "**`n & (n − 1)` removes the lowest set bit. `n & -n` isolates it.**",
  mist: ["In other languages, signed right shift on negative numbers can loop forever."],
},
{
  id: "counting-bits", t: "Counting Bits", lc: 338, d: "Easy", p: "DP on bits",
  q: "For every `i` in `0..n`, return the number of 1 bits in `i`.",
  ex: [["n = 2", "[0, 1, 1]", ""], ["n = 5", "[0, 1, 1, 2, 1, 2]", ""]],
  c: ["0 ≤ n ≤ 10^5", "Follow-up: O(n), no built-ins"],
  hint: "`i >> 1` is i with its last bit removed, and that's a smaller number you've already computed.",
  opt: {
    idea: "`bits[i] = bits[i >> 1] + (i & 1)`: the count for i equals the count for i without its last bit, plus that last bit.",
    steps: ["bits = [0] * (n + 1)", "for i in 1..n: bits[i] = bits[i >> 1] + (i & 1)"],
    code: R`
class Solution:
    def countBits(self, n: int) -> list[int]:
        bits = [0] * (n + 1)
        for i in range(1, n + 1):
            bits[i] = bits[i >> 1] + (i & 1)    # drop last bit, add it back
        return bits`,
    tc: "O(n)", sc: "O(n)", sw: "The output.",
  },
  run: R`
s = Solution()
print(s.countBits(2))
print(s.countBits(5))`,
  out: R`
[0, 1, 1]
[0, 1, 1, 2, 1, 2]`,
  dry: { h: ["i", "binary", "i >> 1", "i & 1", "bits[i]"], r: [[3, "11", 1, 1, "1 + 1 = 2"], [4, "100", 2, 0, "1 + 0 = 1"], [5, "101", 2, 1, "1 + 1 = 2"]] },
  expl: [["bits[i >> 1]", "Already computed, since i >> 1 < i."]],
  alt: { idea: "`bits[i] = bits[i & (i − 1)] + 1`, using the same \"drop the lowest set bit\" identity." },
  take: "**DP over integers using bit relations (i >> 1, i & (i−1)).**",
  mist: ["Calling a popcount for each i separately (O(n log n))."],
},
{
  id: "reverse-bits", t: "Reverse Bits", lc: 190, d: "Easy", p: "Bit shifting",
  q: "Reverse the bits of a 32-bit unsigned integer.",
  ex: [["n = 43261596 (00000010100101000001111010011100)", "964176192 (00111001011110000010100101000000)", ""]],
  c: ["the input is a 32-bit unsigned integer"],
  hint: "Take bits from the right of n (`n & 1`) and push them into the result from the right (`res << 1`), 32 times.",
  opt: {
    idea: "Repeat 32 times: shift the result left to make room, OR in n's lowest bit, then shift n right.",
    steps: ["res = 0", "repeat 32: res = (res << 1) | (n & 1); n >>= 1"],
    code: R`
class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for _ in range(32):
            res = (res << 1) | (n & 1)   # append n's lowest bit to res
            n >>= 1
        return res`,
    tc: "O(32)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.reverseBits(43261596))
print(s.reverseBits(1) == 2**31)`,
  out: R`
964176192
True`,
  dry: ["n's bit 0 becomes res's bit 31, n's bit 1 becomes bit 30, …, because each later bit pushes the earlier ones left"],
  expl: [["(res << 1) | (n & 1)", "Shift left and set the new last bit."]],
  alt: { idea: "One-liner: `int(f'{n:032b}'[::-1], 2)`." },
  take: "**Building a number bit by bit: `res = (res << 1) | bit`.**",
  mist: ["Looping only while n > 0 (that misses the leading zeros, which become trailing zeros)."],
},
{
  id: "missing-number", t: "Missing Number", lc: 268, d: "Easy", p: "XOR / Math",
  q: "`nums` contains `n` distinct numbers from the range `[0, n]`. Return the one number in the range that is missing.",
  ex: [["nums = [3,0,1]", "2", ""], ["nums = [0,1]", "2", ""], ["nums = [9,6,4,2,3,5,7,0,1]", "8", ""]],
  c: ["1 ≤ n ≤ 10^4", "O(1) space follow-up"],
  hint: "The expected sum of 0..n is n(n+1)/2. Or XOR every index with every value, and everything cancels except the missing one.",
  opt: {
    idea: "XOR together all indices 0..n and all values. Every present number appears twice (once as an index, once as a value) and cancels, leaving the missing number. (The sum formula works just as well in Python, since there's no overflow.)",
    steps: ["res = n", "for i, x: res ^= i ^ x", "return res"],
    code: R`
class Solution:
    def missingNumber(self, nums: list[int]) -> int:
        res = len(nums)                 # index n isn't covered by enumerate
        for i, x in enumerate(nums):
            res ^= i ^ x
        return res`,
    tc: "O(n)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.missingNumber([3, 0, 1]))
print(s.missingNumber([0, 1]))
print(s.missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]))`,
  out: R`
2
2
8`,
  dry: ["[3,0,1]: res = 3 ^ (0^3) ^ (1^0) ^ (2^1) = 3^0^1^2^3^0^1 → pairs cancel → 2"],
  expl: [["res = len(nums)", "enumerate covers indices 0..n−1, so we start with n itself."]],
  alt: { idea: "`n * (n + 1) // 2 - sum(nums)`" },
  take: "**One missing / one extra element among a known range → XOR or sum difference.**",
  mist: ["Sorting (O(n log n)) or using a set (O(n) space)."],
},
{
  id: "sum-of-two-integers", t: "Sum of Two Integers", lc: 371, d: "Medium", p: "Bit addition (XOR + carry)",
  q: "Return `a + b` **without using `+` or `-`**.",
  ex: [["a = 1, b = 2", "3", ""], ["a = 2, b = 3", "5", ""], ["a = -1, b = 1", "0", ""]],
  c: ["-1000 ≤ a, b ≤ 1000"],
  hint: "`a ^ b` adds without carrying, and `(a & b) << 1` is the carry. Repeat until there's no carry. In Python, mask to 32 bits to handle negative numbers.",
  opt: {
    idea: "Binary addition: the sum bit is `a ^ b` and the carry bits are `(a & b) << 1`. Loop until the carry is 0.\n\nPython ints are unbounded, so a negative number would loop forever. Keep everything within 32 bits using `MASK = 0xFFFFFFFF`, and at the end convert back to a signed value if the sign bit is set.",
    steps: ["MASK = 0xFFFFFFFF", "while b: a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK", "return a if a ≤ 0x7FFFFFFF else ~(a ^ MASK)"],
    code: R`
class Solution:
    def getSum(self, a: int, b: int) -> int:
        MASK, MAX = 0xFFFFFFFF, 0x7FFFFFFF
        while b:
            a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK   # sum without carry, carry
        return a if a <= MAX else ~(a ^ MASK)              # back to a signed int`,
    tc: "O(32)", sc: "O(1)",
  },
  run: R`
s = Solution()
print(s.getSum(1, 2))
print(s.getSum(2, 3))
print(s.getSum(-1, 1))
print(s.getSum(-12, -8))`,
  out: R`
3
5
0
-20`,
  dryOn: "2 + 3",
  dry: { h: ["a", "b", "a ^ b", "(a & b) << 1"], r: [["010", "011", "001", "100"], ["001", "100", "101", "000"], ["101 = **5**", "0", "", "done"]] },
  expl: [["~(a ^ MASK)", "Turns a 32-bit two's-complement pattern into Python's negative int."]],
  take: "**Addition = XOR (sum) + AND-shift (carry), repeated.** Masking simulates fixed-width integers in Python.",
  mist: ["Without the mask, negative inputs loop forever in Python."],
},
{
  id: "reverse-integer", t: "Reverse Integer", lc: 7, d: "Medium", p: "Math (digit by digit + overflow)",
  q: "Reverse the digits of a signed 32-bit integer `x`. If the result overflows the 32-bit range `[−2^31, 2^31 − 1]`, return 0. Assume you can't store 64-bit integers.",
  ex: [["x = 123", "321", ""], ["x = -123", "-321", ""], ["x = 120", "21", ""], ["x = 1534236469", "0", "The reverse overflows."]],
  c: ["-2^31 ≤ x ≤ 2^31 − 1"],
  hint: "Pop the digits with `% 10` and push them with `res * 10 + d`. Check for overflow **before** pushing.",
  opt: {
    idea: "Work on `abs(x)` and remember the sign. Pop the last digit and push it onto `res`. Before pushing, check that `res * 10 + d` won't exceed the limit: `res > (LIMIT − d) // 10` means overflow.",
    steps: ["sign = −1 if x < 0 else 1; x = abs(x)", "LIMIT = 2^31 − 1 (or 2^31 for negatives)", "while x: d = x % 10; x //= 10", "if res > (LIMIT − d) // 10 → 0", "res = res * 10 + d"],
    code: R`
class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        x = abs(x)
        limit = 2**31 if sign < 0 else 2**31 - 1
        res = 0
        while x:
            x, d = divmod(x, 10)
            if res > (limit - d) // 10:         # res*10 + d would overflow
                return 0
            res = res * 10 + d
        return sign * res`,
    tc: "O(log x)", sc: "O(1)",
  },
  run: R`
s = Solution()
for v in [123, -123, 120, 1534236469, -2147483412]:
    print(v, "->", s.reverse(v))`,
  out: R`
123 -> 321
-123 -> -321
120 -> 21
1534236469 -> 0
-2147483412 -> -2143847412`,
  dry: ["123: pop 3 → 3, pop 2 → 32, pop 1 → 321"],
  expl: [["res > (limit - d) // 10", "A rearranged form of `res * 10 + d > limit` that never computes a too-big value."]],
  take: "**Digit manipulation: `x % 10` pops the last digit, `x // 10` drops it, `res * 10 + d` pushes. Check overflow before pushing.**",
  mist: ["Python's `%` and `//` on negative numbers floor toward −∞, so work with abs(x)."],
},
]);
