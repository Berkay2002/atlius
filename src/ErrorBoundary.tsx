import { Component } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundaryProps, ErrorBoundaryState } from './types';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-content">
            <h1>Något gick fel</h1>
            <p>Ett oväntat fel har inträffat. Försök att ladda om sidan.</p>
            <div className="error-actions">
              <Link to="/" className="error-link">
                <button className="error-button">Tillbaka till startsidan</button>
              </Link>
              <button
                className="error-button"
                onClick={() => window.location.reload()}
              >
                Ladda om sidan
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Teknisk information</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
