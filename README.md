# Another Hour Clock

Another Hour Clock is a unique web-based application that redefines your perception of time. It operates on a unified "Another Hour" (AH) time scale where time runs approximately 4.17% faster than real time (1 AH second = 23/24 real seconds, or approximately 0.95833 real seconds). This effectively fits a standard 24-hour day into a conceptual 23-AH-hour day. The main clock features a special "Another Hour" period during the real-time 23rd hour. The project includes an advanced World Clock, Stopwatch, Timer (all AH-aware and using this unified scale), and an Admin Panel for configuration.

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
    * Displays time based on the unified "Another Hour" concept (a 23-hour AH day cycle within a 24-hour real-time day, where 1 AH sec $\approx$ 0.95833 real sec).
    * SVG-based 12-hour analog dial with a highlighted "AH Sector" indicating the Another Hour period (real-time 23:00-00:00).
    * Toggleable digital display showing both AH time and standard local time.
    * Timezone selection dropdown for the main clock.
    * Visual theme inverts to dark mode during the selected timezone's AH period.

* **World Clock Page (`/pages/world-clock.html`):**
    * Displays a grid of 24 analog and digital clocks for different timezones, all operating on the unified AH time scale.
    * **Layout**: Presents all 24 clocks in a fixed grid layout (e.g., 6 columns wide on larger screens, adjusting to fewer columns on narrower screens like tablets and smartphones) to ensure all clocks are visible for maximum impact.
    * Dynamically selects 24 distinct UTC offsets (from UTC-11 to UTC+12) at page load and assigns representative cities, considering current DST rules to ensure accurate real-time offsets.
    * **User Timezone Highlight**: The city name corresponding to the user's detected local timezone is highlighted (e.g., displayed in red and bold text) for easy identification.
    * Each clock item displays:
        * City name (and country/region).
        * Digital AH time (calculated based on the unified 23-hour AH day cycle concept).
        * Digital standard local time for that city.
        * Fully functional analog clock with hands correctly representing the AH time.
    * Timezones currently in their "Another Hour" (local standard time 23:00-00:00) are visually distinguished.

* **Time Tools (AH-Aware - Unified Scale):**
    * **Stopwatch (`/pages/stopwatch.html`):** Measures elapsed time in AH units, consistent with the main clock's scale (1 AH sec $\approx$ 0.95833 real sec).
    * **Timer (`/pages/timer.html`):** Allows setting a countdown duration in AH units, consistent with the main clock's scale.

* **Admin Panel (`/admin`):**
    * Password-protected panel to manage application settings.
    * Configure timezones available for the main clock.
    * Adjust display preferences (e.g., show/hide AH time, show/hide actual time on the main clock).

* **Visual Theme:**
    * The application defaults to a light theme.
    * The Main Clock page inverts to a dark theme specifically when the selected timezone enters its "Another Hour."
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
│   │   ├── timer.css        # Timer page styles
│   │   └── world-clock.css  # World clock page styles
│   ├── js/                  # Client-side JavaScript modules
│   │   ├── city-timezones.js # Timezone data and utilities
│   │   ├── stopwatch-ui.js  # Stopwatch functionality
│   │   ├── timer-ui.js      # Timer functionality
│   │   ├── timezone-manager.js # Timezone management utilities
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
│   ├── style.css           # Global styles
│   └── tako.html           # Additional page
├── src/                     # Server-side source code
│   ├── routes/              # Express route handlers
│   │   ├── stopwatch.js     # Stopwatch API routes
│   │   └── timer.js         # Timer API routes
│   └── shared/              # Shared utilities
│       └── ah-time.js       # AH time conversion utilities
├── .gitignore              # Git ignore configuration
├── .replit                 # Replit configuration
├── README.md               # Project documentation
├── generated-icon.png      # Application icon
├── index.js               # Node.js entry point
├── package-lock.json       # Node.js dependency lock
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
    If an `.env.example` file exists, copy it to `.env`:
    ```bash
    cp .env.example .env
    ```
    Otherwise, create a new `.env` file.
    Then, open `.env` in a text editor and set the following variables:
    * `SESSION_SECRET`: A long, random string for session encryption (e.g., generated using a password manager or online tool).
    * `ADMIN_KEY`: A password to access the admin panel at `/admin`.

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command typically runs `node server.js`.

