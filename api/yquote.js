import fs from 'fs';
import path from 'path';

// Load mock quotes to allow offline development
const mockPath = path.join(process.cwd(), 'data', 'mockQuotes.json');
const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));

export default async function handler(req, res) {
  const { symbols = '' } = req.query;
  if (!symbols) return res.status(400).json({ error: 'symbols is required' });
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    res.status(200).json(data);
  } catch (e) {
    // Fallback to local mock data if Yahoo Finance is unreachable
    const requested = symbols.split(',').map(s => s.trim());
    const result = mockData.quoteResponse.result.filter(q => requested.includes(q.symbol));
    res.status(200).json({ quoteResponse: { result, error: null }, fallback: true });
  }
}
