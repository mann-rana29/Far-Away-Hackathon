"use client";

import { useEffect, useState } from "react";
import { complaintApi } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import MapDynamic from "@/components/map";
import { useRouter } from "next/navigation";

export default function HeatmapPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintApi.getHeatmap()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full hover:bg-muted transition-colors border border-border cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Public Health Heatmap</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time waste severity visualization across the city</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">Live System</span>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="overflow-hidden rounded-2xl border border-border shadow-2xl relative">
          <div className="h-[600px] sm:h-[700px] lg:h-[800px] relative z-0">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-mono text-muted-foreground">Loading Heatmap...</p>
                </div>
              </div>
            ) : (
              <MapDynamic type="heatmap" data={data} />
            )}
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border z-50 text-card-foreground shadow-lg">
              <p className="text-[10px] font-semibold mb-2">Severity</p>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-8 rounded-full bg-amber-400" />
                <div className="h-2 w-8 rounded-full bg-orange-500" />
                <div className="h-2 w-8 rounded-full bg-red-500" />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                <span>1-4</span><span>5-7</span><span>8-10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
