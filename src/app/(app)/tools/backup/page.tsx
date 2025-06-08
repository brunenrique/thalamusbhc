
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, DownloadCloud, History, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function BackupPage() {
  // Mock data for demonstration
  const lastBackupDate = "2024-07-20, 02:00 AM";
  const nextBackupDate = "2024-07-21, 02:00 AM";
  const backupStatus = "Successful";
  const backupProgress = 65; // Example progress

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Archive className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Data Backup & Restore</h1>
      </div>
      <CardDescription>
        Manage your clinic's data backups. Ensure your data is safe and can be restored when needed.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Backup Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm"><strong>Last Backup:</strong> {lastBackupDate}</p>
            <p className="text-sm"><strong>Status:</strong> <span className={`font-semibold ${backupStatus === "Successful" ? "text-green-600" : "text-red-600"}`}>{backupStatus}</span></p>
            <p className="text-sm"><strong>Next Scheduled Backup:</strong> {nextBackupDate}</p>
            {backupStatus === "In Progress" && (
              <div>
                <Label htmlFor="backupProgress" className="text-sm">Current Progress:</Label>
                <Progress value={backupProgress} id="backupProgress" className="w-full mt-1" />
                <p className="text-xs text-muted-foreground text-right">{backupProgress}%</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <DownloadCloud className="mr-2 h-4 w-4" /> Initiate Manual Backup
              </Button>
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" /> Backup Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Restore Data</CardTitle>
            <CardDescription>Restore data from a previous backup point.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* This would typically involve selecting a backup point from a list */}
            <p className="text-sm text-muted-foreground">
              Select a backup from the history to restore. Restoring data will overwrite current data with the selected backup. This action is irreversible.
            </p>
            <Button variant="destructive" disabled> {/* Enable when a backup point is selected */}
              <History className="mr-2 h-4 w-4" /> Restore from Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for backup history table or list */}
          <p className="text-muted-foreground">Backup history will be displayed here.</p>
           <div className="text-center py-6 text-muted-foreground">
                <History className="mx-auto h-10 w-10" />
                <p className="mt-2">No backup history available yet.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Simple Label component if not using ShadCN form context
const Label = ({ htmlFor, className, children }: { htmlFor?: string; className?: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-foreground ${className}`}>
    {children}
  </label>
);
