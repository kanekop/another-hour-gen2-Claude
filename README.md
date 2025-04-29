# Another Hour Clock - Project Summary

## Core Concept
Another Hour Clock operates on a unique 24-hour system that creates a 25-hour day by running each second at 96% of regular length. This provides users with an alternative perception of time, helping them explore a new way to experience temporal flow.

## Features

### Clock Display
- **Dual Time Display**: Shows both standard time and AH (Another Hour) time
- **Analog Clock**: 12-hour analog clock face with special AH hour indicator
- **Digital Time**: Optional digital display showing both time formats
- **Visual Indicators**: Special sector marking for AH hour (actual 23:00-24:00)
- **Dark/Light Mode**: Automatic color inversion during AH hour

### Time Tools
- **Stopwatch**: AH-adjusted stopwatch for measuring elapsed time
- **Timer**: Countdown timer that accounts for AH time scaling
- **Multi-timezone Support**: View AH time across different global time zones

### Customization
- **Admin Panel**: Configure timezone preferences and display settings
- **Display Options**: Toggle between analog and digital displays
- **Timezone Management**: Add/remove timezones for quick reference

### Technical Features
- **96% Time Scaling**: Each second runs at 0.96 of standard length
- **Real-time Updates**: Smooth animation using requestAnimationFrame
- **Timezone Handling**: Comprehensive timezone support via Moment.js
- **Special AH Hour**: Unique handling of the extra hour (23:00-24:00)

## Project Structure
```
project/
├── public/                 # Frontend assets and client-side code
│   ├── css/               # Stylesheets directory
│   │   └── style.css      # Additional styles for components
│   ├── js/                # JavaScript modules directory
│   │   ├── stopwatch-ui.js # Stopwatch interface logic
│   │   └── timer-ui.js    # Timer interface logic
│   ├── pages/             # Additional HTML pages
│   │   ├── stopwatch.html # Stopwatch interface
│   │   └── timer.html     # Timer interface
│   ├── admin.css          # Admin panel styling
│   ├── admin.html         # Admin interface
│   ├── admin.js           # Admin panel logic
│   ├── clock-core.js      # Core clock calculation logic
│   ├── index.html         # Main clock interface
│   ├── main.js            # Clock rendering and updates
│   └── style.css          # Main styling
├── src/                    # Server-side source code
│   ├── routes/            # Express routes
│   │   └── stopwatch.js   # Stopwatch route handlers
│   └── shared/            # Shared utilities
│       └── ah-time.js     # AH time calculations
├── server.js              # Express server
├── settings.json          # Clock configuration
└── package.json           # Project dependencies
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