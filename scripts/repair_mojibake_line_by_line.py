import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# CP1252 mapping
cp1252_map = {
    0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
    0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
    0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
    0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
    0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
    0x9E: 0x017E, 0x9F: 0x0178
}

unicode_to_cp1252 = {uni: byte for byte, uni in cp1252_map.items()}

def repair_line(line):
    # Only try to repair lines that look like they contain mojibake markers
    if not any(ord(c) > 127 for c in line):
        return line
        
    # Check for Mojibake indicators
    if not any(m in line for m in ["Ã", "Ä", "Æ", "á", "â"]):
        return line

    try:
        # Pre-process common replacements
        # 'Ä ' is 'Đ' (0xC4, 0x90)
        line_mod = line.replace("Ä ", "Ä\u0090")
        
        # 'Ä…' is sometimes used, map to 'đ'
        line_mod = line_mod.replace("Ä…", "Ä\u0091")
        
        bytes_list = []
        for ch in line_mod:
            code = ord(ch)
            if code in unicode_to_cp1252:
                bytes_list.append(unicode_to_cp1252[code])
            elif code <= 0xFF:
                bytes_list.append(code)
            else:
                # If there are clean Vietnamese characters in this line (like ả, ệ, etc.),
                # they will fail CP1252 encoding. This is expected for clean lines.
                raise ValueError("Not CP1252 line")
                
        decoded = bytes(bytes_list).decode('utf-8')
        return decoded
    except Exception:
        # If the entire line cannot be parsed as CP1252->UTF8,
        # we can still try to repair inline substrings inside quotes using regex
        # as a fallback
        return line

src_file = Path(r"d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx.bak-before-powershell")
dest_file = Path(r"d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx")

with open(src_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

repaired_lines = []
repaired_count = 0

for idx, line in enumerate(lines):
    repaired = repair_line(line)
    if repaired != line:
        repaired_count += 1
        # Print a few examples
        if repaired_count <= 10:
            print(f"Repaired line {idx+1}:")
            print(f"  Orig: {line.strip()}")
            print(f"  New : {repaired.strip()}")
    repaired_lines.append(repaired)

with open(dest_file, "w", encoding="utf-8") as f:
    f.writelines(repaired_lines)

print(f"Successfully repaired {repaired_count} lines out of {len(lines)}!")
