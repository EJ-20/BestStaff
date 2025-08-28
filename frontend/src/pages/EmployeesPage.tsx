import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Employee } from "../types/employee";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await api.get<Employee[]>("/api/employees");
      setEmployees(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const created = await api.post<Employee>("/api/employees", { fullName, email });
      setEmployees((prev) => [created, ...prev]);
      setFullName("");
      setEmail("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to add employee");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Employees</h1>

      <form onSubmit={onAdd} className="p-4 border rounded-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded-lg p-2"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            className="border rounded-lg p-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
        >
          Add Employee
        </button>
      </form>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && employees.length === 0 && <div>No employees yet.</div>}

      <ul className="divide-y rounded-xl border">
        {employees.map((e) => (
          <li key={e.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{e.fullName}</div>
              <div className="text-sm text-gray-500">{e.email}</div>
            </div>
            <div className="text-sm">Points: <span className="font-semibold">{e.points}</span></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
