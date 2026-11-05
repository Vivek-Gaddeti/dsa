/* Python Complete Guide, part 1: getting started, core types, data structures
   Outputs written as "?" are filled in by running the code: node tools/fill.js <this file> */
PY.push(
/* ======================================================= GETTING STARTED */
{
  id: "intro", group: "Getting Started", title: "What is Python? Setup & Running Code",
  sub: "A high-level, dynamically typed, interpreted language that emphasizes readability. \"Batteries included\" with a huge standard library.",
  blocks: [
    ["table", ["Property", "What it means for you"], [
      ["Interpreted", "Code runs line by line through the CPython interpreter. There's no separate compile step for you."],
      ["Dynamically typed", "Variables don't have types, values do. `x = 5` then `x = \"hi\"` is legal."],
      ["Strongly typed", "No silent coercion: `\"3\" + 4` raises TypeError."],
      ["Garbage collected", "Memory is freed automatically (reference counting + a cycle collector)."],
      ["Multi-paradigm", "Procedural, object-oriented and functional styles all work."],
      ["Indentation matters", "Blocks are defined by indentation (4 spaces by convention), not braces."],
    ]],
    ["h", "Install & run"],
    ["list", [
      "Download from [python.org](https://www.python.org/downloads/). On Windows, tick **\"Add python.exe to PATH\"**.",
      "Check the version in a terminal: `python --version` (or `python3 --version` on macOS/Linux).",
      "Interactive REPL: run `python` and type expressions. Exit with `exit()`.",
      "Run a file: `python hello.py`.",
      "Editors: **VS Code** + the Python extension (recommended), PyCharm, or Jupyter notebooks for experiments.",
    ]],
    ["code", R`
# hello.py: your first program
print("Hello, World!")          # print() writes text to the screen

name = "Python"                 # store a string in a variable called name
version = 3.12                  # store a number
print(f"Welcome to {name} {version}")   # an f-string drops variables into text`, "Hello, World!\nWelcome to Python 3.12"],
    ["h", "The Zen of Python"],
    ["p", "Run `import this` to read the guiding principles. A few worth remembering: *Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Readability counts. There should be one obvious way to do it.*"],
    ["tip", "Use the REPL and `help(x)` / `dir(x)` constantly. `help(str.split)` shows the documentation, and `dir([])` lists every list method."],
  ],
},
{
  id: "syntax", group: "Getting Started", title: "Syntax Basics: Variables, Comments, I/O",
  sub: "Indentation, naming rules, comments, print and input.",
  blocks: [
    ["code", R`
# A line starting with # is a comment: Python ignores it.

x = 10                  # create the name x and point it at the value 10
y = x * 2.5             # use x in an expression → y is 25.0
name, age = "Ann", 30   # assign two names at once (tuple unpacking)
print("x =", x, "| y =", y, "| name =", name, "| age =", age)

a = b = 0               # chained assignment: both names point to 0
a, b = 1, 2             # give them different values
a, b = b, a             # SWAP in one line (no temporary variable needed)
print("after swap: a =", a, "b =", b)

if x > 5:                       # the colon starts a block…
    print("x is bigger than 5") # …and the indented lines belong to it
print("this line is outside the if-block")

# print() options: sep = text between items, end = text at the very end
print("a", "b", "c", sep="-", end="!\n")

# type() tells you what kind of value a name points to
print("types:", type(x).__name__, type(y).__name__, type(name).__name__)`, "x = 10 | y = 25.0 | name = Ann | age = 30\nafter swap: a = 2 b = 1\nx is bigger than 5\nthis line is outside the if-block\na-b-c!\ntypes: int float str"],
    ["h", "Naming rules & conventions (PEP 8)"],
    ["table", ["Kind", "Convention", "Example"], [
      ["variables, functions", "snake_case", "`max_value`, `get_user()`"],
      ["classes", "PascalCase", "`LinkedList`, `TreeNode`"],
      ["constants", "UPPER_SNAKE", "`MAX_SIZE = 100`"],
      ["\"private\"", "leading underscore", "`_helper()`"],
      ["avoid", "shadowing built-ins", "don't name variables `list`, `dict`, `str`, `id`, `sum`, `max`"],
    ]],
    ["p", "Names are case-sensitive, can't start with a digit, and can't be keywords (`class`, `def`, `if`, `for`, `lambda`, …). Run `import keyword; keyword.kwlist` to see them all."],
    ["h", "Input"],
    ["code", R`
# input() ALWAYS returns a string, so convert it yourself:
#     age = int(input("Age: "))
# Below we pretend the user typed "3 4 5" so the example runs on its own.
line = "3 4 5"

parts = line.split()             # split on spaces → ['3', '4', '5'] (still strings!)
print("parts:", parts)

a, b, c = map(int, parts)        # map(int, …) converts each piece to an int
print("sum of a, b, c:", a + b + c)

nums = list(map(int, "1 2 3 4".split()))   # the common one-liner to read a list of ints
print("nums:", nums)`, "parts: ['3', '4', '5']\nsum of a, b, c: 12\nnums: [1, 2, 3, 4]"],
    ["note", "Python has no `++` / `--`. Use `x += 1`. Augmented operators: `+= -= *= /= //= %= **= &= |= ^= >>= <<=`."],
  ],
},
/* ======================================================= CORE TYPES */
{
  id: "numbers", group: "Core Types", title: "Numbers: int, float, complex, math",
  sub: "Arbitrary-precision integers, IEEE-754 floats, and the arithmetic operators, including the tricky ones.",
  blocks: [
    ["table", ["Operator", "Meaning", "Example", "Result"], [
      ["`+ - *`", "add, subtract, multiply", "`7 * 3`", "21"],
      ["`/`", "true division (always float)", "`7 / 2`", "3.5"],
      ["`//`", "floor division (rounds toward −∞)", "`7 // 2`, `-7 // 2`", "3, −4"],
      ["`%`", "modulo (sign of the divisor)", "`7 % 3`, `-7 % 3`", "1, 2"],
      ["`**`", "power", "`2 ** 10`", "1024"],
      ["`divmod(a, b)`", "(a // b, a % b)", "`divmod(17, 5)`", "(3, 2)"],
      ["`abs`, `round`, `pow`", "absolute, round, power(+mod)", "`round(2.5)`, `pow(2, 10, 1000)`", "2, 24"],
    ]],
    ["code", R`
import math

# --- integers never overflow in Python ---
print("2 ** 100 =", 2 ** 100)

# --- the three kinds of division ---
print("10 / 3  =", 10 / 3)     # true division: always a float
print("10 // 3 =", 10 // 3)    # floor division: rounds DOWN
print("10 % 3  =", 10 % 3)     # remainder
print("-10 // 3 =", -10 // 3, "  (rounds down to -4, not toward zero!)")
print("-10 % 3  =", -10 % 3, "   (result has the sign of the divisor)")

# --- floats are approximations ---
print("0.1 + 0.2 =", 0.1 + 0.2)
print("0.1 + 0.2 == 0.3 ?", 0.1 + 0.2 == 0.3)            # False! tiny rounding error
print("math.isclose(0.1 + 0.2, 0.3) ?", math.isclose(0.1 + 0.2, 0.3))   # the right way

# --- rounding: Python uses "banker's rounding" (ties go to the even number) ---
print("round(2.5) =", round(2.5), "| round(3.5) =", round(3.5), "| round(3.14159, 2) =", round(3.14159, 2))
print("floor/ceil/trunc of -2.5:", math.floor(-2.5), math.ceil(-2.5), math.trunc(-2.5))

# --- conversions ---
print("int('42') + 1 =", int("42") + 1)
print("int(3.99) =", int(3.99), "  (int() just chops off the decimals)")
print("int('ff', 16) =", int("ff", 16), "| bin(10) =", bin(10), "| hex(255) =", hex(255))
print("1_000_000 =", 1_000_000, "  (underscores make big numbers readable)")

# --- the math module ---
print("sqrt(16) =", math.sqrt(16), "| isqrt(17) =", math.isqrt(17), "| pi =", round(math.pi, 4))`, "2 ** 100 = 1267650600228229401496703205376\n10 / 3  = 3.3333333333333335\n10 // 3 = 3\n10 % 3  = 1\n-10 // 3 = -4   (rounds down to -4, not toward zero!)\n-10 % 3  = 2    (result has the sign of the divisor)\n0.1 + 0.2 = 0.30000000000000004\n0.1 + 0.2 == 0.3 ? False\nmath.isclose(0.1 + 0.2, 0.3) ? True\nround(2.5) = 2 | round(3.5) = 4 | round(3.14159, 2) = 3.14\nfloor/ceil/trunc of -2.5: -3 -2 -2\nint('42') + 1 = 43\nint(3.99) = 3   (int() just chops off the decimals)\nint('ff', 16) = 255 | bin(10) = 0b1010 | hex(255) = 0xff\n1_000_000 = 1000000   (underscores make big numbers readable)\nsqrt(16) = 4.0 | isqrt(17) = 4 | pi = 3.1416"],
    ["warn", "Never compare floats with `==`. Use `math.isclose(a, b)`. For money, use `decimal.Decimal`. For exact fractions, use `fractions.Fraction`."],
    ["code", R`
from decimal import Decimal
from fractions import Fraction

# Decimal does exact base-10 arithmetic: good for money
print("Decimal:", Decimal("0.1") + Decimal("0.2"))

# Fraction keeps exact ratios
print("Fraction:", Fraction(1, 3) + Fraction(1, 6))

# special float values
print("infinity:", float("inf"), "| minus infinity:", float("-inf"))
print("nan == nan ?", float("nan") == float("nan"), "  (NaN is never equal to anything)")`, "Decimal: 0.3\nFraction: 1/2\ninfinity: inf | minus infinity: -inf\nnan == nan ? False   (NaN is never equal to anything)"],
  ],
},
{
  id: "booleans", group: "Core Types", title: "Booleans, None, Comparisons & Truthiness",
  sub: "True/False, how every object has a truth value, short-circuit logic, and `is` vs `==`.",
  blocks: [
    ["h", "Falsy values (everything else is truthy)"],
    ["p", "`False`, `None`, `0`, `0.0`, `0j`, `\"\"`, `[]`, `()`, `{}`, `set()`, `range(0)`, and objects whose `__bool__` returns False or whose `__len__` returns 0."],
    ["code", R`
# bool(v) shows how Python treats a value inside an if-statement
for v in [0, 1, "", "a", [], [0], None, {}, 0.0]:
    print(f"{v!r:>6} is {'truthy' if v else 'falsy'}")`, "     0 is falsy\n     1 is truthy\n    '' is falsy\n   'a' is truthy\n    [] is falsy\n   [0] is truthy\n  None is falsy\n    {} is falsy\n   0.0 is falsy"],
    ["h", "Logical operators return operands, not just True/False"],
    ["code", R`
# 'or' returns the FIRST truthy value (or the last value if none is truthy)
print("0 or 'default'   ->", 0 or "default")
print("None or [] or 'x' ->", None or [] or "x")

# 'and' returns the FIRST falsy value (or the last value if all are truthy)
print("'x' and 'y'      ->", "x" and "y")
print("0 and 'y'        ->", 0 and "y")

# a common idiom: fall back to a default when a value is empty
name = ""
display = name or "Anonymous"
print("display name:", display)

# bool is a subclass of int: True behaves like 1, False like 0
print("True + True =", True + True)`, "0 or 'default'   -> default\nNone or [] or 'x' -> x\n'x' and 'y'      -> y\n0 and 'y'        -> 0\ndisplay name: Anonymous\nTrue + True = 2"],
    ["h", "Comparisons"],
    ["code", R`
x = 5
print("1 < x < 10 ?", 1 < x < 10)          # chained: same as (1 < x) and (x < 10)

# strings, lists and tuples compare item by item ("lexicographically")
print("'apple' < 'banana' ?", "apple" < "banana")
print("[1, 2] < [1, 3]    ?", [1, 2] < [1, 3])

a = [1, 2]
b = [1, 2]
c = a                                      # c is ANOTHER NAME for the same list as a
print("a == b ?", a == b, "  (same contents)")
print("a is b ?", a is b, " (two different list objects)")
print("a is c ?", a is c, "  (literally the same object)")

v = None
print("v is None ?", v is None, "  (always use 'is' to test for None)")`, "1 < x < 10 ? True\n'apple' < 'banana' ? True\n[1, 2] < [1, 3]    ? True\na == b ? True   (same contents)\na is b ? False  (two different list objects)\na is c ? True   (literally the same object)\nv is None ? True   (always use 'is' to test for None)"],
    ["danger", "Don't use `is` to compare numbers or strings (`x is 1000`). It may appear to work because of caching, but it checks identity, not value. Use `==`. Reserve `is` for `None`, `True`, `False` and sentinel objects."],
  ],
},
{
  id: "strings", group: "Core Types", title: "Strings (complete)",
  sub: "Immutable Unicode text. Indexing, slicing, the full method toolbox, escapes, raw strings and bytes.",
  blocks: [
    ["code", R`
s = "Hello, World"
#    H e l l o ,   W o r l d
#    0 1 2 3 4 5 6 7 8 9 10 11      ← indexes (negative ones count from the end: -1 is 'd')

print("first char   s[0]    :", s[0])
print("last char    s[-1]   :", s[-1])
print("slice        s[0:5]  :", s[0:5])      # from 0 up to (not including) 5
print("from 7 on    s[7:]   :", s[7:])
print("reversed     s[::-1] :", s[::-1])     # a step of -1 walks backwards
print("every 2nd    s[::2]  :", s[::2])

print("length:", len(s))
print("'World' in s ?", "World" in s)
print("count of 'l':", s.count("l"))
print("find 'o'     :", s.find("o"), "(first index) |", s.rfind("o"), "(last index)")
print("find 'z'     :", s.find("z"), "(-1 means not found)")`, "first char   s[0]    : H\nlast char    s[-1]   : d\nslice        s[0:5]  : Hello\nfrom 7 on    s[7:]   : World\nreversed     s[::-1] : dlroW ,olleH\nevery 2nd    s[::2]  : Hlo ol\nlength: 12\n'World' in s ? True\ncount of 'l': 3\nfind 'o'     : 4 (first index) | 8 (last index)\nfind 'z'     : -1 (-1 means not found)"],
    ["code", R`
# Multi-line strings use triple quotes
poem = """Line 1
Line 2"""
print("splitlines():", poem.splitlines())

# Escape sequences start with a backslash
print("tab:[\t] quote:[\"] apostrophe:['] backslash:[\\]")

# A raw string (r"...") keeps backslashes literally: handy for regex and Windows paths
print(r"raw string: C:\new\folder  (\n is NOT a newline here)")`, "splitlines(): ['Line 1', 'Line 2']\ntab:[\t] quote:[\"] apostrophe:['] backslash:[\\]\nraw string: C:\\new\\folder  (\\n is NOT a newline here)"],
    ["h", "Method reference"],
    ["table", ["Category", "Methods"], [
      ["case", "`upper() lower() title() capitalize() swapcase() casefold()`"],
      ["checks", "`isalpha() isdigit() isnumeric() isalnum() isspace() isupper() islower() startswith() endswith()`"],
      ["search", "`find() rfind() index() rindex() count() in`"],
      ["split / join", "`split(sep=None, maxsplit) rsplit() splitlines() partition() rpartition() 'sep'.join(iterable)`"],
      ["trim / pad", "`strip() lstrip() rstrip() removeprefix() removesuffix() center() ljust() rjust() zfill()`"],
      ["replace", "`replace(old, new, count) translate() maketrans() expandtabs()`"],
      ["encode", "`encode('utf-8')` → bytes; `bytes.decode()`"],
    ]],
    ["code", R`
t = "  Python is FUN  "
step1 = t.strip()                 # remove the spaces around it
step2 = step1.lower()             # all lowercase
step3 = step2.replace("fun", "great")
step4 = step3.title()             # Capitalize Each Word
print("cleaned:", step4)

print("split on ',' :", "a,b,,c".split(","))     # empty piece between ,, is kept
print("split on whitespace:", "a b   c".split())  # no argument = any amount of spaces
print("partition:", "key=value=x".partition("="))  # split only at the FIRST '='

print("join with '-':", "-".join(["2026", "10", "07"]))
print("zero-pad to 5:", "42".zfill(5))
print("center in 8:  ", "hi".center(8, "*"))

print("ends with .pdf or .doc ?", "report.pdf".endswith((".pdf", ".doc")))
print("remove prefix:", "user_42".removeprefix("user_"))

table = str.maketrans("abc", "xyz")               # a→x, b→y, c→z
print("translate:", "aabbcc".translate(table))

print("encode é to bytes:", "é".encode("utf-8"), "| decode back:", b"\xc3\xa9".decode("utf-8"))
print("ord('é') =", ord("é"), "| chr(9731) =", chr(9731))`, "cleaned: Python Is Great\nsplit on ',' : ['a', 'b', '', 'c']\nsplit on whitespace: ['a', 'b', 'c']\npartition: ('key', '=', 'value=x')\njoin with '-': 2026-10-07\nzero-pad to 5: 00042\ncenter in 8:   ***hi***\nends with .pdf or .doc ? True\nremove prefix: 42\ntranslate: xxyyzz\nencode é to bytes: b'\\xc3\\xa9' | decode back: é\nord('é') = 233 | chr(9731) = ☃"],
    ["h", "Immutability and efficient building"],
    ["code", R`
s = "cat"
# s[0] = "b"        ← would raise TypeError: strings can't be changed in place
s = "b" + s[1:]     # build a NEW string instead
print("new string:", s)

# Building a string in a loop: collect the pieces, then join ONCE (fast, O(n))
parts = []
for i in range(5):
    parts.append(str(i))
print("joined:", "".join(parts))

# To edit characters: convert to a list, change it, then join it back
chars = list("hello")
chars[0] = "j"
print("edited:", "".join(chars))`, "new string: bat\njoined: 01234\nedited: jello"],
    ["tip", "Common escapes: `\\n` newline, `\\t` tab, `\\\\` backslash, `\\'` `\\\"` quotes, `\\u00e9` Unicode. Use raw strings `r\"...\"` for regex and Windows paths."],
  ],
},
{
  id: "formatting", group: "Core Types", title: "String Formatting (f-strings in depth)",
  sub: "f-strings are the modern way. Learn the format-spec mini-language: width, alignment, precision, separators and bases.",
  blocks: [
    ["code", R`
name, score = "Ana", 93.4567

print(f"{name} scored {score:.2f}")        # .2f → exactly 2 decimal places
print(f"[{name:>10}]")                     # >10 → right-align in a width of 10
print(f"[{name:<10}]")                     # <10 → left-align
print(f"[{name:^10}]")                     # ^10 → center
print(f"[{name:*^10}]")                    # *^10 → center, fill with *

print(f"zero-padded: {score:08.2f}")       # width 8, pad with zeros
print(f"thousands:   {1234567:,}")         # , → thousands separator
print(f"percent:     {0.256:.1%}")         # .1% → multiply by 100, add %
print(f"sign:        {42:+d} {-42:+d}")    # + → always show the sign

print(f"bases: bin {255:b} | hex {255:x} | hex with 0x {255:#x} | octal {255:o}")

pi = 3.14159265
print(f"{pi=:.3f}")                        # name= shows 'name=value' (debugging)
print(f"{2 + 3 = }")                       # also works for expressions

from datetime import date
print(f"date: {date(2026, 10, 7):%d %b %Y}")   # dates have their own format codes

# older styles you will still see in other people's code
print("format(): {} + {} = {}".format(1, 2, 3))
print("percent-style: %s is %d years old" % ("Ann", 30))`, "Ana scored 93.46\n[       Ana]\n[Ana       ]\n[   Ana    ]\n[***Ana****]\nzero-padded: 00093.46\nthousands:   1,234,567\npercent:     25.6%\nsign:        +42 -42\nbases: bin 11111111 | hex ff | hex with 0x 0xff | octal 377\npi=3.142\n2 + 3 = 5\ndate: 07 Oct 2026\nformat(): 1 + 2 = 3\npercent-style: Ann is 30 years old"],
    ["table", ["Spec", "Meaning"], [
      ["`:<10 :>10 :^10`", "align left / right / center in width 10"],
      ["`:*^10`", "fill character *"],
      ["`:.2f`", "fixed point with 2 decimals"],
      ["`:,` `:_`", "thousands separator"],
      ["`:.1%`", "percentage"],
      ["`:e`", "scientific notation"],
      ["`:b :o :x :X`", "binary / octal / hex"],
      ["`:08.2f`", "zero-pad to width 8"],
      ["`!r` `!s`", "use repr() / str()"],
    ]],
  ],
},
/* ======================================================= DATA STRUCTURES */
{
  id: "lists", group: "Data Structures", title: "Lists",
  sub: "Ordered, mutable, allows duplicates. Python's workhorse (a dynamic array).",
  blocks: [
    ["code", R`
nums = [3, 1, 4, 1, 5]

nums.append(9)               # add ONE item at the end
nums.extend([2, 6])          # add MANY items at the end
nums.insert(0, 0)            # insert 0 at index 0 (shifts everything right: O(n))
print("after adding:   ", nums)

last = nums.pop()            # remove and return the LAST item (fast)
first = nums.pop(0)          # remove and return the item at index 0 (slow: O(n))
print("popped", last, "and", first, "->", nums)

nums.remove(1)               # remove the first occurrence of the VALUE 1
print("after remove(1):", nums)
print("index of 5:", nums.index(5), "| how many 1s:", nums.count(1))

nums.sort()                  # sort IN PLACE (returns None!)
print("sorted:         ", nums)
nums.sort(reverse=True)
print("sorted desc:    ", nums)

print("sorted() makes a NEW list:", sorted([3, 1, 2]))
print("min / max / sum / len:", min(nums), max(nums), sum(nums), len(nums))

del nums[0]                  # delete by index
print("after del nums[0]:", nums)
nums.clear()                 # empty the list
print("after clear():", nums)`, "after adding:    [0, 3, 1, 4, 1, 5, 9, 2, 6]\npopped 6 and 0 -> [3, 1, 4, 1, 5, 9, 2]\nafter remove(1): [3, 4, 1, 5, 9, 2]\nindex of 5: 3 | how many 1s: 1\nsorted:          [1, 2, 3, 4, 5, 9]\nsorted desc:     [9, 5, 4, 3, 2, 1]\nsorted() makes a NEW list: [1, 2, 3]\nmin / max / sum / len: 1 9 24 6\nafter del nums[0]: [5, 4, 3, 2, 1]\nafter clear(): []"],
    ["h", "Slicing: a[start:stop:step]"],
    ["code", R`
a = list(range(10))          # [0, 1, 2, ..., 9]
print("a[2:5]  =", a[2:5])   # indexes 2, 3, 4 (stop is NOT included)
print("a[:3]   =", a[:3])    # from the start
print("a[7:]   =", a[7:])    # to the end
print("a[-3:]  =", a[-3:])   # the last 3
print("a[::3]  =", a[::3])   # every 3rd item
print("a[::-1] =", a[::-1])  # reversed copy

a[1:4] = ["x", "y"]          # slice assignment: replace 3 items with 2
print("after a[1:4] = ['x', 'y']:", a)

b = a[:]                     # a full slice = a (shallow) COPY
b[0] = "changed"
print("a[0] =", a[0], "| b[0] =", b[0], "  (changing the copy doesn't affect the original)")`, "a[2:5]  = [2, 3, 4]\na[:3]   = [0, 1, 2]\na[7:]   = [7, 8, 9]\na[-3:]  = [7, 8, 9]\na[::3]  = [0, 3, 6, 9]\na[::-1] = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]\nafter a[1:4] = ['x', 'y']: [0, 'x', 'y', 4, 5, 6, 7, 8, 9]\na[0] = 0 | b[0] = changed   (changing the copy doesn't affect the original)"],
    ["h", "Copy pitfalls"],
    ["code", R`
import copy

# ✗ WRONG: [[0] * 3] * 2 makes 2 references to the SAME inner list
grid_bad = [[0] * 3] * 2
grid_bad[0][0] = 1
print("bad grid: ", grid_bad, "  ← both rows changed!")

# ✓ RIGHT: a comprehension creates a new inner list for each row
grid = [[0] * 3 for _ in range(2)]
grid[0][0] = 1
print("good grid:", grid)

# shallow copy vs deep copy
nested = [[1, 2], [3]]
shallow = nested.copy()          # new outer list, SAME inner lists
deep = copy.deepcopy(nested)     # copies everything, all the way down
nested[0].append(99)
print("shallow copy:", shallow, "  ← sees the change")
print("deep copy:   ", deep, "     ← independent")`, "bad grid:  [[1, 0, 0], [1, 0, 0]]   ← both rows changed!\ngood grid: [[1, 0, 0], [0, 0, 0]]\nshallow copy: [[1, 2, 99], [3]]   ← sees the change\ndeep copy:    [[1, 2], [3]]      ← independent"],
    ["table", ["Operation", "Big-O"], [["index, append, pop()", "O(1)"], ["insert, pop(0), remove, `in`", "O(n)"], ["slice a[i:j]", "O(j−i)"], ["sort", "O(n log n)"]]],
  ],
},
{
  id: "tuples", group: "Data Structures", title: "Tuples & namedtuple",
  sub: "Ordered, immutable sequences. They're hashable (if their contents are), so they work as dict keys and set members.",
  blocks: [
    ["code", R`
point = (3, 4)
print("point:", point, "| point[0] =", point[0], "| len =", len(point))

single = (5,)                 # a ONE-item tuple needs the trailing comma
not_tuple = (5)               # without it, the parentheses are just grouping
print("type of (5,):", type(single).__name__, "| type of (5):", type(not_tuple).__name__)

x, y = point                  # unpack the tuple into two names
print("x =", x, "y =", y)

print("concatenate:", point + (5,), "| repeat:", point * 2)
print("(1, 2) < (1, 3) ?", (1, 2) < (1, 3), "  (compared item by item)")

visited = {(0, 0), (1, 2)}    # tuples can be set members / dict keys (lists can't)
print("(1, 2) in visited ?", (1, 2) in visited)

t = ([1], 2)                  # the tuple can't change, but a list INSIDE it can
t[0].append(9)
print("tuple holding a list:", t)`, "point: (3, 4) | point[0] = 3 | len = 2\ntype of (5,): tuple | type of (5): int\nx = 3 y = 4\nconcatenate: (3, 4, 5) | repeat: (3, 4, 3, 4)\n(1, 2) < (1, 3) ? True   (compared item by item)\n(1, 2) in visited ? True\ntuple holding a list: ([1, 9], 2)"],
    ["h", "namedtuple: readable records"],
    ["code", R`
from collections import namedtuple
from typing import NamedTuple

Point = namedtuple("Point", ["x", "y"])   # creates a tiny class with fields x and y
p = Point(1, 2)
print("p =", p)
print("access by name: p.x =", p.x, "| by index: p[1] =", p[1])
print("copy with x changed:", p._replace(x=10))
print("as a dict:", p._asdict())

class Employee(NamedTuple):               # the typed, class-style way
    name: str
    salary: float = 0.0                   # a default value

e = Employee("Ann", 5000)
print("employee:", e, "| salary:", e.salary)`, "p = Point(x=1, y=2)\naccess by name: p.x = 1 | by index: p[1] = 2\ncopy with x changed: Point(x=10, y=2)\nas a dict: {'x': 1, 'y': 2}\nemployee: Employee(name='Ann', salary=5000) | salary: 5000"],
    ["tip", "Use tuples for fixed-size records (coordinates, (priority, item) in heaps, dict keys) and lists for collections that grow."],
  ],
},
{
  id: "sets", group: "Data Structures", title: "Sets & frozenset",
  sub: "Unordered collections of unique, hashable items. O(1) average membership and fast set algebra.",
  blocks: [
    ["code", R`
s = {3, 1, 2, 3}                 # duplicates are dropped automatically
print("set:", s, "| size:", len(s), "| 2 in s ?", 2 in s)

s.add(5)                         # add one item
s.discard(10)                    # remove if present (no error if missing)
s.remove(1)                      # remove (raises KeyError if missing)
print("after add/discard/remove:", s)

a, b = {1, 2, 3, 4}, {3, 4, 5}
print("a | b  union        :", a | b)    # in either
print("a & b  intersection :", a & b)    # in both
print("a - b  difference   :", a - b)    # in a but not in b
print("a ^ b  symmetric    :", a ^ b)    # in exactly one of them

print("{1, 2} <= a  (subset)? ", {1, 2} <= a)
print("a and {9} disjoint ?   ", a.isdisjoint({9}))

print("type of {}:", type({}).__name__, " ← {} is an empty DICT; use set() for an empty set")

print("unique letters (sorted):", sorted(set("mississippi")))

fs = frozenset([1, 2])           # an immutable set: can be a dict key
lookup = {fs: "found it"}
print("frozenset as a key:", lookup[frozenset([2, 1])])`, "set: {1, 2, 3} | size: 3 | 2 in s ? True\nafter add/discard/remove: {2, 3, 5}\na | b  union        : {1, 2, 3, 4, 5}\na & b  intersection : {3, 4}\na - b  difference   : {1, 2}\na ^ b  symmetric    : {1, 2, 5}\n{1, 2} <= a  (subset)?  True\na and {9} disjoint ?    True\ntype of {}: dict  ← {} is an empty DICT; use set() for an empty set\nunique letters (sorted): ['i', 'm', 'p', 's']\nfrozenset as a key: found it"],
    ["warn", "Sets are unordered. Never rely on their iteration order. For strings it changes between runs because of hash randomization. Use `sorted()` when you need an order."],
  ],
},
{
  id: "dicts", group: "Data Structures", title: "Dictionaries",
  sub: "Key → value hash maps. Insertion-ordered (guaranteed since 3.7), with O(1) average access.",
  blocks: [
    ["code", R`
d = {"apple": 3, "banana": 5}
d["cherry"] = 7                          # add a new key (or overwrite an existing one)
print("dict:", d)

print("d['apple']        =", d["apple"])
print("d.get('kiwi')     =", d.get("kiwi"), "   ← missing key → None (no error)")
print("d.get('kiwi', 0)  =", d.get("kiwi", 0), "      ← or your own default")
print("'apple' in d ?", "apple" in d)

print("keys:  ", list(d.keys()))
print("values:", list(d.values()))
print("items: ", list(d.items()))

d.update({"apple": 10, "date": 1})       # merge another dict in
print("after update:", d)

print("pop('banana') ->", d.pop("banana"))          # remove a key, return its value
print("popitem()     ->", d.popitem())              # remove the LAST inserted pair
print("now:", d)

print("setdefault('fig', 0) ->", d.setdefault("fig", 0), "  (adds fig only if it's missing)")

for key, value in d.items():             # loop over pairs
    print("  ", key, "->", value)

print("merge with |:", d | {"x": 9})     # Python 3.9+
print("merge with **:", {**d, "new": 1})`, "dict: {'apple': 3, 'banana': 5, 'cherry': 7}\nd['apple']        = 3\nd.get('kiwi')     = None    ← missing key → None (no error)\nd.get('kiwi', 0)  = 0       ← or your own default\n'apple' in d ? True\nkeys:   ['apple', 'banana', 'cherry']\nvalues: [3, 5, 7]\nitems:  [('apple', 3), ('banana', 5), ('cherry', 7)]\nafter update: {'apple': 10, 'banana': 5, 'cherry': 7, 'date': 1}\npop('banana') -> 5\npopitem()     -> ('date', 1)\nnow: {'apple': 10, 'cherry': 7}\nsetdefault('fig', 0) -> 0   (adds fig only if it's missing)\n   apple -> 10\n   cherry -> 7\n   fig -> 0\nmerge with |: {'apple': 10, 'cherry': 7, 'fig': 0, 'x': 9}\nmerge with **: {'apple': 10, 'cherry': 7, 'fig': 0, 'new': 1}"],
    ["h", "Useful patterns"],
    ["code", R`
from collections import defaultdict, Counter
words = ["apple", "avocado", "banana", "blueberry", "cherry"]

# GROUPING: defaultdict(list) creates an empty list the first time a key is used
by_letter = defaultdict(list)
for w in words:
    by_letter[w[0]].append(w)            # no "if key not in dict" check needed
print("grouped by first letter:", dict(by_letter))

# COUNTING: Counter counts everything in one go
counts = Counter("hello world")
print("2 most common letters:", counts.most_common(2))
print("count of 'l':", counts["l"], "| count of 'z':", counts["z"], "(missing → 0)")

# BUILDING: a dict comprehension
squares = {n: n * n for n in range(5)}
print("squares:", squares)
inverted = {v: k for k, v in squares.items()}     # swap keys and values
print("which number squares to 9?", inverted[9])

print("dict from two lists:", dict(zip(["a", "b"], [1, 2])))
print("same value for many keys:", dict.fromkeys("ab", 0))

top2 = sorted(squares.items(), key=lambda kv: kv[1], reverse=True)[:2]
print("2 biggest values:", top2)`, "grouped by first letter: {'a': ['apple', 'avocado'], 'b': ['banana', 'blueberry'], 'c': ['cherry']}\n2 most common letters: [('l', 3), ('o', 2)]\ncount of 'l': 3 | count of 'z': 0 (missing → 0)\nsquares: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}\nwhich number squares to 9? 3\ndict from two lists: {'a': 1, 'b': 2}\nsame value for many keys: {'a': 0, 'b': 0}\n2 biggest values: [(4, 16), (3, 9)]"],
    ["danger", "Don't add or remove keys while iterating over a dict (RuntimeError). Iterate over `list(d)` instead."],
  ],
},
{
  id: "comprehensions", group: "Data Structures", title: "Comprehensions & Generator Expressions",
  sub: "Build lists, dicts and sets declaratively in one readable line.",
  blocks: [
    ["code", R`
nums = range(10)

# [expression  for item in iterable  if condition]
print("squares:      ", [n * n for n in nums])
print("evens only:   ", [n for n in nums if n % 2 == 0])

# if/else that CHOOSES the value goes BEFORE the for
print("even/odd:     ", ["even" if n % 2 == 0 else "odd" for n in range(4)])

print("set comp:     ", {n % 3 for n in nums})          # unique remainders
print("dict comp:    ", {c: ord(c) for c in "abc"})     # letter → code

matrix = [[1, 2, 3], [4, 5, 6]]
# nested loops read in the SAME order as normal for-loops: outer first
print("flatten:      ", [x for row in matrix for x in row])
print("transpose:    ", [[row[i] for row in matrix] for i in range(3)])

# (round brackets) = a generator expression: lazy, no list is built
print("sum of squares:", sum(n * n for n in nums))
print("any > 8 ?", any(n > 8 for n in nums), "| all >= 0 ?", all(n >= 0 for n in nums))`, "squares:       [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\nevens only:    [0, 2, 4, 6, 8]\neven/odd:      ['even', 'odd', 'even', 'odd']\nset comp:      {0, 1, 2}\ndict comp:     {'a': 97, 'b': 98, 'c': 99}\nflatten:       [1, 2, 3, 4, 5, 6]\ntranspose:     [[1, 4], [2, 5], [3, 6]]\nsum of squares: 285\nany > 8 ? True | all >= 0 ? True"],
    ["tip", "If a comprehension needs more than 2 `for`s or complex conditions, use a normal loop for readability."],
  ],
},
{
  id: "unpacking", group: "Data Structures", title: "Unpacking, Star Expressions & the Walrus",
  sub: "Destructure sequences, collect the \"rest\" with `*`, spread into calls, and assign inside expressions with `:=`.",
  blocks: [
    ["code", R`
a, b, c = [1, 2, 3]                       # one name per item
print("a, b, c =", a, b, c)

first, *middle, last = [1, 2, 3, 4, 5]    # *middle collects everything in between
print("first =", first, "| middle =", middle, "| last =", last)

head, *tail = "hello"
print("head =", head, "| tail =", tail)

(x, y), z = (1, 2), 3                     # nested unpacking
print("x, y, z =", x, y, z)

for i, (name, score) in enumerate([("a", 90), ("b", 80)]):   # unpacking inside a loop
    print(f"  #{i}: {name} scored {score}")

def add3(a, b, c):
    return a + b + c

args = [1, 2, 3]
kwargs = {"a": 1, "b": 2, "c": 3}
print("add3(*args)    =", add3(*args))      # * spreads a list into positional arguments
print("add3(**kwargs) =", add3(**kwargs))   # ** spreads a dict into keyword arguments

print("spread into a list:", [*range(3), *"ab"])
print("merge dicts:", {**{"x": 1}, "y": 2})

data = [5, 8, 12, 3]
if (n := len(data)) > 3:                    # walrus :=  assigns AND tests (3.8+)
    print(f"long list ({n} items)")
print("doubles bigger than 10:", [y for x in data if (y := x * 2) > 10])`, "a, b, c = 1 2 3\nfirst = 1 | middle = [2, 3, 4] | last = 5\nhead = h | tail = ['e', 'l', 'l', 'o']\nx, y, z = 1 2 3\n  #0: a scored 90\n  #1: b scored 80\nadd3(*args)    = 6\nadd3(**kwargs) = 6\nspread into a list: [0, 1, 2, 'a', 'b']\nmerge dicts: {'x': 1, 'y': 2}\nlong list (4 items)\ndoubles bigger than 10: [16, 24]"],
  ],
},
/* ======================================================= CONTROL FLOW */
{
  id: "conditionals", group: "Control Flow", title: "if / elif / else, Ternary & match",
  sub: "Branching, the conditional expression, and structural pattern matching (3.10+).",
  blocks: [
    ["code", R`
def grade(score):
    if score >= 90:          # checked first
        return "A"
    elif score >= 80:        # only checked if the first was False
        return "B"
    else:                    # everything else
        return "C"

print("grade(95) =", grade(95), "| grade(85) =", grade(85), "| grade(10) =", grade(10))

age = 20
status = "adult" if age >= 18 else "minor"   # one-line if/else (conditional expression)
print("status:", status)`, "grade(95) = A | grade(85) = B | grade(10) = C\nstatus: adult"],
    ["h", "match / case (structural pattern matching)"],
    ["code", R`
def describe(cmd):
    match cmd:
        case "quit" | "exit":                    # | means OR
            return "bye"
        case ["go", direction]:                  # a 2-item list starting with "go"
            return f"going {direction}"
        case ["pick", *items] if items:          # *items = the rest; 'if' adds a guard
            return f"picking {', '.join(items)}"
        case {"action": "move", "x": x, "y": y}: # a dict with these keys
            return f"move to {x},{y}"
        case int(n) if n < 0:                    # an int that is negative
            return "negative number"
        case _:                                  # _ matches anything (the default)
            return "unknown"

tests = ["quit", ["go", "north"], ["pick", "key", "map"], {"action": "move", "x": 1, "y": 2}, -5, 3.3]
for c in tests:
    print(f"{str(c):40} -> {describe(c)}")`, "quit                                     -> bye\n['go', 'north']                          -> going north\n['pick', 'key', 'map']                   -> picking key, map\n{'action': 'move', 'x': 1, 'y': 2}       -> move to 1,2\n-5                                       -> negative number\n3.3                                      -> unknown"],
  ],
},
{
  id: "loops", group: "Control Flow", title: "Loops: for, while, range, enumerate, zip",
  sub: "Iterate over anything iterable. Use break/continue, and the little-known loop `else`.",
  blocks: [
    ["code", R`
print("range(3):        ", list(range(3)))          # 0, 1, 2  (stop not included)
print("range(2, 10, 3): ", list(range(2, 10, 3)))   # start, stop, step
print("range(5, 0, -1): ", list(range(5, 0, -1)))   # counting down

for i, ch in enumerate("abc", start=1):             # index AND value together
    print(f"  enumerate -> {i}: {ch}")

names, scores = ["a", "b", "c"], [90, 80]
print("zip:        ", list(zip(names, scores)))       # stops at the SHORTER list

from itertools import zip_longest
print("zip_longest:", list(zip_longest(names, scores, fillvalue=0)))

print("reversed:   ", list(reversed([1, 2, 3])))

n = 10
steps = 0
while n > 1:                 # repeat while the condition is True
    n //= 2
    steps += 1
print(f"while-loop: halved 10 down to {n} in {steps} steps")`, "range(3):         [0, 1, 2]\nrange(2, 10, 3):  [2, 5, 8]\nrange(5, 0, -1):  [5, 4, 3, 2, 1]\n  enumerate -> 1: a\n  enumerate -> 2: b\n  enumerate -> 3: c\nzip:         [('a', 90), ('b', 80)]\nzip_longest: [('a', 90), ('b', 80), ('c', 0)]\nreversed:    [3, 2, 1]\nwhile-loop: halved 10 down to 1 in 3 steps"],
    ["h", "break, continue and loop-else"],
    ["code", R`
for n in range(10):
    if n % 2:          # odd?
        continue       # skip the rest of this round, go to the next n
    if n > 6:
        break          # leave the loop completely
    print("even number:", n)

def find(items, target):
    for i, x in enumerate(items):
        if x == target:
            print(f"found {target} at index {i}")
            break
    else:              # runs ONLY if the loop finished without 'break'
        print(f"{target} not found")

find([4, 5, 6], 5)
find([4, 5, 6], 9)`, "even number: 0\neven number: 2\neven number: 4\neven number: 6\nfound 5 at index 1\n9 not found"],
    ["danger", "Don't modify a list while iterating over it (`for x in a: a.remove(x)` skips elements). Iterate over a copy `a[:]`, or build a new list."],
  ],
},
);
