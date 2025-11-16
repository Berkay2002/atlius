# CLAUDE.md - AI Assistant Guide for AtLius

## Project Overview

**AtLius** is a React-based campus map application for Campus Norrköping at Linköping University. It provides users with an efficient way to search for rooms/locations and visualize them on interactive SVG floor plans.

- **Type**: Single Page Application (SPA)
- **Framework**: React 18.2.0
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Routing**: React Router DOM v6.4.3 (HashRouter)
- **Language**: JavaScript (no TypeScript)
- **UI Language**: Swedish

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
├── .vs/                          # Visual Studio settings (gitignored IDE files)
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── .gitignore                    # Git ignore rules
└── README.md                     # Project documentation (Swedish)
```

## Application Architecture

### Routing Structure

The app uses `HashRouter` with two main routes:

1. **`/`** → `SearchRoom` component
   - Landing page with campus overview map
   - Search input with real-time filtering
   - Displays up to 5 matching results

2. **`/map/:roomName`** → `LocationDetails` component
   - Shows specific floor plan for the room's floor
   - Highlights the selected room with animation
   - Provides floor navigation buttons
   - Back button returns to search

### Component Hierarchy

```
App (HashRouter)
├── SearchRoom
│   ├── Map (SVG component - startPage.svg)
│   └── LocationInfo (rendered for each search result)
│       └── Link to LocationDetails
└── LocationDetails
    ├── Back button (Link to /)
    ├── Floor plan SVG (conditional render based on building/floor)
    ├── Floor navigation buttons (if viewing building overview)
    └── Room description (room name and floor number)
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

## Key Features & Implementation Details

### 1. Search Functionality (SearchRoom.js)

- **Case-insensitive search**: Converts both search string and room names to lowercase
- **Real-time filtering**: Updates results on every keystroke
- **Result limiting**: Shows maximum 5 results sorted by length
- **Auto-clear**: Uses `onBlur` event with 50ms timeout to clear search when focus is lost
- **Initial state**: Search string initialized to "§" to prevent showing all results on load

### 2. Room Visualization (LocationDetails.js)

- **Dynamic SVG imports**: Floor plans imported as React components
- **Room highlighting**: Uses CSS class `start_buildings` to highlight selected room
- **Animation**: 5-iteration fade animation on highlighted rooms (opacity 0.25 to 1)
- **Floor navigation**: Conditional rendering of floor buttons based on building
- **State management**: `currentFloor` state allows switching between floors without changing route

### 3. Styling Conventions (App.css)

- **Primary color**: `#00B3E1` (bright blue)
- **Accent color**: `#0085a6` (darker blue for active states)
- **Alternating row colors**: Even (`#D9D9D9`), Odd (`#c1c1c1`)
- **Responsive sizing**: Uses `vw` and `vh` units extensively
- **Animations**: Two keyframe animations (`fade_a`, `fade_b`)
- **Mobile-first**: Fixed positioning and viewport-based dimensions

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
- The `/docs` directory appears to contain a previous build (possibly for GitHub Pages)
- No custom build configuration (using CRA defaults)

### Testing

- Test framework: Jest + React Testing Library
- Test files: `*.test.js` or `*.spec.js`
- Setup file: `setupTests.js`

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

### Code Style

