"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera, ScanSearch, CheckCircle2, Route, LayoutDashboard, Moon, Sun, MapPin, Layers, ChevronDown, ImagePlus, Gauge, Navigation, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { complaintApi } from "@/lib/api";
import MapDynamic from "@/components/map";

export default function LandingPage() {
  const [phase, setPhase] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    complaintApi.getHeatmap()
      .then(setHeatmapData)
      .catch(console.error)
      .finally(() => setMapLoading(false));
  }, []);

  // Splash screen phase
  if (phase < 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-96 h-96 rounded-full bg-primary/5 blur-[120px] transition-opacity duration-1000 ${phase >= 1 ? "opacity-100" : "opacity-0"}`} />
        </div>
        <div className={`transition-all duration-700 ease-out ${phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <Image src="/logo.png" alt="Chokho" width={120} height={120} priority />
        </div>
        <div className={`mt-6 text-center transition-all duration-700 delay-300 ease-out ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h1 className="text-3xl font-serif font-bold tracking-tight">CHOKHO</h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wider font-mono">SMART WASTE MANAGEMENT</p>
        </div>
        <div className={`mt-12 transition-all duration-500 delay-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Chokho" width={32} height={32} className="rounded-sm" />
            <p className="text-sm font-serif font-bold">CHOKHO</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center cursor-pointer"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <Link href="/heatmap" className="text-xs font-medium hover:text-primary transition-colors hidden sm:block">
              Full Heatmap
            </Link>
            <Link href="/login">
              <Button size="sm" className="cursor-pointer gap-1.5 text-xs sm:text-sm">
                Login <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with embedded heatmap */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight tracking-tight">
                Cleaner Cities,<br />
                <span className="text-primary">Smarter Systems</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-3 sm:mt-4 leading-relaxed max-w-lg">
                Report waste issues with a photo. Severity is analyzed, routes are optimized, and workers are dispatched in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                <Link href="/login">
                  <Button size="lg" className="cursor-pointer gap-2 h-11 sm:h-12 w-full sm:w-auto px-6">
                    <Camera className="h-4 w-4" /> Report a Problem
                  </Button>
                </Link>
                <Link href="/heatmap">
                  <Button variant="outline" size="lg" className="cursor-pointer h-11 sm:h-12 w-full sm:w-auto px-6">
                    <MapPin className="h-4 w-4 mr-2" /> Open Full Map
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Live Heatmap */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl">
                {/* Live badge */}
                <div className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/60 shadow-lg">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Live</span>
                </div>
                <div className="h-[340px] sm:h-[400px] lg:h-[420px] relative z-0">
                  {mapLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted/20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-mono text-muted-foreground">Loading heatmap…</p>
                      </div>
                    </div>
                  ) : (
                    <MapDynamic type="heatmap" data={heatmapData} />
                  )}
                </div>
                {/* Severity legend */}
                <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm p-2.5 rounded-lg border border-border z-50 shadow-lg">
                  <p className="text-[9px] font-semibold mb-1.5">Severity</p>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-6 rounded-full bg-amber-400" />
                    <div className="h-1.5 w-6 rounded-full bg-orange-500" />
                    <div className="h-1.5 w-6 rounded-full bg-red-500" />
                  </div>
                  <div className="flex justify-between text-[8px] text-muted-foreground mt-0.5">
                    <span>Low</span><span>Med</span><span>High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-border mt-12 sm:mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-2">HOW IT WORKS</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">Three Steps to a Cleaner City</h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-border" />

            {[
              { step: "01", icon: Camera, title: "Snap & Report", desc: "Take a photo of the waste issue. The system detects category and severity automatically, no forms to fill." },
              { step: "02", icon: ScanSearch, title: "Analyze & Classify", desc: "Severity is scored (1-10), waste type is classified, and GPS coordinates are captured instantly." },
              { step: "03", icon: CheckCircle2, title: "Resolved & Verified", desc: "Workers are dispatched via optimized routes. Cleanup is verified with before/after photo comparison." },
            ].map((item, idx) => (
              <div key={item.step} className={`relative flex gap-5 sm:gap-7 ${idx !== 2 ? "pb-10 sm:pb-12" : ""}`}>
                {/* Timeline node */}
                <div className="relative z-10 shrink-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
                {/* Content */}
                <div className="pt-1 sm:pt-2">
                  <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Step {item.step}</p>
                  <h3 className="text-base sm:text-lg font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">OUR TECHNOLOGY</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              The Vision Behind <span className="text-primary">Chokho AI</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
              A complete ecosystem bridging citizens and sanitation services through machine learning and real-time logistics.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "Waste Classification", desc: "Identifies multiple types of waste and estimates volume automatically from a single photo." },
              { icon: Route, title: "Smart Route Dispatch", desc: "Routes are calculated periodically, prioritizing high-severity clusters to ensure optimal resource use." },
              { icon: LayoutDashboard, title: "Regional Dashboard", desc: "A unified view for administrators to monitor city-wide cleanliness metrics and manage operations." },
            ].map((item, idx) => (
              <div key={idx} className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all hover:bg-primary/5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-0">
            {[
              {
                q: "What is Chokho?",
                a: "Chokho is a smart waste management platform for Uttarakhand. Citizens can report waste issues by uploading a photo, and the system handles classification, severity scoring, and dispatching field workers for cleanup."
              },
              {
                q: "How do I report a waste issue?",
                a: "Sign in as a citizen, take a photo of the waste, and submit it. The system automatically detects the waste type, scores its severity, and logs your GPS location. No manual forms needed."
              },
              {
                q: "How does severity scoring work?",
                a: "Each complaint is scored on a scale of 1 to 10 based on the uploaded image. The score determines priority for cleanup. Higher severity complaints are routed to workers first."
              },
              {
                q: "Is Chokho available outside Uttarakhand?",
                a: "Currently, Chokho is focused on Uttarakhand cities like Dehradun, Haridwar, and Rishikesh. The system is designed to be expandable to other regions in the future."
              },
              {
                q: "Is Chokho free to use?",
                a: "Yes. Chokho is completely free for citizens. You just need to create an account and start reporting waste issues in your area."
              },
              {
                q: "How can I contribute?",
                a: "Chokho is open source. You can contribute to the codebase, report bugs, or suggest features through our GitHub repository."
              },
            ].map((item, idx) => (
              <div key={idx} className="border-b border-border last:border-b-0">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-4 sm:py-5 text-left cursor-pointer group"
                >
                  <span className="text-sm sm:text-base font-medium pr-4 group-hover:text-primary transition-colors">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === idx ? "rotate-180 text-primary" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === idx ? "max-h-48 pb-4 sm:pb-5" : "max-h-0"}`}>
                  <p className="text-sm text-muted-foreground leading-relaxed pr-8">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">See Something? Report It.</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 sm:mb-8">Help make your city cleaner. One photo is all it takes.</p>
          <Link href="/login">
            <Button size="lg" className="cursor-pointer gap-2 h-11 sm:h-12 px-6 sm:px-8">
              <Camera className="h-4 w-4" /> Login to Report <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Chokho" width={24} height={24} className="rounded-sm" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Towards a Trash-Free Uttarakhand — CHOKHO</span>
          </div>
          <a href="https://github.com/ChokhoAI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            <span className="text-[10px] font-mono tracking-wider">GITHUB REPOSITORY</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
