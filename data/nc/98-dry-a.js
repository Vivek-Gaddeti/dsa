/* Clear, step-by-step dry runs (part A: Arrays & Hashing → Heap). Each step: [what happens, why]. */
(function () {
  const D = {
/* ================= ARRAYS & HASHING ================= */
"contains-duplicate": { on: "nums = [1, 2, 3, 1]", setup: "`seen` = the set of numbers we have already walked past.", steps: [
  ["x = 1 → is 1 in seen {}? **No** → add it → seen = {1}", "The first time we meet 1, so remember it."],
  ["x = 2 → not in {1} → seen = {1, 2}", "New number, remember it."],
  ["x = 3 → not in {1, 2} → seen = {1, 2, 3}", "New number, remember it."],
  ["x = 1 → **1 IS in seen** → return True", "We saw 1 earlier (index 0), so the array has a duplicate. We stop immediately without checking the rest."]],
  result: "`True`. The set made every \"have I seen this?\" check instant." },
"valid-anagram": { on: "s = \"anagram\", t = \"nagaram\"", setup: "`count[c]` = (how many times c appears in s) − (how many times c appears in t). For anagrams every count ends at 0.", steps: [
  ["len(s) = 7, len(t) = 7 → equal, keep going", "Strings of different lengths can never be anagrams."],
  ["Count s: count = {a: 3, n: 1, g: 1, r: 1, m: 1}", "Each letter of s adds 1."],
  ["Go through t: n → 0, a → 2, g → 0, a → 1, r → 0, a → 0, m → 0", "Each letter of t uses up one copy. A count never drops below 0, so t never uses a letter more often than s has it."],
  ["Loop ends without any negative count → return True", "Same length + nothing over-used = exactly the same letters."]],
  result: "`True`. (For \"rat\" vs \"car\": 'c' would go to −1 right away → False.)" },
"two-sum": { on: "nums = [3, 2, 4], target = 6", setup: "`pos` = {value: index} for numbers already seen. For each x we look for its partner `need = target − x`.", steps: [
  ["i = 0, x = 3 → need = 3. Is 3 in pos {}? No → store pos = {3: 0}", "Even though 3 + 3 = 6, there's only ONE 3 so far. We check before storing, so an element can't pair with itself."],
  ["i = 1, x = 2 → need = 4. Is 4 in pos {3: 0}? No → store pos = {3: 0, 2: 1}", "No partner yet, so remember 2 for later."],
  ["i = 2, x = 4 → need = 2. **2 is in pos at index 1** → return [1, 2]", "nums[1] + nums[2] = 2 + 4 = 6."]],
  result: "`[1, 2]`, found in a single pass." },
"group-anagrams": { on: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"] (keys shown as sorted letters for readability; the code uses an equivalent 26-count tuple)", setup: "`groups` = {key: list of words}. Every anagram produces the same key.", steps: [
  ["\"eat\" → key aet → groups = {aet: [eat]}", "New key, so a new group starts."],
  ["\"tea\" → key aet → {aet: [eat, tea]}", "Same letters → same key → same group."],
  ["\"tan\" → key ant → {aet: [eat, tea], ant: [tan]}", "Different letters → new group."],
  ["\"ate\" → aet → [eat, tea, ate];  \"nat\" → ant → [tan, nat]", "Each word joins its anagram family."],
  ["\"bat\" → key abt → new group [bat]", "No other word has these letters."]],
  result: "`[[eat, tea, ate], [tan, nat], [bat]]`" },
"top-k-frequent-elements": { on: "nums = [1, 1, 1, 2, 2, 3], k = 2", setup: "`buckets[f]` = the list of numbers that appear exactly f times.", steps: [
  ["Count: {1: 3, 2: 2, 3: 1}", "Counter does this in one pass."],
  ["Fill buckets: buckets[3] = [1], buckets[2] = [2], buckets[1] = [3]", "The index IS the frequency, so the buckets are already in frequency order. No sorting needed."],
  ["Walk from the highest frequency down: 6, 5, 4 → empty", "No number appears that often."],
  ["freq 3 → take 1 → res = [1]", "The most frequent number."],
  ["freq 2 → take 2 → res = [1, 2] → len(res) == k → stop", "We have the k most frequent."]],
  result: "`[1, 2]` in O(n)." },
"encode-and-decode-strings": { on: "[\"neet\", \"code\"] and the tricky [\"a#b\"]", setup: "Each word is written as `<length>#<word>`. While decoding, `i` points at the start of the next length.", steps: [
  ["encode → \"4#neet4#code\"", "Each word is prefixed with its length and a #."],
  ["decode, i = 0: read digits up to the '#' at index 1 → length 4 → word = s[2:6] = \"neet\" → i = 6", "We know EXACTLY how many characters to take, whatever they are."],
  ["i = 6: digits \"4\", '#' at 7 → word = s[8:12] = \"code\" → i = 12 = end", "Done."],
  ["Tricky case: [\"a#b\"] → \"3#a#b\" → read 3 → take \"a#b\" (3 chars)", "The '#' inside the word is never mistaken for a separator, because we never look for '#' inside the word."]],
  result: "The original list comes back unchanged, even when words contain '#' or digits." },
"product-of-array-except-self": { on: "nums = [1, 2, 3, 4]", setup: "Pass 1 stores in `ans[i]` the product of everything **left** of i. Pass 2 multiplies in the product of everything **right** of i (kept in `suffix`).", steps: [
  ["Left pass: i=0 → ans[0] = 1 (nothing on the left), prefix becomes 1", "Assign first, THEN multiply, so ans[i] never includes nums[i] itself."],
  ["i=1 → ans[1] = 1, prefix = 2;  i=2 → ans[2] = 2, prefix = 6;  i=3 → ans[3] = 6", "After pass 1: ans = [1, 1, 2, 6]"],
  ["Right pass: i=3 → ans[3] = 6 × 1 = 6, suffix = 4", "Nothing is on the right of the last element."],
  ["i=2 → ans[2] = 2 × 4 = 8, suffix = 12;  i=1 → 1 × 12 = 12, suffix = 24;  i=0 → 1 × 24 = 24", "Each position now holds left product × right product."]],
  result: "`[24, 12, 8, 6]` with no division." },
"valid-sudoku": { on: "the example board after changing the top-left cell to '8'", setup: "9 sets for rows, 9 for columns, 9 for boxes. The box number of cell (r, c) is `(r // 3) * 3 + c // 3`.", steps: [
  ["(0,0) = '8' → box (0//3)*3 + 0//3 = 0 → add 8 to rows[0], cols[0], boxes[0]", "First 8 we've seen anywhere."],
  ["(0,1) '3', (0,4) '7', row 1 … (2,1) '9' → all new → added", "No repeats yet. Empty '.' cells are skipped."],
  ["(2,2) = '8' → box = (2//3)*3 + 2//3 = 0 → **8 is already in boxes[0]**", "The top-left 3×3 box now has two 8s."],
  ["return False", "One violation is enough."]],
  result: "`False` (the unmodified board returns `True`)." },
"longest-consecutive-sequence": { on: "nums = [100, 4, 200, 1, 3, 2]", setup: "`s` = set of all numbers. We only start counting from a number x whose `x − 1` is NOT in the set (the start of a run).", steps: [
  ["x = 100 → 99 not in s → start. 101 in s? No → run length 1", "100 stands alone."],
  ["x = 4 → 3 IS in s → skip", "4 isn't the start of its run, and counting from here would repeat work."],
  ["x = 200 → 199 not in s → start → length 1", "Alone."],
  ["x = 1 → 0 not in s → start → 2 ✓ 3 ✓ 4 ✓ 5 ✗ → length 4", "This is the real run 1, 2, 3, 4."],
  ["x = 3, x = 2 → their predecessors exist → skip", "Already counted inside 1's run."]],
  result: "`4`. Each number is counted once in total, so the whole thing is O(n)." },
/* ================= TWO POINTERS ================= */
"valid-palindrome": { on: "s = \"race a car\"", setup: "`l` starts at the left end and `r` at the right end. We skip anything that isn't a letter or digit, compare lowercase letters, and move inward.", steps: [
  ["l → 'r', r → 'r' → equal → move both in", "Matching outer letters."],
  ["l → 'a', r → 'a' → equal;  l → 'c', r → 'c' → equal", "Still mirrored."],
  ["l → 'e' (index 3), r → ' ' (index 6) is not alphanumeric → r skips to 'a' (index 5)", "Spaces are ignored."],
  ["'e' vs 'a' → **different** → return False", "The cleaned text \"raceacar\" is not a mirror image."]],
  result: "`False` (\"A man, a plan, a canal: Panama\" gives `True`)." },
"two-sum-ii-input-array-is-sorted": { on: "numbers = [2, 7, 11, 15], target = 9", setup: "`l` = smallest candidate, `r` = largest. If the sum is too big, only moving r left can make it smaller (and vice versa).", steps: [
  ["l = 0 (2), r = 3 (15) → 17 > 9 → r = 2", "15 is too big even with the smallest partner, so it can't be in the answer."],
  ["l = 0 (2), r = 2 (11) → 13 > 9 → r = 1", "Same reasoning: drop 11."],
  ["l = 0 (2), r = 1 (7) → 9 = target ✓", "Found it."]],
  result: "`[1, 2]` (1-indexed)." },
"3sum": { on: "nums = [-1, 0, 1, 2, -1, -4] → sorted [-4, -1, -1, 0, 1, 2]", setup: "Fix the first number `a = nums[i]`, then two pointers `l`, `r` search the rest for a pair summing to −a.", steps: [
  ["i = 0 (a = −4): need pair = 4. Largest pair is 1 + 2 = 3 < 4 → l keeps moving right → nothing", "−4 can't be in any zero-sum triplet."],
  ["i = 1 (a = −1): l = −1, r = 2 → −1 −1 + 2 = 0 ✓ record [−1, −1, 2]; move l, skipping duplicates", "First triplet."],
  ["l = 0, r = 2 → −1 + 0 + 2 = 1 > 0 → r moves to 1 → −1 + 0 + 1 = 0 ✓ record [−1, 0, 1]", "Second triplet."],
  ["i = 2 (a = −1 again) → same as previous a → skip", "It would only produce the same triplets again."],
  ["i = 3 (a = 0): l = 1, r = 2 → 0 + 1 + 2 = 3 > 0 → r moves → pointers meet", "No more triplets."]],
  result: "`[[-1, -1, 2], [-1, 0, 1]]`" },
"container-with-most-water": { on: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", setup: "Area = min(height[l], height[r]) × (r − l). We always move the SHORTER wall inward.", steps: [
  ["l = 0 (1), r = 8 (7) → area = 1 × 8 = 8 → best 8 → move l (1 is shorter)", "The short wall limits the water. A container using it can never beat this one, because every other partner is closer."],
  ["l = 1 (8), r = 8 (7) → area = 7 × 7 = **49** → best 49 → move r (7 < 8)", "The biggest container."],
  ["l = 1 (8), r = 7 (3) → 3 × 6 = 18 → move r", "Smaller."],
  ["l = 1 (8), r = 6 (8) → 8 × 5 = 40 → tie, move r …", "Still less than 49."],
  ["… the pointers meet without beating 49", "Every remaining pair is narrower and no taller."]],
  result: "`49`" },
"trapping-rain-water": { on: "height = [4, 2, 0, 3, 2, 5]", setup: "`left_max` / `right_max` = tallest wall seen from each side. The side with the smaller max decides how much water sits at the next position.", steps: [
  ["Start: l = 0, r = 5, left_max = 4, right_max = 5", "4 < 5, so the left side is the bottleneck."],
  ["l → 1 (height 2): water += 4 − 2 = **2**", "There's a wall of 4 on the left and at least 5 on the right, so the water level is 4."],
  ["l → 2 (height 0): water += 4 − 0 = **4** (total 6)", "Same level 4."],
  ["l → 3 (height 3): water += 4 − 3 = **1** (total 7)", ""],
  ["l → 4 (height 2): water += 4 − 2 = **2** (total 9) → l meets r", "Done."]],
  result: "`9` units of water." },
/* ================= SLIDING WINDOW ================= */
"best-time-to-buy-and-sell-stock": { on: "prices = [7, 1, 5, 3, 6, 4]", setup: "`min_price` = cheapest day so far (the best day to have bought). `best` = best profit so far.", steps: [
  ["day 0: price 7 → min_price 7 → profit today 0", "Can't sell before buying."],
  ["day 1: price 1 → min_price becomes **1**", "A cheaper buying day."],
  ["day 2: price 5 → profit 5 − 1 = 4 → best 4", ""],
  ["day 3: price 3 → profit 2 → best stays 4", ""],
  ["day 4: price 6 → profit 6 − 1 = **5** → best 5", "Buy on day 1, sell on day 4."],
  ["day 5: price 4 → profit 3 → best stays 5", ""]],
  result: "`5`" },
"longest-substring-without-repeating-characters": { on: "s = \"pwwkew\"", setup: "Window `s[l..r]` always has no repeated letters. `chars` = the letters currently in the window.", steps: [
  ["r = 0 'p' → window \"p\" → best 1", ""],
  ["r = 1 'w' → window \"pw\" → best 2", ""],
  ["r = 2 'w' → 'w' already inside → remove 'p' (l = 1), still 'w' → remove 'w' (l = 2) → add → window \"w\"", "We shrink from the left until the duplicate is gone."],
  ["r = 3 'k' → \"wk\";  r = 4 'e' → \"wke\" → best **3**", ""],
  ["r = 5 'w' → duplicate → remove 'w' (l = 3) → window \"kew\" → length 3", "It ties the best but doesn't beat it."]],
  result: "`3` (\"wke\")." },
"longest-repeating-character-replacement": { on: "s = \"AABABBA\", k = 1", setup: "In a window, the letters that aren't the most common one must be replaced. The window is valid while `length − maxf ≤ k`, where maxf = the count of the most common letter.", steps: [
  ["r = 0..3: window \"AABA\" → A:3, B:1 → 4 − 3 = 1 ≤ 1 → valid → best **4**", "Replace the one B to get AAAA."],
  ["r = 4 'B': \"AABAB\" → 5 − 3 = 2 > 1 → slide: drop s[0] 'A', l = 1", "Two letters would need replacing, which is too many. The window slides forward while keeping its size."],
  ["r = 5 'B': \"ABABB\" (l = 1) → B:3 → 5 − 3 = 2 > 1 → drop 'A', l = 2", "Still too many."],
  ["r = 6 'A': \"BABBA\" (l = 2) → 5 − 3 = 2 > 1 → drop 'B', l = 3", "Never valid at size 5."]],
  result: "`4`" },
"permutation-in-string": { on: "s1 = \"ab\", s2 = \"eidbaooo\"", setup: "`need` = letter counts of s1. `win` = letter counts of the current window of size 2 in s2.", steps: [
  ["need = {a:1, b:1}. First window \"ei\" → not equal", ""],
  ["slide: \"id\" (add d, remove e) → not equal", "Each slide changes just two counts."],
  ["slide: \"db\" → not equal", ""],
  ["slide: \"ba\" → {a:1, b:1} == need ✓ → return True", "\"ba\" is a permutation of \"ab\"."]],
  result: "`True`" },
"minimum-window-substring": { on: "s = \"ADOBECODEBANC\", t = \"ABC\"", setup: "`have` = how many of the required letters (A, B, C) are currently satisfied. When have == 3 the window is valid, so we try shrinking it.", steps: [
  ["Expand r up to index 5: \"ADOBEC\" contains A, B, C → valid → record length 6", "First valid window."],
  ["Shrink: removing 'A' (index 0) breaks it → have = 2, l = 1", "Without A it's no longer valid, so we expand again."],
  ["Expand to r = 10 ('A'): \"DOBECODEBA\" is valid again → shrink D, O, B, E (each keeps it valid, but none is shorter than 6) → removing 'C' breaks it, l = 6", "These windows are valid but not better."],
  ["Expand to r = 12 ('C'): \"ODEBANC\" → shrink O, D → \"EBANC\" (5) → record; remove E → \"BANC\" (4) → record", "Shorter and shorter while still valid."],
  ["Removing 'B' breaks the window → end of the string", "Nothing shorter exists."]],
  result: "`\"BANC\"`" },
"sliding-window-maximum": { on: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3 (deque shown as values)", setup: "The deque holds candidate indices with DECREASING values. Its front is the max of the current window.", steps: [
  ["1 → [1];  3 → pop 1 (smaller and older) → [3]", "1 can never be a max while 3 is in the window."],
  ["−1 → [3, −1] → first full window → max **3**", ""],
  ["−3 → [3, −1, −3] → max **3**", ""],
  ["5 → pops −3, −1, 3 → [5] → max **5**", "5 beats everyone."],
  ["3 → [5, 3] → max **5**;  6 → [6] → max **6**;  7 → [7] → max **7**", ""]],
  result: "`[3, 3, 5, 5, 6, 7]`" },
/* ================= STACK ================= */
"valid-parentheses": { on: "s = \"([])\" and s = \"([)]\"", setup: "The stack holds opening brackets that still need closing. The top is the one that must close next.", steps: [
  ["\"([])\": '(' push → ['(']; '[' push → ['(', '[']", "Openers wait on the stack."],
  ["']' → top is '[' ✓ pop → ['(']", "It closes the most recent opener."],
  ["')' → top is '(' ✓ pop → [] → end with an empty stack → True", "Everything was closed in the right order."],
  ["\"([)]\": '(' '[' pushed, then ')' → top is '[' ✗ → False", "We tried to close '(' while '[' was still open."]],
  result: "`True` for \"([])\", `False` for \"([)]\"." },
"min-stack": { on: "push(−2), push(0), push(−3), getMin, pop, top, getMin", setup: "Two stacks move together: `stack` holds the values, and `mins[i]` = the smallest value among stack[0..i].", steps: [
  ["push(−2) → stack [−2], mins [−2]", ""],
  ["push(0) → stack [−2, 0], mins [−2, −2]", "The min is still −2."],
  ["push(−3) → stack [−2, 0, −3], mins [−2, −2, −3] → getMin() = **−3**", ""],
  ["pop() → stack [−2, 0], mins [−2, −2]", "The old min (−2) comes back automatically."],
  ["top() = **0**, getMin() = **−2**", ""]],
  result: "−3, 0, −2. Every operation is O(1)." },
"evaluate-reverse-polish-notation": { on: "[\"4\", \"13\", \"5\", \"/\", \"+\"]", setup: "Numbers go on a stack. An operator pops the top two numbers (right operand first), computes, and pushes the result.", steps: [
  ["4 → [4];  13 → [4, 13];  5 → [4, 13, 5]", "Numbers wait."],
  ["'/' → b = 5, a = 13 → int(13 / 5) = 2 → [4, 2]", "Division truncates toward zero."],
  ["'+' → b = 2, a = 4 → 6 → [6]", ""]],
  result: "`6`" },
"generate-parentheses": { on: "n = 2", setup: "We build a string one character at a time. Add '(' if open < n, and add ')' only if close < open, so the string is always a valid prefix.", steps: [
  ["\"\" → \"(\" → \"((\" (open = 2, can't open more) → \"(()\" → \"(())\" ✓", "The first complete string."],
  ["Backtrack to \"(\" → add ')' → \"()\"", "Try the other choice."],
  ["\"()\" → \"()(\" → \"()()\" ✓", "The second complete string."],
  ["\")…\" is never tried", "close < open fails at the start, so invalid strings are never built."]],
  result: "`[\"(())\", \"()()\"]`" },
"daily-temperatures": { on: "[73, 74, 75, 71, 69, 72, 76, 73] (stack shows temps)", setup: "The stack holds the days still waiting for a warmer day (temperatures decreasing from bottom to top).", steps: [
  ["73 → [73];  74 > 73 → pop day 0 → ans[0] = 1 → [74]", "Day 1 is warmer than day 0."],
  ["75 → pop 74 → ans[1] = 1 → [75]", ""],
  ["71 → [75, 71];  69 → [75, 71, 69]", "Colder days just wait."],
  ["72 → pop 69 (ans[4] = 1), pop 71 (ans[3] = 2) → [75, 72]", "One warm day answers several waiting days."],
  ["76 → pop 72 (ans[5] = 1), pop 75 (ans[2] = 4) → [76];  73 → [76, 73]", "Days left on the stack never get warmer → 0."]],
  result: "`[1, 1, 4, 2, 1, 1, 0, 0]`" },
"car-fleet": { on: "target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]", setup: "Cars are sorted closest-to-target first. `time` = when the car would arrive alone. The stack holds the arrival times of the fleets so far.", steps: [
  ["pos 10: time (12−10)/2 = 1 → stack [1]", "The leading car forms a fleet."],
  ["pos 8: time 1 ≤ 1 → joins that fleet", "It catches up exactly at the target."],
  ["pos 5: time 7 > 1 → new fleet → [1, 7]", "Too slow to catch up."],
  ["pos 3: time 3 ≤ 7 → joins the fleet ahead (the 7)", "It's faster, but gets blocked behind the slow car."],
  ["pos 0: time 12 > 7 → new fleet → [1, 7, 12]", ""]],
  result: "`3` fleets." },
"largest-rectangle-in-histogram": { on: "heights = [2, 1, 5, 6, 2, 3]", setup: "The stack holds (start index, height) with increasing heights. When a shorter bar arrives, taller bars can't extend further right, so we compute their areas.", steps: [
  ["2 → [(0,2)];  1 arrives → pop (0,2): area 2 × 1 = 2 → push (0,1)", "The 1 can extend left to index 0, because everything there was taller."],
  ["5 → [(0,1),(2,5)];  6 → [(0,1),(2,5),(3,6)]", "Increasing, so just push."],
  ["2 arrives (i = 4) → pop (3,6): 6 × 1 = 6; pop (2,5): 5 × 2 = **10** → push (2,2)", "Bars 5 and 6 together make the 5 × 2 rectangle."],
  ["3 → push (5,3)", ""],
  ["End: (5,3) → 3 × 1;  (2,2) → 2 × 4 = 8;  (0,1) → 1 × 6 = 6", "The remaining bars extend to the end."]],
  result: "`10`" },
/* ================= BINARY SEARCH ================= */
"binary-search": { on: "nums = [-1, 0, 3, 5, 9, 12], target = 9", setup: "The answer, if it exists, is always inside `[lo, hi]`.", steps: [
  ["lo = 0, hi = 5 → mid = 2 → nums[2] = 3 < 9 → lo = 3", "9 must be to the right of 3."],
  ["lo = 3, hi = 5 → mid = 4 → nums[4] = 9 ✓ → return 4", "Found in 2 checks instead of 5."]],
  result: "`4`" },
"search-a-2d-matrix": { on: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", setup: "Treat the 12 cells as one sorted list. Index k is cell `divmod(k, 4)`.", steps: [
  ["lo 0, hi 11 → mid 5 → (1,1) = 11 > 3 → hi = 4", ""],
  ["lo 0, hi 4 → mid 2 → (0,2) = 5 > 3 → hi = 1", ""],
  ["lo 0, hi 1 → mid 0 → (0,0) = 1 < 3 → lo = 1", ""],
  ["lo 1, hi 1 → mid 1 → (0,1) = 3 ✓", ""]],
  result: "`True`" },
