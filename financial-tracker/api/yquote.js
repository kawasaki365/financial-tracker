
export default async function handler(req, res) {
  try{
    const { symbols='' } = req.query;
    if(!symbols) return res.status(400).json({error:'symbols is required'});
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await r.json();
    res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate');
    res.status(200).json(data);
  }catch(e){
    res.status(500).json({error:'Failed to fetch Yahoo Finance', details: String(e)});
  }
}
