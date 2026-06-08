from pathlib import Path
from datetime import datetime
import re

root = Path(".")
index_path = root / "index.html"
server_path = root / "server.js"

ts = datetime.now().strftime("%Y%m%d-%H%M%S")

index = index_path.read_text(encoding="utf-8", errors="replace")
server = server_path.read_text(encoding="utf-8", errors="replace")

index_path.with_name(f"index.backup-search-phone-copy-{ts}.html").write_text(index, encoding="utf-8")
server_path.with_name(f"server.backup-phone-lookup-{ts}.js").write_text(server, encoding="utf-8")

css = r'''
/* ===== PRODUCT SEARCH + PHONE LOOKUP + COPY ORDER ===== */
.header-search-btn {
  position: relative;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.header-search-btn i {
  font-size: 17px;
}

.product-search-modal {
  position: fixed;
  inset: 0;
  z-index: 200000;
  background: rgba(31, 18, 11, 0.72);
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding: 110px 16px 24px;
}

.product-search-modal.open {
  display: flex;
}

.product-search-panel {
  width: min(760px, 100%);
  background: #fffaf4;
  border: 1px solid #ead0a4;
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.product-search-head {
  background: var(--coffee-dark);
  color: white;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.product-search-head h3 {
  color: var(--gold-light);
  margin: 0;
  font-size: 22px;
}

.product-search-close {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(244, 209, 123, 0.45);
  border-radius: 999px;
  background: transparent;
  color: white;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.product-search-body {
  padding: 18px;
}

.product-search-form {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.product-search-form input {
  flex: 1;
}

.product-search-results {
  display: grid;
  gap: 10px;
  max-height: 56vh;
  overflow-y: auto;
}

.product-search-item {
  background: white;
  border: 1px solid #eadac7;
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 5px;
}

.product-search-item strong {
  color: var(--coffee-dark);
  font-size: 17px;
}

.product-search-item span {
  color: var(--muted);
  font-size: 13px;
}

.product-search-item button {
  width: fit-content;
  margin-top: 8px;
}

.product-highlight {
  outline: 4px solid var(--gold) !important;
  box-shadow: 0 0 0 8px rgba(200, 155, 60, 0.18), var(--shadow) !important;
}

.lookup-mode-note {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  text-align: center;
  margin: -4px 0 14px;
}

.copy-order-btn {
  width: 34px;
  height: 34px;
  margin-left: 8px;
  border-radius: 10px;
  border: 1px solid #ead0a4;
  background: #fff4df;
  color: var(--coffee-dark);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  transition: 0.2s ease;
}

.copy-order-btn:hover {
  background: var(--gold);
  transform: translateY(-1px);
}

.lookup-order-card {
  background: white;
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 22px;
  border: 1px solid #eadac7;
  margin-bottom: 18px;
}

@media (max-width: 520px) {
  .header-search-btn {
    padding: 4px 8px !important;
  }

  .product-search-modal {
    padding-top: 90px;
  }

  .product-search-form {
    flex-direction: column;
  }
}
'''

if "PRODUCT SEARCH + PHONE LOOKUP + COPY ORDER" not in index:
    index = index.replace("</style>", css + "\n</style>", 1)

search_btn = '''        <button class="nav-btn header-search-btn" type="button" onclick="toggleProductSearch(true)" aria-label="Tìm kiếm sản phẩm" title="Tìm kiếm sản phẩm">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
'''

if "toggleProductSearch(true)" not in index:
    cart_block = '''        <button class="nav-btn cart-icon-btn" data-page="cart" onclick="showPage('cart')" aria-label="Giỏ hàng">
          <span class="cart-icon">🛒</span>
          <span class="cart-count" id="cartCount">0</span>
        </button>
'''
    if cart_block in index:
        index = index.replace(cart_block, cart_block + search_btn)
    else:
        index = re.sub(
            r'(<button[^>]*class="[^"]*cart-icon-btn[^"]*"[\s\S]*?</button>)',
            r'\1\n' + search_btn,
            index,
            count=1
        )

