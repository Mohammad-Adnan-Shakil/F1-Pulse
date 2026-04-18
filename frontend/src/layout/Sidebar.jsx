import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-primary border-l-4 border-primary bg-[#111]"
        : "text-textSecondary hover:text-textPrimary"
    }`;

  return (
    <div className="h-screen w-64 bg-background border-r border-border flex flex-col justify-between">

      {/* TOP SECTION */}
      <div>
        {/* Logo */}
        <div className="px-6 py-6">
          <h1 className="font-display text-2xl tracking-widePlus text-textPrimary">
            F1 <span className="text-primary">PULSE</span>
          </h1>
        </div>

        <div className="racing-divider"></div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1">

          <NavLink to="/dashboard" className={navItemClass}>
            Dashboard
          </NavLink>

          <NavLink to="/ai" className={navItemClass}>
            AI Intelligence
          </NavLink>

          <NavLink to="/drivers" className={navItemClass}>
            Drivers
          </NavLink>

          <NavLink to="/races" className={navItemClass}>
            Races
          </NavLink>

          <NavLink to="/constructors" className={navItemClass}>
            Constructors
          </NavLink>

          <NavLink to="/profile" className={navItemClass}>
            Profile
          </NavLink>

        </nav>
      </div>

      {/* BOTTOM SECTION */}
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
  );
};

export default Sidebar;