"koko-eating-bananas": { on: "piles = [3, 6, 7, 11], h = 8", setup: "We binary search the SPEED k in [1, 11]. `hours(k)` = Σ ceil(pile / k). Is it ≤ 8?", steps: [
  ["k = 6 → 1 + 1 + 2 + 2 = 6 hours ≤ 8 ✓ → hi = 6", "Fast enough, so maybe a slower speed also works."],
  ["k = 3 → 1 + 2 + 3 + 4 = 10 > 8 ✗ → lo = 4", "Too slow."],
  ["k = 5 → 1 + 2 + 2 + 3 = 8 ✓ → hi = 5", ""],
  ["k = 4 → 1 + 2 + 2 + 3 = 8 ✓ → hi = 4 → lo == hi", "4 is the slowest speed that works."]],
  result: "`4`" },
"find-minimum-in-rotated-sorted-array": { on: "nums = [4, 5, 6, 7, 0, 1, 2]", setup: "Compare the middle with the right end. If middle > right, the \"drop\" (the minimum) is to the right of mid.", steps: [
  ["lo 0, hi 6, mid 3 → 7 > 2 → lo = 4", "The drop is right of 7."],
  ["lo 4, hi 6, mid 5 → 1 ≤ 2 → hi = 5", "[1..2] is sorted, so the min is at mid or left of it."],
  ["lo 4, hi 5, mid 4 → 0 ≤ 1 → hi = 4 → stop", ""]],
  result: "`0`" },
