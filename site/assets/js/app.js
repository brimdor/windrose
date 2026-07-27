import { loadData } from './data-loader.js';
import { renderHeader, initHeader } from './modules/header.js';
import { renderHero } from './modules/hero.js';
import { renderOverview } from './modules/overview.js';
import { renderStats } from './modules/stats.js';
import { renderTimeline } from './modules/timeline.js';
import { renderRoadmap } from './modules/roadmap.js';
import { renderPatches } from './modules/patches.js';
import { renderSources, initSources } from './modules/sources.js';
import { renderGuides, initGuides } from './modules/guides.js';
import { renderSearch, initSearch } from './modules/search.js';

async function main() {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="container" style="display:grid;place-items:center;padding:4rem;"><div class="loader"></div></div>';

  try {
    const data = await loadData();

    app.innerHTML = `
      ${renderHeader(data.game)}
      ${renderHero(data.game, data.stats)}
      ${renderOverview(data.game, data.gameplay)}
      ${renderStats(data.stats)}
      ${renderTimeline(data.timeline)}
      ${renderRoadmap(data.roadmap)}
      ${renderPatches(data.patches)}
      ${renderSources(data.sources)}
      ${renderGuides(data)}
      ${renderSearch(data)}
      <footer class="site-footer">
        <div class="container">
          <p>Windrose Research Hub — curated, sourced, and auto-updated weekly.</p>
          <p>Data last updated: ${new Date().toLocaleDateString()} · <a href="https://github.com/brimdor/windrose" target="_blank" rel="noopener">GitHub Repo</a> · <a href="https://github.com/brimdor/windrose/actions" target="_blank" rel="noopener">Update Runs</a></p>
        </div>
      </footer>
    `;

    initHeader();
    initSources();
    initGuides();
    initSearch(data);
  } catch (err) {
    app.innerHTML = `<div class="container" style="padding:4rem;text-align:center;">
      <h2 style="color:var(--color-danger)">Failed to load data</h2>
      <p>${err.message}</p>
      <pre style="text-align:left;background:var(--color-surface);padding:1rem;border-radius:var(--radius-md);">${err.stack}</pre>
    </div>`;
    console.error(err);
  }
}

main();
