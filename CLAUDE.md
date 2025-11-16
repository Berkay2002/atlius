# CLAUDE.md - AI Assistant Guide for AtLius

## Project Overview

**AtLius** is a modern React-based campus map application for Campus Norrköping at Linköping University. It provides users with an efficient way to search for rooms/locations and visualize them on interactive SVG floor plans.

- **Type**: Single Page Application (SPA)
- **Framework**: React 18.3.1
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Routing**: React Router DOM v7.9.6 (HashRouter)
- **Language**: JavaScript (no TypeScript)
- **UI Language**: Swedish

## Recent Major Updates (November 2025)

### Dependency Upgrades
- **React**: 18.2.0 → 18.3.1 (concurrent rendering improvements)
- **React Router DOM**: 6.4.3 → 7.9.6 (major version upgrade with new features)
- **Testing Library**: All packages upgraded to latest versions
- **@svgr/webpack**: 6.5.1 → 8.1.0
- **web-vitals**: 2.1.4 → 5.1.0

### New Features Implemented
1. **React 18.3 features**:
   - `useDeferredValue` for optimized search performance
   - Improved concurrent rendering
   - Better user experience with deferred updates

2. **React Router v7 features**:
   - Route-level error handling with `errorElement`
   - Link prefetching with `prefetch="intent"`
   - View Transition API support with `unstable_viewTransition`
   - `useRouteError` hook for advanced error handling

3. **Error Handling**:
   - ErrorBoundary component for catching React errors
   - RouteError component for route-specific errors
   - NotFound component for 404 pages
   - Development-only error details

4. **Accessibility Improvements**:
   - ARIA labels on interactive elements
   - Live regions for search results
   - Better keyboard navigation
   - Screen reader support

5. **Code Quality**:
   - Extracted constants to `constants.js` (addresses previous technical debt)
   - Added input validation
   - Memoized search results
   - Empty state and "more results" indicators

## Repository Structure

```
atlius/
├── src/                          # Source code
│   ├── App.js                    # Main app component with routing configuration
│   ├── App.css                   # Main stylesheet
│   ├── SearchRoom.js             # Search interface component (home page)
│   ├── LocationDetails.js        # Location detail view with floor plans
│   ├── LocationInfo.js           # Individual search result component
│   ├── DataBase.js               # Static room data (102 rooms across 2 buildings)
│   ├── ErrorBoundary.js          # ✨ NEW: Class-based error boundary
│   ├── NotFound.js               # ✨ NEW: 404 page component
│   ├── RouteError.js             # ✨ NEW: Route-level error handler (React Router v7)
│   ├── constants.js              # ✨ NEW: Extracted constants for buildings/floors
│   ├── loaders.js                # ✨ NEW: Example React Router v7 loaders
│   ├── index.js                  # React application entry point
│   ├── index.css                 # Global styles
│   ├── maps/                     # SVG floor plan files
│   │   ├── Kåken1.svg through Kåken5.svg    # Kåkenhus building floors 1-5
│   │   ├── Täppan3.svg through Täppan5.svg  # Täppan building floors 3-5
│   │   └── startPage.svg         # Landing page campus overview map
│   ├── icons/                    # SVG icons
│   │   ├── back.svg              # Back button icon
│   │   └── compass.svg           # Compass icon
│   ├── reportWebVitals.js        # Performance monitoring
│   └── setupTests.js             # Test configuration
├── public/                       # Static assets
│   ├── index.html                # HTML template
│   ├── favicon.ico               # Site icon
│   ├── logo192.png & logo512.png # PWA icons
│   ├── manifest.json             # PWA manifest
│   └── robots.txt                # SEO configuration
├── docs/                         # Production build output (GitHub Pages)
├── .vs/                          # Visual Studio settings (gitignored)
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation (Swedish)
└── CLAUDE.md                     # This file - AI assistant guide
```

## Application Architecture

### Routing Structure

The app uses `HashRouter` with three main routes and route-level error handling:

