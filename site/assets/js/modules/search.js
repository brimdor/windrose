import { htmlEscape } from '../utils.js';

export function renderSearch(data) {
  return `
    <section id="search" class="section">
      <div class="container">
        <div class="section-header">
          <h2>Search the Archive</h2>
          <p class="section-subtitle">Search across game data, timeline, roadmap, sources, and patch history.</p>
        </div>

        <div class="search-box">
          <span class="icon">🔍</span>
          <input type="search" id="search-input" placeholder="Try: ship, ashlands, Kraken Express, 2M, PvP..." autocomplete="off" />
        </div>

        <div class="search-filters" id="search-filters">
          <button class="btn btn-outline active" data-scope="all">All</button>
          <button class="btn btn-outline" data-scope="timeline">Timeline</button>
          <button class="btn btn-outline" data-scope="roadmap">Roadmap</button>
          <button class="btn btn-outline" data-scope="sources">Sources</button>
          <button class="btn btn-outline" data-scope="patches">Patches</button>
        </div>

        <div class="search-results" id="search-results">
          <p class="empty-state">Type a keyword above to search the full archive.</p>
        </div>
      </div>
    </section>
  `;
}

function flattenObject(obj, prefix = '') {
  let tokens = [];
  if (obj === null || obj === undefined) return tokens;
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      tokens.push(key.toLowerCase());
      tokens.push(...flattenObject(value, key));
    }
  } else {
    tokens.push(String(obj).toLowerCase());
  }
  return tokens;
}

function tokenize(text) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length >= 2);
}

function buildSearchIndex(data) {
  const index = [];
  const add = (scope, title, text, url, meta) => {
    index.push({ scope, title, text, url, meta, tokens: new Set(tokenize(text)) });
  };

  // Timeline
  (data.timeline || []).forEach(item => {
    add('timeline', item.event, `${item.date} ${item.event} ${item.note || ''}`, item.source, item.date);
  });

  // Roadmap
  ['confirmed', 'speculative', 'not_planned'].forEach(section => {
    (data.roadmap?.[section] || []).forEach(item => {
      add('roadmap', item.feature, `${item.feature} ${item.status} ${item.expected || ''}`, item.source, item.status);
    });
  });

  // Sources
  (data.sources || []).forEach(s => {
    add('sources', s.name, `${s.name} ${s.category} ${s.type} ${s.notes} ${s.reliability}`, s.url, s.reliability);
  });

  // Patches
  (data.patches || []).forEach(p => {
    add('patches', p.title, `${p.date} ${p.version} ${p.title}`, p.source, p.date);
  });

  // Metadata
  add('overview', data.game?.title || 'Windrose', flattenObject(data.game).join(' '), '#overview', 'metadata');

  return index;
}

export function initSearch(data) {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const filterButtons = document.querySelectorAll('#search-filters button');
  if (!input || !results) return;

  const index = buildSearchIndex(data);
  let scope = 'all';

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scope = btn.dataset.scope;
      performSearch(input.value);
    });
  });

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = `<p class="empty-state">Type a keyword above to search the full archive.</p>`;
      return;
    }

    const terms = tokenize(q);
    const scored = index
      .filter(item => scope === 'all' || item.scope === scope)
      .map(item => {
        let score = 0;
        for (const term of terms) {
          for (const token of item.tokens) {
            if (token === term) score += 3;
            else if (token.startsWith(term)) score += 1;
          }
          if (item.title.toLowerCase().includes(term)) score += 2;
        }
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    if (!scored.length) {
      results.innerHTML = `<p class="empty-state">No results for "${htmlEscape(q)}". Try a broader term.</p>`;
      return;
    }

    results.innerHTML = scored.map(r => `
      <article class="search-result">
        <span class="tag tag-info">${htmlEscape(r.scope)}</span>
        <h4>${htmlEscape(r.title)}</h4>
        <p>${htmlEscape(r.text.slice(0, 180))}${r.text.length > 180 ? '…' : ''}</p>
        <div class="meta">${r.meta ? `Meta: ${htmlEscape(r.meta)} · ` : ''}<a href="${htmlEscape(r.url)}" target="_blank" rel="noopener">${htmlEscape(r.url).replace(/^https?:\/\//, '').slice(0, 50)}</a></div>
      </article>
    `).join('');
  }

  let debounce;
  input.addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => performSearch(e.target.value), 150);
  });
}
