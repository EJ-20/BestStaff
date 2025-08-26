import { NavLink, Outlet } from "react-router-dom";
import { ReactNode } from "react";
import { UserCircle2, Gift, Medal, Trophy, Settings } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="grid grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-screen sticky top-0 bg-white border-r border-neutral-200 flex flex-col">
          <div className="p-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-600"></div>
              <h1 className="text-lg font-bold">BestStaff</h1>
            </div>
          </div>
          <nav className="px-3 flex-1">
            <SideLink to="/recognize" icon={<Gift size={18} />}>Recognize</SideLink>
            <SideLink to="/leaderboard" icon={<Medal size={18} />}>Leaderboard</SideLink>
            <SideLink to="/rewards" icon={<Trophy size={18} />}>Rewards</SideLink>
            <SideLink to="/profile" icon={<UserCircle2 size={18} />}>Profile</SideLink>
            <div className="mt-6 pt-6 border-t">
              <SideLink to="/admin" icon={<Settings size={18} />}>Admin</SideLink>
            </div>
          </nav>
          <div className="p-4 mt-auto hidden sm:block">
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <div className="h-9 w-9 rounded-full bg-neutral-200" />
              <div>
                <p className="text-sm font-medium">Erfan</p>
                <p className="text-xs text-neutral-500">Best Buy · Computers</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-screen">
          <Topbar />
          <div className="p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode; }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium",
          isActive ? "bg-blue-50 text-blue-700" : "text-neutral-700 hover:bg-neutral-100"
        ].join(" ")
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}

function Topbar() {
  return (
    <div className="sticky top-0 z-10 bg-neutral-50/80 backdrop-blur border-b border-neutral-200">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="text-sm text-neutral-600">Build · Test · Reward</div>
        <BudgetPill />
      </div>
    </div>
  );
}

function BudgetPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
      Weekly Budget: <strong className="text-green-700">150 pts</strong>
    </span>
  );
}
