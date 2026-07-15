import { LeftSidebar } from "@/widgets/left-sidebar";
import { ErrorBoundary } from "@/shared/ui/error-boundary/ErrorBoundary";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto">
      <LeftSidebar />
      <main className="flex-1 border-x border-zinc-800 min-h-screen">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <aside className="hidden lg:block w-80 px-4 py-4" />
    </div>
  );
}
