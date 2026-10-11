// ---------- formatting ----------

// format a number as US dollars. Cheap coins get more decimals so they don't show as $0.00
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'N/A';
  let digits = 2;
  if (amount < 0.01) digits = 6;
  else if (amount < 1) digits = 4;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(amount);
}

// format a percentage with a + sign when positive
export function formatPercentage(percentage) {
  if (percentage === null || percentage === undefined) return '0.00%';
  const formatted = percentage.toFixed(2) + '%';
  return percentage > 0 ? '+' + formatted : formatted;
}

// big numbers like market cap -> "$1.2T", "$350.4B"
export function formatLargeNumber(num, currency = true) {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: currency ? 'currency' : 'decimal',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(num);
}

// "Oct 10, 2026"
export function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// css class used to color price changes green/red
export function changeClass(value) {
  return value >= 0 ? 'positive' : 'negative';
}

// ---------- url + storage ----------

// get a parameter from the url, e.g. ?id=bitcoin
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------- templates ----------

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// fetch an html partial and return it as text
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load template ${path}`);
  const template = await res.text();
  // partials use {{base}} so links work locally and on GitHub Pages
  return template.replaceAll('{{base}}', import.meta.env.BASE_URL);
}

// load the shared header + footer into every page
export async function loadHeaderFooter(currentPage) {
  const base = import.meta.env.BASE_URL;
  const headerTemplate = await loadTemplate(`${base}partials/header.html`);
  const footerTemplate = await loadTemplate(`${base}partials/footer.html`);

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  renderWithTemplate(headerTemplate, headerElement, currentPage, highlightNav);
  renderWithTemplate(footerTemplate, footerElement);
  document.querySelector('#year').textContent = new Date().getFullYear();
}

// mark the current page link in the nav
function highlightNav(currentPage) {
  const link = document.querySelector(`.nav-links a[data-page="${currentPage}"]`);
  if (link) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
}

// friendly error box instead of a blank screen
export function renderError(parentElement, message) {
  parentElement.innerHTML = `
    <div class="error-box" role="alert">
      <p><strong>Oops!</strong> ${message}</p>
      <button type="button" class="btn retry-btn">Try again</button>
    </div>`;
  parentElement
    .querySelector('.retry-btn')
    .addEventListener('click', () => location.reload());
}

// loading spinner while waiting for the api
export function renderLoading(parentElement, message = 'Loading...') {
  parentElement.innerHTML = `
    <div class="loading" role="status">
      <span class="spinner" aria-hidden="true"></span>
      <p>${message}</p>
    </div>`;
}
