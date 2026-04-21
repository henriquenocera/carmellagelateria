/**
 * Google Apps Script backend for Informacoes page.
 *
 * Steps:
 * 1) Open script.google.com and create a new project.
 * 2) Paste this file into Code.gs.
 * 3) Replace SHEET_ID and SHEET_NAME.
 * 4) Deploy > New deployment > Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone with the link (or your domain users)
 * 5) Copy web app URL to frontend .env:
 *    REACT_APP_SHEETS_API_URL=https://script.google.com/macros/s/.../exec
 */

const SHEET_ID = "1CCRTSep_zItfystgLRNtP6Fq2-KhrH80PcR_Ey3ktpA";
const SHEET_NAME = "Informacoes";

function doGet() {
  try {
    const rows = readRows_();
    return jsonResponse_({ rows: rows });
  } catch (error) {
    return jsonResponse_({ error: error.message }, 500);
  }
}

function doPost(e) {
  try {
    const action = (e.parameter && e.parameter.action) || "";
    const payload = JSON.parse((e.parameter && e.parameter.payload) || "{}");

    if (action === "create") {
      createRow_(payload.row || {});
      return jsonResponse_({ ok: true });
    }

    if (action === "update") {
      updateRow_(payload.row || {});
      return jsonResponse_({ ok: true });
    }

    if (action === "delete") {
      deleteRow_(payload.id);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ error: "Invalid action." }, 400);
  } catch (error) {
    return jsonResponse_({ error: error.message }, 500);
  }
}

function readRows_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const rows = [];
  for (let i = 1; i < values.length; i += 1) {
    const line = values[i];
    rows.push({
      id: String(line[0] || ""),
      name: String(line[1] || ""),
      login: String(line[2] || ""),
      passwordHint: String(line[3] || ""),
      link: String(line[4] || ""),
    });
  }
  return rows;
}

function createRow_(row) {
  const sheet = getSheet_();
  const id = row.id ? String(row.id) : String(new Date().getTime());
  sheet.appendRow([
    id,
    String(row.name || ""),
    String(row.login || ""),
    String(row.passwordHint || ""),
    String(row.link || ""),
  ]);
}

function updateRow_(row) {
  if (!row.id) throw new Error("Row id is required.");

  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i += 1) {
    if (String(values[i][0]) === String(row.id)) {
      sheet.getRange(i + 1, 2).setValue(String(row.name || ""));
      sheet.getRange(i + 1, 3).setValue(String(row.login || ""));
      sheet.getRange(i + 1, 4).setValue(String(row.passwordHint || ""));
      sheet.getRange(i + 1, 5).setValue(String(row.link || ""));
      return;
    }
  }

  throw new Error("Row not found.");
}

function deleteRow_(id) {
  if (!id) throw new Error("Row id is required.");

  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i += 1) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }

  throw new Error("Row not found.");
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Sheet not found.");
  return sheet;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
