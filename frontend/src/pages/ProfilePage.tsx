import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Profile, ActivityItem } from "../types/profile";

export default function ProfilePage() {
  const [me, setMe] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [meRes, actRes] = await Promise.all([
        api.get<Profile>("/api/me"),
        api.get<ActivityItem[]>("/api/me/activity"),
      ]);
      setMe(meRes);
      setActivity(actRes);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error)   return <div className="p-6 text-red-600">{error}</div>;
  if (!me)     return <div className="p-6">No profile found.</div>;

  return (
    <section className="max-w-3xl">
      <div className="rounded-2xl border bg-white p-4 shadow-sm mb-4">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        <p className="text-sm text-neutral-600">{me.name} — {me.department ?? "-"}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
          Balance: <strong>{me.points}</strong> pts
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold mb-2">Recent Activity</h3>

        {activity.length === 0 ? (
          <div className="text-sm text-neutral-500">No activity yet.</div>
        ) : (
          <ul className="space-y-2 text-sm">
            {activity.slice(0, 10).map((h, idx) => (
              <li key={idx} className="flex items-center justify-between border rounded-xl px-3 py-2">
                <span>{h.text}</span>
                <span className={h.delta > 0 ? "text-green-700" : "text-red-700"}>
                  {h.delta > 0 ? `+${h.delta}` : h.delta} pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
