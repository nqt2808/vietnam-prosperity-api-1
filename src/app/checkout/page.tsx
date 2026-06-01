'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2, ShoppingBag, ArrowLeft, Send, Sparkles,
  MapPin, CreditCard, Banknote, Loader2, User, Phone, Home, StickyNote
} from 'lucide-react'
import { useCartStore } from '@/features/cart/cart-store'
import { formatCurrency } from '@/lib/utils'
import { createOrderAction } from '@/app/actions/order-actions'

// ─── Kiểu dữ liệu ───────────────────────────────────────────
type PaymentMethod = 'cod' | 'bank'
type DeliveryType = 'pickup' | 'delivery'

interface FormData {
  name: string
  phone: string
  address: string
  note: string
  paymentMethod: PaymentMethod
  deliveryType: DeliveryType
}

// ─── Hàm sinh mã đơn hàng VPC theo format index.html ────────
function createOrderCode(): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return `VPC-DH-${yyyy}${mm}${dd}-${hh}${mi}${ss}`
}

// ─── Component chính ─────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'cod',
    deliveryType: 'pickup',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }))
  }

  const handleDeliveryTypeChange = (type: DeliveryType) => {
    setFormData((prev) => ({ ...prev, deliveryType: type }))
  }

  const totalPrice = getTotalPrice()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    if (formData.deliveryType === 'delivery' && !formData.address.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng.')
      return
    }

    setIsSubmitting(true)

    try {
      // Sinh mã đơn hàng theo format VPC-DH-...
      const orderCode = createOrderCode()

      const result = await createOrderAction({
        fullName: formData.name,
        phoneNumber: formData.phone,
        email: undefined,
        address: formData.deliveryType === 'delivery' ? formData.address : 'Nhận tại cửa hàng',
        note: formData.note,
        deliveryType: formData.deliveryType,
        distance: 0,
        paymentMethod: formData.paymentMethod === 'bank' ? 'bank' : 'cash',
        subtotal: totalPrice,
        shippingFee: 0,
        total: totalPrice,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
      })

      if (!result.success) {
        throw new Error(result.error || 'Không tạo được đơn hàng')
      }

      const finalOrderCode = result.data?.orderNumber || orderCode

      // Lưu vào localStorage để trang payment đọc (tương thích index.html)
      if (typeof window !== 'undefined') {
        const pendingInfo = {
          ma_don_hang: finalOrderCode,
          ho_ten: formData.name,
          so_dien_thoai: formData.phone,
          dia_chi: formData.address,
          ghi_chu: formData.note,
          tong_tien: totalPrice,
          phuong_thuc_thanh_toan: formData.paymentMethod,
        }
        localStorage.setItem('vpc_pending_order_info', JSON.stringify(pendingInfo))
        localStorage.setItem('vpc_pending_order_code', finalOrderCode)
      }

      if (formData.paymentMethod === 'bank') {
        // Chuyển sang trang thanh toán QR
        clearCart()
        router.push(`/payment?order=${encodeURIComponent(finalOrderCode)}&phone=${encodeURIComponent(formData.phone)}&amount=${totalPrice}`)
        return
      }

      // COD: Thành công
      setOrderNumber(finalOrderCode)
      clearCart()
      setIsSuccess(true)

    } catch (error: any) {
      console.error('Checkout error:', error)
      alert('Đặt hàng thất bại: ' + (error.message || 'Lỗi không xác định'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Màn hình thành công COD ────────────────────────────────
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 w-full text-center space-y-8 flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl scale-150" />
          <CheckCircle2 className="w-20 h-20 text-emerald-500 relative z-10 animate-bounce" />
        </div>

        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Đặt hàng thành công!
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Cảm ơn bạn đã đặt hàng!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Đơn hàng đã được tiếp nhận. Cửa hàng sẽ liên hệ xác nhận trong thời gian sớm nhất.
          </p>
        </div>

        <div className="w-full p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-left space-y-3 max-w-sm shadow-sm">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100 dark:border-zinc-900">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">Mã đơn hàng:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100 dark:border-zinc-900">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">Người nhận:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{formData.name}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100 dark:border-zinc-900">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">Số điện thoại:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{formData.phone}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100 dark:border-zinc-900">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">Thanh toán:</span>
            <span className="font-bold text-emerald-600">Thanh toán khi nhận hàng</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">Tổng tiền:</span>
            <span className="font-bold text-brand-primary">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
          <Link
            href="/products"
            className="py-3.5 rounded-xl font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all text-center shadow-md hover:shadow-lg text-sm"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/"
            className="py-3.5 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-center text-sm"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  // ─── Form checkout ──────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-900 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight">Thanh Toán</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">
            Vui lòng điền thông tin để hoàn tất đơn hàng.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại mua hàng
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-16">
          <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900">
            <ShoppingBag className="w-12 h-12 text-zinc-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Giỏ hàng trống</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
          </div>
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start flex-1">
          {/* ── Form trái ── */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Thông tin người nhận */}
              <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <User className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Thông tin người nhận</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3" /> Họ và tên *
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Số điện thoại *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: 0389726999"
                      pattern="[0-9]{9,11}"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Hình thức nhận hàng */}
              <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Hình thức nhận hàng</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Đến lấy tại quán */}
                  <button
                    type="button"
                    onClick={() => handleDeliveryTypeChange('pickup')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.deliveryType === 'pickup'
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.deliveryType === 'pickup' ? 'border-brand-primary' : 'border-zinc-400'
                      }`}>
                        {formData.deliveryType === 'pickup' && (
                          <div className="w-2 h-2 rounded-full bg-brand-primary" />
                        )}
                      </div>
                      <span className="text-sm font-bold">Đến lấy tại quán</span>
                    </div>
                    <p className="text-xs text-zinc-500 ml-6">Khu TĐC Đông Nam Thủy An, TP. Huế</p>
                  </button>

                  {/* Giao hàng tận nơi */}
                  <button
                    type="button"
                    onClick={() => handleDeliveryTypeChange('delivery')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.deliveryType === 'delivery'
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.deliveryType === 'delivery' ? 'border-brand-primary' : 'border-zinc-400'
                      }`}>
                        {formData.deliveryType === 'delivery' && (
                          <div className="w-2 h-2 rounded-full bg-brand-primary" />
                        )}
                      </div>
                      <span className="text-sm font-bold">Giao hàng tận nơi</span>
                    </div>
                    <p className="text-xs text-zinc-500 ml-6">Cửa hàng sẽ xác nhận phí ship</p>
                  </button>
                </div>

                {/* Địa chỉ giao hàng (chỉ hiển thị khi chọn giao hàng) */}
                {formData.deliveryType === 'delivery' && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Home className="w-3 h-3" /> Địa chỉ giao hàng *
                    </label>
                    <input
                      required={formData.deliveryType === 'delivery'}
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, TP"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                    />
                  </div>
                )}

                {/* Ghi chú */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <StickyNote className="w-3 h-3" /> Ghi chú (Tùy chọn)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ít đá, ít ngọt, thêm milkfoam, lời nhắn cho shipper..."
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all resize-none"
                  />
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <CreditCard className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Phương thức thanh toán</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('cod')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.paymentMethod === 'cod' ? 'border-brand-primary' : 'border-zinc-400'
                      }`}>
                        {formData.paymentMethod === 'cod' && (
                          <div className="w-2 h-2 rounded-full bg-brand-primary" />
                        )}
                      </div>
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold">Tiền mặt (COD)</span>
                    </div>
                    <p className="text-xs text-zinc-500 ml-6">Thanh toán khi nhận hàng</p>
                  </button>

                  {/* Chuyển khoản */}
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('bank')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.paymentMethod === 'bank'
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.paymentMethod === 'bank' ? 'border-brand-primary' : 'border-zinc-400'
                      }`}>
                        {formData.paymentMethod === 'bank' && (
                          <div className="w-2 h-2 rounded-full bg-brand-primary" />
                        )}
                      </div>
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold">Chuyển khoản QR</span>
                    </div>
                    <p className="text-xs text-zinc-500 ml-6">Vietcombank • Tự động xác nhận</p>
                  </button>
                </div>

                {/* Banner chuyển khoản tự động */}
                {formData.paymentMethod === 'bank' && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-blue-500 mt-0.5 shrink-0">✨</div>
                    <div>
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        Xác nhận tự động qua VietQR
                      </p>
                      <p className="text-xs text-blue-600/80 dark:text-blue-400/70 mt-0.5">
                        Quét mã QR và chuyển khoản đúng nội dung. Hệ thống sẽ tự động xác nhận trong vài giây.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút đặt hàng */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Đang xử lý đơn hàng...
                  </>
                ) : formData.paymentMethod === 'bank' ? (
                  <>
                    <CreditCard className="w-4.5 h-4.5" />
                    Đặt hàng & Thanh toán QR
                  </>
                ) : (
                  <>
                    <Send className="w-4.5 h-4.5" />
                    Xác nhận đặt hàng
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Tóm tắt đơn hàng phải ── */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
            <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-5">
              <h3 className="font-bold text-sm uppercase tracking-wider pb-4 border-b border-zinc-100 dark:border-zinc-900">
                Chi tiết đơn hàng ({items.length} sản phẩm)
              </h3>

              {/* Danh sách sản phẩm */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-zinc-100/50 dark:border-zinc-900/50 last:border-b-0 last:pb-0"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-50 line-clamp-2">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block mt-0.5">
                        SL: {item.quantity} × {formatCurrency(item.price)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tổng tiền */}
              <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-500 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Tổng thanh toán</span>
                  <span className="text-brand-primary text-base">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Thông tin cửa hàng */}
            <div className="p-4 rounded-2xl border border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/30">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-2">🏪 Trung Nguyên Legend Âu Lạc</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/70">📍 Khu TĐC Đông Nam Thủy An, P. An Cựu, TP. Huế</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-1">📞 038 972 6999</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-1">🕐 06:30 - 21:30 hàng ngày</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
