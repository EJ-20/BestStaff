import { fakeRewards, redeemReward } from "../services/fakeApi";

export default function RewardsPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Rewards</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fakeRewards.map(r => (
          <div key={r.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="text-sm text-neutral-600 mb-3">{r.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm"><strong>{r.cost}</strong> pts</span>
              <button className="btn-secondary" onClick={() => { redeemReward(r.id); alert("Redeemed! 🎁"); }}>
                Redeem
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