"search-in-rotated-sorted-array": { on: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0", setup: "At every mid, one half is normally sorted. Check whether the target lies inside that sorted half.", steps: [
  ["mid 3 (7): left half [4..7] is sorted. Is 4 ≤ 0 < 7? No → search right → lo = 4", "0 can't be in the sorted left part."],
  ["mid 5 (1): left half [0..1] is sorted. Is 0 ≤ 0 < 1? Yes → hi = 4", ""],
  ["mid 4 → nums[4] = 0 ✓", ""]],
  result: "`4`" },
"time-based-key-value-store": { on: "set(foo, bar, 1) … get(foo, 3) … set(foo, bar2, 4) … get(foo, 5)", setup: "store[\"foo\"] is a list of (time, value) in increasing time order. get = binary search for the LAST time ≤ t.", steps: [
  ["get(foo, 3): list [(1, bar)] → time 1 ≤ 3 → candidate bar → done", "Nothing later exists yet."],
  ["After set at time 4: list [(1, bar), (4, bar2)]", ""],
  ["get(foo, 5): mid 0 → 1 ≤ 5 → res bar, go right; mid 1 → 4 ≤ 5 → res bar2, go right → done", "Keep the latest time that is still ≤ t."],
  ["get(foo, 0): no time ≤ 0 → \"\"", ""]],
  result: "bar, bar, bar2, bar2, \"\"" },
