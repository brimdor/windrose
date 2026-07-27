export async function loadData() {
  const base = 'data/';
  const files = {
    game: 'game-metadata.json',
    gameplay: 'gameplay.json',
    timeline: 'timeline.json',
    stats: 'player-stats.json',
    patches: 'patch-index.json',
    roadmap: 'roadmap.json',
    sources: 'sources/bibliography.json',
    guides: 'guides/index.json',
  };

  const entries = await Promise.all(
    Object.entries(files).map(async ([key, file]) => {
      const resp = await fetch(`${base}${file}`);
      if (!resp.ok) throw new Error(`Failed to load ${file}: ${resp.status}`);
      return [key, await resp.json()];
    })
  );

  const data = Object.fromEntries(entries);

  // Load all individual guide files
  if (data.guides && data.guides.categories) {
    const guideFiles = [
      'beginners-guide.json',
      'crafting-guide.json',
      'land-combat-guide.json',
      'naval-combat-guide.json',
      'ship-guide.json',
      'navigation-guide.json',
      'quests-guide.json',
      'challenges-guide.json',
      'resource-farming-guide.json',
      'building-guide.json',
    ];
    const guideEntries = await Promise.all(
      guideFiles.map(async file => {
        const resp = await fetch(`${base}guides/${file}`);
        if (!resp.ok) return null;
        return resp.json();
      })
    );
    data.guides.guides = guideEntries.filter(Boolean);
  }

  return data;
}
