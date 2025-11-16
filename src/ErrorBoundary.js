import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
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
