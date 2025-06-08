
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Users, CheckCircle, ShieldQuestion } from "lucide-react";

// Mock data - replace with actual data fetching from Firestore
const mockPendingUsers = [
  { id: "usr1", name: "Dr. Eleanor Vance", email: "eleanor.vance@example.com", role: "Psychologist", dateRegistered: "2024-07-20", status: "Pending Approval" },
  { id: "usr2", name: "Samuel Green", email: "sam.green@example.com", role: "Secretary", dateRegistered: "2024-07-19", status: "Pending Approval" },
  { id: "usr3", name: "Dr. Arthur Finch", email: "arthur.finch@example.com", role: "Psychologist", dateRegistered: "2024-07-18", status: "Pending Approval" },
];

export default function UserApprovalsPage() {
  // TODO: Fetch pending users from Firestore where isApproved === false
  // TODO: Implement handleApproveUser function to update Firestore

  const handleApproveUser = (userId: string) => {
    console.log(`Approving user ${userId}...`);
    // Update Firestore: set isApproved = true for this userId
    // Re-fetch or update local state
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldQuestion className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">User Approvals</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Pending User Registrations</CardTitle>
          <CardDescription>Review and approve new users requesting access to PsiGuard.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockPendingUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPendingUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Psychologist" ? "secondary" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.dateRegistered}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No pending approvals</h3>
              <p className="mt-1 text-sm text-muted-foreground">All users have been reviewed.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
