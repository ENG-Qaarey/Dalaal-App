"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

const pageTitles: Record<string, string> = {
  "/pages/super-admin": "Dashboard",
  "/pages/super-admin/analytics": "Analytics",
  "/pages/super-admin/reports": "Reports",
  "/pages/super-admin/users": "Users",
  "/pages/super-admin/users/brokers": "Brokers",
  "/pages/super-admin/users/roles": "Roles",
  "/pages/super-admin/properties": "Properties",
  "/pages/super-admin/properties/pending": "Pending Approval",
  "/pages/super-admin/properties/categories": "Categories",
  "/pages/super-admin/vehicles": "Vehicles",
  "/pages/super-admin/vehicles/pending": "Pending Approval",
  "/pages/super-admin/vehicles/categories": "Categories",
  "/pages/super-admin/escrow": "Escrow Vault",
  "/pages/super-admin/payments": "Payments",
  "/pages/super-admin/payments/evc": "EVC Plus",
  "/pages/super-admin/payments/zaad": "Zaad",
  "/pages/super-admin/settings": "Settings",
};

export function SuperAdminBreadcrumb() {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] ?? "Dashboard";

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
