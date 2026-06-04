# Code này xuất biểu đồ doanh thu PNG từ file JSON admin đã export.
# Cách dùng:
#   python generate_revenue_chart.py vpc-admin-data.json doanh-thu.png
import json, sys
from datetime import datetime
from collections import defaultdict
import matplotlib.pyplot as plt

INPUT = sys.argv[1] if len(sys.argv) > 1 else "vpc-admin-data.json"
OUTPUT = sys.argv[2] if len(sys.argv) > 2 else "doanh-thu.png"

with open(INPUT, "r", encoding="utf-8") as f:
    data = json.load(f)
orders = data.get("orders") or data.get("don_hang") or []
paid_statuses = {"da_thanh_toan", "da_chuyen_khoan", "da_nhan_don", "dang_lam_don", "da_giao_shipper", "hoan_thanh", "da_giao"}
revenue_by_day = defaultdict(float)
for o in orders:
    if o.get("trang_thai") not in paid_statuses:
        continue
    raw = o.get("created_at") or o.get("ngay_tao") or o.get("createdAt")
    try:
        day = datetime.fromisoformat(str(raw).replace("Z", "+00:00")).strftime("%d/%m")
    except Exception:
        day = "Không rõ"
    revenue_by_day[day] += float(o.get("tong_tien") or o.get("total") or 0)

items = list(revenue_by_day.items())[-14:]
labels = [x[0] for x in items]
values = [x[1] for x in items]

plt.figure(figsize=(11, 5.5))
plt.bar(labels, values)
plt.title("Doanh thu theo ngày - Vietnam Prosperity Coffee")
plt.xlabel("Ngày")
plt.ylabel("Doanh thu (VND)")
plt.xticks(rotation=35, ha="right")
plt.tight_layout()
plt.savefig(OUTPUT, dpi=180)
print(f"Đã xuất biểu đồ: {OUTPUT}")
