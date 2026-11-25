import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runFormat,swissPairing} from './formats.js';
import blossom from './vendor/blossom.js';
const read=f=>JSON.parse(fs.readFileSync(new URL(f,import.meta.url)));
const teams=read('./data/teams.json').teams,data=read('./data/fairness.json');
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function rng(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};}
for(const f of data.formats){assert.equal(f.teams.length,32);assert.equal(f.teams.reduce((s,t)=>s+t.championships,0),f.simulations);near(f.teams.reduce((s,t)=>s+t.target_share,0),1);near(.5*f.teams.reduce((s,t)=>s+Math.abs(t.observed_share-t.target_share),0),f.tv_distance);near(100*f.tv_distance,f.probability_to_reallocate_pp);for(const t of f.teams){near(t.observed_share,t.championships/t.simulations);if(!t.championships)assert.ok(t.share_ci_high>0);}}
assert.equal(data.formats.find(f=>f.format==='League + best-of-seven').max_possible_matches,1097);
for(let seed=1;seed<=8;seed++)for(const family of ['knockout','worldcup','league','playoffs','swiss']){
 const x=runFormat(teams,{family,rounds:9,seeded:seed%2===0},rng(seed));assert.ok(x.champion>=0&&x.champion<32);assert.equal(x.matches,x.allMatches.length);
 if(family==='knockout')assert.equal(x.matches,31);if(family==='worldcup'){assert.equal(x.matches,63);for(const g of x.stages[0].groups)assert.equal(new Set(g.order.map(t=>Math.floor(t.id/8))).size,4);}
 if(family==='league'||family==='playoffs'){const counts=new Map();x.stages[0].games.forEach(m=>{const k=[m.a,m.b].sort((a,b)=>a-b).join(',');counts.set(k,(counts.get(k)||0)+1);});assert.equal(counts.size,496);assert.ok([...counts.values()].every(n=>n===2));}
 if(family==='league')assert.equal(x.matches,992);
 if(family==='playoffs'){assert.ok(x.matches>=1052&&x.matches<=1097);for(const s of x.stages.filter(s=>s.type==='matches'))for(const g of s.games){assert.equal(Math.max(...g.wins),4);assert.equal(g.series.length,g.wins[0]+g.wins[1]);}}
 if(family==='swiss'){assert.equal(x.matches,144);assert.equal(new Set(x.allMatches.map(m=>[m.a,m.b].sort((a,b)=>a-b).join(','))).size,144);for(const s of x.stages.filter(s=>s.type==='matches'))assert.equal(new Set(s.games.flatMap(m=>[m.a,m.b])).size,32);}
}
for(const rounds of [1,5,7,15])assert.equal(runFormat(teams,{family:'swiss',rounds},rng(rounds)).matches,rounds*16);
// Compare the vendored weighted matching against exhaustive small perfect matchings.
for(let seed=1;seed<=40;seed++){
 const r=rng(seed),edges=[],w=Array.from({length:8},()=>Array(8).fill(-Infinity));
 for(let a=0;a<8;a++)for(let b=a+1;b<8;b++){const v=32-(Math.floor(r()*5)+r()/33);edges.push([a,b,v]);w[a][b]=w[b][a]=v;}
 function best(ids){if(!ids.length)return 0;const [a,...rest]=ids;return Math.max(...rest.map((b,j)=>w[a][b]+best(rest.filter((_,k)=>k!==j))));}
 const mate=blossom(edges,true),value=mate.reduce((s,b,a)=>s+(a<b?w[a][b]:0),0);near(value,best([0,1,2,3,4,5,6,7]),1e-8);
}
const occupied=new Set();for(let b=1;b<32;b++)occupied.add(`0,${b}`);assert.throws(()=>swissPairing(Array(32).fill(0),occupied,rng(1)),/No full/);
console.log('Verified all 256 shares/TV, hard budgets, five demo families, Swiss no-rematch rounds, infeasible pairing errors and weighted matching against exhaustive solutions.');
