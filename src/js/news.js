import NewsData from './NewsData.mjs';
import { updateWatchCount } from './Watchlist.mjs';
import { formatDate, loadHeaderFooter, renderError, renderLoading } from './utils.mjs';

const container = document.getElementById('news-list');

function newsCardTemplate(article) {
  const image = article.image
    ? `<img src="${article.image}" alt="" loading="lazy" width="400" height="225" />`
    : '';
  return `
    <article class="news-card">
      ${image}
      <div class="news-body">
        <p class="news-meta">${formatDate(article.date)} · ${article.author}</p>
        <h2><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></h2>
        <p class="news-summary">${article.summary}</p>
      </div>
    </article>`;
}

async function initNewsPage() {
  await loadHeaderFooter('news');
  updateWatchCount();

  renderLoading(container, 'Loading the latest crypto news...');
  try {
    const articles = await new NewsData().getNews();
    if (!articles.length) {
      container.innerHTML = '<p class="empty">No news right now. Check back later.</p>';
      return;
    }
    container.innerHTML = articles.map(newsCardTemplate).join('');
    // stagger the fade-in of each card
    container.querySelectorAll('.news-card').forEach((card, i) => {
      card.style.animationDelay = `${i * 80}ms`;
    });
  } catch (error) {
    renderError(container, error.message);
  }
}

initNewsPage();
