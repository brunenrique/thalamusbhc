
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartBig, CalendarRange, Filter, Users, Download } from "lucide-react";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
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
  { day: "Wednesday", date: "2024-07-24", psychologist: "Dr. Jones", totalSlots: 7, bookedSlots: 5, blockedSlots: 0, occupancy: "71.4%" },
  { day: "Thursday", date: "2024-07-25", psychologist: "Dr. Smith", totalSlots: 8, bookedSlots: 7, blockedSlots: 1, occupancy: "87.5%" },
  { day: "Friday", date: "2024-07-26", psychologist: "Dr. Jones", totalSlots: 6, bookedSlots: 3, blockedSlots: 2, occupancy: "50%" },
  { day: "Saturday", date: "2024-07-27", psychologist: "Dr. Eva", totalSlots: 4, bookedSlots: 1, blockedSlots: 3, occupancy: "25%" },
  { day: "Sunday", date: "2024-07-28", psychologist: "Clinic", totalSlots: 0, bookedSlots: 0, blockedSlots: 0, occupancy: "N/A" },
];

export default function ClinicOccupancyPage() {
  const getOccupancyBadgeVariant = (occupancy: string): "default" | "secondary" | "outline" | "destructive" => {
    if (occupancy === "N/A") return "outline";
    const percentage = parseFloat(occupancy);
    if (percentage > 80) return "default"; // Good (e.g. primary color)
    if (percentage > 60) return "secondary"; // Medium (e.g. accent color)
    if (percentage > 30) return "outline"; // Low (e.g. default outline)
    return "destructive"; // Very Low / Problematic
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChartBig className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Clinic Occupancy</h1>
        </div>
        <Button variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>
      <CardDescription>
        Analyze weekly and monthly clinic occupancy, considering booked appointments and blocked time slots for better resource management.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <CardTitle className="font-headline">Occupancy Overview</CardTitle>
                <CardDescription>Filter by date range and psychologist to view specific occupancy data.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                    <CalendarRange className="mr-2 h-4 w-4" /> This Week
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
          <div className="h-[350px] mb-8 bg-muted/30 rounded-lg p-4">
            <OccupancyChart />
          </div>
          
          <h3 className="text-xl font-semibold mb-3 font-headline">Detailed Occupancy Data</h3>
          {mockOccupancyData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Day</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                    <TableHead className="min-w-[150px]">Psychologist</TableHead>
                    <TableHead className="text-center min-w-[100px]">Total Slots</TableHead>
                    <TableHead className="text-center min-w-[100px]">Booked</TableHead>
                    <TableHead className="text-center min-w-[100px]">Blocked</TableHead>
                    <TableHead className="text-right min-w-[100px]">Occupancy</TableHead>
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
                          <Badge variant={getOccupancyBadgeVariant(item.occupancy)} className="whitespace-nowrap">
                              {item.occupancy}
                          </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
