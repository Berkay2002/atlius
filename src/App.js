import './App.css';
import { HashRouter, Routes, Route} from "react-router-dom";
import SearchRoom from './SearchRoom.js';
import LocationDetails from './LocationDetails';
import ErrorBoundary from './ErrorBoundary';
import NotFound from './NotFound';
import RouteError from './RouteError';

/**
 * React Router v7 Enhanced Routing
 *
 * New features implemented:
 * 1. errorElement prop on routes - Route-level error handling using useRouteError
 * 2. Link prefetch="intent" - Prefetch route data on hover/focus (in LocationInfo)
 * 3. unstable_viewTransition - Smooth page transitions with View Transition API
 *
 * The errorElement provides better error handling than traditional error boundaries:
 * - Scoped to specific routes
 * - Access to routing context via useRouteError hook
 * - Can display route-specific error information
 */
function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={<SearchRoom />}
            errorElement={<RouteError />}
          />
          <Route
            path="/map/:roomName"
            element={<LocationDetails />}
            errorElement={<RouteError />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </HashRouter>
 );
}

export default App;
