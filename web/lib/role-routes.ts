export const ROLE_HOME: Record<string, string> = {
  SUPER_ADMIN: "/pages/admin",
  MODERATOR: "/pages/admin",
  BROKER: "/pages/broker",
  PROPERTY_OWNER: "/pages/owner",
  VEHICLE_OWNER: "/pages/owner",
  REGULAR_DALAAL: "/pages/broker",
  VERIFIED_DALAAL: "/pages/broker",
  CUSTOMER: "/pages/customer",
};

export const ROLE_ROUTES: Record<string, string[]> = {
  SUPER_ADMIN: ["/pages/admin"],
  MODERATOR: ["/pages/admin"],
  BROKER: ["/pages/broker"],
  PROPERTY_OWNER: ["/pages/owner"],
  VEHICLE_OWNER: ["/pages/owner"],
  REGULAR_DALAAL: ["/pages/broker"],
  VERIFIED_DALAAL: ["/pages/broker"],
  CUSTOMER: ["/pages/customer"],
};
