/* glossary.js — plain-English definitions shown when you hover/tap a jargon word.
   glossify(element) underlines the first occurrence of each term inside that element. */
window.GLOSSARY = {
  "time complexity": "How the running time grows as the input gets bigger, written in Big-O (e.g. O(n) means 'roughly proportional to n').",
  "space complexity": "How much extra memory an algorithm needs as the input grows (not counting the input itself).",
  "big-o": "Notation for the growth rate of work as input size n grows, ignoring constants. O(n²) means doubling n makes it about 4× slower.",
  "amortized": "Averaged over many operations. list.append is 'O(1) amortized': usually instant, occasionally slow when the list resizes, but cheap on average.",
  "hashable": "An object whose value can't change and can produce a fixed hash number, so it can be a dict key or set member (int, str, tuple: yes; list, dict, set: no).",
  "hash map": "A dictionary: stores key → value pairs and finds a key in about one step (O(1)) using a hash function instead of searching.",
  "hash set": "A set: stores unique items and answers 'is x in here?' in about one step (O(1)).",
  "hash function": "A function that turns a key into a number used to pick a storage slot, so lookups don't need to scan everything.",
  "collision": "When two different keys get the same hash slot; the table must store both (e.g. in a small list) and compare them.",
  "immutable": "Can't be changed after creation (str, int, tuple). 'Changing' it really creates a new object.",
  "mutable": "Can be changed in place (list, dict, set). Two names pointing to the same mutable object both see the change.",
  "iterable": "Anything you can loop over with for: lists, strings, dicts, files, ranges, generators…",
  "iterator": "An object that hands out items one at a time with next() and remembers where it is. Once used up, it's empty.",
  "generator": "A function that uses yield to produce values one at a time, lazily, instead of building a whole list in memory.",
  "lazy": "Computed only when needed, one item at a time. This saves memory (e.g. generators, range).",
  "closure": "An inner function that remembers variables from the outer function that created it, even after the outer function has finished.",
  "decorator": "A function that wraps another function to add behaviour. Writing @deco above def f means f = deco(f).",
  "lambda": "A tiny one-expression function without a name: lambda x: x * 2.",
  "first-class": "Functions are values: you can store them in variables, pass them to other functions and return them.",
  "scope": "The region of code where a variable name is visible (local, enclosing, global, built-in).",
  "nonlocal": "Keyword that lets an inner function reassign a variable that belongs to the enclosing function.",
  "recursion": "A function that calls itself on a smaller version of the problem until it reaches a simple base case.",
  "base case": "The smallest input a recursive function answers directly, without calling itself. It's what stops the recursion.",
  "call stack": "The pile of function calls currently running. Each call waits for the ones it made to return.",
  "memoization": "Caching a function's results so repeated calls with the same arguments return instantly instead of recomputing.",
  "dynamic programming": "Solving a problem by combining answers to smaller overlapping subproblems, computing each subproblem only once.",
  "subproblem": "A smaller version of the original problem whose answer helps build the full answer.",
  "recurrence": "A formula that defines an answer in terms of answers to smaller inputs, e.g. ways(n) = ways(n−1) + ways(n−2).",
  "greedy": "Making the choice that looks best right now at every step, never undoing it. Fast, but only correct for some problems.",
  "backtracking": "Trying choices one at a time, exploring further, and undoing (backtracking) a choice when it leads to a dead end.",
  "brute force": "The simplest correct approach that tries every possibility. Usually slow, but a good starting point.",
  "two pointers": "Using two indices that move through the data (often from both ends) to avoid a nested loop.",
  "sliding window": "A range [left, right] that slides over an array/string, adding on the right and removing on the left, so each step is O(1).",
  "prefix sum": "A running total array: prefix[i] = sum of the first i items. Any range sum becomes one subtraction.",
  "monotonic stack": "A stack kept in increasing or decreasing order. It quickly finds the 'next greater/smaller' element for each item.",
  "deque": "Double-ended queue: add or remove at both ends in O(1). Use collections.deque for queues and BFS.",
  "stack": "Last-in, first-out (LIFO) pile: you push onto the top and pop from the top, like a stack of plates.",
  "queue": "First-in, first-out (FIFO) line: add at the back, remove from the front, like people in a queue.",
  "heap": "A tree stored in a list that always gives you the smallest (min-heap) item in O(1) and adds/removes in O(log n).",
  "priority queue": "A queue where the item with the highest priority (e.g. smallest number) comes out first. Usually built with a heap.",
  "binary search": "Searching a sorted range by repeatedly checking the middle and throwing away the half that can't contain the answer.",
  "linked list": "A chain of nodes where each node stores a value and a pointer to the next node.",
  "pointer": "A reference to another object/node (in Python, simply a variable or attribute that refers to it).",
  "dummy node": "A fake starting node placed before the real head of a linked list, so you never need special cases for the head.",
  "binary tree": "A tree where every node has at most two children: left and right.",
  "binary search tree": "A binary tree where every value in the left subtree is smaller and every value in the right subtree is larger than the node.",
  "bst": "Binary Search Tree: left subtree < node < right subtree at every node.",
  "leaf": "A tree node with no children.",
  "subtree": "A node together with all of its descendants.",
  "depth": "How many edges a node is from the root.",
  "height": "The number of nodes (or edges) on the longest path from a node down to a leaf.",
  "inorder": "Tree traversal order: left subtree, node, right subtree. For a BST it gives sorted order.",
  "preorder": "Tree traversal order: node first, then left subtree, then right subtree.",
  "postorder": "Tree traversal order: left subtree, right subtree, then the node.",
  "level order": "Visiting a tree level by level from top to bottom (done with BFS and a queue).",
  "trie": "A prefix tree: each edge is a character, so words with the same prefix share a path. Great for autocomplete.",
  "graph": "A set of nodes (vertices) connected by edges. Maps, networks, dependencies and grids are all graphs.",
  "adjacency list": "Graph storage where each node maps to a list of its neighbours.",
  "bfs": "Breadth-First Search: explore level by level using a queue. Finds shortest paths in unweighted graphs.",
  "dfs": "Depth-First Search: go as deep as possible along one path before backtracking (recursion or a stack).",
  "topological sort": "An ordering of tasks so every prerequisite comes before the tasks that depend on it. Only possible without cycles.",
  "in-degree": "How many edges point INTO a node, i.e. how many prerequisites it has.",
  "cycle": "A path that starts and ends at the same node (or a linked list whose tail points back into the list).",
  "union-find": "A structure that tracks which items are in the same group, with fast 'merge two groups' and 'same group?' operations.",
  "dijkstra": "Shortest-path algorithm for graphs with non-negative weights: always expand the closest unfinished node (using a min-heap).",
  "relax": "In shortest paths: if going through u gives v a shorter distance, update dist[v].",
  "invariant": "A condition you keep true at every step of a loop. Reasoning about it proves the algorithm correct.",
  "edge case": "An unusual input that often breaks code: empty input, one element, all equal, negatives, very large values.",
  "in place": "Modifying the input directly using O(1) extra memory instead of building a new copy.",
  "stable sort": "A sort that keeps equal elements in their original relative order. Python's sort is stable.",
  "dunder": "'Double underscore' special methods like __init__ and __len__ that Python calls for built-in behaviour.",
  "duck typing": "Python cares what an object can DO (its methods), not what class it is.",
  "gil": "Global Interpreter Lock: in standard Python only one thread runs Python code at a time, so threads don't speed up CPU-heavy work.",
  "kadane": "Kadane's algorithm: for maximum subarray sum, either extend the current subarray or restart at the current element.",
  "dry run": "Executing the algorithm by hand on a small example, writing down the variables at each step, to check it works.",
};

