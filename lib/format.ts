export function shekels(n: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function plainNumber(n: number): string {
  return new Intl.NumberFormat("he-IL", {
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function agoHe(iso?: string): string {
  if (!iso) return "לא נבדק מעולם";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "נבדק עכשיו";
  if (mins < 60) return `נבדק לפני ${mins} דק׳`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `נבדק לפני ${hours} שע׳`;
  const days = Math.round(hours / 24);
  if (days === 1) return "נבדק אתמול";
  if (days < 30) return `נבדק לפני ${days} ימים`;
  const months = Math.round(days / 30);
  return `נבדק לפני ${months} חודשים`;
}

/** ימים עד התפוגה. שלילי = כבר פג. */
export function daysUntil(isoDate?: string): number | null {
  if (!isoDate) return null;
  const then = new Date(isoDate + "T23:59:59").getTime();
  if (!Number.isFinite(then)) return null;
  return Math.ceil((then - Date.now()) / 86400000);
}

export function expiryLabel(isoDate?: string): { text: string; tone: "ok" | "warn" | "dead" } | null {
  const d = daysUntil(isoDate);
  if (d === null) return null;
  if (d < 0) return { text: "פג תוקף", tone: "dead" };
  if (d === 0) return { text: "פג היום", tone: "warn" };
  if (d <= 30) return { text: `פג בעוד ${d} ימים`, tone: "warn" };
  const date = new Date(isoDate!).toLocaleDateString("he-IL", { month: "long", year: "numeric" });
  return { text: `בתוקף עד ${date}`, tone: "ok" };
}

/** 1234567890123 → 1234 5678 9012 3 */
export function groupCardNumber(s: string): string {
  return s.replace(/[\s-]/g, "").replace(/(.{4})/g, "$1 ").trim();
}
