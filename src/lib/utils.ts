import { clsx, type ClassValue } from "clsx"
<<<<<<< HEAD
import { format, differenceInYears } from "date-fns"
=======
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
<<<<<<< HEAD

export function formatDateBR(date: Date) {
  return format(date, "dd/MM/yyyy")
}

export function formatDateTime(date: Date) {
  return format(date, "dd/MM/yyyy HH:mm")
}

export function getAge(dateOfBirth: Date) {
  return differenceInYears(new Date(), dateOfBirth)
}
=======
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
