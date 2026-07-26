export interface CompanyData {
  id: string;
  name: string;
  email: string;
  ownerName: string;
  customers: number;
  meters: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  plan: "PREMIUM" | "STANDARD" | "BASIC";
  avatar: string;
  revenue: string;
  growth: string;
}

export interface ActivityData {
  id: string;
  title: string;
  user: string;
  time: string;
  type: "company" | "customer" | "payment" | "meter" | "system";
}

export const mockCompanies: CompanyData[] = [
  {
    id: "COMP001",
    name: "BECO (Benaadir Electric)",
    email: "admin@beco.so",
    ownerName: "Abdi Hassan",
    customers: 28450,
    meters: 30250,
    status: "ACTIVE",
    plan: "PREMIUM",
    avatar: "B",
    revenue: "$285,450",
    growth: "+15.6%",
  },
  {
    id: "COMP002",
    name: "Daha Electric Company",
    email: "info@dahaelectric.so",
    ownerName: "Mohamed Ali",
    customers: 22150,
    meters: 23120,
    status: "ACTIVE",
    plan: "PREMIUM",
    avatar: "D",
    revenue: "$198,670",
    growth: "+12.3%",
  },
  {
    id: "COMP003",
    name: "SomPower Electric",
    email: "contact@sompower.so",
    ownerName: "Ahmed Ibrahim",
    customers: 18890,
    meters: 19870,
    status: "ACTIVE",
    plan: "STANDARD",
    avatar: "S",
    revenue: "$162,340",
    growth: "+10.8%",
  },
  {
    id: "COMP004",
    name: "Nugaal Electric",
    email: "admin@nugaalelectric.so",
    ownerName: "Hassan Omar",
    customers: 12230,
    meters: 13450,
    status: "ACTIVE",
    plan: "STANDARD",
    avatar: "N",
    revenue: "$98,120",
    growth: "+8.2%",
  },
  {
    id: "COMP005",
    name: "GEDO Electric",
    email: "info@gedoelectric.so",
    ownerName: "Yusuf Ahmed",
    customers: 9420,
    meters: 10250,
    status: "ACTIVE",
    plan: "BASIC",
    avatar: "G",
    revenue: "$72,440",
    growth: "+6.7%",
  },
];

export const mockRevenueSeries = [
  { month: "Jan", revenue: 60000 },
  { month: "Feb", revenue: 140000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 120000 },
  { month: "May", revenue: 170000 },
  { month: "Jun", revenue: 140000 },
  { month: "Jul", revenue: 190000 },
  { month: "Aug", revenue: 160000 },
  { month: "Sep", revenue: 210000 },
  { month: "Oct", revenue: 180000 },
  { month: "Nov", revenue: 240000 },
  { month: "Dec", revenue: 220000 },
];

export const mockRegistrationTrend = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 18 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 24 },
  { month: "May", count: 20 },
  { month: "Jun", count: 14 },
  { month: "Jul", count: 28 },
  { month: "Aug", count: 20 },
  { month: "Sep", count: 22 },
  { month: "Oct", count: 16 },
  { month: "Nov", count: 25 },
  { month: "Dec", count: 22 },
];

export const mockUserDistribution = [
  { name: "Company Owners", value: 24, percent: "0.0%", color: "#3b82f6" },
  { name: "Company Admins", value: 96, percent: "0.1%", color: "#06b6d4" },
  { name: "Employees", value: 1248, percent: "1.0%", color: "#eab308" },
  { name: "Meter Readers", value: 1156, percent: "0.9%", color: "#8b5cf6" },
  { name: "Customers", value: 128560, percent: "98.1%", color: "#0ea5e9" },
];

export const mockSystemStatus = [
  { name: "API Services", status: "OK" },
  { name: "Database", status: "OK" },
  { name: "Payment Gateway", status: "OK" },
  { name: "File Storage", status: "OK" },
  { name: "Backup System", status: "OK" },
  { name: "Notifications", status: "OK" },
  { name: "Chat Service", status: "OK" },
];

export const mockActivities: ActivityData[] = [
  { id: "1", title: "New company registered", user: "by System Owner", time: "10:30 AM", type: "company" },
  { id: "2", title: "New customer onboarded", user: "by BECO Admin", time: "10:15 AM", type: "customer" },
  { id: "3", title: "Payment of $4,200", user: "Company: SomPower Electric", time: "09:58 AM", type: "payment" },
  { id: "4", title: "New meter reader assigned", user: "Company: Daha Electric", time: "09:40 AM", type: "meter" },
  { id: "5", title: "System backup completed", user: "by System", time: "02:00 AM", type: "system" },
];
