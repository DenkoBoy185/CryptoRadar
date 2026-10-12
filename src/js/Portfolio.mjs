import { getLocalStorage, setLocalStorage } from './utils.mjs';

const PORTFOLIO_KEY = 'cr-portfolio';

// the portfolio is saved as an array of { id, amount } objects
export function getPortfolio() {
  return getLocalStorage(PORTFOLIO_KEY) || [];
}

// add a holding, or add to the amount if the coin is already there
export function addHolding(id, amount) {
  const portfolio = getPortfolio();
  const existing = portfolio.find((holding) => holding.id === id);
  if (existing) {
    existing.amount += amount;
  } else {
    portfolio.push({ id, amount });
  }
  setLocalStorage(PORTFOLIO_KEY, portfolio);
  return portfolio;
}

export function removeHolding(id) {
  const portfolio = getPortfolio().filter((holding) => holding.id !== id);
  setLocalStorage(PORTFOLIO_KEY, portfolio);
  return portfolio;
}

// join the saved holdings with live market data and calculate the values
export function calculatePortfolio(holdings, coins) {
  const rows = holdings
    .map((holding) => {
      const coin = coins.find((c) => c.id === holding.id);
      // a coin might be missing if the api didn't return it
      if (!coin) return null;
      const value = coin.current_price * holding.amount;
      const change = coin.price_change_percentage_24h || 0;
      // value 24h ago = value / (1 + change%)
      const valueYesterday = value / (1 + change / 100);
      return { coin, amount: holding.amount, value, change, valueYesterday };
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);

  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const totalYesterday = rows.reduce((sum, row) => sum + row.valueYesterday, 0);
  const totalChange = totalYesterday ? ((total - totalYesterday) / totalYesterday) * 100 : 0;

  return { rows, total, totalChange, profit: total - totalYesterday };
}
