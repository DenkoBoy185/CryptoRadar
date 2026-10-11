import CoinData from './CoinData.mjs';
import { renderCoinList } from './CoinList.mjs';
import { setupStarButtons, updateWatchCount } from './Watchlist.mjs';
import { loadHeaderFooter, renderError, renderLoading } from './utils.mjs';

const coinData = new CoinData();
const coinListElement = document.getElementById('coin-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const filterSelect = document.getElementById('filter-select');

let allCoins = [];

async function initDashboard() {
  await loadHeaderFooter('dashboard');
  updateWatchCount();

  renderLoading(coinListElement, 'Loading live prices...');
  try {
    allCoins = await coinData.getTopCoins();
    updateView();
  } catch (error) {
    renderError(coinListElement, error.message);
    return;
  }

  searchInput.addEventListener('input', updateView);
  sortSelect.addEventListener('change', updateView);
  filterSelect.addEventListener('change', updateView);
  setupStarButtons(coinListElement);
}

// apply search + filter + sort together so they don't undo each other
function updateView() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;

  let coins = allCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
  );

  if (filter === 'gainers') {
    coins = coins.filter((coin) => coin.price_change_percentage_24h >= 0);
  } else if (filter === 'losers') {
    coins = coins.filter((coin) => coin.price_change_percentage_24h < 0);
  }

  renderCoinList(sortCoins(coins, sortSelect.value), coinListElement);
}

function sortCoins(coins, sortType) {
  const sorted = [...coins];
  switch (sortType) {
    case 'price_desc':
      return sorted.sort((a, b) => b.current_price - a.current_price);
    case 'price_asc':
      return sorted.sort((a, b) => a.current_price - b.current_price);
    case 'change_desc':
      return sorted.sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
    case 'change_asc':
      return sorted.sort(
        (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
      );
    default:
      return sorted.sort((a, b) => b.market_cap - a.market_cap);
  }
}

initDashboard();
