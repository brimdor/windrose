export function renderHero(game, stats) {
  const latest = stats.latest_snapshot || {};
  const current = latest.current_concurrent_steamcharts ?? latest.current_concurrent_steamdb ?? '—';
  const peak = stats.all_time_peak_concurrent ? stats.all_time_peak_concurrent.toLocaleString() : '—';
  const latestMilestone = stats.sales_milestones?.slice(-1)[0];

  return `
    <section id="top" class="hero">
      <div class="container hero-inner">
        <div class="hero-badge">🏴‍☠️ Deep-Dive Research Hub</div>
        <h1>${game.title}</h1>
        <p class="hero-subtitle">${game.tagline} — a PvE pirate survival adventure in Early Access. Reliable, sourced, and always current.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="${game.stores.Steam.url}" target="_blank" rel="noopener">View on Steam</a>
          <a class="btn btn-outline" href="https://playwindrose.com" target="_blank" rel="noopener">Official Site</a>
        </div>
        <div class="hero-meta">
          <span>📅 Early Access: ${game.early_access_release}</span>
          <span>👤 Developer: ${game.developer}</span>
          <span>🏢 Publisher: ${game.publisher}</span>
        </div>

        <div class="facts-bar">
          <div class="fact">
            <div class="fact-value">${current}</div>
            <div class="fact-label">Current Players</div>
          </div>
          <div class="fact">
            <div class="fact-value">${peak}</div>
            <div class="fact-label">All-Time Peak</div>
          </div>
          <div class="fact">
            <div class="fact-value">${latestMilestone ? (latestMilestone.copies_sold / 1_000_000).toFixed(1) + 'M' : '—'}</div>
            <div class="fact-label">Copies Sold</div>
          </div>
          <div class="fact">
            <div class="fact-value">${game.team_size.replace(/[^0-9]/g, '')}+</div>
            <div class="fact-label">Team Size</div>
          </div>
        </div>
      </div>
    </section>
  `;
}
