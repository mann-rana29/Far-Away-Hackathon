"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { citizenApi } from "@/lib/api";
import { AlertTriangle, CheckCircle2, MapPin, Plus, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function CitizenDashboard() {
  const [data, setData] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      citizenApi.getDashboard(),
      citizenApi.getComplaints()
    ])
      .then(([dashboard, comps]) => {
        setData(dashboard);
        setComplaints(comps);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground">Loading Your Dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-serif font-semibold">Hello, {data.name}</h1>
      </div>

      {/* Area Cleanliness Score */}
      <Card className="border-border/50">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Community Score</p>
              <p className="text-3xl font-serif font-bold mt-1">{data.resolvedPercentage}%</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <Progress value={data.resolvedPercentage} className="h-2" />
          <p className="text-[10px] text-muted-foreground mt-2 font-mono">Based on your community's active resolutions</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto mb-1.5" />
            <p className="text-lg font-serif font-bold">{data.totalComplaints}</p>
            <p className="text-[10px] text-muted-foreground">Reports</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto mb-1.5" />
            <p className="text-lg font-serif font-bold">{data.resolvedComplaints}</p>
            <p className="text-[10px] text-muted-foreground">Solved</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <AlertTriangle className="h-4 w-4 text-destructive mx-auto mb-1.5" />
            <p className="text-lg font-serif font-bold">{data.pendingComplaints}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <Link href="/citizen/complaints/new">
        <Button className="w-full h-11 gap-2 font-medium cursor-pointer">
          <Plus className="h-4 w-4" /> Report New Problem
        </Button>
      </Link>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Your Recent activity</h2>
          <Link href="/citizen/complaints" className="text-xs text-primary hover:underline">View all history</Link>
        </div>
        <div className="space-y-2">
          {recentComplaints.map((c, i) => (
            <Link key={i} href={`/citizen/complaints/${c.id || c.complaintId}`}>
              <Card className={`border-l-4 ${severityBorder(c.severityScore)} hover:bg-muted/30 transition-colors cursor-pointer mb-2`}>
                <CardContent className="p-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.trashType || "Waste Report"} — {c.location || "Area"}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-mono uppercase tracking-wider">Status: {c.complaintStatus}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-mono font-bold ${c.severityScore >= 8 ? "text-red-500" : c.severityScore >= 5 ? "text-orange-500" : "text-amber-400"}`}>
                      {c.severityScore}/10
                    </span>
                    <p className="text-[9px] text-muted-foreground">{formatDate(c.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {complaints.length === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground">You haven't reported any problems yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const severityBorder = (s: number) => {
  if (s >= 8) return "border-red-500";
  if (s >= 5) return "border-orange-500";
  return "border-amber-400";
};
