# Another Hour Clock

A web-based clock that **condenses the 24-hour day into 23 hours** by shortening every real-world second to **23 / 24 ≈ 0.958 333 s**.  
From 23:00 to 24:00 (real time) the clock enters the "Another Hour (AH)" period, giving users the feeling of an extra hour each day.

## Table of Contents
1. [Features](#features)
2. [Directory Structure](#directory-structure)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Technical Notes](#technical-notes)
7. [Roadmap](#roadmap)

## Features
| Category | Description |
|----------|-------------|
| **Dual Time Display** | Simultaneously shows Standard Time and AH Time |
| **12-hour Analog Face** | SVG-based 12-hour dial with a highlighted AH sector (real-time 23:00 – 24:00) |
| **Digital Toggle** | Optional digital read-out beneath the dial |
| **Visual Cues** | Dial colour inversion during the AH period |
| **Time Tools** | • AH-aware Stopwatch (planned)<br>• AH-aware Timer (planned) |
| **Multi-Timezone View** | Display AH Time for selected world time zones |
| **Admin Panel** | Manage time-zones, appearance, and environment keys from the browser |

## Directory Structure
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

## Installation
```bash
git clone https://github.com/your-name/another-hour.git
cd another-hour
npm install
cp .env.example .env   # then edit values
npm start              # runs node server.js
```

### Minimum Requirements
* **Node >= 18**
* Modern browser with SVG support (Chrome, Firefox, Safari, Edge)

## Configuration
Create a **.env** file (or set system env vars):

| Key | Purpose |
|-----|---------|
| `SESSION_SECRET` | Session encryption key (32+ random chars) |
| `ADMIN_KEY` | Single admin password for the panel |

## Usage
1. Navigate to `http://0.0.0.0:3000`
2. Select your timezone from the drop-down
3. Click **Toggle Digital Display** to show/hide numeric clocks
4. Log in to `/admin` with the `ADMIN_KEY` to add or remove time-zones, change colours, etc.

## Technical Notes
* **SCALE_AH = 23 / 24** (≈ 0.958333) converts real seconds to AH seconds
* Rendering loop uses `requestAnimationFrame` (≈ 60 fps) for smooth hand motion
* **Moment.js** / **moment-timezone** handle offsets; can be swapped for **dayjs** in the future
* AH period detection:
```js
const inAhHour = realDate.getHours() === 23;
```

## Roadmap
- [ ] Complete stopwatch & timer modules (UI + persistence)
- [ ] i18n (English / Japanese UI strings)
- [ ] Replace Moment.js with dayjs + plugins
- [ ] PWA support & offline caching
- [ ] watchOS companion app (stretch goal)

---

© 2025 Another Hour Project. MIT License.