import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("📥 Received new order payload from storefront:", JSON.stringify(body, null, 2))

    const {
      ma_don_hang,
      ho_ten,
      so_dien_thoai,
      email,
      dia_chi,
      danh_sach_san_pham,
      tong_tien,
      phi_ship,
      khoang_cach_km,
      hinh_thuc_nhan_hang,
      phuong_thuc_thanh_toan,
      ghi_chu,
      trang_thai
    } = body

    if (!ho_ten || !so_dien_thoai || !ma_don_hang) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc (họ tên, số điện thoại, mã đơn hàng)' },
        { status: 400 }
      )
    }

    const adminSupabase = createAdminClient()

    // 1. Tạo thông tin khách hàng vào bảng thong_tin_khach_hang
    const { data: customerData, error: customerError } = await adminSupabase
      .from('thong_tin_khach_hang')
      .insert({
        ho_ten: ho_ten,
        so_dien_thoai: so_dien_thoai,
        email: email || 'NULL',
        dia_chi: dia_chi || (hinh_thuc_nhan_hang === 'den_lay_tai_quan' ? 'Nhận tại cửa hàng' : 'Giao hàng tận nơi'),
        ghi_chu: ghi_chu || ''
      })
      .select('id')
      .single()

    if (customerError || !customerData) {
      console.error("❌ Failed to create customer info in API:", customerError)
      return NextResponse.json(
        { success: false, error: customerError?.message || 'Không thể tạo thông tin khách hàng' },
        { status: 500 }
      )
    }

    const khach_hang_id = customerData.id

    // 2. Tạo JSON địa chỉ giao hàng
    const shippingAddressJson = {
      name: ho_ten,
      phone: so_dien_thoai,
      email: email || '',
      address: dia_chi || (hinh_thuc_nhan_hang === 'den_lay_tai_quan' ? 'Nhận tại cửa hàng' : 'Giao hàng tận nơi'),
      distance: khoang_cach_km || 0,
      delivery_type: hinh_thuc_nhan_hang
    }

    // 3. Thêm đơn hàng mới vào bảng don_hang
    const { data: orderData, error: orderError } = await adminSupabase
      .from('don_hang')
      .insert({
        khach_hang_id: khach_hang_id,
        ma_don_hang: ma_don_hang,
        danh_sach_san_pham: danh_sach_san_pham,
        tong_tien: tong_tien,
        phi_ship: phi_ship || 0,
        khoang_cach_km: khoang_cach_km || 0,
        hinh_thuc_nhan_hang: hinh_thuc_nhan_hang,
        phuong_thuc_thanh_toan: phuong_thuc_thanh_toan,
        dia_chi_giao_hang: JSON.stringify(shippingAddressJson),
        ghi_chu: ghi_chu || '',
        trang_thai: trang_thai || (phuong_thuc_thanh_toan === 'chuyen_khoan' ? 'cho_chuyen_khoan' : 'da_dat_don')
      })
      .select('id')
      .single()

    if (orderError) {
      console.error("❌ Failed to create order in API:", orderError)
      // Rollback customer insertion to keep clean DB
      await adminSupabase.from('thong_tin_khach_hang').delete().eq('id', khach_hang_id)
      return NextResponse.json(
        { success: false, error: orderError.message || 'Không thể tạo đơn hàng' },
        { status: 500 }
      )
    }

    // 4. Sinh VietQR URL động
    const encodedMemo = encodeURIComponent(ma_don_hang)
    const vietqr_url = `https://img.vietqr.io/image/vietinbank-101882692631-compact2.png?amount=${tong_tien}&addInfo=${encodedMemo}&accountName=NGO%20QUYNH%20TRANG`

    console.log(`✅ Order ${ma_don_hang} created successfully with customer ID ${khach_hang_id}`)
    
    return NextResponse.json({
      success: true,
      ma_don_hang: ma_don_hang,
      vietqr_url: vietqr_url,
      message: 'Đơn hàng đã được lưu thành công'
    })

  } catch (err: any) {
    console.error("❌ API Order error:", err)
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi hệ thống khi tạo đơn hàng' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('don_hang')
      .select(`
        *,
        thong_tin_khach_hang (
          ho_ten,
          so_dien_thoai,
          email,
          dia_chi,
          ghi_chu
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error("❌ Failed to fetch orders for admin:", err)
    return NextResponse.json(
      { error: err.message || 'Lỗi hệ thống khi tải đơn hàng' },
      { status: 500 }
    )
  }
}
