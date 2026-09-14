"use client";

import { useState } from "react";
import type { GiftCard } from "@/lib/types";
import { PROVIDERS, getProvider } from "@/lib/providers";
import { newId } from "@/lib/storage";

interface Props {
  initial?: GiftCard;
  onSave: (card: GiftCard) => void;
  onCancel: () => void;
}

const field =
  "w-full rounded-lg border border-foil bg-card px-3 py-2 text-[15px] focus:border-ink focus:outline-none";
const labelCls = "block text-[13px] text-slate2 mb-1";

export default function CardForm({ initial, onSave, onCancel }: Props) {
  const [providerId, setProviderId] = useState(initial?.providerId ?? "buyme");
  const [customProviderName, setCustom] = useState(initial?.customProviderName ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [cardNumber, setCardNumber] = useState(initial?.cardNumber ?? "");
  const [cvv, setCvv] = useState(initial?.cvv ?? "");
  const [pin, setPin] = useState(initial?.pin ?? "");
  const [initialAmount, setInitialAmount] = useState(initial?.initialAmount?.toString() ?? "");
  const [balance, setBalance] = useState(initial?.balance?.toString() ?? "");
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const provider = getProvider(providerId);

  function submit() {
    if (!cardNumber.trim()) return;
    const parsedBalance = balance.trim() === "" ? undefined : Number(balance);
    onSave({
      id: initial?.id ?? newId(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      providerId,
      customProviderName: providerId === "custom" ? customProviderName.trim() || undefined : undefined,
      label: label.trim() || undefined,
      cardNumber: cardNumber.trim(),
      cvv: cvv.trim() || undefined,
      pin: pin.trim() || undefined,
      initialAmount: initialAmount.trim() === "" ? undefined : Number(initialAmount),
      balance: Number.isFinite(parsedBalance as number) ? parsedBalance : initial?.balance,
      balanceCheckedAt:
        parsedBalance !== undefined && parsedBalance !== initial?.balance
          ? new Date().toISOString()
          : initial?.balanceCheckedAt,
      expiresAt: expiresAt || undefined,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div className="bg-card rounded-tile shadow-tile p-5">
      <h2 className="font-display text-[22px] mb-4">
        {initial ? "עריכת כרטיס" : "הוספת כרטיס"}
      </h2>

      <div className="grid gap-4">
        <div>
          <label className={labelCls} htmlFor="provider">
            מנפיק
          </label>
          <select
            id="provider"
            className={field}
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {provider?.note && (
            <p className="mt-1.5 text-[12.5px] leading-snug text-slate2">{provider.note}</p>
          )}
        </div>

        {providerId === "custom" && (
          <div>
            <label className={labelCls} htmlFor="customname">
              שם המנפיק
            </label>
            <input
              id="customname"
              className={field}
              value={customProviderName}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="לדוגמה: גיפט קארד של המשביר"
            />
          </div>
        )}

        <div>
          <label className={labelCls} htmlFor="cardnumber">
            מספר הכרטיס
          </label>
          <input
            id="cardnumber"
            className={`${field} cardnum`}
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="ברצף, בלי רווחים ובלי מקפים"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} htmlFor="cvv">
              CVV (אם יש)
            </label>
            <input id="cvv" className={field} inputMode="numeric" value={cvv} onChange={(e) => setCvv(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="pin">
              קוד / PIN (אם יש)
            </label>
            <input id="pin" className={field} value={pin} onChange={(e) => setPin(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} htmlFor="initial">
              סכום מקורי
            </label>
            <input
              id="initial"
              className={field}
              inputMode="decimal"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="₪"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="balance">
              יתרה ידועה
            </label>
            <input
              id="balance"
              className={field}
              inputMode="decimal"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="אפשר להשאיר ריק"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} htmlFor="expiry">
              תוקף
            </label>
            <input
              id="expiry"
              type="date"
              className={field}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="label">
              כינוי
            </label>
            <input
              id="label"
              className={field}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="מתנה מהעבודה"
            />
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="notes">
            הערות
          </label>
          <textarea
            id="notes"
            className={field}
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="קישור אישי לשובר, טלפון לבירור, איפה מממשים"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={submit}
          disabled={!cardNumber.trim()}
          className="rounded-full bg-ink text-paper text-[14px] font-500 px-5 py-2.5 disabled:opacity-40"
        >
          שמירת הכרטיס
        </button>
        <button onClick={onCancel} className="rounded-full text-[14px] text-slate2 px-4 py-2.5">
          ביטול
        </button>
      </div>
    </div>
  );
}
