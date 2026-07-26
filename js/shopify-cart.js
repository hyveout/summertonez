// Shopify Storefront API cart — this token is the public Storefront token,
// meant to live in client-side code (unlike the Admin API token).
const SHOPIFY_DOMAIN = 'summertonez.myshopify.com';
const STOREFRONT_TOKEN = '671add9c4da0238454bac57fcb4ead36';
const SHOPIFY_API_VERSION = '2026-01';

async function shopifyFetch(query, variables) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join('; '));
  return json.data;
}

const CART_FIELDS = `id checkoutUrl totalQuantity`;

function getCartId() { return localStorage.getItem('shopifyCartId'); }
function setCartId(id) { localStorage.setItem('shopifyCartId', id); }

async function createCart(variantId, quantity) {
  const data = await shopifyFetch(`
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { lines: [{ merchandiseId: variantId, quantity }] });
  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length) throw new Error(userErrors.map(e => e.message).join('; '));
  setCartId(cart.id);
  return cart;
}

async function addToCart(variantId, quantity) {
  const existingId = getCartId();
  if (!existingId) return createCart(variantId, quantity);

  const data = await shopifyFetch(`
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { cartId: existingId, lines: [{ merchandiseId: variantId, quantity }] });

  // Stored cart may be stale/expired (e.g. completed checkout) — start a fresh one.
  if (data.cartLinesAdd.userErrors.length) return createCart(variantId, quantity);
  return data.cartLinesAdd.cart;
}

async function getCart() {
  const id = getCartId();
  if (!id) return null;
  const data = await shopifyFetch(`query CartGet($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`, { id });
  return data.cart;
}

function updateBagLinks(cart) {
  const n = cart ? cart.totalQuantity : 0;
  document.querySelectorAll('.bag-btn').forEach(el => {
    el.textContent = `Bag (${n})`;
    el.href = cart && cart.checkoutUrl ? cart.checkoutUrl : '#';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getCart().then(updateBagLinks).catch(() => {});
});
