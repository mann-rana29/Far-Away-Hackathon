"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Clear old tokens to prevent "token expired" issues on login
    localStorage.clear();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authApi.login({ phone, password });
      
      // Store token and user info
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      // Redirect based on role returned by backend
      const userRole = response.role.toLowerCase();
      router.push(`/${userRole}/dashboard`);
    } catch (err: any) {
      setError(err.message || "Invalid phone number or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-background relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

      {/* Back button */}
      <Link href="/" className="absolute top-5 left-5 p-2 rounded-full hover:bg-muted transition-colors border border-border cursor-pointer flex items-center justify-center z-10">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <Card className="w-full max-w-sm border-border/50 bg-white/35 dark:bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Chokho" width={72} height={72} />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">Chokho</CardTitle>
            <CardDescription className="font-mono text-xs tracking-wider mt-1">
              SMART WASTE MANAGEMENT
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-mono text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit number"
                className="h-10 bg-muted/50 font-mono"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10 bg-muted/50"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-10 font-medium cursor-pointer" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground pt-1">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-80">
          Towards a Trash-Free Uttarakhand
        </p>
      </div>
    </div>
  );
}
