const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export default class CoinData {
  constructor() {}

  async getTopCoins(limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`);
      if (!response.ok) {
        throw new Error('Failed to fetch coin data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data from CoinGecko:', error);
      return [];
    }
  }

  async searchCoins(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to search coins');
      }
      const data = await response.json();
      return data.coins;
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  }
}
