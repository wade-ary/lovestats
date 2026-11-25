"""Copy and validate saved experiment artifacts; never run a simulation."""
from pathlib import Path
import csv, json, shutil, math, statistics
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'website' / 'data'
OUT.mkdir(exist_ok=True)
def read_csv(path):
    with path.open() as f:
        return list(csv.DictReader(f))
summary = read_csv(ROOT / 'outputs/tournament-comparison/format_summary.csv')
results = read_csv(ROOT / 'outputs/tournament-comparison/tournament_results.csv')
for row in summary:
    for key in row:
        if key != 'format': row[key] = float(row[key])
    group = [r for r in results if r['format'] == row['format']]
    gaps = [float(r['rating_gap']) for r in group]
    assert len(group) == row['simulations'] == 1000
    assert math.isclose(statistics.mean(gaps), row['mean_rating_gap'])
    assert math.isclose(statistics.stdev(gaps)/len(gaps)**.5, row['gap_mc_se'])
    row['champions'] = [{'team': name, 'count': sum(r['champion']==name for r in group)} for name in sorted({r['champion'] for r in group})]
    row['champions'].sort(key=lambda x: -x['count'])
(OUT / 'summary.json').write_text(json.dumps(summary, indent=2)+'\n')
for src, name in [('data/fifa-men-top32-2026-11-25.json','teams.json'),('data/pairwise-win-loss-2026-11-25.csv','pairwise.csv'),('outputs/tournament-comparison/tournament_results.csv','tournament_results.csv'),('outputs/tournament-comparison/format_summary.csv','format_summary.csv'),('outputs/tournament-comparison/settings.json','settings.json')]:
    shutil.copyfile(ROOT / src, OUT / name)
print(f'Validated {len(results):,} saved tournaments; refreshed website/data.')
