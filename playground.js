import { TkaCalendar } from './src/calendar.js';
import { de } from 'date-fns/locale/de';
import { enUS } from 'date-fns/locale/en-US';
import { fr } from 'date-fns/locale/fr';
import { addMonths } from 'date-fns';

const locales = { de, enUS, fr };

const events = [
    {
        title: "Deeper Web 4 Intro",
        type: "coursedata",
        start: "2026-04-15",
        end: "2026-04-15",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
        url: "#",
        backgroundColor: "#3b82f6",
        isMultiDay: false,
        parent: { post_content: "Learn how to build advanced agentic systems with deep recursive reasoning and tool-calling capabilities." }
    },
    {
        title: "Spring Dive Retreat",
        type: "event",
        start: "2026-04-18",
        end: "2026-04-22",
        backgroundColor: "#10b981",
        isMultiDay: true,
        parent: { post_content: "A 5-day retreat focusing on technique and relaxation in calm waters." }
    },
    {
        title: "Technical Workshop",
        type: "workshop",
        start: "2026-04-20",
        end: "2026-04-20",
        backgroundColor: "#f59e0b",
        isMultiDay: false
    },
    {
        title: "Product Launch",
        type: "marketing",
        start: "2026-04-20",
        end: "2026-04-20",
        backgroundColor: "#ef4444",
        isMultiDay: false
    },
    {
        title: "Team Sync",
        type: "internal",
        start: "2026-04-20",
        end: "2026-04-20",
        backgroundColor: "#8b5cf6",
        isMultiDay: false
    },
    {
        title: "Strategy Planning",
        type: "internal",
        start: "2026-04-20",
        end: "2026-04-20",
        backgroundColor: "#ec4899",
        isMultiDay: false
    },
    {
        title: "Another Event",
        type: "misc",
        start: "2026-04-20",
        end: "2026-04-20",
        backgroundColor: "#6366f1",
        isMultiDay: false
    }
];

let calendar = null;

function updateCalendar() {
    if (calendar) {
        calendar.destroy();
    }

    const options = {
        events,
        locale: locales[document.getElementById('opt-locale').value],
        weekStartsOn: parseInt(document.getElementById('opt-weekstarts').value),
        aspectRatio: parseFloat(document.getElementById('opt-aspect').value),
        maxEventsDisplayed: parseInt(document.getElementById('opt-maxevents').value),
        tooltip: document.getElementById('opt-tooltip').checked,
        showAdjacentDays: document.getElementById('opt-adjacent').checked,
        showHeader: document.getElementById('opt-header').checked,
        showWeekdayHeader: document.getElementById('opt-weekday').checked,
        todayBtn: document.getElementById('opt-todaybtn').checked,
        minDate: document.getElementById('opt-mindate').value || null,
        maxDate: document.getElementById('opt-maxdate').value || null,
        initialDate: document.getElementById('opt-initdate').value || null,
        theme: {
            primary: document.getElementById('opt-color-primary').value,
            bg: document.getElementById('opt-color-bg').value,
            radius: document.getElementById('opt-radius').value
        },
        onEventClick: (ev) => console.log('Clicked event:', ev)
    };

    // Render code preview
    const previewOptions = { ...options };
    delete previewOptions.events;
    previewOptions.locale = `locales.${document.getElementById('opt-locale').value}`;
    document.getElementById('code-output').textContent = `const calendar = new TkaCalendar('#app', ${JSON.stringify(previewOptions, null, 4)});`;

    calendar = new TkaCalendar('#calendar-playground', options);
}

// Add event listeners
const inputs = document.querySelectorAll('.sidebar input, .sidebar select');
inputs.forEach(input => {
    input.addEventListener('change', updateCalendar);
    if (input.type === 'number' || input.type === 'text') {
        input.addEventListener('input', updateCalendar);
    }
});

// Initial render
updateCalendar();
