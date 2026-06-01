'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Search, Sun, Moon, Menu, X, Cpu } from 'lucide-react'
import { useCartStore } from '@/features/cart/cart-store'
import { CartDrawer } from '../shared/cart-drawer'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [mounted, setMounted] = useState(false)

  // Ensure hydration matches server
  useEffect(() => {
    setMounted(true)
    // Check local storage or prefers-color-scheme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Listen to scroll to add visual blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const navLinks = [
    { href: '#home', label: 'Trang chủ' },
    { href: '#menu', label: 'Menu đồ uống' },
    { href: '#merchandise', label: 'Vật phẩm' },
    { href: '#blog', label: 'Bài viết' },
    { href: '#contact', label: 'Liên hệ' },
    { href: '#lookup', label: 'Tra cứu đơn' }
  ]

  const [activeHash, setActiveHash] = useState('#home')

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#home')
    }
    window.addEventListener('hashchange', handleHashChange)
    // Initial check
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-[#170e0a] border-[#decdb9]/15 shadow-xl",
          isScrolled ? "py-2 backdrop-blur-md bg-[#170e0a]/95" : "py-3 bg-[#170e0a]"
        )}
      >
        <div className="max-w-[1600px] mx-auto px-4 max-[520px]:px-2 flex items-center justify-between">
          {/* High-Fidelity Dual Logo Block */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <img
                src="https://drive.google.com/thumbnail?id=1_hzgMfrnLJU9w1-xF3b8D9tT_cyddse5&sz=w600"
                alt="Vietnam Prosperity Coffee Logo"
                className="object-contain w-auto opacity-95 transition-all duration-300 h-[48px] max-[520px]:!h-[34px] max-[980px]:!h-[44px] md:!h-[90px] mr-[-4px]"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <img
                src="https://drive.google.com/thumbnail?id=1pUy1triN4IzzM2X9oEs5WSL7zL9eVEMh&sz=w600"
                alt="Trung Nguyên Legend Logo"
                className="object-contain w-auto opacity-95 transition-all duration-300 h-[38px] max-[520px]:!h-[26px] max-[980px]:!h-[34px] md:!h-[72px]"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            
            <div className="flex flex-col justify-center leading-tight">
              <strong className="text-[#c89b3c] text-[22px] max-[980px]:text-[16px] max-[520px]:text-[13px] font-black tracking-widest uppercase">
                VIETNAM PROSPERITY COFFEE
              </strong>
              <span className="text-[#fff8ed] text-[16px] max-[980px]:text-[12px] max-[520px]:hidden font-bold tracking-wider uppercase opacity-80">
                Trung Nguyên Legend Âu Lạc
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeHash === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs uppercase font-extrabold tracking-widest transition-all px-4 py-2 rounded-full",
                    isActive
                      ? "bg-[#c89b3c] text-[#1f120b] shadow-md shadow-[#c89b3c]/15"
                      : "text-[#fff8ed] hover:bg-[#1f120b] hover:text-[#c89b3c]"
                  )}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[#c89b3c]/20 text-[#fff8ed] hover:bg-[#1f120b] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#c89b3c]" /> : <Moon className="w-4 h-4 text-[#c89b3c]" />}
            </button>

            {/* Cart Icon - Switches directly to Cart tab */}
            <a
              href="#cart"
              className="p-2 rounded-full border border-[#c89b3c]/20 text-[#fff8ed] hover:bg-[#1f120b] transition-colors relative"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4 text-[#c89b3c]" />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#c89b3c] text-[9px] font-black text-[#1f120b] flex items-center justify-center ring-2 ring-[#170e0a]">
                  {getTotalItems()}
                </span>
              )}
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-full border border-[#c89b3c]/20 text-[#fff8ed] hover:bg-[#1f120b] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#170e0a] border-b border-[#decdb9]/15 absolute top-full left-0 right-0 py-6 px-6 flex flex-col gap-2.5 shadow-2xl">
            {navLinks.map((link) => {
              const isActive = activeHash === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-xs uppercase font-extrabold tracking-widest py-3 px-4 rounded-xl transition-all",
                    isActive ? "bg-[#c89b3c] text-[#1f120b]" : "text-[#fff8ed] hover:bg-[#1f120b]"
                  )}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        )}
      </header>
    </>
  )
}
