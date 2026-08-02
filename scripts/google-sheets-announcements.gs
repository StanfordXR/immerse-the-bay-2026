/**
 * Immerse the Bay — Live announcements auto timestamp
 *
 * Setup:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this entire file (replace any existing code)
 * 4. Save → Run once → authorize when prompted
 * 5. Row 1 headers: Date | Time | Message
 *
 * Organizers only type in column C (Message). Date and time stamp automatically.
 */
function onEdit(e) {
  if (!e) return;

  const sheet = e.source.getActiveSheet();
  const row = e.range.getRow();
  if (row <= 1) return;

  // Column C = Message
  if (e.range.getColumn() !== 3) return;

  const message = String(e.range.getValue() || "").trim();
  if (!message) return;

  const dateCell = sheet.getRange(row, 1);
  const timeCell = sheet.getRange(row, 2);

  // Stamp once per row (won't overwrite if you edit the message later)
  if (dateCell.getValue() && timeCell.getValue()) return;

  const now = new Date();
  const tz = "America/Los_Angeles";

  dateCell.setValue(Utilities.formatDate(now, tz, "M/d/yyyy"));
  timeCell.setValue(Utilities.formatDate(now, tz, "h:mm a"));
}
