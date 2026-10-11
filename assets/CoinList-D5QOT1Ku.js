import{a as e,l as t,o as n,r}from"./Watchlist-C1P1_qbp.js";function i(i){let a=i.price_change_percentage_24h;return`
    <article class="coin-card">
      <div class="coin-header">
        <a class="coin-link" href="/CryptoRadar/coin/?id=${i.id}">
          <img src="${i.image}" alt="${i.name} logo" class="coin-icon" width="40" height="40" loading="lazy" />
          <span class="coin-name-group">
            <span class="coin-name">${i.name}</span>
            <span class="coin-symbol">#${i.market_cap_rank??`-`} · ${i.symbol.toUpperCase()}</span>
          </span>
        </a>
        ${r(i)}
      </div>
      <div class="coin-price-group">
        <p class="coin-price">${n(i.current_price)}</p>
        <p class="coin-change ${e(a)}">${t(a)}</p>
      </div>
    </article>`}function a(e,t,n=`No coins found.`){t.innerHTML=e.length?e.map(i).join(``):`<p class="empty">${n}</p>`}export{a as t};