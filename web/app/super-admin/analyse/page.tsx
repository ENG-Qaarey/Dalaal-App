import {
  Users,
  Building2,
  Car,
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { RevenueTrendChart } from "@/components/admin/revenue-trend-chart";
import { ListingsBreakdownChart } from "@/components/admin/listings-breakdown-chart";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";
import { CityBreakdownChart } from "@/components/admin/city-breakdown-chart";

const metrics = [
  {
    label: "Total Users",
    value: "1,380",
    change: "+23.1%",
    trend: "up" as const,
    icon: Users,
    description: "vs last month",
  },
  {
    label: "Active Listings",
    value: "560",
    change: "+12.4%",
    trend: "up" as const,
    icon: Building2,
    description: "342 properties, 218 vehicles",
  },
  {
    label: "Escrow Volume",
    value: "$18,200",
    change: "+20.5%",
    trend: "up" as const,
    icon: Shield,
    description: "42 active escrows",
  },
  {
    label: "Conversion Rate",
    value: "4.8%",
    change: "-0.3%",
    trend: "down" as const,
    icon: TrendingUp,
    description: "listing views to leads",
  },
];

const topBrokers = [
  { name: "Ahmed Hassan", listings: 24, leads: 89, revenue: "$12,400" },
  { name: "Fadumo Omar", listings: 19, leads: 72, revenue: "$9,800" },
  { name: "Khadar Ali", listings: 16, leads: 58, revenue: "$7,200" },
  { name: "Yusuf Khalid", listings: 14, leads: 51, revenue: "$6,100" },
  { name: "Sahra Mohamud", listings: 11, leads: 43, revenue: "$4,900" },
];

function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  description,
}: (typeof metrics)[number]) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor =
    trend === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </h3>
        <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
        <span className={`inline-flex items-center gap-0.5 font-medium ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          {change}
        </span>
        {description}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm ${className}`}
    >
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <div className="p-6 pt-0">{children}</div>
    </div>
  );
}

export default function AnalysePage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Analyse
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Platform performance, listings, and revenue insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d", "1y"].map((period, i) => (
            <button
              key={period}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                i === 1
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Revenue & Escrow Trend"
          description="Monthly payment volume and escrow activity"
          className="md:col-span-2"
        >
          <RevenueTrendChart />
        </ChartCard>

        <ChartCard title="Listings by Type" description="Active property vs vehicle listings">
          <ListingsBreakdownChart />
        </ChartCard>

        <ChartCard title="User Growth" description="New users and verified brokers over time">
          <UserGrowthChart />
        </ChartCard>

        <ChartCard title="Listings by City" description="Top cities by active listings">
          <CityBreakdownChart />
        </ChartCard>

        <ChartCard title="Top Brokers" description="Highest performing brokers this month">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                    Broker
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">
                    Listings
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">
                    Leads
                  </th>
                  <th className="text-right py-3 pl-4 font-medium text-zinc-500 dark:text-zinc-400">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topBrokers.map((broker) => (
                  <tr
                    key={broker.name}
                    className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">{broker.name}</td>
                    <td className="py-3 px-4 text-right text-zinc-600 dark:text-zinc-400">
                      {broker.listings}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-600 dark:text-zinc-400">
                      {broker.leads}
                    </td>
                    <td className="py-3 pl-4 text-right font-medium">{broker.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 flex items-start gap-3">
        <Car className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Data shown is sample analytics. Connect to{" "}
          <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
            GET /api/admin/stats
          </code>{" "}
          and future time-series endpoints for live metrics.
        </p>
      </div>
    </div>
  );
}
