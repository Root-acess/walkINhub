import { useEffect, useState, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  email?: string;
}

export default function VerifyEmailPage(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from router state OR ?email= param
  const query = new URLSearchParams(location.search);
  const initialEmail: string =
    (location.state as LocationState)?.email || query.get("email") || "";

  const [email] = useState<string>(initialEmail);
  const [status, setStatus] = useState<"" | "sent" | "error" | "resending">("");
  const [message, setMessage] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(0);

  // Resend email cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // 📩 Resend email handler (Connect this to backend API)
  async function handleResend(): Promise<void> {
    if (!email) {
      setStatus("error");
      setMessage("Email missing — go back to signup and try again.");
      return;
    }

    setStatus("resending");
    setMessage("");

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("sent");
      setMessage("Verification email re-sent! Check your inbox.");
      setCooldown(30); // prevent spam
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to send email. Try again later.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border overflow-hidden">

        <div className="p-10 sm:p-14 flex flex-col gap-8">

          {/* Title + Icon */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-600/10 flex justify-center items-center">
              <svg
                className="w-10 h-10 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M3 8.5v7a2.5 2.5 0 002.5 2.5h13a2.5 2.5 0 002.5-2.5v-7" strokeWidth="1.5"
                  strokeLinecap="round" />
                <path d="M3 8.5l8 5 8-5" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16.5 9.5l2 2 3-3" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
              <p className="text-sm text-gray-500">
                A verification link has been sent to your inbox.
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-6">
            <p className="text-sm text-gray-700">
              Please open <strong>{email}</strong> and click the <b>Verify Email</b> button.
            </p>

            <ul className="mt-3 text-sm text-gray-500 space-y-1">
              <li>• Check spam / promotions folder.</li>
              <li>• Corporate mail? It may block automated mails.</li>
              <li>• Didn’t receive? Resend below.</li>
            </ul>

            {/* Status Message */}
            {message && (
              <div
                className={`mt-4 px-3 py-2 rounded-md text-sm ${
                  status === "sent"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : status === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-gray-50 text-gray-800"
                }`}
                aria-live="polite"
              >
                {message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              
              <a
                href={`https://mail.google.com`}
                className="px-4 py-2 rounded-xl bg-white border hover:bg-gray-50 text-sm"
              >
                Open email app
              </a>

              <button
                onClick={handleResend}
                disabled={cooldown > 0 || status === "resending"}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  cooldown > 0 || status === "resending"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {status === "resending" ? "Sending..." :
                cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="ml-auto px-4 py-2 rounded-xl bg-white border hover:bg-gray-50 text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Mistake in email?{" "}
            <button className="underline" onClick={() => navigate("/signup")}>
              Create account again
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
