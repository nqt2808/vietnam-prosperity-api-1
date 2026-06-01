import { Mail, Phone, MapPin, Clock, Cpu } from 'lucide-react'

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TikTok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#170e0a] border-t border-[#decdb9]/15 text-[#fff8ed] py-16 mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 max-[520px]:px-2 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Cột 1: VPC Brand & Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src="https://drive.google.com/thumbnail?id=1_hzgMfrnLJU9w1-xF3b8D9tT_cyddse5&sz=w600"
              alt="Vietnam Prosperity Coffee Logo"
              className="object-contain w-auto opacity-95 transition-all duration-300"
              style={{ height: '86px', filter: 'brightness(0) invert(1)' }}
            />
            <img
              src="https://drive.google.com/thumbnail?id=1pUy1triN4IzzM2X9oEs5WSL7zL9eVEMh&sz=w600"
              alt="Trung Nguyên Legend Logo"
              className="object-contain w-auto opacity-95 transition-all duration-300"
              style={{ height: '86px', filter: 'brightness(0) invert(1)' }}
            />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[#c89b3c] text-xl font-black tracking-tight leading-snug">
              Vietnam Prosperity Coffee
            </h3>
            <p className="text-[#fff8ed] text-sm font-bold opacity-80">Since 2025</p>
          </div>

          <div className="space-y-2 text-xs text-[#e2d4c0] leading-relaxed max-w-md">
            <p>Bên nhận quyền thương hiệu Trung Nguyên Legend.</p>
            <p>Đơn vị vận hành cửa hàng và website Trung Nguyên Legend Âu Lạc.</p>
          </div>

          {/* Giờ mở cửa & Số điện thoại */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-9.5 h-9.5 rounded-full bg-[#c89b3c]/12 text-[#c89b3c] border border-[#c89b3c]/35 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-xs">
                <strong className="text-[#c89b3c] font-bold">Giờ mở cửa</strong>
                <span className="text-[#fff8ed] font-semibold opacity-90">06:30 AM - 09:30 PM</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9.5 h-9.5 rounded-full bg-[#c89b3c]/12 text-[#c89b3c] border border-[#c89b3c]/35 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-xs">
                <strong className="text-[#c89b3c] font-bold">Số điện thoại</strong>
                <a href="tel:0389726999" className="text-[#fff8ed] font-semibold opacity-90 hover:underline">
                  038 972 6999
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cột 2: Về chúng tôi */}
        <div className="md:col-span-3 space-y-5">
          <h4 className="text-[#c89b3c] text-sm font-black uppercase tracking-widest border-b border-[#decdb9]/15 pb-2">
            Về chúng tôi
          </h4>
          <ul className="space-y-3 text-xs font-bold tracking-wider uppercase">
            <li>
              <a href="#about" className="text-[#e2d4c0] hover:text-[#c89b3c] transition-colors">Giới thiệu</a>
            </li>
            <li>
              <a href="#contact" className="text-[#e2d4c0] hover:text-[#c89b3c] transition-colors">Thông tin liên hệ</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Mạng xã hội */}
        <div className="md:col-span-4 space-y-5">
          <h4 className="text-[#c89b3c] text-sm font-black uppercase tracking-widest border-b border-[#decdb9]/15 pb-2">
            Mạng xã hội
          </h4>
          <ul className="space-y-4 text-xs font-bold tracking-wider uppercase">
            <li>
              <a
                href="tel:0389726999"
                className="flex items-center gap-3 text-[#e2d4c0] hover:text-[#c89b3c] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#c89b3c]" />
                <span>Gọi ngay</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61576533039953"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#e2d4c0] hover:text-[#c89b3c] transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#c89b3c]" />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@vietnamprosperity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#e2d4c0] hover:text-[#c89b3c] transition-colors"
              >
                <TikTok className="w-4 h-4 text-[#c89b3c]" />
                <span>TikTok chính thức</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@hetcathidoiten"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#e2d4c0] hover:text-[#c89b3c] transition-colors"
              >
                <TikTok className="w-4 h-4 text-[#c89b3c]" />
                <span>TikTok cợt nhả</span>
              </a>
            </li>
            <li>
              <a
                href="https://maps.app.goo.gl/fPnBsNtPVix3nDZ38?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#e2d4c0] hover:text-[#c89b3c] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#c89b3c]" />
                <span>Google Map</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-[1600px] mx-auto px-4 max-[520px]:px-2 border-t border-[#decdb9]/15 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#a89882] font-semibold uppercase tracking-wider">
        <span>
          &copy; {currentYear} Vietnam Prosperity Coffee – Trung Nguyên Legend Âu Lạc Huế.
        </span>
      </div>
    </footer>
  )
}
