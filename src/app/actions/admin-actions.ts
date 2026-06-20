'use server'

import { createAdminClient } from '@/lib/supabase/admin'

// Helper tạo slug từ tên tiếng Việt
function createSlug(str: string): string {
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
  str = str.replace(/đ/g, "d")
  str = str.replace(/[^a-z0-9 -]/g, "") // Xóa ký tự đặc biệt
  str = str.replace(/\s+/g, "-") // Thay khoảng trắng bằng -
  str = str.replace(/-+/g, "-") // Thu gọn nhiều dấu -
  return str.trim()
}

// 1. Thống kê doanh thu, đơn hàng, sản phẩm
export async function getAdminStatsAction() {
  try {
    const supabase = createAdminClient()

    // Lấy tổng số đơn hàng
    const { count: totalOrders, error: orderCountError } = await supabase
      .from('don_hang')
      .select('*', { count: 'exact', head: true })

    if (orderCountError) throw orderCountError

    // Lấy danh sách các đơn hàng để tính doanh thu
    // Các trạng thái được xem là đã thanh toán / thành công:
    // 'da_thanh_toan', 'dang_lam_don', 'dang_giao', 'da_giao', 'da_chuyen_khoan'
    const { data: orders, error: ordersError } = await supabase
      .from('don_hang')
      .select('tong_tien, trang_thai')

    if (ordersError) throw ordersError

    const successStatuses = ['da_thanh_toan', 'dang_lam_don', 'dang_giao', 'da_giao', 'da_chuyen_khoan']
    const totalRevenue = orders
      ? orders
          .filter(o => successStatuses.includes(o.trang_thai))
          .reduce((sum, o) => sum + (o.tong_tien || 0), 0)
      : 0

    // Số đơn đang chờ xử lý (cho_xac_nhan_chuyen_khoan, da_dat_don)
    const pendingOrders = orders
      ? orders.filter(o => ['cho_xac_nhan_chuyen_khoan', 'da_dat_don'].includes(o.trang_thai)).length
      : 0

    // Lấy số lượng đồ uống
    const { count: totalDrinks, error: drinksCountError } = await supabase
      .from('san_pham_do_uong')
      .select('*', { count: 'exact', head: true })

    if (drinksCountError) throw drinksCountError

    // Lấy số lượng vật phẩm
    const { count: totalMerch, error: merchCountError } = await supabase
      .from('san_pham_merchandise')
      .select('*', { count: 'exact', head: true })

    if (merchCountError) throw merchCountError

    return {
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        totalDrinks: totalDrinks || 0,
        totalMerch: totalMerch || 0
      }
    }
  } catch (err: any) {
    console.error("Error loading admin stats:", err)
    return { success: false, error: err.message || 'Lỗi khi tải số liệu thống kê' }
  }
}

