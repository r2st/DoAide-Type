const JS_SNIPPETS = [
  `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
  `const sum = (arr) => arr.reduce((a, b) => a + b, 0);`,
  `const fetchData = async (url) => {\n  const res = await fetch(url);\n  return res.json();\n};`,
  `const debounce = (fn, ms) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n};`,
  `const unique = (arr) => [...new Set(arr)];`,
  `function isPalindrome(str) {\n  const s = str.toLowerCase().replace(/[^a-z]/g, "");\n  return s === s.split("").reverse().join("");\n}`,
  `const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);`,
  `const flatten = (arr) => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);`,
  `class EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, fn) { (this.events[event] ||= []).push(fn); }\n  emit(event, ...args) { (this.events[event] || []).forEach(fn => fn(...args)); }\n}`,
  `const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);`,
  `const deepClone = (obj) => JSON.parse(JSON.stringify(obj));`,
  `const groupBy = (arr, key) => arr.reduce((g, i) => ({ ...g, [i[key]]: [...(g[i[key]] || []), i] }), {});`,
  `const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);`,
  `const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (!cache.has(key)) cache.set(key, fn(...args));\n    return cache.get(key);\n  };\n};`,
]

const PYTHON_SNIPPETS = [
  `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)`,
  `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
  `squares = [x ** 2 for x in range(10)]`,
  `def is_prime(n):\n    if n < 2:\n        return False\n    return all(n % i != 0 for i in range(2, int(n**0.5) + 1))`,
  `from functools import reduce\nproduct = reduce(lambda a, b: a * b, [1, 2, 3, 4, 5])`,
  `words = "hello world".split()\ncapitalized = [w.capitalize() for w in words]`,
  `def flatten(lst):\n    return [x for sub in lst for x in (flatten(sub) if isinstance(sub, list) else [sub])]`,
  `counter = {}\nfor char in "hello":\n    counter[char] = counter.get(char, 0) + 1`,
  `class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop()`,
  `matrix = [[i * j for j in range(5)] for i in range(5)]`,
]

const HTML_SNIPPETS = [
  `<div class="container">\n  <h1>Hello World</h1>\n  <p>Welcome to the site.</p>\n</div>`,
  `<nav>\n  <ul>\n    <li><a href="/">Home</a></li>\n    <li><a href="/about">About</a></li>\n    <li><a href="/contact">Contact</a></li>\n  </ul>\n</nav>`,
  `<form action="/submit" method="post">\n  <input type="text" name="name" placeholder="Name" />\n  <input type="email" name="email" placeholder="Email" />\n  <button type="submit">Submit</button>\n</form>`,
  `<section id="hero">\n  <h2>Build Something Amazing</h2>\n  <p>Start your journey today.</p>\n  <a href="#start" class="btn">Get Started</a>\n</section>`,
  `<table>\n  <thead>\n    <tr><th>Name</th><th>Age</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Alice</td><td>30</td></tr>\n    <tr><td>Bob</td><td>25</td></tr>\n  </tbody>\n</table>`,
]

const ALL_CODE = [...JS_SNIPPETS, ...PYTHON_SNIPPETS, ...HTML_SNIPPETS]

export function generateCode(): string {
  const snippet = ALL_CODE[Math.floor(Math.random() * ALL_CODE.length)]
  return snippet.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

export function generateCodeMulti(count: number): string {
  const shuffled = [...ALL_CODE].sort(() => Math.random() - 0.5)
  return shuffled
    .slice(0, Math.min(count, shuffled.length))
    .map(s => s.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .join(' ')
}
