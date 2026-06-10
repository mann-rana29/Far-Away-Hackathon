"use client";

import { useEffect, useState } from "react";
import { Bell, Search, Menu, LayoutDashboard, Map, MessageSquareWarning, Users, Truck, LogOut, Flame } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { adminApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
  { href: "/admin/routes", icon: Map, label: "Collection Routes" },
  { href: "/admin/complaints", icon: MessageSquareWarning, label: "Citizen Reports" },
  { href: "/admin/workers", icon: Users, label: "Field Workers" },
  { href: "/admin/vehicles", icon: Truck, label: "Vehicle Fleet" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch (e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Signed Out",
      description: "Admin session ended securely.",
    });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-2 rounded-xl">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-sm font-semibold font-serif">CHOKHO</p>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Admin Portal</p>
              </div>
              <DropdownMenuSeparator />
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-primary font-medium bg-primary/5" : ""}`}
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-destructive cursor-pointer focus:text-destructive flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4 transition-all duration-300">
        <Link 
          href="/heatmap" 
          className="p-2 transition-all group cursor-pointer flex items-center justify-center rounded-full hover:bg-muted"
        >
          <Flame className="h-4.5 w-4.5 text-orange-500 group-hover:scale-110 transition-transform" />
        </Link>
      </div>
    </header>
  );
}
