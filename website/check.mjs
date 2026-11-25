import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {seedOrder,probability,tournament} from './simulation.js';
const teams=JSON.parse(readFileSync(new URL('./data/teams.json',import.meta.url))).teams;
const order=seedOrder(32);
assert.equal(new Set(order).size,32);
for(let i=0;i<32;i+=2)assert.equal(order[i]+order[i+1],33);
assert.notEqual(Math.floor(order.indexOf(1)/16),Math.floor(order.indexOf(2)/16));
assert.equal(new Set([1,2,3,4].map(s=>Math.floor(order.indexOf(s)/8))).size,4);
assert.equal(probability(teams[0],teams[0]),.5);
assert.ok(Math.abs(probability(teams[0],teams[1])-.5367271222516323)<1e-14);
for(const mode of ['seeded','random']){
 const run=tournament(teams,mode,()=>.4);
 assert.equal(run.rounds.flat().length,31);
 assert.deepEqual(run.rounds.map(r=>r.length),[16,8,4,2,1]);
 assert.equal(new Set(run.rounds[0].flatMap(m=>[m.a,m.b])).size,32);
 for(let r=1;r<5;r++)assert.deepEqual(run.rounds[r].flatMap(m=>[m.a,m.b]),run.rounds[r-1].map(m=>m.winner));
 assert.equal(run.champion,run.rounds[4][0].winner);
 assert.equal(run.gap,teams[0].rating_points-run.champion.rating_points);
}
console.log('Verified bracket seeding, probability, 31-match histories and champion gaps.');
