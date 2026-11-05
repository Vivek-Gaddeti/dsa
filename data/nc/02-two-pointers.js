NC.add("Two Pointers", [
{
  id: "valid-palindrome", t: "Valid Palindrome", lc: 125, d: "Easy", p: "Two Pointers (opposite ends)",
  q: "A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing every non-alphanumeric character, it reads the same forward and backward.\n\nGiven a string `s`, return `True` if it is a palindrome, otherwise `False`.",
  ex: [["s = \"A man, a plan, a canal: Panama\"", "True", "Cleaned: \"amanaplanacanalpanama\""], ["s = \"race a car\"", "False", "\"raceacar\" reversed is \"racaecar\""], ["s = \" \"", "True", "Empty after cleaning, and an empty string is a palindrome."]],
  c: ["1 ≤ len(s) ≤ 2·10^5", "printable ASCII"],
  hint: "Compare the first and last *valid* characters, then move inward. Skip anything that isn't a letter or a digit.",
  brute: {
    idea: "Build the cleaned lowercase string, then compare it with its reverse.",
    code: R`
class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = "".join(c.lower() for c in s if c.isalnum())
        return cleaned == cleaned[::-1]`,
    tc: "O(n)", sc: "O(n)", sw: "Builds two new strings.",
    bad: "Already linear time, but it uses O(n) extra memory. Interviewers often ask for O(1) space.",
  },
  opt: {
    idea: "Put pointer `l` at the start and `r` at the end. Skip non-alphanumeric characters from both sides. Compare the lowercase characters: if they differ it's not a palindrome. Otherwise move both inward. Stop when they meet.",
    steps: ["`l, r = 0, len(s) - 1`", "While `l < r`: move `l` right while `s[l]` is not alphanumeric; move `r` left while `s[r]` is not alphanumeric.", "If `s[l].lower() != s[r].lower()` → `False`.", "`l += 1`, `r -= 1`.", "Loop ends → `True`."],
    code: R`
class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        while l < r:
            while l < r and not s[l].isalnum():
                l += 1
            while l < r and not s[r].isalnum():
                r -= 1
            if s[l].lower() != s[r].lower():
                return False
            l += 1
            r -= 1
        return True`,
    tc: "O(n)", tw: "Each pointer moves across the string at most once.", sc: "O(1)", sw: "Only two indices.",
  },
  run: R`
s = Solution()
print(s.isPalindrome("A man, a plan, a canal: Panama"))
print(s.isPalindrome("race a car"))
print(s.isPalindrome(" "))`,
  out: R`
True
False
True`,
  dryOn: "s = \"race a car\"",
  dry: ["l→'r', r→'r' equal → move in", "'a' vs 'a' equal", "'c' vs 'c' equal", "'e' vs ' ' → r skips the space → 'a'. 'e' ≠ 'a' → **False**"],
  expl: [
    ["while l < r and not s[l].isalnum():", "Skip punctuation/spaces on the left. `l < r` guard prevents running past the other pointer."],
    ["s[l].lower() != s[r].lower()", "Case-insensitive comparison."],
    ["l += 1\nr -= 1", "Both characters matched, so shrink the window from both sides."],
  ],
  take: "**Symmetric check (palindromes, reversing) → two pointers from both ends.** O(1) space.",
  mist: ["Forgetting the `l < r` guard in the inner skip-loops (an index error on strings like \".,\").", "`isalpha()` instead of `isalnum()`: digits count too."],
},
{
  id: "two-sum-ii-input-array-is-sorted", t: "Two Sum II – Input Array Is Sorted", lc: 167, d: "Medium", p: "Two Pointers (opposite ends)",
  q: "You get a **1-indexed** array `numbers` sorted in non-decreasing order. Find two numbers that add up to `target` and return their indices `[index1, index2]` (1-indexed, `index1 < index2`).\n\nThere is exactly one solution. You must use only O(1) extra space.",
  ex: [["numbers = [2,7,11,15], target = 9", "[1, 2]", "2 + 7 = 9"], ["numbers = [2,3,4], target = 6", "[1, 3]", ""], ["numbers = [-1,0], target = -1", "[1, 2]", ""]],
  c: ["2 ≤ len ≤ 3·10^4", "sorted", "O(1) extra space"],
  hint: "The array is sorted. If the sum of the smallest and largest is too big, which one can you safely throw away?",
  brute: {
    idea: "For each element, binary-search for `target - numbers[i]` in the rest of the array.",
    code: R`
import bisect

class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        for i, x in enumerate(numbers):
            j = bisect.bisect_left(numbers, target - x, i + 1)
            if j < len(numbers) and numbers[j] == target - x:
                return [i + 1, j + 1]
        return []`,
    tc: "O(n log n)", sc: "O(1)", bad: "Good, but two pointers gives O(n).",
  },
  opt: {
    idea: "Start with `l` at the smallest and `r` at the largest element.\n\n- If `sum < target`: we need a bigger sum. Moving `r` left would only shrink it, so **move `l` right**.\n- If `sum > target`: **move `r` left**.\n- If equal → done.\n\nEach move rules out an entire row of pairs, so nothing is missed.",
    steps: ["`l, r = 0, n - 1`", "`s = numbers[l] + numbers[r]`", "`s == target` → return `[l+1, r+1]`", "`s < target` → `l += 1`; else `r -= 1`"],
    viz: "twoPointers",
    code: R`
class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        l, r = 0, len(numbers) - 1
        while l < r:
            s = numbers[l] + numbers[r]
            if s == target:
                return [l + 1, r + 1]      # 1-indexed
            if s < target:
                l += 1                     # need a bigger sum
            else:
                r -= 1                     # need a smaller sum
        return []`,
    tc: "O(n)", tw: "Each step moves one pointer; at most n steps.", sc: "O(1)", sw: "",
  },
  run: R`
s = Solution()
print(s.twoSum([2, 7, 11, 15], 9))
print(s.twoSum([2, 3, 4], 6))
print(s.twoSum([-1, 0], -1))`,
  out: R`
[1, 2]
[1, 3]
[1, 2]`,
  dryOn: "numbers = [2,3,4], target = 6",
  dry: { h: ["l", "r", "sum", "action"], r: [[0, 2, "2+4 = 6", "equal → return [1, 3]"]] },
  expl: [
    ["l, r = 0, len(numbers) - 1", "Smallest and largest candidates."],
    ["if s < target:\n    l += 1", "Every pair (l, anything ≤ r) is too small, so index l can never be in the answer."],
    ["else:\n    r -= 1", "Symmetric: every pair (anything ≥ l, r) is too big, so drop r."],
    ["return [l + 1, r + 1]", "The problem is 1-indexed."],
  ],
  take: "**Sorted array + pair/sum condition → two pointers from both ends.** Why it's correct: each move eliminates the pointer that can't be part of any valid pair.",
  mist: ["Returning 0-indexed positions.", "Using a hash map: it works but breaks the O(1) space requirement."],
},
{
  id: "3sum", t: "3Sum", lc: 15, d: "Medium", p: "Sort + Two Pointers",
  q: "Given an integer array `nums`, return all **unique** triplets `[a, b, c]` (from different indices) such that `a + b + c == 0`.\n\nThe answer must not contain duplicate triplets.",
  ex: [["nums = [-1,0,1,2,-1,-4]", "[[-1, -1, 2], [-1, 0, 1]]", "Distinct triplets summing to 0."], ["nums = [0,1,1]", "[]", ""], ["nums = [0,0,0]", "[[0, 0, 0]]", ""]],
  c: ["3 ≤ len(nums) ≤ 3000"],
  hint: "Sort first. Fix the first number `a`, then you need a pair summing to `-a` in the rest: that's Two Sum II. Skip equal values to avoid duplicates.",
  brute: {
    idea: "Try all triples (i < j < k), and store sorted triplets in a set to remove duplicates.",
    code: R`
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        n, res = len(nums), set()
        for i in range(n):
            for j in range(i + 1, n):
                for k in range(j + 1, n):
                    if nums[i] + nums[j] + nums[k] == 0:
                        res.add(tuple(sorted((nums[i], nums[j], nums[k]))))
        return sorted(list(t) for t in res)`,
    tc: "O(n³)", sc: "O(number of triplets)", bad: "n = 3000 → 4.5·10^9 triples. Far too slow.",
  },
  opt: {
    idea: "1. **Sort** the array.\n2. For each index `i` (the smallest element of the triplet), run two pointers `l = i+1`, `r = n-1` looking for `nums[l] + nums[r] == -nums[i]`.\n3. **Avoid duplicates:** skip `i` if `nums[i] == nums[i-1]`. After finding a triplet, move `l` past equal values.\n4. If `nums[i] > 0`, stop: three positive numbers can't sum to 0.",
    steps: ["`nums.sort()`", "for i in range(n): if i > 0 and nums[i] == nums[i-1] → continue", "l, r = i+1, n-1. While l < r: s = nums[i] + nums[l] + nums[r]", "s < 0 → l += 1;  s > 0 → r -= 1", "s == 0 → record, l += 1, and skip duplicates of nums[l]"],
    code: R`
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        for i, a in enumerate(nums):
            if a > 0:
                break                         # smallest is positive -> no zero sum
            if i > 0 and a == nums[i - 1]:
                continue                      # same first number -> same triplets
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = a + nums[l] + nums[r]
                if s < 0:
                    l += 1
                elif s > 0:
                    r -= 1
                else:
                    res.append([a, nums[l], nums[r]])
                    l += 1
                    while l < r and nums[l] == nums[l - 1]:
                        l += 1                # skip duplicate second numbers
        return res`,
    tc: "O(n²)", tw: "Sorting O(n log n) + n iterations of an O(n) two-pointer scan.", sc: "O(1) extra", sw: "Ignoring the output and the sort's internal memory.",
  },
  run: R`
s = Solution()
print(s.threeSum([-1, 0, 1, 2, -1, -4]))
print(s.threeSum([0, 1, 1]))
print(s.threeSum([0, 0, 0]))`,
  out: R`
[[-1, -1, 2], [-1, 0, 1]]
[]
[[0, 0, 0]]`,
  dryOn: "sorted nums = [-4,-1,-1,0,1,2]",
  dry: { h: ["i (a)", "l, r", "sum", "action"], r: [["0 (−4)", "1, 5", "−4−1+2 = −3", "l++ … never reaches 0"], ["1 (−1)", "2, 5", "−1−1+2 = 0", "**record [−1,−1,2]**, l→3"], ["1 (−1)", "3, 5", "−1+0+2 = 1", "r−−"], ["1 (−1)", "3, 4", "−1+0+1 = 0", "**record [−1,0,1]**"], ["2 (−1)", "", "", "same as previous a → skip"], ["3 (0)", "4, 5", "0+1+2 = 3", "r−−, l == r stop"]] },
  expl: [
    ["nums.sort()", "Sorting enables both two pointers and easy duplicate skipping."],
    ["if i > 0 and a == nums[i - 1]:\n    continue", "Using the same first value twice would produce the same triplets."],
    ["while l < r and nums[l] == nums[l - 1]:\n    l += 1", "After a hit, skip equal second values. (r adjusts naturally on the next iteration.)"],
    ["if a > 0:\n    break", "Small optimization: the sorted rest is all ≥ a > 0."],
  ],
  take: "**k-Sum → sort, fix k−2 elements with loops, and solve the last pair with two pointers.** Deduplicate by skipping equal neighbours.",
  mist: ["Deduplicating with a set of tuples: it works but is slower and misses the point.", "Skipping duplicates with `nums[i] == nums[i+1]` (compares forward), which wrongly skips valid triplets like [-1,-1,2]."],
},
{
  id: "container-with-most-water", t: "Container With Most Water", lc: 11, d: "Medium", p: "Two Pointers (greedy shrink)",
  q: "You are given `height`, where `height[i]` is the height of a vertical line at position `i`. Pick two lines that, together with the x-axis, form a container. Return the **maximum amount of water** it can hold.\n\nArea = `min(height[l], height[r]) × (r − l)`.",
  ex: [["height = [1,8,6,2,5,4,8,3,7]", "49", "Lines at index 1 (8) and 8 (7): min(8,7) × 7 = 49"], ["height = [1,1]", "1", ""]],
  c: ["2 ≤ n ≤ 10^5"],
  hint: "Start with the widest container. The water level is limited by the shorter line, so moving the taller line inward can never help. Which pointer should move?",
  brute: {
    idea: "Compute the area for every pair of lines.",
    code: R`
class Solution:
    def maxArea(self, height: list[int]) -> int:
        best = 0
        for i in range(len(height)):
            for j in range(i + 1, len(height)):
                best = max(best, min(height[i], height[j]) * (j - i))
        return best`,
    tc: "O(n²)", sc: "O(1)", bad: "10^10 pairs for n = 10^5.",
  },
  opt: {
    idea: "Begin with `l = 0`, `r = n-1` (maximum width). Record the area. Then **move the pointer at the shorter line** inward.\n\nWhy? The area is capped by the shorter line. If we moved the taller one, the width shrinks and the height is still capped by the same short line, so the area can only get worse. Moving the shorter one is the only move that might find a taller line.",
    steps: ["l, r = 0, n − 1; best = 0", "area = min(h[l], h[r]) × (r − l); best = max(best, area)", "if h[l] < h[r]: l += 1 else: r -= 1", "Repeat while l < r."],
    code: R`
class Solution:
    def maxArea(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        best = 0
        while l < r:
            area = min(height[l], height[r]) * (r - l)
            best = max(best, area)
            if height[l] < height[r]:
                l += 1          # the short side limits us; try to find a taller one
            else:
                r -= 1
        return best`,
    tc: "O(n)", sc: "O(1)", tw: "One pass of two pointers.",
  },
  run: R`
s = Solution()
print(s.maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]))
print(s.maxArea([1, 1]))`,
  out: R`
49
1`,
  dryOn: "height = [1,8,6,2,5,4,8,3,7]",
  dry: { h: ["l", "r", "min height × width", "area", "best", "move"], r: [[0, 8, "1 × 8", 8, 8, "l (1 < 7)"], [1, 8, "7 × 7", 49, 49, "r (8 ≥ 7)"], [1, 7, "3 × 6", 18, 49, "r"], [1, 6, "8 × 5", 40, 49, "r (tie → move r)"], [1, 5, "4 × 4", 16, 49, "r"], ["…", "", "", "", 49, ""]] },
  expl: [
    ["min(height[l], height[r]) * (r - l)", "Water level = the shorter wall; width = distance between them."],
    ["if height[l] < height[r]:\n    l += 1", "Discard the shorter line. No container using it can beat the current one, because every other partner is closer."],
  ],
  take: "**Two pointers + greedy elimination:** at each step, prove one end can't be in a better answer and drop it.",
  mist: ["Moving both pointers.", "Confusing this with Trapping Rain Water (that one sums water over every bar)."],
},
{
  id: "trapping-rain-water", t: "Trapping Rain Water", lc: 42, d: "Hard", p: "Two Pointers / Prefix max",
  q: "Given `n` non-negative integers representing an elevation map where each bar has width 1, compute how much rain water is trapped after raining.",
  ex: [["height = [0,1,0,2,1,0,1,3,2,1,2,1]", "6", "Water sits in the dips between taller bars."], ["height = [4,2,0,3,2,5]", "9", ""]],
  c: ["1 ≤ n ≤ 2·10^4", "0 ≤ height[i] ≤ 10^5"],
  hint: "Water above bar i = `min(tallest bar to the left, tallest bar to the right) − height[i]` (if positive). How do you get both maxima cheaply?",
  brute: {
    idea: "For every bar, scan left for its max and scan right for its max.",
    code: R`
class Solution:
    def trap(self, height: list[int]) -> int:
        total = 0
        for i in range(len(height)):
            left = max(height[: i + 1])
            right = max(height[i:])
            total += min(left, right) - height[i]
        return total`,
    tc: "O(n²)", sc: "O(1)", bad: "Re-scans for every index.",
  },
  better: {
    idea: "Precompute `maxL[i]` (max of height[0..i]) and `maxR[i]` (max of height[i..n-1]) in two passes. Then water[i] = min(maxL[i], maxR[i]) − height[i].",
    code: R`
class Solution:
    def trap(self, height: list[int]) -> int:
        n = len(height)
        maxL, maxR = [0] * n, [0] * n
        maxL[0] = height[0]
        for i in range(1, n):
            maxL[i] = max(maxL[i - 1], height[i])
        maxR[-1] = height[-1]
        for i in range(n - 2, -1, -1):
            maxR[i] = max(maxR[i + 1], height[i])
        return sum(min(maxL[i], maxR[i]) - height[i] for i in range(n))`,
    tc: "O(n)", sc: "O(n)",
  },
  opt: {
    idea: "Two pointers with running maxima `leftMax` and `rightMax`.\n\nIf `leftMax < rightMax`, the water at `l` is decided by `leftMax`. We know some bar on the right is at least `rightMax > leftMax`, so the right side is not the bottleneck. Add `leftMax − height[l]` and move `l`. Otherwise do the mirror on the right.",
    steps: ["l, r = 0, n−1; leftMax = height[l], rightMax = height[r]", "if leftMax < rightMax: l += 1; leftMax = max(leftMax, h[l]); water += leftMax − h[l]", "else: r −= 1; rightMax = max(rightMax, h[r]); water += rightMax − h[r]", "Stop when l meets r."],
    code: R`
class Solution:
    def trap(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        left_max, right_max = height[l], height[r]
        water = 0
        while l < r:
            if left_max < right_max:
                l += 1
                left_max = max(left_max, height[l])
                water += left_max - height[l]     # bounded by the left side
            else:
                r -= 1
                right_max = max(right_max, height[r])
                water += right_max - height[r]    # bounded by the right side
        return water`,
    tc: "O(n)", sc: "O(1)", tw: "Single pass.", sw: "Four variables.",
  },
  run: R`
s = Solution()
print(s.trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]))
print(s.trap([4, 2, 0, 3, 2, 5]))`,
  out: R`
6
9`,
  dryOn: "height = [4,2,0,3,2,5]",
  dry: { h: ["l", "r", "leftMax", "rightMax", "move", "water added"], r: [[0, 5, 4, 5, "l→1", "4−2 = 2"], [1, 5, 4, 5, "l→2", "4−0 = 4"], [2, 5, 4, 5, "l→3", "4−3 = 1"], [3, 5, 4, 5, "l→4", "4−2 = 2"], [4, 5, 4, 5, "l→5 = r, stop", "total **9**"]] },
  expl: [
    ["if left_max < right_max:", "The left side is the bottleneck for position l+1. The right side is guaranteed to have a wall at least as tall."],
    ["left_max = max(left_max, height[l])\nwater += left_max - height[l]", "Update first, so the result is never negative (a new tallest bar holds 0 water)."],
  ],
  take: "**Water / boundary problems: amount at i = min(maxLeft, maxRight) − h[i].** Prefix/suffix max arrays give O(n) time; two pointers make it O(1) space. Monotonic stack is a third valid approach.",
  mist: ["Adding water before updating the max (gives negative water).", "Thinking you need both maxima exactly. You only need to know which side is the bottleneck."],
},
]);
