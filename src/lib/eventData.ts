/**
 * Shared event data used as fallback when Firestore events are not available.
 * This is the single source of truth for hardcoded sample events,
 * used by both the events page and the homepage upcoming events section.
 */

export type EventCategory = "all" | "puja" | "festival" | "cultural";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  emoji: string;
}

export const sampleEvents: readonly EventItem[] = [
  {
    id: "lohri",
    title: "Lohri",
    description:
      "Celebrate the Punjabi harvest festival with bonfire, music, and traditional sweets. A joyful community gathering for all ages.",
    date: "2026-01-13",
    time: "17:00 \u2013 20:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "festival",
    emoji: "\uD83D\uDD25",
  },
  {
    id: "makar-sankranti",
    title: "Makar Sankranti / Pongol",
    description:
      "Celebrate the harvest festival marking the sun\u2019s transition into Capricorn. Join us for puja, traditional food, and community celebrations.",
    date: "2026-01-15",
    time: "11:00 \u2013 16:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "festival",
    emoji: "\u2600\uFE0F",
  },
  {
    id: "vasant-panchami",
    title: "Vasant Panchami",
    description:
      "Welcome spring with Saraswati Puja, celebrating the goddess of knowledge, music, and art. Special prayers and cultural program.",
    date: "2026-01-23",
    time: "11:00 \u2013 16:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "puja",
    emoji: "\uD83C\uDF3C",
  },
  {
    id: "padhuka-yatra",
    title: "Sri Kanchi Mahaperiyava Padhuka Yatra",
    description:
      "The Padhuka will be present at our Mandir. The regular evening Aarti will take place from 18:30 to 19:00, and the Padhuka Pooja will be performed thereafter. No registration required and no fee for darshan.",
    date: "2026-02-07",
    time: "17:00 \u2013 20:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "puja",
    emoji: "\uD83D\uDE4F",
  },
  {
    id: "maha-shivaratri",
    title: "Mahashivratri",
    description:
      "Join us for a community puja, bhajans and prasadam \u2014 all are welcome to celebrate the great night of Lord Shiva.",
    date: "2026-02-15",
    time: "09:00 \u2013 18:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "puja",
    emoji: "\uD83D\uDD31",
  },
  {
    id: "yoga-meditation",
    title: "Yoga & Meditation (Weekly Saturday Sessions)",
    description:
      "Weekly yoga session in collaboration with Yog Divya Mandir. We encourage everyone to participate. Kindly arrive a few minutes early and bring your own yoga mat.",
    date: "2026-02-14",
    time: "09:00 \u2013 10:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "cultural",
    emoji: "\uD83E\uDDD8",
  },
  {
    id: "holi-2026",
    title: "Holi \u2014 Festival of Colors",
    description:
      "Celebrate the vibrant festival of colors with music, dance, gulal, and traditional sweets. Fun for the whole family!",
    date: "2026-03-14",
    time: "12:00 \u2013 17:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "festival",
    emoji: "\uD83C\uDF08",
  },
  {
    id: "ram-navami-2026",
    title: "Ram Navami",
    description:
      "Celebrate the birth of Lord Rama with special puja, bhajans, and community prasadam. All are welcome.",
    date: "2026-03-26",
    time: "10:00 \u2013 15:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "puja",
    emoji: "\uD83C\uDF1E",
  },
  {
    id: "hanuman-jayanti-2026",
    title: "Hanuman Jayanti",
    description:
      "Join us for Hanuman Chalisa recitation and special puja honoring Lord Hanuman. Prasadam will be served.",
    date: "2026-04-04",
    time: "10:00 \u2013 14:00",
    location: "\u00c5kerv\u00e4gen 1, 191 40 Helenelund",
    category: "puja",
    emoji: "\uD83D\uDCAA",
  },
] as const;

/**
 * Returns only events that are on or after today's date.
 */
export function getUpcomingSampleEvents(): EventItem[] {
  const todayStr = new Date().toISOString().split("T")[0];
  return sampleEvents.filter(
    (event) =>
      new Date(event.date + "T00:00:00") >= new Date(todayStr + "T00:00:00"),
  );
}

/**
 * Returns the next N upcoming events, sorted by date ascending.
 */
export function getNextUpcomingEvents(count: number): EventItem[] {
  const upcoming = getUpcomingSampleEvents();
  const sorted = [...upcoming].sort(
    (a, b) =>
      new Date(a.date + "T00:00:00").getTime() -
      new Date(b.date + "T00:00:00").getTime(),
  );
  return sorted.slice(0, count);
}
