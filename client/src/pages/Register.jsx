import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MdBloodtype, MdEmail, MdLock, MdPerson, MdOutlineArrowForward, MdAdminPanelSettings } from "react-icons/md";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "user"
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await register(formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Background blobs for premium glassmorphic effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/45 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 z-10 py-10">
        {/* Brand Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/30 mb-4 animate-pulse">
            <MdBloodtype className="text-4xl text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Register to join the Blood Bank Inventory System
          </p>
        </div>

        {/* Glassmorphic Register Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">
          {error && (
            <div className="mb-5 px-4 py-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 px-4 py-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-sm text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="first_name" className="text-xs font-semibold text-slate-300 block">
                  First Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-250">
                    <MdPerson className="text-lg" />
                  </div>
                  <input
                    id="first_name"
                    type="text"
                    required
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="last_name" className="text-xs font-semibold text-slate-300 block">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  required
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-2.5 px-3 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-250">
                  <MdEmail className="text-lg" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-250">
                  <MdLock className="text-lg" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-slate-600 text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Role Select Dropdown (helpful to test both regular users and admins) */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-slate-300 block">
                Account Type / Role
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-250">
                  <MdAdminPanelSettings className="text-lg" />
                </div>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-2.5 pl-9 pr-3 text-slate-300 text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="user" className="bg-slate-900 text-white">Regular Staff User</option>
                  <option value="admin" className="bg-slate-900 text-white">System Administrator</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-500/35 transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <MdOutlineArrowForward className="text-lg" />
                </>
              )}
            </button>
          </form>

          {/* Footer inside Card */}
          <div className="mt-6 text-center border-t border-slate-800/80 pt-5">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-rose-400 hover:text-rose-300 font-semibold hover:underline transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
