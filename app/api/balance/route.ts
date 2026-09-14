import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";
import { runEngine, EngineNotConfigured } from "@/lib/engines";
import type { CheckResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * פרטי הכרטיס נשלחים לכאן, מועברים למנפיק, ולא נשמרים בשום מקום.
 * אין DB, אין לוגים של מספרי כרטיסים.
 */
export async function POST(req: Request): Promise<NextResponse<CheckResponse>> {
  let payload: { providerId?: string; cardNumber?: string; cvv?: string; pin?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ status: "error", message: "בקשה לא תקינה" }, { status: 400 });
  }

  const { providerId, cardNumber, cvv, pin } = payload;
  const provider = providerId ? getProvider(providerId) : undefined;

  if (!provider) {
    return NextResponse.json({ status: "error", message: "ספק לא מוכר" }, { status: 400 });
  }
  if (!cardNumber) {
    return NextResponse.json({ status: "error", message: "חסר מספר כרטיס" }, { status: 400 });
  }

  const manual: CheckResponse = {
    status: "manual",
    balanceUrl: provider.balanceUrl ?? null,
    note: provider.note ?? null,
  };

  if (!provider.engine) return NextResponse.json(manual);

  try {
    const result = await runEngine(provider.engine, {
      cardNumber: cardNumber.replace(/[\s-]/g, ""),
      cvv,
      pin,
    });
    if (!result) {
      return NextResponse.json({
        status: "error",
        message: "הכרטיס לא זוהה. בדקו שהמספר מלא ושזה עמוד הבירור הנכון למותג.",
      });
    }
    return NextResponse.json({ status: "ok", balance: result.balance, expiresAt: result.expiresAt });
  } catch (err) {
    if (err instanceof EngineNotConfigured) return NextResponse.json(manual);
    const message = err instanceof Error ? err.message : "הבדיקה נכשלה";
    return NextResponse.json({ status: "error", message });
  }
}
