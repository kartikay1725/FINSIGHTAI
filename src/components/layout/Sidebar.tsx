import Link from "next/link";
import { Home, FileText, AlertTriangle, Sparkles, Gauge } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
  { href: "/dashboard/emis", icon: <FileText size={20} />, label: "EMIs" },
  { href: "/dashboard/fraud", icon: <AlertTriangle size={20} />, label: "Alerts" },
  { href: "/dashboard/advisor", icon: <Sparkles size={20} />, label: "Advisor" },
  { href: "/dashboard/score", icon: <Gauge size={20} />, label: "Score" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-lg p-6 space-y-6">
      <h1 className="text-2xl font-extrabold tracking-wide">FinSight AI</h1>
      <nav className="space-y-3">
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition"
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
