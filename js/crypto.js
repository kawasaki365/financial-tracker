const listEl = document.getElementById('cryptoList');
const searchEl = document.getElementById('searchCrypto');

async function loadCrypto(){
  try{
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d';
    const res = await fetch(url);
    const data = await res.json();

    // KPIs
    let cap = 0, vol=0, avg=0;
    data.forEach(c=>{ cap+=c.market_cap||0; vol+=c.total_volume||0; avg += c.price_change_percentage_24h||0; });
    document.getElementById('cap').textContent = '$' + fmt(cap,0);
    document.getElementById('vol').textContent = '$' + fmt(vol,0);
    document.getElementById('avgchg').textContent = sign(avg/data.length);
    document.getElementById('updated').textContent = timeNow();

    render(data);
  }catch(e){
    listEl.innerHTML = '<div class="row">Failed to load crypto data. Try again later.</div>';
    console.error(e);
  }
}

function render(rows){
  const q = (searchEl?.value||'').trim().toLowerCase();
  listEl.innerHTML = '';
  rows
    .filter(r => !q || r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
    .forEach(r=>{
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `
        <div class="rowHeader">
          <div class="title">
            <span>${r.name}</span>
            <span class="ticker">${r.symbol.toUpperCase()}</span>
          </div>
          <div class="price">$${fmt(r.current_price)}</div>
        </div>
        <div class="meta">
          <div class="chg ${chgClass(r.price_change_percentage_24h)}">24h ${sign(r.price_change_percentage_24h||0)}</div>
          <div>MC: $${fmt(r.market_cap)}</div>
          <div>Vol: $${fmt(r.total_volume)}</div>
        </div>
      `;
      listEl.appendChild(row);
    });
}

searchEl?.addEventListener('input', ()=>loadCrypto());
loadCrypto();
setInterval(loadCrypto, 60*1000);
