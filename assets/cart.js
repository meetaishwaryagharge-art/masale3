/* Shared cart — Bhau Korde. Saved in localStorage so every page sees the same cart. */
(function(){
  var KEY="bk_cart_v1", WA="919167834686", U="https://bhaukorde.in/wp-content/uploads/", mem=[];
  function load(){try{var v=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(v))return v}catch(e){}return mem}
  function save(c){mem=c;try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}}
  function rs(n){return "₹"+(Math.round(n*100)/100).toString()}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function count(c){return c.reduce(function(n,i){return n+i.qty},0)}
  function total(c){return c.reduce(function(n,i){return n+i.qty*i.price},0)}
  function badge(){var n=count(load());document.querySelectorAll(".cartN").forEach(function(e){e.textContent=n})}
  function toast(t,link){
    var e=document.getElementById("toast");
    if(!e){e=document.createElement("div");e.id="toast";e.className="toast";document.body.appendChild(e)}
    e.innerHTML=esc(t)+(link?' <a href="cart.html">View cart</a>':"");
    e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove("on")},2400)}
  var BK=window.BK={
    rs:rs,
    /* item: {id,name,price,size,img} — same id+size merges into one line */
    add:function(it){
      var c=load(),k=it.id+"|"+(it.size||""),f=c.filter(function(x){return x.key===k})[0];
      if(f)f.qty++;else c.push({key:k,id:it.id,name:it.name,price:+it.price,size:it.size||"",img:it.img||"",qty:1});
      save(c);badge();toast(it.name+" added to cart",true)},
    setQty:function(k,q){var c=load();c=c.map(function(x){if(x.key===k)x.qty=q;return x}).filter(function(x){return x.qty>0});save(c);badge()},
    remove:function(k){save(load().filter(function(x){return x.key!==k}));badge()},
    clear:function(){save([]);badge()},
    items:load,count:function(){return count(load())},total:function(){return total(load())},
    waLink:function(){
      var c=load(),m="Hello Bhau Korde, I would like to order:\n";
      c.forEach(function(i,n){m+=(n+1)+". "+i.name+(i.size?" ("+i.size+")":"")+" x "+i.qty+" = "+rs(i.qty*i.price)+"\n"});
      m+="\nTotal: "+rs(total(c))+"\n(Final price depends on pack size - please confirm.)";
      return "https://wa.me/"+WA+"?text="+encodeURIComponent(m)}
  };
  document.addEventListener("DOMContentLoaded",badge);
  window.addEventListener("storage",badge);window.addEventListener("pageshow",badge);

  /* ---- cart page rendering (only runs where #cartRoot exists) ---- */
  function render(){
    var root=document.getElementById("cartRoot");if(!root)return;
    var c=load();
    if(!c.length){root.innerHTML='<div class="cempty"><i class="bi bi-cart-x"></i><h2>Your cart is empty</h2><p>Looks like you haven’t added any masale or lonche yet.</p><a class="btn" href="blended-spices.html">Shop Now</a></div>';return}
    var rows=c.map(function(i){
      var im=i.img?'<img src="'+esc(i.img)+'" alt="'+esc(i.name)+'" onerror="this.replaceWith(document.createTextNode(\'No image\'))">':"No image";
      return '<div class="citem"><div class="ci">'+im+'</div><div><h4>'+esc(i.name)+'</h4>'+(i.size?'<div class="cs">Pack: '+esc(i.size)+'</div>':'')+'<div class="cu">'+rs(i.price)+' each</div></div>'
       +'<div class="cr"><div class="qty"><button data-d="-1" data-k="'+esc(i.key)+'" aria-label="Decrease quantity">&minus;</button><span>'+i.qty+'</span><button data-d="1" data-k="'+esc(i.key)+'" aria-label="Increase quantity">+</button></div>'
       +'<div class="lt">'+rs(i.qty*i.price)+'</div><button class="rm" data-r="'+esc(i.key)+'"><i class="bi bi-trash3"></i> Remove</button></div></div>'}).join("");
    root.innerHTML='<div class="cartpage"><div>'+rows+'<button class="rm cclear" id="cclear"><i class="bi bi-x-circle"></i> Clear cart</button></div>'
     +'<aside class="csum"><h3>Order Summary</h3><div class="row"><span>Items</span><span>'+count(c)+'</span></div><div class="row"><span>Subtotal</span><span>'+rs(total(c))+'</span></div><div class="row tot"><span>Total</span><span>'+rs(total(c))+'</span></div>'
     +'<a class="btn" id="cwa" href="'+BK.waLink()+'" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Order on WhatsApp</a><a class="btn ghost" href="blended-spices.html" style="margin-top:10px">Continue Shopping</a>'
     +'<small>Prices include tax. Final price depends on pack size and delivery — we confirm everything with you on WhatsApp.</small></aside></div>'}
  document.addEventListener("click",function(e){
    var q=e.target.closest("[data-d]"),r=e.target.closest("[data-r]");
    if(q){var k=q.dataset.k,it=load().filter(function(x){return x.key===k})[0];if(it){BK.setQty(k,it.qty+ +q.dataset.d);render()}}
    if(r){BK.remove(r.dataset.r);render()}
    if(e.target.closest("#cclear")){BK.clear();render()}});
  document.addEventListener("DOMContentLoaded",render);
  window.addEventListener("storage",render);
})();
