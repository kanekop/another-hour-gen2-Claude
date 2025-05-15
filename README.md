# Another Hour Clock

Another Hour Clock is a unique web-based application that redefines your perception of time. It initially operates on a unified "Another Hour" (AH) time scale where time runs approximately 4.17% faster than real time (1 AH second = 23/24 real seconds). This fits a standard 24-hour day into a conceptual 23-AH-hour day, featuring a special "Another Hour" period. The project has now been enhanced with a **Personalized AH Clock (APH Clock)**, allowing users to define their own custom "Another Personalized Hour" (APH) duration and explore varied time scales.

The application includes the original Main Clock, an advanced World Clock, Stopwatch, Timer (all AH-aware based on the 23/24 scale), an AH Time Converter, and the new Personalized AH Clock.

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
    * [Landing Page](#landing-page)
    * [Main Clock (Standard AH)](#main-clock-standard-ah)
    * **[Personalized AH Clock (APH Clock)](#personalized-ah-clock-aph-clock)**
    * [World Clock (Standard AH)](#world-clock-standard-ah)
    * [Stopwatch and Timer (Standard AH Scale)](#stopwatch-and-timer-standard-ah-scale)
    * [AH Time Converter (Standard AH Scale)](#ah-time-converter-standard-ah-scale)
6.  [Technical Details](#technical-details)
    * [Time Calculation Concepts](#time-calculation-concepts)
        * [Standard Another Hour (AH) Time Calculation](#standard-another-hour-ah-time-calculation)
        * **[Personalized AH (APH) Time Calculation](#personalized-ah-aph-time-calculation)**
    * [Frontend](#frontend)
    * [Backend](#backend)
    * [Theme](#theme)
7.  [Contributing](#contributing)
8.  [Roadmap](#roadmap)
9.  [License](#license)

## Features

* **Main Analog & Digital Clock (Standard AH) (`/pages/main-clock.html`):**
    * Displays time based on the original "Another Hour" concept (a 23-hour AH day cycle within a 24-hour real-time day, where 1 AH sec $\approx$ 0.95833 real sec or $23/24$ real seconds).
    * SVG-based 12-hour analog dial with a highlighted "AH Sector" indicating the Another Hour period (real-time 23:00-00:00 for the selected timezone).
    * Digital display showing both AH time (e.g., AH 24:xx during the Another Hour) and standard local time. Visibility can be toggled.
    * Timezone selection dropdown.
    * Visual theme inverts to dark mode during the selected timezone's AH period.

* **Personalized AH Clock (APH Clock) (`/pages/personalized-ah-clock.html`):**
    * **Concept:** Empowers users to create their own custom time experience by defining the length of their "normal" day, thereby personalizing the duration of the "Another Personalized Hour(s)" (APH). This feature allows for profound exploration of time perception.
    * **Customizable "Normal APH Day Duration":**
        * Users can set the duration of the standard part of their day using an intuitive slider.
        * The range is from **0 minutes** (meaning the entire 24 real hours become APH, starting immediately at APH 24:00) up to **24 hours (1440 minutes)** (meaning no APH period, the clock runs at a 1:1 scale with real time, effectively becoming a standard clock displaying "APH" time equivalent to real time).
        * The selected duration is clearly displayed (e.g., "8 hours 32 minutes").
    * **Time Scaling during Normal Period:**
        * During the user-defined "Normal APH Day Duration," time is scaled. The `scaleFactor` is calculated as `24 / normalAphDayDurationHours`.
        * For example, if "Normal APH Day Duration" is set to 20 hours, the `scaleFactor` is `24/20 = 1.2`, meaning time runs 20% faster during these 20 real hours.
    * **"Another Personalized Hour(s)" (APH Period):**
        * This period begins immediately after the "Normal APH Day Duration" (as set by the user) concludes within the 24-hour real-time cycle.
        * **Time Speed:** Crucially, during the APH period, the clock hands and time progression revert to **normal real-time speed** (1 APH second = 1 real second). This honors the concept that the "extra" APH time gained is experienced at a familiar pace.
        * **Digital Time Display:**
            * The APH digital time starts at **APH 24:00:00** when the APH period begins.
            * The hour display **accumulates** beyond 24. For instance, if a user reserves 4 real hours for APH, the digital display will progress from APH 24:00:00 up to APH 27:59:59 (approximately).
        * **Analog Time Display:**
            * The analog clock continues to operate on a 12-hour dial.
            * During the APH period, the hands move at normal speed. The hour hand correctly represents the accumulated APH hours modulo 12 (e.g., APH 25:00 is shown as 1 o'clock).
    * **Visual APH Sector (Yellow Pie):**
        * A yellow sector on the analog dial visually represents the **duration and span of the APH period**.
        * It starts at the **12 o'clock position** on the dial (representing the conceptual start of APH 24:00).
        * The sweep angle of the sector corresponds to the length of the APH period (e.g., a 3-hour APH period covers 90 degrees from 12 to 3).
        * If the APH period exceeds 12 real hours (sweep angle > 360 degrees), the sector fills the entire clock face, and an **additional red indicator line** is displayed, pointing from the center to the APH period's "final end time" on the 12-hour dial. This provides a clear visual cue for APH durations longer than one analog clock cycle.
        * This yellow sector is **only visible during the APH period**.
    * **Theme:** The page inverts to a dark theme during the APH period for the selected timezone.
    * **Timezone Selection:** Users can select a timezone, and all APH calculations and period transitions are based on the local real time of that zone.

* **World Clock Page (Standard AH) (`/pages/world-clock.html`):**
    * Displays a grid of 24 clocks for different timezones, all operating on the **standard 23/24 AH time scale**.
    * (Other World Clock features remain as previously described)

* **Time Tools (Standard AH Scale):**
    * **Stopwatch (`/pages/stopwatch.html`):** Measures elapsed time in standard AH units ($1$ AH sec $\approx 0.95833$ real sec).
    * **Timer (`/pages/timer.html`):** Allows setting a countdown duration in standard AH units.

* **AH Time Converter (Standard AH Scale) (`/pages/converter.html`):**
    * Converts between real-time and **standard AH time** ($24/23$ scale).

* **Visual Theme:**
    * The application defaults to a light theme.
    * The Main Clock page and the Personalized AH Clock page dynamically switch to a dark theme when their respective clocks enter their "Another Hour" or "Another Personalized Hour" period.
    * Individual clock items on the World Clock page use a dark theme effect for their AH period.

## Project Structure

(No changes requested to this section, assuming it's up-to-date with `personalized-ah-clock.html` etc.)


```
project/
├── public/                   # Frontend assets and client-side code
│   ├── css/                  # Stylesheets directory
│   │   ├── components.css    # Common UI component styles
│   │   ├── main-clock.css    # Main clock page styles
│   │   ├── personalized-ah-clock.css # Personalized AH clock styles
│   │   ├── stopwatch.css     # Stopwatch page styles
│   │   ├── timer.css         # Timer page styles
│   │   └── world-clock.css   # World clock page styles
│   ├── js/                   # Client-side JavaScript modules
│   │   ├── city-timezones.js   # Timezone data and utilities
│   │   ├── personalized-ah-clock-ui.js # Personalized AH clock functionality
│   │   ├── stopwatch-ui.js   # Stopwatch functionality
│   │   ├── timer-ui.js       # Timer functionality
│   │   ├── timezone-manager.js # Timezone management utilities
│   │   └── world-clock-ui.js # World clock functionality
│   ├── pages/                # HTML pages for specific features
│   │   ├── converter.html    # AH Time Converter interface
│   │   ├── main-clock.html   # Main clock interface
│   │   ├── personalized-ah-clock.html # Personalized AH clock interface
│   │   ├── stopwatch.html    # Stopwatch interface
│   │   ├── timer.html        # Timer interface
│   │   └── world-clock.html  # World clock interface
│   ├── clock-core.js         # Core clock calculation logic for main/world clocks
│   ├── index.html            # Landing page linking to all features
│   ├── main.js               # Main application logic (for main-clock.html)
│   └── style.css             # Global styles
├── src/                      # Server-side source code
│   ├── routes/               # Express route handlers
│   │   ├── stopwatch.js      # Stopwatch API routes
│   │   └── timer.js          # Timer API routes
│   └── shared/               # Shared utilities
│       └── ah-time.js        # AH time conversion utilities
├── .gitignore                # Git ignore configuration
├── .replit                   # Replit configuration
├── README.md                 # Project documentation
├── generated-icon.png        # Application icon
├── index.js                  # Node.js entry point (if applicable, otherwise server.js is the entry)
├── package-lock.json         # Node.js dependency lock
├── package.json              # Node.js project configuration
├── server.js                 # Express server
└── settings.json             # Application settings

```

## Getting Started

### Prerequisites

* Node.js (version 18 or higher recommended)
* npm (usually comes with Node.js)
* A modern web browser with SVG support (Chrome, Firefox, Safari, Edge)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/kanekop/another-hour.git](https://github.com/kanekop/another-hour.git) 
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

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command typically runs `node server.js`.

2.  Open your web browser and navigate to `http://localhost:3000` (or the port specified in `server.js`).

## Usage

### Landing Page
* The application starts with a landing page (`index.html`) accessible at the root path (`/`).
* This page provides an overview and links to all major features: Main Clock (Standard AH), **Personalized AH Clock**, World Clock (Standard AH), Stopwatch, Timer, and Converter.

### Main Clock

* Accessible via the "Main Clock" link on the landing page, or directly at `/pages/main-clock.html`.
* Displays the primary "Another Hour" analog clock for the selected timezone, operating on the unified AH scale.
* Use the dropdown menu to change the timezone.
* The digital display section shows AH time and standard time. The visibility of AH and Actual time can be toggled using the switch.
* The page theme will invert to dark mode if the selected timezone is in its "Another Hour" (23:00-00:00 local real time).
* Click the "World Clock" button to navigate to the World Clock page.

### World Clock

* Accessible via the "World Clock" button from the Main Clock page, or directly at `/pages/world-clock.html`.
* Displays a grid of 24 clocks, each representing a distinct UTC offset, all operating on the unified AH scale. The layout aims to show all 24 clocks simultaneously on larger screens, adjusting to fewer columns on smaller screens while ensuring all clocks remain accessible via scrolling if necessary.
* The user's own timezone is highlighted for quick reference.
* Representative cities are dynamically chosen for each offset using a predefined list in `city-timezones.js`.
* Each clock item shows the city, digital AH time, digital standard time, and an analog AH clock.
* Clock items for timezones currently in their "Another Hour" will invert to a dark theme and have a visual effect.

### Stopwatch and Timer

* Accessible at `/pages/stopwatch.html` and `/pages/timer.html` respectively.
* These tools operate using the unified "Another Hour" time scale, where 1 AH second is approximately 0.95833 real seconds (or 23/24 real seconds).

### AH Time Converter

* Accessible at `/pages/converter.html`.
* Provides two sets of input fields:
    * **Real Time to AH Time:** Enter hours, minutes, and seconds in real time to see the equivalent AH time.
    * **AH Time to Real Time:** Enter hours, minutes, and seconds in AH time to see the equivalent real time.
* This tool is useful for planning or understanding specific time conversions within the Another Hour system.

### Personalized AH Clock (APH Clock)
* Accessible via the "Personalized AH Clock" link on the landing page, or directly at `/pages/personalized-ah-clock.html`.
* **Objective:** This clock allows users to dynamically alter their experience of a day by customizing how much "normal time" they perceive before entering their "Another Personalized Hour(s)" (APH).
* **Setting Normal APH Day Duration:**
    * Use the slider at the bottom of the page to define the length of the "normal" part of your day, from 0 minutes up to 24 hours (1440 minutes).
    * **0 minutes:** The entire 24 real hours are treated as APH. The clock immediately starts at APH 24:00 and runs at normal speed for 24 real hours, effectively becoming a standard 24-hour clock that counts from 24 upwards.
    * **24 hours (1440 minutes):** No APH period is reserved. The APH clock runs at normal speed for the entire 24 real hours, with time scaled 1:1 (APH time equals real time). The concept of "Another Hour" vanishes.
    * **Intermediate values:** For any duration between 0 and 24 hours, the "Normal APH Day Duration" will have its time scaled (sped up by `24 / normal_hours_set`). Once this scaled normal period concludes in real time, the APH period begins.
* **During the APH Period:**
    * **Time Speed:** Time progresses at a normal, unscaled rate (1 APH second = 1 real second).
    * **Digital Display:** Shows "APH Time" starting from 24:00:00 and accumulating hours (e.g., 25:XX, 26:XX).
    * **Analog Display:** The hands move at normal speed. The yellow APH sector (pie) appears, starting from the 12 o'clock mark, indicating the total duration of the APH period. If this period exceeds 12 hours, a red indicator line will show the "final" end point on the 12-hour dial.
    * **Theme:** The page switches to a dark theme.
* **Timezone:** Select your desired timezone to base all calculations on its local real time.


## Technical Details

### Time Calculation Concepts

This project now incorporates two distinct "Another Hour" time concepts:

#### Standard Another Hour (AH) Time Calculation
* **Applicable to:** Main Clock, World Clock, Stopwatch, Timer, AH Time Converter.
* **Core Concept:** A standard 24-hour real day is compressed into a 23-AH-hour conceptual day.
* **Mechanism:**
    * Time runs $\approx 4.17\%$ faster: 1 AH second = $23/24$ real seconds.
    * Equivalently, 1 real second = $24/23$ AH seconds.
    * `public/clock-core.js` uses `SCALE_AH = 24/23` for the Main/World clock's scaled period.
    * `src/shared/ah-time.js` uses an equivalent `AH_FACTOR = 23/24` for tools.
* **"Another Hour" Period (Standard):**
    * For the Main Clock and World Clock, this is fixed to the real-time 23:00:00 to 23:59:59.999 of the selected timezone.
    * Digital display shows AH 24:xx. Analog hands behave specially.

#### Personalized AH (APH) Time Calculation
* **Applicable to:** Personalized AH Clock (`/pages/personalized-ah-clock.html`).
* **Core Concept:** Users define a "Normal APH Day Duration" (from 0 minutes to 24 hours). The time within this user-defined normal duration is scaled to "fit" a conceptual 24 APH hours into that normal duration if it were the *entire* day. However, the key is that the remaining real time *after* this normal duration becomes the "Another Personalized Hour(s)" (APH), and during this APH period, time runs at **normal real-time speed**.
* **Mechanism for Personalized AH Clock:**
    * **Normal Period Scaling:**
        * Let $D_{normal\_aph\_minutes}$ be the user-set duration for the normal part of the APH day (0 to 1440 minutes).
        * Let $D_{normal\_aph\_hours} = D_{normal\_aph\_minutes} / 60$.
        * During this normal period, the `scaleFactor` applied to real time is $24 / D_{normal\_aph\_hours}$ (if $D_{normal\_aph\_hours} > 0$). This means if you set a shorter normal duration, time within that normal duration runs faster. If $D_{normal\_aph\_hours} = 24$, `scaleFactor` is 1 (no scaling). If $D_{normal\_aph\_hours} = 0$, this period is skipped.
    * **APH Period (Another Personalized Hour(s)):**
        * This period starts when $D_{normal\_aph\_minutes}$ of real time has elapsed.
        * It lasts for the remainder of the 24 real-hour day: $( (24 \times 60) - D_{normal\_aph\_minutes} )$ real minutes.
        * **During the APH Period, `scaleFactor` is effectively 1.** Time progresses 1 APH second per 1 real second.
        * The APH digital time display starts at "APH 24:00:00" and accumulates hours (e.g., APH 25:xx, 26:xx, ...) based on the real-time elapsed within the APH period.
    * **`clock-core.js` (`getCustomAhAngles` function):** Implements this logic, distinguishing between the scaled normal period and the unscaled APH period.

### Frontend

* Built with HTML5, CSS3, and Vanilla JavaScript (ES6 Modules).
* **Moment.js** and **Moment Timezone** are used for robust date, time, and timezone manipulations.
* SVG (Scalable Vector Graphics) is used for rendering all analog clock faces and hands.
* Client-side logic handles time calculations, clock updates, and dynamic DOM manipulations.
* **Timezone Management**:
    * `public/js/timezone-manager.js`: Contains logic for selecting appropriate timezones for display, guessing the user's local timezone, and mapping IANA timezone names to city names.
    * `public/js/city-timezones.js`: Provides a curated list of representative cities for various UTC offsets, used by the `timezone-manager.js` to populate timezone selectors and display city names on the World Clock. This list helps ensure relevant and user-friendly city names are shown.

### Backend

* Node.js with the Express.js framework.
* Serves static frontend files.
* Provides API endpoints:
    * `/api/settings`: (GET) Retrieves current application settings from `settings.json`. (POST) Updates `settings.json`. These settings include selected timezones for the main clock and display preferences for AH/Actual time.
    * `/api/stopwatch/elapsed`: (GET) Calculates elapsed AH time for the stopwatch.
    * `/api/timer/remaining`: (GET) Calculates remaining AH time for the timer.
* Uses `express-session` for session management.
* The `settings.json` file stores user-configurable settings.

### Theme

* The application defaults to a light visual theme.
* The Main Clock page dynamically switches to a dark theme when the displayed time for the selected timezone enters its "Another Hour" (23:00 local real time).
* On the World Clock page, individual clock items switch to a dark theme and apply a visual effect when their respective timezone is in its "Another Hour."
* The Personalized AH Clock page also dynamically switches to a dark theme when its APH period begins.

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
* [x] Unified all AH time calculations across Main Clock, World Clock, Stopwatch, Timer, and Converter to use the `24/23` scaling factor (1 AH sec = `23/24` real sec $\approx$ 0.95833 real sec).
* [x] World Clock: Default layout changed to a fixed grid (e.g., 6 columns, responsive to fewer columns on smaller screens) to display all 24 clocks.
* [x] World Clock: User's local timezone city name is highlighted (e.g., in red and bold).
* [x] Added AH Time Converter tool.
* [x] Implemented Landing Page.
* [x] Server-side API for settings management.
* [x] Implemented Personalized AH Clock (APH Clock) with customizable normal day duration.
* [x] APH Clock: Time scaling during normal period, normal speed during APH period.
* [x] APH Clock: Digital display accumulates hours beyond 24 during APH period.
* [x] APH Clock: Analog APH sector visualizes APH period duration, starting from 12 o'clock.
* [x] APH Clock: Indicator line for APH periods exceeding 12 hours.
* [x] APH Clock: Dark theme during APH period.
* [x] APH Clock: Settings (slider, timezone) moved to bottom of page.
* [x] APH Clock: Slider range adjusted to 0-24 hours.
* [x] Added link to Personalized AH Clock on Landing Page.

**Enhancements & Future Ideas:**
* [ ] **Personalized AH Clock:** Refine UI/UX for slider, perhaps add direct minute input alongside.
* [ ] **Personalized AH Clock:** Explore alternative visualizations for >12h APH periods if current indicator line needs improvement.
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