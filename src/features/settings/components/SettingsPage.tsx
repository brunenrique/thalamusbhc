import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/atoms/card";
import { Label } from "@/atoms/label";
import { Input } from "@/atoms/input";
import { Button } from "@/atoms/button";

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
       <div className="space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile</CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Dr. Smith" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="s.smith@thalamus.io" />
          </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">System Configurations</CardTitle>
          <CardDescription>
            Adjust system-wide settings like work hours and session duration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="work-start">Work Hours Start</Label>
                <Input id="work-start" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="work-end">Work Hours End</Label>
                <Input id="work-end" type="time" defaultValue="17:00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Default Session Duration (minutes)</Label>
            <Input id="duration" type="number" defaultValue="50" />
          </div>
           <Button>Save Configurations</Button>
        </CardContent>
      </Card>

    </div>
  );
}
