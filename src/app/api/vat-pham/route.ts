import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function mapMerchCategory(catSlug: string) {
  const s = catSlug?.trim();
  
  // Nhóm Cà phê hạt / Drip
  if (s === 'ca-phe-hat' || s === 'ca-phe-drip' || s === 'ca-phe-phin-giay') {
    return { slug: 'ca-phe-hat', name: 'Cà phê hạt' };
  }
  
  // Nhóm Cà phê phin bột
  if (s === 'ca-phe-phin' || s === 'ca-phe-bot-sang-tao' || s === 'ca-phe-bot-phin') {
    return { slug: 'ca-phe-phin', name: 'Cà phê phin' };
  }
  
  // Nhóm Cà phê hòa tan
  if (s === 'ca-phe-hoa-tan' || s === 'ca-phe-hoa-tan-g7') {
    return { slug: 'ca-phe-hoa-tan-g7', name: 'Cà phê hòa tan G7' };
  }
  
  // Nhóm Cà phê Legend
  if (s === 'ca-phe-legend') {
    return { slug: 'ca-phe-legend', name: 'Cà phê Legend' };
  }
  
  // Nhóm Dụng cụ pha chế
  if (s === 'dung-cu-pha-che' || s === 'dung-cu-pha-ca-phe') {
    return { slug: 'dung-cu-pha-che', name: 'Dụng cụ pha chế' };
  }
  
  // Nhóm Ly tách bình
  if (s === 'ly-tach-binh-giu-nhiet' || s === ' tách và bình"') {
    return { slug: 'ly-tach-binh-giu-nhiet', name: 'Ly, Tách, Bình giữ nhiệt' };
  }
  
  // Nhóm Vật phẩm / Quà tặng
  if (s === 'vat-pham' || s === 'merchandise' || s === 'phu-kien-thuong-hieu' || s === 'bo-qua-tang' || s === 'vat-pham-thuong-hieu') {
    return { slug: 'vat-pham', name: 'Vật phẩm' };
  }
  
  return { slug: s || 'khac', name: 'Khác' };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const showAll = searchParams.get('all') === '1'
    const supabase = await createClient()

    let query = supabase
      .from('san_pham_merchandise')
      .select('*, danh_muc_san_pham (slug, ten_danh_muc)')

    if (!showAll) {
      query = query.eq('hien_thi', true)
    }

    // Truy vấn trực tiếp từ bảng san_pham_merchandise kết hợp danh_muc_san_pham
    const { data: rawMerch, error: merchError } = await query

    if (merchError) {
      throw merchError
    }

    // Map dữ liệu để tương thích với cấu trúc của frontend
    const items = (rawMerch || []).map(p => {
      const cat = mapMerchCategory(p.danh_muc_san_pham?.slug || "");
      const stock = p.ton_kho !== undefined && p.ton_kho !== null ? Number(p.ton_kho) : 0;
      return {
        id: p.id,
        ten_san_pham: p.ten_san_pham,
        slug: p.slug,
        mo_ta: p.mo_ta || "",
        gia: p.gia || 0,
        slug_danh_muc: cat.slug,
        ten_danh_muc: cat.name,
        hinh_anh: p.hinh_anh || "",
        hien_thi: p.hien_thi === true,
        ton_kho: stock,
        con_ban: stock > 0
      };
    })

    return NextResponse.json(items)
  } catch (err: any) {
    console.error("Error in /api/vat-pham endpoint:", err)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải sản phẩm vật phẩm' }, { status: 500 })
  }
}
