import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckSquare, PlusCircle, Search, Filter, CalendarClock, UserCog, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import TaskItem from "@/components/tasks/task-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const mockTasks = [
  { id: "task1", title: "Follow up with Alice W.", dueDate: "2024-07-25", assignedTo: "Dr. Smith", status: "Pending", priority: "High", patientId: "1" },
  { id: "task2", title: "Prepare assessment report for Bob B.", dueDate: "2024-07-22", assignedTo: "Secretary", status: "In Progress", priority: "Medium", patientId: "2" },
  { id: "task3", title: "Review new patient intake - Charlie B.", dueDate: "2024-07-20", assignedTo: "Dr. Jones", status: "Completed", priority: "High", patientId: "3" },
  { id: "task4", title: "Send reminder to Diana P. for assessment", dueDate: "2024-07-28", assignedTo: "Secretary", status: "Pending", priority: "Low", patientId: "4" },
  { id: "task5", title: "Update clinic policies document", dueDate: "2024-08-01", assignedTo: "Admin", status: "Pending", priority: "Medium" },
];

export default function TasksPage() {
  const pendingTasks = mockTasks.filter(task => task.status === "Pending" || task.status === "In Progress");
  const completedTasks = mockTasks.filter(task => task.status === "Completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Tasks</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/tasks/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Manage Tasks</CardTitle>
          <CardDescription>Track and manage tasks for your team.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                <AlertTriangle className="mr-2 h-4 w-4" /> Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Completed ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              {pendingTasks.length > 0 ? (
                <div className="space-y-4">
                  {pendingTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">No pending tasks.</p>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              {completedTasks.length > 0 ? (
                <div className="space-y-4">
                  {completedTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">No completed tasks.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
