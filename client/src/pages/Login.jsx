import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MdBloodtype, MdEmail, MdLock, MdOutlineArrowForward } from "react-icons/md";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Background blobs for premium glassmorphic effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/45 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 z-10">
        {/* Brand Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/30 mb-4 animate-bounce">
            <MdBloodtype className="text-4xl text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Blood Bank Portal
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Log in to manage your inventory and dispatches
          </p>
        </div>

        {/* Glassmorphic Login Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">
          {error && (
            <div className="mb-6 px-4 py-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-sm text-center">
              {error}
            </div>
          )}

          {expired && !error && (
            <div className="mb-6 px-4 py-3 bg-amber-950/40 border border-amber-850/60 rounded-xl text-amber-300 text-sm text-center">
              Your session has expired. Please sign in again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-300 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-250">
                  <MdEmail className="text-xl" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-300 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-250">
                  <MdLock className="text-xl" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-500/35 transition-all duration-200 flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <MdOutlineArrowForward className="text-lg" />
                </>
              )}
            </button>
          </form>

          {/* Footer inside Card */}
          <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-rose-400 hover:text-rose-300 font-semibold hover:underline transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
