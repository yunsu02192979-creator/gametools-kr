const GameTools = (() => {
  const GAMES = {
    valorant: { name: 'VALORANT', yaw: 0.07 },
    cs2: { name: 'Counter-Strike 2', yaw: 0.022 },
    apex: { name: 'Apex Legends', yaw: 0.022 },
    overwatch2: { name: 'Overwatch 2', yaw: 0.0066 },
  };
  function validPositive(value){ const n=Number(value); return Number.isFinite(n)&&n>0?n:null; }
  function format(value,max=4){ return new Intl.NumberFormat('en-US',{maximumFractionDigits:max}).format(value); }
  function edpi(dpi,sens){ return dpi*sens; }
  function cm360(gameId,dpi,sens){ const g=GAMES[gameId]; return g ? 2.54*360/(dpi*sens*g.yaw) : null; }
  function sensitivityForCm360(gameId,dpi,cm){ const g=GAMES[gameId]; return g ? 2.54*360/(dpi*cm*g.yaw) : null; }
  function convert(sourceId,targetId,sourceDpi,sourceSens,targetDpi){ const s=GAMES[sourceId],t=GAMES[targetId]; return s&&t ? (sourceDpi*sourceSens*s.yaw)/(targetDpi*t.yaw) : null; }
  async function copy(text,button,success='Copied'){
    try{ await navigator.clipboard.writeText(text); const old=button.textContent; button.textContent=success; setTimeout(()=>button.textContent=old,1200); }
    catch{ button.textContent='Copy failed'; setTimeout(()=>button.textContent='Try again',1200); }
  }
  return {GAMES,validPositive,format,edpi,cm360,sensitivityForCm360,convert,copy};
})();