// 2. Lấy danh sách tất cả các đơn hàng
export async function getAdminOrdersAction() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('don_hang')
      .select(`
        *,
        thong_tin_khach_hang:khach_hang_id (ho_ten, so_dien_thoai, email, dia_chi)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (err: any) {
    console.error("Error loading admin orders:", err)
    return { success: false, error: err.message || 'Lỗi khi tải danh sách đơn hàng' }
  }
}

// 3. Cập nhật trạng thái đơn hàng
export async function updateOrderStatusAdminAction(orderId: string, status: string) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('don_hang')
      .update({ trang_thai: status })
      .eq('id', orderId)

    if (error) throw error

    return { success: true }
  } catch (err: any) {
    console.error("Error updating order status:", err)
    return { success: false, error: err.message || 'Lỗi khi cập nhật trạng thái đơn hàng' }
  }
}

// 4. Lấy tất cả đồ uống và vật phẩm
export async function getAdminProductsAction() {
  try {
    const supabase = createAdminClient()

    const [drinksRes, merchRes, catsRes] = await Promise.all([
      supabase.from('san_pham_do_uong').select('*').order('created_at', { ascending: false }),
      supabase.from('san_pham_merchandise').select('*').order('created_at', { ascending: false }),
      supabase.from('danh_muc_san_pham').select('*').order('thu_tu_hien_thi', { ascending: true })
    ])

    if (drinksRes.error) throw drinksRes.error
    if (merchRes.error) throw merchRes.error
    if (catsRes.error) throw catsRes.error

    return {
      success: true,
      data: {
        drinks: drinksRes.data || [],
        merchandise: merchRes.data || [],
        categories: catsRes.data || []
      }
    }
  } catch (err: any) {
    console.error("Error loading products:", err)
    return { success: false, error: err.message || 'Lỗi khi tải danh sách sản phẩm' }
  }
}

// 5. Thêm/Sửa đồ uống
export async function upsertDrinkAction(data: any) {
  try {
    const supabase = createAdminClient()
    const slug = data.slug || createSlug(data.ten_san_pham)

    const drinkData = {
      ten_san_pham: data.ten_san_pham,
      slug: slug,
      mo_ta: data.mo_ta || '',
      gia_den: data.gia_den ? parseFloat(data.gia_den) : null,
      gia_sua: data.gia_sua ? parseFloat(data.gia_sua) : null,
      danh_muc_id: data.danh_muc_id,
      hien_thi: data.hien_thi !== undefined ? data.hien_thi : true
    }

    if (data.id) {
      // Cập nhật
      const { error } = await supabase
        .from('san_pham_do_uong')
        .update(drinkData)
        .eq('id', data.id)

      if (error) throw error
    } else {
      // Thêm mới
      const { error } = await supabase
        .from('san_pham_do_uong')
        .insert([drinkData])

      if (error) throw error
    }

    return { success: true }
  } catch (err: any) {
    console.error("Error upserting drink:", err)
    return { success: false, error: err.message || 'Lỗi khi lưu sản phẩm đồ uống' }
  }
}

// 6. Thêm/Sửa vật phẩm
export async function upsertMerchandiseAction(data: any) {
  try {
    const supabase = createAdminClient()
    const slug = data.slug || createSlug(data.ten_san_pham)

    const merchData: any = {
      ten_san_pham: data.ten_san_pham,
      slug: slug,
      mo_ta: data.mo_ta || '',
      gia: data.gia ? parseFloat(data.gia) : null,
      ton_kho: data.ton_kho !== undefined ? parseInt(data.ton_kho) : 10,
      danh_muc_id: data.danh_muc_id,
      hien_thi: data.hien_thi !== undefined ? data.hien_thi : true
    }

    if (data.id) {
      // Cập nhật bảng san_pham_merchandise
      const { error } = await supabase
        .from('san_pham_merchandise')
        .update(merchData)
        .eq('id', data.id)

      if (error) throw error

      // Cập nhật đồng bộ bảng products (Next.js/React side)
      const { error: errorProd } = await supabase
        .from('products')
        .update({
          name: data.ten_san_pham,
          slug: slug,
          description: data.mo_ta || '',
          price: data.gia ? parseFloat(data.gia) : null,
          ton_kho: data.ton_kho !== undefined ? parseInt(data.ton_kho) : 10,
          status: data.hien_thi !== false ? 'active' : 'inactive'
        })
        .eq('id', data.id)

      if (errorProd) {
        console.warn("⚠️ Warning updating products table in Action:", errorProd.message)
      }
    } else {
      // Thêm mới bảng san_pham_merchandise
      const { data: newMerch, error } = await supabase
        .from('san_pham_merchandise')
        .insert([merchData])
        .select()

      if (error) throw error

      if (newMerch && newMerch.length > 0) {
        const item = newMerch[0]
        // Thêm đồng bộ bảng products
        const { error: errorProd } = await supabase
          .from('products')
          .insert([{
            id: item.id,
            name: item.ten_san_pham,
            slug: slug,
            description: item.mo_ta || '',
            price: item.gia,
            ton_kho: item.ton_kho,
            status: item.hien_thi ? 'active' : 'inactive'
          }])
        
        if (errorProd) {
          console.warn("⚠️ Warning inserting into products table in Action:", errorProd.message)
        }
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Error upserting merchandise:", err)
    return { success: false, error: err.message || 'Lỗi khi lưu vật phẩm' }
  }
}

// 7. Xóa sản phẩm (đồ uống hoặc vật phẩm)
export async function deleteProductAction(id: string, type: 'drink' | 'merch') {
  try {
    const supabase = createAdminClient()
    const table = type === 'drink' ? 'san_pham_do_uong' : 'san_pham_merchandise'

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (err: any) {
    console.error("Error deleting product:", err)
    return { success: false, error: err.message || 'Lỗi khi xóa sản phẩm' }
  }
}

// 8. Lấy danh sách danh mục
export async function getAdminCategoriesAction() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('danh_muc_san_pham')
      .select('*')
      .order('thu_tu_hien_thi', { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (err: any) {
    console.error("Error loading categories:", err)
    return { success: false, error: err.message || 'Lỗi khi tải danh sách danh mục' }
  }
}

// 9. Thêm/Sửa danh mục
export async function upsertCategoryAction(data: any) {
  try {
    const supabase = createAdminClient()
    const slug = data.slug || createSlug(data.ten_danh_muc)

    const catData = {
      ten_danh_muc: data.ten_danh_muc,
      slug: slug,
      hien_thi: data.hien_thi !== undefined ? data.hien_thi : true,
      thu_tu_hien_thi: data.thu_tu_hien_thi ? parseInt(data.thu_tu_hien_thi) : 0
    }

    if (data.id) {
      // Cập nhật
      const { error } = await supabase
        .from('danh_muc_san_pham')
        .update(catData)
        .eq('id', data.id)

      if (error) throw error
    } else {
      // Thêm mới
      const { error } = await supabase
        .from('danh_muc_san_pham')
        .insert([catData])

      if (error) throw error
    }

    return { success: true }
  } catch (err: any) {
    console.error("Error upserting category:", err)
    return { success: false, error: err.message || 'Lỗi khi lưu danh mục' }
  }
}
