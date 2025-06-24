'use client';

import { useEffect, useCallback } from 'react';

/**
 * Tempo de inatividade em milissegundos (15 minutos).
 */
const TIMEOUT = 15 * 60 * 1000;

/**
 * Hook que dispara `onTimeout` quando o usuário fica inativo por um período.
 *
 * @param onTimeout Função chamada após o tempo de inatividade expirar.
 */
export default function useSessionTimeout(onTimeout: () => void) {
  const handleLogout = useCallback(() => {
    onTimeout();
  }, [onTimeout]);

  useEffect(() => {
    let activityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(handleLogout, TIMEOUT);
    };

    // Inicia o timer na montagem do componente.
    resetTimer();

    // Eventos que indicam atividade do usuário.
    const events = ['mousemove', 'keydown', 'scroll'] as const;
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(activityTimer);
    };
  }, [handleLogout]);
}
