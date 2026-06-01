'use client'

import React from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const handleNav = (hash: string) => {
    window.location.hash = hash
    // Kích hoạt hashchange event để storefront-client bắt được thay đổi trang
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Cột Logo & Giới thiệu */}
        <div className="footer-col" style={{ paddingTop: '0px' }}>
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                className="brand-logo vpc" 
                src="https://res.cloudinary.com/dojibbcof/image/upload/v1779774653/vpc-removebg-preview_h74zpx.png" 
                alt="VPC Logo" 
                style={{ height: '50px' }} 
              />
              <img 
                className="brand-logo tn" 
                src="https://res.cloudinary.com/dojibbcof/image/upload/v1779774577/z7667468160241_2e65fa10d3f27cb8fa134d19335ef00a_no4b9r.jpg" 
                alt="Trung Nguyên Logo" 
                style={{ height: '40px' }} 
              />
            </div>
            <div className="brand-text">
              <strong style={{ color: 'var(--gold-light)', fontSize: '15px', fontWeight: 800, textTransform: 'uppercase' }}>
                Vietnam Prosperity Coffee
              </strong>
              <span style={{ color: '#fff3df', fontSize: '11px' }}>
                Trung Nguyên Legend Âu Lạc
              </span>
            </div>
          </div>
          <p style={{ color: '#dac8ad', fontSize: '15px', lineHeight: 1.6, marginBottom: '22px' }}>
            Nơi hội tụ của 3 nền văn minh cà phê thế giới: Ottoman - Roman - Thiền. Không gian kết nối năng lượng, khơi nguồn sáng tạo trí tuệ tại Cố đô Huế.
          </p>
          <div className="social-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: '14px' }}>
            <a 
              className="social-link" 
              href="https://www.facebook.com/profile.php?id=61576533039953" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <span className="social-icon"><i className="fa-brands fa-facebook-f"></i></span>
            </a>
            <a 
              className="social-link" 
              href="https://www.tiktok.com/@vietnamprosperity" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <span className="social-icon"><i className="fa-brands fa-tiktok"></i></span>
            </a>
            <a 
              className="social-link" 
              href="tel:0389726999" 
              aria-label="Hotline"
            >
              <span className="social-icon"><i className="fa-solid fa-phone"></i></span>
            </a>
            <a 
              className="social-link" 
              href="mailto:vietnamprosperitycoffee@gmail.com" 
              aria-label="Email"
            >
              <span className="social-icon"><i className="fa-solid fa-envelope"></i></span>
            </a>
          </div>
        </div>

        {/* Cột Liên kết nhanh */}
        <div className="footer-col" style={{ paddingTop: '0px' }}>
          <h3 className="footer-title">Khám phá</h3>
          <div className="footer-links">
            <button 
              onClick={() => handleNav('home')} 
              style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => handleNav('menu')} 
              style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
            >
              Menu đồ uống
            </button>
            <button 
              onClick={() => handleNav('merchandise')} 
              style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
            >
              Vật phẩm cà phê
            </button>
            <button 
              onClick={() => handleNav('blog')} 
              style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
            >
              Bài viết & Sự kiện
            </button>
          </div>
        </div>

        {/* Cột Thông tin liên hệ */}
        <div className="footer-col" style={{ paddingTop: '0px' }}>
          <h3 className="footer-title">Thông tin</h3>
          <div className="footer-links" style={{ display: 'grid', gap: '12px' }}>
            <p style={{ color: '#fff4df', fontSize: '17px', margin: 0 }}>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>
              Khu TĐC Đông Nam Thủy An, An Cựu, TP. Huế
            </p>
            <p style={{ color: '#fff4df', fontSize: '17px', margin: 0 }}>
              <i className="fa-solid fa-clock" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>
              Mở cửa: 06:30 - 22:30 hàng ngày
            </p>
            <p style={{ color: '#fff4df', fontSize: '17px', margin: 0 }}>
              <i className="fa-solid fa-phone" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>
              Hotline: 038 972 6999
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <div className="container">
          © {currentYear} Vietnam Prosperity Coffee. Tất cả quyền được bảo lưu. Bản quyền thuộc về Trung Nguyên Legend Âu Lạc.
        </div>
      </div>
    </footer>
  )
}
