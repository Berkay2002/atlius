# CLAUDE.md - AI Assistant Guide for AtLius

## Project Overview

**AtLius** is a React-based campus map application for Campus Norrköping at Linköping University. It provides users with an efficient way to search for rooms/locations and visualize them on interactive SVG floor plans.

- **Type**: Single Page Application (SPA)
- **Framework**: React 19.2.0
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Routing**: React Router DOM v7.9.6 (HashRouter)
- **Language**: JavaScript (no TypeScript)
- **UI Language**: Swedish

## Repository Structure

```
atlius/
├── src/                          # Source code
│   ├── App.js                    # Main app component with routing configuration
│   ├── App.css                   # Main stylesheet
│   ├── App.test.js               # App component tests
│   ├── SearchRoom.js             # Search interface component (home page)
│   ├── LocationDetails.js        # Location detail view with floor plans
│   ├── LocationInfo.js           # Individual search result component
│   ├── DataBase.js               # Static room data (102 rooms across 2 buildings)
│   ├── constants.js              # Shared constants (building names, floor codes)
│   ├── loaders.js                # React Router v7 loader functions (for future use)
│   ├── ErrorBoundary.js          # Global error boundary component
│   ├── RouteError.js             # Route-level error handler (React Router v7)
│   ├── NotFound.js               # 404 page component
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
├── docs/                         # Production build output
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation (Swedish)
└── CLAUDE.md                     # This file (AI assistant guide)
```

## Application Architecture

### Routing Structure

The app uses `HashRouter` with three main routes:

1. **`/`** → `SearchRoom` component
   - Landing page with campus overview map
   - Search input with real-time filtering (using `useDeferredValue`)
   - Displays up to 5 matching results with "more results" indicator
   - Empty state when no results found

2. **`/map/:roomName`** → `LocationDetails` component
   - Shows specific floor plan for the room's floor
   - Highlights the selected room with animation
   - Provides floor navigation buttons
   - Back button returns to search
   - Uses `useTransition` for smooth floor switching

3. **`*`** → `NotFound` component
   - 404 page for invalid routes
   - Back button to return home

### Error Handling

The app implements a comprehensive error handling strategy:

- **Global ErrorBoundary**: Wraps all routes in `App.js`
- **Route-level errors**: Uses `errorElement` prop with `RouteError` component (React Router v7 feature)
- **Suspense error boundaries**: For lazy-loaded SVG maps in `LocationDetails`

### Component Hierarchy

