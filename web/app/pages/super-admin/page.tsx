import {
  DollarSign,
  Users,
  Activity,
  CreditCard,
  Home,
  Car,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { VisitorsChart } from "@/components/admin/visitors-chart";
import { RecentSales } from "@/components/admin/recent-sales";
import { CustomersTable } from "@/components/admin/customers-table";

const kpis = [
  {
    title: "Total Revenue",
    value: "$124,750",
    change: "+18.4%",
    sub: "from last month",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    title: "Registered Users",
    value: "8,340",
    change: "+12.1%",
    sub: "new this month",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    title: "Active Listings",
    value: "3,215",
    change: "+5.7%",
    sub: "properties & vehicles",
    icon: Home,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    title: "Escrow Transactions",
    value: "1,048",
    change: "+22.3%",
    sub: "secured this month",
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    title: "Vehicle Rentals",
    value: "642",
    change: "+9.8%",
    sub: "active rentals",
    icon: Car,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/40",
  },
  {
    title: "Pending Approvals",
    value: "87",
    change: "-3 today",
    sub: "listings awaiting review",
    icon: Activity,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/40",
  },
  {
    title: "Payments Processed",
    value: "$89,320",
    change: "+14.2%",
    sub: "EVC Plus & Zaad",
    icon: CreditCard,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/40",
  },
  {
    title: "Platform Growth",
    value: "+34.5%",
    change: "YoY",
    sub: "year over year",
    icon: TrendingUp,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Full platform overview — Dalaal marketplace
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.title}
            className="rounded-xl border bg-card p-5 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {k.title}
              </span>
              <span className={`p-2 rounded-lg ${k.bg}`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </span>
            </div>
            <div className="text-2xl font-bold">{k.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{k.change}</span>{" "}
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        <div className="rounded-xl border bg-card shadow-sm lg:col-span-4 p-6">
          <VisitorsChart />
        </div>
        <div className="rounded-xl border bg-card shadow-sm lg:col-span-3">
          <div className="p-6 pb-0">
            <h3 className="font-semibold">Recent Transactions</h3>
            <p className="text-xs text-muted-foreground">
              265 transactions this month
            </p>
          </div>
          <div className="p-6 pt-2">
            <RecentSales />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <CustomersTable />
      </div>
    </div>
  );
}
