/**
 * Google Apps Script web app that appends waitlist signups to the sheet.
 *
 * Setup (one time):
 *   1. Open the waitlist spreadsheet -> Extensions -> Apps Script.
 *   2. Replace Code.gs with this file, then Save.
 *   3. Deploy -> New deployment -> type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *   4. Copy the /exec URL and set it in .env as:
 *        WAITLIST_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 *      Then set the same value as a shared secret below and in .env:
 *        WAITLIST_SHEET_SECRET=<any long random string>
 *
 * Re-deploy (Manage deployments -> edit -> new version) after editing this file.
 */

/** Must match WAITLIST_SHEET_SECRET in .env - keeps randoms off the sheet. */
const SHARED_SECRET = "CHANGE_ME";

const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return json({ success: false, message: "unauthorized" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Map by header text so re-ordering columns in the sheet can't shift data.
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0]
      .map(function (h) { return String(h).trim().toLowerCase(); });

    const values = {
      "date": new Date().toISOString(),
      "name": body.name || "",
      "email": body.email || "",
      "whatsapp number": body.whatsapp || "",
    };

    const row = headers.map(function (h) {
      return Object.prototype.hasOwnProperty.call(values, h) ? values[h] : "";
    });

    sheet.appendRow(row);
    return json({ success: true });
  } catch (err) {
    return json({ success: false, message: String(err) });
  }
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