2.  Open your web browser and navigate to `http://localhost:3000` (or the port specified in `server.js`).

## Usage

### Main Clock

* Accessible at the root path (`/`).
* Displays the primary "Another Hour" analog clock for the selected timezone, operating on the unified AH scale.
* Use the dropdown menu to change the timezone.
* Click "Toggle Digital Display" to show/hide numerical AH time and standard time.
* The page theme will invert to dark mode if the selected timezone is in its "Another Hour" (23:00-00:00 local real time).
* Click the "World Clock" button to navigate to the World Clock page.

### World Clock

* Accessible via the "World Clock" button from the Main Clock page, or directly at `/pages/world-clock.html`.
* Displays a grid of 24 clocks, each representing a distinct UTC offset, all operating on the unified AH scale. The layout aims to show all 24 clocks simultaneously on larger screens, adjusting to fewer columns on smaller screens while ensuring all clocks remain accessible via scrolling if necessary.
* The user's own timezone is highlighted for quick reference.
* Representative cities are dynamically chosen for each offset.
* Each clock item shows the city, digital AH time, digital standard time, and an analog AH clock.
* Clock items for timezones currently in their "Another Hour" will invert to a dark theme and have a visual effect.

### Stopwatch and Timer

* Accessible at `/pages/stopwatch.html` and `/pages/timer.html` respectively.
* These tools operate using the unified "Another Hour" time scale, where 1 AH second is approximately 0.95833 real seconds (or 23/24 real seconds).

### Admin Panel

* Accessible at `/admin`.
* Login using the `ADMIN_KEY` defined in the `.env` file.
* Allows management of timezones selectable for the main clock and other application settings.

## Technical Details

### Another Hour (AH) Time Calculation

All time-related features in this project (Main Clock, World Clock, Stopwatch, and Timer) operate on a **unified "Another Hour" (AH) time scale**.

* **Core Concept**: The standard 24-hour real day is conceptually transformed into a 23-hour "Another Hour" (AH) day.
* **Mechanism**:
    * AH time runs approximately 4.17% faster than real time. This is achieved by defining 1 AH second as exactly **`23/24`** of a real second (which is approximately 0.95833 real seconds).
    * Equivalently, 1 real second corresponds to **`24/23`** AH seconds.
    * The `public/clock-core.js` file (for Main Clock and World Clock angular calculations) uses `SCALE_AH = 24/23`. This `SCALE_AH` represents the factor by which real time is multiplied to get AH time (e.g., `ah_ms = real_ms * SCALE_AH`).
    * The `src/shared/ah-time.js` file (for Stopwatch and Timer millisecond conversions) defines `AH_SECOND_IN_REAL_SECONDS = 23/24` (or an equivalent constant representing this ratio).
        * `toAhMillis(realMs)` calculates `realMs / AH_SECOND_IN_REAL_SECONDS` (which is mathematically equivalent to `realMs * (24/23)`).
        * `fromAhMillis(ahMs)` calculates `ahMs * AH_SECOND_IN_REAL_SECONDS`.
    * Thus, both systems achieve the same time scaling consistent with the 23-hour AH day concept.
