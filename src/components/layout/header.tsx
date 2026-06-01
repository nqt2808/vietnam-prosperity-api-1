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
      // Chuẩn hóa hash về chữ thường
      const hash = window.location.hash || '#home'
      setActiveHash(hash)
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
        {/* Brand Block */}
        <div className="brand" onClick={() => handleNav('home')}>
          <img 
            className="brand-logo vpc" 
            src="https://drive.google.com/thumbnail?id=1_hzgMfrnLJU9w1-xF3b8D9tT_cyddse5&sz=w600" 
            alt="Vietnam Prosperity Coffee Logo" 
          />
          <img 
            className="brand-logo tn" 
            src="https://drive.google.com/thumbnail?id=1pUy1triN4IzzM2X9oEs5WSL7zL9eVEMh&sz=w600" 
            alt="Trung Nguyên Legend Logo" 
          />
          <div className="brand-text">
            <strong>Vietnam Prosperity Coffee</strong>
            <span>Trung Nguyên Legend Âu Lạc</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="main-nav">
          <button 
            className={`nav-btn ${activeHash === '#menu' ? 'active' : ''}`} 
            onClick={() => handleNav('menu')}
          >
            Menu đồ uống
          </button>
          <button 
            className={`nav-btn ${activeHash === '#merch' || activeHash === '#merchandise' ? 'active' : ''}`} 
            onClick={() => handleNav('merch')}
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
            className={`nav-btn cart-icon-btn ${activeHash === '#cart' ? 'active' : ''}`} 
            onClick={() => handleNav('cart')}
            aria-label="Giỏ hàng"
          >
            <span className="cart-icon">🛒</span>
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
