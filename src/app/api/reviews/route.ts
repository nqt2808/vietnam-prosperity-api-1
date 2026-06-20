import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function normalizePhone(value: any) {
  return String(value || "").replace(/\D/g, "");
}

// 1. GET: Lấy danh sách đánh giá (công khai hoặc toàn bộ dành cho admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const showAll = searchParams.get('all') === '1' || searchParams.get('admin') === '1'

    const adminSupabase = createAdminClient()
    let query = adminSupabase
      .from('danh_gia')
      .select('*')

    if (!showAll) {
      query = query.eq('hien_thi', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error("❌ Failed to fetch reviews:", err)
    return NextResponse.json(
      { error: err.message || 'Lỗi hệ thống khi tải đánh giá' },
      { status: 500 }
    )
  }
}

// 2. POST: Khách hàng gửi đánh giá mới (Cần kiểm tra đơn hàng có thực)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ho_ten, so_dien_thoai, ma_don_hang, so_sao, noi_dung } = body

    if (!ho_ten || !so_dien_thoai || !ma_don_hang || !so_sao) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc (họ tên, số điện thoại, mã đơn hàng, số sao)' },
        { status: 400 }
      )
    }

    const rating = Number(so_sao)
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Số sao đánh giá không hợp lệ (từ 1 đến 5 sao)' },
        { status: 400 }
      )
    }

    const adminSupabase = createAdminClient()

    // Truy vấn đơn hàng xem có tồn tại không
    const { data: order, error: orderError } = await adminSupabase
      .from('don_hang')
      .select(`
        id,
        ma_don_hang,
        so_dien_thoai,
        dia_chi_giao_hang,
        thong_tin_khach_hang (
          so_dien_thoai
        )
      `)
      .eq('ma_don_hang', ma_don_hang)
      .maybeSingle()

    if (orderError) {
      console.error("❌ DB error when checking order:", orderError)
      return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi kiểm tra đơn hàng' }, { status: 500 })
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng này trên hệ thống. Vui lòng kiểm tra lại mã đơn hàng!' },
        { status: 400 }
      )
    }

    // Kiểm tra số điện thoại có khớp không
    const userNormalizedPhone = normalizePhone(so_dien_thoai)
    const candidates = [
      order.so_dien_thoai,
      order.thong_tin_khach_hang?.so_dien_thoai
    ]

    // Parse số điện thoại từ dia_chi_giao_hang JSON
    if (order.dia_chi_giao_hang) {
      try {
        const shipping = typeof order.dia_chi_giao_hang === 'string'
          ? JSON.parse(order.dia_chi_giao_hang)
          : order.dia_chi_giao_hang
        if (shipping && shipping.phone) {
          candidates.push(shipping.phone)
        }
      } catch (e) {}
    }

    const isMatch = candidates.some(v => normalizePhone(v) === userNormalizedPhone && userNormalizedPhone.length >= 8)

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Số điện thoại nhập vào không khớp với thông tin đặt hàng của đơn này!' },
        { status: 400 }
      )
    }

    // Insert đánh giá mới vào bảng danh_gia
    const { data: review, error: insertError } = await adminSupabase
      .from('danh_gia')
      .insert({
        ho_ten: ho_ten.trim(),
        so_dien_thoai: userNormalizedPhone,
        ma_don_hang: ma_don_hang.trim(),
        so_sao: rating,
        noi_dung: noi_dung ? noi_dung.trim() : "",
        hien_thi: true // Mặc định hiển thị, admin có thể ẩn sau
      })
      .select('*')
      .single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn Quý khách đã gửi đánh giá phản hồi!',
      data: review
    })

  } catch (err: any) {
    console.error("❌ Failed to create review:", err)
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi hệ thống khi gửi đánh giá' },
      { status: 500 }
    )
  }
}

// 3. PATCH: Cập nhật trạng thái ẩn/hiện hoặc thông tin đánh giá (dành cho Admin)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, hien_thi } = body

    if (!id || hien_thi === undefined) {
      return NextResponse.json({ error: 'Thiếu thông tin id hoặc hien_thi' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('danh_gia')
      .update({ hien_thi: hien_thi })
      .eq('id', id)
      .select('*')

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đánh giá tương ứng' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (err: any) {
    console.error("❌ Failed to patch review:", err)
    return NextResponse.json({ error: err.message || 'Lỗi hệ thống khi cập nhật đánh giá' }, { status: 500 })
  }
}

// 4. DELETE: Xóa đánh giá (dành cho Admin)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Thiếu id đánh giá cần xóa' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
      .from('danh_gia')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Đã xóa đánh giá thành công' })
  } catch (err: any) {
    console.error("❌ Failed to delete review:", err)
    return NextResponse.json({ error: err.message || 'Lỗi hệ thống khi xóa đánh giá' }, { status: 500 })
  }
}