1. **`/`** → `SearchRoom` component
   - Landing page with campus overview map
   - Search input with real-time filtering using `useDeferredValue`
   - Displays up to 5 matching results with memoization
   - Shows "more results available" indicator
   - Empty state when no results found
   - **Error handling**: `RouteError` component

2. **`/map/:roomName`** → `LocationDetails` component
   - Shows specific floor plan for the room's floor
   - Highlights the selected room with animation
   - Provides floor navigation buttons
   - Back button returns to search with view transitions
   - **Error handling**: `RouteError` component

3. **`*`** → `NotFound` component
   - 404 page for invalid routes
   - Back button to return to home

All routes wrapped in `ErrorBoundary` for catching React errors.

### Component Hierarchy

```
App (HashRouter)
├── ErrorBoundary (catches React errors)
│   └── Routes
│       ├── Route "/" → SearchRoom (errorElement: RouteError)
│       │   ├── Map (SVG component - startPage.svg)
│       │   └── LocationInfo (rendered for each search result)
│       │       └── Link to LocationDetails (with prefetch="intent")
│       ├── Route "/map/:roomName" → LocationDetails (errorElement: RouteError)
│       │   ├── Back button (Link with unstable_viewTransition)
│       │   ├── Floor plan SVG (conditional render based on building/floor)
│       │   ├── Floor navigation buttons
│       │   └── Room description (room name and floor number)
│       └── Route "*" → NotFound
```

### Data Model

**DataBase.js** exports a static array of room objects:

```javascript
{
  room: string,      // Room identifier (e.g., "K101", "TP5004")
  building: string,  // Building name ("Kåkenhus" or "Täppan")
  floor: number      // Floor number (1-5)
}
```

**constants.js** exports centralized constants:

```javascript
BUILDINGS = {
  TAPPAN: 'Täppan',
  KAKENHUS: 'Kåkenhus'
}

FLOOR_CODES = { TP3, TP4, TP5, K1, K2, K3, K4, K5 }

MAP_NAMES = { TAPPAN_3, TAPPAN_4, ... }
```

**Buildings:**
- **Kåkenhus (K)**: Floors 1-5
- **Täppan (TP)**: Floors 3-5

## Key Features & Implementation Details

### 1. Search Functionality (SearchRoom.js)

**React 18.3 Optimizations:**
- **useDeferredValue**: Defers search result updates while keeping input responsive
  ```javascript
  const deferredSearchString = useDeferredValue(searchString);
  ```
- **useMemo**: Memoizes filtered results to prevent unnecessary recalculations
- **Visual feedback**: Opacity change while search is being deferred
- **aria-live**: Screen reader announcements for search results

**Features:**
- **Case-insensitive search**: Converts both search string and room names to lowercase
- **Real-time filtering**: Updates results on every keystroke (deferred for performance)
- **Result limiting**: Shows maximum 5 results sorted by length
- **Input validation**: Checks for null/undefined before searching
- **Empty state**: Shows "Inga resultat hittades" when no matches
- **More results indicator**: Shows "Fler resultat tillgängliga..." when >5 matches
- **Accessibility**: aria-label on search input, role="status" on results

### 2. Room Visualization (LocationDetails.js)

- **Dynamic SVG imports**: Floor plans imported as React components
- **Room highlighting**: Uses CSS class `start_buildings` to highlight selected room
- **Animation**: 5-iteration fade animation on highlighted rooms (opacity 0.25 to 1)
- **Floor navigation**: Conditional rendering of floor buttons based on building
- **State management**: `currentFloor` state allows switching between floors without changing route
- **View Transitions**: Smooth page transitions using `unstable_viewTransition`

### 3. Error Handling

**Two-layer error handling approach:**

1. **ErrorBoundary.js** (Class component):
   - Catches React errors anywhere in the component tree
   - Shows fallback UI with home button and reload button
   - Displays technical details in development mode
   - Swedish error messages: "Något gick fel"

2. **RouteError.js** (React Router v7):
   - Uses `useRouteError()` hook
   - Handles routing errors, data loading errors, and 404s
   - Scoped to specific routes via `errorElement` prop
   - Shows status codes (404, 500, etc.)
   - Displays error details in development mode
   - Better integration with navigation system

