const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = "C:\\Users\\dell 7620\\Desktop\\index.html";
const fallbacksPath = path.join(__dirname, 'fallbacks_data.js');

try {
  console.log("🛠️ Đang đọc dữ liệu fallbacks và file index.html...");
  const fallbacksCode = fs.readFileSync(fallbacksPath, 'utf8');
  let html = fs.readFileSync(projectIndex, 'utf8');

  // 1. Chèn dữ liệu fallback vào đầu thẻ <script>
  const apiRegex = /const API_URL = \(window\.location\.hostname[\s\S]*?:\s*"https:\/\/website-vpc\.vercel\.app";/;
  const match = html.match(apiRegex);
  if (!match) {
    console.error("❌ Không tìm thấy API_URL trong index.html");
    process.exit(1);
  }
  const targetScriptStart = match[0];

  // Chúng ta sẽ định nghĩa hàm helper render ngay dưới fallbacksCode
  const helpersCode = `
    ${fallbacksCode}

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
        if (!grouped[item.slug_danh_muc]) {
          grouped[item.slug_danh_muc] = {
            id: item.slug_danh_muc,
            title: item.ten_danh_muc,
            desc: categoryDescMap[item.slug_danh_muc] || "",
            items: []
          };
        }

        grouped[item.slug_danh_muc].items.push(item);
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
              const priceNum = getDrinkPriceNumber(item);

              return \`
                <div class="menu-item">
                  <div>
                    <img
                      class="menu-item-img"
                      src="\${drinkImageMap[item.slug] || defaultDrinkImage}"
                      alt="\${safeText(item.ten_san_pham)}"
                    >

                    <h3>\${safeText(item.ten_san_pham)}</h3>
                    <p>\${safeText(item.mo_ta)}</p>
                    <div class="price">\${priceLabel}</div>
                  </div>

                  \${renderOrderButtons(item, false)}
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

  // 2. Định nghĩa hàm renderMenu và renderMerch mới sử dụng helper và catch fallback
  const newRenderMenu = `
    async function renderMenu() {
      const tabs = document.getElementById("menuTabs");
      const groups = document.getElementById("menuGroups");

      if (!tabs || !groups) return;

      try {
        tabs.innerHTML = "";
        groups.innerHTML = "<p>Đang tải menu đồ uống...</p>";

        if (!supabase) {
          throw new Error("Supabase client is not initialized.");
        }

        const { data: rawProducts, error: prodErr } = await supabase
          .from('products')
          .select('*, categories (slug, name)')
          .eq('status', 'active');

        if (prodErr) throw prodErr;

        const MERCH_SLUGS = ['merchandise', 'vat-pham', 'ca-phe-hat', 'ca-phe-drip', 'ca-phe-phin', 'ca-phe-bot-sang-tao', 'ca-phe-bot-phin', 'ca-phe-hoa-tan', 'ca-phe-hoa-tan-g7', 'ca-phe-legend', 'dung-cu-pha-che', 'ly-tach-binh-giu-nhiet', 'phu-kien-thuong-hieu', 'bo-qua-tang', 'vat-pham-thuong-hieu'];

        const drinks = rawProducts
          .filter(p => p.categories && !MERCH_SLUGS.includes(p.categories.slug))
          .map(p => ({
            ten_san_pham: p.name,
            slug: p.slug,
            mo_ta: p.short_description || p.description || "",
            gia_den: p.metadata?.gia_den || p.price || 0,
            gia_sua: p.metadata?.gia_sua || 0,
            slug_danh_muc: p.categories.slug,
            ten_danh_muc: p.categories.name,
            sold_out: p.stock_quantity <= 0
          }));

        renderMenuItems(drinks, tabs, groups);
      } catch (error) {
        console.warn("⚠️ Supabase renderMenu failed - switching to static fallback:", error.message);
        const drinks = getDrinksFallback();
        renderMenuItems(drinks, tabs, groups);
      }
    }
  `;

  const newRenderMerch = `
    async function renderMerch() {
      const tabs = document.getElementById("merchTabs");
      const groupsBox = document.getElementById("merchGroups");

      if (!tabs || !groupsBox) return;

      try {
        tabs.innerHTML = "";
        groupsBox.innerHTML = "<p>Đang tải Vật phẩm...</p>";

        if (!supabase) {
          throw new Error("Supabase client is not initialized.");
        }

        const { data: rawItems, error: merchErr } = await supabase
          .from('products')
          .select('*, categories (slug, name)')
          .eq('status', 'active');

        if (merchErr) throw merchErr;

        const MERCH_SLUGS = ['merchandise', 'vat-pham', 'ca-phe-hat', 'ca-phe-drip', 'ca-phe-phin', 'ca-phe-bot-sang-tao', 'ca-phe-bot-phin', 'ca-phe-hoa-tan', 'ca-phe-hoa-tan-g7', 'ca-phe-legend', 'dung-cu-pha-che', 'ly-tach-binh-giu-nhiet', 'phu-kien-thuong-hieu', 'bo-qua-tang', 'vat-pham-thuong-hieu'];

        let items = rawItems
          .filter(p => p.categories && MERCH_SLUGS.includes(p.categories.slug))
          .map(p => ({
            ten_san_pham: p.name,
            slug: p.slug,
            mo_ta: p.short_description || p.description || "",
            gia: p.price,
            ten_danh_muc: p.categories.name,
            slug_danh_muc: p.categories.slug,
            stock_quantity: p.stock_quantity
          }));

        items = items.filter(item => item.slug !== 'ca-phe-sang-tao-1-250gr' && item.slug !== 'g7-gu-manh-12-sticks');

        const grouped = {};

        items.forEach(item => {
          let groupSlug = item.slug_danh_muc || "khac";
          let groupName = item.ten_danh_muc || "Khác";

          if (
            groupSlug === "phu-kien-thuong-hieu" || 
            groupSlug === "bo-qua-tang" || 
            groupSlug === "vat-pham" || 
            groupSlug === "vat-pham-thuong-hieu"
          ) {
            groupSlug = "vat-pham";
            groupName = "Vật phẩm";
          }

          if (
            groupSlug === "ca-phe-bot-sang-tao" || 
            groupSlug === "ca-phe-bot-phin" || 
            groupSlug === "ca-phe-phin"
          ) {
            groupSlug = "ca-phe-phin";
            groupName = "Cà phê phin";
          }

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

        tabs.innerHTML = groupList.map(group => `
          <a class="tab-link" href="#${group.id}">
            \${safeText(group.title)}
          </a>
        `).join("");

        groupsBox.innerHTML = groupList.map(group => `
          <section class="menu-group" id="${group.id}">
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

                return \`
                  <div class="card">
                    <img class="card-img" src="\${img}" alt="\${safeText(tenHienThi)}">
                    <div class="card-body">
                      <div style="flex: 1; display: flex; flex-direction: column;">
                        <h3>\${safeText(tenHienThi)}</h3>
                        <p style="font-size: 13px; color: var(--gold); font-weight: 800; margin-bottom: 6px;">Danh mục: \${safeText(group.title)}</p>
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
              }).join("")}
            </div>
          </section>
        `).join("");

      } catch (error) {
        console.warn("⚠️ Supabase renderMerch failed - switching to static fallback:", error.message);
        const items = getMerchFallback();
        const grouped = {};
        items.forEach(item => {
          let groupSlug = item.slug_danh_muc || "khac";
          let groupName = item.ten_danh_muc || "Khác";
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
        const order = ["ca-phe-hat", "ca-phe-phin", "ca-phe-hoa-tan-g7", "ca-phe-legend", "dung-cu-pha-che", "ly-tach-binh-giu-nhiet", "vat-pham", "khac"];
        const groupList = Object.values(grouped).sort((a, b) => {
          const indexA = order.indexOf(a.id);
          const indexB = order.indexOf(b.id);
          if (indexA === -1 && indexB === -1) return a.title.localeCompare(b.title);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        tabs.innerHTML = groupList.map(group => `
          <a class="tab-link" href="#${group.id}">
            \${safeText(group.title)}
          </a>
        `).join("");

        groupsBox.innerHTML = groupList.map(group => `
          <section class="menu-group" id="${group.id}">
            <h2>\${safeText(mapCategoryTitle(group.title))}</h2>
            <p class="menu-group-desc">\${safeText(group.desc)}</p>
            <div class="grid grid-4">
              \${group.items.map(item => {
                const img = merchImageMap[item.slug] || defaultMerchImage;
                const priceLabel = formatMoney(item.gia);
                const priceNum = Number(item.gia || 0);
                const isSoldOut = item.stock_quantity <= 0;
                return \`
                  <div class="card">
                    <img class="card-img" src="\${img}" alt="\${safeText(item.ten_san_pham)}">
                    <div class="card-body">
                      <div style="flex: 1; display: flex; flex-direction: column;">
                        <h3>\${safeText(item.ten_san_pham)}</h3>
                        <p style="font-size: 13px; color: var(--gold); font-weight: 800; margin-bottom: 6px;">Danh mục: \${safeText(group.title)}</p>
                        <p style="flex: 1; font-size: 13.5px; margin-bottom: 12px;">\${safeText(item.mo_ta)}</p>
                        <div class="price" style="margin: 4px 0 12px; text-align: center;">\${priceLabel}</div>
                      </div>
                      <div style="display: flex; justify-content: center; width: 100%; margin-top: auto;">
                        \${isSoldOut ? \`
                          <button class="small-btn disabled-btn" style="width: 100%; max-width: 180px; text-align: center; background: #cccccc !important; color: #666666 !important; cursor: not-allowed; border: none;" disabled>Tạm hết hàng</button>
                        \` : \`
                          <button class="small-btn" style="width: 100%; max-width: 180px; text-align: center;" onclick='addToCart(\${JSON.stringify(item.ten_san_pham)}, \${priceNum}, \${JSON.stringify(priceLabel)})'>Đặt mua</button>
                        \`}
                      </div>
                    </div>
                  </div>
                \`;
              }).join("")}
            </div>
          </section>
        `).join("");
      }
    }
  `;

  // Thay thế renderMenu cũ bằng newRenderMenu
  // Tìm từ "async function renderMenu()" đến hết dấu đóng ngoặc nhọn của nó
  // Để tránh lỗi replace sai, ta sẽ dùng replace với regex chính xác
  const menuRegex = /async function renderMenu\(\)[\s\S]*?async function renderMerch\(\)/;
  if (!menuRegex.test(html)) {
    console.error("❌ Không tìm thấy hàm renderMenu() trong index.html");
    process.exit(1);
  }

  html = html.replace(menuRegex, `${newRenderMenu}\n\n    async function renderMerch()`);
  console.log("✅ Đã cập nhật hàm renderMenu với cơ chế fallback.");

  // Thay thế renderMerch cũ bằng newRenderMerch
  // Hàm renderMerch cũ bắt đầu từ async function renderMerch() và kết thúc trước function renderBlog()
  const merchRegex = /async function renderMerch\(\)[\s\S]*?function renderBlog\(\)/;
  if (!merchRegex.test(html)) {
    console.error("❌ Không tìm thấy hàm renderMerch() trong index.html");
    process.exit(1);
  }

  html = html.replace(merchRegex, `${newRenderMerch}\n\n    function renderBlog()`);
  console.log("✅ Đã cập nhật hàm renderMerch với cơ chế fallback.");

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
