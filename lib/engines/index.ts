/**
 * מנועי בדיקת יתרה.
 * ------------------------------------------------------------------
 * לאף מנפיק בישראל אין API ציבורי לבדיקת יתרה. מה שיש זה עמוד ווב עם
 * טופס. לכן "בדיקה אוטומטית" פירושה: לשלוח מהשרת שלנו בדיוק את אותה
 * בקשה ששולח הדפדפן כשלוחצים על "בדוק יתרה", ולקרוא את התשובה.
 *
 * הבקשה הזו שונה אצל כל מנפיק, ואני לא יכול לנחש אותה — היא תלויה
 * בשמות שדות, בטוקן CSRF ולפעמים ב-CAPTCHA. לכן כל מנוע כאן מגיע
 * ריק, ואתם ממלאים אותו פעם אחת לפי המנפיקים שבאמת יש לכם.
 *
 * איך ממלאים (5 דקות למנפיק):
 *   1. פתחו את עמוד בירור היתרה של המנפיק בדפדפן.
 *   2. F12 → לשונית Network → סמנו Fetch/XHR.
 *   3. הזינו מספר כרטיס אמיתי ולחצו "בדוק יתרה".
 *   4. מצאו את הבקשה שיצאה. Copy → Copy as fetch.
 *   5. העתיקו ממנה endpoint, headers ושמות השדות לקונפיג למטה.
 *   6. הריצו את התשובה דרך parse כדי לחלץ את הסכום.
 *
 * שימו לב: גרידה של אתר צד שלישי עשויה לנגוד את תנאי השימוש שלו,
 * והיא נשברת בכל פעם שהאתר משתנה. מצב "link" (פתיחת העמוד עם המספר
 * מועתק ללוח) עובד תמיד ולא נשבר. זו ברירת המחדל כאן בכוונה.
 */

export interface EngineInput {
  cardNumber: string;
  cvv?: string;
  pin?: string;
}

export interface EngineResult {
  balance: number;
  expiresAt?: string;
}

export class EngineNotConfigured extends Error {
  constructor(id: string) {
    super(`engine "${id}" is not configured yet`);
    this.name = "EngineNotConfigured";
  }
}

export interface EngineConfig {
  id: string;
  label: string;
  /** ה-endpoint האמיתי מלשונית Network. ריק = המנוע לא מוגדר. */
  endpoint: string;
  method?: "POST" | "GET";
  encoding?: "form" | "json";
  headers?: Record<string, string>;
  /** ממפה את פרטי הכרטיס לשמות השדות שהאתר מצפה להם. */
  buildBody?: (input: EngineInput) => Record<string, string>;
  /** מחלץ סכום מגוף התשובה. מחזיר null אם הכרטיס לא זוהה. */
  parse?: (body: string) => EngineResult | null;
}

/** מוצא סכום בשקלים בתוך HTML או JSON. עוזר לרוב העמודים. */
export function parseShekels(body: string): number | null {
  const patterns = [
    /"balance"\s*:\s*"?(-?[\d,]+(?:\.\d{1,2})?)"?/i,
    /₪\s*(-?[\d,]+(?:\.\d{1,2})?)/,
    /(-?[\d,]+(?:\.\d{1,2})?)\s*₪/,
    /(?:יתרה|היתרה)[^\d\-]{0,30}(-?[\d,]+(?:\.\d{1,2})?)/,
  ];
  for (const re of patterns) {
    const m = body.match(re);
    if (m) {
      const n = Number(m[1].replace(/,/g, ""));
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

export const ENGINES: Record<string, EngineConfig> = {
  multipass: {
    id: "multipass",
    label: "מולטיפאס (מכסה גם סופר-פארם, תו פלוס, קסטרו)",
    endpoint: "", // ← מלאו מ-DevTools. מכסה 4 מותגים בבת אחת.
  },
  isracard: {
    id: "isracard",
    label: "ישראכרט (מכסה גם רמי לוי, שופרסל, ויקטורי פיזי)",
    endpoint: "",
  },
  cal: {
    id: "cal",
    label: "כאל (פייטר, כרטיס שדה)",
    endpoint: "",
  },
  praxell: {
    id: "praxell",
    label: "פרקסל (גולף, שילב, LOVE CARD)",
    endpoint: "",
  },
};

/**
 * דוגמה מלאה לקונפיג מוגדר. העתיקו את המבנה למנוע שאתם ממלאים:
 *
 * ENGINES.multipass = {
 *   id: "multipass",
 *   label: "מולטיפאס",
 *   endpoint: "https://multipass.co.il/api/GetBalance",
 *   method: "POST",
 *   encoding: "json",
 *   headers: { "Accept": "application/json" },
 *   buildBody: ({ cardNumber }) => ({ cardNumber }),
 *   parse: (body) => {
 *     const n = parseShekels(body);
 *     return n === null ? null : { balance: n };
 *   },
 * };
 */

export async function runEngine(
  engineId: string,
  input: EngineInput
): Promise<EngineResult | null> {
  const cfg = ENGINES[engineId];
  if (!cfg || !cfg.endpoint || !cfg.buildBody || !cfg.parse) {
    throw new EngineNotConfigured(engineId);
  }

  const method = cfg.method ?? "POST";
  const encoding = cfg.encoding ?? "form";
  const fields = cfg.buildBody(input);

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
    "Accept-Language": "he-IL,he;q=0.9",
    ...cfg.headers,
  };

  let url = cfg.endpoint;
  let body: string | undefined;

  if (method === "GET") {
    url += (url.includes("?") ? "&" : "?") + new URLSearchParams(fields).toString();
  } else if (encoding === "json") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(fields);
  } else {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(fields).toString();
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`${cfg.label}: HTTP ${res.status}`);
  return cfg.parse(await res.text());
}
