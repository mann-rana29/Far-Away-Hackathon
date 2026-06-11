"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authApi.register(formData);
      
      setSuccess("Account created successfully! Redirecting to login...");
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Phone number might already be in use.");
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, phone: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      {/* Ambient background animations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <Link href="/login" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-6 group w-fit">
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <Card className="border-border/50 bg-white/40 dark:bg-card/80 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <Image src="/logo.png" alt="Chokho" width={72} height={72} />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif">Join Chokho</CardTitle>
              <CardDescription className="font-mono text-[10px] tracking-widest mt-1 uppercase text-primary/80">
                Citizen Registration
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-mono text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-2.5 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-mono text-center">
                  {success}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Rahul Sharma"
                  className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-all"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">+91</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    className="h-11 pl-12 bg-muted/30 border-border/50 focus:bg-background transition-all font-mono"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground font-mono mt-1">10-digit Indian mobile number</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-all"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-11 font-semibold cursor-pointer shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              <p className="text-center text-[11px] text-muted-foreground pt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

      </div>
      
      {/* Branding Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-80">
          Towards a Trash-Free Uttarakhand — CHOKHO
        </p>
      </div>
    </div>
  );
}
