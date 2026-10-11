import { getLocalStorage, setLocalStorage } from './utils.mjs';

const WATCHLIST_KEY = 'cr-watchlist';

// the watchlist is just an array of CoinGecko ids saved in localStorage
export function getWatchlist() {
  return getLocalStorage(WATCHLIST_KEY) || [];
}

export function isInWatchlist(coinId) {
  return getWatchlist().includes(coinId);
}

// add the coin if it's not saved, remove it if it is. Returns the new state.
export function toggleWatchlist(coinId) {
  let list = getWatchlist();
  const saved = list.includes(coinId);
  if (saved) {
    list = list.filter((id) => id !== coinId);
  } else {
    list.push(coinId);
  }
  setLocalStorage(WATCHLIST_KEY, list);
  updateWatchCount();
  return !saved;
}

// little badge next to "Watchlist" in the nav
export function updateWatchCount() {
  const badge = document.querySelector('.watch-count');
  if (!badge) return;
  const count = getWatchlist().length;
  badge.textContent = count;
  badge.classList.toggle('hide', count === 0);
}

export function starButtonTemplate(coin) {
  const saved = isInWatchlist(coin.id);
  return `<button type="button" class="star-btn ${saved ? 'saved' : ''}" data-id="${coin.id}"
    aria-pressed="${saved}" aria-label="${saved ? 'Remove' : 'Add'} ${coin.name} ${saved ? 'from' : 'to'} watchlist">
    ${saved ? '★' : '☆'}
  </button>`;
}

// one click listener on the container handles every star button inside it
export function setupStarButtons(container, onChange) {
  container.addEventListener('click', (event) => {
    const btn = event.target.closest('.star-btn');
    if (!btn) return;
    event.preventDefault();
    const nowSaved = toggleWatchlist(btn.dataset.id);
    btn.classList.toggle('saved', nowSaved);
    btn.setAttribute('aria-pressed', nowSaved);
    btn.textContent = nowSaved ? '★' : '☆';
    btn.classList.add('pop');
    btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });
    if (onChange) onChange(btn.dataset.id, nowSaved);
  });
}
