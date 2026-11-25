export function seedOrder(size) {
  let order = [1, 2];
  while (order.length < size) {const total = 2 * order.length + 1; order = order.flatMap(s => [s, total - s]);}
  return order;
}
export function probability(a,b) {return 1/(1+10**(-(a.rating_points-b.rating_points)/600));}
export function tournament(teams, mode, random = Math.random) {
  let bracket = mode === 'seeded' ? seedOrder(32).map(s=>teams[s-1]) : [...teams];
  if(mode==='random') for(let i=bracket.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bracket[i],bracket[j]]=[bracket[j],bracket[i]];}
  const rounds=[];
  while(bracket.length>1){const matches=[];for(let i=0;i<bracket.length;i+=2){const a=bracket[i],b=bracket[i+1],p=probability(a,b),winner=random()<p?a:b;matches.push({a,b,p,winner});}rounds.push(matches);bracket=matches.map(m=>m.winner);}
  return {rounds,champion:bracket[0],gap:teams[0].rating_points-bracket[0].rating_points};
}
