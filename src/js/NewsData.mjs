// CryptoCompare's news api now requires an api key, so the news comes from
// Cointelegraph's public RSS feed converted to JSON by rss2json (no key needed).
const RSS_FEED = 'https://cointelegraph.com/rss';
const NEWS_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED)}`;

export default class NewsData {
  async getNews() {
    const response = await fetch(NEWS_URL);
    if (!response.ok) {
      throw new Error(`News request failed (${response.status})`);
    }
    const data = await response.json();
    if (data.status !== 'ok') {
      throw new Error('The news feed is not available right now.');
    }
    return data.items.map((item) => this.cleanArticle(item));
  }

  // keep only the fields the app uses
  cleanArticle(item) {
    return {
      title: item.title,
      link: item.link,
      date: item.pubDate,
      author: item.author.replace('Cointelegraph by ', ''),
      image: item.enclosure?.link || item.thumbnail || '',
      summary: this.stripHtml(item.description),
      categories: item.categories || [],
    };
  }

  // the description comes as html, turn it into plain short text
  stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent.trim();
    return text.length > 180 ? text.slice(0, 180).trim() + '...' : text;
  }
}
