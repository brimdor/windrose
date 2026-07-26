import json
import re
from pathlib import Path
from datetime import datetime, timezone
import urllib.request

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / 'data'
NEWS_URL = 'https://playwindrose.com/news/'
STEAMDB_URL = 'https://steamdb.info/app/3041230/charts/'
STEAMCHARTS_URL = 'https://steamcharts.com/app/3041230'

def load_json(path):
    full = DATA_DIR / path
    return json.loads(full.read_text()) if full.exists() else None

def save_json(path, data):
    full = DATA_DIR / path
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(json.dumps(data, indent=2))

def fetch_text(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return ''

def update_news(html):
    if not html:
        return
    patch_index = load_json('patch-index.json') or []
    existing_titles = {p.get('title', '').lower() for p in patch_index}
    timeline = load_json('timeline.json') or []

    # Look for readable title-like text inside the page.
    # Heuristic: strip tags, find lines containing strong keywords and reasonable length.
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text)
    sentences = re.split(r'(?<=[.!?])\s+', text)
    keywords = re.compile(r'\b(patch|update|roadmap|hotfix|changelog|announcement|release|new biome)\b', re.I)
    new_entries = 0
    for sentence in sentences:
        clean = sentence.strip()
        if len(clean) < 30 or len(clean) > 140:
            continue
        if not keywords.search(clean):
            continue
        key = clean.lower()
        if key in existing_titles:
            continue
        # Skip boilerplate/meta text
        if any(bad in key for bad in ['meta name', 'description', 'og:title', 'wpfooter', 'sdui-panel', 'cookie']):
            continue
        patch_index.append({
            'date': datetime.now(timezone.utc).strftime('%Y-%m-%d'),
            'version': 'unknown',
            'title': clean,
            'source': NEWS_URL,
            'auto_detected': True,
        })
        existing_titles.add(key)
        new_entries += 1
        if new_entries >= 5:
            break

    if new_entries:
        save_json('patch-index.json', patch_index)
        print(f"Added {new_entries} potential news entries.")
    else:
        print("No new news entries detected.")

def update_player_stats():
    stats = load_json('player-stats.json') or {}
    html_steamdb = fetch_text(STEAMDB_URL)
    html_charts = fetch_text(STEAMCHARTS_URL)

    snapshot = {
        'snapshot_date': datetime.now(timezone.utc).isoformat(),
    }

    # SteamDB blocks many scrapers; record if blocked.
    if 'Error 403' in html_steamdb or html_steamdb == '':
        snapshot['steamdb_status'] = 'blocked or empty'
    else:
        snapshot['steamdb_html_sample'] = html_steamdb[:1500]
        current_match = re.search(r'(?i)current players?[\s:]+([0-9,]+)', html_steamdb)
        if current_match:
            snapshot['current_concurrent_steamdb'] = int(current_match.group(1).replace(',', ''))
        peak_24h_match = re.search(r'(?i)24[- ]?hour peak[\s:]+([0-9,]+)', html_steamdb)
        if peak_24h_match:
            snapshot['peak_24h_concurrent_steamdb'] = int(peak_24h_match.group(1).replace(',', ''))

    if html_charts:
        snapshot['steamcharts_html_sample'] = html_charts[:1500]
        m_current = re.search(r'<span class="num">([0-9,]+)\s*</span>\s*<br>\s*playing', html_charts)
        if m_current:
            snapshot['current_concurrent_steamcharts'] = int(m_current.group(1).replace(',', ''))
        m_peak = re.search(r'(?i)24[- ]?hour peak[\s:]+\u003cspan class="num">([0-9,]+)\s*</span>', html_charts)
        if m_peak:
            snapshot['peak_24h_concurrent_steamcharts'] = int(m_peak.group(1).replace(',', ''))

    stats['latest_snapshot'] = snapshot
    save_json('player-stats.json', stats)
    print("Updated player-stats snapshot.")

def regenerate_search_index():
    import search as search_mod
    files = search_mod.load_json_files()
    index = search_mod.build_index(files)
    lines = ['# Search Index\n\n']
    for word in sorted(index.keys()):
        paths = ', '.join(index[word])
        lines.append(f'- **{word}**: {paths}\n')
    lines.append(f'\n_Generated: {datetime.now(timezone.utc).isoformat()}_\n')
    (REPO_ROOT / 'SEARCH_INDEX.md').write_text(''.join(lines))
    print("Regenerated SEARCH_INDEX.md")

def main():
    print(f"Windrose data update started at {datetime.now(timezone.utc).isoformat()}")
    news_html = fetch_text(NEWS_URL)
    update_news(news_html)
    update_player_stats()
    regenerate_search_index()
    print("Update complete.")

if __name__ == '__main__':
    main()
