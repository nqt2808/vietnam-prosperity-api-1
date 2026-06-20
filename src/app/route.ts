import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  try {
    const adminPath = path.join(process.cwd(), 'admin.html')
    if (fs.existsSync(adminPath)) {
      const buf = fs.readFileSync(adminPath)
      if (buf[0] === 0xff && buf[1] === 0xfe) {
        const str = buf.toString('utf16le')
        fs.writeFileSync(adminPath, str, 'utf8')
        console.log("Next.js Route: Converted admin.html from UTF-16LE to UTF-8")
      }
    }

    const htmlPath = path.join(process.cwd(), 'index.html')
    const htmlBuf = fs.readFileSync(htmlPath)
    if (htmlBuf[0] === 0xff && htmlBuf[1] === 0xfe) {
      const str = htmlBuf.toString('utf16le')
      fs.writeFileSync(htmlPath, str, 'utf8')
      console.log("Next.js Route: Converted index.html from UTF-16LE to UTF-8")
    }

    const html = fs.readFileSync(htmlPath, 'utf8')
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  } catch (error: any) {
    console.error("Error serving index.html root:", error)
    return new NextResponse(`Lỗi tải trang chủ: ${error.message}`, { status: 500 })
  }
}
