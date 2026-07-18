/**
 * Sultry Shield — приймання замовлень у Google Таблицю.
 *
 * Цей скрипт розгортається як веб-застосунок Google Apps Script
 * З АКАУНТА general@sultry.shield.com (власника таблиці замовлень).
 * Покрокова інструкція — у файлі SETUP.md в корені репозиторію.
 *
 * Сайт надсилає POST-запит з JSON-тілом (text/plain через no-cors),
 * скрипт додає рядок у аркуш "Замовлення".
 */

// Таблиця "Sultry Shield — Замовлення" (лежить у папці general@sultry.shield.com)
var SPREADSHEET_ID = "15VNamPc8_kfobuFBmMdQTy0EbuZXvHB_L1Lp0tuAyO4";
var SHEET_NAME = "Замовлення";

var HEADERS = [
  "Дата", "Ім'я", "Телефон", "Місто", "Відділення НП",
  "Instagram", "Товари", "Сума", "Оплата", "Коментар",
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    // Пишемо в аркуш "Замовлення", а якщо його немає — у перший аркуш таблиці
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    sheet.appendRow([
      data.date || new Date(),
      data.name || "",
      "'" + (data.phone || ""), // апостроф, щоб + не зʼїдався форматом
      data.city || "",
      data.branch || "",
      data.instagram || "",
      data.items || "",
      data.total || "",
      data.payment || "",
      data.comment || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Швидка перевірка, що деплой живий: відкрийте URL /exec у браузері. */
function doGet() {
  return ContentService.createTextOutput("Sultry Shield order endpoint працює ✓");
}
