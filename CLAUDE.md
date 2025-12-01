# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based interactive mapping platform that enables businesses to display locations where their products or services are available. The application demonstrates dual map provider integration, supporting both Google Maps and Leaflet/OpenStreetMap implementations side-by-side.

## Development Commands

### Running the Application

```bash
npm run dev              # Start Vite dev server (default: http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### Code Quality

```bash
npm run lint             # Run ESLint on .js and .jsx files
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format code with Prettier
```

### Deployment

```bash
npm run deploy           # Deploy to GitHub Pages using gh-pages
```

## Architecture

### Dual Map Implementation

The application is structured to display both mapping solutions simultaneously for comparison:

- **Google Maps Implementation** (`src/components/google/`)
  - Uses `@vis.gl/react-google-maps` library
  - Requires `VITE_GOOGLE_MAPS_API_KEY` and `VITE_GOOGLE_MAP_ID` in `.env`
  - Features advanced controls via Google Maps Drawing API

- **Leaflet Implementation** (`src/components/leaflet/`)
  - Uses `react-leaflet` with OpenStreetMap tiles
  - Includes leaflet-draw for polygon editing
  - No API key required

### Component Architecture

```
App.jsx (routes)
└── Home.jsx
    └── Dashboard.jsx
        ├── TopNavbar (with dark mode toggle)
        └── CardsSection
            ├── LeafletMap (left column)
            └── GoogleMap (right column)
```

### Map Controls Pattern

Both map implementations follow a similar pattern with custom control components:

**Google Maps Controls:**

- `MyLocationControl` - Geolocation button
- `ResetZoomControl` - Reset to default view
- `PolygonControl` - Drawing and editing polygons
- `CityFilterControl` - Filter markers by city
- `PortugalHighlight` - Display country boundary with mask overlay
- `DarkMask` - Dim areas outside region of interest

**Leaflet Controls:**

- `ShowMyLocation` - Geolocation button
- `ResetView` - Reset to default view
- `PolygonEditor` - Drawing and editing polygons using leaflet-draw
- `RegionSelector` - Predefined region bounds (Lisbon, Porto, Faro)
- `BlinkMarker` - Custom blinking marker component

### Data Structure

**Markers** (`src/data/markers.json`):

```json
[
  {
    "id": 1,
    "lat": 38.7223,
    "lng": -9.1393,
    "name": "Location Name",
    "image": "image-url",
    "link": "external-url",
    "color": "#ff0000"
  }
]
```

**GeoJSON Files** (`src/data/`):

- `portugal.json` - Portugal country boundary
- `brazil.json` - Brazil country boundary
- `world.json` - World boundaries

### Styling Approach

- Uses Bootstrap 5 for layout and UI components
- Reactstrap for React-specific Bootstrap components
- Bootstrap Icons for iconography
- AOS (Animate On Scroll) for scroll animations
- Custom CSS in `src/assets/css/`:
  - `app.css` - Main application styles including map marker animations
  - `dashboard.css` - Dashboard layout and dark mode styles
  - `index.css` - Global styles

### Map Marker Styling

Both implementations use CSS-based blinking circle markers defined in `app.css`:

```css
.marker-circle {
  animation: blink 1.5s infinite;
}
```

### Dark Mode Implementation

Dark mode is managed via state in `Dashboard.jsx` and passed down to child components. The implementation uses conditional CSS classes and inline styles rather than a context provider.

## Environment Variables

Required in `.env` file:

- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_GOOGLE_MAP_ID` - Google Cloud Map ID (for advanced features)

Note: The `.env` file contains placeholder values for unused Kinde auth and Stripe payment variables from a previous template.

## Code Style

- **ESLint**: Configured with React Hooks and React Refresh plugins
- **Prettier**: Enforced via ESLint (`prettier/prettier` as error)
- **Special rule**: Unused variables starting with uppercase or underscore are allowed (useful for React component destructuring)
- **Import style**: Named exports for pages, default exports for components

## Routing

Uses React Router v7 with the following routes:

- `/` - Home page (main map interface)
- `/map` - Alias for home page
- `/notfound` - 404 page
- `*` - Catch-all redirects to NotFound

## Key Implementation Details

### Google Maps Drawing Integration

The `PolygonControl` component demonstrates advanced Google Maps usage:

1. Creates a mask overlay to dim areas outside Portugal
2. Implements custom drawing controls in the TOP_LEFT control position
3. Provides editable polygons with real-time GeoJSON conversion
4. Automatically fits bounds when polygon is completed

### Leaflet Custom Markers

Leaflet markers are created using `L.divIcon` with HTML strings to render custom CSS-animated markers that match the Google Maps implementation visually.

### GeoJSON Integration

Both map implementations can overlay country boundaries using GeoJSON files. The Google Maps implementation uses the native `Data` layer, while Leaflet uses the `<GeoJSON>` component from react-leaflet.

## Common Gotchas

1. **Google Maps API**: The `drawing` library must be included in the `libraries` prop of `APIProvider`
2. **Map Controls**: Google Maps custom controls must be cleaned up in useEffect return to prevent memory leaks
3. **Marker Colors**: Both implementations support per-marker color customization via the `color` property in markers.json
4. **Vite Config**: The `base` property is commented out - uncomment and set to `/map` when deploying to GitHub Pages subdirectory
5. **React Version**: Currently uses React 19 - ensure compatibility when adding new dependencies

## Testing Strategy

No automated tests are currently configured. Manual testing should cover:

- Both map implementations render correctly
- All control buttons function as expected
- Polygon drawing and editing works on both maps
- Markers display correct info windows/popups
- Dark mode toggles properly
- Responsive layout on mobile devices
