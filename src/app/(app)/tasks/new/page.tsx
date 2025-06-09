
import TaskForm from "@/components/forms/task-form";
import { CheckSquare } from "lucide-react";

export default function NewTaskPage() {
  return (
    <div className="space-y-6">
      {/* O cabeçalho da página já é renderizado pelo TaskForm, então pode ser simplificado ou removido daqui se o TaskForm já incluir o título "Nova Tarefa" */}
      {/* <div className="flex items-center gap-2">
        <CheckSquare className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Nova Tarefa</h1>
      </div> */}
      <TaskForm />
    </div>
  );
}
