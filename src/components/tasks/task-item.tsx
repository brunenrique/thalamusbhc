import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarClock, UserCog, Edit, Trash2, AlertTriangle, CheckCircle2, LinkIcon } from "lucide-react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "High" | "Medium" | "Low";
  patientId?: string; // Optional link to a patient
}

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const getPriorityBadgeVariant = (): "destructive" | "secondary" | "outline" => {
    if (task.priority === "High") return "destructive";
    if (task.priority === "Medium") return "secondary";
    return "outline";
  };

  const getStatusIcon = () => {
    if (task.status === "Completed") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (task.status === "In Progress") return <UserCog className="h-4 w-4 text-blue-500" />; // Or a progress icon
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${task.status === "Completed" ? "opacity-70" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox id={`task-${task.id}`} checked={task.status === "Completed"} />
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${task.status === "Completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </h3>
            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span className="flex items-center"><CalendarClock className="mr-1 h-3 w-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              <span className="flex items-center"><UserCog className="mr-1 h-3 w-3" /> To: {task.assignedTo}</span>
              {task.patientId && (
                <Button variant="link" size="xs" className="p-0 h-auto text-accent" asChild>
                  <Link href={`/patients/${task.patientId}`}>
                    <LinkIcon className="mr-1 h-3 w-3" /> Related Patient
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getPriorityBadgeVariant()}>{task.priority}</Badge>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Edit task">
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label="Delete task">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
