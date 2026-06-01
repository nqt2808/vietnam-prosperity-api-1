'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Cpu, Mail, Lock, User, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    // Basic password validation
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        setErrorMessage(error.message)
      } else {
        setSuccessMessage('Đăng ký tài khoản thành công! Đang chuyển hướng...')
        setTimeout(() => {
          router.push('/login')
        }, 1200)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Background glow triggers */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-primary/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 rounded-3xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xl relative z-10 space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group justify-center">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white">
              <Cpu className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent">
              VPC STORE
            </span>
          </Link>
          <h2 className="text-2xl font-black tracking-tight pt-2">Tạo tài khoản mới</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Tham gia ngay để nhận ưu đãi và mua sắm dễ dàng</p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Họ và tên</label>
            <div className="relative">
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-hidden focus:border-brand-primary"
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Địa chỉ Email</label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-hidden focus:border-brand-primary"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Mật khẩu</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-hidden focus:border-brand-primary"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Xác nhận</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 focus:outline-hidden focus:border-brand-primary"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-sm"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
            ) : (
              <>
                Đăng ký tài khoản
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer options */}
        <div className="text-center text-xs text-zinc-500 pt-2">
          <span>Đã có tài khoản? </span>
          <Link href="/login" className="font-bold text-brand-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
