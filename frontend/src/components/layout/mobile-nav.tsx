"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, PlusCircle, User, Moon, Sun, Flame, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useNotifications } from "@/components/notification-context";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const citizenLinks = [
  { href: "/citizen/dashboard", icon: Home, label: "Home" },
  { href: "/citizen/complaints", icon: ClipboardList, label: "Complaints" },
  { href: "/citizen/complaints/new", icon: PlusCircle, label: "Report" },
  { href: "/citizen/profile", icon: User, label: "Profile" },
];

const workerLinks = [
  { href: "/worker/dashboard", icon: Home, label: "Home" },
  { href: "/worker/route", icon: ClipboardList, label: "Route" },
  { href: "/worker/verify", icon: PlusCircle, label: "Verify" },
  { href: "/worker/profile", icon: User, label: "Profile" },
];

export function MobileNav({ role }: { role: "citizen" | "worker" }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = role === "citizen" ? citizenLinks : workerLinks;

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border">
        <Link href={`/${role}/dashboard`} className="flex items-center gap-2">
          <Image src="/logo.png" alt="Chokho" width={28} height={28} className="rounded-sm" />
          <span className="text-sm font-serif font-bold">CHOKHO</span>
        </Link>
        <div className="flex items-center gap-1">
          {/* Notifications Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {mounted && unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-[10px] text-white">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 mt-2">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-xs font-semibold">Notifications</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <DropdownMenuItem 
                      key={n.id} 
                      className={cn("flex flex-col items-start gap-1 p-3 cursor-pointer", !n.read && "bg-muted/50")}
                      onClick={() => markAsRead(n.id)}
                    >
                      <span className="text-xs font-medium">{n.title}</span>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{n.description}</p>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-border flex justify-center">
                <Link href={`/${role}/profile`} className="text-[10px] text-primary hover:underline">
                  View all history
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <Link href="/heatmap" className="p-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
            <Flame className="h-4 w-4 text-orange-500" />
          </Link>
        </div>
      </header>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <link.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
