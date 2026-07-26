import { htmlEscape } from '../utils.js';

export function renderTimeline(timeline) {
  const items = timeline.slice().reverse().map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-date">${htmlEscape(item.date)}</div>
      <div class="timeline-title">${htmlEscape(item.event)}</div>
      <div class="timeline-note">${htmlEscape(item.note || '')} <a href="${htmlEscape(item.source)}" target="_blank" rel="noopener">Source</a></div>
    </div>
  `).join('');

  return `
    <section id="timeline" class="section">
      <div class="container">
        <div class="section-header">
          <h2>Timeline</h2>
          <p class="section-subtitle">From the original Crosswind concept through Early Access milestones.</p>
        </div>
        <div class="timeline">
          ${items}
        </div>
      </div>
    </section>
  `;
}
