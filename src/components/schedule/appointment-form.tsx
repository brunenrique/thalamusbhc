
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Clock, Save, User, Users, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual data fetching
const mockPatients = [
  { id: "1", name: "Alice Wonderland" },
  { id: "2", name: "Bob The Builder" },
  { id: "3", name: "Charlie Brown" },
];
const mockPsychologists = [
  { id: "psy1", name: "Dr. Smith" },
  { id: "psy2", name: "Dr. Jones" },
];
const appointmentTypes = ["Initial Consultation", "Follow-up", "Therapy Session", "Assessment Review", "Group Session"];

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, {message: "Please select a patient."}),
  psychologistId: z.string().min(1, {message: "Please select a psychologist."}),
  appointmentDate: z.date({ required_error: "Please select a date." }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:mm)." }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:mm)." }),
  appointmentType: z.string().min(1, {message: "Please select an appointment type."}),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  // recurrenceRule: z.string().optional(), // For more complex recurrence
  isBlockTime: z.boolean().default(false), // For blocking time slots
  blockReason: z.string().optional(),
}).refine(data => {
    if (data.isBlockTime) return true; // No need to validate end time if it's a block
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
        return false;
    }
    return true;
}, {
    message: "End time must be after start time.",
    path: ["endTime"],
}).refine(data => {
    if (data.isBlockTime && !data.blockReason) return false;
    return true;
}, {
    message: "Reason is required if blocking time.",
    path: ["blockReason"],
});


type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  appointmentData?: Partial<AppointmentFormValues & { id?: string }>; // For editing
}

export default function AppointmentForm({ appointmentData }: AppointmentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isBlockTime, setIsBlockTime] = React.useState(appointmentData?.isBlockTime || false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: appointmentData?.patientId || "",
      psychologistId: appointmentData?.psychologistId || "",
      appointmentDate: appointmentData?.appointmentDate ? new Date(appointmentData.appointmentDate) : new Date(),
      startTime: appointmentData?.startTime || "09:00",
      endTime: appointmentData?.endTime || "10:00",
      appointmentType: appointmentData?.appointmentType || "",
      notes: appointmentData?.notes || "",
      isRecurring: appointmentData?.isRecurring || false,
      isBlockTime: appointmentData?.isBlockTime || false,
      blockReason: appointmentData?.blockReason || "",
    },
  });
  
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'isBlockTime') {
        setIsBlockTime(!!value.isBlockTime);
        if (value.isBlockTime) {
          form.setValue('patientId', ''); // Clear patient if blocking time
          form.setValue('appointmentType', ''); // Clear type if blocking time
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  async function onSubmit(data: AppointmentFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const finalData = {...data};
    if(data.isBlockTime) {
      finalData.appointmentType = "Blocked Slot";
      finalData.patientId = "N/A"; // Or a specific system ID for blocked slots
    }

    console.log("Appointment data:", finalData);
    setIsLoading(false);
    toast({
      title: appointmentData?.id ? "Appointment Updated" : (data.isBlockTime ? "Time Blocked" : "Appointment Scheduled"),
      description: `The ${data.isBlockTime ? 'time slot' : 'appointment'} for ${data.isBlockTime ? data.blockReason : mockPatients.find(p=>p.id === data.patientId)?.name} on ${format(data.appointmentDate, "PPP")} has been successfully ${appointmentData?.id ? 'updated' : 'created'}.`,
    });
    router.push("/schedule");
  }

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">
              {appointmentData?.id ? "Edit Appointment" : (isBlockTime ? "Block Time Slot" : "Schedule New Appointment")}
            </CardTitle>
            <CardDescription>
                {isBlockTime ? "Mark a time slot as unavailable in the schedule." : "Fill in the details to schedule a new appointment."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField
                control={form.control}
                name="isBlockTime"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-muted/30">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isBlockTime"
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="isBlockTime" className="font-medium cursor-pointer">
                        Block this time slot (e.g., for unavailability, meeting)
                        </FormLabel>
                    </div>
                    </FormItem>
                )}
            />

            {!isBlockTime && (
                <>
                <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Patient *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {mockPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="appointmentType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Appointment Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {appointmentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </>
            )}

            {isBlockTime && (
                 <FormField
                    control={form.control}
                    name="blockReason"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reason for Blocking *</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Team Meeting, Personal Time" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="psychologistId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Psychologist *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a psychologist" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {mockPsychologists.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Date *</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP")
                                ) : (
                                <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Start Time *</FormLabel>
                        <FormControl>
                        <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>End Time *</FormLabel>
                        <FormControl>
                        <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any relevant notes for this appointment..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!isBlockTime && (
                <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="isRecurring"
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="isRecurring" className="font-medium cursor-pointer">
                            This is a recurring appointment
                            </FormLabel>
                            <FormDescription>
                            (Detailed recurrence settings will be available soon)
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                />
            )}

          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? (appointmentData?.id ? "Saving..." : (isBlockTime ? "Blocking..." : "Scheduling...")) : (appointmentData?.id ? "Save Changes" : (isBlockTime ? "Block Time Slot" : "Schedule Appointment"))}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
