import CoinData from './CoinData.mjs';
import { getPortfolio, addHolding, removeHolding, calculatePortfolio } from './Portfolio.mjs';
import { updateWatchCount } from './Watchlist.mjs';
import {
  formatCurrency,
  formatPercentage,
  changeClass,
  loadHeaderFooter,
  renderError,
  renderLoading,
} from './utils.mjs';

const coinData = new CoinData();
const form = document.getElementById('holding-form');
const coinSelect = document.getElementById('coin-select');
const amountInput = document.getElementById('amount-input');
const formMessage = document.getElementById('form-message');
const summary = document.getElementById('portfolio-summary');
const list = document.getElementById('holdings');

async function initPortfolioPage() {
  await loadHeaderFooter('portfolio');
  updateWatchCount();

  try {
    // fill the dropdown with the top coins so the user can't type an invalid id
    const coins = await coinData.getTopCoins();
    coinSelect.innerHTML =
      '<option value="">Choose a coin...</option>' +
      coins
        .map((coin) => `<option value="${coin.id}">${coin.name} (${coin.symbol.toUpperCase()})</option>`)
        .join('');
  } catch (error) {
    renderError(list, error.message);
    return;
  }

  form.addEventListener('submit', handleSubmit);
  amountInput.addEventListener('input', () => setMessage(''));
  list.addEventListener('click', handleRemove);

  await renderPortfolio();
}

// validate the form before saving anything
function handleSubmit(event) {
  event.preventDefault();
  const id = coinSelect.value;
  const amount = parseFloat(amountInput.value);

  if (!id) {
    setMessage('Please choose a coin.', coinSelect);
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    setMessage('Enter an amount greater than 0.', amountInput);
    return;
  }

  addHolding(id, amount);
  const name = coinSelect.selectedOptions[0].textContent;
  setMessage(`Added ${amount} ${name} to your portfolio.`);
  form.reset();
  renderPortfolio();
}

function handleRemove(event) {
  const btn = event.target.closest('.remove-btn');
  if (!btn) return;
  removeHolding(btn.dataset.id);
  renderPortfolio();
}

// show a message under the form; if a field is passed, it's an error on that field
function setMessage(text, invalidField = null) {
  formMessage.textContent = text;
  formMessage.classList.toggle('error', invalidField !== null);
  [coinSelect, amountInput].forEach((field) =>
    field.setAttribute('aria-invalid', field === invalidField)
  );
  if (invalidField) invalidField.focus();
}

async function renderPortfolio() {
  const holdings = getPortfolio();
  if (!holdings.length) {
    summary.classList.add('hide');
    list.innerHTML =
      '<p class="empty">Your portfolio is empty. Add a coin above to see what your holdings are worth.</p>';
    return;
  }

  renderLoading(list, 'Calculating your portfolio...');
  try {
    const coins = await coinData.getCoinsByIds(holdings.map((h) => h.id));
    const { rows, total, totalChange, profit } = calculatePortfolio(holdings, coins);

    summary.classList.remove('hide');
    summary.innerHTML = `
      <p class="summary-label">Total value</p>
      <p class="summary-total">${formatCurrency(total)}</p>
      <p class="coin-change ${changeClass(totalChange)}">
        ${profit >= 0 ? '+' : '-'}${formatCurrency(Math.abs(profit))} (${formatPercentage(totalChange)}) today
      </p>`;

    list.innerHTML = rows.map(holdingTemplate).join('');
  } catch (error) {
    renderError(list, error.message);
  }
}

function holdingTemplate({ coin, amount, value, change }) {
  return `
    <article class="holding">
      <a class="coin-link" href="${import.meta.env.BASE_URL}coin/?id=${coin.id}">
        <img src="${coin.image}" alt="${coin.name} logo" class="coin-icon" width="40" height="40" loading="lazy" />
        <span class="coin-name-group">
          <span class="coin-name">${coin.name}</span>
          <span class="coin-symbol">${amount} ${coin.symbol.toUpperCase()} · ${formatCurrency(coin.current_price)}</span>
        </span>
      </a>
      <div class="holding-value">
        <p class="coin-price">${formatCurrency(value)}</p>
        <p class="coin-change ${changeClass(change)}">${formatPercentage(change)}</p>
      </div>
      <button type="button" class="remove-btn" data-id="${coin.id}" aria-label="Remove ${coin.name} from portfolio">✕</button>
    </article>`;
}

initPortfolioPage();
