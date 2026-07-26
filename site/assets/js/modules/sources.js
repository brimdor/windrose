import { htmlEscape } from '../utils.js';

const reliabilityOrder = { primary: 1, high: 2, medium: 3, low: 4 };

export function renderSources(sources) {
  const sorted = sources.slice().sort((a, b) => reliabilityOrder[a.reliability] - reliabilityOrder[b.reliability]);

  const rows = sorted.map(s => `
    <tr data-category="${htmlEscape(s.category)}" data-reliability="${htmlEscape(s.reliability)}">
      <td>${htmlEscape(s.category)}</td>
      <td>${htmlEscape(s.type)}</td>
      <td><a href="${htmlEscape(s.url)}" target="_blank" rel="noopener">${htmlEscape(s.name)}</a></td>
      <td><span class="tag tag-${s.reliability === 'primary' ? 'primary' : s.reliability === 'high' ? 'success' : s.reliability === 'medium' ? 'warning' : 'danger'}">${htmlEscape(s.reliability)}</span></td>
      <td>${htmlEscape(s.notes)}</td>
    </tr>
  `).join('');

  const categories = [...new Set(sources.map(s => s.category))];
  const reliability = [...new Set(sources.map(s => s.reliability))];

  return `
    <section id="sources" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2>Sources</h2>
          <p class="section-subtitle">${sources.length} curated links with reliability tiers. Filter by category or reliability.</p>
        </div>

        <div class="filters">
          <select id="filter-category" aria-label="Filter by category">
            <option value="">All Categories</option>
            ${categories.map(c => `<option value="${htmlEscape(c)}">${htmlEscape(c)}</option>`).join('')}
          </select>
          <select id="filter-reliability" aria-label="Filter by reliability">
            <option value="">All Reliability Tiers</option>
            ${reliability.map(r => `<option value="${htmlEscape(r)}">${htmlEscape(r)}</option>`).join('')}
          </select>
        </div>

        <div class="table-wrap">
          <table id="sources-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Source</th>
                <th>Reliability</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function initSources() {
  const categorySelect = document.getElementById('filter-category');
  const reliabilitySelect = document.getElementById('filter-reliability');
  const table = document.getElementById('sources-table');
  if (!table) return;

  function filter() {
    const cat = categorySelect?.value || '';
    const rel = reliabilitySelect?.value || '';
    table.querySelectorAll('tbody tr').forEach(row => {
      const matchCat = !cat || row.dataset.category === cat;
      const matchRel = !rel || row.dataset.reliability === rel;
      row.classList.toggle('hidden', !(matchCat && matchRel));
    });
  }

  categorySelect?.addEventListener('change', filter);
  reliabilitySelect?.addEventListener('change', filter);
}
