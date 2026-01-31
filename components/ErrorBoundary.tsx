import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
              </div>
              <h1 className="text-2xl font-bold text-dark-green mb-2">เกิดข้อผิดพลาด</h1>
              <p className="text-gray-600 mb-4">
                ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
              </p>
              {this.state.error && (
                <details className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                  <summary className="cursor-pointer text-sm font-bold text-gray-700 mb-2">
                    รายละเอียดข้อผิดพลาด
                  </summary>
                  <pre className="text-xs text-red-600 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full bg-primary hover:bg-primary-dark text-dark-green font-bold py-3 px-6 rounded-xl transition-colors"
            >
              กลับสู่หน้าแรก
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
