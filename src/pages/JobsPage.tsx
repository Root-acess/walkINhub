// src/pages/JobsPage.tsx
import React, { useEffect, useMemo, useState, type JSX } from "react";
import {
  Search,
  MapPin,
  Clock,
  Bookmark,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------
   Types
------------------------- */
export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  city: string;
  postedAt: string; // ISO date
  experience?: string; // e.g. "Fresher", "0-2 years"
  salary?: string;
  type?: "Walk-In" | "Full-Time" | "Part-Time" | "Internship" | "Contract";
  tags?: string[]; // skills, roles
  description?: string;
  venue?: string; // for walk-ins
  applyLink?: string;
};

/* -------------------------
   Mock data (replace with real API)
------------------------- */
function makeDateOffset(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

const MOCK_JOBS: Job[] = [
  {
    id: "job-001",
    title: "Junior Software Developer",
    company: "TCS",
    location: "Chennai",
    city: "Chennai",
    postedAt: makeDateOffset(0),
    experience: "0–1 year",
    salary: "₹25,000 – ₹40,000",
    type: "Walk-In",
    tags: ["Java", "DSA", "OOP"],
    description:
      "Hiring freshers with good understanding of data structures and algorithms. On-site interview — bring resume.",
    venue: "TCS IT Park, Sholinganallur",
    applyLink: "mailto:careers@tcs.com",
  },
  {
    id: "job-002",
    title: "Tech Support Executive",
    company: "HCL Technologies",
    location: "Hyderabad",
    city: "Hyderabad",
    postedAt: makeDateOffset(1),
    experience: "0–2 years",
    salary: "₹15,000 – ₹22,000",
    type: "Walk-In",
    tags: ["Customer Support", "Troubleshooting"],
    description:
      "Voice process. Good communication required. On-the-spot interviews, carry ID & resume.",
    venue: "HCL Campus, Madhapur",
    applyLink: "mailto:hr@hcl.com",
  },
  {
    id: "job-003",
    title: "Frontend Developer (React)",
    company: "Freshworks",
    location: "Bengaluru",
    city: "Bengaluru",
    postedAt: makeDateOffset(2),
    experience: "1–3 years",
    salary: "₹45,000 – ₹80,000",
    type: "Full-Time",
    tags: ["React", "TypeScript", "CSS"],
    description: "Build customer-facing web apps using React and TypeScript.",
    applyLink: "https://jobs.freshworks.com/123",
  },
  {
    id: "job-004",
    title: "HR Recruitment Associate",
    company: "Infosys",
    location: "Bangalore",
    city: "Bengaluru",
    postedAt: makeDateOffset(3),
    experience: "0–3 years",
    salary: "₹18,000 – ₹26,000",
    type: "Walk-In",
    tags: ["Recruitment", "Coordination"],
    description: "Manage screening and interview coordination.",
    venue: "Infosys, Electronic City",
    applyLink: "mailto:recruitment@infosys.com",
  },
  {
    id: "job-005",
    title: "Data Analyst",
    company: "DataPulse",
    location: "Pune",
    city: "Pune",
    postedAt: makeDateOffset(5),
    experience: "1–3 years",
    salary: "₹35,000 – ₹60,000",
    type: "Full-Time",
    tags: ["SQL", "Excel", "Power BI"],
    description: "Analyze datasets and build dashboards for clients.",
    applyLink: "https://datapulse.example/apply/5",
  },
  {
    id: "job-006",
    title: "Customer Support (Voice)",
    company: "Tech Mahindra",
    location: "Pune",
    city: "Pune",
    postedAt: makeDateOffset(7),
    experience: "0–2 years",
    salary: "₹16,000 – ₹24,000",
    type: "Walk-In",
    tags: ["Voice", "Support"],
    description: "Voice process for product support.",
    venue: "Tech Mahindra Office, Phase 3",
    applyLink: "mailto:hr@techmahindra.com",
  },
  // add more mock jobs here — the component supports pagination
];

/* -------------------------
   Helper utilities
------------------------- */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* -------------------------
   UI Subcomponents
------------------------- */

const StatCard: React.FC<{ title: string; value: string | number; sub?: string }> = ({ title, value, sub }) => (
  <div className="bg-white rounded-lg shadow-sm border p-4 flex-1 min-w-40">
    <div className="text-xs text-gray-500">{title}</div>
    <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
    {sub && <div className="text-sm text-gray-500 mt-1">{sub}</div>}
  </div>
);

/* Job Card */
const JobCard: React.FC<{
  job: Job;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onOpen: (job: Job) => void;
}> = ({ job, saved, onToggleSave, onOpen }) => {
  const initials = job.company
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-base">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <div className="text-sm text-blue-600 font-medium">{job.company}</div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> <span>{job.location}</span>
                <span className="mx-1">·</span>
                <Clock className="w-3 h-3" /> <span>{formatDate(job.postedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              aria-pressed={saved}
              aria-label={saved ? "Unsave job" : "Save job"}
              onClick={() => onToggleSave(job.id)}
              className="p-2 rounded-md border hover:bg-gray-50"
            >
              <Bookmark className={`w-4 h-4 ${saved ? "text-pink-500" : "text-gray-400"}`} />
            </button>
            <div className="text-sm text-gray-700 font-semibold">{job.salary ?? "—"}</div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-700 line-clamp-3">{job.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags?.slice(0, 4).map((t) => (
            <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2 items-center">
        <button onClick={() => onOpen(job)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">
          View Details
        </button>

        <a
          href={job.applyLink ?? "#"}
          target={job.applyLink?.startsWith("http") ? "_blank" : undefined}
          rel={job.applyLink?.startsWith("http") ? "noreferrer" : undefined}
          className="px-3 py-2 border rounded-md text-sm flex items-center gap-2 hover:bg-gray-50"
        >
          <ExternalLink className="w-4 h-4" />
          Apply
        </a>
      </div>
    </article>
  );
};

/* Details Modal */
const JobDetailsModal: React.FC<{ job?: Job; onClose: () => void }> = ({ job, onClose }) => {
  if (!job) return null;
  const venueOrLocation = job.venue ?? job.location;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} transition={{ duration: 0.18 }} className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-10">
          <header className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
              <div className="text-sm text-blue-600">{job.company}</div>
              <div className="text-xs text-gray-500 mt-1">{formatDate(job.postedAt)} • {job.experience ?? "Experience N/A"}</div>
            </div>
            <button onClick={onClose} className="text-sm text-gray-500">Close</button>
          </header>

          <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">About</h4>
              <p className="text-sm text-gray-700 mt-1">{job.description}</p>

              {job.venue && (
                <>
                  <h4 className="text-sm font-medium text-gray-700 mt-4">Venue</h4>
                  <p className="text-sm text-gray-700 mt-1">{job.venue}</p>
                </>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Role details</h4>
              <ul className="mt-1 text-sm text-gray-700 space-y-1">
                <li><strong>Type:</strong> {job.type ?? "—"}</li>
                <li><strong>Salary:</strong> {job.salary ?? "—"}</li>
                <li><strong>Location:</strong> {job.location}</li>
                <li><strong>Apply:</strong> {job.applyLink ? <a href={job.applyLink} className="text-blue-600" target="_blank" rel="noreferrer">Apply link</a> : "—"}</li>
              </ul>
            </div>
          </section>

          <footer className="mt-6 flex justify-end gap-3">
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(venueOrLocation)}`} target="_blank" rel="noreferrer" className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Directions
            </a>
            <a href={job.applyLink ?? "#"} target={job.applyLink?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Apply Now
            </a>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* -------------------------
   Main Page
------------------------- */
export default function JobsPage(): JSX.Element {
  const data = useMemo(() => MOCK_JOBS, []);

  // filters & UI state
  const [keyword, setKeyword] = useState<string>("");
  const [city, setCity] = useState<string>("All");
  const [exp, setExp] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "salary-high" | "salary-low">("newest");

  // pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // saved jobs
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);

  // load saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem("jobs.saved");
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("jobs.saved", JSON.stringify(saved));
    } catch {
      // ignore
    }
  }, [saved]);

  // small debounce for keyword (improves UX when typing)
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(keyword);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 250);
    return () => clearTimeout(t);
  }, [keyword]);

  // lists for filters
  const cities = useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.city)))], [data]);
  const exps = ["All", "Fresher", "0–1 year", "0–2 years", "1–3 years", "3+ years"];
  const types = ["All", "Walk-In", "Full-Time", "Part-Time", "Internship", "Contract"];

  // filtered & sorted jobs
  const filteredJobs = useMemo(() => {
    let rows = data.slice();

    const q = debouncedKeyword.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) => {
        const hay = `${r.title} ${r.company} ${r.tags?.join(" ") ?? ""} ${r.description ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (city !== "All") rows = rows.filter((r) => r.city === city);
    if (exp !== "All") rows = rows.filter((r) => (r.experience ?? "").includes(exp.replace(" years", "").replace("year", "")) || exp === "Fresher");
    if (type !== "All") rows = rows.filter((r) => r.type === type);

    if (sort === "newest") rows.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    if (sort === "oldest") rows.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
    if (sort === "salary-high") {
      rows.sort((a, b) => (parseSalary(b.salary) - parseSalary(a.salary)));
    }
    if (sort === "salary-low") {
      rows.sort((a, b) => (parseSalary(a.salary) - parseSalary(b.salary)));
    }

    return rows;
  }, [data, debouncedKeyword, city, exp, type, sort]);

  // pagination helpers
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const pageJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // helpers
  function toggleSave(id: string) {
    setSaved((s) => ({ ...s, [id]: !s[id] }));
  }

  function parseSalary(s?: string): number {
    if (!s) return 0;
    // rough parsing: extract numbers and average
    const nums = Array.from(s.matchAll(/(\d{1,3}(?:,\d{3})*|\d+)/g)).map((m) => Number(m[0].replace(/,/g, "")));
    if (nums.length === 0) return 0;
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg;
  }

  // KPIs
  const totalJobs = data.length;
  const numWalkIns = data.filter((j) => j.type === "Walk-In").length;
  const avgSalary = Math.round(filteredJobs.reduce((s, j) => s + parseSalary(j.salary), 0) / Math.max(1, filteredJobs.length));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Jobs — Walkins & Openings</h1>
          <p className="text-sm text-gray-600 mt-1">Find verified walk-ins, full-time roles and internships — updated frequently.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <StatCard title="Total jobs" value={totalJobs} />
          <StatCard title="Walkins" value={numWalkIns} />
          <StatCard title="Avg salary" value={avgSalary ? `₹${Intl.NumberFormat().format(avgSalary)}` : "—"} />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2 w-full md:w-96">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                placeholder="Search roles, companies, skills"
                className="bg-transparent focus:outline-none w-full text-sm"
                aria-label="Search jobs"
              />
            </div>

            <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} className="border rounded-md px-3 py-2 text-sm">
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select value={exp} onChange={(e) => { setExp(e.target.value); setPage(1); }} className="border rounded-md px-3 py-2 text-sm">
              {exps.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="border rounded-md px-3 py-2 text-sm">
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="border rounded-md px-3 py-2 text-sm">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="salary-high">Salary High → Low</option>
              <option value="salary-low">Salary Low → High</option>
            </select>

            <div className="text-sm text-gray-600">Rows:</div>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded-md px-2 py-1 text-sm">
              {[6, 12, 24].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <button onClick={() => { setKeyword(""); setCity("All"); setExp("All"); setType("All"); setSort("newest"); setPage(1); }} className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
              <ArrowUpDown className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Jobs grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {pageJobs.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-600">No jobs found. Try different filters or keywords.</div>
        ) : (
          pageJobs.map((job) => (
            <JobCard key={job.id} job={job} saved={!!saved[job.id]} onToggleSave={toggleSave} onOpen={(j) => setSelectedJob(j)} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredJobs.length)} of {filteredJobs.length} jobs</div>

        <div className="flex items-center gap-2">
          <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">First</button>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
          <div className="px-3 text-sm">{page} / {totalPages}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Last</button>
        </div>
      </div>

      {/* Details modal */}
      <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(undefined)} />
    </div>
  );
}
