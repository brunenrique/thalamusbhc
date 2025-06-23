'use client'

import LoginForm from '@/components/forms/auth/login-form'
import Link from 'next/link'
import { Brain } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px] rounded-xl shadow-sm p-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Brain className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-headline font-bold text-primary">Thalamus</h1>
          </Link>
          <h2 className="text-2xl font-headline font-semibold tracking-tight text-foreground">Entrar</h2>
          <p className="text-sm text-muted-foreground">Utilize suas credenciais para acessar o Thalamus.</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Novo por aqui?{' '}
          <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
