"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageTitles: Record<string, string> = {
  "/super-admin": "Dashboard",
  "/super-admin/analytics": "Analytics",
  "/super-admin/reports": "Reports",
  "/super-admin/users": "Users & Brokers",
  "/super-admin/users/brokers": "Brokers",
  "/super-admin/users/roles": "Roles",
  "/super-admin/properties": "Properties",
  "/super-admin/properties/pending": "Pending Approval",
  "/super-admin/properties/categories": "Categories",
  "/super-admin/vehicles": "Vehicles",
  "/super-admin/vehicles/pending": "Pending Approval",
  "/super-admin/vehicles/categories": "Categories",
  "/super-admin/escrow": "Escrow Vault",
  "/super-admin/payments": "Payments API",
  "/super-admin/payments/evc": "EVC Plus",
  "/super-admin/payments/zaad": "Zaad",
  "/super-admin/settings": "Settings",
  "/super-admin/settings/security": "Security",
  "/super-admin/settings/notifications": "Notifications",
  "/super-admin/map": "Location Map",
  "/super-admin/logs": "Activity Logs",
};

export function SuperAdminBreadcrumb() {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] ?? "Data Fetching";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
