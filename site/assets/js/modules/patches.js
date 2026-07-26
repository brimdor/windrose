import { htmlEscape } from '../utils.js';

export function renderPatches(patches) {
  const rows = patches.map(p => `
    <tr>
      <td>${htmlEscape(p.date)}</td>
      <td><span class="tag ${p.auto_detected ? 'tag-warning' : 'tag-primary'}">${htmlEscape(p.version)}</span></td>
      <td>${htmlEscape(p.title)}</td>
      <td><a href="${htmlEscape(p.source)}" target="_blank" rel="noopener">View</a></td>
    </tr>
  `).join('');

  return `
    <section id="patches" class="section">
      <div class="container">
        <div class="section-header">
          <h2>Patch History</h2>
          <p class="section-subtitle">Major updates and curated hotfixes. Auto-detected entries are flagged until manually verified.</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Version</th><th>Title / Notes</th><th>Source</th></tr>
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
