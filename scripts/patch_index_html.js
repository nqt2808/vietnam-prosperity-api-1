const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = "C:\\Users\\dell 7620\\Desktop\\index.html";
const fallbacksPath = path.join(__dirname, 'fallbacks_data.js');

try {
  console.log("🛠️ Đang đọc dữ liệu fallbacks và file index.html...");
  const fallbacksCode = fs.readFileSync(fallbacksPath, 'utf8');
  let html = fs.readFileSync(projectIndex, 'utf8');

  // 1. Chèn dữ liệu fallback và helper vào đầu thẻ <script>
  const apiRegex = /const API_URL\s*=\s*(?:\(window\.location\.hostname[\s\S]*?:\s*"https:\/\/website-vpc\.vercel\.app"|"[^"]*"|'[^']*');/;
  const match = html.match(apiRegex);
  if (!match) {
    console.error("❌ Không tìm thấy API_URL trong index.html");
    process.exit(1);
  }
  const targetScriptStart = match[0];

  // Định nghĩa categoryDescMap và các hàm helper render ngay dưới fallbacksCode
  const helpersCode = `
    ${fallbacksCode}

    const categoryDescMap = {
      "ca-phe-phin": "Các món cà phê phin truyền thống thơm ngon, đậm đà nguyên bản.",
      "ca-phe-may": "Các dòng cà phê pha máy espresso, cappuccino, latte hiện đại thơm béo.",
      "ca-phe-pha-che": "Các thức uống cà phê pha chế signature độc đáo như cà phê muối, cà phê cốt dừa.",
      "tra-tra-sua": "Các món trà và trà sữa thanh mát thơm ngon.",
      "sinh-to-da-xay": "Các dòng sinh tố, đá xay mát lạnh sảng khoái.",
      "nuoc-ep": "Nước ép trái cây tươi nguyên chất giàu vitamin.",
      "nuoc-thanh-nhiet": "Thức uống thảo mộc và nước giải nhiệt thanh lọc cơ thể.",
      "matcha-cacao": "Các món từ bột trà xanh Uji Nhật Bản và cacao nguyên chất thơm béo.",
      "banh": "Các loại bánh mousse và bánh croissant thực dưỡng, ngọt mát mềm mịn.",
      "mon-extra": "Các phần topping và nguyên liệu thêm tùy chọn."
    };

    function renderMenuItems(drinks, tabs, groups) {
      const processedDrinks = [];

      drinks.forEach(item => {
        if (item.slug === 'sinh-to-theo-mua') {
          const flavors = [
            { name: 'Sinh tố Xoài', slug: 'sinh-to-xoai', desc: 'Sinh tố xoài tươi mát béo ngậy.' },
            { name: 'Sinh tố Bơ', slug: 'sinh-to-bo', desc: 'Sinh tố bơ thơm béo mịn màng.' },
            { name: 'Sinh tố Chanh Dây', slug: 'sinh-to-chanh-day', desc: 'Sinh tố chanh dây chua ngọt tươi mát.' },
            { name: 'Sinh tố Dâu', slug: 'sinh-to-dau', desc: 'Sinh tố dâu tây tươi ngon ngọt ngào.' }
          ];
          flavors.forEach(f => {
            processedDrinks.push({
              ...item,
              ten_san_pham: f.name,
              slug: f.slug,
              mo_ta: f.desc
            });
          });
        } else if (item.slug === 'nuoc-chanh-day-cam-vat') {
          processedDrinks.push({
            ...item,
            ten_san_pham: 'Nước Ép Chanh Dây',
            slug: 'nuoc-ep-chanh-day',
            mo_ta: 'Nước ép chanh dây chua ngọt thanh mát.'
          });
          processedDrinks.push({
            ...item,
            ten_san_pham: 'Cam vắt',
            slug: 'cam-vat',
            mo_ta: 'Nước cam vắt nguyên chất giàu Vitamin C.'
          });
        } else if (item.slug === 'nuoc-ep-thom-dua-hau') {
          processedDrinks.push({
            ...item,
            ten_san_pham: 'Nước thơm ép',
            slug: 'nuoc-thom-ep',
            mo_ta: 'Nước thơm ép (dứa) ngọt thanh mát lạnh.'
          });
          processedDrinks.push({
            ...item,
            ten_san_pham: 'Dưa hấu',
            slug: 'dua-hau',
            mo_ta: 'Nước ép dưa hấu tươi ngon giải nhiệt cực tốt.'
          });
        } else {
          processedDrinks.push(item);
        }
      });

      const grouped = {};

      processedDrinks.forEach(item => {
        let slugCat = item.slug_danh_muc || "khac";
        let nameCat = item.ten_danh_muc || "Khác";

        // Khắc phục thông minh nếu database gắn nhãn Khác
        if (slugCat === "khac" || nameCat === "Khác") {
          const nameLower = (item.ten_san_pham || "").toLowerCase();
          if (nameLower.includes("phin") || nameLower.includes("năng lượng") || nameLower.includes("success sữa đá") || nameLower.includes("legend")) {
            slugCat = "ca-phe-phin";
            nameCat = "Cà phê phin";
          } else if (nameLower.includes("cappuccino") || nameLower.includes("latte") || nameLower.includes("espresso") || nameLower.includes("americano") || nameLower.includes("success")) {
            slugCat = "ca-phe-may";
            nameCat = "Cà phê máy";
          } else if (nameLower.includes("muối") || nameLower.includes("dừa") || nameLower.includes("trứng") || nameLower.includes("bạc xỉu") || nameLower.includes("cold brew") || nameLower.includes("mother land") || nameLower.includes("hạnh nhân")) {
            slugCat = "ca-phe-pha-che";
            nameCat = "Cà phê pha chế";
          } else if (nameLower.includes("sinh tố") || nameLower.includes("đá xay") || nameLower.includes("kim quất") || nameLower.includes("trà xanh đá xay")) {
            slugCat = "sinh-to-da-xay";
            nameCat = "Sinh tố & Đá xay";
          } else if (nameLower.includes("trà") || nameLower.includes("sen vàng")) {
            slugCat = "tra-tra-sua";
            nameCat = "Trà & Trà sữa";
          } else if (nameLower.includes("nước ép") || nameLower.includes("cam vắt") || nameLower.includes("dưa hấu") || nameLower.includes("thơm ép")) {
            slugCat = "nuoc-ep";
            nameCat = "Nước ép";
          } else if (nameLower.includes("hibiscus") || nameLower.includes("thanh nhiệt") || nameLower.includes("sả gừng") || nameLower.includes("chanh muối") || nameLower.includes("nước suối")) {
            slugCat = "nuoc-thanh-nhiet";
            nameCat = "Nước thanh nhiệt";
          } else if (nameLower.includes("matcha") || nameLower.includes("cacao") || nameLower.includes("sữa tươi")) {
            slugCat = "matcha-cacao";
            nameCat = "Matcha & Cacao";
          } else if (nameLower.includes("bánh") || nameLower.includes("panna cotta") || nameLower.includes("mousse") || nameLower.includes("croissant") || nameLower.includes("tiramisu")) {
            slugCat = "banh";
            nameCat = "Bánh ngọt";
          } else {
            slugCat = "mon-extra";
            nameCat = "Món Extra";
          }
        }

        if (!grouped[slugCat]) {
          grouped[slugCat] = {
            id: slugCat,
            title: nameCat,
            desc: categoryDescMap[slugCat] || "",
            items: []
          };
        }

        grouped[slugCat].items.push(item);
      });

      const groupList = Object.values(grouped);

      tabs.innerHTML = groupList.map(group => \`
        <a class="tab-link" href="#\${group.id}">\${safeText(group.title)}</a>
      \`).join("");

      groups.innerHTML = groupList.map(group => \`
        <section class="menu-group" id="\${group.id}">
          <h2>\${safeText(group.title)}</h2>
          <p class="menu-group-desc">\${safeText(group.desc)}</p>

          <div class="menu-list">
            \${group.items.map(item => {
              const priceLabel = getDrinkPriceLabel(item);
              const premiumDesc = getPremiumDescription(item.slug, item.ten_san_pham, item.mo_ta);

              return \`
                <div class="menu-item">
                  <img
                    class="menu-item-img"
                    src="\${drinkImageMap[item.slug] || defaultDrinkImage}"
                    alt="\${safeText(item.ten_san_pham)}"
                  >
                  <div class="menu-item-inner">
                    <h3>\${safeText(item.ten_san_pham)}</h3>
                    <p class="menu-item-desc">"\${safeText(premiumDesc)}"</p>
                    <div class="price">\${priceLabel}</div>
                  </div>

                  <div class="menu-item-btn-row">
                    \${renderOrderButtons(item, false)}
                  </div>
                </div>
              \`;
            }).join("")}
          </div>
        </section>
      \`).join("");
    }

    function renderMerchItems(items, grid) {
      grid.innerHTML = items.map(item => {
        const img = merchImageMap[item.slug] || defaultMerchImage;
        const priceLabel = formatMoney(item.gia);
        const priceNum = Number(item.gia || 0);

        let tenHienThi = item.ten_san_pham;
        if (item.slug === 'hop-set-legend-225gr') {
          tenHienThi = 'Hộp quà giàu có';
        }

        const isSoldOut = item.sold_out === true ||
          item.status === 'soldout' ||
          item.status === 'inactive' ||
          item.trang_thai === 'soldout' ||
          item.trang_thai === 'ngung_ban' ||
          item.ton_kho === 0 ||
          item.stock_quantity === 0 ||
          (item.stock_quantity !== undefined && Number(item.stock_quantity) <= 0);

        return \`
          <div class="card">
            <img class="card-img" src="\${img}" alt="\${safeText(tenHienThi)}">
            <div class="card-body">
              <div style="flex: 1; display: flex; flex-direction: column;">
                <h3>\${safeText(tenHienThi)}</h3>
                <p style="font-size: 13px; color: var(--gold); font-weight: 800; margin-bottom: 6px;">Danh mục: \${safeText(item.ten_danh_muc)}</p>
                <p style="flex: 1; font-size: 13.5px; margin-bottom: 12px;">\${safeText(item.mo_ta)}</p>
                <div class="price" style="margin: 4px 0 12px; text-align: center;">\${priceLabel}</div>
              </div>
              <div style="display: flex; justify-content: center; width: 100%; margin-top: auto;">
                \${isSoldOut ? \`
                  <button 
                    class="small-btn disabled-btn" 
                    style="width: 100%; max-width: 180px; text-align: center; background: #cccccc !important; color: #666666 !important; cursor: not-allowed; border: none;" 
                    disabled
                  >
                    Tạm hết hàng
                  </button>
                \` : \`
                  <button 
                    class="small-btn" 
                    style="width: 100%; max-width: 180px; text-align: center;"
                    onclick='addToCart(\${JSON.stringify(item.ten_san_pham)}, \${priceNum}, \${JSON.stringify(priceLabel)})'
                  >
                    Đặt mua
                  </button>
                \`}
              </div>
            </div>
          </div>
        \`;
      }).join("");
    }
  `;

  // Chèn helpersCode ngay sau targetScriptStart
  html = html.replace(targetScriptStart, `${targetScriptStart}\n${helpersCode}`);
  console.log("✅ Đã chèn thành công dữ liệu fallback và các hàm helper render.");

  // 2. Định nghĩa hàm renderMenu sử dụng API `/api/do-uong`
  const newRenderMenu = `
    async function renderMenu() {
      const tabs = document.getElementById("menuTabs");
      const groups = document.getElementById("menuGroups");

      if (!tabs || !groups) return;

      // SWR: 1. Render immediately from cache or fallback data
      let drinks = getDrinksFallback();
      try {
        const cached = localStorage.getItem("vpc_cached_drinks");
        if (cached) {
          drinks = JSON.parse(cached);
        }
      } catch (e) {
        console.warn("Lỗi đọc vpc_cached_drinks từ localStorage:", e);
      }

      renderMenuItems(drinks, tabs, groups);

      // SWR: 2. Fetch fresh data in the background
      try {
        const freshDrinks = await fetchAPI("/api/do-uong");
        if (freshDrinks && freshDrinks.length > 0) {
          localStorage.setItem("vpc_cached_drinks", JSON.stringify(freshDrinks));
          renderMenuItems(freshDrinks, tabs, groups);
        }
      } catch (apiErr) {
        console.warn("⚠️ API tải menu nước lỗi (background):", apiErr.message);
      }
    }
  `;

  // 3. Định nghĩa hàm renderMerch sử dụng API `/api/vat-pham` hoặc `/api/merchandise`
  const newRenderMerch = `
    async function renderMerch() {
      const tabs = document.getElementById("merchTabs");
      const groupsBox = document.getElementById("merchGroups");

      if (!tabs || !groupsBox) return;

      // SWR: 1. Render immediately from cache or fallback data
      let items = getMerchFallback();
      try {
        const cached = localStorage.getItem("vpc_cached_merch");
        if (cached) {
          items = JSON.parse(cached);
        }
      } catch (e) {
        console.warn("Lỗi đọc vpc_cached_merch từ localStorage:", e);
      }

      // Helper function inline to format and group
      function displayItems(itemsList) {
        const filtered = itemsList.filter(item => item.slug !== 'ca-phe-sang-tao-1-250gr' && item.slug !== 'g7-gu-manh-12-sticks');

        const grouped = {};
        filtered.forEach(item => {
          let groupSlug = item.slug_danh_muc || "khac";
          let groupName = item.ten_danh_muc || "Khác";

          // Khắc phục thông minh nếu database gắn nhãn Khác hoặc rỗng
          if (groupSlug === "khac" || groupName === "Khác") {
            const nameLower = (item.ten_san_pham || "").toLowerCase();
            if (nameLower.includes("drip") || nameLower.includes("phin giấy")) {
              groupSlug = "ca-phe-hat";
              groupName = "Cà phê hạt";
            } else if (nameLower.includes("sáng tạo") || nameLower.includes("chế phin") || nameLower.includes("phin")) {
              groupSlug = "ca-phe-phin";
              groupName = "Cà phê phin";
            } else if (nameLower.includes("g7") || nameLower.includes("hòa tan") || nameLower.includes("cappuccino") || nameLower.includes("passiona") || nameLower.includes("sấy lạnh")) {
              groupSlug = "ca-phe-hoa-tan-g7";
              groupName = "Cà phê hòa tan G7";
            } else if (nameLower.includes("legend")) {
              groupSlug = "ca-phe-legend";
              groupName = "Cà phê Legend";
            } else if (nameLower.includes("ly sứ") || nameLower.includes("tách") || nameLower.includes("bình giữ nhiệt") || nameLower.includes("ly giữ nhiệt")) {
              groupSlug = "ly-tach-binh-giu-nhiet";
              groupName = "Ly, Tách, Bình giữ nhiệt";
            } else if (nameLower.includes("túi vải") || nameLower.includes("canvas") || nameLower.includes("sổ tay") || nameLower.includes("khăn rằn") || nameLower.includes("hộp quà") || nameLower.includes("gift set") || nameLower.includes("giàu có")) {
              groupSlug = "vat-pham";
              groupName = "Vật phẩm";
            }
          }

          // Gộp nhóm Phụ kiện thương hiệu (ID 18) và Bộ quà tặng (ID 17), Vật phẩm thương hiệu thành "Vật phẩm" (vat-pham)
          if (
            groupSlug === "phu-kien-thuong-hieu" || 
            groupSlug === "bo-qua-tang" || 
            groupSlug === "vat-pham" || 
            groupSlug === "vat-pham-thuong-hieu"
          ) {
            groupSlug = "vat-pham";
            groupName = "Vật phẩm";
          }

          // Gộp nhóm Cà phê bột phin / Cà phê bột & Sáng tạo / Cà phê phin thành "Cà phê phin" (ca-phe-phin)
          if (
            groupSlug === "ca-phe-bot-sang-tao" || 
            groupSlug === "ca-phe-bot-phin" || 
            groupSlug === "ca-phe-phin"
          ) {
            groupSlug = "ca-phe-phin";
            groupName = "Cà phê phin";
          }

          // Gộp nhóm Cà phê Drip và Cà phê hạt thành "Cà phê hạt" (ca-phe-hat)
          if (
            groupSlug === "ca-phe-drip" || 
            groupSlug === "ca-phe-hat"
          ) {
            groupSlug = "ca-phe-hat";
            groupName = "Cà phê hạt";
          }

          if (!grouped[groupSlug]) {
            grouped[groupSlug] = {
              id: groupSlug,
              title: groupName,
              desc: getMerchCategoryDesc(groupSlug),
              items: []
            };
          }

          grouped[groupSlug].items.push(item);
        });

        const order = [
          "ca-phe-hat",
          "ca-phe-phin",
          "ca-phe-hoa-tan-g7",
          "ca-phe-legend",
          "dung-cu-pha-che",
          "ly-tach-binh-giu-nhiet",
          "vat-pham",
          "khac"
        ];

        const groupList = Object.values(grouped).sort((a, b) => {
          const indexA = order.indexOf(a.id);
          const indexB = order.indexOf(b.id);
          if (indexA === -1 && indexB === -1) return a.title.localeCompare(b.title);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        tabs.innerHTML = groupList.map(group => \`
          <a class="tab-link" href="#\${group.id}">
            \${safeText(group.title)}
          </a>
        \`).join("");

        groupsBox.innerHTML = groupList.map(group => \`
          <section class="menu-group" id="\${group.id}">
            <h2>\${safeText(mapCategoryTitle(group.title))}</h2>
            <p class="menu-group-desc">\${safeText(group.desc)}</p>
            <div class="grid grid-4">
              \${group.items.map(item => {
                const img = merchImageMap[item.slug] || defaultMerchImage;
                const priceLabel = formatMoney(item.gia);
                const priceNum = Number(item.gia || 0);

                let tenHienThi = item.ten_san_pham;
                if (item.slug === 'hop-set-legend-225gr') {
                  tenHienThi = 'Hộp quà giàu có';
                }

                const isSoldOut = item.sold_out === true ||
                  item.status === 'soldout' ||
                  item.status === 'inactive' ||
                  item.trang_thai === 'soldout' ||
                  item.trang_thai === 'ngung_ban' ||
                  item.ton_kho === 0 ||
                  item.stock_quantity === 0 ||
                  (item.stock_quantity !== undefined && Number(item.stock_quantity) <= 0);

                return \\\`
                  <div class="card">
                    <img class="card-img" src="\\\${img}" alt="\\\${safeText(tenHienThi)}">
                    <div class="card-body">
                      <div style="flex: 1; display: flex; flex-direction: column;">
                        <h3>\\\${safeText(tenHienThi)}</h3>
                        <p style="font-size: 13px; color: var(--gold); font-weight: 800; margin-bottom: 6px;">Danh mục: \\\${safeText(group.title)}</p>
                        <p style="flex: 1; font-size: 13.5px; margin-bottom: 12px;">\\\${safeText(item.mo_ta)}</p>
                        <div class="price" style="margin: 4px 0 12px; text-align: center;">\\\${priceLabel}</div>
                      </div>
                      <div style="display: flex; justify-content: center; width: 100%; margin-top: auto;">
                        \\\${isSoldOut ? \\\`
                          <button class="small-btn disabled-btn" style="width: 100%; max-width: 180px; text-align: center; background: #cccccc !important; color: #666666 !important; cursor: not-allowed; border: none;" disabled>Tạm hết hàng</button>
                        \\\` : \\\`
                          <button class="small-btn" style="width: 100%; max-width: 180px; text-align: center;" onclick='addToCart(\\\${JSON.stringify(item.ten_san_pham)}, \\\${priceNum}, \\\${JSON.stringify(priceLabel)})'>Đặt mua</button>
                        \\\`}
                      </div>
                    </div>
                  </div>
                \\\`;
              }).join("")}
            </div>
          </section>
        \`).join("");
      }

      displayItems(items);

      // SWR: 2. Fetch fresh data in the background
      try {
        let freshItems;
        try {
          freshItems = await fetchAPI("/api/merchandise");
          if (!freshItems || freshItems.length === 0) throw new Error("Rỗng");
        } catch (error1) {
          console.warn("API /api/merchandise lỗi, thử /api/vat-pham", error1);
          try {
            freshItems = await fetchAPI("/api/vat-pham");
            if (!freshItems || freshItems.length === 0) throw new Error("Rỗng");
          } catch (error2) {
            console.warn("API /api/vat-pham cũng lỗi, dùng dữ liệu tĩnh", error2);
            freshItems = getMerchFallback();
          }
        }
        if (freshItems && freshItems.length > 0) {
          localStorage.setItem("vpc_cached_merch", JSON.stringify(freshItems));
          displayItems(freshItems);
        }
      } catch (apiErr) {
        console.warn("⚠️ API tải vật phẩm lỗi (background):", apiErr.message);
      }
    }
  `;

  // Thay thế renderMenu cũ bằng newRenderMenu
  const menuRegex = /async function renderMenu\(\)[\s\S]*?async function renderMerch\(\)/;
  if (!menuRegex.test(html)) {
    console.error("❌ Không tìm thấy hàm renderMenu() trong index.html");
    process.exit(1);
  }

  html = html.replace(menuRegex, `${newRenderMenu}\n\n    async function renderMerch()`);
  console.log("✅ Đã cập nhật hàm renderMenu với cơ chế fallback và API mới.");

  // Thay thế renderMerch cũ bằng newRenderMerch
  const merchRegex = /async function renderMerch\(\)[\s\S]*?function renderBlog\(\)/;
  if (!merchRegex.test(html)) {
    console.error("❌ Không tìm thấy hàm renderMerch() trong index.html");
    process.exit(1);
  }

  html = html.replace(merchRegex, `${newRenderMerch}\n\n    function renderBlog()`);
  console.log("✅ Đã cập nhật hàm renderMerch với cơ chế fallback và API mới.");

  // Ghi đè vào file index.html của dự án
  fs.writeFileSync(projectIndex, html, 'utf8');
  console.log("🎉 Đã lưu cập nhật thành công vào file index.html của dự án!");

  // Sao chép sang màn hình chính Desktop của user
  fs.writeFileSync(desktopIndex, html, 'utf8');
  console.log(`🎉 Đã sao chép thành công file index.html đã sửa ra Desktop của user tại: ${desktopIndex}`);

} catch (err) {
  console.error("❌ Lỗi khi patch index.html:", err);
  process.exit(1);
}
