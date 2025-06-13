import { clsx, type ClassValue } from "clsx"
import { format, differenceInYears } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateBR(date: Date) {
  return format(date, "dd/MM/yyyy")
}

export function formatDateTime(date: Date) {
  return format(date, "dd/MM/yyyy HH:mm")
}

export function getAge(dateOfBirth: Date) {
  return differenceInYears(new Date(), dateOfBirth)
}
