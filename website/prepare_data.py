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

# Revised primary objective: full championship distributions and fairness distance.
def numeric_csv(name):
    rows = read_csv(ROOT / 'outputs/tournament-comparison' / name)
    for row in rows:
        for key, value in row.items():
            if key not in ('format', 'team'): row[key] = float(value)
    return rows
shares = numeric_csv('championship_shares.csv')
fairness = numeric_csv('fairness_summary.csv')
settings = json.loads((OUT / 'settings.json').read_text())
teams = json.loads((OUT / 'teams.json').read_text())['teams']
weights = {t['team']: 10 ** ((t['rating_points']-max(t['rating_points'] for t in teams))/settings['scale']) for t in teams}
for f in fairness:
    group = sorted([r for r in shares if r['format']==f['format']], key=lambda r:r['fifa_rank'])
    batch = [r for r in results if r['format']==f['format']]
    assert len(group)==32 and len({r['team'] for r in group})==32
    assert sum(r['championships'] for r in group)==f['simulations']==len(batch)
    assert math.isclose(sum(r['target_share'] for r in group),1)
    assert math.isclose(sum(r['observed_share'] for r in group),1)
    for r in group:
        assert r['championships']==sum(b['champion']==r['team'] for b in batch)
        assert math.isclose(r['target_share'],weights[r['team']]/sum(weights.values()))
        assert math.isclose(r['observed_share'],r['championships']/r['simulations'],abs_tol=1e-12)
        assert math.isclose(r['difference_pp'],100*(r['observed_share']-r['target_share']),abs_tol=1e-10)
        assert 0<=r['share_ci_low']<=r['observed_share']+1e-12<=r['share_ci_high']+1e-12<=1+1e-12
        if r['championships']==0: assert r['share_ci_high']>0
    tv=.5*sum(abs(r['observed_share']-r['target_share']) for r in group)
    assert math.isclose(tv,f['tv_distance']) and math.isclose(100*tv,f['probability_to_reallocate_pp'])
    assert f['max_possible_matches']>=max(int(r['matches']) for r in batch)
    if f['format']=='League + best-of-seven': assert f['max_possible_matches']==1097
    f['teams']=group
(OUT/'fairness.json').write_text(json.dumps({'schema_version':1,'formats':fairness,'settings':settings},indent=2)+'\n')
for name in ['championship_shares.csv','fairness_summary.csv']:
    shutil.copyfile(ROOT/'outputs/tournament-comparison'/name,OUT/name)
print('Validated 256 team-format shares, title counts, targets, TV, intervals and hard budgets.')
