"use client"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { BrokerSidebar } from "@/components/sidebar-broker"
import { BarChart3Icon, PlusCircleIcon, UsersIcon, MessageSquareIcon, BanknoteIcon } from "lucide-react"

export default function BrokerDashboard() {
  const { user } = useAuth()
  const name = user?.profile?.firstName || user?.email?.split("@")[0] || "Broker"

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
                <BreadcrumbItem><BreadcrumbPage>Broker Dashboard</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4">
            <h1 className="text-2xl font-black">Welcome back, {name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your listings and connect with clients.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">My Listings</CardTitle>
                <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-black">0</div><p className="text-xs text-muted-foreground">Active listings</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">New Listing</CardTitle>
                <PlusCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-black">Create</div><p className="text-xs text-muted-foreground">Post a new listing</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">Clients</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-black">0</div><p className="text-xs text-muted-foreground">Active clients</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">Messages</CardTitle>
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-black">0</div><p className="text-xs text-muted-foreground">Active conversations</p></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Earnings Overview</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">No earnings data yet. Start listing to earn commissions.</p></CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
