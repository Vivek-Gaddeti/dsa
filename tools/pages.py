"""Write every page (index.html, topics.html, ...) from one template, so they all load the same scripts in the same order.
Usage:  python tools/pages.py      then  node tools/stamp.js  (fresh version stamps)"""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NC = sorted(f for f in os.listdir(os.path.join(ROOT, "data", "nc")) if f[0].isdigit())

HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=optional">
<link rel="stylesheet" href="assets/style.css">
<link rel="stylesheet" href="assets/fx/fx.css">
<link rel="stylesheet" href="assets/calm.css">
<script>try{{var h=document.documentElement,t=localStorage.getItem('theme');if(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)h.dataset.theme='dark';var a=localStorage.getItem('anim');h.dataset.anim=a==='on'||(a!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)?'on':'off'}}catch(e){{}}</script>
</head>
<body>
<header id="topbar"></header>
'''
PAGE = '<main class="page" id="content"></main>\n'
DOC = '<div class="layout">\n  <aside class="sidebar" id="sidebar"></aside>\n  <main class="content" id="content"></main>\n</div>\n'
TAIL = ["assets/fx/fx-core.js", "assets/fx/fx-page.js", "assets/fx/fx-header.js", "assets/fx/fx-sidebar.js",
        "assets/fx/fx-cursor.js", "assets/fx/fx-celebrate.js", "data/progress.js", "assets/find.js", "assets/search.js", "assets/calm.js", "assets/pad.js"]
CODE = ["assets/glossary.js", "assets/viz.js"]

def page(name, title, body, before, after, init):
    # before: loaded ahead of common.js (outmap), after: data files, init: inline script
    scripts = ["assets/site.js"] + before + ["assets/common.js"] + after
    h = HEAD.format(title=title) + body
    h += "".join(f'<script src="{s}"></script>\n' for s in scripts)
    h += f"<script>\n  {init}\n</script>\n" if "\n" in init or "DocPage" in init else f"<script>{init}</script>\n"
    extra = [s for s in TAIL if s not in scripts]
    if name == "neetcode.html": extra.insert(0, "assets/neetcode.js")
    if name == "revision.html": extra.insert(0, "assets/revision.js")
    if name == "index.html": extra.insert(0, "assets/dashboard.js")
    extra.insert(0, "assets/py.js")                    # before the page's own script: NeetCode uses it when it first draws
    h += "".join(f'<script src="{s}"></script>\n' for s in extra)
    h += "</body>\n</html>\n"
    open(os.path.join(ROOT, name), "w", encoding="utf-8", newline="\n").write(h)

page("index.html", "Dashboard · Study Hub", PAGE, [], ["data/progress.js"], 'topbar("index.html");')
page("topics.html", "DSA Topics · Study Hub", DOC, ["data/outmap.js"], CODE + ["data/briefs.js", "data/topics.js"],
     'topbar("topics.html");\n  DocPage({ sections: TOPICS, kind: "topic", title: "DSA Topics", noun: "topics" });')
page("patterns.html", "DSA Patterns · Study Hub", DOC, ["data/outmap.js"], CODE + ["data/briefs.js", "data/patterns.js", "data/patterns-2.js"],
     'topbar("patterns.html");\n  DocPage({ sections: PATTERNS, kind: "pattern", title: "DSA Patterns", noun: "patterns" });')
page("neetcode.html", "NeetCode 150 · Study Hub", PAGE, ["data/outmap.js"], CODE + ["data/nc/helpers.js"] + ["data/nc/" + f for f in NC], 'topbar("neetcode.html");')
page("revision.html", "Revision · Study Hub", PAGE, [], ["data/index.js"], 'topbar("revision.html");')
page("python.html", "Python Guide · Study Hub", DOC, ["data/outmap.js"], CODE + ["data/briefs-py.js", "data/python-1.js", "data/python-2.js", "data/python-3.js"],
     'topbar("python.html");\n  DocPage({ sections: PY, kind: "py", title: "Python Complete Guide", noun: "Python topics", mascot: "snake" });')
page("python-dsa.html", "Python for DSA · Study Hub", DOC, ["data/outmap.js"], CODE + ["data/briefs-py.js", "data/python-dsa.js"],
     'topbar("python-dsa.html");\n  DocPage({ sections: PYDSA, kind: "pydsa", title: "Python for DSA", noun: "DSA topics", mascot: "snake" });')
page("quiz.html", "Which pattern? · Study Hub", PAGE, [], ["data/patterns.js", "data/patterns-2.js", "assets/quiz.js"], 'topbar("quiz.html");')
print("pages written")
