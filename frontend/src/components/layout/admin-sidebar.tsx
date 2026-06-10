"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Map,
  MessageSquareWarning,
  Users,
  Truck,
  LogOut,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
  { href: "/admin/routes", icon: Map, label: "Collection Routes" },
  { href: "/admin/complaints", icon: MessageSquareWarning, label: "Citizen Reports" },
  { href: "/admin/workers", icon: Users, label: "Field Workers" },
  { href: "/admin/vehicles", icon: Truck, label: "Vehicle Fleet" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 hidden md:flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <Image src="/logo.png" alt="Chokho" width={36} height={36} className="rounded-sm" />
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground font-serif">CHOKHO</p>
          <p className="text-[10px] text-muted-foreground font-mono tracking-wider">ADMIN PORTAL</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Operations
        </p>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom — just logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
