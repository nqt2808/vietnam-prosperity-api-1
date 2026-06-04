import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  try {
    const htmlPath = path.join(process.cwd(), 'index.html')
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
