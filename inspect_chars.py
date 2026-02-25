import codecs

with open('backend/database.sql', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Samsung 990 Pro')
if idx != -1:
    snippet = text[idx:idx+80]
    out = []
    for c in snippet:
        # Get unicode codepoint
        out.append(f"{c.encode('utf-8', 'replace')} -> U+{ord(c):04X}")
    
    with open('inspect_out.txt', 'w', encoding='utf-8') as fout:
        fout.write("\n".join(out))