search_modal = r'''
  <!-- PRODUCT SEARCH MODAL -->
  <div class="product-search-modal" id="productSearchModal" onclick="closeProductSearchOnBackdrop(event)">
    <div class="product-search-panel" role="dialog" aria-modal="true" aria-label="Tìm kiếm sản phẩm">
      <div class="product-search-head">
        <h3><i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm sản phẩm</h3>
        <button class="product-search-close" type="button" onclick="toggleProductSearch(false)" aria-label="Đóng">×</button>
      </div>
      <div class="product-search-body">
        <form class="product-search-form" onsubmit="handleProductSearch(event)">
          <input id="productSearchInput" type="search" placeholder="Nhập tên món, ví dụ: cà phê, trà đào, G7..." autocomplete="off" oninput="handleProductSearch(event)" />
          <button class="btn btn-primary" type="submit">Tìm</button>
        </form>
        <div id="productSearchResults" class="product-search-results">
          <p style="color: var(--muted); text-align: center;">Nhập tên sản phẩm để tìm trong Menu nước và Vật phẩm.</p>
        </div>
      </div>
    </div>
  </div>
'''

if "PRODUCT SEARCH MODAL" not in index:
    index = index.replace("  <!-- HOME -->", search_modal + "\n\n  <!-- HOME -->", 1)

if 'id="lookupPhone"' not in index:
    index = re.sub(
        r'(<form id="lookupForm" onsubmit="handleLookupOrder\(event\)">\s*<div class="form-field full" style="margin-bottom: 16px;">\s*<label>Mã đơn hàng</label>\s*<input required id="lookupOrderCode"[^>]*>\s*</div>\s*<button class="btn btn-primary" type="submit" style="width: 100%;">Tra cứu đơn hàng</button>\s*</form>)',
        '''<form id="lookupForm" onsubmit="handleLookupOrder(event)">
            <p class="lookup-mode-note">Quý khách có thể tra cứu bằng <strong>mã đơn hàng</strong> hoặc <strong>số điện thoại đặt hàng</strong>.</p>

            <div class="form-field full" style="margin-bottom: 16px;">
              <label>Mã đơn hàng</label>
              <input id="lookupOrderCode" placeholder="Ví dụ: VPC-DH-20260523-..." />
            </div>

            <div class="form-field full" style="margin-bottom: 16px;">
              <label>Số điện thoại đặt hàng</label>
              <input id="lookupPhone" type="tel" placeholder="Ví dụ: 0389726999" />
            </div>

            <button class="btn btn-primary" type="submit" style="width: 100%;">Tra cứu đơn hàng</button>
          </form>''',
        index,
        count=1
    )

