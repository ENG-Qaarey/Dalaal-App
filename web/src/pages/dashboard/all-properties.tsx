import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Search, MoreHorizontal, Building2 } from "lucide-react"

const allProperties = [
  { id: 1, title: "Luxury Villa in KM", price: "$250,000", status: "Active", broker: "Ahmed Farah", location: "Mogadishu", views: 156, inquiries: 8 },
  { id: 2, title: "Apartment Downtown", price: "$85,000", status: "Active", broker: "Ahmed Farah", location: "Mogadishu", views: 89, inquiries: 5 },
  { id: 3, title: "Beach House", price: "$180,000", status: "Pending", broker: "Xaliimo Axmed", location: "Kismayo", views: 234, inquiries: 12 },
  { id: 4, title: "Office Space", price: "$120,000", status: "Sold", broker: "Khadra Cumar", location: "Hargeisa", views: 67, inquiries: 3 },
  { id: 5, title: "Family Home", price: "$95,000", status: "Active", broker: "Ahmed Farah", location: "Mogadishu", views: 112, inquiries: 7 },
  { id: 6, title: "Commercial Plaza", price: "$450,000", status: "Active", broker: "Xaliimo Axmed", location: "Hargeisa", views: 198, inquiries: 15 },
]

export default function AllPropertiesPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <Head><title>Access Denied | DalaalPrime</title></Head>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 className="size-16 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-sm text-muted-foreground mt-2">You don't have permission to view this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head><title>All Properties | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">All Properties</h1>
            <p className="text-sm text-muted-foreground">View and manage all property listings across the platform</p>
          </div>
          <button className="rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
            + Add Property
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search properties..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Broker</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Views</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inquiries</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProperties.map((prop) => (
                <tr key={prop.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold">{prop.title}</p>
                      <p className="text-xs text-muted-foreground">{prop.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{prop.broker}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      prop.status === "Active" ? "bg-emerald-500/10 text-emerald-600" :
                      prop.status === "Pending" ? "bg-amber-500/10 text-amber-600" :
                      "bg-red-500/10 text-red-600"
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{prop.views}</td>
                  <td className="px-4 py-3 text-sm">{prop.inquiries}</td>
                  <td className="px-4 py-3 font-semibold">{prop.price}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}