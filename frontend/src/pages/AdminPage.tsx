import { useState } from "react";
import { fakeRewards, addReward } from "../services/fakeApi";

export default function AdminPage() {
  const [name, setName] = useState<string>("");
  const [cost, setCost] = useState<number>(50);
  const [desc, setDesc] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addReward({ name, description: desc, cost });
    setName(""); setDesc(""); setCost(50);
    alert("Reward added");
  }

  return (
    <section className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Admin — Rewards</h2>

      <form onSubmit={submit} className="rounded-2xl border bg-white p-4 shadow-sm mb-6 grid sm:grid-cols-3 gap-3">
        <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" type="number" min={10} step={5} value={cost} onChange={e => setCost(Number(e.target.value))} />
        <input className="input sm:col-span-3" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <div className="sm:col-span-3">
          <button className="btn-primary" type="submit">Add Reward</button>
        </div>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {fakeRewards.map(r => (
          <div key={r.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="font-semibold">{r.name}</div>
            <div className="text-sm text-neutral-600 mb-1">{r.description}</div>
            <div className="text-sm">{r.cost} pts</div>
          </div>
        ))}
      </div>
    </section>
  );
}
