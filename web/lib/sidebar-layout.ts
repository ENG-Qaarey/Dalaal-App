export const SIDEBAR_WIDTH = "w-56";
export const SIDEBAR_WIDTH_COMPACT = "w-48";
export const SIDEBAR_WIDTH_COLLAPSED = "w-16";
export const SIDEBAR_WIDTH_COLLAPSED_COMPACT = "w-14";

export const sidebarMargin = (collapsed: boolean, compact?: boolean) => {
  if (collapsed) return compact ? "lg:ml-14" : "lg:ml-16";
  return compact ? "lg:ml-48" : "lg:ml-56";
};
