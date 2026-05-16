import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Plus, Search } from "lucide-react"

const properties = [
  { id: 1, title: "Luxury Villa in KM", price: "$250,000", status: "Active", views: 156, inquiries: 8, location: "Mogadishu" },
  { id: 2, title: "Apartment Downtown", price: "$85,000", status: "Active", views: 89, inquiries: 5, location: "Mogadishu" },
  { id: 3, title: "Beach House", price: "$180,000", status: "Pending", views: 234, inquiries: 12, location: "Kismayo" },
  { id: 4, title: "Office Space", price: "$120,000", status: "Sold", views: 67, inquiries: 3, location: "Hargeisa" },
]

export default function PropertiesPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <Head><title>My Properties | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">My Properties</h1>
            <p className="text-sm text-muted-foreground">Manage your listings and track performance</p>
          </div>
          <a href="/dashboard/properties/new" className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
            <Plus className="size-4" />
            Add Property
          </a>
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Views</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inquiries</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold">{prop.title}</p>
                      <p className="text-xs text-muted-foreground">{prop.location}</p>
                    </div>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}