NC.add("Tries", [
{
  id: "implement-trie-prefix-tree", t: "Implement Trie (Prefix Tree)", lc: 208, d: "Medium", p: "Trie",
  q: "Implement a `Trie` with:\n- `insert(word)`\n- `search(word)`: `True` if the exact word was inserted\n- `startsWith(prefix)`: `True` if any inserted word starts with `prefix`",
  ex: [["insert(\"apple\"), search(\"apple\"), search(\"app\"), startsWith(\"app\"), insert(\"app\"), search(\"app\")", "True, False, True, True", ""]],
  c: ["1 ≤ len ≤ 2000", "lowercase letters", "≤ 3·10^4 calls"],
  hint: "A tree where each edge is a character. The path from the root spells a prefix. Mark nodes where a word ends.",
  brute: {
    idea: "Store words in a set. `search` is O(1), but `startsWith` must scan every word.",
    code: R`
class Trie:
    def __init__(self):
        self.words = set()
    def insert(self, word: str) -> None:
        self.words.add(word)
    def search(self, word: str) -> bool:
        return word in self.words
    def startsWith(self, prefix: str) -> bool:
        return any(w.startswith(prefix) for w in self.words)    # O(total chars)`,
    tc: "startsWith O(N·L)", sc: "O(total chars)", bad: "Prefix queries are slow.",
  },
  opt: {
    idea: "Each `TrieNode` has `children` (dict char → node) and `end` (whether a word finishes here).\n- **insert:** walk down, creating missing children; mark the last node's `end = True`.\n- **search:** walk down; fail if a child is missing; finally require `end`.\n- **startsWith:** the same walk, but don't require `end`.",
    steps: ["node = root", "for c in word: node = node.children.setdefault(c, TrieNode())", "node.end = True", "search/startsWith share a _find(s) helper that returns the last node or None"],
    code: R`
class TrieNode:
    def __init__(self):
        self.children = {}          # char -> TrieNode
        self.end = False            # does a word end here?

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.end = True

    def _find(self, s):
        node = self.root
        for c in s:
            if c not in node.children:
                return None
            node = node.children[c]
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.end

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None`,
    tc: "O(L) per operation", tw: "L = length of the word/prefix.", sc: "O(total characters inserted)",
  },
  run: R`
t = Trie()
t.insert("apple")
print(t.search("apple"), t.search("app"), t.startsWith("app"))
t.insert("app")
print(t.search("app"))`,
  out: R`
True False True
True`,
  dry: ["insert apple: root → a → p → p → l → e (end)", "search app: reaches the 2nd p, but end = False → False", "startsWith app: the path exists → True", "insert app: mark the 2nd p as end → search app → True"],
  expl: [
    ["self.children = {}", "A dict is flexible (any chars). For lowercase only, an array of 26 is a bit faster."],
    ["node.end = True", "Distinguishes the full word \"app\" from the prefix \"app\" of \"apple\"."],
  ],
  take: "**Prefix queries, autocomplete, word dictionaries → Trie.** Operations cost O(word length), independent of how many words are stored.",
  mist: ["Forgetting the `end` flag (then search(\"app\") would wrongly be True)."],
},
{
  id: "design-add-and-search-words-data-structure", t: "Design Add and Search Words Data Structure", lc: 211, d: "Medium", p: "Trie + DFS (wildcard)",
  q: "Design `WordDictionary` with `addWord(word)` and `search(word)`, where `search` may contain `.` which matches **any one** letter.",
  ex: [["addWord(\"bad\"), addWord(\"dad\"), addWord(\"mad\"), search(\"pad\"), search(\"bad\"), search(\".ad\"), search(\"b..\")", "False, True, True, True", ""]],
  c: ["word length ≤ 25", "at most 2 dots per search", "≤ 10^4 calls"],
  hint: "Normal letters follow one child. For `.`, you must try **every** child, which means DFS/backtracking over the trie.",
  opt: {
    idea: "A trie for storage. `search` is a DFS `dfs(i, node)`:\n- If `i == len(word)` → return `node.end`.\n- If `word[i] == '.'` → try every child: if any `dfs(i+1, child)` succeeds → True.\n- Else follow the single child for `word[i]` (fail if it's missing).",
    steps: ["addWord: standard trie insert", "dfs(i, node): end of word → node.end", "'.' → any(dfs(i+1, ch) for ch in node.children.values())", "letter → child exists ? dfs(i+1, child) : False"],
    code: R`
class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        node = self.root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.end = True

    def search(self, word: str) -> bool:
        def dfs(i, node):
            if i == len(word):
                return node.end
            c = word[i]
            if c == ".":
                return any(dfs(i + 1, child) for child in node.children.values())
            if c not in node.children:
                return False
            return dfs(i + 1, node.children[c])
        return dfs(0, self.root)`,
    tc: "add O(L); search O(L) without dots, up to O(26^d · L) with d dots", sc: "O(total chars)",
  },
  run: R`
wd = WordDictionary()
for w in ["bad", "dad", "mad"]:
    wd.addWord(w)
print(wd.search("pad"), wd.search("bad"), wd.search(".ad"), wd.search("b.."))`,
  out: R`
False True True True`,
  dry: ["search \".ad\": '.' → try children b, d, m", "b → 'a' → 'd' → end ✓ → True (stops early thanks to any())"],
  expl: [
    ["node.children.setdefault(c, TrieNode())", "Returns the existing child, or inserts and returns a new one, all in one line."],
    ["any(dfs(...) for child in ...)", "`any` with a generator short-circuits on the first True."],
  ],
  take: "**Wildcards on a trie → DFS branching only at the wildcard positions.**",
  mist: ["Returning True as soon as the path ends without checking `end`."],
},
{
  id: "word-search-ii", t: "Word Search II", lc: 212, d: "Hard", p: "Trie + Grid Backtracking",
  q: "Given an `m × n` board of letters and a list of `words`, return all words that can be formed on the board. A word is built from **adjacent** cells (up/down/left/right), and a cell can't be used twice in one word.",
  ex: [["board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]", "[\"eat\",\"oath\"]", ""]],
  c: ["1 ≤ m, n ≤ 12", "≤ 3·10^4 words, each ≤ 10 chars"],
  hint: "Running Word Search I once per word repeats a lot of work. Put all words in a trie and run a single DFS from each cell that follows trie edges, so you explore all words at once.",
  brute: {
    idea: "For each word, do the Word Search I backtracking from every cell.",
    code: R`
class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        R, C = len(board), len(board[0])
        def exist(word):
            def dfs(r, c, i):
                if i == len(word):
                    return True
                if not (0 <= r < R and 0 <= c < C) or board[r][c] != word[i]:
                    return False
                tmp, board[r][c] = board[r][c], "#"
                found = any(dfs(r + dr, c + dc, i + 1) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))
                board[r][c] = tmp
                return found
            return any(dfs(r, c, 0) for r in range(R) for c in range(C))
        return sorted(w for w in set(words) if exist(w))`,
    tc: "O(W · m·n · 4^L)", sc: "O(L)", bad: "With 3·10^4 words this repeats the same board walks again and again.",
  },
  opt: {
    idea: "1. Insert all words into a **trie**, storing the full word at its end node.\n2. DFS from every cell, moving through the trie in parallel: from trie node `node`, step to the board neighbour whose letter is a child of `node`.\n3. When you reach a node with a stored word, add it to the result and clear it (to avoid duplicates).\n4. **Pruning:** after exploring, if a child has no children left and no word, delete it from the trie, so later searches don't revisit dead branches.",
    steps: ["Build trie; node.word = word at end", "for every cell: dfs(r, c, root)", "dfs: ch = board[r][c]; if ch not in node.children → return", "nxt = node.children[ch]; if nxt.word → record, nxt.word = None", "mark cell '#', recurse 4 neighbours, restore", "prune empty child"],
    code: R`
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        root = TrieNode()
        for w in words:
            node = root
            for c in w:
                node = node.children.setdefault(c, TrieNode())
            node.word = w

        R, C, res = len(board), len(board[0]), []

        def dfs(r, c, parent):
            ch = board[r][c]
            node = parent.children.get(ch)
            if not node:
                return
            if node.word:
                res.append(node.word)
                node.word = None                 # don't report twice
            board[r][c] = "#"                    # mark visited
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and board[nr][nc] != "#":
                    dfs(nr, nc, node)
            board[r][c] = ch                     # restore (backtrack)
            if not node.children and not node.word:
                del parent.children[ch]          # prune dead branch

        for r in range(R):
            for c in range(C):
                dfs(r, c, root)
        return sorted(res)`,
    tc: "O(m·n · 4 · 3^(L−1))", tw: "Each start cell explores at most 4·3^(L−1) paths (we never step back), bounded by the trie.", sc: "O(total chars in words)",
  },
  run: R`
board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
print(Solution().findWords(board, ["oath", "pea", "eat", "rain"]))`,
  out: R`
['eat', 'oath']`,
  dry: ["Trie holds oath, pea, eat, rain", "From (0,0) 'o' → 'a' (0,1) → 't' (1,1) → 'h' (2,1) → found \"oath\"", "From (1,3) 'e' → 'a' (1,2) → 't' (1,1) → found \"eat\"", "'p' isn't on the board, so the \"pea\" branch is never entered"],
  expl: [
    ["node.word = w", "Store the whole word at its terminal node, so there's no need to rebuild it from the path."],
    ["board[r][c] = \"#\"", "Mark in place instead of keeping a visited set, and restore after recursion."],
    ["del parent.children[ch]", "Pruning: huge speed-up when many words share prefixes."],
  ],
  take: "**Many words to search on the same board → put the words in a trie and do one combined DFS.**",
  mist: ["Forgetting to restore the cell after DFS.", "Reporting a word multiple times (clear node.word)."],
},
]);
