import { MobileNav } from "@/components/layout/mobile-nav";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav role="citizen" />
      <main className="pb-20 max-w-lg mx-auto">{children}</main>
    </div>
  );
}
