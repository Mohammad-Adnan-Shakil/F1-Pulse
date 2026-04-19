import { motion } from "framer-motion";
import {
  Brain,
  Flag,
  LayoutDashboard,
  LogOut,
  Shield,
  User,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai", label: "AI Prediction", icon: Brain },
  { to: "/drivers", label: "Drivers", icon: Users },
  { to: "/races", label: "Races", icon: Flag },
  { to: "/constructors", label: "Constructors", icon: Shield },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = ({ mobileOpen = false, onNavigate = () => {} }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
      {mobileOpen ? (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onNavigate}
          aria-label="Close navigation"
        />
      ) : null}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 border-r border-borderSoft bg-bgPrimary
          transition-transform duration-200 lg:static
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-[240px] lg:w-[84px] xl:w-[240px]
        `}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="border-b border-borderSoft px-5 py-6 lg:px-4 xl:px-5">
              <h1 className="text-xl font-bold tracking-tight lg:text-center xl:text-left">
                <span className="text-accentRed">F1</span> <span className="text-whitePrimary lg:hidden xl:inline">PULSE</span>
              </h1>
            </div>

            <nav className="px-3 py-4">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className="group relative mb-1 block">
                  {({ isActive }) => (
                    <div
                      className={`
                        flex items-center gap-3 rounded-xl2 px-3 py-3 text-sm transition-all duration-200
                        ${isActive ? "bg-accentRed/10 text-whitePrimary" : "text-whiteMuted hover:bg-white/5 hover:text-whitePrimary"}
                      `}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="lg:hidden xl:inline">{label}</span>

                      {isActive ? (
                        <motion.div
                          layoutId="active-nav-underline"
                          className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-accentRed"
                        />
                      ) : null}

                      {isActive ? <span className="absolute left-0 top-2 h-7 w-[3px] rounded-r-full bg-accentRed" /> : null}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-borderSoft p-3">
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex w-full items-center gap-3 rounded-xl2 px-3 py-3 text-left text-sm text-accentRed transition hover:bg-accentRed/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="lg:hidden xl:inline">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

