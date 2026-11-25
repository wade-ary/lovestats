"""Verify and copy the prepared aggregate bundle. Never rerun the research."""
import hashlib
import json
import shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'experiment2-woulld song be a hit in 8 worlds' / 'web-assets'
DEST = ROOT / 'data/musiclab-v1'
manifest = json.loads((SOURCE / 'manifest.json').read_text())
assert manifest['schema_version'] == 1 and manifest['experiment'] == 'musiclab-v1'
for asset in manifest['assets']:
    path = SOURCE / asset['path']
    assert path.resolve().is_relative_to(SOURCE.resolve())
    content = path.read_bytes()
    assert len(content) == asset['bytes']
    assert hashlib.sha256(content).hexdigest() == asset['sha256'], path
for asset in manifest['assets']:
    target = DEST / asset['path']
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SOURCE / asset['path'], target)
shutil.copyfile(SOURCE / 'manifest.json', DEST / 'manifest.json')
print(f'Copied {len(manifest["assets"])} checksum-verified aggregate assets; original research unchanged.')
