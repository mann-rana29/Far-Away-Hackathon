"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Clock, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const history = [
  { date: "Today", routes: [{ id: "RT-007", name: "Central Sector R1", complaints: 3, time: "3h 12m", status: "active" }] },
  { date: "Yesterday", routes: [{ id: "RT-007", name: "Central Sector R1", complaints: 5, time: "3h 45m", status: "completed" }, { id: "RT-014", name: "ISBT Extension", complaints: 2, time: "1h 30m", status: "completed" }] },
  { date: "Apr 4, 2026", routes: [{ id: "RT-007", name: "Central Sector R1", complaints: 4, time: "3h 20m", status: "completed" }] },
  { date: "Apr 3, 2026", routes: [{ id: "RT-003", name: "South Sector R2", complaints: 6, time: "4h 05m", status: "completed" }] },
];

export default function WorkerHistory() {
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/worker/dashboard" className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-lg font-serif font-semibold">Work History</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-lg font-serif font-bold">42</p><p className="text-[10px] text-muted-foreground">Complaints This Month</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-lg font-serif font-bold">28</p><p className="text-[10px] text-muted-foreground">Routes Done</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-lg font-serif font-bold">98%</p><p className="text-[10px] text-muted-foreground">On-Time</p></CardContent></Card>
      </div>

      {/* History */}
      {history.map((day) => (
        <div key={day.date}>
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">{day.date}</h2>
          <div className="space-y-2">
            {day.routes.map((r) => (
              <Card key={`${day.date}-${r.id}`} className="border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
                      <Badge variant={r.status === "completed" ? "secondary" : "default"} className="text-[9px]">{r.status}</Badge>
                    </div>
                    {r.status === "completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{r.complaints} complaints</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
