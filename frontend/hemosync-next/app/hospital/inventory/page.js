'use client'
import NetworkInventory from '@/components/hospital/NetworkInventory'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Network Inventory</h1>
        <p className="text-slate text-sm mt-1">Real-time blood stock across affiliated blood banks</p>
      </div>
      <NetworkInventory expanded />
    </div>
  )
}
