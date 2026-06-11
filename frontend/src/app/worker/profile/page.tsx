"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { workerApi } from "@/lib/api";
import { Phone, Award, LogOut, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function WorkerProfile() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workerApi.getProfile()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await workerApi.logout();
    } catch (e) { }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Signed Out",
      description: "Worker session ended securely.",
    });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Accessing Credentials...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="p-8 text-center flex flex-col items-center gap-4">
      <AlertTriangle className="h-10 w-10 text-destructive opacity-50" />
      <p className="text-sm text-muted-foreground">Unable to synchronize profile data.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry Sync</Button>
    </div>
  );

  return (
    <div className="px-4 py-4 pb-12 space-y-5 max-w-lg mx-auto">
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="h-2 w-full bg-primary" />
        <CardContent className="p-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-serif font-bold">
                {data.name?.split(" ").map((n: any) => n[0]).join("") || "W"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight">{data.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <Badge variant="secondary" className="text-[10px] font-mono h-5 bg-emerald-500/5 text-emerald-600 border-emerald-500/10">VERIFIED OPERATOR</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Contact Register</p>
              <p className="text-sm font-semibold mt-0.5">{data.phone || data.phoneNumber || data.phoneNo || data.mobileNo || data.mobile || data.contact || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-3">
               <Award className="h-4 w-4" />
            </div>
            <p className="text-2xl font-serif font-bold leading-none">{data.totalCompletedRoutes || data.completedRoutes || data.routesCompleted || 0}</p>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-2 leading-none">Total Routes</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 rounded-full bg-emerald-500/5 text-emerald-500 flex items-center justify-center mx-auto mb-3">
               <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="text-2xl font-serif font-bold leading-none">{data.totalVerifications || data.verifications || data.completedVerifications || 0}</p>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-2 leading-none">Total Verifications</p>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 gap-3 text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30 cursor-pointer rounded-xl font-bold tracking-tight shadow-sm"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
