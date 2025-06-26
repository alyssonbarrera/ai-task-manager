import {
  IconDashboard,
  IconInnerShadowTop,
  IconListCheck,
  IconMessageCircle,
  IconUsers,
} from '@tabler/icons-react'
import type * as React from 'react'
import { NavLink } from 'react-router'

import { NavMain } from '~/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/alyssonbarrera.png',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: IconDashboard,
    },
    {
      title: 'Users',
      url: '/users',
      icon: IconUsers,
    },
    {
      title: 'Tasks',
      url: '/tasks',
      icon: IconListCheck,
    },
    {
      title: 'Chats',
      url: '/chats',
      icon: IconMessageCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <NavLink to={'/'}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">AI Task Manager</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
