"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";
import { Navigation, Clock, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import MapDynamic from "@/components/map";
import { useToast } from "@/components/ui/use-toast";

const colors = [
  "#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", 
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const { toast } = useToast();

  const fetchRoutes = async () => {
    try {
      const data = await adminApi.getRoutes();
      setRoutes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      await adminApi.optimizeRoutes();
      toast({
        title: "Optimization Started",
        description: "AI is re-calculating optimal routes based on latest reports.",
      });
      fetchRoutes();
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Could not trigger route optimization.",
        variant: "destructive",
      });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-serif font-bold">Collection Routes</h1><p className="text-sm text-muted-foreground mt-1">Manage and optimize collection paths</p></div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 cursor-pointer"
            onClick={handleOptimize}
            disabled={optimizing}
          >
            {optimizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
            Balance Routes
          </Button>
          <Badge variant="outline" className="gap-1.5">{routes.length > 0 ? "Active" : "No active routes"}</Badge>
        </div>
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-xl text-black z-0 relative">
        <div className="h-[500px] relative z-0">
          {loading ? (
             <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <MapDynamic type="admin-routes" data={routes} />
          )}
        </div>
      </div>

      {/* Route Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {routes.map((r, idx) => {
            const routeColor = colors[idx % colors.length];
            return (
              <Card 
                key={r.id} 
                className="border-border/50 hover:bg-muted/20 transition-colors cursor-pointer group relative overflow-hidden"
              >
                {/* Color Indicator Bar */}
                <div 
                  className="absolute top-0 left-0 bottom-0 w-1" 
                  style={{ backgroundColor: routeColor }}
                />
                
                <CardContent className="p-5 pl-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className="text-[10px]"
                      style={{ color: routeColor, borderColor: routeColor + '40', backgroundColor: routeColor + '10' }}
                    >
                      ROUTE {idx + 1}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">{r.formattedId}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-2">Route Details</h3>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-4">
                    <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {r.stops?.length || 0} Collection Points</span>
                    <span className="flex items-center gap-1"><Navigation className="h-3 w-3 text-emerald-500" /> Optimized Sequence</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-[10px] font-medium text-primary uppercase tracking-wider">Assigned Worker</p>
                    <p className="text-xs mt-1">{r.workerName || "Unassigned"} • {r.vehicleNo || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {routes.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border">
              No active routes found. Trigger optimization to generate new routes.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
