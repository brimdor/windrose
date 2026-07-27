import { htmlEscape } from '../utils.js';

export function renderGuides(data) {
  const categories = data.categories || [];
  const guides = data.guides || [];

  const categoryBadges = categories.map(c => `
    <button class="btn btn-outline filter-btn" data-category="${htmlEscape(c.id)}" aria-pressed="false">
      <span>${htmlEscape(c.icon)}</span> ${htmlEscape(c.name)}
    </button>
  `).join('');

  const guideCards = guides.map(g => {
    const tierClass = g.tier === 'high' ? 'tag-success' : g.tier === 'medium' ? 'tag-warning' : 'tag-info';
    const sources = g.sources.map(s => `<a href="${htmlEscape(s.url)}" target="_blank" rel="noopener">${htmlEscape(s.name)}</a>`).join(', ');
    const sections = g.sections.map(s => `
      <div class="guide-section">
        <h4>${htmlEscape(s.heading)}</h4>
        <ul>${s.items.map(i => `<li>${htmlEscape(i)}</li>`).join('')}</ul>
      </div>
    `).join('');
    const tags = g.tags.map(t => `<span class="tag tag-info">${htmlEscape(t)}</span>`).join('');

    return `
      <article class="guide-card" data-category="${htmlEscape(g.category)}" data-tier="${htmlEscape(g.tier)}">
        <div class="guide-header">
          <div class="guide-title-row">
            <h3>${htmlEscape(g.title)}</h3>
            <span class="tag ${tierClass}">${htmlEscape(g.tier)}</span>
          </div>
          <p class="guide-meta">By ${htmlEscape(g.author)} · ${categories.find(c => c.id === g.category)?.icon || ''} ${categories.find(c => c.id === g.category)?.name || g.category}</p>
          <div class="guide-tags">${tags}</div>
        </div>
        <div class="guide-body">
          ${sections}
        </div>
        <div class="guide-footer">
          <strong>Sources:</strong> <span class="sources-list">${sources}</span>
        </div>
      </article>
    `;
  }).join('');

  return `
    <section id="guides" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <div class="hero-badge">📚 Player Guides</div>
          <h2>Windrose Guides Hub</h2>
          <p class="section-subtitle">Curated, sourced guides covering combat, crafting, sailing, quests, and progression.</p>
        </div>

        <div class="filters">
          <button class="btn btn-primary filter-btn active" data-category="all" aria-pressed="true">All</button>
          ${categoryBadges}
        </div>

        <div class="guides-grid">
          ${guideCards}
        </div>
      </div>
    </section>
  `;
}

export function initGuides() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.guide-card');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      cards.forEach(card => {
        const show = category === 'all' || card.dataset.category === category;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}
