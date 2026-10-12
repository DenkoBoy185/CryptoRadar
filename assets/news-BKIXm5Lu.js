import{f as e,i as t,m as n,p as r,s as i}from"./Watchlist-YD3agl3G.js";var a=`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcointelegraph.com%2Frss`,o=class{async getNews(){let e=await fetch(a);if(!e.ok)throw Error(`News request failed (${e.status})`);let t=await e.json();if(t.status!==`ok`)throw Error(`The news feed is not available right now.`);return t.items.map(e=>this.cleanArticle(e))}cleanArticle(e){return{title:e.title,link:e.link,date:e.pubDate,author:e.author.replace(`Cointelegraph by `,``),image:e.enclosure?.link||e.thumbnail||``,summary:this.stripHtml(e.description),categories:e.categories||[]}}stripHtml(e){let t=new DOMParser().parseFromString(e,`text/html`).body.textContent.trim();return t.length>180?t.slice(0,180).trim()+`...`:t}},s=document.getElementById(`news-list`);function c(e){return`
    <article class="news-card">
      ${e.image?`<img src="${e.image}" alt="" loading="lazy" width="400" height="225" />`:``}
      <div class="news-body">
        <p class="news-meta">${i(e.date)} · ${e.author}</p>
        <h2><a href="${e.link}" target="_blank" rel="noopener">${e.title}</a></h2>
        <p class="news-summary">${e.summary}</p>
      </div>
    </article>`}async function l(){await e(`news`),t(),n(s,`Loading the latest crypto news...`);try{let e=await new o().getNews();if(!e.length){s.innerHTML=`<p class="empty">No news right now. Check back later.</p>`;return}s.innerHTML=e.map(c).join(``),s.querySelectorAll(`.news-card`).forEach((e,t)=>{e.style.animationDelay=`${t*80}ms`})}catch(e){r(s,e.message)}}l();