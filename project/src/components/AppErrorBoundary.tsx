import { Component, type ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-lg rounded-xl border bg-card p-6 text-card-foreground shadow-ocean">
            <h1 className="text-xl font-extrabold">Error en la página</h1>
            <p className="mt-2 text-sm text-muted-foreground">Recarga la página. Si se repite, copia este mensaje:</p>
            <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {this.state.error.message}
            </pre>
            <button
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => window.location.reload()}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
