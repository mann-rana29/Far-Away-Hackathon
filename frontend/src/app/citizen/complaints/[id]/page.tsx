"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { citizenApi } from "@/lib/api";
import { ArrowLeft, MapPin, Clock, User, Bot, CheckCircle2, ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default function ComplaintDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    citizenApi.getComplaintDetail(id)
      .then(setComplaint)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground">Fetching report details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Complaint not found.</p>
        <Link href="/citizen/complaints">
          <Badge className="mt-4 cursor-pointer">Back to List</Badge>
        </Link>
      </div>
    );
  }

  const severityScore = complaint.severityScore || 0;
  const severityColor = severityScore >= 8 ? "text-red-500" : severityScore >= 5 ? "text-orange-500" : "text-amber-400";
  
  const timeline = [
    { time: complaint.createdAt ? formatDateTime(complaint.createdAt) : "Pending", label: "Complaint Filed", desc: complaint.citizenName || "Citizen User", icon: User, done: !!complaint.createdAt },
    { time: complaint.aiAnalysis ? "AI Verified" : "—", label: "AI Analysis Complete", desc: complaint.aiAnalysis || "Awaiting processing...", icon: Bot, done: !!complaint.aiAnalysis },
    { time: (complaint.workerName || complaint.assignedWorkerName || complaint.assignedWorkerId) ? "Assigned" : "—", label: "Assigned to Worker", desc: complaint.workerName || complaint.assignedWorkerName || (complaint.assignedWorkerId ? `Worker #${complaint.assignedWorkerId}` : "Pending assignment"), icon: User, done: !!(complaint.assignedWorkerId || complaint.workerName || complaint.assignedWorkerName) },
    { time: complaint.complaintStatus === "RESOLVED" ? "Resolved" : "—", label: "Resolution", desc: complaint.complaintStatus === "RESOLVED" ? "Issue resolved" : "In Progress", icon: CheckCircle2, done: complaint.complaintStatus === "RESOLVED" },
  ];

  const showAfterPhoto = complaint.complaintStatus === "RESOLVED" && complaint.cleanedImageUrl;

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/citizen/complaints" className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-serif font-semibold">Report Analysis</h1>
          <p className="text-[10px] font-mono text-muted-foreground">{complaint.formattedId || complaint.id || "CH-REPORT-X"}</p>
        </div>
      </div>

      {/* Status */}
      <Card className={`border-border/50 ${complaint.complaintStatus === "RESOLVED" ? "bg-emerald-500/5" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-sm font-semibold truncate tracking-tight">{complaint.trashType || "General Waste"}</h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">{complaint.location || "Co-ordinates Only"}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={complaint.complaintStatus === "RESOLVED" ? "secondary" : "default"} className="text-[10px] tracking-tighter px-2 py-0">
                {complaint.complaintStatus || "PENDING"}
              </Badge>
              <span className={`text-xs font-mono font-bold ${severityColor}`}>Severity {severityScore}/10</span>
            </div>
          </div>
          <Separator className="my-3 opacity-50" />
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-[9px] font-mono">{complaint.trashType || "UNIDENTIFIED"}</Badge>
            {complaint.complaintStatus === "RESOLVED" && <Badge variant="outline" className="text-[9px] font-mono text-emerald-500 border-emerald-500/30">DISPOSED</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Before / After Images */}
      {complaint.imageUrl && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ImageIcon className="h-3 w-3" />
              {showAfterPhoto ? "Before & After" : "Evidence Photo"}
            </p>
            <div className={`grid ${showAfterPhoto ? "grid-cols-2 gap-3" : "grid-cols-1"}`}>
              <div>
                {showAfterPhoto && <p className="text-[10px] text-muted-foreground mb-1.5">Before</p>}
                <img src={complaint.imageUrl} alt="Before" className="w-full h-auto rounded-lg shadow-sm border border-border/10" />
              </div>
              {showAfterPhoto && (
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1.5">After</p>
                  <img src={complaint.cleanedImageUrl} alt="After" className="w-full h-auto rounded-lg shadow-sm border border-border/10" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis */}
      {complaint.aiAnalysis && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-primary">AI Analysis</p>
            </div>
            <p className="text-xs text-muted-foreground">{complaint.aiAnalysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <h3 className="text-xs font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Timeline</h3>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center ${item.done ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.label}</p>
                    <span className="text-[10px] font-mono text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground opacity-60">
        <Clock className="h-3 w-3" />
        <span>Sync Log: {complaint.createdAt ? formatDateTime(complaint.createdAt) : "Real-time Trace"}</span>
      </div>
    </div>
  );
}
