import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Heart, Search } from "lucide-react"

const savedProperties = [
  { id: 1, title: "Luxury Villa in KM", price: "$250,000", location: "Mogadishu", beds: 4, baths: 3, sqft: "3,200" },
  { id: 2, title: "Apartment Downtown", price: "$85,000", location: "Mogadishu", beds: 2, baths: 1, sqft: "1,100" },
  { id: 3, title: "Beach House", price: "$180,000", location: "Kismayo", beds: 3, baths: 2, sqft: "2,400" },
  { id: 4, title: "Office Space", price: "$120,000", location: "Hargeisa", beds: 0, baths: 2, sqft: "1,800" },
]

export default function SavedPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <Head><title>Saved Properties | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Saved Properties</h1>
            <p className="text-sm text-muted-foreground">Properties you've saved for later</p>
          </div>
          <a href="/properties" className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-all hover:bg-muted">
            <Search className="size-4" />
            Browse More
          </a>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved properties..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedProperties.map((prop) => (
            <div key={prop.id} className="group rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="relative h-40 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center">
                <div className="absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-rose-500 shadow-sm">
                  <Heart className="size-4 fill-rose-500" />
                </div>
                <Building2 className="size-12 text-sky-500/40" />
              </div>
              <div className="p-4">
                <p className="font-semibold">{prop.title}</p>
                <p className="text-xs text-muted-foreground">{prop.location}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{prop.beds} beds</span>
                  <span>{prop.baths} baths</span>
                  <span>{prop.sqft} sqft</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-sky-500">{prop.price}</span>
                  <button className="text-xs font-semibold text-muted-foreground hover:text-sky-500">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  )
}