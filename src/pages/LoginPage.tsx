import { useState } from "react";
import { supabase } from "../lib/supabaseClient";  // << added

import Heroimage from "../assets/login-illustration.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaLinkedin } from "react-icons/fa";

export default function SigninPage() {

  const [showPassword, setShowPassword] = useState(false);

  // NEW STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return setMsg(error.message);

    setMsg("Logged In Successfully 🎉");
    setTimeout(() => {
      window.location.href = "/"; // redirect after login
    }, 800);
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* ================= Left Illustration ================= */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#F5F7FB]">
        <img src={Heroimage} alt="WalkINhub illustration" className="max-w-lg drop-shadow-xl animate-fade-in"/>
      </div>

      {/* ================= Right Login Area ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-14">
        <div className="w-full max-w-md animate-slide-up">

          <h1 className="text-4xl font-bold text-gray-800 mb-2">WalkINhub 👋</h1>
          <p className="text-gray-500 mb-8 text-sm">Sign in to explore placements, internships & walk-in opportunities.</p>

          {/* Email Input */}
          <div className="mb-5">
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="text"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 outline-none focus:ring-purple-500 transition"
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 outline-none focus:ring-purple-500 transition"
                onChange={(e)=>setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 cursor-pointer text-gray-600 hover:text-black">
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* Login Button (now works) */}
          <button onClick={handleLogin} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-all">
            Login
          </button>

          {msg && <p className="text-center text-sm text-red-500 mt-3">{msg}</p>}

          {/* Create Account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            New to WalkINhub? <a href="/signup" className="text-purple-600 font-medium hover:underline ml-1">Create an account</a>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-gray-300"></span>
            <span className="text-gray-500 text-sm">or continue with</span>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* SOCIAL LOGIN — FUTURE HOOK */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-100 text-sm transition">
              <FcGoogle size={22} /> Continue with Google
            </button>
            <button className="flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-100 text-sm transition text-blue-600">
              <FaFacebook size={20} /> Continue with Facebook
            </button>
            <button className="flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-100 text-sm transition text-blue-700">
              <FaLinkedin size={20} /> Continue with LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