js_helpers = r'''
    function normalizeSearchValue(value) {
      return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function toggleProductSearch(open) {
      const modal = document.getElementById("productSearchModal");
      const input = document.getElementById("productSearchInput");
      if (!modal) return;
      modal.classList.toggle("open", !!open);
      if (open) setTimeout(() => input && input.focus(), 80);
    }

    function closeProductSearchOnBackdrop(event) {
      if (event.target && event.target.id === "productSearchModal") {
        toggleProductSearch(false);
      }
    }

    function collectProductCardsForSearch() {
      const selectors = [
        "#featuredGrid .card",
        "#menuGroups .menu-item",
        "#merchGroups .card",
        "#merchGroups .menu-item"
      ];

      return selectors.flatMap(selector => {
        return Array.from(document.querySelectorAll(selector)).map(card => {
          const name = card.querySelector("h3")?.innerText?.trim() || "";
          const desc = card.querySelector("p, .menu-item-desc")?.innerText?.trim() || "";
          const price = card.querySelector(".price")?.innerText?.trim() || "";
          const page = selector.includes("merch") ? "merch" : "menu";
          return { card, name, desc, price, page };
        });
      }).filter(item => item.name);
    }

    function handleProductSearch(event) {
      if (event && event.preventDefault) event.preventDefault();

      const input = document.getElementById("productSearchInput");
      const resultsBox = document.getElementById("productSearchResults");
      const keyword = normalizeSearchValue(input ? input.value : "");

      if (!resultsBox) return;

      if (!keyword) {
        resultsBox.innerHTML = `<p style="color: var(--muted); text-align: center;">Nhập tên sản phẩm để tìm trong Menu nước và Vật phẩm.</p>`;
        window.vpcSearchMatches = [];
        return;
      }

      const products = collectProductCardsForSearch();
      const matches = products.filter(item => {
        const haystack = normalizeSearchValue(`${item.name} ${item.desc} ${item.price}`);
        return haystack.includes(keyword);
      }).slice(0, 20);

      window.vpcSearchMatches = matches;

      if (!matches.length) {
        resultsBox.innerHTML = `<p style="color:#8e2b20; text-align:center;">Không tìm thấy sản phẩm phù hợp. Quý khách thử nhập tên ngắn hơn như "cà phê", "trà", "g7", "drip" nhé.</p>`;
        return;
      }

      resultsBox.innerHTML = matches.map((item, index) => `
        <div class="product-search-item">
          <strong>${safeText(item.name)}</strong>
          <span>${safeText(item.price || "Xem giá trong sản phẩm")}</span>
          <span>${safeText(item.desc || "")}</span>
          <button class="small-btn" type="button" onclick="goToSearchProduct(${index})">Xem sản phẩm</button>
        </div>
      `).join("");
    }

    function goToSearchProduct(index) {
      const item = Array.isArray(window.vpcSearchMatches) ? window.vpcSearchMatches[index] : null;
      if (!item || !item.card) return;

      toggleProductSearch(false);
      showPage(item.page);

      setTimeout(() => {
        document.querySelectorAll(".product-highlight").forEach(el => el.classList.remove("product-highlight"));
        item.card.classList.add("product-highlight");
        item.card.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          item.card.classList.remove("product-highlight");
        }, 3500);
      }, 300);
    }

    async function copyOrderCode(code, btn) {
      const text = String(code || "").trim();
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }

      if (btn) {
        const old = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.title = "Đã copy";
        setTimeout(() => {
          btn.innerHTML = old;
          btn.title = "Copy mã đơn";
        }, 1300);
      }
    }

    function getLookupOrderCode(order) {
      return order.ma_don_hang || order.order_code || order.order_number || order.code || "";
    }

    function getLookupCustomer(order) {
      return order.thong_tin_khach_hang || order.khach_hang || {};
    }

    function renderLookupOrders(orders) {
      if (!Array.isArray(orders)) orders = orders ? [orders] : [];

      if (!orders.length) {
        return "<p style='color: #8e2b20;'>Không tìm thấy đơn hàng phù hợp. Quý khách vui lòng kiểm tra lại mã đơn/số điện thoại hoặc gọi 038 972 6999.</p>";
      }

      return orders.map(order => {
        const kh = getLookupCustomer(order);
        const code = getLookupOrderCode(order);
        const status = order.trang_thai || order.status || "Không rõ";
        const paymentMethod = order.phuong_thuc_thanh_toan || order.payment_method || "";
        const total = order.tong_tien || order.total || order.amount || 0;
        const shippingAddress = order.dia_chi_giao_hang || order.dia_chi || kh.dia_chi || "Nhận tại cửa hàng";
        const name = order.ho_ten || order.ten_khach_hang || kh.ho_ten || "";
        const rawPhone = order.so_dien_thoai || order.phone || kh.so_dien_thoai || "";
        const phone = String(rawPhone || "").replace(/(\d{3})\d+(\d{3})$/, "$1***$2");

        let currentStepIdx = 0;
        const initStatuses = ["don_moi", "moi", "da_dat_don", "cho_chuyen_khoan", "cho_thanh_toan", "cho_xac_nhan_chuyen_khoan", "khach_bao_da_chuyen_khoan"];
        const prepareStatuses = ["da_tt", "da_thanh_toan", "da_chuyen_khoan", "da_nhan_don", "dang_lam", "dang_lam_don"];
        const shippingStatuses = ["da_giao_shipper", "dang_giao"];
        const doneStatuses = ["hoan_tat", "hoan_thanh", "da_giao"];

        if (initStatuses.includes(status)) currentStepIdx = 0;
        else if (prepareStatuses.includes(status)) currentStepIdx = 1;
        else if (shippingStatuses.includes(status)) currentStepIdx = 2;
        else if (doneStatuses.includes(status)) currentStepIdx = 3;

        let statusHtml = "";
        if (status === "tu_choi_don" || status === "tu_choi" || status === "da_huy") {
          statusHtml = `
            <div style="padding: 14px; background: #fff1f1; border: 1px solid #f8d7da; border-radius: 12px; color: #842029; display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
              <strong style="font-size: 20px;">⚠️</strong>
              <div>
                <strong style="display: block; font-size: 14px;">ĐƠN HÀNG ĐÃ BỊ HỦY/TỪ CHỐI</strong>
                <span style="font-size: 12px;">Quý khách vui lòng liên hệ 038 972 6999 để được hỗ trợ.</span>
              </div>
            </div>
          `;
        } else {
          const steps = [
            { label: "Tiếp nhận", desc: "Đã nhận đơn" },
            { label: "Pha chế", desc: "Đang chuẩn bị" },
            { label: "Đang giao", desc: "Shipper giao hàng" },
            { label: "Hoàn thành", desc: "Đã hoàn tất" }
          ];
          const widthPct = (currentStepIdx / 3) * 100;

          statusHtml = `
            <div class="timeline-container">
              <div class="timeline-steps">
                <div class="timeline-progress-line" style="width: ${widthPct}%;"></div>
                ${steps.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isActive = idx === currentStepIdx;
                  let stepClass = "";
                  if (isActive) stepClass = "active";
                  else if (isCompleted) stepClass = "completed";

                  return `
                    <div class="timeline-step ${stepClass}">
                      <div class="timeline-node">${isCompleted ? "✓" : idx + 1}</div>
                      <div class="timeline-label" style="font-size: 11px; font-weight: 800;">${step.label}</div>
                      <div class="timeline-desc" style="font-size: 9px;">${isActive ? step.desc : (isCompleted ? "Đã xong" : "Chờ")}</div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }

        return `
          <div class="lookup-order-card">
            <h3 style="margin-bottom: 12px; color: var(--coffee-dark);">
              Mã đơn:
              <span>${safeText(code)}</span>
              <button class="copy-order-btn" type="button" onclick="copyOrderCode('${safeText(code)}', this)" title="Copy mã đơn">
                <i class="fa-regular fa-copy"></i>
              </button>
            </h3>

            ${statusHtml}

            <div style="margin-top: 20px; font-size: 13.5px; line-height: 1.6; border-top: 1px dashed #decdb9; padding-top: 16px;">
              <p><strong>Khách hàng:</strong> ${safeText(name)}</p>
              <p><strong>Số điện thoại:</strong> ${safeText(phone)}</p>
              <p><strong>Địa chỉ:</strong> ${safeText(shippingAddress)}</p>
              <p><strong>Hình thức nhận:</strong> ${order.hinh_thuc_nhan_hang === "den_lay_tai_quan" ? "Đến lấy tại quán" : "Giao hàng tận nơi"}</p>
              <p><strong>Thanh toán:</strong> ${paymentMethod === "chuyen_khoan" || paymentMethod === "bank_transfer" ? "Chuyển khoản VietinBank" : "Tiền mặt/COD"}</p>
              <p><strong>Tổng cộng:</strong> <strong style="color: var(--gold); font-size: 16px;">${formatMoney(total)}</strong></p>
            </div>
          </div>
        `;
      }).join("");
    }
'''

