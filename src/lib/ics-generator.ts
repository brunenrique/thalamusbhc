
import { type Appointment, type AppointmentsByDate } from '@/components/schedule/appointment-calendar';
import { format, parse, addHours, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Function to format a date string (YYYY-MM-DD) and time string (HH:mm) into an ICS compatible UTC string (YYYYMMDDTHHMMSSZ)
function formatToICSDateTime(dateString: string, timeString: string, timeZone: string = 'America/Sao_Paulo'): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Combine dateString and timeString into a Date object, interpreting it in the local (server/client) timezone first
  const localDate = parse(`${dateString}T${timeString}`, "yyyy-MM-dd'T'HH:mm", new Date());

  // Convert this local date to a UTC date
  const utcDate = zonedTimeToUtc(localDate, timeZone);
  
  return format(utcDate, "yyyyMMdd'T'HHmmss'Z'");
}


function generateUID(length: number = 16): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result + '@psiguard.app';
}

export function generateICS(appointmentsByDate: AppointmentsByDate, specificDate?: Date): string {
  let icsString = 'BEGIN:VCALENDAR\r\n';
  icsString += 'VERSION:2.0\r\n';
  icsString += `PRODID:-//PsiGuard//App//EN\r\n`;
  icsString += 'CALSCALE:GREGORIAN\r\n';
  // Optionally add timezone information
  // icsString += 'BEGIN:VTIMEZONE\r\n';
  // icsString += 'TZID:America/Sao_Paulo\r\n';
  // ... (full VTIMEZONE definition)
  // icsString += 'END:VTIMEZONE\r\n';


  const dtStamp = format(zonedTimeToUtc(new Date(), 'America/Sao_Paulo'), "yyyyMMdd'T'HHmmss'Z'");

  for (const dateKey in appointmentsByDate) {
    if (specificDate && format(specificDate, "yyyy-MM-dd") !== dateKey) {
        continue; // Skip if a specific date is provided and it doesn't match
    }

    const appointmentsOnDate = appointmentsByDate[dateKey];
    appointmentsOnDate.forEach(appointment => {
      if (appointment.status === 'CancelledByClinic' || appointment.status === 'CancelledByPatient') {
        return; // Skip cancelled appointments
      }

      const dtStart = formatToICSDateTime(dateKey, appointment.startTime);
      const dtEnd = formatToICSDateTime(dateKey, appointment.endTime);
      
      let summary = appointment.type === 'Blocked Slot' 
        ? `Bloqueio: ${appointment.blockReason || 'Horário Bloqueado'}` 
        : `Consulta: ${appointment.patient}`;
      
      let description = `Tipo: ${appointment.type}\\n`;
      if (appointment.psychologistId) {
        const psychologistName = appointment.psychologistId === 'psy1' ? 'Dr. Silva' : 
                               appointment.psychologistId === 'psy2' ? 'Dra. Jones' : appointment.psychologistId;
        description += `Psicólogo(a): ${psychologistName}\\n`;
      }
      if (appointment.notes) {
        description += `Observações: ${appointment.notes.replace(/\n/g, '\\n')}\\n`;
      }
      description += `Status: ${appointment.status}`;


      icsString += 'BEGIN:VEVENT\r\n';
      icsString += `UID:${appointment.id}-${dateKey}@psiguard.app\r\n`;
      icsString += `DTSTAMP:${dtStamp}\r\n`;
      icsString += `DTSTART:${dtStart}\r\n`;
      icsString += `DTEND:${dtEnd}\r\n`;
      // If using TZID in VTIMEZONE:
      // icsString += `DTSTART;TZID=America/Sao_Paulo:${formatToICSDateTime(dateKey, appointment.startTime, true)}\r\n`;
      // icsString += `DTEND;TZID=America/Sao_Paulo:${formatToICSDateTime(dateKey, appointment.endTime, true)}\r\n`;
      icsString += `SUMMARY:${summary}\r\n`;
      icsString += `DESCRIPTION:${description}\r\n`;
      icsString += `LOCATION:Consultório PsiGuard / Online\r\n`; // Generic location
      icsString += `STATUS:${appointment.status.toUpperCase()}\r\n`;
      icsString += 'END:VEVENT\r\n';
    });
  }

  icsString += 'END:VCALENDAR\r\n';
  return icsString;
}
