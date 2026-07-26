export async function loadData() {
  const base = window.location.pathname.includes('/site/') ? '../data/' : 'data/';
  const files = {
    game: 'game-metadata.json',
    gameplay: 'gameplay.json',
    timeline: 'timeline.json',
    stats: 'player-stats.json',
    patches: 'patch-index.json',
    roadmap: 'roadmap.json',
    sources: 'sources/bibliography.json',
  };

  const entries = await Promise.all(
    Object.entries(files).map(async ([key, file]) => {
      const resp = await fetch(`${base}${file}`);
      if (!resp.ok) throw new Error(`Failed to load ${file}: ${resp.status}`);
      return [key, await resp.json()];
    })
  );

  return Object.fromEntries(entries);
}
