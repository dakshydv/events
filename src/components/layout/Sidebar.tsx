"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Ticket,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/components/ui/Icon";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Attendees", href: "/attendees", icon: Users },
  { label: "Tickets", href: "/tickets", icon: Ticket },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  // We can use a simple hook or prop if this needs to be client-side active state
  // ideally this should be a client component for usePathname
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)] bg-surface border-r border-border flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
          E
        </div>
        <span className="font-semibold text-lg text-foreground tracking-tight">
          EventStart
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground-muted hover:text-error hover:bg-error/5 rounded-lg transition-colors">
          <Icon icon={LogOut} className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

type NavItemProps = {
  label: string;
  href: string;
  icon: LucideIcon;
};

function NavItem({ label, href, icon }: NavItemProps) {
  // Placeholder active state logic, real impl would use usePathname
  const isActive = href === "/events"; // Hardcoded for demo matching the screenshot context usually

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      <Icon
        icon={icon}
        className={`w-5 h-5 ${
          isActive ? "text-primary" : "group-hover:text-foreground"
        }`}
      />
      {label}
    </Link>
  );
}
