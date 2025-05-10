# Another Hour Clock

Another Hour Clock is a unique web-based application that redefines your perception of time. It primarily features a conceptual clock operating on a 23-hour day, achieved by adjusting the an "Another Hour" (AH) period. This project also includes a World Clock feature displaying multiple timezones with this unique AH concept, alongside standard time tools like a stopwatch and timer.

## Table of Contents

1.  [Features](#features)
2.  [Live Demo (Optional)](#live-demo-optional)
3.  [Project Structure](#project-structure)
4.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Configuration](#configuration)
    * [Running the Application](#running-the-application)
5.  [Usage](#usage)
    * [Main Clock](#main-clock)
    * [World Clock](#world-clock)
    * [Stopwatch & Timer](#stopwatch--timer)
    * [Admin Panel](#admin-panel)
6.  [Technical Details](#technical-details)
    * [Another Hour (AH) Time Calculation](#another-hour-ah-time-calculation)
    * [Frontend](#frontend)
    * [Backend](#backend)
7.  [Contributing (Optional)](#contributing-optional)
8.  [Roadmap](#roadmap)
9.  [License](#license)

## Features

* **Main Analog & Digital Clock:**
    * Displays time based on the "Another Hour" concept (a 23-hour cycle within a 24-hour real-time day).
    * SVG-based 12-hour analog dial with visual cues for the "Another Hour" period.
    * Toggleable digital display for both AH time and standard local time.
    * Timezone selection for the main clock.
* **World Clock Page:**
    * Displays multiple timezones simultaneously.
    * Each timezone shows:
        * City name.
        * Digital AH time.
        * Digital standard local time.
        * Analog clock face with hands (currently work-in-progress for correct hand movement).
    * Visual indication (blinking) for timezones currently in their "Another Hour" period.
    * Dynamic background inversion based on the user's local "Another Hour" status.
* **Time Tools (AH-Aware):**
    * Stopwatch that can measure elapsed time in AH units.
    * Timer that can count down in AH units.
* **Admin Panel:**
    * Manage displayed timezones for the main clock.
    * Configure display settings (e.g., show/hide AH time, show/hide actual time).
    * (Potentially) Manage environment keys or other settings.
* **Visual Cues:**
    * Main clock dial and World Clock page background invert colors during the "Another Hour" period (based on selected/local timezone).

## Live Demo (Optional)

*(If you have a live deployment, link it here. e.g., `[Live Demo](your-app-url.com)`)*

## Project Structure
another-hour/
├── public/                   # Frontend assets (HTML, CSS, client-side JS)
│   ├── css/                  # Stylesheets
│   │   ├── style.css         # Global base styles
│   │   ├── components.css    # Common UI component styles
│   │   ├── main-clock.css    # Styles for the main clock page (index.html)
│   │   ├── world-clock.css   # Styles for the world clock page
│   │   ├── stopwatch.css     # Styles for the stopwatch page
│   │   ├── timer.css         # Styles for the timer page
│   │   └── admin.css         # Styles for the admin panel
│   ├── js/                   # Client-side JavaScript modules
│   │   ├── main.js           # Logic for the main clock page
│   │   ├── world-clock-ui.js # Logic for the world clock page
│   │   ├── stopwatch-ui.js   # Logic for the stopwatch page
│   │   ├── timer-ui.js       # Logic for the timer page
│   │   └── admin.js          # Logic for the admin panel
│   ├── pages/                # Additional HTML pages
│   │   ├── world-clock.html
│   │   ├── stopwatch.html
│   │   └── timer.html
│   ├── admin.html            # Admin panel interface
│   ├── clock-core.js         # Core AH time calculation & analog angle logic (client-side)
│   └── index.html            # Main clock page
├── src/                      # Server-side source code (Node.js)
│   ├── routes/               # Express route handlers
│   │   └── stopwatch.js      # API routes for stopwatch functionality
│   └── shared/               # Shared utilities/libraries (can be used by client & server if configured)
│       └── ah-time.js        # Core AH time conversion utilities (AH_FACTOR based)
├── server.js                 # Express server setup
├── settings.json             # Application settings (e.g., default timezones)
├── package.json              # Node.js project metadata and dependencies
├── package-lock.json
├── .env.example              # Example environment variables file
└── README.md                 # This file

## Getting Started

### Prerequisites

* Node.js (version 18 or higher recommended)
* npm (usually comes with Node.js)
* A modern web browser with SVG support (Chrome, Firefox, Safari, Edge)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/another-hour.git](https://github.com/your-username/another-hour.git)
    cd another-hour
    ```
    *(Replace `your-username` with the actual username or repository URL)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Create a `.env` file:**
    Copy the example environment file and edit its values:
    ```bash
    cp .env.example .env
    ```
    Then, open `.env` in a text editor and set the following variables:
    * `SESSION_SECRET`: A long, random string used for session encryption (e.g., generate one using a password manager or online tool).
    * `ADMIN_KEY`: A password to access the admin panel.

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command typically runs `node server.js`.

2.  Open your web browser and navigate to `http://localhost:3000` (or the port specified in `server.js`).

## Usage

### Main Clock (`/`)

* Displays the primary "Another Hour" analog and digital clock.
* Use the dropdown menu to select your current timezone for the main clock display.
* Click "Toggle Digital Display" to show or hide the numerical time (both AH and standard).

### World Clock (`/pages/world-clock.html`)

* Accessible via the "All Time Zone" button on the main clock page (if implemented).
* Shows a grid of clocks for various world cities.
* Each clock displays:
    * City Name
    * Digital AH Time
    * Digital Standard Time
    * (WIP) Analog AH Time
* Timezones in their "Another Hour" (23:00-00:00 local standard time) will have a blinking effect.

### Stopwatch & Timer (`/pages/stopwatch.html`, `/pages/timer.html`)

* These pages provide stopwatch and timer functionalities, respectively.
* The timekeeping is aware of the "Another Hour" concept, meaning durations are based on AH seconds (where 1 AH second = 0.96 real seconds, as defined in `src/shared/ah-time.js`).

### Admin Panel (`/admin`)

* Log in using the `ADMIN_KEY` defined in your `.env` file.
* Allows management of timezones displayed on the main clock and other application settings.

## Technical Details

### Another Hour (AH) Time Calculation

This project explores two related but distinct "Another Hour" concepts:

1.  **Main Clock (23-hour cycle / `clock-core.js`):**
    * The 24-hour real day is effectively condensed into a 23-hour AH day.
    * This is achieved by making AH time run faster than real time for the first 23 real hours. `SCALE_AH = 24 / 23` (approx 1.04167) is used, meaning 1 real second corresponds to `SCALE_AH` AH seconds.
    * The real-time period from 23:00 to 00:00 is treated as the "Another Hour" (or the 24th hour in the AH display, effectively making the AH clock appear to have an extra hour within the 23-hour cycle framework).
    * Analog display during this AH period (real 23:00-00:00) maps to 00:00-01:00 on the 12-hour dial for visual effect.

2.  **Stopwatch/Timer (25-hour day equivalent / `src/shared/ah-time.js`):**
    * Used for the Stopwatch and Timer utilities.
    * Defines an "AH second" as being slightly shorter than a real second: `AH_FACTOR = 0.96`.
    * This means 1 AH second = 0.96 real seconds. Over a 24-hour real-time period, this would equate to `24 / 0.96 = 25` AH hours.
    * `toAhMillis(realMs) = realMs / AH_FACTOR`
    * `fromAhMillis(ahMs) = ahMs * AH_FACTOR`

*(Developer Note: The World Clock currently uses the `clock-core.js` (23-hour cycle) logic for its AH time calculation to maintain consistency with the main clock's concept.)*

### Frontend

* Built with HTML, CSS, and vanilla JavaScript (ES6 Modules).
* Moment.js and Moment Timezone are used for time and timezone manipulations.
* SVG is used for rendering analog clocks.
* Client-side routing is handled by direct navigation and links.

### Backend

* Node.js with Express.js framework.
* Serves static frontend files.
* Provides API endpoints (e.g., for settings, stopwatch).
* Uses environment variables for configuration (session secret, admin key).

## Contributing (Optional)

*(If you plan to open source this and accept contributions, add guidelines here. For now, this can be omitted or be a placeholder.)*
*We welcome contributions! Please see `CONTRIBUTING.md` for details on how to submit pull requests, report issues, and suggest features.*

## Roadmap

The following are planned or potential future improvements:

* **World Clock:**
    * [ ] **Fix analog hand movement for all world clocks.**
    * [ ] Allow user selection/customization of displayed timezones.
* **Stopwatch & Timer:**
    * [ ] UI/UX enhancements.
    * [ ] (Optional) Persistence of lap times or timer settings.
* **General:**
    * [ ] Internationalization (i18n) for UI text (e.g., English/Japanese).
    * [ ] Consider replacing Moment.js with a lighter library like Day.js (with necessary plugins) to reduce bundle size.
    * [ ] Progressive Web App (PWA) features for offline caching and "installability".
    * [ ] Refine and unify the two "Another Hour" concepts if possible, or clarify their distinct applications more prominently.
* **Stretch Goals:**
    * [ ] watchOS companion app.
    * [ ] Customizable themes/skins.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (if you add one).

*(Placeholder: © 2025 Your Name/Project Name. All Rights Reserved. or choose an open-source license like MIT.)*
