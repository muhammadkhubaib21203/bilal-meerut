import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bbq.jpg";
import logo from "@/assets/logo.png";

type AuthMode = "login" | "signup" | "forgot" | "reset";

const getInitialMode = (): AuthMode => {
  if (typeof window === "undefined") return "login";
  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get("mode");
  const hash = window.location.hash;
  if (modeParam === "reset" || hash.includes("type=recovery")) return "reset";
  return "login";
};

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>(getInitialMode());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signOut, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const headingMap: Record<AuthMode, { title: string; subtitle: string; button: string }> = {
    login: { title: "Welcome Back", subtitle: "Sign in to place your order", button: "Sign In" },
    signup: { title: "Create Account", subtitle: "Join us for delicious kababs", button: "Create Account" },
    forgot: { title: "Forgot Password", subtitle: "We will send you a reset link", button: "Send Reset Link" },
    reset: { title: "Set New Password", subtitle: "Choose a strong new password", button: "Update Password" },
  };

  const passwordLabel = mode === "reset" ? "New Password" : "Password";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back! 🔥" });
        navigate("/");
      }
    } else if (mode === "signup") {
      if (!fullName.trim()) {
        toast({ title: "Name required", description: "Please enter your full name", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      } else {
        await signOut();
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setFullName("");
        setMode("login");
        toast({ title: "Account created! 🎉", description: "Please sign in to continue." });
      }
    } else if (mode === "forgot") {
      if (!email.trim()) {
        toast({ title: "Email required", description: "Please enter your email", variant: "destructive" });
        setLoading(false);
        return;
      }
      const redirectTo = `${window.location.origin}/auth?mode=reset`;
      const { error } = await resetPassword(email, redirectTo);
      if (error) {
        toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
      } else {
        setMode("login");
        toast({ title: "Check your email", description: "We sent you a reset link." });
      }
    } else {
      if (password.length < 6) {
        toast({ title: "Password too short", description: "Use at least 6 characters", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords do not match", description: "Please re-enter your password", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await updatePassword(password);
      if (error) {
        toast({ title: "Update Failed", description: error.message, variant: "destructive" });
      } else {
        await signOut();
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setMode("login");
        navigate("/auth", { replace: true });
        toast({ title: "Password updated", description: "You can now sign in." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Sizzling BBQ" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={logo} alt="Bilal Kabab logo" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
              <span className="font-display text-2xl font-bold text-gradient-fire">Bilal Kabab</span>
            </div>
            <h1 className="font-display text-xl font-bold mb-1">
              {headingMap[mode].title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {headingMap[mode].subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            )}
            {mode !== "reset" && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            )}
            {mode !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={passwordLabel}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
            {mode === "reset" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            )}
            {mode === "login" && (
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setPassword("");
                  setShowPassword(false);
                }}
                className="text-xs text-primary hover:underline text-right w-full"
              >
                Forgot password?
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-fire rounded-xl text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50"
            >
              {loading ? "Please wait..." : headingMap[mode].button}
            </button>
          </form>

          {mode === "login" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setPassword("");
                  setShowPassword(false);
                }}
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          )}
          {mode === "signup" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setPassword("");
                  setShowPassword(false);
                }}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remembered your password?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setPassword("");
                  setShowPassword(false);
                }}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          )}
          {mode === "reset" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Back to{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setPassword("");
                  setConfirmPassword("");
                  setShowPassword(false);
                }}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
