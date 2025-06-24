import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container text-center">
        <h2 className="text-3xl font-headline font-bold sm:text-4xl">
          Pronto para Transformar Sua Prática?
        </h2>
        <p className="mt-4 mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
          Junte-se a centenas de psicólogos que estão usando o Thalamus para focar no que realmente importa: seus pacientes.
        </p>
        <Link href="/signup" passHref legacyBehavior>
          <Button as="a" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
            <span className="inline-flex items-center gap-2">
              Experimente o Thalamus Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </Button>
        </Link>
      </div>
    </section>
  );
}
