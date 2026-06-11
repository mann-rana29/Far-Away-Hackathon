import { MobileNav } from "@/components/layout/mobile-nav";

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav role="worker" />
      <main className="pb-20 max-w-lg mx-auto">{children}</main>
    </div>
  );
}
