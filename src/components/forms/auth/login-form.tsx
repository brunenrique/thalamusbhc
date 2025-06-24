'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  signInWithEmailAndPassword,
  getIdToken,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useApiForm } from '@/hooks/use-api-form';
import { auth } from '@/lib/firebase';
import logger, { logAction } from '@/lib/logger';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { isSubmitting, handleSubmit } = useApiForm<LoginFormValues>({
    apiFunction: async (data) => {
      // Define a persistência da sessão com base na escolha do usuário
      await setPersistence(
        auth,
        data.rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      
      // Realiza o login com email e senha
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      // Obtém o token de ID do usuário
      const idToken = await getIdToken(userCredential.user);

      // Envia o token para a API de login do backend para criar a sessão
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      // Registra a ação de login bem-sucedido
      logAction(userCredential.user.uid, 'login_success');
    },
    successMessage: 'Login realizado com sucesso! Redirecionando...',
    onSuccess: () => router.push('/dashboard'),
    onError: (error: any) => {
      // Captura a exceção no Sentry para monitoramento de erros
      Sentry.captureException(error);
      logger.error({ action: 'login_error', meta: { error } });

      let description = 'Não foi possível fazer login.';

      // Personaliza a mensagem de erro com base no código do Firebase
      if (error?.code) { // Verifica se 'code' existe no objeto de erro
        const firebaseError = error as FirebaseError;
        switch (firebaseError.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            description = 'E-mail ou senha inválidos.';
            break;
          case 'auth/user-disabled':
            description = 'Este usuário foi desabilitado.';
            break;
          case 'auth/too-many-requests':
            description = 'Acesso temporariamente bloqueado devido a muitas tentativas. Tente novamente mais tarde.';
            break;
        }
      }

      // Exibe a notificação (toast) de erro para o usuário
      toast({
        title: 'Erro ao fazer login',
        description,
        variant: 'destructive',
      });
    },
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  // Função que será chamada no submit do formulário, repassando os dados para o hook
  const onSubmit = (data: LoginFormValues) => {
    handleSubmit(data);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nome@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      aria-label="Lembrar-me"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Lembrar-me</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
