from pathlib import Path
import shutil

file_path = Path("src/components/shared/storefront-client.tsx")
backup_path = Path("src/components/shared/storefront-client.tsx.bak-utf8")

if not file_path.exists():
    print(f"Không tìm thấy file tại {file_path}")
    exit(1)

# Tạo bản sao lưu trước khi sửa
shutil.copyfile(file_path, backup_path)

text = file_path.read_text(encoding="utf-8", errors="replace")

def looks_mojibake(value: str) -> bool:
    markers = ["Ã", "Â", "Æ", "á»", "áº", "â€œ", "â€", "nÆ°", "NguyÃªn"]
    return sum(value.count(marker) for marker in markers) >= 5

def repair_utf8_mojibake(value: str) -> str:
    output = []
    buffer = bytearray()

    def flush_buffer():
        nonlocal buffer
        if buffer:
            try:
                output.append(buffer.decode("utf-8"))
            except UnicodeDecodeError:
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
    print("Đang sửa lỗi mã hóa tiếng Việt cho storefront-client.tsx...")
    repaired_text = repair_utf8_mojibake(text)
    
    # Ghi lại file với encoding UTF-8
    file_path.write_text(repaired_text, encoding="utf-8")
    print("Sửa lỗi thành công!")
    print(f"File backup đã được lưu tại: {backup_path}")
else:
    print("Không phát hiện lỗi mã hóa nặng trong file storefront-client.tsx, bỏ qua.")
