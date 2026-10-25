import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  windowTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WindowErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Window application crash caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';
      return (
        <div style={{ padding: '20px', background: '#000080', color: '#ffffff', fontFamily: 'monospace', height: '100%', overflow: 'auto' }}>
          <div style={{ background: '#ffffff', color: '#000080', padding: '2px 8px', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px' }}>
            {isEn ? 'MARTÍN OS - APPLICATION ERROR' : 'MARTÍN OS - ERROR DE APLICACIÓN'}
          </div>
          <p style={{ margin: '8px 0', fontSize: '12px' }}>
            {isEn ? 'An unhandled exception occurred in ' : 'Se ha producido una excepción no controlada en '}
            <b>{this.props.windowTitle || (isEn ? 'this program' : 'este programa')}</b>:
          </p>
          <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', fontSize: '11px', color: '#facc15', whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid #ffffff' }}>
            {this.state.error?.message || (isEn ? 'Unknown error' : 'Error desconocido')}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            style={{
              marginTop: '14px',
              padding: '6px 14px',
              background: '#d4d0c8',
              color: '#000000',
              border: '2px outset #ffffff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '11px'
            }}
          >
            {isEn ? 'Retry / Restart Module' : 'Reintentar / Reiniciar Módulo'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

