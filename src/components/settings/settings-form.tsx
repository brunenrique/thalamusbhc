"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface SettingsFormProps {
  section: "general" | "account" | "appearance" | "notifications" | "schedule";
}

export default function SettingsForm({ section }: SettingsFormProps) {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Process form data based on section
    console.log(`Saving settings for ${section}...`, new FormData(event.currentTarget));
    toast({
      title: "Settings Saved",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {section === "general" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input id="clinicName" defaultValue="My Psychology Clinic" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinicAddress">Clinic Address</Label>
            <Input id="clinicAddress" defaultValue="123 Wellness St, Mindful City" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="enableOnlineBooking" />
            <Label htmlFor="enableOnlineBooking">Enable Online Booking</Label>
          </div>
        </>
      )}

      {section === "account" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" defaultValue="Dr. John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <Button variant="outline" type="button">Change Password</Button>
        </>
      )}
      
      {section === "appearance" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {section === "notifications" && (
        <>
          <p className="font-medium">Email Notifications</p>
          <div className="flex items-center space-x-2">
            <Checkbox id="appointmentReminders" defaultChecked/>
            <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="taskUpdates" defaultChecked/>
            <Label htmlFor="taskUpdates">Task Updates & Reminders</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="assessmentNotifications" defaultChecked/>
            <Label htmlFor="assessmentNotifications">Assessment Notifications (Sent/Completed)</Label>
          </div>
          <p className="font-medium pt-4">In-App Notifications</p>
           <div className="flex items-center space-x-2">
            <Switch id="inAppTaskAlerts" defaultChecked />
            <Label htmlFor="inAppTaskAlerts">Task Alerts</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="inAppSystemMessages" defaultChecked />
            <Label htmlFor="inAppSystemMessages">System Messages & Updates</Label>
          </div>
        </>
      )}

      {section === "schedule" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="workStartTime">Default Work Start Time</Label>
                <Input id="workStartTime" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="workEndTime">Default Work End Time</Label>
                <Input id="workEndTime" type="time" defaultValue="17:00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionDuration">Default Session Duration (minutes)</Label>
            <Input id="sessionDuration" type="number" defaultValue="50" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="externalCalendarSync" />
            <Label htmlFor="externalCalendarSync">Enable External Calendar Integration (e.g., Google Calendar)</Label>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </form>
  );
}
