# tka-calendar

A high-performance, dark-themed, and fully responsive vanilla JavaScript calendar library. Designed to seamlessly handle complex event overlaps, multi-day span calculations, and beautiful mobile-optimized event cards.

![tka-calendar preview](https://via.placeholder.com/800x400.png?text=tka-calendar+Preview)

## Features

- **Zero UI Dependencies:** Pure Vanilla JS HTML/CSS generation. Only uses `date-fns` for lightweight, bulletproof date calculations.
- **Dynamic Adaptive Layout:** 
  - Desktop: Multi-day events span seamlessly across grid slots. Single day events compress into distinct colored dots (up to 6 per day).
  - Mobile (<640px): Day cells shrink gracefully. Multi-day overlaps convert to thin UI ribbons. Tooltips transform into smooth bottom-sheet modals.
- **Smart Event Groupings:** Intelligently guarantees distinct event types/colors are prioritized on the UI before hiding duplicates under the "more" dot limit.
- **Card-List Modals:** Event tooltips natively handle grouping multiple events on a single day. Built-in card list structure auto-scales with content, scrolling natively if needed.
- **Customizable Formats & Aspect Ratios:** Configure exactly how dates are read, displayed, and how the CSS grid blocks are sized.

## Installation

```bash
npm install tka-calendar
```

## Basic Usage

Include the CSS file and import the JavaScript Class:

```html
<!-- index.html -->
<link rel="stylesheet" href="node_modules/tka-calendar/dist/style.css">

<div id="calendar-container"></div>

<script type="module" src="./app.js"></script>
```

```javascript
// app.js
import { TkaCalendar } from 'tka-calendar';
import 'tka-calendar/style.css'; // If using a bundler like Vite/Webpack

const myEvents = [
  {
    title: "Ice Diving Course",
    type: "coursedata",
    start: "2026-04-17",
    end: "2026-04-17",
    image: "https://example.com/image.jpg",
    url: "https://example.com/ice-course",
    backgroundColor: "#2563EB",
    isMultiDay: false,
    parent: {
        post_content: "Thrilling under-ice exploration..."
    }
  },
  {
      title: "Caribbean Trip",
      type: "trip",
      start: "2026-04-29",
      end: "2026-05-10",
      backgroundColor: "#F200FF",
      isMultiDay: true
  }
];

const calendar = new TkaCalendar('#calendar-container', {
    events: myEvents,
    inputFormat: 'yyyy-MM-dd',
    outputFormat: 'dd.MM.yyyy',
    aspectRatio: 1 // Controls the grid square dimensions
});
```

## Configuration Options

When initializing `new TkaCalendar(selector, options)`, you can pass the following properties in the `options` object:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `events` | `Array` | `[]` | Array of event objects to render. |
| `inputFormat` | `String` | `'yyyy-MM-dd'` | The date structure used in your event payload. |
| `outputFormat` | `String` | `'dd.MM.yyyy'` | The format exposed to front-end labels and tooltips. |
| `aspectRatio` | `Number` | `1` | Affects CSS width vs height calculations to keep cells square (`1`) or rectangular. |

## Event Object Structure

The Calendar expects objects heavily mapped to your custom payload. The core requirements for the calendar engine are `start`, `end`, `backgroundColor`, and `isMultiDay`. 

```javascript
{
  title: String,
  type: String, // Renders as meta label
  start: String, // Must match inputFormat
  end: String,
  backgroundColor: String, // HEX or RGB
  isMultiDay: Boolean, // True converts to spanning ribbon
  image: String, // (Optional) URL
  url: String, // (Optional) Makes card clickable
  parent: { // (Optional)
    post_content: String // Extracted & clamped inside tooltip
  }
}
```

## License

MIT
# tka-vanilla-calendar
