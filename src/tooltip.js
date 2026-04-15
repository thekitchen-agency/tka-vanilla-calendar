export class Tooltip {
  constructor(container) {
    this.container = container;
    
    // Desktop / mobile overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'tka-tooltip-overlay';
    document.body.appendChild(this.overlay);

    this.el = document.createElement('div');
    this.el.className = 'tka-tooltip';
    document.body.appendChild(this.el);

    this.outsideClickHandler = this.handleOutsideClick.bind(this);
    document.addEventListener('click', this.outsideClickHandler);
    
    this.el.addEventListener('click', (e) => {
        if (e.target.closest('.tka-tooltip-close')) {
            this.hide();
        }
    });

    this.overlay.addEventListener('click', () => {
        this.hide();
    });
  }

  destroy() {
    document.removeEventListener('click', this.outsideClickHandler);
    this.overlay.remove();
    this.el.remove();
  }

  handleOutsideClick(e) {
    if (this.el.classList.contains('tka-visible')) {
      if (!this.el.contains(e.target) && !e.target.closest('.tka-dot-event') && !e.target.closest('.tka-multi-event')) {
        this.hide();
      }
    }
  }

  show(events, targetElement) {
    events = Array.isArray(events) ? events : [events];

    let html = `
      <div class="tka-tooltip-header">
        <h3 class="tka-tooltip-date">${events[0].formattedStart || events[0].start}</h3>
        <button class="tka-tooltip-close">&times;</button>
      </div>
      <div class="tka-tooltip-scrollable">
    `;

    events.forEach((eventData, index) => {
        let imgHTML = '';
        if (eventData.image) {
          imgHTML = `<div class="tka-event-thumb"><img src="${eventData.image}" alt=""></div>`;
        }

        let excerptHTML = '';
        if (eventData.parent && eventData.parent.post_content) {
          const temp = document.createElement('div');
          temp.innerHTML = eventData.parent.post_content;
          const text = temp.textContent || temp.innerText || '';
          if (text.trim()) {
            excerptHTML = `<div class="tka-event-card-desc">${text}</div>`;
          }
        }

        const typeStr = eventData.type ? eventData.type.toUpperCase() : '';
        const tag = eventData.url ? 'a' : 'div';
        const href = eventData.url ? `href="${eventData.url}" target="_blank"` : '';
        const borderStyle = index > 0 ? 'border-top: 1px solid rgba(255,255,255,0.05);' : '';

        html += `
          <${tag} ${href} class="tka-event-card" style="${borderStyle}">
            ${imgHTML}
            <div class="tka-event-card-body">
              <span class="tka-event-card-meta">${typeStr}</span>
              <h4 class="tka-event-card-title">${eventData.title}</h4>
              ${excerptHTML}
            </div>
            ${eventData.url ? `<div class="tka-event-card-arrow">&#10095;</div>` : ''}
          </${tag}>
        `;
    });
    
    html += '</div>';
    this.el.innerHTML = html;

    this.el.classList.add('tka-visible');
    this.overlay.classList.add('tka-visible');
    
    // Defer positioning to element render
    setTimeout(() => {
        const rect = targetElement.getBoundingClientRect();
        
        let top = rect.bottom + 8; // fixed position relative
        let left = rect.left + (rect.width / 2) - 150;

        // X-axis boundary checks
        if (left < 10) left = 10;
        if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
        
        // Y-axis boundary checks
        if (rect.bottom + this.el.offsetHeight > window.innerHeight) {
            // Try pushing above the dot
            top = rect.top - this.el.offsetHeight - 8;
            
            // If it also overflows the top of the browser viewport, just center it on screen
            if (top < 10) {
                 top = (window.innerHeight - this.el.offsetHeight) / 2;
            }
        }

        this.el.style.top = `${top}px`;
        this.el.style.left = `${left}px`;
        
        // Lock background scroll
        document.body.style.overflow = 'hidden';
    }, 0);
  }

  hide() {
    this.el.classList.remove('tka-visible');
    this.overlay.classList.remove('tka-visible');
    document.body.style.overflow = '';
  }
}
