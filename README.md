# Sultry Shield

Сайт бренду **Sultry Shield** — захисний дансвеар для heels-хореографії.
Рукавички та шкарпетки з амортизуючими вставками, колекція Black&Nude.

Статичний сайт (HTML/CSS/JS) з кошиком і оформленням замовлення:
замовлення записуються в Google Таблицю через Google Apps Script,
оплата — при отриманні або на картку.

- 🛒 Каталог, картки товарів, кошик (localStorage), checkout
- 📦 Доставка Новою поштою, накладений платіж
- 📄 Хостинг: GitHub Pages (деплой через GitHub Actions з `main`)

**Як запустити й налаштувати — див. [SETUP.md](SETUP.md).**

## Структура

```
index.html        головна: hero, каталог, про бренд, FAQ, контакти
product.html      картка товару (?id=gloves|socks|bolero|shorts|bodysuit)
cart.html         кошик + форма замовлення
thanks.html       підтвердження замовлення
js/products.js    каталог і ціни  ← редагувати ціни тут
js/config.js      ендпоінт замовлень, Instagram, email
apps-script/      код Google Apps Script для приймання замовлень
```
