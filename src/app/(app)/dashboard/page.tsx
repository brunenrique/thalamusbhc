import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarCheck, BarChart3, ArrowUpRight, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { OccupancyChart } from '@/components/dashboard/occupancy-chart';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { RecentActivityItem } from "@/components/dashboard/recent-activity-item";

export default function DashboardPage() {
  const upcomingAppointments = [
    { id: '1', patientName: 'Alice Wonderland', time: '10:00 AM', psychologist: 'Dr. Smith' },
    { id: '2', patientName: 'Bob The Builder', time: '11:30 AM', psychologist: 'Dr. Jones' },
    { id: '3', patientName: 'Charlie Brown', time: '02:00 PM', psychologist: 'Dr. Smith' },
  ];

  const recentActivities = [
    { id: 'act1', description: 'New patient "Eva Green" added.', time: '2 hours ago', icon: <Users className="w-4 h-4" /> },
    { id: 'act2', description: 'Session notes for "Alice W." finalized.', time: '5 hours ago', icon: <ClipboardListIcon className="w-4 h-4" /> },
    { id: 'act3', description: 'Appointment with "Bob B." rescheduled.', time: '1 day ago', icon: <CalendarCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/schedule/new">
            <CalendarCheck className="mr-2 h-4 w-4" /> New Appointment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Patients" value="125" icon={<Users className="text-primary" />} trend="+5 this month" />
        <StatsCard title="Appointments Today" value="8" icon={<CalendarCheck className="text-primary" />} trend="2 pending" />
        <StatsCard title="Open Tasks" value="12" icon={<Activity className="text-primary" />} trend="3 overdue" />
        <StatsCard title="Occupancy Rate" value="78%" icon={<BarChart3 className="text-primary" />} trend="+2% vs last week" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Schedule Occupancy</CardTitle>
            <CardDescription>Weekly occupancy trends</CardDescription>
          </CardHeader>
          <CardContent>
            <OccupancyChart />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Psychologist Performance</CardTitle>
            <CardDescription>Sessions completed per psychologist</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appt => (
                <div key={appt.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-semibold">{appt.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appt.psychologist}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appt.time}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-accent" asChild>
                        <Link href={`/patients/${appt.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <RecentActivityItem key={activity.id} description={activity.description} time={activity.time} icon={activity.icon} />
              ))
            ) : (
              <p className="text-muted-foreground">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground flex items-center">
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> {trend}
        </p>}
      </CardContent>
    </Card>
  );
}

// Dummy ClipboardListIcon as it's not standard in lucide-react
const ClipboardListIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="M12 11h4"></path>
    <path d="M12 16h4"></path>
    <path d="M8 11h.01"></path>
    <path d="M8 16h.01"></path>
  </svg>
);

