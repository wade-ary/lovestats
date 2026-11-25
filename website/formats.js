import blossom from './vendor/blossom.js';
import {seedOrder,probability} from './simulation.js';
export function shuffle(ids,rng){const a=[...ids];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function swissPairing(wins,played,rng){const edges=[];for(let a=0;a<32;a++)for(let b=a+1;b<32;b++)if(!played.has(`${a},${b}`)){const cost=Math.abs(wins[a]-wins[b])+rng()/33;edges.push([a,b,32-cost]);}const mate=blossom(edges,true);if(mate.length!==32||mate.some(v=>v<0))throw Error('No full rematch-free Swiss pairing exists. Choose fewer rounds.');return mate.flatMap((b,a)=>a<b?[[a,b]]:[]);}
export function runFormat(teams,{family='knockout',seeded=true,rounds=5}={},rng=Math.random){
 const ids=teams.map((_,i)=>i),stages=[],allMatches=[];
 const match=(a,b)=>{const p=probability(teams[a],teams[b]),winner=rng()<p?a:b;const m={a,b,p,winner};allMatches.push(m);return m;};
 const standings=(group,wins)=>group.map(id=>({id,wins:wins[id],lot:rng()})).sort((a,b)=>b.wins-a.wins||a.lot-b.lot);
 const seededBracket=order=>seedOrder(order.length).map(s=>order[s-1]);
 const knockout=(bracket,bestOf=1)=>{let remaining=bracket;while(remaining.length>1){const games=[],advanced=[];for(let i=0;i<remaining.length;i+=2){const a=remaining[i],b=remaining[i+1],wins=[0,0],series=[];while(Math.max(...wins)<(bestOf+1)/2){const m=match(a,b);series.push(m);wins[m.winner===a?0:1]++;}const winner=wins[0]>wins[1]?a:b;games.push({a,b,winner,p:probability(teams[a],teams[b]),wins,series});advanced.push(winner);}stages.push({label:remaining.length===2?'Final':remaining.length===4?'Semifinals':remaining.length===8?'Quarterfinals':`Round of ${remaining.length}`,type:'matches',games,bestOf});remaining=advanced;}return remaining[0];};
 const league=(group,repeats)=>{const wins=Array(32).fill(0),games=[];for(let rep=0;rep<repeats;rep++)for(let a=0;a<group.length;a++)for(let b=a+1;b<group.length;b++){const m=match(group[a],group[b]);wins[m.winner]++;games.push(m);}return {order:standings(group,wins),games};};
 let champion;
 if(family==='knockout')champion=knockout(seeded?seededBracket(ids):shuffle(ids,rng));
 else if(family==='worldcup'){
  const pots=[0,8,16,24].map(i=>shuffle(ids.slice(i,i+8),rng)),groups=Array.from({length:8},(_,i)=>pots.map(p=>p[i])),tables=groups.map(g=>league(g,1));stages.push({label:'Group stage',type:'groups',groups:tables});const q=tables.map(t=>t.order.map(r=>r.id)),bracket=[];for(const g of [0,2,4,6])bracket.push(q[g][0],q[g+1][1]);for(const g of [0,2,4,6])bracket.push(q[g+1][0],q[g][1]);champion=knockout(bracket);
 }else if(family==='league'||family==='playoffs'){
  const table=league(ids,2);stages.push({label:'League standings',type:'standings',...table});champion=family==='league'?table.order[0].id:knockout(seededBracket(table.order.slice(0,16).map(r=>r.id)),7);
 }else if(family==='swiss'){
  if(!Number.isInteger(rounds)||rounds<1||rounds>15)throw Error('Choose 1–15 Swiss rounds.');
  const wins=Array(32).fill(0),played=new Set();for(let r=1;r<=rounds;r++){const pairing=swissPairing(wins,played,rng),games=pairing.map(([a,b])=>{played.add(`${a},${b}`);const m=match(a,b);wins[m.winner]++;return m;});stages.push({label:`Swiss round ${r}`,type:'matches',games,bestOf:1});}
  const order=standings(ids,wins);stages.push({label:'Final standings',type:'standings',order});champion=order[0].id;
 }else throw Error('Unknown format');
 stages.push({label:'Champion',type:'champion',champion});return {stages,champion,matches:allMatches.length,allMatches,config:{family,seeded,rounds}};
}
