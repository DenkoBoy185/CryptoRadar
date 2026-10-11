import CoinData from './CoinData.mjs';
import { renderCoinList } from './CoinList.mjs';
import { getWatchlist, setupStarButtons, updateWatchCount } from './Watchlist.mjs';
import { loadHeaderFooter, renderError, renderLoading } from './utils.mjs';

const container = document.getElementById('watchlist');
const EMPTY_MESSAGE =
  'Your watchlist is empty. Tap the ☆ on any coin in the dashboard to save it here.';

async function initWatchlistPage() {
  await loadHeaderFooter('watchlist');
  updateWatchCount();

  const ids = getWatchlist();
  if (!ids.length) {
    renderCoinList([], container, EMPTY_MESSAGE);
    return;
  }

  renderLoading(container, 'Loading your watchlist...');
  try {
    const coins = await new CoinData().getCoinsByIds(ids);
    renderCoinList(coins, container, EMPTY_MESSAGE);
  } catch (error) {
    renderError(container, error.message);
    return;
  }

  // when a coin is un-starred here, animate it out of the list
  setupStarButtons(container, (coinId, nowSaved) => {
    if (nowSaved) return;
    const card = container.querySelector(`.star-btn[data-id="${coinId}"]`).closest('.coin-card');
    card.classList.add('removing');
    card.addEventListener('animationend', () => {
      card.remove();
      if (!container.querySelector('.coin-card')) {
        renderCoinList([], container, EMPTY_MESSAGE);
      }
    });
  });
}

initWatchlistPage();
