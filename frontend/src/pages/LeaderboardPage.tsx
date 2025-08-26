import { fakeLeaderboard } from "../services/fakeApi";

export default function LeaderboardPage() {
  const rows = fakeLeaderboard("monthly");
  return (
    <section className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Leaderboard (Monthly)</h2>
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-left">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-neutral-600">{r.department}</td>
                <td className="px-4 py-3">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
