const PRODUCTS = [
  {id:"stream-plus",name:"اشتراك Stream Plus",category:"subscriptions",price:149,icon:"▶",tag:"اشتراكات",description:"اشتراك ترفيهي رقمي لمدة شهر. منتج تجريبي."},
  {id:"music-premium",name:"Music Premium",category:"subscriptions",price:89,icon:"♫",tag:"اشتراكات",description:"تجربة استماع مميزة لمدة شهر. منتج تجريبي."},
  {id:"game-credits",name:"بطاقة شحن ألعاب",category:"gaming",price:120,icon:"✦",tag:"ألعاب",description:"رصيد ألعاب رقمي بقيمة تجريبية."},
  {id:"pc-game",name:"كود لعبة PC",category:"gaming",price:199,icon:"⌘",tag:"ألعاب",description:"كود لعبة للكمبيوتر. الاسم والتوفر يحتاجان إعدادًا."},
  {id:"gift-250",name:"بطاقة هدايا 250",category:"gift-cards",price:250,icon:"▣",tag:"بطاقات شحن",description:"بطاقة هدايا رقمية بقيمة 250 جنيه."},
  {id:"gift-500",name:"بطاقة هدايا 500",category:"gift-cards",price:500,icon:"◇",tag:"بطاقات شحن",description:"بطاقة هدايا رقمية بقيمة 500 جنيه."}
];

const money = value => new Intl.NumberFormat("ar-EG").format(value) + " ج.م";
let cart = JSON.parse(localStorage.getItem("mona-cart") || "[]");
let activeCategory = "all";
const grid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");

function renderProducts(){
  const term = document.getElementById("search").value.trim().toLowerCase();
  const list = PRODUCTS.filter(p => (activeCategory === "all" || p.category === activeCategory) && (p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)));
  grid.innerHTML = list.map(p => `<article class="product-card"><div class="product-visual"><span>${p.icon}</span><span class="product-tag">${p.tag}</span></div><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><strong class="price">${money(p.price)}</strong><button class="add-button" data-add="${p.id}">أضف للسلة +</button></div></article>`).join("");
  emptyState.classList.toggle("hidden", list.length > 0);
}
function saveCart(){localStorage.setItem("mona-cart",JSON.stringify(cart));renderCart();}
function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-items").innerHTML = cart.length ? cart.map(item => {const p=PRODUCTS.find(x=>x.id===item.id);return p?`<div class="cart-line"><div class="cart-line-icon">${p.icon}</div><div class="cart-line-info"><strong>${p.name}</strong><small>${money(p.price)} × ${item.qty}</small></div><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="تقليل الكمية">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="زيادة الكمية">+</button></div></div>`:"";}).join("") : '<p class="empty-state">السلة لسه فاضية. اختار منتج الأول.</p>';
  const total=cart.reduce((sum,item)=>{const p=PRODUCTS.find(x=>x.id===item.id);return sum+(p?p.price*item.qty:0)},0);
  document.getElementById("cart-total").textContent=money(total);
}
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200);}
function openCart(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");overlay.classList.remove("hidden");}
function closeCart(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");overlay.classList.add("hidden");}
grid.addEventListener("click",event=>{const button=event.target.closest("[data-add]");if(!button)return;const id=button.dataset.add;const existing=cart.find(x=>x.id===id);if(existing)existing.qty++;else cart.push({id,qty:1});saveCart();toast("تمت إضافة المنتج للسلة");});
document.getElementById("cart-items").addEventListener("click",event=>{const button=event.target.closest("[data-qty]");if(!button)return;const item=cart.find(x=>x.id===button.dataset.qty);if(!item)return;item.qty+=Number(button.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);saveCart();});
document.getElementById("filters").addEventListener("click",event=>{const button=event.target.closest("[data-category]");if(!button)return;activeCategory=button.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===button));renderProducts();});
document.getElementById("search").addEventListener("input",renderProducts);
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCart();});
document.getElementById("checkout").addEventListener("click",()=>{if(!cart.length){toast("السلة فاضية");return;}toast("دي نسخة تجريبية: اربط بوابة الدفع أو واتساب قبل استقبال الطلبات.");});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();