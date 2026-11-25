export const sum = values => values.reduce((a,b)=>a+b,0);
export function rank(counts,index){return sum(counts)>0 ? 1+counts.filter(n=>n>counts[index]).length : null;}
export function share(counts,index){const total=sum(counts);return total ? counts[index]/total : null;}
export function gini(counts){const total=sum(counts);if(!total)return null;return counts.reduce((a,x)=>a+counts.reduce((b,y)=>b+Math.abs(x-y),0),0)/(2*counts.length*total);}
export function discrepancy(a,b){return sum(a.map((_,i)=>Math.abs(share(a,i)-share(b,i))))/a.length;}
const near=(a,b)=>Math.abs(a-b)<1e-10;
function require(ok,message){if(!ok)throw new Error(message);}
export function validateMain(d){
 require(d.schema_version===1&&d.experiment==='musiclab-v1','Unsupported Music Lab dataset');
 require(d.songs.length===48&&d.song_ids.length===48&&new Set(d.song_ids).size===48,'Expected 48 unique songs');
 require(d.worlds.length===9&&d.independent_world_id===9&&d.participants===7149,'Unexpected study scope');
 require(sum(d.worlds.map(w=>w.participants))===7149,'Participant total mismatch');
 require(d.worlds.filter(w=>w.condition==='social').length===8,'Expected eight social worlds');
 d.worlds.forEach((w,i)=>{require(w.world===i+1,'World order mismatch');require(w.counts.length===48&&w.shares.length===48&&w.ranks.length===48,'World vector mismatch');require(sum(w.counts)===w.downloads,'Download total mismatch');w.counts.forEach((n,j)=>{require(Number.isInteger(n)&&n>=0,'Invalid count');require(near(share(w.counts,j),w.shares[j])&&rank(w.counts,j)===w.ranks[j],'Share/rank mismatch');});});
 require(d.songs.every((s,i)=>s.song_id===d.song_ids[i]),'Song order mismatch');
 require(d.independent_splits.gini.length===1000&&d.independent_splits.unpredictability.length===1000&&d.social_pairs.length===28,'Split or pair count mismatch');
 return d;
}
export function validateHistory(h,d){
 require(h.schema_version===1&&h.dates.length===69&&h.dates[0]===null,'Unexpected history schema');
 require(JSON.stringify(h.song_ids)===JSON.stringify(d.song_ids)&&h.worlds.length===9,'History ordering mismatch');
 require(h.dates[1]==='2004-10-07'&&h.dates.at(-1)==='2004-12-13','Unexpected retained dates');
 h.worlds.forEach((w,i)=>{require(w.world===d.worlds[i].world&&w.counts.length===69,'History world mismatch');w.counts.forEach((v,t)=>{require(v.length===48,'History vector mismatch');v.forEach((n,j)=>require(Number.isInteger(n)&&n>=0&&(t?n>=w.counts[t-1][j]:n===0),'History is not monotone from zero'));});require(JSON.stringify(w.counts.at(-1))===JSON.stringify(d.worlds[i].counts),'History final mismatch');});return h;
}
export function validateSplits(s,d){require(s.schema_version===1&&s.splits.length===12,'Unexpected saved splits');s.splits.forEach((v,i)=>{require(v.split===i+1&&v.sizes[0]===720&&v.sizes[1]===721,'Split sizes mismatch');require(v.counts_a.length===48&&v.counts_b.length===48,'Split vector mismatch');require(v.counts_a.every((n,j)=>n+v.counts_b[j]===d.worlds[8].counts[j]),'Split totals mismatch');require(near(gini(v.counts_a),v.gini_a)&&near(v.gini_a,d.independent_splits.gini[i]),'Split Gini mismatch');require(near(discrepancy(v.counts_a,v.counts_b),v.u)&&near(v.u,d.independent_splits.unpredictability[i]),'Split discrepancy mismatch');});return s;}
