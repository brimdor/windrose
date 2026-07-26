import { htmlEscape } from '../utils.js';

export function renderOverview(game, gameplay) {
  const stores = Object.entries(game.stores || {}).map(([name, info]) =>
    `<a class="btn btn-outline" href="${htmlEscape(info.url)}" target="_blank" rel="noopener">${htmlEscape(name)} Store</a>`
  ).join('');

  const features = gameplay.key_features?.map(f => `
    <li>${htmlEscape(f)}</li>
  `).join('') || '';

  return `
    <section id="overview" class="section">
      <div class="container">
        <div class="section-header">
          <h2>Game Overview</h2>
          <p class="section-subtitle">Everything that defines Windrose, from core mechanics to official store presence.</p>
        </div>

        <div class="card-grid card-grid-3">
          <div class="card">
            <span class="tag tag-primary">${htmlEscape(gameplay.setting)}</span>
            <h3>Setting & World</h3>
            <p>${htmlEscape(gameplay.world_type)} set in an ${htmlEscape(gameplay.setting.toLowerCase())}. Explore islands, gather resources, build bases, and sail between points of interest.</p>
            <p><strong>Mode:</strong> ${htmlEscape(game.mode)}</p>
          </div>

          <div class="card">
            <span class="tag tag-info">${htmlEscape(gameplay.combat_style)}</span>
            <h3>Combat</h3>
            <p>${htmlEscape(gameplay.combat_style)} land combat plus naval battles with cannons, positioning, chain shot, and boarding tactics.</p>
            <p><strong>PvP:</strong> None (PvE-only by design)</p>
          </div>

          <div class="card">
            <span class="tag tag-success">Co-op ${htmlEscape(gameplay.coop.min_players)}-${htmlEscape(gameplay.coop.max_players)}</span>
            <h3>Multiplayer</h3>
            <p>Play solo or with up to ${htmlEscape(gameplay.coop.max_players)} players. Dedicated server support is available for persistent co-op sessions.</p>
            <p><strong>Dedicated servers:</strong> ${gameplay.coop.dedicated_servers ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div class="card" style="margin-top: var(--space-lg);">
          <h3>Key Features</h3>
          <ul style="display: grid; gap: var(--space-sm); color: var(--color-text-muted); padding-left: var(--space-md);">
            ${features}
          </ul>

          <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-top: var(--space-lg);">
            ${stores}
            <a class="btn btn-outline" href="${htmlEscape(game.demo.Steam || '#')}" target="_blank" rel="noopener">Demo</a>
          </div>
        </div>
      </div>
    </section>
  `;
}
