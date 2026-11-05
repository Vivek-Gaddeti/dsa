/* Python Complete Guide, part 3: standard library + advanced topics
   Outputs written as "?" are filled in by running the code: node tools/fill.js <this file> */
PY.push(
/* ======================================================= STANDARD LIBRARY */
{
  id: "collections", group: "Standard Library", title: "collections: deque, Counter, defaultdict, OrderedDict, ChainMap",
  sub: "Specialized containers you'll use constantly, especially in DSA.",
  blocks: [
    ["code", R`
from collections import deque

dq = deque([1, 2, 3])
dq.appendleft(0)                 # add on the LEFT  (O(1); a list would be O(n))
dq.append(4)                     # add on the RIGHT
print("deque:", dq)
print("popleft():", dq.popleft(), "| pop():", dq.pop(), "| now:", dq)
dq.rotate(1)                     # shift everything right by 1 (the last item wraps to the front)
print("after rotate(1):", dq)

last3 = deque(range(10), maxlen=3)   # keeps only the newest 3 items
print("maxlen=3 keeps:", last3)`, "deque: deque([0, 1, 2, 3, 4])\npopleft(): 0 | pop(): 4 | now: deque([1, 2, 3])\nafter rotate(1): deque([3, 1, 2])\nmaxlen=3 keeps: deque([7, 8, 9], maxlen=3)"],
    ["code", R`
from collections import Counter

c = Counter("abracadabra")             # counts every character
print("3 most common:", c.most_common(3))
print("count of 'z':", c["z"], " ← missing keys count as 0, no KeyError")

c.update("aaz")                        # add more counts
print("after update('aaz'): a =", c["a"], "| z =", c["z"])

print("subtract counters:", Counter(a=3, b=1) - Counter(a=1))   # negative/zero counts disappear
print("add counters:     ", Counter("ab") + Counter("bc"))
print("total of all counts:", c.total())`, "3 most common: [('a', 5), ('b', 2), ('r', 2)]\ncount of 'z': 0  ← missing keys count as 0, no KeyError\nafter update('aaz'): a = 7 | z = 1\nsubtract counters: Counter({'a': 2, 'b': 1})\nadd counters:      Counter({'b': 2, 'a': 1, 'c': 1})\ntotal of all counts: 14"],
    ["code", R`
from collections import defaultdict, OrderedDict, ChainMap

word_count = defaultdict(int)          # missing keys start at int() = 0
for w in "the cat the hat".split():
    word_count[w] += 1                 # no need to check whether the key exists
print("word counts:", dict(word_count))

graph = defaultdict(set)               # missing keys start as an empty set
graph[1].add(2)
print("graph[1] =", graph[1], "| graph[99] =", graph[99], " ← auto-created empty set")

od = OrderedDict(a=1, b=2, c=3)
od.move_to_end("a")                    # move a key to the end (used for LRU caches)
print("after move_to_end('a'):", list(od))
od.popitem(last=False)                 # remove from the FRONT
print("after popitem(last=False):", list(od))

defaults = {"theme": "light", "lang": "en"}
user = {"theme": "dark"}
cfg = ChainMap(user, defaults)         # look in 'user' first, then fall back to 'defaults'
print("theme:", cfg["theme"], "| lang:", cfg["lang"])`, "word counts: {'the': 2, 'cat': 1, 'hat': 1}\ngraph[1] = {2} | graph[99] = set()  ← auto-created empty set\nafter move_to_end('a'): ['b', 'c', 'a']\nafter popitem(last=False): ['c', 'a']\ntheme: dark | lang: en"],
    ["table", ["Container", "Use it for", "Key operations"], [
      ["`deque`", "queues, BFS, sliding windows, keeping the last N items", "`append appendleft pop popleft rotate maxlen` (all O(1) at the ends)"],
      ["`Counter`", "frequencies, multisets, anagrams", "`most_common(k) update elements total + - & |`"],
      ["`defaultdict`", "grouping, adjacency lists, counting", "`defaultdict(list / int / set)`"],
      ["`OrderedDict`", "LRU caches, order-sensitive dicts", "`move_to_end popitem(last=False)`"],
      ["`ChainMap`", "layered configs and scopes", "searches the maps in order"],
      ["`namedtuple`", "lightweight immutable records", "`._replace ._asdict`"],
    ]],
  ],
},
{
  id: "itertools", group: "Standard Library", title: "itertools & functools",
  sub: "Fast, memory-efficient building blocks for iteration, and tools for higher-order functions.",
  blocks: [
    ["code", R`
from itertools import (permutations, combinations, combinations_with_replacement, product,
                       accumulate, chain, groupby, count, cycle, islice, pairwise)

print("permutations('abc', 2):", list(permutations("abc", 2)))      # ORDER matters
print("combinations([1,2,3], 2):", list(combinations([1, 2, 3], 2))) # order doesn't matter
print("with replacement('ab', 2):", list(combinations_with_replacement("ab", 2)))
print("product([0,1], repeat=2):", list(product([0, 1], repeat=2)))   # like nested loops

print("accumulate (running sum):", list(accumulate([1, 2, 3, 4])))
print("accumulate with max:     ", list(accumulate([3, 1, 4, 1], max)))   # running maximum

print("chain lists:", list(chain([1, 2], [3], "ab")))
print("groupby runs:", [(key, len(list(group))) for key, group in groupby("aaabccdd")])
print("count from 10 step 5:", list(islice(count(10, 5), 4)))           # islice = take the first n
print("cycle 'xy':", list(islice(cycle("xy"), 5)))
print("pairwise:", list(pairwise([1, 4, 9, 16])))                       # neighbours (3.10+)`, "permutations('abc', 2): [('a', 'b'), ('a', 'c'), ('b', 'a'), ('b', 'c'), ('c', 'a'), ('c', 'b')]\ncombinations([1,2,3], 2): [(1, 2), (1, 3), (2, 3)]\nwith replacement('ab', 2): [('a', 'a'), ('a', 'b'), ('b', 'b')]\nproduct([0,1], repeat=2): [(0, 0), (0, 1), (1, 0), (1, 1)]\naccumulate (running sum): [1, 3, 6, 10]\naccumulate with max:      [3, 3, 4, 4]\nchain lists: [1, 2, 3, 'a', 'b']\ngroupby runs: [('a', 3), ('b', 1), ('c', 2), ('d', 2)]\ncount from 10 step 5: [10, 15, 20, 25]\ncycle 'xy': ['x', 'y', 'x', 'y', 'x']\npairwise: [(1, 4), (4, 9), (9, 16)]"],
    ["code", R`
from functools import reduce, partial, cache, cmp_to_key
import operator

print("reduce(add):", reduce(operator.add, [1, 2, 3, 4]))           # ((1+2)+3)+4

descending = sorted([3, 1, 2], key=cmp_to_key(lambda a, b: b - a))   # an old-style comparator
print("sorted with a comparator:", descending)

binary_to_int = partial(int, base=2)                                 # pre-fill base=2
print("binary_to_int('1010') =", binary_to_int("1010"))

@cache                                                               # memoize: compute each (r, c) once
def grid_paths(r, c):
    if r == 0 or c == 0:
        return 1
    return grid_paths(r - 1, c) + grid_paths(r, c - 1)

print("paths through a 16×16 grid:", grid_paths(16, 16))`, "reduce(add): 10\nsorted with a comparator: [3, 2, 1]\nbinary_to_int('1010') = 10\npaths through a 16×16 grid: 601080390"],
    ["tip", "`groupby` only groups **consecutive** equal items, so sort first if you want groups over the whole input."],
  ],
},
{
  id: "datetime", group: "Standard Library", title: "datetime & time",
  sub: "Dates, times, durations, formatting and parsing.",
  blocks: [
    ["code", R`
from datetime import date, datetime, timedelta, timezone

d = date(2026, 10, 7)
print("date:", d, "| year:", d.year, "| weekday (Mon=0):", d.weekday())
print("formatted:", d.strftime("%A, %d %B %Y"))          # date → text

dt = datetime(2026, 10, 7, 14, 30)
print("30 days 5 hours later:", dt + timedelta(days=30, hours=5))   # date arithmetic
print("days until Christmas:", (date(2026, 12, 25) - d).days)       # subtracting dates → timedelta

parsed = datetime.strptime("07/10/2026 09:15", "%d/%m/%Y %H:%M")    # text → datetime
print("parsed:", parsed, "| hour:", parsed.hour)

utc = datetime(2026, 1, 1, tzinfo=timezone.utc)
india = timezone(timedelta(hours=5, minutes=30))
print("midnight UTC in India is", utc.astimezone(india).strftime("%H:%M"))
print("12-hour clock:", datetime.fromisoformat("2026-10-07T08:00:00").strftime("%I:%M %p"))`, "date: 2026-10-07 | year: 2026 | weekday (Mon=0): 2\nformatted: Wednesday, 07 October 2026\n30 days 5 hours later: 2026-11-06 19:30:00\ndays until Christmas: 79\nparsed: 2026-10-07 09:15:00 | hour: 9\nmidnight UTC in India is 05:30\n12-hour clock: 08:00 AM"],
    ["table", ["Code", "Meaning"], [["`%Y %m %d`", "year, month, day"], ["`%H %M %S`", "24h hour, minute, second"], ["`%I %p`", "12h hour, AM/PM"], ["`%a %A %b %B`", "weekday / month names"], ["`%j`", "day of the year"]]],
    ["tip", "Use `time.perf_counter()` to measure elapsed time, `datetime.now(timezone.utc)` for timestamps, and the `zoneinfo` module (3.9+) for named time zones."],
  ],
},
{
  id: "regex", group: "Standard Library", title: "Regular Expressions (re)",
  sub: "Pattern matching on text: search, extract, validate, split and replace.",
  blocks: [
    ["code", R`
import re

text = "Contact: ann@mail.com, bob.smith@work.org; phone 555-1234 or 555-9876."

# findall → every match as a list
print("emails:", re.findall(r"[\w.]+@[\w.]+\w", text))   # [\w.]+ = word chars or dots, 1 or more
print("phones:", re.findall(r"\d{3}-\d{4}", text))       # \d{3} = exactly 3 digits

# search → the FIRST match, with groups ( ) you can pull out
m = re.search(r"(\w+)@(\w+)", text)
print("whole match:", m.group(0), "| user:", m.group(1), "| host:", m.group(2))

# named groups make the result readable
m = re.match(r"(?P<user>\w+)@(?P<host>\w+)", "eve@site")
print("named groups:", m.groupdict())

print("sub (replace digits):", re.sub(r"\d", "#", "pin 4821"))
print("split on , or ; :", re.split(r"[,;]\s*", "a, b;c"))

# fullmatch → does the WHOLE string fit the pattern? (good for validation)
print("'Python' is Capitalized?", bool(re.fullmatch(r"[A-Z][a-z]+", "Python")))
print("'python' is Capitalized?", bool(re.fullmatch(r"[A-Z][a-z]+", "python")))

# greedy .* grabs as much as possible; lazy .*? as little as possible
print("greedy:", re.findall(r"a.*b", "a1b a2b"), "| lazy:", re.findall(r"a.*?b", "a1b a2b"))`, "emails: ['ann@mail.com', 'bob.smith@work.org']\nphones: ['555-1234', '555-9876']\nwhole match: ann@mail | user: ann | host: mail\nnamed groups: {'user': 'eve', 'host': 'site'}\nsub (replace digits): pin ####\nsplit on , or ; : ['a', 'b', 'c']\n'Python' is Capitalized? True\n'python' is Capitalized? False\ngreedy: ['a1b a2b'] | lazy: ['a1b', 'a2b']"],
    ["table", ["Token", "Matches"], [
      ["`.`", "any char except newline"], ["`\\d \\w \\s`", "digit, word char, whitespace (uppercase = NOT)"],
      ["`[abc] [^abc] [a-z]`", "character classes"], ["`* + ? {m,n}`", "quantifiers (add `?` for lazy)"],
      ["`^ $ \\b`", "start, end, word boundary"], ["`( ) (?P<name> ) (?: )`", "group, named group, non-capturing"],
      ["`a|b`", "alternation"], ["`(?=...) (?!...)`", "lookahead"],
    ]],
  ],
},
{
  id: "os-sys", group: "Standard Library", title: "os, sys, shutil, subprocess & argparse",
  sub: "Talk to the operating system, the interpreter and the command line.",
  blocks: [
    ["code", R`
import os, sys, shutil, tempfile
from pathlib import Path

print("Python 3.8 or newer?", sys.version_info >= (3, 8))
print("recursion limit:", sys.getrecursionlimit())
print("env var with a default:", os.environ.get("NOT_SET_VAR", "default"))

with tempfile.TemporaryDirectory() as tmp:          # a scratch folder, deleted automatically
    base = Path(tmp)
    (base / "a" / "b").mkdir(parents=True)          # create nested folders
    (base / "a" / "file.txt").write_text("hi")
    shutil.copy(base / "a" / "file.txt", base / "copy.txt")   # copy a file
    print("everything inside:", sorted(p.name for p in base.rglob("*")))
    for root, dirs, files in os.walk(base / "a"):   # walk a folder tree
        print("  folder", Path(root).name, "| subfolders:", sorted(dirs), "| files:", files)`, "Python 3.8 or newer? True\nrecursion limit: 1000\nenv var with a default: default\neverything inside: ['a', 'b', 'copy.txt', 'file.txt']\n  folder a | subfolders: ['b'] | files: ['file.txt']\n  folder b | subfolders: [] | files: []"],
    ["code", R`
import subprocess, argparse, sys

# run another program and capture what it prints
out = subprocess.run([sys.executable, "-c", "print(6 * 7)"], capture_output=True, text=True)
print("child printed:", out.stdout.strip(), "| exit code:", out.returncode)

# argparse reads command-line options like:  python app.py Ann --times 2 -v
parser = argparse.ArgumentParser(description="demo CLI")
parser.add_argument("name")
parser.add_argument("--times", type=int, default=1)
parser.add_argument("-v", "--verbose", action="store_true")
args = parser.parse_args(["Ann", "--times", "2", "-v"])   # normally: parser.parse_args()
print("name:", args.name, "| times:", args.times, "| verbose:", args.verbose)`, "child printed: 42 | exit code: 0\nname: Ann | times: 2 | verbose: True"],
  ],
},
{
  id: "math-random", group: "Standard Library", title: "math, random, statistics, bisect, heapq",
  sub: "Number crunching, randomness (reproducible with seeds), basic stats, and the two DSA modules.",
  blocks: [
    ["code", R`
import math, random, statistics

print("gcd(12, 18) =", math.gcd(12, 18), "| lcm(4, 6) =", math.lcm(4, 6))
print("comb(10, 3) =", math.comb(10, 3), " ← ways to choose 3 of 10")
print("factorial(6) =", math.factorial(6), "| prod([2,3,4]) =", math.prod([2, 3, 4]))
print("log2(1024) =", math.log2(1024), "| hypot(3, 4) =", math.hypot(3, 4))

random.seed(42)                        # same seed → same "random" numbers every run
print("dice roll:", random.randint(1, 6), "| random choice:", random.choice("abc"))
deck = list(range(5))
random.shuffle(deck)
print("shuffled:", deck, "| 3 distinct samples:", random.sample(range(100), 3))

data = [2, 4, 4, 4, 5, 5, 7, 9]
print("mean:", statistics.mean(data), "| median:", statistics.median(data),
      "| mode:", statistics.mode(data), "| std dev:", statistics.pstdev(data))`, "gcd(12, 18) = 6 | lcm(4, 6) = 12\ncomb(10, 3) = 120  ← ways to choose 3 of 10\nfactorial(6) = 720 | prod([2,3,4]) = 24\nlog2(1024) = 10.0 | hypot(3, 4) = 5.0\ndice roll: 6 | random choice: a\nshuffled: [1, 3, 4, 2, 0] | 3 distinct samples: [17, 94, 13]\nmean: 5 | median: 4.5 | mode: 4 | std dev: 2.0"],
    ["code", R`
import bisect, heapq

a = [1, 3, 5, 7]
print("where would 5 go? left:", bisect.bisect_left(a, 5), "| right:", bisect.bisect_right(a, 5))
bisect.insort(a, 4)                    # insert while keeping the list sorted
print("after insort(4):", a)

h = [5, 1, 3]
heapq.heapify(h)                       # turn the list into a min-heap
heapq.heappush(h, 0)
print("smallest popped:", heapq.heappop(h))
print("2 smallest:", heapq.nsmallest(2, [9, 4, 7, 1]), "| largest:", heapq.nlargest(1, [9, 4, 7]))`, "where would 5 go? left: 2 | right: 3\nafter insort(4): [1, 3, 4, 5, 7]\nsmallest popped: 0\n2 smallest: [1, 4] | largest: [9]"],
    ["tip", "Use the `secrets` module (not `random`) for passwords and tokens."],
  ],
},
/* ======================================================= ADVANCED */
{
  id: "typing", group: "Advanced Python", title: "Type Hints & typing",
  sub: "Optional static types that document intent and let tools like mypy and Pyright catch bugs before you run the code.",
  blocks: [
    ["code", R`
from typing import Callable, Iterable, TypeVar, Protocol, TypedDict, Literal

def mean(nums: list[float]) -> float:              # "takes a list of floats, returns a float"
    return sum(nums) / len(nums)

def find(users: dict[str, int], name: str) -> int | None:   # may return None
    return users.get(name)

T = TypeVar("T")
def first(items: Iterable[T]) -> T:                 # generic: returns the same type it receives
    return next(iter(items))

def apply(f: Callable[[int], int], x: int) -> int:  # f is "a function int → int"
    return f(x)

class Greeter(Protocol):                            # any class with greet() -> str fits
    def greet(self) -> str: ...

class English:                                      # note: does NOT inherit from Greeter
    def greet(self) -> str:
        return "hello"

def welcome(g: Greeter) -> str:
    return g.greet()

class Movie(TypedDict):                             # describes the shape of a dict
    title: str
    year: int

mode: Literal["r", "w"] = "r"                       # only these exact values are allowed
m: Movie = {"title": "Up", "year": 2009}

print("mean:", mean([1, 2, 3]), "| find:", find({"a": 1}, "b"), "| first:", first("xyz"))
print("apply:", apply(lambda v: v * 2, 4), "| welcome:", welcome(English()), "| year:", m["year"])
print("hints are stored, not enforced:", mean.__annotations__)`, "mean: 2.0 | find: None | first: x\napply: 8 | welcome: hello | year: 2009\nhints are stored, not enforced: {'nums': list[float], 'return': <class 'float'>}"],
    ["note", "Python does **not** enforce hints at runtime. Run a checker: `pip install mypy` → `mypy file.py`. In VS Code, Pylance checks types as you type."],
  ],
},
{
  id: "memory", group: "Advanced Python", title: "Memory Model: Names, References, Mutability, Copying",
  sub: "Variables are names bound to objects. Understanding this removes a whole class of bugs.",
  blocks: [
    ["code", R`
a = [1, 2, 3]
b = a                     # b is a SECOND NAME for the same list (nothing is copied)
b.append(4)
print("a =", a, " ← changed through b!")
print("a is b ?", a is b, "| same id?", id(a) == id(b))

x = 10
y = x
y += 1                    # ints can't change: += makes a NEW int and points y at it
print("x =", x, "| y =", y, " ← x untouched")`, "a = [1, 2, 3, 4]  ← changed through b!\na is b ? True | same id? True\nx = 10 | y = 11  ← x untouched"],
    ["code", R`
def modify(lst, num):
    lst.append(99)        # MUTATES the caller's list → visible outside
    num += 1              # rebinds the local name only → invisible outside
    lst = [0]             # rebinds the local name only → invisible outside

nums, n = [1], 5
modify(nums, n)
print("nums =", nums, "| n =", n)

import copy
orig = {"k": [1, 2]}
shallow = copy.copy(orig)          # new dict, but the SAME inner list
deep = copy.deepcopy(orig)         # new dict AND a new inner list
orig["k"].append(3)
print("shallow sees the change:", shallow["k"], "| deep doesn't:", deep["k"])`, "nums = [1, 99] | n = 5\nshallow sees the change: [1, 2, 3] | deep doesn't: [1, 2]"],
    ["table", ["Immutable (can't change in place)", "Mutable"], [["int, float, complex, bool, str, bytes, tuple, frozenset, None", "list, dict, set, bytearray, most user classes"]]],
    ["p", "**Garbage collection:** CPython frees an object when its reference count drops to 0. A cyclic garbage collector (`gc` module) cleans up reference cycles. Small ints (−5..256) and some strings are cached (\"interned\"), which is why `is` sometimes *appears* to work on them."],
  ],
},
{
  id: "concurrency", group: "Advanced Python", title: "Concurrency: threads, processes & the GIL",
  sub: "Threads suit I/O-bound work, processes suit CPU-bound work. The Global Interpreter Lock explains why.",
  blocks: [
    ["p", "The **GIL** lets only one thread execute Python bytecode at a time (in standard CPython builds). Threads still help when they spend their time **waiting** on network, disk or sleep. For **CPU-heavy** work, use multiple processes. (Python 3.13 adds an experimental free-threaded build without the GIL.)"],
    ["code", R`
from concurrent.futures import ThreadPoolExecutor
import threading, time

def fetch(i):
    time.sleep(0.2)               # pretend to wait for a website
    return i * i

start = time.perf_counter()
with ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(fetch, range(5)))   # 5 waits happen AT THE SAME TIME
elapsed = time.perf_counter() - start
print("results:", results, "| took less than 0.6s (not 1s)?", elapsed < 0.6)

counter = 0
lock = threading.Lock()

def work():
    global counter
    for _ in range(10000):
        with lock:                # only one thread at a time may change counter
            counter += 1

threads = [threading.Thread(target=work) for _ in range(4)]
for t in threads: t.start()       # start all 4 threads
for t in threads: t.join()        # wait for all of them to finish
print("counter:", counter, "(4 threads × 10000)")`, "results: [0, 1, 4, 9, 16] | took less than 0.6s (not 1s)? True\ncounter: 40000 (4 threads × 10000)"],
    ["code", R`
# CPU-bound work: use PROCESSES (each has its own interpreter and its own GIL)
from concurrent.futures import ProcessPoolExecutor

def heavy(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":        # required for multiprocessing on Windows/macOS
    with ProcessPoolExecutor() as pool:
        print(list(pool.map(heavy, [10, 100, 1000])))`, "[285, 328350, 332833500]"],
    ["table", ["Workload", "Use"], [["Many network/file waits", "`asyncio` or `ThreadPoolExecutor`"], ["Heavy computation", "`ProcessPoolExecutor` / `multiprocessing`, or NumPy (releases the GIL)"], ["Simple background task", "`threading.Thread`"]]],
  ],
},
{
  id: "asyncio", group: "Advanced Python", title: "async / await (asyncio)",
  sub: "Cooperative concurrency on one thread: thousands of waiting tasks without thousands of threads.",
  blocks: [
    ["code", R`
import asyncio, time

async def download(name, seconds):       # 'async def' makes a coroutine
    await asyncio.sleep(seconds)          # 'await' = pause me, let other tasks run meanwhile
    return f"{name} done"

async def main():
    start = time.perf_counter()
    # gather runs all three at the same time and returns results in the ORIGINAL order
    results = await asyncio.gather(download("a", 0.3), download("b", 0.2), download("c", 0.1))
    print("gather:", results, "| took ~0.3s, not 0.6s?", time.perf_counter() - start < 0.5)

    task = asyncio.create_task(download("bg", 0.1))   # start in the background…
    print("background task:", await task)              # …and collect it later

    try:
        await asyncio.wait_for(download("slow", 1), timeout=0.1)   # give up after 0.1s
    except TimeoutError:
        print("wait_for: timed out")

asyncio.run(main())                       # start the event loop and run main()`, "gather: ['a done', 'b done', 'c done'] | took ~0.3s, not 0.6s? True\nbackground task: bg done\nwait_for: timed out"],
    ["warn", "Calling a blocking function (like `time.sleep` or `requests.get`) inside async code freezes the whole event loop. Use async libraries (`aiohttp`, `httpx`) or `await asyncio.to_thread(func)`."],
  ],
},
{
  id: "testing", group: "Advanced Python", title: "Testing: assert, unittest, pytest, doctest",
  sub: "Prove your code works and keep it working. These habits make your DSA solutions trustworthy too.",
  blocks: [
    ["code", R`
def is_palindrome(s: str) -> bool:
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]

# The simplest test: assert raises AssertionError if the condition is False
assert is_palindrome("racecar")
assert not is_palindrome("abc")
assert is_palindrome("")                       # edge case: empty string
assert is_palindrome("A man, a plan, a canal: Panama")
print("all asserts passed")`, "all asserts passed"],
    ["code", R`
import unittest

def is_palindrome(s: str) -> bool:
    """
    >>> is_palindrome("racecar")
    True
    >>> is_palindrome("abc")
    False
    """
    t = [c.lower() for c in s if c.isalnum()]
    return t == t[::-1]

class TestPalindrome(unittest.TestCase):       # group related tests in a class
    def test_basic(self):
        self.assertTrue(is_palindrome("A man, a plan, a canal: Panama"))
    def test_negative(self):
        self.assertFalse(is_palindrome("race a car"))
    def test_edge(self):
        self.assertTrue(is_palindrome(""))

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestPalindrome)
result = unittest.TextTestRunner(verbosity=0, stream=open("nul" if __import__("os").name == "nt" else "/dev/null", "w")).run(suite)
print("ran", result.testsRun, "tests, failures:", len(result.failures))

import doctest
print(doctest.testmod(verbose=False))          # runs the >>> examples in docstrings`, "ran 3 tests, failures: 0\nTestResults(failed=0, attempted=2)"],
    ["code", R`
# test_solution.py   (run with:  pytest -q)
import pytest
from solution import two_sum

def test_basic():
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]

@pytest.mark.parametrize("nums,target,expected", [   # one test, many inputs
    ([3, 2, 4], 6, [1, 2]),
    ([3, 3], 6, [0, 1]),
])
def test_many(nums, target, expected):
    assert two_sum(nums, target) == expected

def test_raises():
    with pytest.raises(ValueError):                   # expect an error
        int("x")`, null, "pytest (reference)"],
    ["tip", "For DSA practice, write 3–5 asserts for every solution: the given examples, an empty input, a single element and a large or edge value."],
  ],
},
{
  id: "performance", group: "Advanced Python", title: "Performance & Profiling",
  sub: "Measure first, then optimize. These are the Python-specific speed tips that matter.",
  blocks: [
    ["code", R`
import timeit

setup = "data = list(range(10000)); s = set(data)"
t_list = timeit.timeit("9999 in data", setup=setup, number=2000)   # scan the whole list
t_set = timeit.timeit("9999 in s", setup=setup, number=2000)       # one hash lookup
print("set lookup faster than list lookup?", t_set < t_list)

loop = timeit.timeit("r = []\nfor i in range(1000): r.append(i*i)", number=500)
comp = timeit.timeit("[i*i for i in range(1000)]", number=500)
print("list comprehension faster than an append-loop?", comp < loop)`, "set lookup faster than list lookup? True\nlist comprehension faster than an append-loop? True"],
    ["h", "Speed checklist"],
    ["list", [
      "Pick the right structure: `set`/`dict` for membership, `deque` for queues, `heapq` for min/max.",
      "Prefer built-ins (`sum`, `min`, `max`, `sorted`, `any`, `''.join`); they run in C.",
      "Comprehensions are faster than append-loops.",
      "Avoid repeated work inside loops: hoist invariants, cache attribute lookups in hot loops.",
      "Use `@functools.cache` for repeated pure computations.",
      "Read input fast in contests: `sys.stdin.readline` or `sys.stdin.read().split()`.",
      "Profile: `python -m cProfile -s cumtime script.py`, or `line_profiler` for line-level timing.",
      "Heavy numeric work: NumPy (vectorized), or PyPy for pure-Python loops.",
    ]],
  ],
},
{
  id: "idioms", group: "Advanced Python", title: "Pythonic Idioms & Best Practices",
  sub: "Write code that looks like an experienced Python developer wrote it.",
  blocks: [
    ["table", ["Instead of…", "Write"], [
      ["`for i in range(len(a)): print(a[i])`", "`for x in a:` or `for i, x in enumerate(a):`"],
      ["`if len(a) == 0:`", "`if not a:`"],
      ["`if x == True:`", "`if x:`"],
      ["`tmp = a; a = b; b = tmp`", "`a, b = b, a`"],
      ["try-except KeyError to read a dict", "`k in d` / `d.get(k, default)`"],
      ["manual counting loop", "`Counter(items)`"],
      ["`f = open(...); ...; f.close()`", "`with open(...) as f:`"],
      ["`\"%s is %d\" % (a, b)`", "`f\"{a} is {b}\"`"],
      ["`result = []` + loop + append", "list comprehension"],
      ["`x if x else default`", "`x or default`"],
      ["parallel indexing of 2 lists", "`for a, b in zip(xs, ys):`"],
      ["`type(x) == int`", "`isinstance(x, int)`"],
    ]],
    ["code", R`
names = ["ann", "bob", "cy"]
ages = [31, 25, 40]

oldest_age, oldest_name = max(zip(ages, names))     # zip pairs them, max compares the ages first
print("oldest:", oldest_name)
print("name → age:", dict(zip(names, ages)))
print("pretty list:", ", ".join(n.title() for n in names))
print("anyone over 35?", any(a > 35 for a in ages))
print("config value or default:", {"debug": False}.get("verbose", "off"))`, "oldest: cy\nname → age: {'ann': 31, 'bob': 25, 'cy': 40}\npretty list: Ann, Bob, Cy\nanyone over 35? True\nconfig value or default: off"],
    ["h", "Project hygiene"],
    ["list", ["Follow PEP 8 automatically: `ruff` (lint + format) or `black` + `flake8`.", "Type-check with mypy / Pyright.", "Write docstrings for public functions.", "Keep functions small and single-purpose.", "Use logging (`logging` module) instead of print in real apps.", "Pin dependencies in `requirements.txt` or `pyproject.toml`."]],
  ],
},
{
  id: "gotchas", group: "Advanced Python", title: "Common Gotchas (and fixes)",
  sub: "Bugs that trip up almost every Python developer at least once.",
  blocks: [
    ["code", R`
# 1) mutable default argument: the list is shared between calls
def f(x, acc=[]):
    acc.append(x)
    return acc
print("1) mutable default:", f(1), f(2), "  fix → acc=None")

# 2) [[0]*n]*m creates rows that are the SAME list
g = [[0] * 2] * 2
g[0][0] = 9
print("2) aliased rows:", g, "  fix → [[0]*2 for _ in range(2)]")

# 3) late-binding closures
print("3) late binding:", [fn() for fn in [lambda: i for i in range(3)]], "  fix → lambda i=i: i")

# 4) // and % round toward minus infinity
print("4) -7 // 2 =", -7 // 2, "| -7 % 2 =", -7 % 2, "| int(-7 / 2) =", int(-7 / 2))

# 5) float precision
print("5) 0.1 * 3 == 0.3 ?", 0.1 * 3 == 0.3, "  fix → math.isclose")

# 6) removing from a list while looping over it skips items
a = [1, 2, 2, 3]
for x in a:
    if x == 2:
        a.remove(x)
print("6) after removing 2s:", a, "  ← one 2 survived! fix → [x for x in a if x != 2]")

# 7) == vs is
print("7) [1] == [1] ?", [1] == [1], "| [1] is [1] ?", [1] is [1])

# 8) a one-element tuple needs a comma
print("8) type((1)) =", type((1)).__name__, "| type((1,)) =", type((1,)).__name__)

# 9) a shallow copy shares the inner lists
orig = [[1]]
cp = orig.copy()
cp[0].append(2)
print("9) original after changing the copy:", orig)

# 10) string methods return NEW strings
s = "abc"
s.upper()                     # result thrown away!
print("10) s is still:", s, "  fix → s = s.upper()")`, "1) mutable default: [1, 2] [1, 2]   fix → acc=None\n2) aliased rows: [[9, 0], [9, 0]]   fix → [[0]*2 for _ in range(2)]\n3) late binding: [2, 2, 2]   fix → lambda i=i: i\n4) -7 // 2 = -4 | -7 % 2 = 1 | int(-7 / 2) = -3\n5) 0.1 * 3 == 0.3 ? False   fix → math.isclose\n6) after removing 2s: [1, 2, 3]   ← one 2 survived! fix → [x for x in a if x != 2]\n7) [1] == [1] ? True | [1] is [1] ? False\n8) type((1)) = int | type((1,)) = tuple\n9) original after changing the copy: [[1, 2]]\n10) s is still: abc   fix → s = s.upper()"],
    ["list", ["Catching too broadly (`except Exception:` hides bugs).", "Shadowing built-ins (`list = [1, 2]`, which breaks `list()` later).", "Forgetting that `sort()` returns `None` (use `sorted()` if you need the result).", "Relying on the order of a `set`.", "Recursion depth > 1000 → `RecursionError` (use iteration or `sys.setrecursionlimit`)."]],
  ],
},
{
  id: "whats-new", group: "Advanced Python", title: "Modern Python: features by version (3.6 → 3.13)",
  sub: "Know which features you can use and what interviewers' environments support.",
  blocks: [
    ["table", ["Version", "Highlights"], [
      ["3.6", "f-strings, underscores in numbers `1_000`, variable annotations"],
      ["3.7", "dicts keep insertion order (guaranteed), dataclasses, `breakpoint()`"],
      ["3.8", "walrus `:=`, positional-only params `/`, f-string `{x=}`, `math.prod`, `math.isqrt`"],
      ["3.9", "dict merge `|`, `str.removeprefix/suffix`, `list[int]` generics, `zoneinfo`, `math.lcm`"],
      ["3.10", "`match`/`case`, `X | Y` union types, `zip(strict=True)`, `itertools.pairwise`, better error messages, `int.bit_count`"],
      ["3.11", "10–60% faster CPython, exception groups `except*`, `tomllib`, fine-grained error locations"],
      ["3.12", "f-string grammar (nested quotes), `type` aliases `type Point = tuple[int, int]`, `itertools.batched`, per-interpreter GIL"],
      ["3.13", "improved interactive REPL (colours, multiline editing), experimental free-threaded build (no GIL), experimental JIT"],
    ]],
    ["code", R`
import sys
from itertools import batched                 # 3.12+: split into chunks
print("batched:", list(batched("ABCDEFG", 3)))

type Pair = tuple[int, int]                   # 3.12: the 'type' alias statement
def swap(p: Pair) -> Pair:
    return (p[1], p[0])
print("swap:", swap((1, 2)), "| running 3.12+?", sys.version_info >= (3, 12))

words = ["a", "b"]
print(f"nested quotes in f-strings (3.12): {'-'.join(words)}")`, "batched: [('A', 'B', 'C'), ('D', 'E', 'F'), ('G',)]\nswap: (2, 1) | running 3.12+? True\nnested quotes in f-strings (3.12): a-b"],
    ["note", "LeetCode currently runs a recent Python 3. Check its language info. Features from 3.10 and earlier are safe everywhere."],
  ],
},
{
  id: "builtins", group: "Reference", title: "Built-in Functions Cheat Sheet",
  sub: "Every built-in you should recognize, with a one-line description.",
  blocks: [
    ["table", ["Function", "Does"], [
      ["`abs(x)`", "absolute value"], ["`all(it)` / `any(it)`", "all truthy / any truthy"], ["`bin hex oct`", "integer → base string"],
      ["`bool int float str complex`", "type constructors / conversions"], ["`bytes bytearray memoryview`", "binary data"],
      ["`callable(x)`", "can it be called?"], ["`chr(i)` / `ord(c)`", "code point ↔ char"], ["`dict list set tuple frozenset`", "container constructors"],
      ["`dir(x)` / `vars(x)` / `help(x)`", "introspection"], ["`divmod(a, b)`", "(quotient, remainder)"], ["`enumerate(it, start)`", "(index, item) pairs"],
      ["`eval` / `exec`", "run code from strings (avoid with untrusted input)"], ["`filter(f, it)` / `map(f, it)`", "lazy filter / transform"],
      ["`format(v, spec)`", "format one value"], ["`getattr setattr hasattr delattr`", "dynamic attribute access"], ["`globals()` / `locals()`", "namespace dicts"],
      ["`hash(x)` / `id(x)`", "hash value / identity"], ["`input()` / `print()`", "console I/O"], ["`isinstance` / `issubclass`", "type checks"],
      ["`iter(x)` / `next(it, default)`", "iterator protocol"], ["`len(x)`", "length"], ["`max` / `min` (key=, default=)", "extremes"],
      ["`open(path, mode)`", "file handle"], ["`pow(b, e, mod)`", "power (fast modular)"], ["`range(start, stop, step)`", "lazy integer sequence"],
      ["`repr(x)`", "developer string"], ["`reversed(seq)`", "reverse iterator"], ["`round(x, n)`", "round (banker's)"],
      ["`slice(a, b, c)`", "slice object"], ["`sorted(it, key, reverse)`", "new sorted list"], ["`sum(it, start)`", "total"],
      ["`super()`", "parent class proxy"], ["`type(x)`", "type of x (or create classes)"], ["`zip(*its, strict)`", "parallel iteration"],
      ["`__import__`", "low-level import (use importlib)"], ["`breakpoint()`", "drop into the debugger (pdb)"], ["`aiter` / `anext`", "async iteration (3.10+)"],
    ]],
  ],
},
);
