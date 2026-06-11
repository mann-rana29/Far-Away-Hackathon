"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { adminApi } from "@/lib/api";
import { Users, AlertTriangle, TrendingUp, Truck, MapPin, Loader2, ArrowRight, Clock, ListFilter } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await adminApi.getDashboard();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-bold">Failed to load data</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Pending Reports", value: data.totalPendingComplaints, icon: AlertTriangle, color: "text-amber-500", sub: "urgent" },
    { label: "Field Workforce", value: data.totalWorkers, icon: Users, color: "text-blue-500", sub: "active" },
    { label: "Vehicle Fleet", value: `${data.totalActiveVehicles}/${data.totalVehicles}`, icon: Truck, color: "text-emerald-500", sub: "fleet" },
    { label: "Efficiency", value: `${data.efficiency}%`, icon: TrendingUp, color: "text-primary", sub: "efficiency" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Welcome back, <span className="text-primary font-semibold">{data.name}</span>
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <Badge variant="outline" className="text-[10px] font-mono tracking-widest bg-primary/5 text-primary border-primary/20">SYSTEM OPERATIONAL</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 hover:bg-muted/30 transition-colors shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold mt-1.5 leading-none">{stat.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Routes */}
        <Card className="border-border/50 shadow-sm flex flex-col min-h-[450px]">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/5">
            <CardTitle className="text-base font-serif font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Active Field Operations
            </CardTitle>
            <Link href="/admin/routes">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-primary/5 hover:text-primary">
                View Routes <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1 px-6 py-4 overflow-auto">
            <div className="space-y-3">
              {(data.activeRoutes || []).length > 0 ? (
                (data.activeRoutes || []).map((r: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold truncate tracking-tight uppercase">{r.formattedRouteId || `ROUTE-ALPHA-${idx+1}`}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{r.ward || "Tri-City Cluster"}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono bg-background text-emerald-500 border-emerald-500/20">
                         ACTIVE
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 mt-2">
                       <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[11px] font-medium">{r.workerName || "Assigned"}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[11px] font-medium">{r.vehicleNo || "N/A"}</span>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground opacity-40">
                   <Truck className="h-8 w-8 mb-3" />
                   <p className="text-xs font-mono uppercase tracking-widest">No active fleet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 shadow-sm flex flex-col min-h-[450px]">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/5">
            <CardTitle className="text-base font-serif font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Critical Recent Reports
            </CardTitle>
            <Link href="/admin/complaints">
               <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-primary/5 hover:text-primary">
                 Manage List <ListFilter className="h-3.5 w-3.5" />
               </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1 px-6 py-4 overflow-auto">
            <div className="space-y-3">
              {(data.recentComplaints || []).length > 0 ? (
                (data.recentComplaints || []).map((c: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                         {c.formattedId && c.formattedId !== "na" && (
                           <span className="text-[10px] font-mono font-bold text-primary">#{c.formattedId}</span>
                         )}
                         <span className="text-[9px] text-muted-foreground font-mono">{formatDate(c.createdAt || c.date || c.reportedAt)}</span>
                      </div>
                      <p className="text-sm font-semibold truncate uppercase">{c.trashType}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{c.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${c.severityScore >= 8 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
                        {c.severityScore}/10
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground opacity-40">
                   <AlertTriangle className="h-8 w-8 mb-3" />
                   <p className="text-xs font-mono uppercase tracking-widest">No recent reports</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
