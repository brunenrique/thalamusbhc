
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Filter, UserCircle, Edit3, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockAuditLogs = [
  { id: "log1", timestamp: "2024-07-21 10:05:15", user: "admin@psiguard.com", action: "User Login", details: "Successful login from IP 192.168.1.10", entity: "User", entityId: "admin001", severity: "Info" },
  { id: "log2", timestamp: "2024-07-21 10:15:30", user: "dr.smith@psiguard.com", action: "Patient Record Viewed", details: "Viewed patient record for Alice W.", entity: "Patient", entityId: "pat001", severity: "Info" },
  { id: "log3", timestamp: "2024-07-21 10:20:00", user: "secretary@psiguard.com", action: "Appointment Created", details: "New appointment for Bob B. on 2024-07-28", entity: "Appointment", entityId: "appt015", severity: "Info" },
  { id: "log4", timestamp: "2024-07-20 15:00:00", user: "System", action: "User Approval", details: "User 'new.psych@example.com' approved by admin@psiguard.com", entity: "User", entityId: "usr123", severity: "Medium" },
  { id: "log5", timestamp: "2024-07-20 09:30:45", user: "unknown@external.com", action: "Failed Login Attempt", details: "Invalid credentials from IP 203.0.113.45", entity: "System", entityId: null, severity: "High" },
];

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Audit Trail</h1>
      </div>
      <CardDescription>
        Track system activities, data modifications, and user actions for security and compliance.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Activity Logs</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <div className="relative flex-1">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs (e.g., user email, action, IP)" className="pl-8" />
                </div>
                <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters (Date, User, Action Type)
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          {mockAuditLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">{log.timestamp}</TableCell>
                    <TableCell className="flex items-center gap-1 text-xs">
                        {log.severity === "High" ? <ShieldAlert className="h-4 w-4 text-destructive"/> : <UserCircle className="h-4 w-4 text-muted-foreground"/> } 
                        {log.user}
                    </TableCell>
                    <TableCell className="text-xs">{log.action}</TableCell>
                    <TableCell className="text-xs">{log.entity}{log.entityId ? ` (${log.entityId})` : ''}</TableCell>
                    <TableCell className="text-xs max-w-sm truncate">{log.details}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.severity === "High" ? "destructive" : 
                        log.severity === "Medium" ? "secondary" : "outline"
                      } className="text-xs">
                        {log.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <History className="mx-auto h-12 w-12" />
              <p className="mt-2">No audit logs found for the selected criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
