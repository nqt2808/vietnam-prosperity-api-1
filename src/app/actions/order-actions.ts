'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface OrderItemInput {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

interface CreateOrderInput {
  fullName: string
  phoneNumber: string
  email?: string
  address: string
  note: string
  deliveryType: 'pickup' | 'delivery'
  distance: number
  paymentMethod: 'cash' | 'bank'
  subtotal: number
  shippingFee: number
  total: number
  items: OrderItemInput[]
  /** Nếu truyền vào thì dùng mã này, không thì tự sinh VPC-DH-... */
  orderNumber?: string
}

export async function createOrderAction(input: CreateOrderInput) {
  try {
    const adminSupabase = createAdminClient()

    // 1. Tạo mới thông tin khách hàng vào bảng thong_tin_khach_hang
    const { data: customerData, error: customerError } = await adminSupabase
      .from('thong_tin_khach_hang')
      .insert({
        ho_ten: input.fullName,
        so_dien_thoai: input.phoneNumber,
        email: input.email || 'NULL',
        dia_chi: input.deliveryType === 'delivery' ? input.address : 'Nhận tại cửa hàng',
        ghi_chu: input.note
      })
      .select('id')
      .single()

    if (customerError || !customerData) {
      console.error("Supabase Customer Insert Error:", customerError)
      return { success: false, error: customerError?.message || 'Không thể tạo thông tin khách hàng' }
    }

    const khach_hang_id = customerData.id

    // 2. Tạo mã đơn hàng - dùng mã từ client (VPC-DH-...) hoặc tự sinh
    let orderNumber = input.orderNumber?.trim() || ''
    if (!orderNumber) {
      // Sinh mã theo format VPC-DH-YYYYMMDD-HHMMSS (tương thích index.html)
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const hh = String(now.getHours()).padStart(2, '0')
      const mi = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      orderNumber = `VPC-DH-${yyyy}${mm}${dd}-${hh}${mi}${ss}`
    }

    // 3. Xác định trạng thái ban đầu của đơn hàng
    const initialStatus = input.paymentMethod === 'bank' ? 'cho_xac_nhan_chuyen_khoan' : 'da_dat_don'

    // 4. Định dạng chuỗi danh sách sản phẩm (Ví dụ: "Trà Đào Cam Sả x2 - 90000; Cà phê muối Legend x1 - 45000")
    const productListString = input.items.map((item) => {
      const itemTotal = item.price * item.quantity
      return `${item.name} x${item.quantity} - ${itemTotal}`
    }).join('; ')

    // 5. Tạo JSON địa chỉ giao hàng
    const shippingAddressJson = {
      name: input.fullName,
      phone: input.phoneNumber,
      email: input.email || '',
      address: input.deliveryType === 'delivery' ? input.address : 'Nhận tại cửa hàng',
      distance: input.deliveryType === 'delivery' ? input.distance : 0,
      delivery_type: input.deliveryType
    }

    // 6. Thêm đơn hàng mới vào bảng don_hang
    const { data: orderData, error: orderError } = await adminSupabase
      .from('don_hang')
      .insert({
        khach_hang_id: khach_hang_id,
        ma_don_hang: orderNumber,
        danh_sach_san_pham: productListString,
        tong_tien: input.total,
        phi_ship: input.shippingFee,
        khoang_cach_km: input.deliveryType === 'delivery' ? input.distance : 0,
        hinh_thuc_nhan_hang: input.deliveryType,
        phuong_thuc_thanh_toan: input.paymentMethod === 'bank' ? 'chuyen_khoan' : 'tien_mat',
        dia_chi_giao_hang: JSON.stringify(shippingAddressJson),
        ghi_chu: input.note,
        trang_thai: initialStatus
      })
      .select('id')
      .single()

    if (orderError || !orderData) {
      console.error("Supabase Order Insert Error:", orderError)
      // Xóa thông tin khách hàng vừa chèn để đảm bảo tính toàn vẹn dữ liệu
      await adminSupabase.from('thong_tin_khach_hang').delete().eq('id', khach_hang_id)
      return { success: false, error: orderError?.message || 'Không thể tạo đơn hàng' }
    }

    const orderId = orderData.id

    return {
      success: true,
      data: {
        id: orderId,
        orderNumber,
        total: input.total,
        subtotal: input.subtotal,
        shippingFee: input.shippingFee
      }
    }
  } catch (err: any) {
    console.error("Order action error:", err)
    return { success: false, error: err.message || 'Lỗi hệ thống khi tạo đơn hàng' }
  }
}