```
App (HashRouter)
├── ErrorBoundary (Global error boundary)
│   └── Routes
│       ├── SearchRoom (/)
│       │   ├── Map (SVG component - startPage.svg)
│       │   ├── Search input with useDeferredValue
│       │   └── LocationInfo (rendered for each search result)
│       │       └── Link with prefetch="intent"
│       ├── LocationDetails (/map/:roomName)
│       │   ├── SuspenseErrorBoundary
│       │   │   └── Suspense
│       │   │       └── Lazy-loaded floor plan SVG
│       │   ├── Back button (Link with unstable_viewTransition)
│       │   ├── Floor navigation buttons (useTransition for smooth UI)
│       │   └── Room description
│       └── NotFound (*)
│           └── 404 error page
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

**Buildings:**
- **Kåkenhus (K)**: Floors 1-5
- **Täppan (TP)**: Floors 3-5

**Constants (constants.js):**
- `BUILDINGS`: Building name constants
- `FLOOR_CODES`: Floor code constants (TP3, TP4, TP5, K1-K5)
- `MAP_NAMES`: Map name constants for rendering

## Key Features & Implementation Details

### 1. Search Functionality (SearchRoom.js)

**React 19 Features:**
- **useDeferredValue**: Defers search result updates while keeping input responsive
  - More efficient than manual debouncing
  - React automatically optimizes timing based on device performance
- **useMemo**: Memoizes search results and "hasMoreResults" calculation

**Features:**
- **Case-insensitive search**: Converts both search string and room names to lowercase
- **Real-time filtering**: Updates results on every keystroke with deferred rendering
- **Result limiting**: Shows maximum 5 results sorted by room name length
- **Visual feedback**: Opacity change when search is being deferred
- **Empty state**: Shows "Inga resultat hittades" when no matches
- **More results indicator**: Shows "Fler resultat tillgängliga..." when >5 results
- **Accessibility**: ARIA labels and live regions for screen readers

### 2. Room Visualization (LocationDetails.js)

**React 19 Features:**
- **useTransition**: Marks floor changes as non-urgent for responsive UI
  - Provides `isPending` state for loading indicators
  - Keeps UI interactive during floor navigation
- **lazy + Suspense**: Code-splits SVG floor plans for better performance
  - Each floor plan loads only when needed
  - Reduces initial bundle size
  - Error boundaries catch loading failures
- **useMemo**: Caches expensive room lookup
- **useCallback**: Memoizes event handlers to prevent re-renders
- **useRef**: For DOM manipulation without triggering re-renders

**Features:**
- **Dynamic SVG imports**: Floor plans lazy-loaded as React components
- **Room highlighting**: Uses CSS class `start_buildings` to highlight selected room
- **Animation**: 5-iteration fade animation on highlighted rooms (opacity 0.25 to 1)
- **Floor navigation**: Conditional rendering of floor buttons based on building
- **State management**: `currentFloor` state allows switching between floors without changing route
- **Error handling**: SuspenseErrorBoundary catches SVG loading failures
- **Loading states**: Shows "Laddar karta..." during Suspense
- **Configuration-driven**: Uses `FLOOR_CONFIGS` object to eliminate code duplication

### 3. Error Handling

**React Router v7 Features:**
- **errorElement**: Route-level error handling with better scoping
- **useRouteError**: Hook to access error context in error components
- **Typed errors**: Handles both Response objects and Error instances

**Components:**
- **ErrorBoundary.js**: Class component for global error catching
  - Shows Swedish error message: "Något gick fel"
  - Provides "Tillbaka till startsidan" and "Ladda om sidan" buttons
  - Shows technical details in development mode
- **RouteError.js**: Route-specific error handler
  - Uses `useRouteError()` hook
  - Handles 404, 500, and generic errors
  - Displays status codes and custom messages
- **NotFound.js**: Dedicated 404 page
  - Shows "404 - Sidan hittades inte"
  - Back button with view transitions
  - Consistent styling with error pages

### 4. Styling Conventions (App.css)

- **Primary color**: `#00B3E1` (bright blue)
- **Accent color**: `#0085a6` (darker blue for active states)
- **Alternating row colors**: Even (`#D9D9D9`), Odd (`#c1c1c1`)
- **Responsive sizing**: Uses `vw` and `vh` units extensively
- **Animations**: Two keyframe animations (`fade_a`, `fade_b`)
- **Mobile-first**: Fixed positioning and viewport-based dimensions
- **Error page styles**: Centered error content with button styles

### 5. Link Prefetching (React Router v7)

**LocationInfo.js** uses advanced Link features:
- **prefetch="intent"**: Prefetches route data on hover/focus
  - Improves perceived performance
  - Reduces navigation latency
- **unstable_viewTransition**: Enables View Transition API for smooth page transitions
- **aria-label**: Provides descriptive labels for screen readers

## React 19 & React Router v7 Features

### React 19.2.0 Features Used

1. **useDeferredValue** (`SearchRoom.js:14`)
   - Defers expensive search result recalculation
   - Keeps input field responsive
   - Better UX than debouncing

2. **useTransition** (`LocationDetails.js:94`)
   - Marks floor changes as non-urgent
   - Provides `isPending` for loading states
   - Prevents UI blocking during navigation

3. **lazy + Suspense** (`LocationDetails.js:43-74`)
   - Code-splits SVG floor plans
   - Reduces initial bundle size by ~400KB
   - Shows loading fallback during import

4. **Enhanced Error Boundaries** (`ErrorBoundary.js`, `LocationDetails.js:11-39`)
   - Better error handling for async components
   - Development mode error details

### React Router v7.9.6 Features

1. **errorElement Prop** (`App.js:30,35`)
   - Route-level error handling
   - Better than global error boundaries alone
   - Scoped to specific routes