"median-of-two-sorted-arrays": { on: "A = [1, 2], B = [3, 4], half = 2", setup: "Take `i` elements from A and `j = half − i` from B for the left half. It's correct when every left element ≤ every right element.", steps: [
  ["i = 1, j = 1 → left {1, 3}, right {2, 4}. Is B's left (3) ≤ A's right (2)? No", "We took too few from A."],
  ["→ lo = 2 → i = 2, j = 0 → left {1, 2}, right {3, 4} ✓", "Every left value ≤ every right value."],
  ["Even total → (max(left) + min(right)) / 2 = (2 + 3) / 2", ""]],
  result: "`2.5`" },
/* ================= LINKED LIST ================= */
"reverse-linked-list": { on: "1 → 2 → 3", setup: "`prev` = the already-reversed part, `curr` = the next node to flip.", steps: [
  ["prev = None, curr = 1 → save nxt = 2 → 1.next = None → prev = 1, curr = 2", "Reversed part: 1"],
  ["save nxt = 3 → 2.next = 1 → prev = 2, curr = 3", "Reversed: 2 → 1"],
  ["save nxt = None → 3.next = 2 → prev = 3, curr = None", "Reversed: 3 → 2 → 1"],
  ["curr is None → return prev (3)", ""]],
  result: "`3 → 2 → 1`" },
