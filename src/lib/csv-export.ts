/**
 * CSV Export Utility
 * Converts array of objects to CSV and triggers download
 */

export function downloadCSV<T extends object>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Extract headers from first row
  const headers = Object.keys(data[0]);

  // Build CSV rows
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.map((h) => escapeCSVValue(h)).join(","));

  // Add data rows
  for (const row of data) {
    const record = row as Record<string, unknown>;
    const values = headers.map((header) => {
      const val = record[header];
      return escapeCSVValue(val);
    });
    csvRows.push(values.join(","));
  }

  // Create CSV string
  const csvString = csvRows.join("\n");

  // Create blob and trigger download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Escape CSV value (handle commas, quotes, newlines, and object/array serialization)
 */
function escapeCSVValue(val: unknown): string {
  if (val === null || val === undefined) {
    return "";
  }

  // Handle Firestore timestamps (check before generic object serialization)
  if (
    typeof val === "object" &&
    val !== null &&
    "seconds" in val &&
    typeof (val as { seconds: number }).seconds === "number"
  ) {
    const date = new Date((val as { seconds: number }).seconds * 1000);
    return escapeCSVValue(date.toISOString());
  }

  // Handle other objects/arrays by serializing to JSON
  if (typeof val === "object") {
    return escapeCSVValue(JSON.stringify(val));
  }

  // Convert to string
  let strVal = String(val);

  // Escape quotes by doubling them
  strVal = strVal.replace(/"/g, '""');

  // Wrap in quotes if contains comma, quote, or newline
  if (strVal.includes(",") || strVal.includes('"') || strVal.includes("\n")) {
    strVal = `"${strVal}"`;
  }

  return strVal;
}
