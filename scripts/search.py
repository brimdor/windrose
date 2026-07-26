import json
import re
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / 'data'

def load_json_files():
    files = {}
    for path in DATA_DIR.rglob('*.json'):
        try:
            files[path.relative_to(REPO_ROOT)] = json.loads(path.read_text())
        except Exception as e:
            print(f"Warning: could not load {path}: {e}")
    return files

def flatten(data, prefix=''):
    tokens = []
    if isinstance(data, dict):
        for k, v in data.items():
            tokens.append(str(k).lower())
            tokens.extend(flatten(v, f"{prefix}.{k}"))
    elif isinstance(data, list):
        for item in data:
            tokens.extend(flatten(item, prefix))
    elif data is not None:
        tokens.append(str(data).lower())
    return tokens

def build_index(files):
    index = defaultdict(list)
    noise = re.compile(r'^(\d{4,}t\d+|\d{6,}|20\d{2}-\d{2}-\d{2}t\d+|[0-9a-f]{16,}|\d{1,2}px|\d{1,3}$)$')
    for rel_path, data in files.items():
        tokens = set(flatten(data))
        for token in tokens:
            token = re.sub(r'[^a-z0-9]', ' ', token).strip()
            for word in token.split():
                word = word.strip()
                if len(word) < 3:
                    continue
                if noise.match(word):
                    continue
                index[word].append(str(rel_path))
    return {word: sorted(set(paths)) for word, paths in index.items()}

def search(query, index, top=10):
    words = re.findall(r'[a-z0-9]+', query.lower())
    scores = defaultdict(int)
    for word in words:
        for w, paths in index.items():
            if word in w or w.startswith(word):
                for p in paths:
                    scores[p] += 1
    return sorted(scores.items(), key=lambda x: -x[1])[:top]

def main():
    files = load_json_files()
    index = build_index(files)
    import sys
    query = ' '.join(sys.argv[1:]) if len(sys.argv) > 1 else input('Search: ')
    results = search(query, index)
    if not results:
        print("No results.")
        return
    print(f"Top results for '{query}':")
    for path, score in results:
        print(f"  {score}  {path}")

if __name__ == '__main__':
    main()
