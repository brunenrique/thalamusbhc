import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListChecks, UserPlus, Search, Filter, MoreHorizontal, CalendarPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const mockWaitingList = [
  { id: "wl1", name: "Edward Scissorhands", requestedPsychologist: "Any", dateAdded: "2024-06-01", priority: "High", notes: "Prefers morning appointments." },
  { id: "wl2", name: "Fiona Gallagher", requestedPsychologist: "Dr. Smith", dateAdded: "2024-06-15", priority: "Medium", notes: "Needs evening slots." },
  { id: "wl3", name: "George Jetson", requestedPsychologist: "Dr. Jones", dateAdded: "2024-07-01", priority: "Low", notes: "Flexible with timing." },
  { id: "wl4", name: "Harry Potter", requestedPsychologist: "Any", dateAdded: "2024-07-10", priority: "High", notes: "Urgent referral." },
];

export default function WaitingListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Waiting List</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/waiting-list/add">
            <UserPlus className="mr-2 h-4 w-4" /> Add to Waiting List
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Manage Patient Waiting List</CardTitle>
          <CardDescription>View and allocate patients from the waiting list.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search waiting list..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockWaitingList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Requested Psychologist</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWaitingList.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.requestedPsychologist}</TableCell>
                    <TableCell>{item.dateAdded}</TableCell>
                    <TableCell>
                      <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "secondary" : "outline"}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.notes}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Allocate Slot
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-10">
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Waiting list is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">No patients are currently on the waiting list.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