2. **useRouteError Hook** (`RouteError.js:18`)
   - Access error context in error components
   - Handles Response objects and Error instances
   - Enables detailed error messages

3. **Link prefetch="intent"** (`LocationInfo.js:8`)
   - Prefetches on hover/focus
   - Improves navigation performance

4. **unstable_viewTransition** (`LocationInfo.js:9`, `NotFound.js:8,18`)
   - Smooth page transitions with View Transition API
   - Native browser animations

5. **Loader Pattern** (`loaders.js`)
   - Documented but not yet implemented
   - Ready for migration to `createHashRouter`
   - Pre-loads data before route rendering

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
- The `/docs` directory contains build output (possibly for GitHub Pages)
- No custom build configuration (using CRA defaults)

### Testing

- Test framework: Jest + React Testing Library
- Test files: `*.test.js` or `*.spec.js`
- Setup file: `setupTests.js`
- Updated testing library versions for React 19 compatibility

## Code Conventions

### Naming Conventions

1. **Components**: PascalCase (e.g., `SearchRoom.js`, `LocationDetails.js`)
2. **Room IDs**: Building prefix + number
   - Kåkenhus: `K` + number (e.g., K101, K2411, K52)
   - Täppan: `TP` + number (e.g., TP1, TP4003, TP5050)
   - Special rooms: `TPm51` (prefix 'm' for certain rooms)
3. **CSS IDs**: camelCase (e.g., `#headerRoom`, `#tillbakaKnapp`)
4. **CSS Classes**: snake_case or kebab-case (e.g., `.start_buildings`)
5. **Map names**: BuildingFloor format (e.g., `Täppan3`, `Kåkenhus5`)
6. **Constants**: UPPER_SNAKE_CASE in `constants.js`

### Code Style

