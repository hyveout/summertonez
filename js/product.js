// PRODUCT DETAIL — reads ?id= from the URL, fills the page from PRODUCTS.

const params = new URLSearchParams(window.location.search);
const id = params.get('id') || 'war-in-my-head';
const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

// Fill in details
document.title = `${product.title} — SUMMERTONEZ`;
document.getElementById('pdpTitle').innerHTML = product.title;
document.getElementById('pdpPrice').textContent = `$${product.price}`;
document.getElementById('pdpDesc').textContent = product.desc;
document.getElementById('pdpCrumb').textContent = product.title;

// Main image (inside the arch)
const mainEl = document.getElementById('pdpMain');
if (product.image) {
  mainEl.innerHTML = `<img src="${product.image}" alt="${product.title}" />`;
} else {
  mainEl.innerHTML = `<image-slot id="pdp-main-slot-${product.id}" placeholder="${product.title}" shape="rect"></image-slot>`;
}

// Thumbnails (main + 3 detail slots)
const thumbsEl = document.getElementById('pdpThumbs');
const thumbs = [];
if (product.image) {
  thumbs.push({html: `<img src="${product.image}" alt="" />`, main: `<img src="${product.image}" alt="${product.title}" />`});
} else {
  thumbs.push({html: `<image-slot id="thumb-0-${product.id}" placeholder="Front" shape="rect"></image-slot>`, main: `<image-slot id="pdp-main-slot-${product.id}" placeholder="${product.title}" shape="rect"></image-slot>`});
}
['Back', 'Detail', 'On body'].forEach((label, i) => {
  thumbs.push({
    html: `<image-slot id="thumb-${i+1}-${product.id}" placeholder="${label}" shape="rect"></image-slot>`,
    main: `<image-slot id="pdp-main-slot-${i+1}-${product.id}" placeholder="${product.title} · ${label}" shape="rect"></image-slot>`
  });
});
thumbsEl.innerHTML = thumbs.map((t, i) => `<div class="pdp-thumb${i===0?' active':''}" data-idx="${i}">${t.html}</div>`).join('');
thumbsEl.querySelectorAll('.pdp-thumb').forEach((el, i) => {
  el.addEventListener('click', () => {
    thumbsEl.querySelectorAll('.pdp-thumb').forEach(x => x.classList.remove('active'));
    el.classList.add('active');
    mainEl.innerHTML = thumbs[i].main;
  });
});

// Sizes
const sizesEl = document.getElementById('pdpSizes');
const sizeChoice = document.getElementById('pdpSizeChoice');
let selectedSize = null;
const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
const soldSizes = product.soldSizes || [];
sizesEl.innerHTML = sizes.map(s => {
  const sold = soldSizes.includes(s);
  return `<button class="size-btn" data-size="${s}"${sold ? ' disabled' : ''}>${s}</button>`;
}).join('');
sizesEl.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    sizesEl.querySelectorAll('.size-btn').forEach(x => x.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSize = btn.dataset.size;
    sizeChoice.textContent = `— ${selectedSize}`;
    updateAddBtn();
  });
});

// Quantity
const qtyInput = document.getElementById('qtyInput');
document.getElementById('qtyMinus').addEventListener('click', () => {
  qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) - 1);
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  qtyInput.value = Math.min(10, parseInt(qtyInput.value || 1) + 1);
});

// Add to bag
const addBtn = document.getElementById('addBtn');
function updateAddBtn() {
  if (product.sold) {
    addBtn.disabled = true;
    addBtn.textContent = 'Sold out';
  } else if (!selectedSize) {
    addBtn.disabled = false;
    addBtn.textContent = 'Select size';
  } else {
    addBtn.disabled = false;
    addBtn.textContent = 'Add to bag →';
  }
}
updateAddBtn();
addBtn.addEventListener('click', () => {
  if (!selectedSize && !product.sold) {
    addBtn.textContent = 'Choose a size first';
    setTimeout(updateAddBtn, 1600);
    return;
  }
  // TODO: Shopify wire-up. See Shopify AJAX cart docs.
  // For now, bump the local bag count as a demo:
  const bagLink = document.getElementById('bagLink');
  const m = bagLink.textContent.match(/\((\d+)\)/);
  const n = m ? parseInt(m[1]) + parseInt(qtyInput.value) : parseInt(qtyInput.value);
  bagLink.textContent = `Bag (${n})`;
  addBtn.classList.add('added');
  addBtn.textContent = '✓ Added';
  setTimeout(() => {
    addBtn.classList.remove('added');
    updateAddBtn();
  }, 1800);
});

// Related — 4 other products, same arch-card treatment as the shop grid
const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
document.getElementById('relatedGrid').innerHTML = related.map(p => `
  <a class="shop-item" href="product.html?id=${p.id}">
    <div class="shop-item-media">
      <div class="arch-frame arch-mask">
        <div class="arch-inner arch-mask">
          ${p.image
            ? `<img src="${p.image}" alt="${p.title}" class="real-photo" />`
            : `<image-slot id="rel-${p.id}" placeholder="${p.title}" shape="rect"></image-slot>`
          }
        </div>
      </div>
    </div>
    <div class="shop-item-line">
      <div class="shop-item-title">${p.title}</div>
      <div class="shop-item-price">$${p.price}</div>
    </div>
  </a>
`).join('');
