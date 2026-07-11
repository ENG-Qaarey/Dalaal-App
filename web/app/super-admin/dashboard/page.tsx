import {
  DollarSign,
  Users,
  Home,
  Car,
  ShieldCheck,
  TrendingUp,
  Activity,
  CreditCard,
} from "lucide-react";

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
];

const quickActions = [
  { label: "View Reports", icon: TrendingUp, href: "/super-admin/reports", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
  { label: "System Health", icon: Activity, href: "/super-admin/monitoring", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
  { label: "Manage Subscriptions", icon: CreditCard, href: "/super-admin/subscriptions", color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40" },
  { label: "All Vehicles", icon: Car, href: "/super-admin/vehicles", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Overview of the Dalaal platform performance and key metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{kpi.value}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{kpi.title}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { text: "New listing submitted for review", time: "2 min ago", color: "bg-blue-500" },
            { text: "Escrow release completed - $4,200", time: "15 min ago", color: "bg-emerald-500" },
            { text: "User verified: Mustafa Ali (Broker)", time: "1 hr ago", color: "bg-violet-500" },
            { text: "Payment received via EVC+ - $850", time: "2 hr ago", color: "bg-amber-500" },
            { text: "New user registration: khadra@example.com", time: "3 hr ago", color: "bg-sky-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
              <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">{item.text}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
