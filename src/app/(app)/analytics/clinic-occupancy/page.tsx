
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartBig, CalendarRange, Filter, Users, Download } from "lucide-react";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart"; // Re-use or adapt
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockOccupancyData = [
  { day: "Monday", date: "2024-07-22", psychologist: "Dr. Smith", totalSlots: 8, bookedSlots: 6, blockedSlots: 1, occupancy: "75%" },
  { day: "Tuesday", date: "2024-07-23", psychologist: "Dr. Smith", totalSlots: 8, bookedSlots: 8, blockedSlots: 0, occupancy: "100%" },
  { day: "Wednesday", date: "2024-07-24", psychologist: "Dr. Jones", totalSlots: 7, bookedSlots: 5, blockedSlots: 0, occupancy: "71%" },
  { day: "Thursday", date: "2024-07-25", psychologist: "Dr. Smith", totalSlots: 8, bookedSlots: 7, blockedSlots: 1, occupancy: "87.5%" },
  { day: "Friday", date: "2024-07-26", psychologist: "Dr. Jones", totalSlots: 6, bookedSlots: 3, blockedSlots: 2, occupancy: "50%" },
];

export default function ClinicOccupancyPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChartBig className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Clinic Occupancy</h1>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>
      <CardDescription>
        Analyze weekly and monthly clinic occupancy, considering booked appointments and blocked time slots.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <CardTitle className="font-headline">Occupancy Overview</CardTitle>
                <CardDescription>Filter by date range and psychologist.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline">
                    <CalendarRange className="mr-2 h-4 w-4" /> Date Range (This Week)
                </Button>
                <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" /> All Psychologists
                </Button>
                 <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> More Filters
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for a more detailed occupancy chart */}
          <div className="h-[350px] mb-8">
            <OccupancyChart />
          </div>
          
          <h3 className="text-xl font-semibold mb-3 font-headline">Detailed Occupancy Data</h3>
          {mockOccupancyData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Psychologist</TableHead>
                  <TableHead className="text-center">Total Slots</TableHead>
                  <TableHead className="text-center">Booked</TableHead>
                  <TableHead className="text-center">Blocked</TableHead>
                  <TableHead className="text-right">Occupancy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOccupancyData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.day}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.psychologist}</TableCell>
                    <TableCell className="text-center">{item.totalSlots}</TableCell>
                    <TableCell className="text-center">{item.bookedSlots}</TableCell>
                    <TableCell className="text-center">{item.blockedSlots}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant={parseFloat(item.occupancy) > 80 ? "default" : parseFloat(item.occupancy) > 60 ? "secondary" : "outline"}>
                            {item.occupancy}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <BarChartBig className="mx-auto h-12 w-12" />
              <p className="mt-2">No occupancy data available for the selected criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
