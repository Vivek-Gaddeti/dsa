/* Python Complete Guide, part 2: functions, OOP, errors, files, modules
   Outputs written as "?" are filled in by running the code: node tools/fill.js <this file> */
PY.push(
/* ======================================================= FUNCTIONS */
{
  id: "functions", group: "Functions", title: "Functions & Arguments",
  sub: "def, return, default values, *args/**kwargs, keyword-only and positional-only parameters, docstrings and annotations.",
  blocks: [
    ["code", R`
def greet(name, greeting="Hello"):        # greeting has a DEFAULT value
    """Return a greeting. (This docstring shows up in help(greet).)"""
    return f"{greeting}, {name}!"

print(greet("Ann"))                        # uses the default greeting
print(greet("Bob", "Hi"))                  # positional arguments
print(greet(greeting="Yo", name="Cy"))     # keyword arguments: order doesn't matter

def stats(*nums, round_to=2, **options):
    # *nums    → collects ALL extra positional arguments into a tuple
    # round_to → keyword-only (it comes after *nums)
    # **options → collects extra keyword arguments into a dict
    avg = sum(nums) / len(nums)
    return round(avg, round_to), options

print("stats(1, 2, 4)              ->", stats(1, 2, 4))
print("stats(..., round_to=0, v=1) ->", stats(1, 2, 4, round_to=0, verbose=True))

def divide(a, b, /, *, safe=False):
    # a, b  → positional-ONLY (before the /)
    # safe  → keyword-ONLY (after the *)
    if b == 0 and safe:
        return None
    return a / b

print("divide(6, 3)              ->", divide(6, 3))
print("divide(1, 0, safe=True)   ->", divide(1, 0, safe=True))

def min_max(nums):
    return min(nums), max(nums)             # returning "two values" = returning a tuple

lo, hi = min_max([4, 1, 9])                 # unpack the tuple
print("lo =", lo, "| hi =", hi)
print("docstring:", greet.__doc__)`, "Hello, Ann!\nHi, Bob!\nYo, Cy!\nstats(1, 2, 4)              -> (2.33, {})\nstats(..., round_to=0, v=1) -> (2.0, {'verbose': True})\ndivide(6, 3)              -> 2.0\ndivide(1, 0, safe=True)   -> None\nlo = 1 | hi = 9\ndocstring: Return a greeting. (This docstring shows up in help(greet).)"],
    ["h", "Parameter order"],
    ["p", "`def f(pos_only, /, normal, *args, kw_only, **kwargs)`. A function without `return` returns `None`."],
    ["danger", "**Mutable default arguments are created once**, when the function is defined, and then shared across calls."],
    ["code", R`
def add_bad(item, bucket=[]):      # ✗ this ONE list is reused on every call
    bucket.append(item)
    return bucket

print("bad, 1st call:", add_bad(1))
print("bad, 2nd call:", add_bad(2), " ← still remembers 1!")

def add_good(item, bucket=None):   # ✓ use None, then create a fresh list inside
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

print("good, 1st call:", add_good(1))
print("good, 2nd call:", add_good(2))`, "bad, 1st call: [1]\nbad, 2nd call: [1, 2]  ← still remembers 1!\ngood, 1st call: [1]\ngood, 2nd call: [2]"],
    ["note", "Arguments are passed by **object reference** (\"call by sharing\"): the function receives a reference to the same object. Mutating a list inside a function affects the caller, while rebinding the parameter name doesn't."],
  ],
},
{
  id: "scope", group: "Functions", title: "Scope (LEGB), global, nonlocal & Closures",
  sub: "How Python resolves names: Local → Enclosing → Global → Built-in. Closures capture variables from enclosing scopes.",
  blocks: [
    ["code", R`
x = "global"                     # module-level (global) variable

def outer():
    x = "enclosing"              # a NEW x, local to outer()
    def inner():
        x = "local"              # yet another x, local to inner()
        print("inner() sees:", x)
    inner()
    print("outer() sees:", x)

outer()
print("the module sees:", x)     # the global x was never touched`, "inner() sees: local\nouter() sees: enclosing\nthe module sees: global"],
    ["code", R`
count = 0

def bump():
    global count                 # "I mean the module-level count", not a new local one
    count += 1

bump()
bump()
print("count after two bumps:", count)

def make_counter():
    n = 0                        # this n lives on inside the returned function (a closure)
    def inc():
        nonlocal n               # "I mean make_counter's n"
        n += 1
        return n
    return inc

c1 = make_counter()
c2 = make_counter()              # a completely separate counter
print("c1:", c1(), c1(), c1())   # 1 2 3
print("c2:", c2())               # 1 → each closure has its own n`, "count after two bumps: 2\nc1: 1 2 3\nc2: 1"],
    ["h", "Late-binding gotcha"],
    ["code", R`
# Each lambda looks up i WHEN IT'S CALLED, and by then the loop has finished with i = 2
funcs = [lambda: i for i in range(3)]
print("late binding:", [f() for f in funcs])

# Fix: a default argument captures the CURRENT value of i
funcs = [lambda i=i: i for i in range(3)]
print("fixed:       ", [f() for f in funcs])`, "late binding: [2, 2, 2]\nfixed:        [0, 1, 2]"],
    ["tip", "In DSA code, nested helper functions (`def dfs(...)`) read outer variables freely. Use `nonlocal` only if you **reassign** an outer variable such as a counter or `best`. Mutating a list (`res.append`) needs no keyword."],
  ],
},
{
  id: "functional", group: "Functions", title: "Lambda, map/filter/reduce & Functional Tools",
  sub: "Small anonymous functions and higher-order functions. Functions are first-class objects.",
  blocks: [
    ["code", R`
from functools import reduce, partial

square = lambda x: x * x                 # a tiny function without a def
print("square(5) =", square(5))

nums = [1, 2, 3, 4, 5]
print("map ×10:    ", list(map(lambda x: x * 10, nums)))     # apply to every item
print("filter odd: ", list(filter(lambda x: x % 2, nums)))   # keep items where the result is truthy
print("reduce ×:   ", reduce(lambda acc, x: acc * x, nums, 1))  # fold into one value: 1·1·2·3·4·5

print("sort by length:", sorted(["bb", "a", "ccc"], key=len))     # key= decides what to compare
print("longest word:  ", max(["apple", "kiwi", "banana"], key=len))

def power(base, exp):
    return base ** exp

cube = partial(power, exp=3)             # pre-fill some arguments → a new function
print("cube(2) =", cube(2), "| cube(3) =", cube(3))

def apply_twice(f, x):                   # functions can be passed around like values
    return f(f(x))
print("apply_twice(square, 3) =", apply_twice(square, 3))

ops = {"+": lambda a, b: a + b, "*": lambda a, b: a * b}   # a "dispatch table"
print("ops['*'](6, 7) =", ops["*"](6, 7))`, "square(5) = 25\nmap ×10:     [10, 20, 30, 40, 50]\nfilter odd:  [1, 3, 5]\nreduce ×:    120\nsort by length: ['a', 'bb', 'ccc']\nlongest word:   banana\ncube(2) = 8 | cube(3) = 27\napply_twice(square, 3) = 81\nops['*'](6, 7) = 42"],
    ["tip", "Comprehensions are usually more Pythonic than map/filter with lambdas: `[x * 10 for x in nums]`."],
  ],
},
{
  id: "decorators", group: "Functions", title: "Decorators",
  sub: "Functions that wrap other functions to add behaviour (logging, timing, caching, access control) without changing their code.",
  blocks: [
    ["code", R`
import functools

def log_calls(func):                        # takes a function…
    @functools.wraps(func)                  # (keeps func's name and docstring)
    def wrapper(*args, **kwargs):           # …returns a new function that wraps it
        result = func(*args, **kwargs)      # call the original
        print(f"  [log] {func.__name__}{args} returned {result}")
        return result
    return wrapper

@log_calls                                  # same as writing:  add = log_calls(add)
def add(a, b):
    return a + b

total = add(2, 3)                           # the wrapper prints the log line
print("total =", total, "| function name is still:", add.__name__)`, "  [log] add(2, 3) returned 5\ntotal = 5 | function name is still: add"],
    ["code", R`
import functools

def repeat(times):                          # a decorator WITH arguments is a "factory":
    def decorator(func):                    # repeat(3) returns the real decorator
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator

@repeat(3)
def hello():
    return "hi"

print("hello() ->", hello())

@functools.lru_cache(maxsize=None)          # built-in decorator: memoize results
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print("fib(100) =", fib(100))
print("cache hits:", fib.cache_info().hits, "← results reused instead of recomputed")`, "hello() -> ['hi', 'hi', 'hi']\nfib(100) = 354224848179261915075\ncache hits: 98 ← results reused instead of recomputed"],
    ["h", "Class-based & built-in decorators"],
    ["list", ["`@staticmethod`, `@classmethod`, `@property`: see OOP", "`@functools.cache` / `@lru_cache`: memoization", "`@dataclass`: generates `__init__`, `__repr__`, …", "`@contextlib.contextmanager`: turns a generator into a context manager"]],
  ],
},
{
  id: "generators", group: "Functions", title: "Iterators & Generators",
  sub: "The iterator protocol powers every for-loop. Generators produce values lazily with `yield`, which saves memory.",
  blocks: [
    ["code", R`
# A for-loop secretly does this: iter() once, then next() until it runs out
it = iter([10, 20, 30])
print("next:", next(it), next(it), next(it))
print("next when exhausted (with a default):", next(it, "done"))

def countdown(n):            # any function containing 'yield' is a GENERATOR function
    while n > 0:
        yield n              # hand back n and PAUSE here until the next value is requested
        n -= 1

g = countdown(3)
print("type:", type(g).__name__)
print("first pass: ", list(g))
print("second pass:", list(g), " ← a generator can only be used once")`, "next: 10 20 30\nnext when exhausted (with a default): done\ntype: generator\nfirst pass:  [3, 2, 1]\nsecond pass: []  ← a generator can only be used once"],
    ["code", R`
from itertools import islice

def fibs():                  # an INFINITE generator, which is fine because it's lazy
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

print("first 10 Fibonacci numbers:", list(islice(fibs(), 10)))   # islice takes just 10

def chain(*iterables):
    for it in iterables:
        yield from it        # yield every item of a sub-iterable
print("chain:", list(chain([1, 2], "ab")))

big = (x * x for x in range(10**9))   # a generator expression: no billion-item list is built
print("first two squares:", next(big), next(big))

class Squares:               # make your own class iterable by giving it __iter__
    def __init__(self, n):
        self.n = n
    def __iter__(self):
        for i in range(self.n):
            yield i * i

print("list(Squares(4)) =", list(Squares(4)), "| sum =", sum(Squares(4)))`, "first 10 Fibonacci numbers: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\nchain: [1, 2, 'a', 'b']\nfirst two squares: 0 1\nlist(Squares(4)) = [0, 1, 4, 9] | sum = 14"],
    ["tip", "Use generators to stream large files (`for line in open(f)`) or pipelines. Memory stays O(1) instead of O(n)."],
  ],
},
/* ======================================================= OOP */
{
  id: "classes", group: "Object-Oriented Python", title: "Classes & Objects",
  sub: "Bundle data (attributes) and behaviour (methods). Covers instance, class and static methods.",
  blocks: [
    ["code", R`
class BankAccount:
    bank_name = "PyBank"                 # CLASS attribute: shared by every account
    count = 0                            # how many accounts have been created

    def __init__(self, owner, balance=0):   # runs automatically when you create an object
        self.owner = owner               # INSTANCE attributes: each object has its own
        self.balance = balance
        BankAccount.count += 1

    def deposit(self, amount):           # an instance method: 'self' is the object it's called on
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    @classmethod
    def from_string(cls, text):          # an alternative constructor: builds an object from "Bob:50"
        owner, bal = text.split(":")
        return cls(owner, int(bal))

    @staticmethod
    def is_valid_amount(x):              # a helper that needs neither self nor cls
        return x > 0

    def __repr__(self):                  # how the object looks when printed
        return f"BankAccount({self.owner!r}, {self.balance})"

a = BankAccount("Ann", 100)
b = BankAccount.from_string("Bob:50")
a.deposit(25)

print("a =", a, "| b =", b)
print("accounts created:", BankAccount.count, "| bank:", a.bank_name)
print("is -1 a valid amount?", BankAccount.is_valid_amount(-1))
print("isinstance(a, BankAccount)?", isinstance(a, BankAccount))
print("a's own data (vars):", vars(a))`, "a = BankAccount('Ann', 125) | b = BankAccount('Bob', 50)\naccounts created: 2 | bank: PyBank\nis -1 a valid amount? False\nisinstance(a, BankAccount)? True\na's own data (vars): {'owner': 'Ann', 'balance': 125}"],
    ["table", ["Method type", "First parameter", "Use for"], [
      ["instance method", "`self`", "behaviour that uses the object's data"],
      ["`@classmethod`", "`cls`", "alternative constructors, class-level state"],
      ["`@staticmethod`", "none", "helpers that logically belong to the class"],
    ]],
    ["warn", "A mutable class attribute (`items = []`) is shared by **every** instance. Put per-object lists in `__init__`."],
  ],
},
{
  id: "inheritance", group: "Object-Oriented Python", title: "Inheritance, super(), MRO & ABCs",
  sub: "Reuse and specialize behaviour. Polymorphism and duck typing, abstract base classes and multiple inheritance.",
  blocks: [
    ["code", R`
from abc import ABC, abstractmethod
import math

class Shape(ABC):                         # an ABSTRACT base class: a template, not a real shape
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def area(self):                       # every subclass MUST implement area()
        ...

    def describe(self):                   # shared code inherited by all subclasses
        return f"{self.name} with area {self.area():.2f}"

class Circle(Shape):                      # Circle IS-A Shape
    def __init__(self, r):
        super().__init__("circle")        # let the parent set self.name
        self.r = r
    def area(self):
        return math.pi * self.r ** 2

class Square(Shape):
    def __init__(self, s):
        super().__init__("square")
        self.s = s
    def area(self):
        return self.s ** 2

for shape in [Circle(1), Square(3)]:      # POLYMORPHISM: same call, each class answers its own way
    print(shape.describe())

print("Is Circle a subclass of Shape?", issubclass(Circle, Shape))
try:
    Shape("x")                            # abstract classes can't be created directly
except TypeError as e:
    print("TypeError:", str(e).split(" with")[0])`, "circle with area 3.14\nsquare with area 9.00\nIs Circle a subclass of Shape? True\nTypeError: Can't instantiate abstract class Shape"],
    ["h", "Multiple inheritance & MRO"],
    ["code", R`
class A:
    def hi(self): return "A"
class B(A):
    def hi(self): return "B > " + super().hi()
class C(A):
    def hi(self): return "C > " + super().hi()
class D(B, C):                       # inherits from BOTH B and C
    def hi(self): return "D > " + super().hi()

print("D().hi() =", D().hi())
# super() follows the Method Resolution Order (MRO), not just the direct parent:
print("MRO:", [k.__name__ for k in D.__mro__])`, "D().hi() = D > B > C > A\nMRO: ['D', 'B', 'C', 'A', 'object']"],
    ["note", "**Duck typing:** \"if it walks like a duck…\". Python cares whether an object *has* the method, not what class it is. Any object with `__len__` works with `len()`."],
  ],
},
{
  id: "dunder", group: "Object-Oriented Python", title: "Magic (Dunder) Methods",
  sub: "Make your classes work with Python's operators and built-ins: printing, comparing, sorting, hashing, indexing, iteration, arithmetic, calling.",
  blocks: [
    ["code", R`
from functools import total_ordering

@total_ordering                      # from __eq__ and __lt__ it builds <=, >, >= for us
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):  return f"Vector({self.x}, {self.y})"       # repr(v), shown in lists
    def __str__(self):   return f"({self.x}, {self.y})"             # print(v) / str(v)
    def __eq__(self, o): return (self.x, self.y) == (o.x, o.y)      # v == w
    def __lt__(self, o): return abs(self) < abs(o)                  # v < w (used by sorted)
    def __hash__(self):  return hash((self.x, self.y))              # lets it be a dict key
    def __add__(self, o): return Vector(self.x + o.x, self.y + o.y) # v + w
    def __mul__(self, k): return Vector(self.x * k, self.y * k)     # v * 3
    __rmul__ = __mul__                                             # 3 * v
    def __abs__(self):   return (self.x ** 2 + self.y ** 2) ** 0.5  # abs(v)
    def __bool__(self):  return bool(self.x or self.y)              # if v: …
    def __len__(self):   return 2                                   # len(v)
    def __getitem__(self, i): return (self.x, self.y)[i]            # v[0]
    def __iter__(self):  yield self.x; yield self.y                 # list(v), unpacking
    def __contains__(self, val): return val in (self.x, self.y)     # 4 in v
    def __call__(self, scale): return self * scale                  # v(10)

v, w = Vector(3, 4), Vector(1, 1)
print("repr:", repr(v), "| str:", str(v))
print("v + w =", v + w, "| 2 * v =", 2 * v, "| abs(v) =", abs(v))
print("bool(Vector(0, 0)) =", bool(Vector(0, 0)))
print("len(v) =", len(v), "| v[0] =", v[0], "| list(v) =", list(v), "| 4 in v ?", 4 in v)
print("v(10) =", v(10), "| v == Vector(3, 4) ?", v == Vector(3, 4), "| w < v ?", w < v)
print("sorted([v, w]) =", sorted([v, w]))
print("as a dict key:", {v: "point"}[Vector(3, 4)])`, "repr: Vector(3, 4) | str: (3, 4)\nv + w = (4, 5) | 2 * v = (6, 8) | abs(v) = 5.0\nbool(Vector(0, 0)) = False\nlen(v) = 2 | v[0] = 3 | list(v) = [3, 4] | 4 in v ? True\nv(10) = (30, 40) | v == Vector(3, 4) ? True | w < v ? True\nsorted([v, w]) = [Vector(1, 1), Vector(3, 4)]\nas a dict key: point"],
    ["table", ["Category", "Dunders"], [
      ["create / destroy", "`__new__ __init__ __del__`"],
      ["representation", "`__repr__ __str__ __format__`"],
      ["comparison", "`__eq__ __ne__ __lt__ __le__ __gt__ __ge__ __hash__`"],
      ["arithmetic", "`__add__ __sub__ __mul__ __truediv__ __floordiv__ __mod__ __pow__` (+ `__r*__` and `__i*__` versions)"],
      ["containers", "`__len__ __getitem__ __setitem__ __delitem__ __contains__ __iter__ __reversed__`"],
      ["callable / context", "`__call__ __enter__ __exit__`"],
      ["attributes", "`__getattr__ __getattribute__ __setattr__ __delattr__`"],
    ]],
    ["tip", "For DSA: define `__lt__` on a node class so it can go into `heapq` directly, or push `(priority, counter, node)` tuples instead."],
  ],
},
{
  id: "properties", group: "Object-Oriented Python", title: "Properties, Encapsulation & __slots__",
  sub: "Attribute-style access with validation, Python's \"private\" conventions, and memory-saving slots.",
  blocks: [
    ["code", R`
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius            # this goes through the setter below (validated!)

    @property
    def celsius(self):                    # GETTER: runs when you READ t.celsius
        return self._celsius

    @celsius.setter
    def celsius(self, value):             # SETTER: runs when you WRITE t.celsius = …
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):                 # a computed, read-only attribute
        return self._celsius * 9 / 5 + 32

t = Temperature(25)
t.celsius = 30                            # looks like a plain assignment, but runs the setter
print("celsius:", t.celsius, "| fahrenheit:", t.fahrenheit)
try:
    t.celsius = -500
except ValueError as e:
    print("rejected:", e)`, "celsius: 30 | fahrenheit: 86.0\nrejected: below absolute zero"],
    ["code", R`
class Secret:
    def __init__(self):
        self._internal = 1        # one underscore: "internal, please don't use from outside"
        self.__hidden = 2         # two underscores: renamed to _Secret__hidden (name mangling)

s = Secret()
print("s._internal =", s._internal)
print("s._Secret__hidden =", s._Secret__hidden, " ← still reachable, just harder to hit by accident")

class Point:
    __slots__ = ("x", "y")        # only these attributes allowed → less memory per object
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
try:
    p.z = 3
except AttributeError:
    print("can't add attribute z: __slots__ only allows x and y")`, "s._internal = 1\ns._Secret__hidden = 2  ← still reachable, just harder to hit by accident\ncan't add attribute z: __slots__ only allows x and y"],
  ],
},
{
  id: "dataclasses", group: "Object-Oriented Python", title: "Dataclasses & Enums",
  sub: "Less boilerplate for data-holding classes, and named constants with Enum.",
  blocks: [
    ["code", R`
from dataclasses import dataclass, field, asdict

@dataclass(order=True)            # auto-generates __init__, __repr__, __eq__ and < > (order=True)
class Task:
    priority: int                 # the ONLY field used for comparing/sorting
    name: str = field(compare=False)
    tags: list[str] = field(default_factory=list, compare=False)   # a fresh list per object

tasks = [Task(3, "write"), Task(1, "plan", ["urgent"]), Task(2, "test")]
print("lowest priority first:", sorted(tasks)[0])
print("as a dict:", asdict(tasks[1]))
print("Task(1,'x') == Task(1,'y') ?", Task(1, "x") == Task(1, "y"), " (name isn't compared)")

@dataclass(frozen=True)           # immutable → also hashable, so it can be a dict key
class Coord:
    r: int
    c: int

print("frozen dataclass as a key:", {Coord(0, 0): "origin"}[Coord(0, 0)])`, "lowest priority first: Task(priority=1, name='plan', tags=['urgent'])\nas a dict: {'priority': 1, 'name': 'plan', 'tags': ['urgent']}\nTask(1,'x') == Task(1,'y') ? True  (name isn't compared)\nfrozen dataclass as a key: origin"],
    ["code", R`
from enum import Enum, auto

class Color(Enum):                # a fixed set of named constants
    RED = auto()                  # auto() picks the values 1, 2, 3…
    GREEN = auto()
    BLUE = auto()

print("member:", Color.RED, "| name:", Color.RED.name, "| value:", Color.GREEN.value)
print("look up by name:", Color["BLUE"], "| by value:", Color(2))
print("all members:", [c.name for c in Color], "| how many:", len(Color))`, "member: Color.RED | name: RED | value: 2\nlook up by name: Color.BLUE | by value: Color.GREEN\nall members: ['RED', 'GREEN', 'BLUE'] | how many: 3"],
    ["warn", "A dataclass field with a mutable default must use `field(default_factory=list)`. A bare `= []` raises an error to protect you from the shared-default bug."],
  ],
},
/* ======================================================= ERRORS & FILES */
{
  id: "exceptions", group: "Errors, Files & Context Managers", title: "Exceptions",
  sub: "try / except / else / finally, raising, custom exceptions, chaining, and the exception hierarchy.",
  blocks: [
    ["code", R`
def safe_divide(a, b):
    try:
        result = a / b                 # the risky line
    except ZeroDivisionError:          # runs only for THIS kind of error
        print("  except: can't divide by zero")
        return None
    except TypeError as e:             # 'as e' gives you the error object
        print("  except: bad types:", e)
        return None
    else:                              # runs only if NO exception happened
        print("  else: success")
        return result
    finally:                           # ALWAYS runs: success, error, or return
        print("  finally: cleanup")

print("safe_divide(10, 2) →", safe_divide(10, 2))
print("safe_divide(1, 0)  →", safe_divide(1, 0))`, "  else: success\n  finally: cleanup\nsafe_divide(10, 2) → 5.0\n  except: can't divide by zero\n  finally: cleanup\nsafe_divide(1, 0)  → None"],
    ["code", R`
class InsufficientFunds(Exception):          # your own error type
    def __init__(self, needed):
        super().__init__(f"need {needed} more")
        self.needed = needed                 # extra data attached to the error

try:
    raise InsufficientFunds(30)              # 'raise' signals the error
except InsufficientFunds as e:
    print("caught:", e, "| needed:", e.needed)

try:
    try:
        int("abc")                           # ValueError
    except ValueError as e:
        raise RuntimeError("config parse failed") from e   # wrap it, keeping the cause
except RuntimeError as e:
    print("caught:", e, "| caused by:", type(e.__cause__).__name__)`, "caught: need 30 more | needed: 30\ncaught: config parse failed | caused by: ValueError"],
    ["table", ["Common exception", "When"], [
      ["`ValueError`", "right type, bad value: `int(\"abc\")`"],
      ["`TypeError`", "wrong type: `\"a\" + 1`"],
      ["`KeyError` / `IndexError`", "missing dict key / list index out of range"],
      ["`AttributeError`", "object has no such attribute"],
      ["`ZeroDivisionError`", "division by zero"],
      ["`FileNotFoundError`", "open a missing file"],
      ["`StopIteration`", "next() on an exhausted iterator"],
      ["`RecursionError`", "recursion too deep"],
    ]],
    ["tip", "**EAFP** (\"easier to ask forgiveness than permission\") is idiomatic: try the operation and catch the specific exception, instead of pre-checking everything. Never write a bare `except:`, because it swallows Ctrl-C and real bugs."],
  ],
},
{
  id: "files", group: "Errors, Files & Context Managers", title: "Files, pathlib, JSON & CSV",
  sub: "Read and write text safely with `with`, navigate paths with pathlib, and serialize data.",
  blocks: [
    ["code", R`
from pathlib import Path

p = Path("demo_notes.txt")

# 'w' = write (creates or overwrites), 'a' = append, 'r' = read (default)
with open(p, "w", encoding="utf-8") as f:     # 'with' closes the file automatically
    f.write("line one\n")
    f.writelines(["line two\n", "line three\n"])

with open(p, encoding="utf-8") as f:
    for line in f:                            # read line by line (memory-friendly)
        print("read:", line.rstrip())         # rstrip() removes the trailing newline

text = p.read_text(encoding="utf-8")          # or read the whole file at once
print("'line' appears", text.count("line"), "times")
print("suffix:", p.suffix, "| stem:", p.stem, "| exists:", p.exists())

p.unlink()                                    # delete the demo file
print("exists after unlink:", p.exists())`, "read: line one\nread: line two\nread: line three\n'line' appears 3 times\nsuffix: .txt | stem: demo_notes | exists: True\nexists after unlink: False"],
    ["code", R`
import json, csv
from pathlib import Path

data = {"name": "Ann", "skills": ["python", "dsa"], "level": 3}

Path("demo.json").write_text(json.dumps(data, indent=2))   # dict → JSON text → file
loaded = json.loads(Path("demo.json").read_text())         # file → JSON text → dict
print("skills from the JSON file:", loaded["skills"])
print("compact JSON:", json.dumps(data, separators=(",", ":")))

with open("demo.csv", "w", newline="") as f:
    csv.writer(f).writerows([["name", "score"], ["Ann", 90], ["Bob", 85]])

with open("demo.csv", newline="") as f:
    for row in csv.DictReader(f):             # each row becomes {"name": …, "score": …}
        print("csv row:", row)

Path("demo.json").unlink()
Path("demo.csv").unlink()`, "skills from the JSON file: ['python', 'dsa']\ncompact JSON: {\"name\":\"Ann\",\"skills\":[\"python\",\"dsa\"],\"level\":3}\ncsv row: {'name': 'Ann', 'score': '90'}\ncsv row: {'name': 'Bob', 'score': '85'}"],
    ["table", ["pathlib", "Does"], [["`Path.cwd()`, `Path.home()`", "current / home directory"], ["`p / \"sub\" / \"f.txt\"`", "join paths with /"], ["`p.glob(\"*.py\")`, `p.rglob(...)`", "find files"], ["`p.mkdir(parents=True, exist_ok=True)`", "create directories"], ["`p.name`, `.stem`, `.suffix`, `.parent`", "path parts"]]],
  ],
},
{
  id: "context-managers", group: "Errors, Files & Context Managers", title: "Context Managers (with)",
  sub: "Guarantee setup and cleanup (files, locks, connections, timers) even when errors happen.",
  blocks: [
    ["code", R`
class Timer:
    def __enter__(self):                       # runs at the START of the with-block
        print("enter: start timer")
        return self                            # this is what 'as t' receives
    def __exit__(self, exc_type, exc, tb):     # runs at the END, even after an error
        print("exit: stop timer", "(an error happened!)" if exc_type else "(no error)")
        return False                           # False = don't hide the exception

with Timer() as t:
    print("inside: doing work")`, "enter: start timer\ninside: doing work\nexit: stop timer (no error)"],
    ["code", R`
from contextlib import contextmanager, suppress

@contextmanager
def tag(name):              # the code BEFORE yield = setup, AFTER yield = cleanup
    print(f"<{name}>")
    try:
        yield
    finally:
        print(f"</{name}>")

with tag("b"):
    print("bold text")

with suppress(KeyError):    # silently ignore one specific kind of error
    {}["missing"]
print("the program continued after the suppressed KeyError")`, "<b>\nbold text\n</b>\nthe program continued after the suppressed KeyError"],
  ],
},
/* ======================================================= MODULES */
{
  id: "modules", group: "Modules & Environment", title: "Modules, Packages, pip & venv",
  sub: "Organize code into files and folders, import it, install third-party packages, and isolate projects.",
  blocks: [
    ["code", R`
import math                        # import the whole module → use math.sqrt
from collections import Counter    # import one name → use Counter directly
from os import path as osp         # import with an alias
import itertools as it             # alias a whole module

print("math.sqrt(9) =", math.sqrt(9))
print("Counter('aab')['a'] =", Counter("aab")["a"])
print("it.repeat(0, 3) =", list(it.repeat(0, 3)))

def main():
    print("main() runs because this file was executed directly")

if __name__ == "__main__":         # True when you RUN this file, False when it's IMPORTED
    main()`, "math.sqrt(9) = 3.0\nCounter('aab')['a'] = 2\nit.repeat(0, 3) = [0, 0, 0]\nmain() runs because this file was executed directly"],
    ["h", "Package layout"],
    ["code", R`
# myproject/
# ├── main.py
# └── utils/
#     ├── __init__.py       # makes 'utils' a package (can be empty)
#     ├── math_tools.py
#     └── text_tools.py
#
# in main.py:
# from utils.math_tools import mean
# from utils import text_tools`, null, "project structure"],
    ["h", "Virtual environments & pip"],
    ["code", R`
python -m venv .venv                 # create an isolated environment in the folder .venv
.venv\Scripts\activate              # Windows   (macOS/Linux: source .venv/bin/activate)
pip install requests pytest          # install packages into THIS environment only
pip freeze > requirements.txt        # save the exact versions
pip install -r requirements.txt      # recreate the same environment elsewhere
deactivate                           # leave the environment`, null, "terminal"],
    ["tip", "Always use one virtual environment per project. Modern alternatives: `uv` (very fast), `poetry` and `pipx` for CLI tools."],
  ],
},
);
