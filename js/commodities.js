const cmdList = document.getElementById('cmdList');
async function load(){
  try{
    const syms = 'GC=F,SI=F,CL=F,NG=F,HG=F,PL=F,PA=F,ZO=F,ZC=F,ZS=F';
    const res = await fetch(`/api/yquote?symbols=${encodeURIComponent(syms)}`);
    const json = await res.json();
    const rows = json.quoteResponse.result;

    function setVal(id, sym){
      const item = rows.find(r=>r.symbol===sym);
      const el = document.getElementById(id);
      if(el && item){
        el.textContent = `${fmt(item.regularMarketPrice)} (${sign(item.regularMarketChangePercent)})`;
      }
    }
    setVal('gold','GC=F'); setVal('oil','CL=F'); setVal('silver','SI=F'); setVal('gas','NG=F');

    cmdList.innerHTML = '';
    rows.forEach(r=>{
      const row = document.createElement('div');
      row.className='row';
      row.innerHTML = `
        <div class="rowHeader">
          <div class="title"><span>${r.shortName||r.symbol}</span><span class="ticker">${r.symbol}</span></div>
          <div class="price">${fmt(r.regularMarketPrice)}</div>
        </div>
        <div class="meta">
          <div class="chg ${chgClass(r.regularMarketChangePercent)}">${sign(r.regularMarketChangePercent||0)}</div>
          <div>Prev Close: ${fmt(r.regularMarketPreviousClose)}</div>
          <div>Day Range: ${fmt(r.regularMarketDayLow)} - ${fmt(r.regularMarketDayHigh)}</div>
        </div>
      `;
      cmdList.appendChild(row);
    });

  }catch(e){
    cmdList.innerHTML = '<div class="row">Failed to load commodity data.</div>';
    console.error(e);
  }
}
load();
setInterval(load, 60*1000);
