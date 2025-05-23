# Another Hour Clock

Another Hour Clock is a unique web-based application that redefines your perception of time. This application allows you to personalize your day by defining the length of your **"Scaled 24"** period—the duration you wish your conceptual 'day' to last in real time. The remaining time within a standard 24-hour real day becomes the **"Another Hour" (AH)** period.

* During your "Scaled 24" period, time runs at a customized pace, potentially faster or slower than real time, to align your conceptual 24 hours with the real-time duration you've set.  
* During the "Another Hour" (AH) period, time progresses at normal real-time speed.

This application centers around the **Customizable Main Clock** (previously referred to as Personalized AH Clock), which embodies this concept. It also includes a **Stopwatch** and **Timer** that operate based on the time scaling defined by your Main Clock's "Scaled 24" setting, and a **Graph Demo** to help visualize your personalized time allocation.

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
    * [**Customizable Main Clock**](#customizable-main-clock)  
    * [Stopwatch and Timer (Standard AH Scale)](#stopwatch-and-timer-standard-ah-scale)
   * [**Graph Demo**](#graph-demo)  
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

* **Customizable Main Clock (`/pages/personalized-ah-clock.html`):**  

  * **Concept:** This is the core of the application. It empowers users to create their own custom time experience by defining the real-time length of their "Scaled 24" period (e.g., you can make your conceptual 24-hour day fit into 16 real hours, or any duration from 0 to 24 real hours). The remaining real time in a standard 24-hour day becomes your "Another Hour (AH)" period.  
  * **Customizable "Scaled 24" Duration:**  
    * Users can set the desired real-time duration for their "Scaled 24" period using an intuitive slider (0 to 1440 real minutes / 0 to 24 real hours).  
    * The selected duration is clearly displayed (e.g., "Scaled 24 set to: 8 hours 32 minutes real time," "Resulting AH Period: 15 hours 28 minutes real time").  
  * **Integrated Comparison Graph:**  
    * The settings view includes a dual vertical bar graph, similar to the Graph Demo, typically displayed above or near the slider.  
    * This graph visually compares the user's personalized time distribution (e.g., one color for the "Scaled 24" period, another for the "AH" period) against a standard 24-hour real-time representation.  
    * The graph updates dynamically as the user adjusts the "Scaled 24" duration slider.  
  * **Time Scaling during "Scaled 24" Period:**  
    * During the user-defined "Scaled 24" real-time duration, time is scaled. The `scaleFactor` is calculated as $24 / D\_{normal\_aph\_hours}$, where $D\_{normal\_aph\_hours}$ is the length of the "Scaled 24" period in real hours.  
    * For example, if "Scaled 24" is set to last for 12 real hours, time within this period will run twice as fast ($24 / 12 \= 2$). If set to 24 real hours, time runs at normal speed (`scaleFactor = 1`). If set to 0 real hours, the day immediately starts in the "Another Hour" period.  
  * **"Another Hour (AH)" Period:**  
    * This period begins immediately after the real-time duration set for "Scaled 24" concludes.  
    * **Time Speed:** During the AH period, time progression is at **normal real-time speed** (1 AH second \= 1 real second).  
    * **Digital Time Display (Clock View):** When in the AH period, the digital display shows "Actual" real time and "AH Remaining" time for the current AH period.  
    * **Analog Time Display (Clock View):** The analog clock continues on a 12-hour dial. During the AH period, hands move at normal speed. A visual indicator (e.g., a colored sector) can represent the AH duration.  
  * **Visual AH Sector (e.g., Yellow Pie \- Clock View):**  
    * A colored sector on the analog dial can visually represent the duration and span of the AH period, typically starting from the 12 o'clock position.  
    * If the AH period exceeds 12 real hours, an additional indicator line can show the AH period's "final end time" on the 12-hour dial.  
    * This sector is usually only visible during the AH period.  
  * **Theme:** The page inverts to a dark theme during the AH period for the selected timezone.  
  * **Timezone Selection:** Users can select a timezone, and all calculations are based on the local real time of that zone.


* **Stopwatch (`/pages/stopwatch.html`):**  

  * Measures elapsed time. The speed of the stopwatch is determined by the `scaleFactor` currently active in the **Customizable Main Clock** based on its "Scaled 24" setting.  
  * If the Main Clock is in its "Scaled 24" period, the stopwatch runs at that scaled speed.  
  * If the Main Clock is in its "Another Hour" period, the stopwatch runs at normal real-time speed.


* **Timer (`/pages/timer.html`):**  

  * Allows setting a countdown duration. The countdown speed is determined by the `scaleFactor` currently active in the **Customizable Main Clock**.  
  * Duration is set in units perceived according to the current scale of the Main Clock. For example, setting a 10-minute timer while the Main Clock's "Scaled 24" period is running at 2x speed will result in the timer actually elapsing in 5 real minutes.


* **Graph Demo (`/pages/aph-graph-demo.html`):**  

  * **Purpose:** A standalone visual tool to demonstrate and compare the "Scaled 24" and "Another Hour (AH)" time allocation against standard real-time. This visualization is also integrated into the Main Clock's settings view.  
  * **Dual Bar Graphs:**  
    * **Real-Time Graph (Left):** Fixed 24-hour representation of actual time.  
    * **Another Hour Graph (Right):** Dynamically illustrates personalized time distribution (e.g., Normal Period in one color, AH Period in another) based on the slider.  
  * **Interactive Slider Control:** Allows adjustment of the "Scaled 24" real-time duration, instantly updating textual readouts and graph visuals.


* **Visual Theme:**  

  * Defaults to a light theme.  
  * The Customizable Main Clock dynamically switches to a dark theme during its "Another Hour (AH)" period.


## Project Structure

```
project/  
├── public/                   \# Frontend assets and client-side code  
│   ├── css/                  \# Stylesheets directory  
│   │   ├── aph-graph-demo.css \# Graph Demo styles  
│   │   ├── clock-themes.css  \# Clock theme styles  
│   │   ├── components.css    \# Common UI component styles  
│   │   ├── main-clock.css    \# Main clock styles  
│   │   ├── personalized-ah-clock.css \# Customizable Main Clock styles  
│   │   ├── stopwatch.css     \# Stopwatch page styles  
│   │   ├── timer.css        \# Timer page styles  
│   │   └── world-clock.css  \# World clock styles  
│   ├── js/                   \# Client-side JavaScript modules  
│   │   ├── ah-time.js       \# Time conversion utilities  
│   │   ├── aph-graph-demo.js \# Graph Demo functionality  
│   │   ├── city-timezones.js \# Timezone data and utilities  
│   │   ├── clock-theme-manager.js \# Theme management  
│   │   ├── personalized-ah-clock-ui.js \# Customizable Main Clock functionality  
│   │   ├── scaling-utils.js  \# Time scaling utilities  
│   │   ├── stopwatch-ui.js   \# Stopwatch functionality  
│   │   ├── timer-ui.js       \# Timer functionality  
│   │   ├── timezone-manager.js \# Timezone management utilities  
│   │   └── world-clock-ui.js \# World clock functionality  
│   ├── pages/                \# HTML pages for specific features  
│   │   ├── aph-graph-demo.html \# Graph Demo interface  
│   │   ├── converter.html    \# Time converter interface  
│   │   ├── main-clock.html   \# Main clock interface  
│   │   ├── personalized-ah-clock.html \# Customizable Main Clock interface  
│   │   ├── stopwatch.html    \# Stopwatch interface  
│   │   ├── timer.html        \# Timer interface  
│   │   └── world-clock.html  \# World clock interface  
│   ├── clock-core.js         \# Core clock calculation logic  
│   ├── index.html            \# Landing page linking to all features  
│   ├── main.js               \# Entry point for Customizable Main Clock  
│   └── style.css             \# Global styles  
├── src/                      \# Server-side source code  
│   ├── routes/               \# Express route handlers  
│   │   ├── stopwatch.js      \# Stopwatch API routes  
│   │   └── timer.js          \# Timer API routes  
│   └── shared/               \# Shared utilities  
│       └── ah-time.js        \# Time conversion utilities  
├── .gitignore                \# Git ignore configuration  
├── .replit                   \# Replit configuration  
├── README.md                 \# Project documentation  
├── generated-icon.png        \# Application icon  
├── index.js                  \# Node.js entry point  
├── package-lock.json         \# Node.js dependency lock  
├── package.json              \# Node.js project configuration  
├── server.js                 \# Express server  
└── settings.json             \# Application settings
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
## **Usage**

### **Landing Page**

* The application starts with a landing page (index.html) accessible at the root path (/).  
* This page provides an overview and links to all major features: **Customizable Main Clock**, **Stopwatch**, **Timer**, and **Graph Demo**.

### **Customizable Main Clock**

* Accessible via the "Main Clock" link on the landing page (this now points to /pages/personalized-ah-clock.html).  
* This is the primary interface for experiencing and configuring your personalized time.  
* **Views:**  
  * **Clock View:** Shows the analog and digital clock based on your "Scaled 24" and "Another Hour (AH)" settings.  
  * **Settings View:** Allows customization of the "Scaled 24" duration and timezone.  
* **Settings View Features:**  
  * **Comparison Graph:** Displays a dual bar graph (Real Time vs. Another Hour distribution) directly linked to the slider.  
  * **"Scaled 24" Duration Slider:** Adjust the slider (0 to 1440 real minutes) to define the real-time length for your conceptual 24-hour day. Text readouts for "Scaled 24 set to" and the resulting "AH Period" update with the slider.  
  * **Timezone Selection:** Choose a timezone for all calculations.  
* **Clock View Features:**  
  * Displays time based on the user's settings.  
  * During the "Scaled 24" period, time progresses at the scaled rate.  
  * During the "Another Hour (AH)" period:  
    * Time progresses at normal real-time speed.  
    * The digital display shows "Actual" real time and "AH Remaining" time.  
    * The analog clock shows a visual indicator for the AH period.  
    * The theme inverts to dark.

### **Stopwatch and Timer**

* Accessible at /pages/stopwatch.html and /pages/timer.html respectively.  
* These tools operate based on the current time scaling settings of the **Customizable Main Clock**.  
  * If the Main Clock is in its "Scaled 24" period, the tools run at that scaled speed.  
  * If the Main Clock is in its "Another Hour" period, the tools run at normal real-time speed.

### **Graph Demo**

* **Access:** Navigate to /pages/aph-graph-demo.html.  
* **Objective:** This demo page provides a side-by-side visual comparison of a standard 24-hour real-time day and a dynamically adjustable day based on the "Scaled 24" and "Another Hour (AH)" concepts. It helps in understanding how the user-defined "Scaled 24" duration impacts the allocation of time.  
* **How to Use:**  
  1. Use the slider to set the desired real-time length for the "Scaled 24" period.  
  2. Observe the changes in text readouts and the dynamic adjustment of the "Another Hour Graph" (showing "Scaled 24" period and "AH Period" blocks).  
* **Key Observations:**  
  * Setting "Scaled 24" duration to 0 will make the entire "Another Hour Graph" represent the AH Period.  
  * Y-axis helper labels and a horizontal line mark significant points and transitions.

## **Technical Details**

### **Time Calculation Concepts**

#### **Customizable "Scaled 24" and "Another Hour" (AH) Time Calculation**

* **Applicable to:** Customizable Main Clock, Stopwatch, Timer.  
* **Core Concept:** Users define a "Scaled 24" period, which is the desired real-time duration for their conceptual 24-hour day (e.g., making their 'day' feel like it's only 16 real hours long). The time remaining in a standard 24-hour real day becomes the "Another Hour (AH)" period.  
* **Mechanism:**  
  * **"Scaled 24" Period Scaling:**  
    * Let D\_scaled24\_minutes be the user-set real-time duration for the "Scaled 24" period (0 to 1440 minutes).  
    * Let D\_scaled24\_hours=D\_scaled24\_minutes/60.  
    * During this "Scaled 24" period, if D\_scaled24\_hours0, the scaleFactor applied to real time is 24/D\_scaled24\_hours. This means if a shorter "Scaled 24" duration is set, time within that period runs faster.  
    * If D\_scaled24\_hours=24, scaleFactor is 1 (no scaling, time runs normally).  
    * If D\_scaled24\_hours=0, this period is effectively skipped, and the day starts immediately in the "Another Hour (AH)" period.  
  * **"Another Hour (AH)" Period:**  
    * This period begins once the real-time duration D\_scaled24\_minutes has elapsed.  
    * It lasts for the remainder of the 24 real-hour day: ((24times60)−D\_scaled24\_minutes) real minutes.  
    * **During the AH Period, the scaleFactor is effectively 1\.** Time progresses at 1 "scaled" second per 1 real second.  
    * For display on the Customizable Main Clock, "AH Remaining" time is shown. Internally, an AH hour count might accumulate from 24:00:00 based on real-time elapsed in this period.  
  * **clock-core.js (getCustomAhAngles function or similar):** Implements this logic, distinguishing between the scaled "Scaled 24" period and the unscaled "Another Hour (AH)" period.  
  * **src/shared/ah-time.js:** This utility (if used by Stopwatch/Timer backend routes) would need to be aware of the current scaleFactor from the Customizable Main Clock's settings to perform its conversions correctly. The simple AH\_FACTOR \= 23/24 is no longer applicable. *(This implies ah-time.js might need access to the current user's "Scaled 24" setting, or the scaling logic needs to be handled more dynamically by the client or server routes using it).*

### **Frontend**

* Built with HTML5, CSS3, and Vanilla JavaScript (ES6 Modules).  
* **Moment.js** and **Moment Timezone** are used for robust date, time, and timezone manipulations.  
* SVG (Scalable Vector Graphics) is used for rendering analog clock faces.  
* Client-side logic handles time calculations, clock updates, and dynamic DOM manipulations for the **Customizable Main Clock**, **Stopwatch**, **Timer**, and **Graph Demo**.  
* **Timezone Management**:  
  * public/js/timezone-manager.js and public/js/city-timezones.js support timezone selection for the Customizable Main Clock.

### **Backend**

* Node.js with the Express.js framework.  
* Serves static frontend files.  
* Provides API endpoints:  
  * /api/settings: (GET/POST) Manages application settings, potentially including the last used "Scaled 24" duration for the Customizable Main Clock.  
  * /api/stopwatch/elapsed: (GET) Calculates elapsed time for the stopwatch, considering the Main Clock's current scaling.  
  * /api/timer/remaining: (GET) Calculates remaining time for the timer, considering the Main Clock's current scaling.  
* Uses express-session for session management (if user-specific settings are stored server-side).  
* The settings.json file might store default settings or last-used global configurations.

### **Theme**

* The application defaults to a light visual theme.  
* The **Customizable Main Clock** page dynamically switches to a dark theme when its "Another Hour (AH)" period begins.

## Contributing

*(This section can be expanded if you wish to accept external contributions. For now, it's a standard placeholder.)*
We welcome contributions! Please see `CONTRIBUTING.md` (if you create one) for details on how to submit pull requests, report issues, and suggest features.

## Roadmap

The following outlines completed tasks and potential future improvements:

**Focus for Current Version (Customizable Time):**

* [x] **Core Feature:** Customizable Main Clock allowing users to define "Scaled 24" and "Another Hour (AH)" periods.  
* [x] **Time Scaling:** Implement correct time scaling during "Scaled 24" and normal speed during "AH Period".  
* [x] **Stopwatch & Timer:** Ensure these tools operate based on the Main Clock's current scaling.  
* [x] **Graph Demo:** Visualize the "Scaled 24" / "AH Period" distribution.  
* [x] **UI/UX:** Intuitive slider and displays for the Main Clock settings.  
* [x] **Theme:** Dark mode transition for the Main Clock during AH Period.

**Enhancements & Future Ideas:**

* [ ] **Customizable Main Clock:**  
  * Refine UI/UX for slider, perhaps add direct minute input.  
  * Explore alternative visualizations for \>12h AH periods if the current indicator line needs improvement.  
  * Persist user's "Scaled 24" setting (e.g., using localStorage or backend if user accounts were added).  
* [ ] **Stopwatch & Timer:**  
  * UI/UX enhancements.  
  * Optional persistence of lap times or timer settings.  
* [ ] **(Re-evaluate) World Clock:** If reintroduced, it would need to operate based on the *user's current "Scaled 24"* setting applied to each timezone, or offer a choice of which scaling to view. This is complex.  
* [ ] **(Re-evaluate) Time Converter:** If reintroduced, it would need to convert based on the *user's current "Scaled 24"* setting.  
* [ ] **General:**  
  * Internationalization (i18n) for UI text.  
  * Performance optimization.  
  * Consider replacing Moment.js with a lighter library like Day.js.  
  * Progressive Web App (PWA) features.  
* **Stretch Goals:**  
  * [ ] watchOS companion app (as per the new specification).  
  * [ ] Customizable themes/skins for the entire application.* **Stretch Goals:**
    * [ ] watchOS companion app.
    * [ ] Customizable themes/skins for the entire application.

## License

*(Choose a license if you haven't already. MIT is a common choice.)*
Example: This project is licensed under the MIT License. See the `LICENSE` file for details.

---
*(Placeholder: © 2025 Yoshimune Kaneko/Another Hour. All Rights Reserved. If not using an open-source license)*