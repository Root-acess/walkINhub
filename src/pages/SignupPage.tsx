// pages/SignupPage.jsx
import  { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Heroimage from "../assets/login-illustration.png";
import Loader from "../components/Loader/Loader";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { useNavigate, type To } from "react-router-dom"; // remove if you don't use react-router

export default function SignupPage() {
  const navigate = (typeof useNavigate === "function" ? useNavigate() : null);
  // fallback if no react-router:
  const safeNavigate = (path: To | string | number) => {
    try {
      if (navigate) return navigate(path as To);
    } catch (e) {}

    // if it's a string, assign directly to location.href
    if (typeof path === "string") {
      window.location.href = path;
      return;
    }

    // if it's a number, treat as history delta
    if (typeof path === "number") {
      window.history.go(path);
      return;
    }

    // if it's a location-like object, build a URL from pathname/search/hash
    if (path && typeof path === "object") {
      const p = path as any;
      if (p.pathname) {
        const href = String(p.pathname) + (p.search ?? "") + (p.hash ?? "");
        window.location.href = href;
        return;
      }
    }

    // fallback to string coercion
    try {
      window.location.href = String(path);
    } catch {
      // no-op if we cannot navigate
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // msg and type: 'error' | 'success' | 'info'
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); 
  const [loading, setLoading] = useState(false);

  // small email check
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  async function handleSignup(e: { preventDefault: () => void; }) {
    e?.preventDefault?.(); // if invoked by form
    setMsg("");
    setMsgType("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setMsg("All fields are required.");
      setMsgType("error");
      return;
    }
    if (!isValidEmail(email)) {
      setMsg("Please enter a valid email address.");
      setMsgType("error");
      return;
    }
    if (password.length < 6) {
      setMsg("Password should be at least 6 characters.");
      setMsgType("error");
      return;
    }
    if (password !== confirmPass) {
      setMsg("Passwords do not match.");
      setMsgType("error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { fullName } },
      });

      setLoading(false);

      if (error) {
        setMsg(error.message || "Signup failed.");
        setMsgType("error");
        return;
      }

      // success
      setMsg("Account created. Check your email for verification — redirecting to sign in.");
      setMsgType("success");

      // short visual confirmation then redirect to /signin
      setTimeout(() => safeNavigate("/verifyemailpage"), 1100);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setMsg("Something went wrong. Try again.");
      setMsgType("error");
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Illustration (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-linear-to-br from-slate-50 to-white">
        <img src={Heroimage} alt="Signup art" className="max-w-lg drop-shadow-2xl rounded-md" />
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Register to apply for jobs & internships.</p>
          </div>

          <form onSubmit={handleSignup} className="bg-white border shadow-sm rounded-2xl p-6 space-y-4">
            {/* name */}
            <label className="block">
              <span className="text-xs text-gray-600">Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
                required
              />
            </label>

            {/* email */}
            <label className="block">
              <span className="text-xs text-gray-600">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
                required
              />
            </label>

            {/* password */}
            <div className="grid grid-cols-1 gap-4">
              <label className="relative block">
                <span className="text-xs text-gray-600">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-9 text-sm text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </label>

              <label className="relative block">
                <span className="text-xs text-gray-600">Confirm Password</span>
                <input
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  className="mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-9 text-sm text-gray-500"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </label>
            </div>

            {/* message / toast */}
            {msg && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-md px-3 py-2 text-sm ${
                  msgType === "success"
                    ? "bg-green-50 text-green-800 border border-green-100"
                    : msgType === "error"
                    ? "bg-red-50 text-red-800 border border-red-100"
                    : "bg-gray-50 text-gray-800"
                }`}
              >
                {msg}
              </div>
            )}

            {/* submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition flex justify-center items-center ${
                  loading ? "bg-purple-600/90 cursor-wait" : "bg-purple-600 hover:bg-purple-700"
                } text-white`}
              >
                {loading ? <Loader size={20} stroke={3} /> : "Create Account"}
              </button>
            </div>

            {/* login link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <a href="/login" className="text-purple-600 font-medium ml-1 hover:underline">
                Sign in
              </a>
            </p>

            {/* divider & social */}
            <div className="flex items-center gap-3 mt-3">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span className="text-xs text-gray-400">or continue with</span>
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-3">
              <button type="button" className="w-full border rounded-xl py-3 flex items-center justify-center gap-3">
                <FcGoogle size={20} /> Continue with Google
              </button>
              <button type="button" className="w-full border rounded-xl py-3 flex items-center justify-center gap-3 text-blue-600">
                <FaFacebook size={18} /> Continue with Facebook
              </button>
              <button type="button" className="w-full border rounded-xl py-3 flex items-center justify-center gap-3 text-blue-700">
                <FaLinkedin size={18} /> Continue with LinkedIn
              </button>
            </div>
          </form>

          {/* fine print */}
          <p className="text-xs text-gray-400 text-center">
            By continuing you agree to our <a className="underline">Terms</a> and <a className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
