import {share,validateMain,validateSplits} from './musiclab-data.js';
const $=s=>document.querySelector(s);
const f=(n,d=2)=>n===null?'—':Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=n=>n===null?'—':f(n*100)+'%';
const base='data/musiclab-v1/';
let data,splits,songIndex=0,revealed=false,splitIndex=0;
async function json(name){const r=await fetch(base+name);if(!r.ok)throw new Error(`Could not load ${name}`);return r.json();}
try{
 data=validateMain(await json('v1.json'));
 splits=validateSplits(await json('split_examples.json'),data);
 songIndex=data.song_ids.indexOf(data.example.song_id);
 $('#song-select').innerHTML=data.songs.map(s=>`<option value="${s.song_id}">${esc(s.title)} — ${esc(s.artist)}</option>`).join('');
 $('#song-select').value=data.song_ids[songIndex];
 $('#music-content').hidden=false;$('#music-loading').hidden=true;
 renderSong();renderResults();renderSplit();
}catch(e){$('#music-loading').textContent='The prepared Music Lab data could not be loaded or validated. Refresh to try again. Methods and downloadable results are still available below.';console.error(e);}
function renderSong(){const s=data.songs[songIndex];$('#selected-title').textContent=s.title;$('#selected-artist').textContent=`by ${s.artist}`;
 $('#song-range').innerHTML=revealed?`<strong>#${s.social_min_rank}–#${s.social_max_rank}</strong><span>across the eight worlds</span>`:'One song.<br>Eight different audiences.';
 $('#world-cards').innerHTML=data.worlds.slice(0,8).map(w=>`<div class="world-tile ${revealed?'revealed':'covered'}" ${revealed?`style="animation-delay:${(w.world-1)*45}ms"`:''}><span>WORLD ${w.world}</span><strong>${revealed?'#'+w.ranks[songIndex]:'?'}</strong><small>${revealed?pct(w.shares[songIndex])+' share':'waiting to reveal'}</small>${revealed?`<i style="width:${w.shares[songIndex]/Math.max(...data.worlds.flatMap(v=>v.shares))*100}%"></i>`:''}</div>`).join('');
 $('#reveal').disabled=revealed;$('#reveal').textContent=revealed?'Eight worlds revealed':'Reveal the eight worlds';
 $('#song-note').textContent=(s.song_id===data.example.song_id?'“gnaw” was chosen after seeing the data because it has the largest rank span. It’s an illustration, not an independent test. ':'Explore any of the 48 songs. The conclusions below use all of them. ')+(revealed?'Lower rank is better; ties share a rank. Shares matter too: a ten-place change has no fixed share meaning. Bars use the same share scale across songs and worlds.':'Reveal the outcomes, then try another song.');
 const c=data.worlds[8];$('#appeal').innerHTML=`Without popularity information: <b>#${c.ranks[songIndex]}</b> with <b>${pct(c.shares[songIndex])}</b> of downloads in the full independent group. An appeal benchmark, not objective quality.`;
 $('#song-table').innerHTML=data.worlds.map(w=>`<tr><td>${w.world===9?'Independent (full group)':'Social world '+w.world}</td><td>${revealed||w.world===9?w.ranks[songIndex]:'Not revealed'}</td><td>${revealed||w.world===9?pct(w.shares[songIndex]):'—'}</td><td>${revealed||w.world===9?w.counts[songIndex]:'—'}</td></tr>`).join('');
}
$('#song-select').onchange=()=>{songIndex=data.song_ids.indexOf($('#song-select').value);renderSong();renderSplit();};
$('#reveal').onclick=()=>{revealed=true;renderSong();};
function renderSplit(){const s=splits.splits[splitIndex],a=share(s.counts_a,songIndex),b=share(s.counts_b,songIndex),max=Math.max(a,b,.01);$('#split-title').textContent=`Split ${s.split} of 12 saved examples`;
 $('#split-song').innerHTML=`<div class="split-song-name">Your song: <strong>${esc(data.songs[songIndex].title)}</strong> · share within each half</div>${[['Half A',a],['Half B',b]].map(([label,value])=>`<div class="split-bar-row"><span>${label}</span><div class="split-bar-track"><i style="width:${value/max*100}%"></i></div><b>${pct(value)}</b></div>`).join('')}<p class="small">This song differs by ${f(Math.abs(a-b)*100,3)} percentage points between halves.</p>`;
 $('#split-metric').innerHTML=`Across all 48 songs: <strong>${f(s.u*100,3)} pp</strong> average difference`;
 $('#split-gini').innerHTML=`Half A Gini: <strong>${f(s.gini_a,3)}</strong>`;
}
$('#next-split').onclick=()=>{splitIndex=(splitIndex+1)%splits.splits.length;renderSplit();};
function histogram(target,values,markers,{min,max,mean,label,ticks}){const compact=$(target).clientWidth<400,W=compact?360:470,H=285,L=30,R=18,T=30,B=55,n=22,bins=Array(n).fill(0),x=v=>L+(v-min)/(max-min)*(W-L-R);values.forEach(v=>bins[Math.max(0,Math.min(n-1,Math.floor((v-min)/(max-min)*n)))]++);const peak=Math.max(...bins);let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}. Histogram of ${values.length} independent partitions with ${markers.length} social markers."><text x="${L}" y="15">1,000 independent splits</text>`;
 bins.forEach((count,i)=>{let height=count/peak*135;svg+=`<rect x="${x(min+i/n*(max-min))}" y="${H-B-height}" width="${(W-L-R)/n-1}" height="${height}" fill="#b8cbb3"><title>${count} partitions · ${f(min+i/n*(max-min),3)}–${f(min+(i+1)/n*(max-min),3)}</title></rect>`;});
 svg+=`<line x1="${x(mean)}" x2="${x(mean)}" y1="${T+15}" y2="${H-B}" stroke="#174d3c" stroke-dasharray="4 3" stroke-width="2"/><text x="${x(mean)+5}" y="${T+28}" fill="#174d3c">Mean ${f(mean,3)}</text>`;
 markers.forEach((m,i)=>{const y=H-B-12-(i%4)*12;svg+=`<circle cx="${x(m.value)}" cy="${y}" r="4" fill="#8361b2" stroke="#f8faf6"><title>${esc(m.name)}: ${f(m.value,4)}</title></circle>`;});
 svg+=`<line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="#9cad9b"/>`;(compact?ticks.filter((v,i)=>i%2===0||i===ticks.length-1):ticks).forEach(v=>svg+=`<text x="${x(v)}" y="${H-B+22}" text-anchor="middle">${f(v,2)}</text>`);svg+=`<text x="${W/2}" y="${H-7}" text-anchor="middle">${compact?(target==='#gini-chart'?'Gini (concentration)':'Share difference (pp)'):label}</text></svg>`;$(target).innerHTML=svg;
}
function renderResults(){const m=data.metrics;$('#gini-independent').textContent=f(m.independent_gini_mean,3);$('#gini-social').textContent=f(m.social_gini_mean,3);$('#u-independent').textContent=f(m.independent_u_mean*100,3)+' pp';$('#u-social').textContent=f(m.social_u_mean*100,3)+' pp';$('#u-ratio').innerHTML=`Social-world pairs differed by <strong>${f(m.u_ratio,2)}×</strong> as much, on average, by this measure.`;
 histogram('#gini-chart',data.independent_splits.gini,data.worlds.slice(0,8).map(w=>({name:'World '+w.world,value:w.gini})),{min:.18,max:.45,mean:m.independent_gini_mean,label:'Gini · greater concentration to the right',ticks:[.2,.25,.3,.35,.4,.45]});
 histogram('#u-chart',data.independent_splits.unpredictability.map(n=>n*100),data.social_pairs.map(p=>({name:`Worlds ${p.world_a} & ${p.world_b}`,value:p.unpredictability*100})),{min:.2,max:1.2,mean:m.independent_u_mean*100,label:'Mean absolute share difference (pp)',ticks:[.2,.4,.6,.8,1,1.2]});
 $('#gini-table').innerHTML=`<tr><td>Independent split mean</td><td>720 per half used</td><td>${f(m.independent_gini_mean,6)}</td></tr>`+data.worlds.map(w=>`<tr><td>${w.world===9?'Full independent (not split baseline)':'Social world '+w.world}</td><td>${f(w.participants,0)}</td><td>${f(w.gini,6)}</td></tr>`).join('');
 $('#pair-table').innerHTML=data.social_pairs.map(p=>`<tr><td>World ${p.world_a} & world ${p.world_b}</td><td>${f(p.unpredictability*100,6)}</td></tr>`).join('');
}
// Open the disclosure when arriving via the visible replication-note link.
function openMethod(){if(location.hash==='#replication')$('#replication').open=true;}
window.addEventListener('hashchange',openMethod);openMethod();
$('#read-replication').onclick=()=>{$('#replication').open=true;$('#replication').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
new ResizeObserver(()=>{if(data)renderResults();}).observe($('#gini-chart'));

