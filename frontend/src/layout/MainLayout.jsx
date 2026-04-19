import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <div className="lg:hidden h-14 border-b border-border px-4 flex items-center justify-between">
        <button
          className="px-3 py-1 border border-border rounded-md text-sm"
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          Menu
        </button>
        <p className="font-display">F1 PULSE</p>
        <p className="text-xs text-textSecondary">{user?.username || "User"}</p>
      </div>

      <div className="flex">
        <Sidebar mobileOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />

        <main className="flex-1 min-w-0">
          <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-border">
            <h1 className="font-display text-xl">F1 PULSE</h1>
            <p className="text-sm text-textSecondary">{user?.username || "User"}</p>
          </div>

          <motion.div
            className="p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
