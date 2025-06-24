import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import type { LucideIcon } from 'lucide-react'
import { Home, UserPlus } from 'lucide-react'

export interface Command {
  id: string
  title: string
  keywords: string[]
  icon: LucideIcon
  action: (router: AppRouterInstance) => void
}

export const commands: Command[] = [
  {
    id: 'dashboard',
    title: 'Ir para Dashboard',
    keywords: ['home', 'início'],
    icon: Home,
    action: (router) => router.push('/dashboard'),
  },
  {
    id: 'new-patient',
    title: 'Criar Novo Paciente',
    keywords: ['novo', 'paciente', 'adicionar', 'pessoa'],
    icon: UserPlus,
    action: (router) => router.push('/patients/new'),
  },
]
