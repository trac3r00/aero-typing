# AERO TYPING

An aviation-themed browser game for practicing typing with airport codes, cities, countries, airlines, and routes.

[![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

AERO TYPING is a dependency-free, single-page typing game built with HTML, CSS, and vanilla JavaScript. It combines timed practice exercises with airport journeys, live typing statistics, an animated world map, and synthesized sound. The application runs entirely in the browser and stores best WPM scores locally.

## Features

- **Journey mode:** Type each airport's IATA code, city, and country across eight preset routes.
- **Random journeys:** Generate a route containing 5 to 10 airports.
- **Custom routes:** Enter 2 to 12 supported IATA codes to create a journey.
- **Infinite flight:** Continue through randomly selected airports until you press `Escape`.
- **Practice mode:** Complete 60-second sessions covering international airlines, US domestic airlines, IATA airport codes, or popular routes.
- **Live statistics:** Track WPM, accuracy, score, streak, and a score multiplier of up to 5x.
- **Browser-based presentation:** View boarding-pass transitions, airport facts, animated flight paths, and themes based on the local time of day.
- **Generated audio:** Hear sound effects and adaptive background music produced with the Web Audio API.
- **Local best scores:** Preserve the highest WPM for each journey or practice category in `localStorage`.

## Architecture

The project has no framework, server-side component, build step, or runtime dependency.

```text
index.html
├── style.css       Layout, responsive design, themes, and animations
├── theme.js        Local time-of-day theme selection
├── background.js   Canvas world map, routes, and plane animation
├── sound.js        Web Audio sound effects and background music
├── data.js         Airport records, preset journeys, and practice data
└── game.js         Screen flow, input handling, scoring, and persistence
```

`game.js` coordinates the interface and uses the data, theme, map, and sound modules exposed by the other scripts. Best scores are read from and written to the browser key `aero-typing-best`.

## Installation

No dependency installation is required. Clone the repository and serve its files with any static HTTP server:

```bash
git clone https://github.com/Trac3r00/aero-typing.git
cd aero-typing
python3 -m http.server 8787
```

Open [http://localhost:8787](http://localhost:8787) in a modern browser. You can also open `index.html` directly, although a local HTTP server provides behavior closer to a deployed static site.

## Usage

### Journey mode

1. Choose a preset route, **Random Journey**, **Custom Route**, or **Infinite Flight**.
2. Swipe the boarding-pass control to begin.
3. Type each displayed IATA code, city, and country. Matching is case-insensitive, and a correct entry advances automatically.
4. Complete the route to view the result summary. In Infinite Flight, press `Escape` to finish the session.

For a custom route, enter supported IATA codes separated by commas or spaces, for example:

```text
JFK,LHR,DXB,ICN
```

Invalid codes are ignored, and the route must contain at least two recognized codes.

### Practice mode

1. Select **Practice Mode** and choose a category.
2. Start typing to begin the 60-second timer.
3. Type each displayed item. Matching is case-insensitive; correct entries advance automatically, while an incorrect entry remains active until corrected.
4. Review WPM, accuracy, score, completed items, and best streak when time expires.

## Configuration

AERO TYPING does not use environment variables or external configuration files. Game content and behavior are defined in the source files:

- `data.js` contains airports, preset journeys, and practice categories.
- `game.js` contains session timing, scoring, route generation, and local-storage behavior.
- `theme.js` contains the time ranges and colors for each visual theme.
- `sound.js` contains synthesized sound and tempo behavior.

The page loads Inter and JetBrains Mono from Google Fonts; all game data and audio generation remain local to the browser.

## Development

Edit the static files and reload the browser to see changes. Use the same local server command shown in [Installation](#installation) for manual development and testing.

There is currently no package manifest, build command, linter, automated test suite, or CI workflow in this repository. Before submitting changes, manually exercise both Journey and Practice modes at desktop and mobile viewport sizes.

## Project structure

```text
.
├── index.html      Application markup and script loading order
├── style.css       Application styles and responsive layouts
├── game.js         Main game state and interaction logic
├── data.js         Airport, journey, and practice datasets
├── background.js   Canvas map renderer and animations
├── sound.js        Web Audio engine
├── theme.js        Time-of-day theme logic
├── favicon.svg     Site icon
├── LICENSE         MIT license text
└── README.md       Project documentation
```

## License

Copyright (c) 2026 Minseo Choi. This project is licensed under the [MIT License](LICENSE).