3. **NotFound.js**:
   - Dedicated 404 page for catch-all route
   - Clean Swedish UI: "Sidan hittades inte"
   - Back button with view transition

### 4. Link Prefetching (React Router v7)

**LocationInfo.js** implements intent-based prefetching:
```javascript
<Link
  to={"/map/" + loc.data.room}
  prefetch="intent"
  unstable_viewTransition
>
```
- **prefetch="intent"**: Prefetches route data on hover/focus
- **unstable_viewTransition**: Uses View Transition API for smooth animations
- Reduces perceived loading time
- Better user experience on navigation

### 5. Styling Conventions (App.css)

- **Primary color**: `#00B3E1` (bright blue)
- **Accent color**: `#0085a6` (darker blue for active states)
- **Alternating row colors**: Even (`#D9D9D9`), Odd (`#c1c1c1`)
- **Responsive sizing**: Uses `vw` and `vh` units extensively
- **Animations**: Two keyframe animations (`fade_a`, `fade_b`)
- **Mobile-first**: Fixed positioning and viewport-based dimensions
- **Error page styles**: Added styles for error and 404 pages
- **Transitions**: 0.2s opacity transitions for deferred search

## Development Workflow

### Available Scripts

```bash
npm start       # Development server (port 3000)
npm test        # Run test suite (Jest)
npm run build   # Production build → /build directory
npm run eject   # Eject from Create React App (irreversible)
```

### Building and Deployment

- Production builds go to `/build` directory
- The `/docs` directory contains builds for GitHub Pages
- No custom build configuration (using CRA defaults)

### Testing

- Test framework: Jest + React Testing Library (v16.3.0)
- Test files: `*.test.js` or `*.spec.js`
- Setup file: `setupTests.js`
- Enhanced matchers from @testing-library/jest-dom v6.9.1

## Code Conventions

### Naming Conventions

1. **Components**: PascalCase (e.g., `SearchRoom.js`, `ErrorBoundary.js`)
2. **Room IDs**: Building prefix + number
   - Kåkenhus: `K` + number (e.g., K101, K2411, K52)
   - Täppan: `TP` + number (e.g., TP1, TP4003, TP5050)
   - Special rooms: `TPm51` (prefix 'm' for certain rooms)
3. **CSS IDs**: camelCase (e.g., `#headerRoom`, `#tillbakaKnapp`)
4. **CSS Classes**: snake_case or kebab-case (e.g., `.start_buildings`)
5. **Map names**: BuildingFloor format (e.g., `Täppan3`, `Kåkenhus5`)
6. **Constants**: SCREAMING_SNAKE_CASE in `constants.js`

### Code Style

