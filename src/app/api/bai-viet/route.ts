import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const defaultBlogs = [
  {
    title: "Hè này cần gì? Một góc mát, một ly ngon và một buổi thư giãn tại Trung Nguyên Legend Âu Lạc. ☕🌿",
    desc: "Nắng hè có thể gay gắt, nhưng Trung Nguyên Legend Âu Lạc luôn có những thức uống mát lành chờ bạn ghé thưởng thức.",
    thumbnail: "https://www.facebook.com/reel/1511949147216560",
    content: `<p><strong>☀️ GIẢI NHIỆT MÙA HÈ CÙNG TRUNG NGUYÊN LEGEND ÂU LẠC 🌿</strong></p>\n\n<p>\n  Nắng hè có thể gay gắt, nhưng <strong>Trung Nguyên Legend Âu Lạc</strong> luôn có những thức uống mát lành chờ bạn ghé thưởng thức.\n  Một ly trà thanh mát, một món đá xay thơm ngon hay cà phê đậm vị sẽ giúp bạn thư giãn và nạp lại năng lượng cho ngày dài.\n</p>\n\n<p>✨ Không gian thoải mái</p>\n<p>✨ Thức uống đa dạng</p>\n<p>✨ Phù hợp để gặp gỡ bạn bè, học tập và làm việc</p>\n\n<p>\n  Ghé ngay <strong>Trung Nguyên Legend Âu Lạc</strong> để tận hưởng những phút giây chill thật dễ chịu trong mùa hè này nhé!\n</p>`,
    source_link: "https://www.facebook.com/reel/1511949147216560"
  },
  {
    title: "Nghệ sĩ Nhật Cường ghé thăm không gian Trung Nguyên Legend Huế ☕✨",
    desc: "Giữa nhịp sống nhẹ nhàng của Cố đô, hành trình thưởng thức cà phê trở nên đặc biệt hơn qua những khoảnh khắc giao lưu đầy cảm hứng cùng nghệ sĩ Nhật Cường tại Trung Nguyên Legend Huế.",
    thumbnail: "https://www.facebook.com/reel/1321336266180825",
    content: `<p>☕✨ <strong>Nghệ sĩ Nhật Cường ghé thăm không gian Trung Nguyên Legend Huế</strong></p>\n<p>Giữa nhịp sống nhẹ nhàng của Cố đô, hành trình thưởng thức cà phê trở nên đặc biệt hơn qua những khoảnh khắc giao lưu đầy cảm hứng cùng nghệ sĩ Nhật Cường tại Trung Nguyên Legend Huế.</p>\n<p>Không chỉ là điểm dừng chân thưởng thức cà phê năng lượng, nơi đây còn là không gian kết nối văn hóa, nghệ thuật và cảm hứng sống tỉnh thức.</p>`,
    source_link: "https://www.facebook.com/reel/1321336266180825"
  },
  {
    title: "Mua 1 được 2 – Chill hè cực đã!",
    desc: "Ưu đãi mua 1 được 2 tại Trung Nguyên Legend Âu Lạc, áp dụng từ 14:00 đến 21:30, từ 19/05 đến 30/06.",
    thumbnail: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773739/704546850_122111883836884434_407848279318371067_n_zgmrkn.jpg",
    content: `<p><strong>☕️ Mua 1 được 2 – Chill hè cực đã!</strong></p>\n<p><strong>📍 Địa điểm:</strong> Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế</p>\n<p><strong>🕑 Khung giờ áp dụng:</strong> 14:00 – 21:30</p>\n<p><strong>📅 Thời gian:</strong> Từ 19/05 đến 30/06</p>\n<p>🔥 Rủ bạn đến học bài, làm việc, tránh nóng cùng loạt thức uống mát lạnh tại Trung Nguyên Legend Âu Lạc.</p>`,
    source_link: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773739/704546850_122111883836884434_407848279318371067_n_zgmrkn.jpg"
  },
  {
    title: "Trưa hè nóng bức – Ghé Trung Nguyên Legend Âu Lạc Huế",
    desc: "Không gian mát lạnh, chill học bài và thưởng thức cà phê tại Trung Nguyên Legend Âu Lạc Huế.",
    thumbnail: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773786/701445719_122111738540884434_8176951810572622203_n_lbymde.jpg",
    content: `<p><strong>☀️ Trưa hè nóng bức</strong></p>\n<p>📚 Đi đâu cho hết nực?</p>\n<p>Ghé <strong>Trung Nguyên Legend Âu Lạc Huế</strong> vừa mát lạnh, vừa chill học bài nha 🤎☕</p>`,
    source_link: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773786/701445719_122111738540884434_8176951810572622203_n_lbymde.jpg"
  },
  {
    title: "Trung Nguyên Legend Âu Lạc hân hạnh đón tiếp Nghệ sĩ Nhật Cường",
    desc: "Trung Nguyên Legend Âu Lạc, TP Huế hân hạnh đón tiếp Nghệ sĩ Nhật Cường.",
    thumbnail: "https://www.facebook.com/reel/998900419486923",
    content: `<p>Trung Nguyên Legend Âu Lạc hân hạnh đón tiếp Nghệ sĩ Nhật Cường trong không gian cà phê năng lượng tại Thành phố Huế.</p>\n<p>Đây là một trong những khoảnh khắc đáng nhớ, thể hiện sự kết nối giữa khách hàng, nghệ sĩ và thương hiệu Trung Nguyên Legend.</p>`,
    source_link: "https://www.facebook.com/reel/998900419486923"
  },
  {
    title: "Sự kiện lái thử VinFast Thế Hệ Mới tại Trung Nguyên Legend Âu Lạc",
    desc: "Sự kiện lái thử VinFast Thế Hệ Mới trong không gian hiện đại và yên tĩnh của Trung Nguyên Legend.",
    thumbnail: "https://www.facebook.com/reel/981380314649839",
    content: `<p>✨ Thứ 7 này bạn đã có hẹn chưa?</p>\n<p>Cuối tuần này, hãy cùng gia đình và bạn bè đến tham gia sự kiện lái thử đặc biệt của VinFast Thế Hệ Mới tổ chức tại không gian sang trọng và yên tĩnh của Trung Nguyên Legend.</p>\n<p>📍 Địa điểm: Cafe Trung Nguyên Legend Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP. Huế ( Đối diện Aeon Mall Huế).</p>\n<p>📅 Thời gian: Thứ 7 tuần này (16/05/2026).</p>\n<p>🔥 Đến với sự kiện, quý khách sẽ có cơ hội:</p>\n<p>✅ Trực tiếp trải nghiệm các dòng xe điện nổi bật từ VF3, VF5, VF6, VF7 đến VF8.</p>\n<p>✅ Khám phá những mẫu xe mới ra mắt cực HOT:</p>\n<p>Limo Green, Minio Green, MPV 7, EC VAN</p>\n<p>🎁 Đặc biệt: Nhận nhiều phần quà hấp dẫn và thưởng thức cafe miễn phí trong không gian thư giãn, hiện đại.</p>`,
    source_link: "https://www.facebook.com/reel/981380314649839"
  }
];

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient();
    const { data: dbBlogs, error } = await supabase
      .from("bai_viet")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rawDbBlogs = dbBlogs || [];
    
    // Tìm các bài viết bị đánh dấu là xóa tĩnh
    const deletedStaticTitles = rawDbBlogs
      .filter((b: any) => b.desc === "DELETED_STATIC")
      .map((b: any) => b.title.trim().toLowerCase());
      
    // Lọc bỏ các bài viết bị đánh dấu xóa tĩnh khỏi danh sách DB
    const activeDbBlogs = rawDbBlogs.filter((b: any) => b.desc !== "DELETED_STATIC");
    
    const mergedBlogs = [...activeDbBlogs];
    
    defaultBlogs.forEach((defBlog, index) => {
      const defTitleLower = defBlog.title.trim().toLowerCase();
      // Nếu tiêu đề nằm trong danh sách đã xóa tĩnh, hoặc đã tồn tại bản ghi hoạt động trong DB, bỏ qua
      const isDeleted = deletedStaticTitles.includes(defTitleLower);
      const isExist = activeDbBlogs.some((b: any) => b.title.trim().toLowerCase() === defTitleLower);
      
      if (!isDeleted && !isExist) {
        mergedBlogs.push({
          id: `default-${index}`,
          title: defBlog.title,
          desc: defBlog.desc,
          content: defBlog.content,
          thumbnail: defBlog.thumbnail,
          source_link: defBlog.source_link,
          created_at: new Date(2026, 4, 19 + index).toISOString()
        });
      }
    });

    // Sắp xếp lại theo created_at giảm dần
    mergedBlogs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json(mergedBlogs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, desc, content, thumbnail, source_link } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Tiêu đề và nội dung là bắt buộc." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const payload = {
      title,
      desc: desc || "",
      content,
      thumbnail: thumbnail || "",
      source_link: source_link || null
    };

    const { data, error } = await supabase
      .from("bai_viet")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Đăng bài viết thành công!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const id = body.id || url.searchParams.get("id");
    const { title, desc, content, thumbnail, source_link } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID bài viết." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updatePayload: any = {};
    if (title !== undefined) updatePayload.title = title;
    if (desc !== undefined) updatePayload.desc = desc;
    if (content !== undefined) updatePayload.content = content;
    if (thumbnail !== undefined) updatePayload.thumbnail = thumbnail;
    if (source_link !== undefined) updatePayload.source_link = source_link;

    let data, error;
    if (String(id).startsWith("default-")) {
      // Sửa bài viết tĩnh -> Insert thành bài viết mới trong DB
      const insertPayload = {
        title: title || "",
        desc: desc || "",
        content: content || "",
        thumbnail: thumbnail || "",
        source_link: source_link || null,
        ...updatePayload
      };
      const { data: insertData, error: insertError } = await supabase
        .from("bai_viet")
        .insert(insertPayload)
        .select("*")
        .single();
      data = insertData;
      error = insertError;
    } else {
      const { data: updateData, error: updateError } = await supabase
        .from("bai_viet")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();
      data = updateData;
      error = updateError;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Cập nhật bài viết thành công!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id || null;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID bài viết." }, { status: 400 });
    }

    const supabase = createAdminClient();
    let data, error;

    if (String(id).startsWith("default-")) {
      const idx = parseInt(id.replace("default-", ""), 10);
      const defBlog = defaultBlogs[idx];
      if (defBlog) {
        // Đánh dấu xóa tĩnh bằng cách chèn bản ghi DB với desc là "DELETED_STATIC"
        const { data: insertData, error: insertError } = await supabase
          .from("bai_viet")
          .insert([{
            title: defBlog.title,
            desc: "DELETED_STATIC",
            content: "DELETED_STATIC",
            thumbnail: "",
            source_link: null
          }])
          .select("*")
          .single();
        data = insertData;
        error = insertError;
      } else {
        return NextResponse.json({ error: "Không tìm thấy bài viết mặc định tương ứng." }, { status: 404 });
      }
    } else {
      const { data: deleteData, error: deleteError } = await supabase
        .from("bai_viet")
        .delete()
        .eq("id", id)
        .select("*")
        .single();
      data = deleteData;
      error = deleteError;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Xóa bài viết thành công!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