"merge-two-sorted-lists": { on: "1 → 2 → 4 and 1 → 3 → 4", setup: "`tail` = the end of the merged list (starting at a dummy). We always attach the smaller head.", steps: [
  ["1 vs 1 → take list1's 1;  2 vs 1 → take list2's 1", "On a tie, the first list goes first."],
  ["2 vs 3 → take 2;  4 vs 3 → take 3", ""],
  ["4 vs 4 → take list1's 4 → list1 is empty", ""],
  ["Attach the rest of list2 (4)", "It's already sorted."]],
  result: "`1 → 1 → 2 → 3 → 4 → 4`" },
"reorder-list": { on: "1 → 2 → 3 → 4 → 5", setup: "Three phases: find the middle, reverse the second half, then weave the two halves together.", steps: [
  ["Middle: slow stops at 3 → first = 1→2→3, second = 4→5 (cut after 3)", ""],
  ["Reverse second → 5 → 4", ""],
  ["Weave: 1 → 5, 5 → 2;  2 → 4, 4 → 3", "Take one node from each list, alternating."]],
  result: "`1 → 5 → 2 → 4 → 3`" },
"remove-nth-node-from-end-of-list": { on: "1 → 2 → 3 → 4 → 5, n = 2", setup: "`right` starts n nodes ahead of `left` (which starts at a dummy). When right falls off the end, left is just before the target.", steps: [
  ["right moves 2 steps → right at 3, left at dummy", "Creates a gap of 2."],
  ["Move both: (left 1, right 4) → (left 2, right 5) → (left 3, right None)", "The gap stays 2."],
  ["left = 3 → 3.next = 3.next.next → skip 4", "4 is the 2nd node from the end."]],
  result: "`1 → 2 → 3 → 5`" },
