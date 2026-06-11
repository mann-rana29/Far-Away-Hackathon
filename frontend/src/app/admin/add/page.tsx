"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, Truck, CheckCircle2, Loader2, AlertTriangle, Key, Phone, User as UserIcon } from "lucide-react";
import { adminApi } from "@/lib/api";
import Link from "next/link";

function AddResourceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "worker";
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [error, setError] = useState("");
  const [workers, setWorkers] = useState<any[]>([]);

  // Form States
  const [workerForm, setWorkerForm] = useState({ name: "", phone: "", password: "" });
  const [vehicleForm, setVehicleForm] = useState({ vehicleNo: "", vehicleStatus: "ACTIVE", workerId: "" });

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const data = await adminApi.getWorkers();
        setWorkers(data);
      } catch (err) {
        console.error("Failed to load workers for assignment", err);
      }
    };
    loadWorkers();
  }, []);

  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.registerWorker(workerForm);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to register field officer");
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.registerVehicle({
        ...vehicleForm,
        workerId: Number(vehicleForm.workerId)
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to onboard vehicle asset");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold">Successfully Added</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The {activeTab} has been successfully added to the system and is now ready for use.
          </p>
        </div>
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setSuccess(false)} className="cursor-pointer">Add Another</Button>
          <Button onClick={() => router.push(activeTab === "worker" ? "/admin/workers" : "/admin/vehicles")} className="cursor-pointer">View List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={activeTab === "worker" ? "/admin/workers" : "/admin/vehicles"} className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-serif font-semibold">Add New {activeTab === "worker" ? "Worker" : "Vehicle"}</h1>
          <p className="text-xs text-muted-foreground">Fill in the details below to register a new {activeTab}.</p>
        </div>
      </div>

      <Tabs defaultValue={initialTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 p-1">
          <TabsTrigger value="worker" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <UserPlus className="h-4 w-4" /> Worker
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Truck className="h-4 w-4" /> Vehicle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="worker" className="mt-6">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Worker Registration</CardTitle>
              <CardDescription>Enter the basic information for the new field worker.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWorkerSubmit} className="space-y-4">
                {error && activeTab === "worker" && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker-name" className="text-xs font-bold text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="worker-name" 
                        placeholder="e.g. Rahul Sharma" 
                        required 
                        className="pl-10 h-11"
                        value={workerForm.name}
                        onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-phone" className="text-xs font-bold text-muted-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="worker-phone" 
                        type="tel" 
                        maxLength={10} 
                        placeholder="9876543210" 
                        required 
                        className="pl-10 h-11"
                        value={workerForm.phone}
                        onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="worker-pass" className="text-xs font-bold text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="worker-pass" 
                      type="password" 
                      placeholder="Enter a secure password" 
                      required 
                      className="pl-10 h-11"
                      value={workerForm.password}
                      onChange={(e) => setWorkerForm({ ...workerForm, password: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 font-bold cursor-pointer" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : "Register Worker"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle" className="mt-6">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Registration</CardTitle>
              <CardDescription>Enter the registration details of the collection vehicle.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVehicleSubmit} className="space-y-4">
                {error && activeTab === "vehicle" && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="vehicle-no" className="text-xs font-bold text-muted-foreground">Registration Number</Label>
                  <Input 
                    id="vehicle-no" 
                    placeholder="e.g. UK 07 AB 1234" 
                    required 
                    className="h-11 uppercase font-bold"
                    value={vehicleForm.vehicleNo}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNo: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker-assign" className="text-xs font-bold text-muted-foreground">Manual Worker ID</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="worker-assign" 
                        placeholder="Enter Numeric ID (e.g. 101)" 
                        required 
                        className="pl-10 h-11 font-mono"
                        value={vehicleForm.workerId}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, workerId: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-status" className="text-xs font-bold text-muted-foreground">Vehicle Status</Label>
                    <Select value={vehicleForm.vehicleStatus} onValueChange={(v) => setVehicleForm({ ...vehicleForm, vehicleStatus: v })} required>
                      <SelectTrigger id="vehicle-status" className="h-11">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 font-bold cursor-pointer" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Register Vehicle"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AddResource() {
  return (
    <div className="px-4 py-6 md:px-8">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary/50" /></div>}>
        <AddResourceForm />
      </Suspense>
    </div>
  );
}
