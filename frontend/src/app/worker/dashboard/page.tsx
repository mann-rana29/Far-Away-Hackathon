"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { workerApi } from "@/lib/api";
import { MapPin, Navigation, Clock, TrendingUp, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function WorkerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workerApi.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground">Loading Dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center py-12">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-lg font-bold">No Dashboard Data</h2>
        <p className="text-sm text-muted-foreground mt-1">We couldn't retrieve your dashboard information. Please ensure you have an assigned vehicle and route.</p>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const completed = data.completedComplaints || 0;
  const pending = data.pendingComplaints || 0;
  const total = completed + pending;
  const routeProgress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="px-4 py-4 pb-6 space-y-6">
      <div>
        <h1 className="text-xl font-serif font-semibold">Hello, {data.name || "Worker"}</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="outline" className="text-[9px] font-mono tracking-widest uppercase bg-primary/5 text-primary border-primary/20">System Active</Badge>
        </div>
      </div>

      {/* Active Route Card */}
      <Link href="/worker/route" className="block w-full">
        <Card className="border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Active Assignment</p>
              </div>
            </div>
            <h2 className="text-lg font-serif font-bold">Current Collection Route</h2>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
              Vehicle: {data.vehicleNo || data.vehicleNumber || "UNASSIGNED"} • Status: {data.routeStatus || "OFFLINE"}
            </p>
            <Progress value={routeProgress} className="h-2 mb-2" />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>{completed}/{total} STOPS COMPLETED</span>
            </div>
            <div className="flex items-center justify-end mt-2 text-xs text-primary gap-1">
              <span>View Route Map</span><ChevronRight className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Today Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="text-2xl font-serif font-bold leading-none">{total}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider mt-2">Total Stops</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 rounded-full bg-emerald-500/5 text-emerald-500 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-2xl font-serif font-bold leading-none">{pending}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider mt-2">Remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex">
        <Link href="/worker/route" className="w-full">
          <Button variant="outline" className="w-full h-12 gap-2 cursor-pointer">
            <AlertTriangle className="h-4 w-4" /> Start Verification
          </Button>
        </Link>
      </div>

      {/* Assigned Complaints */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Recent Active Stops</h2>
        <div className="space-y-2">
          {(() => {
            const rawStops = data.complaints || data.stops || data.assignedComplaints;
            const stopsList = Array.isArray(rawStops) ? rawStops : [];
            
            if (stopsList.length === 0) {
              return <div className="text-center py-6 text-xs text-muted-foreground font-mono uppercase opacity-50">No stops assigned currently.</div>;
            }

            return stopsList.slice(0, 5).map((c: any, i: number) => (
              <Card key={c.id || c.complaintId || i} className={`border-l-4 border-border/50 hover:bg-muted/30 transition-colors`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-muted flex items-center justify-center text-[10px] font-mono font-bold">
                    #{c.sequenceNo || i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <p className="text-sm font-bold truncate uppercase">{c.locationName || c.location || "UNNAMED POINT"}</p>
                    </div>
                    {formatDate(c.createdAt || c.date || c.reportedAt) !== "N/A" && (
                      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-[9px] font-mono">{formatDate(c.createdAt || c.date || c.reportedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[9px] uppercase">{c.trashType || c.wasteType || c.category || "WASTE"}</Badge>
                      {(c.volumeEstimate || c.volume) && (
                        <Badge variant="secondary" className="text-[9px] uppercase bg-amber-500/10 text-amber-600 border-amber-500/20">{c.volumeEstimate || c.volume}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