"copy-list-with-random-pointer": { on: "7 → 13 → 11 → 10 → 1 with random pointers", setup: "`old_to_new` maps each original node to its copy (plus None → None).", steps: [
  ["Pass 1: create copies 7', 13', 11', 10', 1' (values only)", "Now every copy exists before we link anything."],
  ["Pass 2: 7'.next = map[13] = 13';  7'.random = map[None] = None", ""],
  ["13'.next = 11';  13'.random = map[7] = 7' …", "Every pointer is translated to point at copies."]],
  result: "A fully separate copy with the same structure." },
"add-two-numbers": { on: "[2, 4, 3] + [5, 6, 4] (342 + 465)", setup: "Add digit by digit from the ones place (the head), carrying over like on paper.", steps: [
  ["2 + 5 + 0 = 7 → digit 7, carry 0", ""],
  ["4 + 6 + 0 = 10 → digit 0, carry 1", ""],
  ["3 + 4 + 1 = 8 → digit 8, carry 0", ""],
  ["Both lists empty and carry 0 → stop", ""]],
  result: "`[7, 0, 8]` (= 807)" },
"linked-list-cycle": { on: "3 → 2 → 0 → −4 → (back to 2)", setup: "slow moves 1 step, fast moves 2 steps.", steps: [
  ["Start: slow = 3, fast = 3", ""],
  ["Step 1: slow = 2, fast = 0", ""],
  ["Step 2: slow = 0, fast = 2 (via −4 → back to 2)", "Fast is now lapping inside the loop."],
  ["Step 3: slow = −4, fast = −4 → **they meet** → True", "In a loop, fast gains 1 step per move, so it must catch slow."]],
  result: "`True`" },
"find-the-duplicate-number": { on: "nums = [1, 3, 4, 2, 2] (think: index → nums[index] is a 'next' pointer)", setup: "Following 0 → 1 → 3 → 2 → 4 → 2 → 4 … the path loops between 2 and 4. The loop's entrance is the duplicate.", steps: [
  ["Phase 1: slow 1, fast 3 → slow 3, fast 4 → slow 2, fast 4 → slow 4, fast 4 → meet at 4", "slow = nums[slow], fast = nums[nums[fast]]."],
  ["Phase 2: slow2 = 0. Move both one step: (2, 1) → (4, 3) → (2, 2) → equal", "They meet exactly at the loop's entrance."]],
  result: "`2`" },
"lru-cache": { on: "capacity 2: put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)", setup: "The list is ordered least-recent → most-recent. The dict finds any node instantly.", steps: [
  ["put 1, put 2 → [1, 2]", ""],
  ["get(1) → returns 1 and moves 1 to the end → [2, 1]", "1 is now the most recently used."],
  ["put(3) → [2, 1, 3] is over capacity → evict the front (2) → [1, 3]", "2 was the least recently used."],
  ["get(2) → −1 (evicted)", ""],
  ["put(4) → evict 1 → [3, 4];  get(1) = −1, get(3) = 3, get(4) = 4", ""]],
  result: "1, −1, −1, 3, 4" },
"merge-k-sorted-lists": { on: "[1→4→5], [1→3→4], [2→6]", setup: "The min-heap holds the current head of each list as (value, list index, node).", steps: [
  ["Heap: (1,0) (1,1) (2,2) → pop (1,0) → output 1, push list 0's next (4)", "The smallest head overall."],
  ["pop (1,1) → output 1, push 3;  pop (2,2) → output 2, push 6", ""],
  ["pop 3 → push list 1's 4;  pop (4,0) → push 5;  pop (4,1)", "On a tie, the list index decides."],
  ["pop 5, pop 6 → heap empty", ""]],
  result: "`1 → 1 → 2 → 3 → 4 → 4 → 5 → 6`" },
"reverse-nodes-in-k-group": { on: "1 → 2 → 3 → 4 → 5, k = 2", setup: "`group_prev` = the node before the current group. We find the k-th node, reverse the group, and reconnect it.", steps: [
  ["Group [1, 2] → reversed → dummy → 2 → 1 → 3 …", "1 becomes the group's tail and the next group_prev."],
  ["Group [3, 4] → reversed → … 1 → 4 → 3 → 5", ""],
  ["Only [5] left (fewer than 2) → leave it", ""]],
  result: "`2 → 1 → 4 → 3 → 5`" },
/* ================= TREES ================= */
"invert-binary-tree": { on: "[4, 2, 7, 1, 3, 6, 9]", setup: "At every node, swap its left and right children, then do the same inside both subtrees.", steps: [
  ["At 4: swap 2 ↔ 7 → left = 7, right = 2", ""],
  ["At 7: swap 6 ↔ 9 → 9, 6", ""],
  ["At 2: swap 1 ↔ 3 → 3, 1", ""]],
  result: "`[4, 7, 2, 9, 6, 3, 1]`" },
"maximum-depth-of-binary-tree": { on: "[3, 9, 20, null, null, 15, 7]", setup: "depth(node) = 1 + the deeper of its two subtrees. An empty subtree has depth 0.", steps: [
  ["depth(9) = 1 + max(0, 0) = 1", "A leaf."],
  ["depth(15) = 1, depth(7) = 1 → depth(20) = 1 + 1 = 2", ""],
  ["depth(3) = 1 + max(1, 2) = 3", ""]],
  result: "`3`" },
"diameter-of-binary-tree": { on: "[1, 2, 3, 4, 5]", setup: "Each call returns the node's HEIGHT. Along the way, `best` = the longest path that bends at some node (left height + right height).", steps: [
  ["Leaves 4, 5, 3 → height 1 each", ""],
  ["At 2: left 1 + right 1 = 2 → best 2 → returns height 2", "Path 4 – 2 – 5."],
  ["At 1: left 2 + right 1 = **3** → best 3", "Path 4 – 2 – 1 – 3 (3 edges)."]],
  result: "`3`" },
"balanced-binary-tree": { on: "[1, 2, 2, 3, 3, null, null, 4, 4]", setup: "Return the height, or −1 as soon as any subtree is unbalanced.", steps: [
  ["Bottom 3-node (with 4, 4) → height 2;  the other 3 → height 1", ""],
  ["Left 2: heights 2 and 1 → OK (difference 1) → height 3", ""],
  ["Root: left 3, right (just a 2) 1 → difference 2 → −1", "It's unbalanced at the root."]],
  result: "`False`" },
