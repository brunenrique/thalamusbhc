"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageSquare, FileText, CalendarPlus, UserPlus, AlertCircle } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: 'appointment' | 'note' | 'assessment_sent' | 'assessment_completed' | 'new_patient' | 'task_created' | 'system_alert';
  date: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const mockTimelineEvents: TimelineEvent[] = [
  { id: "evt1", type: "new_patient", date: "2024-07-01", title: "Patient Record Created", description: "Alice Wonderland added to system.", icon: <UserPlus className="w-5 h-5 text-green-500" /> },
  { id: "evt2", type: "assessment_sent", date: "2024-07-01", title: "Beck Depression Inventory Sent", description: "Assessment link sent via email.", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  { id: "evt3", type: "appointment", date: "2024-07-08", title: "Initial Consultation", description: "With Dr. Smith. Duration: 60 mins.", icon: <CalendarPlus className="w-5 h-5 text-purple-500" /> },
  { id: "evt4", type: "note", date: "2024-07-08", title: "Session Note Added", description: "Explored family dynamics.", icon: <MessageSquare className="w-5 h-5 text-yellow-500" /> },
  { id: "evt5", type: "assessment_completed", date: "2024-07-10", title: "Beck Depression Inventory Completed", description: "Score: 15/63 (Mild)", icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { id: "evt6", type: "appointment", date: "2024-07-15", title: "Follow-up Session", description: "With Dr. Smith. Duration: 50 mins.", icon: <CalendarPlus className="w-5 h-5 text-purple-500" /> },
  { id: "evt7", type: "note", date: "2024-07-15", title: "Session Note Added", description: "Discussed coping mechanisms.", icon: <MessageSquare className="w-5 h-5 text-yellow-500" /> },
  { id: "evt8", type: "system_alert", date: "2024-07-18", title: "Upcoming Appointment Reminder Sent", description: "For appointment on 2024-07-22.", icon: <AlertCircle className="w-5 h-5 text-red-500" /> },
];


interface PatientTimelineProps {
  patientId: string;
}

export default function PatientTimeline({ patientId }: PatientTimelineProps) {
  // In a real app, fetch events for patientId
  const [events, setEvents] = React.useState<TimelineEvent[]>(mockTimelineEvents);

  if (events.length === 0) {
    return <p className="text-muted-foreground">No timeline events available for this patient.</p>;
  }

  return (
    <div className="relative">
      {/* The vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border -z-10" />
      
      <ul className="space-y-8">
        {events.map((event) => (
          <li key={event.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-card border flex items-center justify-center shadow-sm z-10">
              {event.icon || <CheckCircle className="w-5 h-5 text-muted-foreground" />}
            </div>
            <div className="flex-1 pt-1.5">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <time className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</time>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
