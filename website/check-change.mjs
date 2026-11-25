import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const d=JSON.parse(readFileSync(new URL('./data/change-real/experiments.json',import.meta.url)));
assert.equal(d.schema_version,1);assert.equal(d.experiment,'is-the-change-real');assert.equal(d.parts.length,5);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
for(const p of d.parts){assert.equal(p.settings.repetitions,20000);for(const key of ['metrics','null_metrics','power_metrics'])for(const r of p[key]??[]){const rate=r.false_positive_pct??r.rejection_pct??r.rate_pct;near(rate,100*(r.false_positives??r.rejections)/r.repetitions);assert.ok(r.mc_low_pct<=rate&&rate<=r.mc_high_pct);}}
const p=d.parts;
assert.equal(p[0].metrics.find(r=>r.test==='Student'&&r.scenario.startsWith('2')).false_positive_pct,28.07);
const pairs=p[1].example_pairs;for(let i=0;i<30;i++)near(pairs[i].difference,pairs[i+30].difference);
for(const r of pairs)near(r.after-r.before,r.difference);
near(p[2].population_truth[1].mean_lift_pct,40);near(p[2].population_truth[2].mean_lift_pct,40);
for(let k=2;k<=10;k++){const rows=p[3].null_metrics.filter(r=>r.groups===k);assert.equal(rows.length,3);rows.forEach(r=>assert.equal(r.comparisons,k*(k-1)/2));}
assert.equal(p[3].null_metrics.find(r=>r.groups===10&&r.method==='Uncorrected pairs').rate_pct,63.12);
for(const scenario of ['Plentiful counts','Sparse counts']){const cells=p[4].illustrative_tables.filter(r=>r.scenario===scenario),total=cells.reduce((s,r)=>s+r.observed,0);for(const cell of cells){const row=cells.filter(r=>r.group===cell.group).reduce((s,r)=>s+r.observed,0),col=cells.filter(r=>r.outcome===cell.outcome).reduce((s,r)=>s+r.observed,0);near(cell.expected,row*col/total);}}
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');assert.ok(html.indexOf('class="experiment-card change-card"')<html.indexOf('class="experiment-card" href="tournament.html"'));
console.log('Five-part data, rate/interval consistency, paired differences, mean lifts, all slider settings, expected cells and first gallery position verified.');
