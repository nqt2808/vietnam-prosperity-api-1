import React from 'react'
import { getAdminStatsAction, getAdminOrdersAction, getAdminProductsAction } from '@/app/actions/admin-actions'
import { AdminClient } from '@/components/shared/admin-client'

export const revalidate = 0 // Luôn tải dữ liệu động mới nhất từ Database khi F5 trang admin

export default async function AdminPage() {
  let initialStats = {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalDrinks: 0,
    totalMerch: 0
  }
  let initialOrders: any[] = []
  let initialProducts: {
    drinks: any[]
    merchandise: any[]
    categories: any[]
  } = {
    drinks: [],
    merchandise: [],
    categories: []
  }

  try {
    // Gọi các Server Actions trực tiếp trên server để tải dữ liệu ban đầu cực nhanh
    const [statsRes, ordersRes, productsRes] = await Promise.all([
      getAdminStatsAction(),
      getAdminOrdersAction(),
      getAdminProductsAction()
    ])

    if (statsRes.success && statsRes.data) {
      initialStats = statsRes.data
    }
    if (ordersRes.success && ordersRes.data) {
      initialOrders = ordersRes.data
    }
    if (productsRes.success && productsRes.data) {
      initialProducts = productsRes.data
    }
  } catch (error) {
    console.error("Error loading server data for Admin:", error)
  }

  return (
    <AdminClient
      initialStats={initialStats}
      initialOrders={initialOrders}
      initialProducts={initialProducts}
    />
  )
}
