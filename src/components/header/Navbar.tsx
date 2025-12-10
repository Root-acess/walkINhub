import { useEffect, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import { Link } from 'react-router-dom'; // Assuming you use React Router

export default function Navbar() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!resourcesRef.current) return;
      if (!resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Resources items (add/remove easily)
  const resources = [
    { label: "Resume Builder", href: "/tools/resume-builder", hint: "Create ATS-friendly resumes" },
    { label: "ATS Checker", href: "/tools/ats-checker", hint: "Test resume vs job description" },
    { label: "Interview Prep", href: "/tools/interview-prep", hint: "Mock questions & tips" },
    { label: "Salary Calculator", href: "/tools/salary-calculator", hint: "Estimate market pay" },
    { label: "Company Reviews", href: "/companies", hint: "Hiring practices & reviews" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

        {/* LEFT — LOGO + NAME */}
        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
            alt="walkINhub logo"
            className="h-8 w-8 opacity-80"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-600">walkINhub</h1>
            <p className="text-[11px] text-gray-500 -mt-1">
              Your gateway to walk-in interviews
            </p>
          </div>
        </div>

        {/* MIDDLE — NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">

          <a className="text-gray-700 hover:text-blue-600" href="/">Home</a>
          <a className="text-gray-700 hover:text-blue-600" href="/walkin">Walkins</a>
          <a className="text-gray-700 hover:text-blue-600" href="/companies">Companies</a>
          <a className="text-gray-700 hover:text-blue-600" href="/jobs">Jobs</a>

          {/* RESOURCES - dropdown */}
          <div ref={resourcesRef} className="relative">
            <button
              onClick={() => setResourcesOpen((s) => !s)}
              onKeyDown={(e) => { if (e.key === "Escape") setResourcesOpen(false); }}
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
              className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              Resources
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* dropdown */}
            {resourcesOpen && (
              <div
                role="menu"
                aria-label="Resources"
                className="absolute left-0 mt-3 w-64 bg-white rounded-lg shadow-lg border z-50"
              >
                <div className="py-2">
                  {resources.map((r) => (
                    <a
                      key={r.label}
                      href={r.href}
                      role="menuitem"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      {/* small icon circle */}
                      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 font-medium text-sm">
                        {r.label.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{r.label}</div>
                        <div className="text-xs text-gray-500">{r.hint}</div>
                      </div>

                      <div className="text-xs text-gray-400">→</div>
                    </a>
                  ))}

                  <div className="border-t mt-2 pt-2 px-3 text-xs text-gray-500">
                    Pro tip: Use the ATS Checker after updating your resume.
                  </div>
                </div>
              </div>
            )}
          </div>

          <a className="text-gray-700 hover:text-blue-600" href="/contact">Contact</a>
        </div>

        {/* RIGHT — ICONS (3 icons: Search, Saved, Profile) */}
        <div className="flex items-center gap-6">

          {/* Search 
          <button className="hover:text-blue-600" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>*/}
          <Link
            to="/jobs" // Use 'to' prop for the destination route
            className="hover:text-blue-600"
            aria-label="Go to Jobs Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Saved Jobs */}
          <button className="relative hover:text-blue-600" aria-label="Saved jobs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
              />
            </svg>

            {/* Saved Count Badge */}
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile */}
          <a href="/login" aria-label="Login Page">
            <button className="hover:text-blue-600" aria-label="Profile">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </button>
          </a>


          {/* Mobile Menu */}
          <button className="md:hidden hover:text-blue-600" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>
    </nav>
  );
}
