import codecs

def fix_sql():
    with open('backend/database.sql', 'r', encoding='utf-8') as f:
        text = f.read()

    fixed_bytes = bytearray()
    for char in text:
        val = ord(char)
        if val < 256:
            fixed_bytes.append(val)
        elif 0x0E00 <= val <= 0x0E7F:
            b = val - 0x0E00 + 0xA0
            fixed_bytes.append(b)
        elif val == 0x20AC: fixed_bytes.append(0x80)
        elif val == 0x201A: fixed_bytes.append(0x82)
        elif val == 0x0192: fixed_bytes.append(0x83)
        elif val == 0x201E: fixed_bytes.append(0x84)
        elif val == 0x2026: fixed_bytes.append(0x85)
        elif val == 0x2020: fixed_bytes.append(0x86)
        elif val == 0x2021: fixed_bytes.append(0x87)
        elif val == 0x02C6: fixed_bytes.append(0x88)
        elif val == 0x2030: fixed_bytes.append(0x89)
        elif val == 0x0160: fixed_bytes.append(0x8A)
        elif val == 0x2039: fixed_bytes.append(0x8B)
        elif val == 0x0152: fixed_bytes.append(0x8C)
        elif val == 0x017D: fixed_bytes.append(0x8E)
        elif val == 0x2018: fixed_bytes.append(0x91)
        elif val == 0x2019: fixed_bytes.append(0x92)
        elif val == 0x201C: fixed_bytes.append(0x93)
        elif val == 0x201D: fixed_bytes.append(0x94)
        elif val == 0x2022: fixed_bytes.append(0x95)
        elif val == 0x2013: fixed_bytes.append(0x96)
        elif val == 0x2014: fixed_bytes.append(0x97)
        elif val == 0x02DC: fixed_bytes.append(0x98)
        elif val == 0x2122: fixed_bytes.append(0x99)
        elif val == 0x0161: fixed_bytes.append(0x9A)
        elif val == 0x203A: fixed_bytes.append(0x9B)
        elif val == 0x0153: fixed_bytes.append(0x9C)
        elif val == 0x017E: fixed_bytes.append(0x9E)
        elif val == 0x0178: fixed_bytes.append(0x9F)
        else:
            # If it's a valid UTF-8 already (like emoji) or something else, 
            # keep it as UTF-8 bytes
            fixed_bytes.extend(char.encode('utf-8'))

    # The resulting bytes should now be standard UTF-8!
    # Let's decode them
    decoded = fixed_bytes.decode('utf-8', errors='replace')

    # Save to file
    with open('backend/database_fixed.sql', 'w', encoding='utf-8') as f:
        f.write(decoded)

if __name__ == '__main__':
    fix_sql()
    print("Done fixing database.sql mapping")
