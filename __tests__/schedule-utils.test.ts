import { addAppointment, hasConflict } from '../src/lib/schedule-utils'

describe('schedule utils', () => {
  const existing = [
    { start: new Date('2024-01-01T10:00:00Z'), end: new Date('2024-01-01T11:00:00Z') }
  ]

  it('detects conflicts', () => {
    const candidate = { start: new Date('2024-01-01T10:30:00Z'), end: new Date('2024-01-01T11:30:00Z') }
    expect(hasConflict(existing, candidate)).toBe(true)
  })

  it('adds appointment when no conflict', () => {
    const candidate = { start: new Date('2024-01-01T11:30:00Z'), end: new Date('2024-01-01T12:30:00Z') }
    const updated = addAppointment(existing, candidate)
    expect(updated.length).toBe(2)
  })
})
