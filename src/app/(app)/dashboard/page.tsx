<<<<<<< HEAD
import DashboardGrid from '@/components/dashboard/DashboardGrid';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Painel Principal</h1>
      </div>
      <DashboardGrid />
    </div>
  );
=======
import { DashboardPage as DashboardPageClient } from "@/features/dashboard";

export default function DashboardPage() {
  return <DashboardPageClient />;
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
}
