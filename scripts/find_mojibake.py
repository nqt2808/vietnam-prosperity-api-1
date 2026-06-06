import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx.bak-before-powershell"

with open(file_path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

markers = ["Ã", "Â", "Æ", "á»", "áº", "â€œ", "â€", "Ä‘", "hÃ¨", "cá»±c", "Ä‘Ã£"]

print("Scanning for Mojibake...")
found_count = 0
for idx, line in enumerate(lines):
    line_num = idx + 1
    # Skip comments that might have markers
    if line.strip().startswith("//") or line.strip().startswith("/*") or "res.cloudinary.com" in line:
        continue
    
    # Check for markers
    matched = [m for m in markers if m in line]
    if len(matched) >= 2 or (len(matched) >= 1 and any(ord(c) > 127 for c in line) and any(x in line for x in ["Ã", "Ä", "Æ", "á"])):
        print(f"Line {line_num}: {line.strip()}")
        found_count += 1
        if found_count >= 50:
            print("Truncated list after 50 matches.")
            break

print(f"Total lines found: {found_count}")
