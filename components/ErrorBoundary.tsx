import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;

  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Erro inesperado na interface:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 dark:bg-gray-900">
          <div className="max-w-md rounded-xl bg-surface p-8 shadow-md dark:bg-gray-800">
            <h1 className="mb-3 text-2xl font-bold text-text dark:text-gray-50">Algo deu errado</h1>
            <p className="text-text-light dark:text-gray-400">Recarregue a página para tentar novamente. Se o problema continuar, revise os logs do navegador.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;