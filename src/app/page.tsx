import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary">
      <header className="container mx-auto py-6 px-4 md:px-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-primary">PsiGuard</h1>
          </div>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="ml-2">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto flex flex-col items-center justify-center text-center px-4 py-12 md:py-24">
        <h2 className="text-5xl md:text-6xl font-headline font-bold mb-6 text-foreground">
          Empowering Mental Wellness Professionals
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          PsiGuard offers a secure, intuitive, and AI-enhanced platform for managing your psychological practice, so you can focus on what matters most: your patients.
        </p>
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </main>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-headline font-bold text-center mb-12 text-foreground">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-accent" />}
              title="Secure & Compliant"
              description="Role-based access and client-side AES encryption for patient records ensure data privacy and security."
            />
            <FeatureCard
              icon={<Brain className="w-10 h-10 text-accent" />}
              title="AI-Powered Insights"
              description="Leverage AI for session note analysis, template generation, and identifying patient progress trends."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-accent" />}
              title="Streamlined Workflow"
              description="Integrated appointment scheduling, task management, and automated notifications to optimize your practice."
            />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PsiGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center">
        {icon}
      </CardHeader>
      <CardContent>
        <CardTitle className="font-headline text-2xl mb-2 text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
