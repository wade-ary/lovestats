"""Prepare website-only copies of Experiment 3. No simulations are rerun."""
import csv, json, math, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent
SOURCE=ROOT.parent/'experiment3-is-the-change-real'/'outputs'
DEST=ROOT/'data/change-real'
DEST.mkdir(parents=True,exist_ok=True)
folders=['01-student-vs-welch','02-paired-before-after','03-skew-means-and-ranks','04-anova-and-multiple-comparisons','05-chi-square-and-fisher']
files=[['metrics.csv','example_samples.csv'],['metrics.csv','example_pairs.csv'],['metrics.csv','population_truth.csv'],['null_metrics.csv','power_metrics.csv','slider_all_pairs.json'],['metrics.csv','diagnostics.csv','illustrative_tables.csv','scenario_settings.csv']]
def rows(path):
 with path.open() as f: result=list(csv.DictReader(f))
 for row in result:
  for k,v in row.items():
   try: row[k]=float(v)
   except ValueError: pass
 return result
bundle={'schema_version':1,'experiment':'is-the-change-real','parts':[]}
for folder,names in zip(folders,files):
 out=DEST/folder;out.mkdir(exist_ok=True)
 settings=json.loads((SOURCE/folder/'settings.json').read_text())
 part={'id':folder,'settings':settings}
 for name in ['settings.json',*names]:
  src=SOURCE/folder/name;shutil.copyfile(src,out/name)
  if name=='settings.json':continue
  part[Path(name).stem]=json.loads(src.read_text()) if name.endswith('.json') else rows(src)
  if 'metrics' in name:
   for r in part[Path(name).stem]:
    n=r['repetitions'];hits=r.get('rejections',r.get('false_positives'));rate=r.get('rate_pct',r.get('rejection_pct',r.get('false_positive_pct')))
    assert n==20000 and math.isclose(rate,100*hits/n,abs_tol=1e-10)
    assert 0<=r['mc_low_pct']<=rate<=r['mc_high_pct']<=100
 bundle['parts'].append(part)
# Deterministic population density curves, not new simulated observations.
s=bundle['parts'][2]['settings']
xs=[math.exp(math.log(.5)+i/179*(math.log(2000)-math.log(.5))) for i in range(180)]
def density(x,k=1):return math.exp(-((math.log(x/k)-math.log(s['median']))/s['log_sd'])**2/2)/(x*s['log_sd']*math.sqrt(2*math.pi))
bundle['parts'][2]['density']=[{'dollars':x,'a':density(x),'broad':density(x,s['broad_factor']),'rare':(1-s['tail_probability'])*density(x)+s['tail_probability']*density(x,s['tail_factor'])} for x in xs]
shutil.copyfile(SOURCE/folders[3]/'within_vs_between.png',DEST/folders[3]/'within_vs_between.png')
(DEST/'experiments.json').write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n')
print('Prepared five comparisons; verified every saved metric and interval. Original research unchanged.')
