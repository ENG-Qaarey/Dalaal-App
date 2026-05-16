"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"
import { Button } from "@/components/ui/button"

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [openMobile, setOpenMobile] = React.useState(false)
  const [open, setOpen] = React.useState(defaultOpen)
  const isMobile = false

  const openControlled = openProp !== undefined ? openProp : open
  const setOpenControlled = setOpenProp !== undefined ? setOpenProp : setOpen

  return (
    <SidebarContext.Provider
      value={{
        open: openControlled,
        setOpen: setOpenControlled,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar: () => setOpenControlled(!openControlled),
      }}
    >
      <div
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3rem",
            "--sidebar-height": "100vh",
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export const SidebarContext = React.createContext<SidebarContextValue | null>(null)

type SidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebarContext()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        data-side={side}
        className={cn(
          "flex h-svh w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <>
        {openMobile && (
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpenMobile(false)}
          />
        )}
        <div
          data-slot="sidebar"
          data-side={side}
          className={cn(
            "fixed inset-y-0 z-50 flex h-full w-(--sidebar-width-mobile) flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-linear",
            side === "left" ? "left-0" : "right-0",
            side === "left"
              ? openMobile ? "translate-x-0" : "-translate-x-full"
              : openMobile ? "translate-x-0" : "translate-x-full",
            className
          )}
          style={
            {
              "--sidebar-width-mobile": "18rem",
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </>
    )
  }

  return (
    <div
      data-slot="sidebar-container"
      data-side={side}
      className="group peer hidden md:block"
    >
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) flex-col transition-[left,right,width] duration-200 ease-linear",
          side === "left" ? "left-0" : "right-0",
          className
        )}
        data-state={
          variant === "floating" || variant === "inset"
            ? undefined
            : open
            ? "open"
            : "closed"
        }
        data-collapsible={collapsible === "icon" ? "icon" : undefined}
        style={
          {
            "--sidebar-width": variant === "floating" ? "18rem" : undefined,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-8 items-center px-2 text-xs font-medium text-sidebar-foreground/50",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("flex flex-col w-full gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("list-none", className)}
      {...props}
    />
  )
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md border border-transparent px-2 py-1.5 text-sm font-medium outline-none ring-sidebar-ring transition-[width,height,padding,color,background-color] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:border-sidebar-border data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group-has-data-[collapsible=icon]/sidebar-menu-button:w-8 group-has-data-[collapsible=icon]/sidebar-menu-button:px-2 group-has-data-[collapsible=icon]/sidebar-menu-button:[&>span]:hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuAction({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="sidebar-menu-action"
      className={cn(
        "absolute top-1 right-1 flex aspect-square w-5 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-foreground opacity-0 transition-opacity group-hover:opacity-100 group-has-data-[collapsible=icon]/sidebar-menu-button:hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full border border-sidebar-border px-1 text-xs font-medium tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function SidebarRail({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      data-slot="sidebar-rail"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:bg-sidebar-accent hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 md:flex [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rtl:-translate-x-1/2",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft />
    </button>
  )
}

function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "flex w-full min-w-0 flex-col bg-background",
        className
      )}
      {...props}
    />
  )
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      data-slot="sidebar-trigger"
      className={cn("flex items-center gap-2", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="size-4" />
    </button>
  )
}

export {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
}