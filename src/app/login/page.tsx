import LoginForm from "@/components/auth/login-form";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Brain className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-headline font-bold text-primary">PsiGuard</h1>
          </Link>
          <h2 className="text-2xl font-headline font-semibold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign Up
          </Link>
        </p>
         <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/forgot-password"
            className="underline underline-offset-4 hover:text-primary"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
