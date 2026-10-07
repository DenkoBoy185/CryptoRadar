import CoinData from './CoinData.mjs';
import { formatCurrency, formatPercentage } from './utils.mjs';

const coinData = new CoinData();
let allCoins = [];

async function initDashboard() {
  const coinListElement = document.getElementById('coin-list');
  coinListElement.innerHTML = '<p class="loading">Loading live prices...</p>';
  
  allCoins = await coinData.getTopCoins();
  renderCoinList(allCoins);

  document.getElementById('search-input').addEventListener('input', handleSearch);
  document.getElementById('sort-select').addEventListener('change', handleSort);
}

function renderCoinList(coins) {
  const coinListElement = document.getElementById('coin-list');
  coinListElement.innerHTML = '';

  if (coins.length === 0) {
    coinListElement.innerHTML = '<p>No coins found.</p>';
    return;
  }

  const html = coins.map(coin => {
    const isPositive = coin.price_change_percentage_24h > 0;
    const colorClass = isPositive ? 'positive' : 'negative';
    
    return `
      <div class="coin-card">
        <div class="coin-header">
          <img src="${coin.image}" alt="${coin.name} logo" class="coin-icon" />
          <div class="coin-name-group">
            <h2>${coin.name}</h2>
            <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
          </div>
        </div>
        <div class="coin-price-group">
          <p class="coin-price">${formatCurrency(coin.current_price)}</p>
          <p class="coin-change ${colorClass}">${formatPercentage(coin.price_change_percentage_24h)}</p>
        </div>
      </div>
    `;
  }).join('');

  coinListElement.innerHTML = html;
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  const filtered = allCoins.filter(coin => 
    coin.name.toLowerCase().includes(query) || 
    coin.symbol.toLowerCase().includes(query)
  );
  renderCoinList(filtered);
}

function handleSort(event) {
  const sortType = event.target.value;
  let sorted = [...allCoins];

  if (sortType === 'market_cap') {
    sorted.sort((a, b) => b.market_cap - a.market_cap);
  } else if (sortType === 'price_desc') {
    sorted.sort((a, b) => b.current_price - a.current_price);
  } else if (sortType === 'price_asc') {
    sorted.sort((a, b) => a.current_price - b.current_price);
  } else if (sortType === 'change_desc') {
    sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  }

  renderCoinList(sorted);
}

document.addEventListener('DOMContentLoaded', initDashboard);
