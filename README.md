# tka-calendar

A high-performance, premium, and fully responsive vanilla JavaScript calendar library. Designed to handle complex event overlaps, multi-day span calculations, and beautiful mobile-optimized event cards.

![tka-calendar preview](https://via.placeholder.com/800x400.png?text=tka-calendar+Preview)

## Features

- **Zero UI Dependencies:** Pure Vanilla JS HTML/CSS generation. Only uses `date-fns` for lightweight, bulletproof date calculations.
- **Dynamic Adaptive Layout:** 
  - Desktop: Multi-day events span seamlessly across grid slots. Single day events compress into distinct colored dots.
  - Mobile (<640px): Day cells shrink gracefully. Multi-day overlaps convert to thin UI ribbons. Tooltips transform into smooth bottom-sheet modals.
- **Smart Event Groupings:** Intelligently prioritizes distinct event types/colors on the UI before showing overflow dots.
- **Card-List Tooltips:** Unified card structure for viewing multiple events on one day, with native scrolling and mobile bottom-sheet support.
- **Interactive:** Keyboard navigation (Arrows/Esc) and "Today" quick-reset built-in.
- **Theming & Localization:** Fully localized via `date-fns` and skinnable through a dynamic theme property or CSS variables.

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
import { de } from 'date-fns/locale';
import 'tka-calendar/style.css';

const myEvents = [
  {
    title: "Ice Diving Course",
    start: "2026-04-17",
    end: "2026-04-17",
    backgroundColor: "#2563EB",
    isMultiDay: false
  }
];

const calendar = new TkaCalendar('#calendar-container', {
    events: myEvents,
    locale: de,
    weekStartsOn: 1, // Monday
    theme: {
        primary: '#3b82f6',
        radius: '12px'
    }
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `events` | `Array` | `[]` | Array of event objects to render. |
| `locale` | `Object` | `de` | `date-fns` locale object for translations. |
| `inputFormat` | `String` | `'yyyy-MM-dd'` | The date structure used in your event payload. |
| `outputFormat` | `String` | `'dd.MM.yyyy'` | The format for front-end labels. |
| `aspectRatio` | `Number` | `1` | Controls grid square dimensions (width / height). |
| `weekStartsOn` | `Number` | `1` | `0` for Sunday, `1` for Monday, etc. |
| `maxEventsDisplayed` | `Number` | `6` | Max dots shown in a day cell before overflow. |
| `tooltip` | `Boolean` | `true` | Enable/Disable the event detail tooltip. |
| `initialDate` | `Date\|String` | `now` | The date the calendar should start on. |
| `showAdjacentDays` | `Boolean` | `true` | Show/hide days from prev/next months. |
| `showHeader` | `Boolean` | `true` | Show/hide the navigation header. |
| `showWeekdayHeader`| `Boolean` | `true` | Show/hide the weekday labels row. |
| `todayBtn` | `Boolean` | `true` | Show/hide the "Today" button in the header. |
| `minDate` | `Date\|String` | `null` | Prevents browsing before this date. |
| `maxDate` | `Date\|String` | `null` | Prevents browsing after this date. |
| `monthYearFormat` | `String` | `'MMMM yyyy'` | Header title format. |
| `dayNamesFormat` | `String` | `'EEEEEE'` | Weekday header format (e.g. 'EEE' for Mon). |
| `theme` | `Object` | `null` | Key-value mapping of CSS variable overrides. |
| `onEventClick` | `Function` | `null` | Callback: `(eventData, mouseEvent) => {}`. |
| `arrows` | `Object` | `null` | Custom HTML/SVG for navigation buttons: `{prev: '...', next: '...'}`. |

## Theming

You can customize the calendar looks via the `theme` object in options or by overriding CSS variables:

```javascript
theme: {
    primary: '#3b82f6',
    bg: '#0b1a30',
    text: '#ffffff',
    radius: '8px',
    'slot-spacing': '26px' // Spacing for multi-day overlaps
}
```

Equivalent CSS Variables:
```css
--tka-cal-primary: #3b82f6;
--tka-cal-bg: #0b1a30;
--tka-cal-text: #ffffff;
--tka-cal-radius: 8px;
```

## API Methods

- **`calendar.nextMonth()`**: Navigate forward.
- **`calendar.prevMonth()`**: Navigate backward.
- **`calendar.goToToday()`**: Jump to the current date.
- **`calendar.destroy()`**: Clean up DOM and global event listeners.

## Event Object Structure

```javascript
{
  title: String,
  start: String, // Matches inputFormat
  end: String,
  backgroundColor: String, // HEX or RGB
  isMultiDay: Boolean,
  type: String, // (Optional) Meta tag in tooltip
  image: String, // (Optional) Thumb in tooltip
  url: String, // (Optional) Card CTA
  parent: { post_content: String } // (Optional) Body text
}
```

## Keyboard Shortcuts
- **Arrow Left / Right**: Previous / Next Month.
- **Escape**: Close open tooltips.

## License

MIT
