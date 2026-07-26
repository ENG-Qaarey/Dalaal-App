#!/usr/bin/env python3
"""Generate all 10 page.tsx files for broker and customer sub-pages."""

import os

BASE = r"D:\LocalD\All-MyTest\ICT-Project\Dalaal\web\app"

# ──────────────────────────────────────────────────────────────────────
# FILE 1 – pages/broker/listings/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE1_CONTENT = '''"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { BrokerSidebar } from "@/components/sidebar-broker"
import { PlusCircleIcon, ArrowUpDownIcon, EyeIcon, EditIcon, Trash2Icon, ImageIcon } from "lucide-react"
import Link from "next/link"

const mockListings = [
  { id: 1, title: "Modern Villa in Mogadishu", location: "Mogadishu, Banadir", price: 250000, status: "active", views: 142 },
  { id: 2, title: "Beachfront Apartment", location: "Kismayo, Jubaland", price: 180000, status: "pending", views: 89 },
  { id: 3, title: "Downtown Commercial Space", location: "Mogadishu, Banadir", price: 320000, status: "active", views: 210 },
  { id: 4, title: "Family Home with Garden", location: "Hargeisa, Somaliland", price: 95000, status: "draft", views: 34 },
  { id: 5, title: "Luxury Penthouse Suite", location: "Mogadishu, Banadir", price: 450000, status: "sold", views: 567 },
]
'''
const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  sold: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

export default function BrokerListingsPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<any[]>(mockListings)

  return (
    <SidebarProvider>
      <BrokerSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/pages/broker">Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbPage>My Listings</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">My Listings</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your property listings</p>
            </div>
            <Link
              href="/pages/broker/listings/create"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <PlusCircleIcon className="h-4 w-4" />
              Create Listing
            </Link>
          </div>

          {listings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No listings yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Create your first property listing to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">All Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Image</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground">
                            Title <ArrowUpDownIcon className="h-3 w-3" />
                          </span>
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground">
                            Location <ArrowUpDownIcon className="h-3 w-3" />
                          </span>
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground">
                            Price <ArrowUpDownIcon className="h-3 w-3" />
                          </span>
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground">
                            Status <ArrowUpDownIcon className="h-3 w-3" />
                          </span>
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Views</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr key={listing.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-2">
                            <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </td>
                          <td className="py-3 px-2 font-medium">{listing.title}</td>
                          <td className="py-3 px-2 text-muted-foreground">{listing.location}</td>
                          <td className="py-3 px-2"></td>
                          <td className="py-3 px-2">
                            <span className={inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize }>
                              {listing.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <EyeIcon className="h-3 w-3" />
                              {listing.views}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button className="rounded p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                <EditIcon className="h-4 w-4" />
                              </button>
                              <button className="rounded p-1.5 hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors">
                                <Trash2Icon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
'''


# ──────────────────────────────────────────────────────────────────────
# FILE 2 – pages/broker/listings/create/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE2_CONTENT = '''
 use client

import { useState } from react
import { useAuth } from @/lib/auth-context
import { api } from @/lib/api
import { useRouter } from next/navigation
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from @/components/ui/card
import { SidebarInset, SidebarProvider, SidebarTrigger } from @/components/ui/sidebar
import { Separator } from @/components/ui/separator
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from @/components/ui/breadcrumb
import { BrokerSidebar } from @/components/sidebar-broker
import { UploadIcon, Loader2Icon } from lucide-react
import Link from next/link

