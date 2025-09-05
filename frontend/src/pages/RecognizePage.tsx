import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Employee } from "../types/employee";

// If you already have a Badge type, import it instead.
type Badge = {
  id: number;
  code: string;
  name: string;
  points: number;
  description?: string;
};

export default function RecognizePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Form state
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [badgeCode, setBadgeCode] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  // Load employees + badges
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [emp, bgs] = await Promise.all([
          api.get<Employee[]>("/api/employees"),
          api.get<Badge[]>("/api/badges"),
        ]);

        if (!mounted) return;

        setEmployees(emp);
        setBadges(bgs);

        // Initialize defaults
        const firstEmployee = emp[0]?.id ?? null;
        const firstBadge = bgs[0]?.code ?? "";
        setReceiverId(firstEmployee);
        setBadgeCode(firstBadge);

        // Default points to the badge's base points if present
        const badgePoints = bgs.find((b) => b.code === firstBadge)?.points ?? 0;
        setPoints(badgePoints);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message ?? "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Keep points in sync when badge changes (you can remove this if you want manual control)
  useEffect(() => {
    if (!badgeCode) return;
    const b = badges.find((x) => x.code === badgeCode);
    if (b && points === 0) {
      setPoints(b.points);
    }
  }, [badgeCode, badges]); // runs when badges arrive or badge changes

  const canSubmit = useMemo(
    () => !!receiverId && !!badgeCode && points > 0 && !loading,
    [receiverId, badgeCode, points, loading]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      // Adjust payload to match your backend Recognition DTO
      // Common shape:
      // { receiverId: number, badgeCode: string, points: number, note: string }
      await api.post("/api/recognitions", {
        receiverId,
        badgeCode,
        points,
        note,
      });

      alert("Recognition sent! 🎉");
      setNote("");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to send recognition");
    }
  }

  if (loading) return <div>Loading…</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  if (employees.length === 0 || badges.length === 0) {
    return (
      <div className="text-sm text-neutral-600">
        {employees.length === 0 && "No employees found. "}
        {badges.length === 0 && "No badges found."}
      </div>
    );
  }

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Send Recognition</h2>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="To">
            <select
              className="input"
              value={receiverId ?? ""}
              onChange={(e) => setReceiverId(Number(e.target.value))}
              required
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Badge">
            <select
              className="input"
              value={badgeCode}
              onChange={(e) => {
                const code = e.target.value;
                setBadgeCode(code);
                const b = badges.find((x) => x.code === code);
                if (b) setPoints(b.points); // auto-fill points to the badge default
              }}
              required
            >
              {badges.map((b) => (
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
              min={1}
              max={10000}
              step={1}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              required
            />
          </Field>
        </div>

        <Field label="Message">
          <textarea
            className="input min-h-[96px]"
            placeholder="Say thanks…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <div className="flex justify-end gap-2">
          <button type="submit" className="btn-primary" disabled={!canSubmit}>
            Send
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
