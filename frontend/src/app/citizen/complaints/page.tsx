"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { citizenApi } from "@/lib/api";
import { MapPin, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    citizenApi.getComplaints()
      .then(setComplaints)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-serif font-semibold">My Complaints</h1>
      </div>

      {/* List */}
      <div className="space-y-2 pb-24">
        {loading ? (
           <div className="flex flex-col items-center py-12 gap-3">
             <Loader2 className="h-6 w-6 animate-spin text-primary" />
             <p className="text-xs text-muted-foreground">Loading complaints...</p>
           </div>
        ) : (
          <>
            {complaints.map((c, i) => (
              <Link key={c.id || c.complaintId || i} href={`/citizen/complaints/${c.id || c.complaintId}`}>
                <Card className={`border-l-4 ${severityBorder(c.severityScore)} hover:bg-muted/30 transition-colors cursor-pointer mb-2`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-muted-foreground">ID: {c.formattedId || c.id || "PENDING"}</span>
                        </div>
                        <p className="text-sm font-medium">{c.trashType || "Waste Report"} — {c.location || "Area"}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{c.location || "Search Area"}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5">{formatDate(c.createdAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge variant="outline" className="text-[10px] shrink-0 uppercase">
                          {c.complaintStatus}
                        </Badge>
                        <span className={`text-xs font-mono font-bold ${c.severityScore >= 8 ? "text-red-500" : c.severityScore >= 5 ? "text-orange-500" : "text-amber-400"}`}>
                          {c.severityScore}/10
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {complaints.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border">
                No complaints found. Start reporting to see them here.
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB */}
      <Link href="/citizen/complaints/new" className="fixed bottom-24 right-4 z-40">
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg cursor-pointer">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}

const severityBorder = (s: number) => {
  if (s >= 8) return "border-red-500";
  if (s >= 5) return "border-orange-500";
  return "border-amber-400";
};
