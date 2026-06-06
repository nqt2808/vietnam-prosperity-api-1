'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  CheckCircle2, Clock, RefreshCw, Copy, Check,
  ArrowLeft, Loader2, AlertCircle, ShieldCheck
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// ─── Cấu hình tài khoản ngân hàng ────────────────────────────
const BANK_CONFIG = {
  bankId: 'vietinbank',
  accountNo: '101882692631',
  accountName: 'NGO QUYNH TRANG',
  template: 'compact2',
}

type PaymentStatus = 'waiting' | 'checking' | 'success' | 'failed'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const orderCode = searchParams.get('order') || ''
  const phone = searchParams.get('phone') || ''
  const amount = Number(searchParams.get('amount') || 0)

  const [status, setStatus] = useState<PaymentStatus>('waiting')
  const [copied, setCopied] = useState(false)
  const [pollingCount, setPollingCount] = useState(0)
  const [autoChecking, setAutoChecking] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const maxPolls = 60 // 5 phút (polling mỗi 5 giây)

  // ─── SePay QR URL động ──────────────────────────────────────
  const memoText = `SEVQR ${orderCode}`
  const qrUrl = `https://qr.sepay.vn/img?acc=${BANK_CONFIG.accountNo}&bank=${BANK_CONFIG.bankId}&amount=${amount}&des=${encodeURIComponent(memoText)}`

  // ─── Kiểm tra trạng thái thanh toán ─────────────────────
  const checkPayment = useCallback(async (isManual = false) => {
    if (!orderCode || status === 'success') return

    if (isManual) setStatus('checking')

    try {
      const res = await fetch(`/api/check-payment?order=${encodeURIComponent(orderCode)}`, {
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Không kiểm tra được')

      const data = await res.json()
      setLastChecked(new Date())

      const successStatuses = [
        'da_chuyen_khoan', 'da_thanh_toan', 'da_nhan_don',
        'dang_lam_don', 'da_giao_shipper', 'hoan_thanh',
      ]

      if (data.paid === true || successStatuses.includes(data.status)) {
        setStatus('success')
        // Dừng polling khi thành công
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        // Chuyển hướng sau 5 giây
        setTimeout(() => {
          router.push('/')
        }, 6000)
      } else {
        if (isManual) setStatus('waiting')
      }
    } catch (err) {
      console.error('Check payment error:', err)
      if (isManual) setStatus('waiting')
    }
  }, [orderCode, status, router])

  // ─── Auto polling mỗi 5 giây ─────────────────────────────
  useEffect(() => {
    if (!orderCode || !autoChecking) return

    // Kiểm tra ngay khi load
    checkPayment()

    intervalRef.current = setInterval(() => {
      setPollingCount((prev) => {
        const next = prev + 1
        if (next >= maxPolls) {
          setAutoChecking(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        return next
      })
      checkPayment()
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [orderCode, autoChecking]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Copy nội dung chuyển khoản ──────────────────────────
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  // ─── Redirect nếu không có orderCode ─────────────────────
  if (!orderCode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h2 className="text-xl font-bold">Không tìm thấy thông tin đơn hàng</h2>
        <Link href="/checkout" className="text-brand-primary font-bold underline text-sm">
          Quay lại thanh toán
        </Link>
      </div>
    )
  }

  // ─── Màn hình thành công ──────────────────────────────────
  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 w-full text-center space-y-8 flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-2xl scale-150" />
          <div className="relative z-10 w-28 h-28 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Thanh toán thành công!
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Đã nhận thanh toán! 🎉
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Cửa hàng đã nhận được thanh toán của bạn và đang chuẩn bị đơn hàng. Trang sẽ tự động chuyển về trang chủ sau vài giây.
          </p>
        </div>

        <div className="w-full p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2 max-w-sm">
          <div className="flex justify-between text-xs">
            <span className="text-emerald-700 font-medium">Mã đơn hàng:</span>
            <span className="font-bold font-mono text-emerald-900">{orderCode}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-emerald-700 font-medium">Số tiền:</span>
            <span className="font-bold text-emerald-900">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md text-sm"
          >
            Về trang chủ
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  // ─── Màn hình chờ thanh toán ──────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight">Thanh toán chuyển khoản</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Quét mã QR hoặc chuyển khoản thủ công để hoàn tất đơn hàng
          </p>
        </div>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>
      </div>

      {/* Banner tự động */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <div className="flex-shrink-0">
          {autoChecking ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <Clock className="w-5 h-5 text-zinc-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
            {autoChecking
              ? `🔄 Đang tự động kiểm tra thanh toán... (Kiểm tra ${pollingCount}/${maxPolls})`
              : '⏱️ Đã hết thời gian tự động kiểm tra. Nhấn nút bên dưới để kiểm tra thủ công.'}
          </p>
          {lastChecked && (
            <p className="text-[10px] text-blue-600/70 dark:text-blue-400/60 mt-0.5">
              Lần kiểm tra cuối: {lastChecked.toLocaleTimeString('vi-VN')}
            </p>
          )}
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Cột trái: QR Code */}
        <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-5 flex flex-col items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 self-start">
            Quét mã QR
          </h2>

          {/* QR Code VietQR */}
          <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 p-2 bg-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR thanh toán đơn hàng ${orderCode}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Được tạo bởi</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-sm text-[#c89b3c]">SePay QR Code</span>
            </div>
            <p className="text-[10px] text-zinc-400 max-w-[200px]">
              Tự động xác nhận thanh toán tức thì qua ngân hàng
            </p>
          </div>

          {/* Nút kiểm tra */}
          <button
            onClick={() => checkPayment(true)}
            disabled={status === 'checking'}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {status === 'checking' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang kiểm tra...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Kiểm tra trạng thái thanh toán
              </>
            )}
          </button>
        </div>

        {/* Cột phải: Thông tin chuyển khoản */}
        <div className="space-y-4">
          {/* Hóa đơn */}
          <div className="p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Thông tin chuyển khoản
            </h2>

            <div className="space-y-3">
              {/* Ngân hàng */}
              <InfoRow label="Ngân hàng" value="Vietinbank" />

              {/* Chủ tài khoản */}
              <InfoRow label="Chủ tài khoản" value={BANK_CONFIG.accountName} />

              {/* Số tài khoản */}
              <InfoRowCopyable
                label="Số tài khoản"
                value={BANK_CONFIG.accountNo}
                onCopy={handleCopy}
              />

              {/* Số tiền */}
              <InfoRowCopyable
                label="Số tiền"
                value={formatCurrency(amount)}
                rawValue={String(amount)}
                onCopy={handleCopy}
                highlight
              />

              {/* Nội dung chuyển khoản */}
              <InfoRowCopyable
                label="Nội dung CK ⚠️"
                value={memoText}
                onCopy={handleCopy}
                highlight
                note="Nhập chính xác để hệ thống tự xác nhận"
              />
            </div>
          </div>

          {/* Mã đơn hàng */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 space-y-1">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
              🧾 Mã đơn hàng
            </p>
            <p className="font-mono font-black text-amber-900 dark:text-amber-300 text-lg tracking-wider">
              {orderCode}
            </p>
          </div>

          {/* Lưu ý */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">⚠️ Lưu ý quan trọng</p>
            <ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <li>• Nhập đúng <strong>nội dung chuyển khoản</strong> để hệ thống tự xác nhận</li>
              <li>• Chuyển khoản đúng <strong>số tiền</strong> trên hóa đơn</li>
              <li>• Hệ thống tự động xác nhận trong <strong>vài giây</strong> sau khi chuyển khoản</li>
              <li>• Nếu không tự động, bấm <strong>&quot;Kiểm tra trạng thái&quot;</strong> hoặc gọi <strong>038 972 6999</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-900 last:border-0">
      <span className="text-xs text-zinc-400 font-medium">{label}</span>
      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{value}</span>
    </div>
  )
}

function InfoRowCopyable({
  label, value, rawValue, onCopy, highlight, note
}: {
  label: string
  value: string
  rawValue?: string
  onCopy: (text: string) => void
  highlight?: boolean
  note?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    const textToCopy = rawValue || value
    onCopy(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`py-2.5 border-b border-zinc-100 dark:border-zinc-900 last:border-0 ${highlight ? 'bg-brand-primary/5 -mx-2 px-2 rounded-lg' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${highlight ? 'text-brand-primary' : 'text-zinc-800 dark:text-zinc-200'} font-mono`}>
            {value}
          </span>
          <button
            onClick={handleClick}
            className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Copy"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>
        </div>
      </div>
      {note && (
        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">{note}</p>
      )}
    </div>
  )
}
