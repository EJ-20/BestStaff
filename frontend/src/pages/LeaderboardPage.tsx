import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { LeaderboardRow } from "../types/leaderboard";

const periods = ["weekly", "monthly"] as const;
type Period = typeof periods[number];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(p: Period) {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<LeaderboardRow[]>(`/api/leaderboard?period=${p}`);
      setRows(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(period); }, [period]);

  const crown = useMemo(() => ["🥇","🥈","🥉"], []);

  return (
    <section className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leaderboard</h2>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
        >
          {periods.map(p => <option key={p} value={p}>{p[0].toUpperCase()+p.slice(1)}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-left">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr><td className="px-4 py-6 text-center text-neutral-500" colSpan={4}>Loading…</td></tr>
            )}
            {error && !loading && (
              <tr><td className="px-4 py-6 text-center text-red-600" colSpan={4}>{error}</td></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr><td className="px-4 py-6 text-center text-neutral-500" colSpan={4}>No results yet.</td></tr>
            )}

            {!loading && !error && rows.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    <span>{i + 1}</span>
                    {i < 3 && <span aria-hidden>{crown[i]}</span>}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-neutral-600">{r.department ?? "-"}</td>
                <td className="px-4 py-3 text-right font-semibold">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
