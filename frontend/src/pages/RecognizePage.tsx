import { useState } from "react";
import { fakeEmployees, fakeBadges, sendRecognition } from "../services/fakeApi";

export default function RecognizePage() {
  const [receiverId, setReceiverId] = useState<number>(fakeEmployees[1].id);
  const [badgeCode, setBadgeCode] = useState<string>(fakeBadges[0].code);
  const [points, setPoints] = useState<number>(25);
  const [note, setNote] = useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendRecognition({ receiverId, badgeCode, points, note });
    alert("Recognition sent! 🎉");
    setNote("");
  }

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Send Recognition</h2>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="To">
            <select className="input" value={receiverId} onChange={e => setReceiverId(Number(e.target.value))}>
              {fakeEmployees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.department}</option>)}
            </select>
          </Field>
          <Field label="Badge">
            <select className="input" value={badgeCode} onChange={e => setBadgeCode(e.target.value)}>
              {fakeBadges.map(b => <option key={b.code} value={b.code}>{b.name} (+{b.points})</option>)}
            </select>
          </Field>
          <Field label="Points">
            <input className="input" type="number" min={5} max={200} step={5} value={points}
                   onChange={e => setPoints(Number(e.target.value))}/>
          </Field>
        </div>
        <Field label="Message">
          <textarea className="input min-h-[96px]" placeholder="Say thanks…" value={note} onChange={e => setNote(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="submit" className="btn-primary">Send</button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-neutral-600">{label}</span>
      {children}
    </label>
  );
}
