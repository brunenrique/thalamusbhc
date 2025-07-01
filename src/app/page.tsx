<<<<<<< HEAD

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, CheckCircle } from "lucide-react";

const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection"), {
  loading: () => <div className="h-32" />,
});

const CtaSection = dynamic(() => import("@/components/home/CtaSection"), {
  loading: () => <div className="h-20" />,
});


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-2xl font-headline font-bold text-primary">Thalamus</span>
          </Link>
          <nav className="flex items-center gap-4">
            {/* <Link href="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Recursos</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Preços</Link> */}
            <Link href="/login" passHref legacyBehavior>
              <Button as="a" variant="ghost">
                <span className="inline-flex items-center gap-2">Entrar</span>
              </Button>
            </Link>
            <Link href="/signup" passHref legacyBehavior>
              <Button as="a" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <span className="inline-flex items-center gap-2">Criar Conta Grátis</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24 lg:py-32">
          <div className="space-y-6">
            <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary">
              Eleve sua Prática Psicológica com Inteligência Artificial
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
              Thalamus é a plataforma completa para psicólogos modernos. Agenda, prontuários seguros, insights com IA e ferramentas que transformam sua rotina clínica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" passHref legacyBehavior>
                <Button as="a" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                  <span className="inline-flex items-center gap-2">
                    Comece Agora (Grátis por 14 dias)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
              {/* <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Ver Demonstração
              </Button> */}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Interface da plataforma Thalamus em um laptop"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
              data-ai-hint="software interface"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+AMAAwAD/50IHAAAAABJRU5ErkJggg=="
            />
             <div className="absolute -top-8 -right-8 bg-primary/10 p-4 rounded-lg shadow-lg w-48">
                <Brain className="w-6 h-6 text-primary mb-2" />
                <p className="text-xs font-semibold text-primary-foreground/80">Insights de IA potencializando sua clínica.</p>
            </div>
             <div className="absolute -bottom-8 -left-8 bg-secondary p-4 rounded-lg shadow-lg w-56">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs font-semibold text-secondary-foreground">"Finalmente uma ferramenta que entende minhas necessidades!" - Psicóloga Satisfeita</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Call to Action Section */}
        <CtaSection />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Thalamus. Todos os direitos reservados.</p>
          <nav className="flex gap-4">
            <Link href="/terms-of-service" className="hover:text-primary">Termos de Serviço</Link>
            <Link href="/privacy-policy" className="hover:text-primary">Política de Privacidade</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
=======
import { LoginForm } from "@/features/authentication";

export default function LoginPage() {
  return <LoginForm />;
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
}
