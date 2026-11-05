"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

type User = {
  name?: string;
  email: string;
};

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/");
    }
  }, [router]);

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Please enter your email to receive recovery instructions");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsResetting(true);
    // Simulation
    setTimeout(() => {
      setIsResetting(false);
      setSuccessMessage("Recovery link sent! Please check your Gmail inbox.");
      setIsForgotPassword(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (isSignUp && !name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (isSignUp) {
      // Sign up success - Save to admin_users for admin visibility
      try {
        const currentUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
        const newUser = {
          id: Date.now(),
          name: name,
          email: email,
          role: 'Guest',
          status: 'Active',
          joined: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem('admin_users', JSON.stringify([...currentUsers, newUser]));
      } catch (e) {
        console.error('Failed to save to admin_users', e);
      }

      setSuccessMessage("Account created successfully! Please sign in.");
      setIsSignUp(false);
      setPassword("");
      setConfirmPassword("");
    } else {
      // Login success logic
      try {
        let adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
        
        // Initialize defaults if empty
        if (adminUsers.length === 0) {
          adminUsers = [
            { id: 1, name: 'Admin User', email: 'admin@whisper.sea', role: 'Admin', status: 'Active', joined: '2023-05-12' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Staff', status: 'Active', joined: '2023-06-20' },
            { id: 3, name: 'Robert Johnson', email: 'robert@test.com', role: 'Guest', status: 'Inactive', joined: '2023-08-15' },
          ];
        }

        const userIndex = adminUsers.findIndex((u: any) => u.email === email);
        const loginTime = new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        let finalName = name; // Fallback to form state (usually empty on login)

        if (userIndex !== -1) {
          // User exists - update activity and get their saved name
          adminUsers[userIndex] = {
            ...adminUsers[userIndex],
            loginCount: (adminUsers[userIndex].loginCount || 0) + 1,
            lastLogin: loginTime
          };
          finalName = adminUsers[userIndex].name;
        } else {
          // User doesn't exist - create new record
          finalName = name || email.split('@')[0];
          adminUsers.push({
            id: Date.now(),
            name: finalName,
            email: email,
            role: 'Guest',
            status: 'Active',
            joined: new Date().toISOString().split('T')[0],
            loginCount: 1,
            lastLogin: loginTime
          });
        }

        // Save updated users list
        localStorage.setItem('admin_users', JSON.stringify(adminUsers));

        // Save session user with the CORRECT name
        localStorage.setItem("user", JSON.stringify({ name: finalName, email }));

      } catch (e) {
        console.error('Login synchronization failed', e);
        // Fallback session save if something crashes
        localStorage.setItem("user", JSON.stringify({ name: name || email.split('@')[0], email }));
      }
      
      // Redirect to admin if email is admin@whisper.sea
      if (email === "admin@whisper.sea") {
        router.push("/admin");
      } else {
        // Redirect to home
        router.push("/");
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1C1C1C] text-white p-4 font-sans selection:bg-[#addfac] selection:text-black">
      
      {/* Decorative Background Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#addfac]/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-[580px] w-full max-w-4xl overflow-hidden rounded-3xl bg-[#242424]/50 border border-stone-800 shadow-2xl backdrop-blur-sm">
        
        {/* Left Panel: Branding & Toggle */}
        <div className="relative hidden w-2/5 flex-col items-center justify-center bg-gradient-to-br from-stone-900 to-[#1C1C1C] p-12 text-center transition-all duration-500 md:flex border-r border-stone-800">

          {/* Logo Area */}
          <div className="absolute left-8 top-8 flex items-center gap-3">
             <img
              src="/logo_hotel-removebg-preview.png"
              alt="Whisper of the Sea Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Decorative Shapes (Thematic) */}
          <div className="absolute right-10 top-20 opacity-20"><Sparkles className="w-8 h-8 text-[#addfac]" /></div>
          <div className="absolute bottom-24 right-12 w-20 h-20 rounded-full border border-[#addfac]/20 border-dashed animate-spin-slow"></div>

          {isSignUp ? (
            <div className="space-y-6">
              <h2 className="text-4xl font-serif italic text-stone-100 leading-tight">
                Welcome <br />
                <span className="not-italic font-sans font-light text-[#addfac]">Home</span>
              </h2>

              <p className="max-w-xs text-sm leading-relaxed text-stone-400 font-light">
                Your luxury sanctuary awaits. Sign in to continue your curated journey with us.
              </p>

              <button
                onClick={() => {
                  setIsSignUp(false);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setName("");
                  setError("");
                  setSuccessMessage("");
                }}
                className="rounded-full border border-[#addfac]/40 px-12 py-3 text-xs font-semibold uppercase tracking-widest text-[#addfac] transition-all duration-300 hover:bg-[#addfac] hover:text-black active:scale-95"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-4xl font-serif italic text-stone-100 leading-tight">
                Hello <br />
                <span className="not-italic font-sans font-light text-[#addfac]">Traveller</span>
              </h2>

              <p className="max-w-xs text-sm leading-relaxed text-stone-400 font-light">
                Begin your escape to the raw Pacific coastline. Create an account to unlock timeless luxury.
              </p>

              <button
                onClick={() => {
                  setIsSignUp(true);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setName("");
                  setError("");
                  setSuccessMessage("");
                }}
                className="rounded-full border border-[#addfac]/40 px-12 py-3 text-xs font-semibold uppercase tracking-widest text-[#addfac] transition-all duration-300 hover:bg-[#addfac] hover:text-black active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Right Panel: Form */}
        <div className="flex w-full flex-col justify-center px-8 py-12 md:w-3/5 md:px-20">
          <div className="w-full">

            <h1 className="text-3xl md:text-4xl font-serif italic text-[#addfac] text-center mb-2">
              {isForgotPassword 
                ? "Recover Access" 
                : isSignUp ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-xs text-center text-stone-500 uppercase tracking-widest font-medium mb-8">
              {isForgotPassword 
                ? "Reset Your Password" 
                : isSignUp ? "Start Your Journey" : "Access Your Sanctuary"}
            </p>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-medium text-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-medium text-red-400 animate-pulse">
                {error}
              </div>
            )}

            {/* Form */}
            {isForgotPassword ? (
              <form
                className="space-y-6 text-left animate-fadeIn"
                onSubmit={handleForgotPassword}
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block ml-1">Registered Email</label>
                  <input
                    type="email"
                    placeholder="e.g. guest@resort.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C1C]/50 border border-stone-800 py-3.5 px-5 text-sm text-stone-200 outline-none transition-all placeholder:text-stone-600 focus:border-[#addfac]/50 focus:ring-1 focus:ring-[#addfac]/20"
                  />
                </div>

                <div className="pt-2 text-center space-y-4">
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full rounded-full bg-gradient-to-r from-teal-600 to-[#addfac] py-4 text-xs font-bold uppercase tracking-widest text-black shadow-xl transition-all duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                  >
                    {isResetting ? "Preparing Link..." : "Send Reset Link"}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError("");
                    }}
                    className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-[#addfac] transition-colors"
                  >
                    Go Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form
                className="space-y-5 text-left"
                onSubmit={handleSubmit}
              >

                {/* Name (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block ml-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl bg-[#1C1C1C]/50 border border-stone-800 py-3.5 px-5 text-sm text-stone-200 outline-none transition-all placeholder:text-stone-600 focus:border-[#addfac]/50 focus:ring-1 focus:ring-[#addfac]/20"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. guest@resort.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1C1C]/50 border border-stone-800 py-3.5 px-5 text-sm text-stone-200 outline-none transition-all placeholder:text-stone-600 focus:border-[#addfac]/50 focus:ring-1 focus:ring-[#addfac]/20"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block ml-1">Password</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-[#1C1C1C]/50 border border-stone-800 py-3.5 px-5 pr-12 text-sm text-stone-200 outline-none transition-all placeholder:text-stone-600 focus:border-[#addfac]/50 focus:ring-1 focus:ring-[#addfac]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-[#addfac] transition-colors"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block ml-1">Confirm Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl bg-[#1C1C1C]/50 border border-stone-800 py-3.5 px-5 pr-12 text-sm text-stone-200 outline-none transition-all placeholder:text-stone-600 focus:border-[#addfac]/50 focus:ring-1 focus:ring-[#addfac]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-[#addfac] transition-colors"
                      >
                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot Password Link (Visual only) */}
                {!isSignUp && (
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError("");
                        setSuccessMessage("");
                      }}
                      className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-[#addfac] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    className="w-full md:w-56 rounded-full bg-gradient-to-r from-teal-600 to-[#addfac] py-4 text-xs font-bold uppercase tracking-widest text-black shadow-xl transition-all duration-300 hover:brightness-110 active:scale-95"
                  >
                    {isSignUp ? "Create Account" : "Sign In"}
                  </button>
                </div>

              </form>
            )}

            {/* Mobile Switch */}
            {!isForgotPassword && (
              <p className="mt-8 text-center text-xs tracking-wide text-stone-500 md:hidden uppercase">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}

                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setName("");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="font-semibold text-[#addfac] hover:underline ml-1"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-[10px] tracking-[0.3em] text-stone-600 uppercase">
        © 2026 Whisper of the Sea Resort
      </div>
    </div>
  );
}
