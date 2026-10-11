const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// CoinGecko's free tier has a low rate limit, so responses are cached
// in sessionStorage for a short time instead of hitting the api on every page.
const CACHE_TIME = 60 * 1000; // 1 minute

async function fetchWithCache(url) {
  const cached = JSON.parse(sessionStorage.getItem(url));
  if (cached && Date.now() - cached.time < CACHE_TIME) {
    return cached.data;
  }

  const response = await fetch(url);
  if (response.status === 429) {
    throw new Error('Too many requests to CoinGecko. Please wait a minute and try again.');
  }
  if (!response.ok) {
    throw new Error(`CoinGecko request failed (${response.status})`);
  }
  const data = await response.json();
  sessionStorage.setItem(url, JSON.stringify({ time: Date.now(), data }));
  return data;
}

export default class CoinData {
  // top coins by market cap for the dashboard
  async getTopCoins(limit = 50) {
    const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=7d`;
    return fetchWithCache(url);
  }

  // market data for a specific list of coins (used by the watchlist)
  async getCoinsByIds(ids) {
    if (!ids.length) return [];
    const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&sparkline=false&price_change_percentage=7d`;
    return fetchWithCache(url);
  }

  // full details for one coin (detail page)
  async getCoinById(id) {
    const url = `${API_BASE_URL}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false`;
    return fetchWithCache(url);
  }
}
