import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function mapDrinkCategory(catSlug: string, prodSlug: string) {
  const s = catSlug?.trim();
  if (s === 'ca-phe-phin') return { slug: 'ca-phe-phin', name: 'Cà phê phin' };
  if (s === 'ca-phe-may') return { slug: 'ca-phe-may', name: 'Cà phê máy' };
  if (s === 'ca-phe-dac-biet') return { slug: 'ca-phe-pha-che', name: 'Cà phê pha chế' };
  if (s === 'tra-va-tra-sua') return { slug: 'tra-tra-sua', name: 'Trà & Trà sữa' };
  if (s === 'da-xay-sinh-to') return { slug: 'sinh-to-da-xay', name: 'Sinh tố & Đá xay' };
  if (s === 'matcha-cacao') return { slug: 'matcha-cacao', name: 'Matcha & Cacao' };
  if (s === 'banh-thuc-duong' || s === 'banh') return { slug: 'banh', name: 'Bánh ngọt' };
  if (s === 'mon-extra') return { slug: 'mon-extra', name: 'Món Extra' };
  
  if (s === 'nuoc-ep-thanh-nhiet') {
    const juiceSlugs = ['nuoc-ep-chanh-day', 'cam-vat', 'nuoc-thom-ep', 'dua-hau', 'dua-tuoi', 'nuoc-ep'];
    const isJuice = juiceSlugs.some(js => prodSlug.includes(js)) || prodSlug === 'cam-vat';
    if (isJuice) {
      return { slug: 'nuoc-ep', name: 'Nước ép' };
    }
    return { slug: 'nuoc-thanh-nhiet', name: 'Nước thanh nhiệt' };
  }

  return { slug: s, name: 'Khác' };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const showAll = searchParams.get('all') === '1'
    const supabase = await createClient()

    let query = supabase
      .from('san_pham_do_uong')
      .select('*, danh_muc_san_pham (slug, ten_danh_muc)')

    if (!showAll) {
      query = query.eq('hien_thi', true)
    }

    // Truy vấn trực tiếp từ bảng san_pham_do_uong kết hợp danh_muc_san_pham
    const { data: rawDrinks, error: drinksError } = await query

    if (drinksError) {
      throw drinksError
    }

    // Map dữ liệu để tương thích với cấu trúc do-uong của frontend
    const drinks = (rawDrinks || []).map(p => {
      const cat = mapDrinkCategory(p.danh_muc_san_pham?.slug || "", p.slug || "");
      const stock = p.ton_kho !== undefined && p.ton_kho !== null ? Number(p.ton_kho) : 99;
      return {
        id: p.id,
        ten_san_pham: p.ten_san_pham,
        slug: p.slug,
        mo_ta: p.mo_ta || "",
        gia_den: p.gia_den || 0,
        gia_sua: p.gia_sua || 0,
        slug_danh_muc: cat.slug,
        ten_danh_muc: cat.name,
        hinh_anh: p.hinh_anh || "",
        la_mon_noi_bat: p.la_noi_bat || false,
        hien_thi: p.hien_thi === true,
        ton_kho: stock,
        sold_out: stock <= 0
      };
    })

    return NextResponse.json(drinks)
  } catch (err: any) {
    console.error("Error in /api/do-uong endpoint:", err)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải sản phẩm đồ uống' }, { status: 500 })
  }
}