if "function toggleProductSearch(open)" not in index:
    index = index.replace("    // 10. Tra cứu đơn hàng thời gian thực", js_helpers + "\n\n    // 10. Tra cứu đơn hàng thời gian thực", 1)

new_lookup = r'''    // 10. Tra cứu đơn hàng thời gian thực
    async function handleLookupOrder(event) {
      event.preventDefault();

      const codeInput = document.getElementById("lookupOrderCode");
      const phoneInput = document.getElementById("lookupPhone");
      const code = codeInput ? codeInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const resultBox = document.getElementById("lookupResultBox");

      if (!code && !phone) {
        alert("Vui lòng nhập mã đơn hàng hoặc số điện thoại đặt hàng.");
        return;
      }

      resultBox.innerHTML = "<p>Đang tìm kiếm thông tin đơn hàng...</p>";
      resultBox.style.display = "block";

      try {
        let response;

        if (code) {
          response = await fetch(`${API_URL}/api/don-hang/${encodeURIComponent(code)}`);
        } else {
          response = await fetch(`${API_URL}/api/don-hang/tra-cuu?phone=${encodeURIComponent(phone)}`);
        }

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || result.error || "Không tìm thấy đơn hàng");
        }

        const payload = result.data || result.orders || result;
        const orders = Array.isArray(payload) ? payload : [payload];

        resultBox.innerHTML = renderLookupOrders(orders);
      } catch (error) {
        console.error("Lỗi tra cứu đơn:", error);
        resultBox.innerHTML = "<p style='color: #8e2b20;'>Không tìm thấy đơn hàng hoặc máy chủ bận. Quý khách vui lòng kiểm tra lại mã/số điện thoại hoặc liên hệ 038 972 6999 để được hỗ trợ trực tiếp.</p>";
      }
    }

    // 11. Conversational Chatbot Script'''

