"use client";

import React from "react";
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
    logger.error({ action: 'uncaught_error', meta: { error, errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className="flex flex-col items-center justify-center py-10"
            role="alert"
          >
            <h2 className="text-xl font-semibold">Algo deu errado.</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Consulte o console para detalhes técnicos.
            </p>
            <div className="mt-4 space-x-4">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="underline"
              >
                Tentar novamente
              </button>
              <button onClick={() => window.location.href = '/'} className="underline">
                Voltar ao início
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
