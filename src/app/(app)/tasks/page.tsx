
"use client";
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckSquare, PlusCircle, Search, Filter, CalendarClock, UserCog, AlertTriangle, CheckCircle2, CalendarIcon } from "lucide-react";
import Link from "next/link";
import TaskItem from "@/components/tasks/task-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const mockTasksData = [
  { id: "task1", title: "Follow up with Alice W.", dueDate: "2024-07-25", assignedTo: "Dr. Smith", status: "Pending", priority: "High", patientId: "1" },
  { id: "task2", title: "Prepare assessment report for Bob B.", dueDate: "2024-07-22", assignedTo: "Secretary", status: "In Progress", priority: "Medium", patientId: "2" },
  { id: "task3", title: "Review new patient intake - Charlie B.", dueDate: "2024-07-20", assignedTo: "Dr. Jones", status: "Completed", priority: "High", patientId: "3" },
  { id: "task4", title: "Send reminder to Diana P. for assessment", dueDate: "2024-07-28", assignedTo: "Secretary", status: "Pending", priority: "Low", patientId: "4" },
  { id: "task5", title: "Update clinic policies document", dueDate: "2024-08-01", assignedTo: "Admin", status: "Pending", priority: "Medium" },
];

type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "High" | "Medium" | "Low";

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    assignedTo: "All",
    dueDate: undefined as Date | undefined,
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set(mockTasksData.map(task => task.assignedTo));
    return ["All", ...Array.from(assignees)];
  }, []);

  const filteredTasks = useMemo(() => {
    return mockTasksData.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === "All" || task.status === filters.status;
      const matchesPriority = filters.priority === "All" || task.priority === filters.priority;
      const matchesAssignee = filters.assignedTo === "All" || task.assignedTo === filters.assignedTo;
      const matchesDueDate = !filters.dueDate || new Date(task.dueDate).toDateString() === filters.dueDate.toDateString();
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesDueDate;
    });
  }, [searchTerm, filters]);

  const pendingTasks = filteredTasks.filter(task => task.status === "Pending" || task.status === "In Progress");
  const completedTasks = filteredTasks.filter(task => task.status === "Completed");

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
              <Input 
                placeholder="Search tasks by title or assignee..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2" align="end">
                <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterStatus">Status</Label>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                      <SelectTrigger id="filterStatus"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterPriority">Priority</Label>
                    <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
                      <SelectTrigger id="filterPriority"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterAssignee">Assignee</Label>
                    <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange("assignedTo", value)}>
                      <SelectTrigger id="filterAssignee"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {uniqueAssignees.map(assignee => <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterDueDate">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="filterDueDate" variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dueDate ? format(filters.dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={filters.dueDate} onSelect={(date) => handleFilterChange("dueDate", date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button className="w-full" size="sm" onClick={() => console.log("Applying task filters:", filters)}>Apply Filters</Button>
                </DropdownMenuItem>
                 <DropdownMenuItem>
                    <Button className="w-full" size="sm" variant="ghost" onClick={() => setFilters({status: "All", priority: "All", assignedTo: "All", dueDate: undefined})}>Clear Filters</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                <p className="text-muted-foreground text-center py-6">No pending tasks match your filters.</p>
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
                <p className="text-muted-foreground text-center py-6">No completed tasks match your filters.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    