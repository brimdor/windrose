# Windrose Deep-Dive Research Repository

A consolidated, searchable, and automatically-updated knowledge base for the video game **Windrose**.

## What is Windrose?

Windrose is a PvE survival adventure game set in an alternate Age of Piracy. It launched in Steam Early Access on **April 14, 2026**, developed by **Kraken Express** and published by **Pocketpair Publishing (Japan)**. The game supports solo play or co-op (up to 4 players) with dedicated server support.

## Repository Structure

```
.
├── .github/workflows/weekly-update.yml   # Weekly automated data refresh
├── scripts/
│   ├── fetch_windrose_data.py            # Data ingestion script
│   └── search.py                         # CLI search utility
├── data/
│   ├── game-metadata.json                # Core facts, IDs, platforms, team
│   ├── gameplay.json                     # Mechanics, features, systems
│   ├── timeline.json                     # Development and release timeline
│   ├── player-stats.json                 # Sales and concurrent-player milestones
│   ├── patch-index.json                  # Patch note index
│   ├── roadmap.json                      # Confirmed/speculative roadmap
│   └── sources/
│       └── bibliography.json             # Curated source list with reliability tiers
├── README.md                             # This file
└── SEARCH_INDEX.md                       # Quick keyword lookup
```

## Search

Use `python scripts/search.py <keyword>` to find mentions across all data files, or open `SEARCH_INDEX.md` for a pre-generated keyword map.

## Data Update Schedule

The `Weekly Update` GitHub Actions workflow runs every **Sunday at 06:00 UTC** to:

1. Fetch fresh Steam player-count data from SteamDB/SteamCharts pages.
2. Scrape the official Windrose news page for new announcements.
3. Append any new entries to `player-stats.json`, `patch-index.json`, and `timeline.json`.
4. Regenerate `SEARCH_INDEX.md`.
5. Commit and push changes if there is new data.

## Reliability Tiers

Sources are tagged with a reliability score:

- **primary** — Official site, Steam/Epic store pages, developer announcements
- **high** — Wikipedia, Wikidata, SteamDB, established gaming outlets
- **medium** — Community wikis, Forbes/GamesRadar/etc. coverage, Reddit
- **low** — Small blogs, fan sites, unverified estimates

## Contributing

This is a solo research project. If you want to suggest sources or corrections, open an issue or PR.

## License

Data and source links are aggregated for research purposes. Game content belongs to Kraken Express / Pocketpair.