// Cập nhật trạng thái đơn hàng (Ví dụ: khi khách hàng bấm "Tôi đã thanh toán")
export async function updateOrderStatusAction(orderNumber: string, status: string) {
  try {
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from('don_hang')
      .update({ trang_thai: status })
      .eq('ma_don_hang', orderNumber.trim())

    if (error) {
      console.error("Supabase Status Update Error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Status update action error:", err)
    return { success: false, error: err.message || 'Lỗi hệ thống khi cập nhật đơn hàng' }
  }
}

// Tra cứu trạng thái đơn hàng
export async function getOrderStatusAction(orderNumber: string) {
  try {
    const adminSupabase = createAdminClient()

    // 1. Truy vấn từ bảng don_hang chính thức
    const { data: donHangData, error: donHangError } = await adminSupabase
      .from('don_hang')
      .select('*')
      .eq('ma_don_hang', orderNumber.trim())
      .single()

    if (!donHangError && donHangData) {
      const shippingAddressObj = donHangData.dia_chi_giao_hang 
        ? (typeof donHangData.dia_chi_giao_hang === 'string' 
            ? JSON.parse(donHangData.dia_chi_giao_hang) 
            : donHangData.dia_chi_giao_hang)
        : null;

      const mappedOrder = {
        id: donHangData.id,
        order_number: donHangData.ma_don_hang,
        total_amount: donHangData.tong_tien || 0,
        full_name: shippingAddressObj ? (shippingAddressObj.name || 'Khách hàng') : 'Khách hàng',
        payment_method: donHangData.phuong_thuc_thanh_toan === 'chuyen_khoan' ? 'bank' : 'cash',
        status: donHangData.trang_thai || 'da_dat_don',
        order_items: donHangData.danh_sach_san_pham 
          ? donHangData.danh_sach_san_pham.split(';').map((itemStr: string, idx: number) => {
              const parts = itemStr.trim().split('-');
              const namePart = parts[0]?.trim() || '';
              const pricePart = parts[1] ? parseInt(parts[1].replace(/[^0-9]/g, '')) : 0;
              
              const qtyMatch = namePart.match(/x\s*(\d+)/i) || namePart.match(/(\d+)\s*x/i);
              const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
              const cleanName = namePart.replace(/x\s*\d+/i, '').replace(/\d+\s*x/i, '').trim();

              return {
                id: `item-${idx}`,
                product_name: cleanName,
                quantity: quantity,
                price: quantity > 0 ? (pricePart / quantity) : pricePart
              }
            }) 
          : []
      }
      return { success: true, data: mappedOrder }
    }

    // 2. Fallback sang bảng orders cũ phòng trường hợp đơn hàng cũ
    const { data: orderData, error: orderError } = await adminSupabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber.trim())
      .single()

    if (orderError || !orderData) {
      return { success: false, error: 'Không tìm thấy đơn hàng với mã đã nhập. Vui lòng kiểm tra lại.' }
    }

    const mappedFallbackOrder = {
      id: orderData.id,
      order_number: orderData.order_number,
      total_amount: orderData.total,
      full_name: orderData.shipping_address 
        ? (typeof orderData.shipping_address === 'string' 
            ? JSON.parse(orderData.shipping_address).name 
            : orderData.shipping_address.name)
        : 'Khách hàng',
      payment_method: orderData.payment_method,
      status: orderData.status,
      order_items: orderData.order_items.map((item: any) => ({
        id: item.id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price_at_purchase
      }))
    }

    return { success: true, data: mappedFallbackOrder }
  } catch (err: any) {
    console.error("Order lookup error:", err)
    return { success: false, error: err.message || 'Lỗi hệ thống khi tra cứu đơn hàng' }
  }
}
