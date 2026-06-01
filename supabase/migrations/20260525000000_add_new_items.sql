-- ══════════════════════════════════════════════════════════
-- MIGRATION: BỔ SUNG 17 VẬT PHẨM MERCHANDISE MỚI VÀ CẬP NHẬT GIÁ
-- ══════════════════════════════════════════════════════════

DO $$
DECLARE
    v_category_id UUID;
    v_product_id UUID;
BEGIN
    -- 1. Lấy ID của danh mục merchandise
    SELECT id INTO v_category_id FROM public.categories WHERE slug = 'merchandise' LIMIT 1;
    
    IF v_category_id IS NULL THEN
        RAISE NOTICE 'Category with slug "merchandise" not found! Creating one...';
        INSERT INTO public.categories (name, slug, description, sort_order, is_active)
        VALUES ('Merchandise', 'merchandise', 'Dụng cụ pha chế, ly tách lưu niệm và cà phê hạt/hộp đặc sản.', 9, true)
        RETURNING id INTO v_category_id;
    END IF;

    -- 1. Sữa đặc có đường Brothers
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Sữa đặc có đường Brothers',
        'sua-dac-co-duong-brothers',
        'Sữa đặc có đường Brothers thơm béo dẻo ngọt, chuyên dùng pha chế cà phê chuẩn vị.',
        'Sữa đặc có đường Brothers thơm béo dẻo ngọt, sự kết hợp hoàn hảo để tạo nên ly cà phê sữa đá truyền thống thơm ngon đậm đà.',
        29000, 100, v_category_id, 'active', ARRAY['merch', 'milk'], '{"gia": 29000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/Sua-dac-EC-2.png', 'Sữa đặc có đường Brothers', 0, true);

    -- 2. Khăn rằn
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Khăn rằn',
        'khan-ran',
        'Khăn rằn truyền thống Trung Nguyên Legend, biểu tượng của tinh thần dấn thân.',
        'Khăn rằn truyền thống Trung Nguyên Legend mang thông điệp ý chí kiên cường, dấn thân và khát vọng phụng sự của thế hệ trẻ.',
        65000, 200, v_category_id, 'active', ARRAY['merch', 'accessories'], '{"gia": 65000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/khan-LE.png', 'Khăn rằn', 0, true);

    -- 3. Túi Vải Trung Nguyên Legend – Bộ Sưu Tập 3 Nền Văn Minh
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Túi Vải Trung Nguyên Legend – Bộ Sưu Tập 3 Nền Văn Minh',
        'tui-vai-trung-nguyen-legend-3-nen-van-minh',
        'Túi vải Canvas cao cấp thiết kế theo Bộ sưu tập 3 Nền Văn Minh Cà Phê tinh hoa.',
        'Túi vải Canvas cao cấp bền đẹp, in hình ảnh độc đáo đại diện cho 3 nền văn minh cà phê thế giới: Ottoman, Roman và Thiền.',
        75000, 100, v_category_id, 'active', ARRAY['merch', 'accessories'], '{"gia": 75000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/10/TNL_TUI-CANVAS-ROMAN-600x600.png', 'Túi Vải 3 Nền Văn Minh', 0, true);

    -- 4. Sổ tay Legend
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Sổ tay Legend',
        'so-tay-legend',
        'Sổ tay ghi chép Legend cao cấp in logo và các câu nói truyền cảm hứng sáng tạo.',
        'Sổ tay ghi chép Legend cao cấp với chất giấy mịn chống lóa, bìa in logo Trung Nguyên Legend sắc nét cùng những câu trích dẫn tri thức truyền cảm hứng.',
        125000, 150, v_category_id, 'active', ARRAY['merch', 'accessories'], '{"gia": 125000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/So-tay-LE.png', 'Sổ tay Legend', 0, true);

    -- 5. Ly Sứ Legend VIP Đen Trung Nguyên Legend – 350 ml
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Ly Sứ Legend VIP Đen Trung Nguyên Legend – 350 ml',
        'ly-su-legend-vip-den',
        'Ly sứ cao cấp in logo và văn hóa tri thức Trung Nguyên Legend màu đen bóng.',
        'Ly sứ gốm cao cấp màu đen bóng in logo thương hiệu Trung Nguyên Legend sắc sảo, dùng để thưởng thức những ly cà phê năng lượng nóng nồng nàn.',
        145000, 80, v_category_id, 'active', ARRAY['merch', 'cups'], '{"gia": 145000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://cafe.net.vn/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/6/0/6003796.jpg', 'Ly Sứ Legend VIP Đen', 0, true);

    -- 6. Bộ Tách Sứ Đen Trung Nguyên Legend – 300ml
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bộ Tách Sứ Đen Trung Nguyên Legend – 300ml',
        'bo-tach-su-den-trung-nguyen-legend-300ml',
        'Bộ tách và đĩa sứ cao cấp màu đen Trung Nguyên Legend.',
        'Bộ tách và đĩa sứ gốm cao cấp màu đen Trung Nguyên Legend dung tích 300ml, thích hợp thưởng thức các món cà phê máy espresso, cappuccino hay latte ấm nồng.',
        195000, 60, v_category_id, 'active', ARRAY['merch', 'cups'], '{"gia": 195000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://down-cvs-vn.img.susercontent.com/vn-11134517-7ras8-md45myo8th0cdd', 'Bộ Tách Sứ Đen', 0, true);

    -- 7. Ly Giữ Nhiệt Trung Nguyên Legend VF214 – 350ml
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Ly Giữ Nhiệt Trung Nguyên Legend VF214 – 350ml',
        'ly-giu-nhiet-trung-nguyen-legend-vf214-350ml',
        'Ly giữ nhiệt inox cao cấp 350ml, màu đen nhám, nắp đậy khít chống tràn.',
        'Ly giữ nhiệt inox 304 cao cấp 350ml màu đen nhám in logo lịch lãm, nắp đậy khít chống tràn, giữ nhiệt lạnh và nóng cực kỳ tốt và tiện lợi đem đi lại.',
        210000, 80, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 210000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/09/Ly-Giu-Nhiet-VF214-%E2%80%93-350ml-mau-den-2.png', 'Ly Giữ Nhiệt VF214', 0, true);

    -- 8. Bình Giữ Nhiệt Bao Da Trung Nguyên Legend – 350ml
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình Giữ Nhiệt Bao Da Trung Nguyên Legend – 350ml',
        'binh-giu-nhiet-bao-da-trung-nguyen-legend-350ml',
        'Bình giữ nhiệt bọc bao da cao cấp 350ml, thiết kế sang trọng, lịch lãm.',
        'Bình giữ nhiệt chất liệu inox cao cấp bọc bao da in nổi họa tiết thương hiệu tinh xảo, thể hiện đẳng cấp lịch lãm của người dùng.',
        290000, 50, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 290000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/BGN-bao-da-LE.png', 'Bình Giữ Nhiệt Bao Da', 0, true);

    -- 9. Bình giữ nhiệt Trung Nguyên Legend – Màu Trắng
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình giữ nhiệt Trung Nguyên Legend – Màu Trắng',
        'binh-giu-nhiet-trung-nguyen-legend-mau-trang',
        'Bình giữ nhiệt kim loại màu trắng sang trọng, logo in sắc sảo, giữ nhiệt cực tốt.',
        'Bình giữ nhiệt kim loại cao cấp màu trắng ngọc trai bóng, logo in sắc sảo thanh lịch, giữ nhiệt độ uống nóng lạnh vượt trội suốt cả ngày.',
        350000, 70, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Binh-giu-nhiet_WhiteCan-600x600.jpg', 'Bình giữ nhiệt Màu Trắng', 0, true);

    -- 10. Bình giữ nhiệt Trung Nguyên Legend (Màu Đen)
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình giữ nhiệt Trung Nguyên Legend (Màu Đen)',
        'binh-giu-nhiet-trung-nguyen-legend-mau-den',
        'Bình giữ nhiệt kim loại màu đen lịch lãm, logo in sắc sảo, giữ nhiệt cực tốt.',
        'Bình giữ nhiệt kim loại cao cấp màu đen nhám huyền bí, logo in sắc sảo mạnh mẽ, giữ nhiệt độ uống nóng lạnh cực tốt.',
        350000, 80, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2020/08/100758914_2825508094213680_4039200829587062784_n.jpg', 'Bình giữ nhiệt Màu Đen', 0, true);

    -- 11. Bình giữ nhiệt Trung Nguyên Legend – Màu Xám
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình giữ nhiệt Trung Nguyên Legend – Màu Xám',
        'binh-giu-nhiet-trung-nguyen-legend-mau-xam',
        'Bình giữ nhiệt kim loại màu xám tinh tế, logo in sắc sảo, giữ nhiệt cực tốt.',
        'Bình giữ nhiệt kim loại cao cấp màu xám hiện đại thanh tao, logo in tinh tế, giữ nhiệt độ uống nóng lạnh vượt trội.',
        350000, 50, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Gray-600x600.jpg', 'Bình giữ nhiệt Màu Xám', 0, true);

    -- 12. Bình Giữ Nhiệt Trung Nguyên Legend Màu Trắng – 350ml (Yêu Thương)
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình Giữ Nhiệt Trung Nguyên Legend Màu Trắng – 350ml (Yêu Thương)',
        'binh-giu-nhiet-trung-nguyen-legend-mau-trang-350ml-yeu-thuong',
        'Bình giữ nhiệt kim loại màu trắng 350ml, in thông điệp Yêu Thương ấm áp.',
        'Bình giữ nhiệt kim loại màu trắng sữa, in thông điệp ''Yêu Thương'' đầy triết lý và năng lượng tích cực từ Trung Nguyên Legend.',
        350000, 60, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-yeu-thuong.png', 'Bình giữ nhiệt Yêu Thương', 0, true);

    -- 13. Bình Giữ Nhiệt Trung Nguyên Legend Màu Xám – 350ml (Thiện Lành)
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình Giữ Nhiệt Trung Nguyên Legend Màu Xám – 350ml (Thiện Lành)',
        'binh-giu-nhiet-trung-nguyen-legend-mau-xam-350ml-thien-lanh',
        'Bình giữ nhiệt kim loại màu xám 350ml, in thông điệp Thiện Lành thanh cao.',
        'Bình giữ nhiệt kim loại màu xám xi măng thời thượng, in thông điệp ''Thiện Lành'' mộc mạc thanh cao đầy năng lượng tỉnh thức.',
        350000, 60, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-thien-lanh.png', 'Bình giữ nhiệt Thiện Lành', 0, true);

    -- 14. Bình Giữ Nhiệt Trung Nguyên Legend Màu Đen – 350ml (Hạnh Phúc)
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình Giữ Nhiệt Trung Nguyên Legend Màu Đen – 350ml (Hạnh Phúc)',
        'binh-giu-nhiet-trung-nguyen-legend-mau-den-350ml-hanh-phuc',
        'Bình giữ nhiệt kim loại màu đen 350ml, in thông điệp Hạnh Phúc đầy ý nghĩa.',
        'Bình giữ nhiệt kim loại màu đen tuyền huyền bí, in thông điệp ''Hạnh Phúc'' sâu sắc và năng lượng tươi vui từ Trung Nguyên Legend.',
        350000, 60, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/11/TNL_BGN-hanh-phuc.png', 'Bình giữ nhiệt Hạnh Phúc', 0, true);

    -- 15. Bình giữ nhiệt – Thiền
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình giữ nhiệt – Thiền',
        'binh-giu-nhiet-thien',
        'Bình giữ nhiệt phiên bản văn minh cà phê Thiền tĩnh lặng, mộc mạc.',
        'Bình giữ nhiệt gốm kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Thiền - hướng về sự tĩnh lặng bên trong.',
        350000, 40, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-thien.png', 'Bình giữ nhiệt Thiền', 0, true);

    -- 16. Bình giữ nhiệt – Roman
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình giữ nhiệt – Roman',
        'binh-giu-nhiet-roman',
        'Bình giữ nhiệt phiên bản văn minh cà phê Roman tinh xảo.',
        'Bình giữ nhiệt kim loại tinh tế in họa tiết và triết lý văn minh cà phê Roman - hướng về sự tráng lệ, khoa học nghệ thuật.',
        350000, 40, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-roman.png', 'Bình giữ nhiệt Roman', 0, true);

    -- 17. Bình giữ nhiệt – Ottoman
    INSERT INTO public.products (name, slug, short_description, description, price, stock_quantity, category_id, status, tags, metadata)
    VALUES (
        'Bình giữ nhiệt – Ottoman',
        'binh-giu-nhiet-ottoman',
        'Bình giữ nhiệt phiên bản văn minh cà phê Ottoman độc đáo.',
        'Bình giữ nhiệt kim loại tinh xảo in họa tiết và triết lý văn minh cà phê Ottoman - hướng về khía cạnh tâm linh, huyền bí phương Đông.',
        350000, 40, v_category_id, 'active', ARRAY['merch', 'thermos'], '{"gia": 350000}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        status = 'active'
    RETURNING id INTO v_product_id;

    DELETE FROM public.product_images WHERE product_id = v_product_id;
    INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
    VALUES (v_product_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-Ottoman-1.png', 'Bình giữ nhiệt Ottoman', 0, true);

END $$;
