"use client";

import { useEffect, useMemo, useState } from "react";
import type { GiftCard } from "@/lib/types";
import { loadCards, saveCards, exportCards } from "@/lib/storage";
import { plainNumber, daysUntil } from "@/lib/format";
import CardTile from "@/components/CardTile";
import CardForm from "@/components/CardForm";

export default function Page() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<GiftCard | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setCards(loadCards());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveCards(cards);
  }, [cards, ready]);

  const stats = useMemo(() => {
    const known = cards.filter((c) => typeof c.balance === "number");
    const total = known.reduce((sum, c) => sum + (c.balance ?? 0), 0);
    const unknown = cards.length - known.length;
    const expiringSoon = cards.filter((c) => {
      const d = daysUntil(c.expiresAt);
      return d !== null && d >= 0 && d <= 30;
    }).length;
    return { total, unknown, expiringSoon, count: cards.length };
  }, [cards]);

  function upsert(card: GiftCard) {
    setCards((prev) => {
      const i = prev.findIndex((c) => c.id === card.id);
      if (i === -1) return [card, ...prev];
      const next = [...prev];
      next[i] = card;
      return next;
    });
    setEditing(null);
    setAdding(false);
  }

  function patch(id: string, p: Partial<GiftCard>) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...p } : c)));
  }

  function remove(id: string) {
    const card = cards.find((c) => c.id === id);
    if (!confirm(`למחוק את הכרטיס${card?.label ? ` "${card.label}"` : ""}? אי אפשר לשחזר.`)) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <main className="mx-auto max-w-[680px] px-4 pb-24 pt-8">
      <header className="mb-8">
        <p className="text-[13px] text-slate2">הארנק שלי</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-[54px] leading-[1] tracking-tight">
            {ready ? plainNumber(stats.total) : "—"}
          </span>
          <span className="font-display text-[28px] text-slate2">₪</span>
        </div>
        <p className="mt-2 text-[14px] text-slate2">
          {stats.count === 0
            ? "עוד אין כרטיסים"
            : `${stats.count} כרטיסים${stats.unknown ? `, ${stats.unknown} מהם עם יתרה לא ידועה` : ""}`}
          {stats.expiringSoon > 0 && (
            <span className="text-alert"> · {stats.expiringSoon} פגים בתוך חודש</span>
          )}
        </p>
      </header>

      {adding || editing ? (
        <CardForm
          initial={editing ?? undefined}
          onSave={upsert}
          onCancel={() => {
            setAdding(false);
            setEditing(null);
          }}
        />
      ) : (
        <div className="mb-5 flex items-center gap-2">
          <button
            onClick={() => setAdding(true)}
            className="rounded-full bg-ink text-paper text-[14px] font-500 px-5 py-2.5"
          >
            הוספת כרטיס
          </button>
          {cards.length > 0 && (
            <button
              onClick={() => exportCards(cards)}
              className="rounded-full text-[14px] text-slate2 px-4 py-2.5 hover:text-ink"
            >
              גיבוי לקובץ
            </button>
          )}
        </div>
      )}

      {ready && cards.length === 0 && !adding && (
        <div className="rounded-tile border border-dashed border-foil p-8 text-center">
          <p className="font-display text-[20px]">כאן ייערמו הכרטיסים</p>
          <p className="mt-2 text-[14px] text-slate2 leading-relaxed">
            הוסיפו את הכרטיס הראשון עם המספר שלו. היתרה תישאר מוסתרת עד לבדיקה ראשונה.
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {cards.map((card) => (
          <CardTile
            key={card.id}
            card={card}
            onUpdate={(p) => patch(card.id, p)}
            onEdit={() => {
              setEditing(card);
              setAdding(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={() => remove(card.id)}
          />
        ))}
      </div>

      <footer className="mt-10 text-[12px] text-slate2 leading-relaxed">
        הנתונים נשמרים בדפדפן הזה בלבד. מספרי הכרטיסים עוזבים את המכשיר רק ברגע בדיקת היתרה,
        ואינם נשמרים בשרת.
      </footer>
    </main>
  );
}
