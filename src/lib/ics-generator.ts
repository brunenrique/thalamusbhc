
import { type Appointment, type AppointmentsByDate } from '@/types/appointment';
import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';

// Function to format a date string (YYYY-MM-DD) and time string (HH:mm) into an ICS compatible UTC string (YYYYMMDDTHHMMSSZ)
function formatToICSDateTime(dateString: string, timeString: string, timeZone: string = 'America/Sao_Paulo'): string {
  const dateTimeString = `${dateString}T${timeString}`; // e.g., "2024-08-15T10:00"
  
  const dateInSpecifiedTimeZoneAsUtc = toDate(dateTimeString, { timeZone });
  
  return format(dateInSpecifiedTimeZoneAsUtc, "yyyyMMdd'T'HHmmss'Z'");
}


function generateUID(length: number = 16): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result + '@thalamus.app'; // Updated domain
}

const psychologistNameMap: Record<string, string> = {
  'psy1': 'Dr. Silva',
  'psy2': 'Dra. Jones',
};

export function generateICS(appointmentsByDate: AppointmentsByDate, specificDate?: Date): string {
  let icsString = 'BEGIN:VCALENDAR\r\n';
  icsString += 'VERSION:2.0\r\n';
  icsString += `PRODID:-//Thalamus//App//EN\r\n`; // Updated PRODID
  icsString += 'CALSCALE:GREGORIAN\r\n';

  const dtStamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

  for (const dateKey in appointmentsByDate) {
    if (specificDate && format(specificDate, "yyyy-MM-dd") !== dateKey) {
        continue; 
    }

    const appointmentsOnDate = appointmentsByDate[dateKey];
    appointmentsOnDate.forEach(appointment => {
      if (appointment.status === 'CancelledByClinic' || appointment.status === 'CancelledByPatient') {
        return; 
      }

      const dtStart = formatToICSDateTime(dateKey, appointment.startTime);
      const dtEnd = formatToICSDateTime(dateKey, appointment.endTime);
      
      let summary = appointment.type === 'Blocked Slot' 
        ? `Bloqueio: ${appointment.blockReason || 'Horário Bloqueado'}` 
        : `Consulta: ${appointment.patient}`;
      
      const descriptionParts: string[] = [];
      descriptionParts.push(`Tipo: ${appointment.type}`);

      if (appointment.psychologistId) {
        const psychologistName = psychologistNameMap[appointment.psychologistId] || appointment.psychologistId;
        descriptionParts.push(`Psicólogo(a): ${psychologistName}`);
      }
      if (appointment.notes) {
        descriptionParts.push(`Observações: ${appointment.notes.replace(/\n/g, '\\n')}`);
      }
      descriptionParts.push(`Status: ${appointment.status}`);
      const description = descriptionParts.join('\\n');


      icsString += 'BEGIN:VEVENT\r\n';
      icsString += `UID:${appointment.id}-${dateKey}-${generateUID(8)}\r\n`; // UID generation now uses new domain
      icsString += `DTSTAMP:${dtStamp}\r\n`;
      icsString += `DTSTART:${dtStart}\r\n`;
      icsString += `DTEND:${dtEnd}\r\n`;
      icsString += `SUMMARY:${summary}\r\n`;
      icsString += `DESCRIPTION:${description}\r\n`;
      icsString += `LOCATION:Consultório Thalamus / Online\r\n`; 
      icsString += `STATUS:${appointment.status.toUpperCase()}\r\n`;
      icsString += 'END:VEVENT\r\n';
    });
  }

  icsString += 'END:VCALENDAR\r\n';
  return icsString;
}
