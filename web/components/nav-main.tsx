'use client';
import React from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';

type AccentColor = 'blue' | 'emerald' | 'violet' | 'orange';

const accentMap: Record<AccentColor, { bar: string; activeBg: string; activeText: string; activeIconBg: string; activeIconText: string; subDot: string; subActiveText: string; subActiveBg: string; badge: string }> = {
  blue: {
    bar: 'bg-blue-500',
    activeBg: 'bg-blue-500/8',
    activeText: 'text-blue-600 dark:text-blue-400',
    activeIconBg: 'bg-blue-500/10',
    activeIconText: 'text-blue-600 dark:text-blue-400',
    subDot: 'bg-blue-500',
    subActiveText: 'text-blue-600 dark:text-blue-400',
    subActiveBg: 'bg-blue-500/8',
    badge: 'bg-blue-500 text-white',
  },
  emerald: {
    bar: 'bg-emerald-500',
    activeBg: 'bg-emerald-500/8',
    activeText: 'text-emerald-600 dark:text-emerald-400',
    activeIconBg: 'bg-emerald-500/10',
    activeIconText: 'text-emerald-600 dark:text-emerald-400',
    subDot: 'bg-emerald-500',
    subActiveText: 'text-emerald-600 dark:text-emerald-400',
    subActiveBg: 'bg-emerald-500/8',
    badge: 'bg-emerald-500 text-white',
  },
  violet: {
    bar: 'bg-violet-500',
    activeBg: 'bg-violet-500/8',
    activeText: 'text-violet-600 dark:text-violet-400',
    activeIconBg: 'bg-violet-500/10',
    activeIconText: 'text-violet-600 dark:text-violet-400',
    subDot: 'bg-violet-500',
    subActiveText: 'text-violet-600 dark:text-violet-400',
    subActiveBg: 'bg-violet-500/8',
    badge: 'bg-violet-500 text-white',
  },
  orange: {
    bar: 'bg-orange-500',
    activeBg: 'bg-orange-500/8',
    activeText: 'text-orange-600 dark:text-orange-400',
    activeIconBg: 'bg-orange-500/10',
    activeIconText: 'text-orange-600 dark:text-orange-400',
    subDot: 'bg-orange-500',
    subActiveText: 'text-orange-600 dark:text-orange-400',
    subActiveBg: 'bg-orange-500/8',
    badge: 'bg-orange-500 text-white',
  },
};

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
  items?: { title: string; url: string }[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function NavMain({
  sections,
  items,
  accentColor = 'blue',
}: {
  sections?: NavSection[];
  items?: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
  accentColor?: AccentColor;
}) {
  const pathname = usePathname();
  const accent = accentMap[accentColor];

  const navSections: NavSection[] = sections || [
    { label: 'Platform', items: (items || []).map(item => ({ ...item, icon: undefined })) },
  ];

  return (
    <div className="flex flex-col gap-0.5 px-2 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:items-center">
      {navSections.map((section, sIdx) => (
        <React.Fragment key={section.label}>
          {/* Section Label — hidden when collapsed */}
          <div className="px-3 pt-4 pb-1 group-data-[collapsible=icon]:hidden">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {section.label}
            </span>
          </div>

          {/* Nav Items */}
          {section.items.map((item) => {
            const isOpen =
              pathname === item.url ||
              (item.items?.some((sub) => sub.url === pathname) ?? false);

            const isActive =
              pathname === item.url ||
              item.items?.some((sub) => sub.url === pathname);

            const Icon = item.icon;

            return (
              <Collapsible key={item.title} defaultOpen={isOpen} className="group/collapsible">
                <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                  <CollapsibleTrigger asChild>
                    <Link href={item.url}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`
                          group/item relative rounded-[10px] h-9 px-3
                          transition-colors duration-150
                          group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                          ${isActive
                            ? `${accent.activeBg} ${accent.activeText}`
                            : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                          }
                        `}
                        tooltip={item.title}
                      >
                        {/* Active left accent bar */}
                        {isActive && (
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full ${accent.bar} group-data-[collapsible=icon]:hidden`} />
                        )}

                        {/* Icon */}
                        {Icon && (
                          <div className={`
                            flex items-center justify-center w-6 h-6 rounded-md shrink-0
                            transition-colors duration-150
                            ${isActive
                              ? `${accent.activeIconBg} ${accent.activeIconText}`
                              : 'text-sidebar-foreground/40 group-hover/item:text-sidebar-foreground/60'
                            }
                          `}>
                            <Icon className="w-4 h-4" />
                          </div>
                        )}

                        {/* Title — hidden when collapsed */}
                        <span className={`flex-1 text-[13px] font-medium group-data-[collapsible=icon]:hidden ${isActive ? 'font-semibold' : ''}`}>
                          {item.title}
                        </span>

                        {/* Badge — hidden when collapsed */}
                        {item.badge && item.badge > 0 && (
                          <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${accent.badge} group-data-[collapsible=icon]:hidden`}>
                            {item.badge}
                          </span>
                        )}

                        {/* Chevron — hidden when collapsed */}
                        {item.items && item.items.length > 0 && (
                          <ChevronRight className="ml-1 w-3.5 h-3.5 text-sidebar-foreground/30 transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                        )}
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleTrigger>

                  {/* Sub Items — hidden when collapsed */}
                  {item.items && item.items.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                                className={`
                                  rounded-[10px] h-8 pl-4 text-[12px] font-medium
                                  transition-colors duration-150
                                  ${isSubActive
                                    ? `${accent.subActiveBg} ${accent.subActiveText} font-semibold`
                                    : 'text-sidebar-foreground/50 hover:text-sidebar-foreground/80 hover:bg-sidebar-accent'
                                  }
                                `}
                              >
                                <Link href={subItem.url} className="flex items-center gap-2">
                                  <span className={`w-1 h-1 rounded-full shrink-0 ${isSubActive ? accent.subDot : 'bg-sidebar-foreground/20'}`} />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            );
          })}

          {/* Section Divider — hidden when collapsed */}
          {sIdx < navSections.length - 1 && (
            <div className="mx-3 mt-3 border-t border-sidebar-border group-data-[collapsible=icon]:hidden" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
