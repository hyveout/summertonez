// SHOP GRID — renders PRODUCTS (products.js) as simple-product cards.

function cardHTML(p) {
  const media = p.image
    ? `<img src="${p.image}" alt="${p.title}" class="simple-product-img"/>`
    : `<image-slot id="shop-${p.id}" placeholder="${p.title}" shape="rect" class="simple-product-img"></image-slot>`;
  return `
  <a class="simple-product" href="product.html?id=${p.id}">
    <div class="simple-product-media">${media}</div>
    <div class="simple-product-info">
      <div class="simple-product-row">
        <span class="simple-product-title">${p.title}</span>
        <span class="simple-product-price">$${p.price}</span>
      </div>
      ${p.punjabi ? `<div class="simple-product-punjabi">${p.punjabi}</div>` : ''}
    </div>
  </a>`;
}

document.getElementById('shopGrid').innerHTML = PRODUCTS.map(cardHTML).join('');
