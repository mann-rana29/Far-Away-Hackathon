"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { MapPin, Clock, User, Trash2, Box, Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await adminApi.getComplaints();
        setComplaints(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch citizen reports");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground animate-pulse">Synchronizing Citizen Reports...</p>
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
          <h2 className="text-lg font-serif font-bold">Connection Latency</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Citizen Complaints</h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-tight">System-wide oversight of reported waste situations</p>
        </div>
      </div>

      <Card className="border-border/60 bg-card shadow-sm overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/10 bg-muted/30">
                  <th className="text-left p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">ID</th>
                  <th className="text-left p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                  <th className="text-left p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Location</th>
                  <th className="text-left p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Reporter</th>
                  <th className="text-left p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest text-center">Severity</th>
                  <th className="text-left p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="text-left p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Assigned</th>
                  <th className="text-right p-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Reported At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {complaints.length > 0 ? complaints.map((c: any) => (
                  <tr key={c.formattedId || c.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="p-4">
                       <span className="text-[11px] font-mono font-bold text-primary">{c.formattedId || `#${c.id}`}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-semibold uppercase">{c.trashType}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 max-w-[200px]">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate font-medium">{c.location}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-semibold">{c.citizenName || "Unknown"}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${c.severityScore >= 8 ? "bg-red-500 animate-pulse" : c.severityScore >= 5 ? "bg-amber-500" : "bg-emerald-500"}`} />
                        <span className={`text-[11px] font-bold font-mono ${c.severityScore >= 8 ? "text-red-500" : c.severityScore >= 5 ? "text-amber-500" : "text-emerald-500"}`}>
                          {c.severityScore}/10
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={`text-[9px] font-mono font-bold px-2 py-0.5 border-border/50 ${statusStyles(c.complaintStatus)}`}>
                        {c.complaintStatus?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                       <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium truncate max-w-[100px]">{c.workerName || "Queue"}</span>
                       </div>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] font-mono text-muted-foreground">{formatDate(c.createdAt || c.date)}</span>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                         <ShieldAlert className="h-10 w-10" />
                         <p className="text-sm font-medium">No system reports currently active.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="text-center pt-4 opacity-40">
        <p className="text-[10px] font-mono uppercase tracking-widest">Regional Report Overflow Monitor</p>
      </div>
    </div>
  );
}

const statusStyles = (s: string) => {
  switch (s?.toUpperCase()) {
    case "RESOLVED": return "text-emerald-500 bg-emerald-500/5 border-emerald-500/20";
    case "IN_PROGRESS": return "text-blue-500 bg-blue-500/5 border-blue-500/20";
    case "PENDING": return "text-amber-500 bg-amber-500/5 border-amber-500/20";
    default: return "bg-background";
  }
};
