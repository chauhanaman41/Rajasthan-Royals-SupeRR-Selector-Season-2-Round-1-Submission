import re

with open('report.md', 'r', encoding='utf-8') as f:
    text = f.read()

eqs = re.findall(r'\$([^\$\n]+)\$', text)
keywords = ['=', r'\times', r'\frac', r'\sum', r'\ge', r'\le', r'\Delta', r'\hat', r'\beta', r'\alpha', r'\tau', r'\pm']
formulas = sorted(list(set([e.strip() for e in eqs if any(k in e for k in keywords)])))

print(f"Total equations/formulas found: {len(formulas)}")
for i, f_str in enumerate(formulas, 1):
    print(f"{i:2d}. ${f_str}$")
