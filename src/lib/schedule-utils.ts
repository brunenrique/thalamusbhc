export interface Appointment {
  start: Date
  end: Date
}

export function hasConflict(existing: Appointment[], candidate: Appointment): boolean {
  return existing.some(appt =>
    (candidate.start < appt.end && candidate.end > appt.start)
  )
}

export function addAppointment(existing: Appointment[], candidate: Appointment): Appointment[] {
  if (hasConflict(existing, candidate)) {
    throw new Error('Conflicting appointment')
  }
  return [...existing, candidate]
}
