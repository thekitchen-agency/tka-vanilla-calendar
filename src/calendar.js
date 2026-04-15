import { 
  addMonths, subMonths, startOfMonth, startOfWeek, endOfMonth, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isSameDay, parse, parseISO, isAfter, isBefore, max, min
} from 'date-fns';
import { de } from 'date-fns/locale';
import { Tooltip } from './tooltip.js';

export class TkaCalendar {
  constructor(element, options = {}) {
    if (typeof element === 'string') {
      this.container = document.querySelector(element);
    } else {
      this.container = element;
    }

    this.options = { ...options };
    this.events = this.options.events || [];
    this.inputFormat = this.options.inputFormat || 'yyyy-MM-dd';
    this.outputFormat = this.options.outputFormat || 'dd.MM.yyyy';
    this.aspectRatio = this.options.aspectRatio || 1;
    
    // Normalize event dates
    this.events.forEach(e => {
        try {
            e.startDate = parse(e.start, this.inputFormat, new Date());
            e.endDate = parse(e.end, this.inputFormat, new Date());
        } catch(err) {
            e.startDate = parseISO(e.start);
            e.endDate = parseISO(e.end);
        }
        e.formattedStart = format(e.startDate, this.outputFormat);
    });

    this.currentDate = new Date();
    this.tooltip = new Tooltip(this.container);

    this.init();
  }

  init() {
    this.container.classList.add('tka-calendar-wrapper');
    this.container.style.setProperty('--tka-aspect-ratio', this.aspectRatio);
    this.render();
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1);
    this.render();
  }

  prevMonth() {
    this.currentDate = subMonths(this.currentDate, 1);
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    
    // Render Header
    const header = document.createElement('div');
    header.className = 'tka-calendar-header';
    
    const title = document.createElement('h2');
    title.className = 'tka-calendar-title';
    title.textContent = format(this.currentDate, 'MMMM yyyy', { locale: de });
    
    const nav = document.createElement('div');
    nav.className = 'tka-calendar-nav';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'tka-calendar-btn tka-prev-btn';
    prevBtn.innerHTML = '&#10094;'; // Left chevron
    prevBtn.addEventListener('click', () => this.prevMonth());
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'tka-calendar-btn tka-next-btn';
    nextBtn.innerHTML = '&#10095;'; // Right chevron
    nextBtn.addEventListener('click', () => this.nextMonth());
    
    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    
    header.appendChild(title);
    header.appendChild(nav);
    this.container.appendChild(header);

    // Grid Container
    const grid = document.createElement('div');
    grid.className = 'tka-calendar-grid';
    
    // Weekdays Header (Mon-Sun)
    const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    weekdays.forEach(day => {
      const el = document.createElement('div');
      el.className = 'tka-calendar-weekday';
      el.textContent = day;
      grid.appendChild(el);
    });
    this.container.appendChild(grid);

    // Body (Rows)
    const body = document.createElement('div');
    body.className = 'tka-calendar-body';

    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Chunk days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    weeks.forEach(week => {
      const row = document.createElement('div');
      row.className = 'tka-calendar-row';
      
      const layer = document.createElement('div');
      layer.className = 'tka-events-layer';

      const multiEventsInWeek = [];

      week.forEach((day, index) => {
        const dayEl = document.createElement('div');
        dayEl.className = 'tka-calendar-day';
        if (!isSameMonth(day, monthStart)) {
          dayEl.classList.add('tka-muted');
        }
        if (isSameDay(day, new Date())) {
          dayEl.classList.add('tka-today');
        }

        const numEl = document.createElement('div');
        numEl.className = 'tka-day-number';
        numEl.textContent = format(day, 'd');
        dayEl.appendChild(numEl);

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'tka-day-dots';
        
        // Single Day Events
        const dailyEvents = this.events.filter(e => !e.isMultiDay && isSameDay(e.startDate, day));
        
        // Prioritize distinct types so different colors aren't hidden
        const distinctSeen = new Set();
        const displayEvents = [];
        const overflowEvents = [];

        dailyEvents.forEach(ev => {
            const key = ev.backgroundColor || ev.type || 'default';
            if (!distinctSeen.has(key)) {
                distinctSeen.add(key);
                displayEvents.push(ev);
            } else {
                overflowEvents.push(ev);
            }
        });

        // Fill remaining empty slots up to 6 dots
        while (displayEvents.length < 6 && overflowEvents.length > 0) {
            displayEvents.push(overflowEvents.shift());
        }

        // Up to 6 dots
        displayEvents.slice(0, 6).forEach(ev => {
          const dot = document.createElement('div');
          dot.className = 'tka-dot-event';
          dot.style.backgroundColor = ev.backgroundColor || 'var(--tka-primary)';
          dot.title = ev.title;
          dot.addEventListener('click', (e) => {
             e.stopPropagation();
             // Pass ALL daily events on desktop too if there's hidden overflow, otherwise just click
             if (window.innerWidth <= 640 || dailyEvents.length > 6) {
                 this.tooltip.show(dailyEvents, dot);
             } else {
                 this.tooltip.show([ev], dot);
             }
          });
          dotsContainer.appendChild(dot);
        });

        dayEl.appendChild(dotsContainer);
        row.appendChild(dayEl);

        // Track multiday events for this week
        this.events.filter(e => e.isMultiDay).forEach(ev => {
            // Check if event overalaps with current day
            const isOverlap = day >= ev.startDate && day <= endOfDay(ev.endDate); // Wait, use exact boundaries
        });
      });

      // Calculate and place multi-day events
      const activeMultiEvents = this.events.filter(ev => ev.isMultiDay && 
         (isBefore(ev.startDate, addDays(week[6], 1)) && isAfter(ev.endDate, subDays(week[0], 1)))
      );
      
      // We need a simple allocation map to avoid overlapping bars
      const allocations = [];
      
      activeMultiEvents.forEach(ev => {
          // Span calculation
          const startIdx = Math.max(0, week.findIndex(d => isSameDay(d, ev.startDate)) > -1 ? week.findIndex(d => isSameDay(d, ev.startDate)) : 0);
          const endIdx = week.findIndex(d => isSameDay(d, ev.endDate)) > -1 ? week.findIndex(d => isSameDay(d, ev.endDate)) : 6;
          
          if(startIdx === -1 && isBefore(ev.startDate, week[0])) {
             // Event started before this week
          }
          
          const sDate = ev.startDate < week[0] ? week[0] : ev.startDate;
          const eDate = ev.endDate > week[6] ? week[6] : ev.endDate;
          
          let startIndex = 0;
          let span = 1;
          for(let i=0; i<7; i++){
              if(isSameDay(week[i], sDate)) startIndex = i;
          }
          // Span is difference in days + 1
          for(let i=startIndex; i<7; i++){
              if(isSameDay(week[i], eDate)){
                  span = (i - startIndex) + 1;
                  break;
              }
              if(i===6) span = (i - startIndex) + 1;
          }

          // Find free slot
          let slot = 0;
          while (allocations.some(a => a.slot === slot && Math.max(a.start, startIndex) <= Math.min(a.end, startIndex + span - 1))) {
              slot++;
          }
          allocations.push({slot, start: startIndex, end: startIndex + span - 1});
          
          const bar = document.createElement('div');
          bar.className = 'tka-multi-event';
          bar.textContent = ev.title;
          bar.style.backgroundColor = ev.backgroundColor || 'var(--tka-primary)';
          // 14.28% per day
          bar.style.left = `calc(${startIndex * (100 / 7)}% + 4px)`;
          bar.style.width = `calc(${span * (100 / 7)}% - 8px)`;
          bar.style.top = `calc(${slot} * var(--tka-slot-spacing, 26px))`;

          bar.addEventListener('click', (e) => {
              e.stopPropagation();
              this.tooltip.show(ev, bar);
          });
          layer.appendChild(bar);
      });

      row.appendChild(layer);
      // Adjust row height if too many multiday events
      const maxSlot = Math.max(-1, ...allocations.map(a => a.slot));
      if(maxSlot >= 2) {
          row.style.minHeight = `calc(100px + ${(maxSlot - 1)} * var(--tka-slot-spacing, 26px))`;
      }

      body.appendChild(row);
    });

    this.container.appendChild(body);
    
    // Add tooltip container again if cleared
    this.container.appendChild(this.tooltip.el);
  }
}
// Helper to overcome missing imports
function endOfDay(d) {
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return end;
}
function addDays(d, a) {
   const d2 = new Date(d);
   d2.setDate(d2.getDate() + a);
   return d2;
}
function subDays(d, s) {
   const d2 = new Date(d);
   d2.setDate(d2.getDate() - s);
   return d2;
}
