"use client";

import { useState } from "react";
import type { GiftCard, CheckResponse } from "@/lib/types";
import { getProvider, providerName, providerColor } from "@/lib/providers";
import { shekels, agoHe, expiryLabel, groupCardNumber } from "@/lib/format";

interface Props {
  card: GiftCard;
  onUpdate: (patch: Partial<GiftCard>) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CardTile({ card, onUpdate, onEdit, onDelete }: Props) {
  const provider = getProvider(card.providerId);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const known = typeof card.balance === "number";
  const expiry = expiryLabel(card.expiresAt);
  const color = providerColor(card.providerId);

  async function copyNumber() {
    await navigator.clipboard.writeText(card.cardNumber.replace(/[\s-]/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function check() {
    setChecking(true);
    setMessage(null);
    try {
      const res = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: card.providerId,
          cardNumber: card.cardNumber,
          cvv: card.cvv,
          pin: card.pin,
        }),
      });
      const data: CheckResponse = await res.json();

      if (data.status === "ok") {
        onUpdate({ balance: data.balance, balanceCheckedAt: new Date().toISOString() });
        setMessage(null);
      } else if (data.status === "manual") {
        if (data.balanceUrl) {
          await copyNumber();
          window.open(data.balanceUrl, "_blank", "noopener");
          setMessage("המספר הועתק. הדביקו אותו בעמוד שנפתח ועדכנו את היתרה כאן.");
        } else {
          setMessage(data.note ?? "למנפיק הזה אין בירור מקוון. בדקו בקופה או טלפונית.");
        }
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("הבדיקה נכשלה. נסו שוב או פתחו את עמוד המנפיק ידנית.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <article className="relative bg-card rounded-tile shadow-tile overflow-hidden">
      <span aria-hidden className="absolute inset-y-0 right-0 w-[6px]" style={{ background: color }} />

      <div className="ps-4 pe-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-500 leading-tight truncate">
              {providerName(card.providerId, card.customProviderName)}
            </h3>
            {card.label && <p className="text-[13px] text-slate2 truncate">{card.label}</p>}
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={onEdit} className="text-[13px] text-slate2 hover:text-ink px-1.5 py-0.5">
              עריכה
            </button>
            <button
              onClick={onDelete}
              className="text-[13px] text-slate2 hover:text-alert px-1.5 py-0.5"
              aria-label="מחיקת הכרטיס"
            >
              מחיקה
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <div className="scratch inline-block" data-revealed={known}>
              <span
                className="block font-display text-[30px] leading-none py-1 px-1"
                aria-hidden={!known}
              >
                {known ? shekels(card.balance!) : "‎₪ ---"}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-slate2">
              {known ? agoHe(card.balanceCheckedAt) : "היתרה עדיין לא ידועה"}
              {typeof card.initialAmount === "number" && known && card.initialAmount > card.balance! && (
                <span className="text-slate2"> · מתוך {shekels(card.initialAmount)}</span>
              )}
            </p>
          </div>

          <button
            onClick={check}
            disabled={checking}
            className="shrink-0 rounded-full bg-ink text-paper text-[13px] font-500 px-4 py-2 disabled:opacity-50"
          >
            {checking ? "בודק…" : known ? "רענון יתרה" : "בדיקת יתרה"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
          <button
            onClick={copyNumber}
            className="cardnum bg-paper rounded px-2 py-1 hover:bg-foilhi"
            title="העתקת המספר"
          >
            {groupCardNumber(card.cardNumber)}
          </button>
          {copied && <span className="text-signal font-500">הועתק</span>}
          {card.cvv && <span className="text-slate2">CVV {card.cvv}</span>}
          {expiry && (
            <span
              className={
                expiry.tone === "dead"
                  ? "text-alert font-500"
                  : expiry.tone === "warn"
                  ? "text-alert"
                  : "text-slate2"
              }
            >
              {expiry.text}
            </span>
          )}
        </div>

        {message && (
          <p className="mt-3 text-[12.5px] leading-snug text-slate2 border-t border-paper pt-2.5">
            {message}
            {provider?.balanceUrl && (
              <>
                {" "}
                <a
                  href={provider.balanceUrl}
                  target="_blank"
                  rel="noopener"
                  className="underline text-ink"
                >
                  פתיחת עמוד הבירור
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </article>
  );
}
