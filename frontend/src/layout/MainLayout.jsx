import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const MainLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-background">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-background">

          {/* Page Title Placeholder */}
          <h1 className="font-display text-xl tracking-widePlus">
            DASHBOARD
          </h1>

          {/* User Info */}
          <div className="text-sm text-textSecondary">
            {user?.username || "User"}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

      </div>
    </div>
  );
};

export default MainLayout;