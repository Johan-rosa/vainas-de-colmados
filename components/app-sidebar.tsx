import Image from "next/image"
import { Store, CircleDollarSign, CirclePercent,} from "lucide-react"
import logO from "@/public/logO.png"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "General",
    url: "#",
    icon: Store,
  },
  {
    title: "Ventas",
    url: "#",
    icon: CircleDollarSign,
  },
  {
    title: "Balances",
    url: "#",
    icon: CirclePercent,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image className="block" src={logO} alt="Logo" width={30} />
            <span className="text-lg font-semibold">Vainas de colmado</span>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a className="text-md" href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
