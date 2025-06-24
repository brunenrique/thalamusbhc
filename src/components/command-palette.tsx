'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { useState } from 'react'
import { useCommandPalette } from '@/stores/commandPaletteStore'
import { commands } from '@/constants/commands'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/utils'

export default function CommandPalette() {
  const { isOpen, close } = useCommandPalette()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = commands.filter((cmd) => {
    const term = search.toLowerCase()
    return (
      cmd.title.toLowerCase().includes(term) ||
      cmd.keywords.some((k) => k.includes(term))
    )
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24">
      <CommandPrimitive
        label="Paleta de Comandos"
        className="w-full max-w-md overflow-hidden rounded-md bg-popover text-popover-foreground shadow-lg"
      >
        <CommandPrimitive.Input
          placeholder="Digite um comando..."
          value={search}
          onValueChange={setSearch}
          className="border-b bg-background px-3 py-2 text-sm outline-none"
        />
        <CommandPrimitive.List className="max-h-72 overflow-y-auto">
          {filtered.map((cmd) => (
            <CommandPrimitive.Item
              key={cmd.id}
              onSelect={() => {
                close()
                cmd.action(router)
              }}
              className={cn(
                'flex cursor-pointer items-center gap-2 px-3 py-2 aria-selected:bg-accent'
              )}
            >
              <cmd.icon className="h-4 w-4" />
              <span>{cmd.title}</span>
            </CommandPrimitive.Item>
          ))}
        </CommandPrimitive.List>
      </CommandPrimitive>
    </div>
  )
}
