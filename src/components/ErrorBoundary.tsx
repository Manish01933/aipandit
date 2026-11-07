import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: any;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as new (...args: any[]) => any) {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-950 border border-amber-500/30 rounded-2xl text-center space-y-4 my-4 max-w-lg mx-auto shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {this.props.fallbackTitle || 'इस मॉड्यूल में अस्थायी समस्या आई'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              पृष्ठ को रिफ्रेश करें या नीचे दिए गए बटन से पुनः प्रयास करें।
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-rose-300/80 bg-slate-900 p-2 rounded-lg mt-2 border border-slate-800 break-words">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>पुनः प्रयास करें (Retry)</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>पेज रीलोड करें</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