index = re.sub(
    r'    // 10\. Tra cứu đơn hàng thời gian thực\s+async function handleLookupOrder\(event\) \{[\s\S]*?\n    \}\n\n    // 11\. Conversational Chatbot Script',
    new_lookup,
    index,
    count=1
)

phone_endpoint = r'''
/* =========================================================
   CUSTOMER API - TRA CỨU ĐƠN HÀNG BẰNG SỐ ĐIỆN THOẠI
========================================================= */
app.get("/api/don-hang/tra-cuu", async (req, res) => {
  try {
    const phoneRaw = String(req.query.phone || "").trim();
    const phoneDigits = phoneRaw.replace(/\D/g, "");

    if (!phoneDigits || phoneDigits.length < 8) {
      return res.status(400).json({
        message: "Vui lòng nhập số điện thoại hợp lệ",
        data: []
      });
    }

    const normalizePhone = value => String(value || "").replace(/\D/g, "");
    let orders = [];

    try {
      const direct = await supabase
        .from("don_hang")
        .select(`
          *,
          thong_tin_khach_hang (
            ho_ten,
            so_dien_thoai,
            email,
            dia_chi
          )
        `)
        .or(`so_dien_thoai.eq.${phoneRaw},phone.eq.${phoneRaw},customer_phone.eq.${phoneRaw}`)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!direct.error && Array.isArray(direct.data) && direct.data.length) {
        orders = direct.data;
      }
    } catch (error) {
      console.warn("Không tra cứu được trực tiếp theo cột phone:", error.message);
    }

    if (!orders.length) {
      const recent = await supabase
        .from("don_hang")
        .select(`
          *,
          thong_tin_khach_hang (
            ho_ten,
            so_dien_thoai,
            email,
            dia_chi
          )
        `)
        .order("created_at", { ascending: false })
        .limit(300);

      if (recent.error) throw recent.error;

      orders = (recent.data || []).filter(order => {
        const kh = order.thong_tin_khach_hang || {};
        const candidates = [
          order.so_dien_thoai,
          order.phone,
          order.customer_phone,
          kh.so_dien_thoai
        ];

        return candidates.some(value => normalizePhone(value) === phoneDigits);
      }).slice(0, 20);
    }

    if (!orders.length) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng với số điện thoại này",
        data: []
      });
    }

    res.json({
      message: "Tìm thấy đơn hàng",
      data: orders.map(normalizeOrderForAdmin)
    });
  } catch (error) {
    console.error("Lỗi tra cứu đơn hàng bằng số điện thoại:", error);
    res.status(500).json({
      message: "Lỗi tra cứu đơn hàng bằng số điện thoại",
      error: error.message
    });
  }
});

'''

if '/api/don-hang/tra-cuu' not in server:
    marker = 'app.get("/api/don-hang/:ma_don_hang"'
    idx = server.find(marker)
    if idx == -1:
        raise RuntimeError("Không tìm thấy endpoint /api/don-hang/:ma_don_hang để chèn tra cứu bằng số điện thoại.")
    server = server[:idx] + phone_endpoint + "\n" + server[idx:]

index_path.write_text(index, encoding="utf-8")
server_path.write_text(server, encoding="utf-8")

print("Đã thêm:")
print("- Icon kính lúp cạnh giỏ hàng")
print("- Modal tìm kiếm sản phẩm theo tên")
print("- Tra cứu đơn bằng số điện thoại")
print("- Nút copy mã đơn")
print("Backup timestamp:", ts)
