from pathlib import Path
import re
import shutil

index_path = Path("index.html")
public_path = Path("public/index.html")
backup_path = Path("index.backup-before-encoding-fix.html")

text = index_path.read_text(encoding="utf-8", errors="replace")

shutil.copyfile(index_path, backup_path)

def looks_mojibake(value: str) -> bool:
    markers = ["Ã", "Â", "Æ", "á»", "áº", "â€œ", "â€", "nÆ°", "NguyÃªn"]
    return sum(value.count(marker) for marker in markers) >= 5

def repair_utf8_mojibake(value: str) -> str:
    output = []
    buffer = bytearray()

    def flush_buffer():
        nonlocal buffer
        if buffer:
            output.append(buffer.decode("utf-8", errors="replace"))
            buffer = bytearray()

    for ch in value:
        try:
            buffer.extend(ch.encode("cp1252"))
        except UnicodeEncodeError:
            flush_buffer()
            output.append(ch)

    flush_buffer()
    return "".join(output)

if looks_mojibake(text):
    print("Đang sửa lỗi mã hóa tiếng Việt...")
    text = repair_utf8_mojibake(text)
else:
    print("Không thấy lỗi mã hóa nặng, bỏ qua bước sửa encoding.")

# Sửa lỗi JS: dư dấu nháy sau key ca-phe-drip-8-legend
text = re.sub(
    r'("ca-phe-drip-8-legend"\s*:\s*)""',
    r'\1"',
    text
)

# Ép font vừa phải, không dùng body * để giảm lỗi icon/font
safe_font_css = r'''
/* SAFE FONT FIX - ép font vừa phải, không phá Font Awesome */
body {
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: normal;
  word-spacing: normal;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button,
input,
select,
textarea,
option,
.nav-btn,
.btn,
.small-btn,
.tab-link,
.card,
.menu-item,
.article-card,
.site-footer,
.site-footer button,
.site-footer a,
#about h1,
#about h2,
#about h3,
#about p,
#about button,
#about input,
#about textarea {
  font-family: inherit;
  letter-spacing: normal;
  word-spacing: normal;
}

.fa-brands,
.fab {
  font-family: "Font Awesome 6 Brands" !important;
  font-weight: 400 !important;
}

.fa,
.fas,
.far,
.fal,
.fa-solid,
.fa-regular,
.fa-light,
i[class^="fa-"],
i[class*=" fa-"] {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
}
'''

if "SAFE FONT FIX - ép font vừa phải" not in text:
    text = text.replace("</style>", safe_font_css + "\n</style>", 1)

index_path.write_text(text, encoding="utf-8")
public_path.parent.mkdir(exist_ok=True)
public_path.write_text(text, encoding="utf-8")

print("Đã sửa xong index.html và public/index.html")
print("Backup:", backup_path)
