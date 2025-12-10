import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitForm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate send
    setLoading(false);
    setSent(true);

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Have questions, feedback, collaboration ideas — or want help preparing for ATS, Résumé, or Interviews?
          We respond within 12 hours.
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* LEFT — Form */}
        <div className="bg-white shadow rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-semibold">Send a message</h2>

          <div className="space-y-3">
            <input
              type="text"
              className="border rounded w-full px-3 py-2"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              className="border rounded w-full px-3 py-2"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              className="border rounded w-full px-3 py-3 h-28"
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={submitForm}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {sent && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                Message sent successfully! We'll get back to you shortly.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — Contact Info */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-center space-y-5">
          <h2 className="text-xl font-semibold">Get in touch directly</h2>

          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              📧 <span className="font-medium">Email:</span>{" "}
              <a href="mailto:hiralals221@gmail.com" className="text-blue-600 font-medium hover:underline">
                hiralals221@gmail.com
              </a>
            </p>

            <p>
              🌐 <span className="font-medium">LinkedIn:</span>{" "}
              <a href="https://linkedin.com/in/hiralal-singh" target="_blank" className="text-blue-600 font-medium hover:underline">
                linkedin.com/in/hiralal-singh
              </a>
            </p>

            <p>
              📍 <span className="font-medium">Location:</span> India (Remote + On-site collaboration)
            </p>

            <p>
              ☎ <span className="font-medium">Phone:</span>{" "}
              <span className="font-semibold">8984443551</span>
            </p>

            <hr className="my-3" />

            <p className="text-gray-600 text-xs">
              <strong>Working Hours:</strong><br />
              Mon – Sat • 10 AM → 9 PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
