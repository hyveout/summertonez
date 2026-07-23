// SHOP GRID — rendered from PRODUCTS (products.js) with live sort.

const grid = document.getElementById('shopGrid');
const emptyNote = document.getElementById('shopEmpty');
const sortSelect = document.getElementById('sortSelect');

function statusBadge(p) {
  if (p.sold) return '<div class="shop-item-status sold">Sold out</div>';
  if (p.soldSizes && p.soldSizes.length > 0) return '<div class="shop-item-status">Low stock</div>';
  return '';
}

function cardHTML(p, i, total) {
  const media = p.image
    ? `<img src="${p.image}" alt="${p.title}" class="real-photo"/>`
    : `<image-slot id="shop-${p.id}" placeholder="${p.title}" shape="rect"></image-slot>`;
  return `
  <a class="shop-item" href="product.html?id=${p.id}">
    <div class="shop-item-num">
      <span>${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
    </div>
    <div class="shop-item-media">
      <div class="arch-frame arch-mask">
        <div class="arch-inner arch-mask">${media}</div>
      </div>
      ${statusBadge(p)}
    </div>
    <div class="shop-item-title">${p.title}</div>
    <div class="shop-item-line">
      <span class="label">${p.sold ? 'archive' : (p.sizes || []).join(' · ')}</span>
      <div class="shop-item-price">$${p.price}</div>
    </div>
  </a>`;
}

function render() {
  let list = [...PRODUCTS];
  switch (sortSelect.value) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'available':  list.sort((a, b) => (a.sold ? 1 : 0) - (b.sold ? 1 : 0)); break;
    // 'newest' keeps catalog order
  }
  grid.innerHTML = list.map((p, i) => cardHTML(p, i, list.length)).join('');
  emptyNote.style.display = list.length ? 'none' : 'block';
}

sortSelect.addEventListener('change', render);

render();
