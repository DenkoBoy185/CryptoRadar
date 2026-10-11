import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatDate,
  changeClass,
} from './utils.mjs';
import { starButtonTemplate, setupStarButtons } from './Watchlist.mjs';

export default class CoinDetail {
  constructor(coinId, dataSource, container) {
    this.coinId = coinId;
    this.dataSource = dataSource;
    this.container = container;
    this.coin = null;
  }

  async init() {
    this.coin = await this.dataSource.getCoinById(this.coinId);
    this.render();
    setupStarButtons(this.container);
  }

  render() {
    const coin = this.coin;
    const market = coin.market_data;
    const change = market.price_change_percentage_24h;

    document.title = `${coin.name} (${coin.symbol.toUpperCase()}) Price | CryptoRadar`;

    this.container.innerHTML = `
      <a class="back-link" href="${import.meta.env.BASE_URL}">&larr; Back to dashboard</a>

      <div class="detail-header">
        <img src="${coin.image.large}" alt="${coin.name} logo" width="64" height="64" />
        <div>
          <h1>${coin.name}</h1>
          <span class="coin-symbol">#${coin.market_cap_rank ?? '-'} · ${coin.symbol.toUpperCase()}</span>
        </div>
        ${starButtonTemplate({ id: coin.id, name: coin.name })}
      </div>

      <div class="detail-price">
        <p class="coin-price">${formatCurrency(market.current_price.usd)}</p>
        <p class="coin-change ${changeClass(change)}">${formatPercentage(change)} (24h)</p>
      </div>

      ${this.rangeTemplate(market)}

      <dl class="stats-grid">
        ${this.statTemplate('Market Cap', formatLargeNumber(market.market_cap.usd))}
        ${this.statTemplate('24h Volume', formatLargeNumber(market.total_volume.usd))}
        ${this.statTemplate('7d Change', formatPercentage(market.price_change_percentage_7d), changeClass(market.price_change_percentage_7d))}
        ${this.statTemplate('30d Change', formatPercentage(market.price_change_percentage_30d), changeClass(market.price_change_percentage_30d))}
        ${this.statTemplate('Circulating Supply', formatLargeNumber(market.circulating_supply, false))}
        ${this.statTemplate('Max Supply', market.max_supply ? formatLargeNumber(market.max_supply, false) : '∞')}
        ${this.statTemplate('All-Time High', formatCurrency(market.ath.usd))}
        ${this.statTemplate('ATH Date', formatDate(market.ath_date.usd))}
      </dl>

      ${this.aboutTemplate(coin)}
    `;

    // stagger the stat cards so they fade in one after another
    this.container.querySelectorAll('.stat').forEach((stat, i) => {
      stat.style.animationDelay = `${i * 60}ms`;
    });
  }

  statTemplate(label, value, extraClass = '') {
    return `<div class="stat"><dt>${label}</dt><dd class="${extraClass}">${value}</dd></div>`;
  }

  // shows where the current price sits between the 24h low and high
  rangeTemplate(market) {
    const low = market.low_24h.usd;
    const high = market.high_24h.usd;
    const price = market.current_price.usd;
    const percent = high > low ? ((price - low) / (high - low)) * 100 : 50;
    const clamped = Math.min(100, Math.max(0, percent));
    return `
      <section class="range-bar">
        <h2>24h Range</h2>
        <div class="range-track">
          <span class="range-marker" style="left: ${clamped}%" title="Current price"></span>
        </div>
        <div class="range-labels">
          <span>Low ${formatCurrency(low)}</span>
          <span>High ${formatCurrency(high)}</span>
        </div>
      </section>`;
  }

  aboutTemplate(coin) {
    // the description comes with html links, keep plain text and the first paragraphs
    const doc = new DOMParser().parseFromString(coin.description.en || '', 'text/html');
    const paragraphs = doc.body.textContent
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 3);

    const homepage = coin.links.homepage.find((url) => url);
    return `
      <section class="about">
        <h2>About ${coin.name}</h2>
        ${paragraphs.length ? paragraphs.map((p) => `<p>${p}</p>`).join('') : '<p>No description available.</p>'}
        <div class="links">
          ${homepage ? `<a class="btn" href="${homepage}" target="_blank" rel="noopener">Official website</a>` : ''}
          <a class="btn" href="https://www.coingecko.com/en/coins/${coin.id}" target="_blank" rel="noopener">View on CoinGecko</a>
        </div>
      </section>`;
  }
}
