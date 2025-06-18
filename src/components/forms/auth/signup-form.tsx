
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const passwordStrength = z.string()
  .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
  .regex(/(?=.*[a-z])/, { message: "Inclua letras minúsculas." })
  .regex(/(?=.*[A-Z])/, { message: "Inclua letras maiúsculas." })
  .regex(/(?=.*\d)/, { message: "Inclua números." })
  .regex(/(?=.*[!@#$%^&*])/, { message: "Inclua caracteres especiais." });

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "O nome completo deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido." }),
  password: passwordStrength,
  confirmPassword: z.string(),
  gender: z.enum(['masculino', 'feminino', 'outro'], { required_error: "Por favor, selecione um gênero." }),
  role: z.enum(["psychologist", "secretary", "admin"], { required_error: "Por favor, selecione uma função." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: undefined, // Initialize as undefined
      role: undefined, // Initialize as undefined
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true);
    // Simula chamada de API e validação de e-mail existente
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (data.email === "existing@example.com") {
      form.setError("email", { message: "E-mail já está em uso" });
      toast({ title: "Erro", description: "E-mail já está em uso", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    toast({ title: "Sucesso", description: "Cadastro realizado com sucesso" });
    setIsLoading(false);
    router.push("/dashboard");
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="name"
                      aria-label="Nome completo"
                      placeholder="Nome Sobrenome"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      aria-label="Email"
                      placeholder="nome@exemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Prefiro não informar / Outro</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input
                      type="password"
                      autoComplete="new-password"
                      aria-label="Senha"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      aria-label="Confirmar senha"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="psychologist">Psicólogo(a)</SelectItem>
                      <SelectItem value="secretary">Secretário(a)</SelectItem>
                      <SelectItem value="admin">Administrador(a)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? "Criando Conta..." : "Criar Conta"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
