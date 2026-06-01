'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Gift,
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  DollarSign,
  Clock,
  User,
  MapPin,
  Check,
  X,
  Search,
  ChevronRight,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'

import {
  getAdminStatsAction,
  getAdminOrdersAction,
  updateOrderStatusAdminAction,
  getAdminProductsAction,
  upsertDrinkAction,
  upsertMerchandiseAction,
  deleteProductAction,
  upsertCategoryAction
} from '@/app/actions/admin-actions'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

interface AdminClientProps {
  initialStats: any
  initialOrders: any[]
  initialProducts: {
    drinks: any[]
    merchandise: any[]
    categories: any[]
  }
}

export function AdminClient({ initialStats, initialOrders, initialProducts }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'drinks' | 'merch' | 'categories'>('overview')
  const [isPending, startTransition] = useTransition()

  // Real data state
  const [stats, setStats] = useState(initialStats)
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [drinks, setDrinks] = useState<any[]>(initialProducts.drinks)
  const [merchandise, setMerchandise] = useState<any[]>(initialProducts.merchandise)
  const [categories, setCategories] = useState<any[]>(initialProducts.categories)

  // Message & Loading state
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')
  const [drinkSearch, setDrinkSearch] = useState('')
  const [merchSearch, setMerchSearch] = useState('')

  // Modals / Form edit state
  const [editingDrink, setEditingDrink] = useState<any | null>(null) // null = không sửa, 'new' = thêm mới, object = sửa
  const [editingMerch, setEditingMerch] = useState<any | null>(null)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)

  // Auto-clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Realtime listener for dynamic order updates
  useEffect(() => {
    const supabase = createBrowserClient()
    console.log("📡 [Admin] Realtime Order Listener activated")

    const channel = supabase
      .channel('admin:don_hang_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'don_hang'
        },
        async (payload) => {
          console.log("🔄 [Admin] Realtime database change received:", payload)
          
          // Nạp lại danh sách đơn hàng join đầy đủ thông tin khách hàng từ Server Action
          const ordersRes = await getAdminOrdersAction()
          if (ordersRes.success && ordersRes.data) {
            setOrders(ordersRes.data)
          }
          
          // Cập nhật lại thống kê doanh thu Dashboard
          const statsRes = await getAdminStatsAction()
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data)
          }

          // Hiển thị thông báo nổi cho admin
          if (payload.eventType === 'INSERT') {
            setMessage({ 
              type: 'success', 
              text: `🔔 Có đơn hàng mới được đặt từ website: ${payload.new.ma_don_hang}!` 
            })
          } else if (payload.eventType === 'UPDATE') {
            const oldStatus = payload.old?.trang_thai
            const newStatus = payload.new.trang_thai
            if (oldStatus !== newStatus) {
              let statusVietnamese = newStatus
              if (newStatus === 'da_chuyen_khoan') statusVietnamese = 'Đã chuyển khoản (VietQR)'
              else if (newStatus === 'cho_xac_nhan_chuyen_khoan') statusVietnamese = 'Chờ xác nhận chuyển khoản'
              else if (newStatus === 'da_dat_don') statusVietnamese = 'Mới đặt đơn'
              else if (newStatus === 'dang_lam_don') statusVietnamese = 'Đang pha chế'
              else if (newStatus === 'dang_giao') statusVietnamese = 'Đang giao hàng'
              else if (newStatus === 'da_giao') statusVietnamese = 'Đã hoàn thành'
              else if (newStatus === 'da_huy') statusVietnamese = 'Đã hủy'
              
              setMessage({ 
                type: 'success', 
                text: `🔄 Đơn hàng ${payload.new.ma_don_hang} vừa cập nhật trạng thái thành: ${statusVietnamese}!` 
              })
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Refresh Stats
  const refreshStats = async () => {
    setLoadingStats(true)
    const res = await getAdminStatsAction()
    if (res.success && res.data) {
      setStats(res.data)
    }
    setLoadingStats(false)
  }

  // Refresh All Data
  const refreshAllData = async () => {
    startTransition(async () => {
      const [statsRes, ordersRes, prodRes] = await Promise.all([
        getAdminStatsAction(),
        getAdminOrdersAction(),
        getAdminProductsAction()
      ])

      if (statsRes.success && statsRes.data) setStats(statsRes.data)
      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data)
      if (prodRes.success && prodRes.data) {
        setDrinks(prodRes.data.drinks || [])
        setMerchandise(prodRes.data.merchandise || [])
        setCategories(prodRes.data.categories || [])
      }
      setMessage({ type: 'success', text: 'Đã cập nhật dữ liệu mới nhất từ hệ thống!' })
    })
  }

  // Handle Order Status Update
  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatusAdminAction(orderId, newStatus)
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trang_thai: newStatus } : o))
      setMessage({ type: 'success', text: 'Cập nhật trạng thái đơn hàng thành công!' })
      refreshStats()
    } else {
      setMessage({ type: 'error', text: res.error || 'Lỗi khi cập nhật trạng thái' })
    }
  }

  // Handle Upsert Drink
  const handleDrinkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      id: editingDrink?.id || undefined,
      ten_san_pham: formData.get('ten_san_pham') as string,
      slug: formData.get('slug') as string,
      mo_ta: formData.get('mo_ta') as string,
      gia_den: formData.get('gia_den') as string,
      gia_sua: formData.get('gia_sua') as string,
      danh_muc_id: formData.get('danh_muc_id') as string,
      hien_thi: formData.get('hien_thi') === 'true'
    }

    const res = await upsertDrinkAction(data)
    if (res.success) {
      setMessage({ type: 'success', text: editingDrink?.id ? 'Đã cập nhật đồ uống!' : 'Đã thêm đồ uống mới!' })
      setEditingDrink(null)
      // Tải lại sản phẩm
      const prodRes = await getAdminProductsAction()
      if (prodRes.success && prodRes.data) {
        setDrinks(prodRes.data.drinks || [])
      }
      refreshStats()
    } else {
      setMessage({ type: 'error', text: res.error || 'Lỗi khi lưu sản phẩm' })
    }
  }

  // Handle Upsert Merchandise
  const handleMerchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      id: editingMerch?.id || undefined,
      ten_san_pham: formData.get('ten_san_pham') as string,
      slug: formData.get('slug') as string,
      mo_ta: formData.get('mo_ta') as string,
      gia: formData.get('gia') as string,
      danh_muc_id: formData.get('danh_muc_id') as string,
      hien_thi: formData.get('hien_thi') === 'true'
    }

    const res = await upsertMerchandiseAction(data)
    if (res.success) {
      setMessage({ type: 'success', text: editingMerch?.id ? 'Đã cập nhật vật phẩm!' : 'Đã thêm vật phẩm mới!' })
      setEditingMerch(null)
      const prodRes = await getAdminProductsAction()
      if (prodRes.success && prodRes.data) {
        setMerchandise(prodRes.data.merchandise || [])
      }
      refreshStats()
    } else {
      setMessage({ type: 'error', text: res.error || 'Lỗi khi lưu vật phẩm' })
    }
  }

  // Handle Upsert Category
  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      id: editingCategory?.id || undefined,
      ten_danh_muc: formData.get('ten_danh_muc') as string,
      slug: formData.get('slug') as string,
      thu_tu_hien_thi: formData.get('thu_tu_hien_thi') as string,
      hien_thi: formData.get('hien_thi') === 'true'
    }

    const res = await upsertCategoryAction(data)
    if (res.success) {
      setMessage({ type: 'success', text: editingCategory?.id ? 'Đã cập nhật danh mục!' : 'Đã thêm danh mục mới!' })
      setEditingCategory(null)
      const prodRes = await getAdminProductsAction()
      if (prodRes.success && prodRes.data) {
        setCategories(prodRes.data.categories || [])
      }
    } else {
      setMessage({ type: 'error', text: res.error || 'Lỗi khi lưu danh mục' })
    }
  }

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, type: 'drink' | 'merch') => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) return

    const res = await deleteProductAction(id, type)
    if (res.success) {
      setMessage({ type: 'success', text: 'Đã xóa sản phẩm thành công!' })
      if (type === 'drink') {
        setDrinks(prev => prev.filter(p => p.id !== id))
      } else {
        setMerchandise(prev => prev.filter(p => p.id !== id))
      }
      refreshStats()
    } else {
      setMessage({ type: 'error', text: res.error || 'Lỗi khi xóa sản phẩm' })
    }
  }

  // Quick toggle visibility
  const handleToggleDisplay = async (product: any, type: 'drink' | 'merch') => {
    const updatedProduct = { ...product, hien_thi: !product.hien_thi }
    const res = type === 'drink'
      ? await upsertDrinkAction(updatedProduct)
      : await upsertMerchandiseAction(updatedProduct)

    if (res.success) {
      setMessage({ type: 'success', text: `Đã ${updatedProduct.hien_thi ? 'hiển thị' : 'ẩn'} sản phẩm!` })
      if (type === 'drink') {
        setDrinks(prev => prev.map(p => p.id === product.id ? updatedProduct : p))
      } else {
        setMerchandise(prev => prev.map(p => p.id === product.id ? updatedProduct : p))
      }
    }
  }

  // Get order status label class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'cho_xac_nhan_chuyen_khoan':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
      case 'da_dat_don':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
      case 'dang_lam_don':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
      case 'dang_giao':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
      case 'da_giao':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
      case 'da_huy':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cho_xac_nhan_chuyen_khoan': return 'Chờ xác nhận CK'
      case 'da_dat_don': return 'Mới đặt đơn'
      case 'dang_lam_don': return 'Đang pha chế'
      case 'dang_giao': return 'Đang giao'
      case 'da_giao': return 'Đã giao'
      case 'da_huy': return 'Đã hủy'
      default: return status
    }
  }

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.ma_don_hang.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.thong_tin_khach_hang?.ho_ten || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.thong_tin_khach_hang?.so_dien_thoai || '').includes(orderSearch)
    
    if (orderStatusFilter === 'all') return matchesSearch
    return matchesSearch && order.trang_thai === orderStatusFilter
  })

  // Filtered Products
  const filteredDrinks = drinks.filter(d => 
    d.ten_san_pham.toLowerCase().includes(drinkSearch.toLowerCase()) || 
    d.slug.toLowerCase().includes(drinkSearch.toLowerCase())
  )

  const filteredMerchandise = merchandise.filter(m => 
    m.ten_san_pham.toLowerCase().includes(merchSearch.toLowerCase()) || 
    m.slug.toLowerCase().includes(merchSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f7efe3] dark:bg-[#1f120b] transition-colors duration-300 text-[#2b1810] dark:text-[#f7efe3] font-sans pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full glass dark:bg-[#1f120b]/90 border-b border-[#decdb9] dark:border-[#3a2114] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#c89b3c] p-2.5 rounded-2xl shadow-md">
              <Coffee className="w-6 h-6 text-[#1f120b]" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[#2b1810] dark:text-[#f4d17b]">
                VPC Admin
              </h1>
              <p className="text-[10px] text-[#78675d] dark:text-[#e8d8c4] font-bold">
                TRUNG NGUYÊN LEGEND ÂU LẠC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshAllData}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] rounded-xl text-xs font-black shadow-sm hover:bg-[#c89b3c] dark:hover:bg-[#c89b3c] hover:text-[#1f120b] dark:hover:text-[#1f120b] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
              Đồng bộ dữ liệu
            </button>
            <a
              href="/"
              className="text-xs font-black px-4 py-2 rounded-xl bg-[#c89b3c] hover:bg-[#f4d17b] text-[#1f120b] transition-all shadow-sm"
            >
              Về cửa hàng
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Floating Notification */}
        {message && (
          <div className={`fixed top-24 right-8 z-50 flex items-center gap-2.5 px-5 py-4 rounded-2xl shadow-2xl border transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}>
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-bold">{message.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-[#fff8ed] dark:bg-[#2b1810] rounded-2xl border border-[#decdb9]/50 dark:border-[#3a2114]/50 shadow-inner overflow-x-auto mb-8 custom-scrollbar-chat">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#c89b3c] text-[#1f120b] shadow-md'
                : 'text-[#78675d] dark:text-[#a89882] hover:text-[#c89b3c]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#c89b3c] text-[#1f120b] shadow-md'
                : 'text-[#78675d] dark:text-[#a89882] hover:text-[#c89b3c]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Đơn hàng ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('drinks')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'drinks'
                ? 'bg-[#c89b3c] text-[#1f120b] shadow-md'
                : 'text-[#78675d] dark:text-[#a89882] hover:text-[#c89b3c]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            Đồ uống ({drinks.length})
          </button>
          <button
            onClick={() => setActiveTab('merch')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'merch'
                ? 'bg-[#c89b3c] text-[#1f120b] shadow-md'
                : 'text-[#78675d] dark:text-[#a89882] hover:text-[#c89b3c]'
            }`}
          >
            <Gift className="w-4 h-4" />
            Vật phẩm ({merchandise.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#c89b3c] text-[#1f120b] shadow-md'
                : 'text-[#78675d] dark:text-[#a89882] hover:text-[#c89b3c]'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Danh mục ({categories.length})
          </button>
        </div>

        {/* Tab View Render */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Doanh Thu */}
                <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-36 h-36 text-[#c89b3c]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-[#78675d] dark:text-[#a89882]">Doanh Thu Thực Tế</span>
                    <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#c89b3c] mt-4">
                    {stats.totalRevenue?.toLocaleString('vi-VN')}đ
                  </h3>
                  <p className="text-[10px] text-[#78675d] dark:text-[#a89882] font-bold mt-1">Tính trên các đơn hàng đã thanh toán</p>
                </div>

                {/* Card 2: Đơn hàng */}
                <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-36 h-36 text-[#c89b3c]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-[#78675d] dark:text-[#a89882]">Tổng Đơn Hàng</span>
                    <div className="bg-blue-100 dark:bg-blue-950/40 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#2b1810] dark:text-[#f7efe3] mt-4">
                    {stats.totalOrders}
                  </h3>
                  <p className="text-[10px] text-[#78675d] dark:text-[#a89882] font-bold mt-1">Đơn phát sinh trên website</p>
                </div>

                {/* Card 3: Đơn chờ xử lý */}
                <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 group-hover:scale-110 transition-transform">
                    <Clock className="w-36 h-36 text-[#c89b3c]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-[#78675d] dark:text-[#a89882]">Đơn Chờ Xử Lý</span>
                    <div className="bg-amber-100 dark:bg-amber-950/40 p-2 rounded-xl text-amber-600 dark:text-amber-400">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-amber-500 mt-4">
                    {stats.pendingOrders}
                  </h3>
                  <p className="text-[10px] text-[#78675d] dark:text-[#a89882] font-bold mt-1">Đơn mới & Đơn chờ xác nhận CK</p>
                </div>

                {/* Card 4: Sản phẩm */}
                <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 group-hover:scale-110 transition-transform">
                    <Coffee className="w-36 h-36 text-[#c89b3c]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-[#78675d] dark:text-[#a89882]">Sản phẩm hoạt động</span>
                    <div className="bg-purple-100 dark:bg-purple-950/40 p-2 rounded-xl text-purple-600 dark:text-purple-400">
                      <Coffee className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#2b1810] dark:text-[#f7efe3] mt-4">
                    {stats.totalDrinks + stats.totalMerch}
                  </h3>
                  <p className="text-[10px] text-[#78675d] dark:text-[#a89882] font-bold mt-1">
                    {stats.totalDrinks} đồ uống · {stats.totalMerch} vật phẩm
                  </p>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders List */}
                <div className="lg:col-span-2 bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] rounded-3xl p-6 shadow-sm">
                  <h4 className="text-lg font-black text-[#2b1810] dark:text-[#f4d17b] mb-6 flex items-center justify-between">
                    Đơn hàng vừa đặt
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-black text-[#c89b3c] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Xem tất cả <ChevronRight className="w-3 h-3" />
                    </button>
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#decdb9]/50 dark:border-[#3a2114]/50 pb-3 text-[#78675d] dark:text-[#a89882] font-black uppercase tracking-wider">
                          <th className="py-3">Mã đơn</th>
                          <th className="py-3">Khách hàng</th>
                          <th className="py-3">Tổng tiền</th>
                          <th className="py-3">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-[#decdb9]/20 dark:border-[#3a2114]/20 hover:bg-[#fff8ed]/30 dark:hover:bg-[#2b1810]/30 transition-colors">
                            <td className="py-3.5 font-black text-[#c89b3c]">{order.ma_don_hang}</td>
                            <td className="py-3.5">
                              <p className="font-extrabold">{order.thong_tin_khach_hang?.ho_ten || 'Khách hàng'}</p>
                              <p className="text-[10px] text-[#78675d] dark:text-[#a89882]">{order.thong_tin_khach_hang?.so_dien_thoai}</p>
                            </td>
                            <td className="py-3.5 font-bold">{(order.tong_tien || 0).toLocaleString('vi-VN')}đ</td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(order.trang_thai)}`}>
                                {getStatusText(order.trang_thai)}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-[#78675d] font-bold italic">Chưa có đơn hàng nào phát sinh.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Operations shortcut panel */}
                <div className="bg-[#fff8ed] dark:bg-[#2b1810]/40 border border-[#decdb9] dark:border-[#3a2114] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-black text-[#2b1810] dark:text-[#f4d17b] mb-4">Lối tắt thao tác nhanh</h4>
                    <p className="text-xs text-[#78675d] dark:text-[#a89882] leading-relaxed mb-6 font-bold">
                      Truy cập trực tiếp tới các phân hệ quản lý hoặc thực hiện chèn dữ liệu nhanh để cập nhật nội dung cho cửa hàng VPC.
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => { setActiveTab('drinks'); setEditingDrink('new'); }}
                        className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] hover:border-[#c89b3c] rounded-2xl text-xs font-black shadow-sm transition-all text-left cursor-pointer"
                      >
                        <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-[#c89b3c]" /> Thêm đồ uống mới</span>
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setActiveTab('merch'); setEditingMerch('new'); }}
                        className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] hover:border-[#c89b3c] rounded-2xl text-xs font-black shadow-sm transition-all text-left cursor-pointer"
                      >
                        <span className="flex items-center gap-2"><Gift className="w-4 h-4 text-[#c89b3c]" /> Thêm vật phẩm mới</span>
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setActiveTab('categories'); setEditingCategory('new'); }}
                        className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] hover:border-[#c89b3c] rounded-2xl text-xs font-black shadow-sm transition-all text-left cursor-pointer"
                      >
                        <span className="flex items-center gap-2"><FolderOpen className="w-4 h-4 text-[#c89b3c]" /> Thêm danh mục mới</span>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-[#decdb9]/50 dark:border-[#3a2114]/50 pt-4 flex items-center gap-2 text-[10px] text-[#78675d] dark:text-[#a89882] font-black uppercase">
                    <Clock className="w-4 h-4" /> Hệ thống bảo mật dịch vụ trực tiếp
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-[#2b1810] dark:text-[#f4d17b]">Danh sách Đơn hàng</h3>
                  <p className="text-xs text-[#78675d] dark:text-[#a89882] font-bold">Thao tác duyệt đơn, giao vận và hủy đơn tại đây</p>
                </div>
                
                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78675d] dark:text-[#a89882]" />
                    <input
                      type="text"
                      placeholder="Tìm mã đơn, tên, số ĐT..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-[#fff8ed] dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] pl-9 pr-4 py-2.5 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#fff8ed] dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-4 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="cho_xac_nhan_chuyen_khoan">Chờ xác nhận CK</option>
                    <option value="da_dat_don">Đơn mới (COD)</option>
                    <option value="dang_lam_don">Đang pha chế</option>
                    <option value="dang_giao">Đang giao hàng</option>
                    <option value="da_giao">Đã hoàn thành</option>
                    <option value="da_huy">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#decdb9] dark:border-[#3a2114] pb-3 text-[#78675d] dark:text-[#a89882] font-black uppercase tracking-wider">
                      <th className="py-4 px-3">Mã đơn</th>
                      <th className="py-4 px-3">Thông tin khách hàng</th>
                      <th className="py-4 px-3">Chi tiết giỏ hàng</th>
                      <th className="py-4 px-3">Thanh toán & Phí</th>
                      <th className="py-4 px-3">Trạng thái xử lý</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#decdb9]/25 dark:border-[#3a2114]/25 hover:bg-[#fff8ed]/20 dark:hover:bg-[#2b1810]/20 transition-colors">
                        {/* Mã đơn */}
                        <td className="py-4 px-3 font-black text-[#c89b3c]">{order.ma_don_hang}</td>
                        
                        {/* Khách hàng */}
                        <td className="py-4 px-3">
                          <p className="font-extrabold text-sm">{order.thong_tin_khach_hang?.ho_ten || 'Khách hàng'}</p>
                          <p className="text-[10px] text-[#78675d] dark:text-[#a89882] mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.created_at).toLocaleString('vi-VN')}
                          </p>
                          <div className="text-[10px] mt-1.5 space-y-0.5">
                            <p className="flex items-center gap-1 font-bold"><User className="w-3 h-3" /> ĐT: {order.thong_tin_khach_hang?.so_dien_thoai}</p>
                            <p className="flex items-center gap-1 text-[#78675d] dark:text-[#a89882]"><MapPin className="w-3 h-3" /> ĐC: {order.thong_tin_khach_hang?.dia_chi}</p>
                          </div>
                        </td>

                        {/* Sản phẩm */}
                        <td className="py-4 px-3 max-w-xs">
                          <p className="font-bold text-[#5a321f] dark:text-[#e8d8c4] italic leading-relaxed">
                            {order.danh_sach_san_pham}
                          </p>
                          {order.ghi_chu && (
                            <p className="text-[10px] text-rose-500 font-extrabold mt-1">
                              *Ghi chú: {order.ghi_chu}
                            </p>
                          )}
                        </td>

                        {/* Giá & Phí */}
                        <td className="py-4 px-3 font-bold space-y-1">
                          <p className="text-base text-[#c89b3c] font-black">{(order.tong_tien || 0).toLocaleString('vi-VN')}đ</p>
                          <p className="text-[10px] text-[#78675d] dark:text-[#a89882]">Ship: {order.phi_ship?.toLocaleString('vi-VN')}đ ({order.khoang_cach_km}km)</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold ${
                            order.phuong_thuc_thanh_toan === 'chuyen_khoan' 
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {order.phuong_thuc_thanh_toan === 'chuyen_khoan' ? 'Chuyển khoản (VietQR)' : 'Tiền mặt (COD)'}
                          </span>
                        </td>

                        {/* Dropdown cập nhật trạng thái */}
                        <td className="py-4 px-3">
                          <div className="space-y-2">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadgeClass(order.trang_thai)}`}>
                              {getStatusText(order.trang_thai)}
                            </span>
                            
                            <select
                              value={order.trang_thai}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                              className="block w-full bg-[#fff8ed] dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide cursor-pointer focus:outline-none focus:border-[#c89b3c]"
                            >
                              <option value="cho_xac_nhan_chuyen_khoan">Chờ xác nhận CK</option>
                              <option value="da_dat_don">Đơn mới (COD)</option>
                              <option value="dang_lam_don">Đang pha chế</option>
                              <option value="dang_giao">Đang giao hàng</option>
                              <option value="da_giao">Đã hoàn thành</option>
                              <option value="da_huy">Đã hủy</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-[#78675d] font-bold italic">
                          Không tìm thấy đơn hàng nào khớp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DRINKS MANAGEMENT */}
          {activeTab === 'drinks' && (
            <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-[#2b1810] dark:text-[#f4d17b]">Quản lý Menu Đồ Uống</h3>
                  <p className="text-xs text-[#78675d] dark:text-[#a89882] font-bold">Thêm mới, sửa đổi thông tin hoặc điều chỉnh giá bán nước</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78675d] dark:text-[#a89882]" />
                    <input
                      type="text"
                      placeholder="Tìm đồ uống..."
                      value={drinkSearch}
                      onChange={(e) => setDrinkSearch(e.target.value)}
                      className="w-full bg-[#fff8ed] dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] pl-9 pr-4 py-2 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <button
                    onClick={() => setEditingDrink('new')}
                    className="flex items-center gap-1 px-4 py-2 bg-[#c89b3c] hover:bg-[#f4d17b] text-[#1f120b] rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Thêm đồ uống
                  </button>
                </div>
              </div>

              {/* Form Modal Thêm/Sửa */}
              {editingDrink && (
                <div className="mb-8 p-6 bg-[#fff8ed] dark:bg-[#2b1810]/50 border border-[#c89b3c]/40 rounded-3xl shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4 border-b border-[#decdb9] dark:border-[#3a2114] pb-2">
                    <h4 className="text-base font-black text-[#c89b3c]">
                      {editingDrink === 'new' ? '✨ Thêm Đồ Uống Mới' : `📝 Chỉnh Sửa: ${editingDrink.ten_san_pham}`}
                    </h4>
                    <button
                      onClick={() => setEditingDrink(null)}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[#78675d] dark:text-[#a89882] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleDrinkSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Tên Đồ Uống *</label>
                      <input
                        type="text"
                        name="ten_san_pham"
                        defaultValue={editingDrink?.ten_san_pham || ''}
                        required
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Đường dẫn slug (Để trống để tự tạo)</label>
                      <input
                        type="text"
                        name="slug"
                        defaultValue={editingDrink?.slug || ''}
                        placeholder="vi-du-ca-phe-sua-da"
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Danh mục nước *</label>
                      <select
                        name="danh_muc_id"
                        defaultValue={editingDrink?.danh_muc_id || ''}
                        required
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer"
                      >
                        <option value="">Chọn danh mục...</option>
                        {categories.filter(c => c.slug !== 'merchandise').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Giá Đen Đá (đ)</label>
                      <input
                        type="number"
                        name="gia_den"
                        defaultValue={editingDrink?.gia_den || ''}
                        placeholder="Nhập giá hoặc để trống nếu bán đồng giá"
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Giá Sữa Đá (đ)</label>
                      <input
                        type="number"
                        name="gia_sua"
                        defaultValue={editingDrink?.gia_sua || ''}
                        placeholder="Nhập giá sữa đá"
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Hiển thị trên menu</label>
                      <select
                        name="hien_thi"
                        defaultValue={editingDrink?.hien_thi !== false ? 'true' : 'false'}
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer"
                      >
                        <option value="true">Hiển thị (Bán)</option>
                        <option value="false">Ẩn (Tạm ngưng)</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Mô tả sản phẩm</label>
                      <textarea
                        name="mo_ta"
                        rows={2}
                        defaultValue={editingDrink?.mo_ta || ''}
                        placeholder="Nhập mô tả hương vị đồ uống..."
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] p-3 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingDrink(null)}
                        className="px-5 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-black transition-all cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#c89b3c] hover:bg-[#f4d17b] text-[#1f120b] text-xs font-black shadow-md transition-all cursor-pointer"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#decdb9] dark:border-[#3a2114] pb-3 text-[#78675d] dark:text-[#a89882] font-black uppercase tracking-wider">
                      <th className="py-4 px-3">Tên sản phẩm</th>
                      <th className="py-4 px-3">Đường dẫn (Slug)</th>
                      <th className="py-4 px-3">Giá Đen Đá</th>
                      <th className="py-4 px-3">Giá Sữa Đá</th>
                      <th className="py-4 px-3">Danh mục</th>
                      <th className="py-4 px-3 text-center">Trạng thái</th>
                      <th className="py-4 px-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrinks.map((d) => (
                      <tr key={d.id} className="border-b border-[#decdb9]/25 dark:border-[#3a2114]/25 hover:bg-[#fff8ed]/20 dark:hover:bg-[#2b1810]/20 transition-colors">
                        <td className="py-4 px-3 font-extrabold text-sm">{d.ten_san_pham}</td>
                        <td className="py-4 px-3 text-[#78675d] dark:text-[#a89882]">{d.slug}</td>
                        <td className="py-4 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                          {d.gia_den ? `${d.gia_den.toLocaleString('vi-VN')}đ` : '-'}
                        </td>
                        <td className="py-4 px-3 font-bold text-amber-600 dark:text-amber-400">
                          {d.gia_sua ? `${d.gia_sua.toLocaleString('vi-VN')}đ` : '-'}
                        </td>
                        <td className="py-4 px-3 font-bold">
                          {categories.find(c => c.id === d.danh_muc_id)?.ten_danh_muc || 'Chưa phân loại'}
                        </td>
                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => handleToggleDisplay(d, 'drink')}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer border transition-all ${
                              d.hien_thi
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800'
                                : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-800'
                            }`}
                          >
                            {d.hien_thi ? 'Đang bán' : 'Ẩn'}
                          </button>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditingDrink(d)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer transition-colors"
                              title="Sửa thông tin"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(d.id, 'drink')}
                              className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl cursor-pointer transition-colors"
                              title="Xóa đồ uống"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDrinks.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#78675d] font-bold italic">
                          Không tìm thấy đồ uống nào tương thích.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MERCHANDISE MANAGEMENT */}
          {activeTab === 'merch' && (
            <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-[#2b1810] dark:text-[#f4d17b]">Quản lý Vật Phẩm Lưu Niệm</h3>
                  <p className="text-xs text-[#78675d] dark:text-[#a89882] font-bold">Thêm mới, sửa đổi thông tin phin cà phê, bình giữ nhiệt, ly sứ VIP...</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78675d] dark:text-[#a89882]" />
                    <input
                      type="text"
                      placeholder="Tìm vật phẩm..."
                      value={merchSearch}
                      onChange={(e) => setMerchSearch(e.target.value)}
                      className="w-full bg-[#fff8ed] dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] pl-9 pr-4 py-2 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <button
                    onClick={() => setEditingMerch('new')}
                    className="flex items-center gap-1 px-4 py-2 bg-[#c89b3c] hover:bg-[#f4d17b] text-[#1f120b] rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Thêm vật phẩm
                  </button>
                </div>
              </div>

              {/* Form Modal Thêm/Sửa */}
              {editingMerch && (
                <div className="mb-8 p-6 bg-[#fff8ed] dark:bg-[#2b1810]/50 border border-[#c89b3c]/40 rounded-3xl shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4 border-b border-[#decdb9] dark:border-[#3a2114] pb-2">
                    <h4 className="text-base font-black text-[#c89b3c]">
                      {editingMerch === 'new' ? '✨ Thêm Vật Phẩm Mới' : `📝 Chỉnh Sửa: ${editingMerch.ten_san_pham}`}
                    </h4>
                    <button
                      onClick={() => setEditingMerch(null)}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[#78675d] dark:text-[#a89882] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleMerchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Tên Vật Phẩm *</label>
                      <input
                        type="text"
                        name="ten_san_pham"
                        defaultValue={editingMerch?.ten_san_pham || ''}
                        required
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Đường dẫn slug (Để trống để tự tạo)</label>
                      <input
                        type="text"
                        name="slug"
                        defaultValue={editingMerch?.slug || ''}
                        placeholder="vi-du-ly-su-chu-tri-thuc"
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Danh mục *</label>
                      <select
                        name="danh_muc_id"
                        defaultValue={editingMerch?.danh_muc_id || ''}
                        required
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer"
                      >
                        <option value="">Chọn danh mục...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.ten_danh_muc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Giá Bán (đ) *</label>
                      <input
                        type="number"
                        name="gia"
                        defaultValue={editingMerch?.gia || ''}
                        required
                        placeholder="Nhập giá bán vật phẩm"
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Hiển thị trên web</label>
                      <select
                        name="hien_thi"
                        defaultValue={editingMerch?.hien_thi !== false ? 'true' : 'false'}
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer"
                      >
                        <option value="true">Hiển thị</option>
                        <option value="false">Ẩn</option>
                      </select>
                    </div>
                    <div />

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Mô tả vật phẩm</label>
                      <textarea
                        name="mo_ta"
                        rows={2}
                        defaultValue={editingMerch?.mo_ta || ''}
                        placeholder="Nhập mô tả chất liệu, tính năng vật phẩm..."
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] p-3 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingMerch(null)}
                        className="px-5 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-black transition-all cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#c89b3c] hover:bg-[#f4d17b] text-[#1f120b] text-xs font-black shadow-md transition-all cursor-pointer"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#decdb9] dark:border-[#3a2114] pb-3 text-[#78675d] dark:text-[#a89882] font-black uppercase tracking-wider">
                      <th className="py-4 px-3">Tên sản phẩm</th>
                      <th className="py-4 px-3">Đường dẫn (Slug)</th>
                      <th className="py-4 px-3">Giá Bán</th>
                      <th className="py-4 px-3">Danh mục</th>
                      <th className="py-4 px-3 text-center">Trạng thái</th>
                      <th className="py-4 px-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMerchandise.map((m) => (
                      <tr key={m.id} className="border-b border-[#decdb9]/25 dark:border-[#3a2114]/25 hover:bg-[#fff8ed]/20 dark:hover:bg-[#2b1810]/20 transition-colors">
                        <td className="py-4 px-3 font-extrabold text-sm">{m.ten_san_pham}</td>
                        <td className="py-4 px-3 text-[#78675d] dark:text-[#a89882]">{m.slug}</td>
                        <td className="py-4 px-3 font-black text-amber-600 dark:text-amber-400">
                          {m.gia ? `${m.gia.toLocaleString('vi-VN')}đ` : '-'}
                        </td>
                        <td className="py-4 px-3 font-bold">
                          {categories.find(c => c.id === m.danh_muc_id)?.ten_danh_muc || 'Chưa phân loại'}
                        </td>
                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => handleToggleDisplay(m, 'merch')}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer border transition-all ${
                              m.hien_thi
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800'
                                : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-800'
                            }`}
                          >
                            {m.hien_thi ? 'Hiển thị' : 'Ẩn'}
                          </button>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditingMerch(m)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer transition-colors"
                              title="Sửa thông tin"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(m.id, 'merch')}
                              className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl cursor-pointer transition-colors"
                              title="Xóa vật phẩm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredMerchandise.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#78675d] font-bold italic">
                          Không tìm thấy vật phẩm nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="bg-white dark:bg-[#2b1810] border border-[#decdb9] dark:border-[#3a2114] rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-[#2b1810] dark:text-[#f4d17b]">Quản lý Danh Mục Sản Phẩm</h3>
                  <p className="text-xs text-[#78675d] dark:text-[#a89882] font-bold">Thêm danh mục mới, thay đổi thứ tự sắp xếp hiển thị</p>
                </div>
                
                <button
                  onClick={() => setEditingCategory('new')}
                  className="flex items-center gap-1 px-4 py-2 bg-[#c89b3c] hover:bg-[#f4d17b] text-[#1f120b] rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Thêm danh mục mới
                </button>
              </div>

              {/* Form Modal Thêm/Sửa */}
              {editingCategory && (
                <div className="mb-8 p-6 bg-[#fff8ed] dark:bg-[#2b1810]/50 border border-[#c89b3c]/40 rounded-3xl shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4 border-b border-[#decdb9] dark:border-[#3a2114] pb-2">
                    <h4 className="text-base font-black text-[#c89b3c]">
                      {editingCategory === 'new' ? '✨ Thêm Danh Mục Mới' : `📝 Chỉnh Sửa: ${editingCategory.ten_danh_muc}`}
                    </h4>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[#78675d] dark:text-[#a89882] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Tên Danh Mục *</label>
                      <input
                        type="text"
                        name="ten_danh_muc"
                        defaultValue={editingCategory?.ten_danh_muc || ''}
                        required
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Đường dẫn slug (Để trống để tự tạo)</label>
                      <input
                        type="text"
                        name="slug"
                        defaultValue={editingCategory?.slug || ''}
                        placeholder="vi-du-ca-phe-phim"
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Thứ tự hiển thị (Số nhỏ đứng trước)</label>
                      <input
                        type="number"
                        name="thu_tu_hien_thi"
                        defaultValue={editingCategory?.thu_tu_hien_thi || '0'}
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#78675d] dark:text-[#a89882] mb-1.5">Trạng thái hoạt động</label>
                      <select
                        name="hien_thi"
                        defaultValue={editingCategory?.hien_thi !== false ? 'true' : 'false'}
                        className="w-full bg-white dark:bg-[#1f120b] border border-[#decdb9] dark:border-[#3a2114] focus:outline-none focus:border-[#c89b3c] px-3.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer"
                      >
                        <option value="true">Hiển thị trên Web</option>
                        <option value="false">Ẩn khỏi Web</option>
                      </select>
                    </div>

                    <div className="md:col-span-4 flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-5 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-black transition-all cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#c89b3c] hover:bg-[#f4d17b] text-[#1f120b] text-xs font-black shadow-md transition-all cursor-pointer"
                      >
                        Lưu danh mục
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#decdb9] dark:border-[#3a2114] pb-3 text-[#78675d] dark:text-[#a89882] font-black uppercase tracking-wider">
                      <th className="py-4 px-3">Tên danh mục</th>
                      <th className="py-4 px-3">Đường dẫn (Slug)</th>
                      <th className="py-4 px-3 text-center">Thứ tự hiển thị</th>
                      <th className="py-4 px-3 text-center">Trạng thái</th>
                      <th className="py-4 px-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id} className="border-b border-[#decdb9]/25 dark:border-[#3a2114]/25 hover:bg-[#fff8ed]/20 dark:hover:bg-[#2b1810]/20 transition-colors">
                        <td className="py-4 px-3 font-extrabold text-sm">{c.ten_danh_muc}</td>
                        <td className="py-4 px-3 text-[#78675d] dark:text-[#a89882]">{c.slug}</td>
                        <td className="py-4 px-3 text-center font-bold text-blue-600 dark:text-blue-400">{c.thu_tu_hien_thi}</td>
                        <td className="py-4 px-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            c.hien_thi
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-800'
                          }`}>
                            {c.hien_thi ? 'Hoạt động' : 'Đang ẩn'}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => setEditingCategory(c)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer transition-colors"
                            title="Sửa thông tin"
                          >
                            <span className="flex items-center gap-1 font-bold text-xs"><Edit className="w-3.5 h-3.5" /> Sửa</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
