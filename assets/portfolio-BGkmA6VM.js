import{a as e,f as t,h as n,i as r,l as i,m as a,o,p as s,u as c}from"./Watchlist-YD3agl3G.js";import{t as l}from"./CoinData-BTqBSkTz.js";var u=`cr-portfolio`;function d(){return c(u)||[]}function f(e,t){let r=d(),i=r.find(t=>t.id===e);return i?i.amount+=t:r.push({id:e,amount:t}),n(u,r),r}function p(e){let t=d().filter(t=>t.id!==e);return n(u,t),t}function m(e,t){let n=e.map(e=>{let n=t.find(t=>t.id===e.id);if(!n)return null;let r=n.current_price*e.amount,i=n.price_change_percentage_24h||0,a=r/(1+i/100);return{coin:n,amount:e.amount,value:r,change:i,valueYesterday:a}}).filter(Boolean).sort((e,t)=>t.value-e.value),r=n.reduce((e,t)=>e+t.value,0),i=n.reduce((e,t)=>e+t.valueYesterday,0);return{rows:n,total:r,totalChange:i?(r-i)/i*100:0,profit:r-i}}var h=new l,g=document.getElementById(`holding-form`),_=document.getElementById(`coin-select`),v=document.getElementById(`amount-input`),y=document.getElementById(`form-message`),b=document.getElementById(`portfolio-summary`),x=document.getElementById(`holdings`);async function S(){await t(`portfolio`),r();try{_.innerHTML=`<option value="">Choose a coin...</option>`+(await h.getTopCoins()).map(e=>`<option value="${e.id}">${e.name} (${e.symbol.toUpperCase()})</option>`).join(``)}catch(e){s(x,e.message);return}g.addEventListener(`submit`,C),v.addEventListener(`input`,()=>T(``)),x.addEventListener(`click`,w),await E()}function C(e){e.preventDefault();let t=_.value,n=parseFloat(v.value);if(!t){T(`Please choose a coin.`,_);return}if(isNaN(n)||n<=0){T(`Enter an amount greater than 0.`,v);return}f(t,n);let r=_.selectedOptions[0].textContent;T(`Added ${n} ${r} to your portfolio.`),g.reset(),E()}function w(e){let t=e.target.closest(`.remove-btn`);t&&(p(t.dataset.id),E())}function T(e,t=null){y.textContent=e,y.classList.toggle(`error`,t!==null),[_,v].forEach(e=>e.setAttribute(`aria-invalid`,e===t)),t&&t.focus()}async function E(){let t=d();if(!t.length)b.classList.add(`hide`),x.innerHTML=`<p class="empty">Your portfolio is empty. Add a coin above to see what your holdings are worth.</p>`;else{a(x,`Calculating your portfolio...`);try{let{rows:n,total:r,totalChange:a,profit:s}=m(t,await h.getCoinsByIds(t.map(e=>e.id)));b.classList.remove(`hide`),b.innerHTML=`
      <p class="summary-label">Total value</p>
      <p class="summary-total">${o(r)}</p>
      <p class="coin-change ${e(a)}">
        ${s>=0?`+`:`-`}${o(Math.abs(s))} (${i(a)}) today
      </p>`,x.innerHTML=n.map(D).join(``)}catch(e){s(x,e.message)}}}function D({coin:t,amount:n,value:r,change:a}){return`
    <article class="holding">
      <a class="coin-link" href="/CryptoRadar/coin/?id=${t.id}">
        <img src="${t.image}" alt="${t.name} logo" class="coin-icon" width="40" height="40" loading="lazy" />
        <span class="coin-name-group">
          <span class="coin-name">${t.name}</span>
          <span class="coin-symbol">${n} ${t.symbol.toUpperCase()} · ${o(t.current_price)}</span>
        </span>
      </a>
      <div class="holding-value">
        <p class="coin-price">${o(r)}</p>
        <p class="coin-change ${e(a)}">${i(a)}</p>
      </div>
      <button type="button" class="remove-btn" data-id="${t.id}" aria-label="Remove ${t.name} from portfolio">✕</button>
    </article>`}S();