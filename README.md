# Another Hour Clock - Project Summary

## Project Structure
```
project/
├── public/                 # Frontend assets and client-side code
│   ├── admin.css          # Admin panel styling
│   ├── admin.html         # Admin interface
│   ├── admin.js           # Admin panel logic
│   ├── clock-core.js      # Core clock calculation logic
│   ├── index.html         # Main clock interface
│   ├── main.js           # Clock rendering and updates
│   └── style.css         # Main styling
├── server.js             # Express server
├── settings.json         # Clock configuration
└── package.json         # Project dependencies
```

## Key Files Description

### Server-Side
- `server.js`: Express server handling static files and API endpoints for settings
- `settings.json`: Stores timezone preferences and display settings

### Frontend
- `public/clock-core.js`: Contains core time calculation logic and hand angle computations
- `public/main.js`: Handles clock rendering, updates, and timezone management
- `public/index.html`: Main clock interface with SVG-based analog clock
- `public/admin.html` & `admin.js`: Admin interface for managing timezones and display settings

## Core Logic Location

The core clock logic is primarily in two files:

1. `public/clock-core.js`:
   - Contains `SCALE_AH` constant (24/23) for time scaling
   - `getAngles()` function calculates clock hand positions
   - Handles special "AH hour" (23:00-24:00) calculations

2. `public/main.js`:
   - Manages clock updates and rendering
   - Handles timezone conversions
   - Controls the AH sector display

## Clock Rendering

The clock is rendered client-side using:
- SVG for the analog clock face
- JavaScript for dynamic updates
- requestAnimationFrame for smooth animation
- Moment.js for timezone handling

Key components:
- SVG circle for clock face
- SVG lines for clock hands
- Special sector for AH hour indication
- Digital time display

## Main Dependencies

```json
{
  "express": "^4.21.2",    // Web server framework
  "moment": "latest",      // Time manipulation (client-side)
  "moment-timezone": "latest" // Timezone handling (client-side)
}
```

## Entry Point

The application starts with:
```bash
npm start
```

Which runs `node server.js` as defined in package.json.

## Special Features

1. **AH Time Calculation**: 
   - Normal hours run at 24/23 speed
   - Special handling for the 23:00-24:00 hour

2. **Timezone Support**:
   - Multiple timezone management
   - UTC offset display
   - Automatic local timezone detection

3. **Visual Indicators**:
   - Color inversion during AH hour
   - Special sector marking AH hour period
   - Dual time display (actual and AH time)