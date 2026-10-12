import{a as e,c as t,d as n,f as r,i,l as a,m as o,n as s,o as c,p as l,r as u,s as d}from"./Watchlist-YD3agl3G.js";import{t as f}from"./CoinData-BTqBSkTz.js";var p=class{constructor(e,t,n){this.coinId=e,this.dataSource=t,this.container=n,this.coin=null}async init(){this.coin=await this.dataSource.getCoinById(this.coinId),this.render(),s(this.container)}render(){let n=this.coin,r=n.market_data,i=r.price_change_percentage_24h;document.title=`${n.name} (${n.symbol.toUpperCase()}) Price | CryptoRadar`,this.container.innerHTML=`
      <a class="back-link" href="/CryptoRadar/">&larr; Back to dashboard</a>

      <div class="detail-header">
        <img src="${n.image.large}" alt="${n.name} logo" width="64" height="64" />
        <div>
          <h1>${n.name}</h1>
          <span class="coin-symbol">#${n.market_cap_rank??`-`} · ${n.symbol.toUpperCase()}</span>
        </div>
        ${u({id:n.id,name:n.name})}
      </div>

      <div class="detail-price">
        <p class="coin-price">${c(r.current_price.usd)}</p>
        <p class="coin-change ${e(i)}">${a(i)} (24h)</p>
      </div>

      ${this.rangeTemplate(r)}

      <dl class="stats-grid">
        ${this.statTemplate(`Market Cap`,t(r.market_cap.usd))}
        ${this.statTemplate(`24h Volume`,t(r.total_volume.usd))}
        ${this.statTemplate(`7d Change`,a(r.price_change_percentage_7d),e(r.price_change_percentage_7d))}
        ${this.statTemplate(`30d Change`,a(r.price_change_percentage_30d),e(r.price_change_percentage_30d))}
        ${this.statTemplate(`Circulating Supply`,t(r.circulating_supply,!1))}
        ${this.statTemplate(`Max Supply`,r.max_supply?t(r.max_supply,!1):`∞`)}
        ${this.statTemplate(`All-Time High`,c(r.ath.usd))}
        ${this.statTemplate(`ATH Date`,d(r.ath_date.usd))}
      </dl>

      ${this.aboutTemplate(n)}
    `,this.container.querySelectorAll(`.stat`).forEach((e,t)=>{e.style.animationDelay=`${t*60}ms`})}statTemplate(e,t,n=``){return`<div class="stat"><dt>${e}</dt><dd class="${n}">${t}</dd></div>`}rangeTemplate(e){let t=e.low_24h.usd,n=e.high_24h.usd,r=e.current_price.usd,i=n>t?(r-t)/(n-t)*100:50;return`
      <section class="range-bar">
        <h2>24h Range</h2>
        <div class="range-track">
          <span class="range-marker" style="left: ${Math.min(100,Math.max(0,i))}%" title="Current price"></span>
        </div>
        <div class="range-labels">
          <span>Low ${c(t)}</span>
          <span>High ${c(n)}</span>
        </div>
      </section>`}aboutTemplate(e){let t=new DOMParser().parseFromString(e.description.en||``,`text/html`).body.textContent.split(/\r?\n\s*\r?\n/).map(e=>e.trim()).filter(Boolean).slice(0,3),n=e.links.homepage.find(e=>e);return`
      <section class="about">
        <h2>About ${e.name}</h2>
        ${t.length?t.map(e=>`<p>${e}</p>`).join(``):`<p>No description available.</p>`}
        <div class="links">
          ${n?`<a class="btn" href="${n}" target="_blank" rel="noopener">Official website</a>`:``}
          <a class="btn" href="https://www.coingecko.com/en/coins/${e.id}" target="_blank" rel="noopener">View on CoinGecko</a>
        </div>
      </section>`}},m=document.getElementById(`coin-detail`);async function h(){await r(`dashboard`),i();let e=n(`id`);if(!e)l(m,`No coin was selected. Go back to the dashboard and pick one.`);else{o(m,`Loading coin details...`);try{await new p(e,new f,m).init()}catch(e){l(m,e.message)}}}h();