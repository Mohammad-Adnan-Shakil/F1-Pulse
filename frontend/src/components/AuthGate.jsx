import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

/**
 * Full-page authentication gate for protected routes
 * Shows when user tries to access /ai without being logged in
 */
const AuthGate = ({ routeName = "/ai" }) => {
  const navigate = useNavigate();

  const getGateContent = () => {
    if (routeName === "/ai") {
      return {
        title: "AI Prediction is a member feature",
        description: "Sign in to access race predictions, confidence scoring, and what-if simulation powered by XGBoost and Random Forest.",
        cta: "AI Prediction"
      };
    }

    return {
      title: "Sign in to continue",
      description: "Create an account or log in to access this feature.",
      cta: "Member Area"
    };
  };

  const content = getGateContent();

  return (
    <div className="h-screen bg-gradient-to-br from-bgPrimary via-bgPrimary to-bgSecondary flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-accentRed">F1</span> <span className="text-whitePrimary">PULSE</span>
          </h1>
        </div>

        {/* Lock Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-accentRed/10 rounded-2xl">
            <Lock className="h-12 w-12 text-accentRed" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-whitePrimary mb-4">
          {content.title}
        </h2>

        <p className="text-whiteMuted mb-8 leading-relaxed">
          {content.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login", { state: { from: routeName } })}
            className="w-full px-6 py-3 bg-accentRed text-white font-medium rounded-lg hover:bg-accentRed/90 transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/register", { state: { from: routeName } })}
            className="w-full px-6 py-3 border border-borderSoft text-whitePrimary font-medium rounded-lg hover:bg-white/5 transition-colors"
          >
            Create Account
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-borderSoft"></div>
          <span className="text-xs text-whiteMuted uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-borderSoft"></div>
        </div>

        {/* Back to public stats */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-accentRed hover:text-accentRed/80 text-sm font-medium transition-colors"
        >
          ← Explore public stats instead
        </button>
      </div>
    </div>
  );
};

export default AuthGate;
