"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";
import { Truck, User, Plus, Loader2, AlertTriangle, Search, Filter, MoreVertical, Settings } from "lucide-react";
import Link from "next/link";

export default function VehiclesManagement() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await adminApi.getVehicles();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch vehicle fleet data");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div>
          <h2 className="text-lg font-serif font-bold">Connection Error</h2>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Vehicle Fleet</h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-tight">Manage and track your active collection units</p>
        </div>
        <Link href="/admin/add?tab=vehicle">
          <Button className="gap-2 h-10 px-5 cursor-pointer shadow-sm">
            <Plus className="h-4 w-4" /> Add New Vehicle
          </Button>
        </Link>
      </div>


      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {vehicles.map((v, i) => (
          <Card key={v.vehicleId || i} className="border-border/50 hover:bg-muted/30 transition-all hover:shadow-md group overflow-hidden">
            <CardContent className="p-0">
              <div className={`h-1.5 w-full ${statusColor(v.vehicleStatus)}`} />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-mono tracking-tighter uppercase ${statusText(v.vehicleStatus)}`}>
                    {v.vehicleStatus}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-primary font-bold tracking-widest">ID: {v.vehicleId}</p>
                  <h3 className="text-lg font-serif font-bold">{v.vehicleNo}</h3>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border/10">
                    <span className="text-muted-foreground font-mono uppercase tracking-widest">Driver</span>
                    <span className="font-semibold flex items-center gap-1.5 text-sm">
                      <User className="h-3 w-3" /> {v.workerName || "Unassigned"}
                    </span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-muted/5 rounded-2xl border border-dashed border-border flex flex-col items-center">
            <Truck className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No vehicles registered in the fleet.</p>
          </div>
        )}
      </div>

      <div className="text-center pt-4 opacity-40">
        <p className="text-[10px] font-mono uppercase tracking-widest">System Logs: All vehicles accounted for</p>
      </div>
    </div>
  );
}

const statusColor = (s: string) => {
  switch (s?.toUpperCase()) {
    case "ACTIVE": return "bg-emerald-500";
    case "MAINTENANCE": return "bg-amber-500";
    case "IDLE": return "bg-gray-400";
    default: return "bg-muted";
  }
};

const statusText = (s: string) => {
  switch (s?.toUpperCase()) {
    case "ACTIVE": return "text-emerald-500 border-emerald-500/20 bg-emerald-50/50";
    case "MAINTENANCE": return "text-amber-500 border-amber-500/20 bg-amber-50/50";
    case "IDLE": return "text-muted-foreground border-border";
    default: return "";
  }
};
