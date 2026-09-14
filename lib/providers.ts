import type { Provider } from "./types";

/**
 * מנפיקים נפוצים בישראל.
 *
 * mode:
 *   auto    – יש מנוע בדיקה מוגדר ב-lib/engines, האפליקציה בודקת לבד.
 *   link    – יש עמוד בירור רשמי פתוח. פתיחה בלחיצה + המספר מועתק ללוח.
 *   login   – יש בירור מקוון אבל רק אחרי הזדהות. אי אפשר לאוטמט בלי החשבון שלך.
 *   offline – אין בירור מקוון בכלל. טלפון או קופה.
 *
 * כמה מותגים חולקים אותה מערכת בירור (מולטיפאס, פרקסל, ישראכרט, כאל).
 * לכן מנוע אחד מכסה כמה מותגים — ראו lib/engines.
 */
export const PROVIDERS: Provider[] = [
  {
    id: "buyme",
    name: "BuyMe (ביימי)",
    color: "#E5254B",
    balanceUrl: "https://buyme.co.il/",
    mode: "link",
    fields: ["cardNumber"],
    note: 'הדרך הכי אמינה היא הקישור האישי שהגיע ב-SMS. אפשר לשמור אותו בשדה "קישור אישי".',
  },
  {
    id: "tav-hazahav",
    name: "תו הזהב",
    color: "#C9A227",
    mode: "offline",
    fields: ["cardNumber"],
    note: "אין עמוד בירור פתוח. באפליקציה הרשמית, ב-PayBox, בקופה או בתחתית הקבלה.",
  },
  {
    id: "multipass",
    name: "מולטיפאס",
    color: "#0B5BA8",
    balanceUrl: "https://multipass.co.il/GetBalance",
    mode: "link",
    engine: "multipass",
    fields: ["cardNumber"],
    note: "דורש את מספר הכרטיס המלא, ברצף, בלי רווחים ובלי מקפים.",
  },
  {
    id: "isracard",
    name: "גיפט קארד ישראכרט",
    color: "#1B3A6B",
    balanceUrl: "https://finance.isracard.co.il/anonymouscards",
    mode: "link",
    engine: "isracard",
    fields: ["cardNumber"],
    note: "מה שקובע הוא הלוגו בגב הכרטיס. כרטיסים של שופרסל, ויקטורי ורמי לוי מסולקים כאן.",
  },
  {
    id: "rami-levy",
    name: "התו המלא – רמי לוי",
    color: "#E03A1E",
    balanceUrl: "https://finance.isracard.co.il/anonymouscards",
    mode: "link",
    engine: "isracard",
    fields: ["cardNumber"],
    note: "כרטיס פיזי נבדק בישראכרט, תו דיגיטלי נבדק במולטיפאס. עמוד לא נכון מחזיר «לא מזוהה».",
  },
  {
    id: "max-giftcard",
    name: "גיפט קארד מקס",
    color: "#00A0AF",
    balanceUrl: "https://www.max.co.il/gift-card-transactions/main",
    mode: "link",
    fields: ["cardNumber"],
    note: "הכתובת הישנה online.max.co.il כבר לא בשימוש.",
  },
  {
    id: "fighter",
    name: "פייטר (כאל)",
    color: "#2E3192",
    balanceUrl: "https://card-info.cal-platform.com/",
    mode: "link",
    engine: "cal",
    fields: ["cardNumber"],
  },
  {
    id: "sade",
    name: "כרטיס שדה",
    color: "#4A5D3A",
    balanceUrl: "https://card-info.cal-platform.com/",
    mode: "link",
    engine: "cal",
    fields: ["cardNumber"],
  },
  {
    id: "super-pharm",
    name: "גיפט קארד סופר-פארם",
    color: "#E5007D",
    balanceUrl: "https://superpharm-balance.mltp.co.il/",
    mode: "link",
    engine: "multipass",
    fields: ["cardNumber"],
  },
  {
    id: "tav-plus",
    name: "תו פלוס (קרפור)",
    color: "#0057A8",
    balanceUrl: "https://tavplus.mltp.co.il/",
    mode: "link",
    engine: "multipass",
    fields: ["cardNumber"],
  },
  {
    id: "castro",
    name: "כרטיס מתנה קסטרו",
    color: "#1A1A1A",
    balanceUrl: "https://castrobalance.mltp.co.il/",
    mode: "link",
    engine: "multipass",
    fields: ["cardNumber"],
  },
  {
    id: "zara",
    name: "גיפט קארד זארה",
    color: "#000000",
    balanceUrl: "https://www.zara.com/il/he/z-zara-card/balance",
    mode: "link",
    fields: ["cardNumber", "cvv"],
    note: "העמוד דורש גם CVV קצר מהכרטיס, לא רק את המספר. מציג גם תוקף ותנועות אחרונות.",
  },
  {
    id: "praxell",
    name: "פרקסל / גולף / שילב / LOVE CARD",
    color: "#6B4E9E",
    balanceUrl: "https://www.praxellpayroll.com/cardbalance/giftcardgeneral.php",
    mode: "link",
    engine: "praxell",
    fields: ["cardNumber", "cvv"],
  },
  {
    id: "nofshonit",
    name: "נופשונית (סוויש)",
    color: "#F5A623",
    balanceUrl: "https://swish.co.il/home/balance-inquiry",
    mode: "link",
    fields: ["cardNumber"],
    note: "הדומיין הישן nofshonit.co.il מפנה ל-swish.co.il. כרטיסים ותיקים ממשיכים לעבוד.",
  },
  {
    id: "dream-card",
    name: "דרים קארד",
    color: "#7B2D8E",
    balanceUrl: "https://online.dreamcard.co.il/auth/login",
    mode: "login",
    fields: ["cardNumber"],
    note: "הבירור האנונימי בוטל. נדרש אזור אישי עם קוד חד-פעמי, ולכן אי אפשר לבדוק אוטומטית.",
  },
  {
    id: "rav-kav",
    name: "רב קו",
    color: "#008C5A",
    balanceUrl: "https://ravkavonline.co.il/he/",
    mode: "link",
    fields: ["cardNumber"],
  },
  {
    id: "azrieli",
    name: "עזריאלי גיפטקארד",
    color: "#C8102E",
    mode: "offline",
    fields: ["cardNumber"],
    note: "אין עמוד בירור. טלפונית מול BUYME: 03-3737117.",
  },
  {
    id: "victory",
    name: "תו הקנייה ויקטורי",
    color: "#D42027",
    mode: "offline",
    fields: ["cardNumber"],
    note: "אין עמוד בירור. טלפונית: 08-8674994 שלוחה 157.",
  },
  {
    id: "shufersal",
    name: "כרטיסי שופרסל",
    color: "#E30613",
    mode: "offline",
    fields: ["cardNumber"],
    note: "שלושה מוצרים שונים (תו הזהב, גיפט קארד, S.card) ולכל אחד דרך בירור אחרת.",
  },
  {
    id: "hever",
    name: "מועדון חבר",
    color: "#134E7A",
    mode: "login",
    fields: ["cardNumber"],
    note: "רק באזור האישי אחרי הזדהות של חבר מועדון.",
  },
  {
    id: "custom",
    name: "אחר / כרטיס שלא ברשימה",
    color: "#5A6472",
    mode: "offline",
    fields: ["cardNumber", "cvv", "pin"],
    note: "אפשר להוסיף קישור בירור משלכם בשדה ההערות.",
  },
];

export const PROVIDER_MAP: Record<string, Provider> = Object.fromEntries(
  PROVIDERS.map((p) => [p.id, p])
);

export function getProvider(id: string): Provider | undefined {
  return PROVIDER_MAP[id];
}

export function providerName(providerId: string, custom?: string): string {
  if (providerId === "custom" && custom) return custom;
  return getProvider(providerId)?.name ?? "כרטיס";
}

export function providerColor(providerId: string): string {
  return getProvider(providerId)?.color ?? "#5A6472";
}
