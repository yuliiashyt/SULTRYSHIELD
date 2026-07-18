/**
 * Кошик і оформлення замовлення (cart.html).
 *
 * Надсилання: POST у Google Apps Script (CONFIG.ORDER_ENDPOINT).
 * Apps Script не віддає CORS-заголовки, тому запит іде в режимі no-cors
 * з тілом text/plain — скрипт на боці Google все одно отримує JSON у
 * e.postData.contents. Відповідь прочитати не можна, тому після
 * успішної відправки одразу ведемо на сторінку подяки.
 */

function renderCart() {
  const cart = loadCart();
  const list = document.getElementById("cart-items");
  const empty = document.getElementById("cart-empty");
  const checkout = document.getElementById("checkout-block");

  if (!cart.length) {
    empty.hidden = false;
    checkout.hidden = true;
    list.innerHTML = "";
    return;
  }
  empty.hidden = true;
  checkout.hidden = false;

  list.innerHTML = cart
    .map((item) => {
      const p = getProduct(item.id);
      if (!p) return "";
      const key = cartItemKey(item);
      return `
      <div class="cart-item" data-key="${key}">
        <a href="product.html?id=${p.id}" class="cart-item__img">
          <img src="${p.image}" alt="${p.name}">
        </a>
        <div class="cart-item__info">
          <a href="product.html?id=${p.id}" class="cart-item__name">${p.name}</a>
          <p class="cart-item__meta">Розмір: ${item.size} · Колір: ${item.color}</p>
          <button class="cart-item__remove" type="button" data-remove="${key}">Видалити</button>
        </div>
        <div class="cart-item__qty">
          <button type="button" data-qty="-1" aria-label="Менше">−</button>
          <span>${item.qty}</span>
          <button type="button" data-qty="1" aria-label="Більше">+</button>
        </div>
        <div class="cart-item__price">${formatPrice(p.price * item.qty)}</div>
      </div>`;
    })
    .join("");

  document.getElementById("cart-total").textContent = formatPrice(cartTotal());

  list.querySelectorAll("[data-remove]").forEach((btn) =>
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.remove);
      renderCart();
    })
  );
  list.querySelectorAll("[data-qty]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const row = btn.closest(".cart-item");
      const item = loadCart().find((i) => cartItemKey(i) === row.dataset.key);
      if (!item) return;
      setQty(row.dataset.key, item.qty + Number(btn.dataset.qty));
      renderCart();
    })
  );
}

function orderPayload(form) {
  const data = new FormData(form);
  return {
    date: new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" }),
    name: data.get("name").trim(),
    phone: data.get("phone").trim(),
    city: data.get("city").trim(),
    branch: data.get("branch").trim(),
    instagram: (data.get("instagram") || "").trim(),
    items: cartSummaryText(),
    total: cartTotal() + " грн",
    payment: data.get("payment"),
    comment: (data.get("comment") || "").trim(),
  };
}

/** Замовлення текстом — для Instagram-фолбеку, коли ендпоінт не налаштований. */
function orderAsMessage(payload) {
  return [
    "Привіт! Хочу зробити замовлення 🖤",
    "Товари: " + payload.items,
    "Сума: " + payload.total,
    "Ім'я: " + payload.name,
    "Телефон: " + payload.phone,
    "Місто: " + payload.city + ", НП №" + payload.branch,
    "Оплата: " + payload.payment,
    payload.comment ? "Коментар: " + payload.comment : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const payload = orderPayload(form);
  const button = form.querySelector("button[type=submit]");

  if (!CONFIG.ORDER_ENDPOINT) {
    // Ендпоінт ще не налаштований (див. SETUP.md) — пропонуємо Instagram.
    const fallback = document.getElementById("order-fallback");
    document.getElementById("order-fallback-text").value = orderAsMessage(payload);
    fallback.hidden = false;
    fallback.scrollIntoView({ behavior: "smooth" });
    return;
  }

  button.disabled = true;
  button.textContent = "Надсилаємо…";
  try {
    await fetch(CONFIG.ORDER_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    sessionStorage.setItem("sultryshield_last_order", JSON.stringify(payload));
    clearCart();
    window.location.href = "thanks.html";
  } catch (err) {
    button.disabled = false;
    button.textContent = "Оформити замовлення";
    const errBox = document.getElementById("order-error");
    errBox.hidden = false;
    errBox.scrollIntoView({ behavior: "smooth" });
  }
}

function copyFallbackOrder() {
  const text = document.getElementById("order-fallback-text");
  text.select();
  navigator.clipboard.writeText(text.value).then(() => {
    document.getElementById("copy-order").textContent = "Скопійовано ✓";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  document.getElementById("order-form").addEventListener("submit", submitOrder);
  document.getElementById("copy-order").addEventListener("click", copyFallbackOrder);
  const ig = document.getElementById("instagram-link");
  ig.href = "https://instagram.com/" + CONFIG.INSTAGRAM_USER;
});
