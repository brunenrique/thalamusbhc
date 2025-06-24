import { Brain, CheckCircle, ShieldCheck, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "IA para Psicólogos",
    description:
      "Otimize seu tempo com resumos de sessão, insights e sugestões de plano de tratamento gerados por IA.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    title: "Agenda Inteligente",
    description:
      "Gerenciamento fácil de consultas, lembretes automáticos e visualização clara da sua semana.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
    title: "Prontuários Seguros",
    description:
      "Registros criptografados e em conformidade com a LGPD, garantindo a privacidade dos seus pacientes.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
    title: "Métricas e Relatórios",
    description:
      "Acompanhe o progresso dos pacientes e a performance da sua clínica com dados visuais.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold sm:text-4xl">
            Tudo que Você Precisa em um Só Lugar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Funcionalidades pensadas para simplificar seu dia a dia e potencializar seus atendimentos.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

