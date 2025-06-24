
import { useState, useEffect, useMemo } from 'react';

// Dicionário simples de palavras-chave e tags associadas
// Pode ser expandido e refinado
const CLINICAL_KEYWORDS_DICTIONARY: Record<string, string[]> = {
  // Emoções e Sentimentos
  ansiedade: ['ansiedade', 'preocupação'],
  medo: ['medo', 'ansiedade', 'fobia'],
  pânico: ['pânico', 'ansiedade aguda'],
  tristeza: ['tristeza', 'humor deprimido'],
  depressão: ['depressão', 'humor deprimido', 'anedonia'],
  raiva: ['raiva', 'irritabilidade'],
  culpa: ['culpa', 'remorso'],
  vergonha: ['vergonha', 'constrangimento'],
  estresse: ['estresse', 'tensão'],
  cansaço: ['cansaço', 'fadiga'],
  sozinho: ['solidão', 'isolamento'],
  isolamento: ['isolamento', 'retraimento social'],
  esperança: ['desesperança', 'pessimismo'], // desesperança
  vazio: ['vazio emocional'],
  inadequação: ['inadequação', 'baixa autoestima'],
  insegurança: ['insegurança'],

  // Comportamentos e Padrões
  evitar: ['evitação', 'fuga'],
  fuga: ['fuga', 'evitação'],
  procrastinar: ['procrastinação', 'adiamento'],
  insônia: ['insônia', 'dificuldade de sono'],
  comer: ['compulsão alimentar', 'restrição alimentar', 'alimentação emocional'], // Genérico
  chorar: ['choro', 'expressão emocional'],
  gritar: ['agressividade verbal', 'externalização'],
  brigar: ['conflito interpessoal', 'agressividade'],
  discutir: ['conflito interpessoal', 'comunicação'],
  retrair: ['retraimento social', 'isolamento'],
  verificar: ['verificação', 'compulsão', 'TOC'], // Comportamento de verificação (TOC)
  compulsão: ['compulsão', 'comportamento repetitivo'],
  ruminação: ['ruminação', 'pensamento repetitivo'],
  autocrítica: ['autocrítica', 'perfeccionismo'],
  perfeccionismo: ['perfeccionismo', 'autocobrança'],
  criticar: ['crítica', 'julgamento'], // Criticar outros
  isolado: ['isolamento social'],

  // Contextos e Temas
  trabalho: ['trabalho', 'carreira', 'estresse ocupacional'],
  família: ['família', 'relações familiares'],
  relacionamento: ['relacionamento amoroso', 'relações interpessoais'],
  amigos: ['amizades', 'relações sociais'],
  saúde: ['saúde', 'doença', 'sintomas físicos'],
  dinheiro: ['finanças', 'preocupação financeira'],
  estudo: ['estudo', 'desempenho acadêmico'],
  perda: ['luto', 'perda'],
  luto: ['luto', 'perda'],
  mudança: ['mudança de vida', 'transição'],
  trauma: ['trauma', 'TEPT'],
  abuso: ['abuso', 'trauma'],

  // Termos Clínicos Gerais
  gatilho: ['gatilho', 'estressor'],
  crença: ['crença central', 'esquema'],
  pensamento: ['pensamento automático', 'distorção cognitiva'],
  cognitivo: ['cognitivo', 'pensamento'],
  comportamental: ['comportamental', 'ação'],
  emocional: ['emocional', 'afetivo'],
  interpessoal: ['interpessoal', 'social'],
  reforço: ['reforço positivo', 'reforço negativo'], // Genérico
  punição: ['punição'],

  // Exemplos mais específicos
  'não consigo': ['baixa autoeficácia', 'desamparo aprendido'],
  'sem valor': ['baixa autoestima', 'desvalorização'],
  'sempre erro': ['generalização excessiva', 'perfeccionismo'],
  'tenho que': ['regra rígida', 'autocobrança'],
};

const STOP_WORDS = new Set([
  'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não',
  'uma', 'os', 'no', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao',
  'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há',
  'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela',
  'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas',
  'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem',
  'seus', 'minha', 'minhas', 'meu', 'meus', 'numa', 'pelos', 'qual', 'vai',
  'serão', 'sobre', 'nós', 'tenho', 'fazer', 'dizer', 'poder', 'queria', 'sou',
  // Adicionar mais palavras comuns se necessário
]);

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompõe acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove pontuação, exceto hífens
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
};

export const useTagSuggestions = (
  antecedentText: string,
  behaviorText: string,
  currentTags: string[] = [],
  maxSuggestions: number = 5
) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const textToAnalyze = useMemo(() => {
    return normalizeText(`${antecedentText} ${behaviorText}`);
  }, [antecedentText, behaviorText]);

  useEffect(() => {
    if (!textToAnalyze.trim()) {
      setSuggestions([]);
      return;
    }

    const foundTags = new Map<string, number>(); // tag -> count
    const wordsInText = textToAnalyze.split(/\s+/).filter(word => word.length > 2 && !STOP_WORDS.has(word));

    // Check single words and bigrams (pares de palavras)
    const tokensToCheck: string[] = [...wordsInText];
    for (let i = 0; i < wordsInText.length - 1; i++) {
        tokensToCheck.push(`${wordsInText[i]} ${wordsInText[i+1]}`);
    }

    tokensToCheck.forEach(token => {
      if (CLINICAL_KEYWORDS_DICTIONARY[token]) {
        CLINICAL_KEYWORDS_DICTIONARY[token].forEach(tag => {
          if (!currentTags.includes(tag)) {
            foundTags.set(tag, (foundTags.get(tag) || 0) + 1);
          }
        });
      }
    });
    
    // Considerar substrings parciais mais longas (ex: "ansiedade social" em "senti ansiedade social no evento")
    Object.keys(CLINICAL_KEYWORDS_DICTIONARY).forEach(keyword => {
        if (keyword.includes(' ') && textToAnalyze.includes(keyword)) { // Check multi-word keywords
            CLINICAL_KEYWORDS_DICTIONARY[keyword].forEach(tag => {
                if (!currentTags.includes(tag)) {
                    foundTags.set(tag, (foundTags.get(tag) || 0) + 2); // Prioritize multi-word matches
                }
            });
        }
    });


    const sortedSuggestions = Array.from(foundTags.entries())
      .sort(([, countA], [, countB]) => countB - countA) // Sort by count
      .map(([tag]) => tag);

    setSuggestions(sortedSuggestions.slice(0, maxSuggestions));

  }, [textToAnalyze, currentTags, maxSuggestions]);

  return suggestions;
};
