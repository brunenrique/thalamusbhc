# **App Name**: PsiGuard

## Core Features:

- Role-Based Access Control: Role-based access control with Admin, Psychologist, and Secretary roles, managed via Firebase Authentication and Firestore.
- Encrypted Patient Records: Secure patient records with client-side AES encryption, ensuring data privacy for sensitive information.
- Appointment Scheduling: Calendar interface for managing and viewing appointments, with day, week, and month views.
- Automated Notifications: Automated notifications via Cloud Functions for appointment reminders, task reminders, and assessment links.
- Waiting List Management: Manage patient waiting lists and allocate patients to open slots in the appointment schedule.
- AI-Powered Session Insights: AI tool integration to process session notes, identify keywords, themes, and generate charts of symptom evolution. The tool provides suggestive insights.
- Assessment Management: Manage custom assessment forms and track their completion status, with tokenized assessment links for secure access.
- Analytics Dashboard: Dashboard with charts and metrics for sessions, schedule occupancy, and psychologist performance.
- Task Management: Manage and track tasks assigned to different users, with status updates and automated reminders.
- System Configurations: System settings for adjusting visibility of metrics, work hours, session duration, and external integrations.
- Timeline System: Client-side timeline for displaying relevant patient and clinic events.
- External Calendar Integration: Integration with external calendars for psychologists to export appointments, potentially with bidirectional sync.
- Shared Resources & Documents: Upload and manage PDFs/guides, associate with patients, and securely share via temporary links or patient portal.
- Internal Team Notifications: Internal notification system for team alerts, task reminders, and secure messaging.
- Intelligent Templates: AI tool assisted creation and management of session note templates with auto-completion and draft report generation. The tool suggests text completions.

## Style Guidelines:

- Primary color: Soft Lavender (#D0BFFF) for a calming and professional feel.
- Background color: Light gray (#F5F5F5) to ensure readability and a clean interface.
- Accent color: Gentle Teal (#70C1B3) for key actions and highlights, promoting trust.
- Body text: 'Inter' (14-16px, line-height 1.5x-1.6x, weights for legibility).
- Headline font: 'Space Grotesk' (for h1, h2), 'Inter' for subtitles.
- Use professional, clean icons related to healthcare and psychology.
- Use a consistent grid system for responsive design across different screen sizes.
- Implement visual states (hover, focus, active, disabled) and feedback (loading, success/error, confirmation) for all interactions.