export type CheckMode = "auto" | "link" | "login" | "offline";

export interface Provider {
  id: string;
  name: string;
  /** Tile colour. Keep these saturated — the tile is the card. */
  color: string;
  /** Official balance-inquiry page, when one exists. */
  balanceUrl?: string;
  mode: CheckMode;
  /** Key into lib/engines when mode === "auto". */
  engine?: string;
  fields: Array<"cardNumber" | "cvv" | "pin">;
  note?: string;
}

export interface GiftCard {
  id: string;
  providerId: string;
  customProviderName?: string;
  /** Free-text reminder: "מתנה מהעבודה", "יום הולדת 2025". */
  label?: string;
  cardNumber: string;
  cvv?: string;
  pin?: string;
  initialAmount?: number;
  balance?: number;
  balanceCheckedAt?: string;
  /** ISO date, yyyy-mm-dd. */
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  archived?: boolean;
}

export type CheckResponse =
  | { status: "ok"; balance: number; expiresAt?: string }
  | { status: "manual"; balanceUrl: string | null; note: string | null }
  | { status: "error"; message: string };
