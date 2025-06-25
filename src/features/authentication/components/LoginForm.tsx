import Link from "next/link";
import { Button } from "@/atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/atoms/card";
import { Input } from "@/atoms/input";
import { Label } from "@/atoms/label";
import { ThalamusLogo } from "@/atoms/logo";

export function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="inline-block rounded-full bg-primary/10 p-4">
            <ThalamusLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Thalamus</CardTitle>
          <CardDescription>
            Digite seu e-mail abaixo para fazer login em sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href="/dashboard">Entrar</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="#" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
