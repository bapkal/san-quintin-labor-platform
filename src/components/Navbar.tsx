import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LineChart,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/jobs", icon: Briefcase, label: "Jobs" },
    { path: "/my-contracts", icon: FileText, label: "Contracts" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Post Job" },
    { path: "/admin", icon: LineChart, label: "Admin" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto w-full max-w-md">
        <div className="grid grid-cols-4 gap-2 rounded-3xl border border-border bg-white/90 p-2 shadow-lg backdrop-blur">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center rounded-2xl px-2 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="mb-1 h-5 w-5" strokeWidth={isActive ? 2.3 : 1.7} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