window.glossify = function (root) {
  if (!root || !window.GLOSSARY) return;
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const re = new RegExp("\\b(" + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|") + ")\\b", "i");
  const used = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.parentElement.closest("code, pre, a, button, abbr, h1, .code-wrap, .viz, .chat-panel, summary, th, .crumbs, .badge, input, textarea, svg")
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    let text = node.nodeValue, m, frag = null, last = 0, guard = 0;
    const r = new RegExp(re.source, "gi");
    while ((m = r.exec(text)) && guard++ < 50) {
      const key = m[1].toLowerCase();
      if (used.has(key)) continue;
      used.add(key);
      frag = frag || document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const ab = document.createElement("abbr");
      ab.className = "gloss"; ab.tabIndex = 0; ab.textContent = m[1]; ab.dataset.def = GLOSSARY[key];
      frag.appendChild(ab);
      last = m.index + m[1].length;
    }
    if (frag) { frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag, node); }
  });
};

/* one floating tooltip shared by all terms (works on hover, focus and tap) */
(function () {
  const css = `abbr.gloss{text-decoration:underline dotted var(--accent);text-underline-offset:3px;cursor:help}
  .gloss-tip{position:fixed;z-index:120;max-width:320px;background:var(--text);color:var(--bg);font-size:var(--fs-sm);line-height:1.45;padding:.55rem .7rem;border-radius:var(--r-sm);box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none}
  .gloss-tip b{display:block;margin-bottom:.15rem;text-transform:capitalize}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  let tip = null;
  const show = (el) => {
    if (!tip) { tip = document.createElement("div"); tip.className = "gloss-tip"; document.body.appendChild(tip); }
    tip.innerHTML = `<b>${el.textContent}</b>${el.dataset.def}`;
    tip.hidden = false;
    const r = el.getBoundingClientRect(), w = Math.min(320, window.innerWidth - 20);
    tip.style.left = Math.max(10, Math.min(r.left, window.innerWidth - w - 10)) + "px";
    tip.style.top = (r.bottom + 8 + 120 > window.innerHeight ? r.top - tip.offsetHeight - 8 : r.bottom + 8) + "px";
  };
  const hide = () => { if (tip) tip.hidden = true; };
  document.addEventListener("mouseover", (e) => { const a = e.target.closest("abbr.gloss"); a ? show(a) : hide(); });
  document.addEventListener("focusin", (e) => { const a = e.target.closest("abbr.gloss"); if (a) show(a); });
  document.addEventListener("focusout", hide);
  window.addEventListener("scroll", hide, { passive: true });
})();
