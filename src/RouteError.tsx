import { Link, useRouteError } from 'react-router-dom';
import { ReactComponent as Back } from './icons/back.svg';

interface RouteErrorType {
  status?: number;
  statusText?: string;
  message?: string;
  stack?: string;
}

/**
 * React Router v7 feature: Route-level error handling with useRouteError
 *
 * This component uses the useRouteError hook (React Router v7) to catch and display
 * errors that occur during routing, data loading, or component rendering.
 *
 * Benefits over traditional error boundaries:
 * - Scoped to specific routes via errorElement prop
 * - Access to route-specific error context
 * - Better integration with React Router's navigation system
 * - Can handle both synchronous and asynchronous errors
 */
function RouteError() {
  const error = useRouteError() as RouteErrorType;

  // Log error for debugging (in production, send to error tracking service)
  console.error('Route error:', error);

  // Determine error type and message
  let errorMessage = 'Ett oväntat fel har inträffat.';
  let errorTitle = 'Något gick fel';
  let statusCode: number | null = null;

  if (error?.status) {
    statusCode = error.status;
    if (error.status === 404) {
      errorTitle = 'Sidan hittades inte';
      errorMessage = 'Den sida du söker efter finns inte eller har flyttats.';
    } else if (error.status === 500) {
      errorTitle = 'Serverfel';
      errorMessage = 'Ett serverfel har inträffat. Försök igen senare.';
    }
  }

  if (error?.statusText) {
    errorMessage = error.statusText;
  }

  if (error?.message) {
    errorMessage = error.message;
  }

  return (
    <div className="error-page">
      <Link to="/" unstable_viewTransition>
        <div id="tillbakaKnapp">
          <Back/>
        </div>
      </Link>

      <div className="error-content">
        {statusCode && <h1 className="error-status">{statusCode}</h1>}
        <h2>{errorTitle}</h2>
        <p>{errorMessage}</p>

        <div className="error-actions">
          <Link to="/" className="error-link" unstable_viewTransition>
            <button className="error-button">Tillbaka till startsidan</button>
          </Link>
          <button
            className="error-button"
            onClick={() => window.location.reload()}
          >
            Ladda om sidan
          </button>
        </div>

        {/* Show technical details in development mode */}
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="error-details">
            <summary>Teknisk information (endast i utvecklingsläge)</summary>
            <pre>{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default RouteError;
