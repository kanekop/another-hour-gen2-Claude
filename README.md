# Another Hour Clock

Another Hour Clock is a unique web-based application that redefines your perception of time. It primarily features a conceptual clock operating on a 23-hour day, achieved by running time slightly faster and incorporating an "Another Hour" (AH) period (the real-time 23rd hour). This project also includes an advanced World Clock, AH-aware time tools (Stopwatch, Timer), and an Admin Panel for configuration. The entire site defaults to a light theme, with the main clock page visually transitioning to a dark theme during its AH period.

## Table of Contents

1.  [Features](#features)
2.  [Live Demo](#live-demo)
3.  [Project Structure](#project-structure)
4.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Configuration](#configuration)
    * [Running the Application](#running-the-application)
5.  [Usage](#usage)
    * [Main Clock](#main-clock)
    * [World Clock](#world-clock)
    * [Stopwatch and Timer](#stopwatch-and-timer)
    * [Admin Panel](#admin-panel)
6.  [Technical Details](#technical-details)
    * [Another Hour (AH) Time Calculation](#another-hour-ah-time-calculation)
    * [Frontend](#frontend)
    * [Backend](#backend)
    * [Theme](#theme)
7.  [Contributing](#contributing)
8.  [Roadmap](#roadmap)
9.  [License](#license)

## Features

* **Main Analog & Digital Clock:**
    * Displays time based on the "Another Hour" concept (a 23-hour AH day cycle within a 24-hour real-time day).
    * SVG-based 12-hour analog dial with a highlighted "AH Sector" indicating the Another Hour period (real-time 23:00-00:00).
    * Toggleable digital display showing both AH time and standard local time.
    * Timezone selection dropdown for the main clock.
    * Visual theme inverts to dark mode during the selected timezone's AH period.

* **World Clock Page (`/pages/world-clock.html`):**
    * Displays a grid of 24 analog and digital clocks for different timezones.
    * Dynamically selects 24 distinct UTC offsets (from UTC-11 to UTC+12) at page load and assigns representative cities, considering current DST rules to ensure accurate real-time offsets.
    * Each clock item displays:
        * City name (and country/region).
        * Digital AH time (calculated based on the 23-hour cycle concept).
        * Digital standard local time for that city.
        * Fully functional analog clock with hands correctly representing the AH time.
    * Timezones currently in their "Another Hour" (local standard time 23:00-00:00) are visually distinguished:
        * The specific clock item inverts to a dark theme.
        * A subtle blinking/pulsing effect is applied to the item.
    * The overall page theme remains light, regardless of individual clock AH statuses.

* **Time Tools (AH-Aware):**
    * **Stopwatch (`/pages/stopwatch.html`):** Measures elapsed time in AH units, where 1 AH second = 0.96 real seconds (based on a 25-hour day equivalent).
    * **Timer (`/pages/timer.html`):** Allows setting a countdown duration in AH units (also based on the 0.96 AH_FACTOR).

* **Admin Panel (`/admin`):**
    * Password-protected panel to manage application settings.
    * Configure timezones available for the main clock.
    * Adjust display preferences (e.g., show/hide AH time, show/hide actual time on the main clock).

* **Visual Theme:**
    * The application defaults to a light theme (bright background, dark text).
    * The Main Clock page inverts to a dark theme specifically when the selected timezone enters its "Another Hour" (23:00-00:00 local time).
    * Individual clock items on the World Clock page invert to a dark theme and apply a visual effect when their respective timezone is in its AH period.

## Live Demo

*(If you have a live deployment, link it here. e.g., `[Live Demo](https://your-app-url.com)`)*

## Project Structure

```
project/
├── public/                   # Frontend assets and client-side code
│   ├── css/                  # Stylesheets directory
│   │   ├── components.css    # Common UI component styles
│   │   ├── main-clock.css    # Main clock page styles
│   │   ├── stopwatch.css     # Stopwatch page styles
│   │   ├── style.css        # Global styles
│   │   ├── timer.css        # Timer page styles
│   │   └── world-clock.css  # World clock page styles
│   ├── js/                  # Client-side JavaScript modules
│   │   ├── stopwatch-ui.js  # Stopwatch functionality
│   │   ├── timer-ui.js      # Timer functionality
│   │   └── world-clock-ui.js # World clock functionality
│   ├── pages/               # Additional HTML pages
│   │   ├── stopwatch.html   # Stopwatch interface
│   │   ├── timer.html       # Timer interface
│   │   └── world-clock.html # World clock interface
│   ├── admin.css            # Admin panel styling
│   ├── admin.html           # Admin interface
│   ├── admin.js             # Admin panel logic
│   ├── clock-core.js        # Core clock calculation logic
│   ├── index.html           # Main clock interface
│   ├── main.js              # Main application logic
│   └── style.css            # Legacy global styles
├── src/                     # Server-side source code
│   ├── routes/              # Express route handlers
│   │   └── stopwatch.js     # Stopwatch API routes
│   └── shared/              # Shared utilities
│       └── ah-time.js       # AH time conversion utilities
├── .gitignore              # Git ignore configuration
├── .replit                 # Replit configuration
├── README.md               # Project documentation
├── generated-icon.png      # Project icon
├── index.js               # Legacy entry point
├── package-lock.json      # Node.js dependency lock
├── package.json           # Node.js project configuration
├── server.js              # Express server
└── settings.json          # Application settings
```

## Getting Started

### Prerequisites

* Node.js (version 18 or higher recommended)
* npm (usually comes with Node.js)
* A modern web browser with SVG support (Chrome, Firefox, Safari, Edge)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/another-hour.git](https://github.com/your-username/another-hour.git) # Replace with your actual repository URL
    cd another-hour
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Create a `.env` file:**
    Copy the example environment file `.env.example` to `.env` and edit its values:
    ```bash
    cp .env.example .env
    ```
    Then, open `.env` in a text editor and set the following variables:
    * `SESSION_SECRET`: A long, random string for session encryption.
    * `ADMIN_KEY`: A password to access the admin panel at `/admin`.

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command runs `node server.js`.

2.  Open your web browser and navigate to `http://localhost:3000` (or the port specified in `server.js`).

## Usage

### Main Clock

* Accessible at the root path (`/`).
* Displays the primary "Another Hour" analog clock for the selected timezone.
* Use the dropdown menu to change the timezone.
* Click "Toggle Digital Display" to show/hide numerical AH time and standard time.
* The page theme will invert to dark mode if the selected timezone is in its "Another Hour" (23:00-00:00 local).
* Click the "All Time Zone" button to navigate to the World Clock page.

### World Clock

* Accessible via the "All Time Zone" button from the Main Clock page, or directly at `/pages/world-clock.html`.
* Displays a grid of 24 clocks, each representing a distinct UTC offset from UTC-11 to UTC+12.
* Representative cities are dynamically chosen for each offset at page load, considering current DST.
* Each clock item shows the city, digital AH time, digital standard time, and an analog AH clock.
* Clock items for timezones currently in their "Another Hour" (23:00-00:00 local standard time) will invert to a dark theme and have a blinking/pulsing visual effect.

### Stopwatch and Timer

* Accessible at `/pages/stopwatch.html` and `/pages/timer.html` respectively.
* These tools operate using "AH seconds" where 1 AH second = 0.96 real seconds (based on a 25-hour day concept, distinct from the main clock's 23-hour cycle).

### Admin Panel

* Accessible at `/admin`.
* Login using the `ADMIN_KEY` defined in the `.env` file.
* Allows management of timezones selectable for the main clock and other application settings (like showing/hiding AH or actual time on the main clock).

## Technical Details

### Another Hour (AH) Time Calculation

This project implements two distinct "Another Hour" time concepts:

1.  **Main Clock & World Clock (23-hour cycle - `public/clock-core.js`):**
    * The standard 24-hour day is condensed into a 23-hour "Another Hour" day.
    * Time runs faster for the first 23 real hours (`SCALE_AH = 24 / 23`, approx 1.04167x speed).
    * The real-time period from 23:00 to 00:00 is designated as the "Another Hour". For digital display, this hour can be shown as 24:xx. For analog display, this hour is visually mapped to the 00:00-01:00 segment on a 12-hour dial for a distinct representation.
    * This logic is used for both the main clock and all clocks on the World Clock page.

2.  **Stopwatch/Timer (25-hour day equivalent - `src/shared/ah-time.js`):**
    * Used specifically for the Stopwatch and Timer utilities.
    * An "AH second" is defined as `0.96` real seconds (`AH_FACTOR = 0.96`).
    * This effectively creates a 25-AH-hour equivalent within a 24-real-hour period (`24 / 0.96 = 25`).
    * Functions `toAhMillis()` and `fromAhMillis()` handle conversions.

### Frontend

* Built with HTML5, CSS3, and Vanilla JavaScript (ES6 Modules).
* **Moment.js** and **Moment Timezone** are used for robust date, time, and timezone manipulations.
* SVG (Scalable Vector Graphics) is used for rendering all analog clock faces and hands, allowing for smooth animations and scalability.
* Client-side logic handles all time calculations, clock updates, and dynamic DOM manipulations.

### Backend

* Node.js with the Express.js framework.
* Serves static frontend files from the `public` directory.
* Provides a simple API endpoint for the Stopwatch (`/api/stopwatch/elapsed`).
* Manages application settings (`settings.json`) via API endpoints (`/api/settings`) with admin authentication.
* Uses `express-session` for session management (though currently minimal in its direct use for end-users beyond potential admin sessioning).

### Theme

* The application defaults to a light visual theme.
* The main clock page dynamically switches to a dark theme when the displayed time enters the "Another Hour" (23:00 local time).
* On the World Clock page, individual clock items switch to a dark theme and apply a visual effect when their respective timezone is in its "Another Hour."

## Contributing

*(This section can be expanded if you wish to accept external contributions. For now, it's a standard placeholder.)*
We welcome contributions! Please see `CONTRIBUTING.md` (if you create one) for details on how to submit pull requests, report issues, and suggest features.

## Roadmap

The following outlines completed tasks and potential future improvements:

**Completed for World Clock:**
* [x] Display 24 clocks for distinct UTC offsets.
* [x] Dynamically select representative cities considering DST.
* [x] Implement fully functional analog hands for each world clock.
* [x] Implement individual dark mode + blinking for AH-active world clocks.
* [x] Ensure World Clock page defaults to light theme.

**Enhancements & Future Ideas:**
* [ ] **World Clock:** Display a global message when any of the 24 world clocks are in their "Another Hour."
* [ ] **World Clock:** Highlight the clock item corresponding to the user's local timezone.
* [ ] **World Clock:** Refine the visual style of AH-active clock items (e.g., color scheme, AH sector display).
* [ ] **World Clock:** Allow user customization of displayed timezones or grid layout.
* [ ] **Stopwatch & Timer:** UI/UX enhancements and (optional) persistence of lap times/timer settings.
* [ ] **General:** Internationalization (i18n) for UI text (e.g., English/Japanese).
* [ ] **General:** Performance optimization, especially for rendering many clocks.
* [ ] **General:** Consider replacing Moment.js with a lighter library like Day.js (with necessary plugins) to reduce bundle size.
* [ ] **General:** Progressive Web App (PWA) features for offline caching and "installability."
* [ ] **General:** Further refine or unify the two "Another Hour" concepts, or clarify their distinct applications more prominently in the UI if they remain separate.
* **Stretch Goals:**
    * [ ] watchOS companion app.
    * [ ] Customizable themes/skins for the entire application.

## License

*(Choose a license if you haven't already. MIT is a common choice.)*
Example: This project is licensed under the MIT License. See the `LICENSE` file for details.

---
*(Placeholder: © 2025 Your Name/Project Name. All Rights Reserved. If not using an open-source license)*