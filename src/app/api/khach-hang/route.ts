import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('thong_tin_khach_hang')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error("Error in /api/khach-hang endpoint:", err)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải thông tin khách hàng' }, { status: 500 })
  }
}
