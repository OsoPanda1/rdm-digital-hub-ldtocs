/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "@/lib/logger";
import { captureException as sentryCaptureException } from "@/integrations/observability/sentry";

const captureException = sentryCaptureException;

interface Props {
  children: ReactNode;
  route: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`RouteErrorBoundary [${this.props.route}] caught error:`, { error, errorInfo });
    captureException(error, {
      module: "RouteErrorBoundary",
      route: this.props.route,
      componentStack: errorInfo.componentStack,
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("rdm-error", {
          detail: {
            error,
            errorInfo,
            timestamp: new Date().toISOString(),
            boundary: "RouteErrorBoundary",
            route: this.props.route,
          },
        }),
      );
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="max-w-md rounded-xl border border-destructive/20 bg-card p-6 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
              Error de ruta
            </p>
            <h2 className="mt-2 font-serif text-lg font-bold text-foreground">
              No se pudo cargar {this.props.route}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.state.error?.message || "Se produjo un error al cargar esta página."}
            </p>
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
