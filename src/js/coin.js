import CoinData from './CoinData.mjs';
import CoinDetail from './CoinDetail.mjs';
import { updateWatchCount } from './Watchlist.mjs';
import { getParam, loadHeaderFooter, renderError, renderLoading } from './utils.mjs';

const container = document.getElementById('coin-detail');

async function initCoinPage() {
  await loadHeaderFooter('dashboard');
  updateWatchCount();

  const coinId = getParam('id');
  if (!coinId) {
    renderError(container, 'No coin was selected. Go back to the dashboard and pick one.');
    return;
  }

  renderLoading(container, 'Loading coin details...');
  try {
    const detail = new CoinDetail(coinId, new CoinData(), container);
    await detail.init();
  } catch (error) {
    renderError(container, error.message);
  }
}

initCoinPage();
