// SHOP GRID — rendered from PRODUCTS (products.js) with live filter + sort.

const grid = document.getElementById('shopGrid');
const emptyNote = document.getElementById('shopEmpty');
const chips = document.querySelectorAll('#filterChips .chip');
const sortSelect = document.getElementById('sortSelect');

let activeCat = 'all';

// Chip labels get live counts (e.g. "Tees · 4")
chips.forEach(chip => {
  const cat = chip.dataset.cat;
  const count = cat === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === cat).length;
  chip.textContent = `${chip.textContent} · ${count}`;
});

function statusBadge(p) {
  if (p.sold) return '<div class="shop-item-status sold">Sold out</div>';
  if (p.status === 'new') return '<div class="shop-item-status new">नया · New</div>';
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
      <span class="shop-item-cat">${p.cat}</span>
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
  let list = activeCat === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.cat === activeCat);
  switch (sortSelect.value) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'available':  list.sort((a, b) => (a.sold ? 1 : 0) - (b.sold ? 1 : 0)); break;
    // 'newest' keeps catalog order
  }
  grid.innerHTML = list.map((p, i) => cardHTML(p, i, list.length)).join('');
  emptyNote.style.display = list.length ? 'none' : 'block';
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('active'));
    chip.classList.add('active');
    activeCat = chip.dataset.cat;
    render();
  });
});
sortSelect.addEventListener('change', render);

render();