export default function CreateListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: ,
 description: ,
    price: ,
 location: ,
    propertyType: ,
 bedrooms: ,
    bathrooms: ,
 area: ,
    status: draft,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(/api/listings, {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
      })
      router.push(/pages/broker/listings)
    } catch (err) {
      console.error(Failed to create listing, err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <BrokerSidebar user={user} />
      <SidebarInset>
        <header className=flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12>
          <div className=flex items-center gap-2 px-4>
            <SidebarTrigger className=-ml-1 />
            <Separator orientation=vertical className=mr-2 data-vertical:h-4 data-vertical:self-auto />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href=/pages/broker>Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbLink href=/pages/broker/listings>My Listings</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbPage>Create</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className=flex flex-1 flex-col gap-4 p-4 pt-0>
          <div className=mt-4>
            <h1 className=text-2xl font-black>Create New Listing</h1>
            <p className=text-sm text-muted-foreground mt-1>Fill in the details below to create a new property listing.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className=grid gap-6 lg:grid-cols-2>
              <div className=space-y-6>
                <Card>
                  <CardHeader>
                    <CardTitle className=text-sm font-bold>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className=space-y-4>
                    <div>
                      <label className=text-sm font-medium block mb-1>Title</label>
                      <input
                        type=text
                        name=title
                        value={form.title}
                        onChange={handleChange}
                        required
                        className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
                        placeholder=e.g. Modern Villa in Mogadishu
                      />
                    </div>
                    <div>
                      <label className=text-sm font-medium block mb-1>Description</label>
                      <textarea
                        name=description
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y
                        placeholder=Describe your property...
                      />
                    </div>
                    <div className=grid grid-cols-2 gap-4>
                      <div>
                        <label className=text-sm font-medium block mb-1>Price ($)</label>
                        <input
                          type=number
                          name=price
                          value={form.price}
                          onChange={handleChange}
                          required
                          className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
                          placeholder=250000
                        />
                      </div>
                      <div>
                        <label className=text-sm font-medium block mb-1>Property Type</label>
                        <select
                          name=propertyType
                          value={form.propertyType}
                          onChange={handleChange}
                          required
                          className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
                        >
                          <option value=>Select type</option>
 <option value=House>House</option>
 <option value=Apartment>Apartment</option>
 <option value=Villa>Villa</option>
 <option value=Commercial>Commercial</option>
 <option value=Land>Land</option>
 </select>
 </div>
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Location</label>
 <input
 type=text
 name=location
 value={form.location}
 onChange={handleChange}
 required
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 placeholder=e.g. Mogadishu Banadir
 />
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle className=text-sm font-bold>Specifications</CardTitle>
 </CardHeader>
 <CardContent>
 <div className=grid grid-cols-3 gap-4>
 <div>
 <label className=text-sm font-medium block mb-1>Bedrooms</label>
 <input
 type=number
 name=bedrooms
 value={form.bedrooms}
 onChange={handleChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 placeholder=3
 />
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Bathrooms</label>
 <input
 type=number
 name=bathrooms
 value={form.bathrooms}
 onChange={handleChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 placeholder=2
 />
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Area (sq ft)</label>
 <input
 type=number
 name=area
 value={form.area}
 onChange={handleChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 placeholder=2000
 />
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 <div className=space-y-6>
 <Card>
 <CardHeader>
 <CardTitle className=text-sm font-bold>Images</CardTitle>
 <CardDescription className=text-xs>Upload property images (max 5)</CardDescription>
 </CardHeader>
 <CardContent>
 <div className=flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-10 transition-colors hover:border-blue-500/50>
 <UploadIcon className=h-10 w-10 text-muted-foreground mb-3 />
 <p className=text-sm font-medium text-muted-foreground>Drag &amp; drop images here</p>
 <p className=text-xs text-muted-foreground mt-1>or click to browse</p>
 <button
 type=button
 className=mt-3 rounded-md bg-muted px-4 py-1.5 text-sm font-medium hover:bg-muted/80 transition-colors
 >
 Browse Files
 </button>
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle className=text-sm font-bold>Publish Settings</CardTitle>
 </CardHeader>
 <CardContent>
 <div>
 <label className=text-sm font-medium block mb-1>Status</label>
 <select
 name=status
 value={form.status}
 onChange={handleChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 >
 <option value=draft>Draft</option>
 <option value=active>Publish</option>
 </select>
 </div>
 </CardContent>
 </Card>

 <div className=flex items-center gap-3>
 <button
 type=submit
 disabled={loading}
 className=inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors
 >
 {loading && <Loader2Icon className=h-4 w-4 animate-spin />}
 {loading ? Creating... : Create Listing}
 </button>
 <Link
 href=/pages/broker/listings
 className=rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors
 >
 Cancel
 </Link>
 </div>
 </div>
 </div>
 </form>
 </div>
 </SidebarInset>
 </SidebarProvider>
 )
}
'''


# ──────────────────────────────────────────────────────────────────────
# FILE 3 – pages/broker/clients/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE3_CONTENT = ''' use client

import { useState } from react
import { useAuth } from @/lib/auth-context
import { Card, CardContent, CardHeader, CardTitle } from @/components/ui/card
import { SidebarInset, SidebarProvider, SidebarTrigger } from @/components/ui/sidebar
import { Separator } from @/components/ui/separator
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from @/components/ui/breadcrumb
import { BrokerSidebar } from @/components/sidebar-broker
import { SearchIcon, MailIcon, PhoneIcon, MessageSquareIcon, UsersIcon } from lucide-react

const mockClients = [
  { id: 1, name: Ahmed Hassan, email: ahmed.hassan@email.com, phone: +252 61 234 5678, inquiries: 3, lastContact: 2 days ago },
  { id: 2, name: Fartun Ali, email: fartun.ali@email.com, phone: +252 68 876 5432, inquiries: 5, lastContact: 1 week ago },
  { id: 3, name: Mohamed Osman, email: mohamed.osman@email.com, phone: +252 65 112 2334, inquiries: 1, lastContact: Today },
  { id: 4, name: Hawa Ibrahim, email: hawa.ibrahim@email.com, phone: +252 61 445 5667, inquiries: 2, lastContact: 3 days ago },
  { id: 5, name: Abdirahman Jama, email: abdirahman.jama@email.com, phone: +252 68 998 8776, inquiries: 7, lastContact: Yesterday },
  { id: 6, name: Safia Mohamed, email: safia.mohamed@email.com, phone: +252 65 334 4556, inquiries: 4, lastContact: 5 days ago },
]

export default function BrokerClientsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState()

 const filtered = mockClients.filter((c) =>
 c.name.toLowerCase().includes(search.toLowerCase()) ||
 c.email.toLowerCase().includes(search.toLowerCase()) ||
 c.phone.includes(search)
 )

 return (
 <SidebarProvider>
 <BrokerSidebar user={user} />
 <SidebarInset>
 <header className=flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12>
 <div className=flex items-center gap-2 px-4>
 <SidebarTrigger className=-ml-1 />
 <Separator orientation=vertical className=mr-2 data-vertical:h-4 data-vertical:self-auto />
 <Breadcrumb>
 <BreadcrumbList>
 <BreadcrumbItem><BreadcrumbLink href=/pages/broker>Dashboard</BreadcrumbLink></BreadcrumbItem>
 <BreadcrumbItem><BreadcrumbPage>My Clients</BreadcrumbPage></BreadcrumbItem>
 </BreadcrumbList>
 </Breadcrumb>
 </div>
 </header>
 <div className=flex flex-1 flex-col gap-4 p-4 pt-0>
 <div className=mt-4>
 <h1 className=text-2xl font-black>My Clients</h1>
 <p className=text-sm text-muted-foreground mt-1>Manage your client relationships</p>
 </div>

 <div className=relative>
 <SearchIcon className=absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground />
 <input
 type=text
 placeholder=Search clients...
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className=w-full max-w-sm rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>

 {filtered.length === 0 ? (
 <Card>
 <CardContent className=flex flex-col items-center justify-center py-12>
 <UsersIcon className=h-12 w-12 text-muted-foreground mb-4 />
 <h3 className=text-lg font-semibold text-muted-foreground>No clients found</h3>
 <p className=text-sm text-muted-foreground mt-1>Try adjusting your search terms.</p>
 </CardContent>
 </Card>
 ) : (
 <Card>
 <CardHeader>
 <CardTitle className=text-sm font-bold>All Clients ({filtered.length})</CardTitle>
 </CardHeader>
 <CardContent>
 <div className=overflow-x-auto>
 <table className=w-full text-sm>
 <thead>
 <tr className=border-b>
 <th className=text-left py-3 px-2 font-medium text-muted-foreground>Name</th>
 <th className=text-left py-3 px-2 font-medium text-muted-foreground>Email</th>
 <th className=text-left py-3 px-2 font-medium text-muted-foreground>Phone</th>
 <th className=text-left py-3 px-2 font-medium text-muted-foreground>Inquiries</th>
 <th className=text-left py-3 px-2 font-medium text-muted-foreground>Last Contact</th>
 </tr>
 </thead>
 <tbody>
 {filtered.map((client) => (
 <tr key={client.id} className=border-b last:border-b-0 hover:bg-muted/50 transition-colors>
 <td className=py-3 px-2 font-medium>{client.name}</td>
 <td className=py-3 px-2>
 <span className=inline-flex items-center gap-1.5 text-muted-foreground>
 <MailIcon className=h-3.5 w-3.5 />
 {client.email}
 </span>
 </td>
 <td className=py-3 px-2>
 <span className=inline-flex items-center gap-1.5 text-muted-foreground>
 <PhoneIcon className=h-3.5 w-3.5 />
 {client.phone}
 </span>
 </td>
 <td className=py-3 px-2>
 <span className=inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400>
 <MessageSquareIcon className=h-3 w-3 />
 {client.inquiries}
 </span>
 </td>
 <td className=py-3 px-2 text-muted-foreground>{client.lastContact}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 )}
 </div>
 </SidebarInset>
 </SidebarProvider>
 )
}
'''


# ──────────────────────────────────────────────────────────────────────
# FILE 4 – pages/broker/messages/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE4_CONTENT = ''' use client

import { useState } from react
import { useAuth } from @/lib/auth-context
import { Card, CardContent, CardHeader, CardTitle } from @/components/ui/card
import { SidebarInset, SidebarProvider, SidebarTrigger } from @/components/ui/sidebar
import { Separator } from @/components/ui/separator
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from @/components/ui/breadcrumb
import { BrokerSidebar } from @/components/sidebar-broker
import { MessageSquareIcon, SearchIcon } from lucide-react

const mockConversations = [
  { id: 1, name: Ahmed Hassan, lastMessage: Is the Modern Villa still available? Id like to schedule a viewing., time: 2m ago, unread: 2 },
 { id: 2, name: Fartun Ali, lastMessage: Thank you for the information. Ill discuss with my family and get back to you., time: 1h ago, unread: 0 },
  { id: 3, name: Mohamed Osman, lastMessage: Can you send me more photos of the Beachfront Apartment?, time: 3h ago, unread: 1 },
  { id: 4, name: Hawa Ibrahim, lastMessage: What is the minimum price for the Downtown Commercial Space?, time: Yesterday, unread: 0 },
  { id: 5, name: Abdirahman Jama, lastMessage: Im interested in the Family Home with Garden. Is it still on the market?, time: Yesterday, unread: 3 },
 { id: 6, name: Safia Mohamed, lastMessage: Great, Ill come by tomorrow at 10am for the viewing., time: 2 days ago, unread: 0 },
]

export default function BrokerMessagesPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState()

 const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0)

 const filtered = mockConversations.filter((c) =>
 c.name.toLowerCase().includes(search.toLowerCase()) ||
 c.lastMessage.toLowerCase().includes(search.toLowerCase())
 )

 const truncate = (text: string, max: number) =>
 text.length > max ? text.slice(0, max) + ... : text

 return (
 <SidebarProvider>
 <BrokerSidebar user={user} />
 <SidebarInset>
 <header className=flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12>
 <div className=flex items-center gap-2 px-4>
 <SidebarTrigger className=-ml-1 />
 <Separator orientation=vertical className=mr-2 data-vertical:h-4 data-vertical:self-auto />
 <Breadcrumb>
 <BreadcrumbList>
 <BreadcrumbItem><BreadcrumbLink href=/pages/broker>Dashboard</BreadcrumbLink></BreadcrumbItem>
 <BreadcrumbItem><BreadcrumbPage>Messages</BreadcrumbPage></BreadcrumbItem>
 </BreadcrumbList>
 </Breadcrumb>
 </div>
 </header>
 <div className=flex flex-1 flex-col gap-4 p-4 pt-0>
 <div className=mt-4>
 <h1 className=text-2xl font-black>Messages</h1>
 <p className=text-sm text-muted-foreground mt-1>
 {totalUnread > 0
 ? You have unread message
 : No unread messages}
 </p>
 </div>

 <div className=relative>
 <SearchIcon className=absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground />
 <input
 type=text
 placeholder=Search conversations...
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className=w-full max-w-sm rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>

 {filtered.length === 0 ? (
 <Card>
 <CardContent className=flex flex-col items-center justify-center py-12>
 <MessageSquareIcon className=h-12 w-12 text-muted-foreground mb-4 />
 <h3 className=text-lg font-semibold text-muted-foreground>No conversations yet</h3>
 <p className=text-sm text-muted-foreground mt-1>When clients reach out, their messages will appear here.</p>
 </CardContent>
 </Card>
 ) : (
 <Card>
 <CardHeader>
 <CardTitle className=text-sm font-bold>Conversations</CardTitle>
 </CardHeader>
 <CardContent className=p-0>
 <div className=divide-y>
 {filtered.map((conv) => (
 <div
 key={conv.id}
 className=flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors
 >
 <div className=flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-bold>
 {conv.name.split( ).map((n) => n[0]).join().slice(0, 2).toUpperCase()}
                      </div>
                      <div className= flex-1 min-w-0>
                        <div className=flex items-center justify-between>
                          <span className=text-sm font-medium>{conv.name}</span>
                          <span className=text-xs text-muted-foreground>{conv.time}</span>
                        </div>
                        <p className=text-sm text-muted-foreground truncate mt-0.5>
                          {truncate(conv.lastMessage, 60)}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <div className=flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white>
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
'''


# ──────────────────────────────────────────────────────────────────────
# FILE 5 – pages/broker/settings/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE5_CONTENT = ''' use client

import { useState } from react
import { useAuth } from @/lib/auth-context
import { api } from @/lib/api
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from @/components/ui/card
import { SidebarInset, SidebarProvider, SidebarTrigger } from @/components/ui/sidebar
import { Separator } from @/components/ui/separator
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from @/components/ui/breadcrumb
import { BrokerSidebar } from @/components/sidebar-broker
import { SaveIcon, Loader2Icon, LockIcon, UserIcon } from lucide-react

export default function BrokerSettingsPage() {
  const { user } = useAuth()
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState()

 const [profile, setProfile] = useState({
 firstName: user?.profile?.firstName || ,
    lastName: user?.profile?.lastName || ,
 email: user?.email || ,
    phone: user?.phone || ,
 company: ,
    bio: ,
 })

 const [passwords, setPasswords] = useState({
 current: ,
    newPass: ,
 confirm: ,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setPasswordError()
 }

 const saveProfile = async (e: React.FormEvent) => {
 e.preventDefault()
 setProfileSaving(true)
 setProfileSaved(false)
 try {
 await api.put(/api/profile, profile)
 setProfileSaved(true)
 setTimeout(() => setProfileSaved(false), 3000)
 } catch (err) {
 console.error(err)
 } finally {
 setProfileSaving(false)
 }
 }

 const updatePassword = async (e: React.FormEvent) => {
 e.preventDefault()
 if (passwords.newPass !== passwords.confirm) {
 setPasswordError(Passwords do not match)
 return
 }
 setPasswordSaving(true)
 setPasswordSaved(false)
 setPasswordError()
    try {
      await api.put(/api/password, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      })
      setPasswordSaved(true)
      setPasswords({ current: , newPass: , confirm:  })
 setTimeout(() => setPasswordSaved(false), 3000)
 } catch (err: any) {
 setPasswordError(err.message || Failed to update password)
 } finally {
 setPasswordSaving(false)
 }
 }

 return (
 <SidebarProvider>
 <BrokerSidebar user={user} />
 <SidebarInset>
 <header className=flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12>
 <div className=flex items-center gap-2 px-4>
 <SidebarTrigger className=-ml-1 />
 <Separator orientation=vertical className=mr-2 data-vertical:h-4 data-vertical:self-auto />
 <Breadcrumb>
 <BreadcrumbList>
 <BreadcrumbItem><BreadcrumbLink href=/pages/broker>Dashboard</BreadcrumbLink></BreadcrumbItem>
 <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
 </BreadcrumbList>
 </Breadcrumb>
 </div>
 </header>
 <div className=flex flex-1 flex-col gap-4 p-4 pt-0>
 <div className=mt-4>
 <h1 className=text-2xl font-black>Settings</h1>
 <p className=text-sm text-muted-foreground mt-1>Manage your account settings and preferences.</p>
 </div>

 <form onSubmit={saveProfile}>
 <Card>
 <CardHeader>
 <div className=flex items-center gap-2>
 <UserIcon className=h-5 w-5 text-muted-foreground />
 <CardTitle className=text-sm font-bold>Profile Information</CardTitle>
 </div>
 <CardDescription className=text-xs>Update your personal details</CardDescription>
 </CardHeader>
 <CardContent className=space-y-4>
 <div className=grid grid-cols-2 gap-4>
 <div>
 <label className=text-sm font-medium block mb-1>First Name</label>
 <input
 type=text
 name=firstName
 value={profile.firstName}
 onChange={handleProfileChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Last Name</label>
 <input
 type=text
 name=lastName
 value={profile.lastName}
 onChange={handleProfileChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>
 </div>
 <div className=grid grid-cols-2 gap-4>
 <div>
 <label className=text-sm font-medium block mb-1>Email</label>
 <input
 type=email
 name=email
 value={profile.email}
 onChange={handleProfileChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Phone</label>
 <input
 type=text
 name=phone
 value={profile.phone}
 onChange={handleProfileChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Company Name</label>
 <input
 type=text
 name=company
 value={profile.company}
 onChange={handleProfileChange}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 placeholder=Optional
 />
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Bio</label>
 <textarea
 name=bio
 value={profile.bio}
 onChange={handleProfileChange}
 rows={3}
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y
 placeholder=Tell us about yourself...
 />
 </div>
 <div className=flex items-center gap-3>
 <button
 type=submit
 disabled={profileSaving}
 className=inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors
 >
 {profileSaving ? <Loader2Icon className=h-4 w-4 animate-spin /> : <SaveIcon className=h-4 w-4 />}
 {profileSaving ? Saving... : Save Changes}
 </button>
 {profileSaved && (
 <span className=inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400>
 Profile saved successfully
 </span>
 )}
 </div>
 </CardContent>
 </Card>
 </form>

 <form onSubmit={updatePassword}>
 <Card>
 <CardHeader>
 <div className=flex items-center gap-2>
 <LockIcon className=h-5 w-5 text-muted-foreground />
 <CardTitle className=text-sm font-bold>Change Password</CardTitle>
 </div>
 <CardDescription className=text-xs>Update your account password</CardDescription>
 </CardHeader>
 <CardContent className=space-y-4>
 <div>
 <label className=text-sm font-medium block mb-1>Current Password</label>
 <input
 type=password
 name=current
 value={passwords.current}
 onChange={handlePasswordChange}
 required
 className=w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>
 <div className=grid grid-cols-2 gap-4>
 <div>
 <label className=text-sm font-medium block mb-1>New Password</label>
 <input
 type=password
 name=newPass
 value={passwords.newPass}
 onChange={handlePasswordChange}
 required
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>
 <div>
 <label className=text-sm font-medium block mb-1>Confirm New Password</label>
 <input
 type=password
 name=confirm
 value={passwords.confirm}
 onChange={handlePasswordChange}
 required
 className=w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500
 />
 </div>
 </div>
 {passwordError && (
 <p className=text-sm text-red-500>{passwordError}</p>
 )}
 <div className=flex items-center gap-3>
 <button
 type=submit
 disabled={passwordSaving}
 className=inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors
 >
 {passwordSaving ? <Loader2Icon className=h-4 w-4 animate-spin /> : <LockIcon className=h-4 w-4 />}
 {passwordSaving ? Updating... : Update Password}
 </button>
 {passwordSaved && (
 <span className=inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400>
 Password updated successfully
 </span>
 )}
 </div>
 </CardContent>
 </Card>
 </form>
 </div>
 </SidebarInset>
 </SidebarProvider>
 )
}
'''
# ──────────────────────────────────────────────────────────────────────
# FILE 6 – pages/customer/favorites/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE6_CONTENT = '''"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { CustomerSidebar } from "@/components/sidebar-customer"
import { HeartIcon, MapPinIcon, ImageIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"

const mockFavorites = [
  { id: 1, title: "Modern Villa in Mogadishu", location: "Mogadishu, Banadir", price: 250000, image: "" },
  { id: 2, title: "Beachfront Apartment", location: "Kismayo, Jubaland", price: 180000, image: "" },
  { id: 3, title: "Downtown Commercial Space", location: "Mogadishu, Banadir", price: 320000, image: "" },
  { id: 4, title: "Luxury Penthouse Suite", location: "Mogadishu, Banadir", price: 450000, image: "" },
]

export default function CustomerFavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>(mockFavorites)

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <SidebarProvider>
      <CustomerSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/pages/customer">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbPage>My Favorites</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4">
            <h1 className="text-2xl font-black">My Favorites</h1>
            <p className="text-sm text-muted-foreground mt-1">Properties you&apos;ve saved for later.</p>
          </div>

          {favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <HeartIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No favorites yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Start browsing properties and save your favorites!</p>
                <Link
                  href="/pages/customer/search"
                  className="mt-4 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  Browse Properties
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((property) => (
                <Card key={property.id} className="overflow-hidden group">
                  <div className="relative h-48 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <button
                      onClick={() => removeFavorite(property.id)}
                      className="absolute top-2 right-2 rounded-full bg-background/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      {property.location}
                    </p>
                    <p className="text-lg font-black text-emerald-600 mt-2"></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
'''
# ──────────────────────────────────────────────────────────────────────
# FILE 7 – pages/customer/messages/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE7_CONTENT = '''"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { CustomerSidebar } from "@/components/sidebar-customer"
import { MessageSquareIcon, SearchIcon } from "lucide-react"

const mockConversations = [
  { id: 1, name: "Hodan Abdi", lastMessage: "The Modern Villa is still available. Would you like to schedule a viewing?", time: "15m ago", unread: 1 },
  { id: 2, name: "Abdirahman Jama", lastMessage: "I've sent you the additional photos of the beachfront property.", time: "2h ago", unread: 0 },
  { id: 3, name: "Fatima Hassan", lastMessage: "The price is negotiable. Let me know your budget.", time: "5h ago", unread: 2 },
  { id: 4, name: "Mohamed Ali", lastMessage: "Sure, I can arrange a visit for tomorrow afternoon.", time: "Yesterday", unread: 0 },
  { id: 5, name: "Safia Yusuf", lastMessage: "The Downtown Commercial Space has been recently renovated.", time: "Yesterday", unread: 1 },
  { id: 6, name: "Omar Farah", lastMessage: "Thank you for your inquiry. I'll get back to you shortly.", time: "3 days ago", unread: 0 },
]

export default function CustomerMessagesPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState("")

  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0)

  const filtered = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "..." : text

  return (
    <SidebarProvider>
      <CustomerSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/pages/customer">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbPage>Messages</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4">
            <h1 className="text-2xl font-black">Messages</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totalUnread > 0
                ? You have  unread message
                : "No unread messages"}
            </p>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquareIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No conversations yet</h3>
                <p className="text-sm text-muted-foreground mt-1">When you message a broker, your conversations will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filtered.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-bold">
                        {conv.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{conv.name}</span>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {truncate(conv.lastMessage, 60)}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
'''
# ──────────────────────────────────────────────────────────────────────
# FILE 8 – pages/customer/bookings/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE8_CONTENT = '''"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { CustomerSidebar } from "@/components/sidebar-customer"
import { CalendarIcon, ClockIcon, HomeIcon, UserIcon } from "lucide-react"

const mockBookings = [
  { id: 1, property: "Modern Villa in Mogadishu", date: "2025-06-15", time: "10:00 AM", status: "confirmed", broker: "Hodan Abdi" },
  { id: 2, property: "Beachfront Apartment", date: "2025-06-18", time: "2:00 PM", status: "pending", broker: "Abdirahman Jama" },
  { id: 3, property: "Downtown Commercial Space", date: "2025-06-10", time: "11:30 AM", status: "confirmed", broker: "Fatima Hassan" },
  { id: 4, property: "Family Home with Garden", date: "2025-06-05", time: "9:00 AM", status: "cancelled", broker: "Mohamed Ali" },
  { id: 5, property: "Luxury Penthouse Suite", date: "2025-06-22", time: "3:00 PM", status: "pending", broker: "Safia Yusuf" },
]

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function CustomerBookingsPage() {
  const { user } = useAuth()
  const [bookings] = useState<any[]>(mockBookings)

  return (
    <SidebarProvider>
      <CustomerSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/pages/customer">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbPage>My Bookings</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4">
            <h1 className="text-2xl font-black">My Bookings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your property viewing appointments.</p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No bookings yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Schedule a property viewing to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Upcoming Viewings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><HomeIcon className="h-3.5 w-3.5" /> Property</span>
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> Date</span>
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" /> Time</span>
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" /> Broker</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-2 font-medium">{booking.property}</td>
                          <td className="py-3 px-2 text-muted-foreground">{booking.date}</td>
                          <td className="py-3 px-2 text-muted-foreground">{booking.time}</td>
                          <td className="py-3 px-2">
                            <span className={inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize }>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{booking.broker}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
'''
# ──────────────────────────────────────────────────────────────────────
# FILE 9 – pages/customer/settings/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE9_CONTENT = '''"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { CustomerSidebar } from "@/components/sidebar-customer"
import { SaveIcon, Loader2Icon, LockIcon, UserIcon, BellIcon } from "lucide-react"

export default function CustomerSettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  })

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  })

  const [passwordError, setPasswordError] = useState("")

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleNotification = (key: "email" | "sms") => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setPasswordError("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPass || passwords.confirm || passwords.current) {
      if (passwords.newPass !== passwords.confirm) {
        setPasswordError("Passwords do not match")
        return
      }
    }
    setSaving(true)
    setSaved(false)
    setPasswordError("")
    try {
      await api.put("/api/profile", profile)
      if (passwords.newPass) {
        await api.put("/api/password", {
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        })
      }
      setSaved(true)
      setPasswords({ current: "", newPass: "", confirm: "" })
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setPasswordError(err.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SidebarProvider>
      <CustomerSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/pages/customer">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4">
            <h1 className="text-2xl font-black">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account settings and preferences.</p>
          </div>

          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-sm font-bold">Profile Information</CardTitle>
                </div>
                <CardDescription className="text-xs">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-sm font-bold">Notification Preferences</CardTitle>
                </div>
                <CardDescription className="text-xs">Choose how we notify you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification("email")}
                    className={elative inline-flex h-6 w-11 items-center rounded-full transition-colors }
                  >
                    <span className={inline-block h-4 w-4 transform rounded-full bg-white transition-transform } />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates via SMS</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification("sms")}
                    className={elative inline-flex h-6 w-11 items-center rounded-full transition-colors }
                  >
                    <span className={inline-block h-4 w-4 transform rounded-full bg-white transition-transform } />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LockIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-sm font-bold">Change Password</CardTitle>
                </div>
                <CardDescription className="text-xs">Leave blank to keep current password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    className="w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPass"
                      value={passwords.newPass}
                      onChange={handlePasswordChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {saved && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Settings saved successfully
                </span>
              )}
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
'''
# ──────────────────────────────────────────────────────────────────────
# FILE 10 – pages/customer/search/page.tsx
# ──────────────────────────────────────────────────────────────────────
FILE10_CONTENT = '''"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { CustomerSidebar } from "@/components/sidebar-customer"
import { SearchIcon, MapPinIcon, ImageIcon, SlidersHorizontalIcon, RotateCcwIcon, BedDoubleIcon, BathIcon } from "lucide-react"

const mockProperties = [
  { id: 1, title: "Modern Villa in Mogadishu", location: "Mogadishu, Banadir", price: 250000, type: "Villa", bedrooms: 4, bathrooms: 3, area: 3500 },
  { id: 2, title: "Beachfront Apartment", location: "Kismayo, Jubaland", price: 180000, type: "Apartment", bedrooms: 2, bathrooms: 1, area: 1200 },
  { id: 3, title: "Downtown Commercial Space", location: "Mogadishu, Banadir", price: 320000, type: "Commercial", bedrooms: 0, bathrooms: 2, area: 2800 },
  { id: 4, title: "Family Home with Garden", location: "Hargeisa, Somaliland", price: 95000, type: "House", bedrooms: 3, bathrooms: 2, area: 1800 },
  { id: 5, title: "Luxury Penthouse Suite", location: "Mogadishu, Banadir", price: 450000, type: "Apartment", bedrooms: 5, bathrooms: 4, area: 4200 },
  { id: 6, title: "Agricultural Land Plot", location: "Beledweyne, Hirshabelle", price: 55000, type: "Land", bedrooms: 0, bathrooms: 0, area: 10000 },
]

export default function CustomerSearchPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    location: "",
  })

  const results = mockProperties.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.propertyType && p.type !== filters.propertyType) return false
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false
    if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false
    if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    return true
  })

  const clearFilters = () => {
    setFilters({ propertyType: "", minPrice: "", maxPrice: "", bedrooms: "", location: "" })
    setSearch("")
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <SidebarProvider>
      <CustomerSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/pages/customer">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbPage>Search Properties</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4">
            <h1 className="text-2xl font-black">Search Properties</h1>
            <p className="text-sm text-muted-foreground mt-1">Find your ideal property across Somalia.</p>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-bold">Filters</CardTitle>
                </div>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcwIcon className="h-3 w-3" />
                  Clear Filters
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="text-xs font-medium block mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Any</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder=""
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder=",000,000"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City, Region"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">
            {results.length === 0
              ? "No properties match your search criteria."
              : Showing  propert
            }
          </p>

          {results.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No results found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      {property.location}
                    </p>
                    <p className="text-lg font-black text-emerald-600 mt-2"></p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {property.bedrooms > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <BedDoubleIcon className="h-3.5 w-3.5" />
                          {property.bedrooms} bed
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <BathIcon className="h-3.5 w-3.5" />
                          {property.bathrooms} bath
                        </span>
                      )}
                      <span>{property.area.toLocaleString()} sq ft</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
'''
# ──────────────────────────────────────────────────────────────────────
# WRITE ALL FILES
# ──────────────────────────────────────────────────────────────────────
FILE_DEFS = [
    (r"pages\broker\listings\page.tsx",        FILE1_CONTENT),
    (r"pages\broker\listings\create\page.tsx",  FILE2_CONTENT),
    (r"pages\broker\clients\page.tsx",          FILE3_CONTENT),
    (r"pages\broker\messages\page.tsx",         FILE4_CONTENT),
    (r"pages\broker\settings\page.tsx",         FILE5_CONTENT),
    (r"pages\customer\favorites\page.tsx",      FILE6_CONTENT),
    (r"pages\customer\messages\page.tsx",       FILE7_CONTENT),
    (r"pages\customer\bookings\page.tsx",       FILE8_CONTENT),
    (r"pages\customer\settings\page.tsx",       FILE9_CONTENT),
    (r"pages\customer\search\page.tsx",         FILE10_CONTENT),
]

for rel_path, content in FILE_DEFS:
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\u2713  Created: {full}")

print("\n\u2705 All 10 page.tsx files generated successfully.")