"same-tree": { on: "p = [1, 2], q = [1, null, 2]", setup: "Walk both trees together, node by node.", steps: [
  ["Roots: 1 == 1 ✓ → compare the left children", ""],
  ["p.left = 2, q.left = None → one is empty and the other isn't → False", "The shapes differ."]],
  result: "`False`" },
"subtree-of-another-tree": { on: "root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]", setup: "At every node of root, ask: is the tree starting here identical to subRoot?", steps: [
  ["At 3: same(3-tree, 4-tree)? 3 ≠ 4 → no → go into the children", ""],
  ["At 4: 4 = 4, 1 = 1, 2 = 2, all leaves match → yes", ""]],
  result: "`True`" },
"lowest-common-ancestor-of-a-binary-search-tree": { on: "BST [6, 2, 8, 0, 4, 7, 9, _, _, 3, 5], p = 3, q = 5", setup: "Use BST order: if both values are smaller, go left; if both are bigger, go right; otherwise they split here.", steps: [
  ["At 6: 3 and 5 are both < 6 → go left", ""],
  ["At 2: both > 2 → go right", ""],
  ["At 4: 3 < 4 < 5 → they split → LCA = 4", ""]],
  result: "`4` (for p = 2, q = 8 the split happens at the root → 6)" },
"binary-tree-level-order-traversal": { on: "[3, 9, 20, null, null, 15, 7]", setup: "The queue holds exactly one level at the start of each round.", steps: [
  ["Round 1: queue [3] → level [3] → queue becomes [9, 20]", ""],
  ["Round 2: [9, 20] → level [9, 20] → queue [15, 7]", "9 has no children."],
  ["Round 3: [15, 7] → level [15, 7] → queue empty", ""]],
  result: "`[[3], [9, 20], [15, 7]]`" },
"binary-tree-right-side-view": { on: "[1, 2, 3, null, 5, null, 4]", setup: "Level-order BFS. The LAST node of each level is the one visible from the right.", steps: [
  ["Level [1] → see 1", ""],
  ["Level [2, 3] → see 3", ""],
  ["Level [5, 4] → see 4", "5 is hidden behind 4."]],
  result: "`[1, 3, 4]`" },
"count-good-nodes-in-binary-tree": { on: "[3, 1, 4, 3, null, 1, 5]", setup: "Pass the maximum value seen on the path down. A node is good if its value ≥ that max.", steps: [
  ["3 (max 3) → good ✓ (1)", "The root is always good."],
  ["1 (max 3) → no;  its child 3 (max 3) → good ✓ (2)", "3 ≥ 3."],
  ["4 (max 3) → good ✓ (3) → max becomes 4", ""],
  ["1 (max 4) → no;  5 (max 4) → good ✓ (4)", ""]],
  result: "`4`" },
"validate-binary-search-tree": { on: "[5, 4, 6, null, null, 3, 7]", setup: "Every node must lie inside the (low, high) range inherited from ALL its ancestors.", steps: [
  ["5 in (−∞, ∞) ✓", ""],
  ["4 in (−∞, 5) ✓;  6 in (5, ∞) ✓", ""],
  ["3 is 6's left child → allowed range (5, 6) → 3 is outside ✗", "3 sits in 5's right subtree, so it must be > 5."]],
  result: "`False`" },
"kth-smallest-element-in-a-bst": { on: "[5, 3, 6, 2, 4, null, null, 1], k = 3", setup: "Iterative in-order traversal visits values in sorted order. Count k down on each visit.", steps: [
  ["Go left as far as possible: push 5, 3, 2, 1", ""],
  ["pop 1 → k = 2;  pop 2 → k = 1;  pop 3 → k = 0 → return 3", "The 3rd smallest."]],
  result: "`3`" },
"construct-binary-tree-from-preorder-and-inorder-traversal": { on: "preorder [3, 9, 20, 15, 7], inorder [9, 3, 15, 20, 7]", setup: "Preorder gives the next root. Its position in inorder splits the left subtree from the right subtree.", steps: [
  ["Root 3 → inorder index 1 → left part [9], right part [15, 20, 7]", ""],
  ["Left: root 9, no children", ""],
  ["Right: root 20 → splits into [15] | [7]", ""],
  ["15 becomes 20's left child, 7 its right child", ""]],
  result: "`[3, 9, 20, null, null, 15, 7]`" },
"binary-tree-maximum-path-sum": { on: "[-10, 9, 20, null, null, 15, 7]", setup: "Each node returns its best DOWNWARD gain (one branch only). `best` also considers the path bending through the node (both branches).", steps: [
  ["Leaves: 9 → 9, 15 → 15, 7 → 7", ""],
  ["At 20: bending path 15 + 20 + 7 = **42** → best 42 → returns 20 + 15 = 35", "A parent can only use one branch."],
  ["At −10: bending path 9 − 10 + 35 = 34 < 42", ""]],
  result: "`42`" },
"serialize-and-deserialize-binary-tree": { on: "[1, 2, 3, null, null, 4, 5]", setup: "Preorder with 'N' for empty children. Decoding reads the tokens in the same order.", steps: [
  ["Serialize: 1, 2, N, N, 3, 4, N, N, 5, N, N", ""],
  ["Deserialize: 1 → its left = build() → 2 → left N, right N", ""],
  ["1's right = build() → 3 → left 4 (N, N), right 5 (N, N)", ""]],
  result: "The same tree comes back." },
/* ================= TRIES ================= */
"implement-trie-prefix-tree": { on: "insert(apple), search(apple), search(app), startsWith(app), insert(app), search(app)", setup: "Each node has children (char → node) and an `end` flag that marks a complete word.", steps: [
  ["insert apple → path a-p-p-l-e, the 'e' node gets end = True", ""],
  ["search(apple) → walk to 'e', end True → **True**", ""],
  ["search(app) → reach the 2nd 'p', but end = False → **False**", "\"app\" is only a prefix so far."],
  ["startsWith(app) → the path exists → **True**", ""],
  ["insert app → mark the 2nd 'p' end = True → search(app) → **True**", ""]],
  result: "True, False, True, True" },
"design-add-and-search-words-data-structure": { on: "words bad, dad, mad; searches pad, bad, .ad, b..", setup: "A normal trie walk, except '.' tries EVERY child.", steps: [
  ["\"pad\" → no 'p' child at the root → False", ""],
  ["\"bad\" → b-a-d exists and is a word end → True", ""],
  ["\".ad\" → '.' tries b: b-a-d ✓ → True", "It stops at the first success."],
  ["\"b..\" → b, then '.' → a, then '.' → d (end) → True", ""]],
  result: "False, True, True, True" },
"word-search-ii": { on: "the 4×4 board, words [oath, pea, eat, rain]", setup: "All words go into one trie. DFS on the board follows only paths that exist in the trie.", steps: [
  ["Start at 'o' (0,0) → o → a (0,1) → t (1,1) → h (2,1) → node has word \"oath\" → record", ""],
  ["Start at 'e' (1,3) → e → a (1,2) → t (1,1) → word \"eat\" → record", ""],
  ["'p' doesn't exist on the board, and 'r' leads nowhere useful", "Those trie branches are never fully explored."]],
  result: "`[\"eat\", \"oath\"]`" },
/* ================= HEAP ================= */
"kth-largest-element-in-a-stream": { on: "k = 3, start [4, 5, 8, 2], then add 3, 5, 10, 9, 4", setup: "A min-heap holding only the 3 largest values seen. Its top is the 3rd largest.", steps: [
  ["Start → keep the 3 largest {4, 5, 8}", "2 is dropped."],
  ["add 3 → {3, 4, 5, 8} → drop the smallest 3 → top **4**", ""],
  ["add 5 → drop 4 → {5, 5, 8} → top **5**", ""],
  ["add 10 → drop 5 → {5, 8, 10} → **5**;  add 9 → {8, 9, 10} → **8**", ""],
  ["add 4 → 4 is dropped immediately → **8**", ""]],
  result: "`[4, 5, 5, 8, 8]`" },
"last-stone-weight": { on: "stones = [2, 7, 4, 1, 8, 1]", setup: "A max-heap (negated values) always gives the two heaviest stones.", steps: [
  ["8 and 7 → 1 left → [4, 2, 1, 1, 1]", ""],
  ["4 and 2 → 2 → [2, 1, 1, 1]", ""],
  ["2 and 1 → 1 → [1, 1, 1]", ""],
  ["1 and 1 → both destroyed → [1]", ""]],
  result: "`1`" },
"k-closest-points-to-origin": { on: "[[3,3], [5,−1], [−2,4]], k = 2", setup: "A max-heap of size k by squared distance. The farthest point is on top and gets kicked out first.", steps: [
  ["(3,3) dist² 18 → heap {18}", ""],
  ["(5,−1) dist² 26 → heap {18, 26}", ""],
  ["(−2,4) dist² 20 → heap {18, 20, 26} → size 3 > 2 → remove 26", ""]],
  result: "`[[3,3], [−2,4]]`" },
"kth-largest-element-in-an-array": { on: "nums = [3, 2, 1, 5, 6, 4], k = 2 → we want sorted index 6 − 2 = 4", setup: "Quickselect: split around a pivot and continue only in the part that contains index 4.", steps: [
  ["Suppose the random pivot is 4 → lo [3, 2, 1], eq [4], hi [5, 6]", ""],
  ["Index 4 ≥ len(lo) + len(eq) = 4 → it's in hi, at position 4 − 4 = 0", ""],
  ["In [5, 6]: pivot 6 → lo [5] → position 0 is in lo → [5] → answer 5", ""]],
  result: "`5`" },
"task-scheduler": { on: "tasks A×3, B×3, n = 2 (the heap stores only remaining counts)", setup: "Each time unit, run the task type with the most copies left. A finished copy waits in the queue until time + n.", steps: [
  ["t1: run a 3-count task → 2 left, cooling until t3", ""],
  ["t2: run the other 3-count task → 2 left, cooling until t4", ""],
  ["t3: nothing ready → **idle**; the first task becomes ready again", ""],
  ["t4, t5: run both (1 left each);  t6: idle", ""],
  ["t7, t8: run the last copies → everything done", "The pattern is A B idle A B idle A B."]],
  result: "`8`" },
"design-twitter": { on: "post(1,5), feed(1), follow(1,2), post(2,6), feed(1), unfollow(1,2), feed(1)", setup: "The feed merges each followed user's newest tweets with a max-heap ordered by time.", steps: [
  ["feed(1) → only user 1's tweets → [5]", ""],
  ["After following 2: heap holds user 1's newest (time 0, 5) and user 2's (time 1, 6) → pop 6 then 5", "Newest first."],
  ["After unfollowing: back to [5]", ""]],
  result: "[5], [6, 5], [5]" },
"find-median-from-data-stream": { on: "add 1, 2, 3, 10, −5", setup: "`small` = max-heap (lower half), `large` = min-heap (upper half). small may hold one extra element.", steps: [
  ["add 1 → small {1} → median 1", ""],
  ["add 2 → small {1}, large {2} → median (1 + 2) / 2 = 1.5", ""],
  ["add 3 → small {1, 2}, large {3} → median 2", ""],
  ["add 10 → small {1, 2}, large {3, 10} → median 2.5", ""],
  ["add −5 → small {−5, 1, 2}, large {3, 10} → median 2", "The top of small is the middle value."]],
  result: "1.5, 2.0 … then 2.0" },
  };
  NC.forEach((p) => { if (D[p.id]) { p.dry = D[p.id]; if (D[p.id].on) p.dryOn = D[p.id].on; } });
})();
