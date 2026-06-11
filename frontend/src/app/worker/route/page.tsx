"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workerApi } from "@/lib/api";
import { ArrowLeft, Navigation, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import MapDynamic from "@/components/map";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function WorkerRoute() {
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [workerLocation, setWorkerLocation] = useState<[number, number] | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Track worker's live location
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setWorkerLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Geolocation error:", err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const fetchRoute = async () => {
    try {
      const data = await workerApi.getRoute();
      setStops(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const handleEndRoute = async () => {
    setEnding(true);
    try {
      const message = await workerApi.finishRoute();
      toast({
        title: "Route Status",
        description: message || "Your session for this route has been closed. Great work!",
      });
      router.push("/worker/dashboard");
    } catch (error: any) {
      toast({
        title: "Action Restricted",
        description: error.message || "Could not end the route. Please verify all stops first.",
        variant: "destructive",
      });
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground">Loading Route...</p>
      </div>
    );
  }

  const resolvedStops = (stops || []).filter(s => s.status === "CLEANED" || s.complaintStatus === "RESOLVED" || s.complaintStatus === "CLEANED").length;

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/worker/dashboard" className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-serif font-semibold">Route Overview</h1>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{stops.length > 0 ? "Points Assigned" : "No active stops"}</p>
        </div>
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-xl text-black z-0 relative">
        <div className="h-[300px] sm:h-[400px] lg:h-[500px] relative z-0">
          <MapDynamic type="worker-route" data={stops} workerLocation={workerLocation} />
          <Badge className="absolute top-3 right-3 text-[10px] z-10 shadow-md">LIVE</Badge>
        </div>
      </div>

      {/* Complaint Stops */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Stops Checklist ({resolvedStops}/{stops.length})</h2>
        <div className="space-y-2">
          {(stops || []).map((s, idx) => {
            const isCleaned = s.status === "CLEANED" || s.complaintStatus === "RESOLVED" || s.complaintStatus === "CLEANED";
            const score = s.severityScore || 0;
            const stopId = s.id || s.complaintId || `ST-00${idx + 1}`;

            return (
              <Card key={stopId} className={`border-l-4 ${severityBorder(score)} ${isCleaned ? "opacity-50" : ""}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isCleaned ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                    {isCleaned ? <CheckCircle2 className="h-4 w-4" /> : (s.sequenceNo || idx + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <p className="text-sm font-bold truncate uppercase">{s.location || s.locationName || s.area || "UNNAMED POINT"}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold ${score >= 8 ? "text-red-500" : score >= 5 ? "text-orange-500" : "text-amber-500"}`}>
                        Severity: {score}
                      </span>
                      <Badge variant="outline" className="text-[9px] uppercase">{s.trashType || s.wasteType || "WASTE"}</Badge>
                      {(s.volumeEstimate || s.volume) && (
                        <Badge variant="secondary" className="text-[9px] uppercase bg-amber-500/10 text-amber-600 border-amber-500/20">{s.volumeEstimate || s.volume}</Badge>
                      )}
                    </div>
                  </div>
                  {!isCleaned && (
                    <Link href={`/worker/verify?id=${stopId}`}>
                      <Button size="sm" variant="outline" className="text-xs h-7 cursor-pointer">
                        Verify
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {(!stops || stops.length === 0) && (
            <div className="text-center py-12 bg-muted/5 rounded-xl border border-dashed border-border">
              <Navigation className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
              <p className="text-sm text-muted-foreground">No active stops found for your route.</p>
            </div>
          )}
        </div>
      </div>

      {stops.length > 0 && (
        <Button
          variant="destructive"
          className="w-full h-11 font-medium cursor-pointer"
          disabled={ending}
          onClick={handleEndRoute}
        >
          {ending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
          End Route Session
        </Button>
      )}
    </div>
  );
}

const severityBorder = (s: number) => {
  if (s >= 8) return "border-red-500";
  if (s >= 5) return "border-orange-500";
  return "border-amber-400";
};