- **No semicolons**: Inconsistent use (some files have them, some don't)
- **String quotes**: Single quotes preferred in JSX, double quotes in some cases
- **Comments**: Swedish language, sparse documentation
- **Comparison**: Uses `==` instead of `===` in some places (e.g., `LocationDetails.js:18, 31, 34`)
- **Arrow functions**: Preferred for functional components
- **PropTypes**: Not used (no runtime type checking)

### SVG Handling

- SVG files imported as React components using `@svgr/webpack`
- Import pattern: `import {ReactComponent as Name} from './path.svg'`
- Rendered as self-closing JSX tags: `<Name />`
- SVG IDs in files correspond to room names for highlighting

## Common Patterns

### 1. Conditional Rendering

Used extensively in `LocationDetails.js`:
```javascript
{mapName === 'Täppan3' && <Täppan3 />}
```

### 2. Array Filtering & Mapping

In `SearchRoom.js`:
```javascript
elements
  .filter(room => matchSearch(room.room))
  .sort((a, b) => a.length - b.length)
  .slice(0, 5)
  .map(input => <LocationInfo key={input.room} data={input} />)
```

### 3. React Router Links

Navigation uses `Link` components, not anchor tags:
```javascript
<Link to={"/map/" + roomName}>
```

### 4. UseEffect for DOM Manipulation

```javascript
useEffect(() => {
  if (room) {
    document.querySelector("#" + roomName).classList.add("start_buildings");
  }
}, []);
```

## Known Issues & Technical Debt

### Code Quality Issues

1. **Type safety**: No TypeScript, no PropTypes validation
2. **Equality operators**: Uses `==` instead of `===` (potential bugs)
3. **Missing dependencies**: `useEffect` in `LocationDetails.js:49` missing `roomName` in dependency array
4. **Direct DOM manipulation**: Uses `document.querySelector` instead of refs
5. **Magic strings**: Hard-coded building/floor names throughout
6. **Commented code**: Line 86 in `DataBase.js` has commented-out room entry

### Swedish Language Inconsistencies

- Variable names in English (e.g., `searchString`, `currentFloor`)
- UI text in Swedish (e.g., "Sök efter lokal...", "Våning")
- Comments in Swedish (e.g., "// Om man tryckt på Täppan...")
- Building names in Swedish with special characters (Kåkenhus, Täppan)

### Potential Bugs

1. **Special character handling**: Building name "Täppan" vs route param "Tappan" (missing ä) on line 31
2. **Similar typo**: "Kakenhus" vs "Kåkenhus" on line 34 and 128
3. **Unhandled edge cases**: No error handling for missing rooms or invalid routes
4. **Performance**: No memoization on search results (could impact with larger datasets)

## AI Assistant Guidelines

### When Making Changes

1. **Preserve Swedish UI text**: Don't translate user-facing strings unless explicitly requested
2. **Maintain styling consistency**: Keep the #00B3E1 blue theme
3. **Test room highlighting**: Ensure SVG IDs match room names in DataBase.js
4. **Check both buildings**: Test changes on both Kåkenhus and Täppan
5. **Validate floor ranges**: Kåkenhus (1-5), Täppan (3-5)
6. **Respect responsive design**: Maintain vw/vh-based sizing

### Adding New Rooms

1. Add entry to `DataBase.js` elements array
2. Ensure SVG map file has matching ID element
3. Verify building name matches exactly ("Kåkenhus" or "Täppan")
4. Use correct floor number for the building
5. Test search functionality finds the new room
6. Verify room highlights correctly on the map

### Adding New Buildings

1. Create SVG files for each floor: `BuildingNameN.svg`
2. Add rooms to `DataBase.js` with new building name
3. Import SVG components in `LocationDetails.js`
4. Add conditional rendering blocks for each floor
5. Add floor navigation button group
6. Update this documentation

### Modifying SVG Maps

1. Maintain consistent ID naming for rooms (must match DataBase.js)
2. Keep viewBox dimensions consistent for smooth transitions
3. Preserve layer structure (#Lager_1, #Lager_2)
4. Test highlighting animation works on modified elements
5. Ensure SVG file size remains reasonable (current range: 28KB-110KB)

### Code Modernization Suggestions

When refactoring, consider:

1. **Add TypeScript**: Type safety for room objects and props
2. **Use strict equality**: Replace `==` with `===`
3. **Add PropTypes**: Runtime validation if not using TypeScript
4. **Extract constants**: Create constants file for building names, colors
5. **Fix useEffect dependencies**: Include all referenced values
6. **Use refs instead of querySelector**: React-friendly DOM access
7. **Add error boundaries**: Handle missing SVG elements gracefully
8. **Implement loading states**: Show feedback during navigation
9. **Add accessibility**: ARIA labels, keyboard navigation
10. **Fix typos**: "Tappan"/"Kakenhus" should match "Täppan"/"Kåkenhus"

### Testing Strategy

When adding tests:

1. **Search functionality**: Test filtering, case-insensitivity, result limits
2. **Room navigation**: Test routing, room highlighting
3. **Floor switching**: Test state updates, correct SVG rendering
4. **Edge cases**: Invalid room names, missing SVG elements
5. **Accessibility**: Keyboard navigation, screen reader support

## Dependencies

### Production Dependencies

- `react` (^18.2.0): Core React library
- `react-dom` (^18.2.0): React DOM rendering
- `react-router-dom` (^6.4.3): Client-side routing
- `react-scripts` (5.0.1): Create React App build tooling
- `web-vitals` (^2.1.4): Performance metrics

### Development Dependencies

- `@svgr/webpack` (^6.5.1): SVG-to-React component transformer
- `@testing-library/jest-dom` (^5.16.5): Custom Jest matchers for DOM
- `@testing-library/react` (^13.4.0): React testing utilities
- `@testing-library/user-event` (^13.5.0): User interaction simulation

### Browser Support

From `package.json` browserslist:

**Production:**
- >0.2% market share
- Not dead browsers
- Not Opera Mini

**Development:**
- Last Chrome version
- Last Firefox version
- Last Safari version

## Git Workflow

### Branch Structure

- Working branch: `claude/claude-md-mi1tn7dlvao6m9bt-01VFoL7hccFQPm6PKYBp3wnk`
- All changes should be committed to this branch
- Use clear, descriptive commit messages

### Ignored Files (.gitignore)

- `/node_modules`: Dependencies
- `/.pnp` and `.pnp.js`: Yarn PnP
- `/coverage`: Test coverage reports
- `/build`: Production builds
- `.DS_Store`: macOS system files
- `.env.*`: Environment variables
- `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`: Log files

### Recent Commits

Latest commits focus on README.md updates and startPage.svg modifications.

## Performance Considerations

1. **SVG file sizes**: Range from 28KB to 110KB (startPage.svg is largest)
2. **Bundle size**: No code splitting implemented
3. **Search optimization**: Could benefit from debouncing on larger datasets
4. **Animation performance**: CSS animations are GPU-accelerated
5. **No lazy loading**: All SVG components loaded upfront

## Accessibility Considerations

Current state:
- ❌ No ARIA labels on interactive elements
- ❌ Limited keyboard navigation support
- ❌ No screen reader announcements for search results
- ❌ No focus management on route changes
- ⚠️ Color contrast needs verification for WCAG compliance
- ✅ Semantic HTML structure in places

## Future Enhancement Ideas

1. **Search improvements**: Fuzzy search, search by building, floor filter
2. **Favorites/bookmarks**: Save frequently accessed rooms
3. **Directions**: Route finding between rooms
4. **3D visualization**: Building exteriors, 3D floor plans
5. **Mobile app**: PWA enhancement or native apps
6. **Admin panel**: Update room data without code changes
7. **Multi-campus support**: Expand beyond Norrköping
8. **Internationalization**: English translation option
9. **Dark mode**: Theme switching capability
10. **Analytics**: Track popular searches and rooms

---

**Last Updated**: 2025-11-16
**For**: AI assistants working with the AtLius codebase
**Maintained by**: Claude Code sessions
