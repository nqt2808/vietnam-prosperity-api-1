import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('sepay_transactions')
      .select('*')
      .order('transaction_date', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error("❌ Failed to fetch SePay transactions for admin:", err)
    return NextResponse.json(
      { error: err.message || 'Lỗi hệ thống khi tải lịch sử giao dịch SePay' },
      { status: 500 }
    )
  }
}
