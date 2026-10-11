import { formatCurrency, formatPercentage, changeClass } from './utils.mjs';
import { starButtonTemplate } from './Watchlist.mjs';

// card used on the dashboard and on the watchlist page
export function coinCardTemplate(coin) {
  const change = coin.price_change_percentage_24h;
  return `
    <article class="coin-card">
      <div class="coin-header">
        <a class="coin-link" href="${import.meta.env.BASE_URL}coin/?id=${coin.id}">
          <img src="${coin.image}" alt="${coin.name} logo" class="coin-icon" width="40" height="40" loading="lazy" />
          <span class="coin-name-group">
            <span class="coin-name">${coin.name}</span>
            <span class="coin-symbol">#${coin.market_cap_rank ?? '-'} · ${coin.symbol.toUpperCase()}</span>
          </span>
        </a>
        ${starButtonTemplate(coin)}
      </div>
      <div class="coin-price-group">
        <p class="coin-price">${formatCurrency(coin.current_price)}</p>
        <p class="coin-change ${changeClass(change)}">${formatPercentage(change)}</p>
      </div>
    </article>`;
}

// render a list of coins into a container
export function renderCoinList(coins, container, emptyMessage = 'No coins found.') {
  if (!coins.length) {
    container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
    return;
  }
  container.innerHTML = coins.map(coinCardTemplate).join('');
}
