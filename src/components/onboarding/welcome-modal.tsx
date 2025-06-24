'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CheckCircle } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bem-vindo(a) à Plataforma!</DialogTitle>
          <DialogDescription>
            Aqui estão alguns passos para você começar a usar todo o nosso potencial.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <h3 className="font-semibold">Seus Primeiros Passos:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Crie seu primeiro paciente</li>
            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Agende uma consulta na agenda</li>
            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Explore o Mapa de Formulação Clínica</li>
          </ul>
        </div>
        <Button onClick={onClose} className="w-full">Começar a Usar</Button>
      </DialogContent>
    </Dialog>
  )
}