- **No semicolons**: Inconsistent use (some files have them, some don't)
- **String quotes**: Single quotes preferred in JSX, double quotes in some cases
- **Comments**: Mostly Swedish, some English technical comments
- **Comparison**: Uses strict equality `===` in newer code
- **Arrow functions**: Preferred for functional components
- **PropTypes**: Not used (no runtime type checking)
- **Hooks**: Proper dependency arrays and optimization

### SVG Handling

- SVG files imported as React components using `@svgr/webpack`
- **Lazy loading pattern** (new):
  ```javascript
  const Täppan3 = lazy(() => import('./maps/Täppan3.svg').then(module => ({
    default: module.ReactComponent
  })));
  ```
- **Regular import pattern** (for small icons):
  ```javascript
  import {ReactComponent as Back} from './icons/back.svg';
  ```
- Rendered as self-closing JSX tags: `<Täppan3 />`
- SVG IDs in files correspond to room names for highlighting

## Common Patterns

### 1. Conditional Rendering with Configuration

Used in `LocationDetails.js`:
```javascript
const FLOOR_CONFIGS = {
  [MAP_NAMES.TAPPAN_3]: { component: Täppan3, header: BUILDINGS.TAPPAN, floorCode: FLOOR_CODES.TP3 },
  // ...
};

const config = FLOOR_CONFIGS[mapName];
if (config) {
  const FloorComponent = config.component;
  return <FloorComponent />;
}
```

### 2. Deferred Search with useMemo

In `SearchRoom.js`:
```javascript
const deferredSearchString = useDeferredValue(searchString);

const resultList = useMemo(() => {
  const filteredResults = elements
    .filter(room => matchSearch(room.room))
    .sort((a,b) => a.room.length - b.room.length);
  return filteredResults.slice(0, 5);
}, [deferredSearchString]);
```

### 3. Transitions for Better UX

In `LocationDetails.js`:
```javascript
const [isPending, startTransition] = useTransition();

const changeFloor = useCallback((newFloorCode) => {
  startTransition(() => {
    setCurrentFloor(newFloorCode);
  });
}, []);
```

### 4. Lazy Loading with Error Handling

```javascript
const Täppan3 = lazy(() =>
  import('./maps/Täppan3.svg')
    .then(module => ({ default: module.ReactComponent }))
    .catch(err => {
      console.error('Failed to load Täppan3 map:', err);
      throw err;
    })
);

// Usage
<Suspense fallback={<div className="loadingIndicator">Laddar karta...</div>}>
  <Täppan3 />
</Suspense>
```

### 5. UseEffect for DOM Manipulation

```javascript
useEffect(() => {
  if (roomName && containerRef.current) {
    const roomElement = containerRef.current.querySelector("#" + roomName);
    if (roomElement) {
      roomElement.classList.add("start_buildings");
    }
  }
}, [roomName]);
```

## Improvements Made (Recent Updates)

### Performance Optimizations

1. **Lazy loading SVG maps**: Reduces initial bundle size by ~400KB
2. **useDeferredValue for search**: Better than manual debouncing
3. **useTransition for floor navigation**: Non-blocking UI updates
4. **useMemo for expensive calculations**: Prevents unnecessary recalculations
5. **useCallback for event handlers**: Prevents re-renders

### Code Quality

1. **Constants file**: Centralized building names and floor codes
2. **Configuration-driven rendering**: `FLOOR_CONFIGS` eliminates code duplication
3. **Proper error handling**: Global + route-level + Suspense error boundaries
4. **Accessibility improvements**: ARIA labels, live regions, semantic HTML
5. **Better code organization**: Separated concerns into focused files

### User Experience

1. **Loading states**: Shows "Laddar karta..." during async operations
2. **Error pages**: Friendly error messages in Swedish
3. **Empty states**: "Inga resultat hittades" feedback
4. **More results indicator**: "Fler resultat tillgängliga..." when >5 matches
5. **View transitions**: Smooth page transitions with native API
6. **Prefetching**: Faster navigation with `prefetch="intent"`

### Developer Experience

1. **Comprehensive documentation**: This CLAUDE.md file
2. **Code comments**: Explains React 19 and Router v7 features
3. **Loader examples**: Ready for future API integration
4. **Test setup**: Updated for React 19 compatibility
5. **Clear separation**: Error handling, constants, loaders in separate files

## Known Limitations & Future Opportunities

### Current Limitations

1. **TypeScript**: No type safety (JavaScript only)
2. **Static data**: No API integration yet (loaders ready for future use)
3. **HashRouter**: Can't use all React Router v7 features
  - To use loaders, would need to migrate to `createHashRouter`
  - View transitions still experimental (`unstable_viewTransition`)
4. **No code splitting for routes**: All routes load upfront
5. **Limited test coverage**: Only basic tests exist

### Technical Debt

1. **Direct DOM manipulation**: Still uses `document.querySelector` in some places
  - Could be improved with refs
2. **SVG optimization**: Maps could be optimized further for size
3. **Bundle optimization**: No tree-shaking for unused SVG paths
4. **Search algorithm**: Could implement fuzzy search for better UX
5. **No analytics**: Can't track popular searches or usage patterns

### Future Enhancement Ideas

1. **Migrate to createHashRouter**: Enable loader pattern fully
2. **Add TypeScript**: Type safety and better IDE support
3. **API integration**: Fetch room data from backend
4. **Real-time data**: Room availability, booking status
5. **Search improvements**: Fuzzy search, filters by building/floor
6. **Favorites/bookmarks**: Save frequently accessed rooms
7. **Directions**: Route finding between rooms
8. **PWA enhancement**: Offline support, install prompts
9. **Dark mode**: Theme switching capability
10. **Internationalization**: English translation option
11. **Admin panel**: Update room data without code changes
12. **3D visualization**: Building exteriors, 3D floor plans
13. **Analytics**: Track popular searches and usage patterns
14. **Multi-campus support**: Expand beyond Norrköping

## Dependencies

### Production Dependencies

- `react` (^19.2.0): Core React library with concurrent features
- `react-dom` (^19.2.0): React DOM rendering with new hooks
- `react-router-dom` (^7.9.6): Client-side routing with loaders and error handling
- `react-scripts` (5.0.1): Create React App build tooling
- `web-vitals` (^5.1.0): Performance metrics (updated)

### Development Dependencies

- `@svgr/webpack` (^8.1.0): SVG-to-React component transformer (updated)

### Testing Dependencies

- `@testing-library/jest-dom` (^6.9.1): Custom Jest matchers for DOM (updated)
- `@testing-library/react` (^16.3.0): React testing utilities for React 19
- `@testing-library/user-event` (^14.6.1): User interaction simulation (updated)

### Dependency Overrides

Security and compatibility overrides in `package.json`:
- `nth-check` (^2.1.1)
- `postcss` (^8.5.6)
- `js-yaml` (^4.1.1)
- `webpack-dev-server` (^5.2.2)

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

- Main development branch: Check with `git branch` to see current branch
- Feature branches follow pattern: `claude/feature-name-sessionid`
- All changes should be committed with clear, descriptive messages

### Ignored Files (.gitignore)

- `/node_modules`: Dependencies
- `/.pnp` and `.pnp.js`: Yarn PnP
- `/coverage`: Test coverage reports
- `/build`: Production builds
- `.DS_Store`: macOS system files
- `.env.*`: Environment variables
- `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`: Log files

### Recent Major Updates

Recent commits show progression:
1. **React 19.2.0 upgrade**: New hooks and concurrent features
2. **React Router v7 features**: Error handling, prefetching
3. **UX/UI improvements**: Accessibility, error pages, loading states
4. **Code quality**: Constants, configuration-driven rendering
5. **Documentation**: This CLAUDE.md file

## AI Assistant Guidelines

### When Making Changes

1. **Preserve Swedish UI text**: Don't translate user-facing strings unless explicitly requested
2. **Maintain styling consistency**: Keep the #00B3E1 blue theme
3. **Test room highlighting**: Ensure SVG IDs match room names in DataBase.js
4. **Check both buildings**: Test changes on both Kåkenhus and Täppan
5. **Validate floor ranges**: Kåkenhus (1-5), Täppan (3-5)
6. **Respect responsive design**: Maintain vw/vh-based sizing
7. **Use constants**: Import from `constants.js` instead of hard-coding strings
8. **Follow React 19 patterns**: Use appropriate hooks (useDeferredValue, useTransition, etc.)
9. **Add error handling**: Use error boundaries and Suspense where appropriate
10. **Consider performance**: Use lazy loading for large components

### Adding New Rooms

1. Add entry to `DataBase.js` elements array
2. Ensure SVG map file has matching ID element
3. Use constants from `constants.js` for building names
4. Use correct floor number for the building
5. Test search functionality finds the new room
6. Verify room highlights correctly on the map

### Adding New Buildings

1. Create SVG files for each floor: `BuildingNameN.svg`
2. Add rooms to `DataBase.js` with new building name
3. Add building constant to `constants.js`
4. Add floor codes to `constants.js`
5. Add map names to `constants.js`
6. Create lazy imports in `LocationDetails.js`
7. Add to `FLOOR_CONFIGS` object
8. Add conditional rendering and floor navigation
9. Update this documentation

### Modifying SVG Maps

1. Maintain consistent ID naming for rooms (must match DataBase.js)
2. Keep viewBox dimensions consistent for smooth transitions
3. Preserve layer structure (#Lager_1, #Lager_2)
4. Test highlighting animation works on modified elements
5. Ensure SVG file size remains reasonable (current range: 28KB-110KB)
6. Consider lazy loading impact on performance

### Adding New Features

When implementing new features:

1. **Use React 19 features**: Leverage concurrent features when appropriate
   - `useDeferredValue` for expensive calculations
   - `useTransition` for non-urgent updates
   - `lazy + Suspense` for code splitting
   - `useMemo` and `useCallback` for optimization

2. **Consider React Router v7 migration**: If adding data loading
   - Document in `loaders.js` first
   - Consider migrating to `createHashRouter` if needed
   - Use error boundaries and error elements

3. **Add error handling**: Every async operation needs error handling
   - Use Suspense for async imports
   - Use error boundaries for components
   - Use try-catch for async operations

4. **Maintain accessibility**:
   - Add ARIA labels
   - Use semantic HTML
   - Test keyboard navigation
   - Add screen reader announcements

5. **Add loading states**: Show feedback for all async operations
   - Use Suspense fallbacks
   - Use transition pending states
   - Show spinners or skeleton screens

### Code Modernization Best Practices

When refactoring:

1. **Consider TypeScript**: Type safety would prevent bugs
2. **Extract reusable logic**: Custom hooks for common patterns
3. **Add PropTypes**: Runtime validation if not using TypeScript
4. **Use refs over querySelector**: React-friendly DOM access
5. **Implement proper memoization**: Prevent unnecessary re-renders
6. **Add comprehensive tests**: Unit tests for components and hooks
7. **Document complex logic**: Explain why, not just what
8. **Follow React 19 patterns**: Use recommended hooks and patterns
9. **Optimize bundle size**: Analyze and optimize imports
10. **Monitor performance**: Use React DevTools Profiler

### Testing Strategy

When adding tests:

1. **Search functionality**:
   - Test filtering with various inputs
   - Test case-insensitivity
   - Test result limits (5 max)
   - Test empty states
   - Test "more results" indicator

2. **Room navigation**:
   - Test routing to room details
   - Test room highlighting
   - Test invalid room names
   - Test error boundaries

3. **Floor switching**:
   - Test state updates
   - Test correct SVG rendering
   - Test transition states
   - Test loading fallbacks

4. **Edge cases**:
   - Invalid room names
   - Missing SVG elements
   - Network errors (when API added)
   - Large search results

5. **Accessibility**:
   - Keyboard navigation
   - Screen reader support
   - ARIA labels
   - Focus management

### Debugging Tips

1. **React DevTools**: Use Profiler to identify performance issues
2. **Console errors**: Check for SVG loading failures
3. **Network tab**: Monitor bundle size and loading times
4. **Lighthouse**: Run audits for performance and accessibility
5. **Error boundaries**: Check error logs in development mode
6. **Suspense fallbacks**: Verify loading states show correctly
7. **Transition states**: Use `isPending` to debug UI blocking

## Performance Considerations

### Current Performance

1. **Initial bundle size**: Reduced with lazy loading (~400KB saved)
2. **Search performance**: Optimized with `useDeferredValue`
3. **Floor navigation**: Smooth with `useTransition`
4. **SVG rendering**: Fast with CSS animations
5. **Route transitions**: Enhanced with View Transition API

### Optimization Opportunities

1. **Further code splitting**: Split routes into separate bundles
2. **SVG optimization**: Compress and optimize SVG files
3. **Image optimization**: Use WebP for raster images
4. **Service worker**: Add for offline support and caching
5. **Bundle analysis**: Use webpack-bundle-analyzer
6. **Tree shaking**: Ensure unused code is eliminated
7. **Critical CSS**: Inline critical styles
8. **Preloading**: Preload fonts and critical assets

## Accessibility Status

Current state:
- ✅ ARIA labels on search input
- ✅ ARIA live regions for search results
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Focus management on route changes
- ⚠️ Color contrast (verify WCAG AA compliance)
- ⚠️ Skip links (could be added)
- ⚠️ Focus indicators (could be enhanced)

Improvements made:
- Added `aria-label` to search input
- Added `role="status"` and `aria-live="polite"` to results
- Added descriptive link labels in `LocationInfo`
- Error pages have proper heading hierarchy
- Loading states announced to screen readers

## Security Considerations

1. **No sensitive data**: All room data is public
2. **No authentication**: Public campus map
3. **XSS prevention**: React escapes all content by default
4. **Dependency updates**: Regular updates for security patches
5. **CSP ready**: Content Security Policy can be added
6. **HTTPS recommended**: For production deployment

## Documentation Maintenance

### When to Update This File

Update CLAUDE.md when:
- Dependencies are upgraded (major or minor versions)
- New features are added
- New patterns are introduced
- Architecture changes
- New files are added
- Known issues are fixed
- Enhancement ideas are implemented

### Documentation Standards

- Keep examples concise and relevant
- Use code blocks with syntax highlighting
- Maintain Swedish UI text examples
- Document both what and why
- Include file paths and line numbers for references
- Update "Last Updated" date

---

**Last Updated**: 2025-11-16
**React Version**: 19.2.0
**React Router Version**: 7.9.6
**For**: AI assistants working with the AtLius codebase
**Maintained by**: Claude Code sessions
