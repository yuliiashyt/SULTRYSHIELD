/**
 * Кошик Sultry Shield — зберігається у localStorage,
 * тож переживає перехід між сторінками і закриття вкладки.
 */
const CART_KEY = "sultryshield_cart_v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartItemKey(item) {
  return [item.id, item.size, item.color].join("|");
}

function addToCart(id, size, color, qty) {
  const cart = loadCart();
  const key = cartItemKey({ id, size, color });
  const existing = cart.find((i) => cartItemKey(i) === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, size, color, qty });
  }
  saveCart(cart);
}

function removeFromCart(key) {
  saveCart(loadCart().filter((i) => cartItemKey(i) !== key));
}

function setQty(key, qty) {
  const cart = loadCart();
  const item = cart.find((i) => cartItemKey(i) === key);
  if (!item) return;
  item.qty = Math.max(1, Math.min(99, qty));
  saveCart(cart);
}

function cartCount() {
  return loadCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  return loadCart().reduce((sum, i) => {
    const p = getProduct(i.id);
    return p ? sum + p.price * i.qty : sum;
  }, 0);
}

/** Текстовий підсумок замовлення — для таблиці та Instagram-повідомлення. */
function cartSummaryText() {
  return loadCart()
    .map((i) => {
      const p = getProduct(i.id);
      if (!p) return "";
      return `${p.name} (${p.sku}), розмір ${i.size}, колір ${i.color} — ${i.qty} шт × ${p.price} грн`;
    })
    .filter(Boolean)
    .join("; ");
}

function updateCartBadge() {
  const badge = document.querySelector("[data-cart-count]");
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.classList.toggle("is-empty", count === 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
