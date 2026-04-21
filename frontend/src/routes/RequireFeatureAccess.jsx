import { useLocation } from "react-router-dom";
import AuthGate from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";

const RequireFeatureAccess = ({ children, featureName }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="py-14 text-center text-whiteMuted">
        <div className="inline-block h-8 w-8 rounded-full border-2 border-accentRed/30 border-t-accentRed animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGate routeName={location.pathname} featureName={featureName} />;
  }

  return children;
};

export default RequireFeatureAccess;
