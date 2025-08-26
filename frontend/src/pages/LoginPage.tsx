import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/recognize";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch {
      // error handled by context
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600" />
          <h1 className="text-lg font-bold">BestStaff</h1>
        </div>
        <h2 className="text-xl font-semibold mb-1">Welcome back</h2>
        <p className="text-sm text-neutral-600 mb-4">Sign in to send and redeem points.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-neutral-700">Email</span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-neutral-700">Password</span>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button className="btn-primary w-full" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-xs text-neutral-500 mt-2">
            Try any email & password to log in. Use <code className="px-1 rounded bg-neutral-100">fail@demo.com</code> to see an error demo.
          </p>
        </form>
      </div>
    </div>
  );
}
