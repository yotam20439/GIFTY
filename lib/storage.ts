import type { GiftCard } from "./types";

const KEY = "kartisim.cards.v1";

/**
 * הכול נשמר בדפדפן בלבד. מספרי הכרטיסים לא עוזבים את המכשיר,
 * חוץ מרגע בדיקת היתרה. להחלפה ב-Vercel Postgres בעתיד — ראו README.
 */
export function loadCards(): GiftCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GiftCard[]) : [];
  } catch {
    return [];
  }
}

export function saveCards(cards: GiftCard[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(cards));
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function exportCards(cards: GiftCard[]): void {
  const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kartisim-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
