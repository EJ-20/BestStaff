import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Option, Badge } from "../types/basic";

export default function RecognizePage() {
  const [employees, setEmployees] = useState<Option[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [badgeCode, setBadgeCode] = useState<string>("");
  const [points, setPoints] = useState<number>(25);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // you should already have these endpoints:
        // GET /api/employees (list), GET /api/badges (list)
        const [emps, bgs] = await Promise.all([
          api.get<Option[]>("/api/employees"),
          api.get<Badge[]>("/api/badges"),
        ]);
        setEmployees(emps);
        setBadges(bgs);
        if (emps.length) setReceiverId(emps[0].id);
        if (bgs.length) setBadgeCode(bgs[0].code);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!receiverId) return setError("Please choose a recipient");
    try {
      setSubmitting(true);
      setError(null);
      await api.post("/api/recognitions", { receiverId, badgeCode, points, note });
      setNote("");
      alert("Recognition sent! 🎉");
    } catch (e: any) {
      setError(e?.message ?? "Failed to send recognition");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Send Recognition</h2>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="To">
            <select className="input" value={receiverId ?? ""} onChange={e => setReceiverId(Number(e.target.value))}>
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name}{e.department ? ` — ${e.department}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Badge">
            <select className="input" value={badgeCode} onChange={e => setBadgeCode(e.target.value)}>
              {badges.map(b => (
                <option key={b.code} value={b.code}>
                  {b.name} (+{b.points})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Points">
            <input
              className="input"
              type="number"
              min={5}
              max={200}
              step={5}
              value={points}
              onChange={e => setPoints(Number(e.target.value))}
            />
          </Field>
        </div>
        <Field label="Message">
          <textarea
            className="input min-h-[96px]"
            placeholder="Say thanks…"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <button disabled={submitting} type="submit" className="btn-primary">
            {submitting ? "Sending…" : "Send"}
          </button>
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
