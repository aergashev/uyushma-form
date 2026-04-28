"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiDashboardLine,
  RiFileListLine,
  RiLogoutBoxRLine,
} from "@remixicon/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { signOutAction } from "../_actions"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: RiDashboardLine },
  { href: "/admin/submissions", label: "Submissions", icon: RiFileListLine },
] as const

export function AdminSidebar({ adminEmail }: { adminEmail?: string | null }) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background font-semibold">
            U
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Uyushma</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(href)
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={href}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {adminEmail && (
          <div className="px-2 pb-1 text-xs text-muted-foreground truncate">
            {adminEmail}
          </div>
        )}
        <form action={signOutAction}>
          <SidebarMenuButton type="submit" className="w-full">
            <RiLogoutBoxRLine />
            <span>Sign out</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
