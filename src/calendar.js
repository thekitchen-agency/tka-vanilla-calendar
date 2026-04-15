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
    this.maxEventsDisplayed = this.options.maxEventsDisplayed || 6;
    this.showTooltip = this.options.tooltip !== false;
    this.locale = this.options.locale || de;
    this.weekStartsOn = this.options.weekStartsOn !== undefined ? this.options.weekStartsOn : 1;
    this.showAdjacentDays = this.options.showAdjacentDays !== false;
    this.showHeader = this.options.showHeader !== false;
    this.showWeekdayHeader = this.options.showWeekdayHeader !== false;
    this.monthYearFormat = this.options.monthYearFormat || 'MMMM yyyy';
    this.dayNamesFormat = this.options.dayNamesFormat || 'EEEEEE';
    this.onEventClick = typeof this.options.onEventClick === 'function' ? this.options.onEventClick : null;
    this.showTodayBtn = this.options.todayBtn !== false;
    this.theme = this.options.theme || null;
    
    this.minDate = this.options.minDate ? (typeof this.options.minDate === 'string' ? parseISO(this.options.minDate) : this.options.minDate) : null;
    this.maxDate = this.options.maxDate ? (typeof this.options.maxDate === 'string' ? parseISO(this.options.maxDate) : this.options.maxDate) : null;

    this.arrows = this.options.arrows || {
      prev: '&#10094;',
      next: '&#10095;'
    };
    
    // Normalize event dates
    this.events.forEach(e => {
        try {
            e.startDate = parse(e.start, this.inputFormat, new Date());
            e.endDate = parse(e.end, this.inputFormat, new Date());
        } catch(err) {
            e.startDate = parseISO(e.start);
            e.endDate = parseISO(e.end);
        }
        e.formattedStart = format(e.startDate, this.outputFormat, { locale: this.locale });
    });

    // Set initial date
    if (this.options.initialDate) {
        this.currentDate = typeof this.options.initialDate === 'string' 
            ? parseISO(this.options.initialDate) 
            : this.options.initialDate;
    } else {
        this.currentDate = new Date();
    }

    this.tooltip = new Tooltip(this.container);
    this.handleKeydown = this.onKeydown.bind(this);

    this.init();
  }

  init() {
    this.container.classList.add('tka-calendar-wrapper');
    this.applyTheme();
    this.container.style.setProperty('--tka-cal-aspect-ratio', this.aspectRatio);
    document.addEventListener('keydown', this.handleKeydown);
    this.render();
  }

  applyTheme() {
    if (!this.theme) return;
    Object.entries(this.theme).forEach(([key, value]) => {
        this.container.style.setProperty(`--tka-cal-${key}`, value);
    });
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeydown);
    this.tooltip.destroy();
    this.container.innerHTML = '';
    this.container.classList.remove('tka-calendar-wrapper');
  }

  onKeydown(e) {
    if (this.tooltip.el.classList.contains('tka-visible')) {
        if (e.key === 'Escape') this.tooltip.hide();
        return;
    }
    if (e.key === 'ArrowLeft') this.prevMonth();
    if (e.key === 'ArrowRight') this.nextMonth();
  }

  goToToday() {
    const now = new Date();
    if (this.minDate && isBefore(startOfMonth(now), startOfMonth(this.minDate))) return;
    if (this.maxDate && isAfter(startOfMonth(now), startOfMonth(this.maxDate))) return;
    
    this.currentDate = now;
    this.render();
  }

  nextMonth() {
    if (this.maxDate) {
        const next = addMonths(this.currentDate, 1);
        if (isAfter(startOfMonth(next), startOfMonth(this.maxDate))) return;
    }
    this.currentDate = addMonths(this.currentDate, 1);
    this.render();
  }

  prevMonth() {
    if (this.minDate) {
        const prev = subMonths(this.currentDate, 1);
        if (isBefore(startOfMonth(prev), startOfMonth(this.minDate))) return;
    }
    this.currentDate = subMonths(this.currentDate, 1);
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    
    // Render Header
    if (this.showHeader) {
      const header = document.createElement('div');
      header.className = 'tka-calendar-header';
      
      const title = document.createElement('h2');
      title.className = 'tka-calendar-title';
      title.textContent = format(this.currentDate, this.monthYearFormat, { locale: this.locale });
      
      const nav = document.createElement('div');
      nav.className = 'tka-calendar-nav';
      
      const prevBtn = document.createElement('button');
      prevBtn.className = 'tka-calendar-btn tka-prev-btn';
      prevBtn.innerHTML = this.arrows.prev;
      
      const isPrevDisabled = this.minDate && isBefore(subMonths(startOfMonth(this.currentDate), 1), startOfMonth(this.minDate));
      if (isPrevDisabled) {
          prevBtn.classList.add('tka-disabled');
          prevBtn.style.opacity = '0.2';
          prevBtn.style.cursor = 'not-allowed';
      } else {
          prevBtn.addEventListener('click', () => this.prevMonth());
      }
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'tka-calendar-btn tka-next-btn';
      nextBtn.innerHTML = this.arrows.next;

      const isNextDisabled = this.maxDate && isAfter(addMonths(startOfMonth(this.currentDate), 1), startOfMonth(this.maxDate));
      if (isNextDisabled) {
          nextBtn.classList.add('tka-disabled');
          nextBtn.style.opacity = '0.2';
          nextBtn.style.cursor = 'not-allowed';
      } else {
          nextBtn.addEventListener('click', () => this.nextMonth());
      }
      
      nav.appendChild(prevBtn);

      if (this.showTodayBtn) {
          const todayBtn = document.createElement('button');
          todayBtn.className = 'tka-calendar-btn tka-today-btn';
          todayBtn.textContent = 'Heute';
          todayBtn.style.fontSize = '0.75rem';
          todayBtn.style.fontWeight = '600';
          todayBtn.style.textTransform = 'uppercase';
          todayBtn.style.letterSpacing = '0.05em';
          todayBtn.style.opacity = '0.6';
          todayBtn.style.padding = '0 8px';
          
          if (this.locale && this.locale.code && this.locale.code.startsWith('en')) todayBtn.textContent = 'Today';
          
          todayBtn.addEventListener('click', () => this.goToToday());
          nav.appendChild(todayBtn);
      }

      nav.appendChild(nextBtn);
      
      header.appendChild(title);
      header.appendChild(nav);
      this.container.appendChild(header);
    }

    // Weekdays Header
    if (this.showWeekdayHeader) {
      const grid = document.createElement('div');
      grid.className = 'tka-calendar-grid';
      
      const weekStart = startOfWeek(new Date(), { weekStartsOn: this.weekStartsOn });
      const weekdays = [];
      for (let i = 0; i < 7; i++) {
          weekdays.push(format(addDays(weekStart, i), this.dayNamesFormat, { locale: this.locale }));
      }

      weekdays.forEach(day => {
        const el = document.createElement('div');
        el.className = 'tka-calendar-weekday';
        el.textContent = day;
        grid.appendChild(el);
      });
      this.container.appendChild(grid);
    }

    // Body (Rows)
    const body = document.createElement('div');
    body.className = 'tka-calendar-body';

    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: this.weekStartsOn });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: this.weekStartsOn });

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
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        if (!isCurrentMonth) {
          if (!this.showAdjacentDays) {
            dayEl.classList.add('tka-hidden');
            dayEl.style.visibility = 'hidden';
          } else {
            dayEl.classList.add('tka-muted');
          }
        }
        if (isSameDay(day, new Date())) {
          dayEl.classList.add('tka-today');
        }

        if (!isCurrentMonth && !this.showAdjacentDays) {
            row.appendChild(dayEl);
            return;
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

        // Fill remaining empty slots up to maxEventsDisplayed dots
        while (displayEvents.length < this.maxEventsDisplayed && overflowEvents.length > 0) {
            displayEvents.push(overflowEvents.shift());
        }

        // Render dots
        displayEvents.slice(0, this.maxEventsDisplayed).forEach(ev => {
          const dot = document.createElement('div');
          dot.className = 'tka-dot-event';
          dot.style.backgroundColor = ev.backgroundColor || 'var(--tka-cal-primary)';
          dot.title = ev.title;
          dot.addEventListener('click', (e) => {
             if (this.onEventClick) this.onEventClick(ev, e);
             if (!this.showTooltip) return;
             e.stopPropagation();
             // Pass ALL daily events on desktop too if there's hidden overflow, otherwise just click
             if (window.innerWidth <= 640 || dailyEvents.length > this.maxEventsDisplayed) {
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
          bar.style.backgroundColor = ev.backgroundColor || 'var(--tka-cal-primary)';
          // 14.28% per day
          bar.style.left = `calc(${startIndex * (100 / 7)}% + 4px)`;
          bar.style.width = `calc(${span * (100 / 7)}% - 8px)`;
          bar.style.top = `calc(${slot} * var(--tka-cal-slot-spacing, 26px))`;

          bar.addEventListener('click', (e) => {
              if (this.onEventClick) this.onEventClick(ev, e);
              if (!this.showTooltip) return;
              e.stopPropagation();
              this.tooltip.show(ev, bar);
          });
          layer.appendChild(bar);
      });

      row.appendChild(layer);
      // Adjust row height if too many multiday events
      const maxSlot = Math.max(-1, ...allocations.map(a => a.slot));
      if(maxSlot >= 2) {
          row.style.minHeight = `calc(100px + ${(maxSlot - 1)} * var(--tka-cal-slot-spacing, 26px))`;
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
