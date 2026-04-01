/**
 * iCal (.ics) file generation utility
 * Generates iCalendar format strings for event downloads
 */

interface ICalEvent {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO date string or "YYYY-MM-DD"
  endDate?: string; // ISO date string or "YYYY-MM-DD"
  startTime?: string; // "HH:MM" format
  endTime?: string; // "HH:MM" format
}

/**
 * Format a date-time for iCal format (YYYYMMDDTHHMMSSZ)
 * If time is provided, combine date and time. Otherwise, use date-only format (YYYYMMDD)
 */
function formatICalDateTime(date: string, time?: string): string {
  // Remove any dashes from date
  const dateOnly = date.replace(/-/g, "");

  if (time) {
    // Combine date and time (assuming local time, not UTC)
    const timeOnly = time.replace(/:/g, "");
    return `${dateOnly}T${timeOnly}00`;
  }

  // Date-only format (all-day event)
  return dateOnly;
}

/**
 * Escape text for iCal format
 * Replace newlines with \n and escape special characters
 */
export function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generate a unique UID for the event
 */
function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@mandirstockholm.com`;
}

/**
 * Generate an iCal (.ics) file content string for a single event
 */
export function generateICalEvent(event: ICalEvent): string {
  const uid = generateUID();
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  // Determine start and end date-times
  const dtstart = formatICalDateTime(event.startDate, event.startTime);
  const dtend = event.endDate
    ? formatICalDateTime(event.endDate, event.endTime)
    : formatICalDateTime(event.startDate, event.endTime);

  // Build iCal content
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hindu Mandir Stockholm//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeICalText(event.title)}`,
    `DESCRIPTION:${escapeICalText(event.description)}`,
    `LOCATION:${escapeICalText(event.location)}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

/**
 * Trigger a download of an iCal file in the browser
 */
export function downloadICalFile(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
