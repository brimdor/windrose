import { htmlEscape } from '../utils.js';

export function renderStats(stats) {
  const milestones = stats.sales_milestones || [];
  const latest = stats.latest_snapshot || {};
  const current = latest.current_concurrent_steamcharts ?? latest.current_concurrent_steamdb ?? '—';
  const peak24h = latest.peak_24h_concurrent_steamcharts ?? latest.peak_24h_concurrent_steamdb ?? '—';

  return `
    <section id="stats" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2>Player & Sales Stats</h2>
          <p class="section-subtitle">Sales milestones and concurrent player snapshots, updated weekly by automation.</p>
        </div>

        <div class="card-grid card-grid-4">
          <div class="card stat-card">
            <div class="value">${current}</div>
            <div class="label">Current Players</div>
            <div class="context">${latest.snapshot_date ? `Updated ${latest.snapshot_date.slice(0, 10)}` : '—'}</div>
          </div>
          <div class="card stat-card">
            <div class="value">${peak24h}</div>
            <div class="label">24h Peak</div>
            <div class="context">${latest.steamdb_status ? 'SteamDB blocked; SteamCharts used' : 'SteamCharts / SteamDB'}</div>
          </div>
          <div class="card stat-card">
            <div class="value">${stats.all_time_peak_concurrent?.toLocaleString() || '—'}</div>
            <div class="label">All-Time Peak</div>
            <div class="context">${stats.all_time_peak_date || ''}</div>
          </div>
          <div class="card stat-card">
            <div class="value">${milestones.length ? (milestones.slice(-1)[0].copies_sold / 1_000_000).toFixed(1) + 'M' : '—'}</div>
            <div class="label">Latest Sales Milestone</div>
            <div class="context">${milestones.slice(-1)[0]?.date || ''}</div>
          </div>
        </div>

        <div class="card" style="margin-top: var(--space-lg);">
          <h3>Sales Milestones</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Copies Sold</th><th>Source</th></tr>
              </thead>
              <tbody>
                ${milestones.map(m => `
                  <tr>
                    <td>${htmlEscape(m.date)}</td>
                    <td>${m.copies_sold.toLocaleString()}</td>
                    <td><span class="tag tag-info">${htmlEscape(m.source)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}
