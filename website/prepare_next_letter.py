"""Validate the notebook export, then copy it unchanged for the website."""
import json
import math
from pathlib import Path
from string import ascii_uppercase

root = Path(__file__).resolve().parent
source = root.parent / 'experiment4-next-letter' / 'letter_transitions.json'
data = json.loads(source.read_text())
letters = data['letters']
assert sorted(letters) == list(ascii_uppercase)
observed = total = 0
for letter, record in letters.items():
    outgoing = record['outgoing']
    assert len(outgoing) == 26 and sorted(r['letter'] for r in outgoing) == list(ascii_uppercase)
    assert all(isinstance(r['count'], int) and r['count'] >= 0 for r in outgoing)
    assert outgoing == sorted(outgoing, key=lambda r: (-r['count'], r['letter']))
    assert record['total'] == sum(r['count'] for r in outgoing) > 0
    assert record['strongest'] == outgoing[0]['letter']
    for row in outgoing:
        assert math.isclose(row['probability'], row['count'] / record['total'], abs_tol=1e-15)
    assert math.isclose(sum(r['probability'] for r in outgoing), 1)
    observed += sum(r['count'] > 0 for r in outgoing)
    total += record['total']
    path = record['path']
    assert path[0] == letter
    assert all(letters[a]['strongest'] == b for a, b in zip(path, path[1:]))
    assert set(record['cycle']) == {'E', 'R'}
assert observed == 669 and total == 2819662855499
positions = dict(zip(ascii_uppercase, ascii_uppercase))
for step, frame in enumerate(data['frames']):
    assert frame['step'] == step and frame['positions'] == positions
    assert frame['in_loop'] == sum(p in ('E', 'R') for p in positions.values())
    positions = {start: letters[p]['strongest'] for start, p in positions.items()}
assert [f['in_loop'] for f in data['frames']] == [2, 13, 18, 22, 26]
assert round(100 * letters['E']['outgoing'][0]['probability'], 1) == 19.6
out = root / 'data' / 'next-letter' / source.name
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(source.read_bytes())
print('Validated 676 probabilities, 669 observed pairs, all exported paths and five frames; copied source unchanged.')
