import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
