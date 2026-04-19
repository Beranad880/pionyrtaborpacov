'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary zachytil chybu:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Nastala neočekávaná chyba</h2>
            <p className="text-red-600 text-sm mb-4">
              {this.state.error?.message ?? 'Neznámá chyba'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Zkusit znovu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
