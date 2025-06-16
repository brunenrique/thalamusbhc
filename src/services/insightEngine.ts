
import type { ABCCardData, SchemaData } from '@/types/clinicalTypes';

/**
 * Simula a análise de dados clínicos (cards e esquemas) para gerar insights.
 * Em uma implementação real, isso envolveria lógica mais complexa ou chamadas a um serviço de IA.
 */
export async function runAnalysis(
  cards: ABCCardData[],
  schemas: SchemaData[]
): Promise<string[]> {
  // Simula um pequeno delay de processamento
  await new Promise(resolve => setTimeout(resolve, 700));

  const generatedInsights: string[] = [];

  // 1. Análise de Tags mais Frequentes
  const tagCounts: Record<string, number> = {};
  cards.forEach(card => {
    card.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  if (sortedTags.length > 0) {
    generatedInsights.push(`Tags mais frequentes: ${sortedTags.slice(0, 3).map(([tag, count]) => `${tag} (x${count})`).join(', ')}.`);
  } else {
    generatedInsights.push("Nenhuma tag foi utilizada nos cards ABC.");
  }

  // 2. Antecedentes Internos Recorrentes em Cards Vermelhos
  const redCardInternalAntecedents: string[] = [];
  cards.forEach(card => {
    if (card.color === 'red' && card.antecedent.internal) {
      redCardInternalAntecedents.push(card.antecedent.internal);
    }
  });
  if (redCardInternalAntecedents.length > 0) {
    // Simplesmente lista alguns exemplos (não faz contagem de recorrência real aqui)
    const uniqueInternalAntecedents = [...new Set(redCardInternalAntecedents)];
    generatedInsights.push(`Antecedentes internos em cards de "Alerta/Problema": ${uniqueInternalAntecedents.slice(0, 2).map(a => `"${a.substring(0,30)}..."`).join(', ')}.`);
  }

  // 3. Schemas sem Vínculo
  const unlinkedSchemas = schemas.filter(schema => schema.linkedCardIds.length === 0);
  if (unlinkedSchemas.length > 0) {
    generatedInsights.push(`Esquemas/Regras sem cards ABC vinculados: ${unlinkedSchemas.map(s => `"${s.rule.substring(0,30)}..."`).join(', ')}.`);
  } else if (schemas.length > 0) {
    generatedInsights.push("Todos os esquemas/regras parecem estar vinculados a pelo menos um card ABC.");
  }

  // Insight genérico
  if (cards.length > 0 || schemas.length > 0) {
    generatedInsights.push(`Total de ${cards.length} cards ABC e ${schemas.length} esquemas/regras identificados.`);
  } else {
    generatedInsights.push("Nenhum card ABC ou esquema/regra foi adicionado ainda. Adicione alguns para análise.");
  }

  if (generatedInsights.length === 0) {
    return ["Nenhum insight específico gerado. Adicione mais dados para uma análise mais completa."];
  }

  return generatedInsights;
}
