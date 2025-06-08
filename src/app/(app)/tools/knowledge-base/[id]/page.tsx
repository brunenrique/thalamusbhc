
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpenText, CalendarDays, Tag } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data - em uma aplicação real, isso viria de um backend
const mockArticlesData = [
  { id: "kb1", title: "Entendendo Técnicas de TCC", category: "Abordagens Terapêuticas", lastUpdated: "2024-07-15", summary: "Uma visão geral das principais técnicas da Terapia Cognitivo-Comportamental, incluindo reestruturação cognitiva, exposição gradual e ativação comportamental.", content: "A Terapia Cognitivo-Comportamental (TCC) é uma abordagem psicoterapêutica estruturada, orientada para objetivos e focada no presente, que visa ajudar os pacientes a identificar e modificar pensamentos, crenças e comportamentos disfuncionais.\n\nPrincipais Técnicas:\n1. Reestruturação Cognitiva: Ajuda os pacientes a identificar pensamentos automáticos negativos, avaliar sua validade e substituí-los por pensamentos mais realistas e adaptativos.\n2. Exposição Gradual: Utilizada principalmente para transtornos de ansiedade, envolve expor gradualmente o paciente a situações ou objetos temidos em um ambiente seguro e controlado, ajudando a reduzir a resposta de medo.\n3. Ativação Comportamental: Focada em aumentar o envolvimento do paciente em atividades prazerosas ou significativas, especialmente útil no tratamento da depressão.\n4. Treinamento de Habilidades Sociais: Ensina e pratica habilidades de comunicação e interação social.\n5. Resolução de Problemas: Ajuda os pacientes a desenvolver habilidades para identificar problemas, gerar soluções e implementá-las de forma eficaz.\n\nA TCC é eficaz para uma ampla gama de transtornos, incluindo depressão, ansiedade, TOC, TEPT e transtornos alimentares. Requer uma colaboração ativa entre terapeuta e paciente." },
  { id: "kb2", title: "Gerenciando Transferência na Terapia", category: "Habilidades Clínicas", lastUpdated: "2024-06-20", summary: "Estratégias para identificar, compreender e gerenciar eticamente os fenômenos de transferência e contratransferência na relação terapêutica.", content: "A transferência ocorre quando o paciente projeta inconscientemente sentimentos, desejos e expectativas de relacionamentos passados (geralmente com figuras parentais) no terapeuta. A contratransferência é a resposta emocional do terapeuta ao paciente, que também pode ser influenciada pelas próprias experiências passadas do terapeuta.\n\nGerenciamento Ético:\n- Autoconsciência: O terapeuta deve estar ciente de suas próprias reações emocionais.\n- Supervisão: Discutir casos em supervisão pode ajudar a identificar e lidar com a contratransferência.\n- Uso Terapêutico: A transferência pode ser uma ferramenta valiosa para explorar os padrões de relacionamento do paciente.\n- Limites: Manter limites profissionais claros é crucial.\n\nÉ importante que o terapeuta não aja com base em sentimentos de contratransferência de forma prejudicial ao paciente. O objetivo é usar a compreensão desses fenômenos para aprofundar o trabalho terapêutico." },
  { id: "kb3", title: "Considerações Éticas em Teleatendimento", category: "Ética e Legal", lastUpdated: "2024-05-01", summary: "Principais diretrizes éticas para fornecer serviços de terapia remota, abordando confidencialidade, consentimento informado e segurança de dados.", content: "O teleatendimento em saúde mental apresenta desafios éticos específicos:\n\n1. Confidencialidade e Privacidade: Garantir que as plataformas de comunicação sejam seguras (criptografadas) e que o ambiente do paciente e do terapeuta seja privado.\n2. Consentimento Informado: O consentimento deve abordar os riscos e benefícios do teleatendimento, incluindo limitações tecnológicas, protocolos de emergência e segurança de dados.\n3. Competência Tecnológica: Terapeutas devem ser competentes no uso das tecnologias escolhidas e ter planos de contingência para falhas.\n4. Jurisdição e Licenciamento: Terapeutas devem estar cientes das leis e regulamentos de licenciamento que se aplicam ao fornecer serviços transfronteiriços (entre estados ou países).\n5. Identificação e Gerenciamento de Crises: Estabelecer protocolos claros para lidar com emergências ou crises à distância.\n6. Segurança de Dados: Proteger os registros eletrônicos e as comunicações de acordo com as leis de proteção de dados aplicáveis (ex: HIPAA, LGPD).\n\nÉ fundamental manter-se atualizado com as diretrizes éticas e legais específicas para o teleatendimento em sua jurisdição." },
];

const getArticle = (id: string) => {
  return mockArticlesData.find(article => article.id === id);
}

export default function KnowledgeBaseArticlePage({ params }: { params: { id: string } }) {
  const article = getArticle(params.id);

  if (!article) {
    return (
      <div className="space-y-6 text-center">
        <BookOpenText className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-headline font-bold">Artigo Não Encontrado</h1>
        <p className="text-muted-foreground">O artigo que você está procurando não existe ou foi movido.</p>
        <Button asChild variant="outline">
          <Link href="/tools/knowledge-base">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Base de Conhecimento
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/tools/knowledge-base">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Base de Conhecimento
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{article.title}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
            <span className="flex items-center"><Tag className="mr-1.5 h-4 w-4" /> Categoria: {article.category}</span>
            <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> Última Atualização: {format(new Date(article.lastUpdated), "P", { locale: ptBR })}</span>
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent className="pt-6">
          <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <p className="lead text-lg text-muted-foreground mb-6">{article.summary}</p>
            {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith("Principais Técnicas:") || paragraph.startsWith("Gerenciamento Ético:") || paragraph.match(/^\d+\./)) {
                    const lines = paragraph.split('\n');
                    const heading = lines[0];
                    const listItems = lines.slice(1);
                    return (
                        <React.Fragment key={index}>
                            <h3 className="font-semibold text-xl mt-4 mb-2 text-foreground">{heading}</h3>
                            {listItems.length > 0 && (
                                <ul className="list-disc pl-5 space-y-1 mb-4">
                                    {listItems.map((item, i) => <li key={i} className="text-muted-foreground">{item.replace(/^\d+\.\s*/, '')}</li>)}
                                </ul>
                            )}
                        </React.Fragment>
                    );
                }
                return <p key={index} className="mb-4 text-foreground/90 leading-relaxed">{paragraph}</p>;
            })}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
