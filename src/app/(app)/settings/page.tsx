import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, UserCog, Clock, Palette, BellDot, Briefcase } from "lucide-react";
import SettingsForm from "@/components/settings/settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="general"><Briefcase className="mr-2 h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="account"><UserCog className="mr-2 h-4 w-4" /> Account</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="notifications"><BellDot className="mr-2 h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="schedule"><Clock className="mr-2 h-4 w-4" /> Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">General Settings</CardTitle>
              <CardDescription>Configure general clinic and system parameters.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="general" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Account Settings</CardTitle>
              <CardDescription>Manage your personal account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="account" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="appearance" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="notifications" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Scheduling Settings</CardTitle>
              <CardDescription>Adjust work hours, session duration, and calendar integrations.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="schedule" />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
