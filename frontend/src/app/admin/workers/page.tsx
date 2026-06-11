"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";
import { Phone, Truck, Plus, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function WorkersManagement() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const data = await adminApi.getWorkers();
        setWorkers(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch workers list");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading workers list...</p>
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
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-serif font-bold">Field Workers</h1><p className="text-sm text-muted-foreground mt-1">Manage and monitor waste collection staff</p></div>
        <Link href="/admin/add?tab=worker">
          <Button size="sm" className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Add Worker
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((w) => (
          <Card key={w.workerId} className="border-border/60 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold">
                    {w.workerName.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{w.workerName}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0 font-bold bg-emerald-50 text-emerald-600 border-emerald-100 uppercase">ACTIVE</Badge>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5">ID: {w.workerId}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/80">{w.phoneNo}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-foreground/80">Vehicle: <span className="font-bold text-primary">{w.vehicleNo || "N/A"}</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {workers.length === 0 && (
        <div className="h-[40vh] border border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center text-center p-6">
          <p className="text-sm font-serif italic text-muted-foreground">No field officers registered in the system.</p>
          <Link href="/admin/add?tab=worker" className="mt-4">
            <Button variant="outline" size="sm">Register First Worker</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