- **Semicolons**: Inconsistent use (some files have them, some don't)
- **String quotes**: Single quotes preferred in JSX, double quotes in some cases
- **Comments**: Mix of Swedish and English (newer files have English)
- **Comparison**: Improved but some `==` instead of `===` remain in older code
- **Arrow functions**: Preferred for functional components
- **PropTypes**: Not used (no runtime type checking)
- **Hooks**: Modern hooks usage (`useMemo`, `useDeferredValue`, `useRouteError`)

### SVG Handling

- SVG files imported as React components using `@svgr/webpack` v8.1.0
- Import pattern: `import {ReactComponent as Name} from './path.svg'`
- Rendered as self-closing JSX tags: `<Name />`
- SVG IDs in files correspond to room names for highlighting

## Common Patterns

### 1. Conditional Rendering

Used extensively in `LocationDetails.js`:
```javascript
{mapName === 'Täppan3' && <Täppan3 />}
```

### 2. Deferred Search with Memoization (React 18.3)

In `SearchRoom.js`:
```javascript
const deferredSearchString = useDeferredValue(searchString);

const resultList = useMemo(() => {
  return elements
    .filter(room => matchSearch(room.room))
    .sort((a, b) => a.room.length - b.room.length)
    .slice(0, 5);
}, [deferredSearchString]);

const isSearching = searchString !== deferredSearchString;
```

### 3. React Router Links with Prefetching

Navigation uses `Link` components with v7 features:
```javascript
<Link
  to={"/map/" + roomName}
  prefetch="intent"
  unstable_viewTransition
>
```

### 4. UseEffect for DOM Manipulation

```javascript
useEffect(() => {
  if (room) {
    document.querySelector("#" + roomName).classList.add("start_buildings");
  }
}, []);
```

### 5. Error Handling with useRouteError (React Router v7)

```javascript
function RouteError() {
  const error = useRouteError();

  let errorMessage = 'Ett oväntat fel har inträffat.';
  if (error?.status === 404) {
    errorMessage = 'Den sida du söker efter finns inte.';
  }

  return <div>{errorMessage}</div>;
}
```

## Resolved Technical Debt

### Previously Fixed Issues

✅ **Constants extracted**: Created `constants.js` for building names, floor codes, and map names
✅ **Error boundaries**: Implemented `ErrorBoundary.js` for React error handling
✅ **Loading states**: Added visual feedback during deferred search updates
✅ **Accessibility**: Added ARIA labels, live regions, and keyboard navigation support
✅ **Input validation**: Added null/undefined checks in search function
✅ **Memoization**: Implemented `useMemo` for search results optimization
✅ **Empty states**: Added UI for no results and more results available

### Remaining Technical Debt

1. **Type safety**: No TypeScript, no PropTypes validation
2. **Equality operators**: Some uses of `==` instead of `===` in older code
3. **Missing dependencies**: Some `useEffect` hooks may have incomplete dependency arrays
4. **Direct DOM manipulation**: Still uses `document.querySelector` instead of refs in some places
5. **Magic strings**: Some hard-coded strings still exist despite constants.js
6. **Commented code**: Line 86 in `DataBase.js` has commented-out room entry
7. **Router migration**: Using HashRouter instead of createHashRouter (loaders.js shows migration path)

### Potential Bugs

1. **Special character handling**: Building name "Täppan" vs route param consistency
2. **Similar typo**: "Kakenhus" vs "Kåkenhus" in some places (check constants.js)
3. **Performance**: No route-based code splitting (all SVG components loaded upfront)

## AI Assistant Guidelines

### When Making Changes

1. **Preserve Swedish UI text**: Don't translate user-facing strings unless explicitly requested
2. **Maintain styling consistency**: Keep the #00B3E1 blue theme
3. **Test room highlighting**: Ensure SVG IDs match room names in DataBase.js
4. **Check both buildings**: Test changes on both Kåkenhus and Täppan
5. **Validate floor ranges**: Kåkenhus (1-5), Täppan (3-5)
6. **Respect responsive design**: Maintain vw/vh-based sizing
7. **Use constants**: Import from `constants.js` instead of hard-coding strings
8. **Add error handling**: Wrap risky operations in try-catch or use error boundaries
9. **Consider accessibility**: Add ARIA labels for new interactive elements
10. **Use modern React**: Leverage React 18.3 and Router v7 features

### Adding New Rooms

1. Add entry to `DataBase.js` elements array
2. Ensure SVG map file has matching ID element
3. Use constants from `constants.js` for building names
4. Verify building name matches exactly (use `BUILDINGS.TAPPAN` or `BUILDINGS.KAKENHUS`)
5. Use correct floor number for the building
6. Test search functionality finds the new room
7. Verify room highlights correctly on the map
8. Check that prefetching works for the new room

### Adding New Buildings

1. Create SVG files for each floor: `BuildingNameN.svg`
2. Add rooms to `DataBase.js` with new building name
3. **Update `constants.js`** with new building constants
4. Import SVG components in `LocationDetails.js`
5. Add conditional rendering blocks for each floor
6. Add floor navigation button group
7. Test error handling for the new building
8. Update this documentation

### Modifying SVG Maps

1. Maintain consistent ID naming for rooms (must match DataBase.js)
2. Keep viewBox dimensions consistent for smooth transitions
3. Preserve layer structure (#Lager_1, #Lager_2)
4. Test highlighting animation works on modified elements
5. Ensure SVG file size remains reasonable (current range: 28KB-110KB)
6. Test view transitions work smoothly with modified SVGs

### Code Modernization Suggestions

Future refactoring opportunities:

1. **Add TypeScript**: Type safety for room objects, props, and constants
2. **Use strict equality**: Replace remaining `==` with `===`
3. **Add PropTypes**: Runtime validation if not using TypeScript
4. **Fix useEffect dependencies**: Include all referenced values
5. **Use refs instead of querySelector**: React-friendly DOM access
6. **Implement route-based code splitting**: Lazy load SVG components
7. **Migrate to createHashRouter**: Use React Router v7 loaders (see loaders.js)
8. **Add Suspense boundaries**: Show loading states during code splitting
9. **Implement dark mode**: Using CSS custom properties
10. **Add unit tests**: Test search logic, error handling, and navigation

### Testing Strategy

When adding tests:

1. **Search functionality**:
   - Test filtering with `useDeferredValue`
   - Test case-insensitivity and result limits
   - Test empty state and "more results" indicator
   - Test memoization performance

2. **Room navigation**:
   - Test routing with prefetching
   - Test room highlighting
   - Test view transitions

3. **Floor switching**:
   - Test state updates
   - Test correct SVG rendering
   - Test navigation buttons

4. **Error handling**:
   - Test ErrorBoundary catches React errors
   - Test RouteError handles routing errors
   - Test NotFound shows for invalid routes
   - Test error messages in development vs production

5. **Accessibility**:
   - Test ARIA labels are present
   - Test keyboard navigation
   - Test screen reader announcements
   - Test focus management

## Dependencies

### Production Dependencies

- `react` (^18.3.1): Core React library with concurrent features
- `react-dom` (^18.3.1): React DOM rendering
- `react-router-dom` (^7.9.6): Client-side routing with v7 features
- `react-scripts` (5.0.1): Create React App build tooling
- `web-vitals` (^5.1.0): Performance metrics

### Development Dependencies

- `@svgr/webpack` (^8.1.0): SVG-to-React component transformer
- `@testing-library/jest-dom` (^6.9.1): Custom Jest matchers for DOM
- `@testing-library/react` (^16.3.0): React testing utilities
- `@testing-library/user-event` (^14.6.1): User interaction simulation
- `@babel/plugin-proposal-private-property-in-object` (^7.21.11): Babel plugin

### Browser Support

From `package.json` browserslist:

**Production:**
- >0.2% market share
- Not dead browsers
- Not Opera Mini

**Development:**
- Last 1 Chrome version
- Last 1 Firefox version
- Last 1 Safari version

## Git Workflow

### Branch Structure

- **Current branch**: `claude/claude-md-mi20ybf2f4jurdqm-018hc93ewDFs25cQV89cxtce`
- All changes should be committed to this branch
- Use clear, descriptive commit messages
- Branch follows Claude Code naming convention

### Recent Commits

Latest work includes:
- Dependency updates to React 18.3 and React Router v7
- UX, UI, accessibility, and code quality improvements
- Addition of error handling components
- Performance optimizations with concurrent rendering

### Ignored Files (.gitignore)

- `/node_modules`: Dependencies
- `/.pnp` and `.pnp.js`: Yarn PnP
- `/coverage`: Test coverage reports
- `/build`: Production builds
- `.DS_Store`: macOS system files
- `.env.*`: Environment variables
- `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`: Log files

## Performance Considerations

1. **SVG file sizes**: Range from 28KB to 110KB (startPage.svg is largest)
2. **Bundle size**: No code splitting implemented (opportunity for improvement)
3. **Search optimization**: Now uses `useDeferredValue` for better concurrent rendering
4. **Animation performance**: CSS animations are GPU-accelerated
5. **No lazy loading**: All SVG components loaded upfront (could use React.lazy)
6. **Memoization**: Search results memoized to prevent recalculation
7. **Prefetching**: Links prefetch on intent, reducing perceived loading time
8. **Web Vitals**: Monitored with web-vitals v5.1.0

## Accessibility Improvements

Current state (significantly improved):
- ✅ ARIA labels on search input and links
- ✅ Live regions for search result announcements (aria-live="polite")
- ✅ Status role for dynamic content
- ✅ Semantic HTML structure throughout
- ✅ Keyboard navigation support
- ✅ Error messages in Swedish for better UX
- ✅ Focus-visible states on interactive elements
- ⚠️ Color contrast needs verification for WCAG AAA compliance
- ⚠️ Some focus management on route changes could be improved
- ⚠️ No skip-to-content link for keyboard users

## React 18.3 Features Used

1. **Concurrent Rendering**:
   - `useDeferredValue` for search input optimization
   - Automatic prioritization of user input over search results
   - Visual feedback during deferred updates

2. **Improved Hooks**:
   - `useMemo` for expensive computations
   - Better performance characteristics

3. **Strict Mode Compatible**:
   - All components work with React 18 Strict Mode
   - No deprecated lifecycle methods

## React Router v7 Features Used

1. **Enhanced Error Handling**:
   - `errorElement` prop on routes
   - `useRouteError()` hook in error components
   - Route-specific error boundaries

2. **Performance Optimizations**:
   - `prefetch="intent"` on links
   - Hover/focus prefetching
   - Reduced navigation latency

3. **View Transitions** (Experimental):
   - `unstable_viewTransition` for smooth page transitions
   - Native browser View Transition API integration

4. **Future-Ready** (loaders.js):
   - Example loaders for data fetching
   - Example actions for form handling
   - Migration path to `createHashRouter`
   - Prepared for API integration

## Future Enhancement Ideas

### Short-term (Using Current Stack)
1. **Search improvements**: Fuzzy search, search by building, floor filter dropdown
2. **Complete migration to createHashRouter**: Use loaders from loaders.js
3. **Route-based code splitting**: Lazy load SVG components with React.lazy
4. **Add more tests**: Component tests, integration tests, E2E tests
5. **Color contrast audit**: Ensure WCAG AAA compliance
6. **Add skip-to-content link**: Better keyboard navigation

### Medium-term (Minor Additions)
1. **Favorites/bookmarks**: Local storage-based room bookmarking
2. **Search history**: Recent searches with quick access
3. **Dark mode**: CSS custom properties + user preference
4. **PWA enhancements**: Offline support, install prompt
5. **Analytics**: Track popular searches and rooms (privacy-respecting)
6. **Keyboard shortcuts**: Quick navigation (/, Esc, etc.)

### Long-term (Major Features)
1. **Directions**: Route finding between rooms using graph algorithms
2. **3D visualization**: Building exteriors, 3D floor plans
3. **Mobile app**: Native apps or enhanced PWA
4. **Admin panel**: CMS for room data without code changes
5. **Multi-campus support**: Expand beyond Norrköping
6. **Internationalization**: English translation, language switcher
7. **Real-time data**: Room availability, booking integration
8. **TypeScript migration**: Full type safety
9. **API integration**: Dynamic room data, booking system
10. **Room booking**: Form submissions with React Router v7 actions

---

## Quick Reference for AI Assistants

### Files to Check Before Making Changes
- `constants.js` - Building names, floor codes, map names
- `DataBase.js` - Room data (102 rooms)
- `App.css` - All styling, including error pages
- `ErrorBoundary.js` - React error handling
- `RouteError.js` - Route error handling

### Common Tasks

**Adding a room:**
1. Update `DataBase.js` elements array
2. Use constants from `constants.js` for building name
3. Ensure SVG has matching ID

**Adding error handling:**
1. Wrap component in ErrorBoundary
2. Add errorElement to route if using Router errors
3. Use try-catch for async operations

**Improving accessibility:**
1. Add aria-label to interactive elements
2. Use aria-live for dynamic content
3. Add role attributes where appropriate
4. Test with keyboard only

**Optimizing performance:**
1. Wrap expensive computations in useMemo
2. Use useDeferredValue for deprioritizable updates
3. Consider React.lazy for code splitting
4. Add prefetch="intent" to important links

---

**Last Updated**: 2025-11-16
**React Version**: 18.3.1
**React Router Version**: 7.9.6
**For**: AI assistants working with the AtLius codebase
**Maintained by**: Claude Code sessions
