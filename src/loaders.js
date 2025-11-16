/**
 * React Router v7: Data Loading with Loaders
 *
 * This file demonstrates the loader pattern introduced in React Router v7.
 * While AtLius currently uses static data from DataBase.js, loaders provide
 * a framework for future enhancements like:
 * - Fetching room data from an API
 * - Loading real-time availability information
 * - Prefetching SVG maps before navigation
 * - Validating room data before rendering
 *
 * Note: The current implementation doesn't use these loaders yet, but they're
 * included as examples for future development.
 *
 * To use loaders, you would need to:
 * 1. Switch from HashRouter to createHashRouter or createBrowserRouter
 * 2. Add loader functions to route configurations
 * 3. Use useLoaderData() hook in components to access loaded data
 */

import { elements } from './DataBase.js';

/**
 * Loader for the LocationDetails route
 *
 * React Router v7 feature: Pre-loads room data before rendering the route
 *
 * Benefits:
 * - Data is available immediately when component renders
 * - Better error handling (can throw responses)
 * - Enables prefetching with Link prefetch prop
 * - Avoids the "fetch on render" waterfall
 *
 * Usage (when migrating to createHashRouter):
 * {
 *   path: "/map/:roomName",
 *   element: <LocationDetails />,
 *   loader: locationDetailsLoader,
 *   errorElement: <RouteError />
 * }
 *
 * @param {Object} params - Route params from React Router
 * @returns {Object} Room data or throws 404 error
 */
export async function locationDetailsLoader({ params }) {
  const { roomName } = params;

  // Simulate API call delay (remove in production)
  // await new Promise(resolve => setTimeout(resolve, 100));

  // Find room in database
  const room = elements.find(element => element.room === roomName);

  // React Router v7 pattern: Throw Response for errors
  if (!room && roomName !== 'Täppan' && roomName !== 'Kåkenhus') {
    throw new Response('Rummet hittades inte', {
      status: 404,
      statusText: `Lokal "${roomName}" finns inte i databasen.`
    });
  }

  // Return data that will be available via useLoaderData() hook
  return {
    room,
    roomName,
    isBuilding: roomName === 'Täppan' || roomName === 'Kåkenhus'
  };
}

/**
 * Loader for the SearchRoom route (example)
 *
 * This loader could be used to:
 * - Fetch updated room list from API
 * - Load building availability data
 * - Prefetch campus map data
 *
 * @returns {Object} All rooms and metadata
 */
export async function searchRoomLoader() {
  // In a real app, this might fetch from an API:
  // const response = await fetch('/api/rooms');
  // const rooms = await response.json();

  return {
    rooms: elements,
    buildings: ['Täppan', 'Kåkenhus']
  };
}

/**
 * Example: How to migrate to createHashRouter with loaders
 *
 * import { createHashRouter, RouterProvider } from 'react-router-dom';
 * import { locationDetailsLoader, searchRoomLoader } from './loaders';
 *
 * const router = createHashRouter([
 *   {
 *     path: "/",
 *     element: <SearchRoom />,
 *     loader: searchRoomLoader,
 *     errorElement: <RouteError />
 *   },
 *   {
 *     path: "/map/:roomName",
 *     element: <LocationDetails />,
 *     loader: locationDetailsLoader,
 *     errorElement: <RouteError />
 *   },
 *   {
 *     path: "*",
 *     element: <NotFound />
 *   }
 * ]);
 *
 * function App() {
 *   return <RouterProvider router={router} />;
 * }
 *
 * Then in your components, use useLoaderData():
 *
 * function LocationDetails() {
 *   const { room, roomName, isBuilding } = useLoaderData();
 *   // No need for useMemo or find - data is already loaded!
 *   ...
 * }
 */

/**
 * Action example for future room booking functionality
 *
 * React Router v7 also supports actions for handling form submissions
 * and mutations.
 *
 * @param {Object} request - Form data from submission
 * @returns {Object} Result of the action
 */
export async function bookRoomAction({ params, request }) {
  const formData = await request.formData();
  const booking = {
    roomName: params.roomName,
    time: formData.get('time'),
    duration: formData.get('duration')
  };

  // In a real app:
  // const response = await fetch('/api/bookings', {
  //   method: 'POST',
  //   body: JSON.stringify(booking)
  // });

  return { success: true, booking };
}
