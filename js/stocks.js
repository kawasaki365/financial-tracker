const stockList = document.getElementById('stockList');
const input = document.getElementById('stockInput');
const addBtn = document.getElementById('addStock');
const watch = new Set((localStorage.getItem('watchlist')||'TSLA,AAPL,MSFT,GOOGL,AMZN,NVDA').split(','));

addBtn.addEventListener('click', ()=>{
  const v = (input.value||'').trim().toUpperCase();
  if(!v) return;
  watch.add(v);
  localStorage.setItem('watchlist', Array.from(watch).join(','));
  input.value='';
  load();
});

async function load(){
  document.getElementById('watchCount').textContent = watch.size;
  const symbols = Array.from(watch).join(',');
  try{
    const res = await fetch(`/api/yquote?symbols=${encodeURIComponent(symbols)}`);
    const json = await res.json();
    const rows = json.quoteResponse.result;

    // Indexes
    const idxRes = await fetch(`/api/yquote?symbols=^GSPC,^IXIC`);
    const idxJson = await idxRes.json();
    const idx = idxJson.quoteResponse.result;
    const spx = idx.find(i=>i.symbol==='^GSPC');
    const ndx = idx.find(i=>i.symbol==='^IXIC');
    document.getElementById('spxVal').textContent = spx ? `${fmt(spx.regularMarketPrice)} (${sign(spx.regularMarketChangePercent)})` : '-';
    document.getElementById('ndxVal').textContent = ndx ? `${fmt(ndx.regularMarketPrice)} (${sign(ndx.regularMarketChangePercent)})` : '-';
    document.getElementById('updated').textContent = timeNow();

    render(rows);
  }catch(e){
    stockList.innerHTML = '<div class="row">Failed to load stock data.</div>';
    console.error(e);
  }
}

function render(rows){
  stockList.innerHTML='';
  rows.forEach(r=>{
    const change = r.regularMarketChangePercent;
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div class="rowHeader">
        <div class="title">
          <span>${r.shortName||r.longName||r.symbol}</span>
          <span class="ticker">${r.symbol} · ${r.exchange||''}</span>
        </div>
        <div class="price">$${fmt(r.regularMarketPrice)}</div>
      </div>
      <div class="meta">
        <div class="chg ${chgClass(change)}">${sign(change||0)}</div>
        <div>Market Cap: ${r.marketCap ? '$'+fmt(r.marketCap,0) : '-'}</div>
        <div>Day Range: ${fmt(r.regularMarketDayLow)} - ${fmt(r.regularMarketDayHigh)}</div>
        <div>Prev Close: ${fmt(r.regularMarketPreviousClose)}</div>
      </div>
    `;
    stockList.appendChild(row);
  });
}

load();
setInterval(load, 60*1000);
