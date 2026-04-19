import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ mobileOpen = false, onNavigate = () => {} }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-primary border-l-4 border-primary bg-[#111]"
        : "text-textSecondary hover:text-textPrimary"
    }`;

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r border-border
        transform transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="px-6 py-6 border-b border-border">
            <h1 className="font-display text-2xl tracking-widePlus text-textPrimary">
              F1 <span className="text-primary">PULSE</span>
            </h1>
          </div>

          <nav className="mt-4 space-y-1">
            <NavLink to="/dashboard" className={navItemClass} onClick={onNavigate}>Dashboard</NavLink>
            <NavLink to="/ai" className={navItemClass} onClick={onNavigate}>AI Prediction</NavLink>
            <NavLink to="/drivers" className={navItemClass} onClick={onNavigate}>Drivers</NavLink>
            <NavLink to="/races" className={navItemClass} onClick={onNavigate}>Races</NavLink>
            <NavLink to="/constructors" className={navItemClass} onClick={onNavigate}>Constructors</NavLink>
            <NavLink to="/profile" className={navItemClass} onClick={onNavigate}>Profile</NavLink>
          </nav>
        </div>

        <div className="px-4 pb-6">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full text-left text-sm text-danger hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
