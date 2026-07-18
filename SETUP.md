# Sultry Shield — запуск сайту

Сайт статичний (HTML/CSS/JS), працює на GitHub Pages. Щоб він запрацював
повністю, потрібно зробити три речі: увімкнути GitHub Pages, налаштувати
приймання замовлень у Google Таблицю і вписати свої контакти.

## 1. Увімкнути GitHub Pages

1. Злийте цю гілку в `main` (через Pull Request або merge).
2. У репозиторії на GitHub: **Settings → Pages**.
3. У блоці **Build and deployment** оберіть **Source: GitHub Actions**.
4. Після наступного пушу в `main` сайт зʼявиться за адресою
   `https://yuliiashyt.github.io/SULTRYSHIELD/`.

## 2. Приймання замовлень у Google Таблицю

Замовлення записуються в таблицю **«Sultry Shield — Замовлення»** через
Google Apps Script. Робіть усе з акаунта **general@sultry.shield.com**:

1. Відкрийте таблицю «Sultry Shield — Замовлення» (якщо її ще немає —
   створіть порожню Google Таблицю з такою назвою в Диску general@).
2. У таблиці: **Розширення → Apps Script**.
3. Видаліть вміст `Code.gs` і вставте код з файлу
   [`apps-script/Code.gs`](apps-script/Code.gs) цього репозиторію.
4. У рядку `var SPREADSHEET_ID = "..."` вставте ID таблиці — це довгий
   код з її адреси: `https://docs.google.com/spreadsheets/d/<ОЦЕЙ_КОД>/edit`.
5. Натисніть **Розгорнути (Deploy) → Нове розгортання (New deployment)**:
   - тип: **Веб-застосунок (Web app)**;
   - **Execute as / Виконувати як**: *Me (general@sultry.shield.com)*;
   - **Who has access / Хто має доступ**: **Anyone / Будь-хто** —
     обовʼязково, інакше сайт не зможе надсилати замовлення;
   - підтвердіть дозволи (Google попередить, що застосунок не перевірений —
     натисніть *Advanced → Go to project*).
6. Скопіюйте **URL веб-застосунку** (закінчується на `/exec`).
7. Відкрийте його в браузері — має зʼявитись напис
   «Sultry Shield order endpoint працює ✓».
8. У файлі [`js/config.js`](js/config.js) вставте цей URL:

   ```js
   ORDER_ENDPOINT: "https://script.google.com/macros/s/…/exec",
   ```

9. Закомітьте зміну і дочекайтесь деплою. Зробіть тестове замовлення —
   у таблиці має зʼявитися рядок.

Поки `ORDER_ENDPOINT` порожній, кошик працює у резервному режимі:
формує текст замовлення і пропонує клієнтці надіслати його в Instagram.

## 3. Контакти та ціни

- **Instagram і email** — у [`js/config.js`](js/config.js)
  (`INSTAGRAM_USER`, `CONTACT_EMAIL`).
- **Ціни й описи товарів** — у [`js/products.js`](js/products.js).
  Поточні ціни — чорновий варіант на основі аналізу конкурентів,
  відредагуйте перед запуском продажів.
- **Фото товарів** — зараз стоять стилізовані SVG-заглушки в
  [`assets/`](assets/). Коли зʼявляться реальні фото, покладіть їх туди ж
  і поміняйте шляхи `image` у `js/products.js` (найкраще — вертикальні
  фото у пропорції 4:5).

## Локальний перегляд

```bash
python3 -m http.server 8000
# відкрийте http://localhost:8000
```
