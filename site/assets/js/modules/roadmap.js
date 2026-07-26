import { htmlEscape } from '../utils.js';

function statusTag(status) {
  const map = {
    'confirmed': 'tag-success',
    'shipped': 'tag-success',
    'estimated': 'tag-warning',
    'post-1.0 interest': 'tag-info',
    'explicitly not planned': 'tag-danger',
    'dropped in pivot': 'tag-danger',
  };
  return map[status] || 'tag-primary';
}

export function renderRoadmap(roadmap) {
  const renderItem = (item) => `
    <div class="roadmap-item">
      <div class="roadmap-status"><span class="tag ${statusTag(item.status)}">${htmlEscape(item.status)}</span></div>
      <div class="roadmap-content">
        <h4>${htmlEscape(item.feature)}</h4>
        <p>${htmlEscape(item.expected ? `Expected: ${item.expected}. ` : '')}${htmlEscape(item.source ? '' : '')}<a href="${htmlEscape(item.source)}" target="_blank" rel="noopener">Source</a></p>
      </div>
    </div>
  `;

  return `
    <section id="roadmap" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2>Roadmap</h2>
          <p class="section-subtitle">Confirmed, speculative, and explicitly not planned features based on developer statements.</p>
        </div>

        <h3>Confirmed / Shipped</h3>
        <div class="roadmap-list" style="margin-bottom: var(--space-xl);">
          ${roadmap.confirmed?.map(renderItem).join('') || '<p class="empty-state">No confirmed items yet.</p>'}
        </div>

        <h3>Speculative / Post-1.0</h3>
        <div class="roadmap-list" style="margin-bottom: var(--space-xl);">
          ${roadmap.speculative?.map(renderItem).join('') || '<p class="empty-state">No speculative items yet.</p>'}
        </div>

        <h3>Not Planned</h3>
        <div class="roadmap-list">
          ${roadmap.not_planned?.map(renderItem).join('') || '<p class="empty-state">No dropped items yet.</p>'}
        </div>
      </div>
    </section>
  `;
}