* **"Another Hour" Period**:
    * For the Main Clock and World Clock, the real-time period from 23:00:00 to 23:59:59.999 in the *selected local timezone* is designated as the special "Another Hour."
    * During this period, while the underlying AH time continues to scale based on the `24/23` factor, the digital display for AH hours is often presented as `24:xx` (e.g., real time 23:30 might be displayed as AH 24:30). The analog clock hands also have specific behavior to represent this hour appropriately on a 12-hour dial.
    * The Stopwatch and Timer, however, simply use the continuous scaled AH time derived from the `24/23` factor (or equivalently, the `23/24` definition of an AH second) without any special periodization for the "Another Hour." They measure durations in these consistent AH units.

### Frontend

* Built with HTML5, CSS3, and Vanilla JavaScript (ES6 Modules).
* **Moment.js** and **Moment Timezone** are used for robust date, time, and timezone manipulations.
* SVG (Scalable Vector Graphics) is used for rendering all analog clock faces and hands.
* Client-side logic handles time calculations, clock updates, and dynamic DOM manipulations.

### Backend

* Node.js with the Express.js framework.
* Serves static frontend files.
* Provides API endpoints for settings and potentially for time tools if server-side logic were needed.
* Uses `express-session` for session management (primarily for admin panel access).

### Theme

* The application defaults to a light visual theme.
* The Main Clock page dynamically switches to a dark theme when the displayed time for the selected timezone enters its "Another Hour" (23:00 local real time).
* On the World Clock page, individual clock items switch to a dark theme and apply a visual effect when their respective timezone is in its "Another Hour."

## Contributing

*(This section can be expanded if you wish to accept external contributions. For now, it's a standard placeholder.)*
We welcome contributions! Please see `CONTRIBUTING.md` (if you create one) for details on how to submit pull requests, report issues, and suggest features.

## Roadmap

The following outlines completed tasks and potential future improvements:

**Completed Features:**
* [x] Display 24 clocks for distinct UTC offsets on World Clock page.
* [x] Dynamically select representative cities considering DST for World Clock.
* [x] Implement fully functional analog hands for each world clock.
* [x] Implement individual dark mode + blinking for AH-active world clocks.
* [x] Ensure World Clock page defaults to light theme.
* [x] Unified all AH time calculations across Main Clock, World Clock, Stopwatch, and Timer to use the `24/23` scaling factor (1 AH sec = `23/24` real sec $\approx$ 0.95833 real sec).
* [x] World Clock: Default layout changed to a fixed grid (e.g., 6 columns, responsive to fewer columns on smaller screens) to display all 24 clocks.
* [x] World Clock: User's local timezone city name is highlighted (e.g., in red and bold).

**Enhancements & Future Ideas:**
* [ ] **World Clock:** Display a global message when any of the 24 world clocks are in their "Another Hour."
* [ ] **World Clock:** Refine the visual style of AH-active clock items (e.g., color scheme, AH sector display).
* [ ] **World Clock:** Allow user customization of displayed timezones or grid layout.
* [ ] **World Clock:** (Low Priority) Option to toggle between fixed grid and the original `auto-fit` responsive layout.
* [ ] **World Clock:** Fine-tune responsive behavior for tablets (like iPad) to better ensure desired column count (e.g., 6x4 or 4x6) while maintaining readability.
* [ ] **Stopwatch & Timer:** UI/UX enhancements and (optional) persistence of lap times/timer settings.
* [ ] **General:** Internationalization (i18n) for UI text (e.g., English/Japanese).
* [ ] **General:** Performance optimization, especially for rendering many clocks.
* [ ] **General:** Consider replacing Moment.js with a lighter library like Day.js (with necessary plugins) to reduce bundle size.
* [ ] **General:** Progressive Web App (PWA) features for offline caching and "installability."
* **Stretch Goals:**
    * [ ] watchOS companion app.
    * [ ] Customizable themes/skins for the entire application.

## License

*(Choose a license if you haven't already. MIT is a common choice.)*
Example: This project is licensed under the MIT License. See the `LICENSE` file for details.

---
*(Placeholder: © 2025 Yoshimune Kaneko/Another Hour. All Rights Reserved. If not using an open-source license)*