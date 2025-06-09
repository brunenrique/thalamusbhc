
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarClock, UserCog, Edit, Trash2, AlertTriangle, CheckCircle2, LinkIcon } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task } from "@/app/(app)/tasks/page"; // Importando o tipo Task

interface TaskItemProps {
  task: Task; // Usando o tipo Task importado
}

export default function TaskItem({ task }: TaskItemProps) {
  const getPriorityBadgeVariant = (): "destructive" | "secondary" | "outline" => {
    if (task.priority === "Alta") return "destructive";
    if (task.priority === "Média") return "secondary";
    return "outline";
  };

  const getStatusIcon = () => {
    if (task.status === "Concluída") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (task.status === "Em Progresso") return <UserCog className="h-4 w-4 text-blue-500" />; 
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${task.status === "Concluída" ? "opacity-70" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox 
              id={`task-${task.id}`} 
              checked={task.status === "Concluída"} 
              aria-label={`Marcar tarefa "${task.title}" como ${task.status === "Concluída" ? 'pendente' : 'concluída'}`} 
            />
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${task.status === "Concluída" ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </h3>
            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span className="flex items-center"><CalendarClock className="mr-1 h-3 w-3" /> Venc.: {format(new Date(task.dueDate), "P", { locale: ptBR })}</span>
              <span className="flex items-center"><UserCog className="mr-1 h-3 w-3" /> Para: {task.assignedTo}</span>
              {task.patientId && (
                <Button variant="link" size="xs" className="p-0 h-auto text-accent" asChild>
                  <Link href={`/patients/${task.patientId}`}>
                    <LinkIcon className="mr-1 h-3 w-3" /> Paciente Relacionado
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getPriorityBadgeVariant()}>{task.priority}</Badge>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Editar tarefa ${task.title}`} asChild>
                  <Link href={`/tasks/edit/${task.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label={`Excluir tarefa ${task.title}`}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
