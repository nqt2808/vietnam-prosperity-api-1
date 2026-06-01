'use client'

import React, { useState, useEffect } from 'react'
import { useCartStore } from '@/features/cart/cart-store'

export function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [mounted, setMounted] = useState(false)
  const [activeHash, setActiveHash] = useState('#home')

  useEffect(() => {
    setMounted(true)

    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#home')
    }
    
    window.addEventListener('hashchange', handleHashChange)
    // Initial check
    handleHashChange()
    
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNav = (hash: string) => {
    window.location.hash = hash
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* High-Fidelity Dual Logo Block */}
        <div className="brand" onClick={() => handleNav('home')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              className="brand-logo vpc" 
              src="https://res.cloudinary.com/dojibbcof/image/upload/v1779774653/vpc-removebg-preview_h74zpx.png" 
              alt="Vietnam Prosperity Coffee Logo" 
            />
            <img 
              className="brand-logo tn" 
              src="https://res.cloudinary.com/dojibbcof/image/upload/v1779774577/z7667468160241_2e65fa10d3f27cb8fa134d19335ef00a_no4b9r.jpg" 
              alt="Trung Nguyên Legend Logo" 
            />
          </div>
          <div className="brand-text">
            <strong>Vietnam Prosperity Coffee</strong>
            <span>Trung Nguyên Legend Âu Lạc</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="main-nav">
          <button 
            className={`nav-btn ${activeHash === '#home' ? 'active' : ''}`} 
            onClick={() => handleNav('home')}
          >
            Trang chủ
          </button>
          <button 
            className={`nav-btn ${activeHash === '#menu' ? 'active' : ''}`} 
            onClick={() => handleNav('menu')}
          >
            Menu đồ uống
          </button>
          <button 
            className={`nav-btn ${activeHash === '#merchandise' ? 'active' : ''}`} 
            onClick={() => handleNav('merchandise')}
          >
            Vật phẩm
          </button>
          <button 
            className={`nav-btn ${activeHash === '#blog' ? 'active' : ''}`} 
            onClick={() => handleNav('blog')}
          >
            Bài viết
          </button>
          <button 
            className={`nav-btn ${activeHash === '#contact' ? 'active' : ''}`} 
            onClick={() => handleNav('contact')}
          >
            Liên hệ
          </button>
          <button 
            className={`nav-btn ${activeHash === '#lookup' ? 'active' : ''}`} 
            onClick={() => handleNav('lookup')}
          >
            Tra cứu đơn
          </button>
          <button 
            className={`nav-btn ${activeHash === '#cart' ? 'active' : ''}`} 
            onClick={() => handleNav('cart')}
          >
            🛒 Giỏ hàng
            {mounted && (
              <span className="cart-count" id="cartCount">
                {getTotalItems()}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
