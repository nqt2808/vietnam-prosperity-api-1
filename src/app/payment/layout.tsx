import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Thanh toán chuyển khoản | Vietnam Prosperity Coffee',
  description: 'Quét mã QR VietQR để thanh toán đơn hàng. Hệ thống tự động xác nhận thanh toán.',
}

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
