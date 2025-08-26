import { currentUser, fakeHistory } from "../services/fakeApi";

export default function ProfilePage() {
  return (
    <section className="max-w-3xl">
      <div className="rounded-2xl border bg-white p-4 shadow-sm mb-4">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        <p className="text-sm text-neutral-600">{currentUser.name} — {currentUser.department}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
          Balance: <strong>{currentUser.points}</strong> pts
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold mb-2">Recent Activity</h3>
        <ul className="space-y-2 text-sm">
          {fakeHistory.slice(0, 6).map((h, idx) => (
            <li key={idx} className="flex items-center justify-between border rounded-xl px-3 py-2">
              <span>{h.text}</span>
              <span className={h.delta > 0 ? "text-green-700" : "text-red-700"}>
                {h.delta > 0 ? `+${h.delta}` : h.delta} pts
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